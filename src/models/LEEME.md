# Modelos 3D del universo original

Esta carpeta contiene modelos propios de **Las ciudades del Umbral**. No añadas aquí modelos ni nombres de personajes de Arcane; el fangame vive en el repositorio independiente `Arcane-fangame`.

Usa un archivo `.glb` por personaje con el identificador de `src/data/original-world.js` (por ejemplo, `iria-venn.glb`, `darel-ossan.glb`, `saia-merel.glb`). Los modelos que aún no existan se representan con avatares procedurales basados en sus fichas originales.

Modelos comunes opcionales:
- `jugador.glb`: cuerpo base para el personaje creado por el usuario.
- `generico.glb`: cuerpo base de personajes secundarios.
- `animaciones/reposo.glb`, `animaciones/andar.glb`, `animaciones/correr.glb`: animaciones compatibles con el rig utilizado por el juego.

La lista de modelos empaquetados está en `index.json`. Los modelos actuales son prototipos GLB de bajo peso, no personajes finales con rig facial y animaciones de producción. Para los modelos finales, parte del concepto visual de Aurelia y Nácar, pero usa siluetas, peinados, paletas y ropa originales; no copies los diseños de la referencia literalmente.
