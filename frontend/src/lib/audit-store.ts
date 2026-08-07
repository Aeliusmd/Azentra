"use client";

import { useSyncExternalStore } from "react";

import {
  auditSeed,
  type AuditEntry,
  type AuditModule,
} from "@/lib/audit-data";

/**
 * In-memory audit trail, newest first.
 *
 * Module-level so entries survive client-side navigation between admin pages —
 * create a tower, then open Audit Logs and the entry is there. Like every other
 * mock store in this app it resets on a full reload; swap for an API call once
 * the backend can persist it.
 */
let entries: AuditEntry[] = auditSeed;
const listeners = new Set<() => void>();
let counter = 0;

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function stamp(date: Date) {
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    ` ${pad(date.getHours())}:${pad(date.getMinutes())}`
  );
}

export type AuditInput = {
  action: string;
  module: AuditModule;
  details: string;
  performedBy?: string;
  company?: string;
};

export function recordAudit({
  action,
  module,
  details,
  performedBy = "Sarah Chen",
  company = "Sunrise Residence",
}: AuditInput) {
  const entry: AuditEntry = {
    id: `live-${++counter}`,
    timestamp: stamp(new Date()),
    action,
    module,
    details,
    performedBy,
    company,
  };

  // Replace the array so getSnapshot returns a new reference exactly once.
  entries = [entry, ...entries];
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return entries;
}

function getServerSnapshot() {
  return auditSeed;
}

export function useAuditLog() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
