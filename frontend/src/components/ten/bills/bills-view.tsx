"use client";

import { useMemo, useState } from "react";
import { Receipt } from "lucide-react";

import { InvoiceModal } from "@/components/ten/bills/invoice-modal";
import { PayInvoiceModal } from "@/components/ten/bills/pay-modal";
import { ReceiptModal } from "@/components/ten/bills/receipt-modal";
import { TenStatusPill } from "@/components/ten/ui/status-pill";
import { TenTabBar } from "@/components/ten/ui/tab-bar";
import { Card } from "@/components/ui/card";
import { lkr, longDate } from "@/lib/res/format";
import {
  balanceOf,
  isOutstanding,
  periodLabel,
  statusOf,
  type InvoiceStatus,
  type TenantInvoice,
} from "@/lib/ten/bills-data";
import { useTenInvoices, useTenPayments } from "@/lib/ten/bills-store";
import { TODAY } from "@/lib/ten/dashboard-data";
import {
  invoiceFor,
  receiptNumberFor,
  type TenPayment,
} from "@/lib/ten/payments-data";

type Tab = "Current Bills" | "Outstanding" | "Payment History";

const TABS: Tab[] = ["Current Bills", "Outstanding", "Payment History"];

const STATUS_TONE: Record<InvoiceStatus, "amber" | "blue" | "green" | "rose"> = {
  Unpaid: "amber",
  "Partially Paid": "blue",
  Paid: "green",
  Overdue: "rose",
};

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <Card className="px-6 py-16 text-center">
      <span
        aria-hidden="true"
        className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#eef3f9] text-[#5b7f9c]"
      >
        <Receipt className="h-5 w-5" />
      </span>
      <p className="mt-4 text-[17px] font-semibold text-ink">{title}</p>
      <p className="mx-auto mt-1 max-w-[420px] text-[15px] text-muted">{body}</p>
    </Card>
  );
}

