/**
 * Transient confirmations for the security portal.
 *
 * Re-exported for the same reason as the toaster itself: the toast stack and
 * its store carry nothing role-specific, and only one portal is ever mounted at
 * a time. The alias keeps security code reading in security terms.
 */
export {
  showResToast as showSoToast,
  dismissResToast as dismissSoToast,
  useResToasts as useSoToasts,
  type ResToast as SoToast,
} from "@/lib/res/toast-store";
