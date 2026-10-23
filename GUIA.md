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
| Conversación | Diálogos escritos y, si se activa, rol libre con IA. |
| Minijuegos | Combate, tejados, planeador de vapor, tiro, circuito, secuencia del Archivo, regateo, persecución, mira del Observatorio y cápsulas de vapor. |
| Música | Tres pistas MP3 propias (inicio, Aurelia, Nácar) con respaldo generado en tiempo real. |

## 2. Jugar

1. **Nueva partida** abre el creador. Tu ciudad decide la ruta y los primeros personajes que conoces.
2. En el mapa, la flecha y el rótulo «Objetivo» llevan al siguiente lugar. Al tocar un lugar se abre su menú: historia, con quién hablar, minijuego, explorar y viajar.
3. Teclas: **H** historia, **C** comunicador, **F** ficha, **K** Códice, **M** Atlas, **Esc** pausa.
4. Los cristales de Resonancia del mapa desbloquean entradas del Códice.
5. **Ajustes → Lectura → Colores** elige «Según la ciudad» (cambia al viajar), «Azul neutro», «Aurelia» o «Nácar». El inicio y los ajustes siempre van en azul neutro.

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
| IA de los personajes | `src/js/ai.js` (`systemPrompt` y `storyTurn`) |
| Modelos 3D de los personajes | `src/models/*.glb` y `src/models/index.json` |

## 5. Historia

Cada capítulo de `STORY.chapters` tiene nodos con `bg` (un lugar de `scenes.js`), `lines` (quién habla y qué dice) y `choices` (texto, siguiente nodo y efectos: afinidad, flags, estadísticas). Un nodo con `end: true` cierra el capítulo; al acabar el último de la ruta se reproduce el final de `STORY.endings`. `npm run check` avisa si un nodo no se puede alcanzar, si un hablante no existe o si una flag nunca se activa.

## 6. IA

En **Ajustes → IA** se elige el servicio. La opción recomendada es **Ollama Cloud**: el modelo corre en el servidor (`server/index.js`, endpoint `/api/roleplay`) con la clave `OLLAMA_API_KEY` guardada como secreto del alojamiento, nunca en el repositorio. También funcionan Ollama o LM Studio en el propio ordenador (ver [GUIA-LM-STUDIO.md](GUIA-LM-STUDIO.md)). Sin IA, los diálogos escritos siguen funcionando.

## 7. Guardados

| Plataforma | Dónde |
|---|---|
| Windows | `%APPDATA%\Rifts & Gears - Las ciudades del Umbral\partidas\` |
| macOS | `~/Library/Application Support/Rifts & Gears - Las ciudades del Umbral/partidas/` |
| Navegador y Android | Almacenamiento local de la app (`umbral-slot-1` a `umbral-slot-3`) |

**Ajustes → Datos → Guardar copia** exporta partidas y ajustes a un `.json` que se puede cargar en otro dispositivo con **Cargar copia**.

## 8. Arte personal

En escritorio, **Ajustes → Arte personal** abre la carpeta de arte. Ahí puedes poner tus propias imágenes de lugares, personajes y caras, y modelos `.glb` con el id del personaje (`iria-venn.glb`, `darel-ossan.glb`…). El archivo `GUIA-DE-ARTE.txt` de esa carpeta lista todos los nombres que reconoce el juego.

## 9. Web

`web/` es la web pública: portada, demo de rol libre (`demo.html`) y privacidad. `npm run web` la genera en `web-dist/` con los datos reales del juego. `render.yaml` publica la web y la API juntas. Más detalles en [GUIA-WEB-RENDER.md](GUIA-WEB-RENDER.md).

## 10. Compilar

```bash
npm run dist:win     # instalador y portable de Windows
npm run dist:mac     # macOS
npm run android:sync # copia src/ y la música a www/ y sincroniza Capacitor
```

La app de Android es `com.marinadp2006.ciudadesdelumbral`. GitHub Actions compila Windows y macOS en cada push y publica una release al crear una etiqueta `v*`.

## 11. Antes de publicar

1. `npm run check` en verde.
2. Partida nueva en Aurelia y en Nácar hasta el primer capítulo.
3. Ajustes: colores, volumen de música y cambio de pista al viajar entre ciudades.
4. Probar en pantalla de móvil (el creador y el mapa se adaptan a pantallas estrechas).

## 12. Más documentación

- [Pendientes](PENDIENTES.md)
- [Plan del universo original](docs/PLAN-UNIVERSO-ORIGINAL.md)
- [Prompts de modelos 3D](docs/PROMPTS-MODELOS-3D-UNIVERSO-ORIGINAL.md)
- [Hoja de ruta 3D y avatares](docs/HOJA_DE_RUTA_3D_LM_STUDIO_Y_AVATARES.md)
- [Exportar el repositorio](docs/GUIA-EXPORTAR-REPOSITORIO.md)
- [Privacidad](PRIVACIDAD.md)

Código bajo licencia MIT. El universo, sus nombres, su historia, su arte y su música son originales de MarinaDP2006.
