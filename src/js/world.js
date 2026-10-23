// Mapa interactivo de Aurelia y Nácar. Con WebGL, la ciudad es una escena 3D (world3d.js:
// Aurelia bajo el cielo, Nácar bajo la roca) que se puede inclinar y girar; sin WebGL, o con
// la vista 2D elegida, es una carta ilustrada (arte original de la ciudad, barrios,
// calles, canales y edificios). En las dos se arrastra, se amplía con la rueda o pellizcando y se toca.
// Encima, siempre en 2D, van los lugares, las caras y los rótulos. Los lugares son medallones con su imagen: al
// pulsar uno NO se entra, se abre su menú (historia, conversar, minijuego, explorar, viajar).
// Las caras de los personajes salen junto a su lugar y los cristales hextec se recogen tocándolos.
(function () {
  const W = () => window.WORLD;
  const BG_SCALE = 0.6; // resolución del fondo cacheado respecto al mundo (3000x2200)
  const TAP = 8; // px que puede moverse el dedo y seguir contando como toque

  let canvas, ctx, mini, mctx, ctrls;
  let G = null;
  let cb = {};
  let running = false;
  let loopId = 0; // evita dos bucles de dibujo a la vez
  let paused = false;
  let last = 0;
  let mapId = null;
  let map = null; // datos del mapa + edificios, calles y fondo pintado
  let dpr = 1;
  let backdrop = null;
  let backdropKey = '';
  let cw = 0; // tamaño del lienzo en px CSS
  let ch = 0;
  let zoom = 1; // px de pantalla por unidad de mundo
  let fit = 1; // zoom con el que se ve la ciudad entera
  let fly = null; // vuelo de cámara en curso { x, y, z }
  let vel = { x: 0, y: 0 }; // inercia al soltar un arrastre
  let hover = null; // lugar, personaje o cristal bajo el ratón
  let r3d = null; // escena 3D (null = carta 2D)
  let yaw = 0; // giro de la cámara 3D
  let pitch = 0.9; // inclinación (0 = cenital)
  let drawn = { pins: [], frags: [] }; // dónde se pintó cada cosa en el último fotograma (para tocarla)
  let particles = [];
  let fade = 0;
  const keys = new Set();
  const pointers = new Map();
  let gesture = null;
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
  /** Construye los edificios y la red de calles de un distrito (siempre igual para cada ciudad). */
  function buildMap(id) {
    if (cache[id]) return cache[id];
    const def = W().maps[id];
    const [w, h] = def.size;
    const r = rng(def.seed);
    // Aurelia: manzanas amplias. Nácar: bloques industriales compactos.
    const BLOCK = def.block || 250;
    const STREET = def.street || 74;
    const keepClear = [
      ...def.locations.map((l) => ({ x: l.x, y: l.y, r: 120 })),
      ...def.fragments.map((f) => ({ x: f.x, y: f.y, r: 40 })),
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
        const split = def.cramped ? (r() < 0.3 ? 2 : 3) : r() < 0.5 ? 1 : 2;
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
            buildings.push({ x, y, w: bw, h: bh, color: def.palette.building[Math.floor(r() * def.palette.building.length)], roof: def.palette.roof[Math.floor(r() * def.palette.roof.length)], tall: r() });
          }
        }
      }
    }
    // Calles entre lugares: cada lugar se une a sus dos vecinos más cercanos.
    const locs = def.locations;
    const roads = [];
    const seen = new Set();
    for (const a of locs) {
      const near = locs.filter((b) => b !== a).sort((p, q) => Math.hypot(p.x - a.x, p.y - a.y) - Math.hypot(q.x - a.x, q.y - a.y)).slice(0, 2);
      for (const b of near) {
        const key = [a.id, b.id].sort().join('|');
        if (seen.has(key)) continue;
        seen.add(key);
        const len = Math.hypot(b.x - a.x, b.y - a.y);
        const bend = (r() - 0.5) * len * 0.35;
        const mx = (a.x + b.x) / 2 - ((b.y - a.y) / len) * bend;
        const my = (a.y + b.y) / 2 + ((b.x - a.x) / len) * bend;
        roads.push({ a: a.id, b: b.id, ax: a.x, ay: a.y, mx, my, bx: b.x, by: b.y });
      }
    }
    cache[id] = { id, def, w, h, buildings, roads, bg: null, bgArt: null, BLOCK, STREET };
    return cache[id];
  }

  // ---------- Imágenes ----------
  function loadImg(key, src) {
    if (imgCache.has(key)) return imgCache.get(key);
    const img = new Image();
    img.src = src.startsWith('<svg') ? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(src)}` : src;
    imgCache.set(key, img);
    return img;
  }
  const ready = (img) => img && img.complete && img.naturalWidth;
  // Personajes: su avatar de chat (retrato propio o avatar procedural).
  function charImg(id) { return loadImg(`c:${id}`, Portrait.customChar(id, false) || Portrait.charURL(id, 96)); }

  // Imagen de cada lugar: arte personal o ilustración original de Aurelia/Nácar.
  // El universo original dibuja sus lugares con las escenas propias de Scenes2D.
  const ATLAS_IMG = {};
  /** URL de la imagen de un lugar del universo original. */
  // Imágenes de la carpeta lugares/ que son escudos y no escenarios (no sirven de medallón).
  const EMBLEMS = new Set(['mansion-kiramman', 'noxus']);
  function placeURL(id) {
    const own = window.CustomArt?.image('lugares', id);
    if (own && !(EMBLEMS.has(id) && /lugares\/[^/]+\.png$/.test(own))) return own;
    if (own && ATLAS_IMG[id]) return `img/atlas/${ATLAS_IMG[id]}.webp`;
    const p = window.Scenes2D?.PLACES?.[id];
    const scene = p && window.Scenes2D.imageFor(id, p[1]);
    return scene || (ATLAS_IMG[id] && `img/atlas/${ATLAS_IMG[id]}.webp`) || null;
  }
  function placeImg(l) {
    const url = placeURL(l.id);
    return url ? loadImg(`l:${url}`, url) : null;
  }
  /** Panorámica de la ciudad para el fondo del mapa. */
  function cityArt(id) {
    const artId = id === 'piltover' ? 'aurelia' : id === 'zaun' ? 'nacar' : id;
    const url = window.CustomArt?.image('lugares', artId) || `img/arte/lugares/${artId}.svg`;
    return loadImg(`city:${url}`, url);
  }

  // ---------- Entidades ----------
  function locById(id) {
    for (const [mid, m] of Object.entries(W().maps)) {
      const l = m.locations.find((x) => x.id === id);
      if (l) return { ...l, map: mid };
    }
    return null;
  }

  /** Personajes desbloqueados que están ahora en cada lugar del distrito. */
  function npcs() {
    const out = [];
    const byLoc = {};
    for (const id of G.unlocked) {
      if ((W().absent[id] || []).includes(G.progress.chapterId)) continue;
      if ((G.fallen || []).includes(id)) continue;
      const loc = locById(W().homes[id]);
      if (!loc || loc.map !== mapId) continue;
      const n = (byLoc[loc.id] = (byLoc[loc.id] || 0) + 1);
      out.push({ kind: 'char', id, loc: loc.id, slot: n - 1, name: window.WIKI.personajes.find((p) => p.id === id)?.name || id, x: loc.x, y: loc.y });
    }
    return out;
  }

  /** Lugar del objetivo de la historia. */
  function objectiveLoc() {
    const id = cb.objective?.();
    return id ? locById(id) : null;
  }

  // ---------- Cámara ----------
  const camState = () => ({ x: G.world.x, y: G.world.y, zoom, yaw, pitch });
  const sync3d = () => r3d?.place(camState());
  const toScreen = (x, y, h = 0) => (r3d ? r3d.project(x, y, h) : { x: (x - G.world.x) * zoom + cw / 2, y: (y - G.world.y) * zoom + ch / 2 });
  const toWorld = (sx, sy) => (r3d && r3d.pick(sx, sy)) || { x: (sx - cw / 2) / zoom + G.world.x, y: (sy - ch / 2) / zoom + G.world.y };
  // En Nácar la cámara respeta el límite de altura de las galerías.
  const zMin = () => {
    if (r3d && mapId === 'zaun') return Math.max(fit * 0.92, (ch / 2) / (Math.tan((45 * Math.PI) / 360) * (1150 / Math.cos(pitch))));
    return fit * 0.92;
  };
  const PAD_TOP = 26; // px de pantalla libres arriba y abajo (la barra de botones tapa el borde inferior)
  const PAD_BOTTOM = 76;
  const zMax = () => Math.max(fit * 4, 0.9);

  /** Mantiene la ciudad dentro de la vista (centrada si cabe entera). */
  function clampView() {
    zoom = Math.max(zMin(), Math.min(zMax(), zoom));
    pitch = Math.max(0.3, Math.min(1.22, pitch));
    if (r3d) {
      // Sin acercarse tanto al borde que el acantilado tape la ciudad.
      const m = 260;
      G.world.x = Math.max(m, Math.min(map.w - m, G.world.x));
      G.world.y = Math.max(m, Math.min(map.h - m, G.world.y));
      sync3d();
      return;
    }
    const hw = cw / 2 / zoom;
    const hh = ch / 2 / zoom;
    const top = -PAD_TOP / zoom;
    const bottom = map.h + PAD_BOTTOM / zoom;
    G.world.x = map.w <= hw * 2 ? map.w / 2 : Math.max(hw, Math.min(map.w - hw, G.world.x));
    G.world.y = bottom - top <= hh * 2 ? (top + bottom) / 2 : Math.max(top + hh, Math.min(bottom - hh, G.world.y));
  }

  /** Amplía o reduce manteniendo fijo el punto de pantalla (sx, sy). */
  function zoomAt(f, sx = cw / 2, sy = ch / 2) {
    sync3d();
    const before = toWorld(sx, sy);
    zoom = Math.max(zMin(), Math.min(zMax(), zoom * f));
    sync3d();
    const after = toWorld(sx, sy);
    G.world.x += before.x - after.x;
    G.world.y += before.y - after.y;
    fly = null;
    clampView();
  }

  /** Vuela suavemente hasta un punto del mapa (y, si se indica, a un zoom). */
  function flyTo(x, y, z = zoom) {
    fly = { x, y, z: Math.max(zMin(), Math.min(zMax(), z)) };
  }

  // ---------- Fondo pintado (se dibuja una vez por ciudad) ----------
  function paintBackground(forGround = false) {
    const zaun = mapId === 'zaun';
    const P = map.def.palette;
    const c = document.createElement('canvas');
    c.width = Math.round(map.w * BG_SCALE);
    c.height = Math.round(map.h * BG_SCALE);
    const g = c.getContext('2d');
    g.scale(BG_SCALE, BG_SCALE);
    const r = rng(map.def.seed * 31);

    g.fillStyle = P.ground;
    g.fillRect(0, 0, map.w, map.h);
    // Arte original de la ciudad, oscurecido y difuminado como fondo ambiental.
    const art = cityArt(mapId);
    if (forGround) {
      g.fillStyle = zaun ? '#1a2420' : '#8f7c5a';
      g.fillRect(0, 0, map.w, map.h);
      // Suelo de la escena 3D: piedra clara en Aurelia o roca húmeda en Nácar, sin imagen encima.
      for (let i = 0; i < 9000; i++) {
        g.globalAlpha = 0.05 + r() * 0.1;
        g.fillStyle = zaun ? ['#2a3a30', '#141c18', '#3a3a2a', '#1f2e2a'][i % 4] : ['#a8916a', '#7d6a4a', '#c4ad82', '#8a7656'][i % 4];
        g.beginPath();
        g.ellipse(r() * map.w, r() * map.h, 10 + r() * 50, 4 + r() * 12, r() * 3, 0, Math.PI * 2);
        g.fill();
      }
      g.globalAlpha = 1;
    } else if (ready(art)) {
      const s = Math.max(map.w / art.naturalWidth, map.h / art.naturalHeight);
      g.save();
      g.globalAlpha = 0.85;
      g.filter = 'blur(5px) saturate(1.1)';
      g.drawImage(art, (map.w - art.naturalWidth * s) / 2, (map.h - art.naturalHeight * s) / 2, art.naturalWidth * s, art.naturalHeight * s);
      g.restore();
      map.bgArt = art.src;
    }
    const wash = g.createLinearGradient(0, 0, 0, map.h);
    if (forGround) { wash.addColorStop(0, 'rgba(0,0,0,0)'); wash.addColorStop(1, 'rgba(0,0,0,0)'); } else {
    wash.addColorStop(0, zaun ? 'rgba(14,22,20,0.35)' : 'rgba(42,36,24,0.35)');
    wash.addColorStop(1, zaun ? 'rgba(6,14,10,0.62)' : 'rgba(24,20,12,0.62)');
    }
    g.fillStyle = wash;
    g.fillRect(0, 0, map.w, map.h);

    // Agua: canales de condensación y reservorios geotérmicos de las dos ciudades.
    g.save();
    if (zaun) {
      g.strokeStyle = 'rgba(120,200,80,0.22)';
      g.lineWidth = 120;
      g.lineCap = 'round';
      g.beginPath();
      g.moveTo(-50, 1780);
      g.bezierCurveTo(700, 1600, 1300, 2050, 1900, 1800);
      g.bezierCurveTo(2400, 1600, 2700, 2000, 3050, 1760);
      g.stroke();
      g.strokeStyle = 'rgba(170,255,120,0.18)';
      g.lineWidth = 6;
      g.setLineDash([30, 40]);
      g.stroke();
    } else {
      const sea = g.createLinearGradient(0, 1820, 0, map.h);
      sea.addColorStop(0, 'rgba(40,90,120,0)');
      sea.addColorStop(0.25, 'rgba(40,90,130,0.45)');
      sea.addColorStop(1, 'rgba(20,50,80,0.7)');
      g.fillStyle = sea;
      g.fillRect(0, 1820, map.w, map.h - 1820);
      g.strokeStyle = 'rgba(200,230,255,0.12)';
      g.lineWidth = 3;
      for (let y = 1960; y < map.h; y += 34) {
        g.beginPath();
        for (let x = 0; x <= map.w; x += 40) g.lineTo(x, y + Math.sin(x / 90 + y) * 6);
        g.stroke();
      }
    }
    g.restore();

    // Barrios: manchas de color con borde grabado y su nombre en letras de mapa.
    for (const d of map.def.districts) {
      const [x, y, w, h] = d.rect;
      g.save();
      g.beginPath();
      const pts = [];
      const N = 18;
      for (let i = 0; i < N; i++) {
        const t = i / N;
        let px; let py;
        if (t < 0.25) { px = x + w * (t / 0.25); py = y; } else if (t < 0.5) { px = x + w; py = y + h * ((t - 0.25) / 0.25); } else if (t < 0.75) { px = x + w * (1 - (t - 0.5) / 0.25); py = y + h; } else { px = x; py = y + h * (1 - (t - 0.75) / 0.25); }
        pts.push([px + (r() - 0.5) * 50, py + (r() - 0.5) * 50]);
      }
      pts.forEach(([px, py], i) => g[i ? 'lineTo' : 'moveTo'](px, py));
      g.closePath();
      g.fillStyle = d.tint.replace(/[\d.]+\)$/, (m) => `${Math.min(0.3, parseFloat(m) * 1.3)})`);
      g.fill();
      g.strokeStyle = zaun ? 'rgba(63,191,159,0.22)' : 'rgba(227,196,90,0.25)';
      g.lineWidth = 3;
      g.setLineDash([14, 10]);
      g.stroke();
      g.restore();
    }

    // Edificios: manzanas pintadas con tinta, para dar densidad de ciudad (en 3D ya son volúmenes).
    for (const b of forGround ? [] : map.buildings) {
      // Tejados en tinta suave: dan textura de ciudad sin tapar el arte de fondo.
      g.globalAlpha = 0.22;
      g.fillStyle = 'rgba(0,0,0,0.7)';
      g.fillRect(b.x + 5, b.y + 7, b.w, b.h);
      g.globalAlpha = zaun ? 0.16 : 0.14;
      g.fillStyle = b.color;
      g.fillRect(b.x, b.y, b.w, b.h);
      g.fillStyle = b.roof;
      g.globalAlpha = 0.12;
      g.fillRect(b.x + 4, b.y + 4, b.w - 8, b.h * 0.4);
      g.globalAlpha = 0.25;
      g.strokeStyle = P.outline;
      g.lineWidth = 1.5;
      g.strokeRect(b.x, b.y, b.w, b.h);
      if (zaun && b.tall > 0.75) {
        g.globalAlpha = 0.55;
        g.fillStyle = b.roof;
        g.fillRect(b.x + b.w * 0.2, b.y + b.h - 10, b.w * 0.6, 4);
      }
    }
    g.globalAlpha = 1;

    // Tuberías de Nácar
    if (zaun) {
      g.strokeStyle = 'rgba(143,191,58,0.22)';
      g.lineWidth = 10;
      for (let i = 0; i < 6; i++) {
        g.beginPath();
        g.moveTo(0, 180 + i * 360);
        g.bezierCurveTo(800, 100 + i * 360, 2000, 300 + i * 360, map.w, 200 + i * 360);
        g.stroke();
      }
    }

    // Calles entre los lugares: firme oscuro con bordillo de color.
    for (const rd of map.roads) {
      for (const [col, wid] of [['rgba(0,0,0,0.55)', 46], [zaun ? '#1f2a26' : '#5a4a30', 34], [zaun ? 'rgba(63,191,159,0.18)' : 'rgba(255,236,190,0.16)', 4]]) {
        g.strokeStyle = col;
        g.lineWidth = wid;
        g.lineCap = 'round';
        g.beginPath();
        g.moveTo(rd.ax, rd.ay);
        g.quadraticCurveTo(rd.mx, rd.my, rd.bx, rd.by);
        g.stroke();
      }
    }

    // Nombres de los barrios
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    for (const d of map.def.districts) {
      const [x, y, w, h] = d.rect;
      g.font = 'italic bold 64px Georgia, serif';
      g.fillStyle = zaun ? 'rgba(170,255,220,0.16)' : 'rgba(255,240,200,0.18)';
      g.fillText(d.name.toUpperCase(), x + w / 2, y + h - 70);
    }

    if (forGround) {
      // Plazas empedradas alrededor de cada lugar
      for (const l of map.def.locations) {
        const gr = g.createRadialGradient(l.x, l.y, 10, l.x, l.y, 130);
        gr.addColorStop(0, zaun ? 'rgba(63,191,159,0.35)' : 'rgba(255,230,170,0.45)');
        gr.addColorStop(1, 'rgba(0,0,0,0)');
        g.fillStyle = gr;
        g.beginPath(); g.arc(l.x, l.y, 130, 0, Math.PI * 2); g.fill();
      }
      return c;
    }
    // Rosa de los vientos
    g.save();
    g.translate(map.w - 200, map.h - 220);
    g.strokeStyle = zaun ? 'rgba(63,191,159,0.45)' : 'rgba(227,196,90,0.55)';
    g.fillStyle = g.strokeStyle;
    g.lineWidth = 3;
    g.beginPath(); g.arc(0, 0, 90, 0, Math.PI * 2); g.stroke();
    g.beginPath(); g.arc(0, 0, 70, 0, Math.PI * 2); g.stroke();
    for (let i = 0; i < 8; i++) {
      const a = (Math.PI / 4) * i;
      const L = i % 2 ? 60 : 120;
      g.beginPath();
      g.moveTo(Math.cos(a) * L, Math.sin(a) * L);
      g.lineTo(Math.cos(a + 0.2) * 18, Math.sin(a + 0.2) * 18);
      g.lineTo(Math.cos(a - 0.2) * 18, Math.sin(a - 0.2) * 18);
      g.closePath();
      g.fill();
    }
    g.font = 'bold 34px Georgia, serif';
    g.fillText('N', 0, -142);
    g.restore();

    // Grano de papel y marco de la carta
    for (let i = 0; i < 3500; i++) {
      g.fillStyle = r() < 0.5 ? 'rgba(255,255,255,0.025)' : 'rgba(0,0,0,0.05)';
      g.fillRect(r() * map.w, r() * map.h, 3 + r() * 6, 3 + r() * 6);
    }
    const frame = zaun ? '#3fbf9f' : '#e3c45a';
    g.strokeStyle = frame;
    g.globalAlpha = 0.7;
    g.lineWidth = 8;
    g.strokeRect(14, 14, map.w - 28, map.h - 28);
    g.lineWidth = 2;
    g.strokeRect(34, 34, map.w - 68, map.h - 68);
    for (const [x, y] of [[34, 34], [map.w - 34, 34], [34, map.h - 34], [map.w - 34, map.h - 34]]) {
      g.save();
      g.translate(x, y);
      g.rotate(Math.PI / 4);
      g.fillStyle = frame;
      g.fillRect(-16, -16, 32, 32);
      g.restore();
    }
    g.globalAlpha = 1;
    // Cartela con el nombre de la ciudad
    g.font = 'bold 92px Georgia, serif';
    g.fillStyle = 'rgba(0,0,0,0.5)';
    g.fillText(map.def.label.toUpperCase(), map.w / 2 + 4, 118);
    g.fillStyle = frame;
    g.fillText(map.def.label.toUpperCase(), map.w / 2, 112);
    map.bg = c;
    return c;
  }

  // ---------- Dibujo ----------
  const opt = () => window.App?.settings || {};

  /** Escala de los medallones según el zoom: legibles de lejos, sin tapar la ciudad de cerca. */
  const pinR = () => Math.max(26, Math.min(48, 34 * Math.sqrt(zoom / Math.max(0.2, fit))));

  function draw(t, dt) {
    const zaun = mapId === 'zaun';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!map.bg || (!map.bgArt && ready(cityArt(mapId)))) paintBackground();
    if (r3d) {
      try {
        ctx.clearRect(0, 0, cw, ch);
        r3d.render(camState(), t / 1000, dt);
        drawOverlay(t, zaun);
        return;
      } catch (err) {
        // Si el 3D falla en este equipo, se sigue con la carta 2D en vez de dejar la pantalla negra.
        console.error('Mapa 3D desactivado:', err);
        G.world.view = '2d';
        use3d(false);
        resize();
      }
    }
    ctx.fillStyle = '#05040a';
    ctx.fillRect(0, 0, cw, ch);
    // Cache the costly blurred panorama: only rebuild it when the art or viewport changes.
    const art = cityArt(mapId);
    if (ready(art)) {
      const key = `${art.src}:${cw}x${ch}`;
      if (backdropKey !== key) {
        backdropKey = key;
        backdrop = document.createElement('canvas');
        backdrop.width = cw;
        backdrop.height = ch;
        const b = backdrop.getContext('2d');
        const scale = Math.max(cw / art.naturalWidth, ch / art.naturalHeight) * 1.1;
        b.globalAlpha = 0.35;
        b.filter = 'blur(18px)';
        b.drawImage(art, (cw - art.naturalWidth * scale) / 2, (ch - art.naturalHeight * scale) / 2, art.naturalWidth * scale, art.naturalHeight * scale);
      }
      ctx.drawImage(backdrop, 0, 0);
    }
    const o = toScreen(0, 0);
    ctx.imageSmoothingQuality = 'medium';
    ctx.drawImage(map.bg, o.x, o.y, map.w * zoom, map.h * zoom);
    drawOverlay(t, zaun);
  }

  /** Lo que va encima del mapa (2D o 3D): ruta, ambiente, cristales, lugares, caras y rótulos. */
  function drawOverlay(t, zaun) {
    const PIN_H = r3d ? 95 : 0; // altura a la que flotan los medallones en 3D

    // Ruta animada hasta el objetivo por las calles.
    const obj = objectiveLoc();
    const route = obj ? routeTo(obj) : null;
    if (route) {
      ctx.save();
      ctx.lineCap = 'round';
      ctx.strokeStyle = 'rgba(255,224,138,0.85)';
      ctx.shadowColor = '#ffe08a';
      ctx.shadowBlur = 10;
      ctx.lineWidth = Math.max(3, 6 * zoom);
      ctx.setLineDash([Math.max(8, 22 * zoom), Math.max(7, 18 * zoom)]);
      ctx.lineDashOffset = -t / 30;
      for (const rd of route) {
        ctx.beginPath();
        for (let i = 0; i <= 16; i++) {
          const u = i / 16;
          const x = (1 - u) ** 2 * rd.ax + 2 * (1 - u) * u * rd.mx + u * u * rd.bx;
          const y = (1 - u) ** 2 * rd.ay + 2 * (1 - u) * u * rd.my + u * u * rd.by;
          const p = toScreen(x, y, 4);
          ctx[i ? 'lineTo' : 'moveTo'](p.x, p.y);
        }
        ctx.stroke();
      }
      ctx.restore();
    }

    // Ambiente: vapor mineral en Nácar, polvo dorado en Aurelia.
    if (opt().particles !== false && !opt().reduceMotion) {
      for (const p of particles) {
        if (zaun) {
          const gr = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
          gr.addColorStop(0, `rgba(120,220,170,${0.07 * Math.min(1, p.life / 3)})`);
          gr.addColorStop(1, 'rgba(120,220,170,0)');
          ctx.fillStyle = gr;
        } else ctx.fillStyle = `rgba(255,220,130,${0.55 * Math.min(1, p.life / 3)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Cristales hextec (fragmentos del Códice)
    drawn = { pins: [], frags: [] };
    for (const f of map.def.fragments) {
      if (G.codex.includes(f.codex)) continue;
      const s = toScreen(f.x, f.y, r3d ? 45 : 0);
      if (s.behind || s.x < -40 || s.y < -40 || s.x > cw + 40 || s.y > ch + 40) continue;
      const k = Math.max(0.5, Math.min(1.1, (r3d ? r3d.scaleAt(f.x, f.y) : zoom) / fit * 0.6));
      hexCrystal(s.x, s.y + Math.sin(t / 300 + f.x) * 3, t, hover?.kind === 'frag' && hover.codex === f.codex ? k * 1.3 : k);
      drawn.frags.push({ f, x: s.x, y: s.y, r: 24 * k + 8 });
    }

    // Lugares: medallón con su imagen, nombre y avisos de lo que hay que hacer.
    const people = npcs();
    const visited = new Set(G.visited || []);
    const labels = [];
    // En 3D se pintan de lejos a cerca, con un poste de luz hasta el suelo.
    const order = map.def.locations.map((l) => ({ l, s: toScreen(l.x, l.y, PIN_H) })).filter((o) => !o.s.behind).sort((a, b) => (b.s.depth || 0) - (a.s.depth || 0));
    for (const { l, s } of order) {
      const R = r3d ? Math.max(20, Math.min(54, 34 * Math.sqrt(r3d.scaleAt(l.x, l.y) / Math.max(0.05, fit)))) : pinR();
      if (s.x < -R * 3 || s.y < -R * 3 || s.x > cw + R * 3 || s.y > ch + R * 3) continue;
      const isObj = obj && obj.id === l.id;
      const hov = hover?.kind === 'loc' && hover.id === l.id;
      const rr = R * (hov ? 1.14 : 1);
      if (r3d) {
        const g0 = toScreen(l.x, l.y, 0);
        const beam = ctx.createLinearGradient(g0.x, g0.y, s.x, s.y);
        const col = isObj ? '255,224,138' : zaun ? '63,191,159' : '227,196,90';
        beam.addColorStop(0, `rgba(${col},0.9)`);
        beam.addColorStop(1, `rgba(${col},0.15)`);
        ctx.strokeStyle = beam;
        ctx.lineWidth = isObj ? 4 : 2.5;
        ctx.beginPath(); ctx.moveTo(g0.x, g0.y); ctx.lineTo(s.x, s.y + rr); ctx.stroke();
        ctx.fillStyle = `rgba(${col},0.35)`;
        ctx.beginPath(); ctx.ellipse(g0.x, g0.y, rr * 0.7, rr * 0.25, 0, 0, Math.PI * 2); ctx.fill();
      }
      medallion(l, s.x, s.y, rr, isObj, hov, t, !visited.has(l.id));
      // Caras de quien está aquí
      const here = people.filter((n) => n.loc === l.id);
      const faces = here.map((n, i) => {
        const p = facePos(s.x, s.y, rr, i, here.length);
        drawFace(charImg(n.id), p.x, p.y, p.r, zaun ? '#3fbf9f' : '#e3c45a', hover?.kind === 'char' && hover.id === n.id);
        return { n, p };
      });
      drawn.pins.push({ l, x: s.x, y: s.y, R: rr, faces });
      labels.push({ l, x: s.x, y: s.y + rr + 18, isObj, hov, R: rr });
    }
    // Rótulos encima de todo
    for (const { l, x, y, isObj, hov, R } of labels) {
      if (isObj) ribbon('OBJETIVO', x, y - R * 2 - 60, '#ffe08a');
      if (r3d || zoom > fit * 0.95 || isObj || hov) plate(l.name, x, y, isObj ? '#ffe08a' : hov ? '#fff' : (zaun ? '#bff5e6' : '#fbe9b8'), hov);
      if (hov) {
        const acts = cb.locationActions?.(l) || [];
        const summary = acts.length ? acts.slice(0, 3).join(' · ') + (acts.length > 3 ? ' …' : '') : 'Toca para ver el lugar';
        plate(summary, x, y + 26, '#cfc6e0', false, 13);
      }
    }
    if (hover?.kind === 'char') {
      const p = hover.screen;
      plate(`Hablar con ${hover.name}`, p.x, p.y - p.r - 16, '#fff', true, 13);
    } else if (hover?.kind === 'frag') {
      const s = toScreen(hover.x, hover.y, r3d ? 45 : 0);
      plate('Cristal hextec · tócalo para recogerlo', s.x, s.y - 36, '#bfe6ff', true, 13);
    }

    // Viñeta
    const v = ctx.createRadialGradient(cw / 2, ch / 2, Math.min(cw, ch) * 0.35, cw / 2, ch / 2, Math.max(cw, ch) * 0.75);
    v.addColorStop(0, 'transparent');
    v.addColorStop(1, zaun ? 'rgba(0,16,8,0.6)' : r3d ? 'rgba(40,24,0,0.25)' : 'rgba(20,12,0,0.45)');
    ctx.fillStyle = v;
    ctx.fillRect(0, 0, cw, ch);

    if (obj && opt().objectiveArrow !== false) drawObjectiveArrow(obj);
    if (fade > 0) {
      ctx.fillStyle = `rgba(0,0,0,${fade})`;
      ctx.fillRect(0, 0, cw, ch);
    }
    if (opt().minimap !== false) drawMini(obj);
  }

  /** Posición en pantalla de la cara n-ésima alrededor de un medallón. */
  function facePos(x, y, R, i, n) {
    // En arco por el lado derecho del medallón, empezando arriba.
    const r = Math.max(13, R * 0.42);
    const step = n > 4 ? 0.5 : 0.62;
    const a = -Math.PI / 2 + 0.55 + i * step;
    return { x: x + Math.cos(a) * (R + r * 0.85), y: y + Math.sin(a) * (R + r * 0.85), r };
  }

  /** Medallón de un lugar: imagen recortada en círculo con marco hextec. */
  function medallion(l, x, y, R, isObj, hov, t, isNew) {
    const zaun = mapId === 'zaun';
    const frame = isObj ? '#ffe08a' : zaun ? '#3fbf9f' : '#e3c45a';
    // Halo
    const pulse = 0.5 + Math.sin(t / 420) * 0.5;
    const halo = ctx.createRadialGradient(x, y, R * 0.6, x, y, R * (isObj ? 2.4 : 1.8));
    halo.addColorStop(0, isObj ? `rgba(255,220,120,${0.35 + pulse * 0.3})` : hov ? 'rgba(255,255,255,0.25)' : (zaun ? 'rgba(63,191,159,0.22)' : 'rgba(227,196,90,0.2)'));
    halo.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(x, y, R * 2.4, 0, Math.PI * 2);
    ctx.fill();
    // Sombra y fondo
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.8)';
    ctx.shadowBlur = 16;
    ctx.shadowOffsetY = 6;
    ctx.fillStyle = '#0d0b14';
    ctx.beginPath();
    ctx.arc(x, y, R + 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    // Imagen
    const img = placeImg(l);
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, R, 0, Math.PI * 2);
    ctx.clip();
    if (ready(img)) {
      const s = Math.max((R * 2) / img.naturalWidth, (R * 2) / img.naturalHeight);
      const iw = img.naturalWidth * s;
      const ih = img.naturalHeight * s;
      ctx.drawImage(img, x - iw / 2, y - ih / 2, iw, ih);
    } else {
      ctx.fillStyle = zaun ? '#1f2a26' : '#4a3f2a';
      ctx.fillRect(x - R, y - R, R * 2, R * 2);
    }
    // Brillo de cristal
    const gl = ctx.createLinearGradient(x, y - R, x, y + R);
    gl.addColorStop(0, 'rgba(255,255,255,0.18)');
    gl.addColorStop(0.45, 'rgba(255,255,255,0)');
    gl.addColorStop(1, 'rgba(0,0,0,0.35)');
    ctx.fillStyle = gl;
    ctx.fillRect(x - R, y - R, R * 2, R * 2);
    ctx.restore();
    // Marco doble con remaches
    ctx.strokeStyle = frame;
    ctx.lineWidth = isObj ? 4 : 3;
    if (isObj || hov) { ctx.shadowColor = frame; ctx.shadowBlur = 14 + pulse * 8; }
    ctx.beginPath();
    ctx.arc(x, y, R, 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 0.7;
    ctx.beginPath();
    ctx.arc(x, y, R + 5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
    for (let i = 0; i < 4; i++) {
      const a = Math.PI / 4 + (Math.PI / 2) * i;
      ctx.save();
      ctx.translate(x + Math.cos(a) * (R + 5), y + Math.sin(a) * (R + 5));
      ctx.rotate(Math.PI / 4);
      ctx.fillStyle = frame;
      ctx.fillRect(-3.5, -3.5, 7, 7);
      ctx.restore();
    }
    // Gema inferior: azul si hay actividad, gris si no
    const hasAct = Boolean(l.activity);
    ctx.save();
    ctx.translate(x, y + R + 5);
    ctx.rotate(Math.PI / 4);
    ctx.fillStyle = hasAct ? '#7fd0ff' : '#6a6478';
    ctx.shadowColor = hasAct ? '#3fa9f5' : 'transparent';
    ctx.shadowBlur = hasAct ? 10 : 0;
    ctx.fillRect(-6, -6, 12, 12);
    ctx.strokeStyle = frame;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(-6, -6, 12, 12);
    ctx.restore();
    // Lugar sin descubrir
    if (isNew) {
      ctx.fillStyle = '#e0457b';
      ctx.strokeStyle = '#0d0b14';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x - R * 0.72, y - R * 0.72, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
    if (l.travel) {
      ctx.fillStyle = frame;
      ctx.beginPath();
      const dir = mapId === 'zaun' ? -1 : 1;
      ctx.moveTo(x + R * 0.78, y + dir * -2);
      ctx.lineTo(x + R * 0.78 + 9, y + dir * 10);
      ctx.lineTo(x + R * 0.78 - 9, y + dir * 10);
      ctx.closePath();
      ctx.fill();
    }
  }

  /** Cara redonda de un personaje. */
  function drawFace(img, x, y, r, ring, hov) {
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.7)';
    ctx.shadowBlur = 8;
    ctx.fillStyle = '#15121f';
    ctx.beginPath();
    ctx.arc(x, y, r * (hov ? 1.18 : 1) + 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    const rr = r * (hov ? 1.18 : 1);
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, rr, 0, Math.PI * 2);
    ctx.clip();
    if (ready(img)) ctx.drawImage(img, x - rr, y - rr, rr * 2, rr * 2);
    ctx.restore();
    ctx.strokeStyle = hov ? '#fff' : ring;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, rr, 0, Math.PI * 2);
    ctx.stroke();
  }

  /** Cartela con texto. */
  function plate(text, x, y, color, strong, size = 14) {
    ctx.font = `${strong ? 'bold ' : '600 '}${size}px Georgia, 'Times New Roman', serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const w = ctx.measureText(text).width + 18;
    const h = size + 10;
    ctx.fillStyle = 'rgba(10,8,16,0.82)';
    roundRect(x - w / 2, y - h / 2, w, h, 7);
    ctx.fill();
    ctx.strokeStyle = mapId === 'zaun' ? 'rgba(63,191,159,0.45)' : 'rgba(227,196,90,0.45)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.fillText(text, x, y + 1);
  }

  /** Cinta dorada encima del objetivo. */
  function ribbon(text, x, y, color) {
    ctx.font = 'bold 12px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const w = ctx.measureText(text).width + 26;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x - w / 2, y - 10); ctx.lineTo(x + w / 2, y - 10); ctx.lineTo(x + w / 2 - 7, y); ctx.lineTo(x + w / 2, y + 10);
    ctx.lineTo(x - w / 2, y + 10); ctx.lineTo(x - w / 2 + 7, y); ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#2a1e08';
    ctx.fillText(text, x, y + 1);
  }

  // Cristal hextec: gema azul con marco dorado hexagonal y anillo de runas girando.
  function hexCrystal(x, y, t, k = 1) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(k, k);
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

  /** Traza una figura hexagonal. */
  function hexPath(r) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 3) * i;
      ctx[i ? 'lineTo' : 'moveTo'](Math.cos(a) * r, Math.sin(a) * r);
    }
    ctx.closePath();
  }

  /** Traza un rectángulo redondeado en el lienzo. */
  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  /** Calles que llevan del último lugar visitado (o del centro de la vista) al objetivo. */
  function routeTo(obj) {
    let goal = obj;
    if (obj.map !== mapId) goal = map.def.locations.find((l) => l.travel);
    if (!goal) return null;
    const locs = map.def.locations;
    let start = locs.find((l) => l.id === G.world.at);
    if (!start) start = locs.reduce((b, l) => (Math.hypot(l.x - G.world.x, l.y - G.world.y) < Math.hypot(b.x - G.world.x, b.y - G.world.y) ? l : b), locs[0]);
    if (start.id === goal.id) return null;
    // Búsqueda en anchura por la red de calles.
    const prev = { [start.id]: null };
    const queue = [start.id];
    while (queue.length) {
      const cur = queue.shift();
      if (cur === goal.id) break;
      for (const rd of map.roads) {
        const nb = rd.a === cur ? rd.b : rd.b === cur ? rd.a : null;
        if (nb && !(nb in prev)) { prev[nb] = { from: cur, rd }; queue.push(nb); }
      }
    }
    if (!(goal.id in prev)) return null;
    const out = [];
    for (let n = goal.id; prev[n]; n = prev[n].from) out.push(prev[n].rd);
    return out;
  }

  /** Señala el objetivo cuando está fuera de la vista. */
  function drawObjectiveArrow(obj) {
    let x = obj.x;
    let y = obj.y;
    let text = obj.name;
    if (obj.map !== mapId) {
      const bridge = map.def.locations.find((l) => l.travel);
      if (!bridge) return;
      x = bridge.x; y = bridge.y; text = `${obj.name} (${W().maps[obj.map].label})`;
    }
    const s = toScreen(x, y);
    if (!s.behind && s.x > 40 && s.y > 40 && s.x < cw - 40 && s.y < ch - 40) return;
    const cx = cw / 2;
    const cy = ch / 2;
    const a = s.behind ? Math.atan2(cy - s.y, cx - s.x) : Math.atan2(s.y - cy, s.x - cx);
    const ex = cx + Math.cos(a) * (Math.min(cx, cy) - 60);
    const ey = cy + Math.sin(a) * (Math.min(cx, cy) - 60);
    ctx.save();
    ctx.translate(ex, ey);
    ctx.rotate(a);
    ctx.fillStyle = '#ffe08a';
    ctx.beginPath();
    ctx.moveTo(18, 0); ctx.lineTo(-10, -12); ctx.lineTo(-4, 0); ctx.lineTo(-10, 12);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    plate(text, ex, ey - 24, '#ffe08a', true, 13);
  }

  /** Minimapa: la carta en pequeño con el recuadro de lo que se ve. */
  function drawMini(obj) {
    if (!mctx || !map.bg) return;
    const s = mini.width / map.w;
    mctx.drawImage(map.bg, 0, 0, mini.width, mini.height);
    for (const l of map.def.locations) {
      mctx.fillStyle = obj && obj.id === l.id ? '#ffe08a' : '#ffffff';
      mctx.beginPath();
      mctx.arc(l.x * s, l.y * s, obj && obj.id === l.id ? 5 : 3, 0, Math.PI * 2);
      mctx.fill();
    }
    mctx.fillStyle = '#7fd0ff';
    for (const f of map.def.fragments) if (!G.codex.includes(f.codex)) mctx.fillRect(f.x * s - 1.5, f.y * s - 1.5, 3, 3);
    mctx.strokeStyle = '#ff5a8a';
    mctx.lineWidth = 2;
    if (r3d) {
      // Lo que ve la cámara: el trapecio del suelo que cae en pantalla.
      const pts = [[0, ch * 0.25], [cw, ch * 0.25], [cw, ch], [0, ch]].map(([x, y]) => r3d.pick(x, y)).filter(Boolean);
      mctx.beginPath();
      pts.forEach((p, i) => mctx[i ? 'lineTo' : 'moveTo'](p.x * s, p.y * s));
      mctx.closePath();
      mctx.stroke();
      mctx.fillStyle = '#ff5a8a';
      mctx.beginPath(); mctx.arc(G.world.x * s, G.world.y * s, 3, 0, Math.PI * 2); mctx.fill();
      return;
    }
    const a = toWorld(0, 0);
    const b = toWorld(cw, ch);
    mctx.strokeRect(Math.max(1, a.x * s), Math.max(1, a.y * s), Math.min(mini.width - 2, (b.x - a.x) * s), Math.min(mini.height - 2, (b.y - a.y) * s));
  }

  // ---------- Lógica ----------
  function update(dt) {
    // Teclado: flechas o WASD desplazan, + y - amplían.
    const dx = Number(keys.has('d') || keys.has('arrowright')) - Number(keys.has('a') || keys.has('arrowleft'));
    const dy = Number(keys.has('s') || keys.has('arrowdown')) - Number(keys.has('w') || keys.has('arrowup'));
    if (dx || dy) {
      const sp = (650 * (opt().camSpeed || 1)) / zoom;
      // En 3D, «arriba» es hacia donde mira la cámara.
      const c = Math.cos(yaw); const sn = Math.sin(yaw);
      const mx = r3d ? dx * c + dy * sn : dx;
      const my = r3d ? -dx * sn + dy * c : dy;
      G.world.x += mx * sp * dt;
      G.world.y += my * sp * dt;
      fly = null;
    }
    if (r3d) {
      if (keys.has('q')) yaw += 1.4 * dt;
      if (keys.has('r')) yaw -= 1.4 * dt;
      if (keys.has('pageup')) pitch -= 0.8 * dt;
      if (keys.has('pagedown')) pitch += 0.8 * dt;
    }
    if (fly) {
      const f = Math.min(1, dt * 5);
      G.world.x += (fly.x - G.world.x) * f;
      G.world.y += (fly.y - G.world.y) * f;
      zoom += (fly.z - zoom) * f;
      if (Math.hypot(fly.x - G.world.x, fly.y - G.world.y) < 1 && Math.abs(fly.z - zoom) < 0.002) fly = null;
    } else if (!gesture && (Math.abs(vel.x) > 1 || Math.abs(vel.y) > 1)) {
      panBy(vel.x * dt, vel.y * dt);
      vel.x *= Math.pow(0.04, dt);
      vel.y *= Math.pow(0.04, dt);
    }
    clampView();
    G.world.zoom = zoom / fit;

    if (particles.length < (mapId === 'zaun' ? 26 : 60) && Math.random() < 0.4) {
      const zaun = mapId === 'zaun';
      particles.push({ x: Math.random() * cw, y: ch + 10, vy: -(15 + Math.random() * 35), vx: (Math.random() - 0.5) * 12, life: 7 + Math.random() * 6, r: zaun ? 50 + Math.random() * 90 : 1.2 + Math.random() * 2 });
    }
    particles.forEach((p) => { p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt; });
    particles = particles.filter((p) => p.life > 0);
    if (fade > 0) fade = Math.max(0, fade - dt * 1.8);
    updateDistrict();
  }

  let lastDistrict = '';
  /** Nombre del barrio que hay en el centro de la vista. */
  function updateDistrict() {
    const d = map.def.districts.find(({ rect: [x, y, w, h] }) => G.world.x >= x && G.world.x < x + w && G.world.y >= y && G.world.y < y + h);
    const name = `${map.def.label} · ${d ? d.name : ''}`;
    if (name !== lastDistrict) {
      lastDistrict = name;
      const el = document.getElementById('world-district');
      if (el) el.textContent = name;
    }
  }

  /** Aviso inferior: qué hay bajo el ratón o cómo se usa el mapa. */
  function updatePrompt() {
    const el = document.getElementById('world-prompt');
    if (!el) return;
    let txt = '';
    if (hover?.kind === 'loc') txt = `<b>${U.esc(hover.name)}</b> · ${U.touch ? 'toca' : 'clic'} para ver qué hacer`;
    else if (hover?.kind === 'char') txt = `Hablar con <b>${U.esc(hover.name)}</b>`;
    if (el.dataset.txt !== txt) {
      el.innerHTML = txt;
      el.dataset.txt = txt;
      el.classList.toggle('show', Boolean(txt));
    }
  }

  /** Abre el menú de un lugar, la conversación de un personaje o recoge un cristal. */
  function open(thing) {
    if (paused || !thing) return;
    Audio2.sfx.click();
    if (thing.kind === 'char') return cb.onTalk?.(thing.id);
    if (thing.kind === 'frag') {
      cb.onFragment?.(thing);
      return;
    }
    if (thing.kind === 'loc') {
      const l = map.def.locations.find((x) => x.id === thing.id);
      G.world.at = l.id;
      cb.onVisit?.(l);
      flyTo(l.x, l.y + 60 / zoom, Math.max(zoom, fit * 1.6));
      cb.onLocation?.({ ...l, map: mapId });
    }
  }

  /** Desplaza la vista como si se arrastrara el suelo (dx, dy en px de pantalla). */
  function panBy(dx, dy) {
    if (r3d) {
      sync3d();
      const a = r3d.pick(cw / 2, ch / 2);
      const b = r3d.pick(cw / 2 + dx, ch / 2 + dy);
      if (a && b) { G.world.x -= b.x - a.x; G.world.y -= b.y - a.y; }
    } else {
      G.world.x -= dx / zoom;
      G.world.y -= dy / zoom;
    }
    clampView();
  }

  /** Abre el lugar resaltado o, si no hay ninguno, el más cercano al centro de la vista. */
  function interact() {
    if (hover) return open(hover);
    const l = map.def.locations.reduce((b, x) => (Math.hypot(x.x - G.world.x, x.y - G.world.y) < Math.hypot(b.x - G.world.x, b.y - G.world.y) ? x : b));
    open({ kind: 'loc', ...l });
  }

  /** Personaje, cristal o lugar que hay bajo un punto de la pantalla (según el último fotograma). */
  function thingAt(sx, sy) {
    for (let k = drawn.pins.length - 1; k >= 0; k--) {
      for (const { n, p } of drawn.pins[k].faces) if (Math.hypot(p.x - sx, p.y - sy) <= p.r + 3) return { ...n, screen: p };
    }
    let best = null;
    let bestD = Infinity;
    for (const pin of drawn.pins) {
      const d = Math.hypot(pin.x - sx, pin.y - sy);
      if (d < pin.R + 10 && d < bestD) { best = { kind: 'loc', ...pin.l }; bestD = d; }
    }
    if (best) return best;
    for (const fr of drawn.frags) if (Math.hypot(fr.x - sx, fr.y - sy) < fr.r) return { kind: 'frag', ...fr.f };
    return null;
  }

  // ---------- Ratón y pantalla táctil ----------
  const local = (e) => { const r = canvas.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };

  function onDown(e) {
    if (paused) return;
    canvas.setPointerCapture?.(e.pointerId);
    pointers.set(e.pointerId, local(e));
    vel = { x: 0, y: 0 };
    fly = null;
    if (pointers.size === 1) {
      const p = local(e);
      const rot = r3d && (e.button === 2 || e.button === 1 || e.shiftKey);
      gesture = { kind: rot ? 'rotate' : 'pan', sx: p.x, sy: p.y, x: p.x, y: p.y, moved: rot, t: performance.now() };
    } else if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      gesture = { kind: 'pinch', d: Math.hypot(a.x - b.x, a.y - b.y), ang: Math.atan2(b.y - a.y, b.x - a.x), mx: (a.x + b.x) / 2, my: (a.y + b.y) / 2, moved: true };
    }
  }

  function onMove(e) {
    const p = local(e);
    if (!pointers.has(e.pointerId)) {
      // Solo ratón: resaltar lo que hay debajo.
      if (e.pointerType === 'mouse' && !paused) {
        hover = thingAt(p.x, p.y);
        canvas.style.cursor = hover ? 'pointer' : 'grab';
        updatePrompt();
      }
      return;
    }
    pointers.set(e.pointerId, p);
    if (!gesture) return;
    if (gesture.kind === 'rotate' && pointers.size === 1) {
      yaw -= (p.x - gesture.x) * 0.006;
      pitch += (p.y - gesture.y) * 0.004;
      gesture.x = p.x; gesture.y = p.y;
      canvas.style.cursor = 'move';
      clampView();
      return;
    }
    if (gesture.kind === 'pan' && pointers.size === 1) {
      const dx = p.x - gesture.x;
      const dy = p.y - gesture.y;
      if (!gesture.moved && Math.hypot(p.x - gesture.sx, p.y - gesture.sy) > TAP) gesture.moved = true;
      if (gesture.moved) {
        panBy(dx, dy);
        const now = performance.now();
        const dtm = Math.max(1, now - gesture.t) / 1000;
        vel = { x: dx / dtm * 0.6 + vel.x * 0.4, y: dy / dtm * 0.6 + vel.y * 0.4 };
        gesture.t = now;
        canvas.style.cursor = 'grabbing';
        hover = null;
        clampView();
      }
      gesture.x = p.x;
      gesture.y = p.y;
    } else if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      const mx = (a.x + b.x) / 2;
      const my = (a.y + b.y) / 2;
      const ang = Math.atan2(b.y - a.y, b.x - a.x);
      if (gesture.kind !== 'pinch') gesture = { kind: 'pinch', d, ang, mx, my, moved: true };
      panBy(mx - gesture.mx, my - gesture.my);
      zoomAt(d / Math.max(1, gesture.d), mx, my);
      // Girar con dos dedos en 3D
      if (r3d) {
        let da = ang - gesture.ang;
        if (da > Math.PI) da -= Math.PI * 2;
        if (da < -Math.PI) da += Math.PI * 2;
        yaw += da;
        clampView();
      }
      gesture.d = d; gesture.ang = ang; gesture.mx = mx; gesture.my = my;
    }
  }

  function onUp(e) {
    if (!pointers.has(e.pointerId)) return;
    const p = local(e);
    pointers.delete(e.pointerId);
    const g = gesture;
    if (pointers.size === 0) {
      gesture = null;
      canvas.style.cursor = 'grab';
      if (g && g.kind === 'pan' && !g.moved && e.type === 'pointerup') {
        vel = { x: 0, y: 0 };
        const thing = thingAt(p.x, p.y);
        if (thing) { hover = thing; open(thing); }
      } else if (performance.now() - (g?.t || 0) > 90) vel = { x: 0, y: 0 };
    } else if (pointers.size === 1) {
      const [q] = [...pointers.values()];
      gesture = { kind: 'pan', sx: q.x, sy: q.y, x: q.x, y: q.y, moved: true, t: performance.now() };
    }
  }

  function onWheel(e) {
    e.preventDefault();
    if (paused) return;
    const p = local(e);
    zoomAt(Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0015)), p.x, p.y);
  }

  function onDbl(e) {
    if (paused) return;
    const p = local(e);
    if (!thingAt(p.x, p.y)) zoomAt(1.6, p.x, p.y);
  }

  function onMiniClick(e) {
    if (paused) return;
    const r = mini.getBoundingClientRect();
    flyTo(((e.clientX - r.left) / r.width) * map.w, ((e.clientY - r.top) / r.height) * map.h);
  }

  /** Procesa las pulsaciones de teclado. */
  function onKey(e) {
    if (!running || e.target.matches?.('input, textarea, select')) return;
    const k = e.key.toLowerCase();
    if (e.type === 'keydown') {
      if (paused) return;
      if (k === 'e' || k === 'enter') return interact();
      if (k === '+' || k === '=') return zoomAt(1.25);
      if (k === '-') return zoomAt(0.8);
      if (k === '0') return flyTo(map.w / 2, map.h / 2, fit);
      keys.add(k);
    } else keys.delete(k);
  }

  /** Botones de zoom, encuadre y cambio de ciudad (pensados para tableta). */
  function buildControls() {
    ctrls?.remove();
    const mk = (label, title, fn, cls = '') => {
      const b = document.createElement('button');
      b.className = `map-ctrl ${cls}`;
      b.type = 'button';
      b.title = title;
      b.setAttribute('aria-label', title);
      b.textContent = label;
      b.addEventListener('click', (e) => { e.stopPropagation(); if (!paused) { Audio2.sfx.click(); fn(); } });
      return b;
    };
    ctrls = document.createElement('div');
    ctrls.className = 'map-ctrls';
    ctrls.append(
      mk('+', 'Acercar', () => zoomAt(1.35)),
      mk('−', 'Alejar', () => zoomAt(0.74)),
      mk('◎', 'Ver toda la ciudad', () => flyTo(map.w / 2, map.h / 2, fit)),
      ...(window.World3D ? [
        mk('⟲', 'Girar a la izquierda', () => { yaw += Math.PI / 8; clampView(); }, 'only3d'),
        mk('⟳', 'Girar a la derecha', () => { yaw -= Math.PI / 8; clampView(); }, 'only3d'),
        mk(r3d ? '2D' : '3D', r3d ? 'Ver el mapa en 2D' : 'Ver la ciudad en 3D', () => { G.world.view = r3d ? '2d' : '3d'; setMap(mapId); }, 'mapview'),
      ] : []),
      mk('★', 'Ir al objetivo', () => {
        const o = objectiveLoc();
        if (!o) return;
        if (o.map !== mapId) { const br = map.def.locations.find((l) => l.travel); if (br) flyTo(br.x, br.y, fit * 1.8); return; }
        flyTo(o.x, o.y, Math.max(zoom, fit * 1.8));
      }, 'gold'),
    );
    const other = mapId === 'zaun' ? 'piltover' : 'zaun';
    const sw = mk(mapId === 'zaun' ? 'Subir a Aurelia' : 'Bajar a Nácar', `Ver ${W().maps[other].label}`, () => {
      const br = map.def.locations.find((l) => l.travel);
      setMap(other, br?.travel?.at);
      cb.onTravel?.(other);
    }, 'city');
    ctrls.append(sw);
    canvas.parentElement.append(ctrls);
  }

  // ---------- Bucle ----------
  let fpsEl = null;
  let fpsN = 0;
  let fpsT = 0;
  function fpsMeter(t) {
    if (!opt().showFps) { fpsEl?.remove(); fpsEl = null; return; }
    if (!fpsEl) { fpsEl = document.createElement('div'); fpsEl.className = 'fps-meter'; document.body.append(fpsEl); }
    fpsN++;
    if (t - fpsT >= 500) { fpsEl.textContent = `${Math.round((fpsN * 1000) / (t - fpsT))} FPS`; fpsN = 0; fpsT = t; }
  }

  function frame(t, id) {
    if (!running || id !== loopId) return;
    const dt = Math.min(0.05, (t - last) / 1000 || 0);
    last = t;
    requestAnimationFrame((nt) => frame(nt, id));
    // Con un minijuego o una cinemática a pantalla completa encima no hace falta dibujar.
    if (paused && document.querySelector('.mg:not(.out), .cine, .scene2d')) return;
    try {
      if (!paused) update(dt);
      else if (fly) update(dt);
      draw(t, dt);
      fpsMeter(t);
    } catch (err) {
      console.error(err);
    }
  }

  /** Adapta el lienzo a la pantalla (nítido en pantallas de alta densidad). */
  function resize() {
    if (!canvas || !map) return;
    const box = canvas.parentElement.getBoundingClientRect();
    const rel = zoom / (fit || 1);
    cw = Math.max(320, Math.floor(box.width));
    ch = Math.max(240, Math.floor(box.height));
    // Limit fill-rate on high-density screens while keeping map labels readable.
    dpr = Math.min(1.5, window.devicePixelRatio || 1);
    canvas.width = Math.round(cw * dpr);
    canvas.height = Math.round(ch * dpr);
    fit = Math.min(cw / map.w, (ch - PAD_TOP - PAD_BOTTOM) / map.h);
    if (r3d) fit *= 1.35; // en perspectiva la ciudad entera cabe más cerca
    zoom = fit * (rel || 1);
    r3d?.resize(cw, ch, dpr);
    clampView();
  }

  window.addEventListener('keydown', onKey);
  window.addEventListener('keyup', onKey);
  window.addEventListener('blur', () => keys.clear());
  window.addEventListener('resize', () => resize());

  /** Cambia de ciudad y encuadra el lugar de llegada. */
  function setMap(id, atLocId) {
    mapId = id;
    backdropKey = '';
    backdrop = null;
    map = buildMap(id);
    G.world.map = id;
    window.App?.setCity?.(id);
    use3d(G.world.view !== '2d');
    resize();
    const loc = atLocId && map.def.locations.find((l) => l.id === atLocId);
    if (loc) {
      G.world.at = loc.id;
      zoom = fit * 1.7;
      G.world.x = loc.x;
      G.world.y = loc.y;
    } else {
      zoom = fit * Math.max(0.92, G.world.zoom || 1.25);
    }
    fly = null;
    vel = { x: 0, y: 0 };
    // La cámara se pone del lado del centro de la ciudad, mirando hacia fuera desde los bordes
    // (al llegar por el puente se ve el cielo y el mar, no la pared del acantilado).
    yaw = loc ? Math.atan2(map.w / 2 - loc.x, map.h / 2 - loc.y) : 0;
    pitch = id === 'zaun' ? 1.05 : 1.02;
    clampView();
    hover = null;
    particles = [];
    lastDistrict = '';
    fade = 1;
    if (canvas.parentElement) buildControls();
    Audio2.playMusic(cb.music?.() || id);
  }

  /** Activa la escena 3D (si hay WebGL) o vuelve a la carta 2D. */
  function use3d(on) {
    if (on && window.World3D) {
      try {
        if (!r3d) r3d = window.World3D.create(canvas.parentElement);
        if (r3d) {
          const b = canvas.parentElement.getBoundingClientRect();
          r3d.resize(Math.max(320, b.width), Math.max(240, b.height), Math.min(2, window.devicePixelRatio || 1));
          r3d.setMap(map, paintBackground(true));
          if (!map.bg) paintBackground();
        }
      } catch (err) {
        console.error('Mapa 3D desactivado:', err);
        r3d?.dispose();
        r3d = null;
      }
    } else if (r3d) {
      r3d.dispose();
      r3d = null;
    }
    canvas.classList.toggle('over-3d', Boolean(r3d));
    canvas.parentElement?.classList.toggle('map-is-3d', Boolean(r3d));
  }

  window.World = {
    start(state, callbacks, el, miniEl) {
      G = state;
      cb = callbacks;
      canvas = el;
      ctx = canvas.getContext('2d');
      canvas.style.touchAction = 'none';
      canvas.style.cursor = 'grab';
      mini = miniEl;
      mctx = mini?.getContext('2d');
      canvas.addEventListener('pointerdown', onDown);
      canvas.addEventListener('pointermove', onMove);
      canvas.addEventListener('pointerup', onUp);
      canvas.addEventListener('pointercancel', onUp);
      canvas.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse' && !pointers.size) { hover = null; updatePrompt(); } });
      canvas.addEventListener('wheel', onWheel, { passive: false });
      canvas.addEventListener('dblclick', onDbl);
      canvas.addEventListener('contextmenu', (e) => e.preventDefault());
      mini?.addEventListener('click', onMiniClick);
      if (!G.world.map) {
        const spawn = W().spawns[G.player.district] || (G.player.origin === 'zaun' ? 'callejones' : 'plaza');
        setMap(G.player.origin, spawn);
      } else setMap(G.world.map);
      running = true;
      paused = false;
      const id = ++loopId;
      requestAnimationFrame((t) => { last = t; frame(t, id); });
    },
    stop() { running = false; keys.clear(); pointers.clear(); gesture = null; ctrls?.remove(); r3d?.dispose(); r3d = null; },
    pause(v) { paused = v; keys.clear(); pointers.clear(); gesture = null; if (v) { hover = null; updatePrompt(); } },
    interact,
    canInteract: () => !paused,
    rotate(d) { yaw += d; clampView(); },
    zoom(f) { zoomAt(f); },
    /** Centra el mapa en un lugar (cambia de ciudad si hace falta). */
    focus(id) {
      const l = locById(id);
      if (!l) return;
      if (l.map !== mapId) { setMap(l.map, id); return; }
      flyTo(l.x, l.y, Math.max(zoom, fit * 1.8));
    },
    travel(toMap, atLoc) { setMap(toMap, atLoc); },
    locById,
    placeURL,
    /** Posición en pantalla de un lugar (para pruebas y tutoriales). */
    screenOf(id) { const p = drawn.pins.find((x) => x.l.id === id); return p ? { x: p.x, y: p.y } : null; },
    is3d: () => Boolean(r3d),
    resize,
  };
})();
