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
          body:'Avec Vision 2030, lancée en 2016, l’État réoriente toute l’économie hors pétrole. Plus de 1 300 milliards de dollars sont déjà engagés dans les mégaprojets — NEOM, Red Sea, Diriyah, Qiddiya — sur plus de 3 000 milliards prévus d’ici la fin de la décennie.',
          tag:'<span class="tag tag-fait">Fait</span>' },
    E:  { key:'Économique', title:'Un marché du luxe qui accélère',
          body:'Le luxe saoudien passe de 10,1 à 23,3 milliards de dollars entre 2024 et 2033 (+9,7 % par an). Le nombre de millionnaires y est multiplié par huit en un an : de 300 en 2024 à environ 2 400 attendus en 2025. Et le pays ne pèse encore que 18 % du luxe régional — la marge devant lui est énorme.',
          tag:'<span class="tag tag-fait">Fait</span>' },
    S:  { key:'Sociétal', title:'Les femmes, vrai moteur de la consommation',
          body:'C’est notre signal le plus fort. La part des femmes au travail est passée de 23,2 % (2016) à 34,5 % (2023). Dans le Golfe, elles dépensent 55 % de plus que les hommes en beauté et lifestyle. Et le tabou de la seconde main s’efface vite, porté par la Gen Z : l’Arabie Saoudite domine déjà le marché du luxe d’occasion du Golfe.',
          tag:'<span class="tag tag-fait">Fait</span>' },
    T:  { key:'Technologique', title:'Aucun frein d’infrastructure',
          body:'85 % des paiements en magasin sont électroniques en 2025 (79 % en 2024), d’après la banque centrale saoudienne. Pour une plateforme 100 % digitale de rachat et de revente, le terrain est prêt.',
          tag:'<span class="tag tag-fait">Fait</span>' },
    EN: { key:'Écologique', title:'L’upcycling, déjà porté par l’État',
          body:'Notre angle upcycling n’est pas plaqué : le Royaume le pousse déjà. La Fashion Commission (ministère de la Culture) finance des initiatives dédiées et s’associe aux Kering Generation Awards. On s’inscrit dans une dynamique nationale en cours.',
          tag:'<span class="tag tag-fait">Fait</span>' },
    L:  { key:'Légal', title:'Un cadre qui n’entrave pas le vendeur',
          body:'L’import de luxe est taxé jusqu’à 15 %, plus 5 % de tarif douanier CCG, et la TVA entreprise est à 15 %. Mais côté vendeur, rien : un particulier qui revend une pièce d’occasion n’a aucune charge ni formalité. Vérifié — ce n’est pas un point de friction.',
          tag:'<span class="tag tag-fait">Fait</span>' }
  };

  const COMPETITORS = [
    { wm:'THE LUXURY<br>CLOSET', sans:true, cat:'Revente luxe · Dubaï', group:'Indépendant (Dubaï)',
      focus:'Plateforme née à Dubaï, leader aux Émirats, qui cible explicitement l’Arabie Saoudite et le Koweït dans son expansion.',
      edge:'C’est le fil rouge Dubaï → Arabie : la menace de substitution n°1, déjà en marche.' },
    { wm:'VESTIAIRE<br>COLLECTIVE', sans:true, cat:'Revente C2C mondiale', group:'Indépendant',
      focus:'Marketplace mondiale ; a annoncé son intention de se déployer en Arabie. Opère le « Resale-as-a-Service » de Burberry.',
      edge:'Modèle de partenariat externalisé — précisément ce qu’Hermès refuse, pour garder data et authentification.' },
    { wm:'ROLEX', sans:false, cat:'Certified Pre-Owned', group:'Indépendant (fondation)',
      focus:'Programme officiel de rachat-revente certifié, lancé en 2022 (~600 M$ de ventes).',
      edge:'La preuve que le rachat en marque propre marche — mais sur l’horlogerie, pas la maroquinerie ni l’upcycling.' },
    { wm:'COACH', sans:false, cat:'Rachat en marque propre', group:'Groupe Tapestry',
      focus:'Programme (Re)Loved : reprise et revente des pièces directement par la marque.',
      edge:'Coup d’avance opérationnel sur le rachat — sans le savoir-faire de restauration artisanale d’Hermès.' },
    { wm:'Philip Karto', sans:false, cat:'Upcycling de bases Hermès', group:'Tiers non autorisé',
      focus:'Upcycle déjà des pièces Hermès authentiques en exemplaires uniques, dans son propre atelier, hors contrôle de la maison.',
      edge:'La preuve que la demande existe — et l’urgence : un tiers occupe déjà le créneau upcycling.' }
  ];

  const PORTER = [
    { t:'Nouveaux entrants',       lvl:'Moyen', cls:'moyen', pct:55, note:'Le terrain n’est pas vierge : Rolex CPO (~600 M$), Coach (Re)Loved et des horlogers suisses rachètent déjà en propre. Et Philip Karto upcycle déjà des Hermès.' },
    { t:'Pouvoir des vendeurs',    lvl:'Moyen', cls:'moyen', pct:50, note:'Aucune friction fiscale : tout se joue sur la confiance et le prix face aux circuits informels. Cadrage Bain : ~500 Md$ de luxe dorment dans les penderies, vs ~300 Md$ d’achats neufs/an.' },
    { t:'Pouvoir des acheteurs',   lvl:'Faible à moyen', cls:'moyen', pct:42, note:'Sur l’upcycling, pricing power fort (pièces uniques) — nuance : Philip Karto crée déjà un comparable hors circuit. Sur la revente restaurée, des comparables existent sur les plateformes tierces.' },
    { t:'Produits de substitution',lvl:'Moyen à élevé', cls:'eleve', pct:85, note:'Le vrai risque. The Luxury Closet (née à Dubaï) cible l’Arabie ; Vestiaire Collective a annoncé son intention. Le fil Dubaï → diffusion régionale est déjà engagé.' },
    { t:'Intensité concurrentielle',lvl:'Moyenne', cls:'moyen', pct:55, note:'L’Arabie domine déjà le luxe d’occasion du Golfe : terrain actif, pas vierge. Sur l’upcycling, encore peu structuré — une vraie fenêtre si Hermès agit vite.' }
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
        body:'<ul class="cs-list"><li>Autorité finale sur l’authentification (codes date + artisan depuis les années 1940) — d’autres savent les lire, Hermès reste seule à trancher</li><li>Savoir-faire de restauration et d’upcycling en interne</li><li>Désirabilité déjà forte dans le Golfe</li></ul>' },
      { ix:'W', badge:'Faiblesses', title:'Faiblesses', sub:'Weaknesses', bg:POSTERS[0],
        body:'<ul class="cs-list"><li>Aucune expérience du rachat à grande échelle — Rolex et Coach ont un coup d’avance opérationnel</li><li>Risque de confusion avec le neuf si le dispositif est mal différencié</li></ul>' },
      { ix:'O', badge:'Opportunités', title:'Opportunités', sub:'Opportunities', bg:POSTERS[3],
        body:'<ul class="cs-list"><li>Base de détentrices fortunées en forte croissance</li><li>Fenêtre de premier entrant institutionnel en Arabie (avant Dubaï)</li><li>Gen Z + millennials favorables à la seconde main</li><li>Upcycling porté par l’État (Fashion Commission)</li></ul>' },
      { ix:'T', badge:'Menaces', title:'Menaces', sub:'Threats', bg:POSTERS[2],
        body:'<ul class="cs-list"><li>Concurrence déjà engagée : Rolex, Coach, et Philip Karto sur l’upcycling Hermès</li><li>Plateformes tierces en expansion vers l’Arabie (The Luxury Closet, Vestiaire)</li><li>Circuits informels ancrés <span class="tag tag-hyp">Hypothèse</span></li><li>Import taxé jusqu’à 15 %</li></ul>' }
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
    if (reduce || !window.gsap) return;
    gsap.from('#tssTunnel .t3-frame', { opacity: 0, scale: 0.6, duration: 1, ease: 'power3.out', stagger: 0.18,
      scrollTrigger: { trigger: '#s9', start: 'top 62%', once: true } });
    gsap.from('#tssTunnel .t3-legend li', { opacity: 0, x: 20, duration: 0.7, ease: 'power2.out', stagger: 0.12,
      scrollTrigger: { trigger: '.t3-legend', start: 'top 88%', once: true } });
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
     CINEMA Dubaï → Riyad (S4) — captions + dots synchronisés
     ============================================================ */
  function initCinema() {
    const vid  = $('#cinemaVid');
    if (!vid) return;
    const caps = $$('#cinemaCaps .cap');
    const dots = $$('#cinemaProg i');
    if (!caps.length) return;

    const segs = caps.map(c => ({
      el: c,
      in:  parseFloat(c.dataset.in),
      out: parseFloat(c.dataset.out)
    }));

    let raf = 0, active = -1;
    function tick() {
      const t = vid.currentTime;
      let next = -1;
      for (let i = 0; i < segs.length; i++) {
        if (t >= segs[i].in && t < segs[i].out) { next = i; break; }
      }
      if (next !== active) {
        caps.forEach((c, i) => c.classList.toggle('show', i === next));
        dots.forEach((d, i) => d.classList.toggle('on', next >= 0 && i <= next));
        active = next;
      }
      raf = requestAnimationFrame(tick);
    }

    ScrollTrigger.create({
      trigger: '#cinema',
      start: 'top 80%',
      onEnter:    () => { vid.play().catch(()=>{}); if (!raf) tick(); },
      onEnterBack:() => { vid.play().catch(()=>{}); if (!raf) tick(); },
      onLeave:    () => { vid.pause(); cancelAnimationFrame(raf); raf = 0; },
      onLeaveBack:() => { vid.pause(); cancelAnimationFrame(raf); raf = 0; }
    });
  }

  /* ============================================================
     3D TILT (cartes Problème)
     ============================================================ */
  function initTilt() {
    if (reduce) return;
    $$('.prob-card.tilt').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = 'rotateX(' + (-py * 11).toFixed(2) + 'deg) rotateY(' + (px * 11).toFixed(2) + 'deg)';
      });
      card.addEventListener('mouseleave', () => { card.style.transform = 'rotateX(0deg) rotateY(0deg)'; });
    });
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
     TRAILER MODAL · LANCER LE FILM
     ============================================================ */
  function initTrailerModal() {
    const openBtn = document.getElementById('trailerOpen');
    const closeBtn = document.getElementById('trailerClose');
    const modal = document.getElementById('trailerModal');
    const video = document.getElementById('trailerVideo');
    if (!openBtn || !modal || !video) return;

    const open = () => {
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      try { video.currentTime = 0; video.muted = false; video.volume = 1; } catch (e) {}
      const p = video.play();
      if (p && p.catch) p.catch(() => { video.muted = true; video.play(); });
    };
    const close = () => {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      try { video.pause(); video.currentTime = 0; } catch (e) {}
    };

    openBtn.addEventListener('click', open);
    closeBtn && closeBtn.addEventListener('click', close);
    modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) close();
    });
    video.addEventListener('ended', close);
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
    initCinema();
    initConclu();
    initTilt();
    initTooltips();
    initTrailerModal();
    ScrollTrigger.refresh();
  }

  window.addEventListener('load', () => {
    runPreloader(() => setTimeout(boot, 100));
  });
})();
