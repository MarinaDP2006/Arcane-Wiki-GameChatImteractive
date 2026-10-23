// Monta la página web del juego (carpeta web/) en web-dist/, lista para Render.
// Rellena la plantilla con los datos reales del juego (versión, capítulos, finales, personajes
// y lugares de src/data) y copia solo las imágenes que usa la web, así la página nunca se
// queda atrasada respecto al juego. Uso: npm run web  (luego abre web-dist/index.html).
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const out = path.join(root, 'web-dist');

// Carga los módulos de datos del juego en un contexto aislado y devuelve window.
function loadData() {
  const ctx = { window: {} };
  vm.createContext(ctx);
  for (const f of ['wiki.js', 'story.js', 'story-expansion.js', 'alternate-fates.js', 'chat.js', 'chat-expansion.js', 'chat-deep.js', 'atlas.js']) {
    vm.runInContext(fs.readFileSync(path.join(root, 'src', 'data', f), 'utf8'), ctx, { filename: f });
  }
  return ctx.window;
}

// Escapa texto para meterlo en HTML.
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// Copia un archivo creando las carpetas que falten.
function copy(from, to) {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
}

function buildCapturas() {
  const carpeta = path.join(root, 'web', 'capturas');
  const permitidas = [
    ['inicio', 'Pantalla de inicio'],
    ['creacion', 'Creación de personaje'],
    ['comunicador', 'Comunicador (sin conversaciones)'],
    ['mapa', 'Mapa del juego'],
    ['codice', 'Códice'],
  ];
  const tarjetas = [];
  for (const [nombre, titulo] of permitidas) {
    const archivo = ['webp', 'png', 'jpg', 'jpeg'].map(ext => nombre + '.' + ext).find(f => fs.existsSync(path.join(carpeta, f)));
    if (!archivo) continue;
    copy(path.join(carpeta, archivo), path.join(out, 'capturas', archivo));
    tarjetas.push('<figure class="captura"><a href="capturas/' + archivo + '" target="_blank" rel="noopener"><img src="capturas/' + archivo + '" alt="' + esc(titulo) + '" loading="lazy"></a><figcaption>' + esc(titulo) + '</figcaption></figure>');
  }
  // Capturas históricas aportadas por la autora, ordenadas por nombre de archivo.
  // Formato recomendado: 01-inicio.webp, 02-menu.png, etc.
  const historia = path.join(root, 'capturasjuego');
  if (fs.existsSync(historia)) {
    const files = fs.readdirSync(historia).filter(name => /^(?!\\.)(?!README\\.md$)[a-zA-Z0-9][a-zA-Z0-9._-]*\\.(webp|png|jpe?g)$/i.test(name)).sort((a,b)=>a.localeCompare(b,'es',{numeric:true}));
    for (const file of files) {
      copy(path.join(historia, file), path.join(out, 'capturasjuego', file));
      const label = file.replace(/\\.[^.]+$/, '').replace(/[-_]+/g, ' ');
      tarjetas.push('<figure class="captura"><a href="capturasjuego/' + encodeURIComponent(file) + '" target="_blank" rel="noopener noreferrer"><img src="capturasjuego/' + encodeURIComponent(file) + '" alt="Captura histórica: ' + esc(label) + '" loading="lazy"></a><figcaption>' + esc(label) + '</figcaption></figure>');
    }
  }
  return tarjetas.join('') || '<p class="galeria-vacia">Las capturas oficiales estarán disponibles próximamente.</p>';
}

function build() {
  const { WIKI, STORY, CHAT, ATLAS } = loadData();
  const pkg = require(path.join(root, 'package.json'));
  fs.rmSync(out, { recursive: true, force: true });
  fs.mkdirSync(out, { recursive: true });

  const caras = path.join(root, 'src', 'img', 'arte', 'caras');
  const personajes = WIKI.personajes.filter((p) => fs.existsSync(path.join(caras, `${p.id}.webp`)));
  personajes.forEach((p) => copy(path.join(caras, `${p.id}.webp`), path.join(out, 'arte', 'caras', `${p.id}.webp`)));
  for (const f of ['lugares/piltover.webp', 'lugares/zaun.webp', 'codice/mapa-piltover-zaun.webp', 'simbolos/piltover.png', 'simbolos/zaun.png']) {
    copy(path.join(root, 'src', 'img', 'arte', f), path.join(out, 'arte', f));
  }
  // Arte existente del juego para la cronología editorial; no se presenta como capturas históricas.
  for (const name of ['piltover.webp', 'zaun.webp', 'hexpuertas.webp', 'comuna-viktor.webp']) {
    copy(path.join(root, 'src', 'img', 'arte', 'lugares', name), path.join(out, 'arte', 'historia', name));
  }
  copy(path.join(root, 'build', 'icon.png'), path.join(out, 'icono.png'));

  const tarjetas = personajes.map((p) => `
        <li class="pj pj-${esc(p.origin)}">
          <img src="arte/caras/${esc(p.id)}.webp" alt="" width="160" height="160" loading="lazy">
          <div><h3>${esc(p.name)}</h3><p class="rol">${esc(p.role)}</p><p>${esc(p.summary)}</p></div>
        </li>`).join('');
  const lugares = ATLAS.places.map((l) => `<li class="lugar-${esc(l.city)}">${esc(l.name)}</li>`).join('');
  const dialogos = Object.values(CHAT).reduce((n, c) => n + Object.keys(c.nodes || {}).length, 0);

  const datos = {
    VERSION: pkg.version,
    CAPITULOS: STORY.chapters.length,
    FINALES: STORY.endings.length + (STORY.endings2 || []).length,
    PERSONAJES: personajes.length,
    LUGARES: ATLAS.places.length,
    TEMAS: dialogos,
    CAPTURAS: buildCapturas(),
    TARJETAS: tarjetas,
    LISTA_LUGARES: lugares,
    ANIO: new Date().getFullYear(),
  };
  for (const f of fs.readdirSync(path.join(root, 'web'))) {
    const src = path.join(root, 'web', f);
    if (fs.statSync(src).isDirectory()) continue;
    if (/\.(html|css|js)$/.test(f)) {
      const txt = fs.readFileSync(src, 'utf8').replace(/\{\{(\w+)\}\}/g, (m, k) => (k in datos ? datos[k] : m));
      fs.writeFileSync(path.join(out, f), txt);
    } else copy(src, path.join(out, f));
  }
  // Publicar los mapas mentales originales del diario de desarrollo.
  const notas = path.join(root, 'web', 'notas-desarrollo');
  if (fs.existsSync(notas)) {
    for (const file of fs.readdirSync(notas).filter(f => /^etapa-[1-7]\\.svg$/.test(f))) {
      copy(path.join(notas, file), path.join(out, 'notas-desarrollo', file));
    }
  }
  fs.writeFileSync(path.join(out, '.nojekyll'), '');
  console.log(`✓ Web lista en web-dist/ (v${pkg.version}, ${personajes.length} personajes, ${ATLAS.places.length} lugares)`);
}

build();
