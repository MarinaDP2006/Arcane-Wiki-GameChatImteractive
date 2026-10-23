// Retratos del juego. Usa el motor pintado (Painter) y, si la jugadora ha puesto
// su propio arte en la carpeta de arte, usa esas imágenes en su lugar.
(function () {
  const RIM = { nacar: '#55d6a2', aurelia: '#d9b46a', otro: '#7f9bb8' };

  // Rasgos pintados extra por personaje (el reparto del Umbral trae los suyos en WIKI).
  const LOOKS = {};

  function bgFor(colors) {
    return [colors?.[0] || '#3a3050', colors?.[1] || '#0d0b14'];
  }

  function charLook(id) {
    const c = window.WIKI.personajes.find((p) => p.id === id);
    return { look: LOOKS[id] || c?.look || {}, rim: RIM[c?.origin] || RIM.otro, bg: bgFor(c?.colors) };
  }

  // Cara (avatares pequeños) o cuerpo entero (bustos y Códice) de la carpeta de arte.
  function customChar(id, body) {
    const A = window.CustomArt;
    return body ? A?.image('personajes', id) || A?.image('caras', id) : A?.image('caras', id) || A?.image('personajes', id);
  }

  function charURL(id, size = 256, body = false) {
    const custom = customChar(id, body);
    if (custom) return custom;
    const { look, rim, bg } = charLook(id);
    return Painter.toURL(look, { rim, bg, size });
  }

  function playerOpts(player) {
    return player?.origin === 'aurelia'
      ? { rim: RIM.aurelia, bg: ['#7a5a2a', '#1a1208'] }
      : { rim: RIM.nacar, bg: ['#1f4a44', '#060c0c'] };
  }

  function playerURL(player, size = 256) {
    if (player?.photo) return player.photo;
    return Painter.toURL(player?.look || {}, { ...playerOpts(player), size });
  }

  const img = (src, alt, extra = '') => `<img class="portrait-img ${extra}" src="${src}" alt="${U.esc(alt || '')}" draggable="false">`;

  function forCharacter(id) {
    const c = window.WIKI.personajes.find((p) => p.id === id);
    const custom = customChar(id, false);
    const isFace = custom && custom === window.CustomArt?.image('caras', id);
    return img(charURL(id), c?.name || id, custom && !isFace ? 'art-custom' : '');
  }

  // Retrato grande: cuerpo entero si la jugadora lo tiene en la carpeta de arte.
  function bodyFor(id) {
    const c = window.WIKI.personajes.find((p) => p.id === id);
    const body = window.CustomArt?.image('personajes', id);
    return body ? img(body, c?.name || id, 'art-body') : forCharacter(id);
  }

  function forPlayer(player) {
    return img(playerURL(player), player?.name || 'Tu personaje');
  }

  // Retrato genérico (habitantes del mapa).
  function svg(look, colors, opts = {}) {
    return img(Painter.toURL(look, { bg: bgFor(colors), rim: colors?.[0], size: 128 }), opts.label);
  }

  // Ilustración para entradas del Códice que no son personas: escena pintada o emblema.
  function emblem(entry, icon) {
    const custom = entry.id && window.CustomArt?.image('codice', entry.id);
    if (custom) return img(custom, entry.name);
    if (entry.id && window.Scenes?.has(entry.id)) return img(Scenes.thumb(entry.id), entry.name);
    const [a, b] = entry.colors || ['#7a5abf', '#140f24'];
    const id = `e${Math.random().toString(36).slice(2, 8)}`;
    return `<svg viewBox="0 0 160 160" class="portrait-svg" role="img" aria-label="${U.esc(entry.name)}">
      <defs><radialGradient id="${id}" cx="40%" cy="35%" r="80%"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></radialGradient></defs>
      <rect width="160" height="160" fill="url(#${id})"/>
      <g fill="none" stroke="#fff" opacity=".2"><polygon points="80,18 134,49 134,111 80,142 26,111 26,49"/><polygon points="80,38 116,59 116,101 80,122 44,101 44,59"/></g>
      <text x="80" y="98" text-anchor="middle" font-size="50">${icon}</text>
    </svg>`;
  }

  window.Portrait = { customChar, bodyFor, forCharacter, forPlayer, svg, emblem, charURL, playerURL, charLook, playerOpts, LOOKS, RIM };
})();
