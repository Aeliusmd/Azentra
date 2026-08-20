"use client";

import { useMemo, useState } from "react";

import { StatusPill } from "@/components/acc/ui/status-pill";
import { VendorDetailModal } from "@/components/acc/vendors/vendor-detail-modal";
import { Card } from "@/components/ui/card";
import { lkrK } from "@/lib/acc/money";
import { vendorAccounts } from "@/lib/acc/vendors-data";

function Line({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: string;
}) {
  return (
    <li className="flex items-baseline justify-between gap-4">
      <span className="text-[14px] text-gray-600">{label}</span>
      <span className={`text-[14px] font-bold ${tone}`}>{value}</span>
    </li>
  );
}

/** Every supplier account, with what is invoiced, paid and still owed. */
export function AccVendorAccountsView() {
  const vendors = useMemo(() => vendorAccounts(), []);
  const [openId, setOpenId] = useState<string | null>(null);

  const openVendor = vendors.find((vendor) => vendor.id === openId) ?? null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[28px] leading-tight font-bold text-ink">
          Vendor Accounts
        </h1>
        <p className="mt-1 text-[14px] text-muted">
          Manage vendor accounts and financial records
        </p>
      </div>

      <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {vendors.map((vendor) => (
          <li key={vendor.id}>
            <button
              type="button"
              onClick={() => setOpenId(vendor.id)}
              aria-haspopup="dialog"
              className="block h-full w-full text-left focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
            >
              <Card className="h-full p-5 transition-colors hover:bg-gray-50/70">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="text-[15px] font-bold text-ink">
                      {vendor.name}
                    </h2>
                    <p className="mt-0.5 text-[13px] text-muted">
                      {vendor.category}
                    </p>
                  </div>
                  <StatusPill
                    tone={vendor.status === "Active" ? "green" : "steel"}
                  >
                    {vendor.status}
                  </StatusPill>
                </div>

                <ul className="mt-4 space-y-1.5">
                  <Line
                    label="Invoiced"
                    value={lkrK(vendor.invoiced)}
                    tone="text-ink"
                  />
                  <Line
                    label="Paid"
                    value={lkrK(vendor.paid)}
                    tone="text-[#2f9e63]"
                  />
                  <Line
                    label="Outstanding"
                    value={lkrK(vendor.outstanding)}
                    tone="text-[#e0554d]"
                  />
                </ul>
              </Card>
            </button>
          </li>
        ))}
      </ul>

      {openVendor && (
        <VendorDetailModal
          vendor={openVendor}
          onClose={() => setOpenId(null)}
        />
      )}
    </div>
  );
}
