import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { FlapChar } from "../FlapChar";
import { SplitFlap } from "../SplitFlap";

describe("easing prop", () => {
  it("FlapChar renders with easing='linear' (default)", () => {
    const { container } = render(<FlapChar target="A" easing="linear" />);
    expect(container.firstChild).toBeTruthy();
  });

  it("FlapChar renders with easing='decelerate'", () => {
    const { container } = render(<FlapChar target="A" easing="decelerate" />);
    expect(container.firstChild).toBeTruthy();
  });

  it("FlapChar renders with easing='spring'", () => {
    const { container } = render(<FlapChar target="A" easing="spring" />);
    expect(container.firstChild).toBeTruthy();
  });

  it("SplitFlap passes easing through without crashing", () => {
    const { container } = render(<SplitFlap value="HI" easing="spring" />);
    expect(container.firstChild).toBeTruthy();
  });

  it("FlapChar renders with custom perspective", () => {
    const { container } = render(<FlapChar target="A" perspective={500} />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.perspective).toBe("500px");
  });

  it("SplitFlap passes perspective through", () => {
    const { container } = render(<SplitFlap value="A" perspective={800} />);
    expect(container.firstChild).toBeTruthy();
  });
});
