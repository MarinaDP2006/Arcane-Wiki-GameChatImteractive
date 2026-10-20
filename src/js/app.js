// Menú principal del juego, ajustes y cambio de pantallas.
(function () {
  const { $, $$, el, store, toast } = U;

  const App = {
    settings: {},
    view: 'home',
    go(view) {
      App.view = view;
      $$('.view').forEach((v) => v.classList.toggle('active', v.id === `view-${view}`));
      if (view !== 'game') { Audio2.stopSpeech(); window.World?.stop(); }
      if (view === 'home') renderTitle();
      if (view === 'game') Game.mount();
      if (view === 'settings') App.renderSettings($('#view-settings'), () => App.go('home'));
    },
    renderSettings,
  };
  window.App = App;

  async function renderTitle() {
    const root = $('#view-home');
    root.innerHTML = '';
    const slots = await store.listSlots();
    const hasSave = slots.some((s) => !s.empty);
    const btn = (label, fn, cls = '') => el('button', { class: `title-btn ${cls}`, onclick: () => { Audio2.sfx.choice(); fn(); } }, label);
    root.append(el('div', { class: 'title-screen' },
      el('canvas', { class: 'title-scene', id: 'title-scene' }),
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
    // Fondo pintado animado que va alternando entre las dos ciudades.
    const ctl = Scenes.mount($('#title-scene'), 'puente', { cam: undefined });
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
      U.desktop ? el('div', {},
        el('h3', {}, 'Arte personal'),
        el('p', { class: 'muted' }, 'Pon tus propias imágenes, concept art o vídeos en la carpeta de arte (por ejemplo personajes/jinx.png, escenas/ultima-gota.jpg o video/intro-zaun.mp4) y el juego los usará en lugar del arte pintado. Hay instrucciones en el archivo LEEME.txt de esa carpeta.'),
        el('button', { class: 'btn small', onclick: () => window.arcane.art.open() }, '📁 Abrir carpeta de arte')) : null,
      el('h3', {}, 'Audio'),
      el('label', { class: 'field' }, el('span', {}, 'Volumen general'),
        el('input', { type: 'range', min: 0, max: 1, step: 0.05, value: s.volume, oninput: (e) => set({ volume: Number(e.target.value) }) })),
      toggle('music', 'Música ambiental', 'Melodías generadas en tiempo real para Zaun y Piltover.'),
      toggle('voice', 'Voces de los personajes', 'Lee los diálogos en voz alta con las voces de tu sistema.'),
      el('label', { class: 'field' }, el('span', {}, 'Velocidad de la voz'),
        el('input', { type: 'range', min: 0.6, max: 1.6, step: 0.05, value: s.voiceRate, oninput: (e) => set({ voiceRate: Number(e.target.value) }) })),
      el('button', { class: 'btn small', onclick: () => Audio2.speak('Bienvenido a Zaun. Aquí abajo, nadie viene a salvarnos.', { pitch: 1.1, rate: 1.05, gender: 'm' }) }, '🔊 Probar voz'),
      el('h3', {}, 'Lectura'),
      el('label', { class: 'field' }, el('span', {}, 'Velocidad del texto (sin voz)'),
        el('select', { class: 'input', onchange: (e) => set({ textSpeed: e.target.value }) },
          [['lento', 'Lento'], ['normal', 'Normal'], ['rapido', 'Rápido']].map(([v, l]) => el('option', { value: v, selected: s.textSpeed === v }, l)))),
      toggle('spoilers', 'Mostrar spoilers de la segunda temporada', 'En el Códice y en las conversaciones con IA.'),
      el('h3', {}, 'Conversaciones con IA'),
      el('p', { class: 'muted' }, 'Con IA, los personajes conversan libremente sin salir de su papel. Sin IA, responden con diálogos escritos y temas de conversación. Por defecto se usa Ollama, que funciona en tu propio ordenador, gratis y sin conexión.'),
      U.desktop ? aiSettings(s, set, root, onBack) : el('p', { class: 'muted' }, 'Disponible en la versión de escritorio.'),
      el('h3', {}, 'Acerca de'),
      el('p', { class: 'muted small' }, 'Proyecto de fans sin ánimo de lucro. Arcane y League of Legends son propiedad de Riot Games. Los retratos y mapas se generan en la app y la música se sintetiza en tiempo real.')));
  }

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
      Audio2.speak(res.text, window.CHAT.jinx.voice);
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
    if ((App.settings.aiProvider || 'ollama') === 'ollama') detectOllama();
    Audio2.configure(App.settings);
    // El audio web solo arranca tras un gesto del usuario.
    document.addEventListener('pointerdown', () => Audio2.ensureCtx(), { once: true });
    document.addEventListener('keydown', () => Audio2.ensureCtx(), { once: true });
    App.go('home');
  }

  document.addEventListener('DOMContentLoaded', init);
})();
