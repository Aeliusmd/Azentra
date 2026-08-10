"use client";

import { useState } from "react";

import { SelectField } from "@/components/pm/ui/select-field";
import { InputField } from "@/components/ui/input-field";
import { Modal } from "@/components/ui/modal";
import { PAYMENT_TERMS, VENDOR_CATEGORIES } from "@/lib/pm/vendors-data";

export type VendorFormValues = {
  name: string;
  category: string;
  contact: string;
  phone: string;
  email: string;
  address: string;
  services: string;
  contractStart: string;
  contractEnd: string;
  paymentTerms: string;
};

const EMPTY: VendorFormValues = {
  name: "",
  category: VENDOR_CATEGORIES[0],
  contact: "",
  phone: "",
  email: "",
  address: "",
  services: "",
  contractStart: "",
  contractEnd: "",
  paymentTerms: PAYMENT_TERMS[0],
};

export function VendorFormModal({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: VendorFormValues) => void;
}) {
  const [values, setValues] = useState(EMPTY);
  const [error, setError] = useState("");

  function set<K extends keyof VendorFormValues>(
    key: K,
    value: VendorFormValues[K],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!values.name.trim()) {
      setError("Company name is required.");
      return;
    }
    onSubmit(values);
    setValues(EMPTY);
    setError("");
  }

  return (
    <Modal open={open} onClose={onClose} title="Add Vendor" size="lg">
      <form onSubmit={handleSubmit}>
        <div className="space-y-5 px-8 py-7">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <InputField
              id="vendor-name"
              label="Company Name"
              required
              placeholder="e.g. QuickFix Plumbing"
              value={values.name}
              onChange={(event) => set("name", event.target.value)}
              error={error}
            />
            <SelectField
              id="vendor-category"
              label="Category"
              value={values.category}
              onChange={(value) => set("category", value)}
              options={VENDOR_CATEGORIES}
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <InputField
              id="vendor-contact"
              label="Contact Person"
              value={values.contact}
              onChange={(event) => set("contact", event.target.value)}
            />
            <InputField
              id="vendor-phone"
              label="Phone"
              type="tel"
              value={values.phone}
              onChange={(event) => set("phone", event.target.value)}
            />
            <InputField
              id="vendor-email"
              label="Email"
              type="email"
              value={values.email}
              onChange={(event) => set("email", event.target.value)}
            />
          </div>

          <InputField
            id="vendor-address"
            label="Address"
            value={values.address}
            onChange={(event) => set("address", event.target.value)}
          />

          <InputField
            id="vendor-services"
            label="Services (comma separated)"
            placeholder="e.g. Plumbing, Drain Cleaning, Pipe Repair"
            value={values.services}
            onChange={(event) => set("services", event.target.value)}
          />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <InputField
              id="vendor-start"
              label="Contract Start"
              type="date"
              value={values.contractStart}
              onChange={(event) => set("contractStart", event.target.value)}
            />
            <InputField
              id="vendor-end"
              label="Contract End"
              type="date"
              value={values.contractEnd}
              onChange={(event) => set("contractEnd", event.target.value)}
            />
            <SelectField
              id="vendor-terms"
              label="Payment Terms"
              value={values.paymentTerms}
              onChange={(value) => set("paymentTerms", value)}
              options={PAYMENT_TERMS}
            />
          </div>
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
            Add Vendor
          </button>
        </div>
      </form>
    </Modal>
  );
}
