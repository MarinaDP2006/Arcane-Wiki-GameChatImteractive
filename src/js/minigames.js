// Minijuegos: pruebas de fuerza, carrera por pasarelas, plataforma ligera, galería de tiro,
// circuito de Resonancia, calibración de frecuencias y regateo en el mercado.
// Minigames.play(id) abre el minijuego a pantalla completa y resuelve true si se gana.
// Todos comparten un marco común: lienzo nítido en pantallas de alta densidad, cuenta atrás,
// partículas (chispas, humo, brasas), sacudidas de cámara, destellos, viñeta y botones táctiles.
(function () {
  const GAMES = {};
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const TAU = Math.PI * 2;
  // Textos con números (sueltos para que el traductor los encuentre como patrón).
  const streakTxt = (n) => `Racha ×${n}`;
  const goalTxt = (t) => `Objetivo: ${t}`;
  const opt = () => window.App?.settings || {};
  const buzz = (ms) => { try { if (U.touch && opt().vibration !== false) navigator.vibrate?.(ms); } catch { /* sin vibración */ } };
  // Dificultad de Ajustes: fácil da una ventaja más, difícil quita una.
  const DIFF = { facil: 1, normal: 0, dificil: -1 };
  const reduced = () => Boolean(opt().reduceMotion);

  // ---------- Emblemas (iconos de línea dorada) ----------
  const EMBLEM = {
    foso: '<path d="M22 40V27q0-4 4-4h3v-3q0-3 3-3t3 3v3h1v-4q0-3 3-3t3 3v4h1v-2q0-3 3-3t3 3v11q0 9-9 12h-9q-9-3-9-12z"/><path d="M29 23v7M35 22v8M41 23v7"/>',
    tejados: '<path d="M12 50h40M16 50V34l10-8 10 8v16M40 50V24h7v26"/><path d="M43 20q-4-4 0-8t0-8" opacity=".7"/>',
    aerotabla: '<path d="M12 40q20 6 40 0l-3 5q-17 4-34 0z"/><path d="M22 44l-4 8M42 44l4 8" opacity=".7"/><circle cx="32" cy="24" r="6"/><path d="M32 30v8M26 34h12"/>',
    tiro: '<circle cx="32" cy="32" r="16"/><circle cx="32" cy="32" r="6"/><path d="M32 8v10M32 46v10M8 32h10M46 32h10"/>',
    circuito: '<circle cx="32" cy="32" r="9"/><path d="M32 12v8M32 44v8M12 32h8M44 32h8M18 18l6 6M40 40l6 6M46 18l-6 6M18 46l6-6"/>',
    runas: '<path d="M32 10l19 11v22L32 54 13 43V21z"/><path d="M27 22v20M27 22l10 6-10 6 10 8"/>',
    regateo: '<ellipse cx="32" cy="44" rx="14" ry="4"/><path d="M18 44v-6M46 44v-6"/><ellipse cx="32" cy="38" rx="14" ry="4"/><path d="M18 38v-6M46 38v-6"/><ellipse cx="32" cy="32" rx="14" ry="4"/><path d="M28 22q4-6 8 0" opacity=".7"/>',
  };
  const emblem = (id) => `<svg class="mg-emblem" viewBox="0 0 64 64" aria-hidden="true"><path class="mg-emblem-hex" d="M32 2l26 15v30L32 62 6 47V17z"/><g>${EMBLEM[id] || ''}</g></svg>`;

  // ---------- Efectos compartidos ----------
  // Sprite de brillo por color (se dibuja con mezcla aditiva).
  const glowCache = new Map();
  function glowSprite(col) {
    if (glowCache.has(col)) return glowCache.get(col);
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const g = c.getContext('2d');
    const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grd.addColorStop(0, '#fff');
    grd.addColorStop(0.18, col);
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = grd;
    g.fillRect(0, 0, 64, 64);
    glowCache.set(col, c);
    return c;
  }

  function makeFX() {
    const parts = [];
    const texts = [];
    const rings = [];
    const S = { shake: 0, flash: 0, flashCol: '255,255,255', hurt: 0, slow: 0, stop: 0, frame: 0, fx: 0, fy: 0, frameCol: '255,255,255' };
    return {
      // kind: spark (estela), dot (punto brillante), smoke (humo suave), shard (esquirla que gira)
      burst(x, y, n, o = {}) {
        for (let i = 0; i < n; i++) {
          const a = o.angle != null ? o.angle + (Math.random() - 0.5) * (o.spread ?? TAU) : Math.random() * TAU;
          const sp = (o.speed ?? 240) * (0.35 + Math.random() * 0.9);
          parts.push({
            x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 1, decay: (1 / (o.life ?? 0.6)) * (0.7 + Math.random() * 0.6),
            size: (o.size ?? 3) * (0.6 + Math.random() * 0.8), col: Array.isArray(o.color) ? pick(o.color) : o.color || '#ffe08a',
            g: o.gravity ?? 420, kind: o.kind || 'spark', drag: o.drag ?? 2, rot: Math.random() * TAU, vr: (Math.random() - 0.5) * 14,
          });
        }
      },
      text(x, y, txt, col = '#ffe08a', size = 30) { texts.push({ x, y, txt, col, size, life: 1 }); },
      // Golpe al estilo de la serie: salpicadura de pintura, trazos de pincel que salen disparados,
      // onda expansiva y, si es fuerte, un fotograma de impacto con rayos y una pausa breve.
      impact(x, y, o = {}) {
        const cols = o.colors || ['#e0457b', '#3fd0ff', '#ffe08a'];
        const k = o.power ?? 1;
        this.burst(x, y, Math.round(14 * k), { color: cols, kind: 'paint', speed: 420 * k, life: 0.9, size: 5 * k, gravity: 600, drag: 3 });
        this.burst(x, y, Math.round(10 * k), { color: o.stroke || '#fff6e0', kind: 'stroke', speed: 1100 * k, life: 0.22, size: 4 * k, gravity: 0, drag: 7 });
        rings.push({ x, y, r: 8, max: 120 * k, life: 1, col: o.ring || cols[0] });
        if (k >= 1 && !reduced()) { S.frame = 0.09; S.fx = x; S.fy = y; S.frameCol = o.frameCol || '255,246,224'; }
        if (o.stop ?? k >= 1) S.stop = Math.max(S.stop, 0.06 * k);
      },
      stopped() { return S.stop > 0; },
      shake(v) { S.shake = Math.max(S.shake, v * (opt().shake ?? 1)); },
      flash(a = 0.5, col = '255,255,255') { S.flash = Math.max(S.flash, a); S.flashCol = col; },
      hurt(a = 1) { S.hurt = Math.max(S.hurt, a); },
      update(dt) {
        for (const p of parts) {
          const k = Math.max(0, 1 - p.drag * dt);
          p.vx *= k; p.vy *= k;
          p.vy += p.g * dt;
          p.x += p.vx * dt; p.y += p.vy * dt;
          p.rot += p.vr * dt;
          p.life -= p.decay * dt;
        }
        for (let i = parts.length - 1; i >= 0; i--) if (parts[i].life <= 0) parts.splice(i, 1);
        if (parts.length > 700) parts.splice(0, parts.length - 700);
        for (const t of texts) { t.y -= 46 * dt; t.life -= dt * 1.25; }
        for (let i = texts.length - 1; i >= 0; i--) if (texts[i].life <= 0) texts.splice(i, 1);
        for (const r of rings) { r.life -= dt * 3.2; r.r += (r.max - r.r) * Math.min(1, dt * 14); }
        for (let i = rings.length - 1; i >= 0; i--) if (rings[i].life <= 0) rings.splice(i, 1);
        S.stop = Math.max(0, S.stop - dt);
        S.frame = Math.max(0, S.frame - dt);
        S.shake = Math.max(0, S.shake - dt * 40);
        S.flash = Math.max(0, S.flash - dt * 2.6);
        S.hurt = Math.max(0, S.hurt - dt * 1.6);
      },
      offset() { return S.shake ? [(Math.random() - 0.5) * S.shake, (Math.random() - 0.5) * S.shake] : [0, 0]; },
      draw(ctx, w, h) {
        ctx.save();
        for (const p of parts) {
          const a = Math.max(0, Math.min(1, p.life));
          if (p.kind === 'paint') {
            // Mancha de pintura: gota principal con salpicaduras alrededor
            ctx.globalCompositeOperation = 'source-over';
            ctx.globalAlpha = Math.min(1, a * 1.6);
            ctx.fillStyle = p.col;
            ctx.beginPath(); ctx.ellipse(p.x, p.y, p.size * 1.3, p.size * (0.8 + Math.abs(Math.sin(p.rot)) * 0.5), p.rot, 0, TAU); ctx.fill();
            for (let k = 0; k < 3; k++) {
              const ang = p.rot + k * 2.1;
              ctx.beginPath(); ctx.arc(p.x + Math.cos(ang) * p.size * 1.7, p.y + Math.sin(ang) * p.size * 1.7, p.size * (0.25 + k * 0.12), 0, TAU); ctx.fill();
            }
            continue;
          }
          if (p.kind === 'stroke') {
            // Trazo de pincel afilado en la dirección del movimiento
            ctx.globalCompositeOperation = 'source-over';
            ctx.globalAlpha = a;
            const len = Math.hypot(p.vx, p.vy) * 0.07 + p.size * 3;
            const ang = Math.atan2(p.vy, p.vx);
            ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(ang);
            ctx.fillStyle = p.col;
            ctx.beginPath(); ctx.moveTo(0, -p.size * 0.6); ctx.quadraticCurveTo(-len * 0.4, -p.size * 0.3, -len, 0); ctx.quadraticCurveTo(-len * 0.4, p.size * 0.3, 0, p.size * 0.6); ctx.closePath(); ctx.fill();
            ctx.restore();
            continue;
          }
          if (p.kind === 'smoke') {
            ctx.globalCompositeOperation = 'source-over';
            ctx.globalAlpha = a * 0.35;
            ctx.fillStyle = p.col;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.size * (2.5 - a * 1.5), 0, TAU); ctx.fill();
            continue;
          }
          ctx.globalCompositeOperation = 'lighter';
          ctx.globalAlpha = a;
          if (p.kind === 'spark') {
            ctx.strokeStyle = p.col;
            ctx.lineWidth = p.size * 0.6;
            ctx.lineCap = 'round';
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - p.vx * 0.04, p.y - p.vy * 0.04); ctx.stroke();
          } else if (p.kind === 'shard') {
            ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
            ctx.fillStyle = p.col;
            ctx.beginPath(); ctx.moveTo(0, -p.size * 1.6); ctx.lineTo(p.size, 0); ctx.lineTo(0, p.size * 1.6); ctx.lineTo(-p.size, 0); ctx.fill();
            ctx.restore();
          }
          const s = p.size * (p.kind === 'dot' ? 6 : 3.5);
          ctx.drawImage(glowSprite(p.col), p.x - s / 2, p.y - s / 2, s, s);
        }
        ctx.globalCompositeOperation = 'source-over';
        for (const r of rings) {
          ctx.globalAlpha = Math.max(0, r.life);
          ctx.strokeStyle = r.col;
          ctx.lineWidth = 5 * r.life + 1;
          ctx.beginPath(); ctx.ellipse(r.x, r.y, r.r, r.r * 0.8, 0, 0, TAU); ctx.stroke();
        }
        ctx.globalAlpha = 1;
        if (S.frame) {
          // Fotograma de impacto: la escena se oscurece y salen rayos de pincel desde el golpe
          ctx.fillStyle = 'rgba(12,6,16,0.45)';
          ctx.fillRect(0, 0, w, h);
          ctx.fillStyle = `rgba(${S.frameCol},0.85)`;
          const R = Math.max(w, h);
          for (let i = 0; i < 22; i++) {
            const ang = (i / 22) * TAU + (i % 3) * 0.07;
            const r0 = 40 + (i % 4) * 18;
            ctx.beginPath();
            ctx.moveTo(S.fx + Math.cos(ang - 0.012) * r0, S.fy + Math.sin(ang - 0.012) * r0);
            ctx.lineTo(S.fx + Math.cos(ang) * R, S.fy + Math.sin(ang) * R);
            ctx.lineTo(S.fx + Math.cos(ang + 0.012) * r0, S.fy + Math.sin(ang + 0.012) * r0);
            ctx.fill();
          }
        }
        for (const t of texts) {
          const k = t.life > 0.85 ? 1 + (t.life - 0.85) * 3 : 1;
          ctx.globalAlpha = Math.min(1, t.life * 1.6);
          ctx.font = `700 ${Math.round(t.size * k)}px Cinzel, Georgia, serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.lineWidth = 5;
          ctx.strokeStyle = 'rgba(10,6,4,0.85)';
          ctx.strokeText(t.txt, t.x, t.y);
          ctx.shadowColor = t.col;
          ctx.shadowBlur = 16;
          ctx.fillStyle = t.col;
          ctx.fillText(t.txt, t.x, t.y);
          ctx.shadowBlur = 0;
        }
        ctx.globalAlpha = 1;
        if (S.hurt) {
          const v = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.25, w / 2, h / 2, Math.max(w, h) * 0.7);
          v.addColorStop(0, 'rgba(160,0,20,0)');
          v.addColorStop(1, `rgba(160,0,20,${0.55 * S.hurt})`);
          ctx.fillStyle = v;
          ctx.fillRect(0, 0, w, h);
        }
        if (S.flash) { ctx.fillStyle = `rgba(${S.flashCol},${S.flash})`; ctx.fillRect(0, 0, w, h); }
        ctx.restore();
      },
    };
  }

  // Viñeta y polvo de luz por encima de todo (da profundidad y tono cinematográfico).
  let vigCache = null;
  function vignette(ctx, w, h) {
    if (!vigCache || vigCache.w !== w || vigCache.h !== h) {
      const c = document.createElement('canvas');
      c.width = w; c.height = h;
      const g = c.getContext('2d');
      const v = g.createRadialGradient(w / 2, h * 0.45, Math.min(w, h) * 0.3, w / 2, h / 2, Math.max(w, h) * 0.75);
      v.addColorStop(0, 'rgba(0,0,0,0)');
      v.addColorStop(1, 'rgba(0,0,0,0.6)');
      g.fillStyle = v;
      g.fillRect(0, 0, w, h);
      vigCache = { w, h, c };
    }
    ctx.drawImage(vigCache.c, 0, 0);
  }

  // ---------- Marco común ----------
  let FX = makeFX();
  function play(id, opts = {}) {
    const def = GAMES[id];
    if (!def) return Promise.resolve(true);
    return new Promise((resolve) => {
      const box = document.createElement('div');
      box.className = `mg mg-${id}`;
      const bg = document.createElement('canvas');
      bg.className = 'mg-bg';
      const stage = document.createElement('div');
      stage.className = 'mg-stage';
      const hud = document.createElement('div');
      hud.className = 'mg-hud';
      const canvas = document.createElement('canvas');
      canvas.className = 'mg-canvas';
      stage.append(hud, canvas);
      box.append(bg, stage);
      document.body.append(box);
      // Fondo de la sala: el lugar desde el que se juega (si se pasa opts.place) o el del juego.
      const sceneCtl = Scenes.mount(bg, opts.place && Scenes.has(opts.place) ? opts.place : def.scene);
      // Fondo de juego original con profundidad. Desde el mapa se reutiliza la escena de la ciudad.
      const placeArt = opts.place && window.Depth && Depth.pool([opts.place]).length ? [opts.place] : null;
      const bd = def.backdrops && window.Depth ? Depth.backdrop(placeArt || def.backdrops, { grade: def.grade, scene: def.scene }) : null;
      const ctx = canvas.getContext('2d');
      let game = null;
      let running = false;
      let last = 0;
      let count = 0; // cuenta atrás antes de empezar
      let W = 0;
      let H = 0;
      let dpr = 1;
      const keys = new Set();
      const pressed = [];
      const mouse = { x: 0, y: 0, clicks: [], down: false };

      // Cámara del fondo: la del juego o, si no tiene, una que sigue suavemente al puntero.
      const camSm = { x: 0, y: 0 };
      function camera() {
        const c = game.cam?.();
        if (c) return c;
        camSm.x += ((mouse.x / (W || 1) - 0.5) * 0.7 - camSm.x) * 0.05;
        camSm.y += ((mouse.y / (H || 1) - 0.5) * 0.5 - camSm.y) * 0.05;
        return { x: camSm.x, y: camSm.y, zoom: 1.05 };
      }

      function size() {
        const r = stage.getBoundingClientRect();
        // Limit the pixel fill-rate on high-density tablets and avoid redundant resizes.
        dpr = Math.min(1.5, window.devicePixelRatio || 1);
        W = Math.max(1, Math.floor(r.width));
        H = Math.max(1, Math.floor(r.height - hud.offsetHeight));
        const pixelW = Math.round(W * dpr), pixelH = Math.round(H * dpr);
        if (canvas.width !== pixelW) canvas.width = pixelW;
        if (canvas.height !== pixelH) canvas.height = pixelH;
        canvas.style.height = `${H}px`;
      }

      function card(title, html, buttons, cls = '') {
        const c = document.createElement('div');
        c.className = `mg-card panel ${cls}`;
        c.innerHTML = `${emblem(id)}<h2>${title}</h2>${html}`;
        const row = document.createElement('div');
        row.className = 'row gap center';
        for (const [label, bcls, fn] of buttons) {
          const b = document.createElement('button');
          b.className = `btn ${bcls}`;
          b.textContent = label;
          b.onclick = fn;
          row.append(b);
        }
        c.append(row);
        stage.append(c);
        setTimeout(() => c.querySelector('.btn.primary')?.focus({ preventScroll: true }), 50);
        return c;
      }

      function intro() {
        const c = card(def.title, `<p>${def.desc}</p><p class="mg-ctrl"><b>Controles:</b> ${(U.touch && def.touchControls) || def.controls}</p><p class="mg-goal">${goalTxt(def.goal)}</p>${opts.bonus ? `<p class="mg-bonus">Tus habilidades te dan ventaja +${opts.bonus} en este minijuego.</p>` : ''}`,
          [['¡Empezar!', 'primary hex-btn', () => { c.remove(); start(); }], ['Salir', 'ghost', () => close(false)]]);
      }

      function start() {
        size();
        FX = makeFX();
        game = def.create(W, H, { ...opts, bd, bonus: (opts.bonus || 0) + (DIFF[opt().difficulty] || 0) });
        running = true;
        count = 2.6;
        last = performance.now();
        Audio2.sfx.choice();
        requestAnimationFrame(loop);
      }

      function countdown() {
        const n = Math.ceil(count - 0.6);
        const txt = n > 0 ? String(n) : '¡YA!';
        const f = (count - 0.6) % 1;
        const k = n > 0 ? 1 + (f < 0 ? 0 : f) * 0.6 : 1 + (0.6 - count) * 1.2;
        ctx.save();
        ctx.fillStyle = `rgba(5,4,10,${Math.min(0.45, count * 0.3)})`;
        ctx.fillRect(0, 0, W, H);
        ctx.globalAlpha = n > 0 ? Math.min(1, 0.3 + (f < 0 ? 1 : f) * 1.2) : Math.max(0, count / 0.6);
        ctx.font = `700 ${Math.round(Math.min(W, H) * 0.22 * k)}px Cinzel, Georgia, serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.lineWidth = 8;
        ctx.strokeStyle = 'rgba(20,12,4,0.9)';
        ctx.strokeText(txt, W / 2, H / 2);
        ctx.shadowColor = '#ffcf6a';
        ctx.shadowBlur = 40;
        const grd = ctx.createLinearGradient(0, H / 2 - 80, 0, H / 2 + 80);
        grd.addColorStop(0, '#fff6d8'); grd.addColorStop(0.5, '#f0c860'); grd.addColorStop(1, '#a8742a');
        ctx.fillStyle = grd;
        ctx.fillText(txt, W / 2, H / 2);
        ctx.restore();
      }

      function loop(now) {
        if (!running) return;
        // La cuenta atrás usa tiempo real (aunque el equipo vaya lento); el juego, pasos cortos.
        const raw = Math.max(0, Math.min(0.25, (now - last) / 1000));
        const dt = Math.min(0.05, raw);
        last = now;
        // Durante la pausa de impacto las pulsaciones esperan a que siga el juego.
        const hold = count <= 0 && FX.stopped();
        const input = { keys, pressed: hold ? [] : pressed.splice(0), mouse: { ...mouse, clicks: hold ? [] : mouse.clicks.splice(0) } };
        if (count > 0) {
          const before = Math.ceil(count - 0.6);
          count -= raw;
          if (Math.ceil(count - 0.6) !== before) { Audio2.sfx.click(); buzz(15); }
        } else if (!FX.stopped()) game.update(dt, input);
        FX.update(dt);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, W, H);
        const [ox, oy] = FX.offset();
        ctx.save();
        ctx.translate(ox, oy);
        if (bd) bd.draw(ctx, W, H, camera(), now / 1000);
        game.draw(ctx, now / 1000);
        FX.draw(ctx, W, H);
        ctx.restore();
        vignette(ctx, W, H);
        if (count > 0) countdown();
        // Avoid rebuilding the HUD subtree on every animation frame when unchanged.
        const nextHud = game.hud();
        if (hud.innerHTML !== nextHud) hud.innerHTML = nextHud;
        if (game.result != null) {
          running = false;
          if (game.result) { FX.flash(0.6, '255,236,180'); buzz(40); } else { FX.hurt(1); buzz([30, 40, 30]); }
          // Unos fotogramas más para que se vean el destello y las partículas finales.
          const end = performance.now() + 650;
          const tail = (t) => {
            const d = Math.max(0, Math.min(0.05, (t - last) / 1000));
            last = t;
            FX.update(d);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, W, H);
            if (bd) bd.draw(ctx, W, H, camera(), t / 1000);
            game.draw(ctx, t / 1000);
            FX.draw(ctx, W, H);
            vignette(ctx, W, H);
            if (t < end && box.isConnected) requestAnimationFrame(tail);
            else result(game.result);
          };
          requestAnimationFrame(tail);
          return;
        }
        requestAnimationFrame(loop);
      }

      function result(win) {
        if (win) Audio2.sfx.unlock(); else Audio2.sfx.locked();
        const c = card(win ? '¡Victoria!' : 'Derrota', `<p>${win ? def.winText : def.loseText}</p>`,
          win ? [['Continuar', 'primary', () => close(true)]]
            : [['Reintentar', 'primary', () => { c.remove(); start(); }], ['Rendirse', 'ghost', () => close(false)]], win ? 'mg-win' : 'mg-lose');
      }

      function close(win) {
        running = false;
        sceneCtl.stop();
        window.removeEventListener('keydown', kd, true);
        window.removeEventListener('keyup', ku, true);
        window.removeEventListener('pointerup', up);
        window.removeEventListener('pointercancel', up);
        box.classList.add('out');
        setTimeout(() => box.remove(), 300);
        resolve(win);
      }

      const kd = (e) => {
        e.stopPropagation();
        const k = e.key.toLowerCase();
        if (k === 'escape') { e.preventDefault(); if (running) { running = false; result(false); } return; }
        if (running && [' ', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(k)) e.preventDefault();
        if (!keys.has(k)) pressed.push(k);
        keys.add(k);
      };
      const ku = (e) => { e.stopPropagation(); keys.delete(e.key.toLowerCase()); };
      window.addEventListener('keydown', kd, true);
      window.addEventListener('keyup', ku, true);
      const pos = (e) => { const r = canvas.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; };
      // Eventos de puntero: valen igual para ratón y para dedo (móvil).
      canvas.addEventListener('pointermove', pos);
      canvas.addEventListener('pointerdown', (e) => { e.preventDefault(); pos(e); mouse.down = true; mouse.clicks.push({ x: mouse.x, y: mouse.y }); });
      const up = () => { mouse.down = false; };
      window.addEventListener('pointerup', up);
      window.addEventListener('pointercancel', up);

      // En pantallas táctiles, los minijuegos de teclado llevan botones grandes.
      if (U.touch && def.touchKeys) {
        const pad = document.createElement('div');
        pad.className = `mg-pad ${def.touchLayout || ''}`;
        for (const [k, label] of def.touchKeys) {
          const b = document.createElement('button');
          b.className = 'mg-pad-btn';
          b.innerHTML = `<span>${label}</span>`;
          b.addEventListener('pointerdown', (e) => {
            e.preventDefault();
            b.setPointerCapture?.(e.pointerId);
            if (!keys.has(k)) pressed.push(k);
            keys.add(k);
            b.classList.remove('ripple');
            void b.offsetWidth;
            b.classList.add('on', 'ripple');
            buzz(10);
          });
          const off = () => { keys.delete(k); b.classList.remove('on'); };
          b.addEventListener('pointerup', off);
          b.addEventListener('pointercancel', off);
          b.addEventListener('lostpointercapture', off);
          pad.append(b);
        }
        stage.append(pad);
      }

      intro();
    });
  }

  // Medidor de latón con brillo y marcas.
  function bar(label, v, max, color) {
    const p = Math.max(0, Math.min(100, (v / max) * 100));
    return `<span class="mg-meter${p < 25 ? ' low' : ''}"><b>${label}</b><span class="mg-track"><i style="width:${p}%;--c:${color}"></i></span></span>`;
  }

  function glowText(ctx, text, x, y, size, color, font = 'Cinzel, Georgia, serif') {
    ctx.save();
    ctx.font = `bold ${size}px ${font}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineWidth = Math.max(3, size / 9);
    ctx.strokeStyle = 'rgba(8,6,4,0.8)';
    ctx.strokeText(text, x, y);
    ctx.shadowColor = color;
    ctx.shadowBlur = 18;
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
    ctx.restore();
  }

  function hexPath(ctx, x, y, r, rot = 0) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = rot + (Math.PI / 3) * i;
      ctx[i ? 'lineTo' : 'moveTo'](x + Math.cos(a) * r, y + Math.sin(a) * r);
    }
    ctx.closePath();
  }

  // Plataforma de mantenimiento (sin piloto): tabla curvada de chapa y madera, núcleo verde
  // que late, aletas traseras y dos toberas cuyo chorro crece al acelerar.
  function drawHoverboard(ctx, x, y, t, o = {}) {
    const s = o.scale || 1;
    ctx.save();
    ctx.translate(x, y + Math.sin(t * 6) * 2);
    ctx.rotate(o.tilt || 0);
    ctx.scale(s, s);
    // Resplandor bajo la tabla y chorros
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = 0.55 + Math.sin(t * 9) * 0.1;
    ctx.drawImage(glowSprite('#5affd0'), -46, 2, 92, 34);
    const jet = (o.thrust ? 1 : 0.45) * (0.85 + Math.random() * 0.3);
    for (const jy of [3, 9]) {
      const jg = ctx.createLinearGradient(-38, 0, -38 - 46 * jet, 0);
      jg.addColorStop(0, 'rgba(220,255,245,0.95)'); jg.addColorStop(0.3, 'rgba(90,255,208,0.7)'); jg.addColorStop(1, 'rgba(90,255,208,0)');
      ctx.fillStyle = jg;
      ctx.beginPath(); ctx.moveTo(-36, jy - 3); ctx.quadraticCurveTo(-38 - 30 * jet, jy - 4, -38 - 46 * jet, jy); ctx.quadraticCurveTo(-38 - 30 * jet, jy + 4, -36, jy + 3); ctx.fill();
    }
    ctx.restore();
    // Aletas traseras
    ctx.fillStyle = '#2a3a34';
    ctx.beginPath(); ctx.moveTo(-30, 0); ctx.lineTo(-40, -12); ctx.lineTo(-24, -2); ctx.closePath(); ctx.fill();
    // Casco de la tabla con morro levantado
    const deck = new Path2D('M-36 2 Q-38 -2 -32 -3 L22 -3 Q34 -4 40 -12 Q44 -6 38 2 Q30 10 18 10 L-28 10 Q-36 9 -36 2 Z');
    const dg = ctx.createLinearGradient(0, -12, 0, 10);
    dg.addColorStop(0, '#8a6a3a'); dg.addColorStop(0.35, '#5a3e22'); dg.addColorStop(0.36, '#2a3a34'); dg.addColorStop(1, '#0e1612');
    ctx.fillStyle = dg; ctx.fill(deck);
    ctx.lineWidth = 1.4; ctx.strokeStyle = '#d8aa50'; ctx.stroke(deck);
    // Vetas de la madera y remaches
    ctx.strokeStyle = 'rgba(30,18,8,0.5)'; ctx.lineWidth = 0.8;
    for (const vx of [-24, -12, 0, 12]) { ctx.beginPath(); ctx.moveTo(vx, -3); ctx.lineTo(vx + 3, 1); ctx.stroke(); }
    ctx.fillStyle = '#f0d080';
    for (const rx of [-30, -6, 18]) { ctx.beginPath(); ctx.arc(rx, 6, 1.2, 0, TAU); ctx.fill(); }
    // Pintura de la brigada de mantenimiento: franja y tres puntos
    ctx.fillStyle = '#5affd0';
    ctx.fillRect(-20, 4, 26, 2);
    for (const px of [10, 14, 18]) { ctx.beginPath(); ctx.arc(px, 5, 1, 0, TAU); ctx.fill(); }
    // Núcleo que late
    const pulse = 0.7 + Math.sin(t * 8) * 0.3;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = pulse;
    ctx.drawImage(glowSprite('#7affd0'), -16, -8, 32, 32);
    ctx.restore();
    ctx.fillStyle = '#c8fff0';
    ctx.beginPath(); ctx.arc(0, 8, 3.2, 0, TAU); ctx.fill();
    ctx.restore();
  }

  // Plataforma ligera de mantenimiento (sin piloto): tabla con colas levantadas, marcas de Resonancia,
  // ruedas que giran y una voltereta (kickflip) cuando se hace el doble salto.
  function drawSkate(ctx, x, y, t, o = {}) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(o.tilt || 0);
    ctx.scale(o.scale || 1, o.scale || 1);
    const flip = Math.cos((o.flip || 0) * TAU);
    // Ruedas y ejes (la base es el suelo)
    const wheels = (wx) => {
      ctx.fillStyle = '#6a6a74'; ctx.fillRect(wx - 6, -9 * Math.abs(flip) - 3, 12, 3);
      ctx.save(); ctx.translate(wx, -4);
      ctx.fillStyle = '#3fd0ff'; ctx.beginPath(); ctx.arc(0, 0, 4.2, 0, TAU); ctx.fill();
      ctx.strokeStyle = '#0e2a3a'; ctx.lineWidth = 1.2; ctx.rotate(o.spin || 0);
      ctx.beginPath(); ctx.moveTo(-3, 0); ctx.lineTo(3, 0); ctx.moveTo(0, -3); ctx.lineTo(0, 3); ctx.stroke();
      ctx.restore();
    };
    if (flip > 0) { wheels(-18); wheels(18); }
    // Tabla: se aplasta y se da la vuelta durante la voltereta
    ctx.save();
    ctx.translate(0, -12);
    ctx.scale(1, Math.max(0.12, Math.abs(flip)) * Math.sign(flip || 1));
    const deck = new Path2D('M-30 -4 Q-36 -10 -34 -12 Q-30 -9 -26 -2 L26 -2 Q30 -9 34 -12 Q36 -10 30 -4 Q28 3 22 3 L-22 3 Q-28 3 -30 -4 Z');
    ctx.fillStyle = flip > 0 ? '#2a1a3a' : '#1a2a5a';
    ctx.fill(deck);
    ctx.save();
    ctx.clip(deck);
    if (flip > 0) {
      // Marcas de Resonancia: zigzag rosa, nube azul y símbolos geométricos
      ctx.strokeStyle = '#ff4aa0'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(-26, 0); for (let i = 0; i < 9; i++) ctx.lineTo(-24 + i * 6, i % 2 ? -4 : 1); ctx.stroke();
      ctx.fillStyle = '#3fd0ff';
      ctx.beginPath(); ctx.arc(14, -1, 3, 0, TAU); ctx.arc(18, -2, 2.4, 0, TAU); ctx.arc(10, -1, 2, 0, TAU); ctx.fill();
      ctx.fillStyle = '#ffe08a'; ctx.beginPath(); ctx.arc(-6, -1, 1.2, 0, TAU); ctx.arc(-2, -1, 1.2, 0, TAU); ctx.fill();
    } else {
      ctx.fillStyle = '#ff4aa0'; for (let i = -30; i < 30; i += 10) ctx.fillRect(i, -6, 4, 12);
    }
    ctx.restore();
    ctx.lineWidth = 1.2; ctx.strokeStyle = '#ff7ab8'; ctx.stroke(deck);
    ctx.restore();
    if (flip <= 0) { wheels(-18); wheels(18); }
    ctx.restore();
  }

  // Placa metálica con biselado (fondos de piezas, botones dibujados).
  function plate(ctx, x, y, w, h, o = {}) {
    const c = o.cut ?? 8;
    ctx.beginPath();
    ctx.moveTo(x + c, y); ctx.lineTo(x + w - c, y); ctx.lineTo(x + w, y + c); ctx.lineTo(x + w, y + h - c);
    ctx.lineTo(x + w - c, y + h); ctx.lineTo(x + c, y + h); ctx.lineTo(x, y + h - c); ctx.lineTo(x, y + c); ctx.closePath();
    const g = ctx.createLinearGradient(x, y, x, y + h);
    g.addColorStop(0, o.top || '#3a3040'); g.addColorStop(1, o.bot || '#16121c');
    ctx.fillStyle = g;
    ctx.fill();
    ctx.lineWidth = o.lw || 1.5;
    ctx.strokeStyle = o.edge || 'rgba(227,196,90,0.55)';
    ctx.stroke();
    if (o.rivets) {
      ctx.fillStyle = 'rgba(227,196,90,0.6)';
      for (const [rx, ry] of [[x + c + 3, y + 5], [x + w - c - 3, y + 5], [x + c + 3, y + h - 5], [x + w - c - 3, y + h - 5]]) { ctx.beginPath(); ctx.arc(rx, ry, 1.8, 0, TAU); ctx.fill(); }
    }
  }

  // Retrato pintado como imagen (para rivales y personajes de los minijuegos).
  const imgs = new Map();
  function paintedImg(look, rim, bg) {
    const key = JSON.stringify([look, rim, bg]);
    if (!imgs.has(key)) {
      const i = new Image();
      i.src = Painter.toURL(look, { rim, bg, size: 256 });
      imgs.set(key, i);
    }
    return imgs.get(key);
  }

  // Siluetas de edificios (fondo con paralaje para los juegos de Nácar).
  function skyline(seed, n, minH, maxH) {
    let a = seed;
    const r = () => { a = (a * 9301 + 49297) % 233280; return a / 233280; };
    const out = [];
    let x = 0;
    for (let i = 0; i < n; i++) {
      const w = 40 + r() * 90;
      out.push({ x, w, h: minH + r() * (maxH - minH), win: Array.from({ length: 12 }, () => r() < 0.3), tank: r() < 0.25, pipe: r() < 0.3 });
      x += w + r() * 12;
    }
    return { list: out, len: x };
  }
  function drawSkyline(ctx, sk, off, base, col, winCol, h) {
    const len = sk.len;
    for (const b of sk.list) {
      let x = ((b.x - off) % len + len) % len - 120;
      for (let rep = 0; rep < 2; rep++, x += len) {
        if (x > ctx.canvas.width) continue;
        ctx.fillStyle = col;
        ctx.fillRect(x, base - b.h, b.w, b.h + h);
        if (b.tank) { ctx.fillRect(x + b.w * 0.3, base - b.h - 18, 16, 14); ctx.fillRect(x + b.w * 0.3 + 3, base - b.h - 4, 2, 4); }
        if (b.pipe) ctx.fillRect(x + b.w - 10, base - b.h - 30, 6, 30);
        if (winCol) {
          ctx.fillStyle = winCol;
          b.win.forEach((on, k) => { if (on) ctx.fillRect(x + 6 + (k % 3) * (b.w / 3.2), base - b.h + 10 + Math.floor(k / 3) * 22, 6, 9); });
        }
      }
    }
  }

  // Oscurece el centro para que el tablero se lea y deja respirar el arte de los bordes.
  function stageLight(ctx, w, h, t, o = {}) {
    const v = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.15, w / 2, h / 2, Math.max(w, h) * 0.6);
    v.addColorStop(0, `rgba(6,5,10,${o.center ?? 0.55})`);
    v.addColorStop(1, `rgba(6,5,10,${o.edge ?? 0.12})`);
    ctx.fillStyle = v;
    ctx.fillRect(0, 0, w, h);
    Depth.rays(ctx, w, h, t, { x: o.rayX ?? 0.8, color: o.ray || '255,220,160', alpha: 0.07 });
    Depth.fog(ctx, w, h, t, { color: o.fog || '200,190,220', y0: 0.6, y1: 1, alpha: 0.07 });
  }

  // ---------- 1. Pelea en el foso (reflejos) ----------
  const ARROWS = { arrowup: '▲', arrowdown: '▼', arrowleft: '◀', arrowright: '▶' };
  const ARROW_ANG = { arrowup: -Math.PI / 2, arrowdown: Math.PI / 2, arrowleft: Math.PI, arrowright: 0 };
  GAMES.foso = {
    touchKeys: [['arrowup', '▲'], ['arrowleft', '◀'], ['arrowdown', '▼'], ['arrowright', '▶']], touchLayout: 'dpad',
    title: 'Prueba de fuerza', icon: '', scene: 'canal-cobre', grade: 'foso', backdrops: ['canal-cobre', 'mercado-nacar', 'galerias', 'nacar'],
    desc: 'La multitud ruge. Tu rival ataca rápido: responde con la flecha correcta antes de que el anillo se cierre para esquivar y contraatacar.',
    controls: 'Flechas del teclado (o W A S D).', touchControls: 'Pulsa la flecha que aparece con los botones de la derecha.', goal: 'Deja a tu rival sin energía antes de que te pase a ti.',
    winText: 'Tu rival besa la lona. El foso corea tu nombre.', loseText: 'Acabas en el suelo. Levántate e inténtalo otra vez.',
    create(w, h, o) {
      const map = { w: 'arrowup', s: 'arrowdown', a: 'arrowleft', d: 'arrowright' };
      const rival = paintedImg(o.rivalLook || { skin: '#c9a080', face: 'angular', eyes: 'rasgados', hair: '#5a4a5a', style: 'undercut', outfit: 'top', outfitColor: '#2a2a2a', accents: ['arm', 'scar'], browAngle: 3 }, '#e0457b', ['#5a1a1a', '#0a0202']);
      // Rival con retrato del personaje original que indique la historia.
      const rivalFace = window.Depth ? Depth.face(o.rival || pick(['darel-ossan', 'toren-vale'])) : null;
      const b = o.bonus || 0;
      const crowd = Array.from({ length: Math.ceil(w / 26) + 2 }, (_, i) => ({ x: i * 26 - 13, s: 0.8 + Math.random() * 0.5, ph: Math.random() * TAU, row: i % 2 }));
      const s = Math.min(w, h) * 0.46;
      const cx = w / 2;
      const cy = h * 0.42;
      const g = {
        me: 100 + 25 * b, foe: 100, prompt: null, wait: 0.8, hit: 0, recoil: 0, lunge: 0, hits: 0, combo: 0, speed: 1.35 + 0.1 * b,
        result: null,
        // Cámara: se acerca con cada golpe y se balancea con el rival.
        cam() { return { x: Math.sin(performance.now() / 1700) * 0.25 + g.recoil * 0.08, y: -0.2, zoom: 1.03 + g.hit * 0.035 + g.lunge * 0.02 }; },
        next() { g.prompt = { key: pick(Object.keys(ARROWS)), t: 0, dur: g.speed }; g.lunge = 0.25; },
        update(dt, inp) {
          g.hit = Math.max(0, g.hit - dt * 3); g.recoil = Math.max(0, g.recoil - dt * 4); g.lunge = Math.max(0, g.lunge - dt * 2);
          if (!g.prompt) { g.wait -= dt; if (g.wait <= 0) g.next(); return; }
          g.prompt.t += dt;
          const keyHit = inp.pressed.map((k) => map[k] || k).find((k) => ARROWS[k]);
          const py = h * 0.82;
          if (keyHit) {
            if (keyHit === g.prompt.key) {
              const quality = 1 - g.prompt.t / g.prompt.dur;
              const perfect = quality > 0.6;
              g.combo++;
              const dmg = Math.round((10 + quality * 10) * (1 + 0.25 * b) * (g.combo >= 3 ? 1.2 : 1));
              g.foe -= dmg; g.hit = 1; g.recoil = 1; g.hits++;
              const ang = ARROW_ANG[keyHit];
              FX.burst(cx + Math.cos(ang) * s * 0.3, cy + Math.sin(ang) * s * 0.3, perfect ? 40 : 22, { color: perfect ? ['#fff3c0', '#ffd060', '#ff9a3a'] : ['#ffd0a0', '#ff7a5a'], speed: perfect ? 520 : 360, life: 0.5, size: 3.5 });
              FX.burst(cx, py, 14, { color: '#ffe08a', speed: 200, kind: 'dot', life: 0.5, gravity: 0, size: 2 });
              FX.impact(cx + Math.cos(ang) * s * 0.3, cy + Math.sin(ang) * s * 0.3, { power: perfect ? 1.1 : 0.6, colors: ['#e0457b', '#ff9a3a', '#fff3c0'] });
              FX.text(cx + (Math.random() - 0.5) * 80, cy - s * 0.55, perfect ? '¡GOLPE PERFECTO!' : `-${dmg}`, perfect ? '#ffe08a' : '#ffb07a', perfect ? 34 : 30);
              if (g.combo >= 3) FX.text(cx, cy + s * 0.62, `Combo ×${g.combo}`, '#7affd8', 22);
              FX.shake(perfect ? 10 : 6);
              FX.flash(perfect ? 0.25 : 0.12, '255,230,190');
              Audio2.sfx.choice();
            } else {
              g.me -= 14; g.combo = 0; FX.shake(16); FX.hurt(0.8); FX.text(cx, h * 0.62, '¡Te alcanza!', '#ff6a6a', 30);
              FX.burst(cx, h * 0.95, 18, { color: ['#ff5a5a', '#ffb0a0'], angle: -Math.PI / 2, spread: 1.6, speed: 380 });
              Audio2.sfx.locked(); buzz(35);
            }
            g.prompt = null; g.wait = 0.25 + Math.random() * 0.5; g.speed = Math.max(0.6, g.speed - 0.04);
          } else if (g.prompt.t > g.prompt.dur) {
            g.me -= 16; g.combo = 0; FX.shake(18); FX.hurt(1); FX.text(cx, h * 0.62, '¡Demasiado lento!', '#ff6a6a', 30);
            Audio2.sfx.locked(); buzz(35);
            g.prompt = null; g.wait = 0.5;
          }
          if (g.foe <= 0) { g.result = true; FX.burst(cx, cy, 90, { color: ['#fff3c0', '#ffd060', '#ff9a3a', '#e0457b'], speed: 700, life: 0.9, size: 4 }); }
          else if (g.me <= 0) g.result = false;
        },
        draw(ctx, t) {
          // Lona del ring en perspectiva, cuerdas y niebla roja del foso
          Depth.floor(ctx, w, h, h * 0.6, { colors: ['rgba(30,8,10,0)', 'rgba(34,12,14,0.82)', 'rgba(8,2,4,0.97)'], line: 'rgba(224,69,123,0.16)', wet: 'rgba(255,110,80,0.22)', rows: 10 });
          for (const [k, col] of [[1, '#5a1a20'], [0.93, '#e0457b'], [0.86, '#8a2a30']]) {
            ctx.lineWidth = 4 * k; ctx.strokeStyle = col;
            ctx.beginPath(); ctx.ellipse(cx, h * 0.98, w * 0.5 * k, h * 0.34 * k, 0, Math.PI * 1.02, Math.PI * 1.98); ctx.stroke();
          }
          for (const px of [cx - w * 0.47, cx + w * 0.47]) Depth.box(ctx, px - 9, h * 0.62, 18, h * 0.3, 0.06, cx, h * 0.3, { front: '#6a5030', frontDark: '#2a1a10', side: '#1a1008', top: '#c8a050' });
          Depth.fog(ctx, w, h, t, { color: '255,110,80', y0: 0.55, y1: 1, alpha: 0.1 });

          ctx.save();
          ctx.globalCompositeOperation = 'lighter';
          for (const sx of [0.22, 0.78]) {
            const gx = w * sx + Math.sin(t * 0.6 + sx * 9) * 30;
            const grd = ctx.createLinearGradient(gx, 0, cx, h * 0.8);
            grd.addColorStop(0, 'rgba(255,200,140,0.22)'); grd.addColorStop(1, 'rgba(255,120,80,0)');
            ctx.fillStyle = grd;
            ctx.beginPath(); ctx.moveTo(gx - 20, 0); ctx.lineTo(gx + 20, 0); ctx.lineTo(cx + s * 0.7, h * 0.85); ctx.lineTo(cx - s * 0.7, h * 0.85); ctx.fill();
          }
          ctx.restore();
          // Rival: retrato con marco de cuerda y metal, retrocede al recibir el golpe
          const bob = Math.sin(t * 4) * 6;
          const rx = cx + (g.recoil ? Math.sin(t * 60) * 10 * g.recoil : 0);
          const ry = cy + bob - g.recoil * 14 + g.lunge * 18;
          const rs = s * (1 + g.lunge * 0.12 - g.recoil * 0.06);
          Depth.shadow(ctx, rx, h * 0.86, rs * 0.55, rs * 0.12, 0.6);
          Depth.medallion(ctx, Depth.ready(rivalFace) ? rivalFace : rival, rx, ry, rs / 2, { rim: '#e0457b', glow: 40 + Math.sin(t * 3) * 10, flash: g.hit * 0.55 });
          for (let k = 0; k < 8; k++) {
            const a = (k / 8) * TAU + t * 0.2;
            ctx.fillStyle = '#c8a050';
            ctx.beginPath(); ctx.arc(rx + Math.cos(a) * (rs / 2 + 4), ry + Math.sin(a) * (rs / 2 + 4), 3.5, 0, TAU); ctx.fill();
          }
          // Público
          for (const c of crowd) {
            const yy = h - 6 - c.row * 20 + Math.abs(Math.sin(t * 5 + c.ph)) * -8 * (g.hit ? 2 : 1);
            ctx.fillStyle = c.row ? '#140a0c' : '#0a0507';
            ctx.beginPath(); ctx.arc(c.x, yy - 26 * c.s, 9 * c.s, 0, TAU); ctx.fill();
            ctx.beginPath(); ctx.ellipse(c.x, yy, 14 * c.s, 18 * c.s, 0, Math.PI, 0); ctx.fill();
            if (Math.sin(t * 3 + c.ph) > 0.7) { ctx.fillRect(c.x + 8 * c.s, yy - 52 * c.s, 4, 22 * c.s); }
          }
          // Indicador: flecha en una gema con anillo que se cierra
          if (g.prompt) {
            const k = 1 - g.prompt.t / g.prompt.dur;
            const px = cx;
            const py = h * 0.8;
            const col = k > 0.5 ? '#3fbf9f' : k > 0.25 ? '#e3c45a' : '#e05a5a';
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            ctx.strokeStyle = col;
            ctx.shadowColor = col;
            ctx.shadowBlur = 20;
            ctx.lineWidth = 5;
            ctx.beginPath(); ctx.arc(px, py, 38 + 70 * k, 0, TAU); ctx.stroke();
            ctx.lineWidth = 2;
            ctx.globalAlpha = 0.5;
            ctx.beginPath(); ctx.arc(px, py, 38 + 70 * k + 8, -Math.PI / 2, -Math.PI / 2 + TAU * k); ctx.stroke();
            ctx.restore();
            ctx.save();
            hexPath(ctx, px, py, 36, Math.PI / 6);
            const gg = ctx.createRadialGradient(px, py - 10, 4, px, py, 40);
            gg.addColorStop(0, '#4a3a2a'); gg.addColorStop(1, '#140c08');
            ctx.fillStyle = gg; ctx.fill();
            ctx.lineWidth = 3; ctx.strokeStyle = '#d8aa50'; ctx.stroke();
            ctx.translate(px, py);
            ctx.rotate(ARROW_ANG[g.prompt.key]);
            ctx.shadowColor = col; ctx.shadowBlur = 18;
            ctx.fillStyle = '#fff6e0';
            ctx.beginPath(); ctx.moveTo(18, 0); ctx.lineTo(-6, -16); ctx.lineTo(-6, -6); ctx.lineTo(-16, -6); ctx.lineTo(-16, 6); ctx.lineTo(-6, 6); ctx.lineTo(-6, 16); ctx.closePath(); ctx.fill();
            ctx.restore();
          }
        },
        hud() { return bar('Tú', g.me, 100 + 25 * b, '#3fbf9f') + bar('Rival', g.foe, 100, '#e0457b') + (g.combo >= 2 ? `<span class="mg-chip">Combo ×${g.combo}</span>` : '') + (b ? `<span class="mg-chip gold">Ventaja +${b}</span>` : ''); },
      };
      return g;
    },
  };

  // ---------- 2. Carrera por los tejados / Aerotabla ----------
  function runner(mode) {
    const fly = mode === 'fly';
    return {
      title: fly ? 'Vuelo en plataforma' : 'Carrera por pasarelas', icon: '', scene: fly ? 'jardin-musgo' : 'galerias', grade: 'zaun',
      backdrops: fly ? ['canal-cobre', 'jardin-musgo', 'nacar', 'galerias'] : ['galerias', 'mercado-nacar', 'nacar', 'canal-cobre'],
      desc: fly
        ? 'Surca los canales de Nácar en una plataforma ligera, esquivando tuberías y chimeneas.'
        : 'Cruza las pasarelas de mantenimiento. Salta los huecos y evita las válvulas de vapor.',
      controls: fly ? 'Mantén Espacio, ↑ o el ratón para subir.' : 'Espacio, ↑ o clic para saltar (doble salto permitido).',
      touchControls: fly ? 'Mantén el dedo en la pantalla para subir.' : 'Toca la pantalla para saltar (doble salto permitido).',
      goal: 'Aguanta 25 segundos sin chocar.',
      winText: fly ? 'Aterrizas en el árbol entre aplausos de la brigada de mantenimiento.' : 'Te pierdes entre las sombras. Nadie te ha visto.',
      loseText: '¡Crash! Te has dado un buen golpe. Otra vez.',
      create(w, h, o = {}) {
        const ground = h * 0.78;
        const goal = Math.max(13, 25 - 4 * (o.bonus || 0));
        const mid = skyline(fly ? 11 : 5, 40, h * 0.15, h * 0.4);
        const motes = Depth.motes(60, fly ? 5 : 9);
        // Punto de fuga de la ciudad: los edificios y el tejado se extruyen hacia él.
        const vpx = w * 0.62;
        const vpy = h * 0.32;
        const g = {
          // La cámara recorre el cuadro de izquierda a derecha durante la carrera.
          cam() { return { x: -0.9 + Math.min(1.8, (g.t / goal) * 1.8), y: fly ? (g.y / h - 0.5) * 0.8 : -0.1 - g.vy / 4000, zoom: 1.05 }; },
          t: 0, x: w * 0.22, y: fly ? h / 2 : ground, want: false, flip: 0, wheel: 0, vy: 0, jumps: 0, speed: 320, obs: [], spawn: 1, result: null, dist: 0, run: 0, land: 0, crashed: false,
          update(dt, inp) {
            g.t += dt;
            g.speed = 320 + g.t * 12;
            g.dist += g.speed * dt;
            const want = inp.keys.has(' ') || inp.keys.has('arrowup') || inp.keys.has('w') || inp.mouse.down;
            g.want = want;
            g.flip = Math.max(0, (g.flip || 0) - dt * 2.4);
            g.wheel = (g.wheel || 0) + (g.speed * dt) / 5;
            if (fly) {
              g.vy += (want ? -900 : 700) * dt;
              g.vy = Math.max(-420, Math.min(460, g.vy));
              g.y += g.vy * dt;
              if (want && Math.random() < 0.8) FX.burst(g.x - 22, g.y + 16, 1, { color: ['#5affd0', '#b8ffea'], angle: Math.PI * 0.6, spread: 0.6, speed: 160, kind: 'dot', life: 0.35, gravity: 0, size: 1.6 });
              if (g.y < 20 || g.y > h - 20) g.result = false;
            } else {
              const jumpNow = inp.pressed.some((k) => [' ', 'arrowup', 'w'].includes(k)) || inp.mouse.clicks.length;
              if (jumpNow && g.jumps < 2) {
                g.vy = -620; g.jumps++; Audio2.sfx.click();
                if (g.jumps === 2) { g.flip = 1; FX.burst(g.x, g.y + 10, 10, { color: ['#ff4aa0', '#3fd0ff', '#ffe08a'], kind: 'paint', speed: 220, life: 0.7, size: 3, gravity: 500 }); }
                FX.burst(g.x, g.y + 18, g.jumps === 2 ? 14 : 8, { color: g.jumps === 2 ? '#7affd8' : '#c8bca0', kind: g.jumps === 2 ? 'dot' : 'smoke', speed: 120, life: 0.45, gravity: g.jumps === 2 ? 0 : -40, size: g.jumps === 2 ? 2 : 6 });
              }
              g.vy += 1700 * dt;
              g.y += g.vy * dt;
              const onGap = g.obs.some((ob) => ob.gap && g.x > ob.x + 6 && g.x < ob.x + ob.w - 6);
              if (!onGap && g.y >= ground) {
                if (g.vy > 300) { g.land = 1; FX.burst(g.x, ground + 18, 10, { color: '#b0a890', kind: 'smoke', speed: 140, life: 0.5, gravity: -20, size: 5 }); }
                g.y = ground; g.vy = 0; g.jumps = 0;
              }
              g.run += dt * (g.speed / 40);
              g.land = Math.max(0, g.land - dt * 5);
              if (g.y > h + 40) g.result = false;
            }
            g.spawn -= dt;
            if (g.spawn <= 0) {
              g.spawn = 0.9 + Math.random() * 0.8 - Math.min(0.5, g.t * 0.01);
              if (fly) {
                const gapY = 80 + Math.random() * (h - 160);
                g.obs.push({ x: w + 20, w: 54, top: gapY - 95, bot: gapY + 95, ph: Math.random() * TAU });
              } else if (Math.random() < 0.4) g.obs.push({ x: w + 20, w: 90 + Math.random() * 60, gap: true });
              else g.obs.push({ x: w + 20, w: 36, hgt: 40 + Math.random() * 50, ph: Math.random() * TAU });
            }
            for (const ob of g.obs) {
              ob.x -= g.speed * dt;
              let hit = false;
              if (fly) hit = g.x + 14 > ob.x && g.x - 14 < ob.x + ob.w && (g.y - 14 < ob.top || g.y + 14 > ob.bot);
              else hit = !ob.gap && g.x + 14 > ob.x && g.x - 14 < ob.x + ob.w && g.y > ground - ob.hgt;
              if (hit) g.result = false;
              if (!fly && !ob.gap && Math.random() < 0.25) FX.burst(ob.x + ob.w / 2, ground - ob.hgt - 4, 1, { color: '#8a9a90', kind: 'smoke', angle: -Math.PI / 2 - 0.4, spread: 0.4, speed: 60, life: 1.2, gravity: -30, size: 7 });
            }
            if (g.result === false && !g.crashed) {
              g.crashed = true;
              FX.burst(g.x, g.y, 40, { color: ['#ffd060', '#ff7a3a', '#fff'], speed: 460, life: 0.6 });
              FX.impact(g.x, g.y, { power: 1.2, colors: fly ? ['#5affd0', '#e0457b', '#ffe08a'] : ['#ff4aa0', '#3fd0ff', '#ffe08a'] });
              FX.shake(20);
            }
            g.obs = g.obs.filter((ob) => ob.x + ob.w > -40);
            if (g.t >= goal && g.result == null) g.result = true;
          },
          draw(ctx, t) {
            // Atmósfera sobre el arte: rayos, niebla lejana, edificios en 3D y motas a tres profundidades
            Depth.rays(ctx, w, h, t, { x: 0.8, color: fly ? '120,255,200' : '255,200,140', alpha: 0.08 });
            Depth.fog(ctx, w, h, t, { color: fly ? '90,255,190' : '200,170,200', y0: 0.3, y1: 0.8, alpha: 0.08, scroll: -g.dist * 0.2 });
            const len = mid.len;
            const off = g.dist * 0.4;
            for (const bl of mid.list) {
              const x = ((bl.x - off) % len + len) % len - 120;
              if (x > w + 40 || x + bl.w < -40) continue;
              const base = fly ? h * 1.02 : ground + 6;
              Depth.box(ctx, x, base - bl.h * 0.8, bl.w, bl.h + h, 0.07, vpx, vpy, {
                front: fly ? 'rgba(10,34,30,0.8)' : 'rgba(34,26,44,0.78)', frontDark: fly ? 'rgba(4,14,12,0.9)' : 'rgba(12,8,16,0.92)', side: fly ? '#04100c' : '#0a070e', top: fly ? '#1c3a32' : '#3a2e44',
                tex: (c, bx, by, bw) => { c.fillStyle = fly ? 'rgba(90,255,200,0.55)' : 'rgba(255,180,100,0.6)'; bl.win.forEach((on, k) => { if (on) c.fillRect(bx + 6 + (k % 3) * (bw / 3.2), by + 10 + Math.floor(k / 3) * 22, 6, 9); }); },
              });
            }
            Depth.fog(ctx, w, h, t, { color: fly ? '90,255,190' : '170,150,190', y0: 0.55, y1: 0.95, alpha: 0.1, scroll: -g.dist * 0.4 });
            motes.draw(ctx, w, h, t, { color: fly ? '120,255,210' : '255,190,120', scroll: g.dist });
            if (!fly) {
              // Tejado en primer plano en 3D: tramos entre huecos, con tapa de tejas y fachada de ladrillo
              const gaps = g.obs.filter((ob) => ob.gap).map((ob) => [ob.x, ob.x + ob.w]).sort((p, q) => p[0] - q[0]);
              let x0 = -60;
              const segs = [];
              for (const [a0, a1] of gaps) { if (a0 > x0) segs.push([x0, a0]); x0 = Math.max(x0, a1); }
              if (x0 < w + 60) segs.push([x0, w + 60]);
              const toff = g.dist % 28;
              for (const [a0, a1] of segs) {
                Depth.box(ctx, a0, ground + 16, a1 - a0, h - ground, 0.05, vpx, vpy, {
                  front: '#2c2230', frontDark: '#120c14', side: '#0a060c', top: '#4a3c4c', rim: 'rgba(255,200,150,0.35)',
                  tex: (c, bx, by, bw, bh) => {
                    c.strokeStyle = 'rgba(0,0,0,0.35)'; c.lineWidth = 1;
                    for (let y = by + 10; y < by + bh; y += 10) { c.beginPath(); c.moveTo(bx, y); c.lineTo(bx + bw, y); c.stroke(); }
                    c.strokeStyle = 'rgba(255,255,255,0.05)'; c.lineWidth = 2;
                    for (let xx = bx - toff; xx < bx + bw; xx += 28) { c.beginPath(); c.moveTo(xx, by + 4); c.lineTo(xx - 10, by + bh); c.stroke(); }
                  },
                });
              }
            }
            for (const ob of g.obs) {
              if (fly) {
                // Tuberías verticales con remaches y bocas que gotean química
                for (const [y0, y1, cap] of [[0, ob.top, ob.top - 12], [ob.bot, h, ob.bot]]) {
                  const pg = ctx.createLinearGradient(ob.x, 0, ob.x + ob.w, 0);
                  pg.addColorStop(0, '#1a2a24'); pg.addColorStop(0.35, '#4a6a5a'); pg.addColorStop(0.6, '#2a3e36'); pg.addColorStop(1, '#0e1612');
                  ctx.fillStyle = pg;
                  ctx.fillRect(ob.x, y0, ob.w, y1 - y0);
                  ctx.fillStyle = 'rgba(0,0,0,0.35)';
                  for (let y = y0 + 20; y < y1; y += 46) ctx.fillRect(ob.x - 3, y, ob.w + 6, 5);
                  const cg = ctx.createLinearGradient(ob.x, 0, ob.x + ob.w, 0);
                  cg.addColorStop(0, '#6a4a22'); cg.addColorStop(0.4, '#d8aa50'); cg.addColorStop(1, '#5a3a18');
                  ctx.fillStyle = cg;
                  ctx.fillRect(ob.x - 6, cap, ob.w + 12, 12);
                  ctx.save();
                  ctx.globalCompositeOperation = 'lighter';
                  ctx.globalAlpha = 0.5 + Math.sin(t * 4 + ob.ph) * 0.2;
                  ctx.drawImage(glowSprite('#7aff4a'), ob.x - 20, cap - 24, ob.w + 40, 60);
                  ctx.restore();
                }
              } else if (ob.gap) {
                const gg = ctx.createLinearGradient(0, ground + 16, 0, h);
                gg.addColorStop(0, 'rgba(2,2,4,0.75)'); gg.addColorStop(1, 'rgba(60,160,100,0.3)');
                ctx.fillStyle = gg;
                ctx.fillRect(ob.x, ground + 16, ob.w, h - ground);
                ctx.fillStyle = '#4a3a2a';
                ctx.fillRect(ob.x - 4, ground + 14, 4, 10);
                ctx.fillRect(ob.x + ob.w, ground + 14, 4, 10);
              } else {
                // Chimenea de ladrillo en 3D con su sombrerete
                const top = ground + 16 - ob.hgt;
                Depth.shadow(ctx, ob.x + ob.w / 2, ground + 18, ob.w * 0.9, 6, 0.5);
                Depth.box(ctx, ob.x, top, ob.w, ob.hgt, 0.06, vpx, vpy, {
                  front: '#6a3a2a', frontDark: '#2a1410', side: '#1a0a08', top: '#3a2018',
                  tex: (c, bx, by, bw, bh) => {
                    c.strokeStyle = 'rgba(0,0,0,0.35)'; c.lineWidth = 1;
                    for (let y = by + 8; y < by + bh; y += 8) {
                      c.beginPath(); c.moveTo(bx, y); c.lineTo(bx + bw, y); c.stroke();
                      const o2 = ((y - by) / 8) % 2 ? 0 : 9;
                      for (let xx = bx + o2; xx < bx + bw; xx += 18) { c.beginPath(); c.moveTo(xx, y - 8); c.lineTo(xx, y); c.stroke(); }
                    }
                    c.fillStyle = 'rgba(255,200,150,0.12)'; c.fillRect(bx, by, 4, bh);
                  },
                });
                Depth.box(ctx, ob.x - 4, top - 6, ob.w + 8, 8, 0.07, vpx, vpy, { front: '#3a2018', frontDark: '#1a0c08', top: '#5a3424', side: '#120806' });
              }
            }
            // Jugador (con sombra de contacto que se encoge al saltar)
            if (!fly) Depth.shadow(ctx, g.x, ground + 18, Math.max(5, 16 - (ground - g.y) / 14), 4, 0.55);
            if (fly) drawHoverboard(ctx, g.x, g.y, t, { tilt: g.vy / 1300, thrust: g.want, scale: 1.15 });
            else {
              const air = g.y < ground - 1;
              drawSkate(ctx, g.x, g.y + 16 + g.land * 2, t, { tilt: air ? Math.max(-0.35, Math.min(0.25, g.vy / 1800)) : 0, flip: 1 - g.flip, spin: g.wheel, scale: 1.5 });
              // Chispas de las ruedas al rodar por las tejas
              if (!air && Math.random() < 0.35) FX.burst(g.x - 18, g.y + 14, 1, { color: ['#ffe08a', '#ff9a3a'], kind: 'spark', angle: Math.PI * 1.1, spread: 0.5, speed: 160, life: 0.25, gravity: 300, size: 1.4 });
            }
            // Líneas de velocidad
            ctx.strokeStyle = 'rgba(255,255,255,0.08)';
            ctx.lineWidth = 1.5;
            for (let i = 0; i < 8; i++) {
              const y = (i * 97 + 30) % h;
              const x = w - ((g.dist * 1.6 + i * 211) % (w + 200));
              ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 60 + (g.speed - 320) * 0.2, y); ctx.stroke();
            }
          },
          hud() { return bar('Tiempo', Math.min(goal, g.t), goal, '#e3c45a') + `<span class="mg-num">${Math.max(0, goal - g.t).toFixed(1)} s</span>`; },
        };
        return g;
      },
    };
  }
  GAMES.tejados = runner('run');
  GAMES.aerotabla = runner('fly');

  // ---------- 3. Galería de tiro ----------
  GAMES.tiro = {
    title: 'Galería de tiro', icon: '', scene: 'observatorio', grade: 'hex', backdrops: ['observatorio', 'ascensor-central', 'archivo', 'cristal', 'gremios'],
    desc: 'Los blancos de Resonancia aparecen y desaparecen. Dispara a los blancos azules y no rompas los faroles.',
    controls: 'Ratón: apunta y haz clic para disparar.', touchControls: 'Toca los objetivos para disparar.', goal: 'Consigue 15 puntos en 30 segundos.',
    winText: 'Caitlyn estaría orgullosa. Puntería de francotirador.', loseText: 'Demasiadas balas perdidas. Respira, apunta, exhala.',
    create(w, h, o = {}) {
      const need = Math.max(8, 15 - 2 * (o.bonus || 0));
      // Tres raíles a distinta profundidad: las dianas del fondo son más pequeñas.
      const LANES = [0.62, 0.8, 1];
      const railY = (z) => h * (0.4 + ((z - 0.62) / 0.38) * 0.42);
      const g = {
        cam() { const m = g.lastMouse || { x: w / 2, y: h / 2 }; return { x: (m.x / w - 0.5) * 0.45, y: (m.y / h - 0.5) * 0.3, zoom: 1.06 + g.muzzle * 0.012 }; },
        t: 0, score: 0, targets: [], spawn: 0.3, holes: [], muzzle: 0, result: null, lastMouse: null, streak: 0,
        update(dt, inp) {
          g.lastMouse = { x: inp.mouse.x, y: inp.mouse.y };
          g.t += dt;
          g.muzzle = Math.max(0, g.muzzle - dt * 8);
          g.spawn -= dt;
          if (g.spawn <= 0) {
            g.spawn = Math.max(0.35, 0.8 - g.t * 0.012);
            const z = pick(LANES);
            const r = (30 + Math.random() * 12) * z * 1.3;
            g.targets.push({ z, x: 70 + Math.random() * (w - 140), y: railY(z) - r * 1.6, r, life: 1.6, max: 1.6, civ: Math.random() < 0.22, vx: (Math.random() - 0.5) * 140 * z, born: 0 });
          }
          for (const tg of g.targets) { tg.life -= dt; tg.x += tg.vx * dt; tg.born = Math.min(1, tg.born + dt * 5); }
          for (const c of inp.mouse.clicks) {
            Audio2.sfx.click();
            g.muzzle = 1;
            FX.shake(3);
            const hit = g.targets.find((tg) => tg.life > 0 && Math.hypot(tg.x - c.x, tg.y - c.y) < tg.r);
            if (hit) {
              hit.life = 0;
              if (hit.civ) {
                g.score -= 3; g.streak = 0;
                FX.text(c.x, c.y - 20, '-3 ¡Un farol!', '#ff6a6a', 28); FX.hurt(0.6);
                FX.burst(c.x, c.y, 22, { color: ['#fff3c0', '#ffb050', '#c8a050'], kind: 'shard', speed: 300, size: 4, life: 0.8 });
              } else {
                const center = Math.hypot(hit.x - c.x, hit.y - c.y) < hit.r * 0.35;
                g.score += 1; g.streak++;
                FX.text(c.x, c.y - 20, center ? '¡Diana! +1' : '+1', center ? '#ffe08a' : '#7fd0ff', center ? 30 : 26);
                FX.burst(c.x, c.y, center ? 34 : 22, { color: ['#7fd0ff', '#bfeaff', '#3fa9f5'], kind: 'shard', speed: center ? 420 : 300, size: 3.5, life: 0.7 });
                FX.burst(c.x, c.y, 10, { color: '#ffe08a', kind: 'spark', speed: 300, life: 0.4 });
                FX.impact(c.x, c.y, { power: center ? 0.8 : 0.5, colors: ['#3fa9f5', '#bfeaff', '#ffe08a'], stop: center });
              }
            } else {
              g.holes.push({ x: c.x, y: c.y, life: 3 });
              FX.burst(c.x, c.y, 6, { color: '#c8b080', kind: 'spark', speed: 160, life: 0.3 });
              g.streak = 0;
            }
          }
          g.targets = g.targets.filter((tg) => tg.life > 0);
          g.holes.forEach((ho) => { ho.life -= dt; });
          g.holes = g.holes.filter((ho) => ho.life > 0);
          if (g.score >= need) g.result = true;
          else if (g.t >= 30) g.result = false;
        },
        draw(ctx, t) {
          // Suelo de la galería en perspectiva y raíles de latón a tres profundidades
          Depth.floor(ctx, w, h, h * 0.3, { colors: ['rgba(10,14,24,0)', 'rgba(10,14,24,0.7)', 'rgba(4,6,12,0.95)'], line: 'rgba(127,208,255,0.12)', wet: 'rgba(120,190,255,0.16)', rows: 12 });
          Depth.fog(ctx, w, h, t, { color: '140,190,255', y0: 0.3, y1: 0.7, alpha: 0.08 });
          for (const z of LANES) {
            const y = railY(z);
            Depth.box(ctx, -20, y, w + 40, 6 * z, 0.012, w / 2, h * 0.2, { front: '#8a6a30', frontDark: '#3a2a10', top: '#e3c45a', side: '#2a1a08' });
          }
          for (const ho of g.holes) {
            ctx.globalAlpha = Math.min(1, ho.life);
            ctx.fillStyle = '#0a0806';
            ctx.beginPath(); ctx.arc(ho.x, ho.y, 3.5, 0, TAU); ctx.fill();
            ctx.strokeStyle = 'rgba(200,180,140,0.4)';
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.arc(ho.x, ho.y, 6, 0, TAU); ctx.stroke();
          }
          ctx.globalAlpha = 1;
          for (const tg of [...g.targets].sort((p, q) => p.z - q.z)) {
            const a = Math.min(1, tg.life * 3);
            const pop = 1 - Math.pow(1 - tg.born, 3);
            Depth.shadow(ctx, tg.x, railY(tg.z) + 2, tg.r * 0.9, tg.r * 0.18, 0.55 * a);
            ctx.save();
            ctx.globalAlpha = a;
            // Se levanta girando sobre la bisagra del raíl, como una diana de feria.
            ctx.translate(tg.x, railY(tg.z));
            ctx.scale(1, Math.max(0.05, pop));
            ctx.translate(0, tg.y - railY(tg.z));
            // Soporte
            ctx.fillStyle = '#2a2a30';
            ctx.fillRect(-3 * tg.z, tg.r * 0.8, 6 * tg.z, tg.r * 0.8);
            if (tg.civ) {
              // Farol de latón de Aurelia (no se dispara): cristal con llama, casquete metálico
              const r = tg.r;
              ctx.save();
              ctx.globalCompositeOperation = 'lighter';
              ctx.globalAlpha = 0.7 + Math.sin(t * 9 + tg.x) * 0.1;
              ctx.drawImage(glowSprite('#ffb050'), -r * 1.4, -r * 1.4, r * 2.8, r * 2.8);
              ctx.restore();
              const glass = ctx.createLinearGradient(-r * 0.5, 0, r * 0.5, 0);
              glass.addColorStop(0, 'rgba(255,200,120,0.35)'); glass.addColorStop(0.5, 'rgba(255,240,200,0.75)'); glass.addColorStop(1, 'rgba(255,170,80,0.35)');
              ctx.fillStyle = glass;
              ctx.beginPath(); ctx.moveTo(-r * 0.38, -r * 0.55); ctx.lineTo(r * 0.38, -r * 0.55); ctx.lineTo(r * 0.5, r * 0.55); ctx.lineTo(-r * 0.5, r * 0.55); ctx.closePath(); ctx.fill();
              ctx.fillStyle = '#fff3c0';
              ctx.beginPath(); ctx.ellipse(0, r * 0.12 + Math.sin(t * 14 + tg.x) * 2, r * 0.1, r * 0.22, 0, 0, TAU); ctx.fill();
              ctx.strokeStyle = '#8a6424'; ctx.lineWidth = 2.5;
              ctx.beginPath(); ctx.moveTo(-r * 0.38, -r * 0.55); ctx.lineTo(-r * 0.5, r * 0.55); ctx.moveTo(r * 0.38, -r * 0.55); ctx.lineTo(r * 0.5, r * 0.55); ctx.moveTo(0, -r * 0.55); ctx.lineTo(0, r * 0.55); ctx.stroke();
              ctx.fillStyle = '#c8a050';
              ctx.beginPath(); ctx.moveTo(-r * 0.55, -r * 0.55); ctx.lineTo(0, -r * 0.95); ctx.lineTo(r * 0.55, -r * 0.55); ctx.closePath(); ctx.fill();
              ctx.fillRect(-r * 0.6, r * 0.55, r * 1.2, r * 0.14);
              ctx.beginPath(); ctx.arc(0, -r * 1.02, r * 0.1, 0, TAU); ctx.fill();
            } else {
              // Diana hextec: anillos de latón y núcleo azul
              ctx.shadowColor = '#3fa9f5';
              ctx.shadowBlur = 22;
              hexPath(ctx, 0, 0, tg.r, t * 0.8);
              const dg = ctx.createRadialGradient(0, -tg.r * 0.3, 2, 0, 0, tg.r);
              dg.addColorStop(0, '#2a5a8a'); dg.addColorStop(1, '#0a1a2e');
              ctx.fillStyle = dg; ctx.fill();
              ctx.shadowBlur = 0;
              ctx.lineWidth = 3; ctx.strokeStyle = '#d8aa50'; ctx.stroke();
              ctx.strokeStyle = 'rgba(127,208,255,0.8)'; ctx.lineWidth = 2;
              ctx.beginPath(); ctx.arc(0, 0, tg.r * 0.66, 0, TAU); ctx.stroke();
              ctx.beginPath(); ctx.arc(0, 0, tg.r * 0.36, 0, TAU); ctx.stroke();
              ctx.globalCompositeOperation = 'lighter';
              ctx.drawImage(glowSprite('#7fd0ff'), -tg.r * 0.5, -tg.r * 0.5, tg.r, tg.r);
              ctx.globalCompositeOperation = 'source-over';
              // Arco de tiempo restante
              ctx.strokeStyle = 'rgba(255,224,138,0.8)'; ctx.lineWidth = 2.5;
              ctx.beginPath(); ctx.arc(0, 0, tg.r + 6, -Math.PI / 2, -Math.PI / 2 + TAU * (tg.life / tg.max)); ctx.stroke();
            }
            ctx.restore();
          }
          // Mira telescópica
          const m = g.lastMouse;
          if (m && !U.touch) {
            ctx.save();
            ctx.translate(m.x, m.y);
            const k = 1 + g.muzzle * 0.3;
            ctx.strokeStyle = 'rgba(255,224,138,0.9)';
            ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.arc(0, 0, 18 * k, 0, TAU); ctx.stroke();
            ctx.beginPath();
            for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { ctx.moveTo(dx * 8 * k, dy * 8 * k); ctx.lineTo(dx * 28 * k, dy * 28 * k); }
            ctx.stroke();
            ctx.fillStyle = '#ff5a5a';
            ctx.beginPath(); ctx.arc(0, 0, 1.8, 0, TAU); ctx.fill();
            if (g.muzzle) { ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = g.muzzle; ctx.drawImage(glowSprite('#ffd890'), -40, -40, 80, 80); }
            ctx.restore();
          }
        },
        hud() { return bar('Puntos', Math.max(0, g.score), need, '#3fa9f5') + `<span class="mg-num">${g.score}/${need} · ${Math.max(0, 30 - g.t).toFixed(0)} s</span>${g.streak >= 3 ? `<span class="mg-chip">${streakTxt(g.streak)}</span>` : ''}`; },
      };
      return g;
    },
  };

  // ---------- 4. Circuito hextec (puzle de conexiones) ----------
  // Cada pieza tiene conexiones [arriba, derecha, abajo, izquierda].
  GAMES.circuito = {
    title: 'Circuito de Resonancia', icon: '', scene: 'ascensor-central', grade: 'hex', backdrops: ['ascensor-central', 'observatorio', 'archivo', 'gremios', 'mercado-nacar'],
    desc: 'La energía tiene que ir de la gema (izquierda) al receptor (derecha). Gira las piezas para que el circuito quede conectado.',
    controls: 'Clic en una pieza para girarla.', touchControls: 'Toca una pieza para girarla.', goal: 'Conecta el circuito en menos de 75 segundos.',
    winText: 'La gema se ilumina y el circuito zumba. ¡Funciona!', loseText: 'Saltan chispas. El circuito no aguantó.',
    create(w, h, o = {}) {
      const N = 5;
      const limit = 75 + 15 * (o.bonus || 0);
      const dirs = [[0, -1], [1, 0], [0, 1], [-1, 0]];
      const grid = Array.from({ length: N }, () => Array.from({ length: N }, () => [0, 0, 0, 0]));
      const sr = Math.floor(Math.random() * N);
      const er = Math.floor(Math.random() * N);
      // Camino aleatorio de (0, sr) a (N-1, er)
      let x = 0;
      let y = sr;
      const path = [[x, y]];
      const seen = new Set([`${x},${y}`]);
      while (x < N - 1 || y !== er) {
        const opts = [];
        if (x < N - 1) opts.push([1, 0], [1, 0]);
        if (y > 0 && !seen.has(`${x},${y - 1}`) && x < N - 1) opts.push([0, -1]);
        if (y < N - 1 && !seen.has(`${x},${y + 1}`) && x < N - 1) opts.push([0, 1]);
        if (x === N - 1) opts.length = 0, opts.push([0, er > y ? 1 : -1]);
        const [dx, dy] = pick(opts);
        x += dx; y += dy;
        seen.add(`${x},${y}`);
        path.push([x, y]);
      }
      const link = (a, b) => {
        const d = dirs.findIndex(([dx, dy]) => dx === b[0] - a[0] && dy === b[1] - a[1]);
        grid[a[1]][a[0]][d] = 1;
        grid[b[1]][b[0]][(d + 2) % 4] = 1;
      };
      for (let i = 0; i < path.length - 1; i++) link(path[i], path[i + 1]);
      grid[sr][0][3] = 1;
      grid[er][N - 1][1] = 1;
      // Piezas de relleno
      for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (!grid[r][c].some(Boolean)) {
        const t = pick([[1, 0, 1, 0], [1, 1, 0, 0], [1, 1, 1, 0]]);
        grid[r][c] = t;
      }
      const rot = (p) => [p[3], p[0], p[1], p[2]];
      for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) for (let k = Math.floor(Math.random() * 4); k > 0; k--) grid[r][c] = rot(grid[r][c]);
      const cell = Math.min((w - 200) / N, (h - 60) / N);
      const ox = (w - cell * N) / 2;
      const oy = (h - cell * N) / 2;
      const g = {
        t: 0, result: null, lit: new Set(), spin: {}, litBefore: 0,
        flow() {
          const lit = new Set();
          if (!grid[sr][0][3]) return lit;
          const q = [[0, sr]];
          lit.add(`0,${sr}`);
          while (q.length) {
            const [cx, cy] = q.shift();
            grid[cy][cx].forEach((on, d) => {
              if (!on) return;
              const nx = cx + dirs[d][0];
              const ny = cy + dirs[d][1];
              if (nx < 0 || ny < 0 || nx >= N || ny >= N) return;
              if (!grid[ny][nx][(d + 2) % 4] || lit.has(`${nx},${ny}`)) return;
              lit.add(`${nx},${ny}`);
              q.push([nx, ny]);
            });
          }
          return lit;
        },
        update(dt, inp) {
          g.t += dt;
          for (const c of inp.mouse.clicks) {
            const cx = Math.floor((c.x - ox) / cell);
            const cy = Math.floor((c.y - oy) / cell);
            if (cx >= 0 && cy >= 0 && cx < N && cy < N) {
              grid[cy][cx] = rot(grid[cy][cx]); g.spin[`${cx},${cy}`] = 1; Audio2.sfx.click(); buzz(8);
              FX.burst(ox + cx * cell + cell / 2, oy + cy * cell + cell / 2, 6, { color: '#ffd890', kind: 'spark', speed: 180, life: 0.3 });
            }
          }
          Object.keys(g.spin).forEach((k) => { g.spin[k] -= dt * 6; if (g.spin[k] <= 0) delete g.spin[k]; });
          g.lit = g.flow();
          if (g.lit.size > g.litBefore) {
            // Chispa en cada pieza nueva que recibe energía
            for (const k of g.lit) {
              const [cx, cy] = k.split(',').map(Number);
              if (Math.random() < 0.5) FX.burst(ox + cx * cell + cell / 2, oy + cy * cell + cell / 2, 3, { color: '#7fd0ff', kind: 'dot', speed: 80, gravity: 0, life: 0.5, size: 1.5 });
            }
          }
          g.litBefore = g.lit.size;
          if (g.lit.has(`${N - 1},${er}`) && grid[er][N - 1][1]) {
            g.result = true;
            FX.burst(ox + N * cell + cell * 0.5, oy + er * cell + cell / 2, 60, { color: ['#7fd0ff', '#ffffff', '#3fa9f5'], speed: 520, life: 0.8 });
          } else if (g.t > limit) { g.result = false; FX.burst(w / 2, h / 2, 50, { color: ['#ffd060', '#ff7a3a'], speed: 500 }); }
        },
        draw(ctx, t) {
          stageLight(ctx, w, h, t, { ray: '140,200,255', fog: '140,200,255' });
          // Placa base del tablero, flotando con su sombra
          Depth.shadow(ctx, ox + (cell * N) / 2 + 18, oy + cell * N + 30, cell * N * 0.62, 26, 0.65);
          plate(ctx, ox - 14, oy - 14, cell * N + 28, cell * N + 28, { top: '#2a2420', bot: '#120e0c', edge: 'rgba(216,170,80,0.8)', lw: 2, cut: 16, rivets: true });
          for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
            const x0 = ox + c * cell;
            const y0 = oy + r * cell;
            const on = g.lit.has(`${c},${r}`);
            plate(ctx, x0 + 3, y0 + 3, cell - 6, cell - 6, { top: on ? '#1e3448' : '#2c2622', bot: on ? '#0c1826' : '#16120f', edge: on ? 'rgba(127,208,255,0.55)' : 'rgba(216,170,80,0.3)', cut: 6 });
            ctx.save();
            ctx.translate(x0 + cell / 2, y0 + cell / 2);
            ctx.rotate(-(g.spin[`${c},${r}`] || 0) * Math.PI / 2);
            // Conducto de cobre
            ctx.lineCap = 'round';
            ctx.strokeStyle = '#3a2410';
            ctx.lineWidth = cell * 0.22;
            grid[r][c].forEach((v, d) => { if (v) { ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(dirs[d][0] * cell / 2, dirs[d][1] * cell / 2); ctx.stroke(); } });
            ctx.strokeStyle = on ? '#9adfff' : '#b07a3a';
            ctx.lineWidth = cell * 0.14;
            if (on) { ctx.shadowColor = '#3fa9f5'; ctx.shadowBlur = 16; }
            grid[r][c].forEach((v, d) => { if (v) { ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(dirs[d][0] * cell / 2, dirs[d][1] * cell / 2); ctx.stroke(); } });
            ctx.shadowBlur = 0;
            if (on) {
              // Pulso de energía que recorre el conducto
              ctx.strokeStyle = 'rgba(255,255,255,0.85)';
              ctx.lineWidth = cell * 0.05;
              ctx.setLineDash([cell * 0.08, cell * 0.22]);
              ctx.lineDashOffset = -t * cell * 0.9;
              grid[r][c].forEach((v, d) => { if (v) { ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(dirs[d][0] * cell / 2, dirs[d][1] * cell / 2); ctx.stroke(); } });
              ctx.setLineDash([]);
            }
            // Nudo central: tuerca hexagonal
            hexPath(ctx, 0, 0, cell * 0.13, Math.PI / 6);
            ctx.fillStyle = on ? '#dff4ff' : '#6a5030';
            ctx.fill();
            ctx.strokeStyle = on ? '#7fd0ff' : '#d8aa50';
            ctx.lineWidth = 1.5;
            ctx.stroke();
            ctx.restore();
          }
          const gem = (gx, gy, lit) => {
            ctx.save();
            const c = lit ? '#7fd0ff' : '#5a4a3a';
            if (lit) { ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = 0.7 + Math.sin(t * 4) * 0.2; ctx.drawImage(glowSprite('#3fa9f5'), gx - cell * 0.8, gy - cell * 0.8, cell * 1.6, cell * 1.6); ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1; }
            hexPath(ctx, gx, gy, cell * 0.34, t * (lit ? 0.8 : 0.1));
            ctx.fillStyle = '#2a2016'; ctx.fill();
            ctx.lineWidth = 3; ctx.strokeStyle = '#d8aa50'; ctx.stroke();
            hexPath(ctx, gx, gy, cell * 0.22, -t * (lit ? 1.2 : 0.1));
            const gg = ctx.createRadialGradient(gx - 4, gy - 6, 1, gx, gy, cell * 0.22);
            gg.addColorStop(0, '#ffffff'); gg.addColorStop(0.4, c); gg.addColorStop(1, lit ? '#1a5a9a' : '#2a2018');
            ctx.fillStyle = gg; ctx.fill();
            ctx.restore();
          };
          gem(ox - cell * 0.55, oy + sr * cell + cell / 2, true);
          gem(ox + N * cell + cell * 0.55, oy + er * cell + cell / 2, g.lit.has(`${N - 1},${er}`));
        },
        hud() { return bar('Tiempo', Math.max(0, limit - g.t), limit, '#e3c45a') + `<span class="mg-num">${Math.max(0, limit - g.t).toFixed(0)} s</span>`; },
      };
      return g;
    },
  };

  // ---------- 5. Runas de la Academia (memoria) ----------
  GAMES.runas = {
    title: 'Calibración del Archivo', icon: '', scene: 'archivo', grade: 'piltover', backdrops: ['archivo', 'observatorio', 'cristal', 'gremios', 'aurelia'],
    desc: 'Heimerdinger te pone a prueba: las runas se encienden en un orden. Repite la secuencia, que cada vez será más larga.',
    controls: 'Clic en las runas (o teclas 1 a 6).', touchControls: 'Toca las runas en orden.', goal: 'Completa una secuencia de 7 runas. Tienes un fallo de margen.',
    winText: '«¡Fascinante! Memoria de yordle», aplaude Heimerdinger.', loseText: '«Hmm, hmm. La paciencia también es una ciencia», suspira el profesor.',
    create(w, h, o = {}) {
      const n = 6;
      const target = (o.bonus || 0) >= 2 ? 6 : 7;
      const cols = ['#3fa9f5', '#e3c45a', '#e0457b', '#3fbf9f', '#bf3abf', '#f0a040'];
      const glyph = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ'];
      const cx = w / 2;
      const cy = h / 2;
      const R = Math.min(w, h) * 0.3;
      const pos = Array.from({ length: n }, (_, i) => [cx + Math.cos(-Math.PI / 2 + (i * Math.PI * 2) / n) * R, cy + Math.sin(-Math.PI / 2 + (i * Math.PI * 2) / n) * R]);
      const g = {
        seq: [pick([0, 1, 2, 3, 4, 5])], input: 0, showing: true, showT: 0, lit: -1, litT: 0, lives: 2 + (o.bonus || 0), result: null, msg: 'Observa…', press: Array(n).fill(0),
        light(i, fx) {
          g.lit = i; g.litT = 0.35; g.press[i] = 1; Audio2.sfx.message();
          if (fx) FX.burst(pos[i][0], pos[i][1], 16, { color: [cols[i], '#ffffff'], kind: 'dot', speed: 200, gravity: 0, life: 0.6, size: 2 });
        },
        update(dt, inp) {
          g.litT -= dt;
          g.press = g.press.map((p) => Math.max(0, p - dt * 4));
          if (g.litT <= 0) g.lit = -1;
          if (g.showing) {
            const before = g.showT;
            g.showT += dt;
            const k = Math.floor(g.showT / 0.6);
            if (k >= 0 && k < g.seq.length && Math.floor(before / 0.6) !== k) g.light(g.seq[k], true);
            if (g.showT >= (g.seq.length + 0.3) * 0.6) { g.showing = false; g.input = 0; g.msg = 'Tu turno'; }
            return;
          }
          const picks = inp.mouse.clicks.map((c) => pos.findIndex(([x, y]) => Math.hypot(x - c.x, y - c.y) < R * 0.32))
            .concat(inp.pressed.map((k) => Number(k) - 1)).filter((i) => i >= 0 && i < n);
          for (const p of picks) {
            g.light(p, true);
            buzz(10);
            if (p === g.seq[g.input]) {
              g.input++;
              if (g.input === g.seq.length) {
                if (g.seq.length >= target) { g.result = true; FX.burst(cx, cy, 70, { color: cols, speed: 480, life: 0.9 }); return; }
                g.seq.push(pick([0, 1, 2, 3, 4, 5]));
                g.showing = true; g.showT = -0.6; g.msg = '¡Bien! Otra más…';
                FX.text(cx, cy - R * 0.25, `${g.seq.length - 1}/${target}`, '#ffe08a', 26);
              }
            } else {
              g.lives--; Audio2.sfx.locked(); FX.shake(10); FX.hurt(0.6);
              if (g.lives <= 0) { g.result = false; return; }
              g.showing = true; g.showT = -0.6; g.msg = '¡Fallo! Mira otra vez…';
            }
            break;
          }
        },
        draw(ctx, t) {
          stageLight(ctx, w, h, t, { center: 0.5, ray: '255,226,170', fog: '255,226,170', rayX: 0.25 });
          // Astrolabio de latón que gira detrás
          ctx.save();
          ctx.translate(cx, cy);
          ctx.strokeStyle = 'rgba(216,170,80,0.45)';
          ctx.lineWidth = 2;
          for (const [rr, sp] of [[R * 1.32, 0.05], [R * 1.12, -0.08], [R * 0.55, 0.12]]) {
            ctx.save();
            ctx.rotate(t * sp);
            ctx.beginPath(); ctx.arc(0, 0, rr, 0, TAU); ctx.stroke();
            for (let k = 0; k < 24; k++) {
              const a = (k / 24) * TAU;
              ctx.beginPath(); ctx.moveTo(Math.cos(a) * rr, Math.sin(a) * rr); ctx.lineTo(Math.cos(a) * (rr - (k % 2 ? 5 : 10)), Math.sin(a) * (rr - (k % 2 ? 5 : 10))); ctx.stroke();
            }
            ctx.restore();
          }
          if (g.lit >= 0) {
            ctx.globalCompositeOperation = 'lighter';
            ctx.strokeStyle = cols[g.lit];
            ctx.lineWidth = 3;
            ctx.shadowColor = cols[g.lit];
            ctx.shadowBlur = 20;
            ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(pos[g.lit][0] - cx, pos[g.lit][1] - cy); ctx.stroke();
          }
          ctx.restore();
          pos.forEach(([x, y], i) => {
            const on = g.lit === i;
            const k = 1 - g.press[i] * 0.08;
            const rr = R * 0.28 * k;
            ctx.save();
            if (on) { ctx.globalCompositeOperation = 'lighter'; ctx.drawImage(glowSprite(cols[i]), x - rr * 2.2, y - rr * 2.2, rr * 4.4, rr * 4.4); ctx.globalCompositeOperation = 'source-over'; }
            // Piedra tallada con marco de latón
            hexPath(ctx, x, y, rr + 6, Math.PI / 6);
            ctx.fillStyle = '#3a2c1a';
            ctx.fill();
            ctx.lineWidth = 2; ctx.strokeStyle = '#d8aa50'; ctx.stroke();
            hexPath(ctx, x, y, rr, Math.PI / 6);
            const sg = ctx.createRadialGradient(x - rr * 0.3, y - rr * 0.4, 2, x, y, rr);
            if (on) { sg.addColorStop(0, '#ffffff'); sg.addColorStop(0.35, cols[i]); sg.addColorStop(1, '#1a1020'); } else { sg.addColorStop(0, '#4a4252'); sg.addColorStop(1, '#16121c'); }
            ctx.fillStyle = sg;
            ctx.fill();
            ctx.lineWidth = 2; ctx.strokeStyle = on ? '#fff' : cols[i]; ctx.globalAlpha = on ? 1 : 0.7; ctx.stroke();
            ctx.restore();
            glowText(ctx, glyph[i], x, y + 2, Math.round(rr * 0.8), on ? '#ffffff' : cols[i]);
            if (!U.touch) glowText(ctx, String(i + 1), x + rr * 0.8, y + rr * 0.75, 13, 'rgba(255,240,200,0.7)', 'system-ui, sans-serif');
          });
          // Mensaje en placa central
          plate(ctx, cx - 110, cy - 22, 220, 44, { top: 'rgba(40,30,20,0.9)', bot: 'rgba(14,10,8,0.95)', cut: 10 });
          glowText(ctx, g.msg, cx, cy, 20, '#ffe08a');
        },
        hud() { return bar('Secuencia', g.seq.length, target, '#3fa9f5') + `<span class="mg-num">${g.seq.length}/${target}</span><span class="mg-lives">${'<i></i>'.repeat(Math.max(0, g.lives))}</span>`; },
      };
      return g;
    },
  };

  // ---------- 6. Regateo en el mercado ----------
  GAMES.regateo = {
    title: 'Regateo en el mercado', icon: '', scene: 'mercado-nacar', grade: 'zaun', backdrops: ['mercado-nacar', 'canal-cobre', 'galerias', 'nacar'],
    desc: 'La vendedora pide 100 monedas por un cachivache que vale mucho menos. Haz ofertas: si te pasas de lista se enfadará, si ofreces poco perderá la paciencia.',
    controls: 'Flechas ← → (o los botones − y +) para ajustar tu oferta, Espacio, Intro o «Ofrecer» para ofrecer.', touchControls: 'Botones − y + para ajustar tu oferta, «Ofrecer» para ofrecer.',
    touchKeys: [['arrowright', '+'], [' ', 'Ofrecer'], ['arrowleft', '−']], touchLayout: 'column', goal: 'Cierra el trato por 60 monedas o menos.',
    winText: '«Trato hecho… me has desplumado», ríe la vendedora.', loseText: '«Fuera de mi puesto», te dice cruzándose de brazos.',
    create(w, h, o = {}) {
      const min = 38 + Math.floor(Math.random() * 18);
      const goal = 60 + 5 * (o.bonus || 0);
      const maxPat = 4 + (o.bonus || 0);
      // Botones dibujados (para ratón; en móvil están los botones grandes)
      const btns = U.touch ? [] : [
        { id: 'minus', label: '−', x: w / 2 - 190, y: h * 0.8, w: 60, h: 52 },
        { id: 'plus', label: '+', x: w / 2 + 130, y: h * 0.8, w: 60, h: 52 },
        { id: 'offer', label: 'Ofrecer', x: w / 2 - 70, y: h * 0.9, w: 140, h: 40 },
      ];
      const g = {
        offer: 40, ask: 100, patience: maxPat, msg: '¿Cuánto me das?', result: null, mood: 0, moodT: 0, shownOffer: 40, shownAsk: 100, hover: null,
        say(text, mood) { g.msg = text; g.mood = mood; g.moodT = 1; },
        offerNow() {
          Audio2.sfx.click();
          if (g.offer >= g.ask) { g.result = g.ask <= goal; g.msg = 'Hecho.'; return; }
          if (g.offer >= min) {
            g.ask = Math.max(g.offer, Math.round((g.ask + g.offer) / 2 - 2));
            if (g.ask - g.offer <= 3) {
              g.result = g.offer <= goal;
              if (g.result) FX.burst(w / 2, h * 0.62, 40, { color: ['#ffe08a', '#d8aa50', '#fff3c0'], kind: 'shard', speed: 380, size: 4, life: 0.9 });
              return;
            }
            g.say(`Hmm… ${g.ask}, y es mi última palabra. Bueno, casi.`, 1);
            FX.text(w / 2 + 120, h * 0.5, `${g.ask}`, '#e0457b', 26);
          } else {
            g.patience--;
            g.say(pick(['¿Me tomas el pelo?', '¡Eso es un insulto!', 'Ni en sueños, cariño.']), -1);
            FX.shake(8);
            if (g.patience <= 0) { g.result = false; }
          }
        },
        update(dt, inp) {
          g.moodT = Math.max(0, g.moodT - dt);
          g.shownOffer += (g.offer - g.shownOffer) * Math.min(1, dt * 12);
          g.shownAsk += (g.ask - g.shownAsk) * Math.min(1, dt * 6);
          const m = inp.mouse;
          g.hover = btns.find((b) => m.x > b.x && m.x < b.x + b.w && m.y > b.y && m.y < b.y + b.h)?.id || null;
          for (const k of inp.pressed) {
            if (k === 'arrowleft' || k === 'a') g.offer = Math.max(10, g.offer - 2);
            if (k === 'arrowright' || k === 'd') g.offer = Math.min(100, g.offer + 2);
            if (k === ' ' || k === 'enter') { g.offerNow(); if (g.result != null) return; }
          }
          for (const c of inp.mouse.clicks) {
            const b = btns.find((bb) => c.x > bb.x && c.x < bb.x + bb.w && c.y > bb.y && c.y < bb.y + bb.h);
            if (b?.id === 'minus') g.offer = Math.max(10, g.offer - 5);
            else if (b?.id === 'plus') g.offer = Math.min(100, g.offer + 5);
            else if (b?.id === 'offer') { g.offerNow(); if (g.result != null) return; }
          }
        },
        draw(ctx, t) {
          stageLight(ctx, w, h, t, { center: 0.45, ray: '255,180,100', fog: '120,230,190' });
          // Lámpara del puesto
          ctx.save();
          ctx.globalCompositeOperation = 'lighter';
          ctx.globalAlpha = 0.5 + Math.sin(t * 7) * 0.04;
          ctx.drawImage(glowSprite('#f0a040'), w / 2 - 260, -120, 520, 420);
          ctx.restore();
          // Balanza de latón: tus monedas a la izquierda y el módulo de Resonancia a la derecha.
          // El brazo se inclina según la distancia entre lo que pide y lo que ofreces.
          const ps = Math.min(h * 0.34, 210);
          const px = w / 2;
          const top = h * 0.07;
          const sh = g.mood < 0 && g.moodT ? Math.sin(t * 50) * 4 * g.moodT : 0;
          const rim = g.mood < 0 && g.moodT ? '#e05a5a' : g.mood > 0 && g.moodT ? '#e3c45a' : '#f0a040';
          const tilt = Math.max(-0.35, Math.min(0.35, (g.shownAsk - g.shownOffer) / 160)) + Math.sin(t * 1.6) * 0.015 + sh * 0.01;
          const arm = ps * 0.9;
          const pivot = { x: px, y: top + ps * 0.12 };
          // Columna y base
          const col = ctx.createLinearGradient(px - 8, 0, px + 8, 0);
          col.addColorStop(0, '#5a3e14'); col.addColorStop(0.5, '#f0d080'); col.addColorStop(1, '#5a3e14');
          ctx.fillStyle = col;
          ctx.fillRect(px - 6, pivot.y, 12, ps * 0.78);
          Depth.box(ctx, px - ps * 0.32, top + ps * 0.9, ps * 0.64, ps * 0.1, 0.1, px, h * 0.6, { front: '#8a6424', frontDark: '#3a2a10', top: '#c8a050', side: '#2a1a08' });
          // Engranaje que gira en el pivote
          ctx.save(); ctx.translate(pivot.x, pivot.y); ctx.rotate(tilt * 4);
          ctx.fillStyle = '#c8a050';
          ctx.beginPath(); for (let i = 0; i < 16; i++) { const ang = (i / 16) * TAU; const rr = i % 2 ? ps * 0.07 : ps * 0.09; ctx[i ? 'lineTo' : 'moveTo'](Math.cos(ang) * rr, Math.sin(ang) * rr); } ctx.closePath(); ctx.fill();
          ctx.fillStyle = '#2a1a08'; ctx.beginPath(); ctx.arc(0, 0, ps * 0.03, 0, TAU); ctx.fill();
          ctx.restore();
          // Brazo
          const ends = [-1, 1].map((d) => ({ x: pivot.x + Math.cos(tilt) * arm * d, y: pivot.y + Math.sin(tilt) * arm * d }));
          ctx.strokeStyle = '#d8aa50'; ctx.lineWidth = 6; ctx.lineCap = 'round';
          ctx.beginPath(); ctx.moveTo(ends[0].x, ends[0].y); ctx.lineTo(ends[1].x, ends[1].y); ctx.stroke();
          ctx.save(); ctx.shadowColor = rim; ctx.shadowBlur = 18; ctx.strokeStyle = rim; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.moveTo(ends[0].x, ends[0].y - 4); ctx.lineTo(ends[1].x, ends[1].y - 4); ctx.stroke(); ctx.restore();
          // Platillos colgando de cadenas
          ends.forEach((e, i) => {
            const py = e.y + ps * 0.42;
            ctx.strokeStyle = 'rgba(216,170,80,0.8)'; ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.moveTo(e.x, e.y); ctx.lineTo(e.x - ps * 0.18, py); ctx.moveTo(e.x, e.y); ctx.lineTo(e.x + ps * 0.18, py); ctx.stroke();
            const pg = ctx.createLinearGradient(0, py - 6, 0, py + 10);
            pg.addColorStop(0, '#f0d080'); pg.addColorStop(1, '#5a3e14');
            ctx.fillStyle = pg;
            ctx.beginPath(); ctx.ellipse(e.x, py, ps * 0.22, ps * 0.05, 0, 0, Math.PI); ctx.fill();
            ctx.beginPath(); ctx.ellipse(e.x, py, ps * 0.22, ps * 0.025, 0, 0, TAU); ctx.fill();
            if (i === 0) {
              // Pila de monedas que crece con tu oferta
              const n = Math.max(1, Math.round(g.shownOffer / 12));
              for (let k = 0; k < n; k++) {
                const cy = py - 4 - k * 4;
                const cgr = ctx.createLinearGradient(e.x - 12, cy, e.x + 12, cy);
                cgr.addColorStop(0, '#8a6422'); cgr.addColorStop(0.5, '#ffe08a'); cgr.addColorStop(1, '#8a6422');
                ctx.fillStyle = cgr;
                ctx.beginPath(); ctx.ellipse(e.x + ((k * 7) % 5) - 2, cy, 13, 4, 0, 0, TAU); ctx.fill();
              }
            } else {
              // El cachivache: un mecanismo con una gema que brilla y un engranaje que gira
              ctx.save(); ctx.translate(e.x, py - ps * 0.1);
              ctx.globalCompositeOperation = 'lighter';
              ctx.drawImage(glowSprite('#3fd0ff'), -ps * 0.16, -ps * 0.16, ps * 0.32, ps * 0.32);
              ctx.globalCompositeOperation = 'source-over';
              ctx.rotate(t * 1.2);
              ctx.strokeStyle = '#c8a050'; ctx.lineWidth = 3;
              ctx.beginPath(); ctx.arc(0, 0, ps * 0.07, 0, TAU); ctx.stroke();
              for (let k = 0; k < 8; k++) { const ang = (k / 8) * TAU; ctx.beginPath(); ctx.moveTo(Math.cos(ang) * ps * 0.07, Math.sin(ang) * ps * 0.07); ctx.lineTo(Math.cos(ang) * ps * 0.095, Math.sin(ang) * ps * 0.095); ctx.stroke(); }
              ctx.restore();
              Depth.orb(ctx, e.x, py - ps * 0.1, ps * 0.04, '#3fd0ff', { glow: true, dark: '#062030' });
            }
          });
          // Bocadillo
          ctx.font = "italic 24px 'Alegreya Sans', Georgia, serif";
          const tw = Math.min(w - 60, ctx.measureText(`«${g.msg}»`).width + 50);
          plate(ctx, w / 2 - tw / 2, h * 0.43 - 26, tw, 52, { top: 'rgba(44,34,26,0.92)', bot: 'rgba(20,14,10,0.95)', cut: 12, edge: 'rgba(240,160,64,0.6)' });
          glowText(ctx, `«${g.msg}»`, w / 2, h * 0.43, 21, '#f4efe6');
          // Barra de precios: lo que pide (rojo) y tu oferta (dorado)
          const bx = w / 2 - Math.min(300, w * 0.4);
          const bw = Math.min(600, w * 0.8);
          const by = h * 0.6;
          const at = (v) => bx + (v / 100) * bw;
          plate(ctx, bx - 10, by - 12, bw + 20, 24, { top: '#241c18', bot: '#0e0a08', cut: 8 });
          const fill = ctx.createLinearGradient(bx, 0, at(g.shownOffer), 0);
          fill.addColorStop(0, '#6a4a1a'); fill.addColorStop(1, '#f0c860');
          ctx.fillStyle = fill;
          ctx.fillRect(bx, by - 5, at(g.shownOffer) - bx, 10);
          ctx.fillStyle = 'rgba(224,69,123,0.25)';
          ctx.fillRect(at(g.shownAsk), by - 5, bx + bw - at(g.shownAsk), 10);
          ctx.strokeStyle = '#3fbf9f'; ctx.setLineDash([4, 4]); ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.moveTo(at(goal), by - 16); ctx.lineTo(at(goal), by + 16); ctx.stroke(); ctx.setLineDash([]);
          glowText(ctx, `meta ${goal}`, at(goal), by + 26, 12, '#7affd8', 'system-ui, sans-serif');
          for (const [v, col, lab] of [[g.shownAsk, '#e0457b', (n) => `Pide ${n}`], [g.shownOffer, '#ffe08a', (n) => `Tú ${n}`]]) {
            const x = at(v);
            ctx.save();
            ctx.translate(x, by);
            ctx.rotate(Math.PI / 4);
            ctx.fillStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 14;
            ctx.fillRect(-7, -7, 14, 14);
            ctx.restore();
            glowText(ctx, lab(Math.round(v)), x, by - 28, 15, col, 'system-ui, sans-serif');
          }
          glowText(ctx, `${g.offer}`, w / 2, h * 0.8 + 26, 42, '#ffe08a');
          for (const b of btns) {
            const hov = g.hover === b.id;
            plate(ctx, b.x, b.y, b.w, b.h, { top: hov ? '#5a4628' : '#3a2e22', bot: hov ? '#2a1e10' : '#16100a', edge: hov ? '#ffe08a' : 'rgba(216,170,80,0.7)', cut: 9, lw: 2 });
            glowText(ctx, b.label, b.x + b.w / 2, b.y + b.h / 2 + 1, b.id === 'offer' ? 18 : 30, hov ? '#fff6d8' : '#ffe08a');
          }
          if (U.touch) glowText(ctx, 'Pulsa «Ofrecer» para ofrecer', w / 2, h * 0.93, 16, '#a39cb3', 'system-ui, sans-serif');
        },
        hud() { return bar('Paciencia', g.patience, maxPat, '#e3c45a') + `<span class="mg-num">Meta: ≤ ${goal}</span>`; },
      };
      return g;
    },
  };

  // Qué minijuegos se pueden jugar en cada lugar del mapa (el primero es el principal).
  // El menú de cada ubicación usa Minigames.forPlace(id) y Minigames.play(id, { place }).
  const PLACE_GAMES = {
    'ascensor-central': ['circuito', 'francotiradora', 'persecucion'],
    archivo: ['circuito', 'runas'],
    observatorio: ['runas', 'francotiradora'],
    gremios: ['regateo', 'circuito'],
    cristal: ['persecucion', 'francotiradora'],
    'mercado-nacar': ['regateo', 'chompers'],
    galerias: ['aerotabla', 'persecucion', 'foso'],
    'jardin-musgo': ['aerotabla', 'chompers'],
    clinica: ['regateo', 'runas'],
    'canal-cobre': ['aerotabla', 'persecucion', 'foso'],
  };;
  // Lista de minijuegos con lo necesario para pintar un botón o una tarjeta.
  function list(ids = Object.keys(GAMES)) {
    return ids.filter((id) => GAMES[id]).map((id) => ({ id, title: GAMES[id].title, goal: GAMES[id].goal, desc: GAMES[id].desc, emblem: emblem(id), place: GAMES[id].scene }));
  }
  function forPlace(placeId) {
    const loc = Object.values(window.WORLD?.maps || {}).flatMap((m) => m.locations || []).find((l) => l.id === placeId);
    const ids = [loc?.activity?.game, ...(PLACE_GAMES[placeId] || [])].filter(Boolean);
    return list([...new Set(ids)]);
  }

  // Herramientas compartidas para los minijuegos de otros archivos (minigames-extra.js).
  const kit = { fx: () => FX, bar, glowText, plate, hexPath, glowSprite, buzz, stageLight, EMBLEM, opt };
  window.Minigames = { play, GAMES, emblem, list, forPlace, PLACE_GAMES, kit };
})();
