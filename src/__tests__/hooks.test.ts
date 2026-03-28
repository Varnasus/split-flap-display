import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useClock, useCountdown, useCyclingMessages, usePriceDisplay } from "../hooks";

describe("useClock", () => {
  it("returns a formatted time string", () => {
    const { result } = renderHook(() => useClock());
    // Should match HH:MM:SS format
    expect(result.current).toMatch(/^\d{2}:\d{2}:\d{2}$/);
  });

  it("returns HH:MM format when specified", () => {
    const { result } = renderHook(() => useClock("HH:MM"));
    expect(result.current).toMatch(/^\d{2}:\d{2}$/);
  });
});

describe("useCountdown", () => {
  it("returns a CountdownValue object", () => {
    const future = new Date(Date.now() + 90000); // 90 seconds from now
    const { result } = renderHook(() => useCountdown(future));
    expect(result.current).toHaveProperty("display");
    expect(result.current).toHaveProperty("days");
    expect(result.current).toHaveProperty("hours");
    expect(result.current).toHaveProperty("minutes");
    expect(result.current).toHaveProperty("seconds");
    expect(result.current).toHaveProperty("complete");
    expect(result.current).toHaveProperty("totalSeconds");
  });

  it("shows complete=true for past dates", () => {
    const past = new Date("2020-01-01");
    const { result } = renderHook(() => useCountdown(past));
    expect(result.current.complete).toBe(true);
    expect(result.current.totalSeconds).toBe(0);
  });

  it("shows complete=false for future dates", () => {
    const future = new Date(Date.now() + 86400000); // 1 day from now
    const { result } = renderHook(() => useCountdown(future));
    expect(result.current.complete).toBe(false);
    expect(result.current.totalSeconds).toBeGreaterThan(0);
  });

  it("display is a formatted string", () => {
    const future = new Date(Date.now() + 90061000); // ~1 day + 1 hr + 1 min + 1 sec
    const { result } = renderHook(() => useCountdown(future));
    // Format: "DDD:HH:MM:SS"
    expect(result.current.display).toMatch(/^\d{3}:\d{2}:\d{2}:\d{2}$/);
  });
});

describe("useCyclingMessages", () => {
  it("returns the first message initially", () => {
    const { result } = renderHook(() => useCyclingMessages(["A", "B", "C"]));
    expect(result.current).toBe("A");
  });

  it("returns empty string for empty array", () => {
    const { result } = renderHook(() => useCyclingMessages([]));
    expect(result.current).toBe("");
  });

  it("returns the only message for single-item array", () => {
    const { result } = renderHook(() => useCyclingMessages(["ONLY"]));
    expect(result.current).toBe("ONLY");
  });
});

describe("usePriceDisplay", () => {
  it("formats a number with 2 decimal places by default", () => {
    expect(usePriceDisplay(1250.5)).toBe("1250.50");
  });

  it("formats whole numbers", () => {
    expect(usePriceDisplay(99)).toBe("99.00");
  });

  it("respects custom decimal places", () => {
    expect(usePriceDisplay(3.14159, 3)).toBe("3.142");
  });

  it("handles zero", () => {
    expect(usePriceDisplay(0)).toBe("0.00");
  });
});
