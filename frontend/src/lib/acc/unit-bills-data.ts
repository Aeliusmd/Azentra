import { CURRENT_PERIOD } from "@/lib/acc/periods";

/**
 * The bill raised against a single unit for one billing period.
 *
 * A unit bill is the resident-facing total: maintenance, their metered
 * utilities and their share of the common charges, rolled into one document
 * that becomes an invoice once it is published.
 */

export const BILL_STATUSES = [
  "Draft",
  "Generated",
  "Published",
  "Pending",
  "Partially Paid",
  "Paid",
  "Overdue",
] as const;
export type BillStatus = (typeof BILL_STATUSES)[number];

/** Filter row order — "All" first, then the lifecycle in the order it runs. */
export const BILL_STATUS_FILTERS = ["All", ...BILL_STATUSES] as const;

export type UnitBill = {
  id: string;
  propertyId: string;
  unit: string;
  resident: string;
  /** `2026-08`, matching the billing-period ids. */
  period: string;
  total: number;
  /** ISO day payment is expected by. */
  dueDate: string;
  /** How many payment reminders have gone out for this bill. */
  reminders: number;
  /** ISO day the bill was raised — what the history is ordered by. */
  createdOn: string;
  status: BillStatus;
};

/* --------------------------------- Seeding -------------------------------- */

/**
 * `unit, resident, total, dueDay, reminders, status` — a bill as a table row.
 *
 * `dueDay` is clamped to the length of the month, so 31 means "the end of the
 * cycle" in a 30-day one.
 */
type Row = [string, string, number, number, number, BillStatus];

/**
 * The open month, written out per property. Amounts and residents line up with
 * the payments on the dashboard, so a bill marked Paid here is the same money
 * shown arriving there.
 */
const OPEN_MONTH: Record<string, Row[]> = {
  sunrise: [
    ["A-304", "John Perera", 29_300, 31, 0, "Pending"],
    ["B-205", "Sarah Johnson", 25_200, 31, 0, "Paid"],
    ["A-101", "Emily Watson", 28_200, 15, 1, "Overdue"],
    ["C-305", "Robert Taylor", 26_500, 15, 0, "Partially Paid"],
    ["B-302", "Lisa Chen", 33_500, 31, 0, "Draft"],
    ["A-205", "Mike Peterson", 23_300, 31, 0, "Published"],
    ["C-102", "David Lee", 23_600, 31, 0, "Paid"],
    ["A-602", "Nancy Green", 37_700, 31, 0, "Generated"],
    ["B-503", "Anna Martinez", 34_900, 10, 2, "Overdue"],
    ["A-501", "Tom Harris", 25_700, 31, 0, "Paid"],
  ],
  "ocean-view": [
    ["1-304", "Nadia Fernando", 21_400, 31, 0, "Paid"],
    ["2-118", "Ruwan Perera", 19_850, 31, 0, "Paid"],
    ["1-802", "Ayesha Karim", 22_300, 31, 0, "Paid"],
    ["2-205", "Chamath Silva", 20_600, 31, 0, "Pending"],
    ["1-410", "Fatima Noor", 23_100, 8, 2, "Overdue"],
    ["2-307", "Dinesh Raj", 18_900, 31, 0, "Paid"],
    ["1-105", "Helena Brandt", 24_500, 31, 0, "Published"],
    ["2-512", "Arjun Mehta", 21_700, 20, 1, "Partially Paid"],
    ["1-609", "Miriam Cohen", 22_900, 31, 0, "Paid"],
    ["2-401", "Tariq Aziz", 20_200, 31, 0, "Draft"],
    ["1-208", "Sana Iqbal", 19_400, 31, 0, "Paid"],
    ["2-114", "Leo Fernandes", 23_600, 31, 0, "Generated"],
  ],
  "garden-heights": [
    ["N-402", "Mark Silva", 18_700, 31, 0, "Paid"],
    ["S-206", "Dilani Weeraratne", 17_250, 31, 0, "Paid"],
    ["N-115", "James Okoro", 20_100, 31, 0, "Paid"],
    ["S-311", "Yuki Tanaka", 19_300, 31, 0, "Pending"],
    ["N-508", "Carla Mendez", 21_600, 9, 1, "Overdue"],
    ["S-104", "Ahmed Farouk", 16_800, 31, 0, "Paid"],
    ["N-207", "Beatrice Vogel", 22_400, 31, 0, "Published"],
    ["S-409", "Ravi Shankar", 18_200, 31, 0, "Partially Paid"],
    ["N-303", "Elena Petrova", 20_800, 31, 0, "Paid"],
    ["S-502", "Thomas Wright", 17_900, 31, 0, "Draft"],
  ],
};

