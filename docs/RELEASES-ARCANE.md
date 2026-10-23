# Publicar Arcane-fangame y crear releases

El repositorio `MarinaDP2006/Arcane-fangame` existe, pero estaba vacío cuando se preparó este procedimiento. La rama que contiene el fangame es `claude/project-thread-9huivc-arcane` de `RIFTS-GEARS`. No copies esta rama a `RIFTS-GEARS/main`: esa rama pertenece al mundo original.

## 1. Permitir la copia entre repositorios

1. En GitHub, crea un fine-grained personal access token limitado solo al repositorio `Arcane-fangame`, con permiso **Contents: Read and write**. No lo compartas en chats ni lo guardes en el código.
2. En `RIFTS-GEARS`, abre **Settings → Secrets and variables → Actions → New repository secret**.
3. Nombre: `ARCANE_REPO_TOKEN`. Valor: el token que acabas de crear.
4. Abre **Actions → Publicar Arcane en el repositorio independiente → Run workflow**.
5. En el campo de confirmación escribe exactamente `PUBLICAR` y ejecuta el workflow.

El workflow exporta el árbol actual de la rama Arcane, incluidos sus recursos binarios, a un historial independiente en `Arcane-fangame/main`; no arrastra el historial compartido de `RIFTS-GEARS/main`. Después crea y publica automáticamente la etiqueta `arcane-v` más el número de versión de `package.json`. Esto dispara las compilaciones de escritorio y Android y crea la primera Release. Solo reemplaza `Arcane-fangame/main`; no escribe en `RIFTS-GEARS/main`.

## 2. Crear los releases

Tras ejecutar la publicación, entra en `Arcane-fangame → Actions` y espera a que terminen los workflows de escritorio y Android. La etiqueta de la primera versión se genera desde `package.json`; el workflow de escritorio crea la Release con instaladores Windows, DMG y ZIP de macOS, y el de Android adjunta un APK de prueba. Si algún build falla, no anuncies la versión como estable.

Para publicar en Google Play se necesita una clave de firma propia y los secretos `ANDROID_KEYSTORE_BASE64`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS` y `ANDROID_KEY_PASSWORD`. No uses ni subas el keystore al repositorio.

## 3. Descargas

Las versiones aparecerán en la pestaña **Releases** de `https://github.com/MarinaDP2006/Arcane-fangame/releases`. No se debe anunciar una versión como estable hasta comprobar los builds y probar los instaladores.
