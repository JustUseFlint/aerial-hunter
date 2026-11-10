/* Aerial Hunter — motion & interaction system (GSAP + ScrollTrigger + Lenis) */
(function () {
  'use strict';
  var d = document, H = d.documentElement, W = window;
  var RM = W.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var FINE = W.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var hasG = !!(W.gsap && W.ScrollTrigger);
  var motion = !RM && hasG;
  var $ = function (s, c) { return (c || d).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); };
  var lenis = null;
  W.__ahReady = true;
  H.classList.toggle('motion', motion);
  H.classList.toggle('no-motion', !motion);
  if (hasG) gsap.registerPlugin(ScrollTrigger);

  // maps a fractional point in an object-fit:cover image to px inside its box
  function coverPt(box, iw, ih, tx, ty, im) {
    var w = box.clientWidth, h = box.clientHeight, s = Math.max(w / iw, h / ih), dw = iw * s, dh = ih * s, ox = 0.5, oy = 0.5;
    if (im) { var op = getComputedStyle(im).objectPosition.split(' '); ox = parseFloat(op[0]) / 100; oy = parseFloat(op[1]) / 100; if (isNaN(ox)) ox = 0.5; if (isNaN(oy)) oy = 0.5; }
    return { x: (w - dw) * ox + tx * dw, y: (h - dh) * oy + ty * dh, s: s };
  }
  W.ahCoverPt = coverPt;

  /* ---------- Smooth scroll ---------- */
  if (motion && W.Lenis) {
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  }
  W.ahLenis = lenis;

  /* ---------- Page transitions ---------- */
  var pt = $('.pt');
  var entering = H.classList.contains('pt-in');
  if (motion && pt) {
    if (entering) { gsap.set(pt, { yPercent: 0 }); H.classList.remove('pt-in'); gsap.to(pt, { yPercent: -100, duration: 0.9, ease: 'expo.inOut', delay: 0.15, onComplete: function () { gsap.set(pt, { yPercent: 100 }); } }); }
    else gsap.set(pt, { yPercent: 100 });
  }
  H.classList.remove('pt-in'); try { sessionStorage.removeItem('ah-pt'); } catch (e) {}
  function leave(href) {
    try { sessionStorage.setItem('ah-pt', '1'); } catch (e) {}
    if (!motion || !pt) { location.href = href; return; }
    closeMenu();
    gsap.fromTo(pt, { yPercent: 100 }, { yPercent: 0, duration: 0.65, ease: 'expo.inOut', onComplete: function () { location.href = href; } });
  }
  d.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if ((a.target && a.target !== '_self') || a.hasAttribute('download')) return;
    var href = a.getAttribute('href');
    if (/^(tel|sms|mailto):/.test(href)) return;
    var url = new URL(href, location.href);
    if (url.origin !== location.origin) return;
    if (url.pathname === location.pathname && url.search === location.search) {
      if (url.hash) {
        var t = url.hash === '#top' ? 0 : d.getElementById(url.hash.slice(1));
        if (t !== null) { e.preventDefault(); if (lenis) lenis.scrollTo(t, { duration: 1.4 }); else W.scrollTo({ top: t === 0 ? 0 : t.getBoundingClientRect().top + scrollY, behavior: RM ? 'auto' : 'smooth' }); }
        return;
      }
      e.preventDefault(); closeMenu(); return;
    }
    e.preventDefault(); leave(url.href);
  });
  W.addEventListener('pageshow', function (e) { if (e.persisted && hasG && pt) gsap.set(pt, { yPercent: 100 }); H.classList.remove('pt-in'); });

  /* ---------- Header + call bar ---------- */
  var hdr = $('[data-hdr]'), cb = $('.callbar'), lastY = scrollY, isContact = !!$('[data-contact]');
  function onScroll() {
    var y = scrollY;
    if (hdr) {
      hdr.classList.toggle('is-scrolled', y > 40);
      if (!H.classList.contains('menu-open')) {
        if (y > lastY + 6 && y > 320) hdr.classList.add('is-hidden');
        else if (y < lastY - 6 || y < 200) hdr.classList.remove('is-hidden');
      }
    }
    if (cb) cb.classList.toggle('on', !isContact && y > innerHeight * 0.55);
    lastY = y;
  }
  W.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* ---------- Mobile menu ---------- */
  var mb = $('[data-menu-btn]'), menu = $('[data-menu]');
  function closeMenu() { if (!H.classList.contains('menu-open')) return; H.classList.remove('menu-open'); mb && mb.setAttribute('aria-expanded', 'false'); menu && menu.setAttribute('aria-hidden', 'true'); if (lenis) lenis.start(); d.body.style.overflow = ''; }
  if (mb) mb.addEventListener('click', function () {
    if (H.classList.contains('menu-open')) return closeMenu();
    H.classList.add('menu-open'); mb.setAttribute('aria-expanded', 'true'); menu.setAttribute('aria-hidden', 'false');
    if (lenis) lenis.stop(); d.body.style.overflow = 'hidden';
  });
  d.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

  /* ---------- Interactions that work without GSAP ---------- */
  // Checklists (remember ticks per page)
  $$('[data-checklist]').forEach(function (ol) {
    var key = 'ah-chk-' + ol.dataset.checklist, boxes = $$('input', ol), out = $('[data-chk-count]', ol.parentNode);
    var saved = []; try { saved = JSON.parse(localStorage.getItem(key) || '[]'); } catch (e) {}
    boxes.forEach(function (b, i) { b.checked = saved.indexOf(i) > -1; });
    var upd = function () {
      var on = boxes.map(function (b, i) { return b.checked ? i : -1; }).filter(function (i) { return i > -1; });
      if (out) out.textContent = on.length === boxes.length ? 'All done. Call now.' : on.length + ' / ' + boxes.length + ' done';
      try { localStorage.setItem(key, JSON.stringify(on)); } catch (e) {}
    };
    ol.addEventListener('change', upd); upd();
  });
  // FAQ filter
  var ff = $('[data-faq-filter]');
  if (ff) {
    var chips = $$('.chip', ff);
    chips.forEach(function (c) { c.addEventListener('click', function () {
      chips.forEach(function (x) { x.classList.toggle('on', x === c); x.setAttribute('aria-pressed', x === c); });
      var f = c.dataset.f, shown = [];
      $$('.faq-list .acc').forEach(function (a) { var ok = f === 'all' || a.dataset.cat === f; a.hidden = !ok; if (ok) shown.push(a); });
      if (motion) gsap.fromTo(shown, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out', stagger: 0.04 });
      if (hasG) ScrollTrigger.refresh();
    }); });
  }
  $$('details.acc').forEach(function (dt) { dt.addEventListener('toggle', function () { if (hasG) setTimeout(function () { ScrollTrigger.refresh(); }, 650); }); });

  // Gallery lightbox
  (function () {
    var grid = $('[data-gallery]');
    var lb = $('[data-lightbox]');
    if (!grid || !lb) return;
    if (lb.parentNode !== d.body) d.body.appendChild(lb);
    var items = $$('[data-gallery] .gal-btn');
    if (!items.length) return;
    var img = $('[data-lb-img]', lb);
    var i = 0, open = false, last = null;
    var show = function (n) {
      i = (n + items.length) % items.length;
      var el = items[i];
      var alt = el.getAttribute('data-alt') || '';
      var webp = el.getAttribute('data-full-webp');
      var jpg = el.getAttribute('data-full-jpg');
      img.alt = alt;
      lb.setAttribute('aria-label', alt || 'Recovery photo');
      if (webp && img.src !== new URL(webp, location.href).href) {
        img.src = webp;
        img.onerror = function () { if (jpg) img.src = jpg; img.onerror = null; };
      } else if (jpg) img.src = jpg;
      // preload neighbors
      [i - 1, i + 1].forEach(function (k) {
        var nb = items[(k + items.length) % items.length];
        var src = nb.getAttribute('data-full-webp') || nb.getAttribute('data-full-jpg');
        if (src) { var pre = new Image(); pre.src = src; }
      });
    };
    var lock = function (on) {
      if (on) {
        if (lenis) lenis.stop();
        d.body.style.overflow = 'hidden';
      } else {
        if (lenis) lenis.start();
        d.body.style.overflow = '';
      }
    };
    var openAt = function (n, from) {
      last = from || d.activeElement;
      show(n);
      lb.hidden = false;
      open = true;
      H.classList.add('lb-open');
      lock(true);
      var closeBtn = $('[data-lb-close]:not(.lb-scrim)', lb) || $('[data-lb-close]', lb);
      if (closeBtn) closeBtn.focus();
    };
    var close = function () {
      if (!open) return;
      lb.hidden = true;
      open = false;
      H.classList.remove('lb-open');
      lock(false);
      if (last && last.focus) last.focus();
      last = null;
    };
    items.forEach(function (el, n) {
      el.addEventListener('click', function () { openAt(n, el); });
    });
    lb.addEventListener('click', function (e) {
      if (e.target.closest('[data-lb-close]')) { e.preventDefault(); close(); }
      else if (e.target.closest('[data-lb-prev]')) { e.preventDefault(); show(i - 1); }
      else if (e.target.closest('[data-lb-next]')) { e.preventDefault(); show(i + 1); }
    });
    d.addEventListener('keydown', function (e) {
      if (!open) return;
      if (e.key === 'Escape') { e.preventDefault(); close(); return; }
      if (e.key === 'ArrowRight') { e.preventDefault(); show(i + 1); return; }
      if (e.key === 'ArrowLeft') { e.preventDefault(); show(i - 1); return; }
      if (e.key === 'Tab') {
        var fs = $$('button', lb).filter(function (b) { return b.getAttribute('tabindex') !== '-1'; });
        if (!fs.length) return;
        var first = fs[0], lastB = fs[fs.length - 1], cur = d.activeElement;
        if (e.shiftKey && (cur === first || !lb.contains(cur))) { e.preventDefault(); lastB.focus(); }
        else if (!e.shiftKey && (cur === lastB || !lb.contains(cur))) { e.preventDefault(); first.focus(); }
      }
    });
    var sx = 0, sy = 0, tracking = false;
    lb.addEventListener('touchstart', function (e) {
      if (!e.changedTouches || !e.changedTouches.length) return;
      sx = e.changedTouches[0].clientX; sy = e.changedTouches[0].clientY; tracking = true;
    }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      if (!tracking || !e.changedTouches || !e.changedTouches.length) return;
      tracking = false;
      var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.2) { if (dx < 0) show(i + 1); else show(i - 1); }
    }, { passive: true });
  })();


  /* ---------- Hero thermal scan ---------- */
  var hm = $('[data-scan]');
  var placeHero = function () {};
  if (hm) {
    var irImg = $('.hm-ir', hm), lock = $('[data-lock]', hm), scanTxt = $('[data-hud-scan]', hm);
    var tx = +hm.dataset.tx, ty = +hm.dataset.ty, tgt = { x: 0, y: 0 };
    placeHero = function () {
      var p = coverPt(hm, 1280, 720, tx, ty, irImg); tgt = p;
      hm.style.setProperty('--tx', p.x + 'px'); hm.style.setProperty('--ty', p.y + 'px');
      if (lock) { var hb = lock.parentNode.getBoundingClientRect(), mb = hm.getBoundingClientRect(); lock.style.left = (p.x - (hb.left - mb.left)) + 'px'; lock.style.top = (p.y - (hb.top - mb.top)) + 'px'; lock.style.setProperty('--ls', p.s); }
    };
    placeHero(); W.addEventListener('resize', placeHero);
    if (!motion) { if (lock) lock.classList.add('on'); if (scanTxt) scanTxt.textContent = '1 SIGNATURE'; }
    else {
      var st = { sy: -30, lr: 0 }, locked = false;
      var apply = function () { hm.style.setProperty('--sy', st.sy + '%'); hm.style.setProperty('--lr', st.lr + 'px'); };
      var sweep = function () {
        gsap.fromTo(st, { sy: -8 }, { sy: 130, duration: 3.6, ease: 'none', onUpdate: function () {
          apply();
          var yPct = tgt.y / hm.clientHeight * 100;
          if (!locked && st.sy > yPct + 2) { locked = true; lock.classList.add('on'); if (scanTxt) scanTxt.textContent = '1 SIGNATURE'; gsap.to(st, { lr: Math.max(90, 150 * tgt.s), duration: 1.1, ease: 'expo.out', onUpdate: apply }); }
        }, onComplete: function () { gsap.delayedCall(5.5, sweep); } });
      };
      gsap.delayedCall(entering ? 1.1 : 0.7, sweep);
      // cursor lens
      if (FINE) {
        var lens = { r: 0 };
        hm.parentNode.addEventListener('pointermove', function (e) { var r = hm.getBoundingClientRect(); hm.style.setProperty('--mx', (e.clientX - r.left) + 'px'); hm.style.setProperty('--my', (e.clientY - r.top) + 'px'); });
        hm.parentNode.addEventListener('pointerenter', function () { gsap.to(lens, { r: 150, duration: 0.8, ease: 'expo.out', onUpdate: function () { hm.style.setProperty('--mr', lens.r + 'px'); } }); });
        hm.parentNode.addEventListener('pointerleave', function () { gsap.to(lens, { r: 0, duration: 0.6, ease: 'power2.in', onUpdate: function () { hm.style.setProperty('--mr', lens.r + 'px'); } }); });
      }
      // gentle parallax out
      gsap.to(hm, { yPercent: 12, ease: 'none', scrollTrigger: { trigger: hm.parentNode, start: 'top top', end: 'bottom top', scrub: true } });
    }
  }

  /* ---------- Compare (eye vs thermal) ---------- */
  $$('[data-compare]').forEach(function (sec) {
    var stg = $('.cmp-stage', sec), tx = +stg.dataset.tx, ty = +stg.dataset.ty;
    var place = function () { var p = coverPt(stg, 1280, 720, tx, ty); stg.style.setProperty('--tx', p.x + 'px'); stg.style.setProperty('--ty', p.y + 'px'); return p; };
    var p0 = place(); W.addEventListener('resize', place);
    stg.style.setProperty('--p', '100%');
    if (!motion) { stg.style.setProperty('--p', '50%'); sec.classList.add('found'); return; }
    var o = { p: 100 };
    gsap.to(o, { p: 0, ease: 'none', scrollTrigger: { trigger: sec, start: 'top top', end: '+=140%', pin: $('.cmp-pin', sec), scrub: 0.5, anticipatePin: 1,
      onUpdate: function () { stg.style.setProperty('--p', o.p + '%'); var px = (stg.clientWidth * o.p / 100); sec.classList.toggle('found', px < place().x - 30); } } });
  });

  if (!motion) return;

  /* ================= GSAP motion ================= */
  var ease = 'expo.out';
  var SP = /[ \t\n\r]+/;
  function splitWords(el) {
    if (el._words) return el._words;
    var frag = d.createDocumentFragment(), words = [];
    var add = function (node) { var s = d.createElement('span'); s.className = 'w'; s.appendChild(node); frag.appendChild(s); words.push(s); };
    Array.prototype.slice.call(el.childNodes).forEach(function (n) {
      if (n.nodeType === 3) {
        n.textContent.split(/([ \t\n\r]+)/).forEach(function (p) { if (!p) return; if (SP.test(p) && !p.replace(SP, '')) frag.appendChild(d.createTextNode(' ')); else add(d.createTextNode(p)); });
      } else if (n.nodeType === 1) {
        if (n.tagName === 'BR') { frag.appendChild(n); return; }
        var txt = n.textContent.trim();
        if (!n.children.length && SP.test(txt)) {
          txt.split(SP).forEach(function (wd, k, arr) { var c = n.cloneNode(false); c.textContent = wd; add(c); if (k < arr.length - 1) frag.appendChild(d.createTextNode(' ')); });
        } else add(n);
      }
    });
    el.innerHTML = ''; el.appendChild(frag); el._words = words; return words;
  }
  function splitLines(el) {
    el._orig = el.innerHTML;
    var words = splitWords(el), lines = [], top = null;
    words.forEach(function (w) { var t = w.offsetTop; if (top === null || Math.abs(t - top) > 4) { lines.push([]); top = t; } lines[lines.length - 1].push(w); });
    el.innerHTML = '';
    var inners = lines.map(function (ws) {
      var ln = d.createElement('span'); ln.className = 'ln'; var inn = d.createElement('span');
      ws.forEach(function (w, k) { inn.appendChild(w); if (k < ws.length - 1) inn.appendChild(d.createTextNode(' ')); });
      ln.appendChild(inn); el.appendChild(ln); return inn;
    });
    el._words = null;
    return inners;
  }
  function revealSplit(el, delay) {
    var inners = splitLines(el);
    el.classList.add('is-split');
    gsap.fromTo(inners, { yPercent: 115, rotate: 1.5 }, { yPercent: 0, rotate: 0, duration: 1.25, ease: ease, stagger: 0.085, delay: delay || 0, onComplete: function () { el.innerHTML = el._orig; } });
  }
  var fontsReady = (d.fonts && d.fonts.ready) ? Promise.race([d.fonts.ready, new Promise(function (r) { setTimeout(r, 1800); })]) : Promise.resolve();

  fontsReady.then(function () {
    var heroDelay = entering ? 0.55 : 0.15;
    $$('[data-split]').forEach(function (el) {
      if (el.dataset.split === 'hero') { revealSplit(el, heroDelay); return; }
      ScrollTrigger.create({ trigger: el, start: 'top 88%', once: true, onEnter: function () { revealSplit(el); } });
    });
    $$('[data-fade]').forEach(function (el, i) {
      gsap.fromTo(el, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1.1, ease: ease, delay: el.closest('.hero,.phero,.csh-full,.csh-type,.ct') ? heroDelay + 0.35 + (i % 4) * 0.08 : 0, scrollTrigger: { trigger: el, start: 'top 94%', once: true } });
    });
    ScrollTrigger.batch('[data-reveal]', { start: 'top 92%', once: true, onEnter: function (b) { gsap.fromTo(b, { opacity: 0, y: 36 }, { opacity: 1, y: 0, duration: 1.1, ease: ease, stagger: 0.07, overwrite: true }); } });
    $$('[data-focus]').forEach(function (el) {
      var ws = splitWords(el);
      gsap.fromTo(ws, { opacity: 0.18 }, { opacity: 1, ease: 'none', stagger: 0.1, scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 50%', scrub: true } });
    });
    placeHero();
    setTimeout(function () { ScrollTrigger.refresh(); }, 60);
  });

  // image clip reveal
  $$('[data-img-reveal]').forEach(function (el) {
    var im = $('img', el);
    gsap.set(el, { clipPath: 'inset(100% 0% 0% 0%)' });
    ScrollTrigger.create({ trigger: el, start: 'top 92%', once: true, onEnter: function () {
      gsap.to(el, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.inOut' });
      if (im) gsap.fromTo(im, { scale: 1.35 }, { scale: 1, duration: 1.8, ease: ease, clearProps: 'transform' });
    } });
  });

  // counters
  $$('[data-count]').forEach(function (el) {
    var v = parseFloat(el.dataset.count);
    var fmt = function (x) { return Math.round(x).toLocaleString('en-US'); };
    var o = { x: 0 }; el.textContent = fmt(0);
    ScrollTrigger.create({ trigger: el, start: 'top 92%', once: true, onEnter: function () { gsap.to(o, { x: v, duration: 2, ease: 'power3.out', onUpdate: function () { el.textContent = fmt(o.x); } }); } });
  });

  // marquee driven by scroll velocity
  $$('[data-marquee]').forEach(function (m) {
    var tr = $('.mq-track', m); tr.innerHTML += tr.innerHTML;
    var x = 0, vis = false, boost = 0;
    new IntersectionObserver(function (e) { vis = e[0].isIntersecting; }).observe(m);
    gsap.ticker.add(function () {
      if (!vis) return;
      var w = tr.scrollWidth / 2; if (!w) return;
      var v = lenis ? lenis.velocity : 0; boost += (Math.abs(v) * 0.35 - boost) * 0.1;
      var sd = lenis && lenis.direction ? lenis.direction : 1;
      x -= (0.6 + boost) * sd;
      x = gsap.utils.wrap(-w, 0, x);
      tr.style.transform = 'translate3d(' + x + 'px,0,0)';
    });
  });

  // magnetic elements
  if (FINE) $$('[data-magnetic]').forEach(function (el) {
    var s = parseFloat(el.dataset.strength || 0.3), inner = el.firstElementChild;
    el.addEventListener('pointermove', function (e) { var r = el.getBoundingClientRect(); var x = (e.clientX - r.left - r.width / 2) * s, y = (e.clientY - r.top - r.height / 2) * s; gsap.to(el, { x: x, y: y, duration: 0.6, ease: 'power3.out' }); if (inner) gsap.to(inner, { x: x * 0.35, y: y * 0.35, duration: 0.6, ease: 'power3.out' }); });
    el.addEventListener('pointerleave', function () { gsap.to(inner ? [el, inner] : el, { x: 0, y: 0, duration: 1.1, ease: 'elastic.out(1,0.35)' }); });
  });

  // reticle cursor
  if (FINE) {
    H.classList.add('has-cursor');
    var cur = $('.cursor'), ct = $('.cursor-t', cur);
    var cx = gsap.quickTo(cur, 'x', { duration: 0.3, ease: 'power3' }), cy = gsap.quickTo(cur, 'y', { duration: 0.3, ease: 'power3' }), seen = false;
    cur.classList.add('is-hidden');
    W.addEventListener('pointermove', function (e) { if (!seen) { seen = true; gsap.set(cur, { x: e.clientX, y: e.clientY }); cur.classList.remove('is-hidden'); } cx(e.clientX); cy(e.clientY); }, { passive: true });
    d.addEventListener('pointerover', function (e) {
      var t = e.target.closest ? e.target.closest('[data-cursor]') : null;
      if (t) { ct.textContent = t.dataset.cursor; cur.classList.add('is-label'); } else cur.classList.remove('is-label');
    });
    d.addEventListener('pointerleave', function () { cur.classList.add('is-hidden'); });
    d.addEventListener('pointerenter', function () { cur.classList.remove('is-hidden'); });
  }

  // stacking cards
  var cards = $$('[data-stack] .stack-card');
  cards.forEach(function (c, i) {
    if (i === cards.length - 1) return;
    gsap.to(c, { scale: 0.94, opacity: 0.55, ease: 'none', scrollTrigger: { trigger: cards[i + 1], start: 'top bottom', end: 'top 20%', scrub: true } });
  });

  // expanding media frames
  $$('[data-expand]').forEach(function (el) {
    var f = $('.reel-frame', el); if (!f) return;
    var im = $('img', f);
    var ins = function () { return innerWidth >= 900 ? innerWidth * 0.14 + 'px' : Math.max(16, innerWidth * 0.04) + 'px'; };
    gsap.fromTo(f, { clipPath: function () { return 'inset(6% ' + ins() + ' 6% ' + ins() + ' round 10px)'; } }, { clipPath: 'inset(0% 0px 0% 0px round 10px)', ease: 'none', scrollTrigger: { trigger: f, start: 'top 90%', end: 'center 55%', scrub: true, invalidateOnRefresh: true } });
    if (im) gsap.fromTo(im, { scale: 1.25 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: f, start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  // hero parallax (service pages)
  $$('[data-hero-media]').forEach(function (m) {
    var im = $('img', m);
    gsap.fromTo(im, { scale: 1.18 }, { scale: 1.04, duration: 2.2, ease: ease });
    gsap.to(m, { yPercent: 20, ease: 'none', scrollTrigger: { trigger: m.parentNode, start: 'top top', end: 'bottom top', scrub: true } });
  });
  $$('[data-window]').forEach(function (w) {
    var inr = $('.cw-in', w), im = $('img', w);
    gsap.fromTo(inr, { clipPath: function () { return innerWidth >= 900 ? 'inset(14% 26% 14% 26% round 10px)' : 'inset(10% 10% 10% 10% round 10px)'; } }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none', scrollTrigger: { trigger: w, start: 'top 85%', end: 'bottom bottom', scrub: true, invalidateOnRefresh: true } });
    gsap.fromTo(im, { scale: 1.3 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: w, start: 'top bottom', end: 'bottom bottom', scrub: true } });
  });

  // zoom-through word
  $$('[data-zoom]').forEach(function (z) {
    var w = $('.cz-w', z);
    var tl = gsap.timeline({ scrollTrigger: { trigger: z, start: 'top top', end: '+=110%', pin: true, scrub: 0.6, anticipatePin: 1 } });
    gsap.fromTo(w, { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, ease: 'power2.out', scrollTrigger: { trigger: z, start: 'top 85%', end: 'top 20%', scrub: 0.6 } });
    tl.to(w, { scale: 1.08, duration: 0.3, ease: 'none' }).to(w, { scale: 16, opacity: 0, ease: 'power2.in', duration: 0.7 });
  });

  // chapters with sticky media (desktop)
  var mm = gsap.matchMedia();
  $$('[data-chapters]').forEach(function (sec) {
    var chs = $$('.cc-ch', sec), plates = $$('.cc-plate', sec);
    var set = function (k) { chs.forEach(function (c, j) { c.classList.toggle('on', j === k); }); plates.forEach(function (p, j) { p.classList.toggle('on', j <= k); }); };
    mm.add('(min-width: 900px)', function () {
      set(0);
      chs.forEach(function (c, k) { ScrollTrigger.create({ trigger: c, start: 'top 55%', end: 'bottom 55%', onToggle: function (s) { if (s.isActive) set(k); } }); });
    });
  });

  // horizontal timeline
  $$('[data-hscroll]').forEach(function (sec) {
    var track = $('.tl-track', sec), steps = $$('.tl-step', sec), bar = $('[data-tl-progress]', sec);
    mm.add('(min-width: 900px)', function () {
      var dist = function () { return Math.max(0, track.scrollWidth - innerWidth); };
      gsap.to(track, { x: function () { return -dist(); }, ease: 'none', scrollTrigger: { trigger: sec, start: 'top top', end: function () { return '+=' + dist(); }, pin: true, scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1,
        onUpdate: function (s) { if (bar) bar.style.transform = 'scaleX(' + s.progress + ')'; var k = s.progress * (steps.length - 1) + 0.35; steps.forEach(function (st, j) { st.classList.toggle('on', j <= k); }); } } });
    });
    mm.add('(max-width: 899px)', function () {
      steps.forEach(function (st) { ScrollTrigger.create({ trigger: st, start: 'top 75%', onEnter: function () { st.classList.add('on'); }, onLeaveBack: function () { st.classList.remove('on'); } }); gsap.fromTo(st, { opacity: 0, x: 24 }, { opacity: 1, x: 0, duration: 1, ease: ease, scrollTrigger: { trigger: st, start: 'top 88%', once: true } }); });
    });
  });

  // process rail
  $$('[data-process]').forEach(function (p) {
    var ol = $('.proc', p), line = $('.proc-line', p), fill = $('[data-proc-line]', p), steps = $$('.proc-s', p);
    var place = function () { if (line && ol) line.style.setProperty('--pl-top', (ol.offsetTop + 10) + 'px'); };
    place(); ScrollTrigger.addEventListener('refreshInit', place);
    ScrollTrigger.create({ trigger: ol, start: 'top 75%', end: 'bottom 45%', scrub: true, onUpdate: function (s) { if (fill) fill.style.transform = 'scaleX(' + s.progress + ')'; var k = s.progress * steps.length; steps.forEach(function (st, j) { st.classList.toggle('on', j < k + 0.15); }); } });
  });

  // parting headline + expanding image
  $$('[data-parting]').forEach(function (p) {
    var a = $('.pa-a', p), b = $('.pa-b', p), im = $('.pa-img', p), h = $('.pa-h', p);
    var tl = gsap.timeline({ scrollTrigger: { trigger: p, start: 'top top', end: 'bottom bottom', scrub: 0.6 } });
    tl.to(a, { xPercent: -70, ease: 'none' }, 0).to(b, { xPercent: 70, ease: 'none' }, 0)
      .to(im, { width: '100vw', height: '100svh', borderRadius: 0, ease: 'power1.inOut' }, 0)
      .to(h, { opacity: 0, ease: 'power1.in' }, 0.35);
    gsap.from([a, b], { yPercent: 100, opacity: 0, duration: 1.3, ease: ease, stagger: 0.12, delay: entering ? 0.5 : 0.1 });
    gsap.from(im, { scale: 0.6, opacity: 0, duration: 1.4, ease: ease, delay: entering ? 0.6 : 0.2 });
  });

  // word dial (about)
  $$('[data-history]').forEach(function (h) {
    var yr = $('[data-hi-year]', h), items = $$('.hi-list li', h);
    mm.add('(min-width: 900px)', function () {
      items.forEach(function (li) { ScrollTrigger.create({ trigger: li, start: 'top 60%', end: 'bottom 60%', onToggle: function (s) { if (!s.isActive) return; items.forEach(function (x) { x.classList.toggle('on', x === li); }); if (yr.textContent !== li.dataset.year) { gsap.fromTo(yr, { yPercent: s.direction > 0 ? 40 : -40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.6, ease: ease }); yr.textContent = li.dataset.year; } } }); });
    });
  });

  // services: word roller
  $$('[data-roller]').forEach(function (r) {
    var inn = $('.roller-in', r), n = inn.children.length - 1, i = 0;
    setInterval(function () {
      i++; gsap.to(inn, { yPercent: -100 * i / (n + 1), duration: 0.9, ease: 'expo.inOut', onComplete: function () { if (i >= n) { i = 0; gsap.set(inn, { yPercent: 0 }); } } });
    }, 2000);
  });

  // map draw-in
  $$('.map').forEach(function (m) {
    var ps = $$('.cty-p, .in-p', m);
    gsap.fromTo(ps, { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.8, ease: 'power2.inOut', stagger: 0.08, scrollTrigger: { trigger: m, start: 'top 85%', once: true }, onComplete: function () { gsap.set(ps, { clearProps: 'strokeDasharray,strokeDashoffset' }); } });
    gsap.fromTo($$('.twn', m), { opacity: 0 }, { opacity: 1, duration: 0.6, stagger: 0.04, delay: 0.8, scrollTrigger: { trigger: m, start: 'top 85%', once: true } });
  });

  // footer wordmark rises
  $$('[data-wm]').forEach(function (wm) {
    gsap.fromTo($$('span', wm), { yPercent: 100 }, { yPercent: 0, ease: 'none', stagger: 0.04, scrollTrigger: { trigger: wm, start: 'top bottom', end: 'bottom bottom', scrub: 0.6 } });
  });

  W.addEventListener('load', function () { ScrollTrigger.refresh(); placeHero(); });
})();
