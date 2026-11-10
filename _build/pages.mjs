import { esc, img, pic, arrow, phoneIco, smsIco, fbIco, callBtn, page, PHONE, TEL, SMS, FB } from './shell.mjs';
import { services, faqs, faqCats } from './data.mjs';
import { mapSVG } from './map.mjs';

const hudCorners = `<span class="hc hc-tl"></span><span class="hc hc-tr"></span><span class="hc hc-bl"></span><span class="hc hc-br"></span>`;

/* ---------- reusable blocks ---------- */
function thermalHero(root) {
  return `<section class="hero" data-hero>
  <div class="hero-media" data-scan data-tx="0.7236" data-ty="0.4604">
    ${img(root, 'hero-night', '', 'hm-night', 'loading="eager" fetchpriority="high"')}
    ${img(root, 'hero-ir', 'Thermal drone view at night: a deer bedded on the forest floor shows up bright white', 'hm-ir', 'loading="eager"')}
    <span class="hm-line" aria-hidden="true"></span>
    <div class="hud" aria-hidden="true">
      ${hudCorners}
      <span class="hud-x"></span>
      <div class="hud-tl mono"><span><i class="rec"></i>IR · WHITE HOT</span><span>640 × 512</span></div>
      <div class="hud-tr mono"><span data-hud-scan>SCANNING</span><span>39.76°N 87.23°W</span></div>
      <div class="hud-lock" data-lock><span class="lk-box"></span><span class="lk-t mono">SIGNATURE · CONFIRM ON ZOOM</span></div>
    </div>
  </div>
  <div class="hero-in wrap">
    <p class="hero-eb mono" data-fade><span class="dot-live"></span>Indiana · Part 107 certified</p>
    <h1 class="hero-h" data-split="hero">Hunt. Search. <em>Find.</em></h1>
    <div class="hero-foot">
      <p class="lead hero-lede" data-fade>Thermal drone recovery for lost deer, missing pets and livestock, day or night, anywhere in Indiana.</p>
      <div class="hero-ctas" data-fade>${callBtn('btn-lg')}<a class="btn btn-ghost btn-lg" href="${root}how-it-works/"><span>How a search works ${arrow}</span></a></div>
    </div>
    <p class="hero-hint mono" data-fade aria-hidden="true">Move your cursor to scan</p>
  </div>
</section>`;
}

function compare(root, { night, ir, tx, ty, eb, title, body }) {
  return `<section class="cmp" data-compare aria-labelledby="cmp-h">
  <div class="cmp-pin">
    <div class="cmp-stage" data-tx="${tx}" data-ty="${ty}">
      ${img(root, night, 'The same field at night, as your eyes see it: nearly black', 'cmp-a')}
      <div class="cmp-b">${img(root, ir, 'The same field through the thermal camera: a warm animal glows white', '')}</div>
      <span class="cmp-edge" aria-hidden="true"></span>
      <span class="cmp-tag cmp-tag-a mono" aria-hidden="true">Naked eye</span>
      <span class="cmp-tag cmp-tag-b mono" aria-hidden="true">Thermal · white hot</span>
      <span class="cmp-ret" aria-hidden="true">${hudCorners}</span>
    </div>
    <div class="cmp-copy wrap">
      <p class="eyebrow">${eb}</p>
      <h2 id="cmp-h" class="h-l">${title}</h2>
      <p class="cmp-p">${body}</p>
    </div>
  </div>
</section>`;
}

function stackCards(root) {
  return `<div class="stack" data-stack>
    ${services.map((s, i) => `<article class="stack-card sc-${i}" style="top:calc(var(--hdr) + ${12 + i * 16}px)">
      <a href="${root}services/${s.slug}/" class="sc-in" data-cursor="Open">
        <div class="sc-txt">
          <span class="sc-n mono">${s.kicker}</span>
          <h3 class="sc-h">${s.name}</h3>
          <p class="sc-l">${s.lede}</p>
          <span class="sc-go mono">See how a search works ${arrow}</span>
        </div>
        <div class="sc-m">${img(root, s.hero, s.alt)}${hudCorners}</div>
      </a>
    </article>`).join('')}
  </div>`;
}

function facts() {
  return `<section class="facts" aria-label="The facts">
  <div class="wrap">
    <div class="num-head"><p class="eyebrow">The facts</p><p class="num-note">The certificate, the kit and the ground we cover.</p></div>
    <div class="num-grid">
      <div class="num" data-reveal><span class="num-v"><span data-count="107">107</span></span><span class="num-l">FAA Part 107 certified remote pilot</span></div>
      <div class="num" data-reveal><span class="num-v"><span data-count="640">640</span><small>×</small><span data-count="512">512</span></span><span class="num-l">Thermal camera resolution on the DJI Matrice 4T</span></div>
      <div class="num" data-reveal><span class="num-v"><span data-count="1800">1,800</span><small>m</small></span><span class="num-l">Laser rangefinder reach (DJI spec)</span></div>
      <div class="num" data-reveal><span class="num-v">IN</span><span class="num-l">We search anywhere in Indiana. Travel is measured from Rockville.</span></div>
    </div>
  </div>
</section>`;
}

