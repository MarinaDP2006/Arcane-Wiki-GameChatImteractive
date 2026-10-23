// Guía rápida de personajes. Se enseña antes del primer capítulo, según la ciudad elegida,
// y al empezar la Parte II. Sin spoilers: cuenta quién es cada uno, no lo que le pasará.
window.GUIA = {
  titulo: 'Guía rápida: ¿quién es quién?',
  intro: {
    nacar: 'Empiezas en Nácar, la ciudad bajo la piedra: canales de vapor, talleres, clínicas y una red vecinal que lo sostiene todo a mano. Estas son las personas que vas a conocer primero.',
    aurelia: 'Empiezas en Aurelia, la ciudad elevada: observatorios, gremios técnicos y ascensores de contrapesos. Estas son las personas que vas a conocer primero.',
    t2: 'La avería ya no es solo una avería. Los archivos no cuadran y las dos ciudades empiezan a mirarse con desconfianza. Un repaso antes de seguir.',
  },
  // Orden en que se presentan. «otros» se nombran al final en una línea.
  orden: {
    nacar: ['darel-ossan', 'nyra-quell', 'joren-ash', 'oren-caldus', 'edda-lume'],
    aurelia: ['iria-venn', 'toren-vale', 'saia-merel', 'maelis-thorn', 'bastian-rook'],
    t2: ['oren-caldus', 'maelis-thorn', 'bastian-rook', 'edda-lume'],
  },
  otros: {
    nacar: 'Arriba, en Aurelia, oirás hablar de Iria Venn, la ingeniera de contrapesos, y de Saia Merel, la archivista.',
    aurelia: 'Abajo, en Nácar, oirás hablar de Darel Ossan, el mecánico de canales, y de la red de mensajería de Nyra Quell.',
    t2: 'Y quienes ya conoces siguen ahí, pero ahora todos saben un poco más de lo que quisieran.',
  },
  fichas: {
    'iria-venn': { titulo: 'La ingeniera de contrapesos', quien: 'Ingeniera de ascensores en Aurelia. Confía en los planos más que en las personas, hasta que un plano le miente.', porque: 'El registro de un freno contradice el informe oficial y no piensa firmar algo que no entiende.' },
    'darel-ossan': { titulo: 'El mecánico de canales', quien: 'Repara canales de vapor en Nácar y guarda las piezas que nadie quiere.', porque: 'Sospecha que Aurelia extrae más Resonancia de la que admite, y es su barrio el que se queda sin presión.' },
    'saia-merel': { titulo: 'La archivista de frecuencias', quien: 'Cataloga las vibraciones de la roca en el Archivo de Frecuencias de Aurelia.', porque: 'Ha encontrado pulsos borrados de la historia pública y quiere saber quién los borró.' },
    'toren-vale': { titulo: 'El inspector de ascensores', quien: 'Inspector civil de Aurelia, atrapado entre el reglamento y la gente que va dentro de cada ascensor.', porque: 'Teme perder su puesto, pero empieza a dudar de las órdenes que recibe.' },
    'nyra-quell': { titulo: 'La mensajera de vapor', quien: 'Lleva cartas entre las comunidades de Nácar que no se fían de los canales oficiales.', porque: 'Protege a la gente que depende de su red y no arriesga a nadie sin pruebas.' },
    'bastian-rook': { titulo: 'El mediador de gremios', quien: 'Negociador de Aurelia que ha firmado acuerdos para los dos lados.', porque: 'Sabe que la información es moneda y nunca dice quién le paga hasta saber qué está en juego.' },
    'oren-caldus': { titulo: 'El geólogo resonante', quien: 'Geólogo veterano de Nácar que oye los cambios de la roca antes que los medidores.', porque: 'Ayudó a construir la red de Resonancia y sabe que se apoya en un acuerdo incompleto.' },
    'maelis-thorn': { titulo: 'La delegada de los Canales', quien: 'Delegada del Consejo de Aurelia que controla parte del presupuesto de los ascensores.', porque: 'Teme que una verdad contada de golpe convierta el conflicto en represalias.' },
    'joren-ash': { titulo: 'El médico de galerías', quien: 'Médico de barrio en Nácar que trata heridas de taller y enfermedades de la infraestructura.', porque: 'Mide cada decisión por su efecto en quienes no pueden marcharse.' },
    'edda-lume': { titulo: 'La piloto de plataformas', quien: 'Piloto de plataformas de carga que conoce rutas que no salen en los mapas.', porque: 'Quiere seguir siendo independiente, pero las dos ciudades no la van a dejar al margen.' },
  },
};
