"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronRight, Plus, X } from "lucide-react";

import { FsFilterChips } from "@/components/fs/ui/filter-chips";
import { FsPagination } from "@/components/fs/ui/pagination";
import { CreateWorkOrderModal } from "@/components/fs/work-orders/create-work-order-modal";
import { WorkOrderDetailModal } from "@/components/fs/work-orders/work-order-detail-modal";
import { FilterSelect } from "@/components/pm/ui/filter-select";
import { Pill } from "@/components/pm/ui/pill";
import { Card } from "@/components/ui/card";
import { SearchInput } from "@/components/ui/search-input";
import { TODAY } from "@/lib/fs/dashboard-data";
import { PROPERTY_NAMES } from "@/lib/fs/properties";
import { technicians } from "@/lib/fs/technicians-data";
import {
  byUrgency,
  locationLabel,
  minutesOf,
  WO_PRIORITIES,
  WO_PRIORITY_TONE,
  WO_STATUSES,
  WO_STATUS_TONE,
  type FsWorkOrder,
} from "@/lib/fs/work-orders-data";
import { useFsWorkOrders } from "@/lib/fs/work-orders-store";

const STATUS_FILTERS = ["All", ...WO_STATUSES] as const;
const PRIORITY_FILTERS = ["All", ...WO_PRIORITIES] as const;

const SORTS = ["Priority", "Scheduled", "Due Date", "Status", "Progress"];

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

const PAGE_SIZE = 12;

function ProgressBar({ value }: { value: number }) {
  return (
    <span
      role="img"
      aria-label={`${value}% complete`}
      className="block h-1.5 w-[92px] overflow-hidden rounded-full bg-gray-200"
    >
      <span
        className="block h-full rounded-full bg-brand transition-[width]"
        style={{ width: `${value}%` }}
      />
    </span>
  );
}

/** Sort comparators — the list defaults to most urgent first. */
function comparator(sort: string) {
  if (sort === "Scheduled")
    return (a: FsWorkOrder, b: FsWorkOrder) =>
      (a.scheduledDate ?? "9999").localeCompare(b.scheduledDate ?? "9999") ||
      minutesOf(a.scheduledTime) - minutesOf(b.scheduledTime);

  if (sort === "Due Date")
    return (a: FsWorkOrder, b: FsWorkOrder) => a.dueDate.localeCompare(b.dueDate);

  if (sort === "Status")
    return (a: FsWorkOrder, b: FsWorkOrder) =>
      WO_STATUSES.indexOf(a.status) - WO_STATUSES.indexOf(b.status);

  if (sort === "Progress")
    return (a: FsWorkOrder, b: FsWorkOrder) => b.progress - a.progress;

  return byUrgency;
}

