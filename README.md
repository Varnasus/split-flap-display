# clackboard

[![npm version](https://img.shields.io/npm/v/clackboard)](https://www.npmjs.com/package/clackboard)
[![bundle size](https://img.shields.io/bundlephobia/minzip/clackboard)](https://bundlephobia.com/package/clackboard)
[![license](https://img.shields.io/npm/l/clackboard)](./LICENSE)

A composable React split-flap display component with realistic 3D flip animation, mechanical sound synthesis, board mode, and pre-built templates. Zero dependencies beyond React.

Inspired by train station departure boards and airport Solari displays. Characters don't just swap — they flip through the alphabet one by one, with authentic forward-only cycling and staggered cascade timing.

## Features

- **3D flip animation** — CSS `rotateX` transforms with perspective, settle bounce, and back-face shading
- **Board mode** — All flaps spin simultaneously and settle one by one, like a real departure board
- **Sound synthesis** — Three Web Audio API sound variants (clack, click, soft) — no audio files
- **5 color themes** — dark, light, ranger, patriot, red — plus fully custom palettes
- **4 size presets** — sm, md, lg, xl
- **2 visual styles** — modern (clean) and classic (scan-line texture)
- **Pre-built templates** — DepartureBoard, ArrivalBoard, ScoreBoard, CountdownBoard, MessageBoard
- **Hooks** — `useClock`, `useCountdown`, `useCyclingMessages`, `usePriceDisplay`
- **Character set presets** — `NUMERIC_CHARS` for fast number transitions, `ALPHA_CHARS` for letters only
- **Spinning mode** — Continuous cycling for loading states
- **Animate on mount** — Flip in from blank when the component first renders
- **Group gaps** — Wider spacing at boundaries (for `HH:MM:SS`, phone numbers, etc.)
- **Prefix / suffix** — Static text flanking the display (`$`, `°F`, `KG`)
- **Accessible** — `role="status"`, `aria-label`, `aria-live="polite"`
- **SSR-safe** — All browser APIs are lazy-initialized with `typeof` guards
- **Zero dependencies** — Only React 17+ as peer dep
- **Tree-shakeable** — ESM + CJS with `sideEffects: false`

## Install

```bash
npm install clackboard
```

**Requirements:** React 17+ and a monospace font like [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) for best results.

```html
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
```

## Quick Start

```tsx
import { SplitFlap } from "clackboard";

function App() {
  return <SplitFlap value="HELLO WORLD" size="lg" color="ranger" />;
}
```

## Examples

### Cycling headline

```tsx
import { SplitFlap, useCyclingMessages } from "clackboard";

function Hero() {
  const message = useCyclingMessages(["HELLO WORLD", "SPLIT FLAP", "OPEN SOURCE"], 4);
  return <SplitFlap value={message} length={14} size="xl" color="ranger" />;
}
```

### Board mode — departure board feel

All flaps spin at once, then settle independently:

```tsx
<SplitFlap value="PARIS CDG" mode="board" size="lg" variant="classic" sound />
```

### Live clock with hooks

```tsx
import { SplitFlap, useClock, NUMERIC_CHARS } from "clackboard";

function Clock() {
  const time = useClock("HH:MM:SS");
  return (
    <SplitFlap
      value={time}
      length={8}
      chars={NUMERIC_CHARS}
      groupGaps={[2, 1, 2, 1, 2]}
      size="lg"
      color="ranger"
      variant="classic"
    />
  );
}
```

### Price display

```tsx
import { SplitFlap, NUMERIC_CHARS, usePriceDisplay } from "clackboard";

function StockPrice({ price }: { price: number }) {
  const display = usePriceDisplay(price);
  return <SplitFlap value={display} length={8} chars={NUMERIC_CHARS} prefix="$" size="lg" />;
}
```

### Drop-in departure board

```tsx
import { DepartureBoard } from "clackboard";

<DepartureBoard
  rows={[
    { time: "14:30", destination: "PARIS CDG", flight: "AF1234", gate: "B22", status: "ON TIME" },
    { time: "15:15", destination: "LONDON LHR", flight: "BA456", gate: "A10", status: "BOARDING" },
    { time: "16:45", destination: "TOKYO NRT", flight: "JL42", gate: "C5", status: "DELAYED" },
  ]}
  sound
  soundVariant="soft"
/>
```

### Countdown timer

```tsx
import { CountdownBoard } from "clackboard";

<CountdownBoard target="2027-01-01T00:00:00" onComplete={() => console.log("Happy New Year!")} />
```

### Spinning / loading state

```tsx
import { SplitFlap } from "clackboard";

function Loader({ loading, text }: { loading: boolean; text: string }) {
  return <SplitFlap value={text} length={12} spinning={loading} size="md" color="ranger" />;
}
```

### Animate on mount

```tsx
<SplitFlap value="WELCOME" size="xl" animateOnMount />
```

### Trigger on scroll

```tsx
import { useState, useEffect, useRef } from "react";
import { SplitFlap } from "clackboard";

function Stats() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.5 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref}>
      <SplitFlap value={visible ? "2025" : "    "} length={4} size="lg" color="patriot" />
    </div>
  );
}
```

## API

### `<SplitFlap>`

The core display component.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | `""` | Text to display. Characters flip through the alphabet to reach each target. |
| `length` | `number` | `value.length` | Fixed character count. Pads with spaces if value is shorter. |
| `size` | `"sm" \| "md" \| "lg" \| "xl"` | `"md"` | Size preset. |
| `variant` | `"modern" \| "classic"` | `"modern"` | Visual style. Classic adds scan-line texture. |
| `color` | `"dark" \| "light" \| "ranger" \| "patriot" \| "red"` | `"dark"` | Color theme. |
| `palette` | `Palette` | — | Custom color palette. Overrides `color` when provided. |
| `flipMs` | `number` | `100` | Duration of each character flip in ms. |
| `stagger` | `number` | `40` | Cascade delay between each character starting its flip (ms). |
| `gap` | `number` | `4` | Pixel gap between characters. |
| `mode` | `"cascade" \| "board"` | `"cascade"` | Animation mode. Board mode: all flaps spin at once, settle independently. |
| `spinning` | `boolean` | `false` | Continuous cycling with no target. For loading states. |
| `sound` | `boolean` | `false` | Enable flip sound on each flap landing. |
| `volume` | `number` | `0.5` | Sound volume, 0 to 1. |
| `soundVariant` | `"clack" \| "click" \| "soft"` | `"clack"` | Sound type. |
| `soundSrc` | `string` | — | URL to a custom audio file. Overrides synthesis. |
| `chars` | `string[]` | `CHARS` | Custom character set. Use `NUMERIC_CHARS` for fast number transitions. |
| `animateOnMount` | `boolean` | `false` | Flip in from blank on mount instead of showing value statically. |
| `groupGaps` | `number[]` | — | Group sizes for wider gaps. `[2,1,2,1,2]` for `HH:MM:SS`. |
| `groupGapSize` | `number` | `12` | Pixel width of the wider gap between groups. |
| `prefix` | `string` | — | Static text before the display (e.g. `"$"`). |
| `suffix` | `string` | — | Static text after the display (e.g. `"°F"`). |
| `onFlipComplete` | `() => void` | — | Called when all characters have finished flipping. |
| `className` | `string` | — | CSS class for the outer container. |
| `style` | `CSSProperties` | — | Inline styles for the outer container. |

### `<SplitFlapHousing>`

Decorative train-station frame with corner bolts, inset shadow, and optional label.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | — | Label text above the housing. |
| `style` | `CSSProperties` | `{}` | Additional inline styles. |
| `children` | `ReactNode` | — | Content to wrap. |

### `<SplitFlapSeparator>`

Static visual divider that matches flap styling but doesn't flip. For time displays, flight numbers, etc.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `char` | `string` | `":"` | Character to display. |
| `size` | `SplitFlapSize` | `"md"` | Size preset — match the adjacent SplitFlap. |
| `color` | `SplitFlapColor` | `"dark"` | Color theme. |
| `palette` | `Palette` | — | Custom palette. |
| `variant` | `SplitFlapVariant` | `"modern"` | Visual style. |

### `<SplitFlapRow>`

Layout row for composing multiple displays horizontally.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `gap` | `number` | `4` | Pixel gap between children. |
| `style` | `CSSProperties` | — | Additional inline styles. |
| `className` | `string` | — | CSS class. |
| `children` | `ReactNode` | — | Content. |

### `<FlapChar>`

Individual animated character. Exported for advanced custom layouts.

## Templates

Drop-in real-world boards. All templates accept `sound`, `volume`, `soundVariant`, `mode`, `className`, and `style` props.

### `<DepartureBoard>`

```tsx
<DepartureBoard
  rows={[{ time: "14:30", destination: "PARIS CDG", flight: "AF1234", gate: "B22", status: "ON TIME" }]}
  title="DEPARTURES"
  sound
/>
```

| Prop | Type | Default |
|------|------|---------|
| `rows` | `DepartureBoardRow[]` | — |
| `title` | `string` | `"DEPARTURES"` |
| `size` | `SplitFlapSize` | `"sm"` |
| `variant` | `SplitFlapVariant` | `"classic"` |
| `mode` | `SplitFlapMode` | `"board"` |

**`DepartureBoardRow`**: `{ time?, destination, flight?, gate?, status? }`

Status colors: "DELAY" = red, "BOARD" = green, other = navy.

### `<ArrivalBoard>`

Same as DepartureBoard but with `origin` instead of `destination`. Default title: `"ARRIVALS"`.

### `<ScoreBoard>`

```tsx
<ScoreBoard title="MATCH" entries={[{ label: "HOME", score: 3 }, { label: "AWAY", score: 1 }]} />
```

| Prop | Type | Default |
|------|------|---------|
| `entries` | `ScoreBoardEntry[]` | — |
| `title` | `string` | — |
| `size` | `SplitFlapSize` | `"lg"` |
| `color` | `SplitFlapColor` | `"ranger"` |

**`ScoreBoardEntry`**: `{ label: string, score: string | number }`

### `<CountdownBoard>`

```tsx
<CountdownBoard target="2027-01-01T00:00:00" onComplete={() => alert("Done!")} />
```

| Prop | Type | Default |
|------|------|---------|
| `target` | `Date \| string \| number` | — |
| `labels` | `[string, string, string, string]` | `["DAYS","HRS","MIN","SEC"]` |
| `onComplete` | `() => void` | — |
| `size` | `SplitFlapSize` | `"lg"` |
| `color` | `SplitFlapColor` | `"ranger"` |

### `<MessageBoard>`

```tsx
<MessageBoard messages={["WELCOME", "NEXT TRAIN: 5 MIN", "PLATFORM 3"]} interval={4} sound />
```

| Prop | Type | Default |
|------|------|---------|
| `messages` | `string[]` | — |
| `interval` | `number` | `5` (seconds) |
| `length` | `number` | longest message |
| `mode` | `SplitFlapMode` | `"board"` |

## Hooks

### `useClock(format?)`

Returns the current time as a formatted string, updating every second.

```tsx
const time = useClock();           // "14:30:45"
const time = useClock("HH:MM");    // "14:30"
```

**Formats:** `"HH:MM:SS"` (default), `"HH:MM"`, `"HH:MM:SS.ms"`

### `useCountdown(target)`

Counts down to a target date, updating every second.

```tsx
const { display, days, hours, minutes, seconds, complete, totalSeconds } = useCountdown("2027-01-01");
```

**Returns `CountdownValue`:** `{ display, days, hours, minutes, seconds, complete, totalSeconds }`

### `useCyclingMessages(messages, intervalSeconds?)`

Cycles through an array of messages on a timer.

```tsx
const message = useCyclingMessages(["HELLO", "WORLD"], 5);
```

### `usePriceDisplay(value, decimals?)`

Formats a number as a price string.

```tsx
const price = usePriceDisplay(1250.5); // "1250.50"
```

## Sound

Three built-in sound variants, synthesized at runtime via Web Audio API — no audio files bundled.

| Variant | Character | Components |
|---------|-----------|------------|
| `"clack"` | Sharp mechanical snap | Bandpass noise burst + low thump + latch click |
| `"click"` | Lighter keyboard switch | Highpass noise burst + sine tick |
| `"soft"` | Muted background thud | Lowpass noise burst + sub thump |

```tsx
// Enable on a display
<SplitFlap value="HELLO" sound soundVariant="clack" volume={0.5} />

// Or use a custom audio file
<SplitFlap value="HELLO" sound soundSrc="/sounds/my-clack.wav" />
```

**Standalone functions:**

```tsx
import { playSound, resumeAudio } from "clackboard";

playSound("clack", 0.5);       // Fire-and-forget
resumeAudio();                   // Unlock audio on iOS/Safari (call from user gesture)
```

## Character Sets

| Constant | Characters | Use Case |
|----------|-----------|----------|
| `CHARS` | `" A-Z 0-9 . : - / + ! ?"` | Default — full alphabet + numbers + punctuation |
| `NUMERIC_CHARS` | `" 0-9 . , : + - / $ %"` | Clocks, counters, prices — fast transitions |
| `ALPHA_CHARS` | `" A-Z"` | Letters only — faster alpha transitions |

```tsx
import { SplitFlap, NUMERIC_CHARS } from "clackboard";

// A clock digit going 5→6 takes 1 step with NUMERIC_CHARS vs ~40 with CHARS
<SplitFlap value="12:45" chars={NUMERIC_CHARS} />
```

## Color Themes

| Theme | Text | Background | Vibe |
|-------|------|------------|------|
| `dark` | White | Dark gray | Neutral default |
| `light` | Black | Warm cream | Light mode |
| `ranger` | Green | Dark forest | Ranger Ventures brand |
| `patriot` | White | Deep navy | USA-inspired, clean |
| `red` | Red | Dark wine | Accent / alerts |

### Custom Palette

```tsx
<SplitFlap
  value="CUSTOM"
  palette={{
    text: "#ffd700",
    topBg: "#1a1a2e",
    botBg: "#16162a",
    border: "#2a2a4e",
    div: "#0a0a14",
    flapBack: "#121228", // optional: darker shade for back of flap during fold
  }}
/>
```

## How It Works

Each character maintains a flip queue. When the target changes, it calculates the steps needed to reach the new character by cycling forward through the character set (just like a real Solari board — no backwards flipping).

The 3D flip uses CSS `rotateX` transforms with `perspective` on the parent. The top half folds down (ease-in), then the bottom half swings up into place (ease-out) with a slight delay. Elements are keyed by a counter to force React to remount and retrigger the CSS animation on every flip. A subtle 3-degree settle bounce fires after each landing.

**Board mode** changes the timing: all characters start near-simultaneously with random offsets (0-80ms), each gets 1-2.5 extra full cycles through the character set, and flipMs varies ±15% per character. The result is chaotic spinning that gradually resolves into readable text.

**Sound** is synthesized at runtime using the Web Audio API (oscillators, noise buffers, and biquad filters). No audio files are bundled. The AudioContext is lazily initialized and SSR-safe.

## Browser Support

Works in all modern browsers (Chrome, Firefox, Safari, Edge). Requires CSS 3D transform support and Web Audio API for sound.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development setup, testing, and code style guidelines.

## License

MIT — [Zach Varney](https://zvarney.com) / [Ranger Ventures LLC](https://rangerventures.com)
