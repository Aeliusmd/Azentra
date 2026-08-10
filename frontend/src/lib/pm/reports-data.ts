/**
 * Mock operational reports. Swap for a `src/lib/api.ts` call when the backend
 * lands — every tab shares the same shape so the view stays data-driven.
 */

export const REPORT_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
] as const;

export type ReportStat = {
  label: string;
  value: string;
  /** Blank hides the comparison line. */
  delta: string;
};

export type ReportChart = {
  title: string;
  /** Legend label for the taller (blue) series. */
  totalLabel: string;
  /** Legend label for the shorter (green) series. */
  doneLabel: string;
  totals: number[];
  done: number[];
};

export type Report = {
  key: string;
  label: string;
  stats: ReportStat[];
  chart: ReportChart;
};

export const reports: Report[] = [
  {
    key: "maintenance",
    label: "Maintenance Report",
    stats: [
      { label: "Total Requests", value: "342", delta: "+12% vs last month" },
      { label: "Avg. Resolution Time", value: "4.2 hrs", delta: "-8% vs last month" },
      { label: "Completion Rate", value: "94%", delta: "+3% vs last month" },
      { label: "Satisfaction Score", value: "4.6/5", delta: "+0.2 vs last month" },
    ],
    chart: {
      title: "Monthly Maintenance Requests",
      totalLabel: "Total Requests",
      doneLabel: "Completed",
      totals: [40, 35, 46, 37, 41, 48, 55, 30],
      done: [20, 16, 22, 18, 20, 22, 27, 14],
    },
  },
  {
    key: "technician",
    label: "Technician Performance",
    stats: [
      { label: "Active Technicians", value: "5", delta: "+1 vs last month" },
      { label: "Jobs Completed", value: "268", delta: "+9% vs last month" },
      { label: "Avg. Job Time", value: "3.1 hrs", delta: "-6% vs last month" },
      { label: "Avg. Rating", value: "4.7/5", delta: "+0.1 vs last month" },
    ],
    chart: {
      title: "Jobs Assigned vs Completed",
      totalLabel: "Assigned",
      doneLabel: "Completed",
      totals: [38, 33, 44, 36, 40, 45, 52, 28],
      done: [30, 27, 36, 29, 34, 38, 44, 22],
    },
  },
  {
    key: "asset",
    label: "Asset Maintenance",
    stats: [
      { label: "Total Assets", value: "42", delta: "+2 vs last month" },
      { label: "Services Done", value: "86", delta: "+11% vs last month" },
      { label: "Overdue Services", value: "3", delta: "-2 vs last month" },
      { label: "Asset Uptime", value: "98%", delta: "+1% vs last month" },
    ],
    chart: {
      title: "Asset Services per Month",
      totalLabel: "Scheduled",
      doneLabel: "Completed",
      totals: [12, 10, 14, 11, 13, 15, 16, 9],
      done: [10, 9, 12, 10, 11, 13, 14, 7],
    },
  },
  {
    key: "inspection",
    label: "Inspection Reports",
    stats: [
      { label: "Inspections", value: "64", delta: "+8% vs last month" },
      { label: "Passed", value: "57", delta: "+6% vs last month" },
      { label: "Issues Raised", value: "19", delta: "-4 vs last month" },
      { label: "Pass Rate", value: "89%", delta: "+2% vs last month" },
    ],
    chart: {
      title: "Inspections per Month",
      totalLabel: "Scheduled",
      doneLabel: "Passed",
      totals: [8, 7, 10, 8, 9, 11, 12, 6],
      done: [7, 6, 9, 7, 8, 10, 11, 5],
    },
  },
  {
    key: "vendor",
    label: "Vendor Performance",
    stats: [
      { label: "Active Vendors", value: "8", delta: "+1 vs last month" },
      { label: "Jobs Assigned", value: "132", delta: "+7% vs last month" },
      { label: "On-time Rate", value: "92%", delta: "+4% vs last month" },
      { label: "Avg. Rating", value: "4.6/5", delta: "+0.1 vs last month" },
    ],
    chart: {
      title: "Vendor Jobs per Month",
      totalLabel: "Assigned",
      doneLabel: "On Time",
      totals: [16, 14, 19, 15, 18, 20, 23, 12],
      done: [14, 12, 17, 13, 16, 19, 21, 11],
    },
  },
  {
    key: "complaints",
    label: "Resident Complaints",
    stats: [
      { label: "Total Complaints", value: "96", delta: "-5% vs last month" },
      { label: "Resolved", value: "81", delta: "+7% vs last month" },
      { label: "Avg. Resolution", value: "2.4 days", delta: "-12% vs last month" },
      { label: "Satisfaction", value: "4.3/5", delta: "+0.2 vs last month" },
    ],
    chart: {
      title: "Complaints per Month",
      totalLabel: "Received",
      doneLabel: "Resolved",
      totals: [14, 12, 16, 13, 15, 11, 10, 8],
      done: [12, 10, 14, 11, 13, 9, 8, 6],
    },
  },
  {
    key: "facility",
    label: "Facility Usage",
    stats: [
      { label: "Total Bookings", value: "214", delta: "+15% vs last month" },
      { label: "Approved", value: "189", delta: "+13% vs last month" },
      { label: "Utilisation", value: "76%", delta: "+5% vs last month" },
      { label: "Peak Facility", value: "Community Hall", delta: "" },
    ],
    chart: {
      title: "Bookings per Month",
      totalLabel: "Requested",
      doneLabel: "Approved",
      totals: [24, 21, 28, 23, 27, 30, 34, 18],
      done: [21, 18, 25, 20, 24, 27, 30, 16],
    },
  },
  {
    key: "operational",
    label: "Operational Overview",
    stats: [
      { label: "Open Items", value: "27", delta: "-9% vs last month" },
      { label: "Completed This Month", value: "118", delta: "+10% vs last month" },
      { label: "SLA Compliance", value: "93%", delta: "+2% vs last month" },
      { label: "Overall Score", value: "4.5/5", delta: "+0.1 vs last month" },
    ],
    chart: {
      title: "Operations Opened vs Closed",
      totalLabel: "Opened",
      doneLabel: "Closed",
      totals: [44, 39, 52, 42, 47, 54, 60, 33],
      done: [38, 34, 46, 37, 42, 49, 54, 28],
    },
  },
];

export const CHART_BLUE = "#4a7fb5";
export const CHART_GREEN = "#3fae63";
