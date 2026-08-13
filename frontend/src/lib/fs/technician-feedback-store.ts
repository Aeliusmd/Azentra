"use client";

import { useSyncExternalStore } from "react";

/**
 * Internal notes the supervisor writes about a technician — never shown to the
 * technician, which is why they live here rather than on the work order.
 * Module-level so a note written on the performance page is still there when
 * the dialog is reopened; resets on reload like the other mock stores.
 */

export type TechnicianFeedback = {
  id: number;
  technicianId: string;
  author: string;
  /** `YYYY-MM-DD HH:MM`. */
  time: string;
  text: string;
};

let feedback: TechnicianFeedback[] = [];
let nextId = 1;
const listeners = new Set<() => void>();

/** `YYYY-MM-DD HH:MM` for a note written right now. */
function stamp() {
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

export function addTechnicianFeedback(technicianId: string, text: string) {
  feedback = [
    { id: nextId++, technicianId, author: "Carlos Rivera", time: stamp(), text },
    ...feedback,
  ];
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return feedback;
}

const EMPTY: TechnicianFeedback[] = [];

function getServerSnapshot() {
  return EMPTY;
}

export function useTechnicianFeedback() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
