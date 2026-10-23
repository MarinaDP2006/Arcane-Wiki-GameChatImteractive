# Prompts de modelos 3D: Las ciudades del Umbral
**Universo original · Parte del kit de producción de Rifts & Gears**

> Todos los diseños siguientes son propuestas originales. No reutilizar diseños, vestuarios, símbolos, paletas, siluetas ni nombres de personajes de otras franquicias. Los valores cromáticos son guías editables, no un contrato final. Los prompts producen referencias para un artista/modelador; no sustituyen revisión, retopología, UV, rig ni QA dentro del juego.

## Especificación común de producción

- Estilo: fantasía industrial estilizada, sombreado pictórico mate, proporciones humanas expresivas, materiales con desgaste localizado; sin copiar una serie o videojuego existente.
- Entrega preferida: GLB glTF 2.0, escala de 1.7-1.9 unidades de alto, origen en el centro de los pies, orientación frontal +Z, pivote centrado, materiales PBR y texturas embebidas.
- Malla: cuerpo completo, silueta legible a distancia de cámara isométrica, topología limpia, entre 20k y 45k triángulos para personaje principal LOD0, LOD1 de 8k-15k, LOD2 de 3k-6k; evitar transparencias innecesarias.
- Rig: humanoide compatible con retargeting, pelvis, columna, cuello, cabeza, clavículas, brazos, manos simplificadas, piernas, pies; dedos completos solo si justifican el primer plano.
- Animaciones: idle 3-5 s en bucle, walk 0.8-1.2 s en bucle, run 0.55-0.8 s, turn-in-place 90° si la herramienta lo permite. Root motion desactivado para locomoción dirigida por el juego.
- Presentación: A-pose, vista frontal, lateral y trasera, hoja de materiales, iluminación neutra y sin texto dentro del render.
- Accesibilidad: la silueta y el color de facción deben distinguirse también por forma, costuras, insignias originales y accesorios.
- Naming: `src/models/<id>.glb`; nombres de malla como `Body`, `Head`, `Hair`, `Outerwear`, `Gear`; texturas `BaseColor`, `Normal`, `ORM`.
- Evitar: piel/plástico brillante, manos fundidas, ropa que atraviesa el cuerpo, joyería flotante, armas enormes que oculten la pose, logotipos, letras, marcas registradas, diseños reconocibles de franquicias y texturas descargadas sin licencia.

## Dirección visual basada en el moodboard de autora

Usa la imagen de referencia como guía de **contraste ambiental**, no como plantilla para copiar personajes: Aurelia debe sentirse luminosa y vertical, con piedra marfil, vegetación, puentes y latón bajo luz cálida; Nácar debe ser densa, húmeda y vertical, con tuberías, pasarelas, talleres, reflejos verde turquesa y puntos de luz ámbar. El diseño web usa esta separación cálida/fría como identidad visual del mundo original.

El lineup inferior de la referencia sirve solo para estudiar variedad de siluetas. Cada protagonista de Rifts & Gears debe conservar su propia identidad: ropa funcional acorde a su oficio, paletas distintas, peinados y colores de pelo no repetidos por defecto, proporciones y accesorios originales. No recrear el rostro, ropa ni silueta exacta de personajes reconocibles de Arcane.

### Orden de producción de mapas 3D

1. **Aurelia:** plaza central y observatorio, viaductos, estación de contrapesos, patios de gremios y calles altas.
2. **Nácar:** mercado de tuberías, clínica vecinal, taller de canales, puente de cadenas, jardín de musgo y estación geotérmica.
3. **Conector jugable:** ascensor central y dos plantas de transición que expliquen la verticalidad entre ambas ciudades.
4. **Interiores modulares:** crear primero módulos repetibles de puertas, ventanas, barandillas, escaleras, tuberías y faroles; luego montar cada barrio.
5. **Entrega de cada zona:** archivo fuente de Blender, GLB optimizado, colisiones, puntos de navegación, LODs y prueba dentro del motor.

Los SVG de `web/arte-propio/` son ilustraciones vectoriales de concepto para la web; **no son mapas 3D ni modelos de producción**. La producción final requiere modelado, UV, materiales, colisiones, navegación y pruebas de rendimiento en el juego.

## Identidad del mundo

