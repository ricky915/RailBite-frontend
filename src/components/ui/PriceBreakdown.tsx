import { formatCurrency } from '@/utils/formatters';

export interface PriceBreakdownData {
  subtotalInPaise: number;
  deliveryFeeInPaise?: number;
  platformFeeInPaise?: number;
  gstAmountInPaise?: number;
  couponDiscountInPaise?: number;
  grandTotalInPaise: number;
}

export interface PriceBreakdownProps {
  breakdown: PriceBreakdownData;
}

/**
 * Shared price breakdown (Section 11.6 / 11.7 — subtotal, delivery fee,
 * platform fee, GST, coupon discount, grand total). Lives in shared
 * `components/ui/` (not a single feature) because both `features/cart` and
 * `features/checkout` render it, and features must not import from each
 * other (Section 5.4 dependency rules).
 */
export function PriceBreakdown({ breakdown }: PriceBreakdownProps): JSX.Element {
  const rows: Array<{ label: string; amountInPaise: number | undefined; isDiscount?: boolean }> = [
    { label: 'Subtotal', amountInPaise: breakdown.subtotalInPaise },
    { label: 'Delivery fee', amountInPaise: breakdown.deliveryFeeInPaise },
    { label: 'Platform fee', amountInPaise: breakdown.platformFeeInPaise },
    { label: 'GST', amountInPaise: breakdown.gstAmountInPaise },
    { label: 'Coupon discount', amountInPaise: breakdown.couponDiscountInPaise, isDiscount: true },
  ];

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-neutral-200 bg-white p-4 text-sm">
      {rows
        .filter((row) => row.amountInPaise !== undefined)
        .map((row) => (
          <div key={row.label} className="flex justify-between text-neutral-600">
            <span>{row.label}</span>
            <span>
              {row.isDiscount && row.amountInPaise ? '− ' : ''}
              {formatCurrency(row.amountInPaise ?? 0)}
            </span>
          </div>
        ))}
      <div className="mt-2 flex justify-between border-t border-neutral-200 pt-2 text-base font-semibold text-neutral-900">
        <span>Grand total</span>
        <span>{formatCurrency(breakdown.grandTotalInPaise)}</span>
      </div>
    </div>
  );
}
