"use client";

import { Download, Printer } from "lucide-react";

import { BillStatusPill } from "@/components/acc/ui/status-pill";
import { Modal } from "@/components/ui/modal";
import { lkr } from "@/lib/acc/money";
import { periodLabel } from "@/lib/acc/periods";
import { accPropertyName } from "@/lib/acc/properties";
import { paidAgainstBill } from "@/lib/acc/payments-data";
import { useAccPayments } from "@/lib/acc/payments-store";
import { showAccToast } from "@/lib/acc/toast-store";
import { billLines, type UnitBill } from "@/lib/acc/unit-bills-data";

function Detail({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-[13px] text-muted">{label}</dt>
      <dd className="mt-1 text-[15px] font-semibold text-ink">{value}</dd>
    </div>
  );
}

/** Everything on one unit bill: who it is for, what it is made of, what is left. */
export function BillDetailModal({
  bill,
  onClose,
}: {
  bill: UnitBill;
  onClose: () => void;
}) {
  const lines = billLines(bill.total);
  // Reconciled against the payment ledger rather than inferred from the status.
  const paid = paidAgainstBill(bill, useAccPayments());
  const balance = bill.total - paid;

  return (
    <Modal
      open
      onClose={onClose}
      size="lg"
      title={bill.id}
      subtitle={`${bill.unit} · ${periodLabel(bill.period)}`}
    >
      <div className="max-h-[70vh] overflow-y-auto px-5 py-5 sm:px-8 sm:py-6">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3">
          <Detail label="Resident" value={bill.resident} />
          <Detail label="Unit" value={bill.unit} />
          <Detail
            label="Property"
            value={accPropertyName(bill.propertyId)}
          />
          <Detail label="Billing Period" value={periodLabel(bill.period)} />
          <Detail label="Due Date" value={bill.dueDate} />
          <Detail
            label="Status"
            value={<BillStatusPill status={bill.status} />}
          />
        </dl>

        <h3 className="mt-7 text-[15px] font-bold text-ink">Charges</h3>

        <ul className="mt-3 divide-y divide-hairline border-y border-hairline">
          {lines.map((line) => (
            <li
              key={line.label}
              className="flex items-center justify-between gap-4 py-3"
            >
              <span className="text-[14px] text-gray-600">{line.label}</span>
              <span className="text-[14px] font-medium text-ink">
                {lkr(line.amount)}
              </span>
            </li>
          ))}
        </ul>

        <ul className="mt-4 space-y-2.5">
          <li className="flex items-center justify-between gap-4">
            <span className="text-[14px] text-gray-600">Total</span>
            <span className="text-[17px] font-bold text-ink">
              {lkr(bill.total)}
            </span>
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
          onClick={() => showAccToast(`${bill.id} downloaded`)}
          className="flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <Download aria-hidden="true" className="h-4 w-4" />
          Download
        </button>
      </div>
    </Modal>
  );
}
