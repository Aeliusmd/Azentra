"use client";

import { useState } from "react";
import {
  CreditCard,
  Landmark,
  Smartphone,
  type LucideIcon,
} from "lucide-react";

import { showTenToast } from "@/components/ten/ui/toaster";
import { Modal } from "@/components/ui/modal";
import { lkr } from "@/lib/res/format";
import { balanceOf, type TenantInvoice } from "@/lib/ten/bills-data";
import { payTenInvoice } from "@/lib/ten/bills-store";
import { TODAY } from "@/lib/ten/dashboard-data";
import {
  PAYMENT_METHODS,
  receiptNumberFor,
  type PaymentMethod,
  type TenPayment,
} from "@/lib/ten/payments-data";

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
 * a figure the tenant types — a part payment is an arrangement with the
 * property, not something to be improvised at the till.
 */
export function PayInvoiceModal({
  invoice,
  onClose,
  onPaid,
}: {
  invoice: TenantInvoice;
  onClose: () => void;
  /** Hands the receipt back so the caller can show it. */
  onPaid: (payment: TenPayment) => void;
}) {
  const [method, setMethod] = useState<PaymentMethod>(PAYMENT_METHODS[0]);

  const balance = balanceOf(invoice);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const payment = payTenInvoice(invoice.id, method, TODAY);
    if (!payment) return;

    showTenToast(`${lkr(payment.amount)} paid · ${receiptNumberFor(payment)}`);
    onPaid(payment);
  }

  return (
    <Modal open onClose={onClose} title="Make Payment">
      <form onSubmit={handleSubmit}>
        <div className="px-5 py-6 sm:px-8">
          <fieldset>
            <legend className="mb-3 text-[14px] font-medium text-ink">
              Payment Method
            </legend>

            <div className="space-y-3">
              {PAYMENT_METHODS.map((option) => {
                const Icon = METHOD_ICON[option];
                const selected = method === option;

                return (
                  <label
                    key={option}
                    className={`flex cursor-pointer items-center gap-4 rounded-lg border px-4 py-4 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand/30 ${
                      selected
                        ? "border-brand bg-brand/5"
                        : "border-hairline hover:bg-gray-50/70"
                    }`}
                  >
                    <input
                      type="radio"
                      name="pay-method"
                      value={option}
                      checked={selected}
                      onChange={() => setMethod(option)}
                      className="h-4 w-4 shrink-0 accent-brand"
                    />
                    <span
                      aria-hidden="true"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500"
                    >
                      <Icon className="h-[18px] w-[18px]" />
                    </span>
                    <span className="text-[15px] font-medium text-ink">
                      {option}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div className="mt-6">
            <p className="text-[14px] text-muted">Amount</p>
            <p className="mt-1 text-[28px] leading-tight font-bold text-ink">
              {lkr(balance)}
            </p>
            <p className="mt-1 text-[13px] text-muted">
              Full balance on {invoice.id}
            </p>
          </div>

          <p className="mt-5 rounded-lg bg-gray-50 px-4 py-3 text-[13px] text-muted">
            This is a demonstration. No payment is taken and no card details are
            collected.
          </p>
        </div>

        <div className="flex flex-col-reverse gap-3 px-5 pb-5 sm:flex-row sm:px-8 sm:pb-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-hairline px-5 py-3 text-[15px] font-semibold text-ink transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 rounded-lg bg-brand px-5 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            Pay Now
          </button>
        </div>
      </form>
    </Modal>
  );
}
