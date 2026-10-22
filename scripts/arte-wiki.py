#!/usr/bin/env python3
"""Explorador/descargador de imágenes de la Arcane Wiki (Fandom) para Grietas & Gears.

Se ejecuta en GitHub Actions (.github/workflows/arte.yml), donde hay internet abierto.
Lee el pedido en JSON de la variable PEDIDO (o de un archivo pasado como argumento):
  {"mode": "discover", "pages": [...], "keywords": [...]}
  {"mode": "allimages", "wikis": ["arcane"], "minw": 900}   (solo lista: título, tamaño, url)
  {"mode": "sheet", "wiki": "arcane", "groups": {"nombre": ["File:A.png", ...]}}   (hojas de miniaturas)
  {"mode": "fetch", "items": [{"title": "File:X.png", "dest": "ruta/salida.webp", "max": 1600}]}
"""
import json, os, re, sys, time, io, urllib.parse, urllib.request
from PIL import Image, ImageDraw, ImageFont

API = {
    'arcane': 'https://arcane.fandom.com/api.php',
    'lol': 'https://leagueoflegends.fandom.com/api.php',
    'lolwiki': 'https://wiki.leagueoflegends.com/en-us/api.php',
}
UA = 'GrietasAndGearsFanGame/1.0 (https://github.com/MarinaDP2006/grietas-and-gears; image catalog for a free fan game)'
OUT = 'salida'


def get(url, binary=False, tries=4):
    for i in range(tries):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': UA})
            with urllib.request.urlopen(req, timeout=60) as r:
                data = r.read()
            return data if binary else json.loads(data)
        except Exception as e:
            print('  reintento', i, url[:120], e, flush=True)
            time.sleep(2 * (i + 1))
    return None


def api(wiki, **params):
    params.setdefault('format', 'json')
    params.setdefault('formatversion', '2')
    return get(API[wiki] + '?' + urllib.parse.urlencode(params))


def all_pages(wiki, ns=0):
    titles, cont = [], {}
    while True:
        r = api(wiki, action='query', list='allpages', apnamespace=ns, aplimit='500', **cont)
        if not r:
            break
        titles += [p['title'] for p in r['query']['allpages']]
        if 'continue' not in r:
            break
        cont = {'apcontinue': r['continue']['apcontinue']}
    return titles


def page_images(wiki, title):
    """Imágenes usadas en una página, con url, tamaño y miniatura de 400px."""
    out, cont = [], {}
    while True:
        r = api(wiki, action='query', generator='images', titles=title, gimlimit='500', prop='imageinfo',
                iiprop='url|size|mime', iiurlwidth='400', **cont)
        if not r or 'query' not in r:
            break
        for p in r['query'].get('pages', []):
            ii = (p.get('imageinfo') or [{}])[0]
            if not ii.get('url'):
                continue
            out.append({'title': p['title'], 'url': ii['url'], 'thumb': ii.get('thumburl'), 'w': ii.get('width'),
                        'h': ii.get('height'), 'mime': ii.get('mime'), 'page': ii.get('descriptionurl')})
        if 'continue' not in r:
            break
        cont = {k: v for k, v in r['continue'].items()}
    return out


def font(sz):
    for f in ['/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf']:
        if os.path.exists(f):
            return ImageFont.truetype(f, sz)
    return ImageFont.load_default()


