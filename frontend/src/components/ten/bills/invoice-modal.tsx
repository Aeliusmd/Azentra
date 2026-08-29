"use client";

import {
  downloadInvoicePdf,
  printInvoice,
} from "@/components/ten/bills/invoice-pdf";
import { Modal } from "@/components/ui/modal";
import { lkr, longDate } from "@/lib/res/format";
import {
  balanceOf,
  periodLabel,
  statusOf,
  type InvoiceStatus,
  type TenantInvoice,
} from "@/lib/ten/bills-data";
import { useTenPayments } from "@/lib/ten/bills-store";
import { TODAY } from "@/lib/ten/dashboard-data";
import {
  paymentsForInvoice,
  receiptNumberFor,
  type TenPayment,
} from "@/lib/ten/payments-data";

/** Only genuine bad news is red; a bill not yet due is not a failing. */
const STATUS_TEXT: Record<InvoiceStatus, string> = {
  Unpaid: "text-amber-600",
  "Partially Paid": "text-[#2e6cad]",
  Paid: "text-green-600",
  Overdue: "text-rose-600",
};

function Row({
  label,
  value,
  bold = false,
  muted = false,
  valueClass = "",
}: {
  label: string;
  value: string;
  bold?: boolean;
  muted?: boolean;
  valueClass?: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-6 py-2">
      <dt className={`text-[15px] ${muted ? "text-muted" : "text-ink"}`}>
        {label}
      </dt>
      <dd
        className={`text-right text-[15px] ${
          bold ? "font-bold" : "font-semibold"
        } ${valueClass || "text-ink"}`}
      >
        {value}
      </dd>
    </div>
  );
}

/**
 * One invoice in full: what it is made of, what is left on it, and what has
 * already been paid against it.
 *
 * Every figure is read off the invoice rather than stored alongside it — the
 * balance is total minus paid, the status follows from that and the date — so
 * this dialog cannot contradict the row that opened it.
 */
export function InvoiceModal({
  invoice,
  onClose,
  onPay,
  onViewReceipt,
}: {
  invoice: TenantInvoice;
  onClose: () => void;
  onPay: () => void;
  onViewReceipt: (payment: TenPayment) => void;
}) {
  const payments = useTenPayments();

  const status = statusOf(invoice, TODAY);
  const balance = balanceOf(invoice);
  const settled = paymentsForInvoice(invoice.id, payments);

  return (
    <Modal
      open
      onClose={onClose}
      title={invoice.id}
      subtitle={periodLabel(invoice.period)}
    >
      <div className="max-h-[62vh] overflow-y-auto px-5 py-5 sm:px-8">
        <h3 className="text-[15px] font-bold text-ink">Charges Breakdown</h3>

        <dl className="mt-2">
          {invoice.lines.map((line) => (
            <Row key={line.label} label={line.label} value={lkr(line.amount)} />
          ))}
        </dl>

        <dl className="mt-3 border-t border-hairline pt-3">
          <Row label="Subtotal" value={lkr(invoice.subtotal)} muted />
          {invoice.adjustment !== 0 && (
            <Row label="Adjustments" value={lkr(invoice.adjustment)} muted />
          )}
          <Row label="Total" value={lkr(invoice.total)} bold />

          {/* Only worth saying once part of it has actually been settled. */}
          {invoice.paid > 0 && (
            <>
              <Row label="Paid" value={lkr(invoice.paid)} muted />
              <Row label="Balance" value={lkr(balance)} bold />
            </>
          )}
        </dl>

        <dl className="mt-3">
          <Row label="Due Date" value={longDate(invoice.dueDate)} muted />
          <Row
            label="Status"
            value={status}
            muted
            valueClass={STATUS_TEXT[status]}
          />
        </dl>

        {settled.length > 0 && (
          <section className="mt-6">
            <h3 className="text-[15px] font-bold text-ink">
              Payments Received
            </h3>
            <ul className="mt-2 divide-y divide-hairline">
              {settled.map((payment) => (
                <li
                  key={payment.id}
                  className="flex flex-wrap items-center gap-x-3 gap-y-1 py-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-semibold text-ink">
                      {lkr(payment.amount)} · {payment.method}
                    </p>
                    <p className="mt-0.5 text-[13px] text-muted">
                      {longDate(payment.date)} · {receiptNumberFor(payment)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onViewReceipt(payment)}
                    className="rounded-md border border-hairline px-3 py-1.5 text-[13px] font-medium text-link transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
                  >
                    Receipt
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <div className="px-5 pb-5 sm:px-8 sm:pb-6">
        {/* Offered only while something is actually owed. */}
        {balance > 0 && (
          <button
            type="button"
            onClick={onPay}
            className="w-full rounded-lg bg-brand px-5 py-3.5 text-[16px] font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            Pay Now
          </button>
        )}

        <div
          className={`flex items-center justify-center gap-5 ${balance > 0 ? "mt-3" : ""}`}
        >
          <button
            type="button"
            onClick={() => printInvoice(invoice, payments, TODAY)}
            className="text-[13px] font-medium text-link transition-colors hover:text-link-dark focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
          >
            Print
          </button>
          <button
            type="button"
            onClick={() => downloadInvoicePdf(invoice, payments, TODAY)}
            className="text-[13px] font-medium text-link transition-colors hover:text-link-dark focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
          >
            Download
          </button>
        </div>
      </div>
    </Modal>
  );
}
