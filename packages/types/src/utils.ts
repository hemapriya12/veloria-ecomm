/**
 * Shared utility functions used across client and seller apps.
 * Centralised here to avoid repeating the same logic in 10+ files.
 */

/** Convert a price in cents to a display string — "$12.99" */
export const formatPrice = (cents: number): string =>
  `$${(cents / 100).toFixed(2)}`;

/** Convert cents to a plain number — useful for arithmetic before display */
export const centsToFloat = (cents: number): number =>
  Math.round(cents) / 100;

/**
 * Pick the best image URL from a product's images map.
 * Priority: selected colour → "default" key → first available.
 */
export const getProductImage = (
  images: unknown,
  color?: string
): string => {
  const imgs = (images as Record<string, string>) ?? {};
  if (color && imgs[color]) return imgs[color]!;
  if (imgs["default"])      return imgs["default"]!;
  return Object.values(imgs)[0] ?? "";
};

/** Format a UTC ISO date string as a localised human-readable date */
export const formatDate = (iso: string, locale = "en-US"): string =>
  new Date(iso).toLocaleDateString(locale, {
    year:  "numeric",
    month: "long",
    day:   "numeric",
  });

/** Capitalise first letter of every word (for category slug → label) */
export const slugToLabel = (slug: string): string =>
  slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
