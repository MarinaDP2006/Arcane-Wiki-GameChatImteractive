# Arcane: Piltover y Zaun

Juego de escritorio para **Windows** y **macOS** ambientado en el mundo de *Arcane*:
**historia interactiva + chat con voz + mundo abierto** de Piltover y Zaun.

Creas tu personaje, eliges de qué lado del puente vienes y recorres las dos ciudades.
Lo que decides cambia a quién conoces, cómo te tratan y qué final consigues.

## Cómo se juega

1. **Crea tu personaje**: nombre, género, edad, foto (o un retrato ilustrado que diseñas tú),
   profesión, barrio, familia famosa de Arcane (opcional: Kiramman, Talis, Medarda, Ferros,
   Giopara, la de Vander…) y aficiones. Todo eso suma a tus estadísticas
   (🧠 Ingenio, 💬 Carisma, 🔥 Valor, 🌑 Sigilo).
2. **Elige Zaun o Piltover**: cada ciudad tiene su propia ruta de 8 capítulos y empiezas
   en el barrio que elegiste.
3. **Explora el mundo abierto**: camina por los dos mapas, cruza el Puente del Progreso,
   visita lugares, habla con la gente y recoge los fragmentos del Códice (hexágonos azules).
4. **Sigue la historia**: el objetivo ★ te dice adónde ir. Al llegar, la escena se juega como
   un chat con voz. Algunas opciones necesitan estadísticas, afinidad o decisiones anteriores.
5. **Minijuegos y entrenamiento**: cada lugar tiene una actividad que sube una estadística una
   vez por capítulo. Muchas son minijuegos: 🥊 pelea en el foso (reflejos), 🏃 carrera por los
   tejados, 🛹 vuelo en aerotabla, 🎯 galería de tiro, 🔧 circuito hextec (puzle), 🔷 runas de la
   Academia (memoria) y 💰 regateo en el mercado. Algunas decisiones de la historia también se
   resuelven jugando, y en el menú de pausa está el **Salón de minijuegos** para practicar.
6. **Chatea**: cada personaje que conoces se desbloquea en el **comunicador**. Puedes
   hablar con ellos por chat (con su propia voz) o en persona en su lugar del mapa.
   Conversar sube la afinidad, y la afinidad abre opciones en la historia.
7. **Consigue los finales**: el capítulo final en el Puente tiene 4 desenlaces distintos.
8. **Temporada 2** 🌙: al terminar la primera temporada se desbloquea la segunda, que continúa tu
   partida con las consecuencias de lo que hiciste: la cacería de Jinx tras el ataque, Isha, el
   Heraldo y su Evolución Gloriosa, Ambessa y Mel, la bestia del Sumidero, los ecos del tiempo de
   Ekko y la guerra final por el puente, con 3 finales nuevos. Avisa antes de empezar porque
   contiene spoilers de la segunda temporada de Arcane.

### Controles

| Tecla | Acción |
|---|---|
| WASD / flechas (Mayús para correr) o clic en el mapa | Moverse |
| E o Intro | Hablar / entrar / interactuar |
| 1–9 | Elegir una opción |
| H | Historia |
| C | Comunicador (chats) |
| F | Ficha del personaje |
| K | Códice |
| Esc | Pausa / cerrar ventana |
| Espacio | Saltar la escena en curso |
| F11 | Pantalla completa |

### Arte pintado y animado

Todo el arte se genera dentro del juego con un estilo pictórico: retratos pintados que
respiran, parpadean, mueven el pelo y vocalizan al hablar; escenarios animados (niebla de
Zaun, neones que parpadean, polvo dorado de Piltover, portales hextec); cinemáticas de
inicio, de capítulo y de final con movimiento de cámara y narración. En el creador puedes
elegir cara, ojos, cejas, nariz, labios, maquillaje, peinado, ropa y detalles, o subir una
foto que el juego convierte en retrato pintado.

**Tu propio arte:** en *Ajustes → Abrir carpeta de arte* puedes poner imágenes, concept art
o vídeos (por ejemplo `personajes/jinx.png`, `escenas/ultima-gota.jpg`,
`video/intro-zaun.mp4`). El juego los usa en lugar del arte generado. Esos archivos se quedan
en tu ordenador y no se incluyen en el ejecutable.

### Chat con IA: Ollama 🦙

