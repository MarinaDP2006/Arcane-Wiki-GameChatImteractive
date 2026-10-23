// Demo jugable de la web: creador de personaje y los capítulos 1 y 2 reales de la ciudad
// elegida. Los datos (window.DEMO) los genera scripts/build-web.js desde src/data, así la
// demo cuenta lo mismo que el juego. No usa arte de Arcane: retratos con iniciales y fondos propios.
(() => {
  const D = window.DEMO;
  const app = document.getElementById('demo-app');
  if (!D || !app) return;

  const STATS = ['ingenio', 'carisma', 'valor', 'sigilo'];
  const PUNTOS = 3;
  let draft, G;

  // ---------- Utilidades ----------
  const el = (tag, attrs = {}, ...kids) => {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (v == null || v === false) continue;
      if (k.startsWith('on')) n.addEventListener(k.slice(2), v);
      else if (k === 'class') n.className = v;
      else n.setAttribute(k, v === true ? '' : v);
    }
    for (const kid of kids.flat()) if (kid != null && kid !== false) n.append(kid);
    return n;
  };
  const gi = () => D.creation.genders.find((g) => g.id === draft.gender)?.g ?? 2;
  const genderize = (t) => String(t || '').replace(/\{g:([^}]*)\}/g, (_, alts) => { const p = alts.split('|'); return p[gi()] ?? p[p.length - 1] ?? ''; });
  const origin = () => D.creation.origins[draft.origin];
  const tpl = (t) => {
    const o = origin();
    const job = o.jobs.find((j) => j.id === draft.job);
    const fam = o.families.find((f) => f.id === draft.family);
    const hobby = D.creation.hobbies.find((h) => h.id === draft.hobby);
    const vars = {
      name: draft.name || 'Forastero',
      job: genderize(job?.label || ''),
      district: draft.district,
      family: fam?.name || '',
      hobby: (hobby?.label || '').replace(/^\p{Lu}(?=\p{Ll})/u, (c) => c.toLowerCase()),
    };
    return genderize(t).replace(/\{(name|job|district|family|hobby)\}/g, (_, k) => vars[k]);
  };
  const nameOf = (id) => (id === 'yo' ? draft.name : D.nombres[id] || id);
  const sigil = (id) => el('span', { class: `dj-sigilo dj-sigilo-${id === 'yo' ? 'yo' : 'pj'}`, 'aria-hidden': 'true' }, (nameOf(id) || '?').charAt(0));
  const kin = () => Object.keys(D.familyLinks[draft.family] || {});

  function baseStats() {
    const s = { ingenio: 1, carisma: 1, valor: 1, sigilo: 1 };
    const add = (o) => o && Object.entries(o).forEach(([k, v]) => { s[k] += v; });
    const o = origin();
    if (o) {
      add(o.jobs.find((j) => j.id === draft.job)?.stats);
      add(o.families.find((f) => f.id === draft.family)?.stats);
    }
    add(D.creation.hobbies.find((h) => h.id === draft.hobby)?.stats);
    for (const k of STATS) s[k] += draft.alloc[k];
    return s;
  }

  // ---------- Creador ----------
  function fresh() {
    return { name: '', gender: 'mujer', origin: null, district: '', job: '', family: 'ninguna', hobby: D.creation.hobbies[0].id, alloc: { ingenio: 0, carisma: 0, valor: 0, sigilo: 0 } };
  }

  function select(label, value, options, onChange) {
    const s = el('select', { onchange: (e) => onChange(e.target.value) }, options.map(([v, t]) => el('option', { value: v, selected: v === value }, t)));
    return el('label', { class: 'dj-campo' }, el('span', {}, label), s);
  }

  function renderCreator() {
    const o = origin();
    const usados = STATS.reduce((n, k) => n + draft.alloc[k], 0);
    const stats = baseStats();
    const nombre = el('input', { type: 'text', maxlength: 24, value: draft.name, placeholder: 'Tu nombre', oninput: (e) => { draft.name = e.target.value.trim(); empezar.disabled = !listo(); } });
    const listo = () => Boolean(draft.name && draft.origin);
    const empezar = el('button', { class: 'dj-principal', disabled: !listo(), onclick: startStory }, 'Empezar la historia');
    app.replaceChildren(el('div', { class: 'dj-creador' },
      el('div', { class: 'dj-bloque' },
        el('h2', {}, '1 · ¿De qué lado del puente vienes?'),
        el('div', { class: 'dj-ciudades' }, Object.entries(D.creation.origins).map(([id, c]) => el('button', {
          class: `dj-ciudad dj-ciudad-${id}${draft.origin === id ? ' activo' : ''}`, 'aria-pressed': String(draft.origin === id),
          onclick: () => { draft.origin = id; draft.district = c.districts[0]; draft.job = c.jobs[0].id; draft.family = 'ninguna'; renderCreator(); },
        }, el('strong', {}, c.label), el('span', {}, c.tagline))))),
      el('div', { class: 'dj-bloque' },
        el('h2', {}, '2 · ¿Quién eres?'),
        el('label', { class: 'dj-campo' }, el('span', {}, 'Nombre'), nombre),
        el('div', { class: 'dj-campo' }, el('span', {}, 'Género'), el('div', { class: 'dj-botones' }, D.creation.genders.map((g) => el('button', {
          class: draft.gender === g.id ? 'activo' : '', 'aria-pressed': String(draft.gender === g.id), onclick: () => { draft.gender = g.id; renderCreator(); },
        }, g.label)))),
        o ? [
          select('Barrio', draft.district, o.districts.map((d) => [d, d]), (v) => { draft.district = v; }),
          select('Profesión', draft.job, o.jobs.map((j) => [j.id, genderize(j.label) + statTxt(j.stats)]), (v) => { draft.job = v; renderCreator(); }),
          select('Familia', draft.family, o.families.map((f) => [f.id, genderize(f.label) + statTxt(f.stats)]), (v) => { draft.family = v; renderCreator(); }),
        ] : el('p', { class: 'dj-nota' }, 'Elige primero tu ciudad para ver barrios, profesiones y familias.'),
        select('Afición', draft.hobby, D.creation.hobbies.map((h) => [h.id, h.label + statTxt(h.stats)]), (v) => { draft.hobby = v; renderCreator(); })),
      el('div', { class: 'dj-bloque' },
        el('h2', {}, `3 · Reparte ${PUNTOS} puntos`),
        el('p', { class: 'dj-nota' }, `Te quedan ${PUNTOS - usados}. Algunas respuestas de la historia piden un mínimo.`),
        el('div', { class: 'dj-stats' }, STATS.map((k) => el('div', { class: 'dj-stat' },
          el('span', {}, D.stats[k].label),
          el('button', { 'aria-label': `Quitar a ${D.stats[k].label}`, disabled: draft.alloc[k] === 0, onclick: () => { draft.alloc[k]--; renderCreator(); } }, '−'),
          el('strong', {}, String(stats[k])),
          el('button', { 'aria-label': `Sumar a ${D.stats[k].label}`, disabled: usados >= PUNTOS, onclick: () => { draft.alloc[k]++; renderCreator(); } }, '+'))))),
      el('div', { class: 'dj-acciones' }, empezar)));
  }

  function statTxt(s) {
    const e = Object.entries(s || {});
    return e.length ? ' (' + e.map(([k, v]) => `+${v} ${D.stats[k].label}`).join(', ') + ')' : '';
  }

  // ---------- Guía de personajes ----------
  function renderGuide(then) {
    const g = D.guia;
    const kind = draft.origin;
    app.replaceChildren(el('div', { class: `dj-guia dj-fondo-${kind}` },
      el('h2', {}, g.titulo),
      el('p', {}, g.intro[kind]),
      el('div', { class: 'dj-guia-rejilla' }, g.orden[kind].map((id) => {
        const f = g.fichas[id] || {};
        return el('article', { class: 'dj-guia-ficha' }, sigil(id),
          el('div', {}, el('h3', {}, nameOf(id)), el('p', { class: 'dj-guia-titulo' }, f.titulo), el('p', {}, f.quien), el('p', { class: 'dj-nota' }, f.porque)));
      })),
      el('p', { class: 'dj-nota' }, g.otros[kind]),
      el('div', { class: 'dj-acciones' }, el('button', { class: 'dj-principal', onclick: then }, 'Empezar el capítulo 1'))));
  }

  // ---------- Historia ----------
  function startStory() {
    G = { stats: baseStats(), flags: draft.family !== 'ninguna' ? { familia_famosa: true } : {}, aff: {}, chapter: 0, log: null };
    renderGuide(() => playChapter(0));
  }

  const condOk = (c) => {
    if (!c) return true;
    if (c.flag && !G.flags[c.flag]) return false;
    if (c.notFlag && G.flags[c.notFlag]) return false;
    if (c.kin && !kin().includes(c.kin)) return false;
    if (c.notKin && kin().includes(c.notKin)) return false;
    if (c.origin && draft.origin !== c.origin) return false;
    return true;
  };
  const reqOk = (r) => (!r ? true : r.stat ? (G.stats[r.stat] || 0) >= r.min : condOk(r));
  const reqHidden = (r) => r && !r.stat && !reqOk(r);

  function chapterAt(i) {
    const id = D.rutas[draft.origin][i];
    return D.capitulos.find((c) => c.id === id);
  }

  function playChapter(i) {
    G.chapter = i;
    const ch = chapterAt(i);
    if (!ch) return renderEnd();
    const box = el('div', { class: `dj-escena dj-fondo-${draft.origin}` },
      el('header', { class: 'dj-cabecera' },
        el('p', { class: 'antetitulo' }, `Capítulo ${i + 1} de 2 · ${origin().label}`),
        el('h2', {}, ch.title),
        el('div', { class: 'dj-ficha-mini' }, `${draft.name} · ` + STATS.map((k) => `${D.stats[k].icon} ${G.stats[k]}`).join(' · '))),
      el('p', { class: 'dj-intro' }, tpl(ch.intro)));
    G.log = el('div', { class: 'dj-log' });
    G.choices = el('div', { class: 'dj-opciones' });
    box.append(G.log, G.choices);
    app.replaceChildren(box);
    app.scrollIntoView({ behavior: 'smooth', block: 'start' });
    showNode(ch, ch.start);
  }

  function line(s, t) {
    const who = s === 'narrador' ? null : s;
    G.log.append(el('div', { class: `dj-linea ${who ? (who === 'yo' ? 'dj-yo' : 'dj-pj') : 'dj-narra'}` },
      who ? sigil(who) : null,
      el('div', {}, who ? el('strong', {}, nameOf(who)) : null, el('p', {}, tpl(t)))));
  }

  function showNode(ch, id) {
    const n = ch.nodes[id];
    if (!n) return endChapter();
    (n.lines || []).filter((l) => condOk(l.cond)).forEach((l) => line(l.s, l.t));
    G.choices.replaceChildren();
    const opts = (n.choices || []).filter((c) => !reqHidden(c.req));
    if (opts.length) {
      opts.forEach((c, k) => {
        const ok = reqOk(c.req);
        G.choices.append(el('button', { disabled: !ok, onclick: () => choose(ch, c) },
          el('span', { class: 'dj-num' }, String(k + 1)), tpl(c.t),
          !ok && c.req?.stat ? el('em', {}, ` (necesitas ${D.stats[c.req.stat].label} ${c.req.min})`) : null));
      });
    } else if (n.next) {
      G.choices.append(el('button', { onclick: () => showNode(ch, n.next) }, 'Continuar'));
    } else endChapter();
    G.choices.querySelector('button:not([disabled])')?.focus({ preventScroll: true });
  }

  function choose(ch, c) {
    line('yo', c.t);
    const fx = c.fx || {};
    for (const [k, v] of Object.entries(fx.stats || {})) G.stats[k] = (G.stats[k] || 0) + v;
    for (const [k, v] of Object.entries(fx.aff || {})) G.aff[k] = (G.aff[k] || 0) + v;
    (fx.flags || []).forEach((f) => { G.flags[f] = true; });
    if (c.next) showNode(ch, c.next);
    else endChapter();
  }

  function endChapter() {
    const last = G.chapter + 1 >= D.rutas[draft.origin].length;
    G.choices.replaceChildren(el('p', { class: 'dj-nota' }, 'Fin del capítulo.'),
      el('button', { class: 'dj-principal', onclick: () => (last ? renderEnd() : playChapter(G.chapter + 1)) }, last ? 'Terminar la demo' : 'Ir al capítulo 2'));
  }

  function renderEnd() {
    const amigos = Object.entries(G.aff).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]).map(([id]) => nameOf(id)).slice(0, 4);
    app.replaceChildren(el('div', { class: `dj-final dj-fondo-${draft.origin}` },
      el('p', { class: 'antetitulo' }, 'Fin de la demo'),
      el('h2', {}, `${draft.name}, esto solo acaba de empezar`),
      el('p', {}, amigos.length ? `Te has ganado la confianza de ${amigos.join(', ')}. En el juego completo puedes seguir hablando con ellos en el comunicador.` : 'En el juego completo tus decisiones cambian lo que los personajes piensan de ti.'),
      el('p', {}, 'Te esperan más capítulos en cada ciudad, la Parte II, ocho finales, el mapa de Piltover y Zaun y diez minijuegos.'),
      el('div', { class: 'dj-acciones' },
        el('a', { class: 'boton', href: 'index.html#descargar' }, 'Descargar el juego'),
        el('button', { onclick: () => { draft = fresh(); renderCreator(); } }, 'Volver a empezar'))));
  }

  draft = fresh();
  renderCreator();
})();
