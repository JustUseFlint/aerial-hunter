/* Aerial Hunter — interactive tools: palette switcher, county map, conditions check */
(function () {
  'use strict';
  var d = document, $ = function (s, c) { return (c || d).querySelector(s); }, $$ = function (s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); };
  var G = window.gsap, RM = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Palette switcher */
  $$('[data-palette]').forEach(function (p) {
    var stage = $('.pal-stage', p), name = $('[data-pal-name]', p), note = $('[data-pal-note]', p), chips = $$('[data-pal]', p);
    var place = function () { if (!window.ahCoverPt) return; var c = window.ahCoverPt(stage, 1280, 720, +stage.dataset.tx, +stage.dataset.ty); stage.style.setProperty('--tx', c.x + 'px'); stage.style.setProperty('--ty', c.y + 'px'); };
    place(); addEventListener('resize', place); addEventListener('load', place);
    var info = {
      white: ['IR · WHITE HOT', 'White hot: warm things show white. Easiest to read for most people.'],
      black: ['IR · BLACK HOT', 'Black hot: the same data, inverted. Some pilots prefer it against bright, cluttered ground.'],
      iron: ['IR · IRONBOW', 'Ironbow: colors map to temperature, so the warmest spots stand out in yellow and white.'],
      eye: ['VISIBLE · NIGHT', 'Naked eye: the same scene with no thermal. The deer is still there; you just can’t see it.']
    };
    chips.forEach(function (c) { c.addEventListener('click', function () {
      chips.forEach(function (x) { x.classList.toggle('on', x === c); x.setAttribute('aria-pressed', x === c); });
      stage.dataset.mode = c.dataset.pal; name.textContent = info[c.dataset.pal][0]; note.textContent = info[c.dataset.pal][1];
      if (G && !RM) G.fromTo(stage, { scale: 0.985 }, { scale: 1, duration: 0.8, ease: 'expo.out' });
    }); });
  });

  /* County map */
  $$('[data-map]').forEach(function (m) {
    var btns = $$('.cty-b', m), groups = $$('.cty', m), info = $('[data-map-info]', m);
    var k = $('[data-mi-k]', info), h = $('[data-mi-h]', info), s = $('[data-mi-s]', info), p = $('[data-mi-p]', info);
    function sel(id) {
      var b = btns.filter(function (x) { return x.dataset.c === id; })[0]; if (!b) return;
      btns.forEach(function (x) { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); });
      groups.forEach(function (g) { g.classList.toggle('sel', g.dataset.c === id); });
      k.textContent = b.dataset.home === '1' ? 'Home county' : 'Surrounding county';
      h.textContent = b.dataset.name + ' County'; s.textContent = 'County seat · ' + b.dataset.seat; p.textContent = b.dataset.note;
      if (G && !RM) G.fromTo(info.children, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, ease: 'expo.out', stagger: 0.04 });
    }
    btns.forEach(function (b) { b.addEventListener('click', function () { sel(b.dataset.c); }); b.addEventListener('mouseenter', function () { groups.forEach(function (g) { g.classList.toggle('sel', g.dataset.c === b.dataset.c); }); }); });
    groups.forEach(function (g) {
      g.addEventListener('click', function () { sel(g.dataset.c); });
      g.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); sel(g.dataset.c); } });
    });
    sel('parke');
  });

  /* Conditions check (rough, qualitative guide) */
  $$('[data-conditions]').forEach(function (c) {
    var gauge = $('[data-gauge]', c), gv = $('[data-g-v]', c), t = $('[data-cond-t]', c), why = $('[data-cond-why]', c);
    var notes = {
      temp: ['Cold air gives strong heat contrast.', 'Cool air gives good heat contrast.', 'Mild air: contrast is fair, best after dark.', 'Hot weather washes out contrast. Night is the only real window.'],
      wind: ['Calm air: steady flying.', 'A breeze is fine.', 'Gusts make flying harder and can cool the ground unevenly.', 'Strong wind may keep the drone on the ground.'],
      sky: ['Dry and clear.', 'Fog scatters heat and limits visibility.', 'Drizzle cools surfaces and can ground the flight.', 'No flying in rain.'],
      cover: ['Open ground: easiest to search.', 'Leafless timber lets heat show through the gaps.', 'Leaves on the trees can hide what’s under them.', 'Pines and cedar can hide an animal completely.']
    };
    var pen = { temp: [0, 0, 1, 2], wind: [0, 0, 1, 3], sky: [0, 2, 3, 4], cover: [0, 0, 1, 2] };
    function run() {
      var score = 0, list = [];
      ['temp', 'wind', 'sky', 'cover'].forEach(function (k) { var v = +((c.querySelector('input[name=c-' + k + ']:checked') || {}).value || 0); score += pen[k][v]; list.push(notes[k][v]); });
      var lvl = score <= 1 ? 'hi' : score <= 3 ? 'mid' : 'low';
      gauge.dataset.level = lvl;
      gauge.style.setProperty('--g', lvl === 'hi' ? 8 : lvl === 'mid' ? 45 : 80);
      gv.textContent = lvl === 'hi' ? 'Good' : lvl === 'mid' ? 'Fair' : 'Poor';
      t.textContent = lvl === 'hi' ? 'Good conditions for a thermal search.' : lvl === 'mid' ? 'Workable, with limits. Worth a call to talk it through.' : 'Tough conditions. Call and we’ll tell you honestly whether a flight makes sense.';
      why.innerHTML = list.map(function (x) { return '<li>' + x + '</li>'; }).join('');
    }
    c.addEventListener('change', run); run();
  });
})();
