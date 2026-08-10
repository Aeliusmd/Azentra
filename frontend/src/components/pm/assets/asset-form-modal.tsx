"use client";

import { useState } from "react";

import { SelectField } from "@/components/pm/ui/select-field";
import { InputField } from "@/components/ui/input-field";
import { Modal } from "@/components/ui/modal";
import { ASSET_CATEGORIES, type AssetCategory } from "@/lib/pm/assets-data";

export type AssetFormValues = {
  name: string;
  category: AssetCategory;
  location: string;
  model: string;
  serialNumber: string;
  purchaseDate: string;
  warrantyExpiry: string;
  vendor: string;
};

const EMPTY: AssetFormValues = {
  name: "",
  category: "Elevator",
  location: "",
  model: "",
  serialNumber: "",
  purchaseDate: "",
  warrantyExpiry: "",
  vendor: "",
};

export function AssetFormModal({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: AssetFormValues) => void;
}) {
  const [values, setValues] = useState(EMPTY);
  const [error, setError] = useState("");

  function set<K extends keyof AssetFormValues>(
    key: K,
    value: AssetFormValues[K],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!values.name.trim()) {
      setError("Asset name is required.");
      return;
    }
    onSubmit(values);
    setValues(EMPTY);
    setError("");
  }

  return (
    <Modal open={open} onClose={onClose} title="Add Asset">
      <form onSubmit={handleSubmit}>
        <div className="space-y-5 px-8 py-7">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <InputField
              id="asset-name"
              label="Name"
              required
              placeholder="e.g. Elevator Tower D"
              value={values.name}
              onChange={(event) => set("name", event.target.value)}
              error={error}
            />
            <SelectField
              id="asset-category"
              label="Category"
              value={values.category}
              onChange={(value) => set("category", value as AssetCategory)}
              options={ASSET_CATEGORIES}
            />
          </div>

          <InputField
            id="asset-location"
            label="Location"
            placeholder="e.g. Basement, Tower A"
            value={values.location}
            onChange={(event) => set("location", event.target.value)}
          />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <InputField
              id="asset-model"
              label="Model"
              value={values.model}
              onChange={(event) => set("model", event.target.value)}
            />
            <InputField
              id="asset-serial"
              label="Serial Number"
              value={values.serialNumber}
              onChange={(event) => set("serialNumber", event.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <InputField
              id="asset-purchased"
              label="Purchase Date"
              type="date"
              value={values.purchaseDate}
              onChange={(event) => set("purchaseDate", event.target.value)}
            />
            <InputField
              id="asset-warranty"
              label="Warranty Expiry"
              type="date"
              value={values.warrantyExpiry}
              onChange={(event) => set("warrantyExpiry", event.target.value)}
            />
          </div>

          <InputField
            id="asset-vendor"
            label="Vendor"
            placeholder="e.g. ElevatorPro Services"
            value={values.vendor}
            onChange={(event) => set("vendor", event.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3 border-t border-hairline px-8 py-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-hairline px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            Add Asset
          </button>
        </div>
      </form>
    </Modal>
  );
}
