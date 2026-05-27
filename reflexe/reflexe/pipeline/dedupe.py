"""Détection et fusion des doublons.

Critères : même SIREN (clé principale d'entreprise) ou même email. La fusion
remplit les champs vides d'une fiche à partir de l'autre, combine tags et
provenance, et conserve la meilleure information disponible.
"""

from __future__ import annotations

from reflexe.models import Entreprise, Prospect


def _fusionner_entreprise(a: Entreprise, b: Entreprise) -> Entreprise:
    for champ in (
        "siret",
        "raison_sociale",
        "naf",
        "libelle_naf",
        "adresse",
        "code_postal",
        "ville",
        "departement",
        "tranche_effectif",
        "date_creation",
        "site_web",
        "telephone",
    ):
        if not getattr(a, champ) and getattr(b, champ):
            setattr(a, champ, getattr(b, champ))
    a.score_confiance = max(a.score_confiance, b.score_confiance)
    return a


def _fusionner(a: Prospect, b: Prospect) -> Prospect:
    """Complète `a` avec les informations de `b` (a est la fiche conservée)."""
    _fusionner_entreprise(a.entreprise, b.entreprise)
    for champ in (
        "nom_dirigeant",
        "prenom",
        "role",
        "email",
        "email_source",
        "telephone",
        "linkedin_entreprise_public",
        "justification_score",
        "message_genere",
    ):
        if not getattr(a, champ) and getattr(b, champ):
            setattr(a, champ, getattr(b, champ))
    a.email_verifie = a.email_verifie or b.email_verifie
    a.score_icp = max(a.score_icp, b.score_icp)
    a.tags = sorted(set(a.tags) | set(b.tags))
    fusion_prov = dict(b.provenance)
    fusion_prov.update(a.provenance)  # priorité à la provenance de a
    a.provenance = fusion_prov
    return a


def dedupliquer(prospects: list[Prospect]) -> tuple[list[Prospect], int]:
    """Renvoie (prospects dédupliqués, nombre de fusions effectuées)."""
    par_cle: dict[str, Prospect] = {}
    index_email: dict[str, str] = {}
    fusions = 0

    for p in prospects:
        cle = p.entreprise.siren or p.id
        email = (p.email or "").strip().lower()
        if email and email in index_email:
            cle = index_email[email]
        if cle in par_cle:
            par_cle[cle] = _fusionner(par_cle[cle], p)
            fusions += 1
        else:
            par_cle[cle] = p
        if email:
            index_email[email] = cle

    return list(par_cle.values()), fusions
