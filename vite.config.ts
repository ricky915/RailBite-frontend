import path from 'path';

import react from '@vitejs/plugin-react';
// `vitest/config` re-exports Vite's `defineConfig` extended with the `test`
// option so a single config file can serve both Vite and Vitest.
import { defineConfig } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    // Must mirror the `paths` block in tsconfig.json (Section 25.4)
    alias: {
      '@/components': path.resolve(__dirname, './src/components'),
      '@/features': path.resolve(__dirname, './src/features'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/lib': path.resolve(__dirname, './src/lib'),
      '@/store': path.resolve(__dirname, './src/store'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/config': path.resolve(__dirname, './src/config'),
      '@/providers': path.resolve(__dirname, './src/providers'),
      '@/routes': path.resolve(__dirname, './src/routes'),
      '@/assets': path.resolve(__dirname, './src/assets'),
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    // Target ~< 200KB gzipped initial bundle (Section 20.1) via route-level
    // code splitting (React.lazy) plus vendor chunk separation.
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'query-vendor': ['@tanstack/react-query'],
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
  },
});
