"use client";

import { useMemo, useState } from "react";
import { Building2, Eye, Pencil, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { IconButton } from "@/components/ui/icon-button";
import { SearchInput } from "@/components/ui/search-input";
import { SelectFilter } from "@/components/ui/select-filter";
import type { Floor } from "@/lib/buildings-data";

const HEADINGS = [
  "Floor",
  "Tower",
  "Total Units",
  "Occupied",
  "Vacant",
  "Common Areas",
  "Status",
  "Actions",
];

export function FloorsView({
  floors,
  towerNames,
}: {
  floors: Floor[];
  towerNames: string[];
}) {
  const [query, setQuery] = useState("");
  const [tower, setTower] = useState("");

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return floors.filter((floor) => {
      if (tower && floor.tower !== tower) return false;
      if (!term) return true;
      return (
        floor.name.toLowerCase().includes(term) ||
        floor.tower.toLowerCase().includes(term)
      );
    });
  }, [floors, query, tower]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput
          label="Search floors"
          placeholder="Search floors..."
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
                    className="px-6 py-4 text-xs font-medium text-muted"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-hairline">
              {visible.map((floor) => (
                <tr
                  key={floor.id}
                  className="transition-colors hover:bg-gray-50/70"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 text-left text-[13px] font-semibold text-ink"
                  >
                    {floor.name}
                  </th>
                  <td className="px-6 py-4 text-[13px] text-gray-600">
                    {floor.tower}
                  </td>
                  <td className="px-6 py-4 text-[13px] text-gray-600">
                    {floor.totalUnits}
                  </td>
                  <td className="px-6 py-4 text-[13px] font-semibold text-[#3fae63]">
                    {floor.occupied}
                  </td>
                  <td className="px-6 py-4 text-[13px] text-gray-600">
                    {floor.vacant}
                  </td>
                  <td className="px-6 py-4">
                    {floor.commonAreas > 0 ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e8eef5] px-2.5 py-1 text-xs text-[#4a6483]">
                        <Building2 aria-hidden="true" className="h-3.5 w-3.5" />
                        {floor.commonAreas}
                      </span>
                    ) : (
                      <span className="text-[13px] text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      tone={floor.status === "active" ? "green" : "amber"}
                    >
                      {floor.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <IconButton
                        icon={Eye}
                        label={`View ${floor.name}, ${floor.tower}`}
                        href={`/admin/buildings/floors/${floor.id}`}
                      />
                      <IconButton
                        icon={Pencil}
                        label={`Edit ${floor.name}, ${floor.tower}`}
                        href={`/admin/buildings/floors/${floor.id}/edit`}
                      />
                      <IconButton
                        icon={Trash2}
                        tone="danger"
                        label={`Delete ${floor.name}, ${floor.tower}`}
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
            No floors match your filters.
          </p>
        )}
      </Card>
    </div>
  );
}
