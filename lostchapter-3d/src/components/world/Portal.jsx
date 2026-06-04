import { Suspense } from 'react'
import { MeshTransmissionMaterial, Sparkles, useTexture, useVideoTexture } from '@react-three/drei'
import { DoubleSide } from 'three'
import { lostChapter } from '../../config/theme.js'

// Artwork du portail (image Higgsfield) : fournit le cadre de pierre + l'anneau d'énergie.
function PortalArtwork({ src, size }) {
  const tex = useTexture(src)
  return (
    <mesh position={[0, 0.78, -0.35]}>
      <planeGeometry args={size} />
      <meshBasicMaterial map={tex} toneMapped={false} />
    </mesh>
  )
}

// Centre animé du portail (vidéo Kling) — affiché par-dessus le centre de l'artwork.
function InnerRealmVideo({ src }) {
  const tex = useVideoTexture(src, {
    muted: true,
    loop: true,
    start: true,
    playsInline: true,
    crossOrigin: 'anonymous',
  })
  return (
    <mesh position={[0, 0.78, -0.28]}>
      <circleGeometry args={[1.12, 48]} />
      <meshBasicMaterial map={tex} toneMapped={false} />
    </mesh>
  )
}

// Fallback procédural si aucune image n'est fournie.
function ProceduralRealm({ accent }) {
  return (
    <group position={[0, 0.78, -0.35]}>
      <mesh>
        <planeGeometry args={[4.9, 2.74]} />
        <meshBasicMaterial color={lostChapter.brown} toneMapped={false} />
      </mesh>
      <Sparkles count={40} scale={[4, 2.4, 1]} size={3} speed={0.4} color={accent} />
    </group>
  )
}

/**
 * Portail vers un autre monde (Crypte).
 *  - `imageSrc` : artwork Higgsfield (cadre + anneau) ;
 *  - `videoSrc` : vidéo Kling qui anime le centre (optionnelle) ;
 *  - une vitre `MeshTransmissionMaterial` ajoute un miroitement/réfraction live.
 */
export default function Portal({
  y = -16,
  accent = lostChapter.portal.createurs,
  imageSrc,
  videoSrc,
  size = [4.9, 2.74],
}) {
  return (
    <group position={[0, y, -4.0]}>
      {/* Artwork (cadre + anneau d'énergie) */}
      {imageSrc ? (
        <Suspense fallback={<ProceduralRealm accent={accent} />}>
          <PortalArtwork src={imageSrc} size={size} />
        </Suspense>
      ) : (
        <ProceduralRealm accent={accent} />
      )}

      {/* Centre animé (Kling) par-dessus l'artwork */}
      {videoSrc && (
        <Suspense fallback={null}>
          <InnerRealmVideo src={videoSrc} />
        </Suspense>
      )}

      {/* Vitre transmissive : miroitement + réfraction de l'autre monde */}
      <mesh position={[0, 0.78, -0.14]}>
        <circleGeometry args={[1.2, 64]} />
        <MeshTransmissionMaterial
          transmission={1}
          thickness={0.4}
          roughness={0.12}
          ior={1.2}
          chromaticAberration={0.2}
          distortion={0.35}
          distortionScale={0.3}
          temporalDistortion={0.15}
          backside
          side={DoubleSide}
          color={accent}
        />
      </mesh>

      {/* Particules magiques + halo */}
      <Sparkles count={36} scale={[2.6, 2, 0.6]} position={[0, 0.78, 0]} size={3} speed={0.4} color={accent} />
      <pointLight position={[0, 0.78, 1.6]} intensity={18} distance={10} color={accent} />
    </group>
  )
}
