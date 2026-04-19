import { useMemo } from "react";

/** Deterministic faux QR — purely visual placeholder for the prototype. */
export function FauxQR({ value, size = 96 }: { value: string; size?: number }) {
  const cells = 11;
  const grid = useMemo(() => {
    let h = 0;
    for (let i = 0; i < value.length; i++) h = (h * 31 + value.charCodeAt(i)) >>> 0;
    const out: boolean[] = [];
    for (let i = 0; i < cells * cells; i++) {
      h = (h * 1103515245 + 12345) >>> 0;
      out.push((h & 7) > 3);
    }
    return out;
  }, [value]);
  const cell = size / cells;
  const isFinder = (r: number, c: number) => {
    const inBox = (br: number, bc: number) => r >= br && r < br + 3 && c >= bc && c < bc + 3;
    return inBox(0, 0) || inBox(0, cells - 3) || inBox(cells - 3, 0);
  };
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rounded-md bg-white p-1 shadow-sm">
      {Array.from({ length: cells * cells }).map((_, i) => {
        const r = Math.floor(i / cells);
        const c = i % cells;
        const on = isFinder(r, c) || grid[i];
        return on ? <rect key={i} x={c * cell} y={r * cell} width={cell} height={cell} fill="hsl(var(--primary))" /> : null;
      })}
    </svg>
  );
}
