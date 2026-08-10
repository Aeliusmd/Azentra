import {
  CalendarDays,
  Check,
  CheckCheck,
  CircleAlert,
  UserRoundPlus,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import type { TimelineItem, TimelineKind } from "@/lib/pm/dashboard-data";

const MARKS: Record<TimelineKind, { icon: LucideIcon; bg: string }> = {
  request: { icon: Wrench, bg: "bg-brand" },
  completed: { icon: CheckCheck, bg: "bg-[#2c4c73]" },
  resident: { icon: UserRoundPlus, bg: "bg-[#647a91]" },
  booking: { icon: CalendarDays, bg: "bg-[#e8a33d]" },
  emergency: { icon: CircleAlert, bg: "bg-[#e0554d]" },
  verified: { icon: Check, bg: "bg-[#4a7fb5]" },
};

export function ActivityTimeline({ items }: { items: TimelineItem[] }) {
  return (
    <Card className="h-full">
      <h2 className="px-6 py-5 text-[15px] font-semibold text-ink">
        Property Activity Timeline
      </h2>

      {items.length === 0 ? (
        <p className="px-6 pb-10 text-[13px] text-muted">No recent activity.</p>
      ) : (
        <ul className="divide-y divide-hairline border-t border-hairline">
          {items.map((item) => {
            const { icon: Icon, bg } = MARKS[item.kind];
            return (
              <li
                key={item.id}
                className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-gray-50/70"
              >
                <span
                  aria-hidden="true"
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white ${bg}`}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] font-medium text-ink">
                    {item.title}
                  </span>
                  <span className="mt-0.5 block text-xs text-muted">
                    {item.time}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
