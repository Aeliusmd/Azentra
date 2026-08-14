"use client";

import { useState } from "react";
import { FilePlus } from "lucide-react";

import { SelectField } from "@/components/pm/ui/select-field";
import { InputField } from "@/components/ui/input-field";
import { Modal } from "@/components/ui/modal";
import { TextareaField } from "@/components/ui/textarea-field";
import {
  REPORT_TYPES,
  SUMMARY_LIMIT,
  type FsReportType,
} from "@/lib/fs/field-reports-data";
import { addFieldReport } from "@/lib/fs/field-reports-store";
import { useFsProfile } from "@/lib/fs/profile-store";
import { useSelectedFsProperty } from "@/lib/fs/properties";
import { showFsToast } from "@/lib/fs/toast-store";

/** Writes up a report and files it against the property being looked at. */
export function GenerateReportModal({ onClose }: { onClose: () => void }) {
  const propertyId = useSelectedFsProperty();
  const profile = useFsProfile();

  const [type, setType] = useState<FsReportType>(REPORT_TYPES[0]);
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [author, setAuthor] = useState(profile.name);
  const [summary, setSummary] = useState("");

  const ready = date !== "" && summary.trim() !== "" && author.trim() !== "";

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!ready) return;

    const id = addFieldReport({
      propertyId,
      type,
      location: location.trim(),
      author: author.trim(),
      date,
      summary: summary.trim(),
    });

    showFsToast(`${id} filed`);
    onClose();
  }

  return (
    <Modal open onClose={onClose} title="Generate Report" size="lg">
      <form onSubmit={handleSubmit}>
        <div className="space-y-5 px-5 py-6 sm:px-8 sm:py-7">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <SelectField
              id="gr-type"
              label="Report Type"
              value={type}
              onChange={(value) => setType(value as FsReportType)}
              options={REPORT_TYPES}
            />
            <InputField
              id="gr-date"
              label="Date"
              type="date"
              required
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <InputField
              id="gr-location"
              label="Location"
              placeholder="e.g. Tower B - Unit B-602"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
            />
            <InputField
              id="gr-author"
              label="Author"
              required
              value={author}
              onChange={(event) => setAuthor(event.target.value)}
            />
          </div>

          <div>
            <TextareaField
              id="gr-summary"
              label="Summary"
              rows={5}
              required
              maxLength={SUMMARY_LIMIT}
              placeholder="Describe the findings, work completed, and recommendations..."
              value={summary}
              onChange={(event) => setSummary(event.target.value)}
            />
            <p className="mt-1.5 text-right text-[13px] text-muted">
              {summary.length}/{SUMMARY_LIMIT}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap justify-end gap-3 border-t border-hairline px-5 py-4 sm:px-8 sm:py-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-hairline px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!ready}
            className="flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            <FilePlus aria-hidden="true" className="h-[18px] w-[18px]" />
            Generate Report
          </button>
        </div>
      </form>
    </Modal>
  );
}
