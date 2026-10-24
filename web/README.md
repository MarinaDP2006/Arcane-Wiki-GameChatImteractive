# Web de Las ciudades del Umbral

- `index.html` + `portada.js`: portada con el menú principal del juego (grieta entre Aurelia y Nácar, `title-fx.js` del juego), crónica, ciudades, lugares, Resonancia, campaña, reparto, cómo se juega, KoboldCpp y demo.
- `demo.html` + `demo-juego.js`: demo de rol libre sin opciones fijas. El panel «Conexión con KoboldCpp» elige entre el KoboldCpp del servidor (`/api/roleplay`) o el tuyo (`192.168.1.139`, `localhost`…); si ninguno responde, narrador local.
- `koboldcpp.js`: cliente de KoboldCpp de la web (normaliza la dirección como el juego, comprueba la conexión y explica los errores).
- `demo-base.json`: textos de la demo. El reparto y las ciudades salen de `src/data/original-world.js` al generar.
- `estilos.css`, `menu.js`, `privacidad.html`, `arte-propio/*.svg`.

`npm run web` crea `web-dist/` con los marcadores `{{...}}` rellenos y `demo-datos.js`, y copia sin cambios de `src/` las fuentes, `img/umbral/lugares`, `img/umbral/simbolos` y `js/title-fx.js`. La web no muestra descargas.
