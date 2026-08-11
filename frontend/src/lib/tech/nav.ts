import {
  Bell,
  CalendarCheck,
  CalendarClock,
  CalendarDays,
  ClipboardList,
  Gauge,
  Package,
  Settings,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export const TECH_BASE = "/technician";

export type TechNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

/** The technician rail is a flat list — no sections to expand. */
export const techNavItems: TechNavItem[] = [
  { label: "Dashboard", href: `${TECH_BASE}/dashboard`, icon: Gauge },
  { label: "My Work", href: `${TECH_BASE}/my-work`, icon: Wrench },
  { label: "Preventive", href: `${TECH_BASE}/preventive`, icon: CalendarCheck },
  { label: "Calendar", href: `${TECH_BASE}/calendar`, icon: CalendarDays },
  { label: "Materials", href: `${TECH_BASE}/materials`, icon: Package },
  {
    label: "Labour & Work Log",
    href: `${TECH_BASE}/work-log`,
    icon: ClipboardList,
  },
  {
    label: "Availability",
    href: `${TECH_BASE}/availability`,
    icon: CalendarClock,
  },
  { label: "Notifications", href: `${TECH_BASE}/notifications`, icon: Bell },
  { label: "Settings", href: `${TECH_BASE}/settings`, icon: Settings },
];

/** Routes reachable from the topbar rather than the rail. */
const EXTRA_LABELS: Record<string, string> = {
  [`${TECH_BASE}/profile`]: "My Profile",
};

/** Trailing breadcrumb crumb for a given path. */
export function techNavLabelFor(pathname: string): string {
  const extra = EXTRA_LABELS[pathname];
  if (extra) return extra;

  const match = techNavItems.find(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
  );
  return match?.label ?? "Dashboard";
}
