# Grietas & Gears

Juego narrativo de fans ambientado en Piltover y Zaun e inspirado en la estética de *Arcane*. Crea tu personaje, explora sus distritos, habla con el reparto y toma decisiones que cambian tus relaciones y los finales. Proyecto no oficial.

**Web promocional:** https://arcfangame.netlify.app/

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

## Hoja de ruta: web, panel de gestión, API y JavaFX
> **Estado:** estas tecnologías son una propuesta de ampliación, no funcionalidades ya implementadas. El juego actual sigue utilizando Electron y Capacitor, y la web promocional actual se genera desde `web/` con el script existente. No sustituir ni borrar esos proyectos durante la transición.

| Componente | Tecnología | Despliegue | Estado |
|---|---|---|---|
| Web promocional | HTML/CSS/JS + generador Node existente | Netlify (o Render actual) | Existente |
| Panel web privado | Angular + TypeScript | Netlify | Planificado |
| API REST | Node.js + Express | Render Web Service | Planificado |
| Aplicación de gestión de escritorio | Java + JavaFX + FXML + Scene Builder | Instalador de escritorio | Planificado |
| Autenticación | Firebase Authentication con proveedor Google | Firebase + verificación en API | Planificado |
| Documentos restringidos | Almacenamiento privado + permisos en API | Por decidir | Planificado |

### Estructura futura sugerida
```text
grietas-and-gears/
├── web/                    # Web promocional actual (conservar)
├── web-dist/               # Salida generada, no editar a mano
├── src/                    # Juego existente (conservar)
├── android/                # Capacitor existente (conservar)
├── scripts/
├── admin-web/              # Futuro panel Angular
├── api/                    # Futura API Express
├── gestion-javafx/         # Futura app JavaFX + FXML
│   └── src/main/resources/fxml/
├── docs/                   # Guías y documentación
├── netlify.toml
└── README.md
```

## Publicar la web actual en Netlify

La web promocional se construye desde la raíz con `npm run web`, que ejecuta `node scripts/build-web.js` y genera `web-dist/`. El archivo `netlify.toml` configura este proceso.

1. Accede a https://app.netlify.com/start y conecta GitHub.
2. Selecciona `MarinaDP2006/grietas-and-gears`.
3. Configura rama `main`, comando `npm run web` y directorio publicado `web-dist`.
4. Despliega y verifica que el dominio `*.netlify.app` muestra la web.
5. Cada push posterior a `main` desencadena una nueva publicación si la integración Git está activa.

**Nota:** el servicio promocional actual en Render puede mantenerse durante la migración. Netlify solo publica el contenido de `web-dist/`; no aloja por sí solo un proceso Express persistente ni ejecuta la aplicación JavaFX.

Comandos de comprobación local:

```powershell
node --version
npm --version
npm ci
npm run web
npm run check
```

CLI opcional de Netlify:

```powershell
npm install -g netlify-cli
netlify login
netlify sites:list
netlify link
netlify build
netlify deploy --build
netlify deploy --build --prod
```

No publiques manualmente en producción hasta haber vinculado el sitio correcto.

## Angular: guía de comandos (futuro panel web)

Instala Node.js LTS y usa una versión de Angular compatible con esa versión de Node. Desde la raíz del repositorio, cuando se decida crear el panel:

```powershell
npm install -g @angular/cli
ng version
ng new admin-web --routing --style=scss
cd admin-web
npm install
ng serve --open
ng serve --port 4200
ng build
ng build --configuration production
ng test
ng generate component pages/login
ng generate component pages/dashboard
ng generate component pages/documentos
ng generate service core/services/auth
ng generate service core/services/api
ng generate guard core/guards/auth
ng generate interface core/models/documento
ng generate environments
ng update @angular/core @angular/cli
```

Comandos habituales:

| Comando | Uso |
|---|---|
| `ng serve` | Servidor local |
| `ng build` | Compilar |
| `ng g c nombre` | Crear componente |
| `ng g s nombre` | Crear servicio |
| `ng g guard nombre` | Crear guardia de rutas |
| `ng g interface nombre` | Crear interfaz |
| `ng test` | Ejecutar pruebas |
| `ng update` | Revisar actualizaciones |
| `npm ci` | Instalar dependencias desde lockfile |

Cuando exista `admin-web/`, se deberá crear **otro sitio Netlify** con su propia configuración de compilación, sin reemplazar la web promocional. Revisar el directorio real en `angular.json` (en versiones recientes puede ser `dist/admin-web/browser`). Para rutas SPA, configurar fallback a `index.html` solo en ese sitio; no aplicar un fallback indiscriminado a la web actual.

## API Node.js + Express: comandos (planificada)

```powershell
mkdir api
cd api
npm init -y
npm install express cors helmet dotenv firebase-admin
npm install -D nodemon
npm pkg set type=module
npm pkg set scripts.start="node src/server.js"
npm pkg set scripts.dev="nodemon src/server.js"
npm run dev
npm start
```

Estos comandos preparan dependencias, pero **no crean automáticamente el servidor**. Se deberá implementar `api/src/server.js`, rutas, middleware de errores, autenticación, validación, límites de peticiones y pruebas. Para Render: desplegar `api/` como Web Service Node, build `npm ci`, start `npm start`, escuchar en `process.env.PORT` y configurar CORS con los dominios exactos de Netlify. No guardar secretos en Git.

