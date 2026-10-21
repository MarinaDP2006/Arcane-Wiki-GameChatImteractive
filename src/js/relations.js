// Relaciones con los personajes (amistad, pareja, familia elegida…) y charla con
// respuestas variadas. Los datos están en src/data/relations.js; aquí se decide qué
// opciones aparecen en el comunicador según tu personaje creado y la afinidad.
(function () {
  const R = () => window.RELATIONS;
  const info = (id) => R().chars[id] || null;
  const pickOne = (list) => list[Math.floor(Math.random() * list.length)];

  // Lo que atrae a tu personaje (las partidas antiguas no lo tienen: vale todo).
  const ATTRACT = { hombres: ['m'], mujeres: ['f'], todos: ['m', 'f'], nadie: [] };

  function state(G) {
    G.rel = G.rel || {};
    G.relDone = G.relDone || {};
    return G.rel;
  }

  function status(G, id) {
    return state(G)[id] || null;
  }

  function partner(G) {
    return Object.entries(state(G)).find(([, v]) => v === 'pareja')?.[0] || null;
  }

  function label(G, id) {
    const k = status(G, id);
    if (!k) return '';
    if (k === 'familia') return familyLabel(id);
    if (k === 'pariente') return R().familyLinks[G.player.family]?.[id]?.[1] || R().kinds.pariente.label;
    return R().kinds[k]?.label || '';
  }

  function familyLabel(id) {
    const role = info(id)?.family;
    return { padre: 'Figura paterna', madre: 'Figura materna', abuelo: 'Abuelo elegido', mentor: 'Mentora' }[role] || 'Familia elegida';
  }

  // Lazos que vienen de la familia elegida en la creación.
  function applyFamily(G) {
    const links = R().familyLinks[G.player.family] || {};
    const rel = state(G);
    for (const [id, [kind]] of Object.entries(links)) if (!rel[id]) rel[id] = kind;
  }

  // ¿Le falta a tu personaje la figura que este personaje puede ocupar?
  function needsFamily(G, id) {
    const role = info(id)?.family;
    if (!role) return false;
    const p = G.player.parents;
    if (!p) return true; // partidas antiguas
    if (role === 'padre') return p === 'madre' || p === 'ninguno';
    if (role === 'madre') return p === 'padre' || p === 'ninguno';
    return p !== 'ambos';
  }

  // ¿Os podéis atraer el uno al otro?
  function canRomance(G, id) {
    const c = info(id);
    if (!c || !c.romance.includes(G.player.gender)) return false;
    if ((Number(G.player.age) || 20) < 18) return false;
    const likes = ATTRACT[G.player.attraction || 'todos'] || ATTRACT.todos;
    return likes.includes(c.gender);
  }

  // Opciones de «Lo nuestro…»: { kind, t, req?, locked? }
  function relOptions(G, id, aff) {
    const c = info(id);
    if (!c) return [];
    const cur = status(G, id);
    const out = [];
    const add = (kind, min, extra = {}) => {
      const line = c.rel[kind];
      if (!line?.ask) return;
      out.push({ t: line.ask, tone: kind === 'pareja' ? 'coqueto' : kind === 'romper' ? 'serio' : 'amable', __rel: kind, req: aff < min ? { aff: min } : undefined, ...extra });
    };
    const family = cur === 'pariente';
    if (!cur) add('amistad', 4);
    if (cur === 'amistad' || cur === 'hermandad' || cur === 'familia') add('mejor', 8, { once: true });
    if (!family && cur !== 'pareja' && canRomance(G, id)) {
      const other = partner(G);
      add('pareja', 7, other && other !== id ? { busy: other } : {});
    }
    if (!family && !cur?.match(/^(familia|pareja)$/) && needsFamily(G, id)) add('familia', 6);
    if (c.sibling && !family && !cur?.match(/^(hermandad|pareja|familia)$/)) add('hermandad', 6);
    if (cur === 'pareja') add('romper', -10);
    return out.filter((o) => !(o.__rel === 'mejor' && G.relDone[`${id}:mejor`]));
  }

  // Ejecuta una petición de relación. Devuelve las líneas que dice el personaje.
  function ask(G, id, kind, aff) {
    const c = info(id);
    const line = c.rel[kind];
    const rel = state(G);
    if (kind === 'romper') {
      rel[id] = 'amistad';
      return { lines: [pickOne([].concat(line.yes))], aff: -3, kind: 'romper' };
    }
    if (kind === 'pareja' && (!canRomance(G, id) || aff < 7)) return { lines: [pickOne(line.no || ['Mejor como amigos, ¿vale?'])] };
    if (kind === 'mejor') {
      G.relDone[`${id}:mejor`] = true;
      rel[id] = rel[id] === 'amistad' ? 'mejor' : rel[id];
      return { lines: [pickOne([].concat(line.yes))], aff: 1, kind: 'mejor' };
    }
    rel[id] = kind;
    return { lines: [pickOne([].concat(line.yes))], aff: 1, kind };
  }

  function greet(G, id) {
    const k = status(G, id);
    const g = info(id)?.greet;
    if (!k || !g) return null;
    const list = g[k] || (k === 'mejor' ? g.amistad : k === 'pariente' ? g.familia || g.hermandad || g.amistad : null);
    return list ? pickOne(list) : null;
  }

  // Escena de «Pasar el rato» (una vez por capítulo da afinidad).
  function hang(G, id) {
    const k = status(G, id);
    const h = info(id)?.hang;
    if (!k || !h) return null;
    const list = h[k] || (k === 'mejor' ? h.amistad : k === 'pariente' ? h.familia || h.hermandad || h.amistad : null) || h.amistad;
    if (!list) return null;
    const scene = pickOne(list).map((t) => (t.startsWith('(') && t.endsWith(')') ? { s: 'narrador', t: t.slice(1, -1) } : t));
    const key = `${id}:hang:${G.progress.season || 1}:${G.progress.chapterIdx}`;
    const first = !G.relDone[key];
    G.relDone[key] = true;
    return { lines: scene, aff: first ? 1 : 0 };
  }

  function hangLabel(G, id) {
    const k = status(G, id);
    return { pareja: 'Tener una cita', familia: 'Pasar la tarde en familia', pariente: 'Pasar la tarde en familia', hermandad: 'Hacer algo juntos', mejor: 'Pasar el rato juntos', amistad: 'Pasar el rato' }[k] || null;
  }

  // Respuestas de charla: al azar entre las variantes (sin repetir la última).
  const last = {};
  function small(id, topic) {
    const list = info(id)?.small?.[topic];
    if (!list?.length) return null;
    let i = Math.floor(Math.random() * list.length);
    if (list.length > 1 && last[`${id}:${topic}`] === i) i = (i + 1) % list.length;
    last[`${id}:${topic}`] = i;
    return [].concat(list[i]);
  }

  window.Relations = { status, label, partner, applyFamily, relOptions, ask, greet, hang, hangLabel, small, canRomance, needsFamily, info };
})();
