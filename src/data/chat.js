// Diálogos libres con personajes desbloqueados (modo sin IA).
// voice: parámetros de síntesis de voz. topics: palabras clave -> respuestas.
// Las respuestas pueden usar las mismas plantillas que la historia.
window.CHAT = {
  vi: {
    voice: { pitch: 0.9, rate: 1.05, gender: 'f' },
    greet: { low: 'Ah. Eres tú. ¿Qué quieres?', mid: 'Hey, {name}. ¿Todo bien?', high: '¡{name}! Ven aquí, que te debo una ronda.' },
    topics: [
      { label: 'Powder', keys: ['powder', 'jinx', 'hermana'], replies: ['Powder es… era… da igual. Sigue siendo mi hermana. Pase lo que pase.', 'A veces sueño que vuelve a ser pequeña y me pide que le enseñe a pelear.'] },
      { label: 'Caitlyn', keys: ['caitlyn', 'cait', 'ejecutora'], replies: ['¿Cupcake? (Se ríe.) Es más dura de lo que parece. Y más lista que todos los de arriba juntos.', 'No le digas que te he dicho esto, pero confío en ella.'] },
      { label: 'Vander', keys: ['vander', 'padre'], replies: ['Vander nos lo dio todo. Y yo… no estuve a la altura.', 'Decía que los nuestros no se quedan atrás. Intento cumplirlo.'] },
      { label: 'Stillwater', keys: ['stillwater', 'prision', 'cárcel', 'carcel'], replies: ['Siete años mirando una pared. Aprendes a contar gotas. Aprendes a odiar.', 'Prefiero no hablar de eso. Mejor dame algo que golpear.'] },
      { label: 'Pelear', keys: ['pelea', 'pelear', 'puños', 'guantes', 'atlas'], replies: ['Regla número uno: golpea primero. Regla número dos: golpea más fuerte.', 'Los guanteletes Atlas son una pasada. Aunque echo de menos mis nudillos.'] },
      { label: 'Zaun', keys: ['zaun', 'callejones', 'abajo'], replies: ['Zaun huele mal, pero es casa. Y nadie me la va a quitar.'] },
    ],
    fallback: ['Mmm. No sé qué decirte a eso.', 'Ajá. ¿Y eso en qué nos ayuda?', 'Si es un acertijo, pregúntale a Cait.'],
  },
  jinx: {
    voice: { pitch: 1.5, rate: 1.2, gender: 'f' },
    greet: { low: '¿Tú otra vez? Las voces dicen que no me fíe de ti.', mid: '¡Holi, {name}! ¿Has traído algo que explote?', high: '¡{name}! ¡Mi persona favorita después de Pow-Pow! Bueno, empatáis.' },
    topics: [
      { label: 'Armas', keys: ['arma', 'pow', 'fishbones', 'zapper', 'cohete', 'bomba'], replies: ['Fishbones está de mal humor hoy. No le mires a los ojos.', 'Pow-Pow hace ra-ta-ta-tá. ¿Quieres oírlo? ¡Es broma! …¿O no?'] },
      { label: 'Vi', keys: ['vi', 'hermana', 'violet'], replies: ['Vi me dejó. Dijo que… (Se tapa los oídos.) No quiero hablar de Vi.', 'A veces la echo de menos. No se lo digas. A nadie. Nunca.'] },
      { label: 'Silco', keys: ['silco', 'padre'], replies: ['Silco dice que soy perfecta tal como soy. Nadie me había dicho eso antes.'] },
      { label: 'Voces', keys: ['voces', 'mylo', 'claggor', 'cabeza'], replies: ['Shhh. Si hablas muy alto, se despiertan.', 'Mylo dice que eres aburrid{g:o|a|e}. Yo le he dicho que se calle.'] },
      { label: 'Piltover', keys: ['piltover', 'consejo', 'arriba'], replies: ['Piltover es como una tarta gigante. Y yo tengo las velas. ¡Bum!'] },
      { label: 'Inventos', keys: ['invento', 'inventar', 'cachivache', 'mono'], replies: ['Estoy haciendo un mono que explota cuando aplaude. Arte puro.', '¿Sabes soldar? Necesito un ayudante con dedos. Muchos dedos.'] },
    ],
    fallback: ['¡Ja! Qué cosa más rara has dicho. Me encanta.', '¿Eso es un sí o un no? Da igual, ¡vamos a volar algo!', 'Aburriiiiido. Pregúntame por mis armas.'],
  },
  caitlyn: {
    voice: { pitch: 1.1, rate: 0.98, gender: 'f' },
    greet: { low: 'Buenos días. ¿Necesita algo?', mid: 'Hola, {name}. ¿Alguna novedad en el caso?', high: '{name}. Me alegra verte. De verdad.' },
    topics: [
      { label: 'Vi', keys: ['vi', 'violet'], replies: ['Vi es… impulsiva, testaruda e imposible. (Sonríe.) Y la persona más leal que he conocido.'] },
      { label: 'Investigación', keys: ['caso', 'investigacion', 'investigación', 'pistas', 'robo'], replies: ['Las pruebas siempre dejan rastro. Solo hay que tener paciencia para mirar.', 'Si alguien en la jefatura cobra de Silco, lo encontraré.'] },
      { label: 'Madre', keys: ['madre', 'cassandra', 'familia', 'kiramman'], replies: ['Mi madre quiere que sea consejera. Yo quiero que la ciudad sea justa. No siempre es lo mismo.'] },
      { label: 'Rifle', keys: ['rifle', 'disparo', 'tiro', 'arma'], replies: ['Respira, apunta, exhala. Y nunca dispares a lo que no puedas ver bien.'] },
      { label: 'Zaun', keys: ['zaun', 'abajo'], replies: ['Antes de bajar, creía que Zaun era un problema. Ahora sé que el problema somos nosotros.'] },
    ],
    fallback: ['Interesante. ¿Tienes pruebas de eso?', 'Lo anotaré. Todo detalle importa.', 'Mmm, no estoy segura de entenderte.'],
  },
  jayce: {
    voice: { pitch: 0.85, rate: 1.05, gender: 'm' },
    greet: { low: 'Ahora no, tengo una reunión del Consejo.', mid: '¡{name}! ¿Vienes a ver el último prototipo?', high: '¡Mi compañer{g:o|a|e} de laboratorio favorit{g:o|a|e}! Ven, tengo algo que enseñarte.' },
    topics: [
      { label: 'Hextec', keys: ['hextec', 'gema', 'runa', 'magia'], replies: ['La hextec es la prueba de que la magia puede ser de todos, no solo de unos pocos elegidos.', 'Imagina: puertas que cruzan océanos, prótesis para cualquiera… solo hay que ser valiente.'] },
      { label: 'Viktor', keys: ['viktor', 'socio'], replies: ['Sin Viktor no habría hextec. Es el cerebro… yo solo soy la cara bonita. (Se ríe.)', 'Me preocupa. Trabaja demasiado y duerme muy poco.'] },
      { label: 'Mel', keys: ['mel', 'medarda'], replies: ['Mel ve cosas que los demás no vemos. Es… impresionante. En todos los sentidos.'] },
      { label: 'Consejo', keys: ['consejo', 'politica', 'política'], replies: ['Nunca quise ser político. Pero si no me siento a esa mesa, otro decidirá por mí.'] },
      { label: 'Martillo', keys: ['martillo', 'mercurio'], replies: ['Mercurio empezó como herramienta. Ojalá nunca tenga que usarlo como arma.'] },
    ],
    fallback: ['Mmm, buena pregunta. Lo pensaré en el taller.', '¡Eso me da una idea! Bueno, no. Pero casi.', 'Perdona, tenía la cabeza en una ecuación.'],
  },
  viktor: {
    voice: { pitch: 0.8, rate: 0.9, gender: 'm' },
    greet: { low: '¿Sí? Estoy ocupado.', mid: '{name}. Bienvenid{g:o|a|e} al laboratorio.', high: '{name}, amig{g:o|a|e}. Siéntate. Tengo café y teorías.' },
    topics: [
      { label: 'Hexcore', keys: ['hexcore', 'evolucion', 'evolución', 'núcleo'], replies: ['El Hexcore no solo almacena energía. Aprende. Se adapta. Es lo más parecido a la vida que he visto.', 'Podría curar enfermedades que llevan siglos matándonos. Incluida la mía.'] },
      { label: 'Zaun', keys: ['zaun', 'infancia', 'casa'], replies: ['Crecí en Zaun. Allí aprendes que el progreso de arriba siempre se construye con el humo de abajo.'] },
      { label: 'Enfermedad', keys: ['enfermedad', 'salud', 'bastón', 'baston', 'tos'], replies: ['No tengo tiempo para lamentarme. Solo tengo tiempo para trabajar.'] },
      { label: 'Jayce', keys: ['jayce', 'talis'], replies: ['Jayce sueña a lo grande. Yo me aseguro de que sus sueños no exploten.'] },
      { label: 'Heimerdinger', keys: ['heimerdinger', 'profesor'], replies: ['El profesor me dio una oportunidad cuando nadie más lo hizo. Pero su prudencia… es una jaula.'] },
    ],
    fallback: ['Mmm. Curioso. Muy curioso.', 'Esa hipótesis requiere más datos.', 'Interesante. Aunque no veo la aplicación práctica.'],
  },
  mel: {
    voice: { pitch: 1.0, rate: 0.92, gender: 'f' },
    greet: { low: 'Consejera Medarda. ¿Tenemos cita?', mid: '{name}. Siempre en el lugar adecuado. Me gusta.', high: 'Ah, mi aliad{g:o|a|e} favorit{g:o|a|e}. Acompáñame, tengo vino de Noxus.' },
    topics: [
      { label: 'Noxus', keys: ['noxus', 'madre', 'ambessa'], replies: ['Noxus me enseñó que la fuerza es útil. Piltover me enseñó que la inteligencia lo es más.', 'Mi madre llegará pronto. Prepárate: Ambessa no pide, toma.'] },
      { label: 'Política', keys: ['politica', 'política', 'consejo', 'voto'], replies: ['Todo voto empieza con una conversación, y toda conversación con una promesa.'] },
      { label: 'Jayce', keys: ['jayce'], replies: ['Jayce tiene algo que no se compra: convicción. Hay que protegerle de sí mismo.'] },
      { label: 'Arte', keys: ['arte', 'pintura', 'belleza'], replies: ['Colecciono arte porque la belleza también es una forma de poder.'] },
    ],
    fallback: ['Qué observación tan… intrigante.', 'Lo tendré en cuenta. O no.', 'Las palabras pesan, {name}. Elígelas bien.'],
  },
  heimerdinger: {
    voice: { pitch: 1.6, rate: 1.1, gender: 'm' },
    greet: { low: 'Hmm, ¿y usted es…?', mid: '¡Ah, {name}! Pase, pase. Cuidado con los cables.', high: '¡Mi estimad{g:o|a|e} {name}! ¿Le apetece un té y una charla sobre termodinámica?' },
    topics: [
      { label: 'Hextec', keys: ['hextec', 'magia', 'gema'], replies: ['La magia es como un río: hermosa hasta que se desborda. Y la hextec es una presa de papel.'] },
      { label: 'Historia', keys: ['historia', 'edad', 'años', 'yordle'], replies: ['He visto nacer y morir a generaciones de Piltover. Créame: la paciencia nunca pasa de moda.'] },
      { label: 'Viktor', keys: ['viktor', 'alumno'], replies: ['Viktor es mi mejor alumno. Y también el que más me preocupa.'] },
      { label: 'Ciencia', keys: ['ciencia', 'invento', 'experimento'], replies: ['¡Un buen experimento es como un buen té! Requiere tiempo, precisión y no quemarse.'] },
    ],
    fallback: ['¡Fascinante! Aunque no he entendido nada.', 'Hmm, hmm. Déjeme consultarlo con mi asistente mecánico.', 'Un siglo de experiencia y aún me sorprende la gente.'],
  },
  silco: {
    voice: { pitch: 0.7, rate: 0.85, gender: 'm' },
    greet: { low: 'Tienes valor para presentarte aquí.', mid: '{name}. Siéntate. Hablemos de negocios.', high: '{name}. Eres de los pocos en quienes confío. No lo desperdicies.' },
    topics: [
      { label: 'Zaun', keys: ['zaun', 'nación', 'nacion', 'libertad'], replies: ['Zaun será una nación. No un barrio. No un vertedero. Una nación.', 'Piltover nos teme. Bien. El miedo es el primer paso hacia el respeto.'] },
      { label: 'Jinx', keys: ['jinx', 'powder', 'hija'], replies: ['Jinx es perfecta. Que nadie te diga lo contrario. Y menos ella misma.'] },
      { label: 'Vander', keys: ['vander', 'hermano'], replies: ['Vander era mi hermano. Eligió arrodillarse. Yo elegí levantarme.'] },
      { label: 'Brillo', keys: ['brillo', 'shimmer', 'droga'], replies: ['El Brillo es una herramienta. Como un martillo. Depende de la mano que lo sostiene.'] },
      { label: 'Cicatriz', keys: ['cicatriz', 'ojo'], replies: ['(Se toca el ojo.) Un recuerdo de lo que cuesta confiar. No preguntes más.'] },
    ],
    fallback: ['(Te mira en silencio durante demasiado tiempo.)', 'Interesante. Pero no me haces perder el tiempo, ¿verdad?', 'Las palabras son baratas en Zaun.'],
  },
  vander: {
    voice: { pitch: 0.65, rate: 0.9, gender: 'm' },
    greet: { low: 'Hmm. ¿Qué tomas?', mid: '{name}. Siéntate, que invita la casa.', high: '¡{name}! Ven aquí, chaval{g:|a|e}. Hoy tengo el guiso bueno.' },
    topics: [
      { label: 'Chicos', keys: ['vi', 'powder', 'mylo', 'claggor', 'chicos', 'hijos'], replies: ['Esos chavales son lo mejor que me ha pasado. Y lo que más canas me ha dado.'] },
      { label: 'Paz', keys: ['paz', 'grayson', 'piltover', 'puente'], replies: ['La paz no es bonita. Pero la guerra es peor. Lo vi en el puente.'] },
      { label: 'Silco', keys: ['silco'], replies: ['Silco y yo soñábamos lo mismo. Él nunca me perdonó que despertara.'] },
      { label: 'Guanteletes', keys: ['guante', 'guanteletes', 'pelea', 'baúl', 'baul'], replies: ['Esos guantes están en el baúl por una razón. Y ahí se quedan.'] },
    ],
    fallback: ['Ya. (Limpia un vaso.)', 'En Zaun hay que saber cuándo callar, chaval{g:|a|e}.', 'Hmm. ¿Otra ronda?'],
  },
  ekko: {
    voice: { pitch: 1.15, rate: 1.1, gender: 'm' },
    greet: { low: '¿Y tú qué haces aquí?', mid: '¡{name}! ¿Te vienes a dar una vuelta en aerotabla?', high: '¡{name}! Las Luciérnagas tienen una Luciérnaga honoraria. Adivina quién.' },
    topics: [
      { label: 'Luciérnagas', keys: ['luciernagas', 'luciérnagas', 'árbol', 'arbol', 'comunidad'], replies: ['Aquí nadie es de nadie. Todos somos de todos. Así sobrevivimos.'] },
      { label: 'Powder', keys: ['powder', 'jinx'], replies: ['Powder era mi mejor amiga. Jinx… no sé quién es. Pero a veces la veo ahí dentro.'] },
      { label: 'Benzo', keys: ['benzo', 'mentor'], replies: ['Benzo me enseñó que la chatarra puede volar. Y que algunas cosas valen más que la vida.'] },
      { label: 'Aerotabla', keys: ['aerotabla', 'volar', 'tabla'], replies: ['¿Quieres probarla? Regla única: si te caes, no grites. Atrae a los matones.'] },
      { label: 'Silco', keys: ['silco', 'brillo'], replies: ['Silco envenena Zaun con su Brillo. Nosotros apagamos ese fuego, envío a envío.'] },
    ],
    fallback: ['¡Ja! Buena esa.', 'Mmm, no lo pillo. ¿Es cosa de los de arriba?', 'Sigue hablando, pero vigila los tejados.'],
  },
  sevika: {
    voice: { pitch: 0.75, rate: 0.95, gender: 'f' },
    greet: { low: 'Lárgate antes de que me aburra.', mid: '{name}. ¿Trabajo o diversión?', high: '{name}. No eres tan inútil como pensaba. Siéntate.' },
    topics: [
      { label: 'Brazo', keys: ['brazo', 'protesis', 'prótesis', 'metal'], replies: ['Funciona mejor que el original. Y pega más fuerte.'] },
      { label: 'Silco', keys: ['silco', 'jefe'], replies: ['Silco tiene un plan. Yo tengo un puño. Nos complementamos.'] },
      { label: 'Jinx', keys: ['jinx'], replies: ['Esa cría es un problema con patas. Y Silco no lo ve.'] },
      { label: 'Cartas', keys: ['cartas', 'jugar', 'apuesta'], replies: ['¿Una partida? Pierdes, pagas. Ganas… bueno, no vas a ganar.'] },
    ],
    fallback: ['Ajá. ¿Y?', 'No pago por charla.', '(Da una calada.) Sigue.'],
  },
  singed: {
    voice: { pitch: 0.6, rate: 0.8, gender: 'm' },
    greet: { low: 'Interrumpes un experimento.', mid: 'Ah, el mensajero. Pasa. No toques nada.', high: '{name}, mi estimad{g:o|a|e} observador{g:|a|e}. ¿Vienes a aprender?' },
    topics: [
      { label: 'Brillo', keys: ['brillo', 'shimmer', 'quimica', 'química'], replies: ['El Brillo es la llave que abre el potencial del cuerpo. Que algunos no soporten la puerta abierta no es culpa de la llave.'] },
      { label: 'Ciencia', keys: ['ciencia', 'experimento', 'ética', 'etica'], replies: ['La ética es un lujo para quien tiene tiempo. La ciencia no espera.'] },
      { label: 'Paciente', keys: ['paciente', 'bestia', 'warwick', 'monstruo'], replies: ['Mi paciente progresa adecuadamente. Mejor que tú, probablemente.'] },
      { label: 'Heimerdinger', keys: ['heimerdinger', 'academia', 'piltover'], replies: ['Heimerdinger y yo compartimos laboratorio hace mucho. Él eligió el miedo. Yo, el conocimiento.'] },
    ],
    fallback: ['Hmm. Anotado.', 'Una respuesta poco científica.', '(Sigue mezclando líquidos sin mirarte.)'],
  },
  ambessa: {
    voice: { pitch: 0.75, rate: 0.88, gender: 'f' },
    greet: { low: '¿Quién eres tú para dirigirte a mí?', mid: '{name}. He oído hablar de ti. Impresióname.', high: '{name}. Tienes el temple de un lobo. Noxus podría usar a alguien como tú.' },
    topics: [
      { label: 'Noxus', keys: ['noxus', 'guerra', 'imperio'], replies: ['Noxus no pregunta de dónde vienes. Solo cuánto vales.'] },
      { label: 'Mel', keys: ['mel', 'hija', 'familia'], replies: ['Mel es más fuerte de lo que cree. Aunque elija armas extrañas, como la diplomacia.'] },
      { label: 'Hextec', keys: ['hextec', 'arma', 'gema'], replies: ['Un arma que no se usa es una promesa rota.'] },
      { label: 'Lobos', keys: ['lobo', 'lobos', 'fuerza'], replies: ['El lobo que duda acaba siendo cordero.'] },
    ],
    fallback: ['(Te observa como quien evalúa a un rival.)', 'Palabras. Muéstrame hechos.', 'Interesante. Para un piltovense.'],
  },
  marcus: {
    voice: { pitch: 0.8, rate: 0.95, gender: 'm' },
    greet: { low: 'Circule, por favor.', mid: '{name}. ¿Qué te trae por la jefatura?', high: '{name}… gracias por no juzgarme. No mucha gente lo hace.' },
    topics: [
      { label: 'Silco', keys: ['silco', 'soborno', 'dinero'], replies: ['(Mira alrededor.) No vuelvas a decir ese nombre aquí dentro.'] },
      { label: 'Hija', keys: ['hija', 'familia'], replies: ['Todo lo que hago, lo hago por ella. Todo.'] },
      { label: 'Caitlyn', keys: ['caitlyn', 'kiramman'], replies: ['La señorita Kiramman es buena ejecutora. Demasiado buena para su propio bien.'] },
    ],
    fallback: ['No tengo nada más que decir.', 'Mire, estoy muy ocupado.', '(Se ajusta el cuello del uniforme.)'],
  },
  cassandra: {
    voice: { pitch: 1.0, rate: 0.9, gender: 'f' },
    greet: { low: 'Usted dirá.', mid: '{name}. Gracias por cuidar de mi hija.', high: '{name}, querid{g:o|a|e}. Siempre eres bienvenid{g:o|a|e} en la mansión.' },
    topics: [
      { label: 'Caitlyn', keys: ['caitlyn', 'hija'], replies: ['Caitlyn tiene el corazón de su padre y la cabeza dura de los Kiramman. Mala combinación para una madre.'] },
      { label: 'Consejo', keys: ['consejo', 'politica', 'política', 'hextec'], replies: ['El Consejo necesita prudencia, no espectáculo. Por eso desconfío de tanto entusiasmo.'] },
    ],
    fallback: ['Comprendo.', 'Lo hablaremos en otro momento.', 'Un Kiramman siempre escucha. Aunque no siempre esté de acuerdo.'],
  },
  mylo: {
    voice: { pitch: 1.2, rate: 1.15, gender: 'm' },
    greet: { low: 'Uf, otra vez tú.', mid: '¿Qué pasa, {name}? ¿Tienes algo que valga la pena robar?', high: '¡{name}! Te he guardado el mejor botín. Bueno, el segundo mejor.' },
    topics: [
      { label: 'Cerraduras', keys: ['cerradura', 'robar', 'ganzua', 'ganzúa'], replies: ['Ninguna cerradura se me resiste. Bueno, la del baúl de Vander sí. Pero esa no cuenta.'] },
      { label: 'Powder', keys: ['powder'], replies: ['Powder es un desastre. Pero es nuestro desastre.'] },
    ],
    fallback: ['Bah, aburrido.', '¿Eso es todo lo que tienes?', 'Claggor, ¿tú lo entiendes?'],
  },
  claggor: {
    voice: { pitch: 0.75, rate: 0.9, gender: 'm' },
    greet: { low: 'Hola.', mid: 'Hola, {name}. ¿Me pasas esa llave inglesa?', high: '{name}. Me alegra que estés aquí. Mylo también, aunque no lo diga.' },
    topics: [
      { label: 'Máquinas', keys: ['maquina', 'máquina', 'arreglar', 'motor'], replies: ['Las máquinas no mienten. Si algo falla, hay una razón. Con la gente es más difícil.'] },
      { label: 'Familia', keys: ['familia', 'vander', 'vi', 'powder', 'mylo'], replies: ['Somos raros, pero somos familia. Eso basta.'] },
    ],
    fallback: ['Mmm.', 'Puede ser.', '(Asiente y sigue apretando tornillos.)'],
  },
  benzo: {
    voice: { pitch: 0.7, rate: 0.85, gender: 'm' },
    greet: { low: 'Si no vas a comprar, no toques.', mid: '¡Hombre, {name}! Pasa, que tengo chatarra nueva.', high: '{name}. Siempre hay un té caliente para ti en esta tienda.' },
    topics: [
      { label: 'Ekko', keys: ['ekko', 'chaval'], replies: ['Ese chico llegará lejos. Más lejos que todos nosotros.'] },
      { label: 'Vander', keys: ['vander', 'silco'], replies: ['Vander y Silco eran uña y carne. Hasta que el puente se los tragó.'] },
      { label: 'Chatarra', keys: ['chatarra', 'tienda', 'trasto'], replies: ['Lo que tiras hoy puede salvarte mañana.'] },
    ],
    fallback: ['Ya veo, ya.', 'Cosas de jóvenes.', '(Se ríe entre dientes.)'],
  },
  scar: {
    voice: { pitch: 0.85, rate: 1.0, gender: 'm' },
    greet: { low: 'Te estoy vigilando.', mid: '{name}. Ekko dice que eres de fiar. Ya veremos.', high: '{name}. Tienes sitio en el árbol. Te lo has ganado.' },
    topics: [
      { label: 'Árbol', keys: ['árbol', 'arbol', 'luciernagas', 'luciérnagas'], replies: ['Este árbol es lo único bueno que le queda a Zaun. Lo defenderé con mi vida.'] },
      { label: 'Ekko', keys: ['ekko'], replies: ['Ekko confía demasiado. Por eso estoy yo.'] },
    ],
    fallback: ['Mmm.', 'No me convence.', 'Vale.'],
  },
  sky: {
    voice: { pitch: 1.25, rate: 1.0, gender: 'f' },
    greet: { low: 'Ah, hola…', mid: '¡Hola, {name}! ¿Has visto a Viktor?', high: '¡{name}! Qué bien que estés aquí. Viktor está de mejor humor cuando vienes.' },
    topics: [
      { label: 'Viktor', keys: ['viktor'], replies: ['Viktor es brillante. Ojalá él lo viera también.'] },
      { label: 'Hexcore', keys: ['hexcore', 'experimento'], replies: ['El Hexcore me da un poco de miedo. Pero si puede ayudar a Viktor…'] },
    ],
    fallback: ['Oh, ¿en serio?', 'No había pensado en eso.', '(Sonríe con timidez.)'],
  },
  isha: {
    voice: { pitch: 1.7, rate: 1.1, gender: 'f' },
    greet: { low: '(Te mira desde detrás de las gafas, desconfiada.)', mid: '(Te saluda con la mano y te enseña un dibujo nuevo.)', high: '(Corre hacia ti y te abraza las piernas. Luego te tira de la manga para enseñarte algo.)' },
    topics: [
      { label: 'Jinx', keys: ['jinx', 'powder', 'hermana'], replies: ['(Dibuja a Jinx con una corona y muchas explosiones alrededor. Sonríe.)', '(Se pone las manos en la cabeza imitando las trenzas de Jinx y hace «¡bum!» sin sonido.)'] },
      { label: 'Dibujos', keys: ['dibujo', 'pintar', 'dibujar'], replies: ['(Te enseña un dibujo: tú, ella y Jinx encima de un cohete con cara de tiburón.)', '(Te regala un dibujo de un mono con gafas. Es para ti.)'] },
      { label: 'Gafas', keys: ['gafas', 'ojos'], replies: ['(Se baja las gafas, te mira muy seria, y se las vuelve a subir. Secreto.)'] },
      { label: 'Miedo', keys: ['miedo', 'ejecutores', 'peligro'], replies: ['(Se esconde detrás de ti y señala a lo lejos, hacia unos ejecutores.)', '(Te coge la mano muy fuerte y no la suelta.)'] },
      { label: 'Juegos', keys: ['jugar', 'juego', 'cohete'], replies: ['(Te lanza una piedrecita y sale corriendo. Quiere que la persigas.)'] },
    ],
    fallback: ['(Ladea la cabeza, curiosa.)', '(Se encoge de hombros y sigue dibujando.)', '(Hace como que no te ha oído y te saca la lengua.)'],
  },
  loris: {
    voice: { pitch: 0.8, rate: 1.0, gender: 'm' },
    greet: { low: 'Eh, ¿qué tal?', mid: '¡{name}! ¿Una cerveza?', high: '¡{name}! Mi colega favorit{g:o|a|e}. La primera ronda la pagas tú, ¿eh?' },
    topics: [
      { label: 'Cerveza', keys: ['cerveza', 'bar', 'beber'], replies: ['La mejor cerveza de Piltover está en Zaun. No se lo digas a nadie.'] },
      { label: 'Vi', keys: ['vi'], replies: ['Vi da miedo. Pero del bueno. Del que te salva el pellejo.'] },
    ],
    fallback: ['Ja, ja. ¿Qué?', 'Yo solo vine por los bocadillos.', 'Eso suena a trabajo.'],
  },
};
