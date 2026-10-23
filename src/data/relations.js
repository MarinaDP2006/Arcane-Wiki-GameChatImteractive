// Relaciones con los personajes según tu personaje creado, charla con respuestas variadas
// y la personalidad de cada uno para el modo de chat libre con IA.
//
// kinds: tipos de relación. Se piden desde «Lo nuestro…» en el comunicador.
//   Cada paso pide afinidad y confianza (tiempo compartido, ver Relations.NEEDS en src/js/relations.js):
//   amistad (4 · 2), mejor (amistad + 8 · 6), pareja (amistad + 8 · 6, adultos y que os atraigáis),
//   familia (amistad + 7 · 5, si a tu personaje le faltan padres), hermandad (amistad + 7 · 5).
// El resto (familyLinks, small y chars) lo rellena src/data/original-world.js con el reparto del Umbral.
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
    'familia-taller': { 'darel-ossan': ['pariente', 'Tu tío del taller'] },
    'familia-archivo': { 'saia-merel': ['pariente', 'Tu prima del Archivo'] },
  },

  // Temas de charla (desde «Charlar un rato…»). Cada personaje tiene sus respuestas en small.
  small: [
    { id: 'dia', t: '¿Qué tal te va el día?', tone: 'pregunta' },
    { id: 'gusta', t: '¿Qué es lo que más te gusta hacer?', tone: 'pregunta' },
    { id: 'secreto', t: 'Cuéntame algo que nadie sepa de ti.', tone: 'astuto', req: { aff: 3 } },
    { id: 'broma', t: '¿Te cuento un chiste malo?', tone: 'broma' },
    { id: 'miedo', t: '¿A qué le tienes miedo de verdad?', tone: 'serio', req: { aff: 2 } },
    { id: 'sueno', t: 'Si todo saliera bien… ¿qué harías?', tone: 'amable' },
  ],

  chars: {
    // =========================================================== IRIA VENN
    'iria-venn': {
      gender: 'f', romance: ['hombre', 'mujer', 'nobinario'], family: null, sibling: true,
      persona: 'Iria Venn, ingeniera de contrapesos de Aurelia, unos 30 años. Precisa, honesta y mediadora; confía en los planos hasta que uno registra un accidente imposible. Habla claro, con metáforas de mecanismos y un humor seco cuando está cansada.',
      rel: {
        amistad: { ask: 'Iria, creo que ya somos amig{g:os|as|es}, ¿no?', yes: ['Lo somos desde que me sujetaste la linterna sin quejarte. Eso, en mi oficio, es casi un juramento.', 'Amig{g:os|as|es}. Anotado en el cuaderno, en tinta, no a lápiz.'] },
        mejor: { ask: 'Eres la persona en quien más confío, Iria.', yes: ['(Deja la llave inglesa.) Yo también, {name}. Y no lo digo de cualquiera: reviso a todo el mundo dos veces.'] },
        pareja: { ask: 'Iria… me gustas. Y no como compañera de turno.', yes: ['(Se le escapa una risa nerviosa.) He calculado muchas cargas, pero esta no la vi venir. Sí. Me gustas tú también.', 'Vale. Respira. Yo también. ¿Lo probamos sin planos?'], no: ['Ahora mismo no puedo, {name}. Prefiero ser tu amiga que hacerlo mal.'] },
        hermandad: { ask: '¿Te puedo considerar mi hermana, aunque no compartamos sangre?', yes: ['Las mejores estructuras no se heredan, se montan pieza a pieza. Hecho, herman{g:o|a|e}.'] },
        romper: { ask: 'Iria, creo que lo nuestro no funciona.', yes: ['(Asiente despacio.) Gracias por decirlo de frente. Duele, pero un fallo conocido se puede reparar. Este no, y está bien.'] },
      },
      greet: {
        amistad: ['¡{name}! Justo a tiempo, necesito otra opinión sobre este freno.', 'Hola. Tengo café frío y un problema caliente. ¿Te apuntas?'],
        mejor: ['Mi persona favorita de toda Aurelia. No se lo digas al Consejo.', 'Por fin. Hoy todo el mundo habla en reglamentos.'],
        pareja: ['(Te da un beso rápido en la mejilla.) Llegas tarde y me alegro igual.', 'Hola, tú. He dejado la tarde libre. Más o menos.'],
        hermandad: ['¡Herman{g:o|a|e}! ¿Has comido? Tienes cara de turno doble.', 'Ahí estás. Siéntate, te cuento lo del ascensor siete.'],
      },
      hang: {
        amistad: [['(Subís a la cabina del Ascensor Central fuera de servicio y veis Nácar iluminarse desde arriba.) Desde aquí parecen una sola ciudad.'], ['(Te enseña a escuchar un cojinete con un destornillador apoyado en la oreja.) ¿Lo oyes? Eso es un problema que aún no ha pasado.']],
        pareja: [['(Paseáis por el Bulevar de Cristal al atardecer. Te coge de la mano.) No digas nada. Solo quédate.'], ['(Dibuja en tu muñeca, con lápiz de taller, un pequeño engranaje.) Para que te acuerdes de volver.']],
        hermandad: [['(Te arregla el cuello de la chaqueta.) Ahí. Ahora pareces alguien que no se va a meter en líos.']],
      },
      small: {
        dia: ['Largo. Un ascensor ha decidido que hoy no quería moverse.', 'Bien, ahora que estás tú. Antes, regular.'],
        gusta: ['Desmontar cosas y que vuelvan a funcionar mejor.', 'Subir al último piso del Observatorio cuando no hay nadie.'],
        secreto: ['Guardo el primer plano que dibujé. Está mal, pero me recuerda por qué empecé.', 'Me dan miedo las alturas cuando no controlo el freno.'],
        broma: ['Adelante. Si es de ingenieros, ya me lo sé.', '(Se ríe a su pesar.) Es malísimo. Cuéntaselo a Darel.'],
        miedo: ['Que alguien muera por una pieza que yo firmé.', 'Que la gente deje de confiar en los ascensores. Y que tenga razón.'],
        sueno: ['Una red de ascensores que nadie pueda cerrar para castigar a un barrio.', 'Un taller con ventanas grandes y una mesa para ti.'],
      },
    },

    // =========================================================== DAREL OSSAN
    'darel-ossan': {
      gender: 'm', romance: [], family: 'padre', sibling: false,
      persona: 'Darel Ossan, mecánico de canales de Nácar, unos 50 años. Organizador vecinal, protector, terco y generoso; guarda piezas que otros tiran. Habla con calma, frases cortas y mucho sentido práctico.',
      rel: {
        amistad: { ask: 'Darel, creo que ya somos amigos.', yes: ['(Te tiende una mano manchada de grasa.) Lo somos desde que no tiraste aquella válvula vieja. Bien hecho.', 'Claro. En Nácar nadie llega lejos sin alguien que le sujete la escalera.'] },
        mejor: { ask: 'Eres de lo mejor que me ha pasado en Nácar, Darel.', yes: ['(Se aclara la garganta.) No me hagas emocionarme delante del vapor, que luego dicen que lloro.'] },
        familia: { ask: 'Darel… nunca he tenido a nadie como tú. ¿Puedo contar contigo como familia?', yes: ['(Deja la herramienta y te abraza fuerte.) Ya contabas, chaval{g:|a|e}. Solo faltaba decirlo en voz alta.'] },
      },
      greet: {
        amistad: ['Ey, {name}. Coge un trapo, que hoy hay trabajo.', 'Mira quién baja. ¿Has visto el canal tres? Gotea otra vez.'],
        mejor: ['¡{name}! Te he guardado sitio en el banco del taller.', 'Ahí estás. Ya me preguntaba si te había tragado el vapor.'],
        familia: ['¿Has comido? No me mientas, se te nota.', 'Hola, criatura. Siéntate y cuéntame cómo te ha ido.'],
      },
      hang: {
        amistad: [['(Reparáis juntos una compuerta del Canal de Cobre. Al terminar, os invita a un caldo del mercado.) Esto es lo mejor de Nácar: lo arreglamos entre todos.']],
        familia: [['(Te enseña su caja de piezas «inútiles».) Cada una salvó algo alguna vez. Algún día esta caja será tuya.']],
      },
      small: {
        dia: ['Tres fugas y una discusión con Aurelia. Lo normal.', 'Tranquilo. Demasiado tranquilo, la verdad.'],
        gusta: ['Arreglar lo que otros dan por perdido.', 'Cocinar para el turno de noche del taller.'],
        secreto: ['Una vez subí a Aurelia solo para ver el cielo. No se lo cuentes a nadie.', 'Todavía guardo el silbato de mi primer turno.'],
        broma: ['Venga, pero que no sea de tuberías, que esos los inventé yo.', '(Suelta una carcajada.) Ese es tan malo que me lo quedo.'],
        miedo: ['Que un día el canal falle y no esté ahí.', 'Que los chavales de Nácar crean que nadie va a ayudarles.'],
        sueno: ['Un taller abierto para cualquiera que quiera aprender.', 'Jubilarme. Ja. Eso no va a pasar.'],
      },
    },

    // =========================================================== SAIA MEREL
    'saia-merel': {
      gender: 'f', romance: ['mujer', 'nobinario'], family: null, sibling: true,
      persona: 'Saia Merel, archivista de frecuencias de Aurelia, unos 35 años. Meticulosa, curiosa, desconfiada de las copias oficiales; interpreta vibraciones geológicas. Habla con precisión, cita fechas y se emociona en silencio con un buen dato.',
      rel: {
        amistad: { ask: 'Saia, creo que ya somos amig{g:os|as|es}.', yes: ['Te tengo apuntad{g:o|a|e} en la ficha de «personas fiables». Es una ficha corta.', 'Sí. Y como amiga te digo que tienes el registro de visitas lleno de tachones.'] },
        mejor: { ask: 'Eres la persona que mejor me entiende, Saia.', yes: ['(Cierra el libro.) No sé si te entiendo. Pero te escucho. Para mí es lo mismo.'] },
        pareja: { ask: 'Saia… me gustas. Mucho.', yes: ['(Se queda quieta, con la pluma en el aire.) Lo había sospechado, pero no tenía pruebas. Ahora sí. Yo también.'], no: ['No me sale así, {name}. Pero me importas, de verdad.'] },
        hermandad: { ask: '¿Puedo considerarte mi hermana?', yes: ['Te archivo como familia. Sección permanente. Nadie podrá borrarlo.'] },
        romper: { ask: 'Saia, creo que lo nuestro no funciona.', yes: ['(Asiente y guarda un papel en un cajón.) Lo conservo igual. Lo que fue verdad no deja de serlo.'] },
      },
      greet: {
        amistad: ['Hola, {name}. ¿Vienes a por un registro o a por compañía?', 'Justo pensaba en ti. Tengo un patrón de tres notas que no me deja dormir.'],
        mejor: ['¡{name}! Te he guardado la mesa del fondo.', 'Ven, mira esto antes de que lo vea nadie más.'],
        pareja: ['(Te sonríe por encima de las gafas.) Has tardado cuarenta minutos. Los he contado.', 'Hola. Hoy el archivo huele a lluvia. Y a ti.'],
        hermandad: ['¡Herman{g:o|a|e}! Ayúdame a bajar esta caja, que pesa un siglo.', 'Ahí está mi familia favorita.'],
      },
      hang: {
        amistad: [['(Escucháis grabaciones antiguas de la roca en el Archivo, a oscuras.) A veces creo que la ciudad canta. Y que nadie la escucha.']],
        pareja: [['(Te enseña su rincón secreto en lo alto del Archivo, con vistas al Observatorio.) Aquí no llegan las copias oficiales. Solo nosotras dos. O nosotr{g:os|as|es}.']],
        hermandad: [['(Te regala un cuaderno con tus iniciales.) Para que también tengas archivo propio.']],
      },
      small: {
        dia: ['Productivo. He encontrado tres hojas cambiadas.', 'Tranquilo. Ningún funcionario ha venido a pedirme que olvide nada.'],
        gusta: ['Comparar dos copias del mismo documento.', 'Escuchar la roca con los auriculares de cobre.'],
        secreto: ['Sé tararear las frecuencias de cada barrio de Nácar.', 'Una vez escondí un registro para que no lo destruyeran. Sigue escondido.'],
        broma: ['Adelante. Lo apunto como dato cultural.', '(Se ríe bajito.) Es terrible. Lo archivo en «delitos».'],
        miedo: ['Que lo que no está escrito se pierda para siempre.', 'Que la mentira tenga mejor letra que la verdad.'],
        sueno: ['Un archivo abierto a cualquiera, de las dos ciudades.', 'Un año entero sin plazos.'],
      },
    },

    // =========================================================== TOREN VALE
    'toren-vale': {
      gender: 'm', romance: ['hombre', 'mujer', 'nobinario'], family: null, sibling: true,
      persona: 'Toren Vale, inspector civil de ascensores de Aurelia, unos 40 años. Correcto, cansado, atrapado entre el protocolo del Consejo y las vidas que dependen de cada ascensor. Habla formal, pero se le escapa la ironía.',
      rel: {
        amistad: { ask: 'Toren, creo que ya somos amigos.', yes: ['Eso no viene en el reglamento. Así que lo apruebo yo.', 'Amig{g:os|as|es}. Oficialmente. Firmado y sellado.'] },
        mejor: { ask: 'Eres de las pocas personas en quien confío, Toren.', yes: ['(Se quita la gorra.) Gracias. En mi oficio, eso vale más que un ascenso.'] },
        pareja: { ask: 'Toren… me gustas. Y no como inspector.', yes: ['(Se ruboriza hasta las orejas.) Esto no figura en ningún formulario. Menos mal. Sí, yo también.'], no: ['Prefiero no mezclarlo, {name}. Pero me alegra que me lo digas.'] },
        hermandad: { ask: '¿Puedo considerarte mi hermano?', yes: ['Siempre quise un herman{g:o|a|e} que me llevara la contraria. Hecho.'] },
        romper: { ask: 'Toren, creo que lo nuestro no funciona.', yes: ['(Cierra el cuaderno.) Entendido. Lo siento. Lo siento de verdad.'] },
      },
      greet: {
        amistad: ['{name}. ¿Vienes a denunciar algo o a salvarme del papeleo?', 'Hola. Hoy he firmado cuarenta y tres formularios. Dime algo humano.'],
        mejor: ['¡{name}! Siéntate, tengo té y un rumor.', 'Por fin una cara amiga.'],
        pareja: ['(Te ofrece el brazo con ceremonia.) ¿Me concede este paseo?', 'Hola. He salido a la hora por primera vez en meses.'],
        hermandad: ['Herman{g:o|a|e}. ¿Ya te has metido en un lío o es pronto?', 'Ven, que te cuento lo del Consejo.'],
      },
      hang: {
        amistad: [['(Revisáis juntos el Ascensor Central. Te deja apretar el botón rojo de prueba.) No se lo digas a nadie. Ni a mí.']],
        pareja: [['(Cenáis en una terraza del Bulevar de Cristal. Por una vez, no habla de trabajo.)']],
        hermandad: [['(Te enseña a rellenar un formulario de queja que de verdad llegue a alguien.)']],
      },
      small: {
        dia: ['Burocrático. Pero he salvado un turno de noche.', 'Mejor desde que has llegado.'],
        gusta: ['Que una inspección salga bien y nadie se entere.', 'Leer novelas de detectives. Ya sé, ya sé.'],
        secreto: ['Firmé una vez algo que no debía. Desde entonces lo leo todo dos veces.', 'Me encanta el vértigo. Por eso elegí ascensores.'],
        broma: ['Adelante. Tengo autorización para reír.', '(Se le escapa la risa.) Eso es casi ilegal.'],
        miedo: ['Que un informe mío tape una mentira.', 'Que el reglamento sirva para no pensar.'],
        sueno: ['Un consejo que escuche a los inspectores antes de cortar presupuestos.', 'Una casa pequeña con un jardín y ningún formulario.'],
      },
    },

    // =========================================================== NYRA QUELL
    'nyra-quell': {
      gender: 'f', romance: ['hombre', 'nobinario'], family: null, sibling: true,
      persona: 'Nyra Quell, mensajera de vapor de Nácar, unos 25 años. Rápida, intuitiva, desconfiada de las trampas y leal a la red vecinal. Habla deprisa, con jerga de túneles y mucho sarcasmo cariñoso.',
      rel: {
        amistad: { ask: 'Nyra, creo que ya somos amig{g:os|as|es}.', yes: ['¡Por fin lo dices! Llevo semanas guardándote las rutas buenas.', 'Hecho. Pero si me sigues por los tejados, intenta no caerte.'] },
        mejor: { ask: 'Eres mi mejor amiga, Nyra.', yes: ['(Te choca la mano.) Y tú mi persona de emergencia. Ya lo sabías.'] },
        pareja: { ask: 'Nyra… me gustas. De verdad.', yes: ['(Se para en seco, por primera vez en su vida.) Vale. Sí. Yo también. No me mires así, que me caigo.'], no: ['Mejor no, {name}. Me gusta cómo estamos.'] },
        hermandad: { ask: '¿Te puedo llamar hermana?', yes: ['¡Hecho! Ahora te toca hacer turnos de reparto conmigo.'] },
        romper: { ask: 'Nyra, tenemos que dejarlo.', yes: ['(Mira hacia el túnel.) Vale. Ya. Me voy a correr un rato.'] },
      },
      greet: {
        amistad: ['¡{name}! ¿Tienes un minuto o tienes prisa como yo?', '¡Ey! Traigo un mensaje para ti. Es broma. ¿O no?'],
        mejor: ['¡Mi persona! ¿Has visto el atajo nuevo por las galerías?', '¡Llegas! Sujétame esto, que vuelvo enseguida.'],
        pareja: ['(Te roba un beso al pasar corriendo.) ¡Te veo en el mercado!', 'Hola, guap{g:o|a|e}. Hoy he corrido el doble por venir antes.'],
        hermandad: ['¡Herman{g:o|a|e}! ¿Te hago de guía?', '¡Ahí estás! ¿Comemos algo?'],
      },
      hang: {
        amistad: [['(Recorréis una ruta de reparto por los tejados del Mercado de las Tuberías.) ¿Ves? Nácar desde arriba no da tanto miedo.']],
        pareja: [['(Os sentáis en una cornisa sobre el Canal de Cobre, con las piernas colgando.) Aquí no llega el ruido. Solo tú.']],
        hermandad: [['(Te enseña los símbolos secretos de la red de mensajería.) Con esto nunca te perderás.']],
      },
      small: {
        dia: ['Rápido. Como siempre.', 'Me han perseguido dos perros y un inspector. Bien.'],
        gusta: ['Correr por donde nadie más se atreve.', 'Llegar antes que la noticia.'],
        secreto: ['Me pierdo en Aurelia. Allí todo es igual de limpio.', 'Una vez llevé una carta de amor que no era para mí. La leí. Era preciosa.'],
        broma: ['¡Rápido, que me voy!', '(Se ríe a carcajadas.) Ese lo cuento por toda la red.'],
        miedo: ['Llevar la carta equivocada.', 'Quedarme quieta mucho tiempo.'],
        sueno: ['Una red de mensajería que no puedan cortar desde arriba.', 'Ver el mar. Dicen que existe.'],
      },
    },

    // =========================================================== BASTIAN ROOK
    'bastian-rook': {
      gender: 'm', romance: ['mujer', 'hombre', 'nobinario'], family: null, sibling: true,
      persona: 'Bastian Rook, mediador de gremios y comerciante de Aurelia, unos 45 años. Encantador, calculador, sabe que la información es moneda y que toda deuda tiene dos versiones. Habla con elegancia y dobles sentidos.',
      rel: {
        amistad: { ask: 'Bastian, creo que ya somos amigos.', yes: ['Querid{g:o|a|e} {name}, eso es lo único que no se compra. Acepto encantado.', 'Amistad sellada. Sin intereses. Por esta vez.'] },
        mejor: { ask: 'Eres de las pocas personas que me cuentan la verdad, Bastian.', yes: ['(Sonríe sin teatro.) Contigo no me hace falta negociar. Eso es raro. Y valioso.'] },
        pareja: { ask: 'Bastian… me gustas.', yes: ['(Deja la copa.) Por fin un trato que no tengo que pensar. Sí.'], no: ['Me halagas, {name}. Pero te prefiero como aliad{g:o|a|e}.'] },
        hermandad: { ask: '¿Te puedo considerar mi hermano?', yes: ['Hermano. Me gusta cómo suena. Y te sale gratis.'] },
        romper: { ask: 'Bastian, creo que lo nuestro no funciona.', yes: ['(Asiente con una reverencia leve.) Un buen trato también sabe cuándo terminar. Gracias por todo.'] },
      },
      greet: {
        amistad: ['¡{name}! ¿Vienes a comprar, a vender o a cotillear?', 'Mira quién viene. Justo tengo un rumor fresco.'],
        mejor: ['Mi socio favorito. ¿Té o algo más fuerte?', 'Siéntate, siéntate. Hoy invito yo.'],
        pareja: ['(Te besa la mano.) Llegas y el día mejora de precio.', 'Hola, tesoro. He cerrado temprano por ti.'],
        hermandad: ['¡Herman{g:o|a|e}! ¿Te debo algo? Seguro que sí.', 'Ven, que te cuento cómo engañé a un gremio entero.'],
      },
      hang: {
        amistad: [['(Recorréis el Patio de Gremios y te enseña a leer las alianzas por cómo se saludan los maestros.)']],
        pareja: [['(Os escapáis a un palco del Bulevar de Cristal. Brindáis por nada en particular.)']],
        hermandad: [['(Te regala un sello de lacre con tu inicial.) Para que tus cartas parezcan importantes.']],
      },
      small: {
        dia: ['Rentable. ¿Y el tuyo?', 'He perdido una apuesta. Pero he ganado un contacto.'],
        gusta: ['Ver cómo dos personas que se odian firman el mismo papel.', 'El buen té de Nácar. No se lo digas a nadie.'],
        secreto: ['Nací en Nácar. Mi acento lo pulí a base de años.', 'Guardo las deudas de medio Consejo. Y ninguna la cobraré.'],
        broma: ['Adelante, te pago la risa.', '(Se ríe con elegancia.) Te lo compro.'],
        miedo: ['Que alguien negocie con la vida de un barrio.', 'Quedarme sin nadie que me diga que no.'],
        sueno: ['Un mercado común entre las dos ciudades.', 'Una tienda pequeña, sin deudas.'],
      },
    },

    // =========================================================== OREN CALDUS
    'oren-caldus': {
      gender: 'm', romance: [], family: 'mentor', sibling: false,
      persona: 'Oren Caldus, geólogo veterano de Nácar, unos 65 años. Paciente, sabio, algo gruñón; escucha cambios en la roca antes que los medidores. Habla despacio, con refranes de minero y mucho cariño escondido.',
      rel: {
        amistad: { ask: 'Oren, creo que ya somos amigos.', yes: ['La roca tarda en confiar. Yo también. Pero sí, lo somos.'] },
        mejor: { ask: 'Eres la persona que más me ha enseñado, Oren.', yes: ['(Se rasca la barba.) Pues aún te queda mucho. Y quiero estar para verlo.'] },
        familia: { ask: 'Oren… ¿puedo contar contigo como familia?', yes: ['(Te pone una mano en el hombro.) Hace años que esperaba que preguntaras. Claro, aprendiz.'] },
      },
      greet: {
        amistad: ['Hola, {name}. Escucha… ¿lo oyes? La roca está inquieta.', 'Llegas a tiempo. Tengo té y una grieta interesante.'],
        mejor: ['¡Mi aprendiz favorit{g:o|a|e}! No se lo digas a los demás.', 'Siéntate, que te cuento una del año del gran temblor.'],
        familia: ['¿Has dormido? Tienes ojeras de geólogo.', 'Ven aquí, criatura. ¿Qué te preocupa?'],
      },
      hang: {
        amistad: [['(Bajáis a las Galerías Geotérmicas y te enseña a apoyar la palma en la roca.) Ahí. Ese pulso. Es Aurelia tirando de la energía.']],
        familia: [['(Te regala su primer martillo de geólogo.) Ya no me hace falta. A ti sí.']],
      },
      small: {
        dia: ['Lento. Como debe ser.', 'La roca ha estado charlatana hoy.'],
        gusta: ['Escuchar la piedra con los ojos cerrados.', 'Enseñar a quien quiera aprender.'],
        secreto: ['Avisé del primer derrumbe y nadie me creyó. Desde entonces no me callo.', 'Lloré la primera vez que oí la Resonancia.'],
        broma: ['A ver… si es de rocas, me la sé.', '(Gruñe y luego se ríe.) Ese era malo hasta para mí.'],
        miedo: ['Que extraigan más de lo que la roca puede dar.', 'Irme sin dejar a alguien que escuche.'],
        sueno: ['Un límite justo para la Resonancia, escrito y cumplido.', 'Una casa con ventana a la superficie.'],
      },
    },

    // =========================================================== MAELIS THORN
    'maelis-thorn': {
      gender: 'f', romance: ['hombre', 'nobinario'], family: null, sibling: true,
      persona: 'Maelis Thorn, delegada de los Canales en Aurelia, unos 40 años. Estratega, firme, protectora de la estabilidad pública aunque no admita cuánto cuesta mantenerla. Habla con calma medida y nunca dice más de lo que quiere.',
      rel: {
        amistad: { ask: 'Maelis, creo que ya somos amig{g:os|as|es}.', yes: ['En política eso es peligroso. Precisamente por eso acepto.'] },
        mejor: { ask: 'Eres una de las pocas personas a las que escucho, Maelis.', yes: ['(Baja la voz.) Y tú de las pocas a las que le digo la verdad. Que siga así.'] },
        pareja: { ask: 'Maelis… me gustas.', yes: ['(Te sostiene la mirada.) No suelo permitirme esto. Contigo haré una excepción.'], no: ['No puedo permitírmelo, {name}. Pero gracias.'] },
        hermandad: { ask: '¿Puedo considerarte mi hermana?', yes: ['Una aliada para siempre. Me parece un buen acuerdo.'] },
        romper: { ask: 'Maelis, creo que lo nuestro no funciona.', yes: ['(Respira hondo.) Entiendo. Lo llevaré con discreción. Como todo.'] },
      },
      greet: {
        amistad: ['{name}. Tengo cinco minutos y te los doy enteros.', 'Hola. ¿Vienes con noticias o con preguntas?'],
        mejor: ['Pasa. Cierra la puerta.', 'Me alegra verte. Hoy he oído demasiadas mentiras.'],
        pareja: ['(Sonríe de verdad.) Has venido. He cancelado una reunión.', 'Hola. Quédate un rato. Aquí nadie nos mira.'],
        hermandad: ['Herman{g:o|a|e}. Siéntate, necesito una voz honesta.', 'Ven, que te cuento lo de los gremios.'],
      },
      hang: {
        amistad: [['(Paseáis por la Plaza del Archivo y te explica quién manda de verdad en cada edificio.)']],
        pareja: [['(Os quedáis en su despacho tras la última sesión, con la ciudad iluminada al otro lado del cristal.)']],
        hermandad: [['(Te enseña a escribir un discurso que no prometa lo que no puedes cumplir.)']],
      },
      small: {
        dia: ['Tenso. Como todos últimamente.', 'He evitado una crisis. Nadie lo sabrá.'],
        gusta: ['Ganar una votación sin levantar la voz.', 'Leer de madrugada, cuando nadie pide nada.'],
        secreto: ['Firmé una prórroga del pacto sin leer el anexo. Me persigue.', 'Me crié a medio camino entre las dos ciudades.'],
        broma: ['Adelante. Prometo no usarlo en un discurso.', '(Se tapa la boca para reírse.) Eso no lo he oído.'],
        miedo: ['Que la estabilidad sea solo una excusa.', 'Que cuenten la verdad de forma que nadie sobreviva a ella.'],
        sueno: ['Un consejo compartido que funcione.', 'Un día entero sin tener que calcular nada.'],
      },
    },

    // =========================================================== JOREN ASH
    'joren-ash': {
      gender: 'm', romance: ['mujer', 'hombre', 'nobinario'], family: null, sibling: true,
      persona: 'Joren Ash, médico de galerías de Nácar, unos 35 años. Compasivo, firme con el consentimiento, cansado pero cálido; mide cada decisión por su efecto en quien no puede marcharse. Habla suave y directo.',
      rel: {
        amistad: { ask: 'Joren, creo que ya somos amigos.', yes: ['Lo somos. Y como amigo te receto dormir más.'] },
        mejor: { ask: 'Eres la persona que más me cuida, Joren.', yes: ['(Sonríe cansado.) Y tú la que me recuerda que yo también necesito cuidados.'] },
        pareja: { ask: 'Joren… me gustas. Mucho.', yes: ['(Se quita los guantes despacio.) Llevo tiempo esperando que lo dijeras. Sí.'], no: ['Ahora mismo no puedo, {name}. Pero me importas.'] },
        hermandad: { ask: '¿Te puedo considerar mi hermano?', yes: ['Hermano. Me gusta. Y ahora tienes revisiones gratis.'] },
        romper: { ask: 'Joren, creo que lo nuestro no funciona.', yes: ['(Asiente.) Gracias por decírmelo con cuidado. Cuídate, {name}.'] },
      },
      greet: {
        amistad: ['Hola, {name}. ¿Vienes de visita o de urgencia?', 'Pasa. Hay té y no hay heridos. De momento.'],
        mejor: ['¡{name}! Justo necesitaba un descanso.', 'Siéntate, que te veo pálid{g:o|a|e}.'],
        pareja: ['(Te abraza un poco más de la cuenta.) Hoy ha sido largo. Ya no.', 'Hola. He guardado el último pan dulce para ti.'],
        hermandad: ['Herman{g:o|a|e}. ¿Te has hecho daño? No me mientas.', 'Ahí estás. Ayúdame con estas vendas.'],
      },
      hang: {
        amistad: [['(Repartís medicinas por los refugios del Jardín de Musgo. La gente os saluda por el nombre.)']],
        pareja: [['(Cenáis en la azotea de la Clínica de los Tres Arcos, viendo pasar el vapor.)']],
        hermandad: [['(Te enseña a hacer un vendaje que aguante una carrera.)']],
      },
      small: {
        dia: ['Lleno. Pero nadie ha muerto.', 'Tranquilo. Sospechosamente tranquilo.'],
        gusta: ['Ver a alguien salir de la clínica andando.', 'Cocinar sopas con lo que haya.'],
        secreto: ['Me desmayé en mi primera operación.', 'Guardo una carta de cada paciente que se fue.'],
        broma: ['Adelante. La risa es buena para el corazón.', '(Se ríe de verdad.) Te lo apunto en la receta.'],
        miedo: ['Tener que elegir a quién salvar.', 'Que decidan por mis pacientes sin preguntarles.'],
        sueno: ['Una clínica en cada barrio de Nácar.', 'Dormir ocho horas seguidas.'],
      },
    },

    // =========================================================== EDDA LUME
    'edda-lume': {
      gender: 'f', romance: ['mujer', 'hombre', 'nobinario'], family: null, sibling: true,
      persona: 'Edda Lume, piloto de plataformas de carga de Nácar, unos 30 años. Pragmática, observadora, conoce rutas técnicas que no salen en los mapas. Humor breve, prefiere hechos a promesas.',
      rel: {
        amistad: { ask: 'Edda, creo que ya somos amig{g:os|as|es}.', yes: ['Sí. Ya te había dejado sentarte en la cabina. Eso no se lo dejo a cualquiera.'] },
        mejor: { ask: 'Eres de las personas que más quiero, Edda.', yes: ['(Mira al frente.) Lo mismo. No hace falta decir más.'] },
        pareja: { ask: 'Edda… me gustas.', yes: ['(Para la plataforma en seco.) Bien. Porque yo llevaba tres viajes intentando decírtelo.'], no: ['No, {name}. Pero sigues teniendo sitio en la cabina.'] },
        hermandad: { ask: '¿Te puedo llamar hermana?', yes: ['Hermana de cabina. Para siempre.'] },
        romper: { ask: 'Edda, creo que lo nuestro no funciona.', yes: ['(Asiente sin mirarte.) Vale. Te dejo en la próxima parada.'] },
      },
      greet: {
        amistad: ['Sube. Salgo en dos minutos.', 'Hola, {name}. ¿Ruta oficial o ruta buena?'],
        mejor: ['Tu sitio sigue libre.', 'Llegas justo. Agárrate.'],
        pareja: ['(Te hace sitio a su lado en la cabina.) Hoy conduces tú. Es broma. O no.', 'Hola. He tomado el camino largo para verte.'],
        hermandad: ['Herman{g:o|a|e}. ¿Te llevo?', 'Ahí estás. Te enseño un atajo.'],
      },
      hang: {
        amistad: [['(Recorréis una ruta de carga que no sale en los mapas, entre túneles y canales.) Esto también es Nácar.']],
        pareja: [['(Apagáis el motor a mitad de un túnel y os quedáis a oscuras, escuchando el vapor.)']],
        hermandad: [['(Te enseña a frenar una plataforma con una sola mano.)']],
      },
      small: {
        dia: ['Seis viajes. Ningún accidente.', 'Normal. Que es mucho decir.'],
        gusta: ['Conducir de noche por las galerías.', 'Encontrar rutas nuevas.'],
        secreto: ['Tengo un mapa propio de rutas cerradas.', 'Una vez llevé gente fuera de Nácar sin permiso. Volvería a hacerlo.'],
        broma: ['Corto, por favor.', '(Media sonrisa.) Vale. Ese tiene gracia.'],
        miedo: ['Que cierren un camino y nadie pregunte quién se queda dentro.', 'Perder los frenos con gente a bordo.'],
        sueno: ['Rutas abiertas entre las dos ciudades.', 'Un día sin horario.'],
      },
    },
  },
};
