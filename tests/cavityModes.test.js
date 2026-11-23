import { describe, it, expect } from 'vitest';
import { fsrGHz, modeFrequencyGHz, modeNumber, opticalFrequencyGHz, roundTripAmplitude, buildUp, gainShape, waves, modeComb, modeStates, smallSignalModalGain, outputLevel } from '../src/physics/cavityModes.js';
import { defaultParams as D } from '../src/data/defaultParameters.js';
describe('resonance modes f = n c / 2L', () => {
  it('FSR = c/2L, equal spacing, inversely proportional to L', () => { expect(fsrGHz(30)).toBeCloseTo(0.49965, 4); expect(fsrGHz(60)).toBeCloseTo(fsrGHz(30) / 2, 12); expect(modeFrequencyGHz(5, 30) - modeFrequencyGHz(4, 30)).toBeCloseTo(fsrGHz(30), 9); });
  it('refractive index lowers the FSR', () => expect(fsrGHz(30, 1.5)).toBeCloseTo(fsrGHz(30) / 1.5, 12));
  it('mode number n = 2L/λ and f_n = n c/2L reproduces c/λ', () => { const n = modeNumber(632.8, 30); expect(n).toBeCloseTo(948167.7, -1); expect(Math.abs(modeFrequencyGHz(Math.round(n), 30) - opticalFrequencyGHz(632.8))).toBeLessThanOrEqual(fsrGHz(30) / 2 + 1e-6); });
  it('comb spacing equals FSR and shifts with tuning', () => { const c = modeComb(30, 0, 3), d = modeComb(30, 0.25, 3); expect(c.some((m) => Math.abs(m.off) < 1e-12)).toBe(true); expect(d.some((m) => Math.abs(m.off) < 1e-12)).toBe(false); for (let i = 1; i < c.length; i++) expect(c[i].off - c[i - 1].off).toBeCloseTo(fsrGHz(30), 9); });
});
describe('standing wave and interference', () => {
  it('delta = 0: nodes at both mirrors at every time (constructive)', () => { for (const th of [0, 0.7, 1.9, 3.3]) { expect(Math.abs(waves(0, 6, th).sum)).toBeLessThan(1e-12); expect(Math.abs(waves(1, 6, th).sum)).toBeLessThan(1e-12); } });
  it('delta ≠ 0: the HR node is lost (waves out of phase there); OC node always present', () => { expect(Math.abs(waves(0, 6.25, 0.4).sum)).toBeGreaterThan(0.1); expect(Math.abs(waves(1, 6.25, 0.4).sum)).toBeLessThan(1e-12); });
  it('standing wave: a node at u = 0.5 for k = 6 at every time', () => { for (const th of [0.3, 1.1, 2.5]) expect(Math.abs(waves(0.5, 6, th).sum)).toBeLessThan(1e-12); });
  it('forward and backward waves travel in opposite directions', () => { const a = waves(0.3, 6, 0.0), b = waves(0.3, 6, 0.2); expect(a.f).not.toBeCloseTo(b.f, 3); });
  it('build-up: 1 at resonance, periodic in FSR, Airy minimum at half FSR, falls with detuning', () => {
    const r = roundTripAmplitude(30, 1); expect(buildUp(0, r)).toBeCloseTo(1, 12); expect(buildUp(1, r)).toBeCloseTo(1, 12); expect(buildUp(0.5, r)).toBeCloseTo(((1 - r) / (1 + r)) ** 2, 12); expect(buildUp(0.1, r)).toBeGreaterThan(buildUp(0.3, r)); expect(buildUp(0.3, r)).toBeGreaterThan(buildUp(0.5, r));
  });
  it('lower losses (longer τc) make resonances sharper', () => expect(buildUp(0.25, roundTripAmplitude(30, 5))).toBeLessThan(buildUp(0.25, roundTripAmplitude(30, 0.5))));
});
describe('gain curve and modes above threshold', () => {
  it('Lorentzian: 1 at centre, 1/2 at half the FWHM', () => { expect(gainShape(0, 3)).toBe(1); expect(gainShape(1.5, 3)).toBeCloseTo(0.5, 12); });
  it('no mode oscillates below threshold pump; some do above', () => { expect(modeStates({ ...D, Wp: 0.001 }, 30, 0, 3).filter((m) => m.lasing).length).toBe(0); expect(modeStates({ ...D, Wp: 0.05 }, 30, 0, 3).filter((m) => m.lasing).length).toBeGreaterThan(0); });
  it('more pump or a wider gain curve gives more modes; lasing modes lie inside the gain band', () => {
    const n = (Wp, bw) => modeStates({ ...D, Wp }, 30, 0, bw).filter((m) => m.lasing).length; expect(n(0.05, 3)).toBeGreaterThanOrEqual(n(0.01, 3)); expect(n(0.02, 6)).toBeGreaterThan(n(0.02, 0.5));
    const ms = modeStates({ ...D, Wp: 0.02 }, 30, 0, 3); expect(Math.max(...ms.filter((m) => m.lasing).map((m) => Math.abs(m.off)))).toBeLessThan(0.65 * 3);
  });
  it('shorter cavity gives fewer modes under the same gain curve', () => { const n = (L) => modeStates({ ...D, Wp: 0.02 }, L, 0, 3).filter((m) => m.lasing).length; expect(n(10)).toBeLessThan(n(100)); });
  it('weights sum to 1; small-signal gain grows with pump; output level is log-scaled', () => { const ms = modeStates({ ...D, Wp: 0.02 }, 30, 0, 3); expect(ms.reduce((s, m) => s + m.weight, 0)).toBeCloseTo(1, 12); expect(smallSignalModalGain({ ...D, Wp: 0.02 })).toBeGreaterThan(smallSignalModalGain({ ...D, Wp: 0.005 })); expect(outputLevel(0)).toBe(0); expect(outputLevel(1e14)).toBeCloseTo(0.5, 12); expect(outputLevel(1e20)).toBe(1); });
});
