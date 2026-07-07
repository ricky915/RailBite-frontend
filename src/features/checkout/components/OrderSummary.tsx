import { PriceBreakdown, type PriceBreakdownData } from '@/components/ui/PriceBreakdown';
import type { CartItem } from '@/types/domain.types';

export interface OrderSummaryProps {
  items: CartItem[];
  deliveryStation: string | null;
  trainNumber: string | null;
  coach: string | null;
  seat: string | null;
  breakdown: PriceBreakdownData;
}

/**
 * Feature component: full checkout order summary (Section 11.7 — itemized
 * order summary, delivery details, price breakdown).
 */
export function OrderSummary({
  items,
  deliveryStation,
  trainNumber,
  coach,
  seat,
  breakdown,
}: OrderSummaryProps): JSX.Element {
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-neutral-200 bg-white p-4 text-sm">
        <h3 className="mb-2 font-semibold text-neutral-900">Delivery details</h3>
        <dl className="grid grid-cols-2 gap-y-1 text-neutral-600">
          <dt>Train</dt>
          <dd>{trainNumber ?? '—'}</dd>
          <dt>Delivery station</dt>
          <dd>{deliveryStation ?? '—'}</dd>
          <dt>Coach / Seat</dt>
          <dd>
            {coach ?? '—'} / {seat ?? '—'}
          </dd>
        </dl>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white p-4 text-sm">
        <h3 className="mb-2 font-semibold text-neutral-900">Items</h3>
        <ul className="flex flex-col gap-1 text-neutral-600">
          {items.map((item) => (
            <li key={item.menuItemId} className="flex justify-between">
              <span>
                {item.quantity} × {item.name}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <PriceBreakdown breakdown={breakdown} />
    </div>
  );
}