export function FsWorkOrdersView() {
  const orders = useFsWorkOrders();

  // `?date=` is how the dashboard's Today's Schedule hands the day over.
  const dateParam = useSearchParams().get("date") ?? "";

  const [scheduledOn, setScheduledOn] = useState(dateParam);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("All");
  const [priority, setPriority] = useState<string>("All");
  const [property, setProperty] = useState("");
  const [technician, setTechnician] = useState("");
  const [sort, setSort] = useState(SORTS[0]);
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  // Arriving with a new day in the URL re-applies it over whatever was set —
  // adjusted during render rather than in an effect, so no extra pass.
  const [lastDateParam, setLastDateParam] = useState(dateParam);
  if (dateParam !== lastDateParam) {
    setLastDateParam(dateParam);
    setScheduledOn(dateParam);
    setPage(1);
  }

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();

    return orders
      .filter((order) => {
        if (status !== "All" && order.status !== status) return false;
        if (priority !== "All" && order.priority !== priority) return false;
        if (property && order.property !== property) return false;
        if (technician && order.technician !== technician) return false;
        if (scheduledOn && order.scheduledDate !== scheduledOn) return false;
        if (!term) return true;

        return [
          order.id,
          order.title,
          order.building,
          order.location,
          order.technician ?? "",
          order.category,
        ]
          .join(" ")
          .toLowerCase()
          .includes(term);
      })
      .sort(comparator(sort));
  }, [orders, search, status, priority, property, technician, scheduledOn, sort]);

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
            Work Orders
          </h1>
          <p className="mt-1 text-[15px] text-muted">
            Manage, assign, and track all work orders
          </p>
        </div>

        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-[15px] font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <Plus aria-hidden="true" className="h-[18px] w-[18px]" />
          Create Work Order
        </button>
      </div>

      <Card className="space-y-4 p-5">
        <div className="flex flex-wrap items-center gap-3">
          <SearchInput
            value={search}
            onChange={withReset(setSearch)}
            placeholder="Search work orders..."
            label="Search work orders"
            className="min-w-[240px] flex-1"
          />
          <FilterSelect
            label="Sort by"
            value={sort}
            onChange={(value) => setSort(value || SORTS[0])}
            options={SORTS}
            allLabel={SORTS[0]}
            className="w-[170px]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
          <FsFilterChips
            label="Filter by status"
            options={STATUS_FILTERS}
            value={status}
            onChange={withReset(setStatus)}
          />

          <span aria-hidden="true" className="h-6 w-px bg-hairline" />

          <FsFilterChips
            label="Filter by priority"
            tone="amber"
            options={PRIORITY_FILTERS}
            value={priority}
            onChange={withReset(setPriority)}
          />

          <span aria-hidden="true" className="h-6 w-px bg-hairline" />

          <FilterSelect
            label="Filter by property"
            value={property}
            onChange={withReset(setProperty)}
            options={PROPERTY_NAMES}
            className="w-[190px]"
          />
          <FilterSelect
            label="Filter by technician"
            value={technician}
            onChange={withReset(setTechnician)}
            options={technicians.map((item) => item.name)}
            className="w-[190px]"
          />

          {scheduledOn && (
            <button
              type="button"
              onClick={() => setScheduledOn("")}
              className="flex items-center gap-1.5 rounded-lg bg-[#eef3f9] px-3 py-1.5 text-[13px] font-medium text-[#1b3a5c] transition-colors hover:bg-[#e2ebf4] focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
            >
              Scheduled{" "}
              {scheduledOn === TODAY ? "today" : `on ${scheduledOn}`}
              <X aria-hidden="true" className="h-3.5 w-3.5" />
              <span className="sr-only">Clear the scheduled date filter</span>
            </button>
          )}

          <p className="ml-auto text-[13px] text-muted">
            {visible.length} work order{visible.length === 1 ? "" : "s"}
          </p>
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1080px] text-left">
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
                <th scope="col" className="px-5 py-3.5">
                  <span className="sr-only">View</span>
                </th>
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
                    className="px-5 py-3.5 text-left font-mono text-[13px] font-normal whitespace-nowrap text-gray-500"
                  >
                    {order.id}
                  </th>
                  <td className="max-w-[260px] truncate px-5 py-3.5 text-[15px] font-semibold text-ink">
                    {order.title}
                  </td>
                  <td className="px-5 py-3.5 text-[13px] whitespace-nowrap text-gray-600">
                    {locationLabel(order, " - ")}
                  </td>
                  <td className="px-5 py-3.5 text-[13px] whitespace-nowrap">
                    {order.technician ? (
                      <span className="text-gray-600">{order.technician}</span>
                    ) : (
                      <span className="text-gray-400 italic">Unassigned</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <Pill tone={WO_PRIORITY_TONE[order.priority]}>
                      {order.priority}
                    </Pill>
                  </td>
                  <td className="px-5 py-3.5">
                    <Pill tone={WO_STATUS_TONE[order.status]}>
                      {order.status}
                    </Pill>
                  </td>
                  <td className="px-5 py-3.5">
                    <ProgressBar value={order.progress} />
                  </td>
                  <td className="px-5 py-3.5 text-[13px] whitespace-nowrap text-gray-600">
                    {order.scheduledDate ?? "—"}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        setOpenId(order.id);
                      }}
                      aria-label={`View ${order.id}`}
                      className="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-ink focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
                    >
                      <ChevronRight aria-hidden="true" className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {visible.length === 0 ? (
          <p className="px-6 py-16 text-center text-[15px] text-muted">
            No work orders match these filters.
          </p>
        ) : (
          <FsPagination
            page={current}
            pageCount={pageCount}
            total={visible.length}
            pageSize={PAGE_SIZE}
            onChange={setPage}
            noun="work orders"
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
        <CreateWorkOrderModal onClose={() => setCreateOpen(false)} />
      )}
    </div>
  );
}