/** One bill, as the whole row — the card is the control that opens it. */
function InvoiceRow({
  invoice,
  onOpen,
}: {
  invoice: TenantInvoice;
  onOpen: () => void;
}) {
  const status = statusOf(invoice, TODAY);
  const settled = balanceOf(invoice) === 0;

  return (
    <li>
      <Card className="transition-colors hover:bg-gray-50/70">
        <button
          type="button"
          onClick={onOpen}
          className="flex w-full items-center gap-4 px-4 py-4 text-left focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none sm:px-5"
        >
          <span
            aria-hidden="true"
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${
              settled ? "bg-green-50 text-green-600" : "bg-rose-50 text-rose-500"
            }`}
          >
            <Receipt className="h-5 w-5" />
          </span>

          <span className="min-w-0 flex-1">
            <span className="block text-[15px] font-bold text-ink">
              {invoice.id}
            </span>
            <span className="mt-0.5 block truncate text-[14px] text-muted">
              {periodLabel(invoice.period)} · Due {longDate(invoice.dueDate)}
            </span>
          </span>

          <span className="hidden shrink-0 items-center gap-3 sm:flex">
            <span className="text-[15px] font-bold text-ink">
              {lkr(settled ? invoice.total : balanceOf(invoice))}
            </span>
            <TenStatusPill tone={STATUS_TONE[status]}>{status}</TenStatusPill>
          </span>
        </button>

        {/* Phones put the figure and badge on their own line. */}
        <div className="flex flex-wrap items-center gap-3 px-4 pb-4 sm:hidden">
          <span className="text-[15px] font-bold text-ink">
            {lkr(settled ? invoice.total : balanceOf(invoice))}
          </span>
          <TenStatusPill tone={STATUS_TONE[status]}>{status}</TenStatusPill>
        </div>
      </Card>
    </li>
  );
}

function PaymentRow({
  payment,
  onOpen,
}: {
  payment: TenPayment;
  onOpen: () => void;
}) {
  return (
    <li>
      <Card className="transition-colors hover:bg-gray-50/70">
        <button
          type="button"
          onClick={onOpen}
          className="flex w-full items-center gap-4 px-4 py-4 text-left focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none sm:px-5"
        >
          <span
            aria-hidden="true"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-600"
          >
            <Receipt className="h-5 w-5" />
          </span>

          <span className="min-w-0 flex-1">
            <span className="block text-[15px] font-bold text-ink">
              {receiptNumberFor(payment)}
            </span>
            <span className="mt-0.5 block truncate text-[14px] text-muted">
              {longDate(payment.date)} · {payment.method} · {payment.invoiceId}
            </span>
          </span>

          <span className="hidden shrink-0 items-center gap-3 sm:flex">
            <span className="text-[15px] font-bold text-ink">
              {lkr(payment.amount)}
            </span>
            <TenStatusPill tone="green">{payment.status}</TenStatusPill>
          </span>
        </button>

        <div className="flex flex-wrap items-center gap-3 px-4 pb-4 sm:hidden">
          <span className="text-[15px] font-bold text-ink">
            {lkr(payment.amount)}
          </span>
          <TenStatusPill tone="green">{payment.status}</TenStatusPill>
        </div>
      </Card>
    </li>
  );
}

/**
 * Every bill raised against this tenant, and what has been paid against it.
 *
 * Scoped to the tenancy: these are the charges the *tenant* carries — utilities,
 * tenant service charges, facilities they booked, repairs that fell to them. The
 * owner's obligations on A-304 are billed to the owner and never reach this
 * list, so a tenant is never shown a balance that is not theirs to settle.
 *
 * Nothing here raises, adjusts or writes off an invoice. A tenant reads what is
 * owed and settles it.
 */
export function TenBillsView() {
  const invoices = useTenInvoices();
  const payments = useTenPayments();

  const [tab, setTab] = useState<Tab>("Current Bills");
  const [openInvoiceId, setOpenInvoiceId] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);
  const [receipt, setReceipt] = useState<TenPayment | null>(null);

  // Read live so a dialog follows the invoice it was opened on once it is paid.
  const openInvoice = openInvoiceId
    ? (invoices.find((invoice) => invoice.id === openInvoiceId) ?? null)
    : null;

  /**
   * "Current Bills" is the whole ledger, settled ones included — a tenant
   * looking up last month's bill should find it, and the spec's `Paid` status
   * has to be visible somewhere. "Outstanding" is the filter that narrows it.
   */
  const visibleInvoices = useMemo(
    () =>
      tab === "Outstanding" ? invoices.filter(isOutstanding) : invoices,
    [invoices, tab],
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-[24px] leading-tight font-bold text-ink sm:text-[28px]">
          Bills &amp; Payments
        </h1>
        <p className="mt-1 text-[14px] text-muted">
          Manage your utility bills and payment history
        </p>
      </div>

      <TenTabBar
        label="Filter bills"
        value={tab}
        onChange={(id) => setTab(id as Tab)}
        tabs={TABS.map((id) => ({ id, label: id }))}
      />

      {tab === "Payment History" ? (
        payments.length === 0 ? (
          <EmptyState
            title="No payments to show"
            body="Payments you make will be listed here with their receipts."
          />
        ) : (
          <ul className="space-y-3">
            {payments.map((payment) => (
              <PaymentRow
                key={payment.id}
                payment={payment}
                onOpen={() => setReceipt(payment)}
              />
            ))}
          </ul>
        )
      ) : visibleInvoices.length === 0 ? (
        <EmptyState
          title="Nothing outstanding"
          body="You are all settled up. New bills will appear here when they are raised."
        />
      ) : (
        <ul className="space-y-3">
          {visibleInvoices.map((invoice) => (
            <InvoiceRow
              key={invoice.id}
              invoice={invoice}
              onOpen={() => setOpenInvoiceId(invoice.id)}
            />
          ))}
        </ul>
      )}

      {openInvoice && !paying && (
        <InvoiceModal
          invoice={openInvoice}
          onClose={() => setOpenInvoiceId(null)}
          onPay={() => setPaying(true)}
          onViewReceipt={setReceipt}
        />
      )}

      {openInvoice && paying && (
        <PayInvoiceModal
          invoice={openInvoice}
          onClose={() => setPaying(false)}
          onPaid={(payment) => {
            setPaying(false);
            setOpenInvoiceId(null);
            setReceipt(payment);
          }}
        />
      )}

      {receipt && (
        <ReceiptModal
          payment={receipt}
          invoice={invoiceFor(receipt, invoices)}
          onClose={() => setReceipt(null)}
        />
      )}
    </div>
  );
}
