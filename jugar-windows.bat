@echo off
REM Ejecuta el juego desde el codigo fuente en Windows (doble clic).
REM Requiere Node.js 20 o superior: https://nodejs.org
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo No se encuentra Node.js. Instalalo desde https://nodejs.org y vuelve a abrir este archivo.
  start https://nodejs.org
  pause
  exit /b 1
)
if not exist node_modules (
  echo Instalando dependencias por primera vez, puede tardar unos minutos...
  call npm install
)
call npm start
