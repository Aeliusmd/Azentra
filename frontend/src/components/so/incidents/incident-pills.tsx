import { SoStatusPill, type SoTone } from "@/components/so/ui/status-pill";
import type { IncidentSeverity, IncidentStatus } from "@/lib/so/incidents-data";

/**
 * Severity is the loudest thing on the row.
 *
 * Critical and High share the red because at a glance a guard needs to know
 * only whether a report is one to act on; the word itself carries the
 * difference between them.
 */
const SEVERITY_TONE: Record<IncidentSeverity, SoTone> = {
  Low: "blue",
  Medium: "amber",
  High: "rose",
  Critical: "rose",
};

export function IncidentSeverityPill({
  severity,
}: {
  severity: IncidentSeverity;
}) {
  return <SoStatusPill tone={SEVERITY_TONE[severity]}>{severity}</SoStatusPill>;
}

const STATUS_TONE: Record<IncidentStatus, SoTone> = {
  Investigating: "blue",
  Resolved: "green",
  Closed: "slate",
};

export function IncidentStatusPill({ status }: { status: IncidentStatus }) {
  return <SoStatusPill tone={STATUS_TONE[status]}>{status}</SoStatusPill>;
}

/** The tint a severity chip takes when picked on the report form. */
export const SEVERITY_PICKED: Record<IncidentSeverity, string> = {
  Low: "border-[#cfe0ef] bg-[#eef3f9] text-[#2e6cad]",
  Medium: "border-amber-200 bg-amber-50 text-amber-700",
  High: "border-rose-200 bg-rose-50 text-rose-700",
  Critical: "border-rose-300 bg-rose-100 text-rose-700",
};
