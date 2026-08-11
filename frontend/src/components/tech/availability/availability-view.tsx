"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";

import { DayFormModal } from "@/components/tech/availability/day-form-modal";
import { Card } from "@/components/ui/card";
import {
  DAY_STATUS_DOT,
  dayLabel,
  type AvailabilityDay,
} from "@/lib/tech/availability-data";
import {
  updateAvailability,
  useAvailability,
} from "@/lib/tech/availability-store";
import { showToast } from "@/lib/tech/toast-store";

function DayCard({
  day,
  onEdit,
}: {
  day: AvailabilityDay;
  onEdit: () => void;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <p className="text-[13px] text-muted">{dayLabel(day.date)}</p>
        <button
          type="button"
          onClick={onEdit}
          aria-label={`Edit ${dayLabel(day.date)}`}
          className="-m-1 rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-50 hover:text-ink focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
        >
          <Pencil aria-hidden="true" className="h-4 w-4" />
        </button>
      </div>

      <p className="mt-1.5 flex items-center gap-2 text-[15px] font-bold text-ink">
        <span
          aria-hidden="true"
          className={`h-2.5 w-2.5 shrink-0 rounded-full ${DAY_STATUS_DOT[day.status]}`}
        />
        {day.status}
      </p>

      <p className="mt-3 text-[15px] text-gray-600">
        {day.status === "Available"
          ? `${day.start} - ${day.end}`
          : (day.note ?? "Not working this day")}
      </p>

      {day.status === "Available" && day.note && (
        <p className="mt-1 text-[13px] text-muted">{day.note}</p>
      )}
    </Card>
  );
}

export function AvailabilityView() {
  const week = useAvailability();
  const [editing, setEditing] = useState<string | null>(null);

  const active = week.find((day) => day.date === editing) ?? null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Availability</h1>
        <p className="mt-1 text-[13px] text-muted">
          Manage your work schedule and availability
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {week.map((day) => (
          <DayCard
            key={day.date}
            day={day}
            onEdit={() => setEditing(day.date)}
          />
        ))}
      </div>

      {active && (
        <DayFormModal
          day={active}
          onClose={() => setEditing(null)}
          onSave={(patch) => {
            updateAvailability(active.date, patch);
            showToast("Availability updated");
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}
