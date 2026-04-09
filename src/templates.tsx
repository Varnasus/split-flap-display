import { useState, useEffect } from "react";
import type {
  DepartureBoardProps,
  ArrivalBoardProps,
  ScoreBoardProps,
  CountdownBoardProps,
  MessageBoardProps,
} from "./types";
import { SplitFlap } from "./SplitFlap";
import { SplitFlapHousing } from "./Housing";
import { SplitFlapSeparator } from "./Separator";
import { SplitFlapRow } from "./Row";

// ── Shared helpers ──

const headerStyle: React.CSSProperties = {
  display: "flex",
  gap: 16,
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: 9,
  color: "#444",
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  paddingBottom: 6,
  borderBottom: "1px solid #1a1a1d",
  marginBottom: 10,
};

const rowGap: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  marginBottom: 6,
};

const labelStyle: React.CSSProperties = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: 9,
  color: "#444",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  marginTop: 6,
  textAlign: "center",
};

// ── DepartureBoard ──

/**
 * Pre-built departure board template. Drop in data and go.
 *
 * ```tsx
 * <DepartureBoard rows={[
 *   { time: "14:30", destination: "PARIS CDG", flight: "AF1234", gate: "B22", status: "ON TIME" },
 *   { time: "15:15", destination: "LONDON LHR", flight: "BA456", gate: "A10", status: "BOARDING" },
 * ]} />
 * ```
 */
export function DepartureBoard({
  rows,
  title = "DEPARTURES",
  size = "sm",
  variant = "classic",
  mode = "board",
  easing,
  perspective,
  sound,
  volume,
  soundVariant,
  className,
  style,
}: DepartureBoardProps) {
  return (
    <SplitFlapHousing label={title} style={style}>
      <div className={className}>
        <div style={headerStyle}>
          <span style={{ width: 100 }}>Time</span>
          <span style={{ width: 200 }}>Destination</span>
          <span style={{ width: 120 }}>Flight</span>
          <span style={{ width: 80 }}>Gate</span>
          <span style={{ width: 160 }}>Status</span>
        </div>
        {rows.map((row, i) => (
          <div key={i} style={rowGap}>
            <SplitFlap
              value={row.time || ""}
              length={5}
              size={size}
              variant={variant}
              color="dark"
              mode={mode}
              sound={sound}
              volume={volume}
              soundVariant={soundVariant}
              easing={easing}
              perspective={perspective}
              stagger={20 + i * 4}
            />
            <SplitFlap
              value={row.destination}
              length={10}
              size={size}
              variant={variant}
              color="ranger"
              mode={mode}
              sound={sound}
              volume={volume}
              soundVariant={soundVariant}
              easing={easing}
              perspective={perspective}
              stagger={25 + i * 4}
            />
            <SplitFlap
              value={row.flight || ""}
              length={6}
              size={size}
              variant={variant}
              color="dark"
              mode={mode}
              sound={sound}
              volume={volume}
              soundVariant={soundVariant}
              easing={easing}
              perspective={perspective}
              stagger={30 + i * 4}
            />
            <SplitFlap
              value={row.gate || ""}
              length={3}
              size={size}
              variant={variant}
              color="dark"
              mode={mode}
              sound={sound}
              volume={volume}
              soundVariant={soundVariant}
              easing={easing}
              perspective={perspective}
              stagger={35 + i * 4}
            />
            <SplitFlap
              value={row.status || ""}
              length={8}
              size={size}
              variant={variant}
              color={
                row.status?.toUpperCase().includes("DELAY") ? "red"
                : row.status?.toUpperCase().includes("BOARD") ? "ranger"
                : "patriot"
              }
              mode={mode}
              sound={sound}
              volume={volume}
              soundVariant={soundVariant}
              easing={easing}
              perspective={perspective}
              stagger={40 + i * 4}
            />
          </div>
        ))}
      </div>
    </SplitFlapHousing>
  );
}

// ── ArrivalBoard ──

/**
 * Pre-built arrivals board template.
 *
 * ```tsx
 * <ArrivalBoard rows={[
 *   { time: "16:00", origin: "TOKYO NRT", flight: "JL42", gate: "C5", status: "LANDED" },
 * ]} />
 * ```
 */
