"use client";

import { useMemo, useState } from "react";
import { Car, Plus, UserRoundPlus } from "lucide-react";

import { AddVisitorModal } from "@/components/ten/visitors/add-visitor-modal";
import { VisitorDetailModal } from "@/components/ten/visitors/visitor-detail-modal";
import { TenStatusPill, type TenTone } from "@/components/ten/ui/status-pill";
import { TenTabBar } from "@/components/ten/ui/tab-bar";
import { Card } from "@/components/ui/card";
import { initialsOf, longDate, timeRange } from "@/lib/res/format";
import { TODAY } from "@/lib/ten/dashboard-data";
import {
  pastPasses,
  upcomingPasses,
  vehicleLine,
  type VisitorPass,
  type VisitorStatus,
} from "@/lib/ten/visitors-data";
import { useTenVisitors } from "@/lib/ten/visitors-store";

type Tab = "Upcoming" | "History";

const STATUS_TONE: Record<VisitorStatus, TenTone> = {
  Upcoming: "green",
  Active: "green",
  "Checked In": "green",
  "Checked Out": "slate",
  Expired: "slate",
  Cancelled: "rose",
};

/** One pass, as the whole row — the card is the control that opens it. */
function VisitorRow({
  pass,
  onOpen,
}: {
  pass: VisitorPass;
  onOpen: () => void;
}) {
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
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-violet-100 text-[15px] font-semibold text-violet-600"
          >
            {initialsOf(pass.name).charAt(0)}
          </span>

          <span className="min-w-0 flex-1">
            <span className="block text-[15px] font-bold text-ink">
              {pass.name}
            </span>
            <span className="mt-0.5 block truncate text-[14px] text-muted">
              {longDate(pass.date)} · {timeRange(pass.from, pass.to)}
            </span>
          </span>

          <span className="hidden shrink-0 items-center gap-4 sm:flex">
            {pass.vehicle && (
              <span className="flex items-center gap-1.5 text-[14px] text-muted">
                <Car aria-hidden="true" className="h-4 w-4" />
                {vehicleLine(pass.vehicle)}
              </span>
            )}
            <TenStatusPill tone={STATUS_TONE[pass.status]}>
              {pass.status}
            </TenStatusPill>
          </span>
        </button>

        {/* Phones put the badge on its own line rather than crushing it. */}
        <div className="flex flex-wrap items-center gap-3 px-4 pb-4 sm:hidden">
          {pass.vehicle && (
            <span className="flex items-center gap-1.5 text-[13px] text-muted">
              <Car aria-hidden="true" className="h-4 w-4" />
              {vehicleLine(pass.vehicle)}
            </span>
          )}
          <TenStatusPill tone={STATUS_TONE[pass.status]}>
            {pass.status}
          </TenStatusPill>
        </div>
      </Card>
    </li>
  );
}

/**
 * The visitors this tenant is expecting, and the ones who have been.
 *
 * A tenant registers who is coming and can call a pass off. Admitting somebody
 * is Security's — no control here checks anyone in or out, and the visitor bay
 * is allotted by the property rather than picked on the form.
 */
export function TenVisitorsView() {
  const passes = useTenVisitors();

  const [tab, setTab] = useState<Tab>("Upcoming");
  const [addOpen, setAddOpen] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);

  const upcoming = useMemo(() => upcomingPasses(TODAY, passes), [passes]);
  const history = useMemo(() => pastPasses(TODAY, passes), [passes]);

  const visible = tab === "Upcoming" ? upcoming : history;

  // Read live so the dialog follows a pass cancelled inside it.
  const open = openId
    ? (passes.find((pass) => pass.id === openId) ?? null)
    : null;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[24px] leading-tight font-bold text-ink sm:text-[28px]">
            Visitors
          </h1>
          <p className="mt-1 text-[14px] text-muted">
            Manage visitor access to your apartment
          </p>
        </div>

        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-violet-500 px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-violet-600 focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <Plus aria-hidden="true" className="h-4 w-4" />
          Add Visitor
        </button>
      </div>

      <TenTabBar
        label="Filter visitors"
        value={tab}
        onChange={(id) => setTab(id as Tab)}
        tabs={[
          { id: "Upcoming", label: `Upcoming (${upcoming.length})` },
          { id: "History", label: `History (${history.length})` },
        ]}
      />

      {visible.length === 0 ? (
        <Card className="px-6 py-16 text-center">
          <span
            aria-hidden="true"
            className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-violet-50 text-violet-500"
          >
            <UserRoundPlus className="h-5 w-5" />
          </span>
          <p className="mt-4 text-[17px] font-semibold text-ink">
            {tab === "Upcoming" ? "No visitors expected" : "No past visitors"}
          </p>
          <p className="mx-auto mt-1 max-w-[420px] text-[15px] text-muted">
            {tab === "Upcoming"
              ? "Register someone coming to see you and their pass will show up here."
              : "Visits that have finished will be listed here."}
          </p>
        </Card>
      ) : (
        <ul className="space-y-3">
          {visible.map((pass) => (
            <VisitorRow
              key={pass.id}
              pass={pass}
              onOpen={() => setOpenId(pass.id)}
            />
          ))}
        </ul>
      )}

      {addOpen && <AddVisitorModal onClose={() => setAddOpen(false)} />}
      {open && (
        <VisitorDetailModal pass={open} onClose={() => setOpenId(null)} />
      )}
    </div>
  );
}
