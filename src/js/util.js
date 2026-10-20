// Utilidades compartidas: DOM, plantillas de texto y almacenamiento.
(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  function el(tag, attrs = {}, ...children) {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (v == null || v === false) continue;
      if (k === 'class') node.className = v;
      else if (k === 'html') node.innerHTML = v;
      else if (k.startsWith('on')) node.addEventListener(k.slice(2), v);
      else node.setAttribute(k, v === true ? '' : v);
    }
    for (const c of children.flat()) {
      if (c == null || c === false) continue;
      node.append(c instanceof Node ? c : document.createTextNode(String(c)));
    }
    return node;
  }

  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // Índice de género: 0 masculino, 1 femenino, 2 neutro.
  function genderIndex(player) {
    const g = window.CREATION.genders.find((x) => x.id === player?.gender);
    return g ? g.g : 2;
  }

  // Sustituye {name}, {job}, {district}, {family}, {hobby} y {g:a|b|c}.
  function genderize(text, gi) {
    return text.replace(/\{g:([^}]*)\}/g, (_, alts) => {
      const parts = alts.split('|');
      return parts[gi] ?? parts[parts.length - 1] ?? '';
    });
  }

  function tpl(text, player) {
    if (!text) return '';
    const gi = genderIndex(player);
    const out = genderize(text, gi);
    if (!player) return out;
    const vars = {
      name: player.name || 'forastero',
      job: player.jobLabel ? genderize(player.jobLabel, gi) : '',
      district: player.district || '',
      family: player.familyName || '',
      hobby: (player.hobbyLabels || [])[0] || '',
    };
    return out.replace(/\{(name|job|district|family|hobby)\}/g, (_, k) => vars[k]);
  }

  // Almacenamiento: usa el proceso principal en escritorio y localStorage en navegador.
  const LS = {
    get(k, d) {
      try {
        const v = localStorage.getItem(k);
        return v == null ? d : JSON.parse(v);
      } catch {
        return d;
      }
    },
    set(k, v) {
      try {
        localStorage.setItem(k, JSON.stringify(v));
      } catch {
        /* sin almacenamiento disponible */
      }
    },
    del(k) {
      try {
        localStorage.removeItem(k);
      } catch {
        /* nada */
      }
    },
  };

  const desktop = window.arcane?.isDesktop;
  const store = {
    async listSlots() {
      if (desktop) return window.arcane.saves.list();
      return ['1', '2', '3'].map((slot) => {
        const d = LS.get(`arcane-slot-${slot}`, null);
        return { slot, empty: !d, name: d?.player?.name, origin: d?.player?.origin, chapter: d?.progress?.chapterTitle, savedAt: d?.savedAt };
      });
    },
    async load(slot) {
      return desktop ? window.arcane.saves.load(slot) : LS.get(`arcane-slot-${slot}`, null);
    },
    async save(slot, data) {
      if (desktop) return window.arcane.saves.write(slot, data);
      LS.set(`arcane-slot-${slot}`, { ...data, savedAt: new Date().toISOString() });
      return true;
    },
    async remove(slot) {
      if (desktop) return window.arcane.saves.remove(slot);
      LS.del(`arcane-slot-${slot}`);
      return true;
    },
    async getSettings() {
      const base = { volume: 0.6, music: true, voice: true, voiceRate: 1, textSpeed: 'normal', spoilers: false, aiEnabled: false, aiModel: 'claude-opus-5-5' };
      if (desktop) return { ...base, ...(await window.arcane.settings.get()) };
      return { ...base, ...LS.get('arcane-settings', {}), hasApiKey: false };
    },
    async setSettings(patch) {
      if (desktop) return window.arcane.settings.set(patch);
      const { apiKey, ...rest } = patch;
      LS.set('arcane-settings', { ...LS.get('arcane-settings', {}), ...rest });
      return true;
    },
  };

  function toast(msg, kind = 'info') {
    const t = el('div', { class: `toast toast-${kind}` }, msg);
    document.body.append(t);
    requestAnimationFrame(() => t.classList.add('show'));
    setTimeout(() => {
      t.classList.remove('show');
      setTimeout(() => t.remove(), 400);
    }, 2800);
  }

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const norm = (s) => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

  window.U = { $, $$, el, esc, tpl, store, toast, sleep, pick, norm, genderIndex, desktop };
})();
