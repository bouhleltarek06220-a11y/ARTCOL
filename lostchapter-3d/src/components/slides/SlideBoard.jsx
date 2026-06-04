import { Suspense, useMemo } from 'react'
import { useTexture } from '@react-three/drei'
import { makeSlideTexture } from './placeholderTexture.js'

// Slide à partir d'une vraie image (déposée dans public/slides/).
function ImageSlide({ src }) {
  const tex = useTexture(src)
  return <meshBasicMaterial map={tex} toneMapped={false} />
}

// Slide rendue en canvas à partir de son contenu (titre + puces).
function CanvasSlide({ slide, accent }) {
  const tex = useMemo(() => makeSlideTexture(slide, accent), [slide, accent])
  return <meshBasicMaterial map={tex} toneMapped={false} />
}

/**
 * Panneau de slide intégré dans une salle.
 * @param {object} [slide]  contenu { eyebrow, title, lines } (rendu canvas)
 * @param {string} [image]  chemin d'une image de slide (prioritaire sur `slide`)
 */
export default function SlideBoard({
  slide,
  image,
  accent = '#C99B5C',
  position = [0, 0.7, -4.5],
  size = [5, 2.81],
}) {
  return (
    <mesh position={position}>
      <planeGeometry args={size} />
      {image ? (
        <Suspense fallback={<meshBasicMaterial color={accent} toneMapped={false} />}>
          <ImageSlide src={image} />
        </Suspense>
      ) : (
        <CanvasSlide slide={slide} accent={accent} />
      )}
    </mesh>
  )
}
