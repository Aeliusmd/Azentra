"use client";

import { useMemo, useState } from "react";

import { AssetDetailsModal } from "@/components/pm/assets/asset-details-modal";
import {
  AssetFormModal,
  type AssetFormValues,
} from "@/components/pm/assets/asset-form-modal";
import { FilterChips } from "@/components/pm/ui/filter-chips";
import { Pill } from "@/components/pm/ui/pill";
import {
  PmPageHeader,
  PmPrimaryButton,
} from "@/components/pm/ui/pm-page-header";
import {
  ASSET_CATEGORIES,
  ASSET_STATUS_TONE,
  assets as seed,
  nextAssetId,
  type Asset,
} from "@/lib/pm/assets-data";

const FILTERS = ["All", ...ASSET_CATEGORIES] as const;

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <dt className="shrink-0 text-[15px] text-muted">{label}:</dt>
      <dd className="min-w-0 truncate text-[15px] text-ink">{value}</dd>
    </div>
  );
}

export function AssetsView() {
  const [list, setList] = useState<Asset[]>(seed);
  const [filter, setFilter] = useState<string>("All");
  const [formOpen, setFormOpen] = useState(false);
  const [viewing, setViewing] = useState<Asset | null>(null);

  const visible = useMemo(
    () =>
      filter === "All"
        ? list
        : list.filter((asset) => asset.category === filter),
    [list, filter],
  );

  function handleCreate(values: AssetFormValues) {
    setList((current) => [
      ...current,
      {
        id: nextAssetId(current),
        name: values.name.trim(),
        category: values.category,
        location: values.location.trim() || "—",
        vendor: values.vendor.trim() || "—",
        model: values.model.trim() || "—",
        serial: values.serialNumber.trim() || "—",
        purchaseDate: values.purchaseDate || "—",
        warrantyExpiry: values.warrantyExpiry || "—",
        lastServiced: "—",
        nextService: "—",
        status: "Active",
      },
    ]);
    setFormOpen(false);
  }

  return (
    <div className="space-y-6">
      <PmPageHeader
        title="Assets"
        subtitle="Manage property assets and equipment"
        action={
          <PmPrimaryButton label="Add Asset" onClick={() => setFormOpen(true)} />
        }
      />

      <FilterChips
        label="Filter assets by category"
        options={FILTERS}
        value={filter}
        onChange={setFilter}
      />

      {visible.length === 0 ? (
        <p className="rounded-lg border border-hairline bg-white px-6 py-12 text-center text-[15px] text-muted">
          No assets in this category.
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((asset) => (
            <li key={asset.id}>
              <button
                type="button"
                onClick={() => setViewing(asset)}
                className="flex h-full w-full flex-col rounded-xl border border-hairline bg-white px-5 py-4 text-left transition-colors hover:bg-gray-50/70 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
              >
                <span className="flex items-start justify-between gap-3">
                  <span className="text-[17px] font-bold text-ink">
                    {asset.name}
                  </span>
                  <Pill tone={ASSET_STATUS_TONE[asset.status]}>
                    {asset.status}
                  </Pill>
                </span>

                <dl className="mt-3 flex-1 space-y-1.5">
                  <Row label="Category" value={asset.category} />
                  <Row label="Location" value={asset.location} />
                  <Row label="Vendor" value={asset.vendor} />
                </dl>

                <span className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-hairline pt-3">
                  <span className="text-[15px] text-muted">
                    Last serviced: {asset.lastServiced}
                  </span>
                  <span className="text-[15px] text-muted">
                    Next:{" "}
                    <span className="font-semibold text-brand">
                      {asset.nextService}
                    </span>
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <AssetDetailsModal asset={viewing} onClose={() => setViewing(null)} />

      <AssetFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleCreate}
      />
    </div>
  );
}