function marquee() {
  const w = ['Deer recovery', 'Lost pet recovery', 'Herd counts', 'Land surveying', 'Night & low light', 'All terrain', 'Part 107 certified', 'DJI Matrice 4T'];
  return `<div class="marquee" data-marquee="1" aria-hidden="true"><div class="mq-track">${w.map(t => `<span class="lg">${t}<i>✕</i></span>`).join('')}</div></div>`;
}

function mapBlock(root, small = false) {
  if (small) return `<a class="map-mini" href="${root}service-area/" data-cursor="Open">${mapSVG({ small: true })}</a>`;
  return `<div class="map-wrap">
    <div class="map-fig">${mapSVG()}</div>
    <div class="map-side">
      <div class="map-info">
        <p class="eyebrow">Statewide</p>
        <h3 class="mi-h">All of Indiana</h3>
        <p class="mi-s mono">Home base · Rockville</p>
        <p class="mi-p">We search anywhere in the state. Travel is $1 per mile after 50 miles from Rockville.</p>
      </div>
      <dl class="travel-facts mono">
        <div><dt>Home base</dt><dd>Rockville</dd></div>
        <div><dt>First 50 miles</dt><dd>Included</dd></div>
        <div><dt>After 50 miles</dt><dd>$1 / mile</dd></div>
      </dl>
      <div class="map-cta">${callBtn()}<a class="link-arrow" href="${root}services/#pricing">See the rates ${arrow}</a></div>
    </div>
  </div>`;
}

/* ---------- HOME ---------- */
export function home() {
  const root = '';
  const body = `
${thermalHero(root)}
${marquee()}

<section class="statement wrap grid">
  <p class="eyebrow st-eb" data-fade>(Aerial Hunter)</p>
  <div class="st-body">
    <p class="focus" data-focus>Aerial Hunter is a drone search service based in Rockville, Indiana, serving the whole state. A certified Part 107 pilot flies a DJI Matrice 4T thermal drone over fields, timber and creek bottoms to find what’s hard to see from the ground: a deer that ran after the shot, a dog that slipped its collar, a herd spread across back pasture.</p>
    <a class="link-arrow" href="about/">About Aerial Hunter ${arrow}</a>
  </div>
</section>

${compare(root, { night: 'night-deer', ir: 'thermal-deer', tx: 0.497, ty: 0.503, eb: 'Night &amp; low light', title: 'Thermal sees the unseen.', body: 'Same brush, same minute. To your eyes it’s dark leaves and shadow. To a thermal camera, a warm animal glows against cool ground.' })}

<section class="svc-stack wrap" aria-labelledby="svc-h">
  <div class="sec-head">
    <h2 id="svc-h" class="h-l" data-split>Three ways we search</h2>
    <a class="link-arrow sec-link" href="services/">All services ${arrow}</a>
  </div>
  ${stackCards(root)}
</section>

<aside class="rate-rail wrap" aria-label="Rates">
  <p class="eyebrow">Rates</p>
  <ul class="rate-rail-list">
    <li><span class="rr-n">Deer Recovery</span><b>$250</b><i>up to 2 hours</i></li>
    <li><span class="rr-n">Lost Pet Recovery</span><b>$150</b><i>per hour</i></li>
    <li><span class="rr-n">Herd &amp; Land Surveying</span><b class="rr-call">Call for more information</b></li>
  </ul>
  <a class="link-arrow" href="services/#pricing">See the full rates ${arrow}</a>
</aside>

${facts()}

<section class="gear-t wrap grid" aria-labelledby="gear-h">
  <div class="gt-txt">
    <p class="eyebrow" data-fade>The gear</p>
    <h2 id="gear-h" class="h-l" data-split>Built for search. Not for selfies.</h2>
    <p class="gt-p" data-fade>The DJI Matrice 4T is an enterprise drone made for search and public-safety work: a radiometric thermal camera, wide and zoom cameras, a laser rangefinder and a near-infrared light, all on one compact airframe.</p>
    <ul class="spec-mini mono" data-fade>
      <li><span>Thermal</span><b>640 × 512</b></li><li><span>Zoom</span><b>Up to 168 mm equiv.</b></li><li><span>Rangefinder</span><b>1,800 m</b></li><li><span>NIR light</span><b>100 m</b></li>
    </ul>
    <a class="link-arrow" href="how-it-works/" data-fade>How it works &amp; the gear ${arrow}</a>
  </div>
  <figure class="gt-fig" data-img-reveal>${img(root, 'cover', 'The actual Aerial Hunter kit: a DJI Matrice 4T drone, its hard case and controller, on a stone path at sunset')}<figcaption class="mono">The real kit. DJI Matrice 4T, case and controller.</figcaption></figure>
</section>

<section class="area-t" aria-labelledby="area-h">
  <div class="wrap grid">
    <div class="at-txt">
      <p class="eyebrow">Service area</p>
      <h2 id="area-h" class="h-l" data-split>All of Indiana.</h2>
      <p class="at-p" data-fade>We search the whole state, from a home base in Rockville. Travel is $1 per mile after 50 miles.</p>
      <a class="link-arrow" href="service-area/" data-fade>See the service area ${arrow}</a>
    </div>
    <div class="at-map" data-fade>${mapBlock(root, true)}</div>
  </div>
</section>

<section class="field wrap" aria-labelledby="field-h">
  <div class="sec-head"><h2 id="field-h" class="h-l" data-split>From the field</h2><a class="link-arrow sec-link" href="${FB}" target="_blank" rel="noopener">Follow on Facebook ↗</a></div>
  <div class="field-grid">
    <figure class="fg-a" data-img-reveal>${img(root, 'recovery-real', 'A hunter kneels in autumn woods holding the antlers of a recovered buck, a drone controller in the foreground')}<figcaption class="mono">A recovery shared on the Aerial Hunter Facebook page.</figcaption></figure>
    <div class="fg-b">
      <p class="focus focus-s" data-focus>Every search is different: a ridge, a cut cornfield, a creek bottom. The latest finds, flights and updates go up on Facebook first.</p>
      <a class="fb-card" href="${FB}" target="_blank" rel="noopener" data-cursor="Open">
        <img src="assets/img/logo-square.png" alt="" width="512" height="512" loading="lazy">
        <span><b>Aerial Hunter</b><span class="mono">Facebook · Hunt. Search. Find.</span></span>
        <span class="fb-i">${fbIco}</span>
      </a>
    </div>
  </div>
</section>`;
  return page({ root, path: '', title: 'Aerial Hunter', desc: 'Thermal drone deer recovery, lost pet recovery and herd & land surveying anywhere in Indiana. Call 765-592-5970.', body, cls: 'p-home', scripts: [] });
}

