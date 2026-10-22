// Genera src/data/arte.js con la lista del arte incluido en src/img/arte, para que el
// navegador y Android (que no pueden listar carpetas) lo encuentren sin internet.
// También copia los lugares y retratos por temporada de arcaneData/arte a src/img/arte.
// Uso: node scripts/art-manifest.js        (node scripts/art-manifest.js --check solo comprueba)
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', 'src', 'img', 'arte');
const out = path.join(__dirname, '..', 'src', 'data', 'arte.js');
// Copias canónicas en arcaneData (organizadas por ciudad y temporada) → copia que empaqueta el juego.
const DATA = path.join(__dirname, '..', 'arcaneData', 'arte');
const SYNC = [
  ['mapa/piltover/s1', 'lugares/s1'], ['mapa/zaun/s1', 'lugares/s1'],
  ['mapa/piltover/s2', 'lugares/s2'], ['mapa/zaun/s2', 'lugares/s2'],
  ['personajes/referencias/s1', 'personajes/s1'], ['personajes/referencias/s2', 'personajes/s2'],
];
const DIRS = ['avatares', 'personajes', 'caras', 'lugares', 'codice', 'mapa/piltover', 'mapa/zaun', 'personajes/s1', 'personajes/s2', 'caras/s1', 'caras/s2', 'lugares/s1', 'lugares/s2'];

function build() {
  const data = {};
  for (const d of DIRS) {
    const dir = path.join(root, d);
    const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => /\.(png|jpe?g|webp)$/i.test(f)).sort() : [];
    data[d] = Object.fromEntries(files.map((f) => [f.replace(/\.[^.]+$/, '').toLowerCase(), `img/arte/${d}/${f}`]));
  }
  return `// Generado por scripts/art-manifest.js: no lo edites a mano.\nwindow.ART_BUNDLED = ${JSON.stringify(data, null, 2)};\n`;
}

// Devuelve las copias que faltan o no coinciden; si fix, las copia.
function sync(fix) {
  const bad = [];
  for (const [from, to] of SYNC) {
    const src = path.join(DATA, from);
    if (!fs.existsSync(src)) continue;
    for (const f of fs.readdirSync(src).filter((x) => /\.(png|jpe?g|webp)$/i.test(x))) {
      const a = path.join(src, f);
      const b = path.join(root, to, f);
      if (fs.existsSync(b) && fs.readFileSync(a).equals(fs.readFileSync(b))) continue;
      bad.push(`${to}/${f}`);
      if (fix) { fs.mkdirSync(path.dirname(b), { recursive: true }); fs.copyFileSync(a, b); }
    }
  }
  return bad;
}

const check = process.argv.includes('--check');
const unsynced = sync(!check);
if (check && unsynced.length) { console.error(`✗ Copias de arcaneData/arte sin pasar a src/img/arte: ${unsynced.join(', ')}. Ejecuta node scripts/art-manifest.js`); process.exit(1); }
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
