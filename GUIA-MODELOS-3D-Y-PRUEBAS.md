# Modelos 3D y pruebas · Las ciudades del Umbral

## Qué existe

La rama `main` incluye un cargador GLB y diez modelos prototipo con IDs propios. El índice es `src/models/index.json`; los modelos que falten usan un avatar procedural. La carpeta `src/img/arte/lugares/` contiene las escenas SVG de Aurelia y Nácar para exploración 2D.

Los SVG son ilustraciones vectoriales de concepto, no modelos 3D. No se incluyen recursos de personajes de Arcane en el universo original.

## Importar un modelo propio

1. En Windows, abre **Ajustes → Arte personal → modelos** para abrir la carpeta exacta.
2. Añade un archivo GLB con el ID del personaje, por ejemplo `iria-venn.glb` o `nyra-quell.glb`.
3. Para un modelo nuevo incluido en el juego, coloca el GLB en `src/models/` y añade el nombre base (sin extensión) a `src/models/index.json`.
4. Comprueba escala, orientación, materiales, rig, animaciones, colisiones y consumo de memoria.
5. Prueba el modelo en escritorio y Android. Si no carga, el juego debe conservar el avatar procedural de respaldo.

## Guía de personajes

Cada personaje necesita una silueta y paleta diferenciadas. Aurelia utiliza piedra clara, azul petróleo y latón; Nácar utiliza verde turquesa, metal oscuro y acentos ámbar. La ropa debe corresponder al oficio: herramientas de ingeniería, mensajería, archivo, mediación, geología, medicina o pilotaje.

## Pruebas antes de publicar

- [ ] Los diez IDs del índice corresponden a archivos existentes.
- [ ] Todos los modelos se muestran con orientación y escala correctas.
- [ ] El avatar procedural aparece cuando falta un archivo.
- [ ] Las ubicaciones 2D tienen imágenes existentes.
- [ ] Las dos ciudades se pueden explorar en el mapa 3D.
- [ ] Las rutas de viaje y los puntos de aparición funcionan.
- [ ] Guardado/carga conserva ciudad, lugar y progreso.
- [ ] La calidad baja sigue funcionando en equipos modestos.
- [ ] La web usa solo recursos del universo original.
- [ ] Se han revisado las licencias de los recursos externos.

## Comprobación local

```powershell
npm ci
npm run check
npm start
```

Para revisar archivos ZIP de modelos propios, ejecuta `powershell -ExecutionPolicy Bypass -File scripts/comprobar-modelos.ps1 -Carpeta "RUTA_A_TUS_MODELOS"`. El script solo inspecciona el contenido; no extrae ni modifica tus archivos.
