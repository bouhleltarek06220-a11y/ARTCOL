'use client';
/* ===========================================================================
   SmoothScroll — KIT
   Lenis (smooth scroll) synchronisé avec GSAP ScrollTrigger.
   - lisse le défilement (le « scroll est responsable »)
   - publie la progression globale dans scroll-store (lu par le Canvas WebGL)
   - respecte prefers-reduced-motion (accessibilité / mobiles faibles)
   =========================================================================== */
import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scroll } from '@/lib/scroll-store';

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }) {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: !reduce,
      syncTouch: false,
    });

    // Lenis -> store + ScrollTrigger
    lenis.on('scroll', (e) => {
      scroll.progress = e.progress ?? 0;
      scroll.velocity = e.velocity ?? 0;
      ScrollTrigger.update();
    });

    // un seul rAF : GSAP pilote Lenis (synchro parfaite)
    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return children;
}
