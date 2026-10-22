// Escenarios interiores y espacios urbanos de Zaun, inspirados en las seis
// referencias visuales del proyecto. Geometría original generada en tiempo real.
// No utiliza imágenes ajenas ni modifica arte, personajes ni partidas.
(function () {
  const T = window.THREE;
  const scenes = {
    callejones: { title: 'Los niveles de Zaun', desc: 'Pasarelas suspendidas, talleres apiñados y luz química en las profundidades.', kind: 'canyon', accent: 0x85d45b },
    arbol: { title: 'El Árbol de las Luciérnagas', desc: 'Un refugio vivo, construido sobre las ramas y lejos del Brillo.', kind: 'tree', accent: 0xe1a45a },
    fabrica: { title: 'La torre de las máquinas', desc: 'Un eje industrial elevado entre puentes, turbinas y neones.', kind: 'tower', accent: 0x8a61dd },
    'ultima-gota': { title: 'La Última Gota', desc: 'El local de Vander: hierro oxidado, barra iluminada y puertas de acero.', kind: 'tavern', accent: 0xe2a34b },
    sumidero: { title: 'Laboratorio del Sumidero', desc: 'La química de Singed, entre frascos verdes y reactores violetas.', kind: 'laboratory', accent: 0xaf5ceb },
    invernadero: { title: 'El invernadero secreto', desc: 'Vidrio, conductos de quimtec y vegetación creciendo en las ruinas.', kind: 'garden', accent: 0x99e45e },
  };
  const aliases = { 'tienda-benzo': 'tavern', mercado: 'canyon', tejados: 'canyon', foso: 'tower', 'escondite-jinx': 'tower' };
  let running = null;
  /** Indica si hay una escena explorable asociada al lugar, incluidos accesos alternativos. */
  function has(id) { return Boolean(scenes[id] || aliases[id]); }
  /** Devuelve la ficha visual; un acceso secundario reutiliza la arquitectura de su distrito. */
  function spec(id) {
    if (scenes[id]) return scenes[id];
    const kind = aliases[id];
    const main = Object.values(scenes).find((s) => s.kind === kind);
    return main ? { ...main, title: ({ 'tienda-benzo': 'El taller de Benzo', mercado: 'Mercado de las tuberías', tejados: 'Tejados de Zaun', foso: 'El foso industrial', 'escondite-jinx': 'Escondite de Jinx' })[id] || main.title } : null;
  }
  /** Construye materiales físicos mate y superficies químicas con emisión controlada. */
  function material(color, glow = false) {
    return new T.MeshStandardMaterial({ color, emissive: glow ? color : 0x000000, emissiveIntensity: glow ? 1.5 : 0, roughness: glow ? 0.33 : 0.83, metalness: glow ? 0.1 : 0.4, side: T.DoubleSide });
  }
  /** Añade prismas sólidos con sombras al espacio 3D. */
  function cube(group, x, y, z, w, h, d, mat) {
    const m = new T.Mesh(new T.BoxGeometry(w, h, d), mat);
    m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; group.add(m);
    return m;
  }
  /** Genera tubos, troncos, cables y vigas orientados entre dos puntos. */
  function pipe(group, a, b, radius, mat, sides = 9) {
    const v = new T.Vector3(...a), w = new T.Vector3(...b);
    const direction = w.clone().sub(v);
    const m = new T.Mesh(new T.CylinderGeometry(radius, radius, direction.length(), sides), mat);
    m.position.copy(v).add(w).multiplyScalar(0.5);
    m.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), direction.normalize());
    m.castShadow = true; group.add(m); return m;
  }
  /** Sitúa una esfera luminosa o una copa de follaje en el escenario. */
  function orb(group, x, y, z, radius, mat) {
    const mesh = new T.Mesh(new T.IcosahedronGeometry(radius, 1), mat);
    mesh.position.set(x, y, z); mesh.castShadow = true; group.add(mesh); return mesh;
  }
  /** Distribuye detalles modulares sin aleatoriedad para que el aspecto sea reproducible. */
  function build(group, cfg) {
    const wall = material(0x343a37), iron = material(0x262d32), brass = material(0x947359);
    const stone = material(0x50504b), leaf = material(0x3e6446), wood = material(0x4b332d);
    const neon = material(cfg.accent, true), green = material(0x82df72, true), violet = material(0xb159d8, true);
    // Los seis escenarios comparten suelo accesible, pero no su silueta ni sus objetos.
    cube(group, 0, -0.75, 0, 170, 1.5, 170, cfg.kind === 'garden' ? stone : iron);
    for (let i = -5; i <= 5; i++) {
      cube(group, i * 14, 0.08, -25, 9, 0.15, 0.35, brass);
      cube(group, -26, 0.08, i * 13, 0.35, 0.15, 9, brass);
    }
    if (cfg.kind === 'canyon') {
      // Avenida encerrada entre fachadas altísimas, escaleras, puentes y neón verde.
      for (const side of [-1, 1]) for (let i = 0; i < 6; i++) {
        const z = -65 + i * 24, x = side * (39 + (i % 3) * 5);
        cube(group, x, 28 + i % 3 * 5, z, 24, 57 + i % 3 * 10, 21, i % 2 ? wall : stone);
        for (let floor = 1; floor <= 5; floor++) {
          cube(group, x - side * 13.0, floor * 8 + 2, z, 1.2, 4.5, 5, (i + floor) % 3 ? green : neon);
          cube(group, x - side * 17, floor * 9, z, 13, 0.7, 11, iron);
        }
        pipe(group, [x, 40, z - 8], [x, 10, z + 7], 1.15, brass);
      }
      for (const z of [-42, 5, 47]) {
        cube(group, 0, 22, z, 94, 2, 9, iron);
        for (let i = -5; i <= 5; i++) cube(group, i * 8, 26, z, 0.7, 7, 0.8, brass);
      }
      for (let i = 0; i < 8; i++) pipe(group, [-45, 30 + i * 2, -60], [48, 24 + i * 2, 58], 0.22, iron);
    } else if (cfg.kind === 'tree') {
      // Refugio arbóreo: tronco ramificado, plataformas circulares y casitas elevadas.
      pipe(group, [0, 0, -16], [0, 63, -16], 11, wood, 12);
      for (const [x, y, z] of [[-29, 38, -8], [31, 40, -22], [-14, 52, 16], [23, 60, 9]]) {
        pipe(group, [0, 30, -16], [x, y, z], 4.3, wood, 11);
        orb(group, x, y + 6, z, 20, leaf);
        cube(group, x, y - 4, z, 25, 2, 22, wood);
        cube(group, x, y + 1, z, 12, 9, 11, wall);
        cube(group, x, y + 2, z + 6, 5, 3, 0.35, neon);
      }
      for (const y of [12, 23, 34]) {
        cube(group, 0, y, -16, 37, 1.5, 24, wood);
        for (const x of [-17, 17]) pipe(group, [x, y, -28], [x, y + 4, -28], 0.5, brass);
      }
      for (let i = 0; i < 13; i++) orb(group, Math.sin(i * 2.4) * 34, 15 + (i % 5) * 9, -16 + Math.cos(i * 2.4) * 24, 2.2, neon);
    } else if (cfg.kind === 'tower') {
      // Eje industrial morado y azul con anillos, brazos colgantes y pasarelas.
      for (const y of [3, 19, 37, 55]) {
        const ring = new T.Mesh(new T.TorusGeometry(22 + y / 8, 1.3, 7, 28), brass);
        ring.rotation.x = Math.PI / 2; ring.position.set(0, y, -17); group.add(ring);
        cube(group, 0, y, -17, 48 + y / 10, 2, 44, iron);
        for (const angle of [0, Math.PI / 2, Math.PI, Math.PI * 1.5]) {
          const x = Math.cos(angle) * 43, z = -17 + Math.sin(angle) * 43;
          pipe(group, [0, y + 2, -17], [x, y + 2, z], 1.4, brass);
        }
      }
      pipe(group, [0, 0, -17], [0, 77, -17], 9, wall, 16);
      for (let i = 0; i < 18; i++) {
        const a = i * Math.PI / 9; orb(group, Math.sin(a) * 19, 22 + i % 4 * 8, -17 + Math.cos(a) * 19, 2, i % 2 ? violet : neon);
      }
      cube(group, 0, 5, 26, 31, 10, 10, wall);
      cube(group, 0, 11, 31.2, 12, 3, 0.6, neon);
    } else if (cfg.kind === 'tavern') {
      // Local con entrada, cartel circular, barra y botellas; inspirado en la Última Gota.
      for (const x of [-66, 66]) cube(group, x, 21, 0, 3, 43, 135, wall);
      cube(group, 0, 23, -67, 134, 46, 4, wall);
      cube(group, 0, 42, 0, 134, 3, 134, iron);
      for (let i = -3; i <= 3; i++) {
        cube(group, i * 14, 9, -40, 10, 18, 6, wood);
        cube(group, i * 14, 19, -36.7, 4, 2.4, 0.5, i % 2 ? neon : green);
      }
      cube(group, -20, 5, 4, 60, 8, 12, wood);
      for (let i = 0; i < 12; i++) {
        const x = -43 + (i % 6) * 8, z = -35 + Math.floor(i / 6) * 11;
        pipe(group, [x, 21, z], [x, 25 + i % 3 * 3, z], 1.4, i % 3 ? green : violet);
      }
      for (const x of [27, 48]) {
        cube(group, x, 3, 26, 13, 2, 13, wood);
        pipe(group, [x, 4, 26], [x, 1, 26], 2.5, brass);
      }
      const sign = new T.Mesh(new T.TorusGeometry(10, 1.2, 7, 22), neon);
      sign.position.set(0, 28, -64); group.add(sign);
    } else if (cfg.kind === 'laboratory') {
      // Mesón del laboratorio, frascos y tubos de reacción violetas.
      cube(group, 0, 20, -67, 142, 41, 3, wall);
      for (const x of [-64, 64]) cube(group, x, 21, 0, 3, 42, 135, wall);
      for (let i = 0; i < 4; i++) {
        const z = -43 + i * 26;
        cube(group, 0, 4, z, 100, 7, 10, wood);
        for (let j = 0; j < 8; j++) {
          const x = -43 + j * 12;
          pipe(group, [x, 8, z], [x, 12 + (i + j) % 5 * 3, z], 1.5, (i + j) % 3 ? green : violet);
        }
      }
      for (let i = -4; i <= 4; i++) {
        cube(group, i * 14, 30, -62, 12, 2, 4, brass);
        pipe(group, [i * 14, 29, -62], [i * 14, 9, -62], 0.6, green);
      }
      orb(group, 0, 18, -12, 8, violet);
    } else if (cfg.kind === 'garden') {
      // Cúpula acristalada, jardines y un núcleo químico suspendido.
      const glass = new T.MeshStandardMaterial({ color: 0x7fa691, transparent: true, opacity: 0.18, roughness: 0.2, metalness: 0.1, depthWrite: false, side: T.DoubleSide });
      const dome = new T.Mesh(new T.SphereGeometry(83, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), glass);
      group.add(dome);
      for (let i = 0; i < 16; i++) {
        const a = i * Math.PI / 8;
        pipe(group, [Math.sin(a) * 73, 0, Math.cos(a) * 73], [0, 86, 0], 0.55, brass);
      }
      for (let i = 0; i < 35; i++) {
        const a = i * 2.399, d = 12 + (i % 6) * 9;
        pipe(group, [Math.cos(a) * d, 0, Math.sin(a) * d], [Math.cos(a) * d, 7 + i % 5 * 3, Math.sin(a) * d], 0.75, wood);
        orb(group, Math.cos(a) * d, 9 + i % 5 * 3, Math.sin(a) * d, 5 + i % 3 * 3, leaf);
        if (i % 3 === 0) orb(group, Math.cos(a) * d, 7 + i % 5 * 3, Math.sin(a) * d, 2.5, violet);
      }
      orb(group, 0, 64, -14, 12, green);
      for (const x of [-25, 25]) pipe(group, [x, 0, -35], [x, 70, -35], 1.5, iron);
    }
    // Meta física visible al fondo: al llegar, E activa el objetivo del lugar.
    const portal = new T.Group(); portal.position.set(0, 2, -48);
    cube(portal, 0, 0, 0, 11, 0.4, 11, brass);
    orb(portal, 0, 9, 0, 5.2, neon);
    for (const dx of [-6, 6]) pipe(portal, [dx, 0, 0], [dx, 10, 0], 0.7, brass);
    group.add(portal);
    return portal;
  }
  /** Libera recursos GPU al salir del interior, evitando fugas al entrar repetidamente. */
  function dispose(group) {
    group.traverse((obj) => {
      obj.geometry?.dispose();
      if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
      else obj.material?.dispose();
    });
  }
  /** Sale del escenario y devuelve los controles al mundo abierto. */
  function close() {
    if (!running) return;
    const session = running; running = null;
    cancelAnimationFrame(session.raf);
    window.removeEventListener('keydown', session.keydown);
    window.removeEventListener('keyup', session.keyup);
    session.renderer.dispose();
    dispose(session.group);
    session.host.remove();
    session.onExit?.();
  }
  /** Abre el interior explorable y espera a que el jugador llegue al objetivo físico. */
  function enter(id, onGoal, onExit) {
    if (running) close();
    const cfg = spec(id);
    if (!cfg) return false;
    if (!T) return false;
    const host = document.createElement('div');
    host.className = 'zaun-interior';
    const screen = document.createElement('div');
    screen.className = 'zaun-interior-hud';
    const title = document.createElement('h2'); title.textContent = cfg.title;
    const hint = document.createElement('p'); hint.textContent = cfg.desc + ' · WASD para caminar · Mayús para correr · E para interactuar · Esc para salir';
    const status = document.createElement('p'); status.className = 'zaun-interior-objective'; status.textContent = 'Encuentra la luz del objetivo al fondo del escenario.';
    const exit = document.createElement('button'); exit.className = 'btn'; exit.textContent = 'Salir al mapa'; exit.onclick = close;
    screen.append(title, hint, status, exit);
    host.append(screen); document.body.append(host);
    const renderer = new T.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.outputColorSpace = T.SRGBColorSpace;
    renderer.toneMapping = T.ACESFilmicToneMapping;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(host.clientWidth, host.clientHeight);
    host.prepend(renderer.domElement);
    const scene = new T.Scene();
    scene.background = new T.Color(cfg.kind === 'tree' ? 0x242126 : cfg.kind === 'tower' ? 0x121324 : 0x0b1412);
    scene.fog = new T.FogExp2(scene.background, cfg.kind === 'canyon' ? 0.006 : 0.0037);
    scene.add(new T.HemisphereLight(0xa0c9bd, 0x28251e, 2.1));
    const key = new T.PointLight(cfg.accent, 95, 150, 2); key.position.set(0, 35, -32); scene.add(key);
    const warm = new T.PointLight(0xffae65, 36, 110, 2); warm.position.set(-25, 15, 32); scene.add(warm);
    const group = new T.Group(); scene.add(group);
    const goal = build(group, cfg);
    const camera = new T.PerspectiveCamera(68, Math.max(1, host.clientWidth / host.clientHeight), 0.1, 600);
    const player = new T.Vector3(0, 7, 58);
    const keys = new Set();
    let last = 0;
    let complete = false;
    const keydown = (e) => {
      if (!running || e.target.matches?.('input,textarea,select')) return;
      const k = e.key.toLowerCase();
      if (['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright','shift','e','escape'].includes(k)) e.preventDefault();
      if (k === 'escape') { close(); return; }
      if (k === 'e' && Math.hypot(player.x - goal.position.x, player.z - goal.position.z) < 17 && !complete) {
        complete = true; const action = onGoal; close(); action?.(); return;
      }
      keys.add(k);
    };
    const keyup = (e) => keys.delete(e.key.toLowerCase());
    window.addEventListener('keydown', keydown);
    window.addEventListener('keyup', keyup);
    const session = { host, group, renderer, onExit, keydown, keyup, raf: 0 };
    running = session;
    /** Anima el recorrido interior y comprueba la cercanía al punto de misión. */
    function frame(now) {
      if (running !== session) return;
      const dt = Math.min(0.05, (now - (last || now)) / 1000); last = now;
      const x = Number(keys.has('d') || keys.has('arrowright')) - Number(keys.has('a') || keys.has('arrowleft'));
      const z = Number(keys.has('s') || keys.has('arrowdown')) - Number(keys.has('w') || keys.has('arrowup'));
      const scale = (keys.has('shift') ? 48 : 27) * dt / (Math.hypot(x, z) || 1);
      player.x = T.MathUtils.clamp(player.x + x * scale, -34, 34);
      player.z = T.MathUtils.clamp(player.z + z * scale, -60, 63);
      camera.position.set(player.x, player.y + 12, player.z + 27);
      camera.lookAt(player.x, player.y - 4, player.z - 32);
      const d = Math.hypot(player.x - goal.position.x, player.z - goal.position.z);
      status.textContent = d < 17 ? 'Objetivo alcanzado: pulsa E para investigar y continuar.' : 'Avanza hasta la luz del objetivo (' + Math.round(d) + ' m).';
      goal.rotation.y += dt * 0.4;
      const w = host.clientWidth, h = host.clientHeight;
      if (renderer.domElement.width !== Math.floor(w * renderer.getPixelRatio()) || renderer.domElement.height !== Math.floor(h * renderer.getPixelRatio())) {
        renderer.setSize(w, h, false); camera.aspect = Math.max(1, w / h); camera.updateProjectionMatrix();
      }
      renderer.render(scene, camera);
      session.raf = requestAnimationFrame(frame);
    }
    session.raf = requestAnimationFrame(frame);
    return true;
  }
  window.ZaunInteriors = { has, enter, close, scenes };
})();
