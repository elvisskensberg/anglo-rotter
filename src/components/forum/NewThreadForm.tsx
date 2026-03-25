"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import styles from "./NewThreadForm.module.css";

interface NewThreadFormProps {
  forumId: string;
}

/**
 * NewThreadForm — client component for creating a new thread in a forum.
 *
 * - Shows a login prompt for unauthenticated users.
 * - Authenticated users see a form with title + content fields.
 * - On submit: POST /api/threads, then navigate to the new thread.
 */
export function NewThreadForm({ forumId }: NewThreadFormProps) {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Show loading state while session is being fetched
  if (isPending) {
    return (
      <div className={styles.container}>
        <p style={{ fontFamily: "var(--rotter-font-primary)", fontSize: "var(--rotter-size-sm)" }}>
          Loading...
        </p>
      </div>
    );
  }

  // Unauthenticated: show login prompt
  if (!session) {
    return (
      <div className={styles.container}>
        <div className={styles.loginPrompt}>
          Please{" "}
          <a href="/auth/login" className={styles.loginLink}>
            log in
          </a>{" "}
          to post a new thread.
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/threads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, forumId }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setError(data.error ?? "Failed to post thread. Please try again.");
        return;
      }

      const data = (await res.json()) as { id: number; url: string };
      router.push(`/thread/${data.id}`);
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit}>
        <table border={0} cellSpacing={0} cellPadding={0} className={styles.formTable}>
          <tbody>
            {/* Header */}
            <tr className={styles.headerRow}>
              <td className={styles.headerCell} colSpan={2}>
                Post New Thread
              </td>
            </tr>

            {/* Title field */}
            <tr style={{ backgroundColor: "var(--rotter-row-odd)" }}>
              <td className={styles.labelCell}>Subject:</td>
              <td className={styles.inputCell}>
                <input
                  type="text"
                  className={styles.input}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={200}
                  required
                  disabled={submitting}
                />
              </td>
            </tr>

            {/* Content field */}
            <tr style={{ backgroundColor: "var(--rotter-row-even)" }}>
              <td className={styles.labelCell}>Message:</td>
              <td className={styles.inputCell}>
                <textarea
                  className={styles.textarea}
                  rows={10}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  maxLength={5000}
                  required
                  disabled={submitting}
                />
              </td>
            </tr>

            {/* Error message */}
            {error && (
              <tr>
                <td colSpan={2}>
                  <span className={styles.errorMessage}>{error}</span>
                </td>
              </tr>
            )}

            {/* Submit */}
            <tr style={{ backgroundColor: "var(--rotter-row-odd)" }}>
              <td colSpan={2} className={styles.inputCell}>
                <button type="submit" className={styles.submitButton} disabled={submitting}>
                  {submitting ? "Posting..." : "Post Thread"}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  );
}
