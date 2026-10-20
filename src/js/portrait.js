// Retratos del juego. Usa el motor pintado (Painter) y, si la jugadora ha puesto
// su propio arte en la carpeta de arte, usa esas imágenes en su lugar.
(function () {
  const RIM = { zaun: '#3fbf9f', piltover: '#e3a94a', noxus: '#c0453a', otro: '#8a6ad9' };

  // Rasgos pintados de cada personaje (ver Painter.DEFAULTS para el resto).
  const LOOKS = {
    vi: { skin: '#e8b394', face: 'angular', eyes: 'almendra', eyeColor: '#4a6a9a', brows: 'gruesas', hair: '#e0457b', style: 'undercut', outfit: 'chaqueta', outfitColor: '#8a2a3a', accents: ['tattoo', 'piercing'] },
    jinx: { skin: '#f2d8cc', face: 'corazon', eyes: 'grandes', eyeColor: '#e0457b', brows: 'finas', hair: '#3fa9f5', style: 'braids', outfit: 'top', outfitColor: '#2a2a3a', accents: ['freckles'], makeup: 'sombra', makeupColor: '#7a3aa0' },
    caitlyn: { skin: '#f3d6c2', face: 'oval', eyes: 'almendra', eyeColor: '#3a5ab0', brows: 'arqueadas', hair: '#1e1c30', style: 'long', outfit: 'uniforme', outfitColor: '#2f4a8a', accents: ['hat'] },
    jayce: { skin: '#dcae8e', face: 'angular', eyes: 'almendra', eyeColor: '#6a4a2a', brows: 'gruesas', hair: '#3a2618', style: 'swept', outfit: 'abrigo', outfitColor: '#c4c0b8', accents: [] },
    viktor: { skin: '#e2cbb8', face: 'largo', eyes: 'cansados', eyeColor: '#d9a830', brows: 'rectas', hair: '#3b2a24', style: 'swept', outfit: 'bata', outfitColor: '#6a4a3a', shirt: '#3a2a24', accents: ['collar'] },
    mel: { skin: '#8a5a3c', face: 'oval', eyes: 'almendra', eyeColor: '#c48a2a', brows: 'arqueadas', hair: '#1a1210', style: 'bun', outfit: 'vestido', outfitColor: '#f0e6d0', accents: ['gold'], makeup: 'eyeliner' },
    heimerdinger: { skin: '#e9c9a0', face: 'redondo', eyes: 'grandes', eyeColor: '#4a6a3a', brows: 'gruesas', hair: '#f2f2f2', style: 'wild', outfit: 'abrigo', outfitColor: '#7a5a3a', ears: 'yordle', accents: ['mustache'] },
    silco: { skin: '#cfc0b5', face: 'largo', eyes: 'rasgados', eyeColor: '#c0302a', brows: 'rectas', hair: '#141414', style: 'slick', outfit: 'abrigo', outfitColor: '#3a2040', accents: ['scar'], browAngle: 3 },
    vander: { skin: '#d8a888', face: 'redondo', eyes: 'cansados', eyeColor: '#5a4a3a', brows: 'gruesas', hair: '#c9c9c9', style: 'short', outfit: 'chaqueta', outfitColor: '#5a3a24', accents: ['beard'] },
    ekko: { skin: '#5a3a28', face: 'oval', eyes: 'almendra', eyeColor: '#3a2a1a', brows: 'medias', hair: '#f2f2f2', style: 'mohawk', outfit: 'chaqueta', outfitColor: '#2a6a5a', accents: ['paint'] },
    sevika: { skin: '#c9a080', face: 'angular', eyes: 'rasgados', eyeColor: '#5a3a3a', brows: 'gruesas', hair: '#5a4a5a', style: 'undercut', outfit: 'top', outfitColor: '#2a2a2a', accents: ['arm'], browAngle: 2 },
    singed: { skin: '#c9c0a8', face: 'largo', eyes: 'cansados', eyeColor: '#8fbf3a', brows: 'finas', hair: '#d9d9d9', style: 'bald', outfit: 'bata', outfitColor: '#4a5a3a', accents: ['mask'] },
    ambessa: { skin: '#6b4430', face: 'angular', eyes: 'rasgados', eyeColor: '#7a4a1a', brows: 'gruesas', hair: '#1a1010', style: 'braids', outfit: 'uniforme', outfitColor: '#6a1a1a', accents: ['gold', 'scar'] },
    marcus: { skin: '#d8b498', face: 'largo', eyes: 'cansados', eyeColor: '#4a4a3a', brows: 'medias', hair: '#2a2a2a', style: 'short', outfit: 'uniforme', outfitColor: '#2f4a8a', accents: ['mustache'] },
    cassandra: { skin: '#f0d0b8', face: 'oval', eyes: 'almendra', eyeColor: '#3a5ab0', brows: 'arqueadas', hair: '#3a2a2a', style: 'bun', outfit: 'vestido', outfitColor: '#2f4a8a', accents: ['gold'] },
    mylo: { skin: '#d9b494', face: 'oval', eyes: 'almendra', eyeColor: '#4a3a2a', brows: 'medias', hair: '#3a2410', style: 'messy', outfit: 'chaqueta', outfitColor: '#6a5a3a', accents: [] },
    claggor: { skin: '#a87a5a', face: 'redondo', eyes: 'almendra', eyeColor: '#3a2a1a', brows: 'gruesas', hair: '#1a1410', style: 'messy', outfit: 'mono', outfitColor: '#4a5a6a', accents: ['goggles'] },
    benzo: { skin: '#6b4a34', face: 'redondo', eyes: 'cansados', eyeColor: '#3a2a1a', brows: 'gruesas', hair: '#d9d9d9', style: 'bald', outfit: 'mono', outfitColor: '#5a6a4a', accents: ['beard', 'glasses'] },
    scar: { skin: '#b89070', face: 'angular', eyes: 'rasgados', eyeColor: '#2a3a2a', brows: 'gruesas', hair: '#2a2a2a', style: 'undercut', outfit: 'harapos', outfitColor: '#2a4a2a', shirt: '#2a5a3a', accents: ['scar', 'paint'] },
    isha: { skin: '#c9946a', face: 'redondo', eyes: 'grandes', eyeColor: '#5a3a1a', brows: 'finas', hair: '#7a4a2a', style: 'pigtails', outfit: 'harapos', outfitColor: '#c4602a', accents: ['goggles', 'freckles'] },
    sky: { skin: '#f0d0b8', face: 'oval', eyes: 'grandes', eyeColor: '#5a7a4a', brows: 'finas', hair: '#3a2a1a', style: 'bob', outfit: 'bata', outfitColor: '#d9d4c8', accents: ['glasses'] },
    loris: { skin: '#d9b498', face: 'redondo', eyes: 'almendra', eyeColor: '#4a3a2a', brows: 'medias', hair: '#5a3a1a', style: 'short', outfit: 'uniforme', outfitColor: '#2f4a8a', accents: ['mustache'] },
  };

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
    return player?.origin === 'piltover'
      ? { rim: RIM.piltover, bg: ['#7a5a2a', '#1a1208'] }
      : { rim: RIM.zaun, bg: ['#1f4a44', '#060c0c'] };
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
