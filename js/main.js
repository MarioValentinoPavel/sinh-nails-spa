/* Sinh Nails Spa — configurador de uñas sobre una mano en SVG */
gsap.registerPlugin(ScrollTrigger);
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const NS = 'http://www.w3.org/2000/svg';

/* ---------- gota de esmalte que chorrea ---------- */
(function drip() {
  const path = $('#dripPath');
  const D = [80, 210, 330, 470, 600, 720, 860, 980, 1110].map(x => ({ x, r: 16 + Math.random() * 14, l: 0, max: 30 + Math.random() * 80 }));
  const build = base => {
    let d = `M0,0 H1200 V${base}`;
    [...D].reverse().forEach(p => { d += ` L${p.x + p.r},${base} C${p.x + p.r},${base + p.l} ${p.x - p.r},${base + p.l} ${p.x - p.r},${base}`; });
    return d + ` L0,${base} Z`;
  };
  const st = { base: 0 };
  path.setAttribute('d', build(0));
  gsap.timeline({ delay: .2 })
    .to(st, { base: 18, duration: .5, ease: 'power2.out', onUpdate: () => path.setAttribute('d', build(st.base)) })
    .to(D, { l: i => D[i].max, duration: 1.4, ease: 'power2.inOut', stagger: .06, onUpdate: () => path.setAttribute('d', build(st.base)) }, .2);
})();

/* ---------- opciones ---------- */
const OPT = {
  shape: ['Almendra', 'Stiletto', 'Cuadrada', 'Coffin', 'Redonda'],
  length: ['Corta', 'Media', 'Larga'],
  color: [['Rojo laca', '#d6232a'], ['Coral', '#ff6f61'], ['Nude', '#e9b8ae'], ['Rosa chicle', '#ff8fc4'], ['Fucsia', '#d6337f'], ['Burdeos', '#6d1a2c'], ['Lila', '#b39ddb'], ['Azul cielo', '#7fb8ff'], ['Azul noche', '#1f3a93'], ['Salvia', '#9cb89a'], ['Blanco', '#fbfbfb'], ['Negro', '#1b1b1f']],
  finish: ['Brillo', 'Mate', 'Cromado', 'Glitter'],
  design: ['Liso', 'Francesa', 'Baby boomer', 'Puntos', 'Flores 3D']
};
const S = { shape: 0, length: 1, color: 0, finish: 0, design: 0 };

