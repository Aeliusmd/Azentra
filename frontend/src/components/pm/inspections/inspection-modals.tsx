"use client";

import { useState } from "react";
import { CalendarDays, CircleAlert, MapPin, UserRound } from "lucide-react";

import { Pill } from "@/components/pm/ui/pill";
import { SelectField } from "@/components/pm/ui/select-field";
import { FieldLabel, controlClasses } from "@/components/ui/field";
import { InputField } from "@/components/ui/input-field";
import { Modal } from "@/components/ui/modal";
import {
  INSPECTION_STATUS_TONE,
  INSPECTION_TYPES,
  type Inspection,
  type InspectionType,
} from "@/lib/pm/inspections-data";

/* ------------------------------- Schedule form ------------------------------ */

export type InspectionFormValues = {
  title: string;
  type: InspectionType;
  date: string;
  location: string;
  inspector: string;
  /** One checklist item per line. */
  checklist: string;
};

const EMPTY: InspectionFormValues = {
  title: "",
  type: "General",
  date: "",
  location: "",
  inspector: "",
  checklist: "",
};

export function InspectionFormModal({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: InspectionFormValues) => void;
}) {
  const [values, setValues] = useState(EMPTY);
  const [error, setError] = useState("");

  function set<K extends keyof InspectionFormValues>(
    key: K,
    value: InspectionFormValues[K],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!values.title.trim()) {
      setError("Inspection title is required.");
      return;
    }
    onSubmit(values);
    setValues(EMPTY);
    setError("");
  }

  return (
    <Modal open={open} onClose={onClose} title="Schedule Inspection">
      <form onSubmit={handleSubmit}>
        <div className="space-y-5 px-8 py-7">
          <InputField
            id="ins-title"
            label="Title"
            required
            placeholder="e.g. Monthly Fire Safety Check"
            value={values.title}
            onChange={(event) => set("title", event.target.value)}
            error={error}
          />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <SelectField
              id="ins-type"
              label="Type"
              value={values.type}
              onChange={(value) => set("type", value as InspectionType)}
              options={INSPECTION_TYPES}
            />
            <InputField
              id="ins-date"
              label="Date"
              type="date"
              value={values.date}
              onChange={(event) => set("date", event.target.value)}
            />
          </div>

          <InputField
            id="ins-location"
            label="Location"
            placeholder="e.g. All Towers"
            value={values.location}
            onChange={(event) => set("location", event.target.value)}
          />

          <InputField
            id="ins-inspector"
            label="Inspector"
            placeholder="e.g. Property Manager"
            value={values.inspector}
            onChange={(event) => set("inspector", event.target.value)}
          />

          <div>
            <FieldLabel htmlFor="ins-checklist">
              Checklist (one per line)
            </FieldLabel>
            <textarea
              id="ins-checklist"
              rows={5}
              value={values.checklist}
              onChange={(event) => set("checklist", event.target.value)}
              placeholder={"Item 1\nItem 2\nItem 3"}
              className={`${controlClasses()} resize-y px-3.5 py-3`}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-hairline px-8 py-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-hairline px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            Schedule
          </button>
        </div>
      </form>
    </Modal>
  );
}

/* -------------------------------- Detail view ------------------------------- */

function Meta({
  icon: Icon,
  children,
}: {
  icon: typeof MapPin;
  children: React.ReactNode;
}) {
  return (
    <span className="flex items-center gap-1.5 text-[13px] text-muted">
      <Icon aria-hidden="true" className="h-4 w-4 text-gray-400" />
      {children}
    </span>
  );
}

export function InspectionDetailsModal({
  inspection,
  onClose,
}: {
  inspection: Inspection | null;
  onClose: () => void;
}) {
  if (!inspection) return null;

  return (
    <Modal open onClose={onClose} title={inspection.title} size="lg">
      <div className="space-y-6 px-8 py-7">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="font-mono text-[13px] text-gray-500">
            {inspection.id}
          </span>
          <Pill tone={INSPECTION_STATUS_TONE[inspection.status]}>
            {inspection.status}
          </Pill>
          <Pill>{inspection.type}</Pill>
          {inspection.issues > 0 && (
            <span className="flex items-center gap-1 text-[13px] font-medium text-rose-600">
              <CircleAlert aria-hidden="true" className="h-4 w-4" />
              {inspection.issues} issue{inspection.issues === 1 ? "" : "s"}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <Meta icon={MapPin}>{inspection.location}</Meta>
          <Meta icon={UserRound}>{inspection.inspector}</Meta>
          <Meta icon={CalendarDays}>{inspection.date}</Meta>
        </div>

        <div>
          <h3 className="text-[13px] font-semibold text-ink">Checklist</h3>
          <ul className="mt-3 space-y-2">
            {inspection.checklist.map((item) => (
              <li
                key={item.label}
                className="flex items-center gap-3 rounded-lg border border-hairline px-4 py-2.5"
              >
                <span
                  aria-hidden="true"
                  className={`h-4 w-4 shrink-0 rounded border ${
                    item.done
                      ? "border-brand bg-brand"
                      : "border-gray-300 bg-white"
                  }`}
                />
                <span
                  className={`text-[13px] ${
                    item.done ? "text-gray-500 line-through" : "text-ink"
                  }`}
                >
                  {item.label}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-[13px] font-semibold text-ink">Notes</h3>
          <p className="mt-2 text-[13px] text-gray-600">{inspection.notes}</p>
        </div>
      </div>

      <div className="flex justify-end border-t border-hairline px-8 py-5">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-hairline px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
        >
          Close
        </button>
      </div>
    </Modal>
  );
}
