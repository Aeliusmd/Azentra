"use client";

import { useMemo, useState } from "react";
import { CircleAlert, Plus } from "lucide-react";

import { ComplaintDetailModal } from "@/components/ten/complaints/complaint-detail-modal";
import { NewComplaintModal } from "@/components/ten/complaints/new-complaint-modal";
import { TenStatusPill, type TenTone } from "@/components/ten/ui/status-pill";
import { TenTabBar } from "@/components/ten/ui/tab-bar";
import { Card } from "@/components/ui/card";
import {
  CATEGORY_ICON,
  type ComplaintStatus,
  type TenComplaint,
} from "@/lib/ten/complaints-data";
import { useTenComplaints } from "@/lib/ten/complaints-store";

type Tab = "All" | "Under Review" | "In Progress" | "Resolved";

const TABS: Tab[] = ["All", "Under Review", "In Progress", "Resolved"];

const STATUS_TONE: Record<ComplaintStatus, TenTone> = {
  Submitted: "slate",
  "Under Review": "amber",
  "In Progress": "blue",
  Resolved: "green",
  Closed: "slate",
};

/**
 * Which complaints each tab covers.
 *
 * "Under Review" takes in a freshly `Submitted` complaint as well as one
 * formally under review: to the tenant who just raised it, both mean nobody has
 * come back yet, and naming the tab after one status would leave a brand-new
 * complaint findable only under "All".
 *
 * "Resolved" likewise covers `Closed`, which is the same outcome with the file
 * shut.
 */
function matchesTab(complaint: TenComplaint, tab: Tab) {
  if (tab === "All") return true;
  if (tab === "Under Review")
    return complaint.status === "Submitted" || complaint.status === "Under Review";
  if (tab === "In Progress") return complaint.status === "In Progress";
  return complaint.status === "Resolved" || complaint.status === "Closed";
}

/** One complaint, as the whole row — the card is the control that opens it. */
function ComplaintRow({
  complaint,
  onOpen,
}: {
  complaint: TenComplaint;
  onOpen: () => void;
}) {
  const Icon = CATEGORY_ICON[complaint.category];

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
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-500"
          >
            <Icon className="h-5 w-5" />
          </span>

          <span className="min-w-0 flex-1">
            <span className="block text-[15px] font-bold text-ink">
              {complaint.id} · {complaint.category}
            </span>
            <span className="mt-0.5 block truncate text-[14px] text-muted">
              {complaint.description}
            </span>
          </span>

          <span className="hidden shrink-0 sm:block">
            <TenStatusPill tone={STATUS_TONE[complaint.status]}>
              {complaint.status}
            </TenStatusPill>
          </span>
        </button>

        {/* Phones put the badge on its own line rather than crushing it. */}
        <div className="px-4 pb-4 sm:hidden">
          <TenStatusPill tone={STATUS_TONE[complaint.status]}>
            {complaint.status}
          </TenStatusPill>
        </div>
      </Card>
    </li>
  );
}

/**
 * Every complaint this tenant has raised, and the form to raise another.
 *
 * Scoped to the account by construction: the list is the tenant's own, with no
 * filter that could widen it to a neighbour's. Nothing here changes a status or
 * writes a response — a tenant reports and follows, and the property answers.
 */
export function TenComplaintsView() {
  const complaints = useTenComplaints();

  const [tab, setTab] = useState<Tab>("All");
  const [newOpen, setNewOpen] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);

  const visible = useMemo(
    () => complaints.filter((complaint) => matchesTab(complaint, tab)),
    [complaints, tab],
  );

  const open = openId
    ? (complaints.find((complaint) => complaint.id === openId) ?? null)
    : null;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[24px] leading-tight font-bold text-ink sm:text-[28px]">
            Complaints
          </h1>
          <p className="mt-1 text-[14px] text-muted">
            Submit and track community complaints
          </p>
        </div>

        <button
          type="button"
          onClick={() => setNewOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-rose-500 px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-rose-600 focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <Plus aria-hidden="true" className="h-4 w-4" />
          New Complaint
        </button>
      </div>

      <TenTabBar
        label="Filter complaints"
        value={tab}
        onChange={(id) => setTab(id as Tab)}
        tabs={TABS.map((id) => ({ id, label: id }))}
      />

      {visible.length === 0 ? (
        <Card className="px-6 py-16 text-center">
          <span
            aria-hidden="true"
            className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-500"
          >
            <CircleAlert className="h-5 w-5" />
          </span>
          <p className="mt-4 text-[17px] font-semibold text-ink">
            {tab === "All" ? "No complaints yet" : "Nothing here"}
          </p>
          <p className="mx-auto mt-1 max-w-[420px] text-[15px] text-muted">
            {tab === "All"
              ? "If something about the building or the community is not right, let the property know and you can follow it here."
              : "Try a different filter."}
          </p>
        </Card>
      ) : (
        <ul className="space-y-3">
          {visible.map((complaint) => (
            <ComplaintRow
              key={complaint.id}
              complaint={complaint}
              onOpen={() => setOpenId(complaint.id)}
            />
          ))}
        </ul>
      )}

      {newOpen && <NewComplaintModal onClose={() => setNewOpen(false)} />}
      {open && (
        <ComplaintDetailModal complaint={open} onClose={() => setOpenId(null)} />
      )}
    </div>
  );
}
