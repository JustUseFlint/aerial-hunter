/* Aerial Hunter — branching contact flow. Nothing is sent from the site: the last step
   opens a prefilled text message (sms:) to 765-592-5970, or the visitor can call. */
(function () {
  'use strict';
  var root = document.querySelector('[data-contact]'); if (!root) return;
  var d = document, G = window.gsap, RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var stage = root.querySelector('[data-stage]'), form = root.querySelector('[data-form]'), back = root.querySelector('[data-back]'), next = root.querySelector('[data-next]'), prog = root.querySelector('[data-prog]'), stepsEl = root.querySelector('[data-steps]');
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var PHONE = '765-592-5970', TEL = 'tel:+17655925970', SMS = 'sms:+17655925970';
  var COUNTIES = ['Parke', 'Vermillion', 'Fountain', 'Montgomery', 'Putnam', 'Clay', 'Vigo', 'Somewhere else'];
  var DIRS = ['NW', 'N', 'NE', 'W', 'Not sure', 'E', 'SW', 'S', 'SE'];

  var SERVICES = [
    { id: 'deer', slug: 'deer-recovery', t: 'Deer recovery', d: 'A deer you shot that you can’t find' },
    { id: 'pet', slug: 'lost-pet-recovery', t: 'Lost pet', d: 'A dog, cat, horse or other animal that’s missing' },
    { id: 'survey', slug: 'herd-land-surveying', t: 'Herd or land survey', d: 'Headcounts, strays, fence lines, aerial views' },
    { id: 'other', t: 'Something else', d: 'A question, or a job that doesn’t fit above' }
  ];
  var Q = {
    deer: { h: 'Tell us about the shot.', sub: 'The more precise, the faster we can plan the search.', f: [
      { k: 'shot', l: 'When did you shoot?', type: 'datetime-local', req: 1, now: 1 },
      { k: 'county', l: 'County', type: 'select', req: 1, o: COUNTIES },
      { k: 'where', l: 'Where were you hunting?', type: 'text', req: 1, ph: 'Nearest road, town or landmark' },
      { k: 'hit', l: 'Where do you think you hit it?', hint: 'optional', type: 'one', o: ['Heart / lungs', 'Liver', 'Gut', 'Shoulder / leg', 'Not sure'] },
      { k: 'dir', l: 'Which way did it go?', hint: 'last direction you saw it heading', type: 'compass', req: 1 },
      { k: 'perm', l: 'Do you have landowner permission where the deer may be?', type: 'one', req: 1, o: ['Yes, it’s my land', 'Yes, I have permission', 'Working on it', 'No / not sure'] } ] },
    pet: { h: 'Tell us about your pet.', sub: 'A clear description helps us confirm a sighting on the zoom camera.', f: [
      { k: 'animal', l: 'What kind of animal?', type: 'one', req: 1, o: ['Dog', 'Cat', 'Horse', 'Livestock', 'Other'] },
      { k: 'pname', l: 'Name', hint: 'optional', type: 'text', ph: 'e.g. Duke' },
      { k: 'pdesc', l: 'Size, color, collar', type: 'text', req: 1, ph: 'e.g. Medium, black and tan, orange collar' },
      { k: 'seenWhen', l: 'When were they last seen?', type: 'datetime-local', req: 1, now: 1 },
      { k: 'county', l: 'County', type: 'select', req: 1, o: COUNTIES },
      { k: 'seenWhere', l: 'Where were they last seen?', type: 'text', req: 1, ph: 'Address, road or landmark' },
      { k: 'temper', l: 'How do they act around strangers?', type: 'one', o: ['Friendly', 'Shy', 'Will run', 'Not sure'] },
      { k: 'photo', l: 'Photo', hint: 'optional, you’ll attach it to the text', type: 'photo' } ] },
    survey: { h: 'What do you need flown?', sub: 'Rough numbers are fine. We’ll firm it up on the phone.', f: [
      { k: 'kind', l: 'What’s the job?', hint: 'choose all that apply', type: 'many', req: 1, o: ['Herd headcount', 'Stray search', 'Fence line check', 'Pond & drainage', 'Aerial photos / video', 'Something else'] },
      { k: 'acres', l: 'Roughly how many acres?', type: 'one', req: 1, o: ['Under 20', '20–80', '80–200', '200–500', '500+'] },
      { k: 'deliver', l: 'What do you want at the end?', hint: 'choose all that apply', type: 'many', req: 1, o: ['A headcount', 'Photos', 'Video', 'Notes on problems found', 'Overview images'] },
      { k: 'county', l: 'County', type: 'select', req: 1, o: COUNTIES },
      { k: 'where', l: 'Location', type: 'text', ph: 'Road, town or landmark' },
      { k: 'timing', l: 'Timing', type: 'one', o: ['As soon as possible', 'This week', 'This month', 'Flexible'] } ] },
    other: { h: 'How can we help?', f: [
      { k: 'msg', l: 'Your message', type: 'area', req: 1, ph: 'Ask anything.' } ] }
  };
  var YOU = { h: 'How do we reach you?', sub: 'So we can call or text you back.', f: [
    { k: 'name', l: 'Your name', type: 'text', req: 1, ac: 'name' },
    { k: 'phone', l: 'Your phone', type: 'tel', req: 1, ac: 'tel', ph: '765-555-0100' },
    { k: 'pref', l: 'Best way back to you', type: 'one', o: ['Call me', 'Text me'] },
    { k: 'notes', l: 'Anything else?', hint: 'optional', type: 'area', ph: 'Gate codes, where to park, anything that helps.' } ] };

  var params = new URLSearchParams(location.search);
  var state = { service: null, a: { pref: 'Call me' }, photo: null };
  var pre = params.get('service');
  SERVICES.forEach(function (s) { if (s.slug === pre || s.id === pre) state.service = s.id; });
  function flowFor() {
    var f = [{ id: 'service', label: 'What happened' }];
    if (state.service !== 'deer') f.push({ id: 'details', label: 'Details' });
    f.push({ id: 'you', label: 'Your contact' }, { id: 'review', label: 'Review & send' });
    return f;
  }
  var FLOW = flowFor();
  var step = state.service ? 1 : 0;
  function svc() { return SERVICES.filter(function (x) { return x.id === state.service; })[0]; }
  function set(id) { return id === 'details' ? Q[state.service].f : id === 'you' ? YOU.f : []; }
  function nowLocal() { var n = new Date(); n.setMinutes(n.getMinutes() - n.getTimezoneOffset()); return n.toISOString().slice(0, 16); }
  function fmtWhen(v) { if (!v) return ''; var t = new Date(v); if (isNaN(t)) return v; return t.toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }); }

  function field(q) {
    var v = state.a[q.k], id = 'f-' + q.k, html = '';
    var lab = '<span class="fl" id="' + id + '-l">' + esc(q.l) + (q.hint ? ' <span class="opt-hint">(' + q.hint + ')</span>' : '') + '</span>';
    if (q.type === 'one' || q.type === 'many') {
      html = lab + '<div class="tchips" role="' + (q.type === 'one' ? 'radiogroup' : 'group') + '" aria-labelledby="' + id + '-l">' + q.o.map(function (o) {
        var on = q.type === 'one' ? v === o : (v || []).indexOf(o) > -1;
        return '<label class="tchip"><input type="' + (q.type === 'one' ? 'radio' : 'checkbox') + '" name="' + q.k + '" value="' + esc(o) + '"' + (on ? ' checked' : '') + '><span>' + esc(o) + '</span></label>';
      }).join('') + '</div>';
    } else if (q.type === 'compass') {
      html = lab + '<div class="compass-row"><div class="compass tchips" role="radiogroup" aria-labelledby="' + id + '-l">' + DIRS.map(function (o) {
        return '<label class="tchip"><input type="radio" name="' + q.k + '" value="' + o + '"' + (v === o ? ' checked' : '') + ' aria-label="' + (o === 'Not sure' ? 'Not sure' : 'Heading ' + o) + '"><span>' + (o === 'Not sure' ? '?' : o) + '</span></label>';
      }).join('') + '</div><p class="mute" style="max-width:24ch;font-size:14px">Tap the direction the deer ran, or ? if you didn’t see.</p></div>';
    } else if (q.type === 'area') {
      html = '<label class="fl" for="' + id + '">' + esc(q.l) + (q.hint ? ' <span class="opt-hint">(' + q.hint + ')</span>' : '') + '</label><textarea class="inp" id="' + id + '" name="' + q.k + '" placeholder="' + esc(q.ph || '') + '">' + esc(v || '') + '</textarea>';
    } else if (q.type === 'select') {
      html = '<label class="fl" for="' + id + '">' + esc(q.l) + '</label><select class="inp" id="' + id + '" name="' + q.k + '"><option value="">Select…</option>' + q.o.map(function (o) { return '<option' + (v === o ? ' selected' : '') + '>' + esc(o) + '</option>'; }).join('') + '</select>';
    } else if (q.type === 'photo') {
      html = lab + '<label class="photo-drop"><input type="file" accept="image/*" id="' + id + '" data-photo><span class="pd-th" data-pd-th>' + (state.photo ? '<img src="' + state.photo.url + '" alt="">' : '+') + '</span><span class="pd-t"><b data-pd-n>' + (state.photo ? esc(state.photo.name) : 'Add a recent photo') + '</b><span>Text messages can’t carry a photo from a website, so attach it in your messages app when it opens.</span></span></label>';
    } else {
      html = '<label class="fl" for="' + id + '">' + esc(q.l) + (q.hint ? ' <span class="opt-hint">(' + q.hint + ')</span>' : '') + '</label><input class="inp" id="' + id + '" name="' + q.k + '" type="' + q.type + '" value="' + esc(v || '') + '" placeholder="' + esc(q.ph || '') + '"' + (q.ac ? ' autocomplete="' + q.ac + '"' : '') + (q.type === 'tel' ? ' inputmode="tel"' : '') + '>' + (q.now ? '<button type="button" class="link-arrow" data-now="' + q.k + '" style="justify-self:start;font-size:14px">Use the time right now</button>' : '');
    }
    var err = q.type === 'tel' ? 'Enter a phone number we can reach you on.' : (q.type === 'one' || q.type === 'many' || q.type === 'select' || q.type === 'compass') ? 'Please choose one.' : 'This one’s needed.';
    return '<div class="fld" data-k="' + q.k + '">' + html + '<span class="fld-err" role="alert">' + err + '</span></div>';
  }

  function rows(id) {
    var r = [];
    if (id === 'service') r.push(['Request', svc().t]);
    set(id).forEach(function (q) { var v = state.a[q.k]; if (q.type === 'photo') { if (state.photo) r.push([q.l, state.photo.name + ' (attach in your text)']); return; } if (v && (!Array.isArray(v) || v.length)) r.push([q.l, Array.isArray(v) ? v.join(', ') : q.type === 'datetime-local' ? fmtWhen(v) : v]); });
    return r;
  }

  function render(dir) {
    FLOW = flowFor();
    if (step > FLOW.length - 1) step = FLOW.length - 1;
    var cur = FLOW[step], html = '';
    var head = function (k, h, sub) { return '<p class="eyebrow ct-k">Step ' + (step + 1) + ' of ' + FLOW.length + ' · ' + k + '</p><h2 class="ct-q">' + h + '</h2>' + (sub ? '<p class="ct-sub">' + sub + '</p>' : ''); };
    if (cur.id === 'service') {
      html = head('What happened', 'What are we looking for?', 'Your answer shapes the next questions, so we only ask what matters.') +
        '<div class="fld" data-k="service"><div class="opts" role="radiogroup" aria-label="Type of request">' + SERVICES.map(function (s, i) { return '<label class="opt"><input type="radio" name="service" value="' + s.id + '"' + (state.service === s.id ? ' checked' : '') + '><span class="mono">0' + (i + 1) + '</span><span class="opt-t">' + s.t + '</span><span class="opt-d">' + s.d + '</span><span class="opt-c" aria-hidden="true"></span></label>'; }).join('') + '</div><span class="fld-err" role="alert">Please choose one to continue.</span></div>';
    } else if (cur.id === 'details') {
      var q = Q[state.service]; html = head(svc().t, q.h, q.sub) + q.f.map(field).join('');
    } else if (cur.id === 'you') {
      html = head('Your contact', YOU.h, YOU.sub) + '<div class="two">' + YOU.f.slice(0, 2).map(field).join('') + '</div>' + YOU.f.slice(2).map(field).join('');
    } else {
      html = head('Review', 'Does this look right?', 'Next, we’ll turn this into a text message to ' + PHONE + ' for you to send.') + '<div class="rev">' + FLOW.slice(0, -1).map(function (s, i) {
        return '<div class="rev-g"><div class="rev-h"><span class="eyebrow">' + s.label + '</span><button type="button" data-edit="' + i + '">Edit</button></div><dl>' + rows(s.id).map(function (r) { return '<div><dt>' + esc(r[0]) + '</dt><dd>' + esc(r[1]) + '</dd></div>'; }).join('') + '</dl></div>';
      }).join('') + '</div>';
    }
    var swap = function () {
      stage.innerHTML = '<div class="ct-step">' + html + '</div>';
      back.hidden = step === 0;
      next.querySelector('span').textContent = cur.id === 'review' ? 'Prepare my text' : 'Continue';
      prog.style.transform = 'scaleX(' + ((step + 1) / (FLOW.length + 1)) + ')';
      stepsEl.innerHTML = FLOW.map(function (s, i) { return '<li class="' + (i === step ? 'on' : i < step ? 'done' : '') + '"><span>0' + (i + 1) + ' ' + s.label + '</span><span>' + (i < step ? 'Done' : i === step ? '●' : '') + '</span></li>'; }).join('');
      stage.querySelectorAll('[data-edit]').forEach(function (b) { b.addEventListener('click', function () { go(+b.dataset.edit); }); });
      stage.querySelectorAll('input[name=service]').forEach(function (r) { r.addEventListener('change', function () { var old = state.service; state.service = r.value; FLOW = flowFor(); if (old !== r.value) setTimeout(function () { go(1); }, 260); }); });
      stage.querySelectorAll('[data-now]').forEach(function (b) { b.addEventListener('click', function () { var i = stage.querySelector('#f-' + b.dataset.now); i.value = nowLocal(); i.closest('.fld').classList.remove('err'); }); });
      var ph = stage.querySelector('[data-photo]');
      if (ph) ph.addEventListener('change', function () { var f = ph.files && ph.files[0]; if (!f) return; if (state.photo) URL.revokeObjectURL(state.photo.url); state.photo = { name: f.name, url: URL.createObjectURL(f) }; stage.querySelector('[data-pd-th]').innerHTML = '<img src="' + state.photo.url + '" alt="Your pet">'; stage.querySelector('[data-pd-n]').textContent = f.name; });
      if (G && !RM) G.fromTo(stage.querySelectorAll('.ct-step > *, .two > *'), { opacity: 0, y: dir < 0 ? -24 : 28 }, { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out', stagger: 0.04 });
      if (dir) { var h = stage.querySelector('.ct-q'); if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); } }
    };
    if (dir && G && !RM && stage.firstChild) G.to(stage.firstChild, { opacity: 0, y: dir > 0 ? -24 : 24, duration: 0.25, ease: 'power2.in', onComplete: swap }); else swap();
    if (dir) scrollToForm();
  }
  function scrollToForm() { var top = root.querySelector('.ct-main').getBoundingClientRect().top + scrollY - 90; if (Math.abs(scrollY - top) > 60) { if (window.ahLenis) window.ahLenis.scrollTo(top, { duration: 0.8 }); else scrollTo(0, top); } }

  function collect() {
    stage.querySelectorAll('.fld[data-k]').forEach(function (f) {
      var k = f.dataset.k; if (k === 'service' || k === 'photo') return;
      var ins = f.querySelectorAll('input,textarea,select'); if (!ins.length) return;
      if (ins[0].type === 'checkbox') state.a[k] = Array.prototype.filter.call(ins, function (i) { return i.checked; }).map(function (i) { return i.value; });
      else if (ins[0].type === 'radio') { var c = Array.prototype.filter.call(ins, function (i) { return i.checked; })[0]; state.a[k] = c ? c.value : ''; }
      else state.a[k] = ins[0].value.trim();
    });
  }
  function validate() {
    var cur = FLOW[step], ok = true, firstBad = null;
    if (cur.id === 'service') { var f = stage.querySelector('[data-k=service]'); var bad = !state.service; f.classList.toggle('err', bad); return !bad; }
    set(cur.id).forEach(function (q) {
      var v = state.a[q.k], bad = false;
      if (q.req && (!v || (Array.isArray(v) && !v.length))) bad = true;
      if (!bad && v && q.type === 'tel' && v.replace(/\D/g, '').length < 10) bad = true;
      var el = stage.querySelector('.fld[data-k="' + q.k + '"]'); if (el) { el.classList.toggle('err', bad); if (bad && !firstBad) firstBad = el; }
      if (bad) ok = false;
    });
    if (firstBad) { var i = firstBad.querySelector('input,textarea,select'); if (i) i.focus(); }
    return ok;
  }
  function go(n) { var dir = n > step ? 1 : -1; step = n; render(dir); }

  stage.addEventListener('input', function (e) { var f = e.target.closest('.fld'); if (f && f.classList.contains('err')) { collect(); f.classList.remove('err'); } });
  stage.addEventListener('change', function (e) { var f = e.target.closest('.fld'); if (f) f.classList.remove('err'); });
  back.addEventListener('click', function () { collect(); if (step > 0) go(step - 1); });
  form.addEventListener('submit', function (e) {
    e.preventDefault(); collect();
    if (!validate()) return;
    if (FLOW[step].id === 'review') return done();
    go(step + 1);
  });

  function message() {
    var a = state.a, L = ['AERIAL HUNTER REQUEST: ' + svc().t.toUpperCase()];
    var where = function () { return [a.county ? a.county + (a.county === 'Somewhere else' ? '' : ' Co.') : '', a.where || a.seenWhere || ''].filter(Boolean).join(', '); };
    if (state.service === 'pet') {
      L.push('Animal: ' + a.animal + (a.pname ? ' named ' + a.pname : '')); L.push('Looks like: ' + a.pdesc);
      L.push('Last seen: ' + fmtWhen(a.seenWhen) + ', ' + where());
      if (a.temper) L.push('With strangers: ' + a.temper);
      if (state.photo) L.push('Photo: attaching to this text');
    } else if (state.service === 'survey') {
      L.push('Job: ' + a.kind.join(', ')); L.push('Acres: ' + a.acres); L.push('Wants: ' + a.deliver.join(', '));
      L.push('Where: ' + where()); if (a.timing) L.push('Timing: ' + a.timing);
    } else if (state.service === 'other') L.push(a.msg);
    L.push(''); L.push('From: ' + a.name + ', ' + a.phone + (a.pref ? ' (' + a.pref.toLowerCase() + ')' : ''));
    if (a.notes) L.push('Notes: ' + a.notes);
    return L.join('\n');
  }

  function done() {
    var body = message(), href = SMS + '?&body=' + encodeURIComponent(body);
    var first = (state.a.name || '').split(' ')[0] || 'there';
    var html = '<div class="ct-step done"><span class="done-mark"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2"/></svg></span>' +
      '<p class="eyebrow ct-k">Ready to send</p><h2 class="ct-q" tabindex="-1">Almost there, ' + esc(first) + '.</h2>' +
      '<p class="ct-sub" style="margin-top:0">Tap <b>Text these details</b> and your messages app opens with everything below, addressed to ' + PHONE + '. Just press send.' + (state.photo ? ' Attach your pet’s photo before you do.' : '') + '</p>' +
      '<div class="sms-prev" data-sms-prev>' + esc(body) + '</div>' +
      '<div class="done-btns"><a class="btn btn-lg" href="' + href + '" data-sms-link><span>Text these details</span></a><a class="btn btn-ghost btn-lg" href="' + TEL + '"><span>Call ' + PHONE + '</span></a><button type="button" class="btn btn-ghost btn-lg" data-copy><span>Copy details</span></button></div>' +
      '<p class="done-note">Nothing is sent from this website. If time matters, calling is fastest. On a computer? Call or text ' + PHONE + ' from your phone and paste the copied details.</p>' +
      '<div><button type="button" class="link-arrow" data-restart>Start a new request</button></div></div>';
    stage.innerHTML = html; root.querySelector('[data-nav]').hidden = true;
    prog.style.transform = 'scaleX(1)';
    stepsEl.querySelectorAll('li').forEach(function (li) { li.className = 'done'; li.lastChild.textContent = 'Done'; });
    stage.querySelector('.ct-q').focus({ preventScroll: true });
    stage.querySelector('[data-copy]').addEventListener('click', function (e) { var b = e.currentTarget, ok = function () { b.querySelector('span').textContent = 'Copied'; setTimeout(function () { b.querySelector('span').textContent = 'Copy details'; }, 2000); }; if (navigator.clipboard) navigator.clipboard.writeText(body).then(ok, ok); else ok(); });
    stage.querySelector('[data-restart]').addEventListener('click', function () { state = { service: null, a: { pref: 'Call me' }, photo: null }; FLOW = flowFor(); root.querySelector('[data-nav]').hidden = false; step = 0; render(-1); });
    scrollToForm();
    if (G && !RM) G.fromTo(stage.querySelectorAll('.done > *'), { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out', stagger: 0.06 });
  }

  render(0);
})();
