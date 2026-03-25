"use client";

import React, { useState } from "react";
import { useSession } from "@/lib/auth-client";

interface ThreadRatingProps {
  threadId: number;
  currentRating: number;
  ratersCount: number;
  points: number;
}

/**
 * ThreadRating component — displays star rating for a thread author.
 *
 * - Unauthenticated: read-only star SVG display
 * - Authenticated: clickable 1-5 star rating with hover highlight
 * - On submit: POST /api/threads/[threadId]/rate with { score }
 * - Optimistic update after successful submission
 */
export function ThreadRating({ threadId, currentRating, ratersCount, points }: ThreadRatingProps) {
  const { data: session } = useSession();
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [submittedRating, setSubmittedRating] = useState<number | null>(null);
  const [displayRating, setDisplayRating] = useState(currentRating);
  const [displayRatersCount, setDisplayRatersCount] = useState(ratersCount);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAuthenticated = !!session?.user;

  const activeStarNum = hoveredStar ?? submittedRating ?? displayRating;
  // Clamp to valid star image (1-5)
  const clampedStar = Math.min(5, Math.max(1, activeStarNum));

  const handleStarClick = async (star: number) => {
    if (!isAuthenticated || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/threads/${threadId}/rate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score: star }),
      });

      if (res.ok) {
        const data = (await res.json()) as { score: number; averageRating: number; ratersCount: number };
        setSubmittedRating(star);
        setDisplayRating(data.averageRating);
        setDisplayRatersCount(data.ratersCount);
      }
    } catch (_err) {
      // Silently fail — keep current display state
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    // Read-only star display
    return (
      <span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/icons/star-${clampedStar}.svg`}
          alt={`${clampedStar} stars`}
          title={`Rating: ${clampedStar}/5 (${displayRatersCount} raters, ${points} points)`}
        />
        <br />
        <span style={{ fontSize: "var(--rotter-size-xs)" }}>
          <span style={{ color: "var(--rotter-green-rating)" }}>
            <b>{displayRatersCount} raters</b>
          </span>
          {", "}
          <span style={{ color: "var(--rotter-text-time)" }}>
            <b>{points} points</b>
          </span>
        </span>
      </span>
    );
  }

  // Authenticated: clickable stars
  return (
    <span>
      <span
        style={{ display: "inline-flex", gap: "2px", cursor: isSubmitting ? "wait" : "pointer" }}
        onMouseLeave={() => setHoveredStar(null)}
      >
        {[1, 2, 3, 4, 5].map((star) => {
          const isHighlighted = hoveredStar !== null ? star <= hoveredStar : star <= clampedStar;
          return (
            <span
              key={star}
              onClick={() => handleStarClick(star)}
              onMouseEnter={() => setHoveredStar(star)}
              style={{
                cursor: isSubmitting ? "wait" : "pointer",
                opacity: isHighlighted ? 1 : 0.35,
                display: "inline-block",
                lineHeight: 1,
              }}
              title={`Rate ${star} star${star > 1 ? "s" : ""}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icons/star-5.svg" alt={`${star} star`} width={14} height={14} />
            </span>
          );
        })}
      </span>
      {submittedRating && (
        <span
          style={{
            fontSize: "var(--rotter-size-xs)",
            color: "var(--rotter-green-rating)",
            marginLeft: "4px",
          }}
        >
          Rated!
        </span>
      )}
      <br />
      <span style={{ fontSize: "var(--rotter-size-xs)" }}>
        <span style={{ color: "var(--rotter-green-rating)" }}>
          <b>{displayRatersCount} raters</b>
        </span>
        {", "}
        <span style={{ color: "var(--rotter-text-time)" }}>
          <b>{points} points</b>
        </span>
      </span>
    </span>
  );
}
