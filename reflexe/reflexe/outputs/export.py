"""Export des prospects en CSV et JSON, avec provenance traçable.

Le CSV est destiné à l'usage opérationnel (ouverture tableur) ; le JSON conserve
l'intégralité de la fiche (dont la provenance par champ) pour la traçabilité.
"""

from __future__ import annotations

import csv
import json
from pathlib import Path

from reflexe.models import Prospect

_COLONNES = [
    "id",
    "siren",
    "siret",
    "raison_sociale",
    "naf",
    "libelle_naf",
    "ville",
    "code_postal",
    "departement",
    "tranche_effectif",
    "site_web",
    "prenom",
    "nom_dirigeant",
    "role",
    "email",
    "email_verifie",
    "email_source",
    "telephone",
    "linkedin_entreprise_public",
    "score_icp",
    "justification_score",
    "statut_pipeline",
    "message_genere",
    "tags",
    "provenance",
]


def _ligne(p: Prospect) -> dict[str, str]:
    e = p.entreprise
    return {
        "id": p.id,
        "siren": e.siren,
        "siret": e.siret,
        "raison_sociale": e.raison_sociale,
        "naf": e.naf,
        "libelle_naf": e.libelle_naf,
        "ville": e.ville,
        "code_postal": e.code_postal,
        "departement": e.departement,
        "tranche_effectif": e.tranche_effectif,
        "site_web": e.site_web,
        "prenom": p.prenom,
        "nom_dirigeant": p.nom_dirigeant,
        "role": p.role,
        "email": p.email,
        "email_verifie": "oui" if p.email_verifie else "non",
        "email_source": p.email_source,
        "telephone": p.telephone,
        "linkedin_entreprise_public": p.linkedin_entreprise_public,
        "score_icp": str(p.score_icp),
        "justification_score": p.justification_score,
        "statut_pipeline": p.statut_pipeline.value,
        "message_genere": p.message_genere,
        "tags": ", ".join(p.tags),
        "provenance": json.dumps(p.provenance, ensure_ascii=False),
    }


def exporter_csv(prospects: list[Prospect], chemin: str | Path) -> Path:
    chemin = Path(chemin)
    chemin.parent.mkdir(parents=True, exist_ok=True)
    with chemin.open("w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=_COLONNES)
        writer.writeheader()
        for p in prospects:
            writer.writerow(_ligne(p))
    return chemin


def exporter_json(prospects: list[Prospect], chemin: str | Path) -> Path:
    chemin = Path(chemin)
    chemin.parent.mkdir(parents=True, exist_ok=True)
    donnees = [p.model_dump(mode="json") for p in prospects]
    chemin.write_text(
        json.dumps(donnees, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    return chemin


def exporter(
    prospects: list[Prospect],
    dossier: str | Path,
    job_id: str,
    format: str = "csv",
) -> list[Path]:
    """Exporte au(x) format(s) demandé(s) : 'csv', 'json' ou 'csv,json'."""
    dossier = Path(dossier)
    formats = {f.strip().lower() for f in format.split(",") if f.strip()}
    chemins: list[Path] = []
    if "csv" in formats:
        chemins.append(exporter_csv(prospects, dossier / f"{job_id}.csv"))
    if "json" in formats:
        chemins.append(exporter_json(prospects, dossier / f"{job_id}.json"))
    return chemins
