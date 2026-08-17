import {
  Meter,
  StatRow,
} from "@/components/acc/dashboard/summary-tiles";
import { Card } from "@/components/ui/card";
import type { AccDashboard } from "@/lib/acc/dashboard-data";
import { lkrK } from "@/lib/acc/money";

const GREEN = "#2f9e63";
const SLATE = "#5b7f9c";

/** How much of what was billed has actually come in. */
export function CollectionRate({ rate }: { rate: number }) {
  return (
    <Card className="p-5">
      <p className="text-[13px] text-muted">Collection Rate</p>

      <p className="mt-3 flex items-baseline gap-2">
        <span className="text-[36px] leading-none font-bold text-[#2f9e63]">
          {rate}%
        </span>
        <span className="text-[13px] text-muted">of billed</span>
      </p>

      <div className="mt-5">
        <Meter value={rate} color={GREEN} label="Collected against billed" />
      </div>
    </Card>
  );
}

/** Where this cycle's invoices stand — the counts behind the money tiles. */
export function BillingStatus({
  summary,
}: {
  summary: Pick<
    AccDashboard,
    "billsGenerated" | "paid" | "pending" | "overdue"
  >;
}) {
  return (
    <Card className="p-5">
      <p className="text-[13px] text-muted">Billing Status</p>

      <ul className="mt-3 space-y-2.5">
        <StatRow
          label="Bills Generated"
          value={String(summary.billsGenerated)}
        />
        <StatRow label="Paid" value={String(summary.paid)} tone="green" />
        <StatRow label="Pending" value={String(summary.pending)} tone="amber" />
        <StatRow label="Overdue" value={String(summary.overdue)} tone="red" />
      </ul>
    </Card>
  );
}

/** Spend against the month's allocation, with what is left to commit. */
export function MonthExpenses({
  summary,
}: {
  summary: Pick<AccDashboard, "expenses" | "budget" | "budgetRemaining" | "budgetUsed">;
}) {
  return (
    <Card className="p-5">
      <p className="text-[13px] text-muted">This Month Expenses</p>

      <ul className="mt-3 space-y-2.5">
        <StatRow label="This Month" value={lkrK(summary.expenses)} />
        <StatRow label="Budget" value={lkrK(summary.budget)} />
        <StatRow
          label="Remaining"
          value={lkrK(summary.budgetRemaining)}
          tone={summary.budgetRemaining < 0 ? "red" : "green"}
        />
      </ul>

      <div className="mt-4">
        <Meter
          value={summary.budgetUsed}
          color={SLATE}
          label="Budget spent this month"
        />
      </div>
    </Card>
  );
}
