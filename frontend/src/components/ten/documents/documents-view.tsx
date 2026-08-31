"use client";

import { useState } from "react";
import { Download, FileText } from "lucide-react";

import { downloadDocumentPdf } from "@/components/ten/documents/document-pdf";
import { showTenToast } from "@/components/ten/ui/toaster";
import { TenTabBar } from "@/components/ten/ui/tab-bar";
import { Card } from "@/components/ui/card";
import { longDate } from "@/lib/res/format";
import {
  CATEGORY_TAB_LABEL,
  DOCUMENT_CATEGORIES,
  documentsInCategory,
  fileSize,
  type DocumentCategory,
  type TenDocument,
} from "@/lib/ten/documents-data";

type Tab = DocumentCategory | "All";

const TABS: Tab[] = ["All", ...DOCUMENT_CATEGORIES];

function tabLabel(tab: Tab) {
  return tab === "All" ? "All" : CATEGORY_TAB_LABEL[tab];
}

function DocumentCard({ document }: { document: TenDocument }) {
  function handleDownload() {
    downloadDocumentPdf(document);
    showTenToast(`${document.name} downloaded`);
  }

  return (
    <li>
      <Card className="flex h-full flex-col p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-600"
          >
            <FileText className="h-[18px] w-[18px]" />
          </span>

          <div className="min-w-0">
            <h2 className="text-[15px] leading-snug font-bold text-ink">
              {document.name}
            </h2>
            <p className="mt-1 text-[13px] text-muted">
              {longDate(document.date)}
              <span className="px-2" aria-hidden="true" />
              {fileSize(document.bytes)}
              <span className="px-2" aria-hidden="true" />
              {document.fileType}
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-hairline pt-4">
          <span className="rounded-md bg-gray-100 px-2.5 py-1 text-[13px] font-medium text-gray-600">
            {document.category}
          </span>

          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center gap-2 rounded-md bg-green-50 px-3 py-2 text-[13px] font-semibold text-green-700 transition-colors hover:bg-green-100 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
          >
            <Download aria-hidden="true" className="h-4 w-4" />
            Download
            <span className="sr-only"> {document.name}</span>
          </button>
        </div>
      </Card>
    </li>
  );
}

/**
 * The documents a tenant may read.
 *
 * Read-only throughout — there is no upload here, and nothing management-only,
 * owner-only or belonging to another household is in the list to begin with.
 * The download is a demonstration: a generated PDF describing the record,
 * because no document store sits behind this portal.
 */
export function TenDocumentsView() {
  const [tab, setTab] = useState<Tab>("All");

  const visible = documentsInCategory(tab);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-[24px] leading-tight font-bold text-ink sm:text-[28px]">
          Documents
        </h1>
        <p className="mt-1 text-[14px] text-muted">
          Access your tenancy and apartment documents
        </p>
      </div>

      <TenTabBar
        label="Filter documents"
        value={tab}
        onChange={(id) => setTab(id as Tab)}
        tabs={TABS.map((id) => ({ id, label: tabLabel(id) }))}
      />

      {visible.length === 0 ? (
        <Card className="px-6 py-16 text-center">
          <span
            aria-hidden="true"
            className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green-600"
          >
            <FileText className="h-5 w-5" />
          </span>
          <p className="mt-4 text-[17px] font-semibold text-ink">
            Nothing filed here yet
          </p>
          <p className="mx-auto mt-1 max-w-[420px] text-[15px] text-muted">
            Documents in this category will appear here once the property files
            them.
          </p>
        </Card>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((document) => (
            <DocumentCard key={document.id} document={document} />
          ))}
        </ul>
      )}
    </div>
  );
}
