"use client";

import { useSyncExternalStore } from "react";

import { TODAY } from "@/lib/acc/dashboard-data";
import { pushAccNotification } from "@/lib/acc/notifications-store";
import { billingPeriods, periodLabel } from "@/lib/acc/periods";
import { lkr } from "@/lib/acc/money";
import {
  seedPayments,
  type AccPayment,
  type PaymentMethod,
} from "@/lib/acc/payments-data";

/**
 * Every payment the accountant can see, held in a module store so one recorded
 * here shows up against its bill everywhere else. Resets on reload like the
 * other mock stores.
 */

const seed = seedPayments(billingPeriods.map((period) => period.id));

let payments: AccPayment[] = seed;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

/** Next free number in a property's block, so recorded ids keep counting up. */
function nextId(propertyId: string, period: string) {
  const sameBlock = payments.filter(
    (payment) =>
      payment.propertyId === propertyId && payment.period === period,
  );

  const highest = sameBlock.reduce((max, payment) => {
    const number = Number(payment.id.split("-")[1]);
    return Number.isNaN(number) ? max : Math.max(max, number);
  }, 0);

  return `PAY-${String(highest + 1).padStart(3, "0")}`;
}

export type NewPaymentInput = {
  propertyId: string;
  period: string;
  resident: string;
  unit: string;
  bill: string;
  amount: number;
  method: PaymentMethod;
  reference: string;
};

/**
 * Logs a payment taken outside the gateway — a bank transfer or cash at the
 * desk. It lands Pending: the accountant has recorded it, nobody has yet
 * confirmed the money arrived.
 */
export function recordPayment(input: NewPaymentInput) {
  const payment: AccPayment = {
    id: nextId(input.propertyId, input.period),
    propertyId: input.propertyId,
    resident: input.resident,
    unit: input.unit,
    bill: input.bill,
    period: input.period,
    amount: input.amount,
    method: input.method,
    date: TODAY,
    reference: input.reference,
    status: "Pending",
  };

  payments = [...payments, payment];
  emit();

  pushAccNotification(
    "Payment",
    "Payment Recorded",
    `${payment.id} · ${payment.resident} · ${lkr(payment.amount)} against ${payment.bill} — awaiting verification.`,
    "info",
  );

  return payment;
}

/** Confirms the money arrived, which is what lets it count against a bill. */
export function verifyPayment(id: string) {
  payments = payments.map((payment) =>
    payment.id === id ? { ...payment, status: "Verified" } : payment,
  );
  emit();
}

/**
 * The money never landed — a bounced transfer, or a reference that matched
 * nothing. The record stays on file as Failed rather than being deleted, so the
 * attempt is still auditable.
 */
export function rejectPayment(id: string) {
  payments = payments.map((payment) =>
    payment.id === id ? { ...payment, status: "Failed" } : payment,
  );
  emit();
}

/** The date on the longest-waiting payment — blank when the queue is clear. */
export function oldestDate(list: AccPayment[]) {
  return list.reduce(
    (oldest, payment) =>
      oldest === "" || payment.date < oldest ? payment.date : oldest,
    "",
  );
}

export type PaymentsSummary = {
  count: number;
  value: number;
  verified: number;
  pending: number;
};

export function summarisePayments(list: AccPayment[]): PaymentsSummary {
  return {
    count: list.length,
    value: list.reduce((sum, payment) => sum + payment.amount, 0),
    verified: list.filter((payment) => payment.status === "Verified").length,
    pending: list.filter((payment) => payment.status === "Pending").length,
  };
}

/** Reads better than the raw id in a toast. */
export function periodOf(payment: AccPayment) {
  return periodLabel(payment.period);
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return payments;
}

function getServerSnapshot() {
  return seed;
}

export function useAccPayments() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
