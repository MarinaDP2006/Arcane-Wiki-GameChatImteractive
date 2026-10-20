// Atlas interactivo de Piltover y Zaun para el Códice: mapa ilustrado con zoom y
// desplazamiento, marcadores de cada lugar y ficha con imagen, descripción,
// personajes que se encuentran allí y actividad o minijuego disponible.
(function () {
  const { el, esc } = U;
  const SNAP_W = 1500;
  const GAP = 260; // separación entre la superficie (Piltover) y el subsuelo (Zaun)

  function mount(root, opts = {}) {
    const W = window.WORLD;
    const maps = W.maps;
    const st = { level: 'ambas', scale: 1, ox: 0, oy: 0, sel: null, hover: null, drag: null };

    root.innerHTML = '';
    const canvas = el('canvas', { class: 'atlas-canvas' });
    const info = el('aside', { class: 'atlas-info' });
    const levelBtn = (id, label) => el('button', { class: st.level === id ? 'active' : '', 'data-l': id, onclick: () => setLevel(id) }, label);
    const bar = el('div', { class: 'atlas-bar' },
      el('div', { class: 'seg' }, levelBtn('piltover', '☀ Piltover · superficie'), levelBtn('zaun', '🌫 Zaun · subsuelo'), levelBtn('ambas', '⇅ Las dos ciudades')),
      el('div', { class: 'row gap' },
        el('button', { class: 'btn small', title: 'Acercar', onclick: () => zoom(1.25) }, '＋'),
        el('button', { class: 'btn small', title: 'Alejar', onclick: () => zoom(0.8) }, '－'),
        el('button', { class: 'btn small', title: 'Encuadrar', onclick: fit }, '⤢')),
      el('small', { class: 'muted', id: 'atlas-count' }));
    root.append(el('div', { class: 'atlas' }, el('div', { class: 'atlas-main' }, bar, el('div', { class: 'atlas-view' }, canvas)), info));
    const ctx = canvas.getContext('2d');

    // Disposición de los mapas en coordenadas del atlas.
    function layout() {
      const p = maps.piltover.size;
      const z = maps.zaun.size;
      if (st.level === 'piltover') return [{ id: 'piltover', x: 0, y: 0 }];
      if (st.level === 'zaun') return [{ id: 'zaun', x: 0, y: 0 }];
      return [{ id: 'piltover', x: 0, y: 0 }, { id: 'zaun', x: (p[0] - z[0]) / 2, y: p[1] + GAP }];
    }
    function bounds() {
      const L = layout();
      const last = L[L.length - 1];
      return { w: Math.max(...L.map((m) => maps[m.id].size[0] + m.x)), h: last.y + maps[last.id].size[1] };
    }

    function pins() {
      const out = [];
      for (const m of layout()) {
        for (const l of maps[m.id].locations) out.push({ ...l, map: m.id, ax: l.x + m.x, ay: l.y + m.y });
      }
      return out;
    }

    const toScreen = (x, y) => [x * st.scale + st.ox, y * st.scale + st.oy];
    const toWorld = (x, y) => [(x - st.ox) / st.scale, (y - st.oy) / st.scale];

    function size() {
      const r = canvas.parentElement.getBoundingClientRect();
      const dpr = Math.min(1.5, window.devicePixelRatio || 1);
      canvas.width = Math.max(200, Math.floor(r.width * dpr));
      canvas.height = Math.max(200, Math.floor(r.height * dpr));
      canvas.style.width = `${r.width}px`;
      canvas.style.height = `${r.height}px`;
    }

    function fit() {
      size();
      const b = bounds();
      st.scale = Math.min(canvas.width / b.w, canvas.height / b.h) * 0.95;
      st.ox = (canvas.width - b.w * st.scale) / 2;
      st.oy = (canvas.height - b.h * st.scale) / 2;
      draw();
    }

    function zoom(f, cx = canvas.width / 2, cy = canvas.height / 2) {
      const [wx, wy] = toWorld(cx, cy);
      st.scale = Math.max(0.08, Math.min(2.5, st.scale * f));
      st.ox = cx - wx * st.scale;
      st.oy = cy - wy * st.scale;
      draw();
    }

    function setLevel(l) {
      st.level = l;
      bar.querySelectorAll('[data-l]').forEach((b) => b.classList.toggle('active', b.dataset.l === l));
      fit();
    }

    function draw() {
      const t = performance.now() / 1000;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillStyle = '#05040a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const L = layout();
      for (const m of L) {
        const img = World.snapshot(m.id, SNAP_W);
        const [x, y] = toScreen(m.x, m.y);
        const s = maps[m.id].size;
        ctx.drawImage(img, x, y, s[0] * st.scale, s[1] * st.scale);
        ctx.strokeStyle = m.id === 'zaun' ? 'rgba(63,191,159,0.6)' : 'rgba(227,196,90,0.6)';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, s[0] * st.scale, s[1] * st.scale);
        ctx.font = `bold ${Math.max(14, 90 * st.scale)}px Georgia, serif`;
        ctx.fillStyle = m.id === 'zaun' ? '#9fffe0' : '#ffe9b0';
        ctx.textAlign = 'left';
        ctx.fillText(m.id === 'zaun' ? 'ZAUN · SUBSUELO' : 'PILTOVER · SUPERFICIE', x + 12, y + Math.max(20, 100 * st.scale));
      }
      // Unión del Puente del Progreso entre las dos ciudades
      if (L.length === 2) {
        const a = pins().find((p) => p.id === 'puente');
        const b = pins().find((p) => p.id === 'puente-zaun');
        if (a && b) {
          const [x1, y1] = toScreen(a.ax, a.ay);
          const [x2, y2] = toScreen(b.ax, b.ay);
          ctx.strokeStyle = 'rgba(227,196,90,0.9)';
          ctx.lineWidth = Math.max(3, 30 * st.scale);
          ctx.setLineDash([12, 8]);
          ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
          ctx.setLineDash([]);
          ctx.fillStyle = '#ffe08a';
          ctx.font = `bold ${Math.max(12, 40 * st.scale)}px system-ui`;
          ctx.textAlign = 'center';
          ctx.fillText('🌉 Puente del Progreso', (x1 + x2) / 2, (y1 + y2) / 2);
        }
      }
      const obj = opts.objective?.();
      for (const p of pins()) {
        const [x, y] = toScreen(p.ax, p.ay);
        const known = opts.visited ? opts.visited(p.id) : true;
        const r = Math.max(14, 60 * st.scale);
        const isSel = st.sel?.id === p.id;
        const isObj = obj === p.id;
        if (isObj) {
          ctx.strokeStyle = `rgba(255,224,138,${0.5 + Math.sin(t * 4) * 0.4})`;
          ctx.lineWidth = 4;
          ctx.beginPath(); ctx.arc(x, y, r * 1.5, 0, 7); ctx.stroke();
        }
        ctx.fillStyle = known ? (p.map === 'zaun' ? 'rgba(10,40,34,0.9)' : 'rgba(50,34,10,0.9)') : 'rgba(20,18,28,0.9)';
        ctx.strokeStyle = isSel ? '#ffffff' : known ? (p.map === 'zaun' ? '#3fbf9f' : '#e3c45a') : '#5a5470';
        ctx.lineWidth = isSel ? 4 : 2.5;
        ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); ctx.stroke();
        ctx.font = `${r * 1.1}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(known ? p.icon : '❔', x, y + 1);
        ctx.textBaseline = 'alphabetic';
        if (st.scale > 0.22 || isSel || st.hover?.id === p.id) {
          const name = known ? p.name : 'Lugar sin descubrir';
          ctx.font = `bold ${Math.max(12, 30 * st.scale)}px system-ui`;
          const w = ctx.measureText(name).width + 14;
          ctx.fillStyle = 'rgba(5,4,10,0.8)';
          ctx.fillRect(x - w / 2, y + r + 4, w, Math.max(18, 40 * st.scale));
          ctx.fillStyle = known ? '#fff' : '#a39cb3';
          ctx.fillText(name, x, y + r + Math.max(16, 32 * st.scale));
        }
      }
      const count = pins().filter((p) => (opts.visited ? opts.visited(p.id) : true)).length;
      const c = root.querySelector('#atlas-count');
      if (c) c.textContent = `Lugares descubiertos: ${count}/${pins().length} · arrastra para moverte, rueda para el zoom`;
    }

    function pinAt(sx, sy) {
      return pins().find((p) => {
        const [x, y] = toScreen(p.ax, p.ay);
        return Math.hypot(x - sx, y - sy) < Math.max(16, 62 * st.scale);
      });
    }

    function showInfo(p) {
      info.innerHTML = '';
      if (!p) {
        info.append(el('div', { class: 'wiki-empty' }, el('h2', {}, '🗺 Atlas'), el('p', {}, 'Pulsa un lugar del mapa para ver su ficha. Los lugares que aún no has visitado aparecen con ❔.')));
        return;
      }
      const known = opts.visited ? opts.visited(p.id) : true;
      const entry = window.WIKI.lugares.find((l) => l.id === p.codex) || null;
      const img = window.CustomArt?.image('lugares', p.id) || window.CustomArt?.image('lugares', p.codex) || (window.Scenes?.has(p.id) ? Scenes.thumb(p.id) : p.codex && Scenes.has(p.codex) ? Scenes.thumb(p.codex) : null);
      const district = maps[p.map].districts.find(({ rect: [x, y, w, h] }) => p.x >= x && p.x < x + w && p.y >= y && p.y < y + h);
      const people = (opts.present?.(p.id) || []);
      info.append(...[
        img && known ? el('img', { class: 'atlas-img', src: img, alt: p.name }) : el('div', { class: 'atlas-img locked' }, '❔'),
        el('h2', {}, known ? `${p.icon} ${p.name}` : 'Lugar sin descubrir'),
        el('div', { class: 'chips' },
          el('span', { class: `tag origin-${p.map}` }, p.map === 'zaun' ? 'Zaun · subsuelo' : 'Piltover · superficie'),
          district ? el('span', { class: 'tag' }, district.name) : null),
        known
          ? el('p', {}, entry?.summary || 'Un rincón de la ciudad con su propia historia.')
          : el('p', { class: 'muted' }, 'Ve hasta aquí en el mapa del juego para descubrir este lugar y añadirlo al Códice.'),
        known && p.activity ? el('p', {}, `${p.activity.game ? '🎮' : '⭐'} ${p.activity.label} · +1 ${window.STORY.stats[p.activity.stat].label}`) : null,
        known && p.travel ? el('p', {}, `🌉 ${p.travel.label}`) : null,
        opts.objective?.() === p.id ? el('p', { class: 'gold' }, '★ Objetivo actual de la historia') : null,
        people.length ? el('div', {}, el('h3', {}, 'Aquí puedes encontrar a'),
          el('div', { class: 'relations' }, people.map((id) => el('button', { class: 'rel', onclick: () => opts.onCharacter?.(id) },
            el('span', { class: 'rel-art', html: Portrait.forCharacter(id) }), window.WIKI.personajes.find((c) => c.id === id)?.name || id)))) : null,
        known && entry ? el('button', { class: 'btn small', onclick: () => opts.onEntry?.(entry.id) }, '📖 Abrir en el Códice') : null,
      ].filter(Boolean));
    }

    canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const r = canvas.getBoundingClientRect();
      const k = canvas.width / r.width;
      zoom(e.deltaY < 0 ? 1.15 : 0.87, (e.clientX - r.left) * k, (e.clientY - r.top) * k);
    }, { passive: false });
    canvas.addEventListener('pointerdown', (e) => {
      st.drag = { x: e.clientX, y: e.clientY, ox: st.ox, oy: st.oy, moved: false };
      canvas.setPointerCapture(e.pointerId);
    });
    canvas.addEventListener('pointermove', (e) => {
      const r = canvas.getBoundingClientRect();
      const k = canvas.width / r.width;
      if (st.drag) {
        const dx = (e.clientX - st.drag.x) * k;
        const dy = (e.clientY - st.drag.y) * k;
        if (Math.abs(dx) + Math.abs(dy) > 4) st.drag.moved = true;
        st.ox = st.drag.ox + dx;
        st.oy = st.drag.oy + dy;
        draw();
        return;
      }
      const h = pinAt((e.clientX - r.left) * k, (e.clientY - r.top) * k);
      canvas.style.cursor = h ? 'pointer' : 'grab';
      if (h?.id !== st.hover?.id) { st.hover = h; draw(); }
    });
    canvas.addEventListener('pointerup', (e) => {
      const r = canvas.getBoundingClientRect();
      const k = canvas.width / r.width;
      if (st.drag && !st.drag.moved) {
        const p = pinAt((e.clientX - r.left) * k, (e.clientY - r.top) * k);
        if (p) {
          st.sel = p;
          Audio2.sfx.click();
          showInfo(p);
          draw();
        }
      }
      st.drag = null;
    });

    // Animación suave del objetivo
    let alive = true;
    (function loop() {
      if (!alive || !canvas.isConnected) return;
      if (opts.objective?.()) draw();
      setTimeout(() => requestAnimationFrame(loop), 120);
    })();

    requestAnimationFrame(() => { fit(); showInfo(null); });
    window.addEventListener('resize', fit);
    return { stop() { alive = false; window.removeEventListener('resize', fit); }, focus(id) { const p = pins().find((x) => x.id === id); if (p) { st.sel = p; showInfo(p); draw(); } } };
  }

  window.Atlas = { mount };
})();
