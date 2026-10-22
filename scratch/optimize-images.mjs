// Recomprime imágenes de public/images manteniendo nombre y formato.
// Máx. 1000px de ancho (tarjeta 500px @2x). Solo sobrescribe si ahorra >10%.
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const dir = 'public/images';
let before = 0, after = 0;
for (const f of fs.readdirSync(dir)) {
  const p = path.join(dir, f);
  const ext = path.extname(f).toLowerCase();
  if (!['.webp', '.png', '.jpg', '.jpeg'].includes(ext)) continue;
  const orig = fs.readFileSync(p);
  const meta = await sharp(orig).metadata();
  const maxW = f.startsWith('bg-paper') ? 1200 : 1000;
  let img = sharp(orig).rotate();
  if (meta.width > maxW) img = img.resize({ width: maxW });
  let out;
  if (ext === '.webp') out = await img.webp({ quality: 80, effort: 6, alphaQuality: 90 }).toBuffer();
  else if (ext === '.png') out = await img.png({ compressionLevel: 9, palette: true, quality: 90, effort: 10 }).toBuffer();
  else out = await img.jpeg({ quality: 80, mozjpeg: true }).toBuffer();
  before += orig.length;
  if (out.length < orig.length * 0.9) { fs.writeFileSync(p, out); after += out.length; console.log(`${f}: ${(orig.length/1024)|0}KB -> ${(out.length/1024)|0}KB`); }
  else after += orig.length;
}
console.log(`TOTAL ${(before/1048576).toFixed(1)}MB -> ${(after/1048576).toFixed(1)}MB`);
