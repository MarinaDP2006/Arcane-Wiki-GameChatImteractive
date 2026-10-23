'use strict';
// Servidor web + API privada para Ollama Cloud. No guarda ni registra el contenido de los chats.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { URL } = require('node:url');

const ROOT = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT, 'web-dist');
const PORT = Number(process.env.PORT || 10000);
// Compatible con LM Studio (local) y proveedores OpenAI-compatible. Por defecto conserva Ollama Cloud.
const AI_BASE_URL = String(process.env.AI_BASE_URL || 'https://ollama.com/v1').replace(/\\/+$/, '');
const MODEL = process.env.AI_MODEL || process.env.OLLAMA_MODEL || 'gemma4:31b';
const AI_API_KEY = process.env.AI_API_KEY || process.env.OLLAMA_API_KEY || '';
const AI_PROVIDER = process.env.AI_PROVIDER || (AI_BASE_URL.includes('ollama.com') ? 'ollama-cloud' : 'openai-compatible');
function requiresApiKey() {
  try { const u = new URL(AI_BASE_URL); return !['localhost', '127.0.0.1', '::1'].includes(u.hostname) && !AI_API_KEY; }
  catch { return true; }
}
const MAX_BODY = 24 * 1024;
const MAX_MESSAGES = 24;
const MAX_MESSAGE_CHARS = 6000;
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = Number(process.env.ROLEPLAY_MAX_PER_HOUR || 24);
const buckets = new Map();

const MIME = {
  '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8',
  '.js':'text/javascript; charset=utf-8', '.json':'application/json; charset=utf-8',
  '.svg':'image/svg+xml', '.png':'image/png', '.jpg':'image/jpeg',
  '.jpeg':'image/jpeg', '.webp':'image/webp', '.ico':'image/x-icon',
  '.woff2':'font/woff2', '.txt':'text/plain; charset=utf-8'
};

function send(res, status, data, extra = {}) {
  res.writeHead(status, {
    'Content-Type':'application/json; charset=utf-8',
    'Cache-Control':'no-store',
    'X-Content-Type-Options':'nosniff',
    'X-Frame-Options':'DENY',
    'Referrer-Policy':'strict-origin-when-cross-origin',
    ...extra
  });
  res.end(JSON.stringify(data));
}

function clientKey(req) {
  // Render añade X-Forwarded-For; usarlo solo como identificador de limitación, nunca para permisos.
  const forwarded = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  return forwarded || req.socket.remoteAddress || 'unknown';
}

function rateLimited(key) {
  const now = Date.now();
  let b = buckets.get(key);
  if (!b || now - b.start >= WINDOW_MS) b = { start: now, count: 0 };
  b.count++;
  buckets.set(key, b);
  if (buckets.size > 3000) for (const [k, v] of buckets) if (now - v.start >= WINDOW_MS) buckets.delete(k);
  return b.count > MAX_PER_WINDOW;
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let total = 0;
    const parts = [];
    req.on('data', part => {
      total += part.length;
      if (total > MAX_BODY) {
        reject(Object.assign(new Error('La petición supera el límite de tamaño.'), { statusCode: 413 }));
        req.destroy();
        return;
      }
      parts.push(part);
    });
    req.on('end', () => {
      try { resolve(JSON.parse(Buffer.concat(parts).toString('utf8') || '{}')); }
      catch { reject(Object.assign(new Error('JSON no válido.'), { statusCode: 400 })); }
    });
    req.on('error', reject);
  });
}

