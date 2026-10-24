# Web oficial en Render

La web pública es un **Web Service** de Node (`render.yaml`): sirve `web-dist/` y la API de rol que reenvía a KoboldCpp.

1. En Render, selecciona **New > Blueprint** y conecta este repositorio.
2. Render detectará `render.yaml`, ejecutará `npm ci && npm run web` y arrancará `node server/index.js`.
3. Para que la demo responda con IA sin instalar nada, pon en **Environment** `KOBOLDCPP_URL` con una dirección de KoboldCpp que el servidor pueda alcanzar desde internet (por ejemplo la `https://…` de su Remote Tunnel). Render no puede llegar a `192.168.x.x` de tu casa. `https://tu-web/api/health` dice `"koboldcpp":"conectado"` cuando funciona. Sin eso, los visitantes pueden usar su propio KoboldCpp desde el panel de la demo o el narrador local.
4. Comprueba la URL asignada por Render. GitHub se mantiene como repositorio y fuente de las descargas, no como hosting web.
5. Cuando el PR esté fusionado, usa la rama `main` para el despliegue definitivo.

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

