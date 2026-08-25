import type { BookingStatus } from "@/lib/res/bookings-data";
import type { InvoiceStatus } from "@/lib/res/bills-data";
import type { RequestStatus } from "@/lib/res/maintenance-data";
import type { VisitorStatus } from "@/lib/res/visitors-data";

/**
 * The resident portal's status badge.
 *
 * Rounded-full and quiet: a resident reads these to know where something stands,
 * not to triage a queue, so only genuine bad news (overdue, rejected) is red.
 */

const TONES = {
  blue: "bg-[#eef3f9] text-[#2e6cad]",
  green: "bg-green-50 text-green-700",
  amber: "bg-amber-50 text-amber-700",
  rose: "bg-rose-50 text-rose-700",
  slate: "bg-gray-100 text-gray-600",
} as const;

export type ResTone = keyof typeof TONES;

export function ResStatusPill({
  tone = "slate",
  children,
}: {
  tone?: ResTone;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[12px] font-medium whitespace-nowrap ${TONES[tone]}`}
    >
      {children}
    </span>
  );
}

const REQUEST_TONE: Record<RequestStatus, ResTone> = {
  Submitted: "slate",
  "Under Review": "slate",
  "Work Order Created": "blue",
  "Technician Assigned": "blue",
  Scheduled: "amber",
  "In Progress": "blue",
  "Awaiting Confirmation": "amber",
  Completed: "green",
  Closed: "slate",
};

export function RequestStatusPill({ status }: { status: RequestStatus }) {
  return <ResStatusPill tone={REQUEST_TONE[status]}>{status}</ResStatusPill>;
}

const BOOKING_TONE: Record<BookingStatus, ResTone> = {
  Pending: "amber",
  Confirmed: "green",
  Completed: "slate",
  Cancelled: "slate",
  Rejected: "rose",
};

export function BookingStatusPill({ status }: { status: BookingStatus }) {
  return <ResStatusPill tone={BOOKING_TONE[status]}>{status}</ResStatusPill>;
}

const INVOICE_TONE: Record<InvoiceStatus, ResTone> = {
  Pending: "amber",
  "Partially Paid": "blue",
  Paid: "green",
  Overdue: "rose",
};

export function InvoiceStatusPill({ status }: { status: InvoiceStatus }) {
  return <ResStatusPill tone={INVOICE_TONE[status]}>{status}</ResStatusPill>;
}

const VISITOR_TONE: Record<VisitorStatus, ResTone> = {
  Approved: "green",
  Pending: "amber",
  "Checked In": "green",
  "Checked Out": "slate",
  Expired: "slate",
  Cancelled: "slate",
};

export function VisitorStatusPill({ status }: { status: VisitorStatus }) {
  return <ResStatusPill tone={VISITOR_TONE[status]}>{status}</ResStatusPill>;
}
