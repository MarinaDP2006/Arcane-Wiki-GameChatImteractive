// Nuevos temas del comunicador que recuerdan las decisiones de la campaña ampliada.
// Se cargan después de chat.js y ofrecen respuestas escritas incluso con IA desactivada.
(function () {
  const CHAT = window.CHAT;
  if (!CHAT || CHAT.expansionV2) return;
  // Introduce una conversación reactiva sin modificar ni repetir temas anteriores.
  function topic(id, option) {
    if (!CHAT[id]) return;
    CHAT[id].hub.push(option);
  }

  topic('vi', { t: 'Sobre mi nombre en la lista de vigilancia…', tone: 'serio',
    req: { flag: 'testigos_protegidos' }, once: true, fx: { aff: 1 },
    say: ['(Se queda mirando tu mano.) Quemaste el papel. No los nombres. Eso es lo que me da miedo.',
      'Mira, no pienso decirte cómo vivir. Pero si vienen a por ti, no vas a enfrentarte a ellos sin alguien a tu lado.'] });
  topic('vi', { t: 'Quería acompañarte, no arreglarte la vida.', tone: 'amable',
    req: { flag: 'acompanaste_vi' }, once: true, fx: { aff: 2 },
    say: ['(Exhala lentamente.) Bien. Porque no hay nada que arreglar en cinco minutos.',
      'Puedes quedarte un rato. Sin hablar también vale.'] });
  topic('jinx', { t: '¿Y si construimos algo que no explote?', tone: 'astuto',
    req: { stat: 'ingenio', min: 2 }, once: true, fx: { aff: 1 },
    say: ['(Entorna los ojos.) ¿Y perderme la parte divertida? ... ¿Algo para limpiar el aire de los críos?',
      'No mires así. También sé construir cosas útiles. Solo que nadie suele preguntarlo.'] });
  topic('caitlyn', { t: 'Aceptaste investigar aquella lista. ¿Te arrepientes?', tone: 'serio',
    req: { flag: 'lista_investigada' }, once: true, fx: { aff: 1 },
    say: ['Me arrepiento de no haber preguntado antes cómo se escribieron esos nombres.',
      'Hay informes que pueden destruir carreras. Lo preocupante es que algunos puedan destruir vidas.'] });
  topic('caitlyn', { t: 'Gracias por priorizar la evacuación.', tone: 'amable',
    req: { flag: 'evacuacion_previa' }, once: true, fx: { aff: 2 },
    say: ['No fue una elección noble. Fue la única orden que podría defender mirando a esa gente a los ojos.',
      '(Baja la mirada un instante.) Antes quizá habría pensado otra cosa.'] });
  topic('ekko', { t: '¿Llegaron los filtros a todas las familias?', tone: 'pregunta',
    req: { flag: 'filtros_luciernagas' }, once: true, fx: { aff: 2 },
    say: ['No a todas. Pero ayer una niña pudo correr sin quedarse sin aire a mitad de la escalera.',
      'Lo sé porque volvió para devolverme la caja. La había pintado de azul. (Sonríe.)'] });
  topic('ekko', { t: 'Quiero saber qué pasó con los refugios.', tone: 'pregunta',
    req: { flag: 'refugios_consecuencias' }, once: true, fx: { aff: 1 },
    say: ['Quedan mantas para dos noches. Después habrá que improvisar.',
      'Lo bueno es que ya no improviso solo. Has aparecido cuando la gente necesitaba manos.'] });
  topic('jayce', { t: 'Vi la alteración de los registros hextec.', tone: 'serio',
    req: { flag: 'registros_hextec' }, once: true, fx: { aff: 1 },
    say: ['Me pasé años pensando que el error más peligroso de una máquina era técnico.',
      '(Señala los registros.) Pero alguien cambió una cifra para dejar a un barrio sin aire. Eso no lo arregla ningún cristal.'] });
  topic('mel', { t: '¿Crees que aquel acuerdo sobre los filtros sirvió de algo?', tone: 'pregunta',
    req: { flag: 'acuerdo_filtros' }, once: true, fx: { aff: 1 },
    say: ['Sirvió para que las cajas cruzaran el puente. No para que el Consejo aprendiera la lección.',
      'Una negociación puede salvar una vida sin salvar una institución. Son dos trabajos diferentes, {name}.'] });
  topic('mel', { t: 'Dijiste que había llegado el momento de revelar la verdad.', tone: 'serio',
    req: { flag: 'verdad_noxus' }, once: true, fx: { aff: 1 },
    say: ['La verdad no pierde su peso porque quien la pronuncie sea mi madre.',
      'No te prometo que no me duela. Te prometo que no cambiaré las pruebas para ahorrarme el dolor.'] });
  topic('silco', { t: 'Nunca olvidé el trato sobre los filtros.', tone: 'serio',
    req: { flag: 'trato_ruta_zaun' }, once: true, fx: { aff: 1 },
    say: ['(Deja el vaso sin probarlo.) La ciudad recuerda quién alimenta sus máquinas. También quién permite que las familias respiren.',
      'No confundas mi agradecimiento con una promesa. Pero tu trato se cumplió.'] });
  topic('sevika', { t: 'Pediste un asiento real para Zaun.', tone: 'serio',
    req: { flag: 'voz_zaun' }, once: true, fx: { aff: 2 },
    say: ['No necesito que me inviten a una mesa porque quedan sillas libres.',
      'Necesito saber que la próxima vez que nos quiten algo, no bastará con pedirnos paciencia. ¿Tú lo entiendes, verdad?'] });
  CHAT.expansionV2 = true;
})();
