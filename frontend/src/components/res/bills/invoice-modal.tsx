"use client";

import { useState } from "react";
import { Download, Printer } from "lucide-react";

import { downloadInvoicePdf } from "@/components/res/bills/invoice-pdf";
import { InvoiceStatusPill } from "@/components/res/ui/status-pill";
import { Modal } from "@/components/ui/modal";
import {
  balanceOf,
  periodLabel,
  statusOf,
  type ResidentInvoice,
} from "@/lib/res/bills-data";
import { payResidentInvoice } from "@/lib/res/bills-store";
import { TODAY } from "@/lib/res/dashboard-data";
import { lkr, longDate } from "@/lib/res/format";
import {
  paymentsForInvoice,
  receiptNumberFor,
  PAYMENT_METHODS,
  type PaymentMethod,
  type ResidentPayment,
} from "@/lib/res/payments-data";
import { showResToast } from "@/lib/res/toast-store";

/** One `label — value` row in the summary block. */
function SummaryRow({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-1.5">
      <dt className={`text-[14px] ${strong ? "font-semibold text-ink" : "text-muted"}`}>
        {label}
      </dt>
      <dd
        className={`text-[14px] tabular-nums ${strong ? "font-bold text-ink" : "text-ink"}`}
      >
        {value}
      </dd>
    </div>
  );
}

/**
 * The full invoice: what was charged, what has been paid and what is left.
 *
 * Pay Now settles the balance through the mock store — no gateway, no card
 * details asked for and nothing leaves the browser.
 */
export function InvoiceModal({
  invoice,
  payments,
  onClose,
}: {
  invoice: ResidentInvoice;
  payments: ResidentPayment[];
  onClose: () => void;
}) {
  const [method, setMethod] = useState<PaymentMethod>("Card");
  const [paying, setPaying] = useState(false);

  const balance = balanceOf(invoice);
  const status = statusOf(invoice, TODAY);
  const settled = paymentsForInvoice(invoice.id, payments);

  function handlePay() {
    const payment = payResidentInvoice(invoice.id, method, TODAY);
    if (!payment) return;

    setPaying(false);
    showResToast(`${lkr(payment.amount)} paid · ${receiptNumberFor(payment)}`);
    onClose();
  }

  return (
    <Modal
      open
      onClose={onClose}
      size="lg"
      title={invoice.id}
      subtitle={`${periodLabel(invoice.period)} · ${invoice.type}`}
    >
      <div className="space-y-5 px-5 py-5 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <InvoiceStatusPill status={status} />
          <p className="text-[13px] text-muted">
            Issued {longDate(invoice.issued)} · Due {longDate(invoice.dueDate)}
          </p>
        </div>

        <section>
          <h3 className="text-[13px] font-semibold text-ink">Charges</h3>
          <dl className="mt-2 divide-y divide-hairline">
            {invoice.lines.map((line) => (
              <div
                key={line.label}
                className="flex items-baseline justify-between gap-4 py-2.5"
              >
                <dt className="min-w-0">
                  <span className="block text-[14px] text-ink">
                    {line.label}
                  </span>
                  {line.basis && (
                    <span className="mt-0.5 block text-[12px] text-muted">
                      {line.basis}
                    </span>
                  )}
                </dt>
                <dd className="text-[14px] tabular-nums text-ink">
                  {lkr(line.amount)}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="rounded-lg bg-gray-50 px-4 py-3">
          <dl>
            <SummaryRow label="Subtotal" value={lkr(invoice.subtotal)} />
            {invoice.adjustment !== 0 && (
              <SummaryRow
                label="Adjustments"
                value={lkr(invoice.adjustment)}
              />
            )}
            <SummaryRow label="Total" value={lkr(invoice.total)} strong />
            <SummaryRow label="Paid" value={lkr(invoice.paid)} />
            <SummaryRow
              label="Outstanding balance"
              value={lkr(balance)}
              strong
            />
          </dl>
        </section>

        {settled.length > 0 && (
          <section>
            <h3 className="text-[13px] font-semibold text-ink">
              Payment history
            </h3>
            <ul className="mt-2 divide-y divide-hairline">
              {settled.map((payment) => (
                <li
                  key={payment.id}
                  className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-2.5"
                >
                  <span className="text-[14px] text-ink">
                    {longDate(payment.date)} · {payment.method}
                  </span>
                  <span className="text-[13px] text-muted">
                    {receiptNumberFor(payment)}
                  </span>
                  <span className="text-[14px] tabular-nums font-medium text-ink">
                    {lkr(payment.amount)}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {paying && (
          <section className="rounded-lg border border-hairline px-4 py-4">
            <h3 className="text-[13px] font-semibold text-ink">
              Pay {lkr(balance)}
            </h3>
            <p className="mt-1 text-[13px] text-muted">
              A demonstration only — no card details are taken and no money
              moves.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {PAYMENT_METHODS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setMethod(option)}
                  aria-pressed={option === method}
                  className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none ${
                    option === method
                      ? "bg-[#1b3a5c] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200/70"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-end gap-3 border-t border-hairline px-5 py-4 sm:px-8">
        <button
          type="button"
          onClick={() => window.print()}
          className="flex items-center gap-2 rounded-lg border border-hairline px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
        >
          <Printer aria-hidden="true" className="h-4 w-4" />
          Print
        </button>
        <button
          type="button"
          onClick={() => downloadInvoicePdf(invoice, payments)}
          className="flex items-center gap-2 rounded-lg border border-hairline px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
        >
          <Download aria-hidden="true" className="h-4 w-4" />
          Download
        </button>

        {balance > 0 &&
          (paying ? (
            <button
              type="button"
              onClick={handlePay}
              className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              Confirm {lkr(balance)}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setPaying(true)}
              className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              Pay Now
            </button>
          ))}
      </div>
    </Modal>
  );
}
