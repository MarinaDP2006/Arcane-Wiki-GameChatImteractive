# Rifts & Gears

Juego narrativo de fans inspirado en la estética de *Arcane*. Crea un personaje, explora Piltover y Zaun, habla con personajes y toma decisiones que afectan a la historia. Proyecto no oficial y sin afiliación con Riot Games.

> **Estado del proyecto:** el repositorio contiene el juego y sus sistemas actuales, además de documentación sobre mejoras propuestas. Los documentos de planificación no significan que todas las funciones o recursos descritos estén terminados. Consulta las limitaciones y pruebas pendientes de cada guía.

## Empezar en 5 minutos

Necesitas [Node.js](https://nodejs.org/) compatible con el proyecto y Git. Desde una terminal, en la carpeta del repositorio:

```bash
npm ci
npm run check
npm start
```

- `npm ci`: instala las dependencias del proyecto.
- `npm run check`: ejecuta las comprobaciones automatizadas disponibles. No sustituye una prueba jugando.
- `npm start`: abre la versión de escritorio con Electron.
- `npm run web`: genera la versión web estática en `web-dist/`.
- `npm run dist:win`: intenta crear instalador y ejecutable portable de Windows en `dist/`.

Si solo quieres jugar, mira **[Releases](https://github.com/MarinaDP2006/RIFTS-GEARS/releases)** para ver si hay una versión publicada. No descargues ejecutables de fuentes desconocidas. Si no hay una versión disponible, consulta [Actions](https://github.com/MarinaDP2006/RIFTS-GEARS/actions) y revisa que la compilación haya terminado correctamente antes de usar un artefacto.

## Guías

| Quiero… | Guía |
|---|---|
| Funcionamiento completo, arquitectura, código, compilación y exportación | [Guía completa](GUIA.md) |
| Aprender a jugar sin conocer Arcane y probar el juego | [Guía de usuario y testing](GUIAJUEGO.md) |
| Entender el proyecto y cómo desplegar la web | [Web en Render](GUIA-WEB-RENDER.md) |
| Configurar el chat con LM Studio en el PC o en la red doméstica | [Guía de LM Studio](GUIA-LM-STUDIO.md) |
| Cambiar diálogos, personalidad de la IA y contenido de campaña | [IA y campaña](GUIA-IA-Y-CAMPANA.md) |
| Importar modelos 3D personales y probarlos en Windows | [Modelos 3D y pruebas](GUIA-MODELOS-3D-Y-PRUEBAS.md) |
| Exportar, importar y recuperar partidas | [Partidas guardadas](partidas-guardadas-guia.md) |
| Consultar el estado propuesto para 3D, IA y música | [Plan de 3D, LM Studio y audio](docs/ARCANE-3D-LM-STUDIO-AUDIO.md) |
| Entender la música actual y cómo añadir archivos de audio | [Documentación de música](assets/music/README.md) |

## Qué incluye el proyecto

- Creación de personaje y elección de origen.
- Exploración de escenarios con Three.js, cámara, colisiones y mapa 2D de respaldo.
- Historia interactiva, decisiones, relaciones, misiones, códice y minijuegos.
- Guardado de partidas y opciones de gráficos y audio.
- Conversaciones escritas y chat libre con IA opcional, según el proveedor configurado.
- Empaquetado de escritorio con Electron y herramientas para compilar Android.

Las funciones disponibles pueden variar según la versión y la plataforma. Los modelos 3D personales son archivos locales del jugador y no se deben subir al repositorio. El juego no incluye ni promete modelos o fotogramas oficiales de *Arcane*.

## IA y privacidad

La IA es opcional. El modo de diálogo escrito no requiere un modelo de lenguaje. LM Studio u otros servicios deben configurarse por separado; la calidad y disponibilidad dependen del modelo y del servidor. Si conectas el juego a un servidor en tu red, los mensajes enviados a ese servidor salen del dispositivo del juego. No expongas LM Studio a Internet ni compartas claves privadas.

## Música

Los temas actuales se generan de forma procedural mediante Web Audio en `src/js/audio.js`; no son pistas MP3/OGG externas. Los identificadores actuales son `wiki` (menú), `piltover` y `zaun`. Las pistas renderizadas independientes son una mejora futura hasta que existan archivos finales integrados y probados.

## Partidas guardadas

En Windows, la carpeta habitual es `%APPDATA%\\Arcane Piltover y Zaun\\partidas`. Haz una copia antes de probar cambios. En Android, exporta la ranura desde el menú **Partidas** antes de desinstalar la aplicación. Consulta la [guía de partidas](partidas-guardadas-guia.md) para mover partidas entre dispositivos y recuperar copias.

**No subas al repositorio** partidas, modelos privados, claves, tokens, credenciales ni otros datos personales.

## Compilaciones y pruebas

Las comprobaciones automáticas ayudan a detectar errores, pero no garantizan que todas las rutas narrativas funcionen ni que la aplicación se haya probado en un equipo real. Antes de publicar una versión, comprueba el arranque, controles, diálogos, guardado/carga y cambios de escena en cada plataforma que vayas a distribuir.

Para la web pública, consulta [GUIA-WEB-RENDER.md](GUIA-WEB-RENDER.md). El generador ejecuta `npm run web` y escribe los archivos estáticos en `web-dist/`; los instaladores se distribuyen mediante GitHub Releases, no desde Render.

## Licencia y propiedad intelectual

El repositorio declara licencia MIT para el código, pero eso no concede derechos sobre marcas, personajes ni materiales de terceros. Es un proyecto de fans no oficial. Antes de distribuir recursos, verifica su licencia y las [condiciones legales de Riot Games](https://www.riotgames.com/es/legal).
