import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { Table } from "@/components/ui/Table";

describe("Table Component (DSGN-04, LYOT-05)", () => {
  test("renders a table element", () => {
    const { container } = render(
      <Table>
        <tbody>
          <tr><td>cell</td></tr>
        </tbody>
      </Table>
    );
    expect(container.querySelector("table")).toBeInTheDocument();
  });

  test("applies border-collapse via CSS module class", () => {
    const { container } = render(
      <Table>
        <tbody>
          <tr><td>cell</td></tr>
        </tbody>
      </Table>
    );
    const table = container.querySelector("table");
    expect(table).toHaveClass("table");
  });

  test("passes additional HTML attributes", () => {
    const { container } = render(
      <Table data-testid="my-table" width="100%">
        <tbody>
          <tr><td>cell</td></tr>
        </tbody>
      </Table>
    );
    const table = container.querySelector("table");
    expect(table).toHaveAttribute("width", "100%");
  });
});
