"use client";

import Link from "next/link";
import {
  Building2,
  CalendarDays,
  CircleAlert,
  CreditCard,
  FileText,
  House,
  Receipt,
  UserRoundPlus,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import {
  RequestStatusPill,
  TenStatusPill,
} from "@/components/ten/ui/status-pill";
import { lkr, longDate, shortDate, timeRange } from "@/lib/res/format";
import { periodLabel } from "@/lib/ten/bills-data";
import { useTenInvoices } from "@/lib/ten/bills-store";
import { useTenBookings } from "@/lib/ten/bookings-store";
import { useTenVisitors } from "@/lib/ten/visitors-store";
import { tenDashboard, TODAY, type AgendaEvent } from "@/lib/ten/dashboard-data";
import {
  PRIORITY_DOT,
  requestProgress,
  type TenMaintenanceRequest,
} from "@/lib/ten/maintenance-data";
import { useTenRequests } from "@/lib/ten/maintenance-store";
import { TEN_BASE } from "@/lib/ten/nav";
import {
  tenUnreadCount,
  useTenNotifications,
} from "@/lib/ten/notifications-store";
import { useTenProfile } from "@/lib/ten/profile-store";
import {
  daysLeftOnLease,
  lease,
  leaseProgress,
  propertyManager,
  tenantUnit,
  unitLine,
} from "@/lib/ten/tenant";

const TILE = "flex shrink-0 items-center justify-center rounded-lg";

/* --------------------------------- Pieces --------------------------------- */

function QuickAction({
  label,
  href,
  icon: Icon,
  chip,
}: {
  label: string;
  href: string;
  icon: LucideIcon;
  chip: string;
}) {
  return (
    <Card className="transition-colors hover:bg-gray-50/70">
      <Link
        href={href}
        className="flex h-full flex-col items-center justify-center gap-2.5 px-3 py-5 text-center focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
      >
        <span aria-hidden="true" className={`${TILE} h-10 w-10 ${chip}`}>
          <Icon className="h-[18px] w-[18px]" />
        </span>
        <span className="text-[13px] leading-tight font-medium text-ink">
          {label}
        </span>
      </Link>
    </Card>
  );
}

const QUICK_ACTIONS: {
  label: string;
  href: string;
  icon: LucideIcon;
  chip: string;
}[] = [
  {
    label: "Report Maintenance",
    href: `${TEN_BASE}/maintenance`,
    icon: Wrench,
    chip: "bg-orange-50 text-orange-500",
  },
  {
    label: "Pay Bill",
    href: `${TEN_BASE}/bills`,
    icon: CreditCard,
    chip: "bg-green-50 text-green-600",
  },
  {
    label: "Book Facility",
    href: `${TEN_BASE}/facilities`,
    icon: Building2,
    chip: "bg-[#eef3f9] text-[#2e6cad]",
  },
  {
    label: "Register Visitor",
    href: `${TEN_BASE}/visitors`,
    icon: UserRoundPlus,
    chip: "bg-violet-50 text-violet-600",
  },
  {
    label: "Submit Complaint",
    href: `${TEN_BASE}/complaints`,
    icon: CircleAlert,
    chip: "bg-rose-50 text-rose-500",
  },
  {
    label: "View Documents",
    href: `${TEN_BASE}/documents`,
    icon: FileText,
    chip: "bg-[#eef3f9] text-[#5b7f9c]",
  },
];

function CardHeading({
  title,
  caption,
  icon: Icon,
  chip = "bg-[#eef3f9] text-[#5b7f9c]",
  badge,
}: {
  title: string;
  caption?: string;
  icon?: LucideIcon;
  chip?: string;
  badge?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3 px-4 py-4 sm:px-5">
      <div className="flex min-w-0 items-center gap-3">
        {Icon && (
          <span aria-hidden="true" className={`${TILE} h-9 w-9 ${chip}`}>
            <Icon className="h-[18px] w-[18px]" />
          </span>
        )}
        <div className="min-w-0">
          <h2 className="text-[15px] font-bold text-ink">{title}</h2>
          {caption && (
            <p className="mt-0.5 truncate text-[13px] text-muted">{caption}</p>
          )}
        </div>
      </div>
      {badge}
    </div>
  );
}

function CardFooterLink({ href, label }: { href: string; label: string }) {
  return (
    <div className="border-t border-hairline px-4 py-3.5 text-center sm:px-5">
      <Link
        href={href}
        className="text-[13px] font-medium text-link transition-colors hover:text-link-dark focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
      >
        {label} →
      </Link>
    </div>
  );
}

/** A label/value pair, the form every read-only property record is shown in. */
function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="shrink-0 text-[13px] text-muted">{label}</dt>
      <dd className="truncate text-right text-[13px] font-semibold text-ink">
        {value}
      </dd>
    </div>
  );
}

