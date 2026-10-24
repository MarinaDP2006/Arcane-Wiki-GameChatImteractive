// Demo de rol libre en el navegador. Sin opciones fijas: escribes lo que tu personaje dice o
// hace y el narrador y los personajes te contestan. Los datos del mundo vienen de window.DEMO
// (demo-datos.js). La IA es KoboldCpp (koboldcpp.js): la del servidor de la web o la tuya, en tu
// PC o en tu red de casa. Si ninguna responde, un narrador local mantiene la escena para que la
// demo no se quede muda, y el panel «Conexión con KoboldCpp» explica por qué.
(() => {
  'use strict';
  const D = window.DEMO;
  const app = document.getElementById('demo-app');
  if (!D || !app) return;

  const K = window.KoboldWeb;
  const KEY = 'demo-' + D.id;
  const PRONOMBRES = [['el', 'Él'], ['ella', 'Ella'], ['elle', 'Elle']];

  const make = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
  const gen = (txt, i) => String(txt).replace(/\{g:([^}]*)\}/g, (m, opts) => opts.split('|')[i] ?? opts.split('|')[0]);
  const pick = (arr, n) => arr[Math.abs(n) % arr.length];

  let st = load() || { paso: 'pregunta' };
  // Conexión con KoboldCpp: se comprueba en cada visita. estado: comprobando | listo | local
  const cx = { cfg: K ? K.cargar() : { modo: 'servidor', url: '', password: '' }, estado: 'comprobando', modelo: '', error: '' };
  function load() { try { return JSON.parse(localStorage.getItem(KEY)); } catch { return null; } }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch { /* sin almacenamiento: la demo sigue */ } }
  function go(paso) { st.paso = paso; save(); render(); app.scrollIntoView({ behavior: 'smooth', block: 'start' }); }

  function render() {
    app.replaceChildren();
    tema(st.paso === 'juego' && st.pj ? st.pj.ciudad : '');
    ({ pregunta, intro, crear, juego }[st.paso] || pregunta)();
  }
  // Como en el juego («Colores según la ciudad»): la página toma la paleta de tu ciudad.
  function tema(ciudad) { if (ciudad) document.documentElement.dataset.tema = ciudad; else delete document.documentElement.dataset.tema; }

  // ---------- Conexión con KoboldCpp ----------
  const zona = document.getElementById('demo-conexion');
  let panel = null;

  function textoEstado() {
    if (cx.estado === 'comprobando') return ['punto-espera', 'Comprobando KoboldCpp…'];
    if (cx.estado === 'listo') {
      const donde = cx.cfg.modo === 'mio' ? 'Tu KoboldCpp' : 'KoboldCpp del servidor';
      return ['punto-listo', donde + (cx.modelo ? ' · ' + cx.modelo : '') + ' · conectado'];
    }
    return ['punto-apagado', 'Narrador local (sin IA)'];
  }
  function pintarEstado() {
    const [cls, txt] = textoEstado();
    document.querySelectorAll('[data-kc-estado]').forEach((el) => {
      el.replaceChildren(make('span', 'punto ' + cls), document.createTextNode(txt));
    });
  }

  function mensaje(tipo, texto, enlace) {
    const m = panel && panel.querySelector('[data-kc-msg]');
    if (!m) return;
    m.hidden = !texto; m.dataset.tipo = tipo; m.textContent = texto || '';
    if (enlace) { const a = make('a', '', enlace[0]); a.href = enlace[1]; m.append(' ', a); }
  }
  const ALTERNATIVAS = ['Ver alternativas', 'index.html#ia'];

  async function comprobar() {
    if (!K) { cx.estado = 'local'; pintarEstado(); return; }
    cx.estado = 'comprobando'; cx.error = ''; pintarEstado(); mensaje('aviso', '');
    const boton = panel && panel.querySelector('[data-kc-probar]'); if (boton) boton.disabled = true;
    try {
      if (cx.cfg.modo === 'mio') {
        const r = await K.probarMio(cx.cfg.url);
        cx.estado = 'listo'; cx.modelo = r.modelo;
        mensaje('ok', `Conectado con tu KoboldCpp${r.modelo ? ' (' + r.modelo + ')' : ''}. Los personajes ya responden con IA.`);
      } else {
        const r = await K.estadoServidor();
        if (r.estado === 'conectado') { cx.estado = 'listo'; cx.modelo = r.modelo; mensaje('ok', 'El servidor de la web tiene KoboldCpp encendido. No necesitas instalar nada.'); }
        else {
          cx.estado = 'local';
          cx.error = {
            'sin-modelo': 'El servidor llega a KoboldCpp, pero no tiene un modelo abierto ahora mismo.',
            'sin-conexion': 'El KoboldCpp del servidor está apagado ahora mismo.',
            'sin-servidor': 'Esta copia de la web no tiene servidor.',
          }[r.estado] || 'No se ha podido comprobar el servidor.';
          mensaje('aviso', cx.error + ' Puedes elegir «Mi KoboldCpp» o seguir con el narrador local.');
        }
      }
    } catch (err) {
      cx.estado = 'local'; cx.error = err.message;
      mensaje('error', err.message, err.tipo === 'https' ? ALTERNATIVAS : null);
    }
    if (boton) boton.disabled = false;
    pintarEstado();
    // Abierto mientras no haya IA, para que se vea por qué y cómo conectarla.
    if (panel) panel.open = cx.estado !== 'listo';
  }

  function panelConexion() {
    if (!zona) return;
    panel = make('details', 'kc');
    const sum = make('summary');
    const titulo = make('span', 'kc-titulo'); titulo.append(make('i', 'gema'), document.createTextNode('Conexión con KoboldCpp'));
    const pastilla = make('span', 'kc-pastilla'); pastilla.dataset.kcEstado = ''; pastilla.setAttribute('aria-live', 'polite');
    sum.append(titulo, pastilla);
    const cuerpo = make('div', 'kc-cuerpo');

    const fs = make('fieldset', 'kc-modos'); fs.append(make('legend', '', '¿Qué KoboldCpp usa la demo?'));
    [['servidor', 'La del servidor de la web', 'Sin instalar nada. Funciona si el servidor tiene KoboldCpp encendido.'],
     ['mio', 'Mi KoboldCpp', 'En este PC o en otro de tu red de casa, por ejemplo 192.168.1.139.']].forEach(([v, t, d]) => {
      const l = make('label', 'kc-modo'); const r = make('input'); r.type = 'radio'; r.name = 'kc-modo'; r.value = v; r.checked = cx.cfg.modo === v;
      const sp = make('span'); sp.append(make('strong', '', t), make('small', '', d)); l.append(r, sp); fs.append(l);
    });

    const bloqueUrl = make('div', 'kc-url');
    const lab = make('label', 'dj-campo'); lab.htmlFor = 'kc-url'; lab.textContent = 'Dirección de tu KoboldCpp';
    const fila = make('div', 'kc-fila');
    const input = make('input'); input.type = 'text'; input.id = 'kc-url'; input.value = cx.cfg.url; input.placeholder = '192.168.1.139 o localhost';
    input.inputMode = 'url'; input.autocomplete = 'off'; input.spellcheck = false; input.setAttribute('autocapitalize', 'off');
    const passLabel = make('label', 'dj-campo'); const passInput = make('input'); passInput.type = 'password'; passInput.id = 'kc-password'; passInput.autocomplete = 'off'; passInput.spellcheck = false; passInput.value = cx.cfg.password || ''; passInput.placeholder = 'Opcional: contraseña Password de KoboldCpp';
    passLabel.append(make('span', '', 'Contraseña Password de KoboldCpp (opcional)'), passInput);
    const probar = make('button', 'btn btn-primario', 'Probar conexión'); probar.type = 'button'; probar.dataset.kcProbar = '';
    fila.append(input, probar);
    const usara = make('p', 'kc-usara');
    const avisoHttps = make('p', 'kc-msg'); avisoHttps.dataset.tipo = 'aviso';
    bloqueUrl.append(lab, fila, passLabel, usara, avisoHttps);

    const recomprobar = make('button', 'btn btn-borde btn-sm', 'Comprobar de nuevo'); recomprobar.type = 'button'; recomprobar.dataset.kcProbar = '';
    const msg = make('p', 'kc-msg'); msg.hidden = true; msg.dataset.kcMsg = ''; msg.setAttribute('role', 'status');
    cuerpo.append(fs, bloqueUrl, recomprobar, msg);
    panel.append(sum, cuerpo);
    zona.replaceChildren(panel);

    const actualizar = () => {
      const mio = cx.cfg.modo === 'mio';
      bloqueUrl.hidden = !mio; recomprobar.hidden = mio;
      const full = K ? K.normalizar(input.value) : '';
      usara.textContent = full ? 'La demo usará: ' + full.replace(/\/v1\/chat\/completions$/, '') + ' (API /v1/chat/completions)' : 'Escribe solo la IP o el nombre del PC; el puerto 5001 se pone solo.';
      let aviso = '';
      if (full && K.bloqueadoPorHttps(full)) aviso = 'Esta web usa HTTPS. En Chrome/Edge modernos, al probar la IP local aparecerá un permiso «Acceso a la red local»: pulsa «Permitir». Si lo bloqueaste antes, ve a Ajustes del sitio → Acceso a la red local → Permitir.';
      else if (full && matchMedia('(pointer: coarse)').matches && K.esLoopback(new URL(full).hostname)) aviso = 'En un móvil o una tablet, «localhost» es el propio aparato. Escribe la IP del PC con KoboldCpp.';
      avisoHttps.hidden = !aviso || !mio; avisoHttps.textContent = aviso;
    };
    fs.addEventListener('change', (e) => {
      cx.cfg.modo = e.target.value; K && K.guardar(cx.cfg); actualizar();
      if (cx.cfg.modo === 'servidor' || cx.cfg.url) comprobar(); else { cx.estado = 'local'; pintarEstado(); mensaje('aviso', 'Escribe la dirección de tu KoboldCpp y pulsa «Probar conexión».'); input.focus(); }
    });
    input.addEventListener('input', () => { cx.cfg.url = input.value.trim(); K && K.guardar(cx.cfg); actualizar(); });
    passInput.addEventListener('input', () => { cx.cfg.password = passInput.value; K && K.guardar(cx.cfg); });
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); comprobar(); } });
    probar.onclick = comprobar; recomprobar.onclick = comprobar;
    actualizar(); pintarEstado();
  }

  // 1. ¿Conoce el mundo? Si no, introducción breve; si sí, directo a la creación.
  function pregunta() {
    const box = make('div', 'dj-card dj-centro');
    box.append(make('p', 'dj-kicker', 'Antes de empezar'), make('h2', '', D.pregunta));
    const row = make('div', 'dj-acciones');
    const si = make('button', 'btn btn-primario', 'Sí, vamos a crear'); si.onclick = () => go('crear');
    const no = make('button', 'btn btn-borde', 'No, cuéntamelo'); no.onclick = () => go('intro');
    row.append(si, no); box.append(row); app.append(box);
  }

  function intro() {
    const box = make('div', 'dj-card');
    box.append(make('p', 'dj-kicker', 'Introducción breve'), make('h2', '', D.introTitulo));
    D.intro.forEach(p => box.append(make('p', 'dj-texto', p)));
    const b = make('button', 'btn btn-primario', 'Crear mi personaje'); b.onclick = () => go('crear');
    box.append(b); app.append(box);
  }

  // 2. Creación de personaje.
  function crear() {
    const f = make('form', 'dj-card dj-form');
    f.append(make('p', 'dj-kicker', 'Creación de personaje'), make('h2', '', '¿Quién eres?'));
    const campo = (label, el) => { const l = make('label', 'dj-campo'); l.append(make('span', '', label), el); return l; };
    const nombre = make('input'); nombre.required = true; nombre.maxLength = 30; nombre.placeholder = 'Tu nombre'; nombre.autocomplete = 'off';
    const pron = make('select'); PRONOMBRES.forEach(([v, t], i) => { const o = make('option', '', t); o.value = String(i); pron.append(o); });
    f.append(campo('Nombre', nombre), campo('Pronombres', pron));

    const fs = make('fieldset', 'dj-ciudades'); fs.append(make('legend', '', 'Ciudad de origen'));
    // Cada ciudad trae su paleta, como en el creador del juego.
    const ids = Object.keys(D.ciudades);
    ids.forEach((id, i) => {
      const c = D.ciudades[id]; const l = make('label', 'dj-ciudad dj-ciudad-' + id);
      const r = make('input'); r.type = 'radio'; r.name = 'ciudad'; r.value = id; r.checked = i === 0;
      const t = make('span'); t.append(make('strong', '', c.label), make('small', '', c.tagline));
      l.dataset.tema = id; l.append(r, t); fs.append(l);
    });
    f.append(fs);

    const oficio = make('select');
    const fillOficios = () => {
      const c = D.ciudades[f.ciudad.value]; const g = Number(pron.value);
      oficio.replaceChildren(...c.oficios.map(o => { const op = make('option', '', gen(o, g)); op.value = gen(o, g); return op; }));
    };
    f.append(campo('Oficio', oficio));
    const yo = make('textarea'); yo.rows = 3; yo.maxLength = 400; yo.placeholder = 'Opcional. Escríbelo con tus palabras: carácter, miedos, qué buscas…';
    f.append(campo('Cuéntanos algo de tu personaje', yo));
    const enviar = make('button', 'btn btn-primario', 'Entrar en la historia'); enviar.type = 'submit'; f.append(enviar);

    f.addEventListener('change', e => { if (e.target.name === 'ciudad' || e.target === pron) fillOficios(); if (e.target.name === 'ciudad') tema(e.target.value); });
    f.addEventListener('submit', e => {
      e.preventDefault();
      const ciudad = f.ciudad.value;
      st = { paso: 'juego', pj: { nombre: nombre.value.trim() || 'Sin nombre', pron: Number(pron.value), ciudad, oficio: oficio.value, yo: yo.value.trim() }, log: [], turno: 0 };
      const esc = D.escenas[ciudad];
      st.log.push({ role: 'assistant', content: 'Narrador: ' + esc.apertura.replace('{nombre}', st.pj.nombre).replace('{oficio}', st.pj.oficio.charAt(0).toLowerCase() + st.pj.oficio.slice(1)) });
      go('juego');
    });
    app.append(f); fillOficios(); tema(f.ciudad.value); nombre.focus({ preventScroll: true });
  }

  // 3. Rol libre.
  function juego() {
    const esc = D.escenas[st.pj.ciudad];
    const wrap = make('div', 'dj-juego');
    const head = make('div', 'dj-escena dj-escena-' + st.pj.ciudad);
    head.append(make('p', 'dj-kicker', D.ciudades[st.pj.ciudad].label + ' · ' + esc.lugar), make('h2', '', esc.titulo));
    const pres = make('p', 'dj-presentes', 'En escena: ' + esc.presentes.map(id => nombreDe(id)).join(', '));
    head.append(pres); wrap.append(head);

    const log = make('div', 'dj-log'); log.setAttribute('role', 'log'); log.setAttribute('aria-live', 'polite');
    st.log.forEach(m => log.append(burbuja(m)));
    wrap.append(log);

    const estado = make('p', 'dj-estado'); estado.dataset.kcEstado = ''; estado.setAttribute('aria-live', 'polite');
    const form = make('form', 'dj-entrada');
    const ta = make('textarea'); ta.rows = 2; ta.maxLength = 600; ta.required = true;
    ta.placeholder = 'Escribe lo que dices o haces. Por ejemplo: «Me acerco a ' + nombreDe(esc.presentes[0]) + ' y le pregunto qué ha visto».';
    ta.setAttribute('aria-label', 'Tu acción o diálogo');
    const send = make('button', 'btn btn-primario', 'Enviar'); send.type = 'submit';
    form.append(ta, send);
    ta.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); form.requestSubmit(); } });
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const txt = ta.value.trim(); if (!txt) return;
      ta.value = ''; send.disabled = ta.disabled = true;
      const m = { role: 'user', content: txt }; st.log.push(m); log.append(burbuja(m));
      const pensando = make('div', 'dj-msg dj-pensando', 'La escena responde…'); log.append(pensando); bajar(log);
      const r = await responder(txt);
      pensando.remove();
      const a = { role: 'assistant', content: r }; st.log.push(a); st.turno++; save();
      log.append(burbuja(a)); bajar(log);
      send.disabled = ta.disabled = false; ta.focus();
    });

    const pie = make('div', 'dj-pie');
    const reset = make('button', 'btn btn-texto', 'Empezar de nuevo');
    reset.onclick = () => { if (confirm('¿Borrar esta partida de la demo y crear otro personaje?')) { st = { paso: 'pregunta' }; save(); render(); } };
    pie.append(estado, reset);
    wrap.append(form, pie); app.append(wrap); bajar(log); pintarEstado();
  }

  const nombreDe = id => (D.reparto.find(p => p.id === id) || {}).name || id;
  function bajar(el) { el.scrollTop = el.scrollHeight; }

  // Pinta un mensaje. Las líneas «Nombre: texto» se muestran como intervenciones de personaje.
  function burbuja(m) {
    if (m.role === 'user') { const d = make('div', 'dj-msg dj-yo'); d.append(make('b', '', st.pj.nombre), make('p', '', m.content)); return d; }
    const d = make('div', 'dj-msg dj-mundo');
    m.content.replace(/\*\*/g, '').split(/\n+/).map(l => l.trim()).filter(Boolean).forEach(l => {
      const mm = l.match(/^([A-ZÁÉÍÓÚÑ][\wÁÉÍÓÚÑáéíóúñü' .-]{1,28}):\s*(.+)$/);
      if (mm && mm[1].toLowerCase() !== 'narrador') { const p = make('p', 'dj-voz'); p.append(make('b', '', mm[1]), document.createTextNode(' ' + mm[2])); d.append(p); }
      else d.append(make('p', 'dj-narra', mm ? mm[2] : l));
    });
    return d;
  }

  function sistema() {
    const esc = D.escenas[st.pj.ciudad]; const pj = st.pj;
    const fichas = esc.presentes.map(id => { const p = D.reparto.find(x => x.id === id); if (!p) return ''; const v = p.voice || {}; const l = p.lore || {}; return [`- ${p.name} (${p.role}): ${p.summary}`, p.details?.length ? `  Datos conocidos: ${p.details.join(' ')}` : '', p.quote ? `  Frase de referencia: «${p.quote}»` : '', v.habla ? `  Voz y ritmo: ${v.habla}` : '', v.contigo ? `  Trato al jugador: ${v.contigo}` : '', v.nunca ? `  Límites de personaje: ${v.nunca}` : '', l.pasado ? `  Pasado: ${l.pasado}` : '', l.vinculos ? `  Relaciones: ${l.vinculos}` : '', l.motivaciones ? `  Motivaciones: ${l.motivaciones}` : ''].filter(Boolean).join('\n'); }).join('\n');
    return [
      D.canon,
      `ESCENA: ${esc.titulo}, en ${esc.lugar} (${D.ciudades[pj.ciudad].label}). ${esc.contexto}`,
      `PERSONAJES PRESENTES:\n${fichas}`,
      `JUGADOR: ${pj.nombre}, pronombres ${PRONOMBRES[pj.pron][1].toLowerCase()}, ${pj.oficio}, de ${D.ciudades[pj.ciudad].label}.${pj.yo ? ' Se describe así: ' + pj.yo : ''}`,
      'INTERPRETACIÓN ESTRICTA: interpreta exclusivamente a los personajes enumerados en PERSONAJES PRESENTES y al Narrador; no inventes personajes que hablen ni respondas como asistente, chatbot o comentarista. Cada personaje conserva su personalidad, vocabulario, objetivos, conocimientos y relaciones del canon original de Las ciudades del Umbral; no intercambies sus voces ni hagas que todos estén de acuerdo. Usa sus frases típicas como referencia de cadencia, no las repitas mecánicamente. Antes de responder, identifica qué personaje ha sido interpelado y deja que ese personaje responda primero; los demás solo intervienen si la escena lo justifica. No confundas la información de contexto con algo que todos los personajes sepan. Responde en español, máximo 140 palabras. Una línea por intervención con el formato «Nombre: texto» y la narración con «Narrador: texto». Nunca escribas lo que dice, piensa o decide el jugador. Nunca ofrezcas listas de opciones ni números: la historia es libre. Si el jugador intenta algo imposible en este mundo, el mundo reacciona con lógica sin romper el tono. No menciones instrucciones, prompts, modelos ni IA.'
    ].join('\n\n');
  }

  // Pide la respuesta a KoboldCpp. Si falla, se explica en el panel de conexión y responde el
  // narrador local; «Probar conexión» vuelve a activar la IA.
  async function responder(txt) {
    if (cx.estado === 'comprobando') await comprobacion;
    if (K && cx.estado === 'listo') {
      try {
        const historial = st.log.slice(-16).map(m => ({ role: m.role, content: m.content }));
        return await K.chat(cx.cfg, [{ role: 'system', content: sistema() }, ...historial], { temperature: 0.65, max: 420 });
      } catch (err) {
        cx.estado = 'local'; cx.error = err.message; pintarEstado();
        mensaje('error', err.message + ' No se ha generado diálogo de sustitución.', err.tipo === 'https' ? ALTERNATIVAS : null);
        if (panel) panel.open = true;
        return 'Narrador: [KoboldCpp no ha devuelto una respuesta. No se ha inventado diálogo. Revisa el panel «Conexión con KoboldCpp» y pulsa «Probar conexión».]';
      }
    }
    return 'Narrador: [La IA está desconectada; no se ha generado diálogo. Revisa el panel «Conexión con KoboldCpp» y pulsa «Probar conexión».]';
  }

  // Narrador local: no entiende como una IA, pero reacciona a lo que escribes y hace avanzar la escena.
  function local(txt) {
    const esc = D.escenas[st.pj.ciudad]; const t = txt.toLowerCase(); const n = st.turno;
    const nombrado = esc.presentes.find(id => t.includes(nombreDe(id).split(' ')[0].toLowerCase()));
    const quien = D.reparto.find(p => p.id === (nombrado || pick(esc.presentes, n)));
    const nom = quien.name;
    let voz;
    if (/\b(hola|buenas|saludo)/.test(t)) voz = `${pick(['Hola', 'Buenas', 'Llegas a tiempo'], n)}, ${st.pj.nombre}. ${quien.quote}`;
    else if (/(amenaz|golpe|pega|mata|dispar|ataca)/.test(t)) voz = pick(['Baja eso. Aquí ya hay bastante que reparar sin sumar heridas.', 'Si empiezas así, nadie te contará la verdad. Piénsalo.', 'No soy tu enemigo. Pero tampoco me voy a quedar de brazos cruzados.'], n);
    else if (t.includes('?') || /(qué|quién|cómo|por qué|dónde|cuándo|pregunt)/.test(t)) voz = pick([quien.summary, ...(quien.details || [])], n) + ' ¿Y tú qué harías con eso?';
    else if (/(ayud|repar|arregl|cur|proteg)/.test(t)) voz = pick(['Vale. Sujeta esto y no sueltes hasta que te diga.', 'Ayudar está bien. Ayudar sin preguntar quién paga el coste, no tanto.', 'Gracias. No mucha gente se ofrece sin pedir algo a cambio.'], n);
    else voz = pick([quien.quote, '¿Estás segur' + ['o', 'a', 'e'][st.pj.pron] + '? Lo que hagas ahora lo va a recordar alguien.', 'Interesante. Sigue, te escucho.'], n);
    return `${nom}: ${voz}\nNarrador: ${pick(esc.giros, n)}`;
  }

  panelConexion();
  // No solicites acceso a la LAN al cargar una página HTTPS: Chrome requiere un gesto del usuario
  // cuando el permiso aún no está concedido. Si se guardó «Mi KoboldCpp», espera al clic en Probar.
  let comprobacion = Promise.resolve();
  if (cx.cfg.modo === 'servidor') {
    comprobacion = comprobar();
  } else {
    cx.estado = 'local';
    pintarEstado();
    mensaje('aviso', 'Pulsa «Probar conexión» para conectar con tu KoboldCpp local. Si Chrome/Edge pregunta por acceso a la red local, pulsa «Permitir».');
    if (panel) panel.open = true;
  }
  render();
})();
