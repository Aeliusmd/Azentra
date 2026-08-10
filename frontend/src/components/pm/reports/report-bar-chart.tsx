"use client";

import {
  CHART_BLUE,
  CHART_GREEN,
  REPORT_MONTHS,
  type ReportChart,
} from "@/lib/pm/reports-data";

const VB_W = 800;
const VB_H = 340;
const BASELINE = 296;
const TOP = 12;
const SIDE = 12;
/** Gap between the blue upper segment and the green lower one. */
const SPLIT = 4;

/**
 * Two-series column chart. The green series sits at the base of each column
 * with the blue series stacked above it, so the full column reads as the total.
 */
export function ReportBarChart({ chart }: { chart: ReportChart }) {
  const max = Math.max(...chart.totals);
  const slot = (VB_W - SIDE * 2) / REPORT_MONTHS.length;
  const barWidth = slot * 0.9;
  const scale = (value: number) => (value / max) * (BASELINE - TOP);

  return (
    <div className="relative rounded-xl border border-hairline bg-white p-6">
      {/* Absolute so tall columns rise alongside the heading, as in the design. */}
      <h2 className="absolute top-6 left-6 z-10 text-[19px] font-bold text-ink">
        {chart.title}
      </h2>

      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        className="h-auto w-full"
        role="img"
        aria-label={chart.title}
      >
        {REPORT_MONTHS.map((month, index) => {
          const x = SIDE + index * slot + (slot - barWidth) / 2;
          const doneTop = BASELINE - scale(chart.done[index]);
          const totalTop = BASELINE - scale(chart.totals[index]);
          const upperHeight = Math.max(0, doneTop - totalTop - SPLIT);

          return (
            <g key={month}>
              <rect
                x={x}
                y={totalTop}
                width={barWidth}
                height={upperHeight}
                rx={6}
                fill={CHART_BLUE}
                className="chart-bar"
                style={{
                  transformOrigin: `0 ${BASELINE}px`,
                  animationDelay: `${index * 45}ms`,
                }}
              />
              <rect
                x={x}
                y={doneTop}
                width={barWidth}
                height={BASELINE - doneTop}
                rx={6}
                fill={CHART_GREEN}
                className="chart-bar"
                style={{
                  transformOrigin: `0 ${BASELINE}px`,
                  animationDelay: `${index * 45}ms`,
                }}
              />
              <text
                x={x + barWidth / 2}
                y={BASELINE + 26}
                textAnchor="middle"
                className="fill-gray-500"
                style={{ fontSize: 14 }}
              >
                {month}
              </text>
            </g>
          );
        })}
      </svg>

      <ul className="mt-2 flex flex-wrap items-center justify-center gap-6">
        {[
          { label: chart.totalLabel, color: CHART_BLUE },
          { label: chart.doneLabel, color: CHART_GREEN },
        ].map((entry) => (
          <li
            key={entry.label}
            className="flex items-center gap-2 text-[15px] text-gray-600"
          >
            <span
              aria-hidden="true"
              className="h-3 w-3 rounded-sm"
              style={{ background: entry.color }}
            />
            {entry.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
