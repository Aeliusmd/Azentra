"use client";

import { useState } from "react";

import { SoCheckInTab } from "@/components/so/visitors/check-in-tab";
import { SoCheckOutTab } from "@/components/so/visitors/check-out-tab";
import { SoRegisterVisitorTab } from "@/components/so/visitors/register-visitor-tab";
import { SoVisitorDetailModal } from "@/components/so/visitors/visitor-detail-modal";
import { SoVisitorHistoryTab } from "@/components/so/visitors/visitor-history-tab";
import { SoVisitorRequestsTab } from "@/components/so/visitors/visitor-requests-tab";
import { SoTabBar } from "@/components/so/ui/tab-bar";
import { useSelectedSoProperty } from "@/lib/so/properties";
import {
  admittedVisits,
  insideProperty,
  readyToCheckIn,
  visitsAt,
} from "@/lib/so/visitors-data";
import { useSoVisits } from "@/lib/so/visitors-store";

const TABS = [
  { id: "requests", label: "Visitor Requests" },
  { id: "register", label: "Register Visitor" },
  { id: "check-in", label: "Check-In" },
  { id: "check-out", label: "Check-Out" },
  { id: "history", label: "Visitor History" },
];

/**
 * The desk, in the order a visit passes through it.
 *
 * Left to right is the life of a caller: the request arrives, somebody without
 * one is written up, they are admitted, they leave, and the whole thing settles
 * into the log. Every tab reads the one visit store, so admitting somebody in
 * one of them empties them out of the next.
 */
export function SoVisitorsView() {
  const propertyId = useSelectedSoProperty();
  const allVisits = useSoVisits();

  const [tab, setTab] = useState("requests");
  const [openId, setOpenId] = useState<string | null>(null);

  const visits = visitsAt(propertyId, allVisits);

  // Read live so the dialog follows a visit actioned from behind it.
  const open = openId
    ? (visits.find((visit) => visit.id === openId) ?? null)
    : null;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-[24px] leading-tight font-bold text-ink sm:text-[26px]">
          Visitor Management
        </h1>
        <p className="mt-1 text-[14px] text-muted">
          Manage visitor requests, check-ins, and history
        </p>
      </div>

      <SoTabBar
        label="Visitor management sections"
        tabs={TABS}
        value={tab}
        onChange={setTab}
      />

      {tab === "requests" && (
        <SoVisitorRequestsTab
          visits={visits}
          onOpen={(visit) => setOpenId(visit.id)}
        />
      )}
      {tab === "register" && <SoRegisterVisitorTab propertyId={propertyId} />}
      {tab === "check-in" && <SoCheckInTab visits={readyToCheckIn(visits)} />}
      {tab === "check-out" && <SoCheckOutTab visits={insideProperty(visits)} />}
      {tab === "history" && (
        <SoVisitorHistoryTab visits={admittedVisits(visits)} />
      )}

      {open && (
        <SoVisitorDetailModal visit={open} onClose={() => setOpenId(null)} />
      )}
    </div>
  );
}
