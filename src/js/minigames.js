// Minijuegos: pelea en el foso, carrera por los tejados, aerotabla, galería de tiro,
// circuito hextec, runas de la Academia y regateo en el mercado.
// Minigames.play(id) abre el minijuego a pantalla completa y resuelve true si se gana.
(function () {
  const GAMES = {};
  const pick = (a) => a[Math.floor(Math.random() * a.length)];

  // ---------- Marco común ----------
  function play(id, opts = {}) {
    const def = GAMES[id];
    if (!def) return Promise.resolve(true);
    return new Promise((resolve) => {
      const box = document.createElement('div');
      box.className = 'mg';
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
      const keys = new Set();
      const pressed = [];
      const mouse = { x: 0, y: 0, clicks: [], down: false };

      function size() {
        const r = stage.getBoundingClientRect();
        canvas.width = Math.floor(r.width);
        canvas.height = Math.floor(r.height - hud.offsetHeight);
      }

      function card(title, html, buttons) {
        const c = document.createElement('div');
        c.className = 'mg-card panel';
        c.innerHTML = `<h2>${title}</h2>${html}`;
        const row = document.createElement('div');
        row.className = 'row gap center';
        for (const [label, cls, fn] of buttons) {
          const b = document.createElement('button');
          b.className = `btn ${cls}`;
          b.textContent = label;
          b.onclick = fn;
          row.append(b);
        }
        c.append(row);
        stage.append(c);
        setTimeout(() => c.querySelector('.btn.primary')?.focus(), 50);
        return c;
      }

      function intro() {
        const c = card(`${def.icon} ${def.title}`, `<p>${def.desc}</p><p class="muted"><b>Controles:</b> ${def.controls}</p><p class="gold">Objetivo: ${def.goal}</p>${opts.bonus ? `<p class="mg-bonus">✨ Tus habilidades te dan ventaja +${opts.bonus} en este minijuego.</p>` : ''}`,
          [['¡Empezar!', 'primary hex-btn', () => { c.remove(); start(); }], ['Salir', 'ghost', () => close(false)]]);
      }

      function start() {
        size();
        game = def.create(canvas.width, canvas.height, opts);
        running = true;
        last = performance.now();
        Audio2.sfx.choice();
        requestAnimationFrame(loop);
      }

      function loop(now) {
        if (!running) return;
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        const input = { keys, pressed: pressed.splice(0), mouse: { ...mouse, clicks: mouse.clicks.splice(0) } };
        game.update(dt, input);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.draw(ctx, now / 1000);
        hud.innerHTML = game.hud();
        if (game.result != null) {
          running = false;
          setTimeout(() => result(game.result), 500);
          return;
        }
        requestAnimationFrame(loop);
      }

      function result(win) {
        if (win) Audio2.sfx.unlock(); else Audio2.sfx.locked();
        const c = card(win ? '🏆 ¡Victoria!' : '💥 Derrota', `<p>${win ? def.winText : def.loseText}</p>`,
          win ? [['Continuar', 'primary', () => close(true)]]
            : [['Reintentar', 'primary', () => { c.remove(); start(); }], ['Rendirse', 'ghost', () => close(false)]]);
      }

      function close(win) {
        running = false;
        sceneCtl.stop();
        window.removeEventListener('keydown', kd, true);
        window.removeEventListener('keyup', ku, true);
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
      canvas.addEventListener('mousemove', pos);
      canvas.addEventListener('mousedown', (e) => { pos(e); mouse.down = true; mouse.clicks.push({ x: mouse.x, y: mouse.y }); });
      window.addEventListener('mouseup', () => { mouse.down = false; });

      intro();
    });
  }

  function bar(label, v, max, color) {
    return `<span class="mg-meter"><b>${label}</b><i style="width:${Math.max(0, (v / max) * 100)}%;background:${color}"></i></span>`;
  }

  function panelBg(ctx, w, h, a = 0.35) {
    ctx.fillStyle = `rgba(5,4,10,${a})`;
    ctx.fillRect(0, 0, w, h);
  }

  function glowText(ctx, text, x, y, size, color) {
    ctx.save();
    ctx.font = `bold ${size}px Georgia, serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
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

  // ---------- 1. Pelea en el foso (reflejos) ----------
  const ARROWS = { arrowup: '▲', arrowdown: '▼', arrowleft: '◀', arrowright: '▶' };
  GAMES.foso = {
    title: 'Pelea en el foso', icon: '🥊', scene: 'foso',
    desc: 'La multitud ruge. Tu rival ataca rápido: responde con la flecha correcta antes de que el anillo se cierre para esquivar y contraatacar.',
    controls: 'Flechas del teclado (o W A S D).', goal: 'Deja a tu rival sin energía antes de que te pase a ti.',
    winText: 'Tu rival besa la lona. El foso corea tu nombre.', loseText: 'Acabas en el suelo. Levántate e inténtalo otra vez.',
    create(w, h, o) {
      const map = { w: 'arrowup', s: 'arrowdown', a: 'arrowleft', d: 'arrowright' };
      const rival = paintedImg(o.rivalLook || { skin: '#c9a080', face: 'angular', eyes: 'rasgados', hair: '#5a4a5a', style: 'undercut', outfit: 'top', outfitColor: '#2a2a2a', accents: ['arm', 'scar'], browAngle: 3 }, '#e0457b', ['#5a1a1a', '#0a0202']);
      const b = o.bonus || 0;
      const g = {
        me: 100 + 25 * b, foe: 100, prompt: null, wait: 0.8, flash: 0, shake: 0, hits: 0, msg: '', msgT: 0, speed: 1.35 + 0.1 * b,
        result: null,
        next() { g.prompt = { key: pick(Object.keys(ARROWS)), t: 0, dur: g.speed }; },
        update(dt, inp) {
          g.flash = Math.max(0, g.flash - dt * 3); g.shake = Math.max(0, g.shake - dt * 20); g.msgT -= dt;
          if (!g.prompt) { g.wait -= dt; if (g.wait <= 0) g.next(); return; }
          g.prompt.t += dt;
          const keyHit = inp.pressed.map((k) => map[k] || k).find((k) => ARROWS[k]);
          if (keyHit) {
            if (keyHit === g.prompt.key) {
              const quality = 1 - g.prompt.t / g.prompt.dur;
              g.foe -= Math.round((10 + quality * 10) * (1 + 0.25 * b)); g.flash = 1; g.hits++; g.msg = quality > 0.6 ? '¡GOLPE PERFECTO!' : '¡Golpe!'; g.msgT = 0.7;
              Audio2.sfx.choice();
            } else { g.me -= 14; g.shake = 12; g.msg = '¡Te alcanza!'; g.msgT = 0.7; Audio2.sfx.locked(); }
            g.prompt = null; g.wait = 0.25 + Math.random() * 0.5; g.speed = Math.max(0.6, g.speed - 0.04);
          } else if (g.prompt.t > g.prompt.dur) {
            g.me -= 16; g.shake = 14; g.msg = '¡Demasiado lento!'; g.msgT = 0.7; Audio2.sfx.locked();
            g.prompt = null; g.wait = 0.5;
          }
          if (g.foe <= 0) g.result = true;
          else if (g.me <= 0) g.result = false;
        },
        draw(ctx, t) {
          ctx.save();
          if (g.shake) ctx.translate((Math.random() - 0.5) * g.shake, (Math.random() - 0.5) * g.shake);
          panelBg(ctx, w, h, 0.3);
          const s = Math.min(w, h) * 0.5;
          const bob = Math.sin(t * 4) * 6;
          ctx.save();
          ctx.beginPath(); ctx.arc(w / 2, h * 0.42 + bob, s / 2, 0, 7); ctx.clip();
          if (rival.complete) ctx.drawImage(rival, w / 2 - s / 2, h * 0.42 + bob - s / 2, s, s);
          ctx.restore();
          if (g.flash) { ctx.fillStyle = `rgba(255,255,255,${g.flash * 0.5})`; ctx.beginPath(); ctx.arc(w / 2, h * 0.42 + bob, s / 2, 0, 7); ctx.fill(); }
          ctx.strokeStyle = '#e0457b'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(w / 2, h * 0.42 + bob, s / 2, 0, 7); ctx.stroke();
          if (g.prompt) {
            const k = 1 - g.prompt.t / g.prompt.dur;
            const cx = w / 2;
            const cy = h * 0.82;
            ctx.strokeStyle = k > 0.5 ? '#3fbf9f' : k > 0.25 ? '#e3c45a' : '#e05a5a';
            ctx.lineWidth = 8;
            ctx.beginPath(); ctx.arc(cx, cy, 30 + 70 * k, 0, 7); ctx.stroke();
            glowText(ctx, ARROWS[g.prompt.key], cx, cy, 56, '#fff');
          }
          if (g.msgT > 0) glowText(ctx, g.msg, w / 2, h * 0.12, 34, '#ffe08a');
          ctx.restore();
        },
        hud() { return bar('Tú', g.me, 100 + 25 * b, '#3fbf9f') + bar('Rival', g.foe, 100, '#e0457b') + (b ? `<span class="gold">Ventaja +${b}</span>` : ''); },
      };
      return g;
    },
  };

  // ---------- 2. Carrera por los tejados / Aerotabla ----------
  function runner(mode) {
    const fly = mode === 'fly';
    return {
      title: fly ? 'Vuelo en aerotabla' : 'Carrera por los tejados', icon: fly ? '🛹' : '🏃', scene: fly ? 'arbol' : 'tejados',
      desc: fly
        ? 'Surca las profundidades de Zaun en una aerotabla de las Luciérnagas, esquivando tuberías y chimeneas.'
        : 'Huye por los tejados de las Chimeneas. Salta los huecos y las chimeneas sin que te atrapen.',
      controls: fly ? 'Mantén Espacio, ↑ o el ratón para subir.' : 'Espacio, ↑ o clic para saltar (doble salto permitido).',
      goal: 'Aguanta 25 segundos sin chocar.',
      winText: fly ? 'Aterrizas en el árbol entre aplausos de las Luciérnagas.' : 'Te pierdes entre las sombras. Nadie te ha visto.',
      loseText: '¡Crash! Te has dado un buen golpe. Otra vez.',
      create(w, h, o = {}) {
        const ground = h * 0.8;
        const goal = Math.max(13, 25 - 4 * (o.bonus || 0));
        const g = {
          t: 0, x: w * 0.2, y: fly ? h / 2 : ground, vy: 0, jumps: 0, speed: 320, obs: [], spawn: 1, result: null, trail: [],
          update(dt, inp) {
            g.t += dt;
            g.speed = 320 + g.t * 12;
            const want = inp.keys.has(' ') || inp.keys.has('arrowup') || inp.keys.has('w') || inp.mouse.down;
            if (fly) {
              g.vy += (want ? -900 : 700) * dt;
              g.vy = Math.max(-420, Math.min(460, g.vy));
              g.y += g.vy * dt;
              if (g.y < 20 || g.y > h - 20) g.result = false;
            } else {
              const jumpNow = inp.pressed.some((k) => [' ', 'arrowup', 'w'].includes(k)) || inp.mouse.clicks.length;
              if (jumpNow && g.jumps < 2) { g.vy = -620; g.jumps++; Audio2.sfx.click(); }
              g.vy += 1700 * dt;
              g.y += g.vy * dt;
              const onGap = g.obs.some((o) => o.gap && g.x > o.x && g.x < o.x + o.w);
              if (!onGap && g.y >= ground) { g.y = ground; g.vy = 0; g.jumps = 0; }
              if (g.y > h + 40) g.result = false;
            }
            g.spawn -= dt;
            if (g.spawn <= 0) {
              g.spawn = 0.9 + Math.random() * 0.8 - Math.min(0.5, g.t * 0.01);
              if (fly) {
                const gapY = 80 + Math.random() * (h - 160);
                g.obs.push({ x: w + 20, w: 50, top: gapY - 95, bot: gapY + 95 });
              } else if (Math.random() < 0.4) g.obs.push({ x: w + 20, w: 90 + Math.random() * 60, gap: true });
              else g.obs.push({ x: w + 20, w: 34, hgt: 40 + Math.random() * 50 });
            }
            for (const o of g.obs) {
              o.x -= g.speed * dt;
              if (fly) {
                if (g.x + 14 > o.x && g.x - 14 < o.x + o.w && (g.y - 14 < o.top || g.y + 14 > o.bot)) g.result = false;
              } else if (!o.gap && g.x + 14 > o.x && g.x - 14 < o.x + o.w && g.y > ground - o.hgt) g.result = false;
            }
            g.obs = g.obs.filter((o) => o.x + o.w > -40);
            g.trail.push({ x: g.x, y: g.y });
            if (g.trail.length > 14) g.trail.shift();
            if (g.t >= goal && g.result == null) g.result = true;
          },
          draw(ctx, t) {
            panelBg(ctx, w, h, 0.2);
            if (!fly) {
              ctx.fillStyle = '#1a1a24';
              ctx.fillRect(0, ground + 16, w, h - ground);
              ctx.fillStyle = '#2a2a36';
              ctx.fillRect(0, ground + 16, w, 6);
            }
            for (const o of g.obs) {
              if (fly) {
                ctx.fillStyle = '#2a3a34'; ctx.fillRect(o.x, 0, o.w, o.top); ctx.fillRect(o.x, o.bot, o.w, h - o.bot);
                ctx.fillStyle = '#3fbf9f'; ctx.fillRect(o.x - 4, o.top - 10, o.w + 8, 10); ctx.fillRect(o.x - 4, o.bot, o.w + 8, 10);
              } else if (o.gap) {
                ctx.fillStyle = '#05050a'; ctx.fillRect(o.x, ground + 16, o.w, h - ground);
              } else {
                ctx.fillStyle = '#3a2a2a'; ctx.fillRect(o.x, ground + 16 - o.hgt, o.w, o.hgt);
                ctx.fillStyle = 'rgba(160,255,200,0.15)';
                for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(o.x + o.w / 2 + Math.sin(t * 2 + i) * 6, ground - o.hgt - 10 - i * 18, 10 + i * 4, 0, 7); ctx.fill(); }
              }
            }
            g.trail.forEach((p, i) => { ctx.fillStyle = `rgba(63,191,159,${i / g.trail.length * 0.4})`; ctx.beginPath(); ctx.arc(p.x - (g.trail.length - i) * 6, p.y, 8, 0, 7); ctx.fill(); });
            ctx.save();
            ctx.translate(g.x, g.y);
            if (fly) { ctx.rotate(g.vy / 1200); ctx.fillStyle = '#3fbf9f'; ctx.fillRect(-22, 12, 44, 6); ctx.shadowColor = '#5affd0'; ctx.shadowBlur = 16; }
            ctx.fillStyle = '#e0457b';
            ctx.fillRect(-11, -4, 22, 26);
            ctx.fillStyle = '#ffe08a';
            ctx.beginPath(); ctx.arc(0, -16, 14, 0, 7); ctx.fill();
            ctx.fillStyle = '#3a2a1a';
            ctx.beginPath(); ctx.arc(0, -20, 14, Math.PI, 0); ctx.fill();
            ctx.restore();
          },
          hud() { return bar('Tiempo', Math.min(goal, g.t), goal, '#e3c45a') + `<span>${Math.max(0, goal - g.t).toFixed(1)} s</span>`; },
        };
        return g;
      },
    };
  }
  GAMES.tejados = runner('run');
  GAMES.aerotabla = runner('fly');

  // ---------- 3. Galería de tiro ----------
  GAMES.tiro = {
    title: 'Galería de tiro', icon: '🎯', scene: 'ejecutores',
    desc: 'Dianas hextec aparecen y desaparecen. Dispara a las dianas azules y no toques los muñecos de civiles.',
    controls: 'Ratón: apunta y haz clic para disparar.', goal: 'Consigue 15 puntos en 30 segundos.',
    winText: 'Caitlyn estaría orgullosa. Puntería de francotirador.', loseText: 'Demasiadas balas perdidas. Respira, apunta, exhala.',
    create(w, h, o = {}) {
      const need = Math.max(8, 15 - 2 * (o.bonus || 0));
      const g = {
        t: 0, score: 0, targets: [], spawn: 0.3, fx: [], result: null,
        update(dt, inp) {
          g.t += dt;
          g.spawn -= dt;
          if (g.spawn <= 0) {
            g.spawn = Math.max(0.35, 0.8 - g.t * 0.012);
            g.targets.push({ x: 60 + Math.random() * (w - 120), y: 60 + Math.random() * (h - 120), r: 26 + Math.random() * 12, life: 1.6, civ: Math.random() < 0.22, vx: (Math.random() - 0.5) * 120 });
          }
          for (const tg of g.targets) { tg.life -= dt; tg.x += tg.vx * dt; }
          for (const c of inp.mouse.clicks) {
            Audio2.sfx.click();
            const hit = g.targets.find((tg) => Math.hypot(tg.x - c.x, tg.y - c.y) < tg.r);
            if (hit) { hit.life = 0; g.score += hit.civ ? -3 : 1; g.fx.push({ x: c.x, y: c.y, t: 0.4, txt: hit.civ ? '-3' : '+1', c: hit.civ ? '#e05a5a' : '#3fbf9f' }); }
            else g.fx.push({ x: c.x, y: c.y, t: 0.2, txt: '·', c: '#aaa' });
          }
          g.targets = g.targets.filter((tg) => tg.life > 0);
          g.fx.forEach((f) => { f.t -= dt; f.y -= 40 * dt; });
          g.fx = g.fx.filter((f) => f.t > 0);
          if (g.score >= need) g.result = true;
          else if (g.t >= 30) g.result = false;
        },
        draw(ctx, t) {
          panelBg(ctx, w, h, 0.25);
          for (const tg of g.targets) {
            const a = Math.min(1, tg.life * 3);
            ctx.globalAlpha = a;
            if (tg.civ) {
              ctx.fillStyle = '#d9c9a0'; ctx.beginPath(); ctx.arc(tg.x, tg.y - tg.r * 0.4, tg.r * 0.45, 0, 7); ctx.fill();
              ctx.fillRect(tg.x - tg.r * 0.5, tg.y, tg.r, tg.r * 0.9);
              glowText(ctx, '✋', tg.x, tg.y + tg.r * 0.4, 18, '#fff');
            } else {
              ctx.fillStyle = '#123a5a'; hexPath(ctx, tg.x, tg.y, tg.r, t); ctx.fill();
              ctx.strokeStyle = '#7fd0ff'; ctx.lineWidth = 4; ctx.shadowColor = '#3fa9f5'; ctx.shadowBlur = 16; ctx.stroke(); ctx.shadowBlur = 0;
              ctx.fillStyle = '#e3c45a'; ctx.beginPath(); ctx.arc(tg.x, tg.y, tg.r * 0.3, 0, 7); ctx.fill();
            }
            ctx.globalAlpha = 1;
          }
          for (const f of g.fx) glowText(ctx, f.txt, f.x, f.y, 26, f.c);
          const m = g.lastMouse;
          ctx.strokeStyle = 'rgba(255,224,138,0.8)'; ctx.lineWidth = 2;
          if (m) { ctx.beginPath(); ctx.arc(m.x, m.y, 14, 0, 7); ctx.moveTo(m.x - 22, m.y); ctx.lineTo(m.x + 22, m.y); ctx.moveTo(m.x, m.y - 22); ctx.lineTo(m.x, m.y + 22); ctx.stroke(); }
        },
        hud() { return bar('Puntos', Math.max(0, g.score), need, '#3fa9f5') + `<span>${g.score}/${need} · ${Math.max(0, 30 - g.t).toFixed(0)} s</span>`; },
      };
      const origUpdate = g.update;
      g.update = (dt, inp) => { g.lastMouse = { x: inp.mouse.x, y: inp.mouse.y }; origUpdate(dt, inp); };
      return g;
    },
  };

  // ---------- 4. Circuito hextec (puzle de conexiones) ----------
  // Cada pieza tiene conexiones [arriba, derecha, abajo, izquierda].
  GAMES.circuito = {
    title: 'Circuito hextec', icon: '🔧', scene: 'taller-jayce',
    desc: 'La energía tiene que ir de la gema (izquierda) al receptor (derecha). Gira las piezas para que el circuito quede conectado.',
    controls: 'Clic en una pieza para girarla.', goal: 'Conecta el circuito en menos de 75 segundos.',
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
        t: 0, result: null, lit: new Set(), spin: {},
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
            if (cx >= 0 && cy >= 0 && cx < N && cy < N) { grid[cy][cx] = rot(grid[cy][cx]); g.spin[`${cx},${cy}`] = 1; Audio2.sfx.click(); }
          }
          Object.keys(g.spin).forEach((k) => { g.spin[k] -= dt * 6; if (g.spin[k] <= 0) delete g.spin[k]; });
          g.lit = g.flow();
          if (g.lit.has(`${N - 1},${er}`) && grid[er][N - 1][1]) g.result = true;
          else if (g.t > limit) g.result = false;
        },
        draw(ctx, t) {
          panelBg(ctx, w, h, 0.45);
          for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
            const x0 = ox + c * cell;
            const y0 = oy + r * cell;
            const on = g.lit.has(`${c},${r}`);
            ctx.fillStyle = 'rgba(20,30,50,0.85)'; ctx.fillRect(x0 + 3, y0 + 3, cell - 6, cell - 6);
            ctx.strokeStyle = 'rgba(227,196,90,0.3)'; ctx.strokeRect(x0 + 3, y0 + 3, cell - 6, cell - 6);
            ctx.save();
            ctx.translate(x0 + cell / 2, y0 + cell / 2);
            ctx.rotate(-(g.spin[`${c},${r}`] || 0) * Math.PI / 2);
            ctx.strokeStyle = on ? '#7fd0ff' : '#8a7a5a';
            ctx.lineWidth = cell * 0.16;
            ctx.lineCap = 'round';
            if (on) { ctx.shadowColor = '#3fa9f5'; ctx.shadowBlur = 18; }
            grid[r][c].forEach((v, d) => { if (v) { ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(dirs[d][0] * cell / 2, dirs[d][1] * cell / 2); ctx.stroke(); } });
            ctx.fillStyle = on ? '#bfeaff' : '#5a4a3a';
            ctx.beginPath(); ctx.arc(0, 0, cell * 0.12, 0, 7); ctx.fill();
            ctx.restore();
          }
          const gem = (x, y, c) => { ctx.save(); ctx.fillStyle = c; ctx.shadowColor = c; ctx.shadowBlur = 24 + Math.sin(t * 4) * 8; hexPath(ctx, x, y, cell * 0.3, t); ctx.fill(); ctx.restore(); };
          gem(ox - cell * 0.5, oy + sr * cell + cell / 2, '#7fd0ff');
          gem(ox + N * cell + cell * 0.5, oy + er * cell + cell / 2, g.lit.has(`${N - 1},${er}`) ? '#7fd0ff' : '#5a4a3a');
        },
        hud() { return bar('Tiempo', Math.max(0, limit - g.t), limit, '#e3c45a') + `<span>${Math.max(0, limit - g.t).toFixed(0)} s</span>`; },
      };
      return g;
    },
  };

  // ---------- 5. Runas de la Academia (memoria) ----------
  GAMES.runas = {
    title: 'Runas de la Academia', icon: '🔷', scene: 'academia',
    desc: 'Heimerdinger te pone a prueba: las runas se encienden en un orden. Repite la secuencia, que cada vez será más larga.',
    controls: 'Clic en las runas (o teclas 1 a 6).', goal: 'Completa una secuencia de 7 runas. Tienes un fallo de margen.',
    winText: '«¡Fascinante! Memoria de yordle», aplaude Heimerdinger.', loseText: '«Hmm, hmm. La paciencia también es una ciencia», suspira el profesor.',
    create(w, h, o = {}) {
      const n = 6;
      const target = (o.bonus || 0) >= 2 ? 6 : 7;
      const cols = ['#3fa9f5', '#e3c45a', '#e0457b', '#3fbf9f', '#bf3abf', '#f0a040'];
      const cx = w / 2;
      const cy = h / 2;
      const R = Math.min(w, h) * 0.3;
      const pos = Array.from({ length: n }, (_, i) => [cx + Math.cos(-Math.PI / 2 + (i * Math.PI * 2) / n) * R, cy + Math.sin(-Math.PI / 2 + (i * Math.PI * 2) / n) * R]);
      const g = {
        seq: [pick([0, 1, 2, 3, 4, 5])], input: 0, showing: true, showT: 0, lit: -1, litT: 0, lives: 2 + (o.bonus || 0), result: null, msg: 'Observa…',
        light(i) { g.lit = i; g.litT = 0.35; Audio2.sfx.message(); },
        update(dt, inp) {
          g.litT -= dt;
          if (g.litT <= 0) g.lit = -1;
          if (g.showing) {
            const before = g.showT;
            g.showT += dt;
            const k = Math.floor(g.showT / 0.6);
            if (k >= 0 && k < g.seq.length && Math.floor(before / 0.6) !== k) g.light(g.seq[k]);
            if (g.showT >= (g.seq.length + 0.3) * 0.6) { g.showing = false; g.input = 0; g.msg = 'Tu turno'; }
            return;
          }
          const picks = inp.mouse.clicks.map((c) => pos.findIndex(([x, y]) => Math.hypot(x - c.x, y - c.y) < R * 0.32))
            .concat(inp.pressed.map((k) => Number(k) - 1)).filter((i) => i >= 0 && i < n);
          for (const p of picks) {
            g.light(p);
            if (p === g.seq[g.input]) {
              g.input++;
              if (g.input === g.seq.length) {
                if (g.seq.length >= target) { g.result = true; return; }
                g.seq.push(pick([0, 1, 2, 3, 4, 5]));
                g.showing = true; g.showT = -0.6; g.msg = '¡Bien! Otra más…';
              }
            } else {
              g.lives--; Audio2.sfx.locked();
              if (g.lives <= 0) { g.result = false; return; }
              g.showing = true; g.showT = -0.6; g.msg = '¡Fallo! Mira otra vez…';
            }
            break;
          }
        },
        draw(ctx, t) {
          panelBg(ctx, w, h, 0.4);
          pos.forEach(([x, y], i) => {
            const on = g.lit === i;
            ctx.save();
            ctx.fillStyle = on ? cols[i] : 'rgba(30,24,40,0.9)';
            ctx.shadowColor = cols[i];
            ctx.shadowBlur = on ? 40 : 8;
            hexPath(ctx, x, y, R * 0.28, Math.PI / 6);
            ctx.fill();
            ctx.lineWidth = 4; ctx.strokeStyle = cols[i]; ctx.stroke();
            ctx.restore();
            glowText(ctx, ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ'][i], x, y, R * 0.22, on ? '#fff' : cols[i]);
          });
          glowText(ctx, g.msg, cx, cy, 26, '#ffe08a');
        },
        hud() { return bar('Secuencia', g.seq.length, target, '#3fa9f5') + `<span>${g.seq.length}/${target} · Vidas: ${'❤'.repeat(Math.max(0, g.lives))}</span>`; },
      };
      return g;
    },
  };

  // ---------- 6. Regateo en el mercado ----------
  GAMES.regateo = {
    title: 'Regateo en el mercado', icon: '💰', scene: 'mercado',
    desc: 'La vendedora pide 100 monedas por un cachivache que vale mucho menos. Haz ofertas: si te pasas de lista se enfadará, si ofreces poco perderá la paciencia.',
    controls: 'Flechas ← → para ajustar tu oferta, Espacio o Intro para ofrecer.', goal: 'Cierra el trato por 60 monedas o menos.',
    winText: '«Trato hecho… me has desplumado», ríe la vendedora.', loseText: '«Fuera de mi puesto», te dice cruzándose de brazos.',
    create(w, h, o = {}) {
      const min = 38 + Math.floor(Math.random() * 18);
      const goal = 60 + 5 * (o.bonus || 0);
      const maxPat = 4 + (o.bonus || 0);
      const g = {
        offer: 40, ask: 100, patience: maxPat, msg: '¿Cuánto me das?', result: null, mood: 0,
        update(dt, inp) {
          for (const k of inp.pressed) {
            if (k === 'arrowleft' || k === 'a') g.offer = Math.max(10, g.offer - 2);
            if (k === 'arrowright' || k === 'd') g.offer = Math.min(100, g.offer + 2);
            if (k === ' ' || k === 'enter') {
              Audio2.sfx.click();
              if (g.offer >= g.ask) { g.result = g.ask <= goal; g.msg = 'Hecho.'; return; }
              if (g.offer >= min) {
                g.ask = Math.max(g.offer, Math.round((g.ask + g.offer) / 2 - 2));
                if (g.ask - g.offer <= 3) { g.result = g.offer <= goal; return; }
                g.msg = `Hmm… ${g.ask}, y es mi última palabra. Bueno, casi.`;
                g.mood = 1;
              } else {
                g.patience--;
                g.mood = -1;
                g.msg = pick(['¿Me tomas el pelo?', '¡Eso es un insulto!', 'Ni en sueños, cariño.']);
                if (g.patience <= 0) { g.result = false; return; }
              }
            }
          }
          for (const c of inp.mouse.clicks) {
            const bx = w / 2;
            if (Math.abs(c.y - h * 0.78) < 30) {
              if (c.x < bx - 120) g.offer = Math.max(10, g.offer - 5);
              else if (c.x > bx + 120) g.offer = Math.min(100, g.offer + 5);
            }
          }
        },
        draw(ctx) {
          panelBg(ctx, w, h, 0.45);
          glowText(ctx, g.mood < 0 ? '😠' : g.mood > 0 ? '🤔' : '🙂', w / 2, h * 0.22, 80, '#fff');
          glowText(ctx, `«${g.msg}»`, w / 2, h * 0.4, 26, '#f4efe6');
          glowText(ctx, `Pide: ${g.ask} 🪙`, w / 2, h * 0.53, 30, '#e0457b');
          glowText(ctx, `Tu oferta: ◀ ${g.offer} 🪙 ▶`, w / 2, h * 0.78, 40, '#ffe08a');
          glowText(ctx, 'Pulsa Espacio para ofrecer', w / 2, h * 0.9, 18, '#a39cb3');
        },
        hud() { return bar('Paciencia', g.patience, maxPat, '#e3c45a') + `<span>Meta: ≤ ${goal} 🪙</span>`; },
      };
      return g;
    },
  };

  window.Minigames = { play, GAMES };
})();
