import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Loader } from '@react-three/drei'
import Experience from './canvas/Experience.jsx'
import { lostChapter } from './config/theme.js'

export default function App() {
  return (
    <>
      <Canvas
        // PERF : devicePixelRatio plafonné à [1, 2] pour éviter de saturer le GPU sur écrans HiDPI.
        dpr={[1, 2]}
        camera={{ position: [0, 0, 7], fov: 42 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={[lostChapter.brown]} />
        {/* PERF : Suspense pour le chargement asynchrone des assets (GLB/HDRI à venir). */}
        <Suspense fallback={null}>
          <Experience />
        </Suspense>
      </Canvas>

      {/* Loader drei : barre de progression pendant le chargement des assets. */}
      <Loader />

      <div className="overlay">
        <h1>Lost Chapter</h1>
        <p>Bouge la souris — l'armure se décompose et se recompose · étape 2 (stand-in)</p>
      </div>
    </>
  )
}
