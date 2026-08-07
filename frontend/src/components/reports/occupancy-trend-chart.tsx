"use client";

import { useId, useState } from "react";

import {
  ChartFrame,
  GridLine,
  PAD,
  PLOT_H,
  PLOT_W,
  Tooltip,
  VB_H,
  VB_W,
  XLabels,
  nearestIndex,
} from "@/components/reports/chart-parts";
import { SERIES_COLORS, occupancyTrend } from "@/lib/reports-data";

const Y_MIN = 70;
const Y_MAX = 100;
const TICKS = [70, 78, 86, 94, 100];

const { months, series } = occupancyTrend;
const xs = months.map(
  (_, index) => PAD.left + (index * PLOT_W) / (months.length - 1),
);
const toY = (value: number) =>
  PAD.top + PLOT_H - ((value - Y_MIN) / (Y_MAX - Y_MIN)) * PLOT_H;

/** Smooth path through the points using mirrored control points. */
function smoothPath(values: number[]) {
  const points = values.map((value, index) => [xs[index], toY(value)]);
  let d = `M ${points[0][0]} ${points[0][1]}`;

  for (let i = 0; i < points.length - 1; i++) {
    const [x0, y0] = points[i];
    const [x1, y1] = points[i + 1];
    const cx = (x0 + x1) / 2;
    d += ` C ${cx} ${y0}, ${cx} ${y1}, ${x1} ${y1}`;
  }
  return d;
}

export function OccupancyTrendChart() {
  const gradientId = useId();
  const [active, setActive] = useState<number | null>(null);

  const baseline = PAD.top + PLOT_H;

  return (
    <ChartFrame
      title="Occupancy Trend"
      subtitle="Monthly occupancy rate by tower (%)"
      labels={series.map((s) => s.label)}
    >
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        className="h-auto w-full touch-none"
        role="img"
        aria-label="Monthly occupancy rate by tower, February to July"
        onPointerMove={(event) =>
          setActive(nearestIndex(event, months.length, xs))
        }
        onPointerLeave={() => setActive(null)}
      >
        <defs>
          {series.map((s, index) => (
            <linearGradient
              key={s.label}
              id={`${gradientId}-${index}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor={SERIES_COLORS[index]}
                stopOpacity={0.18}
              />
              <stop
                offset="100%"
                stopColor={SERIES_COLORS[index]}
                stopOpacity={0}
              />
            </linearGradient>
          ))}
        </defs>

        {TICKS.map((tick) => (
          <GridLine key={tick} y={toY(tick)} label={`${tick}%`} />
        ))}

        {/* Crosshair glides between months rather than jumping. */}
        {active !== null && (
          <line
            x1={xs[active]}
            x2={xs[active]}
            y1={PAD.top}
            y2={baseline}
            stroke="#9ca3af"
            strokeWidth={1}
            style={{ transition: "all 150ms ease-out" }}
          />
        )}

        {series.map((s, index) => {
          const line = smoothPath(s.values);
          return (
            <g key={s.label}>
              <path
                d={`${line} L ${xs[xs.length - 1]} ${baseline} L ${xs[0]} ${baseline} Z`}
                fill={`url(#${gradientId}-${index})`}
                className="chart-area"
              />
              <path
                d={line}
                fill="none"
                stroke={SERIES_COLORS[index]}
                strokeWidth={2.5}
                strokeLinecap="round"
                pathLength={1}
                className="chart-line"
                style={{ animationDelay: `${index * 120}ms` }}
              />
            </g>
          );
        })}

        {series.map((s, index) =>
          s.values.map((value, i) => (
            <circle
              key={`${s.label}-${i}`}
              cx={xs[i]}
              cy={toY(value)}
              r={active === i ? 6 : 3.5}
              fill={SERIES_COLORS[index]}
              stroke="#ffffff"
              strokeWidth={active === i ? 2 : 0}
              style={{ transition: "r 150ms ease-out" }}
            />
          )),
        )}

        <XLabels xs={xs} months={months} />
      </svg>

      {active !== null && (
        <Tooltip
          x={(xs[active] - PAD.left) / PLOT_W}
          title={months[active]}
          rows={series.map((s, index) => ({
            color: SERIES_COLORS[index],
            value: `${s.values[active]}%`,
          }))}
        />
      )}
    </ChartFrame>
  );
}
