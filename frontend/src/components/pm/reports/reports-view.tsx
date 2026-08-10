"use client";

import { useState } from "react";
import {
  CalendarDays,
  Download,
  FileSpreadsheet,
  Frown,
  Gauge,
  Package,
  Search,
  Truck,
  UserRound,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import { ReportBarChart } from "@/components/pm/reports/report-bar-chart";
import {
  REPORT_MONTHS,
  reports,
  type Report,
} from "@/lib/pm/reports-data";

const TAB_ICONS: Record<string, LucideIcon> = {
  maintenance: Wrench,
  technician: UserRound,
  asset: Package,
  inspection: Search,
  vendor: Truck,
  complaints: Frown,
  facility: CalendarDays,
  operational: Gauge,
};

/** Builds a CSV of the visible report and downloads it. */
function downloadCsv(report: Report) {
  const rows: (string | number)[][] = [
    ["Metric", "Value", "Change"],
    ...report.stats.map((stat) => [stat.label, stat.value, stat.delta]),
    [],
    ["Month", report.chart.totalLabel, report.chart.doneLabel],
    ...REPORT_MONTHS.map((month, index) => [
      month,
      report.chart.totals[index],
      report.chart.done[index],
    ]),
  ];

  const csv = rows.map((row) => row.join(",")).join("\n");
  const url = URL.createObjectURL(
    new Blob([csv], { type: "text/csv;charset=utf-8" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = `${report.key}-report.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function StatCard({
  label,
  value,
  delta,
}: {
  label: string;
  value: string;
  delta: string;
}) {
  const negative = delta.startsWith("-");

  return (
    <div className="rounded-xl border border-hairline bg-white px-6 py-5">
      <p className="text-[15px] text-muted">{label}</p>
      <p className="mt-2 text-[30px] leading-none font-bold text-ink">{value}</p>
      {delta && (
        <p
          className={`mt-3 text-[15px] ${negative ? "text-rose-600" : "text-brand"}`}
        >
          {delta}
        </p>
      )}
    </div>
  );
}

export function ReportsView() {
  const [tab, setTab] = useState(reports[0].key);
  const report = reports.find((item) => item.key === tab) ?? reports[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[32px] leading-tight font-bold text-ink">
            Reports
          </h1>
          <p className="mt-1 text-[15px] text-muted">
            Generate and analyze operational reports
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-2 rounded-lg border border-hairline bg-white px-5 py-3 text-[15px] font-medium text-ink transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
          >
            <Download aria-hidden="true" className="h-[18px] w-[18px]" />
            Export PDF
          </button>
          <button
            type="button"
            onClick={() => downloadCsv(report)}
            className="flex items-center gap-2 rounded-lg bg-brand px-5 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <FileSpreadsheet aria-hidden="true" className="h-[18px] w-[18px]" />
            Export Excel
          </button>
        </div>
      </div>

      <div
        role="tablist"
        aria-label="Report type"
        className="flex flex-wrap gap-3"
      >
        {reports.map((item) => {
          const Icon = TAB_ICONS[item.key];
          const selected = item.key === tab;

          return (
            <button
              key={item.key}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setTab(item.key)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-[15px] font-medium transition-colors focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none ${
                selected
                  ? "bg-brand text-white"
                  : "border border-hairline bg-white text-ink hover:bg-gray-50"
              }`}
            >
              <Icon aria-hidden="true" className="h-[18px] w-[18px]" />
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {report.stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <ReportBarChart key={report.key} chart={report.chart} />
    </div>
  );
}