/** Where each property's bill numbers start, so ids never collide. */
const ID_BLOCK: Record<string, number> = {
  sunrise: 821,
  "ocean-view": 901,
  "garden-heights": 951,
};

/** The due date for a bill, clamped so day 31 lands on a 30-day month's end. */
function dueDateOf(period: string, dueDay: number) {
  const [year, month] = period.split("-").map(Number);
  // Day 0 of the next month is the last day of this one.
  const lastDay = new Date(year, month, 0).getDate();
  const day = Math.min(dueDay, lastDay);
  return `${period}-${String(day).padStart(2, "0")}`;
}

/**
 * Bill numbers are unique across every property and month.
 *
 * The 200 is what guarantees it: the widest a single month spans is the gap
 * between the first and last property block plus that block's rows (951 − 821
 * + 22 = 152), so stepping a whole month by 200 can never walk into the
 * neighbouring month's numbers.
 */
export function unitBillId(
  propertyId: string,
  period: string,
  index: number,
) {
  const [year, month] = period.split("-").map(Number);
  const base = (ID_BLOCK[propertyId] ?? 800) - (8 - month) * 200;
  return `BIL-${year}-${String(base + index).padStart(5, "0")}`;
}

/**
 * A closed month has been through collections, so nearly every bill has
 * settled. The few that never did are what the overdue reports are built on.
 */
function closedStatus(index: number, count: number): BillStatus {
  if (index === count - 1) return "Overdue";
  if (index === count - 2) return "Partially Paid";
  return "Paid";
}

/**
 * Bills drift month to month with consumption. Derived rather than written out
 * so the closed months stay consistent without a copy of every row per month.
 */
function closedTotal(base: number, index: number, month: number) {
  const swing = ((index * 137 + month * 411) % 4001) - 2000;
  return Math.round((base + swing) / 100) * 100;
}

function buildPeriod(propertyId: string, period: string): UnitBill[] {
  const rows = OPEN_MONTH[propertyId] ?? [];
  const open = period === CURRENT_PERIOD;
  const month = Number(period.split("-")[1]);

  return rows.map(([unit, resident, total, dueDay, reminders, status], index) => {
    const finalStatus = open ? status : closedStatus(index, rows.length);

    return {
      id: unitBillId(propertyId, period, index),
      propertyId,
      unit,
      resident,
      period,
      total: open ? total : closedTotal(total, index, month),
      dueDate: dueDateOf(period, dueDay),
      reminders: open ? reminders : 0,
      // The cycle is raised in one run on the first of the month; a draft is
      // something the accountant added by hand a few days later.
      createdOn: `${period}-${finalStatus === "Draft" ? "05" : "01"}`,
      status: finalStatus,
    };
  });
}

/** Every seeded bill, across all properties and every period on file. */
export function seedUnitBills(periods: string[]): UnitBill[] {
  return Object.keys(OPEN_MONTH).flatMap((propertyId) =>
    periods.flatMap((period) => buildPeriod(propertyId, period)),
  );
}

/** Units on a property's roster — what the generate dialog offers. */
export function rosterFor(propertyId: string) {
  return (OPEN_MONTH[propertyId] ?? []).map(([unit, resident]) => ({
    unit,
    resident,
  }));
}

/* ------------------------------- Bill contents ----------------------------- */

export type BillLine = {
  label: string;
  amount: number;
};

/**
 * The charges behind a bill total.
 *
 * Split by fixed shares rather than stored per bill — the shape of a unit bill
 * is the same every month, only the size changes. The last line absorbs the
 * rounding so the parts always add back to the total exactly.
 */
const SHARES: { label: string; share: number }[] = [
  { label: "Maintenance Charge", share: 0.42 },
  { label: "Electricity (Submetered)", share: 0.24 },
  { label: "Water (Submetered)", share: 0.13 },
  { label: "Common Area Charge", share: 0.12 },
  { label: "Sinking Fund", share: 0.09 },
];

export function billLines(total: number): BillLine[] {
  let allocated = 0;

  return SHARES.map((entry, index) => {
    if (index === SHARES.length - 1) {
      return { label: entry.label, amount: total - allocated };
    }

    const amount = Math.round((total * entry.share) / 10) * 10;
    allocated += amount;
    return { label: entry.label, amount };
  });
}
