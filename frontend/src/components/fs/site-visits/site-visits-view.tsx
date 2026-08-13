"use client";

import { useMemo, useState } from "react";
import { CalendarDays, MapPin, Plus } from "lucide-react";

import { CreateSiteVisitModal } from "@/components/fs/site-visits/create-site-visit-modal";
import { SiteVisitDetailModal } from "@/components/fs/site-visits/site-visit-detail-modal";
import { Pill } from "@/components/pm/ui/pill";
import { Card } from "@/components/ui/card";
import { useSelectedFsProperty } from "@/lib/fs/properties";
import {
  VISIT_STATUS_TONE,
  type SiteVisit,
} from "@/lib/fs/site-visits-data";
import { useFsSiteVisits } from "@/lib/fs/site-visits-store";

/** A round the supervisor still has to make. */
function isOpen(visit: SiteVisit) {
  return (
    visit.status === "Scheduled" ||
    visit.status === "In Progress" ||
    visit.status === "Follow-up Required"
  );
}

function VisitCard({
  visit,
  onOpen,
}: {
  visit: SiteVisit;
  onOpen: () => void;
}) {
  return (
    <Card className="h-full">
      <button
        type="button"
        onClick={onOpen}
        aria-haspopup="dialog"
        className="flex h-full w-full flex-col p-5 text-left transition-colors hover:bg-gray-50/70 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
      >
        <span className="flex items-start justify-between gap-3">
          <span className="font-mono text-[13px] text-gray-500">
            {visit.id}
          </span>
          <Pill tone={VISIT_STATUS_TONE[visit.status]}>{visit.status}</Pill>
        </span>

        <span className="mt-2.5 block text-[17px] font-bold text-ink">
          {visit.purpose}
        </span>
        <span className="mt-1.5 block text-[15px] text-muted">
          {visit.summary}
        </span>

        <span className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-gray-600">
          <span className="flex items-center gap-1.5">
            <MapPin aria-hidden="true" className="h-4 w-4 text-gray-400" />
            {[visit.building, visit.location].filter(Boolean).join(" - ")}
          </span>
          <span className="flex items-center gap-1.5">
            <CalendarDays aria-hidden="true" className="h-4 w-4 text-gray-400" />
            {visit.date} {visit.time}
          </span>
        </span>
      </button>
    </Card>
  );
}

/**
 * The supervisor's own rounds on this property: what is still to be walked,
 * soonest first, then the ones already closed out.
 */
export function FsSiteVisitsView() {
  const propertyId = useSelectedFsProperty();
  const visits = useFsSiteVisits();

  const [openId, setOpenId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const visible = useMemo(
    () =>
      visits
        .filter((visit) => visit.propertyId === propertyId)
        .sort((a, b) => {
          // Rounds still to make lead, earliest first; closed ones follow with
          // the most recent at the top.
          if (isOpen(a) !== isOpen(b)) return isOpen(a) ? -1 : 1;

          const slot = `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`);
          return isOpen(a) ? slot : -slot;
        }),
    [visits, propertyId],
  );

  const openVisit = visits.find((visit) => visit.id === openId) ?? null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[32px] leading-tight font-bold text-ink">
            Site Visits
          </h1>
          <p className="mt-1 text-[15px] text-muted">
            Manage building inspections, assessments, and site visits
          </p>
        </div>

        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-[15px] font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <Plus aria-hidden="true" className="h-[18px] w-[18px]" />
          Create Site Visit
        </button>
      </div>

      {visible.length === 0 ? (
        <Card className="px-6 py-16 text-center text-[15px] text-muted">
          No site visits are booked on this property.
        </Card>
      ) : (
        <ul className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {visible.map((visit) => (
            <li key={visit.id}>
              <VisitCard visit={visit} onOpen={() => setOpenId(visit.id)} />
            </li>
          ))}
        </ul>
      )}

      {openVisit && (
        <SiteVisitDetailModal
          visit={openVisit}
          onClose={() => setOpenId(null)}
        />
      )}

      {createOpen && (
        <CreateSiteVisitModal onClose={() => setCreateOpen(false)} />
      )}
    </div>
  );
}
