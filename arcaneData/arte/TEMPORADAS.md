# Imágenes separadas por temporadas

El juego elige la imagen según el capítulo que se está jugando: los capítulos `t1`…`t9` y `fin2` son de la temporada 2, el resto de la temporada 1. **Nunca se muestra una imagen de T1 en un capítulo de T2**: si un lugar o personaje no tiene imagen de T2, se usa el escenario dibujado o el retrato de reserva del juego.

## Dónde está cada cosa

| Qué | Copia original (organizada) | Copia que empaqueta el juego |
|---|---|---|
| Lugares de Piltover T1 / T2 | `arcaneData/arte/mapa/piltover/s1/`, `.../s2/` | `src/img/arte/lugares/s1/`, `.../s2/` |
| Lugares de Zaun T1 / T2 | `arcaneData/arte/mapa/zaun/s1/`, `.../s2/` | `src/img/arte/lugares/s1/`, `.../s2/` |
| Retratos T1 / T2 | `arcaneData/arte/personajes/referencias/s1/`, `.../s2/` | `src/img/arte/personajes/s1/`, `.../s2/` |

El instalador de Windows/Mac y el APK solo incluyen `src/`, por eso hay una copia allí. `node scripts/art-manifest.js` copia lo nuevo de `arcaneData` a `src/img/arte` y actualiza `src/data/arte.js`; `npm run check` avisa si las dos copias no coinciden.

Las imágenes que subiste tú (`avatares/`, `caras/` y los retratos y lugares que ya había) **no se han tocado ni borrado**. Siguen funcionando como reserva en T1, y tus caras se usan en las dos temporadas.

## Fuentes

`FUENTES.json` recoge, por cada imagen, la página de origen, la URL original, la temporada, el lugar o personaje, el tipo (concept art oficial, fotograma o póster promocional) y el crédito, junto con la lista de lo que queda **pendiente**. Las muertes del canon se respetan: Vander, Silco y Cassandra no tienen retrato de T2.
