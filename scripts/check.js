// Valida los datos del juego: grafo de la historia, hablantes, desbloqueos y diálogos.
// Uso: npm run check
const path = require('path');
const fs = require('fs');
const vm = require('vm');

const ctx = { window: {} };
vm.createContext(ctx);
for (const f of ['wiki.js', 'creation.js', 'story.js', 'story-expansion.js', 'alternate-fates.js', 'chat.js', 'chat-expansion.js', 'relations.js', 'world.js', 'atlas.js']) {
  vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'src', 'data', f), 'utf8'), ctx, { filename: f });
}
const { WIKI, STORY, CHAT, CREATION, WORLD, ATLAS, RELATIONS } = ctx.window;
const errors = [];
const chars = new Set(WIKI.personajes.map((p) => p.id));
const allIds = new Set(WIKI.categories.flatMap((c) => WIKI[c.id].map((e) => e.id)));
const cast = new Set(STORY.cast || []);
const speakers = new Set([...cast, 'narrador', 'yo', 'sistema']);
cast.forEach((id) => { if (!chars.has(id)) errors.push(`reparto: "${id}" no está en la wiki`); });
const FLAG_SET = new Set(['familia_famosa']);
const GAME_IDS = ['foso', 'tejados', 'aerotabla', 'tiro', 'circuito', 'runas', 'regateo'];

for (const ch of STORY.chapters) {
  for (const n of Object.values(ch.nodes)) for (const c of n.choices || []) [...(c.fx?.flags || []), ...(c.game?.winFx?.flags || [])].forEach((f) => FLAG_SET.add(f));
}

for (const ch of STORY.chapters) {
  if (!ch.nodes[ch.start]) errors.push(`${ch.id}: nodo inicial "${ch.start}" no existe`);
  (ch.unlocks || []).forEach((id) => {
    if (!cast.has(id)) errors.push(`${ch.id}: desbloquea "${id}" que no es del reparto`);
    if (!CHAT[id]) errors.push(`${ch.id}: "${id}" no tiene diálogos de chat`);
  });
  for (const [nid, n] of Object.entries(ch.nodes)) {
    const where = `${ch.id}.${nid}`;
    if (n.ending) continue;
    (n.lines || []).forEach((l) => { if (!speakers.has(l.s)) errors.push(`${where}: hablante desconocido "${l.s}"`); });
    if (n.next && !ch.nodes[n.next]) errors.push(`${where}: next "${n.next}" no existe`);
    if (!n.next && !n.choices && !n.end) errors.push(`${where}: nodo sin salida`);
    if (n.choices) {
      const free = n.choices.some((c) => !c.req || c.req.notFlag);
      if (!free) errors.push(`${where}: todas las opciones tienen requisitos (el jugador podría quedarse atascado)`);
      for (const c of n.choices) {
        if (!ch.nodes[c.next]) errors.push(`${where}: opción "${c.t}" apunta a "${c.next}" que no existe`);
        if (c.game) {
          if (!GAME_IDS.includes(c.game.id)) errors.push(`${where}: minijuego "${c.game.id}" desconocido`);
          for (const k of ['win', 'lose']) if (!ch.nodes[c.game[k]]) errors.push(`${where}: minijuego ${k} -> "${c.game[k]}" no existe`);
          (c.game.winFx?.flags || []).forEach((f) => FLAG_SET.add(f));
        }
        Object.keys(c.fx?.aff || {}).forEach((id) => { if (!chars.has(id)) errors.push(`${where}: afinidad con "${id}" desconocido`); });
        if (c.req?.flag && !FLAG_SET.has(c.req.flag)) errors.push(`${where}: requiere flag "${c.req.flag}" que nunca se activa`);
        if (c.req?.stat && !STORY.stats[c.req.stat]) errors.push(`${where}: estadística "${c.req.stat}" desconocida`);
      }
    }
  }
}
// Condiciones de las líneas (cond) y muertes del canon: nadie habla después de morir.
const COND_KEYS = ['flag', 'notFlag', 'met', 'notMet', 'kin', 'notKin', 'origin'];
const checkCond = (where, c) => {
  if (!c) return;
  Object.keys(c).forEach((k) => { if (!COND_KEYS.includes(k)) errors.push(`${where}: condición "${k}" desconocida`); });
  ['met', 'notMet', 'kin', 'notKin'].forEach((k) => { if (c[k] && !cast.has(c[k])) errors.push(`${where}: ${k} "${c[k]}" no es del reparto`); });
  if (c.origin && !CREATION.origins[c.origin]) errors.push(`${where}: origen "${c.origin}" desconocido`);
};
for (const ch of STORY.chapters) for (const [nid, n] of Object.entries(ch.nodes)) {
  (n.lines || []).forEach((l) => checkCond(`${ch.id}.${nid}`, l.cond));
  (n.choices || []).forEach((c) => checkCond(`${ch.id}.${nid}`, c.req && Object.fromEntries(Object.entries(c.req).filter(([k]) => COND_KEYS.includes(k) || !['stat', 'min', 'aff'].includes(k)))));
}
[...STORY.endings, ...(STORY.endings2 || [])].forEach((e) => e.lines.forEach((l) => checkCond(`final ${e.id}`, l.cond)));
const deaths = STORY.deaths || {};
for (const [id, chId] of Object.entries(deaths)) {
  if (!cast.has(id)) errors.push(`muertes: "${id}" no es del reparto`);
  if (!STORY.chapters.find((c) => c.id === chId)) errors.push(`muertes: capítulo "${chId}" de ${id} no existe`);
}
const s1 = new Set([...STORY.routes.zaun, ...STORY.routes.piltover]);
for (const [r, ids] of Object.entries(STORY.routes)) {
  // Capítulos ya terminados antes de cada capítulo de la ruta (en la T2, toda la T1).
  ids.forEach((chId, i) => {
    const before = new Set([...ids.slice(0, i), ...(r === 't2' ? s1 : [])]);
    const ch = STORY.chapters.find((c) => c.id === chId);
    if (!ch) return;
    for (const [nid, n] of Object.entries(ch.nodes)) (n.lines || []).forEach((l) => {
      if (deaths[l.s] && before.has(deaths[l.s])) errors.push(`${chId}.${nid}: habla ${l.s}, que murió en ${deaths[l.s]}`);
    });
    if (r === 't2' && chId === ids[ids.length - 1]) (STORY.endings2 || []).forEach((e) => e.lines.forEach((l) => {
      if (deaths[l.s] && (before.has(deaths[l.s]) || deaths[l.s] === chId) && !(l.cond?.flag && STORY.rescues?.[l.s] === l.cond.flag)) errors.push(`final ${e.id}: habla ${l.s}, que ya ha muerto`);
    }));
  });
}

