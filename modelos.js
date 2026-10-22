// Preparación de los modelos 3D personales (proceso principal de Electron).
//
// Los ZIP de personajes pueden pesar cientos de megas, traer texturas de 4096 px, otro ZIP
// dentro o un .obj en lugar de un .fbx. Abrirlos enteros en cada partida dejaba la ventana
// esperando y la gráfica sin memoria. Aquí se preparan una sola vez:
//  1. Se leen sin descomprimirlos en disco (también los ZIP que hay dentro de otro ZIP).
//  2. Se elige el modelo (.glb, después .fbx y después .obj).
//  3. Las texturas se reducen (color a 2048 px, el resto a 1024 px) y se guardan en la caché
//     persistente arte/modelos/_cache de la carpeta de datos del juego.
// Los archivos originales nunca se modifican: la caché se puede borrar y se regenera sola.
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const crypto = require('crypto');

// Cambiar este número obliga a volver a preparar todos los modelos (si cambia el formato).
const CACHE_VERSION = 1;
const MODEL_RE = /\.(glb|fbx|obj)$/i;
const TEX_RE = /\.(png|jpe?g|webp|bmp|tga)$/i;
// Texturas de color (las que dan el aspecto del personaje): se guardan con más resolución.
const COLOR_RE = /(base_?col|basecolor|_colou?r|diffuse|albedo|_d$|_col$|^(body|costume|hair|eyes?|skin|face|head)\b)/i;
const MAX_COLOR = 2048;
const MAX_OTHER = 1024;

/** Lee las entradas de un ZIP en memoria (método guardado o deflate) y devuelve {nombre: Buffer}. */
function readZip(buf) {
  const out = {};
  // Busca el final del directorio central desde el final del archivo.
  let eocd = -1;
  for (let i = buf.length - 22; i >= Math.max(0, buf.length - 65557); i--) {
    if (buf.readUInt32LE(i) === 0x06054b50) { eocd = i; break; }
  }
  if (eocd < 0) throw new Error('No es un ZIP válido');
  const count = buf.readUInt16LE(eocd + 10);
  let p = buf.readUInt32LE(eocd + 16);
  for (let n = 0; n < count; n++) {
    if (buf.readUInt32LE(p) !== 0x02014b50) break;
    const method = buf.readUInt16LE(p + 10);
    const csize = buf.readUInt32LE(p + 20);
    const nameLen = buf.readUInt16LE(p + 28);
    const extraLen = buf.readUInt16LE(p + 30);
    const commentLen = buf.readUInt16LE(p + 32);
    const local = buf.readUInt32LE(p + 42);
    const name = buf.toString('utf8', p + 46, p + 46 + nameLen).replace(/\\/g, '/');
    p += 46 + nameLen + extraLen + commentLen;
    if (name.endsWith('/') || /(^|\/)(__MACOSX|\.)/.test(name)) continue;
    const start = local + 30 + buf.readUInt16LE(local + 26) + buf.readUInt16LE(local + 28);
    const raw = buf.subarray(start, start + csize);
    try {
      if (method === 0) out[name] = raw;
      else if (method === 8) out[name] = zlib.inflateRawSync(raw);
    } catch { /* entrada dañada: se ignora */ }
  }
  return out;
}

/** Abre un ZIP y, recursivamente, los ZIP que contiene (hasta tres niveles). */
function zipEntries(buf, depth = 0, prefix = '') {
  const files = {};
  for (const [name, data] of Object.entries(readZip(buf))) {
    if (/\.zip$/i.test(name) && depth < 3) {
      try { Object.assign(files, zipEntries(data, depth + 1, `${prefix}${name}/`)); } catch { /* ZIP interno dañado */ }
    } else files[prefix + name] = data;
  }
  return files;
}

/** Reúne los archivos de una carpeta descomprimida (modelo suelto con sus texturas). */
function folderEntries(dir) {
  const files = {};
  const walk = (d, rel, depth) => {
    let list;
    try { list = fs.readdirSync(d, { withFileTypes: true }); } catch { return; }
    for (const e of list) {
      const full = path.join(d, e.name);
      if (e.isDirectory() && depth < 3 && e.name !== '_cache') walk(full, `${rel}${e.name}/`, depth + 1);
      else if (e.isFile() && (MODEL_RE.test(e.name) || TEX_RE.test(e.name) || /\.mtl$/i.test(e.name))) files[rel + e.name] = fs.readFileSync(full);
    }
  };
  walk(dir, '', 0);
  return files;
}

