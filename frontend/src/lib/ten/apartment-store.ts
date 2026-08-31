"use client";

import { useSyncExternalStore } from "react";

import {
  tenantParkingSlot,
  tenantVehicles,
  vehicleName,
  type TenParkingSlot,
  type TenVehicle,
  type VehicleType,
} from "@/lib/ten/apartment-data";
import { pushTenNotification } from "@/lib/ten/notifications-store";

/**
 * The tenant's vehicles.
 *
 * Parking is read-only here and has no setter at all: which bay this tenancy
 * holds is the property's allocation. A tenant can say which car of theirs
 * exists; they cannot hand themselves a space.
 */

let vehicles: TenVehicle[] = tenantVehicles;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

let vehicleSeq = tenantVehicles.length;

export type VehicleInput = {
  plate: string;
  make: string;
  model: string;
  year: number;
  color: string;
  /**
   * Optional because the apartment tab's short form does not ask for it. The
   * Parking screen carries the full field set and sets it explicitly.
   */
  type?: VehicleType;
};

function normalise(input: VehicleInput) {
  return {
    plate: input.plate.trim().toUpperCase(),
    type: input.type ?? "Car",
    make: input.make.trim(),
    model: input.model.trim(),
    year: input.year,
    color: input.color.trim(),
  };
}

/**
 * Adds a car to the tenancy.
 *
 * It lands at `Pending`: the property checks the plate against the bay before
 * the gate will recognise it, and marking it Active here would tell the tenant
 * something nobody has confirmed.
 */
export function registerTenVehicle(input: VehicleInput): TenVehicle {
  const vehicle: TenVehicle = {
    id: `TVEH-${++vehicleSeq}`,
    ...normalise(input),
    status: "Pending",
  };

  vehicles = [...vehicles, vehicle];
  emit();

  pushTenNotification(
    "Parking",
    "Vehicle Registered",
    `${vehicleName(vehicle)} · ${vehicle.plate} · awaiting approval.`,
  );

  return vehicle;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function snapshot() {
  return vehicles;
}

function seed() {
  return tenantVehicles;
}

export function useTenVehicles() {
  return useSyncExternalStore(subscribe, snapshot, seed);
}

/** The bay never changes in this mock, but the hook keeps the view uniform. */
export function useTenParking(): TenParkingSlot {
  return tenantParkingSlot;
}
