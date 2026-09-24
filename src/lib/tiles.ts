// Подбор «крупных» плиток (2×2) для сетки галереи так, чтобы при grid-auto-flow: dense
// сетка закрывалась ровно, без дыр. Считается при сборке, поэтому число фото можно менять свободно.

function packs(big: Set<number>, n: number, cols: number): boolean {
  const taken = new Set<string>();
  let maxRow = 0;
  for (let i = 0; i < n; i++) {
    const w = big.has(i) ? 2 : 1;
    let placed = false;
    for (let r = 0; !placed; r++) {
      for (let c = 0; c <= cols - w && !placed; c++) {
        const cells: string[] = [];
        for (let dr = 0; dr < w; dr++) for (let dc = 0; dc < w; dc++) cells.push(`${r + dr}:${c + dc}`);
        if (cells.every((x) => !taken.has(x))) {
          cells.forEach((x) => taken.add(x));
          maxRow = Math.max(maxRow, r + w);
          placed = true;
        }
      }
    }
  }
  return taken.size === maxRow * cols;
}

function* combos(from: number[], k: number, start = 0, acc: number[] = []): Generator<number[]> {
  if (acc.length === k) return yield acc;
  for (let i = start; i < from.length; i++) yield* combos(from, k, i + 1, [...acc, from[i]]);
}

/** Индексы крупных плиток. Первая плитка всегда крупная; крупных — примерно каждая третья. */
export function bigTiles(n: number, cols = 4): number[] {
  if (n < 3) return [];
  const rest = Array.from({ length: n - 1 }, (_, i) => i + 1);
  const target = Math.max(1, Math.round(n / 3));
  for (const k of [target, target - 1, target + 1, target - 2, target + 2, 1, 0]) {
    if (k < 1 || k > n) continue;
    // Сначала пробуем «разреженные» наборы (крупные плитки не подряд).
    let best: number[] | null = null;
    for (const c of combos(rest, k - 1)) {
      const set = new Set([0, ...c]);
      if (!packs(set, n, cols)) continue;
      const spaced = [0, ...c].every((v, i, a) => i === 0 || v - a[i - 1] > 1);
      if (spaced) return [0, ...c];
      best ??= [0, ...c];
    }
    if (best) return best;
  }
  return [0];
}
