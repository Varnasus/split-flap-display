import type { Palette, SizeConfig, SplitFlapColor, SplitFlapSize } from "./types";

/** Full character set — letters, numbers, punctuation. Order matters — flips go forward through this array. */
export const CHARS: string[] =
  " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.:-/+!?".split("");

/** Numeric-only character set — fast transitions for clocks, counters, prices. */
export const NUMERIC_CHARS: string[] = " 0123456789.,:+-/$%".split("");

/** Alpha-only character set — letters and space only. */
export const ALPHA_CHARS: string[] = " ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

/** Color palettes for each theme */
export const PALETTES: Record<SplitFlapColor, Palette> = {
  dark: {
    text: "#e8e6e1",
    topBg: "#202025",
    botBg: "#19191d",
    border: "#2e2e33",
    div: "#0a0a0c",
  },
  light: {
    text: "#1a1a1d",
    topBg: "#eae7df",
    botBg: "#ddd9d0",
    border: "#c8c4ba",
    div: "#b8b4aa",
  },
  ranger: {
    text: "#4ade80",
    topBg: "#141a16",
    botBg: "#0f1512",
    border: "#1e2e22",
    div: "#0a0c0a",
  },
  patriot: {
    text: "#e8e6e1",
    topBg: "#141828",
    botBg: "#0f1320",
    border: "#1e2440",
    div: "#080a14",
  },
  red: {
    text: "#ff6b6b",
    topBg: "#1e1416",
    botBg: "#181012",
    border: "#2e1e22",
    div: "#0c0808",
  },
};

/** Size presets */
export const SIZES: Record<SplitFlapSize, SizeConfig> = {
  sm: { w: 30, h: 42, font: 22, divider: 2, radius: 3 },
  md: { w: 46, h: 64, font: 36, divider: 2, radius: 5 },
  lg: { w: 64, h: 90, font: 52, divider: 3, radius: 6 },
  xl: { w: 82, h: 114, font: 66, divider: 3, radius: 7 },
};

/**
 * Calculate the steps needed to flip from one character to another.
 * Returns an array of intermediate characters (including the target).
 * Characters cycle forward through the character set — no backwards flipping, just like the real thing.
 * Pass a custom `charSet` for non-default character arrays.
 */
export function stepsTo(from: string, to: string, charSet: string[] = CHARS): string[] {
  const a = charSet.indexOf(from);
  const b = charSet.indexOf(to);
  if (a < 0 || b < 0 || a === b) return [];
  const out: string[] = [];
  let i = a;
  while (i !== b) {
    i = (i + 1) % charSet.length;
    out.push(charSet[i]);
  }
  return out;
}