/* ---------- mano ---------- */
const svg = $('#hand');
const FINGERS = [
  { x: 118, y: 318, a: -13, len: 118, w: 44 },
  { x: 170, y: 286, a: -5, len: 158, w: 50 },
  { x: 225, y: 278, a: 0, len: 176, w: 52 },
  { x: 280, y: 288, a: 6, len: 156, w: 50 },
  { x: 334, y: 392, a: 52, len: 116, w: 56 }
];
function nailPath(shape, w, L) {
  const h = w / 2, cut = `Q0,${w * .32} ${-h},0`;
  switch (shape) {
    case 1: return `M${-h},0 C${-h},${-L * .5} ${-w * .06},${-L * .92} 0,${-L * 1.12} C${w * .06},${-L * .92} ${h},${-L * .5} ${h},0 ${cut}Z`;
    case 2: return `M${-h},0 L${-h},${-L + 4} Q${-h},${-L} ${-h + 4},${-L} L${h - 4},${-L} Q${h},${-L} ${h},${-L + 4} L${h},0 ${cut}Z`;
    case 3: return `M${-h},0 L${-w * .32},${-L} L${w * .32},${-L} L${h},0 ${cut}Z`;
    case 4: return `M${-h},0 L${-h},${-L * .75} Q${-h},${-L} 0,${-L} Q${h},${-L} ${h},${-L * .75} L${h},0 ${cut}Z`;
    default: return `M${-h},0 C${-h},${-L * .62} ${-w * .22},${-L} 0,${-L} C${w * .22},${-L} ${h},${-L * .62} ${h},0 ${cut}Z`;
  }
}
const el = (t, a, p) => { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); p && p.appendChild(e); return e; };
function draw() {
  svg.innerHTML = '';
  const [cName, col] = OPT.color[S.color];
  const defs = el('defs', {}, svg);
  const skin = el('linearGradient', { id: 'skin', x1: 0, y1: 0, x2: 1, y2: 0 }, defs);
  el('stop', { offset: 0, 'stop-color': '#e9b995' }, skin); el('stop', { offset: .5, 'stop-color': '#f6d2b5' }, skin); el('stop', { offset: 1, 'stop-color': '#e3b08c' }, skin);
  const chrome = el('linearGradient', { id: 'chrome', x1: 0, y1: 0, x2: 1, y2: 1 }, defs);
  [[0, '#ffffff'], [.25, col], [.55, '#2a2a2e'], [.8, col], [1, '#ffffff']].forEach(([o, c]) => el('stop', { offset: o, 'stop-color': c }, chrome));
  const boom = el('linearGradient', { id: 'boom', x1: 0, y1: 1, x2: 0, y2: 0 }, defs);
  el('stop', { offset: .15, 'stop-color': '#f3d2c6' }, boom); el('stop', { offset: 1, 'stop-color': S.color === 2 ? '#ffffff' : col }, boom);
  const gl = el('pattern', { id: 'glit', width: 7, height: 7, patternUnits: 'userSpaceOnUse' }, defs);
  el('circle', { cx: 2, cy: 2, r: 1.1, fill: '#fff', opacity: .9 }, gl); el('circle', { cx: 5.5, cy: 5, r: .9, fill: '#ffe39a', opacity: .9 }, gl);
  // palma y muñeca
  el('path', { d: 'M92 318 C80 360 86 430 118 470 L130 520 H300 L312 468 C350 440 372 410 366 380 C350 330 320 300 280 290 L150 292 C120 296 100 300 92 318Z', fill: 'url(#skin)' }, svg);
  FINGERS.forEach((f, i) => {
    const g = el('g', { transform: `translate(${f.x},${f.y}) rotate(${f.a})` }, svg);
    el('rect', { x: -f.w / 2, y: -f.len, width: f.w, height: f.len + 40, rx: f.w / 2, fill: 'url(#skin)' }, g);
    el('path', { d: `M${-f.w * .25},${-f.len * .45} q${f.w * .25},-5 ${f.w * .5},0`, stroke: '#d9a07c', 'stroke-width': 2, fill: 'none', opacity: .6 }, g);
    const nw = f.w * .78, L = nw * [.85, 1.3, 1.9][S.length];
    const ng = el('g', { transform: `translate(0,${-f.len + f.w * .95})` }, g);
    const d = nailPath(S.shape, nw, L);
    el('clipPath', { id: 'c' + i }, defs).appendChild(el('path', { d }));
    let base = col;
    if (S.design === 1) base = '#f6d9cf';
    if (S.design === 2) base = 'url(#boom)';
    if (S.finish === 2 && S.design !== 1 && S.design !== 2) base = 'url(#chrome)';
    el('path', { d, fill: base, stroke: 'rgba(0,0,0,.12)', 'stroke-width': 1 }, ng);
    const cg = el('g', { 'clip-path': `url(#c${i})` }, ng);
    if (S.design === 1) el('path', { d: `M${-nw},${-L * .72} Q0,${-L * .52} ${nw},${-L * .72} L${nw},${-L * 1.3} L${-nw},${-L * 1.3}Z`, fill: col === '#e9b8ae' ? '#ffffff' : col }, cg);
    if (S.design === 3) for (let k = 0; k < 5; k++) el('circle', { cx: (k % 2 ? 1 : -1) * nw * .18, cy: -L * (.18 + k * .17), r: nw * .08, fill: S.color === 10 ? '#1b1b1f' : '#fff' }, cg);
    if (S.design === 4 && (i === 1 || i === 3)) {
      const cy = -L * .5;
      for (let k = 0; k < 5; k++) { const a = k / 5 * Math.PI * 2; el('circle', { cx: Math.cos(a) * nw * .16, cy: cy + Math.sin(a) * nw * .16, r: nw * .12, fill: '#fff', stroke: 'rgba(0,0,0,.15)' }, cg); }
      el('circle', { cx: 0, cy, r: nw * .08, fill: '#ffd15c' }, cg);
      el('circle', { cx: nw * .2, cy: -L * .82, r: nw * .07, fill: '#fff', opacity: .9 }, cg);
    }
    if (S.finish === 3) el('path', { d, fill: 'url(#glit)', opacity: .8 }, cg);
    if (S.finish !== 1) el('ellipse', { cx: -nw * .18, cy: -L * .5, rx: nw * .09, ry: L * .28, fill: '#fff', opacity: S.finish === 2 ? .6 : .38 }, cg);
    if (S.finish === 1) el('path', { d, fill: '#000', opacity: .06 }, cg);
  });
  const txt = `${OPT.shape[S.shape]} · ${OPT.length[S.length]} · ${cName} · ${OPT.finish[S.finish]} · ${OPT.design[S.design]}`;
  $('#summary').textContent = txt;
  $('#book').href = 'https://wa.me/34612578426?text=' + encodeURIComponent(`Hola Sinh Nails, quiero estas uñas: ${txt}. ¿Cuándo puedo pasar?`);
}

/* ---------- controles ---------- */
function chips(id, list) {
  const box = $('#' + id);
  box.innerHTML = list.map((v, i) => `<button class="${i === S[id] ? 'is-on' : ''}" data-i="${i}">${v}</button>`).join('');
  box.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; S[id] = +b.dataset.i; $$('button', box).forEach(x => x.classList.toggle('is-on', x === b)); draw(); bounce(); });
}
['shape', 'length', 'finish', 'design'].forEach(k => chips(k, OPT[k]));
(function colors() {
  const box = $('#color');
  box.innerHTML = OPT.color.map(([n, c], i) => `<button class="${i === S.color ? 'is-on' : ''}" data-i="${i}" style="background:${c}" aria-label="${n}" title="${n}"></button>`).join('');
  box.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; S.color = +b.dataset.i; $$('button', box).forEach(x => x.classList.toggle('is-on', x === b)); draw(); bounce(); });
})();
function bounce() { gsap.fromTo('#hand', { scale: .97 }, { scale: 1, duration: .5, ease: 'back.out(3)', transformOrigin: '50% 60%' }); }
draw();
gsap.from('#hand', { y: 80, opacity: 0, duration: 1.2, ease: 'expo.out', delay: .6 });
gsap.from('.app__panel > *', { x: 40, opacity: 0, duration: 1, ease: 'expo.out', stagger: .06, delay: .4 });

/* ---------- apariciones ---------- */
$$('.head, .insp__grid img, .rev blockquote, .visit > *').forEach(n => gsap.from(n, { y: 40, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: n, start: 'top 90%' } }));
