# CLAUDE.md — clackboard

## What This Is
A React component library published to npm that renders split-flap / Solari-style displays with realistic 3D flip animation. Zero dependencies beyond React peer dep. Includes board templates (DepartureBoard, ArrivalBoard, ScoreBoard, CountdownBoard, MessageBoard) for drop-in real-world use.

## Owner
Zach Varney — github.com/Varnasus — Ranger Ventures LLC

## Tech Stack
- **Language:** TypeScript (strict)
- **Build:** tsup (ESM + CJS + .d.ts)
- **Framework:** React 17+ (peer dep, no bundled React)
- **Styling:** Inline styles + injected CSS keyframes (no CSS modules, no styled-components, no external CSS files)
- **Testing:** TODO — Vitest + React Testing Library

## Architecture
```
src/
  index.ts          # Barrel exports (public API surface)
  types.ts          # All TypeScript interfaces/types (incl. template props)
  constants.ts      # CHARS, NUMERIC_CHARS, ALPHA_CHARS, PALETTES, SIZES, stepsTo()
  styles.ts         # Keyframe injection (runs once, SSR-safe)
  sound.ts          # Web Audio API synthesized sounds (lazy init, SSR-safe)
  FlapChar.tsx       # Single character with flip queue + 3D animation + spinning
  SplitFlap.tsx      # Row of FlapChars with cascade/board mode + stagger timing
  Housing.tsx        # Classic train-station decorative frame
  Separator.tsx      # Static visual divider (colon, dash, etc.)
  Row.tsx            # Layout row for composing multiple displays
  templates.tsx      # Pre-built boards: Departure, Arrival, Score, Countdown, Message
  hooks.ts           # useClock(), useCountdown(), useCyclingMessages(), usePriceDisplay()
```

## Key Design Decisions
- **CSS class-based animations, not inline `animation` property.** Inline animation references to keyframes are unreliable in React. The keyframes are injected into `<head>` via `styles.ts`, and flap elements use `className="sf-flip-top"` / `className="sf-flip-bot"` / `className="sf-settle"`. Duration and delay are set inline (those work fine).
- **Flip key counter forces remount.** Each flip increments a `flipKey` state. The animated `<div>` uses `key={`t-${flipKey}`}` so React destroys and recreates it, which re-triggers the CSS animation. Without this, subsequent flips don't animate.
- **Forward-only cycling.** Characters always flip forward through the CHARS array (or custom `chars`), wrapping around. No backwards flipping — matches real Solari boards.
- **Queue-based processing.** Each FlapChar has its own queue. When target changes, all intermediate steps are queued and processed sequentially with `busy` ref gating.
- **Web Audio API for sound.** `sound.ts` synthesizes sounds at runtime using oscillators, noise buffers, and filters — no audio files or base64 samples. Three variants: "clack" (sharp mechanical snap), "click" (keyboard switch feel), "soft" (muted thud). Lazy AudioContext initialization (SSR-safe). Custom audio URLs use HTML Audio element as override. `playSound()` is purely imperative, fire-and-forget.
- **Settle bounce.** After each flip lands, a 150ms `sf-settle` animation applies a 3° oscillation to the bottom half. Uses z-index layering (settle at 2, flips at 4) so it doesn't conflict with rapid successive flips.
- **Board mode.** `mode="board"` makes all flaps start near-simultaneously (0-80ms random offsets) with 1-2.5 extra full cycles through the character set and ±15% flipMs variation per character. Creates the classic "all spinning, settling one by one" departure board effect. Uses a seeded hash per index for stable random values across re-renders.
- **Spinning.** `spinning={true}` continuously cycles flaps through the full character set. When spinning stops, the queue drains naturally. Great for loading states.
- **Templates.** Pre-built board components (DepartureBoard, ArrivalBoard, ScoreBoard, CountdownBoard, MessageBoard) compose SplitFlap, Housing, Separator, and Row internally. Smart color coding (e.g. DELAYED→red, BOARDING→green).

## Known Issues / TODOs
- [x] **Flip card back color:** Back face of folding flap now shows a darker shade via `flapBack` palette field (auto-darkened fallback).
- [x] **Settle bounce:** 3° bounce/settle animation (150ms) fires after each flip landing.
- [x] **Sound option:** Web Audio API synthesized sounds via `sound`/`soundVariant`/`volume`/`soundSrc` props. Three variants: "clack", "click", "soft". No bundled audio files — all generated at runtime with oscillators and filters.
- [x] **Custom character sets:** `chars` prop accepts custom array. `stepsTo()` supports custom char sets.
- [x] **Custom color themes:** `palette` prop accepts full Palette object, overrides `color` when provided.
- [x] **a11y:** `role="status"`, `aria-label`, `aria-live="polite"` on SplitFlap container. Individual chars are `aria-hidden`.
- [x] **className/style:** SplitFlap accepts `className` and `style` props for integration.
- [x] **onFlipComplete:** Callback fires when all characters reach their targets.
- [x] **Board mode:** `mode="board"` — all flaps spin simultaneously with extra cycles, settle independently.
- [x] **Spinning:** `spinning` prop for continuous cycling / loading states.
- [x] **Separator:** `SplitFlapSeparator` for static visual dividers between character groups.
- [x] **Row component:** `SplitFlapRow` for composing multiple displays in a horizontal line.
- [x] **Templates:** DepartureBoard, ArrivalBoard, ScoreBoard, CountdownBoard, MessageBoard — drop-in real-world boards.
- [x] **Character set presets:** `NUMERIC_CHARS` (0-9, space, punctuation) and `ALPHA_CHARS` (A-Z, space) for fast transitions.
- [x] **animateOnMount:** When false (default), initial value appears statically. When true, flips in from blank on mount.
- [x] **groupGaps:** Insert wider gaps at group boundaries. `groupGaps={[2,2,2]}` for clock/time displays.
- [x] **prefix/suffix:** Static text flanking the display ("$", "°F", "KG") matching flap visual style.
- [x] **Hooks:** `useClock()`, `useCountdown()`, `useCyclingMessages()`, `usePriceDisplay()` — ready-to-use values.
- [ ] **Demo site:** Build a GitHub Pages demo site (could be simple HTML or a Vite app) showing all variants.
- [ ] **Tests:** Add Vitest + RTL tests for: character cycling logic, queue processing, prop changes, SSR safety.
- [ ] **Performance:** For very long displays (30+ chars), consider virtualization or batched renders.

## Commands
```bash
npm install          # Install deps
npm run build        # Build to dist/
npm run dev          # Build in watch mode
npm run typecheck    # Type check without emitting
npm publish          # Publish to npm (runs build first via prepublishOnly)
```

## Publishing Checklist
1. Bump version in package.json
2. `npm run build` — verify dist/ output
3. `npm publish` — pushes to npm registry
4. `git tag v0.x.x && git push --tags`

## Style Rules
- No external CSS files. All styles are inline or injected keyframes.
- No CSS-in-JS libraries. Keep zero dependencies.
- Color values live in constants.ts PALETTES, not scattered in components.
- Sizes live in constants.ts SIZES.
- All public props are documented in types.ts with JSDoc.
