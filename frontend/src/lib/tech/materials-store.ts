"use client";

import { useSyncExternalStore } from "react";

import {
  materialRequests,
  nextRequestId,
  type MaterialRequest,
} from "@/lib/tech/materials-data";

/**
 * The technician's own material requests. Module-level so a new request shows up
 * on the Requests tab immediately; resets on reload like the other mock stores.
 *
 * Requests are raised here and approved elsewhere — nothing in this store can
 * approve one.
 */

let requests: MaterialRequest[] = materialRequests;
const listeners = new Set<() => void>();

export function addMaterialRequest(
  request: Omit<MaterialRequest, "id" | "status">,
) {
  requests = [
    ...requests,
    { ...request, id: nextRequestId(requests), status: "Pending Approval" },
  ];
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
  return materialRequests;
}

export function useMaterialRequests() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
