# Publicar Arcane-fangame y crear releases

El repositorio `MarinaDP2006/Arcane-fangame` existe, pero estaba vacío cuando se preparó este procedimiento. La rama que contiene el fangame es `claude/project-thread-9huivc-arcane` de `RIFTS-GEARS`. No copies esta rama a `RIFTS-GEARS/main`: esa rama pertenece al mundo original.

## 1. Permitir la copia entre repositorios

1. En GitHub, crea un fine-grained personal access token limitado solo al repositorio `Arcane-fangame`, con permiso **Contents: Read and write**. No lo compartas en chats ni lo guardes en el código.
2. En `RIFTS-GEARS`, abre **Settings → Secrets and variables → Actions → New repository secret**.
3. Nombre: `ARCANE_REPO_TOKEN`. Valor: el token que acabas de crear.
4. Abre **Actions → Publicar Arcane en el repositorio independiente → Run workflow**.
5. En el campo de confirmación escribe exactamente `PUBLICAR` y ejecuta el workflow.

El workflow copia la rama Arcane completa, incluyendo su historial y recursos binarios, a `Arcane-fangame/main`. Solo reemplaza la rama `main` del repositorio destino; no escribe en `RIFTS-GEARS/main`.

## 2. Crear los releases

Tras la copia, entra en `Arcane-fangame → Actions` y espera a que terminen los workflows de escritorio y Android. Si los builds pasan, crea la etiqueta `arcane-v1.27.0` en el repositorio **Arcane-fangame** (el número debe coincidir con `package.json`). El workflow de escritorio crea la Release con instaladores Windows, DMG y ZIP de macOS; el de Android adjunta un APK de prueba.

Para publicar en Google Play se necesita una clave de firma propia y los secretos `ANDROID_KEYSTORE_BASE64`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS` y `ANDROID_KEY_PASSWORD`. No uses ni subas el keystore al repositorio.

## 3. Descargas

Las versiones aparecerán en la pestaña **Releases** de `https://github.com/MarinaDP2006/Arcane-fangame/releases`. No se debe anunciar una versión como estable hasta comprobar los builds y probar los instaladores.
