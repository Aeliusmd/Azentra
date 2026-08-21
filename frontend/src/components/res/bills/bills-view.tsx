"use client";

import { useMemo, useState } from "react";
import { CreditCard, Receipt } from "lucide-react";

import { InvoiceModal } from "@/components/res/bills/invoice-modal";
import { ResStatusPill, InvoiceStatusPill } from "@/components/res/ui/status-pill";
import { ResTabBar } from "@/components/res/ui/tab-bar";
import { Card } from "@/components/ui/card";
import {
  balanceOf,
  currentBills,
  outstandingBills,
  periodLabel,
  statusOf,
  type ResidentInvoice,
} from "@/lib/res/bills-data";
import { useResInvoices, useResPayments } from "@/lib/res/bills-store";
import { TODAY } from "@/lib/res/dashboard-data";
import { lkr, longDate } from "@/lib/res/format";
import { invoiceFor, receiptNumberFor } from "@/lib/res/payments-data";

type Tab = "Current Bills" | "Outstanding" | "Payment History";

/** The row shell both lists share — icon, two lines, and a figure on the right. */
function ListRow({
  chip,
  icon: Icon,
  title,
  subtitle,
  amount,
  badge,
  onOpen,
}: {
  chip: string;
  icon: typeof Receipt;
  title: string;
  subtitle: string;
  amount: string;
  badge: React.ReactNode;
  onOpen?: () => void;
}) {
  const body = (
    <>
      <span
        aria-hidden="true"
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${chip}`}
      >
        <Icon className="h-5 w-5" />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-bold text-ink">{title}</span>
        <span className="mt-0.5 block text-[13px] text-muted">{subtitle}</span>
      </span>

      {/* Wraps under the text on a phone rather than squeezing the title. */}
      <span className="flex shrink-0 items-center gap-3">
        <span className="text-[17px] font-bold text-ink tabular-nums">
          {amount}
        </span>
        {badge}
      </span>
    </>
  );

  const shell =
    "flex w-full flex-wrap items-center gap-3 px-4 py-4 text-left sm:flex-nowrap sm:gap-4 sm:px-5";

  return (
    <li>
      {onOpen ? (
        <button
          type="button"
          onClick={onOpen}
          aria-haspopup="dialog"
          className={`${shell} transition-colors hover:bg-gray-50/70 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none`}
        >
          {body}
        </button>
      ) : (
        <div className={shell}>{body}</div>
      )}
    </li>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <p className="px-6 py-14 text-center text-[14px] text-muted">{message}</p>
  );
}

/**
 * Every bill on this unit, and everything paid against them.
 *
 * Three tabs answering three different questions: what is due this cycle, what
 * is owed in total, and what has already been settled. The counts sit on the
 * tabs so the answer is visible before the click.
 */
export function ResBillsView() {
  const invoices = useResInvoices();
  const payments = useResPayments();

  const [tab, setTab] = useState<Tab>("Current Bills");
  const [openId, setOpenId] = useState<string | null>(null);

  const current = useMemo(
    () => currentBills(undefined, invoices),
    [invoices],
  );
  const outstanding = useMemo(() => outstandingBills(invoices), [invoices]);

  const open = invoices.find((invoice) => invoice.id === openId) ?? null;

  function billRow(invoice: ResidentInvoice) {
    return (
      <ListRow
        key={invoice.id}
        chip="bg-green-50 text-green-600"
        icon={Receipt}
        title={`${invoice.id} — ${periodLabel(invoice.period)}`}
        subtitle={`Due ${longDate(invoice.dueDate)}`}
        amount={lkr(balanceOf(invoice))}
        badge={<InvoiceStatusPill status={statusOf(invoice, TODAY)} />}
        onOpen={() => setOpenId(invoice.id)}
      />
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-[24px] leading-tight font-bold text-ink sm:text-[28px]">
          Bills &amp; Payments
        </h1>
        <p className="mt-1 text-[14px] text-muted">
          View and pay your apartment bills
        </p>
      </div>

      <ResTabBar
        label="Bills and payments"
        value={tab}
        onChange={(id) => setTab(id as Tab)}
        tabs={[
          { id: "Current Bills", label: "Current Bills", count: current.length },
          {
            id: "Outstanding",
            label: "Outstanding",
            count: outstanding.length,
          },
          {
            id: "Payment History",
            label: "Payment History",
            count: payments.length,
          },
        ]}
      />

      <Card>
        {tab === "Current Bills" &&
          (current.length === 0 ? (
            <EmptyState message="This cycle's bill is settled — nothing to pay." />
          ) : (
            <ul className="divide-y divide-hairline">
              {current.map(billRow)}
            </ul>
          ))}

        {tab === "Outstanding" &&
          (outstanding.length === 0 ? (
            <EmptyState message="Nothing outstanding. Every bill on your unit is paid." />
          ) : (
            <ul className="divide-y divide-hairline">
              {outstanding.map(billRow)}
            </ul>
          ))}

        {tab === "Payment History" &&
          (payments.length === 0 ? (
            <EmptyState message="No payments recorded yet." />
          ) : (
            <ul className="divide-y divide-hairline">
              {payments.map((payment) => {
                const invoice = invoiceFor(payment, invoices);

                return (
                  <ListRow
                    key={payment.id}
                    chip="bg-[#eef3f9] text-[#2e6cad]"
                    icon={CreditCard}
                    title={`${receiptNumberFor(payment)} — ${payment.invoiceId}`}
                    subtitle={`${longDate(payment.date)} · ${payment.method} · ${payment.reference}`}
                    amount={lkr(payment.amount)}
                    badge={
                      <ResStatusPill
                        tone={payment.status === "Completed" ? "green" : "amber"}
                      >
                        {payment.status}
                      </ResStatusPill>
                    }
                    onOpen={
                      invoice ? () => setOpenId(invoice.id) : undefined
                    }
                  />
                );
              })}
            </ul>
          ))}
      </Card>

      {open && (
        <InvoiceModal
          invoice={open}
          payments={payments}
          onClose={() => setOpenId(null)}
        />
      )}
    </div>
  );
}
