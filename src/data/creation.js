// Opciones del creador de personaje. Cada opción puede sumar estadísticas.
window.CREATION = {
  genders: [
    { id: 'mujer', label: 'Mujer', g: 1 },
    { id: 'hombre', label: 'Hombre', g: 0 },
    { id: 'nobinario', label: 'No binario', g: 2 },
  ],

  // Tus padres: si falta alguno, ciertos personajes pueden ser tu familia elegida.
  parents: [
    { id: 'ambos', label: 'Tengo a mis padres' },
    { id: 'madre', label: 'Solo tengo a mi madre' },
    { id: 'padre', label: 'Solo tengo a mi padre' },
    { id: 'ninguno', label: 'Huérfan{g:o|a|e}, sin familia' },
  ],
  // A quién puede querer tu personaje como pareja.
  attractions: [
    { id: 'hombres', label: 'Hombres' },
    { id: 'mujeres', label: 'Mujeres' },
    { id: 'todos', label: 'Ambos' },
    { id: 'nadie', label: 'Nadie' },
  ],

  origins: {
    zaun: {
      label: 'Nácar', tagline: 'La ciudad bajo la piedra: vapor, canales y redes vecinales.',
      districts: ['Mercado de las Tuberías', 'Galerías Geotérmicas', 'Jardín de Musgo', 'Clínica de los Tres Arcos', 'Canal de Cobre'],
      jobs: [
        { id:'mecanico', label:'Mecánic{g:o|a|e} de canales', stats:{ingenio:2} },
        { id:'mensajero', label:'Mensajer{g:o|a|e} de vapor', stats:{sigilo:2} },
        { id:'medico', label:'Médic{g:o|a|e} comunitari{g:o|a|e}', stats:{carisma:1,ingenio:1} },
        { id:'geologo', label:'Aprendiz de geología', stats:{ingenio:2} },
        { id:'piloto', label:'Pilot{g:o|a|e} de plataformas', stats:{valor:1,sigilo:1} },
      ],
      families: [
        { id:'ninguna', label:'Sin familia conocida' },
        { id:'familia-taller', name:'del taller', label:'Criade en una cooperativa de taller', stats:{ingenio:1}, aff:{'darel-ossan':1} },
        { id:'familia-clinica', name:'de la clínica', label:'Aprendiste en la clínica vecinal', stats:{carisma:1}, aff:{'joren-ash':1} },
        { id:'familia-mensajera', name:'de la red', label:'Parte de una red de mensajería', stats:{sigilo:1}, aff:{'nyra-quell':1} },
      ],
    },
    piltover: {
      label: 'Aurelia', tagline: 'La ciudad elevada: observatorios, gremios y ascensores públicos.',
      districts: ['Plaza del Archivo', 'Terrazas del Observatorio', 'Patio de Gremios', 'Estación de Ascensores', 'Bulevar de Cristal'],
      jobs: [
        { id:'estudiante', label:'Estudiante de ingeniería', stats:{ingenio:2} },
        { id:'inspector', label:'Inspector{g:a|a|e} en prácticas', stats:{valor:1,ingenio:1} },
        { id:'archivista', label:'Archivist{g:a|a|e} de frecuencias', stats:{ingenio:2} },
        { id:'comerciante', label:'Comerciant{g:e|a|e} de los gremios', stats:{carisma:2} },
        { id:'ingeniero', label:'Ingenier{g:o|a|e} de contrapesos', stats:{valor:1,sigilo:1} },
      ],
      families: [
        { id:'ninguna', label:'Sin familia conocida' },
        { id:'familia-gremio', name:'del gremio', label:'Familia vinculada a un gremio técnico', stats:{ingenio:1}, aff:{'iria-venn':1} },
        { id:'familia-archivo', name:'del archivo', label:'Parientes del Archivo de Frecuencias', stats:{carisma:1}, aff:{'saia-merel':1} },
        { id:'familia-administracion', name:'de la administración', label:'Creciste cerca de la administración pública', stats:{carisma:1}, aff:{'toren-vale':1} },
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
    { id:'luchador', label:'Combatient{g:e|a|e}', icon:'CO', color:'#a34e7a', stats:{valor:2}, role:'Defensa activa',
      desc:'Mantienes la calma cuando una máquina falla y hay que proteger a otras personas.',
      passive:{name:'Aguante',desc:'Resistes mejor los incidentes y las pruebas físicas.',bonus:{foso:1}} },
    { id:'tirador', label:'Explorador{g:a|a|e}', icon:'EX', color:'#3a6fc4', stats:{valor:1,sigilo:1}, role:'Precisión',
      desc:'Observas los detalles y eliges el momento adecuado para actuar.',
      passive:{name:'Pulso firme',desc:'Encuentras antes las señales pequeñas.',bonus:{tiro:1}} },
    { id:'inventor', label:'Técnic{g:o|a|e} de Resonancia', icon:'RE', color:'#3fa9f5', stats:{ingenio:2}, role:'Tecnología',
      desc:'Entiendes válvulas, frecuencias y mecanismos que otras personas dan por imposibles.',
      passive:{name:'Mente calibrada',desc:'Obtienes ventaja en circuitos y lecturas de frecuencia.',bonus:{circuito:1,runas:1}} },
    { id:'asesino', label:'Infiltrad{g:o|a|e}', icon:'IN', color:'#8b3a8b', stats:{sigilo:2}, role:'Sigilo',
      desc:'Te mueves por pasarelas y conductos sin llamar la atención.',
      passive:{name:'Paso silencioso',desc:'Te orientas mejor en rutas estrechas.',bonus:{tejados:1,aerotabla:1}} },
    { id:'protector', label:'Protector{g:|a|e}', icon:'PR', color:'#c99a3b', stats:{valor:1,carisma:1}, role:'Apoyo',
      desc:'Te colocas delante cuando una decisión puede poner a otras personas en peligro.',
      passive:{name:'Aguante',desc:'Resistes mejor los incidentes físicos.',bonus:{foso:1}} },
    { id:'lider', label:'Mediador{g:a|a|e}', icon:'ME', color:'#3fbf9f', stats:{carisma:2}, role:'Negociación',
      desc:'Encuentras acuerdos sin olvidar quién asumirá las consecuencias.',
      passive:{name:'Red de confianza',desc:'Negocias mejor y construyes relaciones con más facilidad.',bonus:{regateo:1},chat:1} },
  ],
  abilities: {
    Q: [
      {id:'pulso',name:'Pulso calibrado',icon:'PC',desc:'Mides una frecuencia antes de actuar. +1 Ingenio.',stats:{ingenio:1}},
      {id:'bloqueo',name:'Bloqueo de emergencia',icon:'BE',desc:'Aseguras una pieza que está a punto de fallar. +1 Valor.',stats:{valor:1}},
    ],
    W: [
      {id:'ruta',name:'Ruta alternativa',icon:'RA',desc:'Encuentras una vía técnica segura. +1 Sigilo.',stats:{sigilo:1}},
      {id:'soporte',name:'Soporte de carga',icon:'SC',desc:'Repartes el peso para evitar una avería. +1 Valor.',stats:{valor:1}},
    ],
    E: [
      {id:'lectura',name:'Lectura de archivo',icon:'LA',desc:'Detectas una diferencia entre dos registros. +1 Ingenio.',stats:{ingenio:1}},
      {id:'negociacion',name:'Negociación vecinal',icon:'NV',desc:'Construyes un acuerdo verificable. +1 Carisma.',stats:{carisma:1}},
    ],
    R: [
      {id:'estabilizacion',name:'Estabilización de Resonancia',icon:'ER',desc:'Reduces una sobrecarga sin ocultar el riesgo. +1 Ingenio.',stats:{ingenio:1}},
      {id:'evacuacion',name:'Evacuación coordinada',icon:'EC',desc:'Organizas una salida segura. +1 Valor.',stats:{valor:1}},
      {id:'pacto',name:'Pacto transparente',icon:'PT',desc:'Publicas pruebas y responsabilidades. +1 Carisma.',stats:{carisma:1}},
      {id:'sigilo',name:'Paso de servicio',icon:'PS',desc:'Cruzas una zona técnica sin alertar a nadie. +1 Sigilo.',stats:{sigilo:1}},
    ],
  },
  keystones: [
    { id: 'encanto', name: 'Encanto', icon: 'EN', desc: 'Cada tema nuevo de conversación sube el doble de afinidad.' },
    { id: 'estudioso', name: 'Aprendiz incansable', icon: 'AI', desc: 'Las actividades de cada lugar suben tus estadísticas el doble.' },
    { id: 'pies', name: 'Pies ligeros', icon: 'PL', desc: 'Te mueves un 30 % más rápido por el mapa.' },
    { id: 'veterano', name: 'Veteran{g:o|a|e} de mil batallas', icon: 'VM', desc: 'Ventaja en todos los minijuegos.' },
  ],
  titles: [
    'la Voz de Aurelia', 'el Pulso de Nácar', 'quien Cruza el Umbral', 'la Mano del Contrapeso',
    'la Memoria de la Piedra', 'quien Escucha la Resonancia', 'el Puente entre Ciudades',
    'la Guardia de los Canales', 'el Archivo Viviente', 'quien Repara el Pacto',
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
      { id: 'harapos', label: 'Ropa de la calle' }, { id: 'abrigo', label: 'Abrigo de Aurelia' }, { id: 'uniforme', label: 'Uniforme' },
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