/* ---------- SERVICES INDEX ---------- */
export function servicesIndex() {
  const root = '../';
  const body = `
<section class="phero wrap">
  <p class="eyebrow" data-fade>Services</p>
  <h1 class="h-xxl roller-h" data-split="hero">We find</h1>
  <div class="roller h-xxl" data-roller aria-hidden="true"><div class="roller-in"><span>deer.</span><span>dogs.</span><span>cats.</span><span>cattle.</span><span>strays.</span><span>deer.</span></div></div>
  <p class="lead phero-lede" data-fade>Three services, one approach: a thermal drone, a careful search pattern, and someone on the phone who tells you straight what the odds are.</p>
</section>

<section class="svc-acc wrap">
  ${services.map((s, i) => `<article class="svx" data-reveal>
    <a href="${s.slug}/" class="svx-a" data-cursor="Open">
      <span class="svx-m">${img(root, s.hero, s.alt)}${hudCorners}</span>
      <span class="svx-t">
        <span class="mono svx-n">${s.kicker}</span>
        <span class="svx-h">${s.name}</span>
        <span class="svx-l">${s.lede}</span>
        <span class="svx-meta mono">${s.meta.slice(0, 3).map(m => `<span><i>${m[0]}</i>${m[1]}</span>`).join('')}</span>
        <span class="link-arrow">How a ${s.short.toLowerCase()} search works ${arrow}</span>
      </span>
    </a>
  </article>`).join('')}
</section>

${process(root)}

<section class="price wrap" id="pricing" aria-labelledby="price-h">
  <div class="price-head">
    <p class="eyebrow">Rates</p>
    <h2 id="price-h" class="h-l" data-split>What a search costs.</h2>
    <p class="lead" data-fade>Published rates, in plain English. Travel is measured from Rockville.</p>
  </div>
  <ol class="rate-sheet">
    <li class="rate" data-reveal>
      <div class="rate-top">
        <div>
          <h3 class="rate-h"><a href="deer-recovery/">Deer Recovery</a></h3>
        </div>
        <p class="rate-fig"><b>$250</b><span>up to 2 hours</span></p>
      </div>
      <ul class="rate-lines">
        <li><span>Each additional hour</span><b>$100 / hr</b></li>
        <li><span>Finder’s fee, dead or alive</span><b>$50</b></li>
        <li><span>Travel after 50 miles from Rockville</span><b>$1 / mile</b></li>
      </ul>
    </li>
    <li class="rate" data-reveal>
      <div class="rate-top">
        <div>
          <h3 class="rate-h"><a href="lost-pet-recovery/">Lost Pet Recovery</a></h3>
        </div>
        <p class="rate-fig"><b>$150</b><span>per hour</span></p>
      </div>
      <ul class="rate-lines">
        <li><span>Travel after 50 miles from Rockville</span><b>$1 / mile</b></li>
      </ul>
    </li>
    <li class="rate" data-reveal>
      <div class="rate-top">
        <div>
          <h3 class="rate-h"><a href="herd-land-surveying/">Herd &amp; Land Surveying</a></h3>
        </div>
        <p class="rate-fig is-call"><b>Call for more information</b></p>
      </div>
    </li>
  </ol>
  <div class="rate-foot" data-fade>
    <p class="mute">Call or text to check availability. We’ll confirm the rate before we drive out.</p>
    ${callBtn('', 'Call ' + PHONE)}
  </div>
</section>`;
  return page({ root, path: 'services/', title: 'Services', desc: 'Thermal drone deer recovery, lost pet recovery and herd & land surveying anywhere in Indiana.', body, cls: 'p-services' });
}

