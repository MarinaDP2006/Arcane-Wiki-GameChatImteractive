# Pendientes · Las ciudades del Umbral (main)

Lo que falta en esta rama, que es solo del mundo nuevo. Lo de Arcane va en su propia rama y tiene su propia lista.

## Necesita a Nina

- [ ] **Clave de Ollama Cloud en el servidor publicado.** Poner `OLLAMA_API_KEY` como secreto en Render (nunca en el repositorio). Sin ella, la demo web y el chat con IA usan el narrador local de respaldo.
- [ ] **Separar el repositorio.** Descargar esta rama y crear el repositorio propio del mundo nuevo (ver [docs/GUIA-EXPORTAR-REPOSITORIO.md](docs/GUIA-EXPORTAR-REPOSITORIO.md)).
- [ ] **Probar en dispositivos reales**: instalador de Windows, app de Android y la web en el móvil.

## Arte y 3D

- [ ] **Modelos 3D finales de los diez personajes** (`src/models/*.glb`): ahora son prototipos low-poly sin rig ni animaciones. Los prompts están en [docs/PROMPTS-MODELOS-3D-UNIVERSO-ORIGINAL.md](docs/PROMPTS-MODELOS-3D-UNIVERSO-ORIGINAL.md).
- [ ] **Modelos 3D de los lugares**: el mapa 3D genera las dos ciudades por código. Faltan edificios propios para los diez lugares (Ascensor Central, Observatorio, Galerías…).
- [ ] **Ilustraciones finales de los lugares**: `src/img/umbral/lugares/*.svg` son ilustraciones planas generadas por `scripts/generar-arte-umbral.py`. Sustituirlas por arte pintado con el estilo de las imágenes de referencia (Aurelia dorada y luminosa, Nácar oscura y verde).
- [ ] **Retratos de los personajes**: ahora se pintan por código a partir de sus rasgos. Falta arte propio de cara y cuerpo entero.
- [ ] **Capturas reales del juego para la web** (`web/capturas/`).

## Historia y contenido

- [ ] **Ampliar la campaña**: hay 6 capítulos (3 por ciudad), 24 escenas y un solo final. Faltan más escenas por capítulo, finales según las decisiones y una posible Parte II.
- [ ] **Atlas completo**: el Atlas solo tiene Aurelia, Nácar y la Red de Resonancia. Añadir los diez lugares con su posición en `src/img/umbral/mapa.svg`.
- [ ] **Más diálogo escrito** por personaje en el comunicador (ahora hay 6 opciones por personaje) para cuando no hay IA.
- [ ] **Escenas de minijuego dentro de la historia**: los minijuegos funcionan desde el mapa, pero ningún capítulo los usa todavía como parte de una decisión.

## Música y sonido

- [ ] Las tres pistas duran unos 40 segundos en bucle. Versiones más largas y un tema propio para el final (ahora usa música generada).

## Técnico

- [ ] Compilar y publicar una release (`git tag v1.28.0` lanza el workflow de Windows y macOS).
- [ ] Revisar el rendimiento del mapa 3D en móviles modestos.
