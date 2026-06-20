/**
 * Le couloir/salle cyberpunk-japonais (visuel) : rails néon le long de l'allée
 * et arches torii rouges à intervalles. Donne corps au mode marche.
 */
import { useMemo } from "react";
import { THEME } from "@/data/experience";

function Rail({ x }: { x: number }) {
  return (
    <mesh position={[x, 0.06, -42]}>
      <boxGeometry args={[0.08, 0.12, 184]} />
      <meshStandardMaterial color={THEME.cyan} emissive={THEME.cyan} emissiveIntensity={2} toneMapped={false} />
    </mesh>
  );
}

function Torii({ z }: { z: number }) {
  return (
    <group position={[0, 0, z]}>
      {/* poteaux */}
      {[-6.3, 6.3].map((x) => (
        <mesh key={x} position={[x, 2.6, 0]}>
          <cylinderGeometry args={[0.16, 0.2, 5.2, 12]} />
          <meshStandardMaterial color={THEME.red} emissive={THEME.red} emissiveIntensity={0.9} metalness={0.3} roughness={0.5} />
        </mesh>
      ))}
      {/* linteaux */}
      <mesh position={[0, 5.2, 0]}>
        <boxGeometry args={[14.4, 0.5, 0.5]} />
        <meshStandardMaterial color={THEME.red} emissive={THEME.red} emissiveIntensity={1.1} />
      </mesh>
      <mesh position={[0, 4.4, 0]}>
        <boxGeometry args={[12.6, 0.28, 0.34]} />
        <meshStandardMaterial color={THEME.gold} emissive={THEME.gold} emissiveIntensity={1.2} toneMapped={false} />
      </mesh>
    </group>
  );
}

export default function Structure() {
  const toriis = useMemo(() => [4, -12, -28, -44, -60, -76, -92], []);
  return (
    <group>
      <Rail x={-6.4} />
      <Rail x={6.4} />
      {toriis.map((z) => (
        <Torii key={z} z={z} />
      ))}
    </group>
  );
}
