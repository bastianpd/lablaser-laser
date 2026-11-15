// Krypton ion (Kr II) data. Independent of the generic four-level model.
// Level energies: NIST Handbook of Basic Atomic Spectroscopic Data, "Energy Levels of Singly Ionized Krypton", from Sugar & Musgrove,
// J. Phys. Chem. Ref. Data 20, 861 (1991) (cm^-1, relative to the Kr II 4s2 4p5 2P3/2 ground level).
// Lines: Bridges & Chester, Appl. Opt. 4, 573 (1965), Table III (observed/calculated AIR wavelengths, Angstrom, and their 1965 LS labels).
export const IONIZATION_CM1 = 112914.5; // Kr I -> Kr II (2P3/2) limit, NIST Handbook (cm^-1)
export const LEVELS = {
  g32: { cfg: '4s²4p⁵', term: '²P°', J: '3/2', E: 0 }, g12: { cfg: '4s²4p⁵', term: '²P°', J: '1/2', E: 5370.1 },
  s4P52: { cfg: '4p⁴(³P)5s', term: '⁴P', J: '5/2', E: 112828.27 }, s4P32: { cfg: '4p⁴(³P)5s', term: '⁴P', J: '3/2', E: 115092.01 }, s4P12: { cfg: '4p⁴(³P)5s', term: '⁴P', J: '1/2', E: 117603.02 },
  s2P32: { cfg: '4p⁴(³P)5s', term: '²P', J: '3/2', E: 118474.36 }, s2P12: { cfg: '4p⁴(³P)5s', term: '²P', J: '1/2', E: 121002.15 },
  // 5p levels: term letters not reliably recoverable from the source table; identified by (J, energy). 1965 LS labels are given per line.
  p52a: { cfg: '4p⁴(³P)5p', term: '', J: '5/2', E: 133923.86 }, p32a: { cfg: '4p⁴(³P)5p', term: '', J: '3/2', E: 134286.67 }, p12a: { cfg: '4p⁴(³P)5p', term: '', J: '1/2', E: 135781.26 },
  p52b: { cfg: '4p⁴(³P)5p', term: '', J: '5/2', E: 136069.23 }, p12b: { cfg: '4p⁴(³P)5p', term: '', J: '1/2', E: 139101.57 }, p52c: { cfg: '4p⁴(³P)5p', term: '', J: '5/2', E: 140117.23 }, p32b: { cfg: '4p⁴(³P)5p', term: '', J: '3/2', E: 141993.94 },
};
// Only lines whose (upper, lower) pair reproduces the 1965 calculated wavelength from NIST energies (checked in tests) are included.
export const LINES = [
  { id: 'L4619', up: 'p52c', lo: 's2P32', obsA: 4619.17, calcA: 4619.15, label: '5p ²D°5/2 → 5s ²P3/2' },
  { id: 'L4762', up: 'p32b', lo: 's2P12', obsA: 4762.44, calcA: 4762.43, label: '5p ²D°3/2 → 5s ²P1/2' },
  { id: 'L4766', up: 'p52b', lo: 's4P32', obsA: 4765.71, calcA: 4765.73, label: '5p ⁴D°5/2 → 5s ⁴P3/2' },
  { id: 'L4847', up: 'p12b', lo: 's2P32', obsA: 4846.66, calcA: 4846.59, label: '5p ²P°1/2 → 5s ²P3/2' },
  { id: 'L5208', up: 'p32a', lo: 's4P32', obsA: 5208.32, calcA: 5208.31, label: '5p ⁴P°3/2 → 5s ⁴P3/2' },
  { id: 'L5309', up: 'p52a', lo: 's4P32', obsA: 5308.68, calcA: 5308.65, label: '5p ⁴P°5/2 → 5s ⁴P3/2' },
  { id: 'L5682', up: 'p52b', lo: 's2P32', obsA: 5681.92, calcA: 5681.88, label: '5p ⁴D°5/2 → 5s ²P3/2' },
  { id: 'L6471', up: 'p52a', lo: 's2P32', obsA: 6471.0, calcA: 6470.88, label: '5p ⁴P°5/2 → 5s ²P3/2' },
  { id: 'L6764', up: 'p12a', lo: 's2P12', obsA: 6764.57, calcA: 6764.42, label: '5p ²P°1/2 → 5s ²P1/2', note: 'Matched by energy. The 1965 LS label may differ from the current term assignment.' },
];
// Lines mentioned in sources but NOT assigned to levels here (no verified level pair).
export const UNASSIGNED = [
  { nm: 752.5, note: 'Named as a Kr⁺ line for Raman excitation (RP Photonics buyer’s guide); level assignment not verified here.' },
  { nm: 413.1, note: 'Bridges & Chester (1965) classify 4131.33 Å as Kr III (doubly ionized), not Kr II.' },
];
export const REFS = [
  'W. B. Bridges, A. N. Chester, “Visible and UV laser oscillation at 118 wavelengths in ionized neon, argon, krypton, xenon, oxygen, and other gases,” Appl. Opt. 4, 573–580 (1965), doi:10.1364/AO.4.000573.',
  'NIST Handbook of Basic Atomic Spectroscopic Data, Krypton: Singly Ionized Energy Levels (data from J. Sugar & A. Musgrove, J. Phys. Chem. Ref. Data 20, 861 (1991)). physics.nist.gov/PhysRefData/Handbook',
  'E. B. Saloman, “Energy levels and observed spectral lines of krypton, Kr I through Kr XXXVI,” J. Phys. Chem. Ref. Data 36, 215 (2007), doi:10.1063/1.2227036.',
  'RP Photonics Encyclopedia, “Ion Lasers” (rp-photonics.com/ion_lasers.html) and Buyer’s Guide “Krypton-ion Lasers” (rp-photonics.com/bg/buy_krypton_ion_lasers.html).',
  'W. B. Bridges et al., “Ion laser plasmas,” Proc. IEEE 59(5), (1971), doi:10.1109/PROC.1971.8252 (further reading, via RP Photonics).',
  'Review of krypton red laser (647.1 nm) photocoagulation of the ocular fundus, PubMed PMID 22451947.',
  'Photonics.com, “Decades of Discoveries Broadened the Laser” (krypton lasers; argon/krypton light shows; dye-laser pumping).',
];
