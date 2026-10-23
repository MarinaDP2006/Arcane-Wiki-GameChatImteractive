// Idiomas del juego. Por ahora solo español; otros idiomas se añaden con src/i18n/<idioma>.js.
//
// El juego está escrito en español. Los diccionarios de src/i18n/<idioma>.js guardan
// «texto original en español» → traducción. Así no hay que tocar cada pantalla:
//  - tpl() traduce la historia y los chats antes de poner {name}, {g:…}, etc.
//  - un observador traduce cualquier texto que aparezca en la página (y title, alt, placeholder);
//  - también se traducen los avisos de confirm() y los rótulos que se dibujan en el canvas.
// Las claves con {0}, {1}… son patrones para textos con números o nombres dentro.
(function () {
  const LANGS = [
    { id: 'es', label: 'Español' },
  ];
  const DATA = (window.I18N_DATA = window.I18N_DATA || {});
  let lang = 'es';
  let dict = null;
  let upper = null;
  let patterns = [];

  const escRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  function build() {
    dict = lang === 'es' ? null : DATA[lang] || null;
    upper = null;
    patterns = [];
    if (!dict) return;
    upper = new Map();
    for (const [k, v] of Object.entries(dict)) {
      upper.set(k.toUpperCase(), v);
      if (/\{\d\}/.test(k)) {
        const parts = k.split(/\{(\d)\}/);
        const order = [];
        let src = '';
        parts.forEach((p, i) => {
          if (i % 2) { order.push(Number(p)); src += '([\\s\\S]+?)'; } else src += escRe(p);
        });
        patterns.push({ re: new RegExp(`^${src}$`), order, out: v });
      }
    }
  }

  // Traduce un texto completo; si no está en el diccionario, lo devuelve tal cual.
  function t(text) {
    if (!dict || text == null) return text;
    const s = String(text);
    const key = s.trim();
    if (!key || !/[A-Za-zÀ-ÿ¿¡]/.test(key)) return s;
    let hit = dict[key];
    if (hit == null && key === key.toUpperCase() && key !== key.toLowerCase()) {
      const u = upper.get(key);
      if (u != null) hit = u.toUpperCase();
    }
    if (hit == null) {
      for (const p of patterns) {
        const m = key.match(p.re);
        if (!m) continue;
        const vals = {};
        p.order.forEach((n, i) => { vals[n] = t(m[i + 1]); });
        hit = p.out.replace(/\{(\d)\}/g, (_, n) => vals[n] ?? '');
        break;
      }
    }
    if (hit == null) return s;
    return s.replace(key, () => hit);
  }

  const ATTRS = ['title', 'alt', 'placeholder', 'aria-label'];
  const SKIP = new Set(['SCRIPT', 'STYLE', 'TEXTAREA']);

  // Texto de la interfaz: traduce y resuelve las formas {g:…} con el género del jugador.
  function tDom(s) {
    const v = t(s);
    if (!v.includes('{g:') || !window.U?.genderize) return v;
    return window.U.genderize(v, window.U.genderIndex(window.Game?.current?.()?.player));
  }

  function translateNode(root) {
    if (!dict) return;
    if (root.nodeType === 3) {
      const v = tDom(root.nodeValue);
      if (v !== root.nodeValue) root.nodeValue = v;
      return;
    }
    if (root.nodeType !== 1 || SKIP.has(root.tagName) || root.closest?.('[data-no-i18n]')) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
    for (let n = root; n; n = walker.nextNode()) {
      if (n.nodeType === 3) {
        if (SKIP.has(n.parentNode?.tagName)) continue;
        const v = tDom(n.nodeValue);
        if (v !== n.nodeValue) n.nodeValue = v;
      } else {
        for (const a of ATTRS) {
          const old = n.getAttribute(a);
          if (old) { const v = tDom(old); if (v !== old) n.setAttribute(a, v); }
        }
      }
    }
  }

  let observer = null;
  function watch() {
    if (observer || !dict || !document.body) return;
    translateNode(document.body);
    document.title = t(document.title);
    observer = new MutationObserver((list) => {
      for (const m of list) {
        if (m.type === 'characterData') translateNode(m.target);
        else if (m.type === 'attributes') retranslateAttr(m.target, m.attributeName);
        else m.addedNodes.forEach(translateNode);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS });
  }
  function retranslateAttr(node, a) {
    const old = node.getAttribute(a);
    if (old) { const v = tDom(old); if (v !== old) node.setAttribute(a, v); }
  }

  // Avisos del navegador y texto dibujado en el canvas.
  const nativeConfirm = window.confirm.bind(window);
  const nativeAlert = window.alert.bind(window);
  window.confirm = (msg) => nativeConfirm(t(msg));
  window.alert = (msg) => nativeAlert(t(msg));
  for (const C of [window.CanvasRenderingContext2D, window.OffscreenCanvasRenderingContext2D]) {
    if (!C) continue;
    for (const fn of ['fillText', 'strokeText', 'measureText']) {
      const orig = C.prototype[fn];
      C.prototype[fn] = function (text, ...rest) { return orig.call(this, dict ? t(text) : text, ...rest); };
    }
  }

  function detect() {
    const nav = (navigator.language || 'es').slice(0, 2).toLowerCase();
    return LANGS.some((l) => l.id === nav) ? nav : 'es';
  }

  function setLang(id) {
    lang = LANGS.some((l) => l.id === id) ? id : detect();
    document.documentElement.lang = lang;
    build();
    watch();
  }

  window.I18N = { LANGS, t, setLang, get lang() { return lang; } };
})();
