"use client";

import type { FsFieldReport } from "@/lib/fs/field-reports-data";
import { propertyName } from "@/lib/fs/properties";

/**
 * A one-page PDF of a field report, written by hand.
 *
 * The alternative was pulling in a PDF library for what is a page of headings
 * and a paragraph, or handing the user an HTML file named `.pdf`. This emits a
 * genuine PDF 1.4 document — text only, the two standard Helvetica faces every
 * reader ships with, so nothing has to be embedded.
 */

/** A4 at 72dpi, which is the unit PDF text positioning works in. */
const PAGE_WIDTH = 595;
const PAGE_HEIGHT = 842;
const MARGIN = 56;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

/** Helvetica averages a little under half its point size per character. */
const CHAR_WIDTH_RATIO = 0.5;

export type PdfLine = {
  text: string;
  size: number;
  bold?: boolean;
  /** Space above this line. */
  gap?: number;
};

/**
 * The standard fonts are Latin-1: anything outside it would need an embedded
 * font, so it is folded to the nearest plain equivalent instead of dropped.
 */
function toLatin1(value: string) {
  return value
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, "-")
    .replace(/·/g, "-")
    .replace(/[^\x20-\x7e]/g, "");
}

/** `(` `)` and `\` carry meaning inside a PDF string. */
function escapeText(value: string) {
  return toLatin1(value).replace(/[\\()]/g, (char) => `\\${char}`);
}

/** Greedy wrap at the page width for a given point size. */
export function wrapText(text: string, size: number): string[] {
  const limit = Math.floor(CONTENT_WIDTH / (size * CHAR_WIDTH_RATIO));
  const lines: string[] = [];
  let current = "";

  for (const word of toLatin1(text).split(/\s+/).filter(Boolean)) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= limit) {
      current = candidate;
      continue;
    }
    if (current) lines.push(current);
    current = word;
  }

  if (current) lines.push(current);
  return lines.length > 0 ? lines : [""];
}

/** Positions every line down the page and returns the drawing instructions. */
function contentStream(lines: PdfLine[]) {
  const parts: string[] = ["BT"];
  let y = PAGE_HEIGHT - MARGIN;

  for (const line of lines) {
    y -= (line.gap ?? 0) + line.size;
    parts.push(
      `/${line.bold ? "F1" : "F2"} ${line.size} Tf`,
      `1 0 0 1 ${MARGIN} ${Math.round(y)} Tm`,
      `(${escapeText(line.text)}) Tj`,
    );
  }

  parts.push("ET");
  return parts.join("\n");
}

/** Assembles the objects, the cross-reference table and the trailer. */
function buildPdf(lines: PdfLine[]) {
  const stream = contentStream(lines);

  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] ` +
      "/Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> /Contents 4 0 R >>",
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  ];

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [];

  objects.forEach((body, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${body}\nendobj\n`;
  });

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const offset of offsets) {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  }
  pdf +=
    `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\n` +
    `startxref\n${xrefOffset}\n%%EOF`;

  return pdf;
}

/** The report as page copy, shared by the PDF and the print sheet. */
function reportLines(report: FsFieldReport): PdfLine[] {
  return [
    { text: "Azentra", size: 10, bold: true },
    { text: `${report.id} - ${report.type}`, size: 20, bold: true, gap: 18 },
    { text: propertyName(report.propertyId), size: 11, gap: 10 },
    { text: `Date: ${report.date}`, size: 11, gap: 16 },
    { text: `Location: ${report.location}`, size: 11, gap: 4 },
    { text: `Author: ${report.author}`, size: 11, gap: 4 },
    { text: `Status: ${report.status}`, size: 11, gap: 4 },
    { text: "Summary", size: 13, bold: true, gap: 24 },
    ...wrapText(report.summary, 11).map((text) => ({ text, size: 11, gap: 4 })),
  ];
}

/** Writes the lines to a PDF and hands it to the browser as a download. */
export function downloadPdf(filename: string, lines: PdfLine[]) {
  const blob = new Blob([buildPdf(lines)], {
    type: "application/pdf",
  });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();

  // Released on the next tick so the download has taken the handle.
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

export function downloadReportPdf(report: FsFieldReport) {
  downloadPdf(`${report.id}.pdf`, reportLines(report));
}

function escapeHtml(value: string) {
  return value.replace(
    /[&<>"]/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[char] ?? char,
  );
}

/**
 * Prints the report on its own rather than the page behind it — an offscreen
 * frame holds the sheet, and is torn down once the dialog closes.
 */
export function printReport(report: FsFieldReport) {
  const frame = document.createElement("iframe");
  frame.setAttribute("aria-hidden", "true");
  frame.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:0";
  document.body.append(frame);

  const doc = frame.contentDocument;
  if (!doc) {
    frame.remove();
    return;
  }

  const rows = [
    ["Report ID", report.id],
    ["Date", report.date],
    ["Property", propertyName(report.propertyId)],
    ["Location", report.location],
    ["Author", report.author],
    ["Status", report.status],
  ];

  doc.write(`<!doctype html>
<html><head><meta charset="utf-8"><title>${escapeHtml(report.id)}</title>
<style>
  body { font: 14px/1.6 Helvetica, Arial, sans-serif; color: #111827; margin: 40px; }
  h1 { font-size: 22px; margin: 4px 0 20px; }
  dl { display: grid; grid-template-columns: 120px 1fr; gap: 6px 16px; margin: 0 0 24px; }
  dt { color: #6b7280; }
  dd { margin: 0; font-weight: 600; }
  h2 { font-size: 15px; margin: 0 0 8px; }
</style></head>
<body>
  <p style="font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#6b7280;margin:0">Azentra</p>
  <h1>${escapeHtml(report.id)} - ${escapeHtml(report.type)}</h1>
  <dl>${rows
    .map(
      ([label, value]) =>
        `<dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd>`,
    )
    .join("")}</dl>
  <h2>Summary</h2>
  <p>${escapeHtml(report.summary)}</p>
</body></html>`);
  doc.close();

  frame.contentWindow?.focus();
  frame.contentWindow?.print();

  // Safari and Firefox return from print() immediately; give the dialog time.
  setTimeout(() => frame.remove(), 1000);
}
