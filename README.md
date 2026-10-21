# Arcane: Piltover y Zaun

Un juego para **Windows** y **Mac** ambientado en *Arcane*. Creas tu personaje, eliges si vienes de
**Piltover** o de **Zaun**, recorres las dos ciudades y vives la historia hablando con sus personajes.
Lo que decides cambia cómo te tratan y qué final consigues.

## Índice
1. [Qué tiene el juego](#1-qué-tiene-el-juego)
2. [Descargar e instalar](#2-descargar-e-instalar)
3. [Primeros pasos](#3-primeros-pasos)
4. [Controles](#4-controles)
5. [Personajes](#5-personajes)
6. [Vídeos](#6-vídeos)
7. [Dónde se guardan tus partidas](#7-dónde-se-guardan-tus-partidas)
8. [Problemas frecuentes](#8-problemas-frecuentes)
9. [Para programadores](#9-para-programadores)

---

## 1. Qué tiene el juego

| Parte | Qué es |
|---|---|
| **Creador de personaje** | Eliges ciudad, nombre, clase, habilidades, retrato y familia. El botón *Aleatorio* lo rellena todo. |
| **Mundo abierto en 3D** | Caminas por Piltover y por Zaun y cruzas el Puente del Progreso. |
| **Historia** | 8 capítulos por ciudad, un capítulo final con 4 finales y una **Temporada 2** con 3 finales más. |
| **Comunicador** | Chats con los personajes que conoces. Eliges qué decir y ellos reaccionan. |
| **Minijuegos** | Cada lugar tiene una actividad que mejora tus estadísticas. |
| **Códice** | Enciclopedia del juego con el **Atlas de las Dos Ciudades** (20 lugares) y los mapas de la Arcane Wiki. |

## 2. Descargar e instalar

### Dónde descargarlo

| Opción | Cómo |
|---|---|
| **Releases** (la más fácil) | Entra en [Releases](https://github.com/MarinaDP2006/Arcane-Wiki-GameChatImteractive/releases) y descarga la última versión. |
| **Actions** | Pestaña **Actions** → **Compilar ejecutables** → abre la ejecución más reciente con ✅ → baja hasta **Artifacts**. |

En *Actions* el juego llega dentro de un `.zip`: clic derecho → **Extraer todo…** (en Mac, doble clic).

### Qué archivo elegir

| Tu ordenador | Descarga | Archivo | Qué hace |
|---|---|---|---|
| Windows | `arcane-windows` | `Arcane-Setup-….exe` | **Instalador.** Doble clic y *Siguiente* hasta el final. Crea un acceso directo. |
| Windows | `arcane-windows` | `Arcane-…-portable.exe` | **Sin instalar.** Doble clic y se abre. Se puede llevar en un USB. |
| Mac | `arcane-macos` | `Arcane-….dmg` | Ábrelo y arrastra **Arcane** a la carpeta **Aplicaciones**. |

### La primera vez que lo abres

| Sistema | Aviso | Qué hacer |
|---|---|---|
| Windows | «Windows protegió su PC» | Pulsa **Más información** → **Ejecutar de todas formas**. Es normal: el juego no tiene firma digital. |
| Mac | «No se puede abrir» | Clic derecho sobre la app → **Abrir** → **Abrir**. |
| Mac | Sigue sin abrir | **Ajustes del Sistema** → **Privacidad y seguridad** → **Abrir igualmente**. |
| Mac | «Está dañada» | Abre **Terminal** y escribe `xattr -cr /Applications/Arcane.app` |

### Desinstalar

| Sistema | Cómo |
|---|---|
| Windows (instalado) | **Configuración** → **Aplicaciones** → **Arcane** → **Desinstalar** |
| Windows (portable) | Borra el archivo `.exe` |
| Mac | Arrastra **Arcane** de *Aplicaciones* a la Papelera |

## 3. Primeros pasos

| Paso | Qué hacer |
|---|---|
| 1 | En el menú principal pulsa **✦ Nueva partida**. |
| 2 | Elige **Zaun** o **Piltover** y crea tu personaje. |
| 3 | En el mapa, ve al lugar marcado con **★ OBJETIVO** y pulsa **E** para empezar el capítulo. |
| 4 | Habla con los personajes con **C**. Algunas respuestas solo salen si tienes suficiente Ingenio, Carisma, Valor, Sigilo o amistad. Los temas nuevos llevan ✦. |
| 5 | Al terminar la Temporada 1 se desbloquea la **Temporada 2** (avisa antes porque tiene spoilers). |

## 4. Controles

| Tecla | Acción |
|---|---|
| **W A S D** o flechas | Moverse (con **Mayús** corres) |
| Clic en el mapa | Ir a ese punto |
| Rueda del ratón o **+ / −** | Acercar o alejar la cámara |
| **Q / R** o botón derecho arrastrando | Girar la cámara |
| **E** o **Intro** | Hablar, entrar o usar |
| **1 – 9** | Elegir una respuesta |
| **H** | Historia |
| **C** | Comunicador (chats) |
| **F** | Ficha de tu personaje |
| **K** | Códice |
| **M** | Atlas de las Dos Ciudades |
| **Espacio** | Saltar la escena o el vídeo |
| **Esc** | Pausa o cerrar ventana |
| **F11** | Pantalla completa |

## 5. Personajes

Estos son los 16 personajes que hablan en la historia y en el comunicador.

| Zaun | Piltover | Otros |
|---|---|---|
| Vi | Caitlyn | Ambessa |
| Jinx | Jayce | Mel |
| Vander | Viktor | Isha |
| Silco | Heimerdinger | Maddie |
| Ekko | Cassandra | Kino |
| Sevika | | |

## 6. Vídeos

El juego trae cinemáticas animadas propias. Si quieres ver **tus vídeos** en su lugar, cópialos aquí:

| Sistema | Carpeta |
|---|---|
| Windows | `C:\Users\TU-USUARIO\AppData\Roaming\Arcane Piltover y Zaun\arte\video` |
| Mac | `~/Library/Application Support/Arcane Piltover y Zaun/arte/video` |

> En Windows puedes llegar rápido escribiendo `%APPDATA%\Arcane Piltover y Zaun\arte\video` en la barra del Explorador.

| Vídeo que copiar | Cuándo sale |
|---|---|
| `Welcome to Zaun.mp4` | Al empezar una partida en Zaun |
| `Welcome to Piltover.mp4` | Al empezar una partida en Piltover |
| `IntroS1.mp4` | Al empezar el capítulo 1 de la Temporada 1 |
| `IntroS2.mp4` | Al empezar la Temporada 2 |

- Valen archivos `.mp4` o `.webm`. Mayúsculas y espacios dan igual.
- Cierra y vuelve a abrir el juego después de copiarlos.
- Todos se saltan con **Espacio**, **Esc** o **Intro**.

## 7. Dónde se guardan tus partidas

| Sistema | Carpeta |
|---|---|
| Windows | `%APPDATA%\Arcane Piltover y Zaun\partidas` |
| Mac | `~/Library/Application Support/Arcane Piltover y Zaun/partidas` |

Si reinstalas el juego, tus partidas siguen ahí.

## 8. Problemas frecuentes

| Problema | Solución |
|---|---|
| El mapa sale en 2D y no en 3D | Tu tarjeta gráfica no tiene WebGL. El juego funciona igual en 2D. Actualizar los drivers suele arreglarlo. |
| No sale mi vídeo | Revisa que esté en la carpeta `video` de la sección 6, con el nombre de la tabla, y reinicia el juego. |
| La pestaña de mapas de la Wiki está en blanco | Necesita internet. La dirección se cambia en **Ajustes**. |

---

## 9. Para programadores

### Jugar desde el código

| Paso | Qué hacer |
|---|---|
| 1 | Instala [Node.js](https://nodejs.org) (versión 20 o superior). |
| 2 | En GitHub pulsa **Code** → **Download ZIP** y descomprímelo. |
| 3 | Doble clic en `jugar-windows.bat` (Windows) o `jugar-mac.command` (Mac). La primera vez tarda unos minutos. |

En Mac, si `jugar-mac.command` no tiene permisos, abre Terminal en la carpeta y escribe `chmod +x jugar-mac.command`.

### Comandos

| Comando | Qué hace |
|---|---|
| `npm install` | Descarga lo necesario |
| `npm start` | Abre el juego |
| `npm run check` | Revisa que la historia, los mapas y los diálogos estén bien |
| `npm run dist:win` | Crea el instalador de Windows (hazlo en Windows) |
| `npm run dist:mac` | Crea el `.dmg` de Mac (hazlo en un Mac) |

Los instaladores salen en la carpeta `dist/`.

**Publicar una versión:** en GitHub ve a **Releases** → **Draft a new release**, pon una etiqueta nueva
(por ejemplo `v2.0.0`) y pulsa **Publish release**. GitHub crea los instaladores y los añade solo.

### Archivos del proyecto

| Archivo | Qué contiene |
|---|---|
| `main.js`, `preload.js` | La ventana del juego, las partidas y los ajustes |
| `src/index.html` | La pantalla del juego |
| `src/js/world.js` | El mundo abierto: mapa, movimiento y cámara |
| `src/js/world3d.js` | Las ciudades en 3D |
| `src/js/game.js` | Historia, comunicador, ficha, actividades y Códice |
| `src/js/creator.js` | El creador de personaje |
| `src/js/audio.js` | Música y efectos de sonido |
| `src/js/portrait.js` | Retratos dibujados |
| `src/data/story.js` | Capítulos, decisiones y finales |
| `src/data/world.js` | Mapas, lugares y actividades |
| `src/data/chat.js` | Conversaciones de cada personaje |
| `src/data/atlas.js` | Lugares del Atlas |
| `src/data/wiki.js` | Entradas del Códice |
| `src/data/creation.js` | Opciones del creador de personaje |
| `scripts/check.js` | El revisor de `npm run check` |
