// Mundo abierto en 3D (three.js): el suelo pintado en 2D hace de base y encima se levantan
// los edificios, el agua, las tuberías, las farolas hextec, los lugares y los personajes.
// La cámara sigue al jugador desde arriba con un poco de inclinación y balanceo.
// world.js sigue llevando la lógica (colisiones, lugares, diálogos); esto solo dibuja.
(function () {
  const T = window.THREE;
  if (!T) { window.World3D = { init: () => false }; return; }

  const CAM_H = 1050;
  const CAM_BACK = 620;
  const BACK_RATIO = CAM_BACK / CAM_H;

  let renderer = null;
  let camera = null;
  let cur = null; // escena del mapa actual
  const scenes = {};
  const camLook = new T.Vector3();
  const camPos = new T.Vector3();
  const ray = new T.Raycaster();
  const groundPlane = new T.Plane(new T.Vector3(0, 1, 0), 0);

  function rng(seed) {
    let a = seed >>> 0;
    return () => {
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // ---------- Texturas pintadas ----------
  function canvasTex(c) {
    const t = new T.CanvasTexture(c);
    t.colorSpace = T.SRGBColorSpace;
    t.anisotropy = 4;
    return t;
  }

  function windowTexture(lit, wall, seed, zaun) {
    const c = document.createElement('canvas');
    c.width = 64;
    c.height = 128;
    const g = c.getContext('2d');
    g.fillStyle = wall;
    g.fillRect(0, 0, 64, 128);
    const r = rng(seed);
    for (let y = 6; y < 122; y += zaun ? 12 : 16) {
      for (let x = 5; x < 59; x += zaun ? 11 : 14) {
        if (r() < (zaun ? 0.4 : 0.6)) {
          g.fillStyle = lit;
          g.globalAlpha = 0.45 + r() * 0.55;
          g.fillRect(x, y, zaun ? 5 : 7, zaun ? 6 : 10);
        }
      }
    }
    g.globalAlpha = 1;
    const t = canvasTex(c);
    t.wrapS = t.wrapT = T.RepeatWrapping;
    return t;
  }

  function glowTexture(rgb) {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const g = c.getContext('2d');
    const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grd.addColorStop(0, `rgba(${rgb},1)`);
    grd.addColorStop(0.25, `rgba(${rgb},0.45)`);
    grd.addColorStop(1, `rgba(${rgb},0)`);
    g.fillStyle = grd;
    g.fillRect(0, 0, 128, 128);
    return canvasTex(c);
  }
  const glowCache = {};
  function glow(rgb, size, opacity = 1) {
    glowCache[rgb] = glowCache[rgb] || glowTexture(rgb);
    const s = new T.Sprite(new T.SpriteMaterial({ map: glowCache[rgb], blending: T.AdditiveBlending, depthWrite: false, transparent: true, opacity }));
    s.scale.set(size, size, 1);
    return s;
  }

  // Imagen (URL) → textura cuando termine de cargar; mientras, transparente.
  function imageTexture(url, draw, w, h) {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const t = canvasTex(c);
    const img = new Image();
    img.onload = () => { draw(c.getContext('2d'), img); t.needsUpdate = true; };
    img.onerror = () => { draw(c.getContext('2d'), null); t.needsUpdate = true; };
    img.src = url;
    draw(c.getContext('2d'), null);
    return t;
  }

  // Avatar redondo con aro de color (personajes y jugador).
  function avatarSprite(url, ring, size) {
    const tex = imageTexture(url, (g, img) => {
      g.clearRect(0, 0, 128, 128);
      g.save();
      g.beginPath();
      g.arc(64, 64, 56, 0, Math.PI * 2);
      g.fillStyle = '#15121f';
      g.fill();
      g.clip();
      if (img) {
        const s = Math.max(112 / img.naturalWidth, 112 / img.naturalHeight);
        g.drawImage(img, 64 - (img.naturalWidth * s) / 2, 64 - (img.naturalHeight * s) / 2, img.naturalWidth * s, img.naturalHeight * s);
      }
      g.restore();
      g.lineWidth = 7;
      g.strokeStyle = ring;
      g.beginPath();
      g.arc(64, 64, 58, 0, Math.PI * 2);
      g.stroke();
    }, 128, 128);
    const s = new T.Sprite(new T.SpriteMaterial({ map: tex, transparent: true, depthTest: false }));
    s.scale.set(size, size, 1);
    s.renderOrder = 10;
    return s;
  }

  // Tarjeta del lugar: su imagen en un marco octogonal con gema hextec.
  function placeCard(url, frame) {
    const W = 300;
    const H = 204;
    const tex = imageTexture(url, (g, img) => {
      g.clearRect(0, 0, W, H);
      const shape = () => {
        g.beginPath();
        g.moveTo(26, 6); g.lineTo(W - 26, 6); g.lineTo(W - 6, 26); g.lineTo(W - 6, H - 30);
        g.lineTo(W - 26, H - 12); g.lineTo(26, H - 12); g.lineTo(6, H - 30); g.lineTo(6, 26);
        g.closePath();
      };
      g.save();
      shape();
      g.fillStyle = '#0d0b14';
      g.fill();
      g.clip();
      if (img) {
        const s = Math.max(W / img.naturalWidth, H / img.naturalHeight);
        g.drawImage(img, W / 2 - (img.naturalWidth * s) / 2, H / 2 - (img.naturalHeight * s) / 2, img.naturalWidth * s, img.naturalHeight * s);
      }
      const v = g.createLinearGradient(0, 0, 0, H);
      v.addColorStop(0.6, 'rgba(0,0,0,0)');
      v.addColorStop(1, 'rgba(0,0,0,0.45)');
      g.fillStyle = v;
      g.fillRect(0, 0, W, H);
      g.restore();
      shape();
      g.lineWidth = 7;
      g.strokeStyle = frame;
      g.stroke();
      g.save();
      g.translate(W / 2, H - 12);
      g.rotate(Math.PI / 4);
      g.fillStyle = '#7fd0ff';
      g.shadowColor = '#3fa9f5';
      g.shadowBlur = 14;
      g.fillRect(-10, -10, 20, 20);
      g.strokeStyle = frame;
      g.lineWidth = 3;
      g.strokeRect(-10, -10, 20, 20);
      g.restore();
    }, W, H);
    const s = new T.Sprite(new T.SpriteMaterial({ map: tex, transparent: true }));
    s.scale.set(190, 129, 1);
    return s;
  }

  // ---------- Construcción de cada ciudad ----------
  function buildScene(map, art) {
    const zaun = map.id === 'zaun';
    const r = rng(map.def.seed * 31 + 5);
    const scene = new T.Scene();
    const dyn = { neon: [], smoke: [], airships: [], crystals: {}, places: {}, beams: {}, lamps: [], water: [], bmeshes: [], spores: null };
    const bg = zaun ? 0x07120e : 0x3a2632;
    scene.background = new T.Color(bg);
    scene.fog = zaun ? new T.FogExp2(0x16362a, 0.00042) : new T.Fog(0x9a6a50, 1500, 3200);

    // Luz: atardecer dorado en Piltover; penumbra verde en Zaun.
    if (zaun) {
      scene.add(new T.HemisphereLight(0x8affd8, 0x1a2a22, 1.4));
      scene.add(new T.AmbientLight(0x406a5a, 0.8));
      const moon = new T.DirectionalLight(0xb0ffe0, 1.1);
      moon.position.set(-400, 900, 300);
      scene.add(moon);
    } else {
      scene.add(new T.HemisphereLight(0xfff0d8, 0x4a3a2a, 1.1));
      const sun = new T.DirectionalLight(0xffd2a0, 1.5);
      sun.position.set(-900, 700, -400);
      scene.add(sun);
    }

    // Suelo: el lienzo 2D pintado de la ciudad
    const groundTex = canvasTex(map.ground);
    const ground = new T.Mesh(new T.PlaneGeometry(map.w, map.h), new T.MeshStandardMaterial({ map: groundTex, emissive: 0xffffff, emissiveMap: groundTex, emissiveIntensity: zaun ? 0.45 : 0.18, roughness: 1 }));
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(map.w / 2, 0, map.h / 2);
    scene.add(ground);
    const outer = new T.Mesh(new T.PlaneGeometry(map.w * 4, map.h * 4), new T.MeshStandardMaterial({ color: zaun ? 0x050c0a : 0x2a2018, roughness: 1 }));
    outer.rotation.x = -Math.PI / 2;
    outer.position.set(map.w / 2, -2, map.h / 2);
    scene.add(outer);

    // Agua animada
    for (const q of map.water) {
      const c = document.createElement('canvas');
      c.width = 256;
      c.height = 64;
      const g = c.getContext('2d');
      g.fillStyle = zaun ? '#0e3a1e' : '#2a5a7a';
      g.fillRect(0, 0, 256, 64);
      for (let i = 0; i < 60; i++) {
        g.fillStyle = zaun ? `rgba(140,255,120,${0.1 + r() * 0.3})` : `rgba(220,240,255,${0.08 + r() * 0.25})`;
        g.fillRect(r() * 256, r() * 64, 10 + r() * 40, 2);
      }
      const tex = canvasTex(c);
      tex.wrapS = tex.wrapT = T.RepeatWrapping;
      tex.repeat.set(q.w / 260, 1);
      const mat = zaun
        ? new T.MeshStandardMaterial({ map: tex, emissive: 0x3fbf5a, emissiveMap: tex, emissiveIntensity: 1.3, roughness: 0.3, transparent: true, opacity: 0.95 })
        : new T.MeshStandardMaterial({ map: tex, roughness: 0.15, metalness: 0.4 });
      const plane = new T.Mesh(new T.PlaneGeometry(q.w, q.h), mat);
      plane.rotation.x = -Math.PI / 2;
      plane.position.set(q.x + q.w / 2, zaun ? -14 : -4, q.y + q.h / 2);
      scene.add(plane);
      dyn.water.push(tex);
      // Paredes del canal / del abismo
      const wallMat = new T.MeshStandardMaterial({ color: zaun ? 0x141a18 : 0xb89a6a, roughness: 0.9 });
      for (const zz of [q.y, q.y + q.h]) {
        const wall = new T.Mesh(new T.BoxGeometry(q.w, zaun ? 30 : 12, 8), wallMat);
        wall.position.set(q.x + q.w / 2, zaun ? -2 : 2, zz);
        scene.add(wall);
      }
      if (zaun) {
        for (let x = 150; x < q.w; x += 500) {
          const l = new T.PointLight(0x4aff7a, 90000, 520, 1.6);
          l.position.set(q.x + x, 30, q.y + q.h / 2);
          scene.add(l);
          const gl = glow('90,255,120', 320, 0.35);
          gl.position.set(q.x + x, 4, q.y + q.h / 2);
          scene.add(gl);
        }
      }
    }

    // Puentes y pasarelas
    for (const q of map.bridges) {
      const mat = new T.MeshStandardMaterial({ color: zaun ? 0x2a2a30 : 0xc8ae7a, metalness: zaun ? 0.7 : 0.2, roughness: 0.6 });
      const deck = new T.Mesh(new T.BoxGeometry(q.w, 8, q.h - 30), mat);
      deck.position.set(q.x + q.w / 2, 4, q.y + q.h / 2);
      scene.add(deck);
      for (const sx of [q.x + 4, q.x + q.w - 4]) {
        const rail = new T.Mesh(new T.BoxGeometry(4, zaun ? 4 : 14, q.h - 30), zaun ? new T.MeshBasicMaterial({ color: 0x3fbf9f }) : mat);
        rail.position.set(sx, zaun ? 18 : 14, q.y + q.h / 2);
        scene.add(rail);
        if (zaun) dyn.neon.push({ mesh: rail, ph: r() * 10 });
      }
      if (!zaun) {
        const arch = new T.Mesh(new T.TorusGeometry(q.w * 0.45, 5, 8, 24, Math.PI), mat);
        arch.position.set(q.x + q.w / 2, -2, q.y + q.h / 2);
        arch.rotation.y = 0;
        scene.add(arch);
      }
    }

    // Edificios
    const P = map.def.palette;
    // Zaun: ventanas encendidas en paredes oscuras. Piltover: piedra crema con cristales azulados.
    const lit = zaun ? '#ffb860' : '#2f4a5e';
    const texSet = [0, 1, 2, 3].map((i) => windowTexture(lit, zaun ? '#3a4440' : '#efe2c4', map.def.seed * 10 + i, zaun));
    const gold = new T.MeshStandardMaterial({ color: 0xd8b060, metalness: 0.8, roughness: 0.3 });
    const teal = new T.MeshStandardMaterial({ color: 0x2f7f84, metalness: 0.3, roughness: 0.5 });
    const copper = new T.MeshStandardMaterial({ color: 0x9a5a3a, metalness: 0.5, roughness: 0.5 });
    const rust = new T.MeshStandardMaterial({ color: 0x4a3a30, metalness: 0.4, roughness: 0.9 });
    const neonCols = [0x3fbf9f, 0xe0457b, 0xbf3abf, 0x8fbf3a, 0xf0a040, 0x3fa9f5];
    const bodyMat = (b, wpx, hpx) => {
      const tex = texSet[b.seed % 4].clone();
      tex.needsUpdate = true;
      tex.repeat.set(Math.max(1, Math.round(wpx / (zaun ? 50 : 60))), Math.max(1, Math.round(hpx / (zaun ? 45 : 60))));
      return new T.MeshStandardMaterial({
        color: new T.Color(b.color), map: tex, emissive: zaun ? 0xff9a40 : 0x6a5030, emissiveMap: tex,
        emissiveIntensity: zaun ? 1.1 : 0.25, roughness: zaun ? 0.95 : 0.65,
      });
    };
    const box = (w, h, d, mat, x, y, z) => {
      const m = new T.Mesh(new T.BoxGeometry(w, h, d), mat);
      m.position.set(x, y, z);
      scene.add(m);
      return m;
    };
    for (const b of map.buildings) {
      const cx = b.x + b.w / 2;
      const cz = b.y + b.h / 2;
      const ht = b.ht || 80;
      const parts = [];
      const rb = rng(b.seed);
      if (!zaun) {
        const body = box(b.w, ht * (b.kind === 'tower' ? 0.7 : 1), b.h, bodyMat(b, b.w, ht), cx, (ht * (b.kind === 'tower' ? 0.7 : 1)) / 2, cz);
        parts.push(body);
        // Cornisa dorada
        parts.push(box(b.w + 6, 5, b.h + 6, gold, cx, ht * (b.kind === 'tower' ? 0.7 : 1), cz));
        if (b.kind === 'tower') {
          const top = box(b.w * 0.62, ht * 0.3, b.h * 0.62, bodyMat(b, b.w * 0.6, ht * 0.3), cx, ht * 0.85, cz);
          parts.push(top);
          const spire = new T.Mesh(new T.ConeGeometry(Math.min(b.w, b.h) * 0.4, ht * 0.35, 4), rb() < 0.5 ? teal : gold);
          spire.position.set(cx, ht + ht * 0.175, cz);
          spire.rotation.y = Math.PI / 4;
          scene.add(spire);
          parts.push(spire);
          // Reloj o anillo hextec en la torre
          const ringM = new T.Mesh(new T.TorusGeometry(Math.min(b.w, b.h) * 0.22, 2.5, 8, 32), new T.MeshBasicMaterial({ color: 0x7fd0ff }));
          ringM.position.set(cx, ht * 0.85, cz + b.h * 0.31 + 2);
          scene.add(ringM);
          parts.push(ringM);
          dyn.neon.push({ mesh: ringM, ph: rb() * 10, steady: true });
        } else if (b.kind === 'dome') {
          const dome = new T.Mesh(new T.SphereGeometry(Math.min(b.w, b.h) * 0.42, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), rb() < 0.6 ? gold : teal);
          dome.position.set(cx, ht, cz);
          scene.add(dome);
          parts.push(dome);
          const lan = new T.Mesh(new T.CylinderGeometry(4, 6, 30, 8), gold);
          lan.position.set(cx, ht + Math.min(b.w, b.h) * 0.42 + 12, cz);
          scene.add(lan);
          parts.push(lan);
        } else if (b.kind === 'palace') {
          for (const [dx, dz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
            const tx = cx + dx * (b.w / 2 - 10);
            const tz = cz + dz * (b.h / 2 - 10);
            const tur = new T.Mesh(new T.CylinderGeometry(12, 12, ht + 30, 10), bodyMat(b, 40, ht));
            tur.position.set(tx, (ht + 30) / 2, tz);
            scene.add(tur);
            const cap = new T.Mesh(new T.ConeGeometry(15, 34, 10), teal);
            cap.position.set(tx, ht + 30 + 17, tz);
            scene.add(cap);
            parts.push(tur, cap);
          }
        } else {
          const roof = new T.Mesh(new T.ConeGeometry(Math.max(b.w, b.h) * 0.72, b.kind === 'spire' ? 70 : 30, 4), b.kind === 'spire' ? teal : copper);
          roof.position.set(cx, ht + (b.kind === 'spire' ? 35 : 15), cz);
          roof.rotation.y = Math.PI / 4;
          roof.scale.set(b.w / Math.max(b.w, b.h), 1, b.h / Math.max(b.w, b.h));
          scene.add(roof);
          parts.push(roof);
        }
      } else {
        // Zaun: pisos apilados, cada uno algo desplazado, con techos de chapa
        let y = 0;
        let w = b.w;
        let d = b.h;
        let ox = 0;
        let oz = 0;
        const tiers = b.tiers || 1;
        for (let k = 0; k < tiers; k++) {
          const th = ht / tiers + rb() * 20;
          const m = box(w, th, d, bodyMat(b, w, th), cx + ox, y + th / 2, cz + oz);
          parts.push(m);
          parts.push(box(w + 8, 4, d + 8, rust, cx + ox, y + th, cz + oz));
          y += th;
          w *= 0.62 + rb() * 0.2;
          d *= 0.62 + rb() * 0.2;
          ox += (rb() - 0.5) * b.w * 0.25;
          oz += (rb() - 0.5) * b.h * 0.25;
        }
        if (b.sign) {
          const col = neonCols[Math.floor(rb() * neonCols.length)];
          const n = box(b.w * 0.6, 7, 3, new T.MeshBasicMaterial({ color: col }), cx, 20 + rb() * (ht * 0.6), b.y + b.h + 2);
          dyn.neon.push({ mesh: n, ph: rb() * 10 });
          const gl = glow(['63,191,159', '224,69,123', '191,58,191', '143,191,58', '240,160,64', '63,169,245'][neonCols.indexOf(col)], 110, 0.5);
          gl.position.copy(n.position);
          gl.position.z += 10;
          scene.add(gl);
        }
        if (b.chimney) {
          const chx = cx + b.w * 0.3;
          const chz = cz - b.h * 0.2;
          const ch = new T.Mesh(new T.CylinderGeometry(7, 9, 60, 8), rust);
          ch.position.set(chx, y + 30, chz);
          scene.add(ch);
          parts.push(ch);
          for (let k = 0; k < 3; k++) {
            const sm = glow('120,220,170', 70, 0.18);
            sm.blending = T.NormalBlending;
            sm.position.set(chx, y + 60, chz);
            scene.add(sm);
            dyn.smoke.push({ s: sm, x: chx, y: y + 60, z: chz, ph: k / 3 + rb() });
          }
        }
      }
      // Al taparte, el cuerpo se vuelve translúcido y los tejados (material compartido) se ocultan.
      const sharedMats = [gold, teal, copper, rust];
      dyn.bmeshes.push({
        b, ht: ht * 1.3, faded: false,
        mats: [...new Set(parts.filter((p) => !sharedMats.includes(p.material) && !(p.material instanceof T.MeshBasicMaterial)).map((p) => p.material))],
        solid: parts.filter((p) => sharedMats.includes(p.material) || p.material instanceof T.MeshBasicMaterial),
      });
    }

    // Farolas: hextec en Piltover, quimtec en Zaun
    if (!zaun) {
      const poleMat = new T.MeshStandardMaterial({ color: 0x3a2a1a, metalness: 0.7, roughness: 0.4 });
      for (let x = map.BLOCK; x < map.w; x += map.BLOCK) {
        for (let y = map.BLOCK; y < map.h; y += map.BLOCK) {
          if (map.water.some((q) => y > q.y - 40 && y < q.y + q.h + 40)) continue;
          for (const [dx, dz] of [[-38, -38], [38, 38]]) {
            const pole = new T.Mesh(new T.CylinderGeometry(2, 3, 46, 6), poleMat);
            pole.position.set(x + dx, 23, y + dz);
            scene.add(pole);
            const gem = new T.Mesh(new T.OctahedronGeometry(5), new T.MeshBasicMaterial({ color: 0x9fe0ff }));
            gem.position.set(x + dx, 50, y + dz);
            scene.add(gem);
            const gl = glow('110,200,255', 90, 0.8);
            gl.position.copy(gem.position);
            scene.add(gl);
            dyn.lamps.push({ gem, gl, ph: r() * 10 });
          }
        }
      }
      // Dirigibles cruzando el cielo
      const hull = new T.MeshStandardMaterial({ color: 0xc9b896, roughness: 0.6 });
      for (let i = 0; i < 5; i++) {
        const g = new T.Group();
        const body = new T.Mesh(new T.SphereGeometry(40, 16, 10), hull);
        body.scale.set(2.4, 0.8, 0.8);
        g.add(body);
        const gond = new T.Mesh(new T.BoxGeometry(40, 12, 14), copper);
        gond.position.y = -38;
        g.add(gond);
        const fin = new T.Mesh(new T.BoxGeometry(18, 30, 3), copper);
        fin.position.set(-92, 0, 0);
        g.add(fin);
        g.scale.setScalar(0.7);
        g.position.set(r() * map.w, 640 + r() * 100, r() * map.h);
        scene.add(g);
        dyn.airships.push({ g, sp: 18 + r() * 14, dir: r() < 0.5 ? 1 : -1, z0: g.position.z, ph: r() * 10 });
      }
    } else {
      // Tuberías gigantes sobre los tejados
      const pipeMat = new T.MeshStandardMaterial({ color: 0x3a5a3a, metalness: 0.6, roughness: 0.5 });
      for (let i = 0; i < 6; i++) {
        const y0 = 180 + i * 360;
        const curve = new T.CatmullRomCurve3([
          new T.Vector3(-100, 150, y0), new T.Vector3(800, 170 + r() * 40, y0 - 80),
          new T.Vector3(1700, 140, y0 + 90), new T.Vector3(2500, 175, y0 - 40), new T.Vector3(map.w + 100, 155, y0 + 20),
        ]);
        scene.add(new T.Mesh(new T.TubeGeometry(curve, 120, 9, 8, false), pipeMat));
      }
      // Esporas y brillo flotando
      const n = 900;
      const geo = new T.BufferGeometry();
      const pos = new Float32Array(n * 3);
      for (let i = 0; i < n; i++) { pos[i * 3] = r() * map.w; pos[i * 3 + 1] = r() * 260; pos[i * 3 + 2] = r() * map.h; }
      geo.setAttribute('position', new T.BufferAttribute(pos, 3));
      dyn.spores = new T.Points(geo, new T.PointsMaterial({ color: 0x8affc0, size: 4, transparent: true, opacity: 0.7, blending: T.AdditiveBlending, depthWrite: false }));
      scene.add(dyn.spores);
    }

    // Lugares: plataforma hexagonal + tarjeta con su imagen flotando encima
    for (const l of map.def.locations) {
      const frame = zaun ? '#3fbf9f' : '#e3c45a';
      const plat = new T.Mesh(new T.CylinderGeometry(78, 86, 10, 6), new T.MeshStandardMaterial({ color: zaun ? 0x1a2a26 : 0xd8c9a0, roughness: 0.7 }));
      plat.position.set(l.x, 5, l.y);
      scene.add(plat);
      const edge = new T.Mesh(new T.TorusGeometry(80, 2.5, 6, 6), new T.MeshBasicMaterial({ color: zaun ? 0x3fbf9f : 0xe3c45a }));
      edge.rotation.x = Math.PI / 2;
      edge.rotation.z = Math.PI / 6;
      edge.position.set(l.x, 11, l.y);
      scene.add(edge);
      const url = art.place(l);
      const card = url ? placeCard(url, frame) : null;
      if (card) {
        card.position.set(l.x, 150, l.y);
        scene.add(card);
      }
      const beam = new T.Mesh(new T.CylinderGeometry(60, 80, 900, 16, 1, true), new T.MeshBasicMaterial({ color: 0xffe08a, transparent: true, opacity: 0.12, blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide }));
      beam.position.set(l.x, 450, l.y);
      beam.visible = false;
      scene.add(beam);
      dyn.places[l.id] = { card, edge, ph: r() * 10 };
      dyn.beams[l.id] = beam;
    }

    // Cristales hextec (fragmentos del Códice)
    const crystMat = new T.MeshStandardMaterial({ color: 0x7fd0ff, emissive: 0x3fa9f5, emissiveIntensity: 2, roughness: 0.1, transparent: true, opacity: 0.92 });
    const ringMat = new T.MeshBasicMaterial({ color: 0xe3c45a });
    for (const f of map.def.fragments) {
      const g = new T.Group();
      const c = new T.Mesh(new T.OctahedronGeometry(10), crystMat);
      c.scale.set(1, 1.6, 1);
      g.add(c);
      const ring = new T.Mesh(new T.TorusGeometry(18, 1.6, 6, 6), ringMat);
      g.add(ring);
      const gl = glow('90,190,255', 110, 0.9);
      g.add(gl);
      g.position.set(f.x, 34, f.y);
      scene.add(g);
      dyn.crystals[f.codex] = { g, c, ring };
    }

    // Personajes y jugador: sprites con su avatar
    dyn.people = new Map();
    dyn.player = null;
    dyn.playerRing = new T.Mesh(new T.RingGeometry(18, 24, 32), new T.MeshBasicMaterial({ color: 0xffe08a, transparent: true, opacity: 0.8, side: T.DoubleSide }));
    dyn.playerRing.rotation.x = -Math.PI / 2;
    scene.add(dyn.playerRing);
    dyn.target = new T.Mesh(new T.RingGeometry(8, 12, 24), new T.MeshBasicMaterial({ color: 0xffe08a, transparent: true, opacity: 0.7, side: T.DoubleSide }));
    dyn.target.rotation.x = -Math.PI / 2;
    dyn.target.visible = false;
    scene.add(dyn.target);
    const shadowTex = glowTexture('0,0,0');
    dyn.shadow = () => {
      const s = new T.Mesh(new T.PlaneGeometry(60, 30), new T.MeshBasicMaterial({ map: shadowTex, transparent: true, opacity: 0.6, depthWrite: false }));
      s.rotation.x = -Math.PI / 2;
      scene.add(s);
      return s;
    };
    return { scene, dyn, map, zaun };
  }

  // ---------- API ----------
  function init(cv) {
    if (renderer) {
      if (renderer.domElement !== cv) { renderer.dispose(); renderer = null; } else return true;
    }
    try {
      renderer = new T.WebGLRenderer({ canvas: cv, antialias: true, powerPreference: 'high-performance' });
    } catch {
      renderer = null;
      return false;
    }
    renderer.setPixelRatio(Math.min(1.25, window.devicePixelRatio || 1));
    renderer.toneMapping = T.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.outputColorSpace = T.SRGBColorSpace;
    camera = new T.PerspectiveCamera(40, 16 / 9, 20, 7000);
    return true;
  }

  function setMap(map, art, player) {
    scenes[map.id] = scenes[map.id] || buildScene(map, art);
    cur = scenes[map.id];
    const d = cur.dyn;
    if (d.player) d.player.removeFromParent();
    d.player = avatarSprite(art.player(), '#ffe08a', 58);
    cur.scene.add(d.player);
    d.playerShadow = d.playerShadow || d.shadow();
    camLook.set(player.x, 0, player.y);
    camPos.set(player.x, CAM_H, player.y + CAM_BACK);
  }

  function resize(w, h) {
    if (!renderer) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  // st: { t, player: {x,y,walk}, npcs: [{id,x,y}], codex: [], objective, target, art }
  function render(st) {
    if (!renderer || !cur) return;
    const { dyn } = cur;
    const t = st.t / 1000;
    const px = st.player.x;
    const py = st.player.y;
    // Cámara que sigue con suavidad y se balancea un poco
    camLook.lerp(new T.Vector3(px, 0, py), 0.08);
    const sway = Math.sin(t * 0.25) * 40;
    camPos.lerp(new T.Vector3(px + sway, CAM_H + Math.sin(t * 0.33) * 20, py + CAM_BACK), 0.06);
    camera.position.copy(camPos);
    camera.lookAt(camLook);

    // Edificios que tapan al jugador: se vuelven translúcidos
    for (const e of dyn.bmeshes) {
      const b = e.b;
      const hide = b.x < px + 70 && b.x + b.w > px - 70 && b.y + b.h > py - 10 && b.y < py + e.ht * BACK_RATIO + 40;
      if (hide !== e.faded) {
        e.faded = hide;
        for (const m of e.mats) { m.transparent = hide; m.opacity = hide ? 0.25 : 1; m.depthWrite = !hide; m.needsUpdate = true; }
        for (const m of e.solid) m.visible = !hide;
      }
    }

    // Animaciones
    for (const n of dyn.neon) n.mesh.visible = n.steady || (Math.sin(t * 3 + n.ph) > -0.85 && !(Math.sin(t * 17 + n.ph * 3) > 0.97));
    for (const s of dyn.smoke) {
      const k = (t * 0.25 + s.ph) % 1;
      s.s.position.set(s.x + k * 40, s.y + k * 140, s.z - k * 20);
      s.s.scale.setScalar(50 + k * 110);
      s.s.material.opacity = 0.22 * (1 - k);
    }
    for (const a of dyn.airships) {
      a.g.position.x += a.sp * a.dir * 0.016;
      if (a.g.position.x > cur.map.w + 600) a.g.position.x = -600;
      if (a.g.position.x < -600) a.g.position.x = cur.map.w + 600;
      a.g.position.z = a.z0 + Math.sin(t * 0.05 + a.ph) * 200;
      a.g.rotation.y = a.dir > 0 ? 0 : Math.PI;
      a.g.position.y += Math.sin(t + a.ph) * 0.1;
    }
    for (const l of dyn.lamps) l.gl.material.opacity = 0.65 + Math.sin(t * 1.3 + l.ph) * 0.2;
    for (const w of dyn.water) w.offset.x = (t * (cur.zaun ? 0.03 : 0.06)) % 1;
    if (dyn.spores) dyn.spores.position.y = Math.sin(t * 0.3) * 15;
    for (const [id, c] of Object.entries(dyn.crystals)) {
      c.g.visible = !st.codex.includes(id);
      if (!c.g.visible) continue;
      c.c.rotation.y = t * 1.2;
      c.ring.rotation.x = Math.PI / 2 + Math.sin(t) * 0.4;
      c.ring.rotation.z = t * 0.8;
      c.g.position.y = 34 + Math.sin(t * 2 + c.g.position.x) * 5;
    }
    for (const [id, p] of Object.entries(dyn.places)) {
      if (p.card) p.card.position.y = 150 + Math.sin(t * 1.2 + p.ph) * 6;
      const obj = id === st.objective;
      dyn.beams[id].visible = obj;
      if (obj) dyn.beams[id].material.opacity = 0.1 + Math.sin(t * 3) * 0.05;
      p.edge.material.color.set(obj ? 0xffe08a : cur.zaun ? 0x3fbf9f : 0xe3c45a);
    }

    // Personajes
    const seen = new Set();
    for (const n of st.npcs) {
      seen.add(n.id);
      let s = dyn.people.get(n.id);
      if (!s) {
        s = { sp: avatarSprite(st.art.char(n.id), cur.zaun ? '#3fbf9f' : '#e3c45a', 62), sh: dyn.shadow() };
        cur.scene.add(s.sp);
        dyn.people.set(n.id, s);
      }
      s.sp.visible = s.sh.visible = true;
      s.sp.position.set(n.x, 44 + Math.sin(t * 2 + n.x) * 2, n.y);
      s.sh.position.set(n.x, 1, n.y + 6);
    }
    for (const [id, s] of dyn.people) if (!seen.has(id)) s.sp.visible = s.sh.visible = false;

    // Jugador
    const bob = Math.abs(Math.sin(st.player.walk || 0)) * 6;
    dyn.player.position.set(px, 40 + bob, py);
    dyn.playerShadow.position.set(px, 1, py + 6);
    dyn.playerRing.position.set(px, 2, py);
    dyn.playerRing.rotation.z = t;
    if (st.target) {
      dyn.target.visible = true;
      dyn.target.position.set(st.target.x, 2, st.target.y);
      dyn.target.scale.setScalar(1 + Math.sin(t * 6) * 0.2);
    } else dyn.target.visible = false;

    renderer.render(cur.scene, camera);
  }

  // Coordenadas del mundo (x, y en el mapa; h altura) → píxeles de pantalla.
  function project(x, y, h, w, hgt) {
    const v = new T.Vector3(x, h, y).project(camera);
    return { x: (v.x + 1) / 2 * w, y: (1 - v.y) / 2 * hgt, on: v.z < 1 && v.x > -1.05 && v.x < 1.05 && v.y > -1.05 && v.y < 1.05 };
  }

  // Píxeles de pantalla → punto del suelo.
  function pick(sx, sy, w, h) {
    ray.setFromCamera(new T.Vector2((sx / w) * 2 - 1, -(sy / h) * 2 + 1), camera);
    const p = new T.Vector3();
    return ray.ray.intersectPlane(groundPlane, p) ? { x: p.x, y: p.z } : null;
  }

  function reset() { for (const k of Object.keys(scenes)) delete scenes[k]; cur = null; }

  window.World3D = { init, setMap, resize, render, project, pick, reset };
})();
