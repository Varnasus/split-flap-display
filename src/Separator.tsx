import type { SplitFlapSeparatorProps } from "./types";
import { PALETTES, SIZES } from "./constants";

/**
 * A static visual divider that matches flap styling but doesn't flip.
 * Use between SplitFlap groups for time displays (HH:MM), flight numbers, etc.
 *
 * ```tsx
 * <SplitFlap value="12" length={2} />
 * <SplitFlapSeparator char=":" />
 * <SplitFlap value="45" length={2} />
 * ```
 */
export function SplitFlapSeparator({
  char: ch = ":",
  size = "md",
  color = "dark",
  palette,
  variant = "modern",
}: SplitFlapSeparatorProps) {
  const S = SIZES[size] || SIZES.md;
  const P = palette || PALETTES[color] || PALETTES.dark;
  const isClassic = variant === "classic";

  // Separator is narrower than a flap character
  const w = Math.round(S.w * 0.45);

  return (
    <div
      style={{
        width: w,
        height: S.h,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
      aria-hidden="true"
    >
      <span
        style={{
          fontFamily: "'JetBrains Mono', 'SF Mono', 'Fira Code', 'Consolas', monospace",
          fontSize: S.font,
          fontWeight: 700,
          color: P.text,
          lineHeight: `${S.h}px`,
          userSelect: "none",
          opacity: isClassic ? 0.6 : 0.5,
        }}
      >
        {ch}
      </span>
    </div>
  );
}
