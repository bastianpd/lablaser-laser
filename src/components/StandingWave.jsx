import React from 'react';
import { waves } from '../physics/cavityModes.js';
import { largestRemainder } from '../physics/visualModel.js';
const X0 = 40, W = 440, N = 220, ROW = { f: 46, b: 100, s: 172 }, COL = ['#8b7bff', '#b36bff', '#8d97ad', '#6e7a96'];
const pts = (fn, cy, A) => Array.from({ length: N + 1 }, (_, i) => `${X0 + (W * i) / N},${cy - A * fn(i / N)}`).join(' ');
// Forward (blue) and backward (orange) waves and their sum (green). Amplitude ∝ sqrt(build-up B); phase advances with simulated time t.
export default function StandingWave({ state, t, half, delta, B }) {
  const th = t * 0.04, A = 15 * Math.sqrt(B), k = half + delta, w = (u) => waves(u, k, th);
  const counts = largestRemainder([state.n3, state.n2, state.n1, state.n0], 30), atoms = counts.flatMap((c, l) => Array(c).fill(COL[l]));
  const nodes = Array.from({ length: Math.floor(k) + 1 }, (_, j) => 1 - j / k).filter((u) => u >= -1e-9);
  const env = (s) => pts((u) => s * 2 * Math.abs(Math.sin(Math.PI * k * (u - 1))), ROW.s, A);
  return (<svg viewBox="0 0 520 250" className="diagram" role="img" aria-label="Waves inside the cavity: forward, backward and standing wave">
    <rect x="28" y="14" width="12" height="206" fill="#9fb3d9" /><rect x="480" y="14" width="12" height="206" fill="#9fb3d9" opacity=".55" /><rect x={X0} y="14" width={W} height="206" fill="none" stroke="#3a4a78" strokeDasharray="4 3" />
    <text x="14" y="10" fill="#c9d4ee" fontSize="10">HR</text><text x="474" y="10" fill="#c9d4ee" fontSize="10">OC</text>
    <text x="46" y="28" fill="#4aa3ff" fontSize="10">forward wave (HR → OC)</text><text x="46" y="84" fill="#ff9f43" fontSize="10">backward wave (OC → HR)</text><text x="46" y="140" fill="#3ddc97" fontSize="10">sum = standing wave (nodes ○)</text>
    <polyline fill="none" stroke="#4aa3ff" strokeWidth="1.8" points={pts((u) => w(u).f, ROW.f, A)} /><polyline fill="none" stroke="#ff9f43" strokeWidth="1.8" points={pts((u) => w(u).b, ROW.b, A)} />
    <polyline fill="none" stroke="#3ddc97" strokeWidth="2.4" points={pts((u) => w(u).sum, ROW.s, A)} />
    <polyline fill="none" stroke="#3ddc97" strokeWidth=".7" strokeDasharray="3 3" opacity=".6" points={env(1)} /><polyline fill="none" stroke="#3ddc97" strokeWidth=".7" strokeDasharray="3 3" opacity=".6" points={env(-1)} />
    {nodes.map((u, i) => <circle key={i} cx={X0 + W * u} cy={ROW.s} r="3.5" fill="none" stroke="#fff" />)}
    {atoms.map((c, i) => <circle key={i} data-kind="atom" cx={X0 + 8 + ((i * 0.618034) % 1) * (W - 16)} cy={226 + ((i * 7) % 5) * 3} r="3.4" fill={c} />)}
    <text x={X0} y="248" fill="#9fb0d3" fontSize="9">atoms of the gain medium: purple = E2 (excited), grey = E1/E0, blue-violet = E3</text></svg>);
}
