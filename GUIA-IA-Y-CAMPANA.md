# IA de rol y campaña · Las ciudades del Umbral

Esta guía describe la IA y la campaña del universo original de **Rifts & Gears**. El fangame de Arcane vive en el repositorio independiente `MarinaDP2006/Arcane-fangame`.

## Cómo se construye la respuesta de la IA

El prompt se prepara en `src/js/ai.js`, dentro de `systemPrompt(G, id)`. La información narrativa y las voces de los diez protagonistas se definen en `src/data/original-world.js`.

La IA recibe la ficha del jugador, la ciudad de origen, el oficio, sus relaciones, el capítulo actual, los personajes conocidos, las decisiones registradas y los últimos intercambios relevantes. Debe respetar la continuidad de la partida, no conocer escenas que no ha presenciado y tratar la Resonancia como una tecnología con reglas propias, no como magia ilimitada.

Para ajustar el mundo y los personajes:

- `src/data/original-world.js`: Aurelia, Nácar, los diez protagonistas, sus motivaciones, voces, relaciones, escenas y mapas.
- `src/js/ai.js`: plantilla de instrucciones, proveedores compatibles, límites y tratamiento de respuestas.
- `server/index.js`: API web que conecta la demo con un proveedor compatible con OpenAI.
- `web/demo-base.json`: introducción, reglas, escenas y textos iniciales de la demo.
- `web/demo-juego.js`: creación del personaje y conversación libre en el navegador.

No pongas claves de API en los archivos del cliente. Configura `AI_BASE_URL`, `AI_MODEL` y `AI_API_KEY` en el entorno del servidor; `.env.example` contiene una plantilla sin secretos.

## Campaña original

La historia comienza con un ascensor detenido entre Aurelia y Nácar y un registro de Resonancia que coincide con un accidente ocultado décadas atrás. La campaña avanza por tres partes:

1. **La ciudad bajo la piedra:** investigar los registros, conocer a las comunidades y decidir qué pruebas proteger o publicar.
2. **El precio de la Resonancia:** descubrir cómo se reparte el coste de la extracción y negociar una respuesta a los riesgos de infraestructura.
3. **Un pacto que no se hereda:** acordar quién controla la red y qué mecanismos públicos impedirán que vuelva a ocultarse información.

Las decisiones pueden cambiar afinidades, alianzas, información disponible y el desenlace. Los personajes no deben volverse aliados automáticamente ni olvidar daños anteriores solo porque el jugador lo solicite.

## Conectar LM Studio

1. Descarga un modelo GGUF pequeño, por ejemplo **Qwen3 0.6B Q4_K_M** (archivo de unos 0,4–0,5 GB).
2. En LM Studio, carga el modelo y activa **Developer → Start server**.
3. En el servidor Node que ejecuta el juego/demo, configura `AI_BASE_URL=http://127.0.0.1:1234/v1` y `AI_MODEL` con el identificador exacto que muestra LM Studio.
4. Prueba `http://127.0.0.1:1234/v1/models` y después la demo.

`127.0.0.1` solo funciona si LM Studio y el servidor Node están en el mismo equipo. Una demo pública necesita un endpoint remoto o una conexión privada y autenticada al ordenador que ejecuta el modelo. No expongas el servidor local directamente a Internet.

## Límites y pruebas

Un modelo de menos de 1 GB es útil para validar la conexión y mantener conversaciones sencillas, pero su memoria y consistencia narrativa son limitadas. Para una campaña extensa, evalúa la calidad en escenas de prueba y mantén la narración local de respaldo.

Antes de publicar, ejecuta:

```bash
npm ci
npm run check
npm run web
npm start
```

Prueba ambas ciudades, creación de personaje, transiciones de capítulo, guardado/carga, diálogo libre, respuestas vacías o lentas y funcionamiento sin proveedor de IA.
