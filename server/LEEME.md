# Servidor del roleplay libre (Arcane)

La historia de la rama de Arcane ya no tiene opciones: escribes lo que dice o hace tu personaje
y los personajes de la escena te responden, te preguntan y la historia avanza según lo que hagas,
sin salirse de la temporada 1 y 2. Para eso el juego necesita una IA, y este servidor es el puente.

```
Juego (web, Windows, Android)  →  este servidor (Render)  →  Ollama Cloud (Gemma 4 31B)
```

- **Modelo:** `gemma4:31b` (unos 19 GB; nadie lo descarga, corre en Ollama Cloud).
  Muy bueno en español, sigue bien las instrucciones de personaje y es de los más baratos.
  Alternativas permitidas: `mistral-large-3:675b` (más rico narrando, más caro) y `gpt-oss:120b`.
- **La clave** `OLLAMA_API_KEY` solo vive aquí, como secreto de Render. Nunca en el juego ni en GitHub.
- Límite de 20 mensajes por minuto y por IP, respuestas de 700 tokens como máximo.

## Ponerlo en marcha en Render

1. Crea una clave en ollama.com → Settings → Keys (cuenta gratis).
2. En Render: **New → Web Service**, repositorio `MarinaDP2006/RIFTS-GEARS`, rama de Arcane.
   - Runtime: Node · Build: `node scripts/build-web.js` (monta también la web) · Start: `node server/roleplay-server.js`
   - Plan: Free · Nombre: `rifts-gears-arcane`
   - Variable de entorno secreta: `OLLAMA_API_KEY` = tu clave
3. Comprueba `https://rifts-gears-arcane.onrender.com/api/health` → `"ready": true`.
4. Si el nombre del servicio es otro, cambia la dirección en `src/js/roleplay-config.js`.

## Coste

| Pieza | Gratis | De pago |
|---|---|---|
| Render (este servidor) | Free: se duerme tras 15 min sin uso; la primera respuesta tarda hasta ~1 min | Starter 7 $/mes, siempre despierto |
| Ollama Cloud (la IA) | Free: créditos de inicio, 1 petición a la vez | Pro 20 $/mes con 60 $ de créditos |

Gemma 4 31B cuesta unos 0,14 $ por millón de tokens de entrada y 0,40 $ de salida.
Un turno de historia gasta unos 3.000 tokens, así que 1.000 turnos son aproximadamente medio dólar.

## Probar en local

```
OLLAMA_API_KEY=tu_clave node server/roleplay-server.js
```

Y en el juego, Ajustes → IA → «Otro servidor compatible» con `http://localhost:8787/api/roleplay`.