for (const [r, ids] of Object.entries(STORY.routes)) ids.forEach((id) => { if (!STORY.chapters.find((c) => c.id === id)) errors.push(`ruta ${r}: capítulo "${id}" no existe`); });
[...STORY.endings, ...(STORY.endings2 || [])].forEach((e) => e.lines.forEach((l) => { if (!speakers.has(l.s)) errors.push(`final ${e.id}: hablante "${l.s}"`); }));
for (const p of WIKI.personajes) (p.relations || []).forEach((r) => { if (!allIds.has(r)) errors.push(`wiki ${p.id}: relación "${r}" no existe`); });
for (const o of Object.values(CREATION.origins)) for (const f of o.families) Object.keys(f.aff || {}).forEach((id) => { if (!chars.has(id)) errors.push(`familia ${f.id}: "${id}" desconocido`); });

// Mundo abierto
const locIds = new Set();
for (const [mid, m] of Object.entries(WORLD.maps)) {
  for (const l of m.locations) {
    if (locIds.has(l.id)) errors.push(`mapa ${mid}: lugar duplicado "${l.id}"`);
    locIds.add(l.id);
    if (l.codex && !allIds.has(l.codex)) errors.push(`lugar ${l.id}: entrada de Códice "${l.codex}" no existe`);
    if (l.activity && !STORY.stats[l.activity.stat]) errors.push(`lugar ${l.id}: estadística "${l.activity.stat}"`);
    if (l.activity?.game && !GAME_IDS.includes(l.activity.game)) errors.push(`lugar ${l.id}: minijuego "${l.activity.game}" desconocido`);
    if (l.x < 0 || l.y < 0 || l.x > m.size[0] || l.y > m.size[1]) errors.push(`lugar ${l.id}: fuera del mapa`);
  }
  for (const f of m.fragments) if (!allIds.has(f.codex)) errors.push(`fragmento en ${mid}: "${f.codex}" no existe`);
}
for (const m of Object.values(WORLD.maps)) for (const l of m.locations) {
  if (l.travel && (!WORLD.maps[l.travel.to] || !WORLD.maps[l.travel.to].locations.some((x) => x.id === l.travel.at))) errors.push(`lugar ${l.id}: destino de viaje inválido`);
}
for (const [id, loc] of Object.entries(WORLD.homes)) {
  if (!chars.has(id)) errors.push(`homes: personaje "${id}" no existe`);
  if (!locIds.has(loc)) errors.push(`homes: lugar "${loc}" de ${id} no existe`);
}
for (const ch of STORY.chapters) {
  const loc = WORLD.chapterLocations[ch.id];
  const ids = typeof loc === 'object' ? Object.values(loc) : [loc];
  ids.forEach((l) => { if (!locIds.has(l)) errors.push(`capítulo ${ch.id}: lugar de inicio "${l}" no existe`); });
}
for (const o of Object.values(CREATION.origins)) for (const d of o.districts) {
  if (!locIds.has(WORLD.spawns[d])) errors.push(`barrio "${d}" sin punto de aparición`);
}
const reachable = new Set([...Object.values(WORLD.maps).flatMap((m) => m.fragments.map((f) => f.codex)), ...Object.values(WORLD.maps).flatMap((m) => m.locations.map((l) => l.codex)).filter(Boolean), ...STORY.chapters.flatMap((c) => c.unlocks || [])]);
const unreachable = [...allIds].filter((id) => !reachable.has(id));
if (unreachable.length) console.warn(`(aviso) entradas del Códice que no se pueden desbloquear jugando: ${unreachable.join(', ')}`);

