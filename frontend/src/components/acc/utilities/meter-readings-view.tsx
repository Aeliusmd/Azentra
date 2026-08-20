"use client";

import { useMemo, useState } from "react";
import { Upload } from "lucide-react";

import { AccRecordRow } from "@/components/acc/ui/record-row";
import { AccStatusChips } from "@/components/acc/ui/status-chips";
import { ReadingStatusPill } from "@/components/acc/ui/status-pill";
import { BulkEntryModal } from "@/components/acc/utilities/bulk-entry-modal";
import { FsPagination } from "@/components/fs/ui/pagination";
import { Card } from "@/components/ui/card";
import { grouped, lkr } from "@/lib/acc/money";
import { useSelectedAccPeriod } from "@/lib/acc/periods";
import { useSelectedAccProperty } from "@/lib/acc/properties";
import { UTILITY_FILTERS } from "@/lib/acc/utility-bills-data";
import { useAccUtilityReadings } from "@/lib/acc/utility-readings-store";

/** `true` where the column carries a number and so aligns to the right. */
const HEADINGS: { label: string; numeric?: boolean }[] = [
  { label: "Unit" },
  { label: "Type" },
  { label: "Previous", numeric: true },
  { label: "Current", numeric: true },
  { label: "Consumption", numeric: true },
  { label: "Charge", numeric: true },
  { label: "Date" },
  { label: "Status" },
];

const PAGE_SIZE = 10;

const CELL = "px-5 py-3.5 text-[14px] whitespace-nowrap";

/**
 * The meter round for the cycle — the readings themselves, before they become
 * charges on a bill. Same records the Utility Bills page charges from, so one
 * corrected here moves the money there.
 */
export function AccMeterReadingsView() {
  const allReadings = useAccUtilityReadings();
  const propertyId = useSelectedAccProperty();
  const period = useSelectedAccPeriod();

  const [type, setType] = useState<string>("All");
  const [page, setPage] = useState(1);
  const [bulkOpen, setBulkOpen] = useState(false);

  const readings = useMemo(
    () =>
      allReadings.filter(
        (reading) =>
          reading.propertyId === propertyId && reading.period === period,
      ),
    [allReadings, propertyId, period],
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

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[28px] leading-tight font-bold text-ink">
            Meter Readings
          </h1>
          <p className="mt-1 text-[14px] text-muted">
            Record and verify utility meter readings
          </p>
        </div>

        <button
          type="button"
          onClick={() => setBulkOpen(true)}
          aria-haspopup="dialog"
          className="flex items-center gap-2 rounded-lg border border-hairline bg-white px-5 py-2.5 text-[15px] font-semibold text-ink transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
        >
          <Upload aria-hidden="true" className="h-[18px] w-[18px]" />
          Bulk Entry
        </button>
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
                  label: "Reading",
                  value: `${grouped(reading.previous)} → ${grouped(reading.current)}`,
                },
                {
                  label: "Consumption",
                  value: `${grouped(reading.consumption)} u`,
                },
                { label: "Charge", value: lkr(reading.charge) },
              ]}
            />
          ))}
        </ul>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[1040px] text-left">
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
                  className="transition-colors hover:bg-gray-50/70"
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
                    {grouped(reading.consumption)} u
                  </td>
                  <td className={`${CELL} text-right font-bold text-ink`}>
                    {lkr(reading.charge)}
                  </td>
                  <td className={`${CELL} text-muted`}>{reading.date}</td>
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
            No readings taken for this utility.
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

      {bulkOpen && (
        <BulkEntryModal
          propertyId={propertyId}
          period={period}
          onClose={() => setBulkOpen(false)}
        />
      )}
    </div>
  );
}
