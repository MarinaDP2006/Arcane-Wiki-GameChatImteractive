// Prepara la carpeta «www» para la app de Android (Capacitor) a partir de «src».
// Uso: npm run android:web  (lo llama también npm run android:sync)
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const src = path.join(root, 'src');
const www = path.join(root, 'www');

fs.rmSync(www, { recursive: true, force: true });
fs.cpSync(src, www, { recursive: true });

// Capacitor mete su puente de JavaScript en la página; la política de seguridad
// del escritorio es más estricta, así que en Android se le deja pasar.
const index = path.join(www, 'index.html');
const html = fs.readFileSync(index, 'utf8').replace("script-src 'self'", "script-src 'self' 'unsafe-inline'");
fs.writeFileSync(index, html);

// Modelos 3D incluidos (src/models/**/*.glb): el móvil no puede listar carpetas, así que se
// escribe la lista en models/index.json («vi», «animaciones/andar»…).
const models = path.join(www, 'models');
const list = [];
const walk = (dir, pre) => {
  if (!fs.existsSync(dir)) return;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) walk(path.join(dir, e.name), `${pre}${e.name}/`);
    else if (/\.glb$/i.test(e.name)) list.push(`${pre}${e.name.replace(/\.glb$/i, '').toLowerCase()}`);
  }
};
walk(models, '');
fs.mkdirSync(models, { recursive: true });
fs.writeFileSync(path.join(models, 'index.json'), JSON.stringify(list));

console.log(`www listo para Android (${list.length} modelos 3D)`);
