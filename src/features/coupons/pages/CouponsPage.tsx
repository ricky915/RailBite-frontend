import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

import { ROUTES } from '@/routes/routePaths';

import { CouponInput } from '@/features/coupons/components/CouponInput';

/**
 * Page component: coupon check (Section 11.9 Coupon Module). Kept as its
 * own routed page — rather than imported into `features/cart` or
 * `features/checkout` — to respect the "features must not import from other
 * features" rule (Section 5.4). A coupon applied here writes into the
 * shared Zustand `cartStore`, so it is reflected on the cart/checkout pages
 * immediately without those features depending on this one directly.
 */
export default function CouponsPage(): JSX.Element {
  return (
    <>
      <Helmet>
        <title>Apply a coupon — RailBite</title>
      </Helmet>

      <div className="mx-auto flex max-w-sm flex-col gap-6 py-10">
        <h1 className="text-2xl font-bold text-neutral-900">Have a coupon?</h1>
        <p className="text-sm text-neutral-500">
          Enter your code below — it applies to your current cart automatically.
        </p>

        <CouponInput />

        <Link to={ROUTES.CART} className="text-center text-sm text-brand-600 hover:underline">
          Back to cart
        </Link>
      </div>
    </>
  );
}
