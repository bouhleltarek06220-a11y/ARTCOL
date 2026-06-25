import fs from 'fs';
const css = fs.readFileSync('style.css','utf8');
const ICO = 'node_modules/lucide-static/icons';
function I(name){
  let s = fs.readFileSync(`${ICO}/${name}.svg`,'utf8');
  s = s.replace(/\s(width|height)="24"/g,'');
  return s.replace(/\n/g,'');
}
// brand mark glyph
const MARK = I('brain-circuit');

function head(num, sec){
  return `<div class="head">
    <div class="kick"><span class="bar"></span><span class="num">${num}</span><span class="sec">${sec}</span></div>
    <div class="brand"><span class="mk">${MARK}</span><span class="wd">oghji</span><span class="pg">${num} / 12</span></div>
  </div>`;
}
const foot = `<div class="foot"><span><span class="dot">●</span>&nbsp; oghji · smart energy</span><span>Le cerveau énergétique et électrique</span></div>`;

function slide(inner){ return `<section class="slide"><div class="bg"></div>${inner}</section>`; }
function trace(){ // subtle pcb traces svg
  return `<svg class="trace" viewBox="0 0 1280 720" fill="none" preserveAspectRatio="none">
    <g stroke="rgba(43,224,138,.16)" stroke-width="1.4">
      <path d="M0 150 H120 V70"/><circle cx="120" cy="64" r="4" fill="rgba(43,224,138,.5)" stroke="none"/>
      <path d="M1280 560 H1140 V640"/><circle cx="1140" cy="646" r="4" fill="rgba(43,224,138,.5)" stroke="none"/>
      <path d="M1280 240 H1180 V300 H1090"/><circle cx="1090" cy="300" r="3.5" fill="rgba(21,214,198,.5)" stroke="none"/>
    </g></svg>`;
}

/* ============ SLIDE 1 — COVER ============ */
function s1(){
  return slide(`${trace()}
  <div class="content" style="top:0;bottom:0;left:0;right:0;padding:0">
    <div style="position:absolute;left:64px;top:60px;display:flex;align-items:center;gap:12px">
      <span class="mk" style="width:34px;height:34px;border-radius:10px;display:grid;place-items:center;background:var(--accent);color:#04110e;box-shadow:0 6px 18px rgba(43,224,138,.4)">${MARK}</span>
      <span style="font-family:'SG';font-weight:700;font-size:23px;letter-spacing:.04em">oghji</span>
      <span style="width:1px;height:20px;background:var(--line);margin:0 4px"></span>
      <span style="font-family:'JB';font-weight:500;font-size:12px;letter-spacing:.2em;color:var(--ink-3);text-transform:uppercase">smart energy</span>
    </div>

    <!-- left column -->
    <div style="position:absolute;left:64px;top:188px;width:560px">
      <div class="pill acc big" style="margin-bottom:26px">${I('radio')}&nbsp;Contrôle en temps réel</div>
      <div class="h1" style="font-size:62px;line-height:1.02;letter-spacing:-2px">Le cerveau<br><span class="em">énergétique</span><br>de votre installation.</div>
      <div class="lead" style="margin-top:24px;max-width:500px">OGHJI remplace votre tableau électrique par un système <b style="color:#fff;font-weight:600">100 % numérique</b> qui mesure, protège, pilote et anticipe — circuit par circuit.</div>
      <div style="display:flex;gap:10px;margin-top:30px">
        <div class="pill">${I('cpu')}&nbsp;100 % Numérique</div>
        <div class="pill">${I('wifi')}&nbsp;Connecté</div>
        <div class="pill">${I('sparkles')}&nbsp;Intelligent</div>
      </div>
    </div>

    <!-- right visual -->
    <div style="position:absolute;right:70px;top:170px;width:470px">
      <div class="screenglow" style="inset:30px 20px 60px 30px"></div>
      <div class="screen" style="transform:rotate(.5deg)">
        <img src="assets/screen-dashboard.png" alt="Écran OGHJI">
      </div>
      <div class="fchip" style="right:-26px;top:60px"><span>${I('shield-check')}</span><div><div class="fv">Type B</div><div class="fl">+ détection d'arc</div></div></div>
      <div class="fchip" style="left:-34px;top:200px"><span>${I('layout-grid')}</span><div><div class="fv">8 circuits</div><div class="fl">extensible</div></div></div>
      <div class="fchip" style="right:6px;bottom:-26px"><span>${I('badge-check')}</span><div><div class="fv">Breveté</div><div class="fl">FR3055478B1</div></div></div>
    </div>
  </div>
  <div class="foot" style="bottom:34px"><span><span class="dot">●</span>&nbsp; PRÉSENTATION COMMERCIALE</span><span>oghji · smart energy</span></div>`);
}

