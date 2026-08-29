import { daysBetween } from "@/lib/res/format";
import {
  balanceOf,
  isOutstanding,
  nextDueInvoice,
  paidInvoices,
  tenantInvoices,
  totalOutstanding,
  type TenantInvoice,
} from "@/lib/ten/bills-data";
import {
  tenBookings,
  upcomingBookings,
  type FacilityBooking,
} from "@/lib/ten/bookings-data";
import {
  isOpenRequest,
  tenMaintenanceRequests,
  type TenMaintenanceRequest,
} from "@/lib/ten/maintenance-data";
import {
  tenVisitorPasses,
  upcomingPasses,
  type VisitorPass,
} from "@/lib/ten/visitors-data";

/**
 * The tenant's home screen, assembled from the records themselves.
 *
 * Every tile is a count or a total taken off the same lists the detail pages
 * read, so the dashboard cannot claim two open requests while the maintenance
 * page shows three.
 */

/** The day the portal treats as today, shared with the other role portals. */
export const TODAY = "2026-08-12";

/** How many rows each dashboard card shows before "View all" takes over. */
const PREVIEW = 2;

/** How far ahead the agenda card looks. */
const WEEK = 7;

/**
 * One line on the agenda card. Bookings and visitor passes are different
 * records that a tenant reads as the same thing — something happening on a day.
 */
export type AgendaEvent = {
  id: string;
  kind: "Booking" | "Visitor";
  title: string;
  date: string;
  from: string;
  to: string;
};

export type TenDashboard = {
  /** The open bill falling due soonest — null once nothing is owed. */
  currentBill: TenantInvoice | null;
  currentBillBalance: number;
  outstandingCount: number;
  outstandingTotal: number;
  paidCount: number;

  openRequests: TenMaintenanceRequest[];
  openRequestCount: number;

  bookings: FacilityBooking[];
  bookingCount: number;

  passes: VisitorPass[];
  passCount: number;

  agenda: AgendaEvent[];
  agendaThisWeek: number;
};

function toAgenda(
  bookings: FacilityBooking[],
  passes: VisitorPass[],
): AgendaEvent[] {
  const fromBookings: AgendaEvent[] = bookings.map((booking) => ({
    id: booking.id,
    kind: "Booking",
    title: booking.facility,
    date: booking.date,
    from: booking.from,
    to: booking.to,
  }));

  const fromPasses: AgendaEvent[] = passes.map((pass) => ({
    id: pass.id,
    kind: "Visitor",
    title: pass.name,
    date: pass.date,
    from: pass.from,
    to: pass.to,
  }));

  return [...fromBookings, ...fromPasses].sort(
    (a, b) => a.date.localeCompare(b.date) || a.from.localeCompare(b.from),
  );
}

export function tenDashboard(
  today: string = TODAY,
  /** Passed in from the stores so a tile follows a bill just paid. */
  invoices: TenantInvoice[] = tenantInvoices,
  requests: TenMaintenanceRequest[] = tenMaintenanceRequests,
  bookings: FacilityBooking[] = tenBookings,
  passes: VisitorPass[] = tenVisitorPasses,
): TenDashboard {
  const open = requests.filter(isOpenRequest);
  const nextBookings = upcomingBookings(today, bookings);
  const nextPasses = upcomingPasses(today, passes);
  const bill = nextDueInvoice(invoices);
  const agenda = toAgenda(nextBookings, nextPasses);

  return {
    currentBill: bill,
    currentBillBalance: bill ? balanceOf(bill) : 0,
    outstandingCount: invoices.filter(isOutstanding).length,
    outstandingTotal: totalOutstanding(invoices),
    paidCount: paidInvoices(invoices).length,

    openRequests: open.slice(0, PREVIEW),
    openRequestCount: open.length,

    bookings: nextBookings.slice(0, PREVIEW),
    bookingCount: nextBookings.length,

    passes: nextPasses.slice(0, PREVIEW),
    passCount: nextPasses.length,

    agenda: agenda.slice(0, 4),
    agendaThisWeek: agenda.filter(
      (event) => daysBetween(today, event.date) <= WEEK,
    ).length,
  };
}
