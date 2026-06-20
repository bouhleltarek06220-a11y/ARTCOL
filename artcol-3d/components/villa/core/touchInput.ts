/**
 * État d'entrée tactile partagé entre l'UI (joystick, hors Canvas) et le
 * <Player/> (dans le Canvas). On passe par un objet mutable de module plutôt
 * que par le state React pour éviter tout re-rendu à chaque frame.
 */
export const touchInput = {
  /** Vecteur joystick normalisé : x = latéral, y = avant/arrière (1 = avant). */
  move: { x: 0, y: 0 },
  /** Deltas de regard accumulés (px) à consommer puis remettre à zéro. */
  look: { dx: 0, dy: 0 },
  /** Vrai quand le doigt a glissé pour regarder → on annule le « tap » suivant
   *  (évite d'ouvrir une œuvre par erreur en fin de mouvement de caméra). */
  suppressTap: false,
};

/** Réinitialise les entrées (au montage / changement de phase). */
export function resetTouchInput() {
  touchInput.move.x = 0;
  touchInput.move.y = 0;
  touchInput.look.dx = 0;
  touchInput.look.dy = 0;
  touchInput.suppressTap = false;
}
