# Publicar el fangame en Arcane-fangame

Esta operación copia únicamente la rama `claude/project-thread-9huivc-arcane` al repositorio independiente `MarinaDP2006/Arcane-fangame`. No modifica los archivos del universo original de `main`.

1. En GitHub crea un fine-grained token limitado al repositorio `Arcane-fangame` con permiso **Contents: Read and write**.
2. En `RIFTS-GEARS → Settings → Secrets and variables → Actions`, crea el secreto `ARCANE_REPO_TOKEN` con ese token. No lo pegues en un chat ni en un archivo.
3. Abre `RIFTS-GEARS → Actions → Publicar Arcane en el repositorio independiente → Run workflow`.
4. Escribe exactamente `PUBLICAR` en el campo de confirmación y ejecuta el workflow.
5. El workflow copia la rama Arcane completa a `Arcane-fangame/main`, crea la etiqueta `arcane-v` + la versión de `package.json` y dispara las compilaciones de Windows, macOS y Android.
6. Revisa `Arcane-fangame → Actions`. Cuando los tres builds terminen correctamente, la Release estará en https://github.com/MarinaDP2006/Arcane-fangame/releases.

La primera ejecución reemplaza la rama `main` del repositorio destino, que se preparó para recibir el fangame. Las siguientes ejecuciones vuelven a sincronizar esa rama y regeneran la Release de la versión actual. No se comparte ni se publica ninguna clave de IA.
