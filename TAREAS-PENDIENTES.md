# Lista de trabajo · Grietas & Gears

Actualizado: 22 de octubre de 2026. Estado revisado sobre `main`.

## Hecho (código confirmado)
- [x] Configurar los comandos de distribución para Windows (instalador NSIS y ejecutable portable).
- [x] Sustituir el flujo multiplataforma de GitHub Actions por uno centrado en Windows.
- [x] Añadir comprobación automática de datos, sintaxis y existencia de dos archivos .exe.
- [x] Retirar configuración Capacitor, script de preparación Android, CSS y JS exclusivos de móvil.
- [x] Eliminar sus referencias del HTML y de las dependencias directas del package-lock.
- [x] Ajustar atmósfera 3D de Piltover/Zaun (color, niebla, contraste, bloom) y seguimiento de cámara.
- [x] Documentar descarga, desarrollo y guardado para Windows.

## Nueva corrección (22/10/2026)
- [x] Movimiento con colisiones subdivididas por fotograma para no atravesar edificios al correr o sufrir caídas de FPS.
- [x] Se mantienen íntegros los recursos gráficos y las imágenes existentes.

## Revisión de ramas y documentación del código
- [x] Comparar `main` con `feature/windows-only-polish` y las dos ramas `claude/project-thread-*`.
- [x] Confirmar que `feature/windows-only-polish` no tiene commits exclusivos y puede eliminarse sin fusionar.
- [x] Confirmar que `main` contiene privacidad y traducciones ya presentes en trabajos de Claude.
- [x] Documentar todos los métodos declarados mediante `function` en los seis archivos principales del motor, interfaz e historia; añadidos 145 comentarios.
- [x] Registrar conclusiones y instrucciones en `REVISION-RAMAS.md`.
- [ ] Eliminar la rama `feature/windows-only-polish` en GitHub (todavía no se ha borrado).
- [ ] Inspeccionar línea a línea los commits exclusivos de Claude y retirar esas ramas solo después de conservar lo necesario.
- [ ] Extender los comentarios descriptivos a funciones flecha y otros módulos pendientes.

## Pendiente prioritario
- [ ] Verificar un run completo de Actions Windows (npm ci, npm run check, sintaxis y electron-builder). No se ha confirmado ejecución correcta.
- [ ] Generar y probar el instalador y el portable en Windows real: instalación, arranque, permisos y desinstalación.
- [ ] Regenerar completamente `package-lock.json` con `npm install --package-lock-only` y confirmar que no quedan paquetes transitivos de Capacitor sin uso.
- [ ] Revisar y retirar el árbol `android/` y posibles salidas `www/` versionadas, con inventario previo para evitar borrar recursos reutilizados.
- [ ] Revisar referencias residuales a Capacitor/Android en código, assets y workflows.
- [ ] Probar controles de teclado/ratón, detección de colisiones, interacción con NPC, viajes y mapa 2D de respaldo.
- [ ] Hacer una partida de principio a fin por las rutas posibles; comprobar guardado/carga, condiciones de diálogo y finales.

## Mejoras artísticas y de juego todavía pendientes
- [ ] Escenarios más detallados: materiales, geometría, calles y elementos ambientales sin sacrificar rendimiento.
- [ ] Animación y movimiento más natural de NPC y protagonista; revisar contacto con el suelo y transiciones.
- [ ] Interacciones de entorno y diálogos contextuales vinculados a las decisiones del jugador.
- [ ] Perfilado gráfico en PC modestos, calidad adaptable, estabilidad y accesibilidad.
- [ ] Capturas y vídeo de prueba del resultado, verificando la estética cinematográfica inspirada en Arcane.

**Nota:** mejoras de color/cámara no equivalen a haber completado el realismo de escenarios, modelos y jugabilidad. No modificar la ruta de partidas `%APPDATA%\\Arcane Piltover y Zaun\\partidas`.
