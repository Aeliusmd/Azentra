"use client";

import { useSyncExternalStore } from "react";

import {
  tenMaintenanceRequests,
  type RequestCategory,
  type RequestPriority,
  type TenMaintenanceRequest,
} from "@/lib/ten/maintenance-data";
import { pushTenNotification } from "@/lib/ten/notifications-store";
import type { TenUpload } from "@/lib/ten/uploads";

/**
 * The tenant's maintenance requests.
 *
 * Module-level so a request raised in the dialog appears on the list, the
 * dashboard card and the bell without any of them being told. Resets on reload
 * like the other mock stores.
 *
 * Two writes exist, and only two: raising a request and confirming one that was
 * finished. Assigning a technician, booking the visit and marking work complete
 * are the property's, and this store offers no way to do any of them.
 */

let requests: TenMaintenanceRequest[] = tenMaintenanceRequests;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

/** Continues the seeded numbering rather than restarting it. */
let nextNumber = 846;

/**
 * Raises a new request.
 *
 * It lands at `Submitted` with nobody assigned and no booked visit — those are
 * the property's to set, and pretending otherwise would promise the tenant
 * something nobody has agreed to yet.
 */
export function submitTenRequest({
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
  photos: TenUpload[];
  today: string;
  /** 24-hour `HH:MM` the request was raised at — the timeline's first stamp. */
  time: string;
}): TenMaintenanceRequest {
  const request: TenMaintenanceRequest = {
    id: `MR-2026-0${nextNumber++}`,
    description: description.trim(),
    category,
    location: "",
    submitted: today,
    preferredDate: null,
    preferredTime: null,
    appointment: null,
    appointmentTime: null,
    priority,
    status: "Submitted",
    technician: null,
    completedOn: null,
    completionNote: null,
    materials: [],
    timeline: [{ label: "Request Created", date: today, time }],
    photos,
  };

  requests = [request, ...requests];
  emit();

  pushTenNotification(
    "Maintenance",
    "Request Submitted",
    `${request.id} · ${category} · we will confirm a visit shortly.`,
  );

  return request;
}

/**
 * The tenant signing off finished work.
 *
 * Only a `Completed` request can be confirmed — a tenant cannot close work that
 * nobody has said is done. This is the one status change this portal can make.
 */
export function confirmTenResolution(id: string, today: string, time: string) {
  const request = requests.find((entry) => entry.id === id);
  if (!request || request.status !== "Completed") return;

  requests = requests.map((entry) =>
    entry.id === id
      ? {
          ...entry,
          status: "Closed",
          timeline: [
            ...entry.timeline,
            { label: "Confirmed by Tenant", date: today, time },
          ],
        }
      : entry,
  );
  emit();

  pushTenNotification(
    "Maintenance",
    "Resolution Confirmed",
    `${request.id} · ${request.category} · thank you for confirming.`,
  );
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return requests;
}

function getServerSnapshot() {
  return tenMaintenanceRequests;
}

export function useTenRequests() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
