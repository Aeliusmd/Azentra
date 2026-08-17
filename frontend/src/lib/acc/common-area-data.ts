import { CURRENT_PERIOD } from "@/lib/acc/periods";
import {
  UTILITY_RATES,
  type UtilityType,
} from "@/lib/acc/utility-bills-data";

/**
 * What the shared parts of a property consumed — the pool, the lifts, the
 * lobbies — before any of it is pushed out to residents.
 *
 * Same tariffs as the unit submeters, so a rate change moves both screens at
 * once. Only consumption is stored; the charge and every total on the page are
 * computed, so the four summary cards can never disagree with the table.
 */

export type CommonAreaCharge = {
  id: string;
  propertyId: string;
  /** The metered space — "Swimming Pool", "Elevators". */
  area: string;
  type: UtilityType;
  /** `2026-08`, matching the billing-period ids. */
  period: string;
  consumption: number;
  rate: number;
  /** `consumption * rate`. */
  charge: number;
};

/** `area, utility, consumption` for the open month. */
type Row = [string, UtilityType, number];

const OPEN_MONTH: Record<string, Row[]> = {
  sunrise: [
    ["Swimming Pool", "Water", 45_000],
    ["Swimming Pool", "Electricity", 3_200],
    ["Gym", "Electricity", 2_800],
    ["Lobby - Tower A", "Electricity", 4_100],
    ["Lobby - Tower B", "Electricity", 3_800],
    ["Common Lighting", "Electricity", 6_200],
    ["Elevators", "Electricity", 8_500],
    ["Security Office", "Electricity", 1_200],
    ["Landscaping", "Water", 28_000],
  ],
  "ocean-view": [
    ["Swimming Pool", "Water", 32_000],
    ["Swimming Pool", "Electricity", 2_400],
    ["Gym", "Electricity", 2_100],
    ["Lobby - Tower 1", "Electricity", 3_300],
    ["Lobby - Tower 2", "Electricity", 3_000],
    ["Common Lighting", "Electricity", 4_800],
    ["Elevators", "Electricity", 6_400],
    ["Landscaping", "Water", 19_500],
  ],
  "garden-heights": [
    ["Gym", "Electricity", 1_600],
    ["Lobby - North Wing", "Electricity", 2_500],
    ["Lobby - South Wing", "Electricity", 2_300],
    ["Common Lighting", "Electricity", 3_600],
    ["Elevators", "Electricity", 4_200],
    ["Security Office", "Electricity", 900],
    ["Landscaping", "Water", 14_200],
  ],
};

const OPEN_MONTH_NUMBER = Number(CURRENT_PERIOD.split("-")[1]);

/**
 * Shared spaces draw less out of season — the pool and the landscaping most of
 * all. Deterministic so a closed month reads the same on every visit.
 */
function shiftBack(consumption: number, index: number, back: number) {
  if (back === 0) return consumption;
  const swing = ((index * 53 + back * 89) % 13) - 6;
  return Math.round((consumption * (100 - back * 4 + swing)) / 100);
}

export function commonAreaChargesFor(
  propertyId: string,
  period: string,
): CommonAreaCharge[] {
  const rows = OPEN_MONTH[propertyId] ?? [];
  const back = OPEN_MONTH_NUMBER - Number(period.split("-")[1]);

  return rows.map(([area, type, openConsumption], index) => {
    const consumption = shiftBack(openConsumption, index, back);
    const rate = UTILITY_RATES[type];

    return {
      id: `${propertyId}-${period}-${area}-${type}`,
      propertyId,
      area,
      type,
      period,
      consumption,
      rate,
      charge: consumption * rate,
    };
  });
}

export type CommonAreaSummary = {
  total: number;
  /** Metered lines on the page, which is what the "Areas" tile counts. */
  areas: number;
  water: number;
  electricity: number;
};

export function summarise(charges: CommonAreaCharge[]): CommonAreaSummary {
  const byType = (type: UtilityType) =>
    charges
      .filter((charge) => charge.type === type)
      .reduce((sum, charge) => sum + charge.charge, 0);

  return {
    total: charges.reduce((sum, charge) => sum + charge.charge, 0),
    areas: charges.length,
    water: byType("Water"),
    electricity: byType("Electricity"),
  };
}
