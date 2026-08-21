"use client";

import { balanceOf, periodLabel, type ResidentInvoice } from "@/lib/res/bills-data";
import { lkr, longDate } from "@/lib/res/format";
import { downloadPdf, type PdfLine } from "@/lib/fs/report-pdf";
import {
  paymentsForInvoice,
  receiptNumberFor,
  type ResidentPayment,
} from "@/lib/res/payments-data";
import { residentUnit } from "@/lib/res/resident";

/**
 * A downloadable copy of an invoice, written through the same hand-rolled PDF
 * writer the field reports use — a genuine PDF rather than an HTML file wearing
 * the extension.
 */

/** Pads a label so the amount column lines up in a monospace-free font. */
function row(label: string, amount: string) {
  return `${label.padEnd(38, " ")}${amount}`;
}

export function invoiceLines(
  invoice: ResidentInvoice,
  payments: ResidentPayment[],
): PdfLine[] {
  const lines: PdfLine[] = [
    { text: "Azentra · Sunrise Residence", size: 10 },
    { text: `Invoice ${invoice.id}`, size: 20, bold: true, gap: 14 },
    {
      text: `${periodLabel(invoice.period)} · ${invoice.type}`,
      size: 11,
      gap: 4,
    },
    {
      text: `Unit ${residentUnit.number}, ${residentUnit.building}`,
      size: 11,
      gap: 2,
    },
    { text: `Issued ${longDate(invoice.issued)}`, size: 11, gap: 2 },
    { text: `Due ${longDate(invoice.dueDate)}`, size: 11, gap: 2 },

    { text: "Charges", size: 13, bold: true, gap: 20 },
  ];

  for (const line of invoice.lines) {
    lines.push({
      text: row(
        line.basis ? `${line.label} (${line.basis})` : line.label,
        lkr(line.amount),
      ),
      size: 11,
      gap: 6,
    });
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
      text: row("Outstanding", lkr(balanceOf(invoice))),
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
  invoice: ResidentInvoice,
  payments: ResidentPayment[],
) {
  downloadPdf(`${invoice.id}.pdf`, invoiceLines(invoice, payments));
}
