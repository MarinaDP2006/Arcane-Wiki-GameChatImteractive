// Códice del juego: la enciclopedia del Umbral, cuyas entradas se desbloquean
// al conocer personajes, visitar lugares y recoger fragmentos en el mapa.
(function () {
  const { el, norm } = U;
  const ORIGIN = { nacar: 'Nácar', aurelia: 'Aurelia', otro: 'Otras tierras' };
  const state = { cat: 'personajes', query: '', origin: 'todos', selected: null };
  let root = null;
  let opts = { known: () => true };
  const q = (sel) => root.querySelector(sel);

  const HINTS = {
    personajes: 'Conócelo en la historia para desbloquear su entrada.',
    lugares: 'Visita este lugar en el mapa para desbloquearlo.',
    criaturas: 'Busca su fragmento (hexágono azul) en el mapa.',
    tecnologia: 'Busca su fragmento (hexágono azul) en el mapa.',
    mundo: 'Busca su fragmento (hexágono azul) en el mapa.',
  };

  function iconFor(cat) {
    return window.WIKI.categories.find((c) => c.id === cat)?.icon || '✦';
  }

  function art(entry, cat) {
    if (!opts.known(entry.id)) return Portrait.emblem({ name: '???', colors: ['#2a2438', '#0d0b14'] }, '');
    return cat === 'personajes' ? Portrait.forCharacter(entry.id) : Portrait.emblem(entry, iconFor(cat));
  }

  function findAny(id) {
    for (const c of window.WIKI.categories) {
      const e = window.WIKI[c.id].find((x) => x.id === id);
      if (e) return { entry: e, cat: c.id };
    }
    return null;
  }

  function filtered() {
    const query = norm(state.query);
    const cats = query ? window.WIKI.categories.map((c) => c.id) : [state.cat];
    const out = [];
    for (const cat of cats) {
      for (const e of window.WIKI[cat]) {
        if (state.origin !== 'todos' && e.origin !== state.origin) continue;
        const known = opts.known(e.id);
        if (query && (!known || !norm([e.name, e.alias, e.role, e.summary, ...(e.details || [])].join(' ')).includes(query))) continue;
        out.push({ entry: e, cat, known });
      }
    }
    return out;
  }

  function renderList() {
    const list = q('#wiki-list');
    list.innerHTML = '';
    const items = filtered();
    if (!items.length) {
      list.append(el('p', { class: 'muted pad' }, 'No hay resultados entre lo que has descubierto.'));
      return;
    }
    for (const { entry, cat, known } of items) {
      list.append(el('button', {
        class: `wiki-card origin-${entry.origin}${state.selected === entry.id ? ' active' : ''}${known ? '' : ' locked'}`,
        onclick: () => select(entry.id),
      },
      el('div', { class: 'wiki-card-art', html: art(entry, cat) }),
      el('div', { class: 'wiki-card-body' },
        el('strong', {}, known ? entry.name : '???'),
        el('span', { class: 'tag' }, ORIGIN[entry.origin] || ''),
        el('small', {}, known ? entry.role || window.WIKI.categories.find((c) => c.id === cat).label : 'Sin descubrir'))));
    }
  }

  function renderDetail() {
    const box = q('#wiki-detail');
    const found = state.selected && findAny(state.selected);
    if (!found) {
      box.innerHTML = `<div class="wiki-empty"><h2>Códice del Umbral</h2>
        <p>Aquí se guarda todo lo que descubres en Aurelia y Nácar: personajes, lugares, criaturas, inventos y facciones.</p>
        <p class="muted">Conoce a gente en la historia, visita lugares y recoge los hexágonos azules del mapa para completarlo.</p></div>`;
      return;
    }
    const { entry: e, cat } = found;
    box.innerHTML = '';
    if (!opts.known(e.id)) {
      box.append(el('div', { class: 'wiki-empty' }, el('h2', {}, 'Entrada sin descubrir'), el('p', {}, HINTS[cat])));
      return;
    }
    const showSpoilers = window.App.settings.spoilers;
    const rel = (e.relations || []).map((id) => findAny(id)).filter(Boolean);
    box.append(
      el('div', { class: 'detail-head' },
        el('div', { class: 'detail-art', html: cat === 'personajes' ? Portrait.bodyFor(e.id) : art(e, cat) }),
        el('div', {},
          el('h2', {}, e.name),
          e.alias ? el('p', { class: 'alias' }, e.alias) : null,
          el('div', { class: 'chips' },
            el('span', { class: `tag origin-${e.origin}` }, ORIGIN[e.origin] || ''),
            e.role ? el('span', { class: 'tag' }, e.role) : null,
            el('span', { class: 'tag' }, window.WIKI.categories.find((c) => c.id === cat).label)),
          el('p', { class: 'lead' }, e.summary))),
      ...(e.details || []).map((p) => el('p', {}, p)),
      e.spoiler ? el('div', {
        class: `spoiler${showSpoilers ? ' revealed' : ''}`,
        title: 'Pulsa para revelar',
        onclick: (ev) => ev.currentTarget.classList.add('revealed'),
      }, el('strong', {}, 'Spoiler · Temporada 2: '), e.spoiler) : null,
      e.quote ? el('blockquote', {}, `«${e.quote}»`, el('small', {}, ' — frase inspirada en el personaje')) : null,
      rel.length ? el('h3', {}, 'Relaciones') : null,
      rel.length ? el('div', { class: 'relations' }, rel.map(({ entry: r, cat: rc }) =>
        el('button', { class: 'rel', onclick: () => { state.cat = rc; select(r.id); } },
          el('span', { class: 'rel-art', html: art(r, rc) }), opts.known(r.id) ? r.name : '???'))) : null);
    if (cat === 'personajes' && window.CHAT[e.id] && opts.canTalk?.(e.id)) {
      box.append(el('div', { class: 'row gap' },
        el('button', { class: 'btn small', onclick: () => opts.onTalk(e.id) }, 'Hablar por el comunicador')));
    }
  }

  function select(id) {
    state.selected = id;
    Audio2.sfx.click();
    renderTabs();
    renderList();
    renderDetail();
  }

  function renderTabs() {
    const tabs = q('#wiki-tabs');
    tabs.innerHTML = '';
    for (const c of window.WIKI.categories) {
      const total = window.WIKI[c.id].length;
      const known = window.WIKI[c.id].filter((e) => opts.known(e.id)).length;
      tabs.append(el('button', {
        class: `tab${state.cat === c.id && !state.query ? ' active' : ''}`,
        onclick: () => { state.cat = c.id; state.query = ''; q('#wiki-search').value = ''; renderTabs(); renderList(); },
      }, `${c.icon} ${c.label}`, el('span', { class: 'count' }, `${known}/${total}`)));
    }
  }

  function mount(container, options = {}) {
    root = container;
    opts = { known: () => true, ...options };
    root.innerHTML = `
      <div class="wiki-layout">
        <aside class="wiki-side">
          <input id="wiki-search" class="input" type="search" placeholder="Buscar en el Códice…" aria-label="Buscar">
          <div class="seg" id="wiki-origin">
            <button data-o="todos" class="active">Todo</button>
            <button data-o="nacar">Nácar</button>
            <button data-o="aurelia">Aurelia</button>
          </div>
          <nav id="wiki-tabs" class="wiki-tabs"></nav>
        </aside>
        <section id="wiki-list" class="wiki-list"></section>
        <article id="wiki-detail" class="wiki-detail"></article>
      </div>`;
    q('#wiki-search').addEventListener('input', (e) => { state.query = e.target.value; renderTabs(); renderList(); });
    root.querySelectorAll('#wiki-origin button').forEach((b) =>
      b.addEventListener('click', () => {
        state.origin = b.dataset.o;
        root.querySelectorAll('#wiki-origin button').forEach((x) => x.classList.toggle('active', x === b));
        renderList();
      }));
    renderTabs();
    renderList();
    renderDetail();
  }

  window.Wiki = {
    mount,
    open(id) {
      const f = findAny(id);
      if (f) { state.cat = f.cat; state.query = ''; }
      select(id);
    },
  };
})();
