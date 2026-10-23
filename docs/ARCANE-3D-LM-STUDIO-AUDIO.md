3D, LM Studio y audio
Comprueba el código actual y ejecuta pruebas en la plataforma objetivo antes de dar una tarea por completada.

## Estado conocido
- **Motor 3D:** el proyecto ya utiliza Three.js y contiene módulos de mundo y avatares. Esto no significa que existan modelos originales completos para cada personaje o que todas las zonas tengan escenarios 3D finales.
- **Chat con IA:** el proyecto incluye un chat opcional. El proveedor, el modelo y la conectividad se configuran aparte; LM Studio debe verificarse en el código y en una prueba real antes de anunciar compatibilidad para una versión concreta.
- **Audio:** `src/js/audio.js` genera música procedural con Web Audio. Los temas actuales son `wiki` (menú), `piltover` y `zaun`. No se han confirmado tres archivos renderizados independientes integrados.
- **Arte:** los conceptos visuales sirven como referencia de producción, no como modelos 3D listos para integrar.

## Objetivos
1. Preguntar durante el inicio si la persona conoce el universo. Si no lo conoce, mostrar una introducción breve y sin spoilers; si lo conoce, permitir continuar al creador de personaje.
2. Mejorar navegación, contraste, tamaños táctiles, controles de teclado y diseño adaptable a escritorio, móvil y tableta.
3. Crear escenarios originales con identidad visual diferenciada para la ciudad alta y la ciudad subterránea. No usar fotogramas, capturas ni imágenes oficiales como texturas.
4. Mantener conversaciones abiertas con personajes, pero reservar al código del juego la validación de misiones, inventario, decisiones y finales.
5. Permitir conectar opcionalmente un servidor local compatible con la API de OpenAI, como LM Studio, solo si la integración está implementada y probada.
6. Diseñar tres pistas instrumentales originales para menú, Zaun y Piltover. No copiar melodías, stems ni grabaciones de la banda sonora de *Arcane*.

## Reglas de seguridad y calidad para LM Studio
- La IA debe ser opcional; si el servidor no está disponible, el juego debe seguir funcionando con diálogos escritos.
- No guardar tokens, contraseñas ni secretos en Git.
- Enviar solo contexto relevante y limitar el historial enviado al modelo.
- Tratar la respuesta del modelo como texto no confiable. No ejecutar HTML, JavaScript ni acciones del juego generadas por el modelo.
- Usar timeout, estado de carga y errores comprensibles.
- En móvil, `localhost` apunta al móvil, no al PC. Para conectarse al PC se necesita una dirección de red local y configuración segura.
- No abrir el puerto del servidor al Internet público. En una red local, otros dispositivos autorizados podrían alcanzar el servicio según la configuración del equipo y del cortafuegos.
- La lógica de progreso, inventario, misiones y finales pertenece al juego, no al modelo de lenguaje.

## Modelos y escenarios 3D
- Priorizar GLB/GLTF, materiales PBR y mallas optimizadas.
- Documentar procedencia, permisos y atribución de cada recurso.
- Considerar LOD, compresión de texturas, límites de tamaño y un modo alternativo para móviles modestos.
- Exportar desde Blender a GLB y comprobar escala, orientación, materiales, texturas, esqueleto y licencia.
- Separar geometría, iluminación, efectos y personajes para facilitar la optimización.

## Música
Dirección artística propuesta:
- **Menú:** piano, cuerdas y síntesis de aire hextech; misterio y descubrimiento.
- **Zaun:** percusión industrial, bajos y texturas oscuras.
- **Piltover:** cuerdas, piano y arpegios luminosos.
Antes de integrar archivos, confirmar que la composición es original y que su licencia permite el uso previsto. Exportar OGG/Opus con un loop limpio y probar volumen, silencio, cambio de zona y consumo de memoria. Suno u otro servicio no se considera habilitado por el mero hecho de documentarlo; debe usarse una cuenta con acceso y revisar sus condiciones.

## Criterios de aceptación
- El onboarding ofrece una ruta para personas nuevas y otra para fans.
- El creador de personaje funciona con teclado y controles táctiles.
- Las vistas principales se adaptan a móvil, tableta y escritorio sin desplazamiento horizontal accidental.
- Las ciudades se distinguen por geometría, materiales, composición y luz, no solo por el color.
- El juego sigue funcionando si el servidor de IA está apagado, tarda o devuelve un error.
- El chat no puede modificar directamente estado crítico sin validación del motor.
- Los temas de audio respetan volumen, silencio y cambios de ubicación.
- Las partidas antiguas se cargan sin migraciones destructivas.
- Se ejecutan las pruebas automatizadas y se documentan las pruebas manuales en Windows, Android y dispositivos reales cuando proceda.

## Referencias
- [Documentación del servidor de LM Studio](https://lmstudio.ai/docs/developer/core/server)
- [API compatible con OpenAI de LM Studio](https://lmstudio.ai/docs/developer/openai)
- [Exportación glTF de Blender](https://docs.blender.org/manual/en/latest/addons/import_export/scene_gltf2.html)
- [Documentación de Three.js](https://threejs.org/docs/)
