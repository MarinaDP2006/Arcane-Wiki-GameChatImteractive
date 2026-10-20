// Valida los datos del juego: grafo de la historia, hablantes, desbloqueos y diálogos.
// Uso: npm run check
const path = require('path');
const fs = require('fs');
const vm = require('vm');

const ctx = { window: {} };
vm.createContext(ctx);
for (const f of ['wiki.js', 'creation.js', 'story.js', 'chat.js', 'world.js']) {
  vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'src', 'data', f), 'utf8'), ctx, { filename: f });
}
const { WIKI, STORY, CHAT, CREATION, WORLD } = ctx.window;
const errors = [];
const chars = new Set(WIKI.personajes.map((p) => p.id));
const allIds = new Set(WIKI.categories.flatMap((c) => WIKI[c.id].map((e) => e.id)));
const speakers = new Set([...chars, 'narrador', 'yo', 'sistema']);
const FLAG_SET = new Set(['familia_famosa']);

for (const ch of STORY.chapters) {
  for (const n of Object.values(ch.nodes)) for (const c of n.choices || []) (c.fx?.flags || []).forEach((f) => FLAG_SET.add(f));
}

for (const ch of STORY.chapters) {
  if (!ch.nodes[ch.start]) errors.push(`${ch.id}: nodo inicial "${ch.start}" no existe`);
  (ch.unlocks || []).forEach((id) => {
    if (!chars.has(id)) errors.push(`${ch.id}: desbloquea "${id}" que no está en la wiki`);
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
        Object.keys(c.fx?.aff || {}).forEach((id) => { if (!chars.has(id)) errors.push(`${where}: afinidad con "${id}" desconocido`); });
        if (c.req?.flag && !FLAG_SET.has(c.req.flag)) errors.push(`${where}: requiere flag "${c.req.flag}" que nunca se activa`);
        if (c.req?.stat && !STORY.stats[c.req.stat]) errors.push(`${where}: estadística "${c.req.stat}" desconocida`);
      }
    }
  }
}
for (const [r, ids] of Object.entries(STORY.routes)) ids.forEach((id) => { if (!STORY.chapters.find((c) => c.id === id)) errors.push(`ruta ${r}: capítulo "${id}" no existe`); });
STORY.endings.forEach((e) => e.lines.forEach((l) => { if (!speakers.has(l.s)) errors.push(`final ${e.id}: hablante "${l.s}"`); }));
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

if (errors.length) {
  console.error(`✗ ${errors.length} problema(s):\n - ${errors.join('\n - ')}`);
  process.exit(1);
}
const nodes = STORY.chapters.reduce((a, c) => a + Object.keys(c.nodes).length, 0);
console.log(`✓ Datos correctos: ${STORY.chapters.length} capítulos, ${nodes} nodos, ${STORY.endings.length} finales, ${allIds.size} entradas de wiki, ${Object.keys(CHAT).length} personajes con chat.`);
