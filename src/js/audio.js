// Audio del juego, todo generado en tiempo real con Web Audio (sin archivos ni
// música de Arcane: es una banda sonora original inspirada en su estilo).
// - Piltover: orquesta de cámara, cuerdas, metales, arpa, celesta y relojería.
// - Zaun: ritmo industrial, bajo sucio, sintes de neón, golpes de metal y eco.
// - Ambiente de cada ciudad (viento y campanas / goteos, vapor y zumbido de neón),
//   efectos de interfaz y pasos que suenan distinto en cada ciudad.
(function () {
  const A = {
    ctx: null,
    master: null,
    musicGain: null,
    sfxGain: null,
    ambGain: null,
    reverb: null,
    noise: null,
    session: null,
    amb: null,
    mood: null,
    preview: null,
    settings: { volume: 0.6, music: true, ambience: true },
  };

  const MUSIC_LEVEL = 0.32;
  const AMB_LEVEL = 0.55;
  // Temas locales. Si todavía no se ha copiado un MP3, se usa el sintetizador existente.
  const TRACK_FILES = {
    wiki: 'menu-theme.mp3',
    piltover: 'piltover-theme.mp3',
    zaun: 'zaun-theme.mp3',
  };
  const audioFileUrl = (filename) => {
    // En escritorio, index.html vive dentro de src/. En Android/otros despliegues,
    // build-mobile.js coloca la música junto a index.html bajo assets/music/.
    const inSrcFolder = /\/src\/index\.html$/i.test(window.location.pathname || '');
    return (inSrcFolder ? '../assets/music/' : 'assets/music/') + filename;
  };
  const fileMusicVolume = () => Math.max(0, Math.min(1,
    (A.settings.volume ?? 0.6) * (A.settings.musicVolume ?? 1) * 0.62));

  function ensureCtx() {
    if (!A.ctx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return null;
      const ctx = new Ctx();
      A.ctx = ctx;
      // Compresor final: muchas capas a la vez sin saturar los altavoces.
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -14;
      comp.ratio.value = 4;
      comp.connect(ctx.destination);
      A.master = ctx.createGain();
      A.master.gain.value = A.settings.volume;
      A.master.connect(comp);
      A.musicGain = gainTo(A.master, MUSIC_LEVEL * (A.settings.musicVolume ?? 1));
      A.sfxGain = gainTo(A.master, A.settings.sfxVolume ?? 1);
      A.ambGain = gainTo(A.master, AMB_LEVEL * (A.settings.ambienceVolume ?? 1));
      // Ruido blanco compartido (percusión, viento, vapor).
      A.noise = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
      const d = A.noise.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      // Reverberación de sala hecha con ruido que se apaga poco a poco.
      A.reverb = ctx.createConvolver();
      A.reverb.buffer = impulse(ctx, 2.8, 2.6);
      A.reverb.connect(A.master);
    }
    if (A.ctx.state === 'suspended') A.ctx.resume();
    return A.ctx;
  }

  function impulse(ctx, secs, decay) {
    const len = Math.floor(ctx.sampleRate * secs);
    const buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = buf.getChannelData(c);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
    }
    return buf;
  }

  function gainTo(dest, value) {
    const g = A.ctx.createGain();
    g.gain.value = value;
    g.connect(dest);
    return g;
  }

  function configure(s) {
    Object.assign(A.settings, s);
    if (A.master) {
      A.master.gain.value = A.settings.volume;
      A.musicGain.gain.value = MUSIC_LEVEL * (A.settings.musicVolume ?? 1);
      A.sfxGain.gain.value = A.settings.sfxVolume ?? 1;
      A.ambGain.gain.value = AMB_LEVEL * (A.settings.ambienceVolume ?? 1);
    }
    if (!A.settings.music) stopMusic();
    else if (A.session?.type === 'file' && A.session.audio) A.session.audio.volume = fileMusicVolume();
    else if (A.mood && (!A.session || A.session.mood !== A.mood)) startMusic(A.mood);
    if (A.settings.ambience === false) stopAmbience();
    else if (A.mood && A.ctx && (!A.amb || A.amb.city !== cityOf(A.mood))) startAmbience(cityOf(A.mood));
  }

  // ---------- Instrumentos ----------
  const hz = (midi) => 440 * Math.pow(2, (midi - 69) / 12);
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  /** Envolvente de volumen: subida, mantenimiento y caída. */
  function env(g, t, vol, atk, hold, rel) {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, vol), t + atk);
    g.gain.setValueAtTime(Math.max(0.0002, vol), t + atk + hold);
    g.gain.exponentialRampToValueAtTime(0.0001, t + atk + hold + rel);
    return t + atk + hold + rel;
  }

  function osc(type, f, t, end, dest, detune = 0) {
    const o = A.ctx.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(f, t);
    o.detune.value = detune;
    o.connect(dest);
    o.start(t);
    o.stop(end + 0.05);
    return o;
  }

  function filt(type, freq, q, dest) {
    const f = A.ctx.createBiquadFilter();
    f.type = type;
    f.frequency.value = freq;
    f.Q.value = q;
    f.connect(dest);
    return f;
  }

  /** Voz con envolvente que manda una parte a la reverberación. */
  function voice(dest, vol, t, atk, hold, rel, wet = 0.3) {
    const g = A.ctx.createGain();
    g.connect(dest);
    if (wet && A.reverb) {
      const s = A.ctx.createGain();
      s.gain.value = wet;
      g.connect(s).connect(A.reverb);
    }
    return { g, end: env(g, t, vol, atk, hold, rel) };
  }

  function noiseSrc(t, end, dest) {
    const n = A.ctx.createBufferSource();
    n.buffer = A.noise;
    n.loop = true;
    n.connect(dest);
    n.start(t, Math.random() * 1.5);
    n.stop(end + 0.05);
    return n;
  }

  // Cuerdas: tres sierras desafinadas por nota, filtradas y con entrada lenta.
  function strings(dest, notes, t, dur, vol, cutoff = 1600) {
    const v = voice(dest, vol, t, dur * 0.3, dur * 0.4, dur * 0.5, 0.45);
    const f = filt('lowpass', cutoff, 0.7, v.g);
    notes.forEach((m) => [-9, 0, 8].forEach((dt) => osc('sawtooth', hz(m), t, v.end, f, dt + (Math.random() * 4 - 2))));
  }

  // Metales: sierra con filtro que se abre al soplar, como una trompa lejana.
  function brass(dest, notes, t, dur, vol) {
    const v = voice(dest, vol, t, 0.25, dur * 0.6, dur * 0.4, 0.5);
    const f = filt('lowpass', 300, 1.2, v.g);
    f.frequency.setValueAtTime(300, t);
    f.frequency.exponentialRampToValueAtTime(1900, t + 0.35);
    f.frequency.exponentialRampToValueAtTime(900, t + dur);
    notes.forEach((m) => { osc('sawtooth', hz(m), t, v.end, f, -4); osc('square', hz(m), t, v.end, f, 5); });
  }

  // Arpa / pizzicato: pulsación corta.
  function pluck(dest, m, t, vol, rel = 0.9) {
    const v = voice(dest, vol, t, 0.004, 0, rel, 0.4);
    const f = filt('lowpass', 3200, 0.5, v.g);
    osc('triangle', hz(m), t, v.end, f);
    osc('sine', hz(m + 12), t, v.end, f);
  }

  // Campana / celesta por modulación de frecuencia (FM).
  function bell(dest, m, t, vol, rel = 1.6, ratio = 3.5, wet = 0.55) {
    const v = voice(dest, vol, t, 0.003, 0, rel, wet);
    const car = osc('sine', hz(m), t, v.end, v.g);
    const mg = A.ctx.createGain();
    mg.gain.setValueAtTime(hz(m) * 2.2, t);
    mg.gain.exponentialRampToValueAtTime(1, t + rel);
    const mod = osc('sine', hz(m) * ratio, t, v.end, mg);
    mg.connect(car.frequency);
    return mod;
  }

  // Tic-tac de engranaje: ruido muy corto y agudo con una resonancia metálica.
  function tick(dest, t, vol, pitch = 4200) {
    const v = voice(dest, vol, t, 0.001, 0, 0.045, 0.15);
    noiseSrc(t, v.end, filt('bandpass', pitch, 9, v.g));
    const r = voice(dest, vol * 0.25, t, 0.001, 0, 0.08, 0.1);
    osc('sine', pitch * 0.62, t, r.end, r.g);
  }

  function kick(dest, t, vol) {
    const v = voice(dest, vol, t, 0.002, 0.02, 0.28, 0);
    const o = osc('sine', 140, t, v.end, v.g);
    o.frequency.exponentialRampToValueAtTime(42, t + 0.18);
  }

  // Golpe de metal de fábrica: ruido + parciales inarmónicos.
  function clank(dest, t, vol, base = 520) {
    const v = voice(dest, vol, t, 0.001, 0.01, 0.22, 0.35);
    noiseSrc(t, v.end, filt('bandpass', 2200, 1.5, v.g));
    const r = voice(dest, vol * 0.35, t, 0.001, 0, 0.5, 0.4);
    const f = filt('bandpass', base * 2, 3, r.g);
    [1, 1.47, 2.09, 2.76].forEach((k) => osc('square', base * k, t, r.end, f));
  }

  function hat(dest, t, vol, open = false) {
    const v = voice(dest, vol, t, 0.001, 0, open ? 0.22 : 0.04, 0.05);
    noiseSrc(t, v.end, filt('highpass', 7000, 0.8, v.g));
  }

  // Bajo de Zaun: sierra saturada con filtro grave.
  function grit(dest, m, t, dur, vol) {
    const v = voice(dest, vol, t, 0.005, dur * 0.5, dur * 0.6, 0);
    const shaper = A.ctx.createWaveShaper();
    const curve = new Float32Array(256);
    for (let i = 0; i < 256; i++) { const x = i / 128 - 1; curve[i] = Math.tanh(x * 3); }
    shaper.curve = curve;
    const f = filt('lowpass', 260, 4, v.g);
    f.frequency.setValueAtTime(900, t);
    f.frequency.exponentialRampToValueAtTime(180, t + dur);
    shaper.connect(f);
    osc('sawtooth', hz(m), t, v.end, shaper);
    osc('square', hz(m - 12), t, v.end, shaper, 6);
  }

  // Sinte de neón: onda cuadrada con eco en el canal de Zaun.
  function neon(dest, m, t, dur, vol) {
    const v = voice(dest, vol, t, 0.01, dur * 0.4, dur * 0.8, 0.3);
    const f = filt('lowpass', 2600, 6, v.g);
    const o = osc('square', hz(m), t, v.end, f);
    // Pequeño deslizamiento de tono al entrar, muy de sinte.
    o.frequency.setValueAtTime(hz(m) * 0.94, t);
    o.frequency.exponentialRampToValueAtTime(hz(m), t + 0.06);
    osc('sawtooth', hz(m), t, v.end, f, 12);
  }

  // Pad oscuro con filtro que respira.
  function darkPad(dest, notes, t, dur, vol) {
    const v = voice(dest, vol, t, dur * 0.25, dur * 0.5, dur * 0.4, 0.5);
    const f = filt('lowpass', 500, 3, v.g);
    f.frequency.setValueAtTime(380, t);
    f.frequency.linearRampToValueAtTime(1300, t + dur * 0.55);
    f.frequency.linearRampToValueAtTime(420, t + dur);
    notes.forEach((m) => [-14, 0, 13].forEach((dt) => osc('sawtooth', hz(m), t, v.end, f, dt)));
  }

  // ---------- Temas ----------
  // Cada tema recibe el paso de la rejilla, su instante y el bus donde sonar.
  const THEMES = {
    // gain iguala el volumen percibido de los temas entre sí.
    // Piltover: Re mayor, 80 ppm, corcheas. Elegante, luminoso y con relojería.
    piltover: {
      bpm: 80, div: 2, bars: 16, gain: 2, beats: 4,
      chords: [
        [50, 57, 62, 66, 69], [47, 54, 59, 62, 66], [43, 50, 55, 59, 66], [45, 52, 57, 62, 64],
        [42, 49, 54, 57, 61], [47, 54, 59, 62, 66], [40, 47, 52, 55, 62], [45, 52, 55, 61, 64],
      ],
      melody: [[74, 2], [76, 1], [78, 1], [81, 3], [78, 1], [76, 2], [74, 2], [73, 4], [71, 2], [74, 2], [76, 4]],
      play(bus, n, t, sd) {
        const perBar = this.div * this.beats;
        const bar = Math.floor(n / perBar) % this.bars;
        const pos = n % perBar;
        const chord = this.chords[Math.floor(bar / 2)];
        const beat = sd * this.div;
        if (pos === 0 && bar % 2 === 0) strings(bus, chord.slice(1).map((m) => m + 12), t, beat * 8, 0.035);
        if (pos === 0 && bar % 4 === 0) brass(bus, chord.slice(0, 3), t, beat * 6, 0.05);
        if (pos === 0 || pos === 4) pluck(bus, chord[0] - 12, t, 0.16, 0.6);
        // Arpa: sube y baja por el acorde.
        const arp = [1, 2, 3, 4, 3, 2, 1, 2];
        if (bar % 8 > 1) pluck(bus, chord[arp[pos]] + 12, t, pos % 2 ? 0.05 : 0.08, 1.1);
        // Celesta: la melodía entra cada cuatro compases.
        if (bar % 4 === 2 && pos === 0) {
          let at = t;
          for (const [m, len] of this.melody.slice(0, 6 + Math.floor(Math.random() * 5))) {
            bell(bus, m + (Math.random() < 0.15 ? 12 : 0), at, 0.07, 1.4);
            at += len * sd;
          }
        }
        // Reloj: tic-tac en cada pulso y campanada al empezar la vuelta.
        if (pos % 2 === 0) tick(bus, t, 0.05, pos % 4 === 0 ? 4600 : 3400);
        if (n % (perBar * this.bars) === 0) bell(bus, 50, t, 0.12, 4, 2.4, 0.8);
      },
    },
    // Zaun: Mi menor, 92 ppm, semicorcheas. Industrial, sucio y con neón.
    zaun: {
      bpm: 92, div: 4, bars: 8, gain: 1.3, beats: 4,
      chords: [[40, 52, 55, 59], [36, 52, 55, 59], [45, 52, 57, 60], [47, 51, 54, 60]],
      riff: [64, 67, 69, 71, 74, 71, 69, 67],
      play(bus, n, t, sd) {
        const perBar = this.div * this.beats;
        const bar = Math.floor(n / perBar) % this.bars;
        const pos = n % perBar;
        const chord = this.chords[Math.floor(bar / 2)];
        const intro = Math.floor(n / (perBar * this.bars)) === 0 && bar < 2;
        if (pos === 0 && bar % 2 === 0) darkPad(bus, chord.slice(1), t, sd * perBar * 2, 0.03);
        if (!intro) {
          if ([0, 7, 8].includes(pos) || (pos === 10 && bar % 2)) kick(bus, t, 0.5);
          if (pos === 4 || pos === 12) clank(bus, t, 0.14, pick([480, 520, 560]));
          hat(bus, t, (pos % 4 === 2 ? 0.05 : 0.025) * (0.6 + Math.random() * 0.6), pos === 14 && bar % 2 === 1);
        }
        if ([0, 3, 6, 8, 11, 14].includes(pos)) grit(bus, chord[0] - 12 + (pos === 11 ? 12 : 0), t, sd * 2, 0.11);
        // Sinte de neón con eco: en la segunda mitad de cada vuelta.
        if (bar >= 4 && pos % 2 === 0 && Math.random() < 0.55) {
          const m = this.riff[(pos / 2 + bar) % this.riff.length];
          neon(bus, m, t, sd * 2, 0.04);
          // Eco: la misma nota, más baja, una corchea con puntillo después.
          if (Math.random() < 0.7) neon(bus, m, t + sd * 3, sd * 2, 0.018);
        }
        if (pos === 0 && bar === 0) clank(bus, t, 0.08, 220);
      },
    },
    // Menú y wiki: una caja de música entre las dos ciudades.
    wiki: {
      bpm: 68, div: 2, bars: 8, gain: 3.6, beats: 4,
      chords: [[45, 57, 60, 64], [41, 57, 60, 65], [36, 55, 60, 64], [43, 55, 59, 62]],
      play(bus, n, t, sd) {
        const perBar = this.div * this.beats;
        const bar = Math.floor(n / perBar) % this.bars;
        const pos = n % perBar;
        const chord = this.chords[Math.floor(bar / 2)];
        if (pos === 0 && bar % 2 === 0) { strings(bus, chord.slice(1), t, sd * perBar * 2, 0.03, 1100); pluck(bus, chord[0] - 12, t, 0.14, 2); }
        const box = [3, 1, 2, 3, 2, 1, 3, 2];
        if (Math.random() < 0.8) bell(bus, chord[box[pos]] + 12, t, pos === 0 ? 0.07 : 0.045, 1.2, 4, 0.6);
        if (pos % 2 === 0) tick(bus, t, 0.025, 3800);
        if (pos === 6 && bar % 4 === 3) clank(bus, t, 0.03, 300);
      },
    },
    // Final: Re menor, tenso, metales de Piltover sobre tambores de Zaun.
    final: {
      bpm: 76, div: 4, bars: 8, gain: 1.45, beats: 4,
      chords: [[38, 50, 53, 57], [34, 50, 53, 58], [36, 48, 52, 55], [33, 49, 52, 57]],
      play(bus, n, t, sd) {
        const perBar = this.div * this.beats;
        const bar = Math.floor(n / perBar) % this.bars;
        const pos = n % perBar;
        const chord = this.chords[Math.floor(bar / 2)];
        if (pos === 0 && bar % 2 === 0) { darkPad(bus, chord.slice(1), t, sd * perBar * 2, 0.03); brass(bus, chord.slice(1), t, sd * perBar * 1.5, 0.05); }
        if (pos === 0 || pos === 10) kick(bus, t, 0.55);
        if (pos === 8) clank(bus, t, 0.12, 400);
        if (pos % 4 === 0) tick(bus, t, 0.04, 3000);
        if ([0, 6, 12].includes(pos)) grit(bus, chord[0], t, sd * 3, 0.08);
        if (bar % 4 === 3 && pos % 4 === 0) bell(bus, chord[3] + 12, t, 0.06, 2.2, 3.5, 0.7);
      },
    },
  };

  function cityOf(mood) {
    if (mood === 'piltover' || mood === 'zaun') return mood;
    if (mood === 'final') return 'zaun';
    return null;
  }

  // ---------- Reproductor de música ----------
  function startMusic(mood) {
    const ctx = ensureCtx();
    const theme = THEMES[mood];
    if (!ctx || !theme) return;
    const filename = TRACK_FILES[mood];
    if (filename && typeof window.Audio === 'function') {
      startFileMusic(mood, filename);
      return;
    }
    startSynthMusic(mood);
  }

  function startFileMusic(mood, filename) {
    fadeOut(A.session);
    const audio = new window.Audio();
    const s = { mood, type: 'file', audio, timer: null };
    audio.preload = 'auto';
    audio.loop = true;
    audio.volume = fileMusicVolume();
    audio.src = audioFileUrl(filename);
    A.session = s;
    const fallback = () => {
      // Evita que un error tardío de una ciudad anterior cambie el tema actual.
      if (A.session !== s || A.mood !== mood || !A.settings.music) return;
      A.session = null;
      try { audio.pause(); audio.removeAttribute('src'); audio.load(); } catch { /* navegador */ }
      startSynthMusic(mood);
    };
    audio.addEventListener('error', fallback, { once: true });
    try {
      const playing = audio.play();
      if (playing && typeof playing.catch === 'function') playing.catch(fallback);
    } catch { fallback(); }
  }

  function startSynthMusic(mood) {
    const ctx = ensureCtx();
    const theme = THEMES[mood];
    if (!ctx || !theme) return;
    fadeOut(A.session);
    const bus = ctx.createGain();
    bus.gain.setValueAtTime(0.0001, ctx.currentTime);
    bus.gain.exponentialRampToValueAtTime(theme.gain, ctx.currentTime + 1.5);
    bus.connect(A.musicGain);
    const sd = 60 / theme.bpm / theme.div;
    const s = { mood, bus, n: 0, next: ctx.currentTime + 0.15, timer: null };
    s.timer = setInterval(() => {
      if (!A.ctx || A.ctx.state !== 'running') return;
      const now = A.ctx.currentTime;
      // Si el navegador congeló el temporizador, se salta lo atrasado en vez de amontonarlo.
      if (s.next < now - 0.05) s.next = now + 0.05;
      while (s.next < now + 0.3) {
        try { theme.play(bus, s.n, s.next, sd); } catch { /* una nota rota no para la música */ }
        s.next += sd;
        s.n++;
      }
    }, 60);
    A.session = s;
  }

  function fadeOut(s, secs = 1.4) {
    if (!s) return;
    clearInterval(s.timer);
    if (s.type === 'file' && s.audio) {
      const audio = s.audio;
      const initial = audio.volume;
      const started = Date.now();
      const step = Math.max(25, Math.min(80, secs * 1000 / 12));
      const fadeTimer = setInterval(() => {
        const p = Math.min(1, (Date.now() - started) / (secs * 1000));
        try { audio.volume = Math.max(0, initial * (1 - p)); } catch { /* audio liberado */ }
        if (p >= 1) {
          clearInterval(fadeTimer);
          try { audio.pause(); audio.removeAttribute('src'); audio.load(); } catch { /* navegador */ }
        }
      }, step);
      if (A.session === s) A.session = null;
      return;
    }
    if (!A.ctx || !s.bus) return;
    const t = A.ctx.currentTime;
    s.bus.gain.cancelScheduledValues(t);
    s.bus.gain.setValueAtTime(Math.max(0.0001, s.bus.gain.value), t);
    s.bus.gain.exponentialRampToValueAtTime(0.0001, t + secs);
    setTimeout(() => s.bus.disconnect(), secs * 1000 + 3000);
    if (A.session === s) A.session = null;
  }

  function stopMusic() {
    if (A.session) fadeOut(A.session, 0.6);
  }

  function playMusic(mood, force = false) {
    if (A.preview) { clearTimeout(A.preview.timer); A.preview = null; }
    if (A.mood === mood && A.session && !force) return;
    A.mood = mood;
    if (A.settings.music) startMusic(mood);
    else stopMusic();
    if (A.settings.ambience !== false) startAmbience(cityOf(mood));
  }

  /** Escucha una ciudad unos segundos desde Ajustes y vuelve a lo que sonaba. */
  function previewCity(city) {
    const back = A.preview?.back ?? A.mood;
    playMusic(city, true);
    A.preview = {
      back,
      timer: setTimeout(() => { A.preview = null; if (back && back !== city) playMusic(back, true); }, 30000),
    };
  }

  // ---------- Ambiente de la ciudad ----------
  function stopAmbience() {
    const a = A.amb;
    if (!a) return;
    A.amb = null;
    clearTimeout(a.timer);
    const t = A.ctx.currentTime;
    a.bus.gain.cancelScheduledValues(t);
    a.bus.gain.setValueAtTime(Math.max(0.0001, a.bus.gain.value), t);
    a.bus.gain.exponentialRampToValueAtTime(0.0001, t + 1.5);
    setTimeout(() => { a.nodes.forEach((n) => { try { n.stop(); } catch { /* ya parado */ } }); a.bus.disconnect(); }, 2000);
  }

  function startAmbience(city) {
    if (A.amb?.city === city) return;
    stopAmbience();
    const ctx = ensureCtx();
    if (!ctx || !city) return;
    const t = ctx.currentTime;
    const bus = ctx.createGain();
    bus.gain.setValueAtTime(0.0001, t);
    bus.gain.exponentialRampToValueAtTime(1, t + 2.5);
    bus.connect(A.ambGain);
    const a = { city, bus, nodes: [], timer: null };
    const far = 3600 * 6;
    const lfo = (rate, depth, target) => {
      const o = osc('sine', rate, t, t + far, gainTo(target, depth));
      a.nodes.push(o);
    };
    if (city === 'piltover') {
      // Viento suave entre torres.
      const wg = gainTo(bus, 0.05);
      const wf = filt('bandpass', 500, 0.6, wg);
      a.nodes.push(noiseSrc(t, t + far, wf));
      lfo(0.07, 0.035, wg.gain);
      lfo(0.05, 260, wf.frequency);
      // Zumbido hextech, muy limpio y lejano.
      const hg = gainTo(bus, 0.006);
      a.nodes.push(osc('sine', hz(74), t, t + far, hg), osc('sine', hz(81), t, t + far, hg, 3));
      lfo(0.11, 0.005, hg.gain);
    } else {
      // Maquinaria grave de las fábricas.
      const mg = gainTo(bus, 0.07);
      a.nodes.push(noiseSrc(t, t + far, filt('lowpass', 140, 1, mg)));
      a.nodes.push(osc('sawtooth', 46, t, t + far, filt('lowpass', 120, 2, gainTo(bus, 0.03))));
      lfo(0.23, 0.03, mg.gain);
      // Zumbido de tubos de neón que parpadea.
      const ng = gainTo(bus, 0.01);
      const nf = filt('bandpass', 240, 6, ng);
      a.nodes.push(osc('sawtooth', 120, t, t + far, nf), osc('sawtooth', 120.6, t, t + far, nf));
      lfo(7.3, 0.006, ng.gain);
    }
    const events = () => {
      if (A.amb !== a || !A.ctx) return;
      const now = A.ctx.currentTime + 0.05;
      if (city === 'piltover') {
        const r = Math.random();
        if (r < 0.35) chirp(bus, now);
        else if (r < 0.55) [0, 0.9, 1.8].forEach((d, i) => bell(bus, [62, 57, 50][i], now + d, 0.03, 3.5, 2.4, 0.9));
        else if (r < 0.8) for (let i = 0; i < 6; i++) tick(bus, now + i * 0.09, 0.02, 2800 + Math.random() * 1500);
        else steam(bus, now, 0.008, 1.2);
        a.timer = setTimeout(events, 4000 + Math.random() * 7000);
      } else {
        const r = Math.random();
        if (r < 0.5) drip(bus, now);
        else if (r < 0.75) steam(bus, now, 0.03, 0.8 + Math.random() * 1.5);
        else if (r < 0.9) clank(bus, now, 0.03, pick([180, 240, 300]));
        else for (let i = 0; i < 3; i++) drip(bus, now + i * (0.2 + Math.random() * 0.3));
        a.timer = setTimeout(events, 900 + Math.random() * 3500);
      }
    };
    a.timer = setTimeout(events, 1500);
    A.amb = a;
  }

  // Gota que cae en un charco: tono que sube rápido.
  function drip(dest, t) {
    const v = voice(dest, 0.06, t, 0.002, 0, 0.12, 0.6);
    const f = 900 + Math.random() * 900;
    const o = osc('sine', f, t, v.end, v.g);
    o.frequency.exponentialRampToValueAtTime(f * 2.4, t + 0.08);
  }

  // Escape de vapor.
  function steam(dest, t, vol, dur) {
    const v = voice(dest, vol, t, 0.08, dur * 0.4, dur * 0.6, 0.3);
    const f = filt('highpass', 2400, 0.7, v.g);
    f.frequency.setValueAtTime(1600, t);
    f.frequency.linearRampToValueAtTime(3600, t + dur);
    noiseSrc(t, v.end, f);
  }

  // Pájaro o gaviota lejana sobre los tejados de Piltover.
  function chirp(dest, t) {
    for (let i = 0; i < 2 + Math.floor(Math.random() * 3); i++) {
      const s = t + i * 0.16;
      const v = voice(dest, 0.012, s, 0.01, 0.03, 0.08, 0.6);
      const base = 2600 + Math.random() * 900;
      const o = osc('sine', base, s, v.end, v.g);
      o.frequency.exponentialRampToValueAtTime(base * 1.35, s + 0.06);
      o.frequency.exponentialRampToValueAtTime(base * 0.9, s + 0.12);
    }
  }

  // ---------- Efectos de interfaz, distintos en cada ciudad ----------
  function blip(freq, dur = 0.12, type = 'sine', vol = 0.2) {
    const ctx = ensureCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    const v = voice(A.sfxGain, vol, t, 0.004, 0, dur, 0);
    osc(type, freq, t, v.end, v.g);
  }

  const FX = {
    piltover: {
      click: (t) => tick(A.sfxGain, t, 0.35, 4200),
      message: (t) => bell(A.sfxGain, 86, t, 0.08, 0.7, 3.5, 0.3),
      choice: (t) => { pluck(A.sfxGain, 74, t, 0.14, 0.5); bell(A.sfxGain, 81, t + 0.07, 0.07, 0.9, 3.5, 0.3); },
      unlock: (t) => {
        [62, 66, 69, 74, 78].forEach((m, i) => pluck(A.sfxGain, m, t + i * 0.08, 0.12, 1.2));
        brass(A.sfxGain, [62, 69, 74], t + 0.35, 0.9, 0.08);
        bell(A.sfxGain, 86, t + 0.4, 0.06, 2, 3.5, 0.6);
      },
      locked: (t) => { brass(A.sfxGain, [43, 49], t, 0.35, 0.07); tick(A.sfxGain, t, 0.2, 1600); },
    },
    zaun: {
      click: (t) => clank(A.sfxGain, t, 0.14, 640),
      message: (t) => { neon(A.sfxGain, 83, t, 0.06, 0.06); neon(A.sfxGain, 83, t + 0.12, 0.05, 0.025); },
      choice: (t) => {
        const v = voice(A.sfxGain, 0.12, t, 0.003, 0.04, 0.12, 0.2);
        const o = osc('square', 300, t, v.end, filt('lowpass', 2400, 5, v.g));
        o.frequency.exponentialRampToValueAtTime(1100, t + 0.1);
      },
      unlock: (t) => {
        steam(A.sfxGain, t, 0.12, 0.5);
        [64, 67, 71, 76].forEach((m, i) => neon(A.sfxGain, m, t + 0.05 + i * 0.07, 0.15, 0.08));
        kick(A.sfxGain, t + 0.33, 0.5);
        clank(A.sfxGain, t + 0.33, 0.12, 520);
      },
      locked: (t) => {
        const v = voice(A.sfxGain, 0.08, t, 0.005, 0.18, 0.08, 0);
        osc('sawtooth', 92, t, v.end, v.g);
        osc('sawtooth', 97, t, v.end, v.g);
        steam(A.sfxGain, t, 0.04, 0.3);
      },
    },
  };

  const PLAIN = {
    click: () => blip(660, 0.06, 'triangle', 0.12),
    message: () => blip(880, 0.09, 'sine', 0.1),
    choice: () => { blip(523, 0.08, 'triangle', 0.15); setTimeout(() => blip(784, 0.12, 'triangle', 0.15), 70); },
    unlock: () => [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => blip(f, 0.25, 'sine', 0.15), i * 110)),
    locked: () => blip(140, 0.2, 'sawtooth', 0.08),
  };

  const sfx = {};
  for (const name of Object.keys(PLAIN)) {
    sfx[name] = () => {
      const ctx = ensureCtx();
      if (!ctx) return;
      const set = FX[cityOf(A.mood)];
      try { if (set) set[name](ctx.currentTime + 0.01); else PLAIN[name](); } catch { /* sin sonido */ }
    };
  }

  // Pasos: piedra pulida en Piltover, rejillas de metal en Zaun.
  let lastStep = 0;
  function step(city, run = false) {
    const ctx = A.ctx;
    if (!ctx || ctx.state !== 'running' || ctx.currentTime - lastStep < 0.18) return;
    const t = ctx.currentTime + 0.01;
    lastStep = t;
    const vol = (run ? 1.3 : 1) * (0.8 + Math.random() * 0.4);
    if (city === 'zaun') {
      const v = voice(A.sfxGain, 0.05 * vol, t, 0.001, 0.005, 0.07, 0.2);
      noiseSrc(t, v.end, filt('bandpass', 1800 + Math.random() * 900, 2, v.g));
      const r = voice(A.sfxGain, 0.012 * vol, t, 0.001, 0, 0.15, 0.2);
      osc('square', 380 + Math.random() * 120, t, r.end, filt('bandpass', 900, 4, r.g));
    } else {
      const v = voice(A.sfxGain, 0.06 * vol, t, 0.001, 0.005, 0.06, 0.15);
      noiseSrc(t, v.end, filt('bandpass', 700 + Math.random() * 300, 1.2, v.g));
      const b = voice(A.sfxGain, 0.05 * vol, t, 0.001, 0, 0.07, 0);
      const o = osc('sine', 130, t, b.end, b.g);
      o.frequency.exponentialRampToValueAtTime(70, t + 0.06);
    }
  }

  // La app de móvil se calla al irse a segundo plano y vuelve a sonar al regresar.
  const suspend = () => { if (A.ctx && A.ctx.state === 'running') A.ctx.suspend(); };
  const resume = () => { if (A.ctx && A.ctx.state === 'suspended') A.ctx.resume(); };

  window.Audio2 = { configure, sfx, playMusic, stopMusic, previewCity, step, ensureCtx, suspend, resume };
})();
