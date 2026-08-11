/**
 * Mock data for Report Generation.
 *
 * The occupancy table is derived from `buildings-data.ts` towers, so it can't
 * drift from Building Management. Trend/revenue series and the revenue total
 * are seeded from the design.
 */

import { towers } from "./buildings-data";

/**
 * Series colours — brand green, navy and orange.
 *
 * Separation is excellent (worst adjacent pair ΔE 37.7 under colour-blind
 * simulation, 41.3 at normal vision), so the three towers are never confusable.
 *
 * Two caveats to keep in mind if these are edited:
 *  - Navy is very dark (L 0.28) and low-chroma, so it reads as near-black
 *    rather than blue, and carries more visual weight than the other two.
 *  - Green (2.8:1) and orange (2.73:1) fall under 3:1 against white, so colour
 *    must never be the only cue — the legend, tooltip values and occupancy
 *    table all name the tower in text.
 */
export const SERIES_COLORS = ["#3C7FAF", "#EB5009", "#10968B"] as const;
export const SERIES_LABELS = ["A", "B", "C"] as const;

export type ReportTab = {
  key: string;
  label: string;
};

export const REPORT_TABS: ReportTab[] = [
  { key: "occupancy", label: "Occupancy Report" },
  { key: "financial", label: "Financial Report" },
  { key: "maintenance", label: "Maintenance Report" },
  { key: "user-activity", label: "User Activity" },
  { key: "common-area", label: "Common Area Usage" },
  { key: "violations", label: "Violations & Notices" },
];

export const DATE_RANGES = [
  "Today",
  "Last 7 days",
  "Last 30 days",
  "This quarter",
  "This year",
];

/** Monthly occupancy rate per tower (%). */
export const occupancyTrend = {
  months: ["Feb", "Mar", "Apr", "May", "Jun", "Jul"],
  series: [
    { label: "A", values: [82, 84, 83, 85, 86, 87.5] },
    { label: "B", values: [78, 80, 82, 84.5, 87, 90.5] },
    { label: "C", values: [85, 87, 88, 90, 91.5, 92.5] },
  ],
};

/** Monthly revenue per tower ($). */
export const revenueByTower = {
  months: ["Mar", "Apr", "May", "Jun", "Jul"],
  series: [
    { label: "A", values: [42000, 40000, 43000, 41000, 43000] },
    { label: "B", values: [38000, 41000, 42000, 43500, 45000] },
    { label: "C", values: [63000, 60500, 69000, 67000, 70500] },
  ],
};

export const totalRevenue = 158200;

export const reportDeltas = {
  totalUnits: "+0%",
  occupied: "+2%",
  vacant: "-5%",
  revenue: "+3.4%",
};

export type OccupancyRow = {
  tower: string;
  total: number;
  occupied: number;
  vacant: number;
  maintenance: number;
  rate: string;
};

export const occupancyByTower: OccupancyRow[] = towers.map((tower) => ({
  tower: tower.name,
  total: tower.totalUnits,
  occupied: tower.occupied,
  vacant: tower.vacant,
  maintenance: tower.maintenance,
  rate:
    tower.totalUnits === 0
      ? "0%"
      : `${((tower.occupied / tower.totalUnits) * 100).toFixed(1).replace(/\.0$/, "")}%`,
}));
