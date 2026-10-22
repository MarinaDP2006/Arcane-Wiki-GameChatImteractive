// Piezas comunes de los escenarios 3D de Piltover y Zaun:
//  - texturas de pincel para que piedra, metal y madera parezcan pintadas a mano;
//  - fachadas con ventanas, cornisas y tejados para que los edificios no sean cajas lisas;
//  - el protagonista del jugador en 3D (muñeco de avatars3d.js con su ropa, pelo y cara);
//  - movimiento con choques, escalones y clic/toque para caminar.
// Todo se genera en tiempo real, sin imágenes externas.
(function () {
  const T = window.THREE;
  if (!T) { window.InteriorKit = null; return; }
  const settings = () => window.App?.settings || {};
  const quality = () => settings().quality || 'alta';

  // ---------- Texturas pintadas ----------
  const textures = new Map();
  /** Generador pseudoaleatorio con semilla para que cada textura sea siempre igual. */
  function rng(seed) {
    let s = seed >>> 0;
    return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  }
  /** Pinta un trazo que da la vuelta por los bordes para que la textura se repita sin cortes. */
  function wrapped(g, draw) {
    for (const dx of [-256, 0, 256]) for (const dy of [-256, 0, 256]) { g.save(); g.translate(dx, dy); draw(); g.restore(); }
  }
  /** Textura en escala de grises con pinceladas; el color lo pone el material. */
  function brush(kind) {
    if (textures.has(kind)) return textures.get(kind);
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    const g = c.getContext('2d');
    const r = rng(kind.length * 977 + kind.charCodeAt(0));
    g.fillStyle = '#d8d8d8';
    g.fillRect(0, 0, 256, 256);
    // Base: manchas suaves, como una capa de óleo diluido.
    for (let i = 0; i < 70; i++) {
      const x = r() * 256, y = r() * 256, rad = 20 + r() * 50, v = 190 + r() * 60 | 0;
      wrapped(g, () => {
        const grd = g.createRadialGradient(x, y, 0, x, y, rad);
        grd.addColorStop(0, `rgba(${v},${v},${v},0.35)`);
        grd.addColorStop(1, `rgba(${v},${v},${v},0)`);
        g.fillStyle = grd; g.fillRect(x - rad, y - rad, rad * 2, rad * 2);
      });
    }
    g.lineCap = 'round';
    if (kind === 'stone') {
      // Sillares desplazados con juntas irregulares y bordes iluminados.
      for (let row = 0; row < 8; row++) {
        const off = row % 2 ? 32 : 0;
        for (let col = 0; col < 4; col++) {
          const x = col * 64 + off, y = row * 32, v = 175 + r() * 70 | 0;
          wrapped(g, () => {
            g.fillStyle = `rgba(${v},${v},${v},0.55)`; g.fillRect(x + 2, y + 2, 60, 28);
            g.strokeStyle = 'rgba(255,255,255,0.25)'; g.lineWidth = 2;
            g.beginPath(); g.moveTo(x + 3, y + 3); g.lineTo(x + 60, y + 3 + r() * 2); g.stroke();
          });
        }
        g.strokeStyle = 'rgba(60,55,50,0.55)'; g.lineWidth = 2.5;
        g.beginPath(); g.moveTo(0, row * 32 + 1); g.lineTo(256, row * 32 + 1 + r() * 2); g.stroke();
        for (let col = 0; col <= 4; col++) {
          const x = col * 64 + off;
          wrapped(g, () => { g.beginPath(); g.moveTo(x + 1, row * 32); g.lineTo(x + 1 + r() * 2, row * 32 + 32); g.stroke(); });
        }
      }
    } else if (kind === 'metal') {
      // Chapas remachadas con churretes de óxido y grasa.
      g.strokeStyle = 'rgba(40,40,40,0.5)'; g.lineWidth = 3;
      for (const y of [0, 128]) { g.beginPath(); g.moveTo(0, y + 1); g.lineTo(256, y + 1); g.stroke(); }
      for (const x of [0, 128]) { g.beginPath(); g.moveTo(x + 1, 0); g.lineTo(x + 1, 256); g.stroke(); }
      g.fillStyle = 'rgba(250,250,250,0.55)';
      for (let i = 0; i < 256; i += 16) for (const e of [8, 120, 136, 248]) {
        g.beginPath(); g.arc(i + 4, e, 2.2, 0, 7); g.arc(e, i + 4, 2.2, 0, 7); g.fill();
      }
      for (let i = 0; i < 26; i++) {
        const x = r() * 256, y = r() * 200, len = 30 + r() * 90;
        wrapped(g, () => {
          const grd = g.createLinearGradient(x, y, x, y + len);
          grd.addColorStop(0, 'rgba(110,70,40,0.45)'); grd.addColorStop(1, 'rgba(110,70,40,0)');
          g.strokeStyle = grd; g.lineWidth = 2 + r() * 5;
          g.beginPath(); g.moveTo(x, y); g.lineTo(x + r() * 4 - 2, y + len); g.stroke();
        });
      }
    } else if (kind === 'wood') {
      // Tablones con veta.
      for (let p = 0; p < 6; p++) {
        const y = p * 256 / 6, v = 170 + r() * 70 | 0;
        g.fillStyle = `rgba(${v},${v},${v},0.5)`; g.fillRect(0, y + 2, 256, 256 / 6 - 4);
        g.strokeStyle = 'rgba(50,40,35,0.6)'; g.lineWidth = 2.5;
        g.beginPath(); g.moveTo(0, y + 1); g.lineTo(256, y + 1); g.stroke();
        g.strokeStyle = 'rgba(70,60,50,0.3)'; g.lineWidth = 1.2;
        for (let k = 0; k < 5; k++) {
          const yy = y + 6 + r() * 30;
          g.beginPath(); g.moveTo(0, yy);
          for (let x = 0; x <= 256; x += 32) g.lineTo(x, yy + Math.sin(x * 0.05 + k) * 2);
          g.stroke();
        }
      }
    }
    // Encima, pinceladas diagonales: el sello de la pintura de la serie.
    for (let i = 0; i < 150; i++) {
      const x = r() * 256, y = r() * 256, len = 8 + r() * 26, a = -0.7 + r() * 0.35, v = r() < 0.5 ? 255 : 30;
      g.strokeStyle = `rgba(${v},${v},${v},${0.04 + r() * 0.08})`;
      g.lineWidth = 2 + r() * 6;
      wrapped(g, () => { g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * len, y + Math.sin(a) * len); g.stroke(); });
    }
    const tex = new T.CanvasTexture(c);
    tex.colorSpace = T.SRGBColorSpace;
    tex.wrapS = tex.wrapT = T.RepeatWrapping;
    tex.anisotropy = 4;
    textures.set(kind, tex);
    return tex;
  }

  /** Ajusta las coordenadas de textura al tamaño real de cada pieza (sin estirar los sillares). */
  function scaleUVs(group, tile = 14) {
    group.traverse((o) => {
      const geo = o.geometry;
      if (!o.isMesh || !geo?.attributes?.uv || geo.userData.uvScaled) return;
      const p = geo.parameters || {};
      const uv = geo.attributes.uv;
      if (geo.type === 'BoxGeometry') {
        // Orden de caras de BoxGeometry: ±x (fondo×alto), ±y (ancho×fondo), ±z (ancho×alto).
        const dims = [[p.depth, p.height], [p.depth, p.height], [p.width, p.depth], [p.width, p.depth], [p.width, p.height], [p.width, p.height]];
        const per = uv.count / 6;
        for (let f = 0; f < 6; f++) for (let i = 0; i < per; i++) {
          const k = f * per + i;
          uv.setXY(k, uv.getX(k) * dims[f][0] / tile, uv.getY(k) * dims[f][1] / tile);
        }
      } else if (geo.type === 'CylinderGeometry') {
        const round = Math.PI * (p.radiusTop + p.radiusBottom) / tile;
        for (let k = 0; k < uv.count; k++) uv.setXY(k, uv.getX(k) * Math.max(1, round), uv.getY(k) * p.height / tile);
      } else if (geo.type === 'PlaneGeometry') {
        for (let k = 0; k < uv.count; k++) uv.setXY(k, uv.getX(k) * p.width / tile, uv.getY(k) * p.height / tile);
      } else return;
      uv.needsUpdate = true;
      geo.userData.uvScaled = true;
    });
  }

  // ---------- Arquitectura ----------
  /** Añade una caja con sombras. */
  function box(group, x, y, z, w, h, d, m) {
    const o = new T.Mesh(new T.BoxGeometry(w, h, d), m);
    o.position.set(x, y, z); o.castShadow = true; o.receiveShadow = true; group.add(o);
    return o;
  }
  /**
   * Decora el volumen de un edificio: zócalo, impostas, ventanas (algunas encendidas),
   * cornisa y remate. faces: lados con ventanas ('x+', 'x-', 'z+', 'z-').
   * style 'piltover' usa ventanas con arco y cúpulas; 'zaun', persianas, letreros y chimeneas.
   */
  function facade(group, b, o) {
    const { x, z, w, d } = b;
    const h = b.h, base = b.y ?? 0;
    const M = o.mats;
    const floorH = o.floor || 9;
    const r = rng(Math.abs(Math.round(x * 31 + z * 17 + h)));
    box(group, x, base + 1.2, z, w + 1.2, 2.4, d + 1.2, M.trim);
    box(group, x, base + h + 0.6, z, w + 2, 1.2, d + 2, M.trim);
    for (let y = base + floorH; y < base + h - 3; y += floorH) box(group, x, y, z, w + 0.5, 0.6, d + 0.5, M.trim);
    for (const face of o.faces || []) {
      const alongX = face[0] === 'z';
      const sign = face[1] === '+' ? 1 : -1;
      const span = alongX ? w : d;
      const cols = Math.max(1, Math.floor(span / (o.spacing || 6)));
      for (let y = base + floorH * 0.55; y < base + h - 4; y += floorH) {
        for (let i = 0; i < cols; i++) {
          const t = (i + 0.5) / cols - 0.5;
          const lit = r() < (o.lit ?? 0.35);
          const ww = o.winW || 2.2, wh = floorH * 0.42;
          const px = alongX ? x + t * span : x + sign * (w / 2 + 0.12);
          const pz = alongX ? z + sign * (d / 2 + 0.12) : z + t * span;
          const win = box(group, px, y + wh / 2, pz, alongX ? ww : 0.3, wh, alongX ? 0.3 : ww, lit ? M.lit : M.dark);
          win.castShadow = false;
          if (o.style === 'piltover') {
            // Arco de medio punto y alféizar dorado.
            const arch = new T.Mesh(new T.CylinderGeometry(ww / 2, ww / 2, 0.3, 12, 1, false, alongX ? Math.PI / 2 : 0, Math.PI), lit ? M.lit : M.dark);
            if (alongX) arch.rotation.x = Math.PI / 2; else arch.rotation.z = Math.PI / 2;
            arch.position.set(px, y + wh, pz);
            group.add(arch);
            box(group, alongX ? px : px + sign * 0.3, y - 0.2, alongX ? pz + sign * 0.3 : pz, alongX ? ww + 1 : 0.8, 0.4, alongX ? 0.8 : ww + 1, M.trim);
          } else if (o.style === 'zaun' && r() < 0.25) {
            // Contraventana metálica medio caída.
            const s = box(group, alongX ? px : px + sign * 0.35, y + wh * 0.8, alongX ? pz + sign * 0.35 : pz, alongX ? ww + 0.6 : 0.2, wh * 0.5, alongX ? 0.2 : ww + 0.6, M.trim);
            s.rotation[alongX ? 'z' : 'x'] = (r() - 0.5) * 0.4;
          }
        }
      }
    }
    if (o.roof === 'dome') {
      const dome = new T.Mesh(new T.SphereGeometry(Math.min(w, d) * 0.42, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), M.roof);
      dome.position.set(x, base + h + 1.2, z); dome.castShadow = true; group.add(dome);
      const spire = new T.Mesh(new T.ConeGeometry(0.8, Math.min(w, d) * 0.5, 8), M.trim);
      spire.position.set(x, base + h + Math.min(w, d) * 0.42 + Math.min(w, d) * 0.25, z); group.add(spire);
    } else if (o.roof === 'spire') {
      const cone = new T.Mesh(new T.ConeGeometry(Math.min(w, d) * 0.5, Math.min(w, d) * 1.1, 4), M.roof);
      cone.rotation.y = Math.PI / 4; cone.position.set(x, base + h + 1.2 + Math.min(w, d) * 0.55, z); cone.castShadow = true; group.add(cone);
    } else if (o.roof === 'chimney') {
      for (let i = 0; i < 2 + (r() * 2 | 0); i++) {
        const cx = x + (r() - 0.5) * w * 0.7, cz = z + (r() - 0.5) * d * 0.7, ch = 5 + r() * 9;
        const c = new T.Mesh(new T.CylinderGeometry(1, 1.2, ch, 8), M.trim);
        c.position.set(cx, base + h + ch / 2, cz); c.castShadow = true; group.add(c);
        smokeAt.push(new T.Vector3(cx, base + h + ch, cz));
      }
    }
  }
  let smokeAt = [];

  /** Escalera de peldaños de y0 a y1 avanzando de z0 a z1 (cada peldaño es subible). */
  function stairs(group, x, z0, z1, y0, y1, width, m) {
    const steps = Math.max(1, Math.ceil((y1 - y0) / 1.8));
    for (let i = 0; i < steps; i++) {
      const top = y0 + (y1 - y0) * (i + 1) / steps;
      const za = z0 + (z1 - z0) * i / steps, zb = z0 + (z1 - z0) * (i + 1) / steps;
      box(group, x, (y0 - 1 + top) / 2, (za + zb) / 2, width, top - y0 + 1, Math.abs(zb - za) + 0.05, m);
    }
  }

  // ---------- Ambiente: polvo o esporas en el aire, rayos de luz y humo ----------
  function dotTex() {
    if (textures.has('dot')) return textures.get('dot');
    const c = document.createElement('canvas'); c.width = c.height = 64;
    const g = c.getContext('2d');
    const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grd.addColorStop(0, 'rgba(255,255,255,1)'); grd.addColorStop(0.35, 'rgba(255,255,255,0.45)'); grd.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grd; g.fillRect(0, 0, 64, 64);
    const tex = new T.CanvasTexture(c); textures.set('dot', tex); return tex;
  }
  /** Crea partículas flotantes, columnas de luz y humo de chimeneas. Devuelve su animación. */
  function atmosphere(scene, o) {
    const parts = [];
    if (settings().particles !== false && quality() !== 'baja') {
      const n = quality() === 'ultra' ? 900 : 500;
      const pos = new Float32Array(n * 3);
      const r = rng(n);
      for (let i = 0; i < n; i++) { pos[i * 3] = (r() - 0.5) * 150; pos[i * 3 + 1] = r() * 60; pos[i * 3 + 2] = (r() - 0.5) * 150; }
      const geo = new T.BufferGeometry(); geo.setAttribute('position', new T.BufferAttribute(pos, 3));
      const pts = new T.Points(geo, new T.PointsMaterial({ color: o.dust, size: o.dustSize || 0.9, map: dotTex(), transparent: true, opacity: 0.7, depthWrite: false, blending: T.AdditiveBlending }));
      scene.add(pts); parts.push(pts);
      parts.dust = pts;
    }
    // Columnas de luz: conos abiertos con degradado aditivo (luz que entra por ventanas o rejillas).
    for (const s of o.shafts || []) {
      const c = document.createElement('canvas'); c.width = 4; c.height = 128;
      const g = c.getContext('2d'); const grd = g.createLinearGradient(0, 0, 0, 128);
      grd.addColorStop(0, 'rgba(255,255,255,0.5)'); grd.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = grd; g.fillRect(0, 0, 4, 128);
      const tex = new T.CanvasTexture(c);
      const cone = new T.Mesh(new T.CylinderGeometry(s.r0 || 3, s.r1 || 12, s.h || 60, 20, 1, true),
        new T.MeshBasicMaterial({ color: o.shaft, map: tex, transparent: true, opacity: s.o || 0.22, depthWrite: false, blending: T.AdditiveBlending, side: T.DoubleSide }));
      cone.position.set(s.x, s.y, s.z); cone.rotation.set(s.rx || 0, 0, s.rz || 0);
      cone.userData.noCollide = true;
      scene.add(cone); parts.push(cone);
    }
    // Humo de chimeneas de Zaun.
    const smoke = [];
    if (o.smoke && smokeAt.length && quality() !== 'baja') {
      const m = new T.SpriteMaterial({ map: dotTex(), color: o.smoke, transparent: true, opacity: 0.25, depthWrite: false });
      for (const p of smokeAt) for (let i = 0; i < 5; i++) {
        const s = new T.Sprite(m); s.position.copy(p); s.userData = { base: p.clone(), k: i / 5 };
        scene.add(s); smoke.push(s); parts.push(s);
      }
    }
    smokeAt = [];
    return {
      parts,
      tick(t) {
        if (parts.dust) { parts.dust.rotation.y = t * 0.01; parts.dust.position.y = Math.sin(t * 0.3) * 1.5; }
        for (const s of smoke) {
          const k = (s.userData.k + t * 0.08) % 1;
          s.position.set(s.userData.base.x + Math.sin(t * 0.5 + k * 6) * 2 + k * 6, s.userData.base.y + k * 22, s.userData.base.z);
          s.scale.setScalar(3 + k * 10);
        }
      },
    };
  }

  // ---------- Choques y suelo ----------
  const STEP = 2.2; // altura que se sube sin saltar (un peldaño)
  const HEAD = 8.5; // lo que está más alto no estorba al pasar por debajo
  const RAD = 1.7;
  /** Recoge las cajas de choque de la geometría sólida del escenario. */
  function colliders(group) {
    group.updateMatrixWorld(true);
    const list = [];
    const up = new T.Vector3(), q = new T.Quaternion();
    group.traverse((o) => {
      if (!o.isMesh) return;
      for (let p = o; p && p !== group; p = p.parent) if (p.userData.noCollide) return;
      const type = o.geometry.type;
      if (o.material?.transparent || /Torus|Plane|Sphere|Icosahedron|Cone/.test(type)) return;
      if (type === 'CylinderGeometry') {
        o.getWorldQuaternion(q);
        if (Math.abs(up.set(0, 1, 0).applyQuaternion(q).y) < 0.9) return; // tubos inclinados u horizontales
      }
      const b = new T.Box3().setFromObject(o);
      if (b.max.y < 0.3 && b.min.y > -3) { if (b.max.y - b.min.y < 0.4) return; }
      list.push(b);
    });
    return list;
  }
  /** Altura del suelo bajo (x, z) alcanzable desde la altura y. */
  function groundAt(list, x, z, y = Infinity, rad = 0) {
    let g = -Infinity;
    for (const b of list) {
      if (x < b.min.x - rad || x > b.max.x + rad || z < b.min.z - rad || z > b.max.z + rad) continue;
      if (b.max.y <= y + STEP && b.max.y > g) g = b.max.y;
    }
    return g === -Infinity ? 0 : g;
  }
  /** Indica si el cuerpo choca con algo en (x, z) estando de pie a la altura y. */
  function blocked(list, x, z, y) {
    for (const b of list) {
      if (x < b.min.x - RAD || x > b.max.x + RAD || z < b.min.z - RAD || z > b.max.z + RAD) continue;
      if (b.max.y > y + STEP && b.min.y < y + HEAD) return true;
    }
    return false;
  }

  /**
   * Busca un camino (A* sobre una rejilla de 2 unidades) que rodee mesas, muros y columnas y
   * suba por las escaleras. Si el destino no es alcanzable, llega al punto más cercano.
   */
  function findPath(list, from, to, bounds) {
    const S = 2;
    const nx = Math.floor(bounds.x * 2 / S) + 1, nz = Math.floor((bounds.z1 - bounds.z0) / S) + 1;
    const cell = (x, z) => [Math.round((x + bounds.x) / S), Math.round((z - bounds.z0) / S)];
    const pos = (i, k) => [i * S - bounds.x, k * S + bounds.z0];
    const [si, sk] = cell(from.x, from.z), [gi, gk] = cell(to.x, to.z);
    const key = (i, k) => k * nx + i;
    const open = [{ i: si, k: sk, y: from.y, g: 0, f: 0 }];
    const seen = new Map([[key(si, sk), { prev: null, i: si, k: sk, y: from.y }]]);
    const h = (i, k) => Math.hypot(i - gi, k - gk);
    let best = open[0], bestH = h(si, sk), loops = 0;
    while (open.length && loops++ < 5000) {
      let m = 0;
      for (let j = 1; j < open.length; j++) if (open[j].f < open[m].f) m = j;
      const cur = open.splice(m, 1)[0];
      const ch = h(cur.i, cur.k);
      if (ch < bestH) { best = cur; bestH = ch; }
      if (ch < 0.5) break;
      for (const [di, dk] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]]) {
        const i = cur.i + di, k = cur.k + dk;
        if (i < 0 || k < 0 || i >= nx || k >= nz || seen.has(key(i, k))) continue;
        const [x, z] = pos(i, k);
        const y = groundAt(list, x, z, cur.y, RAD * 0.4);
        if (blocked(list, x, z, cur.y) || (di && dk && (blocked(list, x, pos(cur.i, cur.k)[1], cur.y) || blocked(list, pos(cur.i, cur.k)[0], z, cur.y)))) continue;
        const node = { i, k, y, g: cur.g + (di && dk ? 1.414 : 1) };
        node.f = node.g + h(i, k);
        seen.set(key(i, k), { prev: key(cur.i, cur.k), i, k, y });
        open.push(node);
      }
    }
    const path = [];
    for (let n = seen.get(key(best.i, best.k)); n && n.prev !== null; n = seen.get(n.prev)) {
      const [x, z] = pos(n.i, n.k); path.unshift(new T.Vector3(x, 0, z));
    }
    if (path.length && bestH < 0.5) path[path.length - 1].set(to.x, 0, to.z);
    return path;
  }

  // ---------- Protagonista ----------
  const HERO = 11; // altura del protagonista en las unidades de los escenarios
  /**
   * Coloca el personaje del jugador, gestiona el movimiento (teclado, clic o toque) y la cámara.
   * opts: { scene, camera, dom, group, bounds:{x,z0,z1}, spawn:{x,y,z}, lift:[objetos], pick:[objetos], interact() → true si actuó }
   */
  function hero(opts) {
    const { scene, camera, dom } = opts;
    const list = colliders(opts.group);
    const pos = new T.Vector3(opts.spawn?.x ?? 0, 0, opts.spawn?.z ?? 58);
    // Se aparece sobre el suelo transitable más cercano a la altura indicada (no en un tejado).
    pos.y = groundAt(list, pos.x, pos.z, opts.spawn?.y ?? 0);
    // El objetivo y la pista se apoyan sobre el suelo real (cubiertas, puentes, plataformas).
    for (const o of opts.lift || []) o.position.y += groundAt(list, o.position.x, o.position.z, 16);
    const holder = new T.Group();
    holder.position.copy(pos);
    scene.add(holder);
    let av = null;
    try {
      const player = window.Game?.current?.()?.player;
      if (window.Avatars3D && player) {
        av = window.Avatars3D.create({ player });
        av.holder.scale.setScalar(HERO / 64);
        av.yaw = av.holder.rotation.y = Math.PI;
        holder.add(av.holder);
      }
    } catch (err) { console.warn('No se pudo crear el protagonista 3D:', err); av = null; }
    // Sombra de contacto pintada (siempre, aunque las sombras reales estén apagadas).
    const blob = new T.Mesh(new T.CircleGeometry(3.4, 24), new T.MeshBasicMaterial({ color: 0x000000, map: dotTex(), transparent: true, opacity: 0.55, depthWrite: false }));
    blob.rotation.x = -Math.PI / 2; blob.position.y = 0.08; blob.renderOrder = 2;
    holder.add(blob);
    // Luz de relleno que sigue al personaje para que se lea en escenas oscuras.
    const fill = new T.PointLight(opts.fill ?? 0xffd9a8, 14, 26, 1.6);
    fill.position.set(0, HERO * 1.4, 6); holder.add(fill);

    const cam = { h: 15, back: 24, ahead: 16, ...(opts.cam || {}) };
    const camPos = new T.Vector3(pos.x, pos.y + cam.h, pos.z + cam.back);
    const look = new T.Vector3(pos.x, pos.y + 5, pos.z - cam.ahead);
    camera.position.copy(camPos); camera.lookAt(look);

    // Clic o toque: caminar hasta ese punto rodeando obstáculos, o interactuar con la pista
    // o el objetivo si se pulsa sobre ellos (o justo al lado) estando cerca.
    let path = [], stuck = 0, arriveAt = 1.2;
    const ray = new T.Raycaster(), ndc = new T.Vector2(), plane = new T.Plane(new T.Vector3(0, 1, 0), 0), hit = new T.Vector3();
    const walkTo = (x, z, stop = 1.2) => { path = findPath(list, pos, { x, z }, opts.bounds); arriveAt = stop; stuck = 0; };
    const onPointer = (e) => {
      if (e.button !== 0) return;
      const rect = dom.getBoundingClientRect();
      ndc.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
      ray.setFromCamera(ndc, camera);
      const picks = (opts.pick || []).filter((o) => o.visible);
      plane.constant = -pos.y;
      const ground = ray.ray.intersectPlane(plane, hit) ? hit.clone() : null;
      let chosen = null;
      const near = ray.intersectObjects(picks, true)[0];
      if (near) { chosen = near.object; while (chosen.parent && !picks.includes(chosen)) chosen = chosen.parent; }
      else if (ground) chosen = picks.find((o) => Math.hypot(o.position.x - ground.x, o.position.z - ground.z) < 9) || null;
      if (chosen) {
        // interact() devuelve true si estaba lo bastante cerca para investigar o activar.
        if (opts.interact?.()) { path = []; return; }
        walkTo(chosen.position.x, chosen.position.z, 7);
        return;
      }
      if (ground) walkTo(ground.x, ground.z);
    };
    dom.addEventListener('pointerdown', onPointer);

    let fall = 0;
    return {
      pos,
      /** Avanza un fotograma: input = {x, z, run} con valores -1..1 de teclado. */
      update(dt, t, input) {
        let mx = input.x, mz = input.z;
        if (mx || mz) path = [];
        else if (path.length) {
          const last = path[path.length - 1];
          if (Math.hypot(last.x - pos.x, last.z - pos.z) < arriveAt || stuck > 0.8) path = [];
          else {
            while (path.length > 1 && Math.hypot(path[0].x - pos.x, path[0].z - pos.z) < 1.4) path.shift();
            const dx = path[0].x - pos.x, dz = path[0].z - pos.z, dd = Math.hypot(dx, dz) || 1;
            mx = dx / dd; mz = dz / dd;
          }
        }
        const len = Math.hypot(mx, mz);
        const run = input.run || path.length > 14;
        const speed = len ? (run ? 55 : 30) : 0;
        if (len) {
          const k = speed * dt / len;
          const nx = T.MathUtils.clamp(pos.x + mx * k, -opts.bounds.x, opts.bounds.x);
          const nz = T.MathUtils.clamp(pos.z + mz * k, opts.bounds.z0, opts.bounds.z1);
          const ox = pos.x, oz = pos.z;
          if (!blocked(list, nx, pos.z, pos.y)) pos.x = nx;
          if (!blocked(list, pos.x, nz, pos.y)) pos.z = nz;
          stuck = Math.hypot(pos.x - ox, pos.z - oz) < speed * dt * 0.2 ? stuck + dt : 0;
          if (av) av.yawGoal = Math.atan2(mx, mz);
        }
        // Suelo: sube peldaños al momento y cae con gravedad al bajar de una plataforma.
        const g = groundAt(list, pos.x, pos.z, pos.y, RAD * 0.4);
        if (g >= pos.y) { pos.y = g; fall = 0; } else { fall += 90 * dt; pos.y = Math.max(g, pos.y - fall * dt); }
        holder.position.copy(pos);
        if (av) window.Avatars3D.update(av, dt, len ? (run ? 380 : 230) : 0, av.yawGoal ?? Math.PI, t);
        // Cámara de tercera persona suave, por detrás y por encima.
        camPos.lerp(new T.Vector3(pos.x * 0.85, pos.y + cam.h, pos.z + cam.back), Math.min(1, dt * 4));
        look.lerp(new T.Vector3(pos.x, pos.y + 5, pos.z - cam.ahead), Math.min(1, dt * 5));
        camera.position.copy(camPos); camera.lookAt(look);
      },
      dispose() {
        dom.removeEventListener('pointerdown', onPointer);
        if (av) window.Avatars3D.dispose(av);
        blob.geometry.dispose(); blob.material.dispose();
        scene.remove(holder);
      },
    };
  }

  /** Activa sombras según los ajustes gráficos (Ajustes → Gráficos). */
  function shadows(renderer, light, size = 95) {
    const on = quality() !== 'baja' && settings().shadows !== false;
    renderer.shadowMap.enabled = on;
    renderer.shadowMap.type = T.PCFSoftShadowMap;
    if (!on || !light) return;
    light.castShadow = true;
    const s = light.shadow;
    s.mapSize.set(quality() === 'ultra' ? 4096 : 2048, quality() === 'ultra' ? 4096 : 2048);
    Object.assign(s.camera, { left: -size, right: size, top: size, bottom: -size, near: 1, far: 400 });
    s.bias = -0.0006; s.normalBias = 0.6;
    s.camera.updateProjectionMatrix();
  }

  window.InteriorKit = { brush, scaleUVs, facade, stairs, atmosphere, hero, shadows, box, HERO };
})();
