/**
 * L'univers AMAVYA : galaxie en fond (sphère panoramique non affectée par le fog),
 * champ d'étoiles, brouillard profond et lumières néon.
 */
import { BackSide } from "three";
import { useTexture, Stars } from "@react-three/drei";
import { THEME } from "@/data/experience";

export default function Galaxy() {
  const galaxy = useTexture("/assets/textures/galaxy.png");

  return (
    <>
      <fog attach="fog" args={[THEME.fog, 16, 88]} />

      {/* galaxie : grande sphère, texture à l'intérieur, insensible au brouillard */}
      <mesh scale={[-1, 1, 1]}>
        <sphereGeometry args={[140, 60, 60]} />
        <meshBasicMaterial map={galaxy} side={BackSide} fog={false} toneMapped={false} />
      </mesh>

      <Stars radius={110} depth={60} count={2600} factor={4} saturation={0} fade speed={0.4} />

      <ambientLight intensity={0.55} />
      <pointLight position={[0, 7, -18]} intensity={70} color={THEME.cyan} distance={70} />
      <pointLight position={[0, 7, -46]} intensity={70} color={THEME.magenta} distance={70} />
      <pointLight position={[0, 5, 6]} intensity={30} color={THEME.gold} distance={40} />
    </>
  );
}
