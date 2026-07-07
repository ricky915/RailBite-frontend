import { Link, NavLink } from 'react-router-dom';

import { ROUTES } from '@/routes/routePaths';
import { selectIsAuthenticated, useAuthStore } from '@/store/authStore';
import { selectCartItemCount, useCartStore } from '@/store/cartStore';
import { useUiStore } from '@/store/uiStore';
import { cn } from '@/utils/cn';

const NAV_LINKS = [
  { label: 'Search Train', to: ROUTES.SEARCH },
  { label: 'Restaurants', to: ROUTES.RESTAURANTS },
  { label: 'Orders', to: ROUTES.ORDERS },
];

/**
 * Primary site navbar (Section 4.1 `components/layout/`). Shows the cart
 * item count badge (Section 8.10 — aria-live for cart count updates) and
 * switches the auth CTA between "Login" and the user's name.
 */
export function Navbar(): JSX.Element {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const user = useAuthStore((state) => state.user);
  const cartItemCount = useCartStore(selectCartItemCount);
  const toggleMobileNav = useUiStore((state) => state.toggleMobileNav);

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to={ROUTES.HOME} className="text-lg font-bold text-brand-600">
          RailBite
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  'text-sm font-medium text-neutral-600 hover:text-neutral-900',
                  isActive && 'text-brand-600',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link to={ROUTES.CART} className="relative" aria-label={`Cart, ${cartItemCount} items`}>
            <span aria-hidden="true">🛒</span>
            {cartItemCount > 0 && (
              <span
                aria-live="polite"
                className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 px-1 text-xs font-semibold text-white"
              >
                {cartItemCount}
              </span>
            )}
          </Link>

          <Link
            to={isAuthenticated ? ROUTES.PROFILE : ROUTES.LOGIN}
            className="text-sm font-medium text-neutral-700 hover:text-neutral-900"
          >
            {isAuthenticated ? (user?.name ?? 'Profile') : 'Login'}
          </Link>

          <button
            type="button"
            onClick={() => toggleMobileNav()}
            aria-label="Toggle navigation menu"
            className="md:hidden"
          >
            ☰
          </button>
        </div>
      </div>
    </header>
  );
}
