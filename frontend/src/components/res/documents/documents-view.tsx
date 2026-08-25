"use client";

import { useMemo, useState } from "react";
import { Download } from "lucide-react";

import { downloadDocument } from "@/components/res/documents/document-pdf";
import { ResTabBar } from "@/components/res/ui/tab-bar";
import { Card } from "@/components/ui/card";
import {
  CATEGORY_ICON,
  DOCUMENT_TABS,
  fileSize,
  residentDocuments,
} from "@/lib/res/documents-data";
import { longDate } from "@/lib/res/format";
import { showResToast } from "@/lib/res/toast-store";

type Tab = (typeof DOCUMENT_TABS)[number];

/**
 * The paperwork on this unit, and what the property publishes to everybody.
 *
 * Read-only: a resident downloads what is filed against their unit, and has no
 * way to add to it or reach another household's.
 */
export function ResDocumentsView() {
  const [tab, setTab] = useState<Tab>("All Documents");

  const visible = useMemo(
    () =>
      tab === "All Documents"
        ? residentDocuments
        : residentDocuments.filter((document) => document.category === tab),
    [tab],
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-[24px] leading-tight font-bold text-ink sm:text-[28px]">
          Documents
        </h1>
        <p className="mt-1 text-[14px] text-muted">
          View and download your apartment documents
        </p>
      </div>

      <ResTabBar
        label="Filter documents"
        value={tab}
        onChange={(id) => setTab(id as Tab)}
        tabs={DOCUMENT_TABS.map((id) => ({ id, label: id }))}
      />

      {visible.length === 0 ? (
        <Card className="px-6 py-14 text-center">
          <p className="text-[15px] font-semibold text-ink">
            Nothing filed under {tab}
          </p>
          <p className="mt-1 text-[14px] text-muted">
            Documents the property files against your unit appear here.
          </p>
        </Card>
      ) : (
        <Card>
          <ul className="divide-y divide-hairline">
            {visible.map((document) => {
              const Icon = CATEGORY_ICON[document.category];

              return (
                <li
                  key={document.id}
                  className="flex flex-wrap items-center gap-3 px-4 py-4 sm:flex-nowrap sm:gap-4 sm:px-5"
                >
                  <span
                    aria-hidden="true"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500"
                  >
                    <Icon className="h-5 w-5" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-bold text-ink">
                      {document.name}
                    </p>
                    <p className="mt-0.5 text-[13px] text-muted">
                      {longDate(document.date)} · {fileSize(document.bytes)} ·{" "}
                      {document.type}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      downloadDocument(document);
                      showResToast(`${document.name} downloaded`);
                    }}
                    className="flex shrink-0 items-center gap-2 rounded-lg bg-[#eef3f9] px-4 py-2 text-[14px] font-semibold text-[#2e6cad] transition-colors hover:bg-[#e2ebf4] focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
                  >
                    <Download aria-hidden="true" className="h-4 w-4" />
                    Download
                    <span className="sr-only"> {document.name}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </Card>
      )}
    </div>
  );
}
