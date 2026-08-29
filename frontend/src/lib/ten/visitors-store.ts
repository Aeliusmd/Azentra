"use client";

import { useSyncExternalStore } from "react";

import { longDate, minutesOf } from "@/lib/res/format";
import {
  tenVisitorPasses,
  type VisitorPass,
  type VisitorVehicle,
} from "@/lib/ten/visitors-data";
import { pushTenNotification } from "@/lib/ten/notifications-store";

/**
 * The tenant's visitor passes.
 *
 * Two writes, and only two: raising a pass and calling one off. Checking a
 * visitor in or out is the gate's, and has no path through here — a tenant says
 * who is expected, Security says who actually came.
 */

let passes: VisitorPass[] = tenVisitorPasses;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

/** Continues the seeded numbering rather than restarting it. */
let nextNumber = 1191;

/**
 * How long a pass stays valid from the expected arrival.
 *
 * The form asks for one time, not a window, so the pass is given a sensible
 * span rather than an open-ended one — a gate pass with no end is not a pass.
 */
const PASS_HOURS = 3;

/** Visitor bays the property keeps for guests, handed out in order. */
const VISITOR_BAYS = ["B1-V02", "B1-V07", "B1-V11", "B1-V14"];
let bayIndex = 0;

function endOf(from: string) {
  const minutes = Math.min(minutesOf(from) + PASS_HOURS * 60, 23 * 60 + 59);
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(
    minutes % 60,
  ).padStart(2, "0")}`;
}

export function createTenVisitorPass({
  name,
  phone,
  date,
  from,
  purpose,
  vehicle,
  parkingRequired,
}: {
  name: string;
  phone: string;
  date: string;
  from: string;
  purpose: string;
  vehicle: VisitorVehicle | null;
  parkingRequired: boolean;
}): VisitorPass {
  /**
   * The bay is allotted, not chosen: which guest space a visitor gets is the
   * property's to decide, so the form asks only whether one is needed.
   */
  const parkingBay = parkingRequired
    ? VISITOR_BAYS[bayIndex++ % VISITOR_BAYS.length]
    : null;

  const pass: VisitorPass = {
    id: `VP-2026-${nextNumber++}`,
    name: name.trim(),
    phone: phone.trim(),
    date,
    from,
    to: endOf(from),
    purpose: purpose.trim() || "Visit",
    vehicle,
    parkingBay,
    status: "Upcoming",
    checkedInAt: null,
    checkedOutAt: null,
  };

  passes = [pass, ...passes];
  emit();

  pushTenNotification(
    "Visitor",
    "Visitor Pass Created",
    `${pass.name} · ${longDate(date)} · pass ${pass.id}.`,
  );

  return pass;
}

/** Calls a pass off before the visitor arrives. */
export function cancelTenVisitorPass(id: string) {
  const pass = passes.find((entry) => entry.id === id);
  if (!pass) return;

  passes = passes.map((entry) =>
    entry.id === id ? { ...entry, status: "Cancelled" } : entry,
  );
  emit();

  pushTenNotification(
    "Visitor",
    "Visitor Pass Cancelled",
    `${pass.name} · ${longDate(pass.date)} has been cancelled.`,
  );
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return passes;
}

function getServerSnapshot() {
  return tenVisitorPasses;
}

export function useTenVisitors() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
