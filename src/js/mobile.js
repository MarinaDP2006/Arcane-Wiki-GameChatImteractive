// Móvil y tableta (y la app de Android): joystick, botón de acción, gestos de cámara,
// botón «atrás» del teléfono y pausa automática al salir de la app.
(function () {
  if (!U.touch) return;
  const native = Boolean(window.Capacitor?.isNativePlatform?.());
  document.body.classList.add('touch');
  if (native) document.body.classList.add('native');

  // Teclas simuladas: el juego ya sabe qué hacer con Escape (cerrar ventana o pausa).
  const press = (key) => window.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));

  // ---------- Controles del mundo abierto ----------
  function addControls(world) {
    if (world.querySelector('.touch-stick')) return;
    const knob = U.el('i', { class: 'touch-knob' });
    const stick = U.el('div', { class: 'touch-stick' }, knob);
    const act = U.el('button', { class: 'touch-act', 'aria-label': 'Usar' }, '✦');
    world.append(stick, act);

    const R = 46; // recorrido máximo del mando, en píxeles
    let id = null;
    let cx = 0;
    let cy = 0;
    const move = (e) => {
      let dx = e.clientX - cx;
      let dy = e.clientY - cy;
      const d = Math.hypot(dx, dy);
      if (d > R) { dx = (dx / d) * R; dy = (dy / d) * R; }
      knob.style.transform = `translate(${dx}px, ${dy}px)`;
      World.stick(dx / R, dy / R);
    };
    const end = () => {
      id = null;
      knob.style.transform = '';
      stick.classList.remove('on');
      World.stick(0, 0);
    };
    stick.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      const r = stick.getBoundingClientRect();
      cx = r.left + r.width / 2;
      cy = r.top + r.height / 2;
      id = e.pointerId;
      stick.setPointerCapture(id);
      stick.classList.add('on');
      move(e);
    });
    stick.addEventListener('pointermove', (e) => { if (e.pointerId === id) move(e); });
    stick.addEventListener('pointerup', end);
    stick.addEventListener('pointercancel', end);

    act.addEventListener('click', (e) => { e.stopPropagation(); World.interact(); });
    const glow = setInterval(() => {
      if (!act.isConnected) return clearInterval(glow);
      act.classList.toggle('ready', World.canInteract());
    }, 200);

    // Dos dedos sobre el mapa: pellizcar = zoom, girar = rotar la cámara.
    const canvas = world.querySelector('#world-canvas');
    let pinch = null;
    const two = (t) => ({
      d: Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY),
      a: Math.atan2(t[1].clientY - t[0].clientY, t[1].clientX - t[0].clientX),
    });
    canvas?.addEventListener('touchstart', (e) => { if (e.touches.length === 2) pinch = two(e.touches); }, { passive: true });
    canvas?.addEventListener('touchmove', (e) => {
      if (!pinch || e.touches.length !== 2) return;
      e.preventDefault();
      const now = two(e.touches);
      if (now.d > 0 && pinch.d > 0) World.zoom(pinch.d / now.d);
      let da = now.a - pinch.a;
      if (da > Math.PI) da -= 2 * Math.PI;
      if (da < -Math.PI) da += 2 * Math.PI;
      World.rotate(-da);
      pinch = now;
    }, { passive: false });
    canvas?.addEventListener('touchend', (e) => { if (e.touches.length < 2) pinch = null; });
  }

  new MutationObserver(() => {
    const world = document.querySelector('#view-game .world');
    if (world) addControls(world);
  }).observe(document.getElementById('view-game'), { childList: true, subtree: true });

  // ---------- Botón «atrás» de Android ----------
  function back() {
    if (document.querySelector('.mg')) return press('Escape');
    if (document.querySelector('.cine')) return document.querySelector('.cine')?.click();
    const view = window.App?.view;
    if (view === 'game') return press('Escape');
    if (view === 'settings' || view === 'creator') return window.App.go('home');
    if (native) window.Capacitor.Plugins.App?.minimizeApp?.();
  }

  const AppPlugin = window.Capacitor?.Plugins?.App;
  if (AppPlugin) {
    AppPlugin.addListener('backButton', back);
    // Al salir de la app (llamada, botón de inicio…) se pausa la partida y se guarda.
    AppPlugin.addListener('pause', () => {
      if (window.App?.view === 'game' && document.querySelector('.world') && !document.querySelector('#overlay.show')) press('Escape');
      window.Audio2?.suspend?.();
    });
    AppPlugin.addListener('resume', () => window.Audio2?.resume?.());
  }
})();
