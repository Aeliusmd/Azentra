"use client";

import { useSyncExternalStore } from "react";

import { pushSoNotification } from "@/lib/so/notifications-store";
import { parkingSlots, type ParkingSlot } from "@/lib/so/parking-data";
import { showSoToast } from "@/lib/so/toast-store";

/**
 * The deck's live state.
 *
 * One write: giving a bay back. A guard does not hand bays out from here —
 * a bay is spoken for by approving the request that asked for it, so there is
 * one place that decision is made and the deck follows it.
 */

let slots: ParkingSlot[] = parkingSlots;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

/**
 * Frees a bay and forgets who was in it.
 *
 * `announce` is what separates a guard pressing Release from a bay falling
 * free because the request holding it was refused: the first is worth a
 * confirmation on screen, the second already has one from the refusal.
 */
function release(id: string, announce: boolean) {
  const slot = slots.find((entry) => entry.id === id);
  if (!slot || slot.status === "Available") return;

  const holder = slot.holder;

  slots = slots.map((entry) =>
    entry.id === id
      ? { ...entry, status: "Available" as const, holder: null }
      : entry,
  );
  emit();

  pushSoNotification(
    "Parking",
    "Bay Released",
    holder
      ? `${slot.id} freed after ${holder.name} (${holder.plate}).`
      : `${slot.id} freed.`,
  );

  if (announce) {
    showSoToast(
      holder ? `${slot.id} released · ${holder.name}` : `${slot.id} released`,
    );
  }
}

/** Frees a bay from the allocation table. */
export function releaseSoSlot(id: string) {
  release(id, true);
}

/** Drops the hold a rejected request was given, so the bay goes back. */
export function releaseSlotForVisit(visitId: string) {
  const slot = slots.find((entry) => entry.holder?.visitId === visitId);
  if (slot) release(slot.id, false);
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return slots;
}

function getServerSnapshot() {
  return parkingSlots;
}

export function useSoParkingSlots() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
