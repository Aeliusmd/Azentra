"use client";

import { useMemo, useState } from "react";
import { Zap } from "lucide-react";

import { AccRecordRow } from "@/components/acc/ui/record-row";
import { SelectField } from "@/components/pm/ui/select-field";
import { Card } from "@/components/ui/card";
import { controlClasses, FieldLabel } from "@/components/ui/field";
import { billableUnitsFor, lastDayOf } from "@/lib/acc/generate-bills-data";
import { grouped, lkr } from "@/lib/acc/money";
import {
  billingPeriods,
  periodLabel,
  selectAccPeriod,
  useSelectedAccPeriod,
} from "@/lib/acc/periods";
import { useSelectedAccProperty } from "@/lib/acc/properties";
import { showAccToast } from "@/lib/acc/toast-store";
import { generateUnitBill } from "@/lib/acc/unit-bills-store";

/** `true` where the column carries a number and so aligns to the right. */
const HEADINGS: { label: string; numeric?: boolean }[] = [
  { label: "Unit" },
  { label: "Resident" },
  { label: "Maintenance", numeric: true },
  { label: "Water", numeric: true },
  { label: "Electricity", numeric: true },
  { label: "Prev Bal", numeric: true },
  { label: "Total", numeric: true },
];

const CELL = "px-5 py-3.5 text-[14px] whitespace-nowrap";
const BOX =
  "h-4 w-4 rounded border-gray-300 text-brand accent-brand focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none";

const PERIOD_LABELS = billingPeriods.map((period) => period.label);

/** A zero column reads as nothing owed; a real zero still reads as 0. */
function balance(value: number) {
  return value === 0 ? "–" : grouped(value);
}

export function AccGenerateBillsView() {
  const propertyId = useSelectedAccProperty();
  const period = useSelectedAccPeriod();

  const [dueDate, setDueDate] = useState(() => lastDayOf(period));
  const [selected, setSelected] = useState<string[]>([]);

  const units = useMemo(
    () => billableUnitsFor(propertyId),
    [propertyId],
  );

  // Changing the cycle moves the due date with it and drops a stale selection.
  const [lastPeriod, setLastPeriod] = useState(period);
  if (period !== lastPeriod) {
    setLastPeriod(period);
    setDueDate(lastDayOf(period));
    setSelected([]);
  }

  const allSelected = units.length > 0 && selected.length === units.length;

  function toggle(unit: string) {
    setSelected((current) =>
      current.includes(unit)
        ? current.filter((name) => name !== unit)
        : [...current, unit],
    );
  }

  function generate() {
    const rows = units.filter((row) => selected.includes(row.unit));
    rows.forEach((row) => {
      generateUnitBill({
        propertyId,
        period,
        unit: row.unit,
        resident: row.resident ?? "Vacant",
        total: row.total,
        dueDate,
      });
    });

    showAccToast(
      `${rows.length} bill${rows.length === 1 ? "" : "s"} generated as drafts`,
    );
    setSelected([]);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[28px] leading-tight font-bold text-ink">
          Generate Bills
        </h1>
        <p className="mt-1 text-[14px] text-muted">
          Create bills for the selected period
        </p>
      </div>

      <Card className="p-5">
        <div className="grid grid-cols-1 items-end gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.2fr)]">
          <SelectField
            id="cycle-period"
            label="Billing Period"
            value={periodLabel(period)}
            onChange={(label) => {
              const match = billingPeriods.find(
                (entry) => entry.label === label,
              );
              if (match) selectAccPeriod(match.id);
            }}
            options={PERIOD_LABELS}
          />

          <div>
            <FieldLabel htmlFor="cycle-due">Due Date</FieldLabel>
            <input
              id="cycle-due"
              type="date"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
              className={`${controlClasses()} px-3.5 py-3`}
            />
          </div>

          <button
            type="button"
            onClick={generate}
            disabled={selected.length === 0}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-brand px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-[#a8bdd2]"
          >
            <Zap aria-hidden="true" className="h-[18px] w-[18px]" />
            Generate {selected.length} Bill{selected.length === 1 ? "" : "s"}
          </button>
        </div>
      </Card>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline px-5 py-4">
          <div className="flex items-center gap-2">
            <input
              id="select-all-units"
              type="checkbox"
              checked={allSelected}
              onChange={() =>
                setSelected(allSelected ? [] : units.map((row) => row.unit))
              }
              className={BOX}
            />
            <label
              htmlFor="select-all-units"
              className="text-[15px] font-semibold text-ink select-none"
            >
              Select All Units
            </label>
          </div>

          <p className="text-[13px] text-muted">
            {selected.length} of {units.length} selected
          </p>
        </div>

        {/* Phones get the stacked list below; the table needs the width. */}
        <ul className="divide-y divide-hairline md:hidden">
          {units.map((row) => (
            <AccRecordRow
              key={row.unit}
              title={row.unit}
              subtitle={row.resident ?? "Vacant"}
              status={
                <label className="flex items-center gap-2 text-[13px] text-muted">
                  <input
                    type="checkbox"
                    checked={selected.includes(row.unit)}
                    onChange={() => toggle(row.unit)}
                    className={BOX}
                  />
                  Include in this run
                </label>
              }
              meta={[
                { label: "Maintenance", value: grouped(row.maintenance) },
                { label: "Water", value: balance(row.water) },
                { label: "Electricity", value: balance(row.electricity) },
                { label: "Prev Bal", value: balance(row.previousBalance) },
                { label: "Total", value: lkr(row.total) },
              ]}
            />
          ))}
        </ul>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[900px] text-left">
            <thead>
              <tr className="border-b border-hairline">
                <th scope="col" className="w-12 px-5 py-3.5">
                  <span className="sr-only">Include</span>
                </th>
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
              {units.map((row) => (
                <tr
                  key={row.unit}
                  className="transition-colors hover:bg-gray-50/70"
                >
                  <td className="px-5 py-3.5">
                    <input
                      type="checkbox"
                      aria-label={`Include ${row.unit}`}
                      checked={selected.includes(row.unit)}
                      onChange={() => toggle(row.unit)}
                      className={BOX}
                    />
                  </td>
                  <th
                    scope="row"
                    className={`${CELL} text-left font-semibold text-ink`}
                  >
                    {row.unit}
                  </th>
                  <td
                    className={`${CELL} ${
                      row.resident ? "text-gray-700" : "text-gray-400 italic"
                    }`}
                  >
                    {row.resident ?? "Vacant"}
                  </td>
                  <td className={`${CELL} text-right text-gray-700`}>
                    {grouped(row.maintenance)}
                  </td>
                  <td className={`${CELL} text-right text-gray-700`}>
                    {grouped(row.water)}
                  </td>
                  <td className={`${CELL} text-right text-gray-700`}>
                    {grouped(row.electricity)}
                  </td>
                  <td className={`${CELL} text-right text-gray-700`}>
                    {balance(row.previousBalance)}
                  </td>
                  <td className={`${CELL} text-right font-bold text-ink`}>
                    {grouped(row.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {units.length === 0 && (
          <p className="px-6 py-16 text-center text-[15px] text-muted">
            Every unit on this property has already been billed.
          </p>
        )}
      </Card>
    </div>
  );
}
