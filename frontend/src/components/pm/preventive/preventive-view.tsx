"use client";

import { useMemo, useState } from "react";

import {
  PlanFormModal,
  type PlanFormValues,
} from "@/components/pm/preventive/plan-form-modal";
import { FilterChips } from "@/components/pm/ui/filter-chips";
import { Pill } from "@/components/pm/ui/pill";
import {
  PmPageHeader,
  PmPrimaryButton,
} from "@/components/pm/ui/pm-page-header";
import {
  FREQUENCIES,
  FREQUENCY_TONE,
  PLAN_STATUS_TONE,
  nextPlanId,
  preventivePlans as seed,
  type PreventivePlan,
} from "@/lib/pm/preventive-data";

const FILTERS = ["All", ...FREQUENCIES] as const;

export function PreventiveView() {
  const [list, setList] = useState<PreventivePlan[]>(seed);
  const [filter, setFilter] = useState<string>("All");
  const [formOpen, setFormOpen] = useState(false);

  const visible = useMemo(
    () =>
      filter === "All" ? list : list.filter((plan) => plan.frequency === filter),
    [list, filter],
  );

  function handleCreate(values: PlanFormValues) {
    setList((current) => [
      ...current,
      {
        id: nextPlanId(current),
        asset: values.asset,
        status: "Scheduled",
        frequency: values.frequency,
        assignedTo: values.assignedTo.trim() || "Unassigned",
        isVendor: values.isVendor,
        lastService: "—",
        nextService: "—",
      },
    ]);
    setFormOpen(false);
  }

  return (
    <div className="space-y-6">
      <PmPageHeader
        title="Preventive Maintenance"
        subtitle="Schedule and track planned maintenance tasks"
        action={
          <PmPrimaryButton label="Create Plan" onClick={() => setFormOpen(true)} />
        }
      />

      <FilterChips
        label="Filter plans by frequency"
        options={FILTERS}
        value={filter}
        onChange={setFilter}
      />

      {visible.length === 0 ? (
        <p className="rounded-lg border border-hairline bg-white px-6 py-12 text-center text-[15px] text-muted">
          No plans with this frequency.
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {visible.map((plan) => {
            const overdue = plan.status === "Overdue";

            return (
              <li
                key={plan.id}
                className="rounded-xl border border-hairline bg-white px-6 py-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="font-mono text-[13px] text-gray-400">
                    {plan.id}
                  </span>
                  <Pill tone={PLAN_STATUS_TONE[plan.status]}>{plan.status}</Pill>
                </div>

                <h2 className="mt-2 text-[17px] font-semibold text-ink">
                  {plan.asset}
                </h2>

                <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2">
                  <div className="flex items-center gap-2">
                    <dt className="text-[15px] text-muted">Frequency:</dt>
                    <dd>
                      <Pill tone={FREQUENCY_TONE[plan.frequency]}>
                        {plan.frequency}
                      </Pill>
                    </dd>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-2">
                    <dt className="text-[15px] text-muted">Assigned:</dt>
                    <dd className="text-[15px] text-ink">
                      {plan.assignedTo}
                      {plan.isVendor && (
                        <span className="ml-1.5 text-brand">(Vendor)</span>
                      )}
                    </dd>
                  </div>

                  <div className="flex items-center gap-2">
                    <dt className="text-[15px] text-muted">Last:</dt>
                    <dd className="text-[15px] text-ink">{plan.lastService}</dd>
                  </div>

                  <div className="flex items-center gap-2">
                    <dt className="text-[15px] text-muted">Next:</dt>
                    <dd
                      className={`text-[15px] font-semibold ${
                        overdue ? "text-rose-600" : "text-brand"
                      }`}
                    >
                      {plan.nextService}
                    </dd>
                  </div>
                </dl>
              </li>
            );
          })}
        </ul>
      )}

      <PlanFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleCreate}
      />
    </div>
  );
}
