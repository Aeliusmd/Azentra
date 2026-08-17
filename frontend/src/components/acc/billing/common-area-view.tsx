"use client";

import { useMemo, useState } from "react";
import { ChartPie } from "lucide-react";

import { AllocateModal } from "@/components/acc/billing/allocate-modal";
import { AccRecordRow } from "@/components/acc/ui/record-row";
import { SummaryTile } from "@/components/acc/ui/summary-tile";
import { Card } from "@/components/ui/card";
import {
  commonAreaChargesFor,
  summarise,
} from "@/lib/acc/common-area-data";
import { grouped, lkr, lkrK } from "@/lib/acc/money";
import { useSelectedAccPeriod } from "@/lib/acc/periods";
import {
  assignedProperties,
  useSelectedAccProperty,
} from "@/lib/acc/properties";

/** `true` where the column carries a number and so aligns to the right. */
const HEADINGS: { label: string; numeric?: boolean }[] = [
  { label: "Area" },
  { label: "Type" },
  { label: "Consumption", numeric: true },
  { label: "Rate", numeric: true },
  { label: "Charge", numeric: true },
];

const CELL = "px-5 py-3.5 text-[14px] whitespace-nowrap";

export function AccCommonAreaView() {
  const propertyId = useSelectedAccProperty();
  const period = useSelectedAccPeriod();

  const [allocateOpen, setAllocateOpen] = useState(false);

  const charges = useMemo(
    () => commonAreaChargesFor(propertyId, period),
    [propertyId, period],
  );
  const summary = useMemo(() => summarise(charges), [charges]);

  const units =
    assignedProperties.find((property) => property.id === propertyId)?.units ??
    0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[28px] leading-tight font-bold text-ink">
            Common Area Bills
          </h1>
          <p className="mt-1 text-[14px] text-muted">
            Utility consumption for common areas
          </p>
        </div>

        <button
          type="button"
          onClick={() => setAllocateOpen(true)}
          aria-haspopup="dialog"
          className="flex items-center gap-2 rounded-lg border border-hairline bg-white px-5 py-2.5 text-[15px] font-semibold text-ink transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
        >
          <ChartPie aria-hidden="true" className="h-[18px] w-[18px]" />
          Allocate to Units
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-5 xl:grid-cols-4">
        <SummaryTile label="Total Charge" value={lkrK(summary.total)} />
        <SummaryTile label="Areas" value={String(summary.areas)} />
        <SummaryTile
          label="Water Total"
          value={lkrK(summary.water)}
          tone="blue"
        />
        <SummaryTile
          label="Electricity Total"
          value={lkrK(summary.electricity)}
          tone="amber"
        />
      </div>

      <Card>
        {/* Phones get the stacked list below; the table needs the width. */}
        <ul className="divide-y divide-hairline md:hidden">
          {charges.map((charge) => (
            <AccRecordRow
              key={charge.id}
              title={charge.area}
              subtitle={charge.type}
              meta={[
                {
                  label: "Consumption",
                  value: `${grouped(charge.consumption)} units`,
                },
                { label: "Rate", value: `LKR ${charge.rate}/unit` },
                { label: "Charge", value: lkr(charge.charge) },
              ]}
            />
          ))}
        </ul>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[820px] text-left">
            <thead>
              <tr className="border-b border-hairline">
                {HEADINGS.map((heading) => (
                  <th
                    key={heading.label}
                    scope="col"
                    className={`px-5 py-3.5 text-[12px] font-semibold tracking-wide text-gray-500 uppercase ${
                      heading.numeric ? "text-right" : ""
                    }`}
                  >
                    {heading.label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-hairline">
              {charges.map((charge) => (
                <tr key={charge.id}>
                  <th
                    scope="row"
                    className={`${CELL} text-left font-semibold text-ink`}
                  >
                    {charge.area}
                  </th>
                  <td className={`${CELL} text-gray-700`}>{charge.type}</td>
                  <td className={`${CELL} text-right text-gray-700`}>
                    {grouped(charge.consumption)} units
                  </td>
                  <td className={`${CELL} text-right text-muted`}>
                    LKR {charge.rate}/unit
                  </td>
                  <td className={`${CELL} text-right font-bold text-ink`}>
                    {lkr(charge.charge)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {charges.length === 0 && (
          <p className="px-6 py-16 text-center text-[15px] text-muted">
            No common area charges recorded for this period.
          </p>
        )}
      </Card>

      {allocateOpen && (
        <AllocateModal
          propertyId={propertyId}
          period={period}
          total={summary.total}
          units={units}
          onClose={() => setAllocateOpen(false)}
        />
      )}
    </div>
  );
}
