import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { HeaderBar } from "@/components/layout/HeaderBar";

describe("HeaderBar Component (LYOT-01)", () => {
  test("renders logo image", () => {
    const { container } = render(<HeaderBar />);
    const img = container.querySelector("img[alt='MultiRotter']");
    expect(img).toBeInTheDocument();
  });

  test("contains explicit tbody in table", () => {
    const { container } = render(<HeaderBar />);
    expect(container.querySelector("tbody")).toBeInTheDocument();
  });

  test("renders a table element", () => {
    const { container } = render(<HeaderBar />);
    expect(container.querySelector("table")).toBeInTheDocument();
  });
});
