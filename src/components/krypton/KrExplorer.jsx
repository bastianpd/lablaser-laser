import React, { useState } from 'react';
import { LEVELS, LINES, UNASSIGNED } from '../../lasers/krypton/data.js';
import { transition, region, nmToRGB } from '../../lasers/krypton/spectroscopy.js';
const E0 = 105000, E1 = 143000, Y = (E) => 380 - ((E - E0) / (E1 - E0)) * 340, X = { s: 150, p: 380 };
const colOf = (k) => (k[0] === 's' ? 's' : 'p'), lv = (k) => `${LEVELS[k].cfg} ${LEVELS[k].term}${LEVELS[k].J}`;
export default function KrExplorer() {
  const [id, setId] = useState('L6471'), [lev, setLev] = useState(null), line = LINES.find((l) => l.id === id), t = transition(line), nm = t.airNm / 1 / 10 * 10;
  const levels = [...new Set(LINES.flatMap((l) => [l.up, l.lo]))];
  return (<div className="grid"><section><h2>Experiment 1 — spectral line selection</h2>
    <div className="bar" role="group" aria-label="Kr II lines">{LINES.map((l) => { const w = transition(l).airNm; return <button key={l.id} aria-pressed={l.id === id} onClick={() => { setId(l.id); setLev(null); }} style={{ borderColor: nmToRGB(w) }}>{w.toFixed(1)} nm</button>; })}</div>
    <dl><dt>Upper level</dt><dd data-testid="kr-up">{lv(line.up)} · {LEVELS[line.up].E.toFixed(2)} cm⁻¹ ({t.upEV.toFixed(3)} eV)</dd><dt>Lower level</dt><dd>{lv(line.lo)} · {LEVELS[line.lo].E.toFixed(2)} cm⁻¹ ({t.loEV.toFixed(3)} eV)</dd>
      <dt>Photon energy</dt><dd data-testid="kr-ev">{t.eV.toFixed(4)} eV (ΔE = {t.dE.toFixed(2)} cm⁻¹)</dd><dt>Wavelength (computed)</dt><dd data-testid="kr-nm">{t.airNm.toFixed(2)} nm air · {t.vacNm.toFixed(2)} nm vacuum</dd>
      <dt>1965 paper</dt><dd>calc. {(line.calcA / 10).toFixed(3)} nm, obs. {(line.obsA / 10).toFixed(3)} nm — {line.label}</dd><dt>Spectral region</dt><dd>{region(t.airNm)}</dd></dl>
    {line.note && <p className="note">{line.note}</p>}
    <svg viewBox="0 0 400 40" className="diagram" role="img" aria-label="Position in the spectrum"><defs><linearGradient id="sp">{[380, 440, 490, 510, 580, 645, 750].map((w) => <stop key={w} offset={`${((w - 380) / 370) * 100}%`} stopColor={nmToRGB(w)} />)}</linearGradient></defs>
      <rect x="10" y="8" width="380" height="16" fill="url(#sp)" /><line x1={10 + ((t.airNm - 380) / 370) * 380} x2={10 + ((t.airNm - 380) / 370) * 380} y1="2" y2="30" stroke="#fff" strokeWidth="2" /><text x="10" y="38" fill="#9fb0d3" fontSize="9">380 nm</text><text x="390" y="38" fill="#9fb0d3" fontSize="9" textAnchor="end">750 nm (colours approximate)</text></svg>
    <p className="note">Photon energy and wavelengths are computed from NIST level energies (E = hc·ΔE). Wavelengths in the 1965 table are in air. Other sources also name {UNASSIGNED.map((u) => u.nm + ' nm').join(' and ')}; they are not assigned here: {UNASSIGNED.map((u) => u.note).join(' ')}</p></section>
    <section><h2>Experiment 2 — Kr II energy levels</h2>
      <svg viewBox="0 0 520 420" className="diagram" role="img" aria-label="Kr II energy levels and laser transitions (real NIST energies)">
        <text x="10" y="14" fill="#9fb0d3" fontSize="10">E (cm⁻¹) above Kr II ground state; axis starts at 105 000 (ground 0 and 5 370 cm⁻¹ are below the axis)</text>
        {LINES.map((l) => { const on = l.id === id || (lev && (l.up === lev || l.lo === lev)); return <line key={l.id} x1={X.s + 60} y1={Y(LEVELS[l.lo].E)} x2={X.p} y2={Y(LEVELS[l.up].E)} stroke={nmToRGB(transition(l).airNm)} strokeWidth={on ? 3 : 1} opacity={on ? 1 : 0.35} />; })}
        {levels.map((k) => (<g key={k} onClick={() => setLev(lev === k ? null : k)} style={{ cursor: 'pointer' }} role="button" aria-label={`level ${lv(k)}`}><line x1={colOf(k) === 's' ? X.s : X.p} x2={(colOf(k) === 's' ? X.s : X.p) + 60} y1={Y(LEVELS[k].E)} y2={Y(LEVELS[k].E)} stroke={lev === k ? '#ffd24a' : '#b36bff'} strokeWidth="3" />
          <text x={colOf(k) === 's' ? 10 : X.p + 64} y={Y(LEVELS[k].E) + 3} fill="#c9d4ee" fontSize="9">{LEVELS[k].term}{LEVELS[k].J} {(LEVELS[k].E / 1000).toFixed(1)}k</text></g>))}
        <text x={X.s} y="410" fill="#c9d4ee" fontSize="11">5s (lower)</text><text x={X.p} y="410" fill="#c9d4ee" fontSize="11">5p (upper)</text></svg>
      <p className="note">{lev ? `Selected level: ${lv(lev)} — ${LINES.filter((l) => l.up === lev || l.lo === lev).map((l) => transition(l).airNm.toFixed(1) + ' nm').join(', ')}.` : 'Click a level to highlight its transitions. All lasing lines shown are 5p → 5s.'}</p>
      <p className="note">Experiments 3 (optical system) and 4 (operating conditions) are <b>not implemented</b>: the sources reviewed give no defensible quantitative model or parameters for them, and none are invented here.</p></section></div>);
}
