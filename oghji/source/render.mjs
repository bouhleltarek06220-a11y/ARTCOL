import { chromium } from 'playwright';
import path from 'path';
const url = 'file://' + path.resolve('deck.html');
const b = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args:['--no-sandbox','--disable-gpu','--force-color-profile=srgb','--font-render-hinting=none'] });
const p = await b.newPage({ viewport:{width:1300,height:760}, deviceScaleFactor:2 });
await p.goto(url, { waitUntil:'networkidle' });
await p.evaluate(()=>document.fonts.ready);
await p.waitForTimeout(350);
const slides = await p.$$('.slide');
console.log('found', slides.length, 'slides');
for (let i=0;i<slides.length;i++){
  const n = String(i+1).padStart(2,'0');
  await slides[i].screenshot({ path:`out/slide-${n}.png` });
  process.stdout.write(`${n} `);
}
await b.close();
console.log('\nrender done');
