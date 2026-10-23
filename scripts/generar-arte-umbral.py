#!/usr/bin/env python3
"""Genera el arte vectorial propio de Las ciudades del Umbral en src/img/umbral/.

Escenarios (16:9) de cada lugar de Aurelia y Nácar, panorámicas de las dos ciudades,
el mapa del Atlas y los emblemas. Todo es original y se dibuja a partir de una semilla,
así que el resultado es siempre el mismo. Uso: python3 scripts/generar-arte-umbral.py
"""
import math
import os
import random

RAIZ = os.path.join(os.path.dirname(__file__), '..', 'src', 'img', 'umbral')
W, H = 1600, 900

AURELIA = dict(cielo=['#2c3d5c', '#8a7a6a', '#e9c98c', '#f6e7c6'], piedra=['#efe4cc', '#ddcfb2', '#c8b796', '#b39f7c'],
               oro='#d2a85c', oro2='#f3d58f', azul='#3f5f86', sombra='#6c5a42', luz='#fff1c9')
NACAR = dict(cielo=['#050a09', '#0a1714', '#0f2a22', '#123a2e'], piedra=['#1a2622', '#22322c', '#2b3d35', '#16201d'],
             verde='#5fd3b8', verde2='#3ce08a', cobre='#c4794a', luz='#b6ffe0', rosa='#d86a9c')


def rnd(seed):
    return random.Random(seed)


def svg(cuerpo, defs='', etiqueta=''):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" preserveAspectRatio="xMidYMid slice" '
            f'role="img" aria-label="{etiqueta}"><defs>{defs}</defs>{cuerpo}</svg>\n')


def grad(id_, colores, vertical=True):
    paradas = ''.join(f'<stop offset="{i / (len(colores) - 1):.2f}" stop-color="{c}"/>' for i, c in enumerate(colores))
    eje = 'x1="0" y1="0" x2="0" y2="1"' if vertical else 'x1="0" y1="0" x2="1" y2="0"'
    return f'<linearGradient id="{id_}" {eje}>{paradas}</linearGradient>'


def halo(id_, color, opacidad=0.8):
    return (f'<radialGradient id="{id_}"><stop offset="0" stop-color="{color}" stop-opacity="{opacidad}"/>'
            f'<stop offset="1" stop-color="{color}" stop-opacity="0"/></radialGradient>')


FILTROS = ('<filter id="blur"><feGaussianBlur stdDeviation="6"/></filter>'
           '<filter id="bruma"><feGaussianBlur stdDeviation="22"/></filter>'
           '<filter id="grano"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="3"/>'
           '<feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .07 0"/></filter>')


# ---------- Aurelia ----------

