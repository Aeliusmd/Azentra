"use client";

import { useState } from "react";
import { Car, Plus } from "lucide-react";

import { VehicleModal } from "@/components/ten/apartment/vehicle-modal";
import { Card } from "@/components/ui/card";
import { vehicleName } from "@/lib/ten/apartment-data";
import { useTenVehicles } from "@/lib/ten/apartment-store";

/**
 * The cars this tenant keeps.
 *
 * The one editable thing on this screen: a tenant may register their own
 * vehicle. Which bay it ends up in is not asked for here — that follows from
 * the plate on the bay, and the allocation is the property's.
 */
export function TenVehiclesPanel() {
  const vehicles = useTenVehicles();
  const [adding, setAdding] = useState(false);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[16px] font-bold text-ink">My Vehicles</h2>
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <Plus aria-hidden="true" className="h-4 w-4" />
          Add Vehicle
        </button>
      </div>

      {vehicles.length === 0 ? (
        <Card className="px-6 py-14 text-center">
          <p className="text-[14px] text-muted">
            No vehicle registered yet. Add yours so the gate recognises it.
          </p>
        </Card>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {vehicles.map((vehicle) => (
            <li key={vehicle.id}>
              <Card className="flex items-center gap-4 p-4">
                <span
                  aria-hidden="true"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500"
                >
                  <Car className="h-5 w-5" />
                </span>

                <div className="min-w-0">
                  <p className="truncate text-[15px] font-bold text-ink">
                    {vehicleName(vehicle)} {vehicle.year}
                  </p>
                  <p className="mt-0.5 truncate text-[13px] text-muted">
                    {vehicle.plate}
                    {vehicle.color ? ` · ${vehicle.color}` : ""}
                  </p>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}

      {adding && <VehicleModal onClose={() => setAdding(false)} />}
    </>
  );
}
