// Heimerdinger, Silco, Vander y Ekko. Cada texto: [español, inglés, francés].
const o = (t, tone, say, go, fx) => ({ t, tone, say, go, ...(fx ? { fx } : {}) });
module.exports = {
  // ============================================================ HEIMERDINGER
  heimerdinger: {
    entry: o(['Profesor, ¿tiene tiempo para una charla larga?', 'Professor, do you have time for a long chat?', 'Professeur, avez-vous le temps pour une longue discussion ?'], 'amable', null, 'h_raiz'),
    nodes: {
      h_raiz: {
        say: [['¡Tiempo! Ja, ja. Tengo más de doscientos años de él. Lo que me falta es interlocutores pacientes. Adelante, adelante.', 'Time! Ha ha. I have over two hundred years of it. What I lack is patient conversationalists. Go on, go on.', 'Du temps ! Ha ha. J\'en ai plus de deux cents ans. Ce qui me manque, ce sont des interlocuteurs patients. Allez-y, allez-y.']],
        again: [['¡Mi joven colega! ¿Retomamos? He estado pensando en nuestra última charla durante… unos minutos. Mucho, para mí.', 'My young friend! Shall we resume? I\'ve been thinking about our last chat for… a few minutes. A lot, for me.', 'Mon jeune collègue ! On reprend ? J\'ai réfléchi à notre dernière discussion pendant… quelques minutes. Beaucoup, pour moi.'],
          ['(Se ajusta las gafas.) Ah, sí, sí. Siéntese. Cuidado con ese cable, está vivo. Bueno, electrificado.', '(Adjusts his spectacles.) Ah, yes, yes. Sit. Mind that wire, it\'s live. Well, electrified.', '(Il ajuste ses lunettes.) Ah, oui, oui. Asseyez-vous. Attention à ce câble, il est vivant. Enfin, électrifié.']],
        opts: [
          o(['¿Cómo es su hogar, Bandle?', 'What is your home, Bandle, like?', 'Comment est votre foyer, Bandle ?'], 'pregunta', null, 'h_a1'),
          o(['¿Qué ha aprendido en dos siglos?', 'What have you learned in two centuries?', 'Qu\'avez-vous appris en deux siècles ?'], 'serio', null, 'h_b1'),
          o(['¿Cuál ha sido su peor invento?', 'What was your worst invention?', 'Quelle a été votre pire invention ?'], 'broma', null, 'h_c1'),
        ],
      },
      h_a1: {
        say: [['¡Oh, Bandle! Colores que aquí no tienen nombre. El tiempo allí no corre, pasea. Y huele a pan recién horneado casi siempre.', 'Oh, Bandle! Colours that have no names here. Time there doesn\'t run, it strolls. And it nearly always smells of fresh bread.', 'Oh, Bandle ! Des couleurs qui n\'ont pas de nom ici. Le temps ne court pas là-bas, il se promène. Et ça sent presque toujours le pain frais.']],
        again: [['Bandle sigue igual, supongo. Allí casi nada cambia. Es su encanto y su defecto.', 'Bandle is the same, I suppose. Almost nothing changes there. Its charm and its flaw.', 'Bandle est toujours pareil, je suppose. Presque rien n\'y change. C\'est son charme et son défaut.']],
        opts: [
          o(['¿Por qué se marchó?', 'Why did you leave?', 'Pourquoi êtes-vous parti ?'], 'pregunta', [['Curiosidad, mi joven colega. La curiosidad es un picor que no se rasca quedándose quieto.', 'Curiosity, my young colleague. Curiosity is an itch you can\'t scratch by staying still.', 'La curiosité, mon jeune collègue. La curiosité est une démangeaison qu\'on ne gratte pas en restant immobile.']], 'h_a2'),
          o(['Me encantaría verlo.', 'I\'d love to see it.', 'J\'adorerais le voir.'], 'amable', [['Quizá algún día. Pero le advierto: los humanos que entran salen con el pelo de colores y sin saber qué día es.', 'Perhaps one day. But be warned: humans who go in come out with coloured hair and no idea what day it is.', 'Peut-être un jour. Mais je vous préviens : les humains qui y entrent en ressortent avec les cheveux colorés et sans savoir quel jour on est.']], 'h_a2', { aff: 1 }),
          o(['¿Allí todos son tan bajitos?', 'Is everyone that short there?', 'Tout le monde est aussi petit là-bas ?'], 'broma', [['(Se estira todo lo que puede.) ¡Allí lo raro sería usted! ¡Un gigante torpe!', '(Stretches up as tall as he can.) There, my dear, the odd one would be you. A clumsy giant!', '(Il se redresse autant qu\'il peut.) Là-bas, c\'est vous qui seriez bizarre ! Un géant maladroit !']], 'h_a2', { aff: 1 }),
        ],
      },
      h_a2: {
        say: [['Llegué a Piltover cuando era un puerto de pescadores con ambiciones. He visto crecer cada torre. Y caer alguna.', 'I arrived in Piltover when it was a fishing port with ambitions. I\'ve watched every tower rise. And a few fall.', 'Je suis arrivé à Piltover quand c\'était un port de pêche avec des ambitions. J\'ai vu chaque tour s\'élever. Et quelques-unes tomber.']],
        opts: [
          o(['¿Cómo era entonces?', 'What was it like then?', 'Comment c\'était à l\'époque ?'], 'pregunta', [['Más pequeño. Más honesto. La gente se saludaba sin calcular cuánto valía el otro.', 'Smaller. More honest. People greeted each other without calculating what the other was worth.', 'Plus petit. Plus honnête. Les gens se saluaient sans calculer ce que valait l\'autre.']], 'h_a3'),
          o(['Debe de ser duro ver cambiar todo.', 'It must be hard to watch everything change.', 'Ça doit être dur de voir tout changer.'], 'amable', [['Lo duro es ver a la gente irse. Los edificios, al menos, dejan ruinas que visitar.', 'The hard part is watching people go. Buildings, at least, leave ruins you can visit.', 'Le plus dur, c\'est de voir les gens partir. Les bâtiments, au moins, laissent des ruines qu\'on peut visiter.']], 'h_a3', { aff: 1 }),
          o(['Usted es más viejo que la ciudad.', 'You\'re older than the city.', 'Vous êtes plus vieux que la ville.'], 'broma', [['¡Más sabio, querrá decir! La edad es solo un dato. La sabiduría es lo que haces con él.', 'Wiser, you mean! Age is just data. Wisdom is what you do with it.', 'Plus sage, vous voulez dire ! L\'âge n\'est qu\'une donnée. La sagesse, c\'est ce qu\'on en fait.']], 'h_a3'),
        ],
      },
      h_a3: {
        say: [['(Suspira.) A veces echo de menos Bandle. Luego un alumno me trae una pregunta imposible y se me pasa.', '(Sighs.) Sometimes I miss Bandle. Then a student brings me an impossible question and it passes.', '(Il soupire.) Parfois Bandle me manque. Puis un élève m\'apporte une question impossible, et ça passe.']],
        opts: [
          o(['Pues aquí va una: ¿qué ha aprendido en dos siglos?', 'Here\'s one, then: what have you learned in two centuries?', 'En voici une : qu\'avez-vous appris en deux siècles ?'], 'pregunta', [['¡Ja! Esa sí que es imposible. Me encanta.', 'Ha! Now that one is impossible. I love it.', 'Ha ! Celle-là est vraiment impossible. J\'adore.']], 'h_b1', { aff: 1 }),
          o(['¿Y su peor invento?', 'And your worst invention?', 'Et votre pire invention ?'], 'broma', [['Oh, no. Esa historia. Bueno, vale.', 'Oh, no. That story. Well, fine.', 'Oh, non. Cette histoire-là. Bon, d\'accord.']], 'h_c1'),
          o(['Le hacemos compañía, profesor.', 'We\'ll keep you company, professor.', 'On vous tient compagnie, professeur.'], 'amable', [['(Se le humedecen los ojos tras las gafas.) Muy amable. Muy, muy amable.', '(His eyes go misty behind his spectacles.) Very kind. Very, very kind.', '(Ses yeux s\'embuent derrière ses lunettes.) Très aimable. Très, très aimable.']], 'h_raiz', { aff: 1 }),
        ],
      },
      h_b1: {
        say: [['Que la prisa es la madre de casi todos los desastres. Y que el té se enfría si hablas demasiado.', 'That haste is the mother of almost every disaster. And that tea goes cold if you talk too much.', 'Que la hâte est la mère de presque tous les désastres. Et que le thé refroidit si on parle trop.']],
        again: [['Sigo pensando lo mismo: sin prisa. Y el té, caliente.', 'I still think the same: no haste. And the tea, hot.', 'Je pense toujours la même chose : sans hâte. Et le thé, chaud.']],
        opts: [
          o(['¿Por eso desconfía de la hextec?', 'Is that why you distrust hextech?', 'C\'est pour ça que vous vous méfiez de l\'hextech ?'], 'astuto', [['No desconfío de la hextec. Desconfío de la prisa con que la quieren. Son cosas distintas.', 'I don\'t distrust hextech. I distrust the haste with which they want it. Different things.', 'Je ne me méfie pas de l\'hextech. Je me méfie de la hâte avec laquelle on la veut. Ce sont deux choses différentes.']], 'h_b2', { stats: { ingenio: 1 } }),
          o(['Se le está enfriando el té ahora mismo.', 'Your tea is going cold right now.', 'Votre thé refroidit en ce moment même.'], 'broma', [['¡Oh, cielos! (Bebe de un trago.) Lección práctica, ¿ve?', 'Oh, my! (Drinks it in one gulp.) A practical lesson, you see?', 'Oh, mon Dieu ! (Il boit d\'un trait.) Leçon pratique, vous voyez ?']], 'h_b2', { aff: 1 }),
          o(['A veces hay que actuar rápido.', 'Sometimes you have to act fast.', 'Parfois, il faut agir vite.'], 'duro', [['A veces. Y casi siempre la gente cree que es una de esas veces.', 'Sometimes. And people almost always believe it\'s one of those times.', 'Parfois. Et les gens croient presque toujours que c\'est une de ces fois.']], 'h_b2'),
        ],
      },
      h_b2: {
        say: [['También he aprendido que los mejores alumnos son los que te contradicen. Y los que más te rompen el corazón.', 'I\'ve also learned that the best students are the ones who contradict you. And the ones who break your heart the most.', 'J\'ai aussi appris que les meilleurs élèves sont ceux qui vous contredisent. Et ceux qui vous brisent le plus le cœur.']],
        opts: [
          o(['¿Lo dice por Viktor y Jayce?', 'Do you mean Viktor and Jayce?', 'Vous parlez de Viktor et Jayce ?'], 'pregunta', [['Lo digo por todos. Pero sí. Por ellos sobre todo.', 'I mean all of them. But yes. Them most of all.', 'Je parle de tous. Mais oui. D\'eux surtout.']], 'h_b3'),
          o(['Usted les quiere mucho.', 'You love them dearly.', 'Vous les aimez beaucoup.'], 'amable', [['Como a los hijos que nunca tuve. Por eso les grito. Es la tradición.', 'Like the children I never had. That\'s why I shout at them. It\'s tradition.', 'Comme les enfants que je n\'ai jamais eus. C\'est pour ça que je leur crie dessus. C\'est la tradition.']], 'h_b3', { aff: 1 }),
          o(['Yo le contradeciría encantado.', 'I\'d happily contradict you.', 'Je vous contredirais avec plaisir.'], 'astuto', [['¡Excelente! Pero con argumentos, por favor. Lo de gritar lo dejo para mí.', 'Excellent! But with arguments, please. I\'ll keep the shouting for myself.', 'Excellent ! Mais avec des arguments, s\'il vous plaît. Les cris, je les garde pour moi.']], 'h_b3', { aff: 1 }),
        ],
      },
      h_b3: {
        say: [['Bueno, bueno. Me pongo filosófico y luego no duermo. ¿Y usted qué ha aprendido, en sus pocos añitos?', 'Well, well. I get philosophical and then I can\'t sleep. And what have you learned, in your few little years?', 'Bon, bon. Je deviens philosophe et après je ne dors plus. Et vous, qu\'avez-vous appris, en vos quelques petites années ?']],
        opts: [
          o(['Que no hay que rendirse.', 'Never to give up.', 'Qu\'il ne faut jamais abandonner.'], 'serio', [['Buena lección. Aunque a veces rendirse a tiempo también es sabio. Hablemos de cosas más ligeras.', 'Good lesson. Though sometimes giving up in time is wise too. Let\'s talk about lighter things.', 'Bonne leçon. Même si parfois abandonner à temps est sage aussi. Parlons de choses plus légères.']], 'h_c1'),
          o(['Que la gente mayor sabe mucho.', 'That older folk know a lot.', 'Que les anciens en savent beaucoup.'], 'amable', [['¡Adulador{g:|a|e}! Me gusta. Le contaré más de Bandle.', 'Flatterer! I like it. I\'ll tell you more about Bandle.', 'Flatteu{g:r|se|r·se} ! Ça me plaît. Je vais vous parler encore de Bandle.']], 'h_a1', { aff: 1 }),
          o(['Todavía nada, por eso pregunto.', 'Nothing yet, that\'s why I ask.', 'Rien encore, c\'est pour ça que je demande.'], 'broma', [['¡La respuesta de un científico! Empecemos de nuevo, pues.', 'A scientist\'s answer! Let\'s start again, then.', 'La réponse d\'un scientifique ! Recommençons, alors.']], 'h_raiz'),
        ],
      },
      h_c1: {
        say: [['(Se tapa la cara.) Un calcetín autoatable. Se ató solo. A mi tobillo. Durante tres días. Hubo que llamar a un herrero.', '(Covers his face.) A self-tying sock. It tied itself. To my ankle. For three days. A blacksmith had to be called.', '(Il se cache le visage.) Une chaussette qui se nouait toute seule. Elle s\'est nouée. À ma cheville. Pendant trois jours. Il a fallu appeler un forgeron.']],
        again: [['Sí, sí, el calcetín. Todo el mundo quiere oír lo del calcetín.', 'Yes, yes, the sock. Everyone wants to hear about the sock.', 'Oui, oui, la chaussette. Tout le monde veut entendre parler de la chaussette.']],
        opts: [
          o(['(Reírse sin poder parar.)', '(Laugh uncontrollably.)', '(Rire sans pouvoir s\'arrêter.)'], 'broma', [['¡No tiene gracia! …Bueno, un poco. El herrero se rió durante una semana.', 'It\'s not funny! …Well, a little. The blacksmith laughed for a week.', 'Ce n\'est pas drôle ! …Bon, un peu. Le forgeron a ri pendant une semaine.']], 'h_c2', { aff: 1 }),
          o(['¿Y qué aprendió de aquello?', 'And what did you learn from it?', 'Et qu\'en avez-vous appris ?'], 'pregunta', [['Que hay que poner un botón de apagado a todo. A TODO. Grábeselo.', 'That everything needs an off switch. EVERYTHING. Engrave that on your mind.', 'Qu\'il faut un bouton d\'arrêt à tout. À TOUT. Gravez-vous ça.']], 'h_c2', { stats: { ingenio: 1 } }),
          o(['Lo podría vender en Zaun.', 'You could sell it in Zaun.', 'Vous pourriez le vendre à Zaun.'], 'astuto', [['¡Ni se le ocurra! Alguien acabaría usándolo de arma. Es Zaun.', 'Don\'t even think it! Someone would turn it into a weapon. It\'s Zaun.', 'N\'y pensez même pas ! Quelqu\'un en ferait une arme. C\'est Zaun.']], 'h_c2'),
        ],
      },
      h_c2: {
        say: [['Hubo otros. Un paraguas que llovía hacia dentro. Un reloj que adelantaba el ánimo en lugar de la hora…', 'There were others. An umbrella that rained inward. A clock that advanced your mood instead of the time…', 'Il y en a eu d\'autres. Un parapluie qui pleuvait vers l\'intérieur. Une horloge qui avançait l\'humeur au lieu de l\'heure…']],
        opts: [
          o(['¡Quiero ese reloj!', 'I want that clock!', 'Je veux cette horloge !'], 'amable', [['Lo desmonté. Ponía a todo el mundo eufórico a las tres de la madrugada. Peligrosísimo.', 'I dismantled it. It made everyone euphoric at three in the morning. Terribly dangerous.', 'Je l\'ai démontée. Elle rendait tout le monde euphorique à trois heures du matin. Terriblement dangereux.']], 'h_c3'),
          o(['¿Algún invento salió bien?', 'Did any invention go well?', 'Une invention a-t-elle bien marché ?'], 'pregunta', [['¡Cientos! Pero esos no los cuenta nadie. Los fracasos son mucho más divertidos.', 'Hundreds! But nobody tells those. Failures are much more fun.', 'Des centaines ! Mais personne ne les raconte. Les échecs sont bien plus amusants.']], 'h_c3'),
          o(['Usted es un genio un poco desastre.', 'You\'re a genius who\'s a bit of a mess.', 'Vous êtes un génie un peu catastrophe.'], 'broma', [['¡Las dos cosas van juntas! Pregunte a cualquier genio. Si encuentra uno ordenado, desconfíe.', 'The two go together! Ask any genius. If you find a tidy one, be suspicious.', 'Les deux vont ensemble ! Demandez à n\'importe quel génie. Si vous en trouvez un ordonné, méfiez-vous.']], 'h_c3', { aff: 1 }),
        ],
      },
      h_c3: {
        say: [['¡Ay! Me lo estoy pasando en grande. Hace décadas que nadie me pregunta por mis desastres con tanto interés.', 'Oh! I\'m having a wonderful time. Nobody has asked about my disasters with such interest in decades.', 'Oh ! Je m\'amuse beaucoup. Personne ne m\'a demandé mes désastres avec autant d\'intérêt depuis des décennies.']],
        opts: [
          o(['Hábleme otra vez de Bandle.', 'Tell me about Bandle again.', 'Parlez-moi encore de Bandle.'], 'amable', [['¡Con mucho gusto! Póngase cómod{g:o|a|e}.', 'With pleasure! Make yourself comfortable.', 'Avec plaisir ! Installez-vous.']], 'h_a1'),
          o(['¿Y la lección de la prisa?', 'And the lesson about haste?', 'Et la leçon sur la hâte ?'], 'serio', [['Ah, la importante. Escuche bien.', 'Ah, the important one. Listen closely.', 'Ah, la plus importante. Écoutez bien.']], 'h_b1'),
          o(['Vuelvo enseguida con más preguntas.', 'I\'ll be right back with more questions.', 'Je reviens tout de suite avec d\'autres questions.'], 'broma', [['¡Aquí estaré! Llevo dos siglos aquí, unos minutos más no importan.', 'I\'ll be here! I\'ve been here two centuries; a few minutes more won\'t matter.', 'Je serai là ! Ça fait deux siècles que je suis ici ; quelques minutes de plus ne changeront rien.']], 'h_raiz'),
        ],
      },
    },
  },

  // ============================================================ SILCO
  silco: {
    entry: o(['Silco. Hablemos sin prisas. De verdad.', 'Silco. Let\'s talk, no hurry. For real.', 'Silco. Parlons sans hâte. Pour de vrai.'], 'astuto', null, 'h_raiz'),
    nodes: {
      h_raiz: {
        say: [['(Deja el vaso sobre la mesa sin apartar el ojo de ti.) Muy pocos se sientan frente a mí sin querer algo. Veamos qué quieres tú.', '(Sets his glass on the table without taking his eye off you.) Very few sit across from me without wanting something. Let\'s see what you want.', '(Il pose son verre sur la table sans te quitter de l\'œil.) Très peu s\'assoient en face de moi sans rien vouloir. Voyons ce que tu veux.']],
        again: [['Otra vez aquí. O tienes mucho valor o mucha curiosidad. En Zaun, ambas cosas acortan la vida.', 'Here again. Either you\'re very brave or very curious. In Zaun, both shorten your life.', 'Encore ici. Soit tu as beaucoup de courage, soit beaucoup de curiosité. À Zaun, les deux raccourcissent la vie.'],
          ['(Hace un gesto hacia la silla.) Siéntate. Hoy estoy de humor para escuchar.', '(Gestures toward the chair.) Sit. Today I\'m in the mood to listen.', '(Il désigne la chaise.) Assieds-toi. Aujourd\'hui, je suis d\'humeur à écouter.']],
        opts: [
          o(['¿Cómo era Zaun cuando eras joven?', 'What was Zaun like when you were young?', 'Comment était Zaun quand tu étais jeune ?'], 'pregunta', null, 'h_a1'),
          o(['¿Qué significa para ti el poder?', 'What does power mean to you?', 'Que signifie le pouvoir pour toi ?'], 'astuto', null, 'h_b1'),
          o(['¿Qué haces cuando nadie te ve?', 'What do you do when nobody\'s watching?', 'Que fais-tu quand personne ne te voit ?'], 'serio', null, 'h_c1'),
        ],
      },
      h_a1: {
        say: [['Más oscura. Más pobre. Más unida. Éramos ratas, pero ratas que compartían el queso.', 'Darker. Poorer. More united. We were rats, but rats who shared the cheese.', 'Plus sombre. Plus pauvre. Plus unie. On était des rats, mais des rats qui partageaient le fromage.']],
        again: [['El pasado no cambia por mucho que lo mires. Pero sigues mirándolo conmigo.', 'The past doesn\'t change however much you stare at it. But you keep staring at it with me.', 'Le passé ne change pas, même si tu le fixes. Mais tu continues de le fixer avec moi.']],
        opts: [
          o(['¿Y qué cambió?', 'And what changed?', 'Et qu\'est-ce qui a changé ?'], 'pregunta', [['Que Piltover nos enseñó que compartir no basta si alguien te pisa desde arriba.', 'Piltover taught us that sharing isn\'t enough when someone treads on you from above.', 'Piltover nous a appris que partager ne suffit pas quand quelqu\'un te marche dessus d\'en haut.']], 'h_a2'),
          o(['Suenas nostálgico.', 'You sound nostalgic.', 'Tu as l\'air nostalgique.'], 'amable', [['(Una sonrisa fría.) La nostalgia es un lujo. Pero esta noche me lo permito.', '(A cold smile.) Nostalgia is a luxury. But tonight I\'ll allow it.', '(Un sourire froid.) La nostalgie est un luxe. Mais ce soir, je me l\'accorde.']], 'h_a2', { aff: 1 }),
          o(['Las ratas siguen siendo ratas.', 'Rats are still rats.', 'Les rats restent des rats.'], 'duro', [['Y aun así, las ratas sobreviven a todo. Recuérdalo cuando te creas por encima.', 'And yet rats survive everything. Remember that when you think yourself above them.', 'Et pourtant, les rats survivent à tout. Souviens-t\'en quand tu te croiras au-dessus.']], 'h_a2', { aff: -1 }),
        ],
      },
      h_a2: {
        say: [['Vander y yo soñábamos con una nación. No una ciudad debajo de otra: una nación. Con su propia bandera.', 'Vander and I dreamed of a nation. Not a city beneath another: a nation. With its own flag.', 'Vander et moi rêvions d\'une nation. Pas une ville sous une autre : une nation. Avec son propre drapeau.']],
        opts: [
          o(['¿Cómo sería esa bandera?', 'What would that flag look like?', 'À quoi ressemblerait ce drapeau ?'], 'pregunta', [['(Piensa un momento.) Verde. Como el humo que nos dieron. Lo convertiríamos en orgullo.', '(Thinks for a moment.) Green. Like the smoke they gave us. We\'d turn it into pride.', '(Il réfléchit un moment.) Vert. Comme la fumée qu\'ils nous ont donnée. On en ferait une fierté.']], 'h_a3'),
          o(['Todavía puedes construirla sin Brillo.', 'You can still build it without Shimmer.', 'Tu peux encore la construire sans Shimmer.'], 'serio', [['¿Sin Brillo? Las naciones se construyen con lo que hay a mano. A mí me dejaron poco.', 'Without Shimmer? Nations are built with what\'s at hand. I was left with little.', 'Sans Shimmer ? Les nations se construisent avec ce qu\'on a sous la main. On ne m\'a pas laissé grand-chose.']], 'h_a3', { rep: { zaun: 1 } }),
          o(['Qué pena que os separarais.', 'Such a shame you two split.', 'Dommage que vous vous soyez séparés.'], 'amable', [['(Tamborilea los dedos.) Pena. Sí. Esa es una palabra.', '(Drums his fingers.) A shame. Yes. That is one word for it.', '(Il tapote des doigts.) Dommage. Oui. C\'est un mot.']], 'h_a3'),
        ],
      },
      h_a3: {
        say: [['Suficiente historia. Los recuerdos son como el Brillo: un poco te hace fuerte, demasiado te deshace.', 'Enough history. Memories are like Shimmer: a little makes you strong, too much unmakes you.', 'Assez d\'histoire. Les souvenirs sont comme le Shimmer : un peu te rend fort, trop te défait.']],
        opts: [
          o(['Entonces hablemos de poder.', 'Then let\'s talk about power.', 'Alors parlons de pouvoir.'], 'astuto', [['Mi tema favorito. Por fin una pregunta útil.', 'My favourite subject. At last, a useful question.', 'Mon sujet préféré. Enfin une question utile.']], 'h_b1', { aff: 1 }),
          o(['¿Qué haces cuando estás solo?', 'What do you do when you\'re alone?', 'Que fais-tu quand tu es seul ?'], 'serio', [['Pregunta peligrosa. Pero te la dejo pasar.', 'A dangerous question. But I\'ll let it pass.', 'Question dangereuse. Mais je la laisse passer.']], 'h_c1'),
          o(['Vale. Empecemos de nuevo.', 'Fine. Let\'s start again.', 'D\'accord. Recommençons.'], 'pregunta', [['Como Zaun. Siempre empezando de nuevo.', 'Like Zaun. Always starting again.', 'Comme Zaun. Toujours en train de recommencer.']], 'h_raiz'),
        ],
      },
      h_b1: {
        say: [['El poder es que te escuchen sin tener que gritar. Piltover lo tiene de nacimiento. Yo lo tuve que fabricar.', 'Power is being heard without having to shout. Piltover is born with it. I had to manufacture mine.', 'Le pouvoir, c\'est être écouté sans avoir à crier. Piltover naît avec. Moi, j\'ai dû le fabriquer.']],
        again: [['¿Otra lección sobre el poder? Te advierto que las cobro.', 'Another lesson on power? I warn you, I charge for them.', 'Une autre leçon sur le pouvoir ? Je te préviens, je les fais payer.']],
        opts: [
          o(['¿Y a qué precio?', 'And at what price?', 'Et à quel prix ?'], 'serio', [['A todos los precios. Cada uno de ellos lo volvería a pagar.', 'Every price. And I would pay each of them again.', 'À tous les prix. Et je les paierais chacun encore.']], 'h_b2'),
          o(['Yo te escucho sin que grites.', 'I listen to you without you shouting.', 'Je t\'écoute sans que tu cries.'], 'astuto', [['(Inclina la cabeza.) Entonces o me temes o me respetas. Ambas me sirven.', '(Tilts his head.) Then either you fear me or you respect me. Both serve me.', '(Il penche la tête.) Alors soit tu me crains, soit tu me respectes. Les deux me servent.']], 'h_b2', { aff: 1 }),
          o(['El poder sin justicia es tiranía.', 'Power without justice is tyranny.', 'Le pouvoir sans justice, c\'est la tyrannie.'], 'duro', [['La justicia es lo que los poderosos escriben después. Lee la historia de Piltover si no me crees.', 'Justice is what the powerful write afterwards. Read Piltover\'s history if you don\'t believe me.', 'La justice, c\'est ce que les puissants écrivent après coup. Lis l\'histoire de Piltover si tu ne me crois pas.']], 'h_b2'),
        ],
      },
      h_b2: {
        say: [['Lo que nadie entiende es que el poder no se tiene. Se mantiene. Cada día. Como una herida que no dejas cerrar.', 'What nobody understands is that power isn\'t held. It\'s maintained. Every day. Like a wound you won\'t let close.', 'Ce que personne ne comprend, c\'est que le pouvoir ne se possède pas. Il s\'entretient. Chaque jour. Comme une blessure qu\'on empêche de se refermer.']],
        opts: [
          o(['Eso suena agotador.', 'That sounds exhausting.', 'Ça semble épuisant.'], 'amable', [['Lo es. Nadie pregunta si estoy cansado. Hasta hoy.', 'It is. Nobody asks if I\'m tired. Until today.', 'Ça l\'est. Personne ne demande si je suis fatigué. Jusqu\'à aujourd\'hui.']], 'h_b3', { aff: 1 }),
          o(['¿Cómo lo mantienes?', 'How do you maintain it?', 'Comment l\'entretiens-tu ?'], 'pregunta', [['Sabiendo lo que todos temen. Y no temiendo nada visible.', 'By knowing what everyone fears. And fearing nothing that shows.', 'En sachant ce que tout le monde craint. Et en ne craignant rien de visible.']], 'h_b3', { stats: { ingenio: 1 } }),
          o(['Algún día se te cerrará.', 'Someday it\'ll close on you.', 'Un jour, elle se refermera.'], 'duro', [['(Te mira largo rato.) Puede. Pero no será hoy, ni por tu mano.', '(Looks at you for a long moment.) Perhaps. But not today, and not by your hand.', '(Il te regarde longuement.) Peut-être. Mais pas aujourd\'hui, ni de ta main.']], 'h_b3'),
        ],
      },
      h_b3: {
        say: [['Me has hecho hablar más de la cuenta. Eso, en otro, sería motivo de preocupación.', 'You\'ve made me talk more than I should. In anyone else, that would be cause for concern.', 'Tu m\'as fait parler plus que de raison. Chez un autre, ce serait inquiétant.']],
        opts: [
          o(['Y en mí, ¿qué es?', 'And in me, what is it?', 'Et chez moi, c\'est quoi ?'], 'coqueto', [['Una rareza. Las rarezas me interesan. Sigamos.', 'An oddity. Oddities interest me. Let\'s go on.', 'Une bizarrerie. Les bizarreries m\'intéressent. Continuons.']], 'h_c1', { aff: 1 }),
          o(['Cuéntame más del pasado.', 'Tell me more about the past.', 'Raconte-moi encore le passé.'], 'pregunta', [['El pasado. Siempre vuelves a él. Como yo.', 'The past. You always return to it. Like me.', 'Le passé. Tu y reviens toujours. Comme moi.']], 'h_a1'),
          o(['Mejor cambio de tema.', 'Better change the subject.', 'Mieux vaut changer de sujet.'], 'sigilo', [['Prudente. Zaun premia la prudencia. A veces.', 'Prudent. Zaun rewards prudence. Sometimes.', 'Prudent{g:|e|·e}. Zaun récompense la prudence. Parfois.']], 'h_raiz'),
        ],
      },
      h_c1: {
        say: [['(Mira hacia la ventana.) Escucho a Jinx trastear en su taller. Si hace ruido, está bien. Es el silencio lo que me inquieta.', '(Looks toward the window.) I listen to Jinx tinkering in her workshop. If she\'s making noise, she\'s fine. It\'s silence that troubles me.', '(Il regarde vers la fenêtre.) J\'écoute Jinx bricoler dans son atelier. Si elle fait du bruit, tout va bien. C\'est le silence qui m\'inquiète.']],
        again: [['Esta noche hay ruido en el taller. Buena señal.', 'There\'s noise in the workshop tonight. A good sign.', 'Il y a du bruit dans l\'atelier ce soir. Bon signe.']],
        opts: [
          o(['La quieres de verdad.', 'You truly love her.', 'Tu l\'aimes vraiment.'], 'amable', [['(Un silencio largo.) Es lo único que he hecho bien. No se lo digas a nadie. Ni a ella.', '(A long silence.) She\'s the one thing I\'ve done right. Don\'t tell anyone. Not even her.', '(Un long silence.) C\'est la seule chose que j\'ai bien faite. Ne le dis à personne. Pas même à elle.']], 'h_c2', { aff: 2 }),
          o(['¿Y si el ruido es una bomba?', 'And if the noise is a bomb?', 'Et si le bruit, c\'est une bombe ?'], 'broma', [['Entonces también está bien. Con Jinx, las bombas son buena señal.', 'Then she\'s fine too. With Jinx, bombs are a good sign.', 'Alors tout va bien aussi. Avec Jinx, les bombes sont bon signe.']], 'h_c2', { aff: 1 }),
          o(['La estás usando.', 'You\'re using her.', 'Tu te sers d\'elle.'], 'duro', [['(Su ojo se oscurece.) Ten mucho cuidado con lo que dices de mi hija.', '(His eye darkens.) Be very careful what you say about my daughter.', '(Son œil s\'assombrit.) Fais très attention à ce que tu dis de ma fille.']], 'h_c2', { aff: -2 }),
        ],
      },
      h_c2: {
        say: [['También leo. Poesía, sí. No pongas esa cara. Zaun tiene poetas; solo que se mueren antes de publicar.', 'I also read. Poetry, yes. Don\'t make that face. Zaun has poets; they just die before they publish.', 'Je lis aussi. De la poésie, oui. Ne fais pas cette tête. Zaun a des poètes ; ils meurent juste avant de publier.']],
        opts: [
          o(['¿Me recitas algo?', 'Will you recite something for me?', 'Tu me récites quelque chose ?'], 'amable', [['«Del barro nace el que no pidió nacer, y aun así se levanta.» (Pausa.) No es mío. O sí. No lo sabrás nunca.', '"From the mud is born one who never asked to be born, and still he rises." (Pause.) It isn\'t mine. Or it is. You\'ll never know.', '« De la boue naît celui qui n\'a pas demandé à naître, et pourtant il se lève. » (Pause.) Ce n\'est pas de moi. Ou si. Tu ne le sauras jamais.']], 'h_c3', { aff: 1 }),
          o(['Un capo poeta. Ya lo he visto todo.', 'A poet kingpin. Now I\'ve seen it all.', 'Un caïd poète. J\'aurai tout vu.'], 'broma', [['Aún no has visto nada. Y es mejor así.', 'You haven\'t seen anything yet. And it\'s better that way.', 'Tu n\'as encore rien vu. Et c\'est mieux ainsi.']], 'h_c3'),
          o(['¿Qué poetas te gustan?', 'Which poets do you like?', 'Quels poètes aimes-tu ?'], 'pregunta', [['Los que escriben desde abajo. Los de arriba escriben sobre flores que nunca han tenido que regar.', 'Those who write from below. The ones up top write about flowers they\'ve never had to water.', 'Ceux qui écrivent d\'en bas. Ceux d\'en haut écrivent sur des fleurs qu\'ils n\'ont jamais eu à arroser.']], 'h_c3'),
        ],
      },
      h_c3: {
        say: [['Es tarde. Pero la noche en Zaun es larga, y la conversación no es mala.', 'It\'s late. But the night in Zaun is long, and the conversation isn\'t bad.', 'Il est tard. Mais la nuit est longue à Zaun, et la conversation n\'est pas mauvaise.']],
        opts: [
          o(['Hablemos de poder otra vez.', 'Let\'s talk about power again.', 'Parlons encore de pouvoir.'], 'astuto', [['Insaciable. Me recuerdas a alguien.', 'Insatiable. You remind me of someone.', 'Insatiable. Tu me rappelles quelqu\'un.']], 'h_b1'),
          o(['Cuéntame de la Zaun de antes.', 'Tell me about the old Zaun.', 'Parle-moi du Zaun d\'avant.'], 'pregunta', [['La de antes. Bien.', 'The old one. Very well.', 'Celui d\'avant. Bien.']], 'h_a1'),
          o(['Otra ronda, entonces.', 'Another round, then.', 'Une autre tournée, alors.'], 'amable', [['(Rellena los dos vasos.) Otra ronda.', '(Refills both glasses.) Another round.', '(Il remplit les deux verres.) Une autre tournée.']], 'h_raiz'),
        ],
      },
    },
  },

  // ============================================================ VANDER
  vander: {
    entry: o(['Vander, ¿me pones algo y charlamos un buen rato?', 'Vander, pour me something and let\'s chat a good while?', 'Vander, tu me sers un verre et on discute un bon moment ?'], 'amable', null, 'h_raiz'),
    nodes: {
      h_raiz: {
        say: [['(Limpia un vaso con un trapo que ha visto días mejores.) Para eso está la barra. Dispara.', '(Wipes a glass with a rag that\'s seen better days.) That\'s what the bar\'s for. Fire away.', '(Il essuie un verre avec un chiffon qui a connu des jours meilleurs.) C\'est à ça que sert le comptoir. Vas-y.']],
        again: [['Vuelves. Bien. La Última Gota echa de menos a la gente que habla en vez de pelear.', 'You\'re back. Good. The Last Drop misses people who talk instead of brawl.', 'Te revoilà. Bien. La Dernière Goutte regrette les gens qui parlent au lieu de se battre.'],
          ['(Te pone una jarra sin preguntar.) La de siempre. ¿De qué hablamos?', '(Sets a mug down without asking.) The usual. What are we talking about?', '(Il pose une chope sans demander.) Comme d\'habitude. On parle de quoi ?']],
        opts: [
          o(['¿Cómo acabaste con una taberna?', 'How did you end up with a tavern?', 'Comment t\'es-tu retrouvé avec une taverne ?'], 'pregunta', null, 'h_a1'),
          o(['¿Cómo se cría a cuatro críos en Zaun?', 'How do you raise four kids in Zaun?', 'Comment élève-t-on quatre gamins à Zaun ?'], 'amable', null, 'h_b1'),
          o(['¿Por qué dejaste de luchar?', 'Why did you stop fighting?', 'Pourquoi as-tu arrêté de te battre ?'], 'serio', null, 'h_c1'),
        ],
      },
      h_a1: {
        say: [['Necesitaba un sitio donde la gente pudiera estar sin que nadie les pidiera nada. Y donde yo pudiera vigilar sin que pareciera que vigilo.', 'I needed a place where people could just be, without anyone asking anything of them. And where I could keep watch without it looking like I was.', 'Il me fallait un endroit où les gens pourraient être là sans qu\'on leur demande rien. Et où je pourrais surveiller sans en avoir l\'air.']],
        again: [['La taberna sigue en pie. Más o menos. Ayer alguien rompió otra silla.', 'The tavern\'s still standing. More or less. Someone broke another chair yesterday.', 'La taverne tient toujours debout. Plus ou moins. Quelqu\'un a encore cassé une chaise hier.']],
        opts: [
          o(['¿Vigilar el qué?', 'Keep watch over what?', 'Surveiller quoi ?'], 'pregunta', [['Que nadie se pase de la raya. Ni de un lado ni del otro del puente.', 'That nobody crosses the line. From either side of the bridge.', 'Que personne ne dépasse les bornes. D\'un côté comme de l\'autre du pont.']], 'h_a2'),
          o(['Es el mejor sitio de Zaun.', 'It\'s the best place in Zaun.', 'C\'est le meilleur endroit de Zaun.'], 'amable', [['(Sonríe bajo la barba.) No se lo digas a los parroquianos, que me suben el precio de la paciencia.', '(Smiles under his beard.) Don\'t tell the regulars, they\'ll raise the price of my patience.', '(Il sourit dans sa barbe.) Ne le dis pas aux habitués, ils vont faire monter le prix de ma patience.']], 'h_a2', { aff: 1 }),
          o(['La cerveza está aguada.', 'The beer\'s watered down.', 'La bière est coupée à l\'eau.'], 'broma', [['¡Aguada! (Ríe con todo el pecho.) Te la cambio por agua del sumidero, a ver qué prefieres.', 'Watered! (Laughs from the chest.) I\'ll swap it for sump water, see which you prefer.', 'Coupée ! (Il rit à pleine poitrine.) Je te l\'échange contre de l\'eau du puisard, on verra ce que tu préfères.']], 'h_a2', { aff: 1 }),
        ],
      },
      h_a2: {
        say: [['Aquí han pasado cosas. Bodas, peleas, un parto una vez, en esa mesa del fondo. La gente vuelve a los sitios donde se siente en casa.', 'Things have happened here. Weddings, fights, a birth once, at that table at the back. People return to places where they feel at home.', 'Il s\'en est passé, ici. Des mariages, des bagarres, une naissance une fois, à cette table du fond. Les gens reviennent là où ils se sentent chez eux.']],
        opts: [
          o(['¿Un parto? ¡Cuenta!', 'A birth? Tell me!', 'Une naissance ? Raconte !'], 'broma', [['Una tormenta, las calles inundadas y yo con un trapo y agua caliente. La niña se llama Gota. Ya te imaginas por qué.', 'A storm, flooded streets and me with a rag and hot water. The girl\'s called Drop. You can guess why.', 'Une tempête, les rues inondées et moi avec un chiffon et de l\'eau chaude. La petite s\'appelle Goutte. Tu devines pourquoi.']], 'h_a3', { aff: 1 }),
          o(['Para mucha gente, tú eres la casa.', 'For many people, you are home.', 'Pour beaucoup de gens, c\'est toi, la maison.'], 'amable', [['(Se queda quieto con el vaso en la mano.) Eso pesa más de lo que parece.', '(Stands still, glass in hand.) That weighs more than it seems.', '(Il reste immobile, le verre à la main.) Ça pèse plus lourd qu\'on ne croit.']], 'h_a3', { aff: 1 }),
          o(['¿Y las peleas quién las paraba?', 'And who broke up the fights?', 'Et qui arrêtait les bagarres ?'], 'pregunta', [['(Se señala los puños.) Estos dos. Con mucha diplomacia.', '(Points at his fists.) These two. With a lot of diplomacy.', '(Il montre ses poings.) Ces deux-là. Avec beaucoup de diplomatie.']], 'h_a3'),
        ],
      },
      h_a3: {
        say: [['Bueno, basta de mi taberna. Que parezco un viejo contando batallitas.', 'Well, enough about my tavern. I sound like an old man telling war stories.', 'Bon, assez parlé de ma taverne. On dirait un vieux qui raconte ses histoires de guerre.']],
        opts: [
          o(['Háblame de los chicos.', 'Tell me about the kids.', 'Parle-moi des gamins.'], 'amable', [['Ah, los chicos. Eso sí que es una batalla.', 'Ah, the kids. Now that\'s a battle.', 'Ah, les gamins. Ça, c\'est une vraie bataille.']], 'h_b1', { aff: 1 }),
          o(['¿Y las batallas de verdad?', 'And the real battles?', 'Et les vraies batailles ?'], 'serio', [['(Deja de limpiar.) Esas son otra cosa.', '(Stops wiping.) Those are something else.', '(Il arrête d\'essuyer.) Ça, c\'est autre chose.']], 'h_c1'),
          o(['Ponme otra y empezamos de nuevo.', 'Pour me another and let\'s start over.', 'Sers-m\'en une autre et on recommence.'], 'broma', [['Esta la pagas. Bueno, ya veremos.', 'You\'re paying for this one. Well, we\'ll see.', 'Celle-là, tu la paies. Enfin, on verra.']], 'h_raiz'),
        ],
      },
      h_b1: {
        say: [['¿Cuatro? Con paciencia, cinta adhesiva y no preguntando de dónde salen las cosas que traen. Vi pega, Powder inventa, Mylo roba, Claggor arregla.', 'Four? With patience, sticky tape and not asking where the things they bring come from. Vi hits, Powder invents, Mylo steals, Claggor fixes.', 'Quatre ? Avec de la patience, du ruban adhésif et sans demander d\'où sortent les choses qu\'ils ramènent. Vi frappe, Powder invente, Mylo vole, Claggor répare.']],
        again: [['Los chicos siguen igual de terremotos. Hoy Powder ha volado el váter. Otra vez.', 'The kids are still a handful. Powder blew up the toilet today. Again.', 'Les gamins sont toujours aussi infernaux. Powder a fait sauter les toilettes aujourd\'hui. Encore.']],
        opts: [
          o(['¿Y tú qué haces?', 'And what do you do?', 'Et toi, tu fais quoi ?'], 'pregunta', [['Yo pago los platos rotos. Literalmente. Tengo una lista.', 'I pay for the broken dishes. Literally. I have a list.', 'Moi, je paie les pots cassés. Littéralement. J\'ai une liste.']], 'h_b2', { aff: 1 }),
          o(['No son tuyos, y aun así los cuidas.', 'They\'re not yours, and still you look after them.', 'Ils ne sont pas à toi, et pourtant tu prends soin d\'eux.'], 'amable', [['(Serio.) Son míos. La sangre no tiene nada que ver.', '(Serious.) They\'re mine. Blood has nothing to do with it.', '(Sérieux.) Ils sont à moi. Le sang n\'a rien à voir.']], 'h_b2', { aff: 2 }),
          o(['Mylo roba, ¿eh? Me cae bien.', 'Mylo steals, huh? I like him.', 'Mylo vole, hein ? Il me plaît.'], 'broma', [['No le digas eso, que se lo cree. Ya bastante ego tiene para su tamaño.', 'Don\'t tell him that, he\'ll believe it. He\'s got enough ego for his size.', 'Ne lui dis pas ça, il va y croire. Il a déjà assez d\'ego pour sa taille.']], 'h_b2'),
        ],
      },
      h_b2: {
        say: [['Lo que más me asusta es Vi. Tiene mi genio de joven. Y yo de joven estuve a punto de quemar la ciudad.', 'What scares me most is Vi. She has my temper from when I was young. And when I was young I nearly burned the city down.', 'Ce qui me fait le plus peur, c\'est Vi. Elle a mon caractère de jeunesse. Et jeune, j\'ai failli brûler la ville.']],
        opts: [
          o(['Tú la frenarás.', 'You\'ll hold her back.', 'Tu la retiendras.'], 'amable', [['Eso intento. Pero a los chavales no se les frena: se les enseña a frenarse solos.', 'That\'s what I\'m trying. But you don\'t hold kids back: you teach them to hold themselves back.', 'C\'est ce que j\'essaie. Mais on ne retient pas les gamins : on leur apprend à se retenir seuls.']], 'h_b3', { aff: 1 }),
          o(['¿Y Powder?', 'And Powder?', 'Et Powder ?'], 'pregunta', [['Powder tiene algo… brillante. Y frágil. Necesita que alguien crea en ella. Yo lo hago. Espero que baste.', 'Powder has something… brilliant. And fragile. She needs someone to believe in her. I do. I hope it\'s enough.', 'Powder a quelque chose de… brillant. Et fragile. Elle a besoin que quelqu\'un croie en elle. Moi, j\'y crois. J\'espère que ça suffit.']], 'h_b3'),
          o(['Quizá Vi tenga razón en estar furiosa.', 'Maybe Vi\'s right to be furious.', 'Peut-être que Vi a raison d\'être furieuse.'], 'duro', [['Razón tiene. Lo que no tiene es un plan. Y la rabia sin plan entierra gente.', 'She\'s right. What she doesn\'t have is a plan. And rage without a plan buries people.', 'Elle a raison. Ce qu\'elle n\'a pas, c\'est un plan. Et la rage sans plan enterre des gens.']], 'h_b3'),
        ],
      },
      h_b3: {
        say: [['(Mira hacia la escalera del ático.) Duermen. Por una vez. Este silencio vale oro.', '(Looks toward the attic stairs.) They\'re asleep. For once. This silence is worth gold.', '(Il regarde vers l\'escalier du grenier.) Ils dorment. Pour une fois. Ce silence vaut de l\'or.']],
        opts: [
          o(['Hablemos bajito, entonces.', 'Let\'s talk quietly, then.', 'Parlons doucement, alors.'], 'sigilo', [['(Susurra.) Buena idea. Pregúntame lo que quieras. Pero bajito.', '(Whispers.) Good idea. Ask me anything. But quietly.', '(Il chuchote.) Bonne idée. Demande-moi ce que tu veux. Mais doucement.']], 'h_raiz', { aff: 1 }),
          o(['¿Por qué dejaste de luchar, Vander?', 'Why did you stop fighting, Vander?', 'Pourquoi as-tu arrêté de te battre, Vander ?'], 'serio', [['(Suspira.) Supongo que te lo has ganado.', '(Sighs.) I suppose you\'ve earned it.', '(Il soupire.) Je suppose que tu l\'as mérité.']], 'h_c1'),
          o(['Cuéntame más de la taberna.', 'Tell me more about the tavern.', 'Raconte-moi encore la taverne.'], 'amable', [['La taberna. Siempre la taberna.', 'The tavern. Always the tavern.', 'La taverne. Toujours la taverne.']], 'h_a1'),
        ],
      },
      h_c1: {
        say: [['(Se mira los nudillos.) Porque vi lo que cuesta. Gente buena muerta en un puente. Niños sin padres. Me prometí que mis chicos no pagarían ese precio.', '(Looks at his knuckles.) Because I saw what it costs. Good people dead on a bridge. Children without parents. I swore my kids wouldn\'t pay that price.', '(Il regarde ses jointures.) Parce que j\'ai vu ce que ça coûte. Des gens bien morts sur un pont. Des enfants sans parents. Je me suis juré que mes gamins ne paieraient pas ce prix.']],
        again: [['Esa promesa sigue en pie. Me cuesta cada día, pero sigue en pie.', 'That promise still stands. It costs me every day, but it stands.', 'Cette promesse tient toujours. Elle me coûte chaque jour, mais elle tient.']],
        opts: [
          o(['Algunos dicen que te vendiste a Piltover.', 'Some say you sold out to Piltover.', 'Certains disent que tu t\'es vendu à Piltover.'], 'duro', [['Que lo digan. Prefiero que me llamen traidor a contar críos en la morgue.', 'Let them. I\'d rather be called a traitor than count kids in the morgue.', 'Qu\'ils le disent. Je préfère qu\'on me traite de traître plutôt que de compter des gamins à la morgue.']], 'h_c2'),
          o(['Hace falta valor para parar.', 'It takes courage to stop.', 'Il faut du courage pour s\'arrêter.'], 'amable', [['Más que para pegar, sí. Nadie te aplaude por no pelear.', 'More than to hit, yes. Nobody applauds you for not fighting.', 'Plus que pour frapper, oui. Personne ne t\'applaudit pour ne pas te battre.']], 'h_c2', { aff: 1 }),
          o(['¿Guardas aún los guanteletes?', 'Do you still keep the gauntlets?', 'Tu gardes encore les gantelets ?'], 'pregunta', [['(Una pausa demasiado larga.) Algunas cosas se guardan para no olvidar. No para usarlas.', '(A pause too long.) Some things are kept so you don\'t forget. Not to use them.', '(Une pause trop longue.) Certaines choses se gardent pour ne pas oublier. Pas pour s\'en servir.']], 'h_c2'),
        ],
      },
      h_c2: {
        say: [['Si alguna vez me pasa algo, quiero que alguien les diga a los chicos que estoy orgulloso. Aunque no lo diga lo bastante.', 'If anything ever happens to me, I want someone to tell the kids I\'m proud. Even if I don\'t say it enough.', 'S\'il m\'arrive quelque chose un jour, je veux que quelqu\'un dise aux gamins que je suis fier. Même si je ne le dis pas assez.']],
        opts: [
          o(['Díselo tú. Hoy.', 'Tell them yourself. Today.', 'Dis-le-leur toi-même. Aujourd\'hui.'], 'amable', [['(Te mira un buen rato. Asiente.) Mañana en el desayuno. Antes de que Powder vuele las tostadas.', '(Looks at you a long while. Nods.) Tomorrow at breakfast. Before Powder blows up the toast.', '(Il te regarde longuement. Hoche la tête.) Demain au petit-déjeuner. Avant que Powder fasse sauter les tartines.']], 'h_c3', { aff: 2 }),
          o(['Te lo prometo.', 'I promise you.', 'Je te le promets.'], 'serio', [['Gracias. Eso me quita un peso que llevo años cargando.', 'Thank you. That lifts a weight I\'ve been carrying for years.', 'Merci. Ça m\'enlève un poids que je porte depuis des années.']], 'h_c3', { aff: 1 }),
          o(['No va a pasarte nada, grandullón.', 'Nothing\'s going to happen to you, big guy.', 'Il ne va rien t\'arriver, mon grand.'], 'broma', [['(Ríe, pero no del todo.) De tu boca a oídos de quien sea que escuche ahí arriba.', '(Laughs, but not quite.) From your lips to whoever\'s listening up there.', '(Il rit, mais pas tout à fait.) Que ceux qui écoutent là-haut t\'entendent.']], 'h_c3'),
        ],
      },
      h_c3: {
        say: [['Bueno. Basta de ponerse tierno. Que luego Vi me ve los ojos rojos y se cree que he llorado.', 'Right. Enough getting soft. Vi\'ll see my red eyes and think I\'ve been crying.', 'Bon. Assez de tendresse. Vi va voir mes yeux rouges et croire que j\'ai pleuré.']],
        opts: [
          o(['¿Y no has llorado?', 'And haven\'t you?', 'Et tu n\'as pas pleuré ?'], 'broma', [['Es el humo de Zaun. Siempre es el humo. Venga, otra cosa.', 'It\'s Zaun\'s smoke. It\'s always the smoke. Go on, something else.', 'C\'est la fumée de Zaun. C\'est toujours la fumée. Allez, autre chose.']], 'h_raiz', { aff: 1 }),
          o(['Háblame más de los chicos.', 'Tell me more about the kids.', 'Parle-moi encore des gamins.'], 'amable', [['Nunca me canso de eso.', 'I never tire of that.', 'Je ne m\'en lasse jamais.']], 'h_b1'),
          o(['Cuéntame cómo empezó la taberna.', 'Tell me how the tavern started.', 'Raconte-moi comment la taverne a commencé.'], 'pregunta', [['Siéntate bien, que va para largo.', 'Get comfortable, it\'s a long one.', 'Installe-toi, c\'est long.']], 'h_a1'),
        ],
      },
    },
  },

  // ============================================================ EKKO
  ekko: {
    entry: o(['Ekko, ¿charlamos sin mirar el reloj?', 'Ekko, shall we chat without watching the clock?', 'Ekko, on discute sans regarder l\'heure ?'], 'broma', null, 'h_raiz'),
    nodes: {
      h_raiz: {
        say: [['(Se ríe, tocándose el aparato de la muñeca.) ¿Sin mirar el reloj? Eso es difícil para mí. Pero vale, me apunto.', '(Laughs, tapping the device on his wrist.) Without watching the clock? That\'s hard for me. But fine, I\'m in.', '(Il rit en tapotant l\'appareil à son poignet.) Sans regarder l\'heure ? C\'est dur pour moi. Mais d\'accord, je suis partant.']],
        again: [['¡Eh! Pensaba que te habías perdido en las Galerías. ¿Seguimos?', 'Hey! Thought you\'d got lost in the Lanes. Shall we go on?', 'Hé ! Je pensais que tu t\'étais perdu{g:|e|·e} dans les Ruelles. On continue ?'],
          ['(Se deja caer de la rama del árbol.) Llegas justo. Iba a pintar, pero hablar contigo es mejor.', '(Drops down from a branch of the tree.) Perfect timing. I was going to paint, but talking with you is better.', '(Il se laisse tomber d\'une branche de l\'arbre.) Pile à l\'heure. J\'allais peindre, mais parler avec toi, c\'est mieux.']],
        opts: [
          o(['Háblame de tus murales.', 'Tell me about your murals.', 'Parle-moi de tes fresques.'], 'amable', null, 'h_a1'),
          o(['¿Cómo aprendiste a construir cosas?', 'How did you learn to build things?', 'Comment as-tu appris à construire des choses ?'], 'pregunta', null, 'h_b1'),
          o(['¿Qué te gustaría para Zaun?', 'What would you want for Zaun?', 'Que voudrais-tu pour Zaun ?'], 'serio', null, 'h_c1'),
        ],
      },
      h_a1: {
        say: [['Pinto lo que la gente no quiere olvidar. Y lo que quiere que pase. Las paredes de Zaun son nuestros periódicos.', 'I paint what people don\'t want to forget. And what they want to happen. Zaun\'s walls are our newspapers.', 'Je peins ce que les gens ne veulent pas oublier. Et ce qu\'ils veulent voir arriver. Les murs de Zaun sont nos journaux.']],
        again: [['He pintado uno nuevo desde que viniste. Tiene más colores que el anterior. Progreso.', 'I\'ve painted a new one since you came. More colours than the last. Progress.', 'J\'en ai peint une nouvelle depuis ta visite. Plus de couleurs que la précédente. Le progrès.']],
        opts: [
          o(['¿Cuál es tu favorito?', 'Which is your favourite?', 'Laquelle est ta préférée ?'], 'pregunta', [['Uno en las Galerías: un niño con alas de chatarra. La gente le deja flores debajo. No sé por qué. Me gusta no saberlo.', 'One in the Lanes: a kid with scrap-metal wings. People leave flowers under it. I don\'t know why. I like not knowing.', 'Une dans les Ruelles : un gamin avec des ailes de ferraille. Les gens laissent des fleurs dessous. Je ne sais pas pourquoi. J\'aime ne pas savoir.']], 'h_a2'),
          o(['Píntame en uno.', 'Paint me in one.', 'Peins-moi sur une fresque.'], 'coqueto', [['¿Tú? Necesitaría mucho color. (Te guiña un ojo.) Vale, te apunto en la lista.', 'You? I\'d need a lot of colour. (Winks.) Fine, you\'re on the list.', 'Toi ? Il me faudrait beaucoup de couleurs. (Il te fait un clin d\'œil.) D\'accord, je te mets sur la liste.']], 'h_a2', { aff: 1 }),
          o(['¿No te pillan los ejecutores?', 'Don\'t the enforcers catch you?', 'Les exécuteurs ne t\'attrapent pas ?'], 'broma', [['¿Pillarme? (Da una voltereta.) Para pillarme tienen que verme primero.', 'Catch me? (Does a flip.) To catch me they\'d have to see me first.', 'M\'attraper ? (Il fait un salto.) Pour m\'attraper, il faudrait d\'abord qu\'ils me voient.']], 'h_a2', { aff: 1 }),
        ],
      },
      h_a2: {
        say: [['Los críos de las Luciérnagas pintan conmigo. Algunos no saben leer, pero saben dibujar lo que sienten mejor que cualquier poeta de arriba.', 'The Firelight kids paint with me. Some can\'t read, but they can draw what they feel better than any poet up top.', 'Les gamins des Lucioles peignent avec moi. Certains ne savent pas lire, mais ils dessinent ce qu\'ils ressentent mieux que n\'importe quel poète d\'en haut.']],
        opts: [
          o(['Les estás dando algo muy grande.', 'You\'re giving them something huge.', 'Tu leur donnes quelque chose d\'énorme.'], 'amable', [['Les doy pintura. Lo grande lo ponen ellos.', 'I give them paint. They bring the huge part.', 'Je leur donne de la peinture. L\'énorme, c\'est eux qui l\'apportent.']], 'h_a3', { aff: 1 }),
          o(['¿Y si les enseñamos a leer también?', 'What if we teach them to read too?', 'Et si on leur apprenait à lire aussi ?'], 'serio', [['¿Lo harías? (Se le iluminan los ojos.) Hay una caja de libros viejos en el árbol. Nadie sabe usarlos bien.', 'Would you? (His eyes light up.) There\'s a box of old books in the tree. Nobody knows how to use them properly.', 'Tu le ferais ? (Ses yeux s\'illuminent.) Il y a une caisse de vieux livres dans l\'arbre. Personne ne sait bien s\'en servir.']], 'h_a3', { aff: 2, rep: { zaun: 1 } }),
          o(['Seguro que pintan monstruos.', 'I bet they paint monsters.', 'Je parie qu\'ils peignent des monstres.'], 'broma', [['Muchos. Y a mí con la cabeza enorme. Al parecer, es mi rasgo principal.', 'Lots. And me with a huge head. Apparently that\'s my main feature.', 'Plein. Et moi avec une tête énorme. Apparemment, c\'est mon trait principal.']], 'h_a3'),
        ],
      },
      h_a3: {
        say: [['A veces pienso que el arte es lo único que no nos pueden quitar. Te quitan el aire, el agua, la luz… pero lo pintado, pintado está.', 'Sometimes I think art is the only thing they can\'t take from us. They take the air, the water, the light… but what\'s painted stays painted.', 'Parfois je pense que l\'art est la seule chose qu\'on ne peut pas nous prendre. On nous prend l\'air, l\'eau, la lumière… mais ce qui est peint reste peint.']],
        opts: [
          o(['¿Cómo aprendiste a construir todo esto?', 'How did you learn to build all this?', 'Comment as-tu appris à construire tout ça ?'], 'pregunta', [['Ah, esa es una historia con mucha chatarra.', 'Ah, that\'s a story with a lot of scrap.', 'Ah, c\'est une histoire avec beaucoup de ferraille.']], 'h_b1'),
          o(['¿Y qué pintarías para el futuro de Zaun?', 'And what would you paint for Zaun\'s future?', 'Et que peindrais-tu pour l\'avenir de Zaun ?'], 'serio', [['El futuro… buena pregunta.', 'The future… good question.', 'L\'avenir… bonne question.']], 'h_c1'),
          o(['Vuelve a empezar, que me encanta oírte.', 'Start over, I love hearing you.', 'Recommence, j\'adore t\'écouter.'], 'amable', [['(Se rasca la nuca, cortado.) Vale, vale.', '(Scratches the back of his neck, embarrassed.) Okay, okay.', '(Il se gratte la nuque, gêné.) D\'accord, d\'accord.']], 'h_raiz', { aff: 1 }),
        ],
      },
      h_b1: {
        say: [['Benzo. Tenía una tienda llena de trastos y me dejaba desmontarlo todo si luego lo montaba mejor. Esa fue mi escuela.', 'Benzo. He had a shop full of junk and let me take everything apart if I put it back together better. That was my school.', 'Benzo. Il avait une boutique pleine de bric-à-brac et me laissait tout démonter si je remontais mieux. C\'était mon école.']],
        again: [['Sigo oyendo a Benzo cuando suelto un tornillo: «Más despacio, chaval».', 'I still hear Benzo when I loosen a screw: "Slower, kid."', 'J\'entends encore Benzo quand je desserre une vis : « Plus doucement, gamin. »']],
        opts: [
          o(['¿Qué fue lo primero que hiciste?', 'What was the first thing you made?', 'Quelle a été ta première création ?'], 'pregunta', [['Un pájaro mecánico que sólo volaba hacia atrás. Benzo dijo que era «original». Era su forma de decir «desastre».', 'A mechanical bird that only flew backwards. Benzo said it was "original". His way of saying "disaster".', 'Un oiseau mécanique qui ne volait qu\'en arrière. Benzo a dit que c\'était « original ». Sa façon de dire « catastrophe ».']], 'h_b2', { aff: 1 }),
          o(['Benzo parece un gran maestro.', 'Benzo sounds like a great teacher.', 'Benzo a l\'air d\'un grand maître.'], 'amable', [['El mejor. Me enseñó que la chatarra puede volar. Y la gente también.', 'The best. He taught me scrap can fly. And people too.', 'Le meilleur. Il m\'a appris que la ferraille peut voler. Et les gens aussi.']], 'h_b2', { aff: 1 }),
          o(['Así que eres un ladrón de piezas.', 'So you\'re a parts thief.', 'Donc tu es un voleur de pièces.'], 'broma', [['¡Reciclador! Hay una diferencia. Pequeña. Pero la hay.', 'Recycler! There\'s a difference. Small. But there is one.', 'Recycleur ! Il y a une différence. Petite. Mais il y en a une.']], 'h_b2'),
        ],
      },
      h_b2: {
        say: [['Ahora construyo para las Luciérnagas: filtros, poleas, la aerotabla… Si algo vuela, salta o limpia el aire, probablemente lo he hecho yo. O roto yo.', 'Now I build for the Firelights: filters, pulleys, the hoverboard… If something flies, jumps or cleans the air, I probably made it. Or broke it.', 'Maintenant je construis pour les Lucioles : filtres, poulies, l\'aéroplanche… Si quelque chose vole, saute ou purifie l\'air, je l\'ai sûrement fabriqué. Ou cassé.']],
        opts: [
          o(['¿Me enseñas a hacer un filtro?', 'Will you teach me to make a filter?', 'Tu m\'apprends à faire un filtre ?'], 'serio', [['¡Claro! Carbón, malla fina y paciencia. Lo difícil es la paciencia.', 'Sure! Charcoal, fine mesh and patience. The hard part is the patience.', 'Bien sûr ! Du charbon, un maillage fin et de la patience. Le plus dur, c\'est la patience.']], 'h_b3', { stats: { ingenio: 1 } }),
          o(['¿Y qué es eso de tu muñeca?', 'And what\'s that on your wrist?', 'Et c\'est quoi, ce truc à ton poignet ?'], 'pregunta', [['(Lo tapa con la manga, sonriendo.) Un proyecto. Te lo enseñaré cuando funcione. O cuando no explote.', '(Covers it with his sleeve, grinning.) A project. I\'ll show you when it works. Or when it doesn\'t explode.', '(Il le couvre de sa manche en souriant.) Un projet. Je te le montrerai quand il marchera. Ou quand il n\'explosera pas.']], 'h_b3'),
          o(['Eres un genio, Ekko.', 'You\'re a genius, Ekko.', 'Tu es un génie, Ekko.'], 'amable', [['Soy un chaval con herramientas y demasiadas ganas. Pero gracias.', 'I\'m a kid with tools and too much drive. But thanks.', 'Je suis un gamin avec des outils et trop d\'envie. Mais merci.']], 'h_b3', { aff: 1 }),
        ],
      },
      h_b3: {
        say: [['Bueno, ¿y tú qué sabes hacer? Aquí todo el mundo aporta algo, aunque sea hacer reír.', 'So what can you do? Everyone here brings something, even if it\'s just making people laugh.', 'Bon, et toi, tu sais faire quoi ? Ici, tout le monde apporte quelque chose, même si c\'est juste faire rire.']],
        opts: [
          o(['Hacer reír, claramente.', 'Making people laugh, clearly.', 'Faire rire, clairement.'], 'broma', [['Contratad{g:o|a|e}. Empiezas mañana. Ahora, pregúntame algo serio para equilibrar.', 'Hired. You start tomorrow. Now ask me something serious to balance it out.', 'Embauché{g:|e|·e}. Tu commences demain. Maintenant, pose-moi une question sérieuse pour équilibrer.']], 'h_c1', { aff: 1 }),
          o(['Puedo pintar contigo.', 'I can paint with you.', 'Je peux peindre avec toi.'], 'amable', [['¡Eso! Vamos a los murales.', 'Yes! Let\'s go to the murals.', 'Ça ! Allons aux fresques.']], 'h_a1'),
          o(['Todavía lo estoy descubriendo.', 'I\'m still figuring it out.', 'Je suis encore en train de le découvrir.'], 'serio', [['Como todos. Empecemos por ahí.', 'Like everyone. Let\'s start there.', 'Comme tout le monde. Commençons par là.']], 'h_raiz'),
        ],
      },
      h_c1: {
        say: [['Que los críos crezcan sin toser. Que nadie tenga que elegir entre el Brillo y el hambre. Que el árbol sea una plaza, no un escondite.', 'That kids grow up without coughing. That nobody has to choose between Shimmer and hunger. That the tree is a plaza, not a hideout.', 'Que les gamins grandissent sans tousser. Que personne n\'ait à choisir entre le Shimmer et la faim. Que l\'arbre soit une place, pas une cachette.']],
        again: [['El sueño sigue igual. Lo que cambia es cuánta gente lo sueña conmigo.', 'The dream\'s the same. What changes is how many people dream it with me.', 'Le rêve est le même. Ce qui change, c\'est combien de gens le rêvent avec moi.']],
        opts: [
          o(['¿Y cómo se consigue eso?', 'And how do you get there?', 'Et comment on y arrive ?'], 'pregunta', [['Poco a poco. Un filtro. Un crío que aprende un oficio. Una familia que no se va. No hay atajos.', 'Little by little. One filter. One kid who learns a trade. One family that doesn\'t leave. No shortcuts.', 'Petit à petit. Un filtre. Un gamin qui apprend un métier. Une famille qui ne part pas. Pas de raccourcis.']], 'h_c2'),
          o(['Cuenta conmigo para eso.', 'Count me in for that.', 'Compte sur moi pour ça.'], 'amable', [['(Te choca el puño.) Hecho. Las Luciérnagas tienen una más.', '(Bumps your fist.) Done. The Firelights have one more.', '(Il te check du poing.) C\'est fait. Les Lucioles ont un membre de plus.']], 'h_c2', { aff: 2, rep: { zaun: 1 } }),
          o(['Suena a utopía.', 'Sounds like a utopia.', 'Ça ressemble à une utopie.'], 'duro', [['Todo suena a utopía hasta que alguien lo hace. El árbol también lo parecía.', 'Everything sounds like a utopia until someone does it. The tree seemed like one too.', 'Tout ressemble à une utopie jusqu\'à ce que quelqu\'un le fasse. L\'arbre aussi en avait l\'air.']], 'h_c2'),
        ],
      },
      h_c2: {
        say: [['A veces pienso en lo que pasaría si pudiera volver atrás. Cambiar un solo momento. ¿Tú no?', 'Sometimes I think about what would happen if I could go back. Change a single moment. Don\'t you?', 'Parfois je pense à ce qui se passerait si je pouvais revenir en arrière. Changer un seul moment. Pas toi ?']],
        opts: [
          o(['Todos tenemos un momento así.', 'We all have a moment like that.', 'On a tous un moment comme ça.'], 'amable', [['Sí. Pero si lo cambiara, ¿seguiría siendo yo? Esa pregunta no me deja dormir.', 'Yeah. But if I changed it, would I still be me? That question keeps me up.', 'Oui. Mais si je le changeais, est-ce que je serais encore moi ? Cette question m\'empêche de dormir.']], 'h_c3', { aff: 1 }),
          o(['No. Lo pasado nos hace quienes somos.', 'No. The past makes us who we are.', 'Non. Le passé fait de nous ce que nous sommes.'], 'serio', [['(Asiente despacio.) Benzo decía algo así. Supongo que tenía razón. Como siempre.', '(Nods slowly.) Benzo used to say something like that. I guess he was right. As always.', '(Il hoche la tête lentement.) Benzo disait un truc comme ça. Je suppose qu\'il avait raison. Comme toujours.']], 'h_c3'),
          o(['¿Tu aparato de la muñeca hace eso?', 'Does your wrist gadget do that?', 'Ton gadget au poignet fait ça ?'], 'astuto', [['(Se ríe, nervioso.) ¿Qué? No. Qué va. Es un reloj. Muy… preciso. Cambiemos de tema.', '(Laughs nervously.) What? No. No way. It\'s a watch. Very… precise. Let\'s change the subject.', '(Il rit nerveusement.) Quoi ? Non. Pas du tout. C\'est une montre. Très… précise. Changeons de sujet.']], 'h_c3'),
        ],
      },
      h_c3: {
        say: [['Me estás haciendo hablar más que en una reunión de las Luciérnagas. Y eso que allí no callo.', 'You\'re getting me to talk more than at a Firelights meeting. And I never shut up there.', 'Tu me fais plus parler qu\'à une réunion des Lucioles. Et pourtant, là-bas, je ne me tais jamais.']],
        opts: [
          o(['Enséñame tus murales nuevos.', 'Show me your new murals.', 'Montre-moi tes nouvelles fresques.'], 'amable', [['¡Vamos! Ten cuidado con la pintura fresca.', 'Let\'s go! Watch out for wet paint.', 'Allons-y ! Attention à la peinture fraîche.']], 'h_a1'),
          o(['Cuéntame más de Benzo.', 'Tell me more about Benzo.', 'Parle-moi encore de Benzo.'], 'pregunta', [['Siempre hay más de Benzo.', 'There\'s always more Benzo.', 'Il y a toujours plus à dire sur Benzo.']], 'h_b1'),
          o(['¿Una carrera en aerotabla y seguimos?', 'A hoverboard race and then we continue?', 'Une course en aéroplanche et on continue ?'], 'broma', [['¡Perderás! Pero vale. Y luego seguimos hablando.', 'You\'ll lose! But fine. And then we keep talking.', 'Tu vas perdre ! Mais d\'accord. Et après, on continue de parler.']], 'h_raiz', { aff: 1 }),
        ],
      },
    },
  },
};
