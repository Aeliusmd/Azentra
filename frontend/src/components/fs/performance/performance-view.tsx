"use client";

import { useMemo, useState } from "react";
import {
  CheckCheck,
  Clock,
  RotateCcw,
  Siren,
  Star,
  type LucideIcon,
} from "lucide-react";

import { FeedbackModal } from "@/components/fs/performance/feedback-modal";
import { PerformanceDetailModal } from "@/components/fs/performance/performance-detail-modal";
import { Card } from "@/components/ui/card";
import { useSelectedFsProperty } from "@/lib/fs/properties";
import {
  durationLabel,
  techniciansAt,
  technicianInitials,
  type FsTechnician,
} from "@/lib/fs/technicians-data";

/** Icon square colours on the summary tiles. */
const ICON_TONE = {
  green: "bg-[#3f9e63]",
  red: "bg-[#e0554d]",
  orange: "bg-[#d1743a]",
  amber: "bg-[#e8a33d]",
} as const;

function SummaryTile({
  icon: Icon,
  tone,
  value,
  label,
}: {
  icon: LucideIcon;
  tone: keyof typeof ICON_TONE;
  value: string;
  label: string;
}) {
  return (
    <Card className="p-5">
      <span
        aria-hidden="true"
        className={`flex h-9 w-9 items-center justify-center rounded-lg text-white ${ICON_TONE[tone]}`}
      >
        <Icon className="h-[18px] w-[18px]" />
      </span>
      <p className="mt-4 text-[24px] leading-none font-bold text-ink">{value}</p>
      <p className="mt-1.5 text-[13px] text-muted">{label}</p>
    </Card>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="text-[17px] leading-none font-bold text-ink">{value}</p>
      <p className="mt-1.5 text-[13px] text-muted">{label}</p>
    </div>
  );
}

function PerformanceCard({
  technician,
  onDetails,
  onFeedback,
}: {
  technician: FsTechnician;
  onDetails: () => void;
  onFeedback: () => void;
}) {
  return (
    <Card className="flex h-full flex-col p-5">
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-100 text-[15px] font-semibold text-gray-600"
        >
          {technicianInitials(technician.name)}
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-[17px] font-bold text-ink">{technician.name}</p>
          <p className="mt-0.5 text-[13px] text-muted">{technician.title}</p>
        </div>

        <span className="flex shrink-0 items-center gap-1.5 text-[15px] font-semibold text-ink">
          <Star
            aria-hidden="true"
            className="h-4 w-4 fill-[#e8a33d] text-[#e8a33d]"
          />
          {technician.rating.toFixed(1)}
          <span className="sr-only">out of 5</span>
        </span>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-x-4 gap-y-5">
        <Stat value={String(technician.completedJobs)} label="Completed" />
        <Stat
          value={durationLabel(technician.avgResolutionHours)}
          label="Avg Time"
        />
        <Stat value={`${technician.onTimeRate}%`} label="On Time" />
        <Stat value={String(technician.emergencyJobs)} label="Emergency" />
        <Stat value={String(technician.reopenedJobs)} label="Reopened" />
        <Stat value={String(technician.materialsUsed)} label="Materials" />
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onDetails}
          className="flex-1 rounded-lg border border-hairline px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
        >
          View Details
        </button>
        <button
          type="button"
          onClick={onFeedback}
          className="flex-1 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          Add Feedback
        </button>
      </div>
    </Card>
  );
}

/** Mean of a field across the roster, to one decimal at most. */
function mean(values: number[]) {
  return values.length === 0
    ? 0
    : values.reduce((total, value) => total + value, 0) / values.length;
}

/**
 * How the site's technicians are performing: the roster's averages up top, then
 * a card each. Everything is a career figure — today's load lives on the
 * technician list, and this page is for the longer view.
 */
export function FsPerformanceView() {
  const propertyId = useSelectedFsProperty();

  const [detailId, setDetailId] = useState<string | null>(null);
  const [feedbackId, setFeedbackId] = useState<string | null>(null);

  // Strongest first — the ranking is the point of the page.
  const roster = useMemo(
    () => [...techniciansAt(propertyId)].sort((a, b) => b.rating - a.rating),
    [propertyId],
  );

  const summary = useMemo(() => {
    const completed = roster.reduce((total, tech) => total + tech.completedJobs, 0);
    const reopened = roster.reduce((total, tech) => total + tech.reopenedJobs, 0);

    return {
      avgTime: durationLabel(mean(roster.map((tech) => tech.avgResolutionHours))),
      onTime: `${Math.round(mean(roster.map((tech) => tech.onTimeRate)))}%`,
      response: `${Math.round(mean(roster.map((tech) => tech.emergencyResponseMins)))} min`,
      reopenRate:
        completed === 0 ? "—" : `${((reopened / completed) * 100).toFixed(1)}%`,
      rating: mean(roster.map((tech) => tech.rating)).toFixed(1),
    };
  }, [roster]);

  const detailTech = roster.find((tech) => tech.id === detailId) ?? null;
  const feedbackTech = roster.find((tech) => tech.id === feedbackId) ?? null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[32px] leading-tight font-bold text-ink">
          Technician Performance
        </h1>
        <p className="mt-1 text-[15px] text-muted">
          Monitor and evaluate technician work quality
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <SummaryTile
          icon={Clock}
          tone="green"
          value={summary.avgTime}
          label="Avg Completion Time"
        />
        <SummaryTile
          icon={CheckCheck}
          tone="green"
          value={summary.onTime}
          label="On-Time Rate"
        />
        <SummaryTile
          icon={Siren}
          tone="red"
          value={summary.response}
          label="Emergency Response"
        />
        <SummaryTile
          icon={RotateCcw}
          tone="orange"
          value={summary.reopenRate}
          label="Reopen Rate"
        />
        <SummaryTile
          icon={Star}
          tone="amber"
          value={summary.rating}
          label="Avg Rating"
        />
      </div>

      {roster.length === 0 ? (
        <Card className="px-6 py-16 text-center text-[15px] text-muted">
          No technicians are rostered on this property.
        </Card>
      ) : (
        <ul className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {roster.map((technician) => (
            <li key={technician.id}>
              <PerformanceCard
                technician={technician}
                onDetails={() => setDetailId(technician.id)}
                onFeedback={() => setFeedbackId(technician.id)}
              />
            </li>
          ))}
        </ul>
      )}

      {detailTech && (
        <PerformanceDetailModal
          technician={detailTech}
          onClose={() => setDetailId(null)}
        />
      )}

      {feedbackTech && (
        <FeedbackModal
          technician={feedbackTech}
          onClose={() => setFeedbackId(null)}
        />
      )}
    </div>
  );
}
