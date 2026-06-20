"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { Group, MeshStandardMaterial } from "three";

/**
 * Personnage représentant le propriétaire / artiste de la villa-galerie.
 * Silhouette élégante (costume sombre), posture naturelle, légère respiration.
 * Cliquable (raycast centre-écran géré par le <Player/>) pour lancer la
 * conversation : le groupe porte `userData.interactive = "guide"`.
 */
export function CharacterGuide({
  position = [-3.4, 0, 1.2],
  rotation = 0,
}: {
  position?: [number, number, number];
  rotation?: number;
}) {
  const group = useRef<Group>(null);

  const suit = useMemo(
    () => new MeshStandardMaterial({ color: "#1c2230", roughness: 0.65, metalness: 0.1 }),
    [],
  );
  const shirt = useMemo(
    () => new MeshStandardMaterial({ color: "#ece9e3", roughness: 0.7 }),
    [],
  );
  const skin = useMemo(
    () => new MeshStandardMaterial({ color: "#c89a78", roughness: 0.6 }),
    [],
  );
  const hair = useMemo(
    () => new MeshStandardMaterial({ color: "#15110d", roughness: 0.8 }),
    [],
  );
  const shoes = useMemo(
    () => new MeshStandardMaterial({ color: "#0c0c0e", roughness: 0.4, metalness: 0.2 }),
    [],
  );

  // Respiration / léger balancement (mutation directe, pas de state).
  useFrame(({ clock }) => {
    if (group.current) {
      const t = clock.elapsedTime;
      group.current.position.y = Math.sin(t * 1.1) * 0.012;
      group.current.rotation.y = rotation + Math.sin(t * 0.5) * 0.04;
    }
  });

  return (
    <group
      ref={group}
      position={position}
      rotation={[0, rotation, 0]}
      userData={{ interactive: "guide" }}
    >
      {/* Jambes */}
      <mesh material={suit} position={[-0.13, 0.55, 0]} castShadow>
        <cylinderGeometry args={[0.11, 0.13, 1.1, 16]} />
      </mesh>
      <mesh material={suit} position={[0.13, 0.55, 0]} castShadow>
        <cylinderGeometry args={[0.11, 0.13, 1.1, 16]} />
      </mesh>
      {/* Chaussures */}
      <mesh material={shoes} position={[-0.13, 0.04, 0.06]} castShadow>
        <boxGeometry args={[0.16, 0.08, 0.34]} />
      </mesh>
      <mesh material={shoes} position={[0.13, 0.04, 0.06]} castShadow>
        <boxGeometry args={[0.16, 0.08, 0.34]} />
      </mesh>

      {/* Torse (veste) */}
      <mesh material={suit} position={[0, 1.32, 0]} castShadow>
        <capsuleGeometry args={[0.27, 0.5, 6, 16]} />
      </mesh>
      {/* Plastron chemise */}
      <mesh material={shirt} position={[0, 1.34, 0.2]} castShadow>
        <boxGeometry args={[0.12, 0.55, 0.06]} />
      </mesh>

      {/* Bras le long du corps */}
      <mesh material={suit} position={[-0.34, 1.28, 0.02]} rotation={[0, 0, 0.08]} castShadow>
        <capsuleGeometry args={[0.085, 0.62, 6, 12]} />
      </mesh>
      <mesh material={suit} position={[0.34, 1.28, 0.02]} rotation={[0, 0, -0.08]} castShadow>
        <capsuleGeometry args={[0.085, 0.62, 6, 12]} />
      </mesh>
      {/* Mains */}
      <mesh material={skin} position={[-0.38, 0.92, 0.04]} castShadow>
        <sphereGeometry args={[0.085, 12, 12]} />
      </mesh>
      <mesh material={skin} position={[0.38, 0.92, 0.04]} castShadow>
        <sphereGeometry args={[0.085, 12, 12]} />
      </mesh>

      {/* Cou + tête */}
      <mesh material={skin} position={[0, 1.74, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.08, 0.12, 12]} />
      </mesh>
      <mesh material={skin} position={[0, 1.9, 0]} castShadow>
        <sphereGeometry args={[0.17, 24, 24]} />
      </mesh>
      {/* Cheveux */}
      <mesh material={hair} position={[0, 1.97, -0.02]} castShadow>
        <sphereGeometry args={[0.178, 24, 24, 0, Math.PI * 2, 0, Math.PI / 1.7]} />
      </mesh>

      {/* Halo lumineux discret au sol (attire l'attention) */}
      <pointLight position={[0, 0.4, 0.6]} intensity={3} distance={3} decay={2} color="#ffdca6" />

      {/* Étiquette d'invitation au-dessus de la tête */}
      <Html position={[0, 2.35, 0]} center distanceFactor={9} occlude={false}>
        <div
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 15,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#f7f2e9",
            background: "rgba(20,16,11,.5)",
            border: "1px solid rgba(169,138,92,.6)",
            padding: "5px 12px",
            borderRadius: 2,
            whiteSpace: "nowrap",
            textShadow: "0 1px 10px rgba(0,0,0,.6)",
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          Parler à l’hôte
        </div>
      </Html>
    </group>
  );
}
