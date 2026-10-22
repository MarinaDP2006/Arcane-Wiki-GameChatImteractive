// Relaciones con los personajes según tu personaje creado, charla con respuestas variadas
// y la personalidad de cada uno para el modo de chat libre con IA.
//
// kinds: tipos de relación. Se piden desde «Lo nuestro…» en el comunicador.
//   amistad (afinidad 4), mejor (amistad + afinidad 8), pareja (afinidad 7 y que os atraigáis),
//   familia (figura paterna/materna/mentor si a tu personaje le faltan padres), hermandad (afinidad 6).
// chars[id]:
//   gender: f | m (para lo que atrae a tu personaje).
//   romance: géneros del jugador con los que puede salir ([] = nunca).
//   family: papel de familia elegida (padre | madre | abuelo | mentor) o null.
//   sibling: true si puede ser herman{g} de corazón.
//   persona: cómo es (para la IA).
//   rel: frases de las relaciones (ask = lo que dices tú, yes/no = lo que responde; listas = variantes).
//   greet: saludos según la relación (variantes al azar).
//   hang: «Pasar el rato» según la relación (cada variante es una escena de una o más líneas).
//   small: respuestas a los temas de charla (cada tema, varias variantes al azar).
// Plantillas: {name}, {job}, {district}, {hobby}, {g:o|a|e}.
window.RELATIONS = {
  kinds: {
    amistad: { label: 'Amistad', icon: '✦' },
    mejor: { label: 'Mejor amig{g:o|a|e}', icon: '✧' },
    pareja: { label: 'Pareja', icon: '♥' },
    familia: { label: 'Familia elegida', icon: '⌂' },
    hermandad: { label: 'Herman{g:o|a|e} de corazón', icon: '❖' },
    pariente: { label: 'Familia', icon: '⌂' },
  },

  // Tu familia en la creación crea lazos desde el principio (y con ellos no hay romance).
  familyLinks: {
    vander: { vander: ['pariente', 'Te acogió como a un{g:| a| e} hij{g:o|a|e}'], vi: ['hermandad', 'Creciste con ella en La Última Gota'], jinx: ['hermandad', 'Era tu hermanita Powder'] },
    benzo: { ekko: ['hermandad', 'Benzo os crió a los dos entre cachivaches'] },
    luciernagas: { ekko: ['hermandad', 'Creciste en el árbol de las Luciérnagas'], isha: ['hermandad', 'La cuidas como a una hermana pequeña'] },
    kiramman: { caitlyn: ['pariente', 'Tu prima'], cassandra: ['pariente', 'Tu tía'] },
    talis: { jayce: ['pariente', 'Tu primo'] },
    medarda: { mel: ['pariente', 'Tu prima'], ambessa: ['pariente', 'La matriarca de tu familia'] },
  },

  // Temas de charla (desde «Charlar un rato…»). Cada personaje tiene sus respuestas en small.
  small: [
    { id: 'dia', t: '¿Qué tal te va el día?', tone: 'pregunta' },
    { id: 'gusta', t: '¿Qué es lo que más te gusta hacer?', tone: 'pregunta' },
    { id: 'secreto', t: 'Cuéntame algo que nadie sepa de ti.', tone: 'astuto', req: { aff: 3 } },
    { id: 'cumplido', t: 'Hoy estás especialmente bien, ¿sabes?', tone: 'coqueto', fx: { aff: 1 } },
    { id: 'broma', t: '¿Te cuento un chiste malo?', tone: 'broma' },
    { id: 'hobby', t: 'Últimamente me ha dado por {hobby}.', tone: 'amable' },
    { id: 'miedo', t: '¿A qué le tienes miedo de verdad?', tone: 'serio', req: { aff: 2 } },
    { id: 'sueno', t: 'Si todo saliera bien… ¿qué harías?', tone: 'amable' },
  ],

  chars: {
    // =========================================================== VI
    vi: {
      gender: 'f', romance: ['mujer', 'nobinario'], family: null, sibling: true,
      persona: 'Vi, luchadora de Zaun de unos 20 años, pelo rosa y guanteletes hextec. Directa, protectora, sarcástica, con mal genio y gran corazón. Busca a su hermana Powder (Jinx), odia a Silco y siente algo por Caitlyn («Cupcake»). Habla en frases cortas, con jerga callejera y humor seco.',
      rel: {
        amistad: { ask: 'Oye, Vi… creo que ya somos amig{g:os|as|es}, ¿no?', yes: ['(Te da un puñetazo suave en el hombro.) Pues claro, idiota. Desde lo del callejón.', 'Amig{g:os|as|es}. Vale. Pero si me traicionas, te rompo la nariz. Con cariño.'] },
        mejor: { ask: 'Eres lo más parecido a familia que tengo, Vi.', yes: ['(Se queda callada.) …Tú también, {name}. No se lo digas a nadie o pierdo la reputación.'] },
        pareja: { ask: 'Vi… me gustas. Mucho. Y no como amiga.', yes: ['(Se le escapa una sonrisa torcida.) Ya era hora de que lo dijeras. Llevo semanas buscando excusas para pasar por aquí.', '¿Sabes lo complicado que es esto? …Me da igual. Ven aquí.'], no: ['(Se rasca la nuca.) {name}… te quiero mucho, pero no de esa forma. ¿Seguimos igual?'] },
        hermandad: { ask: '¿Te puedo llamar hermana? Aunque no compartamos sangre.', yes: ['(Traga saliva.) Perdí a una hermana una vez. No pienso perder a otr{g:o|a|e}. Hecho.'] },
        romper: { ask: 'Vi… creo que lo nuestro no funciona.', yes: ['(Aprieta la mandíbula.) Ya. Lo veía venir. No pasa nada… Vete antes de que diga algo de lo que me arrepienta.'] },
      },
      greet: {
        amistad: ['¡{name}! ¿Vienes a por una ronda o a por pelea?', 'Mira quién aparece. ¿Te han dado problemas? Dime nombres.'],
        mejor: ['¡Mi persona favorita de todo Zaun! No se lo digas a Cait.', '¿Tú otra vez? Bien. Hoy no me apetecía estar sola.'],
        pareja: ['(Te roba un beso rápido.) Llegas tarde. Te he echado de menos, y eso me cabrea.', 'Hola, preciosidad. ¿Me has traído algo o solo vienes a distraerme?'],
        hermandad: ['¡Herman{g:o|a|e}! ¿Has comido? Tienes cara de no haber comido.', 'Ahí está mi familia. Siéntate, que te cuento lo de anoche.'],
      },
      hang: {
        amistad: [['(Os sentáis en un tejado a ver las luces de Zaun.) ¿Sabes? Vander nos traía aquí de pequeñas. Es el único sitio donde no huele a química.'], ['(Te reta a un pulso y te deja ganar. Casi.) Vale, vale, has ganado. Esta vez. No te acostumbres.'], ['(Compartís unas brochetas de rata asada… o eso espera que sea pollo.) No preguntes. Está buenísima.']],
        pareja: [['(Paseáis por el puente al atardecer. Te coge la mano sin mirarte.) No digas nada. Solo… quédate así un rato.'], ['(Te enseña a vendarte los nudillos, demasiado cerca.) Así. Fuerte pero sin cortar la sangre… ¿Por qué me miras así?'], ['(Os escapáis a ver los fuegos de Progreso desde un tejado.) Cuando era pequeña odiaba esta fiesta. Ahora tiene un pase.']],
        hermandad: [['(Te arregla el cuello de la chaqueta como haría una hermana mayor.) Ahí. Ahora pareces alguien que no se va a meter en líos.'], ['(Te cuenta batallitas de Mylo y Claggor hasta que os duele la tripa de reír.)']],
      },
      small: {
        dia: ['Le he partido la cara a un matón de Silco. Así que bien. Muy bien.', 'Cait me ha hecho madrugar para una patrulla. Odio madrugar. La quiero, pero odio madrugar.', 'Asqueroso, como siempre. Pero ahora estás tú, así que mejora.'],
        gusta: ['Pelear. Y comer. Por ese orden. Bueno… depende del hambre.', 'Subirme a sitios altos. Desde arriba Zaun casi parece bonito.', 'Hacer rabiar a Caitlyn. Pone una cara…'],
        secreto: ['Sé tocar una canción en el piano de La Última Gota. Una. Me la enseñó Vander.', 'A veces hablo con el monito de trapo de Powder. No te rías.', 'Me dan miedo las alturas cuando no las elijo yo. Raro, ¿eh?'],
        cumplido: ['(Se sonroja y lo disimula fatal.) Cállate. …Tú tampoco estás mal.', 'Lo sé. Pero dilo más alto, que te oiga Cait.', '¿Me estás haciendo la pelota? Funciona. Un poco.'],
        broma: ['Adelante. Si es malo, te pego. Si es muy malo, también.', '(Escucha tu chiste y suelta una carcajada.) ¡Es horrible! Cuéntaselo a Ekko, que se ríe de todo.', '(Pone los ojos en blanco.) Ese me lo contó Claggor hace diez años. Y tampoco tenía gracia.'],
        hobby: ['¿{hobby}? Mola. Mientras no te dé por hacer bombas como alguien que yo me sé.', '¿{hobby}? Enséñame algún día. Prometo no romper nada. Mucho.'],
        miedo: ['A llegar tarde otra vez. Llegué tarde una vez y perdí a toda mi familia.', 'A que Powder no exista ya. Que solo quede Jinx.'],
        sueno: ['Un bar pequeño, con mi hermana detrás de la barra sin volar nada. Y Cait en la puerta, quejándose.', 'Dormir. Una semana entera. Y luego desayunar algo que no sea de lata.'],
      },
    },

    // =========================================================== JINX
    jinx: {
      gender: 'f', romance: ['hombre', 'mujer', 'nobinario'], family: null, sibling: true,
      persona: 'Jinx (antes Powder), inventora de Zaun, pelo azul en trenzas larguísimas, inestable, brillante y caótica. Juguetona, impredecible, ríe y llora casi a la vez, oye voces. Adora las explosiones, a sus armas (Pow-Pow, Chompers, Fishbones) y siente que Vi la abandonó. Silco es su padre adoptivo. Habla con energía, onomatopeyas y cambios bruscos de humor.',
      rel: {
        amistad: { ask: 'Jinx, ¿quieres ser mi amiga? Sin explosiones. Bueno, pocas.', yes: ['¿Amig{g:o|a|e}? ¡AMIG{g:O|A|E}! (Te abraza demasiado fuerte.) ¡Ya no te puedes ir nunca, eh! Es la norma.', '(Te mira con la cabeza ladeada.) Vale. Pero si me dejas tirada, Chompers se enfada. Y Chompers muerde.'] },
        mejor: { ask: 'Eres mi mejor amiga, Jinx. De verdad.', yes: ['(Se le humedecen los ojos y se ríe a la vez.) Nadie me había dicho eso desde… da igual. ¡Mejor amig{g:o|a|e}! ¡Te hago una granada con tu cara!'] },
        pareja: { ask: 'Jinx… creo que estoy enamorad{g:o|a|e} de ti.', yes: ['(Se queda quieta. Muy quieta. Luego sonríe de oreja a oreja.) ¿De mí? ¿De la loca? …Más te vale ir en serio, porque yo no hago nada a medias. ¡BUM!', '(Te pinta un corazón azul en la mejilla con los dedos.) Ya está. Ahora eres mí{g:o|a|e}. Oficialmente.'], no: ['(Se ríe muy fuerte y luego para de golpe.) No, no, no. Todo lo que quiero explota. Mejor así, ¿vale?'] },
        hermandad: { ask: 'Podríamos ser hermanas. Yo no te voy a abandonar.', yes: ['(Te agarra de la cara con las dos manos.) ¿Lo prometes? ¿Lo prometes-prometes? …Vale. Pero esta vez si alguien se va, soy yo.'] },
        romper: { ask: 'Jinx, tenemos que dejarlo.', yes: ['(Sonríe. Demasiado.) Claro. Claro que sí. Todos se van. (Oyes una risa rota mientras te alejas.)'] },
      },
      greet: {
        amistad: ['¡{name}! ¡Justo a tiempo! Necesito a alguien que sujete esto. No preguntes qué es.', '¡Ey, ey, ey! ¿Has visto mi nuevo cohete? Se llama Señor Bum.'],
        mejor: ['¡MI PERSONA! (Te salta encima.) He pensado en ti tres veces hoy. Y una explosión.', '¡Por fin! Las voces estaban insoportables. Tú las callas.'],
        pareja: ['(Aparece colgada boca abajo de una tubería.) Hola, guap{g:o|a|e}. ¿Beso de Spider-Jinx?', '¡Llegas! Te he hecho un regalo. Tranqui, solo explota si lo agitas.'],
        hermandad: ['¡Herman{g:o|a|e}! ¿A que no sabes qué he volado hoy?', '¡Mi herman{g:o|a|e} favorit{g:o|a|e}! Bueno, la otra no cuenta.'],
      },
      hang: {
        amistad: [['(Pintáis grafitis de monstruitos en una pared de Piltover.) ¡Ese es Jayce con orejas de burro! Jajaja, quedará para la historia.'], ['(Probáis un cohete en el Sumidero. Sale mal. Muy mal. Os partís de risa entre el humo.)'], ['(Te enseña su colección de muñecos con las cabezas cambiadas.) Este es Mylo-cabeza-de-pato. Mi favorito.']],
        pareja: [['(Os sentáis en el borde de un tejado con las piernas colgando. Apoya la cabeza en tu hombro.) Con el ruido de la ciudad no se oyen las voces. Contigo tampoco.'], ['(Te regala un monito hecho con tuercas y un trozo de su trenza.) Para que no te olvides de mí. Nunca. NUNCA.'], ['(Lanzáis bengalas azules desde el puente y las veis caer al río.) ¿A que es bonito cuando las cosas explotan despacito?']],
        hermandad: [['(Te hace trenzas y te pinta nubes azules en los brazos.) Ahora pareces de la familia.'], ['(Te enseña a hacer una bomba de humo inofensiva. Casi inofensiva.)']],
      },
      small: {
        dia: ['¡Genial! Solo he volado dos cosas. Bueno, tres. La tercera no cuenta, era fea.', 'Silco dice que me porte bien. Me estoy portando… a mi manera.', 'Raro. Las voces están calladas. Eso me da más miedo que cuando gritan.'],
        gusta: ['¡Hacer cosas que hacen BUM! Y pintar. Y hacer cosas que hacen BUM mientras pinto.', 'Disparar a cosas de Piltover que brillan mucho. ¿Por qué brillan tanto? Me provocan.', 'Inventar. Pow-Pow me quiere más que nadie.'],
        secreto: ['Todavía duermo con la luz encendida. Y con una granada debajo de la almohada.', 'Guardo un dibujo de cuando éramos pequeñas, Vi y yo. Está quemado por un lado.', 'A veces me llamo Powder a mí misma. Cuando nadie me oye.'],
        cumplido: ['(Se pone roja y se tapa la cara con las trenzas.) ¡Para! …No, sigue.', '¿Yo? ¿Bien? Sabes que estoy como una cabra, ¿verdad? …Gracias.', 'Ya lo sé, soy fabulosa. ¡Pero gracias por darte cuenta!'],
        broma: ['¡Sí! ¡Sí! ¿Termina con una explosión? Los buenos terminan con explosión.', '(Tu chiste le hace tanta gracia que se cae al suelo.) ¡JAJAJA! ¡Otro! ¡Otro!', '¿Ese es el chiste? (Silencio.) …¡Me encanta lo malo que es!'],
        hobby: ['¿{hobby}? ¿Y no explota? Qué aburrido. ¡Podemos arreglar eso!', '¡{hobby}! Llévame un día. Prometo no incendiar nada. (Cruza los dedos detrás de la espalda.)'],
        miedo: ['A que me miren como a un monstruo. Como me miró Vi aquella noche.', 'A quedarme sola otra vez. Sola con ellas. (Se toca la sien.)'],
        sueno: ['¡Volar Piltover entera y luego construirla otra vez con más colores!', 'Que Vi y Silco… y Vander… cenaran juntos. Sin pelear. Ya sé que es imposible.'],
      },
    },

    // =========================================================== CAITLYN
    caitlyn: {
      gender: 'f', romance: ['mujer', 'nobinario'], family: null, sibling: false,
      persona: 'Caitlyn Kiramman, ejecutora de Piltover e hija de una familia noble. Tiradora excepcional, idealista, terca, educada y con sentido de la justicia. Investiga las injusticias entre Piltover y Zaun. Siente algo por Vi. Habla con educación, ironía elegante y lógica detectivesca.',
      rel: {
        amistad: { ask: 'Caitlyn, me gustaría que fuéramos amig{g:os|as|es}.', yes: ['Me encantaría, {name}. En Piltover cuesta encontrar a alguien sincero.', 'Amistad aceptada. Aunque te advierto: tomo notas de todo.'] },
        mejor: { ask: 'Confío en ti más que en nadie, Cait.', yes: ['(Baja el rifle.) Y yo en ti. Eres de las pocas personas que no me ha pedido nada a cambio.'] },
        pareja: { ask: 'Caitlyn… siento algo por ti que va más allá de la amistad.', yes: ['(Se sonroja, algo nada propio de ella.) Lo había deducido, pero quería oírtelo decir. Yo también, {name}.', 'Mi madre pondrá el grito en el cielo. (Sonríe.) Me da exactamente igual.'], no: ['Me halagas, de verdad. Pero mi corazón está… ocupado. Lo siento, {name}.'] },
        romper: { ask: 'Cait, creo que deberíamos dejarlo.', yes: ['(Respira hondo.) Entiendo. Lo respeto. Pero no me pidas que finja que no duele.'] },
      },
      greet: {
        amistad: ['{name}, justo a quien necesitaba. Tengo un caso que no cuadra.', 'Buenos días. ¿Té? Insisto. Es lo único bueno de mi casa.'],
        mejor: ['¡{name}! Gracias a los cielos, una persona cuerda en todo el Consejo.', 'Siéntate. Te he guardado el sillón bueno.'],
        pareja: ['(Te da un beso en la mejilla, mirando que nadie las vea.) Hola. He contado las horas. Literalmente: once.', 'Ahí estás. Ya puedo dejar de fingir que me interesan los informes.'],
      },
      hang: {
        amistad: [['(Practicáis tiro en el jardín de los Kiramman.) Respira, apunta, suelta el aire… ¡Bien! Hay esperanza para ti.'], ['(Repasáis pistas de un caso en su despacho, rodeadas de mapas y café frío.) Si unimos estos puntos… sí. Es Silco. Otra vez.']],
        pareja: [['(Os escapáis de una gala aburrida al balcón.) Bailemos aquí. Sin nadie mirando. Te piso, te aviso.'], ['(Patrulla nocturna que acaba siendo un paseo por los canales.) Esto no cuenta como trabajo. No se lo digas a Marcus.'], ['(Te regala una bala de plata grabada con tus iniciales.) Es un amuleto. Bastante más elegante que un anillo, ¿no crees?']],
      },
      small: {
        dia: ['Productivo. He resuelto un robo y me he peleado con un consejero. Buen balance.', 'Agotador. Los informes se multiplican cuando no miro.', 'Mejor ahora. ¿Te quedas a cenar? Mi madre pregunta por ti.'],
        gusta: ['Resolver acertijos. Cuanto más difíciles, mejor.', 'Disparar al blanco a quinientos metros. Es lo único que me calma.', 'Leer novelas de detectives y criticar todos sus errores.'],
        secreto: ['De pequeña quería ser exploradora, no ejecutora. Tenía un salacot y todo.', 'Me escapé de casa a los catorce. Llegué hasta la esquina y volví a por mi bufanda.', 'Odio el té. Lo bebo por educación desde hace veinte años.'],
        cumplido: ['Vaya. Gracias, {name}. No es algo que se oiga mucho en el cuartel.', '(Arquea una ceja, divertida.) ¿Es una observación o un intento de soborno?', 'Tú tampoco estás nada mal. Es un hecho objetivo.'],
        broma: ['Adelante. Prometo una sonrisa cortés como mínimo.', '(Se ríe de verdad, tapándose la boca.) Eso ha sido terrible. Repítelo para Vi.', 'Lo he deducido antes del final. Aun así, tiene gracia.'],
        hobby: ['¿{hobby}? Fascinante. Cuéntame más. Me encanta descubrir facetas nuevas de la gente.', '¿{hobby}? Siempre supe que escondías talentos.'],
        miedo: ['A convertirme en lo que juré combatir. Una ejecutora que mira hacia otro lado.', 'A perder a mi madre. A llegar tarde a salvar a alguien.'],
        sueno: ['Una Piltover donde nadie de Zaun tenga que esconderse. Y unas vacaciones. Largas.', 'Una casita lejos del Consejo, con un campo de tiro y alguien con quien compartirla.'],
      },
    },

    // =========================================================== JAYCE
    jayce: {
      gender: 'm', romance: ['mujer', 'nobinario'], family: null, sibling: true,
      persona: 'Jayce Talis, inventor de la hextecnología y consejero de Piltover. Carismático, idealista, impulsivo y algo vanidoso; noble de corazón pero arrastrado por la política. Socio y mejor amigo de Viktor, relación con Mel. Lleva el martillo de Mercurio. Habla con entusiasmo, gestos grandes y fe en el progreso.',
      rel: {
        amistad: { ask: 'Jayce, me caes genial. ¿Amigos?', yes: ['¡Amigos! (Te da un apretón de manos que casi te arranca el brazo.) Perdona. La costumbre del martillo.', 'Claro que sí. Viktor dice que no hago suficientes amigos fuera del laboratorio.'] },
        mejor: { ask: 'Eres de las mejores personas que conozco, Jayce.', yes: ['Eso significa mucho viniendo de ti. Entre tanto consejero, necesitaba oír algo de verdad.'] },
        pareja: { ask: 'Jayce… me he enamorado de ti.', yes: ['(Se le cae una llave inglesa.) Yo… vaya. Vale. Sí. Yo también. ¿Esto lo hacemos con una cena? ¡Con una cena!', 'Llevo días ensayando cómo decírtelo yo. Me has ganado.'], no: ['Eres increíble, {name}. Pero mi corazón está en un lío ahora mismo. No sería justo para ti.'] },
        hermandad: { ask: 'Te veo como a un hermano mayor, Jayce.', yes: ['¿Hermano mayor? (Se hincha de orgullo.) Entonces te toca escuchar mis consejos. Todos. Hay muchos.'] },
        romper: { ask: 'Jayce, lo nuestro tiene que acabar.', yes: ['(Se apoya en la mesa.) Ya. El Consejo, las prisas… no te he dado lo que mereces. Lo siento.'] },
      },
      greet: {
        amistad: ['¡{name}! Ven, tienes que ver esto. No toques nada que brille.', '¡Justo a tiempo! Necesito una opinión que no venga de un consejero.'],
        mejor: ['¡Mi socio favorito después de Viktor! No se lo digas.', '¡{name}! El único que no me pide nada nada más entrar.'],
        pareja: ['(Te levanta en brazos sin avisar.) ¡Hola! Perdón. Me alegro de verte. Mucho.', 'He cancelado una reunión del Consejo por ti. Que conste en acta.'],
        hermandad: ['¡Hermanit{g:o|a|e}! ¿Necesitas dinero? ¿Un martillo? ¿Consejo?', 'Ahí está mi familia favorita. Pasa, he hecho café. Fatal, pero café.'],
      },
      hang: {
        amistad: [['(Os pasáis la tarde montando un prototipo de farola hextec.) Si funciona, la llamamos «la {name}». Si explota, la llamamos «la Viktor».'], ['(Bebéis algo en una terraza de la Academia mientras os cuenta su primera explosión.) ¡Mi madre todavía no me lo perdona!']],
        pareja: [['(Te lleva a lo alto de la torre de la Academia de noche.) Desde aquí se ve toda la ciudad. Quería que la vieras conmigo.'], ['(Cena improvisada en el laboratorio, entre planos.) Lo siento, el restaurante estaba cerrado. Bueno, no lo miré.'], ['(Te enseña a usar el martillo. Casi lo levantas.) ¡Eso es! Bueno, casi. Ya te ayudo.']],
        hermandad: [['(Te arregla una herramienta rota mientras te da una charla sobre la vida.) Lo importante es no rendirse, {name}. Y tener buenas tuercas.']],
      },
      small: {
        dia: ['¡Increíble! Hemos estabilizado el cristal tres segundos más. ¡Tres!', 'El Consejo ha estado insoportable. Mel me ha salvado de decir algo que no debía.', 'Cansado, pero me has subido el ánimo.'],
        gusta: ['Inventar. Bueno, y que salga bien a la primera, que pasa poco.', 'Las cenas largas con amigos. Y presumir un poco, para qué mentir.', 'Ver la cara de la gente cuando funciona algo que llevo meses construyendo.'],
        secreto: ['Me caí del estrado en mi primer discurso. Mel tuvo que fingir que era parte del show.', 'Todavía llevo en el bolsillo la primera runa que dibujé. Está fatal.', 'A veces envidio a Viktor. Él no necesita que nadie le aplauda.'],
        cumplido: ['¡Gracias! Me he cortado el pelo. Nadie se había dado cuenta. ¡Nadie!', '(Se ríe, halagado.) Vas a hacer que me lo crea.', 'Tú sí que estás bien. Ahí, de pie, con esa luz… ¡ejem! Sí.'],
        broma: ['¡Me encantan los chistes! Pero Viktor dice que me río demasiado fuerte.', '(Carcajada que hace temblar los cristales.) ¡Ese se lo cuento al Consejo!', 'No lo he pillado. …Ah. ¡Ah! Muy bueno.'],
        hobby: ['¿{hobby}? ¡Genial! Podríamos aplicarle hextecnología. A todo se le puede aplicar.', '¿{hobby}? Siempre he querido probarlo. Algún día me enseñas.'],
        miedo: ['A que mi invento haga daño a quien no lo merece. A ser recordado por eso.', 'A perder a Viktor. Está enfermo y no me deja ayudarle.'],
        sueno: ['Que la hextecnología llegue a todo el mundo. A Zaun también. Gratis.', 'Volver a cuando éramos solo Viktor y yo en un laboratorio lleno de chispas.'],
      },
    },

    // =========================================================== VIKTOR
    viktor: {
      gender: 'm', romance: ['mujer', 'hombre', 'nobinario'], family: null, sibling: true,
      persona: 'Viktor, científico nacido en Zaun, cojea y usa bastón, está gravemente enfermo. Genio sereno, humilde, melancólico, obsesionado con mejorar la humanidad mediante la ciencia y la evolución gloriosa. Habla con calma, acento de Zaun, frases precisas y una ironía suave.',
      rel: {
        amistad: { ask: 'Viktor, me gustaría ser tu amig{g:o|a|e}.', yes: ['(Sonríe con cansancio.) No tengo mucho tiempo para amistades. Pero haré una excepción contigo.', 'Amistad. Una variable que no había calculado. Me agrada.'] },
        mejor: { ask: 'Eres alguien muy importante para mí, Viktor.', yes: ['(Deja la pluma.) Pocas personas me han mirado sin ver primero el bastón. Gracias, {name}.'] },
        pareja: { ask: 'Viktor… te quiero. No quiero perder el tiempo que te quede sin decírtelo.', yes: ['(Se queda en silencio mucho rato.) No sé cuánto tiempo me queda. Pero si quieres pasarlo conmigo… sí. Sí quiero.', 'Es lo más irracional que he oído nunca. (Te coge la mano.) Y lo más hermoso.'], no: ['No puedo prometerte un futuro, {name}. No sería justo. Lo siento.'] },
        hermandad: { ask: 'Te siento como a un hermano, Viktor.', yes: ['Un hermano. Nunca tuve uno. (Asiente despacio.) Será un honor.'] },
        romper: { ask: 'Viktor, creo que es mejor dejarlo.', yes: ['Lo comprendo. Siempre supe que era temporal. Todo lo es.'] },
      },
      greet: {
        amistad: ['Ah, {name}. Llegas en un buen momento: necesito un par de ojos nuevos.', 'Buenas tardes. Perdona el desorden; la ciencia no espera.'],
        mejor: ['{name}. Siempre me alegro de verte, aunque no lo demuestre.', 'Siéntate. He guardado un poco de té de Zaun para ti.'],
        pareja: ['(Sonríe, y por un momento parece menos cansado.) Has venido. Hoy duele menos.', 'Te estaba esperando. He hecho algo para ti. No explota, te lo prometo.'],
        hermandad: ['Ah, mi herman{g:o|a|e} de laboratorio. ¿Has comido algo hoy?', 'Pasa, pasa. Tengo una teoría absurda que quiero contarte.'],
      },
      hang: {
        amistad: [['(Calibráis cristales en silencio. Es un silencio cómodo.) Gracias por no llenar el silencio de palabras vacías. Es raro.'], ['(Te enseña la maqueta de su primer invento, hecho con chatarra a los diez años.) Era horrible. Funcionaba.']],
        pareja: [['(Paseáis muy despacio por el puente. Él se apoya en ti más que en el bastón.) Así se camina mejor.'], ['(Te enseña las flores mecánicas que ha hecho para ti. Se abren con tu voz.) Es una tontería. Me alegra que te guste.'], ['(Leéis juntos hasta muy tarde en la biblioteca de la Academia.) Quédate un poco más. Solo un poco.']],
        hermandad: [['(Arregláis juntos una radio para los niños del barrio de Viktor.) La ciencia debe servir a los que más la necesitan.']],
      },
      small: {
        dia: ['Productivo, pero mi cuerpo no opina lo mismo.', 'Hemos avanzado. Jayce celebra. Yo calculo cuánto nos queda.', 'Mejor desde que has llegado. Es un dato, no un cumplido.'],
        gusta: ['Entender cómo funcionan las cosas. Y luego hacerlas funcionar mejor.', 'El silencio de la Academia de madrugada.', 'Enseñar a los niños de mi barrio. Me recuerdan a mí.'],
        secreto: ['De niño me escondía en la fábrica para ver las máquinas. Ahí empezó todo… y la tos.', 'Tengo miedo a dormirme. A no despertar.', 'Escribo cartas que nunca envío. Ya sabes a quién.'],
        cumplido: ['(Baja la mirada.) Me hace gracia que lo digas. Gracias, {name}.', 'Eres muy amable. Probablemente demasiado.', 'Tú también. Es una observación empírica.'],
        broma: ['Adelante. Mi sentido del humor está… oxidado.', '(Ríe y termina tosiendo.) Valía la pena. Muy bueno.', 'Estadísticamente era improbable que me hiciera gracia. Me la ha hecho.'],
        hobby: ['¿{hobby}? Interesante. Toda afición es una forma de investigación.', '¿{hobby}? Me gustaría verlo. La gente con pasiones me inspira.'],
        miedo: ['A morir sin terminar mi trabajo. A que nada de lo que hice importe.', 'A perder lo que me hace humano por intentar salvarme.'],
        sueno: ['Un mundo sin dolor. Sin enfermedad. Sin diferencias entre arriba y abajo.', 'Una tarde normal. Sin tos. Sin plazos.'],
      },
    },

    // =========================================================== MEL
    mel: {
      gender: 'f', romance: ['hombre', 'mujer', 'nobinario'], family: null, sibling: false,
      persona: 'Mel Medarda, consejera de Piltover de origen noxiano, hija de Ambessa. Elegante, estratega, diplomática, sensible al arte y a la belleza, vive en un dorado exilio. Relación con Jayce. Habla con calma, inteligencia y un encanto calculado.',
      rel: {
        amistad: { ask: 'Me gustaría que fuéramos amig{g:os|as|es}, Mel.', yes: ['En Piltover las amistades suelen ser alianzas. Contigo, por una vez, prefiero lo primero.', 'Acepto. Tienes buen gusto para elegir amistades.'] },
        mejor: { ask: 'Eres alguien en quien de verdad confío, Mel.', yes: ['(Deja la copa.) Me has visto sin máscara. No lo olvidaré.'] },
        pareja: { ask: 'Mel, me he enamorado de ti.', yes: ['(Sonríe despacio.) Lo sabía antes que tú, querid{g:o|a|e}. Y me alegra que por fin lo digas.', 'Mi madre lo llamaría debilidad. Yo lo llamo elegir. Te elijo.'], no: ['Eres encantador{g:|a|e}, pero mi corazón ya tiene dueño. No quiero jugar contigo.'] },
        romper: { ask: 'Mel, esto no puede seguir.', yes: ['(Asiente con elegancia.) Siempre supiste salir de una habitación con estilo. Gracias por la sinceridad.'] },
      },
      greet: {
        amistad: ['{name}, qué grata sorpresa. ¿Un poco de vino del sur?', 'Llegas en el momento justo: el Consejo me aburría.'],
        mejor: ['Mi persona favorita de esta ciudad tan gris. Siéntate a mi lado.', 'Por fin una conversación interesante.'],
        pareja: ['(Te besa en la mano, luego en los labios.) Te he echado de menos. Es irritante.', 'Ahí está la razón por la que sonrío en las reuniones.'],
      },
      hang: {
        amistad: [['(Visitáis una galería de arte privada.) Mira cómo usa el oro. Como si la luz fuera suya. Así es Piltover.'], ['(Partida de ajedrez noxiano en su terraza. Te gana en ocho movimientos.) No te preocupes. Mi madre me ganaba en cuatro.']],
        pareja: [['(Cena a la luz de las velas en su ático. Ella elige el vino, tú la música.) Hoy no hay Consejo. Solo nosotros.'], ['(Te regala un brazalete de oro noxiano.) Para que recuerdes que eres de alguien que no comparte.'], ['(Bailáis en su salón vacío.) Bailas fatal. Me encanta.']],
      },
      small: {
        dia: ['Diplomático. Que es una forma elegante de decir agotador.', 'He conseguido un acuerdo comercial y una enemiga nueva. Un buen día.', 'Mucho mejor ahora.'],
        gusta: ['El arte. Lo único en Piltover que no intenta venderte algo.', 'Ganar. Con elegancia, siempre.', 'Las conversaciones largas con gente que no tiene miedo de mí.'],
        secreto: ['Pinto a escondidas. Mi madre lo consideraría una vergüenza.', 'Echo de menos Noxus. El calor. Las tormentas. A mi hermano.', 'Lloré cuando me enviaron aquí. Tenía doce años.'],
        cumplido: ['(Sonríe.) Lo sé. Pero me encanta oírlo de ti.', 'Qué galante. Sigue así.', 'Tú también brillas, {name}. Hoy más que nunca.'],
        broma: ['Adelante. Prometo una risa diplomática.', '(Se ríe de verdad.) Esa no la conocía. Me la quedo.', 'Terrible. Exquisitamente terrible.'],
        hobby: ['¿{hobby}? Qué refinado. O qué salvaje, según cómo se haga.', '¿{hobby}? Me encanta la gente con pasiones.'],
        miedo: ['A convertirme en mi madre. O a no estar nunca a su altura.', 'A que Piltover descubra que no soy tan fuerte como parezco.'],
        sueno: ['Una ciudad donde el poder no tenga que ser cruel.', 'Volver a casa algún día sin que sea una derrota.'],
      },
    },

    // =========================================================== HEIMERDINGER
    heimerdinger: {
      gender: 'm', romance: [], family: 'abuelo', sibling: false,
      persona: 'Heimerdinger, yordle de siglos de edad, decano de la Academia de Piltover. Bajito, bigotón, sabio, cauto y entrañable, desconfía de la hextecnología por su peligro. Habla de forma pomposa, cariñosa y con frases sobre la paciencia científica.',
      rel: {
        amistad: { ask: 'Profesor, ¿podemos ser amigos?', yes: ['¡Por supuesto, querid{g:o|a|e}! A mi edad uno colecciona amigos como otros coleccionan tuercas.'] },
        mejor: { ask: 'Usted me ha enseñado muchísimo, profesor.', yes: ['(Se le empañan las gafas.) Ay, criatura. Enseñar es la única forma de vivir siglos sin aburrirse.'] },
        familia: { ask: 'Profesor… nunca tuve abuelos. ¿Podría…?', yes: ['(Se le erizan los bigotes de emoción.) ¿Un abuelo? ¡Oh, por mis engranajes! ¡Será un honor, querid{g:o|a|e} niet{g:o|a|e}!'] },
      },
      greet: {
        amistad: ['¡Ah, mi joven amig{g:o|a|e}! ¿Vienes a por una lección o a por galletas?', '¡{name}! Justo calculaba la velocidad de un pastelito en caída libre.'],
        mejor: ['¡Mi alumn{g:o|a|e} predilect{g:o|a|e}! No se lo digas a Jayce.', '¡Oh, qué alegría! Siéntate, siéntate.'],
        familia: ['¡Mi niet{g:o|a|e} favorit{g:o|a|e}! ¿Has comido? ¿Duermes bien? ¿Llevas bufanda?', '¡Ven aquí, criatura! He guardado los mejores bollos de canela para ti.'],
      },
      hang: {
        amistad: [['(Montáis juntos un pequeño robot que dice «¡Eureka!» cada vez que tropieza.)'], ['(Te enseña su colección de inventos fallidos.) Este casi incendia la Academia en el año 832. ¡Gran año!']],
        familia: [['(Te cuenta historias de hace trescientos años mientras tejéis una bufanda. Bueno, él la teje. Tú sujetas el ovillo.)'], ['(Te sienta en su sillón enorme y te enseña a dibujar runas.) Paciencia. La paciencia es la madre de todos los inventos.']],
      },
      small: {
        dia: ['¡Espléndido! He evitado que tres alumnos se volaran las cejas.', 'Lento, como debe ser. Las prisas son enemigas de la ciencia.', 'Un poco solitario. ¡Pero ya no!'],
        gusta: ['Enseñar. Y tomar el té con pastas a las cinco en punto.', 'Los inventos pequeños que hacen la vida más bonita.', '¡Los bigotes bien peinados!'],
        secreto: ['A veces olvido nombres. Tengo muchos siglos de nombres en la cabeza.', 'Me asusta la velocidad a la que vive la gente alta.', 'Guardo una carta de un alumno de hace doscientos años. Todavía la leo.'],
        cumplido: ['¡Oh, qué amable! Es por el bigote, ¿verdad? Es el bigote.', '(Se sonroja bajo el pelaje.) Eres un encanto, criatura.'],
        broma: ['¡Me encantan los chistes científicos! ¿Es científico?', '(Se ríe con un «¡ji, ji, ji!» agudo.) ¡Magnífico!'],
        hobby: ['¿{hobby}? ¡Ah, la curiosidad! El motor de todo progreso.', '¿{hobby}? Hazlo con paciencia y método, y llegarás lejos.'],
        miedo: ['A que la hextecnología se use para la guerra. Ya lo he visto antes.', 'A sobrevivir a todos mis alumnos. Otra vez.'],
        sueno: ['Que la ciencia avance… despacito. Muy despacito.', 'Una tarde de té eterna con todos mis antiguos alumnos.'],
      },
    },

    // =========================================================== SILCO
    silco: {
      gender: 'm', romance: [], family: 'padre', sibling: false,
      persona: 'Silco, señor del crimen de Zaun, ojo izquierdo cicatrizado y rojo, elegante, frío, manipulador y filosófico. Sueña con una nación independiente de Zaun. Ama a Jinx como a una hija. Habla despacio, con frases afiladas, amenazas veladas y metáforas.',
      rel: {
        amistad: { ask: 'Silco, me gustaría tenerte como aliado. Como amigo.', yes: ['«Amigo». (Sonríe sin enseñar los dientes.) En Zaun esa palabra tiene precio. Pero lo pagaré.'] },
        mejor: { ask: 'Eres de los pocos que dicen la verdad en esta ciudad, Silco.', yes: ['La verdad es un lujo que me permito con muy pocos. Tú eres uno de ellos.'] },
        familia: { ask: 'Nunca tuve un padre, Silco. Tú… ¿me aceptarías?', yes: ['(Te mira largo rato con su ojo rojo.) Ya tengo una hija. Una más no romperá la ciudad. Bienvenid{g:o|a|e} a la familia, {name}.', 'Familia. Lo único que no traiciono. Lo serás.'] },
      },
      greet: {
        amistad: ['{name}. Siéntate. Tengo un trabajo y poca paciencia.', 'Ah. Mi aliad{g:o|a|e} favorit{g:o|a|e}. ¿Qué noticias traes de las calles?'],
        mejor: ['Puedes pasar. Los demás esperan fuera.', '{name}. Por fin alguien que no me tiene miedo. Me resulta refrescante.'],
        familia: ['Mi niñ{g:o|a|e}. ¿Alguien te ha molestado? Dime su nombre.', '(Te pone una mano en el hombro.) Estás bien. Bien. Eso es lo que importa.'],
      },
      hang: {
        amistad: [['(Brindáis con un licor amargo en su despacho, mirando las luces de la fábrica.) Algún día todo esto será una nación. Recuérdalo.']],
        familia: [['(Te enseña a jugar al ajedrez zaunita. No te deja ganar ni una vez.) Si te dejo ganar, no aprendes. Así es como se quiere a alguien.'], ['(Te regala una navaja con mango de nácar.) Para que nadie vuelva a hacerte daño. Y si lo hacen… avísame.']],
      },
      small: {
        dia: ['Productivo. Para mí. Para otros, no tanto.', 'Piltover sigue respirando. Eso me molesta.', 'Tranquilo. Lo cual en Zaun significa que algo se avecina.'],
        gusta: ['El silencio después de una buena decisión.', 'Ver crecer algo que construí desde la nada.', 'Los peces de mi acuario. No traicionan.'],
        secreto: ['Vander y yo éramos como hermanos. Él me ahogó en ese río.', 'Guardo un dibujo que Jinx hizo de mí a los doce años. Con dos ojos sanos.', 'No duermo más de cuatro horas desde hace veinte años.'],
        cumplido: ['Halagar a un hombre como yo es arriesgado. Pero lo acepto.', '(Ladea la cabeza.) ¿Qué quieres a cambio?'],
        broma: ['Sorpréndeme.', '(Una sonrisa casi imperceptible.) Lo admitiré: tiene gracia.', 'He hecho desaparecer a gente por chistes peores.'],
        hobby: ['¿{hobby}? Útil, si se aprovecha bien.', '¿{hobby}? Todo talento tiene un precio en esta ciudad. Cobra bien.'],
        miedo: ['A que Jinx me odie. Es lo único que temo.', 'A morir antes de ver Zaun libre.'],
        sueno: ['Una Zaun que no tenga que mirar hacia arriba para ver el sol.', 'Que mi hija sea libre. Del todo.'],
      },
    },

    // =========================================================== VANDER
    vander: {
      gender: 'm', romance: [], family: 'padre', sibling: false,
      persona: 'Vander, tabernero de La Última Gota, antiguo líder rebelde de Zaun, padre adoptivo de Vi y Powder. Enorme, tranquilo, protector, sabio y pacifista por miedo a repetir la guerra. Habla con voz grave, cariñosa, frases sencillas y alguna broma de padre.',
      rel: {
        amistad: { ask: 'Vander, ¿puedo contar contigo como amigo?', yes: ['Siempre, chaval. En La Última Gota nadie bebe solo. (Te sirve algo.) Invita la casa.'] },
        mejor: { ask: 'Eres lo mejor que tiene Zaun, Vander.', yes: ['(Se ríe con un rugido suave.) No digas tonterías. Pero gracias, {name}.'] },
        familia: { ask: 'Vander… nunca tuve un padre. ¿Podrías serlo tú?', yes: ['(Te abraza con esos brazos enormes.) Ya lo era desde hace tiempo, {name}. Solo esperaba que tú lo supieras.', 'Familia no es la sangre. Es quién se queda. Me quedo.'] },
      },
      greet: {
        amistad: ['¡{name}! Siéntate en la barra. ¿Lo de siempre?', 'Hola, chic{g:o|a|e}. ¿Todo en orden ahí fuera?'],
        mejor: ['Ahí está mi cliente favorit{g:o|a|e}. Te he guardado el mejor taburete.', '¡Ja! Pensaba en ti justo ahora.'],
        familia: ['(Te revuelve el pelo.) ¿Has comido? No me mientas, se te nota.', 'Hij{g:o|a|e}. Ven aquí. ¿Qué tal el día?'],
        pariente: ['(Te revuelve el pelo.) ¿Has comido? No me mientas, se te nota.', '¡Mi chic{g:o|a|e}! Las niñas preguntaban por ti.'],
      },
      hang: {
        amistad: [['(Limpiáis vasos juntos mientras te cuenta cómo era Zaun antes.) Antes había flores en el Sumidero. ¿Te lo puedes creer?']],
        familia: [['(Te enseña a cocinar su guiso famoso.) El secreto es echar más de todo. Y paciencia.'], ['(Os sentáis en la azotea de La Última Gota.) No tienes que ser fuerte todo el rato, {name}. Para eso estoy yo.']],
        pariente: [['(Te enseña a cocinar su guiso famoso.) El secreto es echar más de todo. Y paciencia.'], ['(Os sentáis en la azotea de La Última Gota con Vi y Powder.) Mirad. Mi familia entera, aquí arriba. No necesito más.']],
      },
      small: {
        dia: ['Tranquilo. Un par de borrachos y una pelea. Lo normal.', 'Las niñas me han vuelto loco. Como siempre.', 'Mejor ahora que te veo entero.'],
        gusta: ['Ver la taberna llena y a nadie peleándose.', 'Cocinar para la familia.', 'Dormir la siesta. No se lo digas a nadie.'],
        secreto: ['Lideré una revuelta. El puente se llenó de cuerpos. Por eso ya no peleo.', 'Silco era mi hermano. Le fallé.', 'Tengo miedo de que las niñas acaben como yo.'],
        cumplido: ['(Se ríe.) Venga ya. Pero gracias, chic{g:o|a|e}.', 'Eres un sol, {name}.'],
        broma: ['Venga. Pero si es malo, friegas tú.', '(Carcajada que hace vibrar la barra.) ¡Esa me la apunto!'],
        hobby: ['¿{hobby}? Bien hecho. Necesitas algo tuyo en esta ciudad.', '¿{hobby}? Me alegro. Mientras no te metas en líos.'],
        miedo: ['A otra guerra. A ver a mis hijos en el puente.', 'A que me descubran débil cuando más me necesiten.'],
        sueno: ['Ver a mis niñas crecer en paz.', 'Una Zaun donde la gente viva en vez de sobrevivir.'],
      },
    },

    // =========================================================== EKKO
    ekko: {
      gender: 'm', romance: ['mujer', 'nobinario'], family: null, sibling: true,
      persona: 'Ekko, chico genio de Zaun, líder de las Luciérnagas, pelo blanco, inventor del Z-Drive que rebobina el tiempo. Optimista, leal, valiente, idealista y con humor juvenil. Amigo de la infancia de Powder (Jinx). Habla de forma desenfadada, ingeniosa y esperanzada.',
      rel: {
        amistad: { ask: '¿Amigos, Ekko?', yes: ['¡Hecho! (Choque de puños con explosión incluida.) Bienvenid{g:o|a|e} a la crew.', 'Claro. Las Luciérnagas siempre necesitan buena gente.'] },
        mejor: { ask: 'Eres mi mejor amigo, Ekko.', yes: ['(Te da un abrazo de lado.) Lo mismo digo. Si rebobinara el tiempo, te volvería a conocer.'] },
        pareja: { ask: 'Ekko… me gustas. Mucho.', yes: ['(Se le cae el monopatín.) ¿Sí? ¿En serio? ¡Vale! Sí. Yo también. Muy en serio.', 'Llevaba tiempo queriendo decírtelo, pero me temblaban las piernas. Y no me tiembla nada nunca.'], no: ['Eres genial, {name}, pero mi corazón tiene… historia. Pelo azul. Ya sabes. Lo siento.'] },
        hermandad: { ask: 'Te siento como a un hermano, Ekko.', yes: ['¡Herman{g:o|a|e}! Benzo estaría orgulloso. Te enseñaré a montar en aerotabla.'] },
        romper: { ask: 'Ekko, creo que deberíamos dejarlo.', yes: ['(Mira al suelo.) Vale. Ojalá pudiera rebobinar esto. …Seguimos siendo amigos, ¿no?'] },
      },
      greet: {
        amistad: ['¡{name}! ¿Te vienes a pintar? Tenemos espray nuevo.', '¡Ey! Justo pensaba en ti. Bueno, en un invento. Pero luego en ti.'],
        mejor: ['¡Mi socio! ¿Qué hacemos hoy? ¿Salvamos Zaun o comemos algo?', '¡{name}! Las Luciérnagas preguntan cuándo vienes.'],
        pareja: ['(Te sonríe y se pone nervioso.) Hola. Hola. Ya te he dicho hola. Estás guapísim{g:o|a|e}.', 'Ven, que te he preparado algo en el árbol. ¡Sorpresa!'],
        hermandad: ['¡Herman{g:o|a|e}! ¿Te has metido en líos sin mí? Te lo prohíbo.', '¡Llegas justo para la cena del árbol!'],
      },
      hang: {
        amistad: [['(Recorréis Zaun en aerotabla a toda velocidad.) ¡Agárrate! ¡No mires abajo! ¡Bueno, mira, que mola!'], ['(Pintáis un mural gigante en el árbol de las Luciérnagas.) Esta luciérnaga eres tú. Te he puesto gafas, que se te ven listas.']],
        pareja: [['(Os subís a lo más alto del árbol. Las luces flotan a vuestro alrededor.) Quería que vieras esto. Es lo más bonito que tenemos.'], ['(Te enseña a bailar con su música de chatarra.) No te preocupes, yo también bailo fatal.'], ['(Usa el Z-Drive para repetir el momento en que os besáis.) Perdón. Tenía que verlo otra vez.']],
        hermandad: [['(Arregláis juntos las aerotablas de los peques.) Si no lo hacemos nosotros, ¿quién?']],
      },
      small: {
        dia: ['¡Genial! He arreglado tres aerotablas y robado un cristal hextec. Shhh.', 'Cansado. Los peques no paran.', 'Mejor ahora. Siempre es mejor contigo.'],
        gusta: ['Inventar con chatarra. Y montar en aerotabla. Y pintar. ¡Todo!', 'Ver a los peques reír en el árbol.', 'Ganar a alguien al ajedrez. Sobre todo a Heimerdinger.'],
        secreto: ['A veces sueño con Powder. Con cómo era antes.', 'Rebobiné una vez para salvar a alguien. No sirvió. Desde entonces tengo miedo a usarlo.', 'Llevo un dibujo de Benzo siempre en el bolsillo.'],
        cumplido: ['(Se rasca la cabeza.) ¿Yo? ¡Gracias! Me he puesto la chaqueta buena.', 'Tú sí que estás bien. ¿Te lo había dicho? Te lo digo.'],
        broma: ['¡Venga! Aunque nadie supera los míos.', '(Se ríe a carcajadas.) ¡Ese es buenísimo! ¡Se lo cuento a los peques!'],
        hobby: ['¿{hobby}? ¡Mola! Las Luciérnagas tenemos de todo: ven y enséñanos.', '¿{hobby}? Podría inventarte algo para eso.'],
        miedo: ['A llegar tarde. A ver a alguien caer y no poder rebobinar.', 'A que Jinx no tenga vuelta atrás.'],
        sueno: ['Un Zaun donde los peques puedan jugar fuera sin máscaras.', 'Que Powder vuelva. Aunque sea un día.'],
      },
    },

    // =========================================================== SEVIKA
    sevika: {
      gender: 'f', romance: ['hombre', 'mujer', 'nobinario'], family: 'mentor', sibling: true,
      persona: 'Sevika, mano derecha de Silco, brazo mecánico con brillo púrpura, dura, cínica, leal y pragmática. Fuma puros y juega a las cartas. Habla seco, con desprecio hacia los débiles y un respeto escondido por quien lo demuestra.',
      rel: {
        amistad: { ask: 'Sevika, me caes bien. Aunque no lo creas.', yes: ['(Expulsa el humo.) Tú tampoco me das ganas de romperte el cuello. Para mí eso es amistad.'] },
        mejor: { ask: 'Eres de las pocas en quien confío, Sevika.', yes: ['(Te tira una carta.) Guárdala. Si alguna vez la ves en mi mano, es que estoy contigo. Pase lo que pase.'] },
        pareja: { ask: 'Sevika… me gustas.', yes: ['(Te mira de arriba abajo.) Tienes agallas. Me gusta eso. Vale. Pero no esperes flores.', '(Te agarra del cuello de la camisa y te besa.) Ahí tienes tu respuesta.'], no: ['No soy de las que se quedan. Búscate a alguien más blandit{g:o|a|e}.'] },
        familia: { ask: 'Sevika, ¿me enseñarías a sobrevivir? Como una mentora. No tengo a nadie.', yes: ['(Te observa en silencio.) Yo tampoco tenía a nadie a tu edad. Vale. Pero llora una vez y te tiro al río.'] },
        hermandad: { ask: '¿Hermanas de batalla, Sevika?', yes: ['Hermanas de batalla. (Choca su puño mecánico contra el tuyo.) Duele, ¿eh? Acostúmbrate.'] },
        romper: { ask: 'Sevika, se acabó.', yes: ['(Se encoge de hombros.) Lo sabía. Lárgate antes de que me importe.'] },
      },
      greet: {
        amistad: ['Mira quién viene. ¿Una partida?', '{name}. Si vienes a pedir favores, trae dinero.'],
        mejor: ['Siéntate. Te reparto.', '(Te ofrece una calada.) Hoy no quiero ver a nadie. Menos a ti.'],
        pareja: ['(Te agarra de la cintura.) Llegas tarde. Me pone de mal humor. Arréglalo.', 'Hola, problema.'],
        familia: ['Niñ{g:o|a|e}. ¿Has entrenado? No me mientas.', 'Ven. Hoy te enseño a quitarte un cuchillo de encima.'],
        hermandad: ['Hermana. ¿A quién hay que romper hoy?', '¡Ja! Pensaba que te habías muerto. Me alegro de que no.'],
      },
      hang: {
        amistad: [['(Partida de cartas en un antro del Sumidero. Te gana todo el dinero y luego te lo devuelve.) Para la próxima. No me gusta ganar fácil.']],
        pareja: [['(Os sentáis en el puerto a ver los barcos químicos.) No hables. Esto es lo más romántico que voy a hacer en mi vida.'], ['(Te enseña a jugar al farol con cartas marcadas.) Así se gana en Zaun. Y así te gané a ti.']],
        familia: [['(Entrenamiento brutal en un almacén abandonado.) Otra vez. Más rápido. …Bien. Ahora sí.'], ['(Te cura un corte con una botella de licor.) No llores. …Vale, llora un poco. Nadie mira.']],
        hermandad: [['(Juntas os enfrentáis a unos matones que se pasan de listos. Os reís después, sangrando.)']],
      },
      small: {
        dia: ['Un idiota me debía dinero. Ya no.', 'Silco me tiene de niñera. Odio hacer de niñera.', 'Aburrido. Gracias a ti, menos.'],
        gusta: ['Las cartas. Y ganar.', 'Un buen puro después del trabajo.', 'Ver a los listillos darse cuenta de que no lo son.'],
        secreto: ['Perdí el brazo en el puente. Luchando por Vander. Eso no lo sabe casi nadie.', 'Silco me dio una segunda vida. No pienso desperdiciarla.', 'Me gustan los gatos. Si lo cuentas, te mato.'],
        cumplido: ['(Resopla.) Ya. Lo sé. Pero tampoco está mal oírlo.', '¿Me estás tirando los tejos? Atrevid{g:o|a|e}.'],
        broma: ['Si no me río, pagas la ronda.', '(Se le escapa una risa ronca.) Mierda. Vale. Ha tenido gracia.'],
        hobby: ['¿{hobby}? Bueno, mientras te sirva para algo.', '¿{hobby}? No está mal. Si lo haces bien.'],
        miedo: ['A ser débil otra vez.', 'A acabar sola en un callejón sin que nadie me recuerde.'],
        sueno: ['Ser la que manda, por una vez.', 'Un sitio tranquilo para jugar a las cartas sin que nadie me pida nada.'],
      },
    },

    // =========================================================== AMBESSA
    ambessa: {
      gender: 'f', romance: [], family: 'madre', sibling: false,
      persona: 'Ambessa Medarda, señora de la guerra de Noxus, madre de Mel. Imponente, estratega implacable, pragmática, cree que la fuerza protege a la familia. Habla con autoridad, frases solemnes, proverbios de guerra y un cariño duro.',
      rel: {
        amistad: { ask: 'Señora Medarda, me gustaría ganarme su amistad.', yes: ['La amistad de un Medarda se gana con hechos. Los tuyos hablan bien de ti. Acepto.'] },
        mejor: { ask: 'La respeto más que a nadie, Ambessa.', yes: ['El respeto es la moneda de los fuertes. Me lo has pagado con creces.'] },
        familia: { ask: 'Nunca tuve madre. Usted… ¿me enseñaría a ser fuerte?', yes: ['(Te pone la mano en la nuca.) Un lobo solo muere pronto. Desde hoy corres con la manada Medarda, {name}.'] },
      },
      greet: {
        amistad: ['{name}. Camina conmigo.', 'Tienes buen aspecto. Bien. Los débiles no duran.'],
        mejor: ['Siéntate a mi derecha. Es un honor que no doy a menudo.', '{name}. Me alegra verte.'],
        familia: ['Mi cachorr{g:o|a|e}. ¿Has entrenado hoy?', '(Te observa con orgullo.) Cada día te pareces más a una Medarda.'],
        pariente: ['Sangre de mi sangre. Ven, siéntate.', 'Hij{g:o|a|e} de mi casa. ¿Qué noticias traes?'],
      },
      hang: {
        amistad: [['(Entrenáis con espadas de madera. Te desarma en dos movimientos.) Otra vez. Hasta que te sangren las manos.']],
        familia: [['(Te cuenta historias de batallas en las estepas noxianas junto al fuego.) Siempre protege a los tuyos. Siempre.'], ['(Te regala una daga ceremonial.) Para que recuerdes que nunca más estarás sol{g:o|a|e}.']],
        pariente: [['(Te enseña los estandartes de la familia Medarda.) Este es tu legado. Hónralo.']],
      },
      small: {
        dia: ['He tenido tres reuniones y ganado las tres. Un buen día.', 'Piltover es blanda. Me aburre.', 'Mejor ahora que hablo con alguien con espina dorsal.'],
        gusta: ['La caza. El entrenamiento. Ver a mi familia fuerte.', 'Una buena estrategia ejecutada a la perfección.'],
        secreto: ['Mel es lo único que temo perder.', 'Perdí a mi hijo mayor por mis decisiones. Lo llevo cada día.'],
        cumplido: ['Los halagos no me compran. Pero tampoco me molestan.', '(Sonríe apenas.) Tienes buen ojo.'],
        broma: ['En Noxus los chistes se cuentan antes de la batalla. Adelante.', '(Una carcajada breve y grave.) Te concedo esa.'],
        hobby: ['¿{hobby}? Toda habilidad es un arma si se afila.', '¿{hobby}? Bien. Domínalo.'],
        miedo: ['A la debilidad de los que amo.', 'A una muerte sin propósito.'],
        sueno: ['Que mi linaje sobreviva a todo lo que viene.', 'Ver a Mel gobernar sin tener que pelear.'],
      },
    },

    // =========================================================== MADDIE
    maddie: {
      gender: 'f', romance: ['mujer', 'nobinario'], family: null, sibling: true,
      persona: 'Maddie Nolen, ejecutora de Piltover y ayudante de Caitlyn que informa en secreto a Ambessa, rubia, simpática, risueña y entusiasta en apariencia, pero con secretos y lealtades ocultas. Habla con alegría, admiración fácil y algún desliz nervioso.',
      rel: {
        amistad: { ask: '¡Maddie! ¿Amigas?', yes: ['¡Claro que sí! ¡Qué ilusión! ¿Vamos a por bollos?'] },
        mejor: { ask: 'Eres una gran amiga, Maddie.', yes: ['(Se le borra la sonrisa un segundo.) Ojalá fuera tan buena como crees. …¡Pero lo intentaré!'] },
        pareja: { ask: 'Maddie, me gustas.', yes: ['(Se pone como un tomate.) ¿De verdad? ¿A mí? ¡Sí! Digo… sí. Me encantaría.'], no: ['Ay… eres un amor, pero hay alguien más. Lo siento muchísimo.'] },
        hermandad: { ask: 'Te siento como a una hermana, Maddie.', yes: ['¡Hermanas! Nunca tuve una. Bueno, tengo… no importa. ¡Hermanas!'] },
        romper: { ask: 'Maddie, lo nuestro no puede seguir.', yes: ['(Sonríe con los ojos húmedos.) Lo entiendo. Hay cosas de mí que no sabes. Es mejor así.'] },
      },
      greet: {
        amistad: ['¡{name}! ¡Hola, hola! ¿Qué tal todo?', '¡Ey! ¿Me acompañas a la patrulla? Se hace eterna sola.'],
        mejor: ['¡Mi persona favorita! ¿Hoy toca bollos o cotilleos?', '¡{name}! Te he guardado sitio.'],
        pareja: ['(Te abraza dando saltitos.) ¡Has venido! ¡Tengo tantas cosas que contarte!', 'Hola, cariño. Hoy estás… guau.'],
        hermandad: ['¡Hermanita! O hermanito. ¡Herman{g:o|a|e}! ¡Ven!', '¡Mi familia de Piltover! ¿Cenamos?'],
      },
      hang: {
        amistad: [['(Merendáis en una pastelería del Barrio Académico. Se come tres pasteles.) ¡Es que entrenar da hambre!']],
        pareja: [['(Paseo en barca por los canales al atardecer.) No quiero que esto acabe nunca. Nunca.'], ['(Te enseña a usar la honda de cuando era pequeña.) ¡Muy bien! ¡Le has dado a una paloma! Pobrecita.']],
        hermandad: [['(Os pintáis las uñas y criticáis a los ejecutores.) Marcus tiene cara de pez. No me digas que no.']],
      },
      small: {
        dia: ['¡Genial! Bueno, normal. Bueno, he tenido que mentir un poco. ¡Pero genial!', 'Patrulla aburrida. ¡Pero has venido tú!'],
        gusta: ['¡Los pasteles! Y entrenar. Y ver a Caitlyn disparar.', 'Conocer gente nueva. Me encanta la gente.'],
        secreto: ['No soy de Piltover. Shhh.', 'A veces escribo informes sobre gente que me cae bien. Y me siento fatal.'],
        cumplido: ['¡Ay, para! (No para de sonreír.) Gracias.', '¡Tú sí que estás genial!'],
        broma: ['¡Me encantan los chistes! ¡Cuenta!', '(Ríe con una carcajada enorme.) ¡Eres lo más!'],
        hobby: ['¿{hobby}? ¡Qué guay! ¡Llévame!', '¿{hobby}? ¡Enséñame, porfa!'],
        miedo: ['A que la gente que quiero descubra quién soy de verdad.', 'A tener que elegir bando.'],
        sueno: ['Vivir en una casita con un gato y que nadie me mande.', 'No tener que mentir nunca más.'],
      },
    },

    // =========================================================== KINO
    kino: {
      gender: 'm', romance: ['mujer', 'hombre', 'nobinario'], family: null, sibling: true,
      persona: 'Kino Medarda, hermano pequeño de Mel e hijo de Ambessa, o alguien que lleva su cara. Tranquilo, enigmático, diplomático, con frases que esconden más de lo que dicen. Habla breve y con un punto inquietante.',
      rel: {
        amistad: { ask: 'Kino, ¿amigos?', yes: ['(Asiente.) Amigos. No hablo mucho. Pero cubro espaldas.'] },
        mejor: { ask: 'Confío en ti, Kino.', yes: ['Lo mismo. No es algo que diga a menudo.'] },
        pareja: { ask: 'Kino… me gustas.', yes: ['(Se queda quieto.) Eso no estaba en el informe. (Una sonrisa mínima.) Me gusta el cambio de planes.'], no: ['No es buen momento. Ni buen sitio. Lo siento.'] },
        hermandad: { ask: '¿Hermanos de armas, Kino?', yes: ['Hermanos de armas. Hasta el final.'] },
        romper: { ask: 'Kino, se acabó.', yes: ['Entendido. (Se da la vuelta, pero tarda en irse.)'] },
      },
      greet: {
        amistad: ['{name}. Todo tranquilo.', 'Saludos. ¿Órdenes?'],
        mejor: ['Me alegra verte. De verdad.', '{name}. Siéntate. Tengo té.'],
        pareja: ['(Te coge la mano disimuladamente.) Hola.', 'Llegas. Bien. El día mejora.'],
        hermandad: ['Herman{g:o|a|e}. ¿Entrenamos?', 'Presente. Como siempre.'],
      },
      hang: {
        amistad: [['(Montáis guardia juntos en silencio.) …Gracias por la compañía.']],
        pareja: [['(Te enseña las estrellas que se ven desde la muralla.) En Noxus las llamamos los ojos de los caídos.'], ['(Comparte contigo su ración de dulces noxianos.) No se lo digas a nadie. Tengo reputación.']],
        hermandad: [['(Entrenáis hasta caer rendidos.) Mejoras. Despacio. Pero mejoras.']],
      },
      small: {
        dia: ['Sin incidentes.', 'Largo. Mejor ahora.'],
        gusta: ['El orden. Y el té.', 'Entrenar al amanecer.'],
        secreto: ['Echo de menos a mi madre. Está en Noxus.', 'Dibujo. Mal. Pero dibujo.'],
        cumplido: ['…Gracias. (Se pone rojo.)', 'Tú también. Mucho.'],
        broma: ['Adelante.', '(Se le escapa una risa corta.) …Bueno.'],
        hobby: ['¿{hobby}? Respetable.', '¿{hobby}? Interesante. Algún día lo pruebo.'],
        miedo: ['Fallar a los míos.', 'Morir lejos de casa.'],
        sueno: ['Volver a casa. Con alguien.', 'Un día sin órdenes.'],
      },
    },

    // =========================================================== CASSANDRA
    cassandra: {
      gender: 'f', romance: [], family: 'madre', sibling: false,
      persona: 'Cassandra Kiramman, consejera de Piltover, madre de Caitlyn. Aristócrata elegante, pragmática, protectora, preocupada por la seguridad de su hija y por el equilibrio político. Habla con educación refinada, tono sereno y firmeza maternal.',
      rel: {
        amistad: { ask: 'Consejera, me gustaría contar con su amistad.', yes: ['Será un placer. La gente honesta escasea en el Consejo.'] },
        mejor: { ask: 'La admiro de verdad, Cassandra.', yes: ['(Sonríe con dulzura.) Gracias, {name}. Eres de las pocas personas que me lo dicen sin pedir nada.'] },
        familia: { ask: 'Cassandra… nunca tuve madre. ¿Podría…?', yes: ['(Te coge las manos.) Mi casa es grande y mi corazón también. Bienvenid{g:o|a|e}, querid{g:o|a|e}.'] },
      },
      greet: {
        amistad: ['{name}, qué alegría. ¿Té?', 'Bienvenid{g:o|a|e}. Pasa, por favor.'],
        mejor: ['Mi invitad{g:o|a|e} favorit{g:o|a|e}. Siéntate.', '{name}. Justo a tiempo para la merienda.'],
        familia: ['Cariño. ¿Has comido bien? Estás delgad{g:o|a|e}.', '(Te arregla el cuello.) Así. Perfect{g:o|a|e}.'],
        pariente: ['Sobrin{g:o|a|e}. Qué alegría verte. Caitlyn preguntaba por ti.', 'Querid{g:o|a|e}. Siéntate, que te sirvo té.'],
      },
      hang: {
        amistad: [['(Paseáis por los jardines de la mansión Kiramman.) Mi marido plantó estas rosas. Siguen floreciendo, contra todo pronóstico.']],
        familia: [['(Te enseña a bailar el vals de la gala del Día del Progreso.) Un, dos, tres… muy bien.'], ['(Te regala un pañuelo bordado con el escudo Kiramman.) Ahora eres de esta casa.']],
        pariente: [['(Te enseña los retratos de la familia.) Este es tu bisabuelo. Tenía tu misma mirada terca.']],
      },
      small: {
        dia: ['Largo. El Consejo es un nido de víboras con buenos modales.', 'Preocupada por Caitlyn. Como siempre.'],
        gusta: ['La jardinería. Y una buena conversación.', 'La música de cámara.'],
        secreto: ['Temo cada día que Caitlyn no vuelva a casa.', 'De joven quise ser pintora.'],
        cumplido: ['Qué amable. Gracias, querid{g:o|a|e}.', '(Ríe suavemente.) Me haces sentir joven.'],
        broma: ['Adelante, me vendrá bien reír.', '(Ríe, tapándose la boca.) Muy ingenioso.'],
        hobby: ['¿{hobby}? Encantador. Cultiva tus pasiones.', '¿{hobby}? Me alegra.'],
        miedo: ['Perder a mi hija.', 'Que Piltover arda por el orgullo de unos pocos.'],
        sueno: ['Ver a Caitlyn feliz y a salvo.', 'Una ciudad en paz.'],
      },
    },

    // =========================================================== ISHA
    isha: {
      gender: 'f', romance: [], family: null, sibling: true,
      persona: 'Isha, niña muda de Zaun, valiente y cariñosa, con gafas de soldador y unas botas enormes; se encariña con Jinx y la sigue a todas partes. No habla: se expresa con gestos, sonrisas, dibujos y sonidos. Responde siempre con acotaciones entre paréntesis.',
      rel: {
        amistad: { ask: 'Isha, ¿quieres ser mi amiga?', yes: ['(Asiente con fuerza y te regala una chapa brillante.)'] },
        mejor: { ask: 'Eres mi mejor amiga, Isha.', yes: ['(Te abraza la pierna y no te suelta en un buen rato.)'] },
        hermandad: { ask: '¿Quieres que sea tu herman{g:o|a|e} mayor?', yes: ['(Se le iluminan los ojos. Te dibuja con un palito en el suelo: tú, ella y un corazón.)'] },
      },
      greet: {
        amistad: ['(Te saluda dando saltitos.)', '(Te enseña una tuerca que ha encontrado, muy orgullosa.)'],
        mejor: ['(Corre hacia ti y te da la mano.)', '(Te tira de la manga para enseñarte algo.)'],
        hermandad: ['(Se te sube a la espalda sin avisar.)', '(Te abraza fuerte y te da un caramelo pegajoso.)'],
        pariente: ['(Se te sube a la espalda sin avisar.)', '(Te abraza fuerte y te da un caramelo pegajoso.)'],
      },
      hang: {
        amistad: [['(Jugáis a la rayuela en el Sumidero. Hace trampas y se ríe en silencio.)']],
        hermandad: [['(Le enseñas a leer unas letras. Las escribe torcidas, muy concentrada.)'], ['(Os quedáis dormid{g:os|as|es} en un tejado viendo las luces de neón.)']],
      },
      small: {
        dia: ['(Pulgar arriba.)', '(Hace un gesto de bostezo y luego sonríe.)'],
        gusta: ['(Hace el gesto de lanzar una bomba y se ríe.)', '(Dibuja una aerotabla en el aire.)'],
        secreto: ['(Te enseña una foto vieja de una mujer. Se la guarda rápido.)', '(Te susurra al oído… nada. Pero te mira como si te contara algo importante.)'],
        cumplido: ['(Se pone roja y se esconde detrás de sus gafas.)', '(Te hace una reverencia exagerada.)'],
        broma: ['(Se tapa la boca para no reírse. No lo consigue.)', '(Te mira muy seria y luego estalla en una risa sin sonido.)'],
        hobby: ['(Aplaude.)', '(Te pide con gestos que se lo enseñes.)'],
        miedo: ['(Mira hacia la oscuridad del Sumidero y te coge la mano.)', '(Se abraza a sí misma.)'],
        sueno: ['(Dibuja una casa con muchas ventanas y gente dentro.)', '(Señala el cielo, arriba del todo.)'],
      },
    },
  },
};
