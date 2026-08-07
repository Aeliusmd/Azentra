"use client";

import { Modal } from "@/components/ui/modal";
import type { Tower } from "@/lib/buildings-data";

function Detail({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent?: "green" | "amber";
}) {
  const valueColor =
    accent === "green"
      ? "text-green-700"
      : accent === "amber"
        ? "text-amber-600"
        : "text-ink";

  return (
    <div>
      <dt className="text-[13px] tracking-wide text-gray-500 uppercase">
        {label}
      </dt>
      <dd className={`mt-1.5 text-[17px] font-semibold ${valueColor}`}>
        {value}
      </dd>
    </div>
  );
}

export function TowerDetailsModal({
  tower,
  onClose,
}: {
  tower: Tower | null;
  onClose: () => void;
}) {
  return (
    <Modal open={tower !== null} onClose={onClose} title="Tower Details">
      {tower && (
        <div className="px-8 py-7">
          <div className="flex items-center gap-5">
            <span
              aria-hidden="true"
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-[#e8edf3] text-2xl font-bold text-[#1b3a5c]"
            >
              {tower.name.split(" ").pop()}
            </span>
            <div>
              <h3 className="text-xl font-bold text-ink">{tower.name}</h3>
              <span
                className={`mt-2 inline-flex rounded-full px-3 py-1 text-[13px] font-medium capitalize ${
                  tower.status === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {tower.status}
              </span>
            </div>
          </div>

          <dl className="mt-8 grid grid-cols-2 gap-x-8 gap-y-6">
            <Detail label="Floors" value={tower.floors} />
            <Detail label="Total Units" value={tower.totalUnits} />
            <Detail label="Occupied" value={tower.occupied} accent="green" />
            <Detail label="Vacant" value={tower.vacant} />
            <Detail
              label="Maintenance"
              value={tower.maintenance}
              accent="amber"
            />
            <Detail label="Created" value={tower.createdAt} />
          </dl>

          <div className="mt-7">
            <p className="text-[13px] tracking-wide text-gray-500 uppercase">
              Amenities
            </p>
            <ul className="mt-2.5 flex flex-wrap gap-2">
              {tower.amenities.map((amenity) => (
                <li
                  key={amenity}
                  className="rounded-md bg-green-50 px-3 py-1.5 text-[13px] text-green-700"
                >
                  {amenity}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </Modal>
  );
}
