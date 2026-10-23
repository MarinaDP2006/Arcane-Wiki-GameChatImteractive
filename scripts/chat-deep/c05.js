// Isha (no habla: se expresa con gestos), Maddie y Kino. Cada texto: [español, inglés, francés].
const o = (t, tone, say, go, fx) => ({ t, tone, say, go, ...(fx ? { fx } : {}) });
module.exports = {
  // ============================================================ ISHA
  isha: {
    entry: o(['Isha, ¿jugamos a hablar con gestos un buen rato?', 'Isha, want to play at talking with gestures for a good while?', 'Isha, on joue à parler avec des gestes un bon moment ?'], 'amable', null, 'h_raiz'),
    nodes: {
      h_raiz: {
        say: [['(Da un saltito, se sienta con las piernas cruzadas delante de ti y apoya la barbilla en las manos. Te escucha con todo el cuerpo.)', '(Hops, sits cross-legged in front of you and rests her chin on her hands. She listens with her whole body.)', '(Elle sautille, s\'assoit en tailleur devant toi et pose le menton sur ses mains. Elle écoute de tout son corps.)']],
        again: [['(Te ve llegar y corre a abrazarte las piernas. Luego se sienta otra vez, muy formal, esperando.)', '(Sees you coming and runs to hug your legs. Then sits again, very proper, waiting.)', '(Elle te voit arriver et court t\'enlacer les jambes. Puis elle se rassoit, très sage, en attendant.)'],
          ['(Te ofrece medio caramelo pegajoso. Es su forma de decir «hola otra vez».)', '(Offers you half a sticky sweet. It\'s her way of saying "hello again".)', '(Elle te tend un demi-bonbon collant. C\'est sa façon de dire « re-bonjour ».)']],
        opts: [
          o(['¿Me enseñas tus tesoros?', 'Will you show me your treasures?', 'Tu me montres tes trésors ?'], 'amable', null, 'h_a1'),
          o(['¿Qué te gusta de Zaun?', 'What do you like about Zaun?', 'Qu\'est-ce que tu aimes à Zaun ?'], 'pregunta', null, 'h_b1'),
          o(['¿Te enseño un juego de manos?', 'Shall I teach you a hand game?', 'Je t\'apprends un jeu de mains ?'], 'broma', null, 'h_c1'),
        ],
      },
      h_a1: {
        say: [['(Saca una caja de lata de debajo de una tabla suelta. Dentro: un botón azul, una pluma de paloma, un tornillo dorado y un trozo de cristal que brilla verde.)', '(Pulls a tin box from under a loose board. Inside: a blue button, a pigeon feather, a golden screw and a shard of glass that glows green.)', '(Elle sort une boîte en fer de sous une planche disjointe. Dedans : un bouton bleu, une plume de pigeon, une vis dorée et un éclat de verre qui brille en vert.)']],
        again: [['(La caja de tesoros tiene algo nuevo: una chapa con un mono dibujado. Te la enseña con orgullo.)', '(The treasure box has something new: a bottle cap with a monkey drawn on it. She shows you proudly.)', '(La boîte à trésors contient quelque chose de nouveau : une capsule avec un singe dessiné. Elle te la montre fièrement.)']],
        opts: [
          o(['¿De dónde sacaste el tornillo dorado?', 'Where did you get the golden screw?', 'D\'où vient la vis dorée ?'], 'pregunta', [['(Señala hacia arriba, muy arriba, hacia Piltover. Luego se lleva un dedo a los labios: secreto de ladrona.)', '(Points up, way up, toward Piltover. Then puts a finger to her lips: a thief\'s secret.)', '(Elle montre le haut, tout en haut, vers Piltover. Puis elle pose un doigt sur ses lèvres : secret de voleuse.)']], 'h_a2'),
          o(['Son los tesoros más bonitos de Zaun.', 'They\'re the prettiest treasures in Zaun.', 'Ce sont les plus beaux trésors de Zaun.'], 'amable', [['(Se pone roja de orgullo y cierra la caja con mucho cuidado, como si guardara un reino.)', '(Turns red with pride and closes the box very carefully, as if guarding a kingdom.)', '(Elle rougit de fierté et referme la boîte avec soin, comme si elle gardait un royaume.)']], 'h_a2', { aff: 1 }),
          o(['Ese cristal verde puede ser peligroso.', 'That green glass could be dangerous.', 'Cet éclat vert pourrait être dangereux.'], 'serio', [['(Frunce el ceño, lo mira, y lo envuelve en un trapo. Asiente: entendido. Pero no lo tira.)', '(Frowns, looks at it, and wraps it in a rag. Nods: understood. But she doesn\'t throw it away.)', '(Elle fronce les sourcils, le regarde, et l\'enveloppe dans un chiffon. Elle hoche la tête : compris. Mais elle ne le jette pas.)']], 'h_a2'),
        ],
      },
      h_a2: {
        say: [['(Saca el último tesoro del fondo: un dibujo muy doblado de dos figuras cogidas de la mano. Una tiene trenzas azules.)', '(Takes out the last treasure from the bottom: a heavily folded drawing of two figures holding hands. One has blue braids.)', '(Elle sort le dernier trésor du fond : un dessin plié et replié de deux silhouettes main dans la main. L\'une a des tresses bleues.)']],
        opts: [
          o(['¿Sois Jinx y tú?', 'Is that Jinx and you?', 'C\'est Jinx et toi ?'], 'pregunta', [['(Asiente muy rápido, muchas veces. Luego abraza el dibujo contra el pecho.)', '(Nods very fast, many times. Then hugs the drawing to her chest.)', '(Elle hoche la tête très vite, plein de fois. Puis serre le dessin contre sa poitrine.)']], 'h_a3', { aff: 1 }),
          o(['Es el mejor de tus tesoros.', 'It\'s the best of your treasures.', 'C\'est le plus beau de tes trésors.'], 'amable', [['(Te mira muy seria y levanta un dedo: el número uno. Sí. El mejor.)', '(Looks at you very seriously and holds up one finger: number one. Yes. The best.)', '(Elle te regarde très sérieusement et lève un doigt : numéro un. Oui. Le meilleur.)']], 'h_a3', { aff: 1 }),
          o(['¿Me dibujas a mí también?', 'Will you draw me too?', 'Tu me dessines aussi ?'], 'broma', [['(Coge un carboncillo y te dibuja con una cabeza enorme y piernas de palo. Te lo da, satisfecha.)', '(Picks up charcoal and draws you with a huge head and stick legs. Hands it to you, satisfied.)', '(Elle prend un fusain et te dessine avec une tête énorme et des jambes en bâton. Elle te le donne, satisfaite.)']], 'h_a3', { aff: 1 }),
        ],
      },
      h_a3: {
        say: [['(Guarda la caja bajo la tabla y pisa encima dos veces, como un conjuro. Luego te mira: ¿y ahora qué?)', '(Puts the box back under the board and stamps on it twice, like a spell. Then looks at you: what now?)', '(Elle range la boîte sous la planche et tape dessus deux fois du pied, comme une formule magique. Puis elle te regarde : et maintenant ?)']],
        opts: [
          o(['Enséñame tu Zaun favorito.', 'Show me your favourite Zaun.', 'Montre-moi ton Zaun préféré.'], 'pregunta', [['(Te coge de la manga y tira hacia la ventana.)', '(Grabs your sleeve and tugs you toward the window.)', '(Elle t\'attrape par la manche et te tire vers la fenêtre.)']], 'h_b1'),
          o(['¿Jugamos a algo?', 'Shall we play something?', 'On joue à quelque chose ?'], 'broma', [['(Aplaude sin hacer ruido. Sí, sí, sí.)', '(Claps without making a sound. Yes, yes, yes.)', '(Elle applaudit sans bruit. Oui, oui, oui.)']], 'h_c1', { aff: 1 }),
          o(['Volvamos a empezar, pequeña.', 'Let\'s start over, little one.', 'On recommence, petite.'], 'amable', [['(Se sienta otra vez, con las piernas cruzadas, lista.)', '(Sits down again, cross-legged, ready.)', '(Elle se rassoit en tailleur, prête.)']], 'h_raiz'),
        ],
      },
      h_b1: {
        say: [['(Señala por la ventana: las luces de neón rosas y azules que se encienden en las Galerías al anochecer. Abre mucho los ojos y las manos, como fuegos artificiales.)', '(Points out the window: the pink and blue neon lights that come on in the Lanes at dusk. Opens her eyes and hands wide, like fireworks.)', '(Elle montre la fenêtre : les néons roses et bleus qui s\'allument dans les Ruelles au crépuscule. Elle ouvre grand les yeux et les mains, comme des feux d\'artifice.)']],
        again: [['(Vuelve a señalar las luces. Esta vez cuenta con los dedos cuántas se han encendido ya.)', '(Points at the lights again. This time she counts on her fingers how many have come on.)', '(Elle montre de nouveau les lumières. Cette fois, elle compte sur ses doigts combien se sont allumées.)']],
        opts: [
          o(['Son preciosas.', 'They\'re beautiful.', 'Elles sont magnifiques.'], 'amable', [['(Asiente con la cara pegada al cristal. Su aliento dibuja una nube pequeña.)', '(Nods with her face pressed to the glass. Her breath draws a little cloud.)', '(Elle hoche la tête, le visage collé à la vitre. Son souffle dessine un petit nuage.)']], 'h_b2', { aff: 1 }),
          o(['¿Y qué es lo que no te gusta?', 'And what don\'t you like?', 'Et qu\'est-ce que tu n\'aimes pas ?'], 'serio', [['(Se tapa la nariz y la boca. Luego señala el humo verde que sube del sumidero. Hace como que tose.)', '(Covers her nose and mouth. Then points at the green smoke rising from the sump. Pretends to cough.)', '(Elle se bouche le nez et la bouche. Puis elle montre la fumée verte qui monte du puisard. Elle fait semblant de tousser.)']], 'h_b2'),
          o(['¿Te gustaría ver Piltover de cerca?', 'Would you like to see Piltover up close?', 'Tu aimerais voir Piltover de près ?'], 'pregunta', [['(Duda. Mira arriba. Mira abajo. Al final se encoge de hombros y se agarra fuerte a tu mano: solo si vienes tú.)', '(Hesitates. Looks up. Looks down. Finally shrugs and grips your hand tight: only if you come.)', '(Elle hésite. Regarde en haut. Regarde en bas. Finalement, elle hausse les épaules et serre fort ta main : seulement si tu viens.)']], 'h_b2', { aff: 1 }),
        ],
      },
      h_b2: {
        say: [['(Saca de su bolsillo una tiza y dibuja en el suelo una casa con una ventana enorme y un sol. Debajo, muchas figuritas cogidas de la mano.)', '(Takes a piece of chalk from her pocket and draws on the floor a house with a huge window and a sun. Below, lots of little figures holding hands.)', '(Elle sort une craie de sa poche et dessine par terre une maison avec une immense fenêtre et un soleil. En dessous, plein de petites silhouettes main dans la main.)']],
        opts: [
          o(['¿Esa es tu casa soñada?', 'Is that your dream house?', 'C\'est ta maison de rêve ?'], 'pregunta', [['(Asiente. Señala las figuritas una por una y luego te señala a ti. Hay sitio para ti.)', '(Nods. Points at the figures one by one and then at you. There\'s room for you.)', '(Elle hoche la tête. Elle montre les silhouettes une à une, puis toi. Il y a de la place pour toi.)']], 'h_b3', { aff: 2 }),
          o(['Le falta un perro.', 'It needs a dog.', 'Il manque un chien.'], 'broma', [['(Abre la boca, ofendida por el olvido, y dibuja un perro gigante, más grande que la casa.)', '(Opens her mouth, offended at the oversight, and draws a giant dog, bigger than the house.)', '(Elle ouvre la bouche, vexée par l\'oubli, et dessine un chien géant, plus grand que la maison.)']], 'h_b3', { aff: 1 }),
          o(['Algún día la tendrás.', 'Someday you\'ll have it.', 'Un jour, tu l\'auras.'], 'amable', [['(Te mira fijamente, como si te tomara la palabra para siempre. Luego te da la tiza a ti.)', '(Stares at you as if holding you to your word forever. Then hands the chalk to you.)', '(Elle te fixe comme si elle te prenait au mot pour toujours. Puis elle te donne la craie.)']], 'h_b3', { aff: 1 }),
        ],
      },
      h_b3: {
        say: [['(Bosteza enorme, pero niega con la cabeza muy deprisa: no tiene sueño. Nada de sueño. Ninguno.)', '(Yawns hugely, but shakes her head very fast: she\'s not sleepy. Not sleepy at all. None.)', '(Elle bâille énormément, mais secoue la tête très vite : elle n\'a pas sommeil. Pas du tout. Aucun.)']],
        opts: [
          o(['Vale, un juego más y a dormir.', 'Okay, one more game and then bed.', 'D\'accord, un dernier jeu et au lit.'], 'broma', [['(Levanta tres dedos. Negocia como una mercader de Piltover.)', '(Holds up three fingers. Haggles like a Piltover merchant.)', '(Elle lève trois doigts. Elle négocie comme une marchande de Piltover.)']], 'h_c1', { aff: 1 }),
          o(['Enséñame otra vez tus tesoros.', 'Show me your treasures again.', 'Montre-moi encore tes trésors.'], 'amable', [['(Sale disparada hacia la tabla suelta.)', '(Dashes off toward the loose board.)', '(Elle file vers la planche disjointe.)']], 'h_a1'),
          o(['Sigamos un rato, pues.', 'Let\'s keep going a while, then.', 'Continuons un moment, alors.'], 'pregunta', [['(Se frota los ojos y se sienta, muy digna.)', '(Rubs her eyes and sits down, very dignified.)', '(Elle se frotte les yeux et s\'assoit, très digne.)']], 'h_raiz'),
        ],
      },
      h_c1: {
        say: [['(Pone las manos delante, palmas arriba, esperando que le enseñes. Muy concentrada.)', '(Holds her hands out, palms up, waiting for you to teach her. Very focused.)', '(Elle tend les mains, paumes vers le haut, attendant que tu lui apprennes. Très concentrée.)']],
        again: [['(Te espera con las manos preparadas. Ya se sabe el juego de memoria y quiere ganarte.)', '(Waits for you, hands ready. She knows the game by heart now and wants to beat you.)', '(Elle t\'attend, les mains prêtes. Elle connaît le jeu par cœur maintenant et veut te battre.)']],
        opts: [
          o(['(Enseñarle a dar palmadas cruzadas.)', '(Teach her cross-clapping.)', '(Lui apprendre à taper dans les mains en croisé.)'], 'amable', [['(Se equivoca, se ríe en silencio, se equivoca otra vez… y a la quinta lo hace perfecto. Te mira triunfante.)', '(Gets it wrong, laughs silently, gets it wrong again… and on the fifth try does it perfectly. Looks at you in triumph.)', '(Elle se trompe, rit en silence, se trompe encore… et au cinquième essai, c\'est parfait. Elle te regarde, triomphante.)']], 'h_c2', { aff: 1 }),
          o(['(Hacer que una moneda desaparezca.)', '(Make a coin disappear.)', '(Faire disparaître une pièce.)'], 'astuto', [['(Te mira las manos, te mira las mangas, te mira las orejas. Al encontrar la moneda detrás de su oreja, se queda con la boca abierta.)', '(Checks your hands, your sleeves, your ears. When you find the coin behind her ear, her jaw drops.)', '(Elle regarde tes mains, tes manches, tes oreilles. Quand tu trouves la pièce derrière son oreille, elle reste bouche bée.)']], 'h_c2', { aff: 1 }),
          o(['(Hacer sombras de animales con las manos.)', '(Make animal shadows with your hands.)', '(Faire des ombres d\'animaux avec les mains.)'], 'broma', [['(Coloca un farolillo detrás de ti. Contesta a tu conejo con un monito hecho con sus dedos.)', '(Puts a little lantern behind you. Answers your rabbit with a monkey made from her fingers.)', '(Elle place une petite lanterne derrière toi. Elle répond à ton lapin avec un petit singe fait de ses doigts.)']], 'h_c2', { aff: 1 }),
        ],
      },
      h_c2: {
        say: [['(Ahora le toca a ella. Te coge las manos y te enseña su propio juego: tres toques en la palma, uno en la nariz. Muy serio. Muy importante.)', '(Now it\'s her turn. She takes your hands and teaches you her own game: three taps on the palm, one on the nose. Very serious. Very important.)', '(À son tour. Elle prend tes mains et t\'apprend son propre jeu : trois tapes dans la paume, une sur le nez. Très sérieux. Très important.)']],
        opts: [
          o(['¿Qué significa?', 'What does it mean?', 'Qu\'est-ce que ça veut dire ?'], 'pregunta', [['(Señala tu pecho, luego el suyo, y junta las manos. Algo así como «somos equipo».)', '(Points at your chest, then hers, and puts her hands together. Something like "we\'re a team".)', '(Elle montre ta poitrine, puis la sienne, et joint les mains. Quelque chose comme « on est une équipe ».)']], 'h_c3', { aff: 2 }),
          o(['(Hacerlo mal a propósito.)', '(Do it wrong on purpose.)', '(Le faire mal exprès.)'], 'broma', [['(Te corrige con paciencia infinita, como una maestra. Tres en la palma. UNO en la nariz.)', '(Corrects you with infinite patience, like a teacher. Three on the palm. ONE on the nose.)', '(Elle te corrige avec une patience infinie, comme une maîtresse. Trois dans la paume. UNE sur le nez.)']], 'h_c3', { aff: 1 }),
          o(['(Hacerlo perfecto.)', '(Do it perfectly.)', '(Le faire parfaitement.)'], 'amable', [['(Te da un apretón de manos muy formal. Has aprobado.)', '(Gives you a very formal handshake. You\'ve passed.)', '(Elle te serre la main très solennellement. Tu as réussi.)']], 'h_c3', { aff: 1 }),
        ],
      },
      h_c3: {
        say: [['(Se acurruca a tu lado y te tira de la manga: más. Quiere más de todo.)', '(Curls up beside you and tugs your sleeve: more. She wants more of everything.)', '(Elle se blottit contre toi et tire ta manche : encore. Elle veut encore de tout.)']],
        opts: [
          o(['Vale, otro juego.', 'Okay, another game.', 'D\'accord, un autre jeu.'], 'broma', [['(Aplaude en silencio, muy deprisa.)', '(Claps silently, very fast.)', '(Elle applaudit en silence, très vite.)']], 'h_c1'),
          o(['¿Me enseñas otra vez las luces?', 'Will you show me the lights again?', 'Tu me remontres les lumières ?'], 'amable', [['(Te lleva a la ventana de la mano.)', '(Leads you to the window by the hand.)', '(Elle t\'emmène à la fenêtre par la main.)']], 'h_b1'),
          o(['¿Y tus tesoros?', 'And your treasures?', 'Et tes trésors ?'], 'pregunta', [['(Ya está levantando la tabla.)', '(She\'s already lifting the board.)', '(Elle soulève déjà la planche.)']], 'h_a1'),
        ],
      },
    },
  },

  // ============================================================ MADDIE
  maddie: {
    entry: o(['Maddie, ¿un descanso largo y charlamos?', 'Maddie, a long break and a chat?', 'Maddie, une longue pause pour discuter ?'], 'amable', null, 'h_raiz'),
    nodes: {
      h_raiz: {
        say: [['(Mira a ambos lados del pasillo antes de sentarse.) Un descanso largo… La capitana no tiene por qué enterarse. Adelante.', '(Glances both ways down the corridor before sitting.) A long break… The captain doesn\'t need to know. Go ahead.', '(Elle regarde des deux côtés du couloir avant de s\'asseoir.) Une longue pause… La capitaine n\'a pas besoin de le savoir. Vas-y.']],
        again: [['Has vuelto. Empiezo a pensar que vienes a verme a mí y no a los informes.', 'You\'re back. I\'m starting to think you come to see me, not the reports.', 'Te revoilà. Je commence à croire que tu viens me voir, moi, et pas les rapports.'],
          ['(Te ofrece una taza de café del cuartel. Huele a quemado.) Lo siento, es lo que hay. ¿De qué hablamos?', '(Offers you a cup of barracks coffee. It smells burnt.) Sorry, it\'s what we\'ve got. What shall we talk about?', '(Elle te tend une tasse de café de caserne. Ça sent le brûlé.) Désolée, c\'est tout ce qu\'on a. On parle de quoi ?']],
        opts: [
          o(['¿Por qué te hiciste ejecutora?', 'Why did you become an enforcer?', 'Pourquoi es-tu devenue exécutrice ?'], 'pregunta', null, 'h_a1'),
          o(['¿Qué haces fuera de servicio?', 'What do you do off duty?', 'Que fais-tu en dehors du service ?'], 'broma', null, 'h_b1'),
          o(['¿En quién confías aquí?', 'Who do you trust here?', 'En qui as-tu confiance ici ?'], 'serio', null, 'h_c1'),
        ],
      },
      h_a1: {
        say: [['(Sonríe, quizá demasiado rápido.) Por servir a la ciudad, claro. Y porque el uniforme me sienta bien. Eso también cuenta.', '(Smiles, perhaps a little too quickly.) To serve the city, of course. And because the uniform suits me. That counts too.', '(Elle sourit, peut-être un peu trop vite.) Pour servir la ville, bien sûr. Et parce que l\'uniforme me va bien. Ça compte aussi.']],
        again: [['La misma respuesta de siempre: servir a la ciudad. (Remueve el café sin mirarte.)', 'The same answer as always: to serve the city. (Stirs her coffee without looking at you.)', 'La même réponse que d\'habitude : servir la ville. (Elle remue son café sans te regarder.)']],
        opts: [
          o(['Te sienta bien, es verdad.', 'It does suit you, it\'s true.', 'Il te va bien, c\'est vrai.'], 'coqueto', [['(Se ríe y se arregla el pelo.) Lo sé. Pero gracias por decirlo.', '(Laughs and tucks her hair back.) I know. But thanks for saying it.', '(Elle rit et replace ses cheveux.) Je sais. Mais merci de le dire.']], 'h_a2', { aff: 1 }),
          o(['Esa respuesta suena ensayada.', 'That answer sounds rehearsed.', 'Cette réponse semble répétée.'], 'astuto', [['(Un segundo de silencio.) Todas las respuestas en este edificio suenan ensayadas. Es un cuartel, no un teatro… o eso dicen.', '(A second of silence.) Every answer in this building sounds rehearsed. It\'s a barracks, not a theatre… or so they say.', '(Une seconde de silence.) Toutes les réponses dans ce bâtiment semblent répétées. C\'est une caserne, pas un théâtre… à ce qu\'on dit.']], 'h_a2', { stats: { ingenio: 1 } }),
          o(['¿Y de dónde eres?', 'And where are you from?', 'Et tu viens d\'où ?'], 'pregunta', [['De aquí y de allá. Viajé mucho de pequeña. Al final, el hogar es donde te pagan, ¿no?', 'Here and there. I travelled a lot as a child. In the end, home is where you get paid, isn\'t it?', 'D\'ici et de là. J\'ai beaucoup voyagé petite. Au final, chez soi, c\'est là où on est payé, non ?']], 'h_a2'),
        ],
      },
      h_a2: {
        say: [['Lo que me gusta de verdad es observar. La gente revela tanto con un gesto… Caitlyn, por ejemplo, se toca el guante cuando miente. No se lo digas.', 'What I really like is observing. People reveal so much with a gesture… Caitlyn, for instance, touches her glove when she lies. Don\'t tell her.', 'Ce que j\'aime vraiment, c\'est observer. Les gens révèlent tant par un geste… Caitlyn, par exemple, touche son gant quand elle ment. Ne le lui dis pas.']],
        opts: [
          o(['¿Y yo qué hago cuando miento?', 'And what do I do when I lie?', 'Et moi, je fais quoi quand je mens ?'], 'broma', [['(Te estudia.) Aún no te he pillado. Eso, o mientes muy bien. Las dos opciones me interesan.', '(Studies you.) Haven\'t caught you yet. Either that, or you lie very well. Both options interest me.', '(Elle t\'étudie.) Je ne t\'ai pas encore pris{g:|e|·e}. Soit ça, soit tu mens très bien. Les deux options m\'intéressent.']], 'h_a3', { aff: 1 }),
          o(['Observas mucho a la capitana.', 'You watch the captain a lot.', 'Tu observes beaucoup la capitaine.'], 'astuto', [['(Se le escapa una sonrisa.) Es mi trabajo cuidarla. Y es fácil de mirar. Ambas cosas son ciertas.', '(A smile slips out.) It\'s my job to look after her. And she\'s easy to look at. Both are true.', '(Un sourire lui échappe.) C\'est mon travail de veiller sur elle. Et elle est agréable à regarder. Les deux sont vrais.']], 'h_a3'),
          o(['Eso es un poco inquietante.', 'That\'s a bit unsettling.', 'C\'est un peu inquiétant.'], 'serio', [['Solo si tienes algo que esconder. ¿Lo tienes?', 'Only if you have something to hide. Do you?', 'Seulement si tu as quelque chose à cacher. C\'est le cas ?']], 'h_a3'),
        ],
      },
      h_a3: {
        say: [['Bueno, basta de hablar de trabajo. Me estoy aburriendo yo misma.', 'Well, enough talking shop. I\'m boring myself.', 'Bon, assez parlé boulot. Je m\'ennuie moi-même.']],
        opts: [
          o(['¿Qué haces cuando no trabajas?', 'What do you do when you\'re not working?', 'Que fais-tu quand tu ne travailles pas ?'], 'broma', [['Uy, eso es más interesante.', 'Ooh, that\'s more interesting.', 'Oh, c\'est plus intéressant.']], 'h_b1'),
          o(['¿En quién confías tú?', 'Who do you trust?', 'En qui as-tu confiance ?'], 'serio', [['Pregunta seria. Vale.', 'Serious question. Fine.', 'Question sérieuse. D\'accord.']], 'h_c1'),
          o(['Volvamos al principio.', 'Let\'s go back to the start.', 'Revenons au début.'], 'amable', [['Como en un buen interrogatorio.', 'Like a good interrogation.', 'Comme dans un bon interrogatoire.']], 'h_raiz'),
        ],
      },
      h_b1: {
        say: [['Bailo. En un local de la Avenida de los Progresistas donde nadie lleva uniforme. Allí soy solo Maddie. O quien quiera ser esa noche.', 'I dance. At a place on Progress Avenue where nobody wears a uniform. There I\'m just Maddie. Or whoever I want to be that night.', 'Je danse. Dans un endroit de l\'avenue du Progrès où personne ne porte d\'uniforme. Là-bas, je suis juste Maddie. Ou qui je veux être ce soir-là.']],
        again: [['Sigo yendo a bailar. El local cambia de nombre cada mes. Me encanta eso.', 'I still go dancing. The place changes its name every month. I love that.', 'Je vais toujours danser. L\'endroit change de nom chaque mois. J\'adore ça.']],
        opts: [
          o(['¿Me llevarías?', 'Would you take me?', 'Tu m\'emmènerais ?'], 'coqueto', [['¿Sabes bailar? No importa. Allí nadie sabe. Esa es la gracia.', 'Can you dance? Doesn\'t matter. Nobody there can. That\'s the fun of it.', 'Tu sais danser ? Peu importe. Là-bas, personne ne sait. C\'est tout l\'intérêt.']], 'h_b2', { aff: 1 }),
          o(['¿«Quien quieras ser»?', '"Whoever you want to be"?', '« Qui tu veux être » ?'], 'astuto', [['(Ríe.) Una forma de hablar. Todos somos un poco actores, ¿no crees?', '(Laughs.) A figure of speech. We\'re all a bit of an actor, don\'t you think?', '(Elle rit.) Une façon de parler. On est tous un peu acteurs, tu ne crois pas ?']], 'h_b2'),
          o(['No te imagino bailando.', 'I can\'t picture you dancing.', 'Je ne t\'imagine pas danser.'], 'broma', [['Esa es la idea. Si me imaginaras, no sería divertido.', 'That\'s the idea. If you could picture it, it wouldn\'t be fun.', 'C\'est l\'idée. Si tu m\'imaginais, ce ne serait pas drôle.']], 'h_b2'),
        ],
      },
      h_b2: {
        say: [['También leo novelas de espías. Las compro en un puesto del puerto. Las tapas son horribles y las historias, mejores que la vida.', 'I also read spy novels. I buy them at a stall by the docks. The covers are awful and the stories are better than life.', 'Je lis aussi des romans d\'espionnage. Je les achète à un étal du port. Les couvertures sont horribles et les histoires, meilleures que la vie.']],
        opts: [
          o(['¿Te gustaría ser espía?', 'Would you like to be a spy?', 'Tu aimerais être espionne ?'], 'astuto', [['(Te mira por encima del café, sin parpadear.) Qué pregunta tan curiosa. No. Demasiado papeleo.', '(Looks at you over her coffee, unblinking.) What a curious question. No. Too much paperwork.', '(Elle te regarde par-dessus son café, sans ciller.) Quelle drôle de question. Non. Trop de paperasse.']], 'h_b3', { stats: { ingenio: 1 } }),
          o(['Préstame una.', 'Lend me one.', 'Prête-m\'en un.'], 'amable', [['Te dejo mi favorita: «La rosa en la sombra». Cuidado, el final es… sorprendente.', 'I\'ll lend you my favourite: "The Rose in Shadow". Careful, the ending is… surprising.', 'Je te prête mon préféré : « La Rose dans l\'ombre ». Attention, la fin est… surprenante.']], 'h_b3', { aff: 1 }),
          o(['Las tapas horribles son las mejores.', 'The awful covers are the best ones.', 'Les couvertures horribles sont les meilleures.'], 'broma', [['¡Por fin alguien que lo entiende! Cuanto peor la tapa, mejor el asesinato.', 'Finally someone who gets it! The worse the cover, the better the murder.', 'Enfin quelqu\'un qui comprend ! Plus la couverture est moche, meilleur est le meurtre.']], 'h_b3', { aff: 1 }),
        ],
      },
      h_b3: {
        say: [['(Mira el reloj de la pared.) Debería volver antes de que la capitana me eche de menos. O no.', '(Glances at the wall clock.) I should get back before the captain misses me. Or not.', '(Elle regarde l\'horloge murale.) Je devrais y retourner avant que la capitaine ne remarque mon absence. Ou pas.']],
        opts: [
          o(['Quédate un rato más.', 'Stay a bit longer.', 'Reste encore un peu.'], 'amable', [['Vale. Pero si pregunta, estábamos revisando informes.', 'Fine. But if she asks, we were reviewing reports.', 'D\'accord. Mais si elle demande, on révisait des rapports.']], 'h_c1', { aff: 1 }),
          o(['¿Por qué te hiciste ejecutora, de verdad?', 'Why did you really become an enforcer?', 'Pourquoi es-tu vraiment devenue exécutrice ?'], 'astuto', [['Insistes. Bien. Volvamos a eso.', 'You insist. Fine. Let\'s go back to that.', 'Tu insistes. Bien. Revenons-y.']], 'h_a1'),
          o(['Cambiemos de tema.', 'Let\'s change topics.', 'Changeons de sujet.'], 'pregunta', [['Me parece perfecto.', 'Works for me.', 'Ça me va très bien.']], 'h_raiz'),
        ],
      },
      h_c1: {
        say: [['(Baja la voz.) En la capitana. Y en mí misma, casi siempre. El resto del cuartel… digamos que llevo una lista.', '(Lowers her voice.) The captain. And myself, most of the time. The rest of the barracks… let\'s say I keep a list.', '(Elle baisse la voix.) La capitaine. Et moi-même, la plupart du temps. Le reste de la caserne… disons que je tiens une liste.']],
        again: [['La lista ha cambiado un poco. Tú has subido unos puestos.', 'The list has changed a bit. You\'ve moved up a few places.', 'La liste a un peu changé. Tu es monté{g:|e|·e} de quelques places.']],
        opts: [
          o(['¿Y yo en qué lista estoy?', 'And which list am I on?', 'Et moi, je suis sur quelle liste ?'], 'coqueto', [['En la de «personas interesantes». Es una lista corta. Siéntete halagad{g:o|a|e}.', 'On the "interesting people" list. It\'s a short list. Be flattered.', 'Sur celle des « gens intéressants ». C\'est une liste courte. Sois flatté{g:|e|·e}.']], 'h_c2', { aff: 1 }),
          o(['¿Por qué no confías en los demás?', 'Why don\'t you trust the others?', 'Pourquoi tu ne fais pas confiance aux autres ?'], 'pregunta', [['Porque algunos cobran de dos sitios. En Piltover, la lealtad tiene precio. Y alguien siempre paga más.', 'Because some get paid by two masters. In Piltover, loyalty has a price. And someone always pays more.', 'Parce que certains sont payés par deux maîtres. À Piltover, la loyauté a un prix. Et quelqu\'un paie toujours plus.']], 'h_c2'),
          o(['Pareces saber mucho de traiciones.', 'You seem to know a lot about betrayal.', 'Tu sembles en savoir long sur la trahison.'], 'astuto', [['(Un brillo raro en los ojos.) He leído muchas novelas de espías, ¿recuerdas?', '(A strange glint in her eyes.) I\'ve read a lot of spy novels, remember?', '(Une lueur étrange dans les yeux.) J\'ai lu beaucoup de romans d\'espionnage, tu te souviens ?']], 'h_c2', { stats: { ingenio: 1 } }),
        ],
      },
      h_c2: {
        say: [['A veces pienso que todos llevamos dos uniformes. El que se ve y el que no.', 'Sometimes I think we all wear two uniforms. The one you see and the one you don\'t.', 'Parfois je pense qu\'on porte tous deux uniformes. Celui qu\'on voit et celui qu\'on ne voit pas.']],
        opts: [
          o(['¿Cuál es tu segundo uniforme?', 'What\'s your second uniform?', 'Quel est ton deuxième uniforme ?'], 'astuto', [['(Sonríe, dulce.) El de bailarina, por supuesto. ¿Cuál iba a ser?', '(Smiles sweetly.) The dancer\'s, of course. What else would it be?', '(Elle sourit, douce.) Celui de danseuse, bien sûr. Lequel d\'autre ?']], 'h_c3'),
          o(['El mío es el de persona curiosa.', 'Mine is the curious-person one.', 'Le mien, c\'est celui de la personne curieuse.'], 'broma', [['Ese no lo escondes nada bien.', 'You don\'t hide that one well at all.', 'Celui-là, tu ne le caches pas du tout.']], 'h_c3', { aff: 1 }),
          o(['Yo solo llevo uno.', 'I only wear one.', 'Je n\'en porte qu\'un.'], 'serio', [['Entonces eres de las personas más raras de esta ciudad. Y de las más vulnerables. Ten cuidado.', 'Then you\'re one of the rarest people in this city. And one of the most vulnerable. Be careful.', 'Alors tu es l\'une des personnes les plus rares de cette ville. Et l\'une des plus vulnérables. Fais attention.']], 'h_c3', { aff: 1 }),
        ],
      },
      h_c3: {
        say: [['Uf, qué intensos nos hemos puesto. Necesito más café quemado.', 'Phew, we\'ve got intense. I need more burnt coffee.', 'Ouf, on est devenus intenses. J\'ai besoin de plus de café brûlé.']],
        opts: [
          o(['Hablemos de bailar.', 'Let\'s talk about dancing.', 'Parlons de danse.'], 'broma', [['¡Eso sí!', 'Now you\'re talking!', 'Ça, oui !']], 'h_b1', { aff: 1 }),
          o(['¿Y lo de ser ejecutora?', 'And the enforcer thing?', 'Et cette histoire d\'exécutrice ?'], 'pregunta', [['Vuelves a eso. Muy observador{g:|a|e}.', 'You come back to that. Very observant.', 'Tu y reviens. Très observateur{g:|rice|·rice}.']], 'h_a1'),
          o(['Te invito a otro café.', 'I\'ll get you another coffee.', 'Je t\'offre un autre café.'], 'amable', [['Del bueno, de la cafetería de arriba. Trato hecho.', 'The good stuff, from the café upstairs. Deal.', 'Du bon, du café d\'en haut. Marché conclu.']], 'h_raiz'),
        ],
      },
    },
  },

  // ============================================================ KINO
  kino: {
    entry: o(['Kino, ¿hablamos largo y tendido?', 'Kino, shall we have a long talk?', 'Kino, on parle longuement ?'], 'astuto', null, 'h_raiz'),
    nodes: {
      h_raiz: {
        say: [['(Sonríe con una calma que no encaja con las cadenas.) Largo y tendido. Me gusta. Aquí abajo el tiempo es lo único que sobra.', '(Smiles with a calm that doesn\'t fit the chains.) A long talk. I like it. Down here, time is the only thing in abundance.', '(Il sourit avec un calme qui ne va pas avec les chaînes.) Longuement. J\'aime ça. Ici-bas, le temps est la seule chose qui ne manque pas.']],
        again: [['Vuelves. Todos vuelven, tarde o temprano. ¿Por dónde íbamos?', 'You return. Everyone returns, sooner or later. Where were we?', 'Tu reviens. Tout le monde revient, tôt ou tard. Où en étions-nous ?'],
          ['(Ladea la cabeza, como si te viera por primera vez y a la vez te conociera de siempre.) Siéntate. Te esperaba.', '(Tilts his head, as if seeing you for the first time and knowing you forever.) Sit. I was expecting you.', '(Il penche la tête, comme s\'il te voyait pour la première fois et te connaissait depuis toujours.) Assieds-toi. Je t\'attendais.']],
        opts: [
          o(['Háblame de cuando Mel y tú erais niños.', 'Tell me about when you and Mel were children.', 'Parle-moi de quand Mel et toi étiez enfants.'], 'amable', null, 'h_a1'),
          o(['¿Qué piensas de las máscaras?', 'What do you think of masks?', 'Que penses-tu des masques ?'], 'astuto', null, 'h_b1'),
          o(['¿Cómo aguantas aquí encerrado?', 'How do you bear being locked up here?', 'Comment tu tiens, enfermé ici ?'], 'serio', null, 'h_c1'),
        ],
      },
      h_a1: {
        say: [['Mel pintaba. Yo la miraba pintar. Ella pensaba que era el hermano protector. Yo solo quería aprender cómo se crea una cara de la nada.', 'Mel painted. I watched her paint. She thought I was the protective brother. I only wanted to learn how a face is made from nothing.', 'Mel peignait. Je la regardais peindre. Elle pensait que j\'étais le frère protecteur. Moi, je voulais juste apprendre comment on crée un visage à partir de rien.']],
        again: [['¿Más recuerdos de Mel? Tengo muchos. Algunos, incluso, son míos.', 'More memories of Mel? I have many. Some of them are even mine.', 'Encore des souvenirs de Mel ? J\'en ai beaucoup. Certains sont même les miens.']],
        opts: [
          o(['¿Una cara de la nada?', 'A face from nothing?', 'Un visage à partir de rien ?'], 'pregunta', [['Una forma de hablar. Pinceladas, sombras… y de pronto alguien te mira desde el lienzo. Fascinante, ¿no?', 'A figure of speech. Brushstrokes, shadows… and suddenly someone is looking at you from the canvas. Fascinating, isn\'t it?', 'Une façon de parler. Des coups de pinceau, des ombres… et soudain quelqu\'un te regarde depuis la toile. Fascinant, non ?']], 'h_a2'),
          o(['Mel te quiere mucho.', 'Mel loves you dearly.', 'Mel t\'aime beaucoup.'], 'amable', [['(Algo cruza su mirada, rápido como una sombra.) Lo sé. Es su mayor virtud. Y su mayor punto débil.', '(Something crosses his eyes, quick as a shadow.) I know. It\'s her greatest virtue. And her greatest weakness.', '(Quelque chose traverse son regard, rapide comme une ombre.) Je sais. C\'est sa plus grande vertu. Et sa plus grande faiblesse.']], 'h_a2'),
          o(['No pareces muy protector.', 'You don\'t seem very protective.', 'Tu n\'as pas l\'air très protecteur.'], 'duro', [['(Ríe suavemente.) Protejo lo que me interesa. Como todo buen Medarda.', '(Laughs softly.) I protect what interests me. Like any good Medarda.', '(Il rit doucement.) Je protège ce qui m\'intéresse. Comme tout bon Medarda.']], 'h_a2'),
        ],
      },
      h_a2: {
        say: [['¿Sabes qué recuerdo mejor de aquellos años? La rosa del jardín de nuestra madre. Negra. La única de su especie. Nadie sabía de dónde había salido.', 'You know what I remember best from those years? The rose in our mother\'s garden. Black. The only one of its kind. Nobody knew where it came from.', 'Tu sais ce dont je me souviens le mieux de ces années ? La rose du jardin de notre mère. Noire. La seule de son espèce. Personne ne savait d\'où elle venait.']],
        opts: [
          o(['¿Una rosa negra?', 'A black rose?', 'Une rose noire ?'], 'astuto', [['(Sonríe.) Las rosas negras crecen en los sitios más inesperados. Incluso en los consejos de las ciudades.', '(Smiles.) Black roses grow in the most unexpected places. Even on city councils.', '(Il sourit.) Les roses noires poussent aux endroits les plus inattendus. Même dans les conseils des villes.']], 'h_a3', { stats: { ingenio: 1 } }),
          o(['Suena bonito.', 'Sounds lovely.', 'Ça a l\'air joli.'], 'amable', [['Bonito y venenoso. Las mejores cosas suelen serlo.', 'Lovely and poisonous. The best things usually are.', 'Joli et vénéneux. Les meilleures choses le sont souvent.']], 'h_a3'),
          o(['No recuerdo que Mel hablara de esa rosa.', 'I don\'t remember Mel mentioning that rose.', 'Je ne me souviens pas que Mel ait parlé de cette rose.'], 'serio', [['(Una pausa demasiado larga.) Mel no se fijaba en el jardín. Yo sí.', '(A pause too long.) Mel never paid attention to the garden. I did.', '(Une pause trop longue.) Mel ne faisait pas attention au jardin. Moi, si.']], 'h_a3'),
        ],
      },
      h_a3: {
        say: [['Basta de jardines. Me pones nostálgico, y la nostalgia aquí abajo es peligrosa.', 'Enough about gardens. You make me nostalgic, and nostalgia down here is dangerous.', 'Assez de jardins. Tu me rends nostalgique, et la nostalgie ici-bas est dangereuse.']],
        opts: [
          o(['Hablemos de máscaras, entonces.', 'Let\'s talk about masks, then.', 'Parlons de masques, alors.'], 'astuto', [['Ah. Mi tema favorito.', 'Ah. My favourite subject.', 'Ah. Mon sujet préféré.']], 'h_b1', { aff: 1 }),
          o(['¿Cómo soportas estar aquí?', 'How do you stand being here?', 'Comment tu supportes d\'être ici ?'], 'serio', [['Con mucha imaginación.', 'With a great deal of imagination.', 'Avec beaucoup d\'imagination.']], 'h_c1'),
          o(['Empecemos otra vez.', 'Let\'s begin again.', 'Recommençons encore.'], 'pregunta', [['Cada comienzo es una máscara nueva.', 'Every beginning is a new mask.', 'Chaque commencement est un nouveau masque.']], 'h_raiz'),
        ],
      },
      h_b1: {
        say: [['Que todo el mundo lleva una. La diferencia es que algunos olvidan que se la han puesto.', 'That everyone wears one. The difference is that some forget they put it on.', 'Que tout le monde en porte un. La différence, c\'est que certains oublient qu\'ils l\'ont mis.']],
        again: [['Las máscaras otra vez. Sabía que volverías a ellas. Todos vuelven.', 'Masks again. I knew you\'d come back to them. Everyone does.', 'Les masques encore. Je savais que tu y reviendrais. Tout le monde y revient.']],
        opts: [
          o(['¿Y tú llevas una?', 'And do you wear one?', 'Et toi, tu en portes un ?'], 'astuto', [['(Sonríe muy despacio.) Ahora mismo, querrás decir. Sí. Una muy buena.', '(Smiles very slowly.) Right now, you mean. Yes. A very good one.', '(Il sourit très lentement.) En ce moment, tu veux dire. Oui. Un très bon.']], 'h_b2', { stats: { ingenio: 1 } }),
          o(['Yo no llevo ninguna.', 'I don\'t wear one.', 'Je n\'en porte aucun.'], 'serio', [['Entonces llevas la más difícil: la de quien cree no llevarla.', 'Then you wear the hardest one of all: the one worn by those who believe they wear none.', 'Alors tu portes le plus difficile : celui de qui croit ne pas en porter.']], 'h_b2'),
          o(['Das un poco de miedo, ¿sabes?', 'You\'re a little scary, you know?', 'Tu fais un peu peur, tu sais ?'], 'broma', [['(Ríe con elegancia.) Solo un poco. Es un halago. Gracias.', '(Laughs elegantly.) Only a little. That\'s a compliment. Thank you.', '(Il rit avec élégance.) Juste un peu. C\'est un compliment. Merci.']], 'h_b2'),
        ],
      },
      h_b2: {
        say: [['En Noxus aprendes pronto: el que muestra su cara de verdad es el primero en perderla.', 'In Noxus you learn early: whoever shows their true face is the first to lose it.', 'À Noxus, on apprend vite : celui qui montre son vrai visage est le premier à le perdre.']],
        opts: [
          o(['¿Y cuál es tu cara de verdad, Kino?', 'And what is your true face, Kino?', 'Et quel est ton vrai visage, Kino ?'], 'astuto', [['(Te mira sin pestañear un buen rato.) Pregunta equivocada. La correcta sería: ¿soy Kino?', '(Looks at you without blinking for a long time.) Wrong question. The right one would be: am I Kino?', '(Il te regarde longtemps sans ciller.) Mauvaise question. La bonne serait : suis-je Kino ?']], 'h_b3', { stats: { ingenio: 1 } }),
          o(['Eso es muy triste.', 'That\'s very sad.', 'C\'est très triste.'], 'amable', [['Triste es no tener ninguna cara que proteger. Yo tengo muchas.', 'Sad is having no face to protect. I have many.', 'Triste, c\'est n\'avoir aucun visage à protéger. Moi, j\'en ai beaucoup.']], 'h_b3'),
          o(['Piltover no es Noxus.', 'Piltover isn\'t Noxus.', 'Piltover n\'est pas Noxus.'], 'duro', [['Todavía no.', 'Not yet.', 'Pas encore.']], 'h_b3'),
        ],
      },
      h_b3: {
        say: [['(Se recuesta contra la pared, satisfecho.) Me gustas. Haces las preguntas incómodas. Pocos se atreven.', '(Leans back against the wall, satisfied.) I like you. You ask the uncomfortable questions. Few dare.', '(Il s\'adosse au mur, satisfait.) Tu me plais. Tu poses les questions dérangeantes. Peu osent.']],
        opts: [
          o(['Háblame de Mel otra vez.', 'Tell me about Mel again.', 'Parle-moi encore de Mel.'], 'amable', [['Mi querida hermana. Claro.', 'My dear sister. Of course.', 'Ma chère sœur. Bien sûr.']], 'h_a1'),
          o(['¿Cómo aguantas el encierro?', 'How do you endure confinement?', 'Comment tu supportes l\'enfermement ?'], 'serio', [['Bien. Escucha.', 'Good. Listen.', 'Bien. Écoute.']], 'h_c1'),
          o(['Me voy a quitar la máscara un rato.', 'I\'m going to take my mask off for a while.', 'Je vais enlever mon masque un moment.'], 'broma', [['(Ríe.) Hazlo. Y empecemos de nuevo.', '(Laughs.) Do. And let\'s begin again.', '(Il rit.) Fais-le. Et recommençons.']], 'h_raiz'),
        ],
      },
      h_c1: {
        say: [['Imaginando. Hoy he imaginado que estaba en un salón de baile de Piltover. Ayer, en el Consejo. Mañana… quién sabe. Quizá sea tú.', 'Imagining. Today I imagined I was in a Piltover ballroom. Yesterday, on the Council. Tomorrow… who knows. Perhaps I\'ll be you.', 'En imaginant. Aujourd\'hui, j\'ai imaginé que j\'étais dans une salle de bal de Piltover. Hier, au Conseil. Demain… qui sait. Peut-être que je serai toi.']],
        again: [['Hoy he imaginado otra cosa. Pero eso no te lo cuento. Aún.', 'Today I imagined something else. But I won\'t tell you that. Yet.', 'Aujourd\'hui, j\'ai imaginé autre chose. Mais ça, je ne te le dis pas. Pas encore.']],
        opts: [
          o(['¿Ser yo? Eso da escalofríos.', 'Be me? That gives me chills.', 'Être moi ? Ça donne des frissons.'], 'serio', [['(Ríe suavemente.) Es solo un juego de la mente. ¿O no?', '(Laughs softly.) Just a game of the mind. Or is it?', '(Il rit doucement.) Juste un jeu de l\'esprit. Ou pas ?']], 'h_c2'),
          o(['¿Y en el Consejo qué hacías?', 'And what were you doing on the Council?', 'Et que faisais-tu au Conseil ?'], 'astuto', [['Escuchar. Los consejeros hablan mucho cuando creen que nadie importante les oye.', 'Listening. Councillors talk a great deal when they think no one important can hear.', 'J\'écoutais. Les conseillers parlent beaucoup quand ils croient que personne d\'important ne les entend.']], 'h_c2', { stats: { ingenio: 1 } }),
          o(['Debe de ser muy solitario.', 'It must be very lonely.', 'Ça doit être très solitaire.'], 'amable', [['(Por un instante, su sonrisa parece de verdad.) A veces. Gracias por notarlo.', '(For an instant, his smile looks real.) Sometimes. Thank you for noticing.', '(Un instant, son sourire semble sincère.) Parfois. Merci de l\'avoir remarqué.']], 'h_c2', { aff: 1 }),
        ],
      },
      h_c2: {
        say: [['Algún día saldré de aquí. Y cuando lo haga, me acordaré de quién vino a hablar conmigo. Para bien.', 'Someday I\'ll get out of here. And when I do, I\'ll remember who came to talk with me. For better.', 'Un jour, je sortirai d\'ici. Et quand ce sera le cas, je me souviendrai de qui est venu me parler. En bien.']],
        opts: [
          o(['¿Eso es una promesa o una amenaza?', 'Is that a promise or a threat?', 'C\'est une promesse ou une menace ?'], 'astuto', [['Sí.', 'Yes.', 'Oui.']], 'h_c3', { stats: { ingenio: 1 } }),
          o(['Me alegra haber venido.', 'I\'m glad I came.', 'Je suis content{g:|e|·e} d\'être venu{g:|e|·e}.'], 'amable', [['A mí también. Más de lo que imaginas.', 'So am I. More than you can imagine.', 'Moi aussi. Plus que tu ne l\'imagines.']], 'h_c3', { aff: 1 }),
          o(['Yo no te sacaría de aquí.', 'I wouldn\'t get you out of here.', 'Je ne te sortirais pas d\'ici.'], 'duro', [['(Sonríe sin enfadarse.) No te lo he pedido. Todavía.', '(Smiles, not angry at all.) I haven\'t asked you. Yet.', '(Il sourit sans s\'énerver.) Je ne te l\'ai pas demandé. Pas encore.']], 'h_c3'),
        ],
      },
      h_c3: {
        say: [['Me entretienes. Es lo más bonito que puedo decirle a alguien.', 'You entertain me. It\'s the nicest thing I can say to anyone.', 'Tu me divertis. C\'est la plus belle chose que je puisse dire à quelqu\'un.']],
        opts: [
          o(['Cuéntame más de las máscaras.', 'Tell me more about masks.', 'Parle-moi encore des masques.'], 'astuto', [['Con placer.', 'With pleasure.', 'Avec plaisir.']], 'h_b1'),
          o(['Y la infancia con Mel, ¿qué más?', 'And childhood with Mel, what else?', 'Et l\'enfance avec Mel, quoi d\'autre ?'], 'amable', [['Hay tanto que contar…', 'There\'s so much to tell…', 'Il y a tant à raconter…']], 'h_a1'),
          o(['Otra ronda de preguntas.', 'Another round of questions.', 'Un autre tour de questions.'], 'pregunta', [['Siempre.', 'Always.', 'Toujours.']], 'h_raiz'),
        ],
      },
    },
  },
};
