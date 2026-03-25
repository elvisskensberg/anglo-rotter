/**
 * PaginationBar tests (FORUM-05)
 * TDD: These tests are written before the component implementation.
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { PaginationBar } from "@/components/forum/PaginationBar";

describe("PaginationBar (FORUM-05)", () => {
  const defaultProps = {
    currentPage: 1,
    totalPages: 3,
    rowsPerPage: 30,
    onPageChange: jest.fn(),
    onRowsPerPageChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders correct number of page links (totalPages=3 shows 3 page numbers)", () => {
    render(<PaginationBar {...defaultProps} />);
    // Page 1 is current (plain text), pages 2 and 3 are links
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  test("current page is rendered as plain text (not a link)", () => {
    render(<PaginationBar {...defaultProps} currentPage={2} />);
    // Page 2 should be plain text, not wrapped in <a>
    const page2 = screen.getByText("2");
    expect(page2.closest("a")).toBeNull();
  });

  test("other pages are rendered as links", () => {
    render(<PaginationBar {...defaultProps} currentPage={2} />);
    // Pages 1 and 3 should be links
    const page1 = screen.getByText("1");
    expect(page1.closest("a")).not.toBeNull();
    const page3 = screen.getByText("3");
    expect(page3.closest("a")).not.toBeNull();
  });

  test("page separator | between page numbers", () => {
    const { container } = render(<PaginationBar {...defaultProps} />);
    expect(container.textContent).toContain("|");
  });

  test("rows-per-page select has options 15, 30, 50, 100, 150, 200, 250, 300", () => {
    render(<PaginationBar {...defaultProps} />);
    const select = screen.getByRole("combobox");
    const options = Array.from(select.querySelectorAll("option")).map(
      (opt) => Number(opt.value)
    );
    expect(options).toEqual([15, 30, 50, 100, 150, 200, 250, 300]);
  });

  test("default selected value matches rowsPerPage prop", () => {
    render(<PaginationBar {...defaultProps} rowsPerPage={50} />);
    const select = screen.getByRole("combobox") as HTMLSelectElement;
    expect(select.value).toBe("50");
  });

  test("clicking a page number calls onPageChange with that number", () => {
    const onPageChange = jest.fn();
    render(<PaginationBar {...defaultProps} currentPage={1} onPageChange={onPageChange} />);
    fireEvent.click(screen.getByText("2"));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  test("changing select value calls onRowsPerPageChange with new value", () => {
    const onRowsPerPageChange = jest.fn();
    render(<PaginationBar {...defaultProps} onRowsPerPageChange={onRowsPerPageChange} />);
    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "50" } });
    expect(onRowsPerPageChange).toHaveBeenCalledWith(50);
  });
});
