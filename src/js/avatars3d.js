// Personajes en 3D para el mundo abierto: el jugador y los protagonistas caminan, corren y
// respiran por las calles de Piltover y Zaun en vez de ser iconos redondos.
//
// Cada personaje se monta con un modelo propio:
//  1. Si hay un modelo .glb (por ejemplo, de Mixamo) en la carpeta «modelos» de tu carpeta de
//     arte (o en src/models), se usa con sus animaciones de reposo, andar y correr.
//     Archivos: modelos/<id>.glb (vi.glb, jinx.glb…), modelos/jugador.glb, modelos/generico.glb
//     y, para todos, modelos/animaciones/reposo.glb, andar.glb y correr.glb (Mixamo «In Place»).
//  2. Si no hay modelo, se construye un muñeco articulado pintado a mano con los colores de la
//     serie (pelo, piel, ropa), la cara de su retrato y una animación procedural de andar y correr.
(function () {
  if (!window.THREE) return;
  const T = window.THREE;
  // Altura de una persona adulta en unidades del mapa. Algo más grande que la escala real de
  // las calles (como en los juegos de vista aérea) para que se vean bien desde la cámara.
  const H = 64;
  const DOLL = H / 44; // el muñeco se modela con 44 unidades de alto
  const WALK = 230; // velocidad de andar del jugador (world.js)

  // ---------- Textura de pincel (para que la ropa no parezca plástico) ----------
  let brush = null;
  /** Genera una textura de pinceladas para los materiales de los personajes. */
  function brushTex() {
    if (brush) return brush;
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const g = c.getContext('2d');
    g.fillStyle = '#e6e6e6';
    g.fillRect(0, 0, 128, 128);
    let a = 7;
    const r = () => { a = (a * 16807) % 2147483647; return a / 2147483647; };
    for (let i = 0; i < 260; i++) {
      const v = Math.round(190 + r() * 65);
      g.strokeStyle = `rgba(${v},${v},${v},${0.25 + r() * 0.35})`;
      g.lineWidth = 2 + r() * 6;
      g.lineCap = 'round';
      const x = r() * 128;
      const y = r() * 128;
      const ang = -0.6 + r() * 0.5;
      const len = 8 + r() * 26;
      g.beginPath();
      g.moveTo(x, y);
      g.quadraticCurveTo(x + Math.cos(ang) * len * 0.5, y + Math.sin(ang) * len * 0.5 + (r() - 0.5) * 6, x + Math.cos(ang) * len, y + Math.sin(ang) * len);
      g.stroke();
    }
    brush = new T.CanvasTexture(c);
    brush.wrapS = brush.wrapT = T.RepeatWrapping;
    brush.colorSpace = T.SRGBColorSpace;
    return brush;
  }

  // Cara pintada (ojos, cejas, boca y marcas de cada personaje) sobre fondo transparente.
  // Se envuelve en la parte delantera de la cabeza: el centro del lienzo mira al frente.
  const faceCache = new Map();
  /** Dibuja los rasgos faciales que corresponden al personaje. */
  function faceTex(spec) {
    const L = spec.look;
    const acc = spec.accents;
    const key = JSON.stringify([L.eyeColor, L.eyes, L.brows, L.lipColor, L.makeup, L.makeupColor, spec.hair, spec.skin, acc]);
    if (faceCache.has(key)) return faceCache.get(key);
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    const g = c.getContext('2d');
    // Rasgos grandes, como en los personajes pintados de la serie (escalado desde el centro).
    const F = 1.45;
    g.setTransform(F, 0, 0, F, 128 - 128 * F, 150 - 150 * F);
    const skin = new T.Color(spec.skin);
    const dark = `#${skin.clone().multiplyScalar(0.55).getHexString()}`;
    const big = L.eyes === 'grandes' || acc.includes('yordle');
    const ey = 140;
    const ew = big ? 17 : 14;
    const eh = big ? 12 : L.eyes === 'rasgados' || L.eyes === 'cansados' ? 6.5 : 8.5;
    // Rubor suave en mejillas y sombra de la nariz
    for (const sx of [-1, 1]) {
      const r = g.createRadialGradient(128 + sx * 46, 176, 2, 128 + sx * 46, 176, 26);
      r.addColorStop(0, 'rgba(200,90,80,0.22)');
      r.addColorStop(1, 'rgba(200,90,80,0)');
      g.fillStyle = r;
      g.fillRect(0, 0, 256, 256);
    }
    g.strokeStyle = dark;
    g.lineWidth = 3;
    g.lineCap = 'round';
    g.beginPath();
    g.moveTo(130, 150);
    g.quadraticCurveTo(136, 172, 126, 178);
    g.stroke();
    for (const sx of [-1, 1]) {
      const ex = 128 + sx * 40;
      if (L.makeup) {
        g.fillStyle = L.makeupColor || '#3a2a3a';
        g.globalAlpha = L.makeup === 'sombra' ? 0.45 : 0.25;
        g.beginPath();
        g.ellipse(ex, ey - 4, ew + 6, eh + 6, 0, Math.PI, 0);
        g.fill();
        g.globalAlpha = 1;
      }
      // Ojo: blanco, iris del color del personaje y pupila
      g.fillStyle = '#f4ece4';
      g.beginPath();
      g.ellipse(ex, ey, ew, eh, 0, 0, Math.PI * 2);
      g.fill();
      g.save();
      g.clip();
      const iris = sx < 0 && acc.includes('scar') && spec.id === 'silco' ? '#d03020' : L.eyeColor || '#4a3a2a';
      g.fillStyle = iris;
      g.beginPath();
      g.arc(ex + sx * 1, ey + 1, eh * 1.05, 0, Math.PI * 2);
      g.fill();
      g.fillStyle = '#120c0c';
      g.beginPath();
      g.arc(ex + sx * 1, ey + 1, eh * 0.45, 0, Math.PI * 2);
      g.fill();
      g.fillStyle = 'rgba(255,255,255,0.85)';
      g.beginPath();
      g.arc(ex - 3, ey - 3, 2.2, 0, Math.PI * 2);
      g.fill();
      g.restore();
      // Línea de pestañas y párpado
      g.strokeStyle = '#1a1010';
      g.lineWidth = L.makeup === 'eyeliner' ? 5 : 3.5;
      g.beginPath();
      g.ellipse(ex, ey, ew, eh, 0, Math.PI * 1.05, Math.PI * 1.95);
      g.stroke();
      // Ceja (más inclinada en los personajes duros)
      g.strokeStyle = spec.hair;
      g.lineWidth = L.brows === 'gruesas' ? 7 : L.brows === 'finas' ? 3 : 5;
      const tilt = (L.browAngle || (L.brows === 'arqueadas' ? -1 : 0)) * 2.5;
      g.beginPath();
      g.moveTo(ex - sx * 16, ey - eh - 12 + tilt);
      g.quadraticCurveTo(ex, ey - eh - (L.brows === 'arqueadas' ? 22 : 17), ex + sx * 18, ey - eh - 13);
      g.stroke();
    }
    // Boca
    g.strokeStyle = L.lipColor || `#${skin.clone().lerp(new T.Color(0x9a3a3a), 0.55).multiplyScalar(0.85).getHexString()}`;
    g.lineWidth = 5;
    g.beginPath();
    g.moveTo(112, 200);
    g.quadraticCurveTo(128, 206, 144, 199);
    g.stroke();
    // Marcas de cada personaje
    if (acc.includes('freckles')) {
      g.fillStyle = 'rgba(140,70,40,0.55)';
      let a = 3;
      for (let i = 0; i < 26; i++) {
        a = (a * 48271) % 2147483647;
        const sx = i % 2 ? 1 : -1;
        g.beginPath();
        g.arc(128 + sx * (28 + (a % 30)), 166 + ((a >> 5) % 20), 1.6, 0, Math.PI * 2);
        g.fill();
      }
    }
    if (acc.includes('tattoo')) {
      g.fillStyle = 'rgba(150,30,70,0.85)';
      g.font = 'bold 22px Georgia, serif';
      g.fillText('VI', 66, 186);
    }
    if (acc.includes('scar')) {
      g.strokeStyle = 'rgba(110,40,50,0.8)';
      g.lineWidth = 3;
      g.beginPath();
      g.moveTo(74, 112);
      g.lineTo(98, 176);
      g.moveTo(80, 160);
      g.lineTo(100, 150);
      g.stroke();
    }
    if (acc.includes('paint')) {
      g.strokeStyle = 'rgba(240,240,230,0.9)';
      g.lineWidth = 3;
      for (const sx of [-1, 1]) {
        g.beginPath();
        g.moveTo(128 + sx * 30, 162);
        g.lineTo(128 + sx * 52, 168);
        g.stroke();
      }
    }
    if (acc.includes('mustache')) {
      g.fillStyle = spec.hair;
      for (const sx of [-1, 1]) {
        g.beginPath();
        g.ellipse(128 + sx * 22, 188, 26, 10, sx * 0.25, 0, Math.PI * 2);
        g.fill();
      }
    }
    const tex = new T.CanvasTexture(c);
    tex.colorSpace = T.SRGBColorSpace;
    tex.anisotropy = 4;
    faceCache.set(key, tex);
    return tex;
  }

  // ---------- Complexión y vestuario de cada protagonista ----------
  const BUILD = {
    heimerdinger: { scale: 0.55, head: 1.55, wide: 1.1, ears: true },
    isha: { scale: 0.62, head: 1.25 },
    vander: { scale: 1.1, wide: 1.25 },
    ambessa: { scale: 1.08, wide: 1.15, coat: 'coat' },
    mel: {},
    cassandra: {},
    sevika: { scale: 1.04, wide: 1.15, metalArm: true },
    kino: { wide: 1.1 },
    silco: { wide: 0.9 },
    jinx: { wide: 0.82 },
    viktor: { wide: 0.88 },
    jayce: { scale: 1.04, wide: 1.05 },
    caitlyn: { coat: 'coat' },
  };
  const OUTFIT_COAT = { abrigo: 'coat', bata: 'coat', vestido: 'dress' };

  const shade = (hex, k) => new T.Color(hex).multiplyScalar(k);

  /** Devuelve las características físicas del personaje elegido. */
  function specFor(id, player) {
    if (player) {
      const L = player.look || {};
      const top = L.outfitColor || '#4a3a5a';
      // Ropa deducida del retrato del creador: cada prenda se viste en 3D a lo Arcane.
      const outfit = L.outfit || 'chaqueta';
      const bottom = outfit === 'mono' ? top : outfit === 'uniforme' ? shade(top, 0.7).getHex() : outfit === 'chaqueta' || outfit === 'top' ? 0x2c2a30 : shade(top, 0.45).getHex();
      return {
        id: null, look: L, skin: L.skin || '#e8b394', hair: L.hair || '#2a1e18', style: L.style || 'short', top, bottom, shirt: L.shirt || '#3a3040',
        accents: [...(L.accents || [])], build: { coat: OUTFIT_COAT[L.outfit], outfit, bareArms: outfit === 'top', lightCoat: outfit === 'bata' },
      };
    }
    const p = window.WIKI?.personajes.find((x) => x.id === id) || {};
    // Aspecto de su retrato (portrait.js) y, si falta, el de la wiki.
    const L = { ...(p.look || {}), ...(window.Portrait?.LOOKS?.[id] || {}) };
    const build = { ...(BUILD[id] || {}) };
    build.coat ||= OUTFIT_COAT[L.outfit];
    return {
      id, look: L, skin: L.skin || '#e8b89a', hair: L.hair || '#2a1e18', style: L.style || 'short', top: L.outfitColor || p.colors?.[0] || '#5a4a6a', bottom: p.colors?.[1] || '#2a2030',
      accents: [...new Set([...(L.accents || []), p.look?.accent, L.ears === 'yordle' ? 'yordle' : null].filter(Boolean))], build,
    };
  }

  // ---------- Muñeco articulado ----------
  function mat(color, extra = {}) {
    return new T.MeshStandardMaterial({ color, map: brushTex(), roughness: 0.85, metalness: 0, ...extra });
  }
  /** Crea una malla y la prepara para recibir luz y sombras. */
  function mesh(geo, m, cast = true) {
    const x = new T.Mesh(geo, m);
    x.castShadow = cast;
    x.receiveShadow = false;
    return x;
  }
  // Cilindro que cuelga desde su articulación (y = 0 hacia abajo).
  function limb(len, r0, r1, m) {
    return mesh(new T.CylinderGeometry(r0, r1, len, 10).translate(0, -len / 2, 0), m);
  }

  /** Genera el peinado correspondiente al personaje. */
  function hairFor(style, r, m, skinM) {
    const g = new T.Group();
    const cap = (k = 1.08, cut = 0.5) => {
      const c = mesh(new T.SphereGeometry(r * k, 20, 12, 0, Math.PI * 2, 0, Math.PI * cut), m);
      c.rotation.x = -0.5;
      return c;
    };
    const add = (geo, x, y, z, rx = 0) => { const o = mesh(geo, m); o.position.set(x, y, z); o.rotation.x = rx; g.add(o); return o; };
    switch (style) {
      case 'bald': break;
      case 'mohawk':
        add(new T.BoxGeometry(r * 0.35, r * 0.7, r * 2.1), 0, r * 0.9, -r * 0.1);
        break;
      case 'undercut': {
        // Rapado por un lado y el resto peinado hacia el otro (Vi, Sevika).
        const c = cap(1.08, 0.42);
        c.rotation.z = -0.45;
        g.add(c);
        const lock = add(new T.SphereGeometry(r * 0.6, 12, 8).scale(1.5, 0.55, 1.3), r * 0.55, r * 0.75, r * 0.35);
        lock.rotation.z = -0.5;
        break;
      }
      case 'wild': case 'afro': case 'curly': {
        const o = mesh(new T.IcosahedronGeometry(r * (style === 'curly' ? 1.18 : 1.35), 1), m);
        o.position.set(0, r * 0.3, -r * 0.25);
        g.add(o);
        break;
      }
      default: g.add(cap(style === 'slick' ? 1.04 : 1.08));
    }
    if (style === 'swept' || style === 'messy') add(new T.SphereGeometry(r * 0.55, 10, 8).scale(1.6, 0.6, 1), 0, r * 0.85, r * 0.45);
    if (style === 'long') add(new T.BoxGeometry(r * 1.95, r * 2.7, r * 0.55), 0, -r * 0.6, -r * 0.72);
    if (style === 'bob') add(new T.BoxGeometry(r * 2.1, r * 1.3, r * 0.6), 0, -r * 0.05, -r * 0.7);
    if (style === 'bun') add(new T.SphereGeometry(r * 0.55, 12, 10), 0, r * 0.65, -r * 0.85);
    if (style === 'ponytail') { add(new T.SphereGeometry(r * 0.35, 10, 8), 0, r * 0.4, -r * 1.0); add(new T.CylinderGeometry(r * 0.3, r * 0.12, r * 2.4, 8).translate(0, -r * 1.2, 0), 0, r * 0.4, -r * 1.1, 0.2); }
    if (style === 'pigtails') { add(new T.SphereGeometry(r * 0.6, 12, 10), r * 1.05, r * 0.15, -r * 0.2); add(new T.SphereGeometry(r * 0.6, 12, 10), -r * 1.05, r * 0.15, -r * 0.2); }
    if (style === 'braids') {
      // Las trenzas larguísimas de Jinx (o las de Ambessa): cuelgan hasta la cadera.
      const braids = [];
      for (const sx of [-1, 1]) {
        const b = mesh(new T.CylinderGeometry(r * 0.2, r * 0.12, r * 5.6, 8).translate(0, -r * 2.8, 0), m);
        b.position.set(sx * r * 0.75, -r * 0.1, -r * 0.55);
        b.rotation.x = 0.12;
        g.add(b);
        braids.push(b);
      }
      g.userData.braids = braids;
    }
    if (skinM && style === 'mohawk') g.userData.skin = skinM;
    return g;
  }

  /** Coloca ropa y accesorios característicos en el avatar. */
  function accessories(spec, r, head, neck, M) {
    const has = (x) => spec.accents.includes(x);
    if (has('hat')) {
      const brim = mesh(new T.CylinderGeometry(r * 1.6, r * 1.6, 0.4, 20), M.dark);
      brim.position.y = r * 0.78;
      const crown = mesh(new T.CylinderGeometry(r * 0.9, r * 1.0, r * 0.9, 16), M.dark);
      crown.position.y = r * 1.2;
      head.add(brim, crown);
    }
    if (has('goggles')) {
      const band = mesh(new T.TorusGeometry(r * 1.02, 0.35, 6, 20), M.dark);
      band.rotation.x = Math.PI / 2;
      band.position.y = r * 0.45;
      head.add(band);
      for (const sx of [-1, 1]) {
        const lens = mesh(new T.CylinderGeometry(r * 0.32, r * 0.32, 0.8, 12), new T.MeshStandardMaterial({ color: 0xffb347, emissive: 0x6a3a00, metalness: 0.6, roughness: 0.3 }));
        lens.rotation.x = Math.PI / 2;
        lens.position.set(sx * r * 0.42, r * 0.5, r * 0.95);
        head.add(lens);
      }
    }
    if (has('beard')) {
      const b = mesh(new T.SphereGeometry(r * 0.75, 12, 8).scale(1.25, 0.9, 0.8), M.hair);
      b.position.set(0, -r * 0.6, r * 0.5);
      head.add(b);
    }
    if (has('gold')) {
      const c = mesh(new T.TorusGeometry(2.2, 0.55, 6, 18), new T.MeshStandardMaterial({ color: 0xd4a73f, metalness: 0.9, roughness: 0.3 }));
      c.rotation.x = Math.PI / 2;
      neck.add(c);
    }
    if (has('collar')) {
      const c = mesh(new T.CylinderGeometry(2.6, 2.2, 2.6, 14, 1, true), M.top);
      c.position.y = 0.6;
      neck.add(c);
    }
    if (spec.build.ears || has('yordle')) {
      for (const sx of [-1, 1]) {
        const e = mesh(new T.ConeGeometry(r * 0.35, r * 1.4, 8), M.skin);
        e.position.set(sx * r * 1.15, r * 0.2, -r * 0.1);
        e.rotation.z = -sx * 1.25;
        head.add(e);
      }
    }
  }

  /**
   * Prendas del protagonista deducidas de su retrato: cinturón, solapas, peto, bufanda,
   * hombreras, vendas… Se añaden sobre el muñeco para que la silueta recuerde a la serie.
   */
  function wear(spec, J, M, wide, r, P) {
    const B = spec.build;
    const has = (x) => spec.accents.includes(x);
    const brass = new T.MeshStandardMaterial({ color: 0xc89b4a, metalness: 0.8, roughness: 0.35, map: brushTex() });
    const leather = mat(0x3a2a22, { roughness: 0.55 });
    const wrap = mat(0xd9ccb0);
    const shirt = mat(spec.shirt);
    const put = (parent, geo, m, x, y, z, rx = 0, ry = 0, rz = 0) => {
      const o = mesh(geo, m); o.position.set(x, y, z); o.rotation.set(rx, ry, rz); parent.add(o); return o;
    };
    const belt = () => {
      put(P.hips, new T.CylinderGeometry(4 * wide, 4 * wide, 1.3, 16).scale(1, 1, 0.62), leather, 0, 1.6, 0);
      put(P.hips, new T.BoxGeometry(1.6, 1.3, 0.5), brass, 0, 1.6, 2.55);
    };
    const wraps = () => { for (const h of [J.handL, J.handR]) if (h && h.material !== M.arm) put(h, new T.CylinderGeometry(1.25, 1.15, 1.6, 10), wrap, 0, 0.9, 0); };
    const cuffs = (m) => { for (const e of [J.elL, J.elR]) put(e, new T.TorusGeometry(1.25, 0.45, 6, 14), m, 0, 0, 0, Math.PI / 2); };
    const pouches = () => { for (const sx of [-1, 1]) put(P.hips, new T.BoxGeometry(1.8, 2.2, 1.4), leather, sx * 3.4 * wide, 0.2, 2); };
    switch (B.outfit) {
      case 'chaqueta':
        // Chaqueta de cuero abierta con solapas, camisa debajo y mangas remangadas.
        put(P.torso, new T.BoxGeometry(2.2 * wide, 10, 0.4), shirt, 0, 5.5, 2.75, -0.08);
        for (const sx of [-1, 1]) put(P.torso, new T.BoxGeometry(1.5, 6, 0.4), M.dark, sx * 1.9 * wide, 8.6, 2.9, -0.15, 0, sx * 0.35);
        put(P.neck, new T.TorusGeometry(2.4, 0.6, 6, 16, Math.PI * 1.3), M.top, 0, 0, 0, Math.PI / 2, 0, Math.PI * 0.85);
        cuffs(M.top); belt(); wraps();
        break;
      case 'top':
        // Top de tirantes, pantalón de faena con bolsillos y vendas en las manos (estilo Vi).
        for (const sx of [-1, 1]) put(P.torso, new T.BoxGeometry(0.6, 3.5, 3.2), M.top, sx * 2.6 * wide, 11.6, 0);
        for (const k of [J.hipL, J.hipR]) put(k, new T.BoxGeometry(1.2, 3, 2.6), M.dark, (k === J.hipL ? -1 : 1) * 1.9, -5, 0.3);
        belt(); wraps();
        break;
      case 'mono':
        // Peto de taller con tirantes sobre camisa y bolsas de herramientas.
        P.torso.children[0].material = shirt;
        put(P.torso, new T.BoxGeometry(5.6 * wide, 6.5, 0.5), M.top, 0, 3.6, 2.6);
        for (const sx of [-1, 1]) put(P.torso, new T.BoxGeometry(0.9, 6.8, 0.4), M.top, sx * 2.1 * wide, 9.6, 2.45, 0.25);
        for (const sx of [-1, 1]) put(P.torso, new T.CylinderGeometry(0.4, 0.4, 0.3, 8), brass, sx * 2.1 * wide, 6.6, 2.95, Math.PI / 2);
        for (const k of [J.kneeL, J.kneeR]) put(k, new T.BoxGeometry(2.4, 2.4, 0.4), M.dark, 0, -1, 1.5);
        pouches(); cuffs(shirt);
        break;
      case 'harapos':
        // Ropa de la calle: bufanda anudada, remiendos y vendas.
        put(P.neck, new T.TorusGeometry(2, 0.95, 8, 16), M.dark, 0, 0.5, 0, Math.PI / 2);
        put(P.torso, new T.BoxGeometry(1.4, 6, 0.5), M.dark, 1.6, 8.5, 2.9, -0.3, 0, -0.15);
        put(P.torso, new T.BoxGeometry(2.2, 2, 0.3), mat(shade(spec.top, 1.3)), -1.9 * wide, 5, 2.75, 0, 0, 0.2);
        put(J.hipR, new T.BoxGeometry(2, 2, 0.3), mat(shade(spec.bottom, 1.5)), 0, -4, 2);
        wraps(); belt();
        break;
      case 'abrigo':
        // Abrigo de Piltover: cuello alto, botonadura y ribetes dorados.
        for (let y = 2.5; y < 11; y += 2.2) put(P.torso, new T.SphereGeometry(0.4, 8, 6), brass, 0.9, y, 2.8 - y * 0.03);
        put(P.torso, new T.BoxGeometry(0.25, 11, 0.3), brass, 0.25, 6, 2.8, -0.06);
        put(P.neck, new T.CylinderGeometry(2.4, 2.1, 2.6, 14, 1, true), M.top, 0, 0.9, 0);
        if (J.coat) put(P.hips, new T.TorusGeometry(6.2 * wide, 0.25, 4, 30, Math.PI * 2 - 1), brass, 0, -10.9, 0, Math.PI / 2, 0, 0.5 - Math.PI / 2);
        for (const e of [J.elL, J.elR]) put(e, new T.TorusGeometry(1.2, 0.3, 6, 14), brass, 0, -6.2, 0, Math.PI / 2);
        break;
      case 'uniforme':
        // Ejecutor: hombreras, placa dorada, cinturón y guanteletes.
        for (const sh of [J.shL, J.shR]) put(sh, new T.SphereGeometry(2.3, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), M.dark, 0, -0.3, 0);
        put(P.torso, new T.CylinderGeometry(0.9, 0.9, 0.3, 6), brass, -1.8 * wide, 9, 2.8, Math.PI / 2);
        for (const e of [J.elL, J.elR]) if (e.children[0]?.material !== M.arm) put(e, new T.CylinderGeometry(1.35, 1.2, 4, 10), M.dark, 0, -4.5, 0);
        belt();
        break;
      case 'vestido':
        // Vestido de gala: corsé, mangas abullonadas y collar.
        put(P.torso, new T.CylinderGeometry(3.7 * wide, 3.6 * wide, 4.5, 16).scale(1, 1, 0.74), M.dark, 0, 2.3, 0);
        for (const sh of [J.shL, J.shR]) put(sh, new T.SphereGeometry(1.9, 12, 8), M.top, 0, -0.8, 0);
        put(P.neck, new T.TorusGeometry(1.6, 0.25, 6, 18), brass, 0, 0.2, 0.2, Math.PI / 2 + 0.3);
        break;
      case 'bata':
        // Bata de laboratorio: solapas, bolsillo con plumas y gafas protectoras al cuello.
        put(P.torso, new T.BoxGeometry(2.4 * wide, 10, 0.4), shirt, 0, 5.5, 2.75, -0.08);
        for (const sx of [-1, 1]) put(P.torso, new T.BoxGeometry(1.4, 7, 0.4), M.top, sx * 1.9 * wide, 8, 2.9, -0.15, 0, sx * 0.3);
        put(P.torso, new T.BoxGeometry(1.8, 2, 0.4), M.top, -2.1 * wide, 7.5, 2.9);
        for (let i = 0; i < 2; i++) put(P.torso, new T.CylinderGeometry(0.15, 0.15, 2.4, 6), i ? brass : leather, -2.4 * wide + i * 0.6, 8.6, 3);
        break;
    }
    if (has('mask')) {
      // Máscara de gas de Zaun con dos filtros verdes.
      put(P.head, new T.BoxGeometry(r * 1.2, r * 0.75, r * 0.6), mat(0x4a5a3a), 0, -r * 0.4, r * 0.75);
      const glow = new T.MeshStandardMaterial({ color: 0x8fbf3a, emissive: 0x5a8a1a, emissiveIntensity: 1.2 });
      for (const sx of [-1, 1]) put(P.head, new T.CylinderGeometry(r * 0.24, r * 0.24, r * 0.5, 10), glow, sx * r * 0.5, -r * 0.55, r * 1.0, Math.PI / 2 - 0.3);
    }
    if (has('paint')) {
      // Pintura luminosa en los brazos, como las marcas de Jinx en la segunda temporada.
      const neon = new T.MeshStandardMaterial({ color: 0x5affd0, emissive: 0x5affd0, emissiveIntensity: 1.6 });
      for (const e of [J.elL, J.elR]) for (let i = 0; i < 2; i++) put(e, new T.TorusGeometry(1.15, 0.12, 4, 14), neon, 0, -2 - i * 2.2, 0, Math.PI / 2 + 0.3);
    }
    if (has('glasses')) {
      const frame = mat(0x1e1814);
      for (const sx of [-1, 1]) put(P.head, new T.TorusGeometry(r * 0.27, 0.12, 6, 16), frame, sx * r * 0.36, r * 0.12, r * 0.93);
    }
    if (has('piercing')) put(P.head, new T.TorusGeometry(0.35, 0.09, 6, 10), brass, r * 0.92, -r * 0.05, 0, 0, Math.PI / 2);
  }

  /** Construye el avatar articulado de respaldo a partir de piezas 3D. */
  function buildDoll(spec) {
    const B = spec.build;
    const wide = B.wide || 1;
    const M = {
      skin: mat(spec.skin, { roughness: 0.7 }),
      hair: mat(spec.hair, { roughness: 0.6 }),
      top: mat(spec.top),
      bottom: mat(spec.bottom),
      dark: mat(shade(spec.bottom, 0.6)),
      boots: mat(0x2a1e18, { roughness: 0.6 }),
    };
    const metal = B.metalArm || spec.accents.includes('arm');
    M.arm = metal ? new T.MeshStandardMaterial({ color: 0x7a8a9a, metalness: 0.85, roughness: 0.35 }) : M.top;
    const root = new T.Group();
    const body = new T.Group();
    root.add(body);
    const J = {};
    const hipY = 21.5;
    const hips = new T.Group();
    hips.position.y = hipY;
    body.add(hips);
    hips.add(mesh(new T.BoxGeometry(7.4 * wide, 4, 4.4), M.bottom));

    for (const side of [-1, 1]) {
      const hip = new T.Group();
      hip.position.set(side * 2.2 * wide, -1, 0);
      hips.add(hip);
      hip.add(limb(10.5, 2.1, 1.7, M.bottom));
      const knee = new T.Group();
      knee.position.y = -10.5;
      hip.add(knee);
      knee.add(limb(9.4, 1.7, 1.25, M.boots));
      const foot = mesh(new T.BoxGeometry(2.6, 1.6, 4.6), M.boots);
      foot.position.set(0, -9.6, 1);
      knee.add(foot);
      J[side < 0 ? 'hipL' : 'hipR'] = hip;
      J[side < 0 ? 'kneeL' : 'kneeR'] = knee;
    }
    if (B.coat) {
      // Falda del abrigo o vestido: abierta, para que se vean las piernas al andar.
      const len = B.coat === 'dress' ? 19 : 12;
      const coat = mesh(new T.CylinderGeometry(4.2 * wide, (B.coat === 'dress' ? 7.5 : 6.2) * wide, len, 16, 1, true, B.coat === 'dress' ? 0 : 0.5, B.coat === 'dress' ? Math.PI * 2 : Math.PI * 2 - 1).translate(0, -len / 2, 0),
        B.coat === 'dress' || B.lightCoat ? M.top : M.dark);
      coat.material = coat.material.clone();
      coat.material.side = T.DoubleSide;
      coat.position.y = 1;
      hips.add(coat);
      J.coat = coat;
    }

    const torso = new T.Group();
    torso.position.y = 1.5;
    hips.add(torso);
    const chest = mesh(new T.CylinderGeometry(4.3 * wide, 3.5 * wide, 12, 14).translate(0, 6, 0), M.top);
    chest.scale.z = 0.72;
    torso.add(chest);
    const shoulders = mesh(new T.SphereGeometry(4.3 * wide, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2).scale(1, 0.45, 0.72), M.top);
    shoulders.position.y = 12;
    torso.add(shoulders);
    const neck = new T.Group();
    neck.position.y = 13.2;
    torso.add(neck);
    neck.add(mesh(new T.CylinderGeometry(1.25, 1.4, 2.4, 10).translate(0, 1, 0), M.skin));

    const hk = B.head || 1;
    const r = 3.9 * hk;
    const head = new T.Group();
    head.position.y = 2 + r * 0.95;
    neck.add(head);
    head.add(mesh(new T.SphereGeometry(r, 22, 16).scale(0.92, 1.05, 0.95), M.skin));
    // La cara del retrato, envuelta en la parte delantera de la cabeza.
    const w = 1.9;
    const face = mesh(new T.SphereGeometry(r * 1.006, 24, 16, Math.PI / 2 - w / 2, w, 0.5, 1.75).scale(0.92, 1.05, 0.95),
      new T.MeshStandardMaterial({ map: faceTex(spec), transparent: true, roughness: 0.7, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 }), false);
    face.renderOrder = 1;
    head.add(face);
    const hair = hairFor(spec.style, r, M.hair);
    head.add(hair);
    J.braids = hair.userData.braids || null;

    for (const side of [-1, 1]) {
      const sh = new T.Group();
      sh.position.set(side * (4.3 * wide + 0.9), 11.6, 0);
      torso.add(sh);
      const sleeve = B.bareArms ? M.skin : M.top;
      const m = side > 0 && metal ? M.arm : sleeve;
      sh.add(limb(7.6, 1.45, 1.2, m));
      const elbow = new T.Group();
      elbow.position.y = -7.6;
      sh.add(elbow);
      elbow.add(limb(7, 1.2, 0.95, side > 0 && metal ? M.arm : M.skin));
      const hand = mesh(new T.SphereGeometry(1.25, 10, 8), side > 0 && metal ? M.arm : M.skin);
      hand.position.y = -7.4;
      elbow.add(hand);
      J[side < 0 ? 'handL' : 'handR'] = hand;
      J[side < 0 ? 'shL' : 'shR'] = sh;
      J[side < 0 ? 'elL' : 'elR'] = elbow;
    }
    accessories(spec, r, head, neck, M);
    if (B.outfit) wear(spec, J, M, wide, r, { torso, hips, head, neck });

    root.scale.setScalar((B.scale || 1) * DOLL);
    Object.assign(J, { body, hips, torso, head, chest });
    return { root, J, kind: 'doll', ph: Math.random() * 10 };
  }

  // Ciclo de andar y correr: piernas, rodillas, brazos opuestos, balanceo y cabeza.
  function animateDoll(av, dt, speed, t) {
    const J = av.J;
    const amp = Math.min(1, speed / 110);
    const run = Math.max(0, Math.min(1, (speed - 260) / 120));
    av.ph += dt * (speed / ((34 + run * 12) * DOLL)) * Math.PI;
    av.amp = (av.amp ?? 0) + (amp - (av.amp ?? 0)) * Math.min(1, dt * 8);
    av.run = (av.run ?? 0) + (run - (av.run ?? 0)) * Math.min(1, dt * 6);
    const A = av.amp;
    const R = av.run;
    const s = Math.sin(av.ph);
    const c = Math.cos(av.ph);
    const swing = (0.55 + 0.3 * R) * A;
    J.hipL.rotation.x = -s * swing;
    J.hipR.rotation.x = s * swing;
    J.kneeL.rotation.x = A * (0.12 + (0.55 + 0.7 * R) * Math.max(0, -c));
    J.kneeR.rotation.x = A * (0.12 + (0.55 + 0.7 * R) * Math.max(0, c));
    const breath = Math.sin(t * 2.1 + av.ph * 0.01);
    J.shL.rotation.x = s * swing * 0.85 + (1 - A) * breath * 0.03;
    J.shR.rotation.x = -s * swing * 0.85 - (1 - A) * breath * 0.03;
    J.shL.rotation.z = -0.1 - (1 - A) * 0.04;
    J.shR.rotation.z = 0.1 + (1 - A) * 0.04;
    J.elL.rotation.x = -(0.15 + 0.35 * A + 0.9 * R);
    J.elR.rotation.x = -(0.15 + 0.35 * A + 0.9 * R);
    J.body.position.y = Math.abs(c) * (0.6 + 1.2 * R) * A + (1 - A) * breath * 0.12;
    J.torso.rotation.x = 0.05 * A + 0.22 * R;
    J.torso.rotation.y = s * 0.08 * A;
    J.hips.rotation.y = -s * 0.1 * A;
    J.chest.scale.x = 1 + (1 - A) * breath * 0.012;
    J.head.rotation.x = -0.05 * A - 0.12 * R;
    J.head.rotation.y = (1 - A) * Math.sin(t * 0.37 + av.ph) * 0.25;
    if (J.coat) J.coat.rotation.x = -0.08 * A - 0.25 * R;
    if (J.braids) J.braids.forEach((b, i) => { b.rotation.x = 0.12 + 0.25 * A + 0.35 * R + Math.sin(av.ph * 2 + i) * 0.08 * A; b.rotation.z = (i ? 1 : -1) * (0.05 + s * 0.06 * A); });
  }

  // ---------- Modelos .glb (Mixamo) ----------
  let index = null; // nombres de modelo disponibles (escritorio) o null (se prueba a pedirlos)
  const parsed = new Map();
  const desktop = () => Boolean(window.arcane?.models);

  /** Enumera los modelos 3D compatibles disponibles en el proyecto. */
  async function listModels() {
    if (index) return index;
    try {
      index = desktop() ? new Set(await window.arcane.models.list()) : new Set(await fetch('models/index.json').then((r) => (r.ok ? r.json() : [])));
    } catch { index = new Set(); }
    return index;
  }

  /** Lee el archivo tridimensional elegido para el personaje. */
  async function readModel(name) {
    if (desktop()) {
      const buf = await window.arcane.models.read(name);
      if (!buf || buf.kind) return buf;
      return buf.buffer ? buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) : buf;
    }
    const res = await fetch(`models/${name}.glb`);
    return res.ok ? res.arrayBuffer() : null;
  }

  // Imágenes de un modelo .fbx: se buscan por el nombre del archivo, vengan de donde vengan
  // (los .fbx suelen guardar la ruta del ordenador de quien los hizo).
  const MIME = { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp', bmp: 'image/bmp' };
  // Nombre del archivo (sin carpeta y en minúsculas) de una ruta o dirección de textura.
  const baseName = (u) => { let s = String(u); try { s = decodeURIComponent(s); } catch { /* nombre con % suelto */ } return (s.split(/[\\/]/).pop() || '').toLowerCase(); };
  // Nombre comparable de una textura: sin carpeta, sin extensión, sin sufijos «.001» de Blender
  // y sin espacios ni guiones («hair 2.png» y «hair_2.png» son la misma imagen).
  const texKey = (u) => baseName(u).replace(/(\.\d{3})+$/, '').replace(/\.[a-z0-9]{2,4}$/, '').replace(/[^a-z0-9]/g, '');

  /** Convierte las texturas recibidas en direcciones blob: que Three.js puede cargar. */
  function textureURLs(textures) {
    const urls = {};
    for (const [n, b] of Object.entries(textures || {})) {
      const ext = n.split('.').pop().toLowerCase();
      urls[baseName(n)] = URL.createObjectURL(new Blob([b], { type: MIME[ext] || 'application/octet-stream' }));
    }
    return urls;
  }

  /**
   * Busca la textura que pide un modelo aunque el nombre no coincida exactamente: algunos ZIP
   * recortan los nombres («…_BaseCo.png» en vez de «…_BaseColor.png») o cambian los espacios.
   */
  function findTexture(urls, wanted) {
    const exact = urls[baseName(wanted)];
    if (exact) return exact;
    const key = texKey(wanted);
    if (!key) return null;
    let best = null;
    let bestLen = 0;
    for (const [n, url] of Object.entries(urls)) {
      const k = texKey(n);
      if (k === key) return url;
      const shorter = Math.min(k.length, key.length);
      if (shorter >= 10 && (key.startsWith(k) || k.startsWith(key)) && shorter > bestLen) { best = url; bestLen = shorter; }
    }
    return best;
  }

  /** Espera a que el gestor de carga termine de leer todas las texturas (o a un tiempo máximo). */
  function waitTextures(manager, ms = 20000) {
    return new Promise((ok) => {
      let started = false;
      const prevStart = manager.onStart;
      manager.onStart = (...a) => { started = true; prevStart?.(...a); };
      manager.onLoad = () => ok();
      setTimeout(() => { if (!started) ok(); }, 0);
      setTimeout(ok, ms);
    });
  }

  /** Interpreta un modelo en formato FBX y espera a que sus texturas estén cargadas. */
  async function parseFBX(data, textures) {
    const urls = textureURLs(textures);
    const manager = new T.LoadingManager();
    // Una imagen que no está en el ZIP se sustituye por un píxel neutro en lugar de dejar el
    // material negro; después fixMaterials le busca otra textura o un color del personaje.
    manager.setURLModifier((u) => (/^(blob|data):/.test(u) ? u : findTexture(urls, u) || MISSING_PIXEL));
    const buf = data.buffer ? data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength) : data;
    const done = waitTextures(manager);
    const group = new window.THREE_FBX.FBXLoader(manager).parse(buf, '');
    await done;
    return { scene: group, animations: group.animations || [], urls };
  }
  // Píxel de 1×1 que marca una textura que faltaba (se detecta por su tamaño).
  const MISSING_PIXEL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';

  /**
   * Monta un modelo .obj que el juego ya convirtió a binario («malla», ver modelos.js): una
   * pieza por objeto y material para que cada una reciba su textura o su color.
   */
  function parseMesh(data, parts) {
    const buf = data.buffer ? data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength) : data;
    const group = new T.Group();
    for (const p of parts || []) {
      const n = p.vertices;
      const g = new T.BufferGeometry();
      g.setAttribute('position', new T.BufferAttribute(new Float32Array(buf, p.offset, n * 3), 3));
      g.setAttribute('uv', new T.BufferAttribute(new Float32Array(buf, p.offset + n * 12, n * 2), 2));
      if (p.normals) g.setAttribute('normal', new T.BufferAttribute(new Float32Array(buf, p.offset + n * 20, n * 3), 3));
      else g.computeVertexNormals();
      const m = new T.MeshStandardMaterial({ name: p.mtl, color: 0xffffff, roughness: 0.8, metalness: 0 });
      const mesh = new T.Mesh(g, m);
      mesh.name = p.obj;
      group.add(mesh);
    }
    return group;
  }

  // ---------- Materiales a color ----------
  // Palabras que no dicen nada de a qué parte pertenece una textura o un material.
  const STOP = new Set(['low', 'high', 'lod', 'lp', 'hp', 'material', 'mat', 'default', 'mesh', 'object', 'plane', 'cube', 'circle', 'cylinder', 'cone', 'sphere', 'nurbspath', 'path', 'retopo', 'png', 'jpg', 'jpeg',
    'basecolor', 'base', 'color', 'colour', 'col', 'diffuse', 'albedo', 'texture', 'tex', 'map', 'final', 'new', 'copy']);
  // Texturas que no son de color (relieve, rugosidad, brillo…): nunca se usan como color.
  const NOT_COLOR = /(normal|_n$|rough|metal|_ao$|ambient|occlusion|mask|emissive|emission|_e$|spec|_s$|_s@|@channels|height|bump|opacity|alpha|gloss|displace)/i;
  /** Separa un nombre en palabras útiles («ViktorHead_Low_lambert1» → viktor, head). */
  const words = (s) => String(s || '').replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase().split(/[^a-z]+/)
    .filter((w) => w.length >= 3 && !STOP.has(w) && !/^lambert|^blinn|^phong|^sg$/.test(w));

  /** Elige la textura de color más parecida al nombre del material y de la pieza. */
  function guessTexture(urls, names) {
    const want = names.flatMap(words);
    if (!want.length) return null;
    let best = null;
    let bestScore = 0;
    for (const [n, url] of Object.entries(urls)) {
      const stem = n.replace(/\.[^.]+$/, '');
      if (NOT_COLOR.test(stem)) continue;
      const have = words(stem);
      let score = 0;
      for (const w of want) {
        if (have.includes(w)) score += 2;
        else if (w.length >= 4 && have.some((h) => h.startsWith(w) || w.startsWith(h) || h.includes(w))) score += 1;
      }
      if (score > bestScore) { best = url; bestScore = score; }
    }
    return best;
  }

  /** Textura de color general del modelo (cuerpo o vestuario), para piezas sin nombre claro. */
  function mainTexture(urls) {
    for (const [n, url] of Object.entries(urls)) {
      const stem = n.replace(/\.[^.]+$/, '');
      if (!NOT_COLOR.test(stem) && /body|costume|outfit|cloth|main|atlas/i.test(stem)) return url;
    }
    return null;
  }

  // Color de respaldo según la parte del cuerpo, con la paleta del retrato del personaje.
  function fallbackColor(names, spec) {
    const s = names.join(' ').toLowerCase();
    if (/lash|pesta/.test(s)) return 0x1a1418;
    if (/brow|ceja/.test(s)) return shade(spec.hair, 0.8).getHex();
    if (/hair|pelo|braid|trenza|bang|flequillo/.test(s)) return new T.Color(spec.hair).getHex();
    if (/lens|glass|cristal|wet/.test(s)) return 0xbcd6e6;
    if (/eye|ojo|iris|pupil/.test(s)) return 0xf2efe9;
    if (/skin|piel|body|head|face|cara|arm|hand|leg|neck|nail|cuerpo/.test(s)) return new T.Color(spec.skin).getHex();
    if (/pant|lower|shoe|boot|bota|leg|trouser|falda|skirt/.test(s)) return new T.Color(spec.bottom).getHex();
    if (/gun|rifle|metal|arma|weapon|brace|ferro/.test(s)) return 0x6c6a72;
    return new T.Color(spec.top).getHex();
  }

  /**
   * Indica si una textura llegó a cargar una imagen real (no el píxel que marca una que faltaba).
   * @param {THREE.Texture} tex textura del material
   * @returns {boolean} true si tiene una imagen de más de 1 píxel
   */
  const loadedPixel = (tex) => {
    const img = tex?.image;
    return Boolean(img && (img.width || img.naturalWidth) > 1);
  };

  /**
   * Deja todos los materiales del modelo a color y sin piezas negras: quita las texturas que no
   * se pudieron cargar, asigna por nombre las texturas del ZIP que el modelo no enlazaba y, si
   * no hay ninguna, usa un color de respaldo del personaje. No modifica los archivos originales.
   */
  function fixMaterials(model, urls, spec) {
    const loader = new T.TextureLoader();
    const cache = new Map();
    // Carga una textura de color una sola vez aunque la compartan varias piezas del modelo.
    const load = (url) => {
      if (!cache.has(url)) {
        const t = loader.load(url);
        t.colorSpace = T.SRGBColorSpace;
        t.anisotropy = 4;
        cache.set(url, t);
      }
      return cache.get(url);
    };
    const main = mainTexture(urls || {});
    model.traverse((o) => {
      if (!o.isMesh) return;
      o.material = [].concat(o.material).map((m) => {
        if (!m) return m;
        // Las texturas que faltaban (píxel neutro) se retiran para no oscurecer el material.
        for (const k of ['map', 'normalMap', 'bumpMap', 'specularMap', 'emissiveMap', 'alphaMap', 'aoMap', 'roughnessMap', 'metalnessMap', 'lightMap', 'displacementMap']) {
          if (m[k] && !loadedPixel(m[k])) m[k] = null;
        }
        const names = [m.name, o.name, o.parent?.name].filter(Boolean);
        if (!m.map && urls) {
          const hairOrEye = /hair|pelo|eye|ojo|lash|brow|lens|glass/i.test(names.join(' '));
          const url = guessTexture(urls, names) || (!hairOrEye && o.geometry?.attributes?.uv ? main : null);
          if (url) m.map = load(url);
        }
        if (m.map) {
          m.color?.setRGB(1, 1, 1);
          m.map.colorSpace = T.SRGBColorSpace;
        } else if (m.color) {
          // Sin textura: se respeta un color propio del archivo si lo tiene; si es negro, blanco
          // o gris por defecto, se pinta con el color de esa parte del personaje.
          const c = m.color;
          const grey = Math.abs(c.r - c.g) < 0.04 && Math.abs(c.g - c.b) < 0.04;
          if (grey) c.setHex(fallbackColor(names, spec));
        }
        // Los brillos emisivos de exportación (blancos) lavan el color: se apagan si no hay mapa.
        if (m.emissive && !m.emissiveMap && m.emissive.getHex() !== 0) m.emissive.setHex(0);
        if (m.isMeshPhongMaterial && m.shininess > 60) m.shininess = 30;
        if (/lens|glass|cristal/i.test(names.join(' '))) { m.transparent = true; m.opacity = Math.min(m.opacity ?? 1, 0.35); }
        m.needsUpdate = true;
        return m;
      });
      if (o.material.length === 1) o.material = o.material[0];
    });
  }

  /** Interpreta un modelo en formato GLB. */
  function parseGLB(buf, name) {
    return new Promise((ok) => new window.THREE_GLTF.GLTFLoader().parse(buf, '', ok, (err) => { console.warn(`Modelo ${name}:`, err); ok(null); }));
  }

  /** Abre un ZIP de personaje, selecciona el modelo GLB/FBX y vincula las texturas incluidas. */
  function parseZip(data, name) {
    const files = window.THREE_FBX.unzipSync(new Uint8Array(data));
    const entries = Object.keys(files).filter((n) => !/(^|\/)(__MACOSX|\.)/.test(n) && files[n].length);
    const glb = entries.find((n) => /\.glb$/i.test(n));
    if (glb) return parseGLB(files[glb].slice().buffer, name);
    const fbx = entries.filter((n) => /\.fbx$/i.test(n)).sort((a, b) => files[b].length - files[a].length)[0];
    if (!fbx) { console.warn(`Modelo ${name}: el .zip no tiene ningún .fbx ni .glb`); return null; }
    const tex = {};
    for (const n of entries) if (/\.(png|jpe?g|webp|bmp|tga)$/i.test(n)) tex[n] = files[n];
    return parseFBX(files[fbx], tex);
  }

  /** Carga el modelo GLB y sus recursos gráficos. */
  function loadGLB(name) {
    if (parsed.has(name)) return parsed.get(name);
    const p = (async () => {
      const set = await listModels();
      if (!set.has(name) || !window.THREE_GLTF) return null;
      const buf = await readModel(name);
      if (!buf) return null;
      if (buf.kind === 'zip') return parseZip(buf.data, name);
      if (buf.kind === 'fbx') return parseFBX(buf.data, buf.textures || {});
      if (buf.kind === 'malla') return { scene: parseMesh(buf.data, buf.parts), animations: [], urls: textureURLs(buf.textures) };
      if (buf.kind === 'glb') return parseGLB(buf.data.buffer ? buf.data.buffer.slice(buf.data.byteOffset, buf.data.byteOffset + buf.data.byteLength) : buf.data, name);
      return parseGLB(buf, name);
    })().catch((err) => { console.warn(`Modelo ${name}:`, err); return null; });
    parsed.set(name, p);
    return p;
  }

  // Mixamo llama a los huesos «mixamorig:Hips», «mixamorig1:Hips»… Se quitan los prefijos
  // para que las animaciones de un archivo valgan para cualquier personaje.
  const bone = (n) => n.replace(/^mixamorig\d*[:_]?/i, '');
  /** Prepara una animación para evitar movimientos incompatibles. */
  function cleanClip(clip) {
    const c = clip.clone();
    c.tracks = c.tracks.filter((tr) => !/\.scale$/.test(tr.name) || !/hips/i.test(tr.name));
    for (const tr of c.tracks) {
      const i = tr.name.lastIndexOf('.');
      tr.name = `${bone(tr.name.slice(0, i))}${tr.name.slice(i)}`;
      // Sin desplazamiento: el juego mueve al personaje, la animación solo mueve el cuerpo.
      if (/hips\.position$/i.test(tr.name)) {
        const v = tr.values;
        for (let k = 3; k < v.length; k += 3) { v[k] = v[0]; v[k + 2] = v[2]; }
      }
    }
    return c;
  }

  const CLIPS = { idle: /idle|reposo|quiet|breath|stand/i, walk: /walk|andar|caminar/i, run: /run|correr|sprint|jog/i };
  /** Obtiene animaciones reutilizables de movimiento. */
  async function sharedClips() {
    const out = {};
    for (const [k, files] of Object.entries({ idle: ['reposo', 'idle'], walk: ['andar', 'walk'], run: ['correr', 'run'] })) {
      for (const f of files) {
        const g = await loadGLB(`animaciones/${f}`);
        if (g?.animations?.length) { out[k] = g.animations[0]; break; }
      }
    }
    return out;
  }

  /**
   * Tamaño del cuerpo de un modelo sin contar las piezas planas (una aerotabla, una alfombra o
   * una base), que harían parecer ancho a un personaje de pie.
   * @param {THREE.Object3D} model modelo ya leído
   * @returns {THREE.Vector3} ancho (x), alto (y) y fondo (z)
   */
  function bodySize(model) {
    const total = new T.Box3();
    const part = new T.Box3();
    const s = new T.Vector3();
    model.updateMatrixWorld(true);
    model.traverse((o) => {
      if (!o.isMesh) return;
      part.setFromObject(o).getSize(s);
      if (s.y < 0.2 * Math.max(s.x, s.z)) return; // pieza plana
      total.union(part);
    });
    return total.isEmpty() ? new T.Box3().setFromObject(model).getSize(new T.Vector3()) : total.getSize(new T.Vector3());
  }

  /** Construye un avatar a partir de un modelo externo. */
  async function buildGLB(names, scale, spec) {
    let gltf = null;
    for (const n of names) { gltf = await loadGLB(n); if (gltf) break; }
    if (!gltf) return null;
    // Los materiales se corrigen una sola vez sobre el modelo leído; los clones los comparten.
    if (!gltf.fixed) { fixMaterials(gltf.scene, gltf.urls, spec); gltf.fixed = true; }
    const model = window.THREE_GLTF.SkeletonUtils.clone(gltf.scene);
    let rigged = false;
    model.traverse((o) => {
      o.name = bone(o.name);
      if (o.isBone && /^hips$/i.test(o.name)) rigged = true;
      if (o.isMesh) {
        o.castShadow = true;
        o.frustumCulled = false;
        // Los .fbx traen a veces materiales negros o transparentes sin querer.
        for (const m of [].concat(o.material)) {
          if (!m) continue;
          // Mantener la textura original en color: el tinte del FBX puede oscurecerla.
          if (m.map) { m.color?.setRGB(1, 1, 1); m.map.colorSpace = T.SRGBColorSpace; if (m.map.image) m.map.needsUpdate = true; }
          if (m.opacity === 0) m.opacity = 1;
          if (m.transparent && m.opacity >= 1 && m.alphaTest === 0) m.transparent = false;
          // Los modelos siguen recibiendo luz y sombras sin quedar negros por el material importado.
          m.side = T.DoubleSide;
          m.needsUpdate = true;
        }
      }
    });
    const box = new T.Box3().setFromObject(model);
    const size = box.getSize(new T.Vector3());
    // Un busto (solo cabeza y torso, más ancho que alto en proporción) no se estira hasta la
    // altura de una persona: se coloca sobre un pedestal, como una escultura del personaje.
    const body = bodySize(model);
    const bust = body.y > 0 && body.y / Math.max(body.x, body.z, 1e-6) < 1.3;
    const plinth = bust ? H * scale * 0.55 : 0;
    const k = size.y > 0 ? (H * scale * (bust ? 0.45 : 1)) / size.y : 1;
    model.scale.multiplyScalar(k);
    model.position.y += plinth - box.min.y * k;
    // Se centra en horizontal para que gire sobre sí mismo al mirar al jugador.
    model.position.x -= ((box.min.x + box.max.x) / 2) * k;
    model.position.z -= ((box.min.z + box.max.z) / 2) * k;
    const root = new T.Group();
    root.add(model);
    if (bust) {
      const stone = new T.MeshStandardMaterial({ color: 0x8a8174, map: brushTex(), roughness: 0.9 });
      const r0 = Math.max(size.x, size.z) * k * 0.32;
      const base = mesh(new T.CylinderGeometry(r0, r0 * 1.15, plinth, 20).translate(0, plinth / 2, 0), stone);
      base.receiveShadow = true;
      root.add(base);
    }
    const mixer = new T.AnimationMixer(model);
    const own = {};
    for (const clip of gltf.animations || []) for (const [k2, re] of Object.entries(CLIPS)) if (!own[k2] && re.test(clip.name)) own[k2] = clip;
    if (!own.idle && !own.walk && gltf.animations?.length) own.idle = gltf.animations[0];
    // Las animaciones compartidas de Mixamo solo sirven si el modelo tiene sus huesos.
    const shared = rigged ? await sharedClips() : {};
    const actions = {};
    for (const k2 of Object.keys(CLIPS)) {
      const clip = own[k2] || shared[k2];
      if (!clip) continue;
      const a = mixer.clipAction(cleanClip(clip));
      a.play();
      a.setEffectiveWeight(k2 === 'idle' ? 1 : 0);
      actions[k2] = a;
    }
    if (!actions.walk && actions.run) actions.walk = actions.run;
    // Sin animaciones (modelo quieto, sin huesos): se mueve entero con un balanceo al andar.
    return { root, model, mixer, actions, kind: Object.keys(actions).length ? 'glb' : 'static' };
  }

  /** Actualiza la animación de un avatar GLB en cada fotograma. */
  function animateGLB(av, dt, speed) {
    const A = av.actions;
    // Solo trae una animación de estar quieto: se usa siempre y al andar se balancea entero.
    if (!A.walk && !A.run) {
      A.idle?.setEffectiveWeight(1);
      av.mixer.update(dt);
      return animateStatic(av, dt, speed);
    }
    const amp = Math.min(1, speed / 110);
    const run = Math.max(0, Math.min(1, (speed - 260) / 120));
    av.amp = (av.amp ?? 0) + (amp - (av.amp ?? 0)) * Math.min(1, dt * 8);
    av.run = (av.run ?? 0) + (run - (av.run ?? 0)) * Math.min(1, dt * 6);
    const hasRun = Boolean(A.run && A.run !== A.walk);
    A.idle?.setEffectiveWeight(1 - av.amp);
    A.walk?.setEffectiveWeight(A.idle ? av.amp * (hasRun ? 1 - av.run : 1) : 1);
    if (hasRun) A.run.setEffectiveWeight(av.amp * av.run);
    if (A.walk) A.walk.timeScale = Math.max(0.6, Math.min(1.5, speed / WALK));
    if (hasRun) A.run.timeScale = Math.max(0.8, Math.min(1.3, speed / (WALK * 1.7)));
    if (!A.idle && A.walk && av.amp < 0.05) A.walk.timeScale = 0; // sin animación de reposo: se queda quieto
    av.mixer.update(dt);
  }

  /** Añade movimiento básico a modelos sin animación esquelética. */
  function animateStatic(av, dt, speed) {
    const amp = Math.min(1, speed / 110);
    av.amp = (av.amp ?? 0) + (amp - (av.amp ?? 0)) * Math.min(1, dt * 8);
    av.ph = ((av.ph || 0) + dt * (speed / (34 * DOLL)) * Math.PI) % (Math.PI * 2);
    const A = av.amp;
    av.model.position.y = av.base ?? (av.base = av.model.position.y);
    av.model.position.y += Math.abs(Math.sin(av.ph)) * 2.2 * A;
    av.model.rotation.z = Math.sin(av.ph) * 0.06 * A;
    av.model.rotation.x = 0.1 * A;
  }

  // ---------- Interfaz ----------
  // Crea un personaje. El jugador empieza con el muñeco y, si hay modelo .glb, lo cambia en
  // cuanto carga. Los personajes de Arcane solo aparecen con su propio modelo 3D: sin muñeco
  // provisional ni modelo genérico (hasta que carga, el hueco queda vacío).
  function create({ id, player }) {
    const spec = specFor(id, player);
    const holder = new T.Group();
    const av = { holder, yaw: 0, ...(player ? buildDoll(spec) : {}) };
    if (av.root) holder.add(av.root);
    // En el móvil solo el jugador proyecta sombra (ahorra mucho trabajo a la gráfica).
    const shadows = !(window.U?.touch && !player);
    if (!shadows) holder.traverse((o) => { o.castShadow = false; });
    buildGLB(player ? ['jugador', 'generico'] : [id], spec.build.scale || 1, spec).then((g) => {
      if (!g || av.disposed) return;
      if (av.root) holder.remove(av.root);
      Object.assign(av, g, { J: null });
      if (!shadows) g.root.traverse((o) => { o.castShadow = false; });
      holder.add(g.root);
    }).catch(() => {});
    return av;
  }

  // speed en unidades por segundo; yaw hacia donde mira (0 = +z del mapa).
  /** Orienta al personaje y aplica la animación normal o una pose estática de exposición. */
  function update(av, dt, speed, yaw, t, staticNpc = false) {
    let d = yaw - av.yaw;
    d = Math.atan2(Math.sin(d), Math.cos(d));
    av.yaw += d * Math.min(1, dt * 10);
    av.holder.rotation.y = av.yaw;
    if (!av.root) return; // su modelo aún se está cargando
    // Los modelos externos de NPC se muestran con su pose y colores originales.
    // No avanzamos el AnimationMixer ni balanceamos el cuerpo en modo estático.
    if (staticNpc && (av.kind === 'glb' || av.kind === 'static')) return;
    if (av.kind === 'glb') animateGLB(av, dt, speed);
    else if (av.kind === 'static') animateStatic(av, dt, speed);
    else animateDoll(av, dt, speed, t);
  }

  /** Libera recursos del avatar al salir del escenario. */
  function dispose(av) {
    av.disposed = true;
    av.holder.parent?.remove(av.holder);
    av.holder.traverse((o) => { if (o.isMesh) { o.geometry.dispose(); [].concat(o.material).forEach((m) => m.dispose()); } });
  }

  // Altura de la cabeza (para poner el nombre encima).
  function heightOf(id) {
    return H * (BUILD[id]?.scale || 1);
  }

  // Olvida los modelos leídos (después de añadir archivos a la carpeta).
  function reload() { index = null; parsed.clear(); }

  window.Avatars3D = { create, update, dispose, heightOf, reload, listModels };
})();