export function ArrivalBoard({
  rows,
  title = "ARRIVALS",
  size = "sm",
  variant = "classic",
  mode = "board",
  easing,
  perspective,
  sound,
  volume,
  soundVariant,
  className,
  style,
}: ArrivalBoardProps) {
  return (
    <SplitFlapHousing label={title} style={style}>
      <div className={className}>
        <div style={headerStyle}>
          <span style={{ width: 100 }}>Time</span>
          <span style={{ width: 200 }}>Origin</span>
          <span style={{ width: 120 }}>Flight</span>
          <span style={{ width: 80 }}>Gate</span>
          <span style={{ width: 160 }}>Status</span>
        </div>
        {rows.map((row, i) => (
          <div key={i} style={rowGap}>
            <SplitFlap
              value={row.time || ""}
              length={5}
              size={size}
              variant={variant}
              color="dark"
              mode={mode}
              sound={sound}
              volume={volume}
              soundVariant={soundVariant}
              easing={easing}
              perspective={perspective}
              stagger={20 + i * 4}
            />
            <SplitFlap
              value={row.origin}
              length={10}
              size={size}
              variant={variant}
              color="ranger"
              mode={mode}
              sound={sound}
              volume={volume}
              soundVariant={soundVariant}
              easing={easing}
              perspective={perspective}
              stagger={25 + i * 4}
            />
            <SplitFlap
              value={row.flight || ""}
              length={6}
              size={size}
              variant={variant}
              color="dark"
              mode={mode}
              sound={sound}
              volume={volume}
              soundVariant={soundVariant}
              easing={easing}
              perspective={perspective}
              stagger={30 + i * 4}
            />
            <SplitFlap
              value={row.gate || ""}
              length={3}
              size={size}
              variant={variant}
              color="dark"
              mode={mode}
              sound={sound}
              volume={volume}
              soundVariant={soundVariant}
              easing={easing}
              perspective={perspective}
              stagger={35 + i * 4}
            />
            <SplitFlap
              value={row.status || ""}
              length={8}
              size={size}
              variant={variant}
              color={
                row.status?.toUpperCase().includes("DELAY") ? "red"
                : row.status?.toUpperCase().includes("LAND") ? "ranger"
                : "patriot"
              }
              mode={mode}
              sound={sound}
              volume={volume}
              soundVariant={soundVariant}
              easing={easing}
              perspective={perspective}
              stagger={40 + i * 4}
            />
          </div>
        ))}
      </div>
    </SplitFlapHousing>
  );
}

// ── ScoreBoard ──

/**
 * Score / stats display. Shows label-value pairs in a grid.
 *
 * ```tsx
 * <ScoreBoard title="MATCH" entries={[
 *   { label: "HOME", score: 3 },
 *   { label: "AWAY", score: 1 },
 * ]} />
 * ```
 */
export function ScoreBoard({
  entries,
  title,
  size = "lg",
  variant = "classic",
  color = "ranger",
  mode = "board",
  easing,
  perspective,
  sound,
  volume,
  soundVariant,
  className,
  style,
}: ScoreBoardProps) {
  return (
    <SplitFlapHousing label={title} style={style}>
      <div
        className={className}
        style={{ display: "flex", gap: 32, flexWrap: "wrap", justifyContent: "center" }}
      >
        {entries.map((entry, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <SplitFlap
              value={String(entry.score)}
              length={Math.max(String(entry.score).length, 3)}
              size={size}
              variant={variant}
              color={color}
              mode={mode}
              sound={sound}
              volume={volume}
              soundVariant={soundVariant}
              easing={easing}
              perspective={perspective}
            />
            <div style={labelStyle}>{entry.label}</div>
          </div>
        ))}
      </div>
    </SplitFlapHousing>
  );
}

// ── CountdownBoard ──

function computeRemaining(target: Date | string | number): [number, number, number, number] {
  const t = new Date(target).getTime();
  const now = Date.now();
  const diff = Math.max(0, t - now);
  const s = Math.floor(diff / 1000);
  const days = Math.floor(s / 86400);
  const hrs = Math.floor((s % 86400) / 3600);
  const min = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return [days, hrs, min, sec];
}

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

