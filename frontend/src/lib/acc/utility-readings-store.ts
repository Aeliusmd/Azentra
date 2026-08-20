"use client";

import { useSyncExternalStore } from "react";

import { pushAccNotification } from "@/lib/acc/notifications-store";
import { billingPeriods } from "@/lib/acc/periods";
import {
  seedUtilityReadings,
  UTILITY_RATES,
  type UtilityReading,
} from "@/lib/acc/utility-bills-data";

/**
 * Every meter reading on file, held in a module store so a round entered on
 * the readings screen shows up on the utility bills it charges. Resets on
 * reload like the other mock stores.
 */

const seed = seedUtilityReadings(billingPeriods.map((period) => period.id));

let readings: UtilityReading[] = seed;
const listeners = new Set<() => void>();

/** A current reading entered against a meter, by reading id. */
export type ReadingEntry = { id: string; current: number };

/**
 * Files a round of readings.
 *
 * Consumption and the charge are recomputed rather than carried over — a
 * corrected reading has to move the money it produces, or the two disagree.
 * The rows land Verified: the accountant entering them is the check.
 */
export function recordReadings(entries: ReadingEntry[]) {
  if (entries.length === 0) return;

  const byId = new Map(entries.map((entry) => [entry.id, entry.current]));

  readings = readings.map((reading) => {
    const current = byId.get(reading.id);
    if (current === undefined || current === reading.current) {
      return byId.has(reading.id)
        ? { ...reading, status: "Verified" }
        : reading;
    }

    const consumption = Math.max(0, current - reading.previous);
    const rate = UTILITY_RATES[reading.type];

    return {
      ...reading,
      current,
      consumption,
      rate,
      charge: consumption * rate,
      status: "Verified",
    };
  });

  listeners.forEach((listener) => listener());

  pushAccNotification(
    "Meter Reading",
    "Readings Recorded",
    `${entries.length} meter reading${entries.length === 1 ? "" : "s"} entered and verified.`,
    "success",
  );
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return readings;
}

function getServerSnapshot() {
  return seed;
}

export function useAccUtilityReadings() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
