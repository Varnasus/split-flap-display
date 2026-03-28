import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SplitFlap } from "../SplitFlap";

describe("SplitFlap", () => {
  it("renders without crashing", () => {
    const { container } = render(<SplitFlap value="HI" />);
    expect(container.firstChild).toBeTruthy();
  });

  it("renders correct number of characters", () => {
    const { container } = render(<SplitFlap value="ABC" />);
    // Each FlapChar has aria-hidden="true"
    const chars = container.querySelectorAll('[aria-hidden="true"]');
    expect(chars.length).toBe(3);
  });

  it("pads value to length", () => {
    const { container } = render(<SplitFlap value="HI" length={5} />);
    const chars = container.querySelectorAll('[aria-hidden="true"]');
    expect(chars.length).toBe(5);
  });

  it("truncates value to length", () => {
    const { container } = render(<SplitFlap value="HELLO" length={3} />);
    const chars = container.querySelectorAll('[aria-hidden="true"]');
    expect(chars.length).toBe(3);
  });

  it("has role=status on container", () => {
    render(<SplitFlap value="TEST" />);
    const el = screen.getByRole("status");
    expect(el).toBeTruthy();
  });

  it("has aria-label with trimmed value", () => {
    render(<SplitFlap value="HI" length={5} />);
    const el = screen.getByRole("status");
    expect(el.getAttribute("aria-label")).toBe("HI");
  });

  it("has aria-live=polite", () => {
    render(<SplitFlap value="HI" />);
    const el = screen.getByRole("status");
    expect(el.getAttribute("aria-live")).toBe("polite");
  });

  it("applies className", () => {
    const { container } = render(<SplitFlap value="HI" className="my-class" />);
    expect(container.querySelector(".my-class")).toBeTruthy();
  });

  it("applies inline style", () => {
    const { container } = render(<SplitFlap value="HI" style={{ marginTop: 10 }} />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.marginTop).toBe("10px");
  });

  it("renders prefix text", () => {
    const { container } = render(<SplitFlap value="100" prefix="$" />);
    expect(container.textContent).toContain("$");
  });

  it("renders suffix text", () => {
    const { container } = render(<SplitFlap value="72" suffix="F" />);
    expect(container.textContent).toContain("F");
  });

  it("includes prefix and suffix in aria-label", () => {
    render(<SplitFlap value="100" prefix="$" suffix="USD" />);
    const el = screen.getByRole("status");
    expect(el.getAttribute("aria-label")).toBe("$100USD");
  });

  it("renders with groupGaps without crashing", () => {
    const { container } = render(<SplitFlap value="123456" groupGaps={[2, 2, 2]} />);
    expect(container.firstChild).toBeTruthy();
  });

  it("renders in board mode without crashing", () => {
    const { container } = render(<SplitFlap value="HELLO" mode="board" />);
    expect(container.firstChild).toBeTruthy();
  });

  it("renders in spinning mode without crashing", () => {
    const { container } = render(<SplitFlap length={5} spinning />);
    expect(container.firstChild).toBeTruthy();
  });
});
