"use client";

import { useState } from "react";

import { Modal } from "@/components/ui/modal";
import {
  balanceOf,
  periodLabel,
  type ResidentInvoice,
} from "@/lib/res/bills-data";
import { payResidentInvoice } from "@/lib/res/bills-store";
import { TODAY } from "@/lib/res/dashboard-data";
import { lkr, longDate } from "@/lib/res/format";
import {
  receiptNumberFor,
  PAYMENT_METHODS,
  type PaymentMethod,
} from "@/lib/res/payments-data";
import { showResToast } from "@/lib/res/toast-store";

/** A charge line, or one of the totals under the rule. */
function Line({
  label,
  value,
  indent = false,
  strong = false,
}: {
  label: string;
  value: string;
  /** Charge lines and the due date sit in from the totals. */
  indent?: boolean;
  strong?: boolean;
}) {
  return (
    <div
      className={`flex items-baseline justify-between gap-6 py-2.5 ${indent ? "pl-4" : ""}`}
    >
      <dt className={`text-[15px] ${strong ? "font-bold text-ink" : "text-ink"}`}>
        {label}
      </dt>
      <dd
        className={`text-right text-[15px] tabular-nums ${strong ? "font-bold text-ink" : "font-semibold text-ink"}`}
      >
        {value}
      </dd>
    </div>
  );
}

/**
 * The bill itself: what was charged, what it comes to, and when it is due.
 *
 * Paid and outstanding appear only once something has been paid against it, and
 * the adjustment line only when there is one — so a plain unpaid bill reads as
 * the five charges, a total and a date, with nothing to wade through.
 *
 * Pay Now is a demonstration: no gateway, no card details, nothing leaves the
 * browser.
 */
export function InvoiceModal({
  invoice,
  onClose,
}: {
  invoice: ResidentInvoice;
  onClose: () => void;
}) {
  const [method, setMethod] = useState<PaymentMethod>("Card");
  const [choosing, setChoosing] = useState(false);

  const balance = balanceOf(invoice);

  function handlePay() {
    const payment = payResidentInvoice(invoice.id, method, TODAY);
    if (!payment) return;

    showResToast(`${lkr(payment.amount)} paid · ${receiptNumberFor(payment)}`);
    onClose();
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={invoice.id}
      subtitle={periodLabel(invoice.period)}
    >
      <div className="px-5 py-5 sm:px-8 sm:py-6">
        <h3 className="text-[12px] font-semibold tracking-wider text-muted uppercase">
          Charges Breakdown
        </h3>

        <dl className="mt-2">
          {invoice.lines.map((line) => (
            <Line
              key={line.label}
              label={line.label}
              value={lkr(line.amount)}
              indent
            />
          ))}
        </dl>

        <dl className="mt-3 border-t border-hairline pt-1">
          <Line label="Subtotal" value={lkr(invoice.subtotal)} />
          {invoice.adjustment !== 0 && (
            <Line label="Adjustments" value={lkr(invoice.adjustment)} />
          )}
          <Line label="Total" value={lkr(invoice.total)} strong />
          {invoice.paid > 0 && (
            <>
              <Line label="Paid" value={lkr(invoice.paid)} />
              <Line label="Outstanding" value={lkr(balance)} strong />
            </>
          )}
          <Line label="Due Date" value={longDate(invoice.dueDate)} indent />
        </dl>

        {choosing && (
          <div className="mt-4 rounded-lg border border-hairline px-4 py-4">
            <p className="text-[13px] font-semibold text-ink">How would you like to pay?</p>
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
          </div>
        )}

        {balance > 0 && (
          <button
            type="button"
            onClick={() => (choosing ? handlePay() : setChoosing(true))}
            className="mt-5 w-full rounded-lg bg-brand px-5 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            {choosing ? "Confirm" : "Pay Now"} — {lkr(balance)}
          </button>
        )}
      </div>
    </Modal>
  );
}
