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
  for (const f of ['creation.js', 'relations.js', 'world.js', 'arte.js', 'original-world.js']) {
    vm.runInContext(fs.readFileSync(path.join(root, 'src', 'data', f), 'utf8'), ctx, { filename: f });
  }
  return ctx.window;
}

// Escapa texto para meterlo en HTML.
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// El engranaje de latón del título, dibujado por el mismo código que el menú del juego.
function engranaje() {
  const ctx = { window: {} };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(root, 'src', 'js', 'title-fx.js'), 'utf8'), ctx, { filename: 'title-fx.js' });
  return ctx.window.TitleFX.GEAR_SVG;
}

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
  // La rama original no copia capturas antiguas de Aurelia/Nácar: no son parte de su universo.
  if (!fs.existsSync(path.join(root, 'src', 'data', 'original-world.js')) && fs.existsSync(historia)) {
    const files = fs.readdirSync(historia).filter(name => /^(?!\.)(?!README\.md$)[a-zA-Z0-9][a-zA-Z0-9._-]*\.(webp|png|jpe?g)$/i.test(name)).sort((a,b)=>a.localeCompare(b,'es',{numeric:true}));
    for (const file of files) {
      copy(path.join(historia, file), path.join(out, 'capturasjuego', file));
      const label = file.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ');
      tarjetas.push('<figure class="captura"><a href="capturasjuego/' + encodeURIComponent(file) + '" target="_blank" rel="noopener noreferrer"><img src="capturasjuego/' + encodeURIComponent(file) + '" alt="Captura histórica: ' + esc(label) + '" loading="lazy"></a><figcaption>' + esc(label) + '</figcaption></figure>');
    }
  }
  return tarjetas.join('') || '<p class="galeria-vacia">Las capturas oficiales estarán disponibles próximamente.</p>';
}

// Datos de la demo web: textos de web/demo-base.json + reparto y ciudades reales de src/data.
function demoData(w) {
  const base = JSON.parse(fs.readFileSync(path.join(root, 'web', 'demo-base.json'), 'utf8'));
  const o = w.CREATION.origins;
  const datos = {
    ...base,
    ciudades: Object.fromEntries(Object.entries(o).map(([id, c]) => [id, { label: c.label, tagline: c.tagline, distritos: c.districts, oficios: c.jobs.map((j) => j.label) }])),
    reparto: w.WIKI.personajes.map((p) => ({ id: p.id, name: p.name, alias: p.alias, origin: p.origin, role: p.role, summary: p.summary, details: p.details, quote: p.quote })),
  };
  return '// Generado por scripts/build-web.js a partir de src/data y web/demo-base.json. No editar a mano.\nwindow.DEMO = ' + JSON.stringify(datos) + ';\n';
}

// Tarjetas del reparto para la portada. El sello usa los dos colores del personaje en el juego.
function repartoHtml(personajes, ciudades) {
  const iniciales = (n) => String(n).split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  return personajes.map((p, i) => {
    const [c1, c2] = (p.colors || []).concat('#6f8db8', '#0e1524');
    return `<article class="ficha" data-tema="${esc(p.origin)}"><span class="ficha-sello" style="--c1:${esc(c1)};--c2:${esc(c2)}" aria-hidden="true">${esc(iniciales(p.name))}</span><span class="ficha-num">${String(i + 1).padStart(2, '0')}</span><p class="ficha-ciudad">${esc(ciudades[p.origin] || p.origin)} · ${esc(p.role)}</p><h3>${esc(p.name)}</h3><p class="ficha-alias">${esc(p.alias)}</p><p>${esc(p.summary)}</p><blockquote>«${esc(p.quote)}»</blockquote></article>`;
  }).join('');
}

// Galería de lugares con las ilustraciones del juego (src/img/umbral/lugares), sin tocarlas.
function lugaresHtml(sitios, ciudades) {
  return sitios.filter((l) => fs.existsSync(path.join(root, 'src', 'img', 'umbral', 'lugares', l.id + '.svg')))
    .map((l) => `<figure class="lugar" data-tema="${esc(l.city)}"><img src="lugares/${esc(l.id)}.svg" alt="" loading="lazy" width="1600" height="900"><figcaption><span>${esc(ciudades[l.city] || l.city)}</span><strong>${esc(l.name)}</strong><small>${esc(l.summary)}</small></figcaption></figure>`).join('');
}

