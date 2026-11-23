// Passive-cavity physics for the standing-wave and mode-comb views (independent of React).
// Units: L in cm, frequencies in GHz, time in ns, gain in cm^-1. Cavity filled with a medium of refractive index nr (default 1).
import { toInternal } from './parameters.js';
import { belowThresholdSteadyState } from './steadyState.js';
import { lossRate } from './opticalGain.js';
export const C_CM_PER_NS = 29.9792458;
/** Free spectral range = mode spacing: Δν = c / (2 nr L). Allowed frequencies: f_n = n·Δν. */
export const fsrGHz = (L, nr = 1) => C_CM_PER_NS / (2 * nr * L);
export const modeFrequencyGHz = (n, L, nr = 1) => n * fsrGHz(L, nr);
/** Number of half-wavelengths in the cavity at wavelength λ: n = 2 nr L / λ (resonant when an integer). */
export const modeNumber = (lambdaNm, L, nr = 1) => (2 * nr * L * 1e7) / lambdaNm;
export const opticalFrequencyGHz = (lambdaNm) => C_CM_PER_NS / (lambdaNm * 1e-7);
/** Field amplitude kept per round trip, tied to the simulator's photon lifetime: intensity decays as exp(-T_rt/τc), T_rt = 2 nr L / c. */
export const roundTripAmplitude = (L, tauC, nr = 1) => Math.exp(-(nr * L) / (C_CM_PER_NS * tauC));
/** Circulating-intensity build-up relative to exact resonance (Airy response). delta = detuning in units of the FSR; 1 at delta = 0. */
export const buildUp = (delta, r) => (1 - r) ** 2 / (1 + r * r - 2 * r * Math.cos(2 * Math.PI * delta));
/** Lorentzian gain lineshape, FWHM = bw (illustrative linewidth). */
export const gainShape = (df, bw) => 1 / (1 + (2 * df / bw) ** 2);
/** Unsaturated (small-signal) modal gain from the pump, Γ σ N_tot (n2−n1) with S = 0 [cm^-1]. */
export function smallSignalModalGain(params) { const P = toInternal(params), s = belowThresholdSteadyState(P); return P.gamma * P.sigma * P.Ntot * (s.n2 - s.n1); }
/** Forward wave, backward wave and their sum along the cavity, u = x/L in [0,1] (HR→OC); k = half-wavelengths (m + delta). Sum = 0 at the OC always, and at the HR only at delta = 0. */
export function waves(u, k, theta) { const kL = Math.PI * k, f = Math.cos(kL * u - theta), b = -Math.cos(kL * (2 - u) - theta); return { f, b, sum: f + b }; }
/** Resonance offsets (GHz from the line centre) inside ±window. delta shifts the comb relative to the line centre. */
export function modeComb(L, delta, window, nr = 1) { const f = fsrGHz(L, nr), jm = Math.ceil(window / f) + 1, out = []; for (let j = -jm; j <= jm; j++) { const off = (j - delta) * f; if (Math.abs(off) <= window) out.push({ j, off }); } return out; }
/** Which resonances see small-signal gain >= loss (candidates to oscillate); weights are illustrative (share of the excess gain). */
export function modeStates(params, L, delta, bw, nr = 1) {
  const g0 = smallSignalModalGain(params), P = toInternal(params), loss = lossRate(P.vg, P.tauC);
  const ms = modeComb(L, delta, 1.5 * bw, nr).map((m) => { const g = g0 * gainShape(m.off, bw); return { ...m, g, lasing: g >= loss, excess: Math.max(0, g - loss) }; }), tot = ms.reduce((s, m) => s + m.excess, 0);
  return ms.map((m) => ({ ...m, weight: tot ? m.excess / tot : 0 }));
}
/** Display level 0..1 from photon density (log scale: 0 below 1e10, 1 at 1e18 cm^-3). */
export const outputLevel = (S) => Math.min(1, Math.max(0, (Math.log10(Math.max(S, 1)) - 10) / 8));
