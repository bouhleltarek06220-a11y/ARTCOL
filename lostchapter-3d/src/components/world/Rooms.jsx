import { ROOMS } from '../../config/rooms.js'
import { lostChapter } from '../../config/theme.js'

/**
 * Une salle = sol + mur du fond + cadre à slide (vide, rempli à l'étape 4)
 * + deux torches (accent de la salle). Positionnée à sa profondeur `y`.
 */
function Room({ y, accent }) {
  return (
    <group position={[0, y, 0]}>
      {/* Sol de pierre */}
      <mesh rotation-x={-Math.PI / 2} position={[0, -2.2, 0]}>
        <planeGeometry args={[16, 13]} />
        <meshStandardMaterial color={lostChapter.brown2} roughness={1} metalness={0} />
      </mesh>

      {/* Mur du fond */}
      <mesh position={[0, 0.8, -4.6]}>
        <planeGeometry args={[16, 9.5]} />
        <meshStandardMaterial color={lostChapter.brown3} roughness={1} />
      </mesh>

      {/* Liseré accent du cadre (légèrement plus grand, derrière) */}
      <mesh position={[0, 0.7, -4.5]}>
        <planeGeometry args={[5.5, 3.3]} />
        <meshBasicMaterial color={accent} toneMapped={false} />
      </mesh>
      {/* Panneau du cadre à slide (vide pour l'instant) */}
      <mesh position={[0, 0.7, -4.48]}>
        <planeGeometry args={[5.2, 3]} />
        <meshStandardMaterial color={lostChapter.brown} roughness={0.9} />
      </mesh>

      {/* Torches : une à l'accent de la salle, une braise */}
      <pointLight position={[-3.6, 1.6, 1.8]} intensity={16} distance={13} color={accent} />
      <pointLight position={[3.6, 1.6, 1.8]} intensity={16} distance={13} color={lostChapter.ember} />
    </group>
  )
}

export default function Rooms() {
  return (
    <group>
      {ROOMS.map((r) => (
        <Room key={r.id} y={r.y} accent={r.accent} />
      ))}
    </group>
  )
}
