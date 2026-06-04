import { Suspense } from 'react'
import { MeshTransmissionMaterial, Sparkles, Float, useVideoTexture } from '@react-three/drei'
import { DoubleSide } from 'three'
import { lostChapter } from '../../config/theme.js'

// "Autre monde" en vidéo (Kling) — utilisé seulement si une source est fournie.
function OtherWorldVideo({ src }) {
  const tex = useVideoTexture(src, {
    muted: true,
    loop: true,
    start: true,
    playsInline: true,
    crossOrigin: 'anonymous',
  })
  return (
    <mesh position={[0, 0.7, -0.4]}>
      <planeGeometry args={[4.6, 2.7]} />
      <meshBasicMaterial map={tex} toneMapped={false} />
    </mesh>
  )
}

// Fallback procédural si aucune vidéo : formes flottantes + particules dans l'accent.
function OtherWorldFallback({ accent }) {
  return (
    <group position={[0, 0.7, -0.45]}>
      <mesh>
        <planeGeometry args={[4.6, 2.7]} />
        <meshBasicMaterial color={lostChapter.brown} toneMapped={false} />
      </mesh>
      <Float speed={2} rotationIntensity={1.2} floatIntensity={1.6}>
        <mesh position={[-0.9, 0.2, 0.3]}>
          <icosahedronGeometry args={[0.36, 0]} />
          <meshBasicMaterial color={accent} wireframe toneMapped={false} />
        </mesh>
      </Float>
      <Float speed={1.5} rotationIntensity={1} floatIntensity={1.2}>
        <mesh position={[0.95, -0.1, 0.5]}>
          <octahedronGeometry args={[0.32, 0]} />
          <meshBasicMaterial color={lostChapter.goldBright} wireframe toneMapped={false} />
        </mesh>
      </Float>
      <Sparkles count={40} scale={[4.4, 2.6, 1]} size={3} speed={0.4} color={accent} />
    </group>
  )
}

/**
 * Portail vers un autre monde (Crypte) : arche + vitre transmissive (MeshTransmissionMaterial)
 * qui réfracte « l'autre monde » placé derrière (vidéo Kling ou fallback procédural).
 *
 * @param {string} [videoSrc] vidéo de l'autre monde (sinon : fallback)
 */
export default function Portal({ y = -16, accent = lostChapter.portal.createurs, videoSrc }) {
  return (
    <group position={[0, y, -4.2]}>
      {/* Arche du portail */}
      <mesh position={[0, 0.7, -0.12]}>
        <torusGeometry args={[1.72, 0.12, 16, 64]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={0.6}
          metalness={0.8}
          roughness={0.3}
          toneMapped={false}
        />
      </mesh>

      {/* L'autre monde (réfracté par la vitre) */}
      {videoSrc ? (
        <Suspense fallback={<OtherWorldFallback accent={accent} />}>
          <OtherWorldVideo src={videoSrc} />
        </Suspense>
      ) : (
        <OtherWorldFallback accent={accent} />
      )}

      {/* Vitre du portail : transmission/réfraction */}
      <mesh position={[0, 0.7, 0]}>
        <circleGeometry args={[1.62, 64]} />
        <MeshTransmissionMaterial
          transmission={1}
          thickness={0.6}
          roughness={0.15}
          ior={1.25}
          chromaticAberration={0.25}
          distortion={0.4}
          distortionScale={0.4}
          temporalDistortion={0.2}
          backside
          side={DoubleSide}
          color={accent}
        />
      </mesh>

      <pointLight position={[0, 0.7, 1.6]} intensity={22} distance={11} color={accent} />
    </group>
  )
}