/* ============ SLIDE 2 — LE CONSTAT ============ */
function s2(){
  const probs = [
    ['eye-off','Aucune visibilité','Vous payez sans savoir où part votre énergie.'],
    ['trending-up','Factures qui grimpent','Sans mesure, aucun levier pour les réduire.'],
    ['flame','Risque électrique','Surcharges, arcs, départs de feu : vus trop tard.'],
    ['power','Zéro pilotage','Impossible de suivre ou couper un circuit à distance.'],
  ];
  return slide(`${head('02','LE CONSTAT')}${foot}
  <div class="content">
    <div style="display:flex;justify-content:space-between;align-items:flex-end">
      <div>
        <div class="h1">Votre tableau électrique est <span class="em">aveugle.</span></div>
        <div class="lead" style="margin-top:16px">Un coffret passif qui distribue le courant… sans rien voir, sans rien dire.</div>
      </div>
      <div class="pill" style="border-color:rgba(255,99,99,.3);color:#ff9a9a;background:rgba(255,99,99,.07)">${I('alert-triangle')}&nbsp;Le statu quo</div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-top:34px">
      ${probs.map(p=>`<div class="card" style="padding:22px 20px"><div class="chip red">${I(p[0])}</div><div class="ct">${p[1]}</div><div class="cd">${p[2]}</div></div>`).join('')}
    </div>
    <div style="margin-top:30px;display:flex;align-items:center;gap:18px;padding:20px 26px;border-radius:16px;background:linear-gradient(100deg,rgba(43,224,138,.10),rgba(255,255,255,.02));border:1px solid rgba(43,224,138,.24)">
      <span class="chip lg">${I('brain-circuit')}</span>
      <div style="font-family:'SG';font-weight:600;font-size:25px;color:#fff;letter-spacing:-.6px">Il est temps de lui donner un <span class="em">cerveau.</span></div>
      <span style="margin-left:auto;color:var(--green)">${I('arrow-right')}</span>
    </div>
  </div>`);
}

/* ============ SLIDE 3 — LA SOLUTION ============ */
function s3(){
  const verbs=[['gauge','Mesure'],['shield-check','Protège'],['sliders-horizontal','Pilote'],['radar','Anticipe']];
  return slide(`${head('03','LA SOLUTION')}${foot}
  <div class="content">
    <div class="h1 sm"><span class="em">OGHJI</span>, le cerveau énergétique &amp; électrique.</div>
    <div style="display:grid;grid-template-columns:1fr 442px;gap:48px;margin-top:26px;align-items:start">
      <div>
        <div class="lead" style="max-width:none">OGHJI remplace votre tableau et se branche entre le disjoncteur général et vos circuits. 100 % numérique, il mesure, protège, pilote et anticipe — <b style="color:#fff;font-weight:600">en temps réel</b>.</div>
        <div class="pipe" style="margin-top:34px">
          ${verbs.map((v,i)=>`<div class="st"><div class="ic">${I(v[0])}</div><div class="nm">${v[1]}</div></div>${i<3?`<div class="cn">${I('chevron-right')}</div>`:''}`).join('')}
        </div>
        <div class="callout" style="margin-top:36px">Pas des modules vissés sur un tableau bête. <b>Un système nativement intelligent, conçu d'un seul bloc.</b></div>
      </div>
      <div style="position:relative">
        <div class="screenglow" style="inset:20px 10px 30px 10px"></div>
        <div class="screen"><img src="assets/screen-dashboard.png" alt="Écran de contrôle OGHJI"></div>
        <div style="text-align:center;margin-top:14px;font-family:'JB';font-weight:500;font-size:11.5px;letter-spacing:.08em;color:var(--ink-3)">L'ÉCRAN DE CONTRÔLE OGHJI</div>
      </div>
    </div>
  </div>`);
}

