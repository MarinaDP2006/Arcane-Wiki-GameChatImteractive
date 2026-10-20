// Creador de personaje: vista previa pintada y animada en tiempo real,
// personalización completa del rostro, pelo y ropa, foto estilizada y ficha.
(function () {
  const { $, el, tpl, pick } = U;
  const C = () => window.CREATION;

  let draft;
  let step;
  let onDone;
  let preview = null; // controlador del retrato animado
  let bgScene = null; // escena animada de fondo
  let lookTab = 'rostro';

  function fresh() {
    return {
      origin: null, name: '', gender: 'mujer', age: 20, district: '', job: '', family: 'ninguna',
      hobbies: [], bio: '', photo: null,
      look: { ...Painter.DEFAULTS, skin: '#e8b394', hair: '#2a1e18', style: 'long', eyeColor: '#5a7a9a', outfit: 'chaqueta', outfitColor: '#4a3a5a', accents: [] },
    };
  }

  // Estadísticas: 1 de base + profesión + familia + aficiones.
  function computeStats(d) {
    const s = { ingenio: 1, carisma: 1, valor: 1, sigilo: 1 };
    const add = (obj) => obj && Object.entries(obj).forEach(([k, v]) => { s[k] += v; });
    const o = C().origins[d.origin];
    if (o) {
      add(o.jobs.find((j) => j.id === d.job)?.stats);
      add(o.families.find((f) => f.id === d.family)?.stats);
    }
    d.hobbies.forEach((h) => add(C().hobbies.find((x) => x.id === h)?.stats));
    return s;
  }

  function buildPlayer(d) {
    const o = C().origins[d.origin];
    const job = o.jobs.find((j) => j.id === d.job) || o.jobs[0];
    const fam = o.families.find((f) => f.id === d.family) || o.families[0];
    const hobbies = d.hobbies.map((h) => C().hobbies.find((x) => x.id === h));
    return {
      name: d.name.trim(), gender: d.gender, age: Number(d.age) || 20, origin: d.origin,
      district: d.district, job: job.id, jobLabel: job.label,
      family: fam.id, familyLabel: fam.label, familyName: fam.name || '', familyAff: fam.aff || {},
      hobbies: d.hobbies, hobbyLabels: hobbies.map((h) => h.label),
      bio: d.bio.trim(), photo: d.photo, look: { ...d.look },
    };
  }

  const STEPS = ['Origen', 'Identidad', 'Aspecto', 'Familia y aficiones', 'Ficha final'];

  function header() {
    return el('ol', { class: 'steps' }, STEPS.map((s, i) =>
      el('li', { class: i === step ? 'active' : i < step ? 'done' : '', onclick: () => { if (i < step) go(i); } }, el('span', {}, i + 1), s)));
  }

  function canNext() {
    if (step === 0) return Boolean(draft.origin);
    if (step === 1) return Boolean(draft.name.trim());
    if (step === 3) return draft.hobbies.length > 0;
    return true;
  }

  function nav(nextLabel = 'Siguiente →') {
    const n = el('div', { class: 'creator-nav' },
      el('button', { class: 'btn ghost', onclick: () => (step === 0 ? cancel() : go(step - 1)) }, step === 0 ? 'Cancelar' : '← Atrás'),
      el('button', { class: 'btn primary hex-btn', disabled: !canNext(), onclick: () => (step === STEPS.length - 1 ? finish() : go(step + 1)) }, nextLabel));
    return n;
  }

  function cancel() {
    stopAnim();
    window.App.go('game');
  }

  function stopAnim() {
    preview?.stop();
    bgScene?.stop();
    preview = null;
    bgScene = null;
  }

  function lookOpts() {
    return Portrait.playerOpts({ origin: draft.origin || 'zaun' });
  }

  function statBars(stats) {
    return el('div', { class: 'stat-bars' }, Object.entries(window.STORY.stats).map(([k, meta]) =>
      el('div', { class: 'stat' },
        el('span', {}, `${meta.icon} ${meta.label}`),
        el('div', { class: 'bar' }, el('i', { style: `width:${Math.min(100, stats[k] * 20)}%` })),
        el('b', {}, stats[k]))));
  }

  function field(label, input, hint) {
    return el('label', { class: 'field' }, el('span', {}, label), input, hint ? el('small', { class: 'muted' }, hint) : null);
  }

  function bonusText(stats = {}) {
    return Object.entries(stats).map(([k, v]) => `+${v} ${window.STORY.stats[k].label}`).join(', ') || 'sin bonificación';
  }

  // ---------- Estructura ----------
  function layout() {
    const root = $('#view-creator');
    stopAnim();
    root.innerHTML = '';
    const bg = el('canvas', { class: 'creator-bg' });
    const stage = el('canvas', { class: 'creator-portrait', width: 560, height: 560 });
    const side = el('div', { class: 'creator-stage' },
      el('div', { class: 'portrait-frame' }, stage, draft.photo ? el('img', { class: 'portrait-photo', src: draft.photo, alt: 'Tu foto' }) : null),
      el('div', { class: 'stage-info' },
        el('strong', { id: 'stage-name' }, draft.name || 'Sin nombre'),
        draft.origin ? el('span', { class: `tag origin-${draft.origin}` }, C().origins[draft.origin].label) : null),
      el('div', { class: 'row gap center' },
        el('button', { class: 'btn small', onclick: randomize }, '🎲 Aleatorio'),
        el('button', { class: 'btn small', onclick: sayHello }, '🗣 Probar voz')),
      el('div', { id: 'stage-stats' }, statBars(computeStats(draft))));
    const body = el('div', { class: 'creator-body panel' });
    root.append(bg, el('div', { class: 'creator' }, header(), el('div', { class: 'creator-grid' }, body, side)));
    bgScene = Scenes.mount(bg, draft.origin === 'piltover' ? 'piltover' : draft.origin === 'zaun' ? 'callejones' : 'puente');
    preview = Painter.animate(stage, draft.look, lookOpts());
    return body;
  }

  function rerender() {
    const body = layout();
    [stepOrigin, stepIdentity, stepLook, stepFamily, stepSummary][step](body);
    body.classList.add('enter');
  }

  function refreshPreview() {
    preview?.setLook({ ...draft.look }, lookOpts());
    const st = $('#stage-stats');
    if (st) { st.innerHTML = ''; st.append(statBars(computeStats(draft))); }
  }

  function go(n) {
    step = n;
    Audio2.sfx.click();
    rerender();
  }

  function sayHello() {
    const line = draft.origin === 'piltover'
      ? `Soy ${draft.name || 'alguien'}, de Piltover. El progreso no espera a nadie.`
      : `Soy ${draft.name || 'alguien'}, de Zaun. Aquí abajo nos salvamos solos.`;
    preview?.talk(true);
    Audio2.speak(line, { pitch: draft.gender === 'hombre' ? 0.85 : draft.gender === 'mujer' ? 1.15 : 1, rate: 1.02, gender: draft.gender === 'hombre' ? 'm' : 'f' })
      .then(() => preview?.talk(false));
  }

  function randomize() {
    const L = C().look;
    draft.photo = null;
    draft.look = {
      skin: pick(L.skins), face: pick(L.faces).id, eyes: pick(L.eyes).id, eyeColor: pick(L.eyeColors), brows: pick(L.brows).id,
      nose: pick(L.noses).id, lips: pick(L.lips).id, lipColor: pick(L.lipColors), hair: pick(L.hairs), style: pick(L.styles).id,
      outfit: pick(L.outfits).id, outfitColor: pick(L.outfitColors), makeup: pick(L.makeup).id,
      accents: L.accents.filter(() => Math.random() < 0.15).map((a) => a.id).slice(0, 3),
    };
    Audio2.sfx.choice();
    if (step === 2) rerender(); else refreshPreview();
  }

  // ----- Paso 1: Origen -----
  function stepOrigin(body) {
    body.append(el('h2', {}, '¿De qué lado del puente vienes?'),
      el('p', { class: 'muted' }, 'Tu origen decide tu ruta, los personajes que conoces primero y cómo te miran los demás.'));
    const grid = el('div', { class: 'origin-grid' });
    for (const [id, o] of Object.entries(C().origins)) {
      const cv = el('canvas', { class: 'origin-scene' });
      const card = el('button', {
        class: `origin-card origin-${id}${draft.origin === id ? ' active' : ''}`,
        onclick: () => {
          if (draft.origin !== id) {
            draft.origin = id; draft.district = o.districts[0]; draft.job = o.jobs[0].id; draft.family = 'ninguna';
            draft.look.outfit = id === 'piltover' ? 'abrigo' : 'chaqueta';
            draft.look.outfitColor = id === 'piltover' ? '#c4c0b8' : '#4a3a5a';
          }
          Audio2.playMusic(id);
          rerender();
        },
      }, cv, el('div', { class: 'origin-info' }, el('h3', {}, o.label), el('p', {}, o.tagline),
        el('small', {}, id === 'zaun' ? 'Empiezas con: Vander, Vi, Powder, Mylo, Claggor' : 'Empiezas con: Jayce, Viktor, Heimerdinger')));
      grid.append(card);
      requestAnimationFrame(() => Scenes.mount(cv, id === 'zaun' ? 'zaun' : 'piltover'));
    }
    body.append(grid, nav());
  }

  // ----- Paso 2: Identidad -----
  function stepIdentity(body) {
    const o = C().origins[draft.origin];
    const name = el('input', {
      class: 'input', maxlength: 28, value: draft.name, placeholder: 'Escribe tu nombre',
      oninput: (e) => { draft.name = e.target.value; body.querySelector('.creator-nav .primary').disabled = !canNext(); $('#stage-name').textContent = draft.name || 'Sin nombre'; },
    });
    const gender = el('div', { class: 'seg' }, C().genders.map((g) =>
      el('button', { class: draft.gender === g.id ? 'active' : '', onclick: () => { draft.gender = g.id; rerender(); } }, g.label)));
    const age = el('input', { class: 'input', type: 'number', min: 14, max: 99, value: draft.age, oninput: (e) => { draft.age = e.target.value; } });
    const district = el('select', { class: 'input', onchange: (e) => { draft.district = e.target.value; } },
      o.districts.map((d) => el('option', { value: d, selected: d === draft.district }, d)));
    const job = el('div', { class: 'option-grid' }, o.jobs.map((j) =>
      el('button', { class: `option${draft.job === j.id ? ' active' : ''}`, onclick: () => { draft.job = j.id; rerender(); } },
        el('strong', {}, tpl(j.label, draft)), el('small', {}, bonusText(j.stats)))));
    body.append(el('h2', {}, 'Quién eres'),
      el('div', { class: 'form-grid' },
        field('Nombre', name), field('Género', gender, 'Los diálogos se adaptan a tu género.'),
        field('Edad', age), field(`Barrio de ${o.label}`, district, 'Es donde empiezas en el mapa.')),
      el('h3', {}, 'A qué te dedicas'), job, nav());
    setTimeout(() => name.focus(), 0);
  }

  // ----- Paso 3: Aspecto -----
  const TABS = [['rostro', '🙂 Rostro'], ['ojos', '👁 Ojos'], ['boca', '👄 Nariz y boca'], ['pelo', '💇 Pelo'], ['ropa', '🧥 Ropa'], ['detalles', '✨ Detalles'], ['foto', '📷 Foto']];

  function stepLook(body) {
    const L = C().look;
    const set = (k, v) => { draft.look[k] = v; draft.photo = null; refreshPreview(); markActive(); };
    const swatches = (list, key) => el('div', { class: 'swatches' }, list.map((c) =>
      el('button', { class: `swatch${draft.look[key] === c ? ' active' : ''}`, 'data-k': key, 'data-v': c, style: `background:${c}`, 'aria-label': c, onclick: () => set(key, c) })));
    const chips = (list, key) => el('div', { class: 'chips wrap' }, list.map((x) =>
      el('button', { class: `chip${draft.look[key] === x.id ? ' active' : ''}`, 'data-k': key, 'data-v': x.id, onclick: () => set(key, x.id) }, x.label)));
    const markActive = () => body.querySelectorAll('[data-k]').forEach((b) => {
      const k = b.dataset.k;
      const on = k === 'accents' ? draft.look.accents.includes(b.dataset.v) : draft.look[k] === b.dataset.v;
      b.classList.toggle('active', on);
    });

    const tabBar = el('div', { class: 'look-tabs' }, TABS.map(([id, label]) =>
      el('button', { class: `tab${lookTab === id ? ' active' : ''}`, onclick: () => { lookTab = id; rerender(); } }, label)));
    const panel = el('div', { class: 'look-panel' });
    switch (lookTab) {
      case 'rostro': panel.append(field('Tono de piel', swatches(L.skins, 'skin')), field('Forma de la cara', chips(L.faces, 'face'))); break;
      case 'ojos': panel.append(field('Forma de los ojos', chips(L.eyes, 'eyes')), field('Color de ojos', swatches(L.eyeColors, 'eyeColor')), field('Cejas', chips(L.brows, 'brows')), field('Maquillaje', chips(L.makeup, 'makeup'))); break;
      case 'boca': panel.append(field('Nariz', chips(L.noses, 'nose')), field('Labios', chips(L.lips, 'lips')), field('Color de labios', swatches(L.lipColors, 'lipColor'))); break;
      case 'pelo': panel.append(field('Peinado', chips(L.styles, 'style')), field('Color de pelo', swatches(L.hairs, 'hair'))); break;
      case 'ropa': panel.append(field('Ropa', chips(L.outfits, 'outfit')), field('Color de la ropa', swatches(L.outfitColors, 'outfitColor'))); break;
      case 'detalles':
        panel.append(field('Detalles (puedes elegir varios)', el('div', { class: 'chips wrap' }, L.accents.map((a) =>
          el('button', {
            class: `chip${draft.look.accents.includes(a.id) ? ' active' : ''}`, 'data-k': 'accents', 'data-v': a.id,
            onclick: () => {
              const list = draft.look.accents;
              draft.look.accents = list.includes(a.id) ? list.filter((x) => x !== a.id) : [...list, a.id];
              draft.photo = null;
              refreshPreview();
              markActive();
            },
          }, a.label)))));
        break;
      case 'foto': {
        const file = el('input', { type: 'file', accept: 'image/*', class: 'hidden', onchange: (e) => loadPhoto(e.target.files[0]) });
        panel.append(el('p', {}, 'Sube una foto tuya y el juego la convertirá en un retrato con aspecto pintado, con la luz de tu ciudad.'),
          el('div', { class: 'row gap' },
            el('button', { class: 'btn primary', onclick: () => file.click() }, '📷 Elegir foto'),
            draft.photo ? el('button', { class: 'btn ghost', onclick: () => { draft.photo = null; rerender(); } }, 'Volver al retrato pintado') : null, file),
          draft.photo ? el('img', { class: 'photo-result', src: draft.photo, alt: 'Foto estilizada' }) : null);
        break;
      }
      default: break;
    }
    body.append(el('h2', {}, 'Tu aspecto'), el('p', { class: 'muted' }, 'Todo se ve al instante en tu retrato. Pulsa 🎲 para inspirarte.'), tabBar, panel, nav());
  }

  function loadPhoto(f) {
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        draft.photo = Painter.stylizePhoto(img, 320, lookOpts().rim);
        Audio2.sfx.unlock();
        rerender();
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(f);
  }

  // ----- Paso 4: Familia y aficiones -----
  function stepFamily(body) {
    const o = C().origins[draft.origin];
    body.append(el('h2', {}, 'Familia y aficiones'),
      el('p', { class: 'muted' }, 'La familia es opcional. Si perteneces a una familia conocida, algunos personajes te tratarán distinto.'));
    body.append(el('div', { class: 'option-grid' }, o.families.map((f) =>
      el('button', { class: `option${draft.family === f.id ? ' active' : ''}`, onclick: () => { draft.family = f.id; rerender(); } },
        el('strong', {}, tpl(f.label, draft)), el('small', {}, bonusText(f.stats))))));
    body.append(el('h3', {}, `Aficiones (elige hasta ${C().maxHobbies})`));
    body.append(el('div', { class: 'option-grid small' }, C().hobbies.map((h) => {
      const on = draft.hobbies.includes(h.id);
      return el('button', {
        class: `option${on ? ' active' : ''}`,
        onclick: () => {
          if (on) draft.hobbies = draft.hobbies.filter((x) => x !== h.id);
          else if (draft.hobbies.length < C().maxHobbies) draft.hobbies.push(h.id);
          else return U.toast(`Máximo ${C().maxHobbies} aficiones`, 'warn');
          rerender();
        },
      }, el('strong', {}, h.label), el('small', {}, bonusText(h.stats)));
    })));
    body.append(nav());
  }

  // ----- Paso 5: Resumen -----
  function stepSummary(body) {
    const p = buildPlayer(draft);
    body.append(el('h2', {}, 'Tu ficha'), sheetList(p));
    const bio = el('textarea', { class: 'input', rows: 4, maxlength: 600, placeholder: '¿Qué te trae a esta historia? (opcional)', oninput: (e) => { draft.bio = e.target.value; } }, draft.bio);
    body.append(field('Biografía', bio), nav('¡Comenzar la historia! ✦'));
  }

  function sheetList(p) {
    const rows = [
      ['Nombre', p.name], ['Género', C().genders.find((g) => g.id === p.gender)?.label], ['Edad', p.age],
      ['Ciudad', `${C().origins[p.origin].label} · ${p.district}`], ['Profesión', tpl(p.jobLabel, p)],
      ['Familia', tpl(p.familyLabel, p)], ['Aficiones', p.hobbyLabels.join(', ')],
    ];
    return el('dl', { class: 'sheet-list' }, rows.flatMap(([k, v]) => [el('dt', {}, k), el('dd', {}, String(v ?? ''))]));
  }

  function finish() {
    const player = buildPlayer(draft);
    stopAnim();
    Audio2.sfx.unlock();
    onDone(player, computeStats(draft));
  }

  function start(cb) {
    draft = fresh();
    step = 0;
    lookTab = 'rostro';
    onDone = cb;
    rerender();
  }

  window.Creator = { start, sheetList };
})();
