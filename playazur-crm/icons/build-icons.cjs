// Génère les icônes PNG de la PWA à partir du SVG.
// Usage : node build-icons.cjs
// Régénère : icon-192.png, icon-512.png, icon-maskable-512.png, apple-touch-icon-180.png, favicon-32.png, favicon-16.png
//
// Pour utiliser le logo officiel : pose play-azur-logo.png (carré, idéalement 1024×1024)
// dans ce dossier puis relance ce script. Il sera prioritaire sur le SVG.

const path = require('path');
const fs = require('fs');

// Playwright est installé globalement dans cet environnement
const playwrightPath = '/opt/node22/lib/node_modules/playwright';
const { chromium } = require(playwrightPath);

const SVG_PATH    = path.join(__dirname, 'play-azur-logo.svg');
const PNG_OVERRIDE = path.join(__dirname, 'play-azur-logo.png');

const SIZES = [
  { name: 'icon-192.png',            size: 192, padding: 0,  bg: 'transparent' },
  { name: 'icon-512.png',            size: 512, padding: 0,  bg: 'transparent' },
  { name: 'icon-maskable-512.png',   size: 512, padding: 60, bg: '#1B6FFF' },
  { name: 'apple-touch-icon-180.png', size: 180, padding: 0, bg: '#ffffff' },
  { name: 'favicon-32.png',          size: 32,  padding: 0,  bg: 'transparent' },
  { name: 'favicon-16.png',          size: 16,  padding: 0,  bg: 'transparent' }
];

(async () => {
  const usePng = fs.existsSync(PNG_OVERRIDE);
  const sourceData = usePng
    ? `data:image/png;base64,${fs.readFileSync(PNG_OVERRIDE).toString('base64')}`
    : `data:image/svg+xml;base64,${fs.readFileSync(SVG_PATH).toString('base64')}`;

  console.log(`[ICONS] Source : ${usePng ? 'PNG officiel' : 'SVG fallback'}`);

  const browser = await chromium.launch();
  const page = await browser.newPage();

  for (const cfg of SIZES) {
    const innerSize = cfg.size - cfg.padding * 2;
    const html = `<!DOCTYPE html><html><head><style>
      html,body { margin:0; padding:0; width:${cfg.size}px; height:${cfg.size}px;
                  background:${cfg.bg}; overflow:hidden; }
      img { display:block; width:${innerSize}px; height:${innerSize}px;
            margin:${cfg.padding}px; object-fit:contain; }
    </style></head><body><img src="${sourceData}"/></body></html>`;

    await page.setViewportSize({ width: cfg.size, height: cfg.size });
    await page.setContent(html);
    await page.waitForLoadState('domcontentloaded');

    const buf = await page.screenshot({
      omitBackground: cfg.bg === 'transparent',
      type: 'png',
      clip: { x: 0, y: 0, width: cfg.size, height: cfg.size }
    });
    fs.writeFileSync(path.join(__dirname, cfg.name), buf);
    console.log(`  ✓ ${cfg.name} (${cfg.size}×${cfg.size})`);
  }

  await browser.close();
  console.log('[ICONS] Terminé.');
})().catch(err => {
  console.error('[ICONS] Erreur :', err);
  process.exit(1);
});