/* ============ SLIDE 4 — LE PRODUIT ============ */
function s4(){
  const feats=[
    ['monitor','Écran 10″ tactile','Pilotage, graphiques et alertes en un coup d\'œil.'],
    ['radar','Capteurs présence &amp; luminosité','Pour automatiser éclairage et confort.'],
    ['move-diagonal','Écran déportable &amp; discret','À poser où vous voulez, loin du tableau.'],
    ['boxes','Boîtiers de puissance','8 circuits, extensible selon vos besoins.'],
    ['ruler','Boîtier + couvercle','Format compact 35 × 25 × 10 cm.'],
  ];
  return slide(`${head('04','LE PRODUIT')}${foot}
  <div class="content">
    <div class="h1">Un écran. Des boîtiers. <span class="em">Une intelligence.</span></div>
    <div style="display:grid;grid-template-columns:1fr 432px;gap:48px;margin-top:30px;align-items:center">
      <div>
        ${feats.map(f=>`<div class="frow"><span class="chip sm">${I(f[0])}</span><div><div class="ft">${f[1]}</div><div class="fd">${f[2]}</div></div></div>`).join('')}
      </div>
      <div style="position:relative">
        <div class="screenglow" style="inset:24px 14px 24px 14px"></div>
        <div class="screen"><img src="assets/screen-dashboard.png" alt="Écran OGHJI"></div>
        <div class="shot pad" style="position:absolute;left:-30px;bottom:-26px;width:188px;height:120px;border-radius:14px"><img src="assets/boxes-3.png" alt="Boîtiers de puissance OGHJI"></div>
        <div class="fchip" style="right:-22px;top:-16px"><span>${I('ruler')}</span><div><div class="fv">35×25×10</div><div class="fl">cm</div></div></div>
      </div>
    </div>
  </div>`);
}

/* ============ SLIDE 5 — SOUS LE CAPOT ============ */
function s5(){
  const rows=[
    ['gauge','Mesure par circuit intégrée','La consommation de chaque départ, nativement.'],
    ['shield-check','Protection avancée embarquée','Différentiel type B + détection d\'arc dans le système.'],
    ['network','Communication native','Écran, application mobile et interface web reliés.'],
  ];
  return slide(`${head('05','SOUS LE CAPOT')}${foot}
  <div class="content">
    <div style="display:flex;justify-content:space-between;align-items:flex-end">
      <div class="h1">Tout est intégré. <span class="em">Nativement.</span></div>
      <div class="badge"><span class="bl">Breveté</span><span class="bv">FR3055478B1</span></div>
    </div>
    <div style="display:grid;grid-template-columns:430px 1fr;gap:42px;margin-top:26px;align-items:center">
      <div class="shot" style="height:300px"><img src="assets/internals.png" alt="Intérieur OGHJI"><div class="cap"><span class="dot">●</span> Borniers · Linky · circuits — Rail DIN 6 modules</div></div>
      <div>
        <div class="lead" style="margin-bottom:14px;max-width:none">Là où les autres vissent des modules sur un coffret classique, OGHJI intègre la mesure, la protection et la communication dans <b style="color:#fff;font-weight:600">un seul système conçu pour ça</b>.</div>
        ${rows.map(r=>`<div class="frow"><span class="chip sm">${I(r[0])}</span><div><div class="ft">${r[1]}</div><div class="fd">${r[2]}</div></div></div>`).join('')}
      </div>
    </div>
  </div>`);
}

