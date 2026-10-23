# Las ciudades del Umbral · Rifts & Gears

Aventura narrativa original de fantasía industrial. Aurelia vive en las alturas, entre observatorios y ascensores de latón. Nácar respira bajo la roca, entre canales de vapor y talleres. Las dos dependen de la **Resonancia**, una energía que nace de la vibración de la piedra, y de un pacto antiguo que nadie ha leído entero.

Creas a tu personaje y escribes lo que dice o hace. No hay botones de respuesta: los personajes te contestan, te preguntan y recuerdan lo que hiciste, dentro de las reglas del mundo.

> **Rama `main` = mundo nuevo.** Todo lo de este universo original vive aquí. El fangame de Arcane está en su propia rama, `arcane/fangame-actualizado`, con su web y su README.

## La historia en cinco fechas

| Año | Suceso |
|---|---|
| 0 | **El Hundimiento.** La meseta de Umbral se parte. Arriba nace Aurelia; abajo, Nácar. |
| 112 | **La piedra que canta.** Una minera de Nácar descubre los cristales de Resonancia. |
| 190 | **El Pacto de los Contrapesos.** Aurelia paga los ascensores públicos a cambio de extraer de los estratos profundos. Tres cláusulas nunca se publican. |
| 251 | **El Silencio de Cobre.** Un derrumbe en Nácar durante un pico de extracción. Los registros de esa noche desaparecen. |
| 298 | **Registro 00:03.** Un ascensor se detiene y un medidor marca el mismo patrón borrado. Aquí empiezas tú. |

La campaña tiene tres partes: *La ciudad bajo la piedra*, *El precio de la Resonancia* y *Un pacto que no se hereda*. Hay diez personajes principales, cinco de cada ciudad; sus fichas están en `src/data/original-world.js`.

## Web y demo

La carpeta `web/` contiene la web pública:

- `index.html`: portada con la crónica, las ciudades, la Resonancia, la campaña, el reparto y cómo se juega.
- `demo.html` + `demo-juego.js`: demo de rol libre. Pregunta si conoces el mundo (si no, da una introducción breve), te deja crear el personaje y abre la primera escena en Aurelia o en Nácar con conversación libre.
- `demo-base.json`: textos de la demo (introducción, reglas del mundo para la IA, escenas y giros).
- `estilos.css`, `menu.js`, `privacidad.html` y el arte propio en `arte-propio/`.

`npm run web` genera `web-dist/` rellenando la web con los datos reales del juego (reparto, ciudades, versión). La web no ofrece descargas.

## IA en el servidor, sin instalar nada

El diálogo libre usa un modelo de Ollama alojado en el servidor (`server/index.js`, endpoint `/api/roleplay`), así que nadie tiene que instalar Ollama en su equipo. Si el servidor no está disponible, la demo cambia a un narrador local sencillo para no quedarse muda.

Variables del servidor (ver `.env.example`); se configuran como secretos en el alojamiento, nunca en el repositorio:

- `OLLAMA_API_KEY`: clave de Ollama Cloud.
- `OLLAMA_MODEL`: modelo de chat (por defecto `gemma4:31b`).
- `ROLEPLAY_MAX_PER_HOUR`: límite de mensajes por hora y visitante.

`render.yaml` despliega la web y la API juntas: `npm ci && npm run web` y después `node server/index.js`.

## Desarrollo

```bash
npm ci
npm run check      # comprobaciones de datos y scripts
npm start          # versión de escritorio (Electron)
npm run web        # genera la web en web-dist/
npm run serve:web  # sirve web-dist/ y la API en http://localhost:10000
```

## Estado

- **Hecho:** universo, ciudades, Resonancia, tres partes y diez personajes. Web y demo nuevas.
- **Prototipo:** modelos 3D low-poly en `src/models/` (sin rig ni animaciones finales).
- **Pendiente de configurar:** la clave de Ollama Cloud en el servidor publicado.

## Guías

- [Plan del universo original](docs/PLAN-UNIVERSO-ORIGINAL.md)
- [Prompts de modelos 3D del universo original](docs/PROMPTS-MODELOS-3D-UNIVERSO-ORIGINAL.md)
- [Guía completa del código](GUIA.md) y [guía de juego](GUIAJUEGO.md)
- [Partidas guardadas](partidas-guardadas-guia.md)

## Licencia

Código bajo licencia MIT. El universo, sus nombres, su historia y su arte son originales de MarinaDP2006.
