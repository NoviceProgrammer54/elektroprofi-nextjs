export interface CoverInfo {
  src: string;
  position: string; // e.g. "50% 30%"
}

export function parseCover(url: string | null | undefined): CoverInfo {
  if (!url) return { src: "", position: "center" };
  const hashIdx = url.indexOf("#");
  if (hashIdx === -1) return { src: url, position: "center" };
  const base = url.slice(0, hashIdx);
  const hash = url.slice(hashIdx + 1);
  const params = new URLSearchParams(hash);
  const pos = params.get("pos");
  if (!pos) return { src: url, position: "center" };
  const [x, y] = pos.split(",").map((n) => Number(n));
  if (!Number.isFinite(x) || !Number.isFinite(y)) return { src: base, position: "center" };
  return { src: base, position: `${x}% ${y}%` };
}

export function setCoverPosition(url: string, x: number, y: number): string {
  const base = url.split("#")[0];
  const xi = Math.round(Math.max(0, Math.min(100, x)));
  const yi = Math.round(Math.max(0, Math.min(100, y)));
  return `${base}#pos=${xi},${yi}`;
}

export function getCoverPositionPercent(url: string | null | undefined): { x: number; y: number } {
  if (!url) return { x: 50, y: 50 };
  const hashIdx = url.indexOf("#");
  if (hashIdx === -1) return { x: 50, y: 50 };
  const params = new URLSearchParams(url.slice(hashIdx + 1));
  const pos = params.get("pos");
  if (!pos) return { x: 50, y: 50 };
  const [x, y] = pos.split(",").map((n) => Number(n));
  return {
    x: Number.isFinite(x) ? x : 50,
    y: Number.isFinite(y) ? y : 50,
  };
}
