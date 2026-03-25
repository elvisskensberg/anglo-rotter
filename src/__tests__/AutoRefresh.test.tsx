/**
 * AutoRefresh tests for BreakingNewsFeed (HOME-04)
 * Tests that BreakingNewsFeed calls fetch() on a setInterval via useAutoRefresh
 * and clears the interval on unmount.
 *
 * Note: HomepageLayout no longer uses router.refresh(). Auto-refresh is handled
 * inside BreakingNewsFeed via useAutoRefresh hook (fetch-based polling).
 */
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { BreakingNewsFeed } from "@/components/homepage";

// Mock fetch for useAutoRefresh
const mockFetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ threads: [] }),
  } as Response)
);
global.fetch = mockFetch;

describe("BreakingNewsFeed auto-refresh (HOME-04)", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockFetch.mockClear();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("calls fetch on 780000ms interval for auto-refresh", () => {
    render(<BreakingNewsFeed />);
    // Initial fetch on mount
    expect(mockFetch).toHaveBeenCalledTimes(1);
    // Advance time by exactly 780000ms (default interval)
    jest.advanceTimersByTime(780000);
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  test("does not fetch again after unmount", () => {
    const { unmount } = render(<BreakingNewsFeed />);
    unmount();
    mockFetch.mockClear();
    // Advance well past the interval
    jest.advanceTimersByTime(780000 * 2);
    expect(mockFetch).not.toHaveBeenCalled();
  });
});
