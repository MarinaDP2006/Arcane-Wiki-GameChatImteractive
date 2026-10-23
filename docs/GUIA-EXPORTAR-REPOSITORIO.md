# Guía de repositorio, exportación y publicación

## Proyecto
Rifts & Gears es un juego narrativo con JavaScript, Three.js, Electron, Capacitor/Android y web estática. La versión de referencia observada en `package.json` es 1.27.0.

## Preparación
1. Instala Git y Node.js compatibles.
2. Clona: `git clone https://github.com/MarinaDP2006/RIFTS-GEARS.git`
3. Entra en el directorio y ejecuta `npm ci`.
4. Ejecuta `npm run check` antes de cambiar código.

## Carpetas clave
- `src/index.html`: entrada y orden de carga de módulos.
- `src/js/`: lógica del juego, IA, audio, escenas, mundo 3D, creador y app.
- `src/data/`: historia, personajes, relaciones, chats, atlas y datos del mundo.
- `src/css/`: estilos.
- `src/vendor/`: librerías de terceros.
- `web/`: web promocional y capturas.
- `scripts/`: comprobaciones, generación web y preparación móvil.
- `android/`: proyecto Android de Capacitor.
- `.github/workflows/`: compilaciones automatizadas.
- `GUIA-*.md`: documentación por tema.

## Ejecutar y construir
- Juego de escritorio: `npm start`.
- Comprobaciones: `npm run check`.
- Web: `npm run web`; genera `web-dist/`.
- Sincronización móvil: `npm run android:sync`.
- Windows/macOS/Android: usa los scripts o workflows del repositorio y valida los artefactos en dispositivos reales antes de distribuirlos.

## Exportar el repositorio
Copia con historial:
```bash
git clone https://github.com/MarinaDP2006/RIFTS-GEARS.git
cd RIFTS-GEARS
git fetch --all --prune
git bundle create ../rifts-gears.bundle --all
git bundle verify ../rifts-gears.bundle
```

ZIP de una rama rastreada, sin historial ni archivos ignorados:
```bash
git checkout main
git pull --ff-only
git archive --format=zip --output=../rifts-gears-source.zip main
```

También puedes usar GitHub → Code → Download ZIP. Para una copia reproducible completa, prefiere el clon más el bundle.

## Flujo seguro de ramas
1. Actualiza main y crea una rama por tarea.
2. Ejecuta `npm ci`, `npm run check` y la compilación relevante.
3. Revisa el diff y las licencias de recursos.
4. Abre PR, revisa los checks y resuelve conflictos.
5. Fusiona solo cambios comprobados. No fusiones ramas históricas de escritorio/móvil a ciegas.
6. Tras la fusión, repite las pruebas en main antes de publicar una release.

## No exportar a Git
No subas partidas, claves, tokens, certificados/keystores, modelos privados sin permiso, cachés ni builds locales. Los modelos personales deben tener licencia documentada. No publiques capturas de referencia como si fueran capturas reales del juego.

## Checklist de entrega
- `npm ci` y `npm run check` correctos.
- Web generada y rutas revisadas.
- Guardado/carga/exportación/importación probados.
- PC y móvil/tableta probados.
- LM Studio apagado no bloquea la partida.
- Audio y volumen comprobados.
- Licencias de modelos y recursos revisadas.
- Artefactos versionados, instalados desde cero y probados.

## Referencias
- [Repositorio](https://github.com/MarinaDP2006/RIFTS-GEARS)
- `GUIA-WEB-RENDER.md`
- `GUIA.md`
- `GUIA-LM-STUDIO.md`
- `PENDIENTES.md`
