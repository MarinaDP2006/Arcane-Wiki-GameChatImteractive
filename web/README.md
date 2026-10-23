# Web de Las ciudades del Umbral

- `index.html`: portada (crónica, ciudades, Resonancia, campaña, reparto, cómo se juega, demo).
- `demo.html` + `demo-juego.js`: demo de rol libre sin opciones fijas. Usa `/api/roleplay` del servidor y, si no responde, un narrador local.
- `demo-base.json`: textos de la demo. El reparto y las ciudades salen de `src/data/original-world.js` al generar.
- `estilos.css`, `menu.js`, `privacidad.html`, `arte-propio/*.svg`.

`npm run web` crea `web-dist/` con los marcadores `{{...}}` rellenos y `demo-datos.js`. La web no muestra descargas.
