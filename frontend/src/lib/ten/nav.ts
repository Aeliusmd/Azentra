import {
  Bell,
  Building2,
  CalendarDays,
  CarFront,
  CircleAlert,
  CircleGauge,
  FileText,
  House,
  Megaphone,
  Receipt,
  UserRound,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export const TEN_BASE = "/tenant";

export type TenNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

/**
 * The tenant's rail.
 *
 * Flat, like the resident's, and deliberately shorter in reach: a tenant rents
 * the unit rather than owning it, so nothing here leads to ownership records,
 * the owner's share of the building's costs, other households, work-order
 * assignment, billing configuration or security check-in. Those screens have no
 * route in this portal at all — the catch-all 404s anything off this list.
 */
export const tenNavItems: TenNavItem[] = [
  { label: "Dashboard", href: `${TEN_BASE}/dashboard`, icon: CircleGauge },
  { label: "My Apartment", href: `${TEN_BASE}/apartment`, icon: House },
  { label: "Maintenance", href: `${TEN_BASE}/maintenance`, icon: Wrench },
  { label: "Bills & Payments", href: `${TEN_BASE}/bills`, icon: Receipt },
  { label: "Facilities", href: `${TEN_BASE}/facilities`, icon: Building2 },
  { label: "Complaints", href: `${TEN_BASE}/complaints`, icon: CircleAlert },
  { label: "Visitors", href: `${TEN_BASE}/visitors`, icon: Users },
  { label: "Documents", href: `${TEN_BASE}/documents`, icon: FileText },
  { label: "Calendar", href: `${TEN_BASE}/calendar`, icon: CalendarDays },
  { label: "Notifications", href: `${TEN_BASE}/notifications`, icon: Bell },
  { label: "Profile", href: `${TEN_BASE}/profile`, icon: UserRound },
];

/**
 * Part of the portal but not on the rail — reached from a card or a link rather
 * than the sidebar. Listed here so they still resolve to a section, and so the
 * breadcrumb can name them, instead of 404-ing.
 */
const OFF_RAIL: TenNavItem[] = [
  { label: "Parking", href: `${TEN_BASE}/parking`, icon: CarFront },
  {
    label: "Announcements",
    href: `${TEN_BASE}/announcements`,
    icon: Megaphone,
  },
];

const ALL_ITEMS = [...tenNavItems, ...OFF_RAIL];

/** The entry covering a path, or null when the path is not part of the portal. */
export function tenNavItemFor(pathname: string): TenNavItem | null {
  return (
    ALL_ITEMS.find(
      (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
    ) ?? null
  );
}

/** Trailing breadcrumb crumb for a given path. */
export function tenNavLabelFor(pathname: string): string {
  return tenNavItemFor(pathname)?.label ?? "Dashboard";
}
