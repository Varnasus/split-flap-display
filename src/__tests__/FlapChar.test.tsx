import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { FlapChar } from "../FlapChar";

describe("FlapChar", () => {
  it("renders without crashing", () => {
    const { container } = render(<FlapChar target="A" />);
    expect(container.firstChild).toBeTruthy();
  });

  it("has aria-hidden=true", () => {
    const { container } = render(<FlapChar target="A" />);
    expect((container.firstChild as HTMLElement)?.getAttribute("aria-hidden")).toBe("true");
  });

  it("displays the target character statically when animateOnMount is false", () => {
    const { container } = render(<FlapChar target="A" animateOnMount={false} />);
    // The character should appear in the rendered text
    expect(container.textContent).toContain("A");
  });

  it("starts from blank when animateOnMount is true", () => {
    const { container } = render(<FlapChar target="Z" animateOnMount={true} />);
    // On the first render frame, the display starts at the initial char (space)
    // and the flip hasn't completed yet, so we should see the space character
    // The target "Z" should not be in the static display yet (it will animate in)
    const spans = container.querySelectorAll("span");
    const firstSpanText = spans[0]?.textContent;
    // First span should show space (initial) not Z
    expect(firstSpanText).not.toBe("Z");
  });

  it("renders with all size presets", () => {
    for (const size of ["sm", "md", "lg", "xl"] as const) {
      const { container } = render(<FlapChar target="A" size={size} />);
      expect(container.firstChild).toBeTruthy();
    }
  });

  it("renders with all color themes", () => {
    for (const color of ["dark", "light", "ranger", "patriot", "red"] as const) {
      const { container } = render(<FlapChar target="A" color={color} />);
      expect(container.firstChild).toBeTruthy();
    }
  });

  it("renders with classic variant", () => {
    const { container } = render(<FlapChar target="A" variant="classic" />);
    expect(container.firstChild).toBeTruthy();
  });

  it("renders with custom palette", () => {
    const { container } = render(
      <FlapChar
        target="A"
        palette={{ text: "#fff", topBg: "#000", botBg: "#111", border: "#222", div: "#333" }}
      />
    );
    expect(container.firstChild).toBeTruthy();
  });
});
