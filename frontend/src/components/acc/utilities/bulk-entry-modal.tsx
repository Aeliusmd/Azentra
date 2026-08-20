"use client";

import { useState } from "react";
import { UploadCloud } from "lucide-react";

import { SelectField } from "@/components/pm/ui/select-field";
import { Modal } from "@/components/ui/modal";
import { periodLabel } from "@/lib/acc/periods";
import { accPropertyName } from "@/lib/acc/properties";
import { showAccToast } from "@/lib/acc/toast-store";
import {
  UTILITY_TYPES,
  type UtilityType,
} from "@/lib/acc/utility-bills-data";
import {
  recordReadings,
  useAccUtilityReadings,
} from "@/lib/acc/utility-readings-store";

type ParsedRow = { unit: string; current: number };

/**
 * Reads the meter round out of a CSV.
 *
 * Deliberately forgiving: a header line is dropped by noticing its third column
 * is not a number, and the previous-reading column is ignored — the meter's own
 * last reading is what consumption is computed against, not whatever the file
 * claims it was.
 */
function parseCsv(text: string): ParsedRow[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) =>
      line.split(",").map((cell) => cell.trim().replace(/^"|"$/g, "")),
    )
    .filter((cells) => cells.length >= 3 && cells[0] !== "")
    .filter((cells) => Number.isFinite(Number(cells[2])))
    .map((cells) => ({ unit: cells[0], current: Number(cells[2]) }));
}

export function BulkEntryModal({
  propertyId,
  period,
  onClose,
}: {
  propertyId: string;
  period: string;
  onClose: () => void;
}) {
  const readings = useAccUtilityReadings();

  const [type, setType] = useState<UtilityType>("Water");
  const [fileName, setFileName] = useState("");
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [dragging, setDragging] = useState(false);

  async function take(file: File | undefined) {
    if (!file) return;
    setFileName(file.name);
    setRows(parseCsv(await file.text()));
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (rows.length === 0) return;

    // Only meters that exist on this property, in this cycle, for this utility.
    const entries = rows.flatMap((row) => {
      const match = readings.find(
        (reading) =>
          reading.propertyId === propertyId &&
          reading.period === period &&
          reading.type === type &&
          reading.unit.toLowerCase() === row.unit.toLowerCase(),
      );
      return match ? [{ id: match.id, current: row.current }] : [];
    });

    if (entries.length === 0) {
      showAccToast(`No ${type.toLowerCase()} meters in the file matched`);
      return;
    }

    recordReadings(entries);
    showAccToast(
      `${entries.length} ${type.toLowerCase()} reading${entries.length === 1 ? "" : "s"} imported`,
    );
    onClose();
  }

  return (
    <Modal
      open
      onClose={onClose}
      title="Bulk Meter Reading Entry"
      subtitle={`${accPropertyName(propertyId)} · ${periodLabel(period)}`}
    >
      <form onSubmit={submit}>
        <div className="space-y-5 px-5 py-5 sm:px-8 sm:py-6">
          <SelectField
            id="bulk-type"
            label="Utility Type"
            value={type}
            onChange={(value) => setType(value as UtilityType)}
            options={UTILITY_TYPES}
          />

          <div>
            {/* A caption, not a second <label> — the dropzone below is the
                control's label, and two of them muddle its accessible name. */}
            <p className="mb-1.5 text-[13px] font-semibold text-ink">
              Upload CSV
            </p>

            <label
              htmlFor="bulk-file"
              onDragOver={(event) => {
                event.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(event) => {
                event.preventDefault();
                setDragging(false);
                void take(event.dataTransfer.files[0]);
              }}
              className={`flex cursor-pointer flex-col items-center rounded-lg border-2 border-dashed px-6 py-9 text-center transition-colors ${
                dragging
                  ? "border-brand bg-brand/5"
                  : "border-gray-300 hover:bg-gray-50"
              }`}
            >
              <UploadCloud
                aria-hidden="true"
                className="h-7 w-7 text-gray-400"
              />
              <span className="mt-3 text-[15px] text-gray-600">
                {fileName || "Click to upload or drag CSV file"}
              </span>
              {fileName && (
                <span className="mt-1 text-[13px] text-muted">
                  {rows.length} reading{rows.length === 1 ? "" : "s"} found
                </span>
              )}
            </label>

            <input
              id="bulk-file"
              type="file"
              accept=".csv,text/csv"
              className="sr-only"
              onChange={(event) => void take(event.target.files?.[0])}
            />
          </div>

          <p className="text-[14px] text-muted">
            CSV format: Unit, Previous Reading, Current Reading
          </p>
        </div>

        {/* Two equal actions, as in the design. They stack on a phone, where
            side by side clips the submit label. */}
        <div className="grid grid-cols-1 gap-3 px-5 pb-6 sm:grid-cols-2 sm:gap-4 sm:px-8">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-hairline px-5 py-3 text-sm font-semibold text-ink transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={rows.length === 0}
            className="rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            Import
          </button>
        </div>
      </form>
    </Modal>
  );
}
