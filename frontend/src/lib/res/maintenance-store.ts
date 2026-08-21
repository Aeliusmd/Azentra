"use client";

import { useSyncExternalStore } from "react";

import {
  maintenanceRequests,
  type MaintenanceRequest,
  type RequestCategory,
  type RequestPhoto,
  type RequestPriority,
} from "@/lib/res/maintenance-data";
import { pushResNotification } from "@/lib/res/notifications-store";

/**
 * The household's maintenance requests.
 *
 * Module-level so a request raised in the dialog appears on the list, the
 * dashboard tile and the bell without any of them being told. Resets on reload
 * like the other mock stores.
 */

let requests: MaintenanceRequest[] = maintenanceRequests;
const listeners = new Set<() => void>();

/** Continues the seeded numbering rather than restarting it. */
let nextNumber = 846;

/**
 * Raises a new request.
 *
 * It lands at `Submitted` with nobody assigned and no date — those are the
 * property's to set, and pretending otherwise would promise the resident
 * something nobody has agreed to yet.
 */
export function submitResidentRequest({
  category,
  description,
  priority,
  photos,
  today,
  time,
}: {
  category: RequestCategory;
  description: string;
  priority: RequestPriority;
  photos: RequestPhoto[];
  today: string;
  /** 24-hour `HH:MM` the request was raised at. */
  time: string;
}): MaintenanceRequest {
  const request: MaintenanceRequest = {
    id: `MR-2026-0${nextNumber++}`,
    description: description.trim(),
    category,
    location: "",
    submitted: today,
    appointment: null,
    time,
    priority,
    status: "Submitted",
    technician: null,
    photos,
  };

  requests = [request, ...requests];
  listeners.forEach((listener) => listener());

  pushResNotification(
    "Maintenance",
    "Request Submitted",
    `${request.id} · ${category} · we will confirm a visit shortly.`,
  );

  return request;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return requests;
}

function getServerSnapshot() {
  return maintenanceRequests;
}

export function useResRequests() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