def contact_sheet(items, path, cols=4, cell=(400, 250)):
    rows = (len(items) + cols - 1) // cols
    sheet = Image.new('RGB', (cols * cell[0], rows * (cell[1] + 24)), (20, 20, 20))
    d = ImageDraw.Draw(sheet)
    f = font(15)
    for i, (label, im) in enumerate(items):
        x, y = (i % cols) * cell[0], (i // cols) * (cell[1] + 24)
        if im is not None:
            im = im.copy()
            im.thumbnail(cell)
            sheet.paste(im, (x + (cell[0] - im.width) // 2, y + 24 + (cell[1] - im.height) // 2))
        d.text((x + 4, y + 3), label[:46], fill=(255, 220, 90), font=f)
    sheet.save(path, quality=80)


def discover(req):
    os.makedirs(OUT + '/hojas', exist_ok=True)
    wiki = req.get('wiki', 'arcane')
    pages = list(req.get('pages', []))
    if req.get('list_all'):
        allp = all_pages(wiki)
        json.dump(allp, open(OUT + f'/{wiki}-paginas.json', 'w'), ensure_ascii=False, indent=0)
        kw = [k.lower() for k in req.get('keywords', [])]
        pages += [t for t in allp if t.endswith('/Gallery') or any(k in t.lower() for k in kw)]
    pages = list(dict.fromkeys(pages))
    index = {}
    seen = set()
    for title in pages:
        print('Página:', title, flush=True)
        imgs = [i for i in page_images(wiki, title) if (i['w'] or 0) >= req.get('minw', 700)
                and i['mime'] in ('image/png', 'image/jpeg', 'image/webp') and i['title'] not in seen]
        if not imgs:
            continue
        slug = re.sub(r'[^a-z0-9]+', '-', title.lower()).strip('-')
        index[title] = []
        cells = []
        for n, it in enumerate(imgs):
            seen.add(it['title'])
            it['id'] = f'{slug}#{n}'
            index[title].append(it)
            data = get(it['thumb'] or it['url'], binary=True)
            im = None
            if data:
                try:
                    im = Image.open(io.BytesIO(data)).convert('RGB')
                except Exception:
                    pass
            cells.append((f"{n} {it['title'][5:]} {it['w']}x{it['h']}", im))
        for k in range(0, len(cells), 24):
            contact_sheet(cells[k:k + 24], f'{OUT}/hojas/{slug}-{k // 24}.jpg')
    json.dump(index, open(OUT + f'/{wiki}-indice.json', 'w'), ensure_ascii=False, indent=1)


def allimages(req):
    for wiki in req.get('wikis', ['arcane']):
        out, cont = [], {}
        while True:
            r = api(wiki, action='query', list='allimages', ailimit='500', aiprop='size|url|mime', **cont)
            if not r or 'query' not in r:
                break
            for i in r['query']['allimages']:
                if (i.get('width') or 0) >= req.get('minw', 900):
                    out.append([i['title'], i.get('width'), i.get('height'), i.get('url')])
            if 'continue' not in r:
                break
            cont = {'aicontinue': r['continue']['aicontinue']}
        print(wiki, len(out), flush=True)
        json.dump(out, open(OUT + f'/{wiki}-todas.json', 'w'), ensure_ascii=False, indent=0)


def sheets(req):
    os.makedirs(OUT + '/hojas', exist_ok=True)
    wiki = req.get('wiki', 'arcane')
    index = {}
    for name, titles in req['groups'].items():
        info = {}
        for k in range(0, len(titles), 40):
            r = api(wiki, action='query', titles='|'.join(titles[k:k + 40]), prop='imageinfo', iiprop='url|size', iiurlwidth='420')
            for p in (r or {}).get('query', {}).get('pages', []):
                if p.get('imageinfo'):
                    info[p['title']] = p['imageinfo'][0]
        cells, index[name] = [], []
        for n, t in enumerate(titles):
            ii = info.get(t.replace('_', ' '))
            im = None
            if ii:
                data = get(ii.get('thumburl') or ii['url'], binary=True)
                try:
                    im = Image.open(io.BytesIO(data)).convert('RGB')
                except Exception:
                    pass
            index[name].append([n, t, bool(im)])
            cells.append((f'{n} {t[5:]}', im))
        for k in range(0, len(cells), 12):
            contact_sheet(cells[k:k + 12], f'{OUT}/hojas/{name}-{k // 12}.jpg', cols=3, cell=(560, 240))
    json.dump(index, open(OUT + '/hojas.json', 'w'), ensure_ascii=False, indent=1)


def imageinfo(wiki, titles):
    res = {}
    for k in range(0, len(titles), 40):
        r = api(wiki, action='query', titles='|'.join(titles[k:k + 40]), prop='imageinfo', iiprop='url|size|mime|user|timestamp')
        for p in (r or {}).get('query', {}).get('pages', []):
            if p.get('imageinfo'):
                res[p['title']] = p['imageinfo'][0]
        for n in (r or {}).get('query', {}).get('normalized', []):
            if n['to'] in res:
                res[n['from']] = res[n['to']]
    return res


def fetch(req):
    log = []
    by_wiki = {}
    for it in req['items']:
        by_wiki.setdefault(it.get('wiki', req.get('wiki', 'arcane')), []).append(it)
    for wiki, items in by_wiki.items():
        info = imageinfo(wiki, [i['title'] for i in items])
        for it in items:
            ii = info.get(it['title'])
            rec = dict(it, ok=False)
            if not ii:
                rec['error'] = 'no encontrada'
                log.append(rec)
                continue
            data = get(ii['url'], binary=True)
            if not data:
                rec['error'] = 'descarga fallida'
                log.append(rec)
                continue
            im = Image.open(io.BytesIO(data)).convert('RGB')
            if it.get('crop'):
                l, t, r_, b = it['crop']
                im = im.crop((int(l * im.width), int(t * im.height), int(r_ * im.width), int(b * im.height)))
            im.thumbnail((it.get('max', 1600), it.get('max', 1600)))
            dest = os.path.join(OUT, it['dest'])
            os.makedirs(os.path.dirname(dest), exist_ok=True)
            im.save(dest, 'WEBP', quality=it.get('q', 82), method=6)
            rec.update(ok=True, url=ii['url'], page=ii.get('descriptionurl'), uploader=ii.get('user'),
                       uploaded=ii.get('timestamp'), orig=[ii.get('width'), ii.get('height')], size=[im.width, im.height],
                       bytes=os.path.getsize(dest))
            log.append(rec)
            print('OK', it['title'], '->', it['dest'], flush=True)
    json.dump(log, open(OUT + '/descargas.json', 'w'), ensure_ascii=False, indent=1)


if __name__ == '__main__':
    req = json.loads(os.environ['PEDIDO']) if os.environ.get('PEDIDO') else json.load(open(sys.argv[1]))
    os.makedirs(OUT, exist_ok=True)
    {'discover': discover, 'allimages': allimages, 'sheet': sheets, 'fetch': fetch}[req['mode']](req)
