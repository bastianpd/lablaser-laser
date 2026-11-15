import React from 'react';
import KrExplorer from './KrExplorer.jsx';
import KrVirtualLab from './KrVirtualLab.jsx';
const APPS = [
  ['Raman spectroscopy', 'Raman scattering shifts the light frequency by molecular vibrations. Red and near-infrared Kr⁺ lines (647.1 and 752.5 nm) are used as excitation to avoid the fluorescence background common at shorter wavelengths.', 'Line selection with a prism matters: each line sets the excitation wavelength.', 'Limits: intensity noise and very low efficiency; diode and solid-state sources have taken over many setups.', 'RP Photonics buyer’s guide'],
  ['Retinal photocoagulation', 'Absorbed laser light heats retinal tissue to coagulate it. Krypton red (647.1 nm) and yellow lasers were reviewed against argon lasers for retinal vascular and chorioretinal disease.', 'Different wavelengths are absorbed differently by tissue, so the line choice matters.', 'Clinical details are in the review; none are claimed here.', 'PubMed PMID 22451947'],
  ['Dye-laser pumping', 'A pump laser excites a dye; the dye emits at longer wavelengths. Kr⁺ was used historically to pump dye lasers in the deep red and near-infrared.', 'The pump line must fall in the dye’s absorption band.', 'Largely superseded by solid-state pump sources.', 'RP Photonics buyer’s guide; Photonics.com'],
  ['Argon/krypton multi-line sources', 'A mixed argon–krypton tube emits several visible lines at once, giving a white-light laser for laser shows.', 'Multi-line mode uses broadband mirrors instead of a prism.', 'The spectral composition, and so the colour, changes during operation.', 'RP Photonics; Photonics.com'],
];
export default function KrApplications() {
  return (<div><KrVirtualLab /><div className="grid">{APPS.map(([t, p, w, l, s]) => <section key={t}><h2>{t}</h2><p>{p}</p><p><b>Wavelength:</b> {w}</p><p>{l}</p><p className="note">Source: {s}</p></section>)}</div><KrExplorer /></div>);
}
