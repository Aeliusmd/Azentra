"use client";

import { StatusPill } from "@/components/acc/ui/status-pill";
import { Modal } from "@/components/ui/modal";
import { lkr } from "@/lib/acc/money";
import type { VendorAccount } from "@/lib/acc/vendors-data";

function Detail({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-[15px] text-muted">{label}</dt>
      <dd className="mt-1 text-[17px] font-semibold break-words text-ink">
        {value}
      </dd>
    </div>
  );
}

function Money({
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
      <span className="text-[15px] text-gray-600">{label}</span>
      <span className={`text-[17px] font-bold ${tone}`}>{value}</span>
    </li>
  );
}

/** Who to call at a supplier, and where the account stands with them. */
export function VendorDetailModal({
  vendor,
  onClose,
}: {
  vendor: VendorAccount;
  onClose: () => void;
}) {
  return (
    <Modal open onClose={onClose} title={vendor.name}>
      <div className="px-5 py-5 sm:px-8 sm:py-6">
        <dl className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          <Detail label="Category" value={vendor.category} />
          <Detail label="Contact" value={vendor.contact} />
          <Detail label="Phone" value={vendor.phone} />
          <Detail label="Email" value={vendor.email} />
          <Detail
            label="Status"
            value={
              <StatusPill tone={vendor.status === "Active" ? "green" : "steel"}>
                {vendor.status}
              </StatusPill>
            }
          />
        </dl>

        <ul className="mt-6 space-y-3 border-t border-hairline pt-5">
          <Money
            label="Total Invoiced"
            value={lkr(vendor.invoiced)}
            tone="text-ink"
          />
          <Money
            label="Total Paid"
            value={lkr(vendor.paid)}
            tone="text-[#2f9e63]"
          />
          <Money
            label="Outstanding"
            value={lkr(vendor.outstanding)}
            tone="text-[#e0554d]"
          />
        </ul>
      </div>
    </Modal>
  );
}
