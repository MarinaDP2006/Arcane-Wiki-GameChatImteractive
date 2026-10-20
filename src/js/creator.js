// Asistente de creación de personaje en cinco pasos.
(function () {
  const { $, el, esc, tpl } = U;
  const C = () => window.CREATION;

  let draft;
  let step;
  let onDone;

  function fresh() {
    return {
      origin: null, name: '', gender: 'mujer', age: 20, district: '', job: '', family: 'ninguna',
      hobbies: [], bio: '', photo: null,
      look: { skin: C().look.skins[1], hair: C().look.hairs[0], style: 'short', accent: 'none' },
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
    const job = o.jobs.find((j) => j.id === d.job);
    const fam = o.families.find((f) => f.id === d.family);
    const hobbies = d.hobbies.map((h) => C().hobbies.find((x) => x.id === h));
    return {
      name: d.name.trim(), gender: d.gender, age: Number(d.age) || 20, origin: d.origin,
      district: d.district, job: d.job, jobLabel: job.label,
      family: d.family, familyLabel: fam.label, familyName: fam.name || '', familyAff: fam.aff || {},
      hobbies: d.hobbies, hobbyLabels: hobbies.map((h) => h.label),
      bio: d.bio.trim(), photo: d.photo, look: d.look,
    };
  }

  const STEPS = ['Origen', 'Identidad', 'Familia y aficiones', 'Aspecto', 'Ficha final'];

  function header() {
    return el('ol', { class: 'steps' }, STEPS.map((s, i) =>
      el('li', { class: i === step ? 'active' : i < step ? 'done' : '' }, el('span', {}, i + 1), s)));
  }

  function nav(canNext, nextLabel = 'Siguiente →') {
    return el('div', { class: 'creator-nav' },
      el('button', { class: 'btn ghost', onclick: () => (step === 0 ? window.App.go('game') : go(step - 1)) }, step === 0 ? 'Cancelar' : '← Atrás'),
      el('button', { class: 'btn primary', disabled: !canNext, onclick: () => (step === STEPS.length - 1 ? finish() : go(step + 1)) }, nextLabel));
  }

  function previewCard() {
    const p = draft.origin ? buildPlayerSafe() : null;
    return el('div', { class: 'creator-preview panel' },
      el('div', { class: 'preview-art', html: Portrait.forPlayer(p || { look: draft.look, photo: draft.photo }) }),
      el('strong', {}, draft.name || 'Sin nombre'),
      draft.origin ? el('span', { class: `tag origin-${draft.origin}` }, C().origins[draft.origin].label) : null,
      statBars(computeStats(draft)));
  }

  function buildPlayerSafe() {
    try { return buildPlayer({ ...draft, job: draft.job || C().origins[draft.origin].jobs[0].id }); } catch { return null; }
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

  function rerender() {
    const root = $('#view-creator');
    root.innerHTML = '';
    const body = el('div', { class: 'creator-body' });
    root.append(el('div', { class: 'creator' }, header(), el('div', { class: 'creator-grid' }, body, previewCard())));
    [stepOrigin, stepIdentity, stepFamily, stepLook, stepSummary][step](body);
  }

  function go(n) {
    step = n;
    Audio2.sfx.click();
    rerender();
  }

  // ----- Paso 1: Origen -----
  function stepOrigin(body) {
    body.append(el('h2', {}, '¿De qué lado del puente vienes?'),
      el('p', { class: 'muted' }, 'Tu origen decide tu ruta, los personajes que conoces primero y cómo te miran los demás.'));
    const grid = el('div', { class: 'origin-grid' });
    for (const [id, o] of Object.entries(C().origins)) {
      grid.append(el('button', {
        class: `origin-card origin-${id}${draft.origin === id ? ' active' : ''}`,
        onclick: () => {
          if (draft.origin !== id) { draft.origin = id; draft.district = o.districts[0]; draft.job = o.jobs[0].id; draft.family = 'ninguna'; }
          Audio2.playMusic(id);
          rerender();
        },
      }, el('h3', {}, o.label), el('p', {}, o.tagline),
        el('small', {}, id === 'zaun' ? 'Empiezas con: Vander, Vi, Powder, Mylo, Claggor' : 'Empiezas con: Jayce, Viktor, Heimerdinger')));
    }
    body.append(grid, nav(Boolean(draft.origin)));
  }

  // ----- Paso 2: Identidad -----
  function stepIdentity(body) {
    const o = C().origins[draft.origin];
    const name = el('input', { class: 'input', maxlength: 28, value: draft.name, placeholder: 'Escribe tu nombre', oninput: (e) => { draft.name = e.target.value; nextBtn.disabled = !draft.name.trim(); $('.creator-preview strong').textContent = draft.name || 'Sin nombre'; } });
    const gender = el('div', { class: 'seg' }, C().genders.map((g) =>
      el('button', { class: draft.gender === g.id ? 'active' : '', onclick: () => { draft.gender = g.id; rerender(); } }, g.label)));
    const age = el('input', { class: 'input', type: 'number', min: 14, max: 99, value: draft.age, oninput: (e) => { draft.age = e.target.value; } });
    const district = el('select', { class: 'input', onchange: (e) => { draft.district = e.target.value; } },
      o.districts.map((d) => el('option', { value: d, selected: d === draft.district }, d)));
    const job = el('select', { class: 'input', onchange: (e) => { draft.job = e.target.value; rerender(); } },
      o.jobs.map((j) => el('option', { value: j.id, selected: j.id === draft.job }, `${tpl(j.label, draft)} (${bonusText(j.stats)})`)));
    body.append(el('h2', {}, 'Quién eres'),
      el('div', { class: 'form-grid' },
        field('Nombre', name), field('Género', gender, 'Los diálogos se adaptan a tu género.'),
        field('Edad', age), field(`Barrio de ${o.label}`, district),
        field('A qué te dedicas', job, 'Tu profesión mejora tus estadísticas.')));
    const n = nav(Boolean(draft.name.trim()));
    const nextBtn = n.querySelector('.primary');
    body.append(n);
    setTimeout(() => name.focus(), 0);
  }

  function bonusText(stats = {}) {
    return Object.entries(stats).map(([k, v]) => `+${v} ${window.STORY.stats[k].label}`).join(', ') || 'sin bonificación';
  }

  // ----- Paso 3: Familia y aficiones -----
  function stepFamily(body) {
    const o = C().origins[draft.origin];
    body.append(el('h2', {}, 'Familia y aficiones'),
      el('p', { class: 'muted' }, 'La familia es opcional. Si perteneces a una familia conocida de Arcane, algunos personajes te tratarán distinto.'));
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
    body.append(nav(draft.hobbies.length > 0));
  }

  // ----- Paso 4: Aspecto -----
  function stepLook(body) {
    const L = C().look;
    body.append(el('h2', {}, 'Tu aspecto'),
      el('p', { class: 'muted' }, 'Sube una foto o crea un retrato ilustrado.'));
    const file = el('input', { type: 'file', accept: 'image/*', class: 'hidden', onchange: (e) => loadPhoto(e.target.files[0]) });
    body.append(el('div', { class: 'row gap' },
      el('button', { class: 'btn', onclick: () => file.click() }, '📷 Subir foto'),
      draft.photo ? el('button', { class: 'btn ghost', onclick: () => { draft.photo = null; rerender(); } }, 'Quitar foto') : null, file));

    const swatches = (list, key) => el('div', { class: 'swatches' }, list.map((c) =>
      el('button', { class: `swatch${draft.look[key] === c ? ' active' : ''}`, style: `background:${c}`, 'aria-label': c, onclick: () => { draft.look[key] = c; draft.photo = null; rerender(); } })));
    const chips = (list, key) => el('div', { class: 'chips wrap' }, list.map((x) =>
      el('button', { class: `chip${draft.look[key] === x.id ? ' active' : ''}`, onclick: () => { draft.look[key] = x.id; draft.photo = null; rerender(); } }, x.label)));

    body.append(field('Piel', swatches(L.skins, 'skin')), field('Color de pelo', swatches(L.hairs, 'hair')),
      field('Peinado', chips(L.styles, 'style')), field('Detalle', chips(L.accents, 'accent')), nav(true));
  }

  // La foto se reduce a 320 px para que la partida no pese demasiado.
  function loadPhoto(f) {
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const size = 320;
        const cv = document.createElement('canvas');
        cv.width = cv.height = size;
        const ctx = cv.getContext('2d');
        const s = Math.min(img.width, img.height);
        ctx.drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, size, size);
        draft.photo = cv.toDataURL('image/jpeg', 0.85);
        rerender();
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(f);
  }

  // ----- Paso 5: Resumen -----
  function stepSummary(body) {
    const p = buildPlayer(draft);
    body.append(el('h2', {}, 'Tu ficha'), sheetList(p));
    const bio = el('textarea', { class: 'input', rows: 4, maxlength: 600, placeholder: 'Escribe tu historia: ¿qué te trae a esta historia? (opcional)', oninput: (e) => { draft.bio = e.target.value; } }, draft.bio);
    body.append(field('Biografía', bio), nav(true, '¡Comenzar la historia! ✦'));
  }

  function sheetList(p) {
    const rows = [
      ['Nombre', p.name], ['Género', C().genders.find((g) => g.id === p.gender).label], ['Edad', p.age],
      ['Ciudad', `${C().origins[p.origin].label} · ${p.district}`], ['Profesión', tpl(p.jobLabel, p)],
      ['Familia', tpl(p.familyLabel, p)], ['Aficiones', p.hobbyLabels.join(', ')],
    ];
    return el('dl', { class: 'sheet-list' }, rows.flatMap(([k, v]) => [el('dt', {}, k), el('dd', {}, String(v))]));
  }

  function finish() {
    const player = buildPlayer(draft);
    Audio2.sfx.unlock();
    onDone(player, computeStats(draft));
  }

  function start(cb) {
    draft = fresh();
    step = 0;
    onDone = cb;
    rerender();
  }

  window.Creator = { start, sheetList };
})();
