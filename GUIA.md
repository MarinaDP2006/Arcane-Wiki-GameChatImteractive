# Guía de Las ciudades del Umbral · Rifts & Gears

Manual para jugar y para tocar el código. Si solo quieres jugar, lee las secciones 1 y 2.

## 1. Qué es

Aventura narrativa original de fantasía industrial. Creas un personaje de **Aurelia** (la ciudad elevada, oro y beige) o de **Nácar** (la ciudad bajo la piedra, negro y verde), recorres el mapa, juegas la historia, hablas con diez personajes y desbloqueas el Códice. Las dos ciudades dependen de la **Resonancia**, una energía que nace de la vibración de la roca.

| Sistema | Qué hay |
|---|---|
| Historia | Dos rutas (Nácar z1-z3, Aurelia p1-p3) en tres partes y un final. |
| Creador | Origen, identidad, clase, habilidades Q/W/E/R, aptitudes, retrato, familia, aficiones y ficha. |
| Mapa | Aurelia y Nácar en 3D (Three.js) con vista 2D alternativa; 10 lugares con su ilustración. |
| Personajes | 10 personajes con relaciones (amistad, mejor amistad, pareja, familia elegida, hermandad) y charla. |
| Conversación | Historia libre con IA (KoboldCpp, la única IA del juego: escribes lo que dices o haces y la escena responde y avanza) y chats libres con los personajes. Sin IA, o con «Ajustes → Juego → Cómo hablas en la historia → Opciones escritas», salen los diálogos escritos. En móvil y tableta la historia ocupa toda la pantalla y los personajes pasan a una fila arriba. |
| Minijuegos | Combate, tejados, planeador de vapor, tiro, circuito, secuencia del Archivo, regateo, persecución, mira del Observatorio y cápsulas de vapor. |
| Música | Tres pistas MP3 propias (inicio, Aurelia, Nácar) con respaldo generado en tiempo real. |

## 2. Jugar

1. El menú de inicio tiene **Jugar**, **Ajustes**, **Créditos** y **Salir** (solo en escritorio). Si ya tienes partidas, **Jugar** ofrece Continuar, Nueva partida y Cargar partida; si no, abre directamente el creador.
2. El creador va en tres columnas: los pasos a la izquierda, tu retrato en grande en el centro y las opciones a la derecha. En el móvil, los pasos van arriba en fila. Tu ciudad decide la ruta, los primeros personajes que conoces, los colores y la música. El retrato se elige de una galería de 24 avatares incluidos (12 de mujer y 12 de hombre, según el género elegido) o con «Subir mi foto».
3. En el mapa, la flecha y el rótulo «Objetivo» llevan al siguiente lugar. Al tocar un lugar se abre su menú: historia, con quién hablar, minijuego, explorar y viajar.
4. Arriba aparece el rótulo de la ciudad en la que estás. Teclas: **H** historia, **C** comunicador, **F** ficha, **K** Códice, **M** Atlas, **Esc** pausa.
5. Los cristales de Resonancia del mapa desbloquean entradas del Códice.
6. **Ajustes** tiene las pestañas en columna a la izquierda (en el móvil, arriba). **Ajustes → Lectura → Colores** elige «Según la ciudad» (cambia al viajar), «Azul neutro», «Aurelia» o «Nácar». El inicio y los ajustes siempre van en azul neutro.

## 3. Entorno de desarrollo

```bash
npm ci
npm run check      # datos de la historia, mapas, relaciones y scripts
npm start          # escritorio (Electron)
npm run web        # genera la web en web-dist/
npm run serve:web  # sirve web-dist/ y la API de rol en http://localhost:10000
```

## 4. Dónde está cada cosa

| Quiero cambiar… | Archivo |
|---|---|
| Reparto, Códice, historia, chat, mapas y Atlas | `src/data/original-world.js` |
| Opciones del creador (ciudades, oficios, familias, clases, habilidades) | `src/data/creation.js` |
| Relaciones, saludos, escenas y charla de cada personaje | `src/data/relations.js` |
| Casa de cada personaje, inicio de cada capítulo y barrios | `src/data/world.js` |
| Guía de personajes que sale al empezar | `src/data/guia.js` |
| Colores de Aurelia, Nácar y el azul neutro | `src/css/umbral.css` |
| Estilos generales | `src/css/styles.css` |
| Ilustraciones de lugares, mapa y símbolos | `src/img/umbral/` (las genera `scripts/generar-arte-umbral.py`) |
| Escenas pintadas de cada lugar | `src/js/scenes.js` (`THEMES`) y `src/js/scenes2d.js` (`PLACES`) |
| Minijuegos | `src/js/minigames.js` y `src/js/minigames-extra.js` |
| Música | `assets/music/` y `src/js/audio.js` |
| Avatares del creador | `src/img/arte/avatares/` (los genera `scripts/generar-avatares.js`; `node scripts/art-manifest.js` actualiza la lista) |
| IA de los personajes | `src/js/ai.js` (`systemPrompt` y `storyTurn`) |
| Modelos 3D de los personajes | `src/models/*.glb` y `src/models/index.json` |

## 5. Historia

Cada capítulo de `STORY.chapters` tiene nodos con `bg` (un lugar de `scenes.js`), `lines` (quién habla y qué dice) y `choices` (texto, siguiente nodo y efectos: afinidad, flags, estadísticas). Un nodo con `end: true` cierra el capítulo; al acabar el último de la ruta se reproduce el final de `STORY.endings`. `npm run check` avisa si un nodo no se puede alcanzar, si un hablante no existe o si una flag nunca se activa.

