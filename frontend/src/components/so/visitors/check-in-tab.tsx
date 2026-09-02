"use client";

import { SoAvatar } from "@/components/so/ui/avatar";
import { SoCheckInCards } from "@/components/so/visitors/visitor-cards";
import { SoEmptyRows, SoStackedCell, SoTable } from "@/components/so/ui/table";
import { Card } from "@/components/ui/card";
import { vehicleLine, type SoVisit } from "@/lib/so/visitors-data";
import { checkInSoVisit } from "@/lib/so/visitors-store";

const COLUMNS = [
  { label: "Visitor" },
  { label: "Resident" },
  { label: "Expected Time" },
  { label: "Vehicle" },
  { label: "Action", align: "right" as const },
];

/**
 * The arrivals queue.
 *
 * Only cleared visits appear: a guard admits somebody against a decision that
 * has already been made, so there is no way to approve and admit in one motion
 * from here.
 */
export function SoCheckInTab({ visits }: { visits: SoVisit[] }) {
  if (visits.length === 0) {
    return (
      <Card>
        <SoEmptyRows message="Nobody is cleared and waiting to come in." />
      </Card>
    );
  }

  return (
    <>
      <div className="md:hidden">
        <SoCheckInCards visits={visits} />
      </div>

      <Card className="hidden md:block">
        <SoTable columns={COLUMNS} minWidth="min-w-[820px]">
          {visits.map((visit) => (
            <tr
              key={visit.id}
              className="transition-colors hover:bg-gray-50/70"
            >
              <td className="px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <SoAvatar name={visit.name} />
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
                  secondary={visit.expectedAt}
                />
              </td>

              <td className="px-5 py-3.5 text-[14px] whitespace-nowrap text-gray-600">
                {visit.vehicle ? vehicleLine(visit.vehicle) : "No vehicle"}
              </td>

              <td className="px-5 py-3.5 text-right">
                <button
                  type="button"
                  onClick={() => checkInSoVisit(visit.id)}
                  className="rounded-md bg-green-600 px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-green-700 focus-visible:ring-2 focus-visible:ring-green-600/40 focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  Check In
                </button>
              </td>
            </tr>
          ))}
        </SoTable>
      </Card>
    </>
  );
}
