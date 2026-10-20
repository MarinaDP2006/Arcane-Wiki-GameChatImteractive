# Arcane: Piltover y Zaun

Juego de escritorio para **Windows** y **macOS** ambientado en el mundo de *Arcane*:
**historia interactiva + conversaciones con opciones + mundo abierto** de Piltover y Zaun.

Creas tu personaje, eliges de qué lado del puente vienes y recorres las dos ciudades.
Lo que decides cambia a quién conoces, cómo te tratan y qué final consigues.

## 🚀 Instalación paso a paso (guía rápida)

> Sigue estos pasos en orden. En unos 10 minutos estarás jugando.

### Paso 1 · Descarga el juego

1. Entra en el repositorio: https://github.com/MarinaDP2006/Arcane-Wiki-GameChatImteractive
2. Arriba, pulsa la pestaña **Actions**.
3. En la lista de la izquierda pulsa **Compilar ejecutables**.
4. Abre la ejecución más reciente que tenga un **✅ verde** (la primera de la lista).
5. Baja hasta el final de la página, al apartado **Artifacts**, y descarga:
   - **`arcane-windows`** si tienes un PC con Windows.
   - **`arcane-macos`** si tienes un Mac.

   *(Si existe una versión en **Releases**, también puedes descargar el instalador desde ahí.)*
6. Se descarga un archivo `.zip`. Haz clic derecho sobre él → **Extraer todo…** (Windows) o doble
   clic (Mac) para descomprimirlo.

### Paso 2 · Instálalo

**🪟 Windows**
1. Dentro de la carpeta descomprimida verás dos archivos `.exe`:
   - **`Arcane Piltover y Zaun Setup …exe`** → el instalador. Doble clic, pulsa *Siguiente* hasta
     el final y se creará un acceso directo en el escritorio.
   - **`Arcane Piltover y Zaun-…-portable.exe`** → sin instalar. Doble clic y se abre el juego.
2. Si aparece la ventana azul **«Windows protegió su PC»**, pulsa **Más información** y después
   **Ejecutar de todas formas**. (Pasa porque el juego no tiene firma digital; es normal.)

**🍎 Mac**
1. Dentro de la carpeta descomprimida, haz doble clic en el archivo **`.dmg`**.
2. Arrastra el icono **Arcane Piltover y Zaun** a la carpeta **Aplicaciones**.
3. Ve a *Aplicaciones*, haz **clic derecho sobre el juego → Abrir → Abrir**.
   - Si no te deja: **Ajustes del Sistema → Privacidad y seguridad → Abrir igualmente**.
   - Si dice que «está dañado»: abre **Terminal** y escribe
     `xattr -cr "/Applications/Arcane Piltover y Zaun.app"` y vuelve a abrirlo.

### Paso 3 · ¡A jugar!

1. En el menú principal pulsa **✦ Nueva partida**.
2. Elige **Zaun** o **Piltover**, crea tu personaje (clase, habilidades, retrato, familia…).
3. Ve al lugar marcado con **★ OBJETIVO** en el mapa y pulsa **E** para empezar el capítulo.
4. Pulsa **C** para hablar con los personajes que conozcas y **Esc** para el menú de pausa.
   No necesitas instalar nada más: el juego no usa IA ni Ollama.

