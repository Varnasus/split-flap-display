import { useRef, useEffect, useCallback, useMemo } from "react";
import type { SplitFlapProps, StaggerDirection } from "./types";
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
    set.add(pos);
  }
  return set;
}

/** Compute per-character delay based on stagger direction. */
function computeDelay(
  index: number,
  total: number,
  stagger: number,
  direction: StaggerDirection
): number {
  switch (direction) {
    case "rtl":
      return (total - 1 - index) * stagger;
    case "center-out": {
      const center = (total - 1) / 2;
      return Math.round(Math.abs(index - center) * stagger);
    }
    case "ltr":
    default:
      return index * stagger;
  }
}

/**
 * A split-flap display — a row (or board) of characters that flip through the
 * alphabet to reach their target, with staggered cascade timing.
 *
 * ```tsx
 * <SplitFlap value="HELLO" size="lg" color="ranger" />
 * <SplitFlap value="PARIS" mode="board" easing="spring" sound />
 * <SplitFlap layout="board" rows={["LINE ONE", "LINE TWO"]} variant="classic" />
 * ```
 */
export function SplitFlap({
  value = "",
  rows,
  length,
  rowCount,
  size = "md",
  variant = "modern",
  color = "dark",
  palette,
  flipMs = 100,
  stagger = 40,
  staggerDirection = "ltr",
  gap = 4,
  mode = "cascade",
  layout = "single",
  easing = "linear",
  perspective = 300,
  spinning = false,
  sound,
  volume,
  soundVariant,
  soundSrc,
  soundOptions,
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
  // ── Board layout mode ──
  if (layout === "board" && rows) {
    const rowLen = length || Math.max(...rows.map((r) => r.length), 1);
    const numRows = rowCount || rows.length;
    const resolvedRows = Array.from({ length: numRows }, (_, i) => {
      const raw = rows[i] || "";
      return chars
        ? raw.padEnd(rowLen, chars[0] || " ").slice(0, rowLen)
        : raw.toUpperCase().padEnd(rowLen, " ").slice(0, rowLen);
    });

    const totalChars = numRows * rowLen;
    const pendingRef = useRef(new Set<number>());
    const valueRef = useRef(resolvedRows.join("\n"));

    useEffect(() => {
      valueRef.current = resolvedRows.join("\n");
      pendingRef.current = new Set(
        Array.from({ length: totalChars }, (_, i) => i)
      );
    }, [resolvedRows.join("\n"), totalChars]);

    const handleCharComplete = useCallback(
      (globalIdx: number) => {
        pendingRef.current.delete(globalIdx);
        if (pendingRef.current.size === 0 && onFlipComplete) {
          onFlipComplete();
        }
      },
      [onFlipComplete]
    );

    // Board mode params
    const boardParams = useMemo(() => {
      if (mode !== "board") return null;
      const seed = resolvedRows.join("");
      return Array.from({ length: totalChars }, (_, i) => ({
        delay: Math.round(boardRandom(i, seed) * 80),
        extraSpins: 1 + Math.round(boardRandom(i + 1000, seed) * 1.5),
        flipMs: Math.round(flipMs * (0.85 + boardRandom(i + 2000, seed) * 0.3)),
      }));
    }, [mode, resolvedRows.join(""), flipMs, totalChars]);

    const S = SIZES[size] || SIZES.md;
    const P = palette || PALETTES[color] || PALETTES.dark;
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
        style={{ display: "inline-flex", flexDirection: "column", gap: gap * 2, ...style }}
        className={className}
        role="status"
        aria-label={resolvedRows.map((r) => r.trim()).join("\n") || undefined}
        aria-live="polite"
      >
        {resolvedRows.map((rowText, rowIdx) => (
          <div key={rowIdx} style={{ display: "inline-flex", gap, alignItems: "center" }}>
            {rowIdx === 0 && prefix && (
              <span style={affixStyle} aria-hidden="true">{prefix}</span>
            )}
            {rowText.split("").map((ch, colIdx) => {
              const globalIdx = rowIdx * rowLen + colIdx;
              const bp = boardParams?.[globalIdx];
              return (
                <FlapChar
                  key={colIdx}
                  target={spinning ? undefined : ch}
                  size={size}
                  variant={variant}
                  color={color}
                  palette={palette}
                  easing={easing}
                  perspective={perspective}
                  flipMs={bp ? bp.flipMs : flipMs}
                  delay={bp ? bp.delay : computeDelay(globalIdx, totalChars, stagger, staggerDirection)}
                  sound={sound}
                  volume={volume}
                  soundVariant={soundVariant}
                  soundSrc={soundSrc}
                  soundOptions={soundOptions}
                  chars={chars}
                  onCharComplete={() => handleCharComplete(globalIdx)}
                  extraSpins={bp ? bp.extraSpins : 0}
                  spinning={spinning}
                  animateOnMount={animateOnMount}
                />
              );
            })}
            {rowIdx === 0 && suffix && (
              <span style={affixStyle} aria-hidden="true">{suffix}</span>
            )}
          </div>
        ))}
      </div>
    );
  }

  // ── Single-row mode (default) ──
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
            easing={easing}
            perspective={perspective}
            flipMs={bp ? bp.flipMs : flipMs}
            delay={bp ? bp.delay : computeDelay(i, len, stagger, staggerDirection)}
            sound={sound}
            volume={volume}
            soundVariant={soundVariant}
            soundSrc={soundSrc}
            soundOptions={soundOptions}
            chars={chars}
            onCharComplete={() => handleCharComplete(i)}
            extraSpins={bp ? bp.extraSpins : 0}
            spinning={spinning}
            animateOnMount={animateOnMount}
          />
        );
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
