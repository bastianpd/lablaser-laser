// Energy-threshold model of the discharge steps (qualitative; no rates, cross-sections or power are modelled: no sourced data).
// Step 1: electron impact ionizes Kr (>= ionization energy). Step 2: a further electron collision excites Kr+ from its ground level to the
// upper laser level (>= that level's energy above the Kr+ ground level). Energies come from NIST levels (see data.js).
import { LEVELS, LINES, IONIZATION_CM1 } from './data.js';
import { wavenumberToEV } from './spectroscopy.js';
export const IONIZATION_EV = wavenumberToEV(IONIZATION_CM1);
export const thresholds = (line) => { const exciteEV = wavenumberToEV(LEVELS[line.up].E); return { ionEV: IONIZATION_EV, exciteEV, fromNeutralEV: IONIZATION_EV + exciteEV }; };
export const reachableLines = (eV, lines = LINES) => (eV >= IONIZATION_EV ? lines.filter((l) => eV >= thresholds(l).exciteEV) : []);
