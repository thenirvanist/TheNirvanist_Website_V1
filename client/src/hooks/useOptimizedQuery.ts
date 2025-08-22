import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getQueryFn } from '@/lib/queryClient';

interface OptimizedQueryOptions<T> extends Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'> {
  priority?: 'high' | 'normal' | 'low';
  preload?: boolean;
}

/**
 * Optimized query hook that implements priority-based loading
 * and better caching strategies for performance
 */
export function useOptimizedQuery<T>(
  queryKey: string | string[],
  options: OptimizedQueryOptions<T> = {}
) {
  const { priority = 'normal', preload = false, ...queryOptions } = options;

  // Convert single string to array for consistency
  const key = Array.isArray(queryKey) ? queryKey : [queryKey];

  // Priority-based configurations
  const priorityConfig = {
    high: {
      staleTime: 2 * 60 * 1000, // 2 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: true,
      retry: 3,
    },
    normal: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 15 * 60 * 1000, // 15 minutes
      refetchOnWindowFocus: false,
      retry: 2,
    },
    low: {
      staleTime: 10 * 60 * 1000, // 10 minutes
      cacheTime: 30 * 60 * 1000, // 30 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    }
  };

  return useQuery<T>({
    queryKey: key,
    queryFn: getQueryFn({ on401: 'throw' }),
    ...priorityConfig[priority],
    ...queryOptions,
    // Enable background updates for high priority queries
    refetchInterval: priority === 'high' ? 5 * 60 * 1000 : false,
  });
}

/**
 * Hook for critical above-the-fold data
 */
export function useCriticalQuery<T>(
  queryKey: string | string[],
  options: Omit<OptimizedQueryOptions<T>, 'priority'> = {}
) {
  return useOptimizedQuery<T>(queryKey, {
    ...options,
    priority: 'high',
  });
}

/**
 * Hook for below-the-fold data that can be loaded later
 */
export function useDeferredQuery<T>(
  queryKey: string | string[],
  options: Omit<OptimizedQueryOptions<T>, 'priority'> = {}
) {
  return useOptimizedQuery<T>(queryKey, {
    ...options,
    priority: 'low',
  });
}