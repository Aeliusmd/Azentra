/**
 * Transient confirmations for the security portal.
 *
 * Re-exported rather than rewritten: the toast stack is role-neutral, and only
 * one portal is ever mounted at a time. Raise one with `showSoToast` from
 * `@/lib/so/toast-store` — the store is where the gate actions call it from.
 */
export { ResToaster as SoToaster } from "@/components/res/ui/toaster";
export { showSoToast } from "@/lib/so/toast-store";
