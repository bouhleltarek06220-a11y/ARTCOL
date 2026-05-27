"""Interface en ligne de commande REFLEXE (typer + rich).

Commandes : init, run, resume, export, status.
"""

from __future__ import annotations

import asyncio
import sys
from pathlib import Path

import typer
from loguru import logger
from rich.console import Console
from rich.table import Table

from reflexe import __version__
from reflexe.config import charger_mission, get_settings
from reflexe.db import Database
from reflexe.models import StatutPipeline
from reflexe.orchestrator import Orchestrateur
from reflexe.outputs import export as export_out

app = typer.Typer(
    add_completion=False,
    help="REFLEXE — Agent de prospection B2B automatisé (collecte légale → IA → export).",
)
console = Console()


def _init_logs() -> None:
    settings = get_settings()
    logger.remove()
    logger.add(
        sys.stderr,
        level=settings.log_level,
        format="<green>{time:HH:mm:ss}</green> | <level>{level: <7}</level> | {message}",
    )
    logger.add(
        settings.logs_dir / "reflexe_{time:YYYY-MM-DD}.log",
        rotation="10 MB",
        retention="30 days",
        level="DEBUG",
        encoding="utf-8",
        enqueue=True,
    )


def _reporter(etape: str, info: str) -> None:
    console.print(f"[bold cyan]»[/bold cyan] {info}")


def _afficher_resume(resultat: dict) -> None:
    table = Table(title=f"Résultat du job {resultat['job_id']}", show_header=True)
    table.add_column("Statut", style="cyan")
    table.add_column("Prospects", justify="right", style="green")
    for statut, n in sorted((resultat.get("repartition") or {}).items()):
        table.add_row(statut, str(n))
    console.print(table)
    brevo = resultat.get("brevo") or {}
    console.print(
        f"[bold]Brevo[/bold] : {brevo.get('pousses', 0)} poussés, "
        f"{brevo.get('simules', 0)} simulés, {brevo.get('erreurs', 0)} erreurs "
        f"(éligibles : {brevo.get('eligibles', 0)})."
    )
    console.print(f"[bold]Coût LLM estimé[/bold] : ${resultat.get('cout_llm', 0.0)}")
    for chemin in resultat.get("exports", []):
        console.print(f"[bold]Export[/bold] : {chemin}")


@app.command()
def init() -> None:
    """Prépare l'environnement runtime (data/, logs/) et vérifie le `.env`."""
    _init_logs()
    settings = get_settings()
    console.print(f"[green]✓[/green] Dossiers prêts : {settings.data_dir}, {settings.logs_dir}")

    exemple = Path("missions/exemple_mission.yaml")
    if exemple.exists():
        console.print(f"[green]✓[/green] Modèle de mission disponible : {exemple}")
    else:
        console.print(
            "[yellow]![/yellow] missions/exemple_mission.yaml introuvable "
            "(copiez-le depuis le dépôt)."
        )

    if not Path(".env").exists():
        console.print(
            "[yellow]![/yellow] Aucun fichier .env. Copiez .env.example en .env "
            "et renseignez ANTHROPIC_API_KEY (voir README)."
        )
    else:
        console.print("[green]✓[/green] Fichier .env présent.")
    if not settings.anthropic_api_key:
        console.print(
            "[yellow]![/yellow] ANTHROPIC_API_KEY non définie : le scoring et la "
            "rédaction des messages seront sautés tant qu'elle est absente."
        )


@app.command()
def run(
    mission: str = typer.Option(..., "--mission", "-m", help="Chemin du fichier de mission YAML."),
    dry_run: bool = typer.Option(False, "--dry-run", help="Simule le push Brevo sans rien envoyer."),
    limit: int = typer.Option(None, "--limit", "-l", help="Plafonne le nombre de prospects."),
) -> None:
    """Lance le pipeline complet à partir d'un fichier de mission."""
    _init_logs()
    settings = get_settings()
    try:
        config_mission = charger_mission(mission)
    except (FileNotFoundError, ValueError) as exc:
        console.print(f"[red]✗ Mission invalide :[/red] {exc}")
        raise typer.Exit(code=1)

    console.print(
        f"[bold]REFLEXE[/bold] v{__version__} — mission « {config_mission.nom} »"
        + (" [yellow](dry-run)[/yellow]" if dry_run else "")
    )

    async def _run() -> dict:
        with Database(settings.db_path) as db:
            orch = Orchestrateur(settings, db)
            return await orch.executer(
                config_mission,
                str(Path(mission).resolve()),
                dry_run=dry_run,
                limite_override=limit,
                reporter=_reporter,
            )

    resultat = asyncio.run(_run())
    _afficher_resume(resultat)


@app.command()
def resume(
    job: str = typer.Option(..., "--job", "-j", help="Identifiant du job à reprendre."),
    dry_run: bool = typer.Option(False, "--dry-run", help="Simule le push Brevo."),
) -> None:
    """Reprend un job interrompu depuis le dernier checkpoint."""
    _init_logs()
    settings = get_settings()

    async def _resume() -> dict:
        with Database(settings.db_path) as db:
            orch = Orchestrateur(settings, db)
            return await orch.reprendre(job, dry_run=dry_run, reporter=_reporter)

    try:
        resultat = asyncio.run(_resume())
    except ValueError as exc:
        console.print(f"[red]✗ {exc}[/red]")
        raise typer.Exit(code=1)
    _afficher_resume(resultat)


@app.command()
def export(
    job: str = typer.Option(..., "--job", "-j", help="Identifiant du job."),
    format: str = typer.Option("csv", "--format", "-f", help="csv, json ou csv,json."),
) -> None:
    """Ré-exporte les résultats d'un job depuis la base."""
    _init_logs()
    settings = get_settings()
    with Database(settings.db_path) as db:
        if db.get_job(job) is None:
            console.print(f"[red]✗ Job introuvable : {job}[/red]")
            raise typer.Exit(code=1)
        prospects = db.get_prospects(job)
    chemins = export_out.exporter(
        prospects, settings.data_dir / "exports", job, format
    )
    for chemin in chemins:
        console.print(f"[green]✓[/green] Export : {chemin}")


@app.command()
def status(limit: int = typer.Option(20, "--limit", "-l", help="Nombre de jobs affichés.")) -> None:
    """Affiche l'état des derniers jobs."""
    _init_logs()
    settings = get_settings()
    table = Table(title="Jobs REFLEXE", show_header=True)
    for col in ("Job", "Mission", "Statut", "Collectés", "Prêts", "Poussés"):
        table.add_column(col)
    with Database(settings.db_path) as db:
        for job in db.lister_jobs(limit):
            counts = db.compter_par_statut(job["job_id"])
            total = sum(counts.values())
            prets = counts.get(StatutPipeline.PRET_ENVOI.value, 0)
            pousses = counts.get(StatutPipeline.POUSSE_BREVO.value, 0)
            table.add_row(
                job["job_id"],
                job["mission_nom"] or "",
                job["statut"] or "",
                str(total),
                str(prets),
                str(pousses),
            )
    console.print(table)


if __name__ == "__main__":
    app()
