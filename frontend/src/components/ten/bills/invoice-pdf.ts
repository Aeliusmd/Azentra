"use client";

import { downloadPdf, type PdfLine } from "@/lib/fs/report-pdf";
import { lkr, longDate } from "@/lib/res/format";
import {
  balanceOf,
  periodLabel,
  statusOf,
  type TenantInvoice,
} from "@/lib/ten/bills-data";
import {
  paymentsForInvoice,
  receiptNumberFor,
  type TenPayment,
} from "@/lib/ten/payments-data";
import { tenantUnit } from "@/lib/ten/tenant";

/**
 * Downloadable copies of an invoice and a receipt, written through the same
 * hand-rolled PDF writer the field reports use — a genuine PDF rather than an
 * HTML file wearing the extension.
 */

/** Pads a label so the amount column lines up in a proportional font. */
function row(label: string, amount: string) {
  return `${label.padEnd(38, " ")}${amount}`;
}

function header(title: string, id: string): PdfLine[] {
  return [
    { text: "Azentra · Sunrise Residence", size: 10 },
    { text: `${title} ${id}`, size: 20, bold: true, gap: 14 },
  ];
}

export function invoiceLines(
  invoice: TenantInvoice,
  payments: TenPayment[],
  today: string,
): PdfLine[] {
  const lines: PdfLine[] = [
    ...header("Invoice", invoice.id),
    {
      text: `${periodLabel(invoice.period)} · ${invoice.type}`,
      size: 11,
      gap: 4,
    },
    {
      text: `Unit ${tenantUnit.number}, ${tenantUnit.building} (Tenant)`,
      size: 11,
      gap: 2,
    },
    { text: `Issued ${longDate(invoice.issued)}`, size: 11, gap: 2 },
    { text: `Due ${longDate(invoice.dueDate)}`, size: 11, gap: 2 },
    { text: `Status ${statusOf(invoice, today)}`, size: 11, gap: 2 },

    { text: "Charges", size: 13, bold: true, gap: 20 },
  ];

  for (const line of invoice.lines) {
    lines.push({ text: row(line.label, lkr(line.amount)), size: 11, gap: 6 });
  }

  lines.push({
    text: row("Subtotal", lkr(invoice.subtotal)),
    size: 11,
    bold: true,
    gap: 12,
  });

  if (invoice.adjustment !== 0) {
    lines.push({
      text: row("Adjustments", lkr(invoice.adjustment)),
      size: 11,
      gap: 6,
    });
  }

  lines.push(
    { text: row("Total", lkr(invoice.total)), size: 13, bold: true, gap: 10 },
    { text: row("Paid", lkr(invoice.paid)), size: 11, gap: 8 },
    {
      text: row("Balance", lkr(balanceOf(invoice))),
      size: 11,
      bold: true,
      gap: 6,
    },
  );

  const settled = paymentsForInvoice(invoice.id, payments);
  if (settled.length > 0) {
    lines.push({ text: "Payment history", size: 13, bold: true, gap: 22 });
    for (const payment of settled) {
      lines.push({
        text: row(
          `${longDate(payment.date)} · ${payment.method} · ${receiptNumberFor(payment)}`,
          lkr(payment.amount),
        ),
        size: 11,
        gap: 6,
      });
    }
  }

  return lines;
}

export function downloadInvoicePdf(
  invoice: TenantInvoice,
  payments: TenPayment[],
  today: string,
) {
  downloadPdf(`${invoice.id}.pdf`, invoiceLines(invoice, payments, today));
}

export function receiptLines(
  payment: TenPayment,
  invoice: TenantInvoice | null,
): PdfLine[] {
  return [
    ...header("Receipt", receiptNumberFor(payment)),
    { text: `Paid ${longDate(payment.date)}`, size: 11, gap: 4 },
    {
      text: `Unit ${tenantUnit.number}, ${tenantUnit.building} (Tenant)`,
      size: 11,
      gap: 2,
    },
    { text: "Details", size: 13, bold: true, gap: 22 },
    { text: row("Invoice", payment.invoiceId), size: 11, gap: 6 },
    ...(invoice
      ? [
          {
            text: row("Billing period", periodLabel(invoice.period)),
            size: 11,
            gap: 6,
          },
          { text: row("Charge type", invoice.type), size: 11, gap: 6 },
        ]
      : []),
    { text: row("Method", payment.method), size: 11, gap: 6 },
    { text: row("Reference", payment.reference), size: 11, gap: 6 },
    { text: row("Status", payment.status), size: 11, gap: 6 },
    {
      text: row("Amount paid", lkr(payment.amount)),
      size: 13,
      bold: true,
      gap: 12,
    },
  ];
}

export function downloadReceiptPdf(
  payment: TenPayment,
  invoice: TenantInvoice | null,
) {
  downloadPdf(`${receiptNumberFor(payment)}.pdf`, receiptLines(payment, invoice));
}

function escapeHtml(value: string) {
  return value.replace(
    /[&<>"]/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[char] ?? char,
  );
}

/**
 * Prints one document on its own rather than the page behind it — an offscreen
 * frame holds the sheet and is torn down once the dialog closes.
 */
function printLines(title: string, lines: PdfLine[]) {
  const frame = document.createElement("iframe");
  frame.setAttribute("aria-hidden", "true");
  frame.style.cssText =
    "position:fixed;right:0;bottom:0;width:0;height:0;border:0";
  document.body.append(frame);

  const doc = frame.contentDocument;
  if (!doc) {
    frame.remove();
    return;
  }

  const body = lines
    .map((line) => {
      const weight = line.bold ? "600" : "400";
      return `<p style="margin:${line.gap ?? 4}px 0 0;font-size:${line.size}px;font-weight:${weight};white-space:pre">${escapeHtml(line.text)}</p>`;
    })
    .join("");

  doc.write(`<!doctype html>
<html><head><meta charset="utf-8"><title>${escapeHtml(title)}</title>
<style>
  body { font: 14px/1.5 Helvetica, Arial, sans-serif; color: #111827; margin: 40px; }
</style></head><body>${body}</body></html>`);
  doc.close();

  frame.contentWindow?.focus();
  frame.contentWindow?.print();

  // Torn down after the dialog has taken its copy of the document.
  setTimeout(() => frame.remove(), 1000);
}

export function printInvoice(
  invoice: TenantInvoice,
  payments: TenPayment[],
  today: string,
) {
  printLines(invoice.id, invoiceLines(invoice, payments, today));
}

export function printReceipt(
  payment: TenPayment,
  invoice: TenantInvoice | null,
) {
  printLines(receiptNumberFor(payment), receiptLines(payment, invoice));
}
