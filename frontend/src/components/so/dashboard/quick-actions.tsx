import Link from "next/link";
import { History, Siren, SquareParking, UserRoundPlus } from "lucide-react";

import { Card } from "@/components/ui/card";
import { SO_BASE } from "@/lib/so/nav";

/**
 * The four things a guard does without thinking.
 *
 * Each is a link to the screen that does the work rather than a dialog of its
 * own — the desk interface is where a visitor is actually admitted, and there
 * is one path to it, not two.
 */
const ACTIONS = [
  {
    label: "Register Visitor",
    href: `${SO_BASE}/visitors`,
    icon: UserRoundPlus,
    className:
      "bg-[#4a7fb5] hover:bg-[#3f6d9d] focus-visible:ring-[#4a7fb5]/40",
  },
  {
    label: "Approve Parking",
    href: `${SO_BASE}/parking`,
    icon: SquareParking,
    className:
      "bg-[#3f9e63] hover:bg-[#368653] focus-visible:ring-[#3f9e63]/40",
  },
  {
    label: "Create Incident",
    href: `${SO_BASE}/incidents`,
    icon: Siren,
    className:
      "bg-[#e0554d] hover:bg-[#c74941] focus-visible:ring-[#e0554d]/40",
  },
  {
    label: "View History",
    href: `${SO_BASE}/visitors`,
    icon: History,
    className:
      "bg-[#5b7c99] hover:bg-[#4d6a83] focus-visible:ring-[#5b7c99]/40",
  },
] as const;

export function SoQuickActions() {
  return (
    <Card className="p-5">
      <h2 className="text-[15px] font-bold text-ink">Quick Actions</h2>

      <ul className="mt-4 space-y-3">
        {ACTIONS.map((action) => {
          const Icon = action.icon;

          return (
            <li key={action.label}>
              <Link
                href={action.href}
                className={`flex items-center gap-2.5 rounded-lg px-4 py-3 text-[14px] font-semibold text-white transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none ${action.className}`}
              >
                <Icon
                  aria-hidden="true"
                  className="h-[18px] w-[18px] shrink-0"
                />
                {action.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
