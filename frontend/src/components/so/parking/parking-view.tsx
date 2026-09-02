"use client";

import { useState } from "react";

import { SoAllocationTab } from "@/components/so/parking/allocation-tab";
import { SoParkingGridTab } from "@/components/so/parking/parking-grid-tab";
import { SoParkingRequestsTab } from "@/components/so/parking/parking-requests-tab";
import { SoParkingStats } from "@/components/so/parking/parking-stats";
import { SoSlotModal } from "@/components/so/parking/slot-modal";
import { SoTabBar } from "@/components/so/ui/tab-bar";
import { slotsAt } from "@/lib/so/parking-data";
import { useSoParkingSlots } from "@/lib/so/parking-store";
import { useSelectedSoProperty } from "@/lib/so/properties";
import { parkingRequests, visitsAt } from "@/lib/so/visitors-data";
import { useSoVisits } from "@/lib/so/visitors-store";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "requests", label: "Parking Requests" },
  { id: "allocation", label: "Allocation" },
];

/**
 * The visitor deck, three ways.
 *
 * The grid is where a bay is found, the requests tab is where one is granted,
 * and the allocation table is where one is taken back. All three read the same
 * bay map, so releasing a space in the table frees the tile in the grid and
 * moves the counts above every tab at once.
 */
export function SoParkingView() {
  const propertyId = useSelectedSoProperty();
  const allSlots = useSoParkingSlots();
  const allVisits = useSoVisits();

  const [tab, setTab] = useState("overview");
  const [openId, setOpenId] = useState<string | null>(null);

  const slots = slotsAt(propertyId, allSlots);
  const requests = parkingRequests(visitsAt(propertyId, allVisits));

  // Read live so the dialog follows a bay released from behind it.
  const open = openId
    ? (slots.find((slot) => slot.id === openId) ?? null)
    : null;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-[24px] leading-tight font-bold text-ink sm:text-[26px]">
          Parking Management
        </h1>
        <p className="mt-1 text-[14px] text-muted">
          Manage visitor parking slots and requests
        </p>
      </div>

      <SoTabBar
        label="Parking sections"
        tabs={TABS}
        value={tab}
        onChange={setTab}
      />

      <SoParkingStats slots={slots} requests={requests} />

      {tab === "overview" && (
        <SoParkingGridTab slots={slots} onOpen={(slot) => setOpenId(slot.id)} />
      )}
      {tab === "requests" && (
        <SoParkingRequestsTab requests={requests} slots={slots} />
      )}
      {tab === "allocation" && <SoAllocationTab slots={slots} />}

      {open && <SoSlotModal slot={open} onClose={() => setOpenId(null)} />}
    </div>
  );
}
