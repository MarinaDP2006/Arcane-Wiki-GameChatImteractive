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
  /** Crea un material con acabado de piedra, metal o hextec luminosa. */
  function mat(color, glow = false, metalness = 0.28) {
    return new T.MeshStandardMaterial({ color, roughness: glow ? 0.3 : 0.72,
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
    obj.castShadow = true; group.add(obj); return obj;
  }
  /** Sitúa esferas de energía, engranajes y marcadores en el espacio. */
  function sphere(group, x, y, z, r, material, detail = 1) {
    const obj = new T.Mesh(new T.IcosahedronGeometry(r, detail), material);
    obj.position.set(x, y, z); group.add(obj); return obj;
  }
  /** Levanta el escenario modular con la composición propia de cada referencia. */
  function build(group, cfg) {
    const marble = mat(0xe6ddbd), cream = mat(0xb9ad92), dark = mat(0x424e55, false, 0.5);
    const gold = mat(0xc29b5a, false, 0.75), teal = mat(0x478b97), blue = mat(0x69d7ff, true);
    const violet = mat(0x6d779c, true), glass = new T.MeshStandardMaterial({
      color: 0xaccdcd, transparent: true, opacity: 0.26, metalness: 0.12, roughness: 0.14, side: T.DoubleSide, depthWrite: false,
    });
    block(group, 0, -1, 0, 170, 2, 180, cfg.kind === 'fortress' ? dark : marble);
    for (let i = -6; i <= 6; i++) {
      block(group, i * 12, 0.05, 0, 0.25, 0.1, 158, gold);
      block(group, 0, 0.05, i * 12, 155, 0.1, 0.25, gold);
    }
    if (cfg.kind === 'council') {
      // Ventanales góticos geométricos de tonos azul y ámbar y mesa circular.
      for (const x of [-44, 0, 44]) {
        block(group, x, 37, -69, 38, 74, 2.2, glass);
        for (const side of [-1, 1]) beam(group, [x + side * 16, 1, -67], [x, 70, -67], 1.15, gold);
        for (const y of [17, 34, 51]) block(group, x, y, -66, 36, 0.9, 1, gold);
        sphere(group, x, 58, -64, 5, blue);
      }
      const ring = new T.Mesh(new T.TorusGeometry(28, 3, 10, 48), gold);
      ring.rotation.x = Math.PI / 2; ring.position.set(0, 7, -17); group.add(ring);
      block(group, 0, 4.5, -17, 40, 4, 40, teal);
      for (let i = 0; i < 9; i++) {
        const a = i * Math.PI * 2 / 9;
        const x = Math.cos(a) * 38, z = -17 + Math.sin(a) * 38;
        block(group, x, 3, z, 12, 4, 10, gold);
        block(group, x, 7.5, z - 2, 11, 6, 2, dark);
      }
      for (const x of [-80, 80]) block(group, x, 34, -12, 4, 68, 170, cream);
    } else if (cfg.kind === 'workshop') {
      // Biblioteca lateral, pizarra con trazos de runas, mesas de laboratorio.
      for (const side of [-1, 1]) {
        block(group, side * 65, 27, -12, 16, 54, 136, cream);
        for (let y = 8; y < 49; y += 12) {
          block(group, side * 55, y, -18, 9, 1.6, 110, gold);
          for (let z = -65; z < 40; z += 12) {
            block(group, side * 55, y + 4, z, 5, 8, 2.5, z % 3 ? dark : teal);
          }
        }
      }
      block(group, 0, 33, -72, 112, 59, 3, cream);
      block(group, 0, 34, -69, 91, 42, 0.9, dark);
      // Grafo de ecuaciones físicas grabado sobre la pizarra.
      for (let i = 0; i < 20; i++) {
        const x = -42 + (i % 10) * 9, y = 22 + Math.floor(i / 10) * 14;
        beam(group, [x, y, -68], [x + (i % 3) * 2, y + 3 + i % 4, -68], 0.28, gold, 5);
        if (i % 4 === 0) sphere(group, x, y + 3, -67, 1.1, blue);
      }
      for (const x of [-30, 27]) {
        block(group, x, 6, 7, 43, 9, 16, gold);
        for (let i = 0; i < 7; i++) beam(group, [x - 16 + i * 5, 11, 4], [x - 16 + i * 5, 17 + i % 3 * 4, 4], 1.3, i % 3 ? teal : blue);
      }
      sphere(group, 30, 23, 8, 6, blue);
    } else if (cfg.kind === 'skyline') {
      // Torre hextec monumento, agujas art déco, anillo de hexpuerta y naves.
      for (const [x, z, h] of [[-41, -48, 112], [47, -57, 72], [-80, -63, 53], [80, -20, 66]]) {
        block(group, x, h / 2, z, 23, h, 23, cream);
        for (let y = 12; y < h; y += 13) block(group, x, y, z + 12, 18, 2, 2, gold);
        beam(group, [x, h, z], [x, h + 27, z], 3, gold);
      }
      const gate = new T.Mesh(new T.TorusGeometry(18, 2, 10, 48), blue);
      gate.position.set(-41, 91, -33); group.add(gate);
      // Pasarela entre torres y siluetas de aeronaves hextec.
      for (const z of [-45, 17]) {
        block(group, 0, 18, z, 133, 4, 11, cream);
        for (const x of [-48, 48]) beam(group, [x, 20, z], [x, 31, z], 1.0, gold);
      }
      for (let i = 0; i < 7; i++) {
        const x = -65 + i * 19, y = 40 + i % 3 * 16, z = -4 - i % 2 * 35;
        sphere(group, x, y, z, 4.1, gold);
        beam(group, [x - 7, y, z], [x + 7, y, z], 0.7, dark);
      }
    } else if (cfg.kind === 'fortress') {
      // Isla-prisión fortificada, almenas altas y faro sobre la cubierta.
      block(group, 0, 9, -25, 136, 19, 87, dark);
      block(group, 0, 40, -54, 104, 65, 38, cream);
      for (const x of [-53, 53]) {
        block(group, x, 40, -52, 15, 80, 35, dark);
        beam(group, [x, 80, -52], [x, 102, -52], 3, gold);
      }
      block(group, 0, 78, -54, 23, 12, 24, dark);
      sphere(group, 0, 85, -54, 5, blue);
      for (const x of [-36, -12, 12, 36]) {
        block(group, x, 35, -33, 3, 22, 1, dark);
        block(group, x, 54, -33, 3, 18, 1, dark);
      }
      for (let z = -68; z < 25; z += 20) for (const x of [-61, 61]) block(group, x, 28, z, 10, 20, 8, dark);
      const sea = new T.Mesh(new T.PlaneGeometry(250, 230), mat(0x263f4b, false, 0.2));
      sea.rotation.x = -Math.PI / 2; sea.position.y = -4; group.add(sea);
    } else if (cfg.kind === 'bridge') {
      // Puente elevado de piedra y hierro con torres, arcos y tensores.
      block(group, 0, 7, -19, 115, 13, 154, cream);
      for (const z of [-59, 35]) {
        for (const x of [-45, 45]) {
          block(group, x, 43, z, 12, 77, 15, cream);
          block(group, x, 83, z, 17, 7, 18, gold);
          beam(group, [x, 85, z], [x, 104, z], 1.5, gold);
        }
        for (let x = -38; x < 42; x += 9) {
          beam(group, [x, 14, z], [-45, 72, z], 0.35, dark, 5);
          beam(group, [x, 14, z], [45, 72, z], 0.35, dark, 5);
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
    return { clue, goal };
  }
  /** Cierra la exploración sin perder el mundo y limpia los recursos GPU. */
  function close() {
    if (!session) return;
    const active = session; session = null;
    cancelAnimationFrame(active.raf);
    window.removeEventListener('keydown', active.keydown);
    window.removeEventListener('keyup', active.keyup);
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
    const hint = document.createElement('p'); hint.textContent = 'WASD o flechas: explorar · Mayús: correr · E: investigar · Esc: volver';
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
    scene.add(new T.HemisphereLight(0xf6e5c1, 0x637b88, 2.3));
    const sun = new T.DirectionalLight(cfg.kind === 'fortress' ? 0xc5857d : 0xffebc4, 3.1);
    sun.position.set(-40, 100, 50); scene.add(sun);
    const lamp = new T.PointLight(cfg.color, 45, 110, 1.8);
    lamp.position.set(0, 36, -25); scene.add(lamp);
    const group = new T.Group(); scene.add(group);
    const { clue, goal } = build(group, cfg);
    const camera = new T.PerspectiveCamera(65, Math.max(1, root.clientWidth / Math.max(1, root.clientHeight)), 0.1, 700);
    const player = new T.Vector3(0, 7, 58);
    const keys = new Set();
    let inspected = false, finished = false, previous = 0;
    const keydown = (e) => {
      if (session !== active || e.target.matches?.('input,textarea,select')) return;
      const k = e.key.toLowerCase();
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'shift', 'e', 'escape'].includes(k)) e.preventDefault();
      if (k === 'escape') { close(); return; }
      const near = (group) => Math.hypot(player.x - group.position.x, player.z - group.position.z);
      if (k === 'e' && !inspected && near(clue) < 13) {
        inspected = true; clue.visible = false;
        status.textContent = cfg.clue + ' Ve ahora al punto de misión.'; return;
      }
      if (k === 'e' && inspected && !finished && near(goal) < 16) {
        finished = true; close(); onGoal?.(); return;
      }
      keys.add(k);
    };
    const keyup = (e) => { keys.delete(e.key.toLowerCase()); };
    window.addEventListener('keydown', keydown);
    window.addEventListener('keyup', keyup);
    const active = { root, group, renderer, onExit, keydown, keyup, raf: 0 };
    session = active;
    /** Actualiza cámara y movimiento en el recorrido antes de dibujar WebGL. */
    function frame(time) {
      if (session !== active) return;
      const dt = Math.min(0.05, (time - (previous || time)) / 1000); previous = time;
      const x = Number(keys.has('d') || keys.has('arrowright')) - Number(keys.has('a') || keys.has('arrowleft'));
      const z = Number(keys.has('s') || keys.has('arrowdown')) - Number(keys.has('w') || keys.has('arrowup'));
      const speed = (keys.has('shift') ? 45 : 26) * dt / (Math.hypot(x, z) || 1);
      player.x = T.MathUtils.clamp(player.x + x * speed, -34, 34);
      player.z = T.MathUtils.clamp(player.z + z * speed, -57, 63);
      camera.position.set(player.x, player.y + 12, player.z + 28);
      camera.lookAt(player.x, player.y - 3, player.z - 30);
      const d = Math.hypot(player.x - (inspected ? goal.position.x : clue.position.x), player.z - (inspected ? goal.position.z : clue.position.z));
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
