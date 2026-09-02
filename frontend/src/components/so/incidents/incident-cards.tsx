"use client";

import { Eye } from "lucide-react";

import {
  IncidentSeverityPill,
  IncidentStatusPill,
} from "@/components/so/incidents/incident-pills";
import {
  CARD_ACTION,
  CARD_ACTION_QUIET,
  SoRecordCard,
} from "@/components/so/ui/record-card";
import type { Incident } from "@/lib/so/incidents-data";
import { setSoIncidentStatus } from "@/lib/so/incidents-store";

/**
 * The register on a phone.
 *
 * Seven columns will not fit across a handset, and a table that scrolls
 * sideways puts severity, status and the Close button off the edge of the
 * screen — the three things a guard on their feet actually needs.
 */
export function SoIncidentCards({
  incidents,
  onOpen,
}: {
  incidents: Incident[];
  onOpen: (incident: Incident) => void;
}) {
  return (
    <ul className="space-y-3">
      {incidents.map((incident) => (
        <li key={incident.id}>
          <SoRecordCard
            eyebrow={incident.id}
            badges={
              <>
                <IncidentSeverityPill severity={incident.severity} />
                <IncidentStatusPill status={incident.status} />
              </>
            }
            title={incident.type}
            body={incident.description}
            rows={[
              {
                label: "When",
                value: `${incident.date} · ${incident.time}`,
              },
              { label: "Location", value: incident.location },
            ]}
            actions={
              <>
                <button
                  type="button"
                  onClick={() => onOpen(incident)}
                  className={CARD_ACTION_QUIET}
                >
                  <Eye aria-hidden="true" className="h-4 w-4 text-gray-400" />
                  View
                </button>

                {incident.status === "Investigating" && (
                  <button
                    type="button"
                    onClick={() => setSoIncidentStatus(incident.id, "Closed")}
                    className={`${CARD_ACTION} bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-600/40`}
                  >
                    Close
                  </button>
                )}
              </>
            }
          />
        </li>
      ))}
    </ul>
  );
}
