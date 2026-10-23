// Genera src/data/chat-deep.js (solo español) y añade inglés/francés a src/i18n/{en,fr}.js.
// Los diálogos se escriben en c01.js, c02.js… con cada texto como [español, inglés, francés].
// Uso: node scripts/chat-deep/gen.js
const fs = require('fs'), path = require('path'), vm = require('vm');
const repo = path.resolve(__dirname, '..', '..');
const parts = fs.readdirSync(__dirname).filter((f) => /^c\d+\.js$/.test(f)).sort();
const SRC = Object.assign({}, ...parts.map((f) => require(path.join(__dirname, f))));
const tr = { en: {}, fr: {} };
const problems = [];
const ph = (s) => (s.match(/\{(name|job|district|family|hobby|\d)\}/g) || []).sort().join();
function L(x, where) {
  if (!Array.isArray(x) || x.length !== 3 || x.some((s) => typeof s !== 'string' || !s.trim())) { problems.push(`${where}: ${JSON.stringify(x)}`); return '?'; }
  const [es, en, fr] = x;
  if (ph(es) !== ph(en) || ph(es) !== ph(fr)) problems.push(`${where}: variables distintas en «${es}»`);
  for (const [l, v] of [['en', en], ['fr', fr]]) {
    if (tr[l][es] && tr[l][es] !== v) problems.push(`${where}: traducción ${l} duplicada distinta de «${es}»`);
    tr[l][es] = v;
  }
  return es;
}
const lines = (arr, w) => arr.map((x, i) => L(x, `${w}[${i}]`));
const out = {};
for (const [id, c] of Object.entries(SRC)) {
  const nodes = {};
  const opt = (o, w) => {
    const r = { t: L(o.t, w + '.t') };
    if (o.tone) r.tone = o.tone;
    if (o.req) r.req = o.req;
    if (o.say) r.say = lines(o.say, w + '.say');
    r.go = o.go;
    if (o.fx) r.fx = o.fx;
    if (!o.go) problems.push(`${w}: sin go`);
    return r;
  };
  for (const [nid, n] of Object.entries(c.nodes)) {
    const w = `${id}.${nid}`;
    nodes[nid] = { say: lines(n.say, w + '.say') };
    if (n.again) nodes[nid].again = lines(n.again, w + '.again');
    nodes[nid].opts = n.opts.map((o, i) => opt(o, `${w}.opts[${i}]`));
    if (n.opts.length < 3) problems.push(`${w}: menos de 3 opciones`);
  }
  for (const [nid, n] of Object.entries(nodes)) for (const o of n.opts) if (o.go !== 'hub' && !nodes[o.go]) problems.push(`${id}.${nid}: va a ${o.go}`);
  for (const nid of Object.keys(nodes)) if (nid !== 'h_raiz' && !Object.values(nodes).some((n) => n.opts.some((o) => o.go === nid))) problems.push(`${id}.${nid}: inalcanzable`);
  out[id] = { entry: opt(c.entry, `${id}.entry`), nodes };
}
if (problems.length) { console.error(problems.join('\n')); process.exit(1); }

let js = `// Conversaciones sin fin: cada personaje tiene un «Hablemos sin prisa» con temas que se ramifican.
// Cada respuesta lleva a otra pregunta y los temas se enlazan entre sí, así que la charla no se acaba
// hasta que eliges «Cambiar de tema» o «Hasta luego» (siempre disponibles).
// Nodo: { say, again?, opts }. again: frases alternativas cuando vuelves a un nodo ya visitado.
// Lo genera un guion a partir de un original trilingüe; las traducciones están en src/i18n.
(function () {
  const CHAT = window.CHAT;
  if (!CHAT || CHAT.deepV1) return;
  const DEEP = ${JSON.stringify(out, null, 2).replace(/\n/g, '\n  ')};
  for (const [id, d] of Object.entries(DEEP)) {
    if (!CHAT[id]) continue;
    CHAT[id].hub.push(d.entry);
    CHAT[id].nodes = Object.assign(CHAT[id].nodes || {}, d.nodes);
  }
  // No enumerar esta marca: el validador recorre Object.values(CHAT) como personajes.
  Object.defineProperty(CHAT, 'deepV1', { value: true, enumerable: false });
})();
`;
fs.writeFileSync(path.join(repo, 'src/data/chat-deep.js'), js);

// Las traducciones nuevas se añaden al final del diccionario, entre marcas, sin reordenar lo demás.
const ctx = { window: {} }; vm.createContext(ctx);
for (const l of ['en', 'fr']) {
  const p = path.join(repo, 'src/i18n', `${l}.js`);
  let f = fs.readFileSync(p, 'utf8').replace(/,?\n  \/\/ >>> chat-deep[\s\S]*?\/\/ <<< chat-deep/, '');
  vm.runInContext(f, ctx);
  const have = ctx.window.I18N_DATA[l];
  const add = Object.entries(tr[l]).filter(([k]) => !(k in have));
  const block = add.map(([k, v]) => `  ${JSON.stringify(k)}: ${JSON.stringify(v)}`).join(',\n');
  f = f.replace(/\n\};\n$/, `,\n  // >>> chat-deep\n${block}\n  // <<< chat-deep\n};\n`);
  fs.writeFileSync(p, f);
}
const nOpts = Object.values(out).reduce((a, c) => a + 1 + Object.values(c.nodes).reduce((b, n) => b + n.opts.length, 0), 0);
console.log(`${Object.keys(out).length} personajes, ${Object.values(out).reduce((a, c) => a + Object.keys(c.nodes).length, 0)} nodos, ${nOpts} opciones, ${Object.keys(tr.en).length} textos traducidos`);