function build() {
  const extra = loadData();
  const { WIKI, STORY, CHAT } = extra;
  const pkg = require(path.join(root, 'package.json'));
  fs.rmSync(out, { recursive: true, force: true });
  fs.mkdirSync(out, { recursive: true });

  // La web publica ilustraciones propias (web/arte-propio), el icono y, tal cual, el arte, las
  // fuentes y el efecto de la grieta del menú principal del juego, para que se vean igual.
  const personajes = WIKI.personajes;
  copy(path.join(root, 'build', 'icon.png'), path.join(out, 'icono.png'));
  for (const sub of ['lugares', 'simbolos']) {
    const dir = path.join(root, 'src', 'img', 'umbral', sub);
    for (const f of fs.readdirSync(dir).filter((n) => n.endsWith('.svg'))) copy(path.join(dir, f), path.join(out, sub, f));
  }
  const fuentes = path.join(root, 'src', 'fonts');
  for (const f of fs.readdirSync(fuentes).filter((n) => /\.(woff2|txt)$/.test(n))) copy(path.join(fuentes, f), path.join(out, 'fuentes', f));
  copy(path.join(root, 'src', 'js', 'title-fx.js'), path.join(out, 'title-fx.js'));
  const nombresCiudad = Object.fromEntries(Object.entries(extra.CREATION.origins).map(([k, c]) => [k, c.label]));
  // Los diez lugares del mapa (los del Códice que tienen ciudad).
  const sitios = WIKI.lugares.filter((l) => l.city);
  const lugares = sitios.map((l) => `<li class="lugar-${esc(l.city)}">${esc(l.name)}</li>`).join('');
  const dialogos = Object.values(CHAT).reduce((n, c) => n + Object.keys(c.nodes || {}).length, 0);

  const datos = {
    VERSION: pkg.version,
    CAPITULOS: STORY.chapters.length,
    FINALES: STORY.endings.length + (STORY.endings2 || []).length,
    PERSONAJES: personajes.length,
    LUGARES: sitios.length,
    TEMAS: dialogos,
    CAPTURAS: buildCapturas(),
    LISTA_LUGARES: lugares,
    REPARTO: repartoHtml(personajes, nombresCiudad),
    GALERIA_LUGARES: lugaresHtml(sitios, nombresCiudad),
    ANIO: new Date().getFullYear(),
    ENGRANAJE: engranaje(),
  };
  for (const f of fs.readdirSync(path.join(root, 'web'))) {
    const src = path.join(root, 'web', f);
    if (fs.statSync(src).isDirectory()) {
      if (f === 'arte-propio') for (const a of fs.readdirSync(src)) copy(path.join(src, a), path.join(out, f, a));
      continue;
    }
    if (f === 'demo-base.json' || f === 'README.md') continue;
    if (/\.(html|css|js)$/.test(f)) {
      const txt = fs.readFileSync(src, 'utf8').replace(/\{\{(\w+)\}\}/g, (m, k) => (k in datos ? datos[k] : m));
      fs.writeFileSync(path.join(out, f), txt);
    } else copy(src, path.join(out, f));
  }
  // Copia también las pistas locales cuando existan; la demo no falla si aún no se han añadido.
  const music = path.join(root, 'assets', 'music');
  if (fs.existsSync(music)) {
    for (const file of fs.readdirSync(music).filter(f => /\.(mp3|ogg|opus|m4a|wav)$/i.test(f))) {
      copy(path.join(music, file), path.join(out, 'assets', 'music', file));
    }
  }
  // Publicar los mapas mentales originales del diario de desarrollo.
  const notas = path.join(root, 'web', 'notas-desarrollo');
  if (fs.existsSync(notas)) {
    for (const file of fs.readdirSync(notas).filter(f => /^etapa-[1-7]\\.svg$/.test(f))) {
      copy(path.join(notas, file), path.join(out, 'notas-desarrollo', file));
    }
  }
  fs.writeFileSync(path.join(out, 'demo-datos.js'), demoData(extra));
  fs.writeFileSync(path.join(out, '.nojekyll'), '');
  console.log(`✓ Web lista en web-dist/ (v${pkg.version}, ${personajes.length} personajes, ${sitios.length} lugares)`);
}

build();
