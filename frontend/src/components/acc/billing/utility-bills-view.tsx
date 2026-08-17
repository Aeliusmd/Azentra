"use client";

import { useMemo, useState } from "react";

import { UtilityReadingModal } from "@/components/acc/billing/utility-reading-modal";
import { AccRecordRow } from "@/components/acc/ui/record-row";
import { AccStatusChips } from "@/components/acc/ui/status-chips";
import { ReadingStatusPill } from "@/components/acc/ui/status-pill";
import { FsPagination } from "@/components/fs/ui/pagination";
import { Card } from "@/components/ui/card";
import { grouped, lkr } from "@/lib/acc/money";
import { useSelectedAccPeriod } from "@/lib/acc/periods";
import { useSelectedAccProperty } from "@/lib/acc/properties";
import {
  UTILITY_FILTERS,
  utilityReadingsFor,
} from "@/lib/acc/utility-bills-data";

/** `true` where the column carries a number and so aligns to the right. */
const HEADINGS: { label: string; numeric?: boolean }[] = [
  { label: "Unit" },
  { label: "Type" },
  { label: "Prev Reading", numeric: true },
  { label: "Curr Reading", numeric: true },
  { label: "Consumption", numeric: true },
  { label: "Rate", numeric: true },
  { label: "Charge", numeric: true },
  { label: "Status" },
];

const PAGE_SIZE = 10;

const CELL = "px-5 py-3.5 text-[14px] whitespace-nowrap";

export function AccUtilityBillsView() {
  const propertyId = useSelectedAccProperty();
  const period = useSelectedAccPeriod();

  const [type, setType] = useState<string>("All");
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState<string | null>(null);

  const readings = useMemo(
    () => utilityReadingsFor(propertyId, period),
    [propertyId, period],
  );

  const visible = useMemo(
    () =>
      type === "All"
        ? readings
        : readings.filter((reading) => reading.type === type),
    [readings, type],
  );

  const pageCount = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const rows = visible.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const openReading = readings.find((reading) => reading.id === openId) ?? null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[28px] leading-tight font-bold text-ink">
          Utility Bills
        </h1>
        <p className="mt-1 text-[14px] text-muted">
          Utility consumption and billing per unit
        </p>
      </div>

      <AccStatusChips
        label="Filter by utility"
        options={UTILITY_FILTERS}
        value={type}
        onChange={(value) => {
          setType(value);
          setPage(1);
        }}
      />

      <Card>
        {/* Phones get the stacked list below; the table needs the width. */}
        <ul className="divide-y divide-hairline md:hidden">
          {rows.map((reading) => (
            <AccRecordRow
              key={reading.id}
              title={reading.unit}
              subtitle={reading.type}
              status={<ReadingStatusPill status={reading.status} />}
              meta={[
                {
                  label: "Consumption",
                  value: `${grouped(reading.consumption)} units`,
                },
                { label: "Rate", value: `LKR ${reading.rate}/unit` },
                { label: "Charge", value: lkr(reading.charge) },
              ]}
              onOpen={() => setOpenId(reading.id)}
            />
          ))}
        </ul>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[980px] text-left">
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
              {rows.map((reading) => (
                <tr
                  key={reading.id}
                  onClick={() => setOpenId(reading.id)}
                  className="cursor-pointer transition-colors hover:bg-gray-50/70"
                >
                  <th
                    scope="row"
                    className={`${CELL} text-left font-semibold text-ink`}
                  >
                    {reading.unit}
                  </th>
                  <td className={`${CELL} text-gray-700`}>{reading.type}</td>
                  <td className={`${CELL} text-right text-gray-700`}>
                    {grouped(reading.previous)}
                  </td>
                  <td className={`${CELL} text-right text-gray-700`}>
                    {grouped(reading.current)}
                  </td>
                  <td className={`${CELL} text-right font-bold text-ink`}>
                    {grouped(reading.consumption)} units
                  </td>
                  <td className={`${CELL} text-right text-muted`}>
                    LKR {reading.rate}/unit
                  </td>
                  <td className={`${CELL} text-right font-bold text-ink`}>
                    {lkr(reading.charge)}
                  </td>
                  <td className="px-5 py-3.5">
                    <ReadingStatusPill status={reading.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {visible.length === 0 ? (
          <p className="px-6 py-16 text-center text-[15px] text-muted">
            No readings recorded for this utility.
          </p>
        ) : (
          <FsPagination
            page={current}
            pageCount={pageCount}
            total={visible.length}
            pageSize={PAGE_SIZE}
            onChange={setPage}
            noun="readings"
          />
        )}
      </Card>

      {openReading && (
        <UtilityReadingModal
          reading={openReading}
          onClose={() => setOpenId(null)}
        />
      )}
    </div>
  );
}
