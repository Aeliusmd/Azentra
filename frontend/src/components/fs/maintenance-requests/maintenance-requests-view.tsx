"use client";

import { useMemo, useState } from "react";

import { RequestDetailModal } from "@/components/fs/maintenance-requests/request-detail-modal";
import { FsFilterChips } from "@/components/fs/ui/filter-chips";
import { Pill } from "@/components/pm/ui/pill";
import { Card } from "@/components/ui/card";
import {
  ageLabel,
  byNewest,
  maintenanceRequests,
  MR_PRIORITY_TONE,
  MR_STATUS_TONE,
  MR_STATUSES,
} from "@/lib/fs/maintenance-requests-data";

const FILTERS = ["All", ...MR_STATUSES] as const;

const HEADINGS = [
  "ID",
  "Title",
  "Unit",
  "Resident",
  "Priority",
  "Status",
  "Technician",
  "Age",
  "Due Date",
];

export function FsMaintenanceRequestsView() {
  const [status, setStatus] = useState<string>("All");
  const [openId, setOpenId] = useState<string | null>(null);

  const visible = useMemo(
    () =>
      maintenanceRequests
        .filter((request) => status === "All" || request.status === status)
        .sort(byNewest),
    [status],
  );

  const openRequest =
    maintenanceRequests.find((request) => request.id === openId) ?? null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[32px] leading-tight font-bold text-ink">
          Maintenance Requests
        </h1>
        <p className="mt-1 text-[15px] text-muted">
          Monitor requests at field-operation stage
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <FsFilterChips
          label="Filter requests by status"
          options={FILTERS}
          value={status}
          onChange={setStatus}
        />
        <p className="text-[13px] text-muted">
          {visible.length} request{visible.length === 1 ? "" : "s"}
        </p>
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
                    className="px-5 py-3.5 text-xs font-semibold tracking-wide text-gray-500 uppercase"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-hairline">
              {visible.map((request) => (
                <tr
                  key={request.id}
                  onClick={() => setOpenId(request.id)}
                  className="cursor-pointer transition-colors hover:bg-gray-50/70"
                >
                  <th scope="row" className="px-5 py-3.5 text-left font-normal">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        setOpenId(request.id);
                      }}
                      className="font-mono text-[13px] text-gray-500 transition-colors hover:text-ink focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
                    >
                      {request.id}
                      <span className="sr-only"> — view request</span>
                    </button>
                  </th>
                  <td className="max-w-[220px] truncate px-5 py-3.5 text-[15px] font-semibold text-ink">
                    {request.title}
                  </td>
                  <td className="px-5 py-3.5 text-[13px] whitespace-nowrap text-gray-600">
                    {request.unit}
                  </td>
                  <td className="px-5 py-3.5 text-[13px] whitespace-nowrap text-gray-600">
                    {request.resident}
                  </td>
                  <td className="px-5 py-3.5">
                    <Pill tone={MR_PRIORITY_TONE[request.priority]}>
                      {request.priority}
                    </Pill>
                  </td>
                  <td className="px-5 py-3.5">
                    <Pill tone={MR_STATUS_TONE[request.status]}>
                      {request.status}
                    </Pill>
                  </td>
                  <td className="px-5 py-3.5 text-[13px] whitespace-nowrap text-gray-600">
                    {request.technician ?? (
                      <span className="text-gray-400">–</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-[13px] whitespace-nowrap text-gray-600">
                    {ageLabel(request.submittedAt)}
                  </td>
                  <td className="px-5 py-3.5 text-[13px] whitespace-nowrap text-gray-600">
                    {request.dueDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {visible.length === 0 && (
          <p className="px-6 py-16 text-center text-[15px] text-muted">
            No requests with this status.
          </p>
        )}
      </Card>

      {openRequest && (
        <RequestDetailModal
          request={openRequest}
          onClose={() => setOpenId(null)}
        />
      )}
    </div>
  );
}
