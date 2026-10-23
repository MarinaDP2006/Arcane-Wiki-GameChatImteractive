(() => {
 const navLinks=[...document.querySelectorAll('[data-tab]')];
 const pages={inicio:['inicio','estado-desarrollo'],juego:['juego','novedades'],novedades:['novedades'],fichas:['fichas'],desarrollando:['desarrollando'],capturas:['capturas'],descargar:['descargar','preguntas']};
 const sections=[...document.querySelectorAll('main > section')];
 function show(key,updateHash=true){if(!pages[key])key='inicio';sections.forEach(section=>{section.hidden=!pages[key].includes(section.id)});navLinks.forEach(a=>{const active=a.dataset.tab===key;a.classList.toggle('nav-activo',active);if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});if(updateHash&&location.hash!=='#'+key)history.replaceState(null,'','#'+key);window.scrollTo({top:0,behavior:'auto'});}
 navLinks.forEach(a=>a.addEventListener('click',event=>{event.preventDefault();show(a.dataset.tab)}));
 const initial=location.hash.slice(1);show(pages[initial]?initial:'inicio',false);
})();