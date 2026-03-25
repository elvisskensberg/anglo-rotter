/**
 * QuickReplyForm tests (THRD-07)
 */
import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from "@testing-library/react";
import { QuickReplyForm } from "@/components/thread/QuickReplyForm";

jest.mock("@/lib/auth-client", () => ({
  useSession: () => ({ data: null }),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: jest.fn() }),
}));

describe("QuickReplyForm (THRD-07)", () => {
  it("form is not rendered when visible=false", () => {
    render(<QuickReplyForm visible={false} threadId={12345} />);
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("shows login prompt when user is not authenticated", () => {
    render(<QuickReplyForm visible={true} threadId={12345} />);
    expect(screen.getByText(/log in/i)).toBeInTheDocument();
  });

  it("renders nothing when not visible regardless of auth state", () => {
    render(<QuickReplyForm visible={false} threadId={12345} />);
    expect(screen.queryByText(/log in/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });
});
