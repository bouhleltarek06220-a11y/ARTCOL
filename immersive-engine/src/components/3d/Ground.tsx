/**
 * Grille néon — simple repère visuel sous l'allée (AUCUNE physique : on vole librement).
 */
import { Grid } from "@react-three/drei";

export default function Ground() {
  return (
    <Grid
      position={[0, -1.5, -45]}
      args={[600, 600]}
      cellSize={1.5}
      cellThickness={0.6}
      cellColor="#5b3aa8"
      sectionSize={9}
      sectionThickness={1}
      sectionColor="#36e0ff"
      fadeDistance={95}
      fadeStrength={2}
      infiniteGrid
    />
  );
}
