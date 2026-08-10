"use client";

import { useState } from "react";
import { CheckCheck } from "lucide-react";

import { Pill } from "@/components/pm/ui/pill";
import { Modal } from "@/components/ui/modal";
import {
  COMPLAINT_PRIORITY_TONE,
  COMPLAINT_STATUS_TONE,
  type Complaint,
} from "@/lib/pm/complaints-data";

/** The resolve flow uses a steel blue rather than the brand green. */
const BLUE =
  "rounded-lg bg-[#4a7fb5] px-5 py-3 text-[17px] font-semibold text-white transition-colors hover:bg-[#3f6d9d] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-[#4a7fb5]/40 focus-visible:ring-offset-2 focus-visible:outline-none";

function Field({ label, value }: { label: string; value: string }) {
  return (
    <p className="text-[17px]">
      <span className="text-muted">{label}:</span>{" "}
      <span className="font-semibold text-ink">{value}</span>
    </p>
  );
}

export function ComplaintDetailsModal({
  complaint,
  onClose,
  onResolve,
}: {
  complaint: Complaint;
  onClose: () => void;
  onResolve: () => void;
}) {
  return (
    <Modal open onClose={onClose} title={`Complaint ${complaint.id}`} size="lg">
      <div className="px-8 py-7">
        <div className="flex flex-wrap items-center gap-3">
          <Pill tone={COMPLAINT_STATUS_TONE[complaint.status]}>
            {complaint.status}
          </Pill>
          <Pill tone={COMPLAINT_PRIORITY_TONE[complaint.priority]}>
            {complaint.priority}
          </Pill>
          <span className="text-[17px] text-muted">{complaint.filedAt}</span>
        </div>

        <h3 className="mt-5 text-[19px] font-bold text-ink">
          {complaint.title}
        </h3>
        <p className="mt-1.5 text-[17px] leading-relaxed text-gray-600">
          {complaint.description}
        </p>

        <div className="mt-6 grid grid-cols-1 gap-x-10 gap-y-4 sm:grid-cols-2">
          <Field label="Filed by" value={complaint.filedBy} />
          <Field label="Unit" value={complaint.unit} />
          <Field label="Category" value={complaint.category} />
          <Field label="Department" value={complaint.department} />
        </div>

        {complaint.resolution && (
          <div className="mt-6">
            <h4 className="text-xs font-semibold tracking-wide text-gray-400 uppercase">
              Resolution
            </h4>
            <p className="mt-2 text-[15px] text-gray-600">
              {complaint.resolution}
            </p>
          </div>
        )}
      </div>

      {complaint.status !== "Resolved" && (
        <div className="border-t border-hairline px-8 py-5">
          <button type="button" onClick={onResolve} className={BLUE}>
            <span className="flex items-center gap-2">
              <CheckCheck aria-hidden="true" className="h-5 w-5" />
              Resolve
            </span>
          </button>
        </div>
      )}
    </Modal>
  );
}

export function ResolveComplaintModal({
  complaint,
  onClose,
  onSubmit,
}: {
  complaint: Complaint;
  onClose: () => void;
  onSubmit: (resolution: string) => void;
}) {
  const [resolution, setResolution] = useState("");

  return (
    <Modal open onClose={onClose} title="Resolve Complaint">
      <div className="px-8 py-7">
        <label
          htmlFor="complaint-resolution"
          className="text-[17px] text-gray-600"
        >
          Enter resolution details for {complaint.id}
        </label>
        <textarea
          id="complaint-resolution"
          rows={4}
          value={resolution}
          onChange={(event) => setResolution(event.target.value)}
          placeholder="Describe how this was resolved..."
          className="mt-4 w-full resize-none rounded-xl border border-hairline bg-white px-4 py-3.5 text-[17px] text-ink placeholder:text-gray-400 outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20"
        />
      </div>

      <div className="flex justify-end gap-3 border-t border-hairline px-8 py-5">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-hairline px-5 py-3 text-[17px] font-semibold text-ink transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={!resolution.trim()}
          onClick={() => onSubmit(resolution.trim())}
          className={BLUE}
        >
          Mark Resolved
        </button>
      </div>
    </Modal>
  );
}
