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
        if (App.settings.reduceMotion) return;
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

  /** Dibuja el menú principal y sus botones. */
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
          el('h1', { class: 'home-title' }, 'GRIETAS & GEARS'),
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

  // IA opcional para el chat libre con los personajes.
  function aiSettings(set) {
    const box = el('div', { class: 'ai-settings' });
    const draw = () => {
      const a = { provider: 'off', ...(App.settings.ai || {}) };
      const P = window.AI.PROVIDERS;
      const d = P[a.provider] || P.off;
      const save = (patch) => set({ ai: { ...a, ...patch } }).then(draw);
      const status = el('small', { class: 'muted ai-status' });
      // Modelos que ya tiene Ollama: se elige uno con un clic.
      const models = el('div', { class: 'chips ai-models' });
      box.innerHTML = '';
      box.append(
        el('h3', {}, 'IA para los chats (opcional)'),
        el('p', { class: 'muted small' }, 'Con la IA activada puedes escribir lo que quieras en el Comunicador y cada personaje te responde en su papel, recordando vuestra relación. Es gratis: elige un servicio y sigue los pasos. Los diálogos escritos siguen ahí siempre.'),
        el('label', { class: 'field' }, el('span', {}, 'Servicio'),
          el('select', { class: 'input', onchange: (e) => save({ provider: e.target.value, model: '', url: '' }) },
            Object.entries(P).map(([id, p]) => el('option', { value: id, selected: id === a.provider }, p.label)))),
        a.provider !== 'off' ? el('p', { class: 'small ai-help' }, d.help) : null,
        d.key ? el('label', { class: 'field' }, el('span', {}, 'Clave (API key)'),
          el('input', { class: 'input', type: 'password', autocomplete: 'off', value: a.key || '', placeholder: 'Pega aquí tu clave', onchange: (e) => save({ key: e.target.value.trim() }) })) : null,
        a.provider === 'custom' || a.provider === 'ollama' ? el('label', { class: 'field' }, el('span', {}, 'Dirección'),
          el('input', { class: 'input', value: a.url || d.url, placeholder: 'http://localhost:1234/v1/chat/completions', onchange: (e) => save({ url: e.target.value.trim() }) })) : null,
        a.provider !== 'off' ? el('label', { class: 'field' }, el('span', {}, 'Modelo'),
          el('input', { class: 'input', value: a.model || d.model, onchange: (e) => save({ model: e.target.value.trim() }) })) : null,
        a.provider === 'ollama' ? models : null,
        a.provider !== 'off' ? el('div', { class: 'row gap' },
          a.provider === 'ollama' ? el('button', { class: 'btn small', onclick: findModels }, 'Buscar mis modelos') : null,
          el('button', { class: 'btn small', onclick: async () => {
            status.textContent = 'Probando…';
            try {
              const r = await window.AI.test();
              status.textContent = `✓ Funciona en ${r.secs.toFixed(1)} s: «${r.text}»${a.provider === 'ollama' && r.secs > 15 ? ' · La primera vez tarda más porque carga el modelo. Prueba otra vez; si sigue lento, elige un modelo más pequeño.' : ''}`;
            } catch (err) { status.textContent = `✗ ${err.message}`; }
          } }, 'Probar conexión'), status) : null);
      /** Busca modelos de IA accesibles para el usuario. */
      async function findModels() {
        status.textContent = 'Buscando…';
        try {
          const list = await window.AI.ollamaModels();
          status.textContent = list.length ? 'Elige uno (los pequeños responden antes).' : 'Ollama no tiene ningún modelo. Abre una terminal y escribe «ollama pull gemma3:4b».';
          models.replaceChildren(...list.map((m) => el('button', {
            class: `chip${m.name === (a.model || d.model) ? ' active' : ''}`,
            onclick: () => save({ model: m.name }),
          }, `${m.name} · ${m.gb.toFixed(1)} GB`)));
        } catch (err) { status.textContent = `✗ ${err.message}`; }
      }
    };
    draw();
    return box;
  }

  // Clases del <body> que dependen de los ajustes (tamaño de letra, accesibilidad, brillo…).
  function applyLook(s = App.settings) {
    const b = document.body;
    const h = document.documentElement;
    h.dataset.textSize = s.textSize || 'normal';
    h.classList.toggle('dim', (s.brightness ?? 1) !== 1);
    h.style.setProperty('--brightness', String(s.brightness ?? 1));
    b.classList.toggle('reduce-motion', Boolean(s.reduceMotion));
    b.classList.toggle('high-contrast', Boolean(s.highContrast));
    b.classList.toggle('readable-font', Boolean(s.readableFont));
    b.classList.toggle('no-minimap', s.minimap === false);
    window.World3D?.applySettings?.();
  }
  App.applyLook = applyLook;

  // Copia de seguridad: partidas y ajustes en un archivo .json (la clave de la IA no se copia).
  async function exportData() {
    const slots = {};
    for (const s of await store.listSlots()) if (!s.empty) slots[s.slot] = await store.load(s.slot);
    const settings = { ...App.settings, ai: App.settings.ai ? { ...App.settings.ai, key: '' } : undefined };
    const blob = new Blob([JSON.stringify({ game: 'grietas-and-gears', version: 1, date: new Date().toISOString(), slots, settings }, null, 2)], { type: 'application/json' });
    const a = el('a', { href: URL.createObjectURL(blob), download: `grietas-and-gears-copia-${new Date().toISOString().slice(0, 10)}.json` });
    document.body.append(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
    toast('Copia de seguridad guardada', 'good');
  }

  /** Importa una copia de seguridad seleccionada. */
  function importData(root, onBack) {
    const input = el('input', { type: 'file', accept: 'application/json,.json', style: 'display:none' });
    input.onchange = async () => {
      try {
        const data = JSON.parse(await input.files[0].text());
        if (data.game !== 'grietas-and-gears' || !data.slots) throw new Error('no es una copia del juego');
        if (!confirm('Se sustituirán las partidas de las ranuras que haya en la copia. ¿Continuar?')) return;
        for (const [slot, d] of Object.entries(data.slots)) if (['1', '2', '3'].includes(slot) && d?.player) await store.save(slot, d);
        if (data.settings) {
          const { ai, lang, ...rest } = data.settings;
          Object.assign(App.settings, rest);
          await store.setSettings(rest);
        }
        toast('Copia de seguridad cargada', 'good');
        applyLook();
        renderSettings(root, onBack);
      } catch (err) {
        toast(`No se pudo cargar: ${err.message || err}`, 'warn');
      } finally {
        input.remove();
      }
    };
    document.body.append(input);
    input.click();
  }

  // Pestaña abierta en Ajustes (se recuerda mientras el juego esté abierto).
  let settingsTab = 'general';

  /** Construye las pestañas y controles de ajustes. */
  function renderSettings(root, onBack) {
    const s = App.settings;
    root.innerHTML = '';
    const set = async (patch) => {
      Object.assign(App.settings, patch);
      Audio2.configure(App.settings);
      applyLook();
      await store.setSettings(patch);
    };
    const redraw = () => renderSettings(root, onBack);
    const row = (label, hint, control) => el('label', { class: 'switch-row' },
      el('span', {}, el('strong', {}, label), hint ? el('small', { class: 'muted' }, hint) : null), control);
    const toggle = (key, label, hint) => row(label, hint,
      el('input', { type: 'checkbox', checked: s[key] !== false && Boolean(s[key] ?? U.SETTINGS_DEFAULTS[key]), onchange: (e) => set({ [key]: e.target.checked }) }));
    const select = (key, label, hint, opts) => row(label, hint,
      el('select', { class: 'input', onchange: (e) => set({ [key]: e.target.value }) },
        opts.map(([v, l]) => el('option', { value: v, selected: String(s[key] ?? U.SETTINGS_DEFAULTS[key]) === v }, l))));
    const slider = (key, label, hint, min, max, step, fmt) => {
      const out = el('small', { class: 'muted slider-val' }, fmt(s[key] ?? U.SETTINGS_DEFAULTS[key]));
      return el('div', { class: 'switch-row' },
        el('span', {}, el('strong', {}, label), hint ? el('small', { class: 'muted' }, hint) : null),
        el('span', { class: 'slider' },
          el('input', { type: 'range', min, max, step, value: s[key] ?? U.SETTINGS_DEFAULTS[key], oninput: (e) => { out.textContent = fmt(Number(e.target.value)); set({ [key]: Number(e.target.value) }); } }),
          out));
    };
    const pct = (v) => `${Math.round(v * 100)}%`;

    const TABS = [
      ['general', 'General'], ['graficos', 'Gráficos'], ['audio', 'Audio'], ['lectura', 'Lectura'], ['juego', 'Juego'],
      ['controles', 'Controles'], ['accesibilidad', 'Accesibilidad'], ['ia', 'IA'], ['datos', 'Datos'],
      ...(U.desktop ? [['arte', 'Arte personal']] : []), ['acerca', 'Acerca de'],
    ];
    if (!TABS.some(([id]) => id === settingsTab)) settingsTab = 'general';

    const pages = {
      general: () => [
        el('h3', {}, 'Idioma · Language · Langue'),
        el('div', { class: 'chips', 'data-no-i18n': '' },
          window.I18N.LANGS.map((l) => el('button', {
            class: `chip${window.I18N.lang === l.id ? ' active' : ''}`,
            onclick: async () => {
              if (window.I18N.lang === l.id) return;
              await set({ lang: l.id });
              await window.Game?.save?.();
              location.reload();
            },
          }, l.label))),
        el('h3', {}, 'Pantalla'),
        U.desktop ? el('button', { class: 'btn small', onclick: () => window.arcane.toggleFullscreen() }, 'Pantalla completa (F11)') : null,
        toggle('confirmExit', 'Preguntar antes de salir al menú', 'Evita perder el hilo por un clic sin querer.'),
        toggle('spoilers', 'Mostrar spoilers de la segunda temporada', 'En el Códice y en las conversaciones.'),
      ],
      graficos: () => [
        el('h3', {}, 'Calidad'),
        select('quality', 'Calidad gráfica', 'Baja va fluido en ordenadores y móviles modestos; Ultra pide una buena tarjeta gráfica.',
          [['baja', 'Baja'], ['media', 'Media'], ['alta', 'Alta'], ['ultra', 'Ultra']]),
        slider('renderScale', 'Resolución del mundo 3D', 'Bájala si el mapa va a tirones.', 0.5, 1.25, 0.05, pct),
        toggle('shadows', 'Sombras', 'Sombras de edificios y personajes (no se usan en calidad Baja).'),
        toggle('postfx', 'Efectos de cámara', 'Resplandor de luces, gradación de color estilo Arcane y viñeta.'),
        toggle('paintStyle', 'Estilo pintado (Arcane)', 'El mundo 3D se ve como pintado a mano, con pinceladas y contornos de tinta. Las pinceladas se ven en calidad Alta y Ultra.'),
        toggle('particles', 'Partículas', 'Polvo dorado en Piltover y esporas de neón en Zaun.'),
        toggle('cameraSway', 'Balanceo de cámara', 'La cámara respira un poco y sigue al ratón.'),
        slider('brightness', 'Brillo', null, 0.6, 1.4, 0.05, pct),
        toggle('showFps', 'Mostrar FPS', 'Contador de fotogramas por segundo en una esquina.'),
        el('h3', {}, 'Mundo 3D'),
        row('Personajes en 3D', 'Tu personaje y los personajes de Arcane aparecen como modelos tridimensionales. Puedes usar modelos propios en ZIP, FBX o GLB.',
          el('input', { type: 'checkbox', checked: s.models3d !== false, onchange: (e) => { set({ models3d: e.target.checked }); window.World3D?.resetActors(); } })),
        toggle('staticNpcModels', 'NPC quietos y a color', 'Los personajes de Arcane con modelos 3D permanecen en su lugar y muestran las texturas originales. Tu personaje sigue moviéndose. Es la opción recomendada para modelos ZIP sin animaciones.'),
      ],
      audio: () => [
        el('h3', {}, 'Volumen'),
        slider('volume', 'Volumen general', null, 0, 1, 0.05, pct),
        slider('musicVolume', 'Música', null, 0, 1, 0.05, pct),
        slider('sfxVolume', 'Efectos de sonido', null, 0, 1, 0.05, pct),
        slider('ambienceVolume', 'Ambiente de la ciudad', null, 0, 1, 0.05, pct),
        el('h3', {}, 'Música y ambiente'),
        toggle('music', 'Música ambiental', 'Banda sonora original que se crea mientras juegas: orquesta y relojería en Piltover, ritmo industrial y neón en Zaun.'),
        toggle('ambience', 'Sonido ambiente', 'Viento, campanas y engranajes en Piltover; goteos, vapor y zumbido de neón en Zaun.'),
        row('Escuchar cada ciudad', 'Suena unos segundos y vuelve a la música de antes. Los efectos y los pasos también cambian según la ciudad.',
          el('span', { class: 'chips' },
            el('button', { class: 'chip', onclick: (e) => { e.preventDefault(); Audio2.previewCity('piltover'); } }, 'Piltover'),
            el('button', { class: 'chip', onclick: (e) => { e.preventDefault(); Audio2.previewCity('zaun'); } }, 'Zaun'))),
        toggle('muteBackground', 'Silenciar al cambiar de ventana', 'El sonido se pausa si el juego queda en segundo plano.'),
      ],
      lectura: () => [
        el('h3', {}, 'Texto'),
        select('textSpeed', 'Velocidad del texto', 'Instantáneo quita las pausas y el «escribiendo…».',
          [['lento', 'Lento'], ['normal', 'Normal'], ['rapido', 'Rápido'], ['instantaneo', 'Instantáneo']]),
        select('textSize', 'Tamaño de letra', null, [['pequeno', 'Pequeño'], ['normal', 'Normal'], ['grande', 'Grande'], ['enorme', 'Muy grande']]),
        toggle('readableFont', 'Letra más fácil de leer', 'Cambia la letra decorativa por una sencilla (ayuda con la dislexia).'),
      ],
      juego: () => [
        el('h3', {}, 'Partida'),
        select('difficulty', 'Dificultad de los minijuegos', 'Fácil te da una ventaja extra; Difícil te la quita.',
          [['facil', 'Fácil'], ['normal', 'Normal'], ['dificil', 'Difícil']]),
        toggle('objectiveArrow', 'Flecha hacia el objetivo', 'Señala en el mapa a dónde tienes que ir.'),
        toggle('minimap', 'Minimapa', 'El mapa pequeño de la esquina.'),
        toggle('names', 'Nombres siempre visibles', 'Si está apagado, solo ves el nombre de quien tienes cerca.'),
      ],
      controles: () => [
        el('h3', {}, 'Cámara'),
        slider('camSpeed', 'Velocidad de giro', 'Teclas Q y R, o dos dedos en el móvil.', 0.4, 2.5, 0.1, (v) => `×${v.toFixed(1)}`),
        toggle('invertCam', 'Invertir el giro de la cámara'),
        el('h3', {}, 'Sensaciones'),
        slider('shake', 'Sacudidas de pantalla', 'En los minijuegos.', 0, 1.5, 0.1, pct),
        U.touch ? toggle('vibration', 'Vibración', 'El móvil vibra con los golpes y los aciertos.') : null,
        el('h3', {}, 'Teclado'),
        el('p', { class: 'muted small' }, 'WASD o flechas: moverse · Mayús: correr · E: hablar o entrar · H: historia · C: comunicador · F: ficha · K: Códice · M: Atlas · Q/R: girar · +/−: zoom · Esc: pausa'),
      ],
      accesibilidad: () => [
        el('h3', {}, 'Accesibilidad'),
        toggle('reduceMotion', 'Reducir movimiento', 'Quita animaciones de la interfaz, inclinaciones 3D y balanceo de cámara.'),
        toggle('highContrast', 'Alto contraste', 'Textos y bordes más marcados.'),
        toggle('readableFont', 'Letra más fácil de leer', 'Cambia la letra decorativa por una sencilla.'),
        select('textSize', 'Tamaño de letra', null, [['pequeno', 'Pequeño'], ['normal', 'Normal'], ['grande', 'Grande'], ['enorme', 'Muy grande']]),
        slider('shake', 'Sacudidas de pantalla', null, 0, 1.5, 0.1, pct),
      ],
      ia: () => [aiSettings(set)],
      datos: () => [
        el('h3', {}, 'Copias de seguridad'),
        el('p', { class: 'muted small' }, 'Guarda tus partidas y ajustes en un archivo para pasarlos a otro ordenador o al móvil. La clave de la IA no se copia.'),
        el('div', { class: 'row gap' },
          el('button', { class: 'btn small', onclick: exportData }, 'Guardar copia'),
          el('button', { class: 'btn small', onclick: () => importData(root, onBack) }, 'Cargar copia')),
        el('h3', {}, 'Restablecer'),
        el('div', { class: 'row gap' },
          el('button', { class: 'btn ghost small', onclick: async () => {
            if (!confirm('¿Volver a los ajustes de fábrica? (El idioma y la IA se mantienen.)')) return;
            await set({ ...U.SETTINGS_DEFAULTS });
            toast('Ajustes restablecidos', 'good');
            redraw();
          } }, 'Ajustes de fábrica'),
          el('button', { class: 'btn ghost small danger', onclick: async () => {
            if (!confirm('¿Borrar TODAS las partidas guardadas? No se puede deshacer.')) return;
            for (const sl of await store.listSlots()) if (!sl.empty) await store.remove(sl.slot);
            toast('Partidas borradas', 'good');
          } }, 'Borrar todas las partidas')),
      ],
      arte: () => [artSettings(root, onBack)],
      acerca: () => [
        el('h3', {}, 'Acerca de'),
        el('p', { class: 'muted small' }, 'Juego de fans gratuito y sin ánimo de lucro: no se vende, no tiene anuncios ni compras. Todas las imágenes y datos vienen dentro del juego y la música se sintetiza en tiempo real: no necesita internet (solo el chat libre con IA, si lo activas con un servicio en línea).'),
        el('p', { class: 'muted small' }, 'Este juego se creó según la política «Legal Jibber Jabber» de Riot Games usando recursos propiedad de Riot Games. Riot Games no respalda ni patrocina este proyecto. Arcane y League of Legends son marcas de Riot Games, Inc.'),
        el('p', { class: 'muted small' }, 'Privacidad: el juego no recoge ni envía datos personales. Tus partidas y ajustes se guardan solo en tu dispositivo. Si activas la IA para los chats, lo que escribes en el comunicador (y el contexto del personaje) se envía al servicio que elijas, con tu propia clave; con Ollama no sale de tu ordenador.'),
      ],
    };

    root.append(el('div', { class: 'settings panel' },
      el('div', { class: 'row gap', style: 'justify-content:space-between' },
        el('h2', {}, 'Ajustes'), el('button', { class: 'btn ghost small', onclick: onBack }, '← Volver')),
      el('div', { class: 'settings-tabs' }, TABS.map(([id, label]) => el('button', {
        class: `tab${settingsTab === id ? ' active' : ''}`,
        onclick: () => { settingsTab = id; redraw(); },
      }, label))),
      el('div', { class: 'settings-page' }, ...pages[settingsTab]())));
  }

  // ---------- Arte personal ----------
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
      'GUÍA DE ARTE · Grietas & Gears: Piltover y Zaun',
      '======================================',
      '',
      'Pon tus archivos en estas carpetas con estos nombres. En lugares/ también vale el nombre largo',
      '(«La Última Gota.jpg», «Puente del Progreso.png») o en inglés («The Last Drop.jpg»); da igual tildes y mayúsculas.',
      'En Ajustes → Arte personal verás qué lugares tienen imagen y cuáles faltan.',
      'Formatos: imágenes .png .jpg .jpeg .webp',
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
      'modelos/      PERSONAJES 3D (.zip, .fbx, .glb) para el mapa. Se pueden dejar quietos y a color en Gráficos.',
      '              Un archivo por personaje: vi.zip, jinx.zip, caitlyn.zip, etc. ZIP con FBX + texturas o GLB.',
      '              ti y generico.glb para quien no tenga el suyo. Si falta, se usa el muñeco pintado del juego.',
      '  animaciones/ reposo.glb, andar.glb y correr.glb (Mixamo, marca «In Place»). Valen para todos los modelos de Mixamo.',
      '              Para modelos sin animar, activa Gráficos → NPC quietos y a color. No necesitas Blender.',
      '',
      'Ejemplos: personajes/jinx.png · lugares/ultima-gota.jpg · codice/hextec.png · modelos/vi.glb',
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

  /** Construye las opciones de arte personal. */
  function artSettings(root, onBack) {
    const counts = ['avatares', 'personajes', 'caras', 'lugares', 'codice'].map((d) => `${d}: ${Object.keys(window.CustomArt.files[d] || {}).length}`).join(' · ');
    const models = el('span', {});
    window.Avatars3D?.listModels().then((m) => { models.textContent = ` · modelos 3D: ${m.size}`; });
    return el('div', {},
      el('h3', {}, 'Arte personal'),
      el('p', { class: 'muted' }, 'Pon tus imágenes y modelos ZIP, FBX o GLB en la carpeta de arte. El juego los usará en lugar del arte pintado. En el archivo GUIA-DE-ARTE.txt de esa carpeta tienes todos los nombres de archivo que reconoce.'),
      el('p', { class: 'small' }, `Archivos encontrados → ${counts}`, models),
      placesReport(),
      el('div', { class: 'row gap' },
        el('button', { class: 'btn small', onclick: () => window.arcane.art.open() }, 'Abrir carpeta de arte'),
        ...['avatares', 'personajes', 'caras', 'lugares', 'codice', 'modelos'].map((d) => el('button', { class: 'btn ghost small', onclick: () => window.arcane.art.open(d) }, `${d}`)),
        el('button', { class: 'btn ghost small', onclick: async () => { await window.CustomArt.load(); window.World3D?.resetActors(); toast('Arte recargado. Algunas imágenes se verán al cambiar de pantalla.', 'good'); renderSettings(root, onBack); } }, 'Recargar arte')),
      el('p', { class: 'muted small' }, 'Todo el arte viene dentro del juego y funciona sin internet. Lo que pongas en tu carpeta de arte (también mapa/piltover y mapa/zaun para los fondos del mundo 3D) sustituye al incluido.'));
  }

  /** Inicializa el menú y carga los ajustes guardados. */
  async function init() {
    App.settings = await store.getSettings();
    window.I18N.setLang(App.settings.lang);
    applyLook();
    // Sin sonido cuando el juego queda en segundo plano (si así se ha elegido).
    document.addEventListener('visibilitychange', () => {
      if (App.settings.muteBackground === false) return;
      if (document.hidden) Audio2.suspend(); else Audio2.resume();
    });
    await window.CustomArt.load();
    window.arcane?.art?.guide(artGuide());
    Audio2.configure(App.settings);
    // El audio web solo arranca tras un gesto del usuario.
    document.addEventListener('pointerdown', () => Audio2.ensureCtx(), { once: true });
    document.addEventListener('keydown', () => Audio2.ensureCtx(), { once: true });
    App.go('home');
  }

  document.addEventListener('DOMContentLoaded', init);
})();
