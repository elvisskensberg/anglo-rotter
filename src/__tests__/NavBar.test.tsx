import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { BlueNavBar } from "@/components/layout/BlueNavBar";
import { OrangeNavBar } from "@/components/layout/OrangeNavBar";

describe("BlueNavBar Component (LYOT-02)", () => {
  test("renders navigation links", () => {
    const { container } = render(<BlueNavBar />);
    expect(container.querySelector("table")).toBeInTheDocument();
  });

  test("contains explicit tbody in table", () => {
    const { container } = render(<BlueNavBar />);
    expect(container.querySelector("tbody")).toBeInTheDocument();
  });
});

describe("OrangeNavBar Component (LYOT-03)", () => {
  test("renders navigation links", () => {
    const { container } = render(<OrangeNavBar />);
    expect(container.querySelector("table")).toBeInTheDocument();
  });

  test("contains explicit tbody in table", () => {
    const { container } = render(<OrangeNavBar />);
    expect(container.querySelector("tbody")).toBeInTheDocument();
  });
});
