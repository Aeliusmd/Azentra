"use client";

import { useMemo, useState } from "react";

import { TechnicianDetailModal } from "@/components/fs/technicians/technician-detail-modal";
import { Pill } from "@/components/pm/ui/pill";
import { Card } from "@/components/ui/card";
import { SearchInput } from "@/components/ui/search-input";
import { TODAY } from "@/lib/fs/dashboard-data";
import { useSelectedFsProperty } from "@/lib/fs/properties";
import {
  activeJobCount,
  AVAILABILITY_DOT,
  AVAILABILITY_TONE,
  durationLabel,
  hoursLoggedOn,
  techniciansAt,
  technicianInitials,
  type FsTechnician,
} from "@/lib/fs/technicians-data";
import { useFsWorkOrders } from "@/lib/fs/work-orders-store";

function Field({ label, value }: { label: string; value: string }) {
  return (
    <span className="block truncate text-[13px] text-muted">
      {label}: <span className="font-medium text-ink">{value}</span>
    </span>
  );
}

function TechnicianCard({
  technician,
  activeJobs,
  hoursToday,
  onOpen,
}: {
  technician: FsTechnician;
  activeJobs: number;
  hoursToday: number;
  onOpen: () => void;
}) {
  return (
    <Card className="h-full">
      <button
        type="button"
        onClick={onOpen}
        aria-haspopup="dialog"
        className="flex h-full w-full flex-col p-5 text-left transition-colors hover:bg-gray-50/70 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
      >
        <span className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-100 text-[15px] font-semibold text-gray-600"
          >
            {technicianInitials(technician.name)}
          </span>

          <span className="min-w-0 flex-1">
            <span className="block truncate text-[17px] font-bold text-ink">
              {technician.name}
            </span>
            {/* Left to wrap rather than truncated — a trade like "Elevator &
                Mechanical Technician" is the point of the line. */}
            <span className="mt-0.5 block text-[13px] text-muted">
              {technician.title}
            </span>
          </span>

          <span className="flex shrink-0 items-center gap-2">
            <span
              aria-hidden="true"
              className={`h-2 w-2 rounded-full ${AVAILABILITY_DOT[technician.availability]}`}
            />
            <Pill tone={AVAILABILITY_TONE[technician.availability]}>
              {technician.availability}
            </Pill>
          </span>
        </span>

        <span className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2">
          <Field label="Current Jobs" value={String(activeJobs)} />
          <Field label="Rating" value={technician.rating.toFixed(1)} />
          <Field label="Today" value={durationLabel(hoursToday)} />
          <Field label="Completed" value={String(technician.completedJobs)} />
        </span>
      </button>
    </Card>
  );
}

/**
 * The roster on the property being looked at. Job counts and hours are read off
 * the live work orders, so a reassignment made anywhere shows up here.
 */
export function FsTechnicianListView() {
  const propertyId = useSelectedFsProperty();
  const orders = useFsWorkOrders();

  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const roster = useMemo(() => {
    const term = search.trim().toLowerCase();

    return techniciansAt(propertyId)
      .filter(
        (technician) =>
          !term ||
          [technician.name, technician.title, ...technician.skills]
            .join(" ")
            .toLowerCase()
            .includes(term),
      )
      .map((technician) => ({
        technician,
        activeJobs: activeJobCount(orders, technician.name),
        hoursToday: hoursLoggedOn(orders, technician.name, TODAY),
      }));
  }, [propertyId, orders, search]);

  const openTechnician =
    roster.find((entry) => entry.technician.id === openId)?.technician ?? null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[32px] leading-tight font-bold text-ink">
            Technician List
          </h1>
          <p className="mt-1 text-[15px] text-muted">
            View and manage all technicians
          </p>
        </div>

        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search technicians..."
          label="Search technicians"
          className="w-full sm:w-[280px]"
        />
      </div>

      {roster.length === 0 ? (
        <Card className="px-6 py-16 text-center text-[15px] text-muted">
          No technicians match this search.
        </Card>
      ) : (
        <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {roster.map(({ technician, activeJobs, hoursToday }) => (
            <li key={technician.id}>
              <TechnicianCard
                technician={technician}
                activeJobs={activeJobs}
                hoursToday={hoursToday}
                onOpen={() => setOpenId(technician.id)}
              />
            </li>
          ))}
        </ul>
      )}

      {openTechnician && (
        <TechnicianDetailModal
          technician={openTechnician}
          onClose={() => setOpenId(null)}
        />
      )}
    </div>
  );
}
