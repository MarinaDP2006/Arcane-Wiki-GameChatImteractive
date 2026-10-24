# Guía completa: instalar KoboldCpp, cargar Qwen o Llama y conectar Las ciudades del Umbral

Esta guía sirve para reinstalar KoboldCpp en Windows desde cero y conectar tanto el juego como la demo web de Las ciudades del Umbral. KoboldCpp ejecuta el modelo en tu PC; el juego o la demo le envía sus propias instrucciones de Umbral. **Los Save Slots de KoboldAI Lite no configuran el universo del juego.**

## 1. Preparar una instalación limpia

KoboldCpp es portátil: normalmente no tiene un instalador tradicional, sino un archivo `.exe`.

1. Cierra KoboldCpp y cualquier ventana de KoboldAI Lite.
2. Si quieres empezar desde cero, crea una carpeta como `C:\\Kobold` y otra para los modelos: `C:\\Kobold\\models`.
3. Descarga KoboldCpp únicamente desde las [versiones oficiales de GitHub](https://github.com/LostRuins/koboldcpp/releases).
4. En Windows, elige el ejecutable compatible con tu equipo:
   - **NVIDIA moderna:** versión CUDA indicada en la página de versiones.
   - **AMD, Intel o sin CUDA:** versión `nocuda`/Vulkan que corresponda.
   - **CPU o equipo antiguo:** versión CPU/old CPU si las versiones actuales no funcionan.
5. Guarda el ejecutable en `C:\\Kobold`.

KoboldCpp y los modelos son cosas separadas. Si conservas los archivos `.gguf`, no hace falta descargarlos de nuevo aunque sustituyas el ejecutable.

## 2. Descargar un modelo: Qwen o Llama

KoboldCpp necesita un modelo en formato **GGUF**. Para empezar, elige un solo archivo `.gguf` de cuantización **Q4_K_M**. Los modelos de 8B suelen ocupar alrededor de 5 GB y necesitan memoria adicional para funcionar.

### Opción recomendada para probar primero: Qwen3 8B

- Repositorio: [Qwen/Qwen3-8B-GGUF en Hugging Face](https://huggingface.co/Qwen/Qwen3-8B-GGUF).
- Busca el archivo **Q4_K_M** (suele llamarse `qwen3-8b-q4_k_m.gguf`).
- Es una alternativa instruct multilingüe para probar narración y diálogo en español; la calidad de la interpretación también depende de las instrucciones del juego.

### Alternativa: Llama 3.1 8B Instruct

- Repositorio GGUF: [Meta-Llama-3.1-8B-Instruct-GGUF en Hugging Face](https://huggingface.co/gaianet/Meta-Llama-3.1-8B-Instruct-GGUF).
- Elige el archivo **Q4_K_M** para empezar.
- Puedes compararlo con Qwen cargando un modelo cada vez.

### Cómo descargarlo desde el propio KoboldCpp

1. Abre KoboldCpp.
2. En **Quick Launch** o **Loaded Files**, localiza **HF Search** junto al campo del modelo.
3. Busca el nombre del repositorio, por ejemplo `Qwen/Qwen3-8B-GGUF`, y pulsa **Search Huggingface**.
4. Selecciona el repositorio correcto y el archivo `.gguf` que termine en **Q4_K_M**.
5. Pulsa **Confirm Selection**.
6. Pulsa **Launch** y espera a que termine la descarga y la carga. La consola debería mostrar que está listo y que escucha en el puerto local, normalmente **5001**.

**No cargues Qwen y Llama a la vez.** Para cambiar, detén la sesión y abre KoboldCpp con el otro archivo seleccionado. Puedes conservar ambos modelos en `C:\\Kobold\\models`.

### Ajustes iniciales sugeridos

- **GPU Layers:** empieza en `-1`/automático. Si falla por falta de memoria, reduce la carga de GPU o prueba un modelo más pequeño.
- **Context Size:** empieza con el valor predeterminado; un contexto mayor usa más memoria.
- Mantén KoboldCpp abierto mientras juegas.

## 3. Crear un Remote Tunnel para la demo publicada

La demo publicada funciona por HTTPS y puede no poder llamar directamente a `http://localhost:5001` o a una IP local. El **Remote Tunnel** crea una dirección HTTPS temporal que permite a la demo llegar al KoboldCpp de tu PC.

1. En KoboldCpp, abre la pestaña **Network** antes de pulsar **Launch**.
2. Marca **Remote Tunnel** (en algunas versiones aparece en la pantalla principal).
3. Pulsa **Launch** y espera a que el modelo termine de cargar.
4. En la consola busca el mensaje de que el túnel está listo y copia la URL parecida a `https://algo.trycloudflare.com`.
5. Copia solo la dirección HTTPS base: no añadas `/#`, `/v1/chat/completions` ni otras rutas.
6. Usa la URL recién generada cada vez que reinicies KoboldCpp. El enlace puede cambiar entre sesiones; no reutilices uno antiguo.

### Pegar el túnel en la demo web de Umbral

1. Abre [la demo de Las ciudades del Umbral](https://las-ciudades-del-umbral.onrender.com/index.html).
2. Abre el panel **Conexión con KoboldCpp**.
3. Elige **Mi KoboldCpp**.
4. Pega en el campo de dirección la URL HTTPS que acaba de mostrar la consola, sin rutas adicionales.
5. Pulsa **Probar conexión**. Si el panel confirma que está conectado, prueba una conversación.
6. Si reinicias KoboldCpp o creas otro túnel, vuelve a pegar la URL nueva y repite la prueba.

La opción **La del servidor de la web** es diferente: utiliza el endpoint configurado en el servidor de la demo y no tu túnel personal. Si quieres usar el modelo de tu propio PC, elige **Mi KoboldCpp**.

**No guardes el enlace temporal en el repositorio ni lo publiques.** La dirección que compartiste antes no debe considerarse permanente: al reinstalar, crea un túnel nuevo.

### Seguridad

El túnel hace que tu KoboldCpp sea accesible desde Internet mientras esté activo. Cualquiera que obtenga la URL puede intentar usarlo y consumir recursos del PC. No lo publiques ni lo incluyas en commits, capturas públicas o documentación. Cierra KoboldCpp cuando termines y no abras el puerto 5001 en el router.

## 4. Conectar el juego descargado en el mismo PC o en la red de casa

### En el mismo PC

1. Abre KoboldCpp, selecciona el modelo y pulsa **Launch**.
2. En el juego abre **Ajustes → IA de la historia y los chats**.
3. Activa/selecciona **KoboldCpp** y deja la dirección como `http://localhost:5001` (o el endpoint que indique el panel).
4. Pulsa **Buscar mi modelo** si aparece y luego **Probar conexión**.

### En otro dispositivo de la misma Wi-Fi

1. En el PC con KoboldCpp, abre `cmd`, ejecuta `ipconfig` y apunta la **Dirección IPv4** de tu conexión.
2. En KoboldCpp, en **Network**, deja **Host** vacío o pon `0.0.0.0`, y usa el puerto `5001`.
3. Asegúrate de que el cortafuegos de Windows permite KoboldCpp en la red privada.
4. En el juego del móvil/tablet, escribe la IP del PC en **Dirección**, por ejemplo `192.168.1.139`. No uses `localhost`: en el móvil, localhost es el propio móvil.
5. Pulsa **Probar conexión**. No abras el puerto 5001 a Internet en el router.

## 5. Comprobar que la demo usa realmente la IA

La demo puede seguir contestando con el **narrador local** si KoboldCpp está apagado o la conexión falla. Que aparezca una respuesta no demuestra que el modelo esté conectado.

1. Confirma que el modelo terminó de cargar y que KoboldCpp sigue abierto.
2. En la demo pulsa **Probar conexión** y comprueba que el panel confirma la conexión.
3. Haz una pregunta de prueba y revisa el estado del panel.
4. Si muestra error, copia otra vez la URL actual del túnel en **Mi KoboldCpp** y vuelve a probar.
5. Si está conectado pero la narración sigue mezclando personajes o universos, prueba Qwen y Llama por separado. La demo de Umbral envía su propio canon desde los archivos del juego; no necesita una tarjeta de personaje de KoboldAI Lite.

## 6. Problemas frecuentes

| Síntoma | Qué comprobar |
|---|---|
| `No Models Selected` | Selecciona un archivo GGUF y vuelve a pulsar **Launch**. |
| La descarga no ha terminado | Espera a que llegue al 100 % y el modelo termine de cargar. |
| La demo dice que KoboldCpp no conecta | Comprueba que el modelo está cargado y que pegaste la URL HTTPS del túnel actual en **Mi KoboldCpp**. |
| La demo responde aunque esté desconectada | Puede estar usando el narrador local; fíate del estado de conexión, no solo de la respuesta. |
| El túnel no aparece | Comprueba Internet y el cortafuegos; espera el mensaje de túnel listo y reinicia KoboldCpp si es necesario. |
| Respuestas lentas o falta de memoria | Prueba Q4_K_M, GPU Layers automático o un modelo más pequeño. |

## Enlaces útiles

- [Descargas oficiales de KoboldCpp](https://github.com/LostRuins/koboldcpp/releases)
- [Documentación oficial de KoboldCpp](https://koboldcpp.net/docs/)
- [Modelos GGUF de Qwen3 8B](https://huggingface.co/Qwen/Qwen3-8B-GGUF)
- [Modelo GGUF de Llama 3.1 8B Instruct](https://huggingface.co/gaianet/Meta-Llama-3.1-8B-Instruct-GGUF)
- [Demo web de Umbral](https://las-ciudades-del-umbral.onrender.com/index.html)
- [Repositorio de Umbral](https://github.com/MarinaDP2006/RIFTS-GEARS)

## Save Slots: importante

Los Save Slots de KoboldAI Lite guardan sesiones de Lite; no separan ni configuran los universos de las demos. Umbral envía su propio canon e instrucciones. No necesitas cargar una tarjeta de personaje de Arcane ni de Umbral en Lite para que la demo funcione.
