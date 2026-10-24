# Las ciudades del Umbral · Rifts & Gears

Aventura narrativa original de fantasía industrial. Aurelia vive en las alturas, entre observatorios y ascensores de latón. Nácar respira bajo la roca, entre canales de vapor y talleres. Las dos dependen de la **Resonancia**, una energía que nace de la vibración de la piedra, y de un pacto antiguo que nadie ha leído entero. Creas a tu personaje y escribes lo que dice o hace; los personajes responden sin opciones prefabricadas.

## Historia

| Año | Suceso |
|---|---|
| 0 | **El Hundimiento.** La meseta de Umbral se parte. Arriba nace Aurelia; abajo, Nácar. |
| 112 | **La piedra que canta.** Una minera de Nácar descubre los cristales de Resonancia. |
| 190 | **El Pacto de los Contrapesos.** Aurelia paga los ascensores públicos a cambio de extraer de los estratos profundos. Tres cláusulas nunca se publican. |
| 251 | **El Silencio de Cobre.** Un derrumbe en Nácar durante un pico de extracción. Los registros de esa noche desaparecen. |
| 298 | **Registro 00:03.** Un ascensor se detiene y un medidor marca el mismo patrón borrado. Aquí empiezas tú. |

## Web y arte

La web pública presenta la historia, las ciudades, el reparto, los lugares ilustrados y la guía de conexión. La portada ya no enlaza directamente a la demo jugable; las únicas acciones externas principales son **Releases** y **Problemas**.

- `web/index.html` + `portada.js`: página pública, galerías de ciudad, crónica y guía de conexión.
- `web/demo.html` + `demo-juego.js`: demo de desarrollo mantenida en el repositorio, no enlazada desde la portada pública.
- `web/koboldcpp.js`: configuración de conexión con KoboldCpp.
- `src/img/umbral/lugares/`: ilustraciones originales en SVG. Incluye dos panoramas nuevos, `aurelia-panorama.svg` y `nacar-panorama.svg`, para el menú y la web.
- `web/arte-propio/`: SVG propios de la interfaz web.

`npm run web` genera `web-dist/`, incorpora las imágenes SVG del juego y reemplaza los marcadores de la plantilla con los datos reales.

## KoboldCpp, Qwen y Llama

La dirección LAN predeterminada de esta instalación es:

- Base: `http://192.168.1.139:5001`
- API OpenAI-compatible: `http://192.168.1.139:5001/v1`
- Chat completions: `http://192.168.1.139:5001/v1/chat/completions`

Para usar el modelo local, abre KoboldCpp 1.123.1, carga un GGUF Q4_K_M de Qwen o Llama, deja Host vacío, usa el puerto 5001 y pulsa Launch. Se recomienda establecer Password si otros dispositivos se conectan. La IP puede cambiar si Windows renueva la dirección DHCP: usa `ipconfig` y actualiza Ajustes → IA cuando sea necesario.

La página pública se sirve por HTTPS. Chrome 142 o posterior puede solicitar el permiso **Acceso a la red local** al conectar con una IP privada HTTP. Si el navegador no admite esta conexión, usa el juego instalado o sirve la web desde tu red local. Esta configuración no requiere enlaces públicos ni túneles.

Pasos completos en [GUIA-KOBOLDCPP.md](GUIA-KOBOLDCPP.md).

## Desarrollo

```bash
npm ci
npm run check
npm start
npm run web
npm run serve:web
```

## Estilo y música

- **Aurelia:** oro envejecido, piedra clara y luz cálida.
- **Nácar:** roca, canales de cobre, talleres y cristales verdes de Resonancia.
- Los lugares originales están en `src/img/umbral/lugares/`; los emblemas en `src/img/umbral/simbolos/`.
- La música está en `assets/music/`.

## Guías

- [Guía del juego y del código](GUIA.md)
- [Pendientes](PENDIENTES.md)
- [KoboldCpp para PC, móvil y tablet](GUIA-KOBOLDCPP.md)
- [Web en Render](GUIA-WEB-RENDER.md)
- [Privacidad](PRIVACIDAD.md)

## Enlaces

- [Releases](https://github.com/MarinaDP2006/RIFTS-GEARS/releases)
- [Problemas / Issues](https://github.com/MarinaDP2006/RIFTS-GEARS/issues)

## Licencia

Código bajo licencia MIT. El universo, sus nombres, su historia, su arte y su música son originales de MarinaDP2006.
