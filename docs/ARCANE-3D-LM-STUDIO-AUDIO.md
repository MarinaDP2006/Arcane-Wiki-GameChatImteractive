# Rama de trabajo: modelos 3D, LM Studio y audio

Rama de trabajo original: `feat/arcane-3d-lm-studio`.

El plan documental y las guías operativas se fusionaron en `main` mediante el PR #65. Este archivo sigue siendo una especificación de trabajo, no una confirmación de que todos los objetivos de implementación estén terminados.

## Estado y alcance

Este repositorio ya contiene renderizado 3D con Three.js, módulos de mundo, avatares y chat con IA. Los cambios de esta rama deben extender esa arquitectura y preservar la compatibilidad de partidas guardadas.

### Objetivos

- Mantener el juego accesible a quienes conocen el universo y a quienes llegan por primera vez.
- En el onboarding, preguntar si el jugador conoce el mundo. Si responde que no, mostrar una introducción breve y sin spoilers; si responde que sí, pasar directamente al creador de personaje.
- Mejorar navegación, contraste, tamaños táctiles, teclado y diseño adaptable para escritorio, móvil y tableta.
- Añadir escenarios originales de inspiración steampunk-fantástica para una ciudad alta luminosa y una ciudad subterránea industrial. No usar fotogramas, capturas ni imágenes oficiales como texturas.
- Permitir diálogo libre con personajes, memoria acotada por partida y continuidad narrativa, dejando que el código del juego valide misiones, inventario y eventos.
- Conectar opcionalmente LM Studio a través de su API compatible con OpenAI en `http://127.0.0.1:1234/v1` por defecto.
- Añadir tres pistas originales: menú principal, ciudad subterránea y ciudad alta.

## Reglas de integración con LM Studio

1. La IA es opcional; si no hay servidor o modelo disponible, el juego sigue funcionando con sus diálogos locales.
2. Configurar base URL y nombre del modelo en Ajustes. No guardar tokens, secretos ni datos privados en Git.
3. Usar `/chat/completions` con `messages`, temperatura moderada y límite de tokens.
4. Incluir solo contexto relevante: identidad del personaje, ubicación, hechos recientes y resumen de memoria.
5. No enviar una partida completa en cada petición. Limitar y resumir el historial.
6. Tratar la respuesta del modelo como texto no confiable. Nunca ejecutar HTML, JS ni acciones del juego que vengan del modelo.
7. Aplicar un timeout, un indicador de carga, cancelación cuando sea posible y mensajes de error útiles.
8. En un navegador, el servidor local debe permitir conexiones desde el origen del juego; no desactivar protecciones del navegador de forma global. En móvil, `localhost` apunta al dispositivo móvil, no al PC. Documentar la dirección LAN y los riesgos; no exponer el servidor a Internet sin autenticación y controles.
9. La lógica de progreso, inventario, misiones y finales pertenece al juego, no al LLM.

## Modelos y escenarios 3D

- Priorizar GLB/GLTF con materiales PBR y mallas optimizadas.
- Mantener modelos originales, con licencia documentada y atribución si procede.
- Proporcionar LOD, texturas comprimidas, límites de tamaño y fallback 2D para móviles modestos.
- Los conceptos visuales generados son referencias de producción, no modelos 3D listos para usar.
- Para Blender, exportar a GLB y comprobar escala, orientación, texturas, esqueletos y licencias antes de integrar.
- Separar entorno, iluminación, efectos y personajes para facilitar optimización.

## Música

Tres pistas instrumentales originales, con loop limpio:
- `menu-theme.ogg`: piano, cuerdas y síntesis hextech; misterio y descubrimiento.
- `zaun-theme.ogg`: trip-hop industrial, percusión metálica, bajos y niebla sonora.
- `piltover-theme.ogg`: cuerdas, piano, metales suaves y arpegios luminosos.

No copiar melodías, temas, stems ni grabaciones de la banda sonora de Arcane. Guardar solo archivos finales con licencia de uso comercial/juego comprobada. Comprimir en OGG/Opus y aplicar fundidos/loop points. La generación musical se hará en un servicio que el usuario tenga autorizado; Suno no queda habilitado automáticamente por este documento.

## Pruebas de aceptación

- El flujo de bienvenida tiene ramas correctas para persona nueva y fan.
- Se puede completar la creación de personaje con teclado y táctil.
- La web funciona a 360 px de ancho, tablet y escritorio sin scroll horizontal accidental.
- Piltover y Zaun son distinguibles por geometría, materiales, composición y luz, no solo por tintado.
- El juego sigue funcionando si LM Studio está apagado, tarda o devuelve error.
- El chat libre no altera directamente estado crítico sin validación del juego.
- Las tres pistas pueden activarse, pausarse y cambiar según la ubicación; se respetan las preferencias de volumen y silencio.
- Las partidas antiguas cargan sin migraciones destructivas.
- Ejecutar las pruebas existentes y registrar cualquier prueba manual que requiera Windows, Android o GPU real.

## Referencias de producción

- LM Studio server: https://lmstudio.ai/docs/developer/core/server
- LM Studio API: https://lmstudio.ai/docs/developer/openai
- Blender glTF export: https://docs.blender.org/manual/en/latest/addons/import_export/scene_gltf2.html
- Three.js: https://threejs.org/docs/

## Importante

Este documento es el plan de implementación de la rama, no una afirmación de que todas las funciones o los assets ya estén terminados. No fusionar sin revisión, pruebas de juego y verificación de licencias.
