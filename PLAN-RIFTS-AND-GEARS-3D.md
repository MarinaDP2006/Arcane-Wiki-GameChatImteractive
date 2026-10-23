# Rifts & Gears · Producción 3D del universo original

## Estado real

El juego contiene un renderizador 3D procedural y diez modelos GLB prototipo con IDs originales en `src/models/`. La web usa ilustraciones SVG de concepto para Aurelia y Nácar. Estas ilustraciones **no son mapas 3D terminados** y los GLB actuales no deben anunciarse como modelos finales de calidad cinematográfica.

## Dirección visual

- **Aurelia:** piedra marfil, latón, observatorios, puentes altos, jardines y luz dorada.
- **Nácar:** metal oscuro, tuberías, canales geotérmicos, pasarelas, vapor y luces verde turquesa con acentos ámbar.
- **Personajes:** siluetas, peinados, colores de pelo y vestuario originales, distintos por oficio y procedencia. No copiar personajes reconocibles ni sus atuendos de Arcane.

## Catálogo de protagonistas

| ID / archivo | Concepto |
|---|---|
| `iria-venn.glb` | Ingeniera de contrapesos; uniforme técnico azul petróleo y latón. |
| `darel-ossan.glb` | Mecánico de canales; ropa de taller, cuero y piezas reparadas. |
| `saia-merel.glb` | Archivista de frecuencias; abrigo formal, accesorios de medición. |
| `toren-vale.glb` | Inspector civil; chaqueta estructurada y herramientas de inspección. |
| `nyra-quell.glb` | Mensajera de vapor; ropa ligera, correas y botas de pasarela. |
| `bastian-rook.glb` | Mediador de gremios; chaleco, abrigo y accesorios comerciales. |
| `oren-caldus.glb` | Geólogo resonante; ropa robusta, guantes y herramientas de roca. |
| `maelis-thorn.glb` | Delegada de los Canales; ropa formal y paleta marfil/latón. |
| `joren-ash.glb` | Médico de galerías; uniforme práctico, bolso clínico y telas resistentes. |
| `edda-lume.glb` | Piloto de plataformas; ropa de carga, arnés y protección de viento. |

El índice de empaquetado está en `src/models/index.json`. El cargador utiliza avatares procedurales si falta un modelo.

## Orden de producción de mapas 3D

1. Bloqueo de volumen de Aurelia: plaza, Archivo, observatorio, patio de gremios y Estación de Ascensores.
2. Bloqueo de volumen de Nácar: Mercado de las Tuberías, Galerías Geotérmicas, Jardín de Musgo, Clínica y Canal de Cobre.
3. Construir el ascensor central como conexión vertical jugable entre ambos mapas.
4. Crear módulos reutilizables de puertas, ventanas, barandillas, escaleras, cables, válvulas, faroles y tuberías.
5. Añadir colisiones, puntos de navegación, LODs, iluminación, materiales PBR y pruebas de rendimiento.
6. Entregar fuente de Blender, GLB optimizado y una captura del modelo integrado en el motor.

## Pipeline recomendado

1. Crear o encargar mallas originales en Blender a partir del moodboard de autora.
2. Definir proporciones, topología, UV, materiales y un rig humanoide compartido.
3. Exportar GLB con texturas empaquetadas y comprobar orientación/escala.
4. Añadir el ID base a `src/models/index.json`.
5. Probar escritorio, web y Android con calidad baja/media/alta, guardado y navegación.
6. No marcar un recurso como terminado hasta probarlo dentro del juego y confirmar sus derechos de uso.

## Limitaciones pendientes

Los SVG actuales son ilustraciones conceptuales, no escenarios fotorealistas. Los modelos GLB existentes son prototipos. Hace falta una fase de modelado, texturizado, rigging, animación y pruebas en el motor antes de prometer calidad cinematográfica.
