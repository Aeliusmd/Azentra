import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Tower } from "@/lib/dashboard-data";

const HEADINGS = [
  "Tower",
  "Floors",
  "Total Units",
  "Occupied",
  "Vacant",
  "Status",
];

export function TowerStatus({ towers }: { towers: Tower[] }) {
  return (
    <Card>
      <h2 className="px-6 py-5 text-[15px] font-semibold text-ink">
        Tower Status
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left">
          <thead>
            <tr className="border-y border-hairline">
              {HEADINGS.map((heading) => (
                <th
                  key={heading}
                  scope="col"
                  className="px-6 py-3 text-xs font-medium text-muted"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-hairline">
            {towers.map((tower) => (
              <tr key={tower.name} className="transition-colors hover:bg-gray-50/70">
                <th
                  scope="row"
                  className="px-6 py-4 text-left text-[13px] font-semibold text-ink"
                >
                  {tower.name}
                </th>
                <td className="px-6 py-4 text-[13px] text-gray-600">
                  {tower.floors}
                </td>
                <td className="px-6 py-4 text-[13px] text-gray-600">
                  {tower.totalUnits}
                </td>
                <td className="px-6 py-4 text-[13px] font-semibold text-[#3fae63]">
                  {tower.occupied}
                </td>
                <td className="px-6 py-4 text-[13px] text-gray-600">
                  {tower.vacant}
                </td>
                <td className="px-6 py-4">
                  <Badge tone={tower.status === "active" ? "green" : "amber"}>
                    {tower.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
