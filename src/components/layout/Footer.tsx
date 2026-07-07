import { Link } from 'react-router-dom';

import { ROUTES } from '@/routes/routePaths';

/**
 * Site footer (Section 4.1 `components/layout/`).
 */
export function Footer(): JSX.Element {
  return (
    <footer className="border-t border-neutral-200 bg-white py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 text-sm text-neutral-500">
        <nav aria-label="Footer" className="flex gap-4">
          <Link to={ROUTES.SUPPORT} className="hover:text-neutral-900">
            Support
          </Link>
          <a href="/terms" className="hover:text-neutral-900">
            Terms
          </a>
          <a href="/privacy" className="hover:text-neutral-900">
            Privacy Policy
          </a>
        </nav>
        <p>&copy; {new Date().getFullYear()} RailBite. All rights reserved.</p>
      </div>
    </footer>
  );
}
