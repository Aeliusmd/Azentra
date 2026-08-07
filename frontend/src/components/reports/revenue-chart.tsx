"use client";

import { useState } from "react";

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
import { SERIES_COLORS, revenueByTower } from "@/lib/reports-data";

const Y_MAX = 80000;
const TICKS = [0, 20000, 40000, 60000, 80000];

const { months, series } = revenueByTower;
const BAND = PLOT_W / months.length;
const BAR_GAP = 2; // surface gap between adjacent bars
const GROUP_W = BAND * 0.58;
const BAR_W = (GROUP_W - BAR_GAP * (series.length - 1)) / series.length;

/** Band centres — bars sit inside a band, so labels centre on the band. */
const xs = months.map((_, index) => PAD.left + BAND * (index + 0.5));

const baseline = PAD.top + PLOT_H;
const toY = (value: number) => baseline - (value / Y_MAX) * PLOT_H;

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function RevenueChart() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <ChartFrame
      title="Revenue by Tower"
      subtitle="Monthly revenue breakdown ($)"
      labels={series.map((s) => s.label)}
    >
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        className="h-auto w-full touch-none"
        role="img"
        aria-label="Monthly revenue by tower, March to July"
        onPointerMove={(event) =>
          setActive(nearestIndex(event, months.length, xs))
        }
        onPointerLeave={() => setActive(null)}
      >
        {/* Highlight band slides between months. */}
        {active !== null && (
          <rect
            x={xs[active] - BAND / 2}
            y={PAD.top}
            width={BAND}
            height={PLOT_H}
            fill="#111827"
            opacity={0.06}
            style={{ transition: "x 150ms ease-out" }}
          />
        )}

        {TICKS.map((tick) => (
          <GridLine
            key={tick}
            y={toY(tick)}
            label={`$${(tick / 1000).toFixed(1)}k`}
          />
        ))}

        {series.map((s, seriesIndex) =>
          s.values.map((value, monthIndex) => {
            const height = Math.max(0, baseline - toY(value));
            const x =
              xs[monthIndex] -
              GROUP_W / 2 +
              seriesIndex * (BAR_W + BAR_GAP);

            return (
              <rect
                key={`${s.label}-${monthIndex}`}
                x={x}
                y={toY(value)}
                width={BAR_W}
                height={height}
                rx={4}
                fill={SERIES_COLORS[seriesIndex]}
                opacity={active === null || active === monthIndex ? 1 : 0.45}
                className="chart-bar"
                style={{
                  transformOrigin: `center ${baseline}px`,
                  transition: "opacity 150ms ease-out",
                  animationDelay: `${monthIndex * 60 + seriesIndex * 30}ms`,
                }}
              />
            );
          }),
        )}

        <XLabels xs={xs} months={months} />
      </svg>

      {active !== null && (
        <Tooltip
          x={(xs[active] - PAD.left) / PLOT_W}
          title={months[active]}
          rows={series.map((s, index) => ({
            color: SERIES_COLORS[index],
            value: money.format(s.values[active]),
          }))}
        />
      )}
    </ChartFrame>
  );
}
