"use client";

import { useMemo, useState } from "react";
import { ChartColumn, Download } from "lucide-react";

import { AccPeriodSelector } from "@/components/acc/ui/scope-menu";
import { AccStatusChips } from "@/components/acc/ui/status-chips";
import { Card } from "@/components/ui/card";
import { useAccBudgets } from "@/lib/acc/budgets-store";
import { useAccExpenses } from "@/lib/acc/expenses-store";
import { useAccPayments } from "@/lib/acc/payments-store";
import { periodLabel, useSelectedAccPeriod } from "@/lib/acc/periods";
import {
  accPropertyName,
  useSelectedAccProperty,
} from "@/lib/acc/properties";
import { downloadReportCsv, downloadReportPdf } from "@/lib/acc/report-export";
import {
  ACC_REPORTS,
  buildReport,
  REPORT_FILTERS,
  type AccReport,
  type ReportSource,
} from "@/lib/acc/reports-data";
import { showAccToast } from "@/lib/acc/toast-store";
import { useAccUnitBills } from "@/lib/acc/unit-bills-store";
import { useAccUtilityReadings } from "@/lib/acc/utility-readings-store";

/**
 * Runs a report over the live stores and hands back the file.
 *
 * Nothing is filed on a server — a report is the state of the books at the
 * moment it was run.
 */
export function AccReportsView() {
  const propertyId = useSelectedAccProperty();
  const period = useSelectedAccPeriod();

  const bills = useAccUnitBills();
  const payments = useAccPayments();
  const expenses = useAccExpenses();
  const readings = useAccUtilityReadings();
  const budgets = useAccBudgets();

  const [category, setCategory] = useState<string>("All");

  const source: ReportSource = useMemo(() => {
    const forScope = <T extends { propertyId: string; period: string }>(
      list: T[],
    ) =>
      list.filter(
        (entry) => entry.propertyId === propertyId && entry.period === period,
      );

    return {
      property: accPropertyName(propertyId),
      periodLabel: periodLabel(period),
      bills: forScope(bills),
      allPayments: payments.filter(
        (payment) => payment.propertyId === propertyId,
      ),
      payments: forScope(payments),
      expenses: forScope(expenses),
      readings: forScope(readings),
      budget:
        budgets
          .filter(
            (budget) =>
              budget.propertyId === propertyId && budget.categories.length > 0,
          )
          .sort((a, b) => b.year - a.year)[0] ?? null,
    };
  }, [propertyId, period, bills, payments, expenses, readings, budgets]);

  const visible = useMemo(
    () =>
      category === "All"
        ? ACC_REPORTS
        : ACC_REPORTS.filter((report) => report.category === category),
    [category],
  );

  function generate(report: AccReport) {
    downloadReportPdf(
      report,
      source.property,
      source.periodLabel,
      period,
      buildReport(report.id, source),
    );
    showAccToast(`${report.title} generated`);
  }

  function exportCsv(report: AccReport) {
    downloadReportCsv(report, period, buildReport(report.id, source));
    showAccToast(`${report.title} exported`);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[28px] leading-tight font-bold text-ink">
          Reports
        </h1>
        <p className="mt-1 text-[14px] text-muted">
          Generate and export financial reports
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <AccPeriodSelector className="w-full sm:w-[160px]" />
        <AccStatusChips
          label="Filter by report type"
          options={REPORT_FILTERS}
          value={category}
          onChange={setCategory}
        />
      </div>

      <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {visible.map((report) => (
          <li key={report.id}>
            <Card className="flex h-full flex-col p-5">
              <div className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#eef3f9] text-[#5b7f9c]"
                >
                  <ChartColumn className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <h2 className="text-[15px] font-bold text-ink">
                    {report.title}
                  </h2>
                  <p className="mt-0.5 text-[13px] text-muted">
                    {report.category} · {report.description}
                  </p>
                </div>
              </div>

              {/* Pushed to the bottom so the buttons line up across a row. */}
              <div className="mt-auto flex gap-3 pt-5">
                <button
                  type="button"
                  onClick={() => generate(report)}
                  className="flex-1 rounded-lg bg-brand px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  Generate
                  <span className="sr-only"> {report.title} as PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => exportCsv(report)}
                  className="flex shrink-0 items-center gap-1.5 rounded-lg border border-hairline px-4 py-2.5 text-[14px] font-semibold text-ink transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
                >
                  <Download aria-hidden="true" className="h-4 w-4" />
                  CSV
                  <span className="sr-only"> export of {report.title}</span>
                </button>
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
