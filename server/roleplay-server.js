// Servidor del roleplay libre (rama de Arcane). Hace de puente entre el juego y Ollama Cloud
// para que nadie tenga que instalar Ollama ni descargar modelos: la clave OLLAMA_API_KEY vive
// solo aquí, nunca en el navegador ni en el repositorio.
//
// El juego le habla en formato OpenAI (POST /api/roleplay con { model, messages, ... }) y este
// servidor lo traduce a la API nativa de Ollama (https://ollama.com/api/chat).
//
// Sin dependencias: basta con Node 18 o superior.
//   OLLAMA_API_KEY=... node server/roleplay-server.js
// Variables opcionales:
//   PORT             puerto (Render lo pone solo)
//   ROLEPLAY_MODEL   modelo por defecto (gemma4:31b)
//   ROLEPLAY_MODELS  modelos permitidos, separados por comas
//   ROLEPLAY_RPM     peticiones por minuto y por IP (20)
//   ALLOWED_ORIGINS  orígenes web permitidos, separados por comas (vacío = cualquiera)
//   STATIC_DIR       carpeta de la web que se sirve en el mismo origen (web-dist)
//
// Si existe web-dist/ (npm run web), también sirve la página, así la demo llama a
// /api/roleplay en su mismo origen.
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.PORT) || 8787;
const KEY = process.env.OLLAMA_API_KEY || '';
const UPSTREAM = (process.env.OLLAMA_HOST || 'https://ollama.com').replace(/\/+$/, '');
const DEFAULT_MODEL = process.env.ROLEPLAY_MODEL || process.env.OLLAMA_MODEL || 'gemma4:31b';
const MODELS = new Set((process.env.ROLEPLAY_MODELS || `${DEFAULT_MODEL},mistral-large-3:675b,gpt-oss:120b`).split(',').map((m) => m.trim()).filter(Boolean));
const RPM = Number(process.env.ROLEPLAY_RPM) || 20;
const ORIGINS = (process.env.ALLOWED_ORIGINS || '').split(',').map((o) => o.trim()).filter(Boolean);
// Alternativa a Ollama Cloud: cualquier API compatible con OpenAI (LM Studio en el mismo equipo,
// por ejemplo AI_BASE_URL=http://127.0.0.1:1234/v1). Si no se define, se usa Ollama Cloud.
const AI_BASE_URL = String(process.env.AI_BASE_URL || '').replace(/\/+$/, '');
const AI_KEY = process.env.AI_API_KEY || '';
const AI_MODEL = process.env.AI_MODEL || '';
const isLocal = (u) => { try { return ['localhost', '127.0.0.1', '::1'].includes(new URL(u).hostname); } catch { return false; } };
const READY = AI_BASE_URL ? Boolean(AI_KEY || isLocal(AI_BASE_URL)) : Boolean(KEY);

const STATIC = path.resolve(process.env.STATIC_DIR || path.join(__dirname, '..', 'web-dist'));
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif', '.ico': 'image/x-icon', '.woff2': 'font/woff2',
  '.woff': 'font/woff', '.ttf': 'font/ttf', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.glb': 'model/gltf-binary', '.txt': 'text/plain; charset=utf-8',
};

// Archivos de la web, sin salir nunca de STATIC.
function serveStatic(req, res, pathname) {
  let rel;
  try { rel = decodeURIComponent(pathname); } catch { return false; }
  let file = path.resolve(STATIC, `.${rel}`);
  if (file !== STATIC && !file.startsWith(STATIC + path.sep)) return false;
  try {
    if (fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    const st = fs.statSync(file);
    res.writeHead(200, {
      'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream',
      'Content-Length': st.size,
      'Cache-Control': /\.html$/.test(file) ? 'no-cache' : 'public, max-age=3600',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'X-Frame-Options': 'DENY',
    });
    if (req.method === 'HEAD') res.end();
    else fs.createReadStream(file).pipe(res);
    return true;
  } catch {
    return false;
  }
}

// Límites para que una sola partida no se coma los créditos de la cuenta.
const MAX_BODY = 96 * 1024;
const MAX_MESSAGES = 60;
const MAX_TOKENS = 700;

// Ventana de un minuto por IP.
const hits = new Map();
function limited(ip) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < 60000);
  list.push(now);
  hits.set(ip, list);
  return list.length > RPM;
}
setInterval(() => {
  const now = Date.now();
  for (const [ip, list] of hits) if (!list.some((t) => now - t < 60000)) hits.delete(ip);
}, 60000).unref();

// La app de escritorio llega sin Origin, Android como capacitor://localhost o https://localhost.
function corsOrigin(origin) {
  if (!origin || !ORIGINS.length) return '*';
  return ORIGINS.includes(origin) || /^(capacitor|https?):\/\/localhost(:\d+)?$/.test(origin) ? origin : '';
}

