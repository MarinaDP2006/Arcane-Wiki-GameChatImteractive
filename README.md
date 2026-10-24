# Las ciudades del Umbral · Rifts & Gears

Aventura narrativa original de fantasía industrial. Aurelia vive en las alturas, entre observatorios y ascensores de latón. Nácar respira bajo la roca, entre canales de vapor y talleres. Las dos dependen de la **Resonancia**, una energía que nace de la vibración de la piedra, y de un pacto antiguo que nadie ha leído entero.

Creas a tu personaje y escribes lo que dice o hace. No hay botones de respuesta: los personajes te contestan, te preguntan y recuerdan lo que hiciste, dentro de las reglas del mundo.

> Este repositorio es solo del mundo nuevo: historia, personajes, lugares, arte, colores y música propios.

## La historia en cinco fechas

| Año | Suceso |
|---|---|
| 0 | **El Hundimiento.** La meseta de Umbral se parte. Arriba nace Aurelia; abajo, Nácar. |
| 112 | **La piedra que canta.** Una minera de Nácar descubre los cristales de Resonancia. |
| 190 | **El Pacto de los Contrapesos.** Aurelia paga los ascensores públicos a cambio de extraer de los estratos profundos. Tres cláusulas nunca se publican. |
| 251 | **El Silencio de Cobre.** Un derrumbe en Nácar durante un pico de extracción. Los registros de esa noche desaparecen. |
| 298 | **Registro 00:03.** Un ascensor se detiene y un medidor marca el mismo patrón borrado. Aquí empiezas tú. |

La campaña tiene tres partes: *La ciudad bajo la piedra*, *El precio de la Resonancia* y *Un pacto que no se hereda*. Hay diez personajes principales, cinco de cada ciudad; sus fichas están en `src/data/original-world.js`.

## Web y demo

La carpeta `web/` contiene la web pública:

- `index.html`: portada con la crónica, las ciudades, la Resonancia, la campaña, el reparto y cómo se juega.
- `demo.html` + `demo-juego.js`: demo de rol libre. Pregunta si conoces el mundo (si no, da una introducción breve), te deja crear el personaje y abre la primera escena en Aurelia o en Nácar con conversación libre.
- `demo-base.json`: textos de la demo (introducción, reglas del mundo para la IA, escenas y giros).
- `estilos.css`, `menu.js`, `privacidad.html` y el arte propio en `arte-propio/`.

`npm run web` genera `web-dist/` rellenando la web con los datos reales del juego (reparto, ciudades, versión). La web no ofrece descargas.

## IA: solo KoboldCpp

La única IA del juego es **KoboldCpp**. No hay otros proveedores. En el juego se activa en **Ajustes → IA de la historia y los chats** ([GUIA-KOBOLDCPP.md](GUIA-KOBOLDCPP.md)); la tablet y el móvil usan el KoboldCpp del PC por la red de casa. La demo web pasa por el servidor (`server/index.js`, endpoint `/api/roleplay`), que reenvía a KoboldCpp. Si no hay KoboldCpp disponible, la demo cambia a un narrador local sencillo para no quedarse muda.

Variables del servidor (ver `.env.example`):

- `KOBOLDCPP_URL`: dirección del KoboldCpp (por defecto `http://127.0.0.1:5001`).
- `KOBOLDCPP_MODEL`: nombre que se envía como modelo (por defecto `koboldcpp`).
- `ROLEPLAY_MAX_PER_HOUR`: límite de mensajes por hora y visitante.

`render.yaml` despliega la web y la API juntas: `npm ci && npm run web` y después `node server/index.js`.

## Desarrollo

```bash
npm ci
npm run check      # comprobaciones de datos y scripts
npm start          # versión de escritorio (Electron)
npm run web        # genera la web en web-dist/
npm run serve:web  # sirve web-dist/ y la API en http://localhost:10000
```

## Estilo y música

- **Aurelia:** oro envejecido y beige. **Nácar:** negro y verde de vapor. **Inicio y ajustes:** azul neutro. Los colores están en `src/css/umbral.css`.
- Cada lugar tiene su ilustración propia en `src/img/umbral/lugares/`, además del mapa y los símbolos de las dos ciudades.
- Tres pistas propias en `assets/music/`: `menu-theme.mp3` (inicio), `aurelia-theme.mp3` y `nacar-theme.mp3`.

## Estado

- **Hecho:** universo, dos ciudades, Resonancia, tres partes por ruta y un final, diez personajes con relaciones, creador, mapa 3D y 2D, minijuegos, colores por ciudad y música.
- **Prototipo:** modelos 3D low-poly en `src/models/` (sin rig ni animaciones finales).
- Lo que falta está en [PENDIENTES.md](PENDIENTES.md).

## Guías

- [Guía del juego y del código](GUIA.md)
- [Pendientes](PENDIENTES.md)
- [Plan del universo original](docs/PLAN-UNIVERSO-ORIGINAL.md)
- [Prompts de modelos 3D del universo original](docs/PROMPTS-MODELOS-3D-UNIVERSO-ORIGINAL.md)
- [KoboldCpp](GUIA-KOBOLDCPP.md) · [Web en Render](GUIA-WEB-RENDER.md) · [Privacidad](PRIVACIDAD.md)

## Licencia

Código bajo licencia MIT. El universo, sus nombres, su historia, su arte y su música son originales de MarinaDP2006.
