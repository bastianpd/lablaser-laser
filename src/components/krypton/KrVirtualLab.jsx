import React, { useState } from 'react';
import { LINES } from '../../lasers/krypton/data.js';
import { transition, nmToRGB, region } from '../../lasers/krypton/spectroscopy.js';
import { IONIZATION_EV, thresholds, reachableLines } from '../../lasers/krypton/discharge.js';
const APPS = {
  none: { l: 'Free exploration' },
  raman: { l: 'Raman spectroscopy', sel: 'L6471', mode: 'single', note: '647.1 nm and 752.5 nm are named as Raman excitation lines (RP Photonics). 752.5 nm has no level assignment here, so only 647.1 nm is simulated.' },
  retina: { l: 'Retinal photocoagulation', sel: 'L6471', mode: 'single', note: 'Krypton red, 647.1 nm, is the line reviewed for retinal photocoagulation (PubMed PMID 22451947).' },
  show: { l: 'Multi-line source (light show)', mode: 'multi', note: 'Multi-line operation uses broadband mirrors; the mix changes during operation (RP Photonics). Argon, used in real Ar/Kr light-show tubes, is not modelled.' },
};
const rgb = (nm) => nmToRGB(nm).match(/\d+/g).map(Number), X = (nm) => 10 + ((nm - 380) / 370) * 380;
export default function KrVirtualLab() {
  const [eV, setEV] = useState(10), [mode, setMode] = useState('single'), [sel, setSel] = useState('L6471'), [app, setApp] = useState('none');
  const reach = reachableLines(eV), active = mode === 'single' ? reach.filter((l) => l.id === sel) : reach, ion = eV >= IONIZATION_EV, selLine = LINES.find((l) => l.id === sel);
  const nm = (l) => transition(l).airNm, need = LINES.map((l) => thresholds(l).exciteEV), th = thresholds(selLine);
  const [lo, hi] = mode === 'single' ? [th.exciteEV, th.exciteEV] : [Math.min(...need), Math.max(...need)];
  const mix = active.length ? active.map((l) => rgb(nm(l))).reduce((s, c) => s.map((v, i) => v + c[i]), [0, 0, 0]).map((v) => Math.round(v / active.length)) : null;
  const pick = (a) => { setApp(a); if (APPS[a].mode) setMode(APPS[a].mode); if (APPS[a].sel) setSel(APPS[a].sel); };
  const ok = (b) => (b ? 'pos' : 'neg');
  return (<section><h2>Virtual lab - from discharge to laser line</h2>
    <p className="note">Qualitative energy-threshold model built from the NIST level energies and the 1965 line table. It shows which steps are energetically possible. Collision rates, gain and output power are not modelled (no sourced data).</p>
    <div className="grid"><div>
      <label className="row">Electron energy = {eV.toFixed(1)} eV<input type="range" aria-label="Electron energy (eV)" min="0" max="40" step="0.1" value={eV} onChange={(e) => setEV(+e.target.value)} /></label>
      <label className="row">Application preset<select aria-label="Application preset" value={app} onChange={(e) => pick(e.target.value)}>{Object.entries(APPS).map(([k, a]) => <option key={k} value={k}>{a.l}</option>)}</select></label>
      <div className="bar" role="group" aria-label="Resonator mode"><button aria-pressed={mode === 'single'} onClick={() => setMode('single')}>Single line (prism)</button><button aria-pressed={mode === 'multi'} onClick={() => setMode('multi')}>Multi-line (broadband mirrors)</button></div>
      <label className="row">Prism setting<select aria-label="Laser line (prism setting)" value={sel} disabled={mode === 'multi'} onChange={(e) => setSel(e.target.value)}>{LINES.map((l) => <option key={l.id} value={l.id}>{nm(l).toFixed(1)} nm</option>)}</select></label>
      {APPS[app].note && <p className="note">{APPS[app].note}</p>}</div>
    <div><ol>
      <li data-testid="kr-s1" className={ok(ion)}> Ionization Kr → Kr⁺ needs ≥ {IONIZATION_EV.toFixed(2)} eV: {ion ? 'reached' : 'not reached'}</li>
      <li data-testid="kr-s2" className={ok(ion && eV >= lo)}> Excitation of Kr⁺ to the upper level needs ≥ {lo.toFixed(2)} eV{hi > lo ? ` … ${hi.toFixed(2)} eV (by line)` : ''}: {ion && eV >= lo ? 'reached' : 'not reached'}</li>
      <li className={ok(active.length > 0)}> Laser output: {active.length ? active.map((l) => nm(l).toFixed(1) + ' nm').join(', ') : 'none at this energy'}</li></ol>
      <p data-testid="kr-reach">{reach.length} of {LINES.length} lines reachable at {eV.toFixed(1)} eV</p>
      <p className="note">A single electron needs ≥ {th.fromNeutralEV.toFixed(2)} eV to go from neutral Kr straight to the {nm(selLine).toFixed(1)} nm upper level; the two-step route needs the ion to be present first.</p></div></div>
    <svg viewBox="0 0 520 100" className="diagram" role="img" aria-label="Resonator output"><rect x="60" y="30" width="380" height="36" fill={ion ? '#3a2a6e' : '#13234a'} stroke="#4aa3ff" /><rect x="40" y="24" width="10" height="48" fill="#9fb3d9" /><rect x="450" y="24" width="10" height="48" fill="#9fb3d9" opacity=".55" />
      {mix && <line data-testid="kr-beam" x1="60" x2="515" y1="48" y2="48" stroke={`rgb(${mix})`} strokeWidth="4" />}<text x="60" y="90" fill="#9fb0d3" fontSize="10">{mix ? (mode === 'multi' ? 'approximate colour mix; relative powers not modelled' : region(nm(selLine)) + ' beam') : 'no beam'}</text></svg>
    <svg viewBox="0 0 400 46" className="diagram" role="img" aria-label="Lines in the spectrum"><rect x="10" y="30" width="380" height="2" fill="#3a4a78" />
      {LINES.map((l) => { const on = active.includes(l), r = reach.includes(l); return <line key={l.id} x1={X(nm(l))} x2={X(nm(l))} y1={on ? 4 : r ? 14 : 22} y2="30" stroke={r ? nmToRGB(nm(l)) : '#5b6b99'} strokeWidth={on ? 3 : 1.5} />; })}
      <text x="10" y="44" fill="#9fb0d3" fontSize="9">380 nm</text><text x="390" y="44" fill="#9fb0d3" fontSize="9" textAnchor="end">750 nm · tall = emitting, medium = reachable, short = not reachable</text></svg></section>);
}
