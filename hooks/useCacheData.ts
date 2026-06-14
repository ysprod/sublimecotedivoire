import { useCallback } from "react";

const CACHE_NAME = "api-cache";
const CACHE_DURATION_MS = 60 * 60 * 1000 * 24 * 365;

interface CachedData<T> {
  data: T;
  timestamp: number;
}

export function useCacheData() {
  const cacheData = useCallback(async <T,>(key: string, data: T): Promise<void> => {
    try {
      const cache = await caches.open(CACHE_NAME);
      const responseData: CachedData<T> = { data, timestamp: Date.now() };
      const response = new Response(JSON.stringify(responseData), {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      await cache.put(key, response);
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error("Cache write error:", error);
      }
    }
  }, []);

  const getCachedData = useCallback(async <T,>(key: string): Promise<T | null> => {
    try {
      const cache = await caches.open(CACHE_NAME);
      const response = await cache.match(key);

      if (!response) return null;

      const cachedData: CachedData<T> = await response.json();

      if (!cachedData || typeof cachedData.timestamp !== 'number') {
        await cache.delete(key);
        return null;
      }

      const isCacheValid = Date.now() - cachedData.timestamp < CACHE_DURATION_MS;

      if (!isCacheValid) {
        await cache.delete(key);
        return null;
      }

      return cachedData.data;
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error("Cache read error:", error);
      }
      return null;
    }
  }, []);

  return { cacheData, getCachedData };
}