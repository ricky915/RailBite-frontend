import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import { DEFAULT_PAGE_SIZE } from '@/config/constants';

export interface UsePaginationResult {
  page: number;
  pageSize: number;
  setPage: (page: number) => void;
}

/**
 * Reads/writes `page` and `pageSize` from the URL search params (Section 8.7
 * — pagination state lives in the URL so listing pages are shareable/bookmarkable).
 */
export function usePagination(defaultPageSize: number = DEFAULT_PAGE_SIZE): UsePaginationResult {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = useMemo(() => {
    const parsed = Number(searchParams.get('page'));
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
  }, [searchParams]);

  const pageSize = useMemo(() => {
    const parsed = Number(searchParams.get('pageSize'));
    return Number.isFinite(parsed) && parsed > 0 ? parsed : defaultPageSize;
  }, [searchParams, defaultPageSize]);

  const setPage = useCallback(
    (nextPage: number) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set('page', String(nextPage));
        return next;
      });
    },
    [setSearchParams],
  );

  return { page, pageSize, setPage };
}
