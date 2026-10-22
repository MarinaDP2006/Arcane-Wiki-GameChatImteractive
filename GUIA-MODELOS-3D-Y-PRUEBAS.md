# Grietas & Gears: seis personajes 3D a color y pruebas de Windows

## Estado real

La rama `main` incluye código para reconocer archivos `.zip`, `.fbx` y `.glb` de personajes, además de un modo por defecto **«NPC quietos y a color»**. Esta configuración deja al jugador moverse, pero no ejecuta animaciones del modelo importado de los personajes secundarios. La posición e interacción de cada personaje se conservan.

**Tus seis ZIP no se suben a GitHub**: se leen desde tu ordenador. No modifiques ni borres las imágenes o las partidas antiguas.

### Desde la versión 1.18.0

- El juego encuentra los ZIP en `Documentos\LOL-Game_Arcane\arcaneData\arte\personajes\3d models` (cualquier carpeta `arte` de Documentos hasta dos niveles, con una subcarpeta de personajes cuyo nombre contenga «3d») y también en `%APPDATA%\Arcane Piltover y Zaun\arte\modelos`.
- La primera vez que aparece un personaje, el juego **prepara su ZIP una sola vez** y guarda el resultado en la carpeta persistente `%APPDATA%\Arcane Piltover y Zaun\arte\modelos\_cache`: reduce las texturas a 2048 px (color) o 1024 px (resto), abre los ZIP que hay dentro de otro ZIP y convierte los `.obj` a un formato binario rápido. Tus ZIP originales no se modifican. Puedes borrar `_cache` cuando quieras: se vuelve a crear sola.
- Se admiten `.glb`, `.fbx` y ahora también `.obj`. Las texturas se enlazan aunque el nombre esté recortado (`…_BaseCo.png`) o cambie el espacio por guion bajo (`hair 2.png` / `hair_2.png`). Las piezas sin textura reciben un color de respaldo del personaje (pelo, piel, ropa), nunca negro.
- Un modelo que solo es un busto (por ejemplo, el de Mel) se muestra sobre un pedestal en lugar de estirarse a tamaño persona.

### Resultado con tus seis ZIP (comprobado el 22/10/2026)

| Personaje | Contenido del ZIP | Resultado en el juego |
|---|---|---|
| Caitlyn | `PoseCait.fbx` + 25 texturas de 4096 px | Modelo real a color, con rifle, en la Jefatura de los Ejecutores |
| Mel | `mel.fbx` (busto) + 5 texturas | Busto a color sobre pedestal en la Sala del Consejo |
| Jinx | ZIP interno con `jinx.obj` + 6 texturas | Modelo real a color; el pelo, cejas y pestañas (sin textura) usan su azul |
| Viktor | ZIP interno con `ViktorBody.obj` + 8 texturas | Modelo real a color en la Academia |
| Ekko | Solo `FirelightEkko.blend` | El juego no puede leer `.blend`: usa su muñeco 3D de respaldo |
| Vi | Solo un `.blend` | Igual que Ekko: muñeco 3D de respaldo |

Para que Ekko y Vi usen su modelo real, abre su `.blend` en Blender, elige **Archivo → Exportar → glTF 2.0 (.glb)** con «Incluir texturas» y guarda `ekko.glb` y `vi.glb` en la carpeta `modelos`. Los modelos importados están quietos en su pose original (en algunos casos en «T»), porque los archivos no traen animaciones.

## Cómo importar los seis ZIP sin Blender

