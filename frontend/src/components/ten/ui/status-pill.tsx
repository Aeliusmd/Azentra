import type { InvoiceStatus } from "@/lib/ten/bills-data";
import type { BookingStatus } from "@/lib/ten/bookings-data";
import type { RequestStatus } from "@/lib/ten/maintenance-data";
import type { VisitorStatus } from "@/lib/ten/visitors-data";

/**
 * The tenant portal's status badge.
 *
 * Rounded-full and quiet: a tenant reads these to know where something stands,
 * not to triage a queue, so only genuine bad news — overdue, rejected — is red.
 */

const TONES = {
  blue: "bg-[#eef3f9] text-[#2e6cad]",
  green: "bg-green-50 text-green-700",
  amber: "bg-amber-50 text-amber-700",
  rose: "bg-rose-50 text-rose-700",
  slate: "bg-gray-100 text-gray-600",
} as const;

export type TenTone = keyof typeof TONES;

export function TenStatusPill({
  tone = "slate",
  children,
}: {
  tone?: TenTone;
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

const REQUEST_TONE: Record<RequestStatus, TenTone> = {
  Submitted: "slate",
  "Under Review": "slate",
  "Work Order Created": "blue",
  "Technician Assigned": "amber",
  "In Progress": "blue",
  Completed: "green",
  Closed: "slate",
};

export function RequestStatusPill({ status }: { status: RequestStatus }) {
  return <TenStatusPill tone={REQUEST_TONE[status]}>{status}</TenStatusPill>;
}

const BOOKING_TONE: Record<BookingStatus, TenTone> = {
  Pending: "amber",
  Confirmed: "green",
  Completed: "slate",
  Cancelled: "slate",
  Rejected: "rose",
};

export function BookingStatusPill({ status }: { status: BookingStatus }) {
  return <TenStatusPill tone={BOOKING_TONE[status]}>{status}</TenStatusPill>;
}

const INVOICE_TONE: Record<InvoiceStatus, TenTone> = {
  Unpaid: "amber",
  "Partially Paid": "blue",
  Paid: "green",
  Overdue: "rose",
};

export function InvoiceStatusPill({ status }: { status: InvoiceStatus }) {
  return <TenStatusPill tone={INVOICE_TONE[status]}>{status}</TenStatusPill>;
}

const VISITOR_TONE: Record<VisitorStatus, TenTone> = {
  Upcoming: "blue",
  Active: "green",
  "Checked In": "green",
  "Checked Out": "slate",
  Expired: "slate",
  Cancelled: "slate",
};

export function VisitorStatusPill({ status }: { status: VisitorStatus }) {
  return <TenStatusPill tone={VISITOR_TONE[status]}>{status}</TenStatusPill>;
}
