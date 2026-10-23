// Pantalla de inicio viva: Aurelia arriba (cielo dorado) y Nácar abajo (cueva de neón),
// separadas por una grieta de luz que sigue al ratón o al dedo. Encima, polvo dorado y
// esporas que se apartan del cursor, destellos al hacer clic y un engranaje que gira
// cuando te mueves. Todo se dibuja en el navegador, sin vídeos ni descargas.
(function () {
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;

  // Engranaje de latón para el «&» del título: dientes alrededor de un aro.
  function gearPath(teeth = 14, r1 = 40, r2 = 47) {
    const step = (Math.PI * 2) / teeth;
    let d = '';
    for (let i = 0; i < teeth; i++) {
      const a = i * step;
      const pts = [[r1, a], [r2, a + step * 0.18], [r2, a + step * 0.48], [r1, a + step * 0.66]];
      pts.forEach(([r, t], k) => { d += `${i || k ? 'L' : 'M'}${(50 + r * Math.cos(t)).toFixed(2)} ${(50 + r * Math.sin(t)).toFixed(2)}`; });
    }
    return `${d}Z`;
  }
  const GEAR_SVG = `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="${gearPath()}" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="50" cy="50" r="33" fill="none" stroke="currentColor" stroke-width="0.8" opacity=".55"/><circle cx="50" cy="50" r="5" fill="currentColor" opacity=".6"/>${[0, 60, 120].map((a) => `<path d="M50 50L${(50 + 33 * Math.cos(a * Math.PI / 180)).toFixed(1)} ${(50 + 33 * Math.sin(a * Math.PI / 180)).toFixed(1)}M50 50L${(50 - 33 * Math.cos(a * Math.PI / 180)).toFixed(1)} ${(50 - 33 * Math.sin(a * Math.PI / 180)).toFixed(1)}" stroke="currentColor" stroke-width="0.8" opacity=".45"/>`).join('')}</svg>`;

  /**
   * Monta los efectos sobre el contenedor .home.
   * opts: { reduce, particles, low } (ajustes del jugador). Devuelve una función para pararlo todo.
   */
  function mount(home, opts = {}) {
    const nacar = home.querySelector('.home-art.nacar');
    const aur = home.querySelector('.home-art.aurelia');
    const rift = home.querySelector('.home-rift');
    const canvas = home.querySelector('.home-fx');
    const gear = home.querySelector('.home-gear');
    const hint = home.querySelector('.home-hint');
    const cities = [...home.querySelectorAll('.home-city')];
    const ctx = canvas.getContext('2d');
    const reduce = Boolean(opts.reduce);
    const particlesOn = !reduce && opts.particles !== false;

    // Perfil de la grieta: puntos de arriba abajo con un zigzag fijo y algunas ramas.
    const N = 18;
    const jag = Array.from({ length: N + 1 }, (_, i) => (i === 0 || i === N ? 0 : Math.abs(Math.sin(i * 12.9898) * 43758.5453 % 1) * 0.07));
    const branches = [3, 7, 11, 14].map((i, k) => ({ i, dir: k % 2 ? 1 : -1, len: 0.05 + (k % 3) * 0.02 }));

    const st = {
      w: 1, h: 1, dpr: 1,
      x: 0.62, target: 0.62, // posición de la grieta (0 izquierda, 1 derecha)
      mx: 0.5, my: 0.5, px: 0.5, py: 0.5, // ratón normalizado y parallax suavizado
      cx: -999, cy: -999, // ratón en píxeles (para apartar partículas)
      lastInput: 0, gearA: 0, gearV: 0.05, t: 0, side: '',
      parts: [], sparks: [], rings: [],
    };

    function riftPoints(t) {
      return jag.map((j, i) => {
        const y = i / N;
        const wob = reduce ? 0 : Math.sin(t * 0.0011 + i * 0.9) * 0.006;
        return [st.x + (j - 0.035) * 0.9 + wob + (y - 0.5) * 0.05, y];
      });
    }
    const xAt = (pts, y) => {
      const f = clamp(y, 0, 1) * N;
      const i = Math.min(N - 1, Math.floor(f));
      return lerp(pts[i][0], pts[i + 1][0], f - i);
    };

    function resize() {
      const r = home.getBoundingClientRect();
      st.w = Math.max(1, r.width); st.h = Math.max(1, r.height);
      st.dpr = Math.min(window.devicePixelRatio || 1, opts.low ? 1 : 2);
      canvas.width = Math.round(st.w * st.dpr); canvas.height = Math.round(st.h * st.dpr);
      const want = particlesOn ? Math.round(clamp((st.w * st.h) / (opts.low ? 26000 : 13000), 24, opts.low ? 60 : 140)) : 0;
      while (st.parts.length < want) st.parts.push(spawn(true));
      st.parts.length = want;
    }

    function spawn(anywhere) {
      return {
        x: Math.random() * st.w, y: anywhere ? Math.random() * st.h : st.h + 10,
        vx: (Math.random() - 0.5) * 0.15, vy: -(0.15 + Math.random() * 0.45),
        r: 0.8 + Math.random() * 2.2, ph: Math.random() * 6.28, kind: Math.random(),
      };
    }

    function input(clientX, clientY) {
      const r = home.getBoundingClientRect();
      st.mx = clamp((clientX - r.left) / st.w, 0, 1);
      st.my = clamp((clientY - r.top) / st.h, 0, 1);
      st.cx = clientX - r.left; st.cy = clientY - r.top;
      // La grieta sigue al cursor, pero nunca tapa del todo ninguna de las dos ciudades.
      st.target = clamp(st.mx, 0.1, 0.94);
      const now = performance.now();
      st.gearV += Math.min(0.6, Math.hypot(st.mx - st.px, st.my - st.py) * 3);
      st.lastInput = now;
      if (hint && !hint.dataset.seen) { hint.dataset.seen = '1'; setTimeout(() => hint.classList.add('gone'), 2200); }
      if (reduce) { st.x = st.target; draw(now); }
    }

    function burst(clientX, clientY) {
      const r = home.getBoundingClientRect();
      const x = clientX - r.left, y = clientY - r.top;
      const pts = riftPoints(st.t);
      const isNácar = x / st.w > xAt(pts, y / st.h);
      st.rings.push({ x, y, r: 4, a: 1, nacar: isNácar });
      for (let i = 0; i < 26; i++) {
        const a = Math.random() * Math.PI * 2, s = 1.5 + Math.random() * 4.5;
        st.sparks.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 1, life: 1, nacar: isNácar, r: 1 + Math.random() * 2 });
      }
      st.gearV += 0.8;
    }

    // Colores de cada ciudad: polvo dorado y destellos claros / vapor verde y esporas.
    const COL = {
      aurelia: ['255,214,140', '240,226,190'],
      nacar: ['150,255,170', '90,220,170'],
    };

    function draw(now) {
      st.t = now;
      const pts = riftPoints(now);
      // Recorte de Nácar: de la grieta hacia la derecha.
      const poly = pts.map(([x, y]) => `${(x * 100).toFixed(2)}% ${(y * 100).toFixed(2)}%`).join(',');
      nacar.style.clipPath = `polygon(${poly},100% 100%,100% 0%)`;
      if (!reduce) {
        const dx = (st.px - 0.5), dy = (st.py - 0.5);
        aur.firstElementChild.style.transform = `translate3d(${(-dx * 22).toFixed(1)}px,${(-dy * 14).toFixed(1)}px,0) scale(1.06)`;
        nacar.firstElementChild.style.transform = `translate3d(${(-dx * 34).toFixed(1)}px,${(-dy * 20).toFixed(1)}px,0) scale(1.08)`;
      }
      // Grieta: trazo principal y ramas.
      const line = pts.map(([x, y]) => `${(x * 1000).toFixed(1)},${(y * 1000).toFixed(1)}`).join(' ');
      const br = branches.map((b) => {
        const [x, y] = pts[b.i];
        return `M${(x * 1000).toFixed(1)} ${(y * 1000).toFixed(1)}l${(b.dir * b.len * 1000).toFixed(1)} ${(b.len * 600).toFixed(1)}l${(b.dir * b.len * 400).toFixed(1)} ${(b.len * 500).toFixed(1)}`;
      }).join('');
      rift.querySelectorAll('polyline').forEach((p) => p.setAttribute('points', line));
      rift.querySelectorAll('path').forEach((p) => p.setAttribute('d', br));
      rift.style.setProperty('--flick', (0.75 + Math.sin(now * 0.013) * 0.12 + Math.sin(now * 0.047) * 0.08).toFixed(3));

      // Rótulos: se ilumina la ciudad en la que está el cursor.
      const side = st.mx < xAt(pts, st.my) ? 'aurelia' : 'nacar';
      if (side !== st.side) {
        st.side = side;
        home.dataset.side = side;
        cities.forEach((c) => c.classList.toggle('on', c.dataset.city === side));
      }

      // Engranaje del título.
      st.gearA += st.gearV;
      st.gearV = lerp(st.gearV, 0.05, 0.04);
      if (gear) gear.style.transform = `rotate(${st.gearA.toFixed(1)}deg)`;

      if (!particlesOn) return;
      ctx.setTransform(st.dpr, 0, 0, st.dpr, 0, 0);
      ctx.clearRect(0, 0, st.w, st.h);
      const rx = (y) => xAt(pts, y / st.h) * st.w;

      // Luz de Aurelia: rayos de sol que bajan desde el cielo, solo a su lado de la grieta.
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, 0);
      pts.forEach(([x, y]) => ctx.lineTo(x * st.w, y * st.h));
      ctx.lineTo(0, st.h); ctx.closePath(); ctx.clip();
      ctx.globalCompositeOperation = 'screen';
      for (let i = 0; i < 4; i++) {
        const sx = st.w * (0.15 + i * 0.16) + Math.sin(now * 0.00018 + i) * 40;
        const g = ctx.createLinearGradient(sx, 0, sx + st.w * 0.12, st.h * 0.9);
        const a = 0.05 + 0.03 * Math.sin(now * 0.0004 + i * 1.7);
        g.addColorStop(0, `rgba(255,220,150,${a.toFixed(3)})`); g.addColorStop(1, 'rgba(255,220,150,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.moveTo(sx - 30, 0); ctx.lineTo(sx + 50, 0); ctx.lineTo(sx + st.w * 0.2, st.h); ctx.lineTo(sx + st.w * 0.05, st.h);
        ctx.fill();
      }
      ctx.restore();

      // Niebla de Nácar: bancos verdes que se arrastran por el fondo de la cueva.
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(st.w, 0);
      pts.forEach(([x, y]) => ctx.lineTo(x * st.w, y * st.h));
      ctx.lineTo(st.w, st.h); ctx.closePath(); ctx.clip();
      for (let i = 0; i < 5; i++) {
        const fx = ((now * 0.012 * (i % 2 ? 1 : -0.7) + i * 300) % (st.w + 600)) - 300;
        const fy = st.h * (0.7 + (i % 3) * 0.1);
        const rr = st.h * (0.28 + (i % 2) * 0.1);
        const g = ctx.createRadialGradient(fx, fy, 0, fx, fy, rr);
        g.addColorStop(0, `rgba(90,200,120,${i % 2 ? 0.1 : 0.07})`); g.addColorStop(1, 'rgba(60,140,90,0)');
        ctx.fillStyle = g;
        ctx.fillRect(fx - rr, fy - rr, rr * 2, rr * 2);
      }
      ctx.restore();

      ctx.globalCompositeOperation = 'lighter';
      for (const p of st.parts) {
        // El cursor aparta las motas como una corriente de aire.
        const ddx = p.x - st.cx, ddy = p.y - st.cy, d2 = ddx * ddx + ddy * ddy;
        if (d2 < 140 * 140 && d2 > 1) { const f = (1 - Math.sqrt(d2) / 140) * 0.6; p.vx += (ddx / Math.sqrt(d2)) * f; p.vy += (ddy / Math.sqrt(d2)) * f; }
        p.vx = lerp(p.vx, Math.sin(now * 0.0005 + p.ph) * 0.12, 0.03);
        p.vy = lerp(p.vy, -(0.2 + p.r * 0.12), 0.03);
        p.x += p.vx; p.y += p.vy;
        if (p.y < -12 || p.x < -20 || p.x > st.w + 20) Object.assign(p, spawn(false));
        const isZ = p.x > rx(p.y);
        const c = COL[isZ ? 'nacar' : 'aurelia'][p.kind > (isZ ? 0.82 : 0.75) ? 1 : 0];
        const tw = 0.45 + 0.4 * Math.sin(now * 0.003 + p.ph);
        const size = isZ ? p.r * 1.5 : p.r;
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size * 4);
        g.addColorStop(0, `rgba(${c},${(0.85 * tw).toFixed(3)})`); g.addColorStop(1, `rgba(${c},0)`);
        ctx.fillStyle = g;
        ctx.fillRect(p.x - size * 4, p.y - size * 4, size * 8, size * 8);
      }
      // Destellos al tocar: anillo de choque y chispas.
      st.rings = st.rings.filter((r) => r.a > 0.02);
      for (const r of st.rings) {
        r.r += 6; r.a *= 0.92;
        ctx.strokeStyle = `rgba(${COL[r.nacar ? 'nacar' : 'aurelia'][1]},${r.a.toFixed(3)})`;
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2); ctx.stroke();
      }
      st.sparks = st.sparks.filter((s) => s.life > 0.02);
      for (const s of st.sparks) {
        s.x += s.vx; s.y += s.vy; s.vx *= 0.95; s.vy = s.vy * 0.95 + (s.nacar ? -0.04 : 0.08); s.life *= 0.95;
        ctx.fillStyle = `rgba(${COL[s.nacar ? 'nacar' : 'aurelia'][s.r > 2 ? 0 : 1]},${s.life.toFixed(3)})`;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r * s.life + 0.4, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';
    }

    let raf = 0;
    function frame(now) {
      if (!home.isConnected) return stop();
      // Sin tocar nada un rato, la grieta respira sola de un lado a otro.
      if (now - st.lastInput > 4500) {
        st.target = 0.6 + Math.sin(now * 0.00025) * 0.16;
        st.mx = lerp(st.mx, 0.5, 0.01); st.my = lerp(st.my, 0.5, 0.01);
      }
      st.x = lerp(st.x, st.target, 0.07);
      st.px = lerp(st.px, st.mx, 0.05); st.py = lerp(st.py, st.my, 0.05);
      draw(now);
      raf = requestAnimationFrame(frame);
    }

    const onMove = (e) => input(e.clientX, e.clientY);
    const onDown = (e) => {
      if (e.target.closest('button, a, input, select')) return;
      input(e.clientX, e.clientY);
      if (!reduce) burst(e.clientX, e.clientY);
      window.Audio2?.sfx?.click();
    };
    const onLeave = () => { st.cx = -999; st.cy = -999; };
    // Al inclinar el móvil o la tableta, las dos ciudades se desplazan un poco.
    const onTilt = (e) => {
      if (e.gamma == null || performance.now() - st.lastInput < 3000) return;
      st.mx = clamp(0.5 + e.gamma / 60, 0, 1);
      st.my = clamp(0.5 + ((e.beta || 45) - 45) / 80, 0, 1);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(home);
    home.addEventListener('pointermove', onMove);
    home.addEventListener('pointerdown', onDown);
    home.addEventListener('pointerleave', onLeave);
    if (!reduce && window.U?.touch) window.addEventListener('deviceorientation', onTilt);
    cities.forEach((c) => c.addEventListener('click', () => {
      st.target = c.dataset.city === 'aurelia' ? 0.94 : 0.1;
      st.lastInput = performance.now();
      st.mx = st.target; st.my = 0.5;
      st.gearV += 1.2;
      if (reduce) { st.x = st.target; draw(performance.now()); }
    }));
    resize();
    if (reduce) draw(performance.now());
    else raf = requestAnimationFrame(frame);

    function stop() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('deviceorientation', onTilt);
    }
    return stop;
  }

  window.TitleFX = { mount, GEAR_SVG };
})();
