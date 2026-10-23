# Música de Rifts & Gears

## Estado actual
La banda sonora principal está implementada en `src/js/audio.js` como síntesis procedural con Web Audio. No hay archivos MP3/OGG externos necesarios para reproducir los temas existentes.

- Menú principal / wiki: `Audio2.playMusic('wiki')`
- Piltover: `Audio2.playMusic('piltover')`
- Zaun: `Audio2.playMusic('zaun')`

También hay ambiente por ciudad y efectos de interfaz/pasos. La generación procedural reduce descargas y permite cambiar música sin cargar archivos de audio. Esta carpeta documenta el destino reservado para futuras mezclas renderizadas (OGG/Opus) si se decide exportarlas.

## Añadir pistas renderizadas más adelante
1. Usa composiciones originales y conserva licencia/autoría de cada recurso.
2. Exporta OGG/Opus a una tasa de bits adecuada y con loop points probados.
3. Añade los archivos a esta carpeta solo cuando el reproductor los use realmente.
4. Actualiza la ruta de recursos en el código, el empaquetado de Electron y el generador web/móvil.
5. Prueba volumen, silencio, cambio de ciudad, reanudación y consumo de memoria en todas las plataformas.

No se incluyen melodías, stems ni grabaciones oficiales de Arcane. La generación externa de una canción no se considera completada hasta disponer de un archivo final reproducible y con licencia verificada.
