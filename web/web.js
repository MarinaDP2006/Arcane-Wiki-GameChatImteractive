// Estado de Releases de GitHub y enlaces directos únicamente a archivos publicados.
(function () {
  const REPO = 'MarinaDP2006/RIFTS-GEARS';
  const RELEASES = 'https://github.com/' + REPO + '/releases';
  const status = document.getElementById('estado-version');
  if (status) status.hidden = true;
  const links = [...document.querySelectorAll('[data-archivo]')];
  const ua = navigator.userAgent;
  const platform = /Android/i.test(ua) ? 'android' : /Mac/i.test(ua) && !/iPhone|iPad/i.test(ua) ? 'mac' : /Windows/i.test(ua) ? 'windows' : '';
  const card = platform && document.querySelector('.descarga[data-plataforma="' + platform + '"]');
  if (card) card.classList.add('tuya');
  // Un enlace a Releases nunca se presenta como un instalador directo.
  links.forEach(a => { a.href = RELEASES; a.dataset.originalText = a.textContent; a.textContent = 'Consultar disponibilidad'; });
  const match = (asset, key) => {
    const n = asset.name.toLowerCase();
    if (key === 'Setup') return /setup.*\\.exe$/.test(n);
    if (key === 'portable') return /portable.*\\.exe$/.test(n);
    if (key === 'mac-arm64.dmg') return /arm64.*\\.dmg$/.test(n);
    if (key === 'mac-x64.dmg') return /(x64|x86_64).*\\.dmg$/.test(n);
    if (key === '.apk') return /\\.apk$/.test(n);
    return false;
  };
  fetch('https://api.github.com/repos/' + REPO + '/releases/latest', { headers: { Accept: 'application/vnd.github+json' } })
    .then(r => { if (!r.ok) throw new Error('No release'); return r.json(); })
    .then(release => {
      const assets = Array.isArray(release.assets) ? release.assets : [];
      let available = 0;
      links.forEach(a => {
        const key = a.dataset.archivo;
        const matches = assets.filter(asset => match(asset, key));
        const file = key === '.apk' ? (matches.find(x => /firmado/i.test(x.name)) || matches[0]) : matches[0];
        if (file && /^https:\/\/github\.com\//.test(file.browser_download_url)) {
          a.href = file.browser_download_url;
          a.textContent = a.dataset.originalText;
          available++;
        }
      });
      if (status) { status.hidden = false; status.textContent = available ? 'Última versión: ' + release.tag_name + '. Comprueba la plataforma y el archivo antes de instalar.' : 'Última versión: ' + release.tag_name + '. No hay instaladores compatibles publicados en esta versión.'; }
    })
    .catch(() => { if (status) status.hidden = true; });
})();