function process(root) {
  const steps = [['Call', 'Tell us what you’ve lost and where. We ask the right questions and give you an honest read.'], ['Plan', 'We check airspace, weather and permission, and plan a search pattern around the last known spot.'], ['Fly', 'The thermal drone sweeps the area in a methodical grid, day or night.'], ['Find', 'Signatures are confirmed on the zoom camera, then we guide you straight to them.']];
  return `<section class="process" data-process>
  <div class="wrap">
    <p class="eyebrow">How every search runs</p>
    <h2 class="h-l" data-split>Call. Plan. Fly. Find.</h2>
    <div class="proc-line" aria-hidden="true"><span data-proc-line></span></div>
    <ol class="proc">${steps.map((s, i) => `<li class="proc-s"><span class="proc-dot"><i></i></span><h3>${s[0]}</h3><p>${s[1]}</p></li>`).join('')}</ol>
  </div>
</section>`;
}

/* ---------- SERVICE STORY ---------- */
function hudPlate(root, s) {
  const ir = s.slug === 'herd-land-surveying' ? 'thermal-herd' : s.hero;
  const [tx, ty] = s.slug === 'deer-recovery' ? [49.7, 50.3] : s.slug === 'lost-pet-recovery' ? [49, 63] : [50, 50];
  const lbl = s.slug === 'herd-land-surveying' ? 'HEADCOUNT · REVIEW' : 'SIGNATURE · CONFIRMED';
  return `<div class="plate-hud">${img(root, ir, '')}<span class="ph-lock" style="left:${tx}%;top:${ty}%"></span><span class="ph-t mono">${lbl}</span><span class="ph-k mono">ZOOM · RANGE · MARK</span>${hudCorners}</div>`;
}

function recoveredBlock(root) {
  const alt1 = 'A recovered whitetail buck lying in the bed of a UTV in a sunny field, with a DJI thermal drone and its controller resting on the deer.';
  const alt2 = 'Another view of the same recovered whitetail buck in the UTV bed, the thermal drone and controller set on its side.';
  return `<section class="recovered" id="recovered" aria-labelledby="rec-h">
  <div class="wrap rec-in">
    <div class="rec-head">
      <p class="eyebrow">Recovered</p>
      <h2 id="rec-h" class="h-l" data-split>A recent recovery.</h2>
    </div>
    <div class="rec-pair">
      <figure class="rec-fig rec-lead">${pic(root, 'recovered-1', alt1)}</figure>
      <figure class="rec-fig rec-side">${pic(root, 'recovered-2', alt2)}</figure>
    </div>
    <p class="rec-cap">A recent recovery: found with thermal and brought home.</p>
  </div>
</section>`;
}

