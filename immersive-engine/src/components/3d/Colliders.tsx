/**
 * Colliders du mode marche : on ne traverse plus les écrans, et on reste dans
 * l'allée centrale (murs latéraux invisibles). Physique uniquement (rapier).
 */
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { CREATIONS } from "@/data/experience";

export default function Colliders() {
  return (
    <>
      {/* un mur fin derrière chaque œuvre → infranchissable */}
      {CREATIONS.map((n) => {
        const square = n.ratio === "square";
        const w = square ? 3.7 : 6.2;
        const h = square ? 3.7 : 3.55;
        const yaw = Math.abs(n.focus[0]) < 0.5 ? 0 : n.focus[0] < 0 ? 0.42 : -0.42;
        return (
          <RigidBody key={n.id} type="fixed" colliders={false} position={n.focus} rotation={[-0.04, yaw, 0]}>
            <CuboidCollider args={[w / 2 + 0.2, h / 2 + 0.8, 0.3]} />
          </RigidBody>
        );
      })}
      {/* murs latéraux : on reste dans le couloir */}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[0.3, 5, 90]} position={[-6.6, 3, -42]} />
        <CuboidCollider args={[0.3, 5, 90]} position={[6.6, 3, -42]} />
      </RigidBody>
    </>
  );
}
