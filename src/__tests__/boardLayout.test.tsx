import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SplitFlap } from "../SplitFlap";

describe("board layout mode", () => {
  it("renders multiple rows when layout='board' with rows array", () => {
    const { container } = render(
      <SplitFlap layout="board" rows={["HELLO", "WORLD"]} />
    );
    // Should render a column container with 2 row divs
    const outer = container.firstChild as HTMLElement;
    expect(outer.children.length).toBe(2);
  });

  it("pads rows to consistent length", () => {
    const { container } = render(
      <SplitFlap layout="board" rows={["HI", "HELLO"]} />
    );
    // Both rows should have 5 characters (length of longest row)
    const rows = (container.firstChild as HTMLElement).children;
    // Each row should have 5 FlapChar elements (aria-hidden divs)
    const row1Chars = rows[0].querySelectorAll('[aria-hidden="true"]');
    const row2Chars = rows[1].querySelectorAll('[aria-hidden="true"]');
    expect(row1Chars.length).toBe(5);
    expect(row2Chars.length).toBe(5);
  });

  it("respects explicit length prop", () => {
    const { container } = render(
      <SplitFlap layout="board" rows={["HI", "HELLO"]} length={10} />
    );
    const rows = (container.firstChild as HTMLElement).children;
    const row1Chars = rows[0].querySelectorAll('[aria-hidden="true"]');
    expect(row1Chars.length).toBe(10);
  });

  it("has ARIA attributes with rows joined", () => {
    render(<SplitFlap layout="board" rows={["HELLO", "WORLD"]} />);
    const el = screen.getByRole("status");
    const label = el.getAttribute("aria-label");
    expect(label).toContain("HELLO");
    expect(label).toContain("WORLD");
  });

  it("renders without crashing with empty rows", () => {
    const { container } = render(
      <SplitFlap layout="board" rows={[]} />
    );
    expect(container.firstChild).toBeTruthy();
  });

  it("falls back to single mode when layout is not 'board'", () => {
    const { container } = render(
      <SplitFlap value="HELLO" layout="single" />
    );
    // Single mode: one flex row, not column
    const outer = container.firstChild as HTMLElement;
    expect(outer.style.flexDirection).not.toBe("column");
  });
});
