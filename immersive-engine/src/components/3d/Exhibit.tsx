/**
 * Une œuvre exposée = un écran holographique encadré de néon, posé dans l'espace,
 * orienté vers l'allée. Survol → s'illumine ; clic → ouvre la fiche détail.
 */
import { useRef, useState } from "react";
import * as THREE from "three";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { useTexture, Html } from "@react-three/drei";
import type { Node } from "@/data/experience";
import { useExperience } from "@/stores/useExperience";

export default function Exhibit({ node }: { node: Node }) {
  const group = useRef<THREE.Group>(null);
  const tex = useTexture(`/assets/textures/${node.preview}.png`);
  const [hover, setHover] = useState(false);
  const openDetail = useExperience((s) => s.openDetail);
  const accent = node.accent ?? "#36e0ff";

  // La caméra arrive depuis +z : la face +z de l'écran regarde déjà la caméra.
  // On ajoute juste un léger yaw vers l'allée (selon le côté).
  const yaw = node.focus[0] < 0 ? 0.42 : -0.42;

  useFrame((_, dt) => {
    if (!group.current) return;
    const s = hover ? 1.05 : 1;
    const cur = group.current.scale.x + (s - group.current.scale.x) * Math.min(1, dt * 8);
    group.current.scale.setScalar(cur);
  });

  return (
    <group
      ref={group}
      position={node.focus}
      rotation={[-0.04, yaw, 0]}
      onPointerOver={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        setHover(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHover(false);
        document.body.style.cursor = "auto";
      }}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        openDetail(node.id);
      }}
    >
      {/* halo arrière */}
      <mesh position={[0, 0, -0.12]}>
        <planeGeometry args={[7.2, 4.5]} />
        <meshBasicMaterial color={accent} transparent opacity={hover ? 0.22 : 0.1} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
      {/* cadre néon */}
      <mesh position={[0, 0, -0.06]}>
        <planeGeometry args={[6.5, 3.85]} />
        <meshBasicMaterial color={accent} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
      {/* écran (aperçu de la création) */}
      <mesh>
        <planeGeometry args={[6.2, 3.55]} />
        <meshBasicMaterial map={tex} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>

      {/* étiquette holographique */}
      <Html position={[0, -2.45, 0]} center distanceFactor={11} prepend>
        <div className="exhibit-label" style={{ borderColor: accent }}>
          <span style={{ color: accent }}>{node.type}</span>
          <b>{node.title}</b>
          <i>cliquer pour explorer</i>
        </div>
      </Html>
    </group>
  );
}
