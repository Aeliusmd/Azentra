"use client";

import { useState } from "react";
import { QrCode } from "lucide-react";

import { TenQrCode } from "@/components/ten/ui/qr-code";
import { showTenToast } from "@/components/ten/ui/toaster";
import { Modal } from "@/components/ui/modal";
import { longDate, timeRange } from "@/lib/res/format";
import {
  isCancellablePass,
  vehicleLine,
  type VisitorPass,
  type VisitorStatus,
} from "@/lib/ten/visitors-data";
import { cancelTenVisitorPass } from "@/lib/ten/visitors-store";

/** Only genuine bad news is red; an expired pass is just over. */
const STATUS_TEXT: Record<VisitorStatus, string> = {
  Upcoming: "text-green-600",
  Active: "text-green-600",
  "Checked In": "text-green-600",
  "Checked Out": "text-ink",
  Expired: "text-muted",
  Cancelled: "text-rose-600",
};

function Row({
  label,
  value,
  valueClass = "text-ink",
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-6 py-2.5">
      <dt className="shrink-0 text-[15px] text-muted">{label}</dt>
      <dd className={`text-right text-[15px] font-semibold ${valueClass}`}>
        {value}
      </dd>
    </div>
  );
}

/**
 * One visitor pass in full.
 *
 * Read-only apart from calling it off. `Checked In` and `Checked Out` are the
 * gate's stamps and appear here only as a status — there is no control in this
 * dialog that admits anybody, because that is Security's to do.
 */
export function VisitorDetailModal({
  pass,
  onClose,
}: {
  pass: VisitorPass;
  onClose: () => void;
}) {
  const [showPass, setShowPass] = useState(false);

  /**
   * Whether the pass is still good for anything.
   *
   * A visit that has been, expired or was called off has no square worth
   * scanning and nothing left to cancel, so it is shown as a plain record —
   * which is why the whole footer hangs off this rather than each button.
   */
  const isLive = isCancellablePass(pass);

  function handleCancel() {
    cancelTenVisitorPass(pass.id);
    showTenToast(`Pass for ${pass.name} cancelled`);
    onClose();
  }

  return (
    <Modal open onClose={onClose} title={pass.name}>
      <div className="max-h-[62vh] overflow-y-auto px-5 py-5 sm:px-8">
        <dl>
          <Row label="Phone" value={pass.phone} />
          <Row
            label="Date & Time"
            value={`${longDate(pass.date)} · ${timeRange(pass.from, pass.to)}`}
          />
          <Row label="Purpose" value={pass.purpose} />
          <Row
            label="Vehicle"
            value={pass.vehicle ? vehicleLine(pass.vehicle) : "None"}
          />
          <Row label="Parking" value={pass.parkingBay ?? "Not required"} />
          <Row
            label="Status"
            value={pass.status}
            valueClass={STATUS_TEXT[pass.status]}
          />
        </dl>

        {/* The square the gate scans — a mock, drawn from the pass id. */}
        {isLive && showPass && (
          <div className="mt-5 flex flex-col items-center rounded-lg border border-hairline bg-gray-50/70 px-4 py-5">
            <TenQrCode value={pass.id} className="h-40 w-40 text-ink" />
            <p className="mt-3 text-[14px] font-semibold text-ink">{pass.id}</p>
            <p className="mt-0.5 text-[13px] text-muted">
              Show this at the gate on arrival
            </p>
          </div>
        )}
      </div>

      {/* A pass can be shown and called off right up until the visitor is
          admitted. Past visits are a record, so they get no footer at all. */}
      {isLive && (
        <div className="flex flex-col-reverse gap-3 px-5 pb-5 sm:flex-row sm:px-8 sm:pb-6">
          <button
            type="button"
            onClick={() => setShowPass((open) => !open)}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-hairline px-5 py-3 text-[15px] font-semibold text-ink transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
          >
            <QrCode aria-hidden="true" className="h-4 w-4" />
            {showPass ? "Hide Pass" : "View QR Pass"}
          </button>

          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 rounded-lg border border-rose-200 px-5 py-3 text-[15px] font-semibold text-rose-600 transition-colors hover:bg-rose-50 focus-visible:ring-2 focus-visible:ring-rose-300 focus-visible:outline-none"
          >
            Cancel Pass
          </button>
        </div>
      )}
    </Modal>
  );
}
