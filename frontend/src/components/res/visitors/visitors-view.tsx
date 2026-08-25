"use client";

import { useMemo, useState } from "react";
import { Car, Plus } from "lucide-react";

import { AddVisitorModal } from "@/components/res/visitors/add-visitor-modal";
import { VisitorDetailsModal } from "@/components/res/visitors/visitor-details-modal";
import { VisitorStatusPill } from "@/components/res/ui/status-pill";
import { ResTabBar } from "@/components/res/ui/tab-bar";
import { Card } from "@/components/ui/card";
import { TODAY } from "@/lib/res/dashboard-data";
import { initialsOf, longDate, timeRange } from "@/lib/res/format";
import {
  pastPasses,
  upcomingPasses,
  type VisitorPass,
} from "@/lib/res/visitors-data";
import { useResVisitors } from "@/lib/res/visitors-store";

type Tab = "Upcoming" | "History";

function PassCard({
  pass,
  onOpen,
}: {
  pass: VisitorPass;
  onOpen: () => void;
}) {
  return (
    <li>
      <Card>
        <button
          type="button"
          onClick={onOpen}
          aria-haspopup="dialog"
          className="flex w-full flex-wrap items-center gap-4 px-4 py-4 text-left transition-colors hover:bg-gray-50/70 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none sm:flex-nowrap sm:px-5"
        >
          <span
            aria-hidden="true"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#e8eef5] text-[15px] font-semibold text-[#1b3a5c]"
          >
            {initialsOf(pass.name)}
          </span>

          <span className="min-w-0 flex-1">
            <span className="block text-[15px] font-bold text-ink">
              {pass.name}
            </span>
            <span className="mt-0.5 block text-[14px] text-muted">
              {longDate(pass.date)} · {timeRange(pass.arriving, pass.leaving)}
            </span>

            <span className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-2 text-[14px] text-muted">
              {pass.purpose}
              {pass.vehicle && (
                <span className="flex items-center gap-1.5 rounded-md bg-gray-100 px-2 py-1 text-[13px] text-gray-600">
                  <Car aria-hidden="true" className="h-4 w-4 text-gray-400" />
                  {pass.vehicle}
                </span>
              )}
              {pass.bay && (
                <span className="rounded-md bg-green-50 px-2 py-1 text-[13px] font-medium text-green-700">
                  Parking: {pass.bay}
                </span>
              )}
            </span>
          </span>

          <span className="shrink-0">
            <VisitorStatusPill status={pass.status} />
          </span>
        </button>
      </Card>
    </li>
  );
}

/**
 * Visitors this household has registered.
 *
 * Residents raise and withdraw passes; the gate records arrivals. There is no
 * check-in control anywhere on this page, by design.
 */
export function ResVisitorsView() {
  const passes = useResVisitors();

  const [tab, setTab] = useState<Tab>("Upcoming");
  const [openId, setOpenId] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const upcoming = useMemo(() => upcomingPasses(TODAY, passes), [passes]);
  const history = useMemo(() => pastPasses(TODAY, passes), [passes]);

  const visible = tab === "Upcoming" ? upcoming : history;
  const open = passes.find((pass) => pass.id === openId) ?? null;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[24px] leading-tight font-bold text-ink sm:text-[28px]">
            Visitors
          </h1>
          <p className="mt-1 text-[14px] text-muted">
            Manage and track your visitors
          </p>
        </div>

        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <Plus aria-hidden="true" className="h-4 w-4" />
          Add Visitor
        </button>
      </div>

      <ResTabBar
        label="Visitors"
        value={tab}
        onChange={(id) => setTab(id as Tab)}
        tabs={[
          { id: "Upcoming", label: `Upcoming Visitors (${upcoming.length})` },
          { id: "History", label: `Visitor History (${history.length})` },
        ]}
      />

      {visible.length === 0 ? (
        <Card className="px-6 py-14 text-center">
          <p className="text-[15px] font-semibold text-ink">
            {tab === "Upcoming" ? "No visitors expected" : "No past visitors"}
          </p>
          <p className="mt-1 text-[14px] text-muted">
            {tab === "Upcoming"
              ? "Register someone and their pass will appear here."
              : "Passes move here once the visit has been and gone."}
          </p>
        </Card>
      ) : (
        <ul className="space-y-4">
          {visible.map((pass) => (
            <PassCard
              key={pass.id}
              pass={pass}
              onOpen={() => setOpenId(pass.id)}
            />
          ))}
        </ul>
      )}

      {addOpen && <AddVisitorModal onClose={() => setAddOpen(false)} />}
      {open && (
        <VisitorDetailsModal pass={open} onClose={() => setOpenId(null)} />
      )}
    </div>
  );
}
