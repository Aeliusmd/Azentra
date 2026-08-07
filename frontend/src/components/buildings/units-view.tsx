"use client";

import { useMemo, useState } from "react";
import { Eye, Pencil } from "lucide-react";

import { Badge, type BadgeTone } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { IconButton } from "@/components/ui/icon-button";
import { SearchInput } from "@/components/ui/search-input";
import { SelectFilter } from "@/components/ui/select-filter";
import { formatRent, type Unit, type UnitStatus } from "@/lib/buildings-data";

const HEADINGS = [
  "Unit",
  "Tower",
  "Floor",
  "Type",
  "Area",
  "Rent",
  "Status",
  "Actions",
];

const STATUS_TONES: Record<UnitStatus, BadgeTone> = {
  Occupied: "green",
  Vacant: "amber",
  Maintenance: "red",
};

const STATUSES: UnitStatus[] = ["Occupied", "Vacant", "Maintenance"];

export function UnitsView({
  units,
  towerNames,
}: {
  units: Unit[];
  towerNames: string[];
}) {
  const [query, setQuery] = useState("");
  const [tower, setTower] = useState("");
  const [status, setStatus] = useState("");

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return units.filter((unit) => {
      if (tower && unit.tower !== tower) return false;
      if (status && unit.status !== status) return false;
      if (!term) return true;
      return (
        unit.code.toLowerCase().includes(term) ||
        unit.tower.toLowerCase().includes(term) ||
        unit.floor.toLowerCase().includes(term) ||
        unit.type.toLowerCase().includes(term)
      );
    });
  }, [query, status, tower, units]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput
          label="Search units"
          placeholder="Search units, tenants..."
          value={query}
          onChange={setQuery}
        />
        <SelectFilter
          label="Filter by tower"
          allLabel="All Towers"
          options={towerNames}
          value={tower}
          onChange={setTower}
        />
        <SelectFilter
          label="Filter by status"
          allLabel="All Status"
          options={STATUSES}
          value={status}
          onChange={setStatus}
        />
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead>
              <tr className="border-b border-hairline">
                {HEADINGS.map((heading) => (
                  <th
                    key={heading}
                    scope="col"
                    className={`px-6 py-4 text-[11px] font-medium tracking-wider text-muted uppercase ${
                      heading === "Actions" ? "text-right" : ""
                    }`}
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-hairline">
              {visible.map((unit) => (
                <tr
                  key={unit.code}
                  className="transition-colors hover:bg-gray-50/70"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 text-left text-[13px] font-semibold text-ink"
                  >
                    {unit.code}
                  </th>
                  <td className="px-6 py-4 text-[13px] text-gray-600">
                    {unit.tower}
                  </td>
                  <td className="px-6 py-4 text-[13px] text-gray-600">
                    {unit.floor}
                  </td>
                  <td className="px-6 py-4 text-[13px] text-gray-600">
                    {unit.type}
                  </td>
                  <td className="px-6 py-4 text-[13px] text-gray-600">
                    {unit.areaSqft} sqft
                  </td>
                  <td className="px-6 py-4 text-[13px] text-gray-600">
                    {formatRent(unit.rent)}
                  </td>
                  <td className="px-6 py-4">
                    <Badge tone={STATUS_TONES[unit.status]}>
                      {unit.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <IconButton
                        icon={Eye}
                        label={`View unit ${unit.code}`}
                        href={`/admin/buildings/units/${unit.code}`}
                      />
                      <IconButton
                        icon={Pencil}
                        label={`Edit unit ${unit.code}`}
                        href={`/admin/buildings/units/${unit.code}/edit`}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {visible.length === 0 && (
          <p className="px-6 py-10 text-center text-[13px] text-muted">
            No units match your filters.
          </p>
        )}
      </Card>
    </div>
  );
}
