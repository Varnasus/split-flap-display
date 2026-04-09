import { useState, useEffect, useRef, useCallback } from "react";
import type { FlapCharProps } from "./types";
import { CHARS, PALETTES, SIZES, stepsTo } from "./constants";
import { injectStyles } from "./styles";
import { playSound } from "./sound";

/** Darken a hex color by a fraction (0-1). Used for flap back-face fallback. */
function darken(hex: string, amount = 0.15): string {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, Math.round(((n >> 16) & 0xff) * (1 - amount)));
  const g = Math.max(0, Math.round(((n >> 8) & 0xff) * (1 - amount)));
  const b = Math.max(0, Math.round((n & 0xff) * (1 - amount)));
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

/** Build N full cycles through the character set starting from `from`. */
function fullCycles(from: string, n: number, charSet: string[]): string[] {
  if (n <= 0 || !charSet.length) return [];
  const out: string[] = [];
  let idx = charSet.indexOf(from);
  if (idx < 0) idx = 0;
  const total = Math.round(n * charSet.length);
  for (let i = 0; i < total; i++) {
    idx = (idx + 1) % charSet.length;
    out.push(charSet[idx]);
  }
  return out;
}

/**
 * A single split-flap character. Handles its own flip queue — when the target
 * changes, it cycles through intermediate characters one at a time with real
 * 3D CSS transforms.
 *
 * This is an internal component. Use <SplitFlap> for the public API.
 */