### Aurelia, la ciudad elevada
**Prompt de entorno 3D:** «Diseña una ciudad vertical original llamada Aurelia, construida sobre una meseta de piedra caliza clara atravesada por viaductos de cobre envejecido y ascensores públicos con contrapesos visibles. Los edificios combinan observatorios circulares, invernaderos de vidrio azul, patios de gremios y pasarelas estrechas. La energía de Resonancia aparece como líneas de luz ámbar que recorren cristales geológicos tallados, no como circuitos futuristas. La arquitectura transmite prosperidad organizada y desigualdad discreta: balcones ajardinados arriba, infraestructura de servicio visible bajo las plazas. Vista de juego 3/4, escala coherente, módulos repetibles, calles transitables, iluminación de mañana fría, niebla atmosférica suave. Paleta marfil `#E8DFC9`, latón `#B78B45`, azul profundo `#24384A`, grafito `#171B20`. Sin referencias a ciudades, edificios o símbolos existentes de otras IP.»
**Kit modular:** plaza del Archivo, pasarela de contrapesos, estación de ascensores, patio del Gremio de Cartógrafos, canal de cristal, barrio de viviendas altas.
**Materiales:** piedra porosa, latón patinado, cristal azul lechoso, tela de lana, madera oscura. Desgaste en bordes, no suciedad uniforme.

### Nácar, la ciudad bajo la piedra
**Prompt de entorno 3D:** «Crea una ciudad subterránea original llamada Nácar, excavada alrededor de galerías geotérmicas y canales de vapor. Viviendas de hierro remachado se conectan por puentes, talleres abiertos, depósitos de agua, jardines de hongos y ascensores reparados con piezas reutilizadas. La energía mineral se ve en vetas verdes que palpitan lentamente dentro de rocas, nunca como humo mágico genérico. Evitar que todo sea una cloaca: incluir mercados, clínica vecinal, escuela nocturna y plaza comunitaria. Vista 3/4 para mapa explorable, rutas de navegación claras, escala peatonal, luz verde mineral combinada con faroles cálidos. Paleta carbón `#080D0D`, verde mineral `#55D6A2`, cobre oscuro `#7D573F`, niebla clara `#D2E0D8`. Diseñar una identidad arquitectónica propia y legible.»
**Kit modular:** Mercado de Tuberías, Clínica de los Tres Arcos, estación de bombeo, puente de cadenas, Jardín de Musgo, Archivo de Turnos.
**Materiales:** hierro ennegrecido, cerámica remendada, cobre oxidado, lona encerada, piedra húmeda. Controlar reflejos para que la lectura no se pierda en cámara isométrica.

## 10 protagonistas

### 01. Iria Venn · ingeniera de contrapesos
**ID:** `iria-venn` · **Rol:** protagonista técnica / mediadora.
**Prompt:** «Modelo 3D de cuerpo entero para Iria Venn, ingeniera de 24 años de Aurelia. Piel oliva cálida, pelo negro corto con un mechón plateado natural, ojos color avellana, postura alerta con peso en una pierna. Viste chaqueta de trabajo marfil con costuras azul oscuro, cinturón con llaves de ascensor, guantes finos y botas con hebillas de latón; una libreta mecánica sujeta al muslo. Silueta compacta y práctica, hombros ligeramente manchados por polvo de piedra. Expresión observadora, no heroica. Nada de peinados, tatuajes, ropa o accesorios reconocibles de personajes existentes. GLB estilizado PBR, A-pose, frente/lado/espalda, rig humanoide, idle/walk/run.»
**Paleta:** piel `#B98564`, pelo `#242324`, chaqueta `#E8DFC9`, acento `#24384A`, metal `#B78B45`.
**Animación:** comprueba una herramienta con los dedos durante idle; marcha firme pero ligera.

### 02. Darel Ossan · mecánico de canales
**ID:** `darel-ossan` · **Rol:** reparador / contacto de Nácar.
**Prompt:** «Crea a Darel Ossan, mecánico de 29 años de Nácar, cuerpo robusto sin exageración, piel marrón muy oscura, pelo rizado color cobre profundo recogido en pequeñas trenzas cortas, barba recortada irregular, una ceja con cicatriz antigua. Mono de taller gris carbón, chaleco verde mineral, rodilleras diferentes entre sí, guantes de metal flexible y una llave de válvulas colgada de una bandolera. Lleva piezas útiles, no decoración gratuita. Cara paciente que se vuelve severa cuando escucha una fuga. Diseño de fantasía industrial original, proporciones realistas estilizadas, materiales mates; modelo completo y rig humanoide.»
**Paleta:** `#4C3025`, `#5C3528`, `#202626`, `#55D6A2`, `#7D573F`.
**Animación:** leve ajuste de hombros, mira de reojo la válvula; walk pesado pero estable.

