"use client";

import React, { useState } from "react";
import { useSession } from "@/lib/auth-client";
import styles from "./QuickReplyForm.module.css";

interface QuickReplyFormProps {
  visible: boolean;
  threadId: number;
  onReplySubmitted?: () => void;
}

/**
 * QuickReplyForm — auth-aware reply form for the thread page.
 *
 * - Shows nothing when visible=false.
 * - Authenticated users see a textarea + submit button.
 * - Unauthenticated users see a "Please log in to reply" prompt.
 * - On successful submit: clears content, reloads page to show new reply.
 */
export function QuickReplyForm({ visible, threadId, onReplySubmitted }: QuickReplyFormProps) {
  const { data: session } = useSession();
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!visible) {
    return null;
  }

  // Unauthenticated: show login prompt
  if (!session) {
    return (
      <table width="100%" cellPadding={5} cellSpacing={0}>
        <tbody>
          <tr style={{ backgroundColor: "var(--rotter-row-odd)" }}>
            <td>
              <span style={{ fontFamily: "var(--rotter-font-primary)", fontSize: "var(--rotter-size-sm)" }}>
                Please{" "}
                <a
                  href="/auth/login"
                  style={{ color: "var(--rotter-link-color, #000099)", textDecoration: "underline" }}
                >
                  log in
                </a>{" "}
                to reply.
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch(`/api/threads/${threadId}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setError(data.error ?? "Failed to submit reply. Please try again.");
        return;
      }

      // Success: clear content and refresh
      setContent("");
      if (onReplySubmitted) {
        onReplySubmitted();
      } else {
        window.location.reload();
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <table width="100%" cellPadding={5} cellSpacing={0}>
        <tbody>
          <tr style={{ backgroundColor: "var(--rotter-row-odd)" }}>
            <td>
              <span style={{ fontWeight: "bold", fontSize: "var(--rotter-size-sm)" }}>
                Quick Reply:
              </span>
              <br />
              <textarea
                rows={6}
                cols={60}
                className={styles.textarea}
                style={{ fontFamily: "var(--rotter-font-primary)" }}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={5000}
                required
                disabled={submitting}
              />
              <br />
              {error && (
                <span
                  style={{
                    color: "#cc0000",
                    fontFamily: "var(--rotter-font-primary)",
                    fontSize: "var(--rotter-size-sm)",
                  }}
                >
                  {error}
                  <br />
                </span>
              )}
              <button
                type="submit"
                disabled={submitting}
                style={{
                  fontSize: "var(--rotter-size-sm)",
                  backgroundColor: "var(--rotter-row-even)",
                  border: "1px solid #999",
                  cursor: submitting ? "not-allowed" : "pointer",
                  padding: "4px 12px",
                  opacity: submitting ? 0.6 : 1,
                }}
              >
                {submitting ? "Submitting..." : "Submit Reply"}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </form>
  );
}
