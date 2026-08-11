"use client";

import { useSyncExternalStore } from "react";

import {
  assignedJobs,
  type Job,
  type JobCompletion,
  type JobLabour,
  type JobMaterial,
  type JobPhoto,
  type PhotoSlot,
} from "@/lib/tech/jobs-data";

/**
 * The technician's own jobs, held in a module store so a status change on the
 * My Work page is reflected on the dashboard and the job detail view. Resets on
 * reload like the other mock stores.
 *
 * Every action here moves a job the technician already owns along its own
 * lifecycle — nothing assigns work, to them or to anyone else.
 */

let jobs: Job[] = assignedJobs;
const listeners = new Set<() => void>();

function update(id: string, patch: Partial<Job>) {
  jobs = jobs.map((job) => (job.id === id ? { ...job, ...patch } : job));
  listeners.forEach((listener) => listener());
}

/** `YYYY-MM-DD HH:MM` for a timeline entry written right now. */
function stamp() {
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

/** Appends to the job's history alongside whatever else changed. */
function record(id: string, label: string, patch: Partial<Job> = {}) {
  const job = jobs.find((item) => item.id === id);
  if (!job) return;
  update(id, {
    ...patch,
    timeline: [...job.timeline, { time: stamp(), label }],
  });
}

export function acceptJob(id: string) {
  record(id, "Accepted by you", { status: "Accepted" });
}

/** Sends the job back to the supervisor with a reason; it is not reassigned. */
export function declineJob(id: string, reason: string) {
  record(id, "Sent back to supervisor", {
    status: "On Hold",
    declineReason: reason,
  });
}

export function startJob(id: string) {
  record(id, "Work started", { status: "In Progress", progress: 10 });
}

/** Closing a job needs the completion form, so this only moves the bar. */
export function setJobProgress(id: string, progress: number) {
  const clamped = Math.max(0, Math.min(100, Math.round(progress)));
  update(id, { status: "In Progress", progress: clamped });
}

export function completeJob(id: string, completion: JobCompletion) {
  record(id, `Marked complete by you — ${completion.result}`, {
    status: "Completed",
    progress: 100,
    completion,
  });
}

/** Parks the job mid-work; the technician keeps it and can resume. */
export function pauseJob(id: string) {
  record(id, "Work paused by you", { status: "On Hold" });
}

/** Flags the job for supervisor attention without changing who owns it. */
export function escalateJob(id: string, note: string) {
  record(id, `Escalated to supervisor — ${note}`, { escalation: note });
}

export function resumeJob(id: string) {
  record(id, "Work resumed", { status: "In Progress" });
}

/* ------------------------------- Work log -------------------------------- */

let entryId = 0;
const nextId = (prefix: string) => `${prefix}-${++entryId}`;

export function addJobNote(id: string, text: string, time: string) {
  const job = jobs.find((item) => item.id === id);
  if (!job) return;
  update(id, { notes: [...job.notes, { id: nextId("note"), time, text }] });
}

export function addJobMaterial(id: string, material: Omit<JobMaterial, "id">) {
  const job = jobs.find((item) => item.id === id);
  if (!job) return;
  update(id, {
    materials: [...job.materials, { ...material, id: nextId("material") }],
  });
}

export function removeJobMaterial(id: string, materialId: string) {
  const job = jobs.find((item) => item.id === id);
  if (!job) return;
  update(id, {
    materials: job.materials.filter((material) => material.id !== materialId),
  });
}

export function addJobLabour(id: string, entry: Omit<JobLabour, "id">) {
  const job = jobs.find((item) => item.id === id);
  if (!job) return;
  update(id, { labour: [...job.labour, { ...entry, id: nextId("labour") }] });
}

export function removeJobLabour(id: string, labourId: string) {
  const job = jobs.find((item) => item.id === id);
  if (!job) return;
  update(id, { labour: job.labour.filter((entry) => entry.id !== labourId) });
}

export function setJobPhoto(id: string, slot: PhotoSlot, photo: JobPhoto) {
  const job = jobs.find((item) => item.id === id);
  if (!job) return;
  update(id, { photos: { ...job.photos, [slot]: photo } });
}

export function setJobPhotoCaption(
  id: string,
  slot: PhotoSlot,
  caption: string,
) {
  const job = jobs.find((item) => item.id === id);
  const photo = job?.photos[slot];
  if (!job || !photo) return;
  update(id, { photos: { ...job.photos, [slot]: { ...photo, caption } } });
}

export function removeJobPhoto(id: string, slot: PhotoSlot) {
  const job = jobs.find((item) => item.id === id);
  const photo = job?.photos[slot];
  if (!job || !photo) return;

  // The preview is an object URL — release it so the blob can be collected.
  URL.revokeObjectURL(photo.url);

  const photos = { ...job.photos };
  delete photos[slot];
  update(id, { photos });
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return jobs;
}

function getServerSnapshot() {
  return assignedJobs;
}

export function useTechJobs() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