Rutas previstas:

```text
GET    /api/health
GET    /api/me
GET    /api/documentos
GET    /api/documentos/:id
POST   /api/documentos
DELETE /api/documentos/:id
```

Las rutas privadas deberán validar identidad y autorización en el servidor en cada petición.

## Iniciar sesión gratis con Google (planificado)

Una opción inicial es **Firebase Authentication** con el proveedor Google, sujeto a las cuotas y condiciones vigentes de Firebase.

1. Crear un proyecto en https://console.firebase.google.com/.
2. Abrir Authentication → Sign-in method → Google y habilitar el proveedor.
3. Registrar la aplicación web y autorizar los dominios de desarrollo y producción que corresponda.
4. Instalar en el frontend Angular: `npm install firebase`.
5. Implementar `signInWithPopup` o redirección, cierre de sesión y estado de usuario.
6. Enviar el **ID token** de Firebase por HTTPS como `Authorization: Bearer <token>` a la API.
7. En Node, verificar ese token mediante Firebase Admin SDK y consultar los roles del usuario en un almacén de confianza.
8. Permitir acceder a archivos privados solo tras verificar en la API los permisos de ese usuario.

**Importante:** iniciar sesión con Google no significa tener permisos. Una cuenta Google válida no debe poder acceder automáticamente a documentos restringidos. Implementar lista de usuarios autorizados y roles como `admin`, `editor` y `lector`. Los guards de Angular sirven para la experiencia de usuario, no son una barrera de seguridad.

Nunca guardar archivos privados en `web/`, `web-dist/`, `public/`, un repositorio público ni rutas estáticas accesibles por URL. Guardarlos en almacenamiento privado y servirlos desde la API tras autorización (o mediante URL firmada de corta duración). No subir claves de servicio, tokens ni archivos `.env` al repositorio. La configuración pública de Firebase no sustituye estas medidas.

## JavaFX + Java + Scene Builder: guía de aprendizaje

La aplicación de gestión JavaFX será **independiente del juego Electron existente**. Se recomienda JDK LTS, Maven, JavaFX y FXML. Scene Builder permite diseñar las vistas visualmente y conectarlas con controladores Java.

Instalar:
- JDK y comprobar `java -version` y `javac -version`.
- Apache Maven y comprobar `mvn -version`.
- Gluon Scene Builder, configurándolo como editor de archivos `.fxml` en el IDE.
- IDE compatible con Java, como IntelliJ IDEA, Eclipse o VS Code con extensiones Java.

Estructura sugerida:

```text
gestion-javafx/
├── pom.xml
└── src/main/
    ├── java/com/grietas/gears/
    │   ├── MainApp.java
    │   ├── controllers/
    │   ├── models/
    │   └── services/
    └── resources/
        ├── fxml/
        │   ├── login.fxml
        │   └── dashboard.fxml
        └── css/
```

Comandos Maven, **cuando exista un `pom.xml` configurado con JavaFX y `javafx-maven-plugin`**:

```powershell
mvn --version
mvn clean
mvn compile
mvn javafx:run
mvn test
mvn package
mvn dependency:tree
mvn clean verify
```

En Scene Builder: crear vista → guardar `.fxml` → asignar `fx:controller` → enlazar `fx:id` y eventos `onAction` → cargar el FXML desde Java con `FXMLLoader`. Mantener las llamadas HTTP a la API fuera del hilo de interfaz JavaFX usando `Task`, `Service` o ejecución asíncrona. No introducir secretos de Firebase Admin dentro de la aplicación distribuida.

Para instaladores, estudiar `jpackage` y `jlink` después de configurar correctamente módulos y dependencias.

## Git y mantenimiento

```powershell
git clone https://github.com/MarinaDP2006/grietas-and-gears.git
cd grietas-and-gears
git status
git pull origin main
git switch -c feature/panel-angular
git add .
git commit -m "feat: iniciar panel Angular"
git push -u origin feature/panel-angular
git switch main
git pull origin main
```

No fusionar ramas con cambios de juego sin revisar compatibilidad. Mantener los workflows y las ramas de plataforma actuales mientras sigan utilizándose.

## Seguridad y comprobaciones antes de publicar

- [ ] `npm run check` pasa.
- [ ] `npm run web` genera `web-dist/` y se ve correctamente en móvil.
- [ ] Netlify publica únicamente la web, sin archivos privados.
- [ ] No hay credenciales ni claves de servicio en Git.
- [ ] La API valida tokens y roles en el servidor.
- [ ] Los archivos privados no son accesibles por URL pública.
- [ ] Los dominios de CORS y autenticación coinciden con los reales.
- [ ] Se prueban errores 401 (sin sesión) y 403 (sin permiso).
- [ ] Las aplicaciones nuevas no rompen Electron ni Capacitor.

### Documentación de referencia

- Netlify: https://docs.netlify.com/
- Angular CLI: https://angular.dev/tools/cli
- Node.js: https://nodejs.org/
- Express: https://expressjs.com/
- JavaFX: https://openjfx.io/
- Scene Builder: https://gluonhq.com/products/scene-builder/
- Firebase Authentication: https://firebase.google.com/docs/auth
- Firebase Admin: https://firebase.google.com/docs/auth/admin/verify-id-tokens
