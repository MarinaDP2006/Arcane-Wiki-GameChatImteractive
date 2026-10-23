# Música de Rifts & Gears

## Estado actual

El reproductor comprueba primero si están presentes estos archivos:

| Uso | Ruta esperada |
|---|---|
| Menú / inicio | `assets/music/menu-theme.mp3` |
| Zaun | `assets/music/zaun-theme.mp3` |
| Piltover | `assets/music/piltover-theme.mp3` |

Los archivos MP3 finales aún deben copiarse a esta carpeta; mientras falte alguno, el juego conserva el sintetizador procedural como respaldo. No declarar la sustitución terminada hasta que los binarios estén versionados y probados en cada plataforma.

La música procedural de respaldo está en `src/js/audio.js`. Sus identificadores son:

| Uso | Identificador en el código |
|---|---|
| Menú principal / wiki | `wiki` |
| Piltover | `piltover` |
| Zaun | `zaun` |

Puedes localizar las llamadas a `Audio2.playMusic(...)` en el código para ver cuándo cambia cada tema. Esta carpeta documenta futuras pistas renderizadas; su presencia no significa que ya haya archivos de audio integrados.

## Añadir pistas renderizadas en el futuro

1. Crear o encargar composiciones originales y conservar los datos de autoría y licencia.
2. Exportar a OGG/Opus con un punto de bucle limpio.
3. Colocar aquí únicamente los archivos finales que vaya a utilizar el reproductor.
4. Actualizar las rutas en el código y comprobar que el proceso de empaquetado de escritorio, web y Android los incluye.
5. Probar inicio y parada, volumen, silencio, cambio de zona, bucles y consumo de memoria en las plataformas compatibles.

## Derechos y estado

No usar melodías, stems ni grabaciones oficiales de *Arcane*. La música generada por un servicio externo solo está lista para integrarse cuando existe un archivo final, se ha revisado la licencia aplicable y se ha probado en el juego. La documentación no habilita por sí misma Suno ni otro servicio musical.
