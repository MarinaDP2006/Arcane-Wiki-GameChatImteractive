# Partidas guardadas: guía

## Dónde se guardan

| Dispositivo | Partidas | Copia automática (desde v1.24.0) |
|---|---|---|
| Windows | `%APPDATA%\Rifts & Gears - Las ciudades del Umbral\partidas\ranura-N.json` (y `ranura-N.json.bak`) | `Documentos\Rifts & Gears\Copias automáticas` |
| Tablet / móvil (APK) | Dentro de la app (no se ve como carpeta). Si desinstalas el juego, se borran. | `Documentos/Rifts & Gears/Copias automáticas` (sigue ahí aunque desinstales) |

La copia automática se hace cada vez que el juego guarda: hay un archivo por día y se guardan los de los últimos 10 días, con las 3 ranuras y los ajustes (sin la clave de la IA). Se puede apagar en **Ajustes → Datos**.

Las partidas y las copias son personales: no las subas al repositorio.

## Pasar la partida de un dispositivo a otro (v1.24.0 o posterior)

**Una sola partida:**
1. En **Partidas**, pulsa **Exportar** en la ranura. En la tablet se abre el menú Compartir (Drive, correo, Quick Share, «Guardar en Archivos»). En Windows eliges dónde guardar el archivo `grietas-partida-….json`.
2. En el otro dispositivo, en **Partidas**, pulsa **Importar** en una ranura y elige ese archivo.

**Todas las partidas y los ajustes:**
1. **Ajustes → Datos → Guardar copia**, o coge directamente el archivo más reciente de la carpeta *Copias automáticas*.
2. En el otro dispositivo: **Ajustes → Datos → Cargar copia**.

## Rescatar la partida de un APK anterior a la v1.24.0

Los APK de antes de la v1.24.0 se firmaban cada vez con una llave distinta. Por eso el APK nuevo no se instala encima del viejo, y al desinstalar se pierde la partida. **Haz esto antes de desinstalar nada.**

1. **En la tablet:** Ajustes → Información del teléfono/tablet → Información de software → toca **7 veces** «Número de compilación». Luego, en **Opciones de desarrollador**, activa **Depuración USB**.
2. Conecta la tablet al PC por cable, acepta «¿Permitir depuración USB?» y **abre el juego** en la tablet (déjalo abierto).
3. **En el PC:** abre Chrome (o Edge), escribe `chrome://inspect/#devices` (en Edge, `edge://inspect`), espera a que salga la tablet y pulsa **inspect** debajo de Rifts & Gears.
4. En la ventana que se abre, ve a la pestaña **Console**. Si te lo pide, escribe primero `allow pasting` y pulsa Enter. Después pega esto y pulsa Enter:

   ```js
   copy(JSON.stringify({game:'grietas-and-gears',version:1,date:new Date().toISOString(),slots:Object.fromEntries(['1','2','3'].map(s=>[s,JSON.parse(localStorage.getItem('rifts-gears-slot-'+s)||'null')]).filter(([,d])=>d))}))
   ```

5. Abre el Bloc de notas, pulsa **Ctrl+V** y guarda el archivo como `partida-tablet.json` (Tipo: «Todos los archivos») en `Documentos\Rifts-Gears`.
6. En el juego de Windows v1.24.0 o posterior: **Ajustes → Datos → Cargar copia** y elige `partida-tablet.json`.
7. Ya puedes desinstalar el APK viejo de la tablet e instalar el nuevo. Para tener la partida también en la tablet, pásale el mismo archivo (cable, Drive o correo) y cárgalo con **Ajustes → Datos → Cargar copia**.

Al terminar, puedes volver a apagar la Depuración USB.

Desde la v1.24.0 todos los APK de prueba usan la misma llave, así que cada versión nueva se instala encima de la anterior sin perder las partidas.
