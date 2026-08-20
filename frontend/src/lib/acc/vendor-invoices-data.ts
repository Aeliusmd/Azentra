import { MONTHS } from "@/lib/acc/dashboard-data";
import { CURRENT_PERIOD } from "@/lib/acc/periods";
import type { InvoiceStatus } from "@/lib/acc/resident-invoices-data";

/**
 * Invoices the property has received from its suppliers — the other side of
 * the ledger from the resident invoices.
 *
 * Same lifecycle as a resident invoice (raised, signed off, settled), but the
 * money flows out. The vendor payments the dashboard lists as upcoming are the
 * approved-but-unpaid rows here.
 */

export const VENDOR_CATEGORIES = [
  "Maintenance",
  "Utilities",
  "Cleaning",
  "Security",
  "Landscaping",
  "Insurance",
  "Administration",
] as const;
export type VendorCategory = (typeof VENDOR_CATEGORIES)[number];

/**
 * VAT on supplier invoices.
 *
 * Only the net figure is written down; the tax and the total are computed from
 * it. That is what keeps the three lines on an invoice adding up, and it is why
 * the expense ledger — which records the net — reconciles with the gross the
 * supplier is owed.
 */
export const VAT_RATE = 0.18;

export type VendorInvoice = {
  id: string;
  propertyId: string;
  vendor: string;
  category: VendorCategory;
  /** What was supplied — "Monthly Cleaning - August". */
  service: string;
  /** The job this was raised against, where there was one. */
  workOrder: string | null;
  /** `2026-08`, matching the billing-period ids. */
  period: string;
  /** ISO day the supplier issued it. */
  date: string;
  /** Net of tax — the figure the expense ledger carries. */
  amount: number;
  /** `amount * VAT_RATE`. */
  tax: number;
  /** `amount + tax` — what the supplier is owed. */
  total: number;
  /** ISO day the vendor expects payment. */
  dueDate: string;
  status: InvoiceStatus;
};

/* --------------------------------- Seeding -------------------------------- */

/**
 * `vendor, category, service, workOrder, netAmount, issuedDay, dueDay, status`.
 *
 * `{month}` and `{prev}` in the service are filled in from the period — a
 * utility invoice is raised this month for last month's supply, so both are
 * needed to relabel a row when the cycle changes.
 */
type Row = [
  string,
  VendorCategory,
  string,
  string | null,
  number,
  number,
  number,
  InvoiceStatus,
];

const OPEN_MONTH: Record<string, Row[]> = {
  sunrise: [
    ["ABC Plumbing", "Maintenance", "Emergency Pipe Repair", "WO-1045", 125_000, 10, 25, "Pending Approval"],
    ["CleanPro Services", "Cleaning", "Monthly Cleaning - {month}", "WO-1047", 250_000, 5, 20, "Approved"],
    ["ElevatorPro Ltd", "Maintenance", "Elevator Quarterly Maintenance", "WO-1050", 180_000, 8, 28, "Paid"],
    ["AquaClean Pool Services", "Maintenance", "Pool Maintenance - {month}", "WO-1052", 85_000, 12, 27, "Pending Approval"],
    ["GreenScape Ltd", "Landscaping", "Landscaping - {month}", "WO-1054", 120_000, 3, 18, "Paid"],
    ["SecureTech Solutions", "Security", "Security System Maintenance", "WO-1058", 95_000, 6, 22, "Approved"],
  ],
  "ocean-view": [
    ["AquaFlow Plumbing", "Maintenance", "Block 2 Pipe Replacement", "WO-2031", 157_627, 9, 20, "Approved"],
    ["CleanPro Services", "Cleaning", "Monthly Cleaning - {month}", "WO-2034", 178_000, 5, 18, "Paid"],
    // Metered supply, so there is no job behind it.
    ["National Power Co", "Utilities", "Tower 1 Electricity - {prev}", null, 207_627, 4, 15, "Paid"],
    ["GreenScape Ltd", "Landscaping", "Landscaping - {month}", "WO-2038", 83_051, 3, 18, "Approved"],
    ["SecureTech Solutions", "Security", "CCTV Maintenance", "WO-2042", 61_017, 7, 24, "Pending Approval"],
    ["City Water Board", "Utilities", "Water Utility Bill - {prev}", null, 115_254, 4, 16, "Paid"],
  ],
  "garden-heights": [
    ["SecureGuard Lanka", "Security", "Monthly Security Service", "WO-3018", 189_831, 6, 22, "Approved"],
    ["CleanPro Services", "Cleaning", "Monthly Cleaning - {month}", "WO-3021", 139_831, 5, 18, "Paid"],
    ["National Power Co", "Utilities", "North Wing Electricity - {prev}", null, 159_322, 4, 15, "Paid"],
    ["GreenScape Ltd", "Landscaping", "Landscaping - {month}", "WO-3024", 64_407, 3, 18, "Pending Approval"],
    ["ElevatorPro Ltd", "Maintenance", "Elevator Service Call", "WO-3027", 45_763, 11, 26, "Paid"],
  ],
};

/**
 * Where each property's vendor-invoice numbers start. Spaced 1000 apart, and
 * each closed month steps 200 within that, so no two can share a number.
 */
const ID_BLOCK: Record<string, number> = {
  sunrise: 2045,
  "ocean-view": 3045,
  "garden-heights": 4045,
};

const OPEN_MONTH_NUMBER = Number(CURRENT_PERIOD.split("-")[1]);

/** `2026-08` → `August`, and its predecessor `July`. */
function monthNames(period: string) {
  const month = Number(period.split("-")[1]);
  return {
    month: MONTHS[month - 1],
    // Wraps to December when the cycle is January.
    prev: MONTHS[(month + 10) % 12],
  };
}

/** A closed cycle has been paid off — a supplier does not wait a month. */
export function vendorInvoicesFor(
  propertyId: string,
  period: string,
): VendorInvoice[] {
  const rows = OPEN_MONTH[propertyId] ?? [];
  const back = OPEN_MONTH_NUMBER - Number(period.split("-")[1]);
  const base = (ID_BLOCK[propertyId] ?? 1) + back * 200;
  const { month, prev } = monthNames(period);

  return rows.map(
    (
      [
        vendor,
        category,
        service,
        workOrder,
        netAmount,
        issuedDay,
        dueDay,
        openStatus,
      ],
      index,
    ) => {
      // Supply costs drift between cycles; deterministic so history is stable.
      const amount =
        back === 0
          ? netAmount
          : Math.round(
              (netAmount + (((index * 71 + back * 113) % 20_001) - 10_000)) /
                1000,
            ) * 1000;
      const tax = Math.round(amount * VAT_RATE);

      return {
        id: `INV-${base + index}`,
        propertyId,
        vendor,
        category,
        service: service.replace("{month}", month).replace("{prev}", prev),
        workOrder,
        period,
        date: `${period}-${String(issuedDay).padStart(2, "0")}`,
        amount,
        tax,
        total: amount + tax,
        dueDate: `${period}-${String(dueDay).padStart(2, "0")}`,
        status: back === 0 ? openStatus : "Paid",
      };
    },
  );
}

/** Every seeded vendor invoice, across all properties and periods on file. */
export function seedVendorInvoices(periods: string[]): VendorInvoice[] {
  return Object.keys(OPEN_MONTH).flatMap((propertyId) =>
    periods.flatMap((period) => vendorInvoicesFor(propertyId, period)),
  );
}
