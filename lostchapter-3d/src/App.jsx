import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Loader } from '@react-three/drei'
import Experience from './canvas/Experience.jsx'
import SmoothScroll from './scroll/SmoothScroll.jsx'
import { lostChapter } from './config/theme.js'

export default function App() {
  return (
    <>
      {/* Canvas 3D en fond fixe (cf. .canvas-wrap dans styles.css). */}
      <div className="canvas-wrap">
        <Canvas
          // PERF : devicePixelRatio plafonné à [1, 2].
          dpr={[1, 2]}
          // Caméra initiale = keyframe du Hall (étage 0).
          camera={{ position: [0, 0.6, 7.5], fov: 42 }}
          gl={{ antialias: true }}
        >
          <color attach="background" args={[lostChapter.brown]} />
          <Suspense fallback={null}>
            <Experience />
          </Suspense>
        </Canvas>
      </div>

      {/* Loader drei : progression de chargement des assets. */}
      <Loader />

      {/* Couche scroll (Lenis + GSAP ScrollTrigger) : génère la navigation entre étages. */}
      <SmoothScroll />
    </>
  )
}
