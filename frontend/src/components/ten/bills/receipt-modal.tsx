"use client";

import { CircleCheck, Download, Printer } from "lucide-react";

import {
  downloadReceiptPdf,
  printReceipt,
} from "@/components/ten/bills/invoice-pdf";
import { Modal } from "@/components/ui/modal";
import { lkr, longDate } from "@/lib/res/format";
import { periodLabel, type TenantInvoice } from "@/lib/ten/bills-data";
import { receiptNumberFor, type TenPayment } from "@/lib/ten/payments-data";
import { tenantUnit } from "@/lib/ten/tenant";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-6 py-2">
      <dt className="text-[14px] text-muted">{label}</dt>
      <dd className="text-right text-[14px] font-semibold text-ink">{value}</dd>
    </div>
  );
}

/** Proof a bill was settled — the payment seen from the tenant's side. */
export function ReceiptModal({
  payment,
  invoice,
  onClose,
}: {
  payment: TenPayment;
  invoice: TenantInvoice | null;
  onClose: () => void;
}) {
  return (
    <Modal
      open
      onClose={onClose}
      title={receiptNumberFor(payment)}
      subtitle={`Receipt · ${longDate(payment.date)}`}
    >
      <div className="px-5 py-5 sm:px-8">
        <div className="flex flex-col items-center rounded-lg bg-green-50/70 px-4 py-5 text-center">
          <CircleCheck aria-hidden="true" className="h-8 w-8 text-green-600" />
          <p className="mt-2 text-[24px] leading-tight font-bold text-ink">
            {lkr(payment.amount)}
          </p>
          <p className="mt-1 text-[13px] font-medium text-green-800">
            Payment {payment.status.toLowerCase()}
          </p>
        </div>

        <dl className="mt-5 divide-y divide-hairline">
          <Row label="Invoice" value={payment.invoiceId} />
          {invoice && (
            <Row label="Billing Period" value={periodLabel(invoice.period)} />
          )}
          {invoice && <Row label="Type" value={invoice.type} />}
          <Row
            label="Unit"
            value={`${tenantUnit.number}, ${tenantUnit.building}`}
          />
          <Row label="Method" value={payment.method} />
          <Row label="Reference" value={payment.reference} />
          <Row label="Date" value={longDate(payment.date)} />
        </dl>
      </div>

      <div className="flex flex-col gap-3 border-t border-hairline px-5 py-5 sm:flex-row sm:px-8 sm:py-6">
        <button
          type="button"
          onClick={() => printReceipt(payment, invoice)}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-hairline px-5 py-3 text-[15px] font-semibold text-ink transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
        >
          <Printer aria-hidden="true" className="h-4 w-4" />
          Print
        </button>
        <button
          type="button"
          onClick={() => downloadReceiptPdf(payment, invoice)}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-brand px-5 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <Download aria-hidden="true" className="h-4 w-4" />
          Download
        </button>
      </div>
    </Modal>
  );
}
