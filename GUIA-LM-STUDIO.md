# LM Studio para el chat libre (PC, tablet y móvil)

LM Studio puede ejecutar un modelo de lenguaje en tu ordenador y ofrecerlo al chat del juego. El uso local puede evitar enviar mensajes a un proveedor externo, pero la privacidad depende de la configuración del equipo, del modelo y de la red. Si activas el acceso desde la red local, otros dispositivos autorizados de esa red podrían conectarse al servidor. No abras el puerto a Internet ni envíes información sensible a modelos o servicios en los que no confíes. La velocidad depende del modelo, la memoria disponible y el hardware.

## 1. Instalar y descargar un modelo

1. Descarga LM Studio desde [lmstudio.ai](https://lmstudio.ai) e instálalo.
2. En la lupa (**Discover**), busca uno de los modelos de la tabla de abajo y descárgalo. Si puedes elegir el archivo, coge el que termina en **Q4_K_M**, que es el más equilibrado.
3. En la parte de arriba, carga el modelo. Ajusta **GPU Offload** al nivel más alto que tu equipo pueda mantener sin quedarse sin memoria. Si aparecen errores o el equipo se ralentiza, baja el ajuste o prueba un modelo más pequeño.

### Modelo pequeño (archivo de menos de 1 GB)

Para probar el juego con un modelo ligero, busca **Qwen3 0.6B GGUF** y selecciona la cuantización **Q4_K_M**. El archivo suele ocupar aproximadamente **0,4–0,5 GB**, según la publicación exacta. La memoria de ejecución será algo mayor que el tamaño descargado; si el PC va justo, usa contexto corto y prueba CPU/GPU Offload gradual. Este modelo sirve para comprobar la conexión y mantener conversaciones sencillas, pero su coherencia de rol es más limitada que la de modelos de varios miles de millones de parámetros.

### Qué modelo elegir según la memoria de tu tarjeta (VRAM)

| VRAM | Modelo recomendado | Cómo va |
|---|---|---|
| Menos de 1 GB de archivo | **Qwen3 0.6B GGUF Q4_K_M** | Prueba de conexión; rol sencillo y memoria limitada |
| 6 GB de VRAM | Gemma 3 4B, Llama 3.2 3B | Muy rápido, conversación sencilla |
| 8 GB | Llama 3.1 8B, Qwen3 8B | Rápido y con buena personalidad |
| 12 GB | **Gemma 3 12B**, Mistral Nemo 12B | El punto dulce para el rol: buena memoria y buen español |
| 16 GB | Gemma 3 12B (Q6/Q8), Qwen3 14B | Más fino, igual de rápido |
| 24 GB o más | Gemma 3 27B, Mistral Small 24B | Lo mejor para interpretar personajes |

El modelo tiene que caber entero en la VRAM y sobrar 1 o 2 GB. Si LM Studio dice que no cabe, o va a trompicones, baja un escalón. Los modelos que «piensan» (Qwen3, DeepSeek R1) tardan más en contestar. El juego ya les quita el pensamiento de la respuesta.

## 2. Encender el servidor

1. Abre la pestaña **Developer** (el icono verde de la izquierda).
2. Activa **Status: Running**. Por defecto el puerto es **1234**.
3. En **Settings** de esa pestaña:
   - **Serve on Local Network**: actívalo si vas a jugar desde la tablet o el móvil.
   - **Just-in-Time Model Loading**: déjalo activado. Así el juego carga el modelo que elijas aunque no lo hayas cargado a mano.
4. Si prefieres la terminal: `lms server start`.

## 3. Configurarlo en el juego

**En el mismo PC:** en Ajustes, abre **IA para los chats** y en **Servicio** elige **LM Studio**. Deja la dirección como está (`http://localhost:1234/v1/chat/completions`), pulsa **Buscar mis modelos**, elige uno y pulsa **Probar conexión**.

**En la tablet o el móvil (misma wifi):**

1. En el juego del PC, con LM Studio elegido, debajo de la dirección aparece la que tienes que usar, por ejemplo `http://192.168.1.40:1234`. También la ves en Windows con `ipconfig`, en la línea **Dirección IPv4**.
2. En la tablet, en Ajustes, abre **IA para los chats**, elige **LM Studio** y escribe esa dirección. Basta con `192.168.1.40`, porque el juego añade el puerto y el resto.
3. Pulsa **Buscar mis modelos**, elige uno y pulsa **Probar conexión**.

La primera respuesta tarda un poco más, porque carga el modelo en la tarjeta. Después se queda cargado 30 minutos tras el último mensaje.

## 4. Firewall de Windows

La primera vez que enciendes el servidor con la red local activada, Windows pregunta si deja pasar a LM Studio. Marca **Redes privadas** y acepta.

Si no lo preguntó, o la tablet no conecta:

1. Comprueba que la wifi de casa está como **red privada**. Entra en Configuración → Red e Internet → tu wifi → **Tipo de perfil de red: Privada**.
2. Abre PowerShell como administrador y pega esto:

```powershell
New-NetFirewallRule -DisplayName "LM Studio (Rifts & Gears)" -Direction Inbound -Protocol TCP -LocalPort 1234 -Action Allow -Profile Private
```

## Problemas típicos

| Mensaje | Qué hacer |
|---|---|
| «No hay nada escuchando en esa dirección» | El servidor de LM Studio está apagado o el puerto no es 1234. |
| «No se llega a ese ordenador» | La IP no es correcta, la tablet está en otra wifi (por ejemplo, la de invitados) o el firewall la bloquea. |
| «LM Studio no encuentra el modelo» | Pulsa **Buscar mis modelos** y elige uno de la lista. |
| La IP del PC cambia cada pocos días | En el router, reserva una IP fija para el PC (se llama «reserva DHCP»). |
| Responde lento | Usa un modelo más pequeño, o comprueba que **GPU Offload** está al máximo. |

**Seguridad:** activa el acceso por red local solo cuando lo necesites y en una red de confianza. No abras el puerto 1234 en el router ni lo uses desde una wifi pública. Una dirección IP local no es un mecanismo de autenticación: cualquier dispositivo con acceso de red y permitido por el firewall podría intentar conectarse.

En Android, el juego permite conexiones `http://` normales para poder hablar con el PC de casa. Los servicios de internet (Gemini, Groq, OpenRouter) siguen yendo por `https://`.

## 5. Conectar la web demo mediante el servidor Node

El servidor web de Rifts & Gears acepta una API compatible con OpenAI. Si **LM Studio y Node se ejecutan en el mismo ordenador**, configura estas variables en el entorno del servidor:

```env
AI_PROVIDER=lm-studio
AI_BASE_URL=http://127.0.0.1:1234/v1
AI_MODEL=<identificador-exacto-de-LM-Studio>
AI_API_KEY=
```

Comprueba el identificador con `http://127.0.0.1:1234/v1/models`. En LM Studio, activa **Developer → Start server**. La web demo llama al endpoint local `/api/roleplay`, por lo que la clave del proveedor no se expone al navegador.

**Importante:** si la demo está alojada en Render, `127.0.0.1` se refiere al propio servidor de Render, no al PC de tu casa. Para una demo pública, utiliza un proveedor remoto o una conexión privada y autenticada al PC que ejecuta LM Studio. No abras el puerto 1234 directamente a Internet.
