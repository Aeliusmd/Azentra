import { CURRENT_PERIOD } from "@/lib/acc/periods";
import { unitBillId, type UnitBill } from "@/lib/acc/unit-bills-data";

/**
 * Money arriving against unit bills.
 *
 * A payment points at the bill it settles by its number, so the two sides
 * reconcile: a bill marked Partially Paid has a payment here smaller than its
 * total, and one marked Overdue has nothing cleared against it.
 */

export const PAYMENT_METHODS = [
  "Bank Transfer",
  "Card",
  "Cash",
  "Online",
] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

/** Chip order on the payment-history filter row. */
export const PAYMENT_METHOD_FILTERS = [
  "All",
  "Online",
  "Bank Transfer",
  "Cash",
  "Card",
] as const;

export const PAYMENT_STATUSES = [
  "Pending",
  "Verified",
  "Failed",
  "Refunded",
] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export type AccPayment = {
  id: string;
  propertyId: string;
  resident: string;
  unit: string;
  /** The bill this settles, by number. */
  bill: string;
  /** `2026-08`, matching the billing-period ids. */
  period: string;
  amount: number;
  method: PaymentMethod;
  /** ISO day the money landed. */
  date: string;
  /** Bank or gateway reference, blank on cash taken at the desk. */
  reference: string;
  status: PaymentStatus;
};

/* --------------------------------- Seeding -------------------------------- */

/**
 * `billIndex, resident, unit, amount, method, day, reference, status`.
 *
 * The bill is referenced by its position in the property's roster rather than
 * its printed number, so the same seed produces valid references in whichever
 * cycle it is built for.
 */
type Row = [
  number,
  string,
  string,
  number,
  PaymentMethod,
  number,
  string,
  PaymentStatus,
];

const OPEN_MONTH: Record<string, Row[]> = {
  sunrise: [
    [1, "Sarah Johnson", "B-205", 25_200, "Online", 5, "TXN-88231", "Verified"],
    [6, "David Lee", "C-102", 23_600, "Bank Transfer", 6, "TXN-88245", "Verified"],
    [9, "Tom Harris", "A-501", 25_700, "Card", 7, "TXN-88267", "Verified"],
    // Short of the 26,500 bill — which is why C-305 reads Partially Paid.
    [3, "Robert Taylor", "C-305", 15_000, "Bank Transfer", 8, "TXN-88301", "Verified"],
    // Not yet cleared, so A-101 is still Overdue against its 28,200.
    [2, "Emily Watson", "A-101", 20_000, "Cash", 10, "TXN-88322", "Pending"],
    [5, "Mike Peterson", "A-205", 23_300, "Online", 11, "TXN-88340", "Pending"],
    [4, "Lisa Chen", "B-302", 33_500, "Online", 12, "TXN-88355", "Pending"],
  ],
  "ocean-view": [
    [0, "Nadia Fernando", "1-304", 21_400, "Bank Transfer", 4, "TXN-77104", "Verified"],
    [1, "Ruwan Perera", "2-118", 19_850, "Online", 6, "TXN-77131", "Verified"],
    [2, "Ayesha Karim", "1-802", 22_300, "Card", 8, "TXN-77158", "Verified"],
    [5, "Dinesh Raj", "2-307", 18_900, "Online", 9, "TXN-77182", "Verified"],
    [7, "Arjun Mehta", "2-512", 8_700, "Cash", 10, "TXN-77205", "Verified"],
    [8, "Miriam Cohen", "1-609", 22_900, "Bank Transfer", 11, "TXN-77229", "Pending"],
  ],
  "garden-heights": [
    [0, "Mark Silva", "N-402", 18_700, "Online", 3, "TXN-66112", "Verified"],
    [1, "Dilani Weeraratne", "S-206", 17_250, "Cash", 5, "TXN-66140", "Verified"],
    [2, "James Okoro", "N-115", 20_100, "Bank Transfer", 7, "TXN-66167", "Verified"],
    [5, "Ahmed Farouk", "S-104", 16_800, "Online", 9, "TXN-66193", "Verified"],
    [7, "Ravi Shankar", "S-409", 7_300, "Card", 11, "TXN-66218", "Pending"],
  ],
};

