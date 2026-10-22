// Las decisiones del protagonista pueden desviar destinos de Arcane.
// Este parche no renombra IDs ni elimina escenas: las partidas guardadas antiguas
// siguen encontrando sus capítulos y sus nodos originales.
(function () {
  const S = window.STORY;
  if (!S || S.alternateFates) return;
  /** Encuentra un capítulo existente; falla claramente si cambia la estructura base. */
  function chapter(id) {
    const c = S.chapters.find((x) => x.id === id);
    if (!c) throw new Error('Falta el capítulo para destino alternativo: ' + id);
    return c;
  }
  /** Añade una opción de decisión a un nodo, sin sobrescribir las originales. */
  function choice(id, node, option) {
    const n = chapter(id).nodes[node];
    if (!n?.choices) throw new Error('Nodo sin decisiones: ' + id + '/' + node);
    n.choices.push(option);
  }
  /** Permite que el personaje sobreviva al capítulo señalado cuando exista su bandera. */
  S.rescues = {
    silco: 'salva_silco', cassandra: 'salva_cassandra', isha: 'salva_isha',
    jayce: 'salva_jayce_viktor',
    viktor: 'salva_jayce_viktor', jinx: 'salva_jinx',
  };

  // Parte I: salvar a Silco exige intervenir en el instante más peligroso de la cena.
  choice('fin', 'a0', { t: 'Interponerte entre Silco y Caitlyn y obligarles a bajar las armas (Valor 3).',
    req: { stat: 'valor', min: 3 }, next: 'a1_alternativo',
    fx: { flags: ['salva_silco', 'mesa_sin_disparos'], aff: { jinx: 2, silco: 1 } } });
  chapter('fin').nodes.a1_alternativo = { bg: 'escondite-jinx', lines: [
    { s: 'narrador', t: 'Silco logra liberar una mano, pero le sujetas la muñeca antes de que alcance el arma. La pistola resbala por el suelo.' },
    { s: 'jinx', t: '(Respira a golpes, mirando de Vi a Silco.) Nadie me ha preguntado qué quiero. Ni una sola vez.' },
    { s: 'silco', t: '(Suelta por fin el arma.) Te quiero, Jinx. No voy a demostrarlo disparándole a alguien delante de ti.' },
    { s: 'vi', t: 'No vamos a arreglarlo aquí. Pero podemos salir de esta sala sin un cadáver más.' },
    { s: 'narrador', t: 'Jinx se marcha hacia el puente llevando todavía el cohete. Silco vive, pero entre ambos ha quedado una herida que no desaparece por una elección.' },
  ], next: 'a' };
  choice('fin', 'a', { t: 'Activar la evacuación reforzada y escoltar personalmente a Cassandra (Valor 3).',
    req: { stat: 'valor', min: 3 }, next: 'b_salva_cassandra',
    fx: { flags: ['salva_cassandra', 'evacuacion'], rep: { piltover: 2 } } });
  chapter('fin').nodes.b_salva_cassandra = { bg: 'consejo', lines: [
    { s: 'narrador', t: 'Los consejeros salen por el pasillo de servicio. Cassandra se niega a irse mientras quede una persona dentro.' },
    { s: 'yo', t: 'Esta vez nos vamos todos. Ni un paso atrás.' },
    { s: 'cassandra', t: '(Acepta tu mano al bajar la escalera.) No acostumbro a recibir órdenes. Pero hoy haré una excepción.' },
    { s: 'narrador', t: 'El estallido sacude la ciudad cuando llegáis al último rellano. Cassandra está herida, pero respira.' },
  ], next: 'c' };

  // Parte II: Isha no tiene por qué sacrificarse si actúas antes de que dispare.
  choice('t5', 'd', { t: 'Usar los conductos para cortar el Brillo y apartar a Isha (Ingenio 3).',
    req: { stat: 'ingenio', min: 3 }, next: 'e_salva_isha',
    fx: { flags: ['salva_isha', 'warwick_contenido'], aff: { jinx: 2, isha: 2 } } });
  chapter('t5').nodes.e_salva_isha = { bg: 'sumidero', lines: [
    { s: 'narrador', t: 'Arrancas la válvula del conducto. El vapor golpea a Warwick y apaga los tubos de Brillo durante unos segundos.' },
    { s: 'yo', t: '¡Isha, conmigo! ¡Ahora!' },
    { s: 'isha', t: '(Deja el arma, corre hacia ti y se abraza a tu cintura. Está temblando.)' },
    { s: 'jinx', t: '(Recoge a Isha. Por primera vez no encuentra una broma.) Te tengo. Te tengo, peque. No vuelvas a hacer eso.' },
    { s: 'narrador', t: 'Warwick desaparece entre las tuberías. Isha vive, aunque Zaun sigue teniendo una bestia suelta.' },
  ], next: 'f' };
  // La escena de duelo original se utiliza exclusivamente cuando Isha no ha sido salvada.
  for (const [nodeId, node] of Object.entries(chapter('t5').nodes)) {
    if (nodeId === 'e_salva_isha') continue;
    if (node.lines) for (const l of node.lines) {
      if (typeof l.t === 'string' && /Isha.*(?:muert|sacrific|no (?:está|volverá)|explosi[oó]n)/i.test(l.t) && !l.cond) l.cond = { notFlag: 'salva_isha' };
    }
  }

  // Consecuencias: las escenas posteriores deben recordar la supervivencia.
  for (const line of chapter('t5').nodes.f.lines) {
    if (/Jinx coge la granada rosa|Odiaba el frío|Jinx se entrega en la jefatura/i.test(line.t)) {
      line.cond = { notFlag: 'salva_isha' };
    }
  }
  chapter('t5').nodes.f.lines.unshift(
    { s: 'jinx', t: '(Isha dormita con la cabeza apoyada en su hombro.) Casi la pierdo. Ni una broma. Hoy no.', cond: { flag: 'salva_isha' } },
  );
  for (const line of chapter('t1').nodes.a.lines) {
    if (/ataúdes|Era tu tía|Mi madre quería la paz/i.test(line.t)) {
      line.cond = { ...(line.cond || {}), notFlag: 'salva_cassandra' };
    }
  }
  chapter('t1').nodes.a.lines.unshift(
    { s: 'caitlyn', t: '(Con la voz agotada.) Mi madre sigue recuperándose. No habría salido a tiempo del Consejo si tú no hubieras estado allí.', cond: { flag: 'salva_cassandra' } },
  );
  // El final de la Parte I reconoce que Cassandra y Silco no murieron.
  for (const ending of S.endings) for (const line of ending.lines) {
    if (/Cassandra.*(?:muert|qued[oó]|busca|no la encuentra)|mi madre estaba en esa sala/i.test(line.t)) {
      line.cond = { ...(line.cond || {}), notFlag: 'salva_cassandra' };
    }
    if (/Lo hemos hecho.*Silco|lo has visto, Silco/i.test(line.t)) {
      line.cond = { ...(line.cond || {}), notFlag: 'salva_silco' };
    }
  }
  for (const line of chapter('fin2').nodes.a.lines) {
    if (/granada rosa de Isha/i.test(line.t)) line.cond = { ...(line.cond || {}), notFlag: 'salva_isha' };
  }
  chapter('fin2').nodes.a.lines.unshift({
    s: 'narrador', t: 'Isha espera en el refugio de las Luciérnagas, lejos del frente. Jinx lucha para tener un lugar al que volver.', cond: { flag: 'salva_isha' },
  });
  for (const line of S.endings2.flatMap((ending) => ending.lines)) {
    if (/Isha.*(?:granada rosa|en memoria)|placa con muchos nombres/i.test(line.t)) {
      line.cond = { ...(line.cond || {}), notFlag: 'salva_isha' };
    }
  }

  // Parte II: una decisión de precisión en la batalla puede evitar que Jayce
  // y Viktor desaparezcan en el núcleo. No se garantiza que recuperen su vínculo.
  choice('fin2', 'a', { t: 'Desactivar los conductos del Hexcore y abrir una salida para Jayce y Viktor (Ingenio 4).',
    req: { stat: 'ingenio', min: 4 }, next: 'b_rescate_hexcore',
    fx: { flags: ['salva_jayce_viktor', 'union'], aff: { jayce: 2, viktor: 2 } } });
  chapter('fin2').nodes.b_rescate_hexcore = { bg: 'fabrica', lines: [
    { s: 'narrador', t: 'No intentas destruir el Hexcore: retiras su alimentación de las líneas de la ciudad mientras Jayce alcanza a Viktor.' },
    { s: 'jayce', t: 'Viktor, mírame. No necesito un mundo perfecto. Te necesito aquí para corregir este.' },
    { s: 'viktor', t: '(La luz en sus ojos titubea.) Me he pasado la vida intentando comprar tiempo. Y estaba regalando el de todos.' },
    { s: 'narrador', t: 'El núcleo se apaga. Ambos salen de la cámara entre escombros: vivos, cambiados y conscientes de lo que han provocado.' },
  ], next: 'c2' };

  // Si Jayce y Viktor ya salieron, no deben volver a desaparecer en la escena c.
  for (const line of chapter('fin2').nodes.c.lines) {
    if (typeof line.t === 'string') line.cond = { ...(line.cond || {}), notFlag: 'salva_jayce_viktor' };
  }
  // Jinx puede optar por quedarse. Es una oportunidad ganada antes con empatía.
  choice('fin2', 'a', { t: 'Pedir a Jinx que luche contigo y preparar una ruta de retirada (Afinidad Jinx 5).',
    req: { aff: ['jinx', 5] }, next: 'b_salva_jinx',
    fx: { flags: ['salva_jinx', 'union'], aff: { jinx: 2, vi: 1 } } });
  chapter('fin2').nodes.b_salva_jinx = { bg: 'puente', lines: [
    { s: 'yo', t: 'Si algo sale mal, no te quedes sola. Esa es la única condición.' },
    { s: 'jinx', t: '¿Me estás poniendo normas? Qué descaro. (Mira la salida que has marcado.) Vale. Una sola. Pero ni una más.' },
    { s: 'narrador', t: 'Trazáis una retirada por las tuberías bajo el puente. No cambia la batalla, pero sí quién tiene una salida cuando todo arde.' },
  ], next: 'c' };
  for (const line of chapter('fin2').nodes.c2.lines) {
    if (typeof line.t !== 'string') continue;
    if (/Jinx se suelta y cae|Vi\. Suéltame|Te quiero, hermanita|Ni hablar, Pow/i.test(line.t)) line.cond = { ...(line.cond || {}), notFlag: 'salva_jinx' };
  }
  chapter('fin2').nodes.c2.lines.push(
    { s: 'narrador', t: 'Cuando Warwick se abalanza sobre Vi, Jinx la aparta y se lanza hacia la tubería de escape que preparasteis. Llegáis al otro lado antes de la explosión.', cond: { flag: 'salva_jinx' } },
    { s: 'jinx', t: '(Tosiendo y sin soltarle la muñeca a Vi.) Ni una palabra sobre lo heroica que he sido. Lo hice porque me dio la gana.', cond: { flag: 'salva_jinx' } },
    { s: 'vi', t: 'No pensaba soltarte otra vez, Pow. No voy a empezar hoy.', cond: { flag: 'salva_jinx' } },
  );

  // El final alternativo debe evaluarse antes de los finales preexistentes.
  S.endings2.unshift({
    id: 't2_segunda_oportunidad', scene: 'puente', title: 'Final · Las vidas que elegiste',
    test: (st) => Boolean(st.flags.salva_jinx || st.flags.salva_isha || st.flags.salva_jayce_viktor),
    lines: [
      { s: 'narrador', t: 'La ciudad despierta herida. Nada devuelve lo perdido, pero hoy faltan nombres en la lista de los muertos gracias a tus decisiones.' },
      { s: 'jinx', t: '(Apoyada junto a Vi.) No soy la Powder de antes. Pero sigo aquí. Supongo que eso ya es algo.', cond: { flag: 'salva_jinx' } },
      { s: 'isha', t: '(Deja un dibujo en tus manos: un puente y tres figuras que siguen cogidas de la mano.)', cond: { flag: 'salva_isha' } },
      { s: 'jayce', t: 'Lo que construimos hizo daño. Ahora tendremos que construir algo que lo repare. Si Viktor quiere intentarlo, yo también.', cond: { flag: 'salva_jayce_viktor' } },
      { s: 'viktor', t: 'No puedo recuperar la confianza que rompí. Pero puedo aceptar que no estoy autorizado a decidir por todo el mundo.', cond: { flag: 'salva_jayce_viktor' } },
      { s: 'vi', t: 'No has arreglado nuestras vidas, {name}. Las has dejado en nuestras manos. Eso es bastante más difícil.' },
      { s: 'narrador', t: 'Piltover y Zaun siguen teniendo que elegir cómo vivir. Esta vez no todos sus futuros terminan de la misma manera.' },
    ],
  });
  S.alternateFates = true;
})();
