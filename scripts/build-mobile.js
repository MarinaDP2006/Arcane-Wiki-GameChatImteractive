// Prepara la versión Android/tablet: copia src/ a www/, que es lo que Capacitor mete en el APK.
// Uso: npm run android:sync (después, en android/: gradlew assembleDebug).
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const src = path.join(root, 'src');
const www = path.join(root, 'www');
fs.rmSync(www, { recursive: true, force: true });
fs.cpSync(src, www, { recursive: true });
// La consola web de Capacitor sirve el juego desde https://localhost: la CSP de index.html ya
// lo permite con 'self'. Solo se marca la página para que el juego sepa que está en Android.
const html = path.join(www, 'index.html');
fs.writeFileSync(html, fs.readFileSync(html, 'utf8').replace('<html lang="es">', '<html lang="es" data-platform="android">'));
let files = 0, bytes = 0;
(function walk(d) { for (const f of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, f.name); if (f.isDirectory()) walk(p); else { files++; bytes += fs.statSync(p).size; } } })(www);
console.log(`www/ listo: ${files} archivos, ${(bytes / 1048576).toFixed(1)} MB`);
