'use client';
/* ===========================================================================
   Experience — APPLICATION Hermès
   Compose le kit : fond WebGL (ScrollScenes) + scènes plein écran avec
   titres révélés. Une scène DOM ↔ une texture du shader (alignées au scroll).
   =========================================================================== */
import ScrollScenes from '@/components/kit/ScrollScenes';
import Reveal from '@/components/kit/Reveal';

const SCENES = [
  {
    img: '/assets/img/hero-bag.jpg',
    kicker: 'MAISON HERMÈS · PERPÉTUELLE',
    title: 'Perpétuelle',
    sub: "L'élégance ne se possède pas. Elle se transmet.",
    hero: true,
  },
  {
    img: '/assets/img/atelier.jpg',
    kicker: 'I · LE GESTE',
    title: "L'Atelier",
    sub: "Chaque pièce naît d'une seule paire de mains — le même soin la fait renaître.",
  },
  {
    img: '/assets/img/leather.jpg',
    kicker: 'II · LA MATIÈRE',
    title: 'Le Cuir',
    sub: 'Un cuir ne vieillit pas : il se patine, il se raconte, il se mérite.',
  },
  {
    img: '/assets/img/certification.jpg',
    kicker: 'III · LA CONFIANCE',
    title: 'Certifiée',
    sub: "L'authenticité scellée par la maison. La confiance redevient un actif d'Hermès.",
  },
  {
    img: '/assets/img/revente.jpg',
    kicker: 'IV · LE CYCLE',
    title: 'Revente',
    sub: 'Reprise, restaurée, re-désirée — le cycle reste dans la maison.',
  },
  {
    img: '/assets/img/nouvelle_vie.jpg',
    kicker: 'V · PETIT h',
    title: 'Renaissance',
    sub: 'La matière devient pièce unique. Rien ne se perd, tout se réinvente.',
  },
];

export default function Experience() {
  const images = SCENES.map((s) => s.img);

  return (
    <>
      <ScrollScenes images={images} />

      <nav className="nav">
        <span className="nav-side">La Maison</span>
        <span className="brand">HERMÈS&nbsp;·&nbsp;PERPÉTUELLE</span>
        <span className="nav-side">L'Atelier</span>
      </nav>

      <main className="content">
        {SCENES.map((s, i) => (
          <section className="scene" key={i}>
            <div className={`scene-inner${s.hero ? ' is-hero' : ''}`}>
              <Reveal as="span" className="kicker">{s.kicker}</Reveal>
              <Reveal as="h1" className={s.hero ? 'title title-hero' : 'title'} split>
                {s.title}
              </Reveal>
              <Reveal as="p" className="sub" delay={0.15}>{s.sub}</Reveal>
            </div>
            {s.hero && <div className="scrollhint">défiler<span /></div>}
          </section>
        ))}

        <footer className="footer">
          <Reveal as="p" className="foot-q" delay={0}>
            « D'une logique de transaction à une logique d'écosystème. »
          </Reveal>
          <span className="foot-brand">HERMÈS PERPÉTUELLE</span>
        </footer>
      </main>
    </>
  );
}
