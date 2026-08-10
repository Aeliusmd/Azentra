"use client";

import { useState } from "react";

import { SelectField } from "@/components/pm/ui/select-field";
import { InputField } from "@/components/ui/input-field";
import { Modal } from "@/components/ui/modal";
import { TextareaField } from "@/components/ui/textarea-field";
import {
  NO_TECHNICIAN,
  TECHNICIANS,
  WO_PRIORITIES,
  type WorkOrderPriority,
} from "@/lib/pm/work-orders-data";

export type WorkOrderFormValues = {
  title: string;
  location: string;
  priority: WorkOrderPriority;
  description: string;
  technician: string;
  requestId: string;
  scheduledDate: string;
  scheduledTime: string;
};

const EMPTY: WorkOrderFormValues = {
  title: "",
  location: "",
  priority: "Medium",
  description: "",
  technician: NO_TECHNICIAN,
  requestId: "",
  scheduledDate: "",
  scheduledTime: "",
};

export function WorkOrderFormModal({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: WorkOrderFormValues) => void;
}) {
  const [values, setValues] = useState(EMPTY);
  const [error, setError] = useState("");

  function set<K extends keyof WorkOrderFormValues>(
    key: K,
    value: WorkOrderFormValues[K],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!values.title.trim()) {
      setError("Title is required.");
      return;
    }
    onSubmit(values);
    setValues(EMPTY);
    setError("");
  }

  return (
    <Modal open={open} onClose={onClose} title="Create Work Order" size="lg">
      <form onSubmit={handleSubmit}>
        <div className="space-y-5 px-8 py-7">
          <InputField
            id="wo-title"
            label="Title"
            required
            placeholder="e.g. Fix bathroom ceiling leakage"
            value={values.title}
            onChange={(event) => set("title", event.target.value)}
            error={error}
          />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <InputField
              id="wo-location"
              label="Location"
              placeholder="e.g. A-101, Tower A"
              value={values.location}
              onChange={(event) => set("location", event.target.value)}
            />
            <SelectField
              id="wo-priority"
              label="Priority"
              value={values.priority}
              onChange={(value) => set("priority", value as WorkOrderPriority)}
              options={WO_PRIORITIES}
            />
          </div>

          <TextareaField
            id="wo-description"
            label="Description"
            rows={4}
            placeholder="Describe the work to be done..."
            value={values.description}
            onChange={(event) => set("description", event.target.value)}
          />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <SelectField
              id="wo-technician"
              label="Technician"
              value={values.technician}
              onChange={(value) => set("technician", value)}
              options={[NO_TECHNICIAN, ...TECHNICIANS]}
            />
            <InputField
              id="wo-request"
              label="Maintenance Request ID"
              placeholder="e.g. MR-003 (optional)"
              value={values.requestId}
              onChange={(event) => set("requestId", event.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <InputField
              id="wo-date"
              label="Scheduled Date"
              type="date"
              value={values.scheduledDate}
              onChange={(event) => set("scheduledDate", event.target.value)}
            />
            <InputField
              id="wo-time"
              label="Scheduled Time"
              type="time"
              value={values.scheduledTime}
              onChange={(event) => set("scheduledTime", event.target.value)}
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
            Create Work Order
          </button>
        </div>
      </form>
    </Modal>
  );
}
