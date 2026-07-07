import type { ReactNode } from 'react';

import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';

export interface AppShellProps {
  children: ReactNode;
}

/**
 * Structural wrapper controlling the responsive page layout (Section 6.2 —
 * Layout components render a `children` slot and control responsive layout).
 */
export function AppShell({ children }: AppShellProps): JSX.Element {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main id="main-content" className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
        {children}
      </main>
      <Footer />
    </div>
  );
}
