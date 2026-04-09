import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render } from "@testing-library/react";
import { FlapChar } from "../FlapChar";

describe("prefers-reduced-motion", () => {
  const originalMatchMedia = window.matchMedia;

  beforeEach(() => {
    // jsdom doesn't have matchMedia — define it
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query === "(prefers-reduced-motion: reduce)",
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  it("renders without crashing when reduced motion is enabled", () => {
    const { container } = render(<FlapChar target="Z" animateOnMount />);
    expect(container.firstChild).toBeTruthy();
  });

  it("displays target character directly (no intermediate animation)", () => {
    const { container } = render(<FlapChar target="A" animateOnMount />);
    // With reduced motion detected after mount, the component should
    // show the target without flip animation elements
    // (no sf-flip-top or sf-flip-bot class elements)
    const flipElements = container.querySelectorAll("[class*='sf-flip']");
    expect(flipElements.length).toBe(0);
  });
});
