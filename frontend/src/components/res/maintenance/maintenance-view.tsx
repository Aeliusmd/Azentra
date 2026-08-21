"use client";

import { useMemo, useState } from "react";
import { CalendarDays, Plus, UserRound } from "lucide-react";

import { NewRequestModal } from "@/components/res/maintenance/new-request-modal";
import { RequestStatusPill } from "@/components/res/ui/status-pill";
import { ResTabBar } from "@/components/res/ui/tab-bar";
import { Card } from "@/components/ui/card";
import { clockTime, longDate } from "@/lib/res/format";
import {
  isFinishedRequest,
  PRIORITY_DOT,
  requestDate,
  requestProgress,
  type MaintenanceRequest,
} from "@/lib/res/maintenance-data";
import { useResRequests } from "@/lib/res/maintenance-store";

type Tab = "All" | "In Progress" | "Scheduled" | "Completed";

const TABS: Tab[] = ["All", "In Progress", "Scheduled", "Completed"];

/**
 * Which requests each tab covers.
 *
 * "Scheduled" reads as "someone is booked in", which covers a request that has
 * a technician against it but has not started — a resident does not distinguish
 * between the two, and neither should the tab.
 */
function matchesTab(request: MaintenanceRequest, tab: Tab) {
  if (tab === "All") return true;
  if (tab === "In Progress") return request.status === "In Progress";
  if (tab === "Completed") return isFinishedRequest(request);
  return (
    request.status === "Scheduled" || request.status === "Technician Assigned"
  );
}

function RequestCard({ request }: { request: MaintenanceRequest }) {
  const progress = requestProgress(request.status);

  return (
    <li>
      <Card className="p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span
            aria-hidden="true"
            className={`h-2.5 w-2.5 shrink-0 rounded-full ${PRIORITY_DOT[request.priority]}`}
          />
          <span className="text-[15px] font-bold text-ink">{request.id}</span>
          <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[12px] font-medium text-gray-600">
            {request.category}
          </span>
          <RequestStatusPill status={request.status} />
          <span className="sr-only">{request.priority} priority</span>
        </div>

        <p className="mt-2.5 text-[14px] text-ink">{request.description}</p>

        <div className="mt-2.5 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[13px] text-muted">
          <span className="flex items-center gap-1.5">
            <CalendarDays aria-hidden="true" className="h-4 w-4 text-gray-400" />
            {longDate(requestDate(request))} - {clockTime(request.time)}
          </span>
          {request.technician && (
            <span className="flex items-center gap-1.5">
              <UserRound aria-hidden="true" className="h-4 w-4 text-gray-400" />
              {request.technician}
            </span>
          )}
        </div>

        {/* Only work actually underway has a bar worth reading. */}
        {request.status === "In Progress" && (
          <div className="mt-3 flex items-center gap-3">
            <div
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${request.id} progress`}
              className="h-1.5 max-w-[240px] flex-1 overflow-hidden rounded-full bg-gray-100"
            >
              <div
                className="h-full rounded-full bg-[#1b3a5c]"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-[13px] text-muted">{progress}%</span>
          </div>
        )}
      </Card>
    </li>
  );
}

/**
 * Every maintenance request on this unit, and the form to raise another.
 *
 * Scoped to the household by construction: the list is the resident's own
 * requests, with no property or unit filter to widen it.
 */
export function ResMaintenanceView() {
  const requests = useResRequests();
  const [tab, setTab] = useState<Tab>("All");
  const [newOpen, setNewOpen] = useState(false);

  const visible = useMemo(
    () => requests.filter((request) => matchesTab(request, tab)),
    [requests, tab],
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[24px] leading-tight font-bold text-ink sm:text-[28px]">
            Maintenance
          </h1>
          <p className="mt-1 text-[14px] text-muted">
            Request and track maintenance for your apartment
          </p>
        </div>

        <button
          type="button"
          onClick={() => setNewOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <Plus aria-hidden="true" className="h-4 w-4" />
          New Request
        </button>
      </div>

      <ResTabBar
        label="Filter requests"
        value={tab}
        onChange={(id) => setTab(id as Tab)}
        tabs={TABS.map((id) => ({ id, label: id }))}
      />

      {visible.length === 0 ? (
        <Card className="px-6 py-14 text-center">
          <p className="text-[15px] font-semibold text-ink">
            Nothing here{tab === "All" ? "" : ` under ${tab}`}
          </p>
          <p className="mt-1 text-[14px] text-muted">
            {tab === "All"
              ? "You have not raised a maintenance request yet."
              : "Try another tab, or raise a new request."}
          </p>
        </Card>
      ) : (
        <ul className="space-y-4">
          {visible.map((request) => (
            <RequestCard key={request.id} request={request} />
          ))}
        </ul>
      )}

      {newOpen && <NewRequestModal onClose={() => setNewOpen(false)} />}
    </div>
  );
}
