# IA local con KoboldCpp

KoboldCpp es la **única IA** de Las ciudades del Umbral: no hay otros servicios. Con ella la historia libre y los chats funcionan con una IA en tu propio PC, sin internet y sin clave. Viene desactivada de fábrica: actívala en Ajustes.

## En el PC

1. Abre `koboldcpp.exe`. Si tu PC es antiguo o no tiene tarjeta gráfica moderna, usa `koboldcpp-oldpc.exe`.
2. En **Model** elige el archivo `.gguf` del modelo. Para el rol en español va mejor **Qwen** que Llama.
3. Si tienes tarjeta gráfica, sube **GPU Layers** todo lo que aguante. Si va justa de memoria, déjalo en 0.
4. Pulsa **Launch** y espera a que la ventana diga que escucha en el puerto **5001**.
5. En el juego abre **Ajustes → IA de la historia y los chats**, elige **KoboldCpp**, deja la dirección como está y pulsa **Probar conexión**.

Mientras KoboldCpp esté abierto, los personajes te responden con ese modelo.

## Desde la tablet o el móvil

1. El PC y la tablet tienen que estar en la misma wifi. No hace falta activar «Remote Tunnel».
2. En el juego del móvil elige **KoboldCpp** y escribe la dirección de tu PC, por ejemplo `192.168.1.40`. El puerto 5001 se pone solo.
3. Si no conecta, deja pasar a KoboldCpp en el cortafuegos de Windows cuando lo pregunte.

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
5. En un móvil o tablet, sustituye `localhost` por la IP LAN del ordenador (por ejemplo, `http://192.168.1.40:5001`). No abras el puerto a Internet pública; limita el acceso a tu red local.

Las tarjetas y escenarios que cargues dentro de KoboldAI Lite no se importan automáticamente al juego. El juego sigue enviando su propio contexto de mundo, personaje e historial por la API.
