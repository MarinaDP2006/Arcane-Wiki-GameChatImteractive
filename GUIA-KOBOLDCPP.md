# IA local con KoboldCpp

Con KoboldCpp la historia libre y los chats funcionan con una IA en tu propio PC, sin internet y sin clave.

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