async function roleplay(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error:'Método no permitido.' }, { Allow:'POST' });
  if (rateLimited(clientKey(req))) return send(res, 429, { error:'Límite temporal alcanzado. Espera un poco e inténtalo de nuevo.' }, { 'Retry-After':'60' });
  if (requiresApiKey()) {
    return send(res, 503, { error:'Falta AI_API_KEY (o OLLAMA_API_KEY) para el proveedor de IA remoto.' });
  }
  const origin = req.headers.origin;
  if (origin && origin !== 'null') {
    try {
      const incoming = new URL(origin);
      const host = String(req.headers.host || '');
      const configured = String(process.env.ROLEPLAY_ALLOWED_ORIGINS || '').split(',').map(x => x.trim()).filter(Boolean);
      if (incoming.host !== host && !configured.includes(incoming.origin)) {
        return send(res, 403, { error:'Origen no permitido.' });
      }
    } catch { return send(res, 403, { error:'Origen no válido.' }); }
  }
  let data;
  try { data = await readJson(req); }
  catch (err) { if (!res.headersSent && !res.destroyed) send(res, err.statusCode || 400, { error:err.message || 'No se pudo leer la petición.' }); return; }

  if (!Array.isArray(data.messages) || data.messages.length < 1 || data.messages.length > MAX_MESSAGES) {
    return send(res, 400, { error:'El historial debe contener entre 1 y 24 mensajes.' });
  }
  const messages = [];
  let chars = 0;
  for (const m of data.messages) {
    if (!m || !['system','user','assistant'].includes(m.role) || typeof m.content !== 'string') {
      return send(res, 400, { error:'Mensaje con formato no válido.' });
    }
    const content = m.content.trim();
    if (!content || content.length > MAX_MESSAGE_CHARS) return send(res, 400, { error:'Cada mensaje debe tener entre 1 y 6000 caracteres.' });
    chars += content.length;
    if (chars > 20000) return send(res, 413, { error:'El contexto supera el tamaño permitido.' });
    messages.push({ role:m.role, content });
  }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 75000);
    let upstream;
    try {
      const headers = { 'Content-Type':'application/json' };
      if (AI_API_KEY) headers.Authorization = `Bearer ${AI_API_KEY}`;
      upstream = await fetch(`${AI_BASE_URL}/chat/completions`, {
        method:'POST',
        headers,
        body:JSON.stringify({
          model:MODEL,
          messages,
          stream:false,
          temperature:typeof data.temperature === 'number' ? Math.max(0.4, Math.min(1.0, data.temperature)) : 0.82,
          max_tokens:Math.max(100, Math.min(700, Number(data.max_tokens) || 450))
        }),
        signal:controller.signal
      });
    } finally { clearTimeout(timer); }
    const payload = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      // No exponer respuesta completa del proveedor: podría contener datos operativos.
      return send(res, upstream.status >= 500 ? 502 : upstream.status, { error:'El servicio de IA no ha podido responder. Revisa el modelo y el saldo/uso de la cuenta Ollama Cloud.' });
    }
    const answer = payload?.choices?.[0]?.message?.content;
    if (typeof answer !== 'string' || !answer.trim()) return send(res, 502, { error:'El modelo devolvió una respuesta vacía.' });
    return send(res, 200, { choices:[{ message:{ role:'assistant', content:answer }, finish_reason:payload.choices[0].finish_reason || 'stop' }] });
  } catch (err) {
    return send(res, 502, { error:err.name === 'AbortError' ? 'La respuesta tardó demasiado. Prueba con un mensaje más corto.' : 'No se pudo conectar al servicio de IA. Inténtalo de nuevo más tarde.' });
  }
}

function staticFile(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, { error:'Método no permitido.' }, { Allow:'GET, HEAD' });
  if (!fs.existsSync(PUBLIC_DIR)) return send(res, 503, { error:'La web todavía no se ha construido. Ejecuta npm run web.' });
  const url = new URL(req.url, 'http://localhost');
  let requested;
  try { requested = decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname); }
  catch { return send(res, 400, { error:'Ruta no válida.' }); }
  const full = path.resolve(PUBLIC_DIR, '.' + requested);
  if (!full.startsWith(PUBLIC_DIR + path.sep) && full !== path.join(PUBLIC_DIR,'index.html')) {
    return send(res, 403, { error:'Ruta no permitida.' });
  }
  fs.stat(full, (err, stat) => {
    if (err || !stat.isFile()) return send(res, 404, { error:'No encontrado.' });
    const headers = {
      'Content-Type':MIME[path.extname(full).toLowerCase()] || 'application/octet-stream',
      'Content-Length':stat.size,
      'Cache-Control':/\.(html|js|css|json)$/i.test(full) ? 'no-cache' : 'public, max-age=86400',
      'X-Content-Type-Options':'nosniff',
      'X-Frame-Options':'DENY',
      'Referrer-Policy':'strict-origin-when-cross-origin'
    };
    res.writeHead(200, headers);
    if (req.method === 'HEAD') return res.end();
    fs.createReadStream(full).pipe(res);
  });
}

const server = http.createServer((req, res) => {
  if (req.url.split('?')[0] === '/api/health') {
    if (req.method !== 'GET') return send(res, 405, { error:'Método no permitido.' }, { Allow:'GET' });
    return send(res, 200, { ok:true, provider:AI_PROVIDER, model:MODEL, configured:Boolean(process.env.OLLAMA_API_KEY) });
  }
  if (req.url.split('?')[0] === '/api/roleplay') return roleplay(req,res);
  return staticFile(req,res);
});
server.listen(PORT, '0.0.0.0', () => console.log(`Web + roleplay API listening on :${PORT}; model=${MODEL}; key-configured=${Boolean(process.env.OLLAMA_API_KEY)}`));
