// Guía rápida de personajes para quien no ha visto Arcane. Se enseña antes del primer
// capítulo (según la ciudad elegida) y al empezar la Parte II con quienes llegan nuevos.
// Sin spoilers: cuenta quién es cada uno al empezar esa parte, no lo que le pasará.
window.GUIA = {
  titulo: 'Guía rápida: ¿quién es quién?',
  intro: {
    zaun: 'Empiezas en Zaun, la ciudad de abajo: fábricas, humo químico y gente que sobrevive como puede bajo la sombra de Piltover. Estas son las personas que vas a conocer primero.',
    piltover: 'Empiezas en Piltover, la Ciudad del Progreso: academias, mansiones y un Consejo que decide por todos. Estas son las personas que vas a conocer primero.',
    t2: 'Han pasado cosas graves y las dos ciudades ya no son las mismas. Llegan caras nuevas y las de siempre han cambiado. Un repaso antes de seguir.',
  },
  // Orden en que se presentan. «otros» se nombran al final en una línea.
  orden: {
    zaun: ['vander', 'vi', 'jinx', 'ekko', 'silco', 'sevika'],
    piltover: ['jayce', 'viktor', 'heimerdinger', 'caitlyn', 'cassandra', 'mel'],
    t2: ['ambessa', 'maddie', 'isha', 'kino'],
  },
  otros: {
    zaun: 'Al otro lado del puente oirás hablar de Jayce, Viktor, Caitlyn y el Consejo de Piltover.',
    piltover: 'Bajo tus pies, en Zaun, viven Vander, sus chicas Vi y Powder, y un hombre peligroso llamado Silco.',
    t2: 'Y las de siempre: Vi, Jinx, Caitlyn, Jayce, Viktor, Mel, Ekko y Sevika siguen ahí, pero ninguno es quien era.',
  },
  fichas: {
    vander: {
      titulo: 'El padre de los callejones',
      quien: 'Lleva La Última Gota, la taberna donde todo Zaun acaba bebiendo. Crió a Vi y a Powder como si fueran sus hijas.',
      porque: 'Hace años lideró una revuelta contra Piltover que terminó en una masacre en el puente. Desde entonces prefiere una paz injusta a otra guerra.',
    },
    vi: {
      titulo: 'Puños y lealtad',
      quien: 'Hermana mayor de Powder. Pelea mejor que nadie de su edad y se mete en líos para proteger a los suyos.',
      porque: 'Perdió a sus padres en la revuelta del puente. Desde entonces su familia es lo único que tiene, y no piensa perderla.',
    },
    jinx: {
      titulo: 'Powder, la pequeña inventora',
      quien: 'Al empezar es Powder, la hermana pequeña de Vi: lista, nerviosa y llena de cachivaches que casi nunca funcionan como debe.',
      porque: 'Quiere demostrar que no es un estorbo para su hermana. Más adelante la conocerás por otro nombre: Jinx.',
    },
    ekko: {
      titulo: 'El chaval del árbol',
      quien: 'Amigo de Powder, el más pequeño de la pandilla. Rápido, ingenioso y siempre con un invento entre manos.',
      porque: 'Creció entre los cachivaches de Benzo. Cree que Zaun puede ser otra cosa si la gente se cuida entre sí.',
    },
    silco: {
      titulo: 'El hombre que quiere una nación',
      quien: 'Un antiguo compañero de armas de Vander que hoy controla el mercado negro desde las sombras.',
      porque: 'Sueña con un Zaun independiente de Piltover y está dispuesto a pagar cualquier precio. Vander y él tienen una deuda pendiente.',
    },
    sevika: {
      titulo: 'La mano derecha',
      quien: 'Luchadora curtida que trabaja para Silco. Si hay que romper algo, la mandan a ella.',
      porque: 'No cree en discursos: cree en quien le paga y en quien no se rinde. Respeta la fuerza más que las palabras.',
    },
    jayce: {
      titulo: 'El inventor con prisa',
      quien: 'Joven inventor de Piltover obsesionado con convertir la magia en una herramienta para todos.',
      porque: 'De niño la magia le salvó la vida. Ahora quiere demostrarle a la Academia que no está loco.',
    },
    viktor: {
      titulo: 'El genio de Zaun en la Academia',
      quien: 'Ayudante del decano Heimerdinger. Nació en Zaun, camina con muleta y piensa más rápido que nadie.',
      porque: 'Está enfermo y lo sabe. Quiere que la ciencia mejore la vida de la gente de abajo antes de que se le acabe el tiempo.',
    },
    heimerdinger: {
      titulo: 'El decano centenario',
      quien: 'Un yordle que lleva siglos al frente de la Academia de Piltover. Sabio, amable y muy, muy prudente.',
      porque: 'Ha visto demasiado como para fiarse del progreso rápido. Teme lo que la magia puede hacer en manos humanas.',
    },
    caitlyn: {
      titulo: 'La heredera que no quiere serlo',
      quien: 'Hija de la familia Kiramman, una de las más ricas de Piltover. Tiradora excelente y curiosa sin remedio.',
      porque: 'Podría tenerlo todo sin mover un dedo, pero quiere ser útil y descubrir qué pasa de verdad en su ciudad.',
    },
    cassandra: {
      titulo: 'La consejera',
      quien: 'Madre de Caitlyn y miembro del Consejo que gobierna Piltover.',
      porque: 'Protege a su familia y a su ciudad por encima de todo, aunque eso la haga parecer fría.',
    },
    mel: {
      titulo: 'La consejera que vino de fuera',
      quien: 'Miembro del Consejo, elegante y con un ojo infalible para las buenas inversiones.',
      porque: 'Viene de Noxus, un imperio guerrero, y huyó de esa forma de vivir. En Piltover busca poder sin espadas.',
    },
    ambessa: {
      titulo: 'La señora de la guerra',
      quien: 'Madre de Mel y general de Noxus. Llega a Piltover con ofertas de alianza y un pequeño ejército.',
      porque: 'Cree que solo los fuertes sobreviven y que la hextec puede ganar guerras. No hace nada sin un motivo.',
    },
    maddie: {
      titulo: 'La ejecutora de confianza',
      quien: 'Agente de los ejecutores de Piltover que trabaja al lado de Caitlyn.',
      porque: 'Admira a Caitlyn y quiere estar a su altura. Es eficiente, cercana y siempre está donde hace falta.',
    },
    isha: {
      titulo: 'La niña sin voz',
      quien: 'Una niña de Zaun que no habla, se esconde donde nadie mira y se cruza en el camino de Jinx.',
      porque: 'No tiene a nadie. Encuentra en Jinx lo más parecido a una hermana mayor, para bien y para mal.',
    },
    kino: {
      titulo: 'El hermano de Mel',
      quien: 'Hijo de Ambessa y hermano pequeño de Mel.',
      porque: 'Como Mel, prefería las palabras a las espadas. Su nombre pesa mucho en la familia.',
    },
  },
};
