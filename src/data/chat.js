// Conversaciones con los personajes desbloqueados: escritas a mano, con opciones de diálogo.
//
// Personaje: { greet: { low, mid, high }, bye: [..], hub: [opción..], nodes: { id: { say?, opts, noBack? } } }
//   greet: saludo según la afinidad (negativa, normal, 5 o más).
//   hub: el menú principal de temas. Siempre se añade «Hasta luego».
//   nodes: ramas de la conversación. Al entrar, el personaje dice `say`; luego se muestran `opts`
//          (y «Cambiar de tema», salvo con noBack).
// Opción: { t, tone?, say?, go?, req?, fx?, once? }
//   t: lo que dices tú. tone: amable | broma | duro | pregunta | coqueto | astuto | serio | sigilo.
//   say: lo que responde (texto o lista; { s: 'narrador', t } para acotaciones de narrador).
//   go: nodo siguiente, 'hub' o 'bye'. Por defecto, sigues en el mismo nodo.
//   req: { stat, min } | { aff: n } (con este personaje) | { aff: [id, n] } | { flag } | { notFlag } | { season: 2 }
//        Las de flag y temporada se ocultan si no se cumplen; las demás se ven bloqueadas.
//   fx: { aff: n | { id: n }, rep, stats, flags } (solo la primera vez que eliges esa respuesta).
//   once: la opción desaparece después de elegirla.
// Plantillas: {name}, {job}, {district}, {g:o|a|e}… igual que en la historia.
window.CHAT = {
  // =========================================================== VI
  vi: {
    greet: { low: 'Ah. Eres tú. ¿Qué quieres?', mid: 'Hey, {name}. ¿Todo bien?', high: '¡{name}! Ven aquí, que te debo una ronda.' },
    bye: ['Cuídate ahí fuera. Y si alguien te molesta, me llamas.', 'Vale. Y oye… gracias por pasarte.', 'Lárgate antes de que me ponga sentimental.'],
    hub: [
      { t: '¿Cómo estás, Vi? Pero de verdad.', tone: 'amable', go: 'estado' },
      { t: 'Háblame de Powder.', tone: 'pregunta', go: 'powder' },
      { t: '¿Qué hay entre tú y Caitlyn?', tone: 'coqueto', go: 'cait' },
      { t: 'Enséñame a pelear.', tone: 'duro', go: 'pelea' },
      { t: '¿Cómo fue Stillwater?', tone: 'pregunta', go: 'stillwater', req: { aff: 3 } },
      { t: 'Cuéntame algo de Vander.', tone: 'amable', go: 'vander' },
      { t: 'Sobre el golpe en Piltover… no me arrepiento.', tone: 'broma', req: { flag: 'golpe' }, once: true, fx: { aff: 1 },
        say: ['Yo sí. Todos los días. Pero me alegra que estuvieras ahí. Sin ti, Mylo seguiría colgado de aquella cornisa.'] },
      { t: 'Lo de chivarme a Vander… lo hice por vosotros.', tone: 'serio', req: { flag: 'chivato' }, once: true, go: 'chivato' },
      { t: 'Te debo una verdad sobre Vander…', tone: 'serio', req: { flag: 'vi_sabe_vander' }, once: true,
        say: ['(Se queda callada mucho rato.) Esa cosa… era él. Y aun así me protegió.', 'No me pidas que esté bien. Pero gracias por no mentirme. Eres de los pocos que no lo hace.'], fx: { aff: 2 } },
    ],
    nodes: {
      estado: {
        say: ['(Se encoge de hombros.) Tengo los nudillos en carne viva y una hermana que quiere volar la ciudad. Lo normal.'],
        opts: [
          { t: 'No tienes que cargar con todo tú sola.', tone: 'amable', fx: { aff: 2 }, go: 'hub',
            say: ['(Te mira un segundo de más.) Ya. Eso dice Cait. Quizá tengáis razón… pero no se lo digas.'] },
          { t: 'Pues tienes una pinta horrible, la verdad.', tone: 'broma', fx: { aff: 1 }, go: 'hub',
            say: ['¡Ja! Mira quién habla. ¿Te has visto la cara? Venga, invítame a algo y te perdono.'] },
          { t: 'Deja de quejarte y haz algo.', tone: 'duro', fx: { aff: -1 }, go: 'hub',
            say: ['(Aprieta el puño.) Repítelo y vas a ver lo que hago.'] },
        ],
      },
      powder: {
        say: ['Powder es… era… da igual. Sigue siendo mi hermana. Pase lo que pase.'],
        opts: [
          { t: '¿Cómo era de pequeña?', tone: 'pregunta', go: 'powder_peque' },
          { t: 'Jinx ya no es Powder, Vi. Tienes que aceptarlo.', tone: 'duro', fx: { aff: -2 }, go: 'hub',
            say: ['No. No me digas eso. Tú no la conoces como yo.', '(Te da la espalda.) Déjame un rato.'] },
          { t: 'Te ayudaré a recuperarla. Cueste lo que cueste.', tone: 'amable', fx: { aff: 2, flags: ['promesa_vi'] }, go: 'hub',
            say: ['(Traga saliva.) Eso es mucho prometer, {name}.', 'Pero vale. Te tomo la palabra. Los nuestros no se quedan atrás.'] },
          { t: '¿Y si la única forma de pararla es hacerle daño?', tone: 'serio', req: { stat: 'ingenio', min: 2 }, fx: { aff: 1, stats: { ingenio: 1 } }, go: 'hub',
            say: ['(Silencio.) Entonces lo haré yo. Nadie más. ¿Entendido?', 'Gracias por preguntarlo a la cara. Los demás solo lo susurran.'] },
        ],
      },
      powder_peque: {
        say: ['Era un desastre adorable. Hacía bombas con latas de sardinas y se enfadaba si no explotaban.', 'Una vez me hizo un monito de trapo con un ojo de botón. Todavía lo tengo. No se lo digas a nadie.'],
        opts: [
          { t: 'Eso es precioso, Vi.', tone: 'amable', fx: { aff: 1 }, go: 'hub', say: ['(Sonríe de verdad, por una vez.) Sí. Lo era.'] },
          { t: 'Así que ya de pequeña quería volarlo todo. Se veía venir.', tone: 'broma', go: 'hub',
            say: ['(Suelta una carcajada que no se esperaba.) Vale, eso ha tenido gracia. Un poco.'] },
        ],
      },
      cait: {
        say: ['¿Cupcake? (Se ríe.) Es más dura de lo que parece. Y más lista que todos los de arriba juntos.'],
        opts: [
          { t: '¿«Cupcake»? Eso suena a algo más que amistad.', tone: 'coqueto', fx: { aff: 1 }, go: 'hub',
            say: ['(Se pone roja.) Cállate. Es… complicado. Ella es de arriba, yo soy de abajo.', 'Pero cuando dispara, se le arruga la nariz. Y yo… vale, cambia de tema.'] },
          { t: 'Es una ejecutora. ¿De verdad te fías de ella?', tone: 'duro', fx: { aff: -1 }, go: 'hub',
            say: ['Me fío de ella más que de ti ahora mismo. No hagas que me arrepienta.'] },
          { t: 'Me alegra que tengas a alguien así.', tone: 'amable', fx: { aff: 1, rep: { piltover: 1 } }, go: 'hub',
            say: ['Sí… yo también. No le digas que he dicho esto, pero confío en ella.'] },
        ],
      },
      pelea: {
        say: ['¿Quieres aprender? Vale. Regla número uno: golpea primero. Regla número dos: golpea más fuerte.'],
        opts: [
          { t: '(Levantar la guardia.) Vamos allá.', tone: 'duro', req: { stat: 'valor', min: 2 }, fx: { aff: 2, stats: { valor: 1 } }, go: 'hub',
            say: [{ s: 'narrador', t: 'Vi te lanza un directo lento. Lo esquivas. El segundo no tanto. Acabas en el suelo… riéndote.' }, 'Nada mal. Tienes agallas. Vuelve mañana y te enseño el gancho.'] },
          { t: '¿Y si mejor no me pegan nunca?', tone: 'astuto', fx: { stats: { sigilo: 1 } }, go: 'hub',
            say: ['Regla número tres: si puedes salir corriendo, corre. Eso me lo enseñó Vander. Tardé años en hacerle caso.'] },
          { t: '¿Echas de menos tus guanteletes Atlas?', tone: 'pregunta', go: 'hub',
            say: ['Los Atlas son una pasada. Aunque echo de menos mis nudillos. Duele más, pero es más… honesto.'] },
        ],
      },
      stillwater: {
        say: ['(Se le endurece la cara.) Siete años mirando una pared. Aprendes a contar gotas. Aprendes a odiar.'],
        opts: [
          { t: 'No tienes que contármelo si no quieres.', tone: 'amable', fx: { aff: 2 }, go: 'hub',
            say: ['…Gracias. Mucha gente pregunta solo por el morbo. Tú no.'] },
          { t: '¿Cómo aguantaste?', tone: 'pregunta', go: 'hub',
            say: ['Pensando en Powder. En que algún día saldría y la encontraría.', 'Y peleando. Mucho. Los guardias aprendieron a no meterse conmigo.'] },
          { t: '¿Quién te metió ahí?', tone: 'serio', fx: { flags: ['vi_marcus'] }, go: 'hub',
            say: ['Un ejecutor llamado Marcus. Vendido a Silco. Algún día tendremos una charla él y yo.'] },
        ],
      },
      vander: {
        say: ['Vander nos lo dio todo. Y yo… no estuve a la altura.'],
        opts: [
          { t: 'Él estaría orgulloso de ti.', tone: 'amable', fx: { aff: 1 }, go: 'hub',
            say: ['(Mira hacia otro lado.) Decía que los nuestros no se quedan atrás. Intento cumplirlo.'] },
          { t: '¿Qué pasó en el puente, hace años?', tone: 'pregunta', go: 'hub',
            say: ['Vander lideró una revuelta contra Piltover. Perdió a mucha gente. Después de eso juró que nunca más.', 'Por eso guardaba los guanteletes en un baúl. Hasta que no pudo.'] },
        ],
      },
      chivato: {
        say: ['(Te mira con los ojos entrecerrados.) Así que fuiste tú. Vander nos castigó una semana entera.'],
        opts: [
          { t: 'Os habríais matado ahí arriba. Y aun así os salvé.', tone: 'serio', req: { stat: 'carisma', min: 2 }, fx: { aff: 2 }, go: 'hub',
            say: ['(Resopla.) …Puede. Probablemente. Odio cuando alguien tiene razón y no soy yo.'] },
          { t: 'Lo siento, Vi. Debí hablar contigo primero.', tone: 'amable', fx: { aff: 1 }, go: 'hub',
            say: ['Sí, debiste. Vale. Disculpa aceptada. Pero la próxima vez me lo dices a la cara.'] },
          { t: 'Volvería a hacerlo.', tone: 'duro', fx: { aff: -1 }, go: 'hub', say: ['Pues yo volvería a enfadarme. Estamos en paz.'] },
        ],
      },
    },
  },

  // =========================================================== JINX
  jinx: {
    greet: { low: '¿Tú otra vez? Las voces dicen que no me fíe de ti.', mid: '¡Holi, {name}! ¿Has traído algo que explote?', high: '¡{name}! ¡Mi persona favorita después de Pow-Pow! Bueno, empatáis.' },
    bye: ['¡Chao! Si oyes un ¡bum!, no he sido yo. Probablemente.', 'Vete, vete. Fishbones se pone celoso.', '¡Bye-bye! (Te lanza un beso con forma de granada.)'],
    hub: [
      { t: '¿En qué estás trabajando?', tone: 'pregunta', go: 'inventos' },
      { t: 'Preséntame a tus armas.', tone: 'broma', go: 'armas' },
      { t: '¿Echas de menos a Vi?', tone: 'serio', go: 'vi' },
      { t: '¿Qué es Silco para ti?', tone: 'pregunta', go: 'silco' },
      { t: '¿Con quién hablas cuando estás sola?', tone: 'amable', go: 'voces', req: { aff: 3 } },
      { t: '¿Qué opinas de Piltover?', tone: 'pregunta',
        say: ['Piltover es como una tarta gigante. Y yo tengo las velas. ¡Bum!'] },
      { t: 'Te ayudé con aquella bomba, ¿te acuerdas?', tone: 'amable', req: { flag: 'bomba_powder' }, once: true, fx: { aff: 2 },
        say: ['¡¿Que si me acuerdo?! ¡Fue la primera que explotó cuando yo quería! Bueno, casi.', 'Tú eres de los que creen en mí. Eso no se olvida, {name}.'] },
      { t: 'Ayudé a cazarte. No te voy a mentir.', tone: 'duro', req: { flag: 'caza_jinx' }, once: true, fx: { aff: -2 },
        say: ['(Te apunta con Pow-Pow… y se ríe.) ¡Qué sinceridad! Me encanta. Te odio un poquito, pero me encanta.'] },
      { t: 'Te avisé de la cacería. ¿Llegaste a tiempo?', tone: 'amable', req: { flag: 'protege_jinx' }, once: true, fx: { aff: 3 },
        say: ['Por los pelos. Literalmente: me chamuscaron una trenza.', 'Gracias. De verdad. Nadie se arriesga por mí. Bueno, tú sí. Raro. Me gusta.'] },
      { t: 'Isha te dibujó algo. Toma.', tone: 'amable', req: { season: 2 }, once: true, fx: { aff: 2, flags: ['jinx_dibujo'] },
        say: ['(Mira el dibujo en silencio. Sale ella con corona.) …Es horrible. Lo voy a guardar para siempre.'] },
    ],
    nodes: {
      inventos: {
        say: ['¡Estoy haciendo un mono que explota cuando aplaude! Arte puro. ¿Quieres verlo?'],
        opts: [
          { t: '¡Claro! Enséñamelo.', tone: 'broma', fx: { aff: 1 }, go: 'mono' },
          { t: '¿Y si en vez de explotar, hiciera fuegos artificiales?', tone: 'astuto', req: { stat: 'ingenio', min: 2 }, fx: { aff: 2, stats: { ingenio: 1 } }, go: 'hub',
            say: ['(Se le iluminan los ojos.) Fuegos… de colores… sobre el puente… ¡Eres un genio retorcido! Como yo.'] },
          { t: 'Eso es peligroso, Jinx.', tone: 'serio', fx: { aff: -1 }, go: 'hub', say: ['Buuuuh. Aburrid{g:o|a|e}. Pareces Vi.'] },
        ],
      },
      mono: {
        say: [{ s: 'narrador', t: 'Jinx saca un mono de hojalata con platillos. Lo deja en el suelo. Aplaude una vez. Dos. A la tercera…' }],
        opts: [
          { t: '(Saltar detrás de una mesa.)', tone: 'sigilo', fx: { stats: { sigilo: 1 } }, go: 'hub',
            say: [{ s: 'narrador', t: '¡BUM! Una nube de confeti azul llena la guarida.' }, '¡Ja, ja, ja! ¡Tenías que verte la cara! Era confeti. Esta vez.'] },
          { t: '(Quedarte quiet{g:o|a|e} y sonreír.)', tone: 'duro', req: { stat: 'valor', min: 2 }, fx: { aff: 2 }, go: 'hub',
            say: [{ s: 'narrador', t: '¡BUM! Confeti azul por todas partes. Ni parpadeas.' }, '…Vale. Me das un poquito de miedo. Y eso me encanta.'] },
        ],
      },
      armas: {
        say: ['¡Ooh, presentaciones! Esta es Pow-Pow, la que hace ra-ta-ta-tá. Este es Fishbones, el tiburón cohete. Y esta es Zapper. No la toques.'],
        opts: [
          { t: 'Encantad{g:o|a|e}, Fishbones. (Darle la mano al lanzacohetes.)', tone: 'broma', fx: { aff: 2 }, go: 'hub',
            say: ['(Jadea, emocionada.) ¡LE HAS DADO LA MANO! Nadie le da la mano. Fishbones dice que ahora sois amigos.'] },
          { t: '¿Por qué les pones nombre?', tone: 'pregunta', go: 'hub',
            say: ['Porque no se van. No se mueren. No te dejan. (Pausa.) ¡Y porque es mono! ¿A que es mono?'] },
          { t: '¿Me dejas disparar a Pow-Pow?', tone: 'astuto', req: { aff: 4 }, fx: { aff: 1, stats: { valor: 1 } }, go: 'hub',
            say: ['Mmm… vale. ¡Pero apunta a esa lata, no a mí! ¡Ni a mí ni a mi pelo!', { s: 'narrador', t: 'Ra-ta-ta-tá. La lata desaparece. Jinx aplaude como una niña.' }] },
        ],
      },
      vi: {
        say: ['Vi me dejó. Dijo que… (Se tapa los oídos.) No quiero hablar de Vi.'],
        opts: [
          { t: 'Ella nunca dejó de buscarte, Jinx.', tone: 'amable', req: { stat: 'carisma', min: 2 }, fx: { aff: 2 }, go: 'hub',
            say: ['(Baja las manos despacio.) …¿De verdad?', 'A veces la echo de menos. No se lo digas. A nadie. Nunca.'] },
          { t: 'Vale. No hablaremos de ella.', tone: 'amable', fx: { aff: 1 }, go: 'hub', say: ['Gracias. Eres de los que escuchan. Raro raro raro.'] },
          { t: 'Vi tenía razón. Eres un gafe.', tone: 'duro', fx: { aff: -3 }, go: 'hub',
            say: ['(Se le congela la sonrisa.) Repítelo.', { s: 'narrador', t: 'El cañón de Pow-Pow te roza la nariz. Jinx no parpadea.' }, '…Era broma. Lárgate.'] },
        ],
      },
      silco: {
        say: ['Silco dice que soy perfecta tal como soy. Nadie me había dicho eso antes.'],
        opts: [
          { t: 'Eres perfecta tal como eres.', tone: 'amable', fx: { aff: 2 }, go: 'hub', say: ['(Se ríe nerviosa y se tira de una trenza.) Basta. Me vas a hacer llorar y se me corre el rímel.'] },
          { t: 'Silco te está usando, Jinx.', tone: 'serio', req: { stat: 'carisma', min: 3 }, fx: { aff: 1, flags: ['duda_silco'] }, go: 'hub',
            say: ['(Silencio largo.) …Las voces dicen lo mismo a veces.', 'Pero él se quedó. Los demás se fueron. Eso cuenta, ¿no?'] },
          { t: 'Silco es un monstruo.', tone: 'duro', fx: { aff: -2 }, go: 'hub', say: ['¡Y tú un aburrimiento con patas! (Te tira una tuerca.)'] },
        ],
      },
      voces: {
        say: ['(Mira alrededor.) Shhh. Si hablas muy alto, se despiertan. Mylo, Claggor… a veces Vander.'],
        opts: [
          { t: '¿Y qué te dicen ahora?', tone: 'pregunta', fx: { aff: 1 }, go: 'hub',
            say: ['Mylo dice que eres aburrid{g:o|a|e}. Yo le he dicho que se calle.', 'Claggor dice que le caes bien. Claggor siempre fue el majo.'] },
          { t: 'No están aquí, Jinx. Solo estamos tú y yo.', tone: 'amable', req: { aff: 6 }, fx: { aff: 2, flags: ['jinx_calma'] }, go: 'hub',
            say: ['(Respira hondo. Una vez. Dos.) …Tú y yo.', 'Se han callado. Qué raro. Qué… tranquilo.'] },
        ],
      },
    },
  },

  // =========================================================== CAITLYN
  caitlyn: {
    greet: { low: 'Buenos días. ¿Necesita algo?', mid: 'Hola, {name}. ¿Alguna novedad en el caso?', high: '{name}. Me alegra verte. De verdad.' },
    bye: ['Ten cuidado. Y si ves algo raro, anótalo.', 'Hasta pronto, {name}.', 'Vuelve cuando tengas pruebas. O café.'],
    hub: [
      { t: '¿Cómo va la investigación?', tone: 'pregunta', go: 'caso' },
      { t: 'Háblame de Vi.', tone: 'coqueto', go: 'vi' },
      { t: '¿Por qué te hiciste ejecutora?', tone: 'pregunta', go: 'ejecutora' },
      { t: 'Enséñame a disparar.', tone: 'serio', go: 'rifle' },
      { t: '¿Qué piensas de Zaun?', tone: 'serio', go: 'zaun' },
      { t: 'Gracias por dejarme revisar los informes.', tone: 'amable', req: { flag: 'pistas_cait' }, once: true, fx: { aff: 1, stats: { ingenio: 1 } },
        say: ['Al contrario. Viste el patrón antes que yo. Eso no le pasa a mucha gente.'] },
      { t: 'Sobre la cacería de Jinx…', tone: 'serio', req: { season: 2 }, go: 'caceria' },
    ],
    nodes: {
      caso: {
        say: ['Las pruebas siempre dejan rastro. Solo hay que tener paciencia para mirar.', 'Sospecho que alguien en la jefatura cobra de Silco.'],
        opts: [
          { t: 'He oído que es el sheriff Marcus.', tone: 'astuto', req: { stat: 'sigilo', min: 2 }, fx: { aff: 2, flags: ['cait_marcus'] }, go: 'hub',
            say: ['(Baja la voz.) ¿Marcus? Eso explicaría por qué mis informes desaparecen.', 'Gracias, {name}. Esto queda entre tú y yo.'] },
          { t: '¿Puedo ayudarte?', tone: 'amable', fx: { aff: 1 }, go: 'hub', say: ['Toda ayuda es poca. Mantén los ojos abiertos en las dos ciudades.'] },
          { t: 'Quizá deberías dejarlo estar. Es peligroso.', tone: 'serio', fx: { aff: -1 }, go: 'hub', say: ['Si todos lo dejaran estar, Piltover se pudriría por dentro. No, gracias.'] },
        ],
      },
      vi: {
        say: ['Vi es… impulsiva, testaruda e imposible. (Sonríe sin querer.) Y la persona más leal que he conocido.'],
        opts: [
          { t: 'Te brillan los ojos cuando hablas de ella.', tone: 'coqueto', fx: { aff: 1 }, go: 'hub',
            say: ['(Carraspea.) Es la luz. Las lámparas de hextec. Son muy… brillantes.', 'Vale. Puede que un poco. No se lo digas.'] },
          { t: 'Vi es de Zaun. Tu madre no lo aprobará.', tone: 'duro', fx: { aff: -1 }, go: 'hub', say: ['Mi madre no aprueba nada de lo que hago. Una cosa más no cambiará eso.'] },
          { t: 'Hacéis buen equipo.', tone: 'amable', fx: { aff: 1 }, go: 'hub', say: ['Ella golpea y yo pienso. O al revés, a veces. Funciona.'] },
        ],
      },
      ejecutora: {
        say: ['Mi familia tiene un asiento en el Consejo. Yo quería algo más útil que firmar papeles.'],
        opts: [
          { t: '¿Y tu madre qué opina?', tone: 'pregunta', go: 'hub',
            say: ['Mi madre quiere que sea consejera. Yo quiero que la ciudad sea justa. No siempre es lo mismo.'] },
          { t: 'Una niña rica jugando a policías.', tone: 'duro', fx: { aff: -2 }, go: 'hub', say: ['(Fría como el hielo.) Ese tono ya me lo sé. No eres original, {name}.'] },
          { t: 'Hace falta valor para elegir eso.', tone: 'amable', fx: { aff: 1, rep: { piltover: 1 } }, go: 'hub', say: ['Gracias. No mucha gente lo ve así.'] },
        ],
      },
      rifle: {
        say: ['Respira, apunta, exhala. Y nunca dispares a lo que no puedas ver bien.'],
        opts: [
          { t: '(Coger el rifle y apuntar a la diana.)', tone: 'serio', req: { stat: 'sigilo', min: 2 }, fx: { aff: 1, stats: { valor: 1 } }, go: 'hub',
            say: [{ s: 'narrador', t: 'Respiras. Disparas. El plato de arcilla estalla en el aire.' }, 'Vaya. Tienes buen pulso. ¿Seguro que no quieres una placa?'] },
          { t: '¿Has disparado alguna vez a alguien?', tone: 'pregunta', go: 'hub', say: ['(Pausa.) Sí. Y no se olvida. Por eso cada disparo tiene que importar.'] },
        ],
      },
      zaun: {
        say: ['Antes de bajar, creía que Zaun era un problema. Ahora sé que el problema somos nosotros.'],
        opts: [
          { t: 'Me alegra que lo veas.', tone: 'amable', fx: { aff: 1, rep: { zaun: 1 } }, go: 'hub', say: ['Ver no basta. Hay que hacer algo. Estoy en ello.'] },
          { t: 'Zaun también tiene su parte de culpa.', tone: 'serio', go: 'hub', say: ['Puede. Pero no tienen ni la mitad de las herramientas que tenemos arriba. Es injusto exigirles lo mismo.'] },
        ],
      },
      caceria: {
        say: ['(Se le endurece la mirada.) Jinx mató a consejeros. Tiene que responder por ello.'],
        opts: [
          { t: 'La venganza no te devolverá a tu madre.', tone: 'serio', req: { stat: 'carisma', min: 3 }, fx: { aff: 2, flags: ['cait_duda'] }, go: 'hub',
            say: ['(Le tiembla la mano.) …Lo sé. Lo sé. Pero si paro, tendré que sentirlo todo.', 'Gracias por decírmelo sin rodeos.'] },
          { t: 'Te ayudaré a atraparla.', tone: 'duro', fx: { aff: 1, rep: { piltover: 1 } }, go: 'hub', say: ['Bien. Necesito gente que no dude.'] },
          { t: 'Piénsalo por Vi.', tone: 'amable', fx: { aff: 1 }, go: 'hub', say: ['(Cierra los ojos.) Vi es la única razón por la que todavía lo pienso.'] },
        ],
      },
    },
  },

  // =========================================================== JAYCE
  jayce: {
    greet: { low: 'Ahora no, tengo una reunión del Consejo.', mid: '¡{name}! ¿Vienes a ver el último prototipo?', high: '¡Mi compañer{g:o|a|e} de laboratorio favorit{g:o|a|e}! Ven, tengo algo que enseñarte.' },
    bye: ['¡Hasta luego! Y no toques la gema al salir.', 'Vuelve pronto. El futuro no se construye solo.', 'Me voy, que Mel me espera. O el Consejo. O los dos.'],
    hub: [
      { t: '¿Qué es exactamente la hextec?', tone: 'pregunta', go: 'hextec' },
      { t: 'Háblame de Viktor.', tone: 'amable', go: 'viktor' },
      { t: '¿Y lo tuyo con Mel?', tone: 'coqueto', go: 'mel' },
      { t: '¿Te gusta ser consejero?', tone: 'pregunta', go: 'consejo' },
      { t: 'Bonito martillo.', tone: 'broma', go: 'martillo' },
      { t: 'Te ayudé con los cálculos aquella noche.', tone: 'amable', req: { flag: 'ayuda_hextec' }, once: true, fx: { aff: 2 },
        say: ['¡Y sin ti no lo habría logrado! Bueno, quizá sí, pero habría tardado tres años más y una ceja.'] },
      { t: 'Fui yo quien avisó a Heimerdinger. Lo siento.', tone: 'serio', req: { flag: 'delata_jayce' }, once: true, go: 'delata' },
    ],
    nodes: {
      hextec: {
        say: ['La hextec es la prueba de que la magia puede ser de todos, no solo de unos pocos elegidos.', 'Imagina: puertas que cruzan océanos, prótesis para cualquiera… solo hay que ser valiente.'],
        opts: [
          { t: 'Suena increíble. ¿Y Zaun? ¿También será para Zaun?', tone: 'serio', fx: { aff: 1, rep: { zaun: 1 } }, go: 'hub',
            say: ['(Duda.) …Debería. Tiene que serlo. Me lo apunto, de verdad.'] },
          { t: '¿Y si alguien la convierte en un arma?', tone: 'pregunta', req: { stat: 'ingenio', min: 2 }, fx: { stats: { ingenio: 1 } }, go: 'hub',
            say: ['(Se le borra la sonrisa.) Es lo que más miedo me da. Por eso tenemos que hacerlo bien desde el principio.'] },
          { t: 'Magia para todos. Me apunto.', tone: 'amable', fx: { aff: 1 }, go: 'hub', say: ['¡Eso! ¡Así se habla! Necesito más gente como tú en el Consejo.'] },
        ],
      },
      viktor: {
        say: ['Sin Viktor no habría hextec. Es el cerebro… yo solo soy la cara bonita. (Se ríe.)'],
        opts: [
          { t: 'Viktor está enfermo, Jayce. ¿Lo has notado?', tone: 'serio', fx: { aff: 1, flags: ['jayce_sabe_viktor'] }, go: 'hub',
            say: ['(Se le hunden los hombros.) Me preocupa. Trabaja demasiado y duerme muy poco.', 'Hablaré con él. Esta vez de verdad.'] },
          { t: 'Desde luego, la cara bonita la tienes.', tone: 'coqueto', fx: { aff: 1 }, go: 'hub', say: ['(Se le suben los colores.) Vaya. Gracias. Eso… no me lo esperaba.'] },
          { t: '¿Y no te da miedo que te supere?', tone: 'astuto', go: 'hub', say: ['¿Miedo? Me encantaría. Dos genios valen más que uno. …Aunque un poco sí.'] },
        ],
      },
      mel: {
        say: ['Mel ve cosas que los demás no vemos. Es… impresionante. En todos los sentidos.'],
        opts: [
          { t: 'Ten cuidado. Mel siempre juega a varias bandas.', tone: 'serio', req: { stat: 'ingenio', min: 2 }, fx: { aff: 1 }, go: 'hub',
            say: ['Lo sé. Es parte de su encanto. Y de mi insomnio.'] },
          { t: 'Hacéis una pareja de póster.', tone: 'broma', fx: { aff: 1 }, go: 'hub', say: ['(Ríe.) Ya hay pósters. No preguntes. Fue idea de Mel.'] },
        ],
      },
      consejo: {
        say: ['Nunca quise ser político. Pero si no me siento a esa mesa, otro decidirá por mí.'],
        opts: [
          { t: 'Pues hazlo bien: escucha a Zaun.', tone: 'serio', fx: { aff: 1, rep: { zaun: 1 } }, go: 'hub', say: ['Eso intento. Aunque el Consejo escucha poco y habla mucho.'] },
          { t: 'Te sienta bien la capa de consejero.', tone: 'coqueto', go: 'hub', say: ['¿Verdad? Pica un montón. Pero queda heroica.'] },
        ],
      },
      martillo: {
        say: ['Mercurio empezó como herramienta. Ojalá nunca tenga que usarlo como arma.'],
        opts: [
          { t: '¿Me dejas levantarlo?', tone: 'broma', req: { stat: 'valor', min: 3 }, fx: { aff: 1, stats: { valor: 1 } }, go: 'hub',
            say: [{ s: 'narrador', t: 'Lo levantas medio palmo. Te tiembla todo. Jayce aplaude.' }, '¡Muy bien! Yo tardé una semana en no tirármelo encima.'] },
          { t: 'Todo lo que se fabrica acaba siendo un arma.', tone: 'duro', go: 'hub', say: ['…Espero que te equivoques. Pero tengo miedo de que no.'] },
        ],
      },
      delata: {
        say: ['(Se cruza de brazos.) Me expulsaron de la Academia por tu culpa. Casi me cuesta todo.'],
        opts: [
          { t: 'Creí que era lo correcto. Me equivoqué.', tone: 'amable', fx: { aff: 2 }, go: 'hub', say: ['(Suspira.) Bueno… al final todo salió bien. Perdonado. Pero me debes una cena.'] },
          { t: 'Heimerdinger tenía razón: es peligroso.', tone: 'serio', fx: { aff: -1 }, go: 'hub', say: ['Peligroso es no avanzar. Ya lo verás.'] },
        ],
      },
    },
  },

  // =========================================================== VIKTOR
  viktor: {
    greet: { low: '¿Sí? Estoy ocupado.', mid: '{name}. Bienvenid{g:o|a|e} al laboratorio.', high: '{name}, amig{g:o|a|e}. Siéntate. Tengo café y teorías.' },
    bye: ['Vuelve cuando quieras. El laboratorio nunca duerme. Yo tampoco.', 'Gracias por la compañía. Es… un experimento poco frecuente.', 'Adiós, {name}. Cuidado con el escalón. Lo puse yo.'],
    hub: [
      { t: '¿Qué es el Hexcore?', tone: 'pregunta', go: 'hexcore' },
      { t: '¿Cómo te encuentras? Esa tos no suena bien.', tone: 'amable', go: 'salud' },
      { t: 'Háblame de tu infancia en Zaun.', tone: 'pregunta', go: 'zaun' },
      { t: '¿Qué opinas de Jayce?', tone: 'pregunta', say: ['Jayce sueña a lo grande. Yo me aseguro de que sus sueños no exploten.', '(Casi sonríe.) Es mi mejor amigo. No se lo digas, se le subiría a la cabeza.'] },
      { t: '¿Y de Heimerdinger?', tone: 'pregunta', say: ['El profesor me dio una oportunidad cuando nadie más lo hizo. Pero su prudencia… es una jaula.'] },
      { t: 'Tenías razón: el Hexcore aprende. Lo vi.', tone: 'serio', req: { flag: 'entiende_hexcore' }, once: true, fx: { aff: 2, stats: { ingenio: 1 } },
        say: ['(Te mira como si fueras la primera persona que existe.) ¿Lo viste? ¿De verdad? Entonces no estoy loco.'] },
      { t: '¿Qué es la Evolución Gloriosa?', tone: 'serio', req: { season: 2 }, go: 'evolucion' },
    ],
    nodes: {
      hexcore: {
        say: ['El Hexcore no solo almacena energía. Aprende. Se adapta. Es lo más parecido a la vida que he visto.'],
        opts: [
          { t: 'Podría curarte.', tone: 'amable', fx: { aff: 1 }, go: 'hub', say: ['Podría curar enfermedades que llevan siglos matándonos. Incluida la mía. Sí.'] },
          { t: '¿Y si aprende algo que no queremos?', tone: 'serio', req: { stat: 'ingenio', min: 3 }, fx: { aff: 1, stats: { ingenio: 1 }, flags: ['viktor_duda'] }, go: 'hub',
            say: ['(Deja de escribir.) …Es una pregunta legítima. Nadie me la había hecho.', 'Tomaré precauciones. Te lo prometo.'] },
          { t: 'Me da escalofríos, la verdad.', tone: 'broma', go: 'hub', say: ['A mí también. Por eso es fascinante.'] },
        ],
      },
      salud: {
        say: ['(Tose y oculta el pañuelo.) No tengo tiempo para lamentarme. Solo tengo tiempo para trabajar.'],
        opts: [
          { t: 'Al menos deja que te ayude con el trabajo.', tone: 'amable', fx: { aff: 2 }, go: 'hub', say: ['…Acepto. Pásame ese destornillador. El pequeño. No, el otro.'] },
          { t: 'Deberías decírselo a Jayce.', tone: 'serio', go: 'hub', say: ['Jayce ya tiene bastantes preocupaciones. Esta es solo mía.'] },
          { t: 'Pues vas a morir si sigues así.', tone: 'duro', fx: { aff: -1 }, go: 'hub', say: ['(Frío.) Gracias por el diagnóstico, doctor{g:|a|e}. Ya lo sabía.'] },
        ],
      },
      zaun: {
        say: ['Crecí en Zaun. Allí aprendes que el progreso de arriba siempre se construye con el humo de abajo.'],
        opts: [
          { t: 'Yo también sé lo que es eso.', tone: 'amable', req: { notFlag: 'familia_famosa' }, fx: { aff: 1, rep: { zaun: 1 } }, go: 'hub', say: ['Entonces entiendes por qué no puedo parar.'] },
          { t: '¿Qué hacías de pequeño?', tone: 'pregunta', go: 'hub', say: ['Arreglaba cosas que los demás tiraban. Juguetes, relojes, una vez un perro mecánico. Se llamaba Tuerca.'] },
        ],
      },
      evolucion: {
        say: ['Un mundo sin dolor. Sin miedo. Sin diferencias que nos separen. ¿No es eso lo que todos queremos?'],
        opts: [
          { t: 'Sin dolor tampoco hay alegría, Viktor.', tone: 'serio', req: { stat: 'carisma', min: 3 }, fx: { aff: 1, flags: ['viktor_humano'] }, go: 'hub',
            say: ['(Se detiene. Por un instante, ves al chico de Zaun.) …Eso decía Sky.', 'Lo pensaré. Es lo máximo que puedo darte.'] },
          { t: 'Quiero saber más.', tone: 'pregunta', go: 'hub', say: ['Ven al Sumidero. Allí lo verás con tus propios ojos.'] },
          { t: 'Me das miedo.', tone: 'duro', go: 'hub', say: ['El miedo es solo el último síntoma. Pasará.'] },
        ],
      },
    },
  },

  // =========================================================== MEL
  mel: {
    greet: { low: 'Consejera Medarda. ¿Tenemos cita?', mid: '{name}. Siempre en el lugar adecuado. Me gusta.', high: 'Ah, mi aliad{g:o|a|e} favorit{g:o|a|e}. Acompáñame, tengo vino de Noxus.' },
    bye: ['Hasta pronto. Y recuerda: en Piltover todo se paga.', 'Ha sido un placer. Casi siempre lo es contigo.', 'Ve con cuidado. Hay oídos en todas las paredes. Algunos son míos.'],
    hub: [
      { t: '¿Cómo es Noxus?', tone: 'pregunta', go: 'noxus' },
      { t: 'Hablemos de política.', tone: 'astuto', go: 'politica' },
      { t: '¿Qué ves en Jayce?', tone: 'coqueto', go: 'jayce' },
      { t: 'Tu colección de arte es impresionante.', tone: 'amable', fx: { aff: 1 }, once: true,
        say: ['Colecciono arte porque la belleza también es una forma de poder. Y porque me gusta. Las dos cosas.'] },
      { t: 'Cuenta conmigo en el Consejo.', tone: 'serio', req: { flag: 'aliado_mel' }, once: true, fx: { aff: 2, rep: { piltover: 1 } },
        say: ['Lo sé. Por eso te elegí. Los aliados elegantes son los más difíciles de encontrar.'] },
      { t: 'Esa luz dorada en tus manos… ¿es magia?', tone: 'pregunta', req: { season: 2 }, go: 'magia' },
    ],
    nodes: {
      noxus: {
        say: ['Noxus me enseñó que la fuerza es útil. Piltover me enseñó que la inteligencia lo es más.'],
        opts: [
          { t: '¿Y tu madre?', tone: 'pregunta', go: 'hub', say: ['Mi madre llegará pronto. Prepárate: Ambessa no pide, toma.'] },
          { t: '¿Echas de menos tu hogar?', tone: 'amable', fx: { aff: 1 }, go: 'hub', say: ['(Mira por la ventana.) A veces. Echo de menos a mi hermano. A nadie más.'] },
          { t: 'Noxus suena a un sitio de bárbaros.', tone: 'duro', fx: { aff: -1 }, go: 'hub', say: ['Bárbaros con mejor ejército que el vuestro. Yo de ti, hablaría más bajo.'] },
        ],
      },
      politica: {
        say: ['Todo voto empieza con una conversación, y toda conversación con una promesa. ¿Qué me ofreces?'],
        opts: [
          { t: 'Información sobre Zaun.', tone: 'astuto', req: { stat: 'sigilo', min: 2 }, fx: { aff: 2, rep: { piltover: 1 } }, go: 'hub',
            say: ['(Sonríe despacio.) Ahora sí estamos hablando el mismo idioma.'] },
          { t: 'Mi lealtad. Sin condiciones.', tone: 'serio', fx: { aff: 1 }, go: 'hub', say: ['Nunca des nada sin condiciones, {name}. Pero lo aprecio.'] },
          { t: 'Nada. Solo quería charlar.', tone: 'broma', go: 'hub', say: ['Qué refrescante. Y qué inútil. (Se ríe.) Me caes bien.'] },
        ],
      },
      jayce: {
        say: ['Jayce tiene algo que no se compra: convicción. Hay que protegerle de sí mismo.'],
        opts: [
          { t: '¿Le quieres o le usas?', tone: 'duro', req: { stat: 'carisma', min: 2 }, fx: { aff: 1 }, go: 'hub',
            say: ['(Te sostiene la mirada.) Las dos cosas pueden ser verdad a la vez. Esa es la parte difícil.'] },
          { t: 'Hacéis buena pareja.', tone: 'amable', go: 'hub', say: ['Lo sé. (Sonríe.) Pero gracias.'] },
        ],
      },
      magia: {
        say: ['(Cierra la mano y la luz se apaga.) Algo que mi familia lleva siglos escondiendo. Y que ahora necesito.'],
        opts: [
          { t: 'Tu secreto está a salvo conmigo.', tone: 'amable', fx: { aff: 2 }, go: 'hub', say: ['Lo sé. Si no, no te lo habría enseñado.'] },
          { t: '¿Podrías usarla contra tu madre?', tone: 'serio', go: 'hub', say: ['Puedo usarla para que mi madre no tenga que ganar. Que no es lo mismo.'] },
        ],
      },
    },
  },

  // =========================================================== SILCO
  silco: {
    greet: { low: 'Tienes valor para presentarte aquí.', mid: '{name}. Siéntate. Hablemos de negocios.', high: '{name}. Eres de los pocos en quienes confío. No lo desperdicies.' },
    bye: ['Puedes irte. Por ahora.', 'Vuelve cuando tengas algo que valga mi tiempo.', 'Cierra la puerta al salir. Y no mires atrás.'],
    hub: [
      { t: '¿Qué quieres para Zaun?', tone: 'pregunta', go: 'zaun' },
      { t: 'Háblame de Jinx.', tone: 'serio', go: 'jinx' },
      { t: '¿Qué pasó con Vander?', tone: 'pregunta', go: 'vander' },
      { t: 'El Brillo está matando a la gente.', tone: 'duro', go: 'brillo' },
      { t: '¿Cómo te hiciste esa cicatriz?', tone: 'pregunta', req: { aff: 4 }, go: 'cicatriz' },
      { t: 'Busco trabajo.', tone: 'astuto', go: 'trabajo', req: { notFlag: 'rechaza_silco' } },
      { t: 'Sigo trabajando para ti. Lealmente.', tone: 'astuto', req: { flag: 'agente_doble' }, once: true,
        say: ['(Te observa mucho rato.) Me alegra oírlo. Porque si mientes, lo sabré. Siempre lo sé.'] },
    ],
    nodes: {
      zaun: {
        say: ['Zaun será una nación. No un barrio. No un vertedero. Una nación.'],
        opts: [
          { t: 'Yo también quiero eso.', tone: 'serio', fx: { aff: 2, rep: { zaun: 1 } }, go: 'hub', say: ['Entonces tenemos algo en común. Es un buen comienzo.'] },
          { t: '¿Y a cuántos piensas sacrificar por el camino?', tone: 'duro', req: { stat: 'valor', min: 2 }, fx: { aff: -1, stats: { valor: 1 } }, go: 'hub',
            say: ['(Sonríe sin alegría.) A todos los que hagan falta. Piltover nunca se ha hecho esa pregunta. ¿Por qué tendría que hacerla yo?'] },
          { t: 'Piltover nunca lo permitirá.', tone: 'pregunta', go: 'hub', say: ['Piltover nos teme. Bien. El miedo es el primer paso hacia el respeto.'] },
        ],
      },
      jinx: {
        say: ['Jinx es perfecta. Que nadie te diga lo contrario. Y menos ella misma.'],
        opts: [
          { t: 'Se nota que la quieres como a una hija.', tone: 'amable', fx: { aff: 2 }, go: 'hub', say: ['(Algo se rompe en su voz.) …Es lo único que he hecho bien en esta vida.'] },
          { t: 'La estás convirtiendo en un arma.', tone: 'duro', fx: { aff: -2 }, go: 'hub', say: ['Cuidado, {name}. Hay temas que no se tocan en mi presencia.'] },
          { t: 'Vi quiere recuperarla.', tone: 'astuto', req: { stat: 'sigilo', min: 2 }, fx: { flags: ['silco_teme_vi'] }, go: 'hub',
            say: ['(Aprieta el vaso.) Vi la abandonó. Yo la recogí. Que no se le olvide a nadie.'] },
        ],
      },
      vander: {
        say: ['Vander era mi hermano. Eligió arrodillarse. Yo elegí levantarme.'],
        opts: [
          { t: 'Le traicionaste.', tone: 'duro', fx: { aff: -1 }, go: 'hub', say: ['Él me traicionó primero. Me sostuvo bajo el agua del río. Yo solo terminé la conversación.'] },
          { t: '¿Le echas de menos?', tone: 'amable', req: { aff: 3 }, fx: { aff: 1 }, go: 'hub', say: ['(Silencio.) Cada día. Y le odio por ello.'] },
        ],
      },
      brillo: {
        say: ['El Brillo es una herramienta. Como un martillo. Depende de la mano que lo sostiene.'],
        opts: [
          { t: 'Pues tu mano está llena de cadáveres.', tone: 'duro', req: { stat: 'valor', min: 3 }, fx: { aff: -1, rep: { zaun: 1 } }, go: 'hub',
            say: ['(Te mira largo rato.) Tienes agallas. No mucha gente me habla así y sigue respirando. Disfrútalo.'] },
          { t: 'Es un buen negocio, eso sí.', tone: 'astuto', fx: { aff: 1 }, go: 'hub', say: ['Por fin alguien que entiende la economía de Zaun.'] },
        ],
      },
      cicatriz: {
        say: ['(Se toca el ojo.) Un recuerdo de lo que cuesta confiar.'],
        opts: [
          { t: 'Nadie debería pasar por eso.', tone: 'amable', fx: { aff: 1 }, go: 'hub', say: ['No. Pero pasan. Por eso construyo un sitio donde no vuelva a ocurrir.'] },
          { t: 'Te queda bien. Da miedo.', tone: 'broma', go: 'hub', say: ['(Casi ríe.) Esa es la idea.'] },
        ],
      },
      trabajo: {
        say: ['¿Trabajo? Siempre hay trabajo para quien sabe callar. ¿Sabes callar, {name}?'],
        opts: [
          { t: '(No decir nada y asentir.)', tone: 'sigilo', fx: { aff: 2, rep: { zaun: 1 } }, go: 'hub', say: ['Bien. Respuesta correcta. Sevika te dirá qué hacer.'] },
          { t: 'Depende de lo que pagues.', tone: 'astuto', fx: { aff: 1 }, go: 'hub', say: ['Lo suficiente para que no hagas preguntas.'] },
          { t: 'Era broma. No trabajaré para ti.', tone: 'duro', fx: { aff: -2 }, go: 'hub', say: ['Qué lástima. Las bromas en Zaun salen caras.'] },
        ],
      },
    },
  },

  // =========================================================== VANDER
  vander: {
    greet: { low: 'Hmm. ¿Qué tomas?', mid: '{name}. Siéntate, que invita la casa.', high: '¡{name}! Ven aquí, chaval{g:|a|e}. Hoy tengo el guiso bueno.' },
    bye: ['Vuelve cuando quieras. La puerta siempre está abierta.', 'Cuídate, chaval{g:|a|e}. Y no te metas en líos.', 'Venga. Y dile a Vi que vuelva antes de cenar.'],
    hub: [
      { t: 'Háblame de los chicos.', tone: 'amable', go: 'chicos' },
      { t: '¿Qué pasó en el puente, hace años?', tone: 'pregunta', go: 'puente' },
      { t: '¿Qué hay entre tú y Silco?', tone: 'serio', say: ['Silco y yo soñábamos lo mismo. Él nunca me perdonó que despertara.'] },
      { t: '¿Qué guardas en ese baúl?', tone: 'astuto', go: 'baul' },
      { t: 'Ponme lo de siempre.', tone: 'broma', fx: { aff: 1 }, once: true,
        say: [{ s: 'narrador', t: 'Te sirve una jarra espumosa sin preguntar. Así se sabe que eres de la casa.' }, 'Lo de siempre. Y no se lo cuentes a Vi, que luego quiere lo mismo.'] },
    ],
    nodes: {
      chicos: {
        say: ['Esos chavales son lo mejor que me ha pasado. Y lo que más canas me ha dado.'],
        opts: [
          { t: 'Se nota que eres un buen padre.', tone: 'amable', fx: { aff: 2 }, go: 'hub', say: ['(Se le humedecen los ojos y finge limpiar un vaso.) Hago lo que puedo. Nunca es suficiente.'] },
          { t: 'Vi está planeando algo gordo. Ten cuidado.', tone: 'serio', fx: { aff: 1 }, go: 'hub', say: ['(Suspira.) Siempre lo está. Gracias por avisarme.'] },
          { t: '¿Y Powder? ¿Encaja con los demás?', tone: 'pregunta', go: 'hub', say: ['Powder es especial. Los demás no siempre lo ven. Yo sí. Algún día lo verá el mundo entero.'] },
        ],
      },
      puente: {
        say: ['La paz no es bonita. Pero la guerra es peor. Lo vi en el puente.'],
        opts: [
          { t: '¿Te arrepientes de la revuelta?', tone: 'pregunta', go: 'hub', say: ['De la revuelta no. De los muertos, cada día. Vi y Powder perdieron a sus padres allí.'] },
          { t: 'Zaun necesita otra revuelta.', tone: 'duro', fx: { aff: -1, rep: { zaun: 1 } }, go: 'hub', say: ['Zaun necesita que sus hijos lleguen a viejos. Primero eso.'] },
          { t: 'Hiciste lo correcto al parar.', tone: 'amable', fx: { aff: 1 }, go: 'hub', say: ['Eso me digo cada noche. Algunas me lo creo.'] },
        ],
      },
      baul: {
        say: ['(Su mano se posa sobre el baúl.) Esos guantes están ahí por una razón. Y ahí se quedan.'],
        opts: [
          { t: '¿Los guanteletes del puente?', tone: 'pregunta', go: 'hub', say: ['Los mismos. Pesan más de lo que parece. No por el metal.'] },
          { t: '(Intentar abrir el baúl cuando no mira.)', tone: 'sigilo', req: { stat: 'sigilo', min: 3 }, fx: { aff: -2, stats: { sigilo: 1 } }, go: 'hub',
            say: [{ s: 'narrador', t: 'Ni lo rozas. Una mano enorme se posa en tu hombro.' }, 'Ni lo pienses. Ni tú ni Mylo. Fuera de mi vista un rato.'] },
        ],
      },
    },
  },

  // =========================================================== EKKO
  ekko: {
    greet: { low: '¿Y tú qué haces aquí?', mid: '¡{name}! ¿Te vienes a dar una vuelta en aerotabla?', high: '¡{name}! Las Luciérnagas tienen una Luciérnaga honoraria. Adivina quién.' },
    bye: ['¡Nos vemos! Y vigila los tejados.', 'Si necesitas algo, silba dos veces. Alguien te oirá.', '¡Hasta luego! El árbol te espera.'],
    hub: [
      { t: '¿Qué son las Luciérnagas?', tone: 'pregunta', go: 'luciernagas' },
      { t: 'Háblame de Powder.', tone: 'amable', go: 'powder' },
      { t: 'Déjame probar la aerotabla.', tone: 'broma', go: 'aerotabla' },
      { t: '¿Quién era Benzo para ti?', tone: 'serio', say: ['Benzo me enseñó que la chatarra puede volar. Y que algunas cosas valen más que la vida.'] },
      { t: '¿Qué piensas de Silco?', tone: 'duro', fx: { rep: { zaun: 1 } }, once: true, say: ['Silco envenena Zaun con su Brillo. Nosotros apagamos ese fuego, envío a envío.'] },
      { t: 'Os ayudé contra Sevika. Lo haría otra vez.', tone: 'serio', req: { flag: 'heroe_luciernagas' }, once: true, fx: { aff: 3 },
        say: ['Lo sé. Te vi. (Te da un golpe en el puño.) Eres de los nuestros. Para siempre.'] },
      { t: 'Fui yo quien vendió la ruta del árbol.', tone: 'serio', req: { flag: 'traiciona_luciernagas' }, once: true, go: 'traicion' },
      { t: '¿Qué viste al otro lado de la grieta?', tone: 'pregunta', req: { season: 2 }, go: 'grieta' },
    ],
    nodes: {
      luciernagas: {
        say: ['Aquí nadie es de nadie. Todos somos de todos. Así sobrevivimos.'],
        opts: [
          { t: 'Quiero unirme.', tone: 'amable', req: { aff: 3 }, fx: { aff: 2, rep: { zaun: 1 }, flags: ['luciernaga'] }, go: 'hub',
            say: ['(Sonríe de oreja a oreja.) Pensé que nunca lo dirías. Toma: tu máscara. Te queda fatal. Perfecto.'] },
          { t: 'Sois unos críos jugando a la guerra.', tone: 'duro', fx: { aff: -2 }, go: 'hub', say: ['Estos «críos» llevan años salvando a gente que los mayores abandonaron. Piénsalo.'] },
          { t: '¿Cómo os escondéis tan bien?', tone: 'pregunta', fx: { stats: { sigilo: 1 } }, go: 'hub', say: ['Regla uno: nunca vayas por el mismo camino dos veces. Regla dos: mira arriba. Nadie mira arriba.'] },
        ],
      },
      powder: {
        say: ['Powder era mi mejor amiga. Jinx… no sé quién es. Pero a veces la veo ahí dentro.'],
        opts: [
          { t: 'Todavía está ahí. Lo sé.', tone: 'amable', fx: { aff: 2 }, go: 'hub', say: ['(Aprieta los dientes.) Ojalá tengas razón. Si no, no sé qué voy a hacer.'] },
          { t: 'Tienes que dejarla ir.', tone: 'serio', go: 'hub', say: ['Ya lo intenté. No funciona. Es como intentar dejar de respirar.'] },
          { t: '¿Te gustaba?', tone: 'coqueto', req: { aff: 4 }, fx: { aff: 1 }, go: 'hub', say: ['(Se rasca la nuca.) Éramos niños. …Sí. Mucho. Cállate.'] },
        ],
      },
      aerotabla: {
        say: ['¿Quieres probarla? Regla única: si te caes, no grites. Atrae a los matones.'],
        opts: [
          { t: '(Subirte y lanzarte desde el tejado.)', tone: 'duro', req: { stat: 'valor', min: 2 }, fx: { aff: 2, stats: { valor: 1 } }, go: 'hub',
            say: [{ s: 'narrador', t: 'Durante tres gloriosos segundos vuelas sobre Zaun. Luego aterrizas en un toldo.' }, '¡JA! ¡Primer intento y sin gritar! Eres natural.'] },
          { t: 'Mejor me lo explicas primero.', tone: 'pregunta', fx: { stats: { ingenio: 1 } }, go: 'hub', say: ['Inclinas el peso, el motor de Z hace el resto. Fácil. Ahora, ¡arriba!'] },
        ],
      },
      traicion: {
        say: ['(Se queda quieto. Muy quieto.) Perdimos a seis personas aquella noche.'],
        opts: [
          { t: 'No hay excusa. Lo siento.', tone: 'serio', fx: { aff: 1 }, go: 'hub', say: ['…Al menos lo dices a la cara. Eso es más de lo que hace Silco.', 'No te perdono. Pero tampoco te echo. Gánatelo.'] },
          { t: 'Silco me obligó.', tone: 'astuto', fx: { aff: -2 }, go: 'hub', say: ['Silco obliga a mucha gente. Nosotros dijimos que no. Fuera de aquí.'] },
        ],
      },
      grieta: {
        say: ['Un mundo donde nada salió mal. Donde Powder… (Calla.) Donde fuimos felices.'],
        opts: [
          { t: 'Podemos construir algo así aquí.', tone: 'amable', fx: { aff: 2, flags: ['esperanza_ekko'] }, go: 'hub', say: ['Eso me dijo ella, allí. Supongo que hay que intentarlo.'] },
          { t: '¿Podrías volver allí?', tone: 'pregunta', go: 'hub', say: ['Podría. Pero mi sitio es este. Con todo lo roto.'] },
        ],
      },
    },
  },

  // =========================================================== SEVIKA
  sevika: {
    greet: { low: 'Lárgate antes de que me aburra.', mid: '{name}. ¿Trabajo o diversión?', high: '{name}. No eres tan inútil como pensaba. Siéntate.' },
    bye: ['Largo.', 'No me hagas esperar la próxima vez.', '(Te echa el humo a la cara a modo de despedida.)'],
    hub: [
      { t: 'Ese brazo es impresionante.', tone: 'amable', go: 'brazo' },
      { t: '¿Por qué trabajas para Silco?', tone: 'pregunta', go: 'silco' },
      { t: '¿Qué opinas de Jinx?', tone: 'pregunta', say: ['Esa cría es un problema con patas. Y Silco no lo ve.'] },
      { t: '¿Una partida de cartas?', tone: 'broma', go: 'cartas' },
      { t: 'Bajé al foso contra ti. No me arrepiento.', tone: 'duro', req: { flag: 'sabe_cohete' }, once: true, fx: { aff: 2 },
        say: ['(Ríe, ronca.) Duraste más de lo que pensaba. Eso en Zaun es un cumplido.'] },
    ],
    nodes: {
      brazo: {
        say: ['Funciona mejor que el original. Y pega más fuerte.'],
        opts: [
          { t: '¿Cómo perdiste el otro?', tone: 'pregunta', req: { aff: 3 }, fx: { aff: 1 }, go: 'hub', say: ['En el puente. Peleando por Vander. (Escupe.) Y él se rindió igual. Ahí lo tienes.'] },
          { t: '¿Me haces un pulso?', tone: 'duro', req: { stat: 'valor', min: 3 }, fx: { aff: 2, stats: { valor: 1 } }, go: 'hub',
            say: [{ s: 'narrador', t: 'Pierdes en un segundo. Te crujen los dedos. Sevika sonríe por primera vez.' }, 'Tienes valor. Cerebro, no. Pero valor, sí.'] },
        ],
      },
      silco: {
        say: ['Silco tiene un plan. Yo tengo un puño. Nos complementamos.'],
        opts: [
          { t: '¿Y si su plan te deja tirada?', tone: 'astuto', req: { stat: 'carisma', min: 2 }, fx: { aff: 1, flags: ['sevika_duda'] }, go: 'hub', say: ['(Da una calada larga.) Entonces haré mi propio plan. Siempre tengo uno de reserva.'] },
          { t: 'Lealtad. Me gusta.', tone: 'serio', fx: { aff: 1 }, go: 'hub', say: ['No es lealtad. Es negocio. La lealtad la enterré con Vander.'] },
        ],
      },
      cartas: {
        say: ['¿Una partida? Pierdes, pagas. Ganas… bueno, no vas a ganar.'],
        opts: [
          { t: '(Jugar limpio.)', tone: 'serio', go: 'hub', say: [{ s: 'narrador', t: 'Pierdes tres manos seguidas. Sevika se guarda tus monedas.' }, 'Gracias por la donación.'] },
          { t: '(Hacer trampas con disimulo.)', tone: 'sigilo', req: { stat: 'sigilo', min: 3 }, fx: { aff: 2, stats: { sigilo: 1 } }, go: 'hub',
            say: [{ s: 'narrador', t: 'Ganas. Sevika te mira, mira tu manga, y se ríe.' }, 'Tramposo. Me gustas. Pero la próxima vez te rompo los dedos.'] },
        ],
      },
    },
  },

  // =========================================================== AMBESSA
  ambessa: {
    greet: { low: '¿Quién eres tú para dirigirte a mí?', mid: '{name}. He oído hablar de ti. Impresióname.', high: '{name}. Tienes el temple de un lobo. Noxus podría usar a alguien como tú.' },
    bye: ['Puedes retirarte.', 'Que la fuerza te acompañe. La tuya, no la de otros.', 'Vete. Y vuelve más fuerte.'],
    hub: [
      { t: '¿Qué busca Noxus en Piltover?', tone: 'pregunta', go: 'noxus' },
      { t: 'Háblame de Mel.', tone: 'amable', go: 'mel' },
      { t: '¿Por qué los lobos?', tone: 'pregunta', say: ['El lobo que duda acaba siendo cordero. Mis hijos lo aprendieron pronto. Algunos, demasiado tarde.'] },
      { t: '¿Qué es la Rosa Negra?', tone: 'pregunta', req: { season: 2 }, go: 'rosa' },
      { t: '¿Qué piensas de Caitlyn Kiramman?', tone: 'astuto', req: { season: 2 }, say: ['La joven Kiramman ha perdido a su madre y ha encontrado su puntería. Es la mejor alumna que he tenido en años.', '(Sonríe apenas.) Lo malo de las buenas alumnas es que un día dejan de necesitarte.'] },
      { t: 'Negocié contigo las condiciones de la alianza.', tone: 'serio', req: { flag: 'trato_noxus' }, once: true, fx: { aff: 2 },
        say: ['Y lo hiciste bien. Pocos se atreven a regatear con una Medarda y conservan las manos.'] },
    ],
    nodes: {
      noxus: {
        say: ['Noxus no pregunta de dónde vienes. Solo cuánto vales. Y la hextec vale mucho.'],
        opts: [
          { t: 'No vas a tener nuestras armas.', tone: 'duro', req: { stat: 'valor', min: 3 }, fx: { aff: 1, rep: { piltover: 1 } }, go: 'hub', say: ['(Sonríe.) Me gusta tu fuego. Será una lástima apagarlo.'] },
          { t: '¿Qué ofreces a cambio?', tone: 'astuto', fx: { aff: 1 }, go: 'hub', say: ['Protección. Ejércitos. Y no ser tu enemiga, que es lo más valioso de todo.'] },
          { t: 'Un arma que no se usa no sirve, ¿no?', tone: 'serio', go: 'hub', say: ['Un arma que no se usa es una promesa rota. Al fin alguien lo entiende.'] },
        ],
      },
      mel: {
        say: ['Mel es más fuerte de lo que cree. Aunque elija armas extrañas, como la diplomacia.'],
        opts: [
          { t: 'Quizá la diplomacia sea más fuerte que tus ejércitos.', tone: 'serio', req: { stat: 'carisma', min: 3 }, fx: { aff: 1 }, go: 'hub', say: ['(Te estudia.) Eso mismo dijo su padre. Está muerto.', 'Pero tú no eres él. Veremos.'] },
          { t: 'La quieres, a tu manera.', tone: 'amable', fx: { aff: 1 }, go: 'hub', say: ['Una madre que no quisiera a su hija la habría dejado en paz. Yo la quiero viva y victoriosa.'] },
          { t: '¿Por qué la mandaste lejos de niña?', tone: 'serio', req: { season: 2 }, go: 'hub',
            say: ['(La mandíbula se le tensa.) Porque Noxus devora a sus hijos más brillantes. Y Mel brillaba demasiado.', 'Que ella crea que la exilié por débil es el precio. Lo pago con gusto.'] },
        ],
      },
      rosa: {
        say: ['Una sombra. Magos que gobiernan Noxus desde detrás del trono desde hace siglos. Visten de negro, sonríen mucho y no envejecen.', 'Llevo toda mi vida luchando contra ellos. Por eso necesito la hextec: para que una espada pueda matar a un mago.'],
        opts: [
          { t: 'Y Mel es una maga.', tone: 'astuto', req: { flag: 'aliado_mel_s2' }, fx: { aff: -1 }, go: 'hub', say: ['(Te mira como un lobo mira a otro lobo.) Mel es mi hija. Eso es lo único que importa de ella.', 'Repítelo en voz alta en otro sitio y no saldrás de él.'] },
          { t: 'Usar sus armas contra ellos te hará igual.', tone: 'serio', req: { stat: 'carisma', min: 3 }, fx: { aff: 1 }, go: 'hub', say: ['Ya soy igual, {name}. La diferencia es que yo lo sé.'] },
          { t: 'Entendido. No me meteré en eso.', tone: 'sigilo', go: 'hub', say: ['Sabia decisión. Los que se meten en eso desaparecen sin hacer ruido.'] },
        ],
      },
    },
  },

  // =========================================================== CASSANDRA
  cassandra: {
    greet: { low: 'Usted dirá.', mid: '{name}. Gracias por cuidar de mi hija.', high: '{name}, querid{g:o|a|e}. Siempre eres bienvenid{g:o|a|e} en la mansión.' },
    bye: ['Hasta pronto. Cierre al salir, el servicio está libre hoy.', 'Que tenga un buen día.', 'Cuide de Caitlyn, por favor.'],
    hub: [
      { t: '¿Cómo es Caitlyn de verdad?', tone: 'amable', say: ['Caitlyn tiene el corazón de su padre y la cabeza dura de los Kiramman. Mala combinación para una madre.'] },
      { t: '¿Qué piensa de la hextec?', tone: 'pregunta', go: 'consejo' },
      { t: 'Su casa es preciosa.', tone: 'amable', once: true, fx: { aff: 1 }, say: ['Gracias. Lleva tres generaciones en la familia. Y tres generaciones de discusiones en esa mesa.'] },
      { t: '¿Qué recuerda de la revuelta del puente?', tone: 'pregunta', go: 'puente' },
      { t: '¿Por qué no quiere que Caitlyn sea ejecutora?', tone: 'serio', go: 'hija' },
      { t: '¿Qué opina de Mel Medarda?', tone: 'astuto', say: ['Mel es brillante, encantadora y noxiana. Las tres cosas a la vez, y no sé cuál me preocupa más.', '(Bebe un sorbo de té.) Aun así, prefiero tenerla sentada a mi lado en el Consejo que enfrente.'] },
      { t: 'Hablé en el Consejo para que la hextec llegara a Zaun.', tone: 'serio', req: { flag: 'hextec_zaun' }, once: true, fx: { aff: -1, rep: { zaun: 1 } },
        say: ['Lo recuerdo. Fue valiente. Y temerario.', '(Pausa.) Mi marido dijo lo mismo que tú aquella noche, durante la cena. No le di la razón. Quizá debí hacerlo.'] },
    ],
    nodes: {
      consejo: {
        say: ['El Consejo necesita prudencia, no espectáculo. Por eso desconfío de tanto entusiasmo.'],
        opts: [
          { t: 'Coincido. Hay que ir con cuidado.', tone: 'serio', fx: { aff: 1, rep: { piltover: 1 } }, go: 'hub', say: ['Al fin alguien con sentido común en esta ciudad.'] },
          { t: 'Con prudencia, Zaun seguirá en el fango.', tone: 'duro', fx: { aff: -1, rep: { zaun: 1 } }, go: 'hub', say: ['(Frunce los labios.) Quizá. Pero la imprudencia también mata. Lo he visto.'] },
        ],
      },
      puente: {
        say: ['Yo era joven y acababa de ocupar mi asiento. Desde la ventana del Consejo se veía el humo del puente.', 'Un hombre enorme de abajo, Vander, avanzaba al frente de cientos de personas. Los ejecutores dispararon. Él siguió avanzando.'],
        opts: [
          { t: 'Vander se arrepintió toda su vida.', tone: 'amable', fx: { aff: 1 }, go: 'hub', say: ['(Silencio.) Eso dicen. Nosotros nunca nos arrepentimos en voz alta. Quizá esa es la diferencia entre arriba y abajo.'] },
          { t: '¿Y qué hizo el Consejo después?', tone: 'pregunta', go: 'hub', say: ['Lo que hace siempre: cerrar las puertas y fingir que el problema se quedaba al otro lado del río.', 'No funcionó. Nunca funciona.'] },
          { t: 'Piltover se lo buscó.', tone: 'duro', fx: { aff: -2, rep: { zaun: 1 } }, go: 'hub', say: ['(Deja la taza con cuidado.) Cuidado, {name}. Esta casa ha perdido gente en ese puente. Igual que las de abajo.'] },
        ],
      },
      hija: {
        say: ['Porque la conozco. Caitlyn no sabe parar. Si ve una injusticia, se mete dentro hasta el cuello.', 'Los ejecutores no protegen a gente como Caitlyn. La usan.'],
        opts: [
          { t: 'Por eso es buena en lo que hace.', tone: 'amable', fx: { aff: 1, flags: ['cass_orgullo'] }, go: 'hub', say: ['(Una sonrisa breve.) Lo sé. Y es lo que más miedo me da.', 'No le digas que estoy orgullosa. Lo usaría en mi contra en la próxima discusión.'] },
          { t: 'Quizá debería decírselo a ella.', tone: 'serio', req: { stat: 'carisma', min: 2 }, fx: { aff: 2 }, go: 'hub', say: ['(Te mira largo rato.) Los Kiramman no somos buenos diciendo las cosas. Las escribimos en cartas que nunca enviamos.', 'Pero quizá tengas razón. Esta noche cenaremos juntas.'] },
        ],
      },
    },
  },

  // =========================================================== ISHA
  isha: {
    greet: { low: '(Te mira desde detrás de las gafas, desconfiada.)', mid: '(Te saluda con la mano y te enseña un dibujo nuevo.)', high: '(Corre hacia ti y te abraza las piernas. Luego te tira de la manga para enseñarte algo.)' },
    bye: ['(Te dice adiós con la mano hasta que desapareces.)', '(Te da una piedrecita brillante de regalo.)', '(Te saca la lengua y sale corriendo.)'],
    hub: [
      { t: '¿Qué estás dibujando?', tone: 'amable', go: 'dibujos' },
      { t: '¿Dónde está Jinx?', tone: 'pregunta', go: 'jinx' },
      { t: '¿Por qué llevas esas gafas?', tone: 'pregunta', say: ['(Se baja las gafas, te mira muy seria, y se las vuelve a subir. Secreto.)'] },
      { t: '¿Jugamos a algo?', tone: 'broma', fx: { aff: 1 }, once: true, say: ['(Te lanza una piedrecita y sale corriendo. Quiere que la persigas.)'] },
      { t: '¿Tienes familia, Isha?', tone: 'serio', go: 'familia' },
      { t: 'Te saqué de allí en aerotabla. ¿Te acuerdas?', tone: 'amable', req: { flag: 'salva_isha' }, once: true, fx: { aff: 2 },
        say: ['(Abre los brazos como si volara, hace un ruido de motor sin voz y se tira al suelo de risa.)', { s: 'narrador', t: 'Luego se levanta, se pone muy seria y te da un abrazo rápido. Muy rápido. Antes de que puedas devolvérselo.' }] },
      { t: 'Vi cuida bien de ti, ¿verdad?', tone: 'amable', req: { flag: 'isha_con_vi' }, once: true, fx: { aff: { isha: 1, vi: 1 } },
        say: ['(Hace como que da puñetazos al aire, imitando a Vi. Luego se señala la espinilla y pone cara de pena.)', { s: 'narrador', t: 'Parece que la patada se la devolvieron. Con cariño.' }] },
    ],
    nodes: {
      dibujos: {
        say: ['(Te enseña un dibujo: tú, ella y Jinx encima de un cohete con cara de tiburón.)'],
        opts: [
          { t: '¡Es precioso! ¿Me lo regalas?', tone: 'amable', fx: { aff: 2 }, go: 'hub', say: ['(Asiente muy rápido y te lo da. Luego dibuja otro igual para ella.)'] },
          { t: 'Te ha quedado el cohete torcido.', tone: 'broma', fx: { aff: -1 }, go: 'hub', say: ['(Frunce el ceño, te arranca el dibujo y se cruza de brazos.)'] },
        ],
      },
      jinx: {
        say: ['(Señala hacia los tejados. Luego hace un «¡bum!» con las manos, sin sonido, y sonríe.)'],
        opts: [
          { t: '¿Te cuida bien?', tone: 'amable', fx: { aff: 1 }, go: 'hub', say: ['(Asiente con fuerza y se pone las manos en la cabeza imitando las trenzas de Jinx.)'] },
          { t: 'Jinx es peligrosa, Isha.', tone: 'serio', go: 'hub', say: ['(Niega con la cabeza, muy seria, y te coge la mano muy fuerte.)'] },
          { t: '¿Qué es lo que más te gusta de ella?', tone: 'pregunta', fx: { aff: 1 }, go: 'hub',
            say: ['(Se lo piensa. Luego se tapa los oídos, pone cara de miedo… y se los destapa y sonríe.)', { s: 'narrador', t: 'Entiendes lo que quiere decir: Jinx también oye cosas que dan miedo. Y aun así, con ella, Isha no tiene miedo.' }] },
        ],
      },
      familia: {
        say: ['(Se queda quieta. Señala hacia el Sumidero. Luego hace un gesto de humo violeta con los dedos y baja la mirada.)', { s: 'narrador', t: 'El Brillo. Como a tantos otros en Zaun.' }],
        opts: [
          { t: 'Ahora tienes a Jinx. Y me tienes a mí.', tone: 'amable', fx: { aff: 3 }, go: 'hub', say: ['(Te mira detrás de las gafas enormes. Luego te coge el dedo meñique con el suyo, como una promesa.)'] },
          { t: 'Lo siento mucho, Isha.', tone: 'serio', fx: { aff: 1 }, go: 'hub', say: ['(Se encoge de hombros, como si fuera demasiado grande para cargarlo. Luego te da otro dibujo: una casa con mucha gente dentro.)'] },
        ],
      },
    },
  },
};
