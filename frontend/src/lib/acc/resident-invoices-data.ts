import { CURRENT_PERIOD, periodLabel } from "@/lib/acc/periods";

/**
 * Invoices raised against residents for services — the maintenance fee and
 * anything billed alongside it.
 *
 * Separate records from the unit bills: a bill is what a unit consumed, an
 * invoice is what the resident is being asked to approve and pay. They overlap
 * in amount where the invoice is nothing but the maintenance fee.
 */

export const INVOICE_STATUSES = [
  "Pending Approval",
  "Approved",
  "Paid",
  "Overdue",
] as const;
export type InvoiceStatus = (typeof INVOICE_STATUSES)[number];

export type ResidentInvoice = {
  id: string;
  propertyId: string;
  unit: string;
  resident: string;
  /** What is being billed — "August Maintenance Fee". */
  service: string;
  /** `2026-08`, matching the billing-period ids. */
  period: string;
  total: number;
  /** ISO day payment is expected by. */
  dueDate: string;
  status: InvoiceStatus;
};

/* --------------------------------- Seeding -------------------------------- */

/**
 * `unit, resident, service, total, status`.
 *
 * `{month}` in the service is filled in from the period, so switching cycles
 * relabels the line rather than leaving August on a July invoice.
 */
type Row = [string, string, string, number, InvoiceStatus];

const OPEN_MONTH: Record<string, Row[]> = {
  sunrise: [
    ["A-304", "John Perera", "{month} Maintenance Fee", 27_800, "Pending Approval"],
    ["A-602", "Nancy Green", "{month} Maintenance Fee + Penthouse", 32_700, "Approved"],
    ["B-205", "Sarah Johnson", "{month} Maintenance Fee", 25_200, "Paid"],
  ],
  "ocean-view": [
    ["1-304", "Nadia Fernando", "{month} Maintenance Fee", 21_400, "Paid"],
    ["2-118", "Ruwan Perera", "{month} Maintenance Fee", 19_850, "Paid"],
    ["1-802", "Ayesha Karim", "{month} Maintenance Fee + Parking", 24_600, "Approved"],
    ["2-205", "Chamath Silva", "{month} Maintenance Fee", 20_600, "Pending Approval"],
    ["1-410", "Fatima Noor", "{month} Maintenance Fee", 23_100, "Pending Approval"],
    ["2-307", "Dinesh Raj", "{month} Maintenance Fee", 18_900, "Paid"],
    ["1-105", "Helena Brandt", "Gym Membership - {month}", 8_500, "Approved"],
    ["2-512", "Arjun Mehta", "{month} Maintenance Fee", 21_700, "Approved"],
  ],
  "garden-heights": [
    ["N-402", "Mark Silva", "{month} Maintenance Fee", 18_700, "Paid"],
    ["S-206", "Dilani Weeraratne", "{month} Maintenance Fee", 17_250, "Paid"],
    ["N-115", "James Okoro", "{month} Maintenance Fee + Parking", 22_400, "Approved"],
    ["S-311", "Yuki Tanaka", "{month} Maintenance Fee", 19_300, "Pending Approval"],
    ["N-508", "Carla Mendez", "{month} Maintenance Fee", 21_600, "Pending Approval"],
    ["S-104", "Ahmed Farouk", "{month} Maintenance Fee", 16_800, "Paid"],
    ["N-207", "Beatrice Vogel", "Function Hall Booking - {month}", 15_200, "Approved"],
  ],
};

/**
 * Where each property's invoice numbers start. Spaced 1000 apart, and each
 * closed month steps 200 within that, so no two invoices can share a number.
 */
const ID_BLOCK: Record<string, number> = {
  sunrise: 1,
  "ocean-view": 1001,
  "garden-heights": 2001,
};

const OPEN_MONTH_NUMBER = Number(CURRENT_PERIOD.split("-")[1]);

/** `2026-08` → `2026-08-31`; invoices fall due on the last day of the cycle. */
function lastDayOf(period: string) {
  const [year, month] = period.split("-").map(Number);
  return `${period}-${new Date(year, month, 0).getDate()}`;
}

/** `2026-08` → `August`, for the service line. */
function monthName(period: string) {
  return periodLabel(period).split(" ")[0];
}

/**
 * A closed cycle has been collected on, so nearly everything has settled. The
 * one that never did is what the overdue reports are built from.
 */
function closedStatus(index: number, count: number): InvoiceStatus {
  return index === count - 1 ? "Overdue" : "Paid";
}

export function residentInvoicesFor(
  propertyId: string,
  period: string,
): ResidentInvoice[] {
  const rows = OPEN_MONTH[propertyId] ?? [];
  const back = OPEN_MONTH_NUMBER - Number(period.split("-")[1]);
  const base = (ID_BLOCK[propertyId] ?? 1) + back * 200;
  const dueDate = lastDayOf(period);
  const month = monthName(period);

  return rows.map(([unit, resident, service, total, openStatus], index) => ({
    id: `INV-R-${String(base + index).padStart(3, "0")}`,
    propertyId,
    unit,
    resident,
    service: service.replace("{month}", month),
    period,
    // Fees drift a little between cycles; deterministic so history is stable.
    total:
      back === 0
        ? total
        : Math.round((total + (((index * 91 + back * 47) % 1601) - 800)) / 100) *
          100,
    dueDate,
    status: back === 0 ? openStatus : closedStatus(index, rows.length),
  }));
}
