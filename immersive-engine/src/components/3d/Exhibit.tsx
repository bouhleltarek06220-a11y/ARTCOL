/**
 * Une œuvre exposée = un écran (image OU vidéo) encadré de néon, posé dans l'espace.
 * Survol → s'illumine ; clic → ouvre la fiche détail.
 */
import { useRef, useState } from "react";
import * as THREE from "three";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { useTexture, useVideoTexture, Html } from "@react-three/drei";
import type { Node } from "@/data/experience";
import { useExperience } from "@/stores/useExperience";

function ImageScreen({ src, w, h }: { src: string; w: number; h: number }) {
  const tex = useTexture(src);
  return (
    <mesh>
      <planeGeometry args={[w, h]} />
      <meshBasicMaterial map={tex} side={THREE.DoubleSide} toneMapped={false} />
    </mesh>
  );
}

function VideoScreen({ src, w, h }: { src: string; w: number; h: number }) {
  const tex = useVideoTexture(src, { muted: true, loop: true, start: true, crossOrigin: "anonymous" });
  return (
    <mesh>
      <planeGeometry args={[w, h]} />
      <meshBasicMaterial map={tex} side={THREE.DoubleSide} toneMapped={false} />
    </mesh>
  );
}

export default function Exhibit({ node }: { node: Node }) {
  const group = useRef<THREE.Group>(null);
  const [hover, setHover] = useState(false);
  const openDetail = useExperience((s) => s.openDetail);
  const targeted = useExperience((s) => s.targeted);
  const accent = node.accent ?? "#36e0ff";
  const active = hover || targeted === node.id; // survol (rail) ou visé (explore)

  // dimensions selon le format
  const square = node.ratio === "square";
  const sw = square ? 3.7 : 6.2;
  const sh = square ? 3.7 : 3.55;

  // yaw vers l'allée (les œuvres centrées ne tournent pas)
  const yaw = Math.abs(node.focus[0]) < 0.5 ? 0 : node.focus[0] < 0 ? 0.42 : -0.42;

  useFrame((_, dt) => {
    if (!group.current) return;
    const s = active ? 1.06 : 1;
    const cur = group.current.scale.x + (s - group.current.scale.x) * Math.min(1, dt * 8);
    group.current.scale.setScalar(cur);
  });

  return (
    <group
      ref={group}
      position={node.focus}
      rotation={[-0.04, yaw, 0]}
      userData={{ exhibitId: node.id }}
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
        <planeGeometry args={[sw + 1, sh + 0.9]} />
        <meshBasicMaterial color={accent} transparent opacity={active ? 0.3 : 0.11} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
      {/* cadre néon */}
      <mesh position={[0, 0, -0.06]}>
        <planeGeometry args={[sw + 0.3, sh + 0.3]} />
        <meshBasicMaterial color={accent} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
      {/* écran (image ou vidéo) */}
      {node.video ? (
        <VideoScreen src={`/assets/video/${node.video}.mp4`} w={sw} h={sh} />
      ) : (
        <ImageScreen src={`/assets/textures/${node.preview}.png`} w={sw} h={sh} />
      )}

      {/* étiquette holographique */}
      <Html position={[0, -(sh / 2) - 0.7, 0]} center distanceFactor={11} prepend>
        <div className="exhibit-label" style={{ borderColor: accent }}>
          <span style={{ color: accent }}>{node.type}</span>
          <b>{node.title}</b>
          <i>cliquer pour explorer</i>
        </div>
      </Html>
    </group>
  );
}
