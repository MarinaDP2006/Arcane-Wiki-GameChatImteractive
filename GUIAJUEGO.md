# GUIAJUEGO.md · Guía de juego y pruebas
**Rifts & Gears: Las ciudades del Umbral · Universo original**

## 1. Qué juego es

Rifts & Gears es una aventura narrativa original de fantasía industrial. Creas un personaje y exploras dos ciudades conectadas por ascensores de contrapesos y una energía geológica llamada Resonancia.

- **Aurelia:** ciudad elevada de piedra clara, observatorios, jardines, gremios y ascensores.
- **Nácar:** ciudad subterránea de talleres, canales geotérmicos, mercados, clínicas y pasarelas industriales.

La historia, los nombres y los protagonistas de esta versión son originales; el fangame de Arcane está en el repositorio separado [Arcane-fangame](https://github.com/MarinaDP2006/Arcane-fangame).

## 2. Primeros pasos

1. En el menú, empieza una partida nueva.
2. Crea tu protagonista: nombre, procedencia, oficio, aspecto y una breve biografía.
3. Lee la introducción de tu ciudad y habla con los personajes que encuentres.
4. Puedes elegir opciones de diálogo preparadas o escribir libremente lo que tu personaje dice o hace si has activado la IA.
5. Explora el mapa, visita lugares y recoge fragmentos para completar el códice.
6. Guarda la partida antes de una decisión importante y vuelve a cargarla para comprobar que el progreso se conserva.

## 3. La historia sin spoilers

La campaña comienza cuando un ascensor se detiene entre Aurelia y Nácar. El medidor registra una secuencia de pulsos que coincide con un accidente antiguo cuyo informe oficial está incompleto. La investigación te obliga a contrastar testimonios, proteger a las comunidades y decidir qué hacer con los datos.

La Resonancia no es magia ilimitada: es una energía nacida de vibraciones minerales que requiere medición, mantenimiento y límites de extracción.

## 4. Personajes principales

| Personaje | Qué aporta a la historia |
|---|---|
| Iria Venn | Ingeniera de contrapesos que investiga un registro imposible. |
| Darel Ossan | Mecánico de canales que conoce la infraestructura de Nácar. |
| Saia Merel | Archivista que compara frecuencias y documentos. |
| Toren Vale | Inspector civil que debe cuestionar informes oficiales. |
| Nyra Quell | Mensajera que conecta comunidades por rutas técnicas. |
| Bastian Rook | Mediador que conoce ambos lados del pacto. |
| Oren Caldus | Geólogo que ayudó a construir la red de Resonancia. |
| Maelis Thorn | Delegada que sopesa estabilidad pública y verdad. |
| Joren Ash | Médico comunitario que protege a quienes no pueden marcharse. |
| Edda Lume | Piloto de plataformas que descubre rutas cerradas deliberadamente. |

Los personajes tienen motivaciones propias; no todos confiarán en el protagonista ni estarán de acuerdo entre sí.

## 5. IA de conversación

La IA es opcional. En Ajustes puedes configurar un proveedor compatible con OpenAI, LM Studio o un servicio remoto. La calidad, la velocidad y el coste dependen del modelo y del proveedor.

- Para probar localmente, usa LM Studio con un modelo GGUF pequeño y activa **Developer → Start server**.
- Si la IA no responde, prueba el diálogo escrito o el narrador local.
- No compartas claves de API ni incluyas datos personales reales en las conversaciones.
- Una web pública no puede acceder al `127.0.0.1` de tu ordenador; necesita un endpoint remoto o una conexión privada segura.

## 6. Pruebas recomendadas

- [ ] Crear personajes con origen Aurelia y Nácar.
- [ ] Confirmar que la guía inicial muestra a los protagonistas originales.
- [ ] Visitar los lugares del mapa y desbloquear entradas del códice.
- [ ] Probar decisiones que cambian afinidad, flags y desenlaces.
- [ ] Guardar, cerrar y cargar una partida.
- [ ] Probar una respuesta IA válida, una respuesta vacía y un servidor apagado.
- [ ] Comprobar la interfaz en pantalla ancha y en una ventana estrecha.
- [ ] Confirmar que la web pública usa el arte de Aurelia/Nácar y no capturas del fangame.

## 7. Si encuentras un error

Anota la versión del juego, el sistema operativo, los pasos exactos para reproducirlo, el resultado esperado y el resultado real. Abre una incidencia en [GitHub Issues](https://github.com/MarinaDP2006/RIFTS-GEARS/issues).
