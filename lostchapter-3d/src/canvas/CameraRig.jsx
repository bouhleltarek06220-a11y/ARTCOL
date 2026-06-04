import { useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { MathUtils, Vector3 } from 'three'
import { CAMERA_KEYFRAMES } from '../config/rooms.js'
import { scroll } from '../scroll/scrollStore.js'

/**
 * Caméra pilotée au scroll : interpole entre les keyframes d'étage selon
 * `scroll.progress` (écrit par ScrollTrigger côté DOM).
 *
 * PERF : lecture d'un store muté (pas de state), keyframes pré-calculées en
 * Vector3, deux vecteurs temporaires réutilisés → zéro allocation par frame.
 */
export default function CameraRig() {
  const camera = useThree((s) => s.camera)

  const kf = useMemo(
    () =>
      CAMERA_KEYFRAMES.map((k) => ({
        pos: new Vector3(...k.pos),
        look: new Vector3(...k.look),
      })),
    [],
  )
  const tmpPos = useMemo(() => new Vector3(), [])
  const tmpLook = useMemo(() => new Vector3(), [])

  useFrame(() => {
    const n = kf.length
    if (n === 0) return
    if (n === 1) {
      camera.position.copy(kf[0].pos)
      camera.lookAt(kf[0].look)
      return
    }
    // progress [0,1] → segment entre deux étages, avec un easing smoothstep.
    const seg = MathUtils.clamp(scroll.progress, 0, 1) * (n - 1)
    const i = Math.min(Math.floor(seg), n - 2)
    const f = MathUtils.smoothstep(seg - i, 0, 1)
    tmpPos.copy(kf[i].pos).lerp(kf[i + 1].pos, f)
    tmpLook.copy(kf[i].look).lerp(kf[i + 1].look, f)
    camera.position.copy(tmpPos)
    camera.lookAt(tmpLook)
  })

  return null
}
