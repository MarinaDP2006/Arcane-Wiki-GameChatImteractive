// Vi y Jinx. Cada texto: [español, inglés, francés].
const o = (t, tone, say, go, fx) => ({ t, tone, say, go, ...(fx ? { fx } : {}) });
module.exports = {
  // ============================================================ VI
  vi: {
    entry: o(['Tengo tiempo. Hablemos sin prisa.', 'I have time. Let\'s talk, no rush.', 'J\'ai le temps. Parlons sans nous presser.'], 'amable', null, 'h_raiz'),
    nodes: {
      h_raiz: {
        say: [['(Se sienta en una caja, haciendo crujir los nudillos.) Sin prisa, ¿eh? Vale. Dispara.', '(Sits on a crate, cracking her knuckles.) No rush, huh? Fine. Shoot.', '(Elle s\'assoit sur une caisse en faisant craquer ses jointures.) Sans se presser, hein ? D\'accord. Vas-y.']],
        again: [['¿Otra vez tú? No me quejo. ¿De qué hablamos ahora?', 'You again? Not complaining. What now?', 'Encore toi ? Je ne me plains pas. On parle de quoi, maintenant ?'],
          ['(Te tira una manzana medio mordida.) Toma. Para la charla. ¿Por dónde íbamos?', '(Tosses you a half-bitten apple.) Here. For the chat. Where were we?', '(Elle te lance une pomme à moitié croquée.) Tiens. Pour la discussion. On en était où ?']],
        opts: [
          o(['¿Cómo eran las calles de Zaun cuando eras cría?', 'What were Zaun\'s streets like when you were a kid?', 'Comment étaient les rues de Zaun quand tu étais gamine ?'], 'pregunta', null, 'h_a1'),
          o(['¿Qué harías si un día todo esto se arreglara?', 'What would you do if one day all this got fixed?', 'Que ferais-tu si un jour tout ça s\'arrangeait ?'], 'amable', null, 'h_b1'),
          o(['¿Qué es lo que más miedo te da?', 'What scares you the most?', 'Qu\'est-ce qui te fait le plus peur ?'], 'serio', null, 'h_c1'),
        ],
      },
      h_a1: {
        say: [['Ruidosas. Apestosas. Y nuestras. Corríamos por los tejados de las Galerías como si fueran un parque.', 'Loud. Stinking. And ours. We ran across the rooftops of the Lanes like they were a playground.', 'Bruyantes. Puantes. Et à nous. On courait sur les toits des Ruelles comme si c\'était un parc.']],
        again: [['Los tejados otra vez, ¿eh? Te gusta oírme hablar de cuando era una cría salvaje.', 'The rooftops again, huh? You like hearing about when I was a wild kid.', 'Encore les toits, hein ? Tu aimes m\'entendre parler de quand j\'étais une gamine sauvage.']],
        opts: [
          o(['¿Quién iba contigo?', 'Who ran with you?', 'Qui courait avec toi ?'], 'pregunta', [['Mylo, Claggor, Powder colgada de mi espalda… Mylo siempre se quejaba y siempre llegaba el último.', 'Mylo, Claggor, Powder hanging off my back… Mylo always complained and always came last.', 'Mylo, Claggor, Powder accrochée à mon dos… Mylo râlait toujours et arrivait toujours dernier.']], 'h_a2'),
          o(['Seguro que te caíste más de una vez.', 'I bet you fell more than once.', 'Je parie que tu es tombée plus d\'une fois.'], 'broma', [['¿Una vez? (Se señala la ceja.) Esta cicatriz es de una tubería. La tubería perdió.', 'Once? (Points at her eyebrow.) This scar\'s from a pipe. The pipe lost.', 'Une fois ? (Elle montre son sourcil.) Cette cicatrice vient d\'un tuyau. Le tuyau a perdu.']], 'h_a2', { aff: 1 }),
          o(['Suena peligroso para unos críos.', 'Sounds dangerous for kids.', 'Ça semble dangereux pour des gosses.'], 'serio', [['Todo en Zaun es peligroso para unos críos. Por eso aprendes rápido o no aprendes.', 'Everything in Zaun is dangerous for kids. So you learn fast or you don\'t learn at all.', 'Tout à Zaun est dangereux pour des gosses. Alors tu apprends vite, ou tu n\'apprends pas.']], 'h_a2'),
        ],
      },
      h_a2: {
        say: [['Vander nos pillaba siempre. No sé cómo. Volvíamos sucios hasta las cejas y él solo levantaba una ceja.', 'Vander always caught us. Don\'t know how. We\'d come back filthy to the eyebrows and he\'d just raise one.', 'Vander nous attrapait toujours. Je ne sais pas comment. On rentrait sales jusqu\'aux sourcils et lui haussait juste un sourcil.']],
        opts: [
          o(['¿Os castigaba?', 'Did he punish you?', 'Il vous punissait ?'], 'pregunta', [['Nos ponía a fregar jarras en La Última Gota. Que, ahora que lo pienso, era su forma de tenernos cerca.', 'He\'d make us scrub mugs at The Last Drop. Which, now that I think of it, was his way of keeping us close.', 'Il nous faisait laver les chopes à La Dernière Goutte. Ce qui, quand j\'y pense, était sa façon de nous garder près de lui.']], 'h_a3'),
          o(['Debía de quereros mucho.', 'He must have loved you a lot.', 'Il devait beaucoup vous aimer.'], 'amable', [['(Aparta la mirada.) Sí. Más de lo que nos merecíamos, a veces.', '(Looks away.) Yeah. More than we deserved, sometimes.', '(Elle détourne le regard.) Ouais. Plus qu\'on ne le méritait, parfois.']], 'h_a3', { aff: 1 }),
          o(['Yo me habría escapado mejor.', 'I\'d have sneaked out better.', 'Moi, je me serais mieux échappé.'], 'broma', [['¿Ah, sí? Te reto a salir de una taberna con Vander detrás de la barra. Tiene ojos en la nuca.', 'Oh yeah? I dare you to slip out of a bar with Vander behind the counter. Man has eyes in the back of his head.', 'Ah oui ? Je te défie de sortir d\'une taverne avec Vander derrière le comptoir. Il a des yeux derrière la tête.']], 'h_a3'),
        ],
      },
      h_a3: {
        say: [['A veces paso por esas calles y ya no reconozco nada. Han cambiado. O he cambiado yo.', 'Sometimes I walk those streets and I don\'t recognise a thing. They\'ve changed. Or I have.', 'Parfois je passe dans ces rues et je ne reconnais plus rien. Elles ont changé. Ou c\'est moi.']],
        opts: [
          o(['Los dos, seguramente. Y eso no es malo.', 'Both, probably. And that\'s not bad.', 'Les deux, sûrement. Et ce n\'est pas mal.'], 'amable', [['(Medio sonríe.) Hablas como Cait. Vale. Hablando de cambiar… ¿te cuento qué haría si pudiera elegir?', '(Half-smiles.) You sound like Cait. Fine. Speaking of change… want to hear what I\'d do if I got to choose?', '(Demi-sourire.) Tu parles comme Cait. Bon. En parlant de changer… tu veux savoir ce que je ferais si je pouvais choisir ?']], 'h_b1', { aff: 1 }),
          o(['¿Te da miedo haber cambiado demasiado?', 'Are you afraid you\'ve changed too much?', 'Tu as peur d\'avoir trop changé ?'], 'serio', [['Esa pregunta duele más que un gancho. Vale, hablemos de miedos.', 'That question hurts more than a hook. Fine, let\'s talk about fears.', 'Cette question fait plus mal qu\'un crochet. D\'accord, parlons de peurs.']], 'h_c1'),
          o(['Llévame un día a esos tejados.', 'Take me to those rooftops one day.', 'Emmène-moi sur ces toits un jour.'], 'coqueto', [['¿Para verte resbalar? Trato hecho. Y ahora pregúntame otra cosa antes de que me ponga nostálgica.', 'To watch you slip? Deal. Now ask me something else before I get nostalgic.', 'Pour te voir glisser ? Marché conclu. Maintenant, pose-moi autre chose avant que je devienne nostalgique.']], 'h_raiz'),
        ],
      },
      h_b1: {
        say: [['¿Arreglado? (Resopla.) Vale, juguemos. Si Zaun respirara aire limpio… creo que abriría un gimnasio. Para críos.', 'Fixed? (Snorts.) Fine, let\'s play. If Zaun breathed clean air… I think I\'d open a gym. For kids.', 'Arrangé ? (Elle souffle.) D\'accord, jouons. Si Zaun respirait un air pur… je crois que j\'ouvrirais une salle de boxe. Pour les gamins.']],
        again: [['Mi gimnasio imaginario sigue en pie, por si preguntas.', 'My imaginary gym is still standing, in case you\'re asking.', 'Ma salle imaginaire tient toujours debout, au cas où tu demanderais.']],
        opts: [
          o(['¿Para enseñarles a pelear?', 'To teach them to fight?', 'Pour leur apprendre à se battre ?'], 'pregunta', [['Para enseñarles cuándo NO pelear. Eso me lo tuvieron que enseñar a golpes.', 'To teach them when NOT to fight. Someone had to beat that into me.', 'Pour leur apprendre quand NE PAS se battre. Moi, on a dû me l\'apprendre à coups de poing.']], 'h_b2', { aff: 1 }),
          o(['Serías una entrenadora terrible. Gritona.', 'You\'d be a terrible coach. A shouter.', 'Tu serais une coach terrible. Une hurleuse.'], 'broma', [['¡Oye! Gritona pero justa. Y les daría galletas después. Bueno, las robaría de la cocina de Cait.', 'Hey! A shouter, but fair. And I\'d give them cookies after. Well, I\'d nick them from Cait\'s kitchen.', 'Hé ! Hurleuse mais juste. Et je leur donnerais des biscuits après. Enfin, je les volerais dans la cuisine de Cait.']], 'h_b2'),
          o(['Eso no va a pasar nunca.', 'That\'s never going to happen.', 'Ça n\'arrivera jamais.'], 'duro', [['(Te mira fijamente.) Probablemente. Pero si dejo de imaginarlo, ¿para qué me levanto?', '(Stares at you.) Probably. But if I stop imagining it, why get up at all?', '(Elle te fixe.) Probablement. Mais si j\'arrête de l\'imaginer, pourquoi me lever ?']], 'h_b2', { aff: -1 }),
        ],
      },
      h_b2: {
        say: [['Y Powder… quiero decir, mi hermana… tendría un taller. Con ventanas grandes. Que nada explote salvo cuando ella quiera.', 'And Powder… I mean, my sister… would have a workshop. Big windows. Nothing blowing up unless she wants it to.', 'Et Powder… je veux dire, ma sœur… aurait un atelier. Avec de grandes fenêtres. Rien n\'exploserait sauf quand elle le voudrait.']],
        opts: [
          o(['¿Y tú dónde vivirías?', 'And where would you live?', 'Et toi, tu vivrais où ?'], 'pregunta', [['Encima del gimnasio. Para bajar en pijama y pegarle al saco antes del café.', 'Above the gym. So I can go down in my pyjamas and hit the bag before coffee.', 'Au-dessus de la salle. Pour descendre en pyjama et taper dans le sac avant le café.']], 'h_b3'),
          o(['Ese taller suena precioso. Ojalá lo vea.', 'That workshop sounds lovely. I hope I see it.', 'Cet atelier a l\'air magnifique. J\'espère le voir.'], 'amable', [['(Se le quiebra un poco la voz.) Ya. Yo también.', '(Her voice cracks a little.) Yeah. Me too.', '(Sa voix se brise un peu.) Ouais. Moi aussi.']], 'h_b3', { aff: 1 }),
          o(['¿Y Caitlyn? ¿Dónde encaja en ese sueño?', 'And Caitlyn? Where does she fit in that dream?', 'Et Caitlyn ? Où elle se place, dans ce rêve ?'], 'coqueto', [['(Se pone colorada.) …En la puerta de al lado. O en la misma. Cállate, no he dicho nada.', '(Turns red.) …Next door. Or the same door. Shut up, I didn\'t say anything.', '(Elle rougit.) …La porte d\'à côté. Ou la même. Tais-toi, j\'ai rien dit.']], 'h_b3'),
        ],
      },
      h_b3: {
        say: [['Bah. Sueños de taberna. ¿Y tú qué, {name}? ¿Qué harías tú?', 'Bah. Pub dreams. What about you, {name}? What would you do?', 'Bah. Des rêves de comptoir. Et toi, {name} ? Tu ferais quoi ?']],
        opts: [
          o(['Quedarme cerca de la gente que me importa.', 'Stay close to the people I care about.', 'Rester près des gens qui comptent pour moi.'], 'amable', [['Eso es fácil de decir y difícil de hacer. Me gusta. Oye… ¿y qué te asusta a ti? A mí sí te lo digo.', 'Easy to say, hard to do. I like it. Hey… what scares you? I\'ll tell you mine.', 'Facile à dire, difficile à faire. Ça me plaît. Dis… qu\'est-ce qui te fait peur ? Moi, je te le dis.']], 'h_c1', { aff: 1 }),
          o(['Montar una taberna. Te haría la competencia.', 'Open a bar. I\'d be your competition.', 'Ouvrir une taverne. Je te ferais concurrence.'], 'broma', [['¡Ja! Te la cerraría en una semana a base de peleas. Venga, volvamos a lo de antes.', 'Ha! I\'d shut it down in a week with bar fights. Come on, back to the old days.', 'Ha ! Je te la ferais fermer en une semaine à coups de bagarres. Allez, revenons au bon vieux temps.']], 'h_a1'),
          o(['No lo sé. Nunca me he atrevido a pensarlo.', 'I don\'t know. I\'ve never dared to think about it.', 'Je ne sais pas. Je n\'ai jamais osé y penser.'], 'serio', [['Pues piénsalo. Y cuando lo sepas, vienes y me lo cuentas. Yo invito.', 'Then think about it. And when you know, come tell me. My treat.', 'Alors penses-y. Et quand tu sauras, viens me le dire. C\'est moi qui paie.']], 'h_raiz'),
        ],
      },
      h_c1: {
        say: [['(Tarda en contestar.) Llegar tarde. Otra vez. Ver que todo se rompe y estar al otro lado de una puerta.', '(Takes a while to answer.) Being too late. Again. Watching everything break while I\'m on the other side of a door.', '(Elle met du temps à répondre.) Arriver trop tard. Encore. Voir tout se briser en étant de l\'autre côté d\'une porte.']],
        again: [['Mis miedos no han cambiado desde la última vez. Por desgracia.', 'My fears haven\'t changed since last time. Unfortunately.', 'Mes peurs n\'ont pas changé depuis la dernière fois. Malheureusement.']],
        opts: [
          o(['No siempre puedes estar en todas partes.', 'You can\'t always be everywhere.', 'Tu ne peux pas toujours être partout.'], 'amable', [['Lo sé. Lo sé con la cabeza. El estómago no se entera.', 'I know. My head knows. My gut never got the memo.', 'Je sais. Ma tête le sait. Mon ventre n\'est pas au courant.']], 'h_c2', { aff: 1 }),
          o(['¿Lo dices por Powder?', 'Is this about Powder?', 'Tu dis ça à cause de Powder ?'], 'pregunta', [['Por Powder. Por Vander. Por todos. Elige.', 'Powder. Vander. All of them. Take your pick.', 'Powder. Vander. Tous. Choisis.']], 'h_c2'),
          o(['A mí me dan miedo las ratas. Para que veas.', 'I\'m scared of rats. Just so you know.', 'Moi, j\'ai peur des rats. Pour info.'], 'broma', [['(Se le escapa la risa.) ¿Las ratas? ¿En Zaun? Estás perdid{g:o|a|e}. Pero gracias, lo necesitaba.', '(A laugh slips out.) Rats? In Zaun? You\'re doomed. But thanks, I needed that.', '(Un rire lui échappe.) Les rats ? À Zaun ? T\'es fichu{g:|e|·e}. Mais merci, j\'en avais besoin.']], 'h_c2', { aff: 1 }),
        ],
      },
      h_c2: {
        say: [['Cuando estoy en la celda… cuando estaba… contaba los golpes del agua en la pared. Así no pensaba.', 'When I\'m in a cell… when I was… I\'d count the drops of water on the wall. So I didn\'t think.', 'Quand je suis en cellule… quand j\'y étais… je comptais les gouttes d\'eau sur le mur. Pour ne pas penser.']],
        opts: [
          o(['¿Cuántas contaste?', 'How many did you count?', 'Tu en as compté combien ?'], 'pregunta', [['Perdí la cuenta en los millones. Luego empecé a ponerles nombres. No me juzgues.', 'Lost count in the millions. Then I started naming them. Don\'t judge me.', 'J\'ai perdu le compte dans les millions. Après, je leur ai donné des noms. Me juge pas.']], 'h_c3'),
          o(['Ya no estás allí. Estás aquí, conmigo.', 'You\'re not there anymore. You\'re here, with me.', 'Tu n\'y es plus. Tu es ici, avec moi.'], 'amable', [['(Respira hondo.) Sí. Aquí. Vale.', '(Takes a deep breath.) Yeah. Here. Okay.', '(Elle respire profondément.) Ouais. Ici. D\'accord.']], 'h_c3', { aff: 1 }),
          o(['Stillwater debería arder.', 'Stillwater should burn.', 'Stillwater devrait brûler.'], 'duro', [['(Aprieta la mandíbula.) Ahí dentro hay gente que no ha hecho nada. No todo se arregla quemándolo.', '(Clenches her jaw.) There are people in there who did nothing. Not everything gets fixed by burning it.', '(Elle serre la mâchoire.) Il y a des gens là-dedans qui n\'ont rien fait. On ne répare pas tout en brûlant.']], 'h_c3'),
        ],
      },
      h_c3: {
        say: [['Vale, ya basta de ponerme blanda. Me debes una conversación sobre algo tonto.', 'Okay, enough of me going soft. You owe me a chat about something stupid.', 'Bon, assez de me ramollir. Tu me dois une discussion sur un truc idiot.']],
        opts: [
          o(['¿Cuál es tu comida favorita?', 'What\'s your favourite food?', 'C\'est quoi ton plat préféré ?'], 'broma', [['Las tartas de la cafetería de arriba. Las que Cait finge no comprar para mí. Venga, otra cosa.', 'The pies from that topside café. The ones Cait pretends not to buy for me. Go on, something else.', 'Les tartes du café d\'en haut. Celles que Cait fait semblant de ne pas m\'acheter. Allez, autre chose.']], 'h_raiz', { aff: 1 }),
          o(['Cuéntame más de cuando erais críos.', 'Tell me more about when you were kids.', 'Raconte-moi encore quand vous étiez gamins.'], 'amable', [['¿Más? Vale, pero luego me invitas.', 'More? Fine, but then you\'re buying.', 'Encore ? D\'accord, mais après c\'est toi qui paies.']], 'h_a1'),
          o(['¿Y si Zaun tuviera aire limpio?', 'And what if Zaun had clean air?', 'Et si Zaun avait de l\'air pur ?'], 'pregunta', [['Ya te lo dije: un gimnasio. Pero vale, imaginemos más.', 'Told you already: a gym. But fine, let\'s imagine some more.', 'Je te l\'ai déjà dit : une salle de boxe. Mais bon, imaginons encore.']], 'h_b1'),
        ],
      },
    },
  },

  // ============================================================ JINX
  jinx: {
    entry: o(['Oye, Jinx… ¿jugamos a hablar sin parar?', 'Hey, Jinx… want to play a game of talking nonstop?', 'Hé, Jinx… on joue à parler sans s\'arrêter ?'], 'broma', null, 'h_raiz'),
    nodes: {
      h_raiz: {
        say: [['(Da vueltas en una silla giratoria.) ¿Hablar sin parar? ¡Es mi especialidad! Bueno, eso y las explosiones. Elige.', '(Spinning in a swivel chair.) Talking nonstop? That\'s my specialty! Well, that and explosions. Pick.', '(Elle tourne sur une chaise pivotante.) Parler sans s\'arrêter ? C\'est ma spécialité ! Enfin, ça et les explosions. Choisis.']],
        again: [['¡Has vuelto! Las voces apostaban a que no. Les debo dinero.', 'You came back! The voices bet you wouldn\'t. I owe them money.', 'Tu es revenu{g:|e|·e} ! Les voix pariaient que non. Je leur dois de l\'argent.'],
          ['(Te apunta con un dedo como si fuera una pistola.) Bang. Ya estás en la conversación. Sin salida.', '(Points a finger-gun at you.) Bang. You\'re in the conversation now. No way out.', '(Elle te vise avec un doigt-pistolet.) Pan. Tu es dans la conversation. Pas d\'issue.']],
        opts: [
          o(['Enséñame tus dibujos de la pared.', 'Show me your wall drawings.', 'Montre-moi tes dessins sur le mur.'], 'amable', null, 'h_a1'),
          o(['¿Cuál es tu recuerdo favorito?', 'What\'s your favourite memory?', 'Quel est ton souvenir préféré ?'], 'pregunta', null, 'h_b1'),
          o(['Si fueras una bomba, ¿qué bomba serías?', 'If you were a bomb, what bomb would you be?', 'Si tu étais une bombe, tu serais quelle bombe ?'], 'broma', null, 'h_c1'),
        ],
      },
      h_a1: {
        say: [['¡Mis obras maestras! Esa es Vi con cara de tonta. Esa es una ballena con alas. Y esa… esa no la mires.', 'My masterpieces! That\'s Vi with a dumb face. That\'s a whale with wings. And that one… don\'t look at that one.', 'Mes chefs-d\'œuvre ! Ça, c\'est Vi avec une tête d\'idiote. Ça, une baleine avec des ailes. Et celle-là… ne la regarde pas.']],
        again: [['He añadido tres monstruos más a la pared. Uno se parece a ti. Es un cumplido. Creo.', 'I\'ve added three more monsters to the wall. One looks like you. It\'s a compliment. I think.', 'J\'ai ajouté trois monstres de plus au mur. Un te ressemble. C\'est un compliment. Je crois.']],
        opts: [
          o(['¿Por qué no puedo mirar esa?', 'Why can\'t I look at that one?', 'Pourquoi je ne peux pas regarder celle-là ?'], 'pregunta', [['(Se pone delante.) Porque tiene caras tachadas. Y las caras tachadas no se miran. Regla número uno.', '(Steps in front of it.) Because it has crossed-out faces. And you don\'t look at crossed-out faces. Rule number one.', '(Elle se met devant.) Parce qu\'il y a des visages barrés. Et on ne regarde pas les visages barrés. Règle numéro un.']], 'h_a2'),
          o(['La ballena con alas es mi favorita.', 'The winged whale is my favourite.', 'La baleine avec des ailes est ma préférée.'], 'amable', [['¿¡Verdad!? Se llama Señora Burbujas. Vuela por encima del humo y se come las nubes verdes.', 'RIGHT?! Her name\'s Mrs Bubbles. She flies above the smoke and eats the green clouds.', 'N\'EST-CE PAS ?! Elle s\'appelle Madame Bulles. Elle vole au-dessus de la fumée et mange les nuages verts.']], 'h_a2', { aff: 1 }),
          o(['Esto parece la pared de una loca.', 'This looks like a madwoman\'s wall.', 'On dirait le mur d\'une folle.'], 'duro', [['(Ladea la cabeza, sonriendo demasiado.) ¿Loca? Uy. Esa palabra la tacho yo también. Contigo al lado.', '(Tilts her head, smiling too much.) Mad? Ooh. I cross out that word too. With you next to it.', '(Elle penche la tête, avec un sourire de trop.) Folle ? Oh. Ce mot-là, je le barre aussi. Avec toi à côté.']], 'h_a2', { aff: -1 }),
        ],
      },
      h_a2: {
        say: [['Dibujo cuando la cabeza hace demasiado ruido. Las líneas son más calladas que las voces.', 'I draw when my head gets too loud. Lines are quieter than voices.', 'Je dessine quand ma tête fait trop de bruit. Les traits sont plus silencieux que les voix.']],
        opts: [
          o(['¿Puedo dibujar algo contigo?', 'Can I draw something with you?', 'Je peux dessiner quelque chose avec toi ?'], 'amable', [['(Te pone un trozo de tiza en la mano.) Dibuja un mono. Si te sale feo, gana.', '(Puts a stick of chalk in your hand.) Draw a monkey. If it comes out ugly, it wins.', '(Elle te met une craie dans la main.) Dessine un singe. S\'il est moche, il gagne.']], 'h_a3', { aff: 1 }),
          o(['¿Las voces también dibujan?', 'Do the voices draw too?', 'Les voix dessinent aussi ?'], 'pregunta', [['Las voces critican. Son las peores críticas de arte de Zaun. Ni Sevika es tan dura.', 'The voices critique. Worst art critics in Zaun. Not even Sevika is that harsh.', 'Les voix critiquent. Les pires critiques d\'art de Zaun. Même Silco n\'est pas aussi dur.']], 'h_a3'),
          o(['Pues pinta más. Te sienta bien.', 'Then paint more. It suits you.', 'Alors peins plus. Ça te va bien.'], 'serio', [['¿Bien? (Se mira las manos manchadas.) Nadie me dice eso. Raro. Me gusta.', 'Suits me? (Looks at her stained hands.) Nobody says that to me. Weird. I like it.', 'Ça me va bien ? (Elle regarde ses mains tachées.) Personne ne me dit ça. Bizarre. J\'aime bien.']], 'h_a3', { aff: 1 }),
        ],
      },
      h_a3: {
        say: [['(Termina tu mono con un bigote y dos granadas por ojos.) Perfecto. Ahora es arte de verdad.', '(Finishes your monkey with a moustache and two grenades for eyes.) Perfect. Now it\'s real art.', '(Elle finit ton singe avec une moustache et deux grenades à la place des yeux.) Parfait. Maintenant, c\'est du vrai art.']],
        opts: [
          o(['Le has puesto granadas. Claro.', 'You gave it grenades. Of course.', 'Tu lui as mis des grenades. Évidemment.'], 'broma', [['¡Todo es mejor con granadas! Hablando de explosiones… ¿jugamos a lo de la bomba?', 'Everything\'s better with grenades! Speaking of explosions… shall we play the bomb game?', 'Tout est mieux avec des grenades ! En parlant d\'explosions… on joue au jeu de la bombe ?']], 'h_c1'),
          o(['¿Me cuentas un recuerdo bonito?', 'Will you tell me a nice memory?', 'Tu me racontes un joli souvenir ?'], 'amable', [['¿Bonito? Tengo uno. Uno solo, pero brilla.', 'Nice? I\'ve got one. Just one, but it shines.', 'Joli ? J\'en ai un. Un seul, mais il brille.']], 'h_b1'),
          o(['Me lo quedo para mi casa.', 'I\'m keeping it for my place.', 'Je le garde pour chez moi.'], 'coqueto', [['¿Te llevas mi pared? ¡Ladr{g:ón|ona|ón} de arte! …Vale, pero me invitas a ver dónde lo cuelgas. Otra pregunta.', 'You\'re taking my wall? Art thief! …Fine, but you invite me to see where you hang it. Next question.', 'Tu emportes mon mur ? Voleu{g:r|se|r·se} d\'art ! …Bon, mais tu m\'invites à voir où tu l\'accroches. Question suivante.']], 'h_raiz'),
        ],
      },
      h_b1: {
        say: [['(Se queda quieta, cosa rara en ella.) Vi me llevaba a hombros a ver las luces de Piltover desde el puerto. Yo creía que eran estrellas que habían bajado a vivir.', '(Goes still, which is rare.) Vi used to carry me on her shoulders to see Piltover\'s lights from the docks. I thought they were stars that had come down to live.', '(Elle s\'immobilise, chose rare.) Vi me portait sur ses épaules pour voir les lumières de Piltover depuis le port. Je croyais que c\'étaient des étoiles descendues pour vivre.']],
        again: [['Las luces… sí. Sigo pensando en ellas. Pero ahora sé que no son estrellas.', 'The lights… yeah. I still think about them. But now I know they aren\'t stars.', 'Les lumières… ouais. J\'y pense encore. Mais maintenant je sais que ce ne sont pas des étoiles.']],
        opts: [
          o(['Es un recuerdo precioso.', 'That\'s a beautiful memory.', 'C\'est un souvenir magnifique.'], 'amable', [['Lo es. Lo guardo en una caja dentro de la cabeza. Con candado.', 'It is. I keep it in a box inside my head. With a padlock.', 'Oui. Je le garde dans une boîte dans ma tête. Avec un cadenas.']], 'h_b2', { aff: 1 }),
          o(['¿Y qué pasó con las estrellas?', 'And what happened to the stars?', 'Et qu\'est-il arrivé aux étoiles ?'], 'pregunta', [['Que eran lámparas de gente rica. Desilusión total. Les quité la magia… a tiros.', 'They were rich people\'s lamps. Total letdown. I took the magic out of them… with bullets.', 'C\'étaient des lampes de riches. Déception totale. Je leur ai retiré la magie… à coups de feu.']], 'h_b2'),
          o(['¿Echas de menos ser Powder?', 'Do you miss being Powder?', 'Tu regrettes d\'être Powder ?'], 'serio', [['(Se le borra la sonrisa.) Powder era un gafe. Jinx no falla. …Casi nunca.', '(Her smile vanishes.) Powder was a jinx. Jinx doesn\'t miss. …Almost never.', '(Son sourire s\'efface.) Powder portait la poisse. Jinx ne rate pas. …Presque jamais.']], 'h_b2'),
        ],
      },
      h_b2: {
        say: [['También me acuerdo de Mylo poniéndome motes y de Claggor arreglando mis cachivaches sin decir nada. El grandullón callado.', 'I also remember Mylo calling me names and Claggor fixing my gadgets without a word. The quiet big guy.', 'Je me souviens aussi de Mylo qui me donnait des surnoms et de Claggor qui réparait mes bidules sans rien dire. Le grand costaud silencieux.']],
        opts: [
          o(['¿Qué mote te ponía Mylo?', 'What did Mylo call you?', 'Quel surnom Mylo te donnait ?'], 'pregunta', [['«Gafe». Siempre «gafe». (Sonríe torcido.) Al final me lo quedé. Ya ves.', '"Jinx". Always "jinx". (Crooked smile.) In the end I kept it. See?', '« Poissarde ». Toujours. (Sourire de travers.) Au final, je l\'ai gardé. Tu vois ?']], 'h_b3'),
          o(['Claggor parece buena gente.', 'Claggor sounds like a good guy.', 'Claggor a l\'air d\'un type bien.'], 'amable', [['Lo era. Me enseñó a soldar sin quemarme las cejas. Bueno, casi.', 'He was. Taught me to weld without burning my eyebrows off. Well, almost.', 'Il l\'était. Il m\'a appris à souder sans me brûler les sourcils. Enfin, presque.']], 'h_b3', { aff: 1 }),
          o(['No pienses en eso ahora.', 'Don\'t think about that now.', 'N\'y pense pas maintenant.'], 'serio', [['Fácil decirlo. Ellos vienen solos. Siempre. Pero vale, lo intento.', 'Easy to say. They come on their own. Always. But okay, I\'ll try.', 'Facile à dire. Ils viennent tout seuls. Toujours. Mais d\'accord, j\'essaie.']], 'h_b3'),
        ],
      },
      h_b3: {
        say: [['¡Vale, se acabó el rincón triste! (Da una palmada.) Cambia la cara, que pareces Vi en un mal día.', 'Okay, sad corner\'s closed! (Claps.) Fix your face, you look like Vi on a bad day.', 'Bon, le coin triste est fermé ! (Elle tape dans ses mains.) Change de tête, on dirait Vi un mauvais jour.']],
        opts: [
          o(['¿Jugamos al juego de las bombas?', 'Shall we play the bomb game?', 'On joue au jeu des bombes ?'], 'broma', [['¡SÍ! Por fin alguien con criterio.', 'YES! Finally someone with taste.', 'OUI ! Enfin quelqu\'un qui a du goût.']], 'h_c1', { aff: 1 }),
          o(['Enséñame otra vez la pared.', 'Show me the wall again.', 'Montre-moi encore le mur.'], 'amable', [['La pared nunca se acaba. Como yo.', 'The wall never ends. Like me.', 'Le mur ne finit jamais. Comme moi.']], 'h_a1'),
          o(['Vale, empecemos de nuevo.', 'Okay, let\'s start over.', 'D\'accord, on recommence.'], 'pregunta', [['¡Reinicio! Me encantan los reinicios. Son como explosiones pero al revés.', 'Reset! I love resets. They\'re like explosions but backwards.', 'Remise à zéro ! J\'adore ça. C\'est comme une explosion, mais à l\'envers.']], 'h_raiz'),
        ],
      },
      h_c1: {
        say: [['¡Pregunta seria! Yo sería… una bomba de humo rosa. Con purpurina. Que suena a fiesta y luego ¡PUM!, nadie ve nada.', 'Serious question! I\'d be… a pink smoke bomb. With glitter. Sounds like a party and then BOOM, nobody can see a thing.', 'Question sérieuse ! Je serais… une bombe fumigène rose. Avec des paillettes. Ça sonne comme une fête et puis BOUM, personne ne voit plus rien.']],
        again: [['He cambiado de opinión: ahora sería una bomba con forma de pastel. Sorpresa doble.', 'Changed my mind: now I\'d be a cake-shaped bomb. Double surprise.', 'J\'ai changé d\'avis : maintenant, je serais une bombe en forme de gâteau. Double surprise.']],
        opts: [
          o(['¿Y yo qué bomba sería?', 'What bomb would I be?', 'Et moi, je serais quelle bombe ?'], 'pregunta', [['(Te mira de arriba abajo.) Una mina. Tranquilita, ahí quieta… hasta que alguien te pisa. Me gustas.', '(Looks you up and down.) A mine. Quiet, just sitting there… until someone steps on you. I like you.', '(Elle te regarde de haut en bas.) Une mine. Tranquille, là… jusqu\'à ce qu\'on te marche dessus. Tu me plais.']], 'h_c2', { aff: 1 }),
          o(['¿Por qué no se puede ver nada?', 'Why can\'t anybody see anything?', 'Pourquoi personne ne voit rien ?'], 'serio', [['Porque así nadie ve cómo tiemblo antes del disparo. Shh. Secreto.', 'So nobody sees me shaking before I fire. Shh. Secret.', 'Comme ça, personne ne me voit trembler avant de tirer. Chut. Secret.']], 'h_c2'),
          o(['Yo sería un petardo de feria.', 'I\'d be a fairground firecracker.', 'Moi, je serais un pétard de fête foraine.'], 'broma', [['¡Pfff! ¿Un petardito? (Se ríe tanto que se cae de la silla.) Vale, vale, eres adorable.', 'Pfff! A tiny firecracker? (Laughs so hard she falls off the chair.) Okay, okay, you\'re adorable.', 'Pfff ! Un petit pétard ? (Elle rit tellement qu\'elle tombe de sa chaise.) D\'accord, d\'accord, t\'es adorable.']], 'h_c2', { aff: 1 }),
        ],
      },
      h_c2: {
        say: [['Siguiente nivel: si pudieras volar una sola cosa de toda la ciudad, ¿cuál?', 'Next level: if you could blow up just one thing in the whole city, what would it be?', 'Niveau suivant : si tu pouvais faire sauter une seule chose dans toute la ville, ce serait quoi ?']],
        opts: [
          o(['El Consejo de Piltover.', 'The Piltover Council.', 'Le Conseil de Piltover.'], 'duro', [['Uuuh, peligroso. Me gusta cómo piensas. Demasiado. Shh, las voces están aplaudiendo.', 'Ooooh, dangerous. I like how you think. Too much. Shh, the voices are clapping.', 'Ouuuh, dangereux. J\'aime ta façon de penser. Trop. Chut, les voix applaudissent.']], 'h_c3'),
          o(['Ninguna. Prefiero construir algo.', 'Nothing. I\'d rather build something.', 'Rien. Je préfère construire quelque chose.'], 'amable', [['(Hace un puchero.) Aburrido. …Aunque construir también mola. Vale, punto para ti.', '(Pouts.) Boring. …Though building is cool too. Fine, point to you.', '(Elle fait la moue.) Ennuyeux. …Même si construire, c\'est cool aussi. Bon, un point pour toi.']], 'h_c3', { aff: 1 }),
          o(['La fábrica de Brillo.', 'The Shimmer factory.', 'L\'usine de Shimmer.'], 'astuto', [['(Se queda callada un segundo.) …Esa respuesta tiene trampa. No la voy a contestar. Siguiente.', '(Silent for a second.) …That answer\'s a trap. Not answering it. Next.', '(Silence d\'une seconde.) …Cette réponse est un piège. Je n\'y réponds pas. Suivant.']], 'h_c3'),
        ],
      },
      h_c3: {
        say: [['¡Se me ha acabado el juego! Nadie había llegado tan lejos. Toma, un premio. (Te da un tornillo.) Es muy valioso.', 'I ran out of game! Nobody\'s ever got this far. Here, a prize. (Hands you a bolt.) It\'s very valuable.', 'J\'ai plus de jeu ! Personne n\'était allé aussi loin. Tiens, un prix. (Elle te donne un boulon.) Il a beaucoup de valeur.']],
        opts: [
          o(['Lo guardaré siempre.', 'I\'ll keep it forever.', 'Je le garderai toujours.'], 'amable', [['¡Más te vale! Ahora pregúntame algo bonito, que se me ha quedado el corazón blandito.', 'You\'d better! Now ask me something nice, my heart\'s gone all soft.', 'T\'as intérêt ! Maintenant, demande-moi un truc joli, j\'ai le cœur tout mou.']], 'h_b1', { aff: 1 }),
          o(['¿Me enseñas a pintar bombas?', 'Will you teach me to paint bombs?', 'Tu m\'apprends à peindre des bombes ?'], 'broma', [['¡A la pared! Rápido, que se seca la pintura.', 'To the wall! Quick, the paint\'s drying.', 'Au mur ! Vite, la peinture sèche.']], 'h_a1'),
          o(['¿Otra ronda?', 'Another round?', 'Encore une partie ?'], 'pregunta', [['¡Siempre otra ronda! Esa es la regla número dos.', 'Always another round! That\'s rule number two.', 'Toujours une autre partie ! C\'est la règle numéro deux.']], 'h_raiz'),
        ],
      },
    },
  },
};
