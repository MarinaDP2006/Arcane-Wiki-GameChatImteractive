# Música de Rifts & Gears

## Qué existe ahora

La música actual se genera en tiempo real mediante Web Audio en `src/js/audio.js`. No necesita archivos MP3/OGG externos para reproducir estos temas:

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
