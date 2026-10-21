// Mundo abierto en 2D+3D: las calles, los edificios y los paisajes de Piltover y Zaun se
// dibujan en 3D (Three.js) con una cámara que sigue al jugador, gira y hace zoom. Los
// personajes y las tarjetas de los lugares se pintan encima en 2D (ver world.js).
// Cada ciudad tiene su propia escena: Piltover es dorada, con luz de atardecer y junto al
// mar; Zaun es un pozo oscuro con neones, tuberías, cables, chimeneas y niebla química.
// La imagen pasa por un posprocesado propio (resplandor, gradación de color, viñeta y
// grano de lienzo) para que se parezca a la serie: pintado, con luz fuerte y algo de realismo.
(function () {
  if (!window.THREE) return;
  const T = window.THREE;
  // Móviles: menos luces, sombras más pequeñas y menos resolución en el posprocesado.
  const LOW = Boolean(window.U?.touch);

  function rng(seed) {
    let a = seed >>> 0;
    return () => {
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // Ambiente de cada ciudad. grade = [sombras, luces] (tintes), sat, contraste.
  const LOOK = {
    piltover: {
      sky: [0x3b6fb8, 0xffc98a, 0xa47a4c], bg: 0xf0cf9c, fog: 0xf2cf98, fogD: 0.00021,
      hemi: [0xcfe0ff, 0x8a6236, 0.6], sun: [0xffc47a, 5.6], sunDir: [-0.72, 0.6, 0.42],
      exposure: 1.0, dust: 0xffd88a, dustRise: 6, pitch: 0.92, lantern: 0,
      bloom: 0.45, thr: 1.5, grade: [[0.9, 0.97, 1.12], [1.07, 1.0, 0.88]], sat: 1.1, contrast: 1.12, vig: 0.6,
      env: { top: 0x5d8fd0, mid: 0xffd9a0, bot: 0x7a5a3a, blobs: [[0xffd090, 18, [-0.72, 0.6, 0.42], 0.3]] },
      lights: 3, lightI: 9000,
    },
    zaun: {
      sky: [0x061210, 0x15453a, 0x030706], bg: 0x0f2c24, fog: 0x123a30, fogD: 0.0003,
      hemi: [0x6fe8c8, 0x5a1a40, 1.1], sun: [0x9affdc, 1.8], sunDir: [0.35, 1, -0.6],
      exposure: 1.4, dust: 0x6affc8, dustRise: 22, pitch: 1.0, lantern: 1,
      bloom: 0.9, thr: 1.0, grade: [[0.82, 1.04, 1.05], [1.1, 0.96, 1.02]], sat: 1.12, contrast: 1.1, vig: 0.8,
      env: { top: 0x0b2a24, mid: 0x1a3c34, bot: 0x050808, blobs: [[0xff3fa0, 6, [0.8, 0.2, 0.3], 0.25], [0x3fffc0, 6, [-0.6, 0.25, -0.5], 0.3], [0xffa040, 5, [0.1, 0.15, 0.9], 0.25]] },
      lights: 8, lightI: 60000,
    },
  };

  // ---------- Texturas generadas ----------
  function canvasTex(w, h, paint, repeat) {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    paint(c.getContext('2d'), w, h);
    const tex = new T.CanvasTexture(c);
    tex.colorSpace = T.SRGBColorSpace;
    if (repeat) tex.wrapS = tex.wrapT = T.RepeatWrapping;
    tex.anisotropy = 8;
    return tex;
  }

  // Ruido suave que se repite sin cortes (para niebla, agua y detalles del suelo).
  function noiseCanvas(size, seed, octaves = 4, base = 4) {
    const r = rng(seed);
    const out = new Float32Array(size * size);
    let amp = 1;
    let tot = 0;
    for (let o = 0; o < octaves; o++) {
      const n = base << o;
      const grid = Array.from({ length: n * n }, () => r());
      const at = (x, y) => grid[((y + n) % n) * n + ((x + n) % n)];
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          const fx = (x / size) * n;
          const fy = (y / size) * n;
          const ix = Math.floor(fx);
          const iy = Math.floor(fy);
          const tx = fx - ix;
          const ty = fy - iy;
          const sx = tx * tx * (3 - 2 * tx);
          const sy = ty * ty * (3 - 2 * ty);
          const a = at(ix, iy) + (at(ix + 1, iy) - at(ix, iy)) * sx;
          const b = at(ix, iy + 1) + (at(ix + 1, iy + 1) - at(ix, iy + 1)) * sx;
          out[y * size + x] += (a + (b - a) * sy) * amp;
        }
      }
      tot += amp;
      amp *= 0.5;
    }
    for (let i = 0; i < out.length; i++) out[i] /= tot;
    return out;
  }

  // Fachadas: mapa de color y mapa de luz (solo las ventanas encendidas).
  // Piltover: sillares de piedra clara, ventanales de arco con marco y clave, impostas.
  // Zaun: chapas remachadas, óxido que chorrea, ventanas tapiadas y luces de colores.
  function facadeTex(zaun, seed) {
    const r = rng(seed);
    const S = 512;
    const lit = [];
    const cols = zaun ? 8 : 4;
    const rows = zaun ? 8 : 4;
    const cw = S / cols;
    const ch = S / rows;
    for (let i = 0; i < cols * rows; i++) {
      const v = r();
      lit.push(zaun ? (v < 0.42 ? (v < 0.08 ? 2 : v < 0.14 ? 3 : 1) : v > 0.9 ? -1 : 0) : v < 0.34 ? 1 : 0);
    }
    const paintStone = (g) => {
      g.fillStyle = '#f4e8cc';
      g.fillRect(0, 0, S, S);
      // Sillares
      for (let y = 0; y < S; y += 16) {
        const off = (y / 16) % 2 ? 0 : 24;
        for (let x = -48; x < S; x += 48) {
          const t = 0.9 + r() * 0.16;
          g.fillStyle = `rgba(${Math.round(232 * t)},${Math.round(214 * t)},${Math.round(176 * t)},0.55)`;
          g.fillRect(x + off + 1, y + 1, 46, 14);
        }
        g.fillStyle = 'rgba(120,92,52,0.22)';
        g.fillRect(0, y, S, 1.5);
      }
      for (let i = 0; i < 2500; i++) {
        g.fillStyle = `rgba(${r() < 0.5 ? '110,84,48' : '255,250,235'},${0.04 + r() * 0.08})`;
        g.fillRect(r() * S, r() * S, 1 + r() * 3, 1 + r() * 2);
      }
    };
    const paintMetal = (g) => {
      g.fillStyle = '#86847e';
      g.fillRect(0, 0, S, S);
      // Chapas de distintos tonos
      for (let i = 0; i < 46; i++) {
        const w = 40 + r() * 120;
        const h = 30 + r() * 110;
        const x = Math.floor(r() * S);
        const y = Math.floor(r() * S);
        const t = r();
        g.fillStyle = t < 0.3 ? 'rgba(120,72,44,0.45)' : t < 0.55 ? 'rgba(60,84,78,0.4)' : t < 0.8 ? 'rgba(40,40,46,0.35)' : 'rgba(170,160,140,0.3)';
        for (const [dx, dy] of [[0, 0], [-S, 0], [0, -S], [-S, -S]]) {
          g.fillRect(x + dx, y + dy, w, h);
          g.strokeStyle = 'rgba(0,0,0,0.45)';
          g.lineWidth = 2;
          g.strokeRect(x + dx, y + dy, w, h);
          g.fillStyle = 'rgba(20,16,12,0.55)';
          for (let k = 6; k < w - 3; k += 12) { g.fillRect(x + dx + k, y + dy + 4, 2.5, 2.5); g.fillRect(x + dx + k, y + dy + h - 6, 2.5, 2.5); }
          g.fillStyle = t < 0.3 ? 'rgba(120,72,44,0.45)' : t < 0.55 ? 'rgba(60,84,78,0.4)' : t < 0.8 ? 'rgba(40,40,46,0.35)' : 'rgba(170,160,140,0.3)';
        }
      }
      for (let i = 0; i < 3000; i++) {
        g.fillStyle = `rgba(${r() < 0.6 ? '30,24,18' : '200,190,170'},${0.05 + r() * 0.1})`;
        g.fillRect(r() * S, r() * S, 1 + r() * 3, 1 + r() * 3);
      }
    };
    const paint = (glow) => (g) => {
      if (glow) { g.fillStyle = '#000'; g.fillRect(0, 0, S, S); } else if (zaun) paintMetal(g); else paintStone(g);
      let k = 0;
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const on = lit[k++];
          const x0 = col * cw;
          const y0 = row * ch;
          if (zaun) {
            const ww = 26;
            const wh = 32;
            const x = x0 + (cw - ww) / 2 + (((k * 7) % 5) - 2) * 2;
            const y = y0 + 14;
            if (glow) {
              if (on <= 0) continue;
              const c = on === 2 ? '#3affc8' : on === 3 ? '#ff4fb0' : '#ffaa50';
              const grd = g.createLinearGradient(0, y, 0, y + wh);
              grd.addColorStop(0, c); grd.addColorStop(1, on === 1 ? '#a04a10' : c);
              g.fillStyle = grd;
              g.fillRect(x, y, ww, wh);
              continue;
            }
            // Óxido que chorrea bajo cada ventana
            const rg = g.createLinearGradient(0, y + wh, 0, y + wh + 40);
            rg.addColorStop(0, 'rgba(110,52,20,0.55)'); rg.addColorStop(1, 'rgba(110,52,20,0)');
            g.fillStyle = rg;
            g.fillRect(x + 2, y + wh, ww - 4, 40);
            g.fillStyle = '#2a2622';
            g.fillRect(x - 3, y - 3, ww + 6, wh + 6);
            if (on === -1) {
              // Tapiada con tablas
              g.fillStyle = '#5a4630';
              for (let p = 0; p < 4; p++) g.fillRect(x - 2, y + p * 8 + 1, ww + 4, 6);
              continue;
            }
            const c = on === 2 ? '#7affd8' : on === 3 ? '#ff8ad0' : on === 1 ? '#ffcf8a' : '#161a1c';
            g.fillStyle = c;
            g.fillRect(x, y, ww, wh);
            g.fillStyle = 'rgba(0,0,0,0.5)';
            g.fillRect(x + ww / 2 - 1, y, 2, wh);
            g.fillRect(x, y + wh / 2 - 1, ww, 2);
          } else {
            const ww = 46;
            const wh = 80;
            const x = x0 + (cw - ww) / 2;
            const y = y0 + 30;
            const arch = (pad) => {
              g.beginPath();
              g.moveTo(x - pad, y + wh + pad);
              g.lineTo(x - pad, y + ww / 2);
              g.arc(x + ww / 2, y + ww / 2, ww / 2 + pad, Math.PI, 0);
              g.lineTo(x + ww + pad, y + wh + pad);
              g.closePath();
            };
            if (glow) {
              if (!on) continue;
              const grd = g.createLinearGradient(0, y, 0, y + wh);
              grd.addColorStop(0, '#ffe2a0'); grd.addColorStop(1, '#ff9a3a');
              g.fillStyle = grd;
              arch(0);
              g.fill();
              continue;
            }
            if (row === 0) {
              // Imposta bajo cada piso
            }
            g.fillStyle = 'rgba(255,248,230,0.9)';
            arch(6);
            g.fill();
            g.strokeStyle = 'rgba(110,84,48,0.45)';
            g.lineWidth = 1.5;
            g.stroke();
            const grd = g.createLinearGradient(0, y, 0, y + wh);
            if (on) { grd.addColorStop(0, '#ffe6a8'); grd.addColorStop(1, '#e89040'); } else { grd.addColorStop(0, '#7f97b2'); grd.addColorStop(0.5, '#3c4c62'); grd.addColorStop(1, '#2a3446'); }
            g.fillStyle = grd;
            arch(0);
            g.fill();
            // Parteluz y travesaño
            g.fillStyle = 'rgba(90,70,40,0.8)';
            g.fillRect(x + ww / 2 - 1.5, y + 4, 3, wh - 4);
            g.fillRect(x, y + wh * 0.42, ww, 3);
            if (on) {
              // Cortinas
              g.fillStyle = 'rgba(140,40,30,0.55)';
              g.fillRect(x + 1, y + 10, 8, wh - 10);
              g.fillRect(x + ww - 9, y + 10, 8, wh - 10);
            }
            // Clave del arco y alféizar
            g.fillStyle = '#fff6e0';
            g.beginPath(); g.moveTo(x + ww / 2 - 6, y - 8); g.lineTo(x + ww / 2 + 6, y - 8); g.lineTo(x + ww / 2 + 4, y + 4); g.lineTo(x + ww / 2 - 4, y + 4); g.fill();
            g.fillRect(x - 8, y + wh + 4, ww + 16, 6);
            g.fillStyle = 'rgba(80,60,30,0.35)';
            g.fillRect(x - 8, y + wh + 10, ww + 16, 3);
          }
        }
        if (!zaun && !glow) {
          // Imposta (banda horizontal) bajo cada piso
          const y = (row + 1) * ch - 8;
          g.fillStyle = 'rgba(255,248,232,0.9)';
          g.fillRect(0, y, S, 6);
          g.fillStyle = 'rgba(90,66,30,0.35)';
          g.fillRect(0, y + 6, S, 3);
        }
      }
      if (zaun && !glow) {
        // Mugre más densa abajo
        const gr = g.createLinearGradient(0, 0, 0, S);
        gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(10,14,10,0.25)');
        g.fillStyle = gr;
        g.fillRect(0, 0, S, S);
      }
    };
    return { map: canvasTex(S, S, paint(false), true), glow: canvasTex(S, S, paint(true), true) };
  }

  function glowTex(rgb) {
    return canvasTex(128, 128, (g) => {
      const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
      grd.addColorStop(0, `rgba(${rgb},1)`);
      grd.addColorStop(0.25, `rgba(${rgb},0.5)`);
      grd.addColorStop(1, `rgba(${rgb},0)`);
      g.fillStyle = grd;
      g.fillRect(0, 0, 128, 128);
    });
  }

  function smokeTex() {
    return canvasTex(128, 128, (g) => {
      const r = rng(5);
      for (let i = 0; i < 14; i++) {
        const x = 34 + r() * 60;
        const y = 34 + r() * 60;
        const grd = g.createRadialGradient(x, y, 0, x, y, 34);
        grd.addColorStop(0, 'rgba(200,230,215,0.35)');
        grd.addColorStop(1, 'rgba(200,230,215,0)');
        g.fillStyle = grd;
        g.fillRect(0, 0, 128, 128);
      }
    });
  }

  // Textura en escala de grises que se repite (niebla, detalle del suelo).
  function noiseTex(size, seed, octaves, base, shape) {
    const n = noiseCanvas(size, seed, octaves, base);
    const tex = canvasTex(size, size, (g) => {
      const img = g.createImageData(size, size);
      for (let i = 0; i < n.length; i++) {
        const v = Math.round(255 * (shape ? shape(n[i]) : n[i]));
        img.data[i * 4] = img.data[i * 4 + 1] = img.data[i * 4 + 2] = v;
        img.data[i * 4 + 3] = 255;
      }
      g.putImageData(img, 0, 0);
    }, true);
    tex.colorSpace = T.NoColorSpace;
    return tex;
  }

  // Adoquines (Piltover) o grava y mugre (Zaun) para el detalle cercano del suelo.
  function detailTex(zaun) {
    const S = 256;
    const tex = canvasTex(S, S, (g) => {
      const r = rng(zaun ? 71 : 17);
      g.fillStyle = '#808080';
      g.fillRect(0, 0, S, S);
      if (zaun) {
        for (let i = 0; i < 4000; i++) {
          const v = Math.round(60 + r() * 140);
          g.fillStyle = `rgb(${v},${v},${v})`;
          g.fillRect(r() * S, r() * S, 1 + r() * 4, 1 + r() * 4);
        }
        return;
      }
      // Adoquines redondeados en hileras
      const row = 16;
      for (let y = 0; y < S; y += row) {
        const off = (y / row) % 2 ? 0 : 10;
        for (let x = -20; x < S + 20; x += 20) {
          const v = Math.round(130 + r() * 70);
          g.fillStyle = 'rgb(50,50,50)';
          g.beginPath(); g.roundRect(x + off, y, 20, row, 5); g.fill();
          g.fillStyle = `rgb(${v},${v},${v})`;
          g.beginPath(); g.roundRect(x + off + 1.5, y + 1.5, 17, row - 3, 5); g.fill();
          g.fillStyle = 'rgba(255,255,255,0.25)';
          g.beginPath(); g.roundRect(x + off + 3, y + 2.5, 11, 4, 2); g.fill();
        }
      }
    }, true);
    tex.colorSpace = T.NoColorSpace;
    return tex;
  }

  // Mapa de normales para el mar (olas).
  function waterNormals() {
    const S = 256;
    const n = noiseCanvas(S, 9, 4, 8);
    const tex = canvasTex(S, S, (g) => {
      const img = g.createImageData(S, S);
      const h = (x, y) => n[((y + S) % S) * S + ((x + S) % S)];
      for (let y = 0; y < S; y++) {
        for (let x = 0; x < S; x++) {
          const dx = (h(x + 1, y) - h(x - 1, y)) * 6;
          const dy = (h(x, y + 1) - h(x, y - 1)) * 6;
          const l = Math.hypot(dx, dy, 1);
          const i = (y * S + x) * 4;
          img.data[i] = Math.round((-dx / l * 0.5 + 0.5) * 255);
          img.data[i + 1] = Math.round((-dy / l * 0.5 + 0.5) * 255);
          img.data[i + 2] = Math.round((1 / l * 0.5 + 0.5) * 255);
          img.data[i + 3] = 255;
        }
      }
      g.putImageData(img, 0, 0);
    }, true);
    tex.colorSpace = T.NoColorSpace;
    return tex;
  }

  // Estandartes de Piltover (4 diseños en una sola textura).
  function bannerTex() {
    return canvasTex(512, 384, (g) => {
      const designs = [['#1f4f7a', '#e3c45a'], ['#7a1f2a', '#e3c45a'], ['#e8dcc0', '#2f6f7a'], ['#2f6f5a', '#f0d68a']];
      designs.forEach(([bg, fg], i) => {
        const x = i * 128;
        g.fillStyle = bg;
        g.beginPath(); g.moveTo(x + 8, 0); g.lineTo(x + 120, 0); g.lineTo(x + 120, 330); g.lineTo(x + 64, 380); g.lineTo(x + 8, 330); g.closePath(); g.fill();
        g.strokeStyle = fg; g.lineWidth = 6;
        g.beginPath(); g.moveTo(x + 18, 10); g.lineTo(x + 110, 10); g.lineTo(x + 110, 322); g.lineTo(x + 64, 364); g.lineTo(x + 18, 322); g.closePath(); g.stroke();
        // Engranaje con alas: emblema de la Ciudad del Progreso
        const cx = x + 64;
        const cy = 150;
        g.fillStyle = fg;
        g.beginPath();
        for (let k = 0; k < 24; k++) {
          const a = (k / 24) * Math.PI * 2;
          const rr = k % 2 ? 30 : 38;
          g[k ? 'lineTo' : 'moveTo'](cx + Math.cos(a) * rr, cy + Math.sin(a) * rr);
        }
        g.closePath(); g.fill();
        g.fillStyle = bg;
        g.beginPath(); g.arc(cx, cy, 18, 0, 7); g.fill();
        g.fillStyle = fg;
        g.beginPath(); g.moveTo(cx, cy - 12); g.lineTo(cx + 9, cy + 8); g.lineTo(cx - 9, cy + 8); g.fill();
        for (const s of [-1, 1]) {
          g.beginPath(); g.moveTo(cx + s * 36, cy - 6);
          g.quadraticCurveTo(cx + s * 62, cy - 40, cx + s * 52, cy + 6);
          g.quadraticCurveTo(cx + s * 46, cy - 6, cx + s * 36, cy + 6); g.fill();
        }
        g.fillRect(x + 30, 240, 68, 5);
        g.fillRect(x + 40, 256, 48, 4);
      });
    });
  }

  // Letreros de neón con texto (Zaun).
  const SIGNS = ['BAR', 'CHEM', 'RAMEN', 'HOTEL', 'TALLER', 'BENZO', 'NEÓN', 'CLÍNICA', 'FORJA', 'ZAUN', 'ÚLTIMA GOTA', 'PIEZAS', 'LUZ', 'NOODLES', 'BAÑOS', '24H'];
  function signTex(text, rgb) {
    const w = 64 + text.length * 34;
    return canvasTex(w, 96, (g) => {
      g.font = 'bold 56px "Arial Narrow", Arial, sans-serif';
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.strokeStyle = `rgba(${rgb},0.9)`;
      g.lineWidth = 6;
      g.strokeRect(6, 6, w - 12, 84);
      g.shadowColor = `rgb(${rgb})`;
      g.shadowBlur = 12;
      g.strokeStyle = `rgb(${rgb})`;
      g.lineWidth = 7;
      g.strokeText(text, w / 2, 50);
      g.shadowBlur = 0;
      g.fillStyle = '#fff';
      g.fillText(text, w / 2, 50);
    });
  }

  // Suelo de la ciudad: calles, aceras, plazas y nombres de los barrios. Devuelve también un
  // mapa de rugosidad: en Zaun los charcos brillan y reflejan los neones.
  function groundTex(map) {
    const zaun = map.id === 'zaun';
    const W = LOW ? 2048 : 3072;
    const H = Math.round((W * map.h) / map.w);
    const s = W / map.w;
    const puddles = [];
    const tex = canvasTex(W, H, (g) => {
      const r = rng(map.def.seed + 99);
      const P = map.def.palette;
      g.fillStyle = zaun ? '#1a2220' : '#b9a27a';
      g.fillRect(0, 0, W, H);
      for (let i = 0; i < 16000; i++) {
        const v = r();
        g.fillStyle = zaun ? `rgba(${v < 0.5 ? '0,0,0' : '70,96,80'},${0.08 + r() * 0.12})` : `rgba(${v < 0.5 ? '90,70,40' : '255,240,210'},${0.05 + r() * 0.08})`;
        g.fillRect(r() * W, r() * H, 2 + r() * 6, 2 + r() * 5);
      }
      for (const d of map.def.districts) {
        const [x, y, w, h] = d.rect;
        g.fillStyle = d.tint.replace(/[\d.]+\)$/, (a) => `${Math.min(0.3, parseFloat(a) * 3)})`);
        g.fillRect(x * s, y * s, w * s, h * s);
      }
      // Calles con bordillo, acera y calzada
      const B = map.BLOCK;
      const st = map.STREET;
      const lines = () => {
        g.beginPath();
        for (let x = 0; x <= map.w; x += B) { g.moveTo(x * s, 0); g.lineTo(x * s, H); }
        for (let y = 0; y <= map.h; y += B) { g.moveTo(0, y * s); g.lineTo(W, y * s); }
      };
      for (const [wid, col] of [[st + 6, zaun ? '#0c100e' : '#8a7452'], [st, zaun ? '#2e2c28' : '#e2d3ae'], [st - 20, zaun ? '#121816' : '#7a6a4c'], [st - 24, zaun ? P.street : '#8f7a58']]) {
        g.strokeStyle = col;
        g.lineWidth = wid * s;
        lines();
        g.stroke();
      }
      g.setLineDash([10 * s * 2, 12 * s * 2]);
      g.lineWidth = 2.5 * s;
      g.strokeStyle = zaun ? 'rgba(143,191,58,0.35)' : 'rgba(255,240,200,0.55)';
      lines();
      g.stroke();
      g.setLineDash([]);
      if (!zaun) {
        // Pasos de cebra en los cruces
        g.fillStyle = 'rgba(255,246,222,0.6)';
        for (let x = B; x < map.w; x += B) {
          for (let y = B; y < map.h; y += B) {
            for (let k = -3; k <= 3; k++) {
              g.fillRect((x + k * 10 - 3) * s, (y - st / 2 - 18) * s, 6 * s, 14 * s);
              g.fillRect((x - st / 2 - 18) * s, (y + k * 10 - 3) * s, 14 * s, 6 * s);
            }
          }
        }
      }
      if (zaun) {
        // Charcos de agua y química, manchas de aceite y tuberías tiradas por el suelo
        for (let i = 0; i < 260; i++) {
          const p = { x: r() * W, y: r() * H, rx: 8 + r() * 46, ry: 5 + r() * 22, a: r() * 3, chem: r() < 0.18 };
          puddles.push(p);
          g.fillStyle = p.chem ? 'rgba(110,210,60,0.22)' : 'rgba(4,8,8,0.55)';
          g.beginPath();
          g.ellipse(p.x, p.y, p.rx, p.ry, p.a, 0, Math.PI * 2);
          g.fill();
        }
        g.strokeStyle = 'rgba(100,140,90,0.5)';
        g.lineWidth = 6 * s;
        for (let i = 0; i < 6; i++) {
          g.beginPath();
          g.moveTo(0, (180 + i * 360) * s);
          g.bezierCurveTo(800 * s, (100 + i * 360) * s, 2000 * s, (300 + i * 360) * s, W, (200 + i * 360) * s);
          g.stroke();
        }
        // Rejillas de alcantarilla
        g.strokeStyle = 'rgba(0,0,0,0.6)';
        g.lineWidth = 2;
        for (let i = 0; i < 90; i++) {
          const x = r() * W;
          const y = r() * H;
          g.strokeRect(x, y, 16 * s, 16 * s);
          for (let k = 3; k < 16; k += 4) { g.beginPath(); g.moveTo(x + k * s, y); g.lineTo(x + k * s, y + 16 * s); g.stroke(); }
        }
      }
      // Plazas en los lugares
      for (const l of map.def.locations) {
        const cx = l.x * s;
        const cy = l.y * s;
        const R = 140 * s;
        const pg = g.createRadialGradient(cx, cy, R * 0.2, cx, cy, R);
        pg.addColorStop(0, zaun ? '#26302c' : '#f2e8cc');
        pg.addColorStop(1, zaun ? '#1a2220' : '#ddcfae');
        g.fillStyle = pg;
        g.beginPath();
        g.arc(cx, cy, R, 0, Math.PI * 2);
        g.fill();
        g.strokeStyle = zaun ? 'rgba(63,191,159,0.6)' : '#c9a24a';
        g.lineWidth = 5 * s;
        g.stroke();
        g.lineWidth = 2 * s;
        g.beginPath();
        g.arc(cx, cy, R * 0.9, 0, Math.PI * 2);
        g.stroke();
        if (!zaun) {
          // Rosa de los vientos dorada con baldosas en abanico
          for (let a = 0; a < 16; a++) {
            const ang = (a * Math.PI) / 8;
            g.fillStyle = a % 2 ? 'rgba(180,140,60,0.22)' : 'rgba(255,250,236,0.5)';
            g.beginPath();
            g.moveTo(cx, cy);
            g.arc(cx, cy, R * 0.85, ang, ang + Math.PI / 8);
            g.closePath();
            g.fill();
          }
          g.strokeStyle = 'rgba(180,140,60,0.7)';
          g.lineWidth = 2 * s;
          for (let a = 0; a < 8; a++) {
            g.beginPath();
            g.moveTo(cx, cy);
            g.lineTo(cx + Math.cos((a * Math.PI) / 4) * R * (a % 2 ? 0.55 : 0.85), cy + Math.sin((a * Math.PI) / 4) * R * (a % 2 ? 0.55 : 0.85));
            g.stroke();
          }
        }
      }
      g.textAlign = 'center';
      g.font = `bold ${Math.round(64 * s)}px Georgia, serif`;
      for (const d of map.def.districts) {
        const [x, y, w, h] = d.rect;
        g.fillStyle = zaun ? 'rgba(120,255,210,0.10)' : 'rgba(90,60,20,0.16)';
        g.fillText(d.name.toUpperCase(), (x + w / 2) * s, (y + h / 2) * s);
      }
    });
    let rough = null;
    if (zaun) {
      rough = canvasTex(W / 2, H / 2, (g) => {
        g.fillStyle = '#c8c8c8';
        g.fillRect(0, 0, W / 2, H / 2);
        // Calles mojadas y charcos casi como espejos
        g.strokeStyle = '#7a7a7a';
        g.lineWidth = (map.STREET - 24) * s * 0.5;
        g.beginPath();
        for (let x = 0; x <= map.w; x += map.BLOCK) { g.moveTo(x * s * 0.5, 0); g.lineTo(x * s * 0.5, H / 2); }
        for (let y = 0; y <= map.h; y += map.BLOCK) { g.moveTo(0, y * s * 0.5); g.lineTo(W / 2, y * s * 0.5); }
        g.stroke();
        g.fillStyle = '#141414';
        for (const p of puddles) {
          g.beginPath();
          g.ellipse(p.x / 2, p.y / 2, p.rx / 2, p.ry / 2, p.a, 0, Math.PI * 2);
          g.fill();
        }
      });
      rough.colorSpace = T.NoColorSpace;
    }
    return { map: tex, rough };
  }

  // ---------- Geometría ----------
  // Une muchas geometrías en una sola (una llamada de dibujo por material). `ao` oscurece
  // la parte baja de cada pieza (oclusión ambiental falsa): [factor abajo, altura].
  function merge(items) {
    const parts = items.map(({ geo, color, ao }) => ({ g: geo.index ? geo.toNonIndexed() : geo, c: new T.Color(color), ao }));
    const n = parts.reduce((a, p) => a + p.g.attributes.position.count, 0);
    const pos = new Float32Array(n * 3);
    const nor = new Float32Array(n * 3);
    const uv = new Float32Array(n * 2);
    const col = new Float32Array(n * 3);
    let o = 0;
    for (const { g, c, ao } of parts) {
      const cnt = g.attributes.position.count;
      const P = g.attributes.position;
      pos.set(P.array, o * 3);
      nor.set(g.attributes.normal.array, o * 3);
      if (g.attributes.uv) uv.set(g.attributes.uv.array, o * 2);
      let y0 = 0;
      if (ao) { g.computeBoundingBox(); y0 = g.boundingBox.min.y; }
      for (let i = 0; i < cnt; i++) {
        const f = ao ? ao[0] + (1 - ao[0]) * Math.min(1, (P.getY(i) - y0) / ao[1]) : 1;
        col[(o + i) * 3] = c.r * f; col[(o + i) * 3 + 1] = c.g * f; col[(o + i) * 3 + 2] = c.b * f;
      }
      o += cnt;
    }
    const g = new T.BufferGeometry();
    g.setAttribute('position', new T.BufferAttribute(pos, 3));
    g.setAttribute('normal', new T.BufferAttribute(nor, 3));
    g.setAttribute('uv', new T.BufferAttribute(uv, 2));
    g.setAttribute('color', new T.BufferAttribute(col, 3));
    g.computeBoundingSphere();
    return g;
  }

  const box = (w, h, d) => new T.BoxGeometry(w, h, d);

  // Caja con las ventanas a escala real (una repetición de textura = `cell` unidades).
  // Tiene cortes en altura para que la oclusión de la base quede suave.
  function facadeBox(w, h, d, cell) {
    const g = new T.BoxGeometry(w, h, d, 1, h > 80 ? 4 : 2, 1);
    const P = g.attributes.position;
    const N = g.attributes.normal;
    const uv = g.attributes.uv;
    for (let i = 0; i < P.count; i++) {
      if (Math.abs(N.getY(i)) > 0.5) { uv.setXY(i, 0.01, 0.01); continue; } // tejado y base: pared lisa
      const along = Math.abs(N.getX(i)) > 0.5 ? P.getZ(i) + d / 2 : P.getX(i) + w / 2;
      uv.setXY(i, along / cell, (P.getY(i) + h / 2) / cell);
    }
    return g;
  }

  // Tejado abuhardillado (mansarda) de base rectangular.
  function mansard(w, d, h, top = 0.62) {
    return new T.CylinderGeometry(Math.SQRT1_2 * top, Math.SQRT1_2, 1, 4, 1).rotateY(Math.PI / 4).scale(w, h, d);
  }

  // Los edificios entre la cámara y el jugador se recortan para que siempre se vea la calle.
  const cut = { uFocus: { value: new T.Vector3() }, uCut: { value: 150 } };
  function cutaway(mat) {
    mat.onBeforeCompile = (sh) => {
      Object.assign(sh.uniforms, cut);
      sh.vertexShader = `varying vec3 vWPos;\n${sh.vertexShader.replace('#include <project_vertex>', '#include <project_vertex>\nvWPos = (modelMatrix * vec4(transformed, 1.0)).xyz;')}`;
      sh.fragmentShader = `uniform vec3 uFocus;\nuniform float uCut;\nvarying vec3 vWPos;\n${sh.fragmentShader.replace('#include <clipping_planes_fragment>', `#include <clipping_planes_fragment>
        vec3 cSeg = uFocus - cameraPosition;
        float cL = length(cSeg);
        vec3 cDir = cSeg / cL;
        float cT = dot(vWPos - cameraPosition, cDir);
        if (length(vWPos - cameraPosition) < 260.0) discard;
        if (cT > 0.0 && cT < cL - 25.0) {
          float cD = length(vWPos - cameraPosition - cDir * cT);
          float cE = uCut * clamp(cT / cL * 1.5, 0.15, 1.0);
          if (cD < cE * 0.7) discard;
          if (cD < cE && mod(floor(gl_FragCoord.x) + floor(gl_FragCoord.y), 2.0) < 1.0) discard;
        }`)}`;
    };
    mat.customProgramCacheKey = () => 'cutaway';
    return mat;
  }

  function glowSprite(tex, size, opacity = 1) {
    const s = new T.Sprite(new T.SpriteMaterial({ map: tex, blending: T.AdditiveBlending, depthWrite: false, transparent: true, opacity }));
    s.scale.set(size, size, 1);
    return s;
  }

  // Color por encima de 1 para que el posprocesado lo haga brillar.
  const hdr = (c, k) => new T.Color(c).multiplyScalar(k);

  // Catenaria (cable que cuelga) entre dos puntos.
  function sag(a, b, drop, n = 10) {
    const pts = [];
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      pts.push(new T.Vector3(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t - Math.sin(t * Math.PI) * drop, a.z + (b.z - a.z) * t));
    }
    return pts;
  }

  // ---------- Construcción de cada ciudad ----------
  const GOLD = 0xd8aa50;
  function buildPiltover(map, R) {
    const grp = new T.Group();
    const r = rng(map.def.seed * 31);
    const fac = facadeTex(false, 21);
    const wallMat = cutaway(new T.MeshStandardMaterial({ map: fac.map, emissiveMap: fac.glow, emissive: 0xffb060, emissiveIntensity: 1.3, vertexColors: true, roughness: 0.85, envMapIntensity: 0.3 }));
    const stoneMat = cutaway(new T.MeshStandardMaterial({ vertexColors: true, roughness: 0.75, envMapIntensity: 0.35 }));
    const goldMat = cutaway(new T.MeshStandardMaterial({ vertexColors: true, metalness: 0.92, roughness: 0.26, envMapIntensity: 1.3 }));
    const roofMat = cutaway(new T.MeshStandardMaterial({ vertexColors: true, metalness: 0.4, roughness: 0.5, envMapIntensity: 1.0 }));
    const walls = [];
    const stone = [];
    const gold = [];
    const roofs = [];
    const banners = [];
    const clocks = [];
    const CREAM = 0xf3e4c2;
    const VERDIGRIS = [0x5aa595, 0x4a8f8a, 0x6ab0a0];
    const banner = (x, y, z, nx, nz, k) => {
      const g = new T.PlaneGeometry(18, 54);
      const uv = g.attributes.uv;
      for (let i = 0; i < uv.count; i++) uv.setX(i, (k + uv.getX(i)) / 4);
      g.rotateY(Math.atan2(nx, nz)).translate(x + nx * 1.2, y, z + nz * 1.2);
      banners.push({ geo: g, color: 0xffffff });
      gold.push({ geo: new T.CylinderGeometry(0.9, 0.9, 24, 5).rotateZ(Math.PI / 2).rotateY(Math.atan2(nx, nz) + Math.PI / 2).translate(x + nx * 2, y + 28, z + nz * 2), color: GOLD });
    };
    const addBuilding = (x, z, w, d, h, bodyCol, roofCol, kind, tower, detail) => {
      const m = Math.min(w, d);
      walls.push({ geo: facadeBox(w, h, d, 150).translate(x, h / 2, z), color: bodyCol, ao: [0.5, 80] });
      stone.push({ geo: box(w + 5, 14, d + 5).translate(x, 7, z), color: 0xa08866, ao: [0.6, 14] }); // zócalo
      gold.push({ geo: box(w + 6, 2.5, d + 6).translate(x, 14.5, z), color: GOLD });
      stone.push({ geo: box(w + 4, 4, d + 4).translate(x, h * 0.36, z), color: 0xeedfba }); // imposta
      if (detail) {
        // Pilastras en las esquinas
        for (const sx of [-1, 1]) for (const sz of [-1, 1]) stone.push({ geo: box(8, h - 14, 8).translate(x + (sx * w) / 2, 14 + (h - 14) / 2, z + (sz * d) / 2), color: 0xf6ead0, ao: [0.75, 60] });
      }
      // Cornisa en dos niveles con filo dorado
      gold.push({ geo: box(w + 9, 3, d + 9).translate(x, h - 2, z), color: GOLD });
      stone.push({ geo: box(w + 13, 5, d + 13).translate(x, h + 2, z), color: CREAM });
      stone.push({ geo: box(w - 1, 1.2, d - 1).translate(x, h + 5, z), color: kind < 0.62 ? 0x8a7a6a : 0xa8846a }); // cubierta
      let top = h + 4.5;
      if (kind < 0.28) {
        // Cúpula sobre tambor, con linterna y aguja
        const rr = m * 0.34;
        stone.push({ geo: new T.CylinderGeometry(rr * 1.02, rr * 1.06, 16, 24).translate(x, top + 8, z), color: CREAM });
        gold.push({ geo: new T.CylinderGeometry(rr * 1.1, rr * 1.1, 2.5, 24).translate(x, top + 16, z), color: GOLD });
        const domeCol = r() < 0.45 ? GOLD : VERDIGRIS[Math.floor(r() * 3)];
        (domeCol === GOLD ? gold : roofs).push({ geo: new T.SphereGeometry(rr, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2).translate(x, top + 16, z), color: domeCol });
        if (detail) {
          stone.push({ geo: new T.CylinderGeometry(rr * 0.16, rr * 0.18, rr * 0.4, 8).translate(x, top + 16 + rr + rr * 0.15, z), color: CREAM });
          gold.push({ geo: new T.ConeGeometry(rr * 0.2, rr * 0.5, 8).translate(x, top + 16 + rr + rr * 0.6, z), color: GOLD });
          gold.push({ geo: new T.CylinderGeometry(0.6, 0.6, 18, 4).translate(x, top + 16 + rr * 1.85 + 9, z), color: GOLD });
        }
      } else if (kind < 0.62) {
        // Mansarda de pizarra o cobre, con buhardillas y chimeneas
        const hr = m * 0.32;
        roofs.push({ geo: mansard(w + 2, d + 2, hr).translate(x, top + hr / 2, z), color: roofCol });
        gold.push({ geo: box(w * 0.64, 2, d * 0.64).translate(x, top + hr + 1, z), color: GOLD });
        if (detail) {
          const n = Math.max(1, Math.floor(w / 45));
          for (let i = 0; i < n; i++) {
            const dx = -w / 2 + ((i + 0.5) * w) / n;
            for (const sz of [-1, 1]) {
              const dz = sz * (d / 2 - hr * 0.22);
              stone.push({ geo: box(10, 12, 8).translate(x + dx, top + hr * 0.38, z + dz), color: CREAM });
              roofs.push({ geo: new T.ConeGeometry(8, 7, 4).rotateY(Math.PI / 4).scale(1, 1, 0.8).translate(x + dx, top + hr * 0.38 + 9.5, z + dz), color: roofCol });
            }
          }
          for (const sx of [-0.3, 0.3]) stone.push({ geo: box(7, 16, 7).translate(x + w * sx, top + hr + 6, z + d * 0.18), color: 0x8a5a3a });
        }
        top += hr;
      } else if (kind < 0.82) {
        // Azotea con balaustrada, lucernario de cristal y templete
        for (const sz of [-1, 1]) stone.push({ geo: box(w + 8, 7, 2.5).translate(x, top + 3.5, z + (sz * (d + 8)) / 2), color: CREAM });
        for (const sx of [-1, 1]) stone.push({ geo: box(2.5, 7, d + 8).translate(x + (sx * (w + 8)) / 2, top + 3.5, z), color: CREAM });
        roofs.push({ geo: new T.ConeGeometry(m * 0.3, m * 0.18, 4).rotateY(Math.PI / 4).translate(x - w * 0.15, top + m * 0.09, z), color: 0x8fd0e0 });
        if (detail) {
          const cr = m * 0.12;
          for (let a = 0; a < 6; a++) stone.push({ geo: new T.CylinderGeometry(1.4, 1.4, 18, 5).translate(x + w * 0.22 + Math.cos(a) * cr, top + 9, z + Math.sin(a) * cr), color: CREAM });
          gold.push({ geo: new T.SphereGeometry(cr * 1.15, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2).translate(x + w * 0.22, top + 18, z), color: GOLD });
        }
      } else {
        // Ático escalonado con pirámide empinada y remate
        walls.push({ geo: facadeBox(w * 0.66, 24, d * 0.66, 150).translate(x, top + 12, z), color: bodyCol });
        gold.push({ geo: box(w * 0.66 + 6, 3, d * 0.66 + 6).translate(x, top + 25, z), color: GOLD });
        roofs.push({ geo: new T.ConeGeometry(m * 0.5, m * 0.62, 4).rotateY(Math.PI / 4).translate(x, top + 26 + m * 0.31, z), color: roofCol });
        gold.push({ geo: new T.SphereGeometry(3, 8, 6).translate(x, top + 27 + m * 0.62, z), color: GOLD });
        top += 26 + m * 0.62;
      }
      if (detail && r() < 0.45) {
        // Balcones con barandilla dorada en una fachada
        const sides = [[0, 1], [1, 0], [0, -1], [-1, 0]];
        const [nx, nz] = sides[Math.floor(r() * 4)];
        const len = (nx ? d : w) * 0.5;
        for (const fy of [0.55, 0.78]) {
          const y = h * fy;
          stone.push({ geo: box(nx ? 9 : len, 2.5, nx ? len : 9).translate(x + nx * (w / 2 + 4.5), y, z + nz * (d / 2 + 4.5)), color: CREAM });
          gold.push({ geo: box(nx ? 1 : len, 6, nx ? len : 1).translate(x + nx * (w / 2 + 8.5), y + 4, z + nz * (d / 2 + 8.5)), color: GOLD });
        }
      }
      if (detail && r() < 0.35) {
        const sides = [[0, 1], [1, 0], [0, -1], [-1, 0]];
        const [nx, nz] = sides[Math.floor(r() * 4)];
        const k = Math.floor(r() * 4);
        const off = (nx ? d : w) * 0.28;
        for (const s of [-1, 1]) banner(x + nx * (w / 2) + (nz ? s * off : 0), h * 0.62, z + nz * (d / 2) + (nx ? s * off : 0), nx, nz, k);
      }
      if (tower) {
        // Torre del reloj con anillos dorados y chapitel octogonal de cobre
        const tw = m * 0.42;
        const th = 150;
        walls.push({ geo: facadeBox(tw, th, tw, 150).translate(x, top + th / 2, z), color: bodyCol });
        for (let k = 1; k <= 3; k++) gold.push({ geo: box(tw + 5, 3, tw + 5).translate(x, top + (th * k) / 3, z), color: GOLD });
        stone.push({ geo: box(tw + 9, 5, tw + 9).translate(x, top + th + 2, z), color: CREAM });
        roofs.push({ geo: new T.ConeGeometry(tw * 0.72, tw * 2, 8).translate(x, top + th + 4 + tw, z), color: VERDIGRIS[0] });
        gold.push({ geo: new T.SphereGeometry(3.5, 8, 6).translate(x, top + th + 6 + tw * 2, z), color: GOLD });
        gold.push({ geo: new T.CylinderGeometry(0.7, 0.7, 26, 4).translate(x, top + th + 18 + tw * 2, z), color: GOLD });
        clocks.push([x, top + th * 0.78, z, tw]);
      }
    };
    for (const b of map.buildings) {
      const h = 90 + b.tall * 200 + (b.w > 140 ? 40 : 0);
      addBuilding(b.x + b.w / 2, b.y + b.h / 2, b.w, b.h, h, b.color, b.roof, b.style, b.tall > 0.9, true);
    }
    // Ciudad de relleno fuera de los límites (oeste, norte y este; al sur está el mar)
    const pal = map.def.palette;
    for (let x = -900; x < map.w + 900; x += 170) {
      for (let z = -900; z < map.h + 60; z += 170) {
        if (x > -40 && x < map.w + 40 && z > -40) continue;
        if (r() < 0.15) continue;
        const w = 80 + r() * 70;
        addBuilding(x + r() * 30, z + r() * 30, w, w * (0.8 + r() * 0.4), 120 + r() * 320, pal.building[Math.floor(r() * 4)], pal.roof[Math.floor(r() * 4)], r(), r() < 0.08, false);
      }
    }
    for (const [list, mat] of [[walls, wallMat], [stone, stoneMat], [gold, goldMat], [roofs, roofMat]]) {
      const mesh = new T.Mesh(merge(list), mat);
      mesh.castShadow = mesh.receiveShadow = true;
      grp.add(mesh);
    }
    if (banners.length) {
      const bm = new T.Mesh(merge(banners), cutaway(new T.MeshStandardMaterial({ map: bannerTex(), transparent: true, alphaTest: 0.5, side: T.DoubleSide, roughness: 0.9, vertexColors: true })));
      bm.castShadow = true;
      grp.add(bm);
    }
    // Esferas de reloj
    const clockTex = canvasTex(256, 256, (g) => {
      const grd = g.createRadialGradient(128, 128, 10, 128, 128, 124);
      grd.addColorStop(0, '#fffaf0'); grd.addColorStop(1, '#f0dfb0');
      g.fillStyle = grd; g.beginPath(); g.arc(128, 128, 122, 0, Math.PI * 2); g.fill();
      g.strokeStyle = '#a07a2a'; g.lineWidth = 12; g.stroke();
      g.lineWidth = 3; g.beginPath(); g.arc(128, 128, 100, 0, Math.PI * 2); g.stroke();
      g.fillStyle = '#5a4012';
      g.font = 'bold 26px Georgia, serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
      ['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'].forEach((n, i) => {
        const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
        g.fillText(n, 128 + Math.cos(a) * 82, 128 + Math.sin(a) * 82);
      });
      g.strokeStyle = '#2a1e08';
      g.lineCap = 'round';
      g.lineWidth = 8; g.beginPath(); g.moveTo(128, 128); g.lineTo(128, 60); g.stroke();
      g.lineWidth = 5; g.beginPath(); g.moveTo(128, 128); g.lineTo(180, 140); g.stroke();
    });
    const clockMat = new T.MeshStandardMaterial({ map: clockTex, emissiveMap: clockTex, emissive: 0xffe0a0, emissiveIntensity: 0.5, roughness: 0.5 });
    for (const [x, y, z, tw] of clocks) {
      for (let a = 0; a < 4; a++) {
        const c = new T.Mesh(new T.CircleGeometry(tw * 0.36, 32), clockMat);
        c.position.set(x + Math.sin((a * Math.PI) / 2) * (tw / 2 + 0.6), y, z + Math.cos((a * Math.PI) / 2) * (tw / 2 + 0.6));
        c.rotation.y = (a * Math.PI) / 2;
        grp.add(c);
      }
    }

    // Parques con árboles frondosos (varias copas por árbol) y setos
    const trees = [];
    for (const lot of map.lots) {
      trees.push({ geo: box(lot.size - 20, 3, lot.size - 20).translate(lot.x + lot.size / 2, 1.5, lot.y + lot.size / 2), color: 0x7a9a4a });
      for (let i = 0; i < 6; i++) {
        const x = lot.x + 24 + r() * (lot.size - 48);
        const z = lot.y + 24 + r() * (lot.size - 48);
        const s = 14 + r() * 10;
        trees.push({ geo: new T.CylinderGeometry(2.5, 4, 26, 6).translate(x, 13, z), color: 0x5a3e22 });
        const leaf = [0x6a8a3a, 0x7a9a42, 0x8a9a4a, 0x5f7f36][Math.floor(r() * 4)];
        for (let k = 0; k < 3; k++) {
          trees.push({ geo: new T.IcosahedronGeometry(s * (0.8 + r() * 0.4), 1).translate(x + (r() - 0.5) * s, 26 + s + r() * s * 0.8, z + (r() - 0.5) * s), color: leaf, ao: [0.65, s * 2] });
        }
      }
    }
    if (trees.length) {
      const tm = new T.Mesh(merge(trees), cutaway(new T.MeshStandardMaterial({ vertexColors: true, roughness: 0.9, flatShading: true })));
      tm.castShadow = tm.receiveShadow = true;
      grp.add(tm);
    }

    // El mar al sur con olas, el malecón, las Hexpuertas y el Puente del Progreso
    const wn = waterNormals();
    wn.repeat.set(40, 18);
    const sea = new T.Mesh(new T.PlaneGeometry(9000, 4000), new T.MeshStandardMaterial({ color: 0x2c6a8a, roughness: 0.12, metalness: 0.55, normalMap: wn, normalScale: new T.Vector2(0.6, 0.6), envMapIntensity: 1.4 }));
    sea.rotation.x = -Math.PI / 2;
    sea.position.set(map.w / 2, -18, map.h + 2040);
    grp.add(sea);
    R.dyn.water = wn;
    const wall = new T.Mesh(new T.BoxGeometry(map.w + 1800, 30, 40), new T.MeshStandardMaterial({ color: 0xcdb98e, roughness: 0.8 }));
    wall.position.set(map.w / 2, -3, map.h + 20);
    wall.receiveShadow = true;
    grp.add(wall);
    const rail = new T.Mesh(new T.BoxGeometry(map.w + 1800, 4, 4), new T.MeshStandardMaterial({ color: GOLD, metalness: 0.9, roughness: 0.3 }));
    rail.position.set(map.w / 2, 20, map.h + 36);
    grp.add(rail);
    const hex = R.loc('hexpuertas');
    const brass = new T.MeshStandardMaterial({ color: GOLD, metalness: 0.9, roughness: 0.25 });
    if (hex) {
      const gate = new T.Group();
      const ring = new T.Mesh(new T.TorusGeometry(170, 18, 16, 72), brass);
      const inner = new T.Mesh(new T.TorusGeometry(150, 6, 8, 72), new T.MeshBasicMaterial({ color: hdr(0x7fd0ff, 3) }));
      const portal = new T.Mesh(new T.CircleGeometry(148, 48), new T.MeshBasicMaterial({ color: 0x3fa9f5, transparent: true, opacity: 0.25, blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide }));
      gate.add(ring, inner, portal);
      for (let k = 0; k < 12; k++) {
        const a = (k / 12) * Math.PI * 2;
        const tooth = new T.Mesh(new T.BoxGeometry(20, 30, 26), brass);
        tooth.position.set(Math.cos(a) * 190, Math.sin(a) * 190, 0);
        tooth.rotation.z = a;
        gate.add(tooth);
      }
      for (const sx of [-1, 1]) {
        const pillar = new T.Mesh(new T.BoxGeometry(40, 260, 40), brass);
        pillar.position.set(sx * 190, -40, 0);
        gate.add(pillar);
      }
      gate.position.set(hex.x, 150, map.h + 60);
      grp.add(gate);
      R.dyn.portal = portal;
      R.dyn.gateRing = inner;
      R.dyn.spots.push({ x: hex.x, y: 150, z: map.h + 60, c: 0x7fd0ff, k: 2 });
    }
    const br = R.loc('puente');
    if (br) {
      const deck = new T.Mesh(new T.BoxGeometry(110, 10, 900), brass);
      deck.position.set(br.x, -6, map.h + 450);
      deck.receiveShadow = true;
      grp.add(deck);
      for (let i = 0; i < 4; i++) {
        const arch = new T.Mesh(new T.TorusGeometry(80, 8, 8, 24, Math.PI), brass);
        arch.position.set(br.x, -10, map.h + 120 + i * 220);
        arch.rotation.y = Math.PI / 2;
        arch.rotation.z = Math.PI;
        grp.add(arch);
      }
    }

    // Dirigibles que cruzan el cielo
    R.dyn.airships = [];
    const shipMat = cutaway(new T.MeshStandardMaterial({ color: 0xeee2c8, roughness: 0.6 }));
    const stripeMat = new T.MeshStandardMaterial({ color: 0x2f6f7a, roughness: 0.6 });
    for (let i = 0; i < 4; i++) {
      const s = new T.Group();
      const body = new T.Mesh(new T.SphereGeometry(70, 24, 14), shipMat);
      body.scale.set(1.6, 0.6, 0.6);
      const band = new T.Mesh(new T.CylinderGeometry(43, 43, 14, 24, 1, true), stripeMat);
      band.rotation.z = Math.PI / 2;
      const gon = new T.Mesh(new T.BoxGeometry(60, 18, 24), brass);
      gon.position.y = -48;
      const fin = new T.Mesh(new T.BoxGeometry(30, 50, 4), brass);
      fin.position.set(-105, 0, 0);
      const fin2 = new T.Mesh(new T.BoxGeometry(30, 4, 50), brass);
      fin2.position.set(-105, 0, 0);
      const prop = new T.Mesh(new T.BoxGeometry(2, 34, 4), brass);
      prop.position.set(-120, 0, 0);
      s.add(body, band, gon, fin, fin2, prop);
      s.traverse((m) => { m.castShadow = true; });
      grp.add(s);
      R.dyn.airships.push({ s, prop, ph: i * 1.7, rad: 700 + i * 260, y: 430 + i * 45, sp: 0.02 + i * 0.006 });
    }

    // Gaviotas que planean en círculos
    R.dyn.birds = [];
    const birdGeo = new T.BufferGeometry();
    birdGeo.setAttribute('position', new T.Float32BufferAttribute([0, 0, -2, -9, 1.5, 2, 0, 0, 2, 0, 0, -2, 0, 0, 2, 9, 1.5, 2], 3));
    birdGeo.computeVertexNormals();
    const birdMat = new T.MeshBasicMaterial({ color: 0xfff4e0, side: T.DoubleSide });
    for (let i = 0; i < 14; i++) {
      const b = new T.Mesh(birdGeo.clone(), birdMat);
      grp.add(b);
      R.dyn.birds.push({ b, ph: r() * 7, rad: 120 + r() * 260, y: 260 + r() * 120, sp: 0.25 + r() * 0.2, cx: r() * map.w, cz: map.h * (0.4 + r() * 0.8) });
    }
    return grp;
  }

  function buildZaun(map, R) {
    const grp = new T.Group();
    const r = rng(map.def.seed * 17);
    const fac = facadeTex(true, 33);
    const wallMat = cutaway(new T.MeshStandardMaterial({ map: fac.map, emissiveMap: fac.glow, emissive: 0xffffff, emissiveIntensity: 2.2, vertexColors: true, roughness: 0.82, metalness: 0.2, envMapIntensity: 0.8 }));
    const metalMat = cutaway(new T.MeshStandardMaterial({ vertexColors: true, metalness: 0.7, roughness: 0.5, envMapIntensity: 1.1 }));
    const walls = [];
    const metal = [];
    const cables = [];
    const bulbs = [];
    const bulbCol = [];
    R.dyn.neon = [];
    R.dyn.chimneys = [];
    // Tonos de la ciudad baja: más claros que los del mapa 2D para que la luz se note.
    const BODY = [0xc8b4a0, 0xa8b4b4, 0xa4b09a, 0xc8a68c, 0xb0a4b8, 0x9cb0ac];
    const rust = [0x6a3a22, 0x3a3a3a, 0x4a4a3a, 0x7a4a2a];
    const AWN = [0x1f6a5a, 0x7a2050, 0x6a5a1a, 0x2a3a6a];
    const signMats = {};
    const neonMats = {};
    const neonMat = (c) => (neonMats[c] ||= new T.MeshBasicMaterial({ color: hdr(c, 3.2) }));
    const signMat = (word, c) => {
      const key = `${word}|${c}`;
      if (!signMats[key]) {
        const col = new T.Color(c);
        const tex = signTex(word, col.toArray().map((v) => Math.round(v * 255)).join(','));
        signMats[key] = { m: new T.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, color: hdr(0xffffff, 2.6), side: T.DoubleSide }), aspect: tex.image.width / tex.image.height };
      }
      return signMats[key];
    };
    const tops = [];
    for (const b of map.buildings) {
      const x = b.x + b.w / 2;
      const z = b.y + b.h / 2;
      const h = 45 + b.tall * 140;
      const body = BODY[Math.floor(r() * BODY.length)];
      walls.push({ geo: facadeBox(b.w, h, b.h, 110).translate(x, h / 2, z), color: body, ao: [0.4, 60] });
      metal.push({ geo: box(b.w + 10, 4, b.h + 10).translate(x, h + 2, z), color: rust[Math.floor(r() * 4)] });
      let top = h;
      // Pisos añadidos a mano, descolocados, encima de otros (con tejado de chapa inclinado)
      if (b.style < 0.6) {
        const w2 = b.w * (0.5 + r() * 0.3);
        const d2 = b.h * (0.5 + r() * 0.3);
        const h2 = 30 + r() * 70;
        const ox = (r() - 0.5) * (b.w - w2);
        const oz = (r() - 0.5) * (b.h - d2);
        walls.push({ geo: facadeBox(w2, h2, d2, 110).translate(x + ox, h + h2 / 2, z + oz), color: BODY[Math.floor(r() * BODY.length)] });
        metal.push({ geo: box(w2 + 14, 3, d2 + 14).rotateZ((r() - 0.5) * 0.35).translate(x + ox, h + h2 + 3, z + oz), color: rust[Math.floor(r() * 4)] });
        top = h + h2;
      }
      tops.push({ x, z, h, w: b.w, d: b.h });
      if (b.style > 0.8) {
        // Depósito de agua sobre patas
        metal.push({ geo: new T.CylinderGeometry(14, 14, 26, 12).translate(x - b.w * 0.2, top + 30, z), color: 0x5a3a2a });
        metal.push({ geo: new T.ConeGeometry(15, 8, 12).translate(x - b.w * 0.2, top + 47, z), color: 0x3a2a20 });
        for (const [lx, lz] of [[-9, -9], [9, -9], [-9, 9], [9, 9]]) metal.push({ geo: box(2, 18, 2).translate(x - b.w * 0.2 + lx, top + 9, z + lz), color: 0x2a2a2a });
      }
      if (b.chimney) {
        const cx = x + b.w / 2 - 14;
        const ch = 50 + r() * 70;
        metal.push({ geo: new T.CylinderGeometry(6, 9, ch, 10).translate(cx, top + ch / 2, z - b.h / 4), color: 0x2a2a30 });
        metal.push({ geo: new T.CylinderGeometry(9, 9, 4, 10).translate(cx, top + ch * 0.7, z - b.h / 4), color: 0x7a4a2a });
        R.dyn.chimneys.push([cx, top + ch, z - b.h / 4]);
      }
      const sides = [[0, 1], [1, 0], [0, -1], [-1, 0]];
      // Tuberías verticales pegadas a la fachada
      if (r() < 0.6) {
        const [nx, nz] = sides[Math.floor(r() * 4)];
        const along = (r() - 0.5) * (nx ? b.h : b.w) * 0.7;
        const px = x + nx * (b.w / 2 + 3) + (nz ? along : 0);
        const pz = z + nz * (b.h / 2 + 3) + (nx ? along : 0);
        metal.push({ geo: new T.CylinderGeometry(2.6, 2.6, h, 8).translate(px, h / 2, pz), color: r() < 0.5 ? 0x4a7a5a : 0x8a5a32 });
        for (let y = 20; y < h; y += 30) metal.push({ geo: box(7, 2, 7).translate(px, y, pz), color: 0x2a2a2a });
      }
      // Toldos sobre los bajos
      if (r() < 0.45) {
        const [nx, nz] = sides[Math.floor(r() * 4)];
        const len = (nx ? b.h : b.w) * 0.6;
        const g = box(nx ? 14 : len, 1.5, nx ? len : 14);
        if (nx) g.rotateZ(-nx * 0.35); else g.rotateX(nz * 0.35);
        metal.push({ geo: g.translate(x + nx * (b.w / 2 + 6), 22, z + nz * (b.h / 2 + 6)), color: AWN[Math.floor(r() * AWN.length)] });
      }
      // Balcones de rejilla y aparatos colgados
      if (r() < 0.5) {
        const [nx, nz] = sides[Math.floor(r() * 4)];
        const len = (nx ? b.h : b.w) * 0.55;
        const y = h * (0.45 + r() * 0.3);
        metal.push({ geo: box(nx ? 10 : len, 2, nx ? len : 10).translate(x + nx * (b.w / 2 + 5), y, z + nz * (b.h / 2 + 5)), color: 0x3a3a3a });
        metal.push({ geo: box(nx ? 1 : len, 7, nx ? len : 1).translate(x + nx * (b.w / 2 + 10), y + 4, z + nz * (b.h / 2 + 10)), color: 0x2a2a2a });
        metal.push({ geo: box(nx ? 6 : 10, 8, nx ? 10 : 6).translate(x + nx * (b.w / 2 + 3) + nz * len * 0.3, y + 24, z + nz * (b.h / 2 + 3) + nx * len * 0.3), color: 0x6a6a62 });
      }
      if (b.sign) {
        // Letrero de neón con texto, en una de las fachadas
        const c = b.roof;
        const [sx, sz] = sides[Math.floor(r() * 4)];
        const y = h * (0.45 + r() * 0.4);
        const vertical = r() < 0.4;
        const word = SIGNS[Math.floor(r() * SIGNS.length)];
        const sm = signMat(word, c);
        const sh = vertical ? 24 : 20 + r() * 8;
        const sw = sh * sm.aspect;
        const n = new T.Mesh(new T.PlaneGeometry(sw, sh), sm.m);
        if (vertical) {
          // Banderola que sale de la pared, perpendicular a ella
          n.rotation.y = Math.atan2(sx, sz) + Math.PI / 2;
          n.rotation.z = Math.PI / 2;
          n.position.set(x + (sx * b.w) / 2 + sx * (sh / 2 + 2), y, z + (sz * b.h) / 2 + sz * (sh / 2 + 2));
        } else {
          n.rotation.y = Math.atan2(sx, sz);
          n.position.set(x + (sx * b.w) / 2 + sx * 2.5, y, z + (sz * b.h) / 2 + sz * 2.5);
        }
        grp.add(n);
        const halo = glowSprite(R.tex.glow(c), Math.max(70, sw * 1.6), 0.45);
        halo.position.copy(n.position);
        grp.add(halo);
        R.dyn.neon.push({ n, halo, ph: r() * 20, base: sm.m.color.clone() });
        R.dyn.spots.push({ x: n.position.x + sx * 25, y, z: n.position.z + sz * 25, c, k: 1.2, sign: R.dyn.neon[R.dyn.neon.length - 1] });
      } else if (r() < 0.3) {
        // Tubo de neón suelto
        const c = b.roof;
        const [sx, sz] = sides[Math.floor(r() * 4)];
        const n = new T.Mesh(box(sx ? 1.5 : b.w * 0.5, 2, sz ? 1.5 : b.h * 0.5), neonMat(c));
        n.position.set(x + (sx * b.w) / 2 + sx * 1.5, h * (0.3 + r() * 0.5), z + (sz * b.h) / 2 + sz * 1.5);
        grp.add(n);
      }
    }
    // Cables entre edificios vecinos, algunos con guirnaldas de bombillas
    for (let i = 0; i < tops.length; i++) {
      const a = tops[i];
      for (let j = i + 1; j < tops.length && j < i + 12; j++) {
        const b = tops[j];
        const dist = Math.hypot(a.x - b.x, a.z - b.z);
        if (dist < 120 || dist > 260 || r() < 0.55) continue;
        const ya = a.h * (0.6 + r() * 0.35);
        const yb = b.h * (0.6 + r() * 0.35);
        const pts = sag(new T.Vector3(a.x, ya, a.z), new T.Vector3(b.x, yb, b.z), 12 + r() * 20, 12);
        for (let k = 0; k < pts.length - 1; k++) cables.push(pts[k], pts[k + 1]);
        if (r() < 0.45) {
          const c = new T.Color([0xffc070, 0xff6fb8, 0x7affd0, 0xffe0a0][Math.floor(r() * 4)]);
          for (let k = 1; k < pts.length - 1; k++) { bulbs.push(pts[k].x, pts[k].y - 2, pts[k].z); bulbCol.push(c.r, c.g, c.b); }
        }
      }
      // Pasarelas sobre la calle entre edificios cercanos
      if (r() < 0.06 && i + 1 < tops.length) {
        const b = tops[i + 1];
        const dist = Math.hypot(a.x - b.x, a.z - b.z);
        if (dist > 90 && dist < 240) {
          const y = Math.min(a.h, b.h) * 0.7;
          const g = box(dist, 3, 14).rotateY(-Math.atan2(b.z - a.z, b.x - a.x)).translate((a.x + b.x) / 2, y, (a.z + b.z) / 2);
          metal.push({ geo: g, color: 0x4a3a2a });
          for (const s of [-1, 1]) {
            const rail = box(dist, 6, 1).translate(0, 4, s * 7).rotateY(-Math.atan2(b.z - a.z, b.x - a.x)).translate((a.x + b.x) / 2, y, (a.z + b.z) / 2);
            metal.push({ geo: rail, color: 0x2a2a2a });
          }
        }
      }
    }
    if (cables.length) grp.add(new T.LineSegments(new T.BufferGeometry().setFromPoints(cables), new T.LineBasicMaterial({ color: 0x0a0a0a })));
    if (bulbs.length) {
      const bg = new T.BufferGeometry();
      bg.setAttribute('position', new T.Float32BufferAttribute(bulbs, 3));
      bg.setAttribute('color', new T.Float32BufferAttribute(bulbCol, 3));
      const pm = new T.PointsMaterial({ size: 9, map: R.tex.glow(0xffffff), vertexColors: true, transparent: true, depthWrite: false, blending: T.AdditiveBlending, color: hdr(0xffffff, 2.5) });
      grp.add(new T.Points(bg, pm));
      R.dyn.bulbs = pm;
    }
    // Paredes del pozo: la ciudad sube en vertical hasta Piltover
    const pit = [];
    const M = 520;
    const add = (x, z, w, d) => {
      for (let k = 0; k < 3; k++) {
        const hh = 500 + r() * 600;
        pit.push({ geo: facadeBox(w * (0.8 + r() * 0.3), hh, d * (0.8 + r() * 0.3), 110).translate(x + (r() - 0.5) * 60, hh / 2 - k * 10, z + (r() - 0.5) * 60), color: 0x8a8a90, ao: [0.3, 300] });
      }
    };
    for (let x = -M; x < map.w + M; x += 220) { add(x, -M + 60, 220, 200); add(x, map.h + M - 60, 220, 200); }
    for (let z = 0; z < map.h; z += 220) { add(-M + 60, z, 200, 220); add(map.w + M - 60, z, 200, 220); }
    const wallMesh = new T.Mesh(merge([...walls, ...pit]), wallMat);
    const metalMesh = new T.Mesh(merge(metal), metalMat);
    for (const m of [wallMesh, metalMesh]) { m.castShadow = m.receiveShadow = true; grp.add(m); }
    // Las luces de Piltover allá arriba
    const goldGlow = R.tex.glow(0xffd890);
    for (let x = -M; x < map.w + M; x += 120) {
      const s = glowSprite(goldGlow, 260 + r() * 200, 0.7);
      s.position.set(x, 1200 + r() * 200, -M - 200);
      grp.add(s);
    }

    // Tuberías gigantes que cruzan por encima de las calles, con abrazaderas
    const pipeMat = cutaway(new T.MeshStandardMaterial({ color: 0x5a7a5a, metalness: 0.75, roughness: 0.4 }));
    const clampMat = cutaway(new T.MeshStandardMaterial({ color: 0x8a5a32, metalness: 0.7, roughness: 0.5 }));
    for (let i = 0; i < 7; i++) {
      const z0 = 120 + i * 330;
      const y0 = 140 + r() * 110;
      const curve = new T.CatmullRomCurve3([
        new T.Vector3(-M, y0 + 60, z0 + (r() - 0.5) * 200), new T.Vector3(map.w * 0.3, y0, z0 + (r() - 0.5) * 300),
        new T.Vector3(map.w * 0.65, y0 + 40, z0 + (r() - 0.5) * 300), new T.Vector3(map.w + M, y0 + 80, z0 + (r() - 0.5) * 200),
      ]);
      const rad = 9 + r() * 8;
      const pipe = new T.Mesh(new T.TubeGeometry(curve, 100, rad, 12, false), pipeMat);
      pipe.castShadow = true;
      grp.add(pipe);
      for (let k = 1; k < 16; k++) {
        const c = new T.Mesh(new T.TorusGeometry(rad + 1.5, 2, 6, 14), clampMat);
        const p = curve.getPointAt(k / 16);
        c.position.copy(p);
        c.lookAt(p.clone().add(curve.getTangentAt(k / 16)));
        grp.add(c);
      }
    }
    // Charcas químicas en los solares vacíos
    const chem = new T.MeshBasicMaterial({ color: hdr(0x7aff4a, 1.4), transparent: true, opacity: 0.6 });
    const chemGlow = R.tex.glow(0x7aff4a);
    R.dyn.pools = [];
    for (const lot of map.lots) {
      const p = new T.Mesh(new T.CircleGeometry(lot.size * 0.32, 28), chem);
      p.rotation.x = -Math.PI / 2;
      p.scale.set(1, 0.7 + r() * 0.5, 1);
      p.position.set(lot.x + lot.size / 2, 1.5, lot.y + lot.size / 2);
      grp.add(p);
      const g = glowSprite(chemGlow, lot.size * 1.1, 0.4);
      g.position.set(p.position.x, 20, p.position.z);
      grp.add(g);
      R.dyn.pools.push(g);
      R.dyn.spots.push({ x: p.position.x, y: 30, z: p.position.z, c: 0x7aff4a, k: 1 });
    }
    // Bajos del Puente del Progreso, que sube hacia Piltover
    const br = R.loc('puente-zaun');
    if (br) {
      const deck = new T.Mesh(new T.BoxGeometry(110, 12, 1400), new T.MeshStandardMaterial({ color: 0x8a6a42, metalness: 0.5, roughness: 0.5 }));
      deck.position.set(br.x, 650, -500);
      deck.rotation.x = -0.55;
      grp.add(deck);
    }
    // Rayos de luz que caen de Piltover entre las rendijas
    const shaftTex = canvasTex(64, 256, (g) => {
      const v = g.createLinearGradient(0, 0, 0, 256);
      v.addColorStop(0, 'rgba(255,240,200,0)'); v.addColorStop(0.25, 'rgba(255,240,200,0.6)'); v.addColorStop(1, 'rgba(255,240,200,0)');
      g.fillStyle = v;
      g.fillRect(0, 0, 64, 256);
      g.globalCompositeOperation = 'destination-in';
      const hz = g.createLinearGradient(0, 0, 64, 0);
      hz.addColorStop(0, 'rgba(0,0,0,0)'); hz.addColorStop(0.5, 'rgba(0,0,0,1)'); hz.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = hz;
      g.fillRect(0, 0, 64, 256);
    });
    R.dyn.shafts = [];
    const shaftMat = new T.MeshBasicMaterial({ map: shaftTex, color: 0xcff8e0, transparent: true, opacity: 0.16, blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide, fog: false });
    for (let i = 0; i < 9; i++) {
      const s = new T.Group();
      for (let k = 0; k < 2; k++) {
        const p = new T.Mesh(new T.PlaneGeometry(90 + r() * 70, 900), shaftMat);
        p.rotation.y = (k * Math.PI) / 2;
        s.add(p);
      }
      s.position.set(r() * map.w, 420, r() * map.h);
      s.rotation.z = (r() - 0.5) * 0.25;
      grp.add(s);
      R.dyn.shafts.push({ s, ph: r() * 6 });
    }
    // Niebla química en capas a ras de suelo, que se mueve despacio
    const fogTex = noiseTex(256, 41, 5, 4, (v) => Math.max(0, Math.min(1, (v - 0.35) * 2.4)));
    R.dyn.fog = [];
    for (const [y, op, col, sc] of [[6, 0.4, 0x3a7a66, 3], [26, 0.24, 0x4a9080, 2.2], [60, 0.12, 0x8ac0b0, 1.6]]) {
      const mat = new T.ShaderMaterial({
        transparent: true, depthWrite: false, fog: false,
        uniforms: { tNoise: { value: fogTex }, uTime: { value: 0 }, uCol: { value: new T.Color(col) }, uOp: { value: op }, uScale: { value: sc }, uSpeed: { value: 0.004 + y * 0.0001 } },
        vertexShader: 'varying vec2 vUv; varying vec3 vW; void main(){ vUv = uv; vec4 w = modelMatrix * vec4(position,1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }',
        fragmentShader: `uniform sampler2D tNoise; uniform float uTime; uniform vec3 uCol; uniform float uOp; uniform float uScale; uniform float uSpeed; varying vec2 vUv; varying vec3 vW;
          void main(){
            float a = texture2D(tNoise, vUv * uScale + vec2(uTime * uSpeed, uTime * uSpeed * 0.6)).r;
            float b = texture2D(tNoise, vUv * uScale * 2.3 - vec2(uTime * uSpeed * 0.7, uTime * uSpeed * 1.3)).r;
            float d = a * 0.65 + b * 0.35;
            float near = smoothstep(80.0, 260.0, distance(cameraPosition, vW));
            gl_FragColor = vec4(uCol, d * uOp * near);
          }`,
      });
      const p = new T.Mesh(new T.PlaneGeometry(map.w + 1200, map.h + 1200), mat);
      p.rotation.x = -Math.PI / 2;
      p.position.set(map.w / 2, y, map.h / 2);
      p.renderOrder = 2;
      grp.add(p);
      R.dyn.fog.push(mat);
    }
    // Humo de las chimeneas
    R.dyn.smoke = [];
    const smoke = smokeTex();
    for (let i = 0; i < 60; i++) {
      const s = new T.Sprite(new T.SpriteMaterial({ map: smoke, transparent: true, depthWrite: false, opacity: 0, color: 0x9ab8a8 }));
      s.visible = false;
      grp.add(s);
      R.dyn.smoke.push({ s, life: 0 });
    }
    return grp;
  }

  // Elementos comunes: lugares, farolas y cristales hextec.
  function buildCommon(map, R, grp) {
    const zaun = map.id === 'zaun';
    const r = rng(map.def.seed + 5);
    // Farolas en los cruces: poste, brazo y farol (dorado en Piltover, verde y ámbar en Zaun)
    const posts = [];
    const lampsGlass = [];
    R.dyn.lamps = [];
    for (let x = map.BLOCK; x < map.w; x += map.BLOCK) {
      for (let y = map.BLOCK; y < map.h; y += map.BLOCK) {
        if ((x / map.BLOCK + y / map.BLOCK) % 2) continue;
        const px = x + map.STREET / 2 - 6;
        const pz = y + map.STREET / 2 - 6;
        const col = zaun ? (r() < 0.6 ? 0x8fdf3a : 0xffa040) : 0xffd27a;
        posts.push({ geo: new T.CylinderGeometry(5, 6, 6, 8).translate(px, 3, pz), color: zaun ? 0x1a1a20 : 0x5a4a22 });
        posts.push({ geo: new T.CylinderGeometry(2, 3.2, 60, 8).translate(px, 33, pz), color: zaun ? 0x22222a : 0x6a5a2a });
        posts.push({ geo: box(14, 2, 2).translate(px - 6, 62, pz), color: zaun ? 0x22222a : 0x6a5a2a });
        posts.push({ geo: new T.ConeGeometry(6, 5, 6).translate(px - 12, 66, pz), color: zaun ? 0x22222a : 0x6a5a2a });
        lampsGlass.push({ geo: new T.CylinderGeometry(4, 3, 9, 6).translate(px - 12, 59, pz), color: col });
        const s = glowSprite(R.tex.glow(col), 80);
        s.position.set(px - 12, 59, pz);
        grp.add(s);
        R.dyn.lamps.push({ s, ph: r() * 10 });
        R.dyn.spots.push({ x: px - 12, y: 59, z: pz, c: col, k: zaun ? 0.8 : 0.6 });
      }
    }
    const pm = new T.Mesh(merge(posts), new T.MeshStandardMaterial({ vertexColors: true, metalness: 0.7, roughness: 0.4 }));
    pm.castShadow = true;
    grp.add(pm);
    const gm = new T.Mesh(merge(lampsGlass), new T.MeshBasicMaterial({ vertexColors: true, color: hdr(0xffffff, 2.4) }));
    grp.add(gm);

    // Anillos de los lugares y haz de luz del objetivo
    R.dyn.rings = {};
    const ringCol = zaun ? 0x3fbf9f : 0xe3c45a;
    for (const l of map.def.locations) {
      const ring = new T.Mesh(new T.RingGeometry(88, 100, 64), new T.MeshBasicMaterial({ color: ringCol, transparent: true, opacity: 0.55, blending: T.AdditiveBlending, depthWrite: false }));
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(l.x, 2, l.y);
      grp.add(ring);
      R.dyn.rings[l.id] = ring;
    }
    const beamTex = canvasTex(4, 128, (g) => {
      const grd = g.createLinearGradient(0, 0, 0, 128);
      grd.addColorStop(0, 'rgba(255,224,138,0)');
      grd.addColorStop(1, 'rgba(255,224,138,0.8)');
      g.fillStyle = grd;
      g.fillRect(0, 0, 4, 128);
    });
    R.dyn.beam = new T.Mesh(new T.CylinderGeometry(55, 70, 900, 24, 1, true), new T.MeshBasicMaterial({ map: beamTex, transparent: true, blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide }));
    R.dyn.beam.visible = false;
    grp.add(R.dyn.beam);

    // Cristales hextec (fragmentos del Códice)
    R.dyn.crystals = [];
    const gemMat = new T.MeshStandardMaterial({ color: 0x7fd0ff, emissive: 0x3fa9f5, emissiveIntensity: 2.6, roughness: 0.1, metalness: 0.2 });
    const frameMat = new T.MeshStandardMaterial({ color: 0xe3c45a, metalness: 0.9, roughness: 0.22 });
    const glow = R.tex.glow(0x5ab8ff);
    for (const f of map.def.fragments) {
      const c = new T.Group();
      const gem = new T.Mesh(new T.OctahedronGeometry(13), gemMat);
      gem.scale.set(1, 1.6, 1);
      const ring = new T.Mesh(new T.TorusGeometry(24, 2.2, 6, 6), frameMat);
      const halo = glowSprite(glow, 120, 0.9);
      c.add(gem, ring, halo);
      c.position.set(f.x, 42, f.y);
      grp.add(c);
      R.dyn.crystals.push({ f, c, gem, ring });
    }
  }

  // ---------- Fondo panorámico con las ilustraciones de Universe ----------
  // Las imágenes forman un anillo lejano alrededor de la ciudad: al girar la cámara o al
  // llegar a la ciudad (la cámara baja desde el horizonte) se ven moverse con paralaje.
  const BACKDROP_FALLBACK = {
    piltover: ['piltover', 'academia', 'consejo', 'taller-jayce', 'stillwater', 'hexpuertas'].map((id) => `img/arte/lugares/${id}.webp`),
    zaun: ['zaun', 'ultima-gota', 'comuna-viktor'].map((id) => `img/arte/lugares/${id}.webp`),
  };
  let edgeAlpha = null;
  async function backdropImages(id) {
    const api = window.arcane?.art;
    if (api?.mapImages) {
      try {
        let r = await api.mapImages(id);
        if (!r.own && api.universe) {
          // Primera visita: bajamos las ilustraciones de la página de la región.
          const d = await api.universe(id).catch(() => null);
          if (d?.ok) r = await api.mapImages(id);
        }
        if (r.images.length) return r.images;
      } catch { /* sin imágenes */ }
    }
    return BACKDROP_FALLBACK[id] || [];
  }

  function buildBackdrop(map, grp) {
    const ring = new T.Group();
    ring.position.set(map.w / 2, 0, map.h / 2);
    grp.add(ring);
    R.backdrops[map.id] = () => { ring.clear(); fillBackdrop(map, ring); };
    fillBackdrop(map, ring);
  }

  function fillBackdrop(map, ring) {
    const zaun = map.id === 'zaun';
    edgeAlpha ||= canvasTex(256, 256, (g) => {
      const h = g.createLinearGradient(0, 0, 256, 0);
      h.addColorStop(0, '#000'); h.addColorStop(0.12, '#fff'); h.addColorStop(0.88, '#fff'); h.addColorStop(1, '#000');
      g.fillStyle = h;
      g.fillRect(0, 0, 256, 256);
      g.globalCompositeOperation = 'multiply';
      const v = g.createLinearGradient(0, 0, 0, 256);
      v.addColorStop(0, '#000'); v.addColorStop(0.15, '#fff'); v.addColorStop(0.8, '#fff'); v.addColorStop(1, '#000');
      g.fillStyle = v;
      g.fillRect(0, 0, 256, 256);
    });
    backdropImages(map.id).then((urls) => {
      if (!urls.length) return;
      const loader = new T.TextureLoader();
      const RAD = 4300;
      const H = 2300;
      const slots = 7;
      for (let i = 0; i < slots; i++) {
        const url = urls[i % urls.length];
        loader.load(url, (tex) => {
          tex.colorSpace = T.SRGBColorSpace;
          const aspect = tex.image.width / tex.image.height || 1.8;
          const arc = Math.min((Math.PI * 2) / slots * 1.15, (H * aspect) / RAD);
          const geo = new T.CylinderGeometry(RAD, RAD, H, 48, 1, true, (i / slots) * Math.PI * 2 - arc / 2, arc);
          const mat = new T.MeshBasicMaterial({ map: tex, alphaMap: edgeAlpha, transparent: true, side: T.BackSide, fog: false, depthWrite: false, color: zaun ? 0x9fc8b8 : 0xfff0dc });
          const m = new T.Mesh(geo, mat);
          m.position.y = H / 2 - (zaun ? 100 : 380);
          m.renderOrder = -1;
          ring.add(m);
        }, undefined, () => {});
      }
    });
  }

  // ---------- Posprocesado ----------
  // Escena en HDR → resplandor (brillos difuminados a media y cuarta resolución) → mezcla con
  // tono fílmico, gradación de color de cada ciudad, viñeta, grano y textura de lienzo.
  const FSQ_VS = 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }';
  function createPost(renderer) {
    if (!renderer.capabilities.isWebGL2) return null;
    const type = T.HalfFloatType;
    const rt = (opts = {}) => new T.WebGLRenderTarget(1, 1, { type, depthBuffer: false, ...opts });
    const P = {
      main: new T.WebGLRenderTarget(1, 1, { type, samples: LOW ? 0 : 4 }),
      a1: rt(), b1: rt(), a2: rt(), b2: rt(),
      cam: new T.OrthographicCamera(-1, 1, 1, -1, 0, 1),
      scene: new T.Scene(),
      quad: null,
    };
    P.bright = new T.ShaderMaterial({
      uniforms: { tDiffuse: { value: null }, uThr: { value: 1 } }, vertexShader: FSQ_VS, depthTest: false, depthWrite: false,
      fragmentShader: 'uniform sampler2D tDiffuse; uniform float uThr; varying vec2 vUv; void main(){ vec3 c = texture2D(tDiffuse, vUv).rgb; float l = max(c.r, max(c.g, c.b)); gl_FragColor = vec4(c * smoothstep(uThr, uThr * 1.6 + 0.25, l), 1.0); }',
    });
    P.blur = new T.ShaderMaterial({
      uniforms: { tDiffuse: { value: null }, uDir: { value: new T.Vector2() } }, vertexShader: FSQ_VS, depthTest: false, depthWrite: false,
      fragmentShader: `uniform sampler2D tDiffuse; uniform vec2 uDir; varying vec2 vUv;
        void main(){
          vec3 c = texture2D(tDiffuse, vUv).rgb * 0.2270270270;
          c += texture2D(tDiffuse, vUv + uDir * 1.3846153846).rgb * 0.3162162162;
          c += texture2D(tDiffuse, vUv - uDir * 1.3846153846).rgb * 0.3162162162;
          c += texture2D(tDiffuse, vUv + uDir * 3.2307692308).rgb * 0.0702702703;
          c += texture2D(tDiffuse, vUv - uDir * 3.2307692308).rgb * 0.0702702703;
          gl_FragColor = vec4(c, 1.0);
        }`,
    });
    const paper = noiseTex(256, 77, 5, 8);
    P.comp = new T.ShaderMaterial({
      uniforms: {
        tScene: { value: null }, tB1: { value: null }, tB2: { value: null }, tPaper: { value: paper },
        uBloom: { value: 0.6 }, uExposure: { value: 1 }, uTime: { value: 0 }, uSat: { value: 1 }, uContrast: { value: 1 }, uVig: { value: 0.6 },
        uShadow: { value: new T.Vector3(1, 1, 1) }, uHigh: { value: new T.Vector3(1, 1, 1) }, uRes: { value: new T.Vector2(1, 1) },
      },
      vertexShader: FSQ_VS, depthTest: false, depthWrite: false,
      fragmentShader: `uniform sampler2D tScene; uniform sampler2D tB1; uniform sampler2D tB2; uniform sampler2D tPaper;
        uniform float uBloom; uniform float uExposure; uniform float uTime; uniform float uSat; uniform float uContrast; uniform float uVig;
        uniform vec3 uShadow; uniform vec3 uHigh; uniform vec2 uRes; varying vec2 vUv;
        vec3 aces(vec3 color){
          const mat3 IM = mat3(vec3(0.59719, 0.07600, 0.02840), vec3(0.35458, 0.90834, 0.13383), vec3(0.04823, 0.01566, 0.83777));
          const mat3 OM = mat3(vec3(1.60475, -0.10208, -0.00327), vec3(-0.53108, 1.10813, -0.07276), vec3(-0.07367, -0.00605, 1.07602));
          color *= uExposure / 0.6;
          color = IM * color;
          vec3 a = color * (color + 0.0245786) - 0.000090537;
          vec3 b = color * (0.983729 * color + 0.4329510) + 0.238081;
          return clamp(OM * (a / b), 0.0, 1.0);
        }
        vec3 srgb(vec3 c){ return mix(c * 12.92, pow(c, vec3(1.0 / 2.4)) * 1.055 - 0.055, step(0.0031308, c)); }
        void main(){
          vec3 c = texture2D(tScene, vUv).rgb;
          vec3 bl = texture2D(tB1, vUv).rgb * 0.55 + texture2D(tB2, vUv).rgb;
          c += bl * uBloom;
          c = aces(c);
          float l = dot(c, vec3(0.2126, 0.7152, 0.0722));
          c *= mix(uShadow, uHigh, smoothstep(0.05, 0.8, l));
          c = mix(vec3(l), c, uSat);
          c = clamp((c - 0.5) * uContrast + 0.5, 0.0, 1.0);
          vec2 d = vUv - 0.5;
          c *= 1.0 - uVig * dot(d, d) * 1.6;
          c = srgb(clamp(c, 0.0, 1.0));
          // Textura de lienzo pintado y algo de grano
          float p = texture2D(tPaper, gl_FragCoord.xy / 256.0).r;
          c *= 0.96 + p * 0.08;
          c += (fract(sin(dot(gl_FragCoord.xy + uTime * 61.0, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * 0.025;
          gl_FragColor = vec4(c, 1.0);
        }`,
    });
    P.quad = new T.Mesh(new T.PlaneGeometry(2, 2), P.comp);
    P.quad.frustumCulled = false;
    P.scene.add(P.quad);
    P.size = (w, h) => {
      const pr = Math.min(LOW ? 1 : 1.5, window.devicePixelRatio || 1);
      const W = Math.max(1, Math.round(w * pr));
      const H = Math.max(1, Math.round(h * pr));
      P.main.setSize(W, H);
      P.a1.setSize(W >> 1, H >> 1); P.b1.setSize(W >> 1, H >> 1);
      P.a2.setSize(W >> 2, H >> 2); P.b2.setSize(W >> 2, H >> 2);
      P.w = W; P.h = H;
    };
    const pass = (mat, src, dst) => {
      P.quad.material = mat;
      if (mat.uniforms.tDiffuse) mat.uniforms.tDiffuse.value = src && src.texture;
      renderer.setRenderTarget(dst);
      renderer.render(P.scene, P.cam);
    };
    const blur = (src, tmp, sx, sy) => {
      P.blur.uniforms.uDir.value.set(1.4 / sx, 0); pass(P.blur, src, tmp);
      P.blur.uniforms.uDir.value.set(0, 1.4 / sy); pass(P.blur, tmp, src);
    };
    P.render = (scene, camera, L, t) => {
      renderer.setRenderTarget(P.main);
      renderer.render(scene, camera);
      P.bright.uniforms.uThr.value = L.thr;
      pass(P.bright, P.main, P.a1);
      blur(P.a1, P.b1, P.w >> 1, P.h >> 1);
      pass(P.blur, P.a1, P.a2); // copia (con un poco de difuminado) a un cuarto de resolución
      blur(P.a2, P.b2, P.w >> 2, P.h >> 2);
      blur(P.a2, P.b2, P.w >> 2, P.h >> 2);
      const U2 = P.comp.uniforms;
      U2.tScene.value = P.main.texture;
      U2.tB1.value = P.a1.texture;
      U2.tB2.value = P.a2.texture;
      U2.uBloom.value = L.bloom;
      U2.uExposure.value = L.exposure;
      U2.uTime.value = t % 100;
      U2.uSat.value = L.sat;
      U2.uContrast.value = L.contrast;
      U2.uVig.value = L.vig;
      U2.uShadow.value.fromArray(L.grade[0]);
      U2.uHigh.value.fromArray(L.grade[1]);
      P.quad.material = P.comp;
      renderer.setRenderTarget(null);
      renderer.render(P.scene, P.cam);
    };
    return P;
  }

  // Entorno para los reflejos (oro, cobre, charcos): un cielo con manchas de luz de colores.
  function makeEnv(L) {
    const pm = new T.PMREMGenerator(R.renderer);
    const sc = new T.Scene();
    sc.add(new T.Mesh(new T.SphereGeometry(100, 32, 16), new T.ShaderMaterial({
      side: T.BackSide,
      uniforms: { top: { value: new T.Color(L.env.top) }, mid: { value: new T.Color(L.env.mid) }, bot: { value: new T.Color(L.env.bot) } },
      vertexShader: 'varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader: 'uniform vec3 top; uniform vec3 mid; uniform vec3 bot; varying vec3 vP; void main(){ float h = normalize(vP).y; vec3 c = h > 0.0 ? mix(mid, top, smoothstep(0.0, 0.6, h)) : mix(mid, bot, smoothstep(0.0, -0.25, h)); gl_FragColor = vec4(c, 1.0); }',
    })));
    for (const [c, k, dir, size] of L.env.blobs) {
      const m = new T.Mesh(new T.SphereGeometry(100 * size, 16, 8), new T.MeshBasicMaterial({ color: hdr(c, k) }));
      m.position.set(...dir).normalize().multiplyScalar(80);
      sc.add(m);
    }
    const rt = pm.fromScene(sc, 0.02);
    pm.dispose();
    return rt.texture;
  }

  // ---------- Renderizador ----------
  let R = null;

  function create() {
    const canvas = document.createElement('canvas');
    canvas.className = 'world-3d';
    let renderer;
    try {
      renderer = new T.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
    } catch {
      return null;
    }
    renderer.setPixelRatio(Math.min(1.5, window.devicePixelRatio || 1));
    renderer.toneMapping = T.ACESFilmicToneMapping;
    renderer.outputColorSpace = T.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = T.PCFSoftShadowMap;
    let post = null;
    try { post = createPost(renderer); } catch { post = null; }
    const scene = new T.Scene();
    const camera = new T.PerspectiveCamera(42, 16 / 9, 5, 9000);

    const sky = new T.Mesh(new T.SphereGeometry(6000, 32, 16), new T.ShaderMaterial({
      side: T.BackSide, depthWrite: false, fog: false,
      uniforms: { top: { value: new T.Color() }, mid: { value: new T.Color() }, bot: { value: new T.Color() }, sunDir: { value: new T.Vector3(0, 1, 0) }, sunCol: { value: new T.Color() } },
      vertexShader: 'varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader: `uniform vec3 top; uniform vec3 mid; uniform vec3 bot; uniform vec3 sunDir; uniform vec3 sunCol; varying vec3 vP;
        void main(){
          vec3 n = normalize(vP);
          float h = n.y;
          vec3 c = h > 0.0 ? mix(mid, top, smoothstep(0.0, 0.5, h)) : mix(mid, bot, smoothstep(0.0, -0.3, h));
          float s = max(0.0, dot(n, normalize(sunDir)));
          c += sunCol * (pow(s, 600.0) * 6.0 + pow(s, 12.0) * 0.35);
          gl_FragColor = vec4(c, 1.0);
        }`,
    }));
    scene.add(sky);
    const hemi = new T.HemisphereLight();
    const sun = new T.DirectionalLight();
    sun.castShadow = true;
    sun.shadow.mapSize.set(LOW ? 1024 : 2048, LOW ? 1024 : 2048);
    Object.assign(sun.shadow.camera, { left: -900, right: 900, top: 900, bottom: -900, near: 10, far: 4000 });
    sun.shadow.bias = -0.0006;
    sun.shadow.normalBias = 1.5;
    scene.add(hemi, sun, sun.target);
    const lantern = new T.PointLight(0xffc27a, 0, 700, 1.4);
    scene.add(lantern);
    // Luces de colores que se colocan en los neones, farolas y charcas más cercanas al jugador.
    const pool = [];
    const NL = LOW ? 4 : 8;
    for (let i = 0; i < NL; i++) {
      const l = new T.PointLight(0xffffff, 0, 300, 2);
      scene.add(l);
      pool.push(l);
    }

    // Polvo dorado o esporas que flotan alrededor del jugador
    const N = LOW ? 400 : 900;
    const dustPos = new Float32Array(N * 3);
    const dr = rng(3);
    for (let i = 0; i < N; i++) { dustPos[i * 3] = (dr() - 0.5) * 1800; dustPos[i * 3 + 1] = dr() * 420; dustPos[i * 3 + 2] = (dr() - 0.5) * 1800; }
    const dustGeo = new T.BufferGeometry();
    dustGeo.setAttribute('position', new T.BufferAttribute(dustPos, 3));
    const glowCache = {};
    const tex = { glow: (c) => (glowCache[c] ||= glowTex(new T.Color(c).toArray().map((v) => Math.round(v * 255)).join(','))) };
    const dust = new T.Points(dustGeo, new T.PointsMaterial({ size: 5, map: tex.glow(0xffffff), transparent: true, opacity: 0.85, blending: T.AdditiveBlending, depthWrite: false }));
    dust.frustumCulled = false;
    scene.add(dust);

    return {
      canvas, renderer, post, scene, camera, sky, hemi, sun, lantern, pool, dust, groups: {}, group: null, map: null, dyn: {}, backdrops: {}, envs: {},
      tex,
      loc: null,
      cam: { yaw: 0, pitch: 0.92, dist: 820, goalYaw: 0, goalPitch: 0.92, goalDist: 820, focus: new T.Vector3(), mouse: { x: 0, y: 0 } },
      host: null, w: 0, h: 0, spotT: 0,
    };
  }

  // Suelo con detalle cercano (adoquines o grava) que se repite por encima del dibujo grande.
  function groundMaterial(map) {
    const zaun = map.id === 'zaun';
    const g = groundTex(map);
    const det = detailTex(zaun);
    const mat = new T.MeshStandardMaterial({ map: g.map, roughness: zaun ? 1 : 0.92, roughnessMap: g.rough, metalness: zaun ? 0.25 : 0, envMapIntensity: zaun ? 1.4 : 0.4 });
    const rep = new T.Vector2(map.w / 40, map.h / 40);
    mat.onBeforeCompile = (sh) => {
      sh.uniforms.tDetail = { value: det };
      sh.uniforms.uRep = { value: rep };
      sh.fragmentShader = `uniform sampler2D tDetail;\nuniform vec2 uRep;\n${sh.fragmentShader.replace('#include <map_fragment>', `#include <map_fragment>
        float dt = texture2D(tDetail, vMapUv * uRep).r;
        diffuseColor.rgb *= mix(0.72, 1.18, dt);`)}`;
    };
    mat.customProgramCacheKey = () => `ground-${map.id}`;
    return mat;
  }

  function setMap(map) {
    if (!R) return;
    clearActors();
    R.map = map;
    R.loc = (id) => map.def.locations.find((l) => l.id === id);
    if (R.group) R.scene.remove(R.group);
    if (!R.groups[map.id]) {
      R.dyn = { spots: [] };
      const grp = new T.Group();
      const ground = new T.Mesh(new T.PlaneGeometry(map.w, map.h), groundMaterial(map));
      ground.rotation.x = -Math.PI / 2;
      ground.position.set(map.w / 2, 0, map.h / 2);
      ground.receiveShadow = true;
      grp.add(ground);
      const outer = new T.Mesh(new T.PlaneGeometry(map.w + 4000, map.h + 4000), new T.MeshStandardMaterial({ color: map.id === 'zaun' ? 0x0c1210 : 0x9a8462, roughness: 1 }));
      outer.rotation.x = -Math.PI / 2;
      outer.position.set(map.w / 2, -1, map.h / 2);
      outer.receiveShadow = true;
      grp.add(outer);
      grp.add(map.id === 'zaun' ? buildZaun(map, R) : buildPiltover(map, R));
      buildCommon(map, R, grp);
      buildBackdrop(map, grp);
      R.groups[map.id] = { grp, dyn: R.dyn };
    }
    R.group = R.groups[map.id].grp;
    R.dyn = R.groups[map.id].dyn;
    R.scene.add(R.group);
    const L = LOOK[map.id] || LOOK.piltover;
    R.look = L;
    const su = R.sky.material.uniforms;
    su.top.value.setHex(L.sky[0]);
    su.mid.value.setHex(L.sky[1]);
    su.bot.value.setHex(L.sky[2]);
    su.sunDir.value.fromArray(L.sunDir);
    su.sunCol.value.setHex(map.id === 'zaun' ? 0x000000 : L.sun[0]);
    R.scene.background = new T.Color(L.bg);
    R.scene.fog = new T.FogExp2(L.fog, L.fogD);
    try { R.scene.environment = R.envs[map.id] ||= makeEnv(L); } catch { R.scene.environment = null; }
    R.hemi.color.setHex(L.hemi[0]);
    R.hemi.groundColor.setHex(L.hemi[1]);
    R.hemi.intensity = L.hemi[2];
    R.sun.color.setHex(L.sun[0]);
    R.sun.intensity = L.sun[1];
    R.renderer.toneMappingExposure = L.exposure;
    R.dust.material.color.setHex(L.dust);
    R.lanternBase = L.lantern ? 60000 : 0;
    R.cam.goalPitch = R.cam.pitch = L.pitch;
    R.spotT = 0;
  }

  function resize() {
    const w = R.host.clientWidth;
    const h = R.host.clientHeight;
    if (!w || !h || (w === R.w && h === R.h)) return;
    R.w = w;
    R.h = h;
    R.renderer.setSize(w, h, false);
    R.post?.size(w, h);
    R.camera.aspect = w / h;
    R.camera.updateProjectionMatrix();
  }

  const v3 = new T.Vector3();
  const tmpC = new T.Color();

  // Reparte las luces de colores entre los puntos de luz más cercanos al jugador.
  function placeLights(fx, fz) {
    const L = R.look;
    const spots = R.dyn.spots || [];
    const n = Math.min(R.pool.length, L.lights);
    const best = [];
    for (const s of spots) {
      const d = (s.x - fx) ** 2 + (s.z - fz) ** 2;
      if (d > 900 * 900) continue;
      if (best.length < n) { best.push([d, s]); best.sort((a, b) => a[0] - b[0]); } else if (d < best[n - 1][0]) { best[n - 1] = [d, s]; best.sort((a, b) => a[0] - b[0]); }
    }
    R.pool.forEach((l, i) => {
      const s = best[i]?.[1];
      l.userData.spot = s || null;
      if (!s) { l.intensity = 0; return; }
      l.position.set(s.x, s.y + 6, s.z);
      l.color.setHex(s.c);
      l.userData.base = L.lightI * s.k;
      l.intensity = l.userData.base;
    });
  }

  function render(t, info) {
    if (!R || !R.map) return;
    resize();
    const C = R.cam;
    const s = t / 1000;
    // Suavizados independientes de los fotogramas por segundo
    const dt = Math.min(0.1, Math.max(0, s - (R.lastT ?? s)));
    R.lastT = s;
    const ease = (k) => 1 - Math.pow(1 - k, dt * 60);
    // Cámara: sigue al jugador con retardo, mira un poco hacia donde camina, se balancea
    // suavemente y responde al ratón para dar sensación de profundidad.
    C.yaw += (C.goalYaw - C.yaw) * ease(0.12);
    C.pitch += (C.goalPitch - C.pitch) * ease(0.035);
    C.dist += (C.goalDist - C.dist) * ease(0.04);
    const goal = v3.set(info.x + (info.vx || 0) * 0.35, 20, info.y + (info.vy || 0) * 0.35);
    C.focus.lerp(goal, ease(0.09));
    const yaw = C.yaw + C.mouse.x * 0.05 + Math.sin(s * 0.13) * 0.025;
    const pitch = Math.min(1.35, Math.max(0.15, C.pitch - C.mouse.y * 0.04 + Math.sin(s * 0.21) * 0.01));
    const hd = Math.cos(pitch) * C.dist;
    R.camera.position.set(C.focus.x + Math.sin(yaw) * hd, C.focus.y + Math.sin(pitch) * C.dist, C.focus.z + Math.cos(yaw) * hd);
    R.camera.lookAt(C.focus);
    R.camera.updateMatrixWorld();
    cut.uFocus.value.set(info.x, 25, info.y);
    R.sky.position.copy(R.camera.position);

    // Sol y sombras pegados al jugador
    const L = R.look;
    R.sun.position.set(C.focus.x + L.sunDir[0] * 1500, L.sunDir[1] * 1500, C.focus.z + L.sunDir[2] * 1500);
    R.sun.target.position.set(C.focus.x, 0, C.focus.z);
    // Con personajes 3D el farol va más alto (si no, quema la cabeza del jugador) y más fuerte.
    R.lantern.position.set(info.x, info.people ? 170 : 90, info.y);
    R.lantern.intensity = (R.lanternBase || 0) * (info.people ? 2.4 : 1);
    R.spotT -= dt;
    if (R.spotT <= 0) { placeLights(C.focus.x, C.focus.z); R.spotT = 0.25; }

    // Partículas alrededor del jugador
    const p = R.dust.geometry.attributes.position;
    for (let i = 0; i < p.count; i++) {
      let y = p.getY(i) + L.dustRise * dt;
      if (y > 420) y = 0;
      p.setY(i, y);
    }
    p.needsUpdate = true;
    R.dust.position.set(Math.round(C.focus.x / 300) * 300, 0, Math.round(C.focus.z / 300) * 300);
    R.dust.rotation.y = s * 0.01;

    const D = R.dyn;
    const zaun = R.map.id === 'zaun';
    for (const l of D.lamps || []) l.s.material.opacity = zaun ? (Math.sin(s * 9 + l.ph * 3) > 0.94 ? 0.25 : 0.85 + Math.sin(s * 3 + l.ph) * 0.15) : 0.8 + Math.sin(s * 0.7 + l.ph) * 0.1;
    for (const n of D.neon || []) {
      // Parpadeo de tubo viejo: casi siempre encendido, a veces tiembla o se apaga un instante
      const flick = Math.sin(s * 19 + n.ph * 3) > 0.96 ? 0.15 : Math.sin(s * 2.5 + n.ph) < -0.92 ? 0.35 : 1;
      n.n.material.color.copy(n.base).multiplyScalar(flick);
      n.halo.material.opacity = 0.45 * flick;
      n.on = flick;
    }
    for (const l of R.pool) {
      const sp = l.userData.spot;
      if (sp?.sign) l.intensity = l.userData.base * (sp.sign.on ?? 1);
      else if (sp && zaun) l.intensity = l.userData.base * (0.85 + Math.sin(s * 3 + sp.x) * 0.15);
    }
    for (const g of D.pools || []) g.material.opacity = 0.3 + Math.sin(s * 1.5 + g.position.x) * 0.1;
    for (const f of D.fog || []) f.uniforms.uTime.value = s;
    for (const sh of D.shafts || []) sh.s.children.forEach((m) => { m.material.opacity = 0.12 + Math.sin(s * 0.4 + sh.ph) * 0.05; });
    if (D.water) { D.water.offset.set(s * 0.004, s * 0.006); }
    for (const a of D.airships || []) {
      const ang = s * a.sp + a.ph;
      a.s.position.set(R.map.w / 2 + Math.cos(ang) * a.rad * 1.3, a.y + Math.sin(s * 0.5 + a.ph) * 8, R.map.h / 2 + Math.sin(ang) * a.rad);
      a.s.rotation.y = -ang - Math.PI;
      a.prop.rotation.x = s * 12;
    }
    for (const b of D.birds || []) {
      const ang = s * b.sp + b.ph;
      b.b.position.set(b.cx + Math.cos(ang) * b.rad, b.y + Math.sin(s * 0.8 + b.ph) * 10, b.cz + Math.sin(ang) * b.rad);
      b.b.rotation.y = -ang;
      b.b.scale.y = 0.4 + Math.abs(Math.sin(s * 7 + b.ph)) * 1.2;
    }
    if (D.portal) { D.portal.material.opacity = 0.2 + Math.sin(s * 2) * 0.08; D.gateRing.rotation.z = s * 0.4; }
    const codex = info.codex;
    for (const c of D.crystals || []) {
      c.c.visible = !codex.includes(c.f.codex);
      if (!c.c.visible) continue;
      c.c.position.y = 42 + Math.sin(s * 2 + c.f.x) * 5;
      c.gem.rotation.y = s * 1.2;
      c.ring.rotation.x = s * 0.8;
      c.ring.rotation.y = s * 0.5;
    }
    for (const [id, ring] of Object.entries(D.rings || {})) {
      const isObj = id === info.obj;
      ring.material.color.copy(tmpC.setHex(isObj ? 0xffe08a : zaun ? 0x3fbf9f : 0xe3c45a)).multiplyScalar(isObj ? 2 : 1);
      ring.material.opacity = isObj ? 0.6 + Math.sin(s * 4) * 0.3 : 0.4;
      ring.scale.setScalar(isObj ? 1 + Math.sin(s * 3) * 0.06 : 1);
    }
    const obj = info.obj && R.loc(info.obj);
    D.beam.visible = Boolean(obj);
    if (obj) { D.beam.position.set(obj.x, 450, obj.y); D.beam.material.opacity = 0.6 + Math.sin(s * 3) * 0.2; }
    // Humo de las chimeneas cercanas
    if (D.smoke) {
      const near = D.chimneys.filter(([x, , z]) => Math.abs(x - C.focus.x) < 1100 && Math.abs(z - C.focus.z) < 1100);
      for (const m of D.smoke) {
        if (m.life <= 0) {
          if (!near.length || Math.random() > 3 * dt) { m.s.visible = false; continue; }
          const [x, y, z] = near[Math.floor(Math.random() * near.length)];
          m.s.position.set(x, y + 5, z);
          m.life = 1;
          m.s.visible = true;
        }
        m.life -= 0.25 * dt;
        m.s.position.y += 55 * dt;
        m.s.position.x += 25 * dt;
        const k = 1 - m.life;
        m.s.scale.setScalar(30 + k * 140);
        m.s.material.opacity = Math.sin(m.life * Math.PI) * 0.5;
      }
    }
    if (info.people) syncActors(info.people, dt, s);
    if (R.post) {
      try {
        R.post.render(R.scene, R.camera, L, s);
        return;
      } catch {
        R.post = null; // si falla el posprocesado, se dibuja directo
        R.renderer.setRenderTarget(null);
      }
    }
    R.renderer.render(R.scene, R.camera);
  }

  // ---------- Personajes 3D (avatars3d.js) ----------
  // people: [{ key, id, player?, x, y, vx, vy, look? }]. Cada uno camina con su modelo y su
  // animación; se crean al aparecer y se quitan cuando ya no están en el mapa.
  function syncActors(people, dt, s) {
    const A = (R.actors ||= new Map());
    const seen = new Set();
    for (const p of people) {
      let av = A.get(p.key);
      if (!av) {
        av = window.Avatars3D.create(p);
        av.yaw = av.rest = p.yaw ?? 0;
        R.scene.add(av.holder);
        A.set(p.key, av);
      }
      seen.add(p.key);
      av.holder.position.set(p.x, 0, p.y);
      const sp = Math.hypot(p.vx || 0, p.vy || 0);
      let yaw = av.rest;
      if (sp > 8) yaw = av.rest = Math.atan2(p.vx, p.vy);
      else if (p.look) yaw = Math.atan2(p.look.x - p.x, p.look.y - p.y);
      window.Avatars3D.update(av, dt, sp, yaw, s);
    }
    for (const [k, av] of A) if (!seen.has(k)) { window.Avatars3D.dispose(av); A.delete(k); }
  }
  function clearActors() {
    if (!R?.actors) return;
    for (const av of R.actors.values()) window.Avatars3D.dispose(av);
    R.actors.clear();
  }

  // Coordenadas del mapa (x, y, altura) → píxeles de pantalla y escala (px por unidad).
  function project(x, y, h = 0) {
    v3.set(x, h, y).project(R.camera);
    if (v3.z > 1 || v3.z < -1) return null;
    const d = R.camera.position.distanceTo(new T.Vector3(x, h, y));
    const k = R.h / 2 / (Math.tan((R.camera.fov * Math.PI) / 360) * d);
    return { x: ((v3.x + 1) / 2) * R.w, y: ((1 - v3.y) / 2) * R.h, k, d };
  }

  // Píxeles de pantalla → punto del suelo en coordenadas del mapa.
  const ray = new T.Raycaster();
  const plane = new T.Plane(new T.Vector3(0, 1, 0), 0);
  function pick(sx, sy) {
    ray.setFromCamera(new T.Vector2((sx / R.w) * 2 - 1, -(sy / R.h) * 2 + 1), R.camera);
    const hit = ray.ray.intersectPlane(plane, new T.Vector3());
    return hit ? { x: hit.x, y: hit.z } : null;
  }

  window.World3D = {
    // Pone el lienzo 3D detrás del lienzo 2D del mundo.
    mount(host) {
      if (!R) R = create();
      if (!R) return false;
      if (R.host !== host) {
        host.prepend(R.canvas);
        R.host = host;
        R.w = R.h = 0;
      }
      return true;
    },
    setMap,
    // true si los personajes se dibujan en 3D (si no, world.js pinta los iconos redondos).
    get actors() { return Boolean(window.Avatars3D) && window.App?.settings?.models3d !== false; },
    // Vuelve a crear los personajes (después de cambiar de modelo o de aspecto).
    resetActors() { clearActors(); window.Avatars3D?.reload(); },
    // Vuelve a cargar los fondos (después de bajar imágenes nuevas).
    reloadBackdrops() { if (R) Object.values(R.backdrops).forEach((f) => f()); },
    render,
    project,
    pick,
    // true si la imagen pasa por el posprocesado (ya lleva viñeta propia).
    get post() { return Boolean(R?.post); },
    get yaw() { return R ? R.cam.yaw : 0; },
    get dist() { return R ? R.cam.goalDist : 0; },
    rotate(d) { R.cam.goalYaw += d; },
    tilt(d) { R.cam.goalPitch = Math.min(1.3, Math.max(0.3, R.cam.goalPitch + d)); },
    zoom(f) { R.cam.goalDist = Math.min(1600, Math.max(R.actors?.size ? 240 : 380, R.cam.goalDist * f)); },
    mouse(x, y) { if (R) { R.cam.mouse.x = x; R.cam.mouse.y = y; } },
    // Llegada a una ciudad: la cámara baja desde el horizonte hasta el jugador.
    arrive(x, y) {
      if (!R) return;
      const C = R.cam;
      C.focus.set(x, 20, y);
      C.dist = 2300;
      C.pitch = 0.22;
      C.yaw = C.goalYaw + 0.9;
    },
  };
})();