/**
 * Where each property's payment numbers start. Spaced 100 apart, and each
 * closed month steps 300 within that, so no two payments share a number.
 */
const ID_BLOCK: Record<string, number> = {
  sunrise: 1,
  "ocean-view": 101,
  "garden-heights": 201,
};

const OPEN_MONTH_NUMBER = Number(CURRENT_PERIOD.split("-")[1]);

export function paymentsFor(
  propertyId: string,
  period: string,
): AccPayment[] {
  const rows = OPEN_MONTH[propertyId] ?? [];
  const back = OPEN_MONTH_NUMBER - Number(period.split("-")[1]);
  const base = (ID_BLOCK[propertyId] ?? 1) + back * 300;

  return rows.map(
    (
      [billIndex, resident, unit, amount, method, day, reference, status],
      index,
    ) => ({
      id: `PAY-${String(base + index).padStart(3, "0")}`,
      propertyId,
      resident,
      unit,
      bill: unitBillId(propertyId, period, billIndex),
      period,
      amount,
      method,
      date: `${period}-${String(day).padStart(2, "0")}`,
      // A closed cycle banked under its own reference series.
      reference: back === 0 ? reference : `${reference}-${back}`,
      // A closed cycle has been reconciled — nothing is left unverified.
      status: back === 0 ? status : "Verified",
    }),
  );
}

/** Every seeded payment, across all properties and every period on file. */
export function seedPayments(periods: string[]): AccPayment[] {
  return Object.keys(OPEN_MONTH).flatMap((propertyId) =>
    periods.flatMap((period) => paymentsFor(propertyId, period)),
  );
}

/* ------------------------------ Reconciliation ----------------------------- */

/**
 * What has actually cleared against a bill.
 *
 * Only verified payments count — money sitting unverified has not reached the
 * account, which is exactly why a bill can show an overdue balance while a
 * payment for it is already on the page. Bills from a cycle with no payment
 * records fall back to what their status implies.
 */
export function paidAgainstBill(bill: UnitBill, payments: AccPayment[]) {
  const cleared = payments
    .filter(
      (payment) => payment.bill === bill.id && payment.status === "Verified",
    )
    .reduce((sum, payment) => sum + payment.amount, 0);

  if (cleared > 0) return Math.min(cleared, bill.total);
  if (bill.status === "Paid") return bill.total;
  if (bill.status === "Partially Paid") return Math.round(bill.total * 0.4);
  return 0;
}

/**
 * The receipt issued for a payment.
 *
 * Numbered off the bill it settles rather than off the payment, so a resident
 * can match the receipt to the bill in front of them. A part payment is
 * suffixed `-P`: the bill is not closed by it, and more receipts will follow
 * against the same number.
 */
export function receiptNumberFor(payment: AccPayment, bills: UnitBill[]) {
  const [year] = payment.period.split("-");
  const tail = (payment.bill.split("-").pop() ?? "").slice(-4);
  const bill = bills.find((entry) => entry.id === payment.bill);
  const partial = bill !== undefined && payment.amount < bill.total;

  return `RCP-${year}-${tail}${partial ? "-P" : ""}`;
}

/**
 * Whether a receipt has actually been issued for a payment.
 *
 * Two things have to be true: the payment closes its bill — a part payment
 * leaves the bill open, so there is nothing to receipt yet — and the bill was
 * issued in the first place. A draft has not been sent to anyone, so money
 * against it cannot be receipted until it is.
 */
export function isReceipted(payment: AccPayment, bills: UnitBill[]) {
  const bill = bills.find((entry) => entry.id === payment.bill);
  if (!bill) return false;

  return payment.amount >= bill.total && bill.status !== "Draft";
}
