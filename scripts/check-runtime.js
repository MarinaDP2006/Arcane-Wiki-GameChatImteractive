// Comprueba recursos locales y módulos de exploración antes de generar un EXE.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const src = path.join(root, 'src');
const html = fs.readFileSync(path.join(src, 'index.html'), 'utf8');
const errors = [];
/** Registra un error verificable sin interrumpir las demás comprobaciones. */
function ensure(ok, message) { if (!ok) errors.push(message); }
/** Verifica que todos los scripts locales declarados en la ventana existan y sean JavaScript válido. */
for (const m of html.matchAll(/<script\s+src="([^"]+)"\s*><\/script>/g)) {
  const url = m[1];
  if (/^https?:/.test(url)) continue;
  const file = path.resolve(src, url);
  ensure(file.startsWith(src + path.sep) && fs.existsSync(file), 'Falta el módulo: ' + url);
  if (fs.existsSync(file) && file.endsWith('.js')) {
    try { new vm.Script(fs.readFileSync(file, 'utf8'), { filename: url }); }
    catch (e) { errors.push('Error de sintaxis en ' + url + ': ' + e.message); }
  }
}
/** Carga la definición de cada ciudad sin WebGL para contrastar las ubicaciones con el mundo abierto. */
function inspect(module, globalName, expectedIds, mapId) {
  const ctx = { window: { THREE: null } };
  vm.runInNewContext(fs.readFileSync(path.join(src, 'js', module), 'utf8'), ctx);
  const engine = ctx.window[globalName];
  ensure(!!engine, globalName + ' no se exporta');
  for (const id of expectedIds) {
    ensure(Boolean(engine?.has(id)), globalName + ' no reconoce ' + id);
  }
  const world = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(src, 'data', 'world.js'), 'utf8'), world);
  const places = new Set(world.window.WORLD.maps[mapId].locations.map((p) => p.id));
  for (const id of expectedIds) ensure(places.has(id), mapId + ' no tiene acceso a ' + id);
}
inspect('zaun-interiors.js', 'ZaunInteriors', ['callejones','arbol','fabrica','ultima-gota','sumidero','invernadero'], 'zaun');
inspect('piltover-interiors.js', 'PiltoverInteriors', ['consejo','taller-jayce','hexpuertas','muelle-stillwater','puente'], 'piltover');
if (errors.length) {
  console.error('Errores de recursos:\n' + errors.map(x => ' - ' + x).join('\n'));
  process.exitCode = 1;
} else console.log('OK: scripts locales válidos y once accesos 3D definidos en sus mapas.');
