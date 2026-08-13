"use client";

import { Pill } from "@/components/pm/ui/pill";
import { Modal } from "@/components/ui/modal";
import {
  AVAILABILITY_TONE,
  durationLabel,
  technicianInitials,
  type FsTechnician,
} from "@/lib/fs/technicians-data";

const SECTION = "text-[12px] font-semibold tracking-wide text-gray-400 uppercase";

/** Tinted stat tiles — the technician's record at a glance. */
const TILE = {
  green: { box: "border-green-200 bg-green-50/70", value: "text-green-700" },
  navy: { box: "border-[#cfe0f0] bg-[#eef3f9]", value: "text-[#1b3a5c]" },
  rose: { box: "border-rose-200 bg-rose-50/70", value: "text-rose-700" },
  orange: { box: "border-orange-200 bg-orange-50/70", value: "text-orange-700" },
  amber: { box: "border-amber-200 bg-amber-50/70", value: "text-amber-700" },
} as const;

function Stat({
  value,
  label,
  tone,
}: {
  value: string;
  label: string;
  tone: keyof typeof TILE;
}) {
  return (
    <div className={`rounded-lg border px-4 py-4 text-center ${TILE[tone].box}`}>
      <p className={`text-[22px] leading-none font-bold ${TILE[tone].value}`}>
        {value}
      </p>
      <p className="mt-1.5 text-[13px] text-muted">{label}</p>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <dt className="shrink-0 text-[15px] text-muted">{label}:</dt>
      <dd className="min-w-0 text-[15px] font-medium text-ink">{value}</dd>
    </div>
  );
}

/** Who they are, when they are on, and how they have been performing. */
export function TechnicianDetailModal({
  technician,
  onClose,
}: {
  technician: FsTechnician;
  onClose: () => void;
}) {
  return (
    <Modal open onClose={onClose} title="Technician Details" size="lg">
      <div className="max-h-[min(70vh,640px)] space-y-6 overflow-y-auto px-8 py-6">
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
            <p className="mt-1 flex flex-wrap items-center gap-2 text-[15px] text-muted">
              {technician.title}
              <Pill tone={AVAILABILITY_TONE[technician.availability]}>
                {technician.availability}
              </Pill>
            </p>
          </div>
        </div>

        <dl className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
          <Detail label="Phone" value={technician.phone} />
          <Detail label="Rating" value={technician.rating.toFixed(1)} />
          <Detail label="Today" value={technician.roster[0]} />
          <Detail label="Tomorrow" value={technician.roster[1]} />
          <Detail label="Email" value={technician.email} />
          <Detail label="Capacity" value={`${technician.capacity} jobs`} />
        </dl>

        <section>
          <h4 className={SECTION}>Specializations</h4>
          <ul className="mt-2.5 flex flex-wrap gap-2">
            {technician.skills.map((skill) => (
              <li
                key={skill}
                className="rounded-md bg-gray-100 px-2.5 py-1.5 text-[13px] font-medium text-gray-600"
              >
                {skill}
              </li>
            ))}
          </ul>
        </section>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Stat
            tone="green"
            value={String(technician.completedJobs)}
            label="Completed"
          />
          <Stat
            tone="green"
            value={durationLabel(technician.avgResolutionHours)}
            label="Avg Time"
          />
          <Stat
            tone="navy"
            value={`${technician.onTimeRate}%`}
            label="On Time"
          />
          <Stat
            tone="rose"
            value={String(technician.emergencyJobs)}
            label="Emergency"
          />
          <Stat
            tone="orange"
            value={String(technician.reopenedJobs)}
            label="Reopened"
          />
          <Stat
            tone="amber"
            value={String(technician.materialsUsed)}
            label="Materials"
          />
        </div>
      </div>
    </Modal>
  );
}
