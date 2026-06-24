'use client';
/* ===========================================================================
   Reveal — KIT
   Révélation d'un élément (titre, texte) à l'entrée dans le viewport.
   Mots découpés en cascade pour les titres (split=true).
   =========================================================================== */
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Reveal({ children, as: Tag = 'div', split = false, className, delay = 0 }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let targets = [el];
    if (split && typeof children === 'string') {
      el.innerHTML = children
        .split(' ')
        .map((w) => `<span class="rv-word"><span>${w}</span></span>`)
        .join(' ');
      targets = el.querySelectorAll('.rv-word > span');
    }

    if (reduce) {
      gsap.set(targets, { y: 0, opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(targets, { yPercent: 110, opacity: 0 });
      gsap.to(targets, {
        yPercent: 0,
        opacity: 1,
        duration: 1.1,
        ease: 'power3.out',
        stagger: split ? 0.06 : 0,
        delay,
        scrollTrigger: { trigger: el, start: 'top 85%' },
      });
    }, el);

    return () => ctx.revert();
  }, [children, split, delay]);

  return <Tag ref={ref} className={className}>{split ? '' : children}</Tag>;
}
