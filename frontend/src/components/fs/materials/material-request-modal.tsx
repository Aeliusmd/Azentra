"use client";

import { useState } from "react";

import { Pill } from "@/components/pm/ui/pill";
import { InputField } from "@/components/ui/input-field";
import { Modal } from "@/components/ui/modal";
import { TextareaField } from "@/components/ui/textarea-field";
import {
  MATERIAL_STATUS_TONE,
  type FsMaterialRequest,
} from "@/lib/fs/materials-data";
import {
  setMaterialRequestQuantity,
  setMaterialRequestStatus,
} from "@/lib/fs/materials-store";
import { showFsToast } from "@/lib/fs/toast-store";

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
 * One request, and the decision that belongs to the supervisor. A pending ask
 * is approved or rejected; an approved one is marked once it has been ordered.
 */
export function MaterialRequestModal({
  request,
  onClose,
}: {
  request: FsMaterialRequest;
  onClose: () => void;
}) {
  const [note, setNote] = useState("");
  /** Non-null while the quantity is being corrected. */
  const [quantity, setQuantity] = useState<string | null>(null);

  const pending = request.status === "Pending";
  const approved = request.status === "Approved";
  const editing = quantity !== null;

  function saveQuantity() {
    const value = (quantity ?? "").trim();
    if (value) {
      setMaterialRequestQuantity(request.id, value);
      showFsToast(`${request.id} quantity set to ${value}`);
    }
    setQuantity(null);
  }

  function decide(status: "Approved" | "Rejected" | "Ordered", fallback: string) {
    setMaterialRequestStatus(request.id, status, note.trim() || fallback);
    showFsToast(`${request.id} ${status.toLowerCase()}`);
    onClose();
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={`Material Request ${request.id}`}
      size="lg"
    >
      <div className="max-h-[min(70vh,640px)] space-y-6 overflow-y-auto px-5 py-6 sm:px-8">
        <Pill tone={MATERIAL_STATUS_TONE[request.status]}>
          {request.status}
        </Pill>

        <dl className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
          <Detail label="Material" value={request.material} />
          {editing ? (
            <div>
              <InputField
                id="mr-quantity"
                label="Quantity"
                autoFocus
                placeholder="e.g. 2 units"
                value={quantity ?? ""}
                onChange={(event) => setQuantity(event.target.value)}
              />
            </div>
          ) : (
            <Detail label="Quantity" value={request.quantity} />
          )}
          <Detail
            label="Job"
            value={`${request.workOrderId} - ${request.job}`}
          />
          <Detail label="Technician" value={request.technician} />
          <Detail label="Requested" value={request.requestedAt} />
        </dl>

        <section>
          <h4 className={SECTION}>Reason</h4>
          <p className="mt-2 text-[15px] text-gray-600">{request.reason}</p>
        </section>

        {request.notes && (
          <section>
            <h4 className={SECTION}>Notes</h4>
            <p className="mt-2 text-[15px] text-gray-600">{request.notes}</p>
          </section>
        )}

        {(pending || approved) && (
          <TextareaField
            id="mr-note"
            label="Note (optional)"
            rows={2}
            placeholder="Where it comes from, or why it is being turned down..."
            value={note}
            onChange={(event) => setNote(event.target.value)}
          />
        )}
      </div>

      {(pending || approved) && (
        <div className="flex flex-wrap gap-3 border-t border-hairline px-5 py-4 sm:px-8 sm:py-5">
          {editing ? (
            <>
              <button
                type="button"
                onClick={saveQuantity}
                className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                Save Quantity
              </button>
              <button
                type="button"
                onClick={() => setQuantity(null)}
                className="rounded-lg border border-hairline px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
              >
                Cancel
              </button>
            </>
          ) : pending ? (
            <>
              <button
                type="button"
                onClick={() => decide("Approved", "Approved by Carlos Rivera.")}
                className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                Approve
              </button>
              <button
                type="button"
                onClick={() => decide("Rejected", "Rejected by Carlos Rivera.")}
                className="rounded-lg bg-[#e0554d] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#c9463f] focus-visible:ring-2 focus-visible:ring-[#e0554d]/40 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                Reject
              </button>
              <button
                type="button"
                onClick={() => setQuantity(request.quantity)}
                className="rounded-lg border border-hairline px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
              >
                Edit Qty
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => decide("Ordered", "Ordered from the supplier.")}
              className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              Mark as Ordered
            </button>
          )}
        </div>
      )}
    </Modal>
  );
}
