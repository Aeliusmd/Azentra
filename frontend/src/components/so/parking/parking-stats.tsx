import { Card } from "@/components/ui/card";
import { countSlots, type ParkingSlot } from "@/lib/so/parking-data";
import { awaitingApproval, type SoVisit } from "@/lib/so/visitors-data";

/**
 * The five figures above every parking tab.
 *
 * They stay on screen as the tabs change because they answer the question a
 * guard is being asked at the barrier — "is there a space?" — and that answer
 * should not depend on which tab happens to be open.
 */
export function SoParkingStats({
  slots,
  requests,
}: {
  slots: ParkingSlot[];
  /** Parking requests, so the pending figure counts the same rows as the tab. */
  requests: SoVisit[];
}) {
  const stats = [
    { label: "Total Slots", value: slots.length, tone: "text-ink" },
    {
      label: "Available",
      value: countSlots(slots, "Available"),
      tone: "text-green-600",
    },
    {
      label: "Occupied",
      value: countSlots(slots, "Occupied"),
      tone: "text-[#2e6cad]",
    },
    {
      label: "Reserved",
      value: countSlots(slots, "Reserved"),
      tone: "text-ink",
    },
    {
      label: "Pending Requests",
      value: awaitingApproval(requests).length,
      tone: "text-amber-600",
    },
  ];

  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-4">
      {stats.map((stat) => (
        <li key={stat.label}>
          <Card className="px-4 py-5 text-center">
            <p className={`text-[26px] leading-tight font-bold ${stat.tone}`}>
              {stat.value}
            </p>
            <p className="mt-1 text-[13px] text-muted">{stat.label}</p>
          </Card>
        </li>
      ))}
    </ul>
  );
}
