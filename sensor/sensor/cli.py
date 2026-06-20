"""Interface en ligne de commande SENSOR (typer + rich).

Commandes : init-client, ingest, reindex, serve, stats, ask, purge, supabase-sql.
Chaque commande affiche une progression claire et des messages explicites.
"""

from __future__ import annotations

from pathlib import Path

import typer
from rich.console import Console
from rich.panel import Panel
from rich.table import Table

from sensor.config import (
    charger_config_client,
    get_settings,
    lister_clients,
    sauvegarder_config_client,
)
from sensor.models import ActionRepli, ClientConfig

app = typer.Typer(
    help="SENSOR — Assistant client RAG zéro-hallucination, multi-tenant.",
    no_args_is_help=True,
    add_completion=False,
)
console = Console()


@app.command("init-client")
def init_client(
    id: str = typer.Option(..., "--id", help="Identifiant unique du client (slug)."),
    nom: str = typer.Option(..., "--nom", help="Nom de l'entreprise."),
    langue: str = typer.Option("fr", "--langue", help="Langue principale."),
    embedder: str = typer.Option("local", "--embedder", help="local | api"),
    vectorstore: str = typer.Option("sqlite", "--vectorstore", help="sqlite | supabase"),
    email_contact: str = typer.Option(
        None, "--email-contact", help="Email de repli proposé quand l'info manque."
    ),
    force: bool = typer.Option(False, "--force", help="Écrase une config existante."),
) -> None:
    """Crée un fichier de configuration client à partir du modèle."""
    settings = get_settings()
    chemin = settings.chemin_config_client(id)
    if chemin.exists() and not force:
        console.print(
            f"[red]La config {chemin} existe déjà.[/red] Utilisez --force pour l'écraser."
        )
        raise typer.Exit(code=1)
    try:
        config = ClientConfig(
            id_client=id,
            nom_entreprise=nom,
            langue=langue,
            embedder=embedder,  # type: ignore[arg-type]
            vectorstore=vectorstore,  # type: ignore[arg-type]
            action_repli=ActionRepli(email=email_contact),
        )
    except Exception as exc:  # noqa: BLE001
        console.print(f"[red]Configuration invalide :[/red] {exc}")
        raise typer.Exit(code=1) from exc
    chemin = sauvegarder_config_client(config, settings)
    console.print(
        Panel.fit(
            f"[green]Client créé[/green]\n"
            f"Fichier : {chemin}\n"
            f"Embedder : {embedder}  |  Vectorstore : {vectorstore}\n\n"
            f"Prochaine étape :\n"
            f"  sensor ingest --client {id} --path <dossier_ou_fichier>",
            title="init-client",
        )
    )


@app.command("ingest")
def ingest(
    client: str = typer.Option(..., "--client", help="Identifiant du client."),
    path: str = typer.Option(None, "--path", help="Fichier ou dossier local à ingérer."),
    url: str = typer.Option(None, "--url", help="URL du site public à crawler."),
    profondeur: int = typer.Option(2, "--profondeur", help="Profondeur de crawl (URL)."),
    max_pages: int = typer.Option(50, "--max-pages", help="Plafond de pages crawlées."),
) -> None:
    """Ingère des documents locaux (--path) ou le site public du client (--url)."""
    if not path and not url:
        console.print("[red]Fournir --path ou --url.[/red]")
        raise typer.Exit(code=1)
    from sensor.ingestion.pipeline import SensorPipeline

    settings = get_settings()
    config = _charger_ou_quitter(client, settings)
    pipeline = SensorPipeline(config, settings, console=console)
    try:
        if path:
            pipeline.ingerer_chemin(Path(path))
        if url:
            pipeline.ingerer_url(url, profondeur_max=profondeur, max_pages=max_pages)
    finally:
        pipeline.close()


@app.command("reindex")
def reindex(
    client: str = typer.Option(..., "--client", help="Identifiant du client."),
) -> None:
    """Reconstruit la base vectorielle à partir des sources connues."""
    from sensor.ingestion.pipeline import SensorPipeline

    settings = get_settings()
    config = _charger_ou_quitter(client, settings)
    pipeline = SensorPipeline(config, settings, console=console)
    try:
        pipeline.reindexer()
    finally:
        pipeline.close()


@app.command("serve")
def serve(
    host: str = typer.Option(None, "--host", help="Adresse d'écoute (défaut .env)."),
    port: int = typer.Option(None, "--port", help="Port (défaut .env)."),
    reload: bool = typer.Option(False, "--reload", help="Rechargement auto (dev)."),
) -> None:
    """Lance l'API FastAPI via uvicorn."""
    import uvicorn

    settings = get_settings()
    console.print(
        f"[cyan]Démarrage de l'API SENSOR sur "
        f"http://{host or settings.host}:{port or settings.port}[/cyan]"
    )
    uvicorn.run(
        "sensor.api.main:app",
        host=host or settings.host,
        port=port or settings.port,
        reload=reload,
    )