function RequestRow({ request }: { request: TenMaintenanceRequest }) {
  const progress = requestProgress(request.status);

  return (
    <li>
      <Link
        href={`${TEN_BASE}/maintenance`}
        className="block px-4 py-3.5 transition-colors hover:bg-gray-50/70 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none sm:px-5"
      >
        <div className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${PRIORITY_DOT[request.priority]}`}
          />

          <div className="min-w-0 flex-1">
            <p className="truncate text-[14px] font-semibold text-ink">
              {request.category}
            </p>
            <p className="mt-0.5 text-[12px] text-muted">{request.id}</p>
          </div>

          <RequestStatusPill status={request.status} />
        </div>

        {/* Only work actually underway has a bar worth reading. */}
        {request.status === "In Progress" && (
          <div className="mt-3 flex items-center gap-3">
            <div
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${request.id} progress`}
              className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100"
            >
              <div
                className="h-full rounded-full bg-[#1b3a5c]"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-[12px] text-muted">{progress}%</span>
          </div>
        )}
      </Link>
    </li>
  );
}

function AgendaRow({ event }: { event: AgendaEvent }) {
  const Icon = event.kind === "Booking" ? Building2 : UserRoundPlus;
  const chip =
    event.kind === "Booking"
      ? "bg-[#eef3f9] text-[#2e6cad]"
      : "bg-violet-50 text-violet-600";

  return (
    <li className="flex items-center gap-3 px-4 py-3 sm:px-5">
      <span aria-hidden="true" className={`${TILE} h-9 w-9 ${chip}`}>
        <Icon className="h-[18px] w-[18px]" />
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[14px] font-semibold text-ink">
          {event.title}
        </p>
        <p className="mt-0.5 text-[12px] text-muted">
          {longDate(event.date)} · {timeRange(event.from, event.to)}
        </p>
      </div>
    </li>
  );
}

function Stat({
  value,
  label,
  href,
}: {
  value: string;
  label: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-lg px-2 py-3 text-center transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
    >
      <p className="text-[22px] leading-none font-bold text-ink">{value}</p>
      <p className="mt-1.5 text-[12px] text-muted">{label}</p>
    </Link>
  );
}

/* ---------------------------------- View ---------------------------------- */

/**
 * The tenant's home screen.
 *
 * Everything a tenant does in a week, on one page: what they owe, what is being
 * fixed, who is coming round and what the property has announced. Every figure
 * is counted off the same records the detail pages read, so nothing here can
 * disagree with the page it links to.
 *
 * Nothing on this page reaches beyond the tenancy — no other unit, no owner
 * ledger, no work-order controls. The lease panel is the property's record and
 * is read-only by design.
 */
