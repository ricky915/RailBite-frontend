/**
 * Typed wrapper around `import.meta.env` (Section 4.1 `config/env.ts`).
 * No other module should read `import.meta.env` directly — this is the
 * single source of truth for environment configuration on the frontend,
 * mirroring the backend's `src/config/index.ts` pattern (Section 3.5.2).
 */

interface AppEnv {
  /** Base URL of the railbite-api backend, including /api/v1 */
  VITE_API_BASE_URL: string;
  /** Razorpay publishable Key ID (never the Key Secret) */
  VITE_RAZORPAY_KEY_ID: string;
  MODE: string;
  DEV: boolean;
  PROD: boolean;
}

function readEnv(): AppEnv {
  const raw = import.meta.env;

  const apiBaseUrl = raw.VITE_API_BASE_URL;
  const razorpayKeyId = raw.VITE_RAZORPAY_KEY_ID;

  if (!apiBaseUrl) {
    // Fail fast and loudly in development; do not silently fall back to an
    // undefined base URL that would produce confusing network errors later.
    // eslint-disable-next-line no-console
    console.warn('[env] VITE_API_BASE_URL is not set; falling back to /api/v1');
  }

  return {
    VITE_API_BASE_URL: apiBaseUrl || '/api/v1',
    VITE_RAZORPAY_KEY_ID: razorpayKeyId || '',
    MODE: raw.MODE,
    DEV: raw.DEV,
    PROD: raw.PROD,
  };
}

export const env = readEnv();
