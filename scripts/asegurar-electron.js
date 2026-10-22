// Comprueba que Electron tiene su programa descargado después de «npm ci» o «npm install».
// Las versiones nuevas de npm (11 o superior) pueden bloquear los scripts de instalación de
// las dependencias; entonces falta electron.exe y «npm start» falla con «Electron failed to
// install correctly». Este script lo descarga solo si falta. No toca partidas ni arte.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

/**
 * Descarga el binario de Electron si no está en node_modules.
 * @returns {void} termina el proceso con código 1 si la descarga falla
 */
function asegurarElectron() {
  let dir;
  try { dir = path.dirname(require.resolve('electron/package.json')); } catch { return; } // sin dependencias de desarrollo
  const pathFile = path.join(dir, 'path.txt');
  const binario = fs.existsSync(pathFile) ? path.join(dir, 'dist', fs.readFileSync(pathFile, 'utf8').trim()) : null;
  if (binario && fs.existsSync(binario)) return;
  console.log('Descargando Electron (npm bloqueó su script de instalación)...');
  try {
    execFileSync(process.execPath, [path.join(dir, 'install.js')], { stdio: 'inherit' });
  } catch (err) {
    console.error('No se pudo descargar Electron:', err.message);
    process.exit(1);
  }
}

asegurarElectron();
