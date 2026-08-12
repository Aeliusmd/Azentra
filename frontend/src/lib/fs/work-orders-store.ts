"use client";

import { useSyncExternalStore } from "react";

import { pushFsNotification } from "@/lib/fs/notifications-store";
import { propertyName } from "@/lib/fs/properties";
import {
  nextWorkOrderId,
  splitLocation,
  workOrders as seed,
  type FsWorkOrder,
  type FsWorkOrderPriority,
  type FsWorkOrderSource,
  type FsWorkOrderStatus,
  type FsWorkType,
} from "@/lib/fs/work-orders-data";

/**
 * Every work order the supervisor coordinates, held in a module store so an
 * assignment made on one page shows up on the dashboard, the schedule and the
 * progress monitor at once. Resets on reload like the other mock stores.
 */

let orders: FsWorkOrder[] = seed;
const listeners = new Set<() => void>();

function update(id: string, patch: Partial<FsWorkOrder>) {
  orders = orders.map((order) =>
    order.id === id ? { ...order, ...patch } : order,
  );
  listeners.forEach((listener) => listener());
}

/** `YYYY-MM-DD HH:MM` for a note written right now. */
function stamp() {
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

let noteId = 0;

/**
 * Appends a supervisor note and the matching timeline step alongside whatever
 * else changed, so the detail modal's history stays in step with the record.
 */
function withNote(
  id: string,
  text: string,
  patch: Partial<FsWorkOrder> = {},
  eventLabel?: string,
) {
  const order = orders.find((item) => item.id === id);
  if (!order) return;

  const time = stamp();

  update(id, {
    ...patch,
    notes: [
      ...order.notes,
      { id: `sup-note-${++noteId}`, author: "Carlos Rivera", time, text },
    ],
    events: [...(order.events ?? []), { label: eventLabel ?? text, time }],
  });
}

export type NewWorkOrderInput = {
  propertyId: string;
  title: string;
  priority: FsWorkOrderPriority;
  /**
   * The space within the building. Free text like `Tower B, Basement` is split
   * into a building and a space unless `building` is given outright.
   */
  location: string;
  building?: string;
  description: string;
  source?: FsWorkOrderSource;
  workType?: FsWorkType;
  /** Left out or empty means the job goes to the unassigned queue. */
  technician?: string;
  checklist?: string[];
  /** ISO `YYYY-MM-DD`, blank if the supervisor left it open. */
  date: string;
  /** 12h `HH:MM AM`, blank if the supervisor left it open. */
  time: string;
};

/** Raises a job from one of the supervisor's own forms. */
export function createWorkOrder(input: NewWorkOrderInput) {
  const id = nextWorkOrderId(orders, input.propertyId);
  const split = splitLocation(input.location);
  const building = input.building ?? split.building;
  const location = input.building ? input.location.trim() : split.location;
  const scheduled = input.date !== "" && input.time !== "";
  const now = stamp();

  const order: FsWorkOrder = {
    id,
    title: input.title,
    description: input.description,
    propertyId: input.propertyId,
    property: propertyName(input.propertyId),
    building,
    location,
    category: "General",
    workType: input.workType,
    checklist:
      input.checklist && input.checklist.length > 0
        ? input.checklist
        : undefined,
    priority: input.priority,
    status: input.technician ? "Assigned" : "Unassigned",
    technician: input.technician || null,
    requestedBy: "Carlos Rivera",
    source: input.source,
    requestedAt: now,
    reviewedAt: now,
    assignedAt: input.technician ? now : undefined,
    scheduledDate: scheduled ? input.date : null,
    scheduledTime: scheduled ? input.time : null,
    durationHours: null,
    dueDate: input.date || now.slice(0, 10),
    progress: 0,
    notes: [],
    photos: [],
    materials: [],
    labour: [],
    events: [{ label: "Raised by supervisor", time: now }],
  };

  orders = [order, ...orders];
  listeners.forEach((listener) => listener());

  return id;
}

export type EmergencyWorkOrderInput = {
  propertyId: string;
  title: string;
  location: string;
  description: string;
  technician: string;
};

/**
 * Emergency jobs skip the queue: always critical, always assigned, always
 * booked for right now, and they raise a notification of their own.
 */
export function createEmergencyWorkOrder(input: EmergencyWorkOrderInput) {
  const now = stamp();
  const [date, clock] = now.split(" ");
  const [hours, minutes] = clock.split(":").map(Number);
  const meridiem = hours < 12 ? "AM" : "PM";
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;

  const id = createWorkOrder({
    propertyId: input.propertyId,
    title: input.title,
    workType: "Emergency",
    priority: "Critical",
    location: input.location,
    description: input.description,
    technician: input.technician,
    checklist: [],
    date,
    time: `${String(hour12).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${meridiem}`,
  });

  pushFsNotification({
    title: "Emergency Maintenance",
    detail: `${input.title} (${id}) raised as critical and assigned to ${input.technician}.`,
    kind: "Emergency",
  });

  return id;
}

export type ScheduleInput = {
  /** ISO `YYYY-MM-DD`. */
  date: string;
  /** 12h `HH:MM AM`. */
  time: string;
  durationHours: number;
  dueDate: string;
};

/** First assignment — the job leaves the unassigned queue. */
export function assignTechnician(id: string, technician: string) {
  withNote(
    id,
    `Assigned to ${technician}`,
    { technician, status: "Assigned", assignedAt: stamp() },
    `Assigned to ${technician}`,
  );
}

/** Hand-over to someone else; the job keeps its schedule and progress. */
export function reassignTechnician(
  id: string,
  technician: string,
  reason: string,
) {
  const order = orders.find((item) => item.id === id);
  if (!order) return;

  withNote(
    id,
    `Reassigned from ${order.technician ?? "Unassigned"} to ${technician}${
      reason ? ` — ${reason}` : ""
    }`,
    {
      technician,
      status: order.status === "Unassigned" ? "Assigned" : order.status,
      assignedAt: stamp(),
    },
    `Reassigned to ${technician}`,
  );
}

/** Sends a job back to the queue without deleting anything already logged. */
export function unassignTechnician(id: string, reason: string) {
  withNote(id, `Returned to the unassigned queue${reason ? ` — ${reason}` : ""}`, {
    technician: null,
    status: "Unassigned",
  });
}

export function scheduleJob(id: string, input: ScheduleInput) {
  const order = orders.find((item) => item.id === id);
  if (!order) return;

  const rescheduled = order.scheduledDate !== null;

  withNote(
    id,
    `${rescheduled ? "Rescheduled" : "Scheduled"} for ${input.date} at ${input.time}`,
    {
      scheduledDate: input.date,
      scheduledTime: input.time,
      durationHours: input.durationHours,
      dueDate: input.dueDate,
      // A job that was overdue is back in play once it has a new slot.
      status: order.status === "Overdue" ? "Assigned" : order.status,
    },
    `${rescheduled ? "Rescheduled" : "Scheduled"} for ${input.date}, ${input.time}`,
  );
}

/** A free-text note from the supervisor, with no other change to the job. */
export function addSupervisorNote(id: string, text: string) {
  withNote(id, text, {}, "Supervisor note added");
}

/** Parks the job without letting go of it — the technician keeps the work. */
export function putOnHold(id: string, reason: string) {
  withNote(
    id,
    `Put on hold${reason ? ` — ${reason}` : ""}`,
    { status: "On Hold", delayReason: reason || undefined },
    "Put on hold",
  );
}

export function resumeWork(id: string) {
  withNote(
    id,
    "Taken off hold",
    { status: "In Progress", delayReason: undefined },
    "Work resumed",
  );
}

export function setWorkOrderStatus(id: string, status: FsWorkOrderStatus) {
  withNote(id, `Status changed to ${status}`, { status });
}

export function setWorkOrderProgress(id: string, progress: number) {
  update(id, { progress: Math.max(0, Math.min(100, Math.round(progress))) });
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return orders;
}

function getServerSnapshot() {
  return seed;
}

export function useFsWorkOrders() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
