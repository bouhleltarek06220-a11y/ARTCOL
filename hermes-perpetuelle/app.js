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
    { name:'Vestiaire Collective', cat:'Revente C2C',         short:'Vestiaire' },
    { name:'The RealReal',         cat:'Revente luxe',         short:'The RealReal' },
    { name:'Rolex CPO',            cat:'Certified Pre-Owned',  short:'Rolex CPO' },
    { name:'Burberry',             cat:'Programme marque',     short:'Burberry' },
    { name:'Gucci',                cat:'Re-commerce',          short:'Gucci' }
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
  function initPestel() {
    const sphere = $('#pestelSphere');
    const detail = $('#pestelDetail');
    const tabsWrap = $('#pestelTabs');
    const facets = $$('.facet', sphere);
    const order = ['P','E','S','T','EN','L'];
    detail.innerHTML = '<div class="pd-empty">Sélectionnez une facette →</div>';

    // build reliable tab controls
    order.forEach(k => {
      const b = document.createElement('button');
      b.className = 'p-tab';
      b.dataset.key = k;
      b.innerHTML = '<span>' + (k === 'EN' ? 'E' : k) + '</span><small>' + PESTEL[k].key + '</small>';
      b.addEventListener('click', () => select(k));
      tabsWrap.appendChild(b);
    });

    function select(key) {
      facets.forEach(x => x.classList.toggle('active', x.dataset.key === key));
      $$('.p-tab', tabsWrap).forEach(x => x.classList.toggle('active', x.dataset.key === key));
      const d = PESTEL[key];
      detail.style.opacity = 0;
      setTimeout(() => {
        detail.innerHTML =
          '<div class="pd-key">' + d.key + '</div>' +
          '<h3>' + d.title + '</h3>' +
          '<p>' + d.body + '</p>' +
          '<div class="pd-tags">' + d.tag + '</div>';
        detail.style.transition = 'opacity .5s';
        detail.style.opacity = 1;
      }, 200);
    }

    facets.forEach(f => f.addEventListener('click', () => select(f.dataset.key)));

    // pause spin on hover so facets are clickable; resume on leave
    sphere.addEventListener('mouseenter', () => sphere.style.animationPlayState = 'paused');
    sphere.addEventListener('mouseleave', () => sphere.style.animationPlayState = 'running');
  }

  /* ============================================================
     ARENA (concurrence)
     ============================================================ */
  function initArena() {
    const arena = $('#arena');
    const n = COMPETITORS.length;
    COMPETITORS.forEach((c, i) => {
      const ang = (-90 + i * (360 / n)) * Math.PI / 180;
      const r = 42; // % radius
      const x = 50 + Math.cos(ang) * r;
      const y = 50 + Math.sin(ang) * r;
      const el = document.createElement('div');
      el.className = 'comp';
      el.style.left = x + '%';
      el.style.top = y + '%';
      el.innerHTML = '<div class="c-bubble">' + c.short + '</div>' +
                     '<div class="c-name">' + c.name + '</div>' +
                     '<div class="c-cat">' + c.cat + '</div>';
      arena.appendChild(el);
      gsap.from(el, { opacity:0, scale:0.4, duration:0.8, ease:'back.out(1.6)',
        scrollTrigger:{ trigger:'#s6', start:'top 70%' }, delay:0.1+i*0.1 });
    });
  }

  /* ============================================================
     SWOT CUBE (rotate + drag)
     ============================================================ */
  function initSwot() {
    const cube = $('#swotCube');
    const rots = { S:{x:-14,y:0}, O:{x:-14,y:-90}, W:{x:-14,y:-180}, T:{x:-14,y:90} };
    let rx = -14, ry = 0;
    function apply(){ cube.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`; }
    $$('.cube-ctrl button').forEach(b => {
      b.addEventListener('click', () => {
        $$('.cube-ctrl button').forEach(x=>x.classList.remove('active'));
        b.classList.add('active');
        const r = rots[b.dataset.rot]; rx = r.x; ry = r.y;
        cube.style.transition='transform 1s var(--ease)'; apply();
      });
    });
    // drag
    let down=false, sx=0, sy=0, brx=0, bry=0;
    const start=e=>{down=true;cube.classList.add('drag');const p=e.touches?e.touches[0]:e;sx=p.clientX;sy=p.clientY;brx=rx;bry=ry;};
    const move=e=>{if(!down)return;const p=e.touches?e.touches[0]:e;ry=bry+(p.clientX-sx)*0.5;rx=brx-(p.clientY-sy)*0.5;apply();};
    const end=()=>{down=false;cube.classList.remove('drag');};
    cube.addEventListener('mousedown',start);window.addEventListener('mousemove',move);window.addEventListener('mouseup',end);
    cube.addEventListener('touchstart',start,{passive:true});window.addEventListener('touchmove',move,{passive:true});window.addEventListener('touchend',end);
    // intro spin
    gsap.from(cube,{duration:1.4,ease:'power3.out',onUpdate:function(){const p=this.progress();cube.style.transform=`rotateX(${-14}deg) rotateY(${ -160 + p*160 }deg)`;},
      scrollTrigger:{trigger:'#s7',start:'top 60%',once:true}});
  }

  /* ============================================================
     PORTER
     ============================================================ */
  function initPorter() {
    const stage = $('#porterStage');
    const svg = $('#porterLines');
    const n = PORTER.length;
    PORTER.forEach((f, i) => {
      const ang = (-90 + i * (360 / n)) * Math.PI / 180;
      const r = 38;
      const x = 50 + Math.cos(ang) * r;
      const y = 50 + Math.sin(ang) * r;
      const el = document.createElement('div');
      el.className = 'force';
      el.style.left = x + '%';
      el.style.top = y + '%';
      el.innerHTML =
        '<div class="f-card"><h4>' + f.t + '</h4>' +
        '<div class="f-meter"><i data-pct="' + f.pct + '"></i></div>' +
        '<div class="f-lvl lvl-' + f.cls + '">Intensité ' + f.lvl + '</div></div>';
      stage.appendChild(el);
      // connection line
      const line = document.createElementNS('http://www.w3.org/2000/svg','line');
      line.setAttribute('x1',50);line.setAttribute('y1',50);
      line.setAttribute('x2',x);line.setAttribute('y2',y);
      line.style.animationDelay=(i*0.12)+'s';
      svg.appendChild(line);
      gsap.from(el,{opacity:0,scale:0.6,duration:0.7,ease:'back.out(1.5)',delay:0.15+i*0.1,
        scrollTrigger:{trigger:'#s8',start:'top 65%'}});
    });
    // animate meters
    ScrollTrigger.create({ trigger:'#s8', start:'top 55%', once:true,
      onEnter:()=>$$('.f-meter i').forEach(b=>{ b.style.width=b.dataset.pct+'%'; }) });
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
    const mat = new THREE.PointsMaterial({ size:0.5, map:sprite, transparent:true, opacity:0.7,
      depthWrite:false, blending:THREE.AdditiveBlending, color:0xf2a45c });
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
      g.addColorStop(0,'rgba(255,220,160,1)');g.addColorStop(.3,'rgba(242,140,60,.6)');g.addColorStop(1,'rgba(242,104,28,0)');
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
