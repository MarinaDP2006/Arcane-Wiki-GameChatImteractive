# Genera el icono de Las ciudades del Umbral y todas sus copias: build/icon.png (escritorio),
# store/ (ficha de tienda) y los iconos y pantallas de carga de Android.
# Engranaje partido en dos: mitad dorada (Aurelia) y mitad verde (Nácar), con un núcleo de Resonancia.
# Uso: python3 scripts/generar-iconos.py
import math
import os
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = os.path.join(os.path.dirname(__file__), '..')
GOLD = (228, 194, 126)
GOLD_D = (169, 121, 50)
GREEN = (85, 214, 162)
GREEN_D = (35, 150, 108)
NIGHT = (7, 11, 20)
NIGHT2 = (16, 25, 44)
BLUE = (159, 184, 222)


def gear_points(cx, cy, r_out, r_in, teeth):
    pts = []
    for i in range(teeth * 4):
        a = (i / (teeth * 4)) * math.tau - math.pi / 2
        r = r_out if (i % 4) in (1, 2) else r_in
        pts.append((cx + math.cos(a) * r, cy + math.sin(a) * r))
    return pts


def emblem(size, background=True):
    """Dibuja el emblema a 4x y lo reduce para que los bordes queden suaves."""
    S = size * 4
    im = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    c = S / 2
    if background:
        bg = Image.new('RGBA', (S, S))
        g = ImageDraw.Draw(bg)
        for y in range(S):
            t = y / S
            g.line([(0, y), (S, y)], fill=tuple(int(NIGHT[k] + (NIGHT2[k] - NIGHT[k]) * t) for k in range(3)) + (255,))
        mask = Image.new('L', (S, S), 0)
        ImageDraw.Draw(mask).rounded_rectangle([0, 0, S - 1, S - 1], radius=S * 0.22, fill=255)
        im.paste(bg, (0, 0), mask)
        d.rounded_rectangle([S * 0.02, S * 0.02, S * 0.98, S * 0.98], radius=S * 0.2, outline=BLUE + (90,), width=max(2, S // 90))
    # Halo de Resonancia
    glow = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    ImageDraw.Draw(glow).ellipse([c - S * 0.3, c - S * 0.3, c + S * 0.3, c + S * 0.3], fill=GREEN + (70,))
    im.alpha_composite(glow.filter(ImageFilter.GaussianBlur(S * 0.06)))
    # Engranaje partido: izquierda Aurelia, derecha Nácar
    gear = gear_points(c, c, S * 0.36, S * 0.30, 12)
    left = Image.new('L', (S, S), 0)
    ImageDraw.Draw(left).rectangle([0, 0, c, S], fill=255)
    for col, colD, half in ((GOLD, GOLD_D, left), (GREEN, GREEN_D, Image.eval(left, lambda v: 255 - v))):
        layer = Image.new('RGBA', (S, S), (0, 0, 0, 0))
        ld = ImageDraw.Draw(layer)
        ld.polygon(gear, fill=col + (255,))
        ld.ellipse([c - S * 0.235, c - S * 0.235, c + S * 0.235, c + S * 0.235], fill=(0, 0, 0, 0))
        ld.ellipse([c - S * 0.26, c - S * 0.26, c + S * 0.26, c + S * 0.26], outline=colD + (255,), width=max(2, S // 70))
        layer.putalpha(Image.composite(layer.getchannel('A'), Image.new('L', (S, S), 0), half))
        im.alpha_composite(layer)
    # Grieta vertical entre las dos mitades
    d.line([(c, c - S * 0.4), (c - S * 0.02, c - S * 0.15), (c + S * 0.02, c + S * 0.05), (c - S * 0.01, c + S * 0.4)], fill=(230, 240, 255, 230), width=max(2, S // 80))
    # Núcleo
    d.ellipse([c - S * 0.1, c - S * 0.1, c + S * 0.1, c + S * 0.1], fill=(240, 248, 244, 255))
    d.ellipse([c - S * 0.06, c - S * 0.06, c + S * 0.06, c + S * 0.06], fill=GREEN + (255,))
    return im.resize((size, size), Image.LANCZOS)


def save(img, path, rgb=False):
    path = os.path.join(ROOT, path)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    (img.convert('RGB') if rgb else img).save(path)


def font(size):
    for name in ('DejaVuSerif-Bold.ttf', '/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf'):
        try:
            return ImageFont.truetype(name, size)
        except OSError:
            continue
    return ImageFont.load_default()


def backdrop(w, h):
    im = Image.new('RGBA', (w, h), NIGHT + (255,))
    glow = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gd.ellipse([-w * 0.2, -h * 0.4, w * 0.5, h * 0.8], fill=GOLD + (60,))
    gd.ellipse([w * 0.5, h * 0.2, w * 1.2, h * 1.4], fill=GREEN + (60,))
    im.alpha_composite(glow.filter(ImageFilter.GaussianBlur(min(w, h) * 0.15)))
    return im


if __name__ == '__main__':
    save(emblem(512), 'build/icon.png')
    save(emblem(512), 'store/icono-512.png', rgb=True)
    # Gráfico destacado de la tienda
    g = backdrop(1024, 500)
    g.alpha_composite(emblem(300, background=False), (70, 100))
    d = ImageDraw.Draw(g)
    d.text((410, 150), 'LAS CIUDADES', font=font(58), fill=GOLD)
    d.text((410, 220), 'DEL UMBRAL', font=font(58), fill=GREEN)
    d.text((412, 310), 'Rifts & Gears · Aurelia y Nácar', font=font(26), fill=BLUE)
    save(g, 'store/grafico-destacado-1024x500.png', rgb=True)
    # Android: iconos
    for dpi, n in (('mdpi', 48), ('hdpi', 72), ('xhdpi', 96), ('xxhdpi', 144), ('xxxhdpi', 192)):
        save(emblem(n), f'android/app/src/main/res/mipmap-{dpi}/ic_launcher.png')
        save(emblem(n), f'android/app/src/main/res/mipmap-{dpi}/ic_launcher_round.png')
        fg = Image.new('RGBA', (int(n * 2.25), int(n * 2.25)), (0, 0, 0, 0))
        e = emblem(int(n * 1.3), background=False)
        fg.alpha_composite(e, ((fg.width - e.width) // 2, (fg.height - e.height) // 2))
        save(fg, f'android/app/src/main/res/mipmap-{dpi}/ic_launcher_foreground.png')
    # Android: pantallas de carga
    res = os.path.join(ROOT, 'android/app/src/main/res')
    for folder in sorted(os.listdir(res)):
        p = os.path.join(res, folder, 'splash.png')
        if not os.path.exists(p):
            continue
        w, h = Image.open(p).size
        s = backdrop(w, h)
        e = emblem(int(min(w, h) * 0.32), background=False)
        s.alpha_composite(e, ((w - e.width) // 2, (h - e.height) // 2))
        s.convert('RGB').save(p)
    print('✓ Iconos, gráfico de tienda y pantallas de carga generados')
