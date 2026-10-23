// Caitlyn, Jayce, Viktor y Mel. Cada texto: [español, inglés, francés].
const o = (t, tone, say, go, fx) => ({ t, tone, say, go, ...(fx ? { fx } : {}) });
module.exports = {
  // ============================================================ CAITLYN
  caitlyn: {
    entry: o(['¿Tienes un rato para hablar de todo y de nada?', 'Got a while to talk about everything and nothing?', 'Tu as un moment pour parler de tout et de rien ?'], 'amable', null, 'h_raiz'),
    nodes: {
      h_raiz: {
        say: [['(Cierra el expediente y lo aparta.) Supongo que el caso puede esperar diez minutos. Quizá veinte.', '(Closes the case file and pushes it aside.) I suppose the case can wait ten minutes. Maybe twenty.', '(Elle referme le dossier et le pousse.) Je suppose que l\'affaire peut attendre dix minutes. Peut-être vingt.']],
        again: [['Has vuelto. Empiezo a pensar que vienes más por la charla que por los informes.', 'You\'re back. I\'m starting to think you come for the talk more than the reports.', 'Te revoilà. Je commence à croire que tu viens plus pour la conversation que pour les rapports.'],
          ['(Sirve dos tazas de té sin preguntar.) Bien. ¿De qué hablamos hoy?', '(Pours two cups of tea without asking.) Good. What shall we talk about today?', '(Elle sert deux tasses de thé sans demander.) Bien. De quoi parlons-nous aujourd\'hui ?']],
        opts: [
          o(['¿Cómo fue crecer en la casa Kiramman?', 'What was it like growing up in the Kiramman house?', 'C\'était comment de grandir chez les Kiramman ?'], 'pregunta', null, 'h_a1'),
          o(['¿Cómo aprendiste a disparar así?', 'How did you learn to shoot like that?', 'Comment as-tu appris à tirer comme ça ?'], 'pregunta', null, 'h_b1'),
          o(['¿Qué haces cuando no estás trabajando?', 'What do you do when you\'re not working?', 'Que fais-tu quand tu ne travailles pas ?'], 'broma', null, 'h_c1'),
        ],
      },
      h_a1: {
        say: [['Silenciosa. Alfombras gruesas, cenas de doce cubiertos y nadie diciendo lo que pensaba. Aprendí a leer a la gente por cómo dejaba la cuchara.', 'Quiet. Thick rugs, twelve-course dinners and nobody saying what they thought. I learned to read people by how they set down their spoon.', 'Silencieuse. Tapis épais, dîners de douze couverts et personne ne disant ce qu\'il pensait. J\'ai appris à lire les gens à leur façon de poser la cuillère.']],
        again: [['Mi infancia no ha cambiado desde la última vez, por si lo dudabas. Sigue siendo igual de silenciosa.', 'My childhood hasn\'t changed since last time, in case you wondered. Still just as quiet.', 'Mon enfance n\'a pas changé depuis la dernière fois, au cas où. Toujours aussi silencieuse.']],
        opts: [
          o(['¿Y qué dice de mí cómo dejo la cuchara?', 'And what does my spoon say about me?', 'Et que dit ma cuillère de moi ?'], 'coqueto', [['(Arquea una ceja.) Que no has dejado ninguna, porque no hay cuchara. Y que intentas distraerme.', '(Raises an eyebrow.) That you haven\'t set one down, because there isn\'t one. And that you\'re trying to distract me.', '(Elle hausse un sourcil.) Que tu n\'en as posé aucune, parce qu\'il n\'y en a pas. Et que tu essaies de me distraire.']], 'h_a2', { aff: 1 }),
          o(['Suena solitario.', 'Sounds lonely.', 'Ça semble solitaire.'], 'amable', [['Lo era. Por eso me escapaba a la biblioteca de mi padre. Los libros no fingían.', 'It was. That\'s why I\'d slip off to my father\'s library. Books didn\'t pretend.', 'Ça l\'était. C\'est pour ça que je filais dans la bibliothèque de mon père. Les livres ne faisaient pas semblant.']], 'h_a2', { aff: 1 }),
          o(['Pobre niña rica.', 'Poor little rich girl.', 'Pauvre petite fille riche.'], 'duro', [['(Fría.) Sé lo que tenía. No te he pedido compasión, solo has preguntado.', '(Cold.) I know what I had. I didn\'t ask for pity; you asked.', '(Froide.) Je sais ce que j\'avais. Je n\'ai pas demandé ta pitié ; c\'est toi qui as posé la question.']], 'h_a2', { aff: -1 }),
        ],
      },
      h_a2: {
        say: [['Mi padre me leía novelas de detectives. Yo me sabía el culpable antes del capítulo tres y él fingía sorprenderse.', 'My father read me detective novels. I knew the culprit before chapter three and he pretended to be surprised.', 'Mon père me lisait des romans policiers. Je trouvais le coupable avant le chapitre trois et il faisait semblant d\'être surpris.']],
        opts: [
          o(['¿Cuál era tu favorita?', 'Which was your favourite?', 'Lequel était ton préféré ?'], 'pregunta', [['«El reloj del faro». El asesino era el farero. Obvio: era el único que sabía a qué hora se apagaba la luz.', '"The Lighthouse Clock". The killer was the keeper. Obvious: he was the only one who knew when the light went out.', '« L\'Horloge du phare ». L\'assassin était le gardien. Évident : il était le seul à savoir quand la lumière s\'éteignait.']], 'h_a3'),
          o(['Ya de pequeña eras detective.', 'You were a detective even as a kid.', 'Tu étais déjà détective, petite.'], 'amable', [['Era insoportable, más bien. Interrogaba al servicio sobre galletas desaparecidas.', 'I was insufferable, more like. I interrogated the staff about missing biscuits.', 'J\'étais insupportable, plutôt. J\'interrogeais le personnel sur des biscuits disparus.']], 'h_a3', { aff: 1 }),
          o(['¿Resolviste lo de las galletas?', 'Did you solve the biscuit case?', 'Tu as résolu l\'affaire des biscuits ?'], 'broma', [['Fui yo. Sonámbula. Caso cerrado y mi primera lección de humildad.', 'It was me. Sleepwalking. Case closed, and my first lesson in humility.', 'C\'était moi. Somnambule. Affaire classée, et ma première leçon d\'humilité.']], 'h_a3', { aff: 1 }),
        ],
      },
      h_a3: {
        say: [['A veces pienso que me hice ejecutora para vivir dentro de una de esas novelas. Luego descubrí que en las de verdad el culpable a veces gana.', 'Sometimes I think I became an enforcer to live inside one of those novels. Then I found out that in real ones the culprit sometimes wins.', 'Parfois je pense que je suis devenue exécutrice pour vivre dans un de ces romans. Puis j\'ai découvert que dans la réalité, le coupable gagne parfois.']],
        opts: [
          o(['Por eso hace falta gente como tú.', 'That\'s why people like you are needed.', 'C\'est pour ça qu\'il faut des gens comme toi.'], 'amable', [['(Sonríe apenas.) Gracias. Y gente que sepa apuntar. ¿Quieres saber cómo aprendí?', '(A faint smile.) Thank you. And people who can aim. Want to know how I learned?', '(Un léger sourire.) Merci. Et des gens qui savent viser. Tu veux savoir comment j\'ai appris ?']], 'h_b1', { aff: 1 }),
          o(['¿Y qué haces para no pensar en eso?', 'And what do you do to stop thinking about it?', 'Et que fais-tu pour ne pas y penser ?'], 'pregunta', [['Buena pregunta. Más de lo que crees.', 'Good question. More than you\'d think.', 'Bonne question. Plus que tu ne le crois.']], 'h_c1'),
          o(['Volvamos al principio.', 'Let\'s go back to the start.', 'Revenons au début.'], 'serio', [['Como en una buena investigación: siempre se vuelve al principio.', 'Like any good investigation: you always go back to the start.', 'Comme dans toute bonne enquête : on revient toujours au début.']], 'h_raiz'),
        ],
      },
      h_b1: {
        say: [['Con un rifle de caza de mi madre, en el jardín, disparando a manzanas. Mi madre lo odiaba. Mi padre me compraba más manzanas.', 'With my mother\'s hunting rifle, in the garden, shooting apples. Mother hated it. Father bought me more apples.', 'Avec le fusil de chasse de ma mère, dans le jardin, en tirant sur des pommes. Ma mère détestait ça. Mon père m\'achetait d\'autres pommes.']],
        again: [['Todavía practico con manzanas a veces. Las costumbres de familia no mueren.', 'I still practise on apples sometimes. Family habits die hard.', 'Je m\'entraîne encore sur des pommes parfois. Les habitudes de famille ont la vie dure.']],
        opts: [
          o(['¿Cuál es el truco para no fallar?', 'What\'s the trick to never missing?', 'Quel est le truc pour ne jamais rater ?'], 'pregunta', [['Respirar. Disparar al final de la espiración, cuando el cuerpo está quieto. Y no pensar en quién te mira.', 'Breathe. Fire at the end of the exhale, when the body is still. And don\'t think about who\'s watching.', 'Respirer. Tirer à la fin de l\'expiration, quand le corps est immobile. Et ne pas penser à qui te regarde.']], 'h_b2', { stats: { ingenio: 1 } }),
          o(['Pobres manzanas.', 'Poor apples.', 'Pauvres pommes.'], 'broma', [['Acabaron en tarta. Es un final digno.', 'They ended up in a pie. A dignified end.', 'Elles ont fini en tarte. Une fin digne.']], 'h_b2', { aff: 1 }),
          o(['Me encantaría verte disparar.', 'I\'d love to see you shoot.', 'J\'adorerais te voir tirer.'], 'coqueto', [['(Ajusta la mira sin mirarte.) Es fácil. Solo tienes que no moverte. Ni hablar.', '(Adjusts the scope without looking at you.) Easy. You just have to not move. Or talk.', '(Elle ajuste la lunette sans te regarder.) Facile. Il suffit de ne pas bouger. Ni parler.']], 'h_b2'),
        ],
      },
      h_b2: {
        say: [['El rifle no es lo difícil. Lo difícil es decidir cuándo NO apretar el gatillo.', 'The rifle isn\'t the hard part. The hard part is deciding when NOT to pull the trigger.', 'Le fusil n\'est pas le plus dur. Le plus dur, c\'est de décider quand NE PAS appuyer sur la détente.']],
        opts: [
          o(['¿Te ha pasado alguna vez?', 'Has that ever happened to you?', 'Ça t\'est déjà arrivé ?'], 'serio', [['(Mira hacia la ventana.) Más de una. Y no siempre elegí bien.', '(Looks toward the window.) More than once. And I didn\'t always choose well.', '(Elle regarde vers la fenêtre.) Plus d\'une fois. Et je n\'ai pas toujours bien choisi.']], 'h_b3'),
          o(['Esa duda es lo que te hace buena.', 'That doubt is what makes you good.', 'Ce doute, c\'est ce qui te rend bonne.'], 'amable', [['Vi diría lo mismo. Luego me robaría el último bollo.', 'Vi would say the same. Then she\'d steal the last bun.', 'Vi dirait pareil. Puis elle me volerait la dernière brioche.']], 'h_b3', { aff: 1 }),
          o(['En Zaun no dudamos tanto.', 'In Zaun we don\'t hesitate that much.', 'À Zaun, on n\'hésite pas autant.'], 'duro', [['Lo sé. Y por eso en Zaun hay más funerales. No es un reproche. Es una cifra.', 'I know. And that\'s why Zaun has more funerals. It\'s not a reproach. It\'s a statistic.', 'Je sais. Et c\'est pour ça qu\'il y a plus d\'enterrements à Zaun. Ce n\'est pas un reproche. C\'est un chiffre.']], 'h_b3'),
        ],
      },
      h_b3: {
        say: [['Bueno. Basta de lecciones de tiro. Si sigo, te pongo a practicar ahora mismo.', 'Well. Enough shooting lessons. If I keep going, I\'ll have you practising right now.', 'Bon. Assez de leçons de tir. Si je continue, je te fais t\'entraîner tout de suite.']],
        opts: [
          o(['¿Y qué haces para desconectar?', 'And what do you do to switch off?', 'Et que fais-tu pour décrocher ?'], 'pregunta', [['¿Desconectar? Uf. Te lo cuento, pero no te rías.', 'Switch off? Ugh. I\'ll tell you, but don\'t laugh.', 'Décrocher ? Ouf. Je te le dis, mais ne ris pas.']], 'h_c1'),
          o(['Háblame más de tu padre.', 'Tell me more about your father.', 'Parle-moi encore de ton père.'], 'amable', [['Tobias. Un buen hombre en una casa de buenas formas. Te cuento.', 'Tobias. A good man in a house of good manners. Let me tell you.', 'Tobias. Un homme bon dans une maison de bonnes manières. Je te raconte.']], 'h_a1'),
          o(['Practiquemos otro día. Hablemos de otra cosa.', 'Let\'s practise another day. Talk about something else.', 'On s\'entraînera un autre jour. Parlons d\'autre chose.'], 'broma', [['Cobardía táctica. Lo respeto.', 'Tactical cowardice. I respect it.', 'Lâcheté tactique. Je respecte.']], 'h_raiz'),
        ],
      },
      h_c1: {
        say: [['Hago puzles. De mil piezas. Sin mirar la caja. (Carraspea.) Y a veces toco el piano fatal, a solas.', 'I do puzzles. A thousand pieces. Without looking at the box. (Clears her throat.) And sometimes I play the piano badly, alone.', 'Je fais des puzzles. Mille pièces. Sans regarder la boîte. (Elle s\'éclaircit la gorge.) Et parfois je joue mal du piano, seule.']],
        again: [['El puzle de la última vez sigue a medias. Le falta el cielo. Siempre falta el cielo.', 'Last time\'s puzzle is still half done. It\'s missing the sky. The sky is always missing.', 'Le puzzle de la dernière fois est toujours à moitié fait. Il manque le ciel. Il manque toujours le ciel.']],
        opts: [
          o(['¿Sin mirar la caja? Eso es de psicópata.', 'Without the box? That\'s psychopath behaviour.', 'Sans la boîte ? C\'est un truc de psychopathe.'], 'broma', [['(Se ríe, sorprendida.) Es de detective. Hay una diferencia… pequeña.', '(Laughs, surprised.) It\'s detective behaviour. There\'s a difference… a small one.', '(Elle rit, surprise.) C\'est un truc de détective. Il y a une différence… petite.']], 'h_c2', { aff: 1 }),
          o(['Tócame algo un día.', 'Play me something one day.', 'Joue-moi quelque chose un jour.'], 'coqueto', [['Ni hablar. Bueno… quizá. Si prometes no aplaudir por compromiso.', 'Absolutely not. Well… maybe. If you promise not to clap out of politeness.', 'Hors de question. Enfin… peut-être. Si tu promets de ne pas applaudir par politesse.']], 'h_c2', { aff: 1 }),
          o(['¿Nunca descansas de verdad?', 'Do you never really rest?', 'Tu ne te reposes jamais vraiment ?'], 'serio', [['Descansar me pone nerviosa. Siempre hay alguien a quien no hemos encontrado a tiempo.', 'Resting makes me nervous. There\'s always someone we didn\'t find in time.', 'Me reposer me rend nerveuse. Il y a toujours quelqu\'un qu\'on n\'a pas trouvé à temps.']], 'h_c2'),
        ],
      },
      h_c2: {
        say: [['¿Y tú? Seguro que tienes alguna afición vergonzosa. Todo el mundo la tiene.', 'And you? I\'m sure you have some embarrassing hobby. Everyone does.', 'Et toi ? Je suis sûre que tu as un passe-temps embarrassant. Tout le monde en a un.']],
        opts: [
          o(['Colecciono tornillos raros.', 'I collect odd screws.', 'Je collectionne les vis bizarres.'], 'broma', [['¿Tornillos? Vale, me ganas. Jinx te adoraría, por cierto. Eso no es un cumplido.', 'Screws? Fine, you win. Jinx would adore you, by the way. That\'s not a compliment.', 'Des vis ? D\'accord, tu gagnes. Jinx t\'adorerait, d\'ailleurs. Ce n\'est pas un compliment.']], 'h_c3', { aff: 1 }),
          o(['Escribo lo que pasa en estas calles.', 'I write down what happens on these streets.', 'J\'écris ce qui se passe dans ces rues.'], 'serio', [['Eso no es vergonzoso, es útil. Guárdalo. Algún día alguien necesitará la verdad escrita.', 'That\'s not embarrassing, it\'s useful. Keep it. Someday someone will need the truth written down.', 'Ce n\'est pas embarrassant, c\'est utile. Garde-le. Un jour, quelqu\'un aura besoin de la vérité écrite.']], 'h_c3', { aff: 1 }),
          o(['Ninguna. Soy perfect{g:o|a|e}.', 'None. I\'m perfect.', 'Aucun. Je suis parfait{g:|e|·e}.'], 'astuto', [['Eso es exactamente lo que diría alguien con una afición muy vergonzosa. Lo averiguaré.', 'That\'s exactly what someone with a very embarrassing hobby would say. I\'ll find out.', 'C\'est exactement ce que dirait quelqu\'un avec un passe-temps très embarrassant. Je trouverai.']], 'h_c3'),
        ],
      },
      h_c3: {
        say: [['(Mira el reloj y no se levanta.) Debería volver al trabajo. Debería.', '(Checks the clock and doesn\'t get up.) I should get back to work. I should.', '(Elle regarde l\'horloge et ne se lève pas.) Je devrais retourner travailler. Je devrais.']],
        opts: [
          o(['Cinco minutos más.', 'Five more minutes.', 'Encore cinq minutes.'], 'amable', [['Cinco. Ni uno más. (No mira el reloj otra vez.)', 'Five. Not one more. (Doesn\'t look at the clock again.)', 'Cinq. Pas une de plus. (Elle ne regarde plus l\'horloge.)']], 'h_raiz', { aff: 1 }),
          o(['Cuéntame cómo aprendiste a disparar.', 'Tell me how you learned to shoot.', 'Raconte-moi comment tu as appris à tirer.'], 'pregunta', [['Ah, las manzanas. Siéntate.', 'Ah, the apples. Sit down.', 'Ah, les pommes. Assieds-toi.']], 'h_b1'),
          o(['¿Y de pequeña también eras así de responsable?', 'Were you this responsible as a kid too?', 'Tu étais aussi responsable, petite ?'], 'broma', [['Peor. Te lo cuento.', 'Worse. Let me tell you.', 'Pire. Je te raconte.']], 'h_a1'),
        ],
      },
    },
  },

  // ============================================================ JAYCE
  jayce: {
    entry: o(['Jayce, cuéntame cosas. Sin prisa.', 'Jayce, tell me things. No rush.', 'Jayce, raconte-moi des choses. Sans te presser.'], 'amable', null, 'h_raiz'),
    nodes: {
      h_raiz: {
        say: [['(Deja el martillo en el banco con un golpe.) ¡Por fin alguien que no viene a pedirme un informe! Adelante.', '(Sets the hammer down on the bench with a thud.) Finally someone who isn\'t here for a report! Go ahead.', '(Il pose le marteau sur l\'établi avec un bruit sourd.) Enfin quelqu\'un qui ne vient pas me réclamer un rapport ! Vas-y.']],
        again: [['Has vuelto. Bien. Los consejeros no saben hablar de nada que no tenga presupuesto.', 'You\'re back. Good. Councillors can\'t talk about anything without a budget.', 'Te revoilà. Bien. Les conseillers ne savent parler de rien sans budget.'],
          ['(Te ofrece un taburete lleno de tornillos. Los tira al suelo.) Siéntate. ¿Qué toca hoy?', '(Offers you a stool covered in screws. Sweeps them onto the floor.) Sit. What\'s today\'s topic?', '(Il te tend un tabouret couvert de vis. Il les balaie par terre.) Assieds-toi. Quel est le sujet du jour ?']],
        opts: [
          o(['¿Cómo era tu infancia?', 'What was your childhood like?', 'Comment était ton enfance ?'], 'pregunta', null, 'h_a1'),
          o(['¿Qué inventarías si no hubiera límites?', 'What would you invent if there were no limits?', 'Qu\'inventerais-tu s\'il n\'y avait pas de limites ?'], 'broma', null, 'h_b1'),
          o(['¿Te pesa ser el «héroe del progreso»?', 'Does being the "hero of progress" weigh on you?', 'C\'est lourd d\'être le « héros du progrès » ?'], 'serio', null, 'h_c1'),
        ],
      },
      h_a1: {
        say: [['Mi madre y yo vivíamos de su taller. Ella arreglaba relojes; yo los desmontaba antes de que llegaran los clientes.', 'My mother and I lived off her workshop. She repaired clocks; I took them apart before the customers arrived.', 'Ma mère et moi vivions de son atelier. Elle réparait des horloges ; moi, je les démontais avant que les clients arrivent.']],
        again: [['Mi madre aún me regaña por aquellos relojes. Con razón.', 'My mother still scolds me for those clocks. Rightly so.', 'Ma mère me gronde encore pour ces horloges. À raison.']],
        opts: [
          o(['¿Y sabías montarlos otra vez?', 'And could you put them back together?', 'Et tu savais les remonter ?'], 'pregunta', [['A veces. Otras veces sobraban piezas. Todavía tengo un frasco con muelles huérfanos.', 'Sometimes. Other times there were pieces left over. I still have a jar of orphan springs.', 'Parfois. D\'autres fois, il restait des pièces. J\'ai encore un bocal de ressorts orphelins.']], 'h_a2', { aff: 1 }),
          o(['Tu madre debía de tener paciencia infinita.', 'Your mother must have had infinite patience.', 'Ta mère devait avoir une patience infinie.'], 'amable', [['Infinita y con zapatilla. Ella es la razón de que yo esté aquí.', 'Infinite, and armed with a slipper. She\'s the reason I\'m here.', 'Infinie, et armée d\'une pantoufle. C\'est grâce à elle que je suis ici.']], 'h_a2', { aff: 1 }),
          o(['Así que ya de niño rompías cosas.', 'So you were breaking things even as a kid.', 'Donc tu cassais déjà des choses, enfant.'], 'broma', [['«Exploraba su funcionamiento interno». Es distinto. Viktor también usa esa excusa.', '"Exploring their inner workings". That\'s different. Viktor uses that excuse too.', '« J\'explorais leur fonctionnement interne ». C\'est différent. Viktor utilise aussi cette excuse.']], 'h_a2'),
        ],
      },
      h_a2: {
        say: [['Una vez, de crío, me perdí en una ventisca. Alguien me salvó con algo que no era ciencia. Una luz azul. Nunca lo olvidé.', 'Once, as a kid, I got lost in a blizzard. Someone saved me with something that wasn\'t science. A blue light. I never forgot it.', 'Une fois, enfant, je me suis perdu dans une tempête de neige. Quelqu\'un m\'a sauvé avec quelque chose qui n\'était pas de la science. Une lumière bleue. Je ne l\'ai jamais oublié.']],
        opts: [
          o(['¿Magia? ¿De verdad?', 'Magic? Really?', 'De la magie ? Vraiment ?'], 'pregunta', [['Magia. Por eso empecé con la hextec: quería entender lo que me salvó. Hacer que sirviera a todos, no solo a un niño perdido.', 'Magic. That\'s why I started on hextech: I wanted to understand what saved me. Make it serve everyone, not just one lost boy.', 'De la magie. C\'est pour ça que j\'ai commencé l\'hextech : je voulais comprendre ce qui m\'avait sauvé. Le mettre au service de tous, pas seulement d\'un enfant perdu.']], 'h_a3', { stats: { ingenio: 1 } }),
          o(['Debiste de pasar mucho miedo.', 'You must have been terrified.', 'Tu as dû avoir très peur.'], 'amable', [['Mucho. Aún odio el frío. Por eso el taller siempre está a tope de calor. No es por las máquinas.', 'Very. I still hate the cold. That\'s why the workshop is always boiling. It\'s not for the machines.', 'Très. Je déteste encore le froid. C\'est pour ça que l\'atelier est toujours surchauffé. Ce n\'est pas pour les machines.']], 'h_a3', { aff: 1 }),
          o(['¿Seguro que no lo soñaste?', 'Sure you didn\'t dream it?', 'Tu es sûr de ne pas l\'avoir rêvé ?'], 'astuto', [['Eso dijeron todos. Luego hice brillar un cristal en mi taller y dejaron de decirlo.', 'That\'s what everyone said. Then I made a crystal glow in my workshop and they stopped saying it.', 'C\'est ce que tout le monde disait. Puis j\'ai fait briller un cristal dans mon atelier, et ils ont arrêté.']], 'h_a3'),
        ],
      },
      h_a3: {
        say: [['A veces me pregunto qué pensaría aquel niño del hombre que soy ahora.', 'Sometimes I wonder what that boy would think of the man I am now.', 'Parfois je me demande ce que ce garçon penserait de l\'homme que je suis devenu.']],
        opts: [
          o(['Que llegaste lejos.', 'That you went far.', 'Que tu es allé loin.'], 'amable', [['Lejos, sí. Si es en la dirección correcta… eso ya es otra conversación.', 'Far, yes. Whether in the right direction… that\'s another conversation.', 'Loin, oui. Si c\'est dans la bonne direction… c\'est une autre conversation.']], 'h_c1', { aff: 1 }),
          o(['Que te falta dormir.', 'That you need more sleep.', 'Qu\'il te manque du sommeil.'], 'broma', [['(Se ríe.) ¡Eso seguro! Venga, hablemos de algo divertido. ¿Inventos imposibles?', '(Laughs.) That\'s for sure! Come on, let\'s talk about something fun. Impossible inventions?', '(Il rit.) Ça, c\'est sûr ! Allez, parlons d\'un truc amusant. Des inventions impossibles ?']], 'h_b1'),
          o(['Pregúntaselo a tu madre.', 'Ask your mother.', 'Demande à ta mère.'], 'serio', [['Ya lo hice. Me dijo que me pusiera una bufanda. Las madres siempre van al grano.', 'I did. She told me to put on a scarf. Mothers always get to the point.', 'Je l\'ai fait. Elle m\'a dit de mettre une écharpe. Les mères vont toujours droit au but.']], 'h_raiz'),
        ],
      },
      h_b1: {
        say: [['¡Sin límites! (Se le iluminan los ojos.) Un puente de luz entre Piltover y Zaun. Que cualquiera pueda cruzarlo sin pagar peaje.', 'No limits! (His eyes light up.) A bridge of light between Piltover and Zaun. One anyone could cross without paying a toll.', 'Sans limites ! (Ses yeux s\'illuminent.) Un pont de lumière entre Piltover et Zaun. Que n\'importe qui pourrait traverser sans péage.']],
        again: [['El puente de luz sigue en mis cuadernos. He añadido barandillas. Por si Jinx.', 'The bridge of light is still in my notebooks. I added railings. In case of Jinx.', 'Le pont de lumière est toujours dans mes carnets. J\'ai ajouté des rambardes. Au cas où Jinx.']],
        opts: [
          o(['¿Y por qué no lo haces?', 'So why don\'t you build it?', 'Et pourquoi tu ne le fais pas ?'], 'pregunta', [['Porque el Consejo pregunta primero quién cobra el peaje. Siempre es esa pregunta.', 'Because the Council always asks first who collects the toll. It\'s always that question.', 'Parce que le Conseil demande d\'abord qui encaisse le péage. C\'est toujours cette question.']], 'h_b2'),
          o(['Yo te ayudaría a construirlo.', 'I\'d help you build it.', 'Je t\'aiderais à le construire.'], 'amable', [['¿En serio? Entonces ya somos dos. Bueno, tres con Viktor. Él haría los cálculos aburridos.', 'Seriously? Then that makes two of us. Three with Viktor. He\'d do the boring maths.', 'Sérieusement ? Alors on est deux. Trois avec Viktor. Il ferait les calculs ennuyeux.']], 'h_b2', { aff: 1 }),
          o(['Yo inventaría una máquina de café infinito.', 'I\'d invent an infinite coffee machine.', 'Moi, j\'inventerais une machine à café infini.'], 'broma', [['¡Eso sí que cambiaría la historia de Piltover! Apúntalo. En serio, apúntalo.', 'Now THAT would change Piltover\'s history! Write it down. Seriously, write it down.', 'Ça, ça changerait l\'histoire de Piltover ! Note-le. Sérieusement, note-le.']], 'h_b2', { aff: 1 }),
        ],
      },
      h_b2: {
        say: [['Viktor dice que sueño demasiado alto. Yo digo que él sueña demasiado bajo. Nos complementamos.', 'Viktor says I dream too high. I say he dreams too low. We complement each other.', 'Viktor dit que je rêve trop haut. Moi, je dis qu\'il rêve trop bas. On se complète.']],
        opts: [
          o(['¿Cómo os conocisteis?', 'How did you two meet?', 'Comment vous êtes-vous rencontrés ?'], 'pregunta', [['Me sacó de un lío en la Academia. Él vio en mis notas lo que nadie más quiso ver. Desde entonces, no hay invento sin él.', 'He got me out of trouble at the Academy. He saw in my notes what nobody else wanted to see. Since then, no invention without him.', 'Il m\'a sorti d\'un mauvais pas à l\'Académie. Il a vu dans mes notes ce que personne ne voulait voir. Depuis, pas d\'invention sans lui.']], 'h_b3'),
          o(['¿Y quién tiene razón?', 'And who\'s right?', 'Et qui a raison ?'], 'astuto', [['(Duda.) Depende del día. Y de si ha dormido. Ninguno de los dos duerme.', '(Hesitates.) Depends on the day. And whether he\'s slept. Neither of us sleeps.', '(Il hésite.) Ça dépend du jour. Et de s\'il a dormi. Aucun de nous deux ne dort.']], 'h_b3'),
          o(['Se nota que le quieres mucho.', 'You can tell you care about him a lot.', 'On voit que tu tiens beaucoup à lui.'], 'amable', [['Es mi compañero. Mi hermano, casi. No se lo digas, se pondría insoportable.', 'He\'s my partner. My brother, nearly. Don\'t tell him, he\'d be unbearable.', 'C\'est mon partenaire. Presque mon frère. Ne lui dis pas, il deviendrait insupportable.']], 'h_b3', { aff: 1 }),
        ],
      },
      h_b3: {
        say: [['Me estoy emocionando. Siempre me pasa. Si no me paras, te dibujo el puente aquí mismo en la mesa.', 'I\'m getting carried away. Always happens. If you don\'t stop me, I\'ll draw the bridge right here on the table.', 'Je m\'emballe. Ça m\'arrive toujours. Si tu ne m\'arrêtes pas, je te dessine le pont ici, sur la table.']],
        opts: [
          o(['Dibújalo. Quiero verlo.', 'Draw it. I want to see it.', 'Dessine-le. Je veux le voir.'], 'amable', [['(Coge una tiza. Dibuja un arco precioso… y luego, al lado, muy pequeño, un niño en la nieve.) Bueno. Ya ves de dónde viene todo.', '(Grabs chalk. Draws a beautiful arch… and beside it, very small, a boy in the snow.) Well. Now you see where it all comes from.', '(Il prend une craie. Dessine une arche magnifique… et à côté, tout petit, un enfant dans la neige.) Voilà. Tu vois d\'où tout vient.']], 'h_a1', { aff: 1 }),
          o(['¿Y el peso de ser el héroe?', 'And the weight of being the hero?', 'Et le poids d\'être le héros ?'], 'serio', [['Ah. Esa conversación. Vale.', 'Ah. That conversation. Okay.', 'Ah. Cette conversation-là. D\'accord.']], 'h_c1'),
          o(['Mejor cambiemos antes de que destroces la mesa.', 'Let\'s change before you wreck the table.', 'Changeons avant que tu ne détruises la table.'], 'broma', [['Prudente. Mi madre te adoraría.', 'Sensible. My mother would adore you.', 'Prudent{g:|e|·e}. Ma mère t\'adorerait.']], 'h_raiz'),
        ],
      },
      h_c1: {
        say: [['(Se apoya en el banco.) La gente me para por la calle. Me dan las gracias por cosas que no he hecho yo solo. Y me culpan de cosas que tampoco.', '(Leans on the bench.) People stop me in the street. They thank me for things I didn\'t do alone. And blame me for things I didn\'t do either.', '(Il s\'appuie sur l\'établi.) Les gens m\'arrêtent dans la rue. Ils me remercient pour des choses que je n\'ai pas faites seul. Et me reprochent des choses que je n\'ai pas faites non plus.']],
        again: [['Sigue pesando. Pero hablarlo contigo pesa un poco menos.', 'Still heavy. But talking about it with you makes it a bit lighter.', 'C\'est toujours lourd. Mais en parler avec toi l\'allège un peu.']],
        opts: [
          o(['Nadie puede cargar con una ciudad entera.', 'No one can carry a whole city.', 'Personne ne peut porter une ville entière.'], 'amable', [['Ya. Pero alguien tiene que intentarlo. Y si no soy yo, será alguien peor.', 'I know. But someone has to try. And if it isn\'t me, it\'ll be someone worse.', 'Je sais. Mais quelqu\'un doit essayer. Et si ce n\'est pas moi, ce sera quelqu\'un de pire.']], 'h_c2', { aff: 1 }),
          o(['Te gusta un poco la fama, admítelo.', 'You like the fame a little, admit it.', 'Tu aimes un peu la célébrité, avoue.'], 'broma', [['(Se rasca la nuca.) …Un poco. Las estatuas son halagadoras. Pero los discursos, no.', '(Scratches the back of his neck.) …A little. The statues are flattering. The speeches aren\'t.', '(Il se gratte la nuque.) …Un peu. Les statues sont flatteuses. Les discours, non.']], 'h_c2'),
          o(['A lo mejor deberías pararte a escuchar a Zaun.', 'Maybe you should stop and listen to Zaun.', 'Tu devrais peut-être t\'arrêter pour écouter Zaun.'], 'duro', [['(Se tensa.) …Puede. Viktor me lo dice cada semana. No me gusta que tengáis razón los dos.', '(Tenses.) …Maybe. Viktor tells me every week. I don\'t like you both being right.', '(Il se crispe.) …Peut-être. Viktor me le dit chaque semaine. Je n\'aime pas que vous ayez raison tous les deux.']], 'h_c2', { rep: { zaun: 1 } }),
        ],
      },
      h_c2: {
        say: [['¿Sabes qué echo de menos? Ser solo Jayce, el chico que rompía relojes. Nadie esperaba nada de él.', 'You know what I miss? Being just Jayce, the kid who broke clocks. Nobody expected anything from him.', 'Tu sais ce qui me manque ? Être juste Jayce, le gamin qui cassait des horloges. Personne n\'attendait rien de lui.']],
        opts: [
          o(['Conmigo puedes ser solo Jayce.', 'With me you can be just Jayce.', 'Avec moi, tu peux être juste Jayce.'], 'coqueto', [['(Te mira, sorprendido.) …Gracias. Eso vale más que una medalla.', '(Looks at you, surprised.) …Thanks. That\'s worth more than a medal.', '(Il te regarde, surpris.) …Merci. Ça vaut plus qu\'une médaille.']], 'h_c3', { aff: 1 }),
          o(['Pues rompe un reloj ahora. Por los viejos tiempos.', 'Then break a clock now. For old times\' sake.', 'Alors casse une horloge maintenant. Pour le bon vieux temps.'], 'broma', [['(Coge un reloj de la mesa, lo mira… y lo vuelve a dejar.) Es de Viktor. Me mataría. Aún queda algo de sensatez.', '(Picks up a clock from the table, looks at it… and puts it back.) It\'s Viktor\'s. He\'d kill me. Some sense left after all.', '(Il prend une horloge sur la table, la regarde… et la repose.) C\'est celle de Viktor. Il me tuerait. Il me reste un peu de bon sens.']], 'h_c3', { aff: 1 }),
          o(['Ese chico sigue ahí dentro.', 'That kid is still in there.', 'Ce gamin est toujours là-dedans.'], 'amable', [['Espero que sí. Necesito que alguien le recuerde al consejero por qué empezó.', 'I hope so. I need someone to remind the councillor why he started.', 'J\'espère. J\'ai besoin que quelqu\'un rappelle au conseiller pourquoi il a commencé.']], 'h_c3'),
        ],
      },
      h_c3: {
        say: [['Bueno. Ya me has sacado más que tres sesiones del Consejo. ¿Seguimos?', 'Well. You\'ve got more out of me than three Council sessions. Shall we go on?', 'Bon. Tu m\'as fait dire plus que trois séances du Conseil. On continue ?']],
        opts: [
          o(['Claro. Háblame de tu madre.', 'Sure. Tell me about your mother.', 'Bien sûr. Parle-moi de ta mère.'], 'amable', [['¡Ah, mi madre! Te va a caer bien. A todo el mundo le cae mejor que yo.', 'Ah, my mother! You\'ll like her. Everyone likes her more than me.', 'Ah, ma mère ! Elle va te plaire. Tout le monde la préfère à moi.']], 'h_a1'),
          o(['Mejor, inventos imposibles.', 'Better: impossible inventions.', 'Mieux : des inventions impossibles.'], 'broma', [['¡Por fin! Coge papel.', 'Finally! Grab some paper.', 'Enfin ! Prends du papier.']], 'h_b1', { aff: 1 }),
          o(['Elige tú el tema.', 'You pick the topic.', 'Choisis le sujet.'], 'pregunta', [['¿Yo? Peligroso. Vale, vuelta al principio.', 'Me? Dangerous. Fine, back to the start.', 'Moi ? Dangereux. Bon, retour au début.']], 'h_raiz'),
        ],
      },
    },
  },

  // ============================================================ VIKTOR
  viktor: {
    entry: o(['¿Podemos hablar un rato largo, Viktor?', 'Can we talk for a good while, Viktor?', 'On peut parler un bon moment, Viktor ?'], 'amable', null, 'h_raiz'),
    nodes: {
      h_raiz: {
        say: [['(Deja la pluma con cuidado.) El tiempo es lo único que no puedo fabricar. Pero puedo dártelo. Adelante.', '(Sets down his pen carefully.) Time is the one thing I cannot build. But I can give it to you. Go on.', '(Il pose sa plume avec soin.) Le temps est la seule chose que je ne peux pas fabriquer. Mais je peux te le donner. Vas-y.']],
        again: [['Vuelves. Curioso. Tienes la tenacidad de un buen investigador.', 'You return. Curious. You have the tenacity of a good researcher.', 'Tu reviens. Curieux. Tu as la ténacité d\'un bon chercheur.'],
          ['(Aparta un montón de planos para hacerte sitio.) Siéntate. Mis ecuaciones pueden esperar.', '(Moves a pile of blueprints to make room.) Sit. My equations can wait.', '(Il écarte une pile de plans pour te faire de la place.) Assieds-toi. Mes équations peuvent attendre.']],
        opts: [
          o(['¿Qué te fascina de la ciencia?', 'What fascinates you about science?', 'Qu\'est-ce qui te fascine dans la science ?'], 'pregunta', null, 'h_a1'),
          o(['Háblame de las plantas de tu taller.', 'Tell me about the plants in your workshop.', 'Parle-moi des plantes de ton atelier.'], 'amable', null, 'h_b1'),
          o(['¿Qué piensas del dolor?', 'What do you think about pain?', 'Que penses-tu de la douleur ?'], 'serio', null, 'h_c1'),
        ],
      },
      h_a1: {
        say: [['Que no miente. Un experimento falla y te dice exactamente por qué. Las personas no son tan amables.', 'That it does not lie. An experiment fails and tells you exactly why. People are not so kind.', 'Qu\'elle ne ment pas. Une expérience échoue et te dit exactement pourquoi. Les gens ne sont pas si aimables.']],
        again: [['La ciencia sigue sin mentirme. Las personas siguen… siendo personas.', 'Science still does not lie to me. People are still… people.', 'La science ne me ment toujours pas. Les gens sont toujours… des gens.']],
        opts: [
          o(['Yo no te mentiría.', 'I wouldn\'t lie to you.', 'Je ne te mentirais pas.'], 'amable', [['(Te observa.) Esa afirmación requiere pruebas. Pero acepto la hipótesis, de momento.', '(Observes you.) That claim requires evidence. But I accept the hypothesis, for now.', '(Il t\'observe.) Cette affirmation demande des preuves. Mais j\'accepte l\'hypothèse, pour l\'instant.']], 'h_a2', { aff: 1 }),
          o(['Suena un poco frío.', 'Sounds a bit cold.', 'Ça semble un peu froid.'], 'serio', [['Frío no. Honesto. El frío es no querer saber.', 'Not cold. Honest. Cold is not wanting to know.', 'Pas froid. Honnête. Le froid, c\'est ne pas vouloir savoir.']], 'h_a2'),
          o(['¿Y cuando el experimento explota?', 'And when the experiment explodes?', 'Et quand l\'expérience explose ?'], 'broma', [['Entonces Jayce se ríe, yo apunto los datos y alguien barre. Normalmente yo.', 'Then Jayce laughs, I record the data and someone sweeps up. Usually me.', 'Alors Jayce rit, je note les données et quelqu\'un balaie. En général, moi.']], 'h_a2', { aff: 1 }),
        ],
      },
      h_a2: {
        say: [['De niño, en el sumidero, construía juguetes con chatarra. Una mariposa de latón que movía las alas. Se la regalé a un niño enfermo.', 'As a child, in the sump, I built toys from scrap. A brass butterfly that moved its wings. I gave it to a sick boy.', 'Enfant, dans le puisard, je fabriquais des jouets avec de la ferraille. Un papillon en laiton qui battait des ailes. Je l\'ai offert à un enfant malade.']],
        opts: [
          o(['¿Qué fue de aquel niño?', 'What happened to that boy?', 'Qu\'est devenu cet enfant ?'], 'pregunta', [['(Silencio.) Lo que le pasa a muchos niños en Zaun. Por eso sigo trabajando.', '(Silence.) What happens to many children in Zaun. That is why I keep working.', '(Silence.) Ce qui arrive à beaucoup d\'enfants à Zaun. C\'est pour ça que je continue de travailler.']], 'h_a3'),
          o(['Siempre has querido ayudar.', 'You\'ve always wanted to help.', 'Tu as toujours voulu aider.'], 'amable', [['Siempre he querido que nadie más tosiera como yo. No es lo mismo, pero se parece.', 'I have always wanted no one else to cough as I do. Not the same thing, but close.', 'J\'ai toujours voulu que personne d\'autre ne tousse comme moi. Ce n\'est pas pareil, mais ça y ressemble.']], 'h_a3', { aff: 1 }),
          o(['¿Me harías una mariposa a mí?', 'Would you make me a butterfly?', 'Tu me ferais un papillon ?'], 'coqueto', [['(Casi sonríe.) Tengo latón de sobra. Y, al parecer, debilidad por las peticiones imposibles.', '(Almost smiles.) I have brass to spare. And, apparently, a weakness for impossible requests.', '(Il sourit presque.) J\'ai du laiton à revendre. Et, apparemment, un faible pour les demandes impossibles.']], 'h_a3', { aff: 1 }),
        ],
      },
      h_a3: {
        say: [['La ciencia es una forma de esperanza con método. Esa es mi fe, si tengo alguna.', 'Science is a form of hope with a method. That is my faith, if I have any.', 'La science est une forme d\'espoir avec une méthode. C\'est ma foi, si j\'en ai une.']],
        opts: [
          o(['Me gusta esa fe.', 'I like that faith.', 'J\'aime cette foi.'], 'amable', [['Tiene pocos fieles. Bienvenid{g:o|a|e}. Hablando de cosas que crecen… ¿has visto mis plantas?', 'It has few believers. Welcome. Speaking of things that grow… have you seen my plants?', 'Elle a peu de fidèles. Bienvenue. En parlant de choses qui poussent… tu as vu mes plantes ?']], 'h_b1', { aff: 1 }),
          o(['¿Y cuando la esperanza duele?', 'And when hope hurts?', 'Et quand l\'espoir fait mal ?'], 'serio', [['Entonces hablamos del dolor. Siempre acabamos ahí.', 'Then we speak of pain. We always end up there.', 'Alors on parle de la douleur. On finit toujours par là.']], 'h_c1'),
          o(['Empecemos otra vez desde el principio.', 'Let\'s start again from the beginning.', 'Recommençons depuis le début.'], 'pregunta', [['Repetir es la base del método. Adelante.', 'Repetition is the basis of method. Go on.', 'La répétition est la base de la méthode. Vas-y.']], 'h_raiz'),
        ],
      },
      h_b1: {
        say: [['(Toca una hoja con cuidado.) Las recojo de las grietas de Zaun. Crecen sin luz, en aire envenenado. Quiero saber cómo.', '(Touches a leaf gently.) I collect them from the cracks in Zaun. They grow without light, in poisoned air. I want to know how.', '(Il touche une feuille avec délicatesse.) Je les ramasse dans les fissures de Zaun. Elles poussent sans lumière, dans un air empoisonné. Je veux savoir comment.']],
        again: [['Esta ha echado una hoja nueva desde tu última visita. Quizá le gustas.', 'This one has put out a new leaf since your last visit. Perhaps it likes you.', 'Celle-ci a sorti une nouvelle feuille depuis ta dernière visite. Peut-être qu\'elle t\'aime bien.']],
        opts: [
          o(['Son como la gente de Zaun.', 'They\'re like the people of Zaun.', 'Elles sont comme les gens de Zaun.'], 'amable', [['Exacto. Tercas. Adaptables. Nadie las riega y aun así florecen.', 'Exactly. Stubborn. Adaptable. No one waters them and still they bloom.', 'Exactement. Têtues. Adaptables. Personne ne les arrose et pourtant elles fleurissent.']], 'h_b2', { aff: 1 }),
          o(['¿Tienen nombre?', 'Do they have names?', 'Elles ont un nom ?'], 'broma', [['Números. Pero esa de ahí… la llamo «Persistencia». No se lo cuentes a Jayce.', 'Numbers. But that one there… I call it "Persistence". Don\'t tell Jayce.', 'Des numéros. Mais celle-là… je l\'appelle « Persévérance ». Ne le dis pas à Jayce.']], 'h_b2', { aff: 1 }),
          o(['¿Podrían limpiar el aire?', 'Could they clean the air?', 'Elles pourraient purifier l\'air ?'], 'pregunta', [['Es mi hipótesis. Si absorben lo que nos mata… quizá podamos aprender de ellas.', 'That is my hypothesis. If they absorb what kills us… perhaps we can learn from them.', 'C\'est mon hypothèse. Si elles absorbent ce qui nous tue… peut-être pouvons-nous apprendre d\'elles.']], 'h_b2', { stats: { ingenio: 1 } }),
        ],
      },
      h_b2: {
        say: [['Mi madre cultivaba algo parecido en una lata, junto a la ventana. Es lo poco que recuerdo de ella.', 'My mother grew something similar in a tin, by the window. It is one of the few things I remember about her.', 'Ma mère faisait pousser quelque chose de semblable dans une boîte de conserve, près de la fenêtre. C\'est l\'une des rares choses dont je me souviens d\'elle.']],
        opts: [
          o(['Entonces estas plantas son un homenaje.', 'Then these plants are a tribute.', 'Alors ces plantes sont un hommage.'], 'amable', [['(Se queda quieto.) Nunca lo había pensado así. Gracias.', '(Goes still.) I had never thought of it that way. Thank you.', '(Il s\'immobilise.) Je n\'y avais jamais pensé ainsi. Merci.']], 'h_b3', { aff: 2 }),
          o(['¿Qué más recuerdas?', 'What else do you remember?', 'De quoi d\'autre te souviens-tu ?'], 'pregunta', [['Una canción sin letra. La tarareo a veces cuando calibro. Jayce cree que es una fórmula.', 'A song with no words. I hum it sometimes while calibrating. Jayce thinks it is a formula.', 'Une chanson sans paroles. Je la fredonne parfois en calibrant. Jayce croit que c\'est une formule.']], 'h_b3'),
          o(['No hace falta que hables de eso.', 'You don\'t have to talk about that.', 'Tu n\'es pas obligé d\'en parler.'], 'serio', [['Lo sé. Pero contigo, curiosamente, no me cuesta.', 'I know. But with you, curiously, it is not difficult.', 'Je sais. Mais avec toi, curieusement, ce n\'est pas difficile.']], 'h_b3', { aff: 1 }),
        ],
      },
      h_b3: {
        say: [['Suficiente botánica sentimental. Mi reputación de hombre serio peligra.', 'Enough sentimental botany. My reputation as a serious man is at risk.', 'Assez de botanique sentimentale. Ma réputation d\'homme sérieux est en danger.']],
        opts: [
          o(['Tu secreto está a salvo.', 'Your secret\'s safe.', 'Ton secret est en sécurité.'], 'broma', [['Excelente. Ahora volvamos a cosas frías y lógicas.', 'Excellent. Now back to cold, logical matters.', 'Excellent. Revenons à des choses froides et logiques.']], 'h_a1'),
          o(['Háblame del dolor. Si quieres.', 'Tell me about pain. If you want.', 'Parle-moi de la douleur. Si tu veux.'], 'serio', [['Si quiero. Vale.', 'If I want. Very well.', 'Si je veux. Très bien.']], 'h_c1'),
          o(['¿Seguimos charlando?', 'Shall we keep talking?', 'On continue de parler ?'], 'amable', [['Mientras la tos me lo permita.', 'As long as my cough allows.', 'Tant que ma toux me le permet.']], 'h_raiz'),
        ],
      },
      h_c1: {
        say: [['El dolor es información. Te dice dónde está el límite. Lo difícil es cuando el límite eres tú.', 'Pain is information. It tells you where the limit is. The difficulty is when the limit is you.', 'La douleur est une information. Elle te dit où est la limite. Le difficile, c\'est quand la limite, c\'est toi.']],
        again: [['Mi opinión sobre el dolor no ha cambiado. Mi pierna tampoco.', 'My view on pain has not changed. Neither has my leg.', 'Mon avis sur la douleur n\'a pas changé. Ma jambe non plus.']],
        opts: [
          o(['¿Te duele mucho la pierna?', 'Does your leg hurt a lot?', 'Ta jambe te fait très mal ?'], 'amable', [['Cada día. Pero me ha enseñado a caminar despacio y mirar dónde piso. Hay peores maestros.', 'Every day. But it has taught me to walk slowly and watch my step. There are worse teachers.', 'Chaque jour. Mais elle m\'a appris à marcher lentement et à regarder où je mets les pieds. Il y a de pires maîtres.']], 'h_c2', { aff: 1 }),
          o(['¿Y si pudieras eliminar el dolor?', 'And if you could eliminate pain?', 'Et si tu pouvais supprimer la douleur ?'], 'astuto', [['(Te mira fijamente.) Esa es la pregunta más peligrosa que me han hecho nunca. Y la que más me tienta.', '(Looks at you intently.) That is the most dangerous question anyone has ever asked me. And the most tempting.', '(Il te fixe.) C\'est la question la plus dangereuse qu\'on m\'ait jamais posée. Et la plus tentante.']], 'h_c2', { stats: { ingenio: 1 } }),
          o(['El dolor también nos hace humanos.', 'Pain also makes us human.', 'La douleur nous rend aussi humains.'], 'serio', [['Quizá. O quizá solo es lo que nos decimos para soportarlo.', 'Perhaps. Or perhaps it is only what we tell ourselves to bear it.', 'Peut-être. Ou peut-être n\'est-ce que ce qu\'on se dit pour le supporter.']], 'h_c2'),
        ],
      },
      h_c2: {
        say: [['Jayce no lo entiende. Él tiene prisa por cambiar el mundo. Yo tengo prisa porque el tiempo se me acaba.', 'Jayce does not understand. He is in a hurry to change the world. I am in a hurry because my time is running out.', 'Jayce ne comprend pas. Il est pressé de changer le monde. Moi, je suis pressé parce que mon temps s\'épuise.']],
        opts: [
          o(['Entonces pasa el tiempo que tengas con gente que te quiera.', 'Then spend the time you have with people who love you.', 'Alors passe le temps qu\'il te reste avec des gens qui t\'aiment.'], 'amable', [['(Baja la mirada.) Es un consejo poco científico. Y muy difícil de refutar.', '(Lowers his gaze.) Unscientific advice. And very hard to refute.', '(Il baisse les yeux.) Un conseil peu scientifique. Et très difficile à réfuter.']], 'h_c3', { aff: 2 }),
          o(['Díselo a Jayce. Te escuchará.', 'Tell Jayce. He\'ll listen.', 'Dis-le à Jayce. Il t\'écoutera.'], 'serio', [['Lo intento. Pero él siempre oye la parte del «cambiar el mundo».', 'I try. But he always hears the "change the world" part.', 'J\'essaie. Mais il entend toujours la partie « changer le monde ».']], 'h_c3'),
          o(['Pues trabajemos rápido. Te ayudo.', 'Then let\'s work fast. I\'ll help.', 'Alors travaillons vite. Je t\'aide.'], 'astuto', [['Acepto. Aunque te advierto: mis horarios no son humanos.', 'Accepted. Though I warn you: my hours are not human.', 'J\'accepte. Mais je te préviens : mes horaires ne sont pas humains.']], 'h_c3', { aff: 1 }),
        ],
      },
      h_c3: {
        say: [['(Tose y sonríe a la vez.) Hablar contigo es eficiente. Ni una palabra desperdiciada.', '(Coughs and smiles at once.) Talking with you is efficient. Not a word wasted.', '(Il tousse et sourit en même temps.) Parler avec toi est efficace. Pas un mot de gaspillé.']],
        opts: [
          o(['Enséñame tus plantas otra vez.', 'Show me your plants again.', 'Montre-moi encore tes plantes.'], 'amable', [['Con gusto. Persistencia te echaba de menos.', 'Gladly. Persistence missed you.', 'Avec plaisir. Persévérance t\'a manqué.']], 'h_b1'),
          o(['Volvamos a la ciencia.', 'Let\'s go back to science.', 'Revenons à la science.'], 'pregunta', [['Mi tema favorito. No lo digas en voz alta.', 'My favourite subject. Do not say it aloud.', 'Mon sujet préféré. Ne le dis pas à voix haute.']], 'h_a1'),
          o(['Eso es lo más bonito que me ha dicho un científico.', 'That\'s the nicest thing a scientist has ever said to me.', 'C\'est la plus belle chose qu\'un scientifique m\'ait dite.'], 'coqueto', [['Los científicos tenemos el listón muy bajo. Pero lo decía en serio.', 'Scientists set the bar very low. But I meant it.', 'Les scientifiques placent la barre très bas. Mais je le pensais.']], 'h_raiz', { aff: 1 }),
        ],
      },
    },
  },

  // ============================================================ MEL
  mel: {
    entry: o(['Mel, ¿me concedes una conversación larga?', 'Mel, will you grant me a long conversation?', 'Mel, tu m\'accordes une longue conversation ?'], 'astuto', null, 'h_raiz'),
    nodes: {
      h_raiz: {
        say: [['(Sirve dos copas de vino de Noxus.) Una conversación larga es un lujo que pocos se atreven a pedir. Me intrigas. Siéntate.', '(Pours two glasses of Noxian wine.) A long conversation is a luxury few dare ask for. You intrigue me. Sit.', '(Elle sert deux verres de vin noxien.) Une longue conversation est un luxe que peu osent demander. Tu m\'intrigues. Assieds-toi.']],
        again: [['Has vuelto. En política, la constancia es una forma de poder. ¿De qué hablamos?', 'You\'re back. In politics, persistence is a form of power. What shall we discuss?', 'Te revoilà. En politique, la constance est une forme de pouvoir. De quoi parlons-nous ?'],
          ['Tu copa te estaba esperando. Yo también, un poco.', 'Your glass was waiting for you. So was I, a little.', 'Ton verre t\'attendait. Moi aussi, un peu.']],
        opts: [
          o(['¿Qué es para ti la belleza?', 'What is beauty to you?', 'Qu\'est-ce que la beauté pour toi ?'], 'pregunta', null, 'h_a1'),
          o(['¿Cómo era tu infancia en Noxus?', 'What was your childhood in Noxus like?', 'Comment était ton enfance à Noxus ?'], 'serio', null, 'h_b1'),
          o(['Enséñame a negociar.', 'Teach me to negotiate.', 'Apprends-moi à négocier.'], 'astuto', null, 'h_c1'),
        ],
      },
      h_a1: {
        say: [['La belleza es lo que la gente protege aunque no le dé de comer. Por eso dice tanto de una ciudad.', 'Beauty is what people protect even when it doesn\'t feed them. That\'s why it says so much about a city.', 'La beauté est ce que les gens protègent même quand elle ne les nourrit pas. C\'est pour ça qu\'elle en dit tant sur une ville.']],
        again: [['Sigo creyendo lo mismo de la belleza. Pero me gusta oírte discutirlo.', 'I still believe the same about beauty. But I enjoy hearing you argue it.', 'Je crois toujours la même chose de la beauté. Mais j\'aime t\'entendre en débattre.']],
        opts: [
          o(['¿Y qué protege Piltover?', 'And what does Piltover protect?', 'Et que protège Piltover ?'], 'astuto', [['Sus fachadas. Zaun protege sus murales. Saca tus propias conclusiones.', 'Its façades. Zaun protects its murals. Draw your own conclusions.', 'Ses façades. Zaun protège ses fresques. Tire tes propres conclusions.']], 'h_a2', { rep: { zaun: 1 } }),
          o(['Para mí la belleza está en la gente.', 'For me, beauty is in people.', 'Pour moi, la beauté est dans les gens.'], 'amable', [['Respuesta peligrosa. La gente cambia; los cuadros no. Pero me gusta.', 'A dangerous answer. People change; paintings don\'t. But I like it.', 'Réponse dangereuse. Les gens changent ; les tableaux, non. Mais elle me plaît.']], 'h_a2', { aff: 1 }),
          o(['Tú eres lo más bonito de esta sala.', 'You\'re the most beautiful thing in this room.', 'Tu es la plus belle chose de cette pièce.'], 'coqueto', [['(Sonríe, sin inmutarse.) Halagar a una Medarda es fácil. Sorprenderla, no. Sigue intentándolo.', '(Smiles, unruffled.) Flattering a Medarda is easy. Surprising her is not. Keep trying.', '(Elle sourit, imperturbable.) Flatter une Medarda est facile. La surprendre, non. Continue d\'essayer.']], 'h_a2'),
        ],
      },
      h_a2: {
        say: [['¿Ves esa escultura? La compré a un artista de Zaun que firmaba con un nombre falso. Le daba miedo que en Piltover supieran de dónde venía.', 'See that sculpture? I bought it from a Zaunite artist who signed under a false name. He was afraid Piltover would learn where he came from.', 'Tu vois cette sculpture ? Je l\'ai achetée à un artiste de Zaun qui signait d\'un faux nom. Il avait peur que Piltover sache d\'où il venait.']],
        opts: [
          o(['Eso es muy triste.', 'That\'s very sad.', 'C\'est très triste.'], 'serio', [['Es muy Piltover. Por eso la tengo en la entrada: para que cada consejero que viene pase por delante.', 'It\'s very Piltover. That\'s why it stands at the entrance: so every councillor who visits walks past it.', 'C\'est très Piltover. C\'est pour ça qu\'elle est à l\'entrée : pour que chaque conseiller qui vient passe devant.']], 'h_a3'),
          o(['¿Le dijiste que su obra valía?', 'Did you tell him his work was worth it?', 'Tu lui as dit que son œuvre avait de la valeur ?'], 'amable', [['Le pagué el triple. Es la forma más clara de decirlo en esta ciudad.', 'I paid him triple. It\'s the clearest way to say it in this city.', 'Je l\'ai payé le triple. C\'est la façon la plus claire de le dire dans cette ville.']], 'h_a3', { aff: 1 }),
          o(['¿Cuánto costó?', 'How much did it cost?', 'Combien elle a coûté ?'], 'broma', [['Menos que una cena con el consejero Bolbok. Y es mucho mejor compañía.', 'Less than dinner with Councillor Bolbok. And far better company.', 'Moins qu\'un dîner avec le conseiller Bolbok. Et bien meilleure compagnie.']], 'h_a3', { aff: 1 }),
        ],
      },
      h_a3: {
        say: [['El arte me enseñó a mirar. La política, a fingir que no miro.', 'Art taught me to look. Politics taught me to pretend I\'m not looking.', 'L\'art m\'a appris à regarder. La politique, à faire semblant de ne pas regarder.']],
        opts: [
          o(['¿Y quién te enseñó la política?', 'And who taught you politics?', 'Et qui t\'a appris la politique ?'], 'pregunta', [['Mi madre. Aunque ella lo llamaba «sobrevivir». Te cuento.', 'My mother. Though she called it "surviving". Let me tell you.', 'Ma mère. Même si elle appelait ça « survivre ». Je te raconte.']], 'h_b1'),
          o(['Enséñame a fingir que no miro.', 'Teach me to pretend I\'m not looking.', 'Apprends-moi à faire semblant de ne pas regarder.'], 'astuto', [['Primera lección gratuita. Las demás tendrás que negociarlas.', 'First lesson is free. The rest you\'ll have to negotiate.', 'Première leçon gratuite. Les autres, il faudra les négocier.']], 'h_c1', { aff: 1 }),
          o(['Volvamos a empezar, con otra copa.', 'Let\'s start again, with another glass.', 'Recommençons, avec un autre verre.'], 'broma', [['Una propuesta excelente. Aprobada por unanimidad.', 'An excellent motion. Carried unanimously.', 'Une excellente proposition. Adoptée à l\'unanimité.']], 'h_raiz'),
        ],
      },
      h_b1: {
        say: [['(Gira la copa despacio.) Crecí entre lobos, literalmente: la casa Medarda tiene lobos en los escudos y en el carácter. Yo era la hija que pintaba.', '(Slowly turns her glass.) I grew up among wolves, literally: House Medarda has wolves on its crests and in its temperament. I was the daughter who painted.', '(Elle fait tourner son verre lentement.) J\'ai grandi parmi les loups, littéralement : la maison Medarda a des loups sur ses blasons et dans son caractère. J\'étais la fille qui peignait.']],
        again: [['Noxus otra vez. Siempre vuelves a lo que más me cuesta. Eso es buena estrategia.', 'Noxus again. You always return to what costs me most. That\'s good strategy.', 'Noxus encore. Tu reviens toujours à ce qui me coûte le plus. C\'est une bonne stratégie.']],
        opts: [
          o(['¿Y eso era malo?', 'And was that bad?', 'Et c\'était mal ?'], 'pregunta', [['En Noxus, la debilidad se huele. Y un pincel se parece demasiado a una debilidad.', 'In Noxus, weakness can be smelled. And a paintbrush looks too much like weakness.', 'À Noxus, la faiblesse se sent. Et un pinceau ressemble trop à une faiblesse.']], 'h_b2'),
          o(['Pintar también es valiente.', 'Painting is brave too.', 'Peindre aussi, c\'est courageux.'], 'amable', [['(Te sostiene la mirada.) Ojalá alguien me lo hubiera dicho entonces.', '(Holds your gaze.) I wish someone had told me that back then.', '(Elle soutient ton regard.) J\'aurais aimé qu\'on me le dise à l\'époque.']], 'h_b2', { aff: 2 }),
          o(['Una loba que pinta. Me gusta.', 'A wolf who paints. I like it.', 'Une louve qui peint. J\'aime ça.'], 'coqueto', [['Cuidado. Los lobos que pintan también muerden.', 'Careful. Wolves who paint still bite.', 'Attention. Les loups qui peignent mordent aussi.']], 'h_b2', { aff: 1 }),
        ],
      },
      h_b2: {
        say: [['Mi madre me envió a Piltover para protegerme. O para alejarme. Con ella, nunca sabes cuál de las dos.', 'My mother sent me to Piltover to protect me. Or to send me away. With her, you never know which.', 'Ma mère m\'a envoyée à Piltover pour me protéger. Ou pour m\'éloigner. Avec elle, on ne sait jamais lequel des deux.']],
        opts: [
          o(['Quizá las dos cosas.', 'Maybe both.', 'Peut-être les deux.'], 'astuto', [['(Ríe sin alegría.) Eres más perspicaz de lo que aparentas. Probablemente las dos.', '(Laughs without joy.) You\'re sharper than you look. Probably both.', '(Elle rit sans joie.) Tu es plus perspicace que tu n\'en as l\'air. Probablement les deux.']], 'h_b3', { stats: { ingenio: 1 } }),
          o(['¿La echas de menos?', 'Do you miss her?', 'Elle te manque ?'], 'amable', [['Echo de menos a la madre que imaginaba. La de verdad me escribe cartas con órdenes.', 'I miss the mother I imagined. The real one writes me letters full of orders.', 'La mère que j\'imaginais me manque. La vraie m\'écrit des lettres pleines d\'ordres.']], 'h_b3'),
          o(['Piltover te ha sentado bien.', 'Piltover has suited you.', 'Piltover te réussit.'], 'amable', [['Piltover me ha dado un consejo, una galería y… algunas personas. Sí. Me ha sentado bien.', 'Piltover gave me a council seat, a gallery and… a few people. Yes. It has suited me.', 'Piltover m\'a donné un siège au conseil, une galerie et… quelques personnes. Oui. Elle me réussit.']], 'h_b3', { aff: 1 }),
        ],
      },
      h_b3: {
        say: [['Bueno. Suficientes confesiones para una tarde. Me debes una tuya.', 'Well. Enough confessions for one afternoon. You owe me one of yours.', 'Bien. Assez de confidences pour un après-midi. Tu m\'en dois une.']],
        opts: [
          o(['A veces no sé de qué lado estoy.', 'Sometimes I don\'t know which side I\'m on.', 'Parfois je ne sais pas de quel côté je suis.'], 'serio', [['Eso no es una debilidad. Es la única posición desde la que se ve todo el tablero. Te enseñaré a usarla.', 'That isn\'t weakness. It\'s the only position from which you can see the whole board. I\'ll teach you to use it.', 'Ce n\'est pas une faiblesse. C\'est la seule position d\'où l\'on voit tout l\'échiquier. Je t\'apprendrai à t\'en servir.']], 'h_c1', { aff: 1 }),
          o(['Me da miedo el agua profunda.', 'I\'m afraid of deep water.', 'J\'ai peur de l\'eau profonde.'], 'broma', [['¿Esa es tu gran confesión? (Ríe.) Entonces no te llevaré nunca a Noxus por mar. Hablemos de cosas bonitas.', 'That\'s your great confession? (Laughs.) Then I\'ll never take you to Noxus by sea. Let\'s talk about beautiful things.', 'C\'est ta grande confession ? (Elle rit.) Alors je ne t\'emmènerai jamais à Noxus par la mer. Parlons de belles choses.']], 'h_a1', { aff: 1 }),
          o(['Esa la guardo para otro día.', 'I\'ll save that for another day.', 'Je la garde pour un autre jour.'], 'astuto', [['Sabia decisión. Nunca entregues todo en la primera ronda.', 'A wise choice. Never give everything away in the first round.', 'Sage décision. Ne donne jamais tout au premier tour.']], 'h_raiz'),
        ],
      },
      h_c1: {
        say: [['Lección uno: nunca digas lo que quieres primero. Pregunta qué teme el otro. El miedo es más honesto que el deseo.', 'Lesson one: never say what you want first. Ask what the other person fears. Fear is more honest than desire.', 'Leçon un : ne dis jamais d\'abord ce que tu veux. Demande ce que l\'autre craint. La peur est plus honnête que le désir.']],
        again: [['¿Repasamos? La lección uno nunca está de más.', 'Shall we review? Lesson one never hurts.', 'On révise ? La leçon un n\'est jamais de trop.']],
        opts: [
          o(['¿Y qué temes tú, Mel?', 'And what do you fear, Mel?', 'Et toi, que crains-tu, Mel ?'], 'astuto', [['(Sonríe.) Muy bien. Has aprendido rápido. No pienso contestar, claro.', '(Smiles.) Very good. You learn fast. I won\'t answer, of course.', '(Elle sourit.) Très bien. Tu apprends vite. Je ne répondrai pas, bien sûr.']], 'h_c2', { aff: 1, stats: { ingenio: 1 } }),
          o(['Eso suena manipulador.', 'That sounds manipulative.', 'Ça semble manipulateur.'], 'duro', [['Suena a sobrevivir en una sala llena de gente que sí manipula. Elige tu bando.', 'It sounds like surviving in a room full of people who do manipulate. Choose your side.', 'Ça ressemble à survivre dans une salle pleine de gens qui, eux, manipulent. Choisis ton camp.']], 'h_c2'),
          o(['Apuntado. ¿Lección dos?', 'Noted. Lesson two?', 'Noté. Leçon deux ?'], 'pregunta', [['Impaciente. Me gusta.', 'Impatient. I like it.', 'Impatient{g:|e|·e}. J\'aime ça.']], 'h_c2'),
        ],
      },
      h_c2: {
        say: [['Lección dos: el silencio es una oferta. Quien lo rompe primero, cede algo. (Te mira en silencio. Mucho rato.)', 'Lesson two: silence is an offer. Whoever breaks it first gives something up. (She looks at you in silence. For a long time.)', 'Leçon deux : le silence est une offre. Celui qui le rompt en premier cède quelque chose. (Elle te regarde en silence. Longtemps.)']],
        opts: [
          o(['(Aguantar el silencio.)', '(Hold the silence.)', '(Soutenir le silence.)'], 'sigilo', [['(Al final, ella sonríe primero.) Has ganado. No se lo cuentes a nadie del Consejo.', '(In the end, she smiles first.) You win. Don\'t tell anyone on the Council.', '(À la fin, c\'est elle qui sourit la première.) Tu as gagné. Ne le dis à personne au Conseil.']], 'h_c3', { aff: 2 }),
          o(['Vale, vale, me rindo. ¡Qué tensión!', 'Okay, okay, I give up. The tension!', 'D\'accord, d\'accord, j\'abandonne. Quelle tension !'], 'broma', [['Has cedido. Me debes un favor. Así funciona Piltover.', 'You gave in. You owe me a favour. That\'s how Piltover works.', 'Tu as cédé. Tu me dois une faveur. C\'est comme ça que fonctionne Piltover.']], 'h_c3'),
          o(['Me gusta mirarte en silencio.', 'I like looking at you in silence.', 'J\'aime te regarder en silence.'], 'coqueto', [['(Arquea una ceja.) Eso no es negociar. Es hacer trampa. …Pero cuenta.', '(Raises an eyebrow.) That isn\'t negotiating. That\'s cheating. …But it counts.', '(Elle hausse un sourcil.) Ce n\'est pas négocier. C\'est tricher. …Mais ça compte.']], 'h_c3', { aff: 1 }),
        ],
      },
      h_c3: {
        say: [['Tienes talento. Si alguna vez quieres un asiento en una mesa importante, ya sabes a quién preguntar.', 'You have talent. If you ever want a seat at an important table, you know whom to ask.', 'Tu as du talent. Si un jour tu veux une place à une table importante, tu sais à qui demander.']],
        opts: [
          o(['Prefiero un asiento a tu lado.', 'I\'d rather have a seat beside you.', 'Je préfère une place à côté de toi.'], 'coqueto', [['Eso se negocia aparte. Siguiente tema.', 'That\'s negotiated separately. Next topic.', 'Ça se négocie à part. Sujet suivant.']], 'h_raiz', { aff: 1 }),
          o(['Háblame más de arte.', 'Tell me more about art.', 'Parle-moi encore d\'art.'], 'amable', [['Con mucho gusto. Es mi refugio.', 'With great pleasure. It\'s my refuge.', 'Avec grand plaisir. C\'est mon refuge.']], 'h_a1'),
          o(['¿Y Noxus? Cuéntame más.', 'And Noxus? Tell me more.', 'Et Noxus ? Raconte-moi encore.'], 'pregunta', [['Siempre Noxus. Está bien.', 'Always Noxus. Very well.', 'Toujours Noxus. Très bien.']], 'h_b1'),
        ],
      },
    },
  },
};
