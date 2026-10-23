// Mundo abierto de Las ciudades del Umbral: dónde vive cada personaje, dónde empieza cada
// capítulo y dónde apareces según tu barrio. Los mapas de Aurelia y Nácar están en
// original-world.js, junto al resto de datos del universo.
window.WORLD = {
  homes: {
    'iria-venn': 'ascensor-central', 'saia-merel': 'archivo', 'toren-vale': 'ascensor-central',
    'bastian-rook': 'gremios', 'maelis-thorn': 'observatorio',
    'darel-ossan': 'canal-cobre', 'nyra-quell': 'mercado-nacar', 'oren-caldus': 'galerias',
    'joren-ash': 'clinica', 'edda-lume': 'jardin-musgo',
  },

  // Personajes que no están en el mapa en ciertos capítulos.
  absent: {},

  // Dónde arranca cada capítulo de la historia.
  chapterLocations: {
    z1: 'canal-cobre', z2: 'galerias', z3: 'clinica',
    p1: 'ascensor-central', p2: 'archivo', p3: 'observatorio',
    fin: { nacar: 'canal-cobre', aurelia: 'ascensor-central' },
  },

  // Lugar de aparición según el barrio elegido al crear el personaje.
  spawns: {
    'Mercado de las Tuberías': 'mercado-nacar', 'Galerías Geotérmicas': 'galerias', 'Jardín de Musgo': 'jardin-musgo',
    'Clínica de los Tres Arcos': 'clinica', 'Canal de Cobre': 'canal-cobre',
    'Plaza del Archivo': 'archivo', 'Terrazas del Observatorio': 'observatorio', 'Patio de Gremios': 'gremios',
    'Estación de Ascensores': 'ascensor-central', 'Bulevar de Cristal': 'cristal',
  },

  maxStat: 8,
};
