/**
 * Le sol du mode « explore » : un collider plat (rapier) + une grille néon
 * pour donner un repère de marche dans la galaxie.
 */
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { Grid } from "@react-three/drei";

export default function Ground() {
  return (
    <>
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[300, 0.5, 300]} position={[0, -0.5, -45]} />
      </RigidBody>
      <Grid
        position={[0, 0.02, -45]}
        args={[600, 600]}
        cellSize={1.5}
        cellThickness={0.6}
        cellColor="#5b3aa8"
        sectionSize={9}
        sectionThickness={1}
        sectionColor="#36e0ff"
        fadeDistance={90}
        fadeStrength={2}
        infiniteGrid
      />
    </>
  );
}
