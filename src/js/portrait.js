// Retratos ilustrados en SVG generados a partir de unos pocos rasgos.
// Se usan para los personajes de la serie y para el avatar del jugador.
(function () {
  function shade(hex, amt) {
    const n = parseInt(hex.slice(1), 16);
    const c = (v) => Math.max(0, Math.min(255, v + amt));
    const r = c((n >> 16) & 255), g = c((n >> 8) & 255), b = c(n & 255);
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
  }

  function hairBack(style, hair) {
    switch (style) {
      case 'long': return `<path d="M30 58 Q28 112 40 132 L80 132 L120 132 Q132 112 130 58 Q118 30 80 28 Q42 30 30 58Z" fill="${hair}"/>`;
      case 'braids': return `<path d="M40 70 Q30 120 34 150 L44 150 Q42 110 50 80Z M120 70 Q130 120 126 150 L116 150 Q118 110 110 80Z" fill="${hair}"/>`;
      case 'pigtails': return `<circle cx="34" cy="64" r="15" fill="${hair}"/><circle cx="126" cy="64" r="15" fill="${hair}"/>`;
      case 'bun': return `<circle cx="80" cy="24" r="16" fill="${hair}"/>`;
      default: return '';
    }
  }

  function hairFront(style, hair) {
    const d = shade(hair, -30);
    switch (style) {
      case 'bald': return '';
      case 'mohawk': return `<path d="M70 22 Q80 4 90 22 L92 52 L68 52Z" fill="${hair}"/>`;
      case 'undercut': return `<path d="M44 52 Q52 22 84 22 Q112 24 118 50 Q100 38 84 40 Q62 40 44 52Z" fill="${hair}"/><path d="M44 52 Q44 60 46 66" stroke="${d}" stroke-width="3" fill="none"/>`;
      case 'messy': return `<path d="M40 60 Q36 26 70 22 Q76 12 88 20 Q124 22 120 60 Q112 44 104 48 Q98 36 86 44 Q76 34 66 46 Q54 40 40 60Z" fill="${hair}"/>`;
      case 'swept': return `<path d="M42 56 Q42 22 82 20 Q118 22 118 54 Q108 36 80 36 Q60 36 42 56Z" fill="${hair}"/><path d="M58 30 Q80 24 108 36" stroke="${d}" stroke-width="2" fill="none"/>`;
      case 'slick': return `<path d="M42 54 Q44 22 80 22 Q116 22 118 54 Q104 34 80 34 Q56 34 42 54Z" fill="${hair}"/>`;
      case 'wild': return `<path d="M30 60 Q24 30 50 26 Q56 8 80 16 Q104 8 110 26 Q136 30 130 60 Q122 40 80 40 Q38 40 30 60Z" fill="${hair}"/>`;
      case 'short': return `<path d="M42 58 Q40 22 80 20 Q120 22 118 58 Q114 40 100 36 Q80 44 60 36 Q46 40 42 58Z" fill="${hair}"/>`;
      default: return `<path d="M40 62 Q38 22 80 20 Q122 22 120 62 Q116 38 80 36 Q44 38 40 62Z" fill="${hair}"/>`;
    }
  }

  function accent(a, skin, colors) {
    switch (a) {
      case 'goggles': return `<rect x="50" y="38" width="60" height="12" rx="6" fill="#3a2a1a"/><circle cx="66" cy="44" r="8" fill="#9ad" stroke="#5a4a2a" stroke-width="3"/><circle cx="94" cy="44" r="8" fill="#9ad" stroke="#5a4a2a" stroke-width="3"/>`;
      case 'scar': return `<path d="M92 50 L100 74" stroke="#a04a4a" stroke-width="3" stroke-linecap="round"/>`;
      case 'tattoo': return `<text x="94" y="80" font-size="9" font-family="serif" font-weight="700" fill="#2a3a8a">VI</text>`;
      case 'freckles': return `<g fill="${shade(skin, -50)}"><circle cx="62" cy="72" r="1.4"/><circle cx="67" cy="75" r="1.4"/><circle cx="93" cy="72" r="1.4"/><circle cx="98" cy="75" r="1.4"/></g>`;
      case 'paint': return `<path d="M58 66 L70 70 M90 70 L102 66" stroke="#4fffc8" stroke-width="3" stroke-linecap="round"/>`;
      case 'hat': return `<ellipse cx="80" cy="26" rx="46" ry="8" fill="#2a2a4a"/><rect x="56" y="2" width="48" height="24" rx="4" fill="#2a2a4a"/><rect x="56" y="18" width="48" height="5" fill="${colors[0]}"/>`;
      case 'glasses': return `<g fill="none" stroke="#222" stroke-width="2.5"><circle cx="67" cy="60" r="8"/><circle cx="93" cy="60" r="8"/><path d="M75 60 L85 60"/></g>`;
      case 'mask': return `<path d="M58 76 Q80 98 102 76 L98 70 Q80 78 62 70Z" fill="#4a5a3a"/><circle cx="80" cy="86" r="5" fill="#8fbf3a"/>`;
      case 'gold': return `<circle cx="47" cy="72" r="3" fill="#e3c45a"/><circle cx="113" cy="72" r="3" fill="#e3c45a"/><path d="M60 110 Q80 122 100 110" stroke="#e3c45a" stroke-width="3" fill="none"/>`;
      case 'beard': return `<path d="M52 72 Q56 104 80 106 Q104 104 108 72 Q100 92 80 92 Q60 92 52 72Z" fill="#cfcfcf" opacity=".9"/>`;
      case 'mustache': return `<path d="M68 80 Q80 74 92 80 Q80 84 68 80Z" fill="#2a2a2a"/>`;
      case 'arm': return `<rect x="118" y="120" width="26" height="40" rx="6" fill="#7a8a9a"/><circle cx="131" cy="132" r="5" fill="#bf3abf"/>`;
      case 'collar': return `<path d="M50 124 L80 140 L110 124 L104 160 L56 160Z" fill="${shade(colors[0], -20)}"/>`;
      case 'yordle': return `<path d="M36 50 L14 30 L40 46Z M124 50 L146 30 L120 46Z" fill="${skin}" stroke="${shade(skin, -40)}"/>`;
      default: return '';
    }
  }

  // look: { skin, hair, style, accent }  colors: [principal, fondo]
  function svg(look = {}, colors = ['#7a5abf', '#140f24'], opts = {}) {
    const skin = look.skin || '#e8b89a';
    const hair = look.hair || '#2a2a2a';
    const style = look.style || 'short';
    const acc = look.accent || 'none';
    const id = `g${Math.random().toString(36).slice(2, 8)}`;
    const eye = opts.eye || (style === 'braids' ? '#e0457b' : '#2a2a3a');
    return `<svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg" class="portrait-svg" role="img" aria-label="${U.esc(opts.label || 'Retrato')}">
      <defs>
        <radialGradient id="${id}" cx="50%" cy="35%" r="75%">
          <stop offset="0%" stop-color="${colors[0]}" stop-opacity=".85"/>
          <stop offset="100%" stop-color="${colors[1]}"/>
        </radialGradient>
      </defs>
      <rect width="160" height="160" fill="url(#${id})"/>
      <g opacity=".18" stroke="#fff" fill="none"><circle cx="80" cy="80" r="70"/><path d="M10 140 L150 20"/></g>
      ${hairBack(style, hair)}
      <path d="M30 160 Q34 118 80 114 Q126 118 130 160Z" fill="${shade(colors[0], -40)}"/>
      <rect x="70" y="96" width="20" height="22" fill="${shade(skin, -18)}"/>
      <ellipse cx="80" cy="64" rx="36" ry="42" fill="${skin}"/>
      <ellipse cx="66" cy="62" rx="4.5" ry="5.5" fill="${eye}"/>
      <ellipse cx="94" cy="62" rx="4.5" ry="5.5" fill="${eye}"/>
      <circle cx="67.5" cy="60.5" r="1.4" fill="#fff"/><circle cx="95.5" cy="60.5" r="1.4" fill="#fff"/>
      <path d="M60 52 Q66 49 72 52 M88 52 Q94 49 100 52" stroke="${shade(hair, -20)}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <path d="M80 64 Q78 74 82 76" stroke="${shade(skin, -45)}" stroke-width="2" fill="none"/>
      <path d="M70 86 Q80 92 90 86" stroke="${shade(skin, -70)}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      ${hairFront(style, hair)}
      ${accent(acc, skin, colors)}
    </svg>`;
  }

  // Devuelve el HTML del retrato de un personaje de la wiki por id.
  function forCharacter(id) {
    const c = window.WIKI.personajes.find((p) => p.id === id);
    if (!c) return svg({}, ['#555', '#111'], { label: id });
    return svg(c.look, c.colors, { label: c.name });
  }

  // Retrato del jugador: foto subida o avatar generado.
  function forPlayer(player) {
    if (player?.photo) return `<img class="portrait-img" src="${player.photo}" alt="${U.esc(player.name || 'Tu personaje')}">`;
    const colors = player?.origin === 'piltover' ? ['#d4a73f', '#2a2010'] : ['#3fbf9f', '#0f1e1a'];
    return svg(player?.look || {}, colors, { label: player?.name || 'Tu personaje' });
  }

  // Ilustración para entradas de la wiki que no son personas.
  function emblem(entry, icon) {
    const [a, b] = entry.colors || ['#7a5abf', '#140f24'];
    const id = `e${Math.random().toString(36).slice(2, 8)}`;
    return `<svg viewBox="0 0 160 160" class="portrait-svg" role="img" aria-label="${U.esc(entry.name)}">
      <defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>
      <rect width="160" height="160" fill="url(#${id})"/>
      <g fill="none" stroke="#fff" opacity=".22"><path d="M0 120 L40 90 L60 100 L90 60 L120 80 L160 40"/><circle cx="80" cy="80" r="56"/><circle cx="80" cy="80" r="36"/></g>
      <text x="80" y="98" text-anchor="middle" font-size="54">${icon}</text>
    </svg>`;
  }

  window.Portrait = { svg, forCharacter, forPlayer, emblem };
})();
