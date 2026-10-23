# Hoja de ruta: personajes, animación 2D/3D y LM Studio

## Objetivo

Mantener el juego jugable mientras se prepara una actualización 3D por fases. Los modelos tridimensionales completos quedan **pendientes**; no se sustituyen los avatares actuales por modelos incompletos ni se simula que el personaje ya camina en el mundo.

## Orden recomendado

1. **Arte de personajes de cuerpo entero**
   - Crear un recurso por personaje con cuerpo completo, pies visibles, pose neutral, orientación frontal y silueta legible a tamaño de juego.
   - Mantener cabeza, torso, brazos, piernas y accesorios dentro del encuadre; no usar retratos recortados de cara como sprite de movimiento.
   - Guardar originales/licencias y fuente de autoría; derivar formatos optimizados WebP/PNG para la web.
   - Convención propuesta: `src/img/arte/avatares/cuerpo/<personaje>-idle.webp`, `<personaje>-walk-0.webp`, `<personaje>-walk-1.webp`, `<personaje>-run-0.webp`, `<personaje>-run-1.webp`. No sobrescribir los avatares actuales hasta que cada set pase revisión.
2. **Movimiento 2D primero**
   - Crear un controlador de desplazamiento independiente de la cámara: entrada de teclado y controles táctiles, velocidad de caminar/correr, colisión con edificios, orientación hacia el movimiento y cancelación al abrir un diálogo.
   - Animar sprites con fotogramas de caminar/correr sincronizados con velocidad; llamar a `Audio2.step(city, running)` con limitación de frecuencia.
   - Respetar `reduceMotion`, pausa, cambio de mapa y rendimiento móvil.
3. **Modelo 3D intercambiable**
   - Usar glTF 2.0 / GLB como formato de ejecución. Conservar el archivo fuente editable separado (por ejemplo, Blender) y no incluir escenas fuente pesadas en el paquete final.
   - Requerir rig humanoide consistente, nombres documentados de huesos, escala en metros, origen en los pies, orientación frontal uniforme, materiales PBR y animaciones `idle`, `walk`, `run` y, si procede, `interact`.
   - Empezar con un prototipo de un personaje; validar movimiento, cámara, sombras y consumo antes de producir el elenco.
4. **Integración en Rifts & Gears**
   - Mantener separadas las capas de datos del personaje, control de movimiento, representación y cámara.
   - Añadir una factoría con fallback: si un GLB falla, se muestra el sprite 2D en vez de dejar la pantalla vacía.
   - No descargar modelos durante la partida. Los recursos deben estar empaquetados localmente y declarados en el manifiesto de arte.
   - Añadir validaciones para rutas inexistentes, GLB sin animaciones, texturas fuera de tamaño y modelos demasiado pesados.
5. **Pruebas y salida**
   - Verificar escritorio, navegador y Android real; revisar memoria, carga inicial, controles, orientación, colisiones, sonido de pasos, guardado y cambio de ciudad.
   - Criterios de aceptación: caminar y correr son distinguibles, las animaciones no se reproducen si el personaje está quieto, sin congelaciones, y el modo 2D sigue disponible como alternativa.

## Guía práctica de LM Studio

LM Studio se utiliza como servidor local de inferencia, no como motor gráfico. El cliente del juego debe tratar a la IA como una dependencia opcional y nunca bloquear el mapa o el creador mientras el servidor no esté activo.

1. Abrir LM Studio, descargar un modelo de conversación que quepa en la memoria del equipo y cargarlo en la pestaña Chat/Developer.
2. Activar el servidor local en Developer. La documentación actual recomienda la API REST nativa `/api/v1/*` para nuevas integraciones; los endpoints compatibles con OpenAI también están disponibles. Referencias oficiales:
   - Servidor: https://lmstudio.ai/docs/developer/core/server
   - API REST: https://lmstudio.ai/docs/developer/rest
   - Requisitos del sistema: https://lmstudio.ai/docs/app/system-requirements
3. En los Ajustes de Rifts & Gears, usar la URL local configurada por LM Studio (normalmente `http://localhost:1234` en el mismo equipo). En el navegador, el juego debe ejecutarse en el mismo ordenador que LM Studio para que `localhost` apunte al lugar correcto; en Android, `localhost` señala el propio móvil, no el PC.
4. Separar el prompt de sistema y el contexto de partida de los mensajes del jugador. Limitar el contexto enviado a lo relevante (personaje, relaciones, capítulo y últimas intervenciones) y usar límites de salida y tiempo de espera.
5. Validar las respuestas, preferir salida estructurada cuando la función la admita, descartar instrucciones que intenten cambiar el estado de la partida fuera de las acciones permitidas y conservar un diálogo preescrito si la IA no responde.
6. No incrustar secretos en el repositorio. La IA local no exige una clave de nube por defecto; si se configura un token, tratarlo como secreto y no incluirlo en capturas, registros ni exportaciones.
7. Antes de conectar una herramienta o guardar cambios, probar en una sesión sin partida, desconectar el servidor y verificar que el juego principal continúa siendo utilizable.

## Estado actual vs. pendiente

- [x] Esquemas visuales diferenciados por ciudad y fondo ilustrado de Ajustes utilizando arte local existente.
- [x] Mantener el tema de ciudad al entrar desde el creador o volver a Ajustes.
- [ ] Incorporar los tres MP3 finales a `assets/music/` y probar bucle/volumen/silencio/cambio de pista en todas las plataformas.
- [ ] Preparar los sprites de cuerpo entero con sets idle/walk/run.
- [ ] Implementar movimiento 2D con animación de caminar/correr.
- [ ] Prototipo GLB riggeado, luego modelo 3D por personaje.
- [ ] Validar LM Studio con servidor local, desconexión, tiempo de espera y respuesta alternativa.
- [ ] Ejecutar `npm run check`, `npm run web`, `npm run android:sync` y compilaciones de escritorio/Android con los recursos nuevos.
