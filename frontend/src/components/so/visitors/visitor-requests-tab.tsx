"use client";

import { useMemo, useState } from "react";
import { Check, Eye, X } from "lucide-react";

import { SoAvatar } from "@/components/so/ui/avatar";
import { SoVisitorRequestCards } from "@/components/so/visitors/visitor-cards";
import { VisitStatusPill } from "@/components/so/ui/status-pill";
import { SoEmptyRows, SoStackedCell, SoTable } from "@/components/so/ui/table";
import { Card } from "@/components/ui/card";
import { SearchInput } from "@/components/ui/search-input";
import { SelectFilter } from "@/components/ui/select-filter";
import {
  matchesVisitQuery,
  SO_VISIT_STATUSES,
  type SoVisit,
} from "@/lib/so/visitors-data";
import {
  approveSoVisit,
  checkInSoVisit,
  rejectSoVisit,
} from "@/lib/so/visitors-store";

const COLUMNS = [
  { label: "Visitor" },
  { label: "Resident & Unit" },
  { label: "Visit Details" },
  { label: "Parking" },
  { label: "Status" },
  { label: "Actions", align: "right" as const },
];

const ICON_ACTION =
  "inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none";

/**
 * What a guard can do to a row, and nothing more.
 *
 * A pending request can be cleared or refused; a cleared one can be admitted.
 * Anything already settled offers only the eye, because a visit that has
 * happened is a record rather than a decision.
 */
function RowActions({ visit, onOpen }: { visit: SoVisit; onOpen: () => void }) {
  return (
    <div className="flex items-center justify-end gap-1.5">
      <button
        type="button"
        onClick={onOpen}
        className={`${ICON_ACTION} text-gray-400 hover:bg-gray-100 hover:text-ink`}
      >
        <Eye aria-hidden="true" className="h-4 w-4" />
        <span className="sr-only">View {visit.name}</span>
      </button>

      {visit.status === "Pending" && (
        <>
          <button
            type="button"
            onClick={() => approveSoVisit(visit.id)}
            className={`${ICON_ACTION} text-green-600 hover:bg-green-50`}
          >
            <Check aria-hidden="true" className="h-4 w-4" />
            <span className="sr-only">Approve {visit.name}</span>
          </button>
          <button
            type="button"
            onClick={() => rejectSoVisit(visit.id)}
            className={`${ICON_ACTION} text-rose-500 hover:bg-rose-50`}
          >
            <X aria-hidden="true" className="h-4 w-4" />
            <span className="sr-only">Reject {visit.name}</span>
          </button>
        </>
      )}

      {visit.status === "Approved" && (
        <button
          type="button"
          onClick={() => checkInSoVisit(visit.id)}
          className="rounded-md bg-green-600 px-3.5 py-1.5 text-[13px] font-semibold text-white transition-colors hover:bg-green-700 focus-visible:ring-2 focus-visible:ring-green-600/40 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          Check In
        </button>
      )}
    </div>
  );
}

export function SoVisitorRequestsTab({
  visits,
  onOpen,
}: {
  visits: SoVisit[];
  onOpen: (visit: SoVisit) => void;
}) {
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
          label="Search visitors"
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
          <SoEmptyRows message="No visits match this search." />
        </Card>
      )}

      {visible.length > 0 && (
        <div className="md:hidden">
          <SoVisitorRequestCards visits={visible} onOpen={onOpen} />
        </div>
      )}

      <Card className="hidden md:block">
        {visible.length > 0 && (
          <SoTable columns={COLUMNS} minWidth="min-w-[1040px]">
            {visible.map((visit) => (
              <tr
                key={visit.id}
                className="transition-colors hover:bg-gray-50/70"
              >
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <SoAvatar
                      name={visit.name}
                      tone={visit.status === "Checked In" ? "green" : "slate"}
                    />
                    <SoStackedCell
                      primary={
                        <span className="font-semibold">{visit.name}</span>
                      }
                      secondary={visit.phone}
                    />
                  </div>
                </td>

                <td className="px-5 py-3.5">
                  <SoStackedCell
                    primary={visit.resident}
                    secondary={`Unit ${visit.unit}`}
                  />
                </td>

                <td className="px-5 py-3.5">
                  <SoStackedCell
                    primary={visit.date}
                    secondary={`${visit.expectedAt} - ${visit.purpose}`}
                  />
                </td>

                <td className="px-5 py-3.5 whitespace-nowrap">
                  {visit.vehicle ? (
                    <span className="flex items-center gap-1.5 text-[14px] text-ink">
                      <Check
                        aria-hidden="true"
                        className="h-4 w-4 text-green-600"
                      />
                      {visit.vehicle.plate}
                    </span>
                  ) : (
                    <span className="text-[14px] text-muted">No</span>
                  )}
                </td>

                <td className="px-5 py-3.5">
                  <VisitStatusPill status={visit.status} />
                </td>

                <td className="px-5 py-3.5">
                  <RowActions visit={visit} onOpen={() => onOpen(visit)} />
                </td>
              </tr>
            ))}
          </SoTable>
        )}
      </Card>
    </div>
  );
}
