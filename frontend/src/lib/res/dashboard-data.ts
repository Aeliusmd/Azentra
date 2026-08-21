import {
  balanceOf,
  nextDueInvoice,
  residentInvoices,
  type ResidentInvoice,
} from "@/lib/res/bills-data";
import {
  facilityBookings,
  upcomingBookings,
  type FacilityBooking,
} from "@/lib/res/bookings-data";
import {
  maintenanceRequests,
  isOpenRequest,
  type MaintenanceRequest,
} from "@/lib/res/maintenance-data";
import { passesThisWeek, visitorPasses } from "@/lib/res/visitors-data";

/**
 * The resident's home screen, assembled from the records themselves.
 *
 * Every tile is a count or a total taken off the same lists the detail pages
 * read, so the dashboard cannot claim two open requests while the maintenance
 * page shows three.
 */

/** The day the portal treats as today, shared with the other role portals. */
export const TODAY = "2026-08-12";

/** How many rows each dashboard card shows before "View All" takes over. */
const PREVIEW = 2;

export type ResDashboard = {
  /** The next bill falling due — null once nothing is owed. */
  currentBill: ResidentInvoice | null;
  currentBillBalance: number;
  openRequests: MaintenanceRequest[];
  openRequestCount: number;
  upcoming: FacilityBooking[];
  upcomingBookingCount: number;
  visitorsThisWeek: number;
};

export function resDashboard(
  today: string = TODAY,
  /** Passed in from the store so the tile follows a bill just paid. */
  invoices: ResidentInvoice[] = residentInvoices,
  requests: MaintenanceRequest[] = maintenanceRequests,
  allBookings: FacilityBooking[] = facilityBookings,
): ResDashboard {
  const open = requests.filter(isOpenRequest);
  const bookings = upcomingBookings(today, allBookings);
  const bill = nextDueInvoice(today, invoices);

  return {
    currentBill: bill,
    currentBillBalance: bill ? balanceOf(bill) : 0,
    openRequests: open.slice(0, PREVIEW),
    openRequestCount: open.length,
    upcoming: bookings.slice(0, PREVIEW),
    upcomingBookingCount: bookings.length,
    visitorsThisWeek: passesThisWeek(today, visitorPasses).length,
  };
}
