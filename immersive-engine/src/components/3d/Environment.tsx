/**
 * L'univers : brouillard de profondeur, sol futuriste, lumières néon,
 * piliers du couloir (pour sentir qu'on avance) et portails à chaque station.
 */
import { useMemo } from "react";
import * as THREE from "three";
import { Grid, Stars, Float } from "@react-three/drei";
import { STATIONS, THEME } from "@/data/experience";

function Portal({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.4}>
      <group position={position}>
        {/* anneau lumineux = "porte" de la station */}
        <mesh>
          <torusGeometry args={[2.4, 0.035, 16, 80]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={2.2}
            toneMapped={false}
          />
        </mesh>
        {/* halo intérieur discret */}
        <mesh>
          <circleGeometry args={[2.36, 64]} />
          <meshBasicMaterial color={color} transparent opacity={0.04} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </Float>
  );
}

/** Piliers réguliers de part et d'autre de l'allée → sensation de déplacement. */
function Pillars() {
  const items = useMemo(() => {
    const arr: { pos: [number, number, number]; h: number }[] = [];
    for (let z = 0; z > -104; z -= 8) {
      const h = 6 + ((z * 0.13) % 3);
      arr.push({ pos: [-7.5, h / 2 - 1.5, z], h });
      arr.push({ pos: [7.5, h / 2 - 1.5, z], h });
    }
    return arr;
  }, []);
  return (
    <>
      {items.map((it, i) => (
        <mesh key={i} position={it.pos}>
          <boxGeometry args={[0.25, it.h, 0.25]} />
          <meshStandardMaterial
            color={THEME.accent2}
            emissive={THEME.accent2}
            emissiveIntensity={0.5}
            metalness={0.6}
            roughness={0.3}
            toneMapped={false}
          />
        </mesh>
      ))}
    </>
  );
}

export default function Environment() {
  const colors = [THEME.accent, THEME.accent3, THEME.accent2, THEME.accent, THEME.accent3, THEME.accent2];
  return (
    <>
      {/* brouillard linéaire = profondeur */}
      <fog attach="fog" args={[THEME.fog, 10, 70]} />
      <color attach="background" args={[THEME.bg]} />

      {/* lumières */}
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 10, 5]} intensity={0.6} />
      <pointLight position={[0, 4, -20]} intensity={40} color={THEME.accent} distance={40} />
      <pointLight position={[0, 4, -60]} intensity={40} color={THEME.accent2} distance={40} />

      {/* sol grille futuriste */}
      <Grid
        position={[0, -1.5, -48]}
        args={[200, 200]}
        cellSize={1.5}
        cellThickness={0.6}
        cellColor={THEME.accent2}
        sectionSize={9}
        sectionThickness={1}
        sectionColor={THEME.accent}
        fadeDistance={70}
        fadeStrength={2}
        infiniteGrid
      />

      <Stars radius={120} depth={60} count={1400} factor={3} saturation={0} fade speed={0.6} />

      <Pillars />

      {STATIONS.map((s, i) => (
        <Portal key={s.id} position={s.position} color={colors[i % colors.length]} />
      ))}
    </>
  );
}
