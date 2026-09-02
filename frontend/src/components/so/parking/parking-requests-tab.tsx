"use client";

import { useMemo, useState } from "react";

import { SoParkingRequestCards } from "@/components/so/parking/parking-cards";
import { SoStatusPill } from "@/components/so/ui/status-pill";
import { SoEmptyRows, SoStackedCell, SoTable } from "@/components/so/ui/table";
import { Card } from "@/components/ui/card";
import { SearchInput } from "@/components/ui/search-input";
import {
  holdDuration,
  slotForVisit,
  type ParkingSlot,
} from "@/lib/so/parking-data";
import { releaseSlotForVisit } from "@/lib/so/parking-store";
import { matchesVisitQuery, type SoVisit } from "@/lib/so/visitors-data";
import { approveSoVisit, rejectSoVisit } from "@/lib/so/visitors-store";

const COLUMNS = [
  { label: "Visitor" },
  { label: "Resident & Unit" },
  { label: "Vehicle" },
  { label: "Duration" },
  { label: "Status" },
  { label: "Actions", align: "right" as const },
];

/**
 * The bays people have asked for.
 *
 * Clearing a request here is the same act as clearing the visit — a guard does
 * not approve a car and refuse its driver — so both buttons write to the visit
 * log, and refusing one hands the bay it was holding straight back.
 */
export function SoParkingRequestsTab({
  requests,
  slots,
}: {
  requests: SoVisit[];
  slots: ParkingSlot[];
}) {
  const [query, setQuery] = useState("");

  const visible = useMemo(
    () => requests.filter((visit) => matchesVisitQuery(visit, query)),
    [requests, query],
  );

  function reject(id: string) {
    rejectSoVisit(id);
    releaseSlotForVisit(id);
  }

  return (
    <div className="space-y-4">
      <SearchInput
        label="Search parking requests"
        placeholder="Search requests..."
        value={query}
        onChange={setQuery}
        className="w-full"
      />

      {visible.length === 0 && (
        <Card>
          <SoEmptyRows message="No parking requests match this search." />
        </Card>
      )}

      {visible.length > 0 && (
        <div className="md:hidden">
          <SoParkingRequestCards
            requests={visible}
            slots={slots}
            onApprove={approveSoVisit}
            onReject={reject}
          />
        </div>
      )}

      <Card className="hidden md:block">
        {visible.length > 0 && (
          <SoTable columns={COLUMNS} minWidth="min-w-[980px]">
            {visible.map((visit) => {
              const slot = slotForVisit(slots, visit.id);

              return (
                <tr
                  key={visit.id}
                  className="transition-colors hover:bg-gray-50/70"
                >
                  <td className="px-5 py-3.5 text-[14px] font-semibold text-ink">
                    {visit.name}
                  </td>

                  <td className="px-5 py-3.5">
                    <SoStackedCell
                      primary={visit.resident}
                      secondary={`Unit ${visit.unit}`}
                    />
                  </td>

                  <td className="px-5 py-3.5">
                    <SoStackedCell
                      primary={visit.vehicle?.type ?? "—"}
                      secondary={visit.vehicle?.plate ?? "—"}
                    />
                  </td>

                  <td className="px-5 py-3.5 text-[14px] whitespace-nowrap text-gray-600">
                    {slot?.holder ? holdDuration(slot.holder) : "—"}
                  </td>

                  <td className="px-5 py-3.5">
                    <SoStatusPill
                      tone={visit.status === "Pending" ? "amber" : "green"}
                    >
                      <span className="lowercase">{visit.status}</span>
                    </SoStatusPill>
                  </td>

                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-2">
                      {visit.status === "Pending" ? (
                        <>
                          <button
                            type="button"
                            onClick={() => approveSoVisit(visit.id)}
                            className="rounded-md bg-green-600 px-3.5 py-1.5 text-[13px] font-semibold text-white transition-colors hover:bg-green-700 focus-visible:ring-2 focus-visible:ring-green-600/40 focus-visible:ring-offset-2 focus-visible:outline-none"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => reject(visit.id)}
                            className="rounded-md bg-[#e0554d] px-3.5 py-1.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#c74941] focus-visible:ring-2 focus-visible:ring-[#e0554d]/40 focus-visible:ring-offset-2 focus-visible:outline-none"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <span className="text-[13px] whitespace-nowrap text-muted">
                          {slot ? `Slot ${slot.id}` : "No bay"}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </SoTable>
        )}
      </Card>
    </div>
  );
}
