import { Card } from "@/components/ui/card";

type Segment = {
  label: string;
  count: number;
  bar: string;
  dot: string;
};

export function OccupancyCard({
  totalUnits,
  occupied,
  vacant,
  maintenance,
}: {
  totalUnits: number;
  occupied: number;
  vacant: number;
  maintenance: number;
}) {
  const rate = Math.round((occupied / totalUnits) * 100);

  const segments: Segment[] = [
    {
      label: "Occupied",
      count: occupied,
      bar: "bg-[#3fae63]",
      dot: "bg-[#3fae63]",
    },
    { label: "Vacant", count: vacant, bar: "bg-[#647a91]", dot: "bg-[#647a91]" },
    {
      label: "Maintenance",
      count: maintenance,
      bar: "bg-[#e8a33d]",
      dot: "bg-[#e8a33d]",
    },
  ];

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-[15px] font-semibold text-ink">Unit Occupancy</h2>
          <p className="mt-1 text-[13px] text-muted">{rate}% occupancy rate</p>
        </div>
        <p className="text-2xl font-bold text-ink">{rate}%</p>
      </div>

      <div
        role="img"
        aria-label={`${occupied} occupied, ${vacant} vacant and ${maintenance} under maintenance of ${totalUnits} units`}
        className="mt-5 flex h-2.5 gap-px overflow-hidden rounded-full bg-gray-100"
      >
        {segments.map((segment) => (
          <div
            key={segment.label}
            className={segment.bar}
            style={{ width: `${(segment.count / totalUnits) * 100}%` }}
          />
        ))}
      </div>

      <ul className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
        {segments.map((segment) => (
          <li
            key={segment.label}
            className="flex items-center gap-2 text-[13px] text-muted"
          >
            <span
              aria-hidden="true"
              className={`h-2.5 w-2.5 rounded-full ${segment.dot}`}
            />
            {segment.label} ({segment.count})
          </li>
        ))}
      </ul>
    </Card>
  );
}
