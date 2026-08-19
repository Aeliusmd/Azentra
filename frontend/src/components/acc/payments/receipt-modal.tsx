"use client";

import { Download } from "lucide-react";

import { Modal } from "@/components/ui/modal";
import { lkr } from "@/lib/acc/money";
import type { AccPayment } from "@/lib/acc/payments-data";
import { periodLabel } from "@/lib/acc/periods";
import { accPropertyName } from "@/lib/acc/properties";
import { showAccToast } from "@/lib/acc/toast-store";
import { downloadPdf } from "@/lib/fs/report-pdf";

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-6">
      <dt className="text-[15px] text-gray-600">{label}</dt>
      <dd className="text-right text-[15px] font-semibold text-ink">
        {value}
      </dd>
    </div>
  );
}

/** A one-page PDF of the receipt, so the button hands over a real document. */
function receiptPdf(receipt: string, payment: AccPayment) {
  downloadPdf(`${receipt.toLowerCase()}.pdf`, [
    { text: "Azentra", size: 11 },
    { text: `Receipt ${receipt}`, size: 20, bold: true, gap: 18 },
    {
      text: `${accPropertyName(payment.propertyId)} · ${periodLabel(payment.period)}`,
      size: 11,
      gap: 6,
    },
    { text: "Received From", size: 10, gap: 26 },
    {
      text: `${payment.resident} · ${payment.unit}`,
      size: 13,
      bold: true,
      gap: 4,
    },
    { text: "Bill Reference", size: 10, gap: 16 },
    { text: payment.bill, size: 13, bold: true, gap: 4 },
    { text: "Payment Method", size: 10, gap: 16 },
    { text: payment.method, size: 13, bold: true, gap: 4 },
    { text: "Transaction Reference", size: 10, gap: 16 },
    {
      text: payment.reference || "Not referenced",
      size: 13,
      bold: true,
      gap: 4,
    },
    { text: "Payment Date", size: 10, gap: 16 },
    { text: payment.date, size: 13, bold: true, gap: 4 },
    {
      text: `Amount Received${" ".repeat(18)}${lkr(payment.amount)}`,
      size: 14,
      bold: true,
      gap: 28,
    },
  ]);

  showAccToast(`${receipt} downloaded`);
}

/**
 * The resident-facing side of a payment: proof that a given sum arrived
 * against a given bill on a given day.
 */
export function ReceiptModal({
  receipt,
  payment,
  onClose,
}: {
  receipt: string;
  payment: AccPayment;
  onClose: () => void;
}) {
  return (
    <Modal open onClose={onClose} title={`Receipt: ${receipt}`}>
      <div className="px-5 py-5 sm:px-8 sm:py-6">
        <dl className="space-y-4">
          <Line label="Resident" value={payment.resident} />
          <Line label="Unit" value={payment.unit} />
          <Line label="Bill Reference" value={payment.bill} />
          <Line label="Amount" value={lkr(payment.amount)} />
          <Line label="Payment Method" value={payment.method} />
          <Line label="Transaction Ref" value={payment.reference || "—"} />
          <Line label="Payment Date" value={payment.date} />
        </dl>

        <button
          type="button"
          onClick={() => receiptPdf(receipt, payment)}
          className="mt-7 flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-5 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <Download aria-hidden="true" className="h-[18px] w-[18px]" />
          Download Receipt PDF
        </button>
      </div>
    </Modal>
  );
}
