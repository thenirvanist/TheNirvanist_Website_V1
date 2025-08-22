import React, { memo } from 'react';

/**
 * Higher-order component for performance optimization
 * Prevents unnecessary re-renders of components
 */
export function withPerformanceOptimization<P extends object>(
  Component: React.ComponentType<P>,
  areEqual?: (prevProps: P, nextProps: P) => boolean
) {
  const OptimizedComponent = memo(Component, areEqual);
  OptimizedComponent.displayName = `Optimized(${Component.displayName || Component.name})`;
  return OptimizedComponent;
}

/**
 * Custom memo hook for comparing props with shallow comparison
 */
export function useShallowMemo<T>(value: T, deps: React.DependencyList): T {
  return React.useMemo(() => value, deps);
}

/**
 * Performance monitoring hook
 */
export function usePerformanceMonitor(componentName: string) {
  if (process.env.NODE_ENV === 'development') {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      if (renderTime > 16) { // More than one frame at 60fps
        console.warn(`${componentName} slow render: ${renderTime.toFixed(2)}ms`);
      }
    };
  }
  
  return () => {}; // No-op in production
}