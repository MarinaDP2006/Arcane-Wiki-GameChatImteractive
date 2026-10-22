# Copia el arte organizado al directorio del juego en Windows.
# Ejecutar desde la raiz del repositorio con PowerShell:
# powershell -ExecutionPolicy Bypass -File .\copiar-arte-windows.ps1
$ErrorActionPreference = 'Stop'
$origen = Join-Path $PSScriptRoot 'arcaneData\arte'
$destino = 'C:\Users\Nina\Documents\LOL-Game_Arcane\arcaneData\arte'
if (-not (Test-Path $origen)) { throw "No se encuentra el arte: $origen. Actualiza el repositorio con git pull." }
New-Item -ItemType Directory -Force -Path $destino | Out-Null
Copy-Item -Path (Join-Path $origen '*') -Destination $destino -Recurse -Force
Write-Host "Arte copiado a: $destino" -ForegroundColor Green
Write-Host 'No se han eliminado los archivos existentes del destino.'
