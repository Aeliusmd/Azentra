"use client";

import { FsPhotoTiles } from "@/components/fs/ui/photo-tiles";
import { Pill } from "@/components/pm/ui/pill";
import { Modal } from "@/components/ui/modal";
import {
  ageLabel,
  MR_PRIORITY_TONE,
  MR_STATUS_TONE,
  type MaintenanceRequest,
} from "@/lib/fs/maintenance-requests-data";

const SECTION = "text-[12px] font-semibold tracking-wide text-gray-400 uppercase";

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <dt className="shrink-0 text-[15px] text-muted">{label}:</dt>
      <dd className="min-w-0 text-[15px] font-medium text-ink">{value}</dd>
    </div>
  );
}

/**
 * What the resident actually reported. Read-only on purpose: a request is the
 * Property Manager's record, and the supervisor acts on the work order it
 * becomes rather than on the request itself.
 */
export function RequestDetailModal({
  request,
  onClose,
}: {
  request: MaintenanceRequest;
  onClose: () => void;
}) {
  return (
    <Modal
      open
      onClose={onClose}
      title={`Request ${request.id}`}
      size="lg"
    >
      <div className="max-h-[min(70vh,620px)] space-y-6 overflow-y-auto px-8 py-6">
        <div className="flex flex-wrap items-center gap-3">
          <Pill tone={MR_STATUS_TONE[request.status]}>{request.status}</Pill>
          <Pill tone={MR_PRIORITY_TONE[request.priority]}>
            {request.priority}
          </Pill>
          <span className="text-[13px] text-muted">
            Open {ageLabel(request.submittedAt)}
          </span>
        </div>

        <div>
          <h3 className="text-[19px] font-bold text-ink">{request.title}</h3>
          <p className="mt-1.5 text-[15px] text-muted">{request.description}</p>
        </div>

        <dl className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
          <Detail label="Resident" value={request.resident} />
          <Detail label="Contact" value={request.residentPhone} />
          <Detail
            label="Unit"
            value={`${request.building} - ${request.unit}`}
          />
          <Detail label="Category" value={request.category} />
          <Detail label="Submitted" value={request.submittedAt} />
          <Detail label="Due" value={request.dueDate} />
          <Detail
            label="Technician"
            value={request.technician ?? "Not assigned"}
          />
          <Detail
            label="Work Order"
            value={request.workOrderId ?? "Not raised yet"}
          />
        </dl>

        {request.photos.length > 0 && (
          <section>
            <h4 className={SECTION}>Reported Photos</h4>
            <FsPhotoTiles photos={request.photos} />
          </section>
        )}
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
