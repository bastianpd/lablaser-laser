import { LEVELS } from './data.js';
export const HC_EV_CM = 1.239841984e-4; // eV per cm^-1
export const wavenumberToEV = (k) => k * HC_EV_CM;
export const vacuumNm = (k) => 1e7 / k;
/** Vacuum -> standard-air wavelength (Edlén 1966 dispersion formula; 15 °C, 760 Torr). */
export function airNm(vac) { const s = 1000 / vac, n = 1 + (8342.13 + 2406030 / (130 - s * s) + 15997 / (38.9 - s * s)) * 1e-8; return vac / n; }
export function transition(line) {
  const dE = LEVELS[line.up].E - LEVELS[line.lo].E, vac = vacuumNm(dE);
  return { dE, eV: wavenumberToEV(dE), vacNm: vac, airNm: airNm(vac), upEV: wavenumberToEV(LEVELS[line.up].E), loEV: wavenumberToEV(LEVELS[line.lo].E) };
}
export const region = (nm) => (nm < 380 ? 'ultraviolet' : nm < 450 ? 'violet' : nm < 495 ? 'blue' : nm < 565 ? 'green' : nm < 590 ? 'yellow' : nm < 620 ? 'orange' : nm <= 750 ? 'red' : 'near-infrared');
/** (Band edges are approximate: 568.2 nm is called yellow in the cited sources.) */
/** Approximate display colour only (not colorimetric). */
export function nmToRGB(nm) {
  const w = nm; let r = 0, g = 0, b = 0;
  if (w < 440) { r = (440 - w) / 60; b = 1; } else if (w < 490) { g = (w - 440) / 50; b = 1; } else if (w < 510) { g = 1; b = (510 - w) / 20; } else if (w < 580) { r = (w - 510) / 70; g = 1; } else if (w < 645) { r = 1; g = (645 - w) / 65; } else { r = 1; }
  return `rgb(${Math.round(255 * r)},${Math.round(255 * g)},${Math.round(255 * b)})`;
}
