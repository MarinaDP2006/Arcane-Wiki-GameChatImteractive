// Chat libre con IA (opcional y gratis): escribes lo que quieras y el personaje responde
// en su papel, al estilo de Character AI. Funciona con Ollama o LM Studio en tu ordenador
// (sin internet; LM Studio también sirve a la tablet por la red de casa) o con servicios
// con clave gratuita (Google Gemini, Groq, OpenRouter).
// Todos hablan el formato de OpenAI (/chat/completions). La clave se guarda solo en
// tus ajustes locales.
(function () {
  const PROVIDERS = {
    off: { label: 'Desactivada' },
    ollamaCloud: { label: 'Ollama Cloud (alojada, recomendada)', url: (window.ROLEPLAY_CONFIG?.endpoint || (window.location.protocol === 'file:' || window.location.hostname === 'localhost' && window.location.port === '' ? '' : '/api/roleplay')), model: 'gemma4:31b', key: false, help: 'No necesitas instalar Ollama ni descargar el modelo. Se usa Gemma 4 de 31B alojado en Ollama Cloud. El servidor del juego debe publicarse con OLLAMA_API_KEY como secreto; en escritorio o Android indica la URL HTTPS del backend. El uso puede tener límites o costes según Ollama Cloud.' },
    ollama: { label: 'Ollama (en tu PC, sin internet)', url: 'http://localhost:11434/v1/chat/completions', model: 'gemma3:4b', key: false, help: 'Instala Ollama desde ollama.com y descarga un modelo en una terminal: «ollama pull gemma3:4b» (rápido, unos 3 GB) o «ollama pull gemma3:12b» (mejor conversación, necesita una tarjeta gráfica con 8 GB o más). Pulsa «Buscar mis modelos» para elegir uno de los que ya tienes. Mientras Ollama esté abierto, los personajes te responden sin internet. Solo en el ordenador.' },
    lmstudio: { label: 'LM Studio (en tu PC o por la red de casa)', url: 'http://localhost:1234/v1/chat/completions', model: '', key: false, help: 'Abre LM Studio, descarga un modelo y en la pestaña Developer enciende «Start server» (puerto 1234). En este ordenador deja la dirección como está. Para jugar desde la tablet o el móvil activa también «Serve on Local Network» y escribe aquí la dirección de tu PC, por ejemplo http://192.168.1.40:1234. Pulsa «Buscar mis modelos» para elegir uno. Los pasos están en GUIA-LM-STUDIO.md.' },
    custom: { label: 'Otro servidor compatible', url: '', model: '', key: true, help: 'Cualquier servidor con el formato de OpenAI (KoboldCpp, text-generation-webui, vLLM…). Escribe la dirección completa de /chat/completions.' },
  };

  // Servidores que corren en tu PC (o en otro de tu red): no piden clave y no salen a internet.
  const LOCAL = new Set(['ollama', 'lmstudio']);

  // Para LM Studio basta con escribir «192.168.1.40» o «http://192.168.1.40:1234»:
  // se completa el puerto y la ruta de /v1/chat/completions.
  function fullUrl(p, url) {
    url = String(url || '').trim();
    if (p !== 'lmstudio' || !url) return url;
    if (!/^https?:\/\//i.test(url)) url = `http://${url}`;
    try {
      const u = new URL(url);
      if (!u.port && u.protocol === 'http:') u.port = '1234';
      if (!/\/chat\/completions$/.test(u.pathname)) u.pathname = `${u.pathname.replace(/\/(v1\/?)?$/, '').replace(/\/+$/, '')}/v1/chat/completions`;
      return u.toString();
    } catch { return url; }
  }

  function cfg() {
    const a = window.App?.settings?.ai || {};
    const p = PROVIDERS[a.provider] ? a.provider : (a.provider ? 'off' : 'ollamaCloud');
    const d = PROVIDERS[p];
    return { provider: p, url: (LOCAL.has(p) || p === 'custom' || p === 'ollamaCloud') ? fullUrl(p, a.url || d.url) : d.url, model: a.model || d.model, key: a.key || '' };
  }

  function ready() {
    const c = cfg();
    if (c.provider === 'off' || !c.url || !c.model) return false;
    return !PROVIDERS[c.provider].key || Boolean(c.key) || c.provider === 'custom';
  }

  // Envía la petición por el camino que no tenga problemas de CORS: el proceso
  // principal en escritorio, el HTTP nativo en Android y fetch en el navegador.
  async function post(url, headers, body) {
    if (window.umbral?.ai) {
      const r = await window.umbral.ai(url, headers, body);
      if (r.error) throw new Error(r.error);
      return r;
    }
    const native = window.Capacitor?.Plugins?.CapacitorHttp;
    if (native && window.Capacitor.isNativePlatform?.()) {
      const r = await native.request({ url, method: 'POST', headers: { ...headers, 'Content-Type': 'application/json' }, data: body, connectTimeout: 20000, readTimeout: 90000 });
      return { status: r.status, data: typeof r.data === 'string' ? JSON.parse(r.data || '{}') : r.data };
    }
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), 90000);
    try {
      const res = await fetch(url, { method: 'POST', headers: { ...headers, 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: ctl.signal });
      return { status: res.status, data: await res.json().catch(() => ({})) };
    } finally {
      clearTimeout(timer);
    }
  }

  // GET corto (listas de modelos), por el mismo camino que post().
  async function get(url) {
    if (window.umbral?.aiGet) {
      const r = await window.umbral.aiGet(url);
      if (r.error) throw new Error(r.error);
      return r.data;
    }
    const native = window.Capacitor?.Plugins?.CapacitorHttp;
    if (native && window.Capacitor.isNativePlatform?.()) {
      const r = await native.request({ url, method: 'GET', connectTimeout: 8000, readTimeout: 8000 });
      return typeof r.data === 'string' ? JSON.parse(r.data || '{}') : r.data;
    }
    return fetch(url).then((r) => r.json());
  }

  // Ollama tiene su propia API (/api/chat), que deja mantener el modelo cargado entre
  // mensajes (sin esperas de 20 s en cada respuesta), limitar lo largo que contesta,
  // apagar el «pensamiento» de los modelos que razonan y cortar si se pone a hablar por ti.
  const ollamaBase = (url) => url.replace(/\/(v1|api)(\/.*)?$/, '').replace(/\/+$/, '');
  const THINKERS = /qwen3|deepseek-r1|magistral|phi4-reasoning|cogito/i;

  async function ollama(c, messages, opts) {
    const body = {
      model: c.model, messages, stream: false, keep_alive: '30m',
      options: { temperature: opts.temperature ?? 0.8, top_p: 0.9, repeat_penalty: 1.12, num_ctx: 4096, num_predict: opts.max ?? 220, stop: opts.stop || [] },
    };
    if (THINKERS.test(c.model)) body.think = false;
    const r = await post(`${ollamaBase(c.url)}/api/chat`, {}, body);
    if (r.status >= 400 || r.data?.error) throw new Error(ollamaError(r.data?.error || `HTTP ${r.status}`, c.model));
    const text = r.data?.message?.content;
    if (!text) throw new Error('La IA no ha devuelto texto');
    return String(text).replace(/<think>[\s\S]*?<\/think>/gi, '');
  }

  function ollamaError(msg, model) {
    msg = typeof msg === 'string' ? msg : JSON.stringify(msg);
    if (/not found|pull/i.test(msg)) return `No tienes el modelo «${model}». Abre una terminal y escribe «ollama pull ${model}», o pulsa «Buscar mis modelos» en Ajustes.`;
    return msg;
  }

  // Modelos que tiene Ollama descargados (para elegir en Ajustes).
  async function ollamaModels() {
    const c = cfg();
    const data = await get(`${ollamaBase(c.url || PROVIDERS.ollama.url)}/api/tags`);
    return (data?.models || []).map((m) => ({ name: m.name, gb: (m.size || 0) / 1e9 })).sort((a, b) => a.gb - b.gb);
  }

  // Modelos de LM Studio. Su API propia (/api/v0/models) dice cuál está ya cargado en la
  // tarjeta gráfica; si no existe (versiones viejas), se usa /v1/models de OpenAI.
  async function lmstudioModels() {
    const base = cfg().url.replace(/\/v1\/chat\/completions$/, '');
    let list;
    try {
      const data = await get(`${base}/api/v0/models`);
      if (!Array.isArray(data?.data)) throw new Error('sin api v0');
      list = data.data.filter((m) => m.type !== 'embeddings').map((m) => ({ name: m.id, loaded: m.state === 'loaded', quant: m.quantization || '' }));
    } catch {
      const data = await get(`${base}/v1/models`);
      list = (data?.data || []).filter((m) => !/embed/i.test(m.id)).map((m) => ({ name: m.id, loaded: false, quant: '' }));
    }
    return list.sort((a, b) => Number(b.loaded) - Number(a.loaded) || a.name.localeCompare(b.name));
  }

  // Lista de modelos del servidor local elegido.
  const models = () => (cfg().provider === 'lmstudio' ? lmstudioModels() : ollamaModels());

  // Carga el modelo en memoria antes del primer mensaje (la primera respuesta es la lenta).
  let warmed = '';
  function warm() {
    const c = cfg();
    if (!LOCAL.has(c.provider) || !c.model || warmed === c.model) return;
    warmed = c.model;
    const call = c.provider === 'ollama'
      ? post(`${ollamaBase(c.url)}/api/chat`, {}, { model: c.model, messages: [], keep_alive: '30m' })
      : post(c.url, {}, { model: c.model, messages: [{ role: 'user', content: 'Hola' }], max_tokens: 1, ttl: 1800 });
    call.catch(() => { warmed = ''; });
  }

  async function complete(messages, opts = {}) {
    const c = cfg();
    if (c.provider === 'ollama') return ollama(c, messages, opts);
    const headers = {};
    if (c.key) headers.Authorization = `Bearer ${c.key}`;
    if (c.provider === 'openrouter') { headers['HTTP-Referer'] = 'https://github.com/MarinaDP2006/RIFTS-GEARS'; headers['X-Title'] = 'Rifts & Gears'; }
    const body = { model: c.model, messages, temperature: opts.temperature ?? 0.9, max_tokens: opts.max ?? 350 };
    // Los modelos que razonan antes de hablar (gpt-oss) gastan parte de los tokens pensando:
    // se les pide que piensen poco y se les deja más margen.
    if (/gpt-oss/.test(c.model)) { body.reasoning_effort = 'low'; body.max_tokens = Math.max(body.max_tokens, 800); }
    // LM Studio: el modelo se queda cargado 30 min tras el último mensaje (sin recargas lentas)
    // y se corta si empieza a escribir tu parte.
    if (c.provider === 'lmstudio') {
      body.ttl = 1800;
      if (opts.stop?.length) body.stop = opts.stop.slice(0, 4);
      if (THINKERS.test(c.model)) body.max_tokens = Math.max(body.max_tokens, 900);
    }
    const r = await post(c.url, headers, body);
    if (r.status >= 400 || r.data?.error) {
      let msg = r.data?.error?.message || r.data?.error || r.data?.message || `HTTP ${r.status}`;
      msg = typeof msg === 'string' ? msg : JSON.stringify(msg);
      if (c.provider === 'lmstudio' && /no models? loaded|not found|model_not_found/i.test(msg)) msg = `LM Studio no encuentra el modelo «${c.model}». Pulsa «Buscar mis modelos» en Ajustes o carga uno en LM Studio.`;
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

  // Prueba la conexión y mide cuánto tarda (la primera vez incluye cargar el modelo).
  async function test() {
    const t0 = performance.now();
    const text = await complete([{ role: 'user', content: 'Di «¡Hola desde Nácar!» y nada más.' }], { max: 20, temperature: 0 });
    return { text: text.trim(), secs: (performance.now() - t0) / 1000 };
  }

  window.AI = { PROVIDERS, LOCAL, cfg, ready, reply, storyTurn, test, warm, models, ollamaModels, lmstudioModels };
})();
