import { CURRENT_PERIOD } from "@/lib/acc/periods";

/**
 * Metered utility charges, one row per unit per utility per month.
 *
 * Only the two meter readings are stored. Consumption and the charge are
 * computed from them and the tariff, so a reading corrected here cannot leave a
 * stale total behind — the arithmetic a resident would check is the arithmetic
 * the page does.
 */

export const UTILITY_TYPES = ["Water", "Electricity", "Gas"] as const;
export type UtilityType = (typeof UTILITY_TYPES)[number];

/** Filter row order — "All" first, then one chip per utility. */
export const UTILITY_FILTERS = ["All", ...UTILITY_TYPES] as const;

/** Tariff in LKR per unit consumed, as published for the current period. */
export const UTILITY_RATES: Record<UtilityType, number> = {
  Water: 25,
  Electricity: 65,
  Gas: 180,
};

export const READING_STATUSES = ["Pending", "Verified", "Billed"] as const;
export type ReadingStatus = (typeof READING_STATUSES)[number];

export type UtilityReading = {
  id: string;
  propertyId: string;
  unit: string;
  type: UtilityType;
  /** `2026-08`, matching the billing-period ids. */
  period: string;
  previous: number;
  current: number;
  /** `current - previous`. */
  consumption: number;
  rate: number;
  /** `consumption * rate`. */
  charge: number;
  status: ReadingStatus;
};

/* --------------------------------- Seeding -------------------------------- */

/** `unit, utility, previous, current, status` — a reading as a table row. */
type Row = [string, UtilityType, number, number, ReadingStatus];

/**
 * The open month, per property, grouped by unit the way the meter reader walks
 * the building. Units line up with the unit-bill roster, so a resident billed
 * there has readings here.
 */
const OPEN_MONTH: Record<string, Row[]> = {
  sunrise: [
    ["A-101", "Water", 12_450, 12_780, "Verified"],
    ["A-101", "Electricity", 45_200, 45_880, "Verified"],
    ["B-205", "Water", 8_900, 9_180, "Verified"],
    ["B-205", "Electricity", 38_100, 38_720, "Verified"],
    ["B-205", "Gas", 5_200, 5_380, "Verified"],
    ["A-304", "Water", 11_200, 11_480, "Pending"],
    ["A-304", "Electricity", 41_000, 41_650, "Pending"],
    ["C-305", "Water", 7_800, 8_050, "Pending"],
    ["C-305", "Electricity", 36_400, 37_010, "Pending"],
    ["B-302", "Water", 10_300, 10_590, "Verified"],
    ["B-302", "Electricity", 43_800, 44_520, "Verified"],
    ["B-302", "Gas", 4_700, 4_860, "Verified"],
    ["A-205", "Water", 9_600, 9_870, "Verified"],
    ["A-205", "Electricity", 39_500, 40_100, "Verified"],
    ["C-102", "Water", 8_100, 8_360, "Billed"],
    ["C-102", "Electricity", 37_200, 37_810, "Billed"],
    ["A-501", "Water", 10_800, 11_070, "Billed"],
    ["A-501", "Electricity", 42_300, 42_950, "Billed"],
  ],
  "ocean-view": [
    ["1-304", "Water", 9_400, 9_660, "Verified"],
    ["1-304", "Electricity", 34_200, 34_790, "Verified"],
    ["2-118", "Water", 7_600, 7_840, "Verified"],
    ["2-118", "Electricity", 31_500, 32_040, "Verified"],
    ["1-802", "Water", 10_100, 10_390, "Verified"],
    ["1-802", "Electricity", 36_800, 37_430, "Verified"],
    ["2-205", "Water", 8_300, 8_550, "Pending"],
    ["2-205", "Electricity", 33_100, 33_690, "Pending"],
    ["1-410", "Water", 9_900, 10_180, "Pending"],
    ["1-410", "Gas", 4_100, 4_250, "Pending"],
    ["2-307", "Water", 7_200, 7_430, "Billed"],
    ["2-307", "Electricity", 30_400, 30_960, "Billed"],
  ],
  "garden-heights": [
    ["N-402", "Water", 6_800, 7_020, "Verified"],
    ["N-402", "Electricity", 28_400, 28_920, "Verified"],
    ["S-206", "Water", 5_900, 6_110, "Verified"],
    ["S-206", "Electricity", 26_100, 26_580, "Verified"],
    ["N-115", "Water", 7_300, 7_540, "Verified"],
    ["N-115", "Electricity", 29_700, 30_250, "Verified"],
    ["S-311", "Water", 6_200, 6_430, "Pending"],
    ["S-311", "Electricity", 27_300, 27_810, "Pending"],
    ["N-508", "Water", 6_600, 6_850, "Pending"],
    ["N-508", "Gas", 3_800, 3_940, "Pending"],
  ],
};

const OPEN_MONTH_NUMBER = Number(CURRENT_PERIOD.split("-")[1]);

/**
 * How much the meter moved in a closed month. Varies around the open month's
 * consumption so the history is not a flat line, but stays deterministic.
 */
function step(consumption: number, index: number, back: number) {
  return consumption + (((index * 37 + back * 53) % 61) - 30);
}

/**
 * Walks a meter backwards to an earlier month.
 *
 * A meter only ever counts up, so last month's *current* reading is this
 * month's *previous* one. Stepping back that way keeps every month on file
 * continuous with its neighbours instead of inventing unrelated numbers.
 */
function readingsAt(row: Row, index: number, back: number) {
  const [, , openPrevious, openCurrent] = row;
  const consumption = openCurrent - openPrevious;

  let previous = openPrevious;
  let current = openCurrent;

  for (let k = 0; k < back; k++) {
    current = previous;
    previous = current - step(consumption, index, k);
  }

  return { previous, current };
}

function build(propertyId: string, period: string): UtilityReading[] {
  const rows = OPEN_MONTH[propertyId] ?? [];
  const back = OPEN_MONTH_NUMBER - Number(period.split("-")[1]);

  return rows.map((row, index) => {
    const [unit, type, , , openStatus] = row;
    const { previous, current } = readingsAt(row, index, back);
    const consumption = current - previous;
    const rate = UTILITY_RATES[type];

    return {
      id: `${propertyId}-${period}-${unit}-${type}`,
      propertyId,
      unit,
      type,
      period,
      previous,
      current,
      consumption,
      rate,
      charge: consumption * rate,
      // A closed month has already been invoiced.
      status: back === 0 ? openStatus : "Billed",
    };
  });
}

/** Every metered reading for one property in one billing period. */
export function utilityReadingsFor(propertyId: string, period: string) {
  return build(propertyId, period);
}
