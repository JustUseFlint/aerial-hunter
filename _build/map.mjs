/* Stylized outline of Indiana for the service-area map. Not a survey and not to scale. */
const W = 440, H = 700, PAD = 36;
const LON = [-88.22, -84.62];
const LAT = [41.86, 37.64];

function P(lon, lat) {
  const x = PAD + (lon - LON[0]) / (LON[1] - LON[0]) * (W - PAD * 2);
  const y = PAD + (LAT[0] - lat) / (LAT[0] - LAT[1]) * (H - PAD * 2);
  return [x, y];
}
function d(pts, close = true) {
  return pts.map((p, i) => `${i ? 'L' : 'M'}${P(...p).map(n => n.toFixed(1)).join(',')}`).join('') + (close ? 'Z' : '');
}

/* Clockwise from the Illinois–Lake Michigan corner. */
const OUTLINE = [
  [-87.528, 41.708],
  [-87.42, 41.755],
  [-87.20, 41.760],
  [-86.90, 41.761],
  [-86.50, 41.761],
  [-86.00, 41.761],
  [-85.50, 41.761],
  [-85.00, 41.761],
  [-84.806, 41.761], // IN–MI–OH
  [-84.806, 41.20],
  [-84.806, 40.70],
  [-84.806, 40.20],
  [-84.806, 39.70],
  [-84.806, 39.20],
  [-84.809, 38.80],
  [-84.812, 38.45],
  // Ohio River, east to southwest
  [-84.82, 38.27],
  [-84.90, 38.14],
  [-85.13, 38.28],
  [-85.40, 38.18],
  [-85.62, 38.04],
  [-85.78, 38.02],
  [-86.00, 38.03],
  [-86.25, 37.96],
  [-86.50, 37.90],
  [-86.78, 37.93],
  [-87.00, 37.84],
  [-87.20, 37.80],
  [-87.45, 37.86],
  [-87.65, 37.78],
  [-87.90, 37.84],
  [-88.10, 37.78], // Wabash mouth
  // Wabash / Illinois line north
  [-88.04, 38.00],
  [-87.90, 38.22],
  [-87.78, 38.45],
  [-87.65, 38.70],
  [-87.58, 38.95],
  [-87.532, 39.14],
  [-87.526, 39.50],
  [-87.526, 39.90],
  [-87.526, 40.30],
  [-87.526, 40.75],
  [-87.526, 41.20],
  [-87.528, 41.55]
];

const ROCKVILLE = [-87.229, 39.762];

function milesRadius(lon, lat, miles) {
  const dLat = miles / 69.0;
  const dLon = miles / (69.0 * Math.cos(lat * Math.PI / 180));
  const [cx, cy] = P(lon, lat);
  const [ex] = P(lon + dLon, lat);
  const [, ny] = P(lon, lat + dLat);
  return { cx, cy, rx: Math.abs(ex - cx), ry: Math.abs(cy - ny) };
}

export function mapSVG({ small = false } = {}) {
  const [rx, ry] = P(...ROCKVILLE);
  const ring = milesRadius(ROCKVILLE[0], ROCKVILLE[1], 50);
  const label = small
    ? 'Stylized map of Indiana, with a marker at Rockville, the home base'
    : 'Stylized map of Indiana. Aerial Hunter is based in Rockville and searches the whole state. A dashed ring marks 50 miles from Rockville, after which travel is $1 per mile.';
  const namePt = P(-85.55, 40.95);
  const ringTop = ring.cy - ring.ry - 12;
  return `<svg class="map in-map${small ? ' map-s' : ''}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${label}">
  <path class="in-p" d="${d(OUTLINE)}" pathLength="1"/>
  ${small ? '' : `<ellipse class="in-ring" cx="${ring.cx.toFixed(1)}" cy="${ring.cy.toFixed(1)}" rx="${ring.rx.toFixed(1)}" ry="${ring.ry.toFixed(1)}" fill="none"/>
  <text class="in-ring-l" x="${ring.cx.toFixed(1)}" y="${ringTop.toFixed(1)}">50 miles</text>`}
  <g class="twn twn-b in-pin">
    <circle cx="${rx.toFixed(1)}" cy="${ry.toFixed(1)}" r="${small ? 5 : 6}"/>
    <text x="${(rx + 11).toFixed(1)}" y="${(ry + 4).toFixed(1)}">Rockville</text>
  </g>
  ${small ? '' : `<text class="in-name" x="${namePt[0].toFixed(1)}" y="${namePt[1].toFixed(1)}">INDIANA</text>`}
</svg>`;
}
