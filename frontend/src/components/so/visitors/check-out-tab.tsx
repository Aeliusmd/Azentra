"use client";

import { SoAvatar } from "@/components/so/ui/avatar";
import { SoCheckOutCards } from "@/components/so/visitors/visitor-cards";
import { SoEmptyRows, SoStackedCell, SoTable } from "@/components/so/ui/table";
import { Card } from "@/components/ui/card";
import type { SoVisit } from "@/lib/so/visitors-data";
import { checkOutSoVisit } from "@/lib/so/visitors-store";

const COLUMNS = [
  { label: "Visitor" },
  { label: "Resident" },
  { label: "Check-In Time" },
  { label: "Pass Code" },
  { label: "Action", align: "right" as const },
];

/**
 * Who is still inside.
 *
 * The pass code is on the row because it is what the visitor hands back — the
 * guard matches the card in front of them to the line on the screen before
 * releasing anyone.
 */
export function SoCheckOutTab({ visits }: { visits: SoVisit[] }) {
  if (visits.length === 0) {
    return (
      <Card>
        <SoEmptyRows message="Nobody is inside the property." />
      </Card>
    );
  }

  return (
    <>
      <div className="md:hidden">
        <SoCheckOutCards visits={visits} />
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
                  <SoAvatar name={visit.name} tone="green" />
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
                  primary={visit.checkedInAt ?? "—"}
                  secondary={visit.date}
                />
              </td>

              <td className="px-5 py-3.5">
                <span className="inline-flex rounded-md bg-gray-100 px-2.5 py-1 font-mono text-[12px] text-gray-600">
                  {visit.passCode}
                </span>
              </td>

              <td className="px-5 py-3.5 text-right">
                <button
                  type="button"
                  onClick={() => checkOutSoVisit(visit.id)}
                  className="rounded-md bg-[#374151] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#1f2937] focus-visible:ring-2 focus-visible:ring-gray-500/40 focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  Check Out
                </button>
              </td>
            </tr>
          ))}
        </SoTable>
      </Card>
    </>
  );
}
