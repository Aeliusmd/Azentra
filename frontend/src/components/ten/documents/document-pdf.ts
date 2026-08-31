"use client";

import { downloadPdf, type PdfLine } from "@/lib/fs/report-pdf";
import { longDate } from "@/lib/res/format";
import { fileSize, type TenDocument } from "@/lib/ten/documents-data";
import { tenantUnit } from "@/lib/ten/tenant";

/**
 * A downloadable stand-in for a tenant document.
 *
 * There is no document store behind this portal, so what the browser gets is a
 * genuine one-page PDF describing the record rather than an empty file wearing
 * the extension. Written through the same hand-rolled writer the invoices and
 * field reports use.
 */
export function documentLines(document: TenDocument): PdfLine[] {
  return [
    { text: "Azentra · Sunrise Residence", size: 10 },
    { text: document.name, size: 20, bold: true, gap: 14 },
    { text: `${document.category} document`, size: 11, gap: 4 },
    {
      text: `Unit ${tenantUnit.number}, ${tenantUnit.building} (Tenant)`,
      size: 11,
      gap: 2,
    },
    { text: `Dated ${longDate(document.date)}`, size: 11, gap: 2 },
    {
      text: `${document.fileType} · ${fileSize(document.bytes)}`,
      size: 11,
      gap: 2,
    },
    {
      text: "This is a demonstration copy. The document itself is held by the property.",
      size: 11,
      gap: 24,
    },
  ];
}

export function downloadDocumentPdf(document: TenDocument) {
  downloadPdf(`${document.name}.pdf`, documentLines(document));
}
