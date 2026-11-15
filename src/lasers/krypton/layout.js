// Label placement for the energy diagram: keep desired order, enforce a minimum vertical gap (px), stay inside [min, max].
export function spreadLabels(ys, gap = 13, min = 24, max = 400) {
  const idx = ys.map((y, i) => [y, i]).sort((a, b) => a[0] - b[0]), out = new Array(ys.length);
  let prev = min - gap;
  for (const [y, i] of idx) { out[i] = Math.max(y, prev + gap); prev = out[i]; }
  let next = max + gap;
  for (let k = idx.length - 1; k >= 0; k--) { const i = idx[k][1]; out[i] = Math.min(out[i], next - gap); next = out[i]; }
  return out;
}
