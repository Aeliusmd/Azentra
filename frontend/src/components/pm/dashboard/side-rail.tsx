import Link from "next/link";
import {
  CalendarDays,
  CirclePlus,
  Search,
  Truck,
  type LucideIcon,
} from "lucide-react";

import { TONE_DOT } from "@/components/pm/status-badge";
import { Card } from "@/components/ui/card";
import type { ScheduleItem, UpcomingEvent } from "@/lib/pm/dashboard-data";
import { PM_BASE } from "@/lib/pm/nav";

/** The day's timed commitments — inspections and scheduled jobs. */
export function TodaysSchedule({ items }: { items: ScheduleItem[] }) {
  return (
    <Card className="p-5">
      <h2 className="text-[15px] font-semibold text-ink">Today’s Schedule</h2>

      {items.length === 0 ? (
        <p className="mt-4 text-[13px] text-muted">Nothing scheduled today.</p>
      ) : (
        <ul className="mt-2 divide-y divide-hairline">
          {items.map((item) => (
            <li key={item.id} className="flex items-center gap-3 py-3">
              <span className="w-11 shrink-0 text-xs font-medium text-gray-500">
                {item.time}
              </span>
              <span
                aria-hidden="true"
                className={`h-2 w-2 shrink-0 rounded-full ${TONE_DOT[item.tone]}`}
              />
              <span className="min-w-0 flex-1 text-[13px] text-ink">
                {item.title}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

/** Next few dated events across inspections and preventive maintenance. */
export function UpcomingEvents({ items }: { items: UpcomingEvent[] }) {
  return (
    <Card className="p-5">
      <h2 className="text-[15px] font-semibold text-ink">Upcoming</h2>

      {items.length === 0 ? (
        <p className="mt-4 text-[13px] text-muted">No upcoming events.</p>
      ) : (
        <ul className="mt-3 space-y-2.5">
          {items.map((item) => (
            <li key={item.id} className="flex items-center gap-3">
              <span className="shrink-0 rounded bg-green-50 px-2 py-1 text-[11px] font-semibold text-green-700">
                {item.date}
              </span>
              <span className="min-w-0 flex-1 truncate text-[13px] text-ink">
                {item.title}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

const ACTIONS: {
  label: string;
  href: string;
  icon: LucideIcon;
  className: string;
}[] = [
  {
    label: "Create Work Order",
    href: `${PM_BASE}/work-orders`,
    icon: CirclePlus,
    className: "bg-brand hover:bg-brand-dark",
  },
  {
    label: "Schedule Inspection",
    href: `${PM_BASE}/inspections`,
    icon: Search,
    className: "bg-[#e8a33d] hover:bg-[#d4922f]",
  },
  {
    label: "Add Vendor",
    href: `${PM_BASE}/vendors`,
    icon: Truck,
    className: "bg-[#647a91] hover:bg-[#566a7f]",
  },
  {
    label: "View Calendar",
    href: `${PM_BASE}/calendar`,
    icon: CalendarDays,
    className: "bg-[#4a7fb5] hover:bg-[#3f6d9d]",
  },
];

export function PmQuickActions() {
  return (
    <Card className="p-5">
      <h2 className="text-[15px] font-semibold text-ink">Quick Actions</h2>

      <ul className="mt-4 space-y-2.5">
        {ACTIONS.map(({ label, href, icon: Icon, className }) => (
          <li key={href}>
            <Link
              href={href}
              className={`flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-[13px] font-semibold text-white transition-colors focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none ${className}`}
            >
              <Icon aria-hidden="true" className="h-4 w-4" />
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  );
}
