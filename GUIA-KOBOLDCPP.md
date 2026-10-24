# IA local con KoboldCpp

KoboldCpp es la **única IA** de Las ciudades del Umbral: no hay otros servicios. Con ella la historia libre y los chats funcionan con una IA en tu propio PC, sin internet y sin clave. Viene desactivada de fábrica: actívala en Ajustes.

## En el PC

1. Abre `koboldcpp.exe`. Si tu PC es antiguo o no tiene tarjeta gráfica moderna, usa `koboldcpp-oldpc.exe`.
2. En **Model** elige el archivo `.gguf` del modelo. Para el rol en español va mejor **Qwen** que Llama.
3. Si tienes tarjeta gráfica, sube **GPU Layers** todo lo que aguante. Si va justa de memoria, déjalo en 0.
4. Pulsa **Launch** y espera a que la ventana diga que escucha en el puerto **5001**.
5. En el juego abre **Ajustes → IA de la historia y los chats**, elige **KoboldCpp**, deja la dirección como está y pulsa **Probar conexión**.

Mientras KoboldCpp esté abierto, los personajes te responden con ese modelo.

## Por la red de casa: tablet, móvil u otro PC (por ejemplo 192.168.1.139)

`localhost` solo sirve en el mismo PC donde está abierto KoboldCpp. En la tablet, en el móvil o en otro ordenador, `localhost` es ese propio aparato, así que hay que escribir la **IP del PC con KoboldCpp**.

1. **Busca la IP del PC.** En el PC con KoboldCpp abre una terminal (tecla Windows, escribe `cmd`) y escribe `ipconfig`. Apunta la **Dirección IPv4** de tu wifi o cable, por ejemplo `192.168.1.139`. El juego de escritorio también te la enseña en **Ajustes → IA** («En la tablet o el móvil escribe…»).
   - Ojo: `192.168.1.1` suele ser el **router** (la «Puerta de enlace predeterminada» de `ipconfig`), no el PC: ahí no hay KoboldCpp. Usa la **Dirección IPv4** del PC, como `192.168.1.139`.
2. **Abre KoboldCpp escuchando en la red.** Por defecto ya escucha en todas las conexiones del PC. En la pestaña **Network**, deja **Host** vacío (o pon `0.0.0.0`) y **Port** en `5001`. No hace falta «Remote Tunnel». Desde la terminal sería: `koboldcpp.exe --model tu-modelo.gguf --host 0.0.0.0 --port 5001`.
3. **Deja pasar el puerto 5001 en el cortafuegos de Windows.** La primera vez Windows pregunta: marca **Redes privadas** y acepta. Si no preguntó, abre PowerShell como administrador y escribe:
   ```powershell
   New-NetFirewallRule -DisplayName "KoboldCpp (Las ciudades del Umbral)" -Direction Inbound -Protocol TCP -LocalPort 5001 -Action Allow -Profile Private
   ```
4. **Comprueba desde la tablet o el móvil.** Con los dos en la misma wifi, abre el navegador y entra en `http://192.168.1.139:5001` (con tu IP). Si sale KoboldAI Lite, la red funciona.
5. **En el juego** abre **Ajustes → IA de la historia y los chats**, elige **KoboldCpp** y en **Dirección** escribe solo la IP: `192.168.1.139`. Debajo verás «El juego usará: `http://192.168.1.139:5001/v1/chat/completions`»: el puerto y la ruta se ponen solos. También vale pegar `http://192.168.1.139:5001`, la dirección de KoboldAI Lite (`…:5001/#`) o la de su API (`…:5001/api`).
6. Pulsa **Buscar mi modelo** y después **Probar conexión**. Si funciona, la historia libre y los chats ya responden con KoboldCpp. Si lo dejas en `localhost` en la tablet o el móvil, el juego te avisa.

Funciona en el juego de escritorio (Windows y Mac) y en la app de Android. En la web publicada por `https://` el navegador no deja hablar con KoboldCpp por `http://`: para la IA usa el juego descargado.

Si no conecta:

| Mensaje | Qué hacer |
|---|---|
| «No se llega a KoboldCpp en 192.168.1.139:5001» o «No se llega a ese ordenador» | Revisa la IP con `ipconfig`, que los dos estén en la misma wifi (no en la de invitados) y el cortafuegos (paso 3). |
| «No hay nada escuchando en esa dirección» | KoboldCpp no está abierto, aún carga el modelo o usa otro puerto. |
| «“localhost” es el propio aparato» | Estás en la tablet o el móvil: escribe la IP del PC. |
| «Ha tardado demasiado» | El modelo es grande para tu PC: prueba uno más pequeño o sube **GPU Layers**. |

No abras el puerto 5001 a Internet (en el router): basta con la red de casa.

## Si va lento

- Un modelo de 5 GB sin tarjeta gráfica puede tardar 30 segundos o más por respuesta. El juego espera hasta 90 segundos.
- Prueba con un modelo más pequeño o con más **GPU Layers**.
- Si la IA no contesta, el juego ofrece los diálogos escritos para que no te quedes atascada.


## La pantalla «Welcome to KoboldAI Lite»

El mensaje de bienvenida («You are using the models…», «Instruct Mode Selected») lo muestra la interfaz web que sirve KoboldCpp; no es un texto que se tenga que pegar en el juego.

1. En el mismo ordenador donde está KoboldCpp, abre `http://localhost:5001`. Ahí puedes confirmar el modelo cargado y usar Instruct, JSON/Character Card o Quick Start Scenario.
2. En KoboldCpp, selecciona tu archivo GGUF y pulsa **Launch**. En este ejemplo el modelo activo se muestra como `koboldcpp/Llama-3.1-8B-Instruct-Q4_K_M`; el nombre exacto depende del archivo que cargues.
3. En el juego, abre **Ajustes → IA de la historia y los chats**, elige **KoboldCpp**, deja como endpoint de API `http://localhost:5001/v1/chat/completions`, pulsa **Buscar mi modelo**, selecciona el identificador devuelto por el servidor y después **Probar conexión**.
4. La interfaz Lite y la API son dos rutas del mismo servidor: `http://localhost:5001/` es la página web; `/v1/chat/completions` es la ruta que usa el juego para pedir respuestas.
5. En un móvil o tablet, sustituye `localhost` por la IP LAN del ordenador (por ejemplo, `192.168.1.139`), como se explica arriba en «Por la red de casa». No abras el puerto a Internet pública; limita el acceso a tu red local.

Las tarjetas y escenarios que cargues dentro de KoboldAI Lite no se importan automáticamente al juego. El juego sigue enviando su propio contexto de mundo, personaje e historial por la API.
