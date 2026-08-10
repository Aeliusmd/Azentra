"use client";

import { useMemo, useState } from "react";
import { Building2, ChevronRight, Clock, UserRound } from "lucide-react";

import {
  ComplaintDetailsModal,
  ResolveComplaintModal,
} from "@/components/pm/complaints/complaint-modals";
import { FilterChips } from "@/components/pm/ui/filter-chips";
import { Pill } from "@/components/pm/ui/pill";
import {
  COMPLAINT_PRIORITY_TONE,
  COMPLAINT_STATUSES,
  COMPLAINT_STATUS_TONE,
  complaints as seed,
  type Complaint,
} from "@/lib/pm/complaints-data";

const FILTERS = ["All", ...COMPLAINT_STATUSES] as const;

function Meta({
  icon: Icon,
  children,
}: {
  icon: typeof UserRound;
  children: React.ReactNode;
}) {
  return (
    <span className="flex items-center gap-1.5 text-[13px] text-muted">
      <Icon aria-hidden="true" className="h-3.5 w-3.5 text-gray-400" />
      {children}
    </span>
  );
}

export function ComplaintsView() {
  const [list, setList] = useState<Complaint[]>(seed);
  const [filter, setFilter] = useState<string>("All");
  const [openId, setOpenId] = useState<string | null>(null);
  const [resolving, setResolving] = useState(false);

  const visible = useMemo(
    () =>
      filter === "All" ? list : list.filter((item) => item.status === filter),
    [list, filter],
  );

  const active = list.find((item) => item.id === openId) ?? null;

  function resolve(resolution: string) {
    setList((current) =>
      current.map((item) =>
        item.id === openId
          ? { ...item, status: "Resolved", resolution }
          : item,
      ),
    );
    setResolving(false);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[32px] leading-tight font-bold text-ink">
          Complaints
        </h1>
        <p className="mt-1 text-[15px] text-muted">
          Review and resolve resident complaints
        </p>
      </div>

      <FilterChips
        label="Filter complaints by status"
        options={FILTERS}
        value={filter}
        onChange={setFilter}
      />

      {visible.length === 0 ? (
        <p className="rounded-lg border border-hairline bg-white px-6 py-12 text-center text-[15px] text-muted">
          No complaints with this status.
        </p>
      ) : (
        <ul className="space-y-4">
          {visible.map((complaint) => (
            <li key={complaint.id}>
              <button
                type="button"
                onClick={() => setOpenId(complaint.id)}
                className="flex w-full items-center gap-4 rounded-xl border border-hairline bg-white px-5 py-4 text-left transition-colors hover:bg-gray-50/70 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
              >
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs text-gray-400">
                      {complaint.id}
                    </span>
                    <Pill tone={COMPLAINT_PRIORITY_TONE[complaint.priority]}>
                      {complaint.priority}
                    </Pill>
                    <Pill tone={COMPLAINT_STATUS_TONE[complaint.status]}>
                      {complaint.status}
                    </Pill>
                    <span className="text-[13px] text-muted">
                      {complaint.category}
                    </span>
                  </span>

                  <span className="mt-2 block text-[15px] font-semibold text-ink">
                    {complaint.title}
                  </span>

                  <span className="mt-1 block text-[13px] leading-relaxed text-gray-600">
                    {complaint.description}
                  </span>

                  <span className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5">
                    <Meta icon={UserRound}>
                      {complaint.filedBy} ({complaint.unit})
                    </Meta>
                    <Meta icon={Building2}>{complaint.department}</Meta>
                    <Meta icon={Clock}>{complaint.filedAt}</Meta>
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

      {active && !resolving && (
        <ComplaintDetailsModal
          complaint={active}
          onClose={() => setOpenId(null)}
          onResolve={() => setResolving(true)}
        />
      )}

      {active && resolving && (
        <ResolveComplaintModal
          complaint={active}
          onClose={() => setResolving(false)}
          onSubmit={resolve}
        />
      )}
    </div>
  );
}