def torre(r, x, base, ancho, alto, col, oro, ventanas=True):
    s = f'<rect x="{x}" y="{base - alto}" width="{ancho}" height="{alto}" fill="{col}"/>'
    punta = alto * r.uniform(0.25, 0.6)
    s += f'<polygon points="{x - 4},{base - alto} {x + ancho / 2},{base - alto - punta} {x + ancho + 4},{base - alto}" fill="{oro}"/>'
    if ventanas:
        filas = int(alto // 34)
        for f in range(1, filas):
            for c in range(max(1, int(ancho // 22))):
                if r.random() < 0.55:
                    s += (f'<rect x="{x + 6 + c * 22:.0f}" y="{base - alto + f * 34:.0f}" width="9" height="16" rx="4" '
                          f'fill="#fff1c9" opacity="{r.uniform(.35, .9):.2f}"/>')
    return s


def cupula(x, base, radio, col, oro):
    return (f'<rect x="{x - radio}" y="{base - radio * 1.3}" width="{radio * 2}" height="{radio * 1.3}" fill="{col}"/>'
            f'<path d="M{x - radio - 6},{base - radio * 1.3} A{radio + 6},{radio + 6} 0 0 1 {x + radio + 6},{base - radio * 1.3}Z" fill="{oro}"/>'
            f'<rect x="{x - 3}" y="{base - radio * 2.6}" width="6" height="{radio * 0.45}" fill="{oro}"/>')


def arcos(x, y, n, ancho, alto, col, fondo):
    s = f'<rect x="{x}" y="{y}" width="{n * ancho}" height="{alto}" fill="{col}"/>'
    for i in range(n):
        cx = x + i * ancho + ancho / 2
        s += (f'<path d="M{cx - ancho * .32},{y + alto} V{y + alto * .45} A{ancho * .32},{ancho * .32} 0 0 1 {cx + ancho * .32},{y + alto * .45} V{y + alto}Z" '
              f'fill="{fondo}"/>')
    return s


def dirigible(x, y, esc, col):
    return (f'<g transform="translate({x} {y}) scale({esc})" opacity=".85"><ellipse cx="0" cy="0" rx="90" ry="26" fill="{col}"/>'
            f'<rect x="-28" y="24" width="56" height="16" rx="4" fill="#6c5a42"/><path d="M80 0 L112 -22 L112 22Z" fill="{col}"/></g>')


def skyline_aurelia(r, base, capas=3):
    s = ''
    for k in range(capas):
        col = AURELIA['piedra'][min(3, k + 1)] if k < capas - 1 else AURELIA['piedra'][0]
        op = 0.45 + 0.25 * k
        x = -40
        g = ''
        while x < W + 40:
            ancho = r.randint(40, 110)
            alto = r.randint(140, 420) * (0.6 + 0.2 * k)
            if r.random() < 0.18:
                g += cupula(x + ancho / 2, base - 40 * (capas - k), ancho * .45, col, AURELIA['oro'])
            else:
                g += torre(r, x, base - 40 * (capas - k), ancho, alto, col, AURELIA['oro'], ventanas=k == capas - 1)
            x += ancho + r.randint(4, 30)
        s += f'<g opacity="{op:.2f}">{g}</g>'
    return s


def aurelia_base(r, etiqueta, motivo):
    defs = grad('cielo', AURELIA['cielo']) + halo('sol', AURELIA['luz'], .95) + halo('oro', AURELIA['oro2'], .6) + FILTROS
    s = '<rect width="1600" height="900" fill="url(#cielo)"/>'
    s += f'<circle cx="{r.randint(1050, 1350)}" cy="{r.randint(170, 260)}" r="300" fill="url(#sol)"/>'
    for _ in range(5):
        s += (f'<ellipse cx="{r.randint(0, W)}" cy="{r.randint(80, 360)}" rx="{r.randint(160, 360)}" ry="{r.randint(24, 50)}" '
              f'fill="#fff6e2" opacity=".28" filter="url(#bruma)"/>')
    for _ in range(r.randint(1, 3)):
        s += dirigible(r.randint(100, 1500), r.randint(110, 330), r.uniform(.5, 1.1), '#e7d6b4')
    s += skyline_aurelia(r, 760)
    s += motivo
    s += '<rect y="760" width="1600" height="140" fill="#b39f7c"/><rect y="760" width="1600" height="6" fill="#d2a85c"/>'
    for i in range(0, W, 120):
        s += f'<rect x="{i}" y="790" width="100" height="4" fill="#9a8664" opacity=".6"/>'
    s += '<rect width="1600" height="900" filter="url(#grano)"/>'
    s += '<rect width="1600" height="900" fill="url(#cielo)" opacity=".08"/>'
    return svg(s, defs, etiqueta)


def motivo_archivo(r):
    s = arcos(300, 380, 8, 125, 380, '#efe4cc', '#5a4a36')
    s += '<polygon points="280,380 800,250 1320,380" fill="#ddcfb2"/><rect x="280" y="372" width="1040" height="10" fill="#d2a85c"/>'
    for i in range(8):
        cx = 300 + i * 125 + 62
        for f in range(5):
            s += f'<rect x="{cx - 30}" y="{560 + f * 34}" width="60" height="6" fill="#d2a85c" opacity=".7"/>'
    s += '<circle cx="800" cy="320" r="38" fill="none" stroke="#d2a85c" stroke-width="6"/>'
    return s


def motivo_observatorio(r):
    s = '<rect x="520" y="430" width="560" height="330" fill="#efe4cc"/>'
    s += '<path d="M500,430 A300,300 0 0 1 1100,430Z" fill="#d2a85c"/>'
    s += '<rect x="780" y="160" width="40" height="200" fill="#3f5f86" transform="rotate(28 800 330)"/>'
    s += '<circle cx="800" cy="330" r="16" fill="#6c5a42"/>'
    for i in range(6):
        s += f'<rect x="{560 + i * 88}" y="520" width="40" height="120" rx="20" fill="#5a4a36" opacity=".8"/>'
    for i in range(14):
        s += f'<circle cx="{r.randint(40, 1560)}" cy="{r.randint(40, 200)}" r="{r.uniform(1, 2.6):.1f}" fill="#fff6e2" opacity=".8"/>'
    return s


def motivo_gremios(r):
    s = arcos(160, 470, 10, 128, 290, '#ddcfb2', '#6c5a42')
    for i in range(5):
        x = 230 + i * 280
        s += f'<rect x="{x}" y="300" width="8" height="200" fill="#6c5a42"/>'
        s += f'<path d="M{x + 8},305 h70 v110 l-35 -20 l-35 20z" fill="{["#3f5f86", "#8a3a3a", "#d2a85c"][i % 3]}"/>'
    s += '<ellipse cx="800" cy="745" rx="260" ry="26" fill="#9a8664"/><rect x="760" y="640" width="80" height="110" fill="#efe4cc"/>'
    return s


def motivo_ascensor(r):
    s = ''
    for x in (620, 980):
        s += f'<rect x="{x}" y="0" width="22" height="760" fill="#6c5a42"/>'
    s += '<rect x="642" y="0" width="338" height="760" fill="#2c3d5c" opacity=".25"/>'
    for y in range(40, 760, 70):
        s += f'<line x1="642" y1="{y}" x2="980" y2="{y + 70}" stroke="#6c5a42" stroke-width="5"/>'
    s += '<rect x="680" y="380" width="262" height="200" rx="10" fill="#d2a85c"/><rect x="705" y="405" width="212" height="120" fill="#fff1c9" opacity=".75"/>'
    s += '<line x1="811" y1="0" x2="811" y2="380" stroke="#3a2f22" stroke-width="5"/>'
    s += '<rect x="1040" y="140" width="70" height="180" fill="#6c5a42"/><line x1="1075" y1="0" x2="1075" y2="140" stroke="#3a2f22" stroke-width="4"/>'
    s += '<circle cx="811" cy="30" r="44" fill="none" stroke="#d2a85c" stroke-width="10"/>'
    return s


def motivo_cristal(r):
    s = '<polygon points="0,760 700,520 900,520 1600,760" fill="#c8b796" opacity=".7"/>'
    for i in range(7):
        t = i / 6
        for lado in (-1, 1):
            x = 800 + lado * (90 + t * 700)
            y = 540 + t * 220
            h = 60 + t * 160
            s += f'<rect x="{x - 3}" y="{y - h}" width="6" height="{h}" fill="#6c5a42"/>'
            s += f'<polygon points="{x},{y - h - 34 * (1 + t)} {x - 12 * (1 + t)},{y - h} {x + 12 * (1 + t)},{y - h}" fill="#bfe9ff" opacity=".9"/>'
            s += f'<circle cx="{x}" cy="{y - h - 10}" r="{30 * (1 + t)}" fill="url(#oro)"/>'
    return s


# ---------- Nácar ----------

def caverna(r, etiqueta, motivo, color_luz=None):
    luz = color_luz or NACAR['verde']
    defs = grad('cielo', NACAR['cielo']) + halo('neon', luz, .75) + halo('cobre', NACAR['cobre'], .6) + FILTROS
    s = '<rect width="1600" height="900" fill="url(#cielo)"/>'
    puntos = ' '.join(f'{x},{r.randint(40, 150)}' for x in range(0, W + 80, 80))
    s += f'<polygon points="0,0 {puntos} {W},0" fill="#030605"/>'
    for _ in range(9):
        x = r.randint(0, W)
        s += f'<polygon points="{x - 20},{r.randint(60, 120)} {x},{r.randint(170, 280)} {x + 22},{r.randint(60, 120)}" fill="#050a09"/>'
    for _ in range(7):
        s += f'<circle cx="{r.randint(0, W)}" cy="{r.randint(200, 700)}" r="{r.randint(120, 260)}" fill="url(#neon)" opacity=".45"/>'
    for k in range(3):
        col = NACAR['piedra'][k + 1]
        x = -30
        g = ''
        while x < W:
            ancho = r.randint(60, 150)
            alto = r.randint(160, 460) * (0.6 + 0.2 * k)
            base = 780 - 30 * (2 - k)
            g += f'<rect x="{x}" y="{base - alto}" width="{ancho}" height="{alto}" fill="{col}"/>'
            for f in range(int(alto // 40)):
                for c in range(int(ancho // 26)):
                    if r.random() < 0.3:
                        color = luz if r.random() < .7 else NACAR['cobre']
                        g += (f'<rect x="{x + 8 + c * 26}" y="{base - alto + 14 + f * 40}" width="12" height="14" fill="{color}" '
                              f'opacity="{r.uniform(.3, .95):.2f}"/>')
            x += ancho + r.randint(0, 24)
        s += f'<g opacity="{0.5 + 0.25 * k:.2f}">{g}</g>'
    for _ in range(4):
        y = r.randint(220, 640)
        s += (f'<path d="M-20,{y} C400,{y + r.randint(-60, 60)} 1200,{y + r.randint(-60, 60)} 1620,{y}" stroke="#2b3d35" '
              f'stroke-width="{r.randint(10, 22)}" fill="none"/>')
    for _ in range(3):
        y = r.randint(330, 560)
        s += f'<rect x="0" y="{y}" width="1600" height="10" fill="#22322c"/>'
        for x in range(0, W, 46):
            s += f'<rect x="{x}" y="{y + 10}" width="4" height="28" fill="#22322c"/>'
    s += motivo
    s += '<rect y="780" width="1600" height="120" fill="#0a1311"/>'
    for _ in range(14):
        s += (f'<ellipse cx="{r.randint(0, W)}" cy="{r.randint(560, 860)}" rx="{r.randint(120, 300)}" ry="{r.randint(16, 40)}" '
              f'fill="#cfeee3" opacity=".08" filter="url(#bruma)"/>')
    for _ in range(40):
        s += f'<circle cx="{r.randint(0, W)}" cy="{r.randint(150, 880)}" r="{r.uniform(1, 3):.1f}" fill="{luz}" opacity="{r.uniform(.3, .9):.2f}"/>'
    s += '<rect width="1600" height="900" filter="url(#grano)"/>'
    return svg(s, defs, etiqueta)


def motivo_mercado(r):
    s = ''
    for i in range(7):
        x = 90 + i * 215
        col = [NACAR['cobre'], '#3a5a4a', '#6a3a2a', '#2f5c52'][i % 4]
        s += f'<rect x="{x}" y="600" width="170" height="180" fill="#1a2622"/><polygon points="{x - 15},600 {x + 85},540 {x + 185},600" fill="{col}"/>'
        s += f'<circle cx="{x + 85}" cy="530" r="60" fill="url(#cobre)"/><circle cx="{x + 85}" cy="560" r="10" fill="#ffd7a8"/>'
        for j in range(3):
            s += f'<rect x="{x + 15 + j * 52}" y="650" width="36" height="22" fill="{NACAR["verde"]}" opacity=".5"/>'
    return s


def motivo_galerias(r):
    s = ''
    for x in (300, 800, 1300):
        s += f'<rect x="{x - 60}" y="420" width="120" height="360" fill="#16201d"/><ellipse cx="{x}" cy="420" rx="70" ry="22" fill="#2b3d35"/>'
        for k in range(6):
            s += (f'<ellipse cx="{x + r.randint(-40, 40)}" cy="{380 - k * 55}" rx="{50 + k * 18}" ry="{24 + k * 6}" '
                  f'fill="#d9fff1" opacity="{.18 - k * .02:.2f}" filter="url(#blur)"/>')
        s += f'<circle cx="{x}" cy="600" r="90" fill="url(#neon)"/>'
    for i in range(10):
        x = r.randint(80, 1520)
        s += f'<polygon points="{x},780 {x + 18},700 {x + 36},780" fill="{NACAR["verde2"]}" opacity=".75"/>'
    return s


def motivo_jardin(r):
    s = ''
    for _ in range(60):
        x = r.randint(0, W)
        y = r.randint(600, 800)
        h = r.randint(40, 160)
        s += f'<path d="M{x},{y} q{r.randint(-30, 30)},{-h / 2} {r.randint(-20, 20)},{-h}" stroke="#2f7a5a" stroke-width="{r.randint(3, 8)}" fill="none"/>'
        s += f'<circle cx="{x + r.randint(-20, 20)}" cy="{y - h}" r="{r.randint(6, 14)}" fill="{NACAR["verde2"]}" opacity=".8"/>'
    for i in range(5):
        x = 200 + i * 300
        s += f'<path d="M{x},780 V560 a60,60 0 0 1 120,0 V780" fill="none" stroke="#3a5a4a" stroke-width="12"/>'
    return s


def motivo_clinica(r):
    s = '<rect x="420" y="380" width="760" height="400" fill="#22322c"/><polygon points="400,380 800,280 1200,380" fill="#2b3d35"/>'
    for i in range(3):
        cx = 560 + i * 240
        s += f'<path d="M{cx - 70},780 V580 a70,70 0 0 1 140,0 V780Z" fill="#0a1311"/>'
        s += f'<path d="M{cx - 70},780 V580 a70,70 0 0 1 140,0 V780Z" fill="url(#neon)" opacity=".7"/>'
    s += '<rect x="770" y="300" width="60" height="18" fill="#e9fff6"/><rect x="791" y="279" width="18" height="60" fill="#e9fff6"/>'
    for i in range(8):
        s += f'<rect x="{470 + i * 85}" y="430" width="40" height="60" fill="#b6ffe0" opacity=".6"/>'
    return s


def motivo_canal(r):
    s = '<rect y="660" width="1600" height="120" fill="#123a2e"/>'
    for i in range(12):
        s += f'<rect x="{r.randint(0, 1500)}" y="{r.randint(670, 760)}" width="{r.randint(60, 200)}" height="3" fill="{NACAR["verde"]}" opacity=".5"/>'
    s += '<line x1="800" y1="0" x2="800" y2="330" stroke="#3a2f22" stroke-width="6"/>'
    s += '<rect x="690" y="330" width="220" height="110" rx="8" fill="#c4794a"/><rect x="710" y="350" width="180" height="60" fill="#ffd7a8" opacity=".7"/>'
    for k in range(5):
        s += f'<ellipse cx="{800 + r.randint(-200, 200)}" cy="{620 - k * 50}" rx="{120 + k * 30}" ry="30" fill="#e9fff6" opacity=".12" filter="url(#blur)"/>'
    s += '<path d="M690,440 l-60,60 M910,440 l60,60" stroke="#c4794a" stroke-width="10"/>'
    return s


# ---------- Panorámicas, mapa y emblemas ----------

def panoramica_resonancia(r):
    defs = grad('cielo', ['#0b1418', '#14302b', '#1d1a12']) + halo('neon', NACAR['verde'], .8) + FILTROS
    s = '<rect width="1600" height="900" fill="url(#cielo)"/>'
    nodos = [(r.randint(150, 1450), r.randint(150, 750)) for _ in range(14)]
    for i, (x, y) in enumerate(nodos):
        for (x2, y2) in nodos[i + 1:i + 3]:
            s += f'<line x1="{x}" y1="{y}" x2="{x2}" y2="{y2}" stroke="{NACAR["verde"]}" stroke-width="3" opacity=".55"/>'
    for x, y in nodos:
        s += f'<circle cx="{x}" cy="{y}" r="90" fill="url(#neon)"/>'
        s += f'<polygon points="{x},{y - 30} {x + 16},{y} {x},{y + 30} {x - 16},{y}" fill="#b6ffe0"/>'
    return svg(s, defs, 'Red de Resonancia')


def mapa(r):
    defs = grad('papel', ['#1a1f22', '#121618']) + FILTROS
    s = '<rect width="1600" height="900" fill="url(#papel)"/>'
    s += '<path d="M0,450 C400,380 1200,520 1600,440" stroke="#d2a85c" stroke-width="3" stroke-dasharray="14 10" fill="none" opacity=".6"/>'
    s += '<ellipse cx="1040" cy="240" rx="420" ry="190" fill="#d2a85c" opacity=".14"/><ellipse cx="530" cy="640" rx="430" ry="200" fill="#5fd3b8" opacity=".12"/>'
    for _ in range(80):
        x, y = r.randint(700, 1400), r.randint(90, 390)
        s += f'<rect x="{x}" y="{y}" width="{r.randint(14, 40)}" height="{r.randint(10, 30)}" fill="#d2a85c" opacity=".35"/>'
    for _ in range(80):
        x, y = r.randint(150, 900), r.randint(480, 820)
        s += f'<rect x="{x}" y="{y}" width="{r.randint(12, 34)}" height="{r.randint(8, 24)}" fill="#5fd3b8" opacity=".3"/>'
    s += '<line x1="780" y1="300" x2="780" y2="600" stroke="#efe4cc" stroke-width="4"/><circle cx="780" cy="450" r="12" fill="#efe4cc"/>'
    s += ('<text x="1040" y="250" fill="#f3d58f" font-family="Georgia,serif" font-size="56" text-anchor="middle" letter-spacing="8">AURELIA</text>'
          '<text x="530" y="650" fill="#b6ffe0" font-family="Georgia,serif" font-size="56" text-anchor="middle" letter-spacing="8">NÁCAR</text>')
    s += '<g transform="translate(1460 760)" stroke="#d2a85c" fill="none" stroke-width="3"><circle r="60"/><path d="M0,-80 L0,80 M-80,0 L80,0"/><path d="M0,-80 l10,24 h-20z" fill="#d2a85c"/></g>'
    return svg(s, defs, 'Mapa de Aurelia y Nácar')


def emblema(ciudad):
    if ciudad == 'aurelia':
        dientes = ''.join(f'<rect x="-9" y="-112" width="18" height="30" fill="#d2a85c" transform="rotate({i * 30})"/>' for i in range(12))
        cuerpo = (f'<g transform="translate(128 128)">{dientes}<circle r="86" fill="#1c1a14" stroke="#d2a85c" stroke-width="10"/>'
                  '<circle r="34" fill="#f3d58f"/><path d="M0,-70 V70 M-70,0 H70" stroke="#d2a85c" stroke-width="6"/></g>')
    else:
        cuerpo = ('<g transform="translate(128 128)"><circle r="104" fill="#07100d" stroke="#5fd3b8" stroke-width="8"/>'
                  '<polygon points="0,-78 44,0 0,78 -44,0" fill="none" stroke="#5fd3b8" stroke-width="10"/>'
                  '<polygon points="0,-40 22,0 0,40 -22,0" fill="#b6ffe0"/><circle r="10" fill="#07100d"/></g>')
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" role="img" aria-label="Emblema de {ciudad}">{cuerpo}</svg>\n'


LUGARES = {
    # Aurelia
    'archivo': ('aurelia', 'Archivo de Frecuencias', motivo_archivo),
    'observatorio': ('aurelia', 'Terrazas del Observatorio', motivo_observatorio),
    'gremios': ('aurelia', 'Patio de Gremios', motivo_gremios),
    'ascensor-central': ('aurelia', 'Estación de Ascensores', motivo_ascensor),
    'cristal': ('aurelia', 'Bulevar de Cristal', motivo_cristal),
    'aurelia': ('aurelia', 'Aurelia', lambda r: ''),
    # Nácar
    'mercado-nacar': ('nacar', 'Mercado de las Tuberías', motivo_mercado),
    'galerias': ('nacar', 'Galerías Geotérmicas', motivo_galerias),
    'jardin-musgo': ('nacar', 'Jardín de Musgo', motivo_jardin),
    'clinica': ('nacar', 'Clínica de los Tres Arcos', motivo_clinica),
    'canal-cobre': ('nacar', 'Canal de Cobre', motivo_canal),
    'nacar': ('nacar', 'Nácar', lambda r: ''),
}


def main():
    os.makedirs(os.path.join(RAIZ, 'lugares'), exist_ok=True)
    os.makedirs(os.path.join(RAIZ, 'simbolos'), exist_ok=True)
    for i, (id_, (ciudad, nombre, motivo)) in enumerate(LUGARES.items()):
        r = rnd(1000 + i)
        hacer = aurelia_base if ciudad == 'aurelia' else caverna
        with open(os.path.join(RAIZ, 'lugares', id_ + '.svg'), 'w', encoding='utf-8') as f:
            f.write(hacer(r, nombre, motivo(r)))
    with open(os.path.join(RAIZ, 'lugares', 'resonancia.svg'), 'w', encoding='utf-8') as f:
        f.write(panoramica_resonancia(rnd(77)))
    with open(os.path.join(RAIZ, 'mapa.svg'), 'w', encoding='utf-8') as f:
        f.write(mapa(rnd(88)))
    for c in ('aurelia', 'nacar'):
        with open(os.path.join(RAIZ, 'simbolos', c + '.svg'), 'w', encoding='utf-8') as f:
            f.write(emblema(c))
    print('Arte generado en', os.path.normpath(RAIZ))


if __name__ == '__main__':
    main()
