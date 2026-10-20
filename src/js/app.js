// Menú principal del juego, ajustes y cambio de pantallas.
(function () {
  const { $, $$, el, store, toast } = U;

  const App = {
    settings: {},
    view: 'home',
    go(view) {
      App.view = view;
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

  async function renderTitle() {
    const root = $('#view-home');
    root.innerHTML = '';
    const slots = await store.listSlots();
    const hasSave = slots.some((s) => !s.empty);
    const btn = (label, fn, cls = '') => el('button', { class: `title-btn ${cls}`, onclick: () => { Audio2.sfx.choice(); fn(); } }, label);
    root.append(el('div', { class: 'title-screen' },
      el('div', { class: 'title-scene scene3d-host', id: 'title-scene' }),
      el('div', { class: 'title-hexes' }, ...Array.from({ length: 14 }, (_, i) => el('i', { style: `left:${(i * 37) % 100}%;animation-delay:${(i * 1.3) % 9}s;animation-duration:${9 + (i % 5) * 2}s` }))),
      el('div', { class: 'title-content' },
        el('p', { class: 'subtitle' }, 'Piltover · Zaun'),
        el('h1', { class: 'title-arcane' }, 'ARCANE'),
        el('p', { class: 'subtitle' }, 'Historia · Chat · Mundo abierto'),
        el('div', { class: 'title-menu' },
          hasSave ? btn('▶ Continuar', async () => { if (!(await Game.continueLatest())) toast('No hay partidas', 'warn'); }, 'primary') : null,
          btn('✦ Nueva partida', () => Game.newGame(), hasSave ? '' : 'primary'),
          btn('📂 Cargar partida', () => App.go('game')),
          btn('⚙ Ajustes', () => App.go('settings')),
          U.desktop ? btn('✕ Salir', () => window.arcane.quit()) : null),
        el('small', { class: 'muted title-foot' }, 'Proyecto de fans · Arcane y League of Legends son propiedad de Riot Games'))));
    Audio2.playMusic('wiki');
    // Fondo 3D en tiempo real; si el equipo no admite WebGL, fondo pintado 2D.
    if (window.Scene3D?.mount($('#title-scene'), 'title')) { tiltAll(root); return; }
    const cv = el('canvas', { class: 'title-scene' });
    $('#title-scene').append(cv);
    const ctl = Scenes.mount(cv, 'puente', { cam: undefined });
    const cycle = ['puente', 'piltover', 'hexpuertas', 'puente-zaun', 'zaun', 'callejones', 'arbol'];
    let k = 0;
    const timer = setInterval(() => {
      if (!$('#title-scene')) return clearInterval(timer);
      k = (k + 1) % cycle.length;
      ctl.set(cycle[k]);
    }, 8000);
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

    const keyInput = el('input', { class: 'input', type: 'password', placeholder: s.hasApiKey ? '•••••••• (guardada)' : 'sk-ant-…', autocomplete: 'off' });
    root.append(el('div', { class: 'settings panel' },
      el('div', { class: 'row gap', style: 'justify-content:space-between' },
        el('h2', {}, 'Ajustes'), el('button', { class: 'btn ghost small', onclick: onBack }, '← Volver')),
      el('h3', {}, 'Pantalla'),
      U.desktop ? el('button', { class: 'btn small', onclick: () => window.arcane.toggleFullscreen() }, '⛶ Pantalla completa (F11)') : null,
      U.desktop ? artSettings(root, onBack) : null,
      el('h3', {}, 'Audio'),
      el('label', { class: 'field' }, el('span', {}, 'Volumen general'),
        el('input', { type: 'range', min: 0, max: 1, step: 0.05, value: s.volume, oninput: (e) => set({ volume: Number(e.target.value) }) })),
      toggle('music', 'Música ambiental', 'Melodías generadas en tiempo real para Zaun y Piltover.'),
      el('h3', {}, 'Lectura'),
      el('label', { class: 'field' }, el('span', {}, 'Velocidad del texto'),
        el('select', { class: 'input', onchange: (e) => set({ textSpeed: e.target.value }) },
          [['lento', 'Lento'], ['normal', 'Normal'], ['rapido', 'Rápido']].map(([v, l]) => el('option', { value: v, selected: s.textSpeed === v }, l)))),
      toggle('spoilers', 'Mostrar spoilers de la segunda temporada', 'En el Códice y en las conversaciones con IA.'),
      el('h3', {}, 'Conversaciones con IA'),
      el('p', { class: 'muted' }, 'Con IA, los personajes conversan libremente sin salir de su papel. Sin IA, responden con diálogos escritos y temas de conversación. Por defecto se usa Ollama, que funciona en tu propio ordenador, gratis y sin conexión.'),
      U.desktop ? aiSettings(s, set, root, onBack) : el('p', { class: 'muted' }, 'Disponible en la versión de escritorio.'),
      el('h3', {}, 'Acerca de'),
      el('p', { class: 'muted small' }, 'Proyecto de fans sin ánimo de lucro. Arcane y League of Legends son propiedad de Riot Games. Los retratos y mapas se generan en la app y la música se sintetiza en tiempo real.')));
  }

  // ---------- Arte personal ----------
  // Personajes de League of Legends en Data Dragon (id del juego -> id de campeón).
  const LOL_CHAMPS = { vi: 'Vi', jinx: 'Jinx', caitlyn: 'Caitlyn', jayce: 'Jayce', viktor: 'Viktor', heimerdinger: 'Heimerdinger', ekko: 'Ekko', singed: 'Singed', ambessa: 'Ambessa', mel: 'Mel', warwick: 'Warwick' };

  // Páginas de la Arcane Wiki (Fandom, en inglés) de cada personaje y lugar del juego.
  const FANDOM_CHARS = {
    vi: ['Vi'], jinx: ['Jinx'], caitlyn: ['Caitlyn Kiramman'], jayce: ['Jayce Talis'], viktor: ['Viktor'], mel: ['Mel Medarda'],
    heimerdinger: ['Cecil B. Heimerdinger', 'Heimerdinger'], silco: ['Silco'], vander: ['Vander'], ekko: ['Ekko'], sevika: ['Sevika'],
    singed: ['Singed'], ambessa: ['Ambessa Medarda'], marcus: ['Marcus'], cassandra: ['Cassandra Kiramman'], mylo: ['Mylo'],
    claggor: ['Claggor'], benzo: ['Benzo'], scar: ['Scar'], isha: ['Isha'], sky: ['Sky Young'], loris: ['Loris'],
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
      el('summary', {}, `🏙 Lugares con imagen: ${r.found.length + r.borrowed.length}/${total}${r.missing.length ? ` · faltan ${r.missing.length}` : ' · ¡completo!'}`),
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
      el('h3', {}, '🖼 Arte personal'),
      el('p', { class: 'muted' }, 'Pon tus imágenes y vídeos en la carpeta de arte y el juego los usará en lugar del arte pintado. En el archivo GUIA-DE-ARTE.txt de esa carpeta tienes todos los nombres de archivo que reconoce.'),
      el('p', { class: 'small' }, `Archivos encontrados → ${counts}`),
      placesReport(),
      el('div', { class: 'row gap' },
        el('button', { class: 'btn small', onclick: () => window.arcane.art.open() }, '📁 Abrir carpeta de arte'),
        ...['avatares', 'personajes', 'caras', 'lugares', 'codice', 'video'].map((d) => el('button', { class: 'btn ghost small', onclick: () => window.arcane.art.open(d) }, `📂 ${d}`)),
        el('button', { class: 'btn ghost small', onclick: async () => { await window.CustomArt.load(); toast('Arte recargado. Algunas imágenes se verán al cambiar de pantalla.', 'good'); renderSettings(root, onBack); } }, '🔄 Recargar arte')),
      el('p', { class: 'muted small' }, 'Retratos oficiales (cara y cuerpo): el juego puede descargar a tu carpeta las ilustraciones de los campeones de League of Legends que aparecen en Arcane (Jinx, Vi, Caitlyn, Jayce, Viktor, Ekko, Heimerdinger, Singed, Ambessa, Mel y Warwick) desde Data Dragon, el servidor público de Riot. Si el campeón tiene apariencia de Arcane, se usa esa. Se guardan solo en tu ordenador, para uso personal.'),
      el('button', {
        class: 'btn primary small',
        onclick: async (ev) => {
          ev.target.disabled = true;
          progress.classList.remove('hidden');
          window.arcane.art.onDdragon((d) => {
            progress.querySelector('i').style.width = `${Math.round((d.progress || 0) * 100)}%`;
            progress.querySelector('span').textContent = d.done ? '¡Listo!' : `Descargando ${d.current}…`;
          });
          try {
            const r = await window.arcane.art.ddragon(LOL_CHAMPS);
            await window.CustomArt.load();
            toast(`Retratos descargados: ${r.done.length}${r.failed.length ? ` · no disponibles: ${r.failed.join(', ')}` : ''}`, 'good');
          } catch (err) {
            toast(`No se pudieron descargar: ${err.message || err}`, 'warn');
          }
          renderSettings(root, onBack);
        },
      }, '⬇ Descargar retratos oficiales (Data Dragon)'),
      el('p', { class: 'muted small' }, `Arcane Wiki (Fandom): descarga la imagen principal de la página de cada personaje (cuerpo y cara) y de cada lugar que aún te falte. Solo baja lo que no tienes, no toca tus archivos. Ahora faltan: ${fandomItems().length}.`),
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
      }, '⬇ Descargar lo que falta de la Arcane Wiki'),
      progress,
      el('h3', {}, '🗺 Mapa del Códice'),
      el('p', { class: 'muted small' }, 'Aparece en el Códice (tecla K, o M para ir directo) en la pestaña «Mapa». Por defecto es el mapa de la Arcane Wiki; también puedes elegir neta.art o poner otra dirección.'),
      el('label', { class: 'field' }, el('span', {}, 'Otro mapa (opcional, dirección https)'),
        el('input', { class: 'input', placeholder: 'https://…', value: App.settings.mapUrl || '', onchange: async (e) => { App.settings.mapUrl = e.target.value.trim(); if (App.settings.mapUrl) App.settings.mapSource = 'otro'; await store.setSettings({ mapUrl: App.settings.mapUrl, mapSource: App.settings.mapSource }); } })),
      el('button', { class: 'btn small', onclick: () => App.openMap() }, '🗺 Abrir mapa en una ventana'));
  }

  // Mapas que se pueden ver en el Códice.
  App.MAPS = {
    fandom: { label: 'Arcane Wiki', url: 'https://arcane.fandom.com/wiki/Special:AllMaps' },
    neta: { label: 'neta.art', url: 'https://neta.art/w/b2a0b258-f552-4a6d-9392-e1ff1557f298' },
  };
  App.mapSources = () => ({ ...App.MAPS, ...(App.settings.mapUrl ? { otro: { label: 'Mi mapa', url: App.settings.mapUrl } } : {}) });
  App.mapUrl = () => {
    const all = App.mapSources();
    return (all[App.settings.mapSource] || all.fandom).url;
  };
  App.openMap = () => {
    const url = App.mapUrl();
    if (window.arcane?.openMap) window.arcane.openMap(url);
    else window.open(url, '_blank');
  };

  // Ajustes de IA: Ollama (local) o Claude (clave de API).
  function aiSettings(s, set, root, onBack) {
    const provider = s.aiProvider || 'ollama';
    const box = el('div', {},
      toggle2('aiEnabled', 'Activar chat con IA', s, set),
      el('label', { class: 'field' }, el('span', {}, 'Motor de IA'),
        el('div', { class: 'seg' },
          el('button', { class: provider === 'ollama' ? 'active' : '', onclick: async () => { await set({ aiProvider: 'ollama' }); await detectOllama(); renderSettings(root, onBack); } }, '🦙 Ollama (local)'),
          el('button', { class: provider === 'claude' ? 'active' : '', onclick: async () => { await set({ aiProvider: 'claude' }); renderSettings(root, onBack); } }, '✨ Claude (API)'))));

    if (provider === 'ollama') {
      const o = App.ollama || {};
      const urlInput = el('input', { class: 'input', value: s.ollamaUrl || 'http://127.0.0.1:11434', placeholder: 'http://127.0.0.1:11434' });
      const status = o.ok
        ? el('p', { class: 'ai-status ok' }, `✅ Ollama conectado · ${o.models.length} modelo(s) de chat instalado(s)${o.chosen ? ` · usando «${o.chosen}»` : ''}`)
        : el('p', { class: 'ai-status ko' }, `⚠️ ${o.error || 'Aún no se ha comprobado Ollama.'}`);
      box.append(
        status,
        o.ok && o.models.length ? el('label', { class: 'field' }, el('span', {}, 'Modelo de chat instalado en tu PC'),
          el('select', { class: 'input', onchange: async (e) => { await set({ ollamaModel: e.target.value }); App.ollama.chosen = e.target.value; renderSettings(root, onBack); } },
            o.models.map((m) => el('option', { value: m.name, selected: m.name === o.chosen }, `${m.name}${m.params ? ` · ${m.params}` : ''}${m.size ? ` · ${(m.size / 1e9).toFixed(1)} GB` : ''}`)))) : null,
        o.ok && !o.models.length ? el('p', { class: 'muted' }, 'Ollama está abierto pero no tiene modelos de chat. Abre una terminal y escribe, por ejemplo: ollama pull llama3.2') : null,
        el('label', { class: 'field' }, el('span', {}, 'Dirección de Ollama'), urlInput),
        el('div', { class: 'row gap' },
          el('button', { class: 'btn primary small', onclick: async () => { await set({ ollamaUrl: urlInput.value.trim() }); await detectOllama(); renderSettings(root, onBack); toast(App.ollama.ok ? 'Ollama detectado' : 'No se encuentra Ollama', App.ollama.ok ? 'good' : 'warn'); } }, '🔍 Detectar modelos instalados'),
          o.ok && o.chosen ? el('button', { class: 'btn small', onclick: testAI }, '💬 Probar conversación') : null),
        !o.ok ? el('p', { class: 'muted small' }, '¿No tienes Ollama? Descárgalo gratis en https://ollama.com, ábrelo, instala un modelo (por ejemplo «ollama pull llama3.2») y pulsa «Detectar modelos».') : null);
    } else {
      const keyInput = el('input', { class: 'input', type: 'password', placeholder: s.hasApiKey ? '•••••••• (guardada)' : 'sk-ant-…', autocomplete: 'off' });
      box.append(
        el('label', { class: 'field' }, el('span', {}, 'Clave de API de Anthropic'), keyInput),
        el('label', { class: 'field' }, el('span', {}, 'Modelo'),
          el('select', { class: 'input', onchange: (e) => set({ aiModel: e.target.value }) },
            [['claude-opus-5-5', 'Claude Opus 5.5 (recomendado)'], ['claude-sonnet-5-5', 'Claude Sonnet 5.5 (más económico)'], ['claude-haiku-5-5', 'Claude Haiku 5.5 (el más rápido)']]
              .map(([v, l]) => el('option', { value: v, selected: s.aiModel === v }, l)))),
        el('div', { class: 'row gap' },
          el('button', { class: 'btn primary small', onclick: async () => {
            const v = keyInput.value.trim();
            if (!v) return toast('Escribe una clave primero', 'warn');
            await store.setSettings({ apiKey: v });
            App.settings.hasApiKey = true;
            toast('Clave guardada', 'good');
            renderSettings(root, onBack);
          } }, 'Guardar clave'),
          s.hasApiKey ? el('button', { class: 'btn ghost small', onclick: async () => {
            await store.setSettings({ apiKey: '' });
            App.settings.hasApiKey = false;
            toast('Clave eliminada');
            renderSettings(root, onBack);
          } }, 'Borrar clave') : null,
          s.hasApiKey ? el('button', { class: 'btn small', onclick: testAI }, '💬 Probar conversación') : null));
    }
    return box;
  }

  function toggle2(key, label, s, set) {
    return el('label', { class: 'switch-row' }, el('span', {}, el('strong', {}, label)),
      el('input', { type: 'checkbox', checked: Boolean(s[key]), onchange: (e) => set({ [key]: e.target.checked }) }));
  }

  async function testAI() {
    toast('Preguntando a Jinx…');
    const res = await window.arcane.ai.chat({
      system: 'Eres Jinx, de la serie Arcane. Responde en español, en una sola frase divertida y sin salir del personaje.',
      messages: [{ role: 'user', content: '¡Hola! ¿Qué estás construyendo hoy?' }],
    });
    if (res.ok) {
      toast(`Jinx: «${res.text.slice(0, 160)}»`, 'good');
    } else toast(res.error, 'warn');
  }

  // Detecta Ollama y los modelos de chat instalados en este ordenador.
  async function detectOllama() {
    if (!window.arcane?.ai?.ollamaModels) return;
    App.ollama = await window.arcane.ai.ollamaModels(App.settings.ollamaUrl);
    if (App.ollama.ok && App.ollama.chosen && App.settings.ollamaModel !== App.ollama.chosen) {
      App.settings.ollamaModel = App.ollama.chosen;
      await store.setSettings({ ollamaModel: App.ollama.chosen });
    }
  }

  // ¿Está lista la IA para conversar?
  App.aiReady = () => {
    const s = App.settings;
    if (!s.aiEnabled || !U.desktop) return false;
    if ((s.aiProvider || 'ollama') === 'claude') return Boolean(s.hasApiKey);
    return Boolean(App.ollama?.ok && App.ollama.chosen);
  };
  App.aiLabel = () => ((App.settings.aiProvider || 'ollama') === 'claude' ? 'Claude' : `Ollama · ${App.ollama?.chosen || ''}`);

  async function init() {
    App.settings = await store.getSettings();
    await window.CustomArt.load();
    window.arcane?.art?.guide(artGuide());
    if ((App.settings.aiProvider || 'ollama') === 'ollama') detectOllama();
    Audio2.configure(App.settings);
    // El audio web solo arranca tras un gesto del usuario.
    document.addEventListener('pointerdown', () => Audio2.ensureCtx(), { once: true });
    document.addEventListener('keydown', () => Audio2.ensureCtx(), { once: true });
    App.go('home');
  }

  document.addEventListener('DOMContentLoaded', init);
})();
