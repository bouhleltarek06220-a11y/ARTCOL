import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ROOMS } from '../config/rooms.js'
import { scroll } from './scrollStore.js'

gsap.registerPlugin(ScrollTrigger)

/**
 * Couche DOM du scroll :
 *  - Lenis fournit le smooth scroll ;
 *  - GSAP ScrollTrigger sert de source de progression (écrite dans `scroll.progress`,
 *    lue par CameraRig) ET révèle les légendes d'étage ;
 *  - les <section> de 100vh génèrent la hauteur de défilement (une par salle).
 *
 * `pointer-events: none` sur le contenu (CSS) laisse la souris atteindre le canvas
 * pour l'effet armure ; Lenis écoute la molette au niveau window, donc le scroll marche.
 */
export default function SmoothScroll() {
  const root = useRef()

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true })
    lenis.on('scroll', ScrollTrigger.update)

    // Lenis piloté par le ticker GSAP (une seule boucle RAF synchronisée).
    const tick = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    // Source de progression 0→1 pilotant la caméra 3D.
    const master = ScrollTrigger.create({
      trigger: root.current,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        scroll.progress = self.progress
      },
    })

    // Révélation des légendes d'étage au scroll.
    const reveals = []
    root.current.querySelectorAll('.floor-caption').forEach((el) => {
      reveals.push(
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 50 },
          {
            autoAlpha: 1,
            y: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: el.closest('.floor'),
              start: 'top 75%',
              end: 'top 35%',
              scrub: true,
            },
          },
        ),
      )
    })

    return () => {
      master.kill()
      reveals.forEach((t) => {
        if (t.scrollTrigger) t.scrollTrigger.kill()
        t.kill()
      })
      gsap.ticker.remove(tick)
      lenis.destroy()
      scroll.progress = 0
    }
  }, [])

  return (
    <main ref={root} className="scroll-content">
      {ROOMS.map((r, i) => (
        <section key={r.id} className="floor">
          <div className="floor-caption" style={{ '--accent': r.accent }}>
            <span className="floor-index">{r.label}</span>
            <p className="floor-sub">{r.subtitle}</p>
          </div>
          {i === 0 && <div className="scroll-hint">défile pour explorer ↓</div>}
        </section>
      ))}
    </main>
  )
}
