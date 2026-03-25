/**
 * ForumToolbar tests (FORUM-06)
 * TDD: These tests are written before the component implementation.
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ForumToolbar } from "@/components/forum/ForumToolbar";

describe("ForumToolbar (FORUM-06)", () => {
  test("renders 4 img elements", () => {
    render(<ForumToolbar />);
    const images = screen.getAllByRole("img");
    expect(images).toHaveLength(4);
  });

  test("each img has width=33 and height=33", () => {
    render(<ForumToolbar />);
    const images = screen.getAllByRole("img");
    images.forEach((img) => {
      expect(img).toHaveAttribute("width", "33");
      expect(img).toHaveAttribute("height", "33");
    });
  });

  test("icons are toolbar-login.svg, toolbar-help.svg, toolbar-search.svg, toolbar-post.svg", () => {
    render(<ForumToolbar />);
    const images = screen.getAllByRole("img");
    const srcs = images.map((img) => img.getAttribute("src"));
    expect(srcs).toContain("/icons/toolbar-login.svg");
    expect(srcs).toContain("/icons/toolbar-help.svg");
    expect(srcs).toContain("/icons/toolbar-search.svg");
    expect(srcs).toContain("/icons/toolbar-post.svg");
  });

  test("labels Login, Help, Search, Post appear as text", () => {
    render(<ForumToolbar />);
    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByText("Help")).toBeInTheDocument();
    expect(screen.getByText("Search")).toBeInTheDocument();
    expect(screen.getByText("Post")).toBeInTheDocument();
  });

  test("each icon is inside a table cell with align=center", () => {
    const { container } = render(<ForumToolbar />);
    const cells = container.querySelectorAll("td");
    expect(cells.length).toBeGreaterThanOrEqual(4);
    cells.forEach((cell) => {
      expect(cell).toHaveAttribute("align", "center");
    });
  });
});
