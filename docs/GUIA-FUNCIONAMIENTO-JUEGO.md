# Guía de funcionamiento de Rifts & Gears

## 1. Arranque y primera partida
1. Abre la web, ejecutable de escritorio o aplicación Android.
2. En la pantalla de inicio, selecciona iniciar o continuar partida.
3. En creación de personaje, define los rasgos disponibles y el origen/facción si se solicita.
4. Confirma y entra en la historia.
5. Si el audio no comienza automáticamente, interactúa con la interfaz: algunos navegadores bloquean el audio hasta el primer gesto del usuario.

## 2. Exploración e historia
- Explora las zonas disponibles con teclado/ratón en PC o controles táctiles en móvil/tableta.
- El mundo usa escenas 3D con cámara, iluminación y colisiones; hay un mapa 2D de respaldo para equipos donde la escena 3D no sea viable.
- Los capítulos, relaciones y decisiones pueden afectar acontecimientos y finales.
- Atlas/códice y minijuegos amplían la exploración.
- Los diálogos locales funcionan aunque la IA esté desactivada.

## 3. Piltover y Zaun
Piltover se representa con arquitectura elevada, piedra pulida, metal trabajado, cristales y luz limpia. Zaun se distingue por niveles industriales, pasarelas, tuberías, metal, neón y bruma. La identidad visual debe venir de geometría, materiales y composición, no solo del color.

## 4. Audio
El módulo `src/js/audio.js` genera sonido en tiempo real mediante Web Audio; no necesita archivos MP3/OGG para los temas descritos actualmente.
- `wiki`: tema del menú/wiki, una caja de música entre las dos ciudades.
- `piltover`: cuerdas, metales, arpa/celesta y relojería.
- `zaun`: bajo, percusión metálica, pads industriales y sintetizadores de neón.
- Ambiente: viento/campanas en Piltover; maquinaria y zumbidos en Zaun.
- Efectos: interfaz, desbloqueos y pasos diferentes por ciudad.

La API global es `Audio2`: `configure(...)`, `playMusic(mood)`, `stopMusic()`, `previewCity(city)` y `step(city, run)`. Los controles de volumen y silencio deben respetarse en todas las plataformas. El sistema actual es audio procedural, no tres pistas exportadas como archivos de audio independientes.

## 5. IA opcional y LM Studio
El código del prompt se encuentra en `src/js/ai.js`; la configuración y el proveedor disponible dependen de la versión. La guía específica está en `GUIA-LM-STUDIO.md`.

Flujo recomendado:
1. Instala LM Studio y descarga un modelo que quepa en la memoria del equipo.
2. Inicia el servidor local, normalmente en el puerto 1234.
3. En Ajustes → IA para los chats, elige LM Studio y prueba la conexión.
4. En PC y modelo local, usa la dirección local. En tablet/móvil conectado al PC, usa la IP LAN del PC, misma Wi-Fi y acceso solo por red privada.
5. Si la IA no está disponible, continúa con el diálogo local.

La IA genera texto; la lógica del juego debe validar inventario, misiones, colisiones y finales. No expongas el servidor local a Internet ni ejecutes código recibido como respuesta del modelo.

## 6. Modelos 3D personales
La guía del proyecto indica soporte para ZIP, FBX, OBJ y GLB con texturas. Los archivos Blender deben exportarse a GLB. Usa Ajustes → Arte personal → modelos para abrir la carpeta indicada por el juego. Comprueba escala, orientación, materiales, rig, rendimiento y licencias. No incluyas modelos privados en el repositorio.

## 7. Guardado
La documentación del proyecto indica que las partidas de escritorio se guardan en `%APPDATA%\\Arcane Piltover y Zaun\\partidas`; cada ranura dispone de copia `.bak`. En Android, los guardados están dentro del almacenamiento de la aplicación y no se sincronizan solos con PC.

Para mover una partida: exporta el JSON desde Partidas, transfiérelo de forma privada y utiliza Importar en el dispositivo de destino. Conserva una copia antes de reinstalar o actualizar. No subas partidas a GitHub.

## 8. Solución de problemas
- **3D lento:** baja los ajustes gráficos, optimiza GLB/texturas y cierra procesos que consuman GPU.
- **Audio ausente:** revisa volumen, silencio, salida de audio y desbloqueo de AudioContext con una interacción.
- **LM Studio no conecta:** comprueba servidor, modelo, URL, puerto, IP LAN y firewall privado.
- **No carga la partida:** conserva una copia de la carpeta, comprueba el JSON y revisa el backup .bak.
- **Problema de interfaz:** registra plataforma, resolución, versión, pasos para reproducir y consola.

## 9. Pruebas de aceptación
Prueba arranque, creación de personaje, exploración, cambios de ciudad, colisiones, capítulos, relaciones, minijuegos, guardado/carga, exportación/importación, audio, IA activa/inactiva y diseño adaptable a 360 px, tablet y escritorio.

## Referencias
`README.md`, `GUIA-IA-Y-CAMPANA.md`, `GUIA-LM-STUDIO.md`, `GUIA-MODELOS-3D-Y-PRUEBAS.md`, `src/js/audio.js`, `src/js/ai.js`, `src/js/world3d.js` y `package.json`.
