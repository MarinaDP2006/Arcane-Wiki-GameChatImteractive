// Chat libre con IA (opcional y gratis): escribes lo que quieras y el personaje responde
// en su papel, al estilo de Character AI. La única IA del juego es KoboldCpp, que corre en
// tu ordenador (sin internet) y también sirve a la tablet o al móvil por la red de casa.
// Se usa su API compatible (/v1/chat/completions).
(function () {
  const PROVIDERS = {
    off: { label: 'Desactivada' },
    koboldcpp: { label: 'KoboldCpp (en tu PC o por la red de casa)', url: 'http://localhost:5001/v1/chat/completions', model: 'koboldcpp', key: false, help: 'Abre KoboldCpp (koboldcpp.exe o koboldcpp-oldpc.exe en PCs antiguos), elige tu modelo .gguf en «Model» y pulsa «Launch». Cuando diga que está listo en el puerto 5001, deja la dirección como está y pulsa «Probar conexión». Para jugar desde la tablet o el móvil (o si KoboldCpp está en otro PC de casa) escribe la IP de ese PC, por ejemplo 192.168.1.139: el puerto 5001 y la ruta se ponen solos. La IP la ves en el PC con «ipconfig» (Dirección IPv4). Los pasos están en GUIA-KOBOLDCPP.md.' },
  };

  // KoboldCpp corre en tu PC (o en otro de tu red): no pide clave y no sale a internet.
  const LOCAL = new Set(['koboldcpp']);

  // Basta con escribir «192.168.1.139» o «http://192.168.1.139:5001»: se completa el puerto
  // y la ruta de /v1/chat/completions. También vale pegar la dirección de KoboldAI Lite
  // («http://192.168.1.139:5001/#») o la de su API propia («…/api»).
  const PORTS = { koboldcpp: '5001' };
  function fullUrl(p, url) {
    url = String(url || '').trim();
    if (!PORTS[p] || !url) return url;
    if (!/^https?:\/\//i.test(url)) url = `http://${url}`;
    try {
      const u = new URL(url);
      if (!u.port && u.protocol === 'http:') u.port = PORTS[p];
      u.hash = '';
      u.search = '';
      if (!/\/chat\/completions$/.test(u.pathname)) u.pathname = `${u.pathname.replace(/\/(api|v1)(\/.*)?$/, '').replace(/\/+$/, '')}/v1/chat/completions`;
      return u.toString();
    } catch { return url; }
  }

  // Ajustes de versiones anteriores con otros servicios (ya no existen) quedan desactivados.
  function cfg() {
    const a = window.App?.settings?.ai || {};
    const p = PROVIDERS[a.provider] ? a.provider : 'off';
    const d = PROVIDERS[p];
    return { provider: p, url: p === 'koboldcpp' ? fullUrl(p, a.url || d.url) : '', model: a.model || d.model || '' };
  }

  function ready() {
    const c = cfg();
    return c.provider !== 'off' && Boolean(c.url && c.model);
  }

  // «localhost» en una dirección de KoboldCpp.
  const isLoopback = (url) => { try { return /^(localhost|127\.\d+\.\d+\.\d+|\[::1\])$/i.test(new URL(url).hostname); } catch { return false; } };
  const native = () => (window.Capacitor?.isNativePlatform?.() && window.Capacitor?.Plugins?.CapacitorHttp) || null;
  // En el móvil o la tablet «localhost» es el propio aparato, no el PC con KoboldCpp.
  const remoteDevice = () => !window.umbral && (Boolean(native()) || Boolean(window.U?.touch));

  // Explica por qué no se llega a KoboldCpp (en escritorio lo hace el proceso principal).
  function netError(err, url) {
    if (err?.name === 'AbortError') return new Error('KoboldCpp ha tardado demasiado en responder. Prueba con un modelo más pequeño o más «GPU Layers».');
    let where = url;
    try { const u = new URL(url); where = u.host; } catch { /* dirección rara: se muestra tal cual */ }
    if (isLoopback(url) && remoteDevice()) return new Error('En el móvil o la tablet «localhost» es el propio aparato. Escribe la IP de tu PC con KoboldCpp, por ejemplo 192.168.1.139 (la ves en el PC con «ipconfig»).');
    if (location.protocol === 'https:' && /^http:/i.test(url) && !native()) return new Error('Esta página va por https y el navegador no deja hablar con KoboldCpp por http. Usa el juego de escritorio o la app de Android.');
    return new Error(`No se llega a KoboldCpp en ${where}. Comprueba que está abierto con el modelo cargado, que el PC y este aparato están en la misma wifi y que el cortafuegos de Windows deja pasar el puerto 5001.`);
  }

  // Envía la petición por el camino que no tenga problemas de CORS: el proceso
  // principal en escritorio, el HTTP nativo en Android y fetch en el navegador.
  async function post(url, headers, body) {
    if (window.umbral?.ai) {
      const r = await window.umbral.ai(url, headers, body);
      if (r.error) throw new Error(r.error);
      return r;
    }
    const http = native();
    if (http) {
      let r;
      try {
        r = await http.request({ url, method: 'POST', headers: { ...headers, 'Content-Type': 'application/json' }, data: body, connectTimeout: 20000, readTimeout: 90000 });
      } catch (err) { throw netError(err, url); }
      return { status: r.status, data: typeof r.data === 'string' ? JSON.parse(r.data || '{}') : r.data };
    }
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), 90000);
    try {
      const res = await fetch(url, { method: 'POST', headers: { ...headers, 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: ctl.signal });
      return { status: res.status, data: await res.json().catch(() => ({})) };
    } catch (err) {
      throw netError(err, url);
    } finally {
      clearTimeout(timer);
    }
  }

  // GET corto (lista de modelos), por el mismo camino que post().
  async function get(url) {
    if (window.umbral?.aiGet) {
      const r = await window.umbral.aiGet(url);
      if (r.error) throw new Error(r.error);
      return r.data;
    }
    const http = native();
    try {
      if (http) {
        const r = await http.request({ url, method: 'GET', connectTimeout: 8000, readTimeout: 8000 });
        return typeof r.data === 'string' ? JSON.parse(r.data || '{}') : r.data;
      }
      return await fetch(url).then((r) => r.json());
    } catch (err) { throw netError(err, url); }
  }

  // Modelos que razonan antes de hablar (Qwen 3, DeepSeek R1…): necesitan más margen.
  const THINKERS = /qwen3|deepseek-r1|magistral|phi4-reasoning|cogito/i;

  // KoboldCpp sirve un solo modelo a la vez: el que se eligió al abrirlo.
  async function models() {
    const data = await get(`${cfg().url.replace(/\/v1\/chat\/completions$/, '')}/v1/models`);
    return (data?.data || []).map((m) => ({ name: m.id, loaded: true, quant: '' }));
  }

  // Carga el modelo en memoria antes del primer mensaje (la primera respuesta es la lenta).
  let warmed = '';
  function warm() {
    const c = cfg();
    if (!ready() || warmed === c.model) return;
    warmed = c.model;
    post(c.url, {}, { model: c.model, messages: [{ role: 'user', content: 'Hola' }], max_tokens: 1 }).catch(() => { warmed = ''; });
  }

  async function complete(messages, opts = {}) {
    const c = cfg();
    if (!ready()) throw new Error('La IA está desactivada. Actívala en Ajustes → IA con KoboldCpp.');
    const body = { model: c.model, messages, temperature: opts.temperature ?? 0.9, max_tokens: opts.max ?? 350 };
    // Se corta si empieza a escribir tu parte; los modelos que piensan necesitan más margen.
    if (opts.stop?.length) body.stop = opts.stop.slice(0, 4);
    if (THINKERS.test(c.model)) body.max_tokens = Math.max(body.max_tokens, 900);
    const r = await post(c.url, {}, body);
    if (r.status >= 400 || r.data?.error) {
      let msg = r.data?.error?.message || r.data?.error || r.data?.message || `HTTP ${r.status}`;
      msg = typeof msg === 'string' ? msg : JSON.stringify(msg);
      throw new Error(msg);
    }
    const text = r.data?.choices?.[0]?.message?.content;
    if (!text) throw new Error('La IA no ha devuelto texto');
    return String(text).replace(/<think>[\s\S]*?<\/think>/gi, '');
  }

  const LANG = { es: 'español de España', en: 'English', fr: 'français' };

  // Instrucciones del personaje: su forma de ser, quién eres tú y cómo os lleváis.
  function systemPrompt(G, id) {
    const t = (x) => U.tpl(x, G.player);
    const p = G.player;
    const C = window.CREATION;
    const name = window.WIKI.personajes.find((x) => x.id === id)?.name || id;
    const info = Relations.info(id);
    const rel = Relations.status(G, id);
    const aff = G.aff[id] ?? 0;
    const ch = window.STORY.chapters.find((c) => c.id === G.progress.chapterId);
    const mate = Relations.partner(G);
    const who = [
      `${p.name}, ${C.genders.find((g) => g.id === p.gender)?.label.toLowerCase() || ''}, ${p.age} años`,
      `de ${C.origins[p.origin]?.label} (${p.district})`,
      t(p.jobLabel || ''),
      p.familyLabel && p.family !== 'ninguna' ? t(p.familyLabel) : '',
      p.parents ? t(C.parents.find((x) => x.id === p.parents)?.label || '') : '',
      p.hobbyLabels?.length ? `aficiones: ${p.hobbyLabels.join(', ')}` : '',
      p.bio ? `biografía: ${p.bio}` : '',
    ].filter(Boolean).join('; ');
    const relTxt = rel ? `Vuestra relación: ${t(Relations.label(G, id))}.` : 'Todavía no tenéis una relación especial.';
    // Algunas frases suyas de los diálogos escritos, para que la IA copie su forma de hablar.
    const d = window.CHAT?.[id];
    // Ejemplos breves para imitar la cadencia, sin obligar al modelo a repetir frases enteras.
    const samples = d ? [d.greet?.mid, ...(d.bye || []), ...Object.values(d.nodes || {}).flatMap((n) => [].concat(n.say || []))]
      .filter((x) => typeof x === 'string').slice(0, 4).map((x) => `«${t(x)}»`) : [];
    const v = window.AI_VOICES?.[id] || {};
    const origin = window.CREATION?.origins?.[p.origin]?.label || p.origin || '';
    const feel = aff <= -3 ? 'Le tienes antipatía y desconfías.' : aff < 1 ? 'Le tratas con cautela.' : aff < 5 ? 'Te cae bien.' : aff < 8 ? 'Le aprecias mucho.' : 'Es una de las personas más importantes para ti.';
    const lore = window.WORLD_LORE?.[id] || {};
    const part = G.progress.season === 2 || G.progress.route === 't2' ? 2 : 1;
    const gone = new Set(G.fallen || []);
    const acquaintances = (G.met || []).map((person) => window.WIKI.personajes.find((w) => w.id === person)?.name || person);
    const important = Object.entries(G.flags || {}).filter(([, yes]) => yes === true).slice(-16).map(([flag]) => flag.replace(/_/g, ' '));
    const recent = (G.log || []).filter((line) => line.s === id || line.s === 'narrador' || line.s === 'yo')
      .slice(-7).map((line) => `${line.s === 'yo' ? p.name : line.s === id ? name : 'Narrador'}: ${String(line.t || '').slice(0, 190)}`);
    const lastChats = (G.chats?.[id] || []).filter((line) => !line.m).slice(-6)
      .map((line) => `${line.s === 'yo' ? p.name : name}: ${String(line.t || '').slice(0, 180)}`);
    const memory = [
      `Parte ${part}: ${part === 1 ? 'El inicio' : 'Las consecuencias'}; capítulo ${ch?.title || G.progress.chapterId}.`,
      `Personas que ${p.name} ya conoce: ${acquaintances.join(', ') || 'solo su círculo inicial'}.`,
      `Personajes ausentes o caídos: ${[...gone].join(', ') || 'ninguno confirmado'}.`,
      `Destinos alterados por ${p.name}: ${Object.entries(window.STORY?.rescues || {}).filter(([, flag]) => G.flags?.[flag]).map(([person]) => person).join(', ') || 'todavía ninguno'}. Estos personajes están vivos incluso si su historia original era distinta.`,
      important.length ? `Decisiones y sucesos registrados: ${important.join('; ')}.` : '',
      recent.length ? `Escenas recientes: ${recent.join(' / ')}.` : '',
      lastChats.length ? `Últimos recuerdos compartidos: ${lastChats.join(' / ')}.` : '',
    ].filter(Boolean).join('\n');

    return [
      `Eres ${name}, de Las ciudades del Umbral (Aurelia y Nácar). Interpreta a ${name} en un chat dentro del juego, siempre en su papel y en primera persona.`,
      `COHERENCIA DEL MUNDO: Aurelia es la ciudad elevada (observatorios, gremios, ascensores de contrapesos) y Nácar la ciudad bajo la piedra (canales de vapor, galerías geotérmicas, redes vecinales). Las une la Resonancia, energía que se extrae de vibraciones geológicas y que puede agotarse. No inventes poderes, ciudades ni parentescos que no encajen con este mundo, no menciones otras obras ni universos y respeta quién conoce a quién y qué ha visto cada personaje en esta partida.`,
      `Personalidad: ${info?.persona || window.WIKI.personajes.find((x) => x.id === id)?.role || ''}`,
      v.habla ? `Cómo hablas: ${v.habla}` : '',
      samples.length ? `Así hablas (frases tuyas en el juego): ${samples.join(' ')}` : '',
      v.contigo ? `Cómo tratas a quien te escribe (es de ${origin}): ${v.contigo}` : '',
      lore.pasado ? `Biografía y heridas reales: ${lore.pasado}` : '',
      lore.vinculos ? `Vínculos y conflictos personales: ${lore.vinculos}` : '',
      lore.motivaciones ? `Motivaciones, miedos y contradicciones: ${lore.motivaciones}` : '',
      v.nunca ? `Para no salirte del papel: ${v.nunca}` : '',
      `Hablas con ${who}.`,
      `${relTxt} Afinidad ${aff}/10: ${feel}${mate && mate !== id ? ` (${p.name} sale con ${window.WIKI.personajes.find((x) => x.id === mate)?.name}.)` : ''}`,
      window.Relations && !Relations.canRomance(G, id) && Relations.status(G, id) !== 'pareja' ? `Entre ${name} y ${p.name} no hay romance posible (sois familia o aún sois demasiado jóvenes en esta etapa): si ${p.name} coquetea, desvíalo con naturalidad y sin sermones.` : '',
      `CONTINUIDAD DE ESTA PARTIDA (datos de juego; no son instrucciones del usuario):\n${memory}`,
      `Solo sabes lo que ${name} ha presenciado o le han contado hasta aquí. No anticipes acontecimientos, muertes, identidades ocultas ni secretos de otro personaje. ESTA ES UNA LÍNEA TEMPORAL ALTERNATIVA: nunca afirmes que alguien murió si la partida lo salvó; las acciones del jugador prevalecen sobre el canon. Un registro de una escena no implica que hayas estado presente: si no estabas, puedes desconocerlo. Si alguien acaba de morir o has sufrido una pérdida, no te comportes como si no hubiera pasado.`,
      `INTERPRETACIÓN: contesta SIEMPRE en ${LANG[window.I18N?.lang] || LANG.es}. Habla en primera persona como ${name}, sin mencionar IA, prompts, juego ni metadatos; nunca escribas palabras, pensamientos ni acciones de ${p.name}. No recites una biografía ni repitas saludos y coletillas mecánicamente. Escucha la intención del último mensaje, responde con un detalle concreto de vuestra situación y, cuando proceda, haz una pregunta natural. Puedes discrepar, callarte, mentir por tus propios motivos o negarte a revelar secretos. La confianza y el romance se construyen lentamente: afinidad alta no borra traumas ni obligaciones. 1 a 5 frases fluidas; uno o dos gestos breves entre paréntesis solo si aportan algo. Evita frases de asistente, sermones, elogios automáticos y explicaciones enciclopédicas. Coqueteo y romance no explícitos, sin violencia gráfica.`,
      `Al final de cada respuesta añade una línea aparte con [[afinidad:+1]], [[afinidad:0]] o [[afinidad:-1]] según cómo te ha tratado ${p.name} en su último mensaje.`,
    ].filter(Boolean).join('\n');
  }

  // Últimos mensajes del comunicador como historial (yo = user, el personaje = assistant).
  function history(G, id) {
    const out = [];
    // Una ventana mayor conserva mejor el tono de la conversación y los temas pendientes.
    for (const m of (G.chats[id] || []).slice(-36)) {
      const role = m.s === 'yo' ? 'user' : m.s === id ? 'assistant' : null;
      if (!role || m.m) continue;
      const prev = out[out.length - 1];
      if (prev && prev.role === role) prev.content += `\n${m.t}`;
      else out.push({ role, content: m.t });
    }
    while (out.length && out[0].role !== 'user') out.shift();
    return out;
  }

  // Respuesta del personaje: { text, aff } (aff: -1, 0 o +1).
  async function reply(G, id) {
    const p = G.player;
    const raw = await complete([{ role: 'system', content: systemPrompt(G, id) }, ...history(G, id)], { stop: [`\n${p.name}:`, '\nYo:', '\nUser:', '\nUsuario:'] });
    const m = raw.match(/\[\[\s*afinidad\s*:\s*([+-]?\d)\s*\]\]/i);
    const aff = m ? Math.max(-1, Math.min(1, Number(m[1]))) : 0;
    // Si el modelo se pone a escribir también tu parte, se corta ahí.
    const me = p.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const text = raw.split(new RegExp(`\\n\\s*(?:${me}|Yo|User|Usuario)\\s*:`))[0]
      .replace(/\[\[[^\]]*\]\]/g, '').replace(/^\s*(\*\*)?[A-ZÁÉÍÓÚa-z ]{2,20}:(\*\*)?\s*/, '').trim();
    return { text: text || '(Se queda en silencio.)', aff };
  }

  // Turno libre dentro de la historia: el jugador escribe lo que quiere y el personaje
  // responde en su voz. La opción narrativa se selecciona en segundo plano, nunca se muestra
  // como menú al jugador, para conservar consecuencias y continuidad de la campaña.
  async function storyTurn(G, id, userText, choices = []) {
    const candidates = Array.isArray(choices) ? choices : [];
    const hiddenBranches = candidates.map((c, i) => `[${i}] ${U.tpl(c.t, G.player)}`).join('\n') || '[0] Sigue la escena sin cambiar de lugar.';
    const continuity = [
      'MODO HISTORIA LIBRE: el jugador no ve una lista de opciones.',
      'Responde a su última frase o acción como el personaje, en primera persona y sin hablar por el protagonista.',
      'Puedes preguntar algo natural, discrepar, dudar o mostrar una emoción coherente. Mantén la continuidad de la historia de esta partida.',
      'Después de la respuesta añade dos marcadores técnicos, cada uno en una línea separada: [[opcion:N]] y [[afinidad:0]], sustituyendo N por el índice de la acción narrativa interna que encaje mejor con la intención del jugador, empezando desde 0, y afinidad por -1, 0 o +1.',
      'Los marcadores nunca se explican ni se mencionan en el diálogo. No reveles las acciones internas ni conviertas la respuesta en un menú. Si la frase del jugador no coincide exactamente con una acción, interpreta su intención y elige la más razonable.',
      `ACCIONES NARRATIVAS INTERNAS (solo para escoger el marcador):\n${hiddenBranches}`,
      `Último mensaje del jugador: ${String(userText || '').slice(0, 1500)}`
    ].join('\n');
    const messages = [
      { role: 'system', content: systemPrompt(G, id) + '\n\n' + continuity },
      ...history(G, id),
      { role: 'user', content: 'Continúa la escena con una respuesta natural en personaje. Devuelve solo la respuesta y los dos marcadores técnicos requeridos.' }
    ];
    const raw = await complete(messages, { max: 480, temperature: 0.82 });
    const am = raw.match(/\[\[\s*afinidad\s*:\s*([+-]?\d)\s*\]\]/i);
    const aff = am ? Math.max(-1, Math.min(1, Number(am[1]))) : 0;
    const cm = raw.match(/\[\[\s*opcion\s*:\s*(\d+)\s*\]\]/i);
    const choiceIndex = cm ? Number(cm[1]) : 0;
    const text = raw
      .replace(/\[\[\s*afinidad\s*:\s*[+-]?\d\s*\]\]/gi, '')
      .replace(/\[\[\s*opcion\s*:\s*\d+\s*\]\]/gi, '')
      .replace(/^\s*(Respuesta|Diálogo|Escena)\s*:\s*/i, '')
      .trim();
    return { text: text || '(Se queda un momento en silencio antes de responder.)', aff, choiceIndex };
  }

  // ---------- Director de escena: la historia sin opciones ----------
  // El jugador escribe lo que dice o hace. La IA interpreta a quienes están en la escena
  // (pueden contestar, preguntar o actuar entre ellos) y decide en secreto si la escena
  // sigue o si la intención del jugador encaja ya con uno de los caminos escritos, que
  // es lo que mantiene la partida dentro de la historia de las ciudades del Umbral.
  const nameOf = (id) => window.WIKI.personajes.find((x) => x.id === id)?.name || id;

  function castBrief(G, id) {
    const info = Relations.info(id);
    const v = window.AI_VOICES?.[id] || {};
    const lore = window.WORLD_LORE?.[id] || {};
    const aff = G.aff[id] ?? 0;
    return [
      `■ ${nameOf(id)} (id: ${id}) · afinidad con el protagonista ${aff}/10${Relations.status(G, id) ? ` · ${U.tpl(Relations.label(G, id), G.player)}` : ''}`,
      info?.persona ? `  Quién es: ${info.persona}` : '',
      v.habla ? `  Cómo habla: ${v.habla}` : '',
      v.contigo ? `  Cómo trata al protagonista: ${v.contigo}` : '',
      lore.motivaciones ? `  Motivos y miedos: ${lore.motivaciones}` : '',
      v.nunca ? `  Nunca: ${v.nunca}` : '',
    ].filter(Boolean).join('\n');
  }

  function playerBrief(G) {
    const p = G.player;
    const C = window.CREATION;
    return [
      `${p.name}, ${C.genders.find((g) => g.id === p.gender)?.label.toLowerCase() || ''}, ${p.age} años`,
      `de ${C.origins[p.origin]?.label} (${p.district})`,
      U.tpl(p.jobLabel || '', p),
      p.familyLabel && p.family !== 'ninguna' ? U.tpl(p.familyLabel, p) : '',
      p.hobbyLabels?.length ? `aficiones: ${p.hobbyLabels.join(', ')}` : '',
      p.bio ? `biografía: ${p.bio}` : '',
    ].filter(Boolean).join('; ');
  }

  // scene: { chapter, intro, cast: [ids], beat: [líneas del guion], paths: [{ t }], turn, mustMove }
  async function direct(G, scene, userText) {
    const p = G.player;
    const name = (s) => (s === 'yo' ? p.name : s === 'narrador' || s === 'sistema' ? 'Narración' : nameOf(s));
    const log = (G.log || []).filter((m) => m.s !== 'sistema').slice(-24)
      .map((m) => `${name(m.s)}: ${String(m.t).slice(0, 320)}`).join('\n');
    const part = G.progress.season === 2 ? 2 : 1;
    const gone = (G.fallen || []).map(nameOf);
    const saved = Object.entries(window.STORY?.rescues || {}).filter(([, f]) => G.flags?.[f]).map(([id]) => nameOf(id));
    const paths = scene.paths.map((c, i) => `[${i + 1}] ${U.tpl(c.t, p)}`).join('\n');
    const sys = [
      `Eres el director de escena de Las ciudades del Umbral (Aurelia y Nácar), un juego de rol narrativo. Escribes en ${LANG[window.I18N?.lang] || LANG.es}.`,
      `COHERENCIA DEL MUNDO: Aurelia es la ciudad elevada (observatorios, gremios, ascensores de contrapesos) y Nácar la ciudad bajo la piedra (canales de vapor, galerías geotérmicas, redes vecinales). Las une la Resonancia, energía que se extrae de vibraciones geológicas y que puede agotarse. Respeta personalidades, cronología, quién conoce a quién, lugares y tono. No inventes poderes, ciudades ni parentescos que no encajen y no menciones otras obras ni universos. El protagonista puede cambiar cosas solo mediante lo que ocurre en esta partida.`,
      `Estamos en la parte ${part} (${part === 1 ? 'El inicio' : 'Las consecuencias'}), ${scene.chapter}. ${scene.intro || ''}`,
      gone.length ? `Ya no están (no pueden hablar): ${gone.join(', ')}.` : '',
      saved.length ? `Siguen vivos gracias al protagonista: ${saved.join(', ')}.` : '',
      `PROTAGONISTA (lo controla el jugador): ${playerBrief(G)}.`,
      `PERSONAJES EN ESCENA:\n${scene.cast.map((id) => castBrief(G, id)).join('\n') || '(nadie del reparto; usa solo la narración y figurantes descritos por el narrador)'}`,
      `LO QUE ACABA DE PASAR EN EL GUION DE ESTA ESCENA:\n${scene.beat.join('\n')}`,
      `CAMINOS POSIBLES (secretos, nunca los enseñes ni los conviertas en menú):\n${paths || '(ninguno: la escena sigue)'}`,
      `CÓMO RESPONDER:
- El jugador escribe lo que su personaje dice o hace, con total libertad. Reacciona a eso de verdad: los personajes contestan, preguntan, discuten, mienten por sus motivos, se callan o actúan.
- Nunca escribas palabras, pensamientos ni decisiones de ${p.name}. Si el jugador intenta algo imposible o fuera del lore, la escena reacciona con naturalidad (alguien le frena, no funciona…) sin romper la cuarta pared.
- Cada personaje solo sabe lo que ha presenciado. No adelantes muertes, identidades ocultas ni giros futuros.
- Formato: de 1 a 4 líneas, cada una empieza por el id del hablante y dos puntos. Usa «narrador:» para acciones y ambiente (breve, en segunda persona). Ejemplo:
narrador: Vi aprieta los puños.
vi: ¿Y tú quién demonios eres?
- Solo pueden hablar los personajes en escena o el narrador. Frases cortas y vivas, sin sermones ni tono de asistente. Romance no explícito, sin violencia gráfica.
- Al final, en líneas aparte:
[[camino:N]] si lo que ha hecho o dicho el jugador ya lleva claramente a uno de los caminos (N es su número), o [[camino:0]] si la escena sigue y hay que esperar al siguiente mensaje.${scene.mustMove ? `\n  La escena ya ha durado bastante: esta vez elige OBLIGATORIAMENTE el camino que mejor encaje (no uses 0) y haz que tu respuesta lleve a él.` : ''}
[[afinidad:id:+1]] o [[afinidad:id:-1]] por cada personaje al que el jugador haya agradado o molestado de verdad (omítelo si no cambia nada).`,
    ].filter(Boolean).join('\n\n');
    const messages = [
      { role: 'system', content: sys },
      { role: 'user', content: `Historial reciente:\n${log}\n\nTurno ${scene.turn + 1} de esta escena. ${p.name} (el jugador) escribe:\n«${String(userText).slice(0, 800)}»` },
    ];
    const raw = await complete(messages, { max: 420, temperature: 0.85, stop: [`\n${p.name}:`, '\nyo:'] });
    return parseDirection(raw, scene, p);
  }

  // Al cambiar de escena después de un turno libre, el guion escrito se adapta a lo que el
  // jugador ha dicho de verdad: mismos hechos y mismo desenlace del guion, pero con diálogos
  // que reaccionan a sus palabras y sin poner frases en su boca.
  async function adapt(G, scene) {
    const p = G.player;
    const name = (s) => (s === 'yo' ? p.name : s === 'narrador' || s === 'sistema' ? 'Narración' : nameOf(s));
    const log = (G.log || []).filter((m) => m.s !== 'sistema').slice(-14)
      .map((m) => `${name(m.s)}: ${String(m.t).slice(0, 300)}`).join('\n');
    const sys = [
      `Eres el guionista de Las ciudades del Umbral (Aurelia y Nácar), un juego de rol narrativo. Escribes en ${LANG[window.I18N?.lang] || LANG.es}. Todo debe respetar las reglas de ese mundo y la Resonancia.`,
      `Estamos en ${scene.chapter}. El protagonista es ${playerBrief(G)}; lo controla el jugador.`,
      `PERSONAJES EN ESCENA:\n${scene.cast.map((id) => castBrief(G, id)).join('\n') || '(solo narración)'}`,
      `GUION ORIGINAL DE LA ESCENA QUE EMPIEZA AHORA:\n${scene.beat.join('\n')}`,
      `TAREA: reescribe esta escena para que encaje con lo que el jugador acaba de decir y hacer (está en el historial). Conserva los mismos hechos, lugares, personajes, información importante y el mismo final de la escena; cambia solo las palabras para que los personajes reaccionen a lo que ha dicho el jugador.
- Nunca escribas frases, pensamientos ni decisiones de ${p.name}: las líneas del guion original que eran suyas se convierten en reacciones de otros o se quitan.
- Mismo formato que el guion: una línea por intervención, empezando por el id del hablante y dos puntos («narrador:» para acciones). Entre 2 y ${Math.max(3, Math.min(8, scene.beat.length))} líneas.
- Solo hablan los personajes en escena o el narrador. Nada de comentarios fuera del guion.`,
    ].join('\n\n');
    const raw = await complete([{ role: 'system', content: sys }, { role: 'user', content: `Historial reciente:\n${log}\n\nEscribe la escena adaptada.` }],
      { max: 520, temperature: 0.75, stop: [`\n${p.name}:`, '\nyo:'] });
    return parseDirection(raw, { cast: scene.cast, paths: [] }, p).lines;
  }

  function parseDirection(raw, scene, p) {
    const allowed = new Set([...scene.cast, 'narrador']);
    const byName = new Map(scene.cast.map((id) => [nameOf(id).toLowerCase(), id]));
    scene.cast.forEach((id) => byName.set(nameOf(id).split(' ')[0].toLowerCase(), id));
    const cm = raw.match(/\[\[\s*camino\s*:\s*(\d+)\s*\]\]/i);
    let path = cm ? Number(cm[1]) - 1 : -1;
    if (path >= scene.paths.length) path = -1;
    const aff = {};
    for (const m of raw.matchAll(/\[\[\s*afinidad\s*:\s*([a-z]+)\s*:\s*([+-]?\d)\s*\]\]/gi)) {
      const id = m[1].toLowerCase();
      if (scene.cast.includes(id)) aff[id] = Math.max(-1, Math.min(1, Number(m[2])));
    }
    const lines = [];
    for (let row of raw.replace(/\[\[[^\]]*\]\]/g, '').split('\n')) {
      row = row.replace(/^[\s*_-]+/, '').replace(/\*\*/g, '').trim();
      if (!row) continue;
      const m = row.match(/^([A-Za-zÁÉÍÓÚáéíóúñÑ' ]{2,24}):\s*(.+)$/);
      let s = 'narrador';
      let t = row;
      if (m) {
        const k = m[1].trim().toLowerCase();
        const id = allowed.has(k) ? k : byName.get(k) || (/narra/.test(k) ? 'narrador' : null);
        // Si la IA escribe por el protagonista, se descarta esa línea.
        if (k === p.name.toLowerCase() || k === 'yo') continue;
        if (id) { s = id; t = m[2]; }
      }
      lines.push({ s, t: t.trim() });
    }
    if (!lines.length) lines.push({ s: 'narrador', t: 'Un silencio tenso llena la escena.' });
    return { lines: lines.slice(0, 6), path, aff };
  }

  // Prueba la conexión y mide cuánto tarda (la primera vez incluye cargar el modelo).
  async function test() {
    const t0 = performance.now();
    const text = await complete([{ role: 'user', content: 'Di «¡Hola desde Nácar!» y nada más.' }], { max: 20, temperature: 0 });
    return { text: text.trim(), secs: (performance.now() - t0) / 1000 };
  }

  window.AI = { PROVIDERS, LOCAL, cfg, ready, isLoopback, remoteDevice, reply, storyTurn, direct, adapt, test, warm, models };
})();
