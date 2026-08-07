"use client";

import { SERIES_COLORS } from "@/lib/reports-data";

export const VB_W = 760;
export const VB_H = 320;
export const PAD = { top: 18, right: 18, bottom: 34, left: 58 };
export const PLOT_W = VB_W - PAD.left - PAD.right;
export const PLOT_H = VB_H - PAD.top - PAD.bottom;

export function ChartFrame({
  title,
  subtitle,
  labels,
  children,
}: {
  title: string;
  subtitle: string;
  labels: readonly string[];
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-hairline bg-white p-6 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-[15px] font-semibold text-ink">{title}</h2>
          <p className="mt-1 text-[13px] text-muted">{subtitle}</p>
        </div>

        <ul className="flex items-center gap-4">
          {labels.map((label, index) => (
            <li
              key={label}
              className="flex items-center gap-1.5 text-[13px] text-gray-600"
            >
              <span
                aria-hidden="true"
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: SERIES_COLORS[index] }}
              />
              {label}
            </li>
          ))}
        </ul>
      </div>

      <div className="relative mt-4">{children}</div>
    </section>
  );
}

/** Dashed horizontal grid line plus its y-axis label. */
export function GridLine({
  y,
  label,
}: {
  y: number;
  label: string;
}) {
  return (
    <g>
      <line
        x1={PAD.left}
        x2={VB_W - PAD.right}
        y1={y}
        y2={y}
        stroke="#e5e7eb"
        strokeWidth={1}
        strokeDasharray="4 4"
      />
      <text
        x={PAD.left - 12}
        y={y + 4}
        textAnchor="end"
        className="fill-gray-400"
        style={{ fontSize: 12 }}
      >
        {label}
      </text>
    </g>
  );
}

export function XLabels({ xs, months }: { xs: number[]; months: string[] }) {
  return (
    <g>
      {months.map((month, index) => (
        <text
          key={month}
          x={xs[index]}
          y={VB_H - 10}
          textAnchor="middle"
          className="fill-gray-500"
          style={{ fontSize: 12 }}
        >
          {month}
        </text>
      ))}
    </g>
  );
}

/**
 * Tooltip card. Positioned as a fraction of the chart width so it tracks the
 * hovered month, and flipped to the left near the right edge.
 */
export function Tooltip({
  x,
  title,
  rows,
}: {
  /** 0–1 across the plot area. */
  x: number;
  title: string;
  rows: { color: string; value: string }[];
}) {
  const flip = x > 0.72;

  return (
    <div
      className="pointer-events-none absolute top-[12%] z-10 transition-[left] duration-150 ease-out"
      style={{
        left: `${x * 100}%`,
        transform: `translateX(${flip ? "calc(-100% - 14px)" : "14px"})`,
      }}
    >
      <div className="rounded-xl bg-white px-4 py-3 shadow-[0_4px_16px_rgba(16,24,40,0.16)]">
        <p className="text-[15px] font-semibold text-ink">{title}</p>
        <ul className="mt-1.5 space-y-1">
          {rows.map((row, index) => (
            <li
              key={index}
              className="text-[15px] font-semibold"
              style={{ color: row.color }}
            >
              {row.value}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** Maps a pointer event to the nearest index along the x axis. */
export function nearestIndex(
  event: React.PointerEvent<SVGSVGElement>,
  count: number,
  xs: number[],
) {
  const rect = event.currentTarget.getBoundingClientRect();
  const xInVb = ((event.clientX - rect.left) / rect.width) * VB_W;

  let best = 0;
  let bestDistance = Infinity;
  for (let i = 0; i < count; i++) {
    const distance = Math.abs(xs[i] - xInVb);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = i;
    }
  }
  return best;
}
