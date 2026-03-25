import "@testing-library/jest-dom";
import fs from "fs";
import path from "path";

describe("Design Tokens (DSGN-01)", () => {
  const css = fs.readFileSync(
    path.resolve(__dirname, "../app/globals.css"),
    "utf-8"
  );

  test("defines --rotter-header-blue token", () => {
    expect(css).toContain("--rotter-header-blue: #71B7E6");
  });

  test("defines --rotter-text-primary token", () => {
    expect(css).toContain("--rotter-text-primary: #000099");
  });

  test("defines at least 40 --rotter- custom properties", () => {
    const matches = css.match(/--rotter-/g);
    expect(matches).not.toBeNull();
    expect(matches!.length).toBeGreaterThanOrEqual(40);
  });

  test("contains box-sizing reset", () => {
    expect(css).toContain("box-sizing: border-box");
  });
});
