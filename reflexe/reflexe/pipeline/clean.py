"""Normalisation et vérification des données collectées.

Téléphone, email, adresse, nom, NAF : mise en forme cohérente. Vérification
d'email locale (syntaxe + enregistrement MX du domaine) et déduction de pattern
`prenom.nom@domaine`. Aucune dépendance réseau payante : MX via DNS standard.
"""

from __future__ import annotations

import re
import unicodedata

import dns.resolver
from email_validator import EmailNotValidError, validate_email

from reflexe.models import Prospect


def _sans_accents(texte: str) -> str:
    nfkd = unicodedata.normalize("NFKD", texte)
    return "".join(c for c in nfkd if not unicodedata.combining(c))


def normaliser_telephone(brut: str) -> str:
    """Met un numéro français au format `0X XX XX XX XX` (sinon renvoie nettoyé)."""
    if not brut:
        return ""
    chiffres = re.sub(r"[^\d+]", "", brut)
    if chiffres.startswith("+33"):
        chiffres = "0" + chiffres[3:]
    elif chiffres.startswith("0033"):
        chiffres = "0" + chiffres[4:]
    chiffres = re.sub(r"\D", "", chiffres)
    if len(chiffres) == 10 and chiffres.startswith("0"):
        return " ".join(chiffres[i : i + 2] for i in range(0, 10, 2))
    return chiffres


def normaliser_email(brut: str) -> str:
    return (brut or "").strip().lower()


def normaliser_nom(brut: str) -> str:
    brut = re.sub(r"\s+", " ", (brut or "").strip())
    return brut.title() if brut else ""


def normaliser_naf(brut: str) -> str:
    code = (brut or "").strip().upper()
    if re.fullmatch(r"\d{4}[A-Z]", code):
        return f"{code[:2]}.{code[2:4]}{code[4]}"
    return code


def normaliser_adresse(brut: str) -> str:
    return re.sub(r"\s+", " ", (brut or "").strip())


def verifier_syntaxe_email(email: str) -> bool:
    try:
        validate_email(email, check_deliverability=False)
        return True
    except EmailNotValidError:
        return False


def verifier_mx(domaine: str) -> bool:
    """Vrai si le domaine possède au moins un enregistrement MX (fonction bloquante)."""
    domaine = (domaine or "").strip().lower()
    if not domaine:
        return False
    try:
        reponses = dns.resolver.resolve(domaine, "MX")
        return len(reponses) > 0
    except Exception:  # noqa: BLE001 — NXDOMAIN, timeout, pas de MX : non vérifiable
        return False


def verifier_email(email: str) -> bool:
    """Vérification locale complète : syntaxe valide + domaine avec MX."""
    if not verifier_syntaxe_email(email):
        return False
    domaine = email.split("@")[-1]
    return verifier_mx(domaine)


def deviner_email(prenom: str, nom: str, domaine: str) -> str:
    """Construit un email probable `prenom.nom@domaine` (sans accents)."""
    prenom = _sans_accents(prenom or "").strip().lower()
    nom = _sans_accents(nom or "").strip().lower()
    domaine = (domaine or "").strip().lower().lstrip("@")
    prenom = re.sub(r"[^a-z]", "", prenom)
    nom = re.sub(r"[^a-z]", "", nom)
    if not (prenom and nom and domaine):
        return ""
    return f"{prenom}.{nom}@{domaine}"


def nettoyer_prospect(prospect: Prospect) -> Prospect:
    """Normalise sur place les champs textuels d'un prospect."""
    e = prospect.entreprise
    e.raison_sociale = re.sub(r"\s+", " ", (e.raison_sociale or "").strip())
    e.naf = normaliser_naf(e.naf)
    e.adresse = normaliser_adresse(e.adresse)
    e.telephone = normaliser_telephone(e.telephone)
    e.ville = (e.ville or "").strip()
    e.code_postal = (e.code_postal or "").strip()
    prospect.email = normaliser_email(prospect.email)
    prospect.telephone = normaliser_telephone(prospect.telephone)
    prospect.nom_dirigeant = normaliser_nom(prospect.nom_dirigeant)
    prospect.prenom = normaliser_nom(prospect.prenom)
    return prospect