function send(res, status, data, origin) {
  const allow = corsOrigin(origin);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    ...(allow ? { 'Access-Control-Allow-Origin': allow, Vary: 'Origin' } : {}),
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(JSON.stringify(data));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (c) => {
      size += c.length;
      if (size > MAX_BODY) { reject(Object.assign(new Error('Petición demasiado grande'), { status: 413 })); req.destroy(); return; }
      chunks.push(c);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

// Solo pasan mensajes de texto con roles válidos.
function cleanMessages(list) {
  if (!Array.isArray(list)) return null;
  const out = list.slice(-MAX_MESSAGES)
    .filter((m) => m && ['system', 'user', 'assistant'].includes(m.role) && typeof m.content === 'string')
    .map((m) => ({ role: m.role, content: m.content.slice(0, 24000) }));
  return out.length ? out : null;
}

async function roleplay(body) {
  const messages = cleanMessages(body.messages);
  if (!messages) throw Object.assign(new Error('Faltan los mensajes'), { status: 400 });
  const model = MODELS.has(body.model) ? body.model : DEFAULT_MODEL;
  const num = (v, min, max, d) => (Number.isFinite(Number(v)) ? Math.max(min, Math.min(max, Number(v))) : d);
  const payload = {
    model,
    messages,
    stream: false,
    options: {
      temperature: num(body.temperature, 0, 1.5, 0.85),
      top_p: 0.92,
      repeat_penalty: 1.1,
      num_predict: num(body.max_tokens, 16, MAX_TOKENS, 400),
      ...(Array.isArray(body.stop) ? { stop: body.stop.filter((s) => typeof s === 'string').slice(0, 4) } : {}),
    },
  };
  if (AI_BASE_URL) return openaiCompatible(payload);
  if (/gpt-oss/.test(model)) payload.think = 'low';
  const r = await fetch(`${UPSTREAM}/api/chat`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(85000),
  });
  const text = await r.text();
  let data = {};
  try { data = JSON.parse(text); } catch { data = { error: text.slice(0, 200) }; }
  if (!r.ok || data.error) {
    const status = r.status === 401 || r.status === 403 ? 502 : r.status === 429 ? 429 : 502;
    const msg = r.status === 429 ? 'El servidor de IA está saturado o se han gastado los créditos del mes. Prueba en un rato.'
      : r.status === 401 || r.status === 403 ? 'La clave de Ollama del servidor no es válida.'
        : `Ollama Cloud: ${typeof data.error === 'string' ? data.error : `HTTP ${r.status}`}`;
    throw Object.assign(new Error(msg), { status });
  }
  const content = String(data.message?.content || '').replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
  return {
    model,
    choices: [{ index: 0, message: { role: 'assistant', content }, finish_reason: data.done_reason || 'stop' }],
    usage: { prompt_tokens: data.prompt_eval_count || 0, completion_tokens: data.eval_count || 0 },
  };
}

async function openaiCompatible({ messages, options }) {
  const model = AI_MODEL || DEFAULT_MODEL;
  const r = await fetch(`${AI_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(AI_KEY ? { Authorization: `Bearer ${AI_KEY}` } : {}) },
    body: JSON.stringify({ model, messages, stream: false, temperature: options.temperature, top_p: options.top_p,
      max_tokens: options.num_predict, ...(options.stop ? { stop: options.stop } : {}) }),
    signal: AbortSignal.timeout(85000),
  });
  const data = await r.json().catch(() => ({}));
  const content = String(data?.choices?.[0]?.message?.content || '').replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
  if (!r.ok || !content) {
    throw Object.assign(new Error(r.status === 429 ? 'El servidor de IA está saturado. Prueba en un rato.'
      : 'El proveedor de IA no ha respondido. Revisa AI_BASE_URL, AI_MODEL y la clave.'), { status: r.status === 429 ? 429 : 502 });
  }
  return { model, choices: [{ index: 0, message: { role: 'assistant', content }, finish_reason: 'stop' }], usage: data.usage || {} };
}

const server = http.createServer(async (req, res) => {
  const origin = req.headers.origin;
  const url = new URL(req.url, 'http://x');
  if (req.method === 'OPTIONS') return send(res, 204, {}, origin);
  if (req.method === 'GET' && url.pathname === '/api/health') {
    return send(res, 200, { ok: true, service: 'rifts-arcane-roleplay', model: DEFAULT_MODEL, ready: READY }, origin);
  }
  if ((req.method === 'GET' || req.method === 'HEAD') && !url.pathname.startsWith('/api/')) {
    if (serveStatic(req, res, url.pathname)) return;
    if (url.pathname === '/') return send(res, 200, { ok: true, service: 'rifts-arcane-roleplay', ready: READY }, origin);
    return send(res, 404, { error: 'No encontrado' }, origin);
  }
  if (url.pathname !== '/api/roleplay' && url.pathname !== '/api/roleplay/v1/chat/completions') return send(res, 404, { error: 'No encontrado' }, origin);
  if (req.method !== 'POST') return send(res, 405, { error: 'Usa POST' }, origin);
  if (ORIGINS.length && origin && !corsOrigin(origin)) return send(res, 403, { error: 'Origen no permitido' }, origin);
  if (!READY) return send(res, 503, { error: { message: AI_BASE_URL ? 'Falta AI_API_KEY para el proveedor remoto.' : 'El servidor no tiene configurada OLLAMA_API_KEY.' } }, origin);
  const ip = String(req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();
  if (limited(ip)) return send(res, 429, { error: { message: 'Vas muy rápido: espera unos segundos antes de volver a escribir.' } }, origin);
  try {
    const body = JSON.parse(await readBody(req) || '{}');
    send(res, 200, await roleplay(body), origin);
  } catch (err) {
    const status = err.status || (err.name === 'TimeoutError' ? 504 : err instanceof SyntaxError ? 400 : 500);
    const message = err.name === 'TimeoutError' ? 'La IA ha tardado demasiado en responder.' : err.message;
    if (status >= 500) console.error('[roleplay]', message);
    send(res, status, { error: { message } }, origin);
  }
});

if (require.main === module) {
  server.listen(PORT, () => console.log(`Roleplay de Arcane escuchando en :${PORT} (${AI_BASE_URL ? `API compatible ${AI_BASE_URL}, modelo ${AI_MODEL || DEFAULT_MODEL}` : `modelo ${DEFAULT_MODEL}`}${READY ? '' : ', SIN CLAVE'})`));
}

module.exports = { server, roleplay, cleanMessages };
