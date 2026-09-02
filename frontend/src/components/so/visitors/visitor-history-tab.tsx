"use client";

import { useMemo, useState } from "react";

import { SoEmptyRows, SoStackedCell, SoTable } from "@/components/so/ui/table";
import { SoVisitorHistoryCards } from "@/components/so/visitors/visitor-cards";
import { Card } from "@/components/ui/card";
import { SearchInput } from "@/components/ui/search-input";
import { SelectFilter } from "@/components/ui/select-filter";
import {
  matchesVisitQuery,
  SO_VISIT_STATUSES,
  type SoVisit,
} from "@/lib/so/visitors-data";

const COLUMNS = [
  { label: "Date" },
  { label: "Visitor" },
  { label: "Resident & Unit" },
  { label: "Check-In" },
  { label: "Check-Out" },
  { label: "Vehicle" },
];

/**
 * Every visit that was actually admitted.
 *
 * A dash in the check-out column is not missing data — it is somebody who has
 * not left yet, which is exactly what a guard wants to see at a shift handover.
 */
export function SoVisitorHistoryTab({ visits }: { visits: SoVisit[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");

  const visible = useMemo(
    () =>
      visits.filter(
        (visit) =>
          matchesVisitQuery(visit, query) &&
          (status === "" || visit.status === status),
      ),
    [visits, query, status],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <SearchInput
          label="Search visitor history"
          placeholder="Search visitors, residents, units..."
          value={query}
          onChange={setQuery}
          className="flex-1"
        />
        <div className="sm:w-[180px]">
          <SelectFilter
            label="Filter by status"
            allLabel="All Status"
            options={[...SO_VISIT_STATUSES]}
            value={status}
            onChange={setStatus}
          />
        </div>
      </div>

      {visible.length === 0 && (
        <Card>
          <SoEmptyRows message="No past visits match this search." />
        </Card>
      )}

      {visible.length > 0 && (
        <div className="md:hidden">
          <SoVisitorHistoryCards visits={visible} />
        </div>
      )}

      <Card className="hidden md:block">
        {visible.length > 0 && (
          <SoTable columns={COLUMNS} minWidth="min-w-[900px]">
            {visible.map((visit) => (
              <tr
                key={visit.id}
                className="transition-colors hover:bg-gray-50/70"
              >
                <td className="px-5 py-3.5 text-[14px] whitespace-nowrap text-gray-600">
                  {visit.date}
                </td>

                <td className="px-5 py-3.5">
                  <SoStackedCell
                    primary={
                      <span className="font-semibold">{visit.name}</span>
                    }
                    secondary={visit.phone}
                  />
                </td>

                <td className="px-5 py-3.5">
                  <SoStackedCell
                    primary={visit.resident}
                    secondary={`Unit ${visit.unit}`}
                  />
                </td>

                <td className="px-5 py-3.5 text-[14px] whitespace-nowrap text-gray-600">
                  {visit.checkedInAt ?? "-"}
                </td>

                <td className="px-5 py-3.5 text-[14px] whitespace-nowrap text-gray-600">
                  {visit.checkedOutAt ?? "-"}
                </td>

                <td className="px-5 py-3.5 text-[14px] whitespace-nowrap text-gray-600">
                  {visit.vehicle ? visit.vehicle.plate : "No vehicle"}
                </td>
              </tr>
            ))}
          </SoTable>
        )}
      </Card>
    </div>
  );
}
