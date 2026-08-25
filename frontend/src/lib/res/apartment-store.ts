"use client";

import { useSyncExternalStore } from "react";

import {
  parkingSlots,
  tenants,
  vehicles,
  vehicleName,
  type ParkingSlot,
  type Tenant,
  type Vehicle,
} from "@/lib/res/apartment-data";
import { pushResNotification } from "@/lib/res/notifications-store";

/**
 * The unit's vehicles and tenants.
 *
 * Parking bays are read-only here: how many a unit gets, and which one, is the
 * property's allocation to make. A resident can add the car that sits in theirs;
 * they cannot hand themselves another bay.
 */

let allVehicles: Vehicle[] = vehicles;
let allTenants: Tenant[] = tenants;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

let vehicleSeq = vehicles.length;
let tenantSeq = tenants.length;

/**
 * Adds a car to the unit.
 *
 * It lands at `Pending`: the property checks the plate against the bay before
 * the gate will recognise it, and marking it Active here would tell the resident
 * something nobody has confirmed.
 */
export function registerVehicle(input: {
  make: string;
  model: string;
  year: number;
  color: string;
  plate: string;
}): Vehicle {
  const vehicle: Vehicle = {
    id: `VEH-${++vehicleSeq}`,
    make: input.make.trim(),
    model: input.model.trim(),
    year: input.year,
    color: input.color.trim(),
    plate: input.plate.trim().toUpperCase(),
    status: "Pending",
  };

  allVehicles = [...allVehicles, vehicle];
  emit();

  pushResNotification(
    "Maintenance",
    "Vehicle Registered",
    `${vehicleName(vehicle)} · ${vehicle.plate} · awaiting approval.`,
  );

  return vehicle;
}

/**
 * Invites someone onto the lease.
 *
 * `Invited` until they accept — the resident has sent an invitation, not signed
 * anybody up.
 */
export function inviteTenant(input: {
  name: string;
  email: string;
  phone: string;
  leaseStart: string;
  leaseEnd: string;
  rent: number;
}): Tenant {
  const tenant: Tenant = {
    id: `TEN-${++tenantSeq}`,
    name: input.name.trim(),
    email: input.email.trim(),
    phone: input.phone.trim(),
    leaseStart: input.leaseStart,
    leaseEnd: input.leaseEnd,
    rent: input.rent,
    status: "Invited",
  };

  allTenants = [...allTenants, tenant];
  emit();

  pushResNotification(
    "Announcement",
    "Tenant Invited",
    `${tenant.name} has been invited to the lease on your unit.`,
  );

  return tenant;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function vehicleSnapshot() {
  return allVehicles;
}

function vehicleSeed() {
  return vehicles;
}

export function useResVehicles() {
  return useSyncExternalStore(subscribe, vehicleSnapshot, vehicleSeed);
}

function tenantSnapshot() {
  return allTenants;
}

function tenantSeed() {
  return tenants;
}

export function useResTenants() {
  return useSyncExternalStore(subscribe, tenantSnapshot, tenantSeed);
}

/** Bays never change in this mock, but the hook keeps the view uniform. */
export function useResParking(): ParkingSlot[] {
  return parkingSlots;
}
