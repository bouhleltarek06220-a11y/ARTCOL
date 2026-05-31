import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useExperience } from '../../store';
import { easeInOut, clamp01 } from '../../lib/easing';

// Waypoint = position caméra + point regardé + durée pour ARRIVER à ce point depuis le précédent.
type WP = { pos: [number, number, number]; look: [number, number, number]; dur: number };

// ─── DONJON (v3) ── tour cinéma de la salle puis transition cathédrale.
// Démarrage là où CinematicCamera nous a posés : [0, 4.4, -10] regardant [0, 2.8, -38].
const DUNGEON_TOUR: WP[] = [
  { pos: [0, 4.4, -10], look: [0, 2.8, -38], dur: 0 },          // point de départ
  { pos: [6, 4.6, -12], look: [0, 2.5, -22], dur: 2.8 },        // pan vers la droite, vue d'ensemble
  { pos: [8.5, 5.2, -22], look: [-2, 2.2, -26], dur: 2.6 },     // glisse vers la partie centrale
  { pos: [3, 2.4, -22], look: [-1, 1.8, -24], dur: 2.4 },       // descend au niveau des personnages
  { pos: [-3, 2.4, -22], look: [1.5, 1.8, -24], dur: 2.0 },     // balaye l'équipe
  { pos: [0, 5.4, -18], look: [0, 8, -24], dur: 1.8 },          // lève la tête vers le dragon
  { pos: [0, 4.5, -10], look: [0, 2.6, -34], dur: 2.4 },        // revient face aux 9 portes
];

// ─── CATHÉDRALE (v4) ── arrivée au fond de la nef, descente jusqu'à l'autel
// puis cadre final sur le livre + les 3 personnages (Julie/Tarek/Myriam) qui
// se tiennent debout devant l'autel, prêts à présenter.
// Personnages statiques à z ≈ -52, autel & livre à z ≈ -58.
const CATHEDRAL_TOUR: WP[] = [
  { pos: [0, 4, 0],     look: [0, 3, -30],  dur: 0 },           // entrée nef
  { pos: [0, 4.2, -16], look: [0, 3, -42],  dur: 3.6 },         // glisse en avant
  { pos: [-4, 4.5, -28], look: [4, 3.5, -38], dur: 2.6 },       // pan léger droite (vitraux)
  { pos: [4, 4.5, -38], look: [-2, 3, -50], dur: 2.6 },         // pan à gauche
  { pos: [0, 4.2, -46], look: [0, 2.4, -56], dur: 2.4 },        // approche large (équipe + autel)
  { pos: [0, 3.6, -45], look: [0, 2.5, -57], dur: 2.4 },        // cadre stable face à la scène
];

const USE_CATHEDRAL = typeof window !== 'undefined' && window.location.pathname.includes('experience-v4');

export function GuidedTour({ onTransition }: { onTransition: () => void }) {
  const camera = useThree((s) => s.camera);
  const tourPhase = useExperience((s) => s.tourPhase);
  const phase = useExperience((s) => s.phase);
  const setTourPhase = useExperience((s) => s.setTourPhase);
  const endTour = useExperience((s) => s.endTour);
  const tRef = useRef(0);
  const startedRef = useRef(false);

  const waypoints = USE_CATHEDRAL ? CATHEDRAL_TOUR : DUNGEON_TOUR;
  const isActive = USE_CATHEDRAL ? tourPhase === 'cathedral' : tourPhase === 'dungeon';

  // Snap initial caméra au W0 quand la tour démarre
  useEffect(() => {
    if (!isActive || phase !== 'inside') return;
    if (startedRef.current) return;
    startedRef.current = true;
    tRef.current = 0;
    const w0 = waypoints[0];
    camera.position.set(w0.pos[0], w0.pos[1], w0.pos[2]);
    camera.lookAt(w0.look[0], w0.look[1], w0.look[2]);
  }, [isActive, phase, camera, waypoints]);

  useFrame((_, dt) => {
    if (!isActive || phase !== 'inside') return;
    tRef.current += dt;

    // Trouve le segment courant en accumulant les durées
    let cum = 0;
    for (let i = 0; i < waypoints.length - 1; i++) {
      const segDur = waypoints[i + 1].dur;
      if (tRef.current <= cum + segDur) {
        const k = (tRef.current - cum) / segDur;
        const e = easeInOut(clamp01(k));
        const a = waypoints[i];
        const b = waypoints[i + 1];
        camera.position.set(
          a.pos[0] + (b.pos[0] - a.pos[0]) * e,
          a.pos[1] + (b.pos[1] - a.pos[1]) * e,
          a.pos[2] + (b.pos[2] - a.pos[2]) * e,
        );
        camera.lookAt(
          a.look[0] + (b.look[0] - a.look[0]) * e,
          a.look[1] + (b.look[1] - a.look[1]) * e,
          a.look[2] + (b.look[2] - a.look[2]) * e,
        );
        return;
      }
      cum += segDur;
    }

    // Fin du tour : dans le donjon on enchaîne sur la cathédrale, dans la cathédrale on rend la main.
    if (!USE_CATHEDRAL) {
      setTourPhase('transition');
      onTransition();
    } else {
      endTour();
    }
  });

  return null;
}
