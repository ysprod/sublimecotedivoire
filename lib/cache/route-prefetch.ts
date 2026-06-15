import { api } from '@/lib/api/client';

import { notificationsService } from '@/lib/api/services/notifications.service';

import type { User } from '@/lib/interfaces';
import type { QueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from './queryClient';

const inFlightDataPrefetches = new Map<string, Promise<void>>();
const inFlightConsultationPrefetches = new Map<string, Promise<void>>();
const inFlightAdminUserPrefetches = new Map<string, Promise<void>>();

type PrefetchEntry = {
  route: string;
  requiresAuth?: boolean;
  prefetch: (queryClient: QueryClient) => Promise<void>;
};

const prefetchRegistry: PrefetchEntry[] = [
  {
    route: '/star/notifications',
    requiresAuth: true,
    prefetch: async (queryClient) => {
      await queryClient.prefetchQuery({
        queryKey: QUERY_KEYS.NOTIFICATIONS,
        queryFn: () => notificationsService.getUnreadNotifications(),
      });
    },
  },
];

export function normalizePrefetchHref(href: string): string | null {
  if (!href.startsWith('/')) {
    return null;
  }

  const pathname = href.split('#')[0]?.split('?')[0]?.trim();
  if (!pathname) {
    return null;
  }

  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.slice(0, -1);
  }

  return pathname;
}

export function prefetchRouteData(
  queryClient: QueryClient,
  href: string,
  isAuthenticated: boolean,
): Promise<void> {
  const normalizedHref = normalizePrefetchHref(href);
  if (!normalizedHref) {
    return Promise.resolve();
  }

  const entry = prefetchRegistry.find((candidate) => candidate.route === normalizedHref);
  if (!entry) {
    return Promise.resolve();
  }

  if (entry.requiresAuth && !isAuthenticated) {
    return Promise.resolve();
  }

  const existing = inFlightDataPrefetches.get(normalizedHref);
  if (existing) {
    return existing;
  }

  const pending = entry
    .prefetch(queryClient)
    .catch(() => undefined)
    .finally(() => {
      inFlightDataPrefetches.delete(normalizedHref);
    });

  inFlightDataPrefetches.set(normalizedHref, pending);
  return pending;
}

export function prefetchConsultationFrontData(queryClient: QueryClient, consultationId: string): any {
  const normalizedId = consultationId.trim();
  if (!normalizedId) {
    return Promise.resolve();
  }

  const existing = inFlightConsultationPrefetches.get(normalizedId);
  if (existing) {
    return existing;
  }
}

export function prefetchAdminUserDetail(queryClient: QueryClient, userId: string): Promise<void> {
  const normalizedId = userId.trim();
  if (!normalizedId) {
    return Promise.resolve();
  }

  const existing = inFlightAdminUserPrefetches.get(normalizedId);
  if (existing) {
    return existing;
  }

  const pending = queryClient
    .prefetchQuery({
      queryKey: QUERY_KEYS.ADMIN_USER_DETAIL(normalizedId),
      queryFn: async () => {
        const response = await api.get<User>(`/users/${normalizedId}`);
        return response.data;
      },
      staleTime: 1000 * 60,
    })
    .catch(() => undefined)
    .finally(() => {
      inFlightAdminUserPrefetches.delete(normalizedId);
    });

  inFlightAdminUserPrefetches.set(normalizedId, pending);
  return pending;
}