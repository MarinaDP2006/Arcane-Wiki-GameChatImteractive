// Escenarios 2D originales para Aurelia y Nácar. El lugar se explora desplazando la vista
// por ilustraciones propias; encima van niebla, luz y polvo animados para dar profundidad.
// La pista y el objetivo son puntos de luz sobre la imagen: se pulsan (o E cuando están a la vista).
(function () {
  let active = null;
  const reduce = () => Boolean(window.App?.settings?.reduceMotion);

  /** Partículas (polvo dorado en Aurelia, esporas y vapor en Nácar) sobre un lienzo. */
  function particles(canvas, city) {
    const g = canvas.getContext('2d');
    const zaun = city === 'zaun';
    const n = reduce() ? 0 : zaun ? 70 : 55;
    const dots = Array.from({ length: n }, () => ({ x: Math.random(), y: Math.random(), r: 0.6 + Math.random() * 2.2, v: 0.004 + Math.random() * 0.012, p: Math.random() * 6 }));
    const fog = Array.from({ length: reduce() ? 0 : 6 }, (_, i) => ({ x: Math.random(), y: 0.55 + Math.random() * 0.45, r: 0.25 + Math.random() * 0.3, v: (i % 2 ? 1 : -1) * (0.004 + Math.random() * 0.006) }));
    return (t, dt) => {
      // A resize invalidates Canvas state and its backing buffer: only do it when needed.
      const dpr = Math.min(1.5, window.devicePixelRatio || 1);
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width !== w) canvas.width = w;
      if (canvas.height !== h) canvas.height = h;
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
        g.beginPath(); g.arc(x, y, d.r * dpr, 0, 7); g.fill();
      }
      g.globalCompositeOperation = 'source-over';
    };
  }

  /** Cierra la escena y devuelve el control al mapa. */
  function close() {
    if (!active) return;
    const s = active; active = null;
    cancelAnimationFrame(s.raf);
    window.removeEventListener('resize', s.layout);
    s.root._blurController?.abort();
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
    const hint = document.createElement('p'); hint.textContent = (cfg.desc ? cfg.desc + ' · ' : '') + (matchMedia('(pointer: coarse)').matches ? 'Desliza o usa las flechas para mirar · pulsa ✦ o toca las luces' : 'Arrastra, A/D o flechas para mirar · pulsa las luces o E · Esc para salir');
    const status = document.createElement('p'); status.className = `${city}-interior-objective`;
    const exit = document.createElement('button'); exit.className = 'btn'; exit.textContent = city === 'zaun' ? 'Salir al mapa' : 'Volver al mapa'; exit.onclick = close;
    hud.append(title, hint, status, exit);
    const card = document.createElement('div'); card.className = 'scene2d-card'; card.hidden = true;
    const arrowL = document.createElement('div'); arrowL.className = 'scene2d-arrow scene2d-arrow-l'; arrowL.textContent = '‹';
    const arrowR = document.createElement('div'); arrowR.className = 'scene2d-arrow scene2d-arrow-r'; arrowR.textContent = '›';
    // Botones táctiles: mover la cámara y activar la pista sin teclado.
    const touchBar = document.createElement('div');
    touchBar.className = 'scene2d-touch-controls';
    const touchButtons = [
      ['◀', 'Mirar a la izquierda', 'arrowleft'],
      ['▶', 'Mirar a la derecha', 'arrowright'],
      ['▲', 'Mirar arriba', 'arrowup'],
      ['▼', 'Mirar abajo', 'arrowdown'],
      ['✦', 'Investigar o continuar', 'interact'],
    ];
    root.append(stage, fx, shade, arrowL, arrowR, hud, card, touchBar);
    document.body.append(root);

    // Vista: la imagen cubre la pantalla con un margen de zoom para poder recorrerla.
    const view = { x: cfg.focus ?? 0.5, y: 0.5, vx: 0, zoom: 1.18 };
    let size = { w: 0, h: 0, sx: 0, sy: 0 };
    let inspected = Boolean(cfg.skipClue), done = false;
    const keys = new Set();
    for (const [label, name, key] of touchButtons) {
      const button = document.createElement('button');
      button.type = 'button'; button.className = 'scene2d-touch-btn';
      button.textContent = label; button.setAttribute('aria-label', name);
      if (key === 'interact') {
        button.addEventListener('click', (e) => { e.stopPropagation(); const kind = inspected ? 'goal' : 'clue'; if (visible(kind)) act(kind); else status.textContent = 'Mueve la vista hasta encontrar la luz.'; });
      } else {
        const release = (e) => { keys.delete(key); button.classList.remove('pressed'); if (e?.pointerId != null && button.hasPointerCapture?.(e.pointerId)) button.releasePointerCapture(e.pointerId); };
        button.addEventListener('pointerdown', (e) => { e.preventDefault(); e.stopPropagation(); button.setPointerCapture?.(e.pointerId); keys.add(key); button.classList.add('pressed'); });
        button.addEventListener('pointerup', release);
        button.addEventListener('pointercancel', release);
        button.addEventListener('lostpointercapture', () => { keys.delete(key); button.classList.remove('pressed'); });
      }
      touchBar.append(button);
    }
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
    root.addEventListener('pointerdown', (e) => { if (e.target.closest('button')) return; drag = { id: e.pointerId, x: e.clientX, y: e.clientY, vx: view.x, vy: view.y }; root.setPointerCapture?.(e.pointerId); });
    root.addEventListener('pointermove', (e) => {
      if (!drag || drag.id !== e.pointerId) return;
      view.x = drag.vx - (e.clientX - drag.x) / Math.max(1, size.sx);
      view.y = drag.vy - (e.clientY - drag.y) / Math.max(1, size.sy);
    });
    root.addEventListener('pointerup', (e) => { if (drag?.id === e.pointerId) drag = null; });
    root.addEventListener('pointercancel', (e) => { if (drag?.id === e.pointerId) drag = null; });
    window.addEventListener('blur', () => keys.clear(), { signal: (() => { const c = new AbortController(); root._blurController = c; return c.signal; })() });
    root.addEventListener('wheel', (e) => { view.x += (e.deltaY + e.deltaX) / Math.max(400, size.sx * 2); e.preventDefault(); }, { passive: false });
    window.addEventListener('resize', layout);

    const drawFx = particles(fx, city);
    const session = { root, keydown, keyup, layout, onExit, raf: 0 };
    active = session;
    let last = 0;
    function frame(now) {
      if (active !== session) return;
      // Avoid expensive drawing and DOM work while the application is in the background.
      if (document.hidden) { last = now; session.raf = requestAnimationFrame(frame); return; }
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
      const nextStatus = visible(target)
        ? (inspected ? 'Pulsa la luz del objetivo (o E) para continuar la historia.' : 'Ahí hay algo: pulsa la pista azul (o E) para investigar.')
        : (inspected ? 'Pista encontrada. Busca la luz del objetivo por el lugar.' : 'Explora el lugar y busca la pista azul.');
      if (status.textContent !== nextStatus) status.textContent = nextStatus;
      session.raf = requestAnimationFrame(frame);
    }
    session.raf = requestAnimationFrame(frame);
    return true;
  }

  // Cada lugar original con su ilustración vectorial, la posición de la pista y
  // del objetivo (0..1 sobre la imagen) y lo que se descubre al investigar.
  const A = 'img/arte/';
  const PLACES = {
    archivo: ['piltover', A + 'lugares/aurelia.svg', [0.28, 0.62], [0.78, 0.42], 'El Archivo de Frecuencias conserva los registros públicos y los huecos que alguien dejó en ellos.', 'Un patrón de tres pulsos aparece en una copia que no figura en el catálogo.'],
    observatorio: ['piltover', A + 'lugares/aurelia.svg', [0.62, 0.28], [0.42, 0.68], 'Las terrazas del observatorio permiten medir la vibración de la meseta.', 'Un medidor auxiliar registra un desfase imposible en la roca.'],
    gremios: ['piltover', A + 'lugares/aurelia.svg', [0.35, 0.73], [0.82, 0.56], 'El patio de gremios reúne a quienes mantienen los ascensores y los viaductos.', 'Una orden de mantenimiento fue modificada después de recibir la firma.'],
    'ascensor-central': ['piltover', A + 'lugares/aurelia.svg', [0.7, 0.76], [0.48, 0.38], 'El ascensor central conecta los niveles de Aurelia y Nácar mediante contrapesos.', 'El registro del freno repite el patrón de la noche del accidente.'],
    cristal: ['piltover', A + 'lugares/aurelia.svg', [0.18, 0.54], [0.65, 0.46], 'El bulevar de cristal transporta materiales y datos entre los talleres de Aurelia.', 'Una veta de Resonancia pulsa a un ritmo distinto del registrado.'],
    'mercado-nacar': ['zaun', A + 'lugares/nacar.svg', [0.25, 0.68], [0.76, 0.44], 'El Mercado de las Tuberías vende repuestos, noticias y acuerdos comunitarios.', 'Una válvula lleva una marca de fabricación borrada del registro.'],
    galerias: ['zaun', A + 'lugares/nacar.svg', [0.62, 0.3], [0.38, 0.72], 'Las galerías geotérmicas convierten pulsos minerales en energía para la ciudad.', 'La frecuencia sube antes de que el medidor principal lo detecte.'],
    'jardin-musgo': ['zaun', A + 'lugares/nacar.svg', [0.18, 0.72], [0.82, 0.64], 'El jardín de musgo mantiene humedad y aire limpio en un barrio rodeado de maquinaria.', 'Una tubería secundaria desvía agua hacia viviendas que no aparecen en el plano.'],
    clinica: ['zaun', A + 'lugares/nacar.svg', [0.7, 0.66], [0.45, 0.42], 'La Clínica de los Tres Arcos no puede cerrar mientras las galerías sigan habitadas.', 'La lista de suministros revela quién asumió el coste del último corte.'],
    'canal-cobre': ['zaun', A + 'lugares/nacar.svg', [0.45, 0.8], [0.78, 0.35], 'El Canal de Cobre recoge el agua de condensación y conecta varios talleres.', 'Una compuerta fue cerrada desde un terminal que debía estar fuera de servicio.'],
    'aurelia-council': ['piltover', A + 'lugares/aurelia.svg', [0.55, 0.32], [0.82, 0.58], 'La sala del Consejo debate quién puede controlar la red de Resonancia.', 'Un anexo del pacto antiguo no aparece en las copias oficiales.'],
    'nacar-central': ['zaun', A + 'lugares/nacar.svg', [0.32, 0.68], [0.78, 0.42], 'La estación central de Nácar conecta los talleres con las galerías geotérmicas.', 'La señal coincide con el registro desaparecido del Archivo.'],
  };
  /** Imagen propia del lugar; se permite sustituirla con arte personal sin depender de temporadas. */
  function imageFor(id, fallback) {
    const custom = window.CustomArt?.files?.lugares?.[id] || window.ART_BUNDLED?.lugares?.[id];
    return custom || fallback;
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
