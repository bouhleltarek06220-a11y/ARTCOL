import { ROOMS } from '../../config/rooms.js'
import { DECK } from '../../config/slides.js'
import { lostChapter } from '../../config/theme.js'
import SlideBoard from '../slides/SlideBoard.jsx'
import SlideGallery from '../slides/SlideGallery.jsx'
import Portal from './Portal.jsx'
import Torch from './Torch.jsx'

// Coque d'une salle : sol + mur + torches animées + contenu (slides).
function RoomShell({ y, accent, children }) {
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

      {children}

      {/* Torches animées (vacillement + flamme émissive captée par le Bloom). */}
      <Torch position={[-3.6, 1.6, 1.8]} color={accent} intensity={16} distance={13} />
      <Torch position={[3.6, 1.6, 1.8]} color={lostChapter.ember} intensity={16} distance={13} />
    </group>
  )
}

export default function Rooms() {
  return (
    <group>
      {ROOMS.map((r) => (
        <RoomShell key={r.id} y={r.y} accent={r.accent}>
          {/* Hall : la slide titre, en grand. */}
          {r.id === 'hall' && (
            <SlideBoard slide={DECK[0]} accent={r.accent} position={[0, 0.7, -4.5]} size={[5.2, 2.93]} />
          )}
          {/* Sous-sol (archives) : tout le deck en mur de slides. */}
          {r.id === 'soussol' && (
            <SlideGallery slides={DECK} accent={r.accent} center={[0, 0.95, -4.5]} />
          )}
        </RoomShell>
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
