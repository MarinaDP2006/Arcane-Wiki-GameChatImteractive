// Ficha de ejemplo, igual que la del juego (pestaña Ficha). Kael y Lyra son personajes originales
// hechos con opciones reales del creador; la demo jugable está en demo-juego.js.
(() => {
  const $ = id => document.getElementById(id);
  if (!$('ficha-juego')) return;
  const people = {
    kael: {
      name: 'Kael', city: 'piltover', img: 'arte-propio/ficha-kael.jpg',
      rows: [['Nombre', 'Kael'], ['Género', 'Hombre'], ['Edad', '24'], ['Ciudad', 'Piltover · Barrio de los Artesanos'], ['Profesión', 'Inventor independiente'], ['Familia', 'Clan Ferros (gemas y comercio)'], ['Padres', 'Tengo a mis padres'], ['Te atraen', 'Mujeres'], ['Aficiones', 'Inventar cachivaches, Leer en la biblioteca'], ['Clase', 'Inventor hextec'], ['Habilidades', 'Q: Chispa hextec · W: Escudo de chatarra · E: Memoria arcana · R: Sobrecarga hextec'], ['Talento clave', 'Aprendiz incansable']],
      stats: { Ingenio: 5, Carisma: 3, Valor: 2, Sigilo: 2 }, rep: { Zaun: 0, Piltover: 4 },
      rels: [['J', 'Jayce', 'Amistad', 6, 3], ['V', 'Viktor', 'Amistad', 5, 2], ['C', 'Caitlyn', '', 2, 1]],
      progress: 'Parte I · Capítulo 3 · Placa y pólvora', endings: 0,
    },
    lyra: {
      name: 'Lyra', city: 'zaun', img: 'arte-propio/ficha-lyra.jpg',
      rows: [['Nombre', 'Lyra'], ['Género', 'Mujer'], ['Edad', '19'], ['Ciudad', 'Zaun · El Mercado de las Tuberías'], ['Profesión', 'Mensajera de los químbarones'], ['Familia', 'Criada en el árbol de las Luciérnagas'], ['Padres', 'Huérfana, sin familia'], ['Te atraen', 'Ambos'], ['Aficiones', 'Correr por los tejados, Grafiti y pintura'], ['Clase', 'Sombra'], ['Habilidades', 'Q: Disparo certero · W: Carrera de tejado · E: Ojo de halcón · R: Sombra del humo'], ['Talento clave', 'Pies ligeros']],
      stats: { Ingenio: 2, Carisma: 2, Valor: 3, Sigilo: 5 }, rep: { Zaun: 5, Piltover: 0 },
      rels: [['E', 'Ekko', 'Hermana de corazón', 7, 5], ['V', 'Vi', 'Amistad', 5, 3], ['J', 'Jinx', '', 3, 1]],
      progress: 'Parte I · Capítulo 3 · Siete años después', endings: 0,
    },
  };
  const make = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
  // Mismas escalas que el juego: estadísticas ×20 % (máximo 5) y reputación ×12 %.
  function bar(label, value, scale, cls) {
    const row = make('div', 'fj-stat'); const track = make('div', 'fj-bar ' + (cls || '')); const fill = make('i');
    fill.style.width = Math.min(100, value * scale) + '%'; track.append(fill);
    row.append(make('span', '', label), track, make('b', '', String(value))); return row;
  }
  function hearts(n) { const full = Math.round(Math.max(0, n) / 2); return '♥'.repeat(full) + '♡'.repeat(5 - full); }
  let current = 'kael';
  function render() {
    const p = people[current];
    $('fj-retrato').src = p.img; $('fj-retrato').alt = 'Retrato pintado de ' + p.name;
    $('fj-nombre').textContent = p.name;
    $('fj-ciudad').textContent = p.city === 'zaun' ? 'Zaun' : 'Piltover';
    $('fj-ciudad').className = 'fj-chip fj-chip-' + p.city;
    $('ficha-juego').dataset.ciudad = p.city;
    $('fj-lista').replaceChildren(...p.rows.flatMap(([k, v]) => [make('dt', '', k), make('dd', '', v)]));
    $('fj-stats').replaceChildren(...Object.entries(p.stats).map(([k, v]) => bar(k, v, 20)));
    $('fj-rep').replaceChildren(bar('Zaun', p.rep.Zaun, 12, 'fj-rep-zaun'), bar('Piltover', p.rep.Piltover, 12, 'fj-rep-piltover'));
    $('fj-rels').replaceChildren(...p.rels.map(([sig, name, status, aff, trust]) => {
      const r = make('div', 'fj-rel'); r.append(make('span', 'fj-sig', sig));
      const t = make('span', 'fj-rel-txt'); t.append(make('b', '', name));
      t.append(make('small', status ? 'fj-rel-estado' : 'fj-rel-estado vacio', status || 'Conocido'));
      t.append(make('small', 'fj-conf', 'Confianza ' + trust));
      r.append(t, make('span', 'fj-corazones', hearts(aff))); r.title = 'Afinidad ' + aff; return r;
    }));
    $('fj-progreso').textContent = p.progress + ' · Finales conseguidos: ' + p.endings + '/8';
    document.querySelectorAll('[data-personaje]').forEach(b => { const on = b.dataset.personaje === current; b.classList.toggle('activo', on); b.setAttribute('aria-pressed', String(on)); });
  }
  document.querySelectorAll('[data-personaje]').forEach(b => b.addEventListener('click', () => { current = b.dataset.personaje; render(); }));
  render();
})();
