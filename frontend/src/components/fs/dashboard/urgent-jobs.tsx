"use client";

import { useState } from "react";
import Link from "next/link";
import { Siren } from "lucide-react";

import { WorkOrderDetailModal } from "@/components/fs/work-orders/work-order-detail-modal";
import { Pill } from "@/components/pm/ui/pill";
import { Card, CardHeader } from "@/components/ui/card";
import { FS_BASE } from "@/lib/fs/nav";
import {
  locationLabel,
  WO_PRIORITY_TONE,
  type FsWorkOrder,
} from "@/lib/fs/work-orders-data";
import { useFsWorkOrders } from "@/lib/fs/work-orders-store";

/** Critical and high-priority jobs still open, most urgent first. */
export function UrgentJobs({ jobs }: { jobs: FsWorkOrder[] }) {
  const orders = useFsWorkOrders();
  const [openId, setOpenId] = useState<string | null>(null);

  // Read the open job back from the store rather than the filtered list: an
  // action taken in the dialog can move it out of "urgent" mid-view.
  const openOrder = orders.find((order) => order.id === openId) ?? null;

  return (
    <>
      <Card className="p-5">
        <CardHeader
          title="Urgent Jobs"
          action={
            <Link
              href={`${FS_BASE}/work-orders`}
              className="text-[13px] font-medium text-link transition-colors hover:text-link-dark"
            >
              View all
            </Link>
          }
        />

        {jobs.length === 0 ? (
          <p className="py-10 text-center text-[15px] text-muted">
            Nothing urgent is open right now.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {jobs.map((job) => (
              <li key={job.id}>
                <button
                  type="button"
                  onClick={() => setOpenId(job.id)}
                  aria-haspopup="dialog"
                  className="flex w-full items-center gap-3 rounded-lg border border-hairline p-3.5 text-left transition-colors hover:bg-gray-50/70 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
                >
                  <span
                    aria-hidden="true"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-600"
                  >
                    <Siren className="h-[18px] w-[18px]" />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[15px] font-semibold text-ink">
                      {job.title}
                    </span>
                    <span className="mt-0.5 block truncate text-[13px] text-muted">
                      {[
                        locationLabel(job),
                        job.technician
                          ? `Assigned: ${job.technician}`
                          : "Unassigned",
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </span>
                  </span>

                  <Pill tone={WO_PRIORITY_TONE[job.priority]}>
                    {job.priority}
                  </Pill>
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {openOrder && (
        <WorkOrderDetailModal
          order={openOrder}
          onClose={() => setOpenId(null)}
        />
      )}
    </>
  );
}
