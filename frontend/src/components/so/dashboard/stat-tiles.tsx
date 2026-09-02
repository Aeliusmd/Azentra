import { Card } from "@/components/ui/card";
import type { SoStat, SoStatTone } from "@/lib/so/dashboard-data";

/** Icon square tints — one per kind of figure, so the row scans by colour. */
const TONE: Record<SoStatTone, string> = {
  blue: "bg-[#eef3f9] text-[#2e6cad]",
  slate: "bg-gray-100 text-gray-500",
  green: "bg-green-50 text-green-600",
  amber: "bg-amber-50 text-amber-600",
  teal: "bg-teal-50 text-teal-600",
  rose: "bg-rose-50 text-rose-600",
};

/**
 * The figures across the top of the dashboard.
 *
 * Seven across on a wide desk monitor, wrapping down to two on a phone — a
 * guard reads these standing up, so the number carries the weight and the label
 * sits under it.
 */
export function SoStatTiles({ stats }: { stats: SoStat[] }) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 xl:gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <li key={stat.label}>
            <Card className="flex h-full items-center gap-3 px-4 py-4">
              <span
                aria-hidden="true"
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${TONE[stat.tone]}`}
              >
                <Icon className="h-[18px] w-[18px]" />
              </span>

              <span className="min-w-0">
                <span className="block text-[22px] leading-tight font-bold text-ink">
                  {stat.value}
                </span>
                <span className="mt-0.5 block truncate text-[13px] text-muted">
                  {stat.label}
                </span>
              </span>
            </Card>
          </li>
        );
      })}
    </ul>
  );
}
