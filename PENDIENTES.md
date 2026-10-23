# Pendientes de la rama de Arcane

Lista viva de lo que falta en `arcane/fangame-actualizado`. Lo del mundo nuevo va en el `PENDIENTES.md` de `main`.
Marca con `[x]` lo que se vaya cerrando.

## Para Nina (no se puede hacer sin ti)

- [ ] **Acceso a `Arcane-fangame`.** Instalar la app de Claude en GitHub en ese repo para poder subir la rama.

- [ ] **Clave de Ollama Cloud.** Crea una cuenta gratis en ollama.com y una clave en Settings → Keys.
      No la pegues en chats ni en GitHub.
- [ ] **Servicio en Render.** Crear el web service `rifts-gears-arcane` (plan Free) desde esta rama y poner
      la clave como variable secreta `OLLAMA_API_KEY`. Los pasos están en [`server/LEEME.md`](server/LEEME.md).
      Hasta entonces la historia libre no tiene IA y el juego ofrece los diálogos escritos como respaldo.
- [ ] **Decidir si pagar algo** (solo si hace falta):
      Render Starter, 7 $/mes, para que el servidor no se duerma.
      Ollama Pro, 20 $/mes, si se gastan los créditos gratis.
- [ ] Borrar la rama `docs/guia-tecnica-completa-arcane`, que es una copia antigua de main.

## Historia libre con IA

- [ ] Probar con la IA de verdad (Gemma 4 31B) una partida completa de la ruta de Zaun y otra de la de Piltover.
- [ ] Ajustar cuántos turnos dura una escena antes de avanzar (ahora como máximo 4 o 6) según cómo se sienta jugando.
- [ ] Revisar que los finales y los minijuegos se disparan bien cuando la IA elige el camino.
- [ ] Traducir al inglés y al francés los textos nuevos de la historia libre.
- [ ] Opcional: probar `mistral-large-3:675b` si Gemma se queda corta narrando.

## Juego

- [x] Mapa 3D: el jugador es una bola de luz (color según hombre o mujer) que salta al andar; los personajes no se animan y se giran hacia ti al acercarte.
- [x] En Android y táctil no salen las teclas del teclado.

- [ ] Pantalla «¿Conoces Arcane?» antes de crear el personaje, con una intro breve si la respuesta es no.
- [x] Caitlyn, Ekko y Jinx con los modelos de Nina; guardias de Piltover y el Taller de Jayce y Viktor en el mapa.
- [ ] Modelos 3D fieles para el resto del reparto (Vi, Jayce, Viktor, Mel, Silco…), que siguen siendo prototipos.
- [x] Música en MP3 (menú, Piltover y Zaun en `assets/music`).
- [ ] Volver a activar los fondos 3D de los menús cuando se arreglen sus errores gráficos.
- [ ] Revisar la interfaz en el móvil (Android en horizontal) con la caja de texto nueva de la historia.

## Web

- [ ] Fusionar la PR #69 (web nueva de Arcane, sin descargas). Tras fusionar main en esta rama tiene conflictos.
