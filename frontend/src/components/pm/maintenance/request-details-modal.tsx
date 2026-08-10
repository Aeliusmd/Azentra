"use client";

import {
  Flag,
  Image as ImageIcon,
  MapPin,
  StickyNote,
  Tag,
  UserRoundPlus,
  type LucideIcon,
} from "lucide-react";

import { Pill } from "@/components/pm/ui/pill";
import { Modal } from "@/components/ui/modal";
import {
  PRIORITY_TONE,
  REQUEST_STATUS_TONE,
  type MaintenanceRequest,
} from "@/lib/pm/maintenance-data";

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

function Meta({
  icon: Icon,
  children,
}: {
  icon: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <span className="flex items-center gap-1.5 text-[15px] text-muted">
      <Icon aria-hidden="true" className="h-4 w-4 text-gray-400" />
      {children}
    </span>
  );
}

function ActionButton({
  icon: Icon,
  label,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 rounded-lg border border-hairline px-5 py-3 text-[15px] font-medium text-ink transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
    >
      <Icon aria-hidden="true" className="h-[18px] w-[18px] text-gray-500" />
      {label}
    </button>
  );
}

export function RequestDetailsModal({
  request,
  onClose,
  onChangePriority,
  onAssignTechnician,
  onAddNote,
}: {
  request: MaintenanceRequest;
  onClose: () => void;
  onChangePriority: () => void;
  onAssignTechnician: () => void;
  onAddNote: () => void;
}) {
  return (
    <Modal open onClose={onClose} title={`Request ${request.id}`} size="lg">
      <div className="space-y-7 px-8 py-7">
        <div className="flex flex-wrap items-center gap-3">
          <Pill tone={REQUEST_STATUS_TONE[request.status]}>
            {request.status}
          </Pill>
          <Pill tone={PRIORITY_TONE[request.priority]}>{request.priority}</Pill>
          <span className="text-[15px] text-muted">
            Created: {request.createdAt}
          </span>
        </div>

        <section>
          <SectionTitle>Resident Information</SectionTitle>
          <div className="mt-3 grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
            <Field label="Name" value={request.resident} />
            <Field label="Unit" value={request.unit} />
            <Field label="Contact" value={request.residentContact} />
          </div>
        </section>

        <section>
          <SectionTitle>Issue Details</SectionTitle>
          <p className="mt-3 text-[15px] leading-relaxed text-ink">
            {request.description}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2">
            <Meta icon={MapPin}>{request.locationDetail}</Meta>
            <Meta icon={ImageIcon}>
              {request.images} image{request.images === 1 ? "" : "s"}
            </Meta>
            <Meta icon={Tag}>{request.category}</Meta>
          </div>
        </section>

        <section>
          <SectionTitle>Assigned Team</SectionTitle>
          <div className="mt-3 grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
            <Field
              label="Technician"
              value={request.technician || "Not assigned"}
            />
            <Field label="Supervisor" value={request.supervisor} />
          </div>
        </section>

        <section>
          <SectionTitle>Timeline</SectionTitle>
          <ul className="mt-3 space-y-4">
            {request.timeline.map((entry, index) => (
              <li key={index} className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-brand"
                />
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] text-ink">
                    <span className="font-semibold">{entry.label}</span>{" "}
                    {entry.by}
                  </span>
                  <span className="mt-0.5 block text-[13px] text-gray-400">
                    {entry.at}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        {request.notes.length > 0 && (
          <section>
            <SectionTitle>Notes</SectionTitle>
            <ul className="mt-3 space-y-2">
              {request.notes.map((note, index) => (
                <li
                  key={index}
                  className="rounded-lg border border-hairline bg-gray-50/60 px-4 py-3 text-[15px] text-gray-600"
                >
                  {note}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <div className="flex flex-wrap gap-3 border-t border-hairline px-8 py-5">
        <ActionButton
          icon={Flag}
          label="Change Priority"
          onClick={onChangePriority}
        />
        <ActionButton
          icon={UserRoundPlus}
          label="Assign Technician"
          onClick={onAssignTechnician}
        />
        <ActionButton icon={StickyNote} label="Add Note" onClick={onAddNote} />
      </div>
    </Modal>
  );
}
