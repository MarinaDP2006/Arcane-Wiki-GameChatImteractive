// Saca todos los textos en español del juego para traducirlos.
// Uso: node scripts/i18n-extract.js  →  i18n/textos.tsv (id, archivo, texto)
// y avisa de los textos que aún faltan en src/i18n/en.js y src/i18n/fr.js.
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const files = [
  ...fs.readdirSync(path.join(root, 'src/data')).map((f) => `src/data/${f}`),
  ...fs.readdirSync(path.join(root, 'src/js')).filter((f) => f !== 'i18n.js').map((f) => `src/js/${f}`),
];

function stripComments(s) {
  return s.replace(/^\s*\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
}

function literals(src) {
  const out = [];
  const re = /'((?:[^'\\\n]|\\.)*)'|"((?:[^"\\\n]|\\.)*)"|`((?:[^`\\]|\\.)*)`/g;
  let m;
  while ((m = re.exec(src))) {
    if (m[3] != null) {
      // Plantilla: cada ${…} pasa a {0}, {1}…
      let n = 0;
      let body = '';
      let depth = 0;
      const raw = m[3];
      for (let i = 0; i < raw.length; i++) {
        if (depth === 0 && raw[i] === '$' && raw[i + 1] === '{') { depth = 1; i++; body += `{${n++}}`; continue; }
        if (depth > 0) { if (raw[i] === '{') depth++; else if (raw[i] === '}') depth--; continue; }
        body += raw[i];
      }
      out.push(body);
    } else out.push((m[1] ?? m[2]).replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\n/g, '\n'));
  }
  return out;
}

function displayable(s) {
  if (!/[A-Za-zÁÉÍÓÚÑáéíóúñ]/.test(s.replace(/\{\d\}/g, ''))) return false;
  if (/rgba?\(|hsla?\(|\dpx|void main|uniform |varying |translate\(|saturate\(|=>|\(pointer/.test(s)) return false;
  if (/^[A-Za-z]+$/.test(s) && /[a-z][A-Z]/.test(s)) return false; // camelCase
  if (/^[a-z0-9_-]+$/.test(s)) return false; // ids
  if (/^(img|css|js|data|https?):|\.(webp|png|jpg|js|css|mp4)$|^#|^\.|^[a-z-]+:\s?[^ ]+;?$/.test(s)) return false;
  if (/^[a-z]+(\s[a-z-]+)*$/.test(s) && !/\s/.test(s)) return false;
  if (/^[a-z][a-z-]*( [a-z][a-z-]*)+$/.test(s) && !/[áéíóúñ]/.test(s) && s.split(' ').every((w) => /-/.test(w) || w.length < 12) && /^(btn|row|col|muted|small|tag|chip|panel|icon|card|hud|is-|has-)/.test(s)) return false; // clases CSS
  return true;
}

const seen = new Map();
for (const f of files) {
  const src = stripComments(fs.readFileSync(path.join(root, f), 'utf8'));
  for (const lit of literals(src)) {
    // El HTML se traduce por trozos de texto.
    for (let frag of lit.split(/<[^>]+>/)) {
      frag = frag.replace(/\s+/g, ' ').trim();
      if (!frag || !displayable(frag)) continue;
      if (!seen.has(frag)) seen.set(frag, f);
    }
  }
}

const out = path.join(root, 'i18n');
fs.mkdirSync(out, { recursive: true });
const rows = [...seen].map(([t, f], i) => `${i + 1}\t${f}\t${t.replace(/\t/g, ' ').replace(/\n/g, '\\n')}`);
fs.writeFileSync(path.join(out, 'textos.tsv'), `id\tarchivo\ttexto\n${rows.join('\n')}\n`);

const ctx = { window: {} };
vm.createContext(ctx);
for (const l of ['en', 'fr']) {
  const p = path.join(root, 'src/i18n', `${l}.js`);
  if (fs.existsSync(p)) vm.runInContext(fs.readFileSync(p, 'utf8'), ctx);
}
const data = ctx.window.I18N_DATA || {};
for (const l of ['en', 'fr']) {
  const d = data[l] || {};
  const missing = [...seen.keys()].filter((k) => d[k] == null);
  console.log(`${l}: ${seen.size - missing.length}/${seen.size} textos traducidos`);
}
