import type { LucideIcon } from "lucide-react";

/* --------------------------------- Stat tile -------------------------------- */

const TILE_BG = {
  gray: "bg-[#7c8794]",
  green: "bg-brand",
  slate: "bg-[#5b7f9c]",
  amber: "bg-[#e8a33d]",
  navy: "bg-[#2e6cad]",
  cyan: "bg-[#2fa8cc]",
  red: "bg-[#e0554d]",
} as const;

export type TileTone = keyof typeof TILE_BG;

/** Compact summary tile — icon chip, count, label. */
export function StatTile({
  icon: Icon,
  tone,
  value,
  label,
}: {
  icon: LucideIcon;
  tone: TileTone;
  value: number | string;
  label: string;
}) {
  return (
    <div className="rounded-lg border border-hairline bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
      <span
        aria-hidden="true"
        className={`flex h-9 w-9 items-center justify-center rounded-lg text-white ${TILE_BG[tone]}`}
      >
        <Icon className="h-[18px] w-[18px]" />
      </span>
      <p className="mt-4 text-[26px] leading-none font-bold text-ink">{value}</p>
      <p className="mt-1.5 text-xs text-muted">{label}</p>
    </div>
  );
}

/* ------------------------------- Highlight card ------------------------------ */

const HIGHLIGHT = {
  amber: {
    box: "border-amber-200 bg-amber-50/70",
    icon: "text-amber-600",
    value: "text-amber-700",
  },
  red: {
    box: "border-rose-200 bg-rose-50/70",
    icon: "text-rose-600",
    value: "text-rose-700",
  },
  green: {
    box: "border-green-200 bg-green-50/70",
    icon: "text-green-600",
    value: "text-green-700",
  },
  blue: {
    box: "border-blue-200 bg-blue-50/60",
    icon: "text-blue-600",
    value: "text-blue-700",
  },
} as const;

export type HighlightTone = keyof typeof HIGHLIGHT;

/** Tinted attention card — the four counts a manager acts on first. */
export function HighlightCard({
  icon: Icon,
  tone,
  label,
  value,
}: {
  icon: LucideIcon;
  tone: HighlightTone;
  label: string;
  value: number;
}) {
  const styles = HIGHLIGHT[tone];

  return (
    <div className={`rounded-lg border p-5 ${styles.box}`}>
      <div className="flex items-center gap-2.5">
        <Icon aria-hidden="true" className={`h-[18px] w-[18px] ${styles.icon}`} />
        <span className="text-[13px] font-semibold text-ink">{label}</span>
      </div>
      <p className={`mt-3 text-[28px] leading-none font-bold ${styles.value}`}>
        {value}
      </p>
    </div>
  );
}
