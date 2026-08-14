"use client";

import { useSyncExternalStore } from "react";

import {
  materialRequests as seed,
  type FsMaterialRequest,
  type MaterialStatus,
} from "@/lib/fs/materials-data";

/**
 * Material requests held in a module store so a decision taken in the dialog
 * updates the row behind it. Resets on reload like the other mock stores.
 */

let requests: FsMaterialRequest[] = seed;
const listeners = new Set<() => void>();

/**
 * Records the decision and the line that goes with it. The note is the record
 * of why — an approval with no reason is no use to whoever reads it later.
 */
export function setMaterialRequestStatus(
  id: string,
  status: MaterialStatus,
  notes: string,
) {
  requests = requests.map((request) =>
    request.id === id ? { ...request, status, notes } : request,
  );

  listeners.forEach((listener) => listener());
}

/**
 * Corrects what was asked for before the decision is made — technicians
 * routinely over- or under-order, and the supervisor trims it rather than
 * bouncing the request back.
 */
export function setMaterialRequestQuantity(id: string, quantity: string) {
  requests = requests.map((request) =>
    request.id === id ? { ...request, quantity } : request,
  );

  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return requests;
}

function getServerSnapshot() {
  return seed;
}

export function useFsMaterialRequests() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
