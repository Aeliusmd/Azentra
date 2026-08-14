"use client";

import { Download, Printer } from "lucide-react";

import { Pill } from "@/components/pm/ui/pill";
import { Modal } from "@/components/ui/modal";
import {
  REPORT_STATUS_TONE,
  type FsFieldReport,
} from "@/lib/fs/field-reports-data";
import { downloadReportPdf, printReport } from "@/lib/fs/report-pdf";
import { showFsToast } from "@/lib/fs/toast-store";

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-[13px] text-muted">{label}</dt>
      <dd className="mt-0.5 text-[15px] font-medium text-ink">{value}</dd>
    </div>
  );
}

/** The filed report, and the two things a supervisor does with one. */
export function ReportDetailModal({
  report,
  onClose,
}: {
  report: FsFieldReport;
  onClose: () => void;
}) {
  function handleDownload() {
    downloadReportPdf(report);
    showFsToast(`${report.id}.pdf downloaded`);
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={`${report.id} — ${report.type}`}
      size="lg"
    >
      <div className="max-h-[min(70vh,640px)] space-y-6 overflow-y-auto px-5 py-6 sm:px-8">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
          <Detail label="Report ID" value={report.id} />
          <Detail label="Date" value={report.date} />
          <Detail label="Location" value={report.location} />
          <Detail label="Author" value={report.author} />
        </dl>

        <div className="border-t border-hairline pt-5">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-[17px] font-bold text-ink">{report.type}</h3>
            <Pill tone={REPORT_STATUS_TONE[report.status]}>
              {report.status}
            </Pill>
          </div>
          <p className="mt-2 text-[15px] text-gray-600">{report.summary}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 border-t border-hairline px-5 py-4 sm:px-8 sm:py-5">
        <button
          type="button"
          onClick={handleDownload}
          className="flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <Download aria-hidden="true" className="h-[18px] w-[18px]" />
          Download PDF
        </button>
        <button
          type="button"
          onClick={() => printReport(report)}
          className="flex items-center gap-2 rounded-lg border border-hairline px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
        >
          <Printer aria-hidden="true" className="h-[18px] w-[18px]" />
          Print
        </button>
      </div>
    </Modal>
  );
}
