import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { MathUtils, Vector3 } from 'three'
import { ARMOR_PIECES } from './explodedData.js'
import { lostChapter } from '../../config/theme.js'

// Géométrie stand-in selon le descripteur de explodedData.js.
// >>> SWAP GLB : remplacée par les nœuds du modèle (<primitive object={nodes[node]} />).
function PieceGeometry({ geometry }) {
  switch (geometry.type) {
    case 'capsule':
      return <capsuleGeometry args={geometry.args} />
    case 'box':
      return <boxGeometry args={geometry.args} />
    case 'sphere':
      return <sphereGeometry args={geometry.args} />
    case 'cylinder':
      return <cylinderGeometry args={geometry.args} />
    default:
      return <boxGeometry args={[0.3, 0.3, 0.3]} />
  }
}

/**
 * EFFET SIGNATURE — armure qui se décompose / recompose au mouvement de souris.
 *
 * - L'éclatement suit la distance du pointeur au centre : centré = assemblé,
 *   vers les bords = éclaté (mappe `state.pointer`, déjà normalisé [-1, 1]).
 * - PERF (règles non négociables) :
 *     • aucun `setState` dans `useFrame` → tout passe par des refs ;
 *     • aucune allocation par frame → `rest`/`dir` pré-calculés (useMemo) +
 *       un seul Vector3 temporaire réutilisé ;
 *     • lissage indépendant du framerate via `MathUtils.damp`.
 *
 * @param {number} strength  multiplicateur d'éclatement (0 = figé, 1 = nominal)
 */
export default function ExplodedArmor({ strength = 1 }) {
  const group = useRef()
  const refs = useRef([])

  // Pré-calcul : rest en Vector3, dir normalisée. Fait une seule fois.
  const pieces = useMemo(
    () =>
      ARMOR_PIECES.map((p) => ({
        ...p,
        restV: new Vector3(...p.rest),
        dirV: new Vector3(...p.dir).normalize(),
      })),
    [],
  )

  // Vecteur temporaire réutilisé chaque frame (zéro allocation).
  const tmp = useMemo(() => new Vector3(), [])
  const explode = useRef(0)

  useFrame((state, delta) => {
    // Cible = distance du pointeur au centre (0 → assemblé, ~1 → éclaté).
    const p = state.pointer
    const target = Math.min(1, Math.hypot(p.x, p.y)) * strength

    // Lissage damping (frame-rate independent). Mutation de ref, pas de state.
    explode.current = MathUtils.damp(explode.current, target, 5, delta)

    // Rotation d'inactivité douce pour donner du volume à la silhouette.
    if (group.current) group.current.rotation.y += delta * 0.15

    for (let i = 0; i < pieces.length; i++) {
      const mesh = refs.current[i]
      if (!mesh) continue
      const { restV, dirV, spread } = pieces[i]
      // position = rest + dir * (explode * spread) — sans allocation
      tmp.copy(restV).addScaledVector(dirV, explode.current * spread)
      mesh.position.copy(tmp)
      // Léger tangage des pièces quand elles s'écartent.
      mesh.rotation.z = explode.current * spread * 0.25
    }
  })

  return (
    <group ref={group} position={[0, 0.05, 0]}>
      {pieces.map((p, i) => (
        <mesh
          key={p.node}
          ref={(el) => (refs.current[i] = el)}
          position={p.rest} // état assemblé au 1er rendu (avant la 1re frame)
        >
          {/* >>> SWAP GLB : remplacer par <primitive object={nodes[p.node]} /> */}
          <PieceGeometry geometry={p.geometry} />
          <meshStandardMaterial
            color={lostChapter.gold}
            metalness={0.95}
            roughness={0.32}
            emissive={lostChapter.ember}
            emissiveIntensity={0.06}
          />
        </mesh>
      ))}
    </group>
  )
}
