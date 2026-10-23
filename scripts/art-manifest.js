// Genera src/data/arte.js con la lista del arte incluido en src/img/arte, para que el
// navegador y Android (que no pueden listar carpetas) lo encuentren sin internet.
// El arte propio del Umbral (SVG) está en src/img/umbral y no necesita lista.
// Uso: node scripts/art-manifest.js        (node scripts/art-manifest.js --check solo comprueba)
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', 'src', 'img', 'arte');
const out = path.join(__dirname, '..', 'src', 'data', 'arte.js');
const DIRS = ['avatares', 'personajes', 'caras', 'lugares', 'codice', 'mapa/aurelia', 'mapa/nacar', 'personajes/s1', 'personajes/s2', 'caras/s1', 'caras/s2', 'lugares/s1', 'lugares/s2'];

function build() {
  const data = {};
  for (const d of DIRS) {
    const dir = path.join(root, d);
    const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => /\.(png|jpe?g|webp)$/i.test(f)).sort() : [];
    data[d] = Object.fromEntries(files.map((f) => [f.replace(/\.[^.]+$/, '').toLowerCase(), `img/arte/${d}/${f}`]));
  }
  return `// Generado por scripts/art-manifest.js: no lo edites a mano.\nwindow.ART_BUNDLED = ${JSON.stringify(data, null, 2)};\n`;
}

const check = process.argv.includes('--check');
const text = build();
if (check) {
  // Git en Windows puede cambiar los saltos de línea (\r\n): no cuentan como cambio.
  const cur = fs.existsSync(out) ? fs.readFileSync(out, 'utf8').replace(/\r\n/g, '\n') : '';
  if (cur !== text) { console.error('✗ src/data/arte.js está desactualizado: ejecuta node scripts/art-manifest.js'); process.exit(1); }
  console.log('✓ Lista de arte incluido al día');
} else {
  fs.writeFileSync(out, text);
  console.log(`✓ src/data/arte.js: ${DIRS.map((d) => `${d} ${(text.match(new RegExp(`img/arte/${d}/`, 'g')) || []).length}`).join(' · ')}`);
}
