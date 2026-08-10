import {
  Bell,
  Building2,
  CalendarCheck,
  CalendarDays,
  ChartColumn,
  ClipboardCheck,
  ClipboardList,
  Frown,
  Gauge,
  House,
  Megaphone,
  Package,
  Settings,
  Truck,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export const PM_BASE = "/property-manager";

export type PmNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

/** A group with no `title` renders as a plain row; the rest expand on click. */
export type PmNavGroup = {
  title?: string;
  icon?: LucideIcon;
  items: PmNavItem[];
};

export const pmNavGroups: PmNavGroup[] = [
  {
    items: [{ label: "Dashboard", href: `${PM_BASE}/dashboard`, icon: Gauge }],
  },
  {
    title: "Operations",
    icon: Settings,
    items: [
      { label: "Maintenance", href: `${PM_BASE}/maintenance`, icon: Wrench },
      {
        label: "Work Orders",
        href: `${PM_BASE}/work-orders`,
        icon: ClipboardList,
      },
      {
        label: "Preventive",
        href: `${PM_BASE}/preventive`,
        icon: CalendarCheck,
      },
      {
        label: "Inspections",
        href: `${PM_BASE}/inspections`,
        icon: ClipboardCheck,
      },
    ],
  },
  {
    title: "Property",
    icon: Building2,
    items: [
      { label: "Residents", href: `${PM_BASE}/residents`, icon: Users },
      { label: "Units Overview", href: `${PM_BASE}/units`, icon: House },
      { label: "Assets", href: `${PM_BASE}/assets`, icon: Package },
      { label: "Vendors", href: `${PM_BASE}/vendors`, icon: Truck },
    ],
  },
  {
    title: "Community",
    icon: Users,
    items: [
      {
        label: "Facility Booking",
        href: `${PM_BASE}/facility-booking`,
        icon: CalendarDays,
      },
      {
        label: "Announcements",
        href: `${PM_BASE}/announcements`,
        icon: Megaphone,
      },
      { label: "Complaints", href: `${PM_BASE}/complaints`, icon: Frown },
    ],
  },
  {
    items: [
      { label: "Calendar", href: `${PM_BASE}/calendar`, icon: CalendarDays },
      { label: "Reports", href: `${PM_BASE}/reports`, icon: ChartColumn },
      { label: "Notifications", href: `${PM_BASE}/notifications`, icon: Bell },
    ],
  },
];

const ALL_ITEMS = pmNavGroups.flatMap((group) => group.items);

/** Routes reachable from the topbar rather than the rail. */
const EXTRA_LABELS: Record<string, string> = {
  [`${PM_BASE}/profile`]: "My Profile",
  [`${PM_BASE}/settings`]: "Settings",
};

/** Trailing breadcrumb crumb for a given path. */
export function pmNavLabelFor(pathname: string): string {
  const extra = EXTRA_LABELS[pathname];
  if (extra) return extra;

  const match = ALL_ITEMS.find(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
  );
  return match?.label ?? "Dashboard";
}
