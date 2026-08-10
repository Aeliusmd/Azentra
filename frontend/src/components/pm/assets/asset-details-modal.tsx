"use client";

import { Pill } from "@/components/pm/ui/pill";
import { Modal } from "@/components/ui/modal";
import { ASSET_STATUS_TONE, type Asset } from "@/lib/pm/assets-data";

function Field({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  /** Renders the value in brand green — used for the next service date. */
  highlight?: boolean;
}) {
  return (
    <p className="text-[17px]">
      <span className="text-muted">{label}:</span>{" "}
      <span className={highlight ? "font-semibold text-brand" : "text-ink"}>
        {value}
      </span>
    </p>
  );
}

export function AssetDetailsModal({
  asset,
  onClose,
}: {
  asset: Asset | null;
  onClose: () => void;
}) {
  if (!asset) return null;

  return (
    <Modal open onClose={onClose} title={asset.name} size="lg">
      <div className="px-8 py-7">
        <div className="flex flex-wrap items-center gap-3">
          <Pill tone={ASSET_STATUS_TONE[asset.status]}>{asset.status}</Pill>
          <Pill>{asset.category}</Pill>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-x-10 gap-y-4 sm:grid-cols-2">
          <Field label="Model" value={asset.model} />
          <Field label="Serial" value={asset.serial} />
          <Field label="Location" value={asset.location} />
          <Field label="Purchase" value={asset.purchaseDate} />
          <Field label="Warranty" value={asset.warrantyExpiry} />
          <Field label="Vendor" value={asset.vendor} />
          <Field label="Last Serviced" value={asset.lastServiced} />
          <Field label="Next Service" value={asset.nextService} highlight />
        </div>
      </div>
    </Modal>
  );
}
