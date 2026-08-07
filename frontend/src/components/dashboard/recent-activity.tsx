import {
  CalendarDays,
  House,
  UserRoundCheck,
  UserRoundPlus,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import type { Activity, ActivityIcon } from "@/lib/dashboard-data";

const ICONS: Record<ActivityIcon, { icon: LucideIcon; color: string }> = {
  unit: { icon: House, color: "text-[#647a91]" },
  tenant: { icon: UserRoundCheck, color: "text-[#3fae63]" },
  maintenance: { icon: Wrench, color: "text-[#e8a33d]" },
  booking: { icon: CalendarDays, color: "text-[#4a7fb5]" },
  resident: { icon: UserRoundPlus, color: "text-[#3fae63]" },
};

export function RecentActivity({ items }: { items: Activity[] }) {
  return (
    <Card>
      <h2 className="border-b border-hairline px-6 py-5 text-[15px] font-semibold text-ink">
        Recent Activity
      </h2>

      <ul className="divide-y divide-hairline">
        {items.map((item) => {
          const { icon: Icon, color } = ICONS[item.icon];
          return (
            <li
              key={item.id}
              className="flex items-center gap-4 px-6 py-3.5 transition-colors hover:bg-gray-50/70"
            >
              <span
                aria-hidden="true"
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 ${color}`}
              >
                <Icon className="h-4 w-4" />
              </span>

              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold text-ink">
                  {item.title}
                </p>
                <p className="truncate text-xs text-muted">{item.detail}</p>
              </div>

              <span className="shrink-0 text-xs text-gray-400">
                {item.time}
              </span>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
