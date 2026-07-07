/**
 * Typed route path constants (Section 8.1.1). Never use hardcoded path
 * strings for navigation — always import `ROUTES` from here.
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  SEARCH: '/search',
  RESTAURANTS: '/restaurants',
  RESTAURANT_DETAIL: '/restaurants/:restaurantId',
  CART: '/cart',
  CHECKOUT: '/checkout',
  PAYMENT: '/payment',
  ORDERS: '/orders',
  ORDER_DETAIL: '/orders/:orderId',
  PROFILE: '/profile',
  COUPONS: '/coupons',
  RATE_ORDER: '/orders/:orderId/rate',
  SUPPORT: '/support',
  SUPPORT_TICKET_DETAIL: '/support/tickets/:ticketId',
  INVOICE_DETAIL: '/invoices/:orderId',
  NOT_FOUND: '/404',
} as const;

/** Builds a concrete path from a `:param` route by substituting real values. */
export function buildPath(route: string, params: Record<string, string>): string {
  return Object.entries(params).reduce(
    (path, [key, value]) => path.replace(`:${key}`, value),
    route,
  );
}
