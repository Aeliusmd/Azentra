import { clockPadded, shortDate } from "@/lib/res/format";
import type { ResUpload } from "@/lib/res/uploads";

/**
 * Complaints this household has raised.
 *
 * A complaint is really its own history — raised, looked at, acted on, closed —
 * so the events are what is stored, and the dates the list shows are read back
 * off them. That way a complaint cannot claim to have been resolved on a day
 * nothing happened.
 */

export const COMPLAINT_CATEGORIES = [
  "Noise",
  "Parking",
  "Security",
  "Common Area",
  "Cleanliness",
  "Neighbor / Community",
  "Other",
] as const;
export type ComplaintCategory = (typeof COMPLAINT_CATEGORIES)[number];

export const COMPLAINT_STATUSES = [
  "Submitted",
  "Under Review",
  "In Progress",
  "Resolved",
  "Closed",
] as const;
export type ComplaintStatus = (typeof COMPLAINT_STATUSES)[number];

/** One step in a complaint's history. */
export type ComplaintEvent = {
  label: string;
  /** ISO day. */
  date: string;
  /** 24-hour `HH:MM`. */
  time: string;
};

export type Complaint = {
  id: string;
  category: ComplaintCategory;
  description: string;
  status: ComplaintStatus;
  /** Oldest first — the order the timeline reads. */
  events: ComplaintEvent[];
  evidence: ResUpload[];
};

export const complaints: Complaint[] = [
  {
    id: "CMP-2026-0042",
    category: "Noise",
    description:
      "Loud music and shouting from Unit A-308 every night after 11 PM. This has been happening for the past week and it is disturbing our sleep.",
    status: "Under Review",
    events: [
      { label: "Complaint Submitted", date: "2026-08-09", time: "21:30" },
      {
        label: "Under Review by Property Manager",
        date: "2026-08-10",
        time: "08:00",
      },
    ],
    evidence: [],
  },
  {
    id: "CMP-2026-0031",
    category: "Cleanliness",
    description:
      "Garbage chute on the 3rd floor has been blocked for 3 days. Bad smell is spreading through the corridor.",
    status: "Resolved",
    events: [
      { label: "Complaint Submitted", date: "2026-07-28", time: "09:15" },
      {
        label: "Under Review by Property Manager",
        date: "2026-07-28",
        time: "14:00",
      },
      { label: "Cleaning Team Assigned", date: "2026-07-29", time: "10:00" },
      { label: "Resolved — chute cleared", date: "2026-07-30", time: "16:45" },
    ],
    evidence: [],
  },
  {
    id: "CMP-2026-0020",
    category: "Parking",
    description:
      "Unauthorized vehicle parked in my assigned parking slot B1-42 for 2 consecutive days.",
    status: "Resolved",
    events: [
      { label: "Complaint Submitted", date: "2026-07-15", time: "19:20" },
      {
        label: "Under Review by Property Manager",
        date: "2026-07-16",
        time: "09:00",
      },
      {
        label: "Resolved — vehicle removed by security",
        date: "2026-07-16",
        time: "15:30",
      },
    ],
    evidence: [],
  },
];

/** When it was raised — the first thing that ever happened to it. */
export function submittedOn(complaint: Complaint) {
  return complaint.events[0]?.date ?? "";
}

/**
 * When it was settled, or null while it is still open.
 *
 * Read off the last event rather than stored separately: a complaint was
 * resolved when the last thing happened to it, by definition.
 */
export function resolvedOn(complaint: Complaint) {
  if (complaint.status !== "Resolved" && complaint.status !== "Closed") {
    return null;
  }
  return complaint.events[complaint.events.length - 1]?.date ?? null;
}

/** `Aug 9, 09:30 PM` — the stamp under a timeline entry. */
export function eventStamp(event: ComplaintEvent) {
  return `${shortDate(event.date)}, ${clockPadded(event.time)}`;
}
