import { sqliteTable, text, integer, index, unique } from "drizzle-orm/sqlite-core";

/**
 * forums table — top-level forum sections (e.g. "scoops1", "politics", etc.)
 */
export const forums = sqliteTable("forums", {
  id: text("id").primaryKey(), // e.g. "scoops1"
  name: text("name").notNull(), // e.g. "Scoops & News"
  slug: text("slug").notNull().unique(),
});

/**
 * threads table — individual discussion threads within a forum
 */
export const threads = sqliteTable(
  "threads",
  {
    id: integer("id").primaryKey(),
    forumId: text("forum_id")
      .notNull()
      .references(() => forums.id),
    title: text("title").notNull(),
    author: text("author").notNull(),
    content: text("content").notNull(),
    excerpt: text("excerpt"),
    category: text("category").notNull().default("scoops"),
    viewCount: integer("view_count").notNull().default(0),
    replyCount: integer("reply_count").notNull().default(0),
    createdAt: integer("created_at").notNull(), // Unix timestamp ms
    lastReplyAt: integer("last_reply_at"), // Unix timestamp ms, nullable
    lastReplyAuthor: text("last_reply_author"),
  },
  (table) => [
    index("idx_threads_forum_id").on(table.forumId),
    index("idx_threads_category").on(table.category),
  ]
);

/**
 * posts table — replies within a thread (including nested replies)
 */
export const posts = sqliteTable(
  "posts",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    threadId: integer("thread_id")
      .notNull()
      .references(() => threads.id),
    parentId: integer("parent_id"), // NULL = top-level reply
    author: text("author").notNull(),
    content: text("content").notNull(),
    postNumber: integer("post_number").notNull(),
    createdAt: integer("created_at").notNull(), // Unix timestamp ms
  },
  (table) => [index("idx_posts_thread_id").on(table.threadId)]
);

/**
 * news_items table — news flash items from the news section
 */
export const newsItems = sqliteTable(
  "news_items",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    headline: text("headline").notNull(),
    source: text("source").notNull(),
    sourceIcon: text("source_icon").notNull(), // hex color string
    category: text("category").notNull(), // news/sports/economy/tech
    url: text("url").notNull().default("#"),
    publishedAt: integer("published_at").notNull(), // Unix timestamp ms
  },
  (table) => [
    index("idx_news_items_category").on(table.category),
    index("idx_news_items_published_at").on(table.publishedAt),
  ]
);

/**
 * user table — Better Auth required table for authentication.
 * Forum-specific profile fields (username, postCount, etc.) are added here
 * so auth identity and forum profile live on the same row.
 *
 * Better Auth fields: id, name, email, emailVerified, image, createdAt, updatedAt
 * Forum-specific additions: username, postCount, starRating, ratersCount, points
 *
 * NOTE: The legacy `users` table has been replaced by this table.
 * Code that queried `users` by username should now query `user` by `username`.
 */
export const user = sqliteTable("user", {
  // --- Better Auth required fields ---
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" }).notNull().default(false),
  image: text("image"),
  createdAt: integer("created_at").notNull(), // Unix timestamp ms
  updatedAt: integer("updated_at").notNull(), // Unix timestamp ms
  // --- Forum-specific profile fields ---
  username: text("username").unique(), // Display name used in forum posts
  postCount: integer("post_count").notNull().default(0),
  starRating: integer("star_rating").notNull().default(1),
  ratersCount: integer("raters_count").notNull().default(0),
  points: integer("points").notNull().default(0),
});

/**
 * Alias for backwards-compatibility with code that uses `users`.
 * Prefer `user` for new code.
 */
export const users = user;

/**
 * session table — Better Auth session management
 */
export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expires_at").notNull(), // Unix timestamp ms
  token: text("token").notNull().unique(),
  createdAt: integer("created_at").notNull(), // Unix timestamp ms
  updatedAt: integer("updated_at").notNull(), // Unix timestamp ms
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
});

/**
 * account table — Better Auth OAuth account linking
 */
export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at"), // Unix timestamp ms
  refreshTokenExpiresAt: integer("refresh_token_expires_at"), // Unix timestamp ms
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("created_at").notNull(), // Unix timestamp ms
  updatedAt: integer("updated_at").notNull(), // Unix timestamp ms
});

/**
 * verification table — Better Auth email/OTP verification tokens
 */
export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at").notNull(), // Unix timestamp ms
  createdAt: integer("created_at"), // Unix timestamp ms
  updatedAt: integer("updated_at"), // Unix timestamp ms
});

/**
 * threadRatings table — user star ratings for threads (1-5 stars)
 * One rating per user per thread enforced via unique constraint.
 */
export const threadRatings = sqliteTable(
  "thread_ratings",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    threadId: integer("thread_id")
      .notNull()
      .references(() => threads.id),
    userId: text("user_id").notNull(), // references user.id (text type from Better Auth)
    score: integer("score").notNull(), // 1-5
    createdAt: integer("created_at").notNull(), // Unix timestamp ms
  },
  (table) => [
    index("idx_thread_ratings_thread_id").on(table.threadId),
    index("idx_thread_ratings_user_thread").on(table.userId, table.threadId),
    unique("uq_thread_ratings_user_thread").on(table.userId, table.threadId),
  ]
);

/**
 * push_subscriptions table — browser push notification subscriptions
 */
export const pushSubscriptions = sqliteTable("push_subscriptions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  endpoint: text("endpoint").notNull().unique(),
  p256dh: text("p256dh").notNull(),
  auth: text("auth").notNull(),
  createdAt: integer("created_at").notNull(), // Unix timestamp ms
});
