/**
 * The tenant portal's tab row.
 *
 * Re-exported rather than rewritten: the resident portal's tab bar carries no
 * resident-specific data or routing, so there is one implementation and both
 * portals stay in step when it changes. The alias keeps tenant code reading in
 * tenant terms.
 */
export {
  ResTabBar as TenTabBar,
  type ResTab as TenTab,
} from "@/components/res/ui/tab-bar";