export function servicePage(s, i) {
  const root = '../../';
  const next = services[(i + 1) % services.length];
  const plate = n => n === 'hud' ? hudPlate(root, s) : img(root, n, '');
  const body = `
<section class="csh-full ${s.cls}">
  <div class="csh-media" data-hero-media>${img(root, s.hero, s.alt, '', 'loading="eager"')}</div>
  <div class="csh-hud" aria-hidden="true">${hudCorners}</div>
  <div class="csh-over wrap">
    <p class="cs-eb mono" data-fade><span>${s.kicker}</span></p>
    <h1 class="cs-title" data-split="hero">${s.title}</h1>
    <div class="csh-row">
      <p class="lead" data-fade>${s.lede}</p>
      <div class="csh-ctas" data-fade>${callBtn()}<a class="btn btn-ghost" href="${root}contact/?service=${s.slug}"><span>Send the details ${arrow}</span></a></div>
    </div>
  </div>
</section>
<div class="cs-metawrap wrap"><dl class="cs-meta mono">${s.meta.map(m => `<div><dt>${m[0]}</dt><dd>${m[1]}</dd></div>`).join('')}</dl></div>

<section class="cs-sec cs-brief wrap grid">
  <p class="eyebrow cs-k" data-fade>(The problem)</p>
  <p class="focus" data-focus>${s.focus}</p>
</section>

<section class="cs-zoom" data-zoom aria-hidden="true"><div class="cz-in"><span class="cz-w">${s.zoom}</span></div><div class="cz-grid"></div></section>

<section class="cs-chapters wrap" data-chapters aria-labelledby="ch-h">
  <div class="cc-list">
    <p class="eyebrow cs-k" id="ch-h">How a search works</p>
    ${s.chapters.map((c, k) => `<article class="cc-ch">
      <h2 class="cs-h3">${c[0]}</h2>
      <p>${c[1]}</p>
      <div class="cc-mob">${plate(c[2])}</div>
    </article>`).join('')}
  </div>
  <div class="cc-media" aria-hidden="true">
    ${s.chapters.map((c, k) => `<div class="cc-plate${k === 0 ? ' on' : ''}">${plate(c[2])}</div>`).join('')}
  </div>
</section>

<section class="cs-tl" data-hscroll aria-labelledby="tl-h">
  <div class="tl-head wrap"><p class="eyebrow cs-k">Timeline</p><h2 id="tl-h" class="cs-h2" data-split>${s.tlTitle}</h2></div>
  <ol class="tl-track">${s.tl.map(t => `<li class="tl-step"><span class="tl-dot"></span><h3 class="tl-t">${t[1]}</h3><p>${t[2]}</p></li>`).join('')}</ol>
  <div class="tl-bar" aria-hidden="true"><span data-tl-progress></span></div>
</section>

${s.slug === 'deer-recovery' ? recoveredBlock(root) : ''}

<section class="cs-sec now wrap grid" aria-labelledby="now-h">
  <div class="now-h">
    <p class="eyebrow cs-k">Right now</p>
    <h2 id="now-h" class="cs-h2" data-split>${s.slug === 'herd-land-surveying' ? 'Before you call.' : 'What helps, while you wait.'}</h2>
    <p class="mute now-sub" data-fade>Tick them off as you go. Then call.</p>
  </div>
  <div class="now-b">
    <ol class="chk-list" data-checklist="${s.slug}">${s.now.map((n, k) => `<li><label><input type="checkbox"><span class="ck" aria-hidden="true"></span><span class="ck-t"><b>${n[0]}</b><span>${n[1]}</span></span></label></li>`).join('')}</ol>
    <div class="now-call" data-fade><span class="mono" data-chk-count>0 / ${s.now.length} done</span>${callBtn()}</div>
  </div>
</section>

${s.slug === 'deer-recovery' ? `<section class="legal wrap" aria-labelledby="legal-h">
  <div class="legal-in" data-reveal>
    <p class="eyebrow">Indiana law, in plain English</p>
    <h2 id="legal-h" class="h-m">Drones can recover a deer. They can’t help you hunt one.</h2>
    <div class="legal-g">
      <p><b>Allowed.</b> Indiana Code 14-22-6-16 lets a person fly a drone with infrared to locate and recover a legally taken animal.</p>
      <p><b>Not allowed.</b> Using a drone to scout, locate or detect game as an aid to taking it, from 14 days before the season through the end of legal hunting hours on its last day.</p>
      <p><b>Permission.</b> The law doesn’t let anyone enter or recover on another person’s land without the landowner’s permission.</p>
    </div>
    <p class="mono legal-src">Summary only, not legal advice. Check the <a class="ul" href="https://www.in.gov/dnr/fish-and-wildlife/hunting-and-trapping/deer-hunting/deer-hunting-equipment" target="_blank" rel="noopener">current Indiana DNR rules ↗</a> each season.</p>
  </div>
</section>` : ''}

${s.deliver ? `<section class="caps-cloud wrap"><p class="eyebrow">What you can ask for</p><ul class="cloud">${s.deliver.map(d => `<li data-reveal>${d}</li>`).join('')}</ul></section>` : ''}

<section class="cs-next">
  <a class="cn-a" href="${root}services/${next.slug}/" data-cursor="Next">
    <span class="cn-media">${img(root, next.hero, '')}</span>
    <span class="cn-txt wrap"><span class="mono">Next service</span><span class="cn-t">${next.name}</span><span class="cn-s">${next.kicker} ${arrow}</span></span>
  </a>
</section>`;
  return page({ root, path: 'services/', title: s.name, desc: `${s.name} by thermal drone anywhere in Indiana. ${s.lede}`, body, cls: `p-case ${s.cls}` });
}

