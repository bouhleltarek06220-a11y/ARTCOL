import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useExperience } from '../../store';
import { easeInOut, clamp01 } from '../../lib/easing';

const START = new THREE.Vector3(0, 3, 18);
const LOOK_START = new THREE.Vector3(0, 3.2, 0);
const END = new THREE.Vector3(0, 2.5, -7);
const LOOK_END = new THREE.Vector3(0, 2.6, -14);
const TRAVEL = 7; // secondes — travelling lent

export function CinematicCamera() {
  const camera = useThree((s) => s.camera);
  const phase = useExperience((s) => s.phase);
  const arrived = useExperience((s) => s.arrived);
  const reduced = useExperience((s) => s.reducedMotion);
  const t = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });
  const tmp = useRef(new THREE.Vector3());

  useEffect(() => {
    const h = (e: PointerEvent) => {
      pointer.current = { x: (e.clientX / window.innerWidth) * 2 - 1, y: (e.clientY / window.innerHeight) * 2 - 1 };
    };
    window.addEventListener('pointermove', h);
    return () => window.removeEventListener('pointermove', h);
  }, []);

  useFrame((_, dt) => {
    const px = pointer.current.x;
    const py = pointer.current.y;

    if (phase === 'loading' || phase === 'gate') {
      const sway = reduced ? 0 : Math.sin(performance.now() * 0.0004) * 0.5;
      camera.position.x += (px * 1.6 + sway - camera.position.x) * 0.04;
      camera.position.y += (3 - py * 0.6 - camera.position.y) * 0.04;
      camera.position.z += (18 - camera.position.z) * 0.04;
      camera.lookAt(LOOK_START);
    } else if (phase === 'entering') {
      t.current += dt;
      const j = clamp01(t.current / TRAVEL);
      const e = easeInOut(j);
      camera.position.lerpVectors(START, END, e);
      if (!reduced) camera.position.y += Math.sin(j * Math.PI * 2) * 0.08;
      camera.lookAt(tmp.current.lerpVectors(LOOK_START, LOOK_END, e));
      if (j >= 1) arrived();
    } else {
      // inside : léger regard libre
      camera.position.x += (px * 1.2 - camera.position.x) * 0.03;
      camera.position.y += (2.6 - py * 0.4 - camera.position.y) * 0.03;
      camera.position.z += (-7 - camera.position.z) * 0.03;
      camera.lookAt(LOOK_END);
    }
  });

  return null;
}
