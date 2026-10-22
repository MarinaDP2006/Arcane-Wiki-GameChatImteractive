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
  const discoveries = {
    canyon: 'Has encontrado las señales de una ruta de contrabando entre las pasarelas.',
    tree: 'Descubres el sistema de cuerdas que protege el refugio de las Luciérnagas.',
    tower: 'La consola principal controla las máquinas y las pasarelas de la torre.',
    tavern: 'En el libro de cuentas de la barra hay una entrega marcada con tinta roja.',
    laboratory: 'Un registro del laboratorio revela experimentos y muestras de Brillo.',
    garden: 'Los conductos del invernadero mezclan aire limpio y quimtec reciclada.',
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
  const K = window.InteriorKit;
  /** Materiales mate pintados a pincel (piedra, metal, madera) y superficies químicas con brillo. */
  function material(color, glow = false, kind = 'metal', power = 1.5) {
    return new T.MeshStandardMaterial({ color, map: glow || !K ? null : K.brush(kind), emissive: glow ? color : 0x000000, emissiveIntensity: glow ? power : 0, roughness: glow ? 0.33 : 0.86, metalness: glow ? 0.1 : kind === 'metal' ? 0.35 : 0.05, side: T.DoubleSide });
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
    m.castShadow = true; m.receiveShadow = true; group.add(m); return m;
  }
  /** Sitúa una esfera luminosa o una copa de follaje en el escenario. */
  function orb(group, x, y, z, radius, mat) {
    const mesh = new T.Mesh(new T.IcosahedronGeometry(radius, 1), mat);
    mesh.position.set(x, y, z); mesh.castShadow = true; group.add(mesh); return mesh;
  }
  /** Farol colgante: cadena, pantalla de latón y bombilla química. */
  function lamp(group, x, y, z, M, glow) {
    pipe(group, [x, y + 9, z], [x, y + 1.5, z], 0.12, M.iron, 4);
    const shade = new T.Mesh(new T.ConeGeometry(1.6, 1.6, 8, 1, true), M.brass);
    shade.position.set(x, y + 1.4, z); group.add(shade);
    orb(group, x, y + 0.6, z, 0.7, glow);
  }
  /** Charco químico luminoso en el suelo. */
  function puddle(group, x, z, r, glow) {
    const m = new T.Mesh(new T.CircleGeometry(r, 18), glow);
    m.rotation.x = -Math.PI / 2; m.position.set(x, 0.06, z); m.userData.noCollide = true; group.add(m);
  }
  /** Distribuye detalles modulares sin aleatoriedad para que el aspecto sea reproducible. */
  function build(group, cfg) {
    const wall = material(0x3d4440, false, 'stone'), iron = material(0x2a3136), brass = material(0x9c7a58);
    const stone = material(0x55554e, false, 'stone'), leaf = material(0x3e6446, false, 'wood'), wood = material(0x523a30, false, 'wood');
    const neon = material(cfg.accent, true), green = material(0x82df72, true), violet = material(0xb159d8, true), amber = material(0xf2a54a, true);
    const rust = material(0x6b3f2a), glassDark = material(0x1a2226, false, 'metal');
    // Ventanas: luz cálida o química apagada, para que no deslumbren.
    const winAmber = material(0xc97a32, true, 'metal', 0.45), winGreen = material(0x4f8a42, true, 'metal', 0.35), winViolet = material(0x8a55b0, true, 'metal', 0.5);
    const pool = material(0x6fbf5a, true, 'metal', 0.35);
    const signGreen = material(0x6fcf62, true, 'metal', 0.75);
    const flaskGreen = material(0x5aa04a, true, 'metal', 0.6), flaskViolet = material(0x8a4ab0, true, 'metal', 0.6);
    const M = { iron, brass, trim: rust, lit: winAmber, dark: glassDark, roof: iron };
    const zaunFacade = (x, y, z, w, h, d, faces, extra = {}) => {
      cube(group, x, y, z, w, h, d, extra.mat || wall);
      K?.facade(group, { x, y: y - h / 2, z, w, h, d }, { mats: { ...M, lit: extra.lit || winAmber }, faces, style: 'zaun', roof: extra.roof || 'chimney', lit: 0.22, spacing: 5.5, floor: 8 });
    };
    // Los seis escenarios comparten suelo accesible, pero no su silueta ni sus objetos.
    cube(group, 0, -0.75, 0, 170, 1.5, 170, cfg.kind === 'garden' ? stone : cfg.kind === 'tavern' ? wood : iron);
    for (let i = -5; i <= 5; i++) {
      cube(group, i * 14, 0.08, -25, 9, 0.15, 0.35, brass);
      cube(group, -26, 0.08, i * 13, 0.35, 0.15, 9, brass);
    }
    if (cfg.kind === 'canyon') {
      // Avenida encerrada entre fachadas altísimas con ventanas encendidas, balcones,
      // letreros de neón, tendederos y chimeneas humeantes.
      for (const side of [-1, 1]) for (let i = 0; i < 6; i++) {
        const z = -65 + i * 24, x = side * (41 + (i % 3) * 5), h = 57 + i % 3 * 10;
        zaunFacade(x, h / 2, z, 24, h, 21, [side > 0 ? 'x-' : 'x+', 'z+'], { mat: i % 2 ? wall : stone, lit: i % 2 ? winAmber : winGreen });
        for (let floor = 1; floor <= 5; floor++) {
          cube(group, x - side * 13.4, floor * 9 + 3, z + 6, 1.2, 4.5, 4, (i + floor) % 3 ? signGreen : neon);
          if (floor % 2) {
            cube(group, x - side * 15.5, floor * 9 + 1, z - 4, 7, 0.7, 9, iron);
            for (let k = -1; k <= 1; k++) pipe(group, [x - side * 19, floor * 9 + 1, z - 4 + k * 4], [x - side * 19, floor * 9 + 4, z - 4 + k * 4], 0.15, brass, 4);
          }
        }
        pipe(group, [x - side * 12.6, 0, z - 9], [x - side * 12.6, h, z - 9], 0.9, brass);
      }
      for (const z of [-42, 5, 47]) {
        cube(group, 0, 22, z, 94, 2, 9, iron);
        for (let i = -5; i <= 5; i++) cube(group, i * 8, 26, z, 0.7, 7, 0.8, brass);
        for (const sx of [-1, 1]) cube(group, 0, 25, z + sx * 4.4, 94, 0.4, 0.4, brass);
      }
      // Tendederos con ropa y cables entre fachadas.
      for (let i = 0; i < 6; i++) {
        const z = -55 + i * 21, y = 14 + (i % 3) * 7;
        pipe(group, [-30, y, z], [30, y - 2, z + 3], 0.08, iron, 4);
        for (let k = 0; k < 5; k++) cube(group, -18 + k * 9, y - 2.4 - (k % 2), z + 1 + k * 0.3, 3, 3 + k % 2, 0.15, material([0x7a3a3a, 0x3a4a6a, 0x6a6a4a][(i + k) % 3], false, 'wood')).userData.noCollide = true;
      }
      for (let i = 0; i < 8; i++) pipe(group, [-45, 30 + i * 2, -60], [48, 24 + i * 2, 58], 0.22, iron);
      for (const [x, z, r] of [[-12, 30, 4], [9, -12, 3], [-6, -30, 5]]) puddle(group, x, z, r, pool);
      for (const z of [-50, -20, 10, 40]) lamp(group, z % 20 ? 14 : -14, 12, z, M, amber);
    } else if (cfg.kind === 'tree') {
      // Refugio arbóreo: tronco ramificado, plataformas, casitas con ventanas y puentes de cuerda.
      pipe(group, [0, 0, -16], [0, 63, -16], 11, wood, 12);
      for (const [x, z] of [[-9, -24], [8, -26], [-10, -6], [9, -7]]) pipe(group, [x * 1.6, 0, z + (z + 16) * 0.6], [x * 0.6, 9, z], 2.2, wood, 8);
      const houses = [[-29, 38, -8], [31, 40, -22], [-14, 52, 16], [23, 60, 9]];
      for (const [x, y, z] of houses) {
        pipe(group, [0, 30, -16], [x, y, z], 4.3, wood, 11);
        orb(group, x, y + 14, z, 16, leaf);
        cube(group, x, y - 4, z, 25, 2, 22, wood);
        zaunFacade(x, y + 1.5, z, 12, 9, 11, ['z+', 'x+', 'x-'], { mat: wood, roof: 'spire' });
        lamp(group, x + 10, y - 12, z + 9, M, amber);
      }
      for (let i = 0; i < houses.length - 1; i++) {
        const [a, b] = [houses[i], houses[i + 1]];
        pipe(group, [a[0], a[1] - 3, a[2]], [b[0], b[1] - 3, b[2]], 0.9, wood, 6);
        pipe(group, [a[0], a[1] - 0.5, a[2]], [b[0], b[1] - 0.5, b[2]], 0.12, brass, 4);
      }
      for (const y of [12, 23, 34]) {
        cube(group, 0, y, -16, 37, 1.5, 24, wood);
        for (const x of [-17, 17]) pipe(group, [x, y, -28], [x, y + 4, -28], 0.5, brass);
      }
      for (let i = 0; i < 13; i++) orb(group, Math.sin(i * 2.4) * 34, 15 + (i % 5) * 9, -16 + Math.cos(i * 2.4) * 24, 1.2, neon);
    } else if (cfg.kind === 'tower') {
      // Eje industrial morado y azul con anillos, brazos colgantes, pasarelas y escalera de acceso.
      for (const y of [3, 19, 37, 55]) {
        const ring = new T.Mesh(new T.TorusGeometry(22 + y / 8, 1.3, 7, 28), brass);
        ring.rotation.x = Math.PI / 2; ring.position.set(0, y, -17); group.add(ring);
        cube(group, 0, y, -17, 48 + y / 10, 2, 44, iron);
        for (const angle of [0, Math.PI / 2, Math.PI, Math.PI * 1.5]) {
          const x = Math.cos(angle) * 43, z = -17 + Math.sin(angle) * 43;
          pipe(group, [0, y + 2, -17], [x, y + 2, z], 1.4, brass);
        }
      }
      K?.stairs(group, 0, 12, 5.2, 0, 4, 16, iron);
      pipe(group, [0, 0, -17], [0, 77, -17], 9, wall, 16);
      for (let i = 0; i < 12; i++) cube(group, Math.sin(i * Math.PI / 6) * 9.2, 40, -17 + Math.cos(i * Math.PI / 6) * 9.2, 1.4, 76, 1.4, brass).rotation.y = i * Math.PI / 6;
      for (let i = 0; i < 18; i++) {
        const a = i * Math.PI / 9; orb(group, Math.sin(a) * 19, 22 + i % 4 * 8, -17 + Math.cos(a) * 19, 2, i % 2 ? violet : neon);
      }
      for (const side of [-1, 1]) zaunFacade(side * 62, 30, -30, 26, 60, 60, [side > 0 ? 'x-' : 'x+'], { lit: winViolet });
      cube(group, 0, 5, 26, 31, 10, 10, wall);
      cube(group, 0, 11, 31.2, 12, 3, 0.6, neon);
    } else if (cfg.kind === 'tavern') {
      // La Última Gota: paredes de ladrillo, barra con botelleros, reservados, faroles y cartel.
      for (const x of [-66, 66]) cube(group, x, 21, 0, 3, 43, 135, wall);
      cube(group, 0, 23, -67, 134, 46, 4, wall);
      cube(group, 0, 42, 0, 134, 3, 134, iron);
      for (let x = -60; x <= 60; x += 15) cube(group, x, 39.5, 0, 1.5, 2, 134, rust);
      // Reservados contra la pared del fondo, con su letrero; el centro queda libre.
      for (let i = -3; i <= 3; i++) {
        if (!i) continue;
        cube(group, i * 14, 9, -60, 10, 18, 6, wood);
        cube(group, i * 14, 19, -56.7, 4, 2.4, 0.5, i % 2 ? neon : green);
        cube(group, i * 14, 2.5, -53, 8, 5, 5, wood);
      }
      cube(group, -20, 4, 4, 60, 8, 12, wood);
      cube(group, -20, 8.3, 4, 62, 0.6, 13, brass);
      for (let i = 0; i < 9; i++) pipe(group, [-46 + i * 6.5, 0, 12], [-46 + i * 6.5, 4.5, 12], 1.1, brass, 8);
      // Botellero detrás de la barra.
      for (const y of [6, 11, 16]) {
        cube(group, -20, y, -6, 56, 0.5, 3, wood);
        for (let i = 0; i < 14; i++) pipe(group, [-45 + i * 3.8, y + 0.3, -6], [-45 + i * 3.8, y + 2.6 + (i % 3) * 0.5, -6], 0.5, [green, violet, amber][(i + y) % 3], 6);
      }
      for (const x of [27, 48]) {
        cube(group, x, 3, 26, 13, 2, 13, wood);
        pipe(group, [x, 2, 26], [x, 0, 26], 2.5, brass);
      }
      for (const [x, z] of [[-30, 25], [0, 20], [30, -10], [-40, -20], [10, -22]]) lamp(group, x, 28, z, M, amber);
      const sign = new T.Mesh(new T.TorusGeometry(10, 1.2, 7, 22), neon);
      sign.position.set(0, 28, -64); group.add(sign);
      cube(group, 0, 28, -64.6, 16, 3, 0.4, amber);
    } else if (cfg.kind === 'laboratory') {
      // Laboratorio de Singed: pasillo central, mesas con frascos, tanques de cultivo y jaulas.
      cube(group, 0, 20, -67, 142, 41, 3, wall);
      for (const x of [-64, 64]) cube(group, x, 21, 0, 3, 42, 135, wall);
      for (let i = 0; i < 4; i++) {
        const z = -43 + i * 26;
        for (const sx of [-1, 1]) cube(group, sx * 28, 4, z, 42, 7, 10, wood);
        for (let j = 0; j < 8; j++) {
          const x = -45 + j * 12.8;
          if (Math.abs(x) < 9) continue;
          pipe(group, [x, 7.5, z], [x, 10 + (i + j) % 4 * 1.5, z], 0.9, (i + j) % 3 ? flaskGreen : flaskViolet, 8);
        }
      }
      for (const [x, z] of [[-52, -55], [52, -55], [-52, 20], [52, 20]]) {
        pipe(group, [x, 0, z], [x, 26, z], 5.2, new T.MeshStandardMaterial({ color: 0x9fd0b8, transparent: true, opacity: 0.22, roughness: 0.1, depthWrite: false }), 14);
        pipe(group, [x, 2, z], [x, 24, z], 4.4, material(x > 0 ? 0x8a4ab0 : 0x5aa04a, true, 'metal', 0.45), 14);
        for (const y of [1, 26]) cube(group, x, y, z, 12, 2, 12, brass);
      }
      for (let i = -4; i <= 4; i++) {
        cube(group, i * 14, 30, -62, 12, 2, 4, brass);
        pipe(group, [i * 14, 29, -62], [i * 14, 9, -62], 0.6, green);
      }
      for (let i = 0; i < 6; i++) pipe(group, [-60, 36 - i, -50 + i * 18], [60, 36 - i, -50 + i * 18], 0.8, i % 2 ? iron : rust);
      orb(group, 0, 18, -12, 8, violet);
      puddle(group, 0, -5, 3, winViolet);
    } else if (cfg.kind === 'garden') {
      // Cúpula acristalada con nervios de latón, bancales, senderos y un núcleo químico suspendido.
      const glass = new T.MeshStandardMaterial({ color: 0x7fa691, transparent: true, opacity: 0.18, roughness: 0.2, metalness: 0.1, depthWrite: false, side: T.DoubleSide });
      const dome = new T.Mesh(new T.SphereGeometry(83, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), glass);
      group.add(dome);
      for (let i = 0; i < 16; i++) {
        const a = (i + 0.5) * Math.PI / 8;
        pipe(group, [Math.sin(a) * 73, 0, Math.cos(a) * 73], [0, 86, 0], 0.55, brass);
      }
      for (let i = 0; i < 35; i++) {
        const a = i * 2.399, d = 12 + (i % 6) * 9;
        const x = Math.cos(a) * d, z = Math.sin(a) * d;
        if (Math.abs(x) < 6) continue; // deja libre el sendero central
        cube(group, x, 0.9, z, 5, 1.8, 5, wood);
        pipe(group, [x, 1.8, z], [x, 7 + i % 5 * 3, z], 0.75, wood);
        orb(group, x, 11 + i % 5 * 3, z, 4 + i % 3 * 2.5, leaf);
        if (i % 3 === 0) orb(group, x, 8 + i % 5 * 3, z, 1.4, violet);
      }
      cube(group, 0, 0.05, 0, 9, 0.1, 150, stone);
      orb(group, 0, 64, -14, 12, green);
      for (const x of [-25, 25]) pipe(group, [x, 0, -35], [x, 70, -35], 1.5, iron);
    }
    // Meta física visible al fondo: al llegar, E activa el objetivo del lugar.
    const portal = new T.Group(); portal.position.set(0, 2, -48);
    cube(portal, 0, 0, 0, 11, 0.4, 11, brass);
    orb(portal, 0, 9, 0, 5.2, neon);
    for (const dx of [-6, 6]) pipe(portal, [dx, 0, 0], [dx, 10, 0], 0.7, brass);
    portal.userData.noCollide = true;
    group.add(portal);
    K?.scaleUVs(group);
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
    session.hero?.dispose();
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
    const hint = document.createElement('p'); hint.textContent = cfg.desc + ' · WASD o clic para caminar · Mayús para correr · E para interactuar · Esc para salir';
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
    scene.fog = new T.FogExp2(scene.background, cfg.kind === 'canyon' ? 0.0058 : 0.0037);
    scene.add(new T.HemisphereLight(0xa0c9bd, 0x3a3228, 2.2));
    // Luz fría cenital, como la que se cuela desde Piltover, para dar volumen y sombras.
    const moon = new T.DirectionalLight(0x9fc4d4, 1.3); moon.position.set(-35, 95, 30); scene.add(moon);
    K?.shadows(renderer, moon);
    const key = new T.PointLight(cfg.accent, 95, 150, 2); key.position.set(0, 35, -32); scene.add(key);
    const warm = new T.PointLight(0xffae65, 36, 110, 2); warm.position.set(-25, 15, 32); scene.add(warm);
    if (cfg.kind === 'tree') { const hearth = new T.PointLight(0xffb060, 60, 90, 1.6); hearth.position.set(0, 10, 0); scene.add(hearth); }
    const group = new T.Group(); scene.add(group);
    const goal = build(group, cfg);
    // Primer punto de investigación independiente del objetivo narrativo final.
    const clue = new T.Group();
    clue.position.set(21, 2, 17);
    cube(clue, 0, 0, 0, 8, 2, 8, material(0x665b4c));
    orb(clue, 0, 5, 0, 3.3, material(0x61e6d1, true));
    clue.userData.noCollide = true;
    group.add(clue);
    const air = K?.atmosphere(scene, { dust: cfg.kind === 'tree' ? 0xffc77a : 0x9fe07a, shaft: 0x9fd8c0, smoke: 0x55665e,
      shafts: [{ x: -14, y: 30, z: -10, r0: 2, r1: 10, h: 62, rz: 0.15 }, { x: 18, y: 30, z: 20, r0: 2, r1: 8, h: 60, rz: -0.2, o: 0.15 }] });
    const camera = new T.PerspectiveCamera(62, Math.max(1, host.clientWidth / host.clientHeight), 0.1, 600);
    const keys = new Set();
    let last = 0;
    let complete = false;
    let inspected = false;
    let hero = null;
    const player = () => hero ? hero.pos : { x: 0, z: 58 };
    const keydown = (e) => {
      if (!running || e.target?.matches?.('input,textarea,select')) return;
      const k = e.key.toLowerCase();
      if (['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright','shift','e','escape'].includes(k)) e.preventDefault();
      if (k === 'escape') { close(); return; }
      const p = player();
      if (k === 'e' && !inspected && Math.hypot(p.x - clue.position.x, p.z - clue.position.z) < 13) {
        inspected = true;
        status.textContent = discoveries[cfg.kind] + ' Ahora busca el objetivo principal.';
        clue.visible = false;
        return;
      }
      if (k === 'e' && inspected && Math.hypot(p.x - goal.position.x, p.z - goal.position.z) < 17 && !complete) {
        complete = true; const action = onGoal; close(); action?.(); return;
      }
      if (k !== 'e') keys.add(k);
    };
    const keyup = (e) => keys.delete(e.key.toLowerCase());
    window.addEventListener('keydown', keydown);
    window.addEventListener('keyup', keyup);
    // El protagonista del jugador camina por el escenario (muñeco de su retrato o su .glb).
    hero = K?.hero({ scene, camera, dom: renderer.domElement, group, bounds: { x: 34, z0: -60, z1: 63 }, spawn: { x: 0, z: 58 },
      lift: [goal, clue], pick: [clue, goal], fill: 0xffc98a, interact: () => { const was = inspected; keydown(new KeyboardEvent('keydown', { key: 'e' })); return was !== inspected || !running; } }) || null;
    const session = { host, group, renderer, onExit, keydown, keyup, hero, raf: 0 };
    running = session;
    /** Anima el recorrido interior y comprueba la cercanía al punto de misión. */
    function frame(now) {
      if (running !== session) return;
      const dt = Math.min(0.05, (now - (last || now)) / 1000); last = now;
      const x = Number(keys.has('d') || keys.has('arrowright')) - Number(keys.has('a') || keys.has('arrowleft'));
      const z = Number(keys.has('s') || keys.has('arrowdown')) - Number(keys.has('w') || keys.has('arrowup'));
      if (hero) hero.update(dt, now / 1000, { x, z, run: keys.has('shift') });
      else {
        camera.position.set(0, 19, 85); camera.lookAt(0, 3, 26);
      }
      air?.tick(now / 1000);
      const p = player();
      const d = Math.hypot(p.x - goal.position.x, p.z - goal.position.z);
      const dc = Math.hypot(p.x - clue.position.x, p.z - clue.position.z);
      status.textContent = !inspected
        ? dc < 13 ? 'Pulsa E para investigar la pista azul.' : 'Busca la pista azul (' + Math.round(dc) + ' m).'
        : d < 17 ? 'Pista encontrada. Pulsa E para activar el objetivo de la historia.'
          : 'Pista encontrada. Llega a la luz del objetivo (' + Math.round(d) + ' m).';
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
