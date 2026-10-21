// Cinemáticas: secuencias de planos pintados y animados con movimiento de cámara,
// bandas de cine, títulos, subtítulos narrados y retratos que entran en escena.
// Si existe un vídeo propio en la carpeta de arte con el mismo id, se reproduce ese.
(function () {
  let active = null;

  function ease(t) {
    return t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
  }

  // Reproduce un vídeo de la carpeta de arte. Devuelve false si no se puede ver (códec no
  // compatible, archivo dañado o reproducción congelada) para usar la cinemática pintada.
  function playVideo(url) {
    return new Promise((resolve) => {
      const box = document.createElement('div');
      box.className = 'cine';
      const v = document.createElement('video');
      v.src = url;
      v.autoplay = true;
      v.playsInline = true;
      v.preload = 'auto';
      v.className = 'cine-video';
      const skip = document.createElement('button');
      skip.className = 'cine-skip';
      skip.textContent = 'Saltar';
      let lastTime = -1;
      let still = 0;
      let watch = 0;
      const done = (ok = true) => {
        if (!box.isConnected) return;
        clearInterval(watch);
        v.pause();
        v.removeAttribute('src');
        v.load();
        box.remove();
        window.removeEventListener('keydown', key, true);
        resolve(ok);
      };
      const key = (e) => { e.stopPropagation(); if (['Escape', ' ', 'Enter'].includes(e.key)) { e.preventDefault(); done(); } };
      v.onended = () => done();
      v.onerror = () => done(false);
      // Sin imagen (por ejemplo, un vídeo HEVC que el ordenador no sabe decodificar): fuera.
      v.onloadedmetadata = () => { if (!v.videoWidth) done(false); };
      skip.onclick = (e) => { e.stopPropagation(); done(); };
      box.addEventListener('click', () => done());
      // Vigilante: si el vídeo no arranca o se queda congelado unos segundos, se cierra solo.
      watch = setInterval(() => {
        if (v.paused && v.readyState >= 2) v.play().catch(() => {});
        if (v.currentTime === lastTime) still += 0.5;
        else { still = 0; lastTime = v.currentTime; }
        const started = v.currentTime > 0;
        if (still >= (started ? 4 : 8)) done(started);
        if (v.duration && v.currentTime >= v.duration - 0.05) done();
      }, 500);
      window.addEventListener('keydown', key, true);
      box.append(v, skip);
      document.body.append(box);
      v.play().catch(() => { v.muted = true; v.play().catch(() => done(false)); });
    });
  }

  // shots: [{ scene, dur, title, kicker, lines: [], portrait, zoom: [a, b], pan: [[x,y],[x,y]] }]
  async function play(shots, opts = {}) {
    if (active) active.stop();
    const vid = opts.videoId && window.CustomArt?.video(opts.videoId);
    if (vid && (await playVideo(vid))) return undefined;
    if (!shots.length) return undefined;

    return new Promise((resolve) => {
      const box = document.createElement('div');
      box.className = 'cine';
      const canvas = document.createElement('canvas');
      const bars = document.createElement('div');
      bars.className = 'cine-bars';
      const text = document.createElement('div');
      text.className = 'cine-text';
      const portrait = document.createElement('div');
      portrait.className = 'cine-portrait';
      const skip = document.createElement('button');
      skip.className = 'cine-skip';
      skip.textContent = 'Saltar';
      const progress = document.createElement('div');
      progress.className = 'cine-progress';
      box.append(canvas, portrait, bars, text, skip, progress);
      document.body.append(box);
      const ctx = canvas.getContext('2d');

      let idx = -1;
      let shotStart = 0;
      let alive = true;
      let portraitCtl = null;
      const total = shots.reduce((a, s) => a + s.dur, 0);
      let elapsedBefore = 0;

      function fit() {
        const dpr = Math.min(1.5, window.devicePixelRatio || 1);
        const w = Math.floor(window.innerWidth * dpr);
        const h = Math.floor(window.innerHeight * dpr);
        if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
      }

      function startShot(i) {
        if (i > 0) elapsedBefore += shots[i - 1].dur;
        idx = i;
        shotStart = performance.now();
        const s = shots[i];
        text.innerHTML = '';
        text.className = `cine-text ${s.align || ''}`;
        if (s.kicker) text.append(Object.assign(document.createElement('div'), { className: 'cine-kicker', textContent: s.kicker }));
        if (s.title) text.append(Object.assign(document.createElement('h1'), { className: 'cine-title', textContent: s.title }));
        (s.lines || []).forEach((l, k) => {
          const p = document.createElement('p');
          p.className = 'cine-line';
          p.style.animationDelay = `${0.6 + k * 1.6}s`;
          p.textContent = l;
          text.append(p);
        });
        portraitCtl?.stop();
        portrait.innerHTML = '';
        portrait.classList.remove('in');
        if (s.portrait) {
          const p = s.portrait;
          if (p.photo) {
            portrait.append(Object.assign(document.createElement('img'), { src: p.photo, alt: '' }));
          } else {
            const c = document.createElement('canvas');
            c.width = c.height = 520;
            portrait.append(c);
            portraitCtl = Painter.animate(c, p.look, { rim: p.rim, bg: p.bg });
          }
          requestAnimationFrame(() => portrait.classList.add('in'));
        }
        if (s.sfx) Audio2.sfx[s.sfx]?.();
      }

      function finish() {
        if (!alive) return;
        alive = false;
        active = null;
        portraitCtl?.stop();
        window.removeEventListener('keydown', key, true);
        box.classList.add('out');
        setTimeout(() => box.remove(), 500);
        resolve();
      }

      const key = (e) => {
        e.stopPropagation();
        if (e.key === 'Escape' || e.key === 'Enter') { e.preventDefault(); finish(); }
        if (e.key === ' ') { e.preventDefault(); next(); }
      };
      function next() {
        if (idx + 1 < shots.length) startShot(idx + 1);
        else finish();
      }
      skip.onclick = finish;
      box.addEventListener('click', (e) => { if (e.target !== skip) next(); });
      window.addEventListener('keydown', key, true);

      function frame(now) {
        if (!alive) return;
        fit();
        const s = shots[idx];
        const k = Math.min(1, (now - shotStart) / (s.dur * 1000));
        const e = ease(k);
        const z = s.zoom || [1.0, 1.12];
        const pan = s.pan || [[-0.4, 0.2], [0.4, -0.2]];
        Scenes.drawFrame(ctx, s.scene, (now / 1000), canvas.width, canvas.height, {
          zoom: z[0] + (z[1] - z[0]) * e,
          panX: pan[0][0] + (pan[1][0] - pan[0][0]) * e,
          panY: pan[0][1] + (pan[1][1] - pan[0][1]) * e,
        });
        // Fundidos a negro entre planos
        const fadeIn = Math.max(0, 1 - k * s.dur * 1.6);
        const fadeOut = Math.max(0, (k * s.dur - (s.dur - 0.6)) / 0.6);
        const f = Math.max(fadeIn, fadeOut);
        if (f > 0) { ctx.fillStyle = `rgba(0,0,0,${f})`; ctx.fillRect(0, 0, canvas.width, canvas.height); }
        progress.style.width = `${((elapsedBefore + k * s.dur) / total) * 100}%`;
        if (k >= 1) next();
        requestAnimationFrame(frame);
      }

      active = { stop: finish };
      startShot(0);
      requestAnimationFrame(frame);
    });
  }

  // Tarjeta de título de capítulo (un solo plano corto).
  function chapterCard(ch, scene) {
    const [num, name] = ch.title.split(' · ');
    return play([{ scene, dur: 4.5, kicker: num, title: name || ch.title, lines: [ch.intro], zoom: [1.15, 1.0], pan: [[0.3, 0.1], [-0.3, -0.1]], align: 'center' }], { videoId: `capitulo-${ch.id}` });
  }

  window.Cinematic = { play, chapterCard };
})();
