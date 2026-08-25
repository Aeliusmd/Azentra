"use client";

import { useState } from "react";

import { Modal } from "@/components/ui/modal";
import {
  balanceOf,
  periodLabel,
  type ResidentInvoice,
} from "@/lib/res/bills-data";
import { PayInvoiceModal } from "@/components/res/bills/pay-modal";
import { lkr, longDate } from "@/lib/res/format";

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
  const [paying, setPaying] = useState(false);

  const balance = balanceOf(invoice);

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

        {balance > 0 && (
          <button
            type="button"
            onClick={() => setPaying(true)}
            className="mt-5 w-full rounded-lg bg-brand px-5 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            Pay Now — {lkr(balance)}
          </button>
        )}
      </div>

      {paying && (
        <PayInvoiceModal
          invoice={invoice}
          onClose={() => setPaying(false)}
          onPaid={() => {
            setPaying(false);
            onClose();
          }}
        />
      )}
    </Modal>
  );
}
