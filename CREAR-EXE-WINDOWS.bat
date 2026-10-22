@echo off
REM Compila instalador y portable de Windows sin modificar datos guardados en AppData.
setlocal
cd /d "%~dp0"
title Grietas ^& Gears - Crear ejecutables
where node >nul 2>&1
if errorlevel 1 (
  echo ERROR: Instala Node.js 22 antes de compilar.
  pause
  exit /b 1
)
echo Instalando dependencias...
call npm ci
if errorlevel 1 goto :error
echo Validando el contenido del juego...
call npm run check
if errorlevel 1 goto :error
echo Construyendo EXE para Windows...
set CSC_IDENTITY_AUTO_DISCOVERY=false
call npm run dist:win -- --publish never
if errorlevel 1 goto :error
echo.
echo Archivos disponibles en la carpeta dist:
dir /b dist\*.exe
if errorlevel 1 goto :error
echo.
echo Recuerda probar instalador y portable antes de distribuirlos.
pause
exit /b 0
:error
echo.
echo ERROR: Fallo la compilacion. Revisa el mensaje anterior y los logs.
pause
exit /b 1
