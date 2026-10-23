// Web de Grietas & Gears: resalta la descarga de tu sistema y enlaza los archivos reales de la
// última versión publicada en GitHub. Si no hay red o aún no hay versión, los botones siguen
// llevando a la página de Releases.
(function () {
  const REPO = 'MarinaDP2006/grietas-and-gears';

  // Adivina la plataforma del visitante: android, mac, windows u otra.
  function plataforma() {
    const ua = navigator.userAgent;
    if (/Android/i.test(ua)) return 'android';
    if (/Mac/i.test(ua) && !/iPhone|iPad/i.test(ua)) return 'mac';
    if (/Windows/i.test(ua)) return 'windows';
    return '';
  }

  const mia = plataforma();
  const carta = mia && document.querySelector(`.descarga[data-plataforma="${mia}"]`);
  if (carta) {
    carta.classList.add('tuya');
    const nombres = { windows: 'Windows', mac: 'Mac', android: 'Android' };
    const principal = document.getElementById('boton-principal');
    if (principal) principal.textContent = `Descargar para ${nombres[mia]}`;
  }

  // Cambia cada botón por el enlace directo al archivo que corresponde en la última versión.
  fetch(`https://api.github.com/repos/${REPO}/releases/latest`, { headers: { Accept: 'application/vnd.github+json' } })
    .then((r) => (r.ok ? r.json() : null))
    .then((rel) => {
      if (!rel || !Array.isArray(rel.assets)) return;
      const assets = rel.assets;
      document.querySelectorAll('[data-archivo]').forEach((a) => {
        const clave = a.dataset.archivo;
        // En Android se prefiere el APK firmado si existe.
        const encontrado = (clave === '.apk' && assets.find((x) => /firmado\.apk$/.test(x.name))) || assets.find((x) => x.name.includes(clave));
        if (encontrado) a.href = encontrado.browser_download_url;
      });
      const estado = document.getElementById('estado-version');
      if (estado) estado.textContent = `Última versión publicada: ${rel.tag_name}. Próximamente también en itch.io.`;
    })
    .catch(() => {});
})();
