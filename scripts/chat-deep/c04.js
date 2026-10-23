// Sevika, Ambessa y Cassandra. Cada texto: [español, inglés, francés].
const o = (t, tone, say, go, fx) => ({ t, tone, say, go, ...(fx ? { fx } : {}) });
module.exports = {
  // ============================================================ SEVIKA
  sevika: {
    entry: o(['Sevika. Tú y yo. Una charla larga.', 'Sevika. You and me. A long talk.', 'Sevika. Toi et moi. Une longue discussion.'], 'duro', null, 'h_raiz'),
    nodes: {
      h_raiz: {
        say: [['(Expulsa el humo despacio.) ¿Larga? Las charlas largas acaban en pelea o en trato. A ver cuál es la tuya.', '(Blows out smoke slowly.) Long? Long talks end in a fight or a deal. Let\'s see which yours is.', '(Elle souffle la fumée lentement.) Longue ? Les longues discussions finissent en bagarre ou en accord. Voyons laquelle est la tienne.']],
        again: [['Tú otra vez. Empiezas a ser parte del mobiliario.', 'You again. You\'re becoming part of the furniture.', 'Encore toi. Tu commences à faire partie du mobilier.'],
          ['(Empuja una silla con la bota.) Siéntate. No muerdo. Hoy.', '(Pushes a chair out with her boot.) Sit. I don\'t bite. Today.', '(Elle pousse une chaise du bout de sa botte.) Assieds-toi. Je ne mords pas. Aujourd\'hui.']],
        opts: [
          o(['¿Cómo te hiciste tan dura?', 'How did you get so tough?', 'Comment es-tu devenue si dure ?'], 'pregunta', null, 'h_a1'),
          o(['¿Qué haces para divertirte?', 'What do you do for fun?', 'Que fais-tu pour t\'amuser ?'], 'broma', null, 'h_b1'),
          o(['¿En quién confías de verdad?', 'Who do you really trust?', 'En qui as-tu vraiment confiance ?'], 'serio', null, 'h_c1'),
        ],
      },
      h_a1: {
        say: [['A los doce años ya cargaba cajas en los muelles. A los quince peleaba en los fosos por comida. No hubo un momento: hubo mil.', 'At twelve I was hauling crates on the docks. At fifteen I was fighting in the pits for food. There wasn\'t one moment: there were a thousand.', 'À douze ans, je portais des caisses sur les quais. À quinze, je me battais dans les fosses pour manger. Il n\'y a pas eu un moment : il y en a eu mille.']],
        again: [['Mi historia no ha mejorado desde la última vez. Sigue sin final feliz.', 'My story hasn\'t improved since last time. Still no happy ending.', 'Mon histoire ne s\'est pas améliorée depuis la dernière fois. Toujours pas de fin heureuse.']],
        opts: [
          o(['¿Ganabas?', 'Did you win?', 'Tu gagnais ?'], 'pregunta', [['Comía, así que sí. Los que perdían no volvían a la semana siguiente.', 'I ate, so yes. The ones who lost didn\'t come back the next week.', 'Je mangeais, donc oui. Ceux qui perdaient ne revenaient pas la semaine suivante.']], 'h_a2'),
          o(['Nadie debería pasar por eso.', 'No one should go through that.', 'Personne ne devrait vivre ça.'], 'amable', [['(Te mira con algo parecido a la sorpresa.) No. Pero pasa. Cada día, ahí abajo.', '(Looks at you with something like surprise.) No. But it happens. Every day, down there.', '(Elle te regarde avec quelque chose comme de la surprise.) Non. Mais ça arrive. Chaque jour, là-dessous.']], 'h_a2', { aff: 1 }),
          o(['Yo te habría ganado.', 'I\'d have beaten you.', 'Je t\'aurais battue.'], 'broma', [['(Se ríe de verdad.) Te habría doblado como una servilleta. Me gusta tu descaro.', '(Actually laughs.) I\'d have folded you like a napkin. I like your nerve.', '(Elle rit vraiment.) Je t\'aurais plié{g:|e|·e} comme une serviette. J\'aime ton culot.']], 'h_a2', { aff: 1 }),
        ],
      },
      h_a2: {
        say: [['En la revuelta del puente estaba en primera fila. Ahí aprendí que los que dan los discursos no suelen ser los que sangran.', 'At the bridge uprising I was in the front line. That\'s where I learned that the ones giving speeches usually aren\'t the ones bleeding.', 'Lors de la révolte du pont, j\'étais en première ligne. C\'est là que j\'ai appris que ceux qui font les discours ne sont pas ceux qui saignent.']],
        opts: [
          o(['¿Te arrepientes?', 'Do you regret it?', 'Tu le regrettes ?'], 'serio', [['Me arrepiento de haber perdido. Lo demás lo volvería a hacer.', 'I regret losing. The rest I\'d do again.', 'Je regrette d\'avoir perdu. Le reste, je le referais.']], 'h_a3'),
          o(['Por eso eres leal a quien se mancha.', 'That\'s why you\'re loyal to whoever gets their hands dirty.', 'C\'est pour ça que tu es loyale envers ceux qui se salissent les mains.'], 'astuto', [['(Asiente despacio.) Lees bien a la gente. Eso es peligroso. Para ti y para los demás.', '(Nods slowly.) You read people well. That\'s dangerous. For you and for others.', '(Elle hoche lentement la tête.) Tu lis bien les gens. C\'est dangereux. Pour toi et pour les autres.']], 'h_a3', { stats: { ingenio: 1 } }),
          o(['Gracias por luchar por Zaun.', 'Thank you for fighting for Zaun.', 'Merci de t\'être battue pour Zaun.'], 'amable', [['(Se encoge de hombros, incómoda.) Nadie me ha dado las gracias nunca. No sé qué se responde.', '(Shrugs, uncomfortable.) No one\'s ever thanked me. I don\'t know what you say back.', '(Elle hausse les épaules, mal à l\'aise.) Personne ne m\'a jamais remerciée. Je ne sais pas quoi répondre.']], 'h_a3', { aff: 2, rep: { zaun: 1 } }),
        ],
      },
      h_a3: {
        say: [['Basta de mí. No me gusta hablar del pasado. Huele a sangre vieja.', 'Enough about me. I don\'t like talking about the past. It smells of old blood.', 'Assez parlé de moi. Je n\'aime pas parler du passé. Ça sent le vieux sang.']],
        opts: [
          o(['¿Y qué haces cuando no peleas?', 'And what do you do when you\'re not fighting?', 'Et que fais-tu quand tu ne te bats pas ?'], 'pregunta', [['Ah. Eso sí lo cuento.', 'Ah. That I\'ll tell.', 'Ah. Ça, je veux bien le raconter.']], 'h_b1'),
          o(['¿En quién te apoyas tú?', 'Who do you lean on?', 'Sur qui tu t\'appuies, toi ?'], 'serio', [['Pregunta difícil. Te la contesto, pero no te acostumbres.', 'Hard question. I\'ll answer it, but don\'t get used to it.', 'Question difficile. J\'y réponds, mais ne t\'y habitue pas.']], 'h_c1'),
          o(['Volvamos a empezar.', 'Let\'s start again.', 'Recommençons.'], 'broma', [['Como en el foso: ronda nueva.', 'Like in the pit: new round.', 'Comme dans la fosse : nouveau round.']], 'h_raiz'),
        ],
      },
      h_b1: {
        say: [['Cartas. Y hacer trampa en las cartas. Y ver la cara del que me pilla haciendo trampa y no se atreve a decírmelo.', 'Cards. And cheating at cards. And watching the face of whoever catches me cheating and doesn\'t dare say so.', 'Les cartes. Et tricher aux cartes. Et regarder la tête de celui qui me surprend à tricher et n\'ose pas le dire.']],
        again: [['Sigo jugando. Sigo haciendo trampa. Sigue sin decírmelo nadie.', 'Still playing. Still cheating. Still nobody tells me.', 'Je joue toujours. Je triche toujours. Toujours personne ne me le dit.']],
        opts: [
          o(['Yo te lo diría a la cara.', 'I\'d say it to your face.', 'Moi, je te le dirais en face.'], 'duro', [['(Sonríe de lado.) Por eso sigues de una pieza. La gente valiente me cae bien. La estúpida, no. Aún no sé cuál eres.', '(A crooked smile.) That\'s why you\'re still in one piece. I like brave people. Stupid ones, not so much. Haven\'t worked out which you are.', '(Sourire en coin.) C\'est pour ça que tu es encore en un seul morceau. J\'aime les gens courageux. Les idiots, moins. Je ne sais pas encore lequel tu es.']], 'h_b2', { aff: 1 }),
          o(['¿Me enseñas a hacer trampa?', 'Will you teach me to cheat?', 'Tu m\'apprends à tricher ?'], 'astuto', [['La primera regla: nunca mires tus cartas cuando mientes. Mira las del otro.', 'First rule: never look at your own cards when you lie. Look at theirs.', 'Première règle : ne regarde jamais tes cartes quand tu mens. Regarde celles de l\'autre.']], 'h_b2', { stats: { ingenio: 1 } }),
          o(['Eso es muy mezquino.', 'That\'s very petty.', 'C\'est très mesquin.'], 'broma', [['Mezquino es cobrar por el aire. Yo solo me divierto.', 'Petty is charging for air. I\'m just having fun.', 'Mesquin, c\'est faire payer l\'air. Moi, je m\'amuse.']], 'h_b2'),
        ],
      },
      h_b2: {
        say: [['También bebo. Pero eso no es divertirse, eso es mantenimiento. (Golpea el brazo mecánico.) Esta cosa necesita aceite y yo, whisky.', 'I also drink. But that\'s not fun, that\'s maintenance. (Taps her mechanical arm.) This thing needs oil and I need whisky.', 'Je bois aussi. Mais ce n\'est pas du plaisir, c\'est de l\'entretien. (Elle tape sur son bras mécanique.) Ce truc a besoin d\'huile, et moi de whisky.']],
        opts: [
          o(['¿Te duele el brazo?', 'Does the arm hurt?', 'Ton bras te fait mal ?'], 'amable', [['Cuando llueve. Cuando hace frío. Cuando me acuerdo de cómo lo perdí. O sea, casi siempre.', 'When it rains. When it\'s cold. When I remember how I lost it. So, nearly always.', 'Quand il pleut. Quand il fait froid. Quand je me souviens comment je l\'ai perdu. Donc, presque toujours.']], 'h_b3', { aff: 1 }),
          o(['Brindo por el mantenimiento.', 'I\'ll drink to maintenance.', 'Je bois à l\'entretien.'], 'broma', [['(Choca su vaso con el tuyo.) Por el mantenimiento. Y por no oxidarse.', '(Clinks her glass against yours.) To maintenance. And to not rusting.', '(Elle trinque avec toi.) À l\'entretien. Et à ne pas rouiller.']], 'h_b3', { aff: 1 }),
          o(['¿Cómo lo perdiste?', 'How did you lose it?', 'Comment l\'as-tu perdu ?'], 'pregunta', [['(Te mira, seria.) Esa historia se gana, no se pregunta. Quizá otro día.', '(Looks at you, serious.) That story\'s earned, not asked for. Maybe another day.', '(Elle te regarde, sérieuse.) Cette histoire se mérite, elle ne se demande pas. Un autre jour, peut-être.']], 'h_b3'),
        ],
      },
      h_b3: {
        say: [['Me estás haciendo hablar mucho. ¿Trabajas para alguien? (Te observa.) Es broma. Casi.', 'You\'re making me talk a lot. You working for someone? (Studies you.) Joking. Almost.', 'Tu me fais beaucoup parler. Tu travailles pour quelqu\'un ? (Elle t\'observe.) Je plaisante. Presque.']],
        opts: [
          o(['Solo para mí.', 'Only for myself.', 'Seulement pour moi.'], 'astuto', [['La mejor respuesta en Zaun. Sigamos, pues. Pregúntame algo que no le cuente a nadie.', 'Best answer in Zaun. Let\'s go on, then. Ask me something I don\'t tell anyone.', 'La meilleure réponse à Zaun. Continuons, alors. Pose-moi une question à laquelle je ne réponds à personne.']], 'h_c1', { aff: 1 }),
          o(['Cuéntame más de tus tiempos en el foso.', 'Tell me more about your days in the pit.', 'Raconte-moi encore ton époque dans la fosse.'], 'pregunta', [['Te gustan las historias feas. Vale.', 'You like ugly stories. Fine.', 'Tu aimes les histoires moches. D\'accord.']], 'h_a1'),
          o(['Para la Liga de los Curiosos.', 'For the League of the Curious.', 'Pour la Ligue des Curieux.'], 'broma', [['(Resopla.) Diles que su cuota ha subido. Siguiente pregunta.', '(Snorts.) Tell them their fees just went up. Next question.', '(Elle souffle.) Dis-leur que leur cotisation vient d\'augmenter. Question suivante.']], 'h_raiz'),
        ],
      },
      h_c1: {
        say: [['(Apaga el puro.) En nadie del todo. En algunos a medias. Confiar del todo es lo que hacen los que acaban en el río.', '(Puts out her cigar.) Nobody completely. Some halfway. Trusting completely is what people who end up in the river do.', '(Elle écrase son cigare.) En personne complètement. En certains à moitié. Faire entièrement confiance, c\'est ce que font ceux qui finissent dans la rivière.']],
        again: [['La respuesta sigue siendo la misma: a medias. Aunque tú estás algo más arriba en la lista.', 'The answer\'s still the same: halfway. Though you\'re a bit higher on the list.', 'La réponse est toujours la même : à moitié. Même si tu es un peu plus haut sur la liste.']],
        opts: [
          o(['¿Y en mí? ¿A medias?', 'And me? Halfway?', 'Et moi ? À moitié ?'], 'coqueto', [['A un cuarto. No te emociones. Es más que la mayoría.', 'A quarter. Don\'t get excited. That\'s more than most.', 'Au quart. Ne t\'emballe pas. C\'est plus que la plupart.']], 'h_c2', { aff: 1 }),
          o(['Debe de ser una vida muy sola.', 'That must be a very lonely life.', 'Ça doit être une vie bien solitaire.'], 'amable', [['(Silencio.) Sola es mejor que traicionada. Al menos eso me decía al principio.', '(Silence.) Lonely beats betrayed. At least that\'s what I told myself at first.', '(Silence.) Seule, c\'est mieux que trahie. C\'est du moins ce que je me disais au début.']], 'h_c2', { aff: 1 }),
          o(['Yo tampoco confío en nadie.', 'I don\'t trust anyone either.', 'Moi non plus, je ne fais confiance à personne.'], 'duro', [['Bien. Entonces nos entendemos. Dos desconfiados en la misma mesa.', 'Good. Then we understand each other. Two cynics at one table.', 'Bien. Alors on se comprend. Deux méfiants à la même table.']], 'h_c2'),
        ],
      },
      h_c2: {
        say: [['Hay una persona. No te voy a decir quién. Me salvó en el puente y nunca me pidió nada a cambio. Eso en Zaun es más raro que el aire limpio.', 'There\'s one person. I won\'t tell you who. Saved me on the bridge and never asked for anything in return. In Zaun that\'s rarer than clean air.', 'Il y a une personne. Je ne te dirai pas qui. Elle m\'a sauvée sur le pont et ne m\'a jamais rien demandé en échange. À Zaun, c\'est plus rare que l\'air pur.']],
        opts: [
          o(['Me alegra que la tengas.', 'I\'m glad you have them.', 'Je suis content{g:|e|·e} que tu l\'aies.'], 'amable', [['(Casi sonríe.) Ya. Yo también. No se lo cuentes a nadie o te arranco la lengua.', '(Almost smiles.) Yeah. Me too. Tell anyone and I rip your tongue out.', '(Elle sourit presque.) Ouais. Moi aussi. Dis-le à quelqu\'un et je t\'arrache la langue.']], 'h_c3', { aff: 1 }),
          o(['¿Vive todavía?', 'Are they still alive?', 'Cette personne est encore en vie ?'], 'pregunta', [['Siguiente pregunta.', 'Next question.', 'Question suivante.']], 'h_c3'),
          o(['Te estás ablandando, Sevika.', 'You\'re going soft, Sevika.', 'Tu te ramollis, Sevika.'], 'broma', [['Repite eso y te enseño lo blando que está mi puño.', 'Say that again and I\'ll show you how soft my fist is.', 'Répète ça et je te montre à quel point mon poing est mou.']], 'h_c3'),
        ],
      },
      h_c3: {
        say: [['Vale. Has sacado más de mí que tres interrogatorios de ejecutores. Algo tendrás.', 'Fine. You\'ve got more out of me than three enforcer interrogations. You must have something.', 'D\'accord. Tu m\'as tiré plus que trois interrogatoires d\'exécuteurs. Tu dois avoir un truc.']],
        opts: [
          o(['Paciencia. Y buena compañía.', 'Patience. And good company.', 'De la patience. Et de la bonne compagnie.'], 'amable', [['Lo de la compañía es discutible. Lo de la paciencia, no. Venga, otra ronda.', 'The company\'s debatable. The patience isn\'t. Come on, another round.', 'La compagnie, ça se discute. La patience, non. Allez, une autre tournée.']], 'h_raiz', { aff: 1 }),
          o(['Juguemos a las cartas mientras.', 'Let\'s play cards meanwhile.', 'Jouons aux cartes en attendant.'], 'broma', [['Reparte. Y no mires mis cartas.', 'Deal. And don\'t look at my cards.', 'Distribue. Et ne regarde pas mes cartes.']], 'h_b1'),
          o(['Háblame más de tus comienzos.', 'Tell me more about how you started.', 'Parle-moi encore de tes débuts.'], 'pregunta', [['Insistente. Bueno.', 'Persistent. All right.', 'Insistant{g:|e|·e}. Bon.']], 'h_a1'),
        ],
      },
    },
  },

  // ============================================================ AMBESSA
  ambessa: {
    entry: o(['General, ¿me concede una conversación larga?', 'General, will you grant me a long conversation?', 'Générale, vous m\'accordez une longue conversation ?'], 'serio', null, 'h_raiz'),
    nodes: {
      h_raiz: {
        say: [['(Te mide con la mirada, como a un rival en el campo.) Una conversación larga es una batalla lenta. Acepto. Elige el terreno.', '(Sizes you up like a rival on the field.) A long conversation is a slow battle. I accept. Choose the ground.', '(Elle te jauge comme un adversaire sur le champ de bataille.) Une longue conversation est une bataille lente. J\'accepte. Choisis le terrain.']],
        again: [['Vuelves al campo. Eso dice mucho de ti. Bueno o malo, aún no lo sé.', 'You return to the field. That says a lot about you. Good or bad, I don\'t yet know.', 'Tu reviens sur le terrain. Ça en dit long sur toi. En bien ou en mal, je ne sais pas encore.'],
          ['(Afila un cuchillo sin mirarlo.) Habla. Te escucho mejor con las manos ocupadas.', '(Sharpens a knife without looking at it.) Speak. I listen better with busy hands.', '(Elle aiguise un couteau sans le regarder.) Parle. J\'écoute mieux les mains occupées.']],
        opts: [
          o(['¿Qué es para usted la fuerza?', 'What is strength to you?', 'Qu\'est-ce que la force pour vous ?'], 'pregunta', null, 'h_a1'),
          o(['¿Cómo fue su primera batalla?', 'What was your first battle like?', 'Comment s\'est passée votre première bataille ?'], 'serio', null, 'h_b1'),
          o(['¿Qué echa de menos de casa?', 'What do you miss about home?', 'Qu\'est-ce qui vous manque de chez vous ?'], 'amable', null, 'h_c1'),
        ],
      },
      h_a1: {
        say: [['La fuerza no es golpear. Es decidir cuándo golpear y aguantar el tiempo que haga falta hasta ese momento.', 'Strength isn\'t striking. It\'s deciding when to strike, and enduring as long as it takes until then.', 'La force, ce n\'est pas frapper. C\'est décider quand frapper, et tenir aussi longtemps qu\'il faut jusque-là.']],
        again: [['La lección de la fuerza no cambia. Lo que cambia es quién está preparado para oírla.', 'The lesson of strength doesn\'t change. What changes is who\'s ready to hear it.', 'La leçon de la force ne change pas. Ce qui change, c\'est qui est prêt à l\'entendre.']],
        opts: [
          o(['¿Y la compasión?', 'And compassion?', 'Et la compassion ?'], 'serio', [['La compasión es un lujo de los vencedores. Primero se gana; luego se perdona.', 'Compassion is the luxury of the victors. First you win; then you forgive.', 'La compassion est un luxe de vainqueurs. D\'abord on gagne ; ensuite on pardonne.']], 'h_a2'),
          o(['Suena a paciencia, no a fuerza.', 'That sounds like patience, not strength.', 'Ça ressemble à de la patience, pas à de la force.'], 'astuto', [['(Sonríe, enseñando los dientes.) Muy bien. Son la misma cosa vista desde lados distintos de la espada.', '(Smiles, showing her teeth.) Very good. They\'re the same thing seen from different sides of the sword.', '(Elle sourit, montrant les dents.) Très bien. C\'est la même chose vue de deux côtés de l\'épée.']], 'h_a2', { aff: 1, stats: { ingenio: 1 } }),
          o(['Yo prefiero golpear primero.', 'I prefer to strike first.', 'Je préfère frapper en premier.'], 'duro', [['Así mueren los jóvenes valientes. Rápido y con buena historia. Yo prefiero historias largas.', 'That\'s how brave young people die. Fast, and with a good story. I prefer long stories.', 'C\'est comme ça que meurent les jeunes courageux. Vite, et avec une belle histoire. Je préfère les longues histoires.']], 'h_a2'),
        ],
      },
      h_a2: {
        say: [['A mis hijos les enseñé a luchar antes que a leer. Algunos me lo agradecen. Otros… (Deja la frase en el aire.)', 'I taught my children to fight before I taught them to read. Some thank me for it. Others… (Leaves the sentence hanging.)', 'J\'ai appris à mes enfants à se battre avant de leur apprendre à lire. Certains m\'en remercient. D\'autres… (Elle laisse la phrase en suspens.)']],
        opts: [
          o(['¿Mel es de las que no?', 'Is Mel one of the others?', 'Mel fait partie des autres ?'], 'pregunta', [['Mel aprendió a luchar con palabras. Me costó ver que eso también es una espada.', 'Mel learned to fight with words. It took me a while to see that\'s a sword too.', 'Mel a appris à se battre avec des mots. J\'ai mis du temps à voir que c\'est aussi une épée.']], 'h_a3'),
          o(['Debe de ser duro ser su hijo.', 'It must be hard being your child.', 'Ça doit être dur d\'être votre enfant.'], 'amable', [['Más duro es ser hijo de nadie en Noxus. Les di dientes. Es lo que una madre loba puede dar.', 'Harder is being nobody\'s child in Noxus. I gave them teeth. It\'s what a mother wolf can give.', 'Plus dur encore, c\'est d\'être l\'enfant de personne à Noxus. Je leur ai donné des crocs. C\'est ce qu\'une mère louve peut donner.']], 'h_a3'),
          o(['Eso explica muchas cosas.', 'That explains a lot.', 'Ça explique beaucoup de choses.'], 'broma', [['(Ríe, grave.) Lo explica todo. Tienes buen ojo.', '(A deep laugh.) It explains everything. You have a good eye.', '(Un rire grave.) Ça explique tout. Tu as l\'œil.']], 'h_a3', { aff: 1 }),
        ],
      },
      h_a3: {
        say: [['Suficiente filosofía de guerra. Te estoy dando lecciones gratis y yo nunca doy nada gratis.', 'Enough war philosophy. I\'m giving you free lessons, and I never give anything for free.', 'Assez de philosophie de guerre. Je te donne des leçons gratuites, et je ne donne jamais rien gratuitement.']],
        opts: [
          o(['Entonces cuénteme su primera batalla.', 'Then tell me about your first battle.', 'Alors racontez-moi votre première bataille.'], 'serio', [['Eso tampoco es gratis. Pero vale.', 'That isn\'t free either. But fine.', 'Ça non plus, ce n\'est pas gratuit. Mais soit.']], 'h_b1'),
          o(['¿Qué echa de menos de Noxus?', 'What do you miss about Noxus?', 'Qu\'est-ce qui vous manque de Noxus ?'], 'amable', [['Preguntas que ningún soldado se atreve a hacerme. Bien.', 'Questions no soldier dares ask me. Good.', 'Des questions qu\'aucun soldat n\'ose me poser. Bien.']], 'h_c1', { aff: 1 }),
          o(['Le pagaré con buena conversación.', 'I\'ll pay you in good conversation.', 'Je vous paierai en bonne conversation.'], 'astuto', [['Moneda aceptable. Empecemos otra vez.', 'Acceptable currency. Let\'s begin again.', 'Monnaie acceptable. Recommençons.']], 'h_raiz'),
        ],
      },
      h_b1: {
        say: [['Tenía catorce años. Llovía. Recuerdo el barro más que la sangre, y el silencio después más que los gritos.', 'I was fourteen. It was raining. I remember the mud more than the blood, and the silence afterwards more than the screams.', 'J\'avais quatorze ans. Il pleuvait. Je me souviens plus de la boue que du sang, et du silence d\'après plus que des cris.']],
        again: [['Aún sueño con aquel barro. Hay cosas que ni Noxus te quita.', 'I still dream of that mud. Some things even Noxus can\'t take from you.', 'Je rêve encore de cette boue. Il y a des choses que même Noxus ne peut pas t\'enlever.']],
        opts: [
          o(['¿Tuvo miedo?', 'Were you afraid?', 'Vous avez eu peur ?'], 'pregunta', [['Todos tienen miedo. Los que lo niegan son los primeros en huir. Yo no huí. Esa es toda la diferencia.', 'Everyone is afraid. Those who deny it are the first to run. I didn\'t run. That\'s the whole difference.', 'Tout le monde a peur. Ceux qui le nient sont les premiers à fuir. Moi, je n\'ai pas fui. Toute la différence est là.']], 'h_b2'),
          o(['Catorce años es muy pronto.', 'Fourteen is very young.', 'Quatorze ans, c\'est très tôt.'], 'amable', [['En Noxus, es tarde. (Una pausa.) Pero sí. Era muy pronto.', 'In Noxus, it\'s late. (A pause.) But yes. It was very young.', 'À Noxus, c\'est tard. (Une pause.) Mais oui. C\'était très tôt.']], 'h_b2', { aff: 1 }),
          o(['¿Ganó?', 'Did you win?', 'Vous avez gagné ?'], 'duro', [['Sobreviví. En la primera batalla, es lo mismo.', 'I survived. In your first battle, that\'s the same thing.', 'J\'ai survécu. Dans une première bataille, c\'est la même chose.']], 'h_b2'),
        ],
      },
      h_b2: {
        say: [['Desde entonces he visto más guerras de las que puedo contar. Y he aprendido que la peor no es la que se pierde: es la que nunca termina.', 'Since then I\'ve seen more wars than I can count. And I\'ve learned the worst isn\'t the one you lose: it\'s the one that never ends.', 'Depuis, j\'ai vu plus de guerres que je ne peux en compter. Et j\'ai appris que la pire n\'est pas celle qu\'on perd : c\'est celle qui ne finit jamais.']],
        opts: [
          o(['¿Como la de Piltover y Zaun?', 'Like the one between Piltover and Zaun?', 'Comme celle entre Piltover et Zaun ?'], 'astuto', [['Exactamente. Esta ciudad lleva décadas en guerra y aún cree que vive en paz.', 'Exactly. This city has been at war for decades and still believes it lives in peace.', 'Exactement. Cette ville est en guerre depuis des décennies et croit encore vivre en paix.']], 'h_b3', { stats: { ingenio: 1 } }),
          o(['¿Y por qué sigue luchando?', 'And why do you keep fighting?', 'Et pourquoi continuez-vous à vous battre ?'], 'pregunta', [['Porque si paro, otros lucharán por mí. Y lo harán peor.', 'Because if I stop, others will fight in my place. And they\'ll do it worse.', 'Parce que si j\'arrête, d\'autres se battront à ma place. Et ils le feront moins bien.']], 'h_b3'),
          o(['Quizá podría terminarla usted.', 'Maybe you could end it.', 'Peut-être pourriez-vous y mettre fin.'], 'serio', [['(Te mira largamente.) Quizá. Pero todas las paces tienen un precio. Y alguien tiene que pagarlo.', '(Looks at you for a long time.) Perhaps. But every peace has a price. And someone has to pay it.', '(Elle te regarde longuement.) Peut-être. Mais toute paix a un prix. Et quelqu\'un doit le payer.']], 'h_b3'),
        ],
      },
      h_b3: {
        say: [['Has escuchado sin apartar la mirada. Eso lo hacen pocos. Dime algo de ti, ahora.', 'You\'ve listened without looking away. Few do that. Tell me something about yourself now.', 'Tu as écouté sans détourner le regard. Peu le font. Dis-moi quelque chose sur toi, maintenant.']],
        opts: [
          o(['Yo también he perdido a gente.', 'I\'ve lost people too.', 'J\'ai perdu des gens, moi aussi.'], 'serio', [['Entonces sabes de lo que hablo. Llévalos contigo. Pesan, pero también empujan.', 'Then you know what I mean. Carry them with you. They weigh, but they also push.', 'Alors tu sais de quoi je parle. Porte-les avec toi. Ils pèsent, mais ils poussent aussi.']], 'h_c1', { aff: 1 }),
          o(['Soy mejor con las palabras que con la espada.', 'I\'m better with words than with a sword.', 'Je suis meilleur{g:|e|·e} avec les mots qu\'avec l\'épée.'], 'astuto', [['Como mi hija. Vigila tus palabras, entonces. Son tu filo.', 'Like my daughter. Mind your words, then. They\'re your blade.', 'Comme ma fille. Surveille tes mots, alors. Ce sont ta lame.']], 'h_a1'),
          o(['Prefiero que siga hablando usted.', 'I\'d rather you kept talking.', 'Je préfère que vous continuiez à parler.'], 'amable', [['Hábil. Muy bien.', 'Clever. Very well.', 'Habile. Très bien.']], 'h_raiz'),
        ],
      },
      h_c1: {
        say: [['(Deja el cuchillo.) El olor de la tierra después de una tormenta en las colinas de Noxus. Y el aullido de mis lobos al amanecer.', '(Puts down the knife.) The smell of earth after a storm in the hills of Noxus. And my wolves howling at dawn.', '(Elle pose le couteau.) L\'odeur de la terre après l\'orage dans les collines de Noxus. Et le hurlement de mes loups à l\'aube.']],
        again: [['Mis lobos. Siempre vuelvo a ellos. Y tú, conmigo.', 'My wolves. I always come back to them. And you, with me.', 'Mes loups. J\'y reviens toujours. Et toi, avec moi.']],
        opts: [
          o(['¿Tiene lobos de verdad?', 'You have real wolves?', 'Vous avez de vrais loups ?'], 'pregunta', [['Tres. La mayor se llama Ceniza. Me obedece porque me respeta, no porque me tema. Lo distingo bien.', 'Three. The eldest is called Ash. She obeys because she respects me, not because she fears me. I know the difference.', 'Trois. L\'aînée s\'appelle Cendre. Elle m\'obéit parce qu\'elle me respecte, pas parce qu\'elle me craint. Je fais bien la différence.']], 'h_c2', { aff: 1 }),
          o(['Suena precioso.', 'That sounds beautiful.', 'Ça a l\'air magnifique.'], 'amable', [['Lo es. Piltover tiene relojes. Noxus tiene horizontes.', 'It is. Piltover has clocks. Noxus has horizons.', 'Ça l\'est. Piltover a des horloges. Noxus a des horizons.']], 'h_c2', { aff: 1 }),
          o(['No pensaba que fuera nostálgica.', 'I didn\'t think you were the nostalgic type.', 'Je ne vous croyais pas nostalgique.'], 'broma', [['Nadie lo piensa. Por eso no se lo digo a nadie. Ahora tú lo sabes. Ten cuidado.', 'Nobody does. That\'s why I tell no one. Now you know. Be careful.', 'Personne ne le croit. C\'est pour ça que je ne le dis à personne. Maintenant, tu le sais. Fais attention.']], 'h_c2'),
        ],
      },
      h_c2: {
        say: [['Algún día, cuando todo esto acabe, volveré a esas colinas. Me sentaré en una piedra y no daré ninguna orden en todo el día.', 'Someday, when all this is over, I\'ll return to those hills. I\'ll sit on a rock and give no orders all day.', 'Un jour, quand tout ça sera fini, je retournerai dans ces collines. Je m\'assiérai sur une pierre et je ne donnerai aucun ordre de la journée.']],
        opts: [
          o(['¿Sabría hacerlo?', 'Would you know how?', 'Vous sauriez le faire ?'], 'broma', [['(Ríe con fuerza.) Probablemente no. Daría órdenes a las piedras.', '(Laughs loudly.) Probably not. I\'d order the rocks around.', '(Elle rit fort.) Probablement pas. Je donnerais des ordres aux pierres.']], 'h_c3', { aff: 1 }),
          o(['Se lo merece.', 'You deserve it.', 'Vous le méritez.'], 'amable', [['Merecer… En Noxus nadie merece nada. Se toma. Pero te lo agradezco.', 'Deserve… In Noxus no one deserves anything. You take it. But I thank you.', 'Mériter… À Noxus, personne ne mérite rien. On prend. Mais je te remercie.']], 'h_c3'),
          o(['¿Y Mel iría con usted?', 'And would Mel go with you?', 'Et Mel irait avec vous ?'], 'pregunta', [['(Se le endurece la cara un instante.) Eso depende de Mel. Siempre ha dependido de ella.', '(Her face hardens for an instant.) That depends on Mel. It always has.', '(Son visage se durcit un instant.) Ça dépend de Mel. Ça a toujours dépendu d\'elle.']], 'h_c3'),
        ],
      },
      h_c3: {
        say: [['Basta. Esta conversación ha durado más que algunos asedios. Y ha sido más agradable.', 'Enough. This conversation has lasted longer than some sieges. And it\'s been more pleasant.', 'Assez. Cette conversation a duré plus longtemps que certains sièges. Et elle a été plus agréable.']],
        opts: [
          o(['Otra ronda, general.', 'Another round, General.', 'Une autre manche, générale.'], 'amable', [['Insistente como un lobo joven. Adelante.', 'Persistent as a young wolf. Go on.', 'Insistant{g:|e|·e} comme un jeune loup. Vas-y.']], 'h_raiz', { aff: 1 }),
          o(['Hábleme más de la fuerza.', 'Tell me more about strength.', 'Parlez-moi encore de la force.'], 'pregunta', [['Bien. Escucha.', 'Good. Listen.', 'Bien. Écoute.']], 'h_a1'),
          o(['¿Y aquella primera batalla?', 'And that first battle?', 'Et cette première bataille ?'], 'serio', [['La recordaré contigo otra vez.', 'I\'ll remember it with you again.', 'Je m\'en souviendrai encore avec toi.']], 'h_b1'),
        ],
      },
    },
  },

  // ============================================================ CASSANDRA
  cassandra: {
    entry: o(['Lady Kiramman, ¿tomamos el té con calma?', 'Lady Kiramman, shall we take tea at our leisure?', 'Lady Kiramman, prenons-nous le thé tranquillement ?'], 'amable', null, 'h_raiz'),
    nodes: {
      h_raiz: {
        say: [['(Hace un gesto a la doncella para que traiga otra taza.) Con calma, por favor. Es lo único que el Consejo nunca me deja hacer.', '(Signals the maid to bring another cup.) At our leisure, please. It\'s the one thing the Council never lets me do.', '(Elle fait signe à la domestique d\'apporter une autre tasse.) Tranquillement, je vous en prie. C\'est la seule chose que le Conseil ne me laisse jamais faire.']],
        again: [['Vuelve usted. La casa Kiramman empieza a acostumbrarse a su presencia. Yo también.', 'You\'ve returned. House Kiramman is growing used to your presence. So am I.', 'Vous revenez. La maison Kiramman commence à s\'habituer à votre présence. Moi aussi.'],
          ['El té está recién hecho. Tobias insiste en que es mejor cuando hay compañía. Tiene razón, aunque no se lo diré.', 'The tea is freshly made. Tobias insists it\'s better with company. He\'s right, though I won\'t tell him.', 'Le thé est fraîchement infusé. Tobias insiste qu\'il est meilleur en compagnie. Il a raison, mais je ne le lui dirai pas.']],
        opts: [
          o(['¿Cómo conoció a su marido?', 'How did you meet your husband?', 'Comment avez-vous rencontré votre mari ?'], 'amable', null, 'h_a1'),
          o(['¿Qué significa ser una Kiramman?', 'What does it mean to be a Kiramman?', 'Que signifie être une Kiramman ?'], 'pregunta', null, 'h_b1'),
          o(['¿Cómo era Caitlyn de pequeña?', 'What was Caitlyn like as a little girl?', 'Comment était Caitlyn petite ?'], 'broma', null, 'h_c1'),
        ],
      },
      h_a1: {
        say: [['(Sonríe sobre la taza.) En una gala. Él llegó tarde, despeinado y con pintura en la manga. Fue lo más honesto que vi en toda la noche.', '(Smiles over her cup.) At a gala. He arrived late, dishevelled, with paint on his sleeve. It was the most honest thing I saw all night.', '(Elle sourit au-dessus de sa tasse.) À un gala. Il est arrivé en retard, décoiffé, avec de la peinture sur la manche. C\'était la chose la plus honnête que j\'aie vue de la soirée.']],
        again: [['Tobias sigue llegando tarde a todo. Y yo sigo sin quejarme demasiado.', 'Tobias still arrives late to everything. And I still don\'t complain too much.', 'Tobias arrive toujours en retard à tout. Et je ne m\'en plains toujours pas trop.']],
        opts: [
          o(['¿Fue amor a primera vista?', 'Was it love at first sight?', 'Ce fut le coup de foudre ?'], 'coqueto', [['A primera discusión. Me corrigió una cita de un poeta. Tenía razón. Me casé con él para poder llevarle la contraria el resto de mi vida.', 'At first argument. He corrected my quote of a poet. He was right. I married him so I could contradict him for the rest of my life.', 'Au premier désaccord. Il a corrigé ma citation d\'un poète. Il avait raison. Je l\'ai épousé pour pouvoir le contredire le reste de ma vie.']], 'h_a2', { aff: 1 }),
          o(['Un pintor en la nobleza. Qué escándalo.', 'A painter among nobility. What a scandal.', 'Un peintre parmi la noblesse. Quel scandale.'], 'broma', [['Mi madre casi se desmaya. Fue uno de los mejores días de mi juventud.', 'My mother nearly fainted. It was one of the best days of my youth.', 'Ma mère a failli s\'évanouir. Ce fut l\'un des plus beaux jours de ma jeunesse.']], 'h_a2', { aff: 1 }),
          o(['Usted no parece de las que se dejan sorprender.', 'You don\'t seem like someone easily surprised.', 'Vous ne semblez pas du genre à vous laisser surprendre.'], 'astuto', [['No lo soy. Por eso me sorprendió. Lo raro siempre llama la atención de quien está acostumbrada a lo previsible.', 'I\'m not. That\'s why he surprised me. The unusual always catches the eye of someone used to the predictable.', 'Je ne le suis pas. C\'est pour ça qu\'il m\'a surprise. L\'inhabituel attire toujours l\'œil de qui est habituée au prévisible.']], 'h_a2'),
        ],
      },
      h_a2: {
        say: [['Tobias es la parte tierna de esta casa. Yo soy la muralla. Caitlyn, por desgracia, heredó las dos.', 'Tobias is the tender part of this house. I am the wall. Caitlyn, unfortunately, inherited both.', 'Tobias est la part tendre de cette maison. Moi, je suis le rempart. Caitlyn, malheureusement, a hérité des deux.']],
        opts: [
          o(['¿Por qué «por desgracia»?', 'Why "unfortunately"?', 'Pourquoi « malheureusement » ?'], 'pregunta', [['Porque una muralla tierna se agrieta. Y yo no quiero ver a mi hija agrietarse.', 'Because a tender wall cracks. And I don\'t want to watch my daughter crack.', 'Parce qu\'un rempart tendre se fissure. Et je ne veux pas voir ma fille se fissurer.']], 'h_a3'),
          o(['A mí me parece una mezcla perfecta.', 'It sounds like a perfect blend to me.', 'Ça me semble un mélange parfait.'], 'amable', [['(Baja la taza.) Es usted generos{g:o|a|e} con mi familia. Quizá tenga razón.', '(Lowers her cup.) You are generous with my family. Perhaps you\'re right.', '(Elle repose sa tasse.) Vous êtes généreu{g:x|se|x·se} avec ma famille. Peut-être avez-vous raison.']], 'h_a3', { aff: 1 }),
          o(['¿La muralla nunca se cansa?', 'Does the wall never tire?', 'Le rempart ne se lasse jamais ?'], 'serio', [['(Silencio.) Las murallas no tienen permiso para cansarse.', '(Silence.) Walls are not permitted to tire.', '(Silence.) Les remparts n\'ont pas le droit de se lasser.']], 'h_a3', { aff: 1 }),
        ],
      },
      h_a3: {
        say: [['Me está haciendo hablar de cosas que no suelo contar ni a mis consejeros. Es usted peligros{g:o|a|e} con una taza de té en la mano.', 'You are making me speak of things I don\'t tell even my advisers. You are dangerous with a teacup in hand.', 'Vous me faites parler de choses que je ne confie même pas à mes conseillers. Vous êtes dangereu{g:x|se|x·se}, une tasse de thé à la main.']],
        opts: [
          o(['¿Qué significa ser una Kiramman?', 'What does it mean to be a Kiramman?', 'Que signifie être une Kiramman ?'], 'pregunta', [['Una pregunta seria. Bien.', 'A serious question. Good.', 'Une question sérieuse. Bien.']], 'h_b1'),
          o(['Hábleme de Caitlyn de pequeña.', 'Tell me about Caitlyn as a little girl.', 'Parlez-moi de Caitlyn petite.'], 'broma', [['Ah, eso le va a gustar.', 'Ah, you\'ll enjoy this.', 'Ah, ça va vous plaire.']], 'h_c1', { aff: 1 }),
          o(['Más té, entonces.', 'More tea, then.', 'Plus de thé, alors.'], 'amable', [['(Sirve.) Más té.', '(Pours.) More tea.', '(Elle sert.) Plus de thé.']], 'h_raiz'),
        ],
      },
      h_b1: {
        say: [['Significa responder. De cada decisión, de cada acuerdo, de cada error de tus antepasados. Nuestro apellido es un libro de cuentas.', 'It means answering. For every decision, every agreement, every mistake of your ancestors. Our name is a ledger.', 'Cela signifie répondre. De chaque décision, de chaque accord, de chaque erreur de ses ancêtres. Notre nom est un livre de comptes.']],
        again: [['El libro de cuentas sigue abierto. Siempre lo está.', 'The ledger is still open. It always is.', 'Le livre de comptes est toujours ouvert. Il l\'est toujours.']],
        opts: [
          o(['¿Y qué deuda pesa más?', 'And which debt weighs most?', 'Et quelle dette pèse le plus ?'], 'astuto', [['(Mira hacia la ventana, hacia abajo, hacia Zaun.) La que nadie de esta familia ha querido pagar todavía.', '(Looks toward the window, downward, toward Zaun.) The one no one in this family has yet been willing to pay.', '(Elle regarde vers la fenêtre, vers le bas, vers Zaun.) Celle que personne dans cette famille n\'a encore voulu payer.']], 'h_b2', { rep: { zaun: 1 } }),
          o(['Suena a una carga enorme.', 'That sounds like an enormous burden.', 'Ça semble un fardeau énorme.'], 'amable', [['Lo es. Pero también es un privilegio. Las dos cosas a la vez. Así es la nobleza bien entendida.', 'It is. But it is also a privilege. Both at once. That is nobility properly understood.', 'Ça l\'est. Mais c\'est aussi un privilège. Les deux à la fois. C\'est ça, la noblesse bien comprise.']], 'h_b2'),
          o(['Pues reparta un poco de dinero abajo.', 'Then spread some money below.', 'Alors distribuez un peu d\'argent en bas.'], 'duro', [['(Arquea una ceja.) Ojalá fuera tan sencillo. El dinero sin cambio de leyes es una limosna. Y la limosna humilla.', '(Raises an eyebrow.) If only it were that simple. Money without a change in the law is charity. And charity humiliates.', '(Elle hausse un sourcil.) Si seulement c\'était si simple. L\'argent sans changement de lois, c\'est l\'aumône. Et l\'aumône humilie.']], 'h_b2'),
        ],
      },
      h_b2: {
        say: [['En el Consejo me llaman fría. Prefiero fría a incendiaria. Las ciudades se queman muy deprisa.', 'On the Council they call me cold. I prefer cold to incendiary. Cities burn very quickly.', 'Au Conseil, on me dit froide. Je préfère froide qu\'incendiaire. Les villes brûlent très vite.']],
        opts: [
          o(['¿Quién es el incendiario?', 'Who\'s the incendiary?', 'Qui est l\'incendiaire ?'], 'pregunta', [['Elija usted. En esta ciudad sobran candidatos a ambos lados del río.', 'Take your pick. This city has plenty of candidates on both sides of the river.', 'Faites votre choix. Cette ville ne manque pas de candidats des deux côtés du fleuve.']], 'h_b3'),
          o(['Fría no. Prudente.', 'Not cold. Prudent.', 'Pas froide. Prudente.'], 'amable', [['(Sonríe levemente.) Me quedo con esa palabra. Gracias.', '(Smiles faintly.) I\'ll keep that word. Thank you.', '(Elle sourit légèrement.) Je garde ce mot. Merci.']], 'h_b3', { aff: 1 }),
          o(['A veces hace falta algo de fuego.', 'Sometimes a bit of fire is needed.', 'Parfois il faut un peu de feu.'], 'serio', [['Algo, sí. Pero con chimenea. No en mitad del salón.', 'Some, yes. But in a fireplace. Not in the middle of the drawing room.', 'Un peu, oui. Mais dans une cheminée. Pas au milieu du salon.']], 'h_b3'),
        ],
      },
      h_b3: {
        say: [['Bien. Ya he hablado bastante de política para una tarde. Mi médico dice que me sube la tensión.', 'Well. I\'ve talked enough politics for one afternoon. My physician says it raises my blood pressure.', 'Bien. J\'ai assez parlé de politique pour un après-midi. Mon médecin dit que ça me fait monter la tension.']],
        opts: [
          o(['Hablemos de Caitlyn, entonces.', 'Let\'s talk about Caitlyn, then.', 'Parlons de Caitlyn, alors.'], 'amable', [['Eso también me sube la tensión. Pero de otra forma.', 'That also raises my blood pressure. But differently.', 'Ça aussi, ça me fait monter la tension. Mais autrement.']], 'h_c1'),
          o(['¿Cómo conoció a Tobias?', 'How did you meet Tobias?', 'Comment avez-vous rencontré Tobias ?'], 'coqueto', [['Siempre volvemos a Tobias. Él estaría encantado.', 'We always come back to Tobias. He\'d be delighted.', 'On revient toujours à Tobias. Il en serait ravi.']], 'h_a1'),
          o(['Empecemos de nuevo, entonces.', 'Let\'s begin again, then.', 'Recommençons, alors.'], 'pregunta', [['Como un buen debate. Desde el principio.', 'Like a good debate. From the start.', 'Comme un bon débat. Depuis le début.']], 'h_raiz'),
        ],
      },
      h_c1: {
        say: [['(Se le escapa una risa.) Caitlyn trepaba al tejado del invernadero con el catalejo de su padre para espiar a los vecinos. Llevaba un cuaderno de «sospechosos».', '(A laugh escapes her.) Caitlyn used to climb onto the greenhouse roof with her father\'s spyglass to spy on the neighbours. She kept a notebook of "suspects".', '(Un rire lui échappe.) Caitlyn grimpait sur le toit de la serre avec la longue-vue de son père pour espionner les voisins. Elle tenait un carnet de « suspects ».']],
        again: [['Aún guardo el cuaderno de sospechosos. Yo salgo tres veces. Por «actitud».', 'I still have the suspects notebook. I appear three times. For "attitude".', 'Je garde encore le carnet de suspects. J\'y figure trois fois. Pour « attitude ».']],
        opts: [
          o(['¿Quién era el principal sospechoso?', 'Who was the prime suspect?', 'Qui était le suspect principal ?'], 'broma', [['El consejero Bolbok. Por «tener cara de esconder pasteles». Lo peor es que acertó.', 'Councillor Bolbok. For "having the face of someone hiding cakes". The worst part is she was right.', 'Le conseiller Bolbok. Pour « avoir une tête à cacher des gâteaux ». Le pire, c\'est qu\'elle avait raison.']], 'h_c2', { aff: 1 }),
          o(['Ya apuntaba maneras.', 'She was already showing promise.', 'Elle promettait déjà.'], 'amable', [['Desde siempre. Yo quería una diplomática. Me salió una detective. La vida se ríe de los planes de las madres.', 'Always. I wanted a diplomat. I got a detective. Life laughs at mothers\' plans.', 'Depuis toujours. Je voulais une diplomate. J\'ai eu une détective. La vie se moque des projets des mères.']], 'h_c2', { aff: 1 }),
          o(['¿Y usted la regañaba?', 'And did you scold her?', 'Et vous la grondiez ?'], 'pregunta', [['Por subirse al tejado, sí. Por la investigación, nunca. Era muy rigurosa.', 'For climbing the roof, yes. For the investigation, never. It was very rigorous.', 'Pour être montée sur le toit, oui. Pour l\'enquête, jamais. Elle était très rigoureuse.']], 'h_c2'),
        ],
      },
      h_c2: {
        say: [['Ahora sube a tejados mucho más peligrosos. Y yo sigo mirando hacia arriba con el corazón en la boca.', 'Now she climbs far more dangerous roofs. And I still look up with my heart in my mouth.', 'Maintenant elle grimpe sur des toits bien plus dangereux. Et moi, je regarde toujours en l\'air, le cœur au bord des lèvres.']],
        opts: [
          o(['Ella sabe cuidarse.', 'She knows how to look after herself.', 'Elle sait prendre soin d\'elle.'], 'amable', [['Lo sé. Lo que no sé es si sabe dejarse cuidar. Eso también lo heredó de mí.', 'I know. What I don\'t know is whether she knows how to let herself be cared for. She inherited that from me too.', 'Je sais. Ce que je ne sais pas, c\'est si elle sait se laisser soigner. Ça aussi, elle le tient de moi.']], 'h_c3', { aff: 1 }),
          o(['¿Se lo ha dicho alguna vez?', 'Have you ever told her?', 'Le lui avez-vous déjà dit ?'], 'serio', [['(Se queda inmóvil.) …No con esas palabras. Quizá debería. Antes de que sea tarde.', '(Goes still.) …Not in those words. Perhaps I should. Before it\'s too late.', '(Elle s\'immobilise.) …Pas avec ces mots-là. Peut-être devrais-je. Avant qu\'il ne soit trop tard.']], 'h_c3', { aff: 1 }),
          o(['Yo la vigilaré por usted.', 'I\'ll watch over her for you.', 'Je veillerai sur elle pour vous.'], 'astuto', [['Le tomo la palabra. Y le advierto que lo comprobaré.', 'I\'ll hold you to that. And I warn you I will check.', 'Je vous prends au mot. Et je vous préviens que je vérifierai.']], 'h_c3', { aff: { cassandra: 1, caitlyn: 1 } }),
        ],
      },
      h_c3: {
        say: [['(Mira el reloj de la chimenea.) Se nos ha ido la tarde. Hacía mucho que no me pasaba.', '(Glances at the mantel clock.) The afternoon has slipped away. It\'s been a long time since that happened.', '(Elle regarde l\'horloge de la cheminée.) L\'après-midi nous a filé entre les doigts. Ça ne m\'était pas arrivé depuis longtemps.']],
        opts: [
          o(['Pues sigamos un rato más.', 'Then let\'s stay a while longer.', 'Alors restons encore un peu.'], 'amable', [['Un rato más. Que espere el Consejo.', 'A while longer. Let the Council wait.', 'Encore un peu. Que le Conseil attende.']], 'h_raiz', { aff: 1 }),
          o(['Cuénteme más de la familia.', 'Tell me more about the family.', 'Parlez-moi encore de la famille.'], 'pregunta', [['La familia. Siempre la familia.', 'Family. Always family.', 'La famille. Toujours la famille.']], 'h_b1'),
          o(['¿Más travesuras de Caitlyn?', 'More of Caitlyn\'s mischief?', 'D\'autres bêtises de Caitlyn ?'], 'broma', [['Tengo para una enciclopedia.', 'I have enough for an encyclopaedia.', 'J\'en ai de quoi remplir une encyclopédie.']], 'h_c1'),
        ],
      },
    },
  },
};