> ¿Prefieres ejecutarlo desde el código? Instala [Node.js](https://nodejs.org), descarga el proyecto
> con **Code → Download ZIP**, descomprímelo y haz doble clic en `jugar-windows.bat` (Windows) o
> `jugar-mac.command` (Mac). Más detalles en [Cómo instalarlo](#cómo-instalarlo).

## Cómo se juega

1. **Crea tu campeón** (al estilo de League of Legends), en 8 pasos:
   - **Origen e identidad**: ciudad, nombre, género, edad, profesión y barrio.
   - **Clase**: Luchador, Tirador, Inventor, Asesino, Protector o Líder. Cada una tiene su
     propia pasiva.
   - **Habilidades Q, W, E y R**: eliges una por ranura. Dan estadísticas y ventajas en los
     minijuegos o en el chat.
   - **Aptitudes**: repartes 4 puntos (el radar los muestra), eliges una runa clave
     (Encanto, Estudioso, Pies ligeros o Veterano) y un título.
   - **Retrato**: eliges tu retrato de una galería (las imágenes que pongas en la carpeta
     `avatares/`, mejor verticales y estilo Arcane) o subes tu foto.
   - **Familia y aficiones**: familia
     famosa de Arcane (opcional: Kiramman, Talis, Medarda, Ferros, Giopara, la de Vander…).
   - **Ficha final**: tu barra de habilidades P/Q/W/E/R.

   El botón 🎲 Aleatorio lo rellena todo. Todo suma a tus estadísticas
   (🧠 Ingenio, 💬 Carisma, 🔥 Valor, 🌑 Sigilo), y tu build da **ventaja** en los
   minijuegos: más vida, más tiempo o menos objetivos.
2. **Elige Zaun o Piltover**: cada ciudad tiene su propia ruta de 8 capítulos y empiezas
   en el barrio que elegiste.
3. **Explora el mundo abierto**: camina por los dos mapas, cruza el Puente del Progreso,
   visita lugares, habla con la gente y recoge los fragmentos del Códice (hexágonos azules).
4. **Sigue la historia**: el objetivo ★ te dice adónde ir. Al llegar, la escena se juega como
   un chat. Algunas opciones necesitan estadísticas, afinidad o decisiones anteriores.
5. **Minijuegos y entrenamiento**: cada lugar tiene una actividad que sube una estadística una
   vez por capítulo. Muchas son minijuegos: 🥊 pelea en el foso (reflejos), 🏃 carrera por los
   tejados, 🛹 vuelo en aerotabla, 🎯 galería de tiro, 🔧 circuito hextec (puzle), 🔷 runas de la
   Academia (memoria) y 💰 regateo en el mercado. Algunas decisiones de la historia también se
   resuelven jugando, y en el menú de pausa está el **Salón de minijuegos** para practicar.
6. **Conversa**: cada personaje que conoces se desbloquea en el **comunicador**. Puedes
   hablar con ellos por el comunicador o en persona en su lugar del mapa. Cada conversación es
   un árbol de diálogo: eliges qué decir entre varias respuestas (💗 amable, 😏 broma, 🔥 dura,
   ❓ pregunta, 💋 coqueta, 🎭 astuta, 🗡️ seria, 🌑 sigilosa) y el personaje reacciona.
   Lo que dices sube o baja la afinidad, te da estadísticas y activa decisiones de la historia.
   Algunas respuestas piden **Ingenio, Carisma, Valor, Sigilo o afinidad**, y otras solo aparecen
   si tomaste ciertas decisiones antes (o en la Temporada 2). Los temas nuevos se marcan con ✦.
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
| M | Atlas de las Dos Ciudades (Códice) |
| Esc | Pausa / cerrar ventana |
| Espacio | Saltar la escena en curso |
| F11 | Pantalla completa |

### Arte pintado y animado

Todo el arte se genera dentro del juego con un estilo pictórico: retratos pintados que
respiran, parpadean, mueven el pelo y vocalizan al hablar; escenarios animados (niebla de
Zaun, neones que parpadean, polvo dorado de Piltover, portales hextec); cinemáticas de
inicio, de capítulo y de final con movimiento de cámara y narración. En el creador tu
retrato sale de la galería `avatares/` o de tu foto.

**Menús en 3D:** la pantalla de inicio, el menú, los ajustes y el creador tienen una escena
3D animada en tiempo real (three.js): las torres de Piltover, los neones de Zaun, el Puente
del Progreso y un cristal hextec flotante. Si tu tarjeta gráfica no tiene WebGL, se usa el
fondo pintado en 2D.

**Códice con Atlas y mapas:** el Códice (K) tiene tres pestañas: 📖 **Entradas**,
🧭 **Atlas** (M) y 🌐 **Mapas de la Wiki**. El Atlas es el mapa ilustrado de las Dos Ciudades
(basado en el atlas de neta.art) y va dentro del juego, sin internet: 20 lugares de Piltover,
Zaun y Noxus, cada uno con su ficha, sus puntos de interés, quién vive allí (con botón para
hablar) y un 📔 diario de viaje con los lugares que has explorado. La pestaña de la Wiki abre los
mapas interactivos de la [Arcane Wiki](https://arcane.fandom.com/wiki/Special:AllMaps) (necesita
internet; la dirección se cambia en *Ajustes*).

**Imágenes de la Arcane Wiki:** en *Ajustes → Arte personalizado*, el botón «Descargar lo que
falte de la Arcane Wiki» baja la imagen principal de cada personaje y lugar que aún no tenga
imagen tuya. No toca las que ya has puesto.

**Tu propio arte:** en *Ajustes → Arte personalizado* abres cada carpeta. Al arrancar, el
juego crea `GUIA-DE-ARTE.txt` con la lista exacta de nombres de archivo. La estructura es:

```
arte/
├─ avatares/     cualquier-nombre.png…           retratos para TU personaje (galería del creador)
├─ personajes/   jinx.png, vi.jpg, silco.png…    retrato de cuerpo entero (vertical)
├─ caras/        jinx.png…                       cara cuadrada para chats e iconos
├─ lugares/      ultima-gota.jpg…                paisajes 16:9 de cada lugar
├─ codice/       hextec.png, quimtec.png…        imágenes de entradas del Códice
└─ video/        intro-zaun.mp4, intro-piltover.mp4, temporada-2.mp4,
                 capitulo-<id>.mp4, fin-<id>.mp4  (mp4 o webm)
```

En `lugares/` no hace falta el nombre exacto: «La Última Gota.jpg», «the lanes.png» o
«Puente del Progreso.jpg» también valen (da igual tildes, mayúsculas y espacios). En *Ajustes →
Arte personal* ves qué lugares tienen imagen, cuáles faltan y qué archivos no se reconocen. Si
falta un lugar gemelo (los dos lados del puente, Stillwater y su muelle, Piltover y la plaza,
Zaun y el mercado), usa la imagen del otro.

El botón **⬇ Descargar lo que falta de la Arcane Wiki** baja de arcane.fandom.com la imagen
principal de cada personaje (Silco, Vander, Sevika, Isha, Mylo, Claggor…), con la cara
recortada, y de cada lugar que aún no tenga imagen. Solo descarga lo que falta: no toca tus
archivos.

El botón **⬇ Descargar retratos oficiales (Data Dragon)** baja de la web pública de Riot el
cuerpo, la cara y la imagen del Códice de los campeones de LoL que salen en Arcane: Vi,
Jinx, Caitlyn, Jayce, Viktor, Heimerdinger, Ekko, Singed, Ambessa, Mel y Warwick. El juego
elige el aspecto de Arcane cuando existe. Los personajes que no son campeones (Silco,
Vander, Sevika…) los añades tú. Todos estos archivos se quedan en tu ordenador y no se
incluyen en el ejecutable.

### Conversaciones sin IA

Desde la v1.5.0 el juego ya no usa Ollama ni ninguna IA: todas las conversaciones están
escritas a mano en `src/data/chat.js`, con más de 280 respuestas posibles entre 22 personajes.
Funciona sin internet y sin instalar nada aparte.

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
main.js, preload.js      Proceso de Electron: ventana, partidas y ajustes
src/index.html           Interfaz del juego
src/js/world.js          Motor del mundo abierto (mapa, colisiones, cámara, minimapa)
src/js/game.js           Historia, comunicador, ficha, actividades y Códice
src/js/creator.js        Creador de personaje
src/js/audio.js          Música procedural y efectos de sonido
src/js/portrait.js       Retratos ilustrados generados en SVG
src/data/story.js        Capítulos, decisiones y finales
src/data/world.js        Mapas de Piltover y Zaun, lugares, actividades, fragmentos
src/data/chat.js         Árboles de diálogo de cada personaje
src/data/atlas.js        Lugares del Atlas de las Dos Ciudades (imágenes en src/img/atlas)
src/data/wiki.js         Entradas del Códice (personajes, lugares, criaturas, tecnología, mundo)
src/data/creation.js     Opciones del creador de personaje
scripts/check.js         Validador de datos
```

---

Proyecto de fans sin ánimo de lucro. *Arcane* y *League of Legends* son propiedad de Riot Games.
Los retratos y mapas los genera el propio juego y la música se sintetiza en tiempo real.