/* ============ SLIDE 6 — LES BÉNÉFICES ============ */
function s6(){
  const b=[
    ['activity','Mesure en temps réel','Puissance, conso &amp; production, circuit par circuit.'],
    ['sliders-horizontal','Pilotage total','Coupez ou activez chaque circuit, à distance.'],
    ['shield-check','Sécurité avancée','Différentiel type B + détection d\'arc.'],
    ['wrench','Maintenance prédictive','OGHJI surveille et prévient avant la panne.'],
    ['leaf','Économies d\'énergie','Repérez les postes énergivores, baissez la facture.'],
    ['battery-charging','Multi-tableaux &amp; VE','Plusieurs sites et la recharge, au même endroit.'],
  ];
  return slide(`${head('06','LES BÉNÉFICES')}${foot}
  <div class="content">
    <div style="display:flex;justify-content:space-between;align-items:flex-end">
      <div class="h1">Ce qu'OGHJI vous <span class="em">apporte.</span></div>
      <div class="lead" style="max-width:330px;text-align:right;font-size:15px">Six leviers concrets, du premier jour, sur un seul écran.</div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:1fr 1fr;gap:16px;margin-top:30px">
      ${b.map(x=>`<div class="card" style="padding:20px"><div style="display:flex;align-items:center;gap:14px"><span class="chip">${I(x[0])}</span><div class="ct" style="margin-top:0">${x[1]}</div></div><div class="cd" style="margin-top:12px">${x[2]}</div></div>`).join('')}
    </div>
  </div>`);
}

/* ============ SLIDE 7 — LE VERROU (SÉCURITÉ) ============ */
function s7(){
  const list=[
    ['shield-check','Différentiel type B','Le niveau de protection le plus exigeant.'],
    ['zap','Détection d\'arc électrique','Repère l\'amorçage avant le départ de feu.'],
    ['bell-ring','Alertes multi-canal','Couleur, écran, sonore &amp; SMS.'],
    ['siren','Bouton d\'arrêt d\'urgence','Coupez tout, instantanément.'],
    ['scroll-text','Journal &amp; alertes temps réel','Chaque événement tracé et horodaté.'],
  ];
  return slide(`${head('07','LE VERROU OGHJI')}${foot}
  <div class="content">
    <div class="h1">La sécurité qui <span class="em">ne dort jamais.</span></div>
    <div style="display:grid;grid-template-columns:1fr 430px;gap:44px;margin-top:24px;align-items:start">
      <div>
        <div class="lead" style="max-width:none;margin-bottom:8px">Protection différentielle type B + détection d'arc — le niveau le plus exigeant. OGHJI détecte l'anomalie et vous alerte <b style="color:#fff;font-weight:600">avant l'accident</b>.</div>
        ${list.map(r=>`<div class="frow" style="padding:11px 0"><span class="chip sm">${I(r[0])}</span><div><div class="ft">${r[1]}</div><div class="fd">${r[2]}</div></div></div>`).join('')}
      </div>
      <div style="position:relative">
        <div class="screenglow" style="inset:30px 10px 30px 10px;background:radial-gradient(closest-side,rgba(255,120,90,.35),transparent)"></div>
        <div class="screen"><img src="assets/screen-alerts.png" alt="Journal d'alertes OGHJI"></div>
        <div class="fchip" style="right:-20px;top:-18px"><span style="color:#ff8a6b">${I('bell-ring')}</span><div><div class="fv">Alertes</div><div class="fl">temps réel</div></div></div>
      </div>
    </div>
  </div>`);
}

