// Menú principal del juego, ajustes y cambio de pantallas.
(function () {
  const { $, $$, el, store, toast } = U;

  const App = {
    settings: {},
    view: 'home',
    go(view) {
      App.view = view;
      // Mantiene la identidad visual al moverse entre el creador, los ajustes y el juego.
      const body = document.body;
      const savedCity = body.dataset.ciudad || body.dataset.city;
      const gameCity = window.Game?.current()?.player?.origin;
      const city = view === 'game' ? (gameCity || savedCity || 'aurelia') : (savedCity || gameCity || 'aurelia');
      body.dataset.city = city;
      body.dataset.ciudad = city;
      if (App.applyLook) App.applyLook();
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
    host.remove(); // Fondos 3D desactivados para evitar errores gráficos.
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

  // Menú principal: Aurelia (cielo) y Nácar (caverna) pintadas a la vez, separadas por una grieta
  // de Resonancia que sigue al ratón o al dedo. Los efectos viven en js/title-fx.js.
  const TITLE_ART = {
    aurelia: [['aurelia', '50% 40%'], ['observatorio', '50% 40%'], ['ascensor-central', '50% 40%']],
    nacar: [['nacar', '50% 50%'], ['galerias', '50% 50%'], ['canal-cobre', '50% 50%']],
  };
  let stopTitleFx = null;

  /** Dibuja el menú principal y sus botones. */
  async function renderTitle() {
    const root = $('#view-home');
    if (stopTitleFx) stopTitleFx();
    root.innerHTML = '';
    const slots = await store.listSlots();
    const hasSave = slots.some((s) => !s.empty);
    const btn = (label, fn, cls = '') => el('button', { class: `home-btn ${cls}`, onclick: () => { Audio2.sfx.choice(); fn(); } }, el('i', { class: 'home-gem' }), el('span', {}, label));
    const layer = (side) => {
      const slides = TITLE_ART[side].map(([id, pos], i) => el('div', {
        class: `home-slide${i ? '' : ' on'}`,
        style: `background-image:url("${window.CustomArt.image('lugares', id) || `img/umbral/lugares/${id}.svg`}");background-position:${pos}`,
      }));
      // El recorte va por fuera y el parallax por dentro, para que el borde coincida con la grieta.
      return el('div', { class: `home-art ${side}` }, el('div', { class: 'home-art-in' }, ...slides));
    };
    const aurelia = layer('aurelia');
    const nacar = layer('nacar');
    // Título letra a letra; el «&» lleva detrás un engranaje que gira al mover el cursor.
    const letters = (word, from) => [...word].map((ch, i) => el('span', { class: 'home-letter', style: `--i:${from + i}` }, ch));
    const amp = el('span', { class: 'home-amp', style: '--i:5' }, el('span', { class: 'home-gear', html: window.TitleFX.GEAR_SVG }), el('b', {}, '&'));
    const city = (id, label) => el('button', { class: 'home-city', 'data-city': id, type: 'button' },
      el('img', { src: `img/umbral/simbolos/${id}.svg`, alt: '' }), el('span', {}, label));
    const s = App.settings;
    // Menú principal (Jugar, Ajustes, Créditos, Salir). «Jugar» abre las opciones de partida.
    const menu = el('nav', { class: 'home-menu' });
    const mainMenu = () => menu.replaceChildren(...[
      btn('Jugar', () => (hasSave ? playMenu() : Game.newGame()), 'primary'),
      btn('Ajustes', () => App.go('settings')),
      btn('Créditos', credits),
      U.desktop ? btn('Salir', () => window.umbral.quit(), 'quiet') : null,
    ].filter(Boolean));
    const playMenu = () => menu.replaceChildren(
      btn('Continuar', async () => { if (!(await Game.continueLatest())) toast('No hay partidas', 'warn'); }, 'primary'),
      btn('Nueva partida', () => Game.newGame()),
      btn('Cargar partida', () => App.go('game')),
      btn('Volver', mainMenu, 'quiet'));
    const credits = () => {
      const box = el('div', { class: 'home-credits panel', role: 'dialog', 'aria-label': 'Créditos' },
        el('h2', {}, 'Créditos'),
        el('p', {}, el('strong', {}, 'Rifts & Gears · Las ciudades del Umbral')),
        el('p', { class: 'muted' }, 'Idea, mundo y dirección: MarinaDP2006.'),
        el('p', { class: 'muted' }, 'Historia, personajes, ciudades, arte y música propios del proyecto. Programado con ayuda de Claude.'),
        el('p', { class: 'muted' }, 'Tecnología: Three.js, Electron y Capacitor, cada una con su licencia.'),
        el('button', { class: 'btn primary', onclick: () => box.remove() }, 'Cerrar'));
      home.append(box);
      box.querySelector('button').focus();
    };
    mainMenu();
    const home = el('div', { class: 'home' },
      aurelia, nacar,
      el('div', { class: 'home-rift', 'aria-hidden': 'true',
        html: '<svg viewBox="0 0 1000 1000" preserveAspectRatio="none"><polyline class="glow"/><path class="glow"/><polyline class="mid"/><path class="core"/><polyline class="core"/></svg>' }),
      el('canvas', { class: 'home-fx', 'aria-hidden': 'true' }),
      el('div', { class: 'home-grain' }),
      el('div', { class: 'home-shade' }),
      el('div', { class: 'home-panel' },
        el('div', { class: 'home-logo' },
          el('h1', { class: 'home-title', 'aria-label': 'Rifts & Gears' }, el('span', { class: 'home-word' }, ...letters('RIFTS', 0)), amp, el('span', { class: 'home-word' }, ...letters('GEARS', 6))),
          el('div', { class: 'home-cities' }, city('aurelia', 'Aurelia'), el('b', {}), city('nacar', 'Nácar'))),
        menu,
        el('p', { class: 'home-motto' }, 'Dos ciudades. Un mismo pacto.')),
      el('div', { class: 'home-hint' }, U.touch ? 'Desliza el dedo para abrir la grieta entre Aurelia y Nácar' : 'Mueve el ratón para abrir la grieta entre Aurelia y Nácar'));
    root.append(home);
    Audio2.playMusic('wiki');
    stopTitleFx = window.TitleFX.mount(home, { reduce: s.reduceMotion, particles: s.particles, low: s.quality === 'baja' });
    // Cada ciudad cambia de ilustración a su ritmo, desfasadas para que nunca cambien a la vez.
    [aurelia, nacar].forEach((layerEl, n) => {
      const slides = [...layerEl.firstElementChild.children];
      let k = 0;
      setTimeout(function next() {
        if (!layerEl.isConnected) return;
        slides[k].classList.remove('on');
        k = (k + 1) % slides.length;
        slides[k].classList.add('on');
        setTimeout(next, 12000);
      }, 7000 + n * 6000);
    });
  }

  // IA opcional para el chat libre con los personajes.
  function aiSettings(set) {
    const box = el('div', { class: 'ai-settings' });
    const draw = () => {
      const a = { provider: 'ollamaCloud', ...(App.settings.ai || {}) };
      const P = window.AI.PROVIDERS;
      const d = P[a.provider] || P.off;
      const save = (patch) => set({ ai: { ...a, ...patch } }).then(draw);
      const status = el('small', { class: 'muted ai-status' });
      // Modelos que ya tiene Ollama o LM Studio: se elige uno con un clic.
      const models = el('div', { class: 'chips ai-models' });
      const local = window.AI.LOCAL.has(a.provider);
      const lan = el('small', { class: 'muted ai-lan' });
      box.innerHTML = '';
      box.append(
        el('h3', {}, 'IA para los chats (opcional)'),
        el('p', { class: 'muted small' }, 'Roleplay libre en Las ciudades del Umbral: escribe como tu personaje y deja que el reparto responda y pregunte. La opción recomendada es Ollama Cloud, alojada, sin instalar modelos. El servicio necesita una clave privada en el backend y puede tener límites o costes; los diálogos escritos siguen disponibles como respaldo.'),
        el('label', { class: 'field' }, el('span', {}, 'Servicio'),
          el('select', { class: 'input', onchange: (e) => save({ provider: e.target.value, model: '', url: '' }) },
            Object.entries(P).map(([id, p]) => el('option', { value: id, selected: id === a.provider }, p.label)))),
        a.provider !== 'off' ? el('p', { class: 'small ai-help' }, d.help) : null,
        d.key ? el('label', { class: 'field' }, el('span', {}, 'Clave (API key)'),
          el('input', { class: 'input', type: 'password', autocomplete: 'off', value: a.key || '', placeholder: 'Pega aquí tu clave', onchange: (e) => save({ key: e.target.value.trim() }) })) : null,
        (local || a.provider === 'custom' || a.provider === 'ollamaCloud') ? el('label', { class: 'field' }, el('span', {}, 'Dirección'),
          el('input', { class: 'input', value: a.url || d.url, placeholder: a.provider === 'lmstudio' ? 'http://192.168.1.40:1234' : a.provider === 'koboldcpp' ? 'http://192.168.1.40:5001' : a.provider === 'ollamaCloud' ? 'https://tu-servicio.onrender.com/api/roleplay' : 'http://localhost:1234/v1/chat/completions', onchange: (e) => save({ url: e.target.value.trim() }) })) : null,
        (a.provider === 'lmstudio' || a.provider === 'koboldcpp') ? lan : null,
        a.provider !== 'off' ? el('label', { class: 'field' }, el('span', {}, 'Modelo'),
          el('input', { class: 'input', value: a.model || d.model, placeholder: a.provider === 'lmstudio' ? 'Pulsa «Buscar mis modelos»' : '', onchange: (e) => save({ model: e.target.value.trim() }) })) : null,
        local ? models : null,
        a.provider !== 'off' ? el('div', { class: 'row gap' },
          local ? el('button', { class: 'btn small', onclick: findModels }, 'Buscar mis modelos') : null,
          el('button', { class: 'btn small', onclick: async () => {
            status.textContent = 'Probando…';
            try {
              const r = await window.AI.test();
              status.textContent = `✓ Funciona en ${r.secs.toFixed(1)} s: «${r.text}»${local && r.secs > 15 ? ' · La primera vez tarda más porque carga el modelo. Prueba otra vez; si sigue lento, elige un modelo más pequeño.' : ''}`;
            } catch (err) { status.textContent = `✗ ${err.message}`; }
          } }, 'Probar conexión'), status) : null);
      // En el PC: la dirección que hay que escribir en la tablet para usar este LM Studio.
      if ((a.provider === 'lmstudio' || a.provider === 'koboldcpp') && window.umbral?.lanIps) {
        const port = a.provider === 'koboldcpp' ? 5001 : 1234;
        window.umbral.lanIps().then((ips) => {
          if (ips.length) lan.textContent = `En la tablet o el móvil escribe: ${ips.map((ip) => `http://${ip}:${port}`).join(' o ')}`;
        }).catch(() => {});
      }
      /** Busca modelos de IA accesibles para el usuario. */
      async function findModels() {
        status.textContent = 'Buscando…';
        try {
          const list = await window.AI.models();
          const empty = a.provider === 'lmstudio' ? 'LM Studio no tiene ningún modelo. Descarga uno desde su buscador (por ejemplo Gemma 3 12B).' : a.provider === 'koboldcpp' ? 'KoboldCpp no tiene ningún modelo abierto. Ciérralo, elige un .gguf en «Model» y pulsa «Launch».' : 'Ollama no tiene ningún modelo. Abre una terminal y escribe «ollama pull gemma3:4b».';
          status.textContent = list.length ? 'Elige uno (los pequeños responden antes).' : empty;
          models.replaceChildren(...list.map((m) => el('button', {
            class: `chip${m.name === (a.model || d.model) ? ' active' : ''}`,
            onclick: () => save({ model: m.name }),
          }, m.gb != null ? `${m.name} · ${m.gb.toFixed(1)} GB` : `${m.name}${m.quant ? ` · ${m.quant}` : ''}${m.loaded ? ' · cargado' : ''}`)));
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
    // Colores de la interfaz: según la ciudad en la que estás, o uno fijo elegido en Ajustes.
    h.dataset.tema = (s.uiTheme || 'ciudad') === 'ciudad' ? (b.dataset.ciudad || 'clasico') : s.uiTheme;
    window.World3D?.applySettings?.();
  }
  App.applyLook = applyLook;
  App.setCity = (city) => {
    if (city) {
      document.body.dataset.city = city;
      document.body.dataset.ciudad = city;
    }
    applyLook();
  };

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
        window.I18N.LANGS.length > 1 ? el('h3', {}, 'Idioma') : null,
        window.I18N.LANGS.length < 2 ? null : el('div', { class: 'chips', 'data-no-i18n': '' },
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
        U.desktop ? el('button', { class: 'btn small', onclick: () => window.umbral.toggleFullscreen() }, 'Pantalla completa (F11)') : null,
        toggle('confirmExit', 'Preguntar antes de salir al menú', 'Evita perder el hilo por un clic sin querer.'),
        toggle('spoilers', 'Mostrar spoilers de la Parte II', 'En el Códice y en las conversaciones.'),
      ],
      graficos: () => [
        el('h3', {}, 'Calidad'),
        select('quality', 'Calidad gráfica', 'Baja va fluido en ordenadores y móviles modestos; Ultra pide una buena tarjeta gráfica.',
          [['baja', 'Baja'], ['media', 'Media'], ['alta', 'Alta'], ['ultra', 'Ultra']]),
        toggle('shadows', 'Sombras', 'Sombras de edificios y personajes (no se usan en calidad Baja).'),
        toggle('postfx', 'Efectos de cámara', 'Resplandor de luces, gradación de color de la ciudad y viñeta.'),
        toggle('particles', 'Partículas', 'Polvo dorado en Aurelia y esporas de vapor verde en Nácar.'),
        toggle('cameraSway', 'Balanceo de cámara', 'La cámara respira un poco y sigue al ratón.'),
        slider('brightness', 'Brillo', null, 0.6, 1.4, 0.05, pct),
        toggle('showFps', 'Mostrar FPS', 'Contador de fotogramas por segundo en una esquina.'),
      ],
      audio: () => [
        el('h3', {}, 'Volumen'),
        slider('volume', 'Volumen general', null, 0, 1, 0.05, pct),
        slider('musicVolume', 'Música', null, 0, 1, 0.05, pct),
        slider('sfxVolume', 'Efectos de sonido', null, 0, 1, 0.05, pct),
        slider('ambienceVolume', 'Ambiente de la ciudad', null, 0, 1, 0.05, pct),
        el('h3', {}, 'Música y ambiente'),
        toggle('music', 'Música ambiental', 'Banda sonora propia: un tema para el inicio, otro para Aurelia y otro para Nácar.'),
        toggle('ambience', 'Sonido ambiente', 'Viento, campanas y engranajes en Aurelia; goteos, vapor y zumbido de los canales en Nácar.'),
        row('Escuchar cada ciudad', 'Suena unos segundos y vuelve a la música de antes. Los efectos y los pasos también cambian según la ciudad.',
          el('span', { class: 'chips' },
            el('button', { class: 'chip', onclick: (e) => { e.preventDefault(); Audio2.previewCity('aurelia'); } }, 'Aurelia'),
            el('button', { class: 'chip', onclick: (e) => { e.preventDefault(); Audio2.previewCity('nacar'); } }, 'Nácar'))),
        toggle('muteBackground', 'Silenciar al cambiar de ventana', 'El sonido se pausa si el juego queda en segundo plano.'),
      ],
      lectura: () => [
        el('h3', {}, 'Texto'),
        select('textSpeed', 'Velocidad del texto', 'Instantáneo quita las pausas y el «escribiendo…».',
          [['lento', 'Lento'], ['normal', 'Normal'], ['rapido', 'Rápido'], ['instantaneo', 'Instantáneo']]),
        select('textSize', 'Tamaño de letra', null, [['pequeno', 'Pequeño'], ['normal', 'Normal'], ['grande', 'Grande'], ['enorme', 'Muy grande']]),
        toggle('readableFont', 'Letra más fácil de leer', 'Cambia la letra decorativa por una sencilla (ayuda con la dislexia).'),
        el('h3', {}, 'Colores'),
        select('uiTheme', 'Colores de la interfaz', 'Según la ciudad: oro y beige en Aurelia, negro y verde en Nácar. El inicio y los ajustes van en azul neutro.',
          [['ciudad', 'Según la ciudad'], ['clasico', 'Azul neutro'], ['aurelia', 'Aurelia (oro y beige)'], ['nacar', 'Nácar (negro y verde)']]),
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
        el('p', { class: 'muted small' }, 'Clic: moverse, hablar o entrar · E: hablar o entrar · H: historia · C: comunicador · F: ficha · K: Códice · M: Atlas · Q/R: girar · +/−: zoom · Esc: pausa'),
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
        el('p', { class: 'muted small' }, 'Las ciudades del Umbral es un mundo original de Rifts & Gears: historia, personajes, lugares, arte y música propios. Es gratuito, sin anuncios ni compras. Todas las imágenes, datos y pistas de música vienen dentro del juego: no necesita internet (solo el chat libre con IA, si lo activas con un servicio en línea).'),
        el('p', { class: 'muted small' }, 'Privacidad: el juego no recoge ni envía datos personales. Tus partidas y ajustes se guardan solo en tu dispositivo. Si activas la IA para los chats, lo que escribes en el comunicador (y el contexto del personaje) se envía al servicio que elijas, con tu propia clave; con Ollama no sale de tu ordenador.'),
      ],
    };

    root.append(el('div', { class: 'settings panel' },
      el('div', { class: 'row gap', style: 'justify-content:space-between' },
        el('h2', {}, 'Ajustes'), el('button', { class: 'btn ghost small', onclick: onBack }, '← Volver')),
      // Pestañas en columna a la izquierda y la página a la derecha (en móvil, una encima de otra).
      el('div', { class: 'settings-layout' },
        el('nav', { class: 'settings-tabs' }, TABS.map(([id, label]) => el('button', {
          class: `tab${settingsTab === id ? ' active' : ''}`,
          onclick: () => { settingsTab = id; redraw(); },
        }, label))),
        el('div', { class: 'settings-page' }, ...pages[settingsTab]()))));
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
      'GUÍA DE ARTE · Rifts & Gears: Las ciudades del Umbral',
      '======================================',
      '',
      'Pon tus archivos en estas carpetas con estos nombres. En lugares/ también vale el nombre largo',
      '(«Mercado de las Tuberías.jpg», «Archivo de Frecuencias.png»); da igual tildes y mayúsculas.',
      'Formatos: imágenes .png .jpg .jpeg .webp',
      'Reinicia el juego después de añadir archivos.',
      '',
      'avatares/     RETRATOS PARA TU PERSONAJE (cualquier nombre de archivo). Aparecen en la galería del creador.',
      '              Mejor verticales (3:4): concept art o ilustraciones propias.',
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
      'modelos/      Modelos de personajes para una futura modalidad 3D; actualmente se usa el mapa 2D.',
      '              Un archivo por personaje: iria-venn.glb, darel-ossan.glb, etc. ZIP con FBX + texturas o GLB.',
      '              ti y generico.glb para quien no tenga el suyo. Si falta, se usa el muñeco pintado del juego.',
      '  animaciones/ reposo.glb, andar.glb y correr.glb (Mixamo, marca «In Place»). Valen para todos los modelos de Mixamo.',
      '              Para modelos sin animar, activa Gráficos → NPC quietos y a color. No necesitas Blender.',
      '',
      'Ejemplos: personajes/nyra-quell.png · lugares/mercado-nacar.jpg · codice/resonancia.png · modelos/edda-lume.glb',
    ].join('\n');
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
      el('div', { class: 'row gap' },
        el('button', { class: 'btn small', onclick: () => window.umbral.art.open() }, 'Abrir carpeta de arte'),
        ...['avatares', 'personajes', 'caras', 'lugares', 'codice', 'modelos'].map((d) => el('button', { class: 'btn ghost small', onclick: () => window.umbral.art.open(d) }, `${d}`)),
        el('button', { class: 'btn ghost small', onclick: async () => { await window.CustomArt.load(); window.World3D?.resetActors(); toast('Arte recargado. Algunas imágenes se verán al cambiar de pantalla.', 'good'); renderSettings(root, onBack); } }, 'Recargar arte')),
      el('p', { class: 'muted small' }, 'Todo el arte viene dentro del juego y funciona sin internet. Puedes añadir imágenes a tu carpeta de arte, separadas por Aurelia y Nácar.'));
  }

  /** Inicializa el menú y carga los ajustes guardados. */
  async function init() {
    App.settings = await store.getSettings();
    window.I18N.setLang(App.settings.lang);
    applyLook();
    // Las letras de los rótulos también se usan en los minijuegos (canvas): se cargan ya para que no salgan en Georgia.
    document.fonts?.load?.('700 20px Cinzel').catch(() => {});
    // Sin sonido cuando el juego queda en segundo plano (si así se ha elegido).
    document.addEventListener('visibilitychange', () => {
      if (App.settings.muteBackground === false) return;
      if (document.hidden) Audio2.suspend(); else Audio2.resume();
    });
    await window.CustomArt.load();
    window.umbral?.art?.guide(artGuide());
    Audio2.configure(App.settings);
    // El audio web solo arranca tras un gesto del usuario.
    document.addEventListener('pointerdown', () => Audio2.ensureCtx(), { once: true });
    document.addEventListener('keydown', () => Audio2.ensureCtx(), { once: true });
    App.go('home');
  }

  document.addEventListener('DOMContentLoaded', init);
})();
