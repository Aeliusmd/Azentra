"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";

import { CreateScheduledJobModal } from "@/components/fs/job-scheduling/create-scheduled-job-modal";
import { FsFilterChips } from "@/components/fs/ui/filter-chips";
import { FsPagination } from "@/components/fs/ui/pagination";
import { FsRecordRow } from "@/components/fs/ui/record-row";
import { WorkOrderDetailModal } from "@/components/fs/work-orders/work-order-detail-modal";
import { FilterSelect } from "@/components/pm/ui/filter-select";
import { Pill } from "@/components/pm/ui/pill";
import { Card } from "@/components/ui/card";
import { SearchInput } from "@/components/ui/search-input";
import {
  bySlot,
  inRange,
  JOB_TYPES,
  jobTypeOf,
  SCHEDULE_RANGES,
  type FsScheduleRange,
} from "@/lib/fs/job-scheduling-data";
import { useSelectedFsProperty } from "@/lib/fs/properties";
import { techniciansAt } from "@/lib/fs/technicians-data";
import {
  locationLabel,
  WO_PRIORITY_TONE,
  WO_STATUS_TONE,
} from "@/lib/fs/work-orders-data";
import { useFsWorkOrders } from "@/lib/fs/work-orders-store";

const HEADINGS = [
  "Job",
  "Type",
  "Location",
  "Technician",
  "Priority",
  "Status",
  "Date",
  "Time",
];

const PAGE_SIZE = 12;

/**
 * The supervisor's planning board: every job on the site's calendar, plus the
 * ones still waiting for a slot. Rows open the work-order dialog, which is
 * where rescheduling and reassignment already live.
 */
export function FsJobSchedulingView() {
  // Scoped to the property the supervisor is looking at, so a job booked here
  // lands on the board it was created from.
  const propertyId = useSelectedFsProperty();
  const orders = useFsWorkOrders();
  const roster = techniciansAt(propertyId);

  const [range, setRange] = useState<FsScheduleRange>(SCHEDULE_RANGES[0]);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [technician, setTechnician] = useState("");
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();

    return orders
      .filter((order) => {
        if (order.propertyId !== propertyId) return false;
        if (!inRange(order, range)) return false;
        if (type && jobTypeOf(order) !== type) return false;
        if (technician && order.technician !== technician) return false;
        if (!term) return true;

        return [
          order.id,
          order.title,
          order.building,
          order.location,
          order.technician ?? "",
        ]
          .join(" ")
          .toLowerCase()
          .includes(term);
      })
      .sort(bySlot);
  }, [orders, propertyId, range, type, technician, search]);

  const pageCount = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const rows = visible.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  // Any filter change starts the list again from the top.
  function withReset<T>(setter: (value: T) => void) {
    return (value: T) => {
      setter(value);
      setPage(1);
    };
  }

  const openOrder = orders.find((order) => order.id === openId) ?? null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[32px] leading-tight font-bold text-ink">
            Job Scheduling
          </h1>
          <p className="mt-1 text-[15px] text-muted">
            Create and manage planned maintenance jobs
          </p>
        </div>

        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-[15px] font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <Plus aria-hidden="true" className="h-[18px] w-[18px]" />
          Create Scheduled Job
        </button>
      </div>

      <Card className="space-y-4 p-5">
        <SearchInput
          value={search}
          onChange={withReset(setSearch)}
          placeholder="Search scheduled jobs..."
          label="Search scheduled jobs"
          className="w-full sm:max-w-[370px]"
        />

        <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
          <FsFilterChips
            label="Filter by schedule window"
            options={SCHEDULE_RANGES}
            value={range}
            onChange={withReset((value: string) =>
              setRange(value as FsScheduleRange),
            )}
          />

          <span aria-hidden="true" className="h-6 w-px bg-hairline" />

          <FilterSelect
            label="Filter by job type"
            value={type}
            onChange={withReset(setType)}
            options={JOB_TYPES}
            allLabel="All types"
            className="w-[190px]"
          />
          <FilterSelect
            label="Filter by technician"
            value={technician}
            onChange={withReset(setTechnician)}
            options={roster.map((item) => item.name)}
            allLabel="All technicians"
            className="w-[190px]"
          />

          <p className="ml-auto text-[13px] text-muted">
            {visible.length} job{visible.length === 1 ? "" : "s"}
          </p>
        </div>
      </Card>

      <Card>
        {/* Phones get the stacked list below; the table needs the width. */}
        <ul className="divide-y divide-hairline md:hidden">
          {rows.map((order) => (
            <FsRecordRow
              key={order.id}
              id={order.id}
              title={order.title}
              subtitle={locationLabel(order, " - ")}
              pills={[
                { tone: WO_PRIORITY_TONE[order.priority], label: order.priority },
                { tone: WO_STATUS_TONE[order.status], label: order.status },
              ]}
              meta={[
                { label: "Type", value: jobTypeOf(order) },
                {
                  label: "Technician",
                  value: order.technician ?? "Unassigned",
                },
                {
                  label: "Scheduled",
                  value: order.scheduledDate
                    ? `${order.scheduledDate} ${order.scheduledTime}`
                    : "Not booked",
                },
              ]}
              onOpen={() => setOpenId(order.id)}
            />
          ))}
        </ul>

        <div className="relative hidden overflow-x-auto md:block">
          <table className="w-full min-w-[980px] text-left">
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
              {rows.map((order) => (
                <tr
                  key={order.id}
                  onClick={() => setOpenId(order.id)}
                  className="cursor-pointer transition-colors hover:bg-gray-50/70"
                >
                  <th
                    scope="row"
                    className="max-w-[250px] px-4 py-3.5 text-left font-normal"
                  >
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        setOpenId(order.id);
                      }}
                      className="block max-w-full truncate text-[15px] font-semibold text-ink transition-colors hover:text-brand focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
                    >
                      {order.title}
                      <span className="sr-only"> — view job</span>
                    </button>
                    <span className="mt-0.5 block font-mono text-[12px] text-gray-400">
                      {order.id}
                    </span>
                  </th>
                  <td className="px-4 py-3.5 text-[13px] whitespace-nowrap text-gray-600">
                    {jobTypeOf(order)}
                  </td>
                  <td className="max-w-[180px] truncate px-4 py-3.5 text-[13px] text-gray-600">
                    {locationLabel(order, " - ")}
                  </td>
                  <td className="px-4 py-3.5 text-[13px] whitespace-nowrap">
                    {order.technician ? (
                      <span className="text-gray-600">{order.technician}</span>
                    ) : (
                      <span className="text-gray-400 italic">Unassigned</span>
                    )}
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
                    {order.scheduledDate ?? (
                      <span className="text-gray-400 italic">Not booked</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-[13px] whitespace-nowrap text-gray-600">
                    {order.scheduledTime ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {visible.length === 0 ? (
          <p className="px-6 py-16 text-center text-[15px] text-muted">
            No jobs match these filters.
          </p>
        ) : (
          <FsPagination
            page={current}
            pageCount={pageCount}
            total={visible.length}
            pageSize={PAGE_SIZE}
            onChange={setPage}
            noun="jobs"
          />
        )}
      </Card>

      {openOrder && (
        <WorkOrderDetailModal
          order={openOrder}
          onClose={() => setOpenId(null)}
        />
      )}

      {createOpen && (
        <CreateScheduledJobModal onClose={() => setCreateOpen(false)} />
      )}
    </div>
  );
}
