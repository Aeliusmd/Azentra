import Link from "next/link";
import {
  ChartColumn,
  CirclePlus,
  CreditCard,
  type LucideIcon,
} from "lucide-react";

import { ACC_BASE } from "@/lib/acc/nav";

const BUTTON =
  "flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-[15px] font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none";
const PRIMARY = "bg-brand text-white hover:bg-brand-dark";
const SECONDARY = "border border-hairline bg-white text-ink hover:bg-gray-50";

/**
 * The four things the accountant starts a session with — each one a way into
 * the section that does the work, rather than a shortcut that does it here.
 */
const ACTIONS: {
  label: string;
  href: string;
  icon: LucideIcon;
  primary?: boolean;
}[] = [
  {
    label: "Generate Bills",
    href: `${ACC_BASE}/generate-bills`,
    icon: CirclePlus,
    primary: true,
  },
  {
    label: "Record Payment",
    href: `${ACC_BASE}/payments`,
    icon: CreditCard,
  },
  { label: "Add Expense", href: `${ACC_BASE}/expenses`, icon: CirclePlus },
  { label: "View Reports", href: `${ACC_BASE}/reports`, icon: ChartColumn },
];

export function QuickActions() {
  return (
    <section>
      <h2 className="text-[15px] font-semibold text-ink">Quick Actions</h2>

      <div className="mt-3 flex flex-wrap gap-3">
        {ACTIONS.map(({ label, href, icon: Icon, primary }) => (
          <Link
            key={label}
            href={href}
            className={`${BUTTON} ${primary ? PRIMARY : SECONDARY}`}
          >
            <Icon aria-hidden="true" className="h-[18px] w-[18px]" />
            {label}
          </Link>
        ))}
      </div>
    </section>
  );
}
