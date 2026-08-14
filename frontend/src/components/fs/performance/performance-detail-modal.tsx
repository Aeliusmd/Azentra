"use client";

import { Modal } from "@/components/ui/modal";
import { useTechnicianFeedback } from "@/lib/fs/technician-feedback-store";
import {
  durationLabel,
  technicianInitials,
  type FsTechnician,
} from "@/lib/fs/technicians-data";

const SECTION = "text-[12px] font-semibold tracking-wide text-gray-400 uppercase";

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="text-[22px] leading-none font-bold text-ink">{value}</p>
      <p className="mt-1.5 text-[13px] text-muted">{label}</p>
    </div>
  );
}

/** The technician's record in full, with any notes the supervisor has left. */
export function PerformanceDetailModal({
  technician,
  onClose,
}: {
  technician: FsTechnician;
  onClose: () => void;
}) {
  const notes = useTechnicianFeedback().filter(
    (entry) => entry.technicianId === technician.id,
  );

  return (
    <Modal
      open
      onClose={onClose}
      title={`${technician.name} — Performance`}
      size="lg"
    >
      <div className="max-h-[min(70vh,640px)] space-y-6 overflow-y-auto px-5 py-6 sm:px-8">
        <div className="flex items-center gap-4">
          <span
            aria-hidden="true"
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gray-100 text-[17px] font-semibold text-gray-600"
          >
            {technicianInitials(technician.name)}
          </span>

          <div className="min-w-0">
            <h3 className="text-[19px] font-bold text-ink">
              {technician.name}
            </h3>
            <p className="mt-1 text-[15px] text-muted">
              {technician.title} · Rating: {technician.rating.toFixed(1)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-x-4 gap-y-6">
          <Stat
            value={String(technician.completedJobs)}
            label="Jobs Completed"
          />
          <Stat
            value={durationLabel(technician.avgResolutionHours)}
            label="Avg Time"
          />
          <Stat value={String(technician.emergencyJobs)} label="Emergency" />
          <Stat value={String(technician.reopenedJobs)} label="Reopened" />
          <Stat value={`${technician.onTimeRate}%`} label="On Time" />
          <Stat value={String(technician.materialsUsed)} label="Materials" />
        </div>

        <dl className="grid grid-cols-1 gap-x-8 gap-y-3 border-t border-hairline pt-5 sm:grid-cols-2">
          <div className="flex gap-2">
            <dt className="shrink-0 text-[15px] text-muted">
              Emergency response:
            </dt>
            <dd className="text-[15px] font-medium text-ink">
              {technician.emergencyResponseMins} min
            </dd>
          </div>
          <div className="flex gap-2">
            <dt className="shrink-0 text-[15px] text-muted">Today:</dt>
            <dd className="text-[15px] font-medium text-ink">
              {technician.roster[0]}
            </dd>
          </div>
        </dl>

        {notes.length > 0 && (
          <section>
            <h4 className={SECTION}>Feedback</h4>
            <ul className="mt-3 space-y-3">
              {notes.map((note) => (
                <li
                  key={note.id}
                  className="rounded-lg border border-hairline p-3.5"
                >
                  <p className="text-[15px] text-gray-600">{note.text}</p>
                  <p className="mt-1.5 text-[13px] text-muted">
                    {note.author} · {note.time}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </Modal>
  );
}