// Conversaciones con opciones de diálogo
const TONES = ['amable', 'broma', 'duro', 'pregunta', 'coqueto', 'astuto', 'serio', 'sigilo'];
for (const d of Object.values(CHAT)) for (const o of [...d.hub, ...Object.values(d.nodes || {}).flatMap((n) => n.opts)]) (o.fx?.flags || []).forEach((f) => FLAG_SET.add(f));
let dlgOpts = 0;
for (const [id, d] of Object.entries(CHAT)) {
  if (!cast.has(id)) errors.push(`chat: personaje "${id}" no es del reparto`);
  if (!d.greet?.low || !d.greet?.mid || !d.greet?.high) errors.push(`chat ${id}: faltan saludos`);
  if (!d.bye?.length) errors.push(`chat ${id}: falta despedida`);
  if (!Array.isArray(d.hub) || !d.hub.length) errors.push(`chat ${id}: menú de temas vacío`);
  const check = (where, n, o) => {
    dlgOpts++;
    if (!o.t) errors.push(`${where}: opción sin texto`);
    if (o.tone && !TONES.includes(o.tone)) errors.push(`${where}: tono "${o.tone}" desconocido`);
    if (o.go && o.go !== 'hub' && o.go !== 'bye' && !d.nodes?.[o.go]) errors.push(`${where}: «${o.t}» va a "${o.go}" que no existe`);
    if (!o.say && !o.go) errors.push(`${where}: «${o.t}» no tiene respuesta ni destino`);
    [].concat(o.say || []).forEach((l) => { if (typeof l === 'object' && !speakers.has(l.s)) errors.push(`${where}: hablante "${l.s}"`); });
    const r = o.req || {};
    if (r.stat && !STORY.stats[r.stat]) errors.push(`${where}: estadística "${r.stat}"`);
    if (Array.isArray(r.aff) && !chars.has(r.aff[0])) errors.push(`${where}: afinidad con "${r.aff[0]}"`);
    if ((r.flag || r.notFlag) && !FLAG_SET.has(r.flag || r.notFlag)) errors.push(`${where}: flag "${r.flag || r.notFlag}" que nunca se activa`);
    const aff = o.fx?.aff;
    if (aff && typeof aff === 'object') Object.keys(aff).forEach((k) => { if (!chars.has(k)) errors.push(`${where}: afinidad con "${k}"`); });
    Object.keys(o.fx?.stats || {}).forEach((k) => { if (!STORY.stats[k]) errors.push(`${where}: estadística "${k}"`); });
    Object.keys(o.fx || {}).forEach((k) => { if (!['aff', 'rep', 'stats', 'flags'].includes(k)) errors.push(`${where}: efecto "${k}" desconocido`); });
  };
  d.hub.forEach((o) => check(`chat ${id}.hub`, 'hub', o));
  for (const [nid, n] of Object.entries(d.nodes || {})) {
    if (!n.opts?.length) errors.push(`chat ${id}.${nid}: nodo sin opciones`);
    (n.opts || []).forEach((o) => check(`chat ${id}.${nid}`, nid, o));
    const reached = [...d.hub, ...Object.values(d.nodes).flatMap((x) => x.opts)].some((o) => o.go === nid);
    if (!reached) errors.push(`chat ${id}.${nid}: ningún diálogo lleva a este nodo`);
  }
}

