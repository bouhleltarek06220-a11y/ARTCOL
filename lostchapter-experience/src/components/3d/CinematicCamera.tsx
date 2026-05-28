import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useExperience } from '../../store';
import { easeInOut, clamp01 } from '../../lib/easing';

// Waypoints du voyage cinématographique
const W_OUTSIDE = new THREE.Vector3(0, 3, 18);
const L_OUTSIDE = new THREE.Vector3(0, 3.2, 0);
const W_GATE = new THREE.Vector3(0, 2.85, -4);
const L_GATE = new THREE.Vector3(0, 3.2, -14);
// Arrivée dans l'atrium Sponza : caméra surélevée pour passer au-dessus des
// arcades latérales et révéler le tapis royal + les armures + les 9 portes
// du fond en un seul cadre.
const W_HALL = new THREE.Vector3(0, 4.4, -10);
const L_HALL = new THREE.Vector3(0, 2.6, -32);

const T1 = 3.6; // extérieur → franchir le seuil
const T2 = 9.0; // seuil → installation dans le hall

const tmpPos = new THREE.Vector3();
const tmpLook = new THREE.Vector3();

export function CinematicCamera() {
  const camera = useThree((s) => s.camera);
  const phase = useExperience((s) => s.phase);
  const arrived = useExperience((s) => s.arrived);
  const reduced = useExperience((s) => s.reducedMotion);
  const tRef = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const h = (e: PointerEvent) => {
      pointer.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      };
    };
    window.addEventListener('pointermove', h);
    return () => window.removeEventListener('pointermove', h);
  }, []);

  // reset timer quand on commence l'entrée
  useEffect(() => {
    if (phase === 'entering') tRef.current = 0;
  }, [phase]);

  useFrame((_, dt) => {
    // Une fois dans le hall, OrbitControls prend le contrôle total de la caméra.
    if (phase === 'inside') return;

    const px = pointer.current.x;
    const py = pointer.current.y;

    if (phase === 'loading' || phase === 'gate') {
      const sway = reduced ? 0 : Math.sin(performance.now() * 0.0004) * 0.55;
      camera.position.x += (px * 1.6 + sway - camera.position.x) * 0.04;
      camera.position.y += (3 - py * 0.6 - camera.position.y) * 0.04;
      camera.position.z += (W_OUTSIDE.z - camera.position.z) * 0.04;
      camera.lookAt(L_OUTSIDE);
    } else if (phase === 'entering') {
      tRef.current += dt;
      const t = tRef.current;
      if (t < T1) {
        const e = easeInOut(clamp01(t / T1));
        tmpPos.lerpVectors(W_OUTSIDE, W_GATE, e);
        tmpLook.lerpVectors(L_OUTSIDE, L_GATE, e);
      } else {
        const e = easeInOut(clamp01((t - T1) / (T2 - T1)));
        tmpPos.lerpVectors(W_GATE, W_HALL, e);
        tmpLook.lerpVectors(L_GATE, L_HALL, e);
      }
      if (!reduced) tmpPos.y += Math.sin((t / T2) * Math.PI * 2) * 0.08;
      camera.position.copy(tmpPos);
      camera.lookAt(tmpLook);
      if (t >= T2) arrived();
    }
    // phase === 'inside' est géré par OrbitControls (cf. CastleScene)
  });

  return null;
}
