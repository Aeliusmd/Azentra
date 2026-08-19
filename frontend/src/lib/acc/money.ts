/**
 * Money formatting for the Accountant portal.
 *
 * Every figure the accountant sees is Sri Lankan rupees, so the currency is
 * baked in rather than threaded through each call site. Two shapes are used:
 * exact amounts on rows a resident could dispute (a payment, an invoice line),
 * and thousands on the headline tiles, where the extra digits are noise.
 */

const GROUPED = new Intl.NumberFormat("en-US");

/** `25200` → `LKR 25,200` — for anything that must reconcile to the cent. */
export function lkr(amount: number) {
  return `LKR ${GROUPED.format(Math.round(amount))}`;
}

/** `12450` → `12,450` — meter readings and unit counts, which carry no currency. */
export function grouped(value: number) {
  return GROUPED.format(Math.round(value));
}

/**
 * `4250000` → `LKR 4250K` — the summary-tile form.
 *
 * Ungrouped on purpose: `LKR 4,250K` reads as two separators fighting over the
 * same number, and the tiles are for scale rather than reconciliation. Pass
 * `decimals` where whole thousands would round away the point of the figure —
 * an average payment of 23,757 is `LKR 23.8K`, not `LKR 24K`.
 */
export function lkrK(amount: number, decimals = 0) {
  return `LKR ${(amount / 1000).toFixed(decimals)}K`;
}

/**
 * `2997500` → `LKR 3.0M` — for totals where thousands stop being readable.
 *
 * A decimal by default: rounding 2,997,500 to a whole `LKR 3M` hides that it is
 * not actually three million.
 */
export function lkrM(amount: number, decimals = 1) {
  return `LKR ${(amount / 1_000_000).toFixed(decimals)}M`;
}

/** `4250000` → `4250K`, for chart axes that carry the currency in the title. */
export function shortK(amount: number) {
  return `${Math.round(amount / 1000)}K`;
}

/**
 * Collected against billed, as a whole percent. Guards the empty month — a
 * property with nothing billed has collected all of it, not none of it.
 */
export function collectionRate(collected: number, billed: number) {
  if (billed <= 0) return 100;
  return Math.round((collected / billed) * 100);
}
