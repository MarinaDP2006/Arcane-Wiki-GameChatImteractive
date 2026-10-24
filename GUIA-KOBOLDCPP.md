# KoboldCpp 1.123.1 · Qwen/Llama en Windows, PC, móvil y tablet

Esta configuración usa una instancia de KoboldCpp ejecutándose en tu PC y disponible solo en la red de casa. No requiere servicios de túnel, enlaces públicos ni Cloudflare.

## Dirección predeterminada de este PC

- IP del PC: **192.168.1.139**
- Dirección base: `http://192.168.1.139:5001`
- API OpenAI-compatible: `http://192.168.1.139:5001/v1`
- Chat completions: `http://192.168.1.139:5001/v1/chat/completions`
- Comprobar el modelo cargado: `http://192.168.1.139:5001/v1/models`

Si Windows asigna otra IP al PC, ejecuta `ipconfig` y cambia la dirección en Ajustes del juego o en el panel «Mi KoboldCpp». El código y la web usan la IP indicada arriba como valor inicial.

## 1. Preparar KoboldCpp

KoboldCpp suele funcionar como aplicación portátil: se inicia desde un ejecutable.

1. Descarga KoboldCpp desde sus [releases oficiales](https://github.com/LostRuins/koboldcpp/releases).
2. Abre KoboldCpp 1.123.1.
3. Selecciona **un solo archivo GGUF** en Model / Quick Launch.
4. En **Network**, deja **Host** vacío y pon **Port: 5001**.
5. Configura una contraseña en **Password** porque otros dispositivos podrán acceder desde la red de casa. No la guardes en documentación pública.
6. Pulsa **Launch** y espera a que el modelo termine de cargar.

No uses `127.0.0.1` como Host si quieres permitir conexiones desde móvil/tablet: esa dirección limita el servicio al mismo PC. No abras el puerto 5001 en el router ni publiques la dirección en Internet.

## 2. Elegir Qwen o Llama

Empieza con un modelo cuantizado **Q4_K_M** y cárgalo de uno en uno:

- **Qwen3 8B GGUF:** [Qwen/Qwen3-8B-GGUF](https://huggingface.co/Qwen/Qwen3-8B-GGUF).
- **Llama 3.1 8B Instruct GGUF:** [Meta-Llama-3.1-8B-Instruct-GGUF](https://huggingface.co/gaianet/Meta-Llama-3.1-8B-Instruct-GGUF).

En KoboldCpp, usa **HF Search** para encontrar el repositorio y el archivo Q4_K_M, selecciona el archivo, pulsa **Confirm Selection** y después **Launch**. Si el modelo consume demasiada memoria, baja GPU Layers o usa uno más pequeño.

## 3. Conectar el juego instalado en el PC

1. Deja KoboldCpp funcionando con Qwen o Llama cargado.
2. Abre Las ciudades del Umbral.
3. Entra en **Ajustes → IA** y selecciona **KoboldCpp**.
4. La dirección predeterminada es `http://192.168.1.139:5001/v1/chat/completions`.
5. Escribe la contraseña de KoboldCpp en el campo **Contraseña de KoboldCpp**, si activaste Password.
6. Pulsa **Buscar mi modelo** y **Probar conexión**.

La IA del juego usa el modelo que hayas cargado en KoboldCpp. Para cambiar de Qwen a Llama, detén/cambia el modelo en KoboldCpp y vuelve a probar la conexión.

## 4. Conectar desde móvil o tablet

1. Conecta móvil/tablet a la **misma Wi-Fi** que el PC.
2. Abre el juego instalado o la demo de desarrollo.
3. En Ajustes/Conexión con KoboldCpp, usa `http://192.168.1.139:5001`. El puerto 5001 y la ruta API se completan cuando corresponde.
4. Si configuraste Password, introduce la misma contraseña.
5. Pulsa **Probar conexión**.

No uses `localhost` en móvil/tablet: allí apunta al propio dispositivo, no al PC.

### Cortafuegos de Windows

Cuando Windows Firewall pregunte si KoboldCpp puede usar la red, permite el acceso en **redes privadas**. Si la pregunta ya no aparece, abre **Seguridad de Windows → Firewall y protección de red → Permitir una aplicación a través del firewall** y autoriza KoboldCpp en perfil Privado.

En el PC, abre CMD y ejecuta:

```bat
ipconfig
```

Busca **Dirección IPv4** del adaptador Wi-Fi/Ethernet conectado. La dirección predeterminada actual es `192.168.1.139`; sustitúyela en el juego si cambia.

## 5. Conectar desde la web publicada en Render (HTTPS)

La página de Render se abre mediante HTTPS, mientras que la dirección local predeterminada de KoboldCpp es HTTP. Chrome 142 o posterior incorpora un permiso **Acceso a la red local** para que una web segura pueda solicitar acceso a dispositivos de la red local.

1. Abre la página en Chrome actualizado.
2. En el panel de la demo de desarrollo, selecciona **Mi KoboldCpp**.
3. Escribe `http://192.168.1.139:5001` y la contraseña, si configuraste una.
4. Pulsa **Probar conexión** desde el propio panel.
5. Si Chrome muestra una solicitud de **Acceso a la red local**, elige **Permitir**.
6. Repite la concesión en cada dispositivo donde uses la web. Si el permiso ya se bloqueó, abre el icono de información del sitio → **Configuración de sitios** → **Acceso a la red local** → **Permitir**.

**Límite de compatibilidad:** este método depende del navegador. No todos los navegadores ni todas las versiones permiten desde HTTPS conectarse a una IP privada por HTTP. Si el navegador sigue bloqueando la llamada, no hay un ajuste del juego que pueda saltarse esa restricción. Usa el juego instalado o sirve la web desde tu PC dentro de la red local. No abras el puerto 5001 en el router.

## 6. Pruebas y solución de problemas

Primero prueba la API desde el PC y luego desde móvil/tablet:

`http://192.168.1.139:5001/v1/models`

Deberías ver un JSON con el modelo cargado.

| Síntoma | Qué revisar |
|---|---|
| No abre `/v1/models` en el PC | Espera la carga del modelo y revisa el puerto 5001. |
| Funciona en el PC, pero no en móvil/tablet | Misma Wi-Fi, Host vacío y cortafuegos de Windows permitido en perfil Privado. |
| La demo de Render no conecta | Acepta **Acceso a la red local** en Chrome moderno. Si el navegador no lo admite, usa el juego instalado o sirve la web en LAN. |
| Error de autenticación | Introduce la misma contraseña que está configurada en KoboldCpp. |
| El narrador responde, pero no es la IA | Comprueba el estado de conexión; los mensajes del narrador local no demuestran que KoboldCpp esté conectado. |
| Qwen/Llama responde muy lento | Prueba un GGUF Q4_K_M, ajusta GPU Layers o elige un modelo menor. |

## Enlaces

- [Releases de Las ciudades del Umbral](https://github.com/MarinaDP2006/RIFTS-GEARS/releases)
- [Problemas del proyecto](https://github.com/MarinaDP2006/RIFTS-GEARS/issues)
- [Releases oficiales de KoboldCpp](https://github.com/LostRuins/koboldcpp/releases)
- [Documentación oficial de acceso en red de KoboldCpp](https://koboldcpp.net/docs/api/remote-access/)
