# Piltover 3D: cinco referencias, cinco espacios explorables

Se han integrado cinco escenarios de Piltover inspirados en las imágenes de referencia enviadas por la autora. La arquitectura se genera en Three.js y **no son capturas estáticas pegadas en el fondo**. Las escenas son un primer prototipo de geometría original; aún no reproducen al 100 % la dirección artística y los detalles de los fotogramas.

| Imagen | Espacio jugable | Localización del mapa | Elementos arquitectónicos |
|---|---|---|---|
| 1 | Sala del Consejo | `consejo` | Mesa circular, asientos, piedra clara, ventanas monumentales geométricas, adornos de bronce |
| 2 | Laboratorio de Jayce y Viktor | `taller-jayce` | Estanterías, mesas técnicas, pizarra con esquemas, piezas hextec iluminadas |
| 3 | Torre y horizonte de las Hexpuertas | `hexpuertas` | Agujas, pasarelas, anillo luminoso, aeronaves suspendidas y torres art déco |
| 4 | Fortaleza de Stillwater | `muelle-stillwater` | Muros defensivos, almenas, torre de vigilancia, mar y luz crepuscular |
| 5 | Puente del Progreso | `puente` | Torres de piedra, cables tensores, arcos y agua inferior |

También se permite explorar espacios secundarios usando variantes arquitectónicas: Academia (`academia`), Ejecutores (`ejecutores`), Mansión Kiramman (`mansion-kiramman`), Plaza del Progreso (`plaza`) y Mercado de Artesanos (`artesanos`).

## Recorrido obligatorio en el juego

1. Acércate al lugar en el mapa abierto de Piltover y pulsa **E**.
2. Accede al escenario 3D; recorre el espacio usando **WASD o flechas**.
3. Encuentra la **pista hextec azul**, aproxímate y pulsa E para investigarla.
4. Busca el marcador luminoso del objetivo, y pulsa E otra vez.
5. Solo entonces se habilita la acción de la ubicación (empezar o continuar un capítulo, hablar o realizar una actividad).
6. Pulsa **Esc** o «Volver al mapa» para abandonar el espacio sin investigar.

El botón de Historia ya no inicia directamente capítulos de las ubicaciones explorables si no se ha completado el recorrido correspondiente. Se mantiene el progreso en el estado del juego como `G.acts["interior:" + chapterId]`.

## Implementación

- `src/js/piltover-interiors.js`: cinco composiciones 3D, reutilización de variantes, exploración y dos puntos interactivos.
- `src/js/game.js`: integración con actividades, personajes, objetivo narrativo y protección frente a saltarse la entrada.
- `src/js/world3d.js`: arcos/umbrales monumentales para identificar los accesos desde las calles de Piltover.
- `src/css/styles.css`: interfaz de exploración clara y dorada.
- `src/index.html`: carga del motor interior antes de `game.js`.

El módulo de Zaun sigue intacto. No se han eliminado imágenes, audio, capítulos, personajes ni guardados.

## Protagonista y edificios (v1.22.0)

- Tu protagonista camina por el escenario en tercera persona: es el muñeco 3D de `avatars3d.js` con tu piel, pelo, peinado, ojos y accesorios del creador, y la ropa se deduce del retrato (chaqueta de cuero con solapas, abrigo de Piltover con botonadura dorada, uniforme con hombreras, vestido con corsé, bata, peto de taller, ropa de la calle con bufanda, top con vendas). Si existe `modelos/jugador.glb`, se usa ese modelo.
- Movimiento con WASD/flechas o con clic/toque en el suelo; clic en la pista o el objetivo cuando estás cerca equivale a pulsar E.
- Los edificios chocan: no se atraviesan mesas, columnas ni muros; los peldaños bajos se suben solos (escalinata de Stillwater, plataformas).
- Texturas de pincel generadas (piedra, metal, madera), columnas, estandartes, ventanas con arco, cúpulas y agujas, farolas, dirigibles, núcleo hextec, sombras del sol y polvo dorado en el aire.
- Stillwater y el Puente se rehicieron para que la pista y el objetivo queden sobre la explanada o el tablero (antes quedaban dentro de la geometría).
- Código común en `src/js/interior-kit.js`.

## Límites y comprobaciones que faltan

- Los escenarios son **procedimentales**, sin modelos arquitectónicos artesanales, texturas pintadas específicas, o navegación vertical en varias plantas. No es posible certificar que sean una recreación idéntica a los fotogramas.
- Los objetivos son exploración y examen de pistas; todavía no hay puzles singulares con herramientas para cada lugar.
- Debe probarse en Windows que el acceso desde el mundo abierto no queda bloqueado, las pistas se pueden encontrar, el botón E cierra correctamente y la historia sigue con cada elección.
- Las actividades secundarias y el comunicador global siguen siendo accesibles fuera del sistema de interiores; el requisito de entrar se aplica a las acciones contextuales de las ubicaciones.
- No se ha generado ni validado una compilación nueva de Windows en esta tarea.

**Pruebas recomendadas en Windows:** `npm ci`, `npm run check`, `npm start`, después iniciar una partida de Piltover, visitar los cinco escenarios, salir con Esc y regresar, activar objetivo y comprobar su continuación.
