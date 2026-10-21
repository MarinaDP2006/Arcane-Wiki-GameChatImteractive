// Menú principal del juego, ajustes y cambio de pantallas.
(function () {
  const { $, $$, el, store, toast } = U;

  const App = {
    settings: {},
    view: 'home',
    go(view) {
      App.view = view;
      // Ciudad del jugador: tiñe los fondos pintados (dorado de Piltover, neón de Zaun).
      document.body.dataset.city = (view === 'game' && window.Game?.current()?.player?.origin) || 'piltover';
      $$('.view').forEach((v) => v.classList.toggle('active', v.id === `view-${view}`));
      if (view !== 'game') window.World?.stop();
      if (view === 'home') renderTitle();
      if (view === 'game') Game.mount();
      if (view === 'settings') {
        App.renderSettings($('#view-settings'), () => App.go('home'));
        backdrop3d($('#view-settings'), 'settings');
      }
    },
    renderSettings,
  };
  window.App = App;

  // Fondo 3D detrás de una pantalla (ajustes, partidas, creador).
  function backdrop3d(view, shot) {
    let host = view.querySelector(':scope > .scene3d-backdrop');
    if (!host) {
      host = el('div', { class: 'scene3d-backdrop scene3d-host' });
      view.prepend(host);
    }
    if (!window.Scene3D?.mount(host, shot)) host.remove();
    tiltAll(view);
  }
  App.backdrop3d = backdrop3d;

  // Inclinación 3D de los paneles siguiendo al ratón.
  function tiltAll(root) {
    root.querySelectorAll('.title-content, .slot').forEach((n) => {
      if (n.dataset.tilt) return;
      n.dataset.tilt = '1';
      n.classList.add('tilt3d');
      n.addEventListener('pointermove', (e) => {
        const r = n.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        n.style.transform = `perspective(1100px) rotateY(${x * 6}deg) rotateX(${-y * 5}deg) translateZ(0)`;
      });
      n.addEventListener('pointerleave', () => { n.style.transform = ''; });
    });
  }
  App.tiltAll = tiltAll;

  // Menú principal: ilustraciones de Piltover y Zaun pintadas, con fundido lento entre ellas,
  // y el menú a la izquierda sobre la sombra. Sin escena 3D de bloques.
  const TITLE_ART = [
    ['piltover', '50% 40%'], ['hexpuertas', '50% 30%'], ['zaun', '50% 45%'], ['comuna-viktor', '50% 50%'],
  ];

  async function renderTitle() {
    const root = $('#view-home');
    root.innerHTML = '';
    const slots = await store.listSlots();
    const hasSave = slots.some((s) => !s.empty);
    const btn = (label, fn, cls = '') => el('button', { class: `home-btn ${cls}`, onclick: () => { Audio2.sfx.choice(); fn(); } }, el('i', { class: 'home-gem' }), el('span', {}, label));
    const art = TITLE_ART.map(([id, pos]) => [window.CustomArt.image('lugares', id) || `img/arte/lugares/${id}.webp`, pos]);
    const slides = art.map(([src, pos], i) => el('div', { class: `home-slide${i ? '' : ' on'}`, style: `background-image:url("${src}");background-position:${pos}` }));
    root.append(el('div', { class: 'home' },
      el('div', { class: 'home-art' }, ...slides),
      el('div', { class: 'home-grain' }),
      el('div', { class: 'home-shade' }),
      el('div', { class: 'home-motes' }, ...Array.from({ length: 22 }, (_, i) => el('i', { class: i % 3 ? 'blue' : 'green', style: `left:${(i * 47) % 100}%;animation-delay:${(i * 1.7) % 12}s;animation-duration:${10 + (i % 6) * 2.5}s` }))),
      el('div', { class: 'home-panel' },
        el('div', { class: 'home-logo' },
          el('h1', { class: 'home-title' }, 'ARCANE'),
          el('div', { class: 'home-cities' },
            el('img', { src: 'img/arte/simbolos/piltover.png', alt: 'Piltover' }),
            el('span', {}, 'Piltover'), el('b', {}), el('span', {}, 'Zaun'),
            el('img', { src: 'img/arte/simbolos/zaun.png', alt: 'Zaun' }))),
        el('nav', { class: 'home-menu' },
          hasSave ? btn('Continuar', async () => { if (!(await Game.continueLatest())) toast('No hay partidas', 'warn'); }, 'primary') : null,
          btn('Nueva partida', () => Game.newGame(), hasSave ? '' : 'primary'),
          btn('Cargar partida', () => App.go('game')),
          btn('Ajustes', () => App.go('settings')),
          U.desktop ? btn('Salir', () => window.arcane.quit(), 'quiet') : null))));
    Audio2.playMusic('wiki');
    let k = 0;
    const timer = setInterval(() => {
      if (!slides[0].isConnected) return clearInterval(timer);
      slides[k].classList.remove('on');
      k = (k + 1) % slides.length;
      slides[k].classList.add('on');
    }, 9000);
  }

  function renderSettings(root, onBack) {
    const s = App.settings;
    root.innerHTML = '';
    const set = async (patch) => {
      Object.assign(App.settings, patch);
      Audio2.configure(App.settings);
      await store.setSettings(patch);
    };
    const toggle = (key, label, hint) => el('label', { class: 'switch-row' },
      el('span', {}, el('strong', {}, label), hint ? el('small', { class: 'muted' }, hint) : null),
      el('input', { type: 'checkbox', checked: Boolean(s[key]), onchange: (e) => set({ [key]: e.target.checked }) }));

    root.append(el('div', { class: 'settings panel' },
      el('div', { class: 'row gap', style: 'justify-content:space-between' },
        el('h2', {}, 'Ajustes'), el('button', { class: 'btn ghost small', onclick: onBack }, '← Volver')),
      el('h3', {}, 'Pantalla'),
      U.desktop ? el('button', { class: 'btn small', onclick: () => window.arcane.toggleFullscreen() }, 'Pantalla completa (F11)') : null,
      U.desktop ? artSettings(root, onBack) : null,
      el('h3', {}, 'Audio'),
      el('label', { class: 'field' }, el('span', {}, 'Volumen general'),
        el('input', { type: 'range', min: 0, max: 1, step: 0.05, value: s.volume, oninput: (e) => set({ volume: Number(e.target.value) }) })),
      toggle('music', 'Música ambiental', 'Melodías generadas en tiempo real para Zaun y Piltover.'),
      el('h3', {}, 'Lectura'),
      el('label', { class: 'field' }, el('span', {}, 'Velocidad del texto'),
        el('select', { class: 'input', onchange: (e) => set({ textSpeed: e.target.value }) },
          [['lento', 'Lento'], ['normal', 'Normal'], ['rapido', 'Rápido']].map(([v, l]) => el('option', { value: v, selected: s.textSpeed === v }, l)))),
      toggle('spoilers', 'Mostrar spoilers de la segunda temporada', 'En el Códice y en las conversaciones.'),
      el('h3', {}, 'Acerca de'),
      el('p', { class: 'muted small' }, 'Proyecto de fans sin ánimo de lucro. Arcane y League of Legends son propiedad de Riot Games. Las imágenes de personajes y lugares son de la Arcane Wiki (arcane.fandom.com) y la música se sintetiza en tiempo real.')));
  }

  // ---------- Arte personal ----------
  // Páginas de la Arcane Wiki (Fandom, en inglés) de cada personaje y lugar del juego.
  const FANDOM_CHARS = {
    vi: ['Vi'], jinx: ['Jinx'], caitlyn: ['Caitlyn Kiramman'], jayce: ['Jayce Talis'], viktor: ['Viktor'], mel: ['Mel Medarda'],
    heimerdinger: ['Cecil B. Heimerdinger', 'Heimerdinger'], silco: ['Silco'], vander: ['Vander'], ekko: ['Ekko'], sevika: ['Sevika'],
    ambessa: ['Ambessa Medarda'], cassandra: ['Cassandra Kiramman'], 
    isha: ['Isha'], 
  };
  const FANDOM_PLACES = {
    piltover: ['Piltover'], zaun: ['Zaun', 'The Undercity'], puente: ['Bridge of Progress', 'The Bridge of Progress'],
    'ultima-gota': ['The Last Drop', 'Last Drop'], callejones: ['The Lanes', 'Lanes'], sumidero: ['The Sump', 'Sump'],
    academia: ['Piltover Academy', 'Academy'], consejo: ['Council Chambers', 'Piltover Council', 'Council'],
    stillwater: ['Stillwater Hold', 'Stillwater'], arbol: ['Firelights Hideout', 'The Firelights', 'Firelights'],
    'taller-jayce': ["Jayce's Laboratory", "Jayce's Lab", "Jayce's Workshop"], 'mansion-kiramman': ['Kiramman Estate', 'Kiramman Manor', 'House Kiramman'],
    hexpuertas: ['Hexgates', 'Hexgate'], noxus: ['Noxus'], ejecutores: ['Enforcers', 'Piltover Enforcers'],
    fabrica: ['Shimmer Factory', 'Shimmer'], foso: ['Fight Pit', 'Fighting Pit'], 'escondite-jinx': ["Jinx's Hideout", "Jinx's Lair"],
    'tienda-benzo': ["Benzo's Shop", 'Benzo'], mercado: ['Zaun Market', 'Undercity Market'], plaza: ['Progress Day', 'Progress Plaza'],
  };

  // Personajes y lugares que aún no tienen imagen propia en la carpeta de arte.
  function fandomItems() {
    const F = window.CustomArt.files;
    const r = window.CustomArt.report;
    const lack = new Set([...r.missing, ...r.borrowed]);
    return [
      ...Object.entries(FANDOM_CHARS).filter(([id]) => !F.personajes[id]).map(([id, titles]) => ({ id, dir: 'personajes', titles, search: titles[0] })),
      ...Object.entries(FANDOM_PLACES).filter(([id]) => lack.has(id)).map(([id, titles]) => ({ id, dir: 'lugares', titles })),
    ];
  }

  // Texto de la guía con todos los nombres de archivo que el juego reconoce.
  function artGuide() {
    const W = window.WIKI;
    const line = (id, name) => `  ${id.padEnd(22)} ${name}`;
    const chapters = window.STORY.chapters;
    const endings = [...window.STORY.endings, ...(window.STORY.endings2 || [])];
    const places = Object.keys(Scenes.THEMES).map((id) => {
      const loc = Object.values(window.WORLD.maps).flatMap((m) => m.locations).find((l) => l.id === id);
      const wiki = W.lugares.find((l) => l.id === id);
      return line(id, loc?.name || wiki?.name || id);
    });
    return [
      'GUÍA DE ARTE · Arcane: Piltover y Zaun',
      '======================================',
      '',
      'Pon tus archivos en estas carpetas con estos nombres. En lugares/ también vale el nombre largo',
      '(«La Última Gota.jpg», «Puente del Progreso.png») o en inglés («The Last Drop.jpg»); da igual tildes y mayúsculas.',
      'En Ajustes → Arte personal verás qué lugares tienen imagen y cuáles faltan.',
      'Formatos: imágenes .png .jpg .jpeg .webp · vídeos .mp4 .webm',
      'Reinicia el juego después de añadir archivos.',
      '',
      'avatares/     RETRATOS PARA TU PERSONAJE (cualquier nombre de archivo). Aparecen en la galería del creador.',
      '              Mejor verticales (3:4), estilo Arcane: concept art, fan art, capturas...',
      '',
      'personajes/   CUERPO ENTERO (vertical, la cara en la parte de arriba): bustos de la historia y fichas del Códice',
      ...W.personajes.map((p) => line(p.id, p.name)),
      '',
      'caras/        CARA (cuadrada, solo la cabeza): avatares del chat, contactos y mapa. Mismos nombres que personajes/',
      '              Si solo pones el cuerpo, el juego lo usa también para la cara (y al revés).',
      '',
      'lugares/      Fondos de lugares, del menú, de la historia y de las cinemáticas (horizontales, 16:9)',
      ...places,
      '',
      'codice/       Ilustraciones del Códice (criaturas, tecnología, mundo y lugares)',
      ...['criaturas', 'tecnologia', 'mundo', 'lugares'].flatMap((c) => [`  -- ${W.categories.find((x) => x.id === c).label}`, ...W[c].map((e) => line(e.id, e.name))]),
      '',
      'video/        Cinemáticas (sustituyen a las animadas; se pueden saltar con Esc)',
      line('intro-zaun', 'Intro al empezar en Zaun'),
      line('intro-piltover', 'Intro al empezar en Piltover'),
      line('temporada-2', 'Apertura de la Temporada 2'),
      ...chapters.map((c) => line(`capitulo-${c.id}`, c.title)),
      ...endings.map((e) => line(`fin-${e.id}`, e.title)),
      '',
      'Ejemplos: personajes/jinx.png · lugares/ultima-gota.jpg · codice/hextec.png · video/intro-zaun.mp4',
    ].join('\n');
  }

  // Lista de lugares: cuáles tienen imagen, cuáles toman la de su gemelo y cuáles faltan.
  function placesReport() {
    const r = window.CustomArt.report;
    const total = Object.keys(Scenes.THEMES).length;
    const name = (id) => Object.values(window.WORLD.maps).flatMap((m) => m.locations).find((l) => l.id === id)?.name
      || window.WIKI.lugares.find((l) => l.id === id)?.name || id;
    const chip = (id, cls, title) => el('span', { class: `tag ${cls}`, title }, `${name(id)} · ${id}`);
    return el('details', { class: 'places-report', open: r.missing.length || r.unknown.length ? true : null },
      el('summary', {}, `Lugares con imagen: ${r.found.length + r.borrowed.length}/${total}${r.missing.length ? ` · faltan ${r.missing.length}` : ' · ¡completo!'}`),
      r.found.length ? el('div', { class: 'chips' }, r.found.map((id) => chip(id, 'ok', 'Tu imagen'))) : null,
      r.borrowed.length ? el('p', { class: 'muted small' }, 'Usan la imagen de su lugar gemelo (pon una propia si quieres):') : null,
      r.borrowed.length ? el('div', { class: 'chips' }, r.borrowed.map((id) => chip(id, 'warn', 'Imagen prestada'))) : null,
      r.missing.length ? el('p', { class: 'muted small' }, 'Faltan (se ve el fondo pintado del juego). Guarda la imagen con el nombre de la derecha:') : null,
      r.missing.length ? el('div', { class: 'chips' }, r.missing.map((id) => chip(id, 'bad', `lugares/${id}.jpg`))) : null,
      r.unknown.length ? el('p', { class: 'muted small' }, `No sé a qué lugar corresponden estos archivos (renómbralos con un nombre de la guía): ${r.unknown.join(', ')}`) : null);
  }

  function artSettings(root, onBack) {
    const counts = ['avatares', 'personajes', 'caras', 'lugares', 'codice', 'video'].map((d) => `${d}: ${Object.keys(window.CustomArt.files[d] || {}).length}`).join(' · ');
    const progress = el('div', { class: 'dl-progress hidden' }, el('i'), el('span'));
    return el('div', {},
      el('h3', {}, 'Arte personal'),
      el('p', { class: 'muted' }, 'Pon tus imágenes y vídeos en la carpeta de arte y el juego los usará en lugar del arte pintado. En el archivo GUIA-DE-ARTE.txt de esa carpeta tienes todos los nombres de archivo que reconoce.'),
      el('p', { class: 'small' }, `Archivos encontrados → ${counts}`),
      placesReport(),
      el('div', { class: 'row gap' },
        el('button', { class: 'btn small', onclick: () => window.arcane.art.open() }, 'Abrir carpeta de arte'),
        ...['avatares', 'personajes', 'caras', 'lugares', 'codice', 'video'].map((d) => el('button', { class: 'btn ghost small', onclick: () => window.arcane.art.open(d) }, `${d}`)),
        el('button', { class: 'btn ghost small', onclick: async () => { await window.CustomArt.load(); toast('Arte recargado. Algunas imágenes se verán al cambiar de pantalla.', 'good'); renderSettings(root, onBack); } }, 'Recargar arte')),
      el('p', { class: 'muted small' }, `Todas las imágenes de personajes salen de la Arcane Wiki (arcane.fandom.com), no de Riot. Este botón descarga la imagen principal de la página de cada personaje (cuerpo) y de cada lugar que aún te falte; las caras del chat ya vienen con el juego. Solo baja lo que no tienes, no toca tus archivos. Los retratos de Riot que bajaban las versiones anteriores se apartan a la carpeta «_riot-retirado». Ahora faltan: ${fandomItems().length}.`),
      el('button', {
        class: 'btn primary small',
        disabled: !fandomItems().length,
        onclick: async (ev) => {
          ev.target.disabled = true;
          progress.classList.remove('hidden');
          window.arcane.art.onFandom((d) => {
            progress.querySelector('i').style.width = `${Math.round((d.progress || 0) * 100)}%`;
            progress.querySelector('span').textContent = d.done ? '¡Listo!' : `Arcane Wiki: ${d.current}…`;
          });
          try {
            const r = await window.arcane.art.fandom(fandomItems());
            await window.CustomArt.load();
            toast(`Imágenes de la Arcane Wiki: ${r.done.length}${r.failed.length ? ` · sin imagen: ${r.failed.join(', ')}` : ''}`, r.done.length ? 'good' : 'warn');
          } catch (err) {
            toast(`No se pudo conectar con la Arcane Wiki: ${err.message || err}`, 'warn');
          }
          renderSettings(root, onBack);
        },
      }, 'Descargar lo que falta de la Arcane Wiki'),
      progress,
      el('h3', {}, 'Fondos del mapa 3D'),
      el('p', { class: 'muted small' }, 'El mundo abierto pone alrededor de cada ciudad las ilustraciones de su página de región en Universe de League of Legends (universe.leagueoflegends.com). Se bajan solas la primera vez que entras en cada ciudad; con estos botones las vuelves a bajar. También puedes poner tus propias imágenes en las carpetas mapa/piltover y mapa/zaun de tu carpeta de arte.'),
      el('div', { class: 'row gap' }, ...['piltover', 'zaun'].map((region) => el('button', {
        class: 'btn small',
        onclick: async (ev) => {
          ev.target.disabled = true;
          try {
            const r = await window.arcane.art.universe(region);
            window.World3D?.reloadBackdrops();
            toast(r.ok ? `${r.done} imágenes de ${region === 'zaun' ? 'Zaun' : 'Piltover'} guardadas.` : 'No encontré imágenes en la página de Universe.', r.ok ? 'good' : 'warn');
          } catch (err) {
            toast(`No se pudo conectar con Universe: ${err.message || err}`, 'warn');
          }
          ev.target.disabled = false;
        },
      }, `Bajar fondos de ${region === 'zaun' ? 'Zaun' : 'Piltover'}`))),
      el('h3', {}, 'Mapas de la Wiki en el Códice'),
      el('p', { class: 'muted small' }, 'Aparece en el Códice (tecla K) en la pestaña «Mapas de la Wiki». El Atlas ilustrado (tecla M) no necesita internet.'),
      el('label', { class: 'field' }, el('span', {}, 'Dirección del mapa interactivo de la ciudad'),
        el('input', { class: 'input', value: App.settings.mapUrl || DEFAULT_MAP, onchange: async (e) => { App.settings.mapUrl = e.target.value.trim(); await store.setSettings({ mapUrl: App.settings.mapUrl }); } })),
      el('button', { class: 'btn small', onclick: () => App.openMap() }, 'Abrir mapa interactivo'));
  }

  // Mapas interactivos de la Arcane Wiki (menú «Interactive Maps» de arcane.fandom.com).
  const DEFAULT_MAP = 'https://arcane.fandom.com/wiki/Special:AllMaps';
  App.DEFAULT_MAP = DEFAULT_MAP;
  App.mapUrl = () => App.settings.mapUrl || DEFAULT_MAP;
  App.openMap = () => {
    const url = App.mapUrl();
    if (window.arcane?.openMap) window.arcane.openMap(url);
    else window.open(url, '_blank');
  };

  // Al abrir el juego se baja sola, en segundo plano, la imagen de la Arcane Wiki de cada
  // personaje y lugar que aún falte (lo mismo que el botón de Ajustes). Sin internet no pasa nada.
  async function autoFandom() {
    if (!window.arcane?.art?.fandom || !fandomItems().length) return;
    try {
      const r = await window.arcane.art.fandom(fandomItems());
      if (r.done.length) {
        await window.CustomArt.load();
        toast(`Arte de la Arcane Wiki descargado: ${r.done.length} imágenes nuevas.`, 'good');
      }
    } catch { /* sin conexión */ }
  }

  async function init() {
    App.settings = await store.getSettings();
    await window.CustomArt.load();
    window.arcane?.art?.guide(artGuide());
    autoFandom();
    Audio2.configure(App.settings);
    // El audio web solo arranca tras un gesto del usuario.
    document.addEventListener('pointerdown', () => Audio2.ensureCtx(), { once: true });
    document.addEventListener('keydown', () => Audio2.ensureCtx(), { once: true });
    App.go('home');
  }

  document.addEventListener('DOMContentLoaded', init);
})();
