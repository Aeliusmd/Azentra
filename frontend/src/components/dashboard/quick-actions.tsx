import Link from "next/link";
import {
  Building,
  CalendarDays,
  FileText,
  UserRoundPlus,
  type LucideIcon,
} from "lucide-react";

import { Card } from "@/components/ui/card";

const ACTIONS: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "Register Resident", href: "/admin/users/new", icon: UserRoundPlus },
  { label: "Book Common Area", href: "/admin/common-areas", icon: CalendarDays },
  { label: "Tower Overview", href: "/admin/buildings", icon: Building },
  { label: "Generate Report", href: "/admin/reports", icon: FileText },
];

export function QuickActions() {
  return (
    <Card className="p-6">
      <h2 className="text-[15px] font-semibold text-ink">Quick Actions</h2>

      <ul className="mt-4 space-y-1">
        {ACTIONS.map(({ label, href, icon: Icon }) => (
          <li key={href}>
            <Link
              href={href}
              className="-mx-2 flex items-center gap-3 rounded-md px-2 py-2.5 text-[13px] text-gray-700 transition-colors hover:bg-gray-50 hover:text-ink focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
            >
              <Icon aria-hidden="true" className="h-4 w-4 text-gray-500" />
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  );
}
