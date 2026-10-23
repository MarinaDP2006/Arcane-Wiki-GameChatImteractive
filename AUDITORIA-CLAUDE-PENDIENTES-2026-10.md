# Continuación de los hilos de Claude · Auditoría del 23/10/2026

Esta hoja complementa `TAREAS-PENDIENTES.md`, que recoge etapas históricas. Se basa en los archivos reales de `main` y en los cambios de esta rama. **Una PR fusionada no demuestra que se haya validado toda la experiencia en los dispositivos.**

## Estado de los hilos solicitados

| PR | Tema | Integración | Comprobación pendiente |
| --- | --- | --- | --- |
| [#35](https://github.com/MarinaDP2006/grietas-and-gears/pull/35) | Partidas Windows/tablet y guía de recuperación | Fusionada. La exportación/importación se introdujo en #34. | Probar exportar una ranura en Windows, importarla en Android, cerrar/reabrir ambos juegos y comprobar capítulos, decisiones y afinidades. Probar también el camino inverso y una copia antigua. |
| [#40](https://github.com/MarinaDP2006/grietas-and-gears/pull/40) | Minijuegos con arte y profundidad | Fusionada; incluye `src/js/depth.js` y `src/js/minigames-extra.js`. | Probar los diez juegos en equipos modestos y tablet, victoria/derrota, reinicio y controles táctiles; medir FPS. Esta rama optimiza la gestión del lienzo y HUD de los minijuegos principales. |
| [#38](https://github.com/MarinaDP2006/grietas-and-gears/pull/38) | Ramas Windows/Android/Mac, compilación y web | Fusionada. | Validar los workflows reales de Windows/Android/Mac, instalaciones, firmas, enlaces de descarga y sincronización de ramas después de cada cambio. |
| [#43](https://github.com/MarinaDP2006/grietas-and-gears/pull/43) | Integración mapa interactivo | Fusionada (la implementación original también aparece en #39). | Comprobar tacto, zoom, rutas, menú por lugar y transición a exploración, chats y minijuegos. Esta rama corrige trabajo por fotograma de las escenas 2D. |
| [#41](https://github.com/MarinaDP2006/grietas-and-gears/pull/41) | Chats ramificados sin fin | Fusionada; datos en `src/data/chat-deep.js`. | Probar conversaciones con los 16 personajes, idiomas, personajes fallecidos/salvados, opciones repetidas y persistencia. |

## Pantalla inicial y tipografía

**No marcar como terminado sin comprobar el diseño real.** Revisar la portada del juego en `src/js/app.js`, estilos en `src/css/styles.css`, el escalado móvil y fuentes disponibles. Verificar licencias y alternativas legibles de tipografía; no incorporar archivos de fuente sin permiso de redistribución.

## Rendimiento y FPS

- [x] En esta rama, limitar el coste de rasterización de partículas de exploración 2D y evitar recrear el backing canvas en todos los fotogramas.
- [x] Eliminar el listener `resize` al cerrar cada exploración 2D.
- [x] Evitar asignar texto idéntico a los indicadores de exploración en todos los fotogramas.
- [x] En los minijuegos principales, limitar DPR y evitar reconstruir el HUD cuando no cambia.
- [ ] Probar visualmente resultados en Windows y Android: calidad, resolución, HUD y respuesta táctil.
- [ ] Medir FPS reales con `Ajustes > Mostrar FPS` en el mapa y usar herramientas del navegador/Electron para medir minijuegos y exploración.
- [ ] Revisar el límite de 30 FPS introducido en Android en #44 antes de prometer 60 FPS; quitarlo solo si las mediciones demuestran una mejora sostenida.
- [ ] Ejecutar `npm ci`, `npm run check`, `npm run web` y los workflows de distribución. No se han ejecutado en esta revisión; no afirmar que hayan pasado.

## Checklist de aceptación

1. **Partidas:** llevar un guardado de Windows a tablet y viceversa sin pérdida de ranura, capítulo, relaciones, inventario ni decisiones.
2. **Minijuegos:** completar y perder cada juego con ratón/teclado y tacto, sin controles invisibles, caídas persistentes ni cuelgues.
3. **Plataformas:** descargar artefactos de Actions, instalar y abrir en equipo real; distinguir build exitoso de instalación validada.
4. **Mapa:** arrastrar/pellizcar, visitar las dos ciudades, abrir menú de lugar, investigar pista, iniciar chat y regresar al mapa sin bloquearse.
5. **Chats:** cubrir varios caminos en cada personaje, traducciones y cambios de capítulo; comprobar que se puede salir y volver a conversar.
6. **Pantalla inicial:** revisar diseño, fuentes, botones, carga/continuación de partida, responsive y accesibilidad.
7. **Integración:** fusionar cambios solo después de revisar diffs, comprobar scripts y probar contra la versión actual de `main`.

## Qué NO se ha hecho todavía

La implementación original de las cinco PR ya existía antes de esta rama; aquí **no** se ha reescrito ni sustituido. Tampoco se han realizado pruebas de rendimiento en dispositivos físicos, ni se han rehecho la portada o las tipografías. Las tareas restantes requieren pruebas e iteraciones específicas antes de darse por completadas.
