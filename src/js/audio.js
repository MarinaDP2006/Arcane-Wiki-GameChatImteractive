// Audio del juego: voces sintetizadas para los diálogos, música ambiental
// procedural (sin archivos externos) y pequeños efectos de sonido.
(function () {
  const A = {
    ctx: null,
    master: null,
    musicGain: null,
    musicNodes: [],
    musicTimer: null,
    mood: null,
    settings: { volume: 0.6, music: true, voice: true, voiceRate: 1 },
    voices: [],
  };

  function ensureCtx() {
    if (!A.ctx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return null;
      A.ctx = new Ctx();
      A.master = A.ctx.createGain();
      A.master.gain.value = A.settings.volume;
      A.master.connect(A.ctx.destination);
      A.musicGain = A.ctx.createGain();
      A.musicGain.gain.value = 0.25;
      A.musicGain.connect(A.master);
    }
    if (A.ctx.state === 'suspended') A.ctx.resume();
    return A.ctx;
  }

  function configure(s) {
    Object.assign(A.settings, s);
    if (A.master) A.master.gain.value = A.settings.volume;
    if (!A.settings.music) stopMusic();
    else if (A.mood) playMusic(A.mood, true);
  }

  // ---------- Efectos ----------
  function blip(freq, dur = 0.12, type = 'sine', vol = 0.2) {
    const ctx = ensureCtx();
    if (!ctx) return;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.setValueAtTime(vol, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    o.connect(g).connect(A.master);
    o.start();
    o.stop(ctx.currentTime + dur);
  }

  const sfx = {
    click: () => blip(660, 0.06, 'triangle', 0.12),
    message: () => blip(880, 0.09, 'sine', 0.1),
    choice: () => { blip(523, 0.08, 'triangle', 0.15); setTimeout(() => blip(784, 0.12, 'triangle', 0.15), 70); },
    unlock: () => [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => blip(f, 0.25, 'sine', 0.15), i * 110)),
    locked: () => blip(140, 0.2, 'sawtooth', 0.08),
  };

  // ---------- Música ambiental ----------
  const MOODS = {
    zaun: { root: 110, scale: [0, 3, 5, 7, 10], tempo: 900, wave: 'sawtooth', drone: 55, filter: 700 },
    piltover: { root: 220, scale: [0, 2, 4, 7, 9], tempo: 650, wave: 'triangle', drone: 110, filter: 2200 },
    wiki: { root: 196, scale: [0, 2, 3, 7, 9], tempo: 1100, wave: 'sine', drone: 98, filter: 1400 },
    final: { root: 98, scale: [0, 1, 5, 7, 8], tempo: 750, wave: 'sawtooth', drone: 49, filter: 900 },
  };

  function stopMusic() {
    clearInterval(A.musicTimer);
    A.musicTimer = null;
    A.musicNodes.forEach((n) => { try { n.stop(); } catch { /* ya parado */ } });
    A.musicNodes = [];
  }

  function playMusic(mood, force = false) {
    if (A.mood === mood && A.musicTimer && !force) return;
    A.mood = mood;
    stopMusic();
    if (!A.settings.music) return;
    const ctx = ensureCtx();
    const m = MOODS[mood];
    if (!ctx || !m) return;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = m.filter;
    filter.connect(A.musicGain);

    // Pedal grave continuo con un leve vibrato.
    const drone = ctx.createOscillator();
    const dg = ctx.createGain();
    drone.type = 'sine';
    drone.frequency.value = m.drone;
    dg.gain.value = 0.35;
    const lfo = ctx.createOscillator();
    const lg = ctx.createGain();
    lfo.frequency.value = 0.15;
    lg.gain.value = 3;
    lfo.connect(lg).connect(drone.frequency);
    drone.connect(dg).connect(filter);
    drone.start();
    lfo.start();
    A.musicNodes.push(drone, lfo);

    let step = 0;
    A.musicTimer = setInterval(() => {
      if (!A.ctx) return;
      const t = A.ctx.currentTime;
      const deg = m.scale[Math.floor(Math.random() * m.scale.length)];
      const oct = Math.random() < 0.3 ? 2 : 1;
      const f = m.root * oct * Math.pow(2, deg / 12);
      const o = A.ctx.createOscillator();
      const g = A.ctx.createGain();
      o.type = m.wave;
      o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.18, t + 0.05);
      g.gain.exponentialRampToValueAtTime(0.0001, t + (m.tempo / 1000) * 1.8);
      o.connect(g).connect(filter);
      o.start(t);
      o.stop(t + (m.tempo / 1000) * 2);
      // Zaun: golpe metálico de fábrica cada cuatro pasos.
      if (mood === 'zaun' && step % 4 === 0) {
        const n = A.ctx.createOscillator();
        const ng = A.ctx.createGain();
        n.type = 'square';
        n.frequency.setValueAtTime(180, t);
        n.frequency.exponentialRampToValueAtTime(40, t + 0.15);
        ng.gain.setValueAtTime(0.12, t);
        ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
        n.connect(ng).connect(A.musicGain);
        n.start(t);
        n.stop(t + 0.25);
      }
      step++;
    }, m.tempo);
  }

  // ---------- Voces ----------
  function loadVoices() {
    if (!('speechSynthesis' in window)) return;
    A.voices = speechSynthesis.getVoices();
  }
  if ('speechSynthesis' in window) {
    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
  }

  function pickVoice(gender) {
    const es = A.voices.filter((v) => /^es/i.test(v.lang));
    const pool = es.length ? es : A.voices;
    if (!pool.length) return null;
    const fem = /(female|mujer|helena|laura|monica|mónica|paulina|sabina|elvira|dalia|lucia|lucía|paloma|marisol|google español)/i;
    const masc = /(male|hombre|pablo|jorge|diego|juan|alvaro|álvaro|raul|raúl|enrique|carlos)/i;
    const want = gender === 'm' ? masc : fem;
    return pool.find((v) => want.test(v.name)) || pool[gender === 'm' ? pool.length - 1 : 0];
  }

  function cleanForSpeech(text) {
    return text.replace(/\([^)]*\)/g, ' ').replace(/[«»*]/g, '').replace(/\s+/g, ' ').trim();
  }

  // Lee una línea en voz alta. Devuelve una promesa que se resuelve al terminar.
  function speak(text, voice = {}) {
    if (A.settings.voice && neuralReady()) {
      const clean = cleanForSpeech(text);
      if (!clean) return Promise.resolve();
      return speakNeural(clean, voice).catch(() => {});
    }
    return new Promise((resolve) => {
      if (!A.settings.voice || !('speechSynthesis' in window)) return resolve();
      const clean = cleanForSpeech(text);
      if (!clean) return resolve();
      const u = new SpeechSynthesisUtterance(clean);
      u.lang = 'es-ES';
      const v = pickVoice(voice.gender);
      if (v) u.voice = v;
      u.pitch = voice.pitch ?? 1;
      u.rate = (voice.rate ?? 1) * (A.settings.voiceRate || 1);
      u.volume = Math.min(1, A.settings.volume + 0.2);
      u.onend = resolve;
      u.onerror = resolve;
      speechSynthesis.speak(u);
    });
  }

  // ---------- Voces humanas (Piper neuronal, en el proceso principal) ----------
  // v: voz instalada · sid: hablante dentro del modelo · pitch: tono (velocidad de reproducción)
  // speed: ritmo al hablar.
  const NEURAL = {
    narrador: { v: 'miro', sid: 0, pitch: 1, speed: 0.95 },
    vi: { v: 'sharvard', sid: 1, pitch: 0.92, speed: 1.05 },
    jinx: { v: 'daniela', sid: 0, pitch: 1.12, speed: 1.15 },
    caitlyn: { v: 'sharvard', sid: 1, pitch: 1.0, speed: 0.98 },
    mel: { v: 'daniela', sid: 0, pitch: 0.95, speed: 0.92 },
    cassandra: { v: 'sharvard', sid: 1, pitch: 0.96, speed: 0.92 },
    sevika: { v: 'sharvard', sid: 1, pitch: 0.85, speed: 0.95 },
    ambessa: { v: 'daniela', sid: 0, pitch: 0.86, speed: 0.9 },
    sky: { v: 'daniela', sid: 0, pitch: 1.06, speed: 1.0 },
    isha: { v: 'daniela', sid: 0, pitch: 1.25, speed: 1.1 },
    jayce: { v: 'davefx', sid: 0, pitch: 1.0, speed: 1.02 },
    viktor: { v: 'miro', sid: 0, pitch: 0.97, speed: 0.92 },
    heimerdinger: { v: 'davefx', sid: 0, pitch: 1.25, speed: 1.1 },
    silco: { v: 'miro', sid: 0, pitch: 0.9, speed: 0.88 },
    vander: { v: 'sharvard', sid: 0, pitch: 0.95, speed: 0.9 },
    ekko: { v: 'davefx', sid: 0, pitch: 1.08, speed: 1.08 },
    singed: { v: 'miro', sid: 0, pitch: 0.85, speed: 0.85 },
    marcus: { v: 'sharvard', sid: 0, pitch: 1.0, speed: 0.95 },
    mylo: { v: 'davefx', sid: 0, pitch: 1.12, speed: 1.12 },
    claggor: { v: 'sharvard', sid: 0, pitch: 0.92, speed: 0.95 },
    benzo: { v: 'miro', sid: 0, pitch: 0.9, speed: 0.9 },
    scar: { v: 'davefx', sid: 0, pitch: 0.95, speed: 1.0 },
    loris: { v: 'sharvard', sid: 0, pitch: 1.05, speed: 1.0 },
  };
  const tts = { installed: [], available: false };
  let current = null; // fuente de audio sonando
  let token = 0;

  function neuralReady() {
    return A.settings.voiceEngine !== 'system' && tts.available && tts.installed.length > 0 && window.arcane?.tts;
  }

  // Busca el personaje al que pertenece un objeto de voz de CHAT.
  function voiceOwner(voice) {
    if (!voice) return null;
    if (voice.__id) return voice.__id;
    for (const [id, c] of Object.entries(window.CHAT || {})) if (c.voice === voice) { voice.__id = id; return id; }
    return null;
  }

  function neuralParams(voice) {
    const id = voiceOwner(voice);
    if (id && NEURAL[id]) return NEURAL[id];
    if (voice?.narrator) return NEURAL.narrador;
    // Habitantes y narrador: según el género y con un tono parecido al pedido.
    const female = voice?.gender === 'f';
    return { v: 'sharvard', sid: female ? 1 : 0, pitch: Math.max(0.8, Math.min(1.3, voice?.pitch ?? 1)), speed: voice?.rate ?? 1 };
  }

  async function speakNeural(clean, voice) {
    const my = ++token;
    const p = neuralParams(voice);
    const v = tts.installed.includes(p.v) ? p.v : tts.installed.includes('sharvard') ? 'sharvard' : tts.installed[0];
    const rate = A.settings.voiceRate || 1;
    // La velocidad de reproducción cambia el tono; se compensa el ritmo al sintetizar.
    const res = await window.arcane.tts.speak({ text: clean, voice: v, sid: v === p.v ? p.sid : (voice?.gender === 'f' ? 1 : 0), speed: (p.speed * rate) / p.pitch });
    if (my !== token || !res.ok) return;
    const ctx = ensureCtx();
    if (!ctx) return;
    const u8 = res.wav;
    const buf = await ctx.decodeAudioData(u8.buffer.slice(u8.byteOffset, u8.byteOffset + u8.byteLength));
    if (my !== token) return;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.playbackRate.value = p.pitch;
    const g = ctx.createGain();
    g.gain.value = Math.min(1.6, A.settings.volume * 1.6 + 0.2);
    src.connect(g).connect(ctx.destination);
    current = src;
    await new Promise((resolve) => { src.onended = resolve; src.start(); });
    if (current === src) current = null;
  }

  async function refreshNeural() {
    if (!window.arcane?.tts) return tts;
    try { Object.assign(tts, await window.arcane.tts.status()); } catch { /* sin motor */ }
    return tts;
  }

  function stopSpeech() {
    token++;
    try { current?.stop(); } catch { /* ya parado */ }
    current = null;
    if ('speechSynthesis' in window) speechSynthesis.cancel();
  }

  window.Audio2 = { configure, sfx, playMusic, stopMusic, speak, stopSpeech, ensureCtx, refreshNeural, tts, NEURAL };
})();
