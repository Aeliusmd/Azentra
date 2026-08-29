/**
 * The common-area facilities a tenant may book.
 *
 * Re-exported rather than redeclared: these are the building's rooms, not the
 * resident's — the pool is the same pool whoever books it. One definition means
 * the two portals cannot advertise different opening hours for the same room.
 */
export {
  facilities,
  facilityBlurb,
  facilityByName,
  facilityById,
  type Facility,
} from "@/lib/res/facilities-data";
