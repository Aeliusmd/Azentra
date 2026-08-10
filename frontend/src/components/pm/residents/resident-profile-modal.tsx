"use client";

import { Pill } from "@/components/pm/ui/pill";
import { Modal } from "@/components/ui/modal";
import {
  PRIORITY_TONE,
  REQUEST_STATUS_TONE,
} from "@/lib/pm/maintenance-data";
import {
  RESIDENT_STATUS_TONE,
  requestsFor,
  type Resident,
} from "@/lib/pm/residents-data";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-semibold tracking-wide text-gray-400 uppercase">
      {children}
    </h3>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <p className="text-[15px]">
      <span className="text-muted">{label}:</span>{" "}
      <span className="font-semibold text-ink">{value}</span>
    </p>
  );
}

export function ResidentProfileModal({
  resident,
  onClose,
}: {
  resident: Resident | null;
  onClose: () => void;
}) {
  if (!resident) return null;

  const history = requestsFor(resident.name);

  return (
    <Modal open onClose={onClose} title={resident.name} size="lg">
      <div className="space-y-7 px-8 py-7">
        <div className="flex flex-wrap items-center gap-3">
          <Pill tone="navy">{resident.role}</Pill>
          <Pill tone={RESIDENT_STATUS_TONE[resident.status]}>
            {resident.status}
          </Pill>
          <span className="text-[15px] text-muted">
            Resident since {resident.createdAt}
          </span>
        </div>

        <section>
          <SectionTitle>Contact Information</SectionTitle>
          <div className="mt-3 grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
            <Field label="Email" value={resident.email} />
            <Field label="Phone" value={resident.phone} />
          </div>
        </section>

        <section>
          <SectionTitle>Unit &amp; Occupancy</SectionTitle>
          <div className="mt-3 grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
            <Field label="Unit" value={resident.unit || "—"} />
            <Field label="Tower" value={resident.tower} />
            <Field
              label="Occupancy"
              value={resident.status === "active" ? "Occupied" : "Not active"}
            />
            <Field label="Last login" value={resident.lastLogin} />
          </div>
        </section>

        <section>
          <SectionTitle>Maintenance History</SectionTitle>
          {history.length === 0 ? (
            <p className="mt-3 text-[15px] text-muted">
              No maintenance requests raised by this resident.
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {history.map((request) => (
                <li
                  key={request.id}
                  className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-lg border border-hairline px-4 py-3"
                >
                  <span className="font-mono text-xs text-gray-400">
                    {request.id}
                  </span>
                  <span className="min-w-0 flex-1 text-[15px] font-medium text-ink">
                    {request.title}
                  </span>
                  <Pill tone={PRIORITY_TONE[request.priority]}>
                    {request.priority}
                  </Pill>
                  <Pill tone={REQUEST_STATUS_TONE[request.status]}>
                    {request.status}
                  </Pill>
                </li>
              ))}
            </ul>
          )}
        </section>
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
