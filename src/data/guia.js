// Guía rápida sin spoilers del universo original. Los IDs piltover/zaun se conservan por compatibilidad;
// la interfaz los presenta como Aurelia y Nácar.
window.GUIA = {
  titulo: 'Guía rápida: quién es quién',
  intro: {
    zaun: 'Empiezas en Nácar, la ciudad bajo la piedra: talleres, canales geotérmicos y comunidades que mantienen la maquinaria funcionando. Estas son las personas que conocerás primero.',
    piltover: 'Empiezas en Aurelia, la ciudad elevada: observatorios, plazas de piedra clara, gremios y ascensores de contrapesos. Estas son las personas que conocerás primero.',
    t2: 'La investigación ha cambiado los vínculos entre ambas ciudades. Antes de continuar, repasa a quienes participan en la siguiente parte de la campaña.',
  },
  orden: {
    zaun: ['darel-ossan', 'nyra-quell', 'oren-caldus', 'joren-ash', 'edda-lume'],
    piltover: ['iria-venn', 'saia-merel', 'toren-vale', 'bastian-rook', 'maelis-thorn'],
    t2: ['iria-venn', 'darel-ossan', 'saia-merel', 'toren-vale', 'nyra-quell', 'bastian-rook', 'oren-caldus', 'maelis-thorn', 'joren-ash', 'edda-lume'],
  },
  otros: {
    zaun: 'Aurelia también depende de los técnicos, archivistas e inspectores que mantienen los ascensores y los registros de Resonancia.',
    piltover: 'Bajo la meseta, Nácar sostiene los canales geotérmicos y conserva datos que no aparecen en los informes públicos.',
    t2: 'Ningún personaje conoce toda la verdad. Contrasta testimonios y recuerda quién estuvo presente en cada escena.',
  },
  fichas: {
    'iria-venn': { titulo:'La ingeniera de contrapesos', quien:'Ingeniera de ascensores de Aurelia. Confía en los planos, las mediciones y la responsabilidad técnica.', porque:'Un registro contradice el informe oficial de un accidente y decide investigarlo sin poner a los trabajadores en peligro.' },
    'darel-ossan': { titulo:'El mecánico de canales', quien:'Repara válvulas y canales de vapor en Nácar. Conoce la infraestructura que mantiene vivos a sus vecinos.', porque:'Sospecha que Aurelia extrae más Resonancia de la que reconoce y guarda las piezas que podrían demostrarlo.' },
    'saia-merel': { titulo:'La archivista de frecuencias', quien:'Interpreta vibraciones geológicas y cataloga los registros de Resonancia.', porque:'Encuentra pulsos borrados del archivo público y necesita distinguir pruebas de rumores.' },
    'toren-vale': { titulo:'El inspector de ascensores', quien:'Inspector civil de Aurelia, atrapado entre el protocolo del Consejo y las personas que dependen de cada ascensor.', porque:'Una inspección rutinaria le obliga a cuestionar un informe firmado por sus superiores.' },
    'nyra-quell': { titulo:'La mensajera de vapor', quien:'Mensajera y exploradora de Nácar. Conecta comunidades por rutas que no aparecen en los mapas oficiales.', porque:'Sabe que una entrega a tiempo puede salvar una jornada, pero una ruta revelada sin permiso puede poner vidas en riesgo.' },
    'bastian-rook': { titulo:'El mediador de gremios', quien:'Negociador que conoce tanto los salones de Aurelia como los talleres de Nácar.', porque:'Puede abrir una puerta política, aunque siempre pregunta quién asumirá el coste del acuerdo.' },
    'oren-caldus': { titulo:'El geólogo resonante', quien:'Geólogo veterano capaz de reconocer cambios en la roca antes de que los medidores los registren.', porque:'Ayudó a construir la red de Resonancia y sabe que el pacto original omitió información importante.' },
    'maelis-thorn': { titulo:'La delegada de los Canales', quien:'Política de Aurelia que controla parte del presupuesto de los ascensores y busca evitar una crisis pública.', porque:'Debe elegir entre proteger la estabilidad y reconocer el daño causado por años de silencio.' },
    'joren-ash': { titulo:'El médico de galerías', quien:'Médico comunitario que mantiene abierta la Clínica de los Tres Arcos en Nácar.', porque:'Mide cada decisión por sus consecuencias para quienes no pueden abandonar la ciudad.' },
    'edda-lume': { titulo:'La piloto de plataformas', quien:'Pilota plataformas de carga y conoce rutas técnicas que no aparecen en los mapas públicos.', porque:'Descubre que algunas rutas se cierran de forma deliberada y que mantenerse al margen también tiene consecuencias.' },
  },
};
