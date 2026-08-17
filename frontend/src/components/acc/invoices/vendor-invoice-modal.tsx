"use client";

import { Modal } from "@/components/ui/modal";
import { downloadPdf } from "@/lib/fs/report-pdf";
import { lkr } from "@/lib/acc/money";
import { periodLabel } from "@/lib/acc/periods";
import { accPropertyName } from "@/lib/acc/properties";
import { showAccToast } from "@/lib/acc/toast-store";
import type { VendorInvoice } from "@/lib/acc/vendor-invoices-data";
import { approveVendorInvoice } from "@/lib/acc/vendor-invoices-store";

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[15px] text-muted">{label}</dt>
      <dd className="mt-1 text-[17px] font-semibold text-ink">{value}</dd>
    </div>
  );
}

function Amount({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <li className="flex items-center justify-between gap-4">
      <span
        className={`text-[16px] ${strong ? "font-bold text-ink" : "text-gray-600"}`}
      >
        {label}
      </span>
      <span
        className={`text-[16px] ${strong ? "font-bold text-ink" : "text-ink"}`}
      >
        {value}
      </span>
    </li>
  );
}

/** A one-page PDF of the invoice, so View PDF hands over a real document. */
function invoicePdf(invoice: VendorInvoice) {
  downloadPdf(`${invoice.id.toLowerCase()}.pdf`, [
    { text: "Azentra", size: 11 },
    { text: `Invoice ${invoice.id}`, size: 20, bold: true, gap: 18 },
    {
      text: `${accPropertyName(invoice.propertyId)} · ${periodLabel(invoice.period)}`,
      size: 11,
      gap: 6,
    },
    { text: "Vendor", size: 10, gap: 26 },
    { text: invoice.vendor, size: 13, bold: true, gap: 4 },
    { text: "Service", size: 10, gap: 16 },
    { text: invoice.service, size: 13, bold: true, gap: 4 },
    { text: "Work Order", size: 10, gap: 16 },
    { text: invoice.workOrder ?? "Not raised against a job", size: 13, bold: true, gap: 4 },
    { text: "Invoice Date", size: 10, gap: 16 },
    { text: invoice.date, size: 13, bold: true, gap: 4 },
    { text: "Payment Due", size: 10, gap: 16 },
    { text: invoice.dueDate, size: 13, bold: true, gap: 4 },
    { text: `Amount${" ".repeat(28)}${lkr(invoice.amount)}`, size: 12, gap: 28 },
    { text: `Tax (18%)${" ".repeat(25)}${lkr(invoice.tax)}`, size: 12, gap: 8 },
    {
      text: `Total${" ".repeat(30)}${lkr(invoice.total)}`,
      size: 14,
      bold: true,
      gap: 12,
    },
    { text: `Status: ${invoice.status}`, size: 11, gap: 24 },
  ]);

  showAccToast(`${invoice.id} PDF downloaded`);
}

/**
 * A supplier invoice as the accountant checks it: who sent it, what job it is
 * against, and the three figures that have to agree before it is signed off.
 *
 * Approve only appears while the invoice is awaiting sign-off — the control
 * step is the whole point of the screen, so it disappears once it is done.
 */
export function VendorInvoiceModal({
  invoice,
  onClose,
}: {
  invoice: VendorInvoice;
  onClose: () => void;
}) {
  const awaiting = invoice.status === "Pending Approval";

  function approve() {
    approveVendorInvoice(invoice.id);
    showAccToast(`${invoice.id} approved for payment`);
    onClose();
  }

  return (
    <Modal open onClose={onClose} size="lg" title={`Invoice #${invoice.id}`}>
      <div className="px-5 py-5 sm:px-8 sm:py-6">
        <dl className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
          <Detail label="Vendor" value={invoice.vendor} />
          <Detail label="Service" value={invoice.service} />
          <Detail
            label="Work Order"
            value={invoice.workOrder ?? "—"}
          />
          <Detail label="Date" value={invoice.date} />
        </dl>

        <ul className="mt-6 space-y-3 border-t border-hairline pt-5">
          <Amount label="Amount" value={lkr(invoice.amount)} />
          <Amount label="Tax" value={lkr(invoice.tax)} />
          <Amount label="Total" value={lkr(invoice.total)} strong />
        </ul>

        <div className="mt-6 flex flex-wrap gap-3">
          {awaiting && (
            <button
              type="button"
              onClick={approve}
              className="flex-1 rounded-lg bg-brand px-5 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              Approve
            </button>
          )}
          <button
            type="button"
            onClick={() => invoicePdf(invoice)}
            className={`rounded-lg border border-hairline px-6 py-3 text-[15px] font-semibold text-ink transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none ${
              awaiting ? "shrink-0" : "flex-1"
            }`}
          >
            View PDF
          </button>
        </div>
      </div>
    </Modal>
  );
}
