// Historia interactiva. Cada capítulo es un grafo de nodos.
//
// Nodo: { bg, lines: [{ s: hablante, t: texto }], choices?: [...], next?: id, end?: true }
//   s: id de personaje del reparto (STORY.cast), 'narrador' o 'yo' (el jugador).
//      Los secundarios de la serie (Mylo, Claggor, Benzo, Singed, Marcus, Scar…) no hablan:
//      el narrador cuenta lo que hacen o dicen.
// Elección: { t, next, req?, fx? }
//   req: { stat: 'ingenio'|'carisma'|'valor'|'sigilo', min } | { flag } | { notFlag } | { aff: [id, min] }
//   fx:  { aff: { id: n }, rep: { zaun: n, piltover: n }, stats: { stat: n }, flags: [..] }
//
// Plantillas en el texto: {name}, {job}, {district}, {family}, {hobby},
// y {g:masculino|femenino|neutro} para concordar con el género del jugador.
window.STORY = {
  stats: {
    ingenio: { label: 'Ingenio', icon: 'Ing' },
    carisma: { label: 'Carisma', icon: 'Car' },
    valor: { label: 'Valor', icon: 'Val' },
    sigilo: { label: 'Sigilo', icon: 'Sig' },
  },

  // Reparto: los únicos personajes que hablan, se desbloquean y salen en el comunicador.
  // Son los 16 protagonistas cuyas caras están en arte/caras.
  cast: ['vi', 'jinx', 'caitlyn', 'jayce', 'viktor', 'mel', 'heimerdinger', 'silco', 'vander', 'ekko', 'sevika', 'ambessa', 'cassandra', 'isha', 'maddie', 'kino'],

  chapters: [
    // ======================= RUTA ZAUN =======================
    {
      id: 'z1', route: 'zaun', title: 'Capítulo 1 · La Última Gota',
      intro: 'Zaun, años antes de la hextec. El humo verde sube por las grietas y en la taberna de Vander huele a cerveza y a problemas.',
      unlocks: ['vander', 'vi', 'jinx'],
      start: 'a',
      nodes: {
        a: { bg: 'ultima-gota', lines: [
          { s: 'narrador', t: 'Empujas la puerta de La Última Gota. Te conocen en {district}: eres {name}, {job}. Hoy vienes a por un encargo… o a por un trago.' },
          { s: 'narrador', t: 'Detrás de la barra, un hombretón con las manos llenas de cicatrices seca vasos que ya están secos. Todo Zaun sabe quién es: Vander, el que lideró la revuelta del puente.' },
          { s: 'vander', t: '{name}. Siéntate. La primera ronda la pago yo, la segunda te la cobro con favores.' },
          { s: 'vander', t: 'Aquí abajo hay una regla, y en mi barra se cumple: nada de Brillo, nada de peleas y nada de ejecutores. Lo demás, lo hablamos.' },
          { s: 'vander', t: 'Bueno. Cuéntame qué te trae a mi taberna.' },
        ], choices: [
          { t: '«Busco trabajo honrado. Si es que eso existe aquí abajo.»', next: 'b', fx: { aff: { vander: 2 } } },
          { t: '«He oído que tus chavales planean algo gordo.»', next: 'b2', fx: { aff: { vander: -1, vi: 1 } } },
          { t: '(Observar en silencio a la gente de la taberna.)', next: 'b3', fx: { stats: { sigilo: 1 } } },
        ] },
        b: { bg: 'ultima-gota', lines: [
          { s: 'vander', t: 'Honrado… Me gusta la palabra, aunque cueste encontrarla en Zaun.' },
          { s: 'vander', t: 'Hace años yo también buscaba otra cosa. Quería que Piltover nos mirase a la cara. Lo conseguí, ¿sabes cómo? Llenando el puente de cadáveres.' },
          { s: 'yo', t: 'Y desde entonces sirves cerveza.' },
          { s: 'vander', t: '(Sonríe a medias.) Desde entonces cuido de los que quedaron. Ayúdame con las cajas del sótano y hablamos de ese trabajo.' },
          { s: 'narrador', t: 'Mientras cargas cajas, una niña de pelo azul te espía desde las escaleras con un cachivache que pita. Cuando la miras, se esconde. Mal.' },
        ], next: 'b_vander' },
        b2: { bg: 'ultima-gota', lines: [
          { s: 'vander', t: '(Deja el vaso con un golpe seco.) Mis chavales no planean nada. Y tú tampoco.' },
          { s: 'vi', t: '(Desde una mesa del fondo, con los pies encima.) Tranquilo, viejo. Solo charlamos. ¿Verdad, {name}?' },
          { s: 'vander', t: 'Vi. Pies abajo. Y tú, la próxima vez que oigas algo «gordo», me lo cuentas a mí primero.' },
          { s: 'vi', t: '(Baja los pies muy despacio, mirándole fijamente.) Sí, papá.' },
          { s: 'narrador', t: 'Vander no es su padre. Pero por cómo se miran, ninguno de los dos lo diría en voz alta.' },
        ], next: 'b_vander' },
        b3: { bg: 'ultima-gota', lines: [
          { s: 'narrador', t: 'Te fijas: dos ejecutores beben en una esquina sin uniforme. Un hombre con un ojo rojo y una cicatriz que le parte la cara los paga desde la sombra… y desaparece.' },
          { s: 'narrador', t: 'En la barra, Vander también lo ha visto. Aprieta el trapo hasta que le crujen los nudillos.' },
          { s: 'vander', t: '(Sin mirarte.) Hay fantasmas que no se quedan en el río por mucho que los hundas.' },
          { s: 'narrador', t: 'Lo guardas en la memoria. En Zaun, saber cosas es más valioso que el dinero.' },
        ], next: 'b_vander' },
        b_vander: { bg: 'ultima-gota', lines: [
          { s: 'vander', t: 'Una cosa más, {name}. Esos críos de ahí… Vi, Powder, Mylo, Claggor. Sus padres murieron en el puente por seguirme.' },
          { s: 'vander', t: 'Les prometí que nunca más. Nada de guerras con los de arriba. Si alguno te pide que le acompañes a Piltover, quiero saberlo.' },
        ], choices: [
          { t: '«Tienes mi palabra, Vander.»', next: 'c', fx: { aff: { vander: 1 } } },
          { t: '«No soy niñera de nadie.»', next: 'c', fx: { aff: { vander: -1 }, stats: { valor: 1 } } },
          { t: '«¿Y quién te protege a ti de tus fantasmas?» (Carisma 2)', req: { stat: 'carisma', min: 2 }, next: 'b_fantasmas', fx: { aff: { vander: 2 } } },
        ] },
        b_fantasmas: { bg: 'ultima-gota', lines: [
          { s: 'vander', t: '(Se queda quieto con el vaso en la mano.) Nadie me lo había preguntado nunca.' },
          { s: 'vander', t: 'Tuve un hermano. No de sangre, de lucha. Se llamaba Silco. Soñábamos con un Zaun libre… y él no supo parar cuando hacía falta parar.' },
          { s: 'vander', t: 'Así que le paré yo. En el río. (Te sirve otra ronda sin preguntar.) Esa historia no la cuentes por ahí.' },
        ], next: 'c' },
        c: { bg: 'callejones', lines: [
          { s: 'jinx', t: '¡Hola! Soy Powder. ¿Sabes algo de cachivaches? Mi bomba no explota. Bueno, a veces sí. Cuando no debe.' },
          { s: 'jinx', t: 'Esta se llama Crujidora. Bueno, aún no tiene nombre. Las cosas que no funcionan no se merecen nombre, dice Mylo.' },
          { s: 'vi', t: 'Powder, deja en paz a la gente. (Te mira de arriba abajo.) Así que tú eres {name}. Vander habla bien de ti. Eso es raro.' },
          { s: 'vi', t: 'Mira, voy a ir al grano. Mañana subimos a Piltover. Una casa vacía en el barrio alto, llena de cosas que nadie echará de menos. Nos vendría bien alguien más.' },
          { s: 'narrador', t: 'Mylo se cruza de brazos y refunfuña que más gente es menos botín. Claggor le da un codazo sin apartar la vista de sus planos.' },
          { s: 'jinx', t: 'Yo también voy. ¿A que sí, Vi? ¿A que sí?' },
          { s: 'vi', t: '(Le revuelve el pelo.) Ya veremos, peque. Decide tú, {name}.' },
        ], choices: [
          { t: 'Unirte al golpe en Piltover.', next: 'd_golpe', fx: { aff: { vi: 2 }, rep: { zaun: 1 }, flags: ['golpe'] } },
          { t: 'Ayudar a Powder con su bomba (Ingenio 2).', req: { stat: 'ingenio', min: 2 }, next: 'd_bomba', fx: { aff: { jinx: 3 }, flags: ['bomba_powder'] } },
          { t: 'Avisar a Vander de lo que traman.', next: 'd_aviso', fx: { aff: { vander: 2, vi: -2 }, flags: ['chivato'] } },
        ] },
        d_golpe: { bg: 'taller-jayce', lines: [
          { s: 'narrador', t: 'De noche cruzáis el puente escondidos en un carro de chatarra. Piltover huele a pintura nueva y a dinero.' },
          { s: 'vi', t: 'Entramos, cogemos lo que brille y salimos. Nadie se hace el héroe. ¿Entendido?' },
          { s: 'narrador', t: 'La «casa vacía» es un laboratorio: pizarras llenas de fórmulas, maquetas de latón y una vitrina con gemas que brillan como estrellas azules.' },
          { s: 'jinx', t: '¡Mira, mira! Son preciosas… Vi, ¿puedo coger una? Solo una. Una pequeñita.' },
          { s: 'vi', t: 'Powder, no toques nada que haga ruido—' },
          { s: 'narrador', t: 'Un tirón, un destello y una explosión que arranca la pared de cuajo. El cielo de Piltover se llena de cristales y papeles en llamas.' },
          { s: 'vi', t: '¡Corre, {name}! ¡No mires atrás!' },
        ], next: 'd_huida' },
        d_huida: { bg: 'tejados', lines: [
          { s: 'narrador', t: 'Saltáis de tejado en tejado mientras suenan los silbatos de los ejecutores. Mylo resbala en una cornisa y se queda colgando.' },
          { s: 'vi', t: '¡Mylo! ¡Agárrate! {name}, ayúdame a tirar.' },
          { s: 'narrador', t: 'Entre los dos lo subís justo a tiempo. Mylo jura que lo tenía controlado. Nadie se lo cree, ni él.' },
          { s: 'jinx', t: '(Abrazada a su bolsa, sin aliento.) Lo siento, lo siento, lo siento… Yo no quería…' },
          { s: 'vi', t: 'Ya está, ya está. Estamos todos. Eso es lo que importa.' },
        ], next: 'e' },
        d_bomba: { bg: 'callejones', lines: [
          { s: 'yo', t: 'El problema es el detonador: está mal soldado. Mira, si giras este cable…' },
          { s: 'jinx', t: '¿Así? ¿Y si le pongo un muelle aquí, para que salte más?' },
          { s: 'yo', t: 'Para que salte más… y para que no te salte a la cara. Prueba.' },
          { s: 'narrador', t: 'Un pop seco y una nube de chispas azules. Esta vez, exactamente donde ella quería.' },
          { s: 'jinx', t: '(Ojos como platos.) ¡Funciona! ¡Por fin alguien que no se ríe de mí! Mylo dice que soy un desastre.' },
          { s: 'yo', t: 'Mylo no sabe soldar.' },
          { s: 'jinx', t: '(Se ríe tan fuerte que tiene que sentarse en el suelo.) ¡Se lo voy a decir!' },
          { s: 'narrador', t: 'Aunque no subes con ellos, esa noche Powder se lleva tu idea en el bolsillo. Y algo del laboratorio de Piltover vuelve con ella: una explosión que se ve desde todo Zaun.' },
        ], next: 'e' },
        d_aviso: { bg: 'ultima-gota', lines: [
          { s: 'vander', t: '(Suelta el trapo.) ¿Al barrio alto? ¿Esta noche? Esos chicos van a acabar conmigo.' },
          { s: 'vander', t: 'Gracias por decírmelo. Sé que no es fácil ser quien lo cuenta.' },
          { s: 'narrador', t: 'Vander sale a buscarlos. Llega tarde: ya han cruzado el puente. Cuando vuelven, traen algo robado… y a medio Piltover detrás.' },
          { s: 'vi', t: '(Al verte en la barra.) ¿Fuiste tú quien se lo contó? Genial. Gracias, de verdad.' },
          { s: 'jinx', t: '(Por detrás de Vi, en voz baja.) Yo no estoy enfadada contigo. Un poquito sí.' },
        ], next: 'e' },
        e: { bg: 'ultima-gota', lines: [
          { s: 'narrador', t: 'Al día siguiente, los ejecutores bajan en masa. Revuelven cada tienda, cada taller, cada casa de los callejones.' },
          { s: 'vander', t: '(Abre la caja que trajeron los chicos y la cierra de golpe al ver el brillo azul.) ¿Tenéis la menor idea de lo que habéis hecho?' },
          { s: 'vi', t: '¡Nadie nos vio! ¡Lo juro!' },
          { s: 'vander', t: 'Os vio toda la ciudad, Vi. Piltover no busca a unos ladrones. Busca una excusa.' },
          { s: 'narrador', t: 'Esa noche, en la azotea, ves a Vander sentado junto a Vi, mirando las luces de arriba.' },
        ], next: 'f' },
        f: { bg: 'tejados', lines: [
          { s: 'vander', t: 'Cuando yo tenía tu edad, también creía que bastaba con golpear más fuerte. Cada puñetazo que di en aquel puente lo pagó otra persona.' },
          { s: 'vi', t: 'Entonces, ¿qué? ¿Nos quedamos quietos mientras nos pisan?' },
          { s: 'vander', t: 'Os protegemos. A los nuestros. (Le da un golpecito en el hombro.) Eres la mayor, Vi. Si a mí me pasa algo, cuidarás de ellos.' },
          { s: 'vi', t: 'No te va a pasar nada, viejo.' },
          { s: 'narrador', t: 'Vander te ve en la puerta de la azotea. Te hace un gesto para que te acerques.' },
        ], choices: [
          { t: 'Sentarte con ellos y mirar las luces.', next: 'g', fx: { aff: { vander: 1, vi: 1 } } },
          { t: '«Si Piltover quiere un culpable, déjame ayudarte a esconder la caja.»', next: 'g', fx: { aff: { vander: 2 }, rep: { zaun: 1 } } },
          { t: 'Dejarles solos: es un momento suyo.', next: 'g', fx: { aff: { vi: 1 } } },
        ] },
        g: { bg: 'ultima-gota', lines: [
          { s: 'vander', t: 'Los ejecutores quieren un culpable. Si no lo encuentran, Zaun entero pagará.' },
          { s: 'narrador', t: 'Vander mira el baúl donde guarda sus viejos guanteletes. Lo abre. Los toca. Lo vuelve a cerrar.' },
          { s: 'vander', t: 'Mañana iré a hablar con la sheriff Grayson. Es razonable. Arreglaremos esto como adultos.' },
          { s: 'narrador', t: 'Mientras tanto, en las profundidades de Zaun, un hombre con una cicatriz en el ojo recibe la noticia del robo y sonríe por primera vez en años.' },
          { s: 'narrador', t: 'Has entrado en la familia de La Última Gota. Para bien o para mal.' },
        ], end: true },
      },
    },
    {
      id: 'z2', route: 'zaun', title: 'Capítulo 2 · Humo y traición',
      intro: 'El robo ha despertado a Piltover. Los ejecutores bajan cada noche, y alguien en la sombra se aprovecha del caos.',
      unlocks: ['ekko', 'silco'],
      start: 'a',
      nodes: {
        a: { bg: 'callejones', lines: [
          { s: 'narrador', t: 'La tienda de empeños de Benzo es un laberinto de trastos, relojes rotos y piezas de máquinas que nadie sabe para qué sirven. Benzo te deja pasar con un gesto: los amigos de Vander son amigos suyos.' },
          { s: 'ekko', t: '¡Hala, mira esto! Benzo me deja arreglar el cacharro que encontré en el vertedero. Si funciona, vuela.' },
          { s: 'ekko', t: 'Soy Ekko. Bueno, ya lo sabes, todo el mundo lo sabe. Soy el que va con Powder. O sea, ella va conmigo. Más o menos.' },
        ], choices: [
          { t: 'Ayudar a Ekko a arreglarlo (Ingenio 2).', req: { stat: 'ingenio', min: 2 }, next: 'b_ekko', fx: { aff: { ekko: 3 } } },
          { t: 'Preguntar a Benzo por el hombre de la cicatriz.', next: 'b_benzo', fx: { aff: {}, flags: ['sabe_silco'] } },
          { t: 'Bromear con Ekko sobre su peinado.', next: 'b_broma', fx: { aff: { ekko: 1 } } },
        ] },
        b_ekko: { bg: 'callejones', lines: [
          { s: 'yo', t: 'Tienes el peso mal repartido. Si mueves la batería al centro…' },
          { s: 'ekko', t: '¡Claro! Por eso siempre se va de morros. Espera, espera, que lo pruebo.' },
          { s: 'narrador', t: 'Entre los dos, el cacharro despega un palmo del suelo antes de estrellarse contra una estantería llena de teteras.' },
          { s: 'ekko', t: '¡Ha volado! ¡Lo has visto! Algún día haré que vuele de verdad. Por encima de los tejados. Por encima de todo.' },
          { s: 'narrador', t: 'Benzo, desde el mostrador, comenta que algún día también le pagará las teteras. Ekko finge no oírle.' },
        ], next: 'b2' },
        b_benzo: { bg: 'callejones', lines: [
          { s: 'narrador', t: 'Benzo baja la voz y mira hacia la puerta antes de hablar. El hombre de la cicatriz se llama Silco. Era como un hermano para Vander, hasta que dejaron de serlo.' },
          { s: 'narrador', t: 'Ahora compra ejecutores como quien compra pan, y en las fábricas del fondo hay un químico, Singed, que fabrica cosas que no deberían existir.' },
          { s: 'ekko', t: '(Asomado por encima de una caja.) ¿Silco? Powder dice que es un cuento para asustar a los niños.' },
          { s: 'yo', t: 'Los mejores cuentos de miedo son los que son verdad.' },
        ], next: 'b2' },
        b_broma: { bg: 'callejones', lines: [
          { s: 'ekko', t: '¿Mi pelo? Es aerodinámico. Algún día lo entenderás.' },
          { s: 'yo', t: '¿Aerodinámico para qué? ¿Para frenar?' },
          { s: 'ekko', t: '(Cruza los brazos, ofendidísimo.) Para cortar el viento. Cuando vuele, me darás la razón.' },
          { s: 'narrador', t: 'Benzo se ríe desde el mostrador: tiene respuesta para todo, como Vander a su edad.' },
        ], next: 'b2' },
        b2: { bg: 'callejones', lines: [
          { s: 'narrador', t: 'La puerta se abre de golpe. Powder entra corriendo con la cara manchada de hollín.' },
          { s: 'jinx', t: 'Ekko, {name}… ¡Vander se ha ido! Ha dicho que se entrega. Que así dejarán en paz a Zaun.' },
          { s: 'ekko', t: '¿Entregarse? ¿A los de arriba? ¡Pero si él no robó nada!' },
          { s: 'jinx', t: 'Fue culpa mía. La explosión fue culpa mía. Siempre es culpa mía.' },
        ], choices: [
          { t: '«No es culpa tuya, Powder. Vamos a arreglarlo.»', next: 'b3', fx: { aff: { jinx: 2 } } },
          { t: '«Vander sabe lo que hace. Confía en él.»', next: 'b3', fx: { aff: { vander: 1 } } },
          { t: '«¿Dónde está Vi? Hay que avisarla ya.»', next: 'b3', fx: { aff: { vi: 1 }, stats: { valor: 1 } } },
        ] },
        b3: { bg: 'ultima-gota', lines: [
          { s: 'vi', t: '(Dando vueltas por la taberna vacía.) Se ha entregado por nosotros. Por mí. Fue idea mía subir.' },
          { s: 'narrador', t: 'Alguien entra en la taberna. No es un ejecutor. Es un rumor con botas: Vander no está en Piltover. Está en una fábrica del Entresuelo, rodeado de hombres de Silco.' },
          { s: 'vi', t: 'Silco… ¿Qué tiene que ver ese con nada?' },
          { s: 'yo', t: 'Que alguien le ha vendido. Y sé quién paga a los ejecutores.' },
        ], next: 'c' },
        c: { bg: 'sumidero', lines: [
          { s: 'narrador', t: 'Esa noche, todo Zaun cuchichea: Vander iba a entregarse en el puente, pero el puente estaba lleno de hombres de Silco.' },
          { s: 'vi', t: 'Le tienen. Vamos a sacarle de ahí. Mylo, Claggor, conmigo. Powder, tú te quedas.' },
          { s: 'jinx', t: '¡No es justo! ¡Yo también puedo ayudar! He hecho bombas nuevas, de verdad que esta vez…' },
          { s: 'vi', t: '¡He dicho que te quedas! (Se arrepiente al instante.) Por favor, Pow. Solo esta vez.' },
        ], choices: [
          { t: 'Ir con Vi al rescate (Valor 2).', req: { stat: 'valor', min: 2 }, next: 'd_rescate', fx: { aff: { vi: 2, vander: 2 }, rep: { zaun: 1 }, flags: ['rescate'] } },
          { t: 'Quedarte con Powder para que no haga locuras.', next: 'd_powder', fx: { aff: { jinx: 3 }, flags: ['con_powder'] } },
          { t: 'Seguir a Silco en secreto (Sigilo 2).', req: { stat: 'sigilo', min: 2 }, next: 'd_silco', fx: { aff: { silco: 1 }, flags: ['espia_silco'] } },
        ] },
        d_rescate: { bg: 'sumidero', lines: [
          { s: 'narrador', t: 'Os colais en la fábrica por los conductos de ventilación. Abajo, Vander está encadenado y Silco le habla como a un viejo amigo.' },
          { s: 'silco', t: 'Ha pasado mucho tiempo, hermano. ¿Te acuerdas del río? Yo sí. Me acuerdo cada vez que me miro al espejo.' },
          { s: 'vander', t: 'Hice lo que tenía que hacer. Ibas a quemar Zaun para salvarlo.' },
          { s: 'silco', t: 'Y tú elegiste a Piltover antes que a los tuyos. Siempre lo hiciste.' },
          { s: 'narrador', t: 'Vi salta antes de que puedas detenerla. Hay gritos, golpes y una nube violeta. Una mujer de brazos enormes, Sevika, te bloquea el paso.' },
          { s: 'vander', t: '(Arrancándose las cadenas.) ¡Vi! ¡Coge a los demás y salid!' },
        ], next: 'e' },
        d_powder: { bg: 'callejones', lines: [
          { s: 'jinx', t: 'Siempre me dejan atrás. ¿Tú crees que soy un gafe?' },
          { s: 'yo', t: 'Creo que eres la persona más lista que conozco. Pero hoy hay que ser lista y paciente.' },
          { s: 'jinx', t: '(Abraza a su monito de trapo.) Vi me hizo esto cuando era pequeña. Bueno, más pequeña. Dice que los monos de trapo dan suerte.' },
          { s: 'jinx', t: 'Si mis bombas funcionan esta vez… si les ayudo… ya no me dejarán atrás nunca más. ¿Verdad?' },
          { s: 'narrador', t: 'Te das la vuelta un segundo para mirar por la ventana. Cuando vuelves, la bolsa de inventos ya no está. Powder tampoco.' },
          { s: 'narrador', t: 'Corres hacia la fábrica. Llegas justo cuando todo estalla.' },
        ], next: 'e' },
        d_silco: { bg: 'sumidero', lines: [
          { s: 'narrador', t: 'Te deslizas entre tuberías. Ves a Silco junto a un hombre de bata que mezcla líquidos violetas: Singed.' },
          { s: 'silco', t: 'Con esto, Zaun dejará de arrodillarse. Una nación propia. Sin Piltover. Y ya no necesitaremos a Vander.' },
          { s: 'narrador', t: 'Singed le ofrece una jeringuilla llena de luz violeta. Silco la mira como quien mira el futuro.' },
          { s: 'silco', t: '(Sin girarse.) Sé que estás ahí. Las ratas siempre hacen el mismo ruido.' },
          { s: 'narrador', t: 'Sabes demasiado. Y Silco ha visto tu sombra.' },
        ], next: 'e' },
        e: { bg: 'sumidero', lines: [
          { s: 'narrador', t: 'Vander, acorralado, se inyecta el líquido violeta. Sus músculos crecen, se vuelve una montaña de furia. Derriba a los hombres de Silco uno tras otro.' },
          { s: 'narrador', t: 'Entonces cae algo del techo: una bomba con gemas azules. Powder grita desde una pasarela: «¡Vi, ya voy!».' },
          { s: 'narrador', t: 'Una explosión azul ilumina la fábrica. Cuando el humo se disipa, nada vuelve a ser igual.' },
          { s: 'narrador', t: 'Mylo y Claggor no se levantan. Vander tampoco: protegió a Vi con su cuerpo hasta el final.' },
          { s: 'jinx', t: 'Vi… Vi, yo solo quería ayudar. Funcionó, ¿ves? Funcionó…' },
          { s: 'vi', t: '¡Eres un gafe, Powder! ¡Un gafe!' },
        ], next: 'f' },
        f: { bg: 'sumidero', lines: [
          { s: 'narrador', t: 'Vi le da una bofetada y sale corriendo. Powder se queda arrodillada en el agua, temblando.' },
          { s: 'narrador', t: 'Una mano huesuda se apoya en su hombro. Es Silco, herido, con el ojo rojo brillando en la penumbra.' },
          { s: 'silco', t: 'Shh. Ya está. Ella te ha abandonado. Yo nunca lo haré.' },
          { s: 'narrador', t: 'Los ejecutores se llevan a Vi a rastras. Silco se lleva a Powder en brazos. Y tú te quedas {g:solo|sola|sole} en el humo… con una decisión por delante.' },
        ], end: true },
      },
    },
    {
      id: 'z3', route: 'zaun', title: 'Capítulo 3 · Siete años después',
      intro: 'Siete años. Zaun brilla de violeta: el Brillo corre por las calles y Silco manda. Has sobrevivido. Ahora toca decidir para quién.',
      unlocks: ['sevika'],
      start: 'a',
      nodes: {
        a: { bg: 'ultima-gota', lines: [
          { s: 'narrador', t: 'La Última Gota ya no es de Vander. Las paredes son de otro color, la música es otra y en el piso de arriba está el despacho de Silco.' },
          { s: 'narrador', t: 'Sevika te espera en la barra con un cigarro entre los dientes y un brazo de metal que sustituye al que le arrancó Vander aquella noche.' },
          { s: 'sevika', t: '{name}. Dicen que eres buen{g:o|a|e} {job}. Y que sobreviviste a lo de la fábrica. No mucha gente puede decir eso.' },
          { s: 'sevika', t: 'Silco necesita gente así. Paga bien, no pregunta y no se olvida de quién le es leal. Tampoco de quién no.' },
        ], choices: [
          { t: 'Aceptar trabajar para Silco.', next: 'b_acepta', fx: { aff: { sevika: 2, silco: 2 }, rep: { zaun: 1 }, flags: ['trabaja_silco'] } },
          { t: 'Negarte: «Vander no habría querido esto.»', next: 'b_niega', fx: { aff: { sevika: -2 }, rep: { zaun: 1 }, flags: ['rechaza_silco'] } },
          { t: 'Fingir que aceptas para espiar (Carisma 2).', req: { stat: 'carisma', min: 2 }, next: 'b_doble', fx: { aff: { sevika: 1 }, flags: ['agente_doble'] } },
        ] },
        b_acepta: { bg: 'ultima-gota', lines: [
          { s: 'narrador', t: 'Sevika te acompaña al piso de arriba. Silco está sentado ante una ventana que da a las chimeneas. No se levanta.' },
          { s: 'silco', t: 'Zaun necesita gente que entienda que la libertad cuesta. Y que alguien tiene que pagarla.' },
          { s: 'silco', t: 'Mi padre me dijo una vez que la gente no se sacrifica por los demás. Se sacrifica por una idea. Yo te ofrezco una idea, {name}: una nación.' },
          { s: 'silco', t: 'Bienvenid{g:o|a|e}.' },
          { s: 'sevika', t: 'Primer encargo: lleva este paquete al laboratorio de Singed. No lo abras. No lo sacudas. No preguntes.' },
        ], next: 'c' },
        b_niega: { bg: 'ultima-gota', lines: [
          { s: 'sevika', t: '(Se ríe sin ganas.) Vander está muerto. Los muertos no pagan alquileres. Ni protegen a nadie.' },
          { s: 'yo', t: 'Él no habría dejado que el Brillo se comiera a los críos de los callejones.' },
          { s: 'sevika', t: '(Echa el humo hacia tu cara.) Él dejó que Piltover se comiera a todo Zaun. Silco al menos nos da de comer.' },
          { s: 'narrador', t: 'Te marchas. Pero al día siguiente alguien deja un paquete a tu nombre en la puerta: un recado para Singed. En Zaun, un «no» también tiene precio.' },
        ], next: 'c' },
        b_doble: { bg: 'ultima-gota', lines: [
          { s: 'yo', t: 'Cuenta conmigo. Siempre me ha gustado trabajar para los que ganan.' },
          { s: 'sevika', t: '(Te mira fijamente durante demasiado tiempo.) Mmm. No me fío de ti.' },
          { s: 'sevika', t: 'Pero Silco sí, y eso me basta. Por ahora. Llévale esto a Singed. Y si me entero de que hablas con quien no debes…' },
          { s: 'narrador', t: 'Cierra el puño de metal. Los dedos crujen como un engranaje oxidado.' },
        ], next: 'c' },
        c: { bg: 'sumidero', lines: [
          { s: 'narrador', t: 'El laboratorio de Singed está en lo más hondo del Sumidero. Huele a formol, a óxido y a algo vivo.' },
          { s: 'narrador', t: 'Singed recoge el paquete sin mirarte y te dice que lo dejes en la mesa. Tras una cortina, algo gruñe. Él te asegura con voz suave que no te preocupes por su… paciente.' },
          { s: 'narrador', t: 'Una garra enorme araña los barrotes. Unos ojos casi humanos te miran con dolor.' },
        ], choices: [
          { t: 'Preguntar quién es el «paciente» (Valor 2).', req: { stat: 'valor', min: 2 }, next: 'd_pregunta', fx: { aff: {}, flags: ['vio_bestia'] } },
          { t: 'Salir de allí cuanto antes.', next: 'd_sale' },
          { t: 'Robar una muestra de Brillo para estudiarla (Sigilo 3).', req: { stat: 'sigilo', min: 3 }, next: 'd_roba', fx: { stats: { ingenio: 1 }, flags: ['muestra_brillo'] } },
        ] },
        d_pregunta: { bg: 'sumidero', lines: [
          { s: 'narrador', t: 'Singed limpia sus gafas con calma. Te dice que su paciente es alguien que se negó a morir, y que la ciencia no juzga, {name}: solo observa.' },
          { s: 'narrador', t: 'La criatura apoya la frente contra los barrotes. Tiene una cicatriz en el brazo con la forma exacta de un guantelete.' },
          { s: 'narrador', t: 'Te llevas un escalofrío… y la sensación de que conoces esa mirada.' },
        ], next: 'e0' },
        d_sale: { bg: 'callejones', lines: [
          { s: 'narrador', t: 'Sales al aire viciado de los callejones como quien sale de una tumba. Aun así, el gruñido te sigue durante tres calles.' },
        ], next: 'e0' },
        d_roba: { bg: 'sumidero', lines: [
          { s: 'narrador', t: 'Mientras Singed apunta datos en un cuaderno, un frasco violeta acaba en tu bolsillo.' },
          { s: 'narrador', t: 'El frasco está tibio. Late, como un corazón. Si alguien quiere destruir el Brillo, primero hay que entenderlo.' },
        ], next: 'e0' },
        e0: { bg: 'ultima-gota', lines: [
          { s: 'narrador', t: 'De vuelta en La Última Gota, Silco discute con Sevika en voz baja. Hablan de los ejecutores, de un sheriff llamado Marcus, de dinero que no llega.' },
          { s: 'silco', t: '¿Y dónde está ella?' },
          { s: 'sevika', t: '¿Dónde va a estar? Jugando con fuego. Literalmente. Ayer voló un almacén nuestro, Silco. Nuestro.' },
          { s: 'silco', t: '(Con una calma que da miedo.) Ella es mía, Sevika. Lo que rompa, se repone. No vuelvas a hablar así de ella.' },
          { s: 'sevika', t: '(Aprieta los dientes y te mira.) ¿Y tú qué miras?' },
        ], choices: [
          { t: '«Nada. Ni he oído nada.»', next: 'e', fx: { aff: { sevika: 1 }, stats: { sigilo: 1 } } },
          { t: '«¿Quién es ella?»', next: 'e', fx: { aff: { silco: -1 } } },
          { t: '«Si te molesta tanto, díselo a la cara.» (Valor 2)', req: { stat: 'valor', min: 2 }, next: 'e', fx: { aff: { sevika: 2 } } },
        ] },
        e: { bg: 'callejones', lines: [
          { s: 'narrador', t: 'Una explosión de colores rompe la noche. Risas. Una chica de trenzas azules salta de un tejado a otro con un lanzacohetes con cara de tiburón.' },
          { s: 'jinx', t: '¿{name}? ¡No puede ser! ¡Estás viv{g:o|a|e}! ¿Has venido a jugar? Mira, este es Fishbones. Saluda, Fishbones.', cond: { flag: 'con_powder' } },
          { s: 'jinx', t: '¿Y tú quién eres? Da igual. ¡Pareces divertid{g:o|a|e}! Te llamaré «Cosa».', cond: { notFlag: 'con_powder' } },
          { s: 'jinx', t: '(Se queda quieta de golpe y se tapa una oreja, como si alguien le hablara muy cerca.) Callaos. Callaos, que estoy hablando yo.' },
          { s: 'jinx', t: '(Vuelve a sonreír como si nada.) ¡Bueno! Tengo que irme. Si ves a Silco, dile que el almacén ya estaba feo.' },
          { s: 'narrador', t: 'Powder ya no existe. Ahora se hace llamar Jinx. Como la palabra que Vi le gritó aquella noche.' },
        ], end: true },
      },
    },
    {
      id: 'z4', route: 'zaun', title: 'Capítulo 4 · Luciérnagas',
      intro: 'Un cargamento de Brillo ha desaparecido. Dicen que las Luciérnagas han vuelto a atacar. Silco quiere nombres.',
      unlocks: [],
      start: 'a',
      nodes: {
        a: { bg: 'arbol', lines: [
          { s: 'narrador', t: 'Una figura con máscara te intercepta en una aerotabla y te lleva, a ciegas, hasta un lugar imposible: un árbol gigante que brilla en la oscuridad, en mitad de una cueva.' },
          { s: 'narrador', t: 'Te quitan la venda. Decenas de chavales con máscaras y pintura fosforescente te rodean. Scar, el de la cicatriz en la cara, se cruza de brazos y te advierte que más te vale tener una buena razón para no acabar en el vacío.' },
          { s: 'ekko', t: '(Baja de una rama de un salto.) Tranquilo, Scar. {name} y yo nos conocemos. ¿Verdad que sí?' },
          { s: 'ekko', t: 'Has crecido. Yo también. Ya no hago volar teteras: ahora vuelo yo.' },
        ], choices: [
          { t: '«Ekko, sigo de vuestro lado. Siempre lo estuve.»', next: 'b_lado', req: { notFlag: 'trabaja_silco' }, fx: { aff: { ekko: 2 }, rep: { zaun: 1 } } },
          { t: '«Trabajo para Silco, pero quiero salir.» (Carisma 2)', req: { stat: 'carisma', min: 2 }, next: 'b_salir', fx: { aff: { ekko: 1 }, flags: ['quiere_salir'] } },
          { t: 'Contarles lo que viste en el laboratorio de Singed.', req: { flag: 'vio_bestia' }, next: 'b_info', fx: { aff: { ekko: 2 }, flags: ['info_luciernagas'] } },
          { t: 'Memorizar el camino para vendérselo a Silco.', next: 'b_traicion', fx: { aff: { silco: 2, sevika: 1 }, rep: { zaun: -1 }, flags: ['traiciona_luciernagas'] } },
        ] },
        b_lado: { bg: 'arbol', lines: [
          { s: 'ekko', t: 'Lo sabía. Aquí arriba dormimos los que el Brillo dejó sin casa. Huérfanos, obreros, gente a la que Silco exprimió.' },
          { s: 'ekko', t: 'Mañana atacamos otro envío de Brillo. Nos vendría bien alguien que conozca las rutas de Silco.' },
        ], next: 'b_arbol' },
        b_salir: { bg: 'arbol', lines: [
          { s: 'ekko', t: 'Salir de Silco no es fácil. Pero aquí todos hemos salido de algo.' },
          { s: 'ekko', t: 'Ayúdanos y te ayudaremos. Si no, te devolvemos donde te encontramos. Con la venda puesta.' },
          { s: 'narrador', t: 'Scar no aparta la vista de ti. Te avisa de que te va a vigilar. De cerca.' },
        ], next: 'b_arbol' },
        b_info: { bg: 'arbol', lines: [
          { s: 'yo', t: 'Singed tiene algo en una jaula. Una bestia enorme. Y creo que antes era una persona.' },
          { s: 'ekko', t: '¿Una bestia en el laboratorio? Si Silco está creando monstruos… tenemos menos tiempo del que pensaba.' },
          { s: 'narrador', t: 'Scar baja el arma. Reconoce, a regañadientes, que retira lo de tirarte al vacío.' },
        ], next: 'b_arbol' },
        b_traicion: { bg: 'arbol', lines: [
          { s: 'narrador', t: 'Sonríes, asientes y cuentas los pasos. Cada rama, cada puente de cuerda, cada túnel. Silco pagará bien por esto.' },
          { s: 'ekko', t: 'Me alegro de verte, de verdad. Aquí arriba se respira mejor, ¿eh?' },
        ], next: 'b_arbol' },
        b_arbol: { bg: 'arbol', lines: [
          { s: 'narrador', t: 'Ekko te enseña el árbol. Hay murales por todas partes: caras de gente que ya no está. Un hombretón con una barba enorme. Dos chicos. Una niña de pelo azul con un monito de trapo.' },
          { s: 'ekko', t: 'Powder. Mi mejor amiga. Hasta que Silco la convirtió en… eso.' },
          { s: 'ekko', t: 'Hace unas semanas me la crucé en un puente. Me apuntó a la cara. Y aun así sigo pintándola así, como era.' },
        ], choices: [
          { t: '«A lo mejor sigue ahí dentro, Ekko.»', next: 'c', fx: { aff: { ekko: 2, jinx: 1 } } },
          { t: '«Powder murió aquella noche. Igual que Vander.»', next: 'c', fx: { aff: { ekko: -1 } } },
          { t: 'Quedarte en silencio mirando el mural.', next: 'c', fx: { aff: { ekko: 1 } } },
        ] },
        c: { bg: 'callejones', lines: [
          { s: 'narrador', t: 'La noche del ataque. Un convoy de Brillo avanza por los callejones custodiado por los matones de Sevika.' },
          { s: 'narrador', t: 'Desde lo alto, las Luciérnagas esperan con las máscaras bajadas y los botes de pintura fosforescente en la mano.' },
          { s: 'ekko', t: 'A mi señal. ¡Luciérnagas, ahora!' },
        ], choices: [
          { t: 'Pelear junto a las Luciérnagas (Valor 2).', req: { stat: 'valor', min: 2 }, next: 'd_pelea', fx: { aff: { ekko: 2, sevika: -2 }, rep: { zaun: 2 }, flags: ['heroe_luciernagas'] } },
          { t: 'Sabotear el convoy con química (Ingenio 3).', req: { stat: 'ingenio', min: 3 }, next: 'd_sabotaje', fx: { aff: { ekko: 3 }, rep: { zaun: 2 }, flags: ['heroe_luciernagas'] } },
          { t: 'Avisar a Sevika en el último momento.', req: { flag: 'traiciona_luciernagas' }, next: 'd_aviso', fx: { aff: { sevika: 3, silco: 2, ekko: -5 }, flags: ['luciernagas_caen'] } },
          { t: 'Quedarte al margen y observar.', next: 'd_margen', fx: { aff: { ekko: -1 } } },
        ] },
        d_pelea: { bg: 'callejones', lines: [
          { s: 'narrador', t: 'Pintura brillante, golpes y gritos. Ekko gira su bate como si bailara. Tú derribas a un matón que te dobla en tamaño.' },
          { s: 'narrador', t: 'Cuando Sevika llega, el Brillo ya arde en el canal con un humo violeta que sube hasta las chimeneas.' },
          { s: 'sevika', t: '{name}… Ya sabía yo. Silco se va a enterar de esto.' },
          { s: 'ekko', t: '(Desde un tejado, guiñándote un ojo bajo la máscara.) Dile que le mandamos recuerdos.' },
        ], next: 'e' },
        d_sabotaje: { bg: 'callejones', lines: [
          { s: 'narrador', t: 'Una mezcla tuya convierte los barriles en espuma inofensiva. Nadie resulta herido y el Brillo desaparece entre burbujas violetas.' },
          { s: 'ekko', t: '¡Eso ha sido increíble! ¿Dónde aprendiste eso?' },
          { s: 'yo', t: 'Ser {job} en {district} enseña mucho.' },
          { s: 'sevika', t: '(A lo lejos, pateando un barril lleno de espuma.) ¿Quién ha hecho esto? ¡¿QUIÉN?!' },
        ], next: 'e' },
        d_aviso: { bg: 'callejones', lines: [
          { s: 'narrador', t: 'Un silbido. Sevika estaba preparada. Sus hombres salen de cada portal.' },
          { s: 'sevika', t: '¡Ahora! ¡Que no escape ni uno!' },
          { s: 'narrador', t: 'Las Luciérnagas huyen en desbandada. Ekko te mira desde lo alto sin entender nada.' },
          { s: 'ekko', t: '¿Por qué…?' },
          { s: 'sevika', t: '(Te da una palmada en la espalda que casi te tumba.) Buen trabajo. Silco sabrá recompensarte.' },
        ], next: 'e' },
        d_margen: { bg: 'callejones', lines: [
          { s: 'narrador', t: 'Ves cómo el caos lo decide todo sin ti. Unos ganan, otros sangran. A veces no elegir también es elegir.' },
          { s: 'ekko', t: '(Al pasar a tu lado, sin pararse.) La próxima vez avísame si vas a mirar desde la grada.' },
        ], next: 'e' },
        e: { bg: 'ultima-gota', lines: [
          { s: 'silco', t: '(En su despacho, con los nudillos blancos sobre la mesa.) Las Luciérnagas me roban. Los ejecutores me exigen más. Y el Consejo de Piltover finge que no existimos.' },
          { s: 'silco', t: 'Pronto dejarán de fingir.' },
          { s: 'narrador', t: 'Al amanecer corre un rumor por los callejones: alguien ha salido de Stillwater. Una chica de pelo rosa, acompañada por una ejecutora de Piltover.' },
        ], end: true },
      },
    },
    {
      id: 'z5', route: 'zaun', title: 'Capítulo 5 · Reencuentro',
      intro: 'Vi ha vuelto. Busca a Powder… y a Silco. Y una ejecutora de Piltover la sigue como su sombra.',
      unlocks: ['caitlyn'],
      start: 'a',
      nodes: {
        a: { bg: 'callejones', lines: [
          { s: 'narrador', t: 'La reconoces por la forma de andar, como si fuera a pegarse con el mundo. Tiene el pelo rosa, más músculo y un tatuaje en la cara: «VI».' },
          { s: 'vi', t: '¿{name}? (Te abraza tan fuerte que crujen tus costillas.) Pensé que no quedaba nadie.' },
          { s: 'vi', t: 'Aunque sigo acordándome de quién fue con el cuento a Vander, ¿eh?', cond: { flag: 'chivato' } },
          { s: 'vi', t: 'Siete años. Siete años en Stillwater pensando en esa noche. En lo que le dije a Powder.' },
          { s: 'caitlyn', t: '(Se acerca con un rifle a la espalda y un abrigo que grita «Piltover».) Caitlyn Kiramman. Encantada. Vi dice que conoces Zaun mejor que nadie. Necesitamos encontrar a Silco.' },
          { s: 'vi', t: 'Tranqui, es buena gente. Para ser de arriba. La llamo Cupcake. Le encanta.' },
          { s: 'caitlyn', t: 'No me encanta.' },
        ], choices: [
          { t: '«Os llevaré hasta Jinx. Es lo que Vi necesita.»', next: 'b_jinx', fx: { aff: { vi: 2, jinx: 1 }, flags: ['guia_jinx'] } },
          { t: '«Silco está en La Última Gota. Os llevo.»', next: 'b_silco', fx: { aff: { caitlyn: 2 }, rep: { piltover: 1 }, flags: ['guia_silco'] } },
          { t: '«¿Una ejecutora en Zaun? Ni hablar.» (desconfiar)', next: 'b_desconfia', fx: { aff: { caitlyn: -2 }, rep: { zaun: 1 } } },
        ] },
        b_jinx: { bg: 'escondite-jinx', lines: [
          { s: 'narrador', t: 'Les guías por los túneles donde Jinx tiene su escondite: dibujos de colores en las paredes, peluches con cabezas de muñeca, cohetes a medio montar y una mesa puesta para una merienda que nunca acaba.' },
          { s: 'caitlyn', t: '(En voz baja.) Esto no es un escondite. Es una herida con pintura encima.' },
          { s: 'jinx', t: '(Desde lo alto de una viga, con las piernas colgando.) ¿Vi? No. No, no, no. Estás muerta. Las voces me lo dijeron.' },
          { s: 'vi', t: 'Powder… soy yo. He vuelto. Siento haber tardado tanto.' },
          { s: 'jinx', t: '(Se tapa los oídos.) ¡Mylo dice que mientes! ¡Claggor dice que mientes!' },
        ], next: 'c' },
        b_silco: { bg: 'ultima-gota', lines: [
          { s: 'caitlyn', t: 'Si atrapamos a Silco, el Brillo se acaba. El Consejo tendrá que escucharnos. Tendrá que escuchar a Zaun.' },
          { s: 'vi', t: '¿Ves? Habla como un cartel. Pero lo dice en serio. Eso es lo raro.' },
          { s: 'narrador', t: 'Pero en La Última Gota no está Silco. Está Jinx, sentada en la barra, balanceando las piernas y comiéndose una manzana.' },
          { s: 'jinx', t: 'Hola, hermanita. Has tardado. Siete años, ¿no? Los he contado. Con bombas.' },
        ], next: 'c' },
        b_desconfia: { bg: 'callejones', lines: [
          { s: 'caitlyn', t: 'Lo entiendo. Yo tampoco confiaría en un uniforme si viviera aquí abajo.' },
          { s: 'caitlyn', t: 'No te pido que confíes en el uniforme. Te pido que confíes en Vi.' },
          { s: 'vi', t: 'Cait es diferente, {name}. Me sacó de Stillwater cuando nadie más se acordaba de mí. Por favor.' },
          { s: 'narrador', t: 'A regañadientes, les acompañas. En la puerta de La Última Gota os espera una chica de trenzas azules.' },
        ], next: 'c' },
        c: { bg: 'ultima-gota', lines: [
          { s: 'vi', t: 'Pow… Te he echado tanto de menos. Lo que te dije aquella noche… no lo pensaba. Nunca lo pensé.' },
          { s: 'jinx', t: '(Sonríe con todos los dientes.) Pero lo dijiste. Y tenías razón. Mira todo lo que he roto.' },
          { s: 'jinx', t: '(Señala a Caitlyn con Pow-Pow.) ¿Y esta quién es? ¿Mi sustituta? ¿Ahora tienes una hermana nueva de Piltover?' },
          { s: 'caitlyn', t: '(Con la mano cerca del rifle.) Vi, no me gusta cómo está mirando.' },
          { s: 'jinx', t: '¿Y tú, {name}? ¿De qué lado estás? ¿Del mío o del de esa ejecutora?' },
        ], choices: [
          { t: '«Del tuyo. Siempre del de la familia.»', next: 'd_familia', fx: { aff: { jinx: 3, caitlyn: -1 }, rep: { zaun: 1 } } },
          { t: '«Del de Vi. Ella nunca dejó de buscarte.» (Carisma 3)', req: { stat: 'carisma', min: 3 }, next: 'd_vi', fx: { aff: { jinx: 2, vi: 3 }, flags: ['puente_hermanas'] } },
          { t: '«Del de Zaun. Y Zaun está harto de explosiones.»', next: 'd_zaun', fx: { aff: { jinx: -1, ekko: 1 }, rep: { zaun: 1 } } },
        ] },
        d_familia: { bg: 'ultima-gota', lines: [
          { s: 'jinx', t: '(Sonríe de oreja a oreja.) ¡Lo sabía! Tú y yo vamos a hacer algo GRANDE.' },
          { s: 'vi', t: '{name}… ¿en serio?' },
          { s: 'jinx', t: 'No pongas esa cara, Vi. Te fuiste tú. Los que se quedan son la familia.' },
        ], next: 'd2' },
        d_vi: { bg: 'ultima-gota', lines: [
          { s: 'yo', t: 'Vi se pasó siete años en una celda pensando en ti. Lo primero que hizo al salir fue buscarte. No a Silco. A ti.' },
          { s: 'jinx', t: '(Baja el arma. Le tiembla la mano.) ¿Es verdad, Vi?' },
          { s: 'vi', t: 'Todos los días. Todos.' },
          { s: 'narrador', t: 'Por un instante, Powder vuelve a estar ahí. La niña que hacía bombas con latas de sardinas y quería ir con su hermana a todas partes.' },
        ], next: 'd2' },
        d_zaun: { bg: 'ultima-gota', lines: [
          { s: 'jinx', t: 'Aburrid{g:o|a|e}. Zaun necesita fuegos artificiales para despertar.' },
          { s: 'jinx', t: 'Pero vale. Me gusta que me lo digas a la cara. Casi nadie se atreve.' },
        ], next: 'd2' },
        d2: { bg: 'ultima-gota', lines: [
          { s: 'narrador', t: 'Unos pasos lentos en la escalera. Un bastón. Un ojo rojo.' },
          { s: 'silco', t: 'Así que esta es la famosa Vi. La hermana que se fue.' },
          { s: 'vi', t: '(Aprieta los puños.) Tú. Tú te la llevaste. Tú mataste a Vander.' },
          { s: 'silco', t: 'Yo la recogí del agua cuando tú la dejaste allí. Pregúntale a ella quién estuvo a su lado estos siete años.' },
          { s: 'jinx', t: '(Mirando a uno y a otro, con las manos en la cabeza.) Parad. Parad. ¡PARAD!' },
        ], choices: [
          { t: 'Ponerte entre Vi y Silco (Valor 2).', req: { stat: 'valor', min: 2 }, next: 'e', fx: { aff: { vi: 2, silco: -2 }, stats: { valor: 1 } } },
          { t: 'Coger a Jinx de la mano para calmarla.', next: 'e', fx: { aff: { jinx: 2 } } },
          { t: 'Hacer una señal a Caitlyn para salir de ahí.', next: 'e', fx: { aff: { caitlyn: 2 } } },
        ] },
        e: { bg: 'ultima-gota', lines: [
          { s: 'narrador', t: 'Los silbatos de los ejecutores suenan fuera. Alguien les ha avisado. Todo el mundo corre en una dirección distinta.' },
          { s: 'narrador', t: 'En la confusión ves a Jinx guardar algo en su bolsa: una gema hextec enorme que zumba con un poder imposible.' },
          { s: 'caitlyn', t: '(Tirando de Vi hacia la salida.) ¡Vi, ahora no! ¡Volveremos a por ella, te lo prometo!' },
          { s: 'silco', t: '(Desde la escalera, sin alzar la voz.) Mañana, Piltover escuchará a Zaun. Por las buenas o por las malas.' },
        ], end: true },
      },
    },

    // ======================= RUTA PILTOVER =======================
    {
      id: 'p1', route: 'piltover', title: 'Capítulo 1 · La Academia',
      intro: 'Piltover, la Ciudad del Progreso. Latón, cristal y ambición. En la Academia, alguien está a punto de convertir la magia en ciencia.',
      unlocks: ['jayce', 'heimerdinger', 'viktor'],
      start: 'a',
      nodes: {
        a: { bg: 'academia', lines: [
          { s: 'narrador', t: 'Eres {name}, {job} de {district}. Hoy te han citado en la Academia por un asunto «delicado».' },
          { s: 'narrador', t: 'Los pasillos huelen a tinta y a cera. En el despacho del decano, el profesor Heimerdinger, un yordle de bigote blanco, revisa papeles chamuscados con cara de funeral.' },
          { s: 'heimerdinger', t: '¡Ah, puntualidad! Una virtud olvidada. Ha habido una explosión en un apartamento del barrio alto. Un tal Talis jugaba con magia. ¡Magia! En mi Academia.' },
          { s: 'viktor', t: '(Apoyado en su bastón, junto a la puerta.) El profesor está… alterado. Para él, decir «magia» en la Academia es como decir «fuego» en una biblioteca.' },
          { s: 'heimerdinger', t: 'Porque lo es, Viktor. Lo es. He visto ciudades enteras arder por menos. Y llevo vivo el tiempo suficiente para recordarlas todas.' },
        ], choices: [
          { t: '«Seguro que hay una explicación científica.»', next: 'b_ciencia', fx: { aff: { heimerdinger: 1, jayce: 1, viktor: 1 } } },
          { t: '«La magia sin control es peligrosa. Tiene razón.»', next: 'b_razon', fx: { aff: { heimerdinger: 3, jayce: -1 } } },
          { t: '(Fijarte en el joven del bastón que toma notas.)', next: 'b_viktor', fx: { aff: { viktor: 2 }, stats: { ingenio: 1 } } },
        ] },
        b_ciencia: { bg: 'academia', lines: [
          { s: 'viktor', t: '(Una media sonrisa.) Eso mismo pienso yo. La magia solo es ciencia que aún no entendemos.' },
          { s: 'heimerdinger', t: 'Ciencia… Bueno, bueno. Quizá. Pero la paciencia también es una ciencia, joven. Una que nadie de vuestra edad estudia.' },
        ], next: 'b2' },
        b_razon: { bg: 'academia', lines: [
          { s: 'heimerdinger', t: '¡Por fin alguien sensato! Llevo un siglo diciéndolo. Un siglo.' },
          { s: 'viktor', t: '(En voz baja, solo para ti.) La prudencia es fácil cuando vas a vivir trescientos años. Algunos no tenemos tanto tiempo.' },
        ], next: 'b2' },
        b_viktor: { bg: 'academia', lines: [
          { s: 'viktor', t: '(Levanta la vista.) Viktor. Ayudante del profesor. Nací abajo, en Zaun. No suelo decirlo en voz alta en estos pasillos.' },
          { s: 'viktor', t: 'Las notas de Talis… son extraordinarias. Ha conseguido que una runa responda a una fórmula. Aunque nadie quiera verlo.' },
        ], next: 'b2' },
        b2: { bg: 'academia', lines: [
          { s: 'heimerdinger', t: 'Hágame un favor, {name}: baje al taller de Talis y recoja sus apuntes. Queda expulsado. Y que no vuelva a acercarse a un cristal.' },
          { s: 'heimerdinger', t: '(Más bajito.) Es un muchacho brillante. Por eso me da miedo.' },
          { s: 'viktor', t: 'Si vas, ve con cuidado. Un hombre al que le acaban de quitar su sueño muerde.' },
        ], next: 'c' },
        c: { bg: 'taller-jayce', lines: [
          { s: 'narrador', t: 'El taller de Jayce es un caos de pizarras, cristales rotos y una pared con un agujero del tamaño de una puerta. Huele a quemado.' },
          { s: 'jayce', t: '¿Vienes a cerrarme el taller tú también? Adelante. Que vean cómo entierran el futuro de Piltover.' },
          { s: 'jayce', t: 'Cuando era niño, una maga me salvó la vida en una tormenta de nieve. Desde entonces solo quiero una cosa: que la magia sea de todos. No solo de unos pocos.' },
          { s: 'jayce', t: 'Solo necesito estabilizar las runas. Y nadie quiere ayudarme. Me han robado la mitad del material y la otra mitad me la van a confiscar.' },
        ], choices: [
          { t: 'Ayudar a Jayce en secreto con sus cálculos (Ingenio 2).', req: { stat: 'ingenio', min: 2 }, next: 'd_ayuda', fx: { aff: { jayce: 3, viktor: 1 }, rep: { piltover: 1 }, flags: ['ayuda_hextec'] } },
          { t: 'Presentarle a Viktor: «Él sí cree en ti».', next: 'd_presenta', fx: { aff: { jayce: 2, viktor: 3 }, flags: ['une_jayce_viktor'] } },
          { t: 'Informar a Heimerdinger de lo que trama.', next: 'd_informa', fx: { aff: { heimerdinger: 2, jayce: -3 }, flags: ['delata_jayce'] } },
        ] },
        d_ayuda: { bg: 'taller-jayce', lines: [
          { s: 'narrador', t: 'Pasáis la noche entre fórmulas, tazas de café frío y pruebas que acaban en chispas. Jayce piensa en voz alta; tú le corriges las sumas.' },
          { s: 'jayce', t: 'Si el cristal es el motor, la runa es el volante. Lo que me falta es el freno.' },
          { s: 'yo', t: 'O una runa que lo contenga. Una jaula para la energía.' },
          { s: 'narrador', t: 'Al amanecer, una gema flota sobre la mesa emitiendo una luz azul estable. No tiembla. No estalla.' },
          { s: 'jayce', t: 'Funciona… ¡FUNCIONA! {name}, acabas de hacer historia conmigo. Hextec. Lo llamaremos hextec.' },
        ], next: 'd2' },
        d_presenta: { bg: 'taller-jayce', lines: [
          { s: 'viktor', t: '(Tras leer las pizarras en silencio un buen rato.) Tu error está aquí, en la tercera runa. Si la alimentas de forma inversa…' },
          { s: 'jayce', t: '¿Cómo no lo vi antes? ¿Quién eres?' },
          { s: 'viktor', t: 'Alguien que también quiere cambiar el mundo. Y que no tiene paciencia para esperar al profesor.' },
          { s: 'jayce', t: 'Viktor, ¿quieres ser mi socio?' },
          { s: 'narrador', t: 'Sin saberlo, acabas de juntar a los padres de la hextec.' },
        ], next: 'd2' },
        d_informa: { bg: 'academia', lines: [
          { s: 'heimerdinger', t: '(Con las manos cruzadas sobre la mesa.) Has hecho lo correcto. Aunque no lo parezca. Lo correcto rara vez lo parece.' },
          { s: 'viktor', t: '(Al salir, sin mirarte.) Lo correcto. Claro. Aquí arriba todo es correcto hasta que deja de serlo.' },
          { s: 'narrador', t: 'Esa noche, Jayce sigue trabajando a escondidas. Y alguien llama a su puerta: Viktor, con las notas que el decano iba a quemar.' },
        ], next: 'd2' },
        d2: { bg: 'mansion-kiramman', lines: [
          { s: 'narrador', t: 'Días después, Jayce comparece ante el Consejo por la explosión. Le salva una voz inesperada: la consejera Mel Medarda, que pide verle en privado.' },
          { s: 'narrador', t: 'En una fiesta en la mansión Kiramman, entre copas y violines, Jayce te busca entre la gente.' },
          { s: 'jayce', t: 'La consejera Medarda me ha ofrecido fondos. Muchos. Más de los que he visto nunca. Dice que la hextec puede ser el futuro de Piltover.' },
          { s: 'jayce', t: 'Pero tengo la sensación de que, si acepto, ya no será solo mía. ¿Tú qué harías?' },
        ], choices: [
          { t: '«Acepta. Los sueños sin dinero se quedan en sueños.»', next: 'e', fx: { aff: { jayce: 1 }, rep: { piltover: 1 } } },
          { t: '«Pregúntale qué quiere a cambio.» (Ingenio 2)', req: { stat: 'ingenio', min: 2 }, next: 'e', fx: { aff: { jayce: 2 }, stats: { ingenio: 1 } } },
          { t: '«Habla con Viktor antes de decidir.»', next: 'e', fx: { aff: { viktor: 2, jayce: 1 } } },
        ] },
        e: { bg: 'academia', lines: [
          { s: 'narrador', t: 'El robo del apartamento de Talis sigue en boca de todos. Unos ladrones de Zaun… y una explosión que dejó una ciudad entera en vilo.' },
          { s: 'viktor', t: 'Dicen que eran niños. Niños de abajo. (Aprieta el bastón.) Piltover los castigará como si fueran un ejército.' },
          { s: 'narrador', t: 'Y una consejera noxiana empieza a interesarse por tu nombre.' },
        ], end: true },
      },
    },
    {
      id: 'p2', route: 'piltover', title: 'Capítulo 2 · Mecenas',
      intro: 'El Consejo debate. La hextec podría ser el mayor logro de Piltover… o su ruina. El dinero, como siempre, decide.',
      unlocks: ['mel', 'cassandra'],
      start: 'a',
      nodes: {
        a: { bg: 'consejo', lines: [
          { s: 'narrador', t: 'La Sala del Consejo es un círculo de mármol y madera noble bajo una cúpula de cristal. Siete sillas. Siete familias. Ningún asiento para Zaun.' },
          { s: 'mel', t: 'Tú debes de ser {name}. He oído cosas interesantes de ti. Sobre todo, que sabes estar en la habitación correcta.' },
          { s: 'cassandra', t: 'Consejera Medarda, aquí se viene a votar, no a reclutar.' },
          { s: 'mel', t: 'Consejera Kiramman, todo voto empieza con una conversación. Usted lo sabe mejor que nadie: su familia lleva generaciones conversando.' },
          { s: 'cassandra', t: '(Con una sonrisa de hielo.) Y por eso seguimos aquí.' },
        ], choices: [
          { t: 'Ganarte a Mel con elegancia (Carisma 2).', req: { stat: 'carisma', min: 2 }, next: 'b_mel', fx: { aff: { mel: 3 }, rep: { piltover: 1 }, flags: ['aliado_mel'] } },
          { t: 'Ponerte del lado de Cassandra: prudencia.', next: 'b_cass', fx: { aff: { cassandra: 3, mel: -1 } } },
          { t: 'Mencionar a tu familia.', req: { flag: 'familia_famosa' }, next: 'b_familia', fx: { aff: { mel: 1, cassandra: 1 }, rep: { piltover: 2 } } },
        ] },
        b_mel: { bg: 'consejo', lines: [
          { s: 'mel', t: 'Me gustas. Piltover tiene muchos inventores y muy pocos visionarios.' },
          { s: 'mel', t: 'Mi madre decía que el mundo es de quien lo toma. Yo prefiero que el mundo venga a mí por voluntad propia. Es más barato y dura más.' },
          { s: 'mel', t: 'Ayúdame a convencer al Consejo y la hextec tendrá fondos. Y tú, un sitio en mi mesa.' },
        ], next: 'b2' },
        b_cass: { bg: 'consejo', lines: [
          { s: 'cassandra', t: 'Gracias. Alguien tiene que recordar que el progreso sin control acaba en tragedia.' },
          { s: 'cassandra', t: 'Yo estaba en este consejo cuando Vander llenó el puente de cadáveres. No quiero ver otro día así. Ni de un lado ni del otro.' },
        ], next: 'b2' },
        b_familia: { bg: 'consejo', lines: [
          { s: 'yo', t: 'Soy {name}, de la familia {family}. Creo que eso os dice de qué lado está la historia.' },
          { s: 'mel', t: '(Sonríe.) Un apellido es una herramienta. Úsalo bien.' },
          { s: 'cassandra', t: 'Y no lo gastes en causas pequeñas. Los apellidos se desgastan.' },
        ], next: 'b2' },
        b2: { bg: 'mansion-kiramman', lines: [
          { s: 'narrador', t: 'Esa noche, Cassandra te invita a cenar en la mansión Kiramman. La mesa es larga; la conversación, corta.' },
          { s: 'cassandra', t: 'Mi hija Caitlyn quiere ser ejecutora. Podría ser lo que quisiera en esta ciudad y elige llevar uniforme y un rifle.' },
          { s: 'cassandra', t: 'Mi marido dice que la dejemos. Que es terca como yo. (Suspira.) ¿Tú qué opinas? Sé sincer{g:o|a|e}.' },
        ], choices: [
          { t: '«Si quiere proteger la ciudad, déjala. Piltover necesita gente así.»', next: 'c', fx: { aff: { cassandra: 1, caitlyn: 1 } } },
          { t: '«Tiene razón en preocuparse. Abajo no se juega.»', next: 'c', fx: { aff: { cassandra: 2 } } },
          { t: '«Su hija va a hacer lo que quiera. Mejor que lo haga con su apoyo.» (Carisma 2)', req: { stat: 'carisma', min: 2 }, next: 'c', fx: { aff: { cassandra: 2, caitlyn: 1 } } },
        ] },
        c: { bg: 'consejo', lines: [
          { s: 'narrador', t: 'Llega el día. Jayce se presenta ante el Consejo con una gema hextec flotando sobre un pedestal. La sala entera contiene el aliento.' },
          { s: 'jayce', t: 'Durante siglos, la magia ha sido un privilegio de unos pocos. Hoy os traigo una forma de que sea de todos. Lo llamamos hextec.' },
          { s: 'heimerdinger', t: 'Consejeros, os lo ruego: prudencia. Lo que no se entiende, no se usa. Dadnos tiempo. Diez años. Veinte. ¿Qué son veinte años?' },
          { s: 'narrador', t: 'Cassandra asiente. Mel calla y observa. La votación está igualada.' },
          { s: 'jayce', t: '(Te busca con la mirada.) {name}, di algo. Te escucharán.' },
        ], choices: [
          { t: 'Defender la hextec: «Es el futuro de todos».', next: 'd_si', fx: { aff: { jayce: 2, mel: 2, heimerdinger: -2 }, rep: { piltover: 1 }, flags: ['vota_hextec'] } },
          { t: 'Pedir que también beneficie a Zaun.', next: 'd_zaun', fx: { aff: { viktor: 3, cassandra: -1 }, rep: { zaun: 2 }, flags: ['hextec_zaun'] } },
          { t: 'Apoyar a Heimerdinger: «Aún no estamos preparados».', next: 'd_no', fx: { aff: { heimerdinger: 3, cassandra: 1, jayce: -2 } } },
        ] },
        d_si: { bg: 'consejo', lines: [
          { s: 'yo', t: 'Cada generación de Piltover ha tenido miedo de algo nuevo. Y cada generación se ha equivocado. La hextec es el futuro de todos.' },
          { s: 'narrador', t: 'La votación se inclina. La hextec es aprobada. Piltover aplaude; Heimerdinger guarda silencio y recoge sus papeles.' },
          { s: 'mel', t: '(Al pasar a tu lado.) Bonito discurso. Los discursos bonitos mueven fortunas.' },
        ], next: 'e' },
        d_zaun: { bg: 'consejo', lines: [
          { s: 'yo', t: 'Si la hextec es de todos, que lo sea de verdad. Que llegue también a Zaun.' },
          { s: 'narrador', t: 'Un murmullo incómodo recorre la sala. Alguien carraspea. Alguien se ríe. Pero Viktor, desde el fondo, asiente con una sonrisa cansada.' },
          { s: 'viktor', t: '(Luego, en el pasillo.) Gracias. Nadie dice eso aquí arriba. Ni siquiera Jayce, aunque lo piense.' },
        ], next: 'e' },
        d_no: { bg: 'consejo', lines: [
          { s: 'heimerdinger', t: 'Sabias palabras. Aunque me temo que el progreso no sabe esperar.' },
          { s: 'narrador', t: 'Cassandra también te lo agradece con un gesto. Por un momento parece que la prudencia va a ganar.' },
          { s: 'narrador', t: 'Pero Mel mueve sus fichas: un susurro aquí, una promesa allá. La hextec se aprueba igualmente, por un voto.' },
          { s: 'mel', t: 'No te lo tomes como algo personal, {name}. El progreso no sabe esperar.' },
        ], next: 'e' },
        e: { bg: 'mansion-kiramman', lines: [
          { s: 'cassandra', t: 'Mi hija Caitlyn insiste en investigar el robo del taller por su cuenta. Es terca como su padre. Y como yo.' },
          { s: 'cassandra', t: 'Si la ves… vigílala por mí. No se lo digas. Me odiaría.' },
        ], end: true },
      },
    },
    {
      id: 'p3', route: 'piltover', title: 'Capítulo 3 · Placa y pólvora',
      intro: 'Siete años después. Piltover vive su edad dorada. Pero alguien ataca los envíos hextec, y el Brillo sube por el puente.',
      unlocks: ['caitlyn'],
      start: 'a',
      nodes: {
        a: { bg: 'piltover', lines: [
          { s: 'narrador', t: 'Siete años de hextec. Piltover brilla: farolas azules, dirigibles, puertas automáticas. Y en las esquinas, carteles que piden «orden».' },
          { s: 'caitlyn', t: 'Tú conociste a mi madre en el Consejo, ¿verdad? Bien. Necesito a alguien que no lleve placa… o que no tenga miedo de ensuciarla.' },
          { s: 'caitlyn', t: 'Alguien está robando hextec y bajándola a Zaun. Y el sheriff Marcus no quiere que lo investigue. Me ha puesto a patrullar el barrio de los museos. El de los museos.' },
          { s: 'caitlyn', t: 'Si algo me enseñó mi padre es que, cuando alguien insiste tanto en que no mires, es justo ahí donde hay que mirar.' },
        ], choices: [
          { t: 'Ayudar a Caitlyn a revisar los informes (Ingenio 2).', req: { stat: 'ingenio', min: 2 }, next: 'b_informes', fx: { aff: { caitlyn: 3 }, flags: ['pistas_cait'] } },
          { t: 'Hablar con Marcus para ganar tiempo (Carisma 2).', req: { stat: 'carisma', min: 2 }, next: 'b_marcus', fx: { aff: { caitlyn: 1 } } },
          { t: '«No me meto en asuntos de ejecutores.»', next: 'b_no', fx: { aff: { caitlyn: -2 } } },
        ] },
        b_informes: { bg: 'ejecutores', lines: [
          { s: 'narrador', t: 'Os encerráis en el archivo de la jefatura con una lámpara y un termo de té. Caitlyn subraya; tú cruzas fechas.' },
          { s: 'caitlyn', t: 'Robo en la calle del Reloj. Robo en el muelle tres. Robo en el taller de Talis. Siempre de noche, siempre sin testigos.' },
          { s: 'narrador', t: 'Entre papeles encontráis un patrón: cada robo coincide con un pago a la jefatura. Firma: M.' },
          { s: 'caitlyn', t: 'Marcus… lo sabía. Lo sabía y no quería saberlo.' },
        ], next: 'b2' },
        b_marcus: { bg: 'ejecutores', lines: [
          { s: 'narrador', t: 'Marcus te recibe en su despacho con una sonrisa de foto. Te pide que convenzas a la señorita Kiramman de que lo deje: las buenas intenciones aquí abajo matan gente.' },
          { s: 'narrador', t: 'Te fijas: le tiembla la mano al decirlo. Encima de la mesa hay una foto de una niña. Marcus no es un villano. Es un hombre asustado.' },
          { s: 'caitlyn', t: '(Cuando se lo cuentas.) Un hombre asustado con una placa es más peligroso que un criminal. Gracias, {name}.' },
        ], next: 'b2' },
        b_no: { bg: 'piltover', lines: [
          { s: 'caitlyn', t: 'Muy bien. Lo haré sola. Como siempre.' },
          { s: 'narrador', t: 'Al día siguiente, Caitlyn vuelve a buscarte. Tiene ojeras, un mapa lleno de alfileres y nadie más a quien recurrir.' },
          { s: 'caitlyn', t: 'He encontrado algo. Y me da igual lo que pienses de los ejecutores: esto es más grande que yo.' },
        ], next: 'b2' },
        b2: { bg: 'mansion-kiramman', lines: [
          { s: 'cassandra', t: '(En la escalinata de la mansión, cuando ve llegar a su hija contigo.) Caitlyn. Me han dicho que has estado en el archivo de la jefatura a las tres de la mañana.' },
          { s: 'caitlyn', t: 'Madre, no es el momento.' },
          { s: 'cassandra', t: 'Nunca es el momento contigo. (Te mira.) Supongo que tú eres quien la acompaña. Al menos no va sola.' },
        ], choices: [
          { t: '«No la dejaré sola, consejera.»', next: 'c', fx: { aff: { cassandra: 2, caitlyn: 1 } } },
          { t: '«Su hija tiene razón. Hay corrupción en la jefatura.»', next: 'c', fx: { aff: { caitlyn: 2, cassandra: -1 } } },
          { t: 'Quedarte callad{g:o|a|e}: es cosa de familia.', next: 'c', fx: { stats: { sigilo: 1 } } },
        ] },
        c: { bg: 'stillwater', lines: [
          { s: 'caitlyn', t: 'Hay una presa en Stillwater que sabe quién es Silco. Lleva siete años ahí. Se llama Vi. Si la saco de aquí, puede llevarnos hasta él.' },
          { s: 'narrador', t: 'Stillwater es una prisión sobre el agua, húmeda y gris. Los guardias miran a Caitlyn como a una niña con un juguete caro.' },
          { s: 'narrador', t: 'La celda se abre. Una chica de pelo rosa, con un tatuaje en la cara, te mira de arriba abajo con los nudillos vendados.' },
          { s: 'vi', t: '¿Y tú quién eres? ¿La niñera de la ejecutora?' },
        ], choices: [
          { t: '«Alguien que también quiere ver caer a Silco.»', next: 'd_silco', fx: { aff: { vi: 2 } } },
          { t: 'Hacer una broma sobre su tatuaje.', next: 'd_broma', fx: { aff: { vi: 1, caitlyn: 1 } } },
          { t: 'Tratarla como a una presa peligrosa.', next: 'd_presa', fx: { aff: { vi: -3 } } },
        ] },
        d_silco: { bg: 'stillwater', lines: [
          { s: 'vi', t: '(Al oír el nombre se le endurece la cara.) Silco. ¿Sigue vivo?' },
          { s: 'vi', t: 'Vale. Me caes bien. Un poco. No te emociones.' },
        ], next: 'd2' },
        d_broma: { bg: 'stillwater', lines: [
          { s: 'yo', t: 'Bonito tatuaje. ¿Es por si se te olvida cómo te llamas?' },
          { s: 'vi', t: '«VI». Sí, ja. Qué graciosill{g:o|a|e}. Es el número seis, genio. Bueno, no. Pero tú ya me entiendes.' },
          { s: 'caitlyn', t: '(Contiene una sonrisa.) Vámonos antes de que se arrepientan.' },
        ], next: 'd2' },
        d_presa: { bg: 'stillwater', lines: [
          { s: 'vi', t: 'Lo pillo. Arriba todos sois iguales.' },
          { s: 'caitlyn', t: '{name}, por favor. La necesitamos. (A Vi.) Disculpa. No todos somos así.' },
          { s: 'vi', t: '(Mira a Caitlyn de otra forma.) …Hmm. Eso ya lo veremos, Cupcake.' },
        ], next: 'd2' },
        d2: { bg: 'puente', lines: [
          { s: 'narrador', t: 'En el carruaje de vuelta, Vi mira por la ventanilla las luces de Piltover como si fueran de otro planeta.' },
          { s: 'vi', t: 'Siete años. Todo brilla más. Y huele igual de mal por debajo.' },
          { s: 'caitlyn', t: '¿Por qué te encerraron? El expediente está… incompleto.' },
          { s: 'vi', t: '(Silencio.) Porque perdí a toda mi familia en una noche. Y la que quedaba se la llevó Silco. ¿Contenta?' },
          { s: 'caitlyn', t: '(Muy bajito.) No. Lo siento.' },
        ], choices: [
          { t: 'Romper el silencio: «Encontraremos a tu hermana».', next: 'e', fx: { aff: { vi: 2 } } },
          { t: 'Dejar que el silencio haga su trabajo.', next: 'e', fx: { aff: { vi: 1, caitlyn: 1 } } },
        ] },
        e: { bg: 'puente', lines: [
          { s: 'narrador', t: 'Marcus os ve salir de Stillwater desde una ventana de la jefatura. No dice nada. Solo coge el teléfono de tubo.' },
          { s: 'narrador', t: 'Al día siguiente, alguien en Zaun sabe que Vi ha vuelto.' },
        ], end: true },
      },
    },
    {
      id: 'p4', route: 'piltover', title: 'Capítulo 4 · El Día del Progreso',
      intro: 'Las hexpuertas abren. Piltover celebra. En el laboratorio, Viktor tose sangre y Sky le sostiene la mano.',
      unlocks: [],
      start: 'a',
      nodes: {
        a: { bg: 'hexpuertas', lines: [
          { s: 'narrador', t: 'Música, confeti y barcos que cruzan el istmo en un destello azul. El mundo entero mira a Piltover.' },
          { s: 'jayce', t: '¡{name}! Ven, sube al estrado. Hoy es el día que soñamos.', cond: { flag: 'ayuda_hextec' } },
          { s: 'jayce', t: 'Hoy cambia la historia, {name}. Deberías verlo desde primera fila.', cond: { notFlag: 'ayuda_hextec' } },
          { s: 'mel', t: 'Disfrútalo. Los días de gloria son cortos y las facturas, largas.' },
          { s: 'jayce', t: '(Ensaya el discurso en voz baja, nervioso.) «El progreso no es un destino…» No, no. «El progreso es…» ¿Cómo empezaba?' },
        ], choices: [
          { t: '«Empieza por Viktor. Sin él no estarías aquí.»', next: 'a2', fx: { aff: { viktor: 2, jayce: 1 } } },
          { t: '«Empieza por Zaun. Que se oiga abajo.»', next: 'a2', fx: { aff: { jayce: 1 }, rep: { zaun: 1 } } },
          { t: '«Empieza por ti. Hoy te lo has ganado.»', next: 'a2', fx: { aff: { jayce: 2, mel: 1 } } },
        ] },
        a2: { bg: 'hexpuertas', lines: [
          { s: 'jayce', t: '(Ante la multitud.) Piltover se fundó por gente que miró al horizonte y decidió que el mundo podía ser mejor. Hoy, ese horizonte está más cerca.' },
          { s: 'narrador', t: 'Aplausos. Fuegos azules. Mel aplaude con dos dedos. Cassandra, desde la primera fila, asiente con orgullo contenido.' },
          { s: 'mel', t: '(Inclinándose hacia ti.) Aprende algo de hoy, {name}: el hombre que habla no es el que manda. Es el que cobra las ovaciones.' },
        ], next: 'b' },
        b: { bg: 'academia', lines: [
          { s: 'narrador', t: 'Una chica de gafas, Sky, te tira de la manga entre la multitud. Viktor no ha venido a la fiesta. Está en el laboratorio con… eso. Y ella no sabe qué hacer.' },
          { s: 'narrador', t: 'En el laboratorio, entre papeles manchados de sangre, algo se mueve dentro de una vitrina: una masa de cristales azules que se retuerce como si respirara.' },
          { s: 'viktor', t: 'El Hexcore. Mira cómo se mueve. Aprende, {name}. Se adapta. Podría curar cualquier cosa.' },
          { s: 'viktor', t: '(Tose en un pañuelo y lo esconde rápido.) Incluso a mí.' },
        ], choices: [
          { t: 'Animarle a seguir: «Si puede salvarte, hazlo».', next: 'c_sigue', fx: { aff: { viktor: 3, heimerdinger: -1 }, flags: ['impulsa_hexcore'] } },
          { t: 'Pedirle que se detenga (Carisma 2).', req: { stat: 'carisma', min: 2 }, next: 'c_para', fx: { aff: { viktor: -1, heimerdinger: 2 }, flags: ['frena_hexcore'] } },
          { t: 'Analizar el Hexcore tú mism{g:o|a|e} (Ingenio 3).', req: { stat: 'ingenio', min: 3 }, next: 'c_analiza', fx: { aff: { viktor: 2 }, stats: { ingenio: 1 }, flags: ['entiende_hexcore'] } },
        ] },
        c_sigue: { bg: 'academia', lines: [
          { s: 'viktor', t: 'Gracias. Todos quieren que espere. Jayce tiene sus discursos, el profesor tiene su siglo. Yo no tengo tiempo para esperar.' },
          { s: 'narrador', t: 'Sky te mira con preocupación desde la puerta. No dice nada. Su silencio pesa más que cualquier palabra.' },
        ], next: 'd0' },
        c_para: { bg: 'academia', lines: [
          { s: 'yo', t: 'Viktor, mírame. Esto no es un experimento. Es tu vida. Si sale mal, no hay segundo intento.' },
          { s: 'viktor', t: 'Hablas como el profesor. (Suspira.) Lo pensaré. Por Sky.' },
        ], next: 'd0' },
        c_analiza: { bg: 'academia', lines: [
          { s: 'narrador', t: 'Las runas laten como un corazón. No es solo energía: hay algo parecido a una voluntad. Y tiene hambre.' },
          { s: 'yo', t: 'Viktor, esto no obedece. Responde. Ten cuidado con lo que le pides.' },
          { s: 'viktor', t: '(Fascinado.) Entonces le pediré que me enseñe.' },
        ], next: 'd0' },
        d0: { bg: 'hexpuertas', lines: [
          { s: 'narrador', t: 'De vuelta en la fiesta, Caitlyn aparece entre la gente, sin uniforme, con Vi a su lado. Vi lleva una capucha y mira a todo el mundo como si fueran a atacarle.' },
          { s: 'vi', t: 'Así que esto es el Día del Progreso. Mucho confeti para tapar el olor.' },
          { s: 'caitlyn', t: 'Vi. Por favor. Al menos finge que no odias a todo el mundo.' },
          { s: 'vi', t: 'No odio a todo el mundo. (Te mira.) A ti, por ejemplo, solo un poco.' },
        ], next: 'd' },
        d: { bg: 'puente', lines: [
          { s: 'narrador', t: 'Una explosión en la ceremonia. Una figura de trenzas azules se ríe desde los tejados antes de desaparecer hacia Zaun.' },
          { s: 'vi', t: '(Se queda blanca.) Esa risa… Esa risa la conozco.' },
          { s: 'caitlyn', t: 'Era ella. Jinx. Vi dice que es su hermana. Tenemos que bajar, {name}. Ya.' },
        ], end: true },
      },
    },
    {
      id: 'p5', route: 'piltover', title: 'Capítulo 5 · Bajar',
      intro: 'Por primera vez, cruzas el puente hacia abajo. El aire pica, las luces son verdes, y nadie te sonríe.',
      unlocks: ['vi', 'ekko'],
      start: 'a',
      nodes: {
        a: { bg: 'callejones', lines: [
          { s: 'vi', t: 'Bienvenid{g:o|a|e} a Zaun. Regla número uno: no mires a nadie a los ojos. Regla número dos: si te miran, corre.' },
          { s: 'caitlyn', t: 'Regla número tres: no te separes de nosotras.' },
          { s: 'vi', t: 'Y regla número cuatro: Cupcake, quítate ese abrigo. Pareces un anuncio de perfume.' },
          { s: 'caitlyn', t: '(Mira su abrigo, ofendida.) Es lana de Freljord.' },
        ], choices: [
          { t: 'Intentar integrarte con la gente (Carisma 2).', req: { stat: 'carisma', min: 2 }, next: 'b_integra', fx: { aff: { vi: 2 }, rep: { zaun: 2 } } },
          { t: 'Mantener la mano cerca del arma (Valor 2).', req: { stat: 'valor', min: 2 }, next: 'b_arma', fx: { aff: { caitlyn: 1 }, rep: { zaun: -1 } } },
          { t: 'Pasar desapercibid{g:o|a|e} (Sigilo 2).', req: { stat: 'sigilo', min: 2 }, next: 'b_sigilo', fx: { aff: { vi: 1 }, stats: { sigilo: 1 } } },
          { t: 'Seguir a Vi sin abrir la boca.', next: 'b_sigue', fx: { aff: { vi: 1 } } },
        ] },
        b_sigue: { bg: 'callejones', lines: [
          { s: 'vi', t: 'Bien. Callad{g:o|a|e} y con los ojos abiertos. Aprendes rápido.' },
        ], next: 'b2' },
        b_integra: { bg: 'callejones', lines: [
          { s: 'narrador', t: 'Compras un pincho de algo que prefieres no preguntar y charlas con la vendedora. Te cuenta que Silco se esconde en La Última Gota y que su «hija» tiene a medio Zaun aterrorizado.' },
          { s: 'vi', t: 'Vaya. Tú sí que sabes.' },
          { s: 'caitlyn', t: '(Mordiendo con cautela el pincho que le das.) Esto sabe a… No quiero saberlo.' },
        ], next: 'b2' },
        b_arma: { bg: 'callejones', lines: [
          { s: 'narrador', t: 'Los zaunitas se apartan a tu paso. Y te miran con rabia. Un niño escupe a tus pies y sale corriendo.' },
          { s: 'vi', t: 'Así es como nos ven a todos los de arriba. Ahora lo sabes.' },
          { s: 'caitlyn', t: '(En voz baja.) Lo sé. Llevo años sabiéndolo. Por eso estoy aquí.' },
        ], next: 'b2' },
        b_sigilo: { bg: 'callejones', lines: [
          { s: 'narrador', t: 'Te mueves entre sombras y vapores. Escuchas a dos matones hablar de un árbol donde se esconden «los críos de las máscaras».' },
          { s: 'vi', t: '(Cuando se lo cuentas.) ¿Un árbol? En Zaun no hay árboles. (Piensa.) Bueno. Ahora sí, por lo visto.' },
        ], next: 'b2' },
        b2: { bg: 'ultima-gota', lines: [
          { s: 'narrador', t: 'Vi se para delante de La Última Gota. El cartel es otro. La puerta es otra. La mira como quien mira una tumba.' },
          { s: 'vi', t: 'Aquí me crié. Vander servía cerveza ahí, Powder se escondía debajo de esa mesa, Mylo hacía trampas a las cartas…' },
          { s: 'caitlyn', t: '(Le pone una mano en el hombro.) Vi…' },
          { s: 'vi', t: 'Estoy bien. (No lo está.) Silco está ahí dentro. Lo sé.' },
        ], choices: [
          { t: '«Si entras ahora, te matarán. Necesitamos aliados.»', next: 'c', fx: { aff: { caitlyn: 1, vi: 1 } } },
          { t: '«Entremos. Yo te cubro.» (Valor 2)', req: { stat: 'valor', min: 2 }, next: 'c', fx: { aff: { vi: 2 }, stats: { valor: 1 } } },
          { t: 'Abrazar a Vi sin decir nada.', next: 'c', fx: { aff: { vi: 2 } } },
        ] },
        c: { bg: 'arbol', lines: [
          { s: 'narrador', t: 'Antes de que podáis decidir, una emboscada. Figuras con máscaras sobre aerotablas os rodean y os llevan a la fuerza a través de los túneles.' },
          { s: 'narrador', t: 'Cuando os quitan las vendas, estáis bajo un árbol gigante que brilla en la oscuridad. El líder se quita la máscara.' },
          { s: 'ekko', t: '¿Vi? ¿Estás viva? ¿Siete años desaparecida… y vuelves con ejecutores a mi casa?' },
          { s: 'vi', t: '¿Ekko? ¡Mírate! La última vez que te vi me llegabas por aquí.' },
          { s: 'ekko', t: 'La última vez que te vi, Vander estaba vivo. Han cambiado muchas cosas.' },
        ], choices: [
          { t: '«Venimos a parar a Silco. Igual que tú.»', next: 'd_alianza', fx: { aff: { ekko: 3 }, rep: { zaun: 1 }, flags: ['alianza_luciernagas'] } },
          { t: 'Proponer un pacto Piltover-Luciérnagas (Carisma 3).', req: { stat: 'carisma', min: 3 }, next: 'd_pacto', fx: { aff: { ekko: 3, caitlyn: 2 }, rep: { zaun: 2, piltover: 1 }, flags: ['alianza_luciernagas', 'pacto'] } },
          { t: 'Hablarle de la hextec para Zaun.', req: { flag: 'hextec_zaun' }, next: 'd_hextec', fx: { aff: { ekko: 2, viktor: 1 }, rep: { zaun: 2 }, flags: ['alianza_luciernagas'] } },
          { t: 'Amenazar con traer a los ejecutores.', next: 'd_amenaza', fx: { aff: { ekko: -4, vi: -2 }, rep: { zaun: -2, piltover: 1 } } },
        ] },
        d_alianza: { bg: 'arbol', lines: [
          { s: 'ekko', t: '(Mira a Vi, luego a ti.) Vale. Por Vi. Pero si me traicionas, te tiro del árbol yo mismo.' },
          { s: 'caitlyn', t: 'Entendido. Yo tampoco me fío de mí cuando llevo esta placa.' },
        ], next: 'd2' },
        d_pacto: { bg: 'arbol', lines: [
          { s: 'yo', t: 'Si Silco cae, el Consejo tendrá que escuchar a Zaun. Pero solo si estamos juntos. Una Kiramman y las Luciérnagas. Eso no lo ignoran ni arriba.' },
          { s: 'ekko', t: '(Silencio largo.) Es la primera vez que alguien de arriba habla de «juntos». Trato hecho.' },
          { s: 'caitlyn', t: 'Haré que mi madre lo oiga. Te lo prometo.' },
        ], next: 'd2' },
        d_hextec: { bg: 'arbol', lines: [
          { s: 'ekko', t: '¿Hextec para Zaun? ¿Lo dijiste en el Consejo? ¿En voz alta?' },
          { s: 'ekko', t: 'Si eso es verdad… igual no todos los de arriba son iguales.' },
        ], next: 'd2' },
        d_amenaza: { bg: 'arbol', lines: [
          { s: 'ekko', t: 'Fuera de mi árbol. Vi, tú puedes quedarte. Tu amig{g:o|a|e}, no.' },
          { s: 'vi', t: '(Te mira con decepción.) ¿En serio, {name}? ¿Aquí?' },
        ], next: 'd2' },
        d2: { bg: 'arbol', lines: [
          { s: 'ekko', t: '(Más tarde, a solas con Vi, aunque tú lo oyes todo.) Vi, tienes que saber una cosa. Powder… Jinx… trabaja para Silco. Es su mano derecha. Y está mal. Muy mal.' },
          { s: 'vi', t: 'Lo sé. Vi la explosión del puente. (Se le quiebra la voz.) Es culpa mía, Ekko. Yo la llamé gafe.' },
          { s: 'ekko', t: 'No. Fue culpa de Silco. Y vamos a pararle. Juntos.' },
        ], next: 'e' },
        e: { bg: 'ultima-gota', lines: [
          { s: 'narrador', t: 'Esa noche, Jinx roba una gema hextec enorme del laboratorio de Jayce. Silco promete que mañana Piltover escuchará a Zaun.' },
          { s: 'narrador', t: 'Mañana el Consejo se reúne. Mañana todo cambia.' },
        ], end: true },
      },
    },

    {
      id: 'z6', route: 'zaun', title: 'Capítulo 6 · El foso de Sevika',
      intro: 'Silco prepara algo grande. Sevika sabe qué es, pero en Zaun la información se gana a puñetazos.',
      unlocks: [],
      start: 'a',
      nodes: {
        a: { bg: 'foso', lines: [
          { s: 'narrador', t: 'El foso huele a sudor y a Brillo. La multitud golpea las rejas cuando entras. En el centro, sobre el serrín, hay manchas que nadie se molesta en limpiar.' },
          { s: 'sevika', t: '(Apoyada en la barandilla, juega a las cartas con la mano buena.) Mira quién ha venido a mi salón.' },
          { s: 'sevika', t: '¿Quieres saber qué trama Silco, {name}? Gánatelo. Aquí abajo, la palabra vale lo que valen tus puños.' },
          { s: 'narrador', t: 'Alguien de la grada grita tu nombre. Otros ya apuestan contra ti.' },
        ], choices: [
          { t: 'Saltar al foso y pelear.', next: 'b_gana', game: { id: 'foso', win: 'b_gana', lose: 'b_pierde', winFx: { aff: { sevika: 3 }, rep: { zaun: 1 }, flags: ['sabe_cohete'] } }, fx: {} },
          { t: 'Convencerla con palabras (Carisma 3).', req: { stat: 'carisma', min: 3 }, next: 'b_labia', fx: { aff: { sevika: 1 }, flags: ['sabe_cohete'] } },
          { t: '«No peleo para entretener a nadie.»', next: 'b_pierde', fx: { aff: { sevika: -1 } } },
        ] },
        b_gana: { bg: 'foso', lines: [
          { s: 'sevika', t: '(Escupe sangre y se ríe.) Vale, vale. Tienes agallas. Me recuerdas a alguien.' },
          { s: 'sevika', t: 'Te lo diré: Jinx ha construido un cohete con la gema que robó. Una cosa enorme, pintada de colores, con dientes.' },
          { s: 'sevika', t: 'Silco quiere usarlo para obligar al Consejo a reconocer Zaun. Jinx… quiere otra cosa. Y eso me preocupa.' },
        ], next: 'b2' },
        b_labia: { bg: 'foso', lines: [
          { s: 'yo', t: 'Si lo que planea Silco sale mal, el foso será lo primero que arda. Y tú lo sabes mejor que nadie.' },
          { s: 'sevika', t: '(Silencio. Deja las cartas.) …Un cohete. Con la gema de Piltover.' },
          { s: 'sevika', t: 'Que nadie diga que te lo conté yo.' },
        ], next: 'b2' },
        b_pierde: { bg: 'foso', lines: [
          { s: 'narrador', t: 'Acabas en el suelo del foso con la cara llena de serrín. La grada aplaude. No a ti.' },
          { s: 'sevika', t: 'Vuelve cuando aprendas a pelear. O no vuelvas.' },
        ], next: 'b2' },
        b2: { bg: 'foso', lines: [
          { s: 'narrador', t: 'Sevika baja de la barandilla y se sienta a tu lado en un banco. Se sirve un trago y te sirve otro sin preguntar.' },
          { s: 'sevika', t: '¿Sabes cómo perdí el brazo? Aquella noche, en la fábrica. Vander. Con un puñetazo. Yo le apuntaba a Silco y él se puso en medio.' },
          { s: 'sevika', t: 'Todo el mundo cree que soy el perro de Silco. Le sigo porque es el único que ha tenido el valor de pensar en grande. Pero esa cría…' },
          { s: 'sevika', t: 'Esa cría le va a costar la ciudad. Y él no lo ve, porque la quiere como a una hija.' },
        ], choices: [
          { t: '«Entonces díselo tú. Alguien tiene que hacerlo.»', next: 'c', fx: { aff: { sevika: 2 } } },
          { t: '«Jinx no es el problema. El problema es Silco.»', next: 'c', fx: { aff: { sevika: -1, jinx: 1 } } },
          { t: '«¿Y tú qué quieres, Sevika? Para ti.»', next: 'c', fx: { aff: { sevika: 1 }, stats: { carisma: 1 } } },
        ] },
        c: { bg: 'callejones', lines: [
          { s: 'sevika', t: '(Mirando el vaso vacío.) Lo que quiero da igual. Lo que importa es que mañana no amanezcamos debajo de los escombros.' },
          { s: 'narrador', t: 'Al salir, ves ejecutores en cada esquina. El sheriff Marcus ha ordenado una redada en los callejones: alguien en Piltover tiene prisa por encontrar a Jinx.' },
        ], end: true },
      },
    },
    {
      id: 'z7', route: 'zaun', title: 'Capítulo 7 · Persecución en los tejados',
      intro: 'Los ejecutores barren Zaun puerta por puerta. Ekko necesita que alguien lleve un aviso al árbol… atravesando la ciudad por arriba.',
      unlocks: [],
      start: 'a',
      nodes: {
        a: { bg: 'tejados', lines: [
          { s: 'ekko', t: '(Por un tubo de mensajes, la voz entrecortada.) {name}, los ejecutores van hacia el árbol. Alguien les ha dado la ruta.' },
          { s: 'ekko', t: 'Yo estoy en el puente, persiguiendo a Jinx. Tienes que avisar a Scar antes que ellos. Hay críos durmiendo ahí arriba.' },
          { s: 'narrador', t: 'Abajo, en la calle, Marcus grita por un megáfono que nadie se mueva, por orden del Consejo. Sus hombres derriban una puerta. Luego otra.' },
        ], choices: [
          { t: 'Correr por los tejados.', next: 'b_llega', game: { id: 'tejados', win: 'b_llega', lose: 'b_atrapado', winFx: { aff: { ekko: 2 }, rep: { zaun: 1 }, flags: ['aviso_luciernagas'] } }, fx: {} },
          { t: 'Distraer a Marcus para ganar tiempo (Valor 3).', req: { stat: 'valor', min: 3 }, next: 'b_distrae', fx: { aff: { ekko: 1 }, flags: ['aviso_luciernagas'] } },
          { t: 'Sobornar a un ejecutor (Sigilo 2).', req: { stat: 'sigilo', min: 2 }, next: 'b_soborno', fx: { aff: {}, rep: { piltover: 1 } } },
        ] },
        b_llega: { bg: 'arbol', lines: [
          { s: 'narrador', t: 'Saltas el último hueco y aterrizas en una rama del árbol. Scar ya está dando la alarma y los críos bajan por las cuerdas medio dormidos.' },
          { s: 'narrador', t: 'Scar te agarra del brazo un segundo: lo has conseguido, le debéis una, {name}. Luego desaparece entre las hojas brillantes.' },
        ], next: 'b2' },
        b_distrae: { bg: 'callejones', lines: [
          { s: 'yo', t: '¡Eh, sheriff! ¿Busca a alguien de Zaun? ¡Pues aquí tiene a una persona de Zaun!' },
          { s: 'narrador', t: 'Marcus te señala con el megáfono y ordena que vayan a por ti. Media patrulla te persigue en dirección contraria al árbol.' },
          { s: 'narrador', t: 'Les arrastras por tres mercados, dos lavanderías y un puesto de pescado. Ekko tiene su oportunidad.' },
        ], next: 'b2' },
        b_soborno: { bg: 'callejones', lines: [
          { s: 'narrador', t: 'Unas monedas en el bolsillo correcto y el ejecutor «se equivoca» de calle. Marcus no se entera de nada.' },
          { s: 'narrador', t: 'Más tarde, Marcus te cruza en un callejón. No te detiene. Te dice en voz baja que sabe lo que has hecho y que, entre tú y él, gracias: no quiere más sangre en sus manos.' },
        ], next: 'b2' },
        b_atrapado: { bg: 'callejones', lines: [
          { s: 'narrador', t: 'Un tejado cede bajo tus pies. Caes justo delante de dos ejecutores.' },
          { s: 'caitlyn', t: '(Llega corriendo con el rifle a la espalda.) Esta persona está conmigo. Soltadla. Ahora.' },
          { s: 'caitlyn', t: '(En voz baja, mientras te ayuda a levantarte.) No pienso preguntarte qué hacías en un tejado. Todavía.' },
          { s: 'narrador', t: 'Te salvas, pero el árbol de las Luciérnagas no recibe el aviso a tiempo.' },
        ], next: 'b2' },
        b2: { bg: 'puente', lines: [
          { s: 'narrador', t: 'Desde lo alto ves el puente del Entresuelo. Dos figuras pelean sobre él: una con un bate y una aerotabla, otra con trenzas azules y una ametralladora de juguete.' },
          { s: 'ekko', t: '¡Powder! ¡Para! ¡Sé que sigues ahí dentro!' },
          { s: 'jinx', t: '¡Powder está muerta, Ekko! ¡La enterraste tú cuando te fuiste con esos críos de las máscaras!' },
          { s: 'narrador', t: 'Ekko la tiene. Por un segundo, solo tiene que empujar. No lo hace. Jinx sí.' },
        ], choices: [
          { t: 'Bajar a ayudar a Ekko (Valor 2).', req: { stat: 'valor', min: 2 }, next: 'b3', fx: { aff: { ekko: 2, jinx: -1 } } },
          { t: 'Gritarle a Jinx para que pare.', next: 'b3', fx: { aff: { jinx: 1 } } },
          { t: 'Quedarte quiet{g:o|a|e}: es entre ellos.', next: 'b3' },
        ] },
        b3: { bg: 'puente', lines: [
          { s: 'narrador', t: 'Una explosión. El puente cruje. Ekko cae… y una aerotabla lo recoge en el último segundo.' },
          { s: 'jinx', t: '(Desde el borde, sola, con la respiración agitada.) Siempre me hacéis elegir. Siempre.' },
          { s: 'jinx', t: '(Te ve. Por un momento parece una niña perdida.) {name}… ¿tú también me odias?' },
          { s: 'narrador', t: 'Antes de que puedas responder, salta hacia la niebla y desaparece.' },
        ], next: 'c' },
        c: { bg: 'sumidero', lines: [
          { s: 'narrador', t: 'Esa noche, un grito inhumano sube desde el Sumidero. Algo ha escapado del laboratorio de Singed.' },
        ], end: true },
      },
    },
    {
      id: 'z8', route: 'zaun', title: 'Capítulo 8 · Lo que oculta Singed',
      intro: 'El laboratorio del Sumidero está abierto y vacío. Las máquinas siguen zumbando. Y en las paredes, alguien ha escrito un nombre: Vander.',
      unlocks: [],
      start: 'a',
      nodes: {
        a: { bg: 'sumidero', lines: [
          { s: 'narrador', t: 'Cristales rotos, jaulas abiertas y marcas de garras en el metal. En una pared, arañado con algo afilado, un nombre: VANDER.' },
          { s: 'narrador', t: 'Singed aparece entre el vapor, tranquilo, como si le hubieras interrumpido el té. Lamenta que su paciente se haya marchado antes de terminar el tratamiento. Estaba tan cerca…' },
        ], choices: [
          { t: 'Sabotear sus máquinas de Brillo.', next: 'b_sabotaje', game: { id: 'circuito', win: 'b_sabotaje', lose: 'b_falla', winFx: { rep: { zaun: 2 }, flags: ['sabotaje_singed'] } }, fx: {} },
          { t: 'Preguntarle quién era el paciente.', req: { flag: 'vio_bestia' }, next: 'b_verdad', fx: { aff: {}, flags: ['sabe_warwick'] } },
          { t: 'Robar sus notas sobre la gema (Sigilo 3).', req: { stat: 'sigilo', min: 3 }, next: 'b_notas', fx: { flags: ['sabe_gema'] } },
          { t: 'Salir de allí cuanto antes.', next: 'b2' },
        ] },
        b_sabotaje: { bg: 'sumidero', lines: [
          { s: 'narrador', t: 'Reconectas los tubos al revés. Las cubas de Brillo se cuajan en una pasta inerte. Meses de producción, perdidos.' },
          { s: 'narrador', t: 'Singed observa el desastre con las manos a la espalda. Dice que ha sido ingenioso; que Silco no estará contento, pero que él, en cambio, está impresionado.' },
        ], next: 'b2' },
        b_falla: { bg: 'sumidero', lines: [
          { s: 'narrador', t: 'Saltan chispas y una nube violeta te obliga a retroceder tosiendo.' },
          { s: 'narrador', t: 'Singed ni se inmuta: la química no perdona la impaciencia. Vuelve cuando sepas lo que haces.' },
        ], next: 'b2' },
        b_verdad: { bg: 'sumidero', lines: [
          { s: 'narrador', t: 'Singed se quita las gafas. Su paciente, dice, era alguien que lo dio todo por sus hijos. Él le devolvió la fuerza. No la memoria.' },
          { s: 'narrador', t: 'Un escalofrío. Sabes de quién habla. Y Vi no puede enterarse así.' },
        ], next: 'b2' },
        b_notas: { bg: 'sumidero', lines: [
          { s: 'narrador', t: 'Entre fórmulas encuentras un diagrama de la gema hextec de Jinx… y del punto exacto donde se desestabiliza.' },
          { s: 'narrador', t: 'Hay una nota al margen con letra temblorosa: «Si la secuencia se invierte, la gema duerme». Te la guardas.' },
        ], next: 'b2' },
        b2: { bg: 'ultima-gota', lines: [
          { s: 'narrador', t: 'Vuelves a La Última Gota. Silco está solo en su despacho, con un vaso y la mirada perdida en la ventana.' },
          { s: 'silco', t: 'Siéntate, {name}. Hoy no muerdo.' },
          { s: 'silco', t: 'El Consejo me ofrece un trato: la independencia de Zaun… a cambio de entregarles a Jinx.' },
          { s: 'silco', t: 'Todo por lo que he luchado. Una nación. Y solo tengo que dar a la única persona que me ha querido sin pedir nada a cambio.' },
        ], choices: [
          { t: '«Zaun es más que una sola persona, Silco.»', next: 'b3', fx: { aff: { silco: 1 }, rep: { zaun: 1 } } },
          { t: '«Si la entregas, no te lo perdonará nunca. Y tú tampoco.»', next: 'b3', fx: { aff: { silco: 2, jinx: 1 } } },
          { t: '«Vander habría elegido a su familia.» (Carisma 2)', req: { stat: 'carisma', min: 2 }, next: 'b3', fx: { aff: { silco: -1 }, stats: { carisma: 1 } } },
        ] },
        b3: { bg: 'ultima-gota', lines: [
          { s: 'silco', t: '(Se ríe sin ganas.) Vander. Siempre Vander. ¿Sabes cómo me hice esta cicatriz? Él me sostuvo bajo el agua del río hasta que dejé de patalear.' },
          { s: 'silco', t: 'Salí de aquel río sabiendo una cosa: que los hermanos te traicionan. Pero los hijos… los hijos son otra cosa.' },
          { s: 'narrador', t: 'Se oyen pasos en la escalera. Jinx asoma la cabeza con una sonrisa enorme y la cara manchada de grasa.' },
          { s: 'jinx', t: '¿Interrumpo? ¡Está terminado! El cohete. ¡Venid a verlo!' },
          { s: 'silco', t: '(La mira con un amor que da miedo.) Ya voy, Jinx. Ya voy.' },
        ], next: 'c' },
        c: { bg: 'ultima-gota', lines: [
          { s: 'narrador', t: 'Mañana es el día. El Consejo vota, Jinx carga su cohete y Zaun contiene el aliento.' },
        ], end: true },
      },
    },
    {
      id: 'p6', route: 'piltover', title: 'Capítulo 6 · Prueba de puntería',
      intro: 'Antes de volver a bajar a Zaun, Caitlyn quiere asegurarse de que sabes defenderte.',
      unlocks: [],
      start: 'a',
      nodes: {
        a: { bg: 'ejecutores', lines: [
          { s: 'narrador', t: 'La galería de tiro de la jefatura está vacía salvo por vosotros, un par de dianas agujereadas y un cadete, Loris, que se come un bocadillo con mucha concentración.' },
          { s: 'caitlyn', t: 'Si Jinx tiene lo que creo, la próxima vez no habrá segundas oportunidades. Enséñame cómo disparas, {name}.' },
          { s: 'narrador', t: 'Loris levanta la mano: apuesta por ti. Bueno, apuesta medio bocadillo.' },
        ], choices: [
          { t: 'Coger el rifle y entrar en la galería.', next: 'b_bien', game: { id: 'tiro', win: 'b_bien', lose: 'b_mal', winFx: { aff: { caitlyn: 3 }, rep: { piltover: 1 }, flags: ['tirador'] } }, fx: {} },
          { t: '«Prefiero la estrategia a las balas.» (Ingenio 3)', req: { stat: 'ingenio', min: 3 }, next: 'b_plan', fx: { aff: { caitlyn: 2 }, flags: ['plan_caitlyn'] } },
        ] },
        b_bien: { bg: 'ejecutores', lines: [
          { s: 'caitlyn', t: '(Baja los prismáticos.) Impresionante. Puede que hasta me hagas sombra.' },
          { s: 'narrador', t: 'Loris celebra su medio bocadillo ganado… y se lo come él, porque tú estás ocupad{g:o|a|e}.' },
        ], next: 'b2' },
        b_mal: { bg: 'ejecutores', lines: [
          { s: 'caitlyn', t: 'Bueno… al menos no has dado a ningún civil. Mucho. Quédate a mi espalda cuando bajemos.' },
        ], next: 'b2' },
        b_plan: { bg: 'ejecutores', lines: [
          { s: 'yo', t: 'Si Jinx usa la gema, no hay que dispararle a ella. Hay que llegar a la gema.' },
          { s: 'caitlyn', t: '(Sonríe por primera vez en días.) Eso es lo más sensato que he oído en esta jefatura.' },
        ], next: 'b2' },
        b2: { bg: 'ejecutores', lines: [
          { s: 'narrador', t: 'Caitlyn limpia el rifle pieza a pieza, despacio, como quien reza.' },
          { s: 'caitlyn', t: 'Este rifle lo diseñé yo. Mi madre quería que fuera consejera. Mi padre, que fuera feliz. Yo quería que alguien hiciera bien este trabajo.' },
          { s: 'caitlyn', t: '¿Sabes lo que más me asusta? No es Jinx. Es Vi. Es lo que le pasará si tenemos que dispararle a su hermana.' },
        ], choices: [
          { t: '«Entonces no le dispararemos. Buscaremos otra forma.»', next: 'b3', fx: { aff: { caitlyn: 2 } } },
          { t: '«Te importa mucho Vi, ¿eh?»', next: 'b3', fx: { aff: { caitlyn: 1, vi: 1 } } },
          { t: '«Si hay que hacerlo, lo haré yo.» (Valor 3)', req: { stat: 'valor', min: 3 }, next: 'b3', fx: { aff: { caitlyn: 1 }, stats: { valor: 1 } } },
        ] },
        b3: { bg: 'ejecutores', lines: [
          { s: 'caitlyn', t: '(Se pone roja hasta las orejas.) Es… Vi es… Es mi compañera de investigación. Ya está.' },
          { s: 'vi', t: '(Entrando en la galería con dos tazas.) ¿Hablando de mí, Cupcake? Os he traído té. Malo, porque es de la jefatura.' },
          { s: 'caitlyn', t: '(Coge la taza sin mirarla.) Gracias.' },
          { s: 'vi', t: '(Te guiña un ojo por encima de la taza.) Se pone así cada vez que entro. Es adorable.' },
        ], next: 'c' },
        c: { bg: 'academia', lines: [
          { s: 'narrador', t: 'Un mensaje de la Academia: Heimerdinger, Viktor y Jayce quieren verte. Dicen que han encontrado algo sobre la gema robada.' },
        ], end: true },
      },
    },
    {
      id: 'p7', route: 'piltover', title: 'Capítulo 7 · Las runas de la gema',
      intro: 'Entre pizarras y planos, los padres de la hextec por fin tienen respuestas. Y miedo.',
      unlocks: [],
      start: 'a',
      nodes: {
        a: { bg: 'academia', lines: [
          { s: 'jayce', t: '{name}, gracias por venir. Llevamos dos noches sin dormir. Viktor, cuéntaselo tú, que yo lo explico fatal.' },
          { s: 'viktor', t: 'La gema que robó esa muchacha no es estable. Las runas grabadas en ella siguen una secuencia… y si alguien la recuerda, podría apagarla.' },
          { s: 'viktor', t: 'O hacerla estallar. Depende de quién la toque.' },
          { s: 'heimerdinger', t: '(Desde un rincón, con un libro más grande que él.) Y por eso, queridos míos, la magia no se toca sin manual. Ni con manual.' },
          { s: 'jayce', t: '(Evita mirarle.) Gracias, profesor. Muy útil.' },
        ], choices: [
          { t: 'Memorizar la secuencia de runas.', next: 'b_ok', game: { id: 'runas', win: 'b_ok', lose: 'b_ko', winFx: { aff: { heimerdinger: 3, jayce: 1 }, flags: ['sabe_gema'] } }, fx: {} },
          { t: 'Pedir a Viktor que la anote por ti.', req: { aff: ['viktor', 4] }, next: 'b_viktor', fx: { aff: { viktor: 2 }, flags: ['sabe_gema'] } },
          { t: '«No hay tiempo para clases, profesor.»', next: 'b_ko', fx: { aff: { heimerdinger: -2 } } },
        ] },
        b_ok: { bg: 'academia', lines: [
          { s: 'heimerdinger', t: '¡Extraordinario! Con esa secuencia, la gema se dormirá como un gatito.' },
          { s: 'viktor', t: 'Un gatito muy peligroso, eso sí. No te equivoques en la cuarta runa.' },
        ], next: 'b2' },
        b_viktor: { bg: 'academia', lines: [
          { s: 'viktor', t: '(Te pasa un papel arrugado.) No lo pierdas. Y no se lo enseñes a Jayce: querría «mejorarlo».' },
          { s: 'jayce', t: '¡Te he oído!' },
        ], next: 'b2' },
        b_ko: { bg: 'academia', lines: [
          { s: 'heimerdinger', t: 'Hmm, hmm. Bueno. Confiemos en la suerte, entonces. Odio confiar en la suerte.' },
          { s: 'jayce', t: 'Por una vez estamos de acuerdo, profesor.' },
        ], next: 'b2' },
        b2: { bg: 'taller-jayce', lines: [
          { s: 'narrador', t: 'Cuando Viktor sale a toser al pasillo, Jayce baja la voz.' },
          { s: 'jayce', t: 'Está peor, {name}. Lo noto en cómo se apoya en el bastón. Y lleva semanas metido con el Hexcore aunque le prohibí seguir.' },
          { s: 'jayce', t: 'Mel quiere que hable ante el Consejo como representante de la hextec. Dice que ahora soy la cara del progreso. (Se ríe sin gracia.) La cara. Viktor es el cerebro y nadie lo sabe.' },
        ], choices: [
          { t: '«Pues díselo al Consejo. Que se sepa.»', next: 'b3', fx: { aff: { jayce: 1, viktor: 2 } } },
          { t: '«Habla con Viktor. Es tu amigo antes que tu socio.»', next: 'b3', fx: { aff: { jayce: 2 } } },
          { t: '«Mel te está usando. Ten cuidado.» (Ingenio 2)', req: { stat: 'ingenio', min: 2 }, next: 'b3', fx: { aff: { jayce: 1, mel: -1 } } },
        ] },
        b3: { bg: 'taller-jayce', lines: [
          { s: 'viktor', t: '(Volviendo, con el pañuelo escondido en la mano.) ¿Conspirando a mis espaldas?' },
          { s: 'jayce', t: 'Siempre. Es mi pasatiempo favorito.' },
          { s: 'viktor', t: '(Una sonrisa breve, sincera.) Cuando todo esto pase, Jayce, quiero que la hextec baje a Zaun. Hospitales. Fábricas que no maten a nadie. Me lo prometiste.' },
          { s: 'jayce', t: 'Te lo prometí. Y lo cumpliré.' },
        ], next: 'c' },
        c: { bg: 'arbol', lines: [
          { s: 'narrador', t: 'Ekko envía un mensaje: las Luciérnagas pueden llevarte a ver la torre de Silco desde el aire. Te espera en el árbol, en Zaun.' },
        ], end: true },
      },
    },
    {
      id: 'p8', route: 'piltover', title: 'Capítulo 8 · Vuelo sobre Zaun',
      intro: 'Desde una aerotabla, Zaun parece otra cosa: un mar de luces verdes, tuberías y vida.',
      unlocks: [],
      start: 'a',
      nodes: {
        a: { bg: 'arbol', lines: [
          { s: 'ekko', t: 'Agárrate fuerte. Si te caes, no grites: atrae a los matones de Sevika.' },
          { s: 'narrador', t: 'Scar, cruzado de brazos, comenta que si te caes, que no sea encima de él.' },
          { s: 'ekko', t: 'No le hagas caso. Scar quiere a todo el mundo. Por dentro. Muy por dentro.' },
        ], choices: [
          { t: 'Subir a la aerotabla.', next: 'b_ok', game: { id: 'aerotabla', win: 'b_ok', lose: 'b_ko', winFx: { aff: { ekko: 3 }, rep: { zaun: 2 }, flags: ['explorado', 'alianza_luciernagas'] } }, fx: {} },
          { t: 'Dejar que Ekko pilote mientras tú observas (Sigilo 3).', req: { stat: 'sigilo', min: 3 }, next: 'b_mira', fx: { aff: { ekko: 1 }, flags: ['explorado'] } },
        ] },
        b_ok: { bg: 'zaun', lines: [
          { s: 'narrador', t: 'Esquivas chimeneas y tuberías y ves la torre de Silco: un cohete en el tejado, pintado de colores chillones, apuntando a Piltover.' },
          { s: 'ekko', t: 'Vuelas como una Luciérnaga. Bienvenid{g:o|a|e} a la familia.' },
        ], next: 'b2' },
        b_mira: { bg: 'zaun', lines: [
          { s: 'narrador', t: 'Desde el aire, cuentas guardias, rutas y escaleras. Ya sabes cómo llegar hasta el cohete.' },
        ], next: 'b2' },
        b_ko: { bg: 'zaun', lines: [
          { s: 'narrador', t: 'Una tubería te roza y acabáis aterrizando en un charco químico. Ekko se ríe tanto que casi se cae él también.' },
          { s: 'ekko', t: 'Bueno, al menos hemos visto el cohete. Más o menos.' },
        ], next: 'b2' },
        b2: { bg: 'arbol', lines: [
          { s: 'narrador', t: 'De vuelta en el árbol, Ekko se sienta en una rama con las piernas colgando sobre el vacío. Hay un mural detrás de él: una niña de pelo azul con un mono de trapo.' },
          { s: 'ekko', t: 'Ayer peleé con ella en el puente. La tenía, {name}. Podía haber acabado con todo.' },
          { s: 'ekko', t: 'Y no pude. Porque cuando la miro sigo viendo a la cría que me enseñó a hacer bombas de humo con harina.' },
        ], choices: [
          { t: '«Eso no es debilidad, Ekko. Es lo que te hace distinto a Silco.»', next: 'b3', fx: { aff: { ekko: 3 } } },
          { t: '«La próxima vez quizá no tengas elección.»', next: 'b3', fx: { aff: { ekko: 1 }, stats: { valor: 1 } } },
          { t: 'Sentarte a su lado sin decir nada.', next: 'b3', fx: { aff: { ekko: 2 } } },
        ] },
        b3: { bg: 'arbol', lines: [
          { s: 'ekko', t: '(Saca un engranaje del bolsillo y lo hace girar entre los dedos.) Estoy trabajando en algo. Un aparato. Si funciona, podría… no sé. Darle a la gente una segunda oportunidad.' },
          { s: 'ekko', t: 'Bah. Ya te lo enseñaré cuando no explote.' },
        ], next: 'c' },
        c: { bg: 'puente', lines: [
          { s: 'narrador', t: 'Mañana el Consejo vota la paz. Y en una torre de Zaun, un cohete espera su momento.' },
        ], end: true },
      },
    },

    // ======================= FINAL COMPARTIDO =======================
    {
      id: 'fin', route: 'ambas', title: 'Capítulo final · El Puente',
      intro: 'Las dos ciudades contienen el aliento. El Consejo vota la paz. Jinx tiene un cohete. Y tú estás en medio.',
      unlocks: ['jinx', 'silco', 'jayce', 'mel', 'caitlyn', 'vi', 'ambessa'],
      start: 'a0',
      nodes: {
        a0: { bg: 'escondite-jinx', lines: [
          { s: 'narrador', t: 'La noche antes. En el escondite de Jinx hay una mesa larga con un mantel de cuadros, tazas desparejadas y velas. Una merienda.' },
          { s: 'narrador', t: 'Vi está atada a una silla. Caitlyn, a otra, amordazada. En la cabecera, Silco, atado también, con la cara amoratada.' },
          { s: 'jinx', t: '(Con una tetera en la mano.) ¡Bienvenidos a la merienda familiar! ¿Azúcar? ¿Pólvora? ¿Las dos cosas?' },
          { s: 'vi', t: 'Powder, por favor. Esto no tiene que acabar así.' },
          { s: 'jinx', t: 'Shh. Shh. Hoy es el día en que todos dejamos de mentir. Silco, tú primero.' },
          { s: 'silco', t: '(Con sangre en el labio.) Jinx… ella no es tu familia. Te abandonó.' },
          { s: 'jinx', t: '(Se gira hacia ti, que estás en la puerta.) ¡Y mira quién ha venido! Siéntate, {name}. Hay sitio para todos.' },
        ], choices: [
          { t: 'Sentarte a la mesa con calma.', next: 'a1', fx: { aff: { jinx: 2 } } },
          { t: 'Intentar desatar a Vi a escondidas (Sigilo 2).', req: { stat: 'sigilo', min: 2 }, next: 'a1', fx: { aff: { vi: 2 } } },
          { t: '«Jinx, suéltalos. Esto no es una merienda.»', next: 'a1', fx: { aff: { jinx: -1, caitlyn: 1 } } },
        ] },
        a1: { bg: 'escondite-jinx', lines: [
          { s: 'jinx', t: 'Vi quiere que elija. Silco quiere que elija. ¡Todo el mundo quiere que elija!' },
          { s: 'narrador', t: 'Silco se suelta una mano. Coge una pistola de la mesa. Apunta a Caitlyn. Duda. Jinx grita y dispara por instinto.' },
          { s: 'narrador', t: 'Silco cae hacia atrás con la silla. Jinx suelta el arma y corre a su lado.' },
          { s: 'silco', t: '(Le acaricia la cara con la mano ensangrentada.) No llores. No cambiaría nada. Eres… perfecta.' },
          { s: 'jinx', t: '(Se queda en silencio. Cuando se levanta, ya no tiembla.) Vale. Entonces ya no hay nada que elegir.' },
          { s: 'narrador', t: 'Jinx coge su bolsa y sale hacia el puente sin mirar atrás. Te toca a ti cortar las cuerdas de Vi y de Caitlyn.' },
          { s: 'vi', t: '(Frotándose las muñecas.) Ve tú delante, {name}. Tú llegas antes. Nosotras vamos detrás.' },
        ], next: 'a' },
        a: { bg: 'puente', lines: [
          { s: 'narrador', t: 'Amanece sobre el Puente del Progreso. Arriba, el Consejo debate un tratado con Zaun. Abajo, una chica de trenzas azules carga un cohete con una gema que podría arrasar media ciudad.' },
          { s: 'jinx', t: '¡Mira, {name}! Mi obra maestra. ¿Le pongo un lazo?' },
          { s: 'vi', t: '(Por el comunicador.) {name}, ¿me oyes? Estamos en camino. ¡Haz lo que puedas!' },
        ], choices: [
          { t: 'Hablar con Jinx de corazón (Afinidad con Jinx 5).', req: { aff: ['jinx', 5] }, next: 'b_jinx', fx: { flags: ['jinx_escucha'] } },
          { t: 'Sabotear el cohete (Ingenio 3).', req: { stat: 'ingenio', min: 3 }, next: 'b_sabotaje', fx: { flags: ['cohete_saboteado'] } },
          { t: 'Usar la secuencia de runas para dormir la gema.', req: { flag: 'sabe_gema' }, next: 'b_sabotaje', fx: { flags: ['cohete_saboteado'] } },
          { t: 'Usar lo que te contó Sevika para llegar al cohete antes que nadie.', req: { flag: 'sabe_cohete' }, next: 'b_sabotaje', fx: { flags: ['cohete_saboteado'] } },
          { t: 'Seguir la ruta que viste desde la aerotabla.', req: { flag: 'explorado' }, next: 'b_sabotaje', fx: { flags: ['cohete_saboteado'] } },
          { t: 'Correr al Consejo para evacuar (Valor 2).', req: { stat: 'valor', min: 2 }, next: 'b_evacua', fx: { rep: { piltover: 2 }, flags: ['evacuacion'] } },
          { t: 'Dejar que Zaun hable a su manera.', next: 'b_deja', fx: { rep: { zaun: 2, piltover: -3 }, flags: ['deja_cohete'] } },
        ] },
        b_jinx: { bg: 'puente', lines: [
          { s: 'yo', t: 'Powder. No necesitas esto para que te vean. Yo te veo. Vi te ve.' },
          { s: 'jinx', t: '(Se le quiebra la voz.) Si no lo lanzo… ¿quién soy? Silco se ha ido. Vander se ha ido. Mylo, Claggor… Todos se van.' },
          { s: 'yo', t: 'Quien tú quieras ser. Esa es la parte divertida.' },
          { s: 'jinx', t: '(Se ríe entre lágrimas.) Eso es muy cursi, {name}. Muy, muy cursi.' },
        ], next: 'c' },
        b_sabotaje: { bg: 'puente', lines: [
          { s: 'narrador', t: 'Mientras Jinx canta una nana desafinada, desconectas un cable. Luego otro. El zumbido de la gema baja de tono.' },
          { s: 'jinx', t: '¿Qué haces? ¡Oye! ¡Ese es mi cable favorito!' },
          { s: 'jinx', t: '(Te mira con los ojos muy abiertos y, para tu sorpresa, se ríe.) Vale. Vale. Eres buen{g:o|a|e}. Muy buen{g:o|a|e}. Me caes mejor que antes.' },
        ], next: 'c' },
        b_evacua: { bg: 'consejo', lines: [
          { s: 'narrador', t: 'Irrumpes en la Sala del Consejo gritando. Los consejeros te miran como si estuvieras loco.' },
          { s: 'cassandra', t: '¿Qué significa esto? Estamos votando la paz.' },
          { s: 'narrador', t: 'Jayce te reconoce. Mel duda un segundo… y ordena desalojar.' },
          { s: 'jayce', t: '¡Fuera todos! ¡Ya!' },
        ], next: 'c' },
        b_deja: { bg: 'puente', lines: [
          { s: 'narrador', t: 'Te das la vuelta. A veces la historia se escribe con fuego. Esperas que no sea con el tuyo.' },
          { s: 'jinx', t: '(A tu espalda, feliz.) ¡Sabía que lo entenderías!' },
        ], next: 'c' },
        c: { bg: 'consejo', lines: [
          { s: 'narrador', t: 'En la Sala del Consejo, Jayce lee el tratado en voz alta. «Zaun será una nación libre». Algunos aplauden. Otros no.' },
          { s: 'mel', t: '(Mirando por la cúpula de cristal.) ¿Qué es esa luz?' },
          { s: 'narrador', t: 'El último momento llega. Todo lo que has hecho, cada amistad, cada traición, pesa en la balanza.' },
        ], next: 'final' },
        // El nodo 'final' se resuelve por código según el estado (ver ENDINGS).
        final: { bg: 'consejo', ending: true },
      },
    },

    // ======================= TEMPORADA 2 =======================
    {
      id: 't1', route: 't2', title: 'T2 · Capítulo 1 · Cenizas',
      intro: 'El humo del ataque aún no se ha disipado. Piltover llora a sus consejeros y exige un culpable. Todas las miradas apuntan hacia abajo.',
      unlocks: [],
      start: 'a',
      nodes: {
        a: { bg: 'consejo', lines: [
          { s: 'narrador', t: 'La Sala del Consejo es un esqueleto de vigas y cristales rotos. Entre los escombros, Caitlyn da órdenes con una voz que ya no tiembla.' },
          { s: 'cassandra', t: '(Con el brazo en cabestrillo, mirando los asientos vacíos.) Siete sillas. Ahora sobran cuatro. Conocía a sus hijos, {name}. A sus nietos.' },
          { s: 'caitlyn', t: '{name}. Necesito saber de qué lado estás. Vamos a bajar a por Jinx. Con todo.', cond: { notFlag: 's1_zaun_libre' } },
          { s: 'caitlyn', t: '{name}. Sé lo que hiciste en el puente. Aun así… necesito a alguien que conozca Zaun. No me hagas arrepentirme.', cond: { flag: 's1_zaun_libre' } },
          { s: 'vi', t: '(A su lado, con el uniforme de ejecutora que le queda raro, como un disfraz.) Esto no es venganza, Cait. Dime que no lo es.' },
          { s: 'caitlyn', t: 'Es justicia, Vi. Y si se parece a la venganza, es porque llevan años siendo la misma cosa.' },
        ], choices: [
          { t: 'Unirte a la cacería de Caitlyn.', next: 'b_caza', fx: { aff: { caitlyn: 2, vi: 1, jinx: -2 }, rep: { piltover: 2, zaun: -2 }, flags: ['caza_jinx'] } },
          { t: 'Avisar a Jinx en secreto.', next: 'b_aviso', fx: { aff: { jinx: 3, caitlyn: -3 }, rep: { zaun: 2 }, flags: ['protege_jinx'] } },
          { t: 'Pedir que se escuche a Zaun antes de bajar (Carisma 3).', req: { stat: 'carisma', min: 3 }, next: 'b_media', fx: { aff: { caitlyn: 1, vi: 2 }, rep: { zaun: 1, piltover: 1 }, flags: ['mediador'] } },
        ] },
        b_caza: { bg: 'ejecutores', lines: [
          { s: 'caitlyn', t: 'Bien. Cada puerta de Zaun se abrirá. Por las buenas o por las malas.' },
          { s: 'vi', t: '(En voz baja.) Prométeme que, si la encontramos, me dejarás hablar con ella primero.' },
          { s: 'caitlyn', t: '(No responde. Carga el rifle.)' },
        ], next: 'b2' },
        b_aviso: { bg: 'callejones', lines: [
          { s: 'narrador', t: 'Esa noche dejas un mensaje garabateado en la pared del escondite: «Vienen a por ti. Todos».' },
          { s: 'jinx', t: '(Desde las sombras, una risita.) Qué detalle. Nadie me había avisado antes de una fiesta.' },
          { s: 'jinx', t: '(Sale a la luz. Tiene los ojos rojos de no dormir.) ¿Sabes qué es lo peor? Que no quería que muriera nadie de los de abajo. Solo los de arriba. Y aun así, los que lo pagan son los de siempre.' },
        ], next: 'b2' },
        b_media: { bg: 'consejo', lines: [
          { s: 'yo', t: 'Si bajáis a romper puertas, cada niño de Zaun crecerá odiando el uniforme. Y la próxima bomba la pondrá él.' },
          { s: 'cassandra', t: '(Mira a su hija.) Escúchale, Caitlyn. Tu padre habría dicho lo mismo.' },
          { s: 'caitlyn', t: '(Un largo silencio.) Tienes un día para encontrar a alguien con quien hablar allí abajo. Un día.' },
        ], next: 'b2' },
        b2: { bg: 'ultima-gota', lines: [
          { s: 'narrador', t: 'Abajo, La Última Gota es ahora el cuartel de Sevika. Sin Silco, los químbarones se pelean por las sobras y ella intenta mantener Zaun de una pieza.' },
          { s: 'sevika', t: '(Con el cigarro apagado entre los dientes.) Silco está muerto. Jinx se ha esfumado. Y Piltover baja a cazarnos a todos por lo que hizo una sola cría.' },
          { s: 'sevika', t: 'Si vienes de parte de arriba, {name}, dilo ya. Me ahorrarás el trabajo de sacártelo.' },
        ], choices: [
          { t: '«Vengo a evitar una guerra. Ayúdame.»', next: 'b3', fx: { aff: { sevika: 1 }, rep: { zaun: 1 } } },
          { t: '«Vengo a avisarte: Caitlyn no va a parar.»', next: 'b3', fx: { aff: { sevika: 2 } } },
          { t: '«Vengo de parte de nadie. Como siempre.»', next: 'b3', fx: { stats: { sigilo: 1 } } },
        ] },
        b3: { bg: 'ultima-gota', lines: [
          { s: 'sevika', t: 'Silco me dejó un despacho y un montón de deudas. Y una ciudad que no sabe qué hacer sin alguien que le diga a quién odiar.' },
          { s: 'sevika', t: '(Golpea la mesa con el brazo de metal.) Yo no soy Silco. Pero tampoco voy a dejar que la Kiramman nos pase por encima.' },
        ], next: 'c' },
        c: { bg: 'mansion-kiramman', lines: [
          { s: 'narrador', t: 'Días después, una incursión en Zaun sale mal. En el caos, entre humo y disparos, Cassandra Kiramman no vuelve a casa.' },
          { s: 'narrador', t: 'En el funeral, Caitlyn no llora. Se queda de pie, recta como un rifle, mirando el ataúd.' },
          { s: 'ambessa', t: '(Apoyada en la balaustrada de la mansión Kiramman.) Una ciudad herida necesita un puño firme. Noxus puede prestárselo.' },
          { s: 'ambessa', t: '(A ti, sin apartar la vista de Caitlyn.) Pregúntale a la joven Kiramman. Ya no le tiembla el pulso. Eso es lo primero que se pierde en una guerra.' },
        ], end: true },
      },
    },
    {
      id: 't2', route: 't2', title: 'T2 · Capítulo 2 · La niña de las gafas',
      intro: 'En los callejones, una niña muda con unas gafas enormes sigue a Jinx a todas partes. Los ejecutores ya la buscan también a ella.',
      unlocks: ['isha'],
      start: 'a',
      nodes: {
        a: { bg: 'escondite-jinx', lines: [
          { s: 'narrador', t: 'Las paredes de Zaun están llenas de pintadas nuevas: un dibujo de Jinx con trenzas y una sonrisa, y debajo, en letras torcidas, «Jinx vive». Los zaunitas la han convertido en un símbolo.' },
          { s: 'jinx', t: '(Al verte, sorprendida.) Puaj. ¿Has visto lo que pintan? Me han hecho una santa. Yo no quería ser una santa. Quería ser… no sé. Nada.' },
          { s: 'jinx', t: 'Esta es Isha. No habla, pero me entiende mejor que nadie. Me sigue a todas partes. No consigo librarme de ella. (No parece intentarlo mucho.)' },
          { s: 'isha', t: '(Te saluda con la mano y te enseña un dibujo de un cohete con cara sonriente.)' },
          { s: 'jinx', t: 'Isha, saluda bien a {name}. Así no. Con estilo.' },
          { s: 'isha', t: '(Hace una reverencia exagerada y casi se cae.)' },
        ], next: 'a2' },
        a2: { bg: 'escondite-jinx', lines: [
          { s: 'jinx', t: '(Bajito, mientras Isha juega con un muelle.) La encontré en un callejón. La iban a vender a los químbarones. Le di de comer una vez y ahora cree que soy su hermana mayor.' },
          { s: 'jinx', t: 'Yo no sé ser hermana mayor, {name}. Yo era la pequeña. La que lo rompía todo.' },
        ], choices: [
          { t: '«Lo estás haciendo mejor de lo que crees.»', next: 'a3', fx: { aff: { jinx: 2 } } },
          { t: '«Entonces aprende rápido. Ella te necesita.»', next: 'a3', fx: { aff: { jinx: 1, isha: 1 } } },
          { t: 'Agacharte y preguntarle a Isha qué está construyendo.', next: 'a3', fx: { aff: { isha: 2 } } },
        ] },
        a3: { bg: 'escondite-jinx', lines: [
          { s: 'isha', t: '(Te enseña orgullosa una granada pintada de rosa con un lazo.)' },
          { s: 'jinx', t: '¡No! ¡Eso no se toca! (Se la quita con cuidado.) ¿Ves? Es igualita que yo. Es un desastre.' },
          { s: 'narrador', t: 'Silbatos fuera. Botas. Los ejecutores han encontrado el escondite.' },
          { s: 'jinx', t: '¡Hora de irse! {name}, llévatela por los tejados. Yo los entretengo.' },
        ], choices: [
          { t: 'Huir con Isha en aerotabla.', next: 'b_ok', game: { id: 'aerotabla', win: 'b_ok', lose: 'b_ko', winFx: { aff: { jinx: 3, isha: 4 }, flags: ['salva_isha'] } }, fx: {} },
          { t: 'Entregar a Isha a Vi para que la proteja.', req: { aff: ['vi', 3] }, next: 'b_vi', fx: { aff: { vi: 3, jinx: -2, isha: 1 }, flags: ['isha_con_vi'] } },
          { t: 'Esconderos en un conducto (Sigilo 3).', req: { stat: 'sigilo', min: 3 }, next: 'b_ok', fx: { aff: { isha: 3, jinx: 2 }, flags: ['salva_isha'] } },
        ] },
        b_ok: { bg: 'arbol', lines: [
          { s: 'narrador', t: 'Aterrizáis lejos, entre las luces del árbol de las Luciérnagas. Isha se ríe en silencio y te abraza la cintura.' },
          { s: 'ekko', t: '¿Otra cría de Jinx? (Suspira, pero se agacha para mirarla a la altura de los ojos.) Hola, peque. Aquí estarás a salvo. Por ahora.' },
          { s: 'isha', t: '(Señala el mural de Powder en la pared y luego se señala a sí misma, muy seria.)' },
          { s: 'ekko', t: '(Se le escapa una sonrisa triste.) Sí. Te pareces un poco.' },
        ], next: 'c' },
        b_vi: { bg: 'callejones', lines: [
          { s: 'vi', t: 'La cuidaré. Te lo juro. (Mira a Isha.) Tranquila, peque. Yo también tuve una hermana pequeña.' },
          { s: 'isha', t: '(Mira a Vi de arriba abajo, frunce el ceño y le da una patada en la espinilla.)' },
          { s: 'vi', t: '¡Au! Vale. Sí. Definitivamente es de Jinx.' },
          { s: 'narrador', t: 'Isha mira hacia el escondite, donde suenan explosiones de colores. No suelta tu mano hasta el último segundo.' },
        ], next: 'c' },
        b_ko: { bg: 'callejones', lines: [
          { s: 'narrador', t: 'Caéis en un callejón. Un ejecutor os acorrala… hasta que una granada de humo rosa lo cambia todo.' },
          { s: 'jinx', t: '¡Nadie toca a mi equipo! Corred, pringados.' },
          { s: 'isha', t: '(Aplaude en silencio, entusiasmada, mientras corréis.)' },
        ], next: 'c' },
        c: { bg: 'fabrica', lines: [
          { s: 'narrador', t: 'Corre un rumor por Zaun: en la vieja fábrica hay un hombre que cura a los enfermos de Brillo con solo tocarlos. Lo llaman el Heraldo.' },
          { s: 'narrador', t: 'Dicen que camina sin bastón. Dicen que sus ojos brillan de color azul.' },
        ], end: true },
      },
    },
    {
      id: 't3', route: 't2', title: 'T2 · Capítulo 3 · El Heraldo',
      intro: 'Una fila de zaunitas enfermos espera ante la fábrica. Salen caminando erguidos, con la mirada tranquila… demasiado tranquila.',
      unlocks: [],
      start: 'a0',
      nodes: {
        a0: { bg: 'taller-jayce', lines: [
          { s: 'jayce', t: '(Rodeado de planos, sin afeitar, con ojeras de varios días.) {name}. Gracias por venir. No sé a quién más preguntar.' },
          { s: 'jayce', t: 'Viktor tocó el Hexcore aquella noche. Se lo llevó. Y ahora dicen que está en Zaun, curando gente. Curando. Como un santo.' },
          { s: 'jayce', t: 'Le prometí que la hextec bajaría a Zaun. Y en vez de eso, Piltover hizo armas con ella. Hice armas con ella.' },
        ], choices: [
          { t: '«Ve a buscarle. Es tu amigo.»', next: 'a', fx: { aff: { jayce: 2, viktor: 1 } } },
          { t: '«Lo que hace Viktor no es curar, Jayce. Ten cuidado.»', next: 'a', fx: { aff: { jayce: 1 }, stats: { ingenio: 1 } } },
          { t: '«Iré yo primero. Te contaré lo que vea.»', next: 'a', fx: { aff: { jayce: 2 } } },
        ] },
        a: { bg: 'fabrica', lines: [
          { s: 'narrador', t: 'Dentro de la fábrica, la luz es azul y el silencio es total. Los curados se mueven despacio, sin prisa, como si nada les doliera.' },
          { s: 'viktor', t: '{name}. Ya no cojeo, ¿lo ves? El Hexcore me ha mostrado el camino. Puedo quitarle el dolor a Zaun. A todo Zaun.' },
          { s: 'viktor', t: 'Toda mi vida he sido un cuerpo roto en una ciudad rota. Ahora puedo arreglar las dos cosas.' },
          { s: 'viktor', t: 'Ven. Deja que te muestre lo que es vivir sin miedo.' },
        ], choices: [
          { t: 'Aceptar su «curación».', next: 'b_acepta', fx: { aff: { viktor: 4 }, flags: ['evolucion_aceptada'] } },
          { t: 'Estudiar el Hexcore antes de decidir.', next: 'b_estudia', game: { id: 'circuito', win: 'b_estudia', lose: 'b_niega', winFx: { stats: { ingenio: 1 }, flags: ['entiende_evolucion'] } }, fx: {} },
          { t: '«Sin dolor tampoco hay alegría, Viktor.»', next: 'b_niega', fx: { aff: { viktor: -2 }, flags: ['rechaza_evolucion'] } },
        ] },
        b_acepta: { bg: 'fabrica', lines: [
          { s: 'narrador', t: 'Un calor azul te recorre. Las cicatrices, el cansancio, los recuerdos que dolían… todo se vuelve suave. Lejano.' },
          { s: 'viktor', t: 'Bienvenid{g:o|a|e} a la Evolución Gloriosa.' },
        ], next: 'b2' },
        b_estudia: { bg: 'taller-jayce', lines: [
          { s: 'narrador', t: 'Las runas del Hexcore no solo curan: reescriben. Cada persona curada pierde algo pequeño… una manía, una risa, una voluntad.' },
          { s: 'yo', t: 'Viktor, esto no es curar. Es borrar.' },
          { s: 'viktor', t: '(Sin emoción.) Es mejorar. Algún día lo entenderás.' },
        ], next: 'b2' },
        b_niega: { bg: 'fabrica', lines: [
          { s: 'viktor', t: 'Lástima. Volverás. Todos vuelven cuando el dolor es suficiente.' },
        ], next: 'b2' },
        b2: { bg: 'fabrica', lines: [
          { s: 'narrador', t: 'La puerta de la fábrica se abre de golpe. Jayce entra, sin escolta, con el martillo a la espalda.' },
          { s: 'jayce', t: 'Viktor.' },
          { s: 'viktor', t: '(Se gira despacio. Por un instante, algo humano le cruza la cara.) Jayce. Has venido.' },
          { s: 'jayce', t: 'Vuelve conmigo. Lo arreglaremos juntos. Como siempre.' },
          { s: 'viktor', t: '«Como siempre». Tú arriba, en las fotos. Yo abajo, tosiendo sangre. No, Jayce. Esta vez lo arreglaré yo.' },
        ], choices: [
          { t: 'Ponerte del lado de Jayce.', next: 'b3', fx: { aff: { jayce: 2, viktor: -1 } } },
          { t: 'Ponerte del lado de Viktor.', next: 'b3', fx: { aff: { viktor: 2, jayce: -1 } } },
          { t: '«Los dos tenéis razón. Y los dos os vais a destruir.» (Carisma 2)', req: { stat: 'carisma', min: 2 }, next: 'b3', fx: { aff: { jayce: 1, viktor: 1 } } },
        ] },
        b3: { bg: 'fabrica', lines: [
          { s: 'narrador', t: 'Jayce no levanta el martillo. Viktor tampoco levanta la mano. Se miran durante un tiempo que parece eterno.' },
          { s: 'jayce', t: '(Al salir, a ti.) Ya no me ve, {name}. Me mira y ve a todos los que le fallaron. Y tiene razón: yo fui uno de ellos.' },
        ], next: 'c' },
        c: { bg: 'mansion-kiramman', lines: [
          { s: 'narrador', t: 'En Piltover, Mel Medarda regresa de Noxus con malas noticias. Y Ambessa la recibe con una sonrisa que no llega a sus ojos.' },
        ], end: true },
      },
    },
    {
      id: 't4', route: 't2', title: 'T2 · Capítulo 4 · La loba y la rosa',
      intro: 'Madre e hija frente a frente. Una ofrece ejércitos; la otra, una advertencia. Piltover tiene que elegir… y tú también.',
      unlocks: ['maddie', 'kino'],
      start: 'a',
      nodes: {
        a: { bg: 'consejo', lines: [
          { s: 'narrador', t: 'Lo que queda del Consejo se reúne en una sala provisional. Caitlyn, de uniforme negro, ocupa el asiento de su madre. Nadie se atreve a decirle que no le corresponde.' },
          { s: 'narrador', t: 'Detrás de Ambessa, dos soldados noxianos montan guardia: un hombre enorme y callado, Kino, y una joven de mirada atenta, Maddie, que no le quita ojo a Caitlyn.' },
          { s: 'ambessa', t: 'Noxus protegerá Piltover. Sus fábricas, su hextec, su gente. A cambio, solo pido lealtad. Y vuestras armas.' },
          { s: 'mel', t: 'Mi madre no regala espadas, {name}. Las presta. Y siempre las cobra.' },
          { s: 'mel', t: 'Y hay alguien más moviendo los hilos: una rosa negra que crece en la sombra de Noxus. Mi madre lleva años luchando contra ella… o usándola.' },
          { s: 'ambessa', t: '(Sin mirarla.) Mi hija confunde la prudencia con la cobardía. Un defecto de crianza. Mío, supongo.' },
        ], next: 'a2' },
        a2: { bg: 'mansion-kiramman', lines: [
          { s: 'mel', t: '(A solas, en un balcón, mostrándote una chispa dorada en la palma de la mano.) En el ataque al Consejo, esto me salvó la vida. Una luz. Una barrera.' },
          { s: 'mel', t: 'Soy maga, {name}. Mi madre lo sabía. Me mandó lejos de Noxus de niña para que nadie lo descubriera. Para que la Rosa Negra no me encontrara.' },
          { s: 'mel', t: 'Toda mi vida he creído que me exilió por débil. Y resulta que me escondió por fuerte.' },
        ], choices: [
          { t: '«Eso no la convierte en buena madre.»', next: 'a3', fx: { aff: { mel: 2, ambessa: -1 } } },
          { t: '«Quizá te quiere más de lo que sabe demostrar.»', next: 'a3', fx: { aff: { mel: 1, ambessa: 1 } } },
          { t: '«¿Qué puedes hacer con esa magia?» (Ingenio 2)', req: { stat: 'ingenio', min: 2 }, next: 'a3', fx: { aff: { mel: 2 }, stats: { ingenio: 1 } } },
        ] },
        a3: { bg: 'consejo', lines: [
          { s: 'ambessa', t: '(Al día siguiente, en la sala.) Bien, {name}. Todos te miran. Eres el puente entre esta ciudad y la de abajo. Dime qué quiere Piltover.' },
        ], choices: [
          { t: 'Negociar con Ambessa las condiciones de la alianza.', next: 'b_trato', game: { id: 'regateo', win: 'b_trato', lose: 'b_ambessa', winFx: { aff: { ambessa: 2, caitlyn: 1 }, rep: { piltover: 1 }, flags: ['trato_noxus'] } }, fx: {} },
          { t: 'Confiar en Mel y su magia.', next: 'b_mel', fx: { aff: { mel: 4, ambessa: -3 }, flags: ['aliado_mel_s2'] } },
          { t: 'Aceptar el ejército de Ambessa sin condiciones.', next: 'b_ambessa', fx: { aff: { ambessa: 3, mel: -2 }, rep: { piltover: 1, zaun: -2 }, flags: ['noxus_manda'] } },
        ] },
        b_trato: { bg: 'consejo', lines: [
          { s: 'ambessa', t: '(Ríe.) Negocias como una noxiana. Está bien: Zaun no será tocado. Por ahora.' },
          { s: 'caitlyn', t: '(Te mira con algo parecido a la gratitud. O al cansancio.) Bien jugado.' },
        ], next: 'c00' },
        b_mel: { bg: 'mansion-kiramman', lines: [
          { s: 'mel', t: 'Gracias. La magia que llevo dentro puede proteger a mucha gente. Pero necesito tiempo… y alguien que me cubra las espaldas.' },
          { s: 'ambessa', t: '(Desde la puerta, fría.) Elegir a mi hija es elegir a una niña que aún no sabe usar sus armas. Espero que no te arrepientas.' },
        ], next: 'c00' },
        b_ambessa: { bg: 'consejo', lines: [
          { s: 'narrador', t: 'Soldados noxianos desfilan por el Puente del Progreso. Desde abajo, Zaun los mira con un odio nuevo.' },
          { s: 'ambessa', t: 'Así se hacen las cosas, {name}. Rápido y con firmeza.' },
          { s: 'mel', t: '(Al pasar a tu lado, en un susurro.) Acabas de dejar entrar al lobo. Ya veremos quién lo saca.' },
        ], next: 'c00' },
        c00: { bg: 'ejecutores', lines: [
          { s: 'maddie', t: '(Ofreciéndole a Caitlyn una taza de té.) Comandante. Lleva dos días sin dormir. Con todo respeto, así no se gana una guerra.' },
          { s: 'caitlyn', t: '(La acepta, sin mirarla.) Gracias, Maddie.' },
          { s: 'kino', t: '(A ti, en voz baja, junto a la puerta.) La señora Ambessa dice que vigile quién entra en esta sala. Tú entras mucho.' },
        ], choices: [
          { t: '«Tranquilo, Kino. Soy de los buenos.»', next: 'c0', fx: { aff: { kino: 1 } } },
          { t: 'Fijarte en cómo Maddie mira los mapas de Caitlyn (Sigilo 2).', req: { stat: 'sigilo', min: 2 }, next: 'c0', fx: { aff: { maddie: -1 }, flags: ['sospecha_maddie'] } },
          { t: 'Darle las gracias a Maddie por cuidar de Caitlyn.', next: 'c0', fx: { aff: { maddie: 2 } } },
        ] },
        c0: { bg: 'ejecutores', lines: [
          { s: 'narrador', t: 'Maddie se queda un segundo más de lo necesario mirando el mapa. Luego saluda y sale.', cond: { flag: 'sospecha_maddie' } },
          { s: 'caitlyn', t: '(Más tarde, a solas, mirando un mapa de Zaun lleno de cruces rojas.) Mi madre murió ahí abajo, {name}. Ahí. (Señala una cruz.)' },
          { s: 'caitlyn', t: 'Vi dice que me estoy convirtiendo en otra persona. Puede que tenga razón. Pero la Caitlyn de antes no protegía a nadie.' },
        ], choices: [
          { t: '«La Caitlyn de antes es de la que Vi se enamoró.»', next: 'c', fx: { aff: { caitlyn: 1, vi: 1 } } },
          { t: '«Haz lo que tengas que hacer. Pero no lo hagas sola.»', next: 'c', fx: { aff: { caitlyn: 2 } } },
          { t: '«Tu madre quería paz, Caitlyn. No esto.»', next: 'c', fx: { aff: { caitlyn: -1 }, stats: { carisma: 1 } } },
        ] },
        c: { bg: 'sumidero', lines: [
          { s: 'narrador', t: 'Esa noche, algo enorme destroza un puesto de ejecutores en el Sumidero. Los supervivientes hablan de un lobo del tamaño de un carro.' },
        ], end: true },
      },
    },
    {
      id: 't5', route: 't2', title: 'T2 · Capítulo 5 · La bestia del Sumidero',
      intro: 'Garras en el metal, aullidos en la niebla. La criatura de Singed anda suelta… y parece buscar a alguien.',
      unlocks: [],
      start: 'a',
      nodes: {
        a: { bg: 'sumidero', lines: [
          { s: 'narrador', t: 'Entre la niebla verde, unos ojos brillan. La bestia avanza hacia ti, jadeando, con un collar de metal roto al cuello y tubos de Brillo clavados en la espalda.' },
          { s: 'vi', t: '(Llega corriendo, con los guanteletes encendidos.) ¡{name}, atrás! Esa cosa ha matado a tres ejecutores.' },
          { s: 'narrador', t: 'Pero la bestia se detiene. Mira a Vi. Y emite un sonido que se parece demasiado a una palabra.' },
          { s: 'narrador', t: 'Suena como «Vi».' },
        ], choices: [
          { t: 'Pelear para proteger a Vi.', next: 'b_pelea', game: { id: 'foso', win: 'b_pelea', lose: 'b_cae', winFx: { aff: { vi: 3 }, stats: { valor: 1 } } }, fx: {} },
          { t: 'Decirle a Vi la verdad: es Vander.', req: { flag: 'sabe_warwick' }, next: 'b_verdad', fx: { aff: { vi: 4 }, flags: ['vi_sabe_vander'] } },
          { t: 'Hablarle con calma a la bestia (Carisma 4).', req: { stat: 'carisma', min: 4 }, next: 'b_verdad', fx: { aff: { vi: 3, jinx: 2 }, flags: ['vi_sabe_vander'] } },
        ] },
        b_pelea: { bg: 'sumidero', lines: [
          { s: 'narrador', t: 'La bestia retrocede herida y desaparece en la niebla. En el suelo queda algo: un viejo guantelete, como los que Vander guardaba en su baúl.' },
          { s: 'vi', t: '(Lo recoge temblando.) No. No puede ser…' },
        ], next: 'b2' },
        b_cae: { bg: 'sumidero', lines: [
          { s: 'narrador', t: 'Un zarpazo te lanza contra una tubería. Cuando abres los ojos, la bestia ya no está. Vi te sostiene la cabeza.' },
          { s: 'vi', t: 'Eh, eh. Quédate conmigo. No pienso perder a nadie más esta semana.' },
        ], next: 'b2' },
        b_verdad: { bg: 'sumidero', lines: [
          { s: 'yo', t: 'Vi… es Vander. Singed lo trajo de vuelta. Así.' },
          { s: 'vi', t: '(Baja los puños. La bestia baja la cabeza.) …¿Viejo?' },
          { s: 'narrador', t: 'Por un instante, el monstruo y la chica se miran como un padre y una hija. Luego la bestia aúlla y huye hacia la oscuridad.' },
        ], next: 'b2' },
        b2: { bg: 'escondite-jinx', lines: [
          { s: 'narrador', t: 'Esa noche, Vi no vuelve a la jefatura. La encuentras en el antiguo escondite de Jinx. Y Jinx está allí, sentada en el otro extremo de la habitación, con Isha dormida en su regazo.' },
          { s: 'jinx', t: '(Sin levantar la voz, para no despertar a Isha.) Le he visto, Vi. Le he oído. Era su voz, aunque saliera de esa cosa.' },
          { s: 'vi', t: 'Lo sé, Pow.' },
          { s: 'jinx', t: '(Abre mucho los ojos.) Me has llamado Pow. Hace siglos que no me llamas Pow.' },
        ], choices: [
          { t: 'Dejarlas solas: esto es suyo.', next: 'b3', fx: { aff: { vi: 2, jinx: 2 } } },
          { t: 'Sentarte entre las dos.', next: 'b3', fx: { aff: { vi: 1, jinx: 1, isha: 1 } } },
          { t: '«Vander querría veros juntas. Aunque sea así.» (Carisma 2)', req: { stat: 'carisma', min: 2 }, next: 'b3', fx: { aff: { vi: 2, jinx: 2 } } },
        ] },
        b3: { bg: 'escondite-jinx', lines: [
          { s: 'jinx', t: 'Siempre pensé que si volvías, todo volvería a estar bien. Y volviste. Y nada estaba bien. Y yo tampoco.' },
          { s: 'vi', t: 'Ninguna de las dos lo está. (Se acerca un poco.) Pero podemos no estar bien juntas.' },
          { s: 'isha', t: '(Medio dormida, alarga una mano hacia Vi y se la coge.)' },
          { s: 'jinx', t: '(Ríe bajito.) Traidora.' },
        ], next: 'c' },
        c: { bg: 'arbol', lines: [
          { s: 'narrador', t: 'Ekko te espera en el árbol. Ha encontrado algo en el Z-Drive. Algo que no debería existir.' },
        ], end: true },
      },
    },
    {
      id: 't6', route: 't2', title: 'T2 · Capítulo 6 · Ecos del tiempo',
      intro: 'Una chispa del Hexcore y del Z-Drive abre una grieta. Al otro lado: un Zaun donde nada de esto pasó.',
      unlocks: [],
      start: 'a',
      nodes: {
        a: { bg: 'arbol', lines: [
          { s: 'heimerdinger', t: '(Sentado en una rama, con la bata llena de hojas.) Desde el ataque al Consejo vivo aquí, entre críos con máscaras. Es lo más parecido a una Academia que he tenido en años.' },
          { s: 'ekko', t: '(Con el Z-Drive en la mano, la voz rara.) Lo he visto, {name}. Un mundo donde Powder nunca se convirtió en Jinx. Donde Vander sigue sirviendo cerveza. Donde todos están bien.' },
          { s: 'ekko', t: 'Allí Powder y yo… (Se calla.) Allí la Academia aceptó a Viktor de verdad. Allí la hextec bajó a Zaun.' },
          { s: 'ekko', t: 'Pero solo puedo traer de allí una cosa. Un recuerdo, una idea… algo que nos ayude aquí.' },
        ], choices: [
          { t: 'Viajar con Ekko a través de la grieta.', next: 'b_ok', game: { id: 'runas', win: 'b_ok', lose: 'b_ko', winFx: { aff: { ekko: 3, heimerdinger: 2 }, flags: ['esperanza'] } }, fx: {} },
          { t: 'Pedirle que no vaya: «Nuestro mundo nos necesita.»', next: 'b_queda', fx: { aff: { ekko: 1 } } },
        ] },
        b_ok: { bg: 'callejones', lines: [
          { s: 'narrador', t: 'Al otro lado, el aire huele a flores. Hay árboles de verdad en los callejones. Powder, mayor y sonriente, ríe en la barra de La Última Gota.' },
          { s: 'narrador', t: 'Vander, con un delantal, le revuelve el pelo a Vi. Es tan bonito que duele.' },
          { s: 'ekko', t: '(Con los ojos brillantes.) Ella aquí construye cosas que funcionan. Me enseñó a pintar. Me… da igual. Tenemos que volver.' },
          { s: 'ekko', t: 'Me traigo esto. (Te enseña un dibujo de Powder: dos hermanas y un mono de trapo.) Para recordarle a Jinx quién puede ser.' },
        ], next: 'b2' },
        b_ko: { bg: 'arbol', lines: [
          { s: 'narrador', t: 'La grieta se cierra de golpe con un estallido de luz. Ekko vuelve solo, temblando.' },
          { s: 'ekko', t: 'Lo he perdido. Pero lo he visto. Y eso ya es algo.' },
        ], next: 'b2' },
        b_queda: { bg: 'arbol', lines: [
          { s: 'ekko', t: '(Guarda el Z-Drive.) Tienes razón. Los sueños no paran ejércitos.' },
          { s: 'heimerdinger', t: 'Una decisión sensata. Aunque, a mi edad, uno aprende que los sueños son lo único que de verdad mueve ejércitos.' },
          { s: 'ekko', t: 'Pero a veces me gustaría quedarme un rato en ellos.' },
        ], next: 'b2' },
        b2: { bg: 'arbol', lines: [
          { s: 'narrador', t: 'Alguien sube por las cuerdas del árbol. Jinx. Sin armas. Con las manos en los bolsillos.' },
          { s: 'jinx', t: 'Ekko. Me han dicho que querías verme. Bueno, me lo ha dicho Isha. Con dibujos.' },
          { s: 'ekko', t: '(Se levanta despacio.) Powder… Jinx. La última vez que hablamos, te tiré de un puente.' },
          { s: 'jinx', t: 'Técnicamente te tiré yo a ti. Pero vale, estamos en paz.' },
        ], choices: [
          { t: 'Animar a Ekko a contarle lo que ha visto.', next: 'b3', fx: { aff: { ekko: 2, jinx: 1 } } },
          { t: 'Hacer una broma para romper el hielo.', next: 'b3', fx: { aff: { jinx: 2 } } },
          { t: 'Retirarte y dejarles hablar.', next: 'b3', fx: { aff: { ekko: 1, jinx: 1 } } },
        ] },
        b3: { bg: 'arbol', lines: [
          { s: 'ekko', t: 'Hay un sitio… otro lugar, donde tú y yo seguimos siendo amigos. Donde nada de esto pasó.' },
          { s: 'jinx', t: '(Se ríe, pero se le quiebra la risa.) Qué suerte la de esa Powder. (Pausa.) ¿Era feliz?' },
          { s: 'ekko', t: 'Mucho.' },
          { s: 'jinx', t: 'Bien. Al menos una de nosotras.' },
        ], next: 'c' },
        c: { bg: 'puente', lines: [
          { s: 'narrador', t: 'Al amanecer, las campanas de Piltover suenan a guerra. Noxus por el mar. El ejército del Heraldo desde abajo. Y las dos ciudades, en medio.' },
        ], end: true },
      },
    },
    {
      id: 'fin2', route: 't2', title: 'T2 · Final · La guerra por el puente',
      intro: 'Todo converge en el Puente del Progreso: soldados de Noxus, ejecutores, zaunitas y los silenciosos ascendidos de Viktor.',
      unlocks: [],
      start: 'a0',
      nodes: {
        a0: { bg: 'consejo', lines: [
          { s: 'narrador', t: 'Antes de la batalla, en una sala de mapas, Piltover y Zaun se sientan a la misma mesa por primera vez.' },
          { s: 'sevika', t: '(Con los pies encima de la mesa.) No me gustáis. Ninguno. Pero Noxus me gusta menos.' },
          { s: 'caitlyn', t: 'Me basta con eso.' },
          { s: 'jayce', t: 'Viktor está en el corazón de la fábrica. Si alguien puede llegar hasta él, soy yo.' },
          { s: 'mel', t: 'Y yo me encargaré de mi madre. Es lo único que nunca ha esperado de mí.' },
          { s: 'ambessa', t: '(Al otro lado del mar, en su barco, a un mensajero.) Que avancen. Piltover caerá antes del anochecer.', cond: { notFlag: 'trato_noxus' } },
          { s: 'ambessa', t: '(Entra en la sala sin llamar.) Noxus luchará a vuestro lado contra el Heraldo. Un trato es un trato.', cond: { flag: 'trato_noxus' } },
        ], next: 'a' },
        a: { bg: 'puente', lines: [
          { s: 'narrador', t: 'El cielo está rojo de fuego noxiano y azul de magia hextec. Jinx aparece en lo alto de una torre con Isha a su lado.', cond: { flag: 'salva_isha' } },
          { s: 'narrador', t: 'El cielo está rojo de fuego noxiano y azul de magia hextec. Jinx aparece sola en lo alto de una torre.', cond: { notFlag: 'salva_isha' } },
          { s: 'caitlyn', t: '{name}, es ahora o nunca. Si Piltover y Zaun no luchan juntas hoy, mañana no habrá ninguna de las dos.' },
          { s: 'vi', t: '(Ajustándose los guanteletes.) Por Vander. Por Mylo y Claggor. Por todos los que se quedaron en el camino.' },
          { s: 'viktor', t: '(Su voz resuena desde todas partes.) No tiene por qué haber guerra. Uníos a mí y nadie volverá a sufrir.' },
        ], choices: [
          { t: 'Unir a las dos ciudades contra Noxus y el Heraldo (Carisma 3).', req: { stat: 'carisma', min: 3 }, next: 'b_union', fx: { flags: ['union'] } },
          { t: 'Enseñarle a Jinx el dibujo del otro mundo.', req: { flag: 'esperanza' }, next: 'b_jinx', fx: { aff: { jinx: 3, vi: 2 }, flags: ['union', 'jinx_redimida'] } },
          { t: 'Llamar a la bestia para que proteja a Vi.', req: { flag: 'vi_sabe_vander' }, next: 'b_lobo', fx: { flags: ['union'] } },
          { t: 'Unirte a la Evolución Gloriosa.', req: { flag: 'evolucion_aceptada' }, next: 'b_evo', fx: { flags: ['elige_evolucion'] } },
          { t: 'Luchar por tu cuenta.', next: 'b_solo' },
        ] },
        b_union: { bg: 'puente', lines: [
          { s: 'yo', t: '¡Escuchadme! ¡Arriba y abajo da igual! ¡Hoy somos el mismo puente!' },
          { s: 'narrador', t: 'Ejecutores y zaunitas se miran. Sevika levanta su brazo mecánico. Caitlyn asiente. Y cargan juntos.' },
          { s: 'sevika', t: '(Riéndose mientras tumba a un soldado noxiano.) ¡Esto sí que es un foso!' },
        ], next: 'c' },
        b_jinx: { bg: 'puente', lines: [
          { s: 'jinx', t: '(Mira el dibujo mucho rato.) …Powder. Hace mucho que nadie me llamaba así.' },
          { s: 'jinx', t: 'Vale. Una última explosión. Pero esta vez, a favor del equipo bueno.' },
          { s: 'isha', t: '(Levanta su granada rosa con el lazo, muy seria, lista para ayudar.)', cond: { flag: 'salva_isha' } },
          { s: 'jinx', t: 'Tú no, renacuaja. Tú te quedas detrás de mí. Siempre.', cond: { flag: 'salva_isha' } },
        ], next: 'c' },
        b_lobo: { bg: 'sumidero', lines: [
          { s: 'narrador', t: 'Un aullido sube desde el Sumidero. La bestia salta al puente y se planta delante de Vi, gruñendo a los soldados noxianos.' },
          { s: 'vi', t: 'Juntos, viejo. Como antes.' },
          { s: 'jinx', t: '(Desde la torre, con la voz rota.) Hola, papá.' },
        ], next: 'c' },
        b_evo: { bg: 'fabrica', lines: [
          { s: 'narrador', t: 'Das un paso hacia la luz azul. El ruido de la guerra se apaga. El miedo, también. Y algo más, que ya no recuerdas.' },
        ], next: 'final' },
        b_solo: { bg: 'puente', lines: [
          { s: 'narrador', t: 'Luchas con todo lo que tienes. Pero el puente es demasiado grande para una sola persona.' },
        ], next: 'final' },
        c: { bg: 'fabrica', lines: [
          { s: 'narrador', t: 'En el corazón de la fábrica, Jayce llega hasta Viktor. No lleva el martillo. Lo ha dejado atrás.' },
          { s: 'jayce', t: 'Si vas a hacer esto, Viktor, no lo harás solo. Me quedo contigo. Hasta el final.' },
          { s: 'viktor', t: '(La luz azul de sus ojos parpadea.) Jayce… Lo siento. Lo siento tanto.' },
          { s: 'narrador', t: 'La luz se apaga. En el puente, los ascendidos se detienen de golpe, como si despertaran de un sueño.' },
        ], next: 'final' },
        final: { bg: 'puente', ending: true, endingSet: 'endings2' },
      },
    },
  ],

  // Orden de capítulos por ruta.
  routes: {
    zaun: ['z1', 'z2', 'z3', 'z4', 'z5', 'z6', 'z7', 'z8', 'fin'],
    piltover: ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'fin'],
    t2: ['t1', 't2', 't3', 't4', 't5', 't6', 'fin2'],
  },

  // Finales de la Temporada 2.
  endings2: [
    {
      id: 't2_union', scene: 'puente', title: 'Final · Un solo puente',
      test: (st) => st.flags.union && !st.flags.elige_evolucion,
      lines: [
        { s: 'narrador', t: 'Al caer la noche, las banderas de Noxus se retiran por el mar y la luz azul del Heraldo se apaga en la fábrica.' },
        { s: 'caitlyn', t: 'Lo hemos hecho juntos. Arriba y abajo. Eso no lo había conseguido nadie.' },
        { s: 'vi', t: '(Sentada en el borde del puente.) Vander estaría orgulloso. De todos nosotros.' },
        { s: 'jinx', t: '(Con una sonrisa cansada.) ¿Y ahora qué? ¿Nos hacemos amigos y tal?', cond: { flag: 'jinx_redimida' } },
        { s: 'isha', t: '(Dibuja en el suelo del puente, con tiza, a todos cogidos de la mano. Incluye un lobo.)', cond: { flag: 'salva_isha' } },
        { s: 'mel', t: 'Mi madre ha vuelto a Noxus. Por primera vez en mi vida, no me importa lo que piense.' },
        { s: 'ekko', t: 'Ahora, a reconstruir. Y esta vez, el puente será de todos.' },
        { s: 'narrador', t: 'Años después, en el Puente del Progreso hay una placa con muchos nombres. Jayce. Viktor. Vander. Uno de ellos es el tuyo, {name}.' },
      ],
    },
    {
      id: 't2_evolucion', scene: 'fabrica', title: 'Final · La Evolución Gloriosa',
      test: (st) => st.flags.elige_evolucion,
      lines: [
        { s: 'narrador', t: 'La luz azul se extiende por Zaun y sube por el puente hasta Piltover. Las armas caen. Los gritos callan.' },
        { s: 'viktor', t: 'Ya no hay arriba ni abajo, {name}. Ya no hay dolor. Ni guerras. Ni nada.' },
        { s: 'narrador', t: 'Es paz. Una paz perfecta, silenciosa y vacía. Y en algún lugar, muy dentro, una parte de ti sigue gritando.' },
        { s: 'narrador', t: '(Hay otros finales. Quizá, la próxima vez, el dolor merezca la pena.)' },
      ],
    },
    {
      id: 't2_ruinas', scene: 'puente-zaun', title: 'Final · Ciudades en ruinas',
      test: () => true,
      lines: [
        { s: 'narrador', t: 'La guerra termina porque ya no queda nada por lo que luchar. El puente cae al amanecer.' },
        { s: 'vi', t: '(Entre los escombros.) Lo intentamos. Lo intentamos de verdad.' },
        { s: 'caitlyn', t: '(Le coge la mano, manchada de hollín.) Y lo volveremos a intentar. Mañana.' },
        { s: 'narrador', t: 'Piltover y Zaun tendrán que empezar de cero. Quizá esta vez aprendan. Quizá.' },
        { s: 'narrador', t: '(Consejo: mejora tu Carisma, conserva tus alianzas y busca la esperanza en el árbol de las Luciérnagas.)' },
      ],
    },
  ],

  // Finales: se elige el primero cuya condición se cumple.
  endings: [
    {
      id: 'paz', scene: 'puente', title: 'Final · El puente de los dos mundos',
      test: (st) => (st.flags.jinx_escucha || st.flags.cohete_saboteado) && (st.flags.pacto || st.flags.puente_hermanas || st.flags.alianza_luciernagas || (st.rep.zaun >= 3 && st.rep.piltover >= 1)),
      lines: [
        { s: 'narrador', t: 'El cohete nunca despega. En su lugar, Jinx baja del tejado de la mano de Vi.' },
        { s: 'vi', t: 'Estoy aquí, Pow. No me voy a ninguna parte. Nunca más.' },
        { s: 'caitlyn', t: 'El Consejo firmará el tratado. Y esta vez Zaun tendrá voz. Gracias a ti, {name}.' },
        { s: 'ekko', t: 'Quién lo iba a decir. Arriba y abajo en la misma mesa.' },
        { s: 'narrador', t: 'No es el final de los problemas. Pero es el principio de algo distinto. Y lleva tu nombre.' },
        { s: 'ambessa', t: '(Desde un balcón, una mujer con armadura noxiana te observa.) Interesante. Muy interesante.' },
      ],
    },
    {
      id: 'zaun_libre', scene: 'zaun', title: 'Final · Zaun se levanta',
      test: (st) => st.flags.deja_cohete && st.rep.zaun >= 3,
      lines: [
        { s: 'narrador', t: 'Una luz azul atraviesa el cielo. La Sala del Consejo estalla en mil cristales.' },
        { s: 'jinx', t: '¡Lo hemos hecho, {name}! ¡Ahora sí que nos ven! (Mira al cielo.) ¿Lo has visto, Silco? Para ti.' },
        { s: 'sevika', t: '(Mirando el humo desde La Última Gota.) Zaun será libre. Aunque tenga que nacer entre cenizas.' },
        { s: 'narrador', t: 'En los callejones te aclaman. En Piltover, tu cara aparece en todos los carteles de búsqueda.' },
        { s: 'ambessa', t: '(En Noxus, alguien sonríe.) Una ciudad en guerra es una ciudad que se puede comprar.' },
      ],
    },
    {
      id: 'orden', scene: 'consejo', title: 'Final · El orden de Piltover',
      test: (st) => st.flags.evacuacion || st.rep.piltover >= 3,
      lines: [
        { s: 'narrador', t: 'El cohete impacta, pero la sala está vacía. Nadie muere. Piltover te llama héroe.' },
        { s: 'jayce', t: 'Has salvado al Consejo, {name}. Pero me temo que esto significa guerra con Zaun.' },
        { s: 'mel', t: 'Los héroes son útiles. Hasta que dejan de serlo. Cuídate.' },
        { s: 'cassandra', t: '(Sacudiéndose el polvo del vestido.) Te debo la vida. Los Kiramman no olvidamos nuestras deudas.' },
        { s: 'narrador', t: 'Las puertas del puente se cierran. Desde arriba, Zaun parece más lejos que nunca.' },
      ],
    },
    {
      id: 'humo', scene: 'puente-zaun', title: 'Final · Solo humo',
      test: () => true,
      lines: [
        { s: 'narrador', t: 'Una luz azul. Un silencio terrible. Después, sirenas.' },
        { s: 'vi', t: '(Entre los escombros.) Llegamos tarde. Otra vez.' },
        { s: 'narrador', t: 'La guerra entre las dos ciudades ya no tiene marcha atrás. Y tú te preguntas qué habría pasado si hubieras elegido distinto.' },
        { s: 'narrador', t: '(Consejo: sube tus estadísticas y tu afinidad con los personajes y vuelve a intentarlo. Hay otros finales esperándote.)' },
      ],
    },
  ],
};
