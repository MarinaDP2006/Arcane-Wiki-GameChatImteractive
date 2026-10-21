// Mundo abierto en 2D+3D: las calles, los edificios y los paisajes de Piltover y Zaun se
// dibujan en 3D (Three.js) con una cámara que sigue al jugador, gira y hace zoom. Los
// personajes y las tarjetas de los lugares se pintan encima en 2D (ver world.js).
// Cada ciudad tiene su propia escena: Piltover es dorada, soleada y está junto al mar;
// Zaun es un pozo oscuro con neones, tuberías, chimeneas y niebla química.
(function () {
  if (!window.THREE) return;
  const T = window.THREE;

  function rng(seed) {
    let a = seed >>> 0;
    return () => {
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // Ambiente de cada ciudad.
  const LOOK = {
    piltover: {
      sky: [0x3f74c0, 0xf5c987, 0x9a7a52], bg: 0xe9cfa0, fog: 0xead2a6, fogD: 0.00020,
      hemi: [0xfff1d6, 0x6a5434, 1.5], sun: [0xffe2ad, 3.4], sunDir: [-0.55, 1, 0.5],
      exposure: 1.0, dust: 0xffe6a0, dustRise: 6, pitch: 0.92, lantern: 0,
    },
    zaun: {
      sky: [0x07120f, 0x16443a, 0x040807], bg: 0x0d2620, fog: 0x0f2c24, fogD: 0.00050,
      hemi: [0x7affd2, 0x2a0c22, 0.65], sun: [0xa8ffe0, 1.1], sunDir: [0.35, 1, -0.6],
      exposure: 1.25, dust: 0x6affc8, dustRise: 22, pitch: 1.0, lantern: 1,
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
    tex.anisotropy = 4;
    return tex;
  }

  // Fachada con ventanas: mapa de color y mapa de luz (solo las ventanas encendidas).
  function facadeTex(zaun, seed) {
    const r = rng(seed);
    const lit = [];
    const S = 256;
    const step = 32;
    const paint = (glow) => (g) => {
      g.fillStyle = glow ? '#000' : zaun ? '#8a8a96' : '#fff8ea';
      g.fillRect(0, 0, S, S);
      if (!glow) {
        // Juntas de piedra (Piltover) o planchas remachadas (Zaun)
        g.strokeStyle = zaun ? 'rgba(0,0,0,0.35)' : 'rgba(120,96,60,0.25)';
        g.lineWidth = zaun ? 3 : 1.5;
        for (let y = 0; y <= S; y += step) { g.beginPath(); g.moveTo(0, y); g.lineTo(S, y); g.stroke(); }
        if (zaun) {
          g.fillStyle = 'rgba(140,70,30,0.25)';
          for (let i = 0; i < 18; i++) g.fillRect(r() * S, r() * S, 10 + r() * 40, 30 + r() * 60);
        }
      }
      let k = 0;
      for (let y = 6; y < S - 4; y += step) {
        for (let x = 8; x < S - 4; x += step) {
          if (!glow && lit.length <= k) lit.push(r() < (zaun ? 0.4 : 0.3));
          const on = lit[k++];
          if (glow) {
            if (!on) continue;
            g.fillStyle = zaun ? (k % 5 ? '#ffb45a' : '#4affc8') : '#ffd890';
          } else g.fillStyle = on ? (zaun ? '#ffcf8a' : '#ffe6a8') : zaun ? '#1a1e22' : '#4a5a72';
          if (zaun) g.fillRect(x, y, 14, 18);
          else {
            // Ventanal de arco de medio punto
            g.beginPath();
            g.moveTo(x, y + 22);
            g.lineTo(x, y + 8);
            g.arc(x + 7, y + 8, 7, Math.PI, 0);
            g.lineTo(x + 14, y + 22);
            g.closePath();
            g.fill();
          }
        }
      }
    };
    return { map: canvasTex(S, S, paint(false), true), glow: canvasTex(S, S, paint(true), true) };
  }

  function glowTex(rgb) {
    return canvasTex(128, 128, (g) => {
      const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
      grd.addColorStop(0, `rgba(${rgb},1)`);
      grd.addColorStop(0.3, `rgba(${rgb},0.45)`);
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

  // Suelo de la ciudad: calles, aceras, plazas y nombres de los barrios.
  function groundTex(map) {
    const zaun = map.id === 'zaun';
    const W = 2048;
    const H = Math.round((W * map.h) / map.w);
    const s = W / map.w;
    return canvasTex(W, H, (g) => {
      const r = rng(map.def.seed + 99);
      const P = map.def.palette;
      g.fillStyle = zaun ? '#141c19' : '#b8a27a';
      g.fillRect(0, 0, W, H);
      // Textura de adoquines o de lodo
      for (let i = 0; i < 9000; i++) {
        const v = r();
        g.fillStyle = zaun ? `rgba(${v < 0.5 ? '0,0,0' : '60,90,70'},${0.08 + r() * 0.12})` : `rgba(${v < 0.5 ? '90,70,40' : '255,240,210'},${0.06 + r() * 0.1})`;
        g.fillRect(r() * W, r() * H, 2 + r() * 5, 2 + r() * 4);
      }
      for (const d of map.def.districts) {
        const [x, y, w, h] = d.rect;
        g.fillStyle = d.tint.replace(/[\d.]+\)$/, (a) => `${Math.min(0.3, parseFloat(a) * 3)})`);
        g.fillRect(x * s, y * s, w * s, h * s);
      }
      // Calles con aceras
      const B = map.BLOCK;
      const st = map.STREET;
      for (const [wid, col] of [[st, zaun ? '#2c2a26' : '#d8c8a2'], [st - 22, P.street]]) {
        g.strokeStyle = col;
        g.lineWidth = wid * s;
        g.beginPath();
        for (let x = 0; x <= map.w; x += B) { g.moveTo(x * s, 0); g.lineTo(x * s, H); }
        for (let y = 0; y <= map.h; y += B) { g.moveTo(0, y * s); g.lineTo(W, y * s); }
        g.stroke();
      }
      g.setLineDash([10 * s * 2, 12 * s * 2]);
      g.lineWidth = 2;
      g.strokeStyle = zaun ? 'rgba(143,191,58,0.35)' : 'rgba(255,240,200,0.6)';
      g.stroke();
      g.setLineDash([]);
      if (zaun) {
        // Charcos de mugre y tuberías tiradas por el suelo
        for (let i = 0; i < 160; i++) {
          g.fillStyle = r() < 0.2 ? 'rgba(120,200,60,0.18)' : 'rgba(0,0,0,0.25)';
          g.beginPath();
          g.ellipse(r() * W, r() * H, 6 + r() * 30, 4 + r() * 16, r() * 3, 0, Math.PI * 2);
          g.fill();
        }
        g.strokeStyle = 'rgba(100,140,90,0.5)';
        g.lineWidth = 5;
        for (let i = 0; i < 6; i++) {
          g.beginPath();
          g.moveTo(0, (180 + i * 360) * s);
          g.bezierCurveTo(800 * s, (100 + i * 360) * s, 2000 * s, (300 + i * 360) * s, W, (200 + i * 360) * s);
          g.stroke();
        }
      }
      // Plazas en los lugares
      for (const l of map.def.locations) {
        const cx = l.x * s;
        const cy = l.y * s;
        const R = 140 * s;
        g.fillStyle = zaun ? '#1d2622' : '#e8dcbc';
        g.beginPath();
        g.arc(cx, cy, R, 0, Math.PI * 2);
        g.fill();
        g.strokeStyle = zaun ? 'rgba(63,191,159,0.6)' : '#c9a24a';
        g.lineWidth = 4;
        g.stroke();
        if (!zaun) {
          // Rosa de los vientos dorada
          g.strokeStyle = 'rgba(180,140,60,0.6)';
          g.lineWidth = 2;
          for (let a = 0; a < 8; a++) {
            g.beginPath();
            g.moveTo(cx, cy);
            g.lineTo(cx + Math.cos((a * Math.PI) / 4) * R * 0.85, cy + Math.sin((a * Math.PI) / 4) * R * 0.85);
            g.stroke();
          }
        }
      }
      // Nombres de los barrios pintados en el suelo
      g.textAlign = 'center';
      g.font = `bold ${Math.round(64 * s)}px Georgia, serif`;
      for (const d of map.def.districts) {
        const [x, y, w, h] = d.rect;
        g.fillStyle = zaun ? 'rgba(120,255,210,0.10)' : 'rgba(90,60,20,0.16)';
        g.fillText(d.name.toUpperCase(), (x + w / 2) * s, (y + h / 2) * s);
      }
    });
  }

  // ---------- Geometría ----------
  // Une muchas geometrías en una sola (una llamada de dibujo por material).
  function merge(items) {
    const parts = items.map(({ geo, color }) => ({ g: geo.index ? geo.toNonIndexed() : geo, c: new T.Color(color) }));
    const n = parts.reduce((a, p) => a + p.g.attributes.position.count, 0);
    const pos = new Float32Array(n * 3);
    const nor = new Float32Array(n * 3);
    const uv = new Float32Array(n * 2);
    const col = new Float32Array(n * 3);
    let o = 0;
    for (const { g, c } of parts) {
      const cnt = g.attributes.position.count;
      pos.set(g.attributes.position.array, o * 3);
      nor.set(g.attributes.normal.array, o * 3);
      if (g.attributes.uv) uv.set(g.attributes.uv.array, o * 2);
      for (let i = 0; i < cnt; i++) { col[(o + i) * 3] = c.r; col[(o + i) * 3 + 1] = c.g; col[(o + i) * 3 + 2] = c.b; }
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

  // Caja con las ventanas a escala real (una celda de textura = `cell` unidades).
  function facadeBox(w, h, d, cell) {
    const g = new T.BoxGeometry(w, h, d);
    const uv = g.attributes.uv;
    for (let f = 0; f < 6; f++) {
      for (let i = 0; i < 4; i++) {
        const k = f * 4 + i;
        if (f === 2 || f === 3) { uv.setXY(k, 0.01, 0.01); continue; } // tejado y base: pared lisa
        uv.setXY(k, (uv.getX(k) * (f < 2 ? d : w)) / cell, (uv.getY(k) * h) / cell);
      }
    }
    return g;
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
    return mat;
  }

  function glowSprite(tex, size, opacity = 1) {
    const s = new T.Sprite(new T.SpriteMaterial({ map: tex, blending: T.AdditiveBlending, depthWrite: false, transparent: true, opacity }));
    s.scale.set(size, size, 1);
    return s;
  }

  // ---------- Construcción de cada ciudad ----------
  function buildPiltover(map, R) {
    const grp = new T.Group();
    const r = rng(map.def.seed * 31);
    const fac = facadeTex(false, 21);
    const wallMat = cutaway(new T.MeshStandardMaterial({ map: fac.map, emissiveMap: fac.glow, emissive: 0xffc070, emissiveIntensity: 0.25, vertexColors: true, roughness: 0.75 }));
    const roofMat = cutaway(new T.MeshStandardMaterial({ vertexColors: true, metalness: 0.55, roughness: 0.35 }));
    const walls = [];
    const roofs = [];
    const gold = 0xd8b060;
    const clocks = [];
    const addBuilding = (x, z, w, d, h, bodyCol, roofCol, kind, tower) => {
      walls.push({ geo: facadeBox(w, h, d, 150).translate(x, h / 2, z), color: bodyCol });
      roofs.push({ geo: new T.BoxGeometry(w + 8, 7, d + 8).translate(x, h + 3, z), color: gold }); // cornisa dorada
      roofs.push({ geo: new T.BoxGeometry(w + 4, 5, d + 4).translate(x, h * 0.35, z), color: 0xcdb98e }); // imposta
      const m = Math.min(w, d);
      if (kind < 0.3) roofs.push({ geo: new T.SphereGeometry(m * 0.42, 18, 9, 0, Math.PI * 2, 0, Math.PI / 2).translate(x, h + 6, z), color: r() < 0.5 ? gold : 0x4a9a8a });
      else if (kind < 0.75) roofs.push({ geo: new T.ConeGeometry(m * 0.72, m * 0.7, 4).rotateY(Math.PI / 4).translate(x, h + 6 + m * 0.35, z), color: roofCol });
      else {
        roofs.push({ geo: new T.BoxGeometry(w * 0.7, 14, d * 0.7).translate(x, h + 13, z), color: bodyCol });
        roofs.push({ geo: new T.CylinderGeometry(2, 5, m * 0.45, 6).translate(x, h + 20 + m * 0.22, z), color: gold });
      }
      if (tower) {
        const tw = m * 0.42;
        const th = 150;
        walls.push({ geo: facadeBox(tw, th, tw, 150).translate(x, h + th / 2, z), color: bodyCol });
        roofs.push({ geo: new T.ConeGeometry(tw * 0.8, tw * 1.6, 4).rotateY(Math.PI / 4).translate(x, h + th + tw * 0.8, z), color: 0x3a8a8a });
        clocks.push([x, h + th * 0.7, z, tw]);
      }
    };
    for (const b of map.buildings) {
      const h = 90 + b.tall * 200 + (b.w > 140 ? 40 : 0);
      addBuilding(b.x + b.w / 2, b.y + b.h / 2, b.w, b.h, h, b.color, b.roof, b.style, b.tall > 0.9);
    }
    // Ciudad de relleno fuera de los límites (oeste, norte y este; al sur está el mar)
    const pal = map.def.palette;
    for (let x = -900; x < map.w + 900; x += 170) {
      for (let z = -900; z < map.h + 60; z += 170) {
        if (x > -40 && x < map.w + 40 && z > -40) continue;
        if (r() < 0.15) continue;
        const w = 80 + r() * 70;
        addBuilding(x + r() * 30, z + r() * 30, w, w * (0.8 + r() * 0.4), 120 + r() * 320, pal.building[Math.floor(r() * 4)], pal.roof[Math.floor(r() * 4)], r(), r() < 0.08);
      }
    }
    const wallMesh = new T.Mesh(merge(walls), wallMat);
    const roofMesh = new T.Mesh(merge(roofs), roofMat);
    for (const m of [wallMesh, roofMesh]) { m.castShadow = m.receiveShadow = true; grp.add(m); }
    // Esferas de reloj
    const clockTex = canvasTex(128, 128, (g) => {
      g.fillStyle = '#fff3cf'; g.beginPath(); g.arc(64, 64, 60, 0, Math.PI * 2); g.fill();
      g.strokeStyle = '#7a5a1a'; g.lineWidth = 6; g.stroke();
      g.lineWidth = 3;
      for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; g.beginPath(); g.moveTo(64 + Math.cos(a) * 46, 64 + Math.sin(a) * 46); g.lineTo(64 + Math.cos(a) * 54, 64 + Math.sin(a) * 54); g.stroke(); }
      g.lineWidth = 5; g.beginPath(); g.moveTo(64, 64); g.lineTo(64, 24); g.moveTo(64, 64); g.lineTo(92, 70); g.stroke();
    });
    const clockMat = new T.MeshBasicMaterial({ map: clockTex });
    for (const [x, y, z, tw] of clocks) {
      for (let a = 0; a < 4; a++) {
        const c = new T.Mesh(new T.CircleGeometry(tw * 0.36, 24), clockMat);
        c.position.set(x + Math.sin((a * Math.PI) / 2) * (tw / 2 + 0.6), y, z + Math.cos((a * Math.PI) / 2) * (tw / 2 + 0.6));
        c.rotation.y = (a * Math.PI) / 2;
        grp.add(c);
      }
    }

    // Parques con árboles en los solares
    const trees = [];
    for (const lot of map.lots) {
      for (let i = 0; i < 5; i++) {
        const x = lot.x + 20 + r() * (lot.size - 40);
        const z = lot.y + 20 + r() * (lot.size - 40);
        const s = 18 + r() * 14;
        trees.push({ geo: new T.CylinderGeometry(3, 4, 26, 6).translate(x, 13, z), color: 0x6a4a2a });
        trees.push({ geo: new T.SphereGeometry(s, 10, 8).scale(1, 1.15, 1).translate(x, 26 + s, z), color: r() < 0.5 ? 0x6a8a3a : 0x8a9a4a });
      }
    }
    if (trees.length) {
      const tm = new T.Mesh(merge(trees), cutaway(new T.MeshStandardMaterial({ vertexColors: true, roughness: 0.9 })));
      tm.castShadow = tm.receiveShadow = true;
      grp.add(tm);
    }

    // El mar al sur, el malecón, las Hexpuertas y el Puente del Progreso
    const sea = new T.Mesh(new T.PlaneGeometry(9000, 4000), new T.MeshStandardMaterial({ color: 0x2a6f95, roughness: 0.12, metalness: 0.35 }));
    sea.rotation.x = -Math.PI / 2;
    sea.position.set(map.w / 2, -18, map.h + 2040);
    grp.add(sea);
    const wall = new T.Mesh(new T.BoxGeometry(map.w + 1800, 30, 40), new T.MeshStandardMaterial({ color: 0xcdb98e, roughness: 0.8 }));
    wall.position.set(map.w / 2, -3, map.h + 20);
    wall.receiveShadow = true;
    grp.add(wall);
    const hex = R.loc('hexpuertas');
    const brass = new T.MeshStandardMaterial({ color: gold, metalness: 0.8, roughness: 0.25 });
    if (hex) {
      const gate = new T.Group();
      const ring = new T.Mesh(new T.TorusGeometry(170, 18, 12, 64), brass);
      const inner = new T.Mesh(new T.TorusGeometry(150, 6, 8, 64), new T.MeshBasicMaterial({ color: 0x7fd0ff }));
      const portal = new T.Mesh(new T.CircleGeometry(148, 48), new T.MeshBasicMaterial({ color: 0x3fa9f5, transparent: true, opacity: 0.25, blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide }));
      gate.add(ring, inner, portal);
      for (const sx of [-1, 1]) {
        const pillar = new T.Mesh(new T.BoxGeometry(40, 260, 40), brass);
        pillar.position.set(sx * 190, -40, 0);
        gate.add(pillar);
      }
      gate.position.set(hex.x, 150, map.h + 60);
      grp.add(gate);
      R.dyn.portal = portal;
      R.dyn.gateRing = inner;
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
    const shipMat = cutaway(new T.MeshStandardMaterial({ color: 0xe8dcc0, roughness: 0.6 }));
    for (let i = 0; i < 4; i++) {
      const s = new T.Group();
      const body = new T.Mesh(new T.SphereGeometry(70, 20, 12), shipMat);
      body.scale.set(1.6, 0.6, 0.6);
      const gon = new T.Mesh(new T.BoxGeometry(60, 18, 24), brass);
      gon.position.y = -48;
      const fin = new T.Mesh(new T.BoxGeometry(30, 50, 4), brass);
      fin.position.set(-105, 0, 0);
      s.add(body, gon, fin);
      s.traverse((m) => { m.castShadow = true; });
      grp.add(s);
      R.dyn.airships.push({ s, ph: i * 1.7, rad: 700 + i * 260, y: 430 + i * 45, sp: 0.02 + i * 0.006 });
    }
    return grp;
  }

  function buildZaun(map, R) {
    const grp = new T.Group();
    const r = rng(map.def.seed * 17);
    const fac = facadeTex(true, 33);
    const wallMat = cutaway(new T.MeshStandardMaterial({ map: fac.map, emissiveMap: fac.glow, emissive: 0xffffff, emissiveIntensity: 0.9, vertexColors: true, roughness: 0.9, metalness: 0.15 }));
    const metalMat = cutaway(new T.MeshStandardMaterial({ vertexColors: true, metalness: 0.6, roughness: 0.55 }));
    const walls = [];
    const metal = [];
    R.dyn.neon = [];
    R.dyn.chimneys = [];
    const neonMats = {};
    const neonMat = (c) => (neonMats[c] ||= new T.MeshBasicMaterial({ color: c }));
    const rust = [0x5a3a2a, 0x3a3a3a, 0x4a4a3a, 0x6a4a2a];
    for (const b of map.buildings) {
      const x = b.x + b.w / 2;
      const z = b.y + b.h / 2;
      const h = 45 + b.tall * 140;
      walls.push({ geo: facadeBox(b.w, h, b.h, 110).translate(x, h / 2, z), color: b.color });
      metal.push({ geo: new T.BoxGeometry(b.w + 10, 4, b.h + 10).translate(x, h + 2, z), color: rust[Math.floor(r() * 4)] });
      let top = h;
      // Pisos añadidos a mano, descolocados, encima de otros
      if (b.style < 0.6) {
        const w2 = b.w * (0.5 + r() * 0.3);
        const d2 = b.h * (0.5 + r() * 0.3);
        const h2 = 30 + r() * 70;
        const ox = (r() - 0.5) * (b.w - w2);
        const oz = (r() - 0.5) * (b.h - d2);
        walls.push({ geo: facadeBox(w2, h2, d2, 110).translate(x + ox, h + h2 / 2, z + oz), color: b.color });
        metal.push({ geo: new T.BoxGeometry(w2 + 12, 3, d2 + 12).rotateZ((r() - 0.5) * 0.2).translate(x + ox, h + h2 + 2, z + oz), color: rust[Math.floor(r() * 4)] });
        top = h + h2;
      }
      if (b.style > 0.8) {
        // Depósito de agua sobre patas
        metal.push({ geo: new T.CylinderGeometry(14, 14, 26, 10).translate(x - b.w * 0.2, top + 30, z), color: 0x4a3a2a });
        metal.push({ geo: new T.BoxGeometry(3, 18, 3).translate(x - b.w * 0.2, top + 9, z), color: 0x2a2a2a });
      }
      if (b.chimney) {
        const cx = x + b.w / 2 - 14;
        const ch = 50 + r() * 70;
        metal.push({ geo: new T.CylinderGeometry(6, 9, ch, 8).translate(cx, top + ch / 2, z - b.h / 4), color: 0x2a2a30 });
        R.dyn.chimneys.push([cx, top + ch, z - b.h / 4]);
      }
      if (b.sign) {
        // Letrero de neón en una de las fachadas
        const c = b.roof;
        const sides = [[0, 1], [1, 0], [0, -1], [-1, 0]];
        const [sx, sz] = sides[Math.floor(r() * 4)];
        const n = new T.Mesh(new T.BoxGeometry(sx ? 2 : b.w * 0.55, 10 + r() * 12, sz ? 2 : b.h * 0.55), neonMat(c));
        n.position.set(x + (sx * b.w) / 2 + sx * 2, h * (0.45 + r() * 0.4), z + (sz * b.h) / 2 + sz * 2);
        grp.add(n);
        const halo = glowSprite(R.tex.glow(c), 90, 0.55);
        halo.position.copy(n.position);
        grp.add(halo);
        R.dyn.neon.push({ n, halo, ph: r() * 20 });
      }
    }
    // Paredes del pozo: la ciudad sube en vertical hasta Piltover
    const pit = [];
    const M = 520;
    const add = (x, z, w, d) => {
      for (let k = 0; k < 3; k++) {
        const hh = 500 + r() * 600;
        pit.push({ geo: facadeBox(w * (0.8 + r() * 0.3), hh, d * (0.8 + r() * 0.3), 110).translate(x + (r() - 0.5) * 60, hh / 2 - k * 10, z + (r() - 0.5) * 60), color: 0x3a3a46 });
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

    // Tuberías gigantes que cruzan por encima de las calles
    const pipeMat = cutaway(new T.MeshStandardMaterial({ color: 0x4a6a4a, metalness: 0.7, roughness: 0.45 }));
    for (let i = 0; i < 7; i++) {
      const z0 = 120 + i * 330;
      const y0 = 140 + r() * 110;
      const curve = new T.CatmullRomCurve3([
        new T.Vector3(-M, y0 + 60, z0 + (r() - 0.5) * 200), new T.Vector3(map.w * 0.3, y0, z0 + (r() - 0.5) * 300),
        new T.Vector3(map.w * 0.65, y0 + 40, z0 + (r() - 0.5) * 300), new T.Vector3(map.w + M, y0 + 80, z0 + (r() - 0.5) * 200),
      ]);
      const pipe = new T.Mesh(new T.TubeGeometry(curve, 80, 9 + r() * 8, 10, false), pipeMat);
      pipe.castShadow = true;
      grp.add(pipe);
    }
    // Charcas químicas en los solares vacíos
    const chem = new T.MeshBasicMaterial({ color: 0x7aff4a, transparent: true, opacity: 0.55 });
    const chemGlow = R.tex.glow(0x7aff4a);
    R.dyn.pools = [];
    for (const lot of map.lots) {
      const p = new T.Mesh(new T.CircleGeometry(lot.size * 0.32, 24), chem);
      p.rotation.x = -Math.PI / 2;
      p.scale.set(1, 0.7 + r() * 0.5, 1);
      p.position.set(lot.x + lot.size / 2, 1.5, lot.y + lot.size / 2);
      grp.add(p);
      const g = glowSprite(chemGlow, lot.size * 1.1, 0.4);
      g.position.set(p.position.x, 20, p.position.z);
      grp.add(g);
      R.dyn.pools.push(g);
    }
    // Bajos del Puente del Progreso, que sube hacia Piltover
    const br = R.loc('puente-zaun');
    if (br) {
      const deck = new T.Mesh(new T.BoxGeometry(110, 12, 1400), new T.MeshStandardMaterial({ color: 0x8a6a42, metalness: 0.5, roughness: 0.5 }));
      deck.position.set(br.x, 650, -500);
      deck.rotation.x = -0.55;
      grp.add(deck);
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
    // Farolas en los cruces
    const posts = [];
    R.dyn.lamps = [];
    const lampTex = R.tex.glow(zaun ? 0x8fbf3a : 0x7fd0ff);
    for (let x = map.BLOCK; x < map.w; x += map.BLOCK) {
      for (let y = map.BLOCK; y < map.h; y += map.BLOCK) {
        if ((x / map.BLOCK + y / map.BLOCK) % 2) continue;
        const px = x + map.STREET / 2 - 6;
        const pz = y + map.STREET / 2 - 6;
        posts.push({ geo: new T.CylinderGeometry(2.5, 4, 56, 6).translate(px, 28, pz), color: zaun ? 0x22222a : 0x6a5a2a });
        posts.push({ geo: new T.OctahedronGeometry(6).translate(px, 62, pz), color: zaun ? 0x8fbf3a : 0x7fd0ff });
        const s = glowSprite(lampTex, 70);
        s.position.set(px, 62, pz);
        grp.add(s);
        R.dyn.lamps.push({ s, ph: r() * 10 });
      }
    }
    const pm = new T.Mesh(merge(posts), new T.MeshStandardMaterial({ vertexColors: true, metalness: 0.6, roughness: 0.4, emissive: zaun ? 0x203010 : 0x102030 }));
    pm.castShadow = true;
    grp.add(pm);

    // Anillos de los lugares y haz de luz del objetivo
    R.dyn.rings = {};
    const ringCol = zaun ? 0x3fbf9f : 0xe3c45a;
    for (const l of map.def.locations) {
      const ring = new T.Mesh(new T.RingGeometry(88, 100, 48), new T.MeshBasicMaterial({ color: ringCol, transparent: true, opacity: 0.55, blending: T.AdditiveBlending, depthWrite: false }));
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
    const gemMat = new T.MeshStandardMaterial({ color: 0x7fd0ff, emissive: 0x3fa9f5, emissiveIntensity: 1.6, roughness: 0.1, metalness: 0.2 });
    const frameMat = new T.MeshStandardMaterial({ color: 0xe3c45a, metalness: 0.85, roughness: 0.25 });
    const glow = R.tex.glow(0x5ab8ff);
    for (const f of map.def.fragments) {
      const c = new T.Group();
      const gem = new T.Mesh(new T.OctahedronGeometry(13), gemMat);
      gem.scale.set(1, 1.6, 1);
      const ring = new T.Mesh(new T.TorusGeometry(24, 2.2, 6, 6), frameMat);
      const halo = glowSprite(glow, 110, 0.9);
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
    const zaun = map.id === 'zaun';
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
          const mat = new T.MeshBasicMaterial({ map: tex, alphaMap: edgeAlpha, transparent: true, side: T.BackSide, fog: false, depthWrite: false, color: zaun ? 0x9fc8b8 : 0xffffff });
          const m = new T.Mesh(geo, mat);
          m.position.y = H / 2 - (zaun ? 100 : 380);
          m.renderOrder = -1;
          ring.add(m);
        }, undefined, () => {});
      }
    });
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
    const scene = new T.Scene();
    const camera = new T.PerspectiveCamera(42, 16 / 9, 5, 9000);

    const sky = new T.Mesh(new T.SphereGeometry(6000, 32, 16), new T.ShaderMaterial({
      side: T.BackSide, depthWrite: false, fog: false,
      uniforms: { top: { value: new T.Color() }, mid: { value: new T.Color() }, bot: { value: new T.Color() } },
      vertexShader: 'varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader: 'uniform vec3 top; uniform vec3 mid; uniform vec3 bot; varying vec3 vP; void main(){ float h = normalize(vP).y; vec3 c = h > 0.0 ? mix(mid, top, smoothstep(0.0, 0.5, h)) : mix(mid, bot, smoothstep(0.0, -0.3, h)); gl_FragColor = vec4(c, 1.0); }',
    }));
    scene.add(sky);
    const hemi = new T.HemisphereLight();
    const sun = new T.DirectionalLight();
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    Object.assign(sun.shadow.camera, { left: -900, right: 900, top: 900, bottom: -900, near: 10, far: 4000 });
    sun.shadow.bias = -0.0006;
    sun.shadow.normalBias = 1.5;
    scene.add(hemi, sun, sun.target);
    const lantern = new T.PointLight(0xffc27a, 0, 700, 1.4);
    scene.add(lantern);

    // Polvo dorado o esporas que flotan alrededor del jugador
    const N = 700;
    const dustPos = new Float32Array(N * 3);
    const dr = rng(3);
    for (let i = 0; i < N; i++) { dustPos[i * 3] = (dr() - 0.5) * 1800; dustPos[i * 3 + 1] = dr() * 420; dustPos[i * 3 + 2] = (dr() - 0.5) * 1800; }
    const dustGeo = new T.BufferGeometry();
    dustGeo.setAttribute('position', new T.BufferAttribute(dustPos, 3));
    const dust = new T.Points(dustGeo, new T.PointsMaterial({ size: 4, transparent: true, opacity: 0.8, blending: T.AdditiveBlending, depthWrite: false }));
    dust.frustumCulled = false;
    scene.add(dust);

    const glowCache = {};
    return {
      canvas, renderer, scene, camera, sky, hemi, sun, lantern, dust, groups: {}, group: null, map: null, dyn: {}, backdrops: {},
      tex: { glow: (c) => (glowCache[c] ||= glowTex(new T.Color(c).toArray().map((v) => Math.round(v * 255)).join(','))) },
      loc: null,
      cam: { yaw: 0, pitch: 0.92, dist: 820, goalYaw: 0, goalPitch: 0.92, goalDist: 820, focus: new T.Vector3(), mouse: { x: 0, y: 0 } },
      host: null, w: 0, h: 0,
    };
  }

  function setMap(map) {
    if (!R) return;
    R.map = map;
    R.loc = (id) => map.def.locations.find((l) => l.id === id);
    if (R.group) R.scene.remove(R.group);
    if (!R.groups[map.id]) {
      R.dyn = {};
      const grp = new T.Group();
      const ground = new T.Mesh(new T.PlaneGeometry(map.w, map.h), new T.MeshStandardMaterial({ map: groundTex(map), roughness: 0.95 }));
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
    R.sky.material.uniforms.top.value.setHex(L.sky[0]);
    R.sky.material.uniforms.mid.value.setHex(L.sky[1]);
    R.sky.material.uniforms.bot.value.setHex(L.sky[2]);
    R.scene.background = new T.Color(L.bg);
    R.scene.fog = new T.FogExp2(L.fog, L.fogD);
    R.hemi.color.setHex(L.hemi[0]);
    R.hemi.groundColor.setHex(L.hemi[1]);
    R.hemi.intensity = L.hemi[2];
    R.sun.color.setHex(L.sun[0]);
    R.sun.intensity = L.sun[1];
    R.renderer.toneMappingExposure = L.exposure;
    R.dust.material.color.setHex(L.dust);
    R.lantern.intensity = L.lantern ? 70000 : 0;
    R.cam.goalPitch = R.cam.pitch = L.pitch;
  }

  function resize() {
    const w = R.host.clientWidth;
    const h = R.host.clientHeight;
    if (!w || !h || (w === R.w && h === R.h)) return;
    R.w = w;
    R.h = h;
    R.renderer.setSize(w, h, false);
    R.camera.aspect = w / h;
    R.camera.updateProjectionMatrix();
  }

  const v3 = new T.Vector3();

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
    R.lantern.position.set(info.x, 90, info.y);

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
    for (const l of D.lamps || []) l.s.material.opacity = R.map.id === 'zaun' ? (Math.sin(s * 9 + l.ph * 3) > 0.92 ? 0.25 : 0.85 + Math.sin(s * 3 + l.ph) * 0.15) : 0.85 + Math.sin(s * 0.7 + l.ph) * 0.1;
    for (const n of D.neon || []) {
      const on = Math.sin(s * 2.5 + n.ph) > -0.8 && !(Math.sin(s * 19 + n.ph * 3) > 0.95);
      n.n.visible = on;
      n.halo.visible = on;
    }
    for (const g of D.pools || []) g.material.opacity = 0.3 + Math.sin(s * 1.5 + g.position.x) * 0.1;
    for (const a of D.airships || []) {
      const ang = s * a.sp + a.ph;
      a.s.position.set(R.map.w / 2 + Math.cos(ang) * a.rad * 1.3, a.y + Math.sin(s * 0.5 + a.ph) * 8, R.map.h / 2 + Math.sin(ang) * a.rad);
      a.s.rotation.y = -ang - Math.PI;
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
      ring.material.color.setHex(isObj ? 0xffe08a : R.map.id === 'zaun' ? 0x3fbf9f : 0xe3c45a);
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
    R.renderer.render(R.scene, R.camera);
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
    // Vuelve a cargar los fondos (después de bajar imágenes nuevas).
    reloadBackdrops() { if (R) Object.values(R.backdrops).forEach((f) => f()); },
    render,
    project,
    pick,
    get yaw() { return R ? R.cam.yaw : 0; },
    rotate(d) { R.cam.goalYaw += d; },
    tilt(d) { R.cam.goalPitch = Math.min(1.3, Math.max(0.3, R.cam.goalPitch + d)); },
    zoom(f) { R.cam.goalDist = Math.min(1600, Math.max(380, R.cam.goalDist * f)); },
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
