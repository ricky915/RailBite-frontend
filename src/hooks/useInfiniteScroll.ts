import { useEffect, useRef } from 'react';

export interface UseInfiniteScrollOptions {
  onIntersect: () => void;
  enabled?: boolean;
  rootMargin?: string;
}

/**
 * Attaches an IntersectionObserver to a sentinel element; calls `onIntersect`
 * (typically `fetchNextPage()`) when it scrolls into view (Section 8.7 —
 * infinite scroll for restaurant listing / order history on mobile).
 */
export function useInfiniteScroll<T extends HTMLElement>({
  onIntersect,
  enabled = true,
  rootMargin = '200px',
}: UseInfiniteScrollOptions): React.RefObject<T> {
  const sentinelRef = useRef<T>(null);

  useEffect(() => {
    if (!enabled) return;
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          onIntersect();
        }
      },
      { rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [enabled, onIntersect, rootMargin]);

  return sentinelRef;
}
