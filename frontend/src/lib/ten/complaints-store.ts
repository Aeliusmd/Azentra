"use client";

import { useSyncExternalStore } from "react";

import {
  tenComplaints,
  type ComplaintCategory,
  type TenComplaint,
} from "@/lib/ten/complaints-data";
import { pushTenNotification } from "@/lib/ten/notifications-store";
import type { TenUpload } from "@/lib/ten/uploads";

/**
 * The tenant's complaints.
 *
 * One write, and only one: raising a complaint. Moving it along, resolving it
 * and writing the response are the property's, and none of them has a path
 * through here — which is why a tenant cannot mark their own complaint
 * resolved.
 */

let complaints: TenComplaint[] = tenComplaints;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

/** Continues the seeded numbering rather than restarting it. */
let nextNumber = 46;

export function submitTenComplaint({
  category,
  description,
  attachments,
  today,
  time,
}: {
  category: ComplaintCategory;
  description: string;
  attachments: TenUpload[];
  today: string;
  /** 24-hour `HH:MM` — the timeline's first stamp. */
  time: string;
}): TenComplaint {
  const complaint: TenComplaint = {
    id: `CMP-2026-00${nextNumber++}`,
    category,
    description: description.trim(),
    submitted: today,
    status: "Submitted",
    timeline: [{ label: "Complaint Submitted", date: today, time }],
    response: null,
    respondedBy: null,
    attachments,
  };

  complaints = [complaint, ...complaints];
  emit();

  pushTenNotification(
    "Announcement",
    "Complaint Submitted",
    `${complaint.id} · ${category} · the property will look into it.`,
  );

  return complaint;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return complaints;
}

function getServerSnapshot() {
  return tenComplaints;
}

export function useTenComplaints() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
