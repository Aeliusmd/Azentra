import type { PillTone } from "@/components/pm/ui/pill";

/**
 * Mock community announcements. Swap for a `src/lib/api.ts` call when the
 * backend lands.
 */

export const ANNOUNCEMENT_CATEGORIES = [
  "Community",
  "Safety",
  "Maintenance",
  "Finance",
] as const;
export type AnnouncementCategory = (typeof ANNOUNCEMENT_CATEGORIES)[number];

/** Chip order on the list — differs from the form's select order. */
export const CATEGORY_FILTERS = [
  "Safety",
  "Maintenance",
  "Community",
  "Finance",
] as const;

export const ANNOUNCEMENT_PRIORITIES = ["High", "Medium", "Low"] as const;
export type AnnouncementPriority = (typeof ANNOUNCEMENT_PRIORITIES)[number];

export const ANNOUNCEMENT_PRIORITY_TONE: Record<
  AnnouncementPriority,
  PillTone
> = {
  High: "red",
  Medium: "amber",
  Low: "slate",
};

export const ANNOUNCEMENT_TARGETS = [
  "All Residents",
  "Tower A Residents",
  "Tower B Residents",
  "Tower C Residents",
] as const;

export type Announcement = {
  id: string;
  title: string;
  content: string;
  category: AnnouncementCategory;
  priority: AnnouncementPriority;
  /** Free text so seeded rows can say "All Towers". */
  target: string;
  postedBy: string;
  postedAt: string;
};

export const announcements: Announcement[] = [
  {
    id: "AN-001",
    title: "Annual Fire Drill Scheduled",
    content:
      "All residents are required to participate in the annual fire evacuation drill on August 15, 2026, at 10:00 AM. Please assemble at the designated meeting point in the garden area.",
    category: "Safety",
    priority: "High",
    target: "All Residents",
    postedBy: "Property Manager",
    postedAt: "2026-08-05 09:00",
  },
  {
    id: "AN-002",
    title: "Water Supply Interruption Notice",
    content:
      "Water supply will be interrupted on August 10, 2026, from 9:00 AM to 3:00 PM due to maintenance work on the main water line. Please store water in advance.",
    category: "Maintenance",
    priority: "High",
    target: "All Towers",
    postedBy: "Property Manager",
    postedAt: "2026-08-05 14:00",
  },
  {
    id: "AN-003",
    title: "Community Yoga Classes Starting",
    content:
      "Free yoga classes every Saturday and Sunday morning from 7:00 AM to 8:00 AM in the Community Hall. All residents welcome. Mats provided.",
    category: "Community",
    priority: "Low",
    target: "All Residents",
    postedBy: "Property Manager",
    postedAt: "2026-08-03 10:00",
  },
  {
    id: "AN-004",
    title: "Parking Lot A Maintenance",
    content:
      "Parking Lot A will be closed for re-striping and cleaning on August 12-13, 2026. Residents assigned to Lot A may use Lot B visitor parking during this period.",
    category: "Maintenance",
    priority: "Medium",
    target: "Tower A Residents",
    postedBy: "Property Manager",
    postedAt: "2026-08-04 11:00",
  },
  {
    id: "AN-005",
    title: "Gym Equipment Upgrade",
    content:
      "The gym will be closed on August 18-19, 2026, for installation of new cardio equipment including 2 new treadmills and an elliptical machine.",
    category: "Community",
    priority: "Medium",
    target: "All Residents",
    postedBy: "Property Manager",
    postedAt: "2026-08-06 08:00",
  },
  {
    id: "AN-006",
    title: "Monthly Maintenance Fee Reminder",
    content:
      "This is a reminder that August maintenance fees are due by August 10, 2026. Late payments will incur a 2% penalty. Pay online via the resident portal.",
    category: "Finance",
    priority: "Medium",
    target: "All Residents",
    postedBy: "Property Manager",
    postedAt: "2026-08-01 09:00",
  },
];

export function nextAnnouncementId(list: Announcement[]) {
  const highest = list.reduce((max, item) => {
    const value = Number(item.id.replace("AN-", ""));
    return Number.isNaN(value) ? max : Math.max(max, value);
  }, 0);
  return `AN-${String(highest + 1).padStart(3, "0")}`;
}
