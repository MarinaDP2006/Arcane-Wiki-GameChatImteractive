# Grietas & Gears

*Las grietas de Zaun, los gears de Piltover.* Un juego de fans para **Windows**, **Mac** y **Android** ambientado en el mundo de *Arcane*. Creas tu personaje, eliges si vienes de
**Piltover** o de **Zaun**, recorres las dos ciudades y vives la historia hablando con sus personajes.
Lo que decides cambia cómo te tratan y qué final consigues.

## Índice
1. [Qué tiene el juego](#1-qué-tiene-el-juego)
2. [Descargar e instalar](#2-descargar-e-instalar)
3. [Primeros pasos](#3-primeros-pasos)
4. [Controles](#4-controles)
5. [Personajes](#5-personajes)
6. [Imágenes](#6-imágenes)
7. [Dónde se guardan tus partidas](#7-dónde-se-guardan-tus-partidas)
8. [Problemas frecuentes](#8-problemas-frecuentes)
9. [Para programadores](#9-para-programadores)

---

## 1. Qué tiene el juego

| Parte | Qué es |
|---|---|
| **Creador de personaje** | Eliges ciudad, nombre, clase, habilidades, retrato, familia, si tienes padres y quién te atrae. El botón *Aleatorio* lo rellena todo. |
| **Mundo abierto en 3D** | Caminas por Piltover (dorada, al atardecer) y por Zaun (neones, niebla química y cables con bombillas) y cruzas el Puente del Progreso. La imagen lleva resplandor, gradación de color y reflejos para parecerse a la serie. Tu personaje y los de Arcane **andan y corren en 3D**. |
| **Historia** | 8 capítulos por ciudad, un capítulo final con 4 finales y una **Temporada 2** con 3 finales más. |
| **Comunicador** | Chats con los personajes que conoces, con su retrato grande en un marco de latón. Eliges qué decir y ellos reaccionan. *Charlar un rato…* tiene más de 300 respuestas que cambian cada vez. |
| **Relaciones** | Según tu personaje puedes haceros amigos, mejores amigos, pareja (si os atraéis y tienes 18 años o más), hermandad o, si te faltan los padres, conseguir una figura paterna o materna (Vander, Silco, Ambessa, Cassandra, Heimerdinger, Sevika). Cada relación trae saludos y citas propias. |
| **Chat libre con IA** | Opcional y gratis, al estilo de Character AI: en **Ajustes → IA para los chats** eliges Google Gemini, Groq u OpenRouter (con clave gratis) u Ollama en tu PC (sin internet; recomendado `gemma3:4b`, o `gemma3:12b` con tarjeta gráfica). Cada personaje tiene sus propias instrucciones de cómo habla y cómo te trata (`src/data/ai-voices.js`). Luego en el Comunicador pulsas **✦ Libre** y escribes lo que quieras. |
| **Minijuegos** | Cada lugar tiene una actividad que mejora tus estadísticas, con cuenta atrás, chispas, humo, sacudidas y botones táctiles grandes en el móvil (con vibración). |
| **Códice** | Enciclopedia del juego con el **Atlas de las Dos Ciudades** (20 lugares). |
| **Ajustes** | 10 pestañas: gráficos (calidad, resolución, sombras, estilo pintado, brillo, FPS), audio (música y efectos por separado), lectura (velocidad y tamaño del texto), juego (dificultad de los minijuegos, minimapa, flecha del objetivo), controles, accesibilidad (menos movimiento, alto contraste, letra fácil de leer), IA, copias de seguridad y más. |

## 2. Descargar e instalar

### Dónde descargarlo

| Opción | Cómo |
|---|---|
| **Releases** (la más fácil) | Entra en [Releases](https://github.com/MarinaDP2006/grietas-and-gears/releases) y descarga la última versión. |
| **Actions** | Pestaña **Actions** → **Compilar ejecutables** → abre la ejecución más reciente con ✅ → baja hasta **Artifacts**. |

En *Actions* el juego llega dentro de un `.zip`: clic derecho → **Extraer todo…** (en Mac, doble clic).

### Qué archivo elegir

| Tu ordenador | Descarga | Archivo | Qué hace |
|---|---|---|---|
| Windows | `grietas-and-gears-windows` | `Grietas-and-Gears-Setup-….exe` | **Instalador.** Doble clic y *Siguiente* hasta el final. Crea un acceso directo. |
| Windows | `grietas-and-gears-windows` | `Grietas-and-Gears-…-portable.exe` | **Sin instalar.** Doble clic y se abre. Se puede llevar en un USB. |
| Mac | `grietas-and-gears-macos` | `Grietas-and-Gears-….dmg` | Ábrelo y arrastra **Grietas & Gears** a la carpeta **Aplicaciones**. |
| Android | `grietas-and-gears-android` | `Grietas-and-Gears-…-android.apk` (o `…-android-prueba.apk`) | Pásalo al móvil, ábrelo y acepta **Instalar apps de origen desconocido**. |
| Android | `grietas-and-gears-android` | `Grietas-and-Gears-…-google-play.aab`

### La primera vez que lo abres

| Sistema | Aviso | Qué hacer |
|---|---|---|
| Windows | «Windows protegió su PC» | Pulsa **Más información** → **Ejecutar de todas formas**. Es normal: el juego no tiene firma digital. |
| Mac | «No se puede abrir» | Clic derecho sobre la app → **Abrir** → **Abrir**. |
| Mac | Sigue sin abrir | **Ajustes del Sistema** → **Privacidad y seguridad** → **Abrir igualmente**. |
| Mac | «Está dañada» | Abre **Terminal** y escribe `xattr -cr "/Applications/Grietas & Gears.app"` |
| Android | «Por tu seguridad, el teléfono no puede instalar apps desconocidas» | Toca **Ajustes** → activa **Permitir de esta fuente** → vuelve atrás → **Instalar** |

### Desinstalar

| Sistema | Cómo |
|---|---|
| Windows (instalado) | **Configuración** → **Aplicaciones** → **Grietas & Gears** → **Desinstalar** |
| Windows (portable) | Borra el archivo `.exe` |
| Mac | Arrastra **Grietas & Gears** de *Aplicaciones* a la Papelera |
| Android | Mantén pulsado el icono → **Desinstalar** |

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
| **Espacio** | Saltar la escena |
| **Esc** | Pausa o cerrar ventana |
| **F11** | Pantalla completa |

**En el móvil (Android)** el juego se pone en horizontal y a pantalla completa:

| Gesto | Acción |
|---|---|
| Joystick (abajo a la izquierda) | Moverse. Empújalo hasta el borde para correr. |
| Tocar el mapa | Ir a ese punto |
| Botón ✦ (abajo a la derecha) | Hablar, entrar o usar. Brilla cuando hay algo cerca. |
| Pellizcar con dos dedos | Acercar o alejar la cámara |
| Girar dos dedos | Girar la cámara |
| Botones de abajo | Historia, comunicador, ficha, Códice, Atlas y pausa |
| Botón «atrás» del móvil | Cerrar ventana o pausa |

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

### Personajes en 3D

En el mapa 3D tu personaje y los de Arcane **caminan y corren** (con **Mayús** o empujando el joystick hasta el borde).
Cada uno lleva su pelo, su ropa, su cara pintada y sus marcas: el tatuaje de Vi, las pecas de Jinx, la cicatriz de Silco,
el brazo de metal de Sevika, el sombrero de Caitlyn… Los de Arcane te miran cuando te acercas.
Si el móvil va lento, se pueden quitar en **Ajustes → Mundo 3D** (vuelven los iconos redondos).

**¿Quieres modelos de verdad, por ejemplo de [Mixamo](https://www.mixamo.com) (gratis)?** Ponlos en la carpeta `modelos` de tu carpeta de arte
(en Ajustes → Arte personal hay un botón para abrirla) o en `src/models` para que vayan dentro del juego y de la app de Android:

| Archivo | Para quién |
|---|---|
| `modelos/vi.glb`, `modelos/jinx.glb`… | Cada personaje (mismos nombres que en la guía de arte) |
| `modelos/jugador.glb` | Tu personaje |
| `modelos/generico.glb` | Quien no tenga modelo propio |
| `modelos/animaciones/reposo.glb`, `andar.glb`, `correr.glb` | Animaciones para todos (Mixamo, marcando **In Place**) |

En el ordenador también valen **`.fbx`** y **`.zip`** tal cual los descargas (el `.zip` con el `.fbx` y sus texturas dentro), y el nombre puede llevar más palabras: `Vi_Arcane.zip` es Vi. El juego también mira las carpetas de `personajes` con «3d» en el nombre (por ejemplo `personajes/3d models`). Si el modelo no tiene huesos, se mueve entero con un balanceo al andar; para que ande de verdad, pásalo por [Mixamo](https://www.mixamo.com). Para la app de Android hace falta `.glb`: abre el modelo en [Blender](https://www.blender.org) (gratis) y expórtalo como **glTF binario (.glb)**.
Si un modelo ya trae sus propias animaciones llamadas *idle*, *walk* o *run*, se usan esas.

## 6. Imágenes

**Ya vienen dentro del juego**, no hace falta copiar nada: las caras y las imágenes de cuerpo entero de los personajes,
los 16 retratos para elegir, las fotos de los lugares y los fondos del mapa 3D de Piltover y Zaun.
El juego **no necesita internet**: no descarga nada (solo el chat libre con IA, si lo activas con un servicio en línea).

El juego ya no usa vídeos: las escenas de inicio son cinemáticas pintadas que se saltan con **Espacio**, **Esc**, **Intro** o tocando la pantalla.

**¿Quieres usar tus propias imágenes en el ordenador?** Ponlas en esta carpeta y sustituyen a las incluidas:

| Sistema | Carpeta |
|---|---|
| Windows | `%APPDATA%\Arcane Piltover y Zaun\arte` (escríbelo en la barra del Explorador) |
| Mac | `~/Library/Application Support/Arcane Piltover y Zaun/arte` |

## 7. Dónde se guardan tus partidas

| Sistema | Carpeta |
|---|---|
| Windows | `%APPDATA%\Arcane Piltover y Zaun\partidas` |
| Mac | `~/Library/Application Support/Arcane Piltover y Zaun/partidas` |
| Android | Dentro de la app. Si la desinstalas, se borran. |

Si reinstalas el juego, tus partidas siguen ahí. La carpeta conserva el nombre antiguo a propósito, para no perder nada al actualizar.

## 8. Problemas frecuentes

| Problema | Solución |
|---|---|
| El mapa sale en 2D y no en 3D | Tu tarjeta gráfica no tiene WebGL. El juego funciona igual en 2D. Actualizar los drivers suele arreglarlo. |
| En el móvil el mapa va lento | Cierra otras apps. En móviles antiguos el mapa pasa solo a 2D. |
| El mapa 3D va a tirones | **Ajustes → Gráficos**: baja la calidad o la resolución del mundo 3D. |

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
| `npm run android:sync` | Copia el juego al proyecto de Android (carpeta `android/`) |
| `npm run android:open` | Abre el proyecto en Android Studio para probarlo en tu móvil o en el emulador |

Los instaladores salen en la carpeta `dist/`. El APK de Android lo crea GitHub Actions (trabajo **android**), o Android Studio con **Build → Build App Bundle(s) / APK(s)**.

**Publicar una versión:** en GitHub ve a **Releases** → **Draft a new release**, pon una etiqueta nueva
(por ejemplo `v2.0.0`) y pulsa **Publish release**. GitHub crea los instaladores y los añade solo.

### Idiomas (español, inglés y francés)

El juego está escrito en español. En **Ajustes → Idioma** puedes cambiarlo a inglés o francés; la partida se guarda y el juego se recarga en el idioma elegido. La primera vez se elige solo según el idioma del ordenador o del móvil.

| Archivo | Qué contiene |
|---|---|
| `src/js/i18n.js` | Traduce la pantalla al vuelo usando los diccionarios |
| `src/i18n/en.js`, `src/i18n/fr.js` | Diccionarios: texto en español → traducción |
| `scripts/i18n-extract.js` | Saca todos los textos del juego a `i18n/textos.tsv` |
| `scripts/i18n-build.js` | Junta las traducciones (`id ⇥ inglés ⇥ francés`) en los diccionarios |

Si añades textos nuevos: `node scripts/i18n-extract.js`, traduce las líneas que falten en un `.tsv` y ejecuta `node scripts/i18n-build.js <carpeta-con-los-tsv>`. Lo que no esté traducido se ve en español.

### Archivos del proyecto

| Archivo | Qué contiene |
|---|---|
| `main.js`, `preload.js` | La ventana del juego, las partidas y los ajustes |
| `capacitor.config.json`, `android/` | La app de Android (Capacitor) |
| `src/js/mobile.js`, `src/css/mobile.css` | Joystick, botones táctiles y pantallas adaptadas al móvil |
| `store/` | Icono y gráfico para la ficha de Google Play |
| `src/index.html` | La pantalla del juego |
| `src/js/world.js` | El mundo abierto: mapa, movimiento y cámara |
| `src/js/world3d.js` | Las ciudades en 3D y su posprocesado (resplandor, color, viñeta) |
| `src/js/avatars3d.js` | Los personajes en 3D: muñecos pintados con animación de andar y correr, o modelos `.glb` de Mixamo |
| `src/models/` | Modelos 3D incluidos con el juego (opcional, ver «Personajes en 3D») |
| `src/vendor/three-gltf.js` | El lector de modelos `.glb` de Three.js |
| `src/vendor/three-fbx.js` | El lector de modelos `.fbx` y `.zip` de Three.js |
| `src/data/ai-voices.js` | Cómo habla cada personaje y cómo te trata en el chat con IA |
| `src/js/minigames.js` | Los 7 minijuegos y sus efectos (partículas, sacudidas, cuenta atrás) |
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
| `src/data/arte.js` | Lista del arte incluido (se genera con `node scripts/art-manifest.js`) |
| `scripts/check.js` | El revisor de `npm run check` |

---

## Aviso legal
Este juego se creó según la política [«Legal Jibber Jabber»](https://www.riotgames.com/en/legal) de Riot Games usando recursos propiedad de Riot Games.

Riot Games no respalda ni patrocina este proyecto. Arcane y League of Legends son marcas de Riot Games, Inc.

[Política de privacidad](PRIVACIDAD.md): el juego no recoge ningún dato.
