"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  ClipboardList,
  MapPin,
  Siren,
  type LucideIcon,
} from "lucide-react";

import { CreateSiteVisitModal } from "@/components/fs/site-visits/create-site-visit-modal";
import { EmergencyWorkOrderModal } from "@/components/fs/work-orders/emergency-work-order-modal";
import { ScheduleWorkModal } from "@/components/fs/work-orders/schedule-work-modal";
import { Card, CardHeader } from "@/components/ui/card";
import { TODAY } from "@/lib/fs/dashboard-data";
import { FS_BASE } from "@/lib/fs/nav";
import type { SiteVisit } from "@/lib/fs/site-visits-data";
import {
  WO_PRIORITY_DOT,
  type FsWorkOrder,
} from "@/lib/fs/work-orders-data";

/**
 * Every job on today's clock, earliest first. Each row opens the work-order
 * list already filtered to today, so the schedule is a way in rather than a
 * dead end.
 */
export function TodaysSchedule({ jobs }: { jobs: FsWorkOrder[] }) {
  const todaysList = `${FS_BASE}/work-orders?date=${TODAY}`;

  return (
    <Card className="p-5">
      <CardHeader
        title="Today's Schedule"
        action={
          jobs.length > 0 ? (
            <Link
              href={todaysList}
              className="text-[13px] font-medium text-link transition-colors hover:text-link-dark"
            >
              View all
            </Link>
          ) : undefined
        }
      />

      {jobs.length === 0 ? (
        <p className="py-10 text-center text-[15px] text-muted">
          Nothing is scheduled for today.
        </p>
      ) : (
        <ul className="mt-4 space-y-1">
          {jobs.map((job) => (
            <li key={job.id}>
              <Link
                href={todaysList}
                className="-mx-2 flex items-center gap-3 rounded-md px-2 py-1.5 transition-colors hover:bg-gray-50"
              >
                <span className="w-[68px] shrink-0 text-[13px] text-muted">
                  {job.scheduledTime}
                </span>
                <span
                  aria-hidden="true"
                  className={`h-2 w-2 shrink-0 rounded-full ${WO_PRIORITY_DOT[job.priority]}`}
                />
                <span className="min-w-0 flex-1 truncate text-[15px] text-ink">
                  {job.title}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

/** The visits the supervisor still has to make today. */
export function SiteVisitsToday({
  scheduled,
}: {
  scheduled: SiteVisit[];
}) {
  return (
    <Card className="p-5">
      <CardHeader title="Site Visits Today" />

      <p className="mt-3 text-[26px] leading-none font-bold text-brand">
        {scheduled.length} Scheduled
      </p>

      {scheduled.length === 0 ? (
        <p className="mt-4 text-[15px] text-muted">
          No visits are booked for today.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {scheduled.map((visit) => (
            <li key={visit.id} className="truncate text-[15px] text-ink">
              {visit.summary}{" "}
              <span className="text-[13px] text-muted">
                · {visit.building} · {visit.time}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

/* ------------------------------ Quick actions ----------------------------- */

const ROW =
  "flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-[13px] font-semibold text-white transition-colors focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none";

/** The three that raise something; the rest just navigate. */
type QuickDialog = "schedule" | "visit" | "emergency";

const DIALOGS: {
  key: QuickDialog;
  label: string;
  icon: LucideIcon;
  className: string;
}[] = [
  {
    key: "schedule",
    label: "Schedule Work",
    icon: CalendarDays,
    className: "bg-[#2e6cad] hover:bg-[#255a92]",
  },
  {
    key: "visit",
    label: "Create Site Visit",
    icon: MapPin,
    className: "bg-[#e8a33d] hover:bg-[#d18f2d]",
  },
  {
    key: "emergency",
    label: "Emergency Job",
    icon: Siren,
    className: "bg-[#e0554d] hover:bg-[#c9463f]",
  },
];

const LINKS: { label: string; href: string; icon: LucideIcon; className: string }[] =
  [
    {
      label: "View Calendar",
      href: `${FS_BASE}/calendar`,
      icon: CalendarDays,
      className: "bg-[#7c8794] hover:bg-[#6b7480]",
    },
    {
      label: "View Work Orders",
      href: `${FS_BASE}/work-orders`,
      icon: ClipboardList,
      className: "bg-[#5b7f9c] hover:bg-[#4d6d87]",
    },
  ];

export function QuickActions() {
  const [dialog, setDialog] = useState<QuickDialog | null>(null);

  return (
    <>
      <Card className="p-5">
        <CardHeader title="Quick Actions" />

        <div className="mt-4 space-y-2.5">
          {DIALOGS.map(({ key, label, icon: Icon, className }) => (
            <button
              key={key}
              type="button"
              onClick={() => setDialog(key)}
              aria-haspopup="dialog"
              className={`${ROW} ${className}`}
            >
              <Icon aria-hidden="true" className="h-4 w-4" />
              {label}
            </button>
          ))}

          {LINKS.map(({ label, href, icon: Icon, className }) => (
            <Link key={label} href={href} className={`${ROW} ${className}`}>
              <Icon aria-hidden="true" className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </div>
      </Card>

      {dialog === "schedule" && (
        <ScheduleWorkModal onClose={() => setDialog(null)} />
      )}
      {dialog === "visit" && (
        <CreateSiteVisitModal onClose={() => setDialog(null)} />
      )}
      {dialog === "emergency" && (
        <EmergencyWorkOrderModal onClose={() => setDialog(null)} />
      )}
    </>
  );
}