export function FlapChar({
  target = " ",
  flipMs = 100,
  delay = 0,
  size = "md",
  color = "dark",
  variant = "modern",
  palette,
  easing = "linear",
  perspective: perspectiveProp = 300,
  sound,
  volume,
  soundVariant,
  soundSrc,
  soundOptions,
  chars,
  onCharComplete,
  extraSpins = 0,
  spinning = false,
  animateOnMount = false,
}: FlapCharProps) {
  const charSet = chars || CHARS;
  const initial = charSet[0] || " ";
  const firstTarget = chars ? (target || charSet[0] || " ") : (target || " ").toUpperCase();
  const startChar = animateOnMount ? initial : firstTarget;

  const [cur, setCur] = useState(startChar);
  const [nxt, setNxt] = useState<string | null>(null);
  const [flipKey, setFlipKey] = useState(0);
  const [settling, setSettling] = useState(false);
  const [settleKey, setSettleKey] = useState(0);
  const queue = useRef<string[]>([]);
  const busy = useRef(false);
  const curRef = useRef(startChar);
  const prevTarget = useRef<string | null>(animateOnMount ? null : firstTarget);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const settleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const spinningRef = useRef(spinning);
  spinningRef.current = spinning;

  // Reduced motion detection
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    injectStyles();
  }, []);

  // Easing-aware CSS class names
  const useDecel = easing === "decelerate" || easing === "spring";
  const flipTopClass = useDecel ? "sf-flip-top-decel" : "sf-flip-top";
  const flipBotClass = useDecel ? "sf-flip-bot-decel" : "sf-flip-bot";
  const settleClass = easing === "spring" ? "sf-settle-spring" : "sf-settle";
  const settleDuration = easing === "spring" ? 250 : 150;

  const tick = useCallback(() => {
    if (busy.current || !queue.current.length) {
      if (spinningRef.current && !queue.current.length) {
        queue.current = fullCycles(curRef.current, 1, chars || CHARS);
        if (!queue.current.length) return;
      } else {
        return;
      }
    }
    busy.current = true;
    const ch = queue.current.shift()!;
    setNxt(ch);
    setFlipKey((k) => k + 1);

    const totalTime = flipMs + flipMs * 0.45 + 30;
    timerRef.current = setTimeout(() => {
      setCur(ch);
      curRef.current = ch;
      setNxt(null);

      if (sound) {
        playSound(soundVariant || "clack", volume ?? 0.5, soundSrc, soundOptions);
      }

      setSettling(true);
      setSettleKey((k) => k + 1);
      settleTimerRef.current = setTimeout(() => setSettling(false), settleDuration);

      busy.current = false;

      if (!queue.current.length && !spinningRef.current && onCharComplete) {
        onCharComplete();
      }

      tick();
    }, totalTime);
  }, [flipMs, sound, volume, soundVariant, soundSrc, soundOptions, onCharComplete, chars, settleDuration]);

  // Target change: build queue with optional extra spins
  useEffect(() => {
    if (spinning) return;
    const t = chars ? (target || charSet[0] || " ") : (target || " ").toUpperCase();
    if (t === prevTarget.current) return;
    prevTarget.current = t;

    // Reduced motion: skip animation, jump directly to target
    if (reducedMotion) {
      setCur(t);
      curRef.current = t;
      onCharComplete?.();
      return;
    }

    const steps = stepsTo(curRef.current, t, charSet);
    if (!steps.length && extraSpins <= 0) {
      onCharComplete?.();
      return;
    }
    const prefix = extraSpins > 0 ? fullCycles(curRef.current, extraSpins, charSet) : [];
    queue.current = [...prefix, ...steps];
    const timer = setTimeout(tick, delay);
    return () => clearTimeout(timer);
  }, [target, delay, tick, charSet, onCharComplete, extraSpins, spinning, reducedMotion]);

  // Spinning mode
  useEffect(() => {
    if (spinning) {
      prevTarget.current = null;
      queue.current = fullCycles(curRef.current, 1, charSet);
      const timer = setTimeout(tick, delay);
      return () => clearTimeout(timer);
    }
  }, [spinning, charSet, delay, tick]);

  // Cleanup on unmount
  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
    },
    []
  );

  const S = SIZES[size] || SIZES.md;
  const P = palette || PALETTES[color] || PALETTES.dark;
  const isClassic = variant === "classic";
  const r = isClassic ? 3 : S.radius;
  const half = S.h / 2;
  const flapBack = P.flapBack || darken(P.topBg);

  const charStyle: React.CSSProperties = {
    fontFamily: "'JetBrains Mono', 'SF Mono', 'Fira Code', 'Consolas', monospace",
    fontSize: S.font,
    fontWeight: 700,
    color: P.text,
    width: S.w,
    textAlign: "center",
    lineHeight: `${S.h}px`,
    display: "block",
    userSelect: "none",
  };

  const texture = isClassic ? (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background:
          "repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.06) 1px, rgba(0,0,0,0.06) 2px)",
        pointerEvents: "none",
      }}
    />
  ) : null;

  // Dynamic lighting overlays for animated flaps
  const topLighting = (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(to bottom, rgba(255,255,255,0.06), rgba(0,0,0,0.12))",
        pointerEvents: "none",
      }}
    />
  );
  const botLighting = (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(to bottom, rgba(0,0,0,0.15), rgba(255,255,255,0.04))",
        pointerEvents: "none",
      }}
    />
  );

  const isFlipping = nxt !== null;
  const dispCur = cur || " ";
  const dispNxt = nxt || dispCur;

  return (
    <div
      style={{
        width: S.w,
        height: S.h,
        position: "relative",
        perspective: perspectiveProp,
        display: "inline-block",
        isolation: "isolate",
      }}
      aria-hidden="true"
    >
      {/* STATIC TOP — shows NEXT char (revealed when top flap falls away) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: half,
          overflow: "hidden",
          borderRadius: `${r}px ${r}px 0 0`,
          background: P.topBg,
          zIndex: 1,
        }}
      >
        <span style={charStyle}>{isFlipping ? dispNxt : dispCur}</span>
        {texture}
      </div>

      {/* STATIC BOTTOM — shows CURRENT char */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: half,
          overflow: "hidden",
          borderRadius: `0 0 ${r}px ${r}px`,
          background: P.botBg,
          zIndex: 1,
          boxShadow: isClassic ? "inset 0 3px 6px -2px rgba(0,0,0,0.5)" : undefined,
        }}
      >
        <span style={{ ...charStyle, position: "relative", top: -half }}>
          {dispCur}
        </span>
        {texture}
      </div>

      {/* TOP FLAP — shows old char, folds DOWN to reveal new char behind it */}
      {isFlipping && (
        <div
          key={`t-${flipKey}`}
          className={flipTopClass}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: half,
            overflow: "hidden",
            borderRadius: `${r}px ${r}px 0 0`,
            background: P.topBg,
            zIndex: 4,
            transformOrigin: "bottom center",
            animationDuration: `${flipMs}ms`,
            boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
          }}
        >
          <span style={charStyle}>{dispCur}</span>
          {texture}
          {topLighting}
          {/* Back face — visible as flap folds past ~45deg */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: flapBack,
              transform: "rotateX(180deg)",
              backfaceVisibility: "hidden",
              borderRadius: `${r}px ${r}px 0 0`,
            }}
          />
        </div>
      )}

      {/* BOTTOM FLAP — shows new char, swings UP into place */}
      {isFlipping && (
        <div
          key={`b-${flipKey}`}
          className={flipBotClass}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: half,
            overflow: "hidden",
            borderRadius: `0 0 ${r}px ${r}px`,
            background: P.botBg,
            zIndex: 4,
            transformOrigin: "top center",
            animationDuration: `${flipMs}ms`,
            animationDelay: `${Math.round(flipMs * 0.45)}ms`,
            boxShadow: "0 -3px 10px rgba(0,0,0,0.4)",
          }}
        >
          <span style={{ ...charStyle, position: "relative", top: -half }}>
            {dispNxt}
          </span>
          {texture}
          {botLighting}
        </div>
      )}

      {/* SETTLE BOUNCE — brief oscillation after flip lands */}
      {settling && (
        <div
          key={`s-${settleKey}`}
          className={settleClass}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: half,
            overflow: "hidden",
            borderRadius: `0 0 ${r}px ${r}px`,
            background: P.botBg,
            zIndex: 2,
            animationDuration: `${settleDuration}ms`,
          }}
        >
          <span style={{ ...charStyle, position: "relative", top: -half }}>
            {dispCur}
          </span>
          {texture}
        </div>
      )}

      {/* CENTER DIVIDER with inset seam effect */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          right: 0,
          height: S.divider,
          marginTop: -(S.divider / 2),
          background: P.div,
          zIndex: 10,
          boxShadow: "0 -1px 2px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.4)",
        }}
      />

      {/* HINGE MARKS — classic variant only */}
      {isClassic && (
        <>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: 3,
              width: 4,
              height: 4,
              marginTop: -2,
              borderRadius: "50%",
              background: "#2a2a2e",
              border: "1px solid #3a3a3e",
              zIndex: 12,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "50%",
              right: 3,
              width: 4,
              height: 4,
              marginTop: -2,
              borderRadius: "50%",
              background: "#2a2a2e",
              border: "1px solid #3a3a3e",
              zIndex: 12,
            }}
          />
        </>
      )}

      {/* BORDER OVERLAY */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          border: `1px solid ${P.border}`,
          borderRadius: r,
          zIndex: 11,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
