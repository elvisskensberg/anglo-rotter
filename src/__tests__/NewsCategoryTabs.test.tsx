/**
 * NewsCategoryTabs Wave 0 test stubs (NEWS-02)
 * These tests WILL FAIL until Plan 02 creates the component.
 * Failing at "Cannot find module '@/components/news'" is correct Wave 0 behavior.
 */
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { NewsCategoryTabs } from "@/components/news";

describe("NewsCategoryTabs (NEWS-02)", () => {
  test("renders all 5 category tabs", () => {
    const onTabChange = jest.fn();
    render(<NewsCategoryTabs activeTab="all" onTabChange={onTabChange} />);
    // Expect tabs for: All, News, Sports, Economy, Tech
    expect(screen.getByText(/^all$/i)).toBeInTheDocument();
    expect(screen.getByText(/^news$/i)).toBeInTheDocument();
    expect(screen.getByText(/^sports$/i)).toBeInTheDocument();
    expect(screen.getByText(/^economy$/i)).toBeInTheDocument();
    expect(screen.getByText(/^tech$/i)).toBeInTheDocument();
  });

  test("active tab has distinct styling", () => {
    const onTabChange = jest.fn();
    const { container } = render(<NewsCategoryTabs activeTab="news" onTabChange={onTabChange} />);
    // The active News tab should carry the active CSS class
    const tabs = container.querySelectorAll("[class]");
    const activeTab = Array.from(tabs).find((el) =>
      el.textContent?.toLowerCase() === "news" &&
      el.className.includes("active")
    );
    expect(activeTab).toBeInTheDocument();
  });

  test("clicking a tab calls onTabChange with the correct category", () => {
    const onTabChange = jest.fn();
    render(<NewsCategoryTabs activeTab="all" onTabChange={onTabChange} />);
    fireEvent.click(screen.getByText(/^sports$/i));
    expect(onTabChange).toHaveBeenCalledWith("sports");
  });

  test("tabs have teal background", () => {
    const onTabChange = jest.fn();
    const { container } = render(<NewsCategoryTabs activeTab="all" onTabChange={onTabChange} />);
    // At least one tab element should carry the teal background color
    const allElements = container.querySelectorAll("*");
    const tealEl = Array.from(allElements).find((el) => {
      const style = (el as HTMLElement).getAttribute("style") ?? "";
      return style.includes("#3984ad") || style.includes("var(--rotter-news-teal)");
    });
    expect(tealEl).toBeInTheDocument();
  });
});
