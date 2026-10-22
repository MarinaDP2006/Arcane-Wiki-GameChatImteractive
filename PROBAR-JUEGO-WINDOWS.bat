@echo off
REM Ejecuta Grietas & Gears desde el codigo sin borrar partidas ni modelos personales.
setlocal
cd /d "%~dp0"
title Grietas ^& Gears - Prueba en Windows
where node >nul 2>&1
if errorlevel 1 (
  echo ERROR: Node.js no esta instalado. Instala Node.js 22 y reinicia esta ventana.
  pause
  exit /b 1
)
where npm >nul 2>&1
if errorlevel 1 (
  echo ERROR: No se encuentra npm. Instala Node.js 22.
  pause
  exit /b 1
)
echo Instalando dependencias verificadas del proyecto...
call npm ci
if errorlevel 1 goto :error
echo Comprobando los datos del juego...
call npm run check
if errorlevel 1 goto :error
echo Arrancando el juego...
call npm start
if errorlevel 1 goto :error
exit /b 0
:error
echo.
echo ERROR: No se pudo preparar o arrancar el juego. Copia el mensaje anterior para revisarlo.
pause
exit /b 1
