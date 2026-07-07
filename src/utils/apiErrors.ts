import { isAxiosError } from 'axios';

import type { ApiErrorEnvelope, ApiFieldError } from '@/types/api.types';

const GENERIC_ERROR_MESSAGE = 'Something went wrong. Please try again.';
const OFFLINE_ERROR_MESSAGE = 'You are offline. Please check your connection.';
const TIMEOUT_ERROR_MESSAGE = 'The request took too long. Please try again.';

/**
 * Extract a user-friendly message from an Axios error response (Section 3.4 / 18.2).
 * Falls back to a generic message when the response does not conform to the
 * standard error envelope (Section 10.6), or when there is no response at all
 * (network failure / timeout).
 */
export function parseApiError(error: unknown): string {
  if (!isAxiosError(error)) {
    return error instanceof Error ? error.message : GENERIC_ERROR_MESSAGE;
  }

  if (error.code === 'ECONNABORTED') {
    return TIMEOUT_ERROR_MESSAGE;
  }

  if (!error.response) {
    return OFFLINE_ERROR_MESSAGE;
  }

  const payload = error.response.data as ApiErrorEnvelope | undefined;
  if (payload?.message) {
    return payload.message;
  }

  return GENERIC_ERROR_MESSAGE;
}

/**
 * Extract field-level validation errors (Section 10.6 error envelope `errors[]`)
 * so they can be mapped onto React Hook Form via `setError()` (Section 18.2).
 */
export function parseApiFieldErrors(error: unknown): ApiFieldError[] {
  if (!isAxiosError(error) || !error.response) return [];
  const payload = error.response.data as ApiErrorEnvelope | undefined;
  return payload?.errors ?? [];
}

/** True when the error represents a 401 Unauthorized response. */
export function isUnauthorizedError(error: unknown): boolean {
  return isAxiosError(error) && error.response?.status === 401;
}

/** True when the error represents a 429 Too Many Requests response. */
export function isRateLimitedError(error: unknown): boolean {
  return isAxiosError(error) && error.response?.status === 429;
}

/** True when the error represents a 5xx server error. */
export function isServerError(error: unknown): boolean {
  return isAxiosError(error) && (error.response?.status ?? 0) >= 500;
}
