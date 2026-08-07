import Link from "next/link";
import { ArrowUpRight, type LucideIcon } from "lucide-react";

const TILES = {
  navy: "bg-[#2c4c73]",
  green: "bg-brand",
  slate: "bg-[#647a91]",
  amber: "bg-[#e8a33d]",
} as const;

export type StatTone = keyof typeof TILES;

export function StatCard({
  label,
  value,
  icon: Icon,
  tone,
  href,
}: {
  label: string;
  value: number | string;
  icon: LucideIcon;
  tone: StatTone;
  href: string;
}) {
  return (
    <Link
      href={href}
      // The whole card is the target — the arrow is just the affordance.
      className="group block rounded-lg border border-hairline bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-[border-color,box-shadow] hover:border-brand hover:shadow-[0_2px_8px_rgba(16,24,40,0.08)] focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none"
    >
      <div className="flex items-start justify-between">
        <span
          aria-hidden="true"
          className={`flex h-11 w-11 items-center justify-center rounded-lg text-white ${TILES[tone]}`}
        >
          <Icon className="h-5 w-5" />
        </span>
        <ArrowUpRight
          aria-hidden="true"
          className="h-4 w-4 text-gray-300 transition-colors group-hover:text-brand"
        />
      </div>

      <p className="mt-5 text-[28px] leading-none font-bold text-ink">{value}</p>
      <p className="mt-2 text-[13px] text-muted">{label}</p>
    </Link>
  );
}
