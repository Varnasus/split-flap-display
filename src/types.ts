import type { SoundVariant } from "./sound";

export type SplitFlapSize = "sm" | "md" | "lg" | "xl";
export type SplitFlapVariant = "modern" | "classic";
export type SplitFlapColor = "dark" | "light" | "ranger" | "patriot" | "red";
export type SplitFlapMode = "cascade" | "board";

export interface SplitFlapProps {
  /** Text to display. Characters flip through the alphabet to reach each target. */
  value?: string;
  /** Fixed character count. Pads with spaces if value is shorter. */
  length?: number;
  /** Size preset. Default: "md" */
  size?: SplitFlapSize;
  /** Visual style. "modern" = clean/minimal, "classic" = train station with texture. Default: "modern" */
  variant?: SplitFlapVariant;
  /** Color theme. Default: "dark" */
  color?: SplitFlapColor;
  /** Custom color palette. Overrides `color` when provided. */
  palette?: Palette;
  /** Duration of each character flip in ms. Default: 100 */
  flipMs?: number;
  /** Cascade delay between each character starting its flip, in ms. Default: 40 */
  stagger?: number;
  /** Pixel gap between characters. Default: 4 */
  gap?: number;
  /** Animation mode. "cascade" = left-to-right wave. "board" = all flaps spin at once and settle independently. Default: "cascade" */
  mode?: SplitFlapMode;
  /** When true, flaps cycle continuously until a value is set. */
  spinning?: boolean;
  /** Enable flip sound. When true, plays a "clack" on each flip landing. */
  sound?: boolean;
  /** Volume for flip sound, 0 to 1. Default: 0.5 */
  volume?: number;
  /** Sound variant: "clack" (sharp mechanical), "click" (lighter), or "soft" (muted thud). Default: "clack" */
  soundVariant?: SoundVariant;
  /** URL to a custom audio file. Overrides the synthesized sound when provided. */
  soundSrc?: string;
  /** Custom character set. Characters flip forward through this array. */
  chars?: string[];
  /** When true, the initial value flips in from blank on mount instead of appearing statically. */
  animateOnMount?: boolean;
  /** Group sizes for inserting wider gaps. E.g. [2,2,2] adds wider gaps every 2 chars (for HH:MM:SS). */
  groupGaps?: number[];
  /** Pixel width of the wider gap between groups. Default: 12 */
  groupGapSize?: number;
  /** Static text before the display (e.g. "$"). Matches flap visual style but doesn't flip. */
  prefix?: string;
  /** Static text after the display (e.g. "°F", "KG"). Matches flap visual style but doesn't flip. */
  suffix?: string;
  /** Called when all characters have finished flipping to their target values. */
  onFlipComplete?: () => void;
  /** Additional CSS class name(s) for the outer container. */
  className?: string;
  /** Additional inline styles for the outer container. */
  style?: React.CSSProperties;
}

export interface SplitFlapHousingProps {
  children: React.ReactNode;
  /** Label text shown above the housing frame */
  label?: string;
  /** Additional inline styles */
  style?: React.CSSProperties;
}

export interface FlapCharProps {
  target?: string;
  flipMs?: number;
  delay?: number;
  size?: SplitFlapSize;
  color?: SplitFlapColor;
  variant?: SplitFlapVariant;
  /** Custom color palette. Overrides `color` when provided. */
  palette?: Palette;
  /** Enable flip sound. */
  sound?: boolean;
  /** Volume for flip sound, 0 to 1. Default: 0.5 */
  volume?: number;
  /** Sound variant: "clack", "click", or "soft". Default: "clack" */
  soundVariant?: SoundVariant;
  /** URL to a custom audio file. Overrides synthesis. */
  soundSrc?: string;
  /** Custom character set. */
  chars?: string[];
  /** Called when this character has finished flipping to its target. */
  onCharComplete?: () => void;
  /** Number of extra full cycles through the character set before settling (board mode). */
  extraSpins?: number;
  /** When true, cycle continuously without stopping. */
  spinning?: boolean;
  /** When true, flip in from blank on mount. */
  animateOnMount?: boolean;
}

