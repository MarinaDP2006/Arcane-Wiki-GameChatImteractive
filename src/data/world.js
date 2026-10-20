// Mundo abierto: mapas de Piltover y Zaun, lugares, actividades,
// fragmentos del Códice y habitantes de ambiente.
window.WORLD = {
  maps: {
    piltover: {
      label: 'Piltover',
      size: [3000, 2200],
      seed: 7,
      palette: { ground: '#2a2418', street: '#4a3f2a', building: ['#d9c9a0', '#cbb68a', '#e6d8b4', '#bfa878'], roof: ['#3a8a8a', '#2f6f7a', '#8a5a3a', '#4a6a9a'], outline: '#5a4a2a', glow: '#e3c45a', particle: 'gold' },
      districts: [
        { name: 'Barrio Académico', rect: [0, 0, 1500, 900], tint: 'rgba(227,196,90,0.06)' },
        { name: 'Distrito del Consejo', rect: [1500, 0, 1500, 900], tint: 'rgba(212,167,63,0.09)' },
        { name: 'Las Terrazas Kiramman', rect: [0, 900, 1200, 800], tint: 'rgba(90,122,196,0.08)' },
        { name: 'Barrio de los Artesanos', rect: [1200, 900, 1800, 800], tint: 'rgba(168,107,58,0.08)' },
        { name: 'Los Muelles de las Hexpuertas', rect: [0, 1700, 3000, 500], tint: 'rgba(63,169,245,0.08)' },
      ],
      locations: [
        { id: 'academia', name: 'Academia de Piltover', x: 700, y: 400, icon: '🎓', codex: 'academia', activity: { label: 'Estudiar en la biblioteca', stat: 'ingenio', text: 'Pasas horas entre tratados de runas y termodinámica. Algo se te queda.' } },
        { id: 'taller-jayce', name: 'Taller de Jayce', x: 1200, y: 700, icon: '🔨', codex: 'taller-jayce' },
        { id: 'consejo', name: 'Sala del Consejo', x: 2200, y: 380, icon: '🏛️', codex: 'consejo' },
        { id: 'ejecutores', name: 'Jefatura de los Ejecutores', x: 2650, y: 800, icon: '🛡️', codex: 'ejecutores', activity: { label: 'Practicar en la galería de tiro', stat: 'valor', text: 'Respira, apunta, exhala. Las dianas caen una tras otra.' } },
        { id: 'mansion-kiramman', name: 'Mansión Kiramman', x: 500, y: 1250, icon: '🌹', codex: 'mansion-kiramman', activity: { label: 'Asistir a una gala de sociedad', stat: 'carisma', text: 'Sonrisas, brindis y cotilleos. Sales sabiendo quién odia a quién.' } },
        { id: 'plaza', name: 'Plaza del Progreso', x: 1650, y: 1150, icon: '⛲', codex: 'piltover', activity: { label: 'Actuar para los paseantes', stat: 'carisma', text: 'La gente se para, aplaude y te lanza alguna moneda.' } },
        { id: 'artesanos', name: 'Mercado de Artesanos', x: 2400, y: 1350, icon: '⚙️', codex: null, activity: { label: 'Seguir a un contrabandista', stat: 'sigilo', text: 'Lo sigues entre puestos sin que te vea. Ahora sabes dónde esconde la mercancía.' } },
        { id: 'hexpuertas', name: 'Las Hexpuertas', x: 600, y: 1950, icon: '🌀', codex: 'hexpuertas', activity: { label: 'Descargar barcos en el muelle', stat: 'valor', text: 'Cajas, cuerdas y gritos de capataz. Tus brazos lo notarán mañana.' } },
        { id: 'muelle-stillwater', name: 'Muelle de Stillwater', x: 2600, y: 1980, icon: '⛓️', codex: 'stillwater', activity: { label: 'Escuchar rumores de los guardias', stat: 'sigilo', text: 'Entre turno y turno, los guardias hablan demasiado.' } },
        { id: 'puente', name: 'Puente del Progreso', x: 1500, y: 2110, icon: '🌉', codex: 'puente', travel: { to: 'zaun', at: 'puente-zaun', label: 'Bajar a Zaun' } },
      ],
      fragments: [
        { x: 1050, y: 560, codex: 'hextec' }, { x: 900, y: 250, codex: 'yordles' }, { x: 1350, y: 820, codex: 'mercurio' },
        { x: 2050, y: 600, codex: 'consejo-f' }, { x: 2800, y: 620, codex: 'rifle' }, { x: 1800, y: 1400, codex: 'dia-progreso' },
        { x: 300, y: 1500, codex: 'magos' }, { x: 2700, y: 1550, codex: 'atlas' }, { x: 1100, y: 1880, codex: 'hexcore' },
        { x: 2950, y: 300, codex: 'runeterra' }, { x: 200, y: 2100, codex: 'noxus' },
      ],
      ambient: [
        { name: 'Vendedor de periódicos', x: 1500, y: 950, look: { skin: '#f0c8a8', hair: '#7a4a2a', style: 'short', accent: 'hat' }, colors: ['#c99a3b', '#2a2010'], lines: ['¡Extra, extra! ¡Talis presenta un nuevo invento!', '¡La hextec cambiará el mundo, dicen! ¡Lea todos los detalles!'] },
        { name: 'Estudiante de la Academia', x: 850, y: 600, look: { skin: '#d9a98a', hair: '#1a1a1a', style: 'swept', accent: 'glasses' }, colors: ['#e3c45a', '#2a2410'], lines: ['Si suspendo termodinámica, Heimerdinger me convertirá en un experimento.', '¿Has visto el laboratorio de Talis? ¡Dicen que hubo una explosión!'] },
        { name: 'Ejecutor de patrulla', x: 2350, y: 950, look: { skin: '#d8b498', hair: '#2a2a2a', style: 'short', accent: 'mustache' }, colors: ['#4a5a7a', '#141a28'], lines: ['Circule. Nada que ver aquí.', 'Dicen que han vuelto a ver a la chica de pelo azul. Ojalá no me toque turno de noche.'] },
        { name: 'Dama de sociedad', x: 650, y: 1450, look: { skin: '#f6dcc8', hair: '#c99a3b', style: 'bun', accent: 'gold' }, colors: ['#5a7ac4', '#141a2a'], lines: ['Los Kiramman dan la mejor fiesta del año. Si te invitan, claro.', 'Zaun… qué horror. Ni lo menciones en la mesa.'] },
        { name: 'Marinero extranjero', x: 900, y: 2050, look: { skin: '#8a5a3c', hair: '#3a2a1a', style: 'messy', accent: 'beard' }, colors: ['#3fa9f5', '#0a1424'], lines: ['He cruzado medio mundo y nunca vi nada como esas puertas.', 'En Noxus, dicen, ya planean cómo usar todo esto. Y no para comerciar.'] },
        { name: 'Artesana relojera', x: 2150, y: 1550, look: { skin: '#e8b89a', hair: '#d9d9d9', style: 'bun', accent: 'goggles' }, colors: ['#a86b3a', '#1e140a'], lines: ['Antes de la hextec, los relojes eran el orgullo de Piltover. Ahora nadie mira la hora.', 'Si traes piezas de Zaun, no preguntaré de dónde salen.'] },
      ],
    },
    zaun: {
      label: 'Zaun',
      size: [3000, 2200],
      seed: 13,
      palette: { ground: '#0e1614', street: '#1f2a26', building: ['#2a2a36', '#33303e', '#24302c', '#3a2c34'], roof: ['#3fbf9f', '#bf3abf', '#8fbf3a', '#e0457b'], outline: '#0a0a10', glow: '#3fbf9f', particle: 'smoke' },
      districts: [
        { name: 'Las Fábricas de Entresuelo', rect: [0, 0, 1500, 700], tint: 'rgba(143,191,58,0.07)' },
        { name: 'Barrio de las Chimeneas', rect: [1500, 0, 1500, 700], tint: 'rgba(122,138,154,0.08)' },
        { name: 'Los Callejones', rect: [0, 700, 1800, 800], tint: 'rgba(122,90,191,0.09)' },
        { name: 'El Mercado de las Tuberías', rect: [1800, 700, 1200, 800], tint: 'rgba(224,69,123,0.07)' },
        { name: 'El Sumidero', rect: [0, 1500, 3000, 700], tint: 'rgba(90,138,58,0.10)' },
      ],
      locations: [
        { id: 'puente-zaun', name: 'Puente del Progreso', x: 1500, y: 90, icon: '🌉', codex: 'puente', travel: { to: 'piltover', at: 'puente', label: 'Subir a Piltover' } },
        { id: 'fabrica', name: 'Fábrica de Brillo', x: 650, y: 330, icon: '🧪', codex: 'brillo' },
        { id: 'foso', name: 'Foso de peleas', x: 2450, y: 420, icon: '🥊', codex: null, activity: { label: 'Pelear en el foso', stat: 'valor', text: 'Recibes, devuelves y te levantas. La gente corea tu nombre.' } },
        { id: 'tejados', name: 'Tejados de las Chimeneas', x: 1950, y: 600, icon: '🏚️', codex: null, activity: { label: 'Carrera por los tejados', stat: 'sigilo', text: 'Saltas de chimenea en chimenea sin hacer ruido. Nadie te ha visto.' } },
        { id: 'ultima-gota', name: 'La Última Gota', x: 800, y: 1000, icon: '🍺', codex: 'ultima-gota', activity: { label: 'Atender la barra una noche', stat: 'carisma', text: 'Sirves tragos, separas dos peleas y escuchas tres confesiones.' } },
        { id: 'callejones', name: 'Los Callejones', x: 1350, y: 1250, icon: '🏮', codex: 'callejones' },
        { id: 'tienda-benzo', name: 'Tienda de Benzo', x: 400, y: 1300, icon: '🔧', codex: null, activity: { label: 'Reparar chatarra', stat: 'ingenio', text: 'Entre tuercas y muelles, consigues que algo vuelva a funcionar.' } },
        { id: 'mercado', name: 'Mercado de las Tuberías', x: 2400, y: 1100, icon: '🛒', codex: 'zaun', activity: { label: 'Regatear en el mercado', stat: 'carisma', text: 'Consigues el doble por la mitad. La vendedora te mira con respeto.' } },
        { id: 'sumidero', name: 'Laboratorio del Sumidero', x: 850, y: 1900, icon: '☣️', codex: 'sumidero', activity: { label: 'Analizar residuos químicos', stat: 'ingenio', text: 'Muestras, frascos y un olor terrible. Pero ahora entiendes algo más de la quimtec.' } },
        { id: 'escondite-jinx', name: 'Escondite de Jinx', x: 1750, y: 1950, icon: '💣', codex: null },
        { id: 'arbol', name: 'El Árbol de las Luciérnagas', x: 2550, y: 1850, icon: '🌳', codex: 'arbol' },
      ],
      fragments: [
        { x: 400, y: 150, codex: 'quimtec' }, { x: 1100, y: 450, codex: 'quimbarones' }, { x: 2800, y: 200, codex: 'bestias-brillo' },
        { x: 250, y: 900, codex: 'cronologia' }, { x: 1650, y: 1050, codex: 'armas-jinx' }, { x: 2850, y: 1350, codex: 'aerotabla' },
        { x: 400, y: 2050, codex: 'warwick' }, { x: 1250, y: 2100, codex: 'ascendidos' }, { x: 2200, y: 2050, codex: 'luciernagas' },
        { x: 2900, y: 1950, codex: 'zdrive' }, { x: 2100, y: 850, codex: 'rosa-negra' }, { x: 1950, y: 2120, codex: 'isha' },
      ],
      ambient: [
        { name: 'Vendedora de pinchos', x: 2250, y: 1250, look: { skin: '#b07a58', hair: '#e0457b', style: 'bun', accent: 'none' }, colors: ['#e0457b', '#2a0f1a'], lines: ['¿Pinchos? Mejor no preguntes de qué son. Pero están buenos.', 'Si buscas a Silco, no lo busques. Él te encuentra a ti.'] },
        { name: 'Niño de la calle', x: 1200, y: 1050, look: { skin: '#5a3a28', hair: '#1a1a1a', style: 'messy', accent: 'goggles' }, colors: ['#3fbf9f', '#0f1e1a'], lines: ['¿Tienes una moneda? Te enseño un atajo a cambio.', '¡Las Luciérnagas molan! Algún día volaré con ellas.'] },
        { name: 'Obrera de la fábrica', x: 900, y: 500, look: { skin: '#d9a98a', hair: '#3a2a1a', style: 'undercut', accent: 'mask' }, colors: ['#8fbf3a', '#1e2a0f'], lines: ['Doce horas respirando esto. Y luego dicen que los de abajo somos raros.', 'El jefe dice que la fábrica nueva es de Silco. Mejor no preguntar.'] },
        { name: 'Matón de un químbarón', x: 2250, y: 500, look: { skin: '#c9a080', hair: '#5a4a5a', style: 'bald', accent: 'scar' }, colors: ['#bf3abf', '#1e0a1e'], lines: ['¿Qué miras? Esto es territorio protegido.', 'Una dosis de Brillo y me como a tres ejecutores. Ja.'] },
        { name: 'Anciano del Sumidero', x: 1500, y: 1700, look: { skin: '#cfc0b5', hair: '#d9d9d9', style: 'bald', accent: 'beard' }, colors: ['#5a8a3a', '#0f1a0a'], lines: ['Yo vi la revuelta del puente. Vander era un león. Silco, su sombra.', 'Aquí abajo, la niebla lo esconde todo. Hasta a las bestias.'] },
        { name: 'Inventora callejera', x: 600, y: 1500, look: { skin: '#f0c8a8', hair: '#3fa9f5', style: 'pigtails', accent: 'goggles' }, colors: ['#3fa9f5', '#1b2550'], lines: ['Con quimtec y un poco de suerte, puedo hacer volar cualquier cosa.', 'He visto a una chica de trenzas azules hacer cohetes con latas. Un genio.'] },
      ],
    },
  },

  // Dónde se encuentra cada personaje en el mundo una vez desbloqueado.
  homes: {
    vander: 'ultima-gota', mylo: 'ultima-gota', claggor: 'ultima-gota', silco: 'ultima-gota',
    vi: 'callejones', jinx: 'escondite-jinx', benzo: 'tienda-benzo', ekko: 'arbol', scar: 'arbol',
    sevika: 'foso', singed: 'sumidero', isha: 'escondite-jinx',
    jayce: 'taller-jayce', viktor: 'academia', heimerdinger: 'academia', sky: 'academia',
    mel: 'consejo', ambessa: 'consejo', cassandra: 'mansion-kiramman', caitlyn: 'ejecutores',
    marcus: 'ejecutores', loris: 'plaza',
  },

  // Personajes que ya no se encuentran en el mapa en ciertos capítulos
  // (siguen disponibles en el comunicador como recuerdos).
  absent: {
    vander: ['z3', 'z4', 'z5', 'fin'], mylo: ['z3', 'z4', 'z5', 'fin'], claggor: ['z3', 'z4', 'z5', 'fin'],
    benzo: ['z3', 'z4', 'z5', 'fin'],
  },

  // Dónde arranca cada capítulo de la historia.
  chapterLocations: {
    z1: 'ultima-gota', z2: 'tienda-benzo', z3: 'ultima-gota', z4: 'mercado', z5: 'callejones',
    p1: 'academia', p2: 'consejo', p3: 'ejecutores', p4: 'hexpuertas', p5: 'puente',
    fin: { zaun: 'puente-zaun', piltover: 'puente' },
  },

  // Lugar de aparición según el barrio elegido al crear el personaje.
  spawns: {
    'Los Callejones': 'callejones', 'El Sumidero': 'sumidero', 'Las Fábricas de Entresuelo': 'fabrica',
    'El Mercado de las Tuberías': 'mercado', 'Barrio de las Chimeneas': 'tejados',
    'Barrio Académico': 'academia', 'Distrito del Consejo': 'consejo', 'Los Muelles de las Hexpuertas': 'hexpuertas',
    'Las Terrazas Kiramman': 'mansion-kiramman', 'Barrio de los Artesanos': 'artesanos',
  },

  maxStat: 8,
};
