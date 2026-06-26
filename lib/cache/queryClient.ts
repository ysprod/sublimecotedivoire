import { QueryClient } from '@tanstack/react-query';

export const PERSISTED_QUERY_CACHE_KEY = 'monetoile-react-query-cache';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 10, // 10 minutes
      gcTime: 1000 * 60 * 30,    // 30 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

export const QUERY_KEYS = {
  AUTH_ME: ['auth', 'me'],
  NOTIFICATIONS: ['notifications'],
};

export function clearPersistedQueryCache() {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.removeItem(PERSISTED_QUERY_CACHE_KEY);
}