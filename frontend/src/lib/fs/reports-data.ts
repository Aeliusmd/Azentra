import {
  ClipboardList,
  MapPin,
  ScanSearch,
  ChartColumn,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import type { FsInspection } from "@/lib/fs/inspections-data";
import { checkTally } from "@/lib/fs/inspections-data";
import type { SiteVisit } from "@/lib/fs/site-visits-data";
import type { FsTechnician } from "@/lib/fs/technicians-data";
import {
  activeJobCount,
  durationLabel,
} from "@/lib/fs/technicians-data";
import type { PdfLine } from "@/lib/fs/report-pdf";
import { wrapText } from "@/lib/fs/report-pdf";
import type { FsWorkOrder } from "@/lib/fs/work-orders-data";
import { locationLabel } from "@/lib/fs/work-orders-data";

/**
 * The reports the supervisor can run, and what each one counts.
 *
 * Every figure below is read off the live stores at the moment the report is
 * generated — nothing here is a canned number, so a job reassigned this morning
 * shows up in the summary this afternoon.
 */

export const REPORT_KINDS = [
  {
    id: "work-orders",
    title: "Work Order Summary",
    description:
      "Completed jobs, pending jobs, overdue, emergency, and reopened jobs summary",
    icon: ClipboardList,
    tone: "green",
  },
  {
    id: "technicians",
    title: "Technician Performance",
    description:
      "Performance metrics, workload, completion times, and productivity analysis",
    icon: ChartColumn,
    tone: "navy",
  },
  {
    id: "maintenance",
    title: "Maintenance Report",
    description: "Maintenance by tower, unit, category, and asset breakdown",
    icon: Wrench,
    tone: "amber",
  },
  {
    id: "inspections",
    title: "Inspection Report",
    description:
      "Completed inspections, failed items, open issues, and follow-up actions",
    icon: ScanSearch,
    tone: "slate",
  },
  {
    id: "site-visits",
    title: "Site Visit Summary",
    description: "Site visit summary, issues found, and outstanding actions",
    icon: MapPin,
    tone: "green",
  },
] as const satisfies readonly {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  tone: string;
}[];

export type FsReportKindId = (typeof REPORT_KINDS)[number]["id"];

export function reportKind(id: FsReportKindId) {
  return REPORT_KINDS.find((kind) => kind.id === id) ?? REPORT_KINDS[0];
}

/** Everything a report can draw on, gathered by the page from the stores. */
export type ReportSource = {
  property: string;
  generatedOn: string;
  orders: FsWorkOrder[];
  technicians: FsTechnician[];
  inspections: FsInspection[];
  visits: SiteVisit[];
};

/* ------------------------------ Line helpers ------------------------------ */

const heading = (text: string): PdfLine => ({
  text,
  size: 13,
  bold: true,
  gap: 20,
});

const row = (label: string, value: string | number): PdfLine => ({
  text: `${label}: ${value}`,
  size: 11,
  gap: 4,
});

const body = (text: string): PdfLine[] =>
  wrapText(text, 11).map((line) => ({ text: line, size: 11, gap: 4 }));

/** Counts each distinct value of a field, biggest group first. */
function tally<T>(items: T[], of: (item: T) => string) {
  const counts = new Map<string, number>();
  for (const item of items) {
    const key = of(item);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
}

/* -------------------------------- Builders -------------------------------- */

function workOrderReport(source: ReportSource): PdfLine[] {
  const { orders } = source;
  const open = orders.filter((order) => order.status !== "Completed");

  return [
    heading("Totals"),
    row("Work orders", orders.length),
    row(
      "Completed",
      orders.filter((order) => order.status === "Completed").length,
    ),
    row("Open", open.length),
    row(
      "Overdue",
      orders.filter((order) => order.status === "Overdue").length,
    ),
    row(
      "Unassigned",
      orders.filter((order) => order.technician === null).length,
    ),
    row(
      "Emergency / critical",
      orders.filter(
        (order) => order.priority === "Critical" || order.workType === "Emergency",
      ).length,
    ),

    heading("By status"),
    ...tally(orders, (order) => order.status).map(([status, count]) =>
      row(status, count),
    ),

    heading("By priority"),
    ...tally(orders, (order) => order.priority).map(([priority, count]) =>
      row(priority, count),
    ),

    heading("Open jobs needing attention"),
    ...(open.length === 0
      ? body("Nothing open on this property.")
      : open
          .slice(0, 12)
          .map((order) =>
            row(
              order.id,
              `${order.title} - ${order.technician ?? "Unassigned"} (${order.status})`,
            ),
          )),
  ];
}

function technicianReport(source: ReportSource): PdfLine[] {
  const { technicians, orders } = source;

  return [
    heading("Roster"),
    row("Technicians", technicians.length),
    row(
      "Available now",
      technicians.filter((tech) => tech.availability === "Available").length,
    ),
    row("Open jobs assigned", orders.filter((o) => o.technician).length),

    heading("Per technician"),
    ...technicians.flatMap((tech) => [
      { text: tech.name, size: 11, bold: true, gap: 10 } as PdfLine,
      row("  Completed", tech.completedJobs),
      row("  On time", `${tech.onTimeRate}%`),
      row("  Average time", durationLabel(tech.avgResolutionHours)),
      row("  Rating", tech.rating.toFixed(1)),
      row("  Open jobs", activeJobCount(orders, tech.name)),
    ]),
  ];
}

function maintenanceReport(source: ReportSource): PdfLine[] {
  const { orders } = source;

  return [
    heading("By tower"),
    ...tally(orders, (order) => order.building || "Unspecified").map(
      ([building, count]) => row(building, count),
    ),

    heading("By category"),
    ...tally(orders, (order) => order.category).map(([category, count]) =>
      row(category, count),
    ),

    heading("By location"),
    ...tally(orders, (order) => locationLabel(order, " - "))
      .slice(0, 15)
      .map(([place, count]) => row(place, count)),

    heading("Materials drawn"),
    ...(() => {
      const lines = tally(
        orders.flatMap((order) => order.materials),
        (material) => material.name,
      ).map(([name, count]) => row(name, count));

      return lines.length > 0 ? lines : body("No materials logged.");
    })(),
  ];
}

function inspectionReport(source: ReportSource): PdfLine[] {
  const { inspections } = source;

  const failed = inspections.flatMap((inspection) =>
    inspection.checklist
      .filter((item) => item.passed === false)
      .map((item) => ({ inspection, item })),
  );

  return [
    heading("Totals"),
    row("Inspections", inspections.length),
    row(
      "Completed",
      inspections.filter((item) => item.status === "Completed").length,
    ),
    row(
      "Scheduled",
      inspections.filter((item) => item.status === "Scheduled").length,
    ),
    row("Failed checks", failed.length),

    heading("By type"),
    ...tally(inspections, (inspection) => inspection.type).map(
      ([type, count]) => row(type, count),
    ),

    heading("Failed items"),
    ...(failed.length === 0
      ? body("No failed checks on record.")
      : failed.map(({ inspection, item }) =>
          row(inspection.id, `${item.label} (${inspection.title})`),
        )),

    heading("Checks outstanding"),
    ...inspections
      .filter((inspection) => inspection.status === "Scheduled")
      .map((inspection) => {
        const { passed, failed: failedCount, unmarked } = checkTally(
          inspection.checklist,
        );
        return row(
          inspection.id,
          `${unmarked} unmarked, ${passed} passed, ${failedCount} failed`,
        );
      }),
  ];
}

function siteVisitReport(source: ReportSource): PdfLine[] {
  const { visits } = source;
  const followUps = visits.filter((visit) => visit.followUp);

  return [
    heading("Totals"),
    row("Site visits", visits.length),
    ...tally(visits, (visit) => visit.status).map(([status, count]) =>
      row(status, count),
    ),

    heading("By purpose"),
    ...tally(visits, (visit) => visit.purpose).map(([purpose, count]) =>
      row(purpose, count),
    ),

    heading("Observations"),
    ...(() => {
      const recorded = visits.filter((visit) => visit.observations);
      return recorded.length === 0
        ? body("No observations recorded.")
        : recorded.flatMap((visit) => [
            { text: `${visit.id} - ${visit.purpose}`, size: 11, bold: true, gap: 10 } as PdfLine,
            ...body(visit.observations),
          ]);
    })(),

    heading("Outstanding actions"),
    ...(followUps.length === 0
      ? body("Nothing outstanding.")
      : followUps.flatMap((visit) => [
          { text: visit.id, size: 11, bold: true, gap: 10 } as PdfLine,
          ...body(visit.followUp ?? ""),
        ])),
  ];
}

const BUILDERS: Record<FsReportKindId, (source: ReportSource) => PdfLine[]> = {
  "work-orders": workOrderReport,
  technicians: technicianReport,
  maintenance: maintenanceReport,
  inspections: inspectionReport,
  "site-visits": siteVisitReport,
};

/** The finished page: a masthead, then whatever the chosen report counts. */
export function buildReportLines(
  id: FsReportKindId,
  source: ReportSource,
): PdfLine[] {
  const kind = reportKind(id);

  return [
    { text: "Azentra", size: 10, bold: true },
    { text: kind.title, size: 20, bold: true, gap: 18 },
    { text: source.property, size: 11, gap: 10 },
    { text: `Generated: ${source.generatedOn}`, size: 11, gap: 4 },
    { text: "Prepared by: Carlos Rivera (Field Supervisor)", size: 11, gap: 4 },
    ...BUILDERS[id](source),
  ];
}
