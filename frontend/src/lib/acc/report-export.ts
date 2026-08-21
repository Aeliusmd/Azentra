"use client";

import type { AccReport, ReportTable } from "@/lib/acc/reports-data";
import { downloadPdf, type PdfLine } from "@/lib/fs/report-pdf";

/**
 * Handing a report over as a file.
 *
 * Both formats are produced in the browser from the same table, so the CSV and
 * the PDF of one report can never say different things.
 */

/** `Bills Generated Report` → `bills-generated-report-2026-08`. */
function fileStem(report: AccReport, period: string) {
  const slug = report.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${slug}-${period}`;
}

/** Quotes a cell only when it would otherwise break the row. */
function csvCell(value: string | number) {
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function downloadReportCsv(
  report: AccReport,
  period: string,
  table: ReportTable,
) {
  const text = [table.columns, ...table.rows]
    .map((row) => row.map(csvCell).join(","))
    .join("\n");

  const url = URL.createObjectURL(
    new Blob([text], { type: "text/csv;charset=utf-8" }),
  );

  const link = document.createElement("a");
  link.href = url;
  link.download = `${fileStem(report, period)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

/** Column width for the plain-text table the PDF writer can render. */
const COLUMN_WIDTH = 16;

function textRow(cells: (string | number)[]) {
  return cells
    .map((cell, index) =>
      index === 0
        ? String(cell).padEnd(COLUMN_WIDTH)
        : String(cell).padStart(COLUMN_WIDTH),
    )
    .join("");
}

export function downloadReportPdf(
  report: AccReport,
  propertyName: string,
  periodText: string,
  period: string,
  table: ReportTable,
) {
  const lines: PdfLine[] = [
    { text: "Azentra", size: 11 },
    { text: report.title, size: 20, bold: true, gap: 18 },
    { text: `${propertyName} · ${periodText}`, size: 11, gap: 6 },
    ...table.notes.map((note) => ({ text: note, size: 11, gap: 6 })),
    { text: textRow(table.columns), size: 9, bold: true, gap: 22 },
    ...table.rows.map((row) => ({ text: textRow(row), size: 9, gap: 5 })),
  ];

  downloadPdf(`${fileStem(report, period)}.pdf`, lines);
}
