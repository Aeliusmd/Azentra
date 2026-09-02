import type { AlertStatus } from "@/lib/so/dashboard-data";
import type { SoVisitStatus } from "@/lib/so/visitors-data";

/**
 * The security portal's status badge.
 *
 * Louder than the resident portals': a guard scans these to decide whether to
 * open a barrier, so anything needing a decision — waiting, active, critical —
 * carries colour, and only settled states go grey.
 */

const TONES = {
  blue: "bg-[#eef3f9] text-[#2e6cad]",
  green: "bg-green-50 text-green-700",
  amber: "bg-amber-50 text-amber-700",
  rose: "bg-rose-50 text-rose-700",
  slate: "bg-gray-100 text-gray-600",
} as const;

export type SoTone = keyof typeof TONES;

export function SoStatusPill({
  tone = "slate",
  children,
}: {
  tone?: SoTone;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap ${TONES[tone]}`}
    >
      {children}
    </span>
  );
}

const VISIT_TONE: Record<SoVisitStatus, SoTone> = {
  Pending: "amber",
  Approved: "blue",
  "Checked In": "green",
  "Checked Out": "slate",
  Rejected: "rose",
  Expired: "slate",
};

/** Visit statuses read lower-case on the row, the way a gate log writes them. */
export function VisitStatusPill({ status }: { status: SoVisitStatus }) {
  return (
    <SoStatusPill tone={VISIT_TONE[status]}>
      <span className="lowercase">{status}</span>
    </SoStatusPill>
  );
}

const ALERT_TONE: Record<AlertStatus, SoTone> = {
  active: "rose",
  responding: "slate",
  resolved: "green",
};

export function AlertStatusPill({ status }: { status: AlertStatus }) {
  return <SoStatusPill tone={ALERT_TONE[status]}>{status}</SoStatusPill>;
}