1. Abre el juego en Windows.
2. Ve a **Ajustes → Arte personal → modelos**. El botón abre la carpeta exacta que utiliza el juego.
3. Copia allí los seis ZIP **sin descomprimirlos**. Ruta habitual:
   `%APPDATA%\Arcane Piltover y Zaun\arte\modelos\`.
4. Cambia el nombre de cada ZIP para que el juego sepa a quién pertenece. Por ejemplo, `vi.zip`, `jinx.zip`, `caitlyn.zip`, `ekko.zip`, `jayce.zip` y `viktor.zip`. **Usa los nombres de los personajes que realmente tienes**.
5. Otros nombres disponibles: `mel`, `heimerdinger`, `silco`, `vander`, `sevika`, `ambessa`, `cassandra`, `isha`, `maddie`, `kino`. Para tu protagonista: `jugador.zip`.
6. Cada ZIP debe contener **un modelo .fbx o .glb** y, si es FBX, preferiblemente también sus **texturas .png/.jpg/.webp**. Se aceptan subcarpetas internas. Un ZIP con solo una imagen o un `.obj` no sirve.
7. En **Ajustes → Gráficos**, activa «Personajes en 3D» y «NPC quietos y a color».
8. Reinicia el juego o utiliza **Ajustes → Arte personal → Recargar arte** y vuelve a entrar en el mapa. Acércate al lugar en que aparece ese personaje.
9. Si un ZIP se carga, el juego sustituye el muñeco 3D de respaldo por tu modelo real. Los personajes que no tengan archivo siguen usando el avatar de respaldo.
10. Para inspeccionar tus ZIP desde PowerShell sin modificar nada, desde el proyecto ejecuta:
```powershell
powershell -ExecutionPolicy Bypass -File scripts/comprobar-modelos.ps1
```

### Si el personaje aparece gris, negro, blanco o sin color

- **Con FBX:** comprueba que el ZIP contenga también las imágenes de textura; el código intenta enlazarlas por nombre. Si el formato usa materiales especiales o rutas complejas, podría ser necesario ajustar el archivo en Blender y exportarlo como `.glb`, que normalmente empaqueta materiales y texturas.
- **Con GLB:** utiliza un archivo con materiales y texturas incluidos; no todos los exportadores empaquetan correctamente las imágenes.
- Si un personaje aparece enorme, diminuto o enterrado, revisa su escala, origen y orientación en un editor 3D. El juego intenta corregir la escala y situar sus pies en el suelo.
- Si el modelo aparece con otra postura, el modo estático detiene la animación y muestra la pose original del archivo. Cambia esa pose en el editor si quieres una pose concreta.
- Si no aparece nada, revisa el nombre del ZIP y usa el inspector de modelos. No todos los archivos de Sketchfab/Mixamo son compatibles.

## Descargar y probar en Windows

### Opción A: ejecutable creado por GitHub Actions

1. Abre **https://github.com/MarinaDP2006/grietas-and-gears/actions/workflows/build.yml**.
2. Elige la ejecución más reciente de **Compilar Windows** y asegúrate de que termine con una marca verde.
3. En la zona **Artifacts**, descarga **grietas-and-gears-windows** y **extrae el ZIP**.
4. Ejecuta el instalador `Grietas-and-Gears-Setup-1.17.0.exe` o el archivo portable `Grietas-and-Gears-1.17.0-portable.exe`, si se han generado con esos nombres.
5. No se puede afirmar que el ZIP está listo hasta comprobar que Actions ha terminado correctamente.

### Opción B: iniciar el código en Windows sin esperar al instalador

Instala Node.js 22 y Git. Abre PowerShell:

```powershell
git clone https://github.com/MarinaDP2006/grietas-and-gears.git
cd grietas-and-gears
npm ci
npm run check
npm start
```

Para fabricar localmente los dos ejecutables:

```powershell
npm run dist:win
```

Se escriben en `dist/`. Si `npm ci` falla, no intentes usar un instalador antiguo como si contuviera las correcciones nuevas: revisa el resultado de CI o las dependencias.

## Comprobación de una partida

- Crear personaje y seleccionar Piltover o Zaun.
- Entrar al mundo abierto y usar WASD/flechas, Mayús para correr, Q/R para girar la cámara y E para hablar.
- Comprobar que los seis personajes ZIP aparecen con sus texturas y están quietos, mientras tú puedes recorrer la ciudad.
- Hablar con cada personaje y comprobar que no se bloquea el diálogo.
- Guardar una partida, cerrar el programa, abrirlo y continuar.
- Verificar que en `%APPDATA%\Arcane Piltover y Zaun\partidas` quedan las ranuras y, después de sobrescribir una ranura, su archivo `.bak`.
- Cargar una partida anterior, viajar entre ciudades, usar el códice, completar actividades y probar las decisiones.
- Probar un recorrido completo por cada origen y comprobar sus finales.

**No borres jamás `%APPDATA%\Arcane Piltover y Zaun\partidas` para probar una actualización.** Copia esa carpeta antes de hacer pruebas de estrés.

## Limitaciones todavía pendientes

No se ha confirmado el resultado de una compilación Windows completa en Actions, ni se ha probado un instalador en una máquina Windows real desde esta conversación. También faltan una prueba integral de todas las rutas narrativas y un examen gráfico de los seis ZIP reales. Estas verificaciones deben completarse antes de declarar terminada la versión estable.
