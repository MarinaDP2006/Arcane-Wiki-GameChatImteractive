// Profundidad para los minijuegos: arte del lugar como fondo con paralaje y desenfoque,
// niebla en capas, rayos de luz, suelo en perspectiva, bloques extruidos hacia un punto de fuga
// y caras reales de los personajes. Todo en canvas 2D para que vaya igual en PC y en tableta.
// Depth.backdrop(['galerias', 'canal-cobre']) elige al azar uno de esos lugares (de T1 o T2).
(function () {
  const TAU = Math.PI * 2;
  const opt = () => window.App?.settings || {};
  const low = () => opt().quality === 'baja' || opt().postfx === false;
  const calm = () => Boolean(opt().reduceMotion);
  const pick = (a) => a[Math.floor(Math.random() * a.length)];

  // Tonos de color por ambiente: [luz alta, sombra, niebla].
  const GRADES = {
    aurelia: ['#ffd89a', '#3a2418', '255,226,170'],
    nacar: ['#7affd0', '#06140f', '120,230,190'],
    foso: ['#ff7a5a', '#1a0406', '255,120,90'],
    hex: ['#8fd4ff', '#08142a', '140,200,255'],
    noche: ['#b0a0ff', '#0a0814', '170,160,230'],
  };

  // ---------- Imágenes ----------
  const imgCache = new Map();
  function image(url) {
    if (!url) return null;
    if (!imgCache.has(url)) { const im = new Image(); im.decoding = 'async'; im.src = url; imgCache.set(url, im); }
    return imgCache.get(url);
  }
  const ready = (im) => Boolean(im && im.complete && im.naturalWidth);

  const PORTRAITS = new Set([]);
  // Todas las imágenes de un lugar: temporada 1, temporada 2 y la general. Durante la historia
  // se respeta la temporada (nunca arte de T1 en T2); en la sala de juegos vale todo.
  function placeUrls(id) {
    const F = window.CustomArt?.files || {};
    const B = window.ART_BUNDLED || {};
    const story = Boolean(window.Game?.current?.()?.progress?.chapterId);
    const season = window.CustomArt?.season?.() || 's1';
    const dirs = !story ? ['lugares/s1', 'lugares/s2', 'lugares'] : season === 's2' ? ['lugares/s2'] : ['lugares/s1', 'lugares'];
    const out = [];
    for (const d of dirs) {
      // De la carpeta general solo valen paisajes: algunas imágenes son primeros planos de personajes o emblemas.
      if (d === 'lugares' && (out.length || PORTRAITS.has(id))) continue;
      const u = F[d]?.[id] || B[d]?.[id];
      if (u && !out.includes(u)) out.push(u);
    }
    return out;
  }
  function pool(ids) {
    const out = [];
    for (const id of ids) for (const url of placeUrls(id)) if (!out.some((o) => o.url === url)) out.push({ id, url });
    return out;
  }

  // Cara real de un personaje (carpeta caras/, luego retrato de la temporada).
  function face(id) {
    const url = window.CustomArt?.image?.('caras', id) || window.ART_BUNDLED?.caras?.[id] || window.CustomArt?.image?.('personajes', id) || window.ART_BUNDLED?.personajes?.[id];
    return image(url);
  }

  // ---------- Fondo pintado con profundidad ----------
  // Se prepara una vez por tamaño: encuadre, desenfoque de lente, gradación de color y bruma.
  function backdrop(ids, o = {}) {
    const choices = pool(ids);
    const chosen = o.url ? { id: ids[0], url: o.url } : choices.length ? pick(choices) : null;
    const im = chosen && image(chosen.url);
    const grade = GRADES[o.grade] || GRADES.nacar;
    const blur = o.blur ?? 1.6;
    let cache = null;
    function prepare(w, h) {
      const over = 1.14;
      const cw = Math.round(w * over);
      const ch = Math.round(h * over);
      const c = document.createElement('canvas');
      c.width = cw; c.height = ch;
      const g = c.getContext('2d');
      const ir = im.naturalWidth / im.naturalHeight;
      let dw = cw;
      let dh = cw / ir;
      if (dh < ch) { dh = ch; dw = ch * ir; }
      const focus = o.focusY ?? 0.5;
      const map = { x: (cw - dw) / 2, y: (ch - dh) * focus, k: dw / im.naturalWidth };
      if (!low()) g.filter = `blur(${blur}px) saturate(1.12) contrast(1.08) brightness(${o.bright ?? 0.82})`;
      else g.filter = `brightness(${o.bright ?? 0.82})`;
      g.drawImage(im, (cw - dw) / 2, (ch - dh) * focus, dw, dh);
      g.filter = 'none';
      // Gradación: luces hacia el tono del ambiente, sombras hacia su color oscuro.
      g.globalCompositeOperation = 'soft-light';
      const gl = g.createLinearGradient(0, 0, 0, ch);
      gl.addColorStop(0, grade[0]); gl.addColorStop(1, grade[1]);
      g.fillStyle = gl; g.globalAlpha = 0.55; g.fillRect(0, 0, cw, ch);
      g.globalAlpha = 1;
      g.globalCompositeOperation = 'source-over';
      // Perspectiva aérea: lo lejano (arriba) más claro y lo cercano (abajo) más denso.
      const haze = g.createLinearGradient(0, 0, 0, ch);
      haze.addColorStop(0, `rgba(${grade[2]},0.10)`);
      haze.addColorStop(0.55, 'rgba(0,0,0,0)');
      haze.addColorStop(1, 'rgba(0,0,0,0.45)');
      g.fillStyle = haze; g.fillRect(0, 0, cw, ch);
      cache = { w, h, c, map };
    }
    return {
      id: chosen?.id || ids[0],
      url: chosen?.url || null,
      grade,
      ready: () => ready(im),
      // cam.x / cam.y entre -1 y 1 desplazan el encuadre (paralaje); cam.zoom acerca.
      // sharp: dibuja desde la imagen original sin desenfoque (para vistas ampliadas como una mira).
      draw(ctx, w, h, cam = {}, t = 0, sharp = false) {
        if (!ready(im)) {
          // Mientras carga (o si no hay arte), el escenario procedural del juego.
          if (window.Scenes?.has?.(o.scene || ids[0])) window.Scenes.drawFrame(ctx, o.scene || ids[0], t, w, h);
          else { ctx.fillStyle = grade[1]; ctx.fillRect(0, 0, w, h); }
          return;
        }
        if (!cache || cache.w !== w || cache.h !== h) prepare(w, h);
        const m = calm() ? 0 : 1;
        const zoom = Math.max(1, cam.zoom || 1);
        const cw = cache.c.width;
        const ch = cache.c.height;
        const sw = w / zoom;
        const sh = h / zoom;
        const breathe = m * Math.sin(t * 0.13) * 0.15;
        const px = Math.max(-1, Math.min(1, (cam.x || 0) * m + breathe));
        const py = Math.max(-1, Math.min(1, (cam.y || 0) * m));
        const sx = (cw - sw) / 2 + (px * (cw - sw)) / 2;
        const sy = (ch - sh) / 2 + (py * (ch - sh)) / 2;
        if (!sharp) { ctx.drawImage(cache.c, sx, sy, sw, sh, 0, 0, w, h); return; }
        const { map } = cache;
        ctx.drawImage(im, (sx - map.x) / map.k, (sy - map.y) / map.k, sw / map.k, sh / map.k, 0, 0, w, h);
        ctx.save();
        ctx.globalCompositeOperation = 'soft-light';
        ctx.globalAlpha = 0.4;
        const gl = ctx.createLinearGradient(0, 0, 0, h);
        gl.addColorStop(0, grade[0]); gl.addColorStop(1, grade[1]);
        ctx.fillStyle = gl; ctx.fillRect(0, 0, w, h);
        ctx.restore();
      },
    };
  }

  // ---------- Atmósfera ----------
  // Bancos de niebla que cruzan la escena a distintas alturas y velocidades.
  function fog(ctx, w, h, t, o = {}) {
    if (low()) return;
    const col = o.color || '120,230,190';
    const n = o.n ?? 6;
    const y0 = o.y0 ?? 0.45;
    const y1 = o.y1 ?? 1;
    const a = o.alpha ?? 0.13;
    ctx.save();
    for (let i = 0; i < n; i++) {
      const sp = (o.speed ?? 14) * (0.6 + (i % 3) * 0.35);
      const r = Math.max(w, h) * (0.22 + (i % 4) * 0.06);
      const x = ((t * sp + i * 377 + (o.scroll || 0) * (0.3 + i * 0.1)) % (w + r * 2)) - r;
      const y = h * (y0 + ((y1 - y0) * (i + 0.5)) / n) + Math.sin(t * 0.4 + i) * 10;
      const g = ctx.createRadialGradient(x, y, 4, x, y, r);
      g.addColorStop(0, `rgba(${col},${a})`);
      g.addColorStop(1, `rgba(${col},0)`);
      ctx.fillStyle = g;
      ctx.fillRect(x - r, y - r, r * 2, r * 2);
    }
    ctx.restore();
  }

  // Rayos de luz volumétrica que entran en diagonal.
  function rays(ctx, w, h, t, o = {}) {
    if (low()) return;
    const x0 = (o.x ?? 0.75) * w;
    const col = o.color || '255,226,170';
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < (o.n ?? 4); i++) {
      const a = (o.angle ?? 0.35) + i * 0.09 + Math.sin(t * 0.25 + i * 2) * 0.03;
      const len = h * 1.5;
      const wd = (o.width ?? 60) * (0.6 + (i % 3) * 0.4);
      const g = ctx.createLinearGradient(x0, 0, x0 - Math.sin(a) * len, len);
      g.addColorStop(0, `rgba(${col},${(o.alpha ?? 0.1) * (0.8 + Math.sin(t * 0.7 + i) * 0.2)})`);
      g.addColorStop(1, `rgba(${col},0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(x0 - wd * 0.2 + i * 30, -10);
      ctx.lineTo(x0 + wd * 0.2 + i * 30, -10);
      ctx.lineTo(x0 - Math.sin(a) * len + wd + i * 30, len);
      ctx.lineTo(x0 - Math.sin(a) * len - wd + i * 30, len);
      ctx.fill();
    }
    ctx.restore();
  }

  // Motas de polvo o esporas a tres profundidades (las cercanas, grandes y desenfocadas).
  function motes(n = 50, seed = 1) {
    let a = seed * 9973;
    const r = () => { a = (a * 9301 + 49297) % 233280; return a / 233280; };
    const list = Array.from({ length: n }, () => ({ x: r(), y: r(), z: 0.2 + r() * 0.8, ph: r() * TAU }));
    return {
      draw(ctx, w, h, t, o = {}) {
        if (opt().particles === false) return;
        const col = o.color || '255,220,160';
        const scroll = o.scroll || 0;
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        for (const m of list) {
          const x = (((m.x * w - scroll * m.z * 0.5 + Math.sin(t * 0.5 + m.ph) * 20) % w) + w) % w;
          const y = (((m.y * h - t * 12 * m.z + Math.cos(t * 0.4 + m.ph) * 10) % h) + h) % h;
          const s = 1 + m.z * m.z * 5;
          const g = ctx.createRadialGradient(x, y, 0, x, y, s * 2);
          const al = (0.25 + 0.4 * Math.abs(Math.sin(t * 1.5 + m.ph))) * (m.z > 0.85 ? 0.5 : 1);
          g.addColorStop(0, `rgba(${col},${al})`);
          g.addColorStop(1, `rgba(${col},0)`);
          ctx.fillStyle = g;
          ctx.fillRect(x - s * 2, y - s * 2, s * 4, s * 4);
        }
        ctx.restore();
      },
    };
  }

  // Siluetas desenfocadas en primer plano (tuberías, cadenas, hojas): dan sensación de cámara.
  const fgCache = new Map();
  function foreground(ctx, w, h, t, o = {}) {
    const kind = o.kind || 'pipes';
    const key = `${kind}:${w}x${h}`;
    if (!fgCache.has(key)) {
      if (fgCache.size > 8) fgCache.delete(fgCache.keys().next().value);
      const c = document.createElement('canvas');
      c.width = Math.round(w * 1.2); c.height = h;
      const g = c.getContext('2d');
      if (!low()) g.filter = 'blur(7px)';
      const dark = o.color || '#050307';
      g.fillStyle = dark; g.strokeStyle = dark;
      if (kind === 'pipes') {
        g.lineWidth = h * 0.07;
        g.beginPath(); g.moveTo(-20, h * 0.06); g.lineTo(c.width * 0.3, h * 0.02); g.stroke();
        g.lineWidth = h * 0.05;
        g.beginPath(); g.moveTo(c.width + 20, h * 0.85); g.quadraticCurveTo(c.width * 0.9, h * 0.7, c.width * 0.92, h * 0.4); g.lineTo(c.width * 0.95, -20); g.stroke();
        g.fillRect(c.width * 0.9, h * 0.52, h * 0.09, h * 0.03);
      } else if (kind === 'chains') {
        for (const [x, len] of [[0.04, 0.42], [0.95, 0.3]]) {
          for (let y = -10; y < h * len; y += 26) { g.lineWidth = 7; g.beginPath(); g.ellipse(c.width * x, y, 9, 15, 0, 0, TAU); g.stroke(); }
        }
      } else if (kind === 'leaves') {
        for (let i = 0; i < 14; i++) {
          const x = i < 7 ? Math.random() * c.width * 0.15 : c.width * (0.85 + Math.random() * 0.15);
          const y = Math.random() * h;
          g.beginPath(); g.ellipse(x, y, 40 + Math.random() * 40, 14 + Math.random() * 10, Math.random() * 3, 0, TAU); g.fill();
        }
      } else if (kind === 'rails') {
        g.fillRect(0, h * 0.9, c.width, h * 0.12);
        for (let x = 0; x < c.width; x += 140) g.fillRect(x, h * 0.84, 24, h * 0.2);
      }
      fgCache.set(key, c);
    }
    const c = fgCache.get(key);
    const par = calm() ? 0 : (o.par || 0) + Math.sin(t * 0.3) * 0.15;
    ctx.save();
    ctx.globalAlpha = o.alpha ?? 0.85;
    ctx.drawImage(c, -w * 0.1 - par * w * 0.08, 0);
    ctx.restore();
  }

  // ---------- Geometría en perspectiva ----------
  // Proyección de un punto 3D (x a los lados, y hacia abajo, z hacia el fondo).
  function proj(x, y, z, cam) {
    const s = cam.f / Math.max(0.01, z);
    return { x: cam.cx + x * s, y: cam.cy + y * s, s };
  }

  // Suelo en perspectiva hasta el horizonte: losas que avanzan con «scroll» y reflejos húmedos.
  function floor(ctx, w, h, hy, o = {}) {
    const vx = o.vx ?? w / 2;
    const cols = o.colors || ['rgba(20,14,24,0.0)', 'rgba(14,10,16,0.92)'];
    ctx.save();
    const g = ctx.createLinearGradient(0, hy, 0, h);
    g.addColorStop(0, cols[0]); g.addColorStop(0.25, cols[1]); g.addColorStop(1, cols[2] || cols[1]);
    ctx.fillStyle = g;
    ctx.fillRect(0, hy, w, h - hy);
    ctx.strokeStyle = o.line || 'rgba(227,196,90,0.18)';
    ctx.lineWidth = 1.2;
    // Líneas hacia el punto de fuga
    const n = o.rays ?? 14;
    for (let i = -n; i <= n; i++) {
      const bx = vx + (i / n) * w * 1.6;
      ctx.globalAlpha = 0.6;
      ctx.beginPath(); ctx.moveTo(vx + (bx - vx) * 0.02, hy); ctx.lineTo(bx, h); ctx.stroke();
    }
    // Líneas transversales con espaciado 1/z
    const sc = ((o.scroll || 0) % 1 + 1) % 1;
    for (let k = 0; k < (o.rows ?? 16); k++) {
      const z = 1 + k - sc;
      const y = hy + (h - hy) / z;
      if (y <= hy + 1) continue;
      ctx.globalAlpha = Math.min(0.8, (y - hy) / (h - hy) + 0.1);
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }
    ctx.globalAlpha = 1;
    if (o.wet && !low()) {
      // Brillo húmedo: reflejo de la luz principal en el suelo.
      const rg = ctx.createRadialGradient(o.lightX ?? vx, hy + (h - hy) * 0.35, 4, o.lightX ?? vx, hy + (h - hy) * 0.35, w * 0.4);
      rg.addColorStop(0, o.wet); rg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = rg;
      ctx.fillRect(0, hy, w, h - hy);
    }
    ctx.restore();
  }

  // Bloque extruido: cara frontal (x, y, bw, bh) y su fondo hacia el punto de fuga (vx, vy).
  // d entre 0 y 1 es la profundidad. Con «tex» se pinta un patrón en la cara frontal.
  function box(ctx, x, y, bw, bh, d, vx, vy, o = {}) {
    const back = (px, py) => [px + (vx - px) * d, py + (vy - py) * d];
    const [tlx, tly] = back(x, y);
    const [trx, try_] = back(x + bw, y);
    const [blx, bly] = back(x, y + bh);
    const [brx, bry] = back(x + bw, y + bh);
    ctx.save();
    // Tapa superior (se ve si el bloque está por debajo del horizonte)
    if (y > vy) {
      ctx.fillStyle = o.top || '#4a3a40';
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + bw, y); ctx.lineTo(trx, try_); ctx.lineTo(tlx, tly); ctx.closePath(); ctx.fill();
      if (o.edge) { ctx.strokeStyle = o.edge; ctx.lineWidth = 1; ctx.stroke(); }
    } else if (y + bh < vy) {
      ctx.fillStyle = o.bottom || o.side || '#100c12';
      ctx.beginPath(); ctx.moveTo(x, y + bh); ctx.lineTo(x + bw, y + bh); ctx.lineTo(brx, bry); ctx.lineTo(blx, bly); ctx.closePath(); ctx.fill();
    }
    // Lateral (el que mira al punto de fuga)
    ctx.fillStyle = o.side || '#1a1418';
    if (x + bw < vx) { ctx.beginPath(); ctx.moveTo(x + bw, y); ctx.lineTo(trx, try_); ctx.lineTo(brx, bry); ctx.lineTo(x + bw, y + bh); ctx.closePath(); ctx.fill(); }
    else if (x > vx) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(tlx, tly); ctx.lineTo(blx, bly); ctx.lineTo(x, y + bh); ctx.closePath(); ctx.fill(); }
    // Cara frontal con luz lateral
    const fg = ctx.createLinearGradient(x, y, x + bw, y + bh);
    fg.addColorStop(0, o.front || '#3a2a30'); fg.addColorStop(1, o.frontDark || '#1a1216');
    ctx.fillStyle = fg;
    ctx.fillRect(x, y, bw, bh);
    if (o.tex) o.tex(ctx, x, y, bw, bh);
    if (o.rim) { ctx.fillStyle = o.rim; ctx.fillRect(x, y, bw, 2); }
    ctx.restore();
  }

  // Sombra de contacto suave bajo un objeto.
  function shadow(ctx, x, y, rx, ry, a = 0.5) {
    ctx.save();
    const g = ctx.createRadialGradient(x, y, 1, x, y, rx);
    g.addColorStop(0, `rgba(0,0,0,${a})`); g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.scale(1, ry / rx);
    ctx.beginPath(); ctx.arc(x, y * (rx / ry), rx, 0, TAU); ctx.fill();
    ctx.restore();
  }

  // Esfera con luz (gemas, bombas, núcleos): da volumen con un solo gradiente.
  function orb(ctx, x, y, r, col, o = {}) {
    ctx.save();
    const g = ctx.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.08, x, y, r);
    g.addColorStop(0, o.hi || '#ffffff'); g.addColorStop(0.25, col); g.addColorStop(1, o.dark || '#05050a');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
    if (o.glow) { ctx.globalCompositeOperation = 'lighter'; ctx.shadowColor = col; ctx.shadowBlur = r * 1.5; ctx.globalAlpha = 0.35; ctx.fill(); }
    ctx.restore();
  }

  // Retrato circular con aro de latón, sombra y luz de contorno.
  function medallion(ctx, im, x, y, r, o = {}) {
    ctx.save();
    ctx.shadowColor = o.rim || '#e0457b';
    ctx.shadowBlur = o.glow ?? 36;
    ctx.fillStyle = '#0a0608';
    ctx.beginPath(); ctx.arc(x, y, r + 8, 0, TAU); ctx.fill();
    ctx.restore();
    ctx.save();
    ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.clip();
    if (ready(im)) {
      const ir = im.naturalWidth / im.naturalHeight;
      const dw = ir > 1 ? r * 2 * ir : r * 2;
      const dh = ir > 1 ? r * 2 : (r * 2) / ir;
      ctx.drawImage(im, x - dw / 2, y - r - (dh - r * 2) * 0.15, dw, dh);
    } else { ctx.fillStyle = '#2a1a20'; ctx.fillRect(x - r, y - r, r * 2, r * 2); }
    const sh = ctx.createRadialGradient(x - r * 0.3, y - r * 0.4, r * 0.2, x, y, r * 1.05);
    sh.addColorStop(0, 'rgba(255,240,220,0.08)'); sh.addColorStop(0.7, 'rgba(0,0,0,0)'); sh.addColorStop(1, 'rgba(0,0,0,0.55)');
    ctx.fillStyle = sh; ctx.fillRect(x - r, y - r, r * 2, r * 2);
    if (o.flash) { ctx.fillStyle = `rgba(255,240,220,${o.flash})`; ctx.fillRect(x - r, y - r, r * 2, r * 2); }
    ctx.restore();
    const rg = ctx.createLinearGradient(x, y - r, x, y + r);
    rg.addColorStop(0, '#f6dc8a'); rg.addColorStop(0.5, '#8a6424'); rg.addColorStop(1, '#e3c45a');
    ctx.lineWidth = 6; ctx.strokeStyle = rg;
    ctx.beginPath(); ctx.arc(x, y, r + 3, 0, TAU); ctx.stroke();
    ctx.lineWidth = 1.5; ctx.strokeStyle = o.rim || '#e0457b';
    ctx.beginPath(); ctx.arc(x, y, r + 7, 0, TAU); ctx.stroke();
  }

  window.Depth = { GRADES, image, ready, pool, face, backdrop, fog, rays, motes, foreground, proj, floor, box, shadow, orb, medallion, low };
})();
