import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { SplitFlap } from "../SplitFlap";

describe("staggerDirection", () => {
  it("renders with staggerDirection='ltr' (default)", () => {
    const { container } = render(<SplitFlap value="ABC" staggerDirection="ltr" />);
    expect(container.firstChild).toBeTruthy();
  });

  it("renders with staggerDirection='rtl'", () => {
    const { container } = render(<SplitFlap value="ABC" staggerDirection="rtl" />);
    expect(container.firstChild).toBeTruthy();
  });

  it("renders with staggerDirection='center-out'", () => {
    const { container } = render(<SplitFlap value="ABCDE" staggerDirection="center-out" />);
    expect(container.firstChild).toBeTruthy();
  });
});
