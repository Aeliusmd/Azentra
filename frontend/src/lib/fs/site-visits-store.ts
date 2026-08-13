"use client";

import { useSyncExternalStore } from "react";

import { propertyName } from "@/lib/fs/properties";
import {
  checksFor,
  nextSiteVisitId,
  siteVisits as seed,
  type SiteVisit,
  type SiteVisitPurpose,
  type SiteVisitStatus,
} from "@/lib/fs/site-visits-data";

/**
 * Site visits held in a module store so one booked from the dashboard shows up
 * on the dashboard's own panel and, later, the site visits page. Resets on
 * reload like the other mock stores.
 */

let visits: SiteVisit[] = seed;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

export type NewSiteVisitInput = {
  propertyId: string;
  building: string;
  floor: string;
  location: string;
  purpose: SiteVisitPurpose;
  participants: string[];
  summary: string;
  date: string;
  /** 12h `HH:MM AM`. */
  time: string;
  workOrderId?: string | null;
};

export function addSiteVisit(input: NewSiteVisitInput) {
  const id = nextSiteVisitId(visits);

  const visit: SiteVisit = {
    id,
    propertyId: input.propertyId,
    property: propertyName(input.propertyId),
    building: input.building,
    location: input.location,
    floor: input.floor || undefined,
    participants:
      input.participants.length > 0 ? input.participants : undefined,
    workOrderId: input.workOrderId ?? null,
    // The supervisor books their own round; a technician is only named once
    // one is asked to meet them there.
    technician: null,
    date: input.date,
    time: input.time,
    purpose: input.purpose,
    summary: input.summary || input.purpose,
    status: "Scheduled",
    checklist: checksFor(input.purpose, id),
    observations: "",
    notes: "",
    photos: [],
    followUp: null,
  };

  visits = [visit, ...visits];
  emit();

  return id;
}

export function setSiteVisitStatus(id: string, status: SiteVisitStatus) {
  visits = visits.map((visit) =>
    visit.id === id ? { ...visit, status } : visit,
  );
  emit();
}

/** Ticked on site as the supervisor works down the round. */
export function toggleVisitCheck(id: string, itemId: string) {
  visits = visits.map((visit) =>
    visit.id === id
      ? {
          ...visit,
          checklist: visit.checklist.map((item) =>
            item.id === itemId ? { ...item, done: !item.done } : item,
          ),
        }
      : visit,
  );
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return visits;
}

function getServerSnapshot() {
  return seed;
}

export function useFsSiteVisits() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
