// Menú plegable en móvil: el botón abre y cierra la navegación, y se cierra al elegir un enlace.
(() => {
  const boton = document.querySelector('.menu-boton');
  const menu = document.getElementById('menu');
  if (!boton || !menu) return;
  const set = abierto => { boton.setAttribute('aria-expanded', String(abierto)); menu.classList.toggle('abierto', abierto); };
  boton.addEventListener('click', () => set(boton.getAttribute('aria-expanded') !== 'true'));
  menu.addEventListener('click', e => { if (e.target.closest('a')) set(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') set(false); });
})();
