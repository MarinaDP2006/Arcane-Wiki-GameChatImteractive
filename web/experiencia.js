// Experiencias de demostración, independientes de las partidas reales.
(() => {
  const $ = id => document.getElementById(id);
  const choices = $('demo-opciones');
  const restart = $('demo-reiniciar');
  const routes = {
    piltover: { district:'Piltover', title:'Un secreto entre engranajes', text:'En el taller encuentras un plano con una ruta oculta. Una firma desconocida señala un puente cerrado.', consequence:'Has descubierto el plano del puente.', ingenuity:8, courage:5, options:[['Descifrar el plano','plano'],['Cruzar el puente','puente']] },
    zaun: { district:'Zaun', title:'Ecos bajo la ciudad', text:'Una mecánica te ofrece una pista a cambio de ayuda. Cerca, una puerta vibra con una energía extraña.', consequence:'Has encontrado a una aliada inesperada.', ingenuity:6, courage:8, options:[['Ayudar a la mecánica','ayudar'],['Abrir la puerta','puerta']] }
  };
  const endings = {
    plano:['La clave del reloj','Descifras los símbolos y descubres que alguien ha preparado un encuentro secreto entre ambas ciudades.','Final: la mente abre caminos.'],
    puente:['Al otro lado','Cruzas el puente y entregas el mensaje antes de que caiga en las manos equivocadas.','Final: tu valentía cambia el destino.'],
    ayudar:['Una alianza improbable','Reparas el mecanismo y la mecánica te confía una ruta segura hacia la superficie.','Final: la confianza construye puentes.'],
    puerta:['La luz de las profundidades','Tras la puerta descubres un laboratorio abandonado y un mapa que nadie debía encontrar.','Final: la curiosidad tiene un precio.']
  };
  function choose(route) {
    const d = routes[route];
    $('demo-capitulo').textContent='Capítulo 02 · '+d.district;
    $('demo-escena-titulo').textContent=d.title; $('demo-relato').textContent=d.text;
    $('demo-distrito').textContent=d.district; $('demo-consecuencia').textContent=d.consequence;
    $('demo-ingenio').value=d.ingenuity; $('demo-audacia').value=d.courage;
    choices.replaceChildren();
    d.options.forEach(([label,key])=>{const button=document.createElement('button');button.type='button';button.textContent=label;button.addEventListener('click',()=>finish(key));choices.append(button)});
  }
  function finish(key) {
    const [title,story,result]=endings[key];
    $('demo-capitulo').textContent='Epílogo · Tu historia'; $('demo-escena-titulo').textContent=title;
    $('demo-relato').textContent=story; $('demo-consecuencia').textContent=result;
    choices.replaceChildren();restart.hidden=false;
  }
  document.querySelectorAll('[data-eleccion]').forEach(button=>button.addEventListener('click',()=>choose(button.dataset.eleccion)));
  restart.addEventListener('click',()=>{
    $('demo-capitulo').textContent='Capítulo 01 · El cruce'; $('demo-escena-titulo').textContent='Dos ciudades. Una decisión.';
    $('demo-relato').textContent='Encuentras un mensaje cifrado entre los puentes de Piltover y los callejones de Zaun. ¿Dónde buscarás la primera pista?';
    $('demo-distrito').textContent='Destino sin elegir';$('demo-consecuencia').textContent='Cada elección abre una ruta distinta.';
    $('demo-ingenio').value=5;$('demo-audacia').value=5;
    choices.replaceChildren();
    [['Investigar en Piltover','piltover'],['Descender a Zaun','zaun']].forEach(([label,key])=>{const button=document.createElement('button');button.type='button';button.textContent=label;button.addEventListener('click',()=>choose(key));choices.append(button)});
    restart.hidden=true;
  });
  const people={
    kael:{name:'Kael',sigil:'K',role:'Ingeniero · Piltover',quote:'«Hasta el engranaje más pequeño puede cambiar una ciudad».',stats:[9,6,7],history:'Kael diseña pequeños mecanismos para resolver problemas imposibles, pero la curiosidad lo empuja más allá de las puertas de su taller.',ability:'Resonancia mecánica: identifica fallos ocultos y repara mecanismos en tiempo récord.'},
    lyra:{name:'Lyra',sigil:'L',role:'Exploradora · Zaun',quote:'«Los mejores caminos no aparecen en los mapas».',stats:[7,9,8],history:'Lyra conoce los pasadizos de Zaun y utiliza su ingenio para ayudar a quienes no tienen voz.',ability:'Paso fugaz: encuentra rutas alternativas y evita trampas en lugares peligrosos.'}
  };
  let person='kael',tab='historia';
  function renderPerson(){const p=people[person];$('ficha-nombre').textContent=p.name;$('ficha-sigilo').textContent=p.sigil;$('ficha-rol').textContent=p.role;$('ficha-frase').textContent=p.quote;['ingenio','audacia','empatia'].forEach((key,i)=>{$('ficha-'+key).value=p.stats[i]});$('ficha-texto').textContent=p[tab];document.querySelectorAll('[data-personaje]').forEach(b=>{const active=b.dataset.personaje===person;b.classList.toggle('activo',active);b.setAttribute('aria-pressed',String(active))});document.querySelectorAll('[data-ficha-tab]').forEach(b=>{const active=b.dataset.fichaTab===tab;b.classList.toggle('activo',active);b.setAttribute('aria-pressed',String(active))})}
  document.querySelectorAll('[data-personaje]').forEach(b=>b.addEventListener('click',()=>{person=b.dataset.personaje;renderPerson()}));
  document.querySelectorAll('[data-ficha-tab]').forEach(b=>b.addEventListener('click',()=>{tab=b.dataset.fichaTab;renderPerson()}));
})();
