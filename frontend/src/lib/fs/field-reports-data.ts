import type { PillTone } from "@/components/pm/ui/pill";

/**
 * Reports the supervisor files from the field — what was seen, what was done,
 * what needs following up. Mock data — swap for a `src/lib/api.ts` call when
 * the backend lands.
 */

export const REPORT_TYPES = [
  "Site Visit Report",
  "Inspection Report",
  "Work Order Summary",
  "Technician Report",
  "Maintenance Report",
] as const;
export type FsReportType = (typeof REPORT_TYPES)[number];

/** Chip row above the list — one word per kind of report. */
export const REPORT_FILTERS = [
  "All",
  "Site",
  "Inspection",
  "Work",
  "Performance",
  "Maintenance",
] as const;
export type FsReportFilter = (typeof REPORT_FILTERS)[number];

export const FILTER_OF: Record<FsReportType, FsReportFilter> = {
  "Site Visit Report": "Site",
  "Inspection Report": "Inspection",
  "Work Order Summary": "Work",
  "Technician Report": "Performance",
  "Maintenance Report": "Maintenance",
};

export const REPORT_STATUSES = ["Draft", "Submitted"] as const;
export type FsReportStatus = (typeof REPORT_STATUSES)[number];

export const REPORT_STATUS_TONE: Record<FsReportStatus, PillTone> = {
  Draft: "amber",
  Submitted: "green",
};

/** How much summary a report carries — the form counts down against it. */
export const SUMMARY_LIMIT = 500;

export type FsFieldReport = {
  id: string;
  type: FsReportType;
  propertyId: string;
  /** Where the report is about, or `N/A` for site-wide summaries. */
  location: string;
  author: string;
  /** ISO `YYYY-MM-DD`. */
  date: string;
  status: FsReportStatus;
  summary: string;
};

export const fieldReports: FsFieldReport[] = [
  {
    id: "RPT-001",
    type: "Site Visit Report",
    propertyId: "sunrise",
    location: "Tower B - Unit B-602",
    author: "Carlos Rivera",
    date: "2026-08-10",
    status: "Submitted",
    summary:
      "Water damage assessment after pipe burst. Drywall and flooring damaged. Recommended full replacement of affected areas.",
  },
  {
    id: "RPT-002",
    type: "Inspection Report",
    propertyId: "sunrise",
    location: "Tower B - Fire Systems",
    author: "Carlos Rivera",
    date: "2026-08-10",
    status: "Submitted",
    summary:
      "Fire alarm inspection completed. Two notification strobes on Floor 4 not functioning. Work order WO-1053 created for repairs.",
  },
  {
    id: "RPT-003",
    type: "Work Order Summary",
    propertyId: "sunrise",
    location: "All Towers",
    author: "Carlos Rivera",
    date: "2026-08-11",
    status: "Draft",
    summary:
      "Weekly work order summary. 18 total, 9 completed, 7 in progress, 2 pending.",
  },
  {
    id: "RPT-004",
    type: "Site Visit Report",
    propertyId: "sunrise",
    location: "Common Area - Gym",
    author: "Carlos Rivera",
    date: "2026-08-09",
    status: "Submitted",
    summary:
      "Gym equipment condition check completed. Treadmill #3 belt issue resolved. Floor mats scheduled for replacement next quarter.",
  },
  {
    id: "RPT-005",
    type: "Technician Report",
    propertyId: "sunrise",
    location: "N/A",
    author: "Carlos Rivera",
    date: "2026-08-08",
    status: "Draft",
    summary:
      "Monthly technician performance summary. John Perera top performer with 94% on-time completion. Average response time improved 12%.",
  },
  {
    id: "RPT-006",
    type: "Maintenance Report",
    propertyId: "sunrise",
    location: "Tower A",
    author: "Carlos Rivera",
    date: "2026-08-07",
    status: "Submitted",
    summary:
      "Tower A monthly maintenance summary. 5 work orders completed, HVAC system serviced, elevator quarterly inspection passed.",
  },
  {
    id: "RPT-007",
    type: "Inspection Report",
    propertyId: "green-valley",
    location: "Block 2 - Side Gate",
    author: "Carlos Rivera",
    date: "2026-08-11",
    status: "Submitted",
    summary:
      "Gate motor repair reviewed on site. Motor still overheating after repeated cycles; capacitor replacement pending stock.",
  },
  {
    id: "RPT-008",
    type: "Maintenance Report",
    propertyId: "green-valley",
    location: "Block 1",
    author: "Carlos Rivera",
    date: "2026-08-06",
    status: "Draft",
    summary:
      "Block 1 monthly maintenance summary. Corridor repaint completed, emergency lighting check outstanding.",
  },
];

export function reportsAt(propertyId: string) {
  return fieldReports.filter((report) => report.propertyId === propertyId);
}

/** Newest first — a report list is read from the top. */
export function byReportDate(a: FsFieldReport, b: FsFieldReport) {
  return b.date.localeCompare(a.date) || b.id.localeCompare(a.id);
}

/** `RPT-009` after `RPT-008`. */
export function nextReportId(list: FsFieldReport[]) {
  const highest = list.reduce((max, report) => {
    const value = Number(report.id.replace("RPT-", ""));
    return Number.isNaN(value) ? max : Math.max(max, value);
  }, 0);

  return `RPT-${String(highest + 1).padStart(3, "0")}`;
}
