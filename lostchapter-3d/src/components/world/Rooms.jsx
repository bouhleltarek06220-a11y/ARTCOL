import { ROOMS } from '../../config/rooms.js'
import { lostChapter } from '../../config/theme.js'
import SlideBoard from '../slides/SlideBoard.jsx'
import Portal from './Portal.jsx'

/**
 * Une salle = sol + mur + torches, puis :
 *  - un cadre + une slide (salle normale), OU
 *  - rien ici (le portail est rendu séparément pour la salle `portal`).
 */
function Room({ label, y, accent, slide, portal }) {
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

      {/* Cadre + slide (sauf salle portail) */}
      {!portal && (
        <>
          {/* Liseré accent du cadre */}
          <mesh position={[0, 0.7, -4.5]}>
            <planeGeometry args={[5.3, 3.1]} />
            <meshBasicMaterial color={accent} toneMapped={false} />
          </mesh>
          {/* Slide intégrée dans la salle */}
          <SlideBoard src={slide} label={label} accent={accent} position={[0, 0.7, -4.46]} />
        </>
      )}

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
        <Room key={r.id} {...r} />
      ))}
      {/* Portail rendu pour la(les) salle(s) marquée(s) `portal`. */}
      {ROOMS.filter((r) => r.portal).map((r) => (
        <Portal
          key={`${r.id}-portal`}
          y={r.y}
          accent={r.accent}
          imageSrc={r.portalImage}
          videoSrc={r.portalVideo}
        />
      ))}
    </group>
  )
}
