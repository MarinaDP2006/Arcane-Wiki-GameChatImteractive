/* Las ciudades del Umbral: reparto, Códice, historia, chat, mapas y Atlas.
 * Las rutas internas son «aurelia» (capítulos p1-p3) y «nacar» (capítulos z1-z3).
 * Las relaciones están en relations.js y las opciones del creador en creation.js. */
(function () {
  'use strict';
  window.GAME_UNIVERSE = {
    id: 'las-ciudades-del-umbral',
    title: 'Las ciudades del Umbral',
    technology: 'Resonancia',
    parts: ['La ciudad bajo la piedra', 'El precio de la Resonancia', 'Un pacto que no se hereda'],
    cities: { aurelia: 'Aurelia', nacar: 'Nácar' }
  };

  const cast = [
    { id:'iria-venn', name:'Iria Venn', alias:'La ingeniera de contrapesos', origin:'aurelia', role:'Ingeniera y mediadora', skin:'#B98564', hair:'#242324', accent:'#B78B45', cloth:'#24384A', style:'short', eyeColor:'#77513D', summary:'Ingeniera de ascensores que confía en los planos hasta que uno registra un accidente imposible.', details:['Iria trabaja en las plataformas de Aurelia y descubre que el registro de un ascensor contradice el informe oficial.','Su objetivo es encontrar la causa sin convertir a los trabajadores en daños colaterales.'], relations:['darel-ossan','saia-merel','toren-vale'], quote:'Un mecanismo no olvida quién lo forzó.' },
    { id:'darel-ossan', name:'Darel Ossan', alias:'El mecánico de canales', origin:'nacar', role:'Mecánico y organizador vecinal', skin:'#4C3025', hair:'#5C3528', accent:'#55D6A2', cloth:'#202626', style:'curly', eyeColor:'#75A58F', summary:'Repara canales de vapor en Nácar y guarda las piezas que otras personas dan por inútiles.', details:['Darel conoce cada válvula de su barrio y sospecha que Aurelia extrae más Resonancia de la que admite.','Su lealtad nace de actos concretos, no de banderas.'], relations:['iria-venn','nyra-quell','joren-ash'], quote:'Si el puente falla, no importa quién diseñó el plano. Hay gente encima.' },
    { id:'saia-merel', name:'Saia Merel', alias:'La archivista de frecuencias', origin:'aurelia', role:'Archivista e investigadora', skin:'#C38D69', hair:'#B2A89C', accent:'#437C80', cloth:'#24384A', style:'bob', eyeColor:'#332C29', summary:'Una archivista que interpreta vibraciones geológicas y recuerda lo que los registros oficiales omiten.', details:['Saia cataloga señales de Resonancia y encuentra una serie de pulsos borrados de la historia pública.','Pregunta antes de acusar y duda incluso de sus conclusiones favoritas.'], relations:['iria-venn','oren-caldus','maelis-thorn'], quote:'Una copia perfecta también puede reproducir una mentira.' },
    { id:'toren-vale', name:'Toren Vale', alias:'El inspector de ascensores', origin:'aurelia', role:'Inspector civil', skin:'#C49A7A', hair:'#3B302B', accent:'#8B8D86', cloth:'#24384A', style:'swept', eyeColor:'#5A4636', summary:'Inspector civil atrapado entre el protocolo del Consejo y las vidas que dependen de cada ascensor.', details:['Toren quiere mantener la infraestructura en marcha, pero la investigación le obliga a cuestionar a sus superiores.','No es un héroe impecable: teme perder su empleo y al principio se refugia en las normas.'], relations:['iria-venn','maelis-thorn','bastian-rook'], quote:'El reglamento sirve para responder. No para pensar por nosotros.' },
    { id:'nyra-quell', name:'Nyra Quell', alias:'La mensajera de vapor', origin:'nacar', role:'Mensajera y exploradora', skin:'#8F5946', hair:'#121C24', accent:'#3D8E7B', cloth:'#8A4F36', style:'bun', eyeColor:'#6E9D91', summary:'Mensajera de Nácar, rápida para orientarse y más rápida aún para detectar una trampa.', details:['Nyra transporta cartas entre comunidades que no confían en los canales oficiales.','Aprendió a pedir pruebas antes de arriesgar a la gente que depende de su red.'], relations:['darel-ossan','joren-ash','edda-lume'], quote:'Llegar primero no sirve si llevas la carta equivocada.' },
    { id:'bastian-rook', name:'Bastian Rook', alias:'El mediador de gremios', origin:'aurelia', role:'Negociador y comerciante', skin:'#D0A47D', hair:'#704B32', accent:'#E8DFC9', cloth:'#727653', style:'receding', eyeColor:'#4F3D2C', summary:'Negociador que entiende que la información es una moneda y que toda deuda tiene dos versiones.', details:['Bastian ha firmado acuerdos para ambos lados y evita revelar quién le paga hasta saber qué está en juego.','Puede abrir una puerta política, pero siempre pregunta quién reparará el daño después.'], relations:['toren-vale','maelis-thorn','edda-lume'], quote:'Un trato justo deja a ambas partes con algo que proteger.' },
    { id:'oren-caldus', name:'Oren Caldus', alias:'El geólogo resonante', origin:'nacar', role:'Geólogo y técnico', skin:'#5A3B2F', hair:'#77766F', accent:'#55D6A2', cloth:'#1B2322', style:'beard', eyeColor:'#B5A579', summary:'Geólogo veterano que puede escuchar un cambio en la roca antes de que los medidores lo registren.', details:['Oren ayudó a construir la red de Resonancia y sabe que sus cimientos se apoyan en un acuerdo incompleto.','Su conocimiento no le libra de responsabilidad: también calló cuando le convenía.'], relations:['saia-merel','darel-ossan','joren-ash'], quote:'La piedra tarda en responder. Eso no significa que no recuerde.' },
    { id:'maelis-thorn', name:'Maelis Thorn', alias:'La delegada de los Canales', origin:'aurelia', role:'Política y estratega', skin:'#4B2E2C', hair:'#D9D3C9', accent:'#E8DFC9', cloth:'#24384A', style:'braids', eyeColor:'#8A8D92', summary:'Delegada de Aurelia que protege la estabilidad pública y no admite cuánto cuesta mantenerla.', details:['Maelis controla parte del presupuesto de los ascensores y teme que una verdad sin transición convierta el conflicto en represalia.','No es una villana plana: calcula las consecuencias y a veces usa ese cálculo para justificar silencio.'], relations:['saia-merel','toren-vale','bastian-rook'], quote:'La verdad importa. También importa quién puede sobrevivir a la forma en que la contamos.' },
    { id:'joren-ash', name:'Joren Ash', alias:'El médico de galerías', origin:'nacar', role:'Médico comunitario', skin:'#A87859', hair:'#603B2B', accent:'#D2E0D8', cloth:'#44564F', style:'short', eyeColor:'#4E6D5C', summary:'Médico de barrio que mide cada decisión por su efecto en personas que no pueden marcharse.', details:['Joren mantiene abierta una clínica en Nácar y trata tanto heridas de taller como enfermedades causadas por la infraestructura.','Desconfía de los discursos que convierten a la gente en cifras, pero acepta negociar si con ello evita una crisis.'], relations:['darel-ossan','nyra-quell','oren-caldus'], quote:'La urgencia no cancela el consentimiento de quienes ayudas.' },
    { id:'edda-lume', name:'Edda Lume', alias:'La piloto de plataformas', origin:'nacar', role:'Piloto y enlace', skin:'#C9A183', hair:'#322334', accent:'#B78B45', cloth:'#24384A', style:'curly', eyeColor:'#B28B40', summary:'Piloto de plataformas de carga que conoce rutas técnicas que no aparecen en los mapas oficiales.', details:['Edda transporta suministros entre niveles y nota cuándo una ruta se cierra de forma deliberada.','Su independencia es real, pero descubre que no puede mantenerse al margen de las decisiones de las dos ciudades.'], relations:['nyra-quell','bastian-rook','iria-venn'], quote:'Si un camino desaparece del mapa, alguien sigue pagando por cerrarlo.' }
  ];

  const mapPerson = p => ({
    id:p.id, name:p.name, alias:p.alias, origin:p.origin, role:p.role,
    colors:[p.accent,p.cloth], look:{skin:p.skin,hair:p.hair,style:p.style,accent:'resonance',eyeColor:p.eyeColor,eyes:'normales',brows:'normales'},
    summary:p.summary, details:p.details, spoiler:'', relations:p.relations, quote:p.quote
  });

  window.WIKI = {
    categories:[
      {id:'personajes',label:'Personajes',icon:''},
      {id:'lugares',label:'Lugares',icon:''},
      {id:'criaturas',label:'Vida geológica',icon:''},
      {id:'tecnologia',label:'Resonancia y maquinaria',icon:''},
      {id:'mundo',label:'Gremios y comunidades',icon:''}
    ],
    personajes:cast.map(mapPerson),
    lugares:[
      {id:'aurelia',name:'Aurelia',summary:'Ciudad elevada de observatorios, gremios públicos y ascensores de contrapesos.',details:['La ciudad concentra academias técnicas y redes de transporte vertical.','La prosperidad depende de infraestructura que conecta con galerías de Nácar.']},
      {id:'nacar',name:'Nácar',summary:'Ciudad subterránea construida alrededor de canales geotérmicos y talleres comunitarios.',details:['Nácar reúne mercados, clínicas, jardines de musgo y depósitos de vapor.','La ciudad es un lugar habitado, no un paisaje de ruinas: la infraestructura falla y las comunidades la sostienen.']},
      {id:'archivo',name:'Archivo de Frecuencias',city:'aurelia',summary:'Repositorio donde se registran los pulsos geológicos de la red de Resonancia.',details:['Sus copias oficiales son públicas, pero las originales solo se consultan con permiso del Consejo.']},
      {id:'observatorio',name:'Terrazas del Observatorio',city:'aurelia',summary:'Terrazas de cristal y latón desde donde se miden el cielo y la vibración de la ciudad.',details:['Los telescopios comparten cúpula con sismógrafos de Resonancia.']},
      {id:'gremios',name:'Patio de Gremios',city:'aurelia',summary:'Plaza porticada donde los gremios técnicos negocian contratos y turnos de mantenimiento.'},
      {id:'ascensor-central',name:'Ascensor Central',city:'aurelia',summary:'Plataforma de contrapesos que conecta los niveles de Aurelia y Nácar.',details:['Cada viaje queda registrado. Quién puede subir y cuándo es una decisión política.']},
      {id:'cristal',name:'Bulevar de Cristal',city:'aurelia',summary:'Avenida de escaparates y farolas de gas, orgullo de la Aurelia próspera.'},
      {id:'mercado-nacar',name:'Mercado de las Tuberías',city:'nacar',summary:'Mercado bajo una maraña de tuberías donde se compra, se repara y se cambian noticias.'},
      {id:'galerias',name:'Galerías Geotérmicas',city:'nacar',summary:'Túneles calientes donde la roca vibra y se capta la Resonancia.',details:['Algunos conductos nunca aparecieron en los mapas oficiales.']},
      {id:'jardin-musgo',name:'Jardín de Musgo',city:'nacar',summary:'Cueva húmeda cultivada por la red vecinal; da comida, aire limpio y refugio.'},
      {id:'clinica',name:'Clínica de los Tres Arcos',city:'nacar',summary:'Clínica comunitaria que atiende a quien llegue, pueda pagar o no.'},
      {id:'canal-cobre',name:'Canal de Cobre',city:'nacar',summary:'Canal principal de vapor de Nácar, con compuertas, puentes y plataformas de carga.'}
    ],
    criaturas:[{id:'polillas-de-cristal',name:'Polillas de cristal',summary:'Insectos pequeños atraídos por vibraciones suaves; sirven como indicador ambiental, no como amenaza.'}],
    tecnologia:[
      {id:'resonancia',name:'Resonancia',summary:'Tecnología que transforma vibraciones geológicas en energía controlada.',details:['Los cristales registran frecuencias del subsuelo. Un sistema de válvulas y amortiguadores convierte parte de esa vibración en trabajo mecánico.','Si se extrae más energía de la que el estrato repone, los canales pierden estabilidad.']},
      {id:'contrapesos',name:'Ascensores de contrapesos',summary:'Red pública de plataformas, frenos, cables y válvulas que mantiene conectadas las alturas.'}
    ],
    mundo:[{id:'gremios',name:'Gremios de infraestructura',summary:'Organizaciones que administran mantenimiento y seguridad con intereses a veces contradictorios.'},{id:'red-vecinal',name:'Red vecinal de Nácar',summary:'Mensajeros, médicos, reparadores y comerciantes que sostienen servicios esenciales.'}]
  };

  const lines = (speaker, text) => [{s:speaker,t:text}];
  const node = (bg, narr, choices) => ({bg,lines:lines('narrador',narr),choices});
  const choice = (t,next,fx={}) => ({t,next,fx});
  const chapter = (id,route,part,title,intro,nodes) => ({id,route,part,title,intro,start:'a',unlocks:cast.map(x=>x.id),nodes});
  window.STORY = {
    routes:{nacar:['z1','z2','z3'],aurelia:['p1','p2','p3']},
    endings:[{id:'pacto-compartido',title:'Final · Un pacto que no se hereda',scene:'ascensor-central',test:()=>true,lines:[{s:'narrador',t:'El Ascensor Central vuelve a moverse. Esta vez, el registro de cada viaje es público y lo firman las dos ciudades.'},{s:'narrador',t:'{name}, tu nombre aparece en el acta como testigo. No es una victoria completa, pero nadie heredará el pacto sin leerlo.'}]}], endings2:[], rescues:{},
    stats:{ingenio:{label:'Ingenio',icon:'Ing'},carisma:{label:'Carisma',icon:'Car'},valor:{label:'Valor',icon:'Val'},sigilo:{label:'Sigilo',icon:'Sig'}},
    cast:cast.map(x=>x.id), romanceFrom:{nacar:'z1',aurelia:'p1'}, deaths:{},
    chapters:[
      chapter('z1','nacar',1,'Parte I · La ciudad bajo la piedra','Nácar, turno de madrugada. Un ascensor se detiene entre dos niveles y el sistema registra una vibración que no aparece en los medidores.',{
        a:{bg:'canal-cobre',lines:[{s:'narrador',t:'El ascensor queda suspendido sobre un canal de vapor. {name}, {job}, ves una grieta nueva en el soporte y un pulso verdoso detrás de la roca.'},{s:'darel-ossan',t:'No toques la válvula. Si el reloj está bien, esta vibración no debería existir.'}],choices:[choice('Asegurar primero a las personas atrapadas.','b',{aff:{'darel-ossan':1},flags:['priorizo-evacuacion']}),choice('Registrar la frecuencia antes de que desaparezca.','c',{stats:{ingenio:1},flags:['registro-frecuencia']})]},
        b:{bg:'canal-cobre',lines:[{s:'darel-ossan',t:'Bien. Un informe puede esperar; quien está ahí dentro no.'},{s:'narrador',t:'La plataforma se estabiliza lo suficiente para evacuar. En una pieza del freno queda una marca que no coincide con los planos.'}],choices:[choice('Guardar la pieza para Saia.','d',{aff:{'saia-merel':1},flags:['pieza-guardada']}),choice('Entregarla a la clínica para revisar la exposición.','d',{aff:{'joren-ash':1},flags:['muestra-clinica']})]},
        c:{bg:'canal-cobre',lines:[{s:'narrador',t:'La frecuencia queda registrada en una placa de metal. El patrón suena como tres notas y una pausa larga.'},{s:'saia-merel',t:'Eso no es ruido aleatorio. Es un mensaje repetido desde antes de que se construyera este tramo.'}],choices:[choice('Compartir el registro con la comunidad.','d',{aff:{'saia-merel':1},flags:['registro-compartido']}),choice('Mantenerlo oculto hasta comparar las muestras.','d',{stats:{sigilo:1},flags:['registro-reservado']})]},
        d:{bg:'canal-cobre',lines:[{s:'narrador',t:'Al amanecer, el primer informe oficial culpa a un error de mantenimiento. Nadie menciona la marca ni la frecuencia.'}],end:true}
      }),
      chapter('p1','aurelia',1,'Parte I · La ciudad bajo la piedra','Aurelia, en la Estación de Ascensores. Un transporte público se detiene antes de una inspección y el Consejo pide una explicación en menos de una hora.',{
        a:{bg:'ascensor-central',lines:[{s:'narrador',t:'Los técnicos revisan los frenos de la plataforma. {name}, {job}, reconoces una secuencia de vibraciones que no corresponde al desgaste habitual.'},{s:'toren-vale',t:'La prioridad es reabrir el servicio. El informe puede completarse después.'}],choices:[choice('Pedir una evacuación y preservar la máquina.','b',{aff:{'toren-vale':1},flags:['aurelia-evacuacion']}),choice('Cerrar el acceso y comparar los registros.','c',{stats:{ingenio:1},flags:['aurelia-registros']})]},
        b:{bg:'ascensor-central',lines:[{s:'toren-vale',t:'Tendré que explicar la demora, pero no discutiré la evacuación.'},{s:'narrador',t:'La plataforma se vacía sin incidentes. El freno presenta una pieza cambiada por otra de una aleación no registrada.'}],choices:[choice('Enviar el hallazgo a Saia.','d',{aff:{'saia-merel':1},flags:['pieza-saia']}),choice('Entregar la pieza a Maelis bajo recibo.','d',{aff:{'maelis-thorn':1},flags:['pieza-consejo']})]},
        c:{bg:'ascensor-central',lines:[{s:'narrador',t:'El registro repite tres pulsos, una pausa y un cuarto más débil. El dato fue recortado de la copia oficial.'},{s:'saia-merel',t:'El archivo anterior conserva el mismo patrón. Alguien lo borró de forma manual.'}],choices:[choice('Hacer dos copias y compartirlas.','d',{stats:{carisma:1},flags:['copias-compartidas']}),choice('Guardar el original como prueba.','d',{stats:{sigilo:1},flags:['copia-reservada']})]},
        d:{bg:'ascensor-central',lines:[{s:'narrador',t:'El Consejo publica un comunicado sobre una incidencia menor. La evidencia que tienes no encaja con esa versión.'}],end:true}
      }),
      chapter('z2','nacar',2,'Parte II · El precio de la Resonancia','La frecuencia conduce a una galería antigua bajo Nácar, donde la roca vibra cuando los ascensores de Aurelia consumen energía.',{
        a:{bg:'galerias',lines:[{s:'narrador',t:'Darel abre una compuerta de servicio. En el interior hay marcas de herramientas de tres generaciones y un conducto que nunca apareció en los mapas.'},{s:'oren-caldus',t:'La piedra no produce energía sin límite. Si el sistema extrae demasiado, este barrio pierde presión.'}],choices:[choice('Medir antes de tocar el regulador.','b',{aff:{'oren-caldus':1},flags:['medicion-previa']}),choice('Desconectar el conducto para proteger Nácar.','c',{stats:{valor:1},flags:['conducto-cortado']})]},
        b:{bg:'galerias',lines:[{s:'saia-merel',t:'La frecuencia coincide con un acuerdo archivado y luego censurado. No dice quién dio la orden, pero conserva la fecha.'}],choices:[choice('Buscar a Maelis con el registro completo.','d',{aff:{'maelis-thorn':1},flags:['buscar-maelis']}),choice('Publicar los datos entre los barrios afectados.','d',{stats:{carisma:1},flags:['datos-publicos']})]},
        c:{bg:'galerias',lines:[{s:'darel-ossan',t:'El cierre nos dará tiempo, no una solución. Hay que saber quién conectó este conducto y por qué.'}],choices:[choice('Dejar un bypass manual para la clínica.','d',{aff:{'joren-ash':1},flags:['bypass-clinica']}),choice('Marcar el conducto para una inspección pública.','d',{aff:{'nyra-quell':1},flags:['inspeccion-publica']})]},
        d:{bg:'galerias',lines:[{s:'narrador',t:'Los registros apuntan a una red compartida entre ciudades. Cada reparación afectó a barrios que no votaron el acuerdo.'}],end:true}
      }),
      chapter('p2','aurelia',2,'Parte II · El precio de la Resonancia','Saia encuentra una copia parcial de un pacto de mantenimiento: Aurelia podía extraer energía de los estratos profundos a cambio de financiar la red pública.',{
        a:{bg:'archivo',lines:[{s:'narrador',t:'En el Archivo de Frecuencias, las páginas anteriores al tratado están numeradas, pero tres hojas fueron sustituidas.'},{s:'saia-merel',t:'No basta con demostrar que la copia falta. Hay que recuperar la señal original y quién la editó.'}],choices:[choice('Cruzar los turnos de mantenimiento.','b',{stats:{ingenio:1},flags:['cruce-turnos']}),choice('Preguntar a Bastian quién negoció la renovación.','c',{aff:{'bastian-rook':1},flags:['pregunta-bastian']})]},
        b:{bg:'archivo',lines:[{s:'toren-vale',t:'La orden salió de una oficina civil, no de una cuadrilla técnica. Mi firma está en una lista de acceso, no en la autorización.'}],choices:[choice('Anotar la diferencia y proteger al testigo.','d',{aff:{'toren-vale':1},flags:['testigo-protegido']}),choice('Llevar el registro a una sesión pública.','d',{stats:{carisma:1},flags:['sesion-publica']})]},
        c:{bg:'archivo',lines:[{s:'bastian-rook',t:'Hubo un acuerdo. Lo que no hubo fue una explicación sincera de quién pagaría el coste si fallaba.'}],choices:[choice('Pedir los términos completos por escrito.','d',{flags:['terminos-escritos']}),choice('Negociar una audiencia con Nácar.','d',{aff:{'edda-lume':1},flags:['audiencia-nacar']})]},
        d:{bg:'archivo',lines:[{s:'narrador',t:'La parte que falta del pacto está en el otro extremo de la red. No pertenece a una sola ciudad.'}],end:true}
      }),
      chapter('z3','nacar',3,'Parte III · Un pacto que no se hereda','La red entra en sobrecarga. Nácar puede aislar sus galerías, pero el cierre dejaría a varios barrios sin ventilación ni transporte.',{
        a:{bg:'mercado-nacar',lines:[{s:'narrador',t:'Las luces de la galería cambian de ritmo. Edda informa de que la plataforma principal aún puede detenerse una vez antes de que se funda el freno.'},{s:'edda-lume',t:'Si aislamos todo, salvamos el conducto y dejamos a la ciudad sin ruta. Si lo mantenemos abierto, el riesgo se reparte de forma desigual.'}],choices:[choice('Priorizar una evacuación coordinada con Aurelia.','b',{aff:{'edda-lume':1},flags:['evacuacion-coordinada']}),choice('Estabilizar la frecuencia y reducir la extracción.','c',{stats:{ingenio:1},flags:['frecuencia-estable']})]},
        b:{bg:'mercado-nacar',lines:[{s:'joren-ash',t:'Puedo coordinar los refugios, pero no acepto que se use la clínica como garantía política.'}],choices:[choice('Garantizar suministros y supervisión vecinal.','d',{aff:{'joren-ash':1},flags:['garantia-vecinal']}),choice('Pedir observadores de ambas ciudades.','d',{stats:{carisma:1},flags:['observacion-mixta']})]},
        c:{bg:'mercado-nacar',lines:[{s:'oren-caldus',t:'La Resonancia no se puede poseer como una mina. Hay que limitar lo que cada conducto extrae.'}],choices:[choice('Publicar el límite técnico y los medidores.','d',{flags:['limite-publico']}),choice('Crear una cooperativa de mantenimiento.','d',{aff:{'darel-ossan':1},flags:['cooperativa']})]},
        d:{bg:'mercado-nacar',lines:[{s:'narrador',t:'El pacto antiguo deja de ser una orden heredada. Ahora existe una propuesta que debe aprobarse, medirse y revisarse por quienes vivirán con sus consecuencias.'}],end:true}
      }),
      chapter('p3','aurelia',3,'Parte III · Un pacto que no se hereda','Aurelia puede conservar el control central de la red o reconocer un consejo compartido con los barrios conectados.',{
        a:{bg:'gremios',lines:[{s:'narrador',t:'Maelis convoca una sesión extraordinaria. En la sala hay datos suficientes para corregir el informe, pero no para decidir quién debe controlar la red.'},{s:'maelis-thorn',t:'No quiero que la verdad termine convertida en otro instrumento de represalia. Tampoco puedo pedir silencio otra vez.'}],choices:[choice('Presentar todos los registros, incluidos los que os perjudican.','b',{aff:{'maelis-thorn':1},flags:['verdad-completa']}),choice('Proponer una comisión de mantenimiento compartida.','c',{stats:{carisma:1},flags:['comision-compartida']})]},
        b:{bg:'gremios',lines:[{s:'saia-merel',t:'La prueba debe conservarse en varios archivos; ninguno podrá borrar la versión de otro.'}],choices:[choice('Crear copias públicas y auditables.','d',{flags:['archivo-publico']}),choice('Incluir a las comunidades en la inspección.','d',{aff:{'nyra-quell':1},flags:['inspeccion-comunitaria']})]},
        c:{bg:'gremios',lines:[{s:'toren-vale',t:'Una comisión solo sirve si puede detener una máquina, no si se limita a escribir recomendaciones.'}],choices:[choice('Dar capacidad de cierre a los inspectores vecinales.','d',{flags:['poder-cierre']}),choice('Exigir revisión periódica y datos abiertos.','d',{stats:{ingenio:1},flags:['revision-abierta']})]},
        d:{bg:'gremios',lines:[{s:'narrador',t:'El desenlace no borra la desigualdad ni convierte a todos en aliados. Deja una regla nueva: nadie heredará a solas el control de una energía compartida.'}],end:true}
      })
    ]
  };

  const lore = {};
  cast.forEach(p => {
    lore[p.id] = {pasado:p.details.join(' '),vinculos:'Sus relaciones cambian con decisiones, confianza y pruebas compartidas; no conoce hechos que no haya presenciado.',motivaciones:p.summary+' '+p.quote};
  });
  window.WORLD_LORE = lore;
  const voices = {
    'iria-venn':['Precisa, curiosa, explica mecanismos con ejemplos.','Valora la honestidad y se responsabiliza de los errores técnicos.','Nunca llama magia a la Resonancia ni resuelve todo con un invento instantáneo.'],
    'darel-ossan':['Directo y práctico, humor seco, frases cortas.','Mide la confianza por acciones y protección a la comunidad.','Nunca considera a Nácar un lugar desechable ni obedece sin preguntar.'],
    'saia-merel':['Habla con calma y separa hechos de hipótesis.','Pregunta antes de acusar y explica la incertidumbre.','Nunca revela datos que no posee ni afirma certeza sin pruebas.'],
    'toren-vale':['Formal, concreto, cita normas y sus límites.','Puede cambiar de opinión ante evidencias claras.','Nunca presenta el protocolo como sustituto de la responsabilidad.'],
    'nyra-quell':['Rápida, ingeniosa, evita discursos largos.','Protege los mensajes privados y a quien depende de la red.','Nunca revela una ruta segura sin consentimiento.'],
    'bastian-rook':['Elocuente sin grandilocuencia, habla en condiciones y consecuencias.','Negocia sin dar la confianza por garantizada.','Nunca ofrece un acuerdo perfecto sin costes.'],
    'oren-caldus':['Sereno, técnico y paciente.','Reconoce sus silencios del pasado.','Nunca atribuye conciencia humana a un mineral.'],
    'maelis-thorn':['Medida, política, distingue verdad y difusión.','Busca estabilidad, pero puede reconocer el daño del silencio.','Nunca se vuelve de pronto inocente ni cruel sin motivo.'],
    'joren-ash':['Cálido, firme y atento a límites.','Da prioridad a consentimiento, seguridad y cuidado colectivo.','Nunca usa la necesidad de alguien para controlar su decisión.'],
    'edda-lume':['Pragmática, observadora, con humor breve.','Prefiere rutas seguras y acuerdos verificables.','Nunca ignora la infraestructura para producir una escena espectacular.']
  };
  window.AI_VOICES = Object.fromEntries(cast.map(p => [p.id,{habla:voices[p.id][0],contigo:voices[p.id][1],nunca:voices[p.id][2]}]));
  window.CHAT = Object.fromEntries(cast.map(p => [p.id,{
    greet:{low:'Te escucho. ¿Qué necesitas?',mid:'Hola, {name}. ¿Qué has averiguado?',high:'Me alegra verte, {name}.'},
    bye:['Nos vemos cuando haya novedades.','Ten cuidado por el camino.'],
    hub:[{t:'¿Qué sabes de la Resonancia?',tone:'pregunta',go:'resonancia'},{t:'¿Qué debería hacer ahora?',tone:'astuto',go:'consejo'}],
    nodes:{
      resonancia:{say:p.quote,opts:[{t:'¿Qué riesgo te preocupa más?',tone:'pregunta',say:'Que se tomen decisiones con datos incompletos y que el coste vuelva a caer sobre los mismos barrios.',go:'hub'},{t:'Gracias por explicármelo.',tone:'amable',say:'Guarda el registro. La memoria también necesita mantenimiento.',go:'hub'}]},
      consejo:{say:p.summary,opts:[{t:'Voy a buscar pruebas antes de decidir.',tone:'serio',say:'Bien. Pregunta quién se beneficia y quién asume el riesgo.',go:'hub'},{t:'Necesito hablar con alguien de la otra ciudad.',tone:'pregunta',say:'Busca una persona que pueda contrastar los datos, no solo confirmar lo que ya crees.',go:'hub'}]}
    }
  }]));
  const cityMap=(id,label,seed,palette,locations)=>({
    label,size:[3000,2200],seed,block:id==='aurelia'?300:210,street:id==='aurelia'?96:60,cramped:id==='nacar',
    palette,districts:locations.districts,locations:locations.points,fragments:(id==='aurelia'?['aurelia','contrapesos','polillas-de-cristal','resonancia']:['nacar','red-vecinal','resonancia','polillas-de-cristal']).map((codex,i)=>({x:450+i*600,y:500+(i%2)*900,codex}))
  });
  const aurDist=[
    {name:'Plaza del Archivo',rect:[0,0,1500,900],tint:'rgba(183,139,69,0.07)'},
    {name:'Terrazas del Observatorio',rect:[1500,0,1500,900],tint:'rgba(36,56,74,0.08)'},
    {name:'Patio de Gremios',rect:[0,900,1500,700],tint:'rgba(183,139,69,0.05)'},
    {name:'Estación de Ascensores',rect:[1500,900,1500,700],tint:'rgba(36,56,74,0.07)'},
    {name:'Bulevar de Cristal',rect:[0,1600,3000,600],tint:'rgba(210,224,216,0.04)'}
  ];
  const nacDist=[
    {name:'Mercado de las Tuberías',rect:[0,0,1500,700],tint:'rgba(85,214,162,0.07)'},
    {name:'Galerías Geotérmicas',rect:[1500,0,1500,700],tint:'rgba(125,87,63,0.08)'},
    {name:'Jardín de Musgo',rect:[0,700,1500,800],tint:'rgba(85,214,162,0.04)'},
    {name:'Clínica de los Tres Arcos',rect:[1500,700,1500,800],tint:'rgba(210,224,216,0.04)'},
    {name:'Canal de Cobre',rect:[0,1500,3000,700],tint:'rgba(125,87,63,0.07)'}
  ];
  window.WORLD = {...(window.WORLD || {}), maps:{
    aurelia:cityMap('aurelia','Aurelia',7,{ground:'#292822',street:'#4C4940',building:['#E8DFC9','#CFC4AB','#D8D1C0','#B7A98B'],roof:['#24384A','#51737A','#B78B45'],outline:'#5B594F',glow:'#B78B45',particle:'gold'},{
      districts:aurDist,points:[
        {id:'archivo',name:'Archivo de Frecuencias',x:600,y:400,icon:'',codex:'archivo',activity:{label:'Comparar registros',stat:'ingenio',game:'runas',text:'Encuentras una frecuencia ausente en la copia oficial.'}},
        {id:'observatorio',name:'Terrazas del Observatorio',x:1400,y:520,icon:'',codex:'observatorio'},
        {id:'gremios',name:'Patio de Gremios',x:2200,y:650,icon:'',codex:'gremios',activity:{label:'Negociar mantenimiento',stat:'carisma',text:'Logras que dos equipos compartan un turno de revisión.'}},
        {id:'ascensor-central',name:'Estación de Ascensores',x:1900,y:1250,icon:'',codex:'ascensor-central',travel:{to:'nacar',at:'mercado-nacar',label:'Bajar a Nácar'}},
        {id:'cristal',name:'Bulevar de Cristal',x:700,y:1900,icon:'',codex:'cristal'}
      ]}),
    nacar:cityMap('nacar','Nácar',13,{ground:'#101816',street:'#27332F',building:['#26302D','#343A36','#293331','#413A34'],roof:['#55D6A2','#7D573F','#8FAF9D'],outline:'#0A0E0D',glow:'#55D6A2',particle:'smoke'},{
      districts:nacDist,points:[
        {id:'mercado-nacar',name:'Mercado de las Tuberías',x:500,y:450,icon:'',codex:'mercado-nacar',activity:{label:'Negociar repuestos',stat:'carisma',game:'regateo',text:'Consigues una válvula que servirá para la evacuación.'}},
        {id:'galerias',name:'Galerías Geotérmicas',x:1700,y:400,icon:'',codex:'galerias',activity:{label:'Medir una frecuencia',stat:'ingenio',text:'La señal coincide con el archivo antiguo.'}},
        {id:'jardin-musgo',name:'Jardín de Musgo',x:850,y:1100,icon:'',codex:'jardin-musgo'},
        {id:'clinica',name:'Clínica de los Tres Arcos',x:2100,y:1150,icon:'',codex:'clinica',activity:{label:'Ayudar en la clínica',stat:'carisma',text:'La comunidad organiza un refugio temporal.'}},
        {id:'canal-cobre',name:'Canal de Cobre',x:1500,y:1900,icon:'',codex:'canal-cobre',travel:{to:'aurelia',at:'ascensor-central',label:'Subir a Aurelia'}}
      ]})
  }};
  window.ATLAS = {
    credit:'Cartografía original conceptual de Las ciudades del Umbral.',
    places:[
      {id:'aurelia',name:'Aurelia',x:65,y:26,city:'aurelia',scene:'',codex:'aurelia',people:['iria-venn','saia-merel'],intro:'Ciudad elevada construida alrededor de observatorios, gremios y ascensores de contrapesos.',poi:[['Archivo de Frecuencias','Donde se registran las vibraciones de la red.'],['Estación de Ascensores','Punto crítico de conexión entre ciudades.']]},
      {id:'nacar',name:'Nácar',x:33,y:69,city:'nacar',scene:'',codex:'nacar',people:['darel-ossan','nyra-quell'],intro:'Ciudad subterránea de canales geotérmicos, talleres y redes vecinales.',poi:[['Mercado de las Tuberías','Repuestos, noticias y acuerdos comunitarios.'],['Clínica de los Tres Arcos','Un servicio público que no puede detenerse.']]},
      {id:'resonancia',name:'Red de Resonancia',x:49,y:48,city:null,scene:'',codex:'resonancia',people:['oren-caldus','saia-merel'],intro:'Infraestructura compartida que convierte pulsos geológicos en energía útil.',poi:[['Conductos profundos','Lugar donde se mide el coste de extraer energía.']]}
    ]
  };
})();