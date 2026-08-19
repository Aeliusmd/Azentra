import { CURRENT_PERIOD } from "@/lib/acc/periods";
import type { ExpenseCategory } from "@/lib/acc/expenses-data";

/**
 * Standing costs the property pays on a schedule.
 *
 * These are the templates behind a good part of the expense ledger — the
 * cleaning contract here is the same 250,000 that lands as an expense each
 * month. Only the schedule is stored; the next payment date is worked out from
 * it, so it can never be left pointing at a date that has already gone.
 */

export const RECURRING_FREQUENCIES = [
  "Monthly",
  "Quarterly",
  "Annually",
] as const;
export type RecurringFrequency = (typeof RECURRING_FREQUENCIES)[number];

/** How many months each frequency advances the schedule. */
const FREQUENCY_MONTHS: Record<RecurringFrequency, number> = {
  Monthly: 1,
  Quarterly: 3,
  Annually: 12,
};

export const RECURRING_STATUSES = ["Active", "Paused"] as const;
export type RecurringStatus = (typeof RECURRING_STATUSES)[number];

export type RecurringExpense = {
  id: string;
  propertyId: string;
  name: string;
  category: ExpenseCategory;
  vendor: string;
  amount: number;
  frequency: RecurringFrequency;
  /** Day of the month it falls due. */
  dueDay: number;
  status: RecurringStatus;
};

/* --------------------------------- Seeding -------------------------------- */

/** `name, category, vendor, amount, frequency, dueDay, status`. */
type Row = [
  string,
  ExpenseCategory,
  string,
  number,
  RecurringFrequency,
  number,
  RecurringStatus,
];

const SCHEDULES: Record<string, Row[]> = {
  sunrise: [
    ["Security Service", "Security", "SecureTech Solutions", 95_000, "Monthly", 5, "Active"],
    ["Cleaning Contract", "Cleaning", "CleanPro Services", 250_000, "Monthly", 5, "Active"],
    ["Elevator Maintenance", "Maintenance", "ElevatorPro Ltd", 180_000, "Quarterly", 8, "Active"],
    ["Landscaping", "Landscaping", "GreenScape Ltd", 120_000, "Monthly", 3, "Active"],
    ["Pool Maintenance", "Maintenance", "AquaClean Pool Services", 85_000, "Monthly", 12, "Active"],
    ["Internet Service", "Utilities", "FiberNet Ltd", 45_000, "Monthly", 15, "Active"],
  ],
  "ocean-view": [
    ["Cleaning Contract", "Cleaning", "CleanPro Services", 178_000, "Monthly", 5, "Active"],
    ["Security Service", "Security", "SecureTech Solutions", 61_000, "Monthly", 7, "Active"],
    ["Landscaping", "Landscaping", "GreenScape Ltd", 83_000, "Monthly", 3, "Active"],
    ["Lift Servicing", "Maintenance", "ElevatorPro Ltd", 142_000, "Quarterly", 10, "Active"],
    ["Internet Service", "Utilities", "FiberNet Ltd", 38_000, "Monthly", 15, "Paused"],
  ],
  "garden-heights": [
    ["Security Service", "Security", "SecureGuard Lanka", 189_800, "Monthly", 6, "Active"],
    ["Cleaning Contract", "Cleaning", "CleanPro Services", 139_800, "Monthly", 5, "Active"],
    ["Landscaping", "Landscaping", "GreenScape Ltd", 64_400, "Monthly", 3, "Active"],
    ["Property Insurance", "Insurance", "SafeGuard Insurance", 245_000, "Quarterly", 1, "Active"],
  ],
};

/** Where each property's schedule numbers start. */
const ID_BLOCK: Record<string, number> = {
  sunrise: 1,
  "ocean-view": 21,
  "garden-heights": 41,
};

function pad(value: number) {
  return String(value).padStart(2, "0");
}

/**
 * When this schedule next takes money.
 *
 * The open cycle's payment has already gone out, so the answer is always the
 * following occurrence: next month for a monthly, the month after next quarter
 * for a quarterly. Clamped to the length of the target month, so a schedule due
 * on the 31st still lands on the 30th of a short one.
 */
export function nextPaymentDate(
  period: string,
  dueDay: number,
  frequency: RecurringFrequency,
) {
  const [year, month] = period.split("-").map(Number);
  const target = new Date(year, month - 1 + FREQUENCY_MONTHS[frequency], 1);

  const targetYear = target.getFullYear();
  const targetMonth = target.getMonth() + 1;
  const lastDay = new Date(targetYear, targetMonth, 0).getDate();

  return `${targetYear}-${pad(targetMonth)}-${pad(Math.min(dueDay, lastDay))}`;
}

/** `5` → `5th`, for the "Monthly · Due 5th" line. */
export function ordinalDay(day: number) {
  if (day % 100 >= 11 && day % 100 <= 13) return `${day}th`;
  if (day % 10 === 1) return `${day}st`;
  if (day % 10 === 2) return `${day}nd`;
  if (day % 10 === 3) return `${day}rd`;
  return `${day}th`;
}

export function seedRecurringExpenses(): RecurringExpense[] {
  return Object.entries(SCHEDULES).flatMap(([propertyId, rows]) =>
    rows.map(
      ([name, category, vendor, amount, frequency, dueDay, status], index) => ({
        id: `REC-${(ID_BLOCK[propertyId] ?? 1) + index}`,
        propertyId,
        name,
        category,
        vendor,
        amount,
        frequency,
        dueDay,
        status,
      }),
    ),
  );
}

/** The cycle the schedules are read against. */
export const RECURRING_PERIOD = CURRENT_PERIOD;
