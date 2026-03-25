import type { threads, posts, newsItems, users, forums } from "@/db/schema";

// Core DB row types (inferred from Drizzle schema)
export type Thread = typeof threads.$inferSelect;
export type Post = typeof posts.$inferSelect;
export type NewsItemRow = typeof newsItems.$inferSelect;
export type User = typeof users.$inferSelect;
export type Forum = typeof forums.$inferSelect;

/**
 * API response type for forum thread listings (shaped for UI consumption).
 * Matches the existing ForumThread interface from src/data/forum-seed.ts
 * so UI components continue working without changes.
 */
export interface ForumListing {
  id: number;
  title: string;
  author: string;
  date: string;
  time: string;
  lastReplyDate: string;
  lastReplyTime: string;
  lastReplyAuthor: string;
  lastReplyNum: number;
  replyCount: number;
  viewCount: number;
  excerpt: string;
  category: string;
  url: string;
}

/**
 * API response type for news items (shaped for UI consumption).
 * Matches the existing NewsItem interface from src/data/news-seed.ts
 * so NewsItemRow and NewsTable components continue working without changes.
 */
export interface NewsItem {
  id: number;
  headline: string;
  time: string;
  source: string;
  sourceIcon: string;
  category: string;
  url: string;
}

export type NewsCategory = "news" | "sports" | "economy" | "tech";
