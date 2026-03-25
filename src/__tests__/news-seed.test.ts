/**
 * news-seed tests (NEWS-01)
 * Validates NewsItem interface and NEWS_SEED array integrity.
 */
import "@testing-library/jest-dom";
import { NEWS_SEED, NEWS_CATEGORIES } from "@/data/news-seed";
import type { NewsItem, NewsCategory } from "@/data/news-seed";

describe("NEWS_SEED (NEWS-01)", () => {
  test("has length >= 30", () => {
    expect(NEWS_SEED.length).toBeGreaterThanOrEqual(30);
  });

  test("every item satisfies NewsItem interface (all 7 fields are correct types)", () => {
    const validCategories: string[] = [...NEWS_CATEGORIES];
    NEWS_SEED.forEach((newsItem: NewsItem, i: number) => {
      expect(typeof newsItem.id).toBe("number");
      expect(typeof newsItem.headline).toBe("string");
      expect(typeof newsItem.time).toBe("string");
      expect(typeof newsItem.source).toBe("string");
      expect(typeof newsItem.sourceIcon).toBe("string");
      expect(validCategories.includes(newsItem.category)).toBe(true);
      expect(typeof newsItem.url).toBe("string");
      // Smoke test index for useful failure messages
      expect(i).toBeGreaterThanOrEqual(0);
    });
  });

  test("every item.category is one of the 4 valid categories", () => {
    const validCategories: NewsCategory[] = [...NEWS_CATEGORIES];
    NEWS_SEED.forEach((newsItem: NewsItem) => {
      expect(validCategories).toContain(newsItem.category);
    });
  });

  test("at least 5 items per category", () => {
    const categoryCounts = NEWS_CATEGORIES.map((cat) => ({
      category: cat,
      count: NEWS_SEED.filter((item) => item.category === cat).length,
    }));
    categoryCounts.forEach(({ category, count }) => {
      expect(count).toBeGreaterThanOrEqual(5);
    });
  });

  test("at least 6 distinct source names across all items", () => {
    const distinctSources = new Set(NEWS_SEED.map((item) => item.source));
    expect(distinctSources.size).toBeGreaterThanOrEqual(6);
  });

  test("every item has non-empty headline and source", () => {
    NEWS_SEED.forEach((newsItem: NewsItem) => {
      expect(newsItem.headline.trim().length).toBeGreaterThan(0);
      expect(newsItem.source.trim().length).toBeGreaterThan(0);
    });
  });
});
