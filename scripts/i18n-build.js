// Junta las traducciones de i18n/traducciones/*.tsv (id ⇥ inglés ⇥ francés, con los ids de
// i18n/textos.tsv) en src/i18n/en.js y src/i18n/fr.js, que van con clave = texto en español.
// Uso: node scripts/i18n-extract.js && node scripts/i18n-build.js
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const unesc = (s) => s.replace(/\\n/g, '\n');
const src = new Map();
for (const line of fs.readFileSync(path.join(root, 'i18n/textos.tsv'), 'utf8').split('\n').slice(1)) {
  const [id, , text] = line.split('\t');
  if (id) src.set(id, unesc(text));
}

// Lo ya publicado se conserva (las claves son el texto en español, no cambian con los ids).
const ctx = { window: {} };
vm.createContext(ctx);
const out = { en: {}, fr: {} };
for (const l of ['en', 'fr']) {
  const p = path.join(root, 'src/i18n', `${l}.js`);
  if (fs.existsSync(p)) { vm.runInContext(fs.readFileSync(p, 'utf8'), ctx); Object.assign(out[l], ctx.window.I18N_DATA[l]); }
}

const dir = process.argv[2] ? path.resolve(process.argv[2]) : path.join(root, 'i18n/traducciones');
const placeholders = (s) => (s.match(/\{(name|job|district|family|hobby|\d)\}/g) || []).sort().join();
const problems = [];
for (const f of fs.existsSync(dir) ? fs.readdirSync(dir).sort() : []) {
  for (const line of fs.readFileSync(path.join(dir, f), 'utf8').split('\n')) {
    if (!line.trim() || line.startsWith('#')) continue;
    const [id, en, fr] = line.split('\t');
    const es = src.get(id);
    if (es == null) { problems.push(`${f}: id ${id} no existe`); continue; }
    for (const [l, v] of [['en', en], ['fr', fr]]) {
      if (!v) { problems.push(`${f}: id ${id} sin ${l}`); continue; }
      const t = unesc(v.trim());
      if (placeholders(t) !== placeholders(es)) problems.push(`${f}: id ${id} (${l}) no conserva las variables de «${es}»`);
      if (t !== es) out[l][es] = t;
    }
  }
}

fs.mkdirSync(path.join(root, 'src/i18n'), { recursive: true });
const names = { en: 'English', fr: 'Français' };
for (const l of ['en', 'fr']) {
  const body = JSON.stringify(out[l], Object.keys(out[l]).sort(), 1).replace(/^ "/gm, '  "');
  fs.writeFileSync(path.join(root, 'src/i18n', `${l}.js`),
    `// ${names[l]}: texto original en español → traducción. Lo genera scripts/i18n-build.js.\n` +
    `window.I18N_DATA = window.I18N_DATA || {};\nwindow.I18N_DATA.${l} = ${body};\n`);
  console.log(`${l}: ${Object.keys(out[l]).length} textos`);
}
problems.forEach((p) => console.log('⚠', p));
