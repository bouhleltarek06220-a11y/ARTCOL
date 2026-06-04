import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { lostChapter } from '../../config/theme.js'

/**
 * Torche animée : lumière ponctuelle qui vacille + petite flamme émissive
 * (captée par le Bloom). PERF : flicker par mutation de refs dans useFrame,
 * aucun setState.
 */
export default function Torch({
  position = [0, 0, 0],
  color = lostChapter.ember,
  intensity = 16,
  distance = 13,
}) {
  const light = useRef()
  const flame = useRef()
  const seed = useMemo(() => Math.random() * 10, [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    // Somme de sinus à fréquences premières → vacillement organique non répétitif.
    const f =
      0.82 +
      Math.sin(t * 12 + seed) * 0.06 +
      Math.sin(t * 19 + seed * 2) * 0.05 +
      Math.sin(t * 31 + seed) * 0.03
    if (light.current) light.current.intensity = intensity * f
    if (flame.current) flame.current.scale.setScalar(0.85 + (f - 0.82) * 1.2)
  })

  return (
    <group position={position}>
      <pointLight ref={light} color={color} intensity={intensity} distance={distance} />
      <mesh ref={flame}>
        <sphereGeometry args={[0.09, 12, 12]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
    </group>
  )
}
