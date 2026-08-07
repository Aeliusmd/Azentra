"use client";

import { useState } from "react";
import {
  Building2,
  ChevronDown,
  CircleAlert,
  CircleDollarSign,
  FileSpreadsheet,
  FileText,
  House,
  UserRound,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import { OccupancyTrendChart } from "@/components/reports/occupancy-trend-chart";
import { RevenueChart } from "@/components/reports/revenue-chart";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { recordAudit } from "@/lib/audit-store";
import { property } from "@/lib/dashboard-data";
import {
  DATE_RANGES,
  REPORT_TABS,
  occupancyByTower,
  reportDeltas,
  totalRevenue,
} from "@/lib/reports-data";

const TAB_ICONS: Record<string, LucideIcon> = {
  occupancy: House,
  financial: CircleDollarSign,
  maintenance: Wrench,
  "user-activity": UserRound,
  "common-area": Building2,
  violations: CircleAlert,
};

const TILES = {
  navy: "bg-[#2c4c73]",
  green: "bg-brand",
  slate: "bg-[#647a91]",
  amber: "bg-[#e8a33d]",
} as const;

function StatTile({
  icon: Icon,
  tone,
  value,
  label,
  delta,
}: {
  icon: LucideIcon;
  tone: keyof typeof TILES;
  value: string;
  label: string;
  delta: string;
}) {
  const negative = delta.startsWith("-");
  return (
    <div className="rounded-lg border border-hairline bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
      <div className="flex items-start justify-between">
        <span
          aria-hidden="true"
          className={`flex h-10 w-10 items-center justify-center rounded-lg text-white ${TILES[tone]}`}
        >
          <Icon className="h-[18px] w-[18px]" />
        </span>
        <span
          className={`text-[13px] font-medium ${negative ? "text-rose-600" : "text-[#3fae63]"}`}
        >
          {delta}
        </span>
      </div>
      <p className="mt-4 text-[26px] leading-none font-bold text-ink">{value}</p>
      <p className="mt-2 text-[13px] text-muted">{label}</p>
    </div>
  );
}

/** Builds a CSV of the occupancy table and downloads it. */
function downloadCsv() {
  const header = ["Tower", "Total", "Occupied", "Vacant", "Maintenance", "Rate"];
  const rows = occupancyByTower.map((row) => [
    row.tower,
    row.total,
    row.occupied,
    row.vacant,
    row.maintenance,
    row.rate,
  ]);
  const csv = [header, ...rows].map((row) => row.join(",")).join("\n");

  const url = URL.createObjectURL(
    new Blob([csv], { type: "text/csv;charset=utf-8" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = "occupancy-report.csv";
  link.click();
  URL.revokeObjectURL(url);

  recordAudit({
    action: "Report Exported",
    module: "Reports",
    details: `Occupancy report exported as CSV — ${occupancyByTower.length} towers`,
  });
}

export function ReportsView() {
  const [tab, setTab] = useState("occupancy");
  const [range, setRange] = useState(DATE_RANGES[0]);

  const money = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Report Generation"
        subtitle="Generate and export property reports"
        action={
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={downloadCsv}
              className="flex items-center gap-2 rounded-md border border-hairline bg-white px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
            >
              <FileSpreadsheet aria-hidden="true" className="h-4 w-4" />
              Export Excel
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center gap-2 rounded-md border border-hairline bg-white px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
            >
              <FileText aria-hidden="true" className="h-4 w-4" />
              Export PDF
            </button>
          </div>
        }
      />

      <Card className="p-2">
        <div
          role="tablist"
          aria-label="Report type"
          className="flex flex-wrap gap-1"
        >
          {REPORT_TABS.map(({ key, label }) => {
            const Icon = TAB_ICONS[key];
            const selected = tab === key;
            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setTab(key)}
                className={`flex items-center gap-2 rounded-md px-4 py-2.5 text-[13px] font-medium transition-colors focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none ${
                  selected
                    ? "bg-brand text-white"
                    : "text-gray-600 hover:bg-gray-50 hover:text-ink"
                }`}
              >
                <Icon aria-hidden="true" className="h-4 w-4" />
                {label}
              </button>
            );
          })}
        </div>
      </Card>

      <div className="flex items-center gap-3">
        <label htmlFor="date-range" className="text-[13px] text-gray-600">
          Date Range:
        </label>
        <div className="relative">
          <select
            id="date-range"
            value={range}
            onChange={(event) => setRange(event.target.value)}
            className="appearance-none rounded-md border border-hairline bg-white py-2.5 pr-9 pl-3.5 text-sm text-ink outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20"
          >
            {DATE_RANGES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <ChevronDown
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400"
          />
        </div>
      </div>

      {tab !== "occupancy" ? (
        <Card className="px-6 py-16 text-center">
          <p className="text-[15px] font-semibold text-ink">
            {REPORT_TABS.find((item) => item.key === tab)?.label}
          </p>
          <p className="mt-1 text-[13px] text-muted">
            This report has not been built yet.
          </p>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <StatTile
              icon={House}
              tone="navy"
              value={String(property.totalUnits)}
              label="Total Units"
              delta={reportDeltas.totalUnits}
            />
            <StatTile
              icon={UserRound}
              tone="green"
              value={String(property.occupied)}
              label="Occupied"
              delta={reportDeltas.occupied}
            />
            <StatTile
              icon={House}
              tone="slate"
              value={String(property.vacant)}
              label="Vacant"
              delta={reportDeltas.vacant}
            />
            <StatTile
              icon={CircleDollarSign}
              tone="amber"
              value={money.format(totalRevenue)}
              label="Total Revenue"
              delta={reportDeltas.revenue}
            />
          </div>

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            <OccupancyTrendChart />
            <RevenueChart />
          </div>

          <Card>
            <h2 className="px-6 py-5 text-[15px] font-semibold text-ink">
              Occupancy by Tower
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left">
                <thead>
                  <tr className="border-y border-hairline">
                    {[
                      "Tower",
                      "Total",
                      "Occupied",
                      "Vacant",
                      "Maintenance",
                      "Rate",
                    ].map((heading) => (
                      <th
                        key={heading}
                        scope="col"
                        className="px-6 py-3 text-xs font-medium text-muted"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline">
                  {occupancyByTower.map((row) => (
                    <tr
                      key={row.tower}
                      className="transition-colors hover:bg-gray-50/70"
                    >
                      <th
                        scope="row"
                        className="px-6 py-4 text-left text-[13px] font-semibold text-ink"
                      >
                        {row.tower}
                      </th>
                      <td className="px-6 py-4 text-[13px] text-gray-600">
                        {row.total}
                      </td>
                      <td className="px-6 py-4 text-[13px] font-semibold text-[#3fae63]">
                        {row.occupied}
                      </td>
                      <td className="px-6 py-4 text-[13px] text-gray-600">
                        {row.vacant}
                      </td>
                      <td className="px-6 py-4 text-[13px] text-gray-600">
                        {row.maintenance}
                      </td>
                      <td className="px-6 py-4 text-[13px] font-semibold text-ink">
                        {row.rate}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