/* ============ SLIDE 8 — 3 INTERFACES ============ */
function s8(){
  return slide(`${head('08','TROIS INTERFACES')}${foot}
  <div class="content">
    <div style="display:flex;justify-content:space-between;align-items:flex-end">
      <div class="h1">Pilotez OGHJI <span class="em">où vous voulez.</span></div>
      <div class="pill acc">${I('refresh-cw')}&nbsp;Données synchronisées</div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:30px">
      <div class="card" style="padding:22px">
        <div style="display:flex;align-items:center;gap:13px"><span class="chip">${I('monitor')}</span><div class="ct" style="margin-top:0">Écran de contrôle</div></div>
        <div class="screen" style="margin-top:18px;padding:7px"><img src="assets/screen-dashboard.png" alt=""></div>
        <div class="cd" style="margin-top:16px">Sur place, en un coup d'œil. Pilotage, graphiques, arrêt d'urgence.</div>
      </div>
      <div class="card" style="padding:22px">
        <div style="display:flex;align-items:center;gap:13px"><span class="chip">${I('smartphone')}</span><div class="ct" style="margin-top:0">App mobile</div></div>
        <div style="margin-top:18px;height:158px;display:grid;place-items:center;background:radial-gradient(120% 120% at 30% 0%,#fff,#e7edec);border-radius:14px;border:1px solid var(--line)"><img src="assets/phone-app.png" alt="" style="height:140px"></div>
        <div class="cd" style="margin-top:16px">À distance, partout. Conso, alertes SMS, multi-tableaux.</div>
      </div>
      <div class="card" style="padding:22px">
        <div style="display:flex;align-items:center;gap:13px"><span class="chip">${I('globe')}</span><div class="ct" style="margin-top:0">Interface web</div></div>
        <div class="win" style="margin-top:18px">
          <div class="tb"><i></i><i></i><i></i><div class="ad"></div></div>
          <div class="bd"><div style="display:flex;gap:8px;margin-bottom:12px"><div style="flex:1;height:30px;border-radius:7px;background:rgba(43,224,138,.12);border:1px solid rgba(43,224,138,.2)"></div><div style="flex:1;height:30px;border-radius:7px;background:rgba(255,255,255,.05)"></div><div style="flex:1;height:30px;border-radius:7px;background:rgba(255,255,255,.05)"></div></div>
            <div class="gauge" style="height:64px">${[40,68,52,82,60,74,46,90].map(h=>`<div class="b" style="height:${h}%"></div>`).join('')}</div>
          </div>
        </div>
        <div class="cd" style="margin-top:16px">Vue d'ensemble. Analyses, multi-sites, gestion des comptes.</div>
      </div>
    </div>
  </div>`);
}

/* ============ SLIDE 9 — LA DIFFÉRENCE ============ */
function s9(){
  const rows=[
    ['Modules ajoutés sur un coffret passif','Système nativement numérique'],
    ['Capteurs vissés en supplément','Tout intégré dès la conception'],
    ['Mesure partielle des circuits','Mesure circuit par circuit'],
    ['Fonctions &amp; apps éparpillées','Écran + app + web unifiés'],
    ['Sécurité standard','Type B + détection d\'arc'],
  ];
  return slide(`${head('09','LA DIFFÉRENCE')}${foot}
  <div class="content">
    <div class="h1">OGHJI vs tableau connecté <span class="em">classique.</span></div>
    <div class="cmp-wrap" style="position:relative;margin-top:28px">
      <div class="ogcol"></div>
      <div class="cmp" style="position:relative">
        <div class="ch l">${I('plug')}&nbsp;Tableau connecté classique</div>
        <div class="mid"></div>
        <div class="ch r"><span class="mk" style="width:24px;height:24px;border-radius:7px;display:grid;place-items:center;background:var(--accent);color:#04110e">${MARK}</span>&nbsp;OGHJI</div>
        ${rows.map(r=>`
          <div class="cl"><span>${r[0]}</span><span class="ic-x">${I('x')}</span></div>
          <div class="mid" style="border-top:1px solid transparent"></div>
          <div class="cr"><span class="ic-c">${I('check')}</span><span>${r[1]}</span></div>`).join('')}
      </div>
    </div>
  </div>`);
}

/* ============ SLIDE 10 — POUR QUI ============ */
function s10(){
  const seg=[['house','Maison &amp; appart.'],['building-2','Bureaux &amp; tertiaire'],['store','Commerces'],['car','Garages'],['warehouse','Entrepôts'],['landmark','Collectivités']];
  const bands=['Smart Home','Smart Building','Smart Service','Smart City'];
  return slide(`${head('10','POUR QUI ?')}${foot}
  <div class="content">
    <div style="display:flex;justify-content:space-between;align-items:flex-end">
      <div class="h1">Le cerveau énergétique de <span class="em">chaque lieu.</span></div>
    </div>
    <div class="lead" style="margin-top:14px">Maison, appartement, bureau, boutique, garage, entrepôt… partout où il y a un tableau électrique.</div>
    <div style="display:grid;grid-template-columns:repeat(6,1fr);gap:14px;margin-top:28px">
      ${seg.map(s=>`<div class="seg"><span class="chip">${I(s[0])}</span><div class="sn">${s[1]}</div></div>`).join('')}
    </div>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-top:20px">
      ${bands.map(b=>`<div style="text-align:center;padding:16px;border-radius:14px;background:linear-gradient(160deg,rgba(43,224,138,.10),rgba(21,214,198,.03));border:1px solid rgba(43,224,138,.24);font-family:'SG';font-weight:600;font-size:17px;color:#fff;letter-spacing:.01em">${b}</div>`).join('')}
    </div>
  </div>`);
}

