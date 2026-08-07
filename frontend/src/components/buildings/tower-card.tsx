import { Building2, Pencil } from "lucide-react";

import type { Tower, TowerTheme } from "@/lib/buildings-data";

/** Full class strings per theme — Tailwind only sees literals, never `x-${y}`. */
const THEMES: Record<
  TowerTheme,
  { header: string; badge: string; action: string }
> = {
  orange: {
    header: "from-[#e5942f] to-[#cf4a1e]",
    badge: "bg-[#fde9c8] text-[#8a5a12]",
    action: "border-amber-300 text-amber-600 hover:bg-amber-50",
  },
  teal: {
    header: "from-[#33906f] to-[#1c6a68]",
    badge: "bg-[#d6f0dd] text-[#1f6b3a]",
    action: "border-emerald-300 text-emerald-600 hover:bg-emerald-50",
  },
  crimson: {
    header: "from-[#c5164a] to-[#a01d93]",
    badge: "bg-[#fbd9e2] text-[#a3123f]",
    action: "border-rose-300 text-rose-600 hover:bg-rose-50",
  },
  purple: {
    header: "from-[#6f2ad2] to-[#a93ad6]",
    badge: "bg-[#e6d6fa] text-[#5b2199]",
    action: "border-purple-300 text-purple-600 hover:bg-purple-50",
  },
};

function Row({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between py-[7px] text-[13px]">
      <span className="text-gray-600">{label}</span>
      <span
        className={
          accent ? "font-semibold text-[#3fae63]" : "font-medium text-ink"
        }
      >
        {value}
      </span>
    </div>
  );
}

export function TowerCard({
  tower,
  onViewDetails,
  onEdit,
}: {
  tower: Tower;
  onViewDetails: (tower: Tower) => void;
  onEdit: (tower: Tower) => void;
}) {
  const theme = THEMES[tower.theme];

  return (
    <article className="overflow-hidden rounded-lg border border-hairline bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
      <div
        className={`relative flex h-[95px] flex-col justify-end overflow-hidden bg-linear-to-br p-4 ${theme.header}`}
      >
        <Building2
          aria-hidden="true"
          className="absolute top-4 right-4 h-8 w-8 text-white/25"
        />
        <span
          className={`mb-1.5 w-fit rounded px-2 py-0.5 text-[11px] font-medium ${theme.badge}`}
        >
          {tower.status}
        </span>
        <h2 className="text-base font-bold text-white">{tower.name}</h2>
      </div>

      <div className="p-4">
        <Row label="Floors" value={tower.floors} />
        <Row label="Total Units" value={tower.totalUnits} />
        <Row label="Occupied" value={tower.occupied} accent />
        <Row label="Vacant" value={tower.vacant} />

        <ul className="mt-3 flex flex-wrap gap-1.5">
          {tower.amenities.map((amenity) => (
            <li
              key={amenity}
              className="rounded bg-gray-100 px-2 py-1 text-[11px] text-gray-600"
            >
              {amenity}
            </li>
          ))}
        </ul>

        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={() => onViewDetails(tower)}
            className={`flex-1 rounded-md border py-2.5 text-center text-[13px] font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none ${theme.action}`}
          >
            View Details
          </button>
          <button
            type="button"
            onClick={() => onEdit(tower)}
            className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-md border border-hairline text-gray-400 transition-colors hover:bg-gray-50 hover:text-ink focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
          >
            <Pencil aria-hidden="true" className="h-4 w-4" />
            <span className="sr-only">Edit {tower.name}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