export interface SplitFlapSeparatorProps {
  /** Character to display (e.g. ":", "-", "/", "."). Default: ":" */
  char?: string;
  /** Size preset — matches the SplitFlap it sits beside. Default: "md" */
  size?: SplitFlapSize;
  /** Color theme. Default: "dark" */
  color?: SplitFlapColor;
  /** Custom color palette. */
  palette?: Palette;
  /** Visual style. Default: "modern" */
  variant?: SplitFlapVariant;
}

export interface SplitFlapRowProps {
  children: React.ReactNode;
  /** Pixel gap between child elements. Default: 4 */
  gap?: number;
  /** Additional inline styles. */
  style?: React.CSSProperties;
  /** Additional CSS class name(s). */
  className?: string;
}

// ── Template types ──

export interface DepartureBoardRow {
  time?: string;
  destination: string;
  flight?: string;
  gate?: string;
  status?: string;
}

export interface DepartureBoardProps {
  rows: DepartureBoardRow[];
  /** Title shown above the board. Default: "DEPARTURES" */
  title?: string;
  size?: SplitFlapSize;
  variant?: SplitFlapVariant;
  mode?: SplitFlapMode;
  sound?: boolean;
  volume?: number;
  soundVariant?: SoundVariant;
  className?: string;
  style?: React.CSSProperties;
}

export interface ArrivalBoardRow {
  time?: string;
  origin: string;
  flight?: string;
  gate?: string;
  status?: string;
}

export interface ArrivalBoardProps {
  rows: ArrivalBoardRow[];
  /** Title shown above the board. Default: "ARRIVALS" */
  title?: string;
  size?: SplitFlapSize;
  variant?: SplitFlapVariant;
  mode?: SplitFlapMode;
  sound?: boolean;
  volume?: number;
  soundVariant?: SoundVariant;
  className?: string;
  style?: React.CSSProperties;
}

export interface ScoreBoardEntry {
  label: string;
  score: string | number;
}

export interface ScoreBoardProps {
  entries: ScoreBoardEntry[];
  /** Title shown above the board. */
  title?: string;
  size?: SplitFlapSize;
  variant?: SplitFlapVariant;
  color?: SplitFlapColor;
  mode?: SplitFlapMode;
  sound?: boolean;
  volume?: number;
  soundVariant?: SoundVariant;
  className?: string;
  style?: React.CSSProperties;
}

export interface CountdownBoardProps {
  /** Target date/time to count down to. */
  target: Date | string | number;
  /** Labels for each unit. Default: ["DAYS","HRS","MIN","SEC"] */
  labels?: [string, string, string, string];
  size?: SplitFlapSize;
  variant?: SplitFlapVariant;
  color?: SplitFlapColor;
  sound?: boolean;
  volume?: number;
  soundVariant?: SoundVariant;
  /** Called when the countdown reaches zero. */
  onComplete?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export interface MessageBoardProps {
  /** Array of messages to cycle through. */
  messages: string[];
  /** Seconds between message changes. Default: 5 */
  interval?: number;
  /** Fixed character width. Default: longest message length. */
  length?: number;
  size?: SplitFlapSize;
  variant?: SplitFlapVariant;
  color?: SplitFlapColor;
  mode?: SplitFlapMode;
  sound?: boolean;
  volume?: number;
  soundVariant?: SoundVariant;
  className?: string;
  style?: React.CSSProperties;
}

export interface Palette {
  text: string;
  topBg: string;
  botBg: string;
  border: string;
  div: string;
  /** Darker shade shown on the back face of the flap during fold. Defaults to a darkened topBg. */
  flapBack?: string;
}

export interface SizeConfig {
  w: number;
  h: number;
  font: number;
  divider: number;
  radius: number;
}
