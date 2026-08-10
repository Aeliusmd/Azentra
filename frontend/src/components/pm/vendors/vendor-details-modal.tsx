"use client";

import { Star } from "lucide-react";

import { Pill } from "@/components/pm/ui/pill";
import { Modal } from "@/components/ui/modal";
import type { Vendor } from "@/lib/pm/vendors-data";

function Field({ label, value }: { label: string; value: string }) {
  return (
    <p className="text-[17px]">
      <span className="text-muted">{label}:</span>{" "}
      <span className="font-semibold text-ink">{value}</span>
    </p>
  );
}

export function VendorDetailsModal({
  vendor,
  onClose,
}: {
  vendor: Vendor | null;
  onClose: () => void;
}) {
  if (!vendor) return null;

  return (
    <Modal open onClose={onClose} title={vendor.name} size="lg">
      <div className="px-8 py-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Pill tone={vendor.status === "Active" ? "green" : "red"}>
            {vendor.status}
          </Pill>
          {vendor.rating > 0 && (
            <span className="flex items-center gap-1.5 text-[17px] font-medium text-amber-500">
              <Star
                aria-hidden="true"
                className="h-[18px] w-[18px] fill-amber-400 text-amber-400"
              />
              {vendor.rating.toFixed(1)}
            </span>
          )}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-x-10 gap-y-4 sm:grid-cols-2">
          <Field label="Company" value={vendor.name} />
          <Field label="Category" value={vendor.category} />
          <Field label="Contact" value={vendor.contact} />
          <Field label="Phone" value={vendor.phone} />
          <Field label="Email" value={vendor.email} />
          <Field label="Address" value={vendor.address} />
        </div>

        {vendor.services.length > 0 && (
          <div className="mt-7">
            <h3 className="text-xs font-semibold tracking-wide text-gray-400 uppercase">
              Services
            </h3>
            <ul className="mt-3 flex flex-wrap gap-2.5">
              {vendor.services.map((service) => (
                <li key={service}>
                  <span className="inline-flex rounded-md bg-gray-100 px-3 py-2 text-[15px] text-gray-600">
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-3">
          <Field label="Contract" value={vendor.contractStart} />
          <Field label="Expires" value={vendor.contractEnd} />
          <Field label="Terms" value={vendor.paymentTerms} />
        </div>
      </div>
    </Modal>
  );
}
