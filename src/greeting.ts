// Package version — kept in sync with package.json by the build process.
const VERSION = "1.1.2";

let greeted = false;

/** Print a small console greeting once per page load. SSR- and test-safe. */
export function printGreeting(): void {
  if (greeted) return;
  if (typeof window === "undefined") return;
  if (typeof console === "undefined" || typeof console.log !== "function") return;
  // Skip in test environments
  if (
    typeof process !== "undefined" &&
    process.env &&
    (process.env.NODE_ENV === "test" || process.env.VITEST)
  ) {
    return;
  }
  greeted = true;

  const brand = "color:#4ade80;font-weight:600;";
  const muted = "color:#888;font-weight:400;";
  console.log(
    `%c▚ clackboard%c  v${VERSION}\n%c  ranger ventures · zvarney.com`,
    brand,
    muted,
    muted
  );
}
