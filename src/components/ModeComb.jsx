import React from 'react';
import { gainShape, outputLevel } from '../physics/cavityModes.js';
// Small-signal gain (dashed), current gain from the simulation (solid), loss (red). Modes with gain ≥ loss are candidates to oscillate;
// bar height ∝ output level (from S) × illustrative share of the excess gain.
export default function ModeComb({ states, g0, gNow, loss, bw, S, fsr }) {
  const Wd = 1.5 * bw, gmax = Math.max(g0, loss, 1e-9) * 1.15, X = (f) => 260 + (f / Wd) * 235, Y = (g) => 175 - (Math.max(g, 0) / gmax) * 140, lvl = outputLevel(S), wmax = Math.max(1e-12, ...states.map((m) => m.weight));
  const curve = (peak) => Array.from({ length: 81 }, (_, i) => { const f = -Wd + (2 * Wd * i) / 80; return `${X(f)},${Y(peak * gainShape(f, bw))}`; }).join(' '), edge = g0 > loss ? (bw / 2) * Math.sqrt(g0 / loss - 1) : 0;
  return (<svg viewBox="0 0 520 215" className="diagram" role="img" aria-label="Gain curve and allowed cavity modes">
    {edge > 0 && <rect x={X(-edge)} y="20" width={X(edge) - X(-edge)} height="155" fill="#3ddc97" opacity=".1" />}
    <line x1="25" x2="495" y1="175" y2="175" stroke="#3a4a78" /><line x1="25" x2="495" y1={Y(loss)} y2={Y(loss)} stroke="#ff4d5e" strokeDasharray="5 3" /><text x="28" y={Y(loss) - 4} fill="#ff4d5e" fontSize="10">loss αi+αm</text>
    <polyline fill="none" stroke="#9fb0d3" strokeDasharray="4 3" points={curve(g0)} /><polyline fill="none" stroke="#3ddc97" strokeWidth="2.2" points={curve(Math.max(gNow, 0))} />
    {states.map((m) => { const h = m.lasing ? 10 + 120 * lvl * (m.weight / wmax) : 8; return <line key={m.j} data-kind={m.lasing ? 'lasing' : 'mode'} x1={X(m.off)} x2={X(m.off)} y1="175" y2={175 - h} stroke={m.lasing ? '#ff4d5e' : '#6e7a96'} strokeWidth={m.lasing ? 3 : 1.5} />; })}
    <text x="25" y="12" fill="#c9d4ee" fontSize="10">gain (dashed: small-signal from pump · solid: now) vs frequency; ticks = cavity modes f = n·c/2L</text>
    <text x="260" y="192" fill="#c9d4ee" fontSize="10" textAnchor="middle">frequency offset from the line centre (GHz)</text><text x="260" y="206" fill="#9fb0d3" fontSize="9" textAnchor="middle">mode spacing (FSR) = {fsr.toFixed(3)} GHz · green band: gain ≥ loss</text></svg>);
}
