/**
 * The units still waiting on a bill for the open cycle.
 *
 * A property of 320 units does not appear here in full — the rest have already
 * been billed and are on the Unit Bills page. This is the tail the accountant
 * closes the month with, which is why it is a short, tickable list.
 */

export type BillableUnit = {
  unit: string;
  /** Null when nobody is living there — a vacant unit still owes maintenance. */
  resident: string | null;
  maintenance: number;
  /** Metered water for the period; zero where there is nothing to read. */
  water: number;
  electricity: number;
  /** Anything the unit carried in from last cycle. */
  previousBalance: number;
  /** Every charge above, added up. */
  total: number;
};

/** `unit, resident, maintenance, water, electricity, previousBalance`. */
type Row = [string, string | null, number, number, number, number];

const PENDING: Record<string, Row[]> = {
  sunrise: [
    ["A-101", "Emily Watson", 15_000, 8_250, 44_200, 0],
    ["A-102", null, 15_000, 0, 0, 0],
    ["A-201", "Kevin Brown", 15_000, 6_500, 38_500, 3_200],
    ["A-202", "Maria Garcia", 15_000, 7_200, 41_200, 0],
    ["A-301", "James Lee", 15_000, 5_500, 35_800, 0],
    ["A-302", "Priya Patel", 15_000, 6_800, 40_100, 15_000],
  ],
  "ocean-view": [
    ["1-101", "Nimal Jayasuriya", 12_500, 5_900, 33_400, 0],
    ["1-102", null, 12_500, 0, 0, 0],
    ["2-204", "Shanika De Silva", 12_500, 6_300, 35_800, 4_100],
    ["2-205", "Rohan Wickrama", 12_500, 5_700, 31_900, 0],
  ],
  "garden-heights": [
    ["N-101", "Amara Bandara", 10_000, 4_800, 27_600, 0],
    ["N-204", "Sunil Rathnayake", 10_000, 5_100, 29_300, 2_400],
    ["S-102", null, 10_000, 0, 0, 0],
    ["S-205", "Kumari Silva", 10_000, 4_400, 26_100, 0],
    ["S-301", "Lasith Gomes", 10_000, 5_300, 30_500, 8_600],
  ],
};

/**
 * Units awaiting a bill for a property.
 *
 * The total is summed here rather than stored, so the row always adds up to
 * what its own columns say — the first thing anyone checks on a billing run.
 */
export function billableUnitsFor(propertyId: string): BillableUnit[] {
  return (PENDING[propertyId] ?? []).map(
    ([unit, resident, maintenance, water, electricity, previousBalance]) => ({
      unit,
      resident,
      maintenance,
      water,
      electricity,
      previousBalance,
      total: maintenance + water + electricity + previousBalance,
    }),
  );
}

/** `2026-08` → `2026-08-31`; a cycle falls due on the last day of its month. */
export function lastDayOf(period: string) {
  const [year, month] = period.split("-").map(Number);
  // Day 0 of the next month is the last day of this one.
  return `${period}-${new Date(year, month, 0).getDate()}`;
}
