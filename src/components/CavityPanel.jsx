import React, { useState } from 'react';
import StandingWave from './StandingWave.jsx';
import ModeComb from './ModeComb.jsx';
import { toInternal } from '../physics/laserFourLevel.js';
import { fsrGHz, modeNumber, opticalFrequencyGHz, roundTripAmplitude, buildUp, smallSignalModalGain, modeStates } from '../physics/cavityModes.js';
export default function CavityPanel({ sim, p, lambda, L: st }) {
  const [L, setL] = useState(30), [delta, setDelta] = useState(0), [bw, setBw] = useState(3), [half, setHalf] = useState(6);
  const P = toInternal(p), r = roundTripAmplitude(L, P.tauC), B = buildUp(delta, r), fsr = fsrGHz(L), n = modeNumber(lambda, L), nInt = Math.round(n);
  const states = modeStates(p, L, delta, bw), g0 = smallSignalModalGain(p), count = states.filter((m) => m.lasing).length, kind = B >= 0.9 ? 'constructive' : B <= 0.3 ? 'destructive' : 'partial';
  const photons = sim.state.S * 0.01 * L, sl = (label, v, set, min, max, step, show) => <label className="row">{label} = {show}<input type="range" aria-label={label} min={min} max={max} step={step} value={v} onChange={(e) => set(+e.target.value)} /></label>;
  return (<section style={{ gridColumn: '1 / -1' }}><h2>The cavity: standing waves, modes and gain</h2>
    <p>Light bounces between the HR mirror and the output coupler (OC). The forward and backward waves add up. Only when the round trip fits a whole number of half-wavelengths (L = n·λ/2) do they stay in phase and build a <b>standing wave</b> (constructive interference): the field grows each pass and stimulated emission fills the mode with photons. Otherwise the waves cancel (destructive interference). That is why only the frequencies f = n·c/2L survive, and the gain curve decides which of them can oscillate.</p>
    <div className="grid"><div>{sl('Cavity length L (cm)', L, setL, 10, 150, 1, L)}{sl('Cavity tuning δ (fraction of FSR)', delta, setDelta, -0.5, 0.5, 0.01, delta.toFixed(2))}{sl('Gain bandwidth (GHz, illustrative)', bw, setBw, 0.5, 10, 0.1, bw.toFixed(1))}{sl('Half-wavelengths shown (scaled view)', half, setHalf, 1, 10, 1, half)}
      <dl><dt>Mode spacing (FSR) c/2L</dt><dd data-testid="fsr">{fsr.toFixed(4)} GHz</dd><dt>Real mode number</dt><dd data-testid="mode-n">n = 2L/λ ≈ {n.toExponential(3)}</dd><dt>Nearest resonance f_n = n·c/2L</dt><dd>{((nInt * fsr) / 1000).toFixed(3)} THz (line centre {(opticalFrequencyGHz(lambda) / 1000).toFixed(3)} THz)</dd>
        <dt>Round-trip phase / interference</dt><dd data-testid="buildup" className={B >= 0.9 ? 'pos' : B <= 0.3 ? 'neg' : ''}>{(360 * delta).toFixed(0)}° → {kind} (circulating field ×{B.toFixed(2)})</dd><dt>Modes above threshold</dt><dd data-testid="lasing-count">{count} of {states.length} modes</dd>
        <dt>Photon density now</dt><dd>{sim.state.S.toExponential(2)} cm⁻³ ≈ {photons.toExponential(1)} photons for an assumed 1 mm² beam</dd></dl>
      <p className="note">The scaled view draws {half} half-wavelengths instead of the real ~{n.toExponential(1)}. The gain curve and bars follow the running simulation (pump, loss and S). The linewidth and the split of power among modes are illustrative. In a homogeneously broadened medium mode competition usually leaves one mode; Doppler-broadened gas lasers can run several.</p></div>
      <div><StandingWave state={sim.state} t={sim.t} half={half} delta={delta} B={B} /><ModeComb states={states} g0={g0} gNow={st.modal} loss={st.loss} bw={bw} S={sim.state.S} fsr={fsr} /></div></div></section>);
}
