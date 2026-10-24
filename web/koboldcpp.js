// Conexión de la web con KoboldCpp, la única IA del juego. Hay dos caminos:
// - «servidor»: la demo pide a /api/roleplay y el servidor de la web reenvía a su KOBOLDCPP_URL.
// - «mio»: el navegador habla directamente con tu KoboldCpp, en este PC o en otro de tu red de casa
//   (por ejemplo http://192.168.1.139:5001). Nada pasa por el servidor de la web.
// Los mensajes de error explican qué hacer, igual que en Ajustes → IA del juego.
(() => {
  'use strict';
  const CLAVE = 'umbral-koboldcpp';
  const PUERTO = '5001';
  const MODELO = 'koboldcpp';

  const esLoopback = (host) => /^(localhost|127\.\d+\.\d+\.\d+|\[::1\])$/i.test(host);
  const esTactil = () => matchMedia('(pointer: coarse)').matches;
  const hostDe = (url) => { try { return new URL(url).host; } catch { return url; } };

  // Igual que en el juego (src/js/ai.js): basta con escribir «192.168.1.139»; el puerto 5001 y la
  // ruta /v1/chat/completions se ponen solos. También vale pegar la dirección de KoboldAI Lite
  // («…:5001/#») o la de su API propia («…/api»).
  function normalizar(url) {
    url = String(url || '').trim();
    if (!url) return '';
    if (!/^https?:\/\//i.test(url)) url = 'http://' + url;
    try {
      const u = new URL(url);
      if (!u.port && u.protocol === 'http:') u.port = PUERTO;
      u.hash = ''; u.search = '';
      if (!/\/chat\/completions$/.test(u.pathname)) u.pathname = u.pathname.replace(/\/(api|v1)(\/.*)?$/, '').replace(/\/+$/, '') + '/v1/chat/completions';
      return u.toString();
    } catch { return ''; }
  }
  const base = (url) => url.replace(/\/v1\/chat\/completions$/, '');

  function cargar() {
    let c = {};
    try { c = JSON.parse(localStorage.getItem(CLAVE)) || {}; } catch { /* sin almacenamiento */ }
    return { modo: c.modo === 'servidor' ? 'servidor' : 'mio', url: typeof c.url === 'string' && c.url.trim() ? c.url : 'http://192.168.1.139:5001', password: typeof c.password === 'string' ? c.password : '' };
  }
  function guardar(c) { try { localStorage.setItem(CLAVE, JSON.stringify({ modo: c.modo, url: c.url, password: c.password || '' })); } catch { /* sin almacenamiento */ } }

  // Una página https no puede pedir nada a una dirección http (contenido mixto). Los navegadores
  // hacen una excepción con «localhost» del propio aparato, pero no con las IP de la red de casa.
  function bloqueadoPorHttps(url) {
    try { const u = new URL(url); return location.protocol === 'https:' && u.protocol === 'http:' && !esLoopback(u.hostname); } catch { return false; }
  }

  const fallo = (tipo, mensaje) => Object.assign(new Error(mensaje), { tipo });

  // Traduce un fallo de red al hablar directamente con KoboldCpp en algo que se pueda arreglar.
  function explicar(err, url) {
    if (err && err.tipo) return err;
    let u = null; try { u = new URL(url); } catch { /* dirección rara */ }
    if (u && esLoopback(u.hostname) && esTactil()) return fallo('localhost', '«localhost» es este mismo móvil o tablet, no tu PC. Escribe la IP del PC con KoboldCpp, por ejemplo 192.168.1.139 (la ves en el PC con «ipconfig», Dirección IPv4).');

    if (u && /^192\.168\.\d+\.1$/.test(u.hostname)) return fallo('router', `${u.hostname} suele ser el router, no tu PC. Usa la «Dirección IPv4» que da «ipconfig» en el PC con KoboldCpp, por ejemplo 192.168.1.139.`);
    if (err && (err.name === 'AbortError' || err.name === 'TimeoutError')) return fallo('lento', 'KoboldCpp ha tardado demasiado en responder. Prueba con un modelo más pequeño o con más «GPU Layers».');
    return fallo('red', `No se llega a KoboldCpp en ${hostDe(url)}. Comprueba que está abierto con el modelo cargado, que el PC y este aparato están en la misma wifi y que el cortafuegos de Windows deja pasar el puerto 5001.`);
  }

  // Petición directa a tu KoboldCpp. «targetAddressSpace» es la forma estándar de avisar al
  // navegador de que la dirección es de tu red local (Chrome puede pedirte permiso); los
  // navegadores que no lo conocen lo ignoran.
  async function directo(url, init, ms) {
    const opciones = { ...init, signal: AbortSignal.timeout(ms) };
    // Chrome/Edge gestionan el permiso de acceso a la red local desde la página HTTPS.
    // No se debe bloquear aquí: el permiso aparece al probar la conexión desde un botón.
    try { return await fetch(url, opciones); } catch (err) { throw explicar(err, url); }
  }

  // ¿Qué tal está el KoboldCpp del servidor de la web? → { estado, modelo }
  // estado: conectado | sin-conexion | sin-modelo | sin-servidor
  async function estadoServidor() {
    if (location.protocol === 'file:') return { estado: 'sin-servidor' };
    try {
      const r = await fetch('/api/health', { signal: AbortSignal.timeout(8000), cache: 'no-store' });
      const j = await r.json();
      if (!j || j.provider !== 'koboldcpp') return { estado: 'sin-servidor' };
      // Servidores antiguos no comprobaban KoboldCpp: se trata como desconocido, se probará al jugar.
      return { estado: j.koboldcpp || 'conectado', modelo: j.model || '' };
    } catch { return { estado: 'sin-servidor' }; }
  }

  // Comprueba tu KoboldCpp y devuelve el modelo que tiene abierto.
  async function probarMio(url, password = '') {
    const full = normalizar(url);
    if (!full) throw fallo('vacia', 'Escribe la dirección de tu KoboldCpp, por ejemplo 192.168.1.139 o http://localhost:5001.');
    const r = await directo(base(full) + '/v1/models', { cache: 'no-store', headers: password ? { Authorization: `Bearer ${password}` } : {} }, 8000);
    if (!r.ok) throw fallo('api', `${hostDe(full)} responde, pero no como la API de KoboldCpp (HTTP ${r.status}). Revisa el puerto (5001) y que el modelo haya terminado de cargar.`);
    const j = await r.json().catch(() => ({}));
    const id = j && j.data && j.data[0] && j.data[0].id;
    return { modelo: id ? String(id).replace(/^koboldcpp\//, '') : MODELO, url: full };
  }

  // Pide una respuesta por el camino elegido. Devuelve el texto o lanza un error explicado.
  async function chat(cfg, messages, opts = {}) {
    const body = { model: MODELO, messages, temperature: opts.temperature ?? 0.85, max_tokens: opts.max ?? 380 };
    let r;
    if (cfg.modo === 'mio') {
      const url = normalizar(cfg.url);
      if (!url) throw fallo('vacia', 'Falta la dirección de tu KoboldCpp. Escríbela en «Conexión con KoboldCpp».');
      r = await directo(url, { method: 'POST', headers: { 'Content-Type': 'application/json', ...(cfg.password ? { Authorization: `Bearer ${cfg.password}` } : {}) }, body: JSON.stringify(body) }, 90000);
    } else {
      if (location.protocol === 'file:') throw fallo('sin-servidor', 'Abriste la página como archivo: no hay servidor. Elige «Mi KoboldCpp» o ábrela con «npm run serve:web».');
      try {
        r = await fetch('/api/roleplay', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: AbortSignal.timeout(90000) });
      } catch (err) {
        throw err && (err.name === 'TimeoutError' || err.name === 'AbortError')
          ? fallo('lento', 'El servidor de la web ha tardado demasiado en responder.')
          : fallo('sin-servidor', 'No se ha podido hablar con el servidor de la web. Revisa tu conexión a internet.');
      }
    }
    const j = await r.json().catch(() => ({}));
    if (r.status === 429) throw fallo('limite', 'El servidor pide un respiro: has llegado al límite de mensajes por hora. Espera un poco o usa «Mi KoboldCpp».');
    if (!r.ok) {
      const msg = j && (typeof j.error === 'string' ? j.error : j.error && j.error.message);
      throw fallo('api', msg || `KoboldCpp ha respondido con un error (HTTP ${r.status}).`);
    }
    const txt = j && j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content;
    const limpio = String(txt || '').replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
    if (!limpio) throw fallo('vacia', 'El modelo ha devuelto una respuesta vacía. Vuelve a intentarlo.');
    return limpio;
  }

  window.KoboldWeb = { normalizar, cargar, guardar, bloqueadoPorHttps, estadoServidor, probarMio, chat, esLoopback };
})();
