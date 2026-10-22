// Campaña ampliada de Grietas & Gears en dos partes. Se aplica después de story.js.
// Mantiene los IDs originales y la propiedad interna season para que puedan cargar
// las partidas antiguas. Los episodios añadidos dan agencia al personaje del jugador.
(function () {
  const S = window.STORY;
  if (!S || S.expansionV2) return;
  S.expansionV2 = true;
  S.parts = [{ id: 1, title: 'Parte I · El inicio' }, { id: 2, title: 'Parte II · Las consecuencias' }];

  // Inserta episodios antes de la conclusión de cada ruta, sin borrar sus capítulos.
  function insertBefore(route, last, chapters) {
    const list = S.routes[route];
    const pos = list.indexOf(last);
    if (pos < 0) throw new Error('La ruta no contiene su capítulo final: ' + route);
    S.chapters.push(...chapters);
    list.splice(pos, 0, ...chapters.map((chapter) => chapter.id));
  }

  const zaun = [
    {
      id: 'z9', route: 'zaun', title: 'Parte I · Capítulo 9 · El precio del silencio',
      intro: 'Un envío de filtros de aire ha desaparecido. La Última Gota, las Luciérnagas y los hombres de Silco quieren respuestas distintas de la misma persona: tú.',
      unlocks: [], start: 'a', nodes: {
        a: { bg: 'ultima-gota', lines: [
          { s: 'narrador', t: 'El aviso llega escrito en el reverso de una factura: tres cajas de filtros destinadas a {district} nunca cruzaron el puente. Reconoces la firma de quien pagó el encargo.' },
          { s: 'sevika', t: '(Golpea la factura con un dedo metálico.) Eso no es mercancía de Silco. Alguien quiere hacernos quedar como ladrones.' },
          { s: 'yo', t: 'Los filtros eran para familias que no pueden permitirse comprar aire. No son una pieza de vuestra guerra.' },
          { s: 'sevika', t: 'Entonces decide qué vas a hacer, {name}. Aquí las buenas intenciones no limpian los pulmones.' },
        ], choices: [
          { t: 'Rastrear el cargamento para devolverlo a las familias.', next: 'b', fx: { rep: { zaun: 2 }, flags: ['filtros_familias'] } },
          { t: 'Negociar con Silco para abrir una ruta segura.', next: 'c', fx: { aff: { silco: 1 }, flags: ['trato_ruta_zaun'] } },
          { t: 'Pedir a las Luciérnagas que custodien el reparto.', next: 'd', fx: { aff: { ekko: 2 }, flags: ['filtros_luciernagas'] } },
        ] },
        b: { bg: 'sumidero', lines: [
          { s: 'narrador', t: 'Pasas la noche entre almacenes. Un vigilante cobra por mirar a otro lado; tú pagas con una vieja deuda y recuperas dos de las tres cajas.' },
          { s: 'yo', t: 'No es suficiente. Pero esta noche alguien podrá dormir sin toser.' },
        ], next: 'e' },
        c: { bg: 'ultima-gota', lines: [
          { s: 'silco', t: '(Lee la factura sin levantar la voz.) Un favor útil siempre tiene un precio. La diferencia es que yo lo digo antes de cobrarlo.' },
          { s: 'yo', t: 'Quiero los filtros en Zaun, no otra deuda que deje a la ciudad de rodillas.' },
          { s: 'silco', t: 'Entonces aprenderemos cuánto vale tu palabra. Y cuánto vale la mía.' },
        ], next: 'e' },
        d: { bg: 'arbol', lines: [
          { s: 'ekko', t: 'En el árbol nadie te preguntará quién pagó el filtro. Si respiras, lo necesitas. Eso debería bastar.' },
          { s: 'narrador', t: 'Las Luciérnagas preparan una ruta por los tejados; las cajas viajan por encima de los ojos de Silco.' },
        ], next: 'e' },
        e: { bg: 'puente-zaun', lines: [
          { s: 'narrador', t: 'A la salida del turno de fábrica, la gente hace cola. Algunos te dan las gracias. Otros saben que tu decisión acabará teniendo consecuencias.' },
          { s: 'narrador', t: 'En el puente, un mensajero de Piltover te deja una nota: alguien ha descubierto el recorrido de las cajas.' },
        ], end: true },
      },
    },
    {
      id: 'z10', route: 'zaun', title: 'Parte I · Capítulo 10 · El nombre en la lista',
      intro: 'Una lista de testigos circula entre ejecutores y contrabandistas. Entre los nombres está el tuyo.',
      unlocks: [], start: 'a', nodes: {
        a: { bg: 'puente', lines: [
          { s: 'narrador', t: 'El papel lleva el sello de Piltover. Hay siete nombres marcados con tinta roja. El último es {name}.' },
          { s: 'vi', t: '(Arruga el documento.) ¿Quién hace una lista de gente que solo intentó ayudar? Dime dónde encontrarlo.' },
          { s: 'caitlyn', t: 'No todos los que llevan un uniforme han firmado esto. Dame una oportunidad para averiguar quién ordenó la vigilancia.' },
          { s: 'yo', t: 'Estoy cansad{g:o|a|e} de que todos decidan qué clase de persona soy por la ciudad donde nací.' },
        ], choices: [
          { t: 'Confiar la lista a Caitlyn y exigir una investigación.', next: 'b', fx: { aff: { caitlyn: 2 }, rep: { piltover: 1 }, flags: ['lista_investigada'] } },
          { t: 'Destruir la lista y proteger a los demás testigos.', next: 'c', fx: { aff: { vi: 1 }, rep: { zaun: 1 }, flags: ['testigos_protegidos'] } },
          { t: 'Guardar una copia y buscar quién está comerciando con los nombres.', next: 'd', fx: { stats: { ingenio: 1 }, flags: ['copia_testigos'] } },
        ] },
        b: { bg: 'mansion-kiramman', lines: [
          { s: 'caitlyn', t: '(Cierra la puerta para que no os oigan.) No voy a prometerte que esto acabará bien. Puedo prometerte que no pienso mirar hacia otro lado.' },
          { s: 'narrador', t: 'Al salir ves por primera vez cuánto cuesta, para alguien de Piltover, admitir que la ley también puede hacer daño.' },
        ], next: 'e' },
        c: { bg: 'puente-zaun', lines: [
          { s: 'vi', t: 'Bien. Que vengan a buscarme a mí. (Se queda callada.) No. Olvídalo. Ya he hecho demasiadas veces eso de elegir por los demás.' },
          { s: 'narrador', t: 'Arde la última página, pero recuerdas los nombres. El secreto ahora pesa más que el papel.' },
        ], next: 'e' },
        d: { bg: 'ultima-gota', lines: [
          { s: 'sevika', t: 'Una copia es poder. Guárdala donde nadie sepa que existe. Ni siquiera yo.' },
          { s: 'narrador', t: 'El traidor no se deja ver. Solo descubres que alguien tiene interés en que las dos ciudades sospechen la una de la otra.' },
        ], next: 'e' },
        e: { bg: 'puente', lines: [
          { s: 'narrador', t: 'Esa noche miras el puente desde la orilla. Antes pensabas que había dos ciudades. Ahora ves una misma herida, y te has metido dentro.' },
        ], end: true },
      },
    },
  ];
  const piltover = [
    {
      id: 'p9', route: 'piltover', title: 'Parte I · Capítulo 9 · Una grieta en el mármol',
      intro: 'El Consejo recibe una denuncia sobre filtros de aire desviados de Zaun. Tu firma aparece en el expediente antes de que puedas leerlo.',
      unlocks: [], start: 'a', nodes: {
        a: { bg: 'consejo', lines: [
          { s: 'mel', t: 'Es curioso, {name}: nunca faltan firmas para una celebración. Para responder por una injusticia, de pronto todos olvidan cómo se escribe su nombre.' },
          { s: 'jayce', t: 'Si esos filtros podían salvar vidas, alguien usó la hextecnología para ocultar el robo. Eso es lo contrario de lo que intentábamos construir.' },
          { s: 'yo', t: 'Entonces dejad de discutirlo como un problema de reputación. Hay gente esperando aire limpio.' },
        ], choices: [
          { t: 'Hacer pública la denuncia aunque salpique al Consejo.', next: 'b', fx: { rep: { zaun: 2 }, flags: ['denuncia_publica'] } },
          { t: 'Investigar los registros con Jayce antes de acusar.', next: 'c', fx: { aff: { jayce: 2 }, stats: { ingenio: 1 }, flags: ['registros_hextec'] } },
          { t: 'Negociar con Mel una entrega inmediata y discreta.', next: 'd', fx: { aff: { mel: 2 }, flags: ['acuerdo_filtros'] } },
        ] },
        b: { bg: 'puente', lines: [
          { s: 'narrador', t: 'La noticia corre por los pasillos más rápido que tú. Tu familia recibe preguntas incómodas; en Zaun, alguien pronuncia tu nombre sin escupir.' },
        ], next: 'e' },
        c: { bg: 'taller-jayce', lines: [
          { s: 'jayce', t: 'Alguien cambió la hora de salida de los carros. No es un error. Es una orden con sello oficial.' },
          { s: 'narrador', t: 'La prueba es pequeña pero suficiente: un número cambiado puede privar de aire a un barrio entero.' },
        ], next: 'e' },
        d: { bg: 'consejo', lines: [
          { s: 'mel', t: 'La solución llegará antes que el discurso. Pero recuerda esto: cuando arreglas algo en secreto, otros pueden fingir que nunca estuvo roto.' },
        ], next: 'e' },
        e: { bg: 'puente', lines: [
          { s: 'narrador', t: 'Las cajas cruzan la frontera mientras dos guardias discuten sobre jurisdicciones. En la otra orilla espera una familia que solo quiere respirar.' },
        ], end: true },
      },
    },
    {
      id: 'p10', route: 'piltover', title: 'Parte I · Capítulo 10 · Los nombres que faltan',
      intro: 'Al investigar el sabotaje descubres una lista de testigos de Zaun. Algunos ya han desaparecido.',
      unlocks: [], start: 'a', nodes: {
        a: { bg: 'mansion-kiramman', lines: [
          { s: 'caitlyn', t: 'Mira las fechas. Todos declararon antes de que desapareciera el cargamento. Alguien ha usado nuestras oficinas para asustarlos.' },
          { s: 'vi', t: 'Lo que os falta no son pruebas. Es bajar y escuchar a la gente sin apuntarle primero.' },
          { s: 'yo', t: 'Si seguimos discutiendo sobre quién tiene la culpa, alguien más va a desaparecer.' },
        ], choices: [
          { t: 'Bajar a Zaun con Vi para hablar directamente con los testigos.', next: 'b', fx: { aff: { vi: 2 }, rep: { zaun: 1 }, flags: ['testigos_zaun'] } },
          { t: 'Presentar las pruebas a Caitlyn y proteger los registros.', next: 'c', fx: { aff: { caitlyn: 2 }, flags: ['pruebas_kiramman'] } },
          { t: 'Usar tus contactos para trasladar a los testigos a un refugio.', next: 'd', fx: { stats: { carisma: 1 }, flags: ['refugio_testigos'] } },
        ] },
        b: { bg: 'ultima-gota', lines: [
          { s: 'vi', t: 'No hagas promesas bonitas. Diles lo que puedes hacer y lo que no. Aquí la gente ya ha oído suficiente de Piltover.' },
          { s: 'narrador', t: 'Escuchas una historia que no aparece en ningún documento oficial.' },
        ], next: 'e' },
        c: { bg: 'consejo', lines: [
          { s: 'caitlyn', t: 'Pueden retirarme la placa. (Toma la carpeta.) No pueden hacer que no haya leído esto.' },
          { s: 'narrador', t: 'Su decisión no arregla la ciudad, pero cambia lo que estás dispuest{g:o|a|e} a pedirle a sus instituciones.' },
        ], next: 'e' },
        d: { bg: 'arbol', lines: [
          { s: 'ekko', t: 'Un refugio es más que un techo. Hay que cuidar que nadie venda su ubicación. Si quieres ayudar, empieza por no decirle a nadie dónde estamos.' },
        ], next: 'e' },
        e: { bg: 'puente', lines: [
          { s: 'narrador', t: 'Antes del amanecer, recibes un mensaje anónimo: «El Consejo está a punto de votar. No apartes la vista del cielo».' },
        ], end: true },
      },
    },
  ];
  const consequences = [
    {
      id: 't7', route: 't2', title: 'Parte II · Capítulo 7 · La ciudad de los ausentes',
      intro: 'Hay lugares donde nadie pregunta de qué lado estuviste. Solo quieren saber a quién han perdido.',
      unlocks: [], start: 'a', nodes: {
        a: { bg: 'puente-zaun', lines: [
          { s: 'narrador', t: 'Junto al puente han colgado nombres de desaparecidos. Algunos pertenecen a personas a las que prometiste volver a ver.' },
          { s: 'vi', t: 'No quiero que me digas que va a estar todo bien. Dime qué vamos a hacer mañana.' },
          { s: 'ekko', t: 'He contado tres familias que necesitan refugio antes del anochecer. Todo lo demás puede esperar.' },
        ], choices: [
          { t: 'Organizar refugios con Ekko y repartir provisiones.', next: 'b', fx: { aff: { ekko: 2 }, rep: { zaun: 2 }, flags: ['refugios_consecuencias'] } },
          { t: 'Acompañar a Vi y escuchar lo que no consigue decir.', next: 'c', fx: { aff: { vi: 2 }, flags: ['acompanaste_vi'] } },
          { t: 'Pedir a Caitlyn que abra un paso seguro por el puente.', next: 'd', fx: { aff: { caitlyn: 1 }, rep: { piltover: 1 }, flags: ['paso_humanitario'] } },
        ] },
        b: { bg: 'arbol', lines: [
          { s: 'ekko', t: 'No has preguntado qué ganas tú. En estos tiempos eso vale más de lo que crees. (Te pasa una caja.) Vamos, quedan otras seis.' },
        ], next: 'e' },
        c: { bg: 'ultima-gota', lines: [
          { s: 'vi', t: '(Mira la puerta cerrada.) Hay días en los que lo único que consigo hacer es seguir aquí. Gracias por no exigirme algo más.' },
        ], next: 'e' },
        d: { bg: 'puente', lines: [
          { s: 'caitlyn', t: 'Haré lo posible. Pero no daré órdenes que pongan a los refugiados bajo el control de quien les hizo huir.' },
        ], next: 'e' },
        e: { bg: 'puente-zaun', lines: [
          { s: 'narrador', t: 'El pequeño convoy cruza al caer la tarde. No es una victoria que anuncie nadie; aun así, has cambiado el destino de varias personas.' },
        ], end: true },
      },
    },
    {
      id: 't8', route: 't2', title: 'Parte II · Capítulo 8 · La última negociación',
      intro: 'Antes de la batalla, todavía existe una oportunidad de decidir a quién proteger y qué verdad sacar a la luz.',
      unlocks: [], start: 'a', nodes: {
        a: { bg: 'consejo', lines: [
          { s: 'mel', t: 'Mi madre sabe convertir cada conversación en una batalla. Si vamos a enfrentarnos a ella, necesitamos algo más que rabia.' },
          { s: 'sevika', t: 'Zaun no va a pagar otra guerra por las ambiciones de Piltover. Si queréis aliados, tratadnos como tales.' },
          { s: 'yo', t: 'Entonces no quiero una promesa. Quiero un acuerdo que ambas ciudades tengan motivos para cumplir.' },
        ], choices: [
          { t: 'Exigir representación de Zaun en el consejo de emergencia.', next: 'b', fx: { rep: { zaun: 2 }, flags: ['voz_zaun'] } },
          { t: 'Pedir a Mel que desenmascare a quienes alimentan la guerra.', next: 'c', fx: { aff: { mel: 2 }, flags: ['verdad_noxus'] } },
          { t: 'Organizar con Caitlyn la evacuación antes de atacar.', next: 'd', fx: { aff: { caitlyn: 1 }, flags: ['evacuacion_previa'] } },
        ] },
        b: { bg: 'consejo', lines: [
          { s: 'sevika', t: 'No quiero vuestra silla por caridad. Quiero que cuando alguien de Zaun hable, tenga el mismo peso que cualquiera aquí arriba.' },
        ], next: 'e' },
        c: { bg: 'mansion-kiramman', lines: [
          { s: 'mel', t: 'Una verdad a destiempo puede matar tanto como una mentira. (Dobla la carta.) Pero ya hemos esperado demasiado.' },
        ], next: 'e' },
        d: { bg: 'puente', lines: [
          { s: 'caitlyn', t: 'Evacuaremos primero. Si después me llaman cobarde, que lo hagan delante de la gente que ha conseguido volver a casa.' },
        ], next: 'e' },
        e: { bg: 'puente', lines: [
          { s: 'narrador', t: 'El aire huele a metal y lluvia. Mañana, el puente será un campo de batalla. Esta noche recuerdas que la política también es decidir quién llega vivo al amanecer.' },
        ], end: true },
      },
    },
  ];

  insertBefore('zaun', 'fin', zaun);
  insertBefore('piltover', 'fin', piltover);
  insertBefore('t2', 'fin2', consequences);

  // Los títulos visibles pasan a dos partes; los IDs de los guardados no cambian.
  for (const chapter of S.chapters) {
    if (/^T2 · /.test(chapter.title)) chapter.title = chapter.title.replace(/^T2 · /, 'Parte II · ');
    else if (chapter.id === 'fin') chapter.title = 'Parte I · Final · El Puente';
    else if (!/^Parte [I]+ · /.test(chapter.title) && chapter.route !== 't2') chapter.title = 'Parte I · ' + chapter.title;
  }
})();
