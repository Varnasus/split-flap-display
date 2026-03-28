import { describe, it, expect } from "vitest";
import { playSound, resumeAudio } from "../sound";

describe("sound (SSR safety)", () => {
  it("playSound does not throw when called", () => {
    // In jsdom, AudioContext may not be fully available
    // but playSound should gracefully handle it
    expect(() => playSound("clack", 0.5)).not.toThrow();
  });

  it("playSound handles all variants without throwing", () => {
    expect(() => playSound("clack", 0.5)).not.toThrow();
    expect(() => playSound("click", 0.3)).not.toThrow();
    expect(() => playSound("soft", 0.8)).not.toThrow();
  });

  it("playSound handles zero volume", () => {
    expect(() => playSound("clack", 0)).not.toThrow();
  });

  it("playSound handles custom src without throwing", () => {
    expect(() => playSound("clack", 0.5, "/sounds/test.wav")).not.toThrow();
  });

  it("resumeAudio does not throw", () => {
    expect(() => resumeAudio()).not.toThrow();
  });
});
