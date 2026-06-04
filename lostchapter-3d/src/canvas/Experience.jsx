import { OrbitControls } from '@react-three/drei'
import ExplodedArmor from '../components/armor/ExplodedArmor.jsx'
import { lostChapter } from '../config/theme.js'

export default function Experience() {
  return (
    <>
      {/* Éclairage minimal (l'HDRI <Environment> arrive à l'étape 5). */}
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 6, 3]} intensity={1.6} color={lostChapter.goldBright} />
      <pointLight position={[-4, -2, -3]} intensity={12} color={lostChapter.ember} distance={14} />

      {/* EFFET SIGNATURE : armure qui se décompose/recompose à la souris.
          Stand-in procédural, prêt à recevoir le GLB Meshy (cf. components/armor/explodedData.js). */}
      <ExplodedArmor />

      {/* Inspection libre à l'étape 2 ; la caméra sera pilotée au scroll à l'étape 3. */}
      <OrbitControls enablePan={false} enableZoom={false} />
    </>
  )
}
