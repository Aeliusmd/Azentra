"use client";

import {
  RecentPayments,
  UpcomingTasks,
} from "@/components/acc/dashboard/activity-panels";
import { QuickActions } from "@/components/acc/dashboard/quick-actions";
import {
  BillingStatus,
  CollectionRate,
  MonthExpenses,
} from "@/components/acc/dashboard/status-panels";
import { MoneyTile } from "@/components/acc/dashboard/summary-tiles";
import {
  AccPeriodSelector,
  AccPropertySelector,
} from "@/components/acc/ui/scope-menu";
import { accDashboardFor } from "@/lib/acc/dashboard-data";
import { lkrK } from "@/lib/acc/money";
import { periodLabel, useSelectedAccPeriod } from "@/lib/acc/periods";
import { useSelectedAccProperty } from "@/lib/acc/properties";

/**
 * The accountant's opening screen: what was billed, what came back, what is
 * still out, and what the month has cost — for one property in one billing
 * period. Both header selectors re-scope every panel below them.
 */
export function AccDashboardView() {
  const propertyId = useSelectedAccProperty();
  const period = useSelectedAccPeriod();

  const summary = accDashboardFor(propertyId, period);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[28px] leading-tight font-bold text-ink">
            Dashboard
          </h1>
          <p className="mt-1 text-[14px] text-muted">
            Financial overview for {periodLabel(period)}
          </p>
        </div>

        {/* Stacked on a phone — side by side they leave neither name readable. */}
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          <AccPropertySelector className="w-full sm:w-[196px]" />
          <AccPeriodSelector className="w-full sm:w-[160px]" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-5 xl:grid-cols-4">
        <MoneyTile
          label="Total Billed"
          value={lkrK(summary.billed)}
          note={`${summary.billsGenerated} bills generated`}
        />
        <MoneyTile
          label="Collected"
          value={lkrK(summary.collected)}
          note={`${summary.paid} bills paid`}
          tone="green"
        />
        <MoneyTile
          label="Outstanding"
          value={lkrK(summary.outstanding)}
          note={`${summary.unpaid} unpaid`}
          tone="amber"
        />
        <MoneyTile
          label="Expenses"
          value={lkrK(summary.expenses)}
          note="This month"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <CollectionRate rate={summary.rate} />
        <BillingStatus summary={summary} />
        <MonthExpenses summary={summary} />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <RecentPayments payments={summary.payments} />
        <UpcomingTasks tasks={summary.upcoming} />
      </div>

      <QuickActions />
    </div>
  );
}
