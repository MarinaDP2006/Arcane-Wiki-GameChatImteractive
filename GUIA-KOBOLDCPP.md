# Guía de KoboldCpp para Las ciudades del Umbral

Esta guía configura KoboldCpp en Windows para usar Qwen o Llama desde el juego instalado y desde la demo web. El modelo se ejecuta en tu PC. Para dispositivos de la misma Wi-Fi no necesitas Remote Tunnel ni abrir puertos del router.

## Dirección predeterminada de este PC

- **IP del PC:** `192.168.1.139`
- **Puerto de KoboldCpp:** `5001`
- **Dirección base:** `http://192.168.1.139:5001`
- **Comprobación de la API:** `http://192.168.1.139:5001/v1/models`

El juego y la demo usan esa dirección como valor inicial para «Mi KoboldCpp». Solo funciona mientras el PC conserve esa IPv4 y el dispositivo esté conectado a la misma red local. Si cambia, actualízala en el campo de dirección. En el mismo PC también puedes usar `http://localhost:5001`.

## 1. Descargar KoboldCpp

1. Descarga el ejecutable desde [KoboldCpp Releases](https://github.com/LostRuins/koboldcpp/releases).
2. Guárdalo, por ejemplo, en `C:\\Kobold`; conserva los modelos GGUF en `C:\\Kobold\\models`.
3. Elige una versión compatible con el hardware: CUDA para GPU NVIDIA compatible, Vulkan/no-CUDA para otras GPU compatibles, o CPU si corresponde.

## 2. Cargar Qwen o Llama

KoboldCpp necesita un archivo GGUF. Para empezar, elige una cuantización Q4_K_M de un solo modelo:

- [Qwen3 8B GGUF](https://huggingface.co/Qwen/Qwen3-8B-GGUF)
- [Llama 3.1 8B Instruct GGUF](https://huggingface.co/gaianet/Meta-Llama-3.1-8B-Instruct-GGUF)

En KoboldCpp, abre **HF Search**, selecciona el archivo `.gguf`, confirma la selección y pulsa **Launch**. Carga un modelo cada vez y mantén KoboldCpp abierto mientras juegas.

## 3. Ajustes de red (sin Remote Tunnel)

En KoboldCpp, antes de **Launch**, abre **Network**:

- **Host:** vacío (o `0.0.0.0` para aceptar conexiones de la red local).
- **Port:** `5001`.
- **Remote Tunnel:** desactivado.
- **Password:** recomendable; si la configuras, usa la misma en la demo/juego.

No expongas el puerto 5001 a Internet ni configures port forwarding en el router.

## 4. Permitir la conexión en Windows y la Wi-Fi

1. En el PC, ejecuta `ipconfig` y confirma que la IPv4 de la conexión usada es `192.168.1.139`.
2. Marca tu red doméstica de confianza como **Privada** en Windows.
3. Permite KoboldCpp en Windows Firewall solo en redes privadas. Si necesitas crear una regla manual, abre PowerShell como administrador:
   ```powershell
   New-NetFirewallRule -DisplayName "KoboldCpp LAN 5001" -Direction Inbound -Action Allow -Protocol TCP -LocalPort 5001 -Profile Private
   ```
4. Desde el PC y desde el móvil/tablet, abre `http://192.168.1.139:5001/v1/models`. Debe aparecer JSON. En móvil, `localhost` apunta al móvil, no al PC.

## 5. Conectar la demo web

Abre la demo web publicada de Las ciudades del Umbral (usa la URL de Render configurada para este proyecto). Abre **Conexión con KoboldCpp** y elige **Mi KoboldCpp**. La dirección inicial es `http://192.168.1.139:5001`; pulsa **Probar conexión**. Si Chrome/Edge pide **Acceso a la red local**, pulsa **Permitir**. Si lo bloqueaste, abre la información del sitio → configuración/permisos del sitio → Acceso a la red local → Permitir. Introduce la contraseña si configuraste Password en KoboldCpp.

La demo no prueba tu IP automáticamente al cargar: debes pulsar el botón para que el navegador pueda pedir permiso en respuesta a una acción explícita.

## 6. Conectar el juego instalado

Abre **Ajustes → IA de la historia y los chats**, activa KoboldCpp y usa la dirección inicial `http://192.168.1.139:5001`. Pulsa **Probar conexión**. En el mismo PC puedes usar `http://localhost:5001`. Introduce Password si la configuraste en KoboldCpp.

## 7. Problemas frecuentes

| Problema | Qué comprobar |
|---|---|
| `/v1/models` no abre | Modelo cargado, Host vacío/`0.0.0.0`, puerto 5001, firewall privado y misma Wi-Fi. |
| El móvil no conecta | No uses `localhost`; evita redes de invitados o aislamiento entre dispositivos. |
| La web HTTPS pide permiso | Permite Acceso a la red local y pulsa Probar conexión otra vez. |
| La demo contesta sin IA | Revisa el estado: el narrador local no demuestra que KoboldCpp esté conectado. |
| Error de contraseña | Comprueba Network → Password y el campo de contraseña de la demo/juego. |
| Cambió la IPv4 | Actualiza la dirección guardada. `192.168.1.139` es la IPv4 conocida actual y puede cambiar si el router reasigna direcciones. |

## Enlaces oficiales

- [Descargas y versiones de KoboldCpp](https://github.com/LostRuins/koboldcpp/releases)
- [Documentación de KoboldCpp](https://koboldcpp.net/docs/)
- [Qwen3 8B GGUF](https://huggingface.co/Qwen/Qwen3-8B-GGUF)
- [Llama 3.1 8B Instruct GGUF](https://huggingface.co/gaianet/Meta-Llama-3.1-8B-Instruct-GGUF)

Los Save Slots de KoboldAI Lite solo guardan sesiones de Lite; Umbral envía su propio contexto de mundo. No necesitas cargar una tarjeta de personaje en Lite.
