"use client";

import { useSyncExternalStore } from "react";

import type { JobPhoto, PhotoSlot } from "@/lib/tech/jobs-data";
import {
  preventiveTasks,
  type PreventiveTask,
} from "@/lib/tech/preventive-data";

/**
 * The technician's own preventive tasks. Module-level so a started task stays
 * started while they move around; resets on reload like the other mock stores.
 */

let tasks: PreventiveTask[] = preventiveTasks;
const listeners = new Set<() => void>();

function update(id: string, patch: Partial<PreventiveTask>) {
  tasks = tasks.map((task) => (task.id === id ? { ...task, ...patch } : task));
  listeners.forEach((listener) => listener());
}

export function startTask(id: string) {
  update(id, { status: "In Progress" });
}

export function toggleChecklistItem(id: string, itemId: string) {
  const task = tasks.find((item) => item.id === id);
  if (!task) return;
  update(id, {
    checklist: task.checklist.map((item) =>
      item.id === itemId ? { ...item, done: !item.done } : item,
    ),
  });
}

export function setTaskNotes(id: string, notes: string) {
  update(id, { notes });
}

export function setTaskPhoto(id: string, slot: PhotoSlot, photo: JobPhoto) {
  const task = tasks.find((item) => item.id === id);
  if (!task) return;
  update(id, { photos: { ...task.photos, [slot]: photo } });
}

export function setTaskPhotoCaption(
  id: string,
  slot: PhotoSlot,
  caption: string,
) {
  const task = tasks.find((item) => item.id === id);
  const photo = task?.photos[slot];
  if (!task || !photo) return;
  update(id, { photos: { ...task.photos, [slot]: { ...photo, caption } } });
}

export function removeTaskPhoto(id: string, slot: PhotoSlot) {
  const task = tasks.find((item) => item.id === id);
  const photo = task?.photos[slot];
  if (!task || !photo) return;

  // The preview is an object URL — release it so the blob can be collected.
  URL.revokeObjectURL(photo.url);

  const photos = { ...task.photos };
  delete photos[slot];
  update(id, { photos });
}

/** Closes the task out; the next service date is the supervisor's to reschedule. */
export function completeTask(id: string, completedOn: string) {
  update(id, { status: "Completed", lastService: completedOn });
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return tasks;
}

function getServerSnapshot() {
  return preventiveTasks;
}

export function usePreventiveTasks() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
