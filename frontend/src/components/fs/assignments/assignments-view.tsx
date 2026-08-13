"use client";

import { useMemo, useState } from "react";

import { WorkOrderDetailModal } from "@/components/fs/work-orders/work-order-detail-modal";
import { Pill } from "@/components/pm/ui/pill";
import { Card } from "@/components/ui/card";
import { bySlot } from "@/lib/fs/job-scheduling-data";
import { useSelectedFsProperty } from "@/lib/fs/properties";
import { techniciansAt } from "@/lib/fs/technicians-data";
import {
  locationLabel,
  WO_PRIORITY_TONE,
  WO_STATUS_TONE,
  type FsWorkOrder,
} from "@/lib/fs/work-orders-data";
import { useFsWorkOrders } from "@/lib/fs/work-orders-store";

/** Sentinel for the combined view — no technician filter applied. */
const ALL = "";

const HEADINGS = [
  "WO ID",
  "Title",
  "Location",
  "Technician",
  "Priority",
  "Status",
  "Scheduled",
];

function TechnicianTab({
  name,
  detail,
  assigned,
  inProgress,
  selected,
  onSelect,
}: {
  name: string;
  detail: string;
  assigned: number;
  /** Left off the combined card — "in progress" is a per-person read. */
  inProgress?: number;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`flex w-[196px] shrink-0 flex-col rounded-lg border bg-white p-4 text-left transition-colors focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none ${
        selected
          ? "border-brand ring-1 ring-brand/30"
          : "border-hairline hover:bg-gray-50"
      }`}
    >
      <span className="truncate text-[15px] font-semibold text-ink">
        {name}
      </span>
      <span className="mt-0.5 truncate text-[13px] text-muted">{detail}</span>

      <span className="mt-3 flex items-baseline gap-2">
        <span className="text-[22px] leading-none font-bold text-ink">
          {assigned}
        </span>
        <span className="text-[13px] text-muted">assigned</span>
      </span>

      {inProgress !== undefined && (
        <span className="mt-2 text-[13px] font-medium text-link">
          {inProgress} in progress
        </span>
      )}
    </button>
  );
}

/**
 * Who is carrying what. The tabs count off the live work orders, so a job
 * reassigned from the dialog moves between two people's totals at once.
 */
export function FsAssignmentsView() {
  const propertyId = useSelectedFsProperty();
  const orders = useFsWorkOrders();

  const [technician, setTechnician] = useState(ALL);
  const [openId, setOpenId] = useState<string | null>(null);

  /** Assigned work still open on this property — the page's whole subject. */
  const assignments = useMemo(
    () =>
      orders.filter(
        (order) =>
          order.propertyId === propertyId &&
          order.technician !== null &&
          order.status !== "Completed",
      ),
    [orders, propertyId],
  );

  // Busiest first: the person to look at is the one carrying the most.
  const tabs = useMemo(
    () =>
      techniciansAt(propertyId)
        .map((tech) => {
          const held = assignments.filter(
            (order) => order.technician === tech.name,
          );

          return {
            id: tech.id,
            name: tech.name,
            detail: tech.title,
            assigned: held.length,
            inProgress: held.filter((order) => order.status === "In Progress")
              .length,
          };
        })
        .sort((a, b) => b.assigned - a.assigned),
    [propertyId, assignments],
  );

  const rows = useMemo(
    () =>
      assignments
        .filter((order) => !technician || order.technician === technician)
        .sort(bySlot),
    [assignments, technician],
  );

  const openOrder = orders.find((order) => order.id === openId) ?? null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[32px] leading-tight font-bold text-ink">
          Technician Assignments
        </h1>
        <p className="mt-1 text-[15px] text-muted">
          View and manage technician assignments across all work orders
        </p>
      </div>

      <div
        role="group"
        aria-label="Filter assignments by technician"
        className="flex gap-4 overflow-x-auto pb-1"
      >
        <TechnicianTab
          name="All Technicians"
          detail="Combined view"
          assigned={assignments.length}
          selected={technician === ALL}
          onSelect={() => setTechnician(ALL)}
        />

        {tabs.map((tab) => (
          <TechnicianTab
            key={tab.id}
            name={tab.name}
            detail={tab.detail}
            assigned={tab.assigned}
            inProgress={tab.inProgress}
            selected={technician === tab.name}
            onSelect={() => setTechnician(tab.name)}
          />
        ))}
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left">
            <thead>
              <tr className="border-b border-hairline">
                {HEADINGS.map((heading) => (
                  <th
                    key={heading}
                    scope="col"
                    className="px-4 py-3.5 text-xs font-semibold tracking-wide text-gray-500 uppercase"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-hairline">
              {rows.map((order: FsWorkOrder) => (
                <tr
                  key={order.id}
                  onClick={() => setOpenId(order.id)}
                  className="cursor-pointer transition-colors hover:bg-gray-50/70"
                >
                  <th scope="row" className="px-4 py-3.5 text-left font-normal">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        setOpenId(order.id);
                      }}
                      className="font-mono text-[13px] text-gray-500 transition-colors hover:text-ink focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
                    >
                      {order.id}
                      <span className="sr-only"> — view work order</span>
                    </button>
                  </th>
                  <td className="max-w-[240px] truncate px-4 py-3.5 text-[15px] font-semibold text-ink">
                    {order.title}
                  </td>
                  <td className="max-w-[180px] truncate px-4 py-3.5 text-[13px] text-gray-600">
                    {locationLabel(order, " - ")}
                  </td>
                  <td className="px-4 py-3.5 text-[13px] whitespace-nowrap text-gray-600">
                    {order.technician}
                  </td>
                  <td className="px-4 py-3.5">
                    <Pill tone={WO_PRIORITY_TONE[order.priority]}>
                      {order.priority}
                    </Pill>
                  </td>
                  <td className="px-4 py-3.5">
                    <Pill tone={WO_STATUS_TONE[order.status]}>
                      {order.status}
                    </Pill>
                  </td>
                  <td className="px-4 py-3.5 text-[13px] whitespace-nowrap text-gray-600">
                    {order.scheduledDate ? (
                      `${order.scheduledDate} ${order.scheduledTime}`
                    ) : (
                      <span className="text-gray-400 italic">Not booked</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {rows.length === 0 && (
          <p className="px-6 py-16 text-center text-[15px] text-muted">
            {technician
              ? `${technician} has no open jobs right now.`
              : "Nothing is assigned on this property right now."}
          </p>
        )}
      </Card>

      {openOrder && (
        <WorkOrderDetailModal
          order={openOrder}
          onClose={() => setOpenId(null)}
        />
      )}
    </div>
  );
}
