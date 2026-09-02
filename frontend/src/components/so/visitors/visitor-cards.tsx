"use client";

import { Check, Eye, X } from "lucide-react";

import { VisitStatusPill } from "@/components/so/ui/status-pill";
import {
  CARD_ACTION,
  CARD_ACTION_QUIET,
  SoRecordCard,
} from "@/components/so/ui/record-card";
import { vehicleLine, type SoVisit } from "@/lib/so/visitors-data";
import {
  approveSoVisit,
  checkInSoVisit,
  checkOutSoVisit,
  rejectSoVisit,
} from "@/lib/so/visitors-store";

/**
 * The visitor lists on a phone.
 *
 * One card shape per tab, because each tab is asking a different question: the
 * requests list is "what is the state of this visit", the queues are "let this
 * person in / out", and the history is "what happened". The actions are the
 * same ones the table offers — nothing here is a second way to do something.
 */

const GREEN = `${CARD_ACTION} bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-600/40`;
const DARK = `${CARD_ACTION} bg-[#374151] text-white hover:bg-[#1f2937] focus-visible:ring-gray-500/40`;
const ROSE = `${CARD_ACTION} bg-[#e0554d] text-white hover:bg-[#c74941] focus-visible:ring-[#e0554d]/40`;

/** Visit requests — every visit the property has, whatever became of it. */
export function SoVisitorRequestCards({
  visits,
  onOpen,
}: {
  visits: SoVisit[];
  onOpen: (visit: SoVisit) => void;
}) {
  return (
    <ul className="space-y-3">
      {visits.map((visit) => (
        <li key={visit.id}>
          <SoRecordCard
            eyebrow={visit.id}
            badges={<VisitStatusPill status={visit.status} />}
            title={visit.name}
            subtitle={visit.phone}
            rows={[
              {
                label: "Resident",
                value: `${visit.resident} · ${visit.unit}`,
              },
              {
                label: "Visit",
                value: `${visit.date} · ${visit.expectedAt}`,
              },
              { label: "Purpose", value: visit.purpose },
              {
                label: "Parking",
                value: visit.vehicle ? visit.vehicle.plate : "No",
              },
            ]}
            actions={
              <>
                <button
                  type="button"
                  onClick={() => onOpen(visit)}
                  className={CARD_ACTION_QUIET}
                >
                  <Eye aria-hidden="true" className="h-4 w-4 text-gray-400" />
                  View
                </button>

                {visit.status === "Pending" && (
                  <>
                    <button
                      type="button"
                      onClick={() => approveSoVisit(visit.id)}
                      className={GREEN}
                    >
                      <Check aria-hidden="true" className="h-4 w-4" />
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => rejectSoVisit(visit.id)}
                      className={ROSE}
                    >
                      <X aria-hidden="true" className="h-4 w-4" />
                      Reject
                    </button>
                  </>
                )}

                {visit.status === "Approved" && (
                  <button
                    type="button"
                    onClick={() => checkInSoVisit(visit.id)}
                    className={GREEN}
                  >
                    Check In
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

/** The arrivals queue. */
export function SoCheckInCards({ visits }: { visits: SoVisit[] }) {
  return (
    <ul className="space-y-3">
      {visits.map((visit) => (
        <li key={visit.id}>
          <SoRecordCard
            title={visit.name}
            subtitle={visit.phone}
            rows={[
              {
                label: "Resident",
                value: `${visit.resident} · ${visit.unit}`,
              },
              {
                label: "Expected",
                value: `${visit.date} · ${visit.expectedAt}`,
              },
              {
                label: "Vehicle",
                value: visit.vehicle ? vehicleLine(visit.vehicle) : "None",
              },
            ]}
            actions={
              <button
                type="button"
                onClick={() => checkInSoVisit(visit.id)}
                className={GREEN}
              >
                Check In
              </button>
            }
          />
        </li>
      ))}
    </ul>
  );
}

/** Who is still inside. */
export function SoCheckOutCards({ visits }: { visits: SoVisit[] }) {
  return (
    <ul className="space-y-3">
      {visits.map((visit) => (
        <li key={visit.id}>
          <SoRecordCard
            title={visit.name}
            subtitle={visit.phone}
            rows={[
              {
                label: "Resident",
                value: `${visit.resident} · ${visit.unit}`,
              },
              {
                label: "Checked in",
                value: `${visit.checkedInAt ?? "—"} · ${visit.date}`,
              },
              {
                label: "Pass",
                value: (
                  <span className="font-mono text-[12px]">
                    {visit.passCode}
                  </span>
                ),
              },
            ]}
            actions={
              <button
                type="button"
                onClick={() => checkOutSoVisit(visit.id)}
                className={DARK}
              >
                Check Out
              </button>
            }
          />
        </li>
      ))}
    </ul>
  );
}

/** Every visit that was actually admitted. */
export function SoVisitorHistoryCards({ visits }: { visits: SoVisit[] }) {
  return (
    <ul className="space-y-3">
      {visits.map((visit) => (
        <li key={visit.id}>
          <SoRecordCard
            eyebrow={visit.date}
            badges={<VisitStatusPill status={visit.status} />}
            title={visit.name}
            subtitle={visit.phone}
            rows={[
              {
                label: "Resident",
                value: `${visit.resident} · ${visit.unit}`,
              },
              { label: "Check-in", value: visit.checkedInAt ?? "-" },
              { label: "Check-out", value: visit.checkedOutAt ?? "-" },
              {
                label: "Vehicle",
                value: visit.vehicle ? visit.vehicle.plate : "No vehicle",
              },
            ]}
          />
        </li>
      ))}
    </ul>
  );
}