/* ---------- HOW IT WORKS / GEAR ---------- */
export function howItWorks() {
  const root = '../';
  const specs = [['Thermal camera', '640 × 512', 'Uncooled VOx sensor, f/1.0. Up to 1280 × 1024 in high-res mode.'], ['Wide camera', '48 MP', '1/1.3-inch sensor, 24 mm equivalent.'], ['Telephoto', '168 mm', 'Medium and long telephoto lenses, both 48 MP, to confirm a find from a distance.'], ['Laser rangefinder', '1,800 m', 'Distance to a target, so we can guide you to it.'], ['NIR auxiliary light', '100 m', 'Near-infrared light that helps the cameras see in the dark.'], ['Flight time', '49 min', 'Maximum rated flight time, no wind. Real searches run shorter.']];
  const body = `
<section class="parting" data-parting>
  <div class="pa-in">
    <h1 class="pa-h"><span class="pa-a">See the</span><span class="pa-b">unseen.</span></h1>
    <div class="pa-img">${img(root, 'cover', 'DJI Matrice 4T drone, hard case and controller on a stone path at sunset', '', 'loading="eager"')}</div>
  </div>
</section>

<section class="statement wrap grid">
  <p class="eyebrow st-eb" data-fade>(How thermal works)</p>
  <div class="st-body">
    <p class="focus" data-focus>Everything gives off heat. A thermal camera doesn’t need light; it reads the difference in temperature between things. A deer, a dog or a cow is warmer than the leaves and soil around it, so it glows. The bigger the difference, the clearer the picture, which is why cool, still nights are often the best time to search.</p>
  </div>
</section>

<section class="pal wrap" data-palette aria-labelledby="pal-h">
  <div class="pal-head">
    <div><p class="eyebrow">Try it</p><h2 id="pal-h" class="h-l" data-split>Spot the Difference</h2></div>
    <div class="chips pal-chips" role="group" aria-label="Thermal palette">
      <button class="chip on" type="button" data-pal="white" aria-pressed="true">White hot</button>
      <button class="chip" type="button" data-pal="black" aria-pressed="false">Black hot</button>
      <button class="chip" type="button" data-pal="iron" aria-pressed="false">Ironbow</button>
      <button class="chip" type="button" data-pal="eye" aria-pressed="false">Naked eye</button>
    </div>
  </div>
  <div class="pal-stage" data-tx="0.497" data-ty="0.503">
    ${img(root, 'thermal-deer', 'Thermal image of a deer in brush, shown in the selected palette', 'pal-ir')}
    ${img(root, 'night-deer', '', 'pal-eye')}
    <span class="pal-lock" aria-hidden="true"></span>
    <div class="hud" aria-hidden="true">${hudCorners}<div class="hud-tl mono"><span data-pal-name>IR · WHITE HOT</span></div></div>
  </div>
  <p class="pal-note mono" data-pal-note>White hot: warm things show white. Easiest to read for most people.</p>
  <svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">
    <filter id="f-black"><feColorMatrix type="matrix" values="-1 0 0 0 1  -1 0 0 0 1  -1 0 0 0 1  0 0 0 1 0"/></filter>
    <filter id="f-iron" color-interpolation-filters="sRGB"><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncR type="table" tableValues="0 .25 .6 .9 1 1"/><feFuncG type="table" tableValues="0 0 .1 .4 .75 1"/><feFuncB type="table" tableValues=".05 .35 .45 .1 .05 .8"/></feComponentTransfer></filter>
  </svg>
</section>

<section class="specs" aria-labelledby="spec-h">
  <div class="wrap">
    <div class="sec-head"><h2 id="spec-h" class="h-l" data-split>DJI Matrice 4T</h2><p class="mono sec-meta">Manufacturer specifications</p></div>
    <ul class="spec-grid">${specs.map(s => `<li data-reveal><span class="mono">${s[0]}</span><b>${s[1]}</b><p>${s[2]}</p></li>`).join('')}</ul>
    <figure class="spec-fig" data-expand><div class="reel-frame">${img(root, 'cover-lg', 'Close view of the Matrice 4T and controller in front of its case')}</div></figure>
  </div>
</section>

<section class="p107 wrap grid" aria-labelledby="p107-h">
  <div class="p107-n" aria-hidden="true"><span>107</span></div>
  <div class="p107-b">
    <p class="eyebrow">Part 107 certified</p>
    <h2 id="p107-h" class="h-m" data-split>Licensed to fly for hire.</h2>
    <p data-fade>Part 107 is the FAA rulebook for commercial drone work. A certified remote pilot has passed the FAA’s aeronautical knowledge test and keeps current with recurrent training. That covers airspace, weather, night operations and safety, all of which matter when you’re flying over timber after dark.</p>
    <ul class="p107-l mono" data-fade><li>FAA-certified remote pilot</li><li>Night flights with anti-collision lighting</li><li>Airspace checked before every flight</li></ul>
  </div>
</section>

<section class="cond wrap" data-conditions aria-labelledby="cond-h">
  <div class="cond-head"><p class="eyebrow">Conditions check</p><h2 id="cond-h" class="h-l" data-split>Is tonight a good night to search?</h2><p class="mute" data-fade>A rough guide, not a promise. Pick what it’s like out there.</p></div>
  <div class="cond-grid">
    <div class="cond-q">
      ${[['temp', 'Temperature', ['Cold', 'Cool', 'Mild', 'Hot']], ['wind', 'Wind', ['Calm', 'Breezy', 'Gusty', 'Strong']], ['sky', 'Weather', ['Dry', 'Fog', 'Drizzle', 'Rain']], ['cover', 'Cover', ['Open field', 'Leafless timber', 'Leaves on', 'Pines & cedar']]].map(([k, l, o]) => `<fieldset class="fld"><legend class="fl">${l}</legend><div class="tchips">${o.map((x, j) => `<label class="tchip"><input type="radio" name="c-${k}" value="${j}"${j === (k === 'temp' ? 1 : 0) ? ' checked' : ''}><span>${x}</span></label>`).join('')}</div></fieldset>`).join('')}
    </div>
    <div class="cond-out" aria-live="polite">
      <div class="gauge" data-gauge><svg viewBox="0 0 120 70" aria-hidden="true"><path class="g-bg" d="M10 62a50 50 0 01100 0" pathLength="100"/><path class="g-fg" d="M10 62a50 50 0 01100 0" pathLength="100"/></svg><span class="g-v" data-g-v>Good</span></div>
      <p class="cond-t" data-cond-t>Good conditions for a thermal search.</p>
      <ul class="cond-why mono" data-cond-why></ul>
      ${callBtn('', 'Call to check')}
    </div>
  </div>
</section>

${process(root)}`;
  return page({ root, path: 'how-it-works/', title: 'How it works & the gear', desc: 'How thermal drone search works, the DJI Matrice 4T, Part 107 certification and the conditions that make a good search.', body, cls: 'p-how', scripts: ['tools.js'] });
}