## 6. IA

La única IA del juego es **KoboldCpp**. No hay otros servicios ni claves. En **Ajustes → IA de la historia y los chats** se elige **KoboldCpp** (en el PC, `http://localhost:5001`; en la tablet, el móvil u otro PC, la IP del PC con KoboldCpp en la misma wifi, por ejemplo `192.168.1.139`: el puerto 5001 y la ruta se completan solos). Los pasos están en [GUIA-KOBOLDCPP.md](GUIA-KOBOLDCPP.md). Viene **desactivada** de fábrica: hasta que la actives, la historia usa las opciones escritas. Si KoboldCpp no contesta en una escena, esa escena vuelve a las opciones escritas. La web (`server/index.js`, endpoint `/api/roleplay`) reenvía a KoboldCpp en `KOBOLDCPP_URL`.

## 7. Guardados

| Plataforma | Dónde |
|---|---|
| Windows | `%APPDATA%\Rifts & Gears - Las ciudades del Umbral\partidas\` |
| macOS | `~/Library/Application Support/Rifts & Gears - Las ciudades del Umbral/partidas/` |
| Navegador y Android | Almacenamiento local de la app (`umbral-slot-1` a `umbral-slot-3`) |

**Ajustes → Datos → Guardar copia** exporta partidas y ajustes a un `.json` que se puede cargar en otro dispositivo con **Cargar copia**.

## 8. Arte personal

En escritorio, **Ajustes → Arte personal** abre la carpeta de arte. Las imágenes que pongas en `avatares/` con `mujer-` u `hombre-` delante del nombre se suman a la galería del creador (y mandan sobre las incluidas si se llaman igual). También puedes poner tus propias imágenes de lugares, personajes y caras, y modelos `.glb` con el id del personaje (`iria-venn.glb`, `darel-ossan.glb`…). El archivo `GUIA-DE-ARTE.txt` de esa carpeta lista todos los nombres que reconoce el juego.

## 9. Web

`web/` es la web pública: portada, demo de rol libre (`demo.html`) y privacidad. `npm run web` la genera en `web-dist/` con los datos reales del juego. `render.yaml` publica la web y la API juntas. Más detalles en [GUIA-WEB-RENDER.md](GUIA-WEB-RENDER.md).

## 10. Compilar

```bash
npm run dist:win     # instalador y portable de Windows
npm run dist:mac     # macOS
npm run android:sync # copia src/ y la música a www/ y sincroniza Capacitor
```

La app de Android es `com.marinadp2006.ciudadesdelumbral`. El workflow `.github/workflows/compilar.yml` («Compilar juego (Windows, macOS y Android)») se lanza en cada push a main, en cada pull request a main, con etiquetas `v*` y a mano:

1. **Comprobaciones** (`npm run check` y sintaxis del motor). Si fallan, no se compila nada.
2. Un job por sistema: Windows x64, macOS x64, macOS arm64 y Android (APK universal). Las dependencias se instalan con `npm ci` desde `package-lock.json`; Android usa JDK 21 (Temurin) y Android SDK 36.
3. Cada job sube un artefacto `ciudades-del-umbral-<versión>-<plataforma>-<arquitectura>`, que se descarga desde la página de la ejecución (Actions → la ejecución → Artifacts). Se guarda 14 días por defecto.

Ejecución manual: GitHub → Actions → «Compilar juego (Windows, macOS y Android)» → **Run workflow**. Opciones:

- **Qué compilar**: `todas`, `windows`, `macos` o `android`.
- **Días que se guardan los artefactos**: de 1 a 90.
- **Publicar la Release**: desmarcado por defecto. Solo si lo marcas (y eliges `todas`) se crea la etiqueta `v<versión>` y la Release con los instaladores y el APK. Ni los push ni las etiquetas publican nada solos.

Una etiqueta `v*` debe coincidir con la versión de `package.json`; si no, las comprobaciones fallan. El APK firmado y el AAB solo se generan si están configurados los secretos `ANDROID_KEYSTORE_BASE64`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS` y `ANDROID_KEY_PASSWORD` (nunca en pull requests); sin ellos sale el APK de prueba.

## 11. Antes de publicar

1. `npm run check` en verde.
2. Partida nueva en Aurelia y en Nácar hasta el primer capítulo.
3. Ajustes: colores, volumen de música y cambio de pista al viajar entre ciudades.
4. Probar en pantalla de móvil (el creador y el mapa se adaptan a pantallas estrechas).

## 12. Más documentación

- [Pendientes](PENDIENTES.md)
- [Plan del universo original](docs/PLAN-UNIVERSO-ORIGINAL.md)
- [Prompts de modelos 3D](docs/PROMPTS-MODELOS-3D-UNIVERSO-ORIGINAL.md)
- [Hoja de ruta 3D y avatares](docs/HOJA_DE_RUTA_3D_KOBOLDCPP_Y_AVATARES.md)
- [Exportar el repositorio](docs/GUIA-EXPORTAR-REPOSITORIO.md)
- [Privacidad](PRIVACIDAD.md)

Código bajo licencia MIT. El universo, sus nombres, su historia, su arte y su música son originales de MarinaDP2006.
