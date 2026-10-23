# Música de Rifts & Gears

## Estado actual

Rutas objetivo de la integración. Hay que comprobar el código y los paquetes para confirmar que el reproductor realmente las carga:

| Uso | Ruta esperada |
|---|---|
| Menú / inicio | `assets/music/menu-theme.mp3` |
| Zaun | `assets/music/zaun-theme.mp3` |
| Piltover | `assets/music/piltover-theme.mp3` |

Los tres MP3 convertidos existen fuera del repositorio, pero todavía no están versionados aquí. No se puede afirmar que el audio renderizado esté integrado ni que el bucle o el empaquetado hayan pasado pruebas. Mantener la música procedural como fallback hasta añadir los binarios y probar la reproducción real.

La música procedural de respaldo está en `src/js/audio.js`. Sus identificadores son:

| Uso | Identificador en el código |
|---|---|
| Menú principal / wiki | `wiki` |
| Piltover | `piltover` |
| Zaun | `zaun` |

Puedes localizar las llamadas a `Audio2.playMusic(...)` en el código para ver cuándo cambia cada tema. Esta carpeta documenta futuras pistas renderizadas; su presencia no significa que ya haya archivos de audio integrados.

## Pasos de integración y verificación

1. Añadir menu-theme.mp3, zaun-theme.mp3 y piltover-theme.mp3 como binarios reales y verificar los derechos de distribución.
2. Mapear menú a menu-theme.mp3, Zaun a zaun-theme.mp3 y Piltover a piltover-theme.mp3, conservando IDs internos si otras partes dependen de ellos.
3. Mantener volumen global/musical, silencio y cambio rápido de zona; detener la pista anterior para que no se superpongan.
4. Usar loop nativo y probar que no haya un hueco audible. Gestionar errores de carga o reproducción con fallback procedural.
5. Verificar que Electron incluye assets/music, que el build web copia esa carpeta y que el script Android la coloca en los assets servidos por Capacitor.
6. Ejecutar npm run check, npm run web y npm run android:sync; probar manualmente Electron, navegador y dispositivo Android: inicio, cambio de ciudad, volumen, mute, pausa y retorno.
7. Confirmar los MP3 en GitHub y compilar una distribución antes de cerrar la tarea.

## Derechos y estado

No usar melodías, stems ni grabaciones oficiales de *Arcane*. La música generada por un servicio externo solo está lista para integrarse cuando existe un archivo final, se ha revisado la licencia aplicable y se ha probado en el juego. La documentación no habilita por sí misma Suno ni otro servicio musical.
