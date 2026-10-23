# LM Studio para el chat libre (PC, tablet y móvil)

Con LM Studio, la IA del chat libre funciona en tu propio ordenador, con tu tarjeta gráfica. No usa internet ni claves y nadie más lee lo que escribes. Si activas la red local, la tablet y el móvil de casa también usan la IA del PC, y responden igual de rápido.

## 1. Instalar y descargar un modelo

1. Descarga LM Studio desde [lmstudio.ai](https://lmstudio.ai) e instálalo.
2. En la lupa (**Discover**), busca uno de los modelos de la tabla de abajo y descárgalo. Si puedes elegir el archivo, coge el que termina en **Q4_K_M**, que es el más equilibrado.
3. En la parte de arriba, carga el modelo y sube **GPU Offload** al máximo. Así todo el modelo corre en la tarjeta gráfica, y por eso responde rápido.

### Qué modelo elegir según la memoria de tu tarjeta (VRAM)

| VRAM | Modelo recomendado | Cómo va |
|---|---|---|
| 6 GB | Gemma 3 4B, Llama 3.2 3B | Muy rápido, conversación sencilla |
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
New-NetFirewallRule -DisplayName "LM Studio (Grietas & Gears)" -Direction Inbound -Protocol TCP -LocalPort 1234 -Action Allow -Profile Private
```

## Problemas típicos

| Mensaje | Qué hacer |
|---|---|
| «No hay nada escuchando en esa dirección» | El servidor de LM Studio está apagado o el puerto no es 1234. |
| «No se llega a ese ordenador» | La IP no es correcta, la tablet está en otra wifi (por ejemplo, la de invitados) o el firewall la bloquea. |
| «LM Studio no encuentra el modelo» | Pulsa **Buscar mis modelos** y elige uno de la lista. |
| La IP del PC cambia cada pocos días | En el router, reserva una IP fija para el PC (se llama «reserva DHCP»). |
| Responde lento | Usa un modelo más pequeño, o comprueba que **GPU Offload** está al máximo. |

**Seguridad:** el servidor solo se abre a tu red de casa. No abras el puerto 1234 en el router ni lo actives en una wifi pública.

En Android, el juego permite conexiones `http://` normales para poder hablar con el PC de casa. Los servicios de internet (Gemini, Groq, OpenRouter) siguen yendo por `https://`.
