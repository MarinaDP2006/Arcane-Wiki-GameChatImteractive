# Web del fangame de Arcane

- `index.html`: portada (intro para quien no conoce Arcane, ciudades, personajes, cómo se juega, demo). Sin sección de descargas.
- `demo.html` + `demo-juego.js`: demo de rol libre sin opciones fijas. Pregunta si conoces Arcane, crea el personaje y abre una escena en Zaun o Piltover. Usa `/api/roleplay` del servidor y, si no responde, un narrador local.
- `demo-base.json`: introducción, bloqueo de canon (temporadas 1 y 2) y escenas. Los personajes y las ciudades salen de `src/data` al generar.
- `estilos.css`, `menu.js`, `privacidad.html`.

`npm run web` crea `web-dist/`. La web no usa arte oficial de la serie.
