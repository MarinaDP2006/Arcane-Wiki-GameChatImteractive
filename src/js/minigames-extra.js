// Minijuegos nuevos con profundidad: persecución en aerodeslizador por Zaun (carretera en
// pseudo 3D), la mira telescópica de Caitlyn y los chompers de Jinx (lanzamiento con física).
// Usan el marco común de minigames.js (Minigames.play) y el arte de Depth para los fondos.
(function () {
  const { GAMES, kit } = window.Minigames;
  const { bar, glowSprite, buzz, EMBLEM } = kit;
  const FX = new Proxy({}, { get: (_, k) => { const fx = kit.fx(); return typeof fx[k] === 'function' ? fx[k].bind(fx) : fx[k]; } });
  const TAU = Math.PI * 2;
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, k) => a + (b - a) * k;

  EMBLEM.persecucion = '<path d="M14 44h36l-6-14H20z"/><circle cx="22" cy="46" r="4"/><circle cx="42" cy="46" r="4"/><path d="M8 34h8M6 40h8M10 28h8" opacity=".7"/>';
  EMBLEM.francotiradora = '<circle cx="32" cy="32" r="18"/><path d="M32 10v14M32 40v14M10 32h14M40 32h14"/><circle cx="32" cy="32" r="2"/>';
  EMBLEM.chompers = '<circle cx="30" cy="36" r="14"/><path d="M20 36l3 4 3-4 3 4 3-4 3 4 3-4" /><path d="M38 24l6-8M44 16l4 2" opacity=".8"/>';

  // ---------- 1. Persecución por el Carril (carretera en pseudo 3D) ----------
  GAMES.persecucion = {
    title: 'Persecución por el Carril', icon: '', scene: 'callejones', grade: 'zaun',
    backdrops: ['zaun', 'callejones', 'puente-zaun', 'sumidero', 'fabrica', 'tejados'],
    touchKeys: [['arrowleft', '◀'], ['arrowright', '▶']], touchLayout: 'sides',
    desc: 'Los ejecutores te pisan los talones. Pilota un aerodeslizador robado por los túneles de Zaun, esquiva barriles y barricadas y recoge núcleos hextec para acelerar.',
    controls: 'Flechas ← → (o A D) para girar.', touchControls: 'Mantén pulsados los botones de los lados para girar.',
    goal: 'Recorre 3 km antes de que te alcancen.',
    winText: 'Te pierdes entre el humo de los túneles. Los ejecutores se quedan mirando la nada.', loseText: 'Las sirenas te rodean. Te han cazado. Otra vez, más rápido.',
    create(w, h, o = {}) {
      const b = o.bonus || 0;
      const SEG = 200;
      const ROAD = 2000;
      const CAM_H = 1000;
      const DEPTH = 0.84;
      const DRAW = window.Depth?.low() ? 90 : 150;
      const LANES = 3;
      const goal = 3000 - b * 300; // metros
      const MAXV = SEG * 60;
      // Trazado: rectas, curvas y cuestas encadenadas con transiciones suaves.
      const segs = [];
      const add = (n, curve, hill) => {
        const y0 = segs.length ? segs[segs.length - 1].y : 0;
        for (let i = 0; i < n; i++) {
          const k = i / n;
          const ease = (1 - Math.cos(k * Math.PI)) / 2;
          segs.push({ i: segs.length, curve: curve * Math.sin(k * Math.PI), y: y0 + hill * ease, sprites: [], ob: null });
        }
      };
      add(40, 0, 0);
      while (segs.length < 3200) add(30 + Math.floor(Math.random() * 50), pick([0, 0, 2, -2, 4, -4, 6, -6]), pick([0, 0, 1200, -1200, 2400, -2400]));
      // Decorado y obstáculos
      for (const s of segs) {
        if (s.i < 30) continue;
        if (s.i % 6 === 0) s.sprites.push({ kind: 'lamp', x: -1.35, col: pick(['#3fbf9f', '#e0457b', '#bf3abf', '#f0a040']) }, { kind: 'lamp', x: 1.35, col: pick(['#3fbf9f', '#e0457b', '#8fbf3a']) });
        if (s.i % 50 === 0) s.sprites.push({ kind: 'arch' });
        if (s.i % 17 === 5) s.sprites.push({ kind: 'pipe', x: pick([-2.2, 2.2]) });
        if (s.i > 60 && s.i % 9 === 0 && Math.random() < 0.75) s.ob = { kind: pick(['barrel', 'barrel', 'crate', 'barricade']), x: pick([-0.66, 0, 0.66]) };
        else if (s.i > 60 && s.i % 9 === 4 && Math.random() < 0.55) s.ob = { kind: 'core', x: pick([-0.66, 0, 0.66]) };
      }
      const LEN = segs.length * SEG;
      const g = {
        result: null, pos: 0, x: 0, speed: 0, dist: 0, lean: 0, cores: 0, chase: 70 + b * 10, crash: 0, bgx: 0, t: 0, boost: 0,
        cam() { return { x: clamp(g.bgx, -1, 1), y: -0.2 + clamp((segAt(g.pos).y) / 12000, -0.4, 0.4), zoom: 1.08 }; },
        update(dt, inp) {
          g.t += dt;
          const left = inp.keys.has('arrowleft') || inp.keys.has('a') || (inp.mouse.down && inp.mouse.x < w / 3);
          const right = inp.keys.has('arrowright') || inp.keys.has('d') || (inp.mouse.down && inp.mouse.x > (w * 2) / 3);
          const top = MAXV * (1 + g.boost * 0.35);
          g.speed = lerp(g.speed, g.crash > 0 ? top * 0.35 : top, dt * (g.crash > 0 ? 3 : 0.8));
          g.crash = Math.max(0, g.crash - dt);
          g.boost = Math.max(0, g.boost - dt * 0.4);
          const seg = segAt(g.pos);
          const steer = (right ? 1 : 0) - (left ? 1 : 0);
          g.lean = lerp(g.lean, steer, dt * 8);
          const k = g.speed / MAXV;
          g.x += steer * dt * 2.2 * k;
          g.x -= seg.curve * k * dt * 0.42; // la curva te empuja hacia fuera
          g.x = clamp(g.x, -1.6, 1.6);
          if (Math.abs(g.x) > 1.05) { g.speed *= 1 - dt * 1.6; if (Math.random() < 0.3) FX.burst(w / 2 + (g.x > 0 ? 40 : -40), h * 0.9, 1, { color: '#8a9a90', kind: 'smoke', speed: 80, life: 0.8, gravity: -40, size: 8 }); }
          g.bgx += seg.curve * k * dt * 0.02;
          g.pos = (g.pos + g.speed * dt) % LEN;
          g.dist += (g.speed * dt) / 130;
          // Obstáculos del tramo en el que estás
          // El aerodeslizador se dibuja unos seis tramos por delante de la cámara.
          for (let n = 5; n < 7; n++) {
            const s = segs[(seg.i + n) % segs.length];
            const ob = s.ob;
            if (!ob || ob.done) continue;
            if (Math.abs(g.x - ob.x) < (ob.kind === 'barricade' ? 0.5 : 0.3)) {
              ob.done = true;
              if (ob.kind === 'core') {
                g.cores++; g.boost = 1; g.chase = Math.min(100, g.chase + 6);
                FX.burst(w / 2, h * 0.72, 30, { color: ['#7fd0ff', '#bfeaff', '#ffffff'], speed: 380, life: 0.6, kind: 'dot', gravity: 0 });
                FX.text(w / 2, h * 0.6, '¡Núcleo! +velocidad', '#7fd0ff', 26); FX.flash(0.15, '140,200,255');
                Audio2.sfx.choice(); buzz(15);
              } else {
                g.crash = 0.9; g.chase -= ob.kind === 'barricade' ? 22 : 14;
                FX.burst(w / 2, h * 0.8, 40, { color: ob.kind === 'barrel' ? ['#7aff4a', '#c8ff9a', '#3a8a2a'] : ['#ffd060', '#ff7a3a', '#8a6a4a'], speed: 520, life: 0.7, kind: 'shard', size: 4 });
                FX.shake(18); FX.hurt(0.8); FX.text(w / 2, h * 0.6, ob.kind === 'barricade' ? '¡Barricada!' : '¡Choque!', '#ff6a6a', 30);
                FX.impact(w / 2, h * 0.78, { power: 1, colors: ob.kind === 'barrel' ? ['#7aff4a', '#3a8a2a', '#ffe08a'] : ['#ff9a3a', '#ffe08a', '#e0457b'] });
                Audio2.sfx.locked(); buzz([30, 30, 30]);
              }
            }
          }
          // Los ejecutores se acercan si vas lento y se alejan si vas rápido.
          g.chase += (k > 0.92 ? 3.5 : k > 0.7 ? 0 : -9) * dt;
          g.chase = Math.min(100, g.chase);
          if (g.dist >= goal) { g.result = true; FX.burst(w / 2, h / 2, 80, { color: ['#7affd0', '#ffffff', '#3fbf9f'], speed: 600, life: 0.9 }); }
          else if (g.chase <= 0) g.result = false;
          // Estela del motor
          if (Math.random() < 0.8) FX.burst(w / 2 + (Math.random() - 0.5) * 50, h * 0.9, 1, { color: g.boost ? ['#7fd0ff', '#ffffff'] : ['#5affd0', '#b8ffea'], angle: Math.PI / 2, spread: 0.6, speed: 160, kind: 'dot', life: 0.35, gravity: 0, size: 1.8 });
        },
        draw(ctx, t) {
          const base = segAt(g.pos);
          const pct = (g.pos % SEG) / SEG;
          const camY = CAM_H + lerp(base.y, segs[(base.i + 1) % segs.length].y, pct);
          const hor = h * 0.5;
          let maxy = h;
          let x = 0;
          let dx = -base.curve * pct;
          const proj = [];
          // Del más cercano al más lejano: se recorta lo que queda tapado por las cuestas.
          for (let n = 0; n < DRAW; n++) {
            const s = segs[(base.i + n) % segs.length];
            const loop = base.i + n >= segs.length ? LEN : 0;
            const z1 = s.i * SEG + loop - g.pos;
            const z2 = z1 + SEG;
            const p1 = project(g.x * ROAD - x, s.y - camY, z1, hor);
            const p2 = project(g.x * ROAD - x - dx, segs[(s.i + 1) % segs.length].y - camY, z2, hor);
            x += dx; dx += s.curve;
            proj.push({ s, p1, p2, clip: maxy, fog: 1 - Math.exp(-((n / DRAW) ** 2) * 4) });
            if (p1.z <= DEPTH || p2.y >= maxy || p2.y >= p1.y) continue;
            drawSegment(ctx, s, p1, p2, n / DRAW);
            maxy = p2.y;
          }
          // Decorado y obstáculos, del fondo hacia delante
          for (let n = proj.length - 1; n > 0; n--) {
            const { s, p1, clip, fog } = proj[n];
            if (p1.z <= DEPTH) continue;
            for (const sp of s.sprites) drawSprite(ctx, sp, p1, clip, fog, t);
            if (s.ob && !s.ob.done) drawSprite(ctx, s.ob, p1, clip, fog, t);
          }
          drawBike(ctx, t);
          // Luces de las sirenas cuando los ejecutores están cerca
          if (g.chase < 35) {
            const a = (1 - g.chase / 35) * 0.35 * (0.5 + 0.5 * Math.sin(t * 14));
            const sg = ctx.createLinearGradient(0, 0, w, 0);
            sg.addColorStop(0, `rgba(255,40,60,${a})`); sg.addColorStop(0.5, 'rgba(0,0,0,0)'); sg.addColorStop(1, `rgba(60,120,255,${a})`);
            ctx.fillStyle = sg; ctx.fillRect(0, 0, w, h);
          }
          // Líneas de velocidad
          const k = g.speed / MAXV;
          if (k > 0.8) {
            ctx.save();
            ctx.strokeStyle = `rgba(200,255,240,${(k - 0.8) * (g.boost ? 1.2 : 0.6)})`;
            ctx.lineWidth = 1.5;
            for (let i = 0; i < 18; i++) {
              const a = (i / 18) * TAU + t;
              const r0 = Math.min(w, h) * (0.35 + ((t * 3 + i * 0.37) % 1) * 0.5);
              ctx.beginPath(); ctx.moveTo(w / 2 + Math.cos(a) * r0, hor + Math.sin(a) * r0 * 0.6); ctx.lineTo(w / 2 + Math.cos(a) * (r0 + 60), hor + Math.sin(a) * (r0 + 60) * 0.6); ctx.stroke();
            }
            ctx.restore();
          }
        },
        hud() {
          return bar('Recorrido', g.dist, goal, '#e3c45a') + `<span class="mg-num">${(g.dist / 1000).toFixed(2)} km</span>` + bar('Ventaja', Math.max(0, g.chase), 100, '#3fbf9f') + (g.cores ? `<span class="mg-chip">Núcleos ×${g.cores}</span>` : '');
        },
      };
      function segAt(z) { return segs[Math.floor(z / SEG) % segs.length]; }
      function project(cx, cy, cz, hor) {
        const sc = DEPTH / Math.max(0.01, cz);
        return { x: w / 2 + (sc * -cx * w) / 2, y: hor - (sc * cy * h) / 2, w: (sc * ROAD * w) / 2, s: sc, z: cz };
      }
      function quad(ctx, x1, y1, w1, x2, y2, w2, col) {
        ctx.fillStyle = col;
        ctx.beginPath(); ctx.moveTo(x1 - w1, y1); ctx.lineTo(x2 - w2, y2); ctx.lineTo(x2 + w2, y2); ctx.lineTo(x1 + w1, y1); ctx.closePath(); ctx.fill();
      }
      function fogCol(rgb, f) {
        const fogc = [14, 32, 28];
        return `rgb(${Math.round(lerp(rgb[0], fogc[0], f))},${Math.round(lerp(rgb[1], fogc[1], f))},${Math.round(lerp(rgb[2], fogc[2], f))})`;
      }
      function drawSegment(ctx, s, p1, p2, d) {
        const f = 1 - Math.exp(-d * d * 5);
        const alt = Math.floor(s.i / 3) % 2;
        // Suelo del túnel (canal químico a los lados) con transparencia hacia el fondo para ver el arte
        ctx.globalAlpha = clamp(1.4 - d * 1.6, 0, 1);
        ctx.fillStyle = fogCol(alt ? [10, 22, 18] : [14, 30, 24], f);
        ctx.fillRect(0, p2.y, w, p1.y - p2.y + 1);
        quad(ctx, p1.x, p1.y, p1.w * 1.25, p2.x, p2.y, p2.w * 1.25, fogCol(alt ? [120, 90, 40] : [40, 30, 20], f));
        quad(ctx, p1.x, p1.y, p1.w, p2.x, p2.y, p2.w, fogCol(alt ? [34, 30, 40] : [40, 36, 46], f));
        if (alt) for (let l = 1; l < LANES; l++) {
          const lx1 = p1.x - p1.w + (p1.w * 2 * l) / LANES;
          const lx2 = p2.x - p2.w + (p2.w * 2 * l) / LANES;
          quad(ctx, lx1, p1.y, p1.w / 60, lx2, p2.y, p2.w / 60, fogCol([200, 180, 120], f));
        }
        ctx.globalAlpha = 1;
      }
      function drawSprite(ctx, sp, p, clip, fog, t) {
        const sx = p.x + (sp.x || 0) * p.w;
        const sc = p.w / 1000;
        if (sc < 0.004) return;
        ctx.save();
        ctx.beginPath(); ctx.rect(0, 0, w, clip); ctx.clip();
        ctx.globalAlpha = clamp(1 - fog * 0.9, 0, 1);
        if (sp.kind === 'lamp') {
          const hh = 900 * sc;
          ctx.fillStyle = '#16121a';
          ctx.fillRect(sx - 14 * sc, p.y - hh, 28 * sc, hh);
          ctx.fillRect(sx - (sp.x > 0 ? 120 : -20) * sc, p.y - hh, 140 * sc, 18 * sc);
          const lx = sx + (sp.x > 0 ? -110 : 110) * sc;
          ctx.globalCompositeOperation = 'lighter';
          const r = 260 * sc * (0.9 + Math.sin(t * 7 + sx) * 0.05);
          ctx.drawImage(glowSprite(sp.col), lx - r, p.y - hh - r * 0.6, r * 2, r * 2);
          // Cono de luz sobre el asfalto
          const cg = ctx.createRadialGradient(lx, p.y, 2, lx, p.y, 500 * sc);
          cg.addColorStop(0, sp.col + '55'); cg.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = cg; ctx.fillRect(lx - 500 * sc, p.y - 140 * sc, 1000 * sc, 200 * sc);
        } else if (sp.kind === 'arch') {
          // Arco de tuberías que cruza el túnel
          const aw = p.w * 1.5;
          const ah = 1500 * sc;
          ctx.lineWidth = 120 * sc;
          const ag = ctx.createLinearGradient(0, p.y - ah, 0, p.y);
          ag.addColorStop(0, '#3a5a4a'); ag.addColorStop(1, '#0e1a14');
          ctx.strokeStyle = ag;
          ctx.beginPath(); ctx.moveTo(p.x - aw, p.y); ctx.lineTo(p.x - aw, p.y - ah * 0.6); ctx.quadraticCurveTo(p.x, p.y - ah * 1.25, p.x + aw, p.y - ah * 0.6); ctx.lineTo(p.x + aw, p.y); ctx.stroke();
          ctx.lineWidth = 30 * sc; ctx.strokeStyle = '#c8a050';
          ctx.beginPath(); ctx.moveTo(p.x - aw, p.y - ah * 0.6); ctx.quadraticCurveTo(p.x, p.y - ah * 1.25, p.x + aw, p.y - ah * 0.6); ctx.stroke();
          ctx.globalCompositeOperation = 'lighter';
          ctx.drawImage(glowSprite('#7aff4a'), p.x - 200 * sc, p.y - ah * 0.98, 400 * sc, 200 * sc);
        } else if (sp.kind === 'pipe') {
          const ph = 1100 * sc;
          const pw = 180 * sc;
          const pg = ctx.createLinearGradient(sx - pw / 2, 0, sx + pw / 2, 0);
          pg.addColorStop(0, '#0e1612'); pg.addColorStop(0.35, '#5a7a6a'); pg.addColorStop(1, '#0a100c');
          ctx.fillStyle = pg; ctx.fillRect(sx - pw / 2, p.y - ph, pw, ph);
          ctx.fillStyle = '#c8a050'; ctx.fillRect(sx - pw * 0.6, p.y - ph * 0.7, pw * 1.2, 26 * sc);
        } else if (sp.kind === 'barrel') {
          const r = 150 * sc;
          window.Depth.shadow(ctx, sx, p.y, r * 1.2, r * 0.3, 0.6);
          const bg = ctx.createLinearGradient(sx - r, 0, sx + r, 0);
          bg.addColorStop(0, '#1a2a12'); bg.addColorStop(0.4, '#6a8a3a'); bg.addColorStop(1, '#10180a');
          ctx.fillStyle = bg; ctx.fillRect(sx - r, p.y - r * 2.4, r * 2, r * 2.4);
          ctx.fillStyle = '#2a3a1a'; for (const yy of [0.3, 1.2, 2.1]) ctx.fillRect(sx - r, p.y - r * yy - 10 * sc, r * 2, 18 * sc);
          ctx.fillStyle = '#7aff4a'; ctx.beginPath(); ctx.ellipse(sx, p.y - r * 2.4, r, r * 0.3, 0, 0, TAU); ctx.fill();
          ctx.globalCompositeOperation = 'lighter';
          ctx.drawImage(glowSprite('#7aff4a'), sx - r * 1.6, p.y - r * 3.4, r * 3.2, r * 2);
        } else if (sp.kind === 'crate') {
          const s2 = 300 * sc;
          window.Depth.shadow(ctx, sx, p.y, s2 * 0.7, s2 * 0.15, 0.6);
          window.Depth.box(ctx, sx - s2 / 2, p.y - s2, s2, s2, 0.08, w / 2, h * 0.5, { front: '#7a5a34', frontDark: '#3a2814', top: '#a07a48', side: '#2a1a0c',
            tex: (c, bx, by, bw, bh) => { c.strokeStyle = '#2a1a0c'; c.lineWidth = Math.max(1, 10 * sc); c.strokeRect(bx, by, bw, bh); c.beginPath(); c.moveTo(bx, by); c.lineTo(bx + bw, by + bh); c.stroke(); } });
        } else if (sp.kind === 'barricade') {
          // Barricada de los ejecutores con luces azules y rojas
          const bw = p.w * 0.38;
          const bh = 260 * sc;
          ctx.fillStyle = '#1a2440';
          ctx.fillRect(sx - bw, p.y - bh, bw * 2, bh);
          ctx.fillStyle = '#d0d8e0';
          for (let i = 0; i < 6; i++) ctx.fillRect(sx - bw + (i * bw * 2) / 6 + 6 * sc, p.y - bh * 0.7, (bw * 2) / 12, bh * 0.4);
          ctx.globalCompositeOperation = 'lighter';
          const on = Math.sin(t * 12) > 0;
          ctx.drawImage(glowSprite(on ? '#ff3a4a' : '#3a7aff'), sx - bw - 120 * sc, p.y - bh - 120 * sc, 240 * sc, 240 * sc);
          ctx.drawImage(glowSprite(on ? '#3a7aff' : '#ff3a4a'), sx + bw - 120 * sc, p.y - bh - 120 * sc, 240 * sc, 240 * sc);
        } else if (sp.kind === 'core') {
          const r = 110 * sc;
          const yy = p.y - r * 2.5 + Math.sin(t * 3 + sx) * r * 0.3;
          ctx.globalCompositeOperation = 'lighter';
          ctx.drawImage(glowSprite('#7fd0ff'), sx - r * 3, yy - r * 3, r * 6, r * 6);
          ctx.globalCompositeOperation = 'source-over';
          ctx.save(); ctx.translate(sx, yy); ctx.rotate(t * 1.5);
          ctx.fillStyle = '#bfeaff'; ctx.strokeStyle = '#d8aa50'; ctx.lineWidth = Math.max(1, 14 * sc);
          ctx.beginPath(); for (let i = 0; i < 6; i++) { const a = (Math.PI / 3) * i; ctx[i ? 'lineTo' : 'moveTo'](Math.cos(a) * r, Math.sin(a) * r); } ctx.closePath(); ctx.fill(); ctx.stroke();
          ctx.restore();
        }
        ctx.restore();
      }
      function drawBike(ctx, t) {
        // Aerodeslizador visto desde atrás: se inclina al girar y vibra con la velocidad.
        const bx = w / 2;
        const by = h * 0.86 + Math.sin(t * 30) * (g.speed / MAXV) * 1.5 + (g.crash ? Math.sin(t * 50) * 5 : 0);
        const s = Math.min(w, h) / 600;
        window.Depth.shadow(ctx, bx, h * 0.95, 120 * s, 16 * s, 0.6);
        ctx.save();
        ctx.translate(bx, by);
        ctx.rotate(g.lean * 0.18);
        ctx.globalCompositeOperation = 'lighter';
        const th = 0.7 + Math.random() * 0.3 + g.boost * 0.6;
        for (const ex of [-52, 52]) ctx.drawImage(glowSprite(g.boost ? '#9fdcff' : '#5affd0'), ex * s - 40 * s * th, 10 * s, 80 * s * th, 70 * s * th);
        ctx.globalCompositeOperation = 'source-over';
        // Casco
        const hg = ctx.createLinearGradient(0, -40 * s, 0, 30 * s);
        hg.addColorStop(0, '#5a4a62'); hg.addColorStop(0.5, '#2a2030'); hg.addColorStop(1, '#100c14');
        ctx.fillStyle = hg;
        ctx.beginPath(); ctx.moveTo(-90 * s, 20 * s); ctx.quadraticCurveTo(-80 * s, -30 * s, 0, -36 * s); ctx.quadraticCurveTo(80 * s, -30 * s, 90 * s, 20 * s); ctx.lineTo(60 * s, 34 * s); ctx.lineTo(-60 * s, 34 * s); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = '#d8aa50'; ctx.lineWidth = 3 * s; ctx.stroke();
        // Toberas
        for (const ex of [-52, 52]) { ctx.fillStyle = '#1a1418'; ctx.beginPath(); ctx.ellipse(ex * s, 22 * s, 18 * s, 10 * s, 0, 0, TAU); ctx.fill(); ctx.fillStyle = g.boost ? '#bfeaff' : '#7affd0'; ctx.beginPath(); ctx.ellipse(ex * s, 22 * s, 11 * s, 5 * s, 0, 0, TAU); ctx.fill(); }
        // Cúpula de cristal y núcleo hextec en el centro (sin piloto)
        const cg = ctx.createLinearGradient(0, -78 * s, 0, -20 * s);
        cg.addColorStop(0, 'rgba(160,230,255,0.55)'); cg.addColorStop(1, 'rgba(20,60,70,0.85)');
        ctx.fillStyle = cg;
        ctx.beginPath(); ctx.moveTo(-46 * s, -24 * s); ctx.quadraticCurveTo(-40 * s, -78 * s, 0, -80 * s); ctx.quadraticCurveTo(40 * s, -78 * s, 46 * s, -24 * s); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = '#d8aa50'; ctx.lineWidth = 2.5 * s; ctx.stroke();
        ctx.strokeStyle = 'rgba(255,255,255,0.45)'; ctx.lineWidth = 3 * s;
        ctx.beginPath(); ctx.moveTo(-30 * s, -36 * s); ctx.quadraticCurveTo(-26 * s, -64 * s, -6 * s, -70 * s); ctx.stroke();
        ctx.globalCompositeOperation = 'lighter';
        ctx.drawImage(glowSprite(g.boost ? '#bfeaff' : '#7fd0ff'), -40 * s, -70 * s, 80 * s, 60 * s);
        ctx.globalCompositeOperation = 'source-over';
        ctx.save(); ctx.translate(0, -40 * s); ctx.rotate(t * 2);
        ctx.fillStyle = '#bfeaff'; ctx.strokeStyle = '#d8aa50'; ctx.lineWidth = 2 * s;
        ctx.beginPath(); for (let i = 0; i < 6; i++) { const a = (Math.PI / 3) * i; ctx[i ? 'lineTo' : 'moveTo'](Math.cos(a) * 12 * s, Math.sin(a) * 12 * s); } ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.restore();
        // Antenas con luces de posición
        for (const ax of [-70, 70]) {
          ctx.strokeStyle = '#2a2030'; ctx.lineWidth = 3 * s;
          ctx.beginPath(); ctx.moveTo(ax * s, 0); ctx.lineTo(ax * 1.15 * s, -34 * s); ctx.stroke();
          ctx.globalCompositeOperation = 'lighter';
          ctx.drawImage(glowSprite(ax < 0 ? '#e0457b' : '#3fbf9f'), ax * 1.15 * s - 12 * s, -46 * s, 24 * s, 24 * s);
          ctx.globalCompositeOperation = 'source-over';
        }
        ctx.restore();
      }
      return g;
    },
  };

  // ---------- 2. La mira de Caitlyn (francotiradora) ----------
  GAMES.francotiradora = {
    title: 'La mira de Caitlyn', icon: '', scene: 'piltover', grade: 'piltover',
    backdrops: ['piltover', 'plaza', 'artesanos', 'puente', 'hexpuertas', 'tejados', 'puente-zaun'],
    touchKeys: [['shift', 'Respirar'], [' ', 'Disparar']], touchLayout: 'sides',
    desc: 'Desde un tejado, con el rifle hextec de Caitlyn. Silco ha escondido botes de brillo por la ciudad: búscalos con la mira, contén la respiración para que no tiemble y reviéntalos. No rompas los faroles hextec.',
    controls: 'Ratón para apuntar, clic para disparar. Mantén Mayús o Espacio para contener la respiración.', touchControls: 'Arrastra el dedo para apuntar. Botones: Respirar y Disparar.',
    goal: 'Revienta 6 botes de brillo en 50 segundos sin romper 2 faroles.',
    winText: 'Caitlyn baja el rifle y asiente. «Nada mal. Nada mal en absoluto.»', loseText: 'Los botes desaparecen de los tejados. Respira hondo y otra vez.',
    create(w, h, o = {}) {
      const b = o.bonus || 0;
      const need = Math.max(4, 6 - b);
      const limit = 50 + b * 5;
      const ZOOM = 3.2;
      const R = Math.min(w, h) * 0.26;
      const g = {
        result: null, t: 0, ax: w / 2, ay: h / 2, aim: { x: w / 2, y: h / 2 }, breath: 1, holding: false, kick: 0, flash: 0,
        hits: 0, civ: 0, targets: [], spawn: 0.6, shots: [],
        cam() { return { x: (g.aim.x / w - 0.5) * 0.5, y: (g.aim.y / h - 0.5) * 0.3, zoom: 1.04 }; },
        update(dt, inp) {
          g.t += dt;
          // El pulso: un temblor en ocho que se calma al contener la respiración.
          g.holding = (inp.keys.has('shift') || (!U.touch && inp.keys.has(' '))) && g.breath > 0.02;
          g.breath = clamp(g.breath + (g.holding ? -0.32 : 0.18) * dt, 0, 1);
          const amp = (g.holding ? 0.15 : 1) * (1 - b * 0.12) * R * 0.22 * (g.breath < 0.15 ? 1.6 : 1);
          const tx = (inp.mouse.x || w / 2) + Math.sin(g.t * 1.3) * amp + Math.sin(g.t * 3.1) * amp * 0.25;
          const ty = (inp.mouse.y || h / 2) + Math.sin(g.t * 2.6) * amp * 0.6 - g.kick * R * 0.8;
          g.aim.x = lerp(g.aim.x, clamp(tx, 0, w), dt * 12);
          g.aim.y = lerp(g.aim.y, clamp(ty, 0, h), dt * 12);
          g.kick = Math.max(0, g.kick - dt * 3);
          g.flash = Math.max(0, g.flash - dt * 6);
          // Gente que aparece en balcones, ventanas y calles
          g.spawn -= dt;
          if (g.spawn <= 0) {
            g.spawn = Math.max(0.9, 2 - g.t * 0.02);
            const thug = Math.random() < 0.55;
            g.targets.push({ x: w * (0.08 + Math.random() * 0.84), y: h * (0.25 + Math.random() * 0.62), s: 0.7 + Math.random() * 0.5, thug, life: 0, max: thug ? 4.2 - Math.min(1.8, g.t * 0.03) : 5, vx: 0, ph: Math.random() * TAU, down: 0 });
          }
          for (const tg of g.targets) { tg.life += dt; tg.x += tg.vx * dt; if (tg.down) tg.down += dt; }
          g.targets = g.targets.filter((tg) => (tg.down ? tg.down < 1 : tg.life < tg.max));
          const fire = inp.pressed.includes(' ') && U.touch ? 1 : 0;
          const clicks = U.touch ? fire : inp.mouse.clicks.length;
          for (let i = 0; i < clicks; i++) shoot();
          if (g.hits >= need) g.result = true;
          else if (g.civ >= 2 || g.t >= limit) g.result = false;
        },
        draw(ctx, t) {
          // Fuera de la mira: la ciudad a simple vista, un poco velada.
          drawPeople(ctx, t);
          ctx.fillStyle = 'rgba(6,6,10,0.42)';
          ctx.fillRect(0, 0, w, h);
          // Dentro de la mira: la misma escena aumentada alrededor del punto de mira.
          const { x, y } = g.aim;
          ctx.save();
          ctx.beginPath(); ctx.arc(x, y, R, 0, TAU); ctx.clip();
          ctx.translate(x, y); ctx.scale(ZOOM, ZOOM); ctx.translate(-x, -y);
          o.bd?.draw(ctx, w, h, g.cam(), t, true);
          drawPeople(ctx, t);
          ctx.restore();
          ctx.save();
          // Lente: viñeta, reflejo y retícula
          const lg = ctx.createRadialGradient(x, y, R * 0.6, x, y, R);
          lg.addColorStop(0, 'rgba(0,0,0,0)'); lg.addColorStop(1, 'rgba(0,0,0,0.65)');
          ctx.fillStyle = lg; ctx.beginPath(); ctx.arc(x, y, R, 0, TAU); ctx.fill();
          ctx.globalCompositeOperation = 'lighter';
          const sh = ctx.createRadialGradient(x - R * 0.45, y - R * 0.5, 2, x - R * 0.45, y - R * 0.5, R * 0.5);
          sh.addColorStop(0, 'rgba(160,210,255,0.12)'); sh.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = sh; ctx.fillRect(x - R, y - R, R * 2, R * 2);
          ctx.globalCompositeOperation = 'source-over';
          ctx.strokeStyle = 'rgba(20,14,8,0.9)'; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(x - R, y); ctx.lineTo(x - 8, y); ctx.moveTo(x + 8, y); ctx.lineTo(x + R, y); ctx.moveTo(x, y - R); ctx.lineTo(x, y - 8); ctx.moveTo(x, y + 8); ctx.lineTo(x, y + R); ctx.stroke();
          ctx.lineWidth = 1;
          for (let i = 1; i <= 4; i++) { ctx.beginPath(); ctx.moveTo(x - 6, y + i * R * 0.12); ctx.lineTo(x + 6, y + i * R * 0.12); ctx.stroke(); }
          ctx.fillStyle = g.holding ? '#7affd0' : '#ff4a4a';
          ctx.beginPath(); ctx.arc(x, y, 2.5, 0, TAU); ctx.fill();
          // Aro de latón del visor
          const rg = ctx.createLinearGradient(x, y - R, x, y + R);
          rg.addColorStop(0, '#f6dc8a'); rg.addColorStop(0.5, '#6a4a1a'); rg.addColorStop(1, '#d8aa50');
          ctx.strokeStyle = rg; ctx.lineWidth = 12;
          ctx.beginPath(); ctx.arc(x, y, R + 6, 0, TAU); ctx.stroke();
          ctx.strokeStyle = '#1a1208'; ctx.lineWidth = 3;
          ctx.beginPath(); ctx.arc(x, y, R + 13, 0, TAU); ctx.stroke();
          // Aliento: arco azul alrededor del visor
          ctx.strokeStyle = g.breath < 0.2 ? '#ff6a6a' : '#7fd0ff'; ctx.lineWidth = 4;
          ctx.beginPath(); ctx.arc(x, y, R + 22, -Math.PI / 2, -Math.PI / 2 + TAU * g.breath); ctx.stroke();
          if (g.flash) { ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = g.flash * 0.5; ctx.drawImage(glowSprite('#ffd890'), x - R * 0.3, y - R * 0.3, R * 0.6, R * 0.6); }
          ctx.restore();
          for (const s of g.shots) { s.life -= 0.03; }
          g.shots = g.shots.filter((s) => s.life > 0);
        },
        hud() { return bar('Botes', g.hits, need, '#c04aff') + `<span class="mg-num">${g.hits}/${need} · ${Math.max(0, limit - g.t).toFixed(0)} s</span>` + bar('Aliento', g.breath, 1, '#7fd0ff') + (g.civ ? `<span class="mg-chip">Faroles: ${g.civ}/2</span>` : ''); },
      };
      // Objetivos a escala del mundo: botes de brillo (morado, se revientan) y faroles hextec de
      // Piltover (azules, no se tocan). Se ven pequeños a simple vista y nítidos en la mira.
      function drawPeople(ctx, t) {
        for (const tg of g.targets) {
          const appear = Math.min(1, tg.life * 3, (tg.max - tg.life) * 3);
          const s = tg.s * Math.min(w, h) * 0.022;
          ctx.save();
          ctx.globalAlpha = appear * (tg.down ? Math.max(0, 1 - tg.down * 4) : 1);
          ctx.translate(tg.x, tg.y + s * 1.4);
          const sway = Math.sin(t * 2 + tg.ph) * 0.04;
          ctx.rotate(sway);
          if (tg.thug) {
            // Bote de brillo: cristal con líquido morado que burbujea, tapas de latón y caja de madera
            ctx.fillStyle = '#4a3420'; ctx.fillRect(-s * 0.6, -s * 0.25, s * 1.2, s * 0.25);
            const lv = 0.55 + Math.sin(t * 3 + tg.ph) * 0.05;
            ctx.fillStyle = 'rgba(40,20,60,0.85)';
            ctx.fillRect(-s * 0.32, -s * 1.55, s * 0.64, s * 1.3);
            const lg = ctx.createLinearGradient(-s * 0.3, 0, s * 0.3, 0);
            lg.addColorStop(0, '#6a1a9a'); lg.addColorStop(0.5, '#e070ff'); lg.addColorStop(1, '#6a1a9a');
            ctx.fillStyle = lg;
            ctx.fillRect(-s * 0.3, -s * 0.25 - s * 1.3 * lv, s * 0.6, s * 1.3 * lv);
            ctx.globalCompositeOperation = 'lighter';
            ctx.drawImage(glowSprite('#c04aff'), -s * 1.1, -s * 1.9, s * 2.2, s * 2.2);
            ctx.globalCompositeOperation = 'source-over';
            ctx.fillStyle = '#f6c0ff';
            for (let k = 0; k < 3; k++) { const by = -s * 0.4 - ((t * 0.8 + k * 0.33 + tg.ph) % 1) * s * 0.7; ctx.beginPath(); ctx.arc(-s * 0.12 + k * s * 0.12, by, s * 0.05, 0, TAU); ctx.fill(); }
            ctx.fillStyle = '#c8a050';
            ctx.fillRect(-s * 0.38, -s * 1.7, s * 0.76, s * 0.16); ctx.fillRect(-s * 0.38, -s * 0.32, s * 0.76, s * 0.1);
          } else {
            // Farol hextec de Piltover: poste de latón y gema azul encerrada
            ctx.fillStyle = '#5a4a2a'; ctx.fillRect(-s * 0.07, -s * 1.2, s * 0.14, s * 1.2);
            ctx.globalCompositeOperation = 'lighter';
            ctx.drawImage(glowSprite('#7fd0ff'), -s, -s * 2.2, s * 2, s * 2);
            ctx.globalCompositeOperation = 'source-over';
            ctx.fillStyle = 'rgba(190,235,255,0.85)';
            ctx.beginPath(); ctx.moveTo(-s * 0.28, -s * 1.25); ctx.lineTo(s * 0.28, -s * 1.25); ctx.lineTo(s * 0.2, -s * 1.75); ctx.lineTo(-s * 0.2, -s * 1.75); ctx.closePath(); ctx.fill();
            ctx.fillStyle = '#c8a050';
            ctx.beginPath(); ctx.moveTo(-s * 0.32, -s * 1.75); ctx.lineTo(0, -s * 2); ctx.lineTo(s * 0.32, -s * 1.75); ctx.closePath(); ctx.fill();
          }
          ctx.restore();
        }
      }
      function shoot() {
        g.kick = 1; g.flash = 1; FX.shake(8);
        Audio2.sfx.choice(); buzz(25);
        const { x, y } = g.aim;
        const hit = g.targets.find((tg) => {
          const s = tg.s * Math.min(w, h) * 0.022;
          return !tg.down && Math.abs(tg.x - x) < s * 0.55 && y > tg.y - s * 0.6 && y < tg.y + s * 1.4;
        });
        if (!hit) { FX.burst(x, y, 6, { color: '#c8b080', kind: 'spark', speed: 140, life: 0.3 }); FX.text(x, y - R - 30, 'Fallo', '#c8b080', 22); return; }
        hit.down = 0.001;
        if (hit.thug) {
          g.hits++;
          FX.text(x, y - R - 30, g.holding ? '¡Disparo limpio!' : '¡Reventado!', '#ffe08a', 28);
          FX.burst(x, y, 24, { color: ['#c04aff', '#e8a0ff', '#ffffff'], kind: 'shard', speed: 320, life: 0.6, size: 3 });
          FX.impact(x, y, { power: 0.9, colors: ['#c04aff', '#e070ff', '#ffe08a'] });
        } else {
          g.civ++;
          FX.hurt(0.9); FX.text(x, y - R - 30, '¡Un farol!', '#ff6a6a', 30);
          FX.burst(x, y, 20, { color: ['#bfeaff', '#7fd0ff', '#ffffff'], kind: 'shard', speed: 300, life: 0.6, size: 3 });
          Audio2.sfx.locked();
        }
      }
      return g;
    },
  };

  // ---------- 3. Los chompers de Jinx (lanzamiento con física) ----------
  GAMES.chompers = {
    title: 'Los chompers de Jinx', icon: '', scene: 'escondite-jinx', grade: 'foso',
    backdrops: ['escondite-jinx', 'fabrica', 'puente-zaun', 'callejones', 'mercado', 'sumidero'],
    touchKeys: [['arrowup', '▲'], ['arrowdown', '▼'], [' ', 'Lanzar']], touchLayout: 'sides',
    desc: 'Jinx te presta sus chompers: granadas con dientes que rebotan y explotan a los dos segundos. Revienta las torretas hextec de los ejecutores. Cuidado con el viento de los túneles.',
    controls: 'Arrastra hacia atrás desde el lanzador y suelta (como un tirachinas). O ↑ ↓ para el ángulo, ← → para la fuerza y Espacio para lanzar.', touchControls: 'Arrastra hacia atrás y suelta para lanzar.',
    goal: 'Destruye las 3 torretas con 8 chompers.',
    winText: '¡BUM! Jinx aplaude dando saltitos. «¡Otra vez, otra vez!»', loseText: 'Sin chompers y las torretas siguen en pie. Jinx hace un puchero.',
    create(w, h, o = {}) {
      const b = o.bonus || 0;
      const ground = h * 0.84;
      const G = 900;
      const L = { x: w * 0.12, y: ground - 40 };
      const ammo0 = 8 + b;
      const vpx = w * 0.55;
      const vpy = h * 0.3;
      // Fortín: columnas de cajas con una torreta encima de algunas.
      const crates = [];
      const turrets = [];
      const cs = Math.min(w, h) * 0.065;
      const cols = [0.55, 0.66, 0.77, 0.88];
      cols.forEach((cx, i) => {
        const n = [2, 4, 3, 5][i];
        for (let k = 0; k < n; k++) crates.push({ x: w * cx, y: ground - cs * (k + 1), vy: 0, hp: 1, col: i });
        if (i !== 1) turrets.push({ x: w * cx, y: ground - cs * n - cs * 0.7, vy: 0, hp: 2, col: i, ph: Math.random() * TAU });
      });
      const g = {
        result: null, ammo: ammo0, ball: null, aimA: -0.75, power: 0.65, drag: null, wind: 0, t: 0, booms: [],
        cam() { return { x: g.ball ? clamp((g.ball.x / w - 0.5) * 0.8, -1, 1) : -0.3, y: -0.1, zoom: 1.06 }; },
        update(dt, inp) {
          g.t += dt;
          // Apuntar: arrastre tipo tirachinas o teclado
          if (!g.ball) {
            if (inp.mouse.clicks.length && !g.drag) g.drag = { x: inp.mouse.clicks[0].x, y: inp.mouse.clicks[0].y };
            if (g.drag && inp.mouse.down) {
              const dx = g.drag.x - inp.mouse.x;
              const dy = g.drag.y - inp.mouse.y;
              if (Math.hypot(dx, dy) > 8) { g.aimA = clamp(Math.atan2(dy, dx), -1.45, 0.2); g.power = clamp(Math.hypot(dx, dy) / (Math.min(w, h) * 0.35), 0.2, 1); }
            } else if (g.drag && !inp.mouse.down) {
              const moved = Math.hypot(g.drag.x - inp.mouse.x, g.drag.y - inp.mouse.y) > 12;
              g.drag = null;
              if (moved) throwIt();
            }
            if (inp.keys.has('arrowup') || inp.keys.has('w')) g.aimA = clamp(g.aimA - dt * 1.2, -1.45, 0.2);
            if (inp.keys.has('arrowdown') || inp.keys.has('s')) g.aimA = clamp(g.aimA + dt * 1.2, -1.45, 0.2);
            if (inp.keys.has('arrowright') || inp.keys.has('d')) g.power = clamp(g.power + dt * 0.6, 0.2, 1);
            if (inp.keys.has('arrowleft') || inp.keys.has('a')) g.power = clamp(g.power - dt * 0.6, 0.2, 1);
            if (inp.pressed.includes(' ')) throwIt();
          } else {
            const c = g.ball;
            c.vx += g.wind * dt; c.vy += G * dt;
            c.x += c.vx * dt; c.y += c.vy * dt; c.rot += c.vx * dt * 0.05; c.fuse -= dt;
            if (c.y > ground - c.r) { c.y = ground - c.r; c.vy *= -0.45; c.vx *= 0.75; if (Math.abs(c.vy) > 80) { FX.burst(c.x, ground, 6, { color: '#b0a890', kind: 'smoke', speed: 100, life: 0.4, gravity: -30, size: 5 }); Audio2.sfx.click(); } }
            for (const cr of crates) if (cr.hp > 0 && Math.abs(c.x - cr.x) < cs / 2 + c.r && Math.abs(c.y - (cr.y + cs / 2)) < cs / 2 + c.r) {
              // Si viene de arriba rebota en la tapa; si no, en el lateral.
              if (c.vy > 0 && c.y - c.vy * dt <= cr.y - c.r + 2) { c.y = cr.y - c.r; c.vy *= -0.45; c.vx *= 0.8; }
              else { const fromLeft = c.x < cr.x; c.vx = -c.vx * 0.4; c.x = cr.x + (fromLeft ? -1 : 1) * (cs / 2 + c.r + 1); }
            }
            if (c.x < -50 || c.x > w + 50) c.fuse = Math.min(c.fuse, 0);
            if (Math.random() < 0.9) FX.burst(c.x - 6, c.y - c.r, 1, { color: ['#ff9a3a', '#ffe08a'], kind: 'spark', speed: 60, life: 0.25, gravity: -50, size: 1.5 });
            if (c.fuse <= 0) boom(c.x, c.y);
          }
          // Las cajas y torretas sin apoyo caen.
          for (const it of [...crates, ...turrets]) {
            if (it.hp <= 0) continue;
            const isT = turrets.includes(it);
            const bottom = it.y + (isT ? cs * 0.7 : cs);
            const below = crates.filter((c2) => c2 !== it && c2.hp > 0 && c2.col === it.col && c2.y > it.y).reduce((m, c2) => Math.min(m, c2.y), ground);
            if (bottom < below - 0.5) { it.vy += G * dt; it.y = Math.min(it.y + it.vy * dt, below - (isT ? cs * 0.7 : cs)); }
            else if (it.vy > 300) { it.vy = 0; FX.shake(4); if (isT) damage(it, 1, it.x, it.y); } else it.vy = 0;
          }
          g.booms.forEach((bm) => { bm.life -= dt * 2; });
          g.booms = g.booms.filter((bm) => bm.life > 0);
          if (turrets.every((tr) => tr.hp <= 0)) g.result = true;
          else if (!g.ball && g.ammo <= 0 && !g.booms.length) g.result = false;
        },
        draw(ctx, t) {
          Depth.floor(ctx, w, h, h * 0.62, { colors: ['rgba(26,10,20,0)', 'rgba(26,12,22,0.8)', 'rgba(8,4,8,0.96)'], line: 'rgba(224,69,123,0.14)', vx: vpx, wet: 'rgba(224,69,123,0.12)', rows: 9 });
          Depth.fog(ctx, w, h, t, { color: '224,120,200', y0: 0.55, y1: 0.95, alpha: 0.08 });
          // Cajas y torretas en 3D
          for (const cr of crates) if (cr.hp > 0) {
            Depth.box(ctx, cr.x - cs / 2, cr.y, cs, cs, 0.12, vpx, vpy, { front: '#6a5a40', frontDark: '#2a2014', top: '#8a7a54', side: '#1a140a',
              tex: (c, bx, by, bw, bh) => { c.strokeStyle = '#1a1208'; c.lineWidth = 3; c.strokeRect(bx + 2, by + 2, bw - 4, bh - 4); c.beginPath(); c.moveTo(bx + 4, by + 4); c.lineTo(bx + bw - 4, by + bh - 4); c.stroke(); c.fillStyle = '#c8a050'; for (const [rx, ry] of [[0.15, 0.15], [0.85, 0.15], [0.15, 0.85], [0.85, 0.85]]) { c.beginPath(); c.arc(bx + bw * rx, by + bh * ry, 2, 0, TAU); c.fill(); } } });
          }
          for (const tr of turrets) if (tr.hp > 0) {
            const th = cs * 0.7;
            Depth.box(ctx, tr.x - cs * 0.45, tr.y + th * 0.4, cs * 0.9, th * 0.6, 0.12, vpx, vpy, { front: '#2a3a5a', frontDark: '#101828', top: '#4a5a7a', side: '#0a1018' });
            const aim = Math.atan2(L.y - tr.y, L.x - tr.x) + Math.sin(t * 2 + tr.ph) * 0.1;
            ctx.save(); ctx.translate(tr.x, tr.y + th * 0.3); ctx.rotate(aim);
            ctx.fillStyle = '#c8a050'; ctx.fillRect(0, -4, cs * 0.6, 8);
            ctx.restore();
            Depth.orb(ctx, tr.x, tr.y + th * 0.3, cs * 0.28, tr.hp > 1 ? '#3fa9f5' : '#ff7a5a', { glow: true, dark: '#0a1020' });
          }
          // Jinx en el lanzador: retrato real en un medallón
          const face = Depth.face('jinx');
          Depth.medallion(ctx, face, L.x - w * 0.04, L.y - h * 0.2, Math.min(w, h) * 0.07, { rim: '#e0457b', glow: 24 });
          // Trayectoria prevista
          if (!g.ball && g.ammo > 0) {
            const v = 300 + g.power * 700;
            let x = L.x; let y = L.y; let vx = Math.cos(g.aimA) * v; let vy = Math.sin(g.aimA) * v;
            ctx.fillStyle = 'rgba(255,224,138,0.8)';
            for (let i = 0; i < 26; i++) {
              for (let k = 0; k < 3; k++) { vx += g.wind * 0.016; vy += G * 0.016; x += vx * 0.016; y += vy * 0.016; }
              if (y > ground) break;
              ctx.globalAlpha = 1 - i / 26;
              ctx.beginPath(); ctx.arc(x, y, 3.2 - i * 0.08, 0, TAU); ctx.fill();
            }
            ctx.globalAlpha = 1;
          }
          // Tirachinas
          ctx.strokeStyle = '#3a2a2a'; ctx.lineWidth = 8; ctx.lineCap = 'round';
          ctx.beginPath(); ctx.moveTo(L.x, ground); ctx.lineTo(L.x, L.y + 10); ctx.moveTo(L.x, L.y + 10); ctx.lineTo(L.x - 16, L.y - 14); ctx.moveTo(L.x, L.y + 10); ctx.lineTo(L.x + 16, L.y - 14); ctx.stroke();
          const pull = g.ball ? 0 : g.power * 34;
          const px = L.x - Math.cos(g.aimA) * pull;
          const py = L.y - Math.sin(g.aimA) * pull;
          ctx.strokeStyle = '#e0457b'; ctx.lineWidth = 3;
          ctx.beginPath(); ctx.moveTo(L.x - 16, L.y - 14); ctx.lineTo(px, py); ctx.lineTo(L.x + 16, L.y - 14); ctx.stroke();
          if (!g.ball && g.ammo > 0) chomper(ctx, px, py, Math.min(w, h) * 0.022, 0, t);
          if (g.ball) { Depth.shadow(ctx, g.ball.x, ground + 2, g.ball.r * 1.4, g.ball.r * 0.35, 0.5 * clamp(1 - (ground - g.ball.y) / 300, 0.1, 1)); chomper(ctx, g.ball.x, g.ball.y, g.ball.r, g.ball.rot, t, g.ball.fuse); }
          // Explosiones: bola de luz y onda
          for (const bm of g.booms) {
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            ctx.globalAlpha = bm.life;
            const r = bm.r * (1.4 - bm.life * 0.6);
            ctx.drawImage(glowSprite('#ff7ab0'), bm.x - r * 1.5, bm.y - r * 1.5, r * 3, r * 3);
            ctx.strokeStyle = '#7fd0ff'; ctx.lineWidth = 4 * bm.life;
            ctx.beginPath(); ctx.arc(bm.x, bm.y, r, 0, TAU); ctx.stroke();
            ctx.restore();
          }
          // Veleta del viento
          const wx = w * 0.5;
          ctx.fillStyle = 'rgba(255,255,255,0.75)'; ctx.font = '600 14px Georgia, serif'; ctx.textAlign = 'center';
          ctx.fillText('Viento', wx, 28);
          ctx.strokeStyle = '#7affd0'; ctx.lineWidth = 3;
          const wl = g.wind / 4;
          ctx.beginPath(); ctx.moveTo(wx - wl, 42); ctx.lineTo(wx + wl, 42); ctx.lineTo(wx + wl - Math.sign(wl) * 8, 36); ctx.moveTo(wx + wl, 42); ctx.lineTo(wx + wl - Math.sign(wl) * 8, 48); ctx.stroke();
        },
        hud() { return bar('Torretas', turrets.filter((tr) => tr.hp <= 0).length, turrets.length, '#e0457b') + `<span class="mg-num">Chompers: ${g.ammo}</span>` + bar('Fuerza', g.power, 1, '#e3c45a'); },
      };
      function throwIt() {
        if (g.ball || g.ammo <= 0) return;
        g.ammo--;
        const v = 300 + g.power * 700;
        g.ball = { x: L.x, y: L.y, vx: Math.cos(g.aimA) * v, vy: Math.sin(g.aimA) * v, r: Math.min(w, h) * 0.022, rot: 0, fuse: 2.1 };
        Audio2.sfx.choice(); buzz(15);
        FX.text(L.x + 40, L.y - 60, pick(['¡Ñam!', '¡Al ataque!', '¡Bum bum!']), '#ff7ab0', 22);
      }
      function damage(it, n, x, y) {
        it.hp -= n;
        if (it.hp <= 0) FX.burst(x, y, 26, { color: turrets.includes(it) ? ['#3fa9f5', '#bfeaff', '#ffffff'] : ['#8a7a54', '#c8a050', '#3a2a14'], kind: 'shard', speed: 420, size: 4, life: 0.8 });
      }
      function boom(x, y) {
        g.ball = null;
        const R = Math.min(w, h) * 0.16;
        g.booms.push({ x, y, r: R, life: 1 });
        FX.burst(x, y, 70, { color: ['#ff7ab0', '#e0457b', '#7fd0ff', '#ffe08a'], speed: 620, life: 0.8, size: 4 });
        FX.burst(x, y, 16, { color: '#5a4a5a', kind: 'smoke', speed: 160, life: 1.4, gravity: -60, size: 14 });
        FX.shake(22); FX.flash(0.35, '255,180,220');
        FX.impact(x, y, { power: 1.4, colors: ['#ff4aa0', '#3fd0ff', '#ffe08a'], frameCol: '255,200,235' });
        Audio2.sfx.unlock(); buzz([40, 20, 40]);
        for (const it of [...crates, ...turrets]) {
          if (it.hp <= 0) continue;
          const d = Math.hypot(it.x - x, it.y + cs / 2 - y);
          if (d < R) { damage(it, d < R * 0.5 ? 2 : 1, it.x, it.y); if (turrets.includes(it) && it.hp <= 0) FX.text(it.x, it.y - 30, '¡Torreta fuera!', '#ffe08a', 28); }
        }
        g.wind = (Math.random() - 0.5) * 240;
      }
      // Chomper: bola morada con dientes y ojitos, mecha que chisporrotea.
      function chomper(ctx, x, y, r, rot, t, fuse = 3) {
        ctx.save();
        ctx.translate(x, y); ctx.rotate(rot);
        Depth.orb(ctx, 0, 0, r, fuse < 0.7 && Math.sin(t * 40) > 0 ? '#ff5a8a' : '#8a4aaa', { dark: '#1a0a24', hi: '#f0c0ff' });
        ctx.fillStyle = '#fff6e0';
        ctx.beginPath(); ctx.moveTo(-r * 0.7, r * 0.1);
        for (let i = 0; i <= 6; i++) ctx.lineTo(-r * 0.7 + (i * r * 1.4) / 6, r * (i % 2 ? 0.45 : 0.1));
        ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#ff4a8a';
        ctx.beginPath(); ctx.arc(-r * 0.3, -r * 0.35, r * 0.13, 0, TAU); ctx.arc(r * 0.3, -r * 0.35, r * 0.13, 0, TAU); ctx.fill();
        ctx.restore();
      }
      g.wind = (Math.random() - 0.5) * 160;
      return g;
    },
  };
})();
