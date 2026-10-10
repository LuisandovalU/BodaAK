/**
 * Verifica los .astro con el compilador oficial (@astrojs/compiler) y el
 * contenido de cada <script> con esbuild. No modifica ningún archivo.
 */
import { transform } from '@astrojs/compiler';
import { transform as esbuild } from 'esbuild';
import { readFileSync } from 'node:fs';

const FILES = [
  'src/layouts/Layout.astro',
  'src/pages/index.astro',
  'src/components/Hero.astro',
  'src/components/DressCode.astro',
  'src/components/Gifts.astro',
  'src/components/ImportantNotes.astro',
  'src/components/RSVP.astro',
  'src/components/S2_Names.astro',
  'src/components/S5_Ubicacion.astro',
  'src/components/S8_Galeria.astro',
];

const SCRIPT_RE = /<script(?![^>]*\bsrc=)(?![^>]*is:inline)[^>]*>([\s\S]*?)<\/script>/g;

let fallos = 0;

for (const file of FILES) {
  const source = readFileSync(file, 'utf8');

  // 1) Compilación completa del componente Astro
  try {
    const { diagnostics } = await transform(source, { filename: file, sourcemap: false });
    const errores = diagnostics.filter((d) => d.severity === 1);
    const avisos = diagnostics.filter((d) => d.severity !== 1);
    if (errores.length) {
      fallos++;
      console.log(`✗ ${file}`);
      for (const d of errores) console.log(`    error ${d.code}: ${d.text}`);
    } else {
      const extra = avisos.length ? ` (${avisos.length} aviso/s)` : '';
      console.log(`✓ ${file}${extra}`);
      for (const d of avisos) console.log(`    aviso ${d.code}: ${d.text}`);
    }
  } catch (error) {
    fallos++;
    console.log(`✗ ${file}\n    excepción: ${error.message}`);
  }

  // 2) El JS/TS dentro de <script> (Astro lo pasa por esbuild)
  for (const match of source.matchAll(SCRIPT_RE)) {
    const code = match[1].trim();
    if (!code) continue;
    try {
      await esbuild(code, { loader: 'ts', format: 'esm' });
    } catch (error) {
      fallos++;
      console.log(`✗ ${file} → <script>\n    ${error.message.split('\n')[0]}`);
    }
  }
}

console.log(fallos === 0 ? '\nTODO OK: 0 errores' : `\n${fallos} archivo(s) con problemas`);
process.exit(fallos === 0 ? 0 : 1);