/**
 * Live countdown timer board.
 *
 * ```tsx
 * <CountdownBoard target="2026-01-01T00:00:00" />
 * ```
 */
export function CountdownBoard({
  target,
  labels = ["DAYS", "HRS", "MIN", "SEC"],
  size = "lg",
  variant = "classic",
  color = "ranger",
  easing,
  perspective,
  sound,
  volume,
  soundVariant,
  onComplete,
  className,
  style,
}: CountdownBoardProps) {
  const [remaining, setRemaining] = useState(() => computeRemaining(target));

  useEffect(() => {
    const iv = setInterval(() => {
      const r = computeRemaining(target);
      setRemaining(r);
      if (r[0] === 0 && r[1] === 0 && r[2] === 0 && r[3] === 0) {
        clearInterval(iv);
        onComplete?.();
      }
    }, 1000);
    return () => clearInterval(iv);
  }, [target, onComplete]);

  const [days, hrs, min, sec] = remaining;

  return (
    <SplitFlapHousing style={style}>
      <div
        className={className}
        style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", alignItems: "flex-end" }}
      >
        <div style={{ textAlign: "center" }}>
          <SplitFlapRow gap={2}>
            <SplitFlap value={String(days)} length={3} size={size} variant={variant} color={color} sound={sound} volume={volume} soundVariant={soundVariant} stagger={0} />
          </SplitFlapRow>
          <div style={labelStyle}>{labels[0]}</div>
        </div>
        <SplitFlapSeparator char=":" size={size} color={color} />
        <div style={{ textAlign: "center" }}>
          <SplitFlapRow gap={2}>
            <SplitFlap value={pad2(hrs)} length={2} size={size} variant={variant} color={color} sound={sound} volume={volume} soundVariant={soundVariant} stagger={0} />
          </SplitFlapRow>
          <div style={labelStyle}>{labels[1]}</div>
        </div>
        <SplitFlapSeparator char=":" size={size} color={color} />
        <div style={{ textAlign: "center" }}>
          <SplitFlapRow gap={2}>
            <SplitFlap value={pad2(min)} length={2} size={size} variant={variant} color={color} sound={sound} volume={volume} soundVariant={soundVariant} stagger={0} />
          </SplitFlapRow>
          <div style={labelStyle}>{labels[2]}</div>
        </div>
        <SplitFlapSeparator char=":" size={size} color={color} />
        <div style={{ textAlign: "center" }}>
          <SplitFlapRow gap={2}>
            <SplitFlap value={pad2(sec)} length={2} size={size} variant={variant} color={color} sound={sound} volume={volume} soundVariant={soundVariant} stagger={0} />
          </SplitFlapRow>
          <div style={labelStyle}>{labels[3]}</div>
        </div>
      </div>
    </SplitFlapHousing>
  );
}

// ── MessageBoard ──

/**
 * Rotating message display — cycles through an array of messages.
 *
 * ```tsx
 * <MessageBoard messages={["HELLO WORLD", "WELCOME", "HAVE A NICE DAY"]} interval={4} />
 * ```
 */
export function MessageBoard({
  messages,
  interval = 5,
  length,
  size = "lg",
  variant = "modern",
  color = "ranger",
  mode = "board",
  easing,
  perspective,
  sound,
  volume,
  soundVariant,
  className,
  style,
}: MessageBoardProps) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (messages.length <= 1) return;
    const iv = setInterval(() => {
      setIdx((i) => (i + 1) % messages.length);
    }, interval * 1000);
    return () => clearInterval(iv);
  }, [messages.length, interval]);

  const maxLen = length || Math.max(...messages.map((m) => m.length), 1);

  return (
    <div className={className} style={style}>
      <SplitFlap
        value={messages[idx] || ""}
        length={maxLen}
        size={size}
        variant={variant}
        color={color}
        mode={mode}
        sound={sound}
        volume={volume}
        soundVariant={soundVariant}
      />
    </div>
  );
}