/* ============ SLIDE 11 — INSTALLATION ============ */
function s11(){
  const steps=[
    ['replace','Je remplace mon tableau','OGHJI se branche entre le disjoncteur général et les circuits.'],
    ['settings-2','Je configure','L\'assistant intégré guide chaque circuit, pas à pas.'],
    ['radar','Je surveille','OGHJI mesure, protège et m\'alerte au moindre défaut.'],
    ['smartphone','Je connecte l\'app','Pilotage à distance depuis mobile et web (option).'],
  ];
  return slide(`${head('11','SIMPLE & RAPIDE')}${foot}
  <div class="content">
    <div style="display:flex;justify-content:space-between;align-items:flex-end">
      <div class="h1">Installé en <span class="em">4 étapes.</span></div>
      <div class="shot" style="width:280px;height:118px;padding:0"><img src="assets/install-beforeafter.png" alt="Avant / après OGHJI"><div class="cap"><span class="dot">●</span> Du tableau classique… à OGHJI</div></div>
    </div>
    <div class="steps" style="margin-top:34px">
      ${steps.map((s,i)=>`<div class="step"><div style="display:flex;align-items:center;justify-content:space-between"><div class="no">0${i+1}</div></div><div class="sic">${I(s[0])}</div><div class="stt">${s[1]}</div><div class="std">${s[2]}</div></div>`).join('')}
    </div>
    <div style="margin-top:24px;display:flex;align-items:center;gap:12px;justify-content:center;font-family:'JB';font-weight:500;font-size:12px;letter-spacing:.1em;color:var(--ink-3)">
      ${I('clock')}&nbsp; UN REMPLACEMENT, PAS UN CHANTIER
    </div>
  </div>`);
}

/* ============ SLIDE 12 — CTA ============ */
function s12(){
  return slide(`${trace()}
  <div class="content" style="top:0;bottom:0;left:0;right:0;padding:0">
    <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:30px">
        <span class="mk" style="width:40px;height:40px;border-radius:12px;display:grid;place-items:center;background:var(--accent);color:#04110e;box-shadow:0 8px 24px rgba(43,224,138,.45)">${MARK}</span>
        <span style="font-family:'SG';font-weight:700;font-size:28px;letter-spacing:.04em">oghji</span>
      </div>
      <div class="h1" style="font-size:60px;letter-spacing:-1.8px;line-height:1.05">Donnez un cerveau<br>à <span class="em">votre énergie.</span></div>
      <div class="lead" style="margin-top:22px;text-align:center;max-width:560px">Rejoignez les premiers à équiper leurs installations du tableau électrique intelligent OGHJI.</div>
      <div style="display:flex;align-items:center;gap:16px;margin-top:36px">
        <div style="display:inline-flex;align-items:center;gap:11px;padding:16px 30px;border-radius:14px;background:var(--accent);color:#04110e;font-family:'SG';font-weight:700;font-size:17px;box-shadow:0 18px 40px -14px rgba(43,224,138,.6)">${I('calendar-check')}&nbsp;Demander une démo</div>
        <div class="pill big">${I('rocket')}&nbsp;Précommandes à venir</div>
      </div>
    </div>
  </div>
  <div class="foot" style="bottom:34px"><span><span class="dot">●</span>&nbsp; oghji · smart energy</span><span>Le cerveau énergétique et électrique</span></div>`);
}

const slides=[s1(),s2(),s3(),s4(),s5(),s6(),s7(),s8(),s9(),s10(),s11(),s12()];
const html=`<!doctype html><html lang="fr"><head><meta charset="utf-8"><style>${css}</style></head>
<body><div class="deck">${slides.join('\n')}</div></body></html>`;
fs.writeFileSync('deck.html',html);
console.log('deck.html written —',slides.length,'slides,',html.length,'bytes');
