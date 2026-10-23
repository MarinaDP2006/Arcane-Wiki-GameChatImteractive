# Las ciudades del Umbral · Rifts & Gears

Aventura narrativa original de fantasía industrial. Aurelia vive en las alturas, entre observatorios y ascensores de latón. Nácar respira bajo la roca, entre canales de vapor y talleres. Las dos dependen de la **Resonancia**, una energía que nace de la vibración de la piedra, y de un pacto antiguo que nadie ha leído entero.

Creas a tu personaje y escribes lo que dice o hace. No hay botones de respuesta: los personajes te contestan, te preguntan y recuerdan lo que hiciste, dentro de las reglas del mundo.

> **Rama `main` = mundo nuevo.** Todo lo de este universo original vive aquí. El fangame de Arcane está en su propia rama, `claude/project-thread-9huivc-arcane`, con su web y su README.

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

## IA de rol: LM Studio local o servidor remoto

La demo y el juego llaman a `/api/roleplay`; la clave del proveedor se queda en el servidor, nunca en el navegador. Si la IA no responde, la demo mantiene un narrador local básico.

### Modelo pequeño para LM Studio

Recomendado para empezar: **Qwen3 0.6B GGUF, cuantización Q4_K_M** (aprox. 0,4–0,5 GB de archivo). Es compacto y multilingüe, pero sus respuestas de rol serán más simples que las de un modelo grande. En LM Studio, busca `Qwen3-0.6B-GGUF`, descarga `Q4_K_M`, cárgalo y activa **Developer → Start server**.

Para ejecutar el juego y la web demo en el mismo ordenador, configura las variables de entorno antes de arrancar el servidor:

```env
AI_PROVIDER=lm-studio
AI_BASE_URL=http://127.0.0.1:1234/v1
AI_MODEL=<nombre-exacto-del-modelo-que-muestra-LM-Studio>
AI_API_KEY=
```

El nombre de modelo debe coincidir con el identificador que exponga tu versión de LM Studio. Comprueba el servidor con `http://127.0.0.1:1234/v1/models`. No pongas la dirección local `127.0.0.1` en Render: allí apuntaría al servidor de Render, no a tu PC.

### Demo pública alojada

Para que la demo pública use un modelo local, el equipo que ejecuta LM Studio debe exponer una API accesible desde el servidor web mediante una conexión privada o túnel seguro con autenticación. No expongas LM Studio directamente a Internet sin protección. Alternativamente, usa un proveedor de IA alojado.

Variables (ver `.env.example`); configúralas en el entorno local o como secretos del alojamiento, nunca en el repositorio:

- `AI_BASE_URL`: base compatible con OpenAI, incluyendo `/v1`. Si se omite, se usa Ollama Cloud.
- `AI_MODEL`: identificador exacto del modelo.
- `AI_API_KEY`: clave para un proveedor remoto; puede quedar vacía para LM Studio local sin autenticación.
- `OLLAMA_API_KEY` y `OLLAMA_MODEL`: compatibilidad con la configuración previa.
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
