import { useRef, useEffect, useCallback, useMemo } from "react";
import type { SplitFlapProps } from "./types";
import { PALETTES, SIZES } from "./constants";
import { FlapChar } from "./FlapChar";

/** Seeded-ish random per index so board mode delays are stable across renders. */
function boardRandom(index: number, seed: string): number {
  let h = 0;
  const s = seed + index;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return ((h >>> 0) % 1000) / 1000;
}

/** Compute which character indices are group boundaries from groupGaps array. */
function groupBoundaries(groupGaps: number[]): Set<number> {
  const set = new Set<number>();
  let pos = 0;
  for (const g of groupGaps) {
    pos += g;
    set.add(pos); // wider gap AFTER this position
  }
  return set;
}

/**
 * A split-flap display — a row of characters that flip through the alphabet
 * to reach their target, with staggered cascade timing.
 *
 * ```tsx
 * <SplitFlap value="HELLO" size="lg" color="ranger" />
 * <SplitFlap value="PARIS" mode="board" sound />
 * <SplitFlap value="1250.00" prefix="$" chars={NUMERIC_CHARS} />
 * <SplitFlap value="123456" groupGaps={[2,2,2]} />
 * ```
 */
export function SplitFlap({
  value = "",
  length,
  size = "md",
  variant = "modern",
  color = "dark",
  palette,
  flipMs = 100,
  stagger = 40,
  gap = 4,
  mode = "cascade",
  spinning = false,
  sound,
  volume,
  soundVariant,
  soundSrc,
  chars,
  animateOnMount = false,
  groupGaps,
  groupGapSize = 12,
  prefix,
  suffix,
  onFlipComplete,
  className,
  style,
}: SplitFlapProps) {
  const len = length || Math.max(value.length, 1);

  const padded = chars
    ? (value || "").padEnd(len, chars[0] || " ").slice(0, len)
    : (value || "").toUpperCase().padEnd(len, " ").slice(0, len);

  // Board mode: compute stable per-character random values
  const boardParams = useMemo(() => {
    if (mode !== "board") return null;
    return padded.split("").map((_, i) => {
      const r = boardRandom(i, padded);
      return {
        delay: Math.round(r * 80),
        extraSpins: 1 + Math.round(boardRandom(i + 1000, padded) * 1.5),
        flipMs: Math.round(flipMs * (0.85 + boardRandom(i + 2000, padded) * 0.3)),
      };
    });
  }, [mode, padded, flipMs]);

  // Group boundary indices for wider gaps
  const boundaries = useMemo(
    () => (groupGaps ? groupBoundaries(groupGaps) : null),
    [groupGaps]
  );

  // Track per-character completion for onFlipComplete
  const pendingRef = useRef(new Set<number>());
  const valueRef = useRef(padded);

  useEffect(() => {
    valueRef.current = padded;
    pendingRef.current = new Set(
      padded.split("").map((_, i) => i)
    );
  }, [padded]);

  const handleCharComplete = useCallback(
    (index: number) => {
      pendingRef.current.delete(index);
      if (pendingRef.current.size === 0 && onFlipComplete) {
        onFlipComplete();
      }
    },
    [onFlipComplete]
  );

  const S = SIZES[size] || SIZES.md;
  const P = palette || PALETTES[color] || PALETTES.dark;

  // Shared style for prefix/suffix static text
  const affixStyle: React.CSSProperties = {
    fontFamily: "'JetBrains Mono', 'SF Mono', 'Fira Code', 'Consolas', monospace",
    fontSize: S.font,
    fontWeight: 700,
    color: P.text,
    lineHeight: `${S.h}px`,
    userSelect: "none",
    opacity: 0.5,
    display: "inline-flex",
    alignItems: "center",
    height: S.h,
  };

  return (
    <div
      style={{ display: "inline-flex", gap, flexWrap: "wrap", alignItems: "center", ...style }}
      className={className}
      role="status"
      aria-label={`${prefix || ""}${padded.trim()}${suffix || ""}` || undefined}
      aria-live="polite"
    >
      {prefix && (
        <span style={affixStyle} aria-hidden="true">{prefix}</span>
      )}
      {padded.split("").map((ch, i) => {
        const bp = boardParams?.[i];
        const isGroupEnd = boundaries?.has(i + 1);
        const flapChar = (
          <FlapChar
            key={i}
            target={spinning ? undefined : ch}
            size={size}
            variant={variant}
            color={color}
            palette={palette}
            flipMs={bp ? bp.flipMs : flipMs}
            delay={bp ? bp.delay : i * stagger}
            sound={sound}
            volume={volume}
            soundVariant={soundVariant}
            soundSrc={soundSrc}
            chars={chars}
            onCharComplete={() => handleCharComplete(i)}
            extraSpins={bp ? bp.extraSpins : 0}
            spinning={spinning}
            animateOnMount={animateOnMount}
          />
        );
        // Wider gap after group boundaries
        if (isGroupEnd) {
          return (
            <span key={i} style={{ marginRight: groupGapSize - gap, display: "inline-block" }}>
              {flapChar}
            </span>
          );
        }
        return flapChar;
      })}
      {suffix && (
        <span style={affixStyle} aria-hidden="true">{suffix}</span>
      )}
    </div>
  );
}
