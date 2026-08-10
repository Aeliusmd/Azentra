"use client";

import { useMemo, useState } from "react";

import { FilterChips } from "@/components/pm/ui/filter-chips";
import { Pill } from "@/components/pm/ui/pill";
import {
  PmPageHeader,
  PmPrimaryButton,
} from "@/components/pm/ui/pm-page-header";
import {
  WorkOrderFormModal,
  type WorkOrderFormValues,
} from "@/components/pm/work-orders/work-order-form-modal";
import { Card } from "@/components/ui/card";
import {
  NO_TECHNICIAN,
  WO_PRIORITY_TONE,
  WO_STATUSES,
  WO_STATUS_TONE,
  nextWorkOrderId,
  workOrders as seed,
  type WorkOrder,
} from "@/lib/pm/work-orders-data";

const FILTERS = ["All", ...WO_STATUSES] as const;

const HEADINGS = [
  "WO ID",
  "Title",
  "Location",
  "Technician",
  "Priority",
  "Status",
  "Progress",
  "Scheduled",
];

function ProgressBar({ value }: { value: number }) {
  return (
    <span
      role="img"
      aria-label={`${value}% complete`}
      className="block h-1.5 w-[120px] overflow-hidden rounded-full bg-gray-200"
    >
      <span
        className="block h-full rounded-full bg-brand transition-[width]"
        style={{ width: `${value}%` }}
      />
    </span>
  );
}

export function WorkOrdersView() {
  const [list, setList] = useState<WorkOrder[]>(seed);
  const [filter, setFilter] = useState<string>("All");
  const [formOpen, setFormOpen] = useState(false);

  const visible = useMemo(
    () => (filter === "All" ? list : list.filter((wo) => wo.status === filter)),
    [list, filter],
  );

  function handleCreate(values: WorkOrderFormValues) {
    setList((current) => [
      ...current,
      {
        id: nextWorkOrderId(current),
        title: values.title.trim(),
        location: values.location.trim() || "—",
        technician:
          values.technician === NO_TECHNICIAN ? "Unassigned" : values.technician,
        priority: values.priority,
        status: "Open",
        progress: 0,
        scheduled: values.scheduledDate || "—",
      },
    ]);
    setFormOpen(false);
  }

  return (
    <div className="space-y-6">
      <PmPageHeader
        title="Work Orders"
        subtitle="Create and track maintenance work orders"
        action={
          <PmPrimaryButton
            label="Create Work Order"
            onClick={() => setFormOpen(true)}
          />
        }
      />

      <FilterChips
        label="Filter work orders by status"
        options={FILTERS}
        value={filter}
        onChange={setFilter}
        trailing={`${visible.length} work order${visible.length === 1 ? "" : "s"}`}
      />

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1040px] text-left">
            <thead>
              <tr className="border-b border-hairline">
                {HEADINGS.map((heading) => (
                  <th
                    key={heading}
                    scope="col"
                    className="px-5 py-4 text-xs font-semibold tracking-wide text-gray-500 uppercase"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-hairline">
              {visible.map((order) => (
                <tr
                  key={order.id}
                  className="transition-colors hover:bg-gray-50/70"
                >
                  <th
                    scope="row"
                    className="px-5 py-4 text-left font-mono text-[13px] font-normal text-gray-500"
                  >
                    {order.id}
                  </th>
                  <td className="max-w-[240px] truncate px-5 py-4 text-[15px] font-semibold text-ink">
                    {order.title}
                  </td>
                  <td className="px-5 py-4 text-[15px] whitespace-nowrap text-gray-600">
                    {order.location}
                  </td>
                  <td className="px-5 py-4 text-[15px] whitespace-nowrap text-gray-600">
                    {order.technician}
                  </td>
                  <td className="px-5 py-4">
                    <Pill tone={WO_PRIORITY_TONE[order.priority]}>
                      {order.priority}
                    </Pill>
                  </td>
                  <td className="px-5 py-4">
                    <Pill tone={WO_STATUS_TONE[order.status]}>
                      {order.status}
                    </Pill>
                  </td>
                  <td className="px-5 py-4">
                    <ProgressBar value={order.progress} />
                  </td>
                  <td className="px-5 py-4 text-[15px] whitespace-nowrap text-gray-600">
                    {order.scheduled}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {visible.length === 0 && (
          <p className="px-6 py-12 text-center text-[15px] text-muted">
            No work orders with this status.
          </p>
        )}
      </Card>

      <WorkOrderFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleCreate}
      />
    </div>
  );
}
