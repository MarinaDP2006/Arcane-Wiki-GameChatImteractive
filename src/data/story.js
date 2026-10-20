// Historia interactiva. Cada capítulo es un grafo de nodos.
//
// Nodo: { bg, lines: [{ s: hablante, t: texto }], choices?: [...], next?: id, end?: true }
//   s: id de personaje de la wiki, 'narrador' o 'yo' (el jugador).
// Elección: { t, next, req?, fx? }
//   req: { stat: 'ingenio'|'carisma'|'valor'|'sigilo', min } | { flag } | { notFlag } | { aff: [id, min] }
//   fx:  { aff: { id: n }, rep: { zaun: n, piltover: n }, stats: { stat: n }, flags: [..] }
//
// Plantillas en el texto: {name}, {job}, {district}, {family}, {hobby},
// y {g:masculino|femenino|neutro} para concordar con el género del jugador.
window.STORY = {
  stats: {
    ingenio: { label: 'Ingenio', icon: '🧠' },
    carisma: { label: 'Carisma', icon: '💬' },
    valor: { label: 'Valor', icon: '🔥' },
    sigilo: { label: 'Sigilo', icon: '🌑' },
  },

  chapters: [
    // ======================= RUTA ZAUN =======================
    {
      id: 'z1', route: 'zaun', title: 'Capítulo 1 · La Última Gota',
      intro: 'Zaun, años antes de la hextec. El humo verde sube por las grietas y en la taberna de Vander huele a cerveza y a problemas.',
      unlocks: ['vander', 'vi', 'jinx', 'mylo', 'claggor'],
      start: 'a',
      nodes: {
        a: { bg: 'ultima-gota', lines: [
          { s: 'narrador', t: 'Empujas la puerta de La Última Gota. Te conocen en {district}: eres {name}, {job}. Hoy vienes a por un encargo… o a por un trago.' },
          { s: 'vander', t: '{name}. Siéntate. Te pongo algo y me cuentas qué te trae a mi barra.' },
        ], choices: [
          { t: '«Busco trabajo honrado. Si es que eso existe aquí abajo.»', next: 'b', fx: { aff: { vander: 2 } } },
          { t: '«He oído que tus chavales planean algo gordo.»', next: 'b2', fx: { aff: { vander: -1, vi: 1 } } },
          { t: '(Observar en silencio a la gente de la taberna.)', next: 'b3', fx: { stats: { sigilo: 1 } } },
        ] },
        b: { bg: 'ultima-gota', lines: [
          { s: 'vander', t: 'Honrado… Me gusta la palabra, aunque cueste encontrarla en Zaun. Ayúdame con las cajas del sótano y hablamos.' },
          { s: 'narrador', t: 'Mientras cargas cajas, una niña de pelo azul te espía desde las escaleras con un cachivache que pita.' },
        ], next: 'c' },
        b2: { bg: 'ultima-gota', lines: [
          { s: 'vander', t: '(Deja el vaso con un golpe seco.) Mis chavales no planean nada. Y tú tampoco.' },
          { s: 'vi', t: '(Desde una mesa del fondo te guiña un ojo.) Tranquilo, viejo. Solo charlamos.' },
        ], next: 'c' },
        b3: { bg: 'ultima-gota', lines: [
          { s: 'narrador', t: 'Te fijas: dos ejecutores beben en una esquina sin uniforme. Un hombre con una cicatriz en el ojo los paga desde la sombra… y desaparece.' },
          { s: 'narrador', t: 'Lo guardas en la memoria. En Zaun, saber cosas es más valioso que el dinero.' },
        ], next: 'c', },
        c: { bg: 'callejones', lines: [
          { s: 'jinx', t: '¡Hola! Soy Powder. ¿Sabes algo de cachivaches? Mi bomba no explota. Bueno, a veces sí. Cuando no debe.' },
          { s: 'vi', t: 'Powder, deja en paz a la gente. (Te mira.) Aunque… mañana subimos a Piltover. Una casa vacía en el barrio alto. Nos vendría bien alguien más.' },
          { s: 'mylo', t: 'Más gente, menos botín. Yo solo lo digo.' },
          { s: 'claggor', t: 'Mylo, cállate. Decide tú, {name}.' },
        ], choices: [
          { t: 'Unirte al golpe en Piltover.', next: 'd_golpe', fx: { aff: { vi: 2, mylo: 1 }, rep: { zaun: 1 }, flags: ['golpe'] } },
          { t: 'Ayudar a Powder con su bomba (Ingenio 2).', req: { stat: 'ingenio', min: 2 }, next: 'd_bomba', fx: { aff: { jinx: 3, claggor: 1 }, flags: ['bomba_powder'] } },
          { t: 'Avisar a Vander de lo que traman.', next: 'd_aviso', fx: { aff: { vander: 2, vi: -2 }, flags: ['chivato'] } },
        ] },
        d_golpe: { bg: 'taller-jayce', lines: [
          { s: 'narrador', t: 'De noche cruzáis el puente. La «casa vacía» es un laboratorio lleno de gemas que brillan como estrellas azules.' },
          { s: 'jinx', t: '¡Mira, mira! Son preciosas…' },
          { s: 'narrador', t: 'Un tirón, un destello y una explosión. Corréis por los tejados mientras suenan los silbatos de los ejecutores.' },
          { s: 'vi', t: '¡Corre, {name}! ¡No mires atrás!' },
        ], next: 'e' },
        d_bomba: { bg: 'callejones', lines: [
          { s: 'yo', t: 'El problema es el detonador: está mal soldado. Mira, si giras este cable…' },
          { s: 'jinx', t: '(Ojos como platos.) ¡Funciona! ¡Por fin alguien que no se ríe de mí!' },
          { s: 'narrador', t: 'Aunque no subes con ellos, esa noche Powder se lleva tu idea en el bolsillo. Y algo del laboratorio de Piltover vuelve con ella.' },
        ], next: 'e' },
        d_aviso: { bg: 'ultima-gota', lines: [
          { s: 'vander', t: 'Gracias por decírmelo. Esos chicos van a acabar conmigo.' },
          { s: 'narrador', t: 'Vander sale a buscarlos. Llega tarde: ya han cruzado el puente. Cuando vuelven, traen algo robado… y a medio Piltover detrás.' },
          { s: 'vi', t: '(Al verte.) ¿Fuiste tú quien se lo contó? Genial. Gracias, de verdad.' },
        ], next: 'e' },
        e: { bg: 'ultima-gota', lines: [
          { s: 'vander', t: 'Los ejecutores quieren un culpable. Si no lo encuentran, Zaun entero pagará.' },
          { s: 'narrador', t: 'Vander mira el baúl donde guarda sus viejos guanteletes. Algo se rompe en su mirada.' },
          { s: 'narrador', t: 'Has entrado en la familia de La Última Gota. Para bien o para mal.' },
        ], end: true },
      },
    },
    {
      id: 'z2', route: 'zaun', title: 'Capítulo 2 · Humo y traición',
      intro: 'El robo ha despertado a Piltover. Los ejecutores bajan cada noche, y alguien en la sombra se aprovecha del caos.',
      unlocks: ['benzo', 'ekko', 'silco'],
      start: 'a',
      nodes: {
        a: { bg: 'callejones', lines: [
          { s: 'benzo', t: 'Tú eres amigo de Vander, ¿no? Entra. Mi tienda tiene más secretos que trastos.' },
          { s: 'ekko', t: '¡Hala, mira esto! Benzo me deja arreglar el cacharro que encontré. Si funciona, vuela.' },
        ], choices: [
          { t: 'Ayudar a Ekko a arreglarlo (Ingenio 2).', req: { stat: 'ingenio', min: 2 }, next: 'b_ekko', fx: { aff: { ekko: 3, benzo: 1 } } },
          { t: 'Preguntar a Benzo por el hombre de la cicatriz.', next: 'b_benzo', fx: { aff: { benzo: 2 }, flags: ['sabe_silco'] } },
          { t: 'Bromear con Ekko sobre su peinado.', next: 'b_broma', fx: { aff: { ekko: 1 } } },
        ] },
        b_ekko: { bg: 'callejones', lines: [
          { s: 'narrador', t: 'Entre los dos, el cacharro despega un palmo del suelo antes de estrellarse contra una estantería.' },
          { s: 'ekko', t: '¡Ha volado! ¡Lo has visto! Algún día haré que vuele de verdad.' },
          { s: 'benzo', t: 'Y algún día me pagarás la estantería, chaval.' },
        ], next: 'c' },
        b_benzo: { bg: 'callejones', lines: [
          { s: 'benzo', t: '(Baja la voz.) Se llama Silco. Era como un hermano para Vander. Ahora compra ejecutores como quien compra pan. Ten cuidado.' },
        ], next: 'c' },
        b_broma: { bg: 'callejones', lines: [
          { s: 'ekko', t: '¿Mi pelo? Es aerodinámico. Algún día lo entenderás.' },
          { s: 'benzo', t: 'Tiene respuesta para todo. Como Vander a su edad.' },
        ], next: 'c' },
        c: { bg: 'sumidero', lines: [
          { s: 'narrador', t: 'Esa noche, Vander desaparece. Dicen que se ha entregado a los ejecutores en el puente. Pero el puente está lleno de hombres de Silco.' },
          { s: 'vi', t: 'Le tienen. Vamos a sacarle de ahí. Powder, tú te quedas.' },
          { s: 'jinx', t: '¡No es justo! ¡Yo también puedo ayudar!' },
        ], choices: [
          { t: 'Ir con Vi al rescate (Valor 2).', req: { stat: 'valor', min: 2 }, next: 'd_rescate', fx: { aff: { vi: 2, vander: 2 }, rep: { zaun: 1 }, flags: ['rescate'] } },
          { t: 'Quedarte con Powder para que no haga locuras.', next: 'd_powder', fx: { aff: { jinx: 3 }, flags: ['con_powder'] } },
          { t: 'Seguir a Silco en secreto (Sigilo 2).', req: { stat: 'sigilo', min: 2 }, next: 'd_silco', fx: { aff: { silco: 1 }, flags: ['espia_silco'] } },
        ] },
        d_rescate: { bg: 'sumidero', lines: [
          { s: 'narrador', t: 'Os colais en la fábrica. Vander está encadenado y Silco le habla como a un viejo amigo.' },
          { s: 'silco', t: 'Siempre elegiste a Piltover antes que a los tuyos, hermano.' },
          { s: 'narrador', t: 'Hay gritos, golpes y una nube violeta. Vander se libera y os protege a todos.' },
        ], next: 'e' },
        d_powder: { bg: 'callejones', lines: [
          { s: 'jinx', t: 'Siempre me dejan atrás. ¿Tú crees que soy un gafe?' },
          { s: 'yo', t: 'Creo que eres la persona más lista que conozco. Pero hoy hay que ser lista y paciente.' },
          { s: 'narrador', t: 'Powder no aguanta. Se escapa con su bolsa de inventos hacia la fábrica. La sigues… y llegas justo cuando todo estalla.' },
        ], next: 'e' },
        d_silco: { bg: 'sumidero', lines: [
          { s: 'narrador', t: 'Te deslizas entre tuberías. Ves a Silco junto a un hombre que mezcla líquidos violetas: Singed.' },
          { s: 'silco', t: 'Con esto, Zaun dejará de arrodillarse. Y ya no necesitaremos a Vander.' },
          { s: 'narrador', t: 'Sabes demasiado. Y Silco ha visto tu sombra.' },
        ], next: 'e' },
        e: { bg: 'sumidero', lines: [
          { s: 'narrador', t: 'Una explosión azul ilumina la fábrica. Cuando el humo se disipa, nada vuelve a ser igual.' },
          { s: 'narrador', t: 'Mylo y Claggor no se levantan. Vander tampoco. Vi y Powder se gritan cosas que no se pueden borrar.' },
          { s: 'vi', t: '¡Eres un gafe, Powder! ¡Un gafe!' },
          { s: 'narrador', t: 'Los ejecutores se llevan a Vi. Silco se lleva a Powder. Y tú te quedas {g:solo|sola|sole} en el humo… con una decisión por delante.' },
        ], end: true },
      },
    },
    {
      id: 'z3', route: 'zaun', title: 'Capítulo 3 · Siete años después',
      intro: 'Siete años. Zaun brilla de violeta: el Brillo corre por las calles y Silco manda. Has sobrevivido. Ahora toca decidir para quién.',
      unlocks: ['sevika', 'singed'],
      start: 'a',
      nodes: {
        a: { bg: 'ultima-gota', lines: [
          { s: 'narrador', t: 'La Última Gota ya no es de Vander. Ahora es el despacho de Silco. Y Sevika te espera en la barra con su brazo de metal.' },
          { s: 'sevika', t: '{name}. Dicen que eres buen{g:o|a|e} {job}. Silco necesita gente así. Paga bien y no pregunta.' },
        ], choices: [
          { t: 'Aceptar trabajar para Silco.', next: 'b_acepta', fx: { aff: { sevika: 2, silco: 2 }, rep: { zaun: 1 }, flags: ['trabaja_silco'] } },
          { t: 'Negarte: «Vander no habría querido esto.»', next: 'b_niega', fx: { aff: { sevika: -2 }, rep: { zaun: 1 }, flags: ['rechaza_silco'] } },
          { t: 'Fingir que aceptas para espiar (Carisma 2).', req: { stat: 'carisma', min: 2 }, next: 'b_doble', fx: { aff: { sevika: 1 }, flags: ['agente_doble'] } },
        ] },
        b_acepta: { bg: 'ultima-gota', lines: [
          { s: 'silco', t: 'Zaun necesita gente que entienda que la libertad cuesta. Bienvenid{g:o|a|e}.' },
          { s: 'sevika', t: 'Primer encargo: lleva este paquete al laboratorio de Singed. No lo abras.' },
        ], next: 'c' },
        b_niega: { bg: 'ultima-gota', lines: [
          { s: 'sevika', t: '(Se ríe sin ganas.) Vander está muerto. Los muertos no pagan alquileres.' },
          { s: 'narrador', t: 'Te marchas. Pero alguien deja un paquete a tu nombre en la puerta: un recado para Singed. En Zaun, un «no» también tiene precio.' },
        ], next: 'c' },
        b_doble: { bg: 'ultima-gota', lines: [
          { s: 'yo', t: 'Cuenta conmigo. Siempre me ha gustado trabajar para los que ganan.' },
          { s: 'sevika', t: 'Mmm. No me fío de ti. Pero Silco sí, y eso me basta. Llévale esto a Singed.' },
        ], next: 'c' },
        c: { bg: 'sumidero', lines: [
          { s: 'singed', t: 'Ah, el paquete. Déjalo ahí. (Algo gruñe tras una cortina.) No te preocupes por mi… paciente.' },
          { s: 'narrador', t: 'Una garra enorme araña los barrotes. Unos ojos casi humanos te miran con dolor.' },
        ], choices: [
          { t: 'Preguntar quién es el «paciente» (Valor 2).', req: { stat: 'valor', min: 2 }, next: 'd_pregunta', fx: { aff: { singed: 1 }, flags: ['vio_bestia'] } },
          { t: 'Salir de allí cuanto antes.', next: 'd_sale' },
          { t: 'Robar una muestra de Brillo para estudiarla (Sigilo 3).', req: { stat: 'sigilo', min: 3 }, next: 'd_roba', fx: { stats: { ingenio: 1 }, flags: ['muestra_brillo'] } },
        ] },
        d_pregunta: { bg: 'sumidero', lines: [
          { s: 'singed', t: 'Alguien que se negó a morir. La ciencia no juzga, {name}. Solo observa.' },
          { s: 'narrador', t: 'Te llevas un escalofrío… y la sensación de que conoces esa mirada.' },
        ], next: 'e' },
        d_sale: { bg: 'callejones', lines: [
          { s: 'narrador', t: 'Sales al aire viciado de los callejones como quien sale de una tumba.' },
        ], next: 'e' },
        d_roba: { bg: 'sumidero', lines: [
          { s: 'narrador', t: 'Mientras Singed apunta datos, un frasco violeta acaba en tu bolsillo. Si alguien quiere destruir el Brillo, primero hay que entenderlo.' },
        ], next: 'e' },
        e: { bg: 'callejones', lines: [
          { s: 'narrador', t: 'Una explosión de colores rompe la noche. Risas. Una chica de trenzas azules salta de un tejado a otro con un lanzacohetes con cara de tiburón.' },
          { s: 'jinx', t: '¿{name}? ¡No puede ser! ¡Estás viv{g:o|a|e}! ¿Has venido a jugar?', cond: { flag: 'con_powder' } },
          { s: 'jinx', t: '¿Y tú quién eres? Da igual. ¡Pareces divertid{g:o|a|e}! Te llamaré «Cosa».', cond: { notFlag: 'con_powder' } },
          { s: 'narrador', t: 'Powder ya no existe. Ahora se hace llamar Jinx.' },
        ], end: true },
      },
    },
    {
      id: 'z4', route: 'zaun', title: 'Capítulo 4 · Luciérnagas',
      intro: 'Un cargamento de Brillo ha desaparecido. Dicen que las Luciérnagas han vuelto a atacar. Silco quiere nombres.',
      unlocks: ['scar'],
      start: 'a',
      nodes: {
        a: { bg: 'arbol', lines: [
          { s: 'narrador', t: 'Una figura con máscara te intercepta en una aerotabla y te lleva, a ciegas, hasta un lugar imposible: un árbol gigante que brilla en la oscuridad.' },
          { s: 'scar', t: 'Hemos visto con quién andas. Más te vale tener una buena razón para no tirarte al vacío.' },
          { s: 'ekko', t: 'Tranquilo, Scar. {name} y yo nos conocemos. ¿Verdad que sí?' },
        ], choices: [
          { t: '«Ekko, sigo de vuestro lado. Siempre lo estuve.»', next: 'b_lado', req: { notFlag: 'trabaja_silco' }, fx: { aff: { ekko: 2, scar: 1 }, rep: { zaun: 1 } } },
          { t: '«Trabajo para Silco, pero quiero salir.» (Carisma 2)', req: { stat: 'carisma', min: 2 }, next: 'b_salir', fx: { aff: { ekko: 1, scar: -1 }, flags: ['quiere_salir'] } },
          { t: 'Contarles lo que viste en el laboratorio de Singed.', req: { flag: 'vio_bestia' }, next: 'b_info', fx: { aff: { ekko: 2, scar: 2 }, flags: ['info_luciernagas'] } },
          { t: 'Memorizar el camino para vendérselo a Silco.', next: 'b_traicion', fx: { aff: { silco: 2, sevika: 1 }, rep: { zaun: -1 }, flags: ['traiciona_luciernagas'] } },
        ] },
        b_lado: { bg: 'arbol', lines: [
          { s: 'ekko', t: 'Lo sabía. Mañana atacamos otro envío de Brillo. Nos vendría bien alguien que conozca las rutas de Silco.' },
        ], next: 'c' },
        b_salir: { bg: 'arbol', lines: [
          { s: 'ekko', t: 'Salir de Silco no es fácil. Pero aquí todos hemos salido de algo. Ayúdanos y te ayudaremos.' },
          { s: 'scar', t: 'Yo lo vigilaré. De cerca.' },
        ], next: 'c' },
        b_info: { bg: 'arbol', lines: [
          { s: 'ekko', t: '¿Una bestia en el laboratorio? Si Silco está creando monstruos… tenemos menos tiempo del que pensaba.' },
          { s: 'scar', t: 'Vale. Retiro lo de tirarte al vacío.' },
        ], next: 'c' },
        b_traicion: { bg: 'arbol', lines: [
          { s: 'narrador', t: 'Sonríes, asientes y cuentas los pasos. Cada rama, cada puente de cuerda. Silco pagará bien por esto.' },
          { s: 'ekko', t: 'Me alegro de verte, de verdad. Aquí arriba se respira mejor, ¿eh?' },
        ], next: 'c' },
        c: { bg: 'callejones', lines: [
          { s: 'narrador', t: 'La noche del ataque. Un convoy de Brillo avanza por los callejones custodiado por los matones de Sevika.' },
          { s: 'ekko', t: 'A mi señal. ¡Luciérnagas, ahora!' },
        ], choices: [
          { t: 'Pelear junto a las Luciérnagas (Valor 2).', req: { stat: 'valor', min: 2 }, next: 'd_pelea', fx: { aff: { ekko: 2, scar: 2, sevika: -2 }, rep: { zaun: 2 }, flags: ['heroe_luciernagas'] } },
          { t: 'Sabotear el convoy con química (Ingenio 3).', req: { stat: 'ingenio', min: 3 }, next: 'd_sabotaje', fx: { aff: { ekko: 3 }, rep: { zaun: 2 }, flags: ['heroe_luciernagas'] } },
          { t: 'Avisar a Sevika en el último momento.', req: { flag: 'traiciona_luciernagas' }, next: 'd_aviso', fx: { aff: { sevika: 3, silco: 2, ekko: -5, scar: -5 }, flags: ['luciernagas_caen'] } },
          { t: 'Quedarte al margen y observar.', next: 'd_margen', fx: { aff: { ekko: -1 } } },
        ] },
        d_pelea: { bg: 'callejones', lines: [
          { s: 'narrador', t: 'Pintura brillante, golpes y gritos. Cuando Sevika llega, el Brillo ya arde en el canal.' },
          { s: 'sevika', t: '{name}… Ya sabía yo. Silco se va a enterar de esto.' },
        ], next: 'e' },
        d_sabotaje: { bg: 'callejones', lines: [
          { s: 'narrador', t: 'Una mezcla tuya convierte los barriles en espuma inofensiva. Nadie resulta herido y el Brillo desaparece.' },
          { s: 'ekko', t: '¡Eso ha sido increíble! ¿Dónde aprendiste eso?' },
          { s: 'yo', t: 'Ser {job} en {district} enseña mucho.' },
        ], next: 'e' },
        d_aviso: { bg: 'callejones', lines: [
          { s: 'narrador', t: 'Un silbido. Sevika estaba preparada. Las Luciérnagas huyen en desbandada y Ekko te mira desde lo alto sin entender nada.' },
          { s: 'ekko', t: '¿Por qué…?' },
        ], next: 'e' },
        d_margen: { bg: 'callejones', lines: [
          { s: 'narrador', t: 'Ves cómo el caos lo decide todo sin ti. A veces no elegir también es elegir.' },
        ], next: 'e' },
        e: { bg: 'callejones', lines: [
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
          { s: 'vi', t: '¿{name}? (Te abraza tan fuerte que crujen tus costillas.) Pensé que no quedaba nadie.' },
          { s: 'vi', t: 'Aunque sigo acordándome de quién fue con el cuento a Vander, ¿eh?', cond: { flag: 'chivato' } },
          { s: 'caitlyn', t: 'Caitlyn Kiramman. Encantada. Vi dice que conoces Zaun mejor que nadie. Necesitamos encontrar a Silco.' },
        ], choices: [
          { t: '«Os llevaré hasta Jinx. Es lo que Vi necesita.»', next: 'b_jinx', fx: { aff: { vi: 2, jinx: 1 }, flags: ['guia_jinx'] } },
          { t: '«Silco está en La Última Gota. Os llevo.»', next: 'b_silco', fx: { aff: { caitlyn: 2 }, rep: { piltover: 1 }, flags: ['guia_silco'] } },
          { t: '«¿Una ejecutora en Zaun? Ni hablar.» (desconfiar)', next: 'b_desconfia', fx: { aff: { caitlyn: -2, scar: 1 }, rep: { zaun: 1 } } },
        ] },
        b_jinx: { bg: 'sumidero', lines: [
          { s: 'narrador', t: 'Les guías por los túneles donde Jinx tiene su escondite: dibujos de colores en las paredes, peluches con cabezas de muñeca y cohetes a medio montar.' },
          { s: 'jinx', t: '¿Vi? No. No, no, no. Estás muerta. Las voces me lo dijeron.' },
          { s: 'vi', t: 'Powder… soy yo.' },
        ], next: 'c' },
        b_silco: { bg: 'ultima-gota', lines: [
          { s: 'caitlyn', t: 'Si atrapamos a Silco, el Brillo se acaba. El Consejo tendrá que escucharnos.' },
          { s: 'narrador', t: 'Pero en La Última Gota no está Silco. Está Jinx, sentada en la barra, balanceando las piernas.' },
          { s: 'jinx', t: 'Hola, hermanita. Has tardado.' },
        ], next: 'c' },
        b_desconfia: { bg: 'callejones', lines: [
          { s: 'caitlyn', t: 'Lo entiendo. No te pido que confíes en el uniforme. Te pido que confíes en Vi.' },
          { s: 'vi', t: 'Cait es diferente, {name}. Por favor.' },
          { s: 'narrador', t: 'A regañadientes, les acompañas. En la puerta de La Última Gota os espera una chica de trenzas azules.' },
        ], next: 'c' },
        c: { bg: 'ultima-gota', lines: [
          { s: 'jinx', t: '¿Y tú, {name}? ¿De qué lado estás? ¿Del mío o del de esa ejecutora?' },
        ], choices: [
          { t: '«Del tuyo. Siempre del de la familia.»', next: 'd_familia', fx: { aff: { jinx: 3, caitlyn: -1 }, rep: { zaun: 1 } } },
          { t: '«Del de Vi. Ella nunca dejó de buscarte.» (Carisma 3)', req: { stat: 'carisma', min: 3 }, next: 'd_vi', fx: { aff: { jinx: 2, vi: 3 }, flags: ['puente_hermanas'] } },
          { t: '«Del de Zaun. Y Zaun está harto de explosiones.»', next: 'd_zaun', fx: { aff: { jinx: -1, ekko: 1 }, rep: { zaun: 1 } } },
        ] },
        d_familia: { bg: 'ultima-gota', lines: [
          { s: 'jinx', t: '(Sonríe de oreja a oreja.) ¡Lo sabía! Tú y yo vamos a hacer algo GRANDE.' },
        ], next: 'e' },
        d_vi: { bg: 'ultima-gota', lines: [
          { s: 'jinx', t: '(Baja el arma. Le tiembla la mano.) ¿Es verdad, Vi?' },
          { s: 'vi', t: 'Todos los días. Todos.' },
          { s: 'narrador', t: 'Por un instante, Powder vuelve a estar ahí.' },
        ], next: 'e' },
        d_zaun: { bg: 'ultima-gota', lines: [
          { s: 'jinx', t: 'Aburrid{g:o|a|e}. Zaun necesita fuegos artificiales para despertar.' },
        ], next: 'e' },
        e: { bg: 'ultima-gota', lines: [
          { s: 'narrador', t: 'Silco aparece en la escalera. Los ejecutores rodean el edificio. Y Jinx guarda algo en su bolsa: una gema hextec que zumba con un poder inmenso.' },
          { s: 'silco', t: 'Mañana, Piltover escuchará a Zaun. Por las buenas o por las malas.' },
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
          { s: 'heimerdinger', t: '¡Ah, puntualidad! Una virtud olvidada. Ha habido una explosión en un taller. Un tal Talis jugaba con magia. ¡Magia! En mi Academia.' },
        ], choices: [
          { t: '«Seguro que hay una explicación científica, profesor.»', next: 'b_ciencia', fx: { aff: { heimerdinger: 1, jayce: 1 } } },
          { t: '«La magia sin control es peligrosa. Tiene razón.»', next: 'b_razon', fx: { aff: { heimerdinger: 3, jayce: -1 } } },
          { t: '(Fijarte en el joven del bastón que toma notas.)', next: 'b_viktor', fx: { aff: { viktor: 2 }, stats: { ingenio: 1 } } },
        ] },
        b_ciencia: { bg: 'academia', lines: [
          { s: 'heimerdinger', t: 'Ciencia… Bueno, bueno. Quizá. Pero la paciencia también es una ciencia, joven.' },
        ], next: 'c' },
        b_razon: { bg: 'academia', lines: [
          { s: 'heimerdinger', t: '¡Por fin alguien sensato! Llevo un siglo diciéndolo. Un siglo.' },
        ], next: 'c' },
        b_viktor: { bg: 'academia', lines: [
          { s: 'viktor', t: '(Levanta la vista.) Viktor. Ayudante del profesor. Las notas de Talis… son extraordinarias. Aunque nadie quiera verlo.' },
        ], next: 'c' },
        c: { bg: 'taller-jayce', lines: [
          { s: 'jayce', t: '¿Vienes a cerrarme el taller tú también? Adelante. Que vean cómo entierran el futuro de Piltover.' },
          { s: 'jayce', t: 'La magia puede ser de todos. Solo necesito estabilizar las runas. Y nadie quiere ayudarme.' },
        ], choices: [
          { t: 'Ayudar a Jayce en secreto con sus cálculos (Ingenio 2).', req: { stat: 'ingenio', min: 2 }, next: 'd_ayuda', fx: { aff: { jayce: 3, viktor: 1 }, rep: { piltover: 1 }, flags: ['ayuda_hextec'] } },
          { t: 'Presentarle a Viktor: «Él sí cree en ti».', next: 'd_presenta', fx: { aff: { jayce: 2, viktor: 3 }, flags: ['une_jayce_viktor'] } },
          { t: 'Informar a Heimerdinger de lo que trama.', next: 'd_informa', fx: { aff: { heimerdinger: 2, jayce: -3 }, flags: ['delata_jayce'] } },
        ] },
        d_ayuda: { bg: 'taller-jayce', lines: [
          { s: 'narrador', t: 'Pasáis la noche entre fórmulas. Al amanecer, una gema flota sobre la mesa emitiendo una luz azul estable.' },
          { s: 'jayce', t: 'Funciona… ¡FUNCIONA! {name}, acabas de hacer historia conmigo.' },
        ], next: 'e' },
        d_presenta: { bg: 'taller-jayce', lines: [
          { s: 'viktor', t: 'Tu error está aquí, en la tercera runa. Si la alimentas de forma inversa…' },
          { s: 'jayce', t: '¿Cómo no lo vi antes? Viktor, ¿quieres ser mi socio?' },
          { s: 'narrador', t: 'Sin saberlo, acabas de juntar a los padres de la hextec.' },
        ], next: 'e' },
        d_informa: { bg: 'academia', lines: [
          { s: 'heimerdinger', t: 'Has hecho lo correcto. Aunque no lo parezca.' },
          { s: 'narrador', t: 'Esa noche, alguien entra a robar en el taller de Jayce. La explosión se oye hasta en Zaun.' },
        ], next: 'e' },
        e: { bg: 'academia', lines: [
          { s: 'narrador', t: 'El robo del taller de Talis llega al Consejo. Unos ladrones de Zaun… y una explosión que dejó una ciudad entera en vilo.' },
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
          { s: 'mel', t: 'Tú debes de ser {name}. He oído cosas interesantes de ti. Sobre todo, que sabes estar en la habitación correcta.' },
          { s: 'cassandra', t: 'Consejera Medarda, aquí se viene a votar, no a reclutar.' },
          { s: 'mel', t: 'Consejera Kiramman, todo voto empieza con una conversación.' },
        ], choices: [
          { t: 'Ganarte a Mel con elegancia (Carisma 2).', req: { stat: 'carisma', min: 2 }, next: 'b_mel', fx: { aff: { mel: 3 }, rep: { piltover: 1 }, flags: ['aliado_mel'] } },
          { t: 'Ponerte del lado de Cassandra: prudencia.', next: 'b_cass', fx: { aff: { cassandra: 3, mel: -1 } } },
          { t: 'Mencionar a tu familia.', req: { flag: 'familia_famosa' }, next: 'b_familia', fx: { aff: { mel: 1, cassandra: 1 }, rep: { piltover: 2 } } },
        ] },
        b_mel: { bg: 'consejo', lines: [
          { s: 'mel', t: 'Me gustas. Piltover tiene muchos inventores y muy pocos visionarios. Ayúdame a convencer al Consejo y la hextec tendrá fondos.' },
        ], next: 'c' },
        b_cass: { bg: 'consejo', lines: [
          { s: 'cassandra', t: 'Gracias. Alguien tiene que recordar que el progreso sin control acaba en tragedia. Lo veo cada día en el puente.' },
        ], next: 'c' },
        b_familia: { bg: 'consejo', lines: [
          { s: 'yo', t: 'Soy {name}, de la familia {family}. Creo que eso os dice de qué lado está la historia.' },
          { s: 'mel', t: '(Sonríe.) Un apellido es una herramienta. Úsalo bien.' },
        ], next: 'c' },
        c: { bg: 'consejo', lines: [
          { s: 'narrador', t: 'Jayce se presenta ante el Consejo con una gema hextec. Heimerdinger pide prudencia. La votación está igualada.' },
          { s: 'jayce', t: '(Te busca con la mirada.) {name}, di algo. Te escucharán.' },
        ], choices: [
          { t: 'Defender la hextec: «Es el futuro de todos».', next: 'd_si', fx: { aff: { jayce: 2, mel: 2, heimerdinger: -2 }, rep: { piltover: 1 }, flags: ['vota_hextec'] } },
          { t: 'Pedir que también beneficie a Zaun.', next: 'd_zaun', fx: { aff: { viktor: 3, cassandra: -1 }, rep: { zaun: 2 }, flags: ['hextec_zaun'] } },
          { t: 'Apoyar a Heimerdinger: «Aún no estamos preparados».', next: 'd_no', fx: { aff: { heimerdinger: 3, jayce: -2 } } },
        ] },
        d_si: { bg: 'consejo', lines: [
          { s: 'narrador', t: 'La votación se inclina. La hextec es aprobada. Piltover aplaude; Heimerdinger guarda silencio.' },
        ], next: 'e' },
        d_zaun: { bg: 'consejo', lines: [
          { s: 'narrador', t: 'Un murmullo incómodo recorre la sala. Pero Viktor, desde el fondo, asiente con una sonrisa cansada.' },
          { s: 'viktor', t: 'Gracias. Nadie dice eso aquí arriba.' },
        ], next: 'e' },
        d_no: { bg: 'consejo', lines: [
          { s: 'heimerdinger', t: 'Sabias palabras. Aunque me temo que el progreso no sabe esperar.' },
          { s: 'narrador', t: 'Mel mueve sus fichas. La hextec se aprueba igualmente, por un voto.' },
        ], next: 'e' },
        e: { bg: 'mansion-kiramman', lines: [
          { s: 'cassandra', t: 'Mi hija Caitlyn insiste en investigar el robo del taller por su cuenta. Es terca como su padre. Si la ves… vigílala por mí.' },
        ], end: true },
      },
    },
    {
      id: 'p3', route: 'piltover', title: 'Capítulo 3 · Placa y pólvora',
      intro: 'Siete años después. Piltover vive su edad dorada. Pero alguien ataca los envíos hextec, y el Brillo sube por el puente.',
      unlocks: ['caitlyn', 'marcus'],
      start: 'a',
      nodes: {
        a: { bg: 'piltover', lines: [
          { s: 'caitlyn', t: 'Tú conociste a mi madre en el Consejo, ¿verdad? Bien. Necesito a alguien que no lleve placa… o que no tenga miedo de ensuciarla.' },
          { s: 'caitlyn', t: 'Alguien está robando hextec y bajándola a Zaun. Y el sheriff Marcus no quiere que lo investigue.' },
        ], choices: [
          { t: 'Ayudar a Caitlyn a revisar los informes (Ingenio 2).', req: { stat: 'ingenio', min: 2 }, next: 'b_informes', fx: { aff: { caitlyn: 3 }, flags: ['pistas_cait'] } },
          { t: 'Hablar con Marcus para ganar tiempo (Carisma 2).', req: { stat: 'carisma', min: 2 }, next: 'b_marcus', fx: { aff: { marcus: 2, caitlyn: 1 } } },
          { t: '«No me meto en asuntos de ejecutores.»', next: 'b_no', fx: { aff: { caitlyn: -2 } } },
        ] },
        b_informes: { bg: 'piltover', lines: [
          { s: 'narrador', t: 'Entre papeles encontráis un patrón: cada robo coincide con un pago a la jefatura. Firma: M.' },
          { s: 'caitlyn', t: 'Marcus… lo sabía.' },
        ], next: 'c' },
        b_marcus: { bg: 'piltover', lines: [
          { s: 'marcus', t: 'La señorita Kiramman tiene buenas intenciones. Pero las buenas intenciones aquí matan gente. Dígale que lo deje.' },
          { s: 'narrador', t: 'Te fijas: le tiembla la mano al decirlo. Marcus no es un villano. Es un hombre asustado.' },
        ], next: 'c' },
        b_no: { bg: 'piltover', lines: [
          { s: 'caitlyn', t: 'Muy bien. Lo haré sola. Como siempre.' },
          { s: 'narrador', t: 'Al día siguiente, Caitlyn vuelve a buscarte. Ha encontrado algo y no tiene a nadie más.' },
        ], next: 'c' },
        c: { bg: 'stillwater', lines: [
          { s: 'caitlyn', t: 'Hay una presa en Stillwater que sabe quién es Silco. Se llama Vi. Si la saco de aquí, puede llevarnos hasta él.' },
          { s: 'narrador', t: 'La celda se abre. Una chica de pelo rosa, con un tatuaje en la cara, te mira de arriba abajo.' },
          { s: 'vi', t: '¿Y tú quién eres? ¿La niñera de la ejecutora?' },
        ], choices: [
          { t: '«Alguien que también quiere ver caer a Silco.»', next: 'd_silco', fx: { aff: { vi: 2 } } },
          { t: 'Hacer una broma sobre su tatuaje.', next: 'd_broma', fx: { aff: { vi: 1, caitlyn: 1 } } },
          { t: 'Tratarla como a una presa peligrosa.', next: 'd_presa', fx: { aff: { vi: -3, marcus: 1 } } },
        ] },
        d_silco: { bg: 'stillwater', lines: [
          { s: 'vi', t: 'Vale. Me caes bien. Un poco. No te emociones.' },
        ], next: 'e' },
        d_broma: { bg: 'stillwater', lines: [
          { s: 'vi', t: '«VI». Por si se me olvida cómo me llamo. Ja. Qué graciosill{g:o|a|e}.' },
          { s: 'caitlyn', t: '(Contiene una sonrisa.) Vámonos antes de que se arrepientan.' },
        ], next: 'e' },
        d_presa: { bg: 'stillwater', lines: [
          { s: 'vi', t: 'Lo pillo. Arriba todos sois iguales.' },
        ], next: 'e' },
        e: { bg: 'puente', lines: [
          { s: 'narrador', t: 'Marcus os ve salir de Stillwater. No dice nada. Pero al día siguiente, alguien en Zaun sabe que Vi ha vuelto.' },
        ], end: true },
      },
    },
    {
      id: 'p4', route: 'piltover', title: 'Capítulo 4 · El Día del Progreso',
      intro: 'Las hexpuertas abren. Piltover celebra. En el laboratorio, Viktor tose sangre y Sky le sostiene la mano.',
      unlocks: ['sky'],
      start: 'a',
      nodes: {
        a: { bg: 'hexpuertas', lines: [
          { s: 'narrador', t: 'Música, confeti y barcos que cruzan el istmo en un destello azul. El mundo entero mira a Piltover.' },
          { s: 'jayce', t: '¡{name}! Ven, sube al estrado. Hoy es el día que soñamos.', cond: { flag: 'ayuda_hextec' } },
          { s: 'jayce', t: 'Hoy cambia la historia, {name}. Deberías verlo desde primera fila.', cond: { notFlag: 'ayuda_hextec' } },
          { s: 'mel', t: 'Disfrútalo. Los días de gloria son cortos y las facturas, largas.' },
        ], next: 'b' },
        b: { bg: 'academia', lines: [
          { s: 'sky', t: 'Perdona, ¿puedes ayudarme? Es Viktor. No ha venido a la fiesta. Está en el laboratorio con… eso.' },
          { s: 'viktor', t: 'El Hexcore. Mira cómo se mueve. Aprende, {name}. Podría curar cualquier cosa. Incluso a mí.' },
        ], choices: [
          { t: 'Animarle a seguir: «Si puede salvarte, hazlo».', next: 'c_sigue', fx: { aff: { viktor: 3, sky: 1, heimerdinger: -1 }, flags: ['impulsa_hexcore'] } },
          { t: 'Pedirle que se detenga (Carisma 2).', req: { stat: 'carisma', min: 2 }, next: 'c_para', fx: { aff: { viktor: -1, sky: 2, heimerdinger: 2 }, flags: ['frena_hexcore'] } },
          { t: 'Analizar el Hexcore tú mism{g:o|a|e} (Ingenio 3).', req: { stat: 'ingenio', min: 3 }, next: 'c_analiza', fx: { aff: { viktor: 2 }, stats: { ingenio: 1 }, flags: ['entiende_hexcore'] } },
        ] },
        c_sigue: { bg: 'academia', lines: [
          { s: 'viktor', t: 'Gracias. Todos quieren que espere. No tengo tiempo para esperar.' },
          { s: 'sky', t: '(Te mira con preocupación.) Ojalá tengáis razón.' },
        ], next: 'd' },
        c_para: { bg: 'academia', lines: [
          { s: 'viktor', t: 'Hablas como Heimerdinger. (Suspira.) Lo pensaré. Por Sky.' },
        ], next: 'd' },
        c_analiza: { bg: 'academia', lines: [
          { s: 'narrador', t: 'Las runas laten como un corazón. No es solo energía: hay algo parecido a una voluntad. Y tiene hambre.' },
          { s: 'yo', t: 'Viktor, esto no obedece. Responde. Ten cuidado con lo que le pides.' },
        ], next: 'd' },
        d: { bg: 'puente', lines: [
          { s: 'narrador', t: 'Una explosión en la ceremonia. Una figura de trenzas azules se ríe desde los tejados antes de desaparecer hacia Zaun.' },
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
        ], choices: [
          { t: 'Intentar integrarte con la gente (Carisma 2).', req: { stat: 'carisma', min: 2 }, next: 'b_integra', fx: { aff: { vi: 2 }, rep: { zaun: 2 } } },
          { t: 'Mantener la mano cerca del arma (Valor 2).', req: { stat: 'valor', min: 2 }, next: 'b_arma', fx: { aff: { caitlyn: 1 }, rep: { zaun: -1 } } },
          { t: 'Pasar desapercibid{g:o|a|e} (Sigilo 2).', req: { stat: 'sigilo', min: 2 }, next: 'b_sigilo', fx: { aff: { vi: 1 }, stats: { sigilo: 1 } } },
          { t: 'Seguir a Vi sin abrir la boca.', next: 'b_sigue', fx: { aff: { vi: 1 } } },
        ] },
        b_sigue: { bg: 'callejones', lines: [
          { s: 'vi', t: 'Bien. Callad{g:o|a|e} y con los ojos abiertos. Aprendes rápido.' },
        ], next: 'c' },
        b_integra: { bg: 'callejones', lines: [
          { s: 'narrador', t: 'Compras un pincho de algo que prefieres no preguntar y charlas con la vendedora. Te cuenta que Silco se esconde en La Última Gota.' },
          { s: 'vi', t: 'Vaya. Tú sí que sabes.' },
        ], next: 'c' },
        b_arma: { bg: 'callejones', lines: [
          { s: 'narrador', t: 'Los zaunitas se apartan a tu paso. Y te miran con rabia. Un niño escupe a tus pies.' },
          { s: 'vi', t: 'Así es como nos ven a todos los de arriba. Ahora lo sabes.' },
        ], next: 'c' },
        b_sigilo: { bg: 'callejones', lines: [
          { s: 'narrador', t: 'Te mueves entre sombras y vapores. Escuchas a dos matones hablar de un árbol donde se esconden «los críos de las máscaras».' },
        ], next: 'c' },
        c: { bg: 'arbol', lines: [
          { s: 'narrador', t: 'Una emboscada. Figuras con máscaras sobre aerotablas os rodean. El líder se quita la máscara.' },
          { s: 'ekko', t: '¿Vi? ¿Estás viva? ¿Y te traes ejecutores a mi casa?' },
        ], choices: [
          { t: '«Venimos a parar a Silco. Igual que tú.»', next: 'd_alianza', fx: { aff: { ekko: 3 }, rep: { zaun: 1 }, flags: ['alianza_luciernagas'] } },
          { t: 'Proponer un pacto Piltover-Luciérnagas (Carisma 3).', req: { stat: 'carisma', min: 3 }, next: 'd_pacto', fx: { aff: { ekko: 3, caitlyn: 2 }, rep: { zaun: 2, piltover: 1 }, flags: ['alianza_luciernagas', 'pacto'] } },
          { t: 'Hablarle de la hextec para Zaun.', req: { flag: 'hextec_zaun' }, next: 'd_hextec', fx: { aff: { ekko: 2, viktor: 1 }, rep: { zaun: 2 }, flags: ['alianza_luciernagas'] } },
          { t: 'Amenazar con traer a los ejecutores.', next: 'd_amenaza', fx: { aff: { ekko: -4, vi: -2 }, rep: { zaun: -2, piltover: 1 } } },
        ] },
        d_alianza: { bg: 'arbol', lines: [
          { s: 'ekko', t: 'Vale. Por Vi. Pero si me traicionas, te tiro del árbol yo mismo.' },
        ], next: 'e' },
        d_pacto: { bg: 'arbol', lines: [
          { s: 'yo', t: 'Si Silco cae, el Consejo tendrá que escuchar a Zaun. Pero solo si estamos juntos.' },
          { s: 'ekko', t: '(Silencio largo.) Es la primera vez que alguien de arriba habla de «juntos». Trato hecho.' },
        ], next: 'e' },
        d_hextec: { bg: 'arbol', lines: [
          { s: 'ekko', t: '¿Hextec para Zaun? Si eso es verdad… igual no todos los de arriba son iguales.' },
        ], next: 'e' },
        d_amenaza: { bg: 'arbol', lines: [
          { s: 'ekko', t: 'Fuera de mi árbol. Vi, tú puedes quedarte. Tu amig{g:o|a|e}, no.' },
        ], next: 'e' },
        e: { bg: 'ultima-gota', lines: [
          { s: 'narrador', t: 'Esa noche, Jinx roba una gema hextec enorme. Silco promete que mañana Piltover escuchará a Zaun.' },
          { s: 'narrador', t: 'Mañana el Consejo se reúne. Mañana todo cambia.' },
        ], end: true },
      },
    },

    // ======================= FINAL COMPARTIDO =======================
    {
      id: 'fin', route: 'ambas', title: 'Capítulo final · El Puente',
      intro: 'Las dos ciudades contienen el aliento. El Consejo vota la paz. Jinx tiene un cohete. Y tú estás en medio.',
      unlocks: ['jinx', 'silco', 'jayce', 'mel', 'caitlyn', 'vi', 'ambessa', 'loris'],
      start: 'a',
      nodes: {
        a: { bg: 'puente', lines: [
          { s: 'narrador', t: 'Amanece sobre el Puente del Progreso. Arriba, el Consejo debate un tratado con Zaun. Abajo, una chica de trenzas azules carga un cohete con una gema que podría arrasar media ciudad.' },
          { s: 'jinx', t: '¡Mira, {name}! Mi obra maestra. ¿Le pongo un lazo?' },
          { s: 'vi', t: '(Por el comunicador.) {name}, ¿me oyes? Estamos en camino. ¡Haz lo que puedas!' },
        ], choices: [
          { t: 'Hablar con Jinx de corazón (Afinidad con Jinx 5).', req: { aff: ['jinx', 5] }, next: 'b_jinx', fx: { flags: ['jinx_escucha'] } },
          { t: 'Sabotear el cohete (Ingenio 3).', req: { stat: 'ingenio', min: 3 }, next: 'b_sabotaje', fx: { flags: ['cohete_saboteado'] } },
          { t: 'Correr al Consejo para evacuar (Valor 2).', req: { stat: 'valor', min: 2 }, next: 'b_evacua', fx: { rep: { piltover: 2 }, flags: ['evacuacion'] } },
          { t: 'Dejar que Zaun hable a su manera.', next: 'b_deja', fx: { rep: { zaun: 2, piltover: -3 }, flags: ['deja_cohete'] } },
        ] },
        b_jinx: { bg: 'puente', lines: [
          { s: 'yo', t: 'Powder. No necesitas esto para que te vean. Yo te veo. Vi te ve.' },
          { s: 'jinx', t: '(Se le quiebra la voz.) Si no lo lanzo… ¿quién soy?' },
          { s: 'yo', t: 'Quien tú quieras ser. Esa es la parte divertida.' },
        ], next: 'c' },
        b_sabotaje: { bg: 'puente', lines: [
          { s: 'narrador', t: 'Mientras Jinx canta, desconectas un cable. Luego otro. El zumbido de la gema baja de tono.' },
          { s: 'jinx', t: '¿Qué haces? ¡Oye! ¡Ese es mi cable favorito!' },
        ], next: 'c' },
        b_evacua: { bg: 'consejo', lines: [
          { s: 'narrador', t: 'Irrumpes en la Sala del Consejo gritando. Jayce te reconoce. Mel duda un segundo… y ordena desalojar.' },
          { s: 'jayce', t: '¡Fuera todos! ¡Ya!' },
        ], next: 'c' },
        b_deja: { bg: 'puente', lines: [
          { s: 'narrador', t: 'Te das la vuelta. A veces la historia se escribe con fuego. Esperas que no sea con el tuyo.' },
        ], next: 'c' },
        c: { bg: 'consejo', lines: [
          { s: 'narrador', t: 'El último momento llega. Todo lo que has hecho, cada amistad, cada traición, pesa en la balanza.' },
        ], next: 'final' },
        // El nodo 'final' se resuelve por código según el estado (ver ENDINGS).
        final: { bg: 'consejo', ending: true },
      },
    },
  ],

  // Orden de capítulos por ruta.
  routes: {
    zaun: ['z1', 'z2', 'z3', 'z4', 'z5', 'fin'],
    piltover: ['p1', 'p2', 'p3', 'p4', 'p5', 'fin'],
  },

  // Finales: se elige el primero cuya condición se cumple.
  endings: [
    {
      id: 'paz', title: 'Final · El puente de los dos mundos',
      test: (st) => (st.flags.jinx_escucha || st.flags.cohete_saboteado) && (st.flags.pacto || st.flags.puente_hermanas || st.flags.alianza_luciernagas || (st.rep.zaun >= 3 && st.rep.piltover >= 1)),
      lines: [
        { s: 'narrador', t: 'El cohete nunca despega. En su lugar, Jinx baja del tejado de la mano de Vi.' },
        { s: 'caitlyn', t: 'El Consejo firmará el tratado. Y esta vez Zaun tendrá voz. Gracias a ti, {name}.' },
        { s: 'ekko', t: 'Quién lo iba a decir. Arriba y abajo en la misma mesa.' },
        { s: 'narrador', t: 'No es el final de los problemas. Pero es el principio de algo distinto. Y lleva tu nombre.' },
        { s: 'ambessa', t: '(Desde un balcón, una mujer con armadura noxiana te observa.) Interesante. Muy interesante.' },
      ],
    },
    {
      id: 'zaun_libre', title: 'Final · Zaun se levanta',
      test: (st) => st.flags.deja_cohete && st.rep.zaun >= 3,
      lines: [
        { s: 'narrador', t: 'Una luz azul atraviesa el cielo. La Sala del Consejo estalla en mil cristales.' },
        { s: 'jinx', t: '¡Lo hemos hecho, {name}! ¡Ahora sí que nos ven!' },
        { s: 'silco', t: 'Zaun será libre. Aunque tenga que nacer entre cenizas.' },
        { s: 'narrador', t: 'En los callejones te aclaman. En Piltover, tu cara aparece en todos los carteles de búsqueda.' },
        { s: 'ambessa', t: '(En Noxus, alguien sonríe.) Una ciudad en guerra es una ciudad que se puede comprar.' },
      ],
    },
    {
      id: 'orden', title: 'Final · El orden de Piltover',
      test: (st) => st.flags.evacuacion || st.rep.piltover >= 3,
      lines: [
        { s: 'narrador', t: 'El cohete impacta, pero la sala está vacía. Nadie muere. Piltover te llama héroe.' },
        { s: 'jayce', t: 'Has salvado al Consejo, {name}. Pero me temo que esto significa guerra con Zaun.' },
        { s: 'mel', t: 'Los héroes son útiles. Hasta que dejan de serlo. Cuídate.' },
        { s: 'loris', t: 'Oye, ¿tú no eras {g:el|la|le} de la evacuación? ¡Te invito a una cerveza!' },
        { s: 'narrador', t: 'Las puertas del puente se cierran. Desde arriba, Zaun parece más lejos que nunca.' },
      ],
    },
    {
      id: 'humo', title: 'Final · Solo humo',
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
