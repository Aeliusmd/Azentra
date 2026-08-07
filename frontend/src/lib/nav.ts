import {
  Building,
  ChartColumn,
  Gauge,
  KeyRound,
  ScrollText,
  Settings,
  ShieldCheck,
  Sofa,
  Users,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const navItems: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: Gauge },
  { label: "Building Management", href: "/admin/buildings", icon: Building },
  { label: "Common Areas", href: "/admin/common-areas", icon: Sofa },
  { label: "User Management", href: "/admin/users", icon: Users },
  { label: "Role Management", href: "/admin/roles", icon: ShieldCheck },
  { label: "Permissions", href: "/admin/permissions", icon: KeyRound },
  { label: "Reports", href: "/admin/reports", icon: ChartColumn },
  { label: "Audit Logs", href: "/admin/audit-logs", icon: ScrollText },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

/** Label shown as the trailing breadcrumb crumb for a given path. */
export function navLabelFor(pathname: string): string {
  const match = navItems.find(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
  );
  return match?.label ?? "Dashboard";
}
