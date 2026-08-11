import type { LucideIcon } from "lucide-react";

/** Soft-tinted icon chip — lighter than the manager tiles, which are filled. */
const CHIP = {
  slate: "bg-[#eef2f6] text-[#5b7f9c]",
  amber: "bg-amber-50 text-amber-600",
  red: "bg-rose-50 text-rose-600",
  green: "bg-green-50 text-green-600",
} as const;

export type StatTone = keyof typeof CHIP;

export function TechStatCard({
  icon: Icon,
  tone,
  value,
  label,
}: {
  icon: LucideIcon;
  tone: StatTone;
  value: number | string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-lg border border-hairline bg-white px-5 py-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
      <span
        aria-hidden="true"
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${CHIP[tone]}`}
      >
        <Icon className="h-[18px] w-[18px]" />
      </span>
      <span className="min-w-0">
        <span className="block text-[22px] leading-none font-bold text-ink">
          {value}
        </span>
        <span className="mt-1.5 block truncate text-[13px] text-muted">
          {label}
        </span>
      </span>
    </div>
  );
}
