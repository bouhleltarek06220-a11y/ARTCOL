import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
const doc = await PDFDocument.create();
// 16:9 page at 1280x720 pt
const W = 1280, H = 720;
for (let i=1;i<=12;i++){
  const n = String(i).padStart(2,'0');
  const png = await doc.embedPng(fs.readFileSync(`out/slide-${n}.png`));
  const page = doc.addPage([W,H]);
  page.drawImage(png, { x:0, y:0, width:W, height:H });
}
doc.setTitle('OGHJI — Le cerveau énergétique et électrique');
doc.setAuthor('OGHJI Smart Energy');
doc.setSubject('Présentation commerciale OGHJI');
fs.writeFileSync('OGHJI_Presentation_Commerciale.pdf', await doc.save());
console.log('PDF written: OGHJI_Presentation_Commerciale.pdf');
