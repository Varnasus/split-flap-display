import { useState, useEffect, useRef } from "react";

/**
 * Returns the current time as a formatted string, updating every second.
 * @param format "HH:MM:SS" (default), "HH:MM", or "HH:MM:SS:ms"
 */
export function useClock(format: "HH:MM:SS" | "HH:MM" | "HH:MM:SS.ms" = "HH:MM:SS"): string {
  const [time, setTime] = useState(() => formatTime(new Date(), format));

  useEffect(() => {
    const iv = setInterval(() => setTime(formatTime(new Date(), format)), 1000);
    return () => clearInterval(iv);
  }, [format]);

  return time;
}

function formatTime(d: Date, format: string): string {
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  const s = String(d.getSeconds()).padStart(2, "0");
  if (format === "HH:MM") return `${h}:${m}`;
  if (format === "HH:MM:SS.ms") {
    const ms = String(Math.floor(d.getMilliseconds() / 100));
    return `${h}:${m}:${s}.${ms}`;
  }
  return `${h}:${m}:${s}`;
}

export interface CountdownValue {
  /** Formatted string ready for SplitFlap value prop, e.g. "003:12:45:30" */
  display: string;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  /** True when countdown has reached zero */
  complete: boolean;
  /** Total remaining seconds */
  totalSeconds: number;
}

/**
 * Counts down to a target date, updating every second.
 * Returns both formatted display string and individual values.
 */
export function useCountdown(target: Date | string | number): CountdownValue {
  const [val, setVal] = useState<CountdownValue>(() => computeCountdown(target));

  useEffect(() => {
    const iv = setInterval(() => {
      const v = computeCountdown(target);
      setVal(v);
      if (v.complete) clearInterval(iv);
    }, 1000);
    return () => clearInterval(iv);
  }, [target]);

  return val;
}

function computeCountdown(target: Date | string | number): CountdownValue {
  const t = new Date(target).getTime();
  const diff = Math.max(0, t - Date.now());
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n: number, w = 2) => String(n).padStart(w, "0");
  const display = `${pad(days, 3)}:${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  return { display, days, hours, minutes, seconds, complete: diff <= 0, totalSeconds };
}

/**
 * Cycles through an array of messages on a timer.
 * Returns the current message string.
 */
export function useCyclingMessages(
  messages: string[],
  intervalSeconds = 5
): string {
  const [idx, setIdx] = useState(0);
  const msgsRef = useRef(messages);
  msgsRef.current = messages;

  useEffect(() => {
    if (messages.length <= 1) return;
    const iv = setInterval(() => {
      setIdx((i) => (i + 1) % msgsRef.current.length);
    }, intervalSeconds * 1000);
    return () => clearInterval(iv);
  }, [messages.length, intervalSeconds]);

  return messages[idx] || "";
}

/**
 * Formats a number as a price string for display.
 * usePriceDisplay(1250.5) → "1250.50"
 * usePriceDisplay(99) → "99.00"
 */
export function usePriceDisplay(
  value: number,
  decimals = 2
): string {
  return value.toFixed(decimals);
}
