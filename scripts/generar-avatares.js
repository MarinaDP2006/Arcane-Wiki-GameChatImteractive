// Genera los 24 avatares del creador (src/img/arte/avatares/mujer-NN.jpg y hombre-NN.jpg) con el
// pintor de retratos del juego (src/js/painter.js). Necesita Playwright: npx playwright install chromium.
// Uso: node scripts/generar-avatares.js && node scripts/art-manifest.js
const path = require('path');
const { chromium } = require('playwright');
const fs = require('fs');
const OUT = path.join(__dirname, '..', 'src', 'img', 'arte', 'avatares');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  await p.goto(`file://${path.join(__dirname, '..', 'src', 'index.html')}`); await p.waitForTimeout(1500);
  const res = await p.evaluate(() => {
    const skins = ['#f6dcc8', '#f0c8a8', '#e8b394', '#d9a98a', '#c9946a', '#b07a58', '#8a5a3c', '#6b4430', '#5a3a28', '#3a2418'];
    const A = { rim: '#d9b46a', bg: ['#7a5a2a', '#1a1208'] }, N = { rim: '#55d6a2', bg: ['#1f4a44', '#060c0c'] };
    const W = [
      ['long','#2a1a12','oval','abrigo','#2c3e6b',[],'almendra','#5a7a3a'], ['bob','#1a1a2a','corazon','uniforme','#1f2f55',['earrings'],'grandes','#3a6a9a'],
      ['ponytail','#b0402a','angular','chaqueta','#5a2a2a',['freckles'],'almendra','#3a7a5a'], ['curly','#3a2418','redondo','vestido','#c9a24a',['gold'],'grandes','#6a4a2a'],
      ['bun','#e8d8b0','largo','bata','#d8d0c0',['glasses'],'almendra','#4a6a8a'], ['braids','#2a6a8a','oval','mono','#2f3a2a',['goggles'],'rasgados','#7aa04a'],
      ['messy','#5a1a3a','angular','chaqueta','#1a2a22',['piercing','scar'],'rasgados','#c04a7a'], ['afro','#1a1210','redondo','abrigo','#3a2a1a',[],'grandes','#4a3a2a'],
      ['pigtails','#d0a060','corazon','mono','#4a3a2a',['paint'],'grandes','#3a8a6a'], ['undercut','#20b080','angular','harapos','#22302a',['tattoo'],'rasgados','#55d6a2'],
      ['long','#a06a3a','largo','vestido','#2a4a3a',['freckles'],'almendra','#6a8a3a'], ['short','#c0c0c8','oval','uniforme','#3a3050',['scar'],'cansados','#5a6a9a'],
    ];
    const M = [
      ['slick','#1a1a1a','angular','abrigo','#2c3e6b',[],'almendra','#3a5a8a'], ['short','#3a2418','oval','uniforme','#5a2a2a',['beard'],'almendra','#5a4a2a'],
      ['messy','#a05a2a','redondo','chaqueta','#3a2a1a',['freckles'],'grandes','#4a7a3a'], ['swept','#d8c8a0','largo','bata','#d8d0c0',['glasses'],'almendra','#5a7aa0'],
      ['mohawk','#2aa080','angular','harapos','#1f2a22',['piercing','tattoo'],'rasgados','#55d6a2'], ['curly','#1a1210','redondo','mono','#2f3a2a',['goggles'],'grandes','#3a2a1a'],
      ['undercut','#5a3a2a','angular','chaqueta','#22302a',['scar','beard'],'rasgados','#7a6a3a'], ['bald','#2a1a12','oval','abrigo','#3a3050',['mustache'],'cansados','#4a3a2a'],
      ['wild','#e0e0e0','largo','harapos','#2a2a2a',['mask'],'rasgados','#8aa0b0'], ['short','#c09050','corazon','uniforme','#1f2f55',[],'grandes','#5a8a5a'],
      ['afro','#1a1210','redondo','chaqueta','#5a3a1a',['beard'],'almendra','#3a2a1a'], ['long','#4a2a1a','oval','abrigo','#2a4a3a',['scar'],'almendra','#6a8a5a'],
    ];
    const skinFor = (i) => skins[(i * 3) % skins.length];
    const mk = ([style, hair, face, outfit, outfitColor, accents, eyes, eyeColor], i, gender) => ({
      look: { style, hair, face, outfit, outfitColor, accents, eyes, eyeColor, skin: skinFor(i + (gender === 'h' ? 1 : 0)), brows: i % 2 ? 'gruesas' : 'arqueadas' },
      city: i % 2 ? N : A,
    });
    const out = {};
    W.forEach((d, i) => { const { look, city } = mk(d, i, 'm'); out[`mujer-${String(i + 1).padStart(2, '0')}`] = Painter.toURL(look, { ...city, size: 400 }); });
    M.forEach((d, i) => { const { look, city } = mk(d, i, 'h'); out[`hombre-${String(i + 1).padStart(2, '0')}`] = Painter.toURL(look, { ...city, size: 400 }); });
    return out;
  });
  for (const [k, url] of Object.entries(res)) fs.writeFileSync(`${OUT}/${k}.jpg`, Buffer.from(url.split(',')[1], 'base64'));
  console.log(`✓ ${Object.keys(res).length} avatares en ${OUT}`);
  await b.close();
})();
