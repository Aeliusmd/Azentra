"use client";

import { useState } from "react";
import {
  CreditCard,
  Landmark,
  Smartphone,
  type LucideIcon,
} from "lucide-react";

import { Modal } from "@/components/ui/modal";
import { balanceOf, type ResidentInvoice } from "@/lib/res/bills-data";
import { payResidentInvoice } from "@/lib/res/bills-store";
import { TODAY } from "@/lib/res/dashboard-data";
import { lkr } from "@/lib/res/format";
import {
  receiptNumberFor,
  PAYMENT_METHODS,
  type PaymentMethod,
} from "@/lib/res/payments-data";
import { showResToast } from "@/lib/res/toast-store";

const METHOD_ICON: Record<PaymentMethod, LucideIcon> = {
  "Credit / Debit Card": CreditCard,
  "Bank Transfer": Landmark,
  "Mobile Payment": Smartphone,
};

/**
 * Settling a bill.
 *
 * A demonstration: no gateway is contacted, no card details are asked for and
 * nothing leaves the browser. The amount is the outstanding balance rather than
 * a figure the resident types — part payment is something the property arranges,
 * not something to be improvised at the till.
 */
export function PayInvoiceModal({
  invoice,
  onClose,
  onPaid,
}: {
  invoice: ResidentInvoice;
  onClose: () => void;
  /** Closes the invoice behind this one once the bill is settled. */
  onPaid: () => void;
}) {
  const [method, setMethod] = useState<PaymentMethod>(PAYMENT_METHODS[0]);

  const balance = balanceOf(invoice);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const payment = payResidentInvoice(invoice.id, method, TODAY);
    if (!payment) return;

    showResToast(`${lkr(payment.amount)} paid · ${receiptNumberFor(payment)}`);
    onPaid();
  }

  return (
    <Modal open onClose={onClose} title="Make Payment">
      <form onSubmit={handleSubmit}>
        <div className="px-5 py-6 sm:px-8">
          <div className="text-center">
            <p className="text-[15px] text-muted">Amount Due</p>
            <p className="mt-1 text-[32px] leading-tight font-bold text-ink sm:text-[34px]">
              {lkr(balance)}
            </p>
            <p className="mt-1 text-[15px] text-muted">{invoice.id}</p>
          </div>

          <fieldset className="mt-7">
            <legend className="mb-3 text-[15px] font-semibold text-ink">
              Payment Method
            </legend>

            <div className="space-y-3">
              {PAYMENT_METHODS.map((option) => {
                const Icon = METHOD_ICON[option];

                return (
                  <label
                    key={option}
                    className="flex cursor-pointer items-center gap-4 rounded-lg border border-hairline px-4 py-4 transition-colors hover:bg-gray-50/70 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand/30"
                  >
                    <input
                      type="radio"
                      name="pay-method"
                      value={option}
                      checked={method === option}
                      onChange={() => setMethod(option)}
                      className="h-[18px] w-[18px] accent-[#2e6cad]"
                    />
                    <Icon
                      aria-hidden="true"
                      className="h-5 w-5 shrink-0 text-gray-500"
                    />
                    <span className="text-[15px] text-ink">{option}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <button
            type="submit"
            className="mt-6 w-full rounded-lg bg-brand px-5 py-3.5 text-[16px] font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            Confirm Payment — {lkr(balance)}
          </button>
        </div>
      </form>
    </Modal>
  );
}
