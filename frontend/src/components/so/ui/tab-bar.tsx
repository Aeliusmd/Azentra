/**
 * The security portal's tab row.
 *
 * Re-exported rather than rewritten: the resident portal's tab bar carries no
 * role-specific data or routing, so there is one implementation and every
 * portal stays in step when it changes. The alias keeps security code reading
 * in security terms.
 */
export {
  ResTabBar as SoTabBar,
  type ResTab as SoTab,
} from "@/components/res/ui/tab-bar";
