# Web de Las ciudades del Umbral

- `index.html` + `portada.js`: portada pública con la crónica, ciudades, panoramas originales, lugares, Resonancia, campaña y reparto.
- `demo.html` + `demo-juego.js`: demo de desarrollo conservada en el repositorio; no está enlazada desde la portada pública.
- `koboldcpp.js`: cliente de conexión con KoboldCpp; usa por defecto `http://192.168.1.139:5001` en modo «Mi KoboldCpp».
- `estilos.css`, `menu.js`, `privacidad.html` y `arte-propio/*.svg`.

Los nuevos panoramas originales de Aurelia y Nácar están en `src/img/umbral/lugares/aurelia-panorama.svg` y `nacar-panorama.svg`. El generador `npm run web` copia automáticamente las ilustraciones SVG de lugares a `web-dist/lugares/`.

En la web pública no se ofrece un enlace directo a la demo. Los enlaces externos visibles son **Releases** y **Problemas**.
