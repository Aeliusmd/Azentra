"use client";

import { Download, Printer } from "lucide-react";

import { Modal } from "@/components/ui/modal";
import { lkr } from "@/lib/acc/money";
import { showAccToast } from "@/lib/acc/toast-store";

/**
 * One invoice as a document — who it concerns, what is on it, what is left.
 *
 * Shared by the resident and vendor lists: only the identity fields differ
 * between the two, so each view supplies its own `details` and the money half
 * is laid out the same either way.
 */
export function InvoiceDocumentModal({
  id,
  subtitle,
  details,
  items,
  total,
  paid,
  onClose,
}: {
  id: string;
  subtitle: string;
  /** Identity fields — resident and unit, or vendor and category. */
  details: { label: string; value: React.ReactNode }[];
  items: { label: string; amount: number }[];
  total: number;
  /** Collected so far; the balance is the remainder. */
  paid: number;
  onClose: () => void;
}) {
  const balance = total - paid;

  return (
    <Modal open onClose={onClose} size="lg" title={id} subtitle={subtitle}>
      <div className="max-h-[70vh] overflow-y-auto px-5 py-5 sm:px-8 sm:py-6">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3">
          {details.map((detail) => (
            <div key={detail.label}>
              <dt className="text-[13px] text-muted">{detail.label}</dt>
              <dd className="mt-1 text-[15px] font-semibold text-ink">
                {detail.value}
              </dd>
            </div>
          ))}
        </dl>

        <h3 className="mt-7 text-[15px] font-bold text-ink">Invoice Items</h3>

        <ul className="mt-3 divide-y divide-hairline border-y border-hairline">
          {items.map((item) => (
            <li
              key={item.label}
              className="flex items-center justify-between gap-4 py-3"
            >
              <span className="text-[14px] text-gray-600">{item.label}</span>
              <span className="text-[14px] font-medium text-ink">
                {lkr(item.amount)}
              </span>
            </li>
          ))}
        </ul>

        <ul className="mt-4 space-y-2.5">
          <li className="flex items-center justify-between gap-4">
            <span className="text-[14px] text-gray-600">Total</span>
            <span className="text-[17px] font-bold text-ink">{lkr(total)}</span>
          </li>
          <li className="flex items-center justify-between gap-4">
            <span className="text-[14px] text-gray-600">Paid</span>
            <span className="text-[15px] font-bold text-[#2f9e63]">
              {lkr(paid)}
            </span>
          </li>
          <li className="flex items-center justify-between gap-4 border-t border-hairline pt-2.5">
            <span className="text-[14px] text-gray-600">
              Outstanding Balance
            </span>
            <span
              className={`text-[17px] font-bold ${
                balance > 0 ? "text-[#e8a33d]" : "text-[#2f9e63]"
              }`}
            >
              {lkr(balance)}
            </span>
          </li>
        </ul>
      </div>

      <div className="flex flex-wrap justify-end gap-3 border-t border-hairline px-5 py-4 sm:px-8 sm:py-5">
        <button
          type="button"
          onClick={() => window.print()}
          className="flex items-center gap-2 rounded-lg border border-hairline px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
        >
          <Printer aria-hidden="true" className="h-4 w-4" />
          Print
        </button>
        <button
          type="button"
          onClick={() => showAccToast(`${id} downloaded`)}
          className="flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <Download aria-hidden="true" className="h-4 w-4" />
          Download
        </button>
      </div>
    </Modal>
  );
}
