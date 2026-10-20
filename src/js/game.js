// Motor del juego: partidas, historia en formato chat, chat libre con
// personajes desbloqueados (con o sin IA) y ficha del personaje.
(function () {
  const { $, el, esc, tpl, store, toast, sleep, pick, norm } = U;
  const S = () => window.STORY;

  let G = null; // estado de la partida en curso
  let slot = null;
  let busy = false; // reproduciendo líneas de la historia
  let skipping = false;
  let tab = 'historia';
  let contact = null; // personaje del chat libre seleccionado

  const chapterById = (id) => S().chapters.find((c) => c.id === id);
  const charName = (id) => window.WIKI.personajes.find((p) => p.id === id)?.name || id;
  const affOf = (id) => G.aff[id] ?? 0;

  // ---------------- Partidas ----------------
  function newState(player, stats) {
    const route = S().routes[player.origin];
    const st = {
      version: 1, player, stats,
      aff: {}, rep: { zaun: player.origin === 'zaun' ? 1 : 0, piltover: player.origin === 'piltover' ? 1 : 0 },
      flags: {}, unlocked: [], chats: {}, log: [], endings: [],
      world: { map: null, x: 0, y: 0 }, codex: [], visited: [], acts: {},
      progress: { route: player.origin, chapterIdx: 0, chapterId: route[0], node: null, chapterTitle: chapterById(route[0]).title, finished: false, started: false },
    };
    Object.entries(player.familyAff || {}).forEach(([k, v]) => { st.aff[k] = v; });
    if (player.family !== 'ninguna') st.flags.familia_famosa = true;
    return st;
  }

  async function persist() {
    if (!G || !slot) return;
    G.progress.chapterTitle = chapterById(G.progress.chapterId)?.title || '';
    G.log = G.log.slice(-400);
    await store.save(slot, G);
  }

  async function renderMenu() {
    const root = $('#view-game');
    const slots = await store.listSlots();
    root.innerHTML = '';
    root.append(el('div', { class: 'menu' },
      el('h1', { class: 'title-arcane' }, 'Partidas'),
      el('p', { class: 'muted' }, 'Elige una ranura. Cada partida guarda tu personaje, tu posición en el mapa, tus decisiones y tus conversaciones.'),
      el('button', { class: 'btn ghost', onclick: () => window.App.go('home') }, '← Menú principal'),
      el('div', { class: 'slots' }, slots.map((s) => el('div', { class: `slot panel${s.empty ? ' empty' : ''}` },
        el('h3', {}, `Ranura ${s.slot}`),
        s.empty ? el('p', { class: 'muted' }, 'Vacía') : el('div', {},
          el('strong', {}, s.name), el('span', { class: `tag origin-${s.origin}` }, s.origin === 'zaun' ? 'Zaun' : 'Piltover'),
          el('p', { class: 'muted' }, s.chapter || ''),
          s.savedAt ? el('small', { class: 'muted' }, new Date(s.savedAt).toLocaleString('es-ES')) : null),
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

  function newGame(s) {
    slot = s;
    window.App.go('creator');
    Creator.start(async (player, stats) => {
      G = newState(player, stats);
      tab = 'historia';
      contact = null;
      await persist();
      window.App.go('game');
      toast(`Objetivo: ve a ${objectiveName()}`, 'good');
    });
  }

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
    if (G.progress.started === undefined) G.progress.started = Boolean(G.progress.node);
    tab = 'historia';
    contact = null;
    window.App.go('game');
  }

  // ---------------- Mundo abierto ----------------
  function objectiveId() {
    if (!G || G.progress.finished) return null;
    const loc = window.WORLD.chapterLocations[G.progress.chapterId];
    return typeof loc === 'object' ? loc[G.progress.route] : loc;
  }

  function objectiveName() {
    return World.locById(objectiveId())?.name || '';
  }

  function discover(codexId, label) {
    if (!codexId || G.codex.includes(codexId)) return false;
    G.codex.push(codexId);
    if (label) toast(label, 'good');
    return true;
  }

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
    if (cx) cx.textContent = `📚 ${codexCount()}/${codexTotal()}`;
  }

  function codexKnown(id) {
    return G.codex.includes(id) || G.unlocked.includes(id);
  }
  function codexTotal() {
    return window.WIKI.categories.reduce((a, c) => a + window.WIKI[c.id].length, 0);
  }
  function codexCount() {
    return window.WIKI.categories.reduce((a, c) => a + window.WIKI[c.id].filter((e) => codexKnown(e.id)).length, 0);
  }

  function locationActions(loc) {
    const acts = [];
    if (!G.progress.finished && loc.id === objectiveId()) acts.push({ label: G.progress.started ? 'Continuar la historia' : `Comenzar «${chapterById(G.progress.chapterId).title}»`, run: openStory });
    if (loc.travel) acts.push({ label: loc.travel.label, run: () => travel(loc.travel) });
    if (loc.activity) {
      const key = `${loc.id}:${G.progress.chapterIdx}`;
      const done = G.acts[key];
      const maxed = (G.stats[loc.activity.stat] || 0) >= window.WORLD.maxStat;
      if (!done && !maxed) acts.push({ label: `${loc.activity.label} (+1 ${S().stats[loc.activity.stat].label})`, run: () => doActivity(loc, key) });
    }
    const here = G.unlocked.filter((id) => window.WORLD.homes[id] === loc.id);
    here.forEach((id) => acts.push({ label: `Hablar con ${charName(id)}`, run: () => openOverlay('chats', id) }));
    return acts;
  }

  function onLocation(loc) {
    const acts = locationActions(loc);
    if (!acts.length) return toast(`${loc.name}: aquí no hay nada que hacer ahora mismo.`);
    if (acts.length === 1) return acts[0].run();
    // Menú de acciones del lugar.
    World.pause(true);
    const box = $('#overlay');
    box.innerHTML = '';
    box.className = 'overlay show';
    box.append(el('div', { class: 'panel action-menu' },
      el('h2', {}, `${loc.icon} ${loc.name}`),
      ...acts.map((a, i) => el('button', { class: 'choice', onclick: () => { closeOverlay(); a.run(); } }, el('span', { class: 'num' }, i + 1), a.label)),
      el('button', { class: 'btn ghost', onclick: closeOverlay }, 'Cerrar (Esc)')));
  }

  function doActivity(loc, key) {
    const a = loc.activity;
    G.acts[key] = true;
    G.stats[a.stat] = Math.min(window.WORLD.maxStat, (G.stats[a.stat] || 0) + 1);
    Audio2.sfx.unlock();
    showNotice(`${loc.icon} ${a.label}`, `${a.text}\n\n${S().stats[a.stat].icon} ${S().stats[a.stat].label} +1 (ahora ${G.stats[a.stat]}).`);
    updateHud();
    persist();
  }

  function showNotice(title, text) {
    World.pause(true);
    const box = $('#overlay');
    box.innerHTML = '';
    box.className = 'overlay show';
    box.append(el('div', { class: 'panel action-menu' }, el('h2', {}, title),
      ...text.split('\n').filter(Boolean).map((p) => el('p', {}, p)),
      el('button', { class: 'btn primary', onclick: closeOverlay }, 'Continuar')));
    Audio2.speak(text.split('\n')[0], { pitch: 0.95, rate: 1.05, gender: 'm' });
  }

  async function travel(t) {
    Audio2.sfx.choice();
    World.travel(t.to, t.at);
    toast(`Llegas a ${window.WORLD.maps[t.to].label}`);
    await persist();
  }

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
          discover(loc.codex, `📍 Descubierto: ${loc.name} (añadido al Códice)`);
          updateHud();
          persist();
        }
      },
      onFragment: (f) => {
        const entry = findEntry(f.codex);
        if (discover(f.codex, `💠 Fragmento del Códice: ${entry?.name || f.codex}`)) {
          Audio2.sfx.unlock();
          updateHud();
          persist();
        }
      },
    };
  }

  function findEntry(id) {
    for (const c of window.WIKI.categories) {
      const e = window.WIKI[c.id].find((x) => x.id === id);
      if (e) return e;
    }
    return null;
  }

  // ---------------- Superposiciones ----------------
  let overlayKind = null;

  function openOverlay(kind, who) {
    World.pause(true);
    overlayKind = kind;
    const box = $('#overlay');
    box.className = 'overlay show';
    box.innerHTML = '';
    if (kind === 'codice') {
      const panel = el('div', { class: 'panel overlay-panel codex' },
        el('header', { class: 'overlay-head' }, el('h2', {}, `📚 Códice de Runeterra · ${codexCount()}/${codexTotal()}`), closeBtn()),
        el('div', { class: 'codex-body', id: 'codex-body' }));
      box.append(panel);
      Wiki.mount($('#codex-body'), { known: codexKnown, onTalk: (id) => openOverlay('chats', id), canTalk: (id) => G.unlocked.includes(id) });
      if (who) Wiki.open(who);
      return;
    }
    if (kind === 'menu') {
      box.append(el('div', { class: 'panel action-menu' },
        el('h2', {}, 'Pausa'),
        el('button', { class: 'btn primary', onclick: closeOverlay }, '▶ Continuar'),
        el('button', { class: 'btn', onclick: async () => { await persist(); toast('Partida guardada', 'good'); } }, '💾 Guardar partida'),
        el('button', { class: 'btn', onclick: () => openSettingsOverlay() }, '⚙ Ajustes'),
        el('button', { class: 'btn', onclick: () => { closeOverlay(); showHelp(); } }, '❔ Controles'),
        el('button', { class: 'btn ghost', onclick: async () => { await persist(); exitToTitle(); } }, '↩ Salir al menú principal'),
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
            tabBtn('historia', '📖 Historia  [H]'), tabBtn('chats', '📡 Comunicador  [C]'), tabBtn('ficha', '🪪 Ficha  [F]')),
          el('div', { id: 'contact-list', class: 'contact-list' }),
          el('button', { class: 'btn ghost small', onclick: closeOverlay }, '🗺 Volver al mapa  [Esc]')),
        el('section', { id: 'play-main', class: 'play-main' }))));
    renderContacts();
    renderMain();
  }

  function closeBtn() {
    return el('button', { class: 'btn ghost small', onclick: closeOverlay }, '✕ Cerrar  [Esc]');
  }

  function closeOverlay() {
    if (busy && overlayKind === 'historia') {
      toast('Espera a que termine la escena (o pulsa «Saltar»).', 'warn');
      return;
    }
    overlayKind = null;
    const box = $('#overlay');
    if (box) { box.className = 'overlay'; box.innerHTML = ''; }
    Audio2.stopSpeech();
    updateHud();
    World.pause(false);
  }

  function openSettingsOverlay() {
    const box = $('#overlay');
    box.innerHTML = '';
    const holder = el('div', { class: 'overlay-scroll' });
    box.append(holder);
    window.App.renderSettings(holder, () => openOverlay('menu'));
  }

  function showHelp() {
    showNotice('Controles', [
      'Moverse: WASD o flechas (Mayús para correr). También puedes hacer clic en el mapa.',
      'Interactuar / hablar / entrar: E o Intro.',
      'H: historia · C: comunicador (chats) · F: ficha · K: Códice · Esc: pausa.',
      'Recoge los hexágonos azules del mapa para completar el Códice. Las actividades de cada lugar suben tus estadísticas, que desbloquean opciones en la historia.',
    ].join('\n'));
  }

  function openStory() {
    if (!G.progress.started && !G.progress.finished) {
      G.progress.started = true;
      openOverlay('historia');
      startChapter();
    } else openOverlay('historia');
  }

  function exitToTitle() {
    World.stop();
    Audio2.stopSpeech();
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
    const hudBtn = (label, key, fn) => el('button', { class: 'hud-btn', title: key, onclick: fn }, label, el('kbd', {}, key));
    root.append(el('div', { class: 'world' },
      canvas,
      el('div', { class: 'hud hud-top' },
        el('div', { class: 'hud-card', onclick: () => openOverlay('ficha') },
          el('span', { class: 'avatar', html: Portrait.forPlayer(G.player) }),
          el('div', {}, el('strong', {}, G.player.name), el('small', { id: 'world-district', class: 'muted' }, ''), el('div', { id: 'hud-stats', class: 'hud-stats' }))),
        el('div', { id: 'hud-objective', class: 'hud-card objective', onclick: () => { if (G.progress.started) openStory(); } })),
      el('div', { class: 'hud hud-mini' }, mini, el('small', { id: 'hud-codex', class: 'muted' })),
      el('div', { id: 'world-prompt', class: 'world-prompt' }),
      el('div', { class: 'hud hud-bottom' },
        hudBtn('📖 Historia', 'H', () => openOverlay('historia')),
        hudBtn('📡 Comunicador', 'C', () => openOverlay('chats')),
        hudBtn('🪪 Ficha', 'F', () => openOverlay('ficha')),
        hudBtn('📚 Códice', 'K', () => openOverlay('codice')),
        hudBtn('☰ Pausa', 'Esc', () => openOverlay('menu'))),
      el('div', { id: 'overlay', class: 'overlay' })));
    World.start(G, worldCallbacks(), canvas, mini);
    updateHud();
    if (!G.flags.__help) {
      G.flags.__help = true;
      showHelp();
    }
  }

  function tabBtn(id, label) {
    return el('button', { class: `tab${tab === id ? ' active' : ''}`, 'data-tab': id, onclick: () => setTab(id) }, label);
  }

  function setTab(t, who) {
    if (overlayKind !== t && ['historia', 'chats', 'ficha'].includes(t) && !$('#play-main')) return openOverlay(t, who);
    overlayKind = t;
    tab = t;
    if (who !== undefined) contact = who;
    document.querySelectorAll('.tabs-v .tab').forEach((b) => b.classList.toggle('active', b.dataset.tab === tab));
    if (t !== 'historia') Audio2.stopSpeech();
    renderContacts();
    renderMain();
  }

  function renderContacts() {
    const list = $('#contact-list');
    if (!list) return;
    list.innerHTML = '';
    list.append(el('h4', {}, `Personajes desbloqueados (${G.unlocked.length})`));
    if (!G.unlocked.length) list.append(el('p', { class: 'muted small' }, 'Avanza en la historia para conocer a gente.'));
    for (const id of G.unlocked) {
      const a = affOf(id);
      list.append(el('button', {
        class: `contact${tab === 'chats' && contact === id ? ' active' : ''}`,
        onclick: () => setTab('chats', id),
      },
      el('span', { class: 'avatar sm', html: Portrait.forCharacter(id) }),
      el('span', { class: 'c-body' }, el('strong', {}, charName(id)), heart(a))));
    }
  }

  function heart(a) {
    const lvl = a < 0 ? '💔' : a >= 8 ? '💖' : a >= 5 ? '❤️' : a >= 2 ? '🧡' : '🤍';
    return el('small', { class: 'aff' }, `${lvl} ${a}`);
  }

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
        el('p', { class: 'gold' }, `★ Ve a «${objectiveName()}» en el mapa y pulsa E para comenzar.`),
        el('button', { class: 'btn primary', onclick: closeOverlay }, '🗺 Volver al mapa')));
      return;
    }
    main.append(
      el('header', { class: 'scene-head', id: 'scene-head' },
        el('div', {}, el('small', { class: 'muted' }, G.progress.route === 'zaun' ? 'Ruta de Zaun' : 'Ruta de Piltover'), el('h2', {}, ch.title)),
        el('div', { class: 'row gap' },
          el('button', { class: 'btn ghost small', title: 'Saltar animación', onclick: () => { skipping = true; Audio2.stopSpeech(); } }, '⏩ Saltar'),
          el('button', { class: 'btn ghost small', title: 'Activar o desactivar voces', onclick: toggleVoice }, window.App.settings.voice ? '🔊 Voz' : '🔇 Voz'))),
      el('div', { id: 'scene-bg', class: `scene-bg bg-${G.progress.node ? ch.nodes[G.progress.node]?.bg || 'zaun' : 'zaun'}` }),
      el('div', { id: 'story-log', class: 'log' }),
      el('div', { id: 'choices', class: 'choices' }));
    const log = $('#story-log');
    for (const m of G.log) log.append(bubble(m.s, m.t, true));
    log.scrollTop = log.scrollHeight;
    if (!busy) showChoices(currentChoices());
  }

  async function toggleVoice() {
    window.App.settings.voice = !window.App.settings.voice;
    Audio2.configure(window.App.settings);
    await store.setSettings({ voice: window.App.settings.voice });
    if (!window.App.settings.voice) Audio2.stopSpeech();
    renderMain();
  }

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

  function scrollLog() {
    const log = $('#story-log');
    if (log) log.scrollTop = log.scrollHeight;
  }

  function setBg(bg) {
    const box = $('#scene-bg');
    if (box && bg) box.className = `scene-bg bg-${bg}`;
  }

  function lineVisible(line) {
    const c = line.cond;
    if (!c) return true;
    if (c.flag && !G.flags[c.flag]) return false;
    if (c.notFlag && G.flags[c.notFlag]) return false;
    return true;
  }

  function startChapter() {
    const ch = chapterById(G.progress.chapterId);
    pushLog('sistema', `— ${ch.title} —`);
    pushLog('narrador', ch.intro);
    renderStoryIfVisible();
    playNode(ch.start);
  }

  function pushLog(s, t) {
    G.log.push({ s, t });
  }

  function renderStoryIfVisible() {
    if (tab === 'historia') renderMain();
  }

  function delayFor(text) {
    const speed = window.App.settings.textSpeed;
    const base = speed === 'rapido' ? 250 : speed === 'lento' ? 1100 : 600;
    return base + Math.min(2200, text.length * (speed === 'rapido' ? 8 : speed === 'lento' ? 30 : 18));
  }

  // Reproduce un nodo: muestra sus líneas una a una (con voz) y luego sus opciones.
  async function playNode(nodeId, resume = false) {
    const ch = chapterById(G.progress.chapterId);
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
    for (const line of node.lines.filter(lineVisible)) {
      const text = tpl(line.t, G.player);
      if (tab === 'historia' && !skipping) {
        const typing = typingIndicator(line.s);
        await sleep(skipping ? 0 : 350);
        typing?.remove();
      }
      pushLog(line.s, text);
      if (tab === 'historia') {
        $('#story-log')?.append(bubble(line.s, text, skipping));
        scrollLog();
        if (!skipping) Audio2.sfx.message();
      }
      if (!skipping && tab === 'historia') {
        const voice = line.s === 'narrador' ? { pitch: 0.95, rate: 1.05, gender: 'm' } : line.s === 'yo' ? null : window.CHAT[line.s]?.voice;
        if (voice && window.App.settings.voice) await Promise.race([Audio2.speak(text, voice), skipWait(12000)]);
        else await skipWait(delayFor(text));
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

  function typingIndicator(s) {
    const log = $('#story-log');
    if (!log || s === 'narrador' || s === 'sistema') return null;
    const t = el('div', { class: `msg ${s === 'yo' ? 'me' : 'them'} typing` }, el('div', { class: 'bubble' }, el('i'), el('i'), el('i')));
    log.append(t);
    scrollLog();
    return t;
  }

  function advance(next) {
    G.progress.linesShown = false;
    playNode(next);
  }

  function currentChoices() {
    if (G.progress.finished) return [];
    const ch = chapterById(G.progress.chapterId);
    const node = ch?.nodes[G.progress.node];
    if (!node || !G.progress.linesShown) return [];
    if (node.choices) return node.choices;
    if (node.end) return [{ t: '🗺 Volver al mapa: siguiente objetivo →', __next: true }];
    return [];
  }

  function reqMet(req) {
    if (!req) return true;
    if (req.stat) return (G.stats[req.stat] || 0) >= req.min;
    if (req.flag) return Boolean(G.flags[req.flag]);
    if (req.notFlag) return !G.flags[req.notFlag];
    if (req.aff) return affOf(req.aff[0]) >= req.aff[1];
    return true;
  }

  // Las opciones que dependen de un flag que no tienes se ocultan;
  // las que dependen de estadística o afinidad se muestran bloqueadas.
  function reqHidden(req) {
    return req && (req.flag || req.notFlag) && !reqMet(req);
  }

  function showChoices(choices) {
    const box = $('#choices');
    if (!box) return;
    box.innerHTML = '';
    if (G.progress.finished) {
      box.append(el('div', { class: 'end-actions' },
        el('button', { class: 'btn primary', onclick: () => setTab('chats', G.unlocked[0]) }, '💬 Seguir chateando con los personajes'),
        el('button', { class: 'btn', onclick: () => setTab('ficha') }, '🪪 Ver mi ficha'),
        el('button', { class: 'btn ghost', onclick: replayRoute }, '↻ Rejugar la ruta con este personaje')));
      return;
    }
    choices.filter((c) => !reqHidden(c.req)).forEach((c, i) => {
      const ok = reqMet(c.req);
      box.append(el('button', {
        class: `choice${ok ? '' : ' locked'}`,
        disabled: !ok,
        title: ok ? '' : 'No cumples el requisito',
        onclick: () => choose(c),
      }, el('span', { class: 'num' }, i + 1), tpl(c.t, G.player), !ok ? el('em', {}, ' 🔒') : null));
    });
  }

  function applyFx(fx = {}) {
    for (const [k, v] of Object.entries(fx.aff || {})) {
      G.aff[k] = Math.max(-10, Math.min(10, affOf(k) + v));
    }
    for (const [k, v] of Object.entries(fx.rep || {})) G.rep[k] = (G.rep[k] || 0) + v;
    for (const [k, v] of Object.entries(fx.stats || {})) {
      G.stats[k] = (G.stats[k] || 0) + v;
      toast(`${S().stats[k].icon} ${S().stats[k].label} +${v}`, 'good');
    }
    (fx.flags || []).forEach((f) => { G.flags[f] = true; });
  }

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
    advance(c.next);
  }

  async function endChapter() {
    const ch = chapterById(G.progress.chapterId);
    const fresh = (ch.unlocks || []).filter((id) => !G.unlocked.includes(id));
    G.unlocked.push(...fresh);
    if (fresh.length) {
      Audio2.sfx.unlock();
      pushLog('sistema', `✦ Personajes desbloqueados para chatear: ${fresh.map(charName).join(', ')}`);
      $('#story-log')?.append(bubble('sistema', G.log[G.log.length - 1].t));
      scrollLog();
      toast(`Nuevos contactos: ${fresh.map(charName).join(', ')}`, 'good');
    }
    renderContacts();
    await persist();
    showChoices(currentChoices());
  }

  async function nextChapter() {
    const route = S().routes[G.progress.route];
    G.progress.chapterIdx += 1;
    G.progress.chapterId = route[G.progress.chapterIdx];
    G.progress.node = null;
    G.progress.linesShown = false;
    G.progress.started = false;
    if (G.progress.chapterId === 'fin') Audio2.playMusic('final');
    await persist();
    closeOverlay();
    toast(`Nuevo objetivo: ve a ${objectiveName()}`, 'good');
  }

  async function playEnding() {
    const ending = S().endings.find((e) => e.test(G));
    busy = true;
    skipping = false;
    pushLog('sistema', `— ${ending.title} —`);
    $('#story-log')?.append(bubble('sistema', `— ${ending.title} —`));
    for (const line of ending.lines) {
      const text = tpl(line.t, G.player);
      pushLog(line.s, text);
      $('#story-log')?.append(bubble(line.s, text, skipping));
      scrollLog();
      if (!skipping && tab === 'historia') {
        const voice = line.s === 'narrador' ? { pitch: 0.95, rate: 1.05, gender: 'm' } : window.CHAT[line.s]?.voice;
        if (voice && window.App.settings.voice) await Promise.race([Audio2.speak(text, voice), skipWait(12000)]);
        else await skipWait(delayFor(text));
      }
    }
    busy = false;
    if (!G.endings.includes(ending.id)) G.endings.push(ending.id);
    G.progress.finished = true;
    const ch = chapterById('fin');
    const fresh = ch.unlocks.filter((id) => !G.unlocked.includes(id));
    G.unlocked.push(...fresh);
    if (fresh.length) {
      Audio2.sfx.unlock();
      pushLog('sistema', `✦ Personajes desbloqueados para chatear: ${fresh.map(charName).join(', ')}`);
      $('#story-log')?.append(bubble('sistema', G.log[G.log.length - 1].t));
    }
    pushLog('sistema', `Has conseguido ${G.endings.length} de ${S().endings.length} finales. ¡Gracias por jugar!`);
    $('#story-log')?.append(bubble('sistema', G.log[G.log.length - 1].t));
    scrollLog();
    renderContacts();
    await persist();
    showChoices([]);
  }

  // Vuelve a empezar la ruta conservando ficha, finales y personajes desbloqueados.
  async function replayRoute() {
    if (!confirm('¿Rejugar la ruta? Conservas tu ficha, tus finales y tus contactos, pero se reinician las decisiones.')) return;
    const route = S().routes[G.progress.route];
    G.flags = G.player.family !== 'ninguna' ? { familia_famosa: true } : {};
    G.rep = { zaun: G.player.origin === 'zaun' ? 1 : 0, piltover: G.player.origin === 'piltover' ? 1 : 0 };
    G.progress = { route: G.progress.route, chapterIdx: 0, chapterId: route[0], node: null, chapterTitle: '', finished: false, started: false };
    G.log = [];
    G.acts = {};
    await persist();
    closeOverlay();
    toast(`Objetivo: ve a ${objectiveName()}`, 'good');
  }

  // ---------------- Chat libre ----------------
  function renderChat(main) {
    if (!G.unlocked.length) {
      main.append(el('div', { class: 'wiki-empty' }, el('h2', {}, 'Aún no conoces a nadie'), el('p', {}, 'Juega la historia para desbloquear personajes con los que hablar.')));
      return;
    }
    if (!contact || !G.unlocked.includes(contact)) contact = G.unlocked[0];
    const id = contact;
    const data = window.CHAT[id];
    const wikiEntry = window.WIKI.personajes.find((p) => p.id === id);
    const ai = window.App.settings.aiEnabled && window.App.settings.hasApiKey;
    if (!G.chats[id]) G.chats[id] = [{ s: id, t: tpl(greeting(id), G.player) }];
    main.append(
      el('header', { class: 'scene-head' },
        el('div', { class: 'row gap' },
          el('span', { class: 'avatar', html: Portrait.forCharacter(id) }),
          el('div', {}, el('h2', {}, charName(id)), el('small', { class: 'muted' }, `${wikiEntry?.role || ''} · Afinidad ${affOf(id)}/10 · ${ai ? '✨ Modo IA' : 'Modo clásico'}`))),
        el('div', { class: 'row gap' },
          el('button', { class: 'btn ghost small', onclick: () => openOverlay('codice', id) }, '📚 Códice'),
          el('button', { class: 'btn ghost small', onclick: () => { G.chats[id] = null; persist(); renderMain(); } }, '🧹 Limpiar'))),
      el('div', { id: 'chat-log', class: 'log' }),
      el('div', { class: 'chips wrap topic-chips' }, (data?.topics || []).map((t) =>
        el('button', { class: 'chip', onclick: () => sendChat(t.label) }, t.label))),
      el('form', { class: 'chat-input', onsubmit: (e) => { e.preventDefault(); const inp = e.target.elements.msg; const v = inp.value.trim(); if (v) { inp.value = ''; sendChat(v); } } },
        el('input', { name: 'msg', class: 'input', autocomplete: 'off', placeholder: `Escribe a ${charName(id)}…`, maxlength: 400 }),
        el('button', { class: 'btn primary', type: 'submit' }, 'Enviar')));
    const log = $('#chat-log');
    for (const m of G.chats[id]) log.append(bubble(m.s, m.t, true));
    log.scrollTop = log.scrollHeight;
    setTimeout(() => main.querySelector('input[name=msg]')?.focus(), 0);
  }

  function greeting(id) {
    const g = window.CHAT[id]?.greet;
    if (!g) return 'Hola.';
    const a = affOf(id);
    return a < 0 ? g.low : a >= 5 ? g.high : g.mid;
  }

  async function sendChat(text) {
    const id = contact;
    const thread = G.chats[id];
    thread.push({ s: 'yo', t: text });
    const log = $('#chat-log');
    log?.append(bubble('yo', text));
    log && (log.scrollTop = log.scrollHeight);
    Audio2.sfx.click();

    const typing = el('div', { class: 'msg them typing' }, el('div', { class: 'bubble' }, el('i'), el('i'), el('i')));
    log?.append(typing);
    log && (log.scrollTop = log.scrollHeight);

    let reply = null;
    if (window.App.settings.aiEnabled && window.App.settings.hasApiKey && window.arcane?.ai) {
      const res = await window.arcane.ai.chat({ system: personaPrompt(id), messages: toApiMessages(thread) });
      if (res.ok && res.text) reply = res.text;
      else toast(`${res.error || 'La IA no respondió'} · Uso el modo clásico.`, 'warn');
    } else {
      await sleep(500 + Math.random() * 700);
    }
    if (!reply) reply = classicReply(id, text);
    typing.remove();
    thread.push({ s: id, t: reply });
    if (thread.length > 120) thread.splice(1, thread.length - 120);
    if (contact === id && tab === 'chats') {
      log?.append(bubble(id, reply));
      log && (log.scrollTop = log.scrollHeight);
    }
    Audio2.sfx.message();
    Audio2.speak(reply, window.CHAT[id]?.voice);
    renderContacts();
    persist();
  }

  // Respuestas sin IA: busca palabras clave; el primer tema tratado sube la afinidad.
  function classicReply(id, text) {
    const data = window.CHAT[id];
    const q = norm(text);
    G.flags.__topics = G.flags.__topics || {};
    for (const t of data?.topics || []) {
      if (norm(t.label) === q || t.keys.some((k) => q.includes(norm(k)))) {
        const key = `${id}:${t.label}`;
        if (!G.flags.__topics[key]) {
          G.flags.__topics[key] = true;
          G.aff[id] = Math.min(10, affOf(id) + 1);
          toast(`${charName(id)} aprecia la conversación (+1 afinidad)`, 'good');
        }
        return tpl(pick(t.replies), G.player);
      }
    }
    if (/\b(hola|buenas|hey|saludos)\b/.test(q)) return tpl(greeting(id), G.player);
    const other = window.WIKI.personajes.find((p) => p.id !== id && q.includes(norm(p.name.split(' ')[0])));
    if (other) return `¿${other.name}? ${pick(['Mejor pregúntale a esa persona directamente.', 'No es asunto mío. O quizá sí.', 'Hay mucho que contar… pero no hoy.'])}`;
    return tpl(pick(data?.fallback || ['…']), G.player);
  }

  function toApiMessages(thread) {
    // La API requiere alternancia usuario/asistente empezando por el usuario.
    const msgs = [];
    for (const m of thread.slice(-30)) {
      const role = m.s === 'yo' ? 'user' : 'assistant';
      if (!msgs.length && role === 'assistant') {
        msgs.push({ role: 'user', content: '(Te acercas a saludar.)' });
      }
      const last = msgs[msgs.length - 1];
      if (last && last.role === role) last.content += `\n${m.t}`;
      else msgs.push({ role, content: m.t });
    }
    return msgs;
  }

  function personaPrompt(id) {
    const c = window.WIKI.personajes.find((p) => p.id === id);
    const p = G.player;
    const spoilers = window.App.settings.spoilers;
    const facts = [c.summary, ...(c.details || []), spoilers && c.spoiler ? c.spoiler : ''].filter(Boolean).join(' ');
    const flags = Object.keys(G.flags).filter((f) => !f.startsWith('__')).join(', ') || 'ninguno';
    return [
      `Eres ${c.name}${c.alias ? ` (${c.alias})` : ''}, personaje de la serie Arcane. Hablas siempre en español, en primera persona y sin salir nunca del personaje.`,
      `Lo que sabes de ti: ${facts}`,
      `Habla como en la serie: ${window.CHAT[id]?.greet?.mid || ''} Ejemplos de tu tono: ${(window.CHAT[id]?.fallback || []).join(' / ')}`,
      `Hablas con ${p.name}, ${tpl(p.jobLabel, p)} de ${p.origin === 'zaun' ? 'Zaun' : 'Piltover'} (${p.district}), ${p.age} años, género: ${p.gender}. Familia: ${tpl(p.familyLabel, p)}. Aficiones: ${p.hobbyLabels.join(', ')}. ${p.bio ? `Su historia: ${p.bio}` : ''}`,
      `Tu afinidad con esta persona es ${affOf(id)} sobre 10 (negativa = desconfianza, alta = cariño). Ajusta tu trato.`,
      `Momento de la historia: ${chapterById(G.progress.chapterId)?.title}. Decisiones tomadas por el jugador (claves internas): ${flags}.`,
      spoilers ? '' : 'No reveles acontecimientos de la segunda temporada de Arcane.',
      'Responde con 1 a 3 frases, con personalidad, humor propio del personaje y sin listas. Puedes describir gestos entre paréntesis. No digas que eres una IA.',
    ].filter(Boolean).join('\n');
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
            el('button', { class: 'btn small', onclick: () => photoInput.click() }, '📷 Cambiar foto'),
            el('button', { class: 'btn small', onclick: exportSheet }, '⬇ Exportar ficha'),
            el('button', { class: 'btn small ghost', onclick: () => window.print() }, '🖨 Imprimir'), photoInput))),
      Creator.sheetList(p),
      p.bio ? el('div', {}, el('h3', {}, 'Biografía'), el('p', {}, p.bio)) : null,
      el('h3', {}, 'Estadísticas'),
      el('div', { class: 'stat-bars' }, Object.entries(S().stats).map(([k, meta]) =>
        el('div', { class: 'stat' }, el('span', {}, `${meta.icon} ${meta.label}`),
          el('div', { class: 'bar' }, el('i', { style: `width:${Math.min(100, G.stats[k] * 20)}%` })), el('b', {}, G.stats[k])))),
      el('h3', {}, 'Reputación'),
      el('div', { class: 'stat-bars' },
        repBar('Zaun', G.rep.zaun, 'zaun'), repBar('Piltover', G.rep.piltover, 'piltover')),
      el('h3', {}, 'Relaciones'),
      G.unlocked.length ? el('div', { class: 'rel-grid' }, G.unlocked.map((id) =>
        el('button', { class: 'rel', onclick: () => setTab('chats', id) },
          el('span', { class: 'rel-art', html: Portrait.forCharacter(id) }),
          el('span', {}, charName(id)), heart(affOf(id))))) : el('p', { class: 'muted' }, 'Todavía no conoces a nadie.'),
      el('h3', {}, 'Progreso'),
      el('p', {}, `${chapterById(G.progress.chapterId)?.title}${G.progress.finished ? ' (completado)' : ''}`),
      el('p', {}, `Finales conseguidos: ${G.endings.length}/${S().endings.length}`,
        G.endings.length ? ` — ${G.endings.map((e) => S().endings.find((x) => x.id === e).title.replace('Final · ', '')).join(', ')}` : '')));
  }

  function repBar(label, v, cls) {
    return el('div', { class: 'stat' }, el('span', {}, label),
      el('div', { class: `bar rep-${cls}` }, el('i', { style: `width:${Math.max(0, Math.min(100, v * 12))}%` })), el('b', {}, v));
  }

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
    if (k !== 'escape' && e.target.matches('input, textarea, select')) return;
    if (k === 'escape') {
      e.preventDefault();
      if (overlayKind || $('#overlay.show')) closeOverlay();
      else openOverlay('menu');
      return;
    }
    if (k === ' ' && busy) { skipping = true; Audio2.stopSpeech(); e.preventDefault(); return; }
    const shortcuts = { h: 'historia', c: 'chats', f: 'ficha', k: 'codice' };
    if (shortcuts[k] && !busy) {
      if (overlayKind === shortcuts[k]) closeOverlay();
      else openOverlay(shortcuts[k]);
      return;
    }
    // Números: elegir opción de la historia o del menú de un lugar.
    const n = Number(e.key);
    if (n >= 1 && n <= 9) {
      const all = [...document.querySelectorAll('#overlay #choices .choice, #overlay .action-menu .choice')];
      const b = all[n - 1];
      if (b && !b.disabled) b.click();
    }
  });

  // Autoguardado mientras se explora.
  setInterval(() => { if (G && window.App.view === 'game') persist(); }, 30000);

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

  window.Game = { mount, current: () => G, continueLatest, newGame: () => store.listSlots().then((sl) => { const free = sl.find((x) => x.empty); if (free) newGame(free.slot); else { toast('Las 3 ranuras están ocupadas: borra una partida.', 'warn'); window.App.go('game'); } }) };
})();
