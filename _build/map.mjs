import { counties } from './data.mjs';
const LON0 = -87.58, LAT0 = 40.25, K = 560;
const P = ([lon, lat]) => [((lon - LON0) * K).toFixed(1), ((LAT0 - lat) * K * 1.3).toFixed(1)];
const W = ((-86.64 - LON0) * K).toFixed(0), H = ((LAT0 - 39.30) * K * 1.3).toFixed(0);
const river = [[-87.47, 40.25], [-87.44, 40.15], [-87.40, 40.03], [-87.385, 39.95], [-87.395, 39.88], [-87.38, 39.80], [-87.39, 39.72], [-87.383, 39.66], [-87.41, 39.61], [-87.44, 39.52], [-87.43, 39.42], [-87.47, 39.30]];
const R = (a, b) => river.filter(([, la]) => la <= a && la >= b);
const shapes = {
  vermillion: [[-87.53, 40.25], ...R(40.25, 39.61), [-87.53, 39.61]],
  fountain: [...R(40.25, 39.95), [-87.09, 39.95], [-87.09, 40.25]],
  parke: [...R(39.95, 39.61), [-87.01, 39.61], [-87.01, 39.95]],
  montgomery: [[-87.09, 40.25], [-86.69, 40.25], [-86.69, 39.86], [-87.01, 39.86], [-87.01, 39.95], [-87.09, 39.95]],
  putnam: [[-87.01, 39.86], [-86.69, 39.86], [-86.69, 39.47], [-87.01, 39.47]],
  clay: [[-87.24, 39.61], [-87.01, 39.61], [-87.01, 39.47], [-86.94, 39.47], [-86.94, 39.30], [-87.24, 39.30]],
  vigo: [[-87.53, 39.61], [-87.41, 39.61], [-87.24, 39.61], [-87.24, 39.30], [-87.53, 39.30]]
};
const label = { vermillion: [-87.475, 39.97], fountain: [-87.24, 40.11], parke: [-87.2, 39.79], montgomery: [-86.86, 40.07], putnam: [-86.85, 39.67], clay: [-87.12, 39.40], vigo: [-87.37, 39.40] };
const towns = [['Rockville', -87.229, 39.762, 1], ['Montezuma', -87.37, 39.793], ['Marshall', -87.188, 39.848], ['Rosedale', -87.283, 39.623], ['Mecca', -87.33, 39.727], ['Bridgeton', -87.178, 39.649], ['Bloomingdale', -87.25, 39.833],
  ['Newport', -87.43, 39.884], ['Covington', -87.395, 40.14], ['Crawfordsville', -86.874, 40.041], ['Greencastle', -86.865, 39.645], ['Brazil', -87.125, 39.524], ['Terre Haute', -87.413, 39.467]];
const path = pts => 'M' + pts.map(P).map(p => p.join(' ')).join('L') + 'Z';
const line = pts => 'M' + pts.map(P).map(p => p.join(' ')).join('L');
const sugar = [[-86.70, 40.08], [-86.86, 40.03], [-86.98, 39.99], [-87.10, 39.93], [-87.20, 39.885], [-87.29, 39.865], [-87.38, 39.84]];
const raccoon = [[-86.80, 39.84], [-86.95, 39.79], [-87.07, 39.75], [-87.17, 39.71], [-87.28, 39.67], [-87.383, 39.66]];

export function mapSVG({ small = false } = {}) {
  const [rx, ry] = P([-87.229, 39.762]);
  const grat = [];
  for (let lo = -87.5; lo <= -86.7; lo += 0.1) { const [x] = P([lo, 0]); grat.push(`<path d="M${x} 0V${H}"/>`); }
  for (let la = 39.3; la <= 40.25; la += 0.1) { const [, y] = P([0, la]); grat.push(`<path d="M0 ${y}H${W}"/>`); }
  return `<svg class="map${small ? ' map-s' : ''}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Stylized map of Parke County, Indiana and the six surrounding counties: Vermillion, Fountain, Montgomery, Putnam, Clay and Vigo">
  <defs><radialGradient id="mg${small ? 's' : ''}"><stop offset="0" stop-color="#5CE1E6" stop-opacity=".22"/><stop offset="1" stop-color="#5CE1E6" stop-opacity="0"/></radialGradient></defs>
  <g class="m-grat" aria-hidden="true">${grat.join('')}</g>
  <g class="m-cty">${counties.map(c => `<g class="cty${c.home ? ' is-home' : ''}" data-c="${c.id}"${small ? '' : ` tabindex="0" role="button" aria-label="${c.name} County"`}><path class="cty-p" d="${path(shapes[c.id])}" pathLength="1"/><text x="${P(label[c.id])[0]}" y="${P(label[c.id])[1]}" class="cty-l">${c.name.toUpperCase()}</text></g>`).join('')}</g>
  <g class="m-water" aria-hidden="true"><path class="riv" d="${line(river)}"/><path class="crk" d="${line(sugar)}"/><path class="crk" d="${line(raccoon)}"/></g>
  <g class="m-radar" aria-hidden="true"><circle cx="${rx}" cy="${ry}" r="150" fill="url(#mg${small ? 's' : ''})"/><circle class="rr rr1" cx="${rx}" cy="${ry}" r="40"/><circle class="rr rr2" cx="${rx}" cy="${ry}" r="40"/><circle class="rr rr3" cx="${rx}" cy="${ry}" r="40"/></g>
  <g class="m-towns" aria-hidden="true">${towns.map(([n, lo, la, big]) => { const [x, y] = P([lo, la]); return `<g class="twn${big ? ' twn-b' : ''}"><circle cx="${x}" cy="${y}" r="${big ? 4.5 : 2.6}"/><text x="${+x + 7}" y="${+y + 3.5}">${n}</text></g>`; }).join('')}</g>
  ${small ? '' : `<g class="m-legend mono" aria-hidden="true"><text x="12" y="${H - 34}">WABASH RIVER</text><path class="riv" d="M12 ${H - 24}h40"/><text x="12" y="${H - 8}">NOT TO SCALE · STYLIZED</text></g>`}
</svg>`;
}
