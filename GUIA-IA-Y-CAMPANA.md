# Personajes con memoria y nueva campaña en dos partes

## Dónde está el prompt de IA

El prompt que se envía a Ollama o a otro servidor se construye en **`src/js/ai.js`**, dentro de **`systemPrompt(G, id)`**.

La información que utiliza está dividida en:

- **`src/data/ai-voices.js`**: vocabulario, ritmo, límites y relación inicial.
- **`src/data/arcane-lore.js`**: pasado, vínculos, miedos, ambiciones y contradicciones de los dieciséis personajes.
- **`src/data/relations.js`**: vínculos, parentescos, afinidad y pareja definidos en la partida.
- **`src/data/chat.js`**: ejemplos de conversaciones redactadas a mano.
- **`src/data/chat-expansion.js`**: temas que aparecen tras las decisiones de la nueva campaña.
- **`src/data/story.js`** y **`src/data/story-expansion.js`**: historia, capítulos, elecciones y consecuencias.
- **`src/js/game.js`**: guarda la conversación, aplica cambios de afinidad y permite alternar entre opciones escritas e IA libre.

La IA recibe los datos del personaje creado (nombre, procedencia, familia, trabajo y biografía), las relaciones existentes, el capítulo en curso, personas conocidas, personas fallecidas, decisiones y recuerdos recientes del chat. El personaje no debe anticipar información del futuro ni afirmar conocer escenas que no ha presenciado.

**Editar la interpretación:** para cambiar cómo reacciona Jinx, modifica `ARCANE_LORE.jinx` y `AI_VOICES.jinx`. Para modificar normas compartidas, edita `systemPrompt` de `src/js/ai.js`. Para cambiar diálogos con botones, modifica `chat.js` o `chat-expansion.js`. No pegues claves privadas en estos archivos.

El modelo de Ollama condiciona los resultados. Un modelo pequeño puede desobedecer el tono o las reglas, incluso con un prompt mejorado. El modo de diálogos escritos sigue disponible sin IA.

## Estructura de la campaña

**Parte I · El inicio**: rutas propias de Zaun y Piltover. El personaje decide quién recibe suministros, qué pruebas hace públicas y qué testigos protege. Se han sumado cuatro capítulos originales (`z9`, `z10`, `p9`, `p10`) antes de su final compartido.

**Parte II · Las consecuencias**: el mismo protagonista afronta pérdidas, refugios y negociaciones previas al conflicto final. Dos capítulos nuevos (`t7`, `t8`) se insertan antes de la conclusión.

Se conserva la estructura original de acontecimientos de Arcane y el mundo ya creado: **no se ha reemplazado por completo el argumento base**, sino que se ha ampliado con una historia paralela protagonizada por la persona que juega. Se han reemplazado los rótulos visibles de «temporadas» en la interfaz narrativa principal por «partes», pero algunos textos secundarios y sistemas internos continúan usando el nombre de temporada por compatibilidad.

**Compatibilidad:** los identificadores viejos de ruta, capítulo, escena, finales y `progress.season` se mantienen para leer partidas previas. Al cargar, el índice del capítulo se recalcula a partir del ID guardado. No borres los guardados para probar la campaña.

## Fuentes de caracterización utilizadas

- [Arcane (Riot): personajes y mundo](https://www.arcane.com/es-es/)
- [Netflix Tudum: personajes de las dos temporadas](https://www.netflix.com/tudum/articles/arcane-every-league-of-legends-character)
- [Netflix Tudum: recapitulación de la primera parte de la historia](https://www.netflix.com/tudum/articles/arcane-season-1-recap)

Los perfiles son **resúmenes originales escritos para este videojuego**, no diálogos copiados de la serie.

## Historia alternativa: los personajes pueden sobrevivir

La campaña ya no tiene muertes completamente inevitables. Se añade `src/data/alternate-fates.js`, cargado después de `story-expansion.js`, que extiende los nodos originales sin eliminar rutas ni escenas previas.

- **Silco** puede sobrevivir si intervienes en la merienda y evitas el disparo (Valor 3).
- **Cassandra** puede sobrevivir si organizas una evacuación reforzada del Consejo (Valor 3).
- **Isha** puede salvarse si bloqueas el Brillo a tiempo durante el encuentro con Warwick (Ingenio 3).
- **Jinx** puede escapar del enfrentamiento final si habéis construido suficiente confianza (Afinidad 5).
- **Jayce y Viktor** pueden salir vivos del Hexcore si logras aislar sus conductos (Ingenio 4).
- Hay un final nuevo, **«Las vidas que elegiste»**, que recuerda tus rescates.

Cada salvación activa un indicador persistente. El motor de juego `syncFallen()` lo respeta al actualizar los personajes vivos, el comunicador y sus apariciones. `src/js/ai.js` informa al modelo de las vidas salvadas para evitar que vuelva a la continuidad original.

**Alcance actual:** se han implementado estas cinco situaciones de rescate (seis personajes, porque Jayce y Viktor se salvan juntos). Otras muertes y desenlaces siguen dependiendo del argumento previo. Algunas escenas secundarias pueden requerir nuevas condiciones de continuidad tras pruebas completas. No se garantiza la supervivencia universal de todo el reparto.

Los IDs de capítulos, rutas y las partidas anteriores permanecen compatibles. Para probar diferentes desenlaces, utiliza una partida nueva o una copia de una ranura existente. No sobreescribas partidas personales para experimentar con finales.

## Validación y pruebas pendientes

La carga y sintaxis de doce archivos de datos y de IA se han comprobado en un evaluador JavaScript, así como la existencia de treinta capítulos, la integridad de las rutas, las transiciones entre nodos y dieciocho indicadores nuevos de decisiones. No se han ejecutado partidas completas ni se ha generado aquí un instalador Windows para esta revisión.

Para comprobarlo en un equipo con Windows y Node.js:

```powershell
npm ci
npm run check
npm start
```

Prueba ambos orígenes, decisiones nuevas, conversación libre con varios personajes, diálogos escritos desbloqueables, historial, cambios de afinidad, guardado/carga en capítulos previos y transición a Parte II.

La IA debe probarse con el servidor elegido: Ollama es local y opcional; el juego no lleva un modelo de lenguaje integrado.
