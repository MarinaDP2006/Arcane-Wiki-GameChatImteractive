# Zaun explorable: seis escenarios 3D

Primera versión funcional de escenarios geométricos originales inspirados en las seis imágenes entregadas por la autora. Los recursos originales del juego no se borran y **Piltover no se modifica**.

| Imagen | Espacio | Lugar de entrada |
|---|---|---|
| 1 | Ciudad vertical, balcones y pasarelas, neón verde | Los Callejones |
| 2 | Árbol de las Luciérnagas, casas y plataformas sobre ramas | El Árbol de las Luciérnagas |
| 3 | Torre industrial central, anillos, brazos, neones violetas | La Fábrica |
| 4 | Fachada y local de La Última Gota | La Última Gota |
| 5 | Laboratorio de Singed, mesas, tubos y reactivos | Laboratorio del Sumidero |
| 6 | Jardín botánico, cúpula, plantas y quimtec | Invernadero oculto de Zaun (nuevo punto del mapa) |

Otras entradas de Zaun pueden reutilizar alguno de los escenarios con nombre propio: taller de Benzo, mercado, tejados, foso y escondite de Jinx.

## Cómo funcionan

1. Acércate a una de las entradas del mapa abierto y pulsa E.
2. Se abre el escenario tridimensional propio del lugar.
3. Explóralo con WASD o las flechas (Mayús para correr).
4. Busca una **pista azul**, acércate y pulsa E para inspeccionarla.
5. Dirígete a la **luz del objetivo** y vuelve a pulsar E.
6. Solo entonces se habilitan allí los diálogos, actividades y objetivos narrativos existentes. Pulsa Esc o «Salir al mapa» para abandonar el interior sin completar el objetivo.

Esto evita completar una misión de los lugares implementados pulsando «Continuar historia» desde el exterior. Sigue existiendo el comunicador global para conversaciones ya desbloqueadas y la historia de otras ubicaciones; es una primera fase de integración, no una reestructuración completa de todas las interacciones del RPG.

## Limitaciones conocidas y mejoras posteriores

- Los seis espacios son **geometría procedimental de Three.js**, no modelos 3D exactos de los fotogramas. Reproducen elementos arquitectónicos y paletas cromáticas, pero el acabado no es todavía una copia del 100 % ni tiene texturas artesanales o interiores de varias plantas realmente conectadas.
- Desde v1.22.0 tu protagonista se ve en tercera persona (muñeco con tu aspecto y ropa deducida del retrato, o `modelos/jugador.glb`), choca con la arquitectura y puede moverse con clic/toque. Los edificios tienen texturas de pincel, ventanas encendidas, chimeneas con humo, faroles, tendederos, botelleros y tanques de cultivo (ver `src/js/interior-kit.js`).
- Los edificios exteriores siguen usando mayoritariamente el generador urbano existente, con nuevos arcos de entrada de colores. Queda trabajo para recrear cada fachada con nivel de detalle equivalente al de las referencias.
- Las pistas son objetos interactivos físicos y diferentes en su descripción, pero requieren más animaciones y lógica de misiones para convertirse en rompecabezas complejos.
- Probar en Windows que la entrada no queda bloqueada por geometría, que los seis espacios funcionan y que los capítulos avanzan al salir.
- Se ha cambiado únicamente Zaun. Las imágenes de Piltover se recibirán aparte.

## Archivos

- `src/js/zaun-interiors.js`: escenas 3D, entrada y salida, cámara, movimiento y pistas.
- `src/js/game.js`: puerta obligatoria de exploración antes de mostrar acciones para los lugares de Zaun.
- `src/js/world3d.js`: entradas volumétricas de seis lugares en el mundo abierto.
- `src/data/world.js`: nueva ubicación del invernadero.
- `src/css/styles.css`: interfaz a pantalla completa para la exploración.
- `src/index.html`: carga del módulo de exploración.

No se han ejecutado ni certificado pruebas de rendimiento o jugabilidad completas en Windows. Se deben realizar antes de afirmar que está terminado.
