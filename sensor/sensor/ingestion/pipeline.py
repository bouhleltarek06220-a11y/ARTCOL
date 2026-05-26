"""Orchestration de l'ingestion : load → chunk → embed → store.

L'ingestion est idempotente : un document inchangé (même hash de contenu) est
ignoré ; un document modifié voit ses anciens chunks supprimés avant ré-insertion.
Une barre de progression `rich` accompagne le traitement.
"""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

from loguru import logger
from rich.console import Console
from rich.progress import BarColumn, Progress, SpinnerColumn, TextColumn

from sensor.config import Settings, get_settings
from sensor.embedders.base import BaseEmbedder, construire_embedder
from sensor.ingestion import loaders
from sensor.ingestion.chunker import chunker_texte
from sensor.ingestion.crawler import crawler_site
from sensor.ingestion.loaders import ContenuCharge
from sensor.models import ClientConfig, Document, TypeDocument
from sensor.vectorstore.base import BaseVectorStore, construire_vectorstore


@dataclass
class ResultatIngestion:
    source: str
    titre: str
    statut: str  # "ingéré", "à jour", "erreur"
    nb_chunks: int = 0
    detail: str = ""


class SensorPipeline:
    """Pipeline d'ingestion pour un client donné.

    À fermer après usage (close) pour libérer les connexions de la base vectorielle.
    """

    def __init__(
        self,
        config: ClientConfig,
        settings: Settings | None = None,
        console: Console | None = None,
    ) -> None:
        self.config = config
        self.settings = settings or get_settings()
        self.console = console or Console()
        self.embedder: BaseEmbedder = construire_embedder(config, self.settings)
        self.store: BaseVectorStore = construire_vectorstore(
            config, self.settings, dimension=self.embedder.dimension
        )

    # -- API publique ------------------------------------------------------

    def ingerer_chemin(self, chemin: str | Path) -> list[ResultatIngestion]:
        """Ingère un fichier ou tous les fichiers supportés d'un dossier."""
        fichiers = loaders.lister_fichiers(Path(chemin))
        if not fichiers:
            self.console.print(
                f"[yellow]Aucun fichier supporté trouvé dans {chemin}.[/yellow]"
            )
            return []
        resultats: list[ResultatIngestion] = []
        with self._barre("Ingestion de documents", total=len(fichiers)) as (progress, task):
            for fichier in fichiers:
                resultats.append(self._ingerer_fichier(fichier))
                progress.advance(task)
        self._resume(resultats)
        return resultats

    def ingerer_url(
        self, url: str, profondeur_max: int = 2, max_pages: int = 50
    ) -> list[ResultatIngestion]:
        """Crawl le site public du client et ingère les pages collectées."""
        self.console.print(f"[cyan]Crawl de {url} (profondeur {profondeur_max})…[/cyan]")
        pages = crawler_site(url, profondeur_max=profondeur_max, max_pages=max_pages)
        if not pages:
            self.console.print("[yellow]Aucune page collectée.[/yellow]")
            return []
        resultats: list[ResultatIngestion] = []
        with self._barre("Ingestion des pages web", total=len(pages)) as (progress, task):
            for page in pages:
                contenu = ContenuCharge(
                    titre=page.titre, type=TypeDocument.WEB, texte=page.texte
                )
                resultats.append(self._ingerer_contenu(page.url, contenu))
                progress.advance(task)
        self._resume(resultats)
        return resultats

    def reindexer(self) -> list[ResultatIngestion]:
        """Reconstruit la base vectorielle à partir des sources connues.

        Utile après un changement d'embedder ou de paramètres de chunking : on
        ré-ingère chaque source (fichier toujours présent ou page web re-téléchargée).
        """
        documents = self.store.list_documents()
        if not documents:
            self.console.print("[yellow]Aucun document à réindexer.[/yellow]")
            return []
        self.console.print(
            f"[cyan]Réindexation de {len(documents)} document(s)…[/cyan]"
        )
        self.store.reset()
        resultats: list[ResultatIngestion] = []
        for doc in documents:
            if doc.type == TypeDocument.WEB:
                resultats.extend(self._reingerer_page_web(doc.source))
            else:
                chemin = Path(doc.source)
                if chemin.exists():
                    resultats.append(self._ingerer_fichier(chemin))
                else:
                    resultats.append(
                        ResultatIngestion(
                            source=doc.source,
                            titre=doc.titre,
                            statut="erreur",
                            detail="Fichier source introuvable pour la réindexation.",
                        )
                    )
        self._resume(resultats)
        return resultats

    # -- Cœur d'ingestion --------------------------------------------------

    def _ingerer_fichier(self, chemin: Path) -> ResultatIngestion:
        try:
            contenu = loaders.charger_fichier(chemin)
        except Exception as exc:  # noqa: BLE001 — on isole l'échec d'un fichier
            logger.error("Échec de chargement de {} : {}", chemin, exc)
            return ResultatIngestion(
                source=str(chemin), titre=chemin.name, statut="erreur", detail=str(exc)
            )
        return self._ingerer_contenu(str(chemin), contenu)

    def _reingerer_page_web(self, url: str) -> list[ResultatIngestion]:
        # Re-télécharge uniquement la page concernée (profondeur 0).
        pages = crawler_site(url, profondeur_max=0, max_pages=1)
        if not pages:
            return [
                ResultatIngestion(
                    source=url, titre=url, statut="erreur", detail="Page inaccessible."
                )
            ]
        page = pages[0]
        contenu = ContenuCharge(titre=page.titre, type=TypeDocument.WEB, texte=page.texte)
        return [self._ingerer_contenu(url, contenu)]

    def _ingerer_contenu(self, source: str, contenu: ContenuCharge) -> ResultatIngestion:
        id_document = Document.calculer_id(self.config.id_client, source)
        nouveau_hash = Document.calculer_hash(contenu.texte)
        ancien_hash = self.store.get_document_hash(id_document)

        if ancien_hash == nouveau_hash:
            return ResultatIngestion(
                source=source, titre=contenu.titre, statut="à jour", detail="contenu inchangé"
            )

        document = Document(
            id=id_document,
            id_client=self.config.id_client,
            titre=contenu.titre,
            type=contenu.type,
            source=source,
            hash=nouveau_hash,
        )
        chunks = chunker_texte(document, contenu.texte)
        if not chunks:
            return ResultatIngestion(
                source=source, titre=contenu.titre, statut="erreur", detail="aucun chunk produit"
            )

        # Idempotence : on remplace les anciens chunks de ce document.
        if ancien_hash is not None:
            self.store.delete_document(id_document)

        embeddings = self.embedder.embed_documents([c.texte for c in chunks])
        self.store.add_chunks(chunks, embeddings)
        document.nb_chunks = len(chunks)
        self.store.upsert_document(document)

        statut = "ingéré" if ancien_hash is None else "ingéré"
        logger.info(
            "Document {} : {} chunks ({}).", contenu.titre, len(chunks),
            "nouveau" if ancien_hash is None else "mis à jour",
        )
        return ResultatIngestion(
            source=source,
            titre=contenu.titre,
            statut=statut,
            nb_chunks=len(chunks),
            detail="nouveau" if ancien_hash is None else "mis à jour",
        )

    # -- Utilitaires console ----------------------------------------------

    def _barre(self, libelle: str, total: int):
        progress = Progress(
            SpinnerColumn(),
            TextColumn("[progress.description]{task.description}"),
            BarColumn(),
            TextColumn("{task.completed}/{task.total}"),
            console=self.console,
        )

        class _Ctx:
            def __enter__(_self):
                progress.start()
                task = progress.add_task(libelle, total=total)
                return progress, task

            def __exit__(_self, *exc):
                progress.stop()
                return False

        return _Ctx()

    def _resume(self, resultats: list[ResultatIngestion]) -> None:
        ingeres = sum(1 for r in resultats if r.statut == "ingéré")
        a_jour = sum(1 for r in resultats if r.statut == "à jour")
        erreurs = sum(1 for r in resultats if r.statut == "erreur")
        total_chunks = sum(r.nb_chunks for r in resultats)
        self.console.print(
            f"[green]Terminé[/green] — {ingeres} ingéré(s), {a_jour} à jour, "
            f"{erreurs} erreur(s), {total_chunks} chunks au total."
        )
        for r in resultats:
            if r.statut == "erreur":
                self.console.print(f"  [red]✗[/red] {r.titre} : {r.detail}")

    def close(self) -> None:
        self.store.close()
