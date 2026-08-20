"use client";

import { useMemo, useState } from "react";
import { Droplet, Flame, Zap, type LucideIcon } from "lucide-react";

import { AccRecordRow } from "@/components/acc/ui/record-row";
import { AccStatusChips } from "@/components/acc/ui/status-chips";
import { Card } from "@/components/ui/card";
import { grouped, lkr } from "@/lib/acc/money";
import { useSelectedAccPeriod } from "@/lib/acc/periods";
import { useSelectedAccProperty } from "@/lib/acc/properties";
import {
  UTILITY_FILTERS,
  UTILITY_TYPES,
  type UtilityType,
} from "@/lib/acc/utility-bills-data";
import { useAccUtilityReadings } from "@/lib/acc/utility-readings-store";

const TILE: Record<UtilityType, { icon: LucideIcon; color: string }> = {
  Water: { icon: Droplet, color: "text-[#2f7fd0]" },
  Electricity: { icon: Zap, color: "text-[#e8a33d]" },
  Gas: { icon: Flame, color: "text-[#e0554d]" },
};

/** `true` where the column carries a number and so aligns to the right. */
const HEADINGS: { label: string; numeric?: boolean }[] = [
  { label: "Unit" },
  { label: "Type" },
  { label: "Consumption", numeric: true },
  { label: "Rate", numeric: true },
  { label: "Charge", numeric: true },
];

const CELL = "px-5 py-3.5 text-[14px] whitespace-nowrap";

/** What the property's meters drew this cycle, and what it cost. */
export function AccConsumptionView() {
  const allReadings = useAccUtilityReadings();
  const propertyId = useSelectedAccProperty();
  const period = useSelectedAccPeriod();

  const [type, setType] = useState<string>("All");

  const readings = useMemo(
    () =>
      allReadings.filter(
        (reading) =>
          reading.propertyId === propertyId && reading.period === period,
      ),
    [allReadings, propertyId, period],
  );

  /**
   * Totals stay across every utility even when the table is filtered — the
   * three tiles are the breakdown of the whole cycle, and filtering them would
   * simply zero two of them.
   */
  const totals = useMemo(
    () =>
      UTILITY_TYPES.map((utility) => ({
        utility,
        units: readings
          .filter((reading) => reading.type === utility)
          .reduce((sum, reading) => sum + reading.consumption, 0),
      })),
    [readings],
  );

  const visible = useMemo(
    () =>
      type === "All"
        ? readings
        : readings.filter((reading) => reading.type === type),
    [readings, type],
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[28px] leading-tight font-bold text-ink">
          Consumption
        </h1>
        <p className="mt-1 text-[14px] text-muted">
          Utility consumption analytics
        </p>
      </div>

      <ul className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {totals.map((entry) => {
          const { icon: Icon, color } = TILE[entry.utility];

          return (
            <li key={entry.utility}>
              <Card className="p-5 text-center">
                <Icon
                  aria-hidden="true"
                  className={`mx-auto h-6 w-6 ${color}`}
                />
                <p className="mt-3 text-[13px] text-muted">
                  {entry.utility} Total
                </p>
                <p className="mt-1 text-[22px] leading-none font-bold text-ink">
                  {grouped(entry.units)} u
                </p>
              </Card>
            </li>
          );
        })}
      </ul>

      <AccStatusChips
        label="Filter by utility"
        options={UTILITY_FILTERS}
        value={type}
        onChange={setType}
      />

      <Card>
        {/* Phones get the stacked list below; the table needs the width. */}
        <ul className="divide-y divide-hairline md:hidden">
          {visible.map((reading) => (
            <AccRecordRow
              key={reading.id}
              title={reading.unit}
              subtitle={reading.type}
              meta={[
                {
                  label: "Consumption",
                  value: `${grouped(reading.consumption)} units`,
                },
                { label: "Rate", value: `LKR ${reading.rate}/u` },
                { label: "Charge", value: lkr(reading.charge) },
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
              {visible.map((reading) => (
                <tr
                  key={reading.id}
                  className="transition-colors hover:bg-gray-50/70"
                >
                  <th scope="row" className={`${CELL} text-left font-normal text-ink`}>
                    {reading.unit}
                  </th>
                  <td className={`${CELL} text-gray-700`}>{reading.type}</td>
                  <td className={`${CELL} text-right text-ink`}>
                    {grouped(reading.consumption)} units
                  </td>
                  <td className={`${CELL} text-right text-muted`}>
                    LKR {reading.rate}/u
                  </td>
                  <td className={`${CELL} text-right font-bold text-ink`}>
                    {lkr(reading.charge)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {visible.length === 0 && (
          <p className="px-6 py-16 text-center text-[15px] text-muted">
            No consumption recorded for this utility.
          </p>
        )}
      </Card>
    </div>
  );
}
