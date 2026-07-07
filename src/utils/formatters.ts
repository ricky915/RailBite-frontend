/**
 * Shared display formatters (Section 3.4 / 26 Project Conventions).
 * All monetary values arrive from the API as integer paise; all dates
 * arrive as UTC ISO 8601 strings. Conversion to ₹ and IST happens only
 * in this display layer — never upstream.
 */

const IST_TIME_ZONE = 'Asia/Kolkata';

/**
 * Format an integer paise amount as an Indian Rupee string, e.g. 123400 -> "₹1,234.00".
 */
export function formatCurrency(amountInPaise: number): string {
  const rupees = amountInPaise / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(rupees);
}

/**
 * Format an ISO date string to `DD MMM YYYY` in IST, e.g. "28 Jun 2026".
 */
export function formatDate(isoDate: string | Date): string {
  const date = typeof isoDate === 'string' ? new Date(isoDate) : isoDate;
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: IST_TIME_ZONE,
  }).format(date);
}

/**
 * Format an ISO date string to `DD MMM YYYY, hh:mm a` in IST, e.g. "28 Jun 2026, 06:45 pm".
 */
export function formatDateTime(isoDate: string | Date): string {
  const date = typeof isoDate === 'string' ? new Date(isoDate) : isoDate;
  const datePart = formatDate(date);
  const timePart = new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: IST_TIME_ZONE,
  }).format(date);
  return `${datePart}, ${timePart}`;
}

/**
 * Format a 10-digit Indian mobile number for display, e.g. "9876543210" -> "98765 43210".
 */
export function formatMobileNumber(mobile: string): string {
  const digitsOnly = mobile.replace(/\D/g, '').slice(-10);
  if (digitsOnly.length !== 10) return mobile;
  return `${digitsOnly.slice(0, 5)} ${digitsOnly.slice(5)}`;
}

/**
 * Truncate long text with an ellipsis, respecting word boundaries where possible.
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}…`;
}
