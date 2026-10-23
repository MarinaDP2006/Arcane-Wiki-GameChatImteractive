# Grietas & Gears
Juego narrativo de fans ambientado en Piltover y Zaun e inspirado en la estética de *Arcane*. Crea tu personaje, explora sus distritos, habla con el reparto y toma decisiones que cambian tus relaciones y los finales.

**Web promocional:** https://grietas-and-gears-5saz.onrender.com/

**Web oficial (Render):** https://grietas-and-gears-5saz.onrender.com/ · [Guía de despliegue](GUIA-WEB-RENDER.md) · [Capturas históricas](capturasjuego/README.md).

La web estática se genera con `node scripts/build-web.js` y se publica desde `web-dist` en Render; las descargas del juego se distribuyen por GitHub Releases, no por Render.

## Descargar
Entra en **[Releases](https://github.com/MarinaDP2006/grietas-and-gears/releases)** y elige:

- **Windows** · `Grietas-and-Gears-Setup-VERSION.exe` (instalador con acceso directo) o `Grietas-and-Gears-VERSION-portable.exe` (sin instalar).
- **Mac** · `Grietas-and-Gears-VERSION-mac-arm64.dmg` (Apple Silicon, M1 en adelante) o `…-mac-x64.dmg` (Intel). No lleva firma de Apple: la primera vez ábrelo con clic derecho → **Abrir**.
- **Android (móvil y tableta)** · `grietas-and-gears-VERSION-tablet.apk`.

Si aún no hay una versión publicada, abre [Actions](https://github.com/MarinaDP2006/grietas-and-gears/actions) → **Compilar escritorio (Windows y Mac)** o **Compilar móvil (Android)** → ejecución correcta → artefacto `grietas-and-gears-windows`, `-mac` o `-android`. Extrae el ZIP antes de usar el archivo.

**Importante:** la primera instalación puede mostrar un aviso de Windows SmartScreen si la aplicación no tiene firma digital. Descarga únicamente desde este repositorio y verifica el origen.

## Modelos personales de tus seis personajes
El juego acepta modelos `.zip`, `.fbx`, `.obj` y `.glb` con texturas (los ZIP pueden llevar otro ZIP dentro). Los prepara una sola vez en la caché `arte\modelos\_cache` de tu carpeta de datos, sin tocar los originales. Los archivos `.blend` hay que exportarlos antes a `.glb` desde Blender. Puedes dejarlos quietos y con sus colores en **Ajustes → Gráficos → NPC quietos y a color**; tu personaje mantiene su movimiento. Copia los ZIP en la carpeta que abre **Ajustes → Arte personal → modelos** y ponles nombres reconocibles: `vi.zip`, `jinx.zip`, `caitlyn.zip`, etc. No hay que subir tus ZIP privados a GitHub.

**[Guía paso a paso para los seis ZIP y pruebas Windows](GUIA-MODELOS-3D-Y-PRUEBAS.md)**.

## Nueva campaña en dos partes y conversaciones inmersivas
La historia se presenta ahora en **Parte I · El inicio** y **Parte II · Las consecuencias**, y permite alterar destinos de personajes importantes mediante decisiones: rescates de Silco, Cassandra, Isha, Jinx y Jayce/Viktor, con un final alternativo. Se han añadido seis capítulos con decisiones del protagonista, conservando las rutas y escenas existentes y los identificadores de guardado para no perder partidas anteriores. El comunicador incorpora nuevos temas escritos que recuerdan tus decisiones, incluso si la IA está desactivada.

**Conversaciones sin fin:** cada uno de los 16 personajes tiene un tema «Hablemos sin prisa» con tres hilos que se ramifican. Cada respuesta del personaje abre nuevas opciones, los hilos se enlazan entre sí y al volver a un punto ya visitado el personaje dice algo distinto, así que la charla no se acaba hasta que eliges «Cambiar de tema» o «Hasta luego», que ahora están disponibles en cualquier momento. Los diálogos están en español, inglés y francés; se escriben en `scripts/chat-deep/` y se generan con `node scripts/chat-deep/gen.js`.

El chat libre usa biografías, motivaciones y contradicciones de los 16 personajes, así como la información del personaje creado, los acontecimientos recientes de la partida y el historial del chat. El prompt principal se construye en `src/js/ai.js`, función `systemPrompt(G, id)`. Para ajustarlo consulta **[Guía de IA y campaña](GUIA-IA-Y-CAMPANA.md)**. Para usar tu tarjeta gráfica con LM Studio, también desde la tablet o el móvil de casa, sigue la **[Guía de LM Studio](GUIA-LM-STUDIO.md)**.

La respuesta final también depende de la calidad del modelo local de Ollama. La ampliación de historia se ha validado estructuralmente, pero sigue necesitando una partida completa de prueba en Windows.

## Qué incluye
- Personaje personalizable y origen de Piltover o Zaun.
- Exploración con calles y escenarios 3D, cámara con seguimiento, colisiones y un mapa 2D de respaldo.
- Iluminación, niebla ambiental, partículas y posprocesado con un acabado pictórico cinematográfico.
- Diálogos, decisiones, misiones, afinidad con personajes y varios finales.
- Atlas y códice, actividades y 10 minijuegos con profundidad: fondos con el arte real de cada lugar (T1 y T2) que cambian en cada partida, paralaje, niebla y suelo en perspectiva. Pelea en el foso, tejados, aerotabla, galería de tiro, circuito hextec, runas, regateo, y los nuevos: persecución en aerodeslizador (carretera en 3D), la mira de Caitlyn y los chompers de Jinx. Se juegan con teclado, ratón o botones táctiles en tableta.
- Sistema de guardado, opciones gráficas y audio; chat libre con IA opcional.

La estética está inspirada en la serie. No se incluyen ni se prometen modelos o fotogramas oficiales de *Arcane*.

## Guardado de partidas
Se mantienen en `%APPDATA%\\Arcane Piltover y Zaun\\partidas`, incluso tras actualizar o reinstalar el juego. No borres esa carpeta si deseas conservar tus partidas.

## Llevar tu partida de la tableta al PC (o al revés)
En Android las partidas se guardan dentro de la propia app (no en una carpeta visible), así que no se comparten solas con Windows. Para moverlas:

1. En **Partidas**, pulsa **Exportar** en la ranura. En Android se abre el menú Compartir: guárdala en Drive, envíatela por correo o usa «Guardar en Archivos». En Windows eliges dónde guardar el archivo `grietas-partida-….json`.
2. En el otro dispositivo, pulsa **Importar** en una ranura y elige ese archivo. También vale una `ranura-N.json` copiada de `%APPDATA%\Arcane Piltover y Zaun\partidas`.

Las partidas exportadas son tuyas: no las subas al repositorio.

Desde la versión 1.24.0 el APK de prueba se firma siempre con la misma llave, así que las nuevas versiones se instalan encima de la anterior sin perder las partidas de la tableta. 

Guía completa (incluido cómo rescatar la partida de un APK antiguo): [partidas-guardadas-guia.md](partidas-guardadas-guia.md).

## Recuperar una partida
Cada ranura tiene una copia anterior `ranura-N.json.bak` en `%APPDATA%\Arcane Piltover y Zaun\partidas`. Si el archivo principal se daña, el juego carga la copia automáticamente. Para volver a una copia a mano: cierra el juego, copia antes la carpeta `partidas` a otro sitio, y renombra `ranura-N.json.bak` como `ranura-N.json`.

## Ejecutar desde VS Code
1. Abre la carpeta del proyecto en VS Code (Archivo → Abrir carpeta).
2. Abre una terminal (Terminal → Nuevo terminal) y escribe `npm ci` la primera vez.
3. Escribe `npm start` para jugar, o haz doble clic en `PROBAR-JUEGO-WINDOWS.bat` desde el Explorador.
4. Para crear el instalador y el portable, haz doble clic en `CREAR-EXE-WINDOWS.bat`; los archivos quedan en `dist`.

Para probar sin tocar tus partidas reales, antes de `npm start` escribe en PowerShell `$env:GRIETAS_DATOS="C:\ruta\a\carpeta-de-prueba"`.

## Desarrollo (Windows)
Instala Node.js y ejecuta desde el repositorio:
```powershell
npm ci
npm run check
npm start
```

Para crear el instalador y el ejecutable portable:
```powershell
npm run dist:win
```

Los archivos resultantes quedan en `dist/`. El workflow de GitHub Actions ejecuta `npm ci`, valida los datos, comprueba la sintaxis del motor, diálogos, avatares y ajustes, y exige los dos ejecutables antes de publicar el artefacto. No es una prueba de uso en todos los equipos: conviene verificar instalación, arranque, movimientos, diálogos y carga/guardado en un Windows real.

## Ramas y compilaciones
| Rama | Para qué sirve | Qué compila |
|---|---|---|
| `main` | Todo el código del juego. Cualquier cambio se hace aquí (con un pull request). | Solo comprobaciones y la web |
| `escritorio` | Versión de PC. Se actualiza sola desde `main`. | Windows (instalador + portable) y Mac (DMG + ZIP) |
| `movil` | Versión de móvil y tableta. Se actualiza sola desde `main`. | APK de Android (y AAB firmado si hay llave) |

Cada vez que algo entra en `main`, el workflow **Sincronizar ramas de plataforma** fusiona `main` en `escritorio` y `movil` y lanza sus compilaciones. Así no se programa nada dos veces: el juego es el mismo y las ramas solo deciden qué se empaqueta. Lo que es solo de móvil (controles táctiles, `src/js/mobile.js`) o solo de PC (`main.js`) también vive en `main`, y cada plataforma usa lo suyo.

- Los pull requests compilan Windows y Android para detectar fallos antes de fusionar (Mac solo en `escritorio` y en versiones, porque tarda más).
- Al crear una etiqueta `v*` (por ejemplo `v1.26.0`) se compilan las tres plataformas y se adjuntan a la versión publicada.
- **Límite de GitHub:** el token automático no puede subir cambios de `.github/workflows`. Si un cambio de `main` toca workflows, la sincronización falla con un aviso. Para que lo haga sola, crea un token personal (*fine-grained*, solo este repositorio, permisos **Contents** y **Workflows** de lectura y escritura) y guárdalo en *Settings → Secrets and variables → Actions* como `SYNC_TOKEN`. Sin token, basta con fusionar `main` en la rama a mano esa vez.

## Página web promocional
La web está en [`web/`](web/) y se genera con `npm run web` en `web-dist/`. La nueva versión incluye una galería para capturas reales del inicio, creación de personaje, comunicador, mapa y códice, sin conversaciones de personajes ni spoilers. Se han retirado las referencias promocionales a IA, pero las funciones del juego permanecen intactas. La publicación usa la rama `main`, el comando `node scripts/build-web.js`, la carpeta `web-dist` y actualizaciones automáticas por commit.

## Arquitectura y desarrollo futuro
La web pública de este fangame se centra en el juego, las capturas reales y las descargas. No es una wiki ni un catálogo de personajes.

### Funciones del juego pendientes
- Integración de LM Studio y modelos locales de lenguaje.
- Modelos de personajes en 3D con animaciones.
- Entornos tridimensionales de las ciudades y sus ubicaciones exteriores.
- Optimización y pruebas de escritorio, móvil y tableta.

Estas funciones no se deben anunciar como terminadas.

### Web y Netlify
Desde la raíz: npm ci y npm run web. Publicar web-dist/ con Netlify desde main. Los enlaces de descarga utilizan GitHub Releases.

### Aviso legal
Proyecto gratuito, no oficial y no afiliado a Riot Games. La gratuidad no equivale a una licencia para usar recursos protegidos de terceros. Consulta https://www.riotgames.com/es/legal antes de distribuir contenido basado en su propiedad intelectual.
