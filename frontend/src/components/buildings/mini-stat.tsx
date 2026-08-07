import type { LucideIcon } from "lucide-react";

const TILES = {
  amber: "bg-amber-100 text-amber-600",
  green: "bg-green-100 text-green-600",
  purple: "bg-purple-100 text-purple-600",
  teal: "bg-teal-100 text-teal-600",
} as const;

export type MiniStatTone = keyof typeof TILES;

export function MiniStat({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  tone: MiniStatTone;
}) {
  return (
    <div className="rounded-lg border border-hairline bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      <span
        aria-hidden="true"
        className={`flex h-9 w-9 items-center justify-center rounded-lg ${TILES[tone]}`}
      >
        <Icon className="h-4 w-4" />
      </span>

      <p className="mt-4 text-xl leading-none font-bold text-ink">{value}</p>
      <p className="mt-2 text-[13px] text-muted">{label}</p>
    </div>
  );
}
