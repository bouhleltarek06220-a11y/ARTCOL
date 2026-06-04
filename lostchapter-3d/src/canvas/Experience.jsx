import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { lostChapter } from '../config/theme.js'

/**
 * Objet témoin du scaffold (étape 1) : un icosaèdre doré qui tourne.
 * Il valide que le pipeline R3F (renderer + drei + boucle de rendu) fonctionne.
 * Remplacé à l'étape 2 par l'armure (composant Armor / ExplodedArmor).
 *
 * PERF : la rotation se fait par MUTATION directe du ref dans useFrame
 * (jamais de setState dans la boucle de rendu — règle non négociable).
 */
function Placeholder() {
  const ref = useRef()

  useFrame((_, delta) => {
    if (!ref.current) return
    ref.current.rotation.x += delta * 0.25
    ref.current.rotation.y += delta * 0.4
  })

  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[1.1, 0]} />
      <meshStandardMaterial
        color={lostChapter.gold}
        metalness={0.9}
        roughness={0.25}
        emissive={lostChapter.ember}
        emissiveIntensity={0.08}
        flatShading
      />
    </mesh>
  )
}

export default function Experience() {
  return (
    <>
      {/* Éclairage minimal du scaffold (l'HDRI <Environment> arrive à l'étape 5). */}
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 6, 3]} intensity={1.6} color={lostChapter.goldBright} />
      <pointLight position={[-4, -2, -3]} intensity={12} color={lostChapter.ember} distance={14} />

      <Placeholder />

      {/* Contrôles de debug pour l'étape 1 (la caméra sera pilotée au scroll à l'étape 3). */}
      <OrbitControls enablePan={false} enableZoom={false} />
    </>
  )
}
