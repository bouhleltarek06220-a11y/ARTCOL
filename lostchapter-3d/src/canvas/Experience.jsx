import { Environment, Lightformer } from '@react-three/drei'
import ExplodedArmor from '../components/armor/ExplodedArmor.jsx'
import Rooms from '../components/world/Rooms.jsx'
import CameraRig from './CameraRig.jsx'
import PostFX from './PostFX.jsx'
import { lostChapter } from '../config/theme.js'

export default function Experience() {
  return (
    <>
      {/* Caméra pilotée au scroll. */}
      <CameraRig />

      {/* Brouillard sombre : profondeur entre étages. */}
      <fog attach="fog" args={[lostChapter.brown, 10, 32]} />

      {/* Environnement PBR PROCÉDURAL (Lightformers) — reflets chauds sur le métal
          de l'armure SANS dépendance CDN. `frames={1}` : cubemap bakée une fois (perf). */}
      <Environment resolution={256} frames={1} background={false}>
        <color attach="background" args={[lostChapter.brown]} />
        <Lightformer form="rect" intensity={3} color={lostChapter.goldBright} position={[0, 3, -4]} scale={[6, 3, 1]} />
        <Lightformer form="circle" intensity={2} color={lostChapter.ember} position={[-4, 0, 2]} scale={[3, 3, 1]} />
        <Lightformer form="circle" intensity={2} color={lostChapter.gold} position={[4, 0, 2]} scale={[3, 3, 1]} />
        <Lightformer form="rect" intensity={1.5} color={lostChapter.portal.createurs} position={[0, -3, -3]} scale={[5, 2, 1]} />
      </Environment>

      {/* Éclairage d'appoint global (les torches par salle font le reste). */}
      <ambientLight intensity={0.22} />
      <directionalLight position={[4, 8, 4]} intensity={0.9} color={lostChapter.goldBright} />

      {/* Salles + portail + slides. */}
      <Rooms />

      {/* EFFET SIGNATURE : armure du Hall, décomposée à la souris. */}
      <ExplodedArmor />

      {/* Post-processing : Bloom + Vignette (+ SSAO activable). */}
      <PostFX />
    </>
  )
}
