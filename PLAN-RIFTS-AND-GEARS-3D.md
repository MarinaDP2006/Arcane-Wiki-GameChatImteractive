# Rifts & Gears · Modelos 3D de los siete protagonistas

## Estado comprobado

El proyecto **ya dispone** de un sistema de avatares 3D en `src/js/avatars3d.js`, con GLTFLoader local, animación y personajes procedurales de respaldo. No es necesario reemplazarlo ni prometer que se han descargado modelos inexistentes. **Los siete GLB fieles a Arcane NO están incorporados todavía.**

El nombre visible del juego pasa a **Rifts & Gears**. Se mantiene el identificador interno `grietas-and-gears`, el ID de la app y las claves de las partidas para no romper instalaciones, enlaces ni guardados existentes.

## Catálogo de modelos que faltan

| Personaje | Archivo previsto | Estado |
| --- | --- | --- |
| Viktor | `viktor.glb` | Pendiente de modelo licenciado |
| Jayce | `jayce.glb` | Pendiente de modelo licenciado |
| Mel | `mel.glb` | Pendiente de modelo licenciado |
| Jinx | `jinx.glb` | Pendiente de modelo licenciado |
| Vi | `vi.glb` | Pendiente de modelo licenciado |
| Caitlyn | `caitlyn.glb` | Pendiente de modelo licenciado |
| Ekko | `ekko.glb` | Pendiente de modelo licenciado |

### Fuentes investigadas

- Colección Arcane de Sketchfab, con fan art y modelos de algunos personajes: https://sketchfab.com/enishi/collections/arcane-62f207cdbc6749d8841fe81cd876cb88
- Referencia visual de las skins de Arcane en 3D: https://www.nerfplz.com/lol-skins/lines/arcane/
- Catálogo de modelos para impresión: https://cults3d.com/en/3d-model/art/arcane-bundle
- Modelos comerciales de personajes: https://www.turbosquid.com/Search/3D-Models/arcane_leagueoflegends
- Especificación de carga GLB: https://threejs.org/docs/pages/GLTFLoader

**No descargar ni redistribuir automáticamente estos modelos:** cada obra tiene autor, licencia y formatos distintos; muchos STL son estatuas sin esqueleto ni animaciones y no sirven directamente para el juego. Las mallas extraídas de otros videojuegos pueden estar sujetas a derechos de Riot Games. Antes de incorporar cada archivo, confirmar autorización para redistribución, atribución, uso en videojuego y modificación.

## Proceso de integración por personaje

1. Elegir una referencia de temporada/atuendo. Confirmar silueta, ropa, peinado, rostro, accesorios y paleta. No mezclar versiones de la temporada 1 y 2 sin indicarlo.
2. Obtener un modelo con licencia compatible o crear una malla original en Blender; preferir GLB con materiales PBR y rig humanoide. Registrar autor, enlace, licencia y modificaciones.
3. Optimizar la malla para Android/tablet: geometría y texturas razonables, sin mallas innecesarias ni cientos de materiales.
4. Exportar a `src/models/<id>.glb` con el nombre exacto de la tabla. Mantener un modelo de reserva si falla la carga.
5. Añadir el nombre a `src/models/index.json` (array de nombres base sin extensión), para la versión web/Android. El cargador del proyecto usa ese índice fuera de escritorio.
6. Verificar carga en el juego, orientación, escala, materiales, iluminación, animaciones, interacción, FPS y consumo de memoria en Windows y Android.
7. Probar todas las variantes narrativas y el sistema de guardado. No fusionar una incorporación sin prueba visual.

## Mejoras de mundo e interfaz aún pendientes

- Mapa: transiciones consistentes entre vista general, ubicaciones y exploración, marcadores legibles y rutas táctiles.
- Mundo 3D: escenarios explorables con colisiones, cámara y NPCs, no solo fondos o avatares tridimensionales.
- Interacción: misiones, pistas, diálogos y relaciones que cambian según las decisiones.
- Móvil/tablet: verificar la PR #47 de controles táctiles en dispositivo real antes de fusionarla.
- Rendimiento: perfiles de calidad baja/media/alta y pruebas de 30/60 FPS medidos.
- Interfaz: HUD escalable, controles configurables, subtítulos y accesibilidad.
- Entrega: compilar Windows, Android y web; comprobar instalación, partidas y carga sin conexión.

**No hay garantía de semejanza perfecta ni de ausencia de errores sin revisar y probar los siete modelos finales.**
