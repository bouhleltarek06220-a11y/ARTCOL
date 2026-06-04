import { Suspense, useMemo } from 'react'
import { useTexture } from '@react-three/drei'
import { makeSlideTexture } from './placeholderTexture.js'

// Slide à partir d'une vraie image (déposée dans public/slides/).
function ImageSlide({ src }) {
  const tex = useTexture(src)
  return <meshBasicMaterial map={tex} toneMapped={false} />
}

// Slide « stand-in » (canvas) tant qu'aucune image n'est fournie.
function PlaceholderSlide({ label, accent }) {
  const tex = useMemo(() => makeSlideTexture(label, accent), [label, accent])
  return <meshBasicMaterial map={tex} toneMapped={false} />
}

/**
 * Panneau de slide intégré dans une salle.
 * @param {string} [src]   chemin d'une image de slide (sinon : placeholder)
 */
export default function SlideBoard({
  src,
  label = 'Slide',
  accent = '#C99B5C',
  position = [0, 0.7, -4.46],
  size = [5, 2.81],
}) {
  return (
    <mesh position={position}>
      <planeGeometry args={size} />
      {src ? (
        <Suspense fallback={<meshBasicMaterial color={accent} toneMapped={false} />}>
          <ImageSlide src={src} />
        </Suspense>
      ) : (
        <PlaceholderSlide label={label} accent={accent} />
      )}
    </mesh>
  )
}
