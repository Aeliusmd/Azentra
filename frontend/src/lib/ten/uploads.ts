/**
 * A file the tenant picked in the browser.
 *
 * Re-exported rather than redeclared: the shape is identical across the
 * portals, and one definition means a dropzone shared between them cannot drift
 * from the records it fills in.
 */
export type { ResUpload as TenUpload } from "@/lib/res/uploads";
