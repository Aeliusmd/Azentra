import {
  Banknote,
  Bell,
  Briefcase,
  Building2,
  CalendarDays,
  ChartColumn,
  ChartPie,
  CircleCheck,
  CircleDollarSign,
  CircleDot,
  CircleGauge,
  CirclePlus,
  ClipboardList,
  CreditCard,
  FileText,
  History,
  Percent,
  Receipt,
  ReceiptText,
  RefreshCw,
  Tags,
  TrendingUp,
  Truck,
  UserRound,
  UserRoundSearch,
  Wallet,
  Zap,
  type LucideIcon,
} from "lucide-react";

export const ACC_BASE = "/accountant";

export type AccNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

/** A group with no `title` renders as a plain row; the rest expand on click. */
export type AccNavGroup = {
  title?: string;
  icon?: LucideIcon;
  items: AccNavItem[];
};

/**
 * The accountant's rail.
 *
 * Financial operations only — nothing here reaches platform setup, user or
 * role administration, technician scheduling, inspections or security. Resident
 * and unit records are read through the billing screens, never managed here.
 */
export const accNavGroups: AccNavGroup[] = [
  {
    items: [
      { label: "Dashboard", href: `${ACC_BASE}/dashboard`, icon: CircleGauge },
    ],
  },
  {
    title: "Billing",
    icon: FileText,
    items: [
      { label: "Unit Bills", href: `${ACC_BASE}/unit-bills`, icon: Receipt },
      { label: "Utility Bills", href: `${ACC_BASE}/utility-bills`, icon: Zap },
      {
        label: "Common Area Bills",
        href: `${ACC_BASE}/common-area-bills`,
        icon: Building2,
      },
      {
        label: "Generate Bills",
        href: `${ACC_BASE}/generate-bills`,
        icon: CirclePlus,
      },
      {
        label: "Billing History",
        href: `${ACC_BASE}/billing-history`,
        icon: History,
      },
    ],
  },
  {
    title: "Invoices",
    icon: ReceiptText,
    items: [
      {
        label: "Resident Invoices",
        href: `${ACC_BASE}/resident-invoices`,
        icon: UserRoundSearch,
      },
      {
        label: "Vendor Invoices",
        href: `${ACC_BASE}/vendor-invoices`,
        icon: Truck,
      },
      {
        label: "Invoice History",
        href: `${ACC_BASE}/invoice-history`,
        icon: History,
      },
    ],
  },
  {
    title: "Payments",
    icon: CircleDollarSign,
    items: [
      { label: "Payments", href: `${ACC_BASE}/payments`, icon: CreditCard },
      {
        label: "Pending Payments",
        href: `${ACC_BASE}/pending-payments`,
        icon: History,
      },
      {
        label: "Outstanding",
        href: `${ACC_BASE}/outstanding`,
        icon: CircleDot,
      },
      {
        label: "Payment History",
        href: `${ACC_BASE}/payment-history`,
        icon: History,
      },
      { label: "Receipts", href: `${ACC_BASE}/receipts`, icon: FileText },
    ],
  },
  {
    title: "Expenses",
    icon: Wallet,
    items: [
      { label: "Expenses", href: `${ACC_BASE}/expenses`, icon: CircleDot },
      {
        label: "Recurring Expenses",
        href: `${ACC_BASE}/recurring-expenses`,
        icon: RefreshCw,
      },
      {
        label: "Expense Categories",
        href: `${ACC_BASE}/expense-categories`,
        icon: Tags,
      },
    ],
  },
  {
    title: "Budgets",
    icon: ChartPie,
    items: [
      { label: "Budgets", href: `${ACC_BASE}/budgets`, icon: CircleCheck },
      {
        label: "Budget Allocation",
        href: `${ACC_BASE}/budget-allocation`,
        icon: ChartPie,
      },
      {
        label: "Budget vs Actual",
        href: `${ACC_BASE}/budget-vs-actual`,
        icon: ChartColumn,
      },
    ],
  },
  {
    title: "Utilities",
    icon: Zap,
    items: [
      {
        label: "Meter Readings",
        href: `${ACC_BASE}/meter-readings`,
        icon: ClipboardList,
      },
      {
        label: "Utility Rates",
        href: `${ACC_BASE}/utility-rates`,
        icon: Percent,
      },
      {
        label: "Consumption",
        href: `${ACC_BASE}/consumption`,
        icon: TrendingUp,
      },
    ],
  },
  {
    title: "Vendors",
    icon: Briefcase,
    items: [
      {
        label: "Vendor Accounts",
        href: `${ACC_BASE}/vendor-accounts`,
        icon: Banknote,
      },
      // Same destination as the entry under Invoices — vendor billing is
      // reached from either side of the ledger.
      {
        label: "Vendor Invoices",
        href: `${ACC_BASE}/vendor-invoices`,
        icon: ReceiptText,
      },
    ],
  },
  {
    items: [
      { label: "Reports", href: `${ACC_BASE}/reports`, icon: ChartColumn },
      { label: "Calendar", href: `${ACC_BASE}/calendar`, icon: CalendarDays },
      { label: "Notifications", href: `${ACC_BASE}/notifications`, icon: Bell },
      { label: "Profile", href: `${ACC_BASE}/profile`, icon: UserRound },
    ],
  },
];

const ALL_ITEMS = accNavGroups.flatMap((group) => group.items);

/** The rail entry covering a path, or null when the path is off the rail. */
export function accNavItemFor(pathname: string): AccNavItem | null {
  return (
    ALL_ITEMS.find(
      (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
    ) ?? null
  );
}

/** Trailing breadcrumb crumb for a given path. */
export function accNavLabelFor(pathname: string): string {
  return accNavItemFor(pathname)?.label ?? "Dashboard";
}
