# Auditoría de ramas de Grietas & Gears

Actualizada el 22 de octubre de 2026. Comparación de las ramas de GitHub contra `main`.

## Resultado verificado

| Rama | Commits exclusivos | Commits de diferencia por detrás de main | Decisión |
|---|---:|---:|---|
| `main` | — | — | Rama de desarrollo y distribución que debemos conservar |
| `feature/windows-only-polish` | 0 | 13 al iniciar esta auditoría | Se puede borrar sin fusionar |
| `claude/project-thread-fxbpak` | 1 | 25 al iniciar esta auditoría | **No fusionar en bloque**; revisar cambios exclusivos antes de borrar |
| `claude/project-thread-40z2ko` | 2 | 25 al iniciar esta auditoría | **No fusionar en bloque**; revisar cambios exclusivos antes de borrar |

Se ha comprobado que `main` **ya incluye** `PRIVACIDAD.md`, `src/js/i18n.js`, `src/i18n/en.js` y `scripts/i18n-build.js`. También contiene los cambios de Windows y de la cámara que hemos implementado posteriormente. Las ramas de Claude conservan configuraciones antiguas de macOS/Android y del nombre de la aplicación. No deben fusionarse enteras porque sobrescribirían archivos más recientes o reintroducirían plataformas retiradas.

**Pendiente de inspección línea a línea:** cambios exclusivos de la rama `claude/project-thread-fxbpak` en `PRIVACIDAD.md`, `README.md` y `src/js/app.js`, y los de `claude/project-thread-40z2ko` en internacionalización y otros archivos. Una diferencia de commits no demuestra por sí sola que falte una función: algunos cambios pueden estar ya incluidos mediante otras fusiones o implementaciones equivalentes. No borrar estas ramas hasta concluir la comparación específica.

## Cómo borrar la rama feature desde GitHub

1. Abre la página de [ramas del repositorio](https://github.com/MarinaDP2006/grietas-and-gears/branches).
2. Localiza `feature/windows-only-polish`.
3. Usa la papelera **Delete branch**. No es necesario fusionarla.
4. Conserva `main`.

No se ha borrado ninguna rama ni archivo de imágenes durante esta auditoría.

## Convención de comentarios de código

Al modificar un método o función, documentar arriba de su declaración **qué hace**, sus entradas y salida cuando no sean evidentes, y sus posibles efectos sobre estado, archivos, red o interfaz. Evitar comentarios que solo repiten el nombre sin aportar contexto.

Se han revisado y completado los comentarios de todas las declaraciones `function` de estos seis archivos principales:
- `main.js`
- `src/js/app.js`
- `src/js/world.js`
- `src/js/world3d.js`
- `src/js/avatars3d.js`
- `src/js/game.js`

La norma también debe extenderse al resto de módulos, funciones flecha y métodos de objeto a medida que se revisen. Añadir comentarios no sustituye las pruebas de juego.

## Comprobaciones antes de lanzar

```powershell
npm ci
npm run check
node --check main.js
node --check src/js/world.js
node --check src/js/world3d.js
node --check src/js/avatars3d.js
node --check src/js/game.js
node --check src/js/app.js
npm run dist:win
```

Las pruebas anteriores deben ejecutarse en un entorno Windows válido o revisarse en GitHub Actions; su resultado no se ha confirmado en esta auditoría.