export function TenDashboardView() {
  const profile = useTenProfile();
  const notifications = useTenNotifications();
  // Read through the store so a request raised on the maintenance screen is
  // counted here too, rather than the two pages disagreeing until a reload.
  const requests = useTenRequests();
  const invoices = useTenInvoices();
  const bookings = useTenBookings();
  const visitors = useTenVisitors();
  const data = tenDashboard(TODAY, invoices, requests, bookings, visitors);

  const unread = tenUnreadCount(notifications);
  const progress = leaseProgress(TODAY);
  const daysLeft = daysLeftOnLease(TODAY);

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* -------------------------------- Header ------------------------- */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-[24px] leading-tight font-bold text-ink sm:text-[28px]">
            Welcome back, {profile.firstName}
          </h1>
          <p className="mt-1 text-[14px] text-muted">{unitLine()}</p>
        </div>

        <span className="shrink-0 rounded-full bg-amber-50 px-3 py-1 text-[12px] font-semibold text-amber-700">
          Tenant
        </span>
      </div>

      {/* ----------------------------- Quick actions --------------------- */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
        {QUICK_ACTIONS.map((action) => (
          <QuickAction key={action.href} {...action} />
        ))}
      </div>

      {/* -------------------------------- Body --------------------------- */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* ---- Column one: the unit and what it owes ---- */}
        <div className="space-y-5">
          <Card>
            <CardHeading
              title="My Apartment"
              caption={tenantUnit.property}
              icon={House}
            />

            <dl className="space-y-2.5 border-t border-hairline px-4 py-4 sm:px-5">
              <DetailRow label="Unit" value={tenantUnit.number} />
              <DetailRow
                label="Tower / Floor"
                value={`${tenantUnit.building} / Floor ${tenantUnit.floor}`}
              />
              <DetailRow
                label="Lease"
                value={`${shortDate(lease.start)} ${lease.start.slice(0, 4)} – ${shortDate(lease.end)} ${lease.end.slice(0, 4)}`}
              />
              <DetailRow label="Owner" value={tenantUnit.owner} />
              <DetailRow label="Manager" value={propertyManager.name} />
            </dl>

            <CardFooterLink
              href={`${TEN_BASE}/apartment`}
              label="View full details"
            />
          </Card>

          <Card>
            <CardHeading
              title="Current Bill"
              caption={
                data.currentBill
                  ? periodLabel(data.currentBill.period)
                  : "Nothing outstanding"
              }
              icon={Receipt}
              chip="bg-green-50 text-green-600"
              badge={
                data.currentBill && (
                  <TenStatusPill tone="amber">
                    Due {longDate(data.currentBill.dueDate)}
                  </TenStatusPill>
                )
              }
            />

            <div className="border-t border-hairline px-4 py-5 text-center sm:px-5">
              <p className="text-[30px] leading-none font-bold text-ink">
                {lkr(data.currentBillBalance)}
              </p>

              {data.currentBill ? (
                <>
                  <p className="mt-2 text-[13px] text-muted">
                    {data.outstandingCount} outstanding ·{" "}
                    {lkr(data.outstandingTotal)} in total
                  </p>
                  <Link
                    href={`${TEN_BASE}/bills`}
                    className="mt-4 flex w-full items-center justify-center rounded-lg bg-brand px-4 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:outline-none"
                  >
                    Pay Now
                  </Link>
                </>
              ) : (
                <p className="mt-2 text-[13px] text-muted">
                  You are all settled up.
                </p>
              )}
            </div>
          </Card>
        </div>

        {/* ---- Column two: what is in motion ---- */}
        <div className="space-y-5">
          <Card>
            <CardHeading
              title="Maintenance"
              caption={`${data.openRequestCount} open ${
                data.openRequestCount === 1 ? "request" : "requests"
              }`}
              icon={Wrench}
              chip="bg-orange-50 text-orange-500"
            />

            {data.openRequests.length === 0 ? (
              <p className="border-t border-hairline px-5 py-10 text-center text-[14px] text-muted">
                Nothing outstanding — every request on your unit is closed.
              </p>
            ) : (
              <ul className="divide-y divide-hairline border-t border-hairline">
                {data.openRequests.map((request) => (
                  <RequestRow key={request.id} request={request} />
                ))}
              </ul>
            )}

            <CardFooterLink
              href={`${TEN_BASE}/maintenance`}
              label="View all requests"
            />
          </Card>

          <Card>
            <CardHeading
              title="Upcoming Schedule"
              caption={`${data.agendaThisWeek} in the next 7 days`}
              icon={CalendarDays}
              chip="bg-[#eef3f9] text-[#2e6cad]"
            />

            {data.agenda.length === 0 ? (
              <p className="border-t border-hairline px-5 py-10 text-center text-[14px] text-muted">
                Nothing booked and no visitors expected.
              </p>
            ) : (
              <ul className="divide-y divide-hairline border-t border-hairline">
                {data.agenda.map((event) => (
                  <AgendaRow key={`${event.kind}-${event.id}`} event={event} />
                ))}
              </ul>
            )}

            <CardFooterLink
              href={`${TEN_BASE}/calendar`}
              label="View calendar"
            />
          </Card>
        </div>

        {/* ---- Column three: the tenancy, and the numbers ---- */}
        <div className="space-y-5">
          <Card>
            <CardHeading
              title="Lease Status"
              caption={lease.status}
              icon={FileText}
              chip="bg-[#eef3f9] text-[#5b7f9c]"
            />

            <div className="border-t border-hairline px-4 py-4 sm:px-5">
              <dl className="space-y-2.5">
                <DetailRow label="Start" value={longDate(lease.start)} />
                <DetailRow label="End" value={longDate(lease.end)} />
                <DetailRow
                  label="Monthly Rent"
                  value={lkr(lease.monthlyRent)}
                />
                <DetailRow label="Deposit" value={lkr(lease.deposit)} />
              </dl>

              <div className="mt-5">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-[13px] text-muted">Lease Progress</p>
                  <p className="text-[13px] font-semibold text-ink">
                    {progress}%
                  </p>
                </div>
                <div
                  role="progressbar"
                  aria-valuenow={progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Lease progress"
                  className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100"
                >
                  <div
                    className="h-full rounded-full bg-brand"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="mt-2 text-[12px] text-muted">
                  {daysLeft > 0
                    ? `${daysLeft} days remaining`
                    : "Lease term has ended"}
                </p>
              </div>
            </div>

            {/* The lease is the property's record — nothing here is editable. */}
            <p className="border-t border-hairline px-4 py-3 text-center text-[12px] text-gray-400 sm:px-5">
              Managed by the property · read-only
            </p>
          </Card>

          <Card>
            <CardHeading title="Quick Stats" />

            <div className="grid grid-cols-2 gap-1 border-t border-hairline p-2">
              <Stat
                value={String(data.openRequestCount)}
                label="Open Requests"
                href={`${TEN_BASE}/maintenance`}
              />
              <Stat
                value={String(data.outstandingCount)}
                label="Outstanding Bills"
                href={`${TEN_BASE}/bills`}
              />
              <Stat
                value={String(data.bookingCount)}
                label="Facility Bookings"
                href={`${TEN_BASE}/facilities`}
              />
              <Stat
                value={String(data.passCount)}
                label="Visitor Passes"
                href={`${TEN_BASE}/visitors`}
              />
              <Stat
                value={String(unread)}
                label="Unread Alerts"
                href={`${TEN_BASE}/notifications`}
              />
              <Stat
                value={String(data.paidCount)}
                label="Bills Paid"
                href={`${TEN_BASE}/bills`}
              />
            </div>
          </Card>
        </div>
      </div>

    </div>
  );
}
