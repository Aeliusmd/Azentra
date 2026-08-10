"use client";

import { useMemo, useState } from "react";

import { FilterChips } from "@/components/pm/ui/filter-chips";
import { Pill } from "@/components/pm/ui/pill";
import { UnitDetailsModal } from "@/components/pm/units/unit-details-modal";
import { SearchInput } from "@/components/ui/search-input";
import {
  UNIT_STATUS_TONE,
  UNIT_TOWERS,
  countByStatus,
  formatRent,
  units as seed,
  type Unit,
} from "@/lib/pm/units-data";

const STATUS_FILTERS = ["All", "Occupied", "Vacant", "Maintenance"] as const;
const TOWER_FILTERS = ["All", ...UNIT_TOWERS] as const;

function SummaryCard({
  value,
  label,
  color,
}: {
  value: number;
  label: string;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-hairline bg-white px-5 py-6 text-center">
      <p className={`text-[28px] leading-none font-bold ${color}`}>{value}</p>
      <p className="mt-2 text-[15px] text-muted">{label}</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-[15px] text-muted">{label}:</dt>
      <dd className="truncate text-[15px] text-ink">{value}</dd>
    </div>
  );
}

export function UnitsView() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<string>("All");
  const [tower, setTower] = useState<string>("All");
  const [viewing, setViewing] = useState<Unit | null>(null);

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return seed.filter((unit) => {
      if (status !== "All" && unit.status !== status.toLowerCase()) return false;
      if (tower !== "All" && unit.tower !== tower) return false;
      if (!term) return true;
      return (
        unit.id.toLowerCase().includes(term) ||
        unit.tower.toLowerCase().includes(term) ||
        unit.type.toLowerCase().includes(term) ||
        unit.tenant.toLowerCase().includes(term)
      );
    });
  }, [query, status, tower]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[32px] leading-tight font-bold text-ink">
            Units Overview
          </h1>
          <p className="mt-1 text-[15px] text-muted">
            Monitor all residential units across towers
          </p>
        </div>

        <SearchInput
          label="Search units"
          placeholder="Search unit..."
          value={query}
          onChange={setQuery}
          className="w-full sm:w-[280px]"
        />
      </div>

      <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
        <SummaryCard
          value={seed.length}
          label="Total Units"
          color="text-ink"
        />
        <SummaryCard
          value={countByStatus(seed, "occupied")}
          label="Occupied"
          color="text-brand"
        />
        <SummaryCard
          value={countByStatus(seed, "vacant")}
          label="Vacant"
          color="text-brand"
        />
        <SummaryCard
          value={countByStatus(seed, "maintenance")}
          label="Maintenance"
          color="text-[#d98324]"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <FilterChips
          label="Filter units by status"
          options={STATUS_FILTERS}
          value={status}
          onChange={setStatus}
        />
        <FilterChips
          label="Filter units by tower"
          options={TOWER_FILTERS}
          value={tower}
          onChange={setTower}
          tone="slate"
        />
      </div>

      {visible.length === 0 ? (
        <p className="rounded-lg border border-hairline bg-white px-6 py-12 text-center text-[15px] text-muted">
          No units match your filters.
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {visible.map((unit) => (
            <li key={unit.id}>
              <button
                type="button"
                onClick={() => setViewing(unit)}
                className="w-full rounded-xl border border-hairline bg-white px-5 py-4 text-left transition-colors hover:bg-gray-50/70 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="text-[17px] font-bold text-ink">
                    {unit.id}
                  </span>
                  <Pill tone={UNIT_STATUS_TONE[unit.status]}>{unit.status}</Pill>
                </span>

                <dl className="mt-3 space-y-1.5">
                  <Row label="Tower" value={unit.tower} />
                  <Row label="Type" value={unit.type} />
                  <Row label="Area" value={`${unit.area} sqft`} />
                  <Row label="Rent" value={formatRent(unit.rent)} />
                  {unit.tenant && <Row label="Tenant" value={unit.tenant} />}
                </dl>
              </button>
            </li>
          ))}
        </ul>
      )}

      <UnitDetailsModal unit={viewing} onClose={() => setViewing(null)} />
    </div>
  );
}
