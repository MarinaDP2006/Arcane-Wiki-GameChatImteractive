# Música de Rifts & Gears

## Estado actual

El código reproduce una banda sonora procedural mediante Web Audio. **No hay pistas MP3 finales versionadas en este repositorio**; las rutas siguientes son objetivos de integración, no archivos existentes.

| Uso | Archivo previsto |
|---|---|
| Menú / inicio | `assets/music/menu-theme.mp3` |
| Aurelia | `assets/music/aurelia-theme.mp3` |
| Nácar | `assets/music/nacar-theme.mp3` |

Los IDs internos `wiki`, `piltover` y `zaun` se conservan por compatibilidad, aunque la interfaz muestra Aurelia y Nácar.

## Requisito de los dos proyectos

Cuando se incorporen los MP3 finales, deben copiarse **byte por byte, sin reexportarlos ni recomprimirlos** a `RIFTS-GEARS` y `Arcane-fangame`. Las dos versiones pueden cambiar el contexto visual, pero compartirán exactamente los mismos archivos de música. Conviene verificar los SHA-256 antes de publicar ambos repositorios.

## Integración pendiente

1. Añadir los tres archivos finales con licencia comprobada.
2. Mapear menú, Aurelia y Nácar a las pistas; conservar la música procedural como fallback.
3. Evitar superposición al cambiar de ciudad y probar volumen, silencio, pausa y bucle.
4. Verificar que Electron, la web y Capacitor empaquetan las pistas.
5. Ejecutar `npm run check`, `npm run web` y `npm run android:sync`; probar manualmente escritorio, navegador y Android.

No usar melodías ni grabaciones comerciales sin licencia compatible. La documentación no implica que las pistas finales estén creadas o integradas.
