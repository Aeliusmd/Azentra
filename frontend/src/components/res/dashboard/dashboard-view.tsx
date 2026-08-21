"use client";

import Link from "next/link";
import {
  CalendarDays,
  ChevronRight,
  CircleAlert,
  CreditCard,
  FileText,
  House,
  Receipt,
  UserRoundPlus,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import {
  BookingStatusPill,
  RequestStatusPill,
} from "@/components/res/ui/status-pill";
import { Card } from "@/components/ui/card";
import { lkr, longDate, monthAndYear, timeRange } from "@/lib/res/format";
import { RES_BASE } from "@/lib/res/nav";
import { useResInvoices } from "@/lib/res/bills-store";
import { useResBookings } from "@/lib/res/bookings-store";
import { resDashboard, TODAY } from "@/lib/res/dashboard-data";
import { useResRequests } from "@/lib/res/maintenance-store";
import {
  PRIORITY_DOT,
  requestProgress,
  type MaintenanceRequest,
} from "@/lib/res/maintenance-data";
import { resFirstName, resInitials, useResProfile } from "@/lib/res/profile-store";
import { residentUnit, unitLine } from "@/lib/res/resident";

/* --------------------------------- Pieces --------------------------------- */

const TILE = "flex shrink-0 items-center justify-center rounded-lg";

function SummaryCard({
  label,
  value,
  caption,
  icon: Icon,
  chip,
  href,
}: {
  label: string;
  value: string;
  caption: string;
  icon: LucideIcon;
  chip: string;
  /** Where the tile leads; without one it is a plain figure. */
  href?: string;
}) {
  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-semibold tracking-wide text-muted uppercase">
          {label}
        </p>
        <span aria-hidden="true" className={`${TILE} h-9 w-9 ${chip}`}>
          <Icon className="h-[18px] w-[18px]" />
        </span>
      </div>
      {/* Steps down on a phone so `LKR 29,300` still fits on one line. */}
      <p className="mt-3 text-[22px] leading-tight font-bold text-ink sm:text-[26px]">
        {value}
      </p>
      <p className="mt-1 text-[13px] text-muted">{caption}</p>
    </>
  );

  if (!href) return <Card className="p-4 sm:p-5">{body}</Card>;

  return (
    <Card className="transition-colors hover:bg-gray-50/70">
      <Link
        href={href}
        className="block h-full p-4 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none sm:p-5"
      >
        {body}
      </Link>
    </Card>
  );
}

function CardHeading({
  title,
  actionLabel,
  actionHref,
}: {
  title: string;
  actionLabel: string;
  actionHref: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-hairline px-4 py-4 sm:px-5">
      <h2 className="text-[15px] font-bold text-ink">{title}</h2>
      <Link
        href={actionHref}
        className="text-[13px] font-medium text-link transition-colors hover:text-link-dark focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
      >
        {actionLabel}
      </Link>
    </div>
  );
}

