// Cinco espacios de Piltover en 3D inspirados en los encuadres compartidos.
// Geometría original, sin reutilizar imágenes como simples fondos.
// El recorrido exige inspeccionar una pista y llegar a un objetivo físico.
(function () {
  const T = window.THREE;
  const scenes = {
    consejo: { name: 'Sala del Consejo', kind: 'council', color: 0xe8d79e,
      clue: 'La documentación del Consejo contiene nombres que faltan en el acta.' },
    'taller-jayce': { name: 'Laboratorio de Jayce y Viktor', kind: 'workshop', color: 0x78c4d8,
      clue: 'En la pizarra encuentras una ecuación hextec corregida a mano.' },
    academia: { name: 'Aulas de la Academia', kind: 'workshop', color: 0xcab477,
      clue: 'Un registro de prácticas revela quién utilizó el taller.' },
    hexpuertas: { name: 'Torre de las Hexpuertas', kind: 'skyline', color: 0x6bbcf7,
      clue: 'Un registro del tráfico aéreo muestra una ruta que no figura en los permisos.' },
    'muelle-stillwater': { name: 'Fortaleza de Stillwater', kind: 'fortress', color: 0xe47876,
      clue: 'Una orden de traslado está firmada por alguien que no debería estar aquí.' },
    puente: { name: 'Puente del Progreso', kind: 'bridge', color: 0xdec087,
      clue: 'Un sello desgastado en una caseta indica quién controlaba el paso.' },
  };
  const aliases = { ejecutores: 'fortress', 'mansion-kiramman': 'council', plaza: 'skyline', artesanos: 'workshop' };
  let session = null;
  /** Comprueba si el lugar tiene una escena exploratoria en Piltover. */
  function has(id) { return !!(scenes[id] || aliases[id]); }
  /** Obtiene el espacio exacto o una variación ambiental para edificios secundarios. */
  function spec(id) {
    if (scenes[id]) return scenes[id];
    const kind = aliases[id];
    if (!kind) return null;
    const parent = Object.values(scenes).find((s) => s.kind === kind);
    const names = { ejecutores: 'Jefatura de los Ejecutores', 'mansion-kiramman': 'Mansión Kiramman', plaza: 'Plaza del Progreso', artesanos: 'Mercado de Artesanos' };
    return { ...parent, name: names[id], clue: 'Encuentras una pista relacionada con ' + names[id] + '.' };
  }
  const K = window.InteriorKit;
  /** Crea un material pintado de piedra, metal o hextec luminosa. */
  function mat(color, glow = false, metalness = 0.28, kind = metalness > 0.4 ? 'metal' : 'stone') {
    return new T.MeshStandardMaterial({ color, map: glow || !K ? null : K.brush(kind), roughness: glow ? 0.3 : 0.74,
      metalness, emissive: glow ? color : 0, emissiveIntensity: glow ? 1.15 : 0, side: T.DoubleSide });
  }
  /** Agrega una pieza arquitectónica ortogonal al mundo. */
  function block(group, x, y, z, w, h, d, material) {
    const obj = new T.Mesh(new T.BoxGeometry(w, h, d), material);
    obj.position.set(x, y, z); obj.castShadow = true; obj.receiveShadow = true;
    group.add(obj); return obj;
  }
  /** Dibuja pilares, tensores y conducciones entre coordenadas 3D. */
  function beam(group, a, b, radius, material, sides = 8) {
    const start = new T.Vector3(...a), end = new T.Vector3(...b);
    const delta = end.clone().sub(start);
    const obj = new T.Mesh(new T.CylinderGeometry(radius, radius, delta.length(), sides), material);
    obj.position.copy(start).add(end).multiplyScalar(0.5);
    obj.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), delta.normalize());
    obj.castShadow = true; obj.receiveShadow = true; group.add(obj); return obj;
  }
  /** Sitúa esferas de energía, engranajes y marcadores en el espacio. */
  function sphere(group, x, y, z, r, material, detail = 1) {
    const obj = new T.Mesh(new T.IcosahedronGeometry(r, detail), material);
    obj.position.set(x, y, z); group.add(obj); return obj;
  }
  /** Columna clásica de Piltover: basa, fuste estriado y capitel dorado. */
  function column(group, x, z, h, stone, gold) {
    block(group, x, 1, z, 5, 2, 5, stone);
    const shaft = new T.Mesh(new T.CylinderGeometry(1.7, 1.9, h - 4, 12), stone);
    shaft.position.set(x, h / 2, z); shaft.castShadow = true; shaft.receiveShadow = true; group.add(shaft);
    block(group, x, h - 1.4, z, 4.6, 1.2, 4.6, gold);
    block(group, x, h - 0.4, z, 5.4, 0.8, 5.4, stone);
  }
  /** Engranaje decorativo de latón (anillo con dientes). */
  function gear(group, x, y, z, r, gold, ry = 0) {
    const g = new T.Group(); g.position.set(x, y, z); g.rotation.y = ry;
    const ring = new T.Mesh(new T.TorusGeometry(r, r * 0.16, 6, 24), gold); g.add(ring);
    for (let i = 0; i < 12; i++) {
      const t = new T.Mesh(new T.BoxGeometry(r * 0.22, r * 0.3, r * 0.2), gold);
      t.position.set(Math.cos(i * Math.PI / 6) * r * 1.15, Math.sin(i * Math.PI / 6) * r * 1.15, 0); t.rotation.z = i * Math.PI / 6; g.add(t);
    }
    g.userData.noCollide = true; group.add(g); return g;
  }
  /** Estandarte colgante azul y dorado. */
  function banner(group, x, y, z, h, blue, gold, rotY = 0) {
    const b = block(group, x, y - h / 2, z, 6, h, 0.25, blue); b.rotation.y = rotY; b.userData.noCollide = true;
    const e = block(group, x, y - h * 0.35, z, 2.2, 2.2, 0.35, gold); e.rotation.set(0, rotY, Math.PI / 4); e.userData.noCollide = true;
    const bar = block(group, x, y + 0.3, z, 7.5, 0.5, 0.5, gold); bar.rotation.y = rotY;
  }
  /** Levanta el escenario modular con la composición propia de cada referencia. */
  function build(group, cfg) {
    const marble = mat(0xe6ddbd), cream = mat(0xc9bb9b), dark = mat(0x424e55, false, 0.5);
    const gold = mat(0xc29b5a, false, 0.75), teal = mat(0x478b97), blue = mat(0x69d7ff, true);
    const violet = mat(0x6d779c, true), warm = mat(0xffd08a, true), navy = mat(0x2a3f6a, false, 0.1, 'wood');
    const wood = mat(0x5a3b2a, false, 0.05, 'wood');
    const glass = new T.MeshStandardMaterial({
      color: 0xaccdcd, transparent: true, opacity: 0.26, metalness: 0.12, roughness: 0.14, side: T.DoubleSide, depthWrite: false,
    });
    const M = { trim: gold, lit: warm, dark: mat(0x2b3740, false, 0.6), roof: teal };
    block(group, 0, -1, 0, 170, 2, 180, cfg.kind === 'fortress' ? dark : marble);
    for (let i = -6; i <= 6; i++) {
      block(group, i * 12, 0.05, 0, 0.25, 0.1, 158, gold);
      block(group, 0, 0.05, i * 12, 155, 0.1, 0.25, gold);
    }
    if (cfg.kind === 'council') {
      // Ventanales geométricos azul y ámbar, columnata, estandartes y mesa circular.
      for (const x of [-44, 0, 44]) {
        block(group, x, 37, -69, 38, 74, 2.2, glass);
        for (const side of [-1, 1]) beam(group, [x + side * 16, 1, -67], [x, 70, -67], 1.15, gold);
        for (const y of [17, 34, 51]) block(group, x, y, -66, 36, 0.9, 1, gold);
        for (const dx of [-9, 0, 9]) block(group, x + dx, 30, -66.5, 0.6, 50, 0.6, gold);
        sphere(group, x, 58, -64, 5, blue);
      }
      const ring = new T.Mesh(new T.TorusGeometry(28, 3, 10, 48), gold);
      ring.rotation.x = Math.PI / 2; ring.position.set(0, 7, -17); group.add(ring);
      block(group, 0, 4.5, -17, 40, 4, 40, teal);
      const seal = new T.Mesh(new T.CircleGeometry(18, 40), mat(0x2f6f86)); seal.rotation.x = -Math.PI / 2; seal.position.set(0, 0.12, 30); seal.userData.noCollide = true; group.add(seal);
      gear(group, 0, 0.2, 30, 14, gold).rotation.x = -Math.PI / 2;
      for (let i = 0; i < 9; i++) {
        const a = i * Math.PI * 2 / 9;
        const x = Math.cos(a) * 38, z = -17 + Math.sin(a) * 38;
        block(group, x, 3, z, 12, 4, 10, gold);
        block(group, x, 7.5, z - 2, 11, 6, 2, dark);
      }
      for (const x of [-80, 80]) block(group, x, 34, -12, 4, 68, 170, cream);
      for (const side of [-1, 1]) for (let z = -55; z <= 45; z += 20) {
        column(group, side * 46, z, 40, marble, gold);
        banner(group, side * 46, 34, z + 3.2, 16, navy, gold);
      }
      block(group, 0, 41, -12, 100, 2, 130, cream).castShadow = false;
      for (let z = -60; z <= 50; z += 22) for (const x of [-25, 25]) sphere(group, x, 36, z, 1.8, warm);
    } else if (cfg.kind === 'workshop') {
      // Biblioteca lateral, pizarra con runas, mesas de laboratorio, engranajes y núcleo hextec.
      for (const side of [-1, 1]) {
        block(group, side * 65, 27, -12, 16, 54, 136, cream);
        for (let y = 8; y < 49; y += 12) {
          block(group, side * 55, y, -18, 9, 1.6, 110, wood);
          for (let z = -65; z < 40; z += 4) {
            const tall = 5 + (Math.abs(z * 7 + y) % 4);
            block(group, side * 55, y + 0.8 + tall / 2, z, 5, tall, 2.6, [dark, teal, navy, wood][Math.abs(z + y) % 4]);
          }
        }
        for (const z of [-60, -20, 20]) column(group, side * 48, z, 54, cream, gold);
      }
      block(group, 0, 33, -72, 112, 59, 3, cream);
      block(group, 0, 34, -69, 91, 42, 0.9, dark);
      block(group, 0, 56, -69, 95, 3, 1.4, gold);
      // Grafo de ecuaciones físicas grabado sobre la pizarra.
      for (let i = 0; i < 20; i++) {
        const x = -42 + (i % 10) * 9, y = 22 + Math.floor(i / 10) * 14;
        beam(group, [x, y, -68], [x + (i % 3) * 2, y + 3 + i % 4, -68], 0.28, gold, 5);
        if (i % 4 === 0) sphere(group, x, y + 3, -67, 1.1, blue);
      }
      for (const x of [-30, 27]) {
        block(group, x, 4.5, 7, 43, 9, 16, wood);
        block(group, x, 9.2, 7, 44, 0.5, 17, gold);
        for (let i = 0; i < 7; i++) beam(group, [x - 16 + i * 5, 9.5, 4], [x - 16 + i * 5, 15 + i % 3 * 4, 4], 1.3, i % 3 ? teal : blue);
      }
      gear(group, -20, 30, -66.5, 7, gold); gear(group, -8, 37, -66.5, 4.5, gold);
      gear(group, 30, 48, -66.5, 5.5, gold);
      // Núcleo hextec en su pedestal, con anillos girando.
      block(group, 30, 1.5, -30, 10, 3, 10, gold);
      beam(group, [30, 3, -30], [30, 12, -30], 1.5, dark);
      sphere(group, 30, 16, -30, 3.2, blue, 0);
      for (const r of [5.5, 7]) { const ring = new T.Mesh(new T.TorusGeometry(r, 0.25, 6, 32), gold); ring.position.set(30, 16, -30); ring.rotation.set(r, r * 2, 0); ring.userData.spin = r; group.add(ring); }
      sphere(group, 30, 23, 8, 6, blue);
      for (const z of [-40, -5, 30]) for (const x of [-20, 20]) {
        beam(group, [x, 54, z], [x, 44, z], 0.12, dark, 4);
        sphere(group, x, 43, z, 1.6, warm);
      }
    } else if (cfg.kind === 'skyline') {
      // Torres art déco con ventanas iluminadas, cúpulas y agujas, anillo de hexpuerta y dirigibles.
      for (const [x, z, h, roof] of [[-41, -48, 112, 'spire'], [47, -57, 72, 'dome'], [-80, -63, 53, 'dome'], [80, -20, 66, 'spire'], [62, 30, 46, 'dome'], [-66, 22, 58, 'spire']]) {
        block(group, x, h / 2, z, 23, h, 23, cream);
        K?.facade(group, { x, y: 0, z, w: 23, h, d: 23 }, { mats: M, faces: ['z+', x > 0 ? 'x-' : 'x+'], style: 'piltover', roof, lit: 0.4, spacing: 5, floor: 11 });
        for (let y = 12; y < h; y += 13) block(group, x, y, z + 12, 18, 2, 2, gold);
        beam(group, [x, h, z], [x, h + 27, z], 1.2, gold);
      }
      const gate = new T.Mesh(new T.TorusGeometry(18, 2, 10, 48), blue);
      gate.position.set(-41, 91, -33); group.add(gate);
      gate.userData.spin = 0.2;
      // Pasarelas entre torres, farolas y siluetas de dirigibles hextec.
      for (const z of [-45, 17]) {
        block(group, 0, 18, z, 133, 4, 11, cream);
        for (const x of [-48, 48]) beam(group, [x, 20, z], [x, 31, z], 1.0, gold);
      }
      for (let z = -40; z <= 50; z += 18) for (const x of [-22, 22]) {
        beam(group, [x, 0, z], [x, 13, z], 0.4, dark, 6);
        sphere(group, x, 13.8, z, 1.3, warm);
      }
      for (let i = 0; i < 5; i++) {
        const x = -65 + i * 32, y = 48 + i % 3 * 14, z = -10 - i % 2 * 35;
        const hull = new T.Mesh(new T.SphereGeometry(6, 18, 12).scale(2.2, 0.8, 0.8), mat(0xd9c9a6)); hull.position.set(x, y, z); group.add(hull);
        block(group, x, y - 5.5, z, 7, 2.2, 3, gold);
        for (const sx of [-1, 1]) block(group, x + sx * 12, y, z, 2.5, 4, 0.4, navy);
      }
    } else if (cfg.kind === 'fortress') {
      // Stillwater: explanada con escalinata, muralla con almenas, torres de guardia y torreón al fondo.
      K?.stairs(group, 0, 44, 32, 0, 6, 46, dark);
      block(group, 0, 3, -22, 136, 6, 108, dark);
      block(group, 0, 40, -86, 104, 82, 24, cream);
      K?.facade(group, { x: 0, y: 0, z: -86, w: 104, h: 82, d: 24 }, { mats: { ...M, lit: mat(0xff9a6a, true) }, faces: ['z+'], style: 'zaun', roof: 'flat', lit: 0.2, spacing: 8, floor: 12 });
      for (const x of [-53, 53]) {
        block(group, x, 46, -78, 15, 92, 15, dark);
        beam(group, [x, 92, -78], [x, 110, -78], 3, gold);
        sphere(group, x, 112, -78, 2.4, mat(0xff8a6a, true));
      }
      // Portón con rastrillo y antorchas.
      block(group, 0, 15, -73.8, 22, 20, 1.2, dark);
      for (let x = -9; x <= 9; x += 3) beam(group, [x, 6, -72.9], [x, 25, -72.9], 0.35, gold, 6);
      for (const x of [-15, 15]) sphere(group, x, 20, -72, 1.4, mat(0xff9a5a, true));
      block(group, 0, 78, -86, 23, 12, 24, dark);
      sphere(group, 0, 88, -86, 5, blue);
      for (const side of [-1, 1]) for (let z = -70; z < 28; z += 10) {
        block(group, side * 62, 14, z, 6, 16, 8, dark);
        block(group, side * 62, 24, z, 6, 4, 4, dark);
      }
      for (const [x, z] of [[-30, -40], [30, -40], [-30, 10], [30, 10]]) {
        beam(group, [x, 6, z], [x, 18, z], 0.5, dark, 6);
        sphere(group, x, 19, z, 1.4, mat(0xff9a5a, true));
      }
      const sea = new T.Mesh(new T.PlaneGeometry(250, 230), mat(0x263f4b, false, 0.2));
      sea.rotation.x = -Math.PI / 2; sea.position.y = -4; group.add(sea);
    } else if (cfg.kind === 'bridge') {
      // Puente de piedra y hierro: tablero empedrado, farolas, torres con remates dorados y tensores.
      block(group, 0, 7, -19, 115, 13, 154, cream);
      for (const z of [-59, 35]) {
        for (const x of [-45, 45]) {
          block(group, x, 43, z, 12, 77, 15, cream);
          K?.facade(group, { x, y: 13.5, z, w: 12, h: 66, d: 15 }, { mats: M, faces: [x > 0 ? 'x-' : 'x+'], style: 'piltover', roof: 'flat', lit: 0.5, spacing: 4, floor: 12 });
          block(group, x, 83, z, 17, 7, 18, gold);
          beam(group, [x, 85, z], [x, 104, z], 1.5, gold);
        }
        // Tirantes en abanico a lo largo de los bordes, sin cruzar el paso.
        for (const x of [-45, 45]) for (let k = 1; k <= 5; k++) for (const dz of [-1, 1]) {
          beam(group, [x, 72, z], [x * 1.12, 14, z + dz * k * 9], 0.3, dark, 5);
        }
        block(group, 0, 66, z, 78, 3, 4, gold);
        block(group, 0, 70, z, 30, 5, 3, cream);
      }
      for (const x of [-38, 38]) {
        block(group, x, 14.5, -19, 2, 2, 150, gold);
        for (let z = -85; z < 55; z += 16) {
          beam(group, [x, 13.5, z], [x, 26, z], 0.45, dark, 6);
          sphere(group, x, 27, z, 1.5, warm);
        }
      }
      for (const x of [-60, 60]) {
        for (let z = -73; z < 55; z += 15) {
          block(group, x, 16, z, 1.6, 11, 2, gold);
          block(group, x, 22, z, 3, 2, 3, dark);
        }
      }
      const water = new T.Mesh(new T.PlaneGeometry(250, 270), mat(0x356577, false, 0.15));
      water.rotation.x = -Math.PI / 2; water.position.y = -8; group.add(water);
    }
    // Un documento/pista está junto al camino y el objetivo de misión al fondo.
    const clue = new T.Group(); clue.position.set(20, 3, 24);
    block(clue, 0, -1, 0, 9, 2, 9, gold);
    sphere(clue, 0, 5, 0, 3, blue); group.add(clue);
    const goal = new T.Group(); goal.position.set(0, 4, -49);
    block(goal, 0, -2, 0, 12, 2, 12, gold);
    sphere(goal, 0, 7, 0, 4.7, mat(cfg.color, true)); group.add(goal);
    clue.userData.noCollide = goal.userData.noCollide = true;
    K?.scaleUVs(group);
    return { clue, goal };
  }
  /** Cierra la exploración sin perder el mundo y limpia los recursos GPU. */
  function close() {
    if (!session) return;
    const active = session; session = null;
    cancelAnimationFrame(active.raf);
    window.removeEventListener('keydown', active.keydown);
    window.removeEventListener('keyup', active.keyup);
    active.hero?.dispose();
    active.root.remove();
    active.group.traverse((obj) => {
      obj.geometry?.dispose();
      if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
      else obj.material?.dispose();
    });
    active.renderer.dispose();
    active.onExit?.();
  }
  /** Abre el espacio jugable y exige inspeccionar una pista antes de activar la misión. */
  function enter(id, onGoal, onExit) {
    const cfg = spec(id);
    if (!cfg || !T) return false;
    if (session) close();
    const root = document.createElement('div'); root.className = 'piltover-interior';
    const hud = document.createElement('div'); hud.className = 'piltover-interior-hud';
    const title = document.createElement('h2'); title.textContent = cfg.name;
    const hint = document.createElement('p'); hint.textContent = 'WASD, flechas o clic: caminar · Mayús: correr · E: investigar · Esc: volver';
    const status = document.createElement('p'); status.className = 'piltover-interior-objective';
    status.textContent = 'Busca la pista azul y examínala antes de continuar.';
    const exit = document.createElement('button'); exit.className = 'btn'; exit.textContent = 'Volver al mapa'; exit.onclick = close;
    hud.append(title, hint, status, exit); root.append(hud); document.body.append(root);
    const renderer = new T.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.outputColorSpace = T.SRGBColorSpace;
    renderer.toneMapping = T.ACESFilmicToneMapping;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(Math.max(1, root.clientWidth), Math.max(1, root.clientHeight));
    root.prepend(renderer.domElement);
    const scene = new T.Scene();
    scene.background = new T.Color(cfg.kind === 'fortress' ? 0x302f39 : 0xa3a9a0);
    scene.fog = new T.FogExp2(scene.background, 0.0028);
    scene.add(new T.HemisphereLight(0xf6e5c1, 0x637b88, 1.9));
    const sun = new T.DirectionalLight(cfg.kind === 'fortress' ? 0xc5857d : 0xffebc4, 3.1);
    sun.position.set(-40, 100, 50); scene.add(sun);
    K?.shadows(renderer, sun);
    const lamp = new T.PointLight(cfg.color, 45, 110, 1.8);
    lamp.position.set(0, 36, -25); scene.add(lamp);
    const group = new T.Group(); scene.add(group);
    const { clue, goal } = build(group, cfg);
    const spinning = [];
    group.traverse((o) => { if (o.userData.spin) spinning.push(o); });
    const air = K?.atmosphere(scene, { dust: 0xffe2a8, dustSize: 0.7, shaft: 0xfff0c8,
      shafts: cfg.kind === 'council' || cfg.kind === 'workshop'
        ? [{ x: -30, y: 30, z: -40, r0: 4, r1: 12, h: 70, rz: 0.35, o: 0.16 }, { x: 10, y: 30, z: -45, r0: 4, r1: 12, h: 70, rz: 0.35, o: 0.14 }]
        : [] });
    const camera = new T.PerspectiveCamera(62, Math.max(1, root.clientWidth / Math.max(1, root.clientHeight)), 0.1, 700);
    const keys = new Set();
    let inspected = false, finished = false, previous = 0;
    let hero = null;
    const player = () => hero ? hero.pos : { x: 0, z: 58 };
    const keydown = (e) => {
      if (session !== active || e.target?.matches?.('input,textarea,select')) return;
      const k = e.key.toLowerCase();
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'shift', 'e', 'escape'].includes(k)) e.preventDefault();
      if (k === 'escape') { close(); return; }
      const p = player();
      const near = (group) => Math.hypot(p.x - group.position.x, p.z - group.position.z);
      if (k === 'e' && !inspected && near(clue) < 13) {
        inspected = true; clue.visible = false;
        status.textContent = cfg.clue + ' Ve ahora al punto de misión.'; return;
      }
      if (k === 'e' && inspected && !finished && near(goal) < 16) {
        finished = true; close(); onGoal?.(); return;
      }
      if (k !== 'e') keys.add(k);
    };
    const keyup = (e) => { keys.delete(e.key.toLowerCase()); };
    window.addEventListener('keydown', keydown);
    window.addEventListener('keyup', keyup);
    // El protagonista del jugador recorre el lugar en tercera persona.
    hero = K?.hero({ scene, camera, dom: renderer.domElement, group, bounds: { x: 34, z0: -57, z1: 63 },
      spawn: cfg.kind === 'bridge' ? { x: 0, y: 13, z: 50 } : { x: 0, z: 58 }, lift: [clue, goal], pick: [clue, goal], fill: 0xfff0d0,
      interact: () => { const was = inspected; keydown(new KeyboardEvent('keydown', { key: 'e' })); return was !== inspected || finished; } }) || null;
    const active = { root, group, renderer, onExit, keydown, keyup, hero, raf: 0 };
    session = active;
    /** Actualiza el personaje, la cámara y la animación del escenario antes de dibujar WebGL. */
    function frame(time) {
      if (session !== active) return;
      const dt = Math.min(0.05, (time - (previous || time)) / 1000); previous = time;
      const x = Number(keys.has('d') || keys.has('arrowright')) - Number(keys.has('a') || keys.has('arrowleft'));
      const z = Number(keys.has('s') || keys.has('arrowdown')) - Number(keys.has('w') || keys.has('arrowup'));
      if (hero) hero.update(dt, time / 1000, { x, z, run: keys.has('shift') });
      else { camera.position.set(0, 19, 85); camera.lookAt(0, 3, 26); }
      air?.tick(time / 1000);
      for (const o of spinning) o.rotation.z += dt * (o.userData.spin > 1 ? 0.6 : o.userData.spin);
      const p = player();
      const d = Math.hypot(p.x - (inspected ? goal.position.x : clue.position.x), p.z - (inspected ? goal.position.z : clue.position.z));
      status.textContent = !inspected
        ? d < 13 ? 'Pulsa E para investigar la pista azul.' : 'Localiza la pista azul (' + Math.round(d) + ' m).'
        : d < 16 ? 'Pulsa E para activar el objetivo del capítulo.' : cfg.clue + ' · Objetivo a ' + Math.round(d) + ' m.';
      goal.rotation.y += dt * 0.45;
      const width = Math.max(1, root.clientWidth), height = Math.max(1, root.clientHeight);
      if (renderer.domElement.clientWidth !== width || renderer.domElement.clientHeight !== height) {
        renderer.setSize(width, height, false); camera.aspect = width / height; camera.updateProjectionMatrix();
      }
      renderer.render(scene, camera);
      active.raf = requestAnimationFrame(frame);
    }
    active.raf = requestAnimationFrame(frame);
    return true;
  }
  window.PiltoverInteriors = { has, enter, close, scenes };
})();