@app.command("ask")
def ask(
    client: str = typer.Option(..., "--client", help="Identifiant du client."),
    question: str = typer.Argument(..., help="Question à poser à l'assistant."),
) -> None:
    """Pose une question de bout en bout depuis la console (test rapide)."""
    from sensor.api.deps import construire_engine

    settings = _verifier_anthropic()
    _charger_ou_quitter(client, settings)
    engine = construire_engine(client, settings)
    try:
        reponse = engine.traiter(question, id_session=None)
    finally:
        engine.close()

    couleur = "yellow" if reponse.hors_scope else "green"
    console.print(Panel(reponse.reponse, title=f"Réponse ({couleur})", border_style=couleur))
    if reponse.sources:
        table = Table(title="Sources citées")
        table.add_column("Document")
        table.add_column("Section")
        table.add_column("Score", justify="right")
        for s in reponse.sources:
            table.add_row(s.titre_document, s.section or "—", f"{s.score:.3f}")
        console.print(table)
    console.print(
        f"[dim]tokens in/out : {reponse.tokens_input}/{reponse.tokens_output} — "
        f"coût estimé : ${reponse.cout_estime_usd:.5f}[/dim]"
    )


@app.command("stats")
def stats(
    client: str = typer.Option(..., "--client", help="Identifiant du client."),
) -> None:
    """Affiche les statistiques d'usage d'un client (table rich)."""
    from sensor.api.deps import construire_engine

    settings = get_settings()
    _charger_ou_quitter(client, settings)
    engine = construire_engine(client, settings)
    try:
        s = engine.analytics.statistiques()
        nb_conv = engine.conversations.compter_conversations()
        nb_docs = len(engine.store.list_documents())
        nb_chunks = engine.store.count_chunks()
    finally:
        engine.close()

    table = Table(title=f"Statistiques — {client}")
    table.add_column("Métrique")
    table.add_column("Valeur", justify="right")
    table.add_row("Documents", str(nb_docs))
    table.add_row("Chunks indexés", str(nb_chunks))
    table.add_row("Conversations", str(nb_conv))
    table.add_row("Questions", str(s["nb_questions"]))
    table.add_row("Répondues", str(s["nb_repondues"]))
    table.add_row("Hors-scope", str(s["nb_hors_scope"]))
    table.add_row("Taux de réponse", f"{s['taux_reponse'] * 100:.1f}%")
    table.add_row("Coût total", f"${s['cout_total_usd']:.4f}")
    table.add_row("Durée moyenne", f"{s['duree_moyenne_ms']:.0f} ms")
    console.print(table)

    if s["top_questions_sans_reponse"]:
        top = Table(title="Top questions sans réponse (à enrichir dans la base)")
        top.add_column("Question")
        top.add_column("Occurrences", justify="right")
        for q in s["top_questions_sans_reponse"]:
            top.add_row(q["question"], str(q["occurrences"]))
        console.print(top)


@app.command("purge")
def purge(
    client: str = typer.Option(..., "--client", help="Identifiant du client."),
) -> None:
    """Purge les conversations expirées (RGPD) d'un client."""
    from sensor.api.deps import construire_engine

    settings = get_settings()
    _charger_ou_quitter(client, settings)
    engine = construire_engine(client, settings)
    try:
        nb = engine.conversations.purger_expirees()
    finally:
        engine.close()
    console.print(f"[green]{nb} conversation(s) expirée(s) purgée(s).[/green]")


@app.command("supabase-sql")
def supabase_sql(
    dimension: int = typer.Option(
        384, "--dim", help="Dimension des embeddings (384 local, 1024 Voyage)."
    ),
) -> None:
    """Affiche le SQL à exécuter une fois dans Supabase pour préparer pgvector."""
    from sensor.vectorstore.supabase_store import SQL_INSTALLATION

    console.print(SQL_INSTALLATION.replace("{DIM}", str(dimension)))


@app.command("clients")
def clients() -> None:
    """Liste les clients configurés."""
    noms = lister_clients()
    if not noms:
        console.print("[yellow]Aucun client configuré.[/yellow]")
        return
    for n in noms:
        console.print(f"• {n}")


# --- Helpers internes -----------------------------------------------------

def _charger_ou_quitter(id_client: str, settings) -> ClientConfig:
    try:
        return charger_config_client(id_client, settings)
    except FileNotFoundError as exc:
        console.print(f"[red]{exc}[/red]")
        raise typer.Exit(code=1) from exc
    except Exception as exc:  # noqa: BLE001
        console.print(f"[red]Config invalide pour {id_client} :[/red] {exc}")
        raise typer.Exit(code=1) from exc


def _verifier_anthropic():
    settings = get_settings()
    if not settings.anthropic_api_key:
        console.print(
            "[red]ANTHROPIC_API_KEY absente du .env.[/red] Indispensable pour générer une réponse."
        )
        raise typer.Exit(code=1)
    return settings


if __name__ == "__main__":
    app()
