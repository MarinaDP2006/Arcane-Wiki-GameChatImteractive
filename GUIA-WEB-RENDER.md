# Web oficial en Render

La web pública es una **Static Site** independiente del ejecutable del juego.

1. En Render, selecciona **New > Blueprint** y conecta este repositorio.
2. Render detectará `render.yaml`, ejecutará `node scripts/build-web.js` y publicará `web-dist`.
3. Comprueba la URL asignada por Render. GitHub se mantiene como repositorio y fuente de las descargas, no como hosting web.
4. Cuando el PR esté fusionado, usa la rama `main` para el despliegue definitivo.

## Capturas históricas de todas las versiones

Sube tus imágenes reales a **`/capturasjuego/`** en la raíz del repositorio, siguiendo [su guía](capturasjuego/README.md). Se copiarán automáticamente a Render y aparecerán en la galería. No se inventarán capturas de versiones antiguas.

## Capturas oficiales

Añade archivos reales en `web/capturas/` con estos nombres y extensiones `.webp`, `.png`, `.jpg` o `.jpeg`:

- `inicio`: menú inicial
- `creacion`: editor del personaje
- `comunicador`: solo interfaz, sin mensajes ni conversaciones
- `mapa`: vista general
- `codice`: interfaz del códice sin revelaciones argumentales

El generador solo publica las capturas existentes y no inventa imágenes. Antes de subir una captura del comunicador, oculta nombres privados, mensajes y cualquier spoiler. Para comprobar localmente: `node scripts/build-web.js`.

**Alcance:** la eliminación de referencias a IA se aplica a la web promocional, no al código del videojuego.
