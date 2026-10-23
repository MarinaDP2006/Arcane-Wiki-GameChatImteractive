// Valida los datos y recursos de Las ciudades del Umbral, después de aplicar sus overrides originales.
// Uso: npm run check
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const src = path.join(root, 'src');
const ctx = { window: {} };
vm.createContext(ctx);
const dataFiles = ['creation.js', 'relations.js', 'world.js', 'atlas.js', 'arte.js', 'original-world.js', 'guia.js'];
for (const file of dataFiles) {
  const full = path.join(src, 'data', file);
  if (!fs.existsSync(full)) throw new Error('Falta el archivo de datos: ' + file);
  vm.runInContext(fs.readFileSync(full, 'utf8'), ctx, { filename: file });
}
const { WIKI, STORY, CHAT, CREATION, WORLD, ATLAS } = ctx.window;
const errors = [];
const ensure = (ok, message) => { if (!ok) errors.push(message); };
ensure(!!WIKI && Array.isArray(WIKI.personajes), 'WIKI no define personajes originales');
ensure(!!STORY && Array.isArray(STORY.chapters) && STORY.chapters.length > 0, 'STORY no contiene capítulos');
ensure(!!WORLD && WORLD.maps && WORLD.homes && WORLD.chapterLocations && WORLD.spawns, 'Faltan datos de navegación del mundo original');
ensure(!!CREATION && CREATION.origins, 'CREATION no define los orígenes');
const chars = new Set((WIKI?.personajes || []).map(p => p.id));
const allIds = new Set((WIKI?.categories || []).flatMap(c => (WIKI[c.id] || []).map(e => e.id)));
const chapterIds = new Set((STORY?.chapters || []).map(c => c.id));
const gameIds = ['foso','tejados','aerotabla','tiro','circuito','runas','regateo','persecucion','francotiradora','chompers'];
for (const ch of STORY?.chapters || []) {
  ensure(!!ch.nodes?.[ch.start], ch.id + ': nodo inicial ausente ' + ch.start);
  for (const [id, node] of Object.entries(ch.nodes || {})) {
    if (node.next) ensure(!!ch.nodes[node.next], ch.id + '.' + id + ': next inexistente ' + node.next);
    if (!node.next && !node.choices && !node.end && !node.ending) errors.push(ch.id + '.' + id + ': escena sin salida');
    for (const choice of node.choices || []) {
      ensure(!!ch.nodes[choice.next], ch.id + '.' + id + ': elección apunta a ' + choice.next);
      if (choice.game) {
        ensure(gameIds.includes(choice.game.id), ch.id + '.' + id + ': minijuego desconocido ' + choice.game.id);
        for (const key of ['win','lose']) ensure(!!ch.nodes[choice.game[key]], ch.id + '.' + id + ': resultado de minijuego ausente ' + choice.game[key]);
      }
      for (const characterId of Object.keys(choice.fx?.aff || {})) ensure(chars.has(characterId), ch.id + '.' + id + ': afinidad desconocida ' + characterId);
    }
  }
}
for (const [route, ids] of Object.entries(STORY?.routes || {})) {
  ensure(Array.isArray(ids), 'Ruta no válida: ' + route);
  for (const id of ids || []) ensure(chapterIds.has(id), 'Ruta ' + route + ': capítulo inexistente ' + id);
}
for (const ending of [...(STORY?.endings || []), ...(STORY?.endings2 || [])]) {
  ensure(!!ending.id, 'Final sin ID');
  for (const line of ending.lines || []) if (line.s) ensure(chars.has(line.s) || ['narrador','yo','sistema'].includes(line.s), 'Final ' + ending.id + ': hablante desconocido ' + line.s);
}
const locationIds = new Set();
for (const [mapId, map] of Object.entries(WORLD?.maps || {})) {
  ensure(Array.isArray(map.locations), 'Mapa sin ubicaciones: ' + mapId);
  for (const loc of map.locations || []) {
    ensure(!locationIds.has(loc.id), 'Lugar duplicado: ' + loc.id);
    locationIds.add(loc.id);
    if (loc.codex) ensure(allIds.has(loc.codex), 'Lugar ' + loc.id + ': Códice inexistente ' + loc.codex);
    if (loc.activity?.game) ensure(gameIds.includes(loc.activity.game), 'Lugar ' + loc.id + ': minijuego desconocido ' + loc.activity.game);
    if (Array.isArray(map.size)) ensure(loc.x >= 0 && loc.y >= 0 && loc.x <= map.size[0] && loc.y <= map.size[1], 'Lugar fuera del mapa: ' + loc.id);
  }
  for (const fragment of map.fragments || []) ensure(allIds.has(fragment.codex), 'Fragmento de mapa con Códice inexistente: ' + fragment.codex);
}
for (const [id, loc] of Object.entries(WORLD?.homes || {})) {
  ensure(chars.has(id), 'Casa de personaje desconocido: ' + id);
  ensure(locationIds.has(loc), 'Casa de ' + id + ' apunta a lugar inexistente: ' + loc);
}
for (const ch of STORY?.chapters || []) {
  const value = WORLD?.chapterLocations?.[ch.id];
  const locs = value && typeof value === 'object' ? Object.values(value) : [value];
  for (const loc of locs) ensure(locationIds.has(loc), 'Capítulo ' + ch.id + ': lugar de inicio inexistente ' + loc);
}
for (const origin of Object.values(CREATION?.origins || {})) {
  for (const district of origin.districts || []) ensure(locationIds.has(WORLD?.spawns?.[district]), 'Barrio sin punto de aparición: ' + district);
  for (const family of origin.families || []) for (const id of Object.keys(family.aff || {})) ensure(chars.has(id), 'Familia ' + family.id + ': personaje desconocido ' + id);
}
for (const person of WIKI?.personajes || []) {
  for (const relation of person.relations || []) ensure(allIds.has(relation), 'Relación de Códice inexistente: ' + person.id + ' → ' + relation);
}
for (const id of STORY?.cast || []) {
  ensure(chars.has(id), 'Reparto: personaje ausente del Códice ' + id);
  ensure(!!CHAT?.[id], 'Falta diálogo para ' + id);
}
const modelIndex = JSON.parse(fs.readFileSync(path.join(src, 'models', 'index.json'), 'utf8'));
for (const id of modelIndex) ensure(fs.existsSync(path.join(src, 'models', id + '.glb')), 'Modelo listado pero inexistente: ' + id + '.glb');
const scenesCtx = { window: {} };
vm.createContext(scenesCtx);
vm.runInContext(fs.readFileSync(path.join(src, 'js', 'scenes2d.js'), 'utf8'), scenesCtx, { filename: 'scenes2d.js' });
for (const [mapId, map] of Object.entries(WORLD?.maps || {})) {
  for (const loc of map.locations || []) {
    const scene = scenesCtx.window.Scenes2D?.PLACES?.[loc.id];
    ensure(!!scene, 'Falta escena 2D para ' + loc.id);
    if (scene) ensure(fs.existsSync(path.join(src, scene[1])), 'Falta imagen de escena para ' + loc.id + ': ' + scene[1]);
  }
}
if (errors.length) {
  console.error('✗ ' + errors.length + ' problema(s):\n - ' + errors.join('\n - '));
  process.exit(1);
}
console.log('✓ Mundo original correcto: ' + STORY.chapters.length + ' capítulos, ' + locationIds.size + ' ubicaciones, ' + chars.size + ' personajes y ' + modelIndex.length + ' modelos listados.');
