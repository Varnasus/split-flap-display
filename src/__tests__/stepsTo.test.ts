import { describe, it, expect } from "vitest";
import { stepsTo, CHARS, NUMERIC_CHARS, ALPHA_CHARS } from "../constants";

describe("stepsTo", () => {
  it("returns forward steps between adjacent characters", () => {
    expect(stepsTo("A", "D")).toEqual(["B", "C", "D"]);
  });

  it("returns single step for consecutive characters", () => {
    expect(stepsTo("A", "B")).toEqual(["B"]);
  });

  it("wraps around at end of character set", () => {
    const steps = stepsTo("?", "A");
    // ? is last in CHARS, so it wraps: space → A
    expect(steps[0]).toBe(" ");
    expect(steps[steps.length - 1]).toBe("A");
  });

  it("returns empty array for same character", () => {
    expect(stepsTo("A", "A")).toEqual([]);
  });

  it("returns empty array for invalid characters", () => {
    expect(stepsTo("A", "~")).toEqual([]);
    expect(stepsTo("~", "A")).toEqual([]);
  });

  it("returns empty array for two invalid characters", () => {
    expect(stepsTo("~", "@")).toEqual([]);
  });

  it("handles space as a valid character", () => {
    const steps = stepsTo(" ", "A");
    expect(steps).toEqual(["A"]);
  });

  it("cycles forward from Z through numbers to reach A", () => {
    const steps = stepsTo("Z", "A");
    // Z(26) → 0(27) → ... → ?(43) → space(0) → A(1)
    expect(steps.length).toBeGreaterThan(10);
    expect(steps[steps.length - 1]).toBe("A");
    // Should include numbers in the path
    expect(steps).toContain("0");
    expect(steps).toContain("9");
  });

  describe("with custom character sets", () => {
    it("uses NUMERIC_CHARS for fast number transitions", () => {
      const steps = stepsTo("5", "6", NUMERIC_CHARS);
      expect(steps).toEqual(["6"]);
    });

    it("NUMERIC_CHARS wraps shorter than CHARS for 9→0", () => {
      // 9→0 wraps: in NUMERIC_CHARS (19 chars) it's ~10 steps, in CHARS (44 chars) it's ~35 steps
      const numSteps = stepsTo("9", "0", NUMERIC_CHARS);
      const fullSteps = stepsTo("9", "0", CHARS);
      expect(numSteps.length).toBeLessThan(fullSteps.length);
    });

    it("works with ALPHA_CHARS", () => {
      const steps = stepsTo("A", "C", ALPHA_CHARS);
      expect(steps).toEqual(["B", "C"]);
    });

    it("works with arbitrary custom array", () => {
      const custom = ["X", "Y", "Z"];
      expect(stepsTo("X", "Z", custom)).toEqual(["Y", "Z"]);
    });
  });
});
