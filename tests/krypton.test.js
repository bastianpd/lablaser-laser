import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import { LEVELS, LINES, IONIZATION_CM1 } from '../src/lasers/krypton/data.js';
import { transition, airNm, vacuumNm, wavenumberToEV, region } from '../src/lasers/krypton/spectroscopy.js';
describe('Kr II data cross-check (NIST levels vs Bridges & Chester 1965)', () => {
  for (const l of LINES) it(`${l.id}: NIST energy difference reproduces the 1965 calculated wavelength`, () => {
    const t = transition(l); expect(Math.abs(t.airNm * 10 - l.calcA)).toBeLessThan(0.35); expect(Math.abs(t.airNm * 10 - l.obsA)).toBeLessThan(0.8);
  });
  it('upper levels lie above lower levels; 5p above 5s', () => { for (const l of LINES) expect(LEVELS[l.up].E).toBeGreaterThan(LEVELS[l.lo].E); });
  it('known visible lines: 647.1, 676.4, 568.2, 530.9, 520.8 nm', () => { const nm = LINES.map((l) => transition(l).airNm); for (const w of [647.1, 676.4, 568.2, 530.9, 520.8]) expect(nm.some((x) => Math.abs(x - w) < 0.1)).toBe(true); });
  it('ionization energy 14.00 eV; 5p 4P5/2 level 16.60 eV (matches independent table)', () => { expect(wavenumberToEV(IONIZATION_CM1)).toBeCloseTo(14.0, 2); expect(wavenumberToEV(LEVELS.p52a.E)).toBeCloseTo(16.6, 2); });
  it('photon energy = hc/λ', () => { const t = transition(LINES.find((l) => l.id === 'L6471')); expect(t.eV * (t.vacNm)).toBeCloseTo(1239.84, 1); });
  it('air/vacuum conversion and spectral regions', () => { expect(airNm(647.27)).toBeCloseTo(647.09, 1); expect(vacuumNm(15454)).toBeCloseTo(647.1, 0); expect(region(647)).toBe('red'); expect(region(568)).toBe('yellow'); expect(region(531)).toBe('green'); });
  it('Kr model is independent of the generic four-level model', () => { for (const f of ['data', 'spectroscopy']) expect(fs.readFileSync(`src/lasers/krypton/${f}.js`, 'utf8')).not.toMatch(/laserFourLevel|rateEquations|laserThreeLevel/); });
});
