import type { SplitFlapRowProps } from "./types";

/**
 * A layout row for composing multiple SplitFlap displays and separators
 * in a horizontal line with consistent alignment.
 *
 * ```tsx
 * <SplitFlapRow gap={8}>
 *   <SplitFlap value="PARIS" length={8} />
 *   <SplitFlapSeparator char="-" />
 *   <SplitFlap value="ON TIME" length={8} color="ranger" />
 * </SplitFlapRow>
 * ```
 */
export function SplitFlapRow({
  children,
  gap = 4,
  style = {},
  className,
}: SplitFlapRowProps) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap,
        ...style,
      }}
      className={className}
    >
      {children}
    </div>
  );
}
