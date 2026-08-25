"use client";

import { useMemo, useState } from "react";
import { Frown, Plus } from "lucide-react";

import { ComplaintDetailModal } from "@/components/res/complaints/complaint-detail-modal";
import { NewComplaintModal } from "@/components/res/complaints/new-complaint-modal";
import { ResStatusPill, type ResTone } from "@/components/res/ui/status-pill";
import { ResTabBar } from "@/components/res/ui/tab-bar";
import { Card } from "@/components/ui/card";
import {
  resolvedOn,
  submittedOn,
  type Complaint,
  type ComplaintStatus,
} from "@/lib/res/complaints-data";
import { useResComplaints } from "@/lib/res/complaints-store";
import { longDate } from "@/lib/res/format";

type Tab = "All" | "Under Review" | "In Progress" | "Resolved";

const TABS: Tab[] = ["All", "Under Review", "In Progress", "Resolved"];

const STATUS_TONE: Record<ComplaintStatus, ResTone> = {
  Submitted: "slate",
  "Under Review": "blue",
  "In Progress": "blue",
  Resolved: "green",
  Closed: "slate",
};

/**
 * Which complaints each tab covers.
 *
 * A freshly raised complaint sits under "Under Review" as well as its own
 * status: to a resident, "submitted" and "being looked at" are the same
 * waiting room, and a complaint that appeared under no tab at all would look
 * lost.
 */
function matchesTab(complaint: Complaint, tab: Tab) {
  if (tab === "All") return true;
  if (tab === "Under Review") {
    return complaint.status === "Under Review" || complaint.status === "Submitted";
  }
  if (tab === "In Progress") return complaint.status === "In Progress";
  return complaint.status === "Resolved" || complaint.status === "Closed";
}

function ComplaintCard({
  complaint,
  onOpen,
}: {
  complaint: Complaint;
  onOpen: () => void;
}) {
  const resolved = resolvedOn(complaint);

  return (
    <li>
      <Card>
        <button
          type="button"
          onClick={onOpen}
          aria-haspopup="dialog"
          className="flex w-full gap-3 px-4 py-4 text-left transition-colors hover:bg-gray-50/70 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none sm:gap-4 sm:px-5"
        >
          <span
            aria-hidden="true"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600"
          >
            <Frown className="h-5 w-5" />
          </span>

          <span className="min-w-0 flex-1">
            <span className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="text-[15px] font-bold text-ink">
                {complaint.id}
              </span>
              <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[12px] font-medium text-gray-600">
                {complaint.category}
              </span>
              <ResStatusPill tone={STATUS_TONE[complaint.status]}>
                {complaint.status}
              </ResStatusPill>
            </span>

            <span className="mt-2.5 block text-[15px] text-ink">
              {complaint.description}
            </span>

            <span className="mt-2.5 block text-[13px] text-muted">
              Submitted {longDate(submittedOn(complaint))}
              {resolved ? ` · Resolved ${longDate(resolved)}` : ""}
            </span>
          </span>
        </button>
      </Card>
    </li>
  );
}

/**
 * Complaints this household has raised.
 *
 * Their own only — one resident's complaint about another is not something the
 * other gets to read here.
 */
export function ResComplaintsView() {
  const complaints = useResComplaints();

  const [tab, setTab] = useState<Tab>("All");
  const [openId, setOpenId] = useState<string | null>(null);
  const [newOpen, setNewOpen] = useState(false);

  const visible = useMemo(
    () => complaints.filter((complaint) => matchesTab(complaint, tab)),
    [complaints, tab],
  );

  const open = complaints.find((complaint) => complaint.id === openId) ?? null;

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
          className="flex items-center gap-2 rounded-lg bg-[#e8a33d] px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-[#d18f2d] focus-visible:ring-2 focus-visible:ring-[#e8a33d]/50 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <Plus aria-hidden="true" className="h-4 w-4" />
          New Complaint
        </button>
      </div>

      <ResTabBar
        label="Filter complaints"
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
              ? "You have not raised a complaint yet."
              : "Try another tab, or raise a new complaint."}
          </p>
        </Card>
      ) : (
        <ul className="space-y-4">
          {visible.map((complaint) => (
            <ComplaintCard
              key={complaint.id}
              complaint={complaint}
              onOpen={() => setOpenId(complaint.id)}
            />
          ))}
        </ul>
      )}

      {newOpen && <NewComplaintModal onClose={() => setNewOpen(false)} />}
      {open && (
        <ComplaintDetailModal
          complaint={open}
          onClose={() => setOpenId(null)}
        />
      )}
    </div>
  );
}
