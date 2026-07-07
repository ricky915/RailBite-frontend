import type { OrderStatusHistoryEntry } from '@/types/domain.types';
import { formatDateTime } from '@/utils/formatters';

export interface OrderTimelineProps {
  history: OrderStatusHistoryEntry[];
}

/**
 * Feature component: order status timeline (Section 11.10 — "Real-time order
 * status display with status timeline"; Section 6.1 hierarchy example).
 */
export function OrderTimeline({ history }: OrderTimelineProps): JSX.Element {
  return (
    <ol className="flex flex-col gap-4">
      {history.map((entry, index) => (
        <li key={`${entry.status}-${entry.timestamp}`} className="flex gap-3">
          <div className="flex flex-col items-center">
            <span
              className={`h-3 w-3 rounded-full ${index === history.length - 1 ? 'bg-brand-600' : 'bg-neutral-300'}`}
            />
            {index < history.length - 1 && <span className="mt-1 h-full w-px flex-1 bg-neutral-200" />}
          </div>
          <div className="pb-4">
            <p className="text-sm font-medium text-neutral-900">{entry.status.replace(/_/g, ' ')}</p>
            <p className="text-xs text-neutral-500">{formatDateTime(entry.timestamp)}</p>
            {entry.note && <p className="text-xs text-neutral-500">{entry.note}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}
