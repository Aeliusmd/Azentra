"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";

import { AddRecurringModal } from "@/components/acc/expenses/add-recurring-modal";
import { RecurringStatusPill } from "@/components/acc/ui/status-pill";
import { Card } from "@/components/ui/card";
import { lkr } from "@/lib/acc/money";
import { useSelectedAccPeriod } from "@/lib/acc/periods";
import { useSelectedAccProperty } from "@/lib/acc/properties";
import {
  nextPaymentDate,
  ordinalDay,
} from "@/lib/acc/recurring-expenses-data";
import { useAccRecurringExpenses } from "@/lib/acc/recurring-expenses-store";

/**
 * The property's standing costs, one card each.
 *
 * A card rather than a table row because a schedule is only five facts and the
 * one that matters — when it next takes money — deserves to sit alongside the
 * amount rather than in a seventh column.
 */
export function AccRecurringExpensesView() {
  const allSchedules = useAccRecurringExpenses();
  const propertyId = useSelectedAccProperty();
  const period = useSelectedAccPeriod();

  const [addOpen, setAddOpen] = useState(false);

  const schedules = useMemo(
    () =>
      allSchedules.filter((schedule) => schedule.propertyId === propertyId),
    [allSchedules, propertyId],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[28px] leading-tight font-bold text-ink">
            Recurring Expenses
          </h1>
          <p className="mt-1 text-[14px] text-muted">
            Manage automated recurring expenses
          </p>
        </div>

        <button
          type="button"
          onClick={() => setAddOpen(true)}
          aria-haspopup="dialog"
          className="flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-[15px] font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <Plus aria-hidden="true" className="h-[18px] w-[18px]" />
          Add Recurring
        </button>
      </div>

      {schedules.length === 0 ? (
        <Card className="px-6 py-16 text-center">
          <p className="text-[15px] text-muted">
            No recurring expenses set up for this property.
          </p>
        </Card>
      ) : (
        <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {schedules.map((schedule) => (
            <li key={schedule.id}>
              <Card className="flex h-full flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="text-[17px] font-bold text-ink">
                      {schedule.name}
                    </h2>
                    <p className="mt-1 truncate text-[14px] text-muted">
                      {schedule.category} · {schedule.vendor}
                    </p>
                  </div>
                  <RecurringStatusPill status={schedule.status} />
                </div>

                <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-5">
                  <div>
                    <p className="text-[24px] leading-none font-bold text-ink">
                      {lkr(schedule.amount)}
                    </p>
                    <p className="mt-2 text-[14px] text-muted">
                      {schedule.frequency} · Due {ordinalDay(schedule.dueDay)}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[13px] text-muted">Next Payment</p>
                    <p className="mt-1 text-[17px] font-bold text-ink">
                      {nextPaymentDate(
                        period,
                        schedule.dueDay,
                        schedule.frequency,
                      )}
                    </p>
                  </div>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}

      {addOpen && (
        <AddRecurringModal
          propertyId={propertyId}
          onClose={() => setAddOpen(false)}
        />
      )}
    </div>
  );
}
