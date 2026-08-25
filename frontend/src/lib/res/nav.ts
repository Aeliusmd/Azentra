import {
  Bell,
  Building2,
  CalendarDays,
  CircleAlert,
  CircleGauge,
  FileText,
  House,
  Receipt,
  Settings,
  UserRound,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export const RES_BASE = "/resident";

export type ResNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

/**
 * The resident's rail — one flat list, no expandable sections.
 *
 * The staff portals group their screens because they have thirty of them; a
 * resident has eleven, and a flat list means everything is one tap away with
 * nothing to discover. Nothing here reaches property administration, other
 * households, work-order assignment, billing configuration or security
 * check-in: those screens have no route in this portal at all.
 */
export const resNavItems: ResNavItem[] = [
  { label: "Dashboard", href: `${RES_BASE}/dashboard`, icon: CircleGauge },
  { label: "My Apartment", href: `${RES_BASE}/apartment`, icon: House },
  { label: "Maintenance", href: `${RES_BASE}/maintenance`, icon: Wrench },
  { label: "Bills & Payments", href: `${RES_BASE}/bills`, icon: Receipt },
  { label: "Facilities", href: `${RES_BASE}/facilities`, icon: Building2 },
  { label: "Complaints", href: `${RES_BASE}/complaints`, icon: CircleAlert },
  { label: "Visitors", href: `${RES_BASE}/visitors`, icon: Users },
  { label: "Documents", href: `${RES_BASE}/documents`, icon: FileText },
  { label: "Calendar", href: `${RES_BASE}/calendar`, icon: CalendarDays },
  { label: "Notifications", href: `${RES_BASE}/notifications`, icon: Bell },
];

/**
 * Reachable, but reached from the profile menu in the topbar rather than the
 * rail. Listed here so they still resolve to a section — and so the breadcrumb
 * can name them — instead of 404-ing.
 */
const OFF_RAIL: ResNavItem[] = [
  { label: "Profile", href: `${RES_BASE}/profile`, icon: UserRound },
  { label: "Settings", href: `${RES_BASE}/settings`, icon: Settings },
];

const ALL_ITEMS = [...resNavItems, ...OFF_RAIL];

/** The entry covering a path, or null when the path is not part of the portal. */
export function resNavItemFor(pathname: string): ResNavItem | null {
  return (
    ALL_ITEMS.find(
      (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
    ) ?? null
  );
}

/** Trailing breadcrumb crumb for a given path. */
export function resNavLabelFor(pathname: string): string {
  return resNavItemFor(pathname)?.label ?? "Dashboard";
}
