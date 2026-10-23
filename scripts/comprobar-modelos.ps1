# Inspecciona los ZIP 3D del usuario sin extraer ni modificar los modelos.
# Uso: powershell -ExecutionPolicy Bypass -File scripts/comprobar-modelos.ps1
param(
  [string]$Carpeta = "$env:APPDATA\Rifts & Gears - Las ciudades del Umbral\arte\modelos"
)

Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

# Resume modelos, texturas y animaciones internas de un ZIP sin descomprimirlo.
function Revisar-ModeloZip {
  param([string]$Ruta)
  try {
    $zip = [System.IO.Compression.ZipFile]::OpenRead($Ruta)
    try {
      $archivos = @($zip.Entries | Where-Object { $_.Name -ne '' })
      $modelos = @($archivos | Where-Object { $_.Name -match '\.(fbx|glb|obj)$' })
      # Un ZIP dentro del ZIP (por ejemplo source/nyra-quell.zip con un .obj) también lo abre el juego.
      $internos = @($archivos | Where-Object { $_.Name -match '\.zip$' })
      $blend = @($archivos | Where-Object { $_.Name -match '\.blend$' })
      $texturas = @($archivos | Where-Object { $_.Name -match '\.(png|jpe?g|webp|bmp|tga)$' })
      $estado = if ($modelos.Count -eq 0 -and $internos.Count -gt 0) { 'ZIP INTERNO' } elseif ($modelos.Count -eq 0 -and $blend.Count -gt 0) { 'SOLO BLENDER' } elseif ($modelos.Count -eq 0) { 'FALTA MODELO' } elseif ($texturas.Count -eq 0 -and @($modelos | Where-Object { $_.Name -match '\.fbx$' }).Count -gt 0) { 'REVISAR TEXTURAS' } else { 'OK' }
      Write-Host "$($estado): $([IO.Path]::GetFileName($Ruta)) | modelos: $($modelos.Count) | texturas: $($texturas.Count)"
      foreach ($modelo in $modelos) { Write-Host "  Modelo: $($modelo.FullName)" }
      if ($estado -eq 'ZIP INTERNO') { Write-Host '  El juego abrirá el ZIP interno y buscará allí el .glb, .fbx u .obj.' }
      if ($estado -eq 'SOLO BLENDER') { Write-Host '  Un .blend no se puede leer: ábrelo en Blender y usa Archivo > Exportar > glTF 2.0 (.glb).' }
      if ($estado -eq 'REVISAR TEXTURAS') { Write-Host '  El FBX puede verse sin colores si las texturas son externas.' }
    } finally { $zip.Dispose() }
  } catch {
    Write-Warning "No se puede leer el ZIP $Ruta : $($_.Exception.Message)"
  }
}

if (-not (Test-Path -LiteralPath $Carpeta)) {
  Write-Warning "No existe la carpeta: $Carpeta"
  Write-Host 'Abre el juego y pulsa Ajustes > Arte personal > modelos para crearla.'
  exit 1
}

$zips = @(Get-ChildItem -LiteralPath $Carpeta -Filter '*.zip' -File)
if ($zips.Count -eq 0) { Write-Host "No hay ZIP en: $Carpeta"; exit 0 }
Write-Host "Revisando $($zips.Count) ZIP en $Carpeta"
foreach ($zip in $zips) { Revisar-ModeloZip -Ruta $zip.FullName }
