/**
 * Mock data for the dashboard. Mirrors the numbers in the design so the page
 * renders standalone — replace each export with a call to `src/lib/api.ts`
 * once the backend exposes these endpoints.
 */

export const property = {
  name: "Sunrise Residence",
  totalUnits: 180,
  occupied: 133,
  vacant: 42,
  maintenance: 5,
  commonAreas: 7,
};

export type ActivityIcon =
  | "unit"
  | "tenant"
  | "maintenance"
  | "booking"
  | "resident";

export type Activity = {
  id: string;
  icon: ActivityIcon;
  title: string;
  detail: string;
  time: string;
};

export const recentActivity: Activity[] = [
  {
    id: "1",
    icon: "unit",
    title: "Unit status updated",
    detail: "A-102 marked vacant",
    time: "5 min ago",
  },
  {
    id: "2",
    icon: "tenant",
    title: "Tenant assigned",
    detail: "James Wilson to B-201",
    time: "30 min ago",
  },
  {
    id: "3",
    icon: "maintenance",
    title: "Maintenance completed",
    detail: "C-302 plumbing fix",
    time: "1 hr ago",
  },
  {
    id: "4",
    icon: "booking",
    title: "Common area booking",
    detail: "Community Hall - Wedding event",
    time: "2 hr ago",
  },
  {
    id: "5",
    icon: "resident",
    title: "New resident registered",
    detail: "Olivia Taylor moved to A-301",
    time: "3 hr ago",
  },
];

// Towers live in `buildings-data.ts` so Building Management and the dashboard
// tower table always agree.
export { towers, type Tower } from "./buildings-data";

export const currentUser = {
  name: "Sarah Chen",
  role: "Admin",
  initials: "S",
};
