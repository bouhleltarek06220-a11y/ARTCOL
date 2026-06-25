import { chromium } from 'playwright';
import fs from 'fs';
const imgs = Array.from({length:12},(_,i)=>`out/slide-${String(i+1).padStart(2,'0')}.png`);
const cells = imgs.map((p,i)=>{
  const b64 = fs.readFileSync(p).toString('base64');
  return `<div class="c"><span class="n">${String(i+1).padStart(2,'0')}</span><img src="data:image/png;base64,${b64}"></div>`;
}).join('');
const html=`<!doctype html><html><head><meta charset="utf-8"><style>
*{margin:0;box-sizing:border-box}body{background:#020806;padding:40px;font-family:sans-serif}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;width:1600px}
.c{position:relative;border-radius:12px;overflow:hidden;border:1px solid rgba(255,255,255,.12);box-shadow:0 16px 40px -16px #000}
.c img{display:block;width:100%}
.n{position:absolute;top:10px;left:10px;z-index:2;font-family:monospace;font-weight:700;font-size:15px;color:#04110e;background:linear-gradient(100deg,#2BE08A,#15D6C6);padding:3px 9px;border-radius:7px}
</style></head><body><div class="grid">${cells}</div></body></html>`;
fs.writeFileSync('overview.html',html);
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',args:['--no-sandbox','--disable-gpu']});
const pg=await b.newPage({viewport:{width:1680,height:2000},deviceScaleFactor:1.4});
await pg.goto('file://'+process.cwd()+'/overview.html',{waitUntil:'networkidle'});
const el=await pg.$('.grid');
await el.screenshot({path:'out/overview.png'});
await b.close();console.log('overview done');
