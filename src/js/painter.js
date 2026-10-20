// Motor de retratos pintados (estilo animación pictórica): luz principal cálida,
// luz de contorno del color de la ciudad, pinceladas, línea de tinta y textura.
// Todo se dibuja en canvas y puede animarse (respiración, parpadeo, pelo, habla).
(function () {
  const W = 400;
  const H = 400;

  // ---------- Utilidades de color ----------
  function hexToRgb(hex) {
    const n = parseInt(String(hex || '#888888').replace('#', ''), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function rgb([r, g, b], a = 1) {
    return `rgba(${Math.round(r)},${Math.round(g)},${Math.round(b)},${a})`;
  }
  function mix(a, b, t) {
    const A = hexToRgb(a);
    const B = hexToRgb(b);
    return A.map((v, i) => v + (B[i] - v) * t);
  }
  function tone(hex, amt, a = 1) {
    // amt < 0 oscurece hacia un tono frío; amt > 0 aclara hacia un tono cálido.
    return rgb(amt < 0 ? mix(hex, '#2a0c1c', -amt) : mix(hex, '#fff3dc', amt), a);
  }

  function rng(seed) {
    let a = seed >>> 0;
    return () => {
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function hash(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619);
    return h >>> 0;
  }

  // ---------- Textura de pinceladas (compartida) ----------
  let grain = null;
  function grainTexture() {
    if (grain) return grain;
    grain = document.createElement('canvas');
    grain.width = grain.height = 256;
    const g = grain.getContext('2d');
    const r = rng(42);
    for (let i = 0; i < 1600; i++) {
      const x = r() * 256;
      const y = r() * 256;
      const len = 4 + r() * 14;
      const ang = -0.6 + r() * 0.5;
      g.strokeStyle = r() < 0.5 ? `rgba(255,255,255,${0.03 + r() * 0.05})` : `rgba(0,0,0,${0.03 + r() * 0.06})`;
      g.lineWidth = 1 + r() * 2.5;
      g.lineCap = 'round';
      g.beginPath();
      g.moveTo(x, y);
      g.lineTo(x + Math.cos(ang) * len, y + Math.sin(ang) * len);
      g.stroke();
    }
    return grain;
  }

  // Curva suave cerrada que pasa por los puntos (Catmull-Rom).
  function smoothPath(ctx, pts, closed = true) {
    const n = pts.length;
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    const count = closed ? n : n - 1;
    for (let i = 0; i < count; i++) {
      const p0 = pts[(i - 1 + n) % n];
      const p1 = pts[i];
      const p2 = pts[(i + 1) % n];
      const p3 = pts[(i + 2) % n];
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      ctx.bezierCurveTo(c1[0], c1[1], c2[0], c2[1], p2[0], p2[1]);
    }
    if (closed) ctx.closePath();
  }

  // Rellena una forma con aspecto pintado: base, sombra, luz, pinceladas, contorno y luz de borde.
  function paintShape(ctx, buildPath, color, o = {}) {
    const S = ctx.__s;
    ctx.save();
    buildPath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.clip();
    // Sombra (luz principal desde arriba a la izquierda)
    const box = o.box || [0, 0, W, H];
    const sh = ctx.createLinearGradient(box[0], box[1], box[2], box[3]);
    sh.addColorStop(0, 'rgba(0,0,0,0)');
    sh.addColorStop(0.55, 'rgba(0,0,0,0)');
    sh.addColorStop(1, tone(color, -0.6, o.shadow ?? 0.55));
    ctx.fillStyle = sh;
    ctx.fillRect(0, 0, W, H);
    const hl = ctx.createRadialGradient(o.lx ?? box[0] + (box[2] - box[0]) * 0.3, o.ly ?? box[1] + (box[3] - box[1]) * 0.25, 2, o.lx ?? box[0] + (box[2] - box[0]) * 0.3, o.ly ?? box[1] + (box[3] - box[1]) * 0.25, (box[2] - box[0]) * 0.7);
    hl.addColorStop(0, tone(color, 0.45, o.light ?? 0.45));
    hl.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = hl;
    ctx.fillRect(0, 0, W, H);
    // Pinceladas
    const r = S.rand;
    const strokes = o.strokes ?? 26;
    for (let i = 0; i < strokes; i++) {
      const x = box[0] + r() * (box[2] - box[0]);
      const y = box[1] + r() * (box[3] - box[1]);
      ctx.strokeStyle = r() < 0.5 ? tone(color, 0.25, 0.18) : tone(color, -0.3, 0.16);
      ctx.lineWidth = 3 + r() * 7;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(x + 8 + r() * 10, y - 4 + r() * 8, x + 14 + r() * 18, y - 2 + r() * 10);
      ctx.stroke();
    }
    ctx.restore();
    // Luz de contorno (lado derecho) con el color de la ciudad
    if (o.rim !== false) {
      ctx.save();
      buildPath();
      ctx.clip();
      ctx.translate(-5, 0);
      buildPath();
      ctx.translate(5, 0);
      ctx.lineWidth = 7;
      ctx.strokeStyle = rgb(hexToRgb(S.rim), 0.55 * (o.rimAmt ?? 1));
      ctx.shadowColor = S.rim;
      ctx.shadowBlur = 12;
      ctx.restore();
      ctx.save();
      buildPath();
      ctx.clip();
      const rg = ctx.createLinearGradient(box[2] - 26, 0, box[2], 0);
      rg.addColorStop(0, 'rgba(0,0,0,0)');
      rg.addColorStop(1, rgb(hexToRgb(S.rim), 0.5 * (o.rimAmt ?? 1)));
      ctx.fillStyle = rg;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();
    }
    // Línea de tinta
    if (o.ink !== false) {
      ctx.save();
      buildPath();
      ctx.lineWidth = o.inkW ?? 2.6;
      ctx.strokeStyle = 'rgba(28,14,24,0.85)';
      ctx.lineJoin = 'round';
      ctx.stroke();
      ctx.restore();
    }
  }

  // ---------- Partes del cuerpo ----------
  const FACES = {
    // Medio contorno (lado izquierdo, de arriba a la barbilla). Se refleja para el derecho.
    oval: [[200, 86], [160, 96], [140, 130], [137, 170], [142, 205], [158, 232], [178, 250], [200, 256]],
    angular: [[200, 88], [158, 98], [139, 132], [137, 172], [141, 208], [152, 228], [178, 250], [200, 260]],
    redondo: [[200, 88], [156, 98], [134, 132], [132, 172], [138, 210], [156, 236], [178, 250], [200, 254]],
    corazon: [[200, 86], [156, 96], [134, 128], [134, 168], [144, 204], [164, 232], [186, 252], [200, 258]],
    largo: [[200, 80], [162, 92], [143, 128], [141, 172], [145, 212], [160, 240], [180, 258], [200, 264]],
  };

  function facePts(face) {
    const half = FACES[face] || FACES.oval;
    const right = half.slice(1, -1).reverse().map(([x, y]) => [400 - x, y]);
    return [...half, ...right];
  }

  function drawBackground(ctx, L, S) {
    const g = ctx.createRadialGradient(150, 110, 20, 200, 200, 330);
    g.addColorStop(0, tone(S.bg[0], 0.15));
    g.addColorStop(0.6, S.bg[0]);
    g.addColorStop(1, S.bg[1]);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    // Manchas de pintura de fondo
    const r = rng(hash(S.bg.join('')));
    for (let i = 0; i < 14; i++) {
      ctx.fillStyle = r() < 0.5 ? tone(S.bg[0], 0.3, 0.08) : tone(S.bg[1], -0.3, 0.12);
      ctx.beginPath();
      ctx.ellipse(r() * W, r() * H, 30 + r() * 80, 10 + r() * 30, -0.5 + r(), 0, Math.PI * 2);
      ctx.fill();
    }
    // Luz de ambiente de la ciudad
    const glow = ctx.createRadialGradient(330, 300, 10, 330, 300, 260);
    glow.addColorStop(0, rgb(hexToRgb(S.rim), 0.35 + Math.sin(S.t * 1.3) * 0.05));
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);
  }

  function hairShapes(style, sway) {
    // Devuelve [capaTrasera, capaDelantera] como listas de puntos (o null).
    const s = sway;
    switch (style) {
      case 'long': return [
        [[200, 70], [146, 82], [122, 130], [118, 200], [122, 270], [128, 330 + s], [170, 336 + s], [176, 250], [224, 250], [230, 336 - s], [272, 330 - s], [278, 270], [282, 200], [278, 130], [254, 82]],
        [[200, 76], [150, 88], [132, 130], [140, 150], [168, 112], [200, 104], [236, 116], [262, 150], [268, 130], [250, 88]]];
      case 'braids': return [
        [[200, 72], [150, 84], [128, 130], [132, 170], [268, 170], [272, 130], [250, 84]],
        [[200, 78], [152, 88], [134, 128], [142, 146], [170, 116], [214, 108], [250, 124], [262, 148], [266, 128], [248, 88]]];
      case 'bun': return [
        [[200, 40], [176, 46], [172, 70], [200, 80], [228, 70], [224, 46]],
        [[200, 78], [152, 88], [134, 130], [140, 150], [160, 112], [200, 98], [240, 112], [260, 150], [266, 130], [248, 88]]];
      case 'mohawk': return [null,
        [[200, 40 + s], [186, 50], [180, 96], [200, 106], [220, 96], [214, 50]]];
      case 'undercut': return [null,
        [[160, 92], [176, 70], [214, 64], [254, 80], [272, 118], [262, 142], [240, 112], [200, 104], [172, 112], [160, 124]]];
      case 'messy': return [
        [[200, 70], [150, 76], [124, 120], [130, 170], [270, 170], [276, 120], [250, 76]],
        [[200, 70], [156, 80], [130, 120], [138, 150], [150, 120], [168, 136], [178, 110], [200, 128], [214, 106], [232, 132], [246, 112], [262, 150], [270, 120], [246, 80]]];
      case 'pigtails': return [
        [[136, 120], [100, 140 + s], [92, 210 + s], [118, 220 + s], [140, 160], [260, 160], [282, 220 - s], [308, 210 - s], [300, 140 - s], [264, 120]],
        [[200, 78], [154, 88], [134, 130], [144, 146], [172, 118], [200, 112], [228, 118], [256, 146], [266, 130], [246, 88]]];
      case 'bald': return [null, null];
      case 'swept': return [
        [[200, 74], [150, 84], [132, 130], [136, 150], [264, 150], [268, 130], [250, 84]],
        [[200, 70], [152, 82], [134, 126], [144, 140], [172, 106], [214, 96], [256, 108], [266, 132], [270, 110], [244, 78]]];
      case 'slick': return [null,
        [[200, 76], [154, 86], [136, 128], [142, 138], [170, 104], [210, 98], [250, 108], [262, 136], [266, 124], [246, 86]]];
      case 'wild': return [
        [[200, 50], [140, 56], [100, 100], [96, 160], [130, 170], [270, 170], [304, 160], [300, 100], [260, 56]],
        [[200, 60], [146, 68], [116, 110], [124, 140], [150, 110], [176, 124], [200, 104], [226, 124], [252, 110], [278, 140], [284, 110], [254, 68]]];
      case 'bob': return [
        [[200, 72], [148, 82], [126, 130], [124, 206 + s], [150, 226 + s], [176, 210], [224, 210], [250, 226 - s], [276, 206 - s], [274, 130], [252, 82]],
        [[200, 76], [150, 86], [132, 128], [138, 154], [164, 124], [200, 128], [236, 124], [262, 154], [268, 128], [250, 86]]];
      case 'ponytail': return [
        [[230, 92], [272, 100], [300, 150 + s], [298, 240 + s], [282, 250 + s], [276, 160], [252, 120]],
        [[200, 76], [152, 86], [134, 128], [142, 144], [170, 110], [214, 104], [254, 116], [264, 140], [268, 124], [248, 86]]];
      case 'curly': return [
        [[200, 58], [142, 64], [110, 110], [108, 180], [120, 230 + s], [160, 230], [240, 230], [280, 230 - s], [292, 180], [290, 110], [258, 64]],
        [[200, 66], [150, 72], [122, 112], [130, 150], [148, 126], [168, 140], [186, 118], [206, 136], [224, 116], [244, 138], [262, 124], [276, 150], [282, 112], [252, 72]]];
      case 'afro': return [
        [[200, 34], [130, 42], [88, 100], [86, 170], [110, 214], [150, 206], [250, 206], [290, 214], [314, 170], [312, 100], [270, 42]],
        null];
      case 'short':
      default: return [null,
        [[200, 78], [152, 86], [134, 126], [138, 150], [150, 126], [170, 112], [200, 116], [230, 112], [252, 126], [262, 150], [266, 126], [248, 86]]];
    }
  }

  function paintHair(ctx, pts0, L, S) {
    if (!pts0) return;
    const pts = pts0.map(([x, y]) => [200 + (x - 200) * 1.08, 172 + (y - 172) * 1.06]);
    const color = L.hair;
    paintShape(ctx, () => smoothPath(ctx, pts), color, { box: bbox(pts), strokes: 0, light: 0.3, rimAmt: 0.9 });
    // Mechones
    ctx.save();
    smoothPath(ctx, pts);
    ctx.clip();
    const b = bbox(pts);
    const r = rng(hash(L.style + color));
    for (let i = 0; i < 70; i++) {
      const x = b[0] + r() * (b[2] - b[0]);
      const y = b[1] + r() * (b[3] - b[1]) * 0.3;
      const len = (b[3] - b[1]) * (0.5 + r() * 0.6);
      const bend = (x - 200) * 0.25 + S.sway * 0.6;
      ctx.strokeStyle = r() < 0.55 ? tone(color, -0.35, 0.35) : tone(color, 0.35, 0.3);
      ctx.lineWidth = 1 + r() * 2.2;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(x + bend * 0.5, y + len * 0.5, x + bend, y + len);
      ctx.stroke();
    }
    // Brillo
    const sheen = ctx.createLinearGradient(b[0], b[1], b[2], b[1] + 60);
    sheen.addColorStop(0, 'rgba(255,255,255,0)');
    sheen.addColorStop(0.35, tone(color, 0.6, 0.35));
    sheen.addColorStop(0.5, 'rgba(255,255,255,0)');
    ctx.fillStyle = sheen;
    ctx.fillRect(b[0], b[1], b[2] - b[0], 70);
    ctx.restore();
  }

  function bbox(pts) {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const [x, y] of pts) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
    return [x0, y0, x1, y1];
  }

  function drawBraids(ctx, L, S) {
    const r = 15;
    for (const side of [-1, 1]) {
      const sx = 200 + side * 62;
      for (let i = 0; i < 9; i++) {
        const y = 170 + i * 26;
        const x = sx + side * (i * 2) + Math.sin(S.t * 1.2 + i * 0.5) * (i * 0.8);
        paintShape(ctx, () => { ctx.beginPath(); ctx.ellipse(x, y, r - i * 0.6, r + 2, side * 0.3, 0, Math.PI * 2); }, L.hair, { box: [x - r, y - r, x + r, y + r], strokes: 2, inkW: 1.8 });
      }
    }
  }

  function drawOutfit(ctx, L, S) {
    const c = L.outfitColor;
    const b = S.breathe;
    const body = () => smoothPath(ctx, [[30, 400], [52, 330 + b], [100, 296 + b], [160, 280 + b], [200, 284 + b], [240, 280 + b], [300, 296 + b], [348, 330 + b], [370, 400]]);
    const outfit = L.outfit;
    if (outfit === 'top') {
      // Hombros al aire y top
      paintShape(ctx, body, L.skin, { box: [30, 280, 370, 400], strokes: 10 });
      paintShape(ctx, () => smoothPath(ctx, [[96, 400], [110, 344 + b], [200, 336 + b], [290, 344 + b], [304, 400]]), c, { box: [96, 336, 304, 400] });
      ctx.strokeStyle = tone(c, -0.3);
      ctx.lineWidth = 6;
      ctx.beginPath(); ctx.moveTo(150, 340 + b); ctx.lineTo(160, 286 + b); ctx.moveTo(250, 340 + b); ctx.lineTo(240, 286 + b); ctx.stroke();
      return;
    }
    paintShape(ctx, body, c, { box: [30, 280, 370, 400], strokes: 30 });
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    switch (outfit) {
      case 'chaqueta':
        paintShape(ctx, () => smoothPath(ctx, [[160, 282 + b], [130, 300 + b], [150, 360 + b], [186, 330 + b]]), tone(c, -0.15), { box: [130, 282, 190, 360], strokes: 4 });
        paintShape(ctx, () => smoothPath(ctx, [[240, 282 + b], [270, 300 + b], [250, 360 + b], [214, 330 + b]]), tone(c, -0.15), { box: [210, 282, 270, 360], strokes: 4 });
        paintShape(ctx, () => smoothPath(ctx, [[186, 300 + b], [214, 300 + b], [208, 400], [192, 400]]), L.shirt || '#3a3040', { box: [186, 300, 214, 400], strokes: 2, rim: false });
        break;
      case 'abrigo':
        paintShape(ctx, () => smoothPath(ctx, [[150, 250 + b], [200, 292 + b], [250, 250 + b], [262, 300 + b], [200, 330 + b], [138, 300 + b]]), tone(c, 0.1), { box: [138, 250, 262, 330], strokes: 6 });
        ctx.strokeStyle = '#e3c45a';
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(200, 330 + b); ctx.lineTo(200, 400); ctx.stroke();
        ctx.fillStyle = '#e3c45a';
        for (let y = 344; y < 400; y += 22) { ctx.beginPath(); ctx.arc(214, y + b, 4, 0, Math.PI * 2); ctx.fill(); }
        break;
      case 'uniforme':
        paintShape(ctx, () => smoothPath(ctx, [[160, 276 + b], [200, 300 + b], [240, 276 + b], [246, 300 + b], [200, 320 + b], [154, 300 + b]]), tone(c, -0.2), { box: [154, 276, 246, 320], strokes: 3 });
        ctx.fillStyle = '#e3c45a';
        ctx.beginPath(); ctx.moveTo(140, 340 + b); ctx.lineTo(150, 330 + b); ctx.lineTo(160, 340 + b); ctx.lineTo(150, 356 + b); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = '#e3c45a'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(60, 340 + b); ctx.lineTo(120, 316 + b); ctx.moveTo(340, 340 + b); ctx.lineTo(280, 316 + b); ctx.stroke();
        break;
      case 'mono':
        paintShape(ctx, () => smoothPath(ctx, [[150, 290 + b], [250, 290 + b], [262, 400], [138, 400]]), L.shirt || '#c9b08a', { box: [138, 290, 262, 400], strokes: 6 });
        paintShape(ctx, () => smoothPath(ctx, [[130, 350 + b], [270, 350 + b], [280, 400], [120, 400]]), c, { box: [120, 350, 280, 400], strokes: 6 });
        ctx.strokeStyle = tone(c, -0.2); ctx.lineWidth = 10;
        ctx.beginPath(); ctx.moveTo(150, 352 + b); ctx.lineTo(140, 296 + b); ctx.moveTo(250, 352 + b); ctx.lineTo(260, 296 + b); ctx.stroke();
        ctx.fillStyle = '#c9a050'; ctx.beginPath(); ctx.arc(150, 352 + b, 5, 0, 7); ctx.arc(250, 352 + b, 5, 0, 7); ctx.fill();
        break;
      case 'vestido':
        paintShape(ctx, () => smoothPath(ctx, [[176, 262 + b], [224, 262 + b], [232, 300 + b], [168, 300 + b]]), tone(c, 0.15), { box: [168, 262, 232, 300], strokes: 3 });
        ctx.strokeStyle = '#e3c45a'; ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.moveTo(110, 320 + b); ctx.quadraticCurveTo(200, 360 + b, 290, 320 + b); ctx.stroke();
        break;
      case 'bata':
        paintShape(ctx, () => smoothPath(ctx, [[166, 282 + b], [200, 380 + b], [234, 282 + b], [214, 400], [186, 400]]), L.shirt || '#5a4a3a', { box: [166, 282, 234, 400], strokes: 3, rim: false });
        ctx.strokeStyle = tone(c, -0.3); ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(166, 282 + b); ctx.lineTo(196, 380 + b); ctx.moveTo(234, 282 + b); ctx.lineTo(204, 380 + b); ctx.stroke();
        break;
      case 'harapos':
        paintShape(ctx, () => smoothPath(ctx, [[140, 278 + b], [200, 300 + b], [260, 278 + b], [276, 312 + b], [230, 330 + b], [200, 322 + b], [170, 330 + b], [124, 312 + b]]), L.shirt || '#7a3a3a', { box: [124, 278, 276, 330], strokes: 8 });
        break;
      default: break;
    }
    ctx.restore();
  }

  function drawEye(ctx, cx, cy, side, L, S) {
    const shape = L.eyes || 'almendra';
    const k = 1.22;
    const w = (shape === 'grandes' ? 21 : 19) * k;
    const up = (shape === 'grandes' ? 13 : shape === 'rasgados' ? 7 : shape === 'cansados' ? 8 : 10) * k;
    const down = (shape === 'grandes' ? 8 : 6) * k;
    const tilt = shape === 'rasgados' ? 5 : 0;
    const inner = [cx - side * w * 0.95, cy + 1];
    const outer = [cx + side * w, cy - tilt];
    const open = S.blink;
    ctx.save();
    if (open < 0.15) {
      ctx.strokeStyle = 'rgba(28,14,24,0.95)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(inner[0], inner[1]);
      ctx.quadraticCurveTo(cx, cy + 5, outer[0], outer[1]);
      ctx.stroke();
      ctx.restore();
      return;
    }
    const top = cy - up * open;
    const eyePath = () => {
      ctx.beginPath();
      ctx.moveTo(inner[0], inner[1]);
      ctx.bezierCurveTo(cx - side * w * 0.5, top, cx + side * w * 0.5, top - 1, outer[0], outer[1]);
      ctx.bezierCurveTo(cx + side * w * 0.5, cy + down, cx - side * w * 0.5, cy + down, inner[0], inner[1]);
      ctx.closePath();
    };
    eyePath();
    ctx.fillStyle = '#efe6dc';
    ctx.fill();
    ctx.clip();
    const gx = cx + S.gaze[0];
    const gy = cy + S.gaze[1] + 1;
    const ir = (shape === 'grandes' ? 10 : 9) * k;
    const ig = ctx.createRadialGradient(gx - 2, gy - 3, 1, gx, gy, ir);
    ig.addColorStop(0, tone(L.eyeColor, 0.5));
    ig.addColorStop(0.6, L.eyeColor);
    ig.addColorStop(1, tone(L.eyeColor, -0.6));
    ctx.fillStyle = ig;
    ctx.beginPath(); ctx.arc(gx, gy, ir, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#120a12';
    ctx.beginPath(); ctx.arc(gx, gy, ir * 0.42, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.beginPath(); ctx.arc(gx - 3, gy - 4, 2.4, 0, Math.PI * 2); ctx.fill();
    // Sombra del párpado
    ctx.fillStyle = 'rgba(60,20,40,0.28)';
    ctx.fillRect(cx - w - 4, top - 4, w * 2 + 8, 7);
    ctx.restore();
    // Línea de pestañas gruesa
    ctx.save();
    ctx.strokeStyle = 'rgba(24,10,20,0.95)';
    ctx.lineCap = 'round';
    ctx.lineWidth = L.makeup === 'eyeliner' ? 4.5 : 3.4;
    ctx.beginPath();
    ctx.moveTo(inner[0], inner[1]);
    ctx.bezierCurveTo(cx - side * w * 0.5, top, cx + side * w * 0.5, top - 1, outer[0], outer[1]);
    if (L.makeup === 'eyeliner') ctx.lineTo(outer[0] + side * 7, outer[1] - 5);
    ctx.stroke();
    ctx.lineWidth = 1.4;
    ctx.strokeStyle = 'rgba(40,20,30,0.6)';
    ctx.beginPath();
    ctx.moveTo(inner[0] + side * 3, inner[1] + 2);
    ctx.bezierCurveTo(cx - side * w * 0.4, cy + down + 1, cx + side * w * 0.5, cy + down + 1, outer[0], outer[1] + 1);
    ctx.stroke();
    if (shape === 'cansados') {
      ctx.strokeStyle = 'rgba(80,40,60,0.35)';
      ctx.beginPath(); ctx.moveTo(cx - w * 0.6, cy + down + 6); ctx.quadraticCurveTo(cx, cy + down + 10, cx + w * 0.6, cy + down + 6); ctx.stroke();
    }
    if (L.makeup === 'sombra') {
      ctx.fillStyle = rgb(hexToRgb(L.makeupColor || '#8b3a8b'), 0.35);
      ctx.beginPath(); ctx.ellipse(cx, top - 4, w + 2, 6, 0, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }

  function drawBrow(ctx, cx, cy, side, L) {
    const type = L.brows || 'medias';
    const th = type === 'gruesas' ? 6 : type === 'finas' ? 2.6 : 4.2;
    const arch = type === 'arqueadas' ? 8 : type === 'rectas' ? 1 : 4;
    const angry = L.browAngle || 0;
    ctx.save();
    ctx.fillStyle = tone(L.hair, -0.35, 0.95);
    ctx.beginPath();
    const x0 = cx - side * 20;
    const x1 = cx + side * 22;
    ctx.moveTo(x0, cy + 2 + angry);
    ctx.quadraticCurveTo(cx, cy - arch - th, x1, cy + 1 - angry * 0.5);
    ctx.quadraticCurveTo(cx, cy - arch + 1, x0, cy + 2 + th * 0.6 + angry);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function drawNose(ctx, L) {
    const type = L.nose || 'recta';
    ctx.save();
    ctx.strokeStyle = tone(L.skin, -0.45, 0.7);
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    const w = type === 'ancha' ? 13 : 9;
    const tip = type === 'respingona' ? 200 : 203;
    ctx.beginPath();
    ctx.moveTo(204, 165);
    ctx.quadraticCurveTo(type === 'aguilena' ? 212 : 208, 188, tip + 4, 205);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(200 - w, 206);
    ctx.quadraticCurveTo(200, 214, 200 + w, 206);
    ctx.stroke();
    ctx.fillStyle = tone(L.skin, -0.5, 0.5);
    ctx.beginPath(); ctx.ellipse(193, 208, 3, 2, 0.3, 0, 7); ctx.ellipse(207, 208, 3, 2, -0.3, 0, 7); ctx.fill();
    ctx.fillStyle = tone(L.skin, 0.6, 0.35);
    ctx.beginPath(); ctx.ellipse(198, 186, 3, 12, 0, 0, 7); ctx.fill();
    ctx.restore();
  }

  function drawMouth(ctx, L, S) {
    const type = L.lips || 'medios';
    const full = type === 'carnosos' ? 1.4 : type === 'finos' ? 0.6 : 1;
    const lc = L.lipColor || tone(L.skin, -0.25);
    const y = 228;
    const w = 20;
    const open = S.mouth;
    ctx.save();
    if (open > 0.05) {
      ctx.fillStyle = '#3a1020';
      ctx.beginPath();
      ctx.ellipse(200, y + 2 + open * 4, w * 0.75, 2 + open * 9, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#f0e6e0';
      ctx.fillRect(188, y - 1 + open * 0.5, 24, 3);
    }
    ctx.fillStyle = lc;
    // Labio superior
    ctx.beginPath();
    ctx.moveTo(200 - w, y);
    ctx.quadraticCurveTo(193, y - 5 * full, 200, y - 3 * full);
    ctx.quadraticCurveTo(207, y - 5 * full, 200 + w, y);
    ctx.quadraticCurveTo(200, y + 1, 200 - w, y);
    ctx.fill();
    // Labio inferior
    ctx.beginPath();
    ctx.moveTo(200 - w + 3, y + 1 + open * 9);
    ctx.quadraticCurveTo(200, y + 9 * full + open * 9, 200 + w - 3, y + 1 + open * 9);
    ctx.quadraticCurveTo(200, y + 3 + open * 9, 200 - w + 3, y + 1 + open * 9);
    ctx.fill();
    ctx.strokeStyle = 'rgba(40,12,24,0.8)';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(200 - w, y);
    ctx.quadraticCurveTo(200, y + 2 + open * 4, 200 + w, y);
    ctx.stroke();
    ctx.fillStyle = 'rgba(255,240,230,0.35)';
    ctx.beginPath(); ctx.ellipse(200, y + 5 * full + open * 9, 6, 1.6, 0, 0, 7); ctx.fill();
    ctx.restore();
  }

  function drawAccents(ctx, L, S, layer) {
    const list = L.accents || [];
    const b = S.breathe;
    for (const a of list) {
      ctx.save();
      if (layer === 'face') {
        if (a === 'freckles') {
          ctx.fillStyle = tone(L.skin, -0.45, 0.6);
          const r = rng(7);
          for (let i = 0; i < 26; i++) {
            const side = r() < 0.5 ? -1 : 1;
            ctx.beginPath(); ctx.arc(200 + side * (14 + r() * 26), 192 + r() * 16, 1 + r() * 1.2, 0, 7); ctx.fill();
          }
        } else if (a === 'scar') {
          ctx.strokeStyle = 'rgba(150,50,60,0.85)'; ctx.lineWidth = 3;
          ctx.beginPath(); ctx.moveTo(214, 140); ctx.lineTo(240, 200); ctx.stroke();
          ctx.strokeStyle = 'rgba(255,200,200,0.4)'; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(216, 140); ctx.lineTo(242, 200); ctx.stroke();
        } else if (a === 'tattoo') {
          ctx.fillStyle = 'rgba(40,40,110,0.75)';
          ctx.font = 'bold 15px Georgia, serif';
          ctx.fillText('VI', 232, 206);
        } else if (a === 'paint') {
          ctx.strokeStyle = '#5affd0'; ctx.lineWidth = 4; ctx.lineCap = 'round';
          ctx.shadowColor = '#5affd0'; ctx.shadowBlur = 10 + Math.sin(S.t * 3) * 4;
          ctx.beginPath(); ctx.moveTo(150, 196); ctx.lineTo(176, 202); ctx.moveTo(250, 196); ctx.lineTo(224, 202); ctx.moveTo(200, 120); ctx.lineTo(200, 140); ctx.stroke();
        } else if (a === 'beard') {
          paintShape(ctx, () => smoothPath(ctx, [[146, 200], [160, 240], [200, 268], [240, 240], [254, 200], [236, 222], [200, 240], [164, 222]]), L.beardColor || L.hair, { box: [146, 200, 254, 268], strokes: 14, inkW: 1.6 });
        } else if (a === 'mustache') {
          ctx.fillStyle = tone(L.hair, -0.2);
          ctx.beginPath(); ctx.moveTo(176, 222); ctx.quadraticCurveTo(200, 210, 224, 222); ctx.quadraticCurveTo(200, 218, 176, 222); ctx.fill();
        } else if (a === 'mask') {
          paintShape(ctx, () => smoothPath(ctx, [[160, 200], [240, 200], [246, 236], [200, 262], [154, 236]]), '#4a5a3a', { box: [154, 200, 246, 262], strokes: 8 });
          ctx.fillStyle = '#8fbf3a'; ctx.shadowColor = '#8fbf3a'; ctx.shadowBlur = 8;
          ctx.beginPath(); ctx.arc(176, 236, 7, 0, 7); ctx.arc(224, 236, 7, 0, 7); ctx.fill();
        } else if (a === 'glasses') {
          ctx.strokeStyle = 'rgba(30,20,20,0.9)'; ctx.lineWidth = 2.5;
          ctx.beginPath(); ctx.arc(172, 172, 18, 0, 7); ctx.moveTo(246, 172); ctx.arc(228, 172, 18, 0, 7); ctx.moveTo(190, 170); ctx.lineTo(210, 170); ctx.stroke();
          ctx.fillStyle = 'rgba(180,220,255,0.12)'; ctx.fill();
        } else if (a === 'piercing') {
          ctx.fillStyle = '#d9d9e0';
          ctx.beginPath(); ctx.arc(232, 140, 2.4, 0, 7); ctx.arc(226, 228, 2, 0, 7); ctx.fill();
        }
      } else if (layer === 'top') {
        if (a === 'goggles') {
          ctx.fillStyle = '#3a2a1a';
          ctx.fillRect(132, 114, 136, 14);
          for (const x of [172, 228]) {
            paintShape(ctx, () => { ctx.beginPath(); ctx.arc(x, 118, 17, 0, 7); }, '#7a5a2a', { box: [x - 17, 101, x + 17, 135], strokes: 3 });
            ctx.fillStyle = 'rgba(120,200,220,0.75)'; ctx.beginPath(); ctx.arc(x, 118, 11, 0, 7); ctx.fill();
            ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.beginPath(); ctx.arc(x - 4, 114, 3, 0, 7); ctx.fill();
          }
        } else if (a === 'hat') {
          paintShape(ctx, () => { ctx.beginPath(); ctx.ellipse(200, 92, 96, 16, -0.05, 0, 7); }, '#2a2a4a', { box: [104, 76, 296, 108], strokes: 6 });
          paintShape(ctx, () => smoothPath(ctx, [[150, 92], [156, 30], [244, 26], [250, 90]]), '#2a2a4a', { box: [150, 26, 250, 92], strokes: 8 });
          ctx.fillStyle = '#5a7ac4'; ctx.fillRect(152, 70, 96, 9);
        } else if (a === 'gold') {
          ctx.fillStyle = '#e3c45a'; ctx.shadowColor = '#e3c45a'; ctx.shadowBlur = 8;
          ctx.beginPath(); ctx.arc(138, 200, 5, 0, 7); ctx.arc(262, 200, 5, 0, 7); ctx.fill();
          ctx.strokeStyle = '#e3c45a'; ctx.lineWidth = 3;
          ctx.beginPath(); ctx.moveTo(166, 282 + b); ctx.quadraticCurveTo(200, 310 + b, 234, 282 + b); ctx.stroke();
        } else if (a === 'arm') {
          paintShape(ctx, () => smoothPath(ctx, [[300, 300 + b], [350, 320 + b], [372, 400], [300, 400]]), '#6a7a8a', { box: [300, 300, 372, 400], strokes: 6 });
          ctx.fillStyle = '#d04ad0'; ctx.shadowColor = '#d04ad0'; ctx.shadowBlur = 14 + Math.sin(S.t * 4) * 6;
          ctx.beginPath(); ctx.arc(334, 346 + b, 8, 0, 7); ctx.fill();
        } else if (a === 'collar') {
          paintShape(ctx, () => smoothPath(ctx, [[150, 262 + b], [200, 300 + b], [250, 262 + b], [262, 300 + b], [200, 320 + b], [138, 300 + b]]), tone(L.outfitColor, 0.15), { box: [138, 262, 262, 320], strokes: 4 });
        }
      }
      ctx.restore();
    }
  }

  // ---------- Render completo ----------
  function render(ctx, look, opts = {}) {
    const L = normalize(look);
    const t = opts.t ?? 0;
    const S = {
      t,
      rand: rng(hash(JSON.stringify(L))),
      rim: opts.rim || L.rim || '#3fbf9f',
      bg: opts.bg || L.bg || ['#2a3a3a', '#0a0f12'],
      breathe: Math.sin(t * 1.6) * 2.2,
      sway: Math.sin(t * 1.1) * 4,
      blink: opts.blink ?? blinkAt(t, hash(L.hair + L.skin)),
      mouth: opts.mouth ?? 0,
      gaze: [Math.sin(t * 0.35) * 2.2, Math.sin(t * 0.27) * 1.2],
    };
    ctx.save();
    ctx.__s = S;
    const scale = opts.size ? opts.size / W : 1;
    ctx.scale(scale, scale);
    drawBackground(ctx, L, S);

    const [hairBack, hairFront] = hairShapes(L.style, S.sway);
    // La cabeza se dibuja algo más grande que el cuerpo (proporción de animación).
    const headT = () => { ctx.translate(200, 200); ctx.scale(1.16, 1.16); ctx.translate(-200, -214); };
    ctx.save();
    headT();
    paintHair(ctx, hairBack, L, S);
    if (L.style === 'braids') drawBraids(ctx, L, S);
    ctx.restore();

    // Cuerpo y cuello
    drawOutfit(ctx, L, S);
    const hb = S.breathe * 0.6;
    ctx.save();
    ctx.translate(0, hb);
    headT();
    paintShape(ctx, () => smoothPath(ctx, [[178, 236], [222, 236], [226, 280], [200, 286], [174, 280]]), L.skin, { box: [174, 236, 226, 286], strokes: 6, shadow: 0.7 });
    // Sombra bajo la mandíbula
    ctx.fillStyle = tone(L.skin, -0.6, 0.45);
    ctx.beginPath(); ctx.ellipse(200, 250, 30, 12, 0, 0, Math.PI); ctx.fill();

    // Orejas
    const ear = (x, side) => {
      if (L.ears === 'yordle') {
        paintShape(ctx, () => smoothPath(ctx, [[x, 150], [x + side * 70, 108], [x + side * 26, 190]]), L.skin, { box: [Math.min(x, x + side * 70), 108, Math.max(x, x + side * 70), 190], strokes: 4 });
      } else {
        paintShape(ctx, () => { ctx.beginPath(); ctx.ellipse(x, 182, 11, 18, side * 0.2, 0, 7); }, L.skin, { box: [x - 11, 164, x + 11, 200], strokes: 2, inkW: 2 });
      }
    };
    ear(140, -1);
    ear(260, 1);

    // Cara
    const face = facePts(L.face);
    paintShape(ctx, () => smoothPath(ctx, face), L.skin, { box: [130, 84, 270, 262], strokes: 34, lx: 168, ly: 140, shadow: 0.65, light: 0.22 });
    // Rubor y sombras de pómulo
    for (const side of [-1, 1]) {
      const g = ctx.createRadialGradient(200 + side * 42, 204, 2, 200 + side * 42, 204, 26);
      g.addColorStop(0, rgb(mix(L.skin, '#e0507a', 0.5), 0.32));
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.fillRect(140, 170, 120, 70);
    }
    ctx.fillStyle = tone(L.skin, -0.5, 0.18);
    ctx.beginPath(); ctx.ellipse(236, 214, 18, 26, -0.3, 0, 7); ctx.fill();
    // Sombreado a rayas en el lado en sombra
    ctx.save();
    smoothPath(ctx, face);
    ctx.clip();
    ctx.strokeStyle = tone(L.skin, -0.55, 0.22);
    ctx.lineWidth = 1.3;
    for (let i = 0; i < 14; i++) {
      const x = 236 + i * 3.2;
      ctx.beginPath(); ctx.moveTo(x, 150 + i * 2); ctx.lineTo(x - 14, 250); ctx.stroke();
    }
    ctx.restore();

    drawEye(ctx, 172, 174, -1, L, S);
    drawEye(ctx, 228, 174, 1, L, S);
    drawBrow(ctx, 172, 150, -1, L);
    drawBrow(ctx, 228, 150, 1, L);
    drawNose(ctx, L);
    drawMouth(ctx, L, S);
    drawAccents(ctx, L, S, 'face');
    paintHair(ctx, hairFront, L, S);
    drawAccents(ctx, L, S, 'top');
    ctx.restore();

    // Textura pictórica y gradación de color
    ctx.globalCompositeOperation = 'overlay';
    const pat = ctx.createPattern(grainTexture(), 'repeat');
    ctx.fillStyle = pat;
    ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'source-over';
    const v = ctx.createRadialGradient(200, 190, 120, 200, 200, 300);
    v.addColorStop(0, 'rgba(0,0,0,0)');
    v.addColorStop(1, 'rgba(8,4,16,0.55)');
    ctx.fillStyle = v;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }

  function blinkAt(t, seed) {
    const period = 3.2 + (seed % 100) / 60;
    const ph = (t + (seed % 37) / 10) % period;
    if (ph < 0.08) return 1 - ph / 0.08;
    if (ph < 0.16) return (ph - 0.08) / 0.08;
    return 1;
  }

  const DEFAULTS = {
    skin: '#e8b89a', face: 'oval', eyes: 'almendra', eyeColor: '#5a7a9a', brows: 'medias', nose: 'recta', lips: 'medios',
    lipColor: null, hair: '#2a2a2a', style: 'short', outfit: 'chaqueta', outfitColor: '#4a3a5a', shirt: null,
    accents: [], makeup: 'none', ears: 'normal',
  };

  function normalize(look = {}) {
    const L = { ...DEFAULTS, ...look };
    if (!look.accents && look.accent && look.accent !== 'none') L.accents = [look.accent];
    L.accents = (L.accents || []).filter((a) => a && a !== 'none');
    if (L.accents.includes('yordle')) L.ears = 'yordle';
    if (!L.lipColor) L.lipColor = rgb(mix(L.skin, '#a03a50', 0.35));
    return L;
  }

  // ---------- Caché e imágenes ----------
  const urlCache = new Map();
  function toURL(look, opts = {}) {
    const size = opts.size || 256;
    const key = JSON.stringify([look, opts.rim, opts.bg, size]);
    if (urlCache.has(key)) return urlCache.get(key);
    const c = document.createElement('canvas');
    c.width = c.height = size;
    render(c.getContext('2d'), look, { ...opts, size, t: 0.4, blink: 1 });
    const url = c.toDataURL('image/jpeg', 0.9);
    urlCache.set(key, url);
    return url;
  }

  // Retrato animado en un canvas. Devuelve un controlador.
  function animate(canvas, look, opts = {}) {
    const ctx = canvas.getContext('2d');
    let current = look;
    let o = { ...opts };
    let talking = false;
    let alive = true;
    const t0 = performance.now();
    function frame(now) {
      if (!alive || !canvas.isConnected) return;
      const t = (now - t0) / 1000;
      const mouth = talking ? Math.abs(Math.sin(t * 13)) * (0.5 + Math.abs(Math.sin(t * 3.1)) * 0.5) : 0;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      render(ctx, current, { ...o, t, mouth, size: canvas.width });
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
    return {
      setLook(l, newOpts) { current = l; if (newOpts) o = { ...o, ...newOpts }; },
      talk(v) { talking = v; },
      stop() { alive = false; },
    };
  }

  // Convierte una foto en un retrato con aspecto pintado.
  function stylizePhoto(img, size = 320, rim = '#3fbf9f') {
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const ctx = c.getContext('2d');
    const s = Math.min(img.width, img.height);
    ctx.filter = 'saturate(1.25) contrast(1.15)';
    ctx.drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, size, size);
    ctx.filter = 'none';
    const data = ctx.getImageData(0, 0, size, size);
    const d = data.data;
    // Posterizado suave (aspecto de pintura plana) y separación de tonos cálidos/fríos
    const levels = 7;
    for (let i = 0; i < d.length; i += 4) {
      const lum = (d[i] * 0.3 + d[i + 1] * 0.59 + d[i + 2] * 0.11) / 255;
      for (let k = 0; k < 3; k++) d[i + k] = Math.round(Math.round((d[i + k] / 255) * levels) / levels * 255);
      if (lum < 0.4) { d[i] *= 0.85; d[i + 1] *= 0.9; d[i + 2] = Math.min(255, d[i + 2] * 1.1 + 10); } else { d[i] = Math.min(255, d[i] * 1.06 + 6); d[i + 1] = Math.min(255, d[i + 1] * 1.02); }
    }
    // Contornos tipo tinta
    const out = ctx.createImageData(size, size);
    const o = out.data;
    for (let y = 1; y < size - 1; y++) {
      for (let x = 1; x < size - 1; x++) {
        const i = (y * size + x) * 4;
        const lum = (j) => d[j] * 0.3 + d[j + 1] * 0.59 + d[j + 2] * 0.11;
        const gx = lum(i + 4) - lum(i - 4);
        const gy = lum(i + size * 4) - lum(i - size * 4);
        const e = Math.min(1, Math.hypot(gx, gy) / 120);
        o[i] = d[i] * (1 - e * 0.85);
        o[i + 1] = d[i + 1] * (1 - e * 0.9);
        o[i + 2] = d[i + 2] * (1 - e * 0.8);
        o[i + 3] = 255;
      }
    }
    ctx.putImageData(out, 0, 0);
    ctx.globalCompositeOperation = 'overlay';
    ctx.fillStyle = ctx.createPattern(grainTexture(), 'repeat');
    ctx.fillRect(0, 0, size, size);
    ctx.globalCompositeOperation = 'soft-light';
    const g = ctx.createLinearGradient(0, 0, size, size);
    g.addColorStop(0, 'rgba(255,190,110,0.5)');
    g.addColorStop(1, rgb(hexToRgb(rim), 0.6));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    ctx.globalCompositeOperation = 'source-over';
    const v = ctx.createRadialGradient(size / 2, size / 2, size * 0.3, size / 2, size / 2, size * 0.75);
    v.addColorStop(0, 'rgba(0,0,0,0)');
    v.addColorStop(1, 'rgba(8,4,16,0.6)');
    ctx.fillStyle = v;
    ctx.fillRect(0, 0, size, size);
    return c.toDataURL('image/jpeg', 0.88);
  }

  window.Painter = { render, animate, toURL, stylizePhoto, normalize, DEFAULTS };
})();
