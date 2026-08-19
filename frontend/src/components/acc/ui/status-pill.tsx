import type { ExpenseStatus } from "@/lib/acc/expenses-data";
import type { PaymentStatus } from "@/lib/acc/payments-data";
import type { RecurringStatus } from "@/lib/acc/recurring-expenses-data";
import type { InvoiceStatus } from "@/lib/acc/resident-invoices-data";
import type { ReadingStatus } from "@/lib/acc/utility-bills-data";
import type { BillStatus } from "@/lib/acc/unit-bills-data";

/**
 * Status badges for the accountant's lists.
 *
 * The accountant's own tone map rather than the shared `Pill`, because a bill
 * passes through three pre-issue states — Draft, Generated, Published — that
 * have to stay apart at a glance, and the shared palette only has one neutral.
 */
const TONES = {
  draft: "bg-gray-100 text-gray-600",
  steel: "bg-[#e7ebee] text-[#546472]",
  indigo: "bg-[#e8edf8] text-[#3b4d8f]",
  amber: "bg-[#fdf6dd] text-[#96751c]",
  gold: "bg-[#fdefda] text-[#a8701a]",
  green: "bg-green-50 text-green-700",
  red: "bg-rose-50 text-rose-600",
} as const;

export type StatusTone = keyof typeof TONES;

export function StatusPill({
  tone,
  children,
}: {
  tone: StatusTone;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap ${TONES[tone]}`}
    >
      {children}
    </span>
  );
}

const BILL_TONE: Record<BillStatus, StatusTone> = {
  Draft: "draft",
  Generated: "steel",
  Published: "indigo",
  Pending: "amber",
  "Partially Paid": "gold",
  Paid: "green",
  Overdue: "red",
};

export function BillStatusPill({ status }: { status: BillStatus }) {
  return <StatusPill tone={BILL_TONE[status]}>{status}</StatusPill>;
}

/** A reading is taken, checked, then charged — pending, verified, billed. */
const READING_TONE: Record<ReadingStatus, StatusTone> = {
  Pending: "amber",
  Verified: "green",
  Billed: "indigo",
};

export function ReadingStatusPill({ status }: { status: ReadingStatus }) {
  return <StatusPill tone={READING_TONE[status]}>{status}</StatusPill>;
}

/** An invoice is raised, signed off, then settled — or it runs past its date. */
const INVOICE_TONE: Record<InvoiceStatus, StatusTone> = {
  "Pending Approval": "gold",
  Approved: "indigo",
  Paid: "green",
  Overdue: "red",
};

export function InvoiceStatusPill({ status }: { status: InvoiceStatus }) {
  return <StatusPill tone={INVOICE_TONE[status]}>{status}</StatusPill>;
}

/** Money is logged, then confirmed to have arrived — or it never does. */
const PAYMENT_TONE: Record<PaymentStatus, StatusTone> = {
  Pending: "amber",
  Verified: "green",
  Failed: "red",
  Refunded: "steel",
};

export function PaymentStatusPill({ status }: { status: PaymentStatus }) {
  return <StatusPill tone={PAYMENT_TONE[status]}>{status}</StatusPill>;
}

/** A cost is logged, signed off, then settled. */
const EXPENSE_TONE: Record<ExpenseStatus, StatusTone> = {
  Pending: "amber",
  Approved: "indigo",
  Paid: "green",
};

export function ExpenseStatusPill({ status }: { status: ExpenseStatus }) {
  return <StatusPill tone={EXPENSE_TONE[status]}>{status}</StatusPill>;
}

/** A standing cost is either running or stopped. */
const RECURRING_TONE: Record<RecurringStatus, StatusTone> = {
  Active: "green",
  Paused: "steel",
};

export function RecurringStatusPill({ status }: { status: RecurringStatus }) {
  return <StatusPill tone={RECURRING_TONE[status]}>{status}</StatusPill>;
}
