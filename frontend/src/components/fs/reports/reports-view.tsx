"use client";

import { useCallback } from "react";
import { FileText } from "lucide-react";

import { Card } from "@/components/ui/card";
import { SHORT_MONTHS } from "@/lib/fs/calendar-data";
import { TODAY } from "@/lib/fs/dashboard-data";
import { useFsInspections } from "@/lib/fs/inspections-store";
import { propertyName, useSelectedFsProperty } from "@/lib/fs/properties";
import { downloadPdf } from "@/lib/fs/report-pdf";
import {
  buildReportLines,
  REPORT_KINDS,
  reportKind,
  type FsReportKindId,
  type ReportSource,
} from "@/lib/fs/reports-data";
import { recordReport, useFsRecentReports } from "@/lib/fs/reports-store";
import { useFsSiteVisits } from "@/lib/fs/site-visits-store";
import { techniciansAt } from "@/lib/fs/technicians-data";
import { showFsToast } from "@/lib/fs/toast-store";
import { useFsWorkOrders } from "@/lib/fs/work-orders-store";

/** Icon square colours, one per report. */
const ICON_TONE = {
  green: "bg-[#3f9e63]",
  navy: "bg-[#2e6cad]",
  amber: "bg-[#e8a33d]",
  slate: "bg-[#5b7c99]",
} as const;

/** `2026-08-12` → `Aug 12, 2026`, the format the recent rows use. */
function longDay(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return `${SHORT_MONTHS[month - 1]} ${day}, ${year}`;
}

/** `Work Order Summary` → `work-order-summary-2026-08-12.pdf`. */
function fileName(title: string, iso: string) {
  return `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-${iso}.pdf`;
}

/**
 * Runs a report over the live stores and hands back the PDF. Nothing is filed
 * on a server — the report is the state of the property at the moment it ran.
 */
export function FsReportsView() {
  const propertyId = useSelectedFsProperty();
  const orders = useFsWorkOrders();
  const inspections = useFsInspections();
  const visits = useFsSiteVisits();
  const recent = useFsRecentReports();

  const generate = useCallback(
    (id: FsReportKindId, title: string, remember: boolean) => {
      const source: ReportSource = {
        property: propertyName(propertyId),
        generatedOn: longDay(TODAY),
        orders: orders.filter((order) => order.propertyId === propertyId),
        technicians: techniciansAt(propertyId),
        inspections: inspections.filter(
          (inspection) => inspection.propertyId === propertyId,
        ),
        visits: visits.filter((visit) => visit.propertyId === propertyId),
      };

      downloadPdf(fileName(title, TODAY), buildReportLines(id, source));
      if (remember) recordReport(id, title, longDay(TODAY));
      showFsToast(`${title} downloaded`);
    },
    [propertyId, orders, inspections, visits],
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[32px] leading-tight font-bold text-ink">
          Reports
        </h1>
        <p className="mt-1 text-[15px] text-muted">
          Generate field operations reports
        </p>
      </div>

      <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {REPORT_KINDS.map((kind) => {
          const Icon = kind.icon;

          return (
            <li key={kind.id}>
              <Card className="flex h-full flex-col p-5">
                <span
                  aria-hidden="true"
                  className={`flex h-10 w-10 items-center justify-center rounded-lg text-white ${ICON_TONE[kind.tone]}`}
                >
                  <Icon className="h-5 w-5" />
                </span>

                <h2 className="mt-4 text-[17px] font-bold text-ink">
                  {kind.title}
                </h2>
                <p className="mt-1.5 text-[15px] text-muted">
                  {kind.description}
                </p>

                {/* Pushed to the bottom so buttons line up across a row, with
                    a floor under it when the description runs short. */}
                <div className="mt-auto pt-5">
                  <button
                    type="button"
                    onClick={() => generate(kind.id, kind.title, true)}
                    className="w-full rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none"
                  >
                    Generate Report
                  </button>
                </div>
              </Card>
            </li>
          );
        })}
      </ul>

      <Card className="p-5">
        <h2 className="text-[17px] font-bold text-ink">Recent Reports</h2>

        <ul className="mt-2 divide-y divide-hairline">
          {recent.map((report) => (
            <li
              key={report.id}
              className="flex flex-wrap items-center gap-3 py-3.5"
            >
              <span
                aria-hidden="true"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500"
              >
                <FileText className="h-4 w-4" />
              </span>

              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-semibold text-ink">
                  {report.title}
                </span>
                <span className="mt-0.5 block text-[13px] text-muted">
                  {report.date} · {reportKind(report.kind).title}
                </span>
              </span>

              <button
                type="button"
                onClick={() => generate(report.kind, report.title, false)}
                className="shrink-0 text-[15px] font-medium text-brand transition-colors hover:text-brand-dark focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
              >
                Download
                <span className="sr-only"> {report.title}</span>
              </button>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
