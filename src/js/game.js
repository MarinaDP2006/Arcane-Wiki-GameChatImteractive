// Motor del juego: partidas, historia en formato chat, conversaciones con
// opciones de diálogo con los personajes desbloqueados y ficha del personaje.
(function () {
  const { $, el, esc, tpl, store, toast, sleep, pick } = U;
  const S = () => window.STORY;

  let G = null; // estado de la partida en curso
  let slot = null;
  let busy = false; // reproduciendo líneas de la historia
  let skipping = false;
  // Atajo de teclado entre corchetes (en móvil no hay teclado, así que no se muestra).
  const keyHint = (k) => (U.touch ? '' : `  [${k}]`);
  let tab = 'historia';
  let contact = null; // personaje del chat libre seleccionado

  const chapterById = (id) => S().chapters.find((c) => c.id === id);
  const charName = (id) => window.WIKI.personajes.find((p) => p.id === id)?.name || id;
  const affOf = (id) => G.aff[id] ?? 0;
  // Personajes que han muerto en la historia (canon de Arcane): ya no chatean.
  const isFallen = (id) => (G.fallen || []).includes(id);
  const talkable = () => G.unlocked.filter((id) => !isFallen(id));
  // Familia del jugador elegida en la creación (se conocen desde siempre).
  const kinOf = (st) => Object.keys(window.RELATIONS.familyLinks[st.player.family] || {});

  // ---------------- Partidas ----------------
  function newState(player, stats) {
    const route = S().routes[player.origin];
    const st = {
      version: 1, player, stats,
      aff: {}, rep: { zaun: player.origin === 'zaun' ? 1 : 0, piltover: player.origin === 'piltover' ? 1 : 0 },
      flags: {}, unlocked: [], chats: {}, log: [], endings: [], met: [], fallen: [],
      world: { map: null, x: 0, y: 0 }, codex: [], visited: [], acts: {},
      progress: { route: player.origin, chapterIdx: 0, chapterId: route[0], node: null, chapterTitle: chapterById(route[0]).title, finished: false, started: false },
    };
    Object.entries(player.familyAff || {}).forEach(([k, v]) => { st.aff[k] = v; });
    if (player.family !== 'ninguna') st.flags.familia_famosa = true;
    st.met = kinOf(st);
    Relations.applyFamily(st);
    return st;
  }

  /** Guarda los datos actuales de la partida. */
  async function persist() {
    if (!G || !slot) return;
    G.progress.chapterTitle = chapterById(G.progress.chapterId)?.title || '';
    G.log = G.log.slice(-400);
    await store.save(slot, G);
  }

  /** Dibuja el menú de partidas. */
  async function renderMenu() {
    const root = $('#view-game');
    const slots = await store.listSlots();
    root.innerHTML = '';
    setTimeout(() => window.App.backdrop3d?.(root, 'menu'), 0);
    root.append(el('div', { class: 'menu' },
      el('h1', { class: 'title-arcane' }, 'Partidas'),
      el('p', { class: 'muted' }, 'Elige una ranura. Cada partida guarda tu personaje, tu posición en el mapa, tus decisiones y tus conversaciones.'),
      el('button', { class: 'btn ghost', onclick: () => window.App.go('home') }, '← Menú principal'),
      el('div', { class: 'slots' }, slots.map((s) => el('div', { class: `slot panel${s.empty ? ' empty' : ''}` },
        el('h3', {}, `Ranura ${s.slot}`),
        s.empty ? el('p', { class: 'muted' }, 'Vacía') : el('div', {},
          el('strong', {}, s.name), el('span', { class: `tag origin-${s.origin}` }, s.origin === 'zaun' ? 'Zaun' : 'Piltover'),
          el('p', { class: 'muted' }, s.chapter || ''),
          s.savedAt ? el('small', { class: 'muted' }, new Date(s.savedAt).toLocaleString(window.I18N?.lang || 'es')) : null),
        el('div', { class: 'row gap' },
          s.empty
            ? el('button', { class: 'btn primary', onclick: () => newGame(s.slot) }, 'Nueva partida')
            : el('button', { class: 'btn primary', onclick: () => loadGame(s.slot) }, 'Continuar'),
          !s.empty ? el('button', {
            class: 'btn ghost', onclick: async () => {
              if (!confirm(`¿Borrar la partida de ${s.name}? No se puede deshacer.`)) return;
              await store.remove(s.slot);
              renderMenu();
            },
          }, 'Borrar') : null))))));
  }

  /** Inicia una nueva historia con el personaje creado. */
  function newGame(s) {
    slot = s;
    window.App.go('creator');
    Creator.start(async (player, stats) => {
      G = newState(player, stats);
      tab = 'historia';
      contact = null;
      await persist();
      await playIntro(player);
      window.App.go('game');
      toast(`Objetivo: ve a ${objectiveName()}`, 'good');
    });
  }

  /** Restaura una partida guardada. */
  async function loadGame(s) {
    const data = await store.load(s);
    if (!data) return toast('No se pudo cargar la partida', 'warn');
    slot = s;
    G = data;
    // Partidas antiguas sin mundo abierto.
    G.world = G.world || { map: null, x: 0, y: 0 };
    G.codex = G.codex || [];
    G.visited = G.visited || [];
    G.acts = G.acts || {};
    // Las partidas anteriores a la ampliación conservan su capítulo por ID; el índice
    // debe recalcularse porque ahora existen episodios nuevos antes de cada final.
    const savedRoute = S().routes[G.progress?.route] || [];
    const savedIndex = savedRoute.indexOf(G.progress?.chapterId);
    if (savedIndex >= 0) G.progress.chapterIdx = savedIndex;
    // Solo el reparto principal sale en el comunicador (partidas antiguas tenían a más gente).
    G.unlocked = G.unlocked.filter((id) => window.STORY.cast.includes(id));
    // Partidas anteriores a los primeros encuentros y a las muertes del canon.
    G.met = [...new Set([...(G.met || []), ...G.unlocked, ...kinOf(G)])];
    syncFallen();
    // Las partidas de la versión «Arcane Piltover y Zaun» guardaban el avatar con la ruta de
    // aquella instalación; se apunta al mismo avatar dentro del juego actual.
    const oldPhoto = /^file:.*\/src\/img\/arte\/(.+)$/.exec(G.player?.photo || '');
    if (oldPhoto) G.player.photo = `img/arte/${decodeURIComponent(oldPhoto[1])}`;
    if (G.progress.started === undefined) G.progress.started = Boolean(G.progress.node);
    Relations.applyFamily(G);
    tab = 'historia';
    contact = null;
    window.App.go('game');
  }

  // Cinemática de inicio según la ciudad elegida.
  async function playIntro(p) {
    const me = { look: p.look, photo: p.photo, ...Portrait.playerOpts(p) };
    const shots = p.origin === 'zaun'
      ? [
        { scene: 'piltover', dur: 6, kicker: 'Runeterra', title: 'Piltover', lines: ['Arriba, la Ciudad del Progreso brilla de oro y cristal.'], zoom: [1.2, 1.05], pan: [[-0.6, -0.4], [0.4, 0.2]] },
        { scene: 'puente', dur: 6, lines: ['Un puente une dos mundos que no se miran a los ojos.'], zoom: [1.0, 1.18], pan: [[0.5, -0.3], [-0.2, 0.4]] },
        { scene: 'zaun', dur: 7, title: 'Zaun', lines: ['Abajo, entre humo verde y neón, la gente sobrevive como puede.'], zoom: [1.15, 1.0], pan: [[0, 0.6], [0, -0.2]] },
        { scene: 'callejones', dur: 7, lines: [`Aquí empieza tu historia, ${p.name}.`, 'Lo que decidas cambiará las dos ciudades.'], portrait: me, zoom: [1.05, 1.15] },
      ]
      : [
        { scene: 'zaun', dur: 6, kicker: 'Runeterra', title: 'Zaun', lines: ['Bajo tus pies, una ciudad respira humo y rabia.'], zoom: [1.2, 1.05], pan: [[0.5, 0.5], [-0.3, 0]] },
        { scene: 'puente', dur: 6, lines: ['El Puente del Progreso separa a quien tiene de quien no.'], zoom: [1.0, 1.18], pan: [[-0.5, 0.3], [0.3, -0.3]] },
        { scene: 'piltover', dur: 7, title: 'Piltover', lines: ['Arriba, la Ciudad del Progreso vive su edad dorada.'], zoom: [1.15, 1.0], pan: [[0, -0.6], [0, 0.2]] },
        { scene: 'academia', dur: 7, lines: [`Aquí empieza tu historia, ${p.name}.`, 'Lo que decidas cambiará las dos ciudades.'], portrait: me, zoom: [1.05, 1.15] },
      ];
    await Cinematic.play(shots);
  }

  // ---------------- Mundo abierto ----------------
  function objectiveId() {
    if (!G || G.progress.finished) return null;
    const loc = window.WORLD.chapterLocations[G.progress.chapterId];
    return typeof loc === 'object' ? loc[G.progress.route] : loc;
  }

  /** Devuelve el texto visible del objetivo actual. */
  function objectiveName() {
    return World.locById(objectiveId())?.name || '';
  }

  /** Registra un hallazgo del mundo o del códice. */
  function discover(codexId, label) {
    if (!codexId || G.codex.includes(codexId)) return false;
    G.codex.push(codexId);
    if (label) toast(label, 'good');
    return true;
  }

  /** Actualiza los indicadores visibles durante el juego. */
  function updateHud() {
    const o = $('#hud-objective');
    if (!o) return;
    const ch = chapterById(G.progress.chapterId);
    if (G.progress.finished) o.innerHTML = '<b>Historia completada</b><br><small>Explora, chatea y busca los fragmentos que te faltan.</small>';
    else if (G.progress.started) o.innerHTML = `<b>${esc(ch.title)}</b><br><small>Historia en curso · pulsa <kbd>H</kbd> para continuar</small>`;
    else o.innerHTML = `<b>${esc(ch.title)}</b><br><small>Objetivo: ve a <span class="gold">${esc(objectiveName())}</span></small>`;
    const st = $('#hud-stats');
    if (st) st.innerHTML = Object.entries(S().stats).map(([k, m]) => `<span title="${m.label}">${m.icon} ${G.stats[k]}</span>`).join('');
    const cx = $('#hud-codex');
    if (cx) cx.textContent = `${codexCount()}/${codexTotal()}`;
  }

  /** Comprueba si una entrada del códice ya está descubierta. */
  function codexKnown(id) {
    return G.codex.includes(id) || G.unlocked.includes(id);
  }
  /** Calcula el número total de entradas del códice. */
  function codexTotal() {
    return window.WIKI.categories.reduce((a, c) => a + window.WIKI[c.id].length, 0);
  }
  /** Cuenta las entradas que ha descubierto el jugador. */
  function codexCount() {
    return window.WIKI.categories.reduce((a, c) => a + window.WIKI[c.id].filter((e) => codexKnown(e.id)).length, 0);
  }

  /** Enumera las acciones disponibles en un lugar. */
  function locationActions(loc) {
    const acts = [];
    if (!G.progress.finished && loc.id === objectiveId()) acts.push({ label: G.progress.started ? 'Continuar la historia' : `Comenzar «${chapterById(G.progress.chapterId).title}»`, run: openStory });
    if (loc.travel) acts.push({ label: loc.travel.label, run: () => travel(loc.travel) });
    if (loc.activity) {
      const key = `${loc.id}:${G.progress.chapterIdx}`;
      const done = G.acts[key];
      const maxed = (G.stats[loc.activity.stat] || 0) >= window.WORLD.maxStat;
      if (!done && !maxed) acts.push({ label: `${loc.activity.game ? "" : ""}${loc.activity.label} (+1 ${S().stats[loc.activity.stat].label})`, run: () => doActivity(loc, key) });
    }
    const here = talkable().filter((id) => window.WORLD.homes[id] === loc.id);
    here.forEach((id) => acts.push({ label: `Hablar con ${charName(id)}`, run: () => openOverlay('chats', id) }));
    return acts;
  }

  /** Responde a la interacción del jugador con un lugar. */
  function onLocation(loc, inside = false) {
    // En Zaun ya no se completan las misiones desde un menú exterior: hay que
    // recorrer físicamente el escenario y alcanzar su punto de interacción.
    if (!inside && G.world.map === 'zaun' && window.ZaunInteriors?.has(loc.id)) {
      World.pause(true);
      const ok = window.ZaunInteriors.enter(loc.id,
        () => onLocation(loc, true),
        () => World.pause(false));
      if (ok) return;
      World.pause(false);
      return toast('No se ha podido abrir este lugar en 3D. Comprueba WebGL.', 'warn');
    }
    const acts = locationActions(loc);
    if (!acts.length) return toast(`${loc.name}: aquí no hay nada que hacer ahora mismo.`);
    if (acts.length === 1) return acts[0].run();
    // Menú de acciones del lugar.
    World.pause(true);
    const box = $('#overlay');
    box.innerHTML = '';
    box.className = 'overlay show';
    box.append(el('div', { class: 'panel action-menu' },
      el('h2', {}, loc.name),
      ...acts.map((a, i) => el('button', { class: 'choice', onclick: () => { closeOverlay(); a.run(); } }, el('span', { class: 'num' }, i + 1), a.label)),
      el('button', { class: 'btn ghost', onclick: closeOverlay }, 'Cerrar (Esc)')));
  }

  /** Inicia una actividad o minijuego del escenario. */
  async function doActivity(loc, key) {
    const a = loc.activity;
    if (a.game) {
      World.pause(true);
      const win = await Minigames.play(a.game, { bonus: mgBonus(a.game) });
      World.pause(false);
      if (!win) {
        toast('Esta vez no ha salido. Puedes volver a intentarlo cuando quieras.', 'warn');
        return;
      }
    }
    G.acts[key] = true;
    const gain = G.player.keystone === 'estudioso' ? 2 : 1;
    G.stats[a.stat] = Math.min(window.WORLD.maxStat, (G.stats[a.stat] || 0) + gain);
    Audio2.sfx.unlock();
    showNotice(a.label, `${a.text}\n\n${S().stats[a.stat].icon} ${S().stats[a.stat].label} +${gain} (ahora ${G.stats[a.stat]}).`);
    updateHud();
    persist();
  }

  /** Muestra una notificación contextual en pantalla. */
  function showNotice(title, text) {
    World.pause(true);
    const box = $('#overlay');
    box.innerHTML = '';
    box.className = 'overlay show';
    box.append(el('div', { class: 'panel action-menu' }, el('h2', {}, title),
      ...text.split('\n').filter(Boolean).map((p) => el('p', {}, p)),
      el('button', { class: 'btn primary', onclick: closeOverlay }, 'Continuar')));
  }

  /** Traslada al jugador entre lugares o ciudades. */
  async function travel(t) {
    Audio2.sfx.choice();
    World.travel(t.to, t.at);
    toast(`Llegas a ${window.WORLD.maps[t.to].label}`);
    await persist();
  }

  /** Configura las funciones usadas por el motor del mundo. */
  function worldCallbacks() {
    return {
      objective: objectiveId,
      music: () => (G.progress.chapterId === 'fin' && !G.progress.finished ? 'final' : G.world.map),
      locationActions: (loc) => locationActions(loc).map((a) => a.label),
      onLocation,
      onTalk: (id) => openOverlay('chats', id),
      onVisit: (loc) => {
        if (!G.visited.includes(loc.id)) {
          G.visited.push(loc.id);
          discover(loc.codex, `Descubierto: ${loc.name} (añadido al Códice)`);
          updateHud();
          persist();
        }
      },
      onFragment: (f) => {
        const entry = findEntry(f.codex);
        if (discover(f.codex, `Fragmento del Códice: ${entry?.name || f.codex}`)) {
          Audio2.sfx.unlock();
          updateHud();
          persist();
        }
      },
    };
  }

  /** Busca una entrada del códice por identificador. */
  function findEntry(id) {
    for (const c of window.WIKI.categories) {
      const e = window.WIKI[c.id].find((x) => x.id === id);
      if (e) return e;
    }
    return null;
  }

  // ---------------- Superposiciones ----------------
  let overlayKind = null;

  /** Abre una capa de interfaz encima de la partida. */
  function openOverlay(kind, who) {
    World.pause(true);
    overlayKind = kind;
    const box = $('#overlay');
    box.className = 'overlay show';
    box.innerHTML = '';
    if (kind === 'codice') {
      const sub = arguments[2] || 'entradas';
      const tab = (id, label) => el('button', { class: `tab${sub === id ? ' active' : ''}`, onclick: () => openOverlay('codice', null, id) }, label);
      const panel = el('div', { class: 'panel overlay-panel codex' },
        el('header', { class: 'overlay-head' },
          el('h2', {}, `Códice de Runeterra · ${codexCount()}/${codexTotal()}`),
          el('div', { class: 'codex-tabs' }, tab('entradas', 'Entradas'), tab('atlas', 'Atlas')),
          closeBtn()),
        el('div', { class: 'codex-body', id: 'codex-body' }));
      box.append(panel);
      const body = $('#codex-body');
      if (sub === 'atlas') {
        renderAtlas(body, who);
      } else {
        Wiki.mount(body, { known: codexKnown, onTalk: (id) => openOverlay('chats', id), canTalk: (id) => talkable().includes(id) });
        if (who) Wiki.open(who);
      }
      return;
    }
    if (kind === 'menu') {
      box.append(el('div', { class: 'panel action-menu' },
        el('h2', {}, 'Pausa'),
        el('button', { class: 'btn primary', onclick: closeOverlay }, '▶ Continuar'),
        el('button', { class: 'btn', onclick: async () => { await persist(); toast('Partida guardada', 'good'); } }, 'Guardar partida'),
        el('button', { class: 'btn', onclick: () => openArcade() }, 'Salón de minijuegos'),
        el('button', { class: 'btn', onclick: () => openSettingsOverlay() }, 'Ajustes'),
        el('button', { class: 'btn', onclick: () => { closeOverlay(); showHelp(); } }, 'Controles'),
        el('button', { class: 'btn ghost', onclick: async () => { if (window.App.settings.confirmExit !== false && !confirm('¿Salir al menú principal? La partida se guarda.')) return; await persist(); exitToTitle(); } }, '↩ Salir al menú principal'),
        U.desktop ? el('button', { class: 'btn ghost', onclick: async () => { await persist(); window.arcane.quit(); } }, '✕ Salir del juego') : null));
      return;
    }
    tab = kind;
    if (who !== undefined) contact = who;
    box.append(el('div', { class: 'panel overlay-panel' },
      el('div', { class: 'play' },
        el('aside', { class: 'contacts' },
          el('div', { class: 'me', onclick: () => setTab('ficha') },
            el('div', { class: 'avatar', html: Portrait.forPlayer(G.player) }),
            el('div', {}, el('strong', {}, G.player.name), el('small', { class: 'muted' }, tpl(G.player.jobLabel, G.player)))),
          el('div', { class: 'tabs-v' },
            tabBtn('historia', `Historia${keyHint('H')}`), tabBtn('chats', `Comunicador${keyHint('C')}`), tabBtn('ficha', `Ficha${keyHint('F')}`)),
          el('div', { id: 'contact-list', class: 'contact-list' }),
          el('button', { class: 'btn ghost small', onclick: closeOverlay }, `Volver al mapa${keyHint('Esc')}`)),
        el('section', { id: 'play-main', class: 'play-main' }))));
    renderContacts();
    renderMain();
  }

  // Practicar cualquier minijuego sin recompensa.
  function openArcade() {
    const box = $('#overlay');
    box.innerHTML = '';
    box.className = 'overlay show';
    box.append(el('div', { class: 'panel action-menu arcade' },
      el('h2', {}, 'Salón de minijuegos'),
      el('p', { class: 'muted' }, 'Practica sin límite. Las recompensas de estadísticas se ganan en los lugares del mapa.'),
      el('div', { class: 'arcade-grid' }, Object.entries(Minigames.GAMES).map(([id, g]) =>
        el('button', { class: 'arcade-card', onclick: async () => { box.style.visibility = 'hidden'; await Minigames.play(id, { bonus: mgBonus(id) }); box.style.visibility = ''; } },
          el('span', { class: 'arcade-icon', html: Minigames.emblem(id) }), el('strong', {}, g.title), el('small', { class: 'muted' }, g.goal)))),
      el('button', { class: 'btn ghost', onclick: () => openOverlay('menu') }, '← Volver')));
  }

  // ---------- Atlas de las Dos Ciudades (Códice) ----------
  // Mapa ilustrado con los lugares de Arcane: al pulsar uno se abre su ficha, con
  // puntos de interés, quién vive allí y un diario de los lugares explorados.
  function renderAtlas(body, placeId) {
    G.atlas = G.atlas || [];
    const A = window.ATLAS;
    const spoilers = window.App.settings.spoilers;
    const detail = el('div', { class: 'atlas-detail hidden' });
    const CITY = { piltover: 'Piltover', zaun: 'Zaun' };
    let focus = null;
    const pins = A.places.map((p) => el('button', {
      class: `atlas-pin pin-${p.city || 'both'}${G.atlas.includes(p.id) ? ' explored' : ''}`,
      style: `left:${p.x}%;top:${p.y}%`,
      title: p.name,
      onclick: () => showPlace(p),
    }, el('span', {}, p.name)));
    const map = el('div', { class: 'atlas-map' },
      el('img', { class: 'atlas-bg', src: 'img/arte/codice/mapa-piltover-zaun.webp', alt: 'Mapa de Piltover y Zaun', draggable: 'false' }),
      pins);
    const emblem = (city) => el('button', { class: `atlas-emblem emblem-${city}`, title: `Lugares de ${CITY[city]}`, onclick: () => showCity(city) },
      el('img', { src: `img/arte/simbolos/${city}.png`, alt: CITY[city], draggable: 'false' }), el('span', {}, CITY[city]));
    const emblems = { piltover: emblem('piltover'), zaun: emblem('zaun') };
    const journalBtn = el('button', { class: 'btn small', onclick: showJournal }, `Diario de viaje · ${G.atlas.length}/${A.places.length}`);
    body.append(el('div', { class: 'atlas' },
      el('div', { class: 'atlas-bar' },
        el('span', { class: 'muted small' }, 'Pulsa un lugar del mapa, o el símbolo de una ciudad para ver todos sus lugares.'),
        journalBtn),
      el('div', { class: 'atlas-stage' }, emblems.piltover, map, emblems.zaun, detail),
      el('small', { class: 'muted atlas-credit' }, A.credit)));

    /** Actualiza el elemento de interfaz que recibe el foco. */
    function setFocus(city) {
      focus = city;
      map.classList.toggle('focus', Boolean(city));
      pins.forEach((pin, i) => pin.classList.toggle('dim', Boolean(city) && A.places[i].city !== city && A.places[i].city !== null));
      Object.entries(emblems).forEach(([c, b]) => b.classList.toggle('active', c === city));
    }

    /** Presenta la vista de una ciudad. */
    function showCity(city) {
      Audio2.sfx.click();
      setFocus(city);
      const list = A.places.filter((p) => p.city === city);
      detail.innerHTML = '';
      detail.append(
        el('button', { class: 'btn ghost small atlas-back', onclick: () => { detail.classList.add('hidden'); setFocus(null); } }, '← Volver al mapa'),
        el('div', { class: 'atlas-copy' },
          el('div', { class: 'atlas-cityhead' }, el('img', { src: `img/arte/simbolos/${city}.png`, alt: '' }), el('h2', {}, CITY[city])),
          el('p', {}, city === 'piltover' ? A.places.find((p) => p.id === 'piltover').intro : A.places.find((p) => p.id === 'zaun').intro),
          el('div', { class: 'atlas-journal' }, list.map((p) => el('button', { class: 'atlas-jitem', onclick: () => showPlace(p) },
            el('img', { class: 'atlas-thumb', src: placeArt(p), alt: '' }), el('span', {}, p.name))))));
      detail.classList.remove('hidden');
    }

    // Foto de la carpeta lugares (la propia, o la que viaja con el juego) o, si falta, la ilustración del atlas.
    function placeArt(p) {
      return (p.scene && window.CustomArt.image('lugares', p.scene)) || `img/atlas/${p.id}.webp`;
    }

    /** Abre la ficha del lugar visitado. */
    function showPlace(p) {
      Audio2.sfx.click();
      const hidden = p.spoiler && !spoilers;
      const people = p.people.filter((id) => G.unlocked.includes(id) && !isFallen(id));
      const unknown = p.people.length - people.length;
      detail.innerHTML = '';
      detail.append(
        el('button', { class: 'btn ghost small atlas-back', onclick: () => detail.classList.add('hidden') }, '← Volver al mapa'),
        el('div', { class: 'atlas-card' },
          el('img', { class: `atlas-art${p.scene && window.CustomArt.image('lugares', p.scene) ? ' photo' : ''}`, src: placeArt(p), alt: p.name }),
          el('div', { class: 'atlas-copy' },
            el('h2', {}, p.name),
            hidden
              ? el('p', { class: 'muted' }, 'Este lugar contiene detalles de la Parte II: Las consecuencias. Activa los spoilers en Ajustes para leerlo.')
              : el('p', {}, p.intro),
            hidden ? null : el('ul', { class: 'atlas-poi' }, p.poi.map(([t, d]) => el('li', {}, el('strong', {}, t), ` · ${d}`))),
            p.people.length ? el('h3', {}, 'Aquí puedes encontrar a') : null,
            p.people.length ? el('div', { class: 'row gap wrap' },
              people.map((id) => el('button', { class: 'chip', onclick: () => openOverlay('chats', id) }, `${charName(id)}`)),
              unknown ? el('span', { class: 'chip muted' }, `??? ×${unknown}`) : null) : null,
            el('div', { class: 'row gap wrap atlas-actions' },
              el('button', { class: `btn ${G.atlas.includes(p.id) ? '' : 'primary'} small`, onclick: () => explore(p) },
                G.atlas.includes(p.id) ? '✓ Explorado' : 'Explorar este lugar'),
              p.codex ? el('button', { class: 'btn ghost small', onclick: () => openOverlay('codice', p.codex) }, codexKnown(p.codex) ? 'Ver en el Códice' : 'Códice (???)') : null))));
      detail.classList.remove('hidden');
    }

    /** Regresa a la exploración del mundo. */
    function explore(p) {
      if (!G.atlas.includes(p.id)) {
        G.atlas.push(p.id);
        Audio2.sfx.unlock();
        toast(`${p.name} añadido a tu diario de viaje (${G.atlas.length}/${A.places.length})`, 'good');
        pins[A.places.indexOf(p)]?.classList.add('explored');
        journalBtn.textContent = `Diario de viaje · ${G.atlas.length}/${A.places.length}`;
        persist();
      }
      showPlace(p);
    }

    /** Muestra el diario y el progreso narrativo. */
    function showJournal() {
      const done = A.places.filter((p) => G.atlas.includes(p.id));
      detail.innerHTML = '';
      detail.append(
        el('button', { class: 'btn ghost small atlas-back', onclick: () => detail.classList.add('hidden') }, '← Volver al mapa'),
        el('div', { class: 'atlas-copy' },
          el('h2', {}, `Diario de viaje · ${done.length}/${A.places.length}`),
          done.length
            ? el('div', { class: 'atlas-journal' }, done.map((p) => el('button', { class: 'atlas-jitem', onclick: () => showPlace(p) },
              el('img', { class: 'atlas-thumb', src: placeArt(p), alt: '' }), el('span', {}, p.name))))
            : el('p', { class: 'muted' }, 'Aún no has explorado ningún lugar. Pulsa uno en el mapa para empezar tu viaje.')));
      detail.classList.remove('hidden');
    }

    const start = A.places.find((p) => p.id === placeId);
    if (start) showPlace(start);
  }

  /** Construye el botón de cierre de un panel. */
  function closeBtn() {
    return el('button', { class: 'btn ghost small', onclick: closeOverlay }, `✕ Cerrar${keyHint('Esc')}`);
  }

  /** Cierra el panel superpuesto activo. */
  function closeOverlay() {
    if (busy && overlayKind === 'historia') {
      toast('Espera a que termine la escena (o pulsa «Saltar»).', 'warn');
      return;
    }
    overlayKind = null;
    const box = $('#overlay');
    if (box) { box.className = 'overlay'; box.innerHTML = ''; }
    updateHud();
    World.pause(false);
  }

  /** Abre los ajustes sin abandonar la partida. */
  function openSettingsOverlay() {
    const box = $('#overlay');
    box.innerHTML = '';
    const holder = el('div', { class: 'overlay-scroll' });
    box.append(holder);
    window.App.renderSettings(holder, () => openOverlay('menu'));
  }

  /** Presenta la ayuda y controles. */
  function showHelp() {
    if (U.touch) {
      showNotice('Controles', [
        'Moverse: arrastra el joystick de abajo a la izquierda (empújalo hasta el borde para correr). También puedes tocar un punto del mapa para ir allí.',
        'Hablar, entrar o usar: botón ✦ de abajo a la derecha, o toca el aviso que sale en pantalla.',
        'Cámara 3D: pellizca con dos dedos para acercar o alejar, y gira los dos dedos para rotar la vista.',
        'Los botones de abajo abren la historia, el comunicador, la ficha, el Códice, el Atlas y la pausa. El botón «atrás» del móvil cierra ventanas y pausa.',
        'Recoge los hexágonos azules del mapa para completar el Códice. Las actividades de cada lugar suben tus estadísticas, que desbloquean opciones en la historia.',
      ].join('\n'));
      return;
    }
    showNotice('Controles', [
      'Moverse: WASD o flechas (Mayús para correr). También puedes hacer clic en el mapa.',
      'Interactuar / hablar / entrar: E o Intro.',
      'Cámara 3D: rueda del ratón (o + y −) para acercar o alejar, Q y R para girar, botón derecho arrastrando para girar e inclinar.',
      'H: historia · C: comunicador · F: ficha · K: Códice · M: Atlas de las Dos Ciudades · Esc: pausa.',
      'Recoge los hexágonos azules del mapa para completar el Códice. Las actividades de cada lugar suben tus estadísticas, que desbloquean opciones en la historia.',
    ].join('\n'));
  }

  /** Abre la interfaz narrativa del capítulo. */
  function openStory() {
    if (!G.progress.started && !G.progress.finished) {
      G.progress.started = true;
      openOverlay('historia');
      startChapter();
    } else openOverlay('historia');
  }

  /** Sale al menú principal conservando el estado necesario. */
  function exitToTitle() {
    World.stop();
    G = null;
    overlayKind = null;
    window.App.go('home');
  }

  // ---------------- Estructura de la pantalla ----------------
  // Pantalla principal: el mapa del mundo abierto con el HUD encima.
  function renderPlay() {
    const root = $('#view-game');
    root.innerHTML = '';
    const canvas = el('canvas', { id: 'world-canvas' });
    const mini = el('canvas', { id: 'world-mini', width: 210, height: 154 });
    const hudBtn = (label, key, fn, icon) => el('button', { class: 'hud-btn', title: key, onclick: fn }, el('i', { class: 'hud-ico' }, icon), el('span', { class: 'hud-label' }, label), el('kbd', {}, key));
    root.append(el('div', { class: 'world' },
      canvas,
      el('div', { class: 'hud hud-top' },
        el('div', { class: 'hud-card', onclick: () => openOverlay('ficha') },
          el('span', { class: 'avatar', html: Portrait.forPlayer(G.player) }),
          el('div', {}, el('strong', {}, G.player.name), el('small', { id: 'world-district', class: 'muted' }, ''), el('div', { id: 'hud-stats', class: 'hud-stats' }))),
        el('div', { id: 'hud-objective', class: 'hud-card objective', onclick: () => { if (G.progress.started) openStory(); } })),
      el('div', { class: 'hud hud-mini' }, mini, el('small', { id: 'hud-codex', class: 'muted' })),
      el('div', { id: 'world-prompt', class: 'world-prompt', onclick: () => World.interact() }),
      el('div', { class: 'hud hud-bottom' },
        hudBtn('Historia', 'H', () => openOverlay('historia'), '📜'),
        hudBtn('Comunicador', 'C', () => openOverlay('chats'), '💬'),
        hudBtn('Ficha', 'F', () => openOverlay('ficha'), '👤'),
        hudBtn('Códice', 'K', () => openOverlay('codice'), '📖'),
        hudBtn('Atlas', 'M', () => openOverlay('codice', null, 'atlas'), '🗺'),
        hudBtn('Pausa', 'Esc', () => openOverlay('menu'), '⏸')),
      el('div', { id: 'overlay', class: 'overlay' })));
    World.start(G, worldCallbacks(), canvas, mini);
    updateHud();
    if (!G.flags.__help) {
      G.flags.__help = true;
      showHelp();
    }
  }

  /** Crea un botón de navegación entre pestañas. */
  function tabBtn(id, label) {
    return el('button', { class: `tab${tab === id ? ' active' : ''}`, 'data-tab': id, onclick: () => setTab(id) }, label);
  }

  /** Activa una pestaña y actualiza sus contenidos. */
  function setTab(t, who) {
    if (overlayKind !== t && ['historia', 'chats', 'ficha'].includes(t) && !$('#play-main')) return openOverlay(t, who);
    overlayKind = t;
    tab = t;
    if (who !== undefined) contact = who;
    document.querySelectorAll('.tabs-v .tab').forEach((b) => b.classList.toggle('active', b.dataset.tab === tab));
    renderContacts();
    renderMain();
  }

  /** Muestra los contactos conocidos del jugador. */
  function renderContacts() {
    const list = $('#contact-list');
    if (!list) return;
    list.innerHTML = '';
    const alive = talkable();
    list.append(el('h4', {}, `Personajes desbloqueados (${alive.length})`));
    if (!alive.length) list.append(el('p', { class: 'muted small' }, 'Avanza en la historia para conocer a gente.'));
    for (const id of alive) {
      const a = affOf(id);
      list.append(el('button', {
        class: `contact${tab === 'chats' && contact === id ? ' active' : ''}`,
        onclick: () => setTab('chats', id),
      },
      el('span', { class: 'avatar sm', html: Portrait.forCharacter(id) }),
      el('span', { class: 'c-body' }, el('strong', {}, charName(id), window.CHAT[id] && freshTopics(id) ? el('em', { class: 'new', title: 'Temas nuevos' }, ' ✦') : null),
        Relations.status(G, id) ? el('small', { class: `c-rel rel-${Relations.status(G, id)}` }, `${window.RELATIONS.kinds[Relations.status(G, id)]?.icon || ''} ${tpl(Relations.label(G, id), G.player)}`) : null,
        heart(a))));
    }
    // Quienes han muerto en la historia: se les recuerda, pero ya no responden.
    const gone = G.unlocked.filter(isFallen);
    if (gone.length) {
      list.append(el('h4', { class: 'c-memory-head' }, 'En memoria'));
      for (const id of gone) {
        list.append(el('div', { class: 'contact fallen', title: 'Ya no está' },
          el('span', { class: 'avatar sm', html: Portrait.forCharacter(id) }),
          el('span', { class: 'c-body' }, el('strong', {}, charName(id)), el('small', { class: 'muted' }, id === 'jinx' ? 'Desaparecida' : 'Ya no está'))));
      }
    }
  }

  // Afinidad como fila de 10 marcas (rojas si es negativa).
  function heart(a) {
    return el('small', { class: `aff${a < 0 ? ' neg' : ''}`, title: `Afinidad ${a}/10` },
      el('span', { class: 'aff-pips', style: `--p:${Math.min(10, Math.abs(a)) * 10}%` }),
      el('b', {}, String(a)));
  }

  /** Dibuja la vista principal del comunicador. */
  function renderMain() {
    const main = $('#play-main');
    if (!main) return;
    main.innerHTML = '';
    if (tab === 'historia') renderStory(main);
    else if (tab === 'chats') renderChat(main);
    else renderSheet(main);
  }

  // ---------------- Historia ----------------
  function renderStory(main) {
    const ch = chapterById(G.progress.chapterId);
    if (!G.progress.started && !G.progress.finished) {
      main.append(el('div', { class: 'wiki-empty' },
        el('h2', {}, ch.title),
        el('p', {}, ch.intro),
        el('p', { class: 'gold' }, `★ Ve a «${objectiveName()}» en el mapa y ${U.touch ? 'toca ✦' : 'pulsa E'} para comenzar.`),
        el('button', { class: 'btn primary', onclick: closeOverlay }, 'Volver al mapa')));
      return;
    }
    main.append(
      el('header', { class: 'scene-head', id: 'scene-head' },
        el('div', {}, el('small', { class: 'muted' }, G.progress.season === 2 ? 'Parte II · Las consecuencias' : G.progress.route === 'zaun' ? 'Parte I · El inicio (Zaun)' : 'Parte I · El inicio (Piltover)'), el('h2', {}, ch.title)),
        el('div', { class: 'row gap' },
          el('button', { class: 'btn ghost small', title: 'Saltar animación', onclick: () => { skipping = true; } }, 'Saltar'))),
      el('canvas', { id: 'scene-bg', class: 'scene-bg' }),
      el('div', { class: 'story-body' },
        el('div', { id: 'speaker', class: 'speaker' }, el('div', { class: 'speaker-art' }), el('div', { class: 'speaker-name' })),
        el('div', { id: 'story-log', class: 'log' })),
      el('div', { id: 'choices', class: 'choices' }));
    sceneCtl?.stop();
    sceneCtl = Scenes.mount($('#scene-bg'), currentBg());
    const last = [...G.log].reverse().find((m) => m.s !== 'narrador' && m.s !== 'sistema');
    setSpeaker(last?.s || null);
    const log = $('#story-log');
    for (const m of G.log) log.append(bubble(m.s, m.t, true));
    log.scrollTop = log.scrollHeight;
    if (!busy) showChoices(currentChoices());
  }

  /** Construye un globo de diálogo. */
  function bubble(s, text, instant) {
    const isMe = s === 'yo';
    const isNarr = s === 'narrador' || s === 'sistema';
    const b = el('div', { class: `msg ${isMe ? 'me' : isNarr ? 'narr' : 'them'}${s === 'sistema' ? ' sys' : ''}${instant ? '' : ' pop'}` },
      !isMe && !isNarr ? el('span', { class: 'avatar sm', html: Portrait.forCharacter(s) }) : null,
      isMe ? el('span', { class: 'avatar sm', html: Portrait.forPlayer(G.player) }) : null,
      el('div', { class: 'bubble' },
        !isNarr ? el('b', { class: 'who' }, isMe ? G.player.name : charName(s)) : null,
        el('span', {}, text)));
    return b;
  }

  /** Desplaza el historial del diálogo al mensaje visible. */
  function scrollLog() {
    const log = $('#story-log');
    if (log) log.scrollTop = log.scrollHeight;
  }

  // ---------- Escena animada y busto del personaje que habla ----------
  let sceneCtl = null;
  let speakerCtl = null;
  let speakerId = undefined;

  /** Determina el fondo que corresponde a la escena actual. */
  function currentBg() {
    const ch = chapterById(G.progress.chapterId);
    return (G.progress.node && ch.nodes[G.progress.node]?.bg) || ch.nodes[ch.start]?.bg || G.player.origin;
  }

  /** Cambia el fondo visual de la historia. */
  function setBg(bg) {
    if (bg) sceneCtl?.set(bg);
  }

  /** Actualiza el nombre y retrato del hablante. */
  function setSpeaker(s) {
    const box = $('#speaker');
    if (!box) return;
    if (s === 'narrador' || s === 'sistema' || !s) {
      box.classList.remove('show');
      return;
    }
    box.classList.add('show');
    if (speakerId === s && box.querySelector('canvas, img')?.isConnected) return;
    speakerId = s;
    speakerCtl?.stop();
    speakerCtl = null;
    const art = box.querySelector('.speaker-art');
    art.innerHTML = '';
    box.querySelector('.speaker-name').textContent = s === 'yo' ? G.player.name : charName(s);
    // En la historia solo salen los avatares de chat (caras), nunca retratos generados.
    const face = s === 'yo' ? G.player.photo : Portrait.customChar(s, false);
    if (!face) {
      box.classList.remove('show');
      return;
    }
    art.append(el('img', { src: face, alt: '' }));
    box.classList.remove('swap');
    void box.offsetWidth;
    box.classList.add('swap');
  }

  /** Inicia una conversación con un personaje. */
  function talk(v) {
    speakerCtl?.talk(v);
  }

  /** Comprueba si una línea puede mostrarse según el estado. */
  function lineVisible(line) {
    return condMet(line.cond);
  }

  // Condiciones de una línea o de una opción (todas deben cumplirse):
  // flag/notFlag, met/notMet (ya conoces a ese personaje), kin/notKin (es de tu familia),
  // origin (zaun | piltover, de dónde viene tu personaje).
  function condMet(c) {
    if (!c) return true;
    if (c.flag && !G.flags[c.flag]) return false;
    if (c.notFlag && G.flags[c.notFlag]) return false;
    if (c.met && !G.met.includes(c.met)) return false;
    if (c.notMet && G.met.includes(c.notMet)) return false;
    if (c.kin && !kinOf(G).includes(c.kin)) return false;
    if (c.notKin && kinOf(G).includes(c.notKin)) return false;
    if (c.origin && G.player.origin !== c.origin) return false;
    return true;
  }

  // Muertes del canon: STORY.deaths = { id: capítulo en el que muere }.
  // Cuentan si ese capítulo ya terminó en tu partida (en la T2, toda la T1 ha terminado).
  function chapterDone(chId) {
    const p = G.progress;
    if (p.season === 2 && !S().routes.t2.includes(chId)) return true;
    const route = S().routes[p.route] || [];
    const i = route.indexOf(chId);
    if (i < 0) return false;
    return i < p.chapterIdx || (i === p.chapterIdx && (p.finished || p.chapterEnded));
  }
  /** Actualiza quién ha caído en esta partida, respetando los rescates alternativos. */
  function syncFallen() {
    G.fallen = Object.entries(S().deaths || {}).filter(([id, ch]) =>
      chapterDone(ch) && !(S().rescues?.[id] && G.flags[S().rescues[id]])
    ).map(([id]) => id);
  }
  // Tras un capítulo: avisa de quién ya no está.
  function announceFallen() {
    const before = new Set(G.fallen || []);
    syncFallen();
    const gone = G.fallen.filter((id) => !before.has(id) && G.met.includes(id));
    if (!gone.length) return;
    pushLog('sistema', `En memoria: ${gone.map(charName).join(', ')}. Ya no aparecerán en el comunicador.`);
    $('#story-log')?.append(bubble('sistema', G.log[G.log.length - 1].t));
    scrollLog();
  }

  /** Inicia un capítulo desde su nodo de entrada. */
  async function startChapter() {
    const ch = chapterById(G.progress.chapterId);
    busy = true;
    await Cinematic.chapterCard(ch, ch.nodes[ch.start]?.bg || G.player.origin);
    busy = false;
    pushLog('sistema', `— ${ch.title} —`);
    pushLog('narrador', ch.intro);
    renderStoryIfVisible();
    playNode(ch.start);
  }

  /** Añade una línea al historial narrativo. */
  function pushLog(s, t) {
    G.log.push({ s, t });
  }

  /** Redibuja la historia si su vista está activa. */
  function renderStoryIfVisible() {
    if (tab === 'historia') renderMain();
  }

  /** Calcula el tiempo de lectura o animación de un mensaje. */
  function delayFor(text) {
    const speed = window.App.settings.textSpeed;
    if (speed === 'instantaneo') return 120;
    const base = speed === 'rapido' ? 250 : speed === 'lento' ? 1100 : 600;
    return base + Math.min(2200, text.length * (speed === 'rapido' ? 8 : speed === 'lento' ? 30 : 18));
  }

  // Reproduce un nodo: muestra sus líneas una a una (con voz) y luego sus opciones.
  async function playNode(nodeId, resume = false) {
    const ch = chapterById(G.progress.chapterId);
    // Partidas guardadas en una escena que ya no existe: vuelve al inicio del capítulo.
    if (!ch.nodes[nodeId]) { nodeId = ch.start; resume = false; }
    const node = ch.nodes[nodeId];
    G.progress.node = nodeId;
    setBg(node.bg);
    if (node.ending) return playEnding();
    if (resume && G.progress.linesShown) {
      showChoices(currentChoices());
      return;
    }
    busy = true;
    skipping = false;
    showChoices([]);
    const lines = node.lines.filter(lineVisible);
    // Quien habla en una escena pasa a ser alguien que ya conoces.
    lines.forEach((l) => { if (S().cast.includes(l.s) && !G.met.includes(l.s)) G.met.push(l.s); });
    for (const line of lines) {
      const text = tpl(line.t, G.player);
      if (tab === 'historia' && !skipping && window.App.settings.textSpeed !== 'instantaneo') {
        const typing = typingIndicator(line.s);
        await sleep(skipping ? 0 : 350);
        typing?.remove();
      }
      pushLog(line.s, text);
      if (tab === 'historia') {
        setSpeaker(line.s);
        $('#story-log')?.append(bubble(line.s, text, skipping));
        scrollLog();
        if (!skipping) Audio2.sfx.message();
      }
      if (!skipping && tab === 'historia') {
        talk(line.s !== 'narrador');
        await skipWait(delayFor(text));
        talk(false);
      }
    }
    busy = false;
    G.progress.linesShown = true;
    await persist();
    if (node.end) return endChapter();
    if (node.next && !node.choices) return advance(node.next);
    showChoices(currentChoices());
  }

  // Espera cancelable por el botón «Saltar».
  async function skipWait(ms) {
    const t0 = Date.now();
    while (Date.now() - t0 < ms && !skipping) await sleep(60);
  }

  /** Muestra u oculta la indicación de escritura. */
  function typingIndicator(s) {
    const log = $('#story-log');
    if (!log || s === 'narrador' || s === 'sistema') return null;
    const t = el('div', { class: `msg ${s === 'yo' ? 'me' : 'them'} typing` }, el('div', { class: 'bubble' }, el('i'), el('i'), el('i')));
    log.append(t);
    scrollLog();
    return t;
  }

  /** Avanza al siguiente mensaje o nodo narrativo. */
  function advance(next) {
    G.progress.linesShown = false;
    playNode(next);
  }

  /** Obtiene las decisiones disponibles en el nodo actual. */
  function currentChoices() {
    if (G.progress.finished) return [];
    const ch = chapterById(G.progress.chapterId);
    const node = ch?.nodes[G.progress.node];
    if (!node || !G.progress.linesShown) return [];
    if (node.choices) return node.choices;
    if (node.end) return [{ t: 'Volver al mapa: siguiente objetivo →', __next: true }];
    return [];
  }

  /** Evalúa si se cumplen los requisitos de una opción. */
  function reqMet(req) {
    if (!req) return true;
    if (req.stat) return (G.stats[req.stat] || 0) >= req.min;
    if (req.flag) return Boolean(G.flags[req.flag]);
    if (req.notFlag) return !G.flags[req.notFlag];
    if (req.aff) return affOf(req.aff[0]) >= req.aff[1];
    return condMet(req);
  }

  // Las opciones que dependen de un flag, de a quién conoces o de tu familia se ocultan;
  // las que dependen de estadística o afinidad se muestran bloqueadas.
  function reqHidden(req) {
    return req && (req.flag || req.notFlag || req.met || req.notMet || req.kin || req.notKin || req.origin) && !reqMet(req);
  }

  /** Construye los botones de decisión del jugador. */
  function showChoices(choices) {
    const box = $('#choices');
    if (!box) return;
    box.innerHTML = '';
    if (G.progress.finished) {
      box.append(el('div', { class: 'end-actions' },
        G.progress.season !== 2 ? el('button', { class: 'btn primary hex-btn', onclick: startSeason2 }, 'Comenzar la Parte II · Las consecuencias') : null,
        talkable().length ? el('button', { class: 'btn', onclick: () => setTab('chats', talkable()[0]) }, 'Seguir chateando con los personajes') : null,
        el('button', { class: 'btn', onclick: () => setTab('ficha') }, 'Ver mi ficha'),
        el('button', { class: 'btn ghost', onclick: replayRoute }, 'Rejugar la ruta con este personaje')));
      return;
    }
    choices.filter((c) => !reqHidden(c.req)).forEach((c, i) => {
      const ok = reqMet(c.req);
      box.append(el('button', {
        class: `choice${ok ? '' : ' locked'}`,
        disabled: !ok,
        title: ok ? '' : 'No cumples el requisito',
        onclick: () => choose(c),
      }, el('span', { class: 'num' }, i + 1), tpl(c.t, G.player), !ok ? el('em', {}, '') : null));
    });
  }

  /** Aplica las consecuencias de una decisión al estado del juego. */
  function applyFx(fx = {}) {
    for (const [k, v] of Object.entries(fx.aff || {})) {
      G.aff[k] = Math.max(-10, Math.min(10, affOf(k) + v));
    }
    for (const [k, v] of Object.entries(fx.rep || {})) G.rep[k] = (G.rep[k] || 0) + v;
    for (const [k, v] of Object.entries(fx.stats || {})) {
      G.stats[k] = (G.stats[k] || 0) + v;
      toast(`${S().stats[k].label} +${v}`, 'good');
    }
    (fx.flags || []).forEach((f) => { G.flags[f] = true; });
  }

  /** Procesa la decisión elegida y avanza la historia. */
  async function choose(c) {
    if (busy) return;
    Audio2.sfx.choice();
    if (c.__next) return nextChapter();
    const text = tpl(c.t, G.player);
    pushLog('yo', text);
    $('#story-log')?.append(bubble('yo', text));
    scrollLog();
    applyFx(c.fx);
    renderContacts();
    if (c.game) {
      busy = true;
      const win = await Minigames.play(c.game.id, { bonus: mgBonus(c.game.id) });
      busy = false;
      if (win) applyFx(c.game.winFx);
      pushLog('sistema', win ? '¡Lo has conseguido!' : 'No ha salido como esperabas…');
      $('#story-log')?.append(bubble('sistema', G.log[G.log.length - 1].t));
      return advance(win ? c.game.win : c.game.lose);
    }
    advance(c.next);
  }

  /** Registra la conclusión del capítulo actual. */
  async function endChapter() {
    const ch = chapterById(G.progress.chapterId);
    G.progress.chapterEnded = true;
    // Solo se puede chatear con quien has conocido de verdad en la historia.
    const fresh = (ch.unlocks || []).filter((id) => !G.unlocked.includes(id) && G.met.includes(id));
    G.unlocked.push(...fresh);
    announceFallen();
    const alive = fresh.filter((id) => !isFallen(id));
    if (alive.length) {
      Audio2.sfx.unlock();
      pushLog('sistema', `✦ Personajes desbloqueados para chatear: ${alive.map(charName).join(', ')}`);
      $('#story-log')?.append(bubble('sistema', G.log[G.log.length - 1].t));
      scrollLog();
      toast(`Nuevos contactos: ${alive.map(charName).join(', ')}`, 'good');
    }
    renderContacts();
    await persist();
    showChoices(currentChoices());
  }

  /** Determina cuál es el siguiente capítulo narrativo. */
  async function nextChapter() {
    const route = S().routes[G.progress.route];
    G.progress.chapterIdx += 1;
    G.progress.chapterId = route[G.progress.chapterIdx];
    G.progress.node = null;
    G.progress.linesShown = false;
    G.progress.chapterEnded = false;
    G.progress.started = false;
    if (G.progress.chapterId === 'fin') Audio2.playMusic('final');
    await persist();
    closeOverlay();
    toast(`Nuevo objetivo: ve a ${objectiveName()}`, 'good');
  }

  // ---------- Efectos de clase, habilidades y talento ----------
  function buildParts() {
    const C = window.CREATION;
    const p = G.player;
    const cls = C.classes?.find((c) => c.id === p.cls);
    const abs = ['Q', 'W', 'E', 'R'].map((k) => C.abilities?.[k]?.find((a) => a.id === p.abilities?.[k])).filter(Boolean);
    return { cls, abs };
  }

  // Ventaja en un minijuego según la clase, las habilidades y el talento «Veterano».
  function mgBonus(id) {
    const { cls, abs } = buildParts();
    let b = (cls?.passive.bonus?.[id] || 0) + abs.reduce((a, x) => a + (x.bonus?.[id] || 0), 0);
    if (G.player.keystone === 'veterano') b += 1;
    return Math.min(4, b);
  }

  // Afinidad ganada con cada tema nuevo de conversación.
  function chatGain() {
    const { cls, abs } = buildParts();
    let g = 1 + (cls?.passive.chat || 0) + abs.reduce((a, x) => a + (x.chat || 0), 0);
    if (G.player.keystone === 'encanto') g *= 2;
    return Math.min(4, g);
  }

  // Todos los finales de ambas temporadas.
  function allEndings() {
    return [...S().endings, ...(S().endings2 || [])];
  }

  /** Ejecuta el final alcanzado por las decisiones. */
  async function playEnding() {
    const ch = chapterById(G.progress.chapterId);
    const set = ch.nodes[G.progress.node]?.endingSet === 'endings2' ? S().endings2 : S().endings;
    const ending = set.find((e) => e.test(G));
    if (!ending) throw new Error('No se ha encontrado un final válido para esta partida');
    busy = true;
    skipping = false;
    pushLog('sistema', `— ${ending.title} —`);
    $('#story-log')?.append(bubble('sistema', `— ${ending.title} —`));
    for (const line of ending.lines.filter(lineVisible)) {
      const text = tpl(line.t, G.player);
      pushLog(line.s, text);
      setSpeaker(line.s);
      $('#story-log')?.append(bubble(line.s, text, skipping));
      scrollLog();
      if (!skipping && tab === 'historia') {
        talk(line.s !== 'narrador');
        await skipWait(delayFor(text));
        talk(false);
      }
    }
    busy = false;
    if (!G.endings.includes(ending.id)) G.endings.push(ending.id);
    G.progress.finished = true;
    talk(false);
    await Cinematic.play([
      { scene: ending.scene || 'puente', dur: 7, kicker: G.progress.season === 2 ? 'Fin de la Parte II' : 'Fin de la Parte I', title: ending.title.replace('Final · ', ''), lines: [G.progress.season === 2 ? 'Gracias por jugar. La historia de Piltover y Zaun termina aquí… por ahora.' : 'Tu historia queda escrita en las dos ciudades. Pero la guerra apenas empieza…'], zoom: [1.0, 1.2], align: 'center' },
    ]);
    const fresh = (ch.unlocks || []).filter((id) => !G.unlocked.includes(id) && G.met.includes(id));
    G.unlocked.push(...fresh);
    announceFallen();
    const alive = fresh.filter((id) => !isFallen(id));
    if (alive.length) {
      Audio2.sfx.unlock();
      pushLog('sistema', `✦ Personajes desbloqueados para chatear: ${alive.map(charName).join(', ')}`);
      $('#story-log')?.append(bubble('sistema', G.log[G.log.length - 1].t));
    }
    pushLog('sistema', `Has conseguido ${G.endings.length} de ${allEndings().length} finales.${G.progress.season === 2 ? ' ¡Gracias por jugar!' : ' La Parte II · Las consecuencias te espera.'}`);
    $('#story-log')?.append(bubble('sistema', G.log[G.log.length - 1].t));
    scrollLog();
    renderContacts();
    await persist();
    showChoices([]);
  }

  // Temporada 2: continúa la partida con las consecuencias de la primera.
  async function startSeason2() {
    if (!window.App.settings.spoilers && !confirm('La Parte II · Las consecuencias contiene acontecimientos importantes de Arcane. ¿Quieres continuar?')) return;
    const route = S().routes.t2;
    G.flags[`s1_${G.endings[G.endings.length - 1] || 'humo'}`] = true;
    G.progress = { route: 't2', season: 2, chapterIdx: 0, chapterId: route[0], node: null, chapterTitle: chapterById(route[0]).title, finished: false, started: false };
    syncFallen();
    G.log = [];
    G.acts = {};
    await persist();
    closeOverlay();
    await Cinematic.play([
      { scene: 'puente-zaun', dur: 6, kicker: 'Grietas & Gears', title: 'Parte II · Las consecuencias', lines: ['Después del ataque, nada es igual.'], zoom: [1.2, 1.0], align: 'center' },
      { scene: 'consejo', dur: 6, lines: ['Piltover entierra a sus muertos y busca culpables.'], zoom: [1.0, 1.15], pan: [[-0.4, 0], [0.4, 0]] },
      { scene: 'noxus', dur: 6, lines: ['Al otro lado del mar, Noxus afila sus espadas.'], zoom: [1.1, 1.0] },
      { scene: 'fabrica', dur: 6, lines: ['Y en lo más hondo de Zaun, alguien promete un mundo sin dolor.'], zoom: [1.0, 1.2] },
    ]);
    Audio2.playMusic('final');
    toast(`Parte II · Las consecuencias: ve a ${objectiveName()}`, 'good');
    updateHud();
  }

  // Vuelve a empezar la ruta conservando ficha, finales y personajes desbloqueados.
  async function replayRoute() {
    if (!confirm('¿Rejugar la ruta? Conservas tu ficha, tus finales y tus contactos, pero se reinician las decisiones.')) return;
    const route = S().routes[G.progress.route];
    G.flags = G.player.family !== 'ninguna' ? { familia_famosa: true } : {};
    G.rep = { zaun: G.player.origin === 'zaun' ? 1 : 0, piltover: G.player.origin === 'piltover' ? 1 : 0 };
    G.progress = { route: G.progress.route, season: G.progress.season, chapterIdx: 0, chapterId: route[0], node: null, chapterTitle: '', finished: false, started: false };
    // Al rejugar, los que murieron en esta ruta vuelven a estar vivos hasta su capítulo.
    syncFallen();
    G.log = [];
    G.acts = {};
    await persist();
    closeOverlay();
    toast(`Objetivo: ve a ${objectiveName()}`, 'good');
  }

  // ---------------- Conversaciones con opciones ----------------
  // Cada personaje tiene un árbol de diálogo (src/data/chat.js): eliges qué decir
  // entre varias respuestas y su tono cambia la afinidad, tus estadísticas o la historia.
  const TONES = { amable: 'Amable', broma: 'Broma', duro: 'Dura', pregunta: 'Pregunta', coqueto: 'Coqueta', astuto: 'Astuta', serio: 'Seria', sigilo: 'Sigilo' };
  let talking = false;

  /** Calcula el estado de la relación al iniciar una charla. */
  function talkState() {
    G.talk = G.talk || { at: {}, seen: {} };
    return G.talk;
  }

  /** Genera una clave estable para identificar una conversación. */
  function dlgKey(id, node, o) {
    return `${id}:${node}:${o.t}`;
  }

  // Requisitos de una opción. aff: n se refiere al personaje con el que hablas.
  function dlgReq(req, id) {
    if (!req) return true;
    const season = G.progress.season || 1;
    if (typeof req.aff === 'number' && affOf(id) < req.aff) return false;
    if (Array.isArray(req.aff) && affOf(req.aff[0]) < req.aff[1]) return false;
    if (req.stat && (G.stats[req.stat] || 0) < req.min) return false;
    if (req.season && season < req.season) return false;
    if (req.maxSeason && season > req.maxSeason) return false;
    return condMet(req);
  }

  /** Decide si una opción de diálogo debe ocultarse. */
  function dlgHidden(req, id) {
    if (!req) return false;
    const season = G.progress.season || 1;
    if ((req.season && season < req.season) || (req.maxSeason && season > req.maxSeason)) return true;
    return !condMet(req);
  }

  /** Describe de forma legible el requisito de una opción. */
  function reqLabel(req) {
    if (!req) return '';
    if (req.stat) return `[${S().stats[req.stat].label} ${req.min}]`;
    if (typeof req.aff === 'number') return `[Afinidad ${req.aff}]`;
    if (req.aff) return `[Afinidad con ${charName(req.aff[0])} ${req.aff[1]}]`;
    return '';
  }

  // Opciones visibles en un nodo de la conversación.
  function dlgOptions(id) {
    const data = window.CHAT[id];
    const at = talkState().at[id] || 'hub';
    if (at === 'bye') return [];
    let base = at === 'hub' ? data.hub : data.nodes?.[at]?.opts || [];
    // Temas que se añaden a todos: charla con respuestas variadas y las relaciones.
    if (at === '__charla') base = window.RELATIONS.small.map((x) => ({ ...x, __small: x.id }));
    if (at === '__rel') base = Relations.relOptions(G, id, affOf(id));
    if (at === 'hub') {
      const extra = [{ t: 'Charlar un rato…', tone: 'amable', go: '__charla', __menu: true }];
      const hang = Relations.hangLabel(G, id);
      if (hang) extra.push({ t: hang, tone: 'amable', __hang: true });
      if (Relations.status(G, id) || Relations.relOptions(G, id, affOf(id)).length) extra.push({ t: 'Lo nuestro…', tone: 'serio', go: '__rel', __menu: true });
      base = [...base, ...extra];
    }
    const seen = talkState().seen;
    const list = base.filter((o) => !dlgHidden(o.req, id) && !(o.once && seen[dlgKey(id, at, o)]))
      .map((o) => ({ ...o, __node: at }));
    if (at === 'hub') list.push({ t: 'Hasta luego.', tone: 'amable', go: 'bye', __node: at, __bye: true });
    else if (at.startsWith('__') || !data.nodes[at].noBack) list.push({ t: 'Cambiar de tema.', go: 'hub', __node: at, __back: true });
    return list;
  }

  // Temas que aún no has tocado con alguien (para el aviso en la cabecera).
  function freshTopics(id) {
    const data = window.CHAT[id];
    const seen = talkState().seen;
    return (data?.hub || []).filter((o) => !dlgHidden(o.req, id) && !seen[dlgKey(id, 'hub', o)]).length;
  }

  /** Dibuja el comunicador y la conversación actual. */
  function renderChat(main) {
    if (!talkable().length) {
      main.append(el('div', { class: 'wiki-empty' }, el('h2', {}, 'Aún no conoces a nadie'), el('p', {}, 'Juega la historia para desbloquear personajes con los que hablar.')));
      return;
    }
    if (!contact || !talkable().includes(contact)) contact = talkable()[0];
    const id = contact;
    if (!G.chats[id]) {
      G.chats[id] = [{ s: id, t: tpl(greeting(id), G.player) }];
      talkState().at[id] = 'hub';
    }
    const info = window.WIKI.personajes.find((p) => p.id === id);
    const art = Portrait.customChar(id, true) || Portrait.charURL(id, 384, true);
    // Comunicador: retrato grande con marco a la izquierda y la conversación a la derecha.
    main.append(
      el('div', { class: `chat-stage origin-${info?.origin === 'zaun' ? 'zaun' : 'piltover'}` },
        el('aside', { class: 'chat-portrait' },
          el('div', { class: 'cp-frame' },
            el('img', { src: art, alt: '', draggable: 'false' }),
            el('i', { class: 'cp-shine' })),
          el('div', { class: 'cp-plate' },
            el('h2', {}, charName(id)),
            el('small', {}, info?.role || '')),
          el('div', { class: 'cp-aff', id: 'chat-aff' }),
          el('div', { class: 'cp-rel', id: 'chat-rel' }),
          el('div', { class: 'cp-actions' },
            el('button', { class: 'btn ghost small', onclick: () => openOverlay('codice', id) }, 'Códice'),
            el('button', { class: 'btn ghost small', onclick: () => { G.chats[id] = null; talkState().at[id] = 'hub'; persist(); renderMain(); } }, 'Limpiar'))),
        el('section', { class: 'chat-convo' },
          el('header', { class: 'chat-head' },
            el('span', { class: 'avatar sm', html: Portrait.forCharacter(id) }),
            el('div', {}, el('b', {}, charName(id)), el('small', { id: 'chat-topics', class: 'muted' })),
            el('div', { class: 'chat-mode', role: 'tablist' },
              el('button', { class: `cm-btn${chatMode(id) === 'tree' ? ' on' : ''}`, onclick: () => setChatMode(id, 'tree') }, 'Opciones'),
              el('button', { class: `cm-btn${chatMode(id) === 'ai' ? ' on' : ''}`, title: 'Escribe lo que quieras (IA)', onclick: () => setChatMode(id, 'ai') }, '✦ Libre'))),
          el('div', { id: 'chat-log', class: 'log' }),
          el('div', { id: 'dlg-choices', class: 'choices' }))));
    refreshChatHead(id);
    const log = $('#chat-log');
    for (const m of G.chats[id]) log.append(bubble(m.s, m.t, true));
    showDialog(id);
    log.scrollTop = log.scrollHeight;
  }

  // Afinidad y temas pendientes en la cabecera del comunicador.
  function refreshChatHead(id) {
    const a = affOf(id);
    const aff = $('#chat-aff');
    if (aff) {
      aff.innerHTML = '';
      aff.append(el('span', { class: 'cp-aff-label' }, 'Afinidad'),
        el('span', { class: `cp-gems${a < 0 ? ' neg' : ''}` }, ...Array.from({ length: 10 }, (_, i) => el('i', { class: i < Math.abs(a) ? 'on' : '' }))),
        el('b', {}, `${a}/10`));
    }
    const rel = $('#chat-rel');
    if (rel) {
      const k = Relations.status(G, id);
      rel.textContent = k ? `${window.RELATIONS.kinds[k]?.icon || ''} ${tpl(Relations.label(G, id), G.player)}` : '';
      rel.className = `cp-rel${k ? ` rel-${k}` : ''}`;
    }
    const fresh = freshTopics(id);
    const top = $('#chat-topics');
    if (top) top.textContent = fresh ? `✦ ${fresh} tema${fresh > 1 ? 's' : ''} por descubrir` : 'Todo hablado por ahora';
  }

  // Modo del comunicador: opciones escritas o chat libre con IA.
  function chatMode(id) {
    return talkState().mode?.[id] || 'tree';
  }
  /** Cambia entre diálogo escrito y chat libre opcional. */
  function setChatMode(id, m) {
    talkState().mode = { ...(talkState().mode || {}), [id]: m };
    document.querySelectorAll('.chat-mode .cm-btn').forEach((b, i) => b.classList.toggle('on', (i === 1) === (m === 'ai')));
    showDialog(id);
    persist();
  }

  /** Muestra la entrada de texto del chat libre con IA. */
  function showAIBox(id, box) {
    box.classList.add('ai-box');
    if (!window.AI.ready()) {
      box.append(el('div', { class: 'ai-off' },
        el('p', {}, `Con la IA puedes escribirle a ${charName(id)} lo que quieras y te responderá en su papel. Es gratis: actívala en Ajustes → «IA para los chats».`),
        el('button', { class: 'btn small primary', onclick: openSettingsOverlay }, 'Abrir ajustes')));
      return;
    }
    const input = el('textarea', { class: 'input ai-input', rows: 1, maxlength: 500, placeholder: `Escribe a ${charName(id)}…`,
      onkeydown: (e) => { if (e.key !== 'Escape') e.stopPropagation(); if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } } });
    const send = () => { const t = input.value.trim(); if (!t || talking) return; input.value = ''; sendAI(id, t); };
    box.append(el('div', { class: 'ai-row' }, input, el('button', { class: 'btn primary ai-send', title: 'Enviar', onclick: send }, '➤')),
      window.AI.cfg().provider === 'ollama' ? null : el('small', { class: 'muted ai-note' }, `✦ ${window.AI.PROVIDERS[window.AI.cfg().provider].label} · lo que escribas se envía a ese servicio`));
    window.AI.warm();
    if (!U.touch) setTimeout(() => input.focus(), 0);
  }

  /** Envía el mensaje al proveedor de IA seleccionado. */
  async function sendAI(id, text) {
    talking = true;
    const thread = G.chats[id];
    thread.push({ s: 'yo', t: text });
    $('#chat-log')?.append(bubble('yo', text));
    showDialog(id);
    const log = $('#chat-log');
    const typing = el('div', { class: 'msg them typing' }, el('div', { class: 'bubble' }, el('i'), el('i'), el('i')));
    log?.append(typing);
    if (log) log.scrollTop = log.scrollHeight;
    try {
      const r = await window.AI.reply(G, id);
      typing.remove();
      await speak(id, [{ s: id, t: r.text, raw: true }]);
      // La afinidad cambia poco a poco: tres mensajes que le gusten = +1; dos que no = −1.
      const c = (G.aiAff = G.aiAff || {})[id] || { pos: 0, neg: 0 };
      if (r.aff > 0 && ++c.pos >= 3) { c.pos = 0; applyTalkFx(id, { aff: 1 }); }
      if (r.aff < 0 && ++c.neg >= 2) { c.neg = 0; applyTalkFx(id, { aff: -1 }); }
      G.aiAff[id] = c;
    } catch (err) {
      typing.remove();
      const t = `(La IA no responde: ${err.message})`;
      $('#chat-log')?.append(bubble('sistema', t));
    }
    talking = false;
    if (tab === 'chats' && contact === id) { refreshChatHead(id); showDialog(id); }
    renderContacts();
    persist();
  }

  /** Presenta las líneas de una conversación con personaje. */
  function showDialog(id) {
    const box = $('#dlg-choices');
    if (!box) return;
    box.innerHTML = '';
    box.classList.remove('ai-box');
    if (talking) return;
    if (chatMode(id) === 'ai') return showAIBox(id, box);
    if (talkState().at[id] === 'bye') {
      box.append(el('button', { class: 'choice', onclick: () => restartTalk(id) }, el('span', { class: 'num' }, 1), `Volver a hablar con ${charName(id)}`));
      return;
    }
    const seen = talkState().seen;
    dlgOptions(id).forEach((o, i) => {
      const ok = dlgReq(o.req, id) && !o.busy;
      const isNew = !o.__bye && !o.__back && !o.__menu && !o.__hang && !o.__small && !seen[dlgKey(id, o.__node, o)];
      box.append(el('button', {
        class: `choice${ok ? '' : ' locked'}${!isNew && !o.__bye && !o.__back && !o.__menu && !o.__hang && !o.__small ? ' seen' : ''}${o.__rel ? ` rel rel-${o.__rel}` : ''}`,
        disabled: !ok,
        title: ok ? '' : o.busy ? `Ya tienes pareja: ${charName(o.busy)}` : 'No cumples el requisito',
        onclick: () => sayOption(id, o),
      }, el('span', { class: 'num' }, i + 1),
      el('span', {},
        o.__back ? '↩ ' : o.__bye ? '' : TONES[o.tone] ? el('small', { class: `tone tone-${o.tone}` }, `${TONES[o.tone]} `) : '',
        tpl(o.t, G.player),
        o.req && reqLabel(o.req) ? el('em', { class: 'req' }, ` ${reqLabel(o.req)}`) : null,
        o.busy ? el('em', { class: 'req' }, ` [Ya sales con ${charName(o.busy)}]`) : null,
        !ok ? el('em', {}, '') : null,
        isNew ? el('em', { class: 'new' }, ' ✦') : null)));
    });
  }

  /** Reinicia la selección de temas de conversación. */
  async function restartTalk(id) {
    talkState().at[id] = 'hub';
    await speak(id, [tpl(greeting(id), G.player)]);
    showDialog(id);
    persist();
  }

  // Dice una línea en el comunicador (con «escribiendo…» para los personajes).
  async function speak(id, lines) {
    const thread = G.chats[id];
    for (const raw of lines) {
      const line = typeof raw === 'string' ? { s: id, t: raw } : raw;
      const text = line.raw ? line.t : tpl(line.t, G.player);
      const log = contact === id && tab === 'chats' ? $('#chat-log') : null;
      if (log && line.s !== 'narrador' && !line.raw && window.App.settings.textSpeed !== 'instantaneo') {
        const typing = el('div', { class: 'msg them typing' }, el('div', { class: 'bubble' }, el('i'), el('i'), el('i')));
        log.append(typing);
        log.scrollTop = log.scrollHeight;
        await sleep(Math.min(1400, 350 + text.length * 12));
        typing.remove();
      }
      thread.push({ s: line.s, t: text });
      const log2 = contact === id && tab === 'chats' ? $('#chat-log') : null;
      if (log2) {
        log2.append(bubble(line.s, text));
        log2.scrollTop = log2.scrollHeight;
      }
      if (line.s !== 'narrador') Audio2.sfx.message();
    }
    if (thread.length > 160) thread.splice(1, thread.length - 160);
  }

  /** Procesa la respuesta elegida por el jugador. */
  async function sayOption(id, o) {
    if (talking) return;
    talking = true;
    Audio2.sfx.choice();
    const data = window.CHAT[id];
    const thread = G.chats[id];
    const text = tpl(o.t, G.player);
    thread.push(o.__menu || o.__back || o.__bye || o.__hang ? { s: 'yo', t: text, m: 1 } : { s: 'yo', t: text });
    $('#chat-log')?.append(bubble('yo', text));
    showDialog(id);

    const key = dlgKey(id, o.__node, o);
    const first = !o.__bye && !o.__back && !talkState().seen[key];
    if (!o.__bye && !o.__back) talkState().seen[key] = true;
    if (first && o.fx && !(o.__small === 'cumplido' && affOf(id) < 0)) applyTalkFx(id, o.fx);
    // Celos: tontear con alguien que no es tu pareja.
    const mate = Relations.partner(G);
    if (first && o.tone === 'coqueto' && mate && mate !== id && !o.__rel && G.unlocked.includes(mate)) {
      applyFx({ aff: { [mate]: -1 } });
      toast(`A ${charName(mate)} no le haría ninguna gracia oír eso (−1 afinidad)`, 'warn');
    }

    let said = o.__bye ? [pick(data.bye || ['Nos vemos.'])] : [].concat(o.say || []);
    let go = o.go || (o.__node === 'hub' ? 'hub' : o.__node);
    if (o.__small) said = Relations.small(id, o.__small) || ['(Se encoge de hombros.)'];
    if (o.__hang) {
      const h = Relations.hang(G, id);
      said = h?.lines || [];
      if (h?.aff) applyTalkFx(id, { aff: h.aff });
    }
    if (o.__rel) {
      const r = Relations.ask(G, id, o.__rel, affOf(id));
      said = r.lines;
      if (r.kind) relToast(id, r.kind);
      if (r.aff) applyFx({ aff: { [id]: r.aff } });
      go = 'hub';
    }
    await speak(id, said);
    talkState().at[id] = go;
    if (go !== 'hub' && go !== 'bye' && data.nodes[go]?.say) await speak(id, [].concat(data.nodes[go].say));
    talking = false;
    if (tab === 'chats' && contact) {
      refreshChatHead(contact);
      showDialog(contact);
      const log = $('#chat-log');
      if (log) log.scrollTop = log.scrollHeight;
    }
    renderContacts();
    persist();
  }

  /** Presenta un aviso de cambio de relación o afinidad. */
  function relToast(id, kind) {
    Audio2.sfx.unlock();
    if (kind === 'romper') return toast(`Ya no sales con ${charName(id)} (−3 afinidad)`, 'warn');
    const l = Relations.label(G, id);
    toast(`${window.RELATIONS.kinds[kind]?.icon || '✦'} ${charName(id)}: ${tpl(l, G.player)}`, 'good');
  }

  // Efectos de una respuesta: afinidad (número = con quien hablas), reputación, estadísticas y flags.
  function applyTalkFx(id, fx) {
    const aff = typeof fx.aff === 'number' ? { [id]: fx.aff } : fx.aff || {};
    const scaled = {};
    for (const [k, v] of Object.entries(aff)) scaled[k] = v > 0 ? Math.min(v + chatGain() - 1, v * 2) : v;
    applyFx({ ...fx, aff: scaled });
    for (const [k, v] of Object.entries(scaled)) {
      if (v > 0) toast(`${charName(k)} aprecia lo que has dicho (+${v} afinidad)`, 'good');
      else if (v < 0) toast(`A ${charName(k)} no le ha gustado (${v} afinidad)`, 'warn');
    }
  }

  /** Selecciona el saludo apropiado para el contexto. */
  function greeting(id) {
    const r = Relations.greet(G, id);
    if (r) return r;
    const g = window.CHAT[id]?.greet;
    if (!g) return 'Hola.';
    const a = affOf(id);
    return a < 0 ? g.low : a >= 5 ? g.high : g.mid;
  }

  // ---------------- Ficha ----------------
  function renderSheet(main) {
    const p = G.player;
    const photoInput = el('input', { type: 'file', accept: 'image/*', class: 'hidden', onchange: (e) => changePhoto(e.target.files[0]) });
    main.append(el('div', { class: 'sheet', id: 'sheet' },
      el('div', { class: 'sheet-head' },
        el('div', { class: 'sheet-art', html: Portrait.forPlayer(p) }),
        el('div', {},
          el('small', { class: 'muted' }, 'Ficha de personaje'),
          el('h2', {}, p.name),
          el('span', { class: `tag origin-${p.origin}` }, p.origin === 'zaun' ? 'Zaun' : 'Piltover'),
          el('div', { class: 'row gap no-print' },
            el('button', { class: 'btn small', onclick: () => photoInput.click() }, 'Cambiar foto'),
            el('button', { class: 'btn small', onclick: exportSheet }, 'Exportar ficha'),
            el('button', { class: 'btn small ghost', onclick: () => window.print() }, 'Imprimir'), photoInput))),
      Creator.sheetList(p),
      p.bio ? el('div', {}, el('h3', {}, 'Biografía'), el('p', {}, p.bio)) : null,
      el('h3', {}, 'Estadísticas'),
      el('div', { class: 'stat-bars' }, Object.entries(S().stats).map(([k, meta]) =>
        el('div', { class: 'stat' }, el('span', {}, meta.label),
          el('div', { class: 'bar' }, el('i', { style: `width:${Math.min(100, G.stats[k] * 20)}%` })), el('b', {}, G.stats[k])))),
      el('h3', {}, 'Reputación'),
      el('div', { class: 'stat-bars' },
        repBar('Zaun', G.rep.zaun, 'zaun'), repBar('Piltover', G.rep.piltover, 'piltover')),
      el('h3', {}, 'Relaciones'),
      G.unlocked.length ? el('div', { class: 'rel-grid' }, G.unlocked.map((id) =>
        el('button', { class: 'rel', onclick: () => setTab('chats', id) },
          el('span', { class: 'rel-art', html: Portrait.forCharacter(id) }),
          el('span', {}, charName(id), Relations.status(G, id) ? el('small', { class: `c-rel rel-${Relations.status(G, id)}` }, tpl(Relations.label(G, id), G.player)) : null), heart(affOf(id))))) : el('p', { class: 'muted' }, 'Todavía no conoces a nadie.'),
      el('h3', {}, 'Progreso'),
      el('p', {}, `${chapterById(G.progress.chapterId)?.title}${G.progress.finished ? ' (completado)' : ''}`),
      el('p', {}, `Finales conseguidos: ${G.endings.length}/${allEndings().length}`,
        G.endings.length ? ` — ${G.endings.map((e) => allEndings().find((x) => x.id === e)?.title.replace('Final · ', '')).join(', ')}` : '')));
  }

  /** Dibuja una barra de reputación o relación. */
  function repBar(label, v, cls) {
    return el('div', { class: 'stat' }, el('span', {}, label),
      el('div', { class: `bar rep-${cls}` }, el('i', { style: `width:${Math.max(0, Math.min(100, v * 12))}%` })), el('b', {}, v));
  }

  /** Permite modificar la imagen de la ficha del personaje. */
  function changePhoto(f) {
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = async () => {
        const cv = document.createElement('canvas');
        cv.width = cv.height = 320;
        const s = Math.min(img.width, img.height);
        cv.getContext('2d').drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, 320, 320);
        G.player.photo = cv.toDataURL('image/jpeg', 0.85);
        await persist();
        renderPlay();
        setTab('ficha');
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(f);
  }

  /** Prepara una copia de los datos de la ficha. */
  async function exportSheet() {
    const data = { ...G.player, stats: G.stats, reputacion: G.rep, afinidad: G.aff, desbloqueados: G.unlocked, finales: G.endings };
    if (window.arcane?.exportSheet) {
      if (await window.arcane.exportSheet(data)) toast('Ficha exportada', 'good');
      return;
    }
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
    a.download = `ficha-${G.player.name}.json`;
    a.click();
  }

  // Atajos de teclado: 1-9 eligen opción en la historia.
  document.addEventListener('keydown', (e) => {
    if (!G || window.App.view !== 'game') return;
    const k = e.key.toLowerCase();
    if (k !== 'escape' && e.target.matches?.('input, textarea, select')) return;
    if (k === 'escape') {
      e.preventDefault();
      if (overlayKind || $('#overlay.show')) closeOverlay();
      else openOverlay('menu');
      return;
    }
    if (k === ' ' && busy) { skipping = true; e.preventDefault(); return; }
    if (k === 'm' && !busy) { if (overlayKind === 'codice') closeOverlay(); else openOverlay('codice', null, 'atlas'); return; }
    const shortcuts = { h: 'historia', c: 'chats', f: 'ficha', k: 'codice' };
    if (shortcuts[k] && !busy) {
      if (overlayKind === shortcuts[k]) closeOverlay();
      else openOverlay(shortcuts[k]);
      return;
    }
    // Números: elegir opción de la historia o del menú de un lugar.
    const n = Number(e.key);
    if (n >= 1 && n <= 9) {
      const all = [...document.querySelectorAll('#overlay #choices .choice, #overlay #dlg-choices .choice, #overlay .action-menu .choice')];
      const b = all[n - 1];
      if (b && !b.disabled) b.click();
    }
  });

  // Autoguardado mientras se explora.
  setInterval(() => { if (G && window.App.view === 'game') persist(); }, 30000);

  /** Prepara la interfaz de juego cuando se entra a la partida. */
  function mount() {
    if (G) renderPlay();
    else renderMenu();
  }

  // Continúa la partida guardada más reciente.
  async function continueLatest() {
    const slots = (await store.listSlots()).filter((x) => !x.empty).sort((a, b) => String(b.savedAt).localeCompare(String(a.savedAt)));
    if (!slots.length) return false;
    await loadGame(slots[0].slot);
    return true;
  }

  window.Game = { mount, current: () => G, save: persist, continueLatest, newGame: () => store.listSlots().then((sl) => { const free = sl.find((x) => x.empty); if (free) newGame(free.slot); else { toast('Las 3 ranuras están ocupadas: borra una partida.', 'warn'); window.App.go('game'); } }) };
})();
