import React from "react";
import styles from "./ForumSectionDropdown.module.css";

/**
 * ForumSectionDropdown renders the forum category selector.
 *
 * Lists 6 forum sections: Scoops (default), Politics, Media, Economy, Sports, Culture.
 * onChange calls onCategoryChange with the selected value for client-side filtering.
 *
 * NOTE: Per CONTEXT.md locked decision — section changes filter seed data by category
 * (client-side filter, not navigation). See Pitfall 4 in 03-RESEARCH.md.
 *
 * Source: scoops_forum.html lines 280-293
 */

export interface ForumSectionDropdownProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const FORUM_SECTIONS = [
  { value: "scoops", label: "Scoops" },
  { value: "politics", label: "Politics" },
  { value: "media", label: "Media" },
  { value: "economy", label: "Economy" },
  { value: "sports", label: "Sports" },
  { value: "culture", label: "Culture" },
] as const;

export function ForumSectionDropdown({
  selectedCategory,
  onCategoryChange,
}: ForumSectionDropdownProps) {
  return (
    <select
      className={styles.select}
      value={selectedCategory}
      onChange={(e) => onCategoryChange(e.target.value)}
      aria-label="Forum section"
    >
      {FORUM_SECTIONS.map((section) => (
        <option key={section.value} value={section.value}>
          {section.label}
        </option>
      ))}
    </select>
  );
}
