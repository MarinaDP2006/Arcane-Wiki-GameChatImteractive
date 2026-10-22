# Grietas & Gears · Windows

Juego narrativo de fans ambientado en Piltover y Zaun e inspirado en la estética de *Arcane*. Crea tu personaje, explora sus distritos, habla con el reparto y toma decisiones que cambian tus relaciones y los finales. Proyecto no oficial.

## Descargar para Windows

Entra en **[Releases](https://github.com/MarinaDP2006/grietas-and-gears/releases)** y elige:

- **Grietas-and-Gears-Setup-VERSION.exe**: instalador de Windows, con acceso directo.
- **Grietas-and-Gears-VERSION-portable.exe**: ejecutable que no requiere instalación.

Si aún no hay una versión publicada, abre [Actions](https://github.com/MarinaDP2006/grietas-and-gears/actions) → **Compilar Windows** → ejecución correcta → artefacto `grietas-and-gears-windows`. Extrae el ZIP antes de ejecutar el archivo .exe.

**Importante:** la primera instalación puede mostrar un aviso de Windows SmartScreen si la aplicación no tiene firma digital. Descarga únicamente desde este repositorio y verifica el origen.

## Modelos personales de tus seis personajes

El juego acepta modelos `.zip`, `.fbx`, `.obj` y `.glb` con texturas (los ZIP pueden llevar otro ZIP dentro). Los prepara una sola vez en la caché `arte\modelos\_cache` de tu carpeta de datos, sin tocar los originales. Los archivos `.blend` hay que exportarlos antes a `.glb` desde Blender. Puedes dejarlos quietos y con sus colores en **Ajustes → Gráficos → NPC quietos y a color**; tu personaje mantiene su movimiento. Copia los ZIP en la carpeta que abre **Ajustes → Arte personal → modelos** y ponles nombres reconocibles: `vi.zip`, `jinx.zip`, `caitlyn.zip`, etc. No hay que subir tus ZIP privados a GitHub.

**[Guía paso a paso para los seis ZIP y pruebas Windows](GUIA-MODELOS-3D-Y-PRUEBAS.md)**.

## Qué incluye

- Personaje personalizable y origen de Piltover o Zaun.
- Exploración con calles y escenarios 3D, cámara con seguimiento, colisiones y un mapa 2D de respaldo.
- Iluminación, niebla ambiental, partículas y posprocesado con un acabado pictórico cinematográfico.
- Diálogos, decisiones, misiones, afinidad con personajes y varios finales.
- Atlas y códice, actividades y minijuegos.
- Sistema de guardado, opciones gráficas y audio; chat libre con IA opcional.

La estética está inspirada en la serie. No se incluyen ni se prometen modelos o fotogramas oficiales de *Arcane*.

## Guardado de partidas

Se mantienen en `%APPDATA%\\Arcane Piltover y Zaun\\partidas`, incluso tras actualizar o reinstalar el juego. No borres esa carpeta si deseas conservar tus partidas.

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

## Estado de plataformas

La distribución mantenida es **solo Windows (x64)**. Se han retirado los comandos y flujos de compilación para macOS y Android. La interacción principal utiliza teclado y ratón.
