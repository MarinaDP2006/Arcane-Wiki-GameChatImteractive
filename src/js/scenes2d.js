// Escenarios 2D de Piltover y Zaun con los fotogramas de Arcane como fondo.
// El lugar se explora desplazando la vista (arrastrar, A/D, flechas o rueda) por la imagen
// ampliada; encima van niebla, luz y polvo animados para que la escena respire.
// La pista y el objetivo son puntos de luz sobre la imagen: se pulsan (o E cuando están a la vista).
(function () {
  let active = null;
  const reduce = () => Boolean(window.App?.settings?.reduceMotion);

  /** Partículas (polvo dorado en Piltover, esporas y humo en Zaun) sobre un lienzo. */
  function particles(canvas, city) {
    const g = canvas.getContext('2d');
    const zaun = city === 'zaun';
    const n = reduce() ? 0 : zaun ? 70 : 55;
    const dots = Array.from({ length: n }, () => ({ x: Math.random(), y: Math.random(), r: 0.6 + Math.random() * 2.2, v: 0.004 + Math.random() * 0.012, p: Math.random() * 6 }));
    const fog = Array.from({ length: reduce() ? 0 : 6 }, (_, i) => ({ x: Math.random(), y: 0.55 + Math.random() * 0.45, r: 0.25 + Math.random() * 0.3, v: (i % 2 ? 1 : -1) * (0.004 + Math.random() * 0.006) }));
    return (t, dt) => {
      const w = canvas.width = canvas.clientWidth * (window.devicePixelRatio || 1);
      const h = canvas.height = canvas.clientHeight * (window.devicePixelRatio || 1);
      g.clearRect(0, 0, w, h);
      for (const f of fog) {
        f.x = (f.x + f.v * dt + 1.6) % 1.6 - 0.3;
        const grd = g.createRadialGradient(f.x * w, f.y * h, 0, f.x * w, f.y * h, f.r * w);
        grd.addColorStop(0, zaun ? 'rgba(90,140,110,0.16)' : 'rgba(255,236,200,0.10)');
        grd.addColorStop(1, 'rgba(0,0,0,0)');
        g.fillStyle = grd; g.fillRect(0, 0, w, h);
      }
      g.globalCompositeOperation = 'lighter';
      for (const d of dots) {
        d.y -= d.v * dt; if (d.y < -0.05) { d.y = 1.05; d.x = Math.random(); }
        const x = (d.x + Math.sin(t * 0.4 + d.p) * 0.01) * w, y = d.y * h;
        const a = 0.35 + 0.35 * Math.sin(t * 1.3 + d.p);
        g.fillStyle = zaun ? `rgba(150,240,140,${a})` : `rgba(255,220,150,${a})`;
        g.beginPath(); g.arc(x, y, d.r * (window.devicePixelRatio || 1), 0, 7); g.fill();
      }
      g.globalCompositeOperation = 'source-over';
    };
  }

  /** Cierra la escena y devuelve el control al mapa. */
  function close() {
    if (!active) return;
    const s = active; active = null;
    cancelAnimationFrame(s.raf);
    window.removeEventListener('keydown', s.keydown);
    window.removeEventListener('keyup', s.keyup);
    s.root.remove();
    s.onExit?.();
  }

  /**
   * Abre un escenario 2D.
   * cfg: { city:'zaun'|'piltover', title, desc, image, clue:{x,y,text}, goal:{x,y}, focus?, skipClue? }
   * Las coordenadas x, y van de 0 a 1 sobre la imagen. Devuelve false si falta la imagen.
   */
  function open(cfg, onGoal, onExit) {
    if (!cfg?.image) return false;
    if (active) close();
    const city = cfg.city;
    const root = document.createElement('div');
    root.className = `scene2d scene2d-${city}`;
    const stage = document.createElement('div'); stage.className = 'scene2d-stage';
    const img = document.createElement('img'); img.className = 'scene2d-img'; img.alt = cfg.title; img.draggable = false; img.src = cfg.image;
    stage.append(img);
    const spots = {};
    for (const kind of ['clue', 'goal']) {
      const b = document.createElement('button');
      b.className = `scene2d-spot scene2d-${kind}`;
      b.setAttribute('aria-label', kind === 'clue' ? 'Investigar la pista' : 'Activar el objetivo');
      b.innerHTML = '<span></span>';
      b.style.left = cfg[kind].x * 100 + '%'; b.style.top = cfg[kind].y * 100 + '%';
      b.hidden = kind === 'goal' ? !cfg.skipClue : Boolean(cfg.skipClue);
      b.onclick = (e) => { e.stopPropagation(); act(kind); };
      stage.append(b); spots[kind] = b;
    }
    const fx = document.createElement('canvas'); fx.className = 'scene2d-fx';
    const shade = document.createElement('div'); shade.className = 'scene2d-shade';
    const hud = document.createElement('div'); hud.className = `${city}-interior-hud scene2d-hud`;
    const title = document.createElement('h2'); title.textContent = cfg.title;
    const hint = document.createElement('p'); hint.textContent = (cfg.desc ? cfg.desc + ' · ' : '') + 'Arrastra, A/D o flechas para mirar · pulsa las luces o E · Esc para salir';
    const status = document.createElement('p'); status.className = `${city}-interior-objective`;
    const exit = document.createElement('button'); exit.className = 'btn'; exit.textContent = city === 'zaun' ? 'Salir al mapa' : 'Volver al mapa'; exit.onclick = close;
    hud.append(title, hint, status, exit);
    const card = document.createElement('div'); card.className = 'scene2d-card'; card.hidden = true;
    const arrowL = document.createElement('div'); arrowL.className = 'scene2d-arrow scene2d-arrow-l'; arrowL.textContent = '‹';
    const arrowR = document.createElement('div'); arrowR.className = 'scene2d-arrow scene2d-arrow-r'; arrowR.textContent = '›';
    root.append(stage, fx, shade, arrowL, arrowR, hud, card);
    document.body.append(root);

    // Vista: la imagen cubre la pantalla con un margen de zoom para poder recorrerla.
    const view = { x: cfg.focus ?? 0.5, y: 0.5, vx: 0, zoom: 1.18 };
    let size = { w: 0, h: 0, sx: 0, sy: 0 };
    let inspected = Boolean(cfg.skipClue), done = false;
    const keys = new Set();
    function layout() {
      const W = root.clientWidth, H = root.clientHeight;
      const ar = (img.naturalWidth || 16) / (img.naturalHeight || 9);
      let h = H * view.zoom, w = h * ar;
      if (w < W * view.zoom) { w = W * view.zoom; h = w / ar; }
      size = { w, h, sx: Math.max(0, w - W), sy: Math.max(0, h - H) };
      stage.style.width = w + 'px'; stage.style.height = h + 'px';
    }
    img.onload = layout;
    img.onerror = () => { status.textContent = 'No se ha podido cargar la imagen del lugar.'; };
    function place() {
      view.x = Math.min(1, Math.max(0, view.x)); view.y = Math.min(1, Math.max(0, view.y));
      stage.style.transform = `translate(${-view.x * size.sx}px, ${-view.y * size.sy}px)`;
      arrowL.classList.toggle('on', view.x > 0.02); arrowR.classList.toggle('on', view.x < 0.98);
    }
    /** ¿Está el punto en pantalla (con margen)? */
    function visible(kind) {
      const r = spots[kind].getBoundingClientRect(), W = root.clientWidth, H = root.clientHeight;
      return !spots[kind].hidden && r.left > W * 0.06 && r.right < W * 0.94 && r.top > H * 0.12 && r.bottom < H * 0.96;
    }
    function say(text) {
      card.textContent = text; card.hidden = false;
      clearTimeout(card.t); card.t = setTimeout(() => { card.hidden = true; }, 6000);
    }
    function act(kind) {
      if (kind === 'clue' && !inspected) {
        inspected = true; spots.clue.hidden = true; spots.goal.hidden = false;
        say(cfg.clue.text);
        return true;
      }
      if (kind === 'goal' && inspected && !done) {
        done = true; const go = onGoal; close(); go?.(); return true;
      }
      return false;
    }
    const keydown = (e) => {
      if (active !== session || e.target?.matches?.('input,textarea,select')) return;
      const k = e.key.toLowerCase();
      if (['a', 'd', 'w', 's', 'arrowleft', 'arrowright', 'arrowup', 'arrowdown', 'e', 'escape', 'enter'].includes(k)) e.preventDefault();
      if (k === 'escape') { close(); return; }
      if (k === 'e' || k === 'enter') {
        const kind = inspected ? 'goal' : 'clue';
        if (visible(kind)) act(kind);
        else status.textContent = inspected ? 'Mira alrededor: la luz del objetivo no está a la vista.' : 'Mira alrededor: la pista no está a la vista.';
        return;
      }
      keys.add(k);
    };
    const keyup = (e) => keys.delete(e.key.toLowerCase());
    window.addEventListener('keydown', keydown);
    window.addEventListener('keyup', keyup);
    // Arrastrar con ratón o dedo; la rueda desplaza en horizontal.
    let drag = null;
    root.addEventListener('pointerdown', (e) => { if (e.target.closest('button')) return; drag = { x: e.clientX, y: e.clientY, vx: view.x, vy: view.y }; root.setPointerCapture?.(e.pointerId); });
    root.addEventListener('pointermove', (e) => {
      if (!drag) return;
      view.x = drag.vx - (e.clientX - drag.x) / Math.max(1, size.sx);
      view.y = drag.vy - (e.clientY - drag.y) / Math.max(1, size.sy);
    });
    root.addEventListener('pointerup', () => { drag = null; });
    root.addEventListener('pointercancel', () => { drag = null; });
    root.addEventListener('wheel', (e) => { view.x += (e.deltaY + e.deltaX) / Math.max(400, size.sx * 2); e.preventDefault(); }, { passive: false });
    window.addEventListener('resize', layout);

    const drawFx = particles(fx, city);
    const session = { root, keydown, keyup, onExit, raf: 0 };
    active = session;
    let last = 0;
    function frame(now) {
      if (active !== session) { window.removeEventListener('resize', layout); return; }
      const t = now / 1000, dt = Math.min(0.05, (now - (last || now)) / 1000); last = now;
      const dx = Number(keys.has('d') || keys.has('arrowright')) - Number(keys.has('a') || keys.has('arrowleft'));
      const dy = Number(keys.has('s') || keys.has('arrowdown')) - Number(keys.has('w') || keys.has('arrowup'));
      view.x += dx * dt * 0.45; view.y += dy * dt * 0.6;
      if (!size.w) layout();
      place();
      // Respiración de cámara muy suave, como un plano de la serie.
      if (!reduce()) img.style.transform = `scale(${1 + Math.sin(t * 0.15) * 0.008}) translate(${Math.sin(t * 0.11) * 3}px, ${Math.cos(t * 0.13) * 2}px)`;
      drawFx(t, dt);
      const target = inspected ? 'goal' : 'clue';
      status.textContent = visible(target)
        ? (inspected ? 'Pulsa la luz del objetivo (o E) para continuar la historia.' : 'Ahí hay algo: pulsa la pista azul (o E) para investigar.')
        : (inspected ? 'Pista encontrada. Busca la luz del objetivo por el lugar.' : 'Explora el lugar y busca la pista azul.');
      session.raf = requestAnimationFrame(frame);
    }
    session.raf = requestAnimationFrame(frame);
    return true;
  }

  // Cada lugar del mapa con su fotograma de Arcane (src/img/arte), la posición de la pista y
  // del objetivo (0..1 sobre la imagen) y lo que se descubre al investigar.
  const A = 'img/arte/';
  const PLACES = {
    // Zaun
    callejones: ['zaun', A + 'lugares/zaun.webp', [0.62, 0.78], [0.2, 0.62], 'Pasarelas suspendidas, talleres apiñados y luz química en las profundidades.', 'Has encontrado las señales de una ruta de contrabando entre las pasarelas.'],
    mercado: ['zaun', A + 'lugares/comuna-viktor.webp', [0.42, 0.8], [0.86, 0.6], 'Puestos colgados de las tuberías y regateo a gritos.', 'Un puesto vende piezas marcadas con el sello de una fábrica de Brillo.'],
    tejados: ['zaun', A + 'lugares/zaun.webp', [0.3, 0.55], [0.8, 0.4], 'Chimeneas, humo y la luz de Piltover allá arriba.', 'Unas marcas de tiza señalan un camino seguro entre las chimeneas.'],
    'puente-zaun': ['zaun', A + 'lugares/zaun.webp', [0.2, 0.8], [0.6, 0.45], 'El paso entre las dos ciudades, visto desde abajo.', 'Un sello desgastado en una caseta indica quién controlaba el paso.'],
    arbol: ['zaun', A + 'lugares/arbol.png', [0.12, 0.7], [0.88, 0.62], 'Un refugio vivo, construido sobre las ramas y lejos del Brillo.', 'Descubres el sistema de cuerdas que protege el refugio de las Luciérnagas.'],
    fabrica: ['zaun', A + 'lugares/zaun.webp', [0.7, 0.75], [0.25, 0.5], 'Turbinas, puentes y neones en el corazón industrial.', 'La consola principal controla las máquinas y las pasarelas de la torre.'],
    foso: ['zaun', A + 'lugares/zaun.webp', [0.55, 0.85], [0.15, 0.6], 'Gritos, apuestas y sangre en la arena.', 'En la libreta del corredor de apuestas aparece un nombre que conoces.'],
    'escondite-jinx': ['zaun', A + 'lugares/zaun.webp', [0.85, 0.7], [0.4, 0.45], 'Juguetes rotos, pintura y pólvora.', 'Un dibujo infantil pegado a la pared esconde un mapa de los conductos.'],
    'ultima-gota': ['zaun', A + 'lugares/ultima-gota.webp', [0.18, 0.78], [0.5, 0.42], 'El local de Vander: hierro oxidado, barra iluminada y puertas de acero.', 'En el libro de cuentas de la barra hay una entrega marcada con tinta roja.'],
    'tienda-benzo': ['zaun', A + 'lugares/tienda-benzo.png', [0.15, 0.6], [0.82, 0.35], 'Chatarra, piezas y favores que nunca se apuntan.', 'Bajo el mostrador de Benzo hay una caja con piezas hextec robadas.'],
    sumidero: ['zaun', A + 'lugares/fabrica.png', [0.78, 0.25], [0.45, 0.45], 'La química de Singed, entre frascos verdes y reactores violetas.', 'Un registro del laboratorio revela experimentos y muestras de Brillo.'],
    invernadero: ['zaun', A + 'lugares/comuna-viktor.webp', [0.2, 0.75], [0.52, 0.28], 'Vidrio, conductos de quimtec y vegetación creciendo en las ruinas.', 'Los conductos del invernadero mezclan aire limpio y quimtec reciclada.'],
    // Piltover
    consejo: ['piltover', A + 'lugares/consejo.webp', [0.7, 0.8], [0.45, 0.45], 'Mármol, bronce y decisiones que pesan sobre las dos ciudades.', 'La documentación del Consejo contiene nombres que faltan en el acta.'],
    academia: ['piltover', A + 'lugares/academia.webp', [0.25, 0.82], [0.75, 0.5], 'Aulas, archivos y el prestigio de la ciencia de Piltover.', 'Un registro de prácticas revela quién utilizó el taller.'],
    'taller-jayce': ['piltover', A + 'lugares/taller-jayce.webp', [0.2, 0.7], [0.55, 0.3], 'Pizarras, prototipos y cristales hextec.', 'En la pizarra encuentras una ecuación hextec corregida a mano.'],
    artesanos: ['piltover', A + 'lugares/taller-jayce.webp', [0.3, 0.85], [0.6, 0.55], 'Talleres de relojeros y orfebres bajo los arcos.', 'Un relojero guarda el encargo de alguien que no quiere ser visto.'],
    hexpuertas: ['piltover', A + 'lugares/hexpuertas.webp', [0.3, 0.82], [0.5, 0.42], 'La torre de las Hexpuertas y los dirigibles entre las nubes.', 'Un registro del tráfico aéreo muestra una ruta que no figura en los permisos.'],
    plaza: ['piltover', A + 'lugares/piltover.webp', [0.75, 0.82], [0.55, 0.5], 'Fuentes, estatuas y el Día del Progreso.', 'Un cartel arrancado anunciaba una reunión que nadie autorizó.'],
    'muelle-stillwater': ['piltover', A + 'lugares/stillwater.webp', [0.2, 0.8], [0.48, 0.3], 'La prisión sobre el agua, de noche.', 'Una orden de traslado está firmada por alguien que no debería estar aquí.'],
    ejecutores: ['piltover', A + 'lugares/ejecutores.png', [0.2, 0.75], [0.6, 0.45], 'Uniformes azules, expedientes y celdas.', 'Un expediente tiene páginas arrancadas justo donde empieza tu caso.'],
    puente: ['piltover', A + 'lugares/piltover.webp', [0.25, 0.8], [0.62, 0.45], 'El Puente del Progreso, entre el oro y la niebla.', 'Un sello desgastado en una caseta indica quién controlaba el paso.'],
    'mansion-kiramman': ['piltover', A + 'lugares/mansion-kiramman.png', [0.8, 0.75], [0.35, 0.4], 'Jardines, retratos y secretos de familia.', 'Una carta sin enviar habla de un trato con el Consejo.'],
  };
  /**
   * Imagen del lugar para la temporada que se está jugando (lugares/s1 o lugares/s2, que vienen
   * de arcaneData/arte/mapa/<ciudad>/<temporada>). En T2 nunca se usa una imagen de T1: si falta,
   * se entra directamente a las acciones del lugar.
   */
  function imageFor(id, fallback) {
    const A = window.CustomArt;
    if (!A) return fallback;
    const season = A.season();
    const own = A.files[`lugares/${season}`]?.[id] || window.ART_BUNDLED?.[`lugares/${season}`]?.[id];
    if (own) return own;
    return season === 's2' ? null : fallback;
  }
  /** ¿Tiene este lugar escenario 2D? */
  function has(id) { return Boolean(PLACES[id]); }
  /** Abre el escenario 2D de un lugar del mapa; skipClue si ya se investigó. */
  function enterPlace(loc, skipClue, onGoal, onExit) {
    const p = PLACES[loc.id];
    if (!p) return false;
    return open({ city: p[0], title: loc.name, desc: p[4], image: imageFor(loc.id, p[1]), clue: { x: p[2][0], y: p[2][1], text: p[5] },
      goal: { x: p[3][0], y: p[3][1] }, focus: (skipClue ? p[3] : p[2])[0], skipClue }, onGoal, onExit);
  }

  window.Scenes2D = { open, close, has, enterPlace, imageFor, PLACES };
})();
