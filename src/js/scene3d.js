// Escenas 3D en tiempo real (Three.js) para el menú principal, los ajustes, las partidas
// y el creador: Piltover dorado arriba, Zaun con neón y niebla abajo, el Puente del
// Progreso y un cristal hextec flotante. La cámara orbita y sigue al ratón.
(function () {
  if (!window.THREE) return;
  const T = window.THREE;

  // Cámaras predefinidas para cada pantalla.
  const SHOTS = {
    title: { pos: [0, 26, 92], look: [0, 10, 0], orbit: 0.035, radius: 92 },
    menu: { pos: [-60, 40, 50], look: [0, 6, 0], orbit: 0.02, radius: 80 },
    settings: { pos: [40, 8, 40], look: [0, -2, 0], orbit: 0.015, radius: 60 },
  };

  function rng(seed) {
    let a = seed >>> 0;
    return () => {
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // Textura de ventanas iluminadas para las fachadas.
  function windowTexture(lit, dark, seed) {
    const c = document.createElement('canvas');
    c.width = 64;
    c.height = 128;
    const g = c.getContext('2d');
    g.fillStyle = dark;
    g.fillRect(0, 0, 64, 128);
    const r = rng(seed);
    for (let y = 4; y < 124; y += 10) {
      for (let x = 4; x < 60; x += 10) {
        if (r() < 0.45) { g.fillStyle = lit; g.globalAlpha = 0.5 + r() * 0.5; g.fillRect(x, y, 5, 6); }
      }
    }
    g.globalAlpha = 1;
    const tex = new T.CanvasTexture(c);
    tex.wrapS = tex.wrapT = T.RepeatWrapping;
    tex.colorSpace = T.SRGBColorSpace;
    return tex;
  }

  function glowTexture(color) {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const g = c.getContext('2d');
    const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grd.addColorStop(0, color);
    grd.addColorStop(0.25, color.replace('1)', '0.5)'));
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = grd;
    g.fillRect(0, 0, 128, 128);
    return new T.CanvasTexture(c);
  }

  function glowSprite(color, size) {
    const m = new T.SpriteMaterial({ map: glowTexture(color), blending: T.AdditiveBlending, depthWrite: false, transparent: true });
    const s = new T.Sprite(m);
    s.scale.set(size, size, 1);
    return s;
  }

  function buildCity(scene) {
    const r = rng(7);
    const dyn = { neon: [], crystal: null, halo: null, ring: null, dust: null, spores: null, lights: [] };

    // Luces
    scene.add(new T.HemisphereLight(0xffe2b0, 0x0a2a24, 0.55));
    const sun = new T.DirectionalLight(0xffc27a, 1.6);
    sun.position.set(-60, 80, 40);
    scene.add(sun);
    const zaunLight = new T.PointLight(0x3fbf9f, 600, 120, 1.6);
    zaunLight.position.set(0, -18, 10);
    scene.add(zaunLight);

    // Suelos: meseta de Piltover y fondo de Zaun
    const pilGround = new T.Mesh(new T.BoxGeometry(220, 6, 90), new T.MeshStandardMaterial({ color: 0x8a6a3a, roughness: 0.8 }));
    pilGround.position.set(0, -3, -55);
    scene.add(pilGround);
    const zaunGround = new T.Mesh(new T.PlaneGeometry(260, 140), new T.MeshStandardMaterial({ color: 0x0b1714, roughness: 1 }));
    zaunGround.rotation.x = -Math.PI / 2;
    zaunGround.position.set(0, -30, 30);
    scene.add(zaunGround);
    // Pared del acantilado
    const cliff = new T.Mesh(new T.BoxGeometry(220, 28, 4), new T.MeshStandardMaterial({ color: 0x3a2e24, roughness: 1 }));
    cliff.position.set(0, -16, -11);
    scene.add(cliff);

    // Torres de Piltover
    const pilTex = windowTexture('#ffd890', '#c9b28a', 3);
    const goldMat = new T.MeshStandardMaterial({ color: 0xd8b060, metalness: 0.7, roughness: 0.3 });
    for (let i = 0; i < 70; i++) {
      const w = 3 + r() * 6;
      const h = 8 + r() * 34;
      const x = -100 + r() * 200;
      const z = -95 + r() * 75;
      const tex = pilTex.clone();
      tex.needsUpdate = true;
      tex.repeat.set(Math.max(1, w / 4), Math.max(1, h / 8));
      const mat = new T.MeshStandardMaterial({ color: 0xe8dcc0, map: tex, emissive: 0xffc070, emissiveMap: tex, emissiveIntensity: 0.35, roughness: 0.6 });
      const b = new T.Mesh(new T.BoxGeometry(w, h, w), mat);
      b.position.set(x, h / 2, z);
      scene.add(b);
      const roof = r();
      let top;
      if (roof < 0.35) top = new T.Mesh(new T.SphereGeometry(w * 0.6, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), goldMat);
      else if (roof < 0.75) top = new T.Mesh(new T.ConeGeometry(w * 0.7, w * 1.8, 4), new T.MeshStandardMaterial({ color: 0x2f6f7a, roughness: 0.5 }));
      else top = new T.Mesh(new T.CylinderGeometry(w * 0.2, w * 0.3, w * 1.5, 8), goldMat);
      top.position.set(x, h + (roof < 0.35 ? 0 : w * 0.8), z);
      if (roof >= 0.35 && roof < 0.75) top.rotation.y = Math.PI / 4;
      scene.add(top);
    }

    // Chabolas y fábricas de Zaun con neones
    const zTex = windowTexture('#ffb860', '#1c2422', 9);
    const neonCols = [0x3fbf9f, 0xe0457b, 0xbf3abf, 0x8fbf3a, 0xf0a040];
    for (let i = 0; i < 120; i++) {
      const w = 4 + r() * 8;
      const h = 4 + r() * 22;
      const x = -120 + r() * 240;
      const z = -5 + r() * 90;
      const tex = zTex.clone();
      tex.needsUpdate = true;
      tex.repeat.set(Math.max(1, w / 5), Math.max(1, h / 7));
      const b = new T.Mesh(new T.BoxGeometry(w, h, w * (0.6 + r() * 0.6)),
        new T.MeshStandardMaterial({ color: 0x24302c, map: tex, emissive: 0xff9a40, emissiveMap: tex, emissiveIntensity: 0.6, roughness: 0.9 }));
      b.position.set(x, -30 + h / 2, z);
      b.rotation.y = (r() - 0.5) * 0.3;
      scene.add(b);
      if (r() < 0.45) {
        const col = neonCols[Math.floor(r() * neonCols.length)];
        const n = new T.Mesh(new T.BoxGeometry(w * 0.7, 0.6, 0.3), new T.MeshBasicMaterial({ color: col }));
        n.position.set(x, -30 + h * (0.4 + r() * 0.5), z + w * 0.5);
        scene.add(n);
        dyn.neon.push({ mesh: n, ph: r() * 10 });
      }
      if (r() < 0.25) {
        const ch = new T.Mesh(new T.CylinderGeometry(0.8, 1, 10, 8), new T.MeshStandardMaterial({ color: 0x1a1a22 }));
        ch.position.set(x + w * 0.3, -30 + h + 5, z);
        scene.add(ch);
      }
    }
    // Tuberías
    const pipeMat = new T.MeshStandardMaterial({ color: 0x3a5a3a, metalness: 0.6, roughness: 0.5 });
    for (let i = 0; i < 6; i++) {
      const curve = new T.CatmullRomCurve3([
        new T.Vector3(-130, -12 - i * 2, 10 + i * 12), new T.Vector3(-40, -6 - i * 3, 4 + i * 14),
        new T.Vector3(30, -16 - i, 12 + i * 10), new T.Vector3(130, -10 - i * 2, 6 + i * 12),
      ]);
      scene.add(new T.Mesh(new T.TubeGeometry(curve, 60, 0.9, 8, false), pipeMat));
    }

    // Puente del Progreso
    const bridgeMat = new T.MeshStandardMaterial({ color: 0x8a6a42, roughness: 0.6, metalness: 0.3 });
    const deck = new T.Mesh(new T.BoxGeometry(8, 1.5, 70), bridgeMat);
    deck.position.set(0, -1, 22);
    deck.rotation.x = 0.22;
    scene.add(deck);
    for (let i = 0; i < 5; i++) {
      const arch = new T.Mesh(new T.TorusGeometry(6, 0.7, 8, 24, Math.PI), bridgeMat);
      arch.position.set(0, -6 - i * 2.8, 6 + i * 12);
      arch.rotation.y = Math.PI / 2;
      arch.rotation.z = Math.PI;
      scene.add(arch);
      for (const sx of [-4.5, 4.5]) {
        const lamp = glowSprite('rgba(255,210,130,1)', 5);
        lamp.position.set(sx, 1.5 - i * 2.9, 6 + i * 12);
        scene.add(lamp);
      }
    }

    // Cristal hextec flotante
    const crystal = new T.Mesh(new T.OctahedronGeometry(5, 0), new T.MeshStandardMaterial({ color: 0x7fd0ff, emissive: 0x3fa9f5, emissiveIntensity: 1.8, metalness: 0.2, roughness: 0.1, transparent: true, opacity: 0.92 }));
    crystal.position.set(0, 30, 0);
    crystal.scale.set(1, 1.6, 1);
    scene.add(crystal);
    const halo = glowSprite('rgba(90,190,255,1)', 40);
    halo.position.copy(crystal.position);
    scene.add(halo);
    const ring = new T.Mesh(new T.TorusGeometry(10, 0.25, 8, 64), new T.MeshBasicMaterial({ color: 0xe3c45a }));
    ring.position.copy(crystal.position);
    scene.add(ring);
    const ring2 = new T.Mesh(new T.TorusGeometry(13, 0.15, 8, 64), new T.MeshBasicMaterial({ color: 0x3fa9f5 }));
    ring2.position.copy(crystal.position);
    scene.add(ring2);
    const hexLight = new T.PointLight(0x5ab8ff, 900, 90, 1.5);
    hexLight.position.copy(crystal.position);
    scene.add(hexLight);
    Object.assign(dyn, { crystal, halo, ring, ring2, hexLight });

    // Partículas: polvo dorado arriba y esporas verdes abajo
    const mkPoints = (n, area, yMin, yMax, color, size) => {
      const g = new T.BufferGeometry();
      const pos = new Float32Array(n * 3);
      for (let i = 0; i < n; i++) {
        pos[i * 3] = (r() - 0.5) * area[0];
        pos[i * 3 + 1] = yMin + r() * (yMax - yMin);
        pos[i * 3 + 2] = area[1] + r() * area[2];
      }
      g.setAttribute('position', new T.BufferAttribute(pos, 3));
      const pts = new T.Points(g, new T.PointsMaterial({ color, size, transparent: true, opacity: 0.85, blending: T.AdditiveBlending, depthWrite: false }));
      scene.add(pts);
      return pts;
    };
    dyn.dust = mkPoints(700, [220, -100, 110], 2, 60, 0xffd890, 0.45);
    dyn.spores = mkPoints(900, [240, -5, 100], -30, -5, 0x6affc8, 0.5);
    return dyn;
  }

  let shared = null; // una sola escena para toda la app

  function create() {
    const canvas = document.createElement('canvas');
    canvas.className = 'scene3d';
    let renderer;
    try {
      renderer = new T.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
    } catch {
      return null;
    }
    renderer.setPixelRatio(Math.min(1.5, window.devicePixelRatio || 1));
    renderer.toneMapping = T.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.outputColorSpace = T.SRGBColorSpace;
    const scene = new T.Scene();
    scene.background = new T.Color(0x1a1020);
    scene.fog = new T.FogExp2(0x2a1a28, 0.0085);
    // Cielo en degradado
    const skyGeo = new T.SphereGeometry(400, 32, 16);
    const skyMat = new T.ShaderMaterial({
      side: T.BackSide, depthWrite: false,
      uniforms: { top: { value: new T.Color(0x2a1a48) }, mid: { value: new T.Color(0xe0874a) }, bot: { value: new T.Color(0x0a1a16) } },
      vertexShader: 'varying vec3 vP; void main(){ vP = (modelMatrix * vec4(position,1.0)).xyz; gl_Position = projectionMatrix * viewMatrix * vec4(vP,1.0); }',
      fragmentShader: 'uniform vec3 top; uniform vec3 mid; uniform vec3 bot; varying vec3 vP; void main(){ float h = normalize(vP).y; vec3 c = h > 0.05 ? mix(mid, top, smoothstep(0.05, 0.6, h)) : mix(bot, mid, smoothstep(-0.3, 0.05, h)); gl_FragColor = vec4(c, 1.0); }',
    });
    scene.add(new T.Mesh(skyGeo, skyMat));
    const camera = new T.PerspectiveCamera(50, 16 / 9, 0.5, 900);
    const dyn = buildCity(scene);
    return { canvas, renderer, scene, camera, dyn, shot: SHOTS.title, target: new T.Vector3(...SHOTS.title.look), look: new T.Vector3(...SHOTS.title.look), mouse: { x: 0, y: 0 }, running: false, host: null, t0: performance.now() };
  }

  function frame() {
    const S = shared;
    if (!S || !S.running) return;
    if (!S.host?.isConnected) { S.running = false; return; }
    const t = (performance.now() - S.t0) / 1000;
    const { dyn, camera, shot } = S;
    // Cámara orbitando con un poco de paralaje del ratón
    const ang = t * shot.orbit + S.mouse.x * 0.25;
    const goal = new T.Vector3(Math.sin(ang) * shot.radius + shot.pos[0] * 0.3, shot.pos[1] + S.mouse.y * -6 + Math.sin(t * 0.2) * 2, Math.cos(ang) * shot.radius);
    camera.position.lerp(goal, 0.03);
    S.look.lerp(S.target, 0.04);
    camera.lookAt(S.look);
    // Animaciones
    dyn.crystal.rotation.y = t * 0.6;
    dyn.crystal.position.y = 30 + Math.sin(t * 1.2) * 1.2;
    dyn.halo.position.y = dyn.crystal.position.y;
    dyn.halo.material.opacity = 0.75 + Math.sin(t * 2) * 0.2;
    dyn.ring.rotation.x = t * 0.5;
    dyn.ring.rotation.y = t * 0.3;
    dyn.ring2.rotation.x = -t * 0.35;
    dyn.ring2.rotation.z = t * 0.2;
    dyn.ring.position.y = dyn.ring2.position.y = dyn.crystal.position.y;
    dyn.hexLight.intensity = 800 + Math.sin(t * 3) * 200;
    dyn.dust.rotation.y = t * 0.01;
    dyn.dust.position.y = Math.sin(t * 0.3) * 1.5;
    dyn.spores.position.y = (t * 0.8) % 6;
    for (const n of dyn.neon) {
      const on = Math.sin(t * 3 + n.ph) > -0.85 && !(Math.sin(t * 17 + n.ph * 3) > 0.97);
      n.mesh.visible = on;
    }
    // Ajuste de tamaño
    const w = S.host.clientWidth;
    const h = S.host.clientHeight;
    if (w && h && (S.canvas.width !== Math.floor(w * S.renderer.getPixelRatio()) || S.canvas.height !== Math.floor(h * S.renderer.getPixelRatio()))) {
      S.renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    S.renderer.render(S.scene, camera);
    requestAnimationFrame(frame);
  }

  window.addEventListener('pointermove', (e) => {
    if (!shared) return;
    shared.mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
    shared.mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // Monta la escena 3D dentro de un contenedor con una cámara predefinida.
  function mount(host, shotName = 'title') {
    if (!shared) shared = create();
    if (!shared) return false;
    shared.shot = SHOTS[shotName] || SHOTS.title;
    shared.target.set(...shared.shot.look);
    if (shared.host !== host) {
      host.prepend(shared.canvas);
      shared.host = host;
      shared.camera.position.set(...shared.shot.pos);
    }
    if (!shared.running) {
      shared.running = true;
      requestAnimationFrame(frame);
    }
    return true;
  }

  function stop() {
    if (shared) shared.running = false;
  }

  window.Scene3D = { mount, stop, available: () => Boolean(window.THREE) };
})();
