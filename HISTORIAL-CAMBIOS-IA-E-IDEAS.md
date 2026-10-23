# Historial completo de cambios, ideas humanas e IA

> Proyecto: **Grietas & Gears** (nombre inglés **Rifts & Gears** propuesto en PR #48).

> **Corte:** 23 de octubre de 2026. **Fuente:** historial de Pull Requests del repositorio `MarinaDP2006/grietas-and-gears`.

> **Método:** una entrada por PR, desde la #1 hasta la #49, sin duplicar entradas. Cuando una PR corrige, complementa o sustituye otra, se indica que es una continuación, no una funcionalidad nueva. Las ideas humanas son reconstrucciones resumidas de las peticiones; **no son citas literales**. La atribución de IA solo se considera acreditada si consta en la PR o en el contexto de trabajo.

## Cronología (de la PR #1 a la más reciente)

### Cambio 01. Juego de escritorio Arcane: historia + chat con voz + mundo abierto (Windows y Mac)

- **Título:** Juego de escritorio Arcane: historia + chat con voz + mundo abierto (Windows y Mac)
- **Descripción corta:** Juego de escritorio (Electron) que arranca directamente en el menú principal: Continuar / Nueva partida / Cargar / Ajustes / Salir.  - Mundo abierto 2D de Piltover y Zaun (src/js/world.js, src/data/world.js): movimiento con WASD o clic, colisiones, c
- **Fecha:** 2026-10-20 (creación de PR); fusionada 2026-10-20.
- **IA usada:** Claude (atribución explícita en la PR).
- **Pensamiento o idea humana:** Objetivo humano interpretado: juego de escritorio Arcane: historia + chat con voz + mundo abierto (Windows y Mac). No es una cita literal.
- **Estado:** Fusionada.
- **Referencia:** [PR #1](https://github.com/MarinaDP2006/grietas-and-gears/pull/1).

### Cambio 02. v1.2.0: Temporada 2, chat con Ollama, arte animado, cinemáticas, más capítulos y minijuegos

- **Título:** v1.2.0: Temporada 2, chat con Ollama, arte animado, cinemáticas, más capítulos y minijuegos
- **Descripción corta:** 🦙 Chat con IA mediante Ollama (local)  - Ollama es el motor de IA por defecto. Al arrancar, el juego consulta /api/tags, descarta los modelos de embeddings y elige un modelo de chat instalado (llama, qwen, mistral, gemma…).
- **Fecha:** 2026-10-20 (creación de PR); fusionada 2026-10-20.
- **IA usada:** Claude (atribución explícita en la PR).
- **Pensamiento o idea humana:** Objetivo humano interpretado: temporada 2, chat con Ollama, arte animado, cinemáticas, más capítulos y minijuegos. No es una cita literal.
- **Estado:** Fusionada.
- **Referencia:** [PR #2](https://github.com/MarinaDP2006/grietas-and-gears/pull/2).

### Cambio 03. v1.4.0: voces neuronales, creador estilo LoL, menús 3D y Atlas en el Códice

- **Título:** v1.4.0: voces neuronales, creador estilo LoL, menús 3D y Atlas en el Códice
- **Descripción corta:** Voces humanas (v1.3)  - Motor Piper (sherpa-onnx), que se usa sin internet una vez descargadas las voces.
- **Fecha:** 2026-10-20 (creación de PR); fusionada 2026-10-20.
- **IA usada:** Claude (atribución explícita en la PR).
- **Pensamiento o idea humana:** Objetivo humano interpretado: voces neuronales, creador estilo LoL, menús 3D y Atlas en el Códice. No es una cita literal.
- **Estado:** Fusionada.
- **Referencia:** [PR #3](https://github.com/MarinaDP2006/grietas-and-gears/pull/3).

### Cambio 04. v1.4.1: creador estilo LoL con galería de retratos, mapa interactivo en el Códice y sin voces

- **Título:** v1.4.1: creador estilo LoL con galería de retratos, mapa interactivo en el Códice y sin voces
- **Descripción corta:** El PR 3 se fusionó antes de que llegara su último envío, así que la v1.4.0 nunca llegó a main. Este PR la aplica sobre main y añade los cambios pedidos después. Cambios Creador estilo LoL  - Clase con pasiva, habilidades Q/W/E/R, aptitudes con radar,
- **Fecha:** 2026-10-20 (creación de PR); fusionada 2026-10-20.
- **IA usada:** Claude (atribución explícita en la PR).
- **Pensamiento o idea humana:** Objetivo humano interpretado: creador estilo LoL con galería de retratos, mapa interactivo en el Códice y sin voces. No es una cita literal.
- **Estado:** Fusionada.
- **Referencia:** [PR #4](https://github.com/MarinaDP2006/grietas-and-gears/pull/4).

### Cambio 05. v1.4.2: imágenes de la Arcane Wiki y mapa de Fandom en el Códice

- **Título:** v1.4.2: imágenes de la Arcane Wiki y mapa de Fandom en el Códice
- **Descripción corta:** - Descarga desde la Arcane Wiki (Ajustes → Arte personal). Con el botón ⬇ Descargar lo que falta de la Arcane Wiki, el juego consulta en el PC de la usuaria la API de MediaWiki de arcane.fandom.com (prop=pageimages&piprop=original) y guarda:  - la im
- **Fecha:** 2026-10-20 (creación de PR); fusionada 2026-10-20.
- **IA usada:** Claude (atribución explícita en la PR).
- **Pensamiento o idea humana:** Objetivo humano interpretado: imágenes de la Arcane Wiki y mapa de Fandom en el Códice. No es una cita literal.
- **Estado:** Fusionada.
- **Referencia:** [PR #5](https://github.com/MarinaDP2006/grietas-and-gears/pull/5).

### Cambio 06. Mapa del Códice desde la Arcane Wiki y descarga de imágenes que falten

- **Título:** Mapa del Códice desde la Arcane Wiki y descarga de imágenes que falten
- **Descripción corta:** Antes: la pestaña Mapa del Códice cargaba neta.art, y las imágenes de personajes y lugares solo llegaban si la jugadora las ponía a mano (o con Data Dragon, solo para campeones de LoL). Después: el Códice abre por defecto los mapas interactivos de la
- **Fecha:** 2026-10-20 (creación de PR); fusionada 2026-10-20.
- **IA usada:** Claude (atribución explícita en la PR).
- **Pensamiento o idea humana:** Objetivo humano interpretado: mapa del Códice desde la Arcane Wiki y descarga de imágenes que falten. No es una cita literal.
- **Estado:** Fusionada.
- **Referencia:** [PR #6](https://github.com/MarinaDP2006/grietas-and-gears/pull/6).

### Cambio 07. v1.5.0: conversaciones con opciones de diálogo (sin Ollama) y Atlas de las Dos Ciudades

- **Título:** v1.5.0: conversaciones con opciones de diálogo (sin Ollama) y Atlas de las Dos Ciudades
- **Descripción corta:** en el comunicador se escribía texto libre y los personajes respondían con Ollama (o Claude con clave de API); sin Ollama abierto, solo había palabras clave y respuestas genéricas. El mapa del Códice solo abría los mapas de la Arcane Wiki desde intern
- **Fecha:** 2026-10-20 (creación de PR); fusionada 2026-10-20.
- **IA usada:** Claude (atribución explícita en la PR).
- **Pensamiento o idea humana:** Objetivo humano interpretado: conversaciones con opciones de diálogo (sin Ollama) y Atlas de las Dos Ciudades. No es una cita literal.
- **Estado:** Fusionada.
- **Referencia:** [PR #7](https://github.com/MarinaDP2006/grietas-and-gears/pull/7).

### Cambio 08. Arreglar la pestaña «Mapas de la Wiki» del Códice

- **Título:** Arreglar la pestaña «Mapas de la Wiki» del Códice
- **Descripción corta:** al abrir la pestaña de mapas de la Wiki en el Códice, el juego lanzaba window.App.mapUrl is not a function y la pestaña se quedaba vacía. Además, la ayuda de controles y Ajustes seguían diciendo que M abría el «mapa interactivo». After: la pestaña ca
- **Fecha:** 2026-10-20 (creación de PR); fusionada 2026-10-20.
- **IA usada:** Claude (atribución explícita en la PR).
- **Pensamiento o idea humana:** Objetivo humano interpretado: corregir la pestaña «Mapas de la Wiki» del Códice. No es una cita literal.
- **Estado:** Fusionada.
- **Referencia:** [PR #8](https://github.com/MarinaDP2006/grietas-and-gears/pull/8).

### Cambio 09. v1.6.0: arte dentro del juego, atlas interactivo y vídeos de intro

- **Título:** v1.6.0: arte dentro del juego, atlas interactivo y vídeos de intro
- **Descripción corta:** - Avatares: el creador muestra los 8 retratos de mujer o los 8 de hombre según el género elegido (no binario ve los 16).  - Personajes: caras de los 16 personajes de la lista (Vi, Jinx, Ekko, Silco, Vander, Sevika, Isha, Jayce, Viktor, Caitlyn, Mel,
- **Fecha:** 2026-10-21 (creación de PR); fusionada 2026-10-21.
- **IA usada:** Claude (atribución explícita en la PR).
- **Pensamiento o idea humana:** Objetivo humano interpretado: arte dentro del juego, atlas interactivo y vídeos de intro. No es una cita literal.
- **Estado:** Fusionada.
- **Referencia:** [PR #9](https://github.com/MarinaDP2006/grietas-and-gears/pull/9).

### Cambio 10. README: novedades de la v1.6.0

- **Título:** README: novedades de la v1.6.0
- **Descripción corta:** Actualiza el README con las novedades de la v1.6.0 (avatares por género, 16 personajes, Atlas con los símbolos de cada ciudad), sin secciones de arte ni vídeo, y quita las menciones a personajes y descargas que ya no existen. Solo toca README.md. ---
- **Fecha:** 2026-10-21 (creación de PR); fusionada 2026-10-21.
- **IA usada:** Claude (atribución explícita en la PR).
- **Pensamiento o idea humana:** Objetivo humano interpretado: rEADME: novedades de la v1.6.0. No es una cita literal.
- **Estado:** Fusionada.
- **Referencia:** [PR #10](https://github.com/MarinaDP2006/grietas-and-gears/pull/10).

### Cambio 11. v1.7.0: menú principal pintado, vídeos de intro, mundo sin habitantes genéricos y arte de la Arcane Wiki

- **Título:** v1.7.0: menú principal pintado, vídeos de intro, mundo sin habitantes genéricos y arte de la Arcane Wiki
- **Descripción corta:** - Menú principal nuevo: ilustraciones pintadas de Piltover, las Hexpuertas, Zaun y la comuna de Viktor que se funden con zoom lento, con grano de pintura y motas hextec y quimtec. El menú va a la izquierda. Se quitan la escena 3D de bloques, el subtí
- **Fecha:** 2026-10-21 (creación de PR); fusionada 2026-10-21.
- **IA usada:** Claude (atribución explícita en la PR).
- **Pensamiento o idea humana:** Objetivo humano interpretado: menú principal pintado, vídeos de intro, mundo sin habitantes genéricos y arte de la Arcane Wiki. No es una cita literal.
- **Estado:** Fusionada.
- **Referencia:** [PR #11](https://github.com/MarinaDP2006/grietas-and-gears/pull/11).

### Cambio 12. Mundo abierto en 3D con mapas distintos para Piltover y Zaun

- **Título:** Mundo abierto en 3D con mapas distintos para Piltover y Zaun
- **Descripción corta:** Cambios  - src/js/world3d.js: la ciudad en three.js sobre el suelo pintado en 2D. La cámara sigue al jugador desde arriba con un poco de balanceo. Los edificios que te tapan se vuelven translúcidos. El clic para moverse funciona con un rayo sobre el
- **Fecha:** 2026-10-21 (creación de PR); fusionada 2026-10-21.
- **IA usada:** Claude (atribución explícita en la PR).
- **Pensamiento o idea humana:** Objetivo humano interpretado: mundo abierto en 3D con mapas distintos para Piltover y Zaun. No es una cita literal.
- **Estado:** Fusionada.
- **Referencia:** [PR #12](https://github.com/MarinaDP2006/grietas-and-gears/pull/12).

### Cambio 13. v1.8.0: mundo abierto en 2D+3D con cámara libre y Piltover y Zaun distintos

- **Título:** v1.8.0: mundo abierto en 2D+3D con cámara libre y Piltover y Zaun distintos
- **Descripción corta:** Esta rama sale de la del PR 11 (v1.7.0), así que también lleva su commit. Si se fusiona 11 primero, aquí solo quedará el commit de la v1.8. Qué cambia  - Ciudad en 3D (src/js/world3d.js, Three.js ya incluido): edificios, sombras del sol, niebla, faro
- **Fecha:** 2026-10-21 (creación de PR); fusionada 2026-10-21.
- **IA usada:** Claude (atribución explícita en la PR).
- **Pensamiento o idea humana:** Objetivo humano interpretado: mundo abierto en 2D+3D con cámara libre y Piltover y Zaun distintos. No es una cita literal.
- **Estado:** Fusionada.
- **Referencia:** [PR #13](https://github.com/MarinaDP2006/grietas-and-gears/pull/13).

### Cambio 14. v1.8.1: arreglar el mapa en negro y los vídeos pillados, y nombre corto «Arcane»

- **Título:** v1.8.1: arreglar el mapa en negro y los vídeos pillados, y nombre corto «Arcane»
- **Descripción corta:** Mapa en negro Al fusionar 12 y 13 (dos versiones del mapa 3D), src/js/world.js quedó con un error de sintaxis (node --check falla en la línea 1046), así que World no existía: pantalla negra, HUD vacío y minimapa vacío.  - Se restaura world.js de 13,
- **Fecha:** 2026-10-21 (creación de PR); fusionada 2026-10-21.
- **IA usada:** Claude (atribución explícita en la PR).
- **Pensamiento o idea humana:** Objetivo humano interpretado: corregir el mapa en negro y los vídeos pillados, y nombre corto «Arcane». No es una cita literal.
- **Estado:** Fusionada.
- **Referencia:** [PR #14](https://github.com/MarinaDP2006/grietas-and-gears/pull/14).

### Cambio 15. v1.8.2: buscar los vídeos y el arte también en Documentos

- **Título:** v1.8.2: buscar los vídeos y el arte también en Documentos
- **Descripción corta:** Nina guarda sus vídeos en Documentos\LOL-Game_Arcane\Arcane Piltover y Zaun\arte\videos, y el juego solo miraba en AppData y junto al .exe.  - main.js: además de AppData y de la carpeta del .exe, se lee cualquier carpeta arte de Documentos (en Docume
- **Fecha:** 2026-10-21 (creación de PR); fusionada 2026-10-21.
- **IA usada:** Claude (atribución explícita en la PR).
- **Pensamiento o idea humana:** Objetivo humano interpretado: buscar los vídeos y el arte también en Documentos. No es una cita literal.
- **Estado:** Fusionada.
- **Referencia:** [PR #15](https://github.com/MarinaDP2006/grietas-and-gears/pull/15).

### Cambio 16. v1.9.0: capítulos más largos y fieles a Arcane, solo con el reparto principal

- **Título:** v1.9.0: capítulos más largos y fieles a Arcane, solo con el reparto principal
- **Descripción corta:** Historia (src/data/story.js)  - Capítulos más largos: de 321 a 708 líneas de diálogo y de 167 a 216 nodos. Se mantienen todas las opciones, flags, minijuegos y finales existentes.
- **Fecha:** 2026-10-21 (creación de PR); fusionada 2026-10-21.
- **IA usada:** Claude (atribución explícita en la PR).
- **Pensamiento o idea humana:** Objetivo humano interpretado: capítulos más largos y fieles a Arcane, solo con el reparto principal. No es una cita literal.
- **Estado:** Fusionada.
- **Referencia:** [PR #16](https://github.com/MarinaDP2006/grietas-and-gears/pull/16).

### Cambio 17. v1.9.1: Heimerdinger, Maddie y Kino vuelven a hablar (ya tienen cara)

- **Título:** v1.9.1: Heimerdinger, Maddie y Kino vuelven a hablar (ya tienen cara)
- **Descripción corta:** Nina ha añadido las caras que faltaban (violet.png, Heirmendinger.png, Maddie.png, Kino.png), así que el reparto pasa a 16 personajes.  - STORY.cast: + heimerdinger, maddie, kino.
- **Fecha:** 2026-10-21 (creación de PR); fusionada 2026-10-21.
- **IA usada:** Claude (atribución explícita en la PR).
- **Pensamiento o idea humana:** Objetivo humano interpretado: heimerdinger, Maddie y Kino vuelven a hablar (ya tienen cara). No es una cita literal.
- **Estado:** Fusionada.
- **Referencia:** [PR #17](https://github.com/MarinaDP2006/grietas-and-gears/pull/17).

### Cambio 18. v1.10.0: arte y vídeos incluidos en el juego + README sencillo

- **Título:** v1.10.0: arte y vídeos incluidos en el juego + README sencillo
- **Descripción corta:** - Arte incluido en el instalador (de la carpeta arcaneData de Nina): 4 vídeos (Welcome to Zaun/Piltover, IntroS1, IntroS2) en src/img/arte/video, 13 imágenes de personajes, 6 lugares nuevos y 16 fondos del mapa 3D (src/img/arte/mapa).  - Los vídeos v
- **Fecha:** 2026-10-21 (creación de PR); fusionada 2026-10-21.
- **IA usada:** Claude (atribución explícita en la PR).
- **Pensamiento o idea humana:** Objetivo humano interpretado: arte y vídeos incluidos en el juego + README sencillo. No es una cita literal.
- **Estado:** Fusionada.
- **Referencia:** [PR #18](https://github.com/MarinaDP2006/grietas-and-gears/pull/18).

### Cambio 19. v1.10.0: arte y vídeos incluidos en el juego

- **Título:** v1.10.0: arte y vídeos incluidos en el juego
- **Descripción corta:** El PR 18 se fusionó solo con el README; este trae el resto.  - Arte incluido en el instalador (de la carpeta arcaneData de Nina): 4 vídeos (Welcome to Zaun/Piltover, IntroS1, IntroS2) en src/img/arte/video, 13 imágenes de personajes, 6 lugares nuevos
- **Fecha:** 2026-10-21 (creación de PR); fusionada 2026-10-21.
- **IA usada:** Claude (atribución explícita en la PR).
- **Pensamiento o idea humana:** Objetivo humano interpretado: arte y vídeos incluidos en el juego. No es una cita literal.
- **Estado:** Fusionada.
- **Referencia:** [PR #19](https://github.com/MarinaDP2006/grietas-and-gears/pull/19).

### Cambio 20. v1.11.0: versión Android (Capacitor) con controles táctiles, sin vídeos

- **Título:** v1.11.0: versión Android (Capacitor) con controles táctiles, sin vídeos
- **Descripción corta:** Fuera los vídeos. Se borran IntroS1, IntroS2, Welcome to Zaun y Welcome to Piltover (64 MB) y el reproductor de vídeo. Las cinemáticas vuelven a ser solo las pintadas. La carpeta de arte ya no tiene subcarpeta video. App de Android (Capacitor 8). Win
- **Fecha:** 2026-10-21 (creación de PR); fusionada 2026-10-21.
- **IA usada:** Claude (atribución explícita en la PR).
- **Pensamiento o idea humana:** Objetivo humano interpretado: versión Android (Capacitor) con controles táctiles, sin vídeos. No es una cita literal.
- **Estado:** Fusionada.
- **Referencia:** [PR #20](https://github.com/MarinaDP2006/grietas-and-gears/pull/20).

### Cambio 21. Aviso de Riot en el juego y política de privacidad para Google Play

- **Título:** Aviso de Riot en el juego y política de privacidad para Google Play
- **Descripción corta:** Este cambio quedó fuera del 20 porque ese PR se fusionó antes de que llegara.  - Ajustes → Acerca de: el juego se presenta como juego de fans gratuito e incluye el aviso de Riot que exige su política «Legal Jibber Jabber» (Riot no respalda ni patroci
- **Fecha:** 2026-10-21 (creación de PR); fusionada 2026-10-21.
- **IA usada:** Claude (atribución explícita en la PR).
- **Pensamiento o idea humana:** Objetivo humano interpretado: aviso de Riot en el juego y política de privacidad para Google Play. No es una cita literal.
- **Estado:** Fusionada.
- **Referencia:** [PR #21](https://github.com/MarinaDP2006/grietas-and-gears/pull/21).

### Cambio 22. v1.12.0: Grietas & Gears (nuevo nombre) + selector de idioma

- **Título:** v1.12.0: Grietas & Gears (nuevo nombre) + selector de idioma
- **Descripción corta:** Nuevo nombre: Grietas & Gears  - productName, acceso directo, instalador y ejecutables (Grietas-and-Gears-Setup-x.exe, portable, dmg, apk/aab).
- **Fecha:** 2026-10-21 (creación de PR); fusionada 2026-10-21.
- **IA usada:** Claude (atribución explícita en la PR).
- **Pensamiento o idea humana:** Objetivo humano interpretado: grietas & Gears (nuevo nombre) + selector de idioma. No es una cita literal.
- **Estado:** Fusionada.
- **Referencia:** [PR #22](https://github.com/MarinaDP2006/grietas-and-gears/pull/22).

### Cambio 23. v1.13–1.15: mapa estilo Arcane, relaciones, chat con IA, ajustes ampliados y juego sin internet

- **Título:** v1.13–1.15: mapa estilo Arcane, relaciones, chat con IA, ajustes ampliados y juego sin internet
- **Descripción corta:** v1.15 (nuevo)  - Juego 100% sin internet.
- **Fecha:** 2026-10-21 (creación de PR); fusionada 2026-10-21.
- **IA usada:** Claude (atribución explícita en la PR).
- **Pensamiento o idea humana:** Objetivo humano interpretado: mapa estilo Arcane, relaciones, chat con IA, ajustes ampliados y juego sin internet. No es una cita literal.
- **Estado:** Fusionada.
- **Referencia:** [PR #23](https://github.com/MarinaDP2006/grietas-and-gears/pull/23).

### Cambio 24. Aviso de Riot (Legal Jibber Jabber) en el juego y el README, y políti…

- **Título:** Aviso de Riot (Legal Jibber Jabber) en el juego y el README, y políti…
- **Descripción corta:** …ca de privacidad para Google Play Claude-Session: https://claude.ai/code/session_01AE4t48MczYA3p8MquuNjyk
- **Fecha:** 2026-10-21 (creación de PR).
- **IA usada:** Claude (atribución explícita en la PR).
- **Pensamiento o idea humana:** Objetivo humano interpretado: aviso de Riot (Legal Jibber Jabber) en el juego y el README, y políti…. No es una cita literal.
- **Estado:** Cerrada sin fusionar.
- **Referencia:** [PR #24](https://github.com/MarinaDP2006/grietas-and-gears/pull/24).

### Cambio 25. Claude/project thread 40z2ko

- **Título:** Claude/project thread 40z2ko
- **Descripción corta:** Cambio registrado en la PR #25; consulta su descripción y archivos para conocer el alcance exacto.
- **Fecha:** 2026-10-21 (creación de PR).
- **IA usada:** No identificada de forma verificable en la PR.
- **Pensamiento o idea humana:** Objetivo humano interpretado: claude/project thread 40z2ko. No es una cita literal.
- **Estado:** Cerrada sin fusionar.
- **Referencia:** [PR #25](https://github.com/MarinaDP2006/grietas-and-gears/pull/25).

### Cambio 26. v1.15.0: personajes en 3D que andan y corren por el mapa

- **Título:** v1.15.0: personajes en 3D que andan y corren por el mapa
- **Descripción corta:** Esta rama sale de la de 23 (v1.13 mapa 3D + v1.14 relaciones y chat con IA), porque toca los mismos archivos. Si se fusiona esta, 23 entra con ella. El chat con IA y las relaciones son los de 23; aquí solo se corrigen y se completan (abajo). Personaj
- **Fecha:** 2026-10-21 (creación de PR); fusionada 2026-10-21.
- **IA usada:** Claude (atribución explícita en la PR).
- **Pensamiento o idea humana:** Objetivo humano interpretado: personajes en 3D que andan y corren por el mapa. No es una cita literal.
- **Estado:** Fusionada.
- **Referencia:** [PR #26](https://github.com/MarinaDP2006/grietas-and-gears/pull/26).

### Cambio 27. v1.16.0: chat con Ollama fiel a cada personaje y modelos .fbx/.zip en el mapa

- **Título:** v1.16.0: chat con Ollama fiel a cada personaje y modelos .fbx/.zip en el mapa
- **Descripción corta:** Arreglo urgente: en src/js/game.js quedó un : suelto al quitar la nota de Ollama. Era un error de sintaxis y el juego no arrancaba. Ahora con Ollama no se muestra ninguna nota, y con los demás servicios sale la de siempre. Chat con Ollama  - Usa la A
- **Fecha:** 2026-10-21 (creación de PR); fusionada 2026-10-21.
- **IA usada:** Claude (atribución explícita en la PR).
- **Pensamiento o idea humana:** Objetivo humano interpretado: chat con Ollama fiel a cada personaje y modelos .fbx/.zip en el mapa. No es una cita literal.
- **Estado:** Fusionada.
- **Referencia:** [PR #27](https://github.com/MarinaDP2006/grietas-and-gears/pull/27).

### Cambio 28. v1.17.0: juego sin internet, ajustes en 10 pestañas y mapa con estilo Arcane

- **Título:** v1.17.0: juego sin internet, ajustes en 10 pestañas y mapa con estilo Arcane
- **Descripción corta:** Juego 100% sin internet  - Se ha quitado la descarga automática de la Arcane Wiki, los fondos de Universe y la pestaña de mapas de la Wiki del Códice (con su webview y su sesión).
- **Fecha:** 2026-10-21 (creación de PR); fusionada 2026-10-22.
- **IA usada:** Claude (atribución explícita en la PR).
- **Pensamiento o idea humana:** Objetivo humano interpretado: juego sin internet, ajustes en 10 pestañas y mapa con estilo Arcane. No es una cita literal.
- **Estado:** Fusionada.
- **Referencia:** [PR #28](https://github.com/MarinaDP2006/grietas-and-gears/pull/28).

### Cambio 29. Historia fiel a Arcane, muertes del canon y primeros encuentros (v1.19.0)

- **Título:** Historia fiel a Arcane, muertes del canon y primeros encuentros (v1.19.0)
- **Descripción corta:** - Canon al 100 %: lo que pasa en la serie pasa siempre (el cohete impacta, Cassandra muere, Isha se sacrifica, Heimerdinger se queda en la anomalía, Jayce y Viktor desaparecen, Ambessa y Maddie mueren, Jinx cae con Warwick). Tus decisiones cambian re
- **Fecha:** 2026-10-22 (creación de PR); fusionada 2026-10-22.
- **IA usada:** Claude (atribución explícita en la PR).
- **Pensamiento o idea humana:** Objetivo humano interpretado: historia fiel a Arcane, muertes del canon y primeros encuentros (v1.19.0). No es una cita literal.
- **Estado:** Fusionada.
- **Referencia:** [PR #29](https://github.com/MarinaDP2006/grietas-and-gears/pull/29).

### Cambio 30. v1.20.0: música y sonidos propios para Piltover y Zaun

- **Título:** v1.20.0: música y sonidos propios para Piltover y Zaun
- **Descripción corta:** Banda sonora original inspirada en el estilo de Arcane/LoL, generada en tiempo real con Web Audio (sin archivos ni audio de Riot, funciona sin internet).  - Piltover (Re mayor, 80 ppm): cuerdas, metales, arpa, celesta con melodía y un reloj que hace
- **Fecha:** 2026-10-22 (creación de PR); fusionada 2026-10-22.
- **IA usada:** Claude (atribución explícita en la PR).
- **Pensamiento o idea humana:** Objetivo humano interpretado: música y sonidos propios para Piltover y Zaun. No es una cita literal.
- **Estado:** Fusionada.
- **Referencia:** [PR #30](https://github.com/MarinaDP2006/grietas-and-gears/pull/30).

### Cambio 31. Mapa sin avatar del jugador: navegación con clic y solo personajes con modelo 3D (v1.21.0)

- **Título:** Mapa sin avatar del jugador: navegación con clic y solo personajes con modelo 3D (v1.21.0)
- **Descripción corta:** - Sin avatar del jugador en el mapa (ni en 3D ni en el mapa 2D de respaldo). WASD/flechas ya no mueven nada.  - Navegación con ratón/toque: clic en el suelo desliza la vista hasta allí; clic en un personaje o en la tarjeta de un lugar lleva la vista
- **Fecha:** 2026-10-22 (creación de PR); fusionada 2026-10-22.
- **IA usada:** Claude (atribución explícita en la PR).
- **Pensamiento o idea humana:** Objetivo humano interpretado: mapa sin avatar del jugador: navegación con clic y solo personajes con modelo 3D (v1.21.0). No es una cita literal.
- **Estado:** Fusionada.
- **Referencia:** [PR #31](https://github.com/MarinaDP2006/grietas-and-gears/pull/31).

### Cambio 32. Lugares de Piltover y Zaun en 2D con fotogramas de Arcane + APK de tablet en GitHub (v1.22.0)

- **Título:** Lugares de Piltover y Zaun en 2D con fotogramas de Arcane + APK de tablet en GitHub (v1.22.0)
- **Descripción corta:** Se construye encima de 31 (mapa sin avatar) e incluye su commit: conviene fusionar 31 primero; si se fusiona este, 31 queda incluido. Qué cambia Lugares en 2D con los fotogramas de Arcane (src/js/scenes2d.js, nuevo)  - Los 21 accesos de Piltover y Za
- **Fecha:** 2026-10-22 (creación de PR); fusionada 2026-10-22.
- **IA usada:** Claude (atribución explícita en la PR).
- **Pensamiento o idea humana:** Objetivo humano interpretado: lugares de Piltover y Zaun en 2D con fotogramas de Arcane + APK de tablet en GitHub (v1.22.0). No es una cita literal.
- **Estado:** Fusionada.
- **Referencia:** [PR #32](https://github.com/MarinaDP2006/grietas-and-gears/pull/32).

### Cambio 33. Lugares en 2D con fotogramas de Arcane + APK de tablet en cada subida (v1.23.0)

- **Título:** Lugares en 2D con fotogramas de Arcane + APK de tablet en cada subida (v1.23.0)
- **Descripción corta:** - Lugares en 2D (src/js/scenes2d.js): los 22 lugares de Piltover y Zaun abren su fotograma de Arcane a pantalla completa. Tienen niebla, partículas (polvo dorado en Piltover, esporas verdes en Zaun) y se pueden recorrer arrastrando o con A/D/W/S, las
- **Fecha:** 2026-10-22 (creación de PR); fusionada 2026-10-22.
- **IA usada:** Claude (atribución explícita en la PR).
- **Pensamiento o idea humana:** Objetivo humano interpretado: lugares en 2D con fotogramas de Arcane + APK de tablet en cada subida (v1.23.0). No es una cita literal.
- **Estado:** Fusionada.
- **Referencia:** [PR #33](https://github.com/MarinaDP2006/grietas-and-gears/pull/33).

### Cambio 34. Exportar/importar partidas y copia automática entre tableta y PC (v1.24.0)

- **Título:** Exportar/importar partidas y copia automática entre tableta y PC (v1.24.0)
- **Descripción corta:** - Partidas → Exportar / Importar en cada ranura. Importar acepta una partida exportada, una copia completa o una ranura-N.json; pide confirmación si la ranura ya tiene partida.  - U.saveFile: un solo camino para guardar archivos. Windows: diálogo de
- **Fecha:** 2026-10-22 (creación de PR); fusionada 2026-10-22.
- **IA usada:** Claude (atribución explícita en la PR).
- **Pensamiento o idea humana:** Objetivo humano interpretado: exportar/importar partidas y copia automática entre tableta y PC (v1.24.0). No es una cita literal.
- **Estado:** Fusionada.
- **Referencia:** [PR #34](https://github.com/MarinaDP2006/grietas-and-gears/pull/34).

### Cambio 35. Guía de partidas guardadas y carpetas caras/avatares dentro de arcaneData/arte

- **Título:** Guía de partidas guardadas y carpetas caras/avatares dentro de arcaneData/arte
- **Descripción corta:** - Nuevo partidas-guardadas-guia.md: dónde se guardan las partidas en Windows y en Android, la copia automática, cómo exportar e importar entre dispositivos y los pasos para rescatar la partida de un APK anterior a la v1.24.0 (chrome://inspect + conso
- **Fecha:** 2026-10-22 (creación de PR); fusionada 2026-10-22.
- **IA usada:** Claude (atribución explícita en la PR).
- **Pensamiento o idea humana:** Objetivo humano interpretado: guía de partidas guardadas y carpetas caras/avatares dentro de arcaneData/arte. No es una cita literal.
- **Estado:** Fusionada.
- **Referencia:** [PR #35](https://github.com/MarinaDP2006/grietas-and-gears/pull/35).

### Cambio 36. LM Studio como servidor de IA para el chat libre (PC y tablet)

- **Título:** LM Studio como servidor de IA para el chat libre (PC y tablet)
- **Descripción corta:** - Nuevo servicio «LM Studio» en Ajustes → IA para los chats (src/js/ai.js, src/js/app.js):  - Basta con escribir la IP (192.168.1.40): el juego añade :1234/v1/chat/completions.
- **Fecha:** 2026-10-23 (creación de PR); fusionada 2026-10-23.
- **IA usada:** Claude (atribución explícita en la PR).
- **Pensamiento o idea humana:** Objetivo humano interpretado: lM Studio como servidor de IA para el chat libre (PC y tablet). No es una cita literal.
- **Estado:** Fusionada.
- **Referencia:** [PR #36](https://github.com/MarinaDP2006/grietas-and-gears/pull/36).

### Cambio 37. Creador: elegir hombre o mujer y ver solo los retratos de ese género

- **Título:** Creador: elegir hombre o mujer y ver solo los retratos de ese género
- **Descripción corta:** - Paso Identidad: arriba del todo, «¿Hombre o mujer?» con dos tarjetas grandes con retrato de muestra (No binario queda como opción aparte).  - Paso Retrato: selector Mujer / Hombre / No binario encima de la galería. Con Hombre solo salen hombre-1..8
- **Fecha:** 2026-10-23 (creación de PR); fusionada 2026-10-23.
- **IA usada:** Claude (atribución explícita en la PR).
- **Pensamiento o idea humana:** Objetivo humano interpretado: creador: elegir hombre o mujer y ver solo los retratos de ese género. No es una cita literal.
- **Estado:** Fusionada.
- **Referencia:** [PR #37](https://github.com/MarinaDP2006/grietas-and-gears/pull/37).

### Cambio 38. Ramas escritorio y movil con CI propio, versión Mac y web del juego

- **Título:** Ramas escritorio y movil con CI propio, versión Mac y web del juego
- **Descripción corta:** Dos ramas de plataforma, sin duplicar código  - main sigue teniendo todo el juego. escritorio y movil son copias que se actualizan solas.
- **Fecha:** 2026-10-23 (creación de PR); fusionada 2026-10-23.
- **IA usada:** Claude (atribución explícita en la PR).
- **Pensamiento o idea humana:** Objetivo humano interpretado: ramas escritorio y movil con CI propio, versión Mac y web del juego. No es una cita literal.
- **Estado:** Fusionada.
- **Referencia:** [PR #38](https://github.com/MarinaDP2006/grietas-and-gears/pull/38).

### Cambio 39. Mapa interactivo 2D con menú en cada lugar

- **Título:** Mapa interactivo 2D con menú en cada lugar
- **Descripción corta:** Mapa (src/js/world.js, reescrito, sin 3D)  - Carta ilustrada de Piltover y Zaun: arte de Arcane de la temporada de fondo, barrios con su nombre, calles entre lugares, mar de las Hexpuertas / canal químico del Sumidero, edificios en tinta suave, rosa
- **Fecha:** 2026-10-23 (creación de PR); fusionada 2026-10-23.
- **IA usada:** Claude (atribución explícita en la PR).
- **Pensamiento o idea humana:** Objetivo humano interpretado: mapa interactivo 2D con menú en cada lugar. No es una cita literal.
- **Estado:** Fusionada.
- **Referencia:** [PR #39](https://github.com/MarinaDP2006/grietas-and-gears/pull/39).

### Cambio 40. Minijuegos con profundidad y arte real de Arcane + 3 minijuegos nuevos (v1.26.0)

- **Título:** Minijuegos con profundidad y arte real de Arcane + 3 minijuegos nuevos (v1.26.0)
- **Descripción corta:** - src/js/depth.js (nuevo): motor de profundidad para los minijuegos. Usa el arte real de cada lugar (T1 y T2, elegido al azar en cada partida; durante la historia respeta la temporada) con paralaje, desenfoque de lente, gradación de color, niebla en
- **Fecha:** 2026-10-23 (creación de PR); fusionada 2026-10-23.
- **IA usada:** Claude (atribución explícita en la PR).
- **Pensamiento o idea humana:** Objetivo humano interpretado: minijuegos con profundidad y arte real de Arcane + 3 minijuegos nuevos (v1.26.0). No es una cita literal.
- **Estado:** Fusionada.
- **Referencia:** [PR #40](https://github.com/MarinaDP2006/grietas-and-gears/pull/40).

### Cambio 41. Chats sin fin: conversaciones ramificadas con los 16 personajes

- **Título:** Chats sin fin: conversaciones ramificadas con los 16 personajes
- **Descripción corta:** - Cada uno de los 16 personajes tiene un nuevo tema en el comunicador («Tengo tiempo. Hablemos sin prisa.» y variantes) que abre una conversación ramificada: 3 hilos × 3 niveles + un nodo raíz, 3 opciones por paso con tonos distintos. En total 160 no
- **Fecha:** 2026-10-23 (creación de PR); fusionada 2026-10-23.
- **IA usada:** Claude (atribución explícita en la PR).
- **Pensamiento o idea humana:** Objetivo humano interpretado: chats sin fin: conversaciones ramificadas con los 16 personajes. No es una cita literal.
- **Estado:** Fusionada.
- **Referencia:** [PR #41](https://github.com/MarinaDP2006/grietas-and-gears/pull/41).

### Cambio 42. Migrar web promocional a Render y añadir galería de capturas sin spoilers

- **Título:** Migrar web promocional a Render y añadir galería de capturas sin spoilers
- **Descripción corta:** Configura Render Static Site con render.yaml, elimina el workflow de GitHub Pages, mejora la presentación profesional, retira referencias a IA de la web y añade una galería que solo publica capturas reales autorizadas (inicio, creación, comunicador s
- **Fecha:** 2026-10-23 (creación de PR); fusionada 2026-10-23.
- **IA usada:** ChatGPT (intervención documentada en el historial de trabajo).
- **Pensamiento o idea humana:** Objetivo humano interpretado: migrar web promocional a Render y añadir galería de capturas sin spoilers. No es una cita literal.
- **Estado:** Fusionada.
- **Referencia:** [PR #42](https://github.com/MarinaDP2006/grietas-and-gears/pull/42).

### Cambio 43. Integrar mapa 2D interactivo de Claude en main

- **Título:** Integrar mapa 2D interactivo de Claude en main
- **Descripción corta:** Rama de Claude con mapa interactivo 2D, menú de lugares, controles táctiles y navegación. Requiere resolver divergencia con main y ejecutar pruebas antes de fusionar.
- **Fecha:** 2026-10-23 (creación de PR); fusionada 2026-10-23.
- **IA usada:** ChatGPT (intervención documentada en el historial de trabajo).
- **Pensamiento o idea humana:** Objetivo humano interpretado: incorporar mapa 2D interactivo de Claude en main. No es una cita literal.
- **Estado:** Fusionada.
- **Referencia:** [PR #43](https://github.com/MarinaDP2006/grietas-and-gears/pull/43).

### Cambio 44. Optimizar rendimiento del mapa en Android y tablet

- **Título:** Optimizar rendimiento del mapa en Android y tablet
- **Descripción corta:** Reduce el coste del lienzo en Android: límite de 30 FPS para dibujo, resolución interna máxima 1.25x, evita el filtro blur por fotograma y omite dibujo con documento oculto. Requiere pruebas en dispositivos Android reales y CI antes de fusionar.
- **Fecha:** 2026-10-23 (creación de PR); fusionada 2026-10-23.
- **IA usada:** ChatGPT (intervención documentada en el historial de trabajo).
- **Pensamiento o idea humana:** Objetivo humano interpretado: mejorar rendimiento del mapa en Android y tablet. No es una cita literal.
- **Estado:** Fusionada.
- **Referencia:** [PR #44](https://github.com/MarinaDP2006/grietas-and-gears/pull/44).

### Cambio 45. Optimizar Canvas para mejorar la fluidez hacia 60 FPS

- **Título:** Optimizar Canvas para mejorar la fluidez hacia 60 FPS
- **Descripción corta:** - Cachea el fondo panorámico desenfocado del mapa y lo regenera únicamente si cambia la ciudad, la imagen o el tamaño del lienzo.  - Limita la resolución interna del canvas del mapa (DPR 1.5) y de las escenas (DPR 1.25) para reducir trabajo de raster
- **Fecha:** 2026-10-23 (creación de PR); fusionada 2026-10-23.
- **IA usada:** ChatGPT (intervención documentada en el historial de trabajo).
- **Pensamiento o idea humana:** Objetivo humano interpretado: mejorar Canvas para mejorar la fluidez hacia 60 FPS. No es una cita literal.
- **Estado:** Fusionada.
- **Referencia:** [PR #45](https://github.com/MarinaDP2006/grietas-and-gears/pull/45).

### Cambio 46. Continuar pendientes de Claude: rendimiento de escenas 2D y minijuegos

- **Título:** Continuar pendientes de Claude: rendimiento de escenas 2D y minijuegos
- **Descripción corta:** - Escenas 2D: no reinicializar el canvas de partículas en cada fotograma, limitar DPR a 1.5, limpiar listener de resize al cerrar, suspender efectos si la app está oculta y evitar actualizar el texto del HUD si no cambió.  - Minijuegos: limitar DPR d
- **Fecha:** 2026-10-23 (creación de PR); fusionada 2026-10-23.
- **IA usada:** ChatGPT (intervención documentada en el historial de trabajo).
- **Pensamiento o idea humana:** Objetivo humano interpretado: continuar pendientes de Claude: rendimiento de escenas 2D y minijuegos. No es una cita literal.
- **Estado:** Fusionada.
- **Referencia:** [PR #46](https://github.com/MarinaDP2006/grietas-and-gears/pull/46).

### Cambio 47. Controles táctiles para móvil y tablet: exploración y minijuegos

- **Título:** Controles táctiles para móvil y tablet: exploración y minijuegos
- **Descripción corta:** - Exploración 2D: cinco botones táctiles (izquierda/derecha/arriba/abajo/interactuar) visibles en pantallas táctiles, con soporte para mantener pulsado, captura de puntero y zonas seguras de pantalla.  - Arrastre de cámara con identificador de punter
- **Fecha:** 2026-10-23 (creación de PR); fusionada 2026-10-23.
- **IA usada:** ChatGPT (intervención documentada en el historial de trabajo).
- **Pensamiento o idea humana:** Objetivo humano interpretado: controles táctiles para móvil y tablet: exploración y minijuegos. No es una cita literal.
- **Estado:** Fusionada.
- **Referencia:** [PR #47](https://github.com/MarinaDP2006/grietas-and-gears/pull/47).

### Cambio 48. Rifts & Gears: English game branding and licensed 3D character pipeline

- **Título:** Rifts & Gears: English game branding and licensed 3D character pipeline
- **Descripción corta:** Renombra el título visible y metadatos de distribución a Rifts & Gears, sin modificar IDs internos, rutas de guardado ni appId. Añade src/models/index.json vacío para la ruta web/Android del cargador 3D y un plan documentado para Viktor, Jayce, Mel,
- **Fecha:** 2026-10-23 (creación de PR).
- **IA usada:** ChatGPT (intervención documentada en el historial de trabajo).
- **Pensamiento o idea humana:** Objetivo humano interpretado: rifts & Gears: English game branding and licensed 3D character pipeline. No es una cita literal.
- **Estado:** Abierta, **no fusionada**.
- **Referencia:** [PR #48](https://github.com/MarinaDP2006/grietas-and-gears/pull/48).

### Cambio 49. Actualizar web oficial: Rifts & Gears, novedades y descargas reales

- **Título:** Actualizar web oficial: Rifts & Gears, novedades y descargas reales
- **Descripción corta:** - Nuevo nombre visible Rifts & Gears y CTA en portada.  - Sección de novedades reales del 23/10/2026: mapa, controles táctiles, chats, minijuegos, partidas y rendimiento.
- **Fecha:** 2026-10-23 (creación de PR).
- **IA usada:** ChatGPT (intervención documentada en el historial de trabajo).
- **Pensamiento o idea humana:** Objetivo humano interpretado: actualizar web oficial: Rifts & Gears, novedades y descargas reales. No es una cita literal.
- **Estado:** Abierta, **no fusionada**.
- **Referencia:** [PR #49](https://github.com/MarinaDP2006/grietas-and-gears/pull/49).

## Aclaraciones de seguimiento

- Los cambios #3 y #4, #5 y #6, #12 y #13, #18 y #19, #32 y #33, #39 y #43 y otras continuaciones **no se presentan como mejoras independientes idénticas**: son entradas cronológicas de PR diferentes que explican la corrección o integración de la misma línea de trabajo.
- La PR #48 propone el nombre **Rifts & Gears** y un catálogo de modelos 3D; no acredita la incorporación de siete modelos GLB finales.
- La PR #49 actualiza la web, pero mientras siga abierta su contenido no se considera desplegado.
- La existencia de un commit o PR fusionada no prueba por sí sola que la funcionalidad se haya probado en Windows, macOS o Android reales.
- Ollama y LM Studio son **motores opcionales del chat del juego**, no necesariamente las IA que programaron cada mejora.
- Este registro se mantiene por PR para que futuras actualizaciones puedan añadirse sin renumerar cambios anteriores.
