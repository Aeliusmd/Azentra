"use client";

import { useMemo, useState } from "react";
import { Star } from "lucide-react";

import { FilterChips } from "@/components/pm/ui/filter-chips";
import { Pill } from "@/components/pm/ui/pill";
import {
  PmPageHeader,
  PmPrimaryButton,
} from "@/components/pm/ui/pm-page-header";
import { VendorDetailsModal } from "@/components/pm/vendors/vendor-details-modal";
import {
  VendorFormModal,
  type VendorFormValues,
} from "@/components/pm/vendors/vendor-form-modal";
import {
  VENDOR_STATUSES,
  money,
  vendors as seed,
  type Vendor,
} from "@/lib/pm/vendors-data";

const FILTERS = ["All", ...VENDOR_STATUSES] as const;

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <span className="block text-[15px]">
      <span className="text-muted">{label}:</span>{" "}
      <span className="text-ink">{value}</span>
    </span>
  );
}

export function VendorsView() {
  const [list, setList] = useState<Vendor[]>(seed);
  const [filter, setFilter] = useState<string>("All");
  const [formOpen, setFormOpen] = useState(false);
  const [viewing, setViewing] = useState<Vendor | null>(null);

  const visible = useMemo(
    () =>
      filter === "All" ? list : list.filter((item) => item.status === filter),
    [list, filter],
  );

  function handleCreate(values: VendorFormValues) {
    setList((current) => [
      ...current,
      {
        id: `v${current.length + 1}`,
        name: values.name.trim(),
        category: values.category,
        contact: values.contact.trim() || "—",
        phone: values.phone.trim() || "—",
        email: values.email.trim() || "—",
        address: values.address.trim() || "—",
        services: values.services
          .split(",")
          .map((service) => service.trim())
          .filter(Boolean),
        contractStart: values.contractStart || "—",
        contractEnd: values.contractEnd || "—",
        paymentTerms: values.paymentTerms,
        totalSpent: 0,
        rating: 0,
        status: "Active",
      },
    ]);
    setFormOpen(false);
  }

  return (
    <div className="space-y-6">
      <PmPageHeader
        title="Vendors"
        subtitle="Manage external service providers and contracts"
        action={
          <PmPrimaryButton label="Add Vendor" onClick={() => setFormOpen(true)} />
        }
      />

      <FilterChips
        label="Filter vendors by contract status"
        options={FILTERS}
        value={filter}
        onChange={setFilter}
      />

      {visible.length === 0 ? (
        <p className="rounded-lg border border-hairline bg-white px-6 py-12 text-center text-[15px] text-muted">
          No vendors with this contract status.
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {visible.map((vendor) => (
            <li key={vendor.id}>
              <button
                type="button"
                onClick={() => setViewing(vendor)}
                className="w-full rounded-xl border border-hairline bg-white px-6 py-5 text-left transition-colors hover:bg-gray-50/70 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
              >
                <span className="flex flex-wrap items-start justify-between gap-3">
                  <span>
                    <span className="block text-[17px] font-semibold text-ink">
                      {vendor.name}
                    </span>
                    <span className="mt-0.5 block text-[15px] text-muted">
                      {vendor.category}
                    </span>
                  </span>

                  <span className="flex items-center gap-3">
                    {vendor.rating > 0 && (
                      <span className="flex items-center gap-1 text-[15px] font-medium text-amber-500">
                        <Star
                          aria-hidden="true"
                          className="h-4 w-4 fill-amber-400 text-amber-400"
                        />
                        {vendor.rating.toFixed(1)}
                      </span>
                    )}
                    <Pill tone={vendor.status === "Active" ? "green" : "red"}>
                      {vendor.status}
                    </Pill>
                  </span>
                </span>

                <span className="mt-5 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
                  <Detail label="Contact" value={vendor.contact} />
                  <Detail label="Phone" value={vendor.phone} />
                  <Detail
                    label="Contract"
                    value={`${vendor.contractStart} to ${vendor.contractEnd}`}
                  />
                  <Detail
                    label="Total Spent"
                    value={money.format(vendor.totalSpent)}
                  />
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <VendorDetailsModal vendor={viewing} onClose={() => setViewing(null)} />

      <VendorFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleCreate}
      />
    </div>
  );
}
