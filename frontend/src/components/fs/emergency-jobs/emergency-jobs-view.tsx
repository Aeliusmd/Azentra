"use client";

import { useMemo, useState } from "react";
import { Clock, Siren, UserRound } from "lucide-react";

import { EmergencyWorkOrderModal } from "@/components/fs/work-orders/emergency-work-order-modal";
import { WorkOrderDetailModal } from "@/components/fs/work-orders/work-order-detail-modal";
import { Pill } from "@/components/pm/ui/pill";
import { useSelectedFsProperty } from "@/lib/fs/properties";
import {
  byScheduledTime,
  isEmergency,
  locationLabel,
  WO_STATUS_TONE,
  type FsWorkOrder,
} from "@/lib/fs/work-orders-data";
import { useFsWorkOrders } from "@/lib/fs/work-orders-store";

/** Thin rose bar — an emergency's progress is read at a glance, not compared. */
function ProgressBar({ value }: { value: number }) {
  return (
    <span className="flex shrink-0 flex-col items-end gap-1">
      <span
        role="img"
        aria-label={`${value}% complete`}
        className="block h-1.5 w-[84px] overflow-hidden rounded-full bg-rose-200"
      >
        <span
          className="block h-full rounded-full bg-[#e0554d] transition-[width]"
          style={{ width: `${value}%` }}
        />
      </span>
      <span className="text-[13px] font-semibold text-ink">{value}%</span>
    </span>
  );
}

function EmergencyCard({
  job,
  onOpen,
}: {
  job: FsWorkOrder;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-haspopup="dialog"
      className="flex w-full items-start gap-4 rounded-xl border border-rose-100 bg-rose-50/70 p-5 text-left transition-colors hover:bg-rose-50 focus-visible:ring-2 focus-visible:ring-[#e0554d]/40 focus-visible:outline-none"
    >
      <span
        aria-hidden="true"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rose-100 text-rose-600"
      >
        <Siren className="h-5 w-5" />
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2.5">
          <span className="text-[19px] font-bold text-ink">{job.title}</span>
          {/* Not the shared red Pill: its rose-50 fill vanishes against the
              card, and this badge has to stay legible on the tint. */}
          <span className="rounded-full bg-rose-100 px-2.5 py-1 text-xs font-semibold tracking-wide text-rose-700 uppercase">
            Critical
          </span>
        </span>

        <span className="mt-1 block truncate text-[15px] text-muted">
          {locationLabel(job, " - ")}
        </span>

        <span className="mt-2.5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-gray-600">
          <span className="flex items-center gap-1.5">
            <UserRound aria-hidden="true" className="h-4 w-4 text-gray-400" />
            {job.technician ?? (
              <span className="text-gray-500 italic">Unassigned</span>
            )}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock aria-hidden="true" className="h-4 w-4 text-gray-400" />
            {job.scheduledTime ?? (
              <span className="text-gray-500 italic">Not scheduled</span>
            )}
          </span>
          <Pill tone={WO_STATUS_TONE[job.status]}>{job.status}</Pill>
        </span>
      </span>

      <ProgressBar value={job.progress} />
    </button>
  );
}

/**
 * Every critical job on the site in one place. The list is short by design —
 * anything on it is meant to be cleared today, so it is stacked as cards rather
 * than a table and each one opens the work-order dialog to act on.
 */
export function FsEmergencyJobsView() {
  const propertyId = useSelectedFsProperty();
  const orders = useFsWorkOrders();

  const [openId, setOpenId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const active = useMemo(
    () =>
      orders
        .filter(
          (order) =>
            order.propertyId === propertyId &&
            isEmergency(order) &&
            order.status !== "Completed",
        )
        // Nobody on it yet is the most urgent state there is; the rest run in
        // the order they are booked for.
        .sort(
          (a, b) =>
            Number(a.technician !== null) - Number(b.technician !== null) ||
            byScheduledTime(a, b),
        ),
    [orders, propertyId],
  );

  // Read the open job back from the store: an action taken in the dialog can
  // move it off this list mid-view.
  const openOrder = orders.find((order) => order.id === openId) ?? null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[32px] leading-tight font-bold text-ink">
            Emergency Jobs
          </h1>
          <p className="mt-1 text-[15px] text-muted">
            Critical priority work management
          </p>
        </div>

        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-[#e0554d] px-5 py-2.5 text-[15px] font-semibold text-white transition-colors hover:bg-[#c9463f] focus-visible:ring-2 focus-visible:ring-[#e0554d]/40 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <Siren aria-hidden="true" className="h-[18px] w-[18px]" />
          Create Emergency WO
        </button>
      </div>

      <section>
        <h2 className="text-[13px] font-bold tracking-wide text-[#c9463f] uppercase">
          Active Emergencies ({active.length})
        </h2>

        {active.length === 0 ? (
          <p className="mt-4 rounded-xl border border-hairline bg-white px-6 py-16 text-center text-[15px] text-muted">
            No emergencies are open on this property.
          </p>
        ) : (
          <ul className="mt-4 space-y-4">
            {active.map((job) => (
              <li key={job.id}>
                <EmergencyCard job={job} onOpen={() => setOpenId(job.id)} />
              </li>
            ))}
          </ul>
        )}
      </section>

      {openOrder && (
        <WorkOrderDetailModal
          order={openOrder}
          onClose={() => setOpenId(null)}
        />
      )}

      {createOpen && (
        <EmergencyWorkOrderModal onClose={() => setCreateOpen(false)} />
      )}
    </div>
  );
}
