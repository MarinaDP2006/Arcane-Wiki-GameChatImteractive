// Motor del mundo abierto: mapa 2D de Piltover y Zaun con movimiento libre,
// colisiones, cámara, minimapa, personajes de Arcane, lugares con su imagen y cristales hextec.
(function () {
  const W = () => window.WORLD;
  const PLAYER_R = 15;
  const SPEED = 230;
  const TALK_DIST = 75;
  const LOC_DIST = 95;

  let canvas, ctx, mini, mctx;
  let G = null;
  let cb = {};
  let running = false;
  let loopId = 0; // evita dos bucles de dibujo a la vez
  let paused = false;
  let last = 0;
  let mapId = null;
  let map = null; // datos del mapa + edificios generados
  let target = null; // destino del clic
  let particles = [];
  let nearest = null;
  let insideLoc = null;
  let fade = 0;
  const keys = new Set();
  const imgCache = new Map();

  // ---------- Generación ----------
  function rng(seed) {
    let a = seed >>> 0;
    return () => {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const cache = {};
  function buildMap(id) {
    if (cache[id]) return cache[id];
    const def = W().maps[id];
    const [w, h] = def.size;
    const r = rng(def.seed);
    const BLOCK = 250;
    const STREET = 74;
    const keepClear = [
      ...def.locations.map((l) => ({ x: l.x, y: l.y, r: 150 })),
      ...def.fragments.map((f) => ({ x: f.x, y: f.y, r: 50 })),
    ];
    const blocked = (x, y, bw, bh) => keepClear.some((c) => {
      const nx = Math.max(x, Math.min(c.x, x + bw));
      const ny = Math.max(y, Math.min(c.y, y + bh));
      return (nx - c.x) ** 2 + (ny - c.y) ** 2 < c.r * c.r;
    });
    const buildings = [];
    for (let bx = 0; bx < w; bx += BLOCK) {
      for (let by = 0; by < h; by += BLOCK) {
        const x0 = bx + STREET / 2;
        const y0 = by + STREET / 2;
        const size = BLOCK - STREET;
        if (r() < 0.12) continue; // patio o solar vacío
        const split = r() < 0.5 ? 1 : 2;
        const cell = size / split;
        for (let i = 0; i < split; i++) {
          for (let j = 0; j < split; j++) {
            if (split > 1 && r() < 0.2) continue;
            const pad = 6 + r() * 10;
            const bw = cell - pad * 2;
            const bh = cell - pad * 2;
            const x = x0 + i * cell + pad;
            const y = y0 + j * cell + pad;
            if (x + bw > w - 10 || y + bh > h - 10 || blocked(x, y, bw, bh)) continue;
            buildings.push({
              x, y, w: bw, h: bh,
              color: def.palette.building[Math.floor(r() * def.palette.building.length)],
              roof: def.palette.roof[Math.floor(r() * def.palette.roof.length)],
              tall: r(), sign: r() < 0.35, chimney: r() < 0.4,
            });
          }
        }
      }
    }
    cache[id] = { id, def, w, h, buildings, BLOCK, STREET };
    return cache[id];
  }

  // ---------- Imágenes de retrato ----------
  function svgImage(key, svg) {
    if (imgCache.has(key)) return imgCache.get(key);
    const img = new Image();
    img.src = svg.startsWith('<svg') ? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}` : svg;
    imgCache.set(key, img);
    return img;
  }
  // Personajes: su avatar de chat (carpeta caras, imágenes de la Arcane Wiki).
  function charImg(id) { return svgImage(`c:${id}`, Portrait.customChar(id, false) || Portrait.charURL(id, 96)); }

  // Imagen de cada lugar: la de la carpeta de arte o, si no hay, la del Atlas.
  const ATLAS_IMG = {
    academia: 'piltover-academy', 'taller-jayce': 'hextech-lab', consejo: 'council-chamber', ejecutores: 'stillwater-hold',
    'mansion-kiramman': 'kiramman-estate', plaza: 'piltover', artesanos: 'airship-docks', hexpuertas: 'the-hexgates',
    'muelle-stillwater': 'stillwater-hold', puente: 'bridge-of-progress', 'puente-zaun': 'bridge-of-progress',
    fabrica: 'shimmer-factory', foso: 'undercity', tejados: 'zaun', 'ultima-gota': 'the-last-drop', callejones: 'the-lanes',
    'tienda-benzo': 'benzos-pawn-shop', mercado: 'undercity', sumidero: 'zaun', 'escondite-jinx': 'the-lanes', arbol: 'firelight-sanctuary',
  };
  function placeImg(l) {
    const url = window.CustomArt?.image('lugares', l.id) || (ATLAS_IMG[l.id] && `img/atlas/${ATLAS_IMG[l.id]}.webp`);
    return url ? svgImage(`l:${l.id}`, url) : null;
  }
  function playerImg() {
    const url = Portrait.playerURL(G.player, 96);
    return svgImage(`p:${url.length}:${url.slice(-32)}`, url);
  }

  // ---------- Entidades dinámicas ----------
  function locById(id) {
    for (const [mid, m] of Object.entries(W().maps)) {
      const l = m.locations.find((x) => x.id === id);
      if (l) return { ...l, map: mid };
    }
    return null;
  }

  function npcs() {
    const out = [];
    const byLoc = {};
    for (const id of G.unlocked) {
      if ((W().absent[id] || []).includes(G.progress.chapterId)) continue;
      const loc = locById(W().homes[id]);
      if (!loc || loc.map !== mapId) continue;
      const n = (byLoc[loc.id] = (byLoc[loc.id] || 0) + 1);
      const ang = n * 1.25 + 0.6;
      out.push({ kind: 'char', id, name: window.WIKI.personajes.find((p) => p.id === id)?.name || id, x: loc.x + Math.cos(ang) * 125, y: loc.y + Math.sin(ang) * 100 });
    }
    return out;
  }

  function objectiveLoc() {
    const id = cb.objective?.();
    return id ? locById(id) : null;
  }

  // ---------- Física ----------
  function collides(x, y) {
    if (x < PLAYER_R || y < PLAYER_R || x > map.w - PLAYER_R || y > map.h - PLAYER_R) return true;
    for (const b of map.buildings) {
      if (x + PLAYER_R > b.x && x - PLAYER_R < b.x + b.w && y + PLAYER_R > b.y && y - PLAYER_R < b.y + b.h) return true;
    }
    return false;
  }

  function freeSpot(x, y) {
    if (!collides(x, y)) return { x, y };
    for (let rad = 20; rad < 400; rad += 20) {
      for (let a = 0; a < Math.PI * 2; a += Math.PI / 8) {
        const nx = x + Math.cos(a) * rad;
        const ny = y + Math.sin(a) * rad;
        if (!collides(nx, ny)) return { x: nx, y: ny };
      }
    }
    return { x, y };
  }

  function update(dt) {
    const pos = G.world;
    let dx = 0;
    let dy = 0;
    if (keys.has('arrowleft') || keys.has('a')) dx -= 1;
    if (keys.has('arrowright') || keys.has('d')) dx += 1;
    if (keys.has('arrowup') || keys.has('w')) dy -= 1;
    if (keys.has('arrowdown') || keys.has('s')) dy += 1;
    if (dx || dy) target = null;
    else if (target) {
      const tx = target.x - pos.x;
      const ty = target.y - pos.y;
      const d = Math.hypot(tx, ty);
      if (d < 6) target = null;
      else { dx = tx / d; dy = ty / d; }
    }
    const len = Math.hypot(dx, dy);
    if (len) {
      const sp = SPEED * (keys.has('shift') ? 1.7 : 1) * (G.player.keystone === 'pies' ? 1.3 : 1) * dt;
      const mx = (dx / len) * sp;
      const my = (dy / len) * sp;
      let moved = false;
      if (!collides(pos.x + mx, pos.y)) { pos.x += mx; moved = true; }
      if (!collides(pos.x, pos.y + my)) { pos.y += my; moved = true; }
      if (!moved) target = null;
      pos.dir = Math.atan2(dy, dx);
      pos.walk = (pos.walk || 0) + dt * 10;
    }

    // Fragmentos: se recogen al pasar por encima.
    for (const f of map.def.fragments) {
      if (!G.codex.includes(f.codex) && Math.hypot(f.x - pos.x, f.y - pos.y) < 32) cb.onFragment?.(f);
    }

    // Lugar en el que estamos.
    const here = map.def.locations.find((l) => Math.hypot(l.x - pos.x, l.y - pos.y) < LOC_DIST);
    if (here && here.id !== insideLoc) cb.onVisit?.(here);
    insideLoc = here?.id || null;

    // Lo más cercano con lo que interactuar.
    nearest = null;
    let best = TALK_DIST;
    for (const n of npcs()) {
      const d = Math.hypot(n.x - pos.x, n.y - pos.y);
      if (d < best) { best = d; nearest = n; }
    }
    // En el centro de un lugar, el lugar (historia, actividades) tiene prioridad.
    if (here && (!nearest || Math.hypot(here.x - pos.x, here.y - pos.y) < 60)) nearest = { kind: 'loc', ...here };
    updatePrompt();
    updateDistrict();

    // Partículas de ambiente.
    if (particles.length < 70 && Math.random() < 0.5) {
      const cam = camera();
      particles.push({ x: cam.x + Math.random() * canvas.width, y: cam.y + canvas.height + 10, vy: -(20 + Math.random() * 40), vx: (Math.random() - 0.5) * 15, life: 6 + Math.random() * 6, r: map.def.palette.particle === 'smoke' ? 18 + Math.random() * 30 : 1.5 + Math.random() * 2 });
    }
    particles.forEach((p) => { p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt; });
    particles = particles.filter((p) => p.life > 0);
    if (fade > 0) fade = Math.max(0, fade - dt * 1.5);
  }

  function camera() {
    const x = Math.max(0, Math.min(map.w - canvas.width, G.world.x - canvas.width / 2));
    const y = Math.max(0, Math.min(map.h - canvas.height, G.world.y - canvas.height / 2));
    return { x: map.w < canvas.width ? (map.w - canvas.width) / 2 : x, y: map.h < canvas.height ? (map.h - canvas.height) / 2 : y };
  }

  // ---------- Dibujo ----------
  function draw(t) {
    const cam = camera();
    const P = map.def.palette;
    const zaun = mapId === 'zaun';
    ctx.save();
    ctx.fillStyle = P.ground;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.translate(-cam.x, -cam.y);

    // Barrios
    for (const d of map.def.districts) {
      const [x, y, w, h] = d.rect;
      ctx.fillStyle = d.tint;
      ctx.fillRect(x, y, w, h);
      ctx.fillStyle = zaun ? 'rgba(160,255,220,0.07)' : 'rgba(255,240,200,0.08)';
      ctx.font = 'bold 54px Georgia, serif';
      ctx.textAlign = 'center';
      ctx.fillText(d.name.toUpperCase(), x + w / 2, y + h / 2);
    }

    // Calles
    ctx.strokeStyle = P.street;
    ctx.lineWidth = map.STREET - 20;
    ctx.beginPath();
    for (let x = 0; x <= map.w; x += map.BLOCK) { ctx.moveTo(x, 0); ctx.lineTo(x, map.h); }
    for (let y = 0; y <= map.h; y += map.BLOCK) { ctx.moveTo(0, y); ctx.lineTo(map.w, y); }
    ctx.stroke();
    ctx.strokeStyle = zaun ? 'rgba(63,191,159,0.10)' : 'rgba(255,255,255,0.08)';
    ctx.setLineDash([18, 22]);
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.setLineDash([]);

    // Tuberías de Zaun
    if (zaun) {
      ctx.strokeStyle = 'rgba(143,191,58,0.25)';
      ctx.lineWidth = 9;
      for (let i = 0; i < 6; i++) {
        ctx.beginPath();
        ctx.moveTo(0, 180 + i * 360);
        ctx.bezierCurveTo(800, 100 + i * 360, 2000, 300 + i * 360, map.w, 200 + i * 360);
        ctx.stroke();
      }
    }

    // Edificios (solo los visibles)
    for (const b of map.buildings) {
      if (b.x > cam.x + canvas.width + 40 || b.x + b.w < cam.x - 40 || b.y > cam.y + canvas.height + 60 || b.y + b.h < cam.y - 60) continue;
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      ctx.fillRect(b.x + 8, b.y + 10, b.w, b.h);
      ctx.fillStyle = b.color;
      ctx.fillRect(b.x, b.y, b.w, b.h);
      ctx.fillStyle = b.roof;
      ctx.globalAlpha = zaun ? 0.35 : 0.85;
      ctx.fillRect(b.x + 6, b.y + 6, b.w - 12, b.h * 0.35);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = P.outline;
      ctx.lineWidth = 2;
      ctx.strokeRect(b.x, b.y, b.w, b.h);
      // Ventanas iluminadas
      ctx.fillStyle = zaun ? 'rgba(255,210,120,0.55)' : 'rgba(80,120,160,0.55)';
      for (let wx = b.x + 14; wx < b.x + b.w - 14; wx += 22) {
        for (let wy = b.y + b.h * 0.45; wy < b.y + b.h - 12; wy += 22) {
          if ((wx * 7 + wy * 3) % 5 < 3) ctx.fillRect(wx, wy, 8, 10);
        }
      }
      if (zaun && b.sign) {
        const glow = 0.6 + Math.sin(t / 300 + b.x) * 0.4;
        ctx.shadowColor = b.roof;
        ctx.shadowBlur = 18 * glow;
        ctx.fillStyle = b.roof;
        ctx.fillRect(b.x + b.w * 0.2, b.y + b.h - 18, b.w * 0.6, 7);
        ctx.shadowBlur = 0;
      }
      if (b.chimney) {
        ctx.fillStyle = zaun ? '#1a1a22' : '#8a6a4a';
        ctx.fillRect(b.x + b.w - 26, b.y - 14, 14, 26);
      }
      if (!zaun && b.tall > 0.9) {
        // Torre con reloj
        ctx.fillStyle = '#e3c45a';
        ctx.beginPath();
        ctx.arc(b.x + b.w / 2, b.y + b.h / 2, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#3a2a12';
        ctx.beginPath();
        ctx.moveTo(b.x + b.w / 2, b.y + b.h / 2);
        ctx.lineTo(b.x + b.w / 2 + Math.cos(t / 2000) * 12, b.y + b.h / 2 + Math.sin(t / 2000) * 12);
        ctx.stroke();
      }
    }

    // Farolas hextec en los cruces de Piltover; en Zaun, lámparas de quimtec.
    for (let x = map.BLOCK; x < map.w; x += map.BLOCK) {
      for (let y = map.BLOCK; y < map.h; y += map.BLOCK) {
        if ((x / map.BLOCK + y / map.BLOCK) % 2) continue;
        if (x < cam.x - 60 || x > cam.x + canvas.width + 60 || y < cam.y - 60 || y > cam.y + canvas.height + 60) continue;
        hexLamp(x, y, t, zaun);
      }
    }

    // Lugares: cada uno con su imagen enmarcada
    const obj = objectiveLoc();
    for (const l of map.def.locations) {
      const pulse = 0.5 + Math.sin(t / 500) * 0.5;
      const isObj = obj && obj.id === l.id;
      const g = ctx.createRadialGradient(l.x, l.y, 10, l.x, l.y, 130);
      g.addColorStop(0, isObj ? `rgba(255,220,120,${0.35 + pulse * 0.3})` : `${P.glow}44`);
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(l.x, l.y, 130, 0, Math.PI * 2);
      ctx.fill();
      placeCard(l, isObj, t);
      label(l.name, l.x, l.y - 70, isObj ? '#ffe08a' : '#fff');
      if (isObj) label('★ OBJETIVO', l.x, l.y - 94, '#ffe08a');
    }

    // Fragmentos del Códice: cristales hextec flotando
    for (const f of map.def.fragments) {
      if (G.codex.includes(f.codex)) continue;
      hexCrystal(f.x, f.y + Math.sin(t / 300 + f.x) * 4, t);
    }

    // Personajes de Arcane
    for (const n of npcs()) drawPerson(charImg(n.id), n.x, n.y, n.name, P.glow, 24, true);

    // Jugador
    const pos = G.world;
    const bounce = Math.abs(Math.sin(pos.walk || 0)) * 3;
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.beginPath();
    ctx.ellipse(pos.x, pos.y + PLAYER_R + 4, PLAYER_R, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    drawPerson(playerImg(), pos.x, pos.y - bounce, G.player.name, '#ffe08a', PLAYER_R + 4, true);
    if (target) {
      ctx.strokeStyle = 'rgba(255,224,138,0.6)';
      ctx.beginPath();
      ctx.arc(target.x, target.y, 10 + Math.sin(t / 150) * 3, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Partículas en coordenadas de mundo
    for (const p of particles) {
      if (P.particle === 'smoke') {
        ctx.fillStyle = `rgba(120,220,180,${0.03 * Math.min(1, p.life / 3)})`;
      } else {
        ctx.fillStyle = `rgba(255,220,120,${0.5 * Math.min(1, p.life / 3)})`;
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // Viñeta
    const v = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, canvas.height * 0.3, canvas.width / 2, canvas.height / 2, canvas.height * 0.9);
    v.addColorStop(0, 'transparent');
    v.addColorStop(1, zaun ? 'rgba(0,20,10,0.65)' : 'rgba(30,20,0,0.45)');
    ctx.fillStyle = v;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Flecha hacia el objetivo cuando no está en pantalla
    if (obj) drawObjectiveArrow(obj, cam);
    if (fade > 0) {
      ctx.fillStyle = `rgba(0,0,0,${fade})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    drawMini(obj);
  }

  // Tarjeta del lugar: imagen recortada en hexágono alargado con marco dorado (o verde en Zaun).
  function placeCard(l, isObj, t) {
    const W2 = 74;
    const H2 = 50;
    const zaun = mapId === 'zaun';
    const frame = isObj ? '#ffe08a' : zaun ? '#3fbf9f' : '#e3c45a';
    const shape = () => {
      ctx.beginPath();
      ctx.moveTo(l.x - W2 + 14, l.y - H2);
      ctx.lineTo(l.x + W2 - 14, l.y - H2);
      ctx.lineTo(l.x + W2, l.y - H2 + 14);
      ctx.lineTo(l.x + W2, l.y + H2 - 14);
      ctx.lineTo(l.x + W2 - 14, l.y + H2);
      ctx.lineTo(l.x - W2 + 14, l.y + H2);
      ctx.lineTo(l.x - W2, l.y + H2 - 14);
      ctx.lineTo(l.x - W2, l.y - H2 + 14);
      ctx.closePath();
    };
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.7)';
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 8;
    shape();
    ctx.fillStyle = '#0d0b14';
    ctx.fill();
    ctx.restore();
    const img = placeImg(l);
    ctx.save();
    shape();
    ctx.clip();
    if (img && img.complete && img.naturalWidth) {
      // Encuadre «cover» dentro de la tarjeta
      const s = Math.max((W2 * 2) / img.naturalWidth, (H2 * 2) / img.naturalHeight);
      const iw = img.naturalWidth * s;
      const ih = img.naturalHeight * s;
      ctx.drawImage(img, l.x - iw / 2, l.y - ih / 2, iw, ih);
    } else if (window.Scenes?.has(l.id)) {
      const th = svgImage(`t:${l.id}`, Scenes.thumb(l.id));
      if (th.complete && th.naturalWidth) ctx.drawImage(th, l.x - W2, l.y - H2, W2 * 2, H2 * 2);
    }
    ctx.restore();
    shape();
    ctx.strokeStyle = frame;
    ctx.lineWidth = isObj ? 4 : 2.5;
    if (isObj) { ctx.shadowColor = frame; ctx.shadowBlur = 16 + Math.sin(t / 250) * 6; }
    ctx.stroke();
    ctx.shadowBlur = 0;
    // Gema hextec en la parte de abajo del marco
    ctx.save();
    ctx.translate(l.x, l.y + H2);
    ctx.rotate(Math.PI / 4);
    ctx.fillStyle = '#7fd0ff';
    ctx.shadowColor = '#3fa9f5';
    ctx.shadowBlur = 12;
    ctx.fillRect(-5, -5, 10, 10);
    ctx.strokeStyle = frame;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(-5, -5, 10, 10);
    ctx.restore();
  }

  // Cristal hextec: gema azul con marco dorado hexagonal y anillo de runas girando.
  function hexCrystal(x, y, t) {
    ctx.save();
    ctx.translate(x, y);
    const glow = ctx.createRadialGradient(0, 0, 2, 0, 0, 34);
    glow.addColorStop(0, 'rgba(127,208,255,0.55)');
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(0, 0, 34, 0, Math.PI * 2);
    ctx.fill();
    ctx.save();
    ctx.rotate(t / 1600);
    ctx.strokeStyle = 'rgba(127,208,255,0.55)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 5]);
    ctx.beginPath();
    ctx.arc(0, 0, 22, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
    ctx.rotate(-t / 2400);
    ctx.strokeStyle = '#e3c45a';
    ctx.lineWidth = 2.5;
    hexPath(15);
    ctx.stroke();
    // Gema facetada
    ctx.shadowColor = '#3fa9f5';
    ctx.shadowBlur = 18;
    ctx.fillStyle = '#3fa9f5';
    ctx.beginPath();
    ctx.moveTo(0, -11); ctx.lineTo(8, 0); ctx.lineTo(0, 11); ctx.lineTo(-8, 0);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#d6f2ff';
    ctx.beginPath();
    ctx.moveTo(0, -11); ctx.lineTo(4, -2); ctx.lineTo(0, 2); ctx.lineTo(-4, -2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // Farola de los cruces: hextec azul en Piltover, quimtec verde en Zaun.
  function hexLamp(x, y, t, zaun) {
    const c = zaun ? '143,191,58' : '127,208,255';
    const flick = zaun ? 0.75 + Math.sin(t / 90 + x * 3 + y) * 0.15 : 0.9 + Math.sin(t / 700 + x) * 0.1;
    const g = ctx.createRadialGradient(x, y, 1, x, y, 46);
    g.addColorStop(0, `rgba(${c},${0.35 * flick})`);
    g.addColorStop(1, 'transparent');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, 46, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = zaun ? '#1a1a22' : '#5a4a2a';
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = `rgba(${c},${flick})`;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.PI / 4);
    ctx.fillRect(-3, -3, 6, 6);
    ctx.restore();
  }

  function hexPath(r) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 3) * i;
      ctx[i ? 'lineTo' : 'moveTo'](Math.cos(a) * r, Math.sin(a) * r);
    }
    ctx.closePath();
  }

  function label(text, x, y, color) {
    ctx.font = 'bold 15px system-ui, sans-serif';
    ctx.textAlign = 'center';
    const w = ctx.measureText(text).width + 14;
    ctx.fillStyle = 'rgba(10,8,16,0.75)';
    roundRect(x - w / 2, y - 14, w, 22, 8);
    ctx.fill();
    ctx.fillStyle = color;
    ctx.fillText(text, x, y + 2);
  }

  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function drawPerson(img, x, y, name, ring, r, showName) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = '#222';
    ctx.fill();
    ctx.clip();
    if (img.complete && img.naturalWidth) ctx.drawImage(img, x - r, y - r, r * 2, r * 2);
    ctx.restore();
    ctx.strokeStyle = ring;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.stroke();
    if (showName || (nearest && nearest.name === name)) label(name, x, y - r - 14, ring);
  }

  function drawObjectiveArrow(obj, cam) {
    if (obj.map !== mapId) {
      // El objetivo está en la otra ciudad: señalamos el puente.
      const bridge = map.def.locations.find((l) => l.travel);
      if (!bridge) return;
      return arrowTo(bridge.x, bridge.y, cam, `${obj.name} (${W().maps[obj.map].label})`);
    }
    arrowTo(obj.x, obj.y, cam, obj.name);
  }

  function arrowTo(x, y, cam, text) {
    const sx = x - cam.x;
    const sy = y - cam.y;
    if (sx > 40 && sy > 40 && sx < canvas.width - 40 && sy < canvas.height - 40) return;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const a = Math.atan2(sy - cy, sx - cx);
    const ex = cx + Math.cos(a) * (Math.min(cx, cy) - 50);
    const ey = cy + Math.sin(a) * (Math.min(cx, cy) - 50);
    ctx.save();
    ctx.translate(ex, ey);
    ctx.rotate(a);
    ctx.fillStyle = '#ffe08a';
    ctx.beginPath();
    ctx.moveTo(18, 0); ctx.lineTo(-10, -12); ctx.lineTo(-4, 0); ctx.lineTo(-10, 12);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    label(text, ex, ey - 22, '#ffe08a');
  }

  function drawMini(obj) {
    if (!mctx) return;
    const s = mini.width / map.w;
    mctx.fillStyle = map.def.palette.ground;
    mctx.fillRect(0, 0, mini.width, mini.height);
    mctx.fillStyle = mapId === 'zaun' ? 'rgba(63,191,159,0.35)' : 'rgba(227,196,90,0.35)';
    for (const b of map.buildings) mctx.fillRect(b.x * s, b.y * s, Math.max(1, b.w * s), Math.max(1, b.h * s));
    for (const l of map.def.locations) {
      mctx.fillStyle = obj && obj.id === l.id ? '#ffe08a' : '#ffffff';
      mctx.beginPath();
      mctx.arc(l.x * s, l.y * s, obj && obj.id === l.id ? 5 : 3, 0, Math.PI * 2);
      mctx.fill();
    }
    mctx.fillStyle = '#7fd0ff';
    for (const f of map.def.fragments) if (!G.codex.includes(f.codex)) mctx.fillRect(f.x * s - 1.5, f.y * s - 1.5, 3, 3);
    mctx.fillStyle = '#ff5a8a';
    mctx.beginPath();
    mctx.arc(G.world.x * s, G.world.y * s, 4, 0, Math.PI * 2);
    mctx.fill();
  }

  // ---------- HUD ----------
  function updatePrompt() {
    const el = document.getElementById('world-prompt');
    if (!el) return;
    let txt = '';
    if (nearest?.kind === 'char') txt = `<kbd>E</kbd> Hablar con ${U.esc(nearest.name)}`;
    else if (nearest?.kind === 'loc') {
      const acts = cb.locationActions?.(nearest) || [];
      txt = acts.length ? `<b>${U.esc(nearest.name)}</b> · <kbd>E</kbd> ${U.esc(acts[0])}${acts.length > 1 ? ' …' : ''}` : `<b>${U.esc(nearest.name)}</b>`;
    }
    if (el.dataset.txt !== txt) {
      el.innerHTML = txt;
      el.dataset.txt = txt;
      el.classList.toggle('show', Boolean(txt));
    }
  }

  let lastDistrict = '';
  function updateDistrict() {
    const d = map.def.districts.find(({ rect: [x, y, w, h] }) => G.world.x >= x && G.world.x < x + w && G.world.y >= y && G.world.y < y + h);
    const name = `${map.def.label} · ${d ? d.name : ''}`;
    if (name !== lastDistrict) {
      lastDistrict = name;
      const el = document.getElementById('world-district');
      if (el) el.textContent = name;
    }
  }

  function interact() {
    if (!nearest || paused) return;
    Audio2.sfx.click();
    if (nearest.kind === 'char') cb.onTalk?.(nearest.id);
    else if (nearest.kind === 'loc') cb.onLocation?.(nearest);
  }

  // ---------- Bucle ----------
  function frame(t, id) {
    if (!running || id !== loopId) return;
    const dt = Math.min(0.05, (t - last) / 1000 || 0);
    last = t;
    if (!paused) update(dt);
    draw(t);
    requestAnimationFrame((nt) => frame(nt, id));
  }

  function resize() {
    if (!canvas) return;
    const box = canvas.parentElement.getBoundingClientRect();
    canvas.width = Math.max(320, Math.floor(box.width));
    canvas.height = Math.max(240, Math.floor(box.height));
  }

  function onKey(e) {
    if (!running || e.target.matches?.('input, textarea, select')) return;
    const k = e.key.toLowerCase();
    if (e.type === 'keydown') {
      if (paused) return;
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(k)) e.preventDefault();
      if (k === 'e' || k === 'enter') return interact();
      keys.add(k);
    } else keys.delete(k);
  }

  function onClick(e) {
    if (paused) return;
    const r = canvas.getBoundingClientRect();
    const cam = camera();
    target = { x: e.clientX - r.left + cam.x, y: e.clientY - r.top + cam.y };
    // Clic sobre algo cercano al jugador = interactuar.
    if (nearest && Math.hypot((nearest.x ?? 0) - target.x, (nearest.y ?? 0) - target.y) < 40) { target = null; interact(); }
  }

  window.addEventListener('keydown', onKey);
  window.addEventListener('keyup', onKey);
  window.addEventListener('blur', () => keys.clear());
  window.addEventListener('resize', resize);

  function setMap(id, atLocId) {
    mapId = id;
    map = buildMap(id);
    G.world.map = id;
    const loc = atLocId && map.def.locations.find((l) => l.id === atLocId);
    if (loc) {
      const s = freeSpot(loc.x, loc.y + (loc.travel ? (id === 'zaun' ? 60 : -60) : 0));
      G.world.x = s.x;
      G.world.y = s.y;
    } else {
      const s = freeSpot(G.world.x, G.world.y);
      G.world.x = s.x;
      G.world.y = s.y;
    }
    insideLoc = loc?.id || null;
    particles = [];
    lastDistrict = '';
    fade = 1;
    Audio2.playMusic(cb.music?.() || id);
  }

  window.World = {
    start(state, callbacks, el, miniEl) {
      G = state;
      cb = callbacks;
      canvas = el;
      ctx = canvas.getContext('2d');
      mini = miniEl;
      mctx = mini?.getContext('2d');
      resize();
      if (!G.world.map) {
        const spawn = W().spawns[G.player.district] || (G.player.origin === 'zaun' ? 'callejones' : 'plaza');
        setMap(G.player.origin, spawn);
      } else setMap(G.world.map);
      running = true;
      paused = false;
      const id = ++loopId;
      requestAnimationFrame((t) => { last = t; frame(t, id); });
    },
    stop() { running = false; keys.clear(); },
    pause(v) { paused = v; keys.clear(); target = null; },
    travel(toMap, atLoc) { setMap(toMap, atLoc); },
    locById,
    resize,
  };
})();