/** Elige el archivo de modelo: primero .glb, luego .fbx y por último .obj (el más grande). */
function pickModel(files) {
  const names = Object.keys(files);
  for (const re of [/\.glb$/i, /\.fbx$/i, /\.obj$/i]) {
    const found = names.filter((n) => re.test(n)).sort((a, b) => files[b].length - files[a].length)[0];
    if (found) return found;
  }
  return null;
}

/** Reduce una textura con las herramientas de imagen de Electron; si no puede, la deja igual. */
function shrinkTexture(nativeImage, name, data) {
  if (!/\.(png|jpe?g)$/i.test(name)) return { name, data };
  try {
    const img = nativeImage.createFromBuffer(data);
    const { width, height } = img.getSize();
    if (!width) return { name, data };
    const max = COLOR_RE.test(name.replace(/\.[^.]+$/, '')) ? MAX_COLOR : MAX_OTHER;
    if (width <= max && height <= max) return { name, data };
    const k = max / Math.max(width, height);
    const small = img.resize({ width: Math.round(width * k), height: Math.round(height * k), quality: 'good' });
    return { name: name.replace(/\.[^.]+$/, '.png'), data: small.toPNG() };
  } catch {
    return { name, data };
  }
}

/**
 * Convierte un .obj (texto) en piezas binarias listas para la gráfica: una por objeto y
 * material, con posiciones, coordenadas de textura y normales en Float32. Así el juego no
 * tiene que volver a leer cientos de miles de líneas de texto en cada partida.
 */
function objToMesh(buf) {
  const text = buf.toString('utf8');
  const v = [];
  const vt = [];
  const vn = [];
  const parts = new Map();
  let obj = '';
  let mtl = '';
  let cur = null;
  let start = 0;
  // Índice de un vértice OBJ (empieza en 1; los negativos cuentan desde el final).
  const fix = (n, len) => { const i = parseInt(n, 10); return Number.isNaN(i) ? -1 : i < 0 ? len + i : i - 1; };
  while (start < text.length) {
    let end = text.indexOf('\n', start);
    if (end < 0) end = text.length;
    const line = text.slice(start, end).trim();
    start = end + 1;
    if (!line || line[0] === '#') continue;
    const sp = line.indexOf(' ');
    const tag = sp < 0 ? line : line.slice(0, sp);
    const rest = sp < 0 ? '' : line.slice(sp + 1).trim();
    if (tag === 'v') { const a = rest.split(/\s+/); v.push(+a[0], +a[1], +a[2]); }
    else if (tag === 'vt') { const a = rest.split(/\s+/); vt.push(+a[0], +(a[1] || 0)); }
    else if (tag === 'vn') { const a = rest.split(/\s+/); vn.push(+a[0], +a[1], +a[2]); }
    else if (tag === 'o' || tag === 'g') { obj = rest; cur = null; }
    else if (tag === 'usemtl') { mtl = rest; cur = null; }
    else if (tag === 'f') {
      if (!cur) {
        const k = `${obj}|${mtl}`;
        if (!parts.has(k)) parts.set(k, { obj, mtl, pos: [], uv: [], nor: [] });
        cur = parts.get(k);
      }
      const idx = rest.split(/\s+/).map((p) => {
        const [a, b, c] = p.split('/');
        return [fix(a, v.length / 3), b ? fix(b, vt.length / 2) : -1, c ? fix(c, vn.length / 3) : -1];
      });
      // Polígonos de más de tres lados: se dividen en abanico.
      for (let i = 1; i + 1 < idx.length; i++) {
        for (const [pi, ti, ni] of [idx[0], idx[i], idx[i + 1]]) {
          cur.pos.push(v[pi * 3], v[pi * 3 + 1], v[pi * 3 + 2]);
          if (ti >= 0) cur.uv.push(vt[ti * 2], vt[ti * 2 + 1]); else cur.uv.push(0, 0);
          if (ni >= 0) cur.nor.push(vn[ni * 3], vn[ni * 3 + 1], vn[ni * 3 + 2]);
        }
      }
    }
  }
  const list = [];
  const chunks = [];
  let offset = 0;
  for (const p of parts.values()) {
    if (!p.pos.length) continue;
    const normals = p.nor.length === p.pos.length;
    const arrays = [p.pos, p.uv, ...(normals ? [p.nor] : [])].map((a) => Buffer.from(new Float32Array(a).buffer));
    list.push({ obj: p.obj, mtl: p.mtl, offset, vertices: p.pos.length / 3, normals });
    for (const a of arrays) { chunks.push(a); offset += a.length; }
  }
  return { parts: list, bin: Buffer.concat(chunks) };
}

