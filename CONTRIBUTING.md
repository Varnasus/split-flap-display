# Contributing to clackboard

Thanks for your interest in contributing! Here's how to get started.

## Development Setup

```bash
git clone https://github.com/Varnasus/split-flap-display.git
cd clackboard
npm install
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Build in watch mode |
| `npm run build` | Production build to `dist/` |
| `npm run typecheck` | TypeScript type check (no emit) |
| `npm test` | Run tests once |
| `npm run test:watch` | Run tests in watch mode |

## Testing the Demo

Open `demo/index.html` directly in your browser — no build step required. It contains a full vanilla JS reimplementation of the split-flap engine for visual testing.

## Code Style

- **TypeScript strict mode** — all code must pass `tsc --noEmit` with zero errors
- **No external CSS files** — all styles are inline or injected keyframes via `styles.ts`
- **No CSS-in-JS libraries** — keep zero dependencies
- **Color values** live in `constants.ts` `PALETTES`, not scattered in components
- **Size values** live in `constants.ts` `SIZES`
- **All public props** are documented with JSDoc in `types.ts`
- **No unnecessary abstractions** — prefer simplicity over premature generalization

## Architecture

```
src/
  index.ts          # Barrel exports
  types.ts          # All TypeScript interfaces
  constants.ts      # CHARS, PALETTES, SIZES, stepsTo()
  styles.ts         # CSS keyframe injection
  sound.ts          # Web Audio API sound synthesis
  FlapChar.tsx      # Single animated character
  SplitFlap.tsx     # Row of characters with cascade/board mode
  Housing.tsx       # Decorative frame
  Separator.tsx     # Static visual divider
  Row.tsx           # Layout composition
  templates.tsx     # Pre-built board templates
  hooks.ts          # useClock, useCountdown, etc.
```

## Pull Request Process

1. Fork the repo and create a feature branch from `main`
2. Make your changes
3. Run `npm run typecheck && npm run build && npm test` — all must pass
4. Write a clear PR description explaining what and why
5. Submit against `main`

## Key Design Decisions

Before making changes, understand these architectural choices:

- **CSS class-based animations** — Keyframes are injected into `<head>` once. Animated elements use `className` for the animation name and inline styles for duration/delay.
- **Flip key counter** — Each flip increments a counter used as a React `key`, forcing a remount to retrigger CSS animations. This is intentional.
- **Forward-only cycling** — Characters always flip forward through the character set array. No backwards flipping. This matches real mechanical Solari boards.
- **Queue-based processing** — Each character has its own flip queue gated by a `busy` ref. Don't try to replace this with state — refs are necessary for the animation timing.
- **Web Audio synthesis** — Sound is generated at runtime with oscillators and filters. No audio files. Keep it this way.

## Questions?

Open an issue on [GitHub](https://github.com/Varnasus/split-flap-display/issues).
