/* ============================================================
   HERMÈS · PERPÉTUELLE — app.js
   ============================================================ */
(function () {
  'use strict';
  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
  const reduce = window.matchMedia('(prefers-reduced-motion:reduce)').matches;

  /* ---------- DATA ---------- */
  const PESTEL = {
    P:  { key:'Politique', title:'Une transformation pilotée par l’État',
          body:'Vision 2030 fait de la diversification économique une priorité nationale. Les mégaprojets luxe — NEOM, Red Sea Project, Diriyah, Qiddiya — sont valorisés à plus de 63,2 milliards de dollars, créant un écosystème premium inédit.',
          tag:'<span class="tag tag-fait">Fait</span>' },
    E:  { key:'Économique', title:'Un marché du luxe en pleine accélération',
          body:'Le marché du luxe saoudien passe de 10,1 milliards de dollars (2024) à 23,3 milliards projetés en 2033, soit un CAGR de 9,7 %. Le nombre de millionnaires devrait être multiplié par huit entre 2024 et 2025.',
          tag:'<span class="tag tag-fait">Fait</span>' },
    S:  { key:'Sociétal', title:'Les femmes, moteur de la consommation',
          body:'La participation des femmes au marché du travail est passée de 23,2 % (2016) à 34,5 % (2023). Elles constituent le plus gros segment de consommation luxe, avec des dépenses 55 % supérieures à celles des hommes. C’est le facteur le plus fort.',
          tag:'<span class="tag tag-fait">Fait</span>' },
    T:  { key:'Technologique', title:'Aucune friction d’infrastructure',
          body:'Les paiements électroniques représentent 79 % des transactions retail en 2024, 85 % en 2025 (source : Banque centrale saoudienne). Le terrain est mûr pour une plateforme 100 % digitale.',
          tag:'<span class="tag tag-fait">Fait</span>' },
    EN: { key:'Écologique', title:'L’upcycling déjà légitimé par l’État',
          body:'L’upcycling textile est activement promu par la Fashion Commission (Ministère de la Culture), avec des partenariats internationaux existants (Kering Generation Awards). L’angle upcycling n’est donc pas plaqué — il s’inscrit dans une dynamique nationale.',
          tag:'<span class="tag tag-fait">Fait</span>' },
    L:  { key:'Légal', title:'Un cadre favorable au vendeur particulier',
          body:'Taxe à l’import sur le luxe jusqu’à 15 %, tarif douanier commun CCG de 5 % minimum, TVA à 15 % pour l’entreprise. Mais le particulier qui revend une pièce d’occasion n’a aucune charge fiscale ni formalité — vérifié, ce n’est pas un point de friction côté vendeur.',
          tag:'<span class="tag tag-fait">Fait</span>' }
  };

  const COMPETITORS = [
    { wm:'Vestiaire<br>Collective', sans:true, cat:'Revente C2C', group:'Indépendant',
      focus:'Marketplace mondiale de seconde main multi-marques, modèle C2C/B2C.',
      edge:'Aucune autorité d’authentification sur les pièces Hermès — elle reste un tiers.' },
    { wm:'THE REALREAL', sans:true, cat:'Revente luxe consignée', group:'Indépendant (coté)',
      focus:'Consignation de luxe, authentification interne, fort volume US.',
      edge:'Authentifie « de l’extérieur » ; ni restauration ni création, contrairement à la maison.' },
    { wm:'ROLEX', sans:false, cat:'Certified Pre-Owned', group:'Indépendant (fondation)',
      focus:'Programme CPO officiel : garantie maison sur les montres d’occasion.',
      edge:'Modèle inspirant — mais sur l’horlogerie, pas sur la maroquinerie ni l’upcycling.' },
    { wm:'BURBERRY', sans:true, cat:'Programme de marque', group:'Indépendant',
      focus:'Initiatives de reprise/circularité portées par la marque.',
      edge:'Désirabilité et savoir-faire de restauration sans commune mesure avec Hermès.' },
    { wm:'GUCCI', sans:false, cat:'Re-commerce', group:'Groupe Kering',
      focus:'Expériences de revente (ex. Gucci Vault) — re-commerce de marque.',
      edge:'Appartient à un groupe concurrent ; Hermès reste indépendante et maîtresse de sa rareté.' }
  ];

  const PORTER = [
    { t:'Nouveaux entrants',       lvl:'Faible', cls:'faible', pct:24, note:'Légitimité & authentification que seule Hermès possède sur ses pièces.' },
    { t:'Pouvoir des vendeurs',    lvl:'Moyen',  cls:'moyen',  pct:50, note:'Faible côté fiscal/administratif, sensible côté confiance et prix proposé.' },
    { t:'Pouvoir des acheteurs',   lvl:'Moyen',  cls:'moyen',  pct:46, note:'Faible sur l’upcycling (pièce unique), plus élevé sur la revente restaurée.' },
    { t:'Produits de substitution',lvl:'Élevé',  cls:'eleve',  pct:82, note:'Circuits informels déjà ancrés culturellement — le vrai risque identifié.' },
    { t:'Intensité concurrentielle',lvl:'Moyen', cls:'moyen',  pct:44, note:'Faible sur l’upcycling (non réplicable), moyenne sur la revente classique.' }
  ];

  /* ============================================================
     PRELOADER
     ============================================================ */
  const pre = $('#preloader');
  function runPreloader(done) {
    const bar = $('.pre-bar i'), pct = $('.pre-pct');
    let p = 0;
    requestAnimationFrame(() => pre.classList.add('go'));
    const tick = setInterval(() => {
      p += Math.random() * 14 + 4;
      if (p >= 100) { p = 100; clearInterval(tick); setTimeout(finish, 450); }
      bar.style.width = p + '%';
      pct.textContent = Math.floor(p);
    }, 130);
    function finish() {
      pre.classList.add('done');
      done && done();
    }
  }

  /* ============================================================
     LENIS SMOOTH SCROLL + GSAP
     ============================================================ */
  let lenis;
  function initScroll() {
    gsap.registerPlugin(ScrollTrigger);
    if (!reduce && window.Lenis) {
      lenis = new Lenis({ duration: 1.15, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(t => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    }
  }
  function scrollTo(target) {
    if (lenis) lenis.scrollTo(target, { offset: 0, duration: 1.4 });
    else target.scrollIntoView({ behavior: 'smooth' });
  }

  /* ============================================================
     NAV DOTS + PROGRESS
     ============================================================ */
  function initNav() {
    const secs = $$('.sec');
    const dots = $('#dots');
    secs.forEach(s => {
      const b = document.createElement('button');
      b.setAttribute('data-label', s.dataset.name || '');
      b.addEventListener('click', () => scrollTo(s));
      dots.appendChild(b);
    });
    const dotEls = $$('button', dots);
    const prog = $('#progress i');

    ScrollTrigger.create({
      start: 0, end: 'max',
      onUpdate: self => { prog.style.width = (self.progress * 100) + '%'; }
    });
    secs.forEach((s, i) => {
      ScrollTrigger.create({
        trigger: s, start: 'top center', end: 'bottom center',
        onToggle: self => { if (self.isActive) {
          dotEls.forEach(d => d.classList.remove('active'));
          dotEls[i] && dotEls[i].classList.add('active');
        }}
      });
    });

    // hide scroll hint after first scroll
    const hint = $('#scrollHint');
    ScrollTrigger.create({ start: 80, onEnter: () => hint.classList.add('hide'), onLeaveBack: () => hint.classList.remove('hide') });
  }

  /* ============================================================
     GENERIC REVEAL
     ============================================================ */
  function initReveals() {
    $$('.reveal-up').forEach((el, i) => {
      ScrollTrigger.create({
        trigger: el, start: 'top 86%',
        onEnter: () => gsap.to(el, { opacity:1, y:0, duration:1, ease:'power3.out', delay:(i%4)*0.06,
          onStart:()=>el.classList.add('in') })
      });
    });
  }

  /* ============================================================
     HERO LINE SEQUENCE
     ============================================================ */
  function initHero() {
    const lines = $$('.hl');
    const kicker = $('.hero .kicker');
    const q = $('.hero-q');
    gsap.set([kicker, q], { opacity:0, y:24 });
    const tl = gsap.timeline({ delay: 0.3 });
    tl.to(kicker, { opacity:1, y:0, duration:1, ease:'power3.out' });
    lines.forEach((l, i) => {
      tl.fromTo(l, { opacity:0, y:30, filter:'blur(8px)' },
        { opacity:1, y:0, filter:'blur(0px)', duration:1, ease:'power3.out' }, i===0 ? '>-0.2' : '>0.7');
      if (i < lines.length - 1)
        tl.to(l, { opacity:0, y:-26, filter:'blur(6px)', duration:0.8, ease:'power2.in' }, '>0.9');
    });
    tl.to(q, { opacity:1, y:0, duration:1.1, ease:'power3.out' }, '>0.2');
  }

  /* ============================================================
     COUNT-UP
     ============================================================ */
  function fmt(n, dec) {
    return n.toLocaleString('fr-FR', { minimumFractionDigits: dec, maximumFractionDigits: dec });
  }
  function countTo(el, target, dec) {
    const o = { v: 0 };
    gsap.to(o, { v: target, duration: 2, ease: 'power2.out',
      onUpdate: () => { el.textContent = fmt(o.v, dec); } });
  }
  function initCounts() {
    // .stat blocks (S2)
    $$('.stat').forEach(st => {
      const target = parseFloat(st.dataset.count);
      const numEl = $('.num', st);
      ScrollTrigger.create({ trigger: st, start: 'top 85%', once: true,
        onEnter: () => countTo(numEl, target, 0) });
    });
    // span[data-count] (S4, S12)
    $$('span[data-count]').forEach(sp => {
      const target = parseFloat(sp.dataset.count);
      const dec = parseInt(sp.dataset.dec || '0', 10);
      ScrollTrigger.create({ trigger: sp, start: 'top 90%', once: true,
        onEnter: () => countTo(sp, target, dec) });
    });
  }

  /* ============================================================
     PESTEL SPHERE
     ============================================================ */
  const PESTEL_ICONS = {
    P:'<path d="M3 21h18M5 21V10M19 21V10M3 10l9-6 9 6M9 21v-7h6v7"/>',
    E:'<path d="M3 17l6-6 4 4 7-7M15 8h5v5"/>',
    S:'<circle cx="9" cy="8" r="3"/><path d="M3.5 20c0-3.3 2.5-6 5.5-6s5.5 2.7 5.5 6M16.5 5.2A3 3 0 0117 11M20.5 20c0-2.4-1.4-4.5-3.5-5.5"/>',
    T:'<rect x="6" y="6" width="12" height="12" rx="1"/><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3"/>',
    EN:'<path d="M11 20A7 7 0 014 13C4 8 10 4 20 3c0 9-4 16-9 17zM4.5 20.5c2.5-3 5.5-5 8.5-6"/>',
    L:'<path d="M12 3v18M5.5 21h13M12 5l-6.5 2 3.2 5.3a3 3 0 01-6.4 0L5.5 7M12 5l6.5 2-3.2 5.3a3 3 0 006.4 0L18.5 7"/>'
  };

  function initPestel() {
    const orbit = $('#pestelOrbit');
    const detail = $('#pestelDetail');
    const order = ['P','E','S','T','EN','L'];
    detail.innerHTML = '<div class="pd-empty">Cliquez une icône pour ouvrir l’analyse →</div>';

    const R = 39; // % radius
    const cards = order.map((k, i) => {
      const ang = (-90 + i * 60) * Math.PI / 180;
      const x = 50 + Math.cos(ang) * R, y = 50 + Math.sin(ang) * R;
      const b = document.createElement('button');
      b.className = 'po-card'; b.dataset.key = k;
      b.style.left = x + '%'; b.style.top = y + '%';
      b.setAttribute('aria-label', PESTEL[k].key);
      b.innerHTML =
        '<div class="po-inner">' +
          '<div class="po-face po-front"><svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">' + PESTEL_ICONS[k] + '</svg>' +
            '<span class="po-letter">' + (k === 'EN' ? 'E' : k) + '</span><span class="po-name">' + PESTEL[k].key + '</span></div>' +
          '<div class="po-face po-back"><span class="po-letter">' + (k === 'EN' ? 'E' : k) + '</span><small>ouvrir</small></div>' +
        '</div>';
      b.addEventListener('click', () => select(k));
      orbit.appendChild(b);
      return b;
    });

    function select(key) {
      cards.forEach(c => c.classList.toggle('active', c.dataset.key === key));
      const d = PESTEL[key];
      detail.style.opacity = 0;
      setTimeout(() => {
        detail.innerHTML =
          '<div class="pd-key"><svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">' + PESTEL_ICONS[key] + '</svg>' + d.key + '</div>' +
          '<h3>' + d.title + '</h3>' +
          '<p>' + d.body + '</p>' +
          '<div class="pd-tags">' + d.tag + '</div>';
        detail.style.transition = 'opacity .5s';
        detail.style.opacity = 1;
      }, 200);
    }

    // scatter -> circle reveal
    if (!reduce && window.gsap) {
      cards.forEach((c, i) => {
        gsap.from(c, {
          x: (Math.random() - 0.5) * 420, y: (Math.random() - 0.5) * 320,
          rotation: (Math.random() - 0.5) * 120, opacity: 0, scale: 0.4,
          duration: 1.1, ease: 'power3.out', delay: 0.1 + i * 0.08,
          scrollTrigger: { trigger: '#s5', start: 'top 60%' }
        });
      });
    }
  }

  /* ============================================================
     ARENA (concurrence)
     ============================================================ */
  function initArena() {
    const ring = $('#arRing');
    const n = COMPETITORS.length;
    const radius = 300;
    const nodes = COMPETITORS.map((c, i) => {
      const ang = i * (360 / n);
      const el = document.createElement('div');
      el.className = 'ar-node';
      el.dataset.ang = ang;
      el.innerHTML =
        '<div class="ar-card">' +
          '<div class="ar-wm' + (c.sans ? ' sans' : '') + '">' + c.wm + '</div>' +
          '<div class="ar-cat">' + c.cat + '</div>' +
        '</div>';
      el.querySelector('.ar-card').addEventListener('click', e => { e.stopPropagation(); openModal(c); });
      ring.appendChild(el);
      return el;
    });

    let rotY = 0, vel = 0, down = false, lastX = 0, dragMoved = false, auto = true;
    function place() {
      nodes.forEach(el => {
        const a = parseFloat(el.dataset.ang) + rotY;
        // each card sits on a horizontal ring, facing outward; counter-rotate to face camera
        el.style.transform = 'rotateY(' + a + 'deg) translateZ(' + radius + 'px) rotateY(' + (-a) + 'deg)';
        const rad = a * Math.PI / 180;
        const depth = Math.cos(rad); // -1 (back) .. 1 (front)
        const card = el.firstChild;
        card.style.opacity = (0.45 + 0.55 * (depth + 1) / 2).toFixed(3);
        el.style.zIndex = Math.round(100 + depth * 100);
        card.style.filter = depth < 0 ? 'blur(.4px)' : 'none';
      });
    }
    function loop() {
      if (!down) { if (auto) vel += 0.02; rotY += vel; vel *= 0.94; if (Math.abs(vel) < 0.002) vel = 0; }
      place(); requestAnimationFrame(loop);
    }
    const start = e => { down = true; auto = false; dragMoved = false; ring.classList.add('grab');
      lastX = (e.touches ? e.touches[0] : e).clientX; vel = 0; };
    const move = e => { if (!down) return; const x = (e.touches ? e.touches[0] : e).clientX;
      const dx = x - lastX; if (Math.abs(dx) > 3) dragMoved = true; rotY += dx * 0.35; vel = dx * 0.35; lastX = x; };
    const end = () => { if (!down) return; down = false; ring.classList.remove('grab');
      setTimeout(() => { auto = true; }, 2500); };
    ring.addEventListener('mousedown', start); window.addEventListener('mousemove', move); window.addEventListener('mouseup', end);
    ring.addEventListener('touchstart', start, { passive: true }); window.addEventListener('touchmove', move, { passive: true }); window.addEventListener('touchend', end);
    place(); loop();

    // modal
    let modal = $('#arModal');
    if (!modal) {
      modal = document.createElement('div'); modal.id = 'arModal'; modal.className = 'ar-modal';
      modal.innerHTML = '<div class="ar-modal-box"><button class="ar-close" aria-label="Fermer">&times;</button><div class="m-content"></div></div>';
      document.body.appendChild(modal);
      modal.addEventListener('click', e => { if (e.target === modal || e.target.classList.contains('ar-close')) modal.classList.remove('open'); });
      document.addEventListener('keydown', e => { if (e.key === 'Escape') modal.classList.remove('open'); });
    }
    function openModal(c) {
      $('.m-content', modal).innerHTML =
        '<div class="m-wm">' + c.wm.replace('<br>', ' ') + '</div>' +
        '<div class="m-cat">' + c.cat + '</div>' +
        '<div class="m-row"><span class="m-k">Groupe</span><span class="m-v">' + c.group + '</span></div>' +
        '<div class="m-row"><span class="m-k">Positionnement</span><span class="m-v">' + c.focus + '</span></div>' +
        '<div class="m-row"><span class="m-k">L’avantage d’Hermès</span><span class="m-v m-edge">' + c.edge + '</span></div>';
      modal.classList.add('open');
    }

    if (!reduce && window.gsap) {
      gsap.from(nodes, { opacity: 0, scale: 0.5, duration: 0.8, ease: 'back.out(1.5)', stagger: 0.08,
        scrollTrigger: { trigger: '#s6', start: 'top 65%' } });
    }
  }

  /* ============================================================
     CARDSTACK (fan carousel) — vanilla port, used by SWOT & Porter
     ============================================================ */
  function cardStack(rootSel, items, opts) {
    opts = opts || {};
    const root = $(rootSel); if (!root) return;
    const len = items.length;
    const maxOffset = opts.maxOffset || 2;
    const spreadDeg = opts.spreadDeg != null ? opts.spreadDeg : 26;
    const depth = opts.depth || 130;
    const stage = document.createElement('div'); stage.className = 'cs-stage'; stage.tabIndex = 0;
    root.appendChild(stage);
    const dots = document.createElement('div'); dots.className = 'cs-dots';
    root.appendChild(dots);

    let active = 0, cw = 480, ch = 320, spacing = 250;
    function measure() {
      const w = root.clientWidth || 900;
      cw = Math.min(480, Math.max(260, w * 0.40));
      ch = Math.round(cw * 0.66);
      spacing = Math.round(cw * 0.52);
      stage.style.height = (ch + 90) + 'px';
    }

    const cards = items.map((it, i) => {
      const c = document.createElement('article');
      c.className = 'cs-card';
      c.innerHTML =
        (it.bg ? '<img class="cs-bg" src="' + it.bg + '" alt="" draggable="false"/>' : '') +
        '<div class="cs-veil"></div>' +
        '<div class="cs-body">' +
          '<span class="cs-ix">' + it.ix + '</span>' +
          (it.badge ? '<span class="cs-badge">' + it.badge + '</span>' : '') +
          '<h3 class="cs-title">' + it.title + '</h3>' +
          (it.sub ? '<div class="cs-sub">' + it.sub + '</div>' : '') +
          it.body +
        '</div>';
      c.addEventListener('click', () => { if (i !== active) go(i); });
      stage.appendChild(c);
      const d = document.createElement('button'); d.setAttribute('aria-label', it.title);
      d.addEventListener('click', () => go(i)); dots.appendChild(d);
      return c;
    });
    const dotEls = $$('button', dots);

    function signed(i) {
      let raw = i - active;
      const alt = raw > 0 ? raw - len : raw + len;
      return Math.abs(alt) < Math.abs(raw) ? alt : raw;
    }
    function layout() {
      cards.forEach((c, i) => {
        const off = signed(i), abs = Math.abs(off), vis = abs <= maxOffset;
        c.style.display = vis ? '' : 'none';
        if (!vis) return;
        c.style.width = cw + 'px'; c.style.height = ch + 'px';
        const isA = off === 0;
        const x = off * spacing, y = abs * 12 - (isA ? 16 : 0);
        const rot = off * (spreadDeg / maxOffset);
        const sc = isA ? 1.04 : 0.9;
        c.style.zIndex = 100 - abs;
        c.style.transform = `translate(-50%,-50%) translate3d(${x}px,${y}px,${-abs*depth}px) rotateZ(${rot}deg) scale(${sc})`;
        c.style.opacity = abs === maxOffset ? 0.55 : 1;
        c.classList.toggle('is-active', isA);
        if (isA) { const m = $('.cs-meter i', c); if (m) m.style.width = m.dataset.pct + '%'; }
      });
      dotEls.forEach((d, i) => d.classList.toggle('on', i === active));
    }
    function go(i) { active = ((i % len) + len) % len; layout(); }
    function next() { go(active + 1); } function prev() { go(active - 1); }

    stage.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') prev(); if (e.key === 'ArrowRight') next();
    });
    // drag / swipe on stage
    let down = false, sx = 0;
    const ds = e => { down = true; sx = (e.touches ? e.touches[0] : e).clientX; };
    const de = e => {
      if (!down) return; down = false;
      const ex = (e.changedTouches ? e.changedTouches[0] : e).clientX;
      const dx = ex - sx;
      if (dx > 50) prev(); else if (dx < -50) next();
    };
    stage.addEventListener('mousedown', ds); window.addEventListener('mouseup', de);
    stage.addEventListener('touchstart', ds, { passive: true }); stage.addEventListener('touchend', de);

    measure(); layout();
    window.addEventListener('resize', () => { measure(); layout(); });
    // reveal
    if (!reduce && window.gsap) {
      gsap.from(cards, { opacity: 0, y: 60, duration: 0.9, ease: 'power3.out', stagger: 0.06,
        scrollTrigger: { trigger: root, start: 'top 70%' }, onComplete: layout });
    }
    return { go, next, prev };
  }

  const POSTERS = ['assets/img/leather.jpg','assets/img/atelier.jpg','assets/img/clasp.jpg','assets/img/hero-bag.jpg'];

  function initSwot() {
    const items = [
      { ix:'S', badge:'Forces', title:'Forces', sub:'Strengths', bg:POSTERS[1],
        body:'<ul class="cs-list"><li>Savoir-faire de restauration &amp; d’authentification inimitable</li><li>Capital de désirabilité déjà fort dans le Golfe</li><li>Intégration verticale : la maison fabrique, donc elle sait réparer</li></ul>' },
      { ix:'W', badge:'Faiblesses', title:'Faiblesses', sub:'Weaknesses', bg:POSTERS[0],
        body:'<ul class="cs-list"><li>Aucune expérience opérationnelle du rachat à grande échelle</li><li>Risque de confusion d’image si mal exécuté</li></ul>' },
      { ix:'O', badge:'Opportunités', title:'Opportunités', sub:'Opportunities', bg:POSTERS[3],
        body:'<ul class="cs-list"><li>Base de clientes fortunées en forte croissance</li><li>Revente structurée encore peu développée localement</li><li>Fenêtre de premier entrant</li></ul>' },
      { ix:'T', badge:'Menaces', title:'Menaces', sub:'Threats', bg:POSTERS[2],
        body:'<ul class="cs-list"><li>Circuits informels déjà ancrés</li><li>Taxation à l’import (≤ 15 %)</li><li>Sensibilité culturelle à « l’occasion » <span class="tag tag-hyp">Hypothèse</span></li></ul>' }
    ];
    cardStack('#swotStack', items, { spreadDeg: 22 });
  }

  function initPorter() {
    const items = PORTER.map((f, i) => ({
      ix: String(i + 1), badge: 'Intensité ' + f.lvl, title: f.t, sub: 'Force ' + (i + 1) + ' / 5',
      bg: POSTERS[i % POSTERS.length],
      body: '<p class="cs-desc">' + f.note + '</p>' +
            '<div class="cs-meter"><i data-pct="' + f.pct + '"></i></div>' +
            '<div class="cs-lvl lvl-' + f.cls + '">Intensité ' + f.lvl + '</div>'
    }));
    cardStack('#porterStack', items, { spreadDeg: 26 });
  }

  /* ============================================================
     TAM / SAM / SOM
     ============================================================ */
  function initTSS() {
    const circles = $$('#tssCircles .circle');
    ScrollTrigger.create({ trigger:'#s9', start:'top 60%', once:true,
      onEnter:()=>circles.forEach((c,i)=>setTimeout(()=>c.classList.add('in'), i*350)) });
  }

  /* ============================================================
     JOURNEY videos play in view
     ============================================================ */
  function initJourney() {
    $$('.j-vid').forEach(v => {
      ScrollTrigger.create({ trigger:v, start:'top 90%', end:'bottom 10%',
        onEnter:()=>v.play().catch(()=>{}), onEnterBack:()=>v.play().catch(()=>{}),
        onLeave:()=>v.pause(), onLeaveBack:()=>v.pause() });
    });
  }

  /* ============================================================
     CONCLUSION sequence
     ============================================================ */
  function initConclu() {
    const lines = $$('.conclu .cl, .conclu .sign');
    const vid = $('#s13 .bg-video');
    ScrollTrigger.create({ trigger:'#s13', start:'top 70%',
      onEnter:()=>{ vid && vid.play().catch(()=>{}); }, onLeaveBack:()=>{ vid && vid.pause(); } });
    const tl = gsap.timeline({ scrollTrigger:{ trigger:'#s13', start:'top 55%' } });
    lines.forEach((l,i)=> tl.to(l,{opacity:1,y:0,duration:1.3,ease:'power3.out'}, i*0.9));
  }

  /* ============================================================
     SOURCE TOOLTIPS
     ============================================================ */
  function initTooltips() {
    const tip = $('#srcTooltip');
    $$('.ref').forEach(r => {
      const txt = r.dataset.src || '';
      const show = e => {
        tip.textContent = txt; tip.classList.add('show');
        const x = (e.touches ? e.touches[0].clientX : e.clientX);
        const y = (e.touches ? e.touches[0].clientY : e.clientY);
        tip.style.left = Math.min(x + 14, window.innerWidth - 300) + 'px';
        tip.style.top = (y + 16) + 'px';
      };
      r.addEventListener('mouseenter', show);
      r.addEventListener('mousemove', show);
      r.addEventListener('mouseleave', () => tip.classList.remove('show'));
      r.addEventListener('click', e => { show(e); setTimeout(()=>tip.classList.remove('show'), 3500); });
    });
  }

  /* ============================================================
     AMBIENT GOLDEN DUST (Three.js)
     ============================================================ */
  function initDust() {
    if (reduce || !window.THREE) return;
    const canvas = $('#dust');
    const renderer = new THREE.WebGLRenderer({ canvas, alpha:true, antialias:true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, innerWidth/innerHeight, 0.1, 100);
    camera.position.z = 22;

    const COUNT = 520;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(COUNT*3);
    const spd = new Float32Array(COUNT);
    for (let i=0;i<COUNT;i++){
      pos[i*3]   = (Math.random()-0.5)*60;
      pos[i*3+1] = (Math.random()-0.5)*46;
      pos[i*3+2] = (Math.random()-0.5)*30;
      spd[i] = Math.random()*0.4 + 0.05;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos,3));
    const sprite = makeSprite();
    const mat = new THREE.PointsMaterial({ size:0.42, map:sprite, transparent:true, opacity:0.5,
      depthWrite:false, blending:THREE.NormalBlending, color:0xb98a52 });
    const points = new THREE.Points(geo, mat);
    scene.add(points);

    let mx=0,my=0;
    window.addEventListener('mousemove', e=>{ mx=(e.clientX/innerWidth-0.5); my=(e.clientY/innerHeight-0.5); });

    function resize(){ renderer.setSize(innerWidth,innerHeight); camera.aspect=innerWidth/innerHeight; camera.updateProjectionMatrix(); }
    window.addEventListener('resize', resize); resize();

    const arr = geo.attributes.position.array;
    function loop(){
      for (let i=0;i<COUNT;i++){
        arr[i*3+1] += spd[i]*0.02;
        if (arr[i*3+1] > 24) arr[i*3+1] = -24;
      }
      geo.attributes.position.needsUpdate = true;
      points.rotation.y += 0.0006;
      camera.position.x += (mx*4 - camera.position.x)*0.03;
      camera.position.y += (-my*3 - camera.position.y)*0.03;
      camera.lookAt(0,0,0);
      renderer.render(scene,camera);
      requestAnimationFrame(loop);
    }
    loop();

    function makeSprite(){
      const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d');
      const g=x.createRadialGradient(32,32,0,32,32,32);
      g.addColorStop(0,'rgba(150,110,60,.9)');g.addColorStop(.35,'rgba(176,118,63,.45)');g.addColorStop(1,'rgba(176,118,63,0)');
      x.fillStyle=g;x.fillRect(0,0,64,64);
      const t=new THREE.Texture(c);t.needsUpdate=true;return t;
    }
  }

  /* ============================================================
     BOOT
     ============================================================ */
  function boot() {
    initScroll();
    initDust();
    initNav();
    initReveals();
    initHero();
    initCounts();
    initPestel();
    initArena();
    initSwot();
    initPorter();
    initTSS();
    initJourney();
    initConclu();
    initTooltips();
    ScrollTrigger.refresh();
  }

  window.addEventListener('load', () => {
    runPreloader(() => setTimeout(boot, 100));
  });
})();
