# Rifts & Gears · Fangame de Arcane

Fangame gratuito y no oficial de rol libre ambientado en **Arcane** (temporadas 1 y 2). Creas tu personaje en Piltover o en Zaun y entras en la historia. No hay respuestas prefabricadas: escribes lo que tu personaje dice o hace, y los personajes de la serie te contestan, te preguntan y reaccionan como lo harían ellos, sin salirse del lore.

> **Esta rama (`arcane/fangame-actualizado`) es la única rama de Arcane.** Todo lo del fangame vive aquí. La rama `main` es el mundo nuevo y original, *Las ciudades del Umbral*.

## Cómo funciona

1. **¿Conoces Arcane?** Antes de crear el personaje el juego lo pregunta. Si dices que no, te da una introducción breve. Si dices que sí, pasas directo a la creación.
2. **Creación de personaje:** nombre, pronombres, ciudad, oficio y lo que quieras contar de ti con tus palabras.
3. **Rol libre:** escribes y te contestan. Los personajes solo saben lo que han vivido hasta tu momento de la historia y respetan el canon de las temporadas 1 y 2.
4. **IA en el servidor:** el diálogo lo lleva Gemma 4 31B alojado en Ollama Cloud. No tienes que instalar nada.

## Web y demo

La carpeta `web/` tiene la web pública del fangame, **sin sección de descargas**:

- `index.html`: portada, introducción para quien no conoce Arcane, ciudades, personajes, cómo se juega y demo.
- `demo.html` + `demo-juego.js`: demo de rol libre. Escena en La Última Gota (Zaun) o en el taller de hextec de la Academia (Piltover), en la temporada 1, acto 2.
- `demo-base.json`: introducción, bloqueo de canon y escenas. Los personajes y las ciudades salen de `src/data` al generar.
- `estilos.css`, `menu.js` y `privacidad.html`.

`npm run web` genera `web-dist/`. La web no publica arte oficial de la serie.

La demo llama a `/api/roleplay` en el mismo servidor. Si la IA no está disponible, entra un narrador local sencillo para que la escena no se quede muda.

## Desarrollo

```bash
npm ci
npm run check      # comprobaciones de datos y scripts
npm start          # versión de escritorio (Electron)
npm run web        # genera la web en web-dist/
```

`render.yaml` despliega la web y la API de rol juntas en un servicio Node. La clave `OLLAMA_API_KEY` se configura como secreto en el alojamiento, nunca en el repositorio.

## Estado

- **Hecho:** historia, personajes de Piltover, Zaun y Noxus, rol libre con bloqueo de canon, web y demo nuevas.
- **Prototipo:** modelos 3D de fan-art en `src/models/` (sin rig ni animaciones finales).
- **Pendiente de configurar:** el servidor publicado con la clave de Ollama Cloud.
- **Sin descargas públicas** por ahora.

## Guías

- [Guía completa del código](GUIA.md) y [guía de juego](GUIAJUEGO.md)
- [IA y campaña](GUIA-IA-Y-CAMPANA.md)
- [Prompts 3D de fan-art](docs/PROMPTS-3D-ARCANE-FAN-GAME.md)
- [Partidas guardadas](partidas-guardadas-guia.md)

## Aviso legal

Proyecto de fans gratuito, sin ánimo de lucro y no respaldado por Riot Games. Arcane, League of Legends, Piltover, Zaun y sus personajes pertenecen a Riot Games. El código está bajo licencia MIT, que no da derechos sobre esas marcas ni personajes. Consulta las [condiciones legales de Riot Games](https://www.riotgames.com/es/legal).
