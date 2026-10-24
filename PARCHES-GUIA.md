# PARCHES-GUIA.md — RIFTS-GEARS

Guía para aplicar y validar los parches destinados a **RIFTS-GEARS / Las ciudades del Umbral**. No mezcles este proyecto con Arcane-fangame.

## Antes de empezar

1. Clona o actualiza `https://github.com/MarinaDP2006/RIFTS-GEARS`.
2. Abre una terminal en la raíz del repositorio, donde está `package.json`.
3. Ejecuta `git status`. Guarda tus cambios locales con un commit o una copia de seguridad antes de aplicar el parche.

## Parche de escala 3D y KoboldCpp/Lite

Archivo del paquete: `rifts-gears.patch`.

Copia el archivo del parche a la raíz del repositorio y ejecuta:

```bash
git apply --check rifts-gears.patch
git apply rifts-gears.patch
npm ci
npm run check
```

Si la comprobación previa falla, no fuerces la aplicación. Revisa las diferencias entre tu versión y la que espera el parche y adapta solo los cambios necesarios.

Cambios previstos:
- `src/js/avatars3d.js`: cambia la altura objetivo de los avatares de 64 a 20 unidades.
- `GUIA-KOBOLDCPP.md`: explica la interfaz web de KoboldAI Lite y el endpoint de API.

El ajuste de escala debe verificarse dentro del mapa. Comprueba los modelos GLB/FBX frente a edificios, calles y puertas; revisa pies sobre el suelo, movimiento e interacción.

## Renovación visual de Las ciudades del Umbral (opcional)

El paquete `repos-ui-refresh-patch.zip` contiene una sección separada para RIFTS-GEARS:
- `RIFTS-GEARS/src/css/home-refresh.css` → copiar a `src/css/home-refresh.css`.
- `RIFTS-GEARS/src/img/brand/umbral-mark.svg` → copiar a `src/img/brand/umbral-mark.svg`.
- `RIFTS-GEARS/src/img/umbral/avatars-ai/cast-strip-ai.jpg` → copiar a `src/img/umbral/avatars-ai/cast-strip-ai.jpg`.

Copia únicamente estos archivos y mezcla las carpetas; no sustituyas directorios existentes. En `src/index.html`, añade junto a los enlaces CSS existentes:

```html
<link rel="icon" type="image/svg+xml" href="img/brand/umbral-mark.svg">
<link rel="stylesheet" href="css/home-refresh.css">
```

En `src/js/app.js`, inserta el bloque de retratos que aparece en la sección RIFTS-GEARS de `apply-changes.patch` solo si el código de inicio actual contiene el contenedor `menu` y el punto de inserción coincide. No apliques el parche entero sin revisarlo: contiene bloques para dos repositorios con rutas repetidas.

## Validación y subida a GitHub

```bash
git status
git diff --check
npm run check
```

Prueba el menú y el mapa. Si todo funciona, revisa los cambios en GitHub Desktop o VS Code, crea un commit descriptivo y haz push a tu rama.

## Separación de proyectos

Este parche pertenece exclusivamente a RIFTS-GEARS. No copies assets, código ni datos de Arcane-fangame aquí salvo que se hayan preparado expresamente para este repositorio. No reemplaces los mapas, personajes, avatares ni modelos originales.
