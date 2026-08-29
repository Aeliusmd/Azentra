"use client";

import { SquareParking } from "lucide-react";

import { TenStatusPill } from "@/components/ten/ui/status-pill";
import { Card } from "@/components/ui/card";
import { vehicleByPlate, vehicleLabel } from "@/lib/ten/apartment-data";
import { useTenParking, useTenVehicles } from "@/lib/ten/apartment-store";

/**
 * The bay allocated to this tenancy.
 *
 * Read-only throughout — which bay a tenancy holds is the property's
 * allocation, so there is no control here that changes it. Kept in its own
 * component so the Parking screen can show the same panel without a copy.
 */
export function TenParkingPanel() {
  const slot = useTenParking();
  const vehicles = useTenVehicles();
  const car = vehicleByPlate(slot.plate, vehicles);

  return (
    <Card className="p-5 sm:p-6">
      <h2 className="text-[15px] font-bold text-ink">Assigned Parking</h2>

      <div className="mt-4 flex flex-wrap items-center gap-3 rounded-lg border border-hairline px-4 py-4 sm:flex-nowrap sm:gap-4">
        <span
          aria-hidden="true"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#eef3f9] text-[#2e6cad]"
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
    </Card>
  );
}
