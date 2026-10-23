# Música de Las ciudades del Umbral

Tres pistas propias en MP3 (estéreo, 44,1 kHz, 96 kb/s, unos 40 segundos en bucle):

| Uso | Archivo | Identificador en `src/js/audio.js` |
|---|---|---|
| Inicio y menú | `menu-theme.mp3` | `wiki` |
| Aurelia (mapa e historia) | `aurelia-theme.mp3` | `aurelia` |
| Nácar (mapa e historia) | `nacar-theme.mp3` | `nacar` |

`src/js/audio.js` las reproduce con `loop` nativo, respeta el volumen general y el de música, y corta la anterior al cambiar de ciudad. Si un archivo falta o el navegador no puede reproducirlo, suena la música generada con Web Audio como respaldo. El tema `final` usa siempre esa música generada.

En escritorio se cargan desde `../assets/music/` (junto a `src/`). `scripts/build-mobile.js` las copia a `www/assets/music/` para Android y `package.json` las incluye en el instalador.

Para cambiar una pista, sustituye el MP3 manteniendo el nombre.
