"use client";

import { useMemo, useState } from "react";
import { MapPin, Plus, UserRound } from "lucide-react";

import { GenerateReportModal } from "@/components/fs/field-reports/generate-report-modal";
import { ReportDetailModal } from "@/components/fs/field-reports/report-detail-modal";
import { FsFilterChips } from "@/components/fs/ui/filter-chips";
import { Pill } from "@/components/pm/ui/pill";
import { Card } from "@/components/ui/card";
import {
  byReportDate,
  FILTER_OF,
  REPORT_FILTERS,
  REPORT_STATUS_TONE,
  type FsFieldReport,
} from "@/lib/fs/field-reports-data";
import { useFsFieldReports } from "@/lib/fs/field-reports-store";
import { useSelectedFsProperty } from "@/lib/fs/properties";

function ReportCard({
  report,
  onOpen,
}: {
  report: FsFieldReport;
  onOpen: () => void;
}) {
  return (
    <Card>
      <button
        type="button"
        onClick={onOpen}
        aria-haspopup="dialog"
        className="flex w-full flex-col p-5 text-left transition-colors hover:bg-gray-50/70 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
      >
        <span className="flex flex-wrap items-center gap-3">
          <span className="font-mono text-[13px] text-gray-500">
            {report.id}
          </span>
          <Pill tone={REPORT_STATUS_TONE[report.status]}>{report.status}</Pill>
          <span className="ml-auto text-[13px] whitespace-nowrap text-muted">
            {report.date}
          </span>
        </span>

        <span className="mt-2 block text-[17px] font-bold text-ink">
          {report.type}
        </span>
        <span className="mt-1.5 block text-[15px] text-muted">
          {report.summary}
        </span>

        <span className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-gray-600">
          <span className="flex items-center gap-1.5">
            <MapPin aria-hidden="true" className="h-4 w-4 text-gray-400" />
            {report.location}
          </span>
          <span className="flex items-center gap-1.5">
            <UserRound aria-hidden="true" className="h-4 w-4 text-gray-400" />
            {report.author}
          </span>
        </span>
      </button>
    </Card>
  );
}

/** Everything filed on this property, newest first, filtered by kind. */
export function FsFieldReportsView() {
  const propertyId = useSelectedFsProperty();
  const reports = useFsFieldReports();

  const [filter, setFilter] = useState<string>(REPORT_FILTERS[0]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [generateOpen, setGenerateOpen] = useState(false);

  const visible = useMemo(
    () =>
      reports
        .filter(
          (report) =>
            report.propertyId === propertyId &&
            (filter === "All" || FILTER_OF[report.type] === filter),
        )
        .sort(byReportDate),
    [reports, propertyId, filter],
  );

  const openReport = reports.find((report) => report.id === openId) ?? null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[32px] leading-tight font-bold text-ink">
            Field Reports
          </h1>
          <p className="mt-1 text-[15px] text-muted">
            Site visits, inspections, and maintenance reports
          </p>
        </div>

        <button
          type="button"
          onClick={() => setGenerateOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-[15px] font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <Plus aria-hidden="true" className="h-[18px] w-[18px]" />
          Generate Report
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <FsFilterChips
          label="Filter reports by kind"
          options={REPORT_FILTERS}
          value={filter}
          onChange={setFilter}
        />
        <p className="text-[13px] text-muted">
          {visible.length} report{visible.length === 1 ? "" : "s"}
        </p>
      </div>

      {visible.length === 0 ? (
        <Card className="px-6 py-16 text-center text-[15px] text-muted">
          No reports of this kind have been filed.
        </Card>
      ) : (
        <ul className="space-y-4">
          {visible.map((report) => (
            <li key={report.id}>
              <ReportCard
                report={report}
                onOpen={() => setOpenId(report.id)}
              />
            </li>
          ))}
        </ul>
      )}

      {openReport && (
        <ReportDetailModal
          report={openReport}
          onClose={() => setOpenId(null)}
        />
      )}

      {generateOpen && (
        <GenerateReportModal onClose={() => setGenerateOpen(false)} />
      )}
    </div>
  );
}
