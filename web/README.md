# Web del universo original

Esta carpeta contiene la web pública y la demo de **Las ciudades del Umbral** para la rama `feat/universo-original-doble-campana`.

- `index.html`: landing reconstruida con Aurelia, Nácar y Resonancia. No debe incluir capturas antiguas de Piltover/Zaun ni recursos oficiales de Arcane.
- `demo.html`: prototipo jugable de la introducción.
- `estilos.css`: sistema visual original, adaptable a móvil y escritorio.
- `arte-propio/*.svg`: ilustraciones vectoriales conceptuales creadas para esta versión.
- El generador `scripts/build-web.js` crea `web-dist/` y `demo-datos.js` con datos del juego. Ejecuta `npm run web`.

## Estado honesto

La web es una presentación del proyecto y no una prueba de que el producto completo esté terminado. Los GLB actuales son prototipos low-poly sin rig ni animaciones finales. La API de IA en la nube requiere configurar una clave privada como secreto en el servicio de alojamiento. No se incluye ninguna clave en la web ni en el repositorio.
