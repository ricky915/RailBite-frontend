import { lazy, Suspense } from 'react';
import { Link, Navigate, Outlet, Route, Routes } from 'react-router-dom';

import { AppShell } from '@/components/layout/AppShell';
import { PageSpinner } from '@/components/feedback/PageSpinner';
import { Button } from '@/components/ui/Button';

import { PrivateRoutes } from '@/routes/PrivateRoutes';
import { PublicRoutes } from '@/routes/PublicRoutes';
import { ROUTES } from '@/routes/routePaths';

// ---------------------------------------------------------------------------
// Route-level code splitting (Section 8.1.3): every page component is
// lazily loaded, cutting ~60-70% off the initial bundle. The Suspense
// boundary around <Routes> below provides the <PageSpinner /> fallback.
// ---------------------------------------------------------------------------
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/features/auth/pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@/features/auth/pages/ForgotPasswordPage'));

const SearchPage = lazy(() => import('@/features/search/pages/SearchPage'));

const RestaurantListingPage = lazy(() => import('@/features/restaurants/pages/RestaurantListingPage'));
const RestaurantDetailPage = lazy(() => import('@/features/restaurants/pages/RestaurantDetailPage'));

const CartPage = lazy(() => import('@/features/cart/pages/CartPage'));
const CheckoutPage = lazy(() => import('@/features/checkout/pages/CheckoutPage'));
const PaymentPage = lazy(() => import('@/features/payment/pages/PaymentPage'));

const OrdersListPage = lazy(() => import('@/features/orders/pages/OrdersListPage'));
const OrderDetailPage = lazy(() => import('@/features/orders/pages/OrderDetailPage'));

const ProfilePage = lazy(() => import('@/features/profile/pages/ProfilePage'));
const CouponsPage = lazy(() => import('@/features/coupons/pages/CouponsPage'));
const RateOrderPage = lazy(() => import('@/features/ratings/pages/RateOrderPage'));

const SupportPage = lazy(() => import('@/features/support/pages/SupportPage'));
const TicketDetailPage = lazy(() => import('@/features/support/pages/TicketDetailPage'));

const InvoiceDetailPage = lazy(() => import('@/features/invoices/pages/InvoiceDetailPage'));

/** Simple landing page — not tied to any single feature, so it lives here rather than in `features/`. */
function HomePage(): JSX.Element {
  return (
    <div className="flex flex-col items-center gap-6 py-16 text-center">
      <h1 className="text-3xl font-bold text-neutral-900">Food delivered to your train seat</h1>
      <p className="max-w-md text-neutral-600">
        Search your train or PNR, browse restaurants at your delivery station, and get fresh food
        delivered straight to your coach.
      </p>
      <div className="flex gap-3">
        <Link to={ROUTES.SEARCH}>
          <Button>Search your train</Button>
        </Link>
        <Link to={ROUTES.RESTAURANTS}>
          <Button variant="secondary">Browse restaurants</Button>
        </Link>
      </div>
    </div>
  );
}

/** Catch-all 404 page. */
function NotFoundPage(): JSX.Element {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <h1 className="text-3xl font-bold text-neutral-900">Page not found</h1>
      <p className="text-neutral-600">The page you're looking for doesn't exist.</p>
      <Link to={ROUTES.HOME}>
        <Button>Back to home</Button>
      </Link>
    </div>
  );
}

/** Root layout: wraps every route in the shared `AppShell` (navbar/footer). */
function RootLayout(): JSX.Element {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}

/**
 * Root router configuration (Section 8.1.1). Composed of:
 * - Truly public pages (home, search, restaurant listing/detail) — viewable
 *   by guests and authenticated users alike (Section 11.3 — "Guest users
 *   can search without login but must log in before placing an order").
 * - `PublicRoutes`-guarded pages (login/register/forgot-password) — redirect
 *   away if already authenticated (Section 8.1.2).
 * - `PrivateRoutes`-guarded pages (cart onward) — redirect to `/login` if
 *   not authenticated (Section 8.1.2).
 */
export default function AppRoutes(): JSX.Element {
  return (
    <Suspense fallback={<PageSpinner />}>
      <Routes>
        <Route element={<RootLayout />}>
          {/* Truly public */}
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.SEARCH} element={<SearchPage />} />
          <Route path={ROUTES.RESTAURANTS} element={<RestaurantListingPage />} />
          <Route path={ROUTES.RESTAURANT_DETAIL} element={<RestaurantDetailPage />} />

          {/* Guest-only */}
          <Route element={<PublicRoutes />}>
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
            <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
          </Route>

          {/* JWT-guarded */}
          <Route element={<PrivateRoutes />}>
            <Route path={ROUTES.CART} element={<CartPage />} />
            <Route path={ROUTES.CHECKOUT} element={<CheckoutPage />} />
            <Route path={ROUTES.PAYMENT} element={<PaymentPage />} />
            <Route path={ROUTES.ORDERS} element={<OrdersListPage />} />
            <Route path={ROUTES.ORDER_DETAIL} element={<OrderDetailPage />} />
            <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
            <Route path={ROUTES.COUPONS} element={<CouponsPage />} />
            <Route path={ROUTES.RATE_ORDER} element={<RateOrderPage />} />
            <Route path={ROUTES.SUPPORT} element={<SupportPage />} />
            <Route path={ROUTES.SUPPORT_TICKET_DETAIL} element={<TicketDetailPage />} />
            <Route path={ROUTES.INVOICE_DETAIL} element={<InvoiceDetailPage />} />
          </Route>

          <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to={ROUTES.NOT_FOUND} replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
