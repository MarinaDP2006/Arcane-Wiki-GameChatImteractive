# Plan de universo original: narrativa, interfaz y publicación

## Objetivo

Transformar Rifts & Gears en una obra de fantasía industrial propia. Conservar temas generales como dos ciudades contrastadas y la tensión entre tecnología y desigualdad, pero sustituir personajes, lugares, iconografía, diálogos, trama, nombres y recursos identificables de franquicias existentes. Este documento es un plan de migración, no certifica que todo el contenido del repositorio ya se haya reescrito.

## Nueva biblia de identidad (propuesta)

- Título provisional: Las ciudades del Umbral.
- Ciudad elevada: Aurelia. Observatorios, gremios públicos, piedra clara, latón envejecido y vidrio azul.
- Ciudad subterránea: Nácar. Pozos industriales, canales de vapor, hierro ennegrecido y luz verde mineral.
- Tecnología central: Resonancia, energía derivada de cristales que registran vibraciones geológicas. Evitar terminología, símbolos, reglas y apariencia específica de franquicias ajenas.
- Conflicto: falla una red antigua de ascensores y canales. Aurelia acusa a Nácar de sabotaje; Nácar sostiene que Aurelia drena la energía de sus barrios. La protagonista descubre que el sistema se construyó sobre un pacto histórico manipulado por ambas élites.
- Los personajes nuevos deben tener motivaciones, relaciones, siluetas, vestuario, biografías y arcos propios, no ser equivalentes renombrados de personajes existentes.

Los nombres son provisionales, no una certificación de disponibilidad legal o marcaria. Antes de publicar, revisar nombres y marcas en los territorios de distribución y comprobar la similitud narrativa y visual.

## Tres partes de la historia

### Parte I: La ciudad bajo la piedra
Presentar la vida cotidiana en Aurelia y Nácar, el apagón de los ascensores y personajes con intereses en conflicto. La protagonista encuentra una pieza de Resonancia que registra una versión imposible del accidente. Final: se prueba que una institución de la ciudad alta encubrió algo, pero no se conoce al beneficiario.

### Parte II: El precio de la Resonancia
La investigación obliga a viajar entre ambas ciudades y negociar con sindicatos, archivistas y guardianes de los canales. Las decisiones de la Parte I cambian alianzas, misiones y confianza. Final: el sistema energético colapsa y aparecen pruebas de que dirigentes de ambas ciudades conocían el riesgo.

### Parte III: Un pacto que no se hereda
Los personajes eligen entre reconstruir el sistema central, distribuir la Resonancia localmente o desmantelarla. Cada ruta tiene costes, misiones y finales distintos. El epílogo muestra las consecuencias para ambas ciudades.

## Migración de contenido

1. Inventariar archivos narrativos, IDs de misiones, relaciones, códice, diálogos y referencias a ciudades/personajes.
2. Crear una tabla de migración de nombres e IDs para no romper partidas guardadas. Mantener IDs técnicos estables cuando sea seguro; sustituir nombres visibles y textos.
3. Reescribir escena por escena, no hacer sustitución ciega de palabras. Cambiar causas, secuencias, diálogo, resolución y consecuencias.
4. Dividir capítulos y misiones en tres partes explícitas, con selector, progreso y resumen de continuidad.
5. Retirar referencias de franquicia, personajes, episodios/temporadas y terminología específica de interfaz, datos, código y documentos.
6. Revisar créditos, avisos, título de ventana, nombre de aplicación, identificadores de paquete, metadatos y textos de tiendas. Un aviso de fan project no concede por sí solo derechos de publicación.
7. Hacer una revisión humana de similitud narrativa y visual antes de anunciar el juego como IP original.

## Dirección visual de pantallas

### Tipografía
Usar una serif editorial legible para títulos y una sans-serif neutra para controles, diálogo y cuerpo. Preferir familias con licencia abierta incluida en el repositorio y guardar la licencia junto a cada fuente. No copiar logotipos ni composición tipográfica promocional de otras franquicias. Como referencia, títulos de 28-40 px, interfaz de 15-18 px y áreas táctiles de al menos 44x44 px; comprobar escalado y accesibilidad.

### Paletas
- Aurelia: marfil #E8DFC9, latón #B78B45, azul tinta #24384A y carbón #171B20.
- Nácar: negro mineral #080D0D, verde de vapor #55D6A2, cobre oscuro #7D573F y niebla #D2E0D8.
- Menú: horizonte ilustrado original que combine ambas ciudades.
- Creador: personaje de cuerpo entero y fondo contextual según el origen elegido.
- Ajustes: ilustración propia de Aurelia y Nácar, con capa de contraste detrás de los controles y fondo alternativo si la imagen falla.
- El tema debe conservarse al cambiar entre creador, juego y ajustes sin sacrificar contraste, foco, hover, error ni navegación por teclado.

### Imágenes y copyright
Crear ilustraciones propias o usar recursos con licencia compatible documentada. No reutilizar capturas, pósteres, fotogramas, fanart ajeno, logos, símbolos, mapas o retratos oficiales. Mantener un manifiesto con fuente, autor, licencia, fecha y atribución. Los avatares de movimiento deben mostrar cuerpo completo, pies, brazos y piernas, escala consistente y sets idle/walk/run; el retrato de cara solo sirve como icono de diálogo. No basta con cambiar el nombre o el color de pelo de un personaje existente.

## Audio, IA y 3D

Los tres MP3 convertidos todavía deben añadirse como binarios reales a assets/music. Ver assets/music/README.md para la ruta de integración y pruebas en Electron, web y Android. La música procedural debe seguir siendo fallback hasta que las pistas se prueben de verdad.

Los modelos 3D completos y la animación de caminar/correr siguen pendientes. Primero preparar sprites de cuerpo entero idle/walk/run, luego un controlador de movimiento y después prototipos GLB/GLTF optimizados con fallback 2D. KoboldCpp (la única IA del juego) es un servicio de inferencia opcional, no un motor gráfico; la desconexión o error no debe bloquear el juego.

## Criterios de aceptación

- [ ] Tres partes visibles en navegación, progreso, misiones y documentación.
- [ ] No quedan referencias de franquicia en experiencia visible ni metadatos de publicación.
- [ ] Nombres y arte originales revisados por una persona por similitud.
- [ ] Menú, Aurelia, Nácar y Ajustes coherentes, legibles y adaptables.
- [ ] Avatares de cuerpo entero; idle/walk/run diferenciados; alternativa 2D disponible.
- [ ] Los tres MP3 están versionados y funcionan en escritorio, web y Android.
- [ ] Comprobaciones automáticas y pruebas manuales completadas.

## Estado honesto

Esta guía y su dirección artística no significan que todo el código, los diálogos, los assets, el ID Android ni las partidas guardadas hayan sido migrados. Hacerlo en commits revisables y validar las tres plataformas antes de publicar.