/** Huella del archivo original: si cambia (otro ZIP con el mismo nombre), se vuelve a preparar. */
function fingerprint(file) {
  const st = fs.statSync(file);
  return crypto.createHash('sha1').update(`${CACHE_VERSION}|${path.resolve(file)}|${st.size}|${st.mtimeMs}`).digest('hex').slice(0, 12);
}

const pending = new Map();
// Cede el turno al resto del proceso entre textura y textura para no congelar la ventana.
const breathe = () => new Promise((ok) => setImmediate(ok));

/**
 * Prepara un modelo (ZIP, carpeta o archivo suelto) y devuelve la carpeta de caché con
 * «modelo.json»: { model, kind, textures: [...], source } o { error } si no hay nada usable.
 */
function prepare(id, file, root, cacheRoot, nativeImage) {
  const key = `${id}-${fingerprint(file)}`;
  const dir = path.join(cacheRoot, key);
  const info = path.join(dir, 'modelo.json');
  if (fs.existsSync(info)) {
    try { return Promise.resolve({ dir, ...JSON.parse(fs.readFileSync(info, 'utf8')) }); } catch { /* caché dañada: se rehace */ }
  }
  if (pending.has(key)) return pending.get(key);
  const job = (async () => {
    let files;
    if (/\.zip$/i.test(file)) files = zipEntries(fs.readFileSync(file));
    else if (root && root !== path.dirname(file)) files = folderEntries(root);
    else files = { [path.basename(file)]: fs.readFileSync(file), ...folderEntries(path.dirname(file)) };
    const modelName = pickModel(files);
    const tmp = `${dir}.${process.pid}.tmp`;
    fs.rmSync(tmp, { recursive: true, force: true });
    fs.mkdirSync(path.join(tmp, 'texturas'), { recursive: true });
    let meta;
    if (!modelName) {
      const blend = Object.keys(files).some((n) => /\.blend$/i.test(n));
      meta = { error: blend ? 'blend' : 'sin-modelo', source: path.basename(file) };
    } else {
      let ext = modelName.split('.').pop().toLowerCase();
      let parts;
      if (ext === 'obj') {
        // Los .obj se guardan ya convertidos a binario («malla»).
        const mesh = objToMesh(files[modelName]);
        parts = mesh.parts;
        ext = 'malla';
        fs.writeFileSync(path.join(tmp, 'modelo.malla'), mesh.bin);
      } else fs.writeFileSync(path.join(tmp, `modelo.${ext}`), files[modelName]);
      const textures = [];
      const seen = new Set();
      for (const [n, data] of Object.entries(files)) {
        if (!TEX_RE.test(n)) continue;
        const base = path.basename(n).toLowerCase();
        if (seen.has(base)) continue; // algunos ZIP repiten la misma textura
        seen.add(base);
        const t = shrinkTexture(nativeImage, base, data);
        fs.writeFileSync(path.join(tmp, 'texturas', t.name), t.data);
        textures.push(t.name);
        await breathe();
      }
      meta = { model: `modelo.${ext}`, kind: ext, textures, source: path.basename(file), inner: modelName, ...(parts ? { parts } : {}) };
    }
    fs.writeFileSync(path.join(tmp, 'modelo.json'), JSON.stringify(meta, null, 2), 'utf8');
    // Las versiones anteriores de este modelo se apartan de la caché (son copias regenerables).
    for (const old of fs.readdirSync(cacheRoot)) {
      if (old.startsWith(`${id}-`) && old !== key && !old.endsWith('.tmp')) fs.rmSync(path.join(cacheRoot, old), { recursive: true, force: true });
    }
    fs.rmSync(dir, { recursive: true, force: true });
    fs.renameSync(tmp, dir);
    return { dir, ...meta };
  })().finally(() => pending.delete(key));
  pending.set(key, job);
  return job;
}

/** Lee un modelo ya preparado para enviarlo a la ventana del juego. */
function readPrepared(prep) {
  const data = fs.readFileSync(path.join(prep.dir, prep.model));
  if (prep.kind === 'glb') return { kind: 'glb', name: prep.source, data };
  const textures = {};
  for (const t of prep.textures) {
    try { textures[t] = fs.readFileSync(path.join(prep.dir, 'texturas', t)); } catch { /* falta */ }
  }
  return { kind: prep.kind, name: prep.source, data, textures, ...(prep.parts ? { parts: prep.parts } : {}) };
}

module.exports = { prepare, readPrepared, readZip, zipEntries, pickModel, objToMesh };
