// Fichas de ejemplo de la portada (Kael y Lyra). La demo jugable está en demo-juego.js.
(() => {
  const $ = id => document.getElementById(id);
  const people={
    kael:{name:'Kael',sigil:'K',role:'Ingeniero · Piltover',quote:'«Hasta el engranaje más pequeño puede cambiar una ciudad».',stats:[9,6,7],history:'Kael diseña pequeños mecanismos para resolver problemas imposibles, pero la curiosidad lo empuja más allá de las puertas de su taller.',ability:'Resonancia mecánica: identifica fallos ocultos y repara mecanismos en tiempo récord.'},
    lyra:{name:'Lyra',sigil:'L',role:'Exploradora · Zaun',quote:'«Los mejores caminos no aparecen en los mapas».',stats:[7,9,8],history:'Lyra conoce los pasadizos de Zaun y utiliza su ingenio para ayudar a quienes no tienen voz.',ability:'Paso fugaz: encuentra rutas alternativas y evita trampas en lugares peligrosos.'}
  };
  let person='kael',tab='historia';
  function renderPerson(){const p=people[person];$('ficha-nombre').textContent=p.name;$('ficha-sigilo').textContent=p.sigil;$('ficha-rol').textContent=p.role;$('ficha-frase').textContent=p.quote;['ingenio','audacia','empatia'].forEach((key,i)=>{$('ficha-'+key).value=p.stats[i]});$('ficha-texto').textContent=p[tab];document.querySelectorAll('[data-personaje]').forEach(b=>{const active=b.dataset.personaje===person;b.classList.toggle('activo',active);b.setAttribute('aria-pressed',String(active))});document.querySelectorAll('[data-ficha-tab]').forEach(b=>{const active=b.dataset.fichaTab===tab;b.classList.toggle('activo',active);b.setAttribute('aria-pressed',String(active))})}
  document.querySelectorAll('[data-personaje]').forEach(b=>b.addEventListener('click',()=>{person=b.dataset.personaje;renderPerson()}));
  document.querySelectorAll('[data-ficha-tab]').forEach(b=>b.addEventListener('click',()=>{tab=b.dataset.fichaTab;renderPerson()}));
})();
