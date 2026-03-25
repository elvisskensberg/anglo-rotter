"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * Client-side polling hook. Fetches url at intervalMs intervals,
 * returning the latest data and a loading flag.
 *
 * @param url - API endpoint to fetch
 * @param intervalMs - Polling interval in milliseconds
 * @param options.enabled - Whether polling is active (default true)
 */
export function useAutoRefresh<T>(
  url: string,
  intervalMs: number,
  options?: { enabled?: boolean }
): { data: T | null; isLoading: boolean; error: string | null; refresh: () => void } {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const enabled = options?.enabled ?? true;

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json as T);
      setError(null);
    } catch (err) {
      setError(String(err));
    } finally {
      setIsLoading(false);
    }
  }, [url]);

  useEffect(() => {
    if (!enabled) return;

    // Initial fetch
    fetchData();

    // Set up interval
    const interval = setInterval(fetchData, intervalMs);
    return () => clearInterval(interval);
  }, [fetchData, intervalMs, enabled]);

  return { data, isLoading, error, refresh: fetchData };
}