### 03. Saia Merel · archivista de frecuencias
**ID:** `saia-merel` · **Rol:** investigadora / intérprete de registros.
**Prompt:** «Modelo para Saia Merel, archivista de 32 años que trabaja entre ambas ciudades. Piel canela con pecas muy sutiles, pelo plateado cálido cortado a la mandíbula, ojos oscuros, gafas redondas pequeñas con aro de bronce. Viste capas ligeras azul petróleo, una túnica asimétrica sobre pantalones para caminar, bolsillos etiquetados con marcas geométricas inventadas y un pequeño resonador de mano en funda acolchada. Manos expresivas, postura inclinada hacia delante cuando piensa, gesto sereno y escéptico. La estética es archivística y viajera, no aristocrática ni de hechicera. Cuerpo entero con detalles optimizados para cámara 3/4.»
**Paleta:** `#C38D69`, `#B2A89C`, `#24384A`, `#437C80`, `#B78B45`.
**Animación:** hojea una tarjeta sin texto legible; pasos medidos.

### 04. Toren Vale · inspector de ascensores
**ID:** `toren-vale` · **Rol:** agente de seguridad de Aurelia.
**Prompt:** «Toren Vale, 38 años, inspector civil de seguridad de ascensores, no soldado de desfile. Piel beige rosada, pelo castaño oscuro ondulado con entradas leves, bigote muy corto y mandíbula cuadrada. Lleva abrigo azul pizarra resistente a la lluvia, hombreras de cuero sin emblemas reales, placa circular con un símbolo abstracto original de tres líneas y un bastón luminoso de inspección. Su equipamiento parece comprado por una administración burocrática, no armadura fantástica. Pose sobria, mirada cansada, silueta alta y vertical. Modelo 3D de cuerpo entero, PBR mate, rig para walk/run e idle.»
**Paleta:** `#C49A7A`, `#3B302B`, `#24384A`, `#8B8D86`, `#B78B45`.
**Animación:** consulta la placa, suspira sin dramatismo.

### 05. Nyra Quell · mensajera de vapor
**ID:** `nyra-quell` · **Rol:** enlace / exploradora de Nácar.
**Prompt:** «Diseña a Nyra Quell, mensajera de 21 años nacida en las galerías de Nácar. Piel marrón rojiza, pelo negro azulado recogido en un moño alto irregular con dos mechones sueltos, ojos verdes grisáceos. Chaqueta corta impermeable color óxido, bufanda verde apagado, pantalones reforzados, botas blandas y una cartera cruzada con tubos de documentos sellados. Lleva dos broches hechos a mano como señal de la red comunitaria, sin logos. Cuerpo ágil, manos listas para equilibrarse, expresión vivaz pero cauta. Vestuario modular y creíble para correr por puentes húmedos.»
**Paleta:** `#8F5946`, `#121C24`, `#8A4F36`, `#3D8E7B`, `#D2E0D8`.
**Animación:** revisa la correa; walk dinámico sin correr en el sitio.

### 06. Bastian Rook · mediador de gremios
**ID:** `bastian-rook` · **Rol:** negociador / comerciante.
**Prompt:** «Bastian Rook, 45 años, mediador que conoce tanto los salones de Aurelia como los talleres de Nácar. Piel clara con subtono dorado, calvicie incipiente, pelo castaño cobrizo a los lados, nariz ligeramente torcida. Usa chaqueta de lana verde oliva, chaleco color hueso, pantalón práctico y una cadena de bolsillo con dos llaves incompatibles. Sus botas están mejor cuidadas que las de un mecánico pero tienen marcas de barro. Su rostro mezcla humor seco y cálculo comercial. Evitar estética de villano de lujo; debe parecer alguien que aprendió a sobrevivir hablando con todos. Modelo humanoide de cuerpo entero.»
**Paleta:** `#D0A47D`, `#704B32`, `#727653`, `#E8DFC9`, `#6D5B42`.
**Animación:** coloca las manos a la espalda, inclina la cabeza al negociar.

