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

console.log('www listo para Android');