/* ---------- SERVICE AREA ---------- */
export function serviceArea() {
  const root = '../';
  const body = `
<section class="phero wrap">
  <p class="eyebrow" data-fade>Service area</p>
  <h1 class="h-xxl" data-split="hero">All of Indiana.</h1>
  <p class="lead phero-lede" data-fade>We search the whole state. Home base is Rockville; travel is $1 per mile after 50 miles.</p>
</section>
<section class="area wrap" aria-label="Map of the service area">${mapBlock(root)}</section>

<section class="csh-window" data-window aria-label="Home base, Parke County"><div class="cw-in">${img(root, 'covered-bridge', 'Aerial view of a red covered bridge over a creek among autumn trees')}<div class="cw-cap wrap"><p class="mono">Home base. Parke County, Indiana</p><p class="cw-t">Covered Bridge Capital of the World.</p></div></div></section>

<section class="statement wrap grid">
  <p class="eyebrow st-eb" data-fade>(The ground)</p>
  <div class="st-body">
    <p class="focus" data-focus>Indiana is hard searching country: timber, standing corn, fencerows and creek bottoms. That’s the ground where a drone earns its keep.</p>
  </div>
</section>

<section class="travel-band wrap grid">
  <h2 class="h-l" data-split>Travel from Rockville.</h2>
  <div data-fade>
    <p class="lead">The first 50 miles from Rockville are included. After that, travel is $1 per mile. We’ll confirm the cost before we drive out.</p>
    ${callBtn()}
  </div>
</section>`;
  return page({ root, path: 'service-area/', title: 'Service area', desc: 'Aerial Hunter serves all of Indiana. Home base is Rockville; travel is $1 per mile after 50 miles.', body, cls: 'p-area' });
}

/* ---------- ABOUT ---------- */
export function about() {
  const root = '../';
  const words = [['Hunt.', 'It starts with hunters. Losing a deer you shot is the worst feeling in the woods, and doing right by the animal matters. Deer recovery is at the heart of what Aerial Hunter does.'], ['Search.', 'The same thermal camera that finds a deer in the timber finds a frightened dog in a fencerow, or a calf that wandered off from the herd. Different animals, same careful pattern.'], ['Find.', 'The point isn’t flying. It’s walking out to what you lost. Every search ends with someone on the ground being guided straight to it.']];
  const body = `
<section class="csh-type wrap">
  <p class="cs-eb mono" data-fade><span>About</span><span>Aerial Hunter</span></p>
  <h1 class="cs-title" data-split="hero">Indiana ground. Eyes in the sky.</h1>
  <div class="csh-row"><p class="lead" data-fade>A drone search service based in Rockville, Indiana, run by a certified Part 107 pilot. We search anywhere in the state.</p></div>
</section>
<section class="csh-window" data-window aria-label="Pilot at dusk"><div class="cw-in">${img(root, 'woods-dusk', 'Hardwood creek bottom at dusk with mist over the water')}</div></section>

<section class="statement wrap grid">
  <p class="eyebrow st-eb" data-fade>(The story)</p>
  <div class="st-body">
    <p class="focus" data-focus>Aerial Hunter exists for a simple reason: the kind of thermal drone that search teams rely on should be within reach of the hunter who lost a deer at dusk, the family whose dog ran off in a storm, and the farmer counting cattle across back pasture. A certified pilot, the right drone, and neighbors who need a hand.</p>
  </div>
</section>

<section class="words" data-history aria-label="Hunt. Search. Find.">
  <div class="wrap hi-grid">
    <div class="hi-side">
      <img class="hi-logo" src="${root}assets/img/logo.png" alt="Aerial Hunters logo" width="824" height="403" loading="lazy">
      <p class="hi-year" data-hi-year aria-hidden="true">Hunt.</p>
    </div>
    <ol class="hi-list">${words.map(w => `<li data-year="${w[0]}"><span class="hi-y">${w[0]}</span><p>${w[1]}</p></li>`).join('')}</ol>
  </div>
</section>

<section class="principles wrap" aria-labelledby="pr-h">
  <div class="sec-head"><h2 id="pr-h" class="h-l" data-split>How we work</h2></div>
  <ol class="pr">${[['Straight answers', 'If conditions or cover make a find unlikely, you’ll hear it on the phone, before anyone drives out.'], ['Landowners first', 'We fly and recover only where we have permission, and we help you sort it out with neighbors.'], ['Quick to respond', 'Lost animals don’t wait. Call as soon as you know, and we’ll tell you how quickly we can get there.'], ['Fair prices', 'Rates are listed on the Services page. We’ll confirm the cost before we drive out.']].map((p, k) => `<li data-reveal><h3>${p[0]}</h3><p>${p[1]}</p></li>`).join('')}</ol>
</section>

<section class="fbband wrap" aria-labelledby="fb-h">
  <div class="fbb-in" data-reveal>
    <div><p class="eyebrow">Follow along</p><h2 id="fb-h" class="h-m">Recent searches, finds and updates go up on Facebook.</h2></div>
    <a class="btn btn-lg" href="${FB}" target="_blank" rel="noopener" data-magnetic><span>${fbIco}Aerial Hunter on Facebook</span></a>
  </div>
</section>`;
  return page({ root, path: 'about/', title: 'About', desc: 'Aerial Hunter is a thermal drone search service based in Rockville, Indiana, serving the whole state, run by a certified Part 107 pilot.', body, cls: 'p-about' });
}

