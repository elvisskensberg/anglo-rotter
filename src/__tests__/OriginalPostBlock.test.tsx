/**
 * OriginalPostBlock tests (THRD-01, THRD-02)
 * Wave 0 — RED state. Components do not exist yet.
 * Tests will fail with "Cannot find module" until Plan 04-02.
 */
import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from "@testing-library/react";
import { OriginalPostBlock } from "@/components/thread/OriginalPostBlock";
import type { ThreadPost } from "@/data/thread-seed";

// Mock auth-client so ThreadRating (client component) doesn't break tests
jest.mock("@/lib/auth-client", () => ({
  useSession: () => ({ data: null }),
}));

function makeThreadPost(overrides?: Partial<ThreadPost>): ThreadPost {
  return {
    id: 940165,
    author: "mortzix",
    content: "Supreme Court refuses to allow broadcasting of the hearing.",
    date: "22.03.26",
    time: "14:00",
    memberSince: "1.3.26",
    postCount: 6555,
    starRating: 3,
    ratersCount: 45,
    points: 120,
    ...overrides,
  };
}

describe("OriginalPostBlock — author info row (THRD-01)", () => {
  const title = "Supreme Court refuses to broadcast hearing on aid organizations";

  it("renders author name 'mortzix' in bold", () => {
    render(<OriginalPostBlock post={makeThreadPost()} title={title} threadId={940165} />);
    const bold = screen.getByText("mortzix").closest("b");
    expect(bold).toBeInTheDocument();
  });

  it("renders star rating image with src='/icons/star-3.svg'", () => {
    render(<OriginalPostBlock post={makeThreadPost({ starRating: 3 })} title={title} threadId={940165} />);
    const starImg = screen.getByRole("img", { name: /3 stars/i });
    expect(starImg).toHaveAttribute("src", "/icons/star-3.svg");
  });

  it("renders 'Member since 1.3.26'", () => {
    render(<OriginalPostBlock post={makeThreadPost()} title={title} threadId={940165} />);
    expect(screen.getByText(/Member since 1\.3\.26/)).toBeInTheDocument();
  });

  it("renders '6555 posts'", () => {
    render(<OriginalPostBlock post={makeThreadPost()} title={title} threadId={940165} />);
    expect(screen.getByText(/6555 posts/)).toBeInTheDocument();
  });

  it("renders raters count", () => {
    render(<OriginalPostBlock post={makeThreadPost()} title={title} threadId={940165} />);
    expect(screen.getByText(/45 raters/i)).toBeInTheDocument();
  });

  it("renders points", () => {
    render(<OriginalPostBlock post={makeThreadPost()} title={title} threadId={940165} />);
    expect(screen.getByText(/120 points/i)).toBeInTheDocument();
  });
});

describe("OriginalPostBlock — post content area (THRD-02)", () => {
  const title = "Supreme Court refuses to broadcast hearing on aid organizations";

  it("renders h1 with post title", () => {
    render(<OriginalPostBlock post={makeThreadPost()} title={title} threadId={940165} />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading.textContent).toContain(title);
  });

  it("renders 70%-width nested table (check style attribute contains '70%')", () => {
    const { container } = render(<OriginalPostBlock post={makeThreadPost()} title={title} threadId={940165} />);
    // The 70%-width content table is inside the post content area
    const tables = Array.from(container.querySelectorAll("table"));
    const wideTable = tables.find(
      (t) =>
        t.getAttribute("width") === "70%" ||
        (t.getAttribute("style") ?? "").includes("70%")
    );
    expect(wideTable).toBeInTheDocument();
  });
});
