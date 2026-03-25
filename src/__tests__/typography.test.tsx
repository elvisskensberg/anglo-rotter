import "@testing-library/jest-dom";
import fs from "fs";
import path from "path";

describe("Typography Tokens (DSGN-02)", () => {
  const css = fs.readFileSync(
    path.resolve(__dirname, "../app/globals.css"),
    "utf-8"
  );

  test("defines primary font family", () => {
    expect(css).toContain("--rotter-font-primary: Arial, Helvetica, sans-serif");
  });

  test("defines thread title size", () => {
    expect(css).toContain("--rotter-size-thread-title: 15px");
  });

  test("defines base font size", () => {
    expect(css).toContain("--rotter-size-base: 14px");
  });

  test("defines container width", () => {
    expect(css).toContain("--rotter-container: 1012px");
  });
});
