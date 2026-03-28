# Changelog

## 0.1.0 (2026-03-27)

Initial release.

### Core
- `<SplitFlap>` component with realistic 3D CSS flip animation
- `<SplitFlapHousing>` decorative train-station frame with corner bolts
- `<FlapChar>` individual animated character (exported for advanced layouts)
- Forward-only cycling through character set (authentic Solari behavior)
- Queue-based processing with stagger cascade timing
- Settle bounce animation (3-degree oscillation after each flip)
- Flap back-face shading for depth during fold

### Modes
- **Cascade mode** (default) — left-to-right wave with configurable stagger
- **Board mode** (`mode="board"`) — all flaps spin simultaneously with extra cycles, settle independently
- **Spinning** (`spinning`) — continuous cycling for loading states

### Sound
- Web Audio API synthesis — no bundled audio files
- Three variants: `"clack"` (mechanical snap), `"click"` (keyboard switch), `"soft"` (muted thud)
- Custom audio URL support via `soundSrc`
- `playSound()` and `resumeAudio()` exported for standalone use
- SSR-safe with lazy AudioContext initialization

### Customization
- 5 color themes: dark, light, ranger, patriot, red
- 4 size presets: sm, md, lg, xl
- 2 visual styles: modern, classic (scan-line texture)
- Custom palettes via `palette` prop (with optional `flapBack` for back-face color)
- Custom character sets via `chars` prop
- `NUMERIC_CHARS` preset for fast number transitions (clocks, counters, prices)
- `ALPHA_CHARS` preset for letters only
- `animateOnMount` — flip in from blank on first render
- `groupGaps` — wider spacing at group boundaries
- `prefix` / `suffix` — static text flanking the display
- `className` / `style` for container styling
- `onFlipComplete` callback

### Layout Components
- `<SplitFlapSeparator>` — static visual dividers (colon, dash, etc.)
- `<SplitFlapRow>` — horizontal layout composition

### Templates
- `<DepartureBoard>` — flight/train departure board with smart status coloring
- `<ArrivalBoard>` — arrivals board
- `<ScoreBoard>` — label-value pairs in a grid
- `<CountdownBoard>` — live countdown timer with `onComplete` callback
- `<MessageBoard>` — rotating message display

### Hooks
- `useClock(format?)` — live clock string
- `useCountdown(target)` — countdown with days/hours/minutes/seconds
- `useCyclingMessages(messages, interval)` — rotating message
- `usePriceDisplay(value, decimals)` — formatted price string

### Accessibility
- `role="status"`, `aria-label`, `aria-live="polite"` on SplitFlap container
- `aria-hidden="true"` on individual characters
- Prefix/suffix included in aria-label

### Other
- Zero dependencies beyond React 17+ peer dep
- ESM + CJS dual build with TypeScript declarations
- SSR-safe throughout
- Tree-shakeable (`sideEffects: false`)
