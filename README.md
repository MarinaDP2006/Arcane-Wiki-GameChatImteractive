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

### Chat con IA (opcional)

Sin configurar nada, los personajes responden con diálogos escritos y temas de conversación.
Si pones una clave de API de Anthropic en **Ajustes → Conversaciones con IA**, conversan
libremente con Claude sin salir del personaje, teniendo en cuenta tu ficha, tu afinidad y
tus decisiones. La clave se guarda solo en tu ordenador.

## Descargar e instalar en tu PC

### Opción A · Descargar el juego ya compilado (lo más fácil)

1. Ve a la página de **Releases** del repositorio
   (https://github.com/MarinaDP2006/Arcane-Wiki-GameChatImteractive/releases) y abre la última versión.
   Si aún no hay ninguna, entra en **Actions → Compilar ejecutables**, abre la última ejecución
   en verde y baja a **Artifacts**.
2. Descarga el archivo de tu sistema:
   - **Windows**: `Arcane Piltover y Zaun Setup X.Y.Z.exe` (instalador, crea acceso directo) o
     `Arcane Piltover y Zaun-X.Y.Z-portable.exe` (sin instalar: doble clic y a jugar).
   - **macOS**: el `.dmg` (Intel y Apple Silicon). Ábrelo y arrastra el juego a *Aplicaciones*.
3. La primera vez:
   - En Windows, si aparece SmartScreen: *Más información → Ejecutar de todas formas*.
   - En macOS: clic derecho sobre el juego → *Abrir* → *Abrir* (la app no está firmada).

### Opción B · Ejecutar desde el código

1. Instala [Node.js](https://nodejs.org) (versión 20 o superior).
2. Descarga el proyecto: botón verde **Code → Download ZIP** en GitHub y descomprímelo
   (o `git clone https://github.com/MarinaDP2006/Arcane-Wiki-GameChatImteractive.git`).
3. Haz doble clic en:
   - **Windows**: `jugar-windows.bat`
   - **macOS**: `jugar-mac.command` (si macOS lo bloquea: clic derecho → *Abrir*).

   La primera vez instala lo necesario y luego abre el juego.

### Compilar tus propios ejecutables

```bash
npm install
npm start          # jugar en modo desarrollo
npm run check      # validar historia, mapas y diálogos
npm run dist:win   # ejecutables de Windows (en Windows)
npm run dist:mac   # .dmg de macOS (en un Mac)
```

Los ejecutables salen en la carpeta `dist/`. Las partidas se guardan en la carpeta de datos
del usuario (3 ranuras con autoguardado).

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
