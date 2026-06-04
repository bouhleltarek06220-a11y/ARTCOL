import ExplodedArmor from '../components/armor/ExplodedArmor.jsx'
import Rooms from '../components/world/Rooms.jsx'
import CameraRig from './CameraRig.jsx'
import { lostChapter } from '../config/theme.js'

export default function Experience() {
  return (
    <>
      {/* Caméra pilotée au scroll (remplace OrbitControls). */}
      <CameraRig />

      {/* Brouillard sombre : estompe les étages lointains, garde la salle courante nette. */}
      <fog attach="fog" args={[lostChapter.brown, 10, 32]} />

      {/* Éclairage global (l'HDRI <Environment> arrive à l'étape 5). */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[4, 8, 4]} intensity={1.2} color={lostChapter.goldBright} />

      {/* Les salles / étages navigables. */}
      <Rooms />

      {/* EFFET SIGNATURE : armure du Hall (étage 0), décomposée à la souris.
          Stand-in procédural prêt pour le GLB Meshy (cf. components/armor/explodedData.js). */}
      <ExplodedArmor />
    </>
  )
}
