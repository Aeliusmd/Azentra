/**
 * Transient confirmations for the tenant portal.
 *
 * Re-exported for the same reason as the tab bar: the toast stack and its store
 * are role-neutral, and only one portal is ever mounted at a time.
 */
export { ResToaster as TenToaster } from "@/components/res/ui/toaster";
export { showResToast as showTenToast } from "@/lib/res/toast-store";
