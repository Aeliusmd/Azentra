"use client";

import { useMemo, useState } from "react";
import { ChevronRight, Clock, MapPin, UserRound, Wrench } from "lucide-react";

import {
  AddNoteModal,
  AssignTechnicianModal,
  ChangePriorityModal,
} from "@/components/pm/maintenance/request-action-modals";
import { RequestDetailsModal } from "@/components/pm/maintenance/request-details-modal";
import { FilterSelect } from "@/components/pm/ui/filter-select";
import { Pill } from "@/components/pm/ui/pill";
import { SearchInput } from "@/components/ui/search-input";
import {
  BUILDINGS,
  PRIORITIES,
  PRIORITY_TONE,
  REQUEST_STATUSES,
  REQUEST_STATUS_TONE,
  maintenanceRequests as seed,
  type MaintenanceRequest,
  type Priority,
} from "@/lib/pm/maintenance-data";

type ActionKind = "priority" | "assign" | "note";

function Meta({
  icon: Icon,
  children,
}: {
  icon: typeof MapPin;
  children: React.ReactNode;
}) {
  return (
    <span className="flex items-center gap-1.5 text-[13px] text-muted">
      <Icon aria-hidden="true" className="h-3.5 w-3.5 text-gray-400" />
      {children}
    </span>
  );
}

export function MaintenanceView() {
  const [list, setList] = useState<MaintenanceRequest[]>(seed);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [building, setBuilding] = useState("");

  const [openId, setOpenId] = useState<string | null>(null);
  const [action, setAction] = useState<ActionKind | null>(null);

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return list.filter((request) => {
      if (status && request.status !== status) return false;
      if (priority && request.priority !== priority) return false;
      if (building && request.building !== building) return false;
      if (!term) return true;
      return (
        request.id.toLowerCase().includes(term) ||
        request.title.toLowerCase().includes(term) ||
        request.resident.toLowerCase().includes(term) ||
        request.unit.toLowerCase().includes(term) ||
        request.category.toLowerCase().includes(term)
      );
    });
  }, [list, query, status, priority, building]);

  const active = list.find((request) => request.id === openId) ?? null;

  /** Applies a change and drops back to the detail view. */
  function update(patch: (request: MaintenanceRequest) => MaintenanceRequest) {
    setList((current) =>
      current.map((request) => (request.id === openId ? patch(request) : request)),
    );
    setAction(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[32px] leading-tight font-bold text-ink">
            Maintenance Requests
          </h1>
          <p className="mt-1 text-[15px] text-muted">
            Manage and track all maintenance requests
          </p>
        </div>

        <SearchInput
          label="Search requests"
          placeholder="Search requests..."
          value={query}
          onChange={setQuery}
          className="w-full sm:w-[280px]"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="grid w-full grid-cols-1 gap-3 sm:w-auto sm:grid-cols-3">
          <FilterSelect
            label="Filter by status"
            options={REQUEST_STATUSES}
            value={status}
            onChange={setStatus}
            className="sm:w-[180px]"
          />
          <FilterSelect
            label="Filter by priority"
            options={PRIORITIES}
            value={priority}
            onChange={setPriority}
            className="sm:w-[150px]"
          />
          <FilterSelect
            label="Filter by building"
            options={BUILDINGS}
            value={building}
            onChange={setBuilding}
            className="sm:w-[150px]"
          />
        </div>

        <p className="text-[13px] text-gray-400">
          {visible.length} request{visible.length === 1 ? "" : "s"}
        </p>
      </div>

      {visible.length === 0 ? (
        <p className="rounded-lg border border-hairline bg-white px-6 py-12 text-center text-[15px] text-muted">
          No requests match your filters.
        </p>
      ) : (
        <ul className="space-y-4">
          {visible.map((request) => (
            <li key={request.id}>
              <button
                type="button"
                onClick={() => setOpenId(request.id)}
                className="flex w-full items-center gap-4 rounded-xl border border-hairline bg-white px-5 py-4 text-left transition-colors hover:bg-gray-50/70 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
              >
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs text-gray-400">
                      {request.id}
                    </span>
                    <Pill tone={PRIORITY_TONE[request.priority]}>
                      {request.priority}
                    </Pill>
                    <Pill tone={REQUEST_STATUS_TONE[request.status]}>
                      {request.status}
                    </Pill>
                  </span>

                  <span className="mt-2 block text-[15px] font-semibold text-ink">
                    {request.title}
                  </span>

                  <span className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1.5">
                    <Meta icon={MapPin}>
                      {request.unit}, {request.building}
                    </Meta>
                    <Meta icon={UserRound}>{request.resident}</Meta>
                    {request.technician && (
                      <Meta icon={Wrench}>{request.technician}</Meta>
                    )}
                    <Meta icon={Clock}>{request.createdAt}</Meta>
                  </span>
                </span>

                <ChevronRight
                  aria-hidden="true"
                  className="h-5 w-5 shrink-0 text-gray-300"
                />
              </button>
            </li>
          ))}
        </ul>
      )}

      {active && action === null && (
        <RequestDetailsModal
          request={active}
          onClose={() => setOpenId(null)}
          onChangePriority={() => setAction("priority")}
          onAssignTechnician={() => setAction("assign")}
          onAddNote={() => setAction("note")}
        />
      )}

      {active && action === "priority" && (
        <ChangePriorityModal
          request={active}
          onClose={() => setAction(null)}
          onSubmit={(next: Priority) =>
            update((request) => ({
              ...request,
              priority: next,
              timeline: [
                ...request.timeline,
                {
                  label: `Priority changed to ${next}`,
                  by: "by Property Manager",
                  at: request.createdAt,
                },
              ],
            }))
          }
        />
      )}

      {active && action === "assign" && (
        <AssignTechnicianModal
          request={active}
          onClose={() => setAction(null)}
          onSubmit={(technician) =>
            update((request) => ({
              ...request,
              technician,
              status: request.status === "Pending" ? "Assigned" : request.status,
              timeline: [
                ...request.timeline,
                {
                  label: `Assigned to ${technician}`,
                  by: "by Property Manager",
                  at: request.createdAt,
                },
              ],
            }))
          }
        />
      )}

      {active && action === "note" && (
        <AddNoteModal
          request={active}
          onClose={() => setAction(null)}
          onSubmit={(note) =>
            update((request) => ({
              ...request,
              notes: [...request.notes, note],
            }))
          }
        />
      )}
    </div>
  );
}
