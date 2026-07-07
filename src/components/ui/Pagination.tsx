import { cn } from '@/utils/cn';

export interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const MAX_VISIBLE_PAGES = 5;

function getVisiblePages(page: number, totalPages: number): number[] {
  const half = Math.floor(MAX_VISIBLE_PAGES / 2);
  let start = Math.max(1, page - half);
  const end = Math.min(totalPages, start + MAX_VISIBLE_PAGES - 1);
  start = Math.max(1, end - MAX_VISIBLE_PAGES + 1);

  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

/**
 * Controlled pagination with prev/next and page number display
 * (Section 6.5 `<Pagination />`). Server-side pagination per Section 8.7 —
 * this component only renders controls; the caller owns the URL state.
 */
export function Pagination({ page, totalPages, onPageChange, className }: PaginationProps): JSX.Element | null {
  if (totalPages <= 1) return null;

  const visiblePages = getVisiblePages(page, totalPages);

  return (
    <nav aria-label="Pagination" className={cn('flex items-center justify-center gap-1', className)}>
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
        className="h-9 rounded-lg border border-neutral-300 px-3 text-sm disabled:opacity-40"
      >
        Prev
      </button>

      {visiblePages.map((pageNumber) => (
        <button
          key={pageNumber}
          type="button"
          onClick={() => onPageChange(pageNumber)}
          aria-current={pageNumber === page ? 'page' : undefined}
          className={cn(
            'h-9 min-w-9 rounded-lg px-3 text-sm',
            pageNumber === page
              ? 'bg-brand-600 text-white'
              : 'border border-neutral-300 text-neutral-700 hover:bg-neutral-100',
          )}
        >
          {pageNumber}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
        className="h-9 rounded-lg border border-neutral-300 px-3 text-sm disabled:opacity-40"
      >
        Next
      </button>
    </nav>
  );
}
