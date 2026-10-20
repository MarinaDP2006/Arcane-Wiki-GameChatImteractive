# Arcane: Piltover y Zaun

Juego de escritorio para **Windows** y **macOS** ambientado en el mundo de *Arcane*:
**historia interactiva + chat con voz + mundo abierto** de Piltover y Zaun.

Creas tu personaje, eliges de qué lado del puente vienes y recorres las dos ciudades.
Lo que decides cambia a quién conoces, cómo te tratan y qué final consigues.

## Cómo se juega

1. **Crea tu personaje**: nombre, género, edad, foto (o un retrato ilustrado que diseñas tú),
   profesión, barrio, familia famosa de Arcane (opcional: Kiramman, Talis, Medarda, Ferros,
   Giopara, la de Vander…) y aficiones. Todo eso suma a tus estadísticas
   (🧠 Ingenio, 💬 Carisma, 🔥 Valor, 🌑 Sigilo).
2. **Elige Zaun o Piltover**: cada ciudad tiene su propia ruta de 5 capítulos y empiezas
   en el barrio que elegiste.
3. **Explora el mundo abierto**: camina por los dos mapas, cruza el Puente del Progreso,
   visita lugares, habla con la gente y recoge los fragmentos del Códice (hexágonos azules).
4. **Sigue la historia**: el objetivo ★ te dice adónde ir. Al llegar, la escena se juega como
   un chat con voz. Algunas opciones necesitan estadísticas, afinidad o decisiones anteriores.
5. **Entrena**: cada lugar tiene una actividad (pelear en el foso, estudiar en la Academia,
   atender la barra de La Última Gota…) que sube una estadística, una vez por capítulo.
6. **Chatea**: cada personaje que conoces se desbloquea en el **comunicador**. Puedes
   hablar con ellos por chat (con su propia voz) o en persona en su lugar del mapa.
   Conversar sube la afinidad, y la afinidad abre opciones en la historia.
7. **Consigue los finales**: el capítulo final en el Puente tiene 4 desenlaces distintos.

### Controles

| Tecla | Acción |
|---|---|
| WASD / flechas (Mayús para correr) o clic en el mapa | Moverse |
| E o Intro | Hablar / entrar / interactuar |
| 1–9 | Elegir una opción |
| H | Historia |
| C | Comunicador (chats) |
| F | Ficha del personaje |
| K | Códice |
| Esc | Pausa / cerrar ventana |
| Espacio | Saltar la escena en curso |
| F11 | Pantalla completa |

### Chat con IA (opcional)

Sin configurar nada, los personajes responden con diálogos escritos y temas de conversación.
Si pones una clave de API de Anthropic en **Ajustes → Conversaciones con IA**, conversan
libremente con Claude sin salir del personaje, teniendo en cuenta tu ficha, tu afinidad y
tus decisiones. La clave se guarda solo en tu ordenador.

## Descargar el juego

Cada push compila los ejecutables en GitHub Actions (workflow **Compilar ejecutables**):

- **Windows**: `Arcane Piltover y Zaun Setup 1.0.0.exe` (instalador) y
  `Arcane Piltover y Zaun-1.0.0-portable.exe` (sin instalar, doble clic y a jugar).
- **macOS**: `.dmg` y `.zip` universales (Intel y Apple Silicon).

Descárgalos desde la pestaña **Actions** → última ejecución → *Artifacts*.
Para publicar una versión con descarga directa, crea una etiqueta:
`git tag v1.0.0 && git push origin v1.0.0` y aparecerá en **Releases**.

> En macOS, como la app no está firmada, la primera vez abre el juego con clic derecho → *Abrir*.
> En Windows, si SmartScreen avisa, pulsa *Más información → Ejecutar de todas formas*.

## Compilar en tu ordenador

Necesitas [Node.js](https://nodejs.org) 20 o superior.

```bash
npm install
npm start          # jugar en modo desarrollo
npm run check      # validar historia, mapas y diálogos
npm run dist:win   # ejecutables de Windows (en Windows)
npm run dist:mac   # .dmg de macOS (en un Mac)
```

Los ejecutables salen en la carpeta `dist/`. Las partidas se guardan en la carpeta de datos
del usuario (3 ranuras con autoguardado).

## Estructura

```
main.js, preload.js      Proceso de Electron: ventana, partidas, ajustes, chat IA
src/index.html           Interfaz del juego
src/js/world.js          Motor del mundo abierto (mapa, colisiones, cámara, minimapa)
src/js/game.js           Historia, comunicador, ficha, actividades y Códice
src/js/creator.js        Creador de personaje
src/js/audio.js          Voces (síntesis de voz) y música procedural
src/js/portrait.js       Retratos ilustrados generados en SVG
src/data/story.js        Capítulos, decisiones y finales
src/data/world.js        Mapas de Piltover y Zaun, lugares, actividades, fragmentos
src/data/chat.js         Voces y diálogos de cada personaje
src/data/wiki.js         Entradas del Códice (personajes, lugares, criaturas, tecnología, mundo)
src/data/creation.js     Opciones del creador de personaje
scripts/check.js         Validador de datos
```

---

Proyecto de fans sin ánimo de lucro. *Arcane* y *League of Legends* son propiedad de Riot Games.
Los retratos y mapas los genera el propio juego y la música se sintetiza en tiempo real.
