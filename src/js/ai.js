// Chat libre con IA (opcional y gratis): escribes lo que quieras y el personaje responde
// en su papel, al estilo de Character AI. Funciona con Ollama en tu ordenador (sin
// internet) o con servicios con clave gratuita (Google Gemini, Groq, OpenRouter).
// Todos hablan el formato de OpenAI (/chat/completions). La clave se guarda solo en
// tus ajustes locales.
(function () {
  const PROVIDERS = {
    off: { label: 'Desactivada' },
    ollama: { label: 'Ollama (en tu PC, sin internet)', url: 'http://localhost:11434/v1/chat/completions', model: 'llama3.2', key: false, help: 'Instala Ollama desde ollama.com, abre una terminal y escribe «ollama pull llama3.2». Mientras Ollama esté abierto, los personajes te responderán sin internet. Solo en el ordenador.' },
    custom: { label: 'Otro servidor compatible', url: '', model: '', key: true, help: 'Cualquier servidor con el formato de OpenAI (LM Studio, KoboldCpp, text-generation-webui…). Escribe la dirección completa de /chat/completions.' },
  };

  function cfg() {
    const a = window.App?.settings?.ai || {};
    const p = PROVIDERS[a.provider] ? a.provider : 'off';
    const d = PROVIDERS[p];
    return { provider: p, url: (p === 'custom' || p === 'ollama') && a.url ? a.url : d.url, model: a.model || d.model, key: a.key || '' };
  }

  function ready() {
    const c = cfg();
    if (c.provider === 'off' || !c.url || !c.model) return false;
    return !PROVIDERS[c.provider].key || Boolean(c.key) || c.provider === 'custom';
  }

  // Envía la petición por el camino que no tenga problemas de CORS: el proceso
  // principal en escritorio, el HTTP nativo en Android y fetch en el navegador.
  async function post(url, headers, body) {
    if (window.arcane?.ai) {
      const r = await window.arcane.ai(url, headers, body);
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

  async function complete(messages, opts = {}) {
    const c = cfg();
    const headers = {};
    if (c.key) headers.Authorization = `Bearer ${c.key}`;
    if (c.provider === 'openrouter') { headers['HTTP-Referer'] = 'https://github.com/MarinaDP2006/grietas-and-gears'; headers['X-Title'] = 'Grietas & Gears'; }
    const body = { model: c.model, messages, temperature: opts.temperature ?? 0.9, max_tokens: opts.max ?? 350 };
    // Los modelos que razonan antes de hablar (gpt-oss) gastan parte de los tokens pensando:
    // se les pide que piensen poco y se les deja más margen.
    if (/gpt-oss/.test(c.model)) { body.reasoning_effort = 'low'; body.max_tokens = Math.max(body.max_tokens, 800); }
    const r = await post(c.url, headers, body);
    if (r.status >= 400 || r.data?.error) {
      const msg = r.data?.error?.message || r.data?.error || r.data?.message || `HTTP ${r.status}`;
      throw new Error(typeof msg === 'string' ? msg : JSON.stringify(msg));
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
    const samples = d ? [d.greet?.mid, d.greet?.high, ...(d.bye || []), ...Object.values(d.nodes || {}).flatMap((n) => [].concat(n.say || []))]
      .filter((x) => typeof x === 'string').slice(0, 8).map((x) => `«${t(x)}»`) : [];
    const feel = aff <= -3 ? 'Le tienes antipatía y desconfías.' : aff < 1 ? 'Le tratas con cautela.' : aff < 5 ? 'Te cae bien.' : aff < 8 ? 'Le aprecias mucho.' : 'Es una de las personas más importantes para ti.';
    return [
      `Eres ${name}, de la serie Arcane (Piltover y Zaun). Interpreta a ${name} en un chat dentro de un juego de fans, siempre en su papel y en primera persona.`,
      `Personalidad: ${info?.persona || window.WIKI.personajes.find((x) => x.id === id)?.role || ''}`,
      samples.length ? `Así hablas (frases tuyas en el juego): ${samples.join(' ')}` : '',
      `Hablas con ${who}.`,
      `${relTxt} Afinidad ${aff}/10: ${feel}${mate && mate !== id ? ` (${p.name} sale con ${window.WIKI.personajes.find((x) => x.id === mate)?.name}.)` : ''}`,
      ch ? `Momento de la historia: ${ch.title}${G.progress.season === 2 ? ' (segunda temporada)' : ''}. No reveles cosas que tu personaje aún no sabe.` : '',
      `Normas: responde SIEMPRE en ${LANG[window.I18N?.lang] || LANG.es}; mensajes cortos de chat (1 a 4 frases); describe gestos entre paréntesis, como «(se cruza de brazos)»; usa tu forma de hablar, tu humor y tus manías; nunca digas que eres una IA ni hables de este juego; si te piden algo fuera de lugar, reacciona como lo haría ${name}. Romance tierno y coqueteo sí; nada sexual explícito ni violencia gráfica.`,
      `Al final de cada respuesta añade una línea aparte con [[afinidad:+1]], [[afinidad:0]] o [[afinidad:-1]] según cómo te ha tratado ${p.name} en su último mensaje.`,
    ].filter(Boolean).join('\n');
  }

  // Últimos mensajes del comunicador como historial (yo = user, el personaje = assistant).
  function history(G, id) {
    const out = [];
    for (const m of (G.chats[id] || []).slice(-24)) {
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
    const raw = await complete([{ role: 'system', content: systemPrompt(G, id) }, ...history(G, id)]);
    const m = raw.match(/\[\[\s*afinidad\s*:\s*([+-]?\d)\s*\]\]/i);
    const aff = m ? Math.max(-1, Math.min(1, Number(m[1]))) : 0;
    const text = raw.replace(/\[\[[^\]]*\]\]/g, '').replace(/^\s*(\*\*)?[A-ZÁÉÍÓÚa-z ]{2,20}:(\*\*)?\s*/, '').trim();
    return { text: text || '(Se queda en silencio.)', aff };
  }

  async function test() {
    const text = await complete([{ role: 'user', content: 'Di «¡Hola desde Zaun!» y nada más.' }], { max: 20, temperature: 0 });
    return text.trim();
  }

  window.AI = { PROVIDERS, cfg, ready, reply, test };
})();
