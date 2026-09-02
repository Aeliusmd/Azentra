"use client";

import { useState } from "react";

import { SEVERITY_PICKED } from "@/components/so/incidents/incident-pills";
import { InputField } from "@/components/ui/input-field";
import { Modal } from "@/components/ui/modal";
import { TextareaField } from "@/components/ui/textarea-field";
import {
  INCIDENT_DEFAULT_DATE,
  INCIDENT_SEVERITIES,
  type IncidentSeverity,
} from "@/lib/so/incidents-data";
import { createSoIncident } from "@/lib/so/incidents-store";

/**
 * Filing a report.
 *
 * The date and time default to the portal's own today rather than the
 * browser's, so a report a guard files lands alongside the ones already in the
 * register instead of a month away from them.
 */

const EMPTY = {
  type: "",
  date: INCIDENT_DEFAULT_DATE,
  time: "",
  location: "",
  description: "",
  peopleInvolved: "",
  actionTaken: "",
};

export function SoNewIncidentModal({
  propertyId,
  onClose,
}: {
  propertyId: string;
  onClose: () => void;
}) {
  const [form, setForm] = useState(EMPTY);
  const [severity, setSeverity] = useState<IncidentSeverity>("Medium");

  function set(key: keyof typeof EMPTY, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    createSoIncident({ propertyId, severity, ...form });
    onClose();
  }

  return (
    <Modal open onClose={onClose} title="New Incident Report">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4 px-5 py-5 sm:px-8 sm:py-6">
          <InputField
            id="so-incident-type"
            label="Incident Type"
            placeholder="e.g. Theft, Unauthorized Access"
            required
            value={form.type}
            onChange={(event) => set("type", event.target.value)}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <InputField
              id="so-incident-date"
              label="Date"
              type="date"
              required
              value={form.date}
              onChange={(event) => set("date", event.target.value)}
            />
            <InputField
              id="so-incident-time"
              label="Time"
              type="time"
              required
              value={form.time}
              onChange={(event) => set("time", event.target.value)}
            />
          </div>

          <InputField
            id="so-incident-location"
            label="Location"
            placeholder="Where did this occur?"
            required
            value={form.location}
            onChange={(event) => set("location", event.target.value)}
          />

          <TextareaField
            id="so-incident-description"
            label="Description"
            placeholder="Describe what happened..."
            rows={4}
            required
            value={form.description}
            onChange={(event) => set("description", event.target.value)}
          />

          <InputField
            id="so-incident-people"
            label="People Involved"
            placeholder="Names of people involved"
            value={form.peopleInvolved}
            onChange={(event) => set("peopleInvolved", event.target.value)}
          />

          <InputField
            id="so-incident-action"
            label="Action Taken"
            placeholder="What action was taken?"
            value={form.actionTaken}
            onChange={(event) => set("actionTaken", event.target.value)}
          />

          <fieldset>
            <legend className="mb-1.5 text-[13px] font-semibold text-ink">
              Severity
            </legend>
            <div className="grid grid-cols-4 gap-2">
              {INCIDENT_SEVERITIES.map((option) => {
                const picked = option === severity;

                return (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={picked}
                    onClick={() => setSeverity(option)}
                    className={`rounded-lg border px-2 py-2 text-[14px] font-medium transition-colors sm:px-4 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none ${
                      picked
                        ? SEVERITY_PICKED[option]
                        : "border-hairline bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </fieldset>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-hairline px-5 py-4 sm:flex-row sm:justify-end sm:px-8">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-lg border border-hairline bg-white px-5 py-2.5 text-[14px] font-medium text-ink sm:w-auto transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="w-full rounded-lg bg-[#e0554d] px-5 py-2.5 text-[14px] font-semibold text-white sm:w-auto transition-colors hover:bg-[#c74941] focus-visible:ring-2 focus-visible:ring-[#e0554d]/40 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            Create Report
          </button>
        </div>
      </form>
    </Modal>
  );
}
