// Utilidades compartidas: DOM, plantillas de texto y almacenamiento.
(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  function el(tag, attrs = {}, ...children) {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (v == null || v === false) continue;
      if (k === 'class') node.className = v;
      else if (k === 'html') node.innerHTML = v;
      else if (k.startsWith('on')) node.addEventListener(k.slice(2), v);
      else node.setAttribute(k, v === true ? '' : v);
    }
    for (const c of children.flat()) {
      if (c == null || c === false) continue;
      node.append(c instanceof Node ? c : document.createTextNode(String(c)));
    }
    return node;
  }

  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // Índice de género: 0 masculino, 1 femenino, 2 neutro.
  function genderIndex(player) {
    const g = window.CREATION.genders.find((x) => x.id === player?.gender);
    return g ? g.g : 2;
  }

  // Sustituye {name}, {job}, {district}, {family}, {hobby} y {g:a|b|c}.
  function genderize(text, gi) {
    return text.replace(/\{g:([^}]*)\}/g, (_, alts) => {
      const parts = alts.split('|');
      return parts[gi] ?? parts[parts.length - 1] ?? '';
    });
  }

  function tpl(text, player) {
    if (!text) return '';
    const t = window.I18N?.t || ((x) => x);
    const gi = genderIndex(player);
    const out = genderize(t(text), gi);
    if (!player) return out;
    const vars = {
      name: player.name || t('forastero'),
      job: player.jobLabel ? genderize(t(player.jobLabel), gi) : '',
      district: t(player.district || ''),
      family: t(player.familyName || ''),
      hobby: t((player.hobbyLabels || [])[0] || '').replace(/^\p{Lu}(?=\p{Ll})/u, (c) => c.toLowerCase()),
    };
    return out.replace(/\{(name|job|district|family|hobby)\}/g, (_, k) => vars[k]);
  }

  // Almacenamiento: usa el proceso principal en escritorio y localStorage en navegador.
  const LS = {
    get(k, d) {
      try {
        const v = localStorage.getItem(k);
        return v == null ? d : JSON.parse(v);
      } catch {
        return d;
      }
    },
    set(k, v) {
      try {
        localStorage.setItem(k, JSON.stringify(v));
      } catch {
        /* sin almacenamiento disponible */
      }
    },
    del(k) {
      try {
        localStorage.removeItem(k);
      } catch {
        /* nada */
      }
    },
  };

  // Valores de fábrica de todos los ajustes (Ajustes → Datos → Restablecer).
  const SETTINGS_DEFAULTS = {
    volume: 0.6, music: true, musicVolume: 1, sfxVolume: 1, ambience: true, ambienceVolume: 1, muteBackground: true,
    textSpeed: 'normal', textSize: 'normal', spoilers: false,
    quality: 'alta', renderScale: 1, shadows: true, postfx: true, paintStyle: true, particles: true, cameraSway: true, models3d: true, staticNpcModels: true, brightness: 1, showFps: false,
    difficulty: 'normal', objectiveArrow: true, minimap: true, names: false, confirmExit: true,
    camSpeed: 1, invertCam: false, vibration: true, shake: 1,
    reduceMotion: false, highContrast: false, readableFont: false,
    autoBackup: true,
  };
  const desktop = window.arcane?.isDesktop;
  // Pantalla táctil (móvil o tableta, o la app de Android).
  const touch = Boolean(window.matchMedia?.('(pointer: coarse)').matches);
  // App de Android (Capacitor) con los plugins para escribir y compartir archivos.
  const native = () => {
    const cap = window.Capacitor;
    const { Filesystem, Share } = cap?.Plugins || {};
    return cap?.isNativePlatform?.() && Filesystem ? { Filesystem, Share } : null;
  };
  // Carpeta visible en la tableta: Documentos/Grietas & Gears (sobrevive si se desinstala el juego).
  const ANDROID_DIR = 'Grietas & Gears';

  /** Guarda un archivo de texto: diálogo en Windows, menú Compartir en Android, descarga en navegador. */
  async function saveFile(name, text) {
    if (window.arcane?.saveFile) return window.arcane.saveFile(name, text);
    const n = native();
    if (n?.Share) {
      const { uri } = await n.Filesystem.writeFile({ path: name, data: text, directory: 'CACHE', encoding: 'utf8' });
      // Drive, correo, «Guardar en Archivos», Quick Share...
      await n.Share.share({ title: name, files: [uri], dialogTitle: 'Guardar o enviar' }).catch(() => {});
      return true;
    }
    const a = el('a', { href: URL.createObjectURL(new Blob([text], { type: 'application/json' })), download: name });
    document.body.append(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
    return true;
  }

  // Copia automática en Android: como mucho cada pocos segundos tras guardar, se deja una copia
  // completa del día en Documentos/Grietas & Gears/Copias automáticas (en Windows lo hace main.js).
  let autoTimer = null;
  async function writeAutoBackup() {
    autoTimer = null;
    const n = native();
    if (!n) return;
    const settings = LS.get('arcane-settings', {});
    if (settings.autoBackup === false) return;
    const slots = {};
    for (const slot of ['1', '2', '3']) { const d = LS.get(`arcane-slot-${slot}`, null); if (d) slots[slot] = d; }
    if (!Object.keys(slots).length) return;
    const { ai, ...rest } = settings;
    const text = JSON.stringify({ game: 'grietas-and-gears', version: 1, auto: true, date: new Date().toISOString(), slots, settings: rest });
    const dir = `${ANDROID_DIR}/Copias automáticas`;
    const day = new Date().toISOString().slice(0, 10);
    // Tras reinstalar, Android no deja tocar los archivos de la instalación anterior: se usa otro nombre.
    for (const name of [`copia-automatica-${day}.json`, `copia-automatica-${day}-b.json`]) {
      try {
        await n.Filesystem.writeFile({ path: `${dir}/${name}`, data: text, directory: 'DOCUMENTS', encoding: 'utf8', recursive: true });
        break;
      } catch (err) {
        console.warn('Copia automática:', err);
      }
    }
    try {
      const { files } = await n.Filesystem.readdir({ path: dir, directory: 'DOCUMENTS' });
      const old = files.map((f) => f.name || f).filter((f) => /^copia-automatica-\d{4}-\d{2}-\d{2}(-b)?\.json$/.test(f)).sort().slice(0, -10);
      for (const f of old) await n.Filesystem.deleteFile({ path: `${dir}/${f}`, directory: 'DOCUMENTS' }).catch(() => {});
    } catch {
      /* sin carpeta todavía */
    }
  }
  const scheduleAutoBackup = () => { if (!autoTimer && native()) autoTimer = setTimeout(writeAutoBackup, 5000); };
  // Si la app pasa a segundo plano, la copia pendiente se escribe ya.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && autoTimer) { clearTimeout(autoTimer); writeAutoBackup(); }
  });

  const store = {
    async listSlots() {
      if (desktop) return window.arcane.saves.list();
      return ['1', '2', '3'].map((slot) => {
        const d = LS.get(`arcane-slot-${slot}`, null);
        return { slot, empty: !d, name: d?.player?.name, origin: d?.player?.origin, chapter: d?.progress?.chapterTitle, savedAt: d?.savedAt, playTimeSeconds: d?.playTimeSeconds || 0 };
      });
    },
    async load(slot) {
      return desktop ? window.arcane.saves.load(slot) : LS.get(`arcane-slot-${slot}`, null);
    },
    async save(slot, data) {
      if (desktop) return window.arcane.saves.write(slot, data);
      LS.set(`arcane-slot-${slot}`, { ...data, savedAt: new Date().toISOString() });
      scheduleAutoBackup();
      return true;
    },
    async remove(slot) {
      if (desktop) return window.arcane.saves.remove(slot);
      LS.del(`arcane-slot-${slot}`);
      return true;
    },
    async getSettings() {
      const base = { ...SETTINGS_DEFAULTS };
      if (desktop) return { ...base, ...(await window.arcane.settings.get()) };
      return { ...base, ...LS.get('arcane-settings', {}) };
    },
    async setSettings(patch) {
      if (desktop) return window.arcane.settings.set(patch);
      LS.set('arcane-settings', { ...LS.get('arcane-settings', {}), ...patch });
      return true;
    },
  };

  function toast(msg, kind = 'info') {
    const t = el('div', { class: `toast toast-${kind}` }, msg);
    document.body.append(t);
    requestAnimationFrame(() => t.classList.add('show'));
    setTimeout(() => {
      t.classList.remove('show');
      setTimeout(() => t.remove(), 400);
    }, 2800);
  }

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const norm = (s) => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

  // Nombre de archivo -> clave: sin tildes, minúsculas, guiones y sin artículo inicial.
  const slug = (s) => norm(s).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').replace(/^(la|el|los|las|the)-/, '');

  // Nombres alternativos (también en inglés) con los que se reconoce cada lugar.
  const PLACE_ALIASES = {
    'ultima-gota': ['last-drop', 'bar-ultima-gota', 'bar-de-vander'],
    callejones: ['lanes', 'zaun-callejones'],
    sumidero: ['sump', 'laboratorio-sumidero', 'laboratorio-de-singed', 'lab-singed'],
    academia: ['academy', 'piltover-academy'],
    zaun: ['undercity', 'ciudad-subterranea'],
    'taller-jayce': ['jaycetaller'],
    consejo: ['council', 'council-chamber', 'sala-consejo'],
    hexpuertas: ['hexgates', 'hexgate', 'hexpuerta'],
    puente: ['bridge', 'bridge-of-progress', 'puente-progreso'],
    arbol: ['firelights', 'firelight', 'arbol-luciernagas', 'luciernagas', 'firelight-tree'],
    'escondite-jinx': ['jinx-hideout', 'guarida-jinx', 'guarida-de-jinx'],
    fabrica: ['shimmer-factory', 'fabrica-brillo', 'fabrica-de-shimmer'],
    ejecutores: ['enforcers', 'jefatura', 'comisaria'],
    'mansion-kiramman': ['kiramman', 'kiramman-mansion', 'casa-kiramman'],
    'taller-jayce': ['jayce-workshop', 'taller', 'laboratorio-jayce'],
    stillwater: ['prision-stillwater', 'stillwater-prison', 'prision'],
    'muelle-stillwater': ['muelle', 'stillwater-dock', 'muelles'],
    mercado: ['mercado-tuberias', 'mercado-zaun', 'zaun-market'],
    artesanos: ['mercado-artesanos', 'artisans', 'artisan-market'],
    plaza: ['plaza-progreso', 'plaza-del-progreso', 'progress-plaza'],
    'tienda-benzo': ['benzo', 'tienda-de-benzo', 'benzo-shop'],
    tejados: ['rooftops', 'tejados-chimeneas', 'chimeneas'],
    foso: ['pit', 'fight-pit', 'foso-peleas', 'foso-de-peleas'],
  };
  // Si falta un lugar, usa la imagen de su gemelo antes que el fondo pintado.
  const PLACE_FALLBACK = { callejones: 'zaun', sumidero: 'zaun', mercado: 'zaun', fabrica: 'zaun', 'puente-zaun': 'puente', puente: 'puente-zaun', 'muelle-stillwater': 'stillwater', stillwater: 'muelle-stillwater', plaza: 'piltover', piltover: 'plaza', zaun: 'mercado' };

  // Asigna los archivos de lugares/ a los ids del juego aunque el nombre no sea exacto.
  function matchPlaces(raw) {
    const ids = Object.keys(window.Scenes?.THEMES || {});
    const names = {};
    for (const m of Object.values(window.WORLD?.maps || {})) for (const l of m.locations) names[l.id] = l.name;
    for (const l of window.WIKI?.lugares || []) names[l.id] = names[l.id] || l.name;
    const keys = [];
    for (const id of ids) {
      for (const k of new Set([id, slug(id), names[id] && slug(names[id]), ...(PLACE_ALIASES[id] || [])].filter(Boolean))) keys.push([k, id]);
    }
    keys.sort((a, b) => b[0].length - a[0].length); // «puente-zaun» antes que «puente»
    const out = {};
    const unknown = [];
    const files = Object.entries(raw).map(([f, url]) => [slug(f), f, url]);
    for (const pass of ['exact', 'contains']) {
      for (const [s, f, url] of files) {
        if (Object.values(out).includes(url)) continue;
        const hit = keys.find(([k, id]) => !out[id] && (pass === 'exact' ? s === k : s.includes(k)));
        if (hit) out[hit[1]] = url;
      }
    }
    for (const [, f, url] of files) if (!Object.values(out).includes(url)) unknown.push(f);
    const direct = new Set(Object.keys(out));
    for (const [id, alt] of Object.entries(PLACE_FALLBACK)) if (!out[id] && direct.has(alt)) out[id] = out[alt];
    return { out, unknown, direct };
  }

  // Arte personal de la jugadora (carpeta «arte» en escritorio).
  window.CustomArt = {
    season() {
      const id = window.Game?.current?.()?.progress?.chapterId || '';
      return /^t\d+$|^fin2$/.test(id) ? 's2' : 's1';
    },
    files: { avatares: {}, personajes: {}, caras: {}, lugares: {}, codice: {} },
    report: { found: [], missing: [], borrowed: [], unknown: [] },
    async load() {
      if (window.arcane?.art) {
        try { this.files = await window.arcane.art.list(); } catch { /* sin carpeta */ }
      } else {
        // Navegador y Android: recursos empaquetados, incluidas las carpetas por temporada.
        for (const dir of new Set([...Object.keys(this.files), ...Object.keys(window.ART_BUNDLED || {})])) this.files[dir] = { ...(window.ART_BUNDLED?.[dir] || {}) };
      }
      const { out, unknown, direct } = matchPlaces(this.files.lugares || {});
      const ids = Object.keys(window.Scenes?.THEMES || {});
      this.files.lugares = { ...this.files.lugares, ...out };
      this.report = {
        found: ids.filter((id) => direct.has(id)),
        borrowed: ids.filter((id) => out[id] && !direct.has(id)),
        missing: ids.filter((id) => !out[id]),
        unknown,
      };
    },
    image(cat, id) {
      if (['personajes', 'caras', 'lugares'].includes(cat)) {
        const season = this.season();
        const seasonal = this.files[`${cat}/${season}`]?.[id] || window.ART_BUNDLED?.[`${cat}/${season}`]?.[id];
        if (seasonal) return seasonal;
        // Nunca usar retratos o escenarios de T1 como imágenes de T2.
        if (season === 's2') return null;
      }
      const f = this.files[cat]?.[id];
      return f || null;
    },
  };

  window.U = { $, $$, el, esc, tpl, store, saveFile, SETTINGS_DEFAULTS, toast, sleep, pick, norm, genderIndex, genderize, desktop, touch };
})();
