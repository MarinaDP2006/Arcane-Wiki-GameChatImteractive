#!/bin/bash
# Ejecuta el juego desde el código fuente en macOS (doble clic).
# Requiere Node.js 20 o superior: https://nodejs.org
cd "$(dirname "$0")"
if ! command -v node >/dev/null 2>&1; then
  echo "No se encuentra Node.js. Instálalo desde https://nodejs.org y vuelve a abrir este archivo."
  open https://nodejs.org
  read -n 1 -s -r -p "Pulsa una tecla para cerrar"
  exit 1
fi
if [ ! -d node_modules ]; then
  echo "Instalando dependencias por primera vez, puede tardar unos minutos..."
  npm install
fi
npm start
