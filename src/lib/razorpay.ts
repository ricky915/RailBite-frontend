/**
 * Razorpay Checkout SDK loader (Section 4.1 `lib/razorpay.ts`). Loads the
 * `checkout.js` script exactly once and exposes a typed constructor, used by
 * `features/payment` to open the Razorpay checkout modal (Section 11.8).
 */

const RAZORPAY_SCRIPT_SRC = 'https://checkout.razorpay.com/v1/checkout.js';

export interface RazorpayOptions {
  key: string;
  amount: number; // in paise
  currency: 'INR';
  name: string;
  description?: string;
  order_id: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  handler: (response: RazorpaySuccessResponse) => void;
  modal?: {
    ondismiss?: () => void;
  };
}

export interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface RazorpayInstance {
  open: () => void;
  on: (event: string, handler: (response: unknown) => void) => void;
}

type RazorpayConstructor = new (options: RazorpayOptions) => RazorpayInstance;

declare global {
  interface Window {
    Razorpay?: RazorpayConstructor;
  }
}

let scriptLoadPromise: Promise<boolean> | null = null;

/**
 * Injects the Razorpay checkout script if not already present. Safe to call
 * multiple times — subsequent calls reuse the same in-flight/resolved promise.
 */
export function loadRazorpayScript(): Promise<boolean> {
  if (typeof window === 'undefined') {
    return Promise.resolve(false);
  }

  if (window.Razorpay) {
    return Promise.resolve(true);
  }

  if (scriptLoadPromise) {
    return scriptLoadPromise;
  }

  scriptLoadPromise = new Promise((resolve) => {
    const existingScript = document.querySelector(`script[src="${RAZORPAY_SCRIPT_SRC}"]`);
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true));
      existingScript.addEventListener('error', () => resolve(false));
      return;
    }

    const script = document.createElement('script');
    script.src = RAZORPAY_SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

  return scriptLoadPromise;
}

/**
 * Loads the SDK (if needed) and opens the Razorpay checkout modal.
 * Throws if the script fails to load or the SDK is unavailable.
 */
export async function openRazorpayCheckout(options: RazorpayOptions): Promise<RazorpayInstance> {
  const loaded = await loadRazorpayScript();
  if (!loaded || !window.Razorpay) {
    throw new Error('Unable to load the Razorpay payment SDK. Please check your connection.');
  }

  const instance = new window.Razorpay(options);
  instance.open();
  return instance;
}
