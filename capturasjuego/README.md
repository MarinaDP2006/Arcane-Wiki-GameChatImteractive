# Capturas del desarrollo de Rifts & Gears

Sube a esta carpeta **capturas reales** del juego, desde sus primeras versiones hasta las actuales. La carpeta está en la **raíz** del repositorio: `/capturasjuego`.

## Capturas incluidas

Ordenadas de la versión más antigua a la actual. El nombre de cada archivo es también el pie de foto que muestra la web.

| Archivo | Qué se ve | De dónde sale |
| --- | --- | --- |
| `01-version-1-5-primer-menu-ciudad-3d.webp` | El primer menú del juego (v1.5), con la ciudad en 3D detrás. | Captura real de la v1.5 |
| `02-menu-inicial-grieta-entre-piltover-y-zaun.webp` | El menú inicial actual: la grieta separa Piltover y Zaun. | Juego actual (v1.27) |
| `03-creador-de-personaje-eleccion-de-retrato.webp` | El creador de personaje en el paso «Retrato», con la ficha a la derecha. | Juego actual (v1.27) |
| `04-primer-mapa-de-zaun-vista-cenital.webp` | El primer mapa de Zaun, visto desde arriba, antes del rediseño. | Captura real anterior a la v1.13 |
| `05-mapa-interactivo-de-zaun-camino-al-objetivo.webp` | El mapa interactivo en 2D, con los lugares y la línea dorada hacia el objetivo. | Juego actual (v1.27) |
| `06-salon-de-minijuegos-con-los-10-juegos.webp` | El Salón de minijuegos con los 10 juegos para practicar. | Juego actual (v1.27) |
| `07-version-actual-mapa-3d-de-zaun.webp` | La versión actual: el mapa 3D de Zaun con el HUD completo. | Juego actual (v1.27) |

Para añadir más, usa el mismo formato: prefijo numérico para el orden y nombre descriptivo con guiones. Acepta `.png`, `.jpg`, `.jpeg` y `.webp`. No incluyas datos privados ni spoilers sin aviso. No subas vídeos, ejecutables ni material sin permiso.

El comando `node scripts/build-web.js` incorpora automáticamente todas las imágenes de esta carpeta a `web-dist/capturasjuego/` y a la galería **Capturas del juego**. La sección **Desarrollando R&G** explica la cronología con arte ilustrativo existente; la galería inferior mostrará las capturas históricas reales.

Render usa `render.yaml`, publica `web-dist` y despliega al actualizar `main`. La web pública es https://grietas-and-gears-5saz.onrender.com/.
