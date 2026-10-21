// Opciones del creador de personaje. Cada opción puede sumar estadísticas.
window.CREATION = {
  genders: [
    { id: 'mujer', label: 'Mujer', g: 1 },
    { id: 'hombre', label: 'Hombre', g: 0 },
    { id: 'nobinario', label: 'No binario', g: 2 },
  ],

  origins: {
    zaun: {
      label: 'Zaun',
      tagline: 'La ciudad de abajo. Química, neón y supervivencia.',
      districts: ['Los Callejones', 'El Sumidero', 'Las Fábricas de Entresuelo', 'El Mercado de las Tuberías', 'Barrio de las Chimeneas'],
      jobs: [
        { id: 'mecanico', label: 'Mecánic{g:o|a|e} de quimtec', stats: { ingenio: 2 } },
        { id: 'contrabandista', label: 'Contrabandista', stats: { sigilo: 2 } },
        { id: 'luchador', label: 'Luchad{g:or|ora|ore} de foso', stats: { valor: 2 } },
        { id: 'tabernero', label: 'Taberner{g:o|a|e} de La Última Gota', stats: { carisma: 2 } },
        { id: 'medico', label: 'Médic{g:o|a|e} clandestin{g:o|a|e}', stats: { ingenio: 1, carisma: 1 } },
        { id: 'mensajero', label: 'Mensajer{g:o|a|e} de los químbarones', stats: { sigilo: 1, valor: 1 } },
        { id: 'quimico', label: 'Químic{g:o|a|e} aprendiz', stats: { ingenio: 2 } },
      ],
      families: [
        { id: 'ninguna', label: 'Sin familia famosa' },
        { id: 'vander', name: 'de Vander', label: 'Acogid{g:o|a|e} por Vander', stats: { valor: 1 }, aff: { vander: 2, vi: 1 } },
        { id: 'benzo', name: 'de Benzo', label: 'Sobrin{g:o|a|e} de Benzo', stats: { ingenio: 1 }, aff: { benzo: 2, ekko: 1 } },
        { id: 'renni', name: 'de Renni', label: 'Pariente de la químbarona Renni', stats: { carisma: 1 }, aff: { silco: 1 } },
        { id: 'luciernagas', name: 'de las Luciérnagas', label: 'Criad{g:o|a|e} en el árbol de las Luciérnagas', stats: { sigilo: 1 }, aff: { ekko: 1, scar: 2 } },
      ],
    },
    piltover: {
      label: 'Piltover',
      tagline: 'La Ciudad del Progreso. Latón, oro y ambición.',
      districts: ['Barrio Académico', 'Distrito del Consejo', 'Los Muelles de las Hexpuertas', 'Las Terrazas Kiramman', 'Barrio de los Artesanos'],
      jobs: [
        { id: 'estudiante', label: 'Estudiante de la Academia', stats: { ingenio: 2 } },
        { id: 'ejecutor', label: 'Ejecut{g:or|ora|ore} novat{g:o|a|e}', stats: { valor: 2 } },
        { id: 'comerciante', label: 'Comerciante de los muelles', stats: { carisma: 2 } },
        { id: 'inventor', label: 'Invent{g:or|ora|ore} independiente', stats: { ingenio: 1, valor: 1 } },
        { id: 'periodista', label: 'Periodista de sociedad', stats: { carisma: 1, sigilo: 1 } },
        { id: 'artista', label: 'Artista de los salones', stats: { carisma: 2 } },
        { id: 'detective', label: 'Detective privad{g:o|a|e}', stats: { sigilo: 2 } },
      ],
      families: [
        { id: 'ninguna', label: 'Sin familia famosa' },
        { id: 'kiramman', name: 'Kiramman', label: 'Prim{g:o|a|e} lejan{g:o|a|e} de los Kiramman', stats: { carisma: 1 }, aff: { caitlyn: 2, cassandra: 2 } },
        { id: 'talis', name: 'Talis', label: 'Pariente de los Talis', stats: { ingenio: 1 }, aff: { jayce: 3 } },
        { id: 'medarda', name: 'Medarda', label: 'Rama piltovense de los Medarda', stats: { carisma: 1 }, aff: { mel: 2, ambessa: 1 } },
        { id: 'ferros', name: 'Ferros', label: 'Clan Ferros (gemas y comercio)', stats: { sigilo: 1 }, aff: { mel: 1 } },
        { id: 'giopara', name: 'Giopara', label: 'Clan Giopara (artes)', stats: { carisma: 1 }, aff: {} },
      ],
    },
  },

  hobbies: [
    { id: 'inventar', label: 'Inventar cachivaches', stats: { ingenio: 1 } },
    { id: 'pelear', label: 'Peleas clandestinas', stats: { valor: 1 } },
    { id: 'grafiti', label: 'Grafiti y pintura', stats: { sigilo: 1 } },
    { id: 'musica', label: 'Música', stats: { carisma: 1 } },
    { id: 'leer', label: 'Leer en la biblioteca', stats: { ingenio: 1 } },
    { id: 'tiro', label: 'Tiro al blanco', stats: { valor: 1 } },
    { id: 'cartas', label: 'Jugar a las cartas', stats: { carisma: 1 } },
    { id: 'tejados', label: 'Correr por los tejados', stats: { sigilo: 1 } },
    { id: 'cocina', label: 'Cocinar', stats: { carisma: 1 } },
    { id: 'aerotabla', label: 'Aerotabla', stats: { valor: 1 } },
  ],

  // ---------- Clase, habilidades y aptitudes (estilo League of Legends) ----------
  // bonus: ventajas en los minijuegos (foso, tejados, aerotabla, tiro, circuito, runas, regateo).
  classes: [
    { id: 'luchador', label: 'Luchador{g:|a|e}', icon: 'LU', color: '#e0457b', stats: { valor: 2 }, role: 'Cuerpo a cuerpo',
      desc: 'Puños, agallas y cero paciencia. Brillas en el foso y cuando hay que plantar cara.',
      passive: { name: 'Puños de hierro', desc: 'Tus golpes en el foso hacen más daño.', bonus: { foso: 1 } } },
    { id: 'tirador', label: 'Tirador{g:|a|e}', icon: 'TI', color: '#3a6fc4', stats: { valor: 1, sigilo: 1 }, role: 'A distancia',
      desc: 'Ojo frío y pulso firme. Prefieres resolver los problemas desde lejos.',
      passive: { name: 'Pulso firme', desc: 'Necesitas menos puntos en la galería de tiro.', bonus: { tiro: 1 } } },
    { id: 'inventor', label: 'Invent{g:or|ora|ore} hextec', icon: 'IH', color: '#3fa9f5', stats: { ingenio: 2 }, role: 'Magia y tecnología',
      desc: 'Runas, gemas y fórmulas. Donde otros ven chatarra, tú ves un prototipo.',
      passive: { name: 'Mente brillante', desc: 'Más tiempo en los circuitos y una vida extra en las runas.', bonus: { circuito: 1, runas: 1 } } },
    { id: 'asesino', label: 'Sombra', icon: 'SO', color: '#8b3a8b', stats: { sigilo: 2 }, role: 'Sigilo',
      desc: 'Nadie te ve llegar y nadie te ve marchar. Los tejados son tu casa.',
      passive: { name: 'Sin rastro', desc: 'Las carreras por los tejados y en aerotabla duran menos.', bonus: { tejados: 1, aerotabla: 1 } } },
    { id: 'protector', label: 'Protector{g:|a|e}', icon: 'PR', color: '#c99a3b', stats: { valor: 1, carisma: 1 }, role: 'Defensa',
      desc: 'Te pones delante cuando todo se rompe. La gente confía en ti.',
      passive: { name: 'Aguante', desc: 'Aguantas más golpes en el foso.', bonus: { foso: 1 } } },
    { id: 'lider', label: 'Líder', icon: 'LÍ', color: '#3fbf9f', stats: { carisma: 2 }, role: 'Apoyo',
      desc: 'Unes a la gente. Tus palabras abren más puertas que cualquier ganzúa.',
      passive: { name: 'Don de gentes', desc: 'Regateas mejor y los personajes te cogen cariño antes.', bonus: { regateo: 1 }, chat: 1 } },
  ],
  abilities: {
    Q: [
      { id: 'golpe_atlas', name: 'Golpe Atlas', icon: 'GA', desc: 'Un puñetazo cargado de energía. +1 Valor · ventaja en el foso.', stats: { valor: 1 }, bonus: { foso: 1 } },
      { id: 'disparo', name: 'Disparo certero', icon: 'DC', desc: 'Nunca fallas a la primera. +1 Sigilo · ventaja en la galería de tiro.', stats: { sigilo: 1 }, bonus: { tiro: 1 } },
      { id: 'chispa', name: 'Chispa hextec', icon: 'CH', desc: 'Un chispazo de gema que lo arregla (o lo rompe) todo. +1 Ingenio · ventaja en circuitos.', stats: { ingenio: 1 }, bonus: { circuito: 1 } },
    ],
    W: [
      { id: 'tejado', name: 'Carrera de tejado', icon: 'CT', desc: 'Saltas de chimenea en chimenea. +1 Sigilo · ventaja en los tejados.', stats: { sigilo: 1 }, bonus: { tejados: 1 } },
      { id: 'piloto', name: 'Piloto de aerotabla', icon: 'PA', desc: 'Vuelas como una Luciérnaga. +1 Valor · ventaja en aerotabla.', stats: { valor: 1 }, bonus: { aerotabla: 1 } },
      { id: 'escudo', name: 'Escudo de chatarra', icon: 'EC', desc: 'Una plancha de metal y mucha fe. +1 Valor · aguantas más en el foso.', stats: { valor: 1 }, bonus: { foso: 1 } },
    ],
    E: [
      { id: 'memoria', name: 'Memoria arcana', icon: 'MA', desc: 'Recuerdas cada runa que ves. +1 Ingenio · vida extra en las runas.', stats: { ingenio: 1 }, bonus: { runas: 1 } },
      { id: 'labia', name: 'Lengua de plata', icon: 'LP', desc: 'Siempre consigues un precio mejor. +1 Carisma · ventaja al regatear.', stats: { carisma: 1 }, bonus: { regateo: 1 } },
      { id: 'halcon', name: 'Ojo de halcón', icon: 'OH', desc: 'Ves lo que otros no ven. +1 Sigilo · ventaja en la galería de tiro.', stats: { sigilo: 1 }, bonus: { tiro: 1 } },
    ],
    R: [
      { id: 'furia', name: 'Furia de Zaun', icon: 'FZ', desc: 'DEFINITIVA · Cuando todo arde, tú ardes más. +1 Valor · gran ventaja en el foso.', stats: { valor: 1 }, bonus: { foso: 2 } },
      { id: 'sobrecarga', name: 'Sobrecarga hextec', icon: 'SH', desc: 'DEFINITIVA · Dominas la magia de las gemas. +1 Ingenio · ventaja en circuitos y runas.', stats: { ingenio: 1 }, bonus: { circuito: 1, runas: 1 } },
      { id: 'corazon', name: 'Corazón del puente', icon: 'CD', desc: 'DEFINITIVA · Unes a arriba y abajo. +1 Carisma · ventaja al regatear y más afinidad.', stats: { carisma: 1 }, bonus: { regateo: 1 }, chat: 1 },
      { id: 'humo', name: 'Sombra del humo', icon: 'SD', desc: 'DEFINITIVA · Te desvaneces en la niebla. +1 Sigilo · gran ventaja en tejados y aerotabla.', stats: { sigilo: 1 }, bonus: { tejados: 2, aerotabla: 2 } },
    ],
  },
  keystones: [
    { id: 'encanto', name: 'Encanto', icon: 'EN', desc: 'Cada tema nuevo de conversación sube el doble de afinidad.' },
    { id: 'estudioso', name: 'Aprendiz incansable', icon: 'AI', desc: 'Las actividades de cada lugar suben tus estadísticas el doble.' },
    { id: 'pies', name: 'Pies ligeros', icon: 'PL', desc: 'Te mueves un 30 % más rápido por el mapa.' },
    { id: 'veterano', name: 'Veteran{g:o|a|e} de mil batallas', icon: 'VM', desc: 'Ventaja en todos los minijuegos.' },
  ],
  titles: [
    'la Sombra de Zaun', 'el Orgullo de Piltover', 'quien Cruza el Puente', 'la Chispa Hextec', 'el Puño de los Callejones',
    'la Voz de las Luciérnagas', '{g:el Prodigio|la Prodigio|le Prodigio} de la Academia', 'quien Baila con el Brillo',
    'el Último Trago', '{g:el Heredero|la Heredera|le Heredere} del Humo',
  ],
  statPoints: 4,
  maxStatPerAllocation: 3,

  maxHobbies: 3,

  // Opciones del retrato pintado (ver src/js/painter.js).
  look: {
    skins: ['#f6dcc8', '#f0c8a8', '#e8b394', '#d9a98a', '#c9946a', '#b07a58', '#8a5a3c', '#6b4430', '#5a3a28', '#3a2418'],
    hairs: ['#141414', '#2a1e18', '#3a2618', '#7a4a2a', '#a8642a', '#c99a3b', '#e8d0a0', '#d9d9d9', '#e0457b', '#3fa9f5', '#3fbf9f', '#8b3a8b', '#c7542f', '#5a4a5a'],
    eyeColors: ['#3a2a1a', '#6a4a2a', '#4a6a3a', '#3a5ab0', '#5a7a9a', '#7a8a9a', '#d9a830', '#e0457b', '#8fbf3a', '#c0302a'],
    lipColors: ['#c07a7a', '#a04a5a', '#8a3a4a', '#d08a80', '#6a2a3a', '#7a3aa0', '#2a1a2a'],
    outfitColors: ['#4a3a5a', '#8a2a3a', '#2f4a8a', '#2a6a5a', '#5a3a24', '#c4c0b8', '#2a2a2a', '#6a1a1a', '#c99a3b', '#3a5a3a', '#f0e6d0', '#7a3aa0'],
    faces: [{ id: 'oval', label: 'Ovalada' }, { id: 'angular', label: 'Angulosa' }, { id: 'redondo', label: 'Redonda' }, { id: 'corazon', label: 'Corazón' }, { id: 'largo', label: 'Alargada' }],
    eyes: [{ id: 'almendra', label: 'Almendrados' }, { id: 'grandes', label: 'Grandes' }, { id: 'rasgados', label: 'Rasgados' }, { id: 'cansados', label: 'Cansados' }],
    brows: [{ id: 'medias', label: 'Normales' }, { id: 'finas', label: 'Finas' }, { id: 'gruesas', label: 'Gruesas' }, { id: 'arqueadas', label: 'Arqueadas' }, { id: 'rectas', label: 'Rectas' }],
    noses: [{ id: 'recta', label: 'Recta' }, { id: 'respingona', label: 'Respingona' }, { id: 'ancha', label: 'Ancha' }, { id: 'aguilena', label: 'Aguileña' }],
    lips: [{ id: 'medios', label: 'Medios' }, { id: 'finos', label: 'Finos' }, { id: 'carnosos', label: 'Carnosos' }],
    makeup: [{ id: 'none', label: 'Sin maquillaje' }, { id: 'eyeliner', label: 'Delineado' }, { id: 'sombra', label: 'Sombra de ojos' }],
    styles: [
      { id: 'short', label: 'Corto' }, { id: 'long', label: 'Largo' }, { id: 'braids', label: 'Trenzas largas' }, { id: 'bun', label: 'Moño' },
      { id: 'mohawk', label: 'Cresta' }, { id: 'undercut', label: 'Rapado lateral' }, { id: 'messy', label: 'Despeinado' }, { id: 'pigtails', label: 'Coletas' },
      { id: 'bob', label: 'Melena corta' }, { id: 'ponytail', label: 'Coleta' }, { id: 'curly', label: 'Rizado' }, { id: 'afro', label: 'Afro' },
      { id: 'swept', label: 'Peinado atrás' }, { id: 'slick', label: 'Engominado' }, { id: 'wild', label: 'Salvaje' }, { id: 'bald', label: 'Rapado' },
    ],
    outfits: [
      { id: 'chaqueta', label: 'Chaqueta de cuero' }, { id: 'top', label: 'Top de tirantes' }, { id: 'mono', label: 'Peto de taller' },
      { id: 'harapos', label: 'Ropa de la calle' }, { id: 'abrigo', label: 'Abrigo de Piltover' }, { id: 'uniforme', label: 'Uniforme' },
      { id: 'vestido', label: 'Vestido de gala' }, { id: 'bata', label: 'Bata de laboratorio' },
    ],
    accents: [
      { id: 'goggles', label: 'Gafas de soldador' }, { id: 'scar', label: 'Cicatriz' }, { id: 'tattoo', label: 'Tatuaje facial' },
      { id: 'freckles', label: 'Pecas' }, { id: 'paint', label: 'Pintura luminosa' }, { id: 'hat', label: 'Sombrero' },
      { id: 'glasses', label: 'Gafas' }, { id: 'mask', label: 'Máscara de gas' }, { id: 'gold', label: 'Joyas doradas' },
      { id: 'beard', label: 'Barba' }, { id: 'mustache', label: 'Bigote' }, { id: 'piercing', label: 'Piercings' },
      { id: 'arm', label: 'Brazo mecánico' }, { id: 'collar', label: 'Cuello alto' },
    ],
  },
};
