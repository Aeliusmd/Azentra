"use client";

import { SquareParking } from "lucide-react";

import { TenStatusPill } from "@/components/ten/ui/status-pill";
import { Card } from "@/components/ui/card";
import { vehicleByPlate, vehicleLabel } from "@/lib/ten/apartment-data";
import { useTenParking, useTenVehicles } from "@/lib/ten/apartment-store";

/**
 * The bay allocated to this tenancy.
 *
 * Read-only throughout — how many bays a tenancy gets and which one is the
 * property's allocation, so there is no control here that changes either. Kept
 * apart from the apartment view so the Parking screen can show the same panel
 * without a second copy of it.
 */
export function TenParkingPanel() {
  const slot = useTenParking();
  const vehicles = useTenVehicles();
  const car = vehicleByPlate(slot.plate, vehicles);

  return (
    <Card>
      <div className="px-4 py-4 sm:px-5">
        <h2 className="text-[15px] font-bold text-ink">Assigned Parking</h2>
      </div>

      <div className="px-4 pb-4 sm:px-5 sm:pb-5">
        <div className="flex flex-wrap items-center gap-3 rounded-lg border border-hairline px-4 py-4 sm:flex-nowrap sm:gap-4">
          <span
            aria-hidden="true"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#eef3f9] text-[#5b7f9c]"
          >
            <SquareParking className="h-5 w-5" />
          </span>

          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-bold text-ink">{slot.bay}</p>
            <p className="mt-0.5 text-[13px] text-muted">
              {slot.cover}
              {car ? ` · ${vehicleLabel(car)}` : " · No vehicle assigned"}
            </p>
          </div>

          <TenStatusPill tone={slot.status === "Active" ? "green" : "slate"}>
            {slot.status}
          </TenStatusPill>
        </div>
      </div>
    </Card>
  );
}
