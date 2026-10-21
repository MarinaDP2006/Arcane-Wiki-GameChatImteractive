# Arcane: Piltover y Zaun

Juego de escritorio para **Windows** y **macOS** ambientado en el mundo de *Arcane*: **historia interactiva + conversaciones con opciones + mundo abierto** de Piltover y Zaun. Creas tu personaje, eliges de qué lado del puente vienes y recorres las dos ciudades.
Lo que decides cambia a quién conoces, cómo te tratan y qué final consigues.

##  Instalación paso a paso (guía rápida)
### Paso 1 · Descarga el juego
1. Entra en el repositorio: https://github.com/MarinaDP2006/Arcane-Wiki-GameChatImteractive
2. Arriba, pulsa la pestaña **Actions**.
3. En la lista de la izquierda pulsa **Compilar ejecutables**.
4. Abre la ejecución más reciente que tenga un **verde** (la primera de la lista).
5. Baja hasta el final de la página, al apartado **Artifacts**, y descarga:
   - **`arcane-windows`** si tienes un PC con Windows.
   - **`arcane-macos`** si tienes un Mac.
   *(Si existe una versión en **Releases**, también puedes descargar el instalador desde ahí.)*
6. Se descarga un archivo `.zip`. Haz clic derecho sobre él → **Extraer todo…** (Windows) o doble
   clic (Mac) para descomprimirlo.

### Paso 2 · Instálalo
**Windows**
1. Dentro de la carpeta descomprimida verás dos archivos `.exe`:
   - **`Arcane Piltover y Zaun Setup …exe`** → el instalador. Doble clic, pulsa *Siguiente* hasta
     el final y se creará un acceso directo en el escritorio.
   - **`Arcane Piltover y Zaun-…-portable.exe`** → sin instalar. Doble clic y se abre el juego.
2. Si aparece la ventana azul **«Windows protegió su PC»**, pulsa **Más información** y después
   **Ejecutar de todas formas**. (Pasa porque el juego no tiene firma digital; es normal.)

**Mac**
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
   No necesitas instalar nada más.