// Relaciones y charla con respuestas variadas
let variants = 0;
const GENDERS = CREATION.genders.map((g) => g.id);
for (const id of cast) {
  const r = RELATIONS.chars[id];
  if (!r) { errors.push(`relaciones: falta "${id}"`); continue; }
  if (!['f', 'm'].includes(r.gender)) errors.push(`relaciones ${id}: género "${r.gender}"`);
  r.romance.forEach((g) => { if (!GENDERS.includes(g)) errors.push(`relaciones ${id}: género de romance "${g}"`); });
  if (r.romance.length && !r.rel.pareja?.yes) errors.push(`relaciones ${id}: puede tener pareja pero no tiene frases`);
  if (r.romance.length && !r.rel.romper?.yes) errors.push(`relaciones ${id}: falta la frase para romper`);
  if (r.family && !r.rel.familia?.yes) errors.push(`relaciones ${id}: familia elegida sin frases`);
  if (r.sibling && !r.rel.hermandad?.yes) errors.push(`relaciones ${id}: hermandad sin frases`);
  if (!r.rel.amistad?.yes) errors.push(`relaciones ${id}: falta amistad`);
  if (!r.persona) errors.push(`relaciones ${id}: falta la personalidad para la IA`);
  for (const t of RELATIONS.small) {
    const v = r.small?.[t.id];
    if (!v?.length) errors.push(`relaciones ${id}: sin respuestas para «${t.t}»`);
    else variants += v.length;
  }
  for (const [k, list] of Object.entries(r.greet || {})) if (!RELATIONS.kinds[k] || !list.length) errors.push(`relaciones ${id}: saludo "${k}"`);
  for (const [k, list] of Object.entries(r.hang || {})) if (!RELATIONS.kinds[k] || !list.every(Array.isArray)) errors.push(`relaciones ${id}: escenas "${k}"`);
}
for (const [fam, links] of Object.entries(RELATIONS.familyLinks)) {
  if (!Object.values(CREATION.origins).some((o) => o.families.some((f) => f.id === fam))) errors.push(`relaciones: familia "${fam}" no existe en la creación`);
  Object.entries(links).forEach(([id, [kind]]) => { if (!cast.has(id) || !RELATIONS.kinds[kind]) errors.push(`relaciones ${fam}: lazo con "${id}" (${kind})`); });
}

// Atlas de las Dos Ciudades
for (const p of ATLAS.places) {
  if (p.codex && !allIds.has(p.codex)) errors.push(`atlas ${p.id}: entrada de Códice "${p.codex}" no existe`);
  p.people.forEach((id) => { if (!chars.has(id)) errors.push(`atlas ${p.id}: personaje "${id}" no existe`); });
  if (!fs.existsSync(path.join(__dirname, '..', 'src', 'img', 'atlas', `${p.id}.webp`))) errors.push(`atlas ${p.id}: falta la imagen`);
  if (p.x < 0 || p.x > 100 || p.y < 0 || p.y > 100) errors.push(`atlas ${p.id}: fuera del mapa`);
}

// Historia completa: cada nodo debe poder alcanzarse desde el inicio de su capítulo
// (siguiendo «next», las opciones y los resultados de los minijuegos).
for (const ch of STORY.chapters) {
  const seen = new Set();
  const pend = [ch.start];
  while (pend.length) {
    const id = pend.pop();
    if (seen.has(id) || !ch.nodes[id]) continue;
    seen.add(id);
    const n = ch.nodes[id];
    if (n.next) pend.push(n.next);
    for (const c of n.choices || []) pend.push(c.next, ...(c.game ? [c.game.win, c.game.lose] : []));
  }
  Object.keys(ch.nodes).filter((id) => !seen.has(id)).forEach((id) => errors.push(`${ch.id}.${id}: escena inalcanzable desde "${ch.start}"`));
}
// Los finales que dependen de flags solo se alcanzan si alguna decisión activa esas flags.
const storySrc = ['story.js', 'story-expansion.js', 'alternate-fates.js'].map((n) => fs.readFileSync(path.join(__dirname, '..', 'src', 'data', n), 'utf8')).join('\n');
for (const e of [...STORY.endings, ...(STORY.endings2 || [])]) {
  for (const [, flag] of String(e.test).matchAll(/flags\.(\w+)/g)) {
    if (!FLAG_SET.has(flag) && !new RegExp(`flags:\\s*\\[[^\\]]*'${flag}'`).test(storySrc)) errors.push(`final ${e.id}: la flag "${flag}" nunca se activa`);
  }
}

// Todo el arte incluido debe estar en la lista que usan el navegador y Android.
try { require('child_process').execFileSync(process.execPath, [path.join(__dirname, 'art-manifest.js'), '--check'], { stdio: 'pipe' }); } catch { errors.push('src/data/arte.js está desactualizado: ejecuta node scripts/art-manifest.js'); }

if (errors.length) {
  console.error(`✗ ${errors.length} problema(s):\n - ${errors.join('\n - ')}`);
  process.exit(1);
}
const nodes = STORY.chapters.reduce((a, c) => a + Object.keys(c.nodes).length, 0);
console.log(`✓ Datos correctos: ${STORY.chapters.length} capítulos, ${nodes} nodos, ${STORY.endings.length + (STORY.endings2 || []).length} finales, ${allIds.size} entradas de wiki, ${Object.keys(CHAT).length} personajes con ${dlgOpts} opciones de diálogo, ${ATLAS.places.length} lugares en el Atlas y ${variants} respuestas de charla.`);
