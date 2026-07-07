import { QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';

import App from '@/App';
import '@/index.css';
import { queryClient } from '@/lib/queryClient';
import { AuthProvider } from '@/providers/AuthProvider';
import { ToastProvider } from '@/providers/ToastProvider';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element (#root) not found in index.html');
}

/**
 * Vite entry point (Section 4.1 `main.tsx`). Provider tree order matches
 * Section 3.5.1 exactly:
 *   BrowserRouter -> QueryClientProvider -> AuthProvider -> ToastProvider -> App
 * `HelmetProvider` (Section 8.11 SEO) is added alongside `QueryClientProvider`
 * as another cross-cutting third-party provider — it isn't named in the
 * Section 3.5.1 diagram, but every page uses `<Helmet>` for meta tags.
 */
createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <AuthProvider>
            <ToastProvider>
              <App />
            </ToastProvider>
          </AuthProvider>
        </HelmetProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
);