Los personajes conversan libremente con **[Ollama](https://ollama.com)**, que funciona en tu
propio ordenador: gratis, privado y sin conexión a internet.

1. Instala Ollama desde https://ollama.com y ábrelo.
2. Descarga un modelo de chat desde una terminal, por ejemplo:
   `ollama pull llama3.2` (ligero) o `ollama pull qwen3:8b` / `ollama pull mistral` (más potentes).
3. Abre el juego: **detecta automáticamente los modelos instalados en tu PC** y elige uno de
   chat (descarta los de *embeddings*). En **Ajustes → Conversaciones con IA** verás cuáles tienes,
   podrás cambiar de modelo, cambiar la dirección de Ollama (por defecto `http://127.0.0.1:11434`)
   y pulsar **💬 Probar conversación**.

En el comunicador, la cabecera de cada chat indica si estás en **✨ IA: Ollama · modelo** o en
modo clásico (sin Ollama abierto, los personajes responden con diálogos escritos y temas).
Opcionalmente, en el mismo menú se puede usar Claude con una clave de API de Anthropic.

## Cómo instalarlo

Hay dos formas: **descargar el juego ya compilado** (recomendado, no hace falta instalar nada más)
o **ejecutarlo desde el código**.

**Dónde se descarga el juego compilado:**
- En **Releases** (https://github.com/MarinaDP2006/Arcane-Wiki-GameChatImteractive/releases), si hay
  alguna versión publicada.
- O en **Actions → Compilar ejecutables**: abre la ejecución más reciente con ✅ y baja hasta
  **Artifacts**. GitHub entrega los artifacts dentro de un `.zip`, así que primero hay que
  descomprimirlo.

### 🪟 En PC (Windows 10 / 11)

**Opción 1 · Juego compilado**
1. Descarga `arcane-windows` (en Artifacts) o el `.exe` de la Release y descomprímelo si es un `.zip`.
2. Elige uno de los dos archivos:
   - `Arcane Piltover y Zaun Setup X.Y.Z.exe` → **instalador**: doble clic, sigue los pasos y
     tendrás un acceso directo en el escritorio y en el menú Inicio.
   - `Arcane Piltover y Zaun-X.Y.Z-portable.exe` → **portable**: no se instala; doble clic y a jugar
     (puedes llevarlo en un USB).
3. Si Windows muestra **«Windows protegió su PC»** (SmartScreen), pulsa **Más información →
   Ejecutar de todas formas**. Sale porque el juego no está firmado digitalmente.
4. Para desinstalarlo: *Configuración → Aplicaciones → Arcane Piltover y Zaun → Desinstalar*
   (la versión portable basta con borrarla).

**Opción 2 · Desde el código**
1. Instala [Node.js](https://nodejs.org) (versión LTS, 20 o superior) con las opciones por defecto.
2. En GitHub pulsa **Code → Download ZIP** y descomprime la carpeta.
3. Haz doble clic en **`jugar-windows.bat`**. La primera vez descarga lo necesario (unos minutos)
   y después abre el juego. Las siguientes veces arranca directamente.

Tus partidas se guardan en `%APPDATA%\Arcane Piltover y Zaun\partidas` y tu carpeta de arte en
`%APPDATA%\Arcane Piltover y Zaun\arte`.

### 🍎 En Mac (macOS 11 o superior, Intel y Apple Silicon)

**Opción 1 · Juego compilado**
1. Descarga `arcane-macos` (en Artifacts) o el `.dmg` de la Release y descomprímelo si es un `.zip`.
2. Abre el `.dmg` y **arrastra «Arcane Piltover y Zaun» a la carpeta Aplicaciones**.
3. La primera vez, como la app no está firmada por Apple:
   - Haz **clic derecho (o Control + clic) sobre la app → Abrir → Abrir**.
   - Si aun así no se abre, ve a **Ajustes del Sistema → Privacidad y seguridad**, baja hasta el
     aviso de la app y pulsa **Abrir igualmente**.
   - Si macOS dice que la app «está dañada», abre la app **Terminal** y escribe:
     `xattr -cr "/Applications/Arcane Piltover y Zaun.app"`, y vuelve a abrirla.
4. Para desinstalarlo, arrastra la app desde *Aplicaciones* a la Papelera.

**Opción 2 · Desde el código**
1. Instala [Node.js](https://nodejs.org) (versión LTS, 20 o superior).
2. En GitHub pulsa **Code → Download ZIP** y descomprime la carpeta.
3. Haz doble clic en **`jugar-mac.command`**. Si macOS lo bloquea: clic derecho → *Abrir*.
   Si dice que no tiene permisos, abre **Terminal** dentro de la carpeta y escribe
   `chmod +x jugar-mac.command`.

Tus partidas se guardan en `~/Library/Application Support/Arcane Piltover y Zaun/partidas` y tu
carpeta de arte en `~/Library/Application Support/Arcane Piltover y Zaun/arte`.

### 🛠️ Compilar tus propios ejecutables

```bash
npm install
npm start          # jugar en modo desarrollo
npm run check      # validar historia, mapas y diálogos
npm run dist:win   # ejecutables de Windows (hazlo en Windows)
npm run dist:mac   # .dmg de macOS (hazlo en un Mac)
```

Los ejecutables salen en la carpeta `dist/`.

**Publicar una versión con descarga directa:** en GitHub, ve a **Releases → Draft a new release**,
escribe una etiqueta nueva (por ejemplo `v1.2.0`) y pulsa **Publish release**. El workflow compila
Windows y Mac y añade los instaladores a esa Release automáticamente.

## Estructura

```
main.js, preload.js      Proceso de Electron: ventana, partidas, ajustes, chat IA
src/index.html           Interfaz del juego
src/js/world.js          Motor del mundo abierto (mapa, colisiones, cámara, minimapa)
src/js/game.js           Historia, comunicador, ficha, actividades y Códice
src/js/creator.js        Creador de personaje
src/js/audio.js          Voces (síntesis de voz) y música procedural
src/js/portrait.js       Retratos ilustrados generados en SVG
src/data/story.js        Capítulos, decisiones y finales
src/data/world.js        Mapas de Piltover y Zaun, lugares, actividades, fragmentos
src/data/chat.js         Voces y diálogos de cada personaje
src/data/wiki.js         Entradas del Códice (personajes, lugares, criaturas, tecnología, mundo)
src/data/creation.js     Opciones del creador de personaje
scripts/check.js         Validador de datos
```

---

Proyecto de fans sin ánimo de lucro. *Arcane* y *League of Legends* son propiedad de Riot Games.
Los retratos y mapas los genera el propio juego y la música se sintetiza en tiempo real.
