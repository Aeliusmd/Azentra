"use client";

import { useMemo, useState } from "react";
import { Plus, Wrench } from "lucide-react";

import { NewRequestModal } from "@/components/ten/maintenance/new-request-modal";
import { RequestDetailModal } from "@/components/ten/maintenance/request-detail-modal";
import { RequestStatusPill, TenStatusPill } from "@/components/ten/ui/status-pill";
import { TenTabBar } from "@/components/ten/ui/tab-bar";
import { Card } from "@/components/ui/card";
import {
  CATEGORY_CHIP,
  CATEGORY_ICON,
  isFinishedRequest,
  isOpenRequest,
  isScheduledRequest,
  type RequestPriority,
  type TenMaintenanceRequest,
} from "@/lib/ten/maintenance-data";
import { useTenRequests } from "@/lib/ten/maintenance-store";

type Tab = "All" | "In Progress" | "Scheduled" | "Completed";

const TABS: Tab[] = ["All", "In Progress", "Scheduled", "Completed"];

/**
 * Which requests each tab covers.
 *
 * "In Progress" is every request the property still has open, not only the one
 * status of that name — a request sitting at `Submitted` is very much in
 * progress to the tenant who just raised it, and naming the tab after a single
 * status would leave a brand-new request findable only under "All".
 *
 * "Scheduled" is a slice of that, not a rival to it: the ones with a visit
 * booked. They overlap on purpose — lenses on one list, not buckets.
 */
function matchesTab(request: TenMaintenanceRequest, tab: Tab) {
  if (tab === "All") return true;
  if (tab === "In Progress") return isOpenRequest(request);
  if (tab === "Scheduled") return isScheduledRequest(request);
  return isFinishedRequest(request);
}

const PRIORITY_TONE: Record<RequestPriority, "rose" | "amber" | "green"> = {
  High: "rose",
  Medium: "amber",
  Low: "green",
};

/** One request, as the whole row — the card is the control that opens it. */
function RequestRow({
  request,
  onOpen,
}: {
  request: TenMaintenanceRequest;
  onOpen: () => void;
}) {
  const Icon = CATEGORY_ICON[request.category];

  return (
    <li>
      <Card className="transition-colors hover:bg-gray-50/70">
        <button
          type="button"
          onClick={onOpen}
          className="flex w-full items-center gap-4 px-4 py-4 text-left focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none sm:px-5"
        >
          <span
            aria-hidden="true"
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${CATEGORY_CHIP[request.category]}`}
          >
            <Icon className="h-5 w-5" />
          </span>

          <span className="min-w-0 flex-1">
            <span className="block text-[15px] font-bold text-ink">
              {request.id} · {request.category}
            </span>
            <span className="mt-0.5 block truncate text-[14px] text-muted">
              {request.description}
            </span>
          </span>

          <span className="hidden shrink-0 items-center gap-2 sm:flex">
            <TenStatusPill tone={PRIORITY_TONE[request.priority]}>
              {request.priority}
            </TenStatusPill>
            <RequestStatusPill status={request.status} />
          </span>
        </button>

        {/* Phones put the pills on their own line rather than crushing them. */}
        <div className="flex flex-wrap gap-2 px-4 pb-4 sm:hidden">
          <TenStatusPill tone={PRIORITY_TONE[request.priority]}>
            {request.priority}
          </TenStatusPill>
          <RequestStatusPill status={request.status} />
        </div>
      </Card>
    </li>
  );
}

/**
 * Every maintenance request on this unit, and the form to raise another.
 *
 * Scoped to the tenancy by construction: the list is the tenant's own requests,
 * with no property or unit filter that could widen it. Nothing here assigns a
 * technician, books a visit or edits a work order — a tenant reports, tracks
 * and signs off, and that is the whole of it.
 */
export function TenMaintenanceView() {
  const requests = useTenRequests();

  const [tab, setTab] = useState<Tab>("All");
  const [newOpen, setNewOpen] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);

  const visible = useMemo(
    () => requests.filter((request) => matchesTab(request, tab)),
    [requests, tab],
  );

  // Read live so the dialog follows a request confirmed inside it.
  const open = openId
    ? (requests.find((request) => request.id === openId) ?? null)
    : null;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[24px] leading-tight font-bold text-ink sm:text-[28px]">
            Maintenance
          </h1>
          <p className="mt-1 text-[14px] text-muted">
            Track and manage repair requests
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

      <TenTabBar
        label="Filter requests"
        value={tab}
        onChange={(id) => setTab(id as Tab)}
        tabs={TABS.map((id) => ({ id, label: id }))}
      />

      {visible.length === 0 ? (
        <Card className="px-6 py-16 text-center">
          <span
            aria-hidden="true"
            className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#eef3f9] text-[#5b7f9c]"
          >
            <Wrench className="h-5 w-5" />
          </span>
          <p className="mt-4 text-[17px] font-semibold text-ink">
            {tab === "All" ? "No maintenance requests yet" : "Nothing here"}
          </p>
          <p className="mx-auto mt-1 max-w-[420px] text-[15px] text-muted">
            {tab === "All"
              ? "When something needs fixing in your apartment, raise a request and we will take it from there."
              : "Try a different filter."}
          </p>
        </Card>
      ) : (
        <ul className="space-y-3">
          {visible.map((request) => (
            <RequestRow
              key={request.id}
              request={request}
              onOpen={() => setOpenId(request.id)}
            />
          ))}
        </ul>
      )}

      {newOpen && <NewRequestModal onClose={() => setNewOpen(false)} />}
      {open && (
        <RequestDetailModal request={open} onClose={() => setOpenId(null)} />
      )}
    </div>
  );
}
