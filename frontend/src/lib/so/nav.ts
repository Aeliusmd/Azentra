import {
  Bell,
  CalendarDays,
  ChartColumn,
  CarFront,
  CircleGauge,
  QrCode,
  ScrollText,
  Settings,
  ShieldCheck,
  Siren,
  SquareParking,
  UserRound,
  UserRoundCheck,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";

export const SO_BASE = "/security-officer";

export type SoNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

/** A group with no `title` renders as plain rows; the rest expand on click. */
export type SoNavGroup = {
  title?: string;
  icon?: LucideIcon;
  items: SoNavItem[];
};

/**
 * The security officer's rail.
 *
 * Everything here is the gate and the grounds: who is coming, who is inside,
 * what drove in, and what went wrong. Nothing leads to money, work orders,
 * vendors, or the admin console — a guard admits people and writes up what
 * happened, and the catch-all 404s anything off this list, so those screens
 * have no route inside this portal at all.
 */
export const soNavGroups: SoNavGroup[] = [
  {
    items: [
      { label: "Dashboard", href: `${SO_BASE}/dashboard`, icon: CircleGauge },
      { label: "Visitors", href: `${SO_BASE}/visitors`, icon: Users },
      { label: "Parking", href: `${SO_BASE}/parking`, icon: SquareParking },
    ],
  },
  {
    title: "Operations",
    icon: ShieldCheck,
    items: [
      { label: "Incidents", href: `${SO_BASE}/incidents`, icon: Siren },
      {
        label: "Emergency Alerts",
        href: `${SO_BASE}/emergency-alerts`,
        icon: Zap,
      },
      {
        label: "Security Logs",
        href: `${SO_BASE}/security-logs`,
        icon: ScrollText,
      },
    ],
  },
  {
    items: [
      {
        label: "Residents",
        href: `${SO_BASE}/residents`,
        icon: UserRoundCheck,
      },
      { label: "Calendar", href: `${SO_BASE}/calendar`, icon: CalendarDays },
      { label: "Notifications", href: `${SO_BASE}/notifications`, icon: Bell },
      { label: "Settings", href: `${SO_BASE}/settings`, icon: Settings },
    ],
  },
];

const RAIL_ITEMS = soNavGroups.flatMap((group) => group.items);

/**
 * Part of the portal but not on the rail — reached from a card, a tab or the
 * avatar menu rather than a nav row. Listed so they still resolve to a section,
 * and so the breadcrumb can name them, instead of 404-ing.
 */
const OFF_RAIL: SoNavItem[] = [
  // Reached from the avatar menu in the topbar, so it is not on the rail too.
  { label: "Profile", href: `${SO_BASE}/profile`, icon: UserRound },
  // Gate tools that belong to a screen rather than to a section of their own:
  // the scanner is how a visitor is admitted, and the vehicle log is the
  // parking deck seen from the barrier.
  { label: "QR Scanner", href: `${SO_BASE}/qr-scanner`, icon: QrCode },
  { label: "Vehicles", href: `${SO_BASE}/vehicles`, icon: CarFront },
  { label: "Reports", href: `${SO_BASE}/reports`, icon: ChartColumn },
];

const ALL_ITEMS = [...RAIL_ITEMS, ...OFF_RAIL];

/** The entry covering a path, or null when the path is not part of the portal. */
export function soNavItemFor(pathname: string): SoNavItem | null {
  return (
    ALL_ITEMS.find(
      (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
    ) ?? null
  );
}

/** Trailing breadcrumb crumb for a given path. */
export function soNavLabelFor(pathname: string): string {
  return soNavItemFor(pathname)?.label ?? "Dashboard";
}
