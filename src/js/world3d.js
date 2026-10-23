// Escena 3D bajo el mapa interactivo (world.js pinta encima, en 2D, los medallones de los
// lugares, las caras y los rótulos). Nada de cubos sueltos ni de una imagen alrededor:
// - Aurelia: meseta de piedra sobre los acantilados, con cielo dorado, sol, mar de nubes y
//   torres con cúpulas de oro y tejados de cobre.
// - Nácar: una caverna oculta bajo Aurelia: bóveda de roca con estalactitas, grietas por las que
//   cae la luz de arriba, talleres de metal con luces verdes, tuberías y niebla de vapor.
// Las texturas se pintan a mano en lienzos (pinceladas, ruido, ventanas), sin descargar nada.
(function () {
  if (!window.THREE) return;
  const T = window.THREE;

  // ---------- Utilidades de pintura ----------
  function rng(seed) {
    let a = seed >>> 0;
    return () => {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function canvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
  function tex(c, repeat) {
    const t = new T.CanvasTexture(c);
    t.colorSpace = T.SRGBColorSpace;
    t.anisotropy = 4;
    if (repeat) { t.wrapS = t.wrapT = T.RepeatWrapping; t.repeat.set(repeat[0], repeat[1]); }
    return t;
  }
  /** Pinceladas: manchas alargadas semitransparentes, para que nada parezca plano. */
  function brush(g, w, h, colors, n, r, size = 1) {
    for (let i = 0; i < n; i++) {
      g.save();
      g.translate(r() * w, r() * h);
      g.rotate((r() - 0.5) * 0.6);
      g.globalAlpha = 0.05 + r() * 0.12;
      g.fillStyle = colors[Math.floor(r() * colors.length)];
      g.beginPath();
      g.ellipse(0, 0, (8 + r() * 30) * size, (2 + r() * 6) * size, 0, 0, Math.PI * 2);
      g.fill();
      g.restore();
    }
    g.globalAlpha = 1;
  }

  // Fachadas (lienzos de 256x512 que se repiten en altura)
  function facadeAurelia(seed) {
    const r = rng(seed);
    const c = canvas(256, 512);
    const g = c.getContext('2d');
    const base = ['#e2d3ad', '#d8c39a', '#ead9b6', '#cdb68a'][Math.floor(r() * 4)];
    g.fillStyle = base; g.fillRect(0, 0, 256, 512);
    brush(g, 256, 512, ['#f4e7c8', '#b99e70', '#c9b083', '#fff3d6'], 260, r);
    // Cornisas doradas
    for (let y = 0; y < 512; y += 128) {
      g.fillStyle = 'rgba(160,120,50,0.75)'; g.fillRect(0, y, 256, 7);
      g.fillStyle = 'rgba(255,230,160,0.6)'; g.fillRect(0, y + 7, 256, 2);
    }
    // Ventanales altos con arco
    for (let y = 22; y < 512; y += 128) {
      for (let x = 18; x < 256; x += 60) {
        g.fillStyle = 'rgba(70,60,40,0.55)';
        g.fillRect(x - 2, y - 2, 34, 84);
        const lit = r() < 0.35;
        const gr = g.createLinearGradient(0, y, 0, y + 80);
        gr.addColorStop(0, lit ? '#ffe9a8' : '#7fa7c0');
        gr.addColorStop(1, lit ? '#d9a54a' : '#3d5b72');
        g.fillStyle = gr;
        g.beginPath();
        g.moveTo(x, y + 80); g.lineTo(x, y + 15); g.arc(x + 15, y + 15, 15, Math.PI, 0); g.lineTo(x + 30, y + 80);
        g.closePath(); g.fill();
        g.strokeStyle = 'rgba(120,90,40,0.8)'; g.lineWidth = 2; g.stroke();
        g.beginPath(); g.moveTo(x + 15, y); g.lineTo(x + 15, y + 80); g.moveTo(x, y + 45); g.lineTo(x + 30, y + 45); g.stroke();
      }
    }
    return tex(c);
  }
  function facadeNácar(seed) {
    const r = rng(seed);
    const c = canvas(256, 512);
    const g = c.getContext('2d');
    const base = ['#2c2a33', '#33302b', '#26302c', '#3a2c30'][Math.floor(r() * 4)];
    g.fillStyle = base; g.fillRect(0, 0, 256, 512);
    brush(g, 256, 512, ['#4a3a2a', '#1a1a20', '#5a4630', '#2a3a34', '#6a4a2a'], 320, r);
    // Planchas remachadas y óxido
    g.strokeStyle = 'rgba(0,0,0,0.45)'; g.lineWidth = 2;
    for (let y = 0; y < 512; y += 64) { g.beginPath(); g.moveTo(0, y + r() * 6); g.lineTo(256, y + r() * 6); g.stroke(); }
    for (let x = 0; x < 256; x += 85) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x + r() * 8, 512); g.stroke(); }
    for (let i = 0; i < 40; i++) {
      g.fillStyle = `rgba(${120 + r() * 60},${60 + r() * 30},20,${0.15 + r() * 0.2})`;
      g.fillRect(r() * 256, r() * 512, 2 + r() * 6, 10 + r() * 40);
    }
    // Ventanucos con luz cálida o química
    for (let y = 18; y < 512; y += 64) {
      for (let x = 14; x < 256; x += 42 + Math.floor(r() * 20)) {
        if (r() < 0.35) continue;
        const col = r() < 0.7 ? `rgba(255,${170 + r() * 50},90,${0.6 + r() * 0.4})` : `rgba(120,255,${170 + r() * 60},${0.5 + r() * 0.4})`;
        g.fillStyle = col;
        g.fillRect(x, y, 16 + r() * 10, 18 + r() * 8);
        g.fillStyle = 'rgba(0,0,0,0.5)';
        g.fillRect(x + 8, y, 2, 24);
      }
    }
    return tex(c);
  }
  function rockTexture(seed, tint, repeat) {
    const r = rng(seed);
    const c = canvas(512, 512);
    const g = c.getContext('2d');
    g.fillStyle = tint[0]; g.fillRect(0, 0, 512, 512);
    brush(g, 512, 512, tint, 900, r, 1.6);
    for (let i = 0; i < 26; i++) {
      g.strokeStyle = `rgba(0,0,0,${0.08 + r() * 0.14})`;
      g.lineWidth = 1 + r() * 2;
      g.beginPath();
      let x = r() * 512; let y = r() * 512;
      g.moveTo(x, y);
      for (let k = 0; k < 5; k++) { x += (r() - 0.5) * 60; y += r() * 40; g.lineTo(x, y); }
      g.stroke();
    }
    return tex(c, repeat);
  }
  function softSprite(inner, outer, size = 128) {
    const c = canvas(size, size);
    const g = c.getContext('2d');
    const gr = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gr.addColorStop(0, inner); gr.addColorStop(1, outer);
    g.fillStyle = gr; g.fillRect(0, 0, size, size);
    return tex(c);
  }
  function cloudSprite(seed) {
    const r = rng(seed);
    const c = canvas(256, 128);
    const g = c.getContext('2d');
    for (let i = 0; i < 26; i++) {
      const x = 40 + r() * 176; const y = 50 + r() * 40; const rad = 18 + r() * 36;
      const gr = g.createRadialGradient(x, y, 0, x, y, rad);
      gr.addColorStop(0, 'rgba(255,248,232,0.55)');
      gr.addColorStop(0.6, 'rgba(255,226,180,0.25)');
      gr.addColorStop(1, 'rgba(255,220,170,0)');
      g.fillStyle = gr; g.fillRect(0, 0, 256, 128);
    }
    return tex(c);
  }
  function skyTexture() {
    const c = canvas(16, 512);
    const g = c.getContext('2d');
    const gr = g.createLinearGradient(0, 0, 0, 512);
    gr.addColorStop(0, '#2b4f7a');
    gr.addColorStop(0.32, '#6f97b8');
    gr.addColorStop(0.47, '#f2d39a');
    gr.addColorStop(0.53, '#f6c27a');
    gr.addColorStop(0.62, '#c99a6a');
    gr.addColorStop(1, '#6a5a52');
    g.fillStyle = gr; g.fillRect(0, 0, 16, 512);
    return tex(c);
  }

  // Ruido sencillo para deformar la roca
  function noise3(x, y, z) {
    const s = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453;
    return s - Math.floor(s);
  }
  function smoothNoise(x, y, z) {
    let v = 0; let a = 1; let f = 1; let n = 0;
    for (let o = 0; o < 4; o++) {
      const xi = Math.floor(x * f); const yi = Math.floor(y * f); const zi = Math.floor(z * f);
      const xf = x * f - xi; const yf = y * f - yi; const zf = z * f - zi;
      const l = (a1, b1, t) => a1 + (b1 - a1) * (t * t * (3 - 2 * t));
      const c = (dx, dy, dz) => noise3(xi + dx, yi + dy, zi + dz);
      const x00 = l(c(0, 0, 0), c(1, 0, 0), xf); const x10 = l(c(0, 1, 0), c(1, 1, 0), xf);
      const x01 = l(c(0, 0, 1), c(1, 0, 1), xf); const x11 = l(c(0, 1, 1), c(1, 1, 1), xf);
      v += l(l(x00, x10, yf), l(x01, x11, yf), zf) * a;
      n += a; a *= 0.5; f *= 2;
    }
    return v / n;
  }

  // ---------- Construcción de cada ciudad ----------
  function quality() {
    const q = window.App?.settings?.quality || 'alta';
    return { baja: 0.45, media: 0.75, alta: 1, ultra: 1 }[q] ?? 1;
  }

  /** Edificios instanciados: un cuerpo por fachada y remates (tejados, cúpulas, agujas). */
  function buildings(group, map, nacar) {
    const r = rng(map.def.seed * 7 + 3);
    const q = quality();
    const list = map.buildings.filter(() => r() < q);
    const nFac = 4;
    const bodies = Array.from({ length: nFac }, () => []);
    const roofs = [];
    const domes = [];
    const spires = [];
    const neons = [];
    const towers = [];
    const cornices = [];
    const locs = map.def.locations;
    for (const b of list) {
      const cx = b.x + b.w / 2;
      const cz = b.y + b.h / 2;
      // Más altos cerca de los lugares importantes (Consejo, Academia, la Fábrica)
      const near = Math.min(...locs.map((l) => Math.hypot(l.x - cx, l.y - cz)));
      const boost = Math.max(0, 1 - near / 700);
      let h;
      if (nacar) h = 70 + r() * 160 + boost * 120 + (b.tall > 0.85 ? 160 : 0);
      else h = 60 + r() * 120 + boost * 160 + (b.tall > 0.9 ? 220 : 0);
      const shrink = nacar ? 0.92 : 0.86;
      const w = b.w * shrink; const d = b.h * shrink;
      // Aurelia: algunas torres redondas con cúpula, el resto edificios escalonados con cornisas.
      if (!nacar && r() < 0.22) {
        const rad = Math.min(w, d) * 0.42;
        towers.push({ x: cx, y: h / 2, z: cz, r: rad, h });
        cornices.push({ x: cx, y: h * 0.62, z: cz, sx: rad * 2.25, sy: 7, sz: rad * 2.25 });
        domes.push({ x: cx, y: h, z: cz, s: rad * 1.02 });
        spires.push({ x: cx, y: h + rad, z: cz });
        continue;
      }
      const tiers = nacar ? 1 + Math.floor(r() * 3) : h > 240 ? 3 : h > 130 ? 2 : 1;
      let y0 = 0; let tw = w; let td = d;
      for (let t = 0; t < tiers; t++) {
        const th = h / tiers;
        const ox = nacar ? (r() - 0.5) * w * 0.25 : 0;
        const oz = nacar ? (r() - 0.5) * d * 0.25 : 0;
        bodies[Math.floor(r() * nFac)].push({ x: cx + ox, y: y0 + th / 2, z: cz + oz, sx: tw, sy: th, sz: td, ry: nacar ? (r() - 0.5) * 0.2 : 0 });
        if (nacar && r() < 0.55) neons.push({ x: cx + ox, y: y0 + th * (0.3 + r() * 0.6), z: cz + oz + td / 2 + 1, sx: tw * (0.3 + r() * 0.5), c: Math.floor(r() * 4) });
        y0 += th;
        if (!nacar) cornices.push({ x: cx, y: y0, z: cz, sx: tw * 1.08, sy: 6, sz: td * 1.08 });
        tw *= nacar ? 0.8 + r() * 0.25 : 0.72;
        td *= nacar ? 0.8 + r() * 0.25 : 0.72;
      }
      if (!nacar) {
        // Remate sobre el último piso (tw/td ya están reducidos para el siguiente)
        const lw = tw / 0.72; const ld = td / 0.72;
        if (h > 200 && r() < 0.55) { domes.push({ x: cx, y: y0, z: cz, s: Math.min(lw, ld) * 0.45 }); spires.push({ x: cx, y: y0 + Math.min(lw, ld) * 0.42, z: cz }); } else roofs.push({ x: cx, y: y0, z: cz, sx: lw * 0.98, sy: 14 + Math.min(lw, ld) * 0.35, sz: ld * 0.98 });
      } else if (r() < 0.4) roofs.push({ x: cx, y: y0, z: cz, sx: tw * 1.1, sy: 10 + r() * 20, sz: td * 1.1 });
    }
    const dummy = new T.Object3D();
    const inst = (geo, mat, arr, set) => {
      if (!arr.length) return;
      const m = new T.InstancedMesh(geo, mat, arr.length);
      arr.forEach((o, i) => { dummy.position.set(0, 0, 0); dummy.rotation.set(0, 0, 0); dummy.scale.set(1, 1, 1); set(o); dummy.updateMatrix(); m.setMatrixAt(i, dummy.matrix); });
      m.castShadow = true; m.receiveShadow = true;
      group.add(m);
      return m;
    };
    const box = new T.BoxGeometry(1, 1, 1);
    bodies.forEach((arr, i) => {
      const mat = new T.MeshStandardMaterial({ map: nacar ? facadeNácar(map.def.seed + i) : facadeAurelia(map.def.seed + i), roughness: nacar ? 0.85 : 0.7, metalness: nacar ? 0.25 : 0.05 });
      if (nacar) { mat.emissive = new T.Color('#ffb070'); mat.emissiveMap = mat.map; mat.emissiveIntensity = 0.28; }
      inst(box, mat, arr, (o) => { dummy.position.set(o.x, o.y, o.z); dummy.rotation.y = o.ry; dummy.scale.set(o.sx, o.sy, o.sz); });
    });
    // Torres redondas y cornisas doradas
    if (!nacar) {
      inst(new T.CylinderGeometry(1, 1.06, 1, 16, 1), new T.MeshStandardMaterial({ map: facadeAurelia(map.def.seed + 9), roughness: 0.7 }), towers,
        (o) => { dummy.position.set(o.x, o.y, o.z); dummy.scale.set(o.r, o.h, o.r); });
      inst(box, new T.MeshStandardMaterial({ color: '#c9a04a', roughness: 0.45, metalness: 0.7 }), cornices,
        (o) => { dummy.position.set(o.x, o.y, o.z); dummy.scale.set(o.sx, o.sy, o.sz); });
    }
    // Tejados a cuatro aguas de cobre verdoso (Aurelia) o chapa (Nácar)
    const pyr = new T.ConeGeometry(0.71, 1, 4, 1);
    pyr.rotateY(Math.PI / 4);
    pyr.translate(0, 0.5, 0);
    inst(pyr, new T.MeshStandardMaterial({ color: nacar ? '#3a3430' : '#4f9a8c', roughness: 0.6, metalness: nacar ? 0.4 : 0.35, flatShading: true }), roofs,
      (o) => { dummy.position.set(o.x, o.y, o.z); dummy.scale.set(o.sx, o.sy, o.sz); });
    // Cúpulas doradas y agujas
    const dome = new T.SphereGeometry(1, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2);
    inst(dome, new T.MeshStandardMaterial({ color: '#d9a640', roughness: 0.3, metalness: 0.85, emissive: '#5a3a08', emissiveIntensity: 0.3 }), domes,
      (o) => { dummy.position.set(o.x, o.y, o.z); dummy.scale.set(o.s, o.s * 1.1, o.s); });
    const spire = new T.ConeGeometry(4, 70, 8);
    spire.translate(0, 35, 0);
    inst(spire, new T.MeshStandardMaterial({ color: '#e8c060', roughness: 0.3, metalness: 0.9 }), spires, (o) => { dummy.position.set(o.x, o.y, o.z); });
    // Neones de Nácar
    if (nacar && neons.length) {
      const cols = ['#55e6a8', '#3fffd0', '#b6ff3f', '#2fbf8f'];
      cols.forEach((c, ci) => {
        inst(new T.BoxGeometry(1, 5, 2), new T.MeshBasicMaterial({ color: c, toneMapped: false }), neons.filter((n) => n.c === ci),
          (o) => { dummy.position.set(o.x, o.y, o.z); dummy.scale.set(o.sx, 1, 1); });
      });
    }
  }

  /** Suelo: la carta pintada de la ciudad (calles, barrios, agua) como textura. */
  function ground(group, map, groundCanvas, nacar) {
    const t = tex(groundCanvas);
    const geo = new T.PlaneGeometry(map.w, map.h, 1, 1);
    geo.rotateX(-Math.PI / 2);
    geo.translate(map.w / 2, 0, map.h / 2);
    const m = new T.Mesh(geo, new T.MeshStandardMaterial({ map: t, roughness: 0.95, metalness: 0 }));
    m.receiveShadow = true;
    group.add(m);
    // Bordes de la meseta: acantilado de piedra (Aurelia) o roca húmeda (Nácar)
    const rock = rockTexture(nacar ? 21 : 9, nacar ? ['#23261f', '#34362c', '#1a1d18', '#3b3a2c'] : ['#8a7a64', '#6e604e', '#a8957a', '#5a4e40', '#c2ae8a'], [8, 1]);
    const depth = nacar ? 260 : 900;
    const sides = [
      [map.w, map.w / 2, -depth / 2, 0, 0], [map.w, map.w / 2, -depth / 2, map.h, Math.PI],
      [map.h, 0, -depth / 2, map.h / 2, -Math.PI / 2], [map.h, map.w, -depth / 2, map.h / 2, Math.PI / 2],
    ];
    for (const [len, x, y, z, ry] of sides) {
      const g2 = new T.PlaneGeometry(len, depth, 40, 8);
      const pos = g2.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const px = pos.getX(i); const py = pos.getY(i);
        const k = (py + depth / 2) / depth; // 0 abajo, 1 arriba
        pos.setZ(i, (smoothNoise(px * 0.004, py * 0.006, ry) - 0.5) * 160 * (1 - k * 0.7) - (1 - k) * 120);
      }
      g2.computeVertexNormals();
      const s = new T.Mesh(g2, new T.MeshStandardMaterial({ map: rock, roughness: 1, side: T.DoubleSide }));
      s.position.set(x, y, z);
      s.rotation.y = ry;
      group.add(s);
    }
  }

  function aureliaWorld(scene, map) {
    const r = rng(77);
    scene.background = null;
    // Cielo: gran esfera con degradado dorado; el sol y un mar de nubes por debajo de la meseta.
    const sky = new T.Mesh(new T.SphereGeometry(16000, 32, 16), new T.MeshBasicMaterial({ map: skyTexture(), side: T.BackSide, fog: false, depthWrite: false }));
    sky.position.set(map.w / 2, 0, map.h / 2);
    scene.add(sky);
    const sun = new T.Sprite(new T.SpriteMaterial({ map: softSprite('rgba(255,244,210,1)', 'rgba(255,200,120,0)'), blending: T.AdditiveBlending, fog: false, depthWrite: false }));
    sun.scale.set(5200, 5200, 1);
    sun.position.set(map.w / 2 + 9000, 1200, map.h / 2 - 9000);
    scene.add(sun);
    const cloudTex = [cloudSprite(1), cloudSprite(2), cloudSprite(3)];
    const clouds = new T.Group();
    for (let i = 0; i < 70; i++) {
      const a = r() * Math.PI * 2;
      const dist = 2600 + r() * 7000;
      const s = new T.Sprite(new T.SpriteMaterial({ map: cloudTex[i % 3], transparent: true, depthWrite: false, opacity: 0.55 + r() * 0.35, fog: false }));
      const w = 1600 + r() * 2600;
      s.scale.set(w, w * 0.45, 1);
      s.position.set(map.w / 2 + Math.cos(a) * dist, -900 + r() * 700 + (dist > 6000 ? r() * 1500 : 0), map.h / 2 + Math.sin(a) * dist);
      s.userData.v = 8 + r() * 14;
      clouds.add(s);
    }
    // Mar de nubes pegado al pie del acantilado: la meseta flota sobre él.
    for (let i = 0; i < 46; i++) {
      const side = i % 4;
      const u = r();
      const x = side < 2 ? u * map.w : side === 2 ? -150 : map.w + 150;
      const z = side === 0 ? -150 : side === 1 ? map.h + 150 : u * map.h;
      const s = new T.Sprite(new T.SpriteMaterial({ map: cloudTex[i % 3], transparent: true, depthWrite: false, opacity: 0.9, fog: false }));
      const w = 1300 + r() * 1300;
      s.scale.set(w, w * 0.5, 1);
      s.position.set(x, -380 - r() * 380, z);
      s.userData.v = 0;
      clouds.add(s);
    }
    // Algunas nubes altas sobre la ciudad
    for (let i = 0; i < 10; i++) {
      const s = new T.Sprite(new T.SpriteMaterial({ map: cloudTex[i % 3], transparent: true, depthWrite: false, opacity: 0.35, fog: false }));
      s.scale.set(1400, 600, 1);
      s.position.set(r() * map.w, 1700 + r() * 600, r() * map.h);
      s.userData.v = 18;
      clouds.add(s);
    }
    scene.add(clouds);
    scene.fog = new T.Fog('#e9d3a6', 3500, 14000);
    scene.add(new T.HemisphereLight('#fff1d0', '#6a5a42', 1.2));
    const key = new T.DirectionalLight('#ffd89a', 2.2);
    key.position.set(map.w / 2 + 1800, 2600, map.h / 2 - 1600);
    key.target.position.set(map.w / 2, 0, map.h / 2);
    scene.add(key, key.target);
    return { key, tick(t, dt) { clouds.children.forEach((c) => { c.position.x += c.userData.v * dt; if (c.position.x > map.w / 2 + 9500) c.position.x -= 19000; }); } };
  }

  function nacarWorld(scene, map) {
    const r = rng(31);
    scene.background = new T.Color('#05080a');
    // Caverna: un elipsoide de roca visto desde dentro, deformado con ruido, con estalactitas.
    const geo = new T.SphereGeometry(1, 96, 48);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i); const y = pos.getY(i); const z = pos.getZ(i);
      const n = smoothNoise(x * 3 + 5, y * 3, z * 3);
      const k = 1 + (n - 0.5) * 0.35;
      pos.setXYZ(i, x * k, y * k, z * k);
    }
    geo.computeVertexNormals();
    const caveMat = new T.MeshStandardMaterial({ map: rockTexture(5, ['#1d2420', '#2a312a', '#141a16', '#36392c', '#20302a'], [10, 6]), roughness: 1, side: T.BackSide });
    const cave = new T.Mesh(geo, caveMat);
    cave.scale.set(3300, 1500, 2700);
    cave.position.set(map.w / 2, 150, map.h / 2);
    scene.add(cave);
    // Estalactitas colgando de la bóveda
    const stal = new T.ConeGeometry(1, 1, 7, 1);
    stal.rotateX(Math.PI);
    stal.translate(0, -0.5, 0);
    const n = Math.round(160 * quality());
    const im = new T.InstancedMesh(stal, new T.MeshStandardMaterial({ color: '#2a2f28', roughness: 1, flatShading: true }), n);
    const dmy = new T.Object3D();
    for (let i = 0; i < n; i++) {
      const x = r() * map.w; const z = r() * map.h;
      const nx = (x - map.w / 2) / 3300; const nz = (z - map.h / 2) / 2700;
      const top = 150 + 1500 * Math.sqrt(Math.max(0, 1 - nx * nx - nz * nz)) * 0.9;
      const len = 120 + r() * 420;
      dmy.position.set(x, top, z);
      dmy.scale.set(18 + r() * 40, len, 18 + r() * 40);
      dmy.updateMatrix();
      im.setMatrixAt(i, dmy.matrix);
    }
    scene.add(im);
    // Grietas por las que se cuela la luz de Aurelia
    const shafts = new T.Group();
    const shaftMat = new T.MeshBasicMaterial({ color: '#ffe0a0', transparent: true, opacity: 0.08, blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide, fog: false });
    for (let i = 0; i < 6; i++) {
      const c = new T.Mesh(new T.CylinderGeometry(40 + r() * 40, 260 + r() * 200, 1700, 16, 1, true), shaftMat);
      c.position.set(300 + r() * (map.w - 600), 850, 300 + r() * (map.h - 600));
      c.rotation.z = (r() - 0.5) * 0.25;
      shafts.add(c);
    }
    scene.add(shafts);
    // Tuberías gruesas cruzando la ciudad a distintas alturas
    const pipeMat = new T.MeshStandardMaterial({ color: '#8a6a44', roughness: 0.45, metalness: 0.7, emissive: '#2a1a08', emissiveIntensity: 0.4 });
    const greenPipe = new T.MeshStandardMaterial({ color: '#3d5a2a', roughness: 0.4, metalness: 0.6, emissive: '#3fff7a', emissiveIntensity: 0.12 });
    for (let i = 0; i < 7; i++) {
      const y0 = 300 + r() * 500;
      const pts = [];
      const zStart = r() * map.h;
      for (let k = 0; k <= 6; k++) pts.push(new T.Vector3((map.w / 6) * k, y0 + Math.sin(k + i) * 60, zStart + Math.sin(k * 1.3 + i) * 260));
      const curve = new T.CatmullRomCurve3(pts);
      const tube = new T.Mesh(new T.TubeGeometry(curve, 60, 5 + r() * 6, 8, false), i % 3 === 0 ? greenPipe : pipeMat);
      tube.castShadow = true;
      scene.add(tube);
    }
    // Luz: ambiente químico, la luz fría que cae de arriba y faroles de neón
    scene.fog = new T.FogExp2('#0d1a14', 0.00022);
    scene.add(new T.HemisphereLight('#7fd8c0', '#1a120a', 0.9));
    const key = new T.DirectionalLight('#ffe7b0', 1.0);
    key.position.set(map.w / 2 - 400, 2400, map.h / 2 - 800);
    key.target.position.set(map.w / 2, 0, map.h / 2);
    scene.add(key, key.target);
    const lamps = [];
    const lampCols = ['#3fffd0', '#55e6a8', '#b6ff3f', '#ffb060'];
    for (let i = 0; i < 6; i++) {
      const l = new T.PointLight(lampCols[i % 4], 2.5, 1300, 1.4);
      l.position.set(300 + r() * (map.w - 600), 140 + r() * 120, 300 + r() * (map.h - 600));
      scene.add(l);
      lamps.push(l);
    }
    // Esporas y gotas brillantes
    const spores = new T.Points(new T.BufferGeometry(), new T.PointsMaterial({ color: '#9fffb0', size: 10, transparent: true, opacity: 0.6, blending: T.AdditiveBlending, depthWrite: false, map: softSprite('rgba(255,255,255,1)', 'rgba(255,255,255,0)', 32) }));
    const P = new Float32Array(600 * 3);
    for (let i = 0; i < 600; i++) { P[i * 3] = r() * map.w; P[i * 3 + 1] = r() * 900; P[i * 3 + 2] = r() * map.h; }
    spores.geometry.setAttribute('position', new T.BufferAttribute(P, 3));
    scene.add(spores);
    return {
      key,
      tick(t, dt) {
        lamps.forEach((l, i) => { l.intensity = 2.2 + Math.sin(t * 3 + i * 1.7) * 0.4 + (Math.sin(t * 23 + i) > 0.97 ? -1.2 : 0); });
        const a = spores.geometry.attributes.position;
        for (let i = 0; i < a.count; i++) { let y = a.getY(i) + dt * 12; if (y > 900) y = 0; a.setY(i, y); }
        a.needsUpdate = true;
        shafts.children.forEach((s, i) => { s.material.opacity = 0.07 + Math.sin(t * 0.4 + i) * 0.02; });
      },
    };
  }

  /** Canal químico del Sumidero / mar bajo Aurelia: agua animada. */
  function water(group, map, nacar) {
    if (nacar) {
      const pts = [[-50, 1780], [700, 1640], [1300, 1980], [1900, 1800], [2400, 1640], [2700, 1960], [3050, 1760]].map(([x, z]) => new T.Vector3(x, 3, z));
      const curve = new T.CatmullRomCurve3(pts);
      const shape = new T.Mesh(new T.TubeGeometry(curve, 80, 55, 6, false), new T.MeshBasicMaterial({ color: '#7dff5a', transparent: true, opacity: 0.35, toneMapped: false }));
      shape.scale.y = 0.05;
      group.add(shape);
      return null;
    }
    const m = new T.Mesh(new T.PlaneGeometry(40000, 40000), new T.MeshStandardMaterial({ color: '#4d7a96', roughness: 0.25, metalness: 0.4, transparent: true, opacity: 0.9 }));
    m.rotation.x = -Math.PI / 2;
    m.position.set(map.w / 2, -950, map.h / 2);
    group.add(m);
    return m;
  }

  // ---------- Renderizador ----------
  function create(container) {
    let renderer;
    try {
      renderer = new T.WebGLRenderer({ antialias: quality() > 0.6, alpha: false, powerPreference: 'high-performance' });
    } catch (err) {
      return null;
    }
    if (!renderer.getContext()) return null;
    renderer.outputColorSpace = T.SRGBColorSpace;
    renderer.toneMapping = T.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    const shadows = quality() >= 1 && window.App?.settings?.shadows !== false;
    renderer.shadowMap.enabled = shadows;
    renderer.shadowMap.type = T.PCFSoftShadowMap;
    const el = renderer.domElement;
    el.className = 'world-3d';
    container.prepend(el);
    const camera = new T.PerspectiveCamera(45, 1, 10, 40000);
    const FOV_T = Math.tan((45 * Math.PI) / 360);
    let scene = null;
    let world = null;
    let w = 1; let h = 1;
    const ray = new T.Raycaster();
    const plane = new T.Plane(new T.Vector3(0, 1, 0), 0);
    const v = new T.Vector3();
    let cam = { x: 0, y: 0, zoom: 1, yaw: 0, pitch: 0.9 };

    function setMap(map, groundCanvas) {
      if (scene) scene.traverse((o) => { o.geometry?.dispose(); if (o.material) [].concat(o.material).forEach((m) => { m.map?.dispose(); m.dispose(); }); });
      scene = new T.Scene();
      const nacar = map.id === 'nacar';
      const group = new T.Group();
      ground(group, map, groundCanvas, nacar);
      buildings(group, map, nacar);
      water(group, map, nacar);
      scene.add(group);
      world = nacar ? nacarWorld(scene, map) : aureliaWorld(scene, map);
      if (shadows && world.key) {
        world.key.castShadow = true;
        const s = world.key.shadow;
        s.mapSize.set(2048, 2048);
        s.camera.left = -map.w * 0.6; s.camera.right = map.w * 0.6; s.camera.top = map.h * 0.75; s.camera.bottom = -map.h * 0.75;
        s.camera.near = 100; s.camera.far = 6000;
        s.bias = -0.0005;
      }
    }

    /** Distancia de la cámara para que el zoom (px por unidad en el centro) se respete. */
    function place(c) {
      cam = c;
      const d = (h / 2) / (c.zoom * FOV_T);
      const sp = Math.sin(c.pitch);
      camera.position.set(c.x + d * sp * Math.sin(c.yaw), d * Math.cos(c.pitch), c.y + d * sp * Math.cos(c.yaw));
      camera.lookAt(c.x, 0, c.y);
      camera.updateMatrixWorld();
    }

    return {
      el,
      setMap,
      resize(cw, ch, dpr) {
        w = cw; h = ch;
        renderer.setPixelRatio(Math.min(dpr, quality() < 0.6 ? 1 : 2));
        renderer.setSize(cw, ch, false);
        el.style.width = cw + 'px'; el.style.height = ch + 'px';
        camera.aspect = cw / ch;
        camera.updateProjectionMatrix();
      },
      render(c, t, dt) {
        place(c);
        world?.tick?.(t, dt);
        renderer.render(scene, camera);
      },
      place,
      /** Mundo (x, altura, y) → pantalla. depth > 1 o < -1 = detrás de la cámara. */
      project(x, y, hgt = 0) {
        v.set(x, hgt, y).project(camera);
        return { x: (v.x + 1) * w / 2, y: (1 - v.y) * h / 2, depth: v.z, behind: v.z > 1 };
      },
      /** Pantalla → punto del suelo. */
      pick(sx, sy) {
        ray.setFromCamera({ x: (sx / w) * 2 - 1, y: -(sy / h) * 2 + 1 }, camera);
        const hit = ray.ray.intersectPlane(plane, v);
        return hit ? { x: hit.x, y: hit.z } : null;
      },
      /** Escala (px por unidad) en un punto del suelo, para el tamaño de los medallones. */
      scaleAt(x, y) {
        const dist = camera.position.distanceTo(v.set(x, 0, y));
        return (h / 2) / (dist * FOV_T);
      },
      dispose() {
        if (scene) scene.traverse((o) => { o.geometry?.dispose(); if (o.material) [].concat(o.material).forEach((m) => { m.map?.dispose(); m.dispose(); }); });
        renderer.dispose();
        el.remove();
      },
    };
  }

  window.World3D = { create };
})();
