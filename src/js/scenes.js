// Escenarios pintados y animados para la historia, el menú, las cinemáticas y el Códice.
// Cada escena tiene una capa estática pintada (en caché) y efectos animados encima:
// niebla, partículas, rayos de luz, neones que parpadean y destellos de Resonancia.
// Si la jugadora pone una imagen propia en la carpeta de arte, se usa como capa base.
(function () {
  function rng(seed) {
    let a = seed >>> 0;
    return () => {
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // Temas de escena. type: ciudad dorada, ciudad química, interiores, naturaleza…
  const THEMES = {
    aurelia: { type: 'gold', sky: ['#f4dca0', '#d9a85a', '#6a4a2a'], sun: [0.7, 0.32, '#fff4d8'], fx: 'dust', seed: 11 },
    archivo: { type: 'library', tint: '#d9b46a', fx: 'rays', seed: 8 },
    observatorio: { type: 'hall', tint: '#e3c47a', glass: ['#f0dca0', '#c99a3b', '#8aa0b8'], fx: 'rays', seed: 5 },
    gremios: { type: 'workshop', tint: '#c99a3b', fx: 'dustwarm', seed: 9 },
    'ascensor-central': { type: 'gate', sky: ['#f0e0b8', '#c9a060', '#4a3a2a'], fx: 'dust', seed: 13 },
    cristal: { type: 'gold', sky: ['#f6e6c0', '#e0b070', '#5a3a2a'], sun: [0.3, 0.3, '#fff8e0'], fx: 'dust', seed: 17 },
    nacar: { type: 'chem', sky: ['#12302a', '#0a1a16', '#040908'], neon: ['#3fbf7f', '#8fdf6a', '#2f9f8f', '#c9e08a'], fx: 'smoke', seed: 2 },
    'mercado-nacar': { type: 'chem', sky: ['#1e3026', '#0e1812', '#050806'], neon: ['#8fdf6a', '#3fbf7f', '#e0b050'], fx: 'smoke', seed: 21 },
    galerias: { type: 'chem', sky: ['#2a3a1a', '#121a0a', '#050805'], neon: ['#8fbf3a', '#3fbf7f'], fx: 'embers', seed: 33 },
    'jardin-musgo': { type: 'tree', fx: 'fireflies', seed: 14 },
    clinica: { type: 'workshop', tint: '#6abf8a', fx: 'dustwarm', seed: 43 },
    'canal-cobre': { type: 'bridge', sky: ['#4a6a50', '#1a2a22', '#060c0a'], fx: 'smoke', seed: 4 },
    resonancia: { type: 'sump', fx: 'spores', seed: 12 },
  };

  const has = (id) => Boolean(THEMES[id]);

  // ---------- Pintura estática ----------
  function grad(ctx, h, stops) {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    stops.forEach((c, i) => g.addColorStop(i / (stops.length - 1), c));
    return g;
  }

  function brushNoise(ctx, w, h, r, alpha = 0.06) {
    for (let i = 0; i < (w * h) / 900; i++) {
      const x = r() * w;
      const y = r() * h;
      ctx.strokeStyle = r() < 0.5 ? `rgba(255,255,255,${alpha * r()})` : `rgba(0,0,0,${alpha * 1.4 * r()})`;
      ctx.lineWidth = 2 + r() * 6;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + 6 + r() * 22, y + (r() - 0.5) * 8);
      ctx.stroke();
    }
  }

  function goldSkyline(ctx, w, h, r, baseY, col, scale, lit) {
    let x = -20;
    while (x < w + 40) {
      const bw = (30 + r() * 70) * scale;
      const bh = (80 + r() * 260) * scale;
      ctx.fillStyle = col;
      ctx.fillRect(x, baseY - bh, bw, bh + 4);
      const roof = r();
      ctx.beginPath();
      if (roof < 0.35) { ctx.arc(x + bw / 2, baseY - bh, bw / 2, Math.PI, 0); }
      else if (roof < 0.7) { ctx.moveTo(x, baseY - bh); ctx.lineTo(x + bw / 2, baseY - bh - bw * 1.2); ctx.lineTo(x + bw, baseY - bh); }
      else { ctx.rect(x + bw * 0.3, baseY - bh - 30 * scale, bw * 0.4, 30 * scale); }
      ctx.fill();
      if (lit) {
        ctx.fillStyle = 'rgba(255,220,140,0.55)';
        for (let wy = baseY - bh + 12 * scale; wy < baseY - 8; wy += 16 * scale) {
          for (let wx = x + 6 * scale; wx < x + bw - 6 * scale; wx += 12 * scale) if (r() < 0.35) ctx.fillRect(wx, wy, 4 * scale, 7 * scale);
        }
      }
      x += bw + r() * 12 * scale;
    }
  }

  function chemSkyline(ctx, w, h, r, baseY, col, scale, neon, neonList) {
    let x = -20;
    while (x < w + 40) {
      const bw = (40 + r() * 80) * scale;
      const bh = (60 + r() * 200) * scale;
      ctx.fillStyle = col;
      // Chabolas apiladas, ligeramente torcidas
      let y = baseY;
      let seg = bh;
      while (seg > 20 * scale) {
        const sh = Math.min(seg, (24 + r() * 50) * scale);
        const off = (r() - 0.5) * 14 * scale;
        ctx.fillRect(x + off, y - sh, bw * (0.8 + r() * 0.3), sh + 2);
        y -= sh;
        seg -= sh;
      }
      if (r() < 0.5) { ctx.fillRect(x + bw * 0.7, y - 50 * scale, 8 * scale, 50 * scale); }
      if (neon && r() < 0.55) {
        const c = neon[Math.floor(r() * neon.length)];
        neonList.push({ x: x + r() * bw * 0.6, y: baseY - r() * bh * 0.8, w: (14 + r() * 40) * scale, h: (4 + r() * 8) * scale, c, ph: r() * 10 });
      }
      x += bw * 0.85;
    }
    // Tuberías
    ctx.strokeStyle = col;
    ctx.lineWidth = 7 * scale;
    for (let i = 0; i < 3; i++) {
      const yy = baseY - r() * 200 * scale;
      ctx.beginPath();
      ctx.moveTo(0, yy);
      ctx.bezierCurveTo(w * 0.3, yy - 40 * scale, w * 0.6, yy + 60 * scale, w, yy - 20 * scale);
      ctx.stroke();
    }
  }

  function paintStatic(id, w, h) {
    const T = THEMES[id] || THEMES.nacar;
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const ctx = c.getContext('2d');
    const r = rng(T.seed * 997 + w);
    const s = h / 600;
    const dyn = { neon: [], glows: [] };

    const sky = (stops) => { ctx.fillStyle = grad(ctx, h, stops); ctx.fillRect(0, 0, w, h); };
    const sun = (fx, fy, col) => {
      const g = ctx.createRadialGradient(w * fx, h * fy, 5, w * fx, h * fy, h * 0.7);
      g.addColorStop(0, col); g.addColorStop(0.25, 'rgba(255,220,160,0.35)'); g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    };

    switch (T.type) {
      case 'gold': {
        sky(T.sky);
        sun(...T.sun);
        goldSkyline(ctx, w, h, r, h * 0.62, 'rgba(160,100,80,0.55)', s * 0.7, false);
        goldSkyline(ctx, w, h, r, h * 0.78, '#7a4a3a', s, true);
        goldSkyline(ctx, w, h, r, h * 1.02, '#3a2020', s * 1.4, true);
        dyn.glows.push({ x: w * 0.2, y: h * 0.7, r: 60 * s, c: '#3fa9f5' }, { x: w * 0.8, y: h * 0.75, r: 50 * s, c: '#3fa9f5' });
        break;
      }
      case 'chem': {
        sky(T.sky);
        const g = ctx.createRadialGradient(w * 0.5, 0, 10, w * 0.5, 0, h);
        g.addColorStop(0, 'rgba(255,220,150,0.25)'); g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
        chemSkyline(ctx, w, h, r, h * 0.7, 'rgba(30,50,46,0.9)', s * 0.8, T.neon, dyn.neon);
        chemSkyline(ctx, w, h, r, h * 0.92, '#0e1a18', s * 1.1, T.neon, dyn.neon);
        chemSkyline(ctx, w, h, r, h * 1.08, '#050908', s * 1.5, T.neon, dyn.neon);
        const fog = ctx.createLinearGradient(0, h * 0.6, 0, h);
        fog.addColorStop(0, 'rgba(60,200,150,0)'); fog.addColorStop(1, 'rgba(60,200,150,0.35)');
        ctx.fillStyle = fog; ctx.fillRect(0, 0, w, h);
        break;
      }
      case 'bridge': {
        sky(T.sky);
        sun(0.5, 0.35, 'rgba(255,230,180,0.8)');
        goldSkyline(ctx, w, h, r, h * 0.55, 'rgba(140,90,70,0.6)', s * 0.6, false);
        ctx.fillStyle = '#2a1a18';
        ctx.fillRect(0, h * 0.62, w, h * 0.05);
        for (let i = 0; i < 7; i++) {
          const ax = (w / 6) * i;
          ctx.beginPath(); ctx.moveTo(ax - 30 * s, h * 0.67); ctx.quadraticCurveTo(ax + w / 12, h * 0.85, ax + w / 6 + 30 * s, h * 0.67); ctx.lineTo(ax + w / 6 + 30 * s, h * 0.7); ctx.quadraticCurveTo(ax + w / 12, h * 0.9, ax - 30 * s, h * 0.7); ctx.fill();
        }
        ctx.strokeStyle = '#c99a3b'; ctx.lineWidth = 3 * s;
        ctx.beginPath(); ctx.moveTo(0, h * 0.6); ctx.lineTo(w, h * 0.6); ctx.stroke();
        for (let x = 20; x < w; x += 60 * s) { ctx.fillStyle = '#3a2420'; ctx.fillRect(x, h * 0.52, 6 * s, h * 0.1); ctx.fillStyle = 'rgba(255,220,140,0.8)'; ctx.beginPath(); ctx.arc(x + 3 * s, h * 0.52, 5 * s, 0, 7); ctx.fill(); }
        const low = ctx.createLinearGradient(0, h * 0.7, 0, h);
        low.addColorStop(0, 'rgba(40,120,100,0.2)'); low.addColorStop(1, 'rgba(20,80,60,0.85)');
        ctx.fillStyle = low; ctx.fillRect(0, h * 0.7, w, h * 0.3);
        chemSkyline(ctx, w, h, r, h * 1.1, '#081210', s * 1.2, ['#3fbf9f', '#e0457b'], dyn.neon);
        break;
      }
      case 'gate': {
        sky(T.sky);
        ctx.fillStyle = '#2a4a6a'; ctx.fillRect(0, h * 0.72, w, h * 0.28);
        goldSkyline(ctx, w, h, r, h * 0.72, '#5a3a3a', s, true);
        dyn.gate = { x: w * 0.5, y: h * 0.48, r: h * 0.3 };
        ctx.strokeStyle = '#c99a3b'; ctx.lineWidth = 26 * s;
        ctx.beginPath(); ctx.arc(w * 0.5, h * 0.48, h * 0.3, 0, 7); ctx.stroke();
        ctx.strokeStyle = '#7a5a2a'; ctx.lineWidth = 6 * s;
        ctx.beginPath(); ctx.arc(w * 0.5, h * 0.48, h * 0.33, 0, 7); ctx.stroke();
        break;
      }
      case 'hall': {
        sky(['#3a2a20', '#1a1210', '#0a0606']);
        const cols = 5;
        for (let i = 0; i < cols; i++) {
          const x = (w / cols) * (i + 0.5);
          const gw = 60 * s;
          const gh = h * 0.45;
          const gl = ctx.createLinearGradient(x, h * 0.1, x, h * 0.1 + gh);
          T.glass.forEach((g, k) => gl.addColorStop(k / (T.glass.length - 1), g));
          ctx.fillStyle = gl;
          ctx.beginPath(); ctx.moveTo(x - gw / 2, h * 0.1 + gh); ctx.lineTo(x - gw / 2, h * 0.18); ctx.arc(x, h * 0.18, gw / 2, Math.PI, 0); ctx.lineTo(x + gw / 2, h * 0.1 + gh); ctx.fill();
          ctx.strokeStyle = 'rgba(20,10,5,0.8)'; ctx.lineWidth = 3 * s; ctx.stroke();
          ctx.fillStyle = '#4a3020'; ctx.fillRect(x + gw / 2 + 10 * s, h * 0.05, 26 * s, h * 0.95);
          dyn.glows.push({ x, y: h * 0.35, r: 90 * s, c: T.glass[0] });
        }
        ctx.fillStyle = '#2a1a10'; ctx.fillRect(0, h * 0.72, w, h * 0.28);
        ctx.fillStyle = '#5a3a20';
        ctx.beginPath(); ctx.ellipse(w * 0.5, h * 0.86, w * 0.38, h * 0.09, 0, 0, 7); ctx.fill();
        ctx.strokeStyle = T.tint; ctx.lineWidth = 3 * s; ctx.stroke();
        dyn.rays = { x: w * 0.5, y: 0, c: T.tint };
        break;
      }
      case 'library': {
        sky(['#3a2a1a', '#1a120a', '#0a0604']);
        for (let x = 0; x < w; x += 120 * s) {
          ctx.fillStyle = '#2a1a10'; ctx.fillRect(x, h * 0.1, 100 * s, h * 0.8);
          for (let y = h * 0.14; y < h * 0.86; y += 30 * s) {
            for (let bx = x + 6 * s; bx < x + 94 * s; bx += 8 * s) {
              ctx.fillStyle = ['#7a2a2a', '#2a4a6a', '#6a5a2a', '#3a5a3a', '#5a3a5a'][Math.floor(r() * 5)];
              ctx.fillRect(bx, y, 6 * s, 24 * s - r() * 6 * s);
            }
          }
        }
        ctx.fillStyle = 'rgba(255,220,150,0.25)';
        ctx.beginPath(); ctx.moveTo(w * 0.62, 0); ctx.lineTo(w * 0.78, 0); ctx.lineTo(w * 0.55, h); ctx.lineTo(w * 0.3, h); ctx.fill();
        dyn.rays = { x: w * 0.7, y: 0, c: T.tint };
        break;
      }
      case 'workshop': {
        sky(['#1a2030', '#0e1018', '#060608']);
        ctx.fillStyle = '#1e2a3a'; ctx.fillRect(w * 0.08, h * 0.12, w * 0.5, h * 0.4);
        ctx.strokeStyle = 'rgba(230,240,255,0.55)'; ctx.lineWidth = 1.5 * s; ctx.font = `${16 * s}px Georgia`;
        ctx.fillStyle = 'rgba(230,240,255,0.55)';
        for (let i = 0; i < 9; i++) ctx.fillText(['∑ ψ(r) = ∫ φ', 'E = h·ν', '→ ', 'Δt · Ω', 'ρ ∝ λ²'][i % 5], w * 0.1 + r() * w * 0.35, h * 0.16 + i * 18 * s);
        for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.arc(w * 0.2 + r() * w * 0.3, h * 0.25 + r() * h * 0.2, 20 * s + r() * 20 * s, 0, 7); ctx.stroke(); }
        ctx.fillStyle = '#3a2a1a'; ctx.fillRect(0, h * 0.68, w, h * 0.32);
        ctx.fillStyle = '#5a3a20'; ctx.fillRect(w * 0.05, h * 0.62, w * 0.9, h * 0.08);
        for (let i = 0; i < 6; i++) { const gx = w * (0.15 + i * 0.13); dyn.glows.push({ x: gx, y: h * 0.6, r: 40 * s, c: T.tint, gem: true }); }
        break;
      }
      case 'tavern': {
        sky(['#3a2010', '#1e1008', '#0a0503']);
        ctx.fillStyle = '#2a160a'; ctx.fillRect(0, h * 0.15, w, h * 0.45);
        for (let y = h * 0.2; y < h * 0.55; y += 34 * s) {
          ctx.fillStyle = '#4a2a14'; ctx.fillRect(0, y + 26 * s, w, 5 * s);
          for (let x = 10; x < w; x += 18 * s) {
            if (r() < 0.7) { ctx.fillStyle = ['#3a6a3a', '#8a4a1a', '#6a2a2a', '#c09040'][Math.floor(r() * 4)]; ctx.fillRect(x, y + 6 * s, 9 * s, 20 * s); ctx.fillRect(x + 3 * s, y, 3 * s, 8 * s); }
          }
        }
        ctx.fillStyle = '#5a3018'; ctx.fillRect(0, h * 0.62, w, h * 0.12);
        ctx.fillStyle = '#3a1e0e'; ctx.fillRect(0, h * 0.74, w, h * 0.26);
        for (let i = 0; i < 5; i++) { const lx = w * (0.1 + i * 0.2); ctx.strokeStyle = '#1a0a04'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(lx, 0); ctx.lineTo(lx, h * 0.1); ctx.stroke(); dyn.glows.push({ x: lx, y: h * 0.12, r: 120 * s, c: '#ffb050', lamp: true }); }
        break;
      }
      case 'sump': {
        sky(['#0e1a0a', '#081006', '#030502']);
        chemSkyline(ctx, w, h, r, h * 0.75, '#0e1a0c', s, ['#8fbf3a'], dyn.neon);
        for (let i = 0; i < 6; i++) {
          const px = r() * w;
          const g = ctx.createRadialGradient(px, h * 0.88, 5, px, h * 0.88, 120 * s);
          g.addColorStop(0, 'rgba(160,255,80,0.55)'); g.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
          dyn.glows.push({ x: px, y: h * 0.88, r: 80 * s, c: '#8fbf3a' });
        }
        break;
      }
      case 'hideout': {
        sky(['#1a1030', '#0e0818', '#05030a']);
        for (let i = 0; i < 16; i++) {
          ctx.strokeStyle = ['#e0457b', '#3fa9f5', '#f0e040', '#bf3abf'][Math.floor(r() * 4)];
          ctx.globalAlpha = 0.3; ctx.lineWidth = 3 + r() * 6;
          ctx.beginPath(); ctx.moveTo(r() * w, r() * h * 0.7); ctx.quadraticCurveTo(r() * w, r() * h, r() * w, r() * h * 0.7); ctx.stroke();
        }
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#120a1a'; ctx.fillRect(0, h * 0.75, w, h * 0.25);
        dyn.glows.push({ x: w * 0.3, y: h * 0.5, r: 100 * s, c: '#e0457b' }, { x: w * 0.75, y: h * 0.4, r: 90 * s, c: '#3fa9f5' });
        break;
      }
      case 'tree': {
        sky(['#06140c', '#040c08', '#020403']);
        ctx.fillStyle = '#1a2a14';
        ctx.beginPath(); ctx.moveTo(w * 0.42, h); ctx.bezierCurveTo(w * 0.45, h * 0.6, w * 0.4, h * 0.4, w * 0.47, h * 0.25); ctx.lineTo(w * 0.53, h * 0.25); ctx.bezierCurveTo(w * 0.6, h * 0.4, w * 0.55, h * 0.6, w * 0.58, h); ctx.fill();
        for (let i = 0; i < 26; i++) {
          const a = r() * Math.PI;
          const rr = (120 + r() * 220) * s;
          const cx = w * 0.5 + Math.cos(a + Math.PI) * rr;
          const cy = h * 0.28 - Math.sin(a) * rr * 0.4;
          const g = ctx.createRadialGradient(cx, cy, 4, cx, cy, 80 * s);
          g.addColorStop(0, 'rgba(120,255,160,0.5)'); g.addColorStop(1, 'rgba(20,80,40,0)');
          ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, 80 * s, 0, 7); ctx.fill();
        }
        dyn.glows.push({ x: w * 0.5, y: h * 0.25, r: 220 * s, c: '#7affa0' });
        break;
      }
      case 'prison': {
        sky(['#3a4a5a', '#1a2430', '#0a0e14']);
        ctx.fillStyle = '#1a222a'; ctx.fillRect(w * 0.1, h * 0.15, w * 0.8, h * 0.6);
        ctx.fillStyle = 'rgba(180,200,220,0.2)'; ctx.fillRect(w * 0.42, h * 0.25, w * 0.16, h * 0.2);
        ctx.strokeStyle = '#0a0e12'; ctx.lineWidth = 8 * s;
        for (let x = w * 0.43; x < w * 0.58; x += 14 * s) { ctx.beginPath(); ctx.moveTo(x, h * 0.25); ctx.lineTo(x, h * 0.45); ctx.stroke(); }
        ctx.fillStyle = '#2a3a4a'; ctx.fillRect(0, h * 0.75, w, h * 0.25);
        break;
      }
      case 'fortress': {
        sky(['#5a1a1a', '#2a0a0a', '#0a0202']);
        sun(0.5, 0.3, 'rgba(255,120,60,0.6)');
        ctx.fillStyle = '#1a0808';
        for (let i = 0; i < 9; i++) { const x = (w / 8) * i; const th = h * (0.3 + r() * 0.3); ctx.beginPath(); ctx.moveTo(x - 30 * s, h); ctx.lineTo(x, h - th); ctx.lineTo(x + 30 * s, h); ctx.fill(); }
        break;
      }
      default:
        sky(['#2a2438', '#0d0b14']);
    }
    brushNoise(ctx, w, h, r);
    const v = ctx.createRadialGradient(w / 2, h / 2, h * 0.3, w / 2, h / 2, h * 0.95);
    v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(5,2,10,0.6)');
    ctx.fillStyle = v; ctx.fillRect(0, 0, w, h);
    return { canvas: c, dyn, theme: T };
  }

  const cache = new Map();
  function getStatic(id, w, h) {
    const key = `${id}:${w}x${h}`;
    if (!cache.has(key)) {
      if (cache.size > 24) cache.delete(cache.keys().next().value);
      cache.set(key, paintStatic(id, w, h));
    }
    return cache.get(key);
  }

  const customImgs = new Map();
  function customBase(id) {
    const url = window.CustomArt?.image('lugares', id);
    if (!url) return null;
    if (!customImgs.has(url)) { const im = new Image(); im.src = url; customImgs.set(url, im); }
    const im = customImgs.get(url);
    return im.complete && im.naturalWidth ? im : null;
  }

  // ---------- Efectos animados ----------
  function particlesFor(fx, w, h, n = 60) {
    const r = rng(fx.length * 31 + w);
    return Array.from({ length: n }, () => ({ x: r() * w, y: r() * h, s: 0.3 + r(), p: r() * 10 }));
  }

  function drawFx(ctx, st, t, w, h, P) {
    const { dyn, theme } = st;
    const s = h / 600;
    // Brillos (lámparas, cristales de Resonancia, charcos químicos)
    for (const g of dyn.glows) {
      const pulse = g.lamp ? 0.85 + Math.sin(t * 9 + g.x) * 0.05 + (Math.random() < 0.02 ? -0.3 : 0) : 0.7 + Math.sin(t * 2 + g.x) * 0.3;
      const rg = ctx.createRadialGradient(g.x, g.y, 2, g.x, g.y, g.r * (1 + pulse * 0.2));
      rg.addColorStop(0, hexA(g.c, 0.55 * pulse));
      rg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = rg;
      ctx.fillRect(g.x - g.r * 1.4, g.y - g.r * 1.4, g.r * 2.8, g.r * 2.8);
      ctx.globalCompositeOperation = 'source-over';
      if (g.gem) {
        ctx.save(); ctx.translate(g.x, g.y - 10 * s); ctx.rotate(t * 0.8 + g.x);
        ctx.fillStyle = '#9fe0ff'; ctx.shadowColor = '#3fa9f5'; ctx.shadowBlur = 20;
        ctx.beginPath(); for (let i = 0; i < 6; i++) { const a = (Math.PI / 3) * i; ctx[i ? 'lineTo' : 'moveTo'](Math.cos(a) * 9 * s, Math.sin(a) * 9 * s); } ctx.fill(); ctx.restore();
      }
    }
    // Neones
    for (const n of dyn.neon) {
      const on = Math.sin(t * 3 + n.ph) > -0.85 && !(Math.sin(t * 17 + n.ph * 3) > 0.97);
      ctx.save();
      ctx.shadowColor = n.c; ctx.shadowBlur = on ? 18 : 2;
      ctx.fillStyle = on ? n.c : hexA(n.c, 0.25);
      ctx.fillRect(n.x, n.y, n.w, n.h);
      ctx.restore();
    }
    // Portal de Resonancia
    if (dyn.gate) {
      const { x, y, r } = dyn.gate;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 5; i++) {
        ctx.strokeStyle = `rgba(80,180,255,${0.25 + i * 0.08})`;
        ctx.lineWidth = 10 * s;
        ctx.beginPath(); ctx.arc(x, y, r * (0.3 + i * 0.15), t * (1 + i * 0.4), t * (1 + i * 0.4) + 4.2); ctx.stroke();
      }
      const g = ctx.createRadialGradient(x, y, 5, x, y, r);
      g.addColorStop(0, 'rgba(200,240,255,0.8)'); g.addColorStop(1, 'rgba(40,120,255,0.05)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r * 0.95, 0, 7); ctx.fill();
      ctx.restore();
    }
    // Rayos de luz
    if (dyn.rays) {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 4; i++) {
        const a = -0.35 + i * 0.22 + Math.sin(t * 0.3 + i) * 0.05;
        ctx.fillStyle = hexA(dyn.rays.c, 0.06 + Math.sin(t * 0.8 + i) * 0.02);
        ctx.beginPath(); ctx.moveTo(dyn.rays.x, -10);
        ctx.lineTo(dyn.rays.x + Math.sin(a) * h * 1.4 - 40 * s, h * 1.2);
        ctx.lineTo(dyn.rays.x + Math.sin(a) * h * 1.4 + 60 * s, h * 1.2); ctx.fill();
      }
      ctx.restore();
    }
    // Niebla
    const fog = theme.fx === 'smoke' || theme.fx === 'spores' || theme.type === 'bridge';
    if (fog) {
      for (let i = 0; i < 5; i++) {
        const fx = ((t * (12 + i * 6) + i * 300) % (w + 600)) - 300;
        const fy = h * (0.55 + i * 0.09);
        const g = ctx.createRadialGradient(fx, fy, 10, fx, fy, 300 * s);
        g.addColorStop(0, theme.fx === 'spores' ? 'rgba(150,230,90,0.14)' : 'rgba(120,230,190,0.12)');
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g; ctx.fillRect(fx - 320 * s, fy - 320 * s, 640 * s, 640 * s);
      }
    }
    // Partículas
    for (const p of P) {
      let x;
      let y;
      let size;
      let col;
      switch (theme.fx) {
        case 'dust': case 'dustwarm':
          x = (p.x + Math.sin(t * 0.5 + p.p) * 20) % w; y = (p.y - t * 10 * p.s + h * 10) % h; size = 1.2 + p.s * 1.6; col = `rgba(255,220,150,${0.35 + Math.sin(t * 2 + p.p) * 0.25})`; break;
        case 'smoke': case 'spores':
          x = (p.x + t * 6 * p.s) % w; y = (p.y - t * 18 * p.s + h * 10) % h; size = 1 + p.s * 2; col = theme.fx === 'spores' ? 'rgba(180,255,90,0.5)' : 'rgba(150,255,210,0.35)'; break;
        case 'fireflies':
          x = p.x + Math.sin(t * 0.7 + p.p) * 40; y = p.y + Math.cos(t * 0.5 + p.p) * 30; size = 2 + p.s * 2; col = `rgba(170,255,140,${0.4 + Math.sin(t * 3 + p.p) * 0.4})`; break;
        case 'embers': case 'sparks':
          x = (p.x + Math.sin(t + p.p) * 30) % w; y = (p.y - t * 40 * p.s + h * 10) % h; size = 1 + p.s * 2; col = theme.fx === 'sparks' ? ['#e0457b', '#3fa9f5', '#f0e040'][Math.floor(p.p) % 3] : `rgba(255,140,60,${0.5 + p.s * 0.4})`; break;
        case 'rain':
          x = (p.x + t * 40) % w; y = (p.y + t * 500 * p.s) % h;
          ctx.strokeStyle = 'rgba(180,200,230,0.35)'; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 4, y + 16); ctx.stroke(); continue;
        case 'hex':
          x = p.x + Math.sin(t * 0.6 + p.p) * 20; y = (p.y - t * 14 * p.s + h * 10) % h; size = 1.5 + p.s * 2; col = 'rgba(120,200,255,0.6)'; break;
        case 'rays': default:
          x = (p.x + Math.sin(t * 0.3 + p.p) * 10) % w; y = (p.y - t * 4 * p.s + h * 10) % h; size = 1 + p.s; col = 'rgba(255,240,200,0.3)';
      }
      ctx.fillStyle = col;
      ctx.beginPath(); ctx.arc(x, y, size * s * 1.5, 0, 7); ctx.fill();
    }
  }

  function hexA(hex, a) {
    const n = parseInt(String(hex).replace('#', ''), 16);
    return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${Math.max(0, Math.min(1, a))})`;
  }

  // Dibuja un fotograma completo de la escena con movimiento de cámara (zoom y paneo lentos).
  function drawFrame(ctx, id, t, w, h, cam = {}) {
    const st = getStatic(id, Math.round(w * 1.12), Math.round(h * 1.12));
    const zoom = cam.zoom ?? 1 + Math.sin(t * 0.05) * 0.02;
    const px = cam.panX ?? Math.sin(t * 0.07) * 0.5;
    const py = cam.panY ?? Math.cos(t * 0.05) * 0.3;
    const sw = st.canvas.width;
    const sh = st.canvas.height;
    const vw = sw / 1.12 / zoom;
    const vh = sh / 1.12 / zoom;
    const sx = (sw - vw) / 2 + px * (sw - vw) / 2;
    const sy = (sh - vh) / 2 + py * (sh - vh) / 2;
    const custom = customBase(id);
    if (custom) {
      const ir = custom.naturalWidth / custom.naturalHeight;
      const cr = w / h;
      let cw = custom.naturalWidth / zoom;
      let ch = custom.naturalHeight / zoom;
      if (ir > cr) cw = ch * cr; else ch = cw / cr;
      ctx.drawImage(custom, (custom.naturalWidth - cw) / 2 + px * 20, (custom.naturalHeight - ch) / 2 + py * 20, cw, ch, 0, 0, w, h);
    } else ctx.drawImage(st.canvas, sx, sy, vw, vh, 0, 0, w, h);
    if (!st.P) st.P = particlesFor(st.theme.fx || 'dust', w, h);
    drawFx(ctx, { dyn: scaleDyn(st, w / vw, sx, sy), theme: st.theme }, t, w, h, st.P);
  }

  // Ajusta las posiciones de los efectos a la vista actual de la cámara.
  function scaleDyn(st, k, sx, sy) {
    const tr = (o) => ({ ...o, x: (o.x - sx) * k, y: (o.y - sy) * k, ...(o.r ? { r: o.r * k } : {}), ...(o.w ? { w: o.w * k, h: o.h * k } : {}) });
    const d = st.dyn;
    return {
      glows: d.glows.map(tr),
      neon: d.neon.map(tr),
      gate: d.gate && tr(d.gate),
      rays: d.rays && tr(d.rays),
    };
  }

  // Monta una escena animada en un canvas que llena su contenedor.
  function mount(canvas, id, opts = {}) {
    const ctx = canvas.getContext('2d');
    let cur = id;
    let prev = null;
    let fadeT = 1;
    let alive = true;
    let raf = 0;
    const t0 = performance.now();
    function fit() {
      const r = canvas.parentElement?.getBoundingClientRect();
      if (!r) return;
      const dpr = Math.min(1.25, window.devicePixelRatio || 1);
      const w = Math.max(200, Math.floor(r.width * dpr));
      const h = Math.max(120, Math.floor(r.height * dpr));
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    }
    function frame(now) {
      if (!alive || !canvas.isConnected) return;
      fit();
      // Avoid painting covered or hidden scenes; resume on the next visible frame.
      if (document.hidden || canvas.getClientRects().length === 0) {
        raf = requestAnimationFrame(frame);
        return;
      }
      const t = (now - t0) / 1000;
      const w = canvas.width;
      const h = canvas.height;
      if (prev && fadeT < 1) {
        drawFrame(ctx, prev, t, w, h, opts.cam);
        ctx.globalAlpha = fadeT;
        drawFrame(ctx, cur, t, w, h, opts.cam);
        ctx.globalAlpha = 1;
        fadeT = Math.min(1, fadeT + 0.03);
      } else drawFrame(ctx, cur, t, w, h, opts.cam);
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    return {
      set(nid) { if (!nid || nid === cur || !THEMES[nid]) return; prev = cur; cur = nid; fadeT = 0; },
      stop() { alive = false; cancelAnimationFrame(raf); },
      get id() { return cur; },
    };
  }

  const thumbs = new Map();
  function thumb(id) {
    if (thumbs.has(id)) return thumbs.get(id);
    const c = document.createElement('canvas');
    c.width = 320;
    c.height = 320;
    drawFrame(c.getContext('2d'), id, 3, 320, 320, { zoom: 1, panX: 0, panY: 0 });
    const url = c.toDataURL('image/jpeg', 0.85);
    thumbs.set(id, url);
    return url;
  }

  window.Scenes = { has, mount, drawFrame, thumb, THEMES };
})();
