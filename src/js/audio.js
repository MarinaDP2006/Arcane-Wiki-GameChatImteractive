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
    settings: { volume: 0.6, music: true },
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
      A.musicGain.gain.value = 0.25 * (A.settings.musicVolume ?? 1);
      A.musicGain.connect(A.master);
    }
    if (A.ctx.state === 'suspended') A.ctx.resume();
    return A.ctx;
  }

  function configure(s) {
    Object.assign(A.settings, s);
    if (A.master) A.master.gain.value = A.settings.volume;
    if (A.musicGain) A.musicGain.gain.value = 0.25 * (A.settings.musicVolume ?? 1);
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
    g.gain.setValueAtTime(Math.max(0.0002, vol * (A.settings.sfxVolume ?? 1)), ctx.currentTime);
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

  // La app de móvil se calla al irse a segundo plano y vuelve a sonar al regresar.
  const suspend = () => { if (A.ctx && A.ctx.state === 'running') A.ctx.suspend(); };
  const resume = () => { if (A.ctx && A.ctx.state === 'suspended') A.ctx.resume(); };

  window.Audio2 = { configure, sfx, playMusic, stopMusic, ensureCtx, suspend, resume };
})();
