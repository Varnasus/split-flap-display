import type { SplitFlapHousingProps } from "./types";

/**
 * Decorative housing frame that wraps a SplitFlap display to give it
 * the classic train station / departure board look. Includes corner bolts,
 * inset shadow, and an optional label.
 *
 * ```tsx
 * <SplitFlapHousing label="departures">
 *   <SplitFlap value="PARIS" variant="classic" color="ranger" />
 * </SplitFlapHousing>
 * ```
 */
export function SplitFlapHousing({
  children,
  label,
  style = {},
}: SplitFlapHousingProps) {
  return (
    <div
      style={{
        background: "#0a0a0c",
        border: "2px solid #1a1a1d",
        borderRadius: 8,
        padding: "28px 20px",
        position: "relative",
        boxShadow:
          "inset 0 2px 12px rgba(0,0,0,0.6), 0 4px 20px rgba(0,0,0,0.4)",
        ...style,
      }}
    >
      {label && (
        <div
          style={{
            position: "absolute",
            top: -10,
            left: 20,
            background: "#0a0a0c",
            padding: "2px 10px",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 9,
            color: "#555",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}
        >
          {label}
        </div>
      )}
      {(
        [
          { top: 8, left: 8 },
          { top: 8, right: 8 },
          { bottom: 8, left: 8 },
          { bottom: 8, right: 8 },
        ] as React.CSSProperties[]
      ).map((pos, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            ...pos,
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#1e1e22",
            border: "1px solid #2a2a2e",
            boxShadow: "inset 0 1px 2px rgba(0,0,0,0.5)",
          }}
        />
      ))}
      {children}
    </div>
  );
}
