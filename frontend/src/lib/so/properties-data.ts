/**
 * The properties this officer is posted to.
 *
 * Plain data, deliberately server-safe: the catch-all route and the page
 * metadata both need to name a property, and neither of them runs on the
 * client. Which property is *selected* is a client concern and lives in
 * `properties.ts` alongside the store.
 */

export type SoProperty = {
  id: string;
  name: string;
  /** Towers on site — used by the location filters and incident forms. */
  buildings: string[];
  /** Manned entry points, in the order the gate log lists them. */
  gates: string[];
};

export const guardedProperties: SoProperty[] = [
  {
    id: "sunrise",
    name: "Sunrise Residence",
    buildings: ["Tower A", "Tower B", "Tower C", "Common Area"],
    gates: ["Main Entrance", "Service Gate", "Basement Ramp"],
  },
  {
    id: "green-valley",
    name: "Green Valley Towers",
    buildings: ["Block 1", "Block 2", "Common Area"],
    gates: ["Main Entrance", "Rear Gate"],
  },
];

export function soPropertyName(id: string) {
  return guardedProperties.find((property) => property.id === id)?.name ?? "—";
}