### 07. Oren Caldus · geólogo resonante
**ID:** `oren-caldus` · **Rol:** técnico de cristales.
**Prompt:** «Oren Caldus, geólogo de 56 años con piel marrón profunda, pelo gris rizado y barba corta salpicada de cobre, lentes protectoras de vidrio verde levantadas sobre la frente. Lleva delantal de cuero erosionado sobre ropa carbón, pequeños frascos minerales, martillo geológico y una pieza de Resonancia encapsulada en una caja de cerámica ventilada. Las manos tienen manchas de polvo mineral. Debe transmitir curiosidad tranquila y ética práctica, no un mago. Proporciones adultas, espalda levemente encorvada por años de trabajo, equipo con silueta legible. GLB PBR, sin efectos luminosos costosos integrados en el modelo.»
**Paleta:** `#5A3B2F`, `#77766F`, `#1B2322`, `#55D6A2`, `#B78B45`.
**Animación:** gira una muestra pequeña; respiración sutil.

### 08. Maelis Thorn · delegada del Consejo de Canales
**ID:** `maelis-thorn` · **Rol:** política / antagonista negociable.
**Prompt:** «Maelis Thorn, 40 años, delegada de los Canales de Aurelia, piel negra con subtono frío, cabello blanco natural peinado en trenzas finas recogidas hacia atrás, ojos gris oscuro. Traje estructurado azul noche y marfil, capa corta para lluvia, broche geométrico sin letras, guantes finos y una carpeta metálica sellada. Su autoridad procede del control de información, no de armadura ni corona. Expresión serena, mandíbula firme, postura recta, detalles de costura visibles sin exceso de ornamentos. Diseño completamente original y legible en vista isométrica, materiales PBR no reflectantes.»
**Paleta:** `#4B2E2C`, `#D9D3C9`, `#24384A`, `#E8DFC9`, `#9D7D43`.
**Animación:** alisa una manga, mira al interlocutor sin agresividad.

### 09. Joren Ash · médico de galerías
**ID:** `joren-ash` · **Rol:** médico de comunidad / soporte.
**Prompt:** «Joren Ash, médico de 34 años que trabaja en la Clínica de los Tres Arcos de Nácar. Piel marrón clara, pelo rizado castaño rojizo muy corto, ojeras suaves y sonrisa prudente. Viste una bata corta encerada gris verdosa, delantal con bolsillos para vendajes, guantes enrollados en el cinturón y una lámpara médica de latón. La ropa está limpia donde importa, pero remendada en hombros y codos. No llevar símbolo médico moderno registrado; usa un nudo de tres hilos original como emblema. Silueta accesible, postura abierta, equipo ligero para moverse por pasillos estrechos.»
**Paleta:** `#A87859`, `#603B2B`, `#44564F`, `#D2E0D8`, `#B78B45`.
**Animación:** acomoda un vendaje, gesto tranquilizador no paternalista.

### 10. Edda Lume · piloto de plataformas
**ID:** `edda-lume` · **Rol:** piloto / enlace entre ciudades.
**Prompt:** «Edda Lume, piloto de 27 años de las plataformas de carga, piel marfil tostada, pelo rizado color berenjena oscuro con corte desigual, ojos ámbar. Chaqueta corta con bandas reflectantes de latón envejecido, arnés de seguridad, pantalones holgados reforzados y botas con suela de goma. Un pequeño silbato de señales y guantes colgados del arnés identifican su profesión. Tiene una pierna ligeramente adelantada por costumbre de equilibrarse en plataformas móviles, no una pose de acción. Estética industrial aérea original, materiales textiles mate, malla humanoide completa lista para animación.»
**Paleta:** `#C9A183`, `#322334`, `#24384A`, `#B78B45`, `#596E67`.
**Animación:** balanceo discreto del peso y comprobación de un mosquetón.

## Prompt de control de calidad para cada GLB

«Audita este modelo como asset de juego: el origen está en los pies; no hay mallas perdidas ni caras invertidas; la escala es comparable con los demás personajes; materiales y texturas están embebidos; el rostro no depende de transparencias; la silueta se lee a 25%, 50% y 100% de tamaño; no hay marcas de otra IP; comprueba A-pose, huesos nombrados, idle/walk/run en loop, y que el root no se desplace al acabar el ciclo. Devuelve incidencias por severidad y no inventes que hay rig o animaciones si no existen.»

## Exportación e integración

1. Exportar a GLB 2.0 con texturas embebidas.
2. Validar en un visor glTF y abrir en la pantalla 3D del juego.
3. Registrar el archivo en `src/models/index.json` con el ID exacto.
4. Comprobar carga y fallback en web y escritorio; sincronizar Android.
5. No cambiar los IDs de los guardados sin una migración explícita.
6. Confirmar licencia y procedencia de cada textura, HDRI, fuente y modelo antes de distribuir.
