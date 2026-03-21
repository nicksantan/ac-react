// Label layout engine: assigns above/below positions to avoid collisions
export function layoutLabels(labelItems) {
  if (labelItems.length === 0) return [];

  const sorted = labelItems.slice().sort((a, b) => a.centerX - b.centerX);

  const charW = 7;
  const pad = 10;
  const MIN_GAP = 10;

  let lastAboveRight = -Infinity;
  let lastBelowRight = -Infinity;

  const result = [];
  for (const item of sorted) {
    const labelW = item.text.length * charW + pad;
    const left = item.centerX - labelW / 2;
    const right = item.centerX + labelW / 2;

    const fitsAbove = left > lastAboveRight + MIN_GAP;
    const fitsBelow = left > lastBelowRight + MIN_GAP;

    let side;
    if (fitsAbove) {
      side = 'above';
    } else if (fitsBelow) {
      side = 'below';
    } else {
      continue; // Skip — both sides collide
    }

    if (side === 'above') {
      lastAboveRight = right;
    } else {
      lastBelowRight = right;
    }

    result.push({ ...item, side });
  }

  return result;
}