/* ---------- FAQ ---------- */
export function faq() {
  const root = '../';
  const body = `
<section class="phero wrap">
  <p class="eyebrow" data-fade>FAQ</p>
  <h1 class="h-xxl" data-split="hero">Good questions.</h1>
  <p class="lead phero-lede" data-fade>Straight answers about thermal search, the rules in Indiana, the weather, and what it costs.</p>
</section>
<section class="faq-p wrap">
  <div class="chips" data-faq-filter role="group" aria-label="Filter questions">${faqCats.map(([k, t], i) => `<button class="chip${i ? '' : ' on'}" type="button" data-f="${k}" aria-pressed="${i ? 'false' : 'true'}">${t}<sup>${k === 'all' ? faqs.length : faqs.filter(f => f[0] === k).length}</sup></button>`).join('')}</div>
  <div class="faq-list">${faqs.map((f, k) => `<details class="acc" data-cat="${f[0]}"><summary><span class="acc-t">${f[1]}</span><span class="acc-x" aria-hidden="true"></span></summary><div class="acc-b"><div class="acc-in"><p>${f[2]}</p>${f[3] ? `<a class="link-arrow" href="${f[3][1]}" target="_blank" rel="noopener">${f[3][0]} ↗</a>` : ''}</div></div></details>`).join('')}</div>
</section>`;
  return page({ root, path: 'faq/', title: 'FAQ', desc: 'Answers about thermal drone deer recovery, lost pet searches, Indiana drone rules, weather limits and pricing.', body, cls: 'p-faq' });
}

/* ---------- CONTACT ---------- */
export function contact() {
  const root = '../';
  const body = `
<section class="ct wrap" data-contact>
  <aside class="ct-side">
    <p class="eyebrow" data-fade>Contact</p>
    <h1 class="h-l ct-h" data-split="hero">Tell us what you’re looking for.</h1>
    <a class="ct-call" href="${TEL}" data-fade data-cursor="Call"><span class="mono">Fastest: call now</span><span class="ct-num">${phoneIco}${PHONE}</span></a>
    <p class="mute ct-note" data-fade>Or answer a few questions below. At the end, we’ll put your answers into a text message to ${PHONE} that you send from your own phone, so nothing gets lost.</p>
    <ol class="ct-steps mono" data-steps></ol>
  </aside>
  <div class="ct-main">
    <div class="ct-prog"><span data-prog></span></div>
    <form data-form novalidate>
      <div class="ct-stage" data-stage aria-live="polite"></div>
      <div class="ct-nav" data-nav>
        <button class="btn btn-ghost" type="button" data-back hidden><span>Back</span></button>
        <button class="btn" type="submit" data-next><span>Continue</span></button>
      </div>
    </form>
  </div>
</section>`;
  return page({ root, path: 'contact/', title: 'Contact', desc: 'Call 765-592-5970 or send the details of your deer recovery, lost pet or survey job to Aerial Hunter.', body, cls: 'p-contact', scripts: ['contact.js'], cta: false });
}

export function notFound() {
  const root = '/aerial-hunter/';
  const body = `<section class="phero wrap nf404">
  <p class="eyebrow">404 · No signature</p>
  <h1 class="h-xxl" data-split="hero">Nothing out here.</h1>
  <p class="lead phero-lede">We swept the area and this page isn’t on it.</p>
  <div class="hero-ctas"><a class="btn" href="${root}"><span>Back to home ${arrow}</span></a>${callBtn('btn-ghost')}</div>
</section>`;
  return page({ root, path: '404', title: 'Page not found', desc: 'Page not found.', body, cls: 'p-404' });
}
