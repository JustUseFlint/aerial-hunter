import { PHONE, TEL, SMS, FB, services } from './data.mjs';
export const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const DIMS = { 'thermal-dog': [1152, 864], 'land-ortho': [1152, 864], 'thermal-herd': [1152, 864], 'pilot-dusk': [864, 1152], cover: [1152, 1536], 'recovery-real': [960, 963] };
export const img = (root, n, alt = '', cls = '', extra = '') => { const [w, h] = DIMS[n] || [1280, 720]; return `<img src="${root}assets/img/${n}.webp" alt="${esc(alt)}" width="${w}" height="${h}" loading="lazy" decoding="async"${cls ? ` class="${cls}"` : ''}${extra ? ' ' + extra : ''}>`; };
export const pic = (root, name, alt, { w = 1200, h = 1600, sizes = '(max-width: 900px) 100vw, 46vw' } = {}) => {
  const base = `${root}assets/img/${name}`;
  return `<picture>
    <source type="image/webp" srcset="${base}-sm.webp 600w, ${base}.webp 1200w" sizes="${sizes}">
    <source type="image/jpeg" srcset="${base}-sm.jpg 600w, ${base}.jpg 1200w" sizes="${sizes}">
    <img src="${base}.jpg" alt="${esc(alt)}" width="${w}" height="${h}" loading="lazy" decoding="async">
  </picture>`;
};
export const arrow = `<svg class="arr" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>`;
export const phoneIco = `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 3.5l2.6.3 1.2 4-2 1.6a12 12 0 006.2 6.2l1.6-2 4 1.2.3 2.6c0 1-.9 2-2 2C10.8 19.4 4.6 13.2 4.6 5.5c0-1.1 1-2 2-2z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>`;
export const smsIco = `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v11H9l-5 4z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>`;
export const fbIco = `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 8h3V4h-3c-2.2 0-4 1.8-4 4v2H8v4h2v7h4v-7h3l1-4h-4V8.5c0-.3.2-.5.5-.5z" fill="currentColor"/></svg>`;
export const logo = (root, cls = '') => `<span class="logo ${cls}"><img src="${root}assets/img/logo-sm.png" alt="" width="412" height="202"><span class="logo-t"><b>Aerial Hunter</b><i>Hunt. Search. Find.</i></span></span>`;
export const callBtn = (cls = '', label = PHONE) => `<a class="btn btn-call ${cls}" href="${TEL}" data-magnetic data-cursor="Call"><span>${phoneIco}${label}</span></a>`;
export { PHONE, TEL, SMS, FB };

const NAV = [['Services', 'services/'], ['How it works', 'how-it-works/'], ['Service area', 'service-area/'], ['About', 'about/'], ['FAQ', 'faq/']];

export function header(root, path) {
  const cur = p => path.startsWith(p) ? ' aria-current="page"' : '';
  return `<a class="skip" href="#main">Skip to content</a>
<header class="hdr" data-hdr>
  <div class="hdr-in">
    <a class="hdr-logo" href="${root}" aria-label="Aerial Hunter home">${logo(root)}</a>
    <nav class="hdr-nav" aria-label="Primary">${NAV.map(([t, h]) => `<a href="${root}${h}"${cur(h)} class="ul">${t}</a>`).join('')}</nav>
    <div class="hdr-r">
      <span class="hdr-status mono"><i></i>Parke Co., IN</span>
      <a class="btn btn-sm hdr-cta" href="${TEL}" data-magnetic><span>${phoneIco}${PHONE}</span></a>
      <a class="hdr-callm" href="${TEL}" aria-label="Call ${PHONE}">${phoneIco}</a>
      <button class="menu-btn" type="button" aria-expanded="false" aria-controls="menu" data-menu-btn><span class="mb-t"><span>Menu</span><span>Close</span></span><span class="mb-i"><i></i><i></i></span></button>
    </div>
  </div>
</header>
<div class="menu" id="menu" data-menu aria-hidden="true">
  <nav class="menu-nav" aria-label="Mobile">${[['Home', ''], ...NAV, ['Contact', 'contact/']].map(([t, h]) => `<a href="${root}${h}"><span class="mn-t">${t}</span></a>`).join('')}</nav>
  <div class="menu-foot">
    <a class="menu-call" href="${TEL}">${phoneIco}<span><span class="eyebrow">Call or text</span>${PHONE}</span></a>
    <a class="ul mono" href="${FB}" target="_blank" rel="noopener">Facebook ↗</a>
  </div>
</div>`;
}

