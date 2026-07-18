/**
 * crypto.randomUUID() is spec-restricted to secure contexts (HTTPS or localhost) — it's not
 * exposed at all over plain HTTP on a LAN IP, which this app's dev setup relies on so phones on
 * the same network can reach it. crypto.getRandomValues() has no such restriction, so fall back
 * to building an RFC 4122 v4 UUID from it when randomUUID isn't available.
 */
export function generateUuid(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0"));
  return `${hex.slice(0, 4).join("")}-${hex.slice(4, 6).join("")}-${hex.slice(6, 8).join("")}-${hex.slice(8, 10).join("")}-${hex.slice(10, 16).join("")}`;
}
