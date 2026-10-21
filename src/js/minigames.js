// Minijuegos: pelea en el foso, carrera por los tejados, aerotabla, galería de tiro,
// circuito hextec, runas de la Academia y regateo en el mercado.
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
    const S = { shake: 0, flash: 0, flashCol: '255,255,255', hurt: 0, slow: 0 };
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
        S.shake = Math.max(0, S.shake - dt * 40);
        S.flash = Math.max(0, S.flash - dt * 2.6);
        S.hurt = Math.max(0, S.hurt - dt * 1.6);
      },
      offset() { return S.shake ? [(Math.random() - 0.5) * S.shake, (Math.random() - 0.5) * S.shake] : [0, 0]; },
      draw(ctx, w, h) {
        ctx.save();
        for (const p of parts) {
          const a = Math.max(0, Math.min(1, p.life));
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
        for (const t of texts) {
          const k = t.life > 0.85 ? 1 + (t.life - 0.85) * 3 : 1;
          ctx.globalAlpha = Math.min(1, t.life * 1.6);
          ctx.font = `700 ${Math.round(t.size * k)}px Georgia, serif`;
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
      const sceneCtl = Scenes.mount(bg, def.scene);
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

      function size() {
        const r = stage.getBoundingClientRect();
        dpr = Math.min(2, window.devicePixelRatio || 1);
        W = Math.floor(r.width);
        H = Math.floor(r.height - hud.offsetHeight);
        canvas.width = Math.round(W * dpr);
        canvas.height = Math.round(H * dpr);
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
        game = def.create(W, H, { ...opts, bonus: (opts.bonus || 0) + (DIFF[opt().difficulty] || 0) });
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
        ctx.font = `700 ${Math.round(Math.min(W, H) * 0.22 * k)}px Georgia, serif`;
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
        const input = { keys, pressed: pressed.splice(0), mouse: { ...mouse, clicks: mouse.clicks.splice(0) } };
        if (count > 0) {
          const before = Math.ceil(count - 0.6);
          count -= raw;
          if (Math.ceil(count - 0.6) !== before) { Audio2.sfx.click(); buzz(15); }
        } else game.update(dt, input);
        FX.update(dt);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, W, H);
        const [ox, oy] = FX.offset();
        ctx.save();
        ctx.translate(ox, oy);
        game.draw(ctx, now / 1000);
        FX.draw(ctx, W, H);
        ctx.restore();
        vignette(ctx, W, H);
        if (count > 0) countdown();
        hud.innerHTML = game.hud();
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
          b.addEventListener('pointerleave', off);
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

  function glowText(ctx, text, x, y, size, color, font = 'Georgia, serif') {
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

  // Siluetas de edificios (fondo con paralaje para los juegos de Zaun).
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

  // ---------- 1. Pelea en el foso (reflejos) ----------
  const ARROWS = { arrowup: '▲', arrowdown: '▼', arrowleft: '◀', arrowright: '▶' };
  const ARROW_ANG = { arrowup: -Math.PI / 2, arrowdown: Math.PI / 2, arrowleft: Math.PI, arrowright: 0 };
  GAMES.foso = {
    touchKeys: [['arrowup', '▲'], ['arrowleft', '◀'], ['arrowdown', '▼'], ['arrowright', '▶']], touchLayout: 'dpad',
    title: 'Pelea en el foso', icon: '', scene: 'foso',
    desc: 'La multitud ruge. Tu rival ataca rápido: responde con la flecha correcta antes de que el anillo se cierre para esquivar y contraatacar.',
    controls: 'Flechas del teclado (o W A S D).', touchControls: 'Pulsa la flecha que aparece con los botones de la derecha.', goal: 'Deja a tu rival sin energía antes de que te pase a ti.',
    winText: 'Tu rival besa la lona. El foso corea tu nombre.', loseText: 'Acabas en el suelo. Levántate e inténtalo otra vez.',
    create(w, h, o) {
      const map = { w: 'arrowup', s: 'arrowdown', a: 'arrowleft', d: 'arrowright' };
      const rival = paintedImg(o.rivalLook || { skin: '#c9a080', face: 'angular', eyes: 'rasgados', hair: '#5a4a5a', style: 'undercut', outfit: 'top', outfitColor: '#2a2a2a', accents: ['arm', 'scar'], browAngle: 3 }, '#e0457b', ['#5a1a1a', '#0a0202']);
      const b = o.bonus || 0;
      const crowd = Array.from({ length: Math.ceil(w / 26) + 2 }, (_, i) => ({ x: i * 26 - 13, s: 0.8 + Math.random() * 0.5, ph: Math.random() * TAU, row: i % 2 }));
      const s = Math.min(w, h) * 0.46;
      const cx = w / 2;
      const cy = h * 0.42;
      const g = {
        me: 100 + 25 * b, foe: 100, prompt: null, wait: 0.8, hit: 0, recoil: 0, lunge: 0, hits: 0, combo: 0, speed: 1.35 + 0.1 * b,
        result: null,
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
          // Foco y niebla del foso
          ctx.fillStyle = 'rgba(8,4,6,0.35)';
          ctx.fillRect(0, 0, w, h);
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
          ctx.save();
          ctx.shadowColor = '#e0457b';
          ctx.shadowBlur = 40 + Math.sin(t * 3) * 10;
          ctx.fillStyle = '#1a0a0e';
          ctx.beginPath(); ctx.arc(rx, ry, rs / 2 + 10, 0, TAU); ctx.fill();
          ctx.restore();
          ctx.save();
          ctx.beginPath(); ctx.arc(rx, ry, rs / 2, 0, TAU); ctx.clip();
          if (rival.complete) ctx.drawImage(rival, rx - rs / 2, ry - rs / 2, rs, rs);
          const shade = ctx.createRadialGradient(rx, ry - rs * 0.2, rs * 0.1, rx, ry, rs * 0.55);
          shade.addColorStop(0, 'rgba(0,0,0,0)'); shade.addColorStop(1, 'rgba(40,0,10,0.55)');
          ctx.fillStyle = shade;
          ctx.fillRect(rx - rs / 2, ry - rs / 2, rs, rs);
          if (g.hit) { ctx.fillStyle = `rgba(255,240,220,${g.hit * 0.55})`; ctx.fillRect(rx - rs / 2, ry - rs / 2, rs, rs); }
          ctx.restore();
          ctx.lineWidth = 7; ctx.strokeStyle = '#3a1418'; ctx.beginPath(); ctx.arc(rx, ry, rs / 2 + 4, 0, TAU); ctx.stroke();
          ctx.lineWidth = 2.5; ctx.strokeStyle = '#e0457b'; ctx.beginPath(); ctx.arc(rx, ry, rs / 2 + 4, 0, TAU); ctx.stroke();
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
      title: fly ? 'Vuelo en aerotabla' : 'Carrera por los tejados', icon: '', scene: fly ? 'arbol' : 'tejados',
      desc: fly
        ? 'Surca las profundidades de Zaun en una aerotabla de las Luciérnagas, esquivando tuberías y chimeneas.'
        : 'Huye por los tejados de las Chimeneas. Salta los huecos y las chimeneas sin que te atrapen.',
      controls: fly ? 'Mantén Espacio, ↑ o el ratón para subir.' : 'Espacio, ↑ o clic para saltar (doble salto permitido).',
      touchControls: fly ? 'Mantén el dedo en la pantalla para subir.' : 'Toca la pantalla para saltar (doble salto permitido).',
      goal: 'Aguanta 25 segundos sin chocar.',
      winText: fly ? 'Aterrizas en el árbol entre aplausos de las Luciérnagas.' : 'Te pierdes entre las sombras. Nadie te ha visto.',
      loseText: '¡Crash! Te has dado un buen golpe. Otra vez.',
      create(w, h, o = {}) {
        const ground = h * 0.78;
        const goal = Math.max(13, 25 - 4 * (o.bonus || 0));
        const far = skyline(fly ? 7 : 3, 40, h * 0.25, h * 0.6);
        const mid = skyline(fly ? 11 : 5, 40, h * 0.15, h * 0.4);
        const motes = Array.from({ length: 50 }, () => ({ x: Math.random() * w, y: Math.random() * h, z: 0.3 + Math.random() * 0.9, ph: Math.random() * TAU }));
        const g = {
          t: 0, x: w * 0.22, y: fly ? h / 2 : ground, vy: 0, jumps: 0, speed: 320, obs: [], spawn: 1, result: null, dist: 0, run: 0, land: 0, crashed: false,
          update(dt, inp) {
            g.t += dt;
            g.speed = 320 + g.t * 12;
            g.dist += g.speed * dt;
            const want = inp.keys.has(' ') || inp.keys.has('arrowup') || inp.keys.has('w') || inp.mouse.down;
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
              FX.shake(20);
            }
            g.obs = g.obs.filter((ob) => ob.x + ob.w > -40);
            if (g.t >= goal && g.result == null) g.result = true;
          },
          draw(ctx, t) {
            // Fondo con paralaje: ciudad lejana, ciudad media, motas de luz
            const sky = ctx.createLinearGradient(0, 0, 0, h);
            if (fly) { sky.addColorStop(0, 'rgba(4,18,16,0.55)'); sky.addColorStop(1, 'rgba(10,40,30,0.75)'); } else { sky.addColorStop(0, 'rgba(20,14,30,0.45)'); sky.addColorStop(0.7, 'rgba(60,30,40,0.35)'); sky.addColorStop(1, 'rgba(10,8,14,0.6)'); }
            ctx.fillStyle = sky;
            ctx.fillRect(0, 0, w, h);
            drawSkyline(ctx, far, g.dist * 0.15, fly ? h * 0.95 : ground - 30, fly ? 'rgba(10,30,26,0.85)' : 'rgba(24,18,32,0.85)', fly ? 'rgba(90,255,200,0.35)' : 'rgba(255,190,110,0.4)', h);
            drawSkyline(ctx, mid, g.dist * 0.4, fly ? h * 1.05 : ground + 4, fly ? 'rgba(6,20,18,0.95)' : 'rgba(14,10,20,0.95)', fly ? 'rgba(90,255,200,0.5)' : 'rgba(255,170,90,0.55)', h);
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            for (const m of motes) {
              const x = ((m.x - g.dist * m.z * 0.3) % w + w) % w;
              const y = m.y + Math.sin(t * 1.3 + m.ph) * 8;
              const sz = 6 + m.z * 8;
              ctx.globalAlpha = 0.25 + 0.35 * Math.abs(Math.sin(t * 2 + m.ph));
              ctx.drawImage(glowSprite(fly ? '#7affd0' : '#ffb070'), x - sz / 2, y - sz / 2, sz, sz);
            }
            ctx.restore();
            if (!fly) {
              // Tejado en primer plano: tejas y canalón
              ctx.fillStyle = '#1c1820';
              ctx.fillRect(0, ground + 16, w, h - ground);
              ctx.fillStyle = '#3a3040';
              ctx.fillRect(0, ground + 16, w, 5);
              ctx.strokeStyle = 'rgba(255,255,255,0.05)';
              ctx.lineWidth = 2;
              const off = g.dist % 28;
              for (let x = -off; x < w; x += 28) { ctx.beginPath(); ctx.moveTo(x, ground + 22); ctx.lineTo(x - 10, h); ctx.stroke(); }
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
                gg.addColorStop(0, '#020204'); gg.addColorStop(1, 'rgba(60,140,90,0.35)');
                ctx.fillStyle = gg;
                ctx.fillRect(ob.x, ground + 16, ob.w, h - ground);
                ctx.fillStyle = '#4a3a2a';
                ctx.fillRect(ob.x - 4, ground + 14, 4, 10);
                ctx.fillRect(ob.x + ob.w, ground + 14, 4, 10);
              } else {
                // Chimenea de ladrillo
                const top = ground + 16 - ob.hgt;
                ctx.fillStyle = '#4a2a22';
                ctx.fillRect(ob.x, top, ob.w, ob.hgt);
                ctx.strokeStyle = 'rgba(0,0,0,0.35)';
                ctx.lineWidth = 1;
                for (let y = top + 8; y < ground + 16; y += 8) {
                  ctx.beginPath(); ctx.moveTo(ob.x, y); ctx.lineTo(ob.x + ob.w, y); ctx.stroke();
                  const o2 = ((y - top) / 8) % 2 ? 0 : 9;
                  for (let x = ob.x + o2; x < ob.x + ob.w; x += 18) { ctx.beginPath(); ctx.moveTo(x, y - 8); ctx.lineTo(x, y); ctx.stroke(); }
                }
                ctx.fillStyle = '#2a1a16';
                ctx.fillRect(ob.x - 4, top - 6, ob.w + 8, 8);
                ctx.fillStyle = 'rgba(255,255,255,0.08)';
                ctx.fillRect(ob.x, top, 4, ob.hgt);
              }
            }
            // Jugador
            ctx.save();
            ctx.translate(g.x, g.y);
            if (fly) {
              ctx.rotate(g.vy / 1300);
              // Aerotabla con propulsores
              ctx.save();
              ctx.globalCompositeOperation = 'lighter';
              ctx.globalAlpha = 0.8;
              ctx.drawImage(glowSprite('#5affd0'), -36, 6, 72, 26);
              ctx.restore();
              const bg = ctx.createLinearGradient(-26, 0, 26, 0);
              bg.addColorStop(0, '#2a4a42'); bg.addColorStop(0.5, '#6ad8b8'); bg.addColorStop(1, '#2a4a42');
              ctx.fillStyle = bg;
              ctx.beginPath(); ctx.ellipse(0, 16, 28, 5, 0, 0, TAU); ctx.fill();
              ctx.fillStyle = '#d8aa50';
              ctx.fillRect(-20, 19, 8, 4); ctx.fillRect(12, 19, 8, 4);
            }
            // Figura con capucha y bufanda al viento
            const leg = fly ? 0.3 : g.y < ground - 1 ? 0.6 : Math.sin(g.run);
            ctx.strokeStyle = '#1a1420';
            ctx.lineCap = 'round';
            ctx.lineWidth = 6;
            ctx.beginPath(); ctx.moveTo(0, 2); ctx.lineTo(-leg * 9, 16 - g.land * 3); ctx.moveTo(0, 2); ctx.lineTo(leg * 9, 16 - g.land * 3); ctx.stroke();
            ctx.strokeStyle = '#e0457b';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(-2, -12);
            ctx.quadraticCurveTo(-16, -14 + Math.sin(t * 14) * 3, -26, -8 + Math.sin(t * 12) * 4);
            ctx.stroke();
            const body = ctx.createLinearGradient(-10, -14, 10, 4);
            body.addColorStop(0, '#5a2a3a'); body.addColorStop(1, '#2a1420');
            ctx.fillStyle = body;
            ctx.beginPath(); ctx.moveTo(-9, 4); ctx.lineTo(-7, -12); ctx.lineTo(7, -12); ctx.lineTo(9, 4); ctx.closePath(); ctx.fill();
            ctx.strokeStyle = '#2a1420';
            ctx.lineWidth = 4;
            ctx.beginPath(); ctx.moveTo(-5, -8); ctx.lineTo(-12 - leg * 4, 0); ctx.moveTo(5, -8); ctx.lineTo(12 + leg * 4, -2); ctx.stroke();
            ctx.fillStyle = '#e8b394';
            ctx.beginPath(); ctx.arc(1, -19, 7, 0, TAU); ctx.fill();
            ctx.fillStyle = '#2a1a24';
            ctx.beginPath(); ctx.arc(0, -20, 8.5, Math.PI * 0.9, Math.PI * 2.05); ctx.fill();
            ctx.restore();
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
    title: 'Galería de tiro', icon: '', scene: 'ejecutores',
    desc: 'Dianas hextec aparecen y desaparecen. Dispara a las dianas azules y no toques los muñecos de civiles.',
    controls: 'Ratón: apunta y haz clic para disparar.', touchControls: 'Toca los objetivos para disparar.', goal: 'Consigue 15 puntos en 30 segundos.',
    winText: 'Caitlyn estaría orgullosa. Puntería de francotirador.', loseText: 'Demasiadas balas perdidas. Respira, apunta, exhala.',
    create(w, h, o = {}) {
      const need = Math.max(8, 15 - 2 * (o.bonus || 0));
      const g = {
        t: 0, score: 0, targets: [], spawn: 0.3, holes: [], muzzle: 0, result: null, lastMouse: null, streak: 0,
        update(dt, inp) {
          g.lastMouse = { x: inp.mouse.x, y: inp.mouse.y };
          g.t += dt;
          g.muzzle = Math.max(0, g.muzzle - dt * 8);
          g.spawn -= dt;
          if (g.spawn <= 0) {
            g.spawn = Math.max(0.35, 0.8 - g.t * 0.012);
            g.targets.push({ x: 70 + Math.random() * (w - 140), y: 70 + Math.random() * (h - 160), r: 28 + Math.random() * 12, life: 1.6, max: 1.6, civ: Math.random() < 0.22, vx: (Math.random() - 0.5) * 120, born: 0 });
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
                FX.text(c.x, c.y - 20, '-3 ¡Civil!', '#ff6a6a', 28); FX.hurt(0.6);
                FX.burst(c.x, c.y, 18, { color: ['#d9c9a0', '#8a7a5a'], kind: 'shard', speed: 260, size: 4, life: 0.8 });
              } else {
                const center = Math.hypot(hit.x - c.x, hit.y - c.y) < hit.r * 0.35;
                g.score += 1; g.streak++;
                FX.text(c.x, c.y - 20, center ? '¡Diana! +1' : '+1', center ? '#ffe08a' : '#7fd0ff', center ? 30 : 26);
                FX.burst(c.x, c.y, center ? 34 : 22, { color: ['#7fd0ff', '#bfeaff', '#3fa9f5'], kind: 'shard', speed: center ? 420 : 300, size: 3.5, life: 0.7 });
                FX.burst(c.x, c.y, 10, { color: '#ffe08a', kind: 'spark', speed: 300, life: 0.4 });
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
          ctx.fillStyle = 'rgba(6,8,14,0.4)';
          ctx.fillRect(0, 0, w, h);
          // Raíles por los que se mueven las dianas
          ctx.strokeStyle = 'rgba(227,196,90,0.15)';
          ctx.lineWidth = 2;
          for (let y = 90; y < h; y += 110) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
          for (const ho of g.holes) {
            ctx.globalAlpha = Math.min(1, ho.life);
            ctx.fillStyle = '#0a0806';
            ctx.beginPath(); ctx.arc(ho.x, ho.y, 3.5, 0, TAU); ctx.fill();
            ctx.strokeStyle = 'rgba(200,180,140,0.4)';
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.arc(ho.x, ho.y, 6, 0, TAU); ctx.stroke();
          }
          ctx.globalAlpha = 1;
          for (const tg of g.targets) {
            const a = Math.min(1, tg.life * 3);
            const pop = 0.5 + 0.5 * (1 - Math.pow(1 - tg.born, 3));
            ctx.save();
            ctx.globalAlpha = a;
            ctx.translate(tg.x, tg.y);
            ctx.scale(pop, pop);
            // Soporte
            ctx.fillStyle = '#2a2a30';
            ctx.fillRect(-3, tg.r * 0.8, 6, 40);
            if (tg.civ) {
              // Silueta de cartón de un civil
              ctx.fillStyle = '#cdb88e';
              ctx.strokeStyle = '#6a5a3a';
              ctx.lineWidth = 2;
              ctx.beginPath(); ctx.arc(0, -tg.r * 0.45, tg.r * 0.38, 0, TAU); ctx.fill(); ctx.stroke();
              ctx.beginPath(); ctx.moveTo(-tg.r * 0.6, tg.r * 0.9); ctx.quadraticCurveTo(-tg.r * 0.6, -tg.r * 0.05, 0, -tg.r * 0.05); ctx.quadraticCurveTo(tg.r * 0.6, -tg.r * 0.05, tg.r * 0.6, tg.r * 0.9); ctx.closePath(); ctx.fill(); ctx.stroke();
              ctx.fillStyle = '#c0453a';
              ctx.font = `bold ${Math.round(tg.r * 0.3)}px Georgia, serif`;
              ctx.textAlign = 'center';
              ctx.fillText('CIVIL', 0, tg.r * 0.55);
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
    title: 'Circuito hextec', icon: '', scene: 'taller-jayce',
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
          ctx.fillStyle = 'rgba(8,10,16,0.55)';
          ctx.fillRect(0, 0, w, h);
          // Placa base del tablero
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
    title: 'Runas de la Academia', icon: '', scene: 'academia',
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
          ctx.fillStyle = 'rgba(10,8,14,0.5)';
          ctx.fillRect(0, 0, w, h);
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
    title: 'Regateo en el mercado', icon: '', scene: 'mercado',
    desc: 'La vendedora pide 100 monedas por un cachivache que vale mucho menos. Haz ofertas: si te pasas de lista se enfadará, si ofreces poco perderá la paciencia.',
    controls: 'Flechas ← → (o los botones − y +) para ajustar tu oferta, Espacio, Intro o «Ofrecer» para ofrecer.', touchControls: 'Botones − y + para ajustar tu oferta, «Ofrecer» para ofrecer.',
    touchKeys: [['arrowright', '+'], [' ', 'Ofrecer'], ['arrowleft', '−']], touchLayout: 'column', goal: 'Cierra el trato por 60 monedas o menos.',
    winText: '«Trato hecho… me has desplumado», ríe la vendedora.', loseText: '«Fuera de mi puesto», te dice cruzándose de brazos.',
    create(w, h, o = {}) {
      const min = 38 + Math.floor(Math.random() * 18);
      const goal = 60 + 5 * (o.bonus || 0);
      const maxPat = 4 + (o.bonus || 0);
      const vendor = paintedImg({ skin: '#c9946a', face: 'redondo', eyes: 'cansados', eyeColor: '#5a3a1a', brows: 'gruesas', hair: '#6a6a7a', style: 'bun', outfit: 'harapos', outfitColor: '#6a3a5a', accents: ['goggles'] }, '#f0a040', ['#4a2a3a', '#0a0608']);
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
          ctx.fillStyle = 'rgba(10,6,10,0.45)';
          ctx.fillRect(0, 0, w, h);
          // Lámpara del puesto
          ctx.save();
          ctx.globalCompositeOperation = 'lighter';
          ctx.globalAlpha = 0.5 + Math.sin(t * 7) * 0.04;
          ctx.drawImage(glowSprite('#f0a040'), w / 2 - 260, -120, 520, 420);
          ctx.restore();
          // Vendedora
          const ps = Math.min(h * 0.34, 210);
          const px = w / 2;
          const py = h * 0.24;
          const sh = g.mood < 0 && g.moodT ? Math.sin(t * 50) * 6 * g.moodT : 0;
          const rim = g.mood < 0 && g.moodT ? '#e05a5a' : g.mood > 0 && g.moodT ? '#e3c45a' : '#f0a040';
          ctx.save();
          ctx.shadowColor = rim; ctx.shadowBlur = 30;
          hexPath(ctx, px + sh, py, ps / 2 + 8, Math.PI / 6);
          ctx.fillStyle = '#1a1014'; ctx.fill();
          ctx.restore();
          ctx.save();
          hexPath(ctx, px + sh, py, ps / 2, Math.PI / 6);
          ctx.clip();
          if (vendor.complete) ctx.drawImage(vendor, px + sh - ps / 2, py - ps / 2, ps, ps);
          ctx.restore();
          hexPath(ctx, px + sh, py, ps / 2 + 3, Math.PI / 6);
          ctx.lineWidth = 3; ctx.strokeStyle = rim; ctx.stroke();
          // Bocadillo
          ctx.font = 'italic 22px Georgia, serif';
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
          // Monedas que crecen con tu oferta
          const coins = Math.round(g.shownOffer / 10);
          for (let i = 0; i < coins; i++) {
            const cx = w / 2 - 50 + (i % 5) * 26;
            const cy = h * 0.735 - Math.floor(i / 5) * 6;
            const cg = ctx.createLinearGradient(cx - 10, cy - 4, cx + 10, cy + 4);
            cg.addColorStop(0, '#8a6422'); cg.addColorStop(0.5, '#ffe08a'); cg.addColorStop(1, '#8a6422');
            ctx.fillStyle = cg;
            ctx.beginPath(); ctx.ellipse(cx, cy, 11, 4.5, 0, 0, TAU); ctx.fill();
            ctx.strokeStyle = '#5a3a10'; ctx.lineWidth = 1; ctx.stroke();
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

  window.Minigames = { play, GAMES, emblem };
})();
