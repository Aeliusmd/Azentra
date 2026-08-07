"use client";

import {
  CATEGORY_CHIP,
  FacilityImage,
} from "@/components/common-areas/facility-visuals";
import { Modal } from "@/components/ui/modal";
import type { Facility } from "@/lib/common-areas-data";

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[13px] text-gray-500">{label}</dt>
      <dd className="mt-1 text-[15px] text-ink">{value}</dd>
    </div>
  );
}

export function FacilityDetailsModal({
  facility,
  onClose,
}: {
  facility: Facility | null;
  onClose: () => void;
}) {
  return (
    <Modal open={facility !== null} onClose={onClose} title="Facility Details">
      {facility && (
        <div>
          <div className="relative mx-6 mt-6 h-[190px] overflow-hidden rounded-xl">
            <FacilityImage src={facility.image} alt={facility.name} />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent"
            />
            <h3 className="absolute bottom-3 left-4 text-xl font-semibold text-white">
              {facility.name}
            </h3>
          </div>

          <div className="px-6 pt-5 pb-7">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full px-3 py-1 text-[13px] font-medium ${
                  facility.status === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {facility.status}
              </span>
              <span
                className={`rounded-full px-3 py-1 text-[13px] font-medium ${CATEGORY_CHIP[facility.category]}`}
              >
                {facility.category}
              </span>
            </div>

            <dl className="mt-6 grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
              <Detail label="Location" value={facility.location} />
              <Detail label="Capacity" value={`${facility.capacity} people`} />
              <Detail label="Hours" value={facility.hours} />
              <Detail
                label="Booking"
                value={facility.bookingRequired ? "Required" : "Walk-in"}
              />
              <Detail label="Last Maintained" value={facility.lastMaintained} />
              <Detail
                label="Next Maintenance"
                value={facility.nextMaintenance}
              />
            </dl>

            <div className="mt-5">
              <p className="text-[13px] text-gray-500">Description</p>
              <p className="mt-1 text-[15px] text-ink">{facility.description}</p>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
