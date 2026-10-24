// Portada de la web: la grieta del menú del juego (title-fx.js), el ascensor que baja de Aurelia
// a Nácar mientras lees, las secciones que aparecen al llegar y el estado del KoboldCpp del servidor.
(() => {
  'use strict';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const tactil = matchMedia('(pointer: coarse)').matches;
  document.documentElement.classList.add('js');

  // Grieta entre Aurelia y Nácar, con el mismo código que el menú principal del juego.
  const home = document.querySelector('.home');
  if (home && window.TitleFX) {
    window.TitleFX.mount(home, { reduce, low: tactil });
    // Cada ciudad cambia de ilustración a su ritmo, desfasadas para que nunca cambien a la vez.
    if (!reduce) home.querySelectorAll('.home-art-in').forEach((capa, n) => {
      const slides = [...capa.children];
      let k = 0;
      setTimeout(function siguiente() {
        slides[k].classList.remove('on');
        k = (k + 1) % slides.length;
        slides[k].classList.add('on');
        setTimeout(siguiente, 9000);
      }, 6000 + n * 4500);
    });
  }

  // Ascensor: la cabina baja por el hueco según lo que llevas leído.
  const cabina = document.querySelector('.ascensor-cabina');
  if (cabina) {
    let pendiente = false;
    const mover = () => {
      pendiente = false;
      const max = document.documentElement.scrollHeight - innerHeight;
      cabina.style.setProperty('--bajada', max > 0 ? Math.min(1, scrollY / max).toFixed(3) : '0');
    };
    addEventListener('scroll', () => { if (!pendiente) { pendiente = true; requestAnimationFrame(mover); } }, { passive: true });
    addEventListener('resize', mover);
    mover();
  }

  // Las secciones aparecen al llegar a ellas (sin JavaScript se ven siempre).
  const secciones = document.querySelectorAll('.revelar');
  if (!reduce && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entradas) => entradas.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    }), { rootMargin: '0px 0px -10% 0px' });
    secciones.forEach((s) => io.observe(s));
  } else secciones.forEach((s) => s.classList.add('visible'));

  // Estado del KoboldCpp que usa el servidor de la web.
  const caja = document.querySelector('[data-ia-estado]');
  if (caja && window.KoboldWeb) {
    const punto = caja.querySelector('.punto');
    const texto = caja.querySelector('[data-ia-texto]');
    window.KoboldWeb.estadoServidor().then(({ estado, modelo }) => {
      const t = {
        conectado: ['punto-listo', `Encendido${modelo ? ' · ' + modelo : ''}. La demo responde con IA sin instalar nada.`],
        'sin-modelo': ['punto-proto', 'El servidor llega a KoboldCpp, pero no tiene un modelo abierto. Usa tu KoboldCpp o el narrador local.'],
        'sin-conexion': ['punto-apagado', 'Apagado ahora mismo. Usa tu KoboldCpp (camino B) o juega con el narrador local.'],
        'sin-servidor': ['punto-apagado', 'Esta copia de la web no tiene servidor. Usa tu KoboldCpp (camino B) o el narrador local.'],
      }[estado] || ['punto-apagado', 'No se ha podido comprobar.'];
      punto.className = 'punto ' + t[0];
      texto.textContent = t[1];
    });
  }
})();
