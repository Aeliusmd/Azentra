"use client";

import { useSyncExternalStore } from "react";

import {
  complaints,
  type Complaint,
  type ComplaintCategory,
} from "@/lib/res/complaints-data";
import { pushResNotification } from "@/lib/res/notifications-store";
import type { ResUpload } from "@/lib/res/uploads";

/**
 * The household's complaints.
 *
 * Module-level so one raised in the dialog appears on the list and the bell at
 * once. Resets on reload like the other mock stores.
 */

let items: Complaint[] = complaints;
const listeners = new Set<() => void>();

/** Continues the seeded numbering rather than restarting it. */
let nextNumber = 43;

/**
 * Raises a complaint.
 *
 * It starts at `Submitted` with one event to its name. Nobody has looked at it
 * yet, and saying otherwise would put words in the property manager's mouth.
 */
export function submitComplaint({
  category,
  description,
  evidence,
  today,
  time,
}: {
  category: ComplaintCategory;
  description: string;
  evidence: ResUpload[];
  today: string;
  /** 24-hour `HH:MM` it was raised at. */
  time: string;
}): Complaint {
  const complaint: Complaint = {
    id: `CMP-2026-00${nextNumber++}`,
    category,
    description: description.trim(),
    status: "Submitted",
    events: [{ label: "Complaint Submitted", date: today, time }],
    evidence,
  };

  items = [complaint, ...items];
  listeners.forEach((listener) => listener());

  pushResNotification(
    "Complaint",
    "Complaint Submitted",
    `${complaint.id} · ${category} · the property manager will review it.`,
  );

  return complaint;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return items;
}

function getServerSnapshot() {
  return complaints;
}

export function useResComplaints() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
