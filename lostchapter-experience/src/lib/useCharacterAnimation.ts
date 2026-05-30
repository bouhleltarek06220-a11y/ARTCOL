import { useEffect } from 'react';
import { useAnimations } from '@react-three/drei';
import * as THREE from 'three';

// Hook : joue automatiquement la première animation d'un GLB (ou une animation nommée),
// avec fondu d'entrée. Idéal pour les NPC en idle / walk.
export function useCharacterAnimation(
  animations: THREE.AnimationClip[],
  target: THREE.Object3D | null,
  animationName?: string,
  timeScale = 1,
) {
  const { actions } = useAnimations(animations, target ?? undefined);
  useEffect(() => {
    if (!actions || !target) return;
    const keys = Object.keys(actions);
    const key = animationName && actions[animationName] ? animationName : keys[0];
    const action = key ? actions[key] : null;
    if (action) {
      action.reset();
      action.timeScale = timeScale;
      action.fadeIn(0.5).play();
    }
    return () => {
      if (action) action.fadeOut(0.3);
    };
  }, [actions, target, animationName, timeScale]);
}