> ¿Prefieres ejecutarlo desde el código? Instala [Node.js](https://nodejs.org), descarga el proyecto
> con **Code → Download ZIP**, descomprímelo y haz doble clic en `jugar-windows.bat` (Windows) o
> `jugar-mac.command` (Mac). Más detalles en [Cómo instalarlo](#cómo-instalarlo).

## Novedades de la v1.7.0

- **Menú principal nuevo:** ilustraciones pintadas de Piltover y Zaun que se funden entre sí, el título
  ARCANE y el menú a la izquierda. Sin subtítulo ni texto al pie.
- **Vídeos en su momento:** *Welcome to Zaun* o *Welcome to Piltover* al terminar de crear tu personaje
  (según tu ciudad), *IntroS1* cuando empieza la historia de la Temporada 1 e *IntroS2* al empezar la
  Temporada 2.
- **Mundo abierto:** en las calles solo están los personajes de Arcane (con su avatar de chat), sin
  habitantes genéricos. Cada lugar se ve con su imagen enmarcada, los fragmentos del Códice son cristales
  hextec y las farolas son hextec en Piltover y de quimtec en Zaun.
- **Imágenes de la Arcane Wiki, no de Riot:** se quita la descarga de Data Dragon. Los retratos de Riot que
  bajaron versiones anteriores se apartan solos a `arte\_riot-retirado` (no se borran).
- **Historia:** en las escenas solo salen los avatares de chat de cada personaje, nunca retratos generados.

## Novedades de la v1.6.0

- **Avatares por género:** 8 retratos de mujer y 8 de hombre en el creador.
- **16 personajes de Arcane** con su retrato; los secundarios ya no son personajes.
- **Atlas interactivo** con el mapa de Piltover y Zaun y los símbolos de cada ciudad.

## Cómo se juega
1. **Crea tu campeón** (al estilo de League of Legends), en 8 pasos:
   - **Origen e identidad**: ciudad, nombre, género, edad, profesión y barrio.
   - **Clase**: Luchador, Tirador, Inventor, Asesino, Protector o Líder. Cada una tiene su
     propia pasiva.
   - **Habilidades Q, W, E y R**: eliges una por ranura. Dan estadísticas y ventajas en los
     minijuegos o en el chat.
   - **Aptitudes**: repartes 4 puntos (el radar los muestra), eliges una runa clave
     (Encanto, Estudioso, Pies ligeros o Veterano) y un título.
   - **Retrato**: eliges entre 8 retratos de mujer o 8 de hombre, según el género del paso 1
     (con «No binario» salen los 16), o subes tu foto.
   - **Familia y aficiones**: familia
     famosa de Arcane (opcional: Kiramman, Talis, Medarda, Ferros, Giopara, la de Vander…).
   - **Ficha final**: tu barra de habilidades P/Q/W/E/R.

   El botón Aleatorio lo rellena todo. Todo suma a tus estadísticas, y tu build da **ventaja** en los
   minijuegos: más vida, más tiempo o menos objetivos.
2. **Elige Zaun o Piltover**: cada ciudad tiene su propia ruta de 8 capítulos y empiezas
   en el barrio que elegiste.
3. **Explora el mundo abierto**: camina por los dos mapas, cruza el Puente del Progreso,
   visita lugares, habla con los personajes y recoge los fragmentos del Códice (cristales hextec).
4. **Sigue la historia**: el objetivo ★ te dice adónde ir. Al llegar, la escena se juega como
   un chat. Algunas opciones necesitan estadísticas, afinidad o decisiones anteriores.
5. **Minijuegos y entrenamiento**: cada lugar tiene una actividad que sube una estadística una
   vez por capítulo. Muchas son minijuegos. Algunas decisiones de la historia también se
   resuelven jugando, y en el menú de pausa está el **Salón de minijuegos** para practicar.
6. **Conversa**: cada personaje que conoces se desbloquea en el **comunicador**. Puedes
   hablar con ellos por el comunicador o en persona en su lugar del mapa. Cada conversación es
   un árbol de diálogo: eliges qué decir entre varias respuestas (amable, broma, dura,
   pregunta, coqueta, astuta, seria, sigilosa) y el personaje reacciona.
   Lo que dices sube o baja la afinidad, te da estadísticas y activa decisiones de la historia.
   Algunas respuestas piden **Ingenio, Carisma, Valor, Sigilo o afinidad**, y otras solo aparecen
   si tomaste ciertas decisiones antes (o en la Temporada 2). Los temas nuevos se marcan con ✦.
7. **Consigue los finales**: el capítulo final en el Puente tiene 4 desenlaces distintos.
8. **Temporada 2**: al terminar la primera temporada se desbloquea la segunda, que continúa tu
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

### Menús y Códice

**Menús en 3D:** el menú de partidas, los ajustes y el creador tienen una escena
3D animada en tiempo real (three.js): las torres de Piltover, los neones de Zaun, el Puente
del Progreso y un cristal hextec flotante. Si tu tarjeta gráfica no tiene WebGL, se usa el
fondo pintado en 2D.

**Códice con Atlas y mapas:** el Códice (K) tiene tres pestañas: **Entradas**,
**Atlas** (M) y **Mapas de la Wiki**. El Atlas usa el mapa de Piltover y Zaun de Charles Lee y va
dentro del juego, sin internet: 20 lugares marcados en el mapa, cada uno con su foto, su ficha,
sus puntos de interés, quién vive allí (con botón para hablar) y un diario de viaje con los
lugares explorados. A la izquierda está el símbolo de Piltover y a la derecha el de Zaun:
púlsalos para ver todos los lugares de cada ciudad. La pestaña de la Wiki abre los
mapas interactivos de la [Arcane Wiki](https://arcane.fandom.com/wiki/Special:AllMaps) (necesita
internet; la dirección se cambia en *Ajustes*).

### Conversaciones sin IA

Desde la v1.5.0 el juego ya no usa Ollama ni ninguna IA: todas las conversaciones están
escritas a mano en `src/data/chat.js`, con casi 250 respuestas posibles entre 16 personajes.
Funciona sin internet y sin instalar nada aparte.

## Cómo instalarlo
Hay dos formas: **descargar el juego ya compilado** (recomendado, no hace falta instalar nada más)
o **ejecutarlo desde el código**.

**Dónde se descarga el juego compilado:**
- En **Releases** (https://github.com/MarinaDP2006/Arcane-Wiki-GameChatImteractive/releases), si hay
  alguna versión publicada.
- O en **Actions → Compilar ejecutables**: abre la ejecución más reciente con y baja hasta
  **Artifacts**. GitHub entrega los artifacts dentro de un `.zip`, así que primero hay que
  descomprimirlo.

### En PC (Windows 10 / 11)
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

Tus partidas se guardan en `%APPDATA%\Arcane Piltover y Zaun\partidas`.

### En Mac (macOS 11 o superior, Intel y Apple Silicon)
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

Tus partidas se guardan en `~/Library/Application Support/Arcane Piltover y Zaun/partidas`.

### Compilar tus propios ejecutables
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
src/data/atlas.js        Lugares del Atlas de las Dos Ciudades
src/data/wiki.js         Entradas del Códice (personajes, lugares, criaturas, tecnología, mundo)
src/data/creation.js     Opciones del creador de personaje
scripts/check.js         Validador de datos
```

---


## Arte y vídeos (v1.6.0)

Las imágenes vienen dentro del juego: 16 retratos para elegir (8 de mujer y 8 de hombre, según el género
que elijas), las caras de los 16 personajes, las fotos de los lugares, el mapa de Piltover y Zaun del
Códice y los símbolos de cada ciudad. Si pones un archivo con el mismo nombre en tu carpeta de arte
(`%APPDATA%\Arcane Piltover y Zaun\arte`), el tuyo sustituye al incluido.

Los vídeos no se incluyen (pesan mucho). Copia estos cuatro en la carpeta `arte\video` de
`%APPDATA%\Arcane Piltover y Zaun\` o en una carpeta `arte\video` junto al `.exe` del juego:

| Archivo | Cuándo se reproduce |
|---|---|
| `Welcome to Zaun.mp4` | Al empezar con origen en Zaun |
| `Welcome to Piltover.mp4` | Al empezar con origen en Piltover |
| `IntroS1.mp4` | Al empezar el primer capítulo de la Temporada 1 |
| `IntroS2.mp4` | Al empezar la Temporada 2 |

Se pueden saltar con Esc, espacio o Intro.