function RequestRow({ request }: { request: MaintenanceRequest }) {
  const progress = requestProgress(request.status);

  return (
    <li>
      <Link
        href={`${RES_BASE}/maintenance`}
        className="block px-4 py-4 transition-colors hover:bg-gray-50/70 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none sm:px-5"
      >
        <div className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${PRIORITY_DOT[request.priority]}`}
          />

          <div className="min-w-0 flex-1">
            <p className="text-[14px] font-semibold text-ink">
              {request.category} — {request.id}
            </p>
            <p className="mt-0.5 truncate text-[13px] text-muted">
              {request.description}
            </p>
          </div>

          <RequestStatusPill status={request.status} />
          <ChevronRight
            aria-hidden="true"
            className="mt-1 hidden h-4 w-4 shrink-0 text-gray-300 sm:block"
          />
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

const QUICK_ACTIONS: {
  label: string;
  href: string;
  icon: LucideIcon;
  chip: string;
}[] = [
  {
    label: "Request Maintenance",
    href: `${RES_BASE}/maintenance`,
    icon: Wrench,
    chip: "bg-[#eef3f9] text-[#5b7f9c]",
  },
  {
    label: "Pay Bill",
    href: `${RES_BASE}/bills`,
    icon: CreditCard,
    chip: "bg-green-50 text-green-600",
  },
  {
    label: "Book Facility",
    href: `${RES_BASE}/facilities`,
    icon: CalendarDays,
    chip: "bg-[#eef3f9] text-[#2e6cad]",
  },
  {
    label: "Add Visitor",
    href: `${RES_BASE}/visitors`,
    icon: UserRoundPlus,
    chip: "bg-[#eef3f9] text-[#2e6cad]",
  },
  {
    label: "Submit Complaint",
    href: `${RES_BASE}/complaints`,
    icon: CircleAlert,
    chip: "bg-amber-50 text-amber-600",
  },
  {
    label: "View Documents",
    href: `${RES_BASE}/documents`,
    icon: FileText,
    chip: "bg-[#eef3f9] text-[#5b7f9c]",
  },
];

/* ---------------------------------- View ---------------------------------- */

/**
 * The resident's home screen.
 *
 * Four numbers, the two things currently in motion, and the six buttons that
 * cover almost everything a resident ever does here. Every figure is counted
 * off the same records the detail pages read, so nothing on this page can
 * disagree with the page it links to.
 */
export function ResDashboardView() {
  const profile = useResProfile();
  const invoices = useResInvoices();
  const requests = useResRequests();
  const bookings = useResBookings();
  const data = resDashboard(TODAY, invoices, requests, bookings);

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-[24px] leading-tight font-bold text-ink sm:text-[28px]">
            Welcome back, {resFirstName(profile.name)}
          </h1>
          <p className="mt-1 text-[14px] text-muted">{unitLine()}</p>
        </div>

        <span
          aria-hidden="true"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#e8eef5] text-[16px] font-semibold text-[#1b3a5c]"
        >
          {resInitials(profile.name)}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
        <SummaryCard
          label="Current Bill"
          value={data.currentBill ? lkr(data.currentBillBalance) : "LKR 0"}
          caption={
            data.currentBill
              ? `Due ${longDate(data.currentBill.dueDate)}`
              : "Nothing outstanding"
          }
          icon={Receipt}
          chip="bg-green-50 text-green-600"
          href={`${RES_BASE}/bills`}
        />
        <SummaryCard
          label="Maintenance"
          value={String(data.openRequestCount)}
          caption="Open requests"
          icon={Wrench}
          chip="bg-[#eef3f9] text-[#5b7f9c]"
          href={`${RES_BASE}/maintenance`}
        />
        <SummaryCard
          label="Bookings"
          value={String(data.upcomingBookingCount)}
          caption="Upcoming bookings"
          icon={CalendarDays}
          chip="bg-[#eef3f9] text-[#2e6cad]"
          href={`${RES_BASE}/facilities`}
        />
        <SummaryCard
          label="Visitors"
          value={String(data.visitorsThisWeek)}
          caption="Upcoming this week"
          icon={UserRoundPlus}
          chip="bg-[#eef3f9] text-[#2e6cad]"
          href={`${RES_BASE}/visitors`}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Card>
            <CardHeading
              title="Open Maintenance Requests"
              actionLabel="View All"
              actionHref={`${RES_BASE}/maintenance`}
            />

            {data.openRequests.length === 0 ? (
              <p className="px-5 py-10 text-center text-[14px] text-muted">
                Nothing outstanding — every request on your unit is closed.
              </p>
            ) : (
              <ul className="divide-y divide-hairline">
                {data.openRequests.map((request) => (
                  <RequestRow key={request.id} request={request} />
                ))}
              </ul>
            )}
          </Card>

          <Card>
            <CardHeading
              title="Upcoming"
              actionLabel="View Calendar"
              actionHref={`${RES_BASE}/calendar`}
            />

            {data.upcoming.length === 0 ? (
              <p className="px-5 py-10 text-center text-[14px] text-muted">
                No bookings coming up.
              </p>
            ) : (
              <ul className="divide-y divide-hairline">
                {data.upcoming.map((booking) => (
                  <li
                    key={booking.id}
                    className="flex items-center gap-3 px-4 py-4 sm:px-5"
                  >
                    <span
                      aria-hidden="true"
                      className={`${TILE} h-9 w-9 bg-[#eef3f9] text-[#5b7f9c]`}
                    >
                      <CalendarDays className="h-[18px] w-[18px]" />
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] font-semibold text-ink">
                        {booking.facility}
                      </p>
                      <p className="mt-0.5 text-[13px] text-muted">
                        {longDate(booking.date)} ·{" "}
                        {timeRange(booking.from, booking.to)}
                      </p>
                    </div>

                    <BookingStatusPill status={booking.status} />
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <div className="space-y-5">
          <Card>
            <div className="border-b border-hairline px-4 py-4 sm:px-5">
              <h2 className="text-[15px] font-bold text-ink">Quick Actions</h2>
            </div>

            <ul className="p-2">
              {QUICK_ACTIONS.map((action) => {
                const Icon = action.icon;

                return (
                  <li key={action.href}>
                    <Link
                      href={action.href}
                      className="flex items-center gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
                    >
                      <span
                        aria-hidden="true"
                        className={`${TILE} h-9 w-9 ${action.chip}`}
                      >
                        <Icon className="h-[18px] w-[18px]" />
                      </span>
                      <span className="text-[14px] font-medium text-ink">
                        {action.label}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Card>

          <Card>
            <div className="border-b border-hairline px-4 py-4 sm:px-5">
              <h2 className="text-[15px] font-bold text-ink">My Apartment</h2>
            </div>

            <div className="p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className={`${TILE} h-10 w-10 bg-[#eef3f9] text-[#5b7f9c]`}
                >
                  <House className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-[15px] font-bold text-ink">
                    {residentUnit.number}
                  </p>
                  <p className="mt-0.5 text-[13px] text-muted">
                    {residentUnit.building}, Floor {residentUnit.floor}
                  </p>
                </div>
              </div>

              <dl className="mt-5 grid grid-cols-2 gap-3 text-center">
                <div>
                  <dd className="text-[20px] font-bold text-ink">
                    {residentUnit.bedrooms}
                  </dd>
                  <dt className="mt-0.5 text-[13px] text-muted">Bedrooms</dt>
                </div>
                <div>
                  <dd className="text-[20px] font-bold text-ink">
                    {residentUnit.bathrooms}
                  </dd>
                  <dt className="mt-0.5 text-[13px] text-muted">Bathrooms</dt>
                </div>
              </dl>

              <p className="mt-5 text-center text-[13px] text-muted">
                {residentUnit.area.toLocaleString("en-US")} sq ft ·{" "}
                {residentUnit.residentType === "Owner" ? "Owned" : "Leased"}{" "}
                since {monthAndYear(residentUnit.since)}
              </p>

              <p className="mt-4 text-center">
                <Link
                  href={`${RES_BASE}/apartment`}
                  className="text-[14px] font-medium text-link transition-colors hover:text-link-dark focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
                >
                  View Details
                </Link>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