export function footer(root, { cta = true } = {}) {
  return `${cta ? `<section class="cta-band" aria-labelledby="cta-h">
  <div class="cta-scan" aria-hidden="true"></div>
  <div class="wrap cta-in">
    <p class="eyebrow">Lost something out there?</p>
    <h2 id="cta-h" class="h-xl cta-h" data-split>Call now. Time&nbsp;matters.</h2>
    <div class="cta-row">
      <a class="cta-phone" href="${TEL}" data-cursor="Call"><span class="mono">Tap to call</span><span class="cta-num">${PHONE.replace(/-/g, '<i>-</i>')}</span></a>
      <div class="cta-side">
        <p>Deer recovery, lost pets, herd counts and land checks across Parke County and the surrounding counties. Rates are on the Services page; call or text to get started.</p>
        <div class="cta-btns"><a class="btn btn-ghost" href="${SMS}"><span>${smsIco}Text instead</span></a><a class="btn btn-ghost" href="${root}contact/"><span>Send details ${arrow}</span></a></div>
      </div>
    </div>
  </div>
</section>` : ''}
<footer class="ftr">
  <div class="wrap">
    <div class="ftr-grid">
      <div class="ftr-col ftr-brand">
        <img src="${root}assets/img/logo-sm.png" alt="Aerial Hunters logo: Hunt. Search. Find." width="412" height="202" loading="lazy" class="ftr-logo">
        <p class="ftr-copy">Thermal drone search and recovery from a certified Part 107 pilot, based in Parke County, Indiana.</p>
      </div>
      <div class="ftr-col">
        <p class="eyebrow">Services</p>
        <ul class="ftr-links">${services.map(s => `<li><a class="ul" href="${root}services/${s.slug}/">${s.short}</a></li>`).join('')}</ul>
      </div>
      <div class="ftr-col">
        <p class="eyebrow">Explore</p>
        <ul class="ftr-links">${[['How it works', 'how-it-works/'], ['Service area', 'service-area/'], ['About', 'about/'], ['FAQ', 'faq/'], ['Contact', 'contact/']].map(([t, h]) => `<li><a class="ul" href="${root}${h}">${t}</a></li>`).join('')}</ul>
      </div>
      <div class="ftr-col">
        <p class="eyebrow">Reach us</p>
        <ul class="ftr-links">
          <li><a class="ul" href="${TEL}">Call ${PHONE}</a></li>
          <li><a class="ul" href="${SMS}">Text ${PHONE}</a></li>
          <li><a class="ul" href="${FB}" target="_blank" rel="noopener">Facebook ↗</a></li>
        </ul>
      </div>
    </div>
  </div>
  <div class="ftr-wm" data-wm aria-hidden="true">${'HUNT.SEARCH.FIND.'.split('').map(c => `<span${c === '.' ? ' class="dot"' : ''}>${c}</span>`).join('')}</div>
  <div class="wrap ftr-base mono">
    <span>© 2026 Aerial Hunter · Parke County, Indiana</span>
    <span>Parke · Vermillion · Fountain · Montgomery · Putnam · Clay · Vigo</span>
    <a href="#top" class="ul">Back to top ↑</a>
  </div>
</footer>
<nav class="callbar" aria-label="Quick contact">
  <a class="cb-call" href="${TEL}">${phoneIco}<span>Call ${PHONE}</span></a>
  <a class="cb-sms" href="${SMS}" aria-label="Text ${PHONE}">${smsIco}<span>Text</span></a>
</nav>`;
}

export function page({ root, path, title, desc, body, cls = '', scripts = [], cta = true }) {
  const fam = ['Archivo:wdth,wght@62..125,300..900', 'JetBrains+Mono:wght@400;500'].map(f => 'family=' + f).join('&');
  const full = title === 'Aerial Hunter' ? 'Aerial Hunter · Thermal drone search & recovery, Parke County, Indiana' : `${title} · Aerial Hunter`;
  return `<!doctype html>
<html lang="en" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(full)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="theme-color" content="#060809">
<meta property="og:title" content="${esc(full)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="https://justuseflint.github.io/aerial-hunter/assets/img/og.jpg">
<meta name="format-detection" content="telephone=no">
<link rel="icon" href="${root}assets/img/favicon.png" type="image/png">
<link rel="apple-touch-icon" href="${root}assets/img/logo-square.png">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?${fam}&display=swap">
<link rel="stylesheet" href="${root}assets/css/site.css?v=466">
<script type="application/ld+json">{"@context":"https://schema.org","@type":"LocalBusiness","name":"Aerial Hunter","slogan":"Hunt. Search. Find.","telephone":"+1-765-592-5970","areaServed":["Parke County, IN","Vermillion County, IN","Fountain County, IN","Montgomery County, IN","Putnam County, IN","Clay County, IN","Vigo County, IN"],"sameAs":["${FB}"],"description":"Thermal drone deer recovery, lost pet recovery and herd and land surveying."}</script>
<script>(function(d,w){var h=d.documentElement;h.className=h.className.replace('no-js','js');var rm=w.matchMedia&&w.matchMedia('(prefers-reduced-motion: reduce)').matches;if(!rm){h.classList.add('motion');try{if(sessionStorage.getItem('ah-pt')==='1')h.classList.add('pt-in')}catch(e){}}else{h.classList.add('no-motion')}setTimeout(function(){if(!w.__ahReady){h.classList.remove('motion','pt-in');h.classList.add('no-motion')}},4000)})(document,window)</script>
</head>
<body class="${cls}" id="top">
<div class="pt" aria-hidden="true"><div class="pt-in-wm"><img src="${root}assets/img/logo-sm.png" alt="" width="412" height="202"></div><span class="pt-scan"></span></div>
${header(root, path)}
<main id="main">
${body}
</main>
${footer(root, { cta })}
<div class="cursor" aria-hidden="true"><i></i><i></i><i></i><i></i><span class="cursor-t"></span></div>
<script src="${root}assets/vendor/gsap.min.js" defer></script>
<script src="${root}assets/vendor/ScrollTrigger.min.js" defer></script>
<script src="${root}assets/vendor/lenis.min.js" defer></script>
<script src="${root}assets/js/site.js?v=466" defer></script>
${scripts.map(s => `<script src="${root}assets/js/${s}?v=466" defer></script>`).join('\n')}
</body>
</html>`;
}
