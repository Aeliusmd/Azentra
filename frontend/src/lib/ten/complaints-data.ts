import {
  Building2,
  CarFront,
  Frown,
  ShieldAlert,
  SprayCan,
  Users,
  Volume2,
  type LucideIcon,
} from "lucide-react";

import type { TenUpload } from "@/lib/ten/uploads";

/**
 * Complaints this tenant has raised about the building or the community.
 *
 * A tenant reports and tracks; the property investigates and answers. Nothing
 * in this portal changes a complaint's status, writes the response, or reaches
 * anybody else's complaint — the list is this account's own by construction.
 */

export const COMPLAINT_CATEGORIES = [
  "Noise",
  "Parking",
  "Security",
  "Common Area",
  "Cleaning",
  "Neighbor / Community",
  "Other",
] as const;
export type ComplaintCategory = (typeof COMPLAINT_CATEGORIES)[number];

/** The glyph on a complaint row — recognisable before the text is read. */
export const CATEGORY_ICON: Record<ComplaintCategory, LucideIcon> = {
  Noise: Volume2,
  Parking: CarFront,
  Security: ShieldAlert,
  "Common Area": Building2,
  Cleaning: SprayCan,
  "Neighbor / Community": Users,
  Other: Frown,
};

export const COMPLAINT_STATUSES = [
  "Submitted",
  "Under Review",
  "In Progress",
  "Resolved",
  "Closed",
] as const;
export type ComplaintStatus = (typeof COMPLAINT_STATUSES)[number];

/** Still with the property. */
export function isOpenComplaint(complaint: TenComplaint) {
  return complaint.status !== "Resolved" && complaint.status !== "Closed";
}

/**
 * One thing that happened to the complaint, as the property recorded it.
 * Oldest first, the way the log reads.
 */
export type ComplaintEvent = {
  label: string;
  /** ISO day. */
  date: string;
  /** 24-hour `HH:MM`. */
  time: string;
};

export type TenComplaint = {
  id: string;
  category: ComplaintCategory;
  description: string;
  /** ISO day the tenant raised it. */
  submitted: string;
  status: ComplaintStatus;
  timeline: ComplaintEvent[];
  /** What management wrote back, once they have written anything. */
  response: string | null;
  respondedBy: string | null;
  /** Photos or documents the tenant attached as evidence. */
  attachments: TenUpload[];
};

/** Newest first, the way the list reads. */
export const tenComplaints: TenComplaint[] = [
  {
    id: "CMP-2026-0045",
    category: "Noise",
    description:
      "Loud drilling and renovation noise from Unit A-306 every morning starting at 7 AM. This has been going on for 5 days. It is disturbing my ability to work from home.",
    submitted: "2026-08-08",
    status: "Under Review",
    timeline: [
      { label: "Complaint Submitted", date: "2026-08-08", time: "08:30" },
      {
        label: "Under Review by Property Manager",
        date: "2026-08-09",
        time: "09:00",
      },
    ],
    response: null,
    respondedBy: null,
    attachments: [],
  },
  {
    id: "CMP-2026-0038",
    category: "Common Area",
    description:
      "Elevator in Tower A has been making loud grinding noises for a week. The inspection certificate inside expired in June 2026.",
    submitted: "2026-08-03",
    status: "In Progress",
    timeline: [
      { label: "Complaint Submitted", date: "2026-08-03", time: "19:12" },
      {
        label: "Under Review by Property Manager",
        date: "2026-08-04",
        time: "10:15",
      },
      { label: "Referred to Lift Contractor", date: "2026-08-05", time: "14:40" },
      { label: "Inspection Scheduled", date: "2026-08-10", time: "11:00" },
    ],
    response:
      "The lift contractor has been called out and a full service is booked for August 18. The renewed certificate will be posted in the car once the inspection passes.",
    respondedBy: "Sarah Chen, Property Manager",
    attachments: [],
  },
  {
    id: "CMP-2026-0025",
    category: "Security",
    description:
      "Security guard at Tower A entrance was rude when I asked about visitor parking procedures. Unprofessional behavior.",
    submitted: "2026-07-21",
    status: "Resolved",
    timeline: [
      { label: "Complaint Submitted", date: "2026-07-21", time: "20:05" },
      {
        label: "Under Review by Property Manager",
        date: "2026-07-22",
        time: "09:30",
      },
      { label: "Discussed with Security Supervisor", date: "2026-07-24", time: "15:20" },
      { label: "Resolved", date: "2026-07-28", time: "16:45" },
    ],
    response:
      "Thank you for raising this. The officer has been spoken to and the visitor parking procedure has been re-briefed to the whole gate team. Please let us know if you see it again.",
    respondedBy: "Sarah Chen, Property Manager",
    attachments: [],
  },
];
