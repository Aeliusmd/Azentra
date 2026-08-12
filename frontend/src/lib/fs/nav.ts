import {
  Bell,
  CalendarCheck,
  CalendarClock,
  CalendarDays,
  ChartColumn,
  ClipboardCheck,
  ClipboardList,
  FileText,
  Gauge,
  MapPin,
  Package,
  Settings,
  Siren,
  UserRound,
  UserRoundCheck,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export const FS_BASE = "/field-supervisor";

export type FsNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

/** A group with no `title` renders as a plain row; the rest expand on click. */
export type FsNavGroup = {
  title?: string;
  icon?: LucideIcon;
  items: FsNavItem[];
};

export const fsNavGroups: FsNavGroup[] = [
  {
    items: [{ label: "Dashboard", href: `${FS_BASE}/dashboard`, icon: Gauge }],
  },
  {
    title: "Work Management",
    icon: ClipboardList,
    items: [
      {
        label: "Work Orders",
        href: `${FS_BASE}/work-orders`,
        icon: ClipboardList,
      },
      {
        label: "Maintenance Requests",
        href: `${FS_BASE}/maintenance-requests`,
        icon: Wrench,
      },
      {
        label: "Job Scheduling",
        href: `${FS_BASE}/job-scheduling`,
        icon: CalendarClock,
      },
      {
        label: "Emergency Jobs",
        href: `${FS_BASE}/emergency-jobs`,
        icon: Siren,
      },
      {
        label: "Preventive Maintenance",
        href: `${FS_BASE}/preventive`,
        icon: CalendarCheck,
      },
    ],
  },
  {
    title: "Technicians",
    icon: Users,
    items: [
      {
        label: "Technician List",
        href: `${FS_BASE}/technicians`,
        icon: UserRound,
      },
      {
        label: "Assignments",
        href: `${FS_BASE}/assignments`,
        icon: UserRoundCheck,
      },
      {
        label: "Availability",
        href: `${FS_BASE}/availability`,
        icon: CalendarDays,
      },
      {
        label: "Performance",
        href: `${FS_BASE}/performance`,
        icon: ChartColumn,
      },
    ],
  },
  {
    title: "Site Operations",
    icon: MapPin,
    items: [
      { label: "Site Visits", href: `${FS_BASE}/site-visits`, icon: MapPin },
      {
        label: "Inspections",
        href: `${FS_BASE}/inspections`,
        icon: ClipboardCheck,
      },
      {
        label: "Field Reports",
        href: `${FS_BASE}/field-reports`,
        icon: FileText,
      },
    ],
  },
  {
    items: [
      { label: "Materials", href: `${FS_BASE}/materials`, icon: Package },
      { label: "Calendar", href: `${FS_BASE}/calendar`, icon: CalendarDays },
      { label: "Reports", href: `${FS_BASE}/reports`, icon: ChartColumn },
      { label: "Notifications", href: `${FS_BASE}/notifications`, icon: Bell },
      { label: "Profile", href: `${FS_BASE}/profile`, icon: UserRound },
      { label: "Settings", href: `${FS_BASE}/settings`, icon: Settings },
    ],
  },
];

const ALL_ITEMS = fsNavGroups.flatMap((group) => group.items);

/** Trailing breadcrumb crumb for a given path. */
export function fsNavLabelFor(pathname: string): string {
  const match = ALL_ITEMS.find(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
  );
  return match?.label ?? "Dashboard";
}
