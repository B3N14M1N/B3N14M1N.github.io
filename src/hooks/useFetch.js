import { useState, useEffect, useRef } from 'react';

/**
 * Generic data-fetching hook with caching support.
 *
 * @param {string} url - The URL to fetch JSON from.
 * @param {object} [options]
 * @param {string} [options.cacheKey]       - localStorage key for caching.
 * @param {number} [options.cacheTTL=3600000] - Cache TTL in ms (default 1 hour).
 * @param {*}      [options.initialData=null] - Initial data value.
 * @returns {{ data: any, loading: boolean, error: string|null }}
 */
export function useFetch(url, { cacheKey, cacheTTL = 3600000, initialData = null } = {}) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  useEffect(() => {
    if (!url) {
      setLoading(false);
      return;
    }

    // Try cache first
    if (cacheKey) {
      try {
        const raw = localStorage.getItem(cacheKey);
        if (raw) {
          const { data: cached, timestamp } = JSON.parse(raw);
          if (Date.now() - timestamp < cacheTTL) {
            setData(cached);
            setLoading(false);
            // Still fetch in background to refresh cache
            fetchData(true);
            return;
          }
        }
      } catch {
        // ignore cache errors
      }
    }

    fetchData(false);

    async function fetchData(isBackground) {
      if (!isBackground) setLoading(true);
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setData(json);
        setError(null);

        // Update cache
        if (cacheKey) {
          try {
            localStorage.setItem(cacheKey, JSON.stringify({ data: json, timestamp: Date.now() }));
          } catch {
            // quota exceeded, ignore
          }
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          if (!isBackground) setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted && !isBackground) {
          setLoading(false);
        }
      }
    }

    return () => abortRef.current?.abort();
  }, [url, cacheKey, cacheTTL]);

  return { data, loading, error };
}
