// Conversaciones sin fin: cada personaje tiene un «Hablemos sin prisa» con temas que se ramifican.
// Cada respuesta lleva a otra pregunta y los temas se enlazan entre sí, así que la charla no se acaba
// hasta que eliges «Cambiar de tema» o «Hasta luego» (siempre disponibles).
// Nodo: { say, again?, opts }. again: frases alternativas cuando vuelves a un nodo ya visitado.
// Lo genera un guion a partir de un original trilingüe; las traducciones están en src/i18n.
(function () {
  const CHAT = window.CHAT;
  if (!CHAT || CHAT.deepV1) return;
  const DEEP = {
    "vi": {
      "entry": {
        "t": "Tengo tiempo. Hablemos sin prisa.",
        "tone": "amable",
        "go": "h_raiz"
      },
      "nodes": {
        "h_raiz": {
          "say": [
            "(Se sienta en una caja, haciendo crujir los nudillos.) Sin prisa, ¿eh? Vale. Dispara."
          ],
          "again": [
            "¿Otra vez tú? No me quejo. ¿De qué hablamos ahora?",
            "(Te tira una manzana medio mordida.) Toma. Para la charla. ¿Por dónde íbamos?"
          ],
          "opts": [
            {
              "t": "¿Cómo eran las calles de Zaun cuando eras cría?",
              "tone": "pregunta",
              "go": "h_a1"
            },
            {
              "t": "¿Qué harías si un día todo esto se arreglara?",
              "tone": "amable",
              "go": "h_b1"
            },
            {
              "t": "¿Qué es lo que más miedo te da?",
              "tone": "serio",
              "go": "h_c1"
            }
          ]
        },
        "h_a1": {
          "say": [
            "Ruidosas. Apestosas. Y nuestras. Corríamos por los tejados de las Galerías como si fueran un parque."
          ],
          "again": [
            "Los tejados otra vez, ¿eh? Te gusta oírme hablar de cuando era una cría salvaje."
          ],
          "opts": [
            {
              "t": "¿Quién iba contigo?",
              "tone": "pregunta",
              "say": [
                "Mylo, Claggor, Powder colgada de mi espalda… Mylo siempre se quejaba y siempre llegaba el último."
              ],
              "go": "h_a2"
            },
            {
              "t": "Seguro que te caíste más de una vez.",
              "tone": "broma",
              "say": [
                "¿Una vez? (Se señala la ceja.) Esta cicatriz es de una tubería. La tubería perdió."
              ],
              "go": "h_a2",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "Suena peligroso para unos críos.",
              "tone": "serio",
              "say": [
                "Todo en Zaun es peligroso para unos críos. Por eso aprendes rápido o no aprendes."
              ],
              "go": "h_a2"
            }
          ]
        },
        "h_a2": {
          "say": [
            "Vander nos pillaba siempre. No sé cómo. Volvíamos sucios hasta las cejas y él solo levantaba una ceja."
          ],
          "opts": [
            {
              "t": "¿Os castigaba?",
              "tone": "pregunta",
              "say": [
                "Nos ponía a fregar jarras en La Última Gota. Que, ahora que lo pienso, era su forma de tenernos cerca."
              ],
              "go": "h_a3"
            },
            {
              "t": "Debía de quereros mucho.",
              "tone": "amable",
              "say": [
                "(Aparta la mirada.) Sí. Más de lo que nos merecíamos, a veces."
              ],
              "go": "h_a3",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "Yo me habría escapado mejor.",
              "tone": "broma",
              "say": [
                "¿Ah, sí? Te reto a salir de una taberna con Vander detrás de la barra. Tiene ojos en la nuca."
              ],
              "go": "h_a3"
            }
          ]
        },
        "h_a3": {
          "say": [
            "A veces paso por esas calles y ya no reconozco nada. Han cambiado. O he cambiado yo."
          ],
          "opts": [
            {
              "t": "Los dos, seguramente. Y eso no es malo.",
              "tone": "amable",
              "say": [
                "(Medio sonríe.) Hablas como Cait. Vale. Hablando de cambiar… ¿te cuento qué haría si pudiera elegir?"
              ],
              "go": "h_b1",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "¿Te da miedo haber cambiado demasiado?",
              "tone": "serio",
              "say": [
                "Esa pregunta duele más que un gancho. Vale, hablemos de miedos."
              ],
              "go": "h_c1"
            },
            {
              "t": "Llévame un día a esos tejados.",
              "tone": "coqueto",
              "say": [
                "¿Para verte resbalar? Trato hecho. Y ahora pregúntame otra cosa antes de que me ponga nostálgica."
              ],
              "go": "h_raiz"
            }
          ]
        },
        "h_b1": {
          "say": [
            "¿Arreglado? (Resopla.) Vale, juguemos. Si Zaun respirara aire limpio… creo que abriría un gimnasio. Para críos."
          ],
          "again": [
            "Mi gimnasio imaginario sigue en pie, por si preguntas."
          ],
          "opts": [
            {
              "t": "¿Para enseñarles a pelear?",
              "tone": "pregunta",
              "say": [
                "Para enseñarles cuándo NO pelear. Eso me lo tuvieron que enseñar a golpes."
              ],
              "go": "h_b2",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "Serías una entrenadora terrible. Gritona.",
              "tone": "broma",
              "say": [
                "¡Oye! Gritona pero justa. Y les daría galletas después. Bueno, las robaría de la cocina de Cait."
              ],
              "go": "h_b2"
            },
            {
              "t": "Eso no va a pasar nunca.",
              "tone": "duro",
              "say": [
                "(Te mira fijamente.) Probablemente. Pero si dejo de imaginarlo, ¿para qué me levanto?"
              ],
              "go": "h_b2",
              "fx": {
                "aff": -1
              }
            }
          ]
        },
        "h_b2": {
          "say": [
            "Y Powder… quiero decir, mi hermana… tendría un taller. Con ventanas grandes. Que nada explote salvo cuando ella quiera."
          ],
          "opts": [
            {
              "t": "¿Y tú dónde vivirías?",
              "tone": "pregunta",
              "say": [
                "Encima del gimnasio. Para bajar en pijama y pegarle al saco antes del café."
              ],
              "go": "h_b3"
            },
            {
              "t": "Ese taller suena precioso. Ojalá lo vea.",
              "tone": "amable",
              "say": [
                "(Se le quiebra un poco la voz.) Ya. Yo también."
              ],
              "go": "h_b3",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "¿Y Caitlyn? ¿Dónde encaja en ese sueño?",
              "tone": "coqueto",
              "say": [
                "(Se pone colorada.) …En la puerta de al lado. O en la misma. Cállate, no he dicho nada."
              ],
              "go": "h_b3"
            }
          ]
        },
        "h_b3": {
          "say": [
            "Bah. Sueños de taberna. ¿Y tú qué, {name}? ¿Qué harías tú?"
          ],
          "opts": [
            {
              "t": "Quedarme cerca de la gente que me importa.",
              "tone": "amable",
              "say": [
                "Eso es fácil de decir y difícil de hacer. Me gusta. Oye… ¿y qué te asusta a ti? A mí sí te lo digo."
              ],
              "go": "h_c1",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "Montar una taberna. Te haría la competencia.",
              "tone": "broma",
              "say": [
                "¡Ja! Te la cerraría en una semana a base de peleas. Venga, volvamos a lo de antes."
              ],
              "go": "h_a1"
            },
            {
              "t": "No lo sé. Nunca me he atrevido a pensarlo.",
              "tone": "serio",
              "say": [
                "Pues piénsalo. Y cuando lo sepas, vienes y me lo cuentas. Yo invito."
              ],
              "go": "h_raiz"
            }
          ]
        },
        "h_c1": {
          "say": [
            "(Tarda en contestar.) Llegar tarde. Otra vez. Ver que todo se rompe y estar al otro lado de una puerta."
          ],
          "again": [
            "Mis miedos no han cambiado desde la última vez. Por desgracia."
          ],
          "opts": [
            {
              "t": "No siempre puedes estar en todas partes.",
              "tone": "amable",
              "say": [
                "Lo sé. Lo sé con la cabeza. El estómago no se entera."
              ],
              "go": "h_c2",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "¿Lo dices por Powder?",
              "tone": "pregunta",
              "say": [
                "Por Powder. Por Vander. Por todos. Elige."
              ],
              "go": "h_c2"
            },
            {
              "t": "A mí me dan miedo las ratas. Para que veas.",
              "tone": "broma",
              "say": [
                "(Se le escapa la risa.) ¿Las ratas? ¿En Zaun? Estás perdid{g:o|a|e}. Pero gracias, lo necesitaba."
              ],
              "go": "h_c2",
              "fx": {
                "aff": 1
              }
            }
          ]
        },
        "h_c2": {
          "say": [
            "Cuando estoy en la celda… cuando estaba… contaba los golpes del agua en la pared. Así no pensaba."
          ],
          "opts": [
            {
              "t": "¿Cuántas contaste?",
              "tone": "pregunta",
              "say": [
                "Perdí la cuenta en los millones. Luego empecé a ponerles nombres. No me juzgues."
              ],
              "go": "h_c3"
            },
            {
              "t": "Ya no estás allí. Estás aquí, conmigo.",
              "tone": "amable",
              "say": [
                "(Respira hondo.) Sí. Aquí. Vale."
              ],
              "go": "h_c3",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "Stillwater debería arder.",
              "tone": "duro",
              "say": [
                "(Aprieta la mandíbula.) Ahí dentro hay gente que no ha hecho nada. No todo se arregla quemándolo."
              ],
              "go": "h_c3"
            }
          ]
        },
        "h_c3": {
          "say": [
            "Vale, ya basta de ponerme blanda. Me debes una conversación sobre algo tonto."
          ],
          "opts": [
            {
              "t": "¿Cuál es tu comida favorita?",
              "tone": "broma",
              "say": [
                "Las tartas de la cafetería de arriba. Las que Cait finge no comprar para mí. Venga, otra cosa."
              ],
              "go": "h_raiz",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "Cuéntame más de cuando erais críos.",
              "tone": "amable",
              "say": [
                "¿Más? Vale, pero luego me invitas."
              ],
              "go": "h_a1"
            },
            {
              "t": "¿Y si Zaun tuviera aire limpio?",
              "tone": "pregunta",
              "say": [
                "Ya te lo dije: un gimnasio. Pero vale, imaginemos más."
              ],
              "go": "h_b1"
            }
          ]
        }
      }
    },
    "jinx": {
      "entry": {
        "t": "Oye, Jinx… ¿jugamos a hablar sin parar?",
        "tone": "broma",
        "go": "h_raiz"
      },
      "nodes": {
        "h_raiz": {
          "say": [
            "(Da vueltas en una silla giratoria.) ¿Hablar sin parar? ¡Es mi especialidad! Bueno, eso y las explosiones. Elige."
          ],
          "again": [
            "¡Has vuelto! Las voces apostaban a que no. Les debo dinero.",
            "(Te apunta con un dedo como si fuera una pistola.) Bang. Ya estás en la conversación. Sin salida."
          ],
          "opts": [
            {
              "t": "Enséñame tus dibujos de la pared.",
              "tone": "amable",
              "go": "h_a1"
            },
            {
              "t": "¿Cuál es tu recuerdo favorito?",
              "tone": "pregunta",
              "go": "h_b1"
            },
            {
              "t": "Si fueras una bomba, ¿qué bomba serías?",
              "tone": "broma",
              "go": "h_c1"
            }
          ]
        },
        "h_a1": {
          "say": [
            "¡Mis obras maestras! Esa es Vi con cara de tonta. Esa es una ballena con alas. Y esa… esa no la mires."
          ],
          "again": [
            "He añadido tres monstruos más a la pared. Uno se parece a ti. Es un cumplido. Creo."
          ],
          "opts": [
            {
              "t": "¿Por qué no puedo mirar esa?",
              "tone": "pregunta",
              "say": [
                "(Se pone delante.) Porque tiene caras tachadas. Y las caras tachadas no se miran. Regla número uno."
              ],
              "go": "h_a2"
            },
            {
              "t": "La ballena con alas es mi favorita.",
              "tone": "amable",
              "say": [
                "¿¡Verdad!? Se llama Señora Burbujas. Vuela por encima del humo y se come las nubes verdes."
              ],
              "go": "h_a2",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "Esto parece la pared de una loca.",
              "tone": "duro",
              "say": [
                "(Ladea la cabeza, sonriendo demasiado.) ¿Loca? Uy. Esa palabra la tacho yo también. Contigo al lado."
              ],
              "go": "h_a2",
              "fx": {
                "aff": -1
              }
            }
          ]
        },
        "h_a2": {
          "say": [
            "Dibujo cuando la cabeza hace demasiado ruido. Las líneas son más calladas que las voces."
          ],
          "opts": [
            {
              "t": "¿Puedo dibujar algo contigo?",
              "tone": "amable",
              "say": [
                "(Te pone un trozo de tiza en la mano.) Dibuja un mono. Si te sale feo, gana."
              ],
              "go": "h_a3",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "¿Las voces también dibujan?",
              "tone": "pregunta",
              "say": [
                "Las voces critican. Son las peores críticas de arte de Zaun. Ni Sevika es tan dura."
              ],
              "go": "h_a3"
            },
            {
              "t": "Pues pinta más. Te sienta bien.",
              "tone": "serio",
              "say": [
                "¿Bien? (Se mira las manos manchadas.) Nadie me dice eso. Raro. Me gusta."
              ],
              "go": "h_a3",
              "fx": {
                "aff": 1
              }
            }
          ]
        },
        "h_a3": {
          "say": [
            "(Termina tu mono con un bigote y dos granadas por ojos.) Perfecto. Ahora es arte de verdad."
          ],
          "opts": [
            {
              "t": "Le has puesto granadas. Claro.",
              "tone": "broma",
              "say": [
                "¡Todo es mejor con granadas! Hablando de explosiones… ¿jugamos a lo de la bomba?"
              ],
              "go": "h_c1"
            },
            {
              "t": "¿Me cuentas un recuerdo bonito?",
              "tone": "amable",
              "say": [
                "¿Bonito? Tengo uno. Uno solo, pero brilla."
              ],
              "go": "h_b1"
            },
            {
              "t": "Me lo quedo para mi casa.",
              "tone": "coqueto",
              "say": [
                "¿Te llevas mi pared? ¡Ladr{g:ón|ona|ón} de arte! …Vale, pero me invitas a ver dónde lo cuelgas. Otra pregunta."
              ],
              "go": "h_raiz"
            }
          ]
        },
        "h_b1": {
          "say": [
            "(Se queda quieta, cosa rara en ella.) Vi me llevaba a hombros a ver las luces de Piltover desde el puerto. Yo creía que eran estrellas que habían bajado a vivir."
          ],
          "again": [
            "Las luces… sí. Sigo pensando en ellas. Pero ahora sé que no son estrellas."
          ],
          "opts": [
            {
              "t": "Es un recuerdo precioso.",
              "tone": "amable",
              "say": [
                "Lo es. Lo guardo en una caja dentro de la cabeza. Con candado."
              ],
              "go": "h_b2",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "¿Y qué pasó con las estrellas?",
              "tone": "pregunta",
              "say": [
                "Que eran lámparas de gente rica. Desilusión total. Les quité la magia… a tiros."
              ],
              "go": "h_b2"
            },
            {
              "t": "¿Echas de menos ser Powder?",
              "tone": "serio",
              "say": [
                "(Se le borra la sonrisa.) Powder era un gafe. Jinx no falla. …Casi nunca."
              ],
              "go": "h_b2"
            }
          ]
        },
        "h_b2": {
          "say": [
            "También me acuerdo de Mylo poniéndome motes y de Claggor arreglando mis cachivaches sin decir nada. El grandullón callado."
          ],
          "opts": [
            {
              "t": "¿Qué mote te ponía Mylo?",
              "tone": "pregunta",
              "say": [
                "«Gafe». Siempre «gafe». (Sonríe torcido.) Al final me lo quedé. Ya ves."
              ],
              "go": "h_b3"
            },
            {
              "t": "Claggor parece buena gente.",
              "tone": "amable",
              "say": [
                "Lo era. Me enseñó a soldar sin quemarme las cejas. Bueno, casi."
              ],
              "go": "h_b3",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "No pienses en eso ahora.",
              "tone": "serio",
              "say": [
                "Fácil decirlo. Ellos vienen solos. Siempre. Pero vale, lo intento."
              ],
              "go": "h_b3"
            }
          ]
        },
        "h_b3": {
          "say": [
            "¡Vale, se acabó el rincón triste! (Da una palmada.) Cambia la cara, que pareces Vi en un mal día."
          ],
          "opts": [
            {
              "t": "¿Jugamos al juego de las bombas?",
              "tone": "broma",
              "say": [
                "¡SÍ! Por fin alguien con criterio."
              ],
              "go": "h_c1",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "Enséñame otra vez la pared.",
              "tone": "amable",
              "say": [
                "La pared nunca se acaba. Como yo."
              ],
              "go": "h_a1"
            },
            {
              "t": "Vale, empecemos de nuevo.",
              "tone": "pregunta",
              "say": [
                "¡Reinicio! Me encantan los reinicios. Son como explosiones pero al revés."
              ],
              "go": "h_raiz"
            }
          ]
        },
        "h_c1": {
          "say": [
            "¡Pregunta seria! Yo sería… una bomba de humo rosa. Con purpurina. Que suena a fiesta y luego ¡PUM!, nadie ve nada."
          ],
          "again": [
            "He cambiado de opinión: ahora sería una bomba con forma de pastel. Sorpresa doble."
          ],
          "opts": [
            {
              "t": "¿Y yo qué bomba sería?",
              "tone": "pregunta",
              "say": [
                "(Te mira de arriba abajo.) Una mina. Tranquilita, ahí quieta… hasta que alguien te pisa. Me gustas."
              ],
              "go": "h_c2",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "¿Por qué no se puede ver nada?",
              "tone": "serio",
              "say": [
                "Porque así nadie ve cómo tiemblo antes del disparo. Shh. Secreto."
              ],
              "go": "h_c2"
            },
            {
              "t": "Yo sería un petardo de feria.",
              "tone": "broma",
              "say": [
                "¡Pfff! ¿Un petardito? (Se ríe tanto que se cae de la silla.) Vale, vale, eres adorable."
              ],
              "go": "h_c2",
              "fx": {
                "aff": 1
              }
            }
          ]
        },
        "h_c2": {
          "say": [
            "Siguiente nivel: si pudieras volar una sola cosa de toda la ciudad, ¿cuál?"
          ],
          "opts": [
            {
              "t": "El Consejo de Piltover.",
              "tone": "duro",
              "say": [
                "Uuuh, peligroso. Me gusta cómo piensas. Demasiado. Shh, las voces están aplaudiendo."
              ],
              "go": "h_c3"
            },
            {
              "t": "Ninguna. Prefiero construir algo.",
              "tone": "amable",
              "say": [
                "(Hace un puchero.) Aburrido. …Aunque construir también mola. Vale, punto para ti."
              ],
              "go": "h_c3",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "La fábrica de Brillo.",
              "tone": "astuto",
              "say": [
                "(Se queda callada un segundo.) …Esa respuesta tiene trampa. No la voy a contestar. Siguiente."
              ],
              "go": "h_c3"
            }
          ]
        },
        "h_c3": {
          "say": [
            "¡Se me ha acabado el juego! Nadie había llegado tan lejos. Toma, un premio. (Te da un tornillo.) Es muy valioso."
          ],
          "opts": [
            {
              "t": "Lo guardaré siempre.",
              "tone": "amable",
              "say": [
                "¡Más te vale! Ahora pregúntame algo bonito, que se me ha quedado el corazón blandito."
              ],
              "go": "h_b1",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "¿Me enseñas a pintar bombas?",
              "tone": "broma",
              "say": [
                "¡A la pared! Rápido, que se seca la pintura."
              ],
              "go": "h_a1"
            },
            {
              "t": "¿Otra ronda?",
              "tone": "pregunta",
              "say": [
                "¡Siempre otra ronda! Esa es la regla número dos."
              ],
              "go": "h_raiz"
            }
          ]
        }
      }
    },
    "caitlyn": {
      "entry": {
        "t": "¿Tienes un rato para hablar de todo y de nada?",
        "tone": "amable",
        "go": "h_raiz"
      },
      "nodes": {
        "h_raiz": {
          "say": [
            "(Cierra el expediente y lo aparta.) Supongo que el caso puede esperar diez minutos. Quizá veinte."
          ],
          "again": [
            "Has vuelto. Empiezo a pensar que vienes más por la charla que por los informes.",
            "(Sirve dos tazas de té sin preguntar.) Bien. ¿De qué hablamos hoy?"
          ],
          "opts": [
            {
              "t": "¿Cómo fue crecer en la casa Kiramman?",
              "tone": "pregunta",
              "go": "h_a1"
            },
            {
              "t": "¿Cómo aprendiste a disparar así?",
              "tone": "pregunta",
              "go": "h_b1"
            },
            {
              "t": "¿Qué haces cuando no estás trabajando?",
              "tone": "broma",
              "go": "h_c1"
            }
          ]
        },
        "h_a1": {
          "say": [
            "Silenciosa. Alfombras gruesas, cenas de doce cubiertos y nadie diciendo lo que pensaba. Aprendí a leer a la gente por cómo dejaba la cuchara."
          ],
          "again": [
            "Mi infancia no ha cambiado desde la última vez, por si lo dudabas. Sigue siendo igual de silenciosa."
          ],
          "opts": [
            {
              "t": "¿Y qué dice de mí cómo dejo la cuchara?",
              "tone": "coqueto",
              "say": [
                "(Arquea una ceja.) Que no has dejado ninguna, porque no hay cuchara. Y que intentas distraerme."
              ],
              "go": "h_a2",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "Suena solitario.",
              "tone": "amable",
              "say": [
                "Lo era. Por eso me escapaba a la biblioteca de mi padre. Los libros no fingían."
              ],
              "go": "h_a2",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "Pobre niña rica.",
              "tone": "duro",
              "say": [
                "(Fría.) Sé lo que tenía. No te he pedido compasión, solo has preguntado."
              ],
              "go": "h_a2",
              "fx": {
                "aff": -1
              }
            }
          ]
        },
        "h_a2": {
          "say": [
            "Mi padre me leía novelas de detectives. Yo me sabía el culpable antes del capítulo tres y él fingía sorprenderse."
          ],
          "opts": [
            {
              "t": "¿Cuál era tu favorita?",
              "tone": "pregunta",
              "say": [
                "«El reloj del faro». El asesino era el farero. Obvio: era el único que sabía a qué hora se apagaba la luz."
              ],
              "go": "h_a3"
            },
            {
              "t": "Ya de pequeña eras detective.",
              "tone": "amable",
              "say": [
                "Era insoportable, más bien. Interrogaba al servicio sobre galletas desaparecidas."
              ],
              "go": "h_a3",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "¿Resolviste lo de las galletas?",
              "tone": "broma",
              "say": [
                "Fui yo. Sonámbula. Caso cerrado y mi primera lección de humildad."
              ],
              "go": "h_a3",
              "fx": {
                "aff": 1
              }
            }
          ]
        },
        "h_a3": {
          "say": [
            "A veces pienso que me hice ejecutora para vivir dentro de una de esas novelas. Luego descubrí que en las de verdad el culpable a veces gana."
          ],
          "opts": [
            {
              "t": "Por eso hace falta gente como tú.",
              "tone": "amable",
              "say": [
                "(Sonríe apenas.) Gracias. Y gente que sepa apuntar. ¿Quieres saber cómo aprendí?"
              ],
              "go": "h_b1",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "¿Y qué haces para no pensar en eso?",
              "tone": "pregunta",
              "say": [
                "Buena pregunta. Más de lo que crees."
              ],
              "go": "h_c1"
            },
            {
              "t": "Volvamos al principio.",
              "tone": "serio",
              "say": [
                "Como en una buena investigación: siempre se vuelve al principio."
              ],
              "go": "h_raiz"
            }
          ]
        },
        "h_b1": {
          "say": [
            "Con un rifle de caza de mi madre, en el jardín, disparando a manzanas. Mi madre lo odiaba. Mi padre me compraba más manzanas."
          ],
          "again": [
            "Todavía practico con manzanas a veces. Las costumbres de familia no mueren."
          ],
          "opts": [
            {
              "t": "¿Cuál es el truco para no fallar?",
              "tone": "pregunta",
              "say": [
                "Respirar. Disparar al final de la espiración, cuando el cuerpo está quieto. Y no pensar en quién te mira."
              ],
              "go": "h_b2",
              "fx": {
                "stats": {
                  "ingenio": 1
                }
              }
            },
            {
              "t": "Pobres manzanas.",
              "tone": "broma",
              "say": [
                "Acabaron en tarta. Es un final digno."
              ],
              "go": "h_b2",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "Me encantaría verte disparar.",
              "tone": "coqueto",
              "say": [
                "(Ajusta la mira sin mirarte.) Es fácil. Solo tienes que no moverte. Ni hablar."
              ],
              "go": "h_b2"
            }
          ]
        },
        "h_b2": {
          "say": [
            "El rifle no es lo difícil. Lo difícil es decidir cuándo NO apretar el gatillo."
          ],
          "opts": [
            {
              "t": "¿Te ha pasado alguna vez?",
              "tone": "serio",
              "say": [
                "(Mira hacia la ventana.) Más de una. Y no siempre elegí bien."
              ],
              "go": "h_b3"
            },
            {
              "t": "Esa duda es lo que te hace buena.",
              "tone": "amable",
              "say": [
                "Vi diría lo mismo. Luego me robaría el último bollo."
              ],
              "go": "h_b3",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "En Zaun no dudamos tanto.",
              "tone": "duro",
              "say": [
                "Lo sé. Y por eso en Zaun hay más funerales. No es un reproche. Es una cifra."
              ],
              "go": "h_b3"
            }
          ]
        },
        "h_b3": {
          "say": [
            "Bueno. Basta de lecciones de tiro. Si sigo, te pongo a practicar ahora mismo."
          ],
          "opts": [
            {
              "t": "¿Y qué haces para desconectar?",
              "tone": "pregunta",
              "say": [
                "¿Desconectar? Uf. Te lo cuento, pero no te rías."
              ],
              "go": "h_c1"
            },
            {
              "t": "Háblame más de tu padre.",
              "tone": "amable",
              "say": [
                "Tobias. Un buen hombre en una casa de buenas formas. Te cuento."
              ],
              "go": "h_a1"
            },
            {
              "t": "Practiquemos otro día. Hablemos de otra cosa.",
              "tone": "broma",
              "say": [
                "Cobardía táctica. Lo respeto."
              ],
              "go": "h_raiz"
            }
          ]
        },
        "h_c1": {
          "say": [
            "Hago puzles. De mil piezas. Sin mirar la caja. (Carraspea.) Y a veces toco el piano fatal, a solas."
          ],
          "again": [
            "El puzle de la última vez sigue a medias. Le falta el cielo. Siempre falta el cielo."
          ],
          "opts": [
            {
              "t": "¿Sin mirar la caja? Eso es de psicópata.",
              "tone": "broma",
              "say": [
                "(Se ríe, sorprendida.) Es de detective. Hay una diferencia… pequeña."
              ],
              "go": "h_c2",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "Tócame algo un día.",
              "tone": "coqueto",
              "say": [
                "Ni hablar. Bueno… quizá. Si prometes no aplaudir por compromiso."
              ],
              "go": "h_c2",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "¿Nunca descansas de verdad?",
              "tone": "serio",
              "say": [
                "Descansar me pone nerviosa. Siempre hay alguien a quien no hemos encontrado a tiempo."
              ],
              "go": "h_c2"
            }
          ]
        },
        "h_c2": {
          "say": [
            "¿Y tú? Seguro que tienes alguna afición vergonzosa. Todo el mundo la tiene."
          ],
          "opts": [
            {
              "t": "Colecciono tornillos raros.",
              "tone": "broma",
              "say": [
                "¿Tornillos? Vale, me ganas. Jinx te adoraría, por cierto. Eso no es un cumplido."
              ],
              "go": "h_c3",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "Escribo lo que pasa en estas calles.",
              "tone": "serio",
              "say": [
                "Eso no es vergonzoso, es útil. Guárdalo. Algún día alguien necesitará la verdad escrita."
              ],
              "go": "h_c3",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "Ninguna. Soy perfect{g:o|a|e}.",
              "tone": "astuto",
              "say": [
                "Eso es exactamente lo que diría alguien con una afición muy vergonzosa. Lo averiguaré."
              ],
              "go": "h_c3"
            }
          ]
        },
        "h_c3": {
          "say": [
            "(Mira el reloj y no se levanta.) Debería volver al trabajo. Debería."
          ],
          "opts": [
            {
              "t": "Cinco minutos más.",
              "tone": "amable",
              "say": [
                "Cinco. Ni uno más. (No mira el reloj otra vez.)"
              ],
              "go": "h_raiz",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "Cuéntame cómo aprendiste a disparar.",
              "tone": "pregunta",
              "say": [
                "Ah, las manzanas. Siéntate."
              ],
              "go": "h_b1"
            },
            {
              "t": "¿Y de pequeña también eras así de responsable?",
              "tone": "broma",
              "say": [
                "Peor. Te lo cuento."
              ],
              "go": "h_a1"
            }
          ]
        }
      }
    },
    "jayce": {
      "entry": {
        "t": "Jayce, cuéntame cosas. Sin prisa.",
        "tone": "amable",
        "go": "h_raiz"
      },
      "nodes": {
        "h_raiz": {
          "say": [
            "(Deja el martillo en el banco con un golpe.) ¡Por fin alguien que no viene a pedirme un informe! Adelante."
          ],
          "again": [
            "Has vuelto. Bien. Los consejeros no saben hablar de nada que no tenga presupuesto.",
            "(Te ofrece un taburete lleno de tornillos. Los tira al suelo.) Siéntate. ¿Qué toca hoy?"
          ],
          "opts": [
            {
              "t": "¿Cómo era tu infancia?",
              "tone": "pregunta",
              "go": "h_a1"
            },
            {
              "t": "¿Qué inventarías si no hubiera límites?",
              "tone": "broma",
              "go": "h_b1"
            },
            {
              "t": "¿Te pesa ser el «héroe del progreso»?",
              "tone": "serio",
              "go": "h_c1"
            }
          ]
        },
        "h_a1": {
          "say": [
            "Mi madre y yo vivíamos de su taller. Ella arreglaba relojes; yo los desmontaba antes de que llegaran los clientes."
          ],
          "again": [
            "Mi madre aún me regaña por aquellos relojes. Con razón."
          ],
          "opts": [
            {
              "t": "¿Y sabías montarlos otra vez?",
              "tone": "pregunta",
              "say": [
                "A veces. Otras veces sobraban piezas. Todavía tengo un frasco con muelles huérfanos."
              ],
              "go": "h_a2",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "Tu madre debía de tener paciencia infinita.",
              "tone": "amable",
              "say": [
                "Infinita y con zapatilla. Ella es la razón de que yo esté aquí."
              ],
              "go": "h_a2",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "Así que ya de niño rompías cosas.",
              "tone": "broma",
              "say": [
                "«Exploraba su funcionamiento interno». Es distinto. Viktor también usa esa excusa."
              ],
              "go": "h_a2"
            }
          ]
        },
        "h_a2": {
          "say": [
            "Una vez, de crío, me perdí en una ventisca. Alguien me salvó con algo que no era ciencia. Una luz azul. Nunca lo olvidé."
          ],
          "opts": [
            {
              "t": "¿Magia? ¿De verdad?",
              "tone": "pregunta",
              "say": [
                "Magia. Por eso empecé con la hextec: quería entender lo que me salvó. Hacer que sirviera a todos, no solo a un niño perdido."
              ],
              "go": "h_a3",
              "fx": {
                "stats": {
                  "ingenio": 1
                }
              }
            },
            {
              "t": "Debiste de pasar mucho miedo.",
              "tone": "amable",
              "say": [
                "Mucho. Aún odio el frío. Por eso el taller siempre está a tope de calor. No es por las máquinas."
              ],
              "go": "h_a3",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "¿Seguro que no lo soñaste?",
              "tone": "astuto",
              "say": [
                "Eso dijeron todos. Luego hice brillar un cristal en mi taller y dejaron de decirlo."
              ],
              "go": "h_a3"
            }
          ]
        },
        "h_a3": {
          "say": [
            "A veces me pregunto qué pensaría aquel niño del hombre que soy ahora."
          ],
          "opts": [
            {
              "t": "Que llegaste lejos.",
              "tone": "amable",
              "say": [
                "Lejos, sí. Si es en la dirección correcta… eso ya es otra conversación."
              ],
              "go": "h_c1",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "Que te falta dormir.",
              "tone": "broma",
              "say": [
                "(Se ríe.) ¡Eso seguro! Venga, hablemos de algo divertido. ¿Inventos imposibles?"
              ],
              "go": "h_b1"
            },
            {
              "t": "Pregúntaselo a tu madre.",
              "tone": "serio",
              "say": [
                "Ya lo hice. Me dijo que me pusiera una bufanda. Las madres siempre van al grano."
              ],
              "go": "h_raiz"
            }
          ]
        },
        "h_b1": {
          "say": [
            "¡Sin límites! (Se le iluminan los ojos.) Un puente de luz entre Piltover y Zaun. Que cualquiera pueda cruzarlo sin pagar peaje."
          ],
          "again": [
            "El puente de luz sigue en mis cuadernos. He añadido barandillas. Por si Jinx."
          ],
          "opts": [
            {
              "t": "¿Y por qué no lo haces?",
              "tone": "pregunta",
              "say": [
                "Porque el Consejo pregunta primero quién cobra el peaje. Siempre es esa pregunta."
              ],
              "go": "h_b2"
            },
            {
              "t": "Yo te ayudaría a construirlo.",
              "tone": "amable",
              "say": [
                "¿En serio? Entonces ya somos dos. Bueno, tres con Viktor. Él haría los cálculos aburridos."
              ],
              "go": "h_b2",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "Yo inventaría una máquina de café infinito.",
              "tone": "broma",
              "say": [
                "¡Eso sí que cambiaría la historia de Piltover! Apúntalo. En serio, apúntalo."
              ],
              "go": "h_b2",
              "fx": {
                "aff": 1
              }
            }
          ]
        },
        "h_b2": {
          "say": [
            "Viktor dice que sueño demasiado alto. Yo digo que él sueña demasiado bajo. Nos complementamos."
          ],
          "opts": [
            {
              "t": "¿Cómo os conocisteis?",
              "tone": "pregunta",
              "say": [
                "Me sacó de un lío en la Academia. Él vio en mis notas lo que nadie más quiso ver. Desde entonces, no hay invento sin él."
              ],
              "go": "h_b3"
            },
            {
              "t": "¿Y quién tiene razón?",
              "tone": "astuto",
              "say": [
                "(Duda.) Depende del día. Y de si ha dormido. Ninguno de los dos duerme."
              ],
              "go": "h_b3"
            },
            {
              "t": "Se nota que le quieres mucho.",
              "tone": "amable",
              "say": [
                "Es mi compañero. Mi hermano, casi. No se lo digas, se pondría insoportable."
              ],
              "go": "h_b3",
              "fx": {
                "aff": 1
              }
            }
          ]
        },
        "h_b3": {
          "say": [
            "Me estoy emocionando. Siempre me pasa. Si no me paras, te dibujo el puente aquí mismo en la mesa."
          ],
          "opts": [
            {
              "t": "Dibújalo. Quiero verlo.",
              "tone": "amable",
              "say": [
                "(Coge una tiza. Dibuja un arco precioso… y luego, al lado, muy pequeño, un niño en la nieve.) Bueno. Ya ves de dónde viene todo."
              ],
              "go": "h_a1",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "¿Y el peso de ser el héroe?",
              "tone": "serio",
              "say": [
                "Ah. Esa conversación. Vale."
              ],
              "go": "h_c1"
            },
            {
              "t": "Mejor cambiemos antes de que destroces la mesa.",
              "tone": "broma",
              "say": [
                "Prudente. Mi madre te adoraría."
              ],
              "go": "h_raiz"
            }
          ]
        },
        "h_c1": {
          "say": [
            "(Se apoya en el banco.) La gente me para por la calle. Me dan las gracias por cosas que no he hecho yo solo. Y me culpan de cosas que tampoco."
          ],
          "again": [
            "Sigue pesando. Pero hablarlo contigo pesa un poco menos."
          ],
          "opts": [
            {
              "t": "Nadie puede cargar con una ciudad entera.",
              "tone": "amable",
              "say": [
                "Ya. Pero alguien tiene que intentarlo. Y si no soy yo, será alguien peor."
              ],
              "go": "h_c2",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "Te gusta un poco la fama, admítelo.",
              "tone": "broma",
              "say": [
                "(Se rasca la nuca.) …Un poco. Las estatuas son halagadoras. Pero los discursos, no."
              ],
              "go": "h_c2"
            },
            {
              "t": "A lo mejor deberías pararte a escuchar a Zaun.",
              "tone": "duro",
              "say": [
                "(Se tensa.) …Puede. Viktor me lo dice cada semana. No me gusta que tengáis razón los dos."
              ],
              "go": "h_c2",
              "fx": {
                "rep": {
                  "zaun": 1
                }
              }
            }
          ]
        },
        "h_c2": {
          "say": [
            "¿Sabes qué echo de menos? Ser solo Jayce, el chico que rompía relojes. Nadie esperaba nada de él."
          ],
          "opts": [
            {
              "t": "Conmigo puedes ser solo Jayce.",
              "tone": "coqueto",
              "say": [
                "(Te mira, sorprendido.) …Gracias. Eso vale más que una medalla."
              ],
              "go": "h_c3",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "Pues rompe un reloj ahora. Por los viejos tiempos.",
              "tone": "broma",
              "say": [
                "(Coge un reloj de la mesa, lo mira… y lo vuelve a dejar.) Es de Viktor. Me mataría. Aún queda algo de sensatez."
              ],
              "go": "h_c3",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "Ese chico sigue ahí dentro.",
              "tone": "amable",
              "say": [
                "Espero que sí. Necesito que alguien le recuerde al consejero por qué empezó."
              ],
              "go": "h_c3"
            }
          ]
        },
        "h_c3": {
          "say": [
            "Bueno. Ya me has sacado más que tres sesiones del Consejo. ¿Seguimos?"
          ],
          "opts": [
            {
              "t": "Claro. Háblame de tu madre.",
              "tone": "amable",
              "say": [
                "¡Ah, mi madre! Te va a caer bien. A todo el mundo le cae mejor que yo."
              ],
              "go": "h_a1"
            },
            {
              "t": "Mejor, inventos imposibles.",
              "tone": "broma",
              "say": [
                "¡Por fin! Coge papel."
              ],
              "go": "h_b1",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "Elige tú el tema.",
              "tone": "pregunta",
              "say": [
                "¿Yo? Peligroso. Vale, vuelta al principio."
              ],
              "go": "h_raiz"
            }
          ]
        }
      }
    },
    "viktor": {
      "entry": {
        "t": "¿Podemos hablar un rato largo, Viktor?",
        "tone": "amable",
        "go": "h_raiz"
      },
      "nodes": {
        "h_raiz": {
          "say": [
            "(Deja la pluma con cuidado.) El tiempo es lo único que no puedo fabricar. Pero puedo dártelo. Adelante."
          ],
          "again": [
            "Vuelves. Curioso. Tienes la tenacidad de un buen investigador.",
            "(Aparta un montón de planos para hacerte sitio.) Siéntate. Mis ecuaciones pueden esperar."
          ],
          "opts": [
            {
              "t": "¿Qué te fascina de la ciencia?",
              "tone": "pregunta",
              "go": "h_a1"
            },
            {
              "t": "Háblame de las plantas de tu taller.",
              "tone": "amable",
              "go": "h_b1"
            },
            {
              "t": "¿Qué piensas del dolor?",
              "tone": "serio",
              "go": "h_c1"
            }
          ]
        },
        "h_a1": {
          "say": [
            "Que no miente. Un experimento falla y te dice exactamente por qué. Las personas no son tan amables."
          ],
          "again": [
            "La ciencia sigue sin mentirme. Las personas siguen… siendo personas."
          ],
          "opts": [
            {
              "t": "Yo no te mentiría.",
              "tone": "amable",
              "say": [
                "(Te observa.) Esa afirmación requiere pruebas. Pero acepto la hipótesis, de momento."
              ],
              "go": "h_a2",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "Suena un poco frío.",
              "tone": "serio",
              "say": [
                "Frío no. Honesto. El frío es no querer saber."
              ],
              "go": "h_a2"
            },
            {
              "t": "¿Y cuando el experimento explota?",
              "tone": "broma",
              "say": [
                "Entonces Jayce se ríe, yo apunto los datos y alguien barre. Normalmente yo."
              ],
              "go": "h_a2",
              "fx": {
                "aff": 1
              }
            }
          ]
        },
        "h_a2": {
          "say": [
            "De niño, en el sumidero, construía juguetes con chatarra. Una mariposa de latón que movía las alas. Se la regalé a un niño enfermo."
          ],
          "opts": [
            {
              "t": "¿Qué fue de aquel niño?",
              "tone": "pregunta",
              "say": [
                "(Silencio.) Lo que le pasa a muchos niños en Zaun. Por eso sigo trabajando."
              ],
              "go": "h_a3"
            },
            {
              "t": "Siempre has querido ayudar.",
              "tone": "amable",
              "say": [
                "Siempre he querido que nadie más tosiera como yo. No es lo mismo, pero se parece."
              ],
              "go": "h_a3",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "¿Me harías una mariposa a mí?",
              "tone": "coqueto",
              "say": [
                "(Casi sonríe.) Tengo latón de sobra. Y, al parecer, debilidad por las peticiones imposibles."
              ],
              "go": "h_a3",
              "fx": {
                "aff": 1
              }
            }
          ]
        },
        "h_a3": {
          "say": [
            "La ciencia es una forma de esperanza con método. Esa es mi fe, si tengo alguna."
          ],
          "opts": [
            {
              "t": "Me gusta esa fe.",
              "tone": "amable",
              "say": [
                "Tiene pocos fieles. Bienvenid{g:o|a|e}. Hablando de cosas que crecen… ¿has visto mis plantas?"
              ],
              "go": "h_b1",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "¿Y cuando la esperanza duele?",
              "tone": "serio",
              "say": [
                "Entonces hablamos del dolor. Siempre acabamos ahí."
              ],
              "go": "h_c1"
            },
            {
              "t": "Empecemos otra vez desde el principio.",
              "tone": "pregunta",
              "say": [
                "Repetir es la base del método. Adelante."
              ],
              "go": "h_raiz"
            }
          ]
        },
        "h_b1": {
          "say": [
            "(Toca una hoja con cuidado.) Las recojo de las grietas de Zaun. Crecen sin luz, en aire envenenado. Quiero saber cómo."
          ],
          "again": [
            "Esta ha echado una hoja nueva desde tu última visita. Quizá le gustas."
          ],
          "opts": [
            {
              "t": "Son como la gente de Zaun.",
              "tone": "amable",
              "say": [
                "Exacto. Tercas. Adaptables. Nadie las riega y aun así florecen."
              ],
              "go": "h_b2",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "¿Tienen nombre?",
              "tone": "broma",
              "say": [
                "Números. Pero esa de ahí… la llamo «Persistencia». No se lo cuentes a Jayce."
              ],
              "go": "h_b2",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "¿Podrían limpiar el aire?",
              "tone": "pregunta",
              "say": [
                "Es mi hipótesis. Si absorben lo que nos mata… quizá podamos aprender de ellas."
              ],
              "go": "h_b2",
              "fx": {
                "stats": {
                  "ingenio": 1
                }
              }
            }
          ]
        },
        "h_b2": {
          "say": [
            "Mi madre cultivaba algo parecido en una lata, junto a la ventana. Es lo poco que recuerdo de ella."
          ],
          "opts": [
            {
              "t": "Entonces estas plantas son un homenaje.",
              "tone": "amable",
              "say": [
                "(Se queda quieto.) Nunca lo había pensado así. Gracias."
              ],
              "go": "h_b3",
              "fx": {
                "aff": 2
              }
            },
            {
              "t": "¿Qué más recuerdas?",
              "tone": "pregunta",
              "say": [
                "Una canción sin letra. La tarareo a veces cuando calibro. Jayce cree que es una fórmula."
              ],
              "go": "h_b3"
            },
            {
              "t": "No hace falta que hables de eso.",
              "tone": "serio",
              "say": [
                "Lo sé. Pero contigo, curiosamente, no me cuesta."
              ],
              "go": "h_b3",
              "fx": {
                "aff": 1
              }
            }
          ]
        },
        "h_b3": {
          "say": [
            "Suficiente botánica sentimental. Mi reputación de hombre serio peligra."
          ],
          "opts": [
            {
              "t": "Tu secreto está a salvo.",
              "tone": "broma",
              "say": [
                "Excelente. Ahora volvamos a cosas frías y lógicas."
              ],
              "go": "h_a1"
            },
            {
              "t": "Háblame del dolor. Si quieres.",
              "tone": "serio",
              "say": [
                "Si quiero. Vale."
              ],
              "go": "h_c1"
            },
            {
              "t": "¿Seguimos charlando?",
              "tone": "amable",
              "say": [
                "Mientras la tos me lo permita."
              ],
              "go": "h_raiz"
            }
          ]
        },
        "h_c1": {
          "say": [
            "El dolor es información. Te dice dónde está el límite. Lo difícil es cuando el límite eres tú."
          ],
          "again": [
            "Mi opinión sobre el dolor no ha cambiado. Mi pierna tampoco."
          ],
          "opts": [
            {
              "t": "¿Te duele mucho la pierna?",
              "tone": "amable",
              "say": [
                "Cada día. Pero me ha enseñado a caminar despacio y mirar dónde piso. Hay peores maestros."
              ],
              "go": "h_c2",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "¿Y si pudieras eliminar el dolor?",
              "tone": "astuto",
              "say": [
                "(Te mira fijamente.) Esa es la pregunta más peligrosa que me han hecho nunca. Y la que más me tienta."
              ],
              "go": "h_c2",
              "fx": {
                "stats": {
                  "ingenio": 1
                }
              }
            },
            {
              "t": "El dolor también nos hace humanos.",
              "tone": "serio",
              "say": [
                "Quizá. O quizá solo es lo que nos decimos para soportarlo."
              ],
              "go": "h_c2"
            }
          ]
        },
        "h_c2": {
          "say": [
            "Jayce no lo entiende. Él tiene prisa por cambiar el mundo. Yo tengo prisa porque el tiempo se me acaba."
          ],
          "opts": [
            {
              "t": "Entonces pasa el tiempo que tengas con gente que te quiera.",
              "tone": "amable",
              "say": [
                "(Baja la mirada.) Es un consejo poco científico. Y muy difícil de refutar."
              ],
              "go": "h_c3",
              "fx": {
                "aff": 2
              }
            },
            {
              "t": "Díselo a Jayce. Te escuchará.",
              "tone": "serio",
              "say": [
                "Lo intento. Pero él siempre oye la parte del «cambiar el mundo»."
              ],
              "go": "h_c3"
            },
            {
              "t": "Pues trabajemos rápido. Te ayudo.",
              "tone": "astuto",
              "say": [
                "Acepto. Aunque te advierto: mis horarios no son humanos."
              ],
              "go": "h_c3",
              "fx": {
                "aff": 1
              }
            }
          ]
        },
        "h_c3": {
          "say": [
            "(Tose y sonríe a la vez.) Hablar contigo es eficiente. Ni una palabra desperdiciada."
          ],
          "opts": [
            {
              "t": "Enséñame tus plantas otra vez.",
              "tone": "amable",
              "say": [
                "Con gusto. Persistencia te echaba de menos."
              ],
              "go": "h_b1"
            },
            {
              "t": "Volvamos a la ciencia.",
              "tone": "pregunta",
              "say": [
                "Mi tema favorito. No lo digas en voz alta."
              ],
              "go": "h_a1"
            },
            {
              "t": "Eso es lo más bonito que me ha dicho un científico.",
              "tone": "coqueto",
              "say": [
                "Los científicos tenemos el listón muy bajo. Pero lo decía en serio."
              ],
              "go": "h_raiz",
              "fx": {
                "aff": 1
              }
            }
          ]
        }
      }
    },
    "mel": {
      "entry": {
        "t": "Mel, ¿me concedes una conversación larga?",
        "tone": "astuto",
        "go": "h_raiz"
      },
      "nodes": {
        "h_raiz": {
          "say": [
            "(Sirve dos copas de vino de Noxus.) Una conversación larga es un lujo que pocos se atreven a pedir. Me intrigas. Siéntate."
          ],
          "again": [
            "Has vuelto. En política, la constancia es una forma de poder. ¿De qué hablamos?",
            "Tu copa te estaba esperando. Yo también, un poco."
          ],
          "opts": [
            {
              "t": "¿Qué es para ti la belleza?",
              "tone": "pregunta",
              "go": "h_a1"
            },
            {
              "t": "¿Cómo era tu infancia en Noxus?",
              "tone": "serio",
              "go": "h_b1"
            },
            {
              "t": "Enséñame a negociar.",
              "tone": "astuto",
              "go": "h_c1"
            }
          ]
        },
        "h_a1": {
          "say": [
            "La belleza es lo que la gente protege aunque no le dé de comer. Por eso dice tanto de una ciudad."
          ],
          "again": [
            "Sigo creyendo lo mismo de la belleza. Pero me gusta oírte discutirlo."
          ],
          "opts": [
            {
              "t": "¿Y qué protege Piltover?",
              "tone": "astuto",
              "say": [
                "Sus fachadas. Zaun protege sus murales. Saca tus propias conclusiones."
              ],
              "go": "h_a2",
              "fx": {
                "rep": {
                  "zaun": 1
                }
              }
            },
            {
              "t": "Para mí la belleza está en la gente.",
              "tone": "amable",
              "say": [
                "Respuesta peligrosa. La gente cambia; los cuadros no. Pero me gusta."
              ],
              "go": "h_a2",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "Tú eres lo más bonito de esta sala.",
              "tone": "coqueto",
              "say": [
                "(Sonríe, sin inmutarse.) Halagar a una Medarda es fácil. Sorprenderla, no. Sigue intentándolo."
              ],
              "go": "h_a2"
            }
          ]
        },
        "h_a2": {
          "say": [
            "¿Ves esa escultura? La compré a un artista de Zaun que firmaba con un nombre falso. Le daba miedo que en Piltover supieran de dónde venía."
          ],
          "opts": [
            {
              "t": "Eso es muy triste.",
              "tone": "serio",
              "say": [
                "Es muy Piltover. Por eso la tengo en la entrada: para que cada consejero que viene pase por delante."
              ],
              "go": "h_a3"
            },
            {
              "t": "¿Le dijiste que su obra valía?",
              "tone": "amable",
              "say": [
                "Le pagué el triple. Es la forma más clara de decirlo en esta ciudad."
              ],
              "go": "h_a3",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "¿Cuánto costó?",
              "tone": "broma",
              "say": [
                "Menos que una cena con el consejero Bolbok. Y es mucho mejor compañía."
              ],
              "go": "h_a3",
              "fx": {
                "aff": 1
              }
            }
          ]
        },
        "h_a3": {
          "say": [
            "El arte me enseñó a mirar. La política, a fingir que no miro."
          ],
          "opts": [
            {
              "t": "¿Y quién te enseñó la política?",
              "tone": "pregunta",
              "say": [
                "Mi madre. Aunque ella lo llamaba «sobrevivir». Te cuento."
              ],
              "go": "h_b1"
            },
            {
              "t": "Enséñame a fingir que no miro.",
              "tone": "astuto",
              "say": [
                "Primera lección gratuita. Las demás tendrás que negociarlas."
              ],
              "go": "h_c1",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "Volvamos a empezar, con otra copa.",
              "tone": "broma",
              "say": [
                "Una propuesta excelente. Aprobada por unanimidad."
              ],
              "go": "h_raiz"
            }
          ]
        },
        "h_b1": {
          "say": [
            "(Gira la copa despacio.) Crecí entre lobos, literalmente: la casa Medarda tiene lobos en los escudos y en el carácter. Yo era la hija que pintaba."
          ],
          "again": [
            "Noxus otra vez. Siempre vuelves a lo que más me cuesta. Eso es buena estrategia."
          ],
          "opts": [
            {
              "t": "¿Y eso era malo?",
              "tone": "pregunta",
              "say": [
                "En Noxus, la debilidad se huele. Y un pincel se parece demasiado a una debilidad."
              ],
              "go": "h_b2"
            },
            {
              "t": "Pintar también es valiente.",
              "tone": "amable",
              "say": [
                "(Te sostiene la mirada.) Ojalá alguien me lo hubiera dicho entonces."
              ],
              "go": "h_b2",
              "fx": {
                "aff": 2
              }
            },
            {
              "t": "Una loba que pinta. Me gusta.",
              "tone": "coqueto",
              "say": [
                "Cuidado. Los lobos que pintan también muerden."
              ],
              "go": "h_b2",
              "fx": {
                "aff": 1
              }
            }
          ]
        },
        "h_b2": {
          "say": [
            "Mi madre me envió a Piltover para protegerme. O para alejarme. Con ella, nunca sabes cuál de las dos."
          ],
          "opts": [
            {
              "t": "Quizá las dos cosas.",
              "tone": "astuto",
              "say": [
                "(Ríe sin alegría.) Eres más perspicaz de lo que aparentas. Probablemente las dos."
              ],
              "go": "h_b3",
              "fx": {
                "stats": {
                  "ingenio": 1
                }
              }
            },
            {
              "t": "¿La echas de menos?",
              "tone": "amable",
              "say": [
                "Echo de menos a la madre que imaginaba. La de verdad me escribe cartas con órdenes."
              ],
              "go": "h_b3"
            },
            {
              "t": "Piltover te ha sentado bien.",
              "tone": "amable",
              "say": [
                "Piltover me ha dado un consejo, una galería y… algunas personas. Sí. Me ha sentado bien."
              ],
              "go": "h_b3",
              "fx": {
                "aff": 1
              }
            }
          ]
        },
        "h_b3": {
          "say": [
            "Bueno. Suficientes confesiones para una tarde. Me debes una tuya."
          ],
          "opts": [
            {
              "t": "A veces no sé de qué lado estoy.",
              "tone": "serio",
              "say": [
                "Eso no es una debilidad. Es la única posición desde la que se ve todo el tablero. Te enseñaré a usarla."
              ],
              "go": "h_c1",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "Me da miedo el agua profunda.",
              "tone": "broma",
              "say": [
                "¿Esa es tu gran confesión? (Ríe.) Entonces no te llevaré nunca a Noxus por mar. Hablemos de cosas bonitas."
              ],
              "go": "h_a1",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "Esa la guardo para otro día.",
              "tone": "astuto",
              "say": [
                "Sabia decisión. Nunca entregues todo en la primera ronda."
              ],
              "go": "h_raiz"
            }
          ]
        },
        "h_c1": {
          "say": [
            "Lección uno: nunca digas lo que quieres primero. Pregunta qué teme el otro. El miedo es más honesto que el deseo."
          ],
          "again": [
            "¿Repasamos? La lección uno nunca está de más."
          ],
          "opts": [
            {
              "t": "¿Y qué temes tú, Mel?",
              "tone": "astuto",
              "say": [
                "(Sonríe.) Muy bien. Has aprendido rápido. No pienso contestar, claro."
              ],
              "go": "h_c2",
              "fx": {
                "aff": 1,
                "stats": {
                  "ingenio": 1
                }
              }
            },
            {
              "t": "Eso suena manipulador.",
              "tone": "duro",
              "say": [
                "Suena a sobrevivir en una sala llena de gente que sí manipula. Elige tu bando."
              ],
              "go": "h_c2"
            },
            {
              "t": "Apuntado. ¿Lección dos?",
              "tone": "pregunta",
              "say": [
                "Impaciente. Me gusta."
              ],
              "go": "h_c2"
            }
          ]
        },
        "h_c2": {
          "say": [
            "Lección dos: el silencio es una oferta. Quien lo rompe primero, cede algo. (Te mira en silencio. Mucho rato.)"
          ],
          "opts": [
            {
              "t": "(Aguantar el silencio.)",
              "tone": "sigilo",
              "say": [
                "(Al final, ella sonríe primero.) Has ganado. No se lo cuentes a nadie del Consejo."
              ],
              "go": "h_c3",
              "fx": {
                "aff": 2
              }
            },
            {
              "t": "Vale, vale, me rindo. ¡Qué tensión!",
              "tone": "broma",
              "say": [
                "Has cedido. Me debes un favor. Así funciona Piltover."
              ],
              "go": "h_c3"
            },
            {
              "t": "Me gusta mirarte en silencio.",
              "tone": "coqueto",
              "say": [
                "(Arquea una ceja.) Eso no es negociar. Es hacer trampa. …Pero cuenta."
              ],
              "go": "h_c3",
              "fx": {
                "aff": 1
              }
            }
          ]
        },
        "h_c3": {
          "say": [
            "Tienes talento. Si alguna vez quieres un asiento en una mesa importante, ya sabes a quién preguntar."
          ],
          "opts": [
            {
              "t": "Prefiero un asiento a tu lado.",
              "tone": "coqueto",
              "say": [
                "Eso se negocia aparte. Siguiente tema."
              ],
              "go": "h_raiz",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "Háblame más de arte.",
              "tone": "amable",
              "say": [
                "Con mucho gusto. Es mi refugio."
              ],
              "go": "h_a1"
            },
            {
              "t": "¿Y Noxus? Cuéntame más.",
              "tone": "pregunta",
              "say": [
                "Siempre Noxus. Está bien."
              ],
              "go": "h_b1"
            }
          ]
        }
      }
    },
    "heimerdinger": {
      "entry": {
        "t": "Profesor, ¿tiene tiempo para una charla larga?",
        "tone": "amable",
        "go": "h_raiz"
      },
      "nodes": {
        "h_raiz": {
          "say": [
            "¡Tiempo! Ja, ja. Tengo más de doscientos años de él. Lo que me falta es interlocutores pacientes. Adelante, adelante."
          ],
          "again": [
            "¡Mi joven colega! ¿Retomamos? He estado pensando en nuestra última charla durante… unos minutos. Mucho, para mí.",
            "(Se ajusta las gafas.) Ah, sí, sí. Siéntese. Cuidado con ese cable, está vivo. Bueno, electrificado."
          ],
          "opts": [
            {
              "t": "¿Cómo es su hogar, Bandle?",
              "tone": "pregunta",
              "go": "h_a1"
            },
            {
              "t": "¿Qué ha aprendido en dos siglos?",
              "tone": "serio",
              "go": "h_b1"
            },
            {
              "t": "¿Cuál ha sido su peor invento?",
              "tone": "broma",
              "go": "h_c1"
            }
          ]
        },
        "h_a1": {
          "say": [
            "¡Oh, Bandle! Colores que aquí no tienen nombre. El tiempo allí no corre, pasea. Y huele a pan recién horneado casi siempre."
          ],
          "again": [
            "Bandle sigue igual, supongo. Allí casi nada cambia. Es su encanto y su defecto."
          ],
          "opts": [
            {
              "t": "¿Por qué se marchó?",
              "tone": "pregunta",
              "say": [
                "Curiosidad, mi joven colega. La curiosidad es un picor que no se rasca quedándose quieto."
              ],
              "go": "h_a2"
            },
            {
              "t": "Me encantaría verlo.",
              "tone": "amable",
              "say": [
                "Quizá algún día. Pero le advierto: los humanos que entran salen con el pelo de colores y sin saber qué día es."
              ],
              "go": "h_a2",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "¿Allí todos son tan bajitos?",
              "tone": "broma",
              "say": [
                "(Se estira todo lo que puede.) ¡Allí lo raro sería usted! ¡Un gigante torpe!"
              ],
              "go": "h_a2",
              "fx": {
                "aff": 1
              }
            }
          ]
        },
        "h_a2": {
          "say": [
            "Llegué a Piltover cuando era un puerto de pescadores con ambiciones. He visto crecer cada torre. Y caer alguna."
          ],
          "opts": [
            {
              "t": "¿Cómo era entonces?",
              "tone": "pregunta",
              "say": [
                "Más pequeño. Más honesto. La gente se saludaba sin calcular cuánto valía el otro."
              ],
              "go": "h_a3"
            },
            {
              "t": "Debe de ser duro ver cambiar todo.",
              "tone": "amable",
              "say": [
                "Lo duro es ver a la gente irse. Los edificios, al menos, dejan ruinas que visitar."
              ],
              "go": "h_a3",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "Usted es más viejo que la ciudad.",
              "tone": "broma",
              "say": [
                "¡Más sabio, querrá decir! La edad es solo un dato. La sabiduría es lo que haces con él."
              ],
              "go": "h_a3"
            }
          ]
        },
        "h_a3": {
          "say": [
            "(Suspira.) A veces echo de menos Bandle. Luego un alumno me trae una pregunta imposible y se me pasa."
          ],
          "opts": [
            {
              "t": "Pues aquí va una: ¿qué ha aprendido en dos siglos?",
              "tone": "pregunta",
              "say": [
                "¡Ja! Esa sí que es imposible. Me encanta."
              ],
              "go": "h_b1",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "¿Y su peor invento?",
              "tone": "broma",
              "say": [
                "Oh, no. Esa historia. Bueno, vale."
              ],
              "go": "h_c1"
            },
            {
              "t": "Le hacemos compañía, profesor.",
              "tone": "amable",
              "say": [
                "(Se le humedecen los ojos tras las gafas.) Muy amable. Muy, muy amable."
              ],
              "go": "h_raiz",
              "fx": {
                "aff": 1
              }
            }
          ]
        },
        "h_b1": {
          "say": [
            "Que la prisa es la madre de casi todos los desastres. Y que el té se enfría si hablas demasiado."
          ],
          "again": [
            "Sigo pensando lo mismo: sin prisa. Y el té, caliente."
          ],
          "opts": [
            {
              "t": "¿Por eso desconfía de la hextec?",
              "tone": "astuto",
              "say": [
                "No desconfío de la hextec. Desconfío de la prisa con que la quieren. Son cosas distintas."
              ],
              "go": "h_b2",
              "fx": {
                "stats": {
                  "ingenio": 1
                }
              }
            },
            {
              "t": "Se le está enfriando el té ahora mismo.",
              "tone": "broma",
              "say": [
                "¡Oh, cielos! (Bebe de un trago.) Lección práctica, ¿ve?"
              ],
              "go": "h_b2",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "A veces hay que actuar rápido.",
              "tone": "duro",
              "say": [
                "A veces. Y casi siempre la gente cree que es una de esas veces."
              ],
              "go": "h_b2"
            }
          ]
        },
        "h_b2": {
          "say": [
            "También he aprendido que los mejores alumnos son los que te contradicen. Y los que más te rompen el corazón."
          ],
          "opts": [
            {
              "t": "¿Lo dice por Viktor y Jayce?",
              "tone": "pregunta",
              "say": [
                "Lo digo por todos. Pero sí. Por ellos sobre todo."
              ],
              "go": "h_b3"
            },
            {
              "t": "Usted les quiere mucho.",
              "tone": "amable",
              "say": [
                "Como a los hijos que nunca tuve. Por eso les grito. Es la tradición."
              ],
              "go": "h_b3",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "Yo le contradeciría encantado.",
              "tone": "astuto",
              "say": [
                "¡Excelente! Pero con argumentos, por favor. Lo de gritar lo dejo para mí."
              ],
              "go": "h_b3",
              "fx": {
                "aff": 1
              }
            }
          ]
        },
        "h_b3": {
          "say": [
            "Bueno, bueno. Me pongo filosófico y luego no duermo. ¿Y usted qué ha aprendido, en sus pocos añitos?"
          ],
          "opts": [
            {
              "t": "Que no hay que rendirse.",
              "tone": "serio",
              "say": [
                "Buena lección. Aunque a veces rendirse a tiempo también es sabio. Hablemos de cosas más ligeras."
              ],
              "go": "h_c1"
            },
            {
              "t": "Que la gente mayor sabe mucho.",
              "tone": "amable",
              "say": [
                "¡Adulador{g:|a|e}! Me gusta. Le contaré más de Bandle."
              ],
              "go": "h_a1",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "Todavía nada, por eso pregunto.",
              "tone": "broma",
              "say": [
                "¡La respuesta de un científico! Empecemos de nuevo, pues."
              ],
              "go": "h_raiz"
            }
          ]
        },
        "h_c1": {
          "say": [
            "(Se tapa la cara.) Un calcetín autoatable. Se ató solo. A mi tobillo. Durante tres días. Hubo que llamar a un herrero."
          ],
          "again": [
            "Sí, sí, el calcetín. Todo el mundo quiere oír lo del calcetín."
          ],
          "opts": [
            {
              "t": "(Reírse sin poder parar.)",
              "tone": "broma",
              "say": [
                "¡No tiene gracia! …Bueno, un poco. El herrero se rió durante una semana."
              ],
              "go": "h_c2",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "¿Y qué aprendió de aquello?",
              "tone": "pregunta",
              "say": [
                "Que hay que poner un botón de apagado a todo. A TODO. Grábeselo."
              ],
              "go": "h_c2",
              "fx": {
                "stats": {
                  "ingenio": 1
                }
              }
            },
            {
              "t": "Lo podría vender en Zaun.",
              "tone": "astuto",
              "say": [
                "¡Ni se le ocurra! Alguien acabaría usándolo de arma. Es Zaun."
              ],
              "go": "h_c2"
            }
          ]
        },
        "h_c2": {
          "say": [
            "Hubo otros. Un paraguas que llovía hacia dentro. Un reloj que adelantaba el ánimo en lugar de la hora…"
          ],
          "opts": [
            {
              "t": "¡Quiero ese reloj!",
              "tone": "amable",
              "say": [
                "Lo desmonté. Ponía a todo el mundo eufórico a las tres de la madrugada. Peligrosísimo."
              ],
              "go": "h_c3"
            },
            {
              "t": "¿Algún invento salió bien?",
              "tone": "pregunta",
              "say": [
                "¡Cientos! Pero esos no los cuenta nadie. Los fracasos son mucho más divertidos."
              ],
              "go": "h_c3"
            },
            {
              "t": "Usted es un genio un poco desastre.",
              "tone": "broma",
              "say": [
                "¡Las dos cosas van juntas! Pregunte a cualquier genio. Si encuentra uno ordenado, desconfíe."
              ],
              "go": "h_c3",
              "fx": {
                "aff": 1
              }
            }
          ]
        },
        "h_c3": {
          "say": [
            "¡Ay! Me lo estoy pasando en grande. Hace décadas que nadie me pregunta por mis desastres con tanto interés."
          ],
          "opts": [
            {
              "t": "Hábleme otra vez de Bandle.",
              "tone": "amable",
              "say": [
                "¡Con mucho gusto! Póngase cómod{g:o|a|e}."
              ],
              "go": "h_a1"
            },
            {
              "t": "¿Y la lección de la prisa?",
              "tone": "serio",
              "say": [
                "Ah, la importante. Escuche bien."
              ],
              "go": "h_b1"
            },
            {
              "t": "Vuelvo enseguida con más preguntas.",
              "tone": "broma",
              "say": [
                "¡Aquí estaré! Llevo dos siglos aquí, unos minutos más no importan."
              ],
              "go": "h_raiz"
            }
          ]
        }
      }
    },
    "silco": {
      "entry": {
        "t": "Silco. Hablemos sin prisas. De verdad.",
        "tone": "astuto",
        "go": "h_raiz"
      },
      "nodes": {
        "h_raiz": {
          "say": [
            "(Deja el vaso sobre la mesa sin apartar el ojo de ti.) Muy pocos se sientan frente a mí sin querer algo. Veamos qué quieres tú."
          ],
          "again": [
            "Otra vez aquí. O tienes mucho valor o mucha curiosidad. En Zaun, ambas cosas acortan la vida.",
            "(Hace un gesto hacia la silla.) Siéntate. Hoy estoy de humor para escuchar."
          ],
          "opts": [
            {
              "t": "¿Cómo era Zaun cuando eras joven?",
              "tone": "pregunta",
              "go": "h_a1"
            },
            {
              "t": "¿Qué significa para ti el poder?",
              "tone": "astuto",
              "go": "h_b1"
            },
            {
              "t": "¿Qué haces cuando nadie te ve?",
              "tone": "serio",
              "go": "h_c1"
            }
          ]
        },
        "h_a1": {
          "say": [
            "Más oscura. Más pobre. Más unida. Éramos ratas, pero ratas que compartían el queso."
          ],
          "again": [
            "El pasado no cambia por mucho que lo mires. Pero sigues mirándolo conmigo."
          ],
          "opts": [
            {
              "t": "¿Y qué cambió?",
              "tone": "pregunta",
              "say": [
                "Que Piltover nos enseñó que compartir no basta si alguien te pisa desde arriba."
              ],
              "go": "h_a2"
            },
            {
              "t": "Suenas nostálgico.",
              "tone": "amable",
              "say": [
                "(Una sonrisa fría.) La nostalgia es un lujo. Pero esta noche me lo permito."
              ],
              "go": "h_a2",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "Las ratas siguen siendo ratas.",
              "tone": "duro",
              "say": [
                "Y aun así, las ratas sobreviven a todo. Recuérdalo cuando te creas por encima."
              ],
              "go": "h_a2",
              "fx": {
                "aff": -1
              }
            }
          ]
        },
        "h_a2": {
          "say": [
            "Vander y yo soñábamos con una nación. No una ciudad debajo de otra: una nación. Con su propia bandera."
          ],
          "opts": [
            {
              "t": "¿Cómo sería esa bandera?",
              "tone": "pregunta",
              "say": [
                "(Piensa un momento.) Verde. Como el humo que nos dieron. Lo convertiríamos en orgullo."
              ],
              "go": "h_a3"
            },
            {
              "t": "Todavía puedes construirla sin Brillo.",
              "tone": "serio",
              "say": [
                "¿Sin Brillo? Las naciones se construyen con lo que hay a mano. A mí me dejaron poco."
              ],
              "go": "h_a3",
              "fx": {
                "rep": {
                  "zaun": 1
                }
              }
            },
            {
              "t": "Qué pena que os separarais.",
              "tone": "amable",
              "say": [
                "(Tamborilea los dedos.) Pena. Sí. Esa es una palabra."
              ],
              "go": "h_a3"
            }
          ]
        },
        "h_a3": {
          "say": [
            "Suficiente historia. Los recuerdos son como el Brillo: un poco te hace fuerte, demasiado te deshace."
          ],
          "opts": [
            {
              "t": "Entonces hablemos de poder.",
              "tone": "astuto",
              "say": [
                "Mi tema favorito. Por fin una pregunta útil."
              ],
              "go": "h_b1",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "¿Qué haces cuando estás solo?",
              "tone": "serio",
              "say": [
                "Pregunta peligrosa. Pero te la dejo pasar."
              ],
              "go": "h_c1"
            },
            {
              "t": "Vale. Empecemos de nuevo.",
              "tone": "pregunta",
              "say": [
                "Como Zaun. Siempre empezando de nuevo."
              ],
              "go": "h_raiz"
            }
          ]
        },
        "h_b1": {
          "say": [
            "El poder es que te escuchen sin tener que gritar. Piltover lo tiene de nacimiento. Yo lo tuve que fabricar."
          ],
          "again": [
            "¿Otra lección sobre el poder? Te advierto que las cobro."
          ],
          "opts": [
            {
              "t": "¿Y a qué precio?",
              "tone": "serio",
              "say": [
                "A todos los precios. Cada uno de ellos lo volvería a pagar."
              ],
              "go": "h_b2"
            },
            {
              "t": "Yo te escucho sin que grites.",
              "tone": "astuto",
              "say": [
                "(Inclina la cabeza.) Entonces o me temes o me respetas. Ambas me sirven."
              ],
              "go": "h_b2",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "El poder sin justicia es tiranía.",
              "tone": "duro",
              "say": [
                "La justicia es lo que los poderosos escriben después. Lee la historia de Piltover si no me crees."
              ],
              "go": "h_b2"
            }
          ]
        },
        "h_b2": {
          "say": [
            "Lo que nadie entiende es que el poder no se tiene. Se mantiene. Cada día. Como una herida que no dejas cerrar."
          ],
          "opts": [
            {
              "t": "Eso suena agotador.",
              "tone": "amable",
              "say": [
                "Lo es. Nadie pregunta si estoy cansado. Hasta hoy."
              ],
              "go": "h_b3",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "¿Cómo lo mantienes?",
              "tone": "pregunta",
              "say": [
                "Sabiendo lo que todos temen. Y no temiendo nada visible."
              ],
              "go": "h_b3",
              "fx": {
                "stats": {
                  "ingenio": 1
                }
              }
            },
            {
              "t": "Algún día se te cerrará.",
              "tone": "duro",
              "say": [
                "(Te mira largo rato.) Puede. Pero no será hoy, ni por tu mano."
              ],
              "go": "h_b3"
            }
          ]
        },
        "h_b3": {
          "say": [
            "Me has hecho hablar más de la cuenta. Eso, en otro, sería motivo de preocupación."
          ],
          "opts": [
            {
              "t": "Y en mí, ¿qué es?",
              "tone": "coqueto",
              "say": [
                "Una rareza. Las rarezas me interesan. Sigamos."
              ],
              "go": "h_c1",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "Cuéntame más del pasado.",
              "tone": "pregunta",
              "say": [
                "El pasado. Siempre vuelves a él. Como yo."
              ],
              "go": "h_a1"
            },
            {
              "t": "Mejor cambio de tema.",
              "tone": "sigilo",
              "say": [
                "Prudente. Zaun premia la prudencia. A veces."
              ],
              "go": "h_raiz"
            }
          ]
        },
        "h_c1": {
          "say": [
            "(Mira hacia la ventana.) Escucho a Jinx trastear en su taller. Si hace ruido, está bien. Es el silencio lo que me inquieta."
          ],
          "again": [
            "Esta noche hay ruido en el taller. Buena señal."
          ],
          "opts": [
            {
              "t": "La quieres de verdad.",
              "tone": "amable",
              "say": [
                "(Un silencio largo.) Es lo único que he hecho bien. No se lo digas a nadie. Ni a ella."
              ],
              "go": "h_c2",
              "fx": {
                "aff": 2
              }
            },
            {
              "t": "¿Y si el ruido es una bomba?",
              "tone": "broma",
              "say": [
                "Entonces también está bien. Con Jinx, las bombas son buena señal."
              ],
              "go": "h_c2",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "La estás usando.",
              "tone": "duro",
              "say": [
                "(Su ojo se oscurece.) Ten mucho cuidado con lo que dices de mi hija."
              ],
              "go": "h_c2",
              "fx": {
                "aff": -2
              }
            }
          ]
        },
        "h_c2": {
          "say": [
            "También leo. Poesía, sí. No pongas esa cara. Zaun tiene poetas; solo que se mueren antes de publicar."
          ],
          "opts": [
            {
              "t": "¿Me recitas algo?",
              "tone": "amable",
              "say": [
                "«Del barro nace el que no pidió nacer, y aun así se levanta.» (Pausa.) No es mío. O sí. No lo sabrás nunca."
              ],
              "go": "h_c3",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "Un capo poeta. Ya lo he visto todo.",
              "tone": "broma",
              "say": [
                "Aún no has visto nada. Y es mejor así."
              ],
              "go": "h_c3"
            },
            {
              "t": "¿Qué poetas te gustan?",
              "tone": "pregunta",
              "say": [
                "Los que escriben desde abajo. Los de arriba escriben sobre flores que nunca han tenido que regar."
              ],
              "go": "h_c3"
            }
          ]
        },
        "h_c3": {
          "say": [
            "Es tarde. Pero la noche en Zaun es larga, y la conversación no es mala."
          ],
          "opts": [
            {
              "t": "Hablemos de poder otra vez.",
              "tone": "astuto",
              "say": [
                "Insaciable. Me recuerdas a alguien."
              ],
              "go": "h_b1"
            },
            {
              "t": "Cuéntame de la Zaun de antes.",
              "tone": "pregunta",
              "say": [
                "La de antes. Bien."
              ],
              "go": "h_a1"
            },
            {
              "t": "Otra ronda, entonces.",
              "tone": "amable",
              "say": [
                "(Rellena los dos vasos.) Otra ronda."
              ],
              "go": "h_raiz"
            }
          ]
        }
      }
    },
    "vander": {
      "entry": {
        "t": "Vander, ¿me pones algo y charlamos un buen rato?",
        "tone": "amable",
        "go": "h_raiz"
      },
      "nodes": {
        "h_raiz": {
          "say": [
            "(Limpia un vaso con un trapo que ha visto días mejores.) Para eso está la barra. Dispara."
          ],
          "again": [
            "Vuelves. Bien. La Última Gota echa de menos a la gente que habla en vez de pelear.",
            "(Te pone una jarra sin preguntar.) La de siempre. ¿De qué hablamos?"
          ],
          "opts": [
            {
              "t": "¿Cómo acabaste con una taberna?",
              "tone": "pregunta",
              "go": "h_a1"
            },
            {
              "t": "¿Cómo se cría a cuatro críos en Zaun?",
              "tone": "amable",
              "go": "h_b1"
            },
            {
              "t": "¿Por qué dejaste de luchar?",
              "tone": "serio",
              "go": "h_c1"
            }
          ]
        },
        "h_a1": {
          "say": [
            "Necesitaba un sitio donde la gente pudiera estar sin que nadie les pidiera nada. Y donde yo pudiera vigilar sin que pareciera que vigilo."
          ],
          "again": [
            "La taberna sigue en pie. Más o menos. Ayer alguien rompió otra silla."
          ],
          "opts": [
            {
              "t": "¿Vigilar el qué?",
              "tone": "pregunta",
              "say": [
                "Que nadie se pase de la raya. Ni de un lado ni del otro del puente."
              ],
              "go": "h_a2"
            },
            {
              "t": "Es el mejor sitio de Zaun.",
              "tone": "amable",
              "say": [
                "(Sonríe bajo la barba.) No se lo digas a los parroquianos, que me suben el precio de la paciencia."
              ],
              "go": "h_a2",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "La cerveza está aguada.",
              "tone": "broma",
              "say": [
                "¡Aguada! (Ríe con todo el pecho.) Te la cambio por agua del sumidero, a ver qué prefieres."
              ],
              "go": "h_a2",
              "fx": {
                "aff": 1
              }
            }
          ]
        },
        "h_a2": {
          "say": [
            "Aquí han pasado cosas. Bodas, peleas, un parto una vez, en esa mesa del fondo. La gente vuelve a los sitios donde se siente en casa."
          ],
          "opts": [
            {
              "t": "¿Un parto? ¡Cuenta!",
              "tone": "broma",
              "say": [
                "Una tormenta, las calles inundadas y yo con un trapo y agua caliente. La niña se llama Gota. Ya te imaginas por qué."
              ],
              "go": "h_a3",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "Para mucha gente, tú eres la casa.",
              "tone": "amable",
              "say": [
                "(Se queda quieto con el vaso en la mano.) Eso pesa más de lo que parece."
              ],
              "go": "h_a3",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "¿Y las peleas quién las paraba?",
              "tone": "pregunta",
              "say": [
                "(Se señala los puños.) Estos dos. Con mucha diplomacia."
              ],
              "go": "h_a3"
            }
          ]
        },
        "h_a3": {
          "say": [
            "Bueno, basta de mi taberna. Que parezco un viejo contando batallitas."
          ],
          "opts": [
            {
              "t": "Háblame de los chicos.",
              "tone": "amable",
              "say": [
                "Ah, los chicos. Eso sí que es una batalla."
              ],
              "go": "h_b1",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "¿Y las batallas de verdad?",
              "tone": "serio",
              "say": [
                "(Deja de limpiar.) Esas son otra cosa."
              ],
              "go": "h_c1"
            },
            {
              "t": "Ponme otra y empezamos de nuevo.",
              "tone": "broma",
              "say": [
                "Esta la pagas. Bueno, ya veremos."
              ],
              "go": "h_raiz"
            }
          ]
        },
        "h_b1": {
          "say": [
            "¿Cuatro? Con paciencia, cinta adhesiva y no preguntando de dónde salen las cosas que traen. Vi pega, Powder inventa, Mylo roba, Claggor arregla."
          ],
          "again": [
            "Los chicos siguen igual de terremotos. Hoy Powder ha volado el váter. Otra vez."
          ],
          "opts": [
            {
              "t": "¿Y tú qué haces?",
              "tone": "pregunta",
              "say": [
                "Yo pago los platos rotos. Literalmente. Tengo una lista."
              ],
              "go": "h_b2",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "No son tuyos, y aun así los cuidas.",
              "tone": "amable",
              "say": [
                "(Serio.) Son míos. La sangre no tiene nada que ver."
              ],
              "go": "h_b2",
              "fx": {
                "aff": 2
              }
            },
            {
              "t": "Mylo roba, ¿eh? Me cae bien.",
              "tone": "broma",
              "say": [
                "No le digas eso, que se lo cree. Ya bastante ego tiene para su tamaño."
              ],
              "go": "h_b2"
            }
          ]
        },
        "h_b2": {
          "say": [
            "Lo que más me asusta es Vi. Tiene mi genio de joven. Y yo de joven estuve a punto de quemar la ciudad."
          ],
          "opts": [
            {
              "t": "Tú la frenarás.",
              "tone": "amable",
              "say": [
                "Eso intento. Pero a los chavales no se les frena: se les enseña a frenarse solos."
              ],
              "go": "h_b3",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "¿Y Powder?",
              "tone": "pregunta",
              "say": [
                "Powder tiene algo… brillante. Y frágil. Necesita que alguien crea en ella. Yo lo hago. Espero que baste."
              ],
              "go": "h_b3"
            },
            {
              "t": "Quizá Vi tenga razón en estar furiosa.",
              "tone": "duro",
              "say": [
                "Razón tiene. Lo que no tiene es un plan. Y la rabia sin plan entierra gente."
              ],
              "go": "h_b3"
            }
          ]
        },
        "h_b3": {
          "say": [
            "(Mira hacia la escalera del ático.) Duermen. Por una vez. Este silencio vale oro."
          ],
          "opts": [
            {
              "t": "Hablemos bajito, entonces.",
              "tone": "sigilo",
              "say": [
                "(Susurra.) Buena idea. Pregúntame lo que quieras. Pero bajito."
              ],
              "go": "h_raiz",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "¿Por qué dejaste de luchar, Vander?",
              "tone": "serio",
              "say": [
                "(Suspira.) Supongo que te lo has ganado."
              ],
              "go": "h_c1"
            },
            {
              "t": "Cuéntame más de la taberna.",
              "tone": "amable",
              "say": [
                "La taberna. Siempre la taberna."
              ],
              "go": "h_a1"
            }
          ]
        },
        "h_c1": {
          "say": [
            "(Se mira los nudillos.) Porque vi lo que cuesta. Gente buena muerta en un puente. Niños sin padres. Me prometí que mis chicos no pagarían ese precio."
          ],
          "again": [
            "Esa promesa sigue en pie. Me cuesta cada día, pero sigue en pie."
          ],
          "opts": [
            {
              "t": "Algunos dicen que te vendiste a Piltover.",
              "tone": "duro",
              "say": [
                "Que lo digan. Prefiero que me llamen traidor a contar críos en la morgue."
              ],
              "go": "h_c2"
            },
            {
              "t": "Hace falta valor para parar.",
              "tone": "amable",
              "say": [
                "Más que para pegar, sí. Nadie te aplaude por no pelear."
              ],
              "go": "h_c2",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "¿Guardas aún los guanteletes?",
              "tone": "pregunta",
              "say": [
                "(Una pausa demasiado larga.) Algunas cosas se guardan para no olvidar. No para usarlas."
              ],
              "go": "h_c2"
            }
          ]
        },
        "h_c2": {
          "say": [
            "Si alguna vez me pasa algo, quiero que alguien les diga a los chicos que estoy orgulloso. Aunque no lo diga lo bastante."
          ],
          "opts": [
            {
              "t": "Díselo tú. Hoy.",
              "tone": "amable",
              "say": [
                "(Te mira un buen rato. Asiente.) Mañana en el desayuno. Antes de que Powder vuele las tostadas."
              ],
              "go": "h_c3",
              "fx": {
                "aff": 2
              }
            },
            {
              "t": "Te lo prometo.",
              "tone": "serio",
              "say": [
                "Gracias. Eso me quita un peso que llevo años cargando."
              ],
              "go": "h_c3",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "No va a pasarte nada, grandullón.",
              "tone": "broma",
              "say": [
                "(Ríe, pero no del todo.) De tu boca a oídos de quien sea que escuche ahí arriba."
              ],
              "go": "h_c3"
            }
          ]
        },
        "h_c3": {
          "say": [
            "Bueno. Basta de ponerse tierno. Que luego Vi me ve los ojos rojos y se cree que he llorado."
          ],
          "opts": [
            {
              "t": "¿Y no has llorado?",
              "tone": "broma",
              "say": [
                "Es el humo de Zaun. Siempre es el humo. Venga, otra cosa."
              ],
              "go": "h_raiz",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "Háblame más de los chicos.",
              "tone": "amable",
              "say": [
                "Nunca me canso de eso."
              ],
              "go": "h_b1"
            },
            {
              "t": "Cuéntame cómo empezó la taberna.",
              "tone": "pregunta",
              "say": [
                "Siéntate bien, que va para largo."
              ],
              "go": "h_a1"
            }
          ]
        }
      }
    },
    "ekko": {
      "entry": {
        "t": "Ekko, ¿charlamos sin mirar el reloj?",
        "tone": "broma",
        "go": "h_raiz"
      },
      "nodes": {
        "h_raiz": {
          "say": [
            "(Se ríe, tocándose el aparato de la muñeca.) ¿Sin mirar el reloj? Eso es difícil para mí. Pero vale, me apunto."
          ],
          "again": [
            "¡Eh! Pensaba que te habías perdido en las Galerías. ¿Seguimos?",
            "(Se deja caer de la rama del árbol.) Llegas justo. Iba a pintar, pero hablar contigo es mejor."
          ],
          "opts": [
            {
              "t": "Háblame de tus murales.",
              "tone": "amable",
              "go": "h_a1"
            },
            {
              "t": "¿Cómo aprendiste a construir cosas?",
              "tone": "pregunta",
              "go": "h_b1"
            },
            {
              "t": "¿Qué te gustaría para Zaun?",
              "tone": "serio",
              "go": "h_c1"
            }
          ]
        },
        "h_a1": {
          "say": [
            "Pinto lo que la gente no quiere olvidar. Y lo que quiere que pase. Las paredes de Zaun son nuestros periódicos."
          ],
          "again": [
            "He pintado uno nuevo desde que viniste. Tiene más colores que el anterior. Progreso."
          ],
          "opts": [
            {
              "t": "¿Cuál es tu favorito?",
              "tone": "pregunta",
              "say": [
                "Uno en las Galerías: un niño con alas de chatarra. La gente le deja flores debajo. No sé por qué. Me gusta no saberlo."
              ],
              "go": "h_a2"
            },
            {
              "t": "Píntame en uno.",
              "tone": "coqueto",
              "say": [
                "¿Tú? Necesitaría mucho color. (Te guiña un ojo.) Vale, te apunto en la lista."
              ],
              "go": "h_a2",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "¿No te pillan los ejecutores?",
              "tone": "broma",
              "say": [
                "¿Pillarme? (Da una voltereta.) Para pillarme tienen que verme primero."
              ],
              "go": "h_a2",
              "fx": {
                "aff": 1
              }
            }
          ]
        },
        "h_a2": {
          "say": [
            "Los críos de las Luciérnagas pintan conmigo. Algunos no saben leer, pero saben dibujar lo que sienten mejor que cualquier poeta de arriba."
          ],
          "opts": [
            {
              "t": "Les estás dando algo muy grande.",
              "tone": "amable",
              "say": [
                "Les doy pintura. Lo grande lo ponen ellos."
              ],
              "go": "h_a3",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "¿Y si les enseñamos a leer también?",
              "tone": "serio",
              "say": [
                "¿Lo harías? (Se le iluminan los ojos.) Hay una caja de libros viejos en el árbol. Nadie sabe usarlos bien."
              ],
              "go": "h_a3",
              "fx": {
                "aff": 2,
                "rep": {
                  "zaun": 1
                }
              }
            },
            {
              "t": "Seguro que pintan monstruos.",
              "tone": "broma",
              "say": [
                "Muchos. Y a mí con la cabeza enorme. Al parecer, es mi rasgo principal."
              ],
              "go": "h_a3"
            }
          ]
        },
        "h_a3": {
          "say": [
            "A veces pienso que el arte es lo único que no nos pueden quitar. Te quitan el aire, el agua, la luz… pero lo pintado, pintado está."
          ],
          "opts": [
            {
              "t": "¿Cómo aprendiste a construir todo esto?",
              "tone": "pregunta",
              "say": [
                "Ah, esa es una historia con mucha chatarra."
              ],
              "go": "h_b1"
            },
            {
              "t": "¿Y qué pintarías para el futuro de Zaun?",
              "tone": "serio",
              "say": [
                "El futuro… buena pregunta."
              ],
              "go": "h_c1"
            },
            {
              "t": "Vuelve a empezar, que me encanta oírte.",
              "tone": "amable",
              "say": [
                "(Se rasca la nuca, cortado.) Vale, vale."
              ],
              "go": "h_raiz",
              "fx": {
                "aff": 1
              }
            }
          ]
        },
        "h_b1": {
          "say": [
            "Benzo. Tenía una tienda llena de trastos y me dejaba desmontarlo todo si luego lo montaba mejor. Esa fue mi escuela."
          ],
          "again": [
            "Sigo oyendo a Benzo cuando suelto un tornillo: «Más despacio, chaval»."
          ],
          "opts": [
            {
              "t": "¿Qué fue lo primero que hiciste?",
              "tone": "pregunta",
              "say": [
                "Un pájaro mecánico que sólo volaba hacia atrás. Benzo dijo que era «original». Era su forma de decir «desastre»."
              ],
              "go": "h_b2",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "Benzo parece un gran maestro.",
              "tone": "amable",
              "say": [
                "El mejor. Me enseñó que la chatarra puede volar. Y la gente también."
              ],
              "go": "h_b2",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "Así que eres un ladrón de piezas.",
              "tone": "broma",
              "say": [
                "¡Reciclador! Hay una diferencia. Pequeña. Pero la hay."
              ],
              "go": "h_b2"
            }
          ]
        },
        "h_b2": {
          "say": [
            "Ahora construyo para las Luciérnagas: filtros, poleas, la aerotabla… Si algo vuela, salta o limpia el aire, probablemente lo he hecho yo. O roto yo."
          ],
          "opts": [
            {
              "t": "¿Me enseñas a hacer un filtro?",
              "tone": "serio",
              "say": [
                "¡Claro! Carbón, malla fina y paciencia. Lo difícil es la paciencia."
              ],
              "go": "h_b3",
              "fx": {
                "stats": {
                  "ingenio": 1
                }
              }
            },
            {
              "t": "¿Y qué es eso de tu muñeca?",
              "tone": "pregunta",
              "say": [
                "(Lo tapa con la manga, sonriendo.) Un proyecto. Te lo enseñaré cuando funcione. O cuando no explote."
              ],
              "go": "h_b3"
            },
            {
              "t": "Eres un genio, Ekko.",
              "tone": "amable",
              "say": [
                "Soy un chaval con herramientas y demasiadas ganas. Pero gracias."
              ],
              "go": "h_b3",
              "fx": {
                "aff": 1
              }
            }
          ]
        },
        "h_b3": {
          "say": [
            "Bueno, ¿y tú qué sabes hacer? Aquí todo el mundo aporta algo, aunque sea hacer reír."
          ],
          "opts": [
            {
              "t": "Hacer reír, claramente.",
              "tone": "broma",
              "say": [
                "Contratad{g:o|a|e}. Empiezas mañana. Ahora, pregúntame algo serio para equilibrar."
              ],
              "go": "h_c1",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "Puedo pintar contigo.",
              "tone": "amable",
              "say": [
                "¡Eso! Vamos a los murales."
              ],
              "go": "h_a1"
            },
            {
              "t": "Todavía lo estoy descubriendo.",
              "tone": "serio",
              "say": [
                "Como todos. Empecemos por ahí."
              ],
              "go": "h_raiz"
            }
          ]
        },
        "h_c1": {
          "say": [
            "Que los críos crezcan sin toser. Que nadie tenga que elegir entre el Brillo y el hambre. Que el árbol sea una plaza, no un escondite."
          ],
          "again": [
            "El sueño sigue igual. Lo que cambia es cuánta gente lo sueña conmigo."
          ],
          "opts": [
            {
              "t": "¿Y cómo se consigue eso?",
              "tone": "pregunta",
              "say": [
                "Poco a poco. Un filtro. Un crío que aprende un oficio. Una familia que no se va. No hay atajos."
              ],
              "go": "h_c2"
            },
            {
              "t": "Cuenta conmigo para eso.",
              "tone": "amable",
              "say": [
                "(Te choca el puño.) Hecho. Las Luciérnagas tienen una más."
              ],
              "go": "h_c2",
              "fx": {
                "aff": 2,
                "rep": {
                  "zaun": 1
                }
              }
            },
            {
              "t": "Suena a utopía.",
              "tone": "duro",
              "say": [
                "Todo suena a utopía hasta que alguien lo hace. El árbol también lo parecía."
              ],
              "go": "h_c2"
            }
          ]
        },
        "h_c2": {
          "say": [
            "A veces pienso en lo que pasaría si pudiera volver atrás. Cambiar un solo momento. ¿Tú no?"
          ],
          "opts": [
            {
              "t": "Todos tenemos un momento así.",
              "tone": "amable",
              "say": [
                "Sí. Pero si lo cambiara, ¿seguiría siendo yo? Esa pregunta no me deja dormir."
              ],
              "go": "h_c3",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "No. Lo pasado nos hace quienes somos.",
              "tone": "serio",
              "say": [
                "(Asiente despacio.) Benzo decía algo así. Supongo que tenía razón. Como siempre."
              ],
              "go": "h_c3"
            },
            {
              "t": "¿Tu aparato de la muñeca hace eso?",
              "tone": "astuto",
              "say": [
                "(Se ríe, nervioso.) ¿Qué? No. Qué va. Es un reloj. Muy… preciso. Cambiemos de tema."
              ],
              "go": "h_c3"
            }
          ]
        },
        "h_c3": {
          "say": [
            "Me estás haciendo hablar más que en una reunión de las Luciérnagas. Y eso que allí no callo."
          ],
          "opts": [
            {
              "t": "Enséñame tus murales nuevos.",
              "tone": "amable",
              "say": [
                "¡Vamos! Ten cuidado con la pintura fresca."
              ],
              "go": "h_a1"
            },
            {
              "t": "Cuéntame más de Benzo.",
              "tone": "pregunta",
              "say": [
                "Siempre hay más de Benzo."
              ],
              "go": "h_b1"
            },
            {
              "t": "¿Una carrera en aerotabla y seguimos?",
              "tone": "broma",
              "say": [
                "¡Perderás! Pero vale. Y luego seguimos hablando."
              ],
              "go": "h_raiz",
              "fx": {
                "aff": 1
              }
            }
          ]
        }
      }
    },
    "sevika": {
      "entry": {
        "t": "Sevika. Tú y yo. Una charla larga.",
        "tone": "duro",
        "go": "h_raiz"
      },
      "nodes": {
        "h_raiz": {
          "say": [
            "(Expulsa el humo despacio.) ¿Larga? Las charlas largas acaban en pelea o en trato. A ver cuál es la tuya."
          ],
          "again": [
            "Tú otra vez. Empiezas a ser parte del mobiliario.",
            "(Empuja una silla con la bota.) Siéntate. No muerdo. Hoy."
          ],
          "opts": [
            {
              "t": "¿Cómo te hiciste tan dura?",
              "tone": "pregunta",
              "go": "h_a1"
            },
            {
              "t": "¿Qué haces para divertirte?",
              "tone": "broma",
              "go": "h_b1"
            },
            {
              "t": "¿En quién confías de verdad?",
              "tone": "serio",
              "go": "h_c1"
            }
          ]
        },
        "h_a1": {
          "say": [
            "A los doce años ya cargaba cajas en los muelles. A los quince peleaba en los fosos por comida. No hubo un momento: hubo mil."
          ],
          "again": [
            "Mi historia no ha mejorado desde la última vez. Sigue sin final feliz."
          ],
          "opts": [
            {
              "t": "¿Ganabas?",
              "tone": "pregunta",
              "say": [
                "Comía, así que sí. Los que perdían no volvían a la semana siguiente."
              ],
              "go": "h_a2"
            },
            {
              "t": "Nadie debería pasar por eso.",
              "tone": "amable",
              "say": [
                "(Te mira con algo parecido a la sorpresa.) No. Pero pasa. Cada día, ahí abajo."
              ],
              "go": "h_a2",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "Yo te habría ganado.",
              "tone": "broma",
              "say": [
                "(Se ríe de verdad.) Te habría doblado como una servilleta. Me gusta tu descaro."
              ],
              "go": "h_a2",
              "fx": {
                "aff": 1
              }
            }
          ]
        },
        "h_a2": {
          "say": [
            "En la revuelta del puente estaba en primera fila. Ahí aprendí que los que dan los discursos no suelen ser los que sangran."
          ],
          "opts": [
            {
              "t": "¿Te arrepientes?",
              "tone": "serio",
              "say": [
                "Me arrepiento de haber perdido. Lo demás lo volvería a hacer."
              ],
              "go": "h_a3"
            },
            {
              "t": "Por eso eres leal a quien se mancha.",
              "tone": "astuto",
              "say": [
                "(Asiente despacio.) Lees bien a la gente. Eso es peligroso. Para ti y para los demás."
              ],
              "go": "h_a3",
              "fx": {
                "stats": {
                  "ingenio": 1
                }
              }
            },
            {
              "t": "Gracias por luchar por Zaun.",
              "tone": "amable",
              "say": [
                "(Se encoge de hombros, incómoda.) Nadie me ha dado las gracias nunca. No sé qué se responde."
              ],
              "go": "h_a3",
              "fx": {
                "aff": 2,
                "rep": {
                  "zaun": 1
                }
              }
            }
          ]
        },
        "h_a3": {
          "say": [
            "Basta de mí. No me gusta hablar del pasado. Huele a sangre vieja."
          ],
          "opts": [
            {
              "t": "¿Y qué haces cuando no peleas?",
              "tone": "pregunta",
              "say": [
                "Ah. Eso sí lo cuento."
              ],
              "go": "h_b1"
            },
            {
              "t": "¿En quién te apoyas tú?",
              "tone": "serio",
              "say": [
                "Pregunta difícil. Te la contesto, pero no te acostumbres."
              ],
              "go": "h_c1"
            },
            {
              "t": "Volvamos a empezar.",
              "tone": "broma",
              "say": [
                "Como en el foso: ronda nueva."
              ],
              "go": "h_raiz"
            }
          ]
        },
        "h_b1": {
          "say": [
            "Cartas. Y hacer trampa en las cartas. Y ver la cara del que me pilla haciendo trampa y no se atreve a decírmelo."
          ],
          "again": [
            "Sigo jugando. Sigo haciendo trampa. Sigue sin decírmelo nadie."
          ],
          "opts": [
            {
              "t": "Yo te lo diría a la cara.",
              "tone": "duro",
              "say": [
                "(Sonríe de lado.) Por eso sigues de una pieza. La gente valiente me cae bien. La estúpida, no. Aún no sé cuál eres."
              ],
              "go": "h_b2",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "¿Me enseñas a hacer trampa?",
              "tone": "astuto",
              "say": [
                "La primera regla: nunca mires tus cartas cuando mientes. Mira las del otro."
              ],
              "go": "h_b2",
              "fx": {
                "stats": {
                  "ingenio": 1
                }
              }
            },
            {
              "t": "Eso es muy mezquino.",
              "tone": "broma",
              "say": [
                "Mezquino es cobrar por el aire. Yo solo me divierto."
              ],
              "go": "h_b2"
            }
          ]
        },
        "h_b2": {
          "say": [
            "También bebo. Pero eso no es divertirse, eso es mantenimiento. (Golpea el brazo mecánico.) Esta cosa necesita aceite y yo, whisky."
          ],
          "opts": [
            {
              "t": "¿Te duele el brazo?",
              "tone": "amable",
              "say": [
                "Cuando llueve. Cuando hace frío. Cuando me acuerdo de cómo lo perdí. O sea, casi siempre."
              ],
              "go": "h_b3",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "Brindo por el mantenimiento.",
              "tone": "broma",
              "say": [
                "(Choca su vaso con el tuyo.) Por el mantenimiento. Y por no oxidarse."
              ],
              "go": "h_b3",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "¿Cómo lo perdiste?",
              "tone": "pregunta",
              "say": [
                "(Te mira, seria.) Esa historia se gana, no se pregunta. Quizá otro día."
              ],
              "go": "h_b3"
            }
          ]
        },
        "h_b3": {
          "say": [
            "Me estás haciendo hablar mucho. ¿Trabajas para alguien? (Te observa.) Es broma. Casi."
          ],
          "opts": [
            {
              "t": "Solo para mí.",
              "tone": "astuto",
              "say": [
                "La mejor respuesta en Zaun. Sigamos, pues. Pregúntame algo que no le cuente a nadie."
              ],
              "go": "h_c1",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "Cuéntame más de tus tiempos en el foso.",
              "tone": "pregunta",
              "say": [
                "Te gustan las historias feas. Vale."
              ],
              "go": "h_a1"
            },
            {
              "t": "Para la Liga de los Curiosos.",
              "tone": "broma",
              "say": [
                "(Resopla.) Diles que su cuota ha subido. Siguiente pregunta."
              ],
              "go": "h_raiz"
            }
          ]
        },
        "h_c1": {
          "say": [
            "(Apaga el puro.) En nadie del todo. En algunos a medias. Confiar del todo es lo que hacen los que acaban en el río."
          ],
          "again": [
            "La respuesta sigue siendo la misma: a medias. Aunque tú estás algo más arriba en la lista."
          ],
          "opts": [
            {
              "t": "¿Y en mí? ¿A medias?",
              "tone": "coqueto",
              "say": [
                "A un cuarto. No te emociones. Es más que la mayoría."
              ],
              "go": "h_c2",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "Debe de ser una vida muy sola.",
              "tone": "amable",
              "say": [
                "(Silencio.) Sola es mejor que traicionada. Al menos eso me decía al principio."
              ],
              "go": "h_c2",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "Yo tampoco confío en nadie.",
              "tone": "duro",
              "say": [
                "Bien. Entonces nos entendemos. Dos desconfiados en la misma mesa."
              ],
              "go": "h_c2"
            }
          ]
        },
        "h_c2": {
          "say": [
            "Hay una persona. No te voy a decir quién. Me salvó en el puente y nunca me pidió nada a cambio. Eso en Zaun es más raro que el aire limpio."
          ],
          "opts": [
            {
              "t": "Me alegra que la tengas.",
              "tone": "amable",
              "say": [
                "(Casi sonríe.) Ya. Yo también. No se lo cuentes a nadie o te arranco la lengua."
              ],
              "go": "h_c3",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "¿Vive todavía?",
              "tone": "pregunta",
              "say": [
                "Siguiente pregunta."
              ],
              "go": "h_c3"
            },
            {
              "t": "Te estás ablandando, Sevika.",
              "tone": "broma",
              "say": [
                "Repite eso y te enseño lo blando que está mi puño."
              ],
              "go": "h_c3"
            }
          ]
        },
        "h_c3": {
          "say": [
            "Vale. Has sacado más de mí que tres interrogatorios de ejecutores. Algo tendrás."
          ],
          "opts": [
            {
              "t": "Paciencia. Y buena compañía.",
              "tone": "amable",
              "say": [
                "Lo de la compañía es discutible. Lo de la paciencia, no. Venga, otra ronda."
              ],
              "go": "h_raiz",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "Juguemos a las cartas mientras.",
              "tone": "broma",
              "say": [
                "Reparte. Y no mires mis cartas."
              ],
              "go": "h_b1"
            },
            {
              "t": "Háblame más de tus comienzos.",
              "tone": "pregunta",
              "say": [
                "Insistente. Bueno."
              ],
              "go": "h_a1"
            }
          ]
        }
      }
    },
    "ambessa": {
      "entry": {
        "t": "General, ¿me concede una conversación larga?",
        "tone": "serio",
        "go": "h_raiz"
      },
      "nodes": {
        "h_raiz": {
          "say": [
            "(Te mide con la mirada, como a un rival en el campo.) Una conversación larga es una batalla lenta. Acepto. Elige el terreno."
          ],
          "again": [
            "Vuelves al campo. Eso dice mucho de ti. Bueno o malo, aún no lo sé.",
            "(Afila un cuchillo sin mirarlo.) Habla. Te escucho mejor con las manos ocupadas."
          ],
          "opts": [
            {
              "t": "¿Qué es para usted la fuerza?",
              "tone": "pregunta",
              "go": "h_a1"
            },
            {
              "t": "¿Cómo fue su primera batalla?",
              "tone": "serio",
              "go": "h_b1"
            },
            {
              "t": "¿Qué echa de menos de casa?",
              "tone": "amable",
              "go": "h_c1"
            }
          ]
        },
        "h_a1": {
          "say": [
            "La fuerza no es golpear. Es decidir cuándo golpear y aguantar el tiempo que haga falta hasta ese momento."
          ],
          "again": [
            "La lección de la fuerza no cambia. Lo que cambia es quién está preparado para oírla."
          ],
          "opts": [
            {
              "t": "¿Y la compasión?",
              "tone": "serio",
              "say": [
                "La compasión es un lujo de los vencedores. Primero se gana; luego se perdona."
              ],
              "go": "h_a2"
            },
            {
              "t": "Suena a paciencia, no a fuerza.",
              "tone": "astuto",
              "say": [
                "(Sonríe, enseñando los dientes.) Muy bien. Son la misma cosa vista desde lados distintos de la espada."
              ],
              "go": "h_a2",
              "fx": {
                "aff": 1,
                "stats": {
                  "ingenio": 1
                }
              }
            },
            {
              "t": "Yo prefiero golpear primero.",
              "tone": "duro",
              "say": [
                "Así mueren los jóvenes valientes. Rápido y con buena historia. Yo prefiero historias largas."
              ],
              "go": "h_a2"
            }
          ]
        },
        "h_a2": {
          "say": [
            "A mis hijos les enseñé a luchar antes que a leer. Algunos me lo agradecen. Otros… (Deja la frase en el aire.)"
          ],
          "opts": [
            {
              "t": "¿Mel es de las que no?",
              "tone": "pregunta",
              "say": [
                "Mel aprendió a luchar con palabras. Me costó ver que eso también es una espada."
              ],
              "go": "h_a3"
            },
            {
              "t": "Debe de ser duro ser su hijo.",
              "tone": "amable",
              "say": [
                "Más duro es ser hijo de nadie en Noxus. Les di dientes. Es lo que una madre loba puede dar."
              ],
              "go": "h_a3"
            },
            {
              "t": "Eso explica muchas cosas.",
              "tone": "broma",
              "say": [
                "(Ríe, grave.) Lo explica todo. Tienes buen ojo."
              ],
              "go": "h_a3",
              "fx": {
                "aff": 1
              }
            }
          ]
        },
        "h_a3": {
          "say": [
            "Suficiente filosofía de guerra. Te estoy dando lecciones gratis y yo nunca doy nada gratis."
          ],
          "opts": [
            {
              "t": "Entonces cuénteme su primera batalla.",
              "tone": "serio",
              "say": [
                "Eso tampoco es gratis. Pero vale."
              ],
              "go": "h_b1"
            },
            {
              "t": "¿Qué echa de menos de Noxus?",
              "tone": "amable",
              "say": [
                "Preguntas que ningún soldado se atreve a hacerme. Bien."
              ],
              "go": "h_c1",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "Le pagaré con buena conversación.",
              "tone": "astuto",
              "say": [
                "Moneda aceptable. Empecemos otra vez."
              ],
              "go": "h_raiz"
            }
          ]
        },
        "h_b1": {
          "say": [
            "Tenía catorce años. Llovía. Recuerdo el barro más que la sangre, y el silencio después más que los gritos."
          ],
          "again": [
            "Aún sueño con aquel barro. Hay cosas que ni Noxus te quita."
          ],
          "opts": [
            {
              "t": "¿Tuvo miedo?",
              "tone": "pregunta",
              "say": [
                "Todos tienen miedo. Los que lo niegan son los primeros en huir. Yo no huí. Esa es toda la diferencia."
              ],
              "go": "h_b2"
            },
            {
              "t": "Catorce años es muy pronto.",
              "tone": "amable",
              "say": [
                "En Noxus, es tarde. (Una pausa.) Pero sí. Era muy pronto."
              ],
              "go": "h_b2",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "¿Ganó?",
              "tone": "duro",
              "say": [
                "Sobreviví. En la primera batalla, es lo mismo."
              ],
              "go": "h_b2"
            }
          ]
        },
        "h_b2": {
          "say": [
            "Desde entonces he visto más guerras de las que puedo contar. Y he aprendido que la peor no es la que se pierde: es la que nunca termina."
          ],
          "opts": [
            {
              "t": "¿Como la de Piltover y Zaun?",
              "tone": "astuto",
              "say": [
                "Exactamente. Esta ciudad lleva décadas en guerra y aún cree que vive en paz."
              ],
              "go": "h_b3",
              "fx": {
                "stats": {
                  "ingenio": 1
                }
              }
            },
            {
              "t": "¿Y por qué sigue luchando?",
              "tone": "pregunta",
              "say": [
                "Porque si paro, otros lucharán por mí. Y lo harán peor."
              ],
              "go": "h_b3"
            },
            {
              "t": "Quizá podría terminarla usted.",
              "tone": "serio",
              "say": [
                "(Te mira largamente.) Quizá. Pero todas las paces tienen un precio. Y alguien tiene que pagarlo."
              ],
              "go": "h_b3"
            }
          ]
        },
        "h_b3": {
          "say": [
            "Has escuchado sin apartar la mirada. Eso lo hacen pocos. Dime algo de ti, ahora."
          ],
          "opts": [
            {
              "t": "Yo también he perdido a gente.",
              "tone": "serio",
              "say": [
                "Entonces sabes de lo que hablo. Llévalos contigo. Pesan, pero también empujan."
              ],
              "go": "h_c1",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "Soy mejor con las palabras que con la espada.",
              "tone": "astuto",
              "say": [
                "Como mi hija. Vigila tus palabras, entonces. Son tu filo."
              ],
              "go": "h_a1"
            },
            {
              "t": "Prefiero que siga hablando usted.",
              "tone": "amable",
              "say": [
                "Hábil. Muy bien."
              ],
              "go": "h_raiz"
            }
          ]
        },
        "h_c1": {
          "say": [
            "(Deja el cuchillo.) El olor de la tierra después de una tormenta en las colinas de Noxus. Y el aullido de mis lobos al amanecer."
          ],
          "again": [
            "Mis lobos. Siempre vuelvo a ellos. Y tú, conmigo."
          ],
          "opts": [
            {
              "t": "¿Tiene lobos de verdad?",
              "tone": "pregunta",
              "say": [
                "Tres. La mayor se llama Ceniza. Me obedece porque me respeta, no porque me tema. Lo distingo bien."
              ],
              "go": "h_c2",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "Suena precioso.",
              "tone": "amable",
              "say": [
                "Lo es. Piltover tiene relojes. Noxus tiene horizontes."
              ],
              "go": "h_c2",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "No pensaba que fuera nostálgica.",
              "tone": "broma",
              "say": [
                "Nadie lo piensa. Por eso no se lo digo a nadie. Ahora tú lo sabes. Ten cuidado."
              ],
              "go": "h_c2"
            }
          ]
        },
        "h_c2": {
          "say": [
            "Algún día, cuando todo esto acabe, volveré a esas colinas. Me sentaré en una piedra y no daré ninguna orden en todo el día."
          ],
          "opts": [
            {
              "t": "¿Sabría hacerlo?",
              "tone": "broma",
              "say": [
                "(Ríe con fuerza.) Probablemente no. Daría órdenes a las piedras."
              ],
              "go": "h_c3",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "Se lo merece.",
              "tone": "amable",
              "say": [
                "Merecer… En Noxus nadie merece nada. Se toma. Pero te lo agradezco."
              ],
              "go": "h_c3"
            },
            {
              "t": "¿Y Mel iría con usted?",
              "tone": "pregunta",
              "say": [
                "(Se le endurece la cara un instante.) Eso depende de Mel. Siempre ha dependido de ella."
              ],
              "go": "h_c3"
            }
          ]
        },
        "h_c3": {
          "say": [
            "Basta. Esta conversación ha durado más que algunos asedios. Y ha sido más agradable."
          ],
          "opts": [
            {
              "t": "Otra ronda, general.",
              "tone": "amable",
              "say": [
                "Insistente como un lobo joven. Adelante."
              ],
              "go": "h_raiz",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "Hábleme más de la fuerza.",
              "tone": "pregunta",
              "say": [
                "Bien. Escucha."
              ],
              "go": "h_a1"
            },
            {
              "t": "¿Y aquella primera batalla?",
              "tone": "serio",
              "say": [
                "La recordaré contigo otra vez."
              ],
              "go": "h_b1"
            }
          ]
        }
      }
    },
    "cassandra": {
      "entry": {
        "t": "Lady Kiramman, ¿tomamos el té con calma?",
        "tone": "amable",
        "go": "h_raiz"
      },
      "nodes": {
        "h_raiz": {
          "say": [
            "(Hace un gesto a la doncella para que traiga otra taza.) Con calma, por favor. Es lo único que el Consejo nunca me deja hacer."
          ],
          "again": [
            "Vuelve usted. La casa Kiramman empieza a acostumbrarse a su presencia. Yo también.",
            "El té está recién hecho. Tobias insiste en que es mejor cuando hay compañía. Tiene razón, aunque no se lo diré."
          ],
          "opts": [
            {
              "t": "¿Cómo conoció a su marido?",
              "tone": "amable",
              "go": "h_a1"
            },
            {
              "t": "¿Qué significa ser una Kiramman?",
              "tone": "pregunta",
              "go": "h_b1"
            },
            {
              "t": "¿Cómo era Caitlyn de pequeña?",
              "tone": "broma",
              "go": "h_c1"
            }
          ]
        },
        "h_a1": {
          "say": [
            "(Sonríe sobre la taza.) En una gala. Él llegó tarde, despeinado y con pintura en la manga. Fue lo más honesto que vi en toda la noche."
          ],
          "again": [
            "Tobias sigue llegando tarde a todo. Y yo sigo sin quejarme demasiado."
          ],
          "opts": [
            {
              "t": "¿Fue amor a primera vista?",
              "tone": "coqueto",
              "say": [
                "A primera discusión. Me corrigió una cita de un poeta. Tenía razón. Me casé con él para poder llevarle la contraria el resto de mi vida."
              ],
              "go": "h_a2",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "Un pintor en la nobleza. Qué escándalo.",
              "tone": "broma",
              "say": [
                "Mi madre casi se desmaya. Fue uno de los mejores días de mi juventud."
              ],
              "go": "h_a2",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "Usted no parece de las que se dejan sorprender.",
              "tone": "astuto",
              "say": [
                "No lo soy. Por eso me sorprendió. Lo raro siempre llama la atención de quien está acostumbrada a lo previsible."
              ],
              "go": "h_a2"
            }
          ]
        },
        "h_a2": {
          "say": [
            "Tobias es la parte tierna de esta casa. Yo soy la muralla. Caitlyn, por desgracia, heredó las dos."
          ],
          "opts": [
            {
              "t": "¿Por qué «por desgracia»?",
              "tone": "pregunta",
              "say": [
                "Porque una muralla tierna se agrieta. Y yo no quiero ver a mi hija agrietarse."
              ],
              "go": "h_a3"
            },
            {
              "t": "A mí me parece una mezcla perfecta.",
              "tone": "amable",
              "say": [
                "(Baja la taza.) Es usted generos{g:o|a|e} con mi familia. Quizá tenga razón."
              ],
              "go": "h_a3",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "¿La muralla nunca se cansa?",
              "tone": "serio",
              "say": [
                "(Silencio.) Las murallas no tienen permiso para cansarse."
              ],
              "go": "h_a3",
              "fx": {
                "aff": 1
              }
            }
          ]
        },
        "h_a3": {
          "say": [
            "Me está haciendo hablar de cosas que no suelo contar ni a mis consejeros. Es usted peligros{g:o|a|e} con una taza de té en la mano."
          ],
          "opts": [
            {
              "t": "¿Qué significa ser una Kiramman?",
              "tone": "pregunta",
              "say": [
                "Una pregunta seria. Bien."
              ],
              "go": "h_b1"
            },
            {
              "t": "Hábleme de Caitlyn de pequeña.",
              "tone": "broma",
              "say": [
                "Ah, eso le va a gustar."
              ],
              "go": "h_c1",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "Más té, entonces.",
              "tone": "amable",
              "say": [
                "(Sirve.) Más té."
              ],
              "go": "h_raiz"
            }
          ]
        },
        "h_b1": {
          "say": [
            "Significa responder. De cada decisión, de cada acuerdo, de cada error de tus antepasados. Nuestro apellido es un libro de cuentas."
          ],
          "again": [
            "El libro de cuentas sigue abierto. Siempre lo está."
          ],
          "opts": [
            {
              "t": "¿Y qué deuda pesa más?",
              "tone": "astuto",
              "say": [
                "(Mira hacia la ventana, hacia abajo, hacia Zaun.) La que nadie de esta familia ha querido pagar todavía."
              ],
              "go": "h_b2",
              "fx": {
                "rep": {
                  "zaun": 1
                }
              }
            },
            {
              "t": "Suena a una carga enorme.",
              "tone": "amable",
              "say": [
                "Lo es. Pero también es un privilegio. Las dos cosas a la vez. Así es la nobleza bien entendida."
              ],
              "go": "h_b2"
            },
            {
              "t": "Pues reparta un poco de dinero abajo.",
              "tone": "duro",
              "say": [
                "(Arquea una ceja.) Ojalá fuera tan sencillo. El dinero sin cambio de leyes es una limosna. Y la limosna humilla."
              ],
              "go": "h_b2"
            }
          ]
        },
        "h_b2": {
          "say": [
            "En el Consejo me llaman fría. Prefiero fría a incendiaria. Las ciudades se queman muy deprisa."
          ],
          "opts": [
            {
              "t": "¿Quién es el incendiario?",
              "tone": "pregunta",
              "say": [
                "Elija usted. En esta ciudad sobran candidatos a ambos lados del río."
              ],
              "go": "h_b3"
            },
            {
              "t": "Fría no. Prudente.",
              "tone": "amable",
              "say": [
                "(Sonríe levemente.) Me quedo con esa palabra. Gracias."
              ],
              "go": "h_b3",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "A veces hace falta algo de fuego.",
              "tone": "serio",
              "say": [
                "Algo, sí. Pero con chimenea. No en mitad del salón."
              ],
              "go": "h_b3"
            }
          ]
        },
        "h_b3": {
          "say": [
            "Bien. Ya he hablado bastante de política para una tarde. Mi médico dice que me sube la tensión."
          ],
          "opts": [
            {
              "t": "Hablemos de Caitlyn, entonces.",
              "tone": "amable",
              "say": [
                "Eso también me sube la tensión. Pero de otra forma."
              ],
              "go": "h_c1"
            },
            {
              "t": "¿Cómo conoció a Tobias?",
              "tone": "coqueto",
              "say": [
                "Siempre volvemos a Tobias. Él estaría encantado."
              ],
              "go": "h_a1"
            },
            {
              "t": "Empecemos de nuevo, entonces.",
              "tone": "pregunta",
              "say": [
                "Como un buen debate. Desde el principio."
              ],
              "go": "h_raiz"
            }
          ]
        },
        "h_c1": {
          "say": [
            "(Se le escapa una risa.) Caitlyn trepaba al tejado del invernadero con el catalejo de su padre para espiar a los vecinos. Llevaba un cuaderno de «sospechosos»."
          ],
          "again": [
            "Aún guardo el cuaderno de sospechosos. Yo salgo tres veces. Por «actitud»."
          ],
          "opts": [
            {
              "t": "¿Quién era el principal sospechoso?",
              "tone": "broma",
              "say": [
                "El consejero Bolbok. Por «tener cara de esconder pasteles». Lo peor es que acertó."
              ],
              "go": "h_c2",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "Ya apuntaba maneras.",
              "tone": "amable",
              "say": [
                "Desde siempre. Yo quería una diplomática. Me salió una detective. La vida se ríe de los planes de las madres."
              ],
              "go": "h_c2",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "¿Y usted la regañaba?",
              "tone": "pregunta",
              "say": [
                "Por subirse al tejado, sí. Por la investigación, nunca. Era muy rigurosa."
              ],
              "go": "h_c2"
            }
          ]
        },
        "h_c2": {
          "say": [
            "Ahora sube a tejados mucho más peligrosos. Y yo sigo mirando hacia arriba con el corazón en la boca."
          ],
          "opts": [
            {
              "t": "Ella sabe cuidarse.",
              "tone": "amable",
              "say": [
                "Lo sé. Lo que no sé es si sabe dejarse cuidar. Eso también lo heredó de mí."
              ],
              "go": "h_c3",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "¿Se lo ha dicho alguna vez?",
              "tone": "serio",
              "say": [
                "(Se queda inmóvil.) …No con esas palabras. Quizá debería. Antes de que sea tarde."
              ],
              "go": "h_c3",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "Yo la vigilaré por usted.",
              "tone": "astuto",
              "say": [
                "Le tomo la palabra. Y le advierto que lo comprobaré."
              ],
              "go": "h_c3",
              "fx": {
                "aff": {
                  "cassandra": 1,
                  "caitlyn": 1
                }
              }
            }
          ]
        },
        "h_c3": {
          "say": [
            "(Mira el reloj de la chimenea.) Se nos ha ido la tarde. Hacía mucho que no me pasaba."
          ],
          "opts": [
            {
              "t": "Pues sigamos un rato más.",
              "tone": "amable",
              "say": [
                "Un rato más. Que espere el Consejo."
              ],
              "go": "h_raiz",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "Cuénteme más de la familia.",
              "tone": "pregunta",
              "say": [
                "La familia. Siempre la familia."
              ],
              "go": "h_b1"
            },
            {
              "t": "¿Más travesuras de Caitlyn?",
              "tone": "broma",
              "say": [
                "Tengo para una enciclopedia."
              ],
              "go": "h_c1"
            }
          ]
        }
      }
    },
    "isha": {
      "entry": {
        "t": "Isha, ¿jugamos a hablar con gestos un buen rato?",
        "tone": "amable",
        "go": "h_raiz"
      },
      "nodes": {
        "h_raiz": {
          "say": [
            "(Da un saltito, se sienta con las piernas cruzadas delante de ti y apoya la barbilla en las manos. Te escucha con todo el cuerpo.)"
          ],
          "again": [
            "(Te ve llegar y corre a abrazarte las piernas. Luego se sienta otra vez, muy formal, esperando.)",
            "(Te ofrece medio caramelo pegajoso. Es su forma de decir «hola otra vez».)"
          ],
          "opts": [
            {
              "t": "¿Me enseñas tus tesoros?",
              "tone": "amable",
              "go": "h_a1"
            },
            {
              "t": "¿Qué te gusta de Zaun?",
              "tone": "pregunta",
              "go": "h_b1"
            },
            {
              "t": "¿Te enseño un juego de manos?",
              "tone": "broma",
              "go": "h_c1"
            }
          ]
        },
        "h_a1": {
          "say": [
            "(Saca una caja de lata de debajo de una tabla suelta. Dentro: un botón azul, una pluma de paloma, un tornillo dorado y un trozo de cristal que brilla verde.)"
          ],
          "again": [
            "(La caja de tesoros tiene algo nuevo: una chapa con un mono dibujado. Te la enseña con orgullo.)"
          ],
          "opts": [
            {
              "t": "¿De dónde sacaste el tornillo dorado?",
              "tone": "pregunta",
              "say": [
                "(Señala hacia arriba, muy arriba, hacia Piltover. Luego se lleva un dedo a los labios: secreto de ladrona.)"
              ],
              "go": "h_a2"
            },
            {
              "t": "Son los tesoros más bonitos de Zaun.",
              "tone": "amable",
              "say": [
                "(Se pone roja de orgullo y cierra la caja con mucho cuidado, como si guardara un reino.)"
              ],
              "go": "h_a2",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "Ese cristal verde puede ser peligroso.",
              "tone": "serio",
              "say": [
                "(Frunce el ceño, lo mira, y lo envuelve en un trapo. Asiente: entendido. Pero no lo tira.)"
              ],
              "go": "h_a2"
            }
          ]
        },
        "h_a2": {
          "say": [
            "(Saca el último tesoro del fondo: un dibujo muy doblado de dos figuras cogidas de la mano. Una tiene trenzas azules.)"
          ],
          "opts": [
            {
              "t": "¿Sois Jinx y tú?",
              "tone": "pregunta",
              "say": [
                "(Asiente muy rápido, muchas veces. Luego abraza el dibujo contra el pecho.)"
              ],
              "go": "h_a3",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "Es el mejor de tus tesoros.",
              "tone": "amable",
              "say": [
                "(Te mira muy seria y levanta un dedo: el número uno. Sí. El mejor.)"
              ],
              "go": "h_a3",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "¿Me dibujas a mí también?",
              "tone": "broma",
              "say": [
                "(Coge un carboncillo y te dibuja con una cabeza enorme y piernas de palo. Te lo da, satisfecha.)"
              ],
              "go": "h_a3",
              "fx": {
                "aff": 1
              }
            }
          ]
        },
        "h_a3": {
          "say": [
            "(Guarda la caja bajo la tabla y pisa encima dos veces, como un conjuro. Luego te mira: ¿y ahora qué?)"
          ],
          "opts": [
            {
              "t": "Enséñame tu Zaun favorito.",
              "tone": "pregunta",
              "say": [
                "(Te coge de la manga y tira hacia la ventana.)"
              ],
              "go": "h_b1"
            },
            {
              "t": "¿Jugamos a algo?",
              "tone": "broma",
              "say": [
                "(Aplaude sin hacer ruido. Sí, sí, sí.)"
              ],
              "go": "h_c1",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "Volvamos a empezar, pequeña.",
              "tone": "amable",
              "say": [
                "(Se sienta otra vez, con las piernas cruzadas, lista.)"
              ],
              "go": "h_raiz"
            }
          ]
        },
        "h_b1": {
          "say": [
            "(Señala por la ventana: las luces de neón rosas y azules que se encienden en las Galerías al anochecer. Abre mucho los ojos y las manos, como fuegos artificiales.)"
          ],
          "again": [
            "(Vuelve a señalar las luces. Esta vez cuenta con los dedos cuántas se han encendido ya.)"
          ],
          "opts": [
            {
              "t": "Son preciosas.",
              "tone": "amable",
              "say": [
                "(Asiente con la cara pegada al cristal. Su aliento dibuja una nube pequeña.)"
              ],
              "go": "h_b2",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "¿Y qué es lo que no te gusta?",
              "tone": "serio",
              "say": [
                "(Se tapa la nariz y la boca. Luego señala el humo verde que sube del sumidero. Hace como que tose.)"
              ],
              "go": "h_b2"
            },
            {
              "t": "¿Te gustaría ver Piltover de cerca?",
              "tone": "pregunta",
              "say": [
                "(Duda. Mira arriba. Mira abajo. Al final se encoge de hombros y se agarra fuerte a tu mano: solo si vienes tú.)"
              ],
              "go": "h_b2",
              "fx": {
                "aff": 1
              }
            }
          ]
        },
        "h_b2": {
          "say": [
            "(Saca de su bolsillo una tiza y dibuja en el suelo una casa con una ventana enorme y un sol. Debajo, muchas figuritas cogidas de la mano.)"
          ],
          "opts": [
            {
              "t": "¿Esa es tu casa soñada?",
              "tone": "pregunta",
              "say": [
                "(Asiente. Señala las figuritas una por una y luego te señala a ti. Hay sitio para ti.)"
              ],
              "go": "h_b3",
              "fx": {
                "aff": 2
              }
            },
            {
              "t": "Le falta un perro.",
              "tone": "broma",
              "say": [
                "(Abre la boca, ofendida por el olvido, y dibuja un perro gigante, más grande que la casa.)"
              ],
              "go": "h_b3",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "Algún día la tendrás.",
              "tone": "amable",
              "say": [
                "(Te mira fijamente, como si te tomara la palabra para siempre. Luego te da la tiza a ti.)"
              ],
              "go": "h_b3",
              "fx": {
                "aff": 1
              }
            }
          ]
        },
        "h_b3": {
          "say": [
            "(Bosteza enorme, pero niega con la cabeza muy deprisa: no tiene sueño. Nada de sueño. Ninguno.)"
          ],
          "opts": [
            {
              "t": "Vale, un juego más y a dormir.",
              "tone": "broma",
              "say": [
                "(Levanta tres dedos. Negocia como una mercader de Piltover.)"
              ],
              "go": "h_c1",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "Enséñame otra vez tus tesoros.",
              "tone": "amable",
              "say": [
                "(Sale disparada hacia la tabla suelta.)"
              ],
              "go": "h_a1"
            },
            {
              "t": "Sigamos un rato, pues.",
              "tone": "pregunta",
              "say": [
                "(Se frota los ojos y se sienta, muy digna.)"
              ],
              "go": "h_raiz"
            }
          ]
        },
        "h_c1": {
          "say": [
            "(Pone las manos delante, palmas arriba, esperando que le enseñes. Muy concentrada.)"
          ],
          "again": [
            "(Te espera con las manos preparadas. Ya se sabe el juego de memoria y quiere ganarte.)"
          ],
          "opts": [
            {
              "t": "(Enseñarle a dar palmadas cruzadas.)",
              "tone": "amable",
              "say": [
                "(Se equivoca, se ríe en silencio, se equivoca otra vez… y a la quinta lo hace perfecto. Te mira triunfante.)"
              ],
              "go": "h_c2",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "(Hacer que una moneda desaparezca.)",
              "tone": "astuto",
              "say": [
                "(Te mira las manos, te mira las mangas, te mira las orejas. Al encontrar la moneda detrás de su oreja, se queda con la boca abierta.)"
              ],
              "go": "h_c2",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "(Hacer sombras de animales con las manos.)",
              "tone": "broma",
              "say": [
                "(Coloca un farolillo detrás de ti. Contesta a tu conejo con un monito hecho con sus dedos.)"
              ],
              "go": "h_c2",
              "fx": {
                "aff": 1
              }
            }
          ]
        },
        "h_c2": {
          "say": [
            "(Ahora le toca a ella. Te coge las manos y te enseña su propio juego: tres toques en la palma, uno en la nariz. Muy serio. Muy importante.)"
          ],
          "opts": [
            {
              "t": "¿Qué significa?",
              "tone": "pregunta",
              "say": [
                "(Señala tu pecho, luego el suyo, y junta las manos. Algo así como «somos equipo».)"
              ],
              "go": "h_c3",
              "fx": {
                "aff": 2
              }
            },
            {
              "t": "(Hacerlo mal a propósito.)",
              "tone": "broma",
              "say": [
                "(Te corrige con paciencia infinita, como una maestra. Tres en la palma. UNO en la nariz.)"
              ],
              "go": "h_c3",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "(Hacerlo perfecto.)",
              "tone": "amable",
              "say": [
                "(Te da un apretón de manos muy formal. Has aprobado.)"
              ],
              "go": "h_c3",
              "fx": {
                "aff": 1
              }
            }
          ]
        },
        "h_c3": {
          "say": [
            "(Se acurruca a tu lado y te tira de la manga: más. Quiere más de todo.)"
          ],
          "opts": [
            {
              "t": "Vale, otro juego.",
              "tone": "broma",
              "say": [
                "(Aplaude en silencio, muy deprisa.)"
              ],
              "go": "h_c1"
            },
            {
              "t": "¿Me enseñas otra vez las luces?",
              "tone": "amable",
              "say": [
                "(Te lleva a la ventana de la mano.)"
              ],
              "go": "h_b1"
            },
            {
              "t": "¿Y tus tesoros?",
              "tone": "pregunta",
              "say": [
                "(Ya está levantando la tabla.)"
              ],
              "go": "h_a1"
            }
          ]
        }
      }
    },
    "maddie": {
      "entry": {
        "t": "Maddie, ¿un descanso largo y charlamos?",
        "tone": "amable",
        "go": "h_raiz"
      },
      "nodes": {
        "h_raiz": {
          "say": [
            "(Mira a ambos lados del pasillo antes de sentarse.) Un descanso largo… La capitana no tiene por qué enterarse. Adelante."
          ],
          "again": [
            "Has vuelto. Empiezo a pensar que vienes a verme a mí y no a los informes.",
            "(Te ofrece una taza de café del cuartel. Huele a quemado.) Lo siento, es lo que hay. ¿De qué hablamos?"
          ],
          "opts": [
            {
              "t": "¿Por qué te hiciste ejecutora?",
              "tone": "pregunta",
              "go": "h_a1"
            },
            {
              "t": "¿Qué haces fuera de servicio?",
              "tone": "broma",
              "go": "h_b1"
            },
            {
              "t": "¿En quién confías aquí?",
              "tone": "serio",
              "go": "h_c1"
            }
          ]
        },
        "h_a1": {
          "say": [
            "(Sonríe, quizá demasiado rápido.) Por servir a la ciudad, claro. Y porque el uniforme me sienta bien. Eso también cuenta."
          ],
          "again": [
            "La misma respuesta de siempre: servir a la ciudad. (Remueve el café sin mirarte.)"
          ],
          "opts": [
            {
              "t": "Te sienta bien, es verdad.",
              "tone": "coqueto",
              "say": [
                "(Se ríe y se arregla el pelo.) Lo sé. Pero gracias por decirlo."
              ],
              "go": "h_a2",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "Esa respuesta suena ensayada.",
              "tone": "astuto",
              "say": [
                "(Un segundo de silencio.) Todas las respuestas en este edificio suenan ensayadas. Es un cuartel, no un teatro… o eso dicen."
              ],
              "go": "h_a2",
              "fx": {
                "stats": {
                  "ingenio": 1
                }
              }
            },
            {
              "t": "¿Y de dónde eres?",
              "tone": "pregunta",
              "say": [
                "De aquí y de allá. Viajé mucho de pequeña. Al final, el hogar es donde te pagan, ¿no?"
              ],
              "go": "h_a2"
            }
          ]
        },
        "h_a2": {
          "say": [
            "Lo que me gusta de verdad es observar. La gente revela tanto con un gesto… Caitlyn, por ejemplo, se toca el guante cuando miente. No se lo digas."
          ],
          "opts": [
            {
              "t": "¿Y yo qué hago cuando miento?",
              "tone": "broma",
              "say": [
                "(Te estudia.) Aún no te he pillado. Eso, o mientes muy bien. Las dos opciones me interesan."
              ],
              "go": "h_a3",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "Observas mucho a la capitana.",
              "tone": "astuto",
              "say": [
                "(Se le escapa una sonrisa.) Es mi trabajo cuidarla. Y es fácil de mirar. Ambas cosas son ciertas."
              ],
              "go": "h_a3"
            },
            {
              "t": "Eso es un poco inquietante.",
              "tone": "serio",
              "say": [
                "Solo si tienes algo que esconder. ¿Lo tienes?"
              ],
              "go": "h_a3"
            }
          ]
        },
        "h_a3": {
          "say": [
            "Bueno, basta de hablar de trabajo. Me estoy aburriendo yo misma."
          ],
          "opts": [
            {
              "t": "¿Qué haces cuando no trabajas?",
              "tone": "broma",
              "say": [
                "Uy, eso es más interesante."
              ],
              "go": "h_b1"
            },
            {
              "t": "¿En quién confías tú?",
              "tone": "serio",
              "say": [
                "Pregunta seria. Vale."
              ],
              "go": "h_c1"
            },
            {
              "t": "Volvamos al principio.",
              "tone": "amable",
              "say": [
                "Como en un buen interrogatorio."
              ],
              "go": "h_raiz"
            }
          ]
        },
        "h_b1": {
          "say": [
            "Bailo. En un local de la Avenida de los Progresistas donde nadie lleva uniforme. Allí soy solo Maddie. O quien quiera ser esa noche."
          ],
          "again": [
            "Sigo yendo a bailar. El local cambia de nombre cada mes. Me encanta eso."
          ],
          "opts": [
            {
              "t": "¿Me llevarías?",
              "tone": "coqueto",
              "say": [
                "¿Sabes bailar? No importa. Allí nadie sabe. Esa es la gracia."
              ],
              "go": "h_b2",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "¿«Quien quieras ser»?",
              "tone": "astuto",
              "say": [
                "(Ríe.) Una forma de hablar. Todos somos un poco actores, ¿no crees?"
              ],
              "go": "h_b2"
            },
            {
              "t": "No te imagino bailando.",
              "tone": "broma",
              "say": [
                "Esa es la idea. Si me imaginaras, no sería divertido."
              ],
              "go": "h_b2"
            }
          ]
        },
        "h_b2": {
          "say": [
            "También leo novelas de espías. Las compro en un puesto del puerto. Las tapas son horribles y las historias, mejores que la vida."
          ],
          "opts": [
            {
              "t": "¿Te gustaría ser espía?",
              "tone": "astuto",
              "say": [
                "(Te mira por encima del café, sin parpadear.) Qué pregunta tan curiosa. No. Demasiado papeleo."
              ],
              "go": "h_b3",
              "fx": {
                "stats": {
                  "ingenio": 1
                }
              }
            },
            {
              "t": "Préstame una.",
              "tone": "amable",
              "say": [
                "Te dejo mi favorita: «La rosa en la sombra». Cuidado, el final es… sorprendente."
              ],
              "go": "h_b3",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "Las tapas horribles son las mejores.",
              "tone": "broma",
              "say": [
                "¡Por fin alguien que lo entiende! Cuanto peor la tapa, mejor el asesinato."
              ],
              "go": "h_b3",
              "fx": {
                "aff": 1
              }
            }
          ]
        },
        "h_b3": {
          "say": [
            "(Mira el reloj de la pared.) Debería volver antes de que la capitana me eche de menos. O no."
          ],
          "opts": [
            {
              "t": "Quédate un rato más.",
              "tone": "amable",
              "say": [
                "Vale. Pero si pregunta, estábamos revisando informes."
              ],
              "go": "h_c1",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "¿Por qué te hiciste ejecutora, de verdad?",
              "tone": "astuto",
              "say": [
                "Insistes. Bien. Volvamos a eso."
              ],
              "go": "h_a1"
            },
            {
              "t": "Cambiemos de tema.",
              "tone": "pregunta",
              "say": [
                "Me parece perfecto."
              ],
              "go": "h_raiz"
            }
          ]
        },
        "h_c1": {
          "say": [
            "(Baja la voz.) En la capitana. Y en mí misma, casi siempre. El resto del cuartel… digamos que llevo una lista."
          ],
          "again": [
            "La lista ha cambiado un poco. Tú has subido unos puestos."
          ],
          "opts": [
            {
              "t": "¿Y yo en qué lista estoy?",
              "tone": "coqueto",
              "say": [
                "En la de «personas interesantes». Es una lista corta. Siéntete halagad{g:o|a|e}."
              ],
              "go": "h_c2",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "¿Por qué no confías en los demás?",
              "tone": "pregunta",
              "say": [
                "Porque algunos cobran de dos sitios. En Piltover, la lealtad tiene precio. Y alguien siempre paga más."
              ],
              "go": "h_c2"
            },
            {
              "t": "Pareces saber mucho de traiciones.",
              "tone": "astuto",
              "say": [
                "(Un brillo raro en los ojos.) He leído muchas novelas de espías, ¿recuerdas?"
              ],
              "go": "h_c2",
              "fx": {
                "stats": {
                  "ingenio": 1
                }
              }
            }
          ]
        },
        "h_c2": {
          "say": [
            "A veces pienso que todos llevamos dos uniformes. El que se ve y el que no."
          ],
          "opts": [
            {
              "t": "¿Cuál es tu segundo uniforme?",
              "tone": "astuto",
              "say": [
                "(Sonríe, dulce.) El de bailarina, por supuesto. ¿Cuál iba a ser?"
              ],
              "go": "h_c3"
            },
            {
              "t": "El mío es el de persona curiosa.",
              "tone": "broma",
              "say": [
                "Ese no lo escondes nada bien."
              ],
              "go": "h_c3",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "Yo solo llevo uno.",
              "tone": "serio",
              "say": [
                "Entonces eres de las personas más raras de esta ciudad. Y de las más vulnerables. Ten cuidado."
              ],
              "go": "h_c3",
              "fx": {
                "aff": 1
              }
            }
          ]
        },
        "h_c3": {
          "say": [
            "Uf, qué intensos nos hemos puesto. Necesito más café quemado."
          ],
          "opts": [
            {
              "t": "Hablemos de bailar.",
              "tone": "broma",
              "say": [
                "¡Eso sí!"
              ],
              "go": "h_b1",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "¿Y lo de ser ejecutora?",
              "tone": "pregunta",
              "say": [
                "Vuelves a eso. Muy observador{g:|a|e}."
              ],
              "go": "h_a1"
            },
            {
              "t": "Te invito a otro café.",
              "tone": "amable",
              "say": [
                "Del bueno, de la cafetería de arriba. Trato hecho."
              ],
              "go": "h_raiz"
            }
          ]
        }
      }
    },
    "kino": {
      "entry": {
        "t": "Kino, ¿hablamos largo y tendido?",
        "tone": "astuto",
        "go": "h_raiz"
      },
      "nodes": {
        "h_raiz": {
          "say": [
            "(Sonríe con una calma que no encaja con las cadenas.) Largo y tendido. Me gusta. Aquí abajo el tiempo es lo único que sobra."
          ],
          "again": [
            "Vuelves. Todos vuelven, tarde o temprano. ¿Por dónde íbamos?",
            "(Ladea la cabeza, como si te viera por primera vez y a la vez te conociera de siempre.) Siéntate. Te esperaba."
          ],
          "opts": [
            {
              "t": "Háblame de cuando Mel y tú erais niños.",
              "tone": "amable",
              "go": "h_a1"
            },
            {
              "t": "¿Qué piensas de las máscaras?",
              "tone": "astuto",
              "go": "h_b1"
            },
            {
              "t": "¿Cómo aguantas aquí encerrado?",
              "tone": "serio",
              "go": "h_c1"
            }
          ]
        },
        "h_a1": {
          "say": [
            "Mel pintaba. Yo la miraba pintar. Ella pensaba que era el hermano protector. Yo solo quería aprender cómo se crea una cara de la nada."
          ],
          "again": [
            "¿Más recuerdos de Mel? Tengo muchos. Algunos, incluso, son míos."
          ],
          "opts": [
            {
              "t": "¿Una cara de la nada?",
              "tone": "pregunta",
              "say": [
                "Una forma de hablar. Pinceladas, sombras… y de pronto alguien te mira desde el lienzo. Fascinante, ¿no?"
              ],
              "go": "h_a2"
            },
            {
              "t": "Mel te quiere mucho.",
              "tone": "amable",
              "say": [
                "(Algo cruza su mirada, rápido como una sombra.) Lo sé. Es su mayor virtud. Y su mayor punto débil."
              ],
              "go": "h_a2"
            },
            {
              "t": "No pareces muy protector.",
              "tone": "duro",
              "say": [
                "(Ríe suavemente.) Protejo lo que me interesa. Como todo buen Medarda."
              ],
              "go": "h_a2"
            }
          ]
        },
        "h_a2": {
          "say": [
            "¿Sabes qué recuerdo mejor de aquellos años? La rosa del jardín de nuestra madre. Negra. La única de su especie. Nadie sabía de dónde había salido."
          ],
          "opts": [
            {
              "t": "¿Una rosa negra?",
              "tone": "astuto",
              "say": [
                "(Sonríe.) Las rosas negras crecen en los sitios más inesperados. Incluso en los consejos de las ciudades."
              ],
              "go": "h_a3",
              "fx": {
                "stats": {
                  "ingenio": 1
                }
              }
            },
            {
              "t": "Suena bonito.",
              "tone": "amable",
              "say": [
                "Bonito y venenoso. Las mejores cosas suelen serlo."
              ],
              "go": "h_a3"
            },
            {
              "t": "No recuerdo que Mel hablara de esa rosa.",
              "tone": "serio",
              "say": [
                "(Una pausa demasiado larga.) Mel no se fijaba en el jardín. Yo sí."
              ],
              "go": "h_a3"
            }
          ]
        },
        "h_a3": {
          "say": [
            "Basta de jardines. Me pones nostálgico, y la nostalgia aquí abajo es peligrosa."
          ],
          "opts": [
            {
              "t": "Hablemos de máscaras, entonces.",
              "tone": "astuto",
              "say": [
                "Ah. Mi tema favorito."
              ],
              "go": "h_b1",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "¿Cómo soportas estar aquí?",
              "tone": "serio",
              "say": [
                "Con mucha imaginación."
              ],
              "go": "h_c1"
            },
            {
              "t": "Empecemos otra vez.",
              "tone": "pregunta",
              "say": [
                "Cada comienzo es una máscara nueva."
              ],
              "go": "h_raiz"
            }
          ]
        },
        "h_b1": {
          "say": [
            "Que todo el mundo lleva una. La diferencia es que algunos olvidan que se la han puesto."
          ],
          "again": [
            "Las máscaras otra vez. Sabía que volverías a ellas. Todos vuelven."
          ],
          "opts": [
            {
              "t": "¿Y tú llevas una?",
              "tone": "astuto",
              "say": [
                "(Sonríe muy despacio.) Ahora mismo, querrás decir. Sí. Una muy buena."
              ],
              "go": "h_b2",
              "fx": {
                "stats": {
                  "ingenio": 1
                }
              }
            },
            {
              "t": "Yo no llevo ninguna.",
              "tone": "serio",
              "say": [
                "Entonces llevas la más difícil: la de quien cree no llevarla."
              ],
              "go": "h_b2"
            },
            {
              "t": "Das un poco de miedo, ¿sabes?",
              "tone": "broma",
              "say": [
                "(Ríe con elegancia.) Solo un poco. Es un halago. Gracias."
              ],
              "go": "h_b2"
            }
          ]
        },
        "h_b2": {
          "say": [
            "En Noxus aprendes pronto: el que muestra su cara de verdad es el primero en perderla."
          ],
          "opts": [
            {
              "t": "¿Y cuál es tu cara de verdad, Kino?",
              "tone": "astuto",
              "say": [
                "(Te mira sin pestañear un buen rato.) Pregunta equivocada. La correcta sería: ¿soy Kino?"
              ],
              "go": "h_b3",
              "fx": {
                "stats": {
                  "ingenio": 1
                }
              }
            },
            {
              "t": "Eso es muy triste.",
              "tone": "amable",
              "say": [
                "Triste es no tener ninguna cara que proteger. Yo tengo muchas."
              ],
              "go": "h_b3"
            },
            {
              "t": "Piltover no es Noxus.",
              "tone": "duro",
              "say": [
                "Todavía no."
              ],
              "go": "h_b3"
            }
          ]
        },
        "h_b3": {
          "say": [
            "(Se recuesta contra la pared, satisfecho.) Me gustas. Haces las preguntas incómodas. Pocos se atreven."
          ],
          "opts": [
            {
              "t": "Háblame de Mel otra vez.",
              "tone": "amable",
              "say": [
                "Mi querida hermana. Claro."
              ],
              "go": "h_a1"
            },
            {
              "t": "¿Cómo aguantas el encierro?",
              "tone": "serio",
              "say": [
                "Bien. Escucha."
              ],
              "go": "h_c1"
            },
            {
              "t": "Me voy a quitar la máscara un rato.",
              "tone": "broma",
              "say": [
                "(Ríe.) Hazlo. Y empecemos de nuevo."
              ],
              "go": "h_raiz"
            }
          ]
        },
        "h_c1": {
          "say": [
            "Imaginando. Hoy he imaginado que estaba en un salón de baile de Piltover. Ayer, en el Consejo. Mañana… quién sabe. Quizá sea tú."
          ],
          "again": [
            "Hoy he imaginado otra cosa. Pero eso no te lo cuento. Aún."
          ],
          "opts": [
            {
              "t": "¿Ser yo? Eso da escalofríos.",
              "tone": "serio",
              "say": [
                "(Ríe suavemente.) Es solo un juego de la mente. ¿O no?"
              ],
              "go": "h_c2"
            },
            {
              "t": "¿Y en el Consejo qué hacías?",
              "tone": "astuto",
              "say": [
                "Escuchar. Los consejeros hablan mucho cuando creen que nadie importante les oye."
              ],
              "go": "h_c2",
              "fx": {
                "stats": {
                  "ingenio": 1
                }
              }
            },
            {
              "t": "Debe de ser muy solitario.",
              "tone": "amable",
              "say": [
                "(Por un instante, su sonrisa parece de verdad.) A veces. Gracias por notarlo."
              ],
              "go": "h_c2",
              "fx": {
                "aff": 1
              }
            }
          ]
        },
        "h_c2": {
          "say": [
            "Algún día saldré de aquí. Y cuando lo haga, me acordaré de quién vino a hablar conmigo. Para bien."
          ],
          "opts": [
            {
              "t": "¿Eso es una promesa o una amenaza?",
              "tone": "astuto",
              "say": [
                "Sí."
              ],
              "go": "h_c3",
              "fx": {
                "stats": {
                  "ingenio": 1
                }
              }
            },
            {
              "t": "Me alegra haber venido.",
              "tone": "amable",
              "say": [
                "A mí también. Más de lo que imaginas."
              ],
              "go": "h_c3",
              "fx": {
                "aff": 1
              }
            },
            {
              "t": "Yo no te sacaría de aquí.",
              "tone": "duro",
              "say": [
                "(Sonríe sin enfadarse.) No te lo he pedido. Todavía."
              ],
              "go": "h_c3"
            }
          ]
        },
        "h_c3": {
          "say": [
            "Me entretienes. Es lo más bonito que puedo decirle a alguien."
          ],
          "opts": [
            {
              "t": "Cuéntame más de las máscaras.",
              "tone": "astuto",
              "say": [
                "Con placer."
              ],
              "go": "h_b1"
            },
            {
              "t": "Y la infancia con Mel, ¿qué más?",
              "tone": "amable",
              "say": [
                "Hay tanto que contar…"
              ],
              "go": "h_a1"
            },
            {
              "t": "Otra ronda de preguntas.",
              "tone": "pregunta",
              "say": [
                "Siempre."
              ],
              "go": "h_raiz"
            }
          ]
        }
      }
    }
  };
  for (const [id, d] of Object.entries(DEEP)) {
    if (!CHAT[id]) continue;
    CHAT[id].hub.push(d.entry);
    CHAT[id].nodes = Object.assign(CHAT[id].nodes || {}, d.nodes);
  }
  // No enumerar esta marca: el validador recorre Object.values(CHAT) como personajes.
  Object.defineProperty(CHAT, 'deepV1', { value: true, enumerable: false });
})();
