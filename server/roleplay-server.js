'use strict';

// Servidor web y proxy de diálogo de Rifts & Gears (Arcane).
// No expone la clave de Ollama al navegador. Requiere Node.js 20+.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { URL } = require('node:url');

const ROOT = path.resolve(__dirname, '..');
const WEB_ROOT = path.join(ROOT, 'web-dist');
const FALLBACK_ROOT = path.join(ROOT, 'web');
const HOST = process.env.HOST || '0.0.0.0';
const PORT = Number(process.env.PORT || 3000);
const AI_BASE_URL = String(process.env.AI_BASE_URL || 'https://ollama.com/v1').replace(/\/+$/, '');
const AI_MODEL = process.env.AI_MODEL || process.env.OLLAMA_MODEL || 'gemma4:31b';
const AI_API_KEY = process.env.AI_API_KEY || process.env.OLLAMA_API_KEY || '';
function requiresApiKey() {
  try { const u = new URL(AI_BASE_URL); return !['localhost', '127.0.0.1', '::1'].includes(u.hostname) && !AI_API_KEY; }
  catch { return true; }
}
const MAX_BODY = 64 * 1024;
const MAX_MESSAGES = 18;
const MAX_CONTENT = 6000;
const RPM = Math.max(1, Number(process.env.ROLEPLAY_RPM || 20));
const requests = new Map();
const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon',
  '.mp3': 'audio/mpeg', '.woff2': 'font/woff2'
};

function send(res, status, data, type = 'application/json; charset=utf-8') {
  res.writeHead(status, {
    'Content-Type': type,
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Cache-Control': status === 200 ? 'public, max-age=300' : 'no-store'
  });
  res.end(type.startsWith('application/json') ? JSON.stringify(data) : data);
}
function rateLimit(req) {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = (typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : req.socket.remoteAddress) || 'unknown';
  const now = Date.now();
  const recent = (requests.get(ip) || []).filter(t => now - t < 60000);
  if (recent.length >= RPM) { requests.set(ip, recent); return false; }
  recent.push(now); requests.set(ip, recent);
  if (requests.size > 2000) for (const [key, times] of requests) if (!times.some(t => now - t < 60000)) requests.delete(key);
  return true;
}
function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = ''; let size = 0;
    req.on('data', chunk => {
      size += chunk.length;
      if (size > MAX_BODY) { reject(Object.assign(new Error('Cuerpo demasiado grande'), { status: 413 })); req.destroy(); return; }
      body += chunk;
    });
    req.on('end', () => {
      try { resolve(JSON.parse(body || '{}')); }
      catch { reject(Object.assign(new Error('JSON no válido'), { status: 400 })); }
    });
    req.on('error', reject);
  });
}
async function roleplay(req, res) {
  if (!rateLimit(req)) return send(res, 429, { error: 'Demasiadas peticiones. Espera un minuto.' });
  if (requiresApiKey()) return send(res, 503, { error: 'Falta AI_API_KEY (o OLLAMA_API_KEY) para el proveedor remoto; la demo puede usar el narrador local.' });
  let body;
  try { body = await readBody(req); }
  catch (e) { return send(res, e.status || 400, { error: e.message || 'Petición no válida' }); }
  if (!Array.isArray(body.messages) || body.messages.length < 1 || body.messages.length > MAX_MESSAGES) {
    return send(res, 400, { error: 'Historial de mensajes no válido.' });
  }
  const messages = [];
  for (const m of body.messages) {
    if (!m || !['system', 'user', 'assistant'].includes(m.role) || typeof m.content !== 'string' || !m.content.trim() || m.content.length > MAX_CONTENT) {
      return send(res, 400, { error: 'Mensaje no válido.' });
    }
    messages.push({ role: m.role, content: m.content });
  }
  try {
    const headers = { 'Content-Type': 'application/json' };
    if (AI_API_KEY) headers.Authorization = 'Bearer ' + AI_API_KEY;
    const upstream = await fetch(AI_BASE_URL + '/chat/completions', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: AI_MODEL,
        messages,
        temperature: Math.min(1.2, Math.max(0, Number(body.temperature) || 0.85)),
        max_tokens: Math.min(500, Math.max(80, Number(body.max_tokens) || 380))
      }),
      signal: AbortSignal.timeout(45000)
    });
    const text = await upstream.text();
    let result;
    try { result = JSON.parse(text); } catch { result = null; }
    if (!upstream.ok) {
      const status = upstream.status === 429 ? 429 : 502;
      return send(res, status, { error: status === 429 ? 'Límite de IA alcanzado.' : 'El proveedor de IA no está disponible.' });
    }
    if (!result?.choices?.[0]?.message?.content) return send(res, 502, { error: 'Respuesta vacía del proveedor de IA.' });
    return send(res, 200, result);
  } catch {
    return send(res, 502, { error: 'No se pudo conectar con el proveedor de IA.' });
  }
}
function staticFile(req, res, pathname) {
  const base = fs.existsSync(WEB_ROOT) ? WEB_ROOT : FALLBACK_ROOT;
  let decoded;
  try { decoded = decodeURIComponent(pathname); } catch { return send(res, 400, { error: 'Ruta no válida.' }); }
  if (decoded.includes('\0') || decoded.includes('\\')) return send(res, 400, { error: 'Ruta no válida.' });
  const relative = decoded === '/' ? 'index.html' : decoded.replace(/^\/+/, '');
  const file = path.resolve(base, relative);
  if (file !== base && !file.startsWith(base + path.sep)) return send(res, 403, { error: 'Acceso denegado.' });
  fs.stat(file, (err, stat) => {
    if (err || !stat.isFile()) return send(res, 404, { error: 'No encontrado.' });
    res.writeHead(200, {
      'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Cache-Control': 'public, max-age=300'
    });
    if (req.method === 'HEAD') return res.end();
    fs.createReadStream(file).pipe(res);
  });
}
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://' + (req.headers.host || 'localhost'));
  if (url.pathname === '/healthz' && req.method === 'GET') return send(res, 200, { ok: true });
  if (url.pathname === '/api/roleplay') {
    if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return send(res, 405, { error: 'Método no permitido.' }); }
    if (!req.headers['content-type']?.includes('application/json')) return send(res, 415, { error: 'Se requiere application/json.' });
    return roleplay(req, res);
  }
  if (req.method !== 'GET' && req.method !== 'HEAD') { res.setHeader('Allow', 'GET, HEAD, POST'); return send(res, 405, { error: 'Método no permitido.' }); }
  return staticFile(req, res, url.pathname);
});
server.listen(PORT, HOST, () => console.log('Rifts & Gears web server listening on ' + HOST + ':' + PORT));
