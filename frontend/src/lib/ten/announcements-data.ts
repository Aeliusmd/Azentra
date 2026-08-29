import { TriangleAlert, Megaphone, PartyPopper, Users, Wrench, type LucideIcon } from "lucide-react";

/**
 * What the property has posted to the building.
 *
 * Read-only in this portal: a tenant reads announcements and marks them read.
 * Writing one is a management action and has no control anywhere in here.
 */

export const ANNOUNCEMENT_CATEGORIES = [
  "General",
  "Maintenance",
  "Emergency",
  "Community",
  "Events",
] as const;
export type AnnouncementCategory = (typeof ANNOUNCEMENT_CATEGORIES)[number];

export const CATEGORY_ICON: Record<AnnouncementCategory, LucideIcon> = {
  General: Megaphone,
  Maintenance: Wrench,
  Emergency: TriangleAlert,
  Community: Users,
  Events: PartyPopper,
};

/** Emergency is the only one allowed to shout. */
export const CATEGORY_CHIP: Record<AnnouncementCategory, string> = {
  General: "bg-[#eef4fb] text-[#2e6cad]",
  Maintenance: "bg-amber-50 text-amber-600",
  Emergency: "bg-rose-50 text-rose-600",
  Community: "bg-green-50 text-green-600",
  Events: "bg-violet-50 text-violet-600",
};

export type Announcement = {
  id: string;
  title: string;
  body: string;
  category: AnnouncementCategory;
  /** ISO day it went up. */
  posted: string;
  author: string;
  read: boolean;
};

export const tenAnnouncements: Announcement[] = [
  {
    id: "ANN-2026-0091",
    title: "Water supply interruption — Tower A",
    body: "The main riser serving Tower A will be shut off on August 15 from 9:00 AM to 2:00 PM for valve replacement. Please store water for the morning.",
    category: "Emergency",
    posted: "2026-08-11",
    author: "Sarah Chen, Property Manager",
    read: false,
  },
  {
    id: "ANN-2026-0089",
    title: "Lift B annual servicing",
    body: "Lift B in Tower A will be out of service on August 18 and 19 for its annual inspection. Lift A remains available throughout.",
    category: "Maintenance",
    posted: "2026-08-09",
    author: "Facilities Team",
    read: false,
  },
  {
    id: "ANN-2026-0086",
    title: "Independence Day community breakfast",
    body: "Join your neighbours at the rooftop garden on August 20 from 8:00 AM. Contributions welcome — sign up at the front desk.",
    category: "Events",
    posted: "2026-08-05",
    author: "Residents' Committee",
    read: true,
  },
  {
    id: "ANN-2026-0082",
    title: "Updated gym opening hours",
    body: "From September 1 the gymnasium opens at 5:00 AM on weekdays and closes at 11:00 PM daily.",
    category: "General",
    posted: "2026-08-02",
    author: "Sarah Chen, Property Manager",
    read: true,
  },
];

/** Anything the tenant has not opened yet. */
export function unreadAnnouncements(items: Announcement[] = tenAnnouncements) {
  return items.filter((item) => !item.read);
}

/** Newest first, which is the only order this list is ever read in. */
export function byNewest(items: Announcement[] = tenAnnouncements) {
  return items.slice().sort((a, b) => b.posted.localeCompare(a.posted));
}
