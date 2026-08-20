import {
  UTILITY_RATES,
  UTILITY_TYPES,
  type UtilityType,
} from "@/lib/acc/utility-bills-data";

/**
 * The published tariffs, with the rate each one replaced.
 *
 * The current rate is read from `UTILITY_RATES` rather than written down again
 * — it is the same number every charge on every bill is worked out from, and a
 * rates page that could disagree with the billing would be worse than none.
 * Only the history is stored here.
 */

export type UtilityRate = {
  type: UtilityType;
  /** LKR per unit consumed, as charged today. */
  rate: number;
  /** ISO day this rate came into force. */
  effectiveFrom: string;
  /** What it charged before that date. */
  previousRate: number;
};

/** `effectiveFrom, previousRate` — the part that is not derivable. */
const HISTORY: Record<UtilityType, { effectiveFrom: string; previousRate: number }> = {
  Water: { effectiveFrom: "2026-08-01", previousRate: 22 },
  Electricity: { effectiveFrom: "2026-07-01", previousRate: 58 },
  Gas: { effectiveFrom: "2026-06-01", previousRate: 165 },
};

/**
 * Tariffs are set by the supplier, not the property, so this list is the same
 * whichever set of books is open.
 */
export function utilityRates(): UtilityRate[] {
  return UTILITY_TYPES.map((type) => ({
    type,
    rate: UTILITY_RATES[type],
    ...HISTORY[type],
  }));
}
