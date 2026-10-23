// Datos base de compatibilidad del mundo abierto; las ciudades visibles se sustituyen por Aurelia y Nácar en original-world.js.
// lugares y actividades. En las calles solo
// aparecen los protagonistas originales, no hay habitantes genéricos.
window.WORLD = {
  maps: {
    piltover: {
      label: 'Piltover',
      size: [3000, 2200],
      seed: 7,
      block: 300, street: 96, // bulevares anchos
      palette: { ground: '#2a2418', street: '#4a3f2a', building: ['#d9c9a0', '#cbb68a', '#e6d8b4', '#bfa878'], roof: ['#4f9a8c', '#3f7f7a', '#9a5a3a', '#5e6670'], outline: '#5a4a2a', glow: '#e3c45a', particle: 'gold' },
      districts: [
        { name: 'Barrio Académico', rect: [0, 0, 1500, 900], tint: 'rgba(227,196,90,0.06)' },
        { name: 'Distrito del Consejo', rect: [1500, 0, 1500, 900], tint: 'rgba(212,167,63,0.09)' },
        { name: 'Las Terrazas Kiramman', rect: [0, 900, 1200, 800], tint: 'rgba(90,122,196,0.08)' },
        { name: 'Barrio de los Artesanos', rect: [1200, 900, 1800, 800], tint: 'rgba(168,107,58,0.08)' },
        { name: 'Los Muelles de las Hexpuertas', rect: [0, 1700, 3000, 500], tint: 'rgba(63,169,245,0.08)' },
      ],
      locations: [
        { id: 'academia', name: 'Academia de Piltover', x: 700, y: 400, icon: '', codex: 'academia', activity: { label: 'Descifrar runas con Heimerdinger', stat: 'ingenio', game: 'runas', text: 'Pasas horas entre tratados de runas y termodinámica. Algo se te queda.' } },
        { id: 'taller-jayce', name: 'Taller de Jayce', x: 1200, y: 700, icon: '', codex: 'taller-jayce', activity: { label: 'Ajustar un circuito hextec', stat: 'ingenio', game: 'circuito', text: 'La gema se estabiliza en tus manos. Jayce silba admirado.' } },
        { id: 'consejo', name: 'Sala del Consejo', x: 2200, y: 380, icon: '', codex: 'consejo' },
        { id: 'ejecutores', name: 'Jefatura de los Ejecutores', x: 2650, y: 800, icon: '', codex: 'ejecutores', activity: { label: 'Practicar en la galería de tiro', stat: 'valor', game: 'tiro', text: 'Respira, apunta, exhala. Las dianas caen una tras otra.' } },
        { id: 'mansion-kiramman', name: 'Mansión Kiramman', x: 500, y: 1250, icon: '', codex: 'mansion-kiramman', activity: { label: 'Asistir a una gala de sociedad', stat: 'carisma', text: 'Sonrisas, brindis y cotilleos. Sales sabiendo quién odia a quién.' } },
        { id: 'plaza', name: 'Plaza del Progreso', x: 1650, y: 1150, icon: '', codex: 'piltover', activity: { label: 'Actuar para los paseantes', stat: 'carisma', text: 'La gente se para, aplaude y te lanza alguna moneda.' } },
        { id: 'artesanos', name: 'Mercado de Artesanos', x: 2400, y: 1350, icon: '', codex: null, activity: { label: 'Seguir a un contrabandista', stat: 'sigilo', text: 'Lo sigues entre puestos sin que te vea. Ahora sabes dónde esconde la mercancía.' } },
        { id: 'hexpuertas', name: 'Las Hexpuertas', x: 600, y: 1950, icon: '', codex: 'hexpuertas', activity: { label: 'Descargar barcos en el muelle', stat: 'valor', text: 'Cajas, cuerdas y gritos de capataz. Tus brazos lo notarán mañana.' } },
        { id: 'muelle-stillwater', name: 'Muelle de Stillwater', x: 2600, y: 1980, icon: '', codex: 'stillwater', activity: { label: 'Escuchar rumores de los guardias', stat: 'sigilo', text: 'Entre turno y turno, los guardias hablan demasiado.' } },
        { id: 'puente', name: 'Puente del Progreso', x: 1500, y: 2110, icon: '', codex: 'puente', travel: { to: 'zaun', at: 'puente-zaun', label: 'Bajar a Zaun' } },
      ],
      fragments: [
        { x: 1050, y: 560, codex: 'hextec' }, { x: 900, y: 250, codex: 'yordles' }, { x: 1350, y: 820, codex: 'mercurio' },
        { x: 2050, y: 600, codex: 'consejo-f' }, { x: 2800, y: 620, codex: 'rifle' }, { x: 1800, y: 1400, codex: 'dia-progreso' },
        { x: 300, y: 1500, codex: 'magos' }, { x: 2700, y: 1550, codex: 'atlas' }, { x: 1100, y: 1880, codex: 'hexcore' },
        { x: 2950, y: 300, codex: 'runeterra' }, { x: 200, y: 2100, codex: 'noxus' },
      ],
    },
    zaun: {
      label: 'Zaun',
      size: [3000, 2200],
      seed: 13,
      block: 210, street: 60, cramped: true, // callejones estrechos
      palette: { ground: '#0e1614', street: '#1f2a26', building: ['#2a2a36', '#33303e', '#24302c', '#3a2c34'], roof: ['#3fbf9f', '#bf3abf', '#8fbf3a', '#e0457b'], outline: '#0a0a10', glow: '#3fbf9f', particle: 'smoke' },
      districts: [
        { name: 'Las Fábricas de Entresuelo', rect: [0, 0, 1500, 700], tint: 'rgba(143,191,58,0.07)' },
        { name: 'Barrio de las Chimeneas', rect: [1500, 0, 1500, 700], tint: 'rgba(122,138,154,0.08)' },
        { name: 'Los Callejones', rect: [0, 700, 1800, 800], tint: 'rgba(122,90,191,0.09)' },
        { name: 'El Mercado de las Tuberías', rect: [1800, 700, 1200, 800], tint: 'rgba(224,69,123,0.07)' },
        { name: 'El Sumidero', rect: [0, 1500, 3000, 700], tint: 'rgba(90,138,58,0.10)' },
      ],
      locations: [
        { id: 'puente-zaun', name: 'Puente del Progreso', x: 1500, y: 90, icon: '', codex: 'puente', travel: { to: 'piltover', at: 'puente', label: 'Subir a Piltover' } },
        { id: 'fabrica', name: 'Fábrica de Brillo', x: 650, y: 330, icon: '', codex: 'brillo' },
        { id: 'foso', name: 'Foso de peleas', x: 2450, y: 420, icon: '', codex: null, activity: { label: 'Pelear en el foso', stat: 'valor', game: 'foso', text: 'Recibes, devuelves y te levantas. La gente corea tu nombre.' } },
        { id: 'tejados', name: 'Tejados de las Chimeneas', x: 1950, y: 600, icon: '', codex: null, activity: { label: 'Carrera por los tejados', stat: 'sigilo', game: 'tejados', text: 'Saltas de chimenea en chimenea sin hacer ruido. Nadie te ha visto.' } },
        { id: 'ultima-gota', name: 'La Última Gota', x: 800, y: 1000, icon: '', codex: 'ultima-gota', activity: { label: 'Atender la barra una noche', stat: 'carisma', text: 'Sirves tragos, separas dos peleas y escuchas tres confesiones.' } },
        { id: 'callejones', name: 'Los Callejones', x: 1350, y: 1250, icon: '', codex: 'callejones' },
        { id: 'tienda-benzo', name: 'Tienda de Benzo', x: 400, y: 1300, icon: '', codex: null, activity: { label: 'Reparar chatarra con Benzo', stat: 'ingenio', game: 'circuito', text: 'Entre tuercas y muelles, consigues que algo vuelva a funcionar.' } },
        { id: 'mercado', name: 'Mercado de las Tuberías', x: 2400, y: 1100, icon: '', codex: 'zaun', activity: { label: 'Regatear en el mercado', stat: 'carisma', game: 'regateo', text: 'Consigues el doble por la mitad. La vendedora te mira con respeto.' } },
        { id: 'sumidero', name: 'Laboratorio del Sumidero', x: 850, y: 1900, icon: '', codex: 'sumidero', activity: { label: 'Analizar residuos químicos', stat: 'ingenio', text: 'Muestras, frascos y un olor terrible. Pero ahora entiendes algo más de la quimtec.' } },
        { id: 'escondite-jinx', name: 'Escondite de Jinx', x: 1750, y: 1950, icon: '', codex: null },
        { id: 'invernadero', name: 'Invernadero oculto de Zaun', x: 2090, y: 1660, icon: '', codex: null },
        { id: 'arbol', name: 'El Árbol de las Luciérnagas', x: 2550, y: 1850, icon: '', codex: 'arbol', activity: { label: 'Volar en aerotabla', stat: 'sigilo', game: 'aerotabla', text: 'Las Luciérnagas te enseñan sus rutas secretas por las profundidades.' } },
      ],
      fragments: [
        { x: 400, y: 150, codex: 'quimtec' }, { x: 1100, y: 450, codex: 'quimbarones' }, { x: 2800, y: 200, codex: 'bestias-brillo' },
        { x: 250, y: 900, codex: 'cronologia' }, { x: 1650, y: 1050, codex: 'armas-jinx' }, { x: 2850, y: 1350, codex: 'aerotabla' },
        { x: 400, y: 2050, codex: 'warwick' }, { x: 1250, y: 2100, codex: 'ascendidos' }, { x: 2200, y: 2050, codex: 'luciernagas' },
        { x: 2900, y: 1950, codex: 'zdrive' }, { x: 2100, y: 850, codex: 'rosa-negra' }, { x: 1950, y: 2120, codex: 'isha' },
      ],
    },
  },

  // Dónde se encuentra cada personaje en el mundo una vez desbloqueado.
  homes: {
    vander: 'ultima-gota', silco: 'ultima-gota',
    vi: 'callejones', jinx: 'escondite-jinx', ekko: 'arbol', 
    sevika: 'foso', isha: 'escondite-jinx',
    jayce: 'taller-jayce', viktor: 'academia', heimerdinger: 'academia', 
    mel: 'consejo', ambessa: 'consejo', cassandra: 'mansion-kiramman', caitlyn: 'ejecutores',
    maddie: 'consejo', kino: 'consejo',
  },

  // Personajes que ya no se encuentran en el mapa en ciertos capítulos
  // (siguen disponibles en el comunicador como recuerdos).
  absent: {
    vander: ['z3', 'z4', 'z5', 'fin'], 
    
  },

  // Dónde arranca cada capítulo de la historia.
  chapterLocations: {
    z1: 'ultima-gota', z2: 'tienda-benzo', z3: 'ultima-gota', z4: 'mercado', z5: 'callejones',
    z6: 'foso', z7: 'tejados', z8: 'sumidero', z9: 'ultima-gota', z10: 'puente',
    p1: 'academia', p2: 'consejo', p3: 'ejecutores', p4: 'hexpuertas', p5: 'puente',
    p6: 'ejecutores', p7: 'academia', p8: 'arbol', p9: 'consejo', p10: 'mansion-kiramman',
    fin: { zaun: 'puente-zaun', piltover: 'puente' },
    t1: 'consejo', t2: 'escondite-jinx', t3: 'fabrica', t4: 'consejo', t5: 'sumidero', t6: 'arbol', t7: 'puente-zaun', t8: 'consejo', fin2: 'puente',
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
