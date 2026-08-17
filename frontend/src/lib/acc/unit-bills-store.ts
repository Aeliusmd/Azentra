"use client";

import { useSyncExternalStore } from "react";

import { TODAY } from "@/lib/acc/dashboard-data";
import { pushAccNotification } from "@/lib/acc/notifications-store";
import { billingPeriods, periodLabel } from "@/lib/acc/periods";
import { accPropertyName } from "@/lib/acc/properties";
import {
  seedUnitBills,
  type BillStatus,
  type UnitBill,
} from "@/lib/acc/unit-bills-data";

/**
 * Every unit bill the accountant can see, held in a module store so a bill
 * generated on this page is there when the invoice and payment screens read
 * from it. Resets on reload like the other mock stores.
 */

const seed = seedUnitBills(billingPeriods.map((period) => period.id));

let bills: UnitBill[] = seed;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

/** Next free number in a property's block, so generated ids keep counting up. */
function nextId(propertyId: string, period: string) {
  const sameBlock = bills.filter(
    (bill) => bill.propertyId === propertyId && bill.period === period,
  );

  const highest = sameBlock.reduce((max, bill) => {
    const number = Number(bill.id.split("-")[2]);
    return Number.isNaN(number) ? max : Math.max(max, number);
  }, 0);

  const [year] = period.split("-");
  return `BIL-${year}-${String(highest + 1).padStart(5, "0")}`;
}

export type NewUnitBillInput = {
  propertyId: string;
  period: string;
  unit: string;
  resident: string;
  total: number;
  dueDate: string;
};

/** Raises a fresh bill as a Draft — nothing reaches a resident until it is published. */
export function generateUnitBill(input: NewUnitBillInput) {
  const bill: UnitBill = {
    id: nextId(input.propertyId, input.period),
    propertyId: input.propertyId,
    unit: input.unit,
    resident: input.resident,
    period: input.period,
    total: input.total,
    dueDate: input.dueDate,
    // Raised now, whichever cycle it is being raised against.
    createdOn: TODAY,
    // Nothing has been chased on a bill that did not exist a moment ago.
    reminders: 0,
    status: "Draft",
  };

  bills = [bill, ...bills];
  emit();

  pushAccNotification(
    "Billing",
    "Bill Generated",
    `${bill.id} · ${bill.unit} · ${accPropertyName(bill.propertyId)} — draft raised for ${periodLabel(bill.period)}.`,
  );

  return bill;
}

/** Moves a bill along its lifecycle — Draft to Generated to Published. */
export function setBillStatus(id: string, status: BillStatus) {
  bills = bills.map((bill) => (bill.id === id ? { ...bill, status } : bill));
  emit();
}

/** Chases an unpaid balance. The count is the record that it was chased. */
export function sendReminder(id: string) {
  const bill = bills.find((entry) => entry.id === id);
  if (!bill) return;

  bills = bills.map((entry) =>
    entry.id === id ? { ...entry, reminders: entry.reminders + 1 } : entry,
  );
  emit();

  pushAccNotification(
    "Overdue",
    "Payment Reminder Sent",
    `${bill.resident} · ${bill.unit} · ${bill.id} — reminder ${bill.reminders + 1} issued.`,
    "info",
  );
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return bills;
}

function getServerSnapshot() {
  return seed;
}

export function useAccUnitBills() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
