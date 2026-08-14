"use client";

import { useMemo } from "react";

import { Pill } from "@/components/pm/ui/pill";
import { Card } from "@/components/ui/card";
import { fromIso, SHORT_MONTHS, WEEKDAYS } from "@/lib/fs/calendar-data";
import { TODAY } from "@/lib/fs/dashboard-data";
import { useSelectedFsProperty } from "@/lib/fs/properties";
import {
  AVAILABILITY_DOT,
  AVAILABILITY_TONE,
  isOnDuty,
  ON_LEAVE,
  ROSTER_DAYS,
  techniciansAt,
  technicianInitials,
  TECH_AVAILABILITY,
} from "@/lib/fs/technicians-data";

/** Dot colours for the legend — the four live statuses plus booked leave. */
const LEGEND = [
  ...TECH_AVAILABILITY.map((status) => ({
    label: status,
    dot: AVAILABILITY_DOT[status],
  })),
  { label: "On Leave", dot: "bg-[#d1743a]" },
];

/** `Today`, `Tomorrow`, then `Thu, Aug 14`. */
function dayHeading(offset: number) {
  if (offset === 0) return "Today";
  if (offset === 1) return "Tomorrow";

  const date = fromIso(TODAY);
  date.setDate(date.getDate() + offset);

  return `${WEEKDAYS[date.getDay()]}, ${SHORT_MONTHS[date.getMonth()]} ${date.getDate()}`;
}

function RosterCell({ day, today }: { day: string; today: boolean }) {
  const onLeave = day === ON_LEAVE;

  return (
    <td
      className={`px-4 py-3.5 text-center align-middle ${today ? "bg-green-50/60" : ""}`}
    >
      {isOnDuty(day) ? (
        <>
          <span className="block text-[13px] font-medium text-green-700">
            Available
          </span>
          <span className="mt-0.5 block text-[13px] whitespace-nowrap text-muted">
            {day}
          </span>
        </>
      ) : (
        <span
          className={`text-[13px] font-medium ${
            onLeave ? "text-[#c26a2f]" : "text-gray-400"
          }`}
        >
          {day}
        </span>
      )}
    </td>
  );
}

/**
 * The published roster, one row per technician. Read left to right it answers
 * the only question this page is for: who can take a job on a given day.
 */
export function FsAvailabilityView() {
  const propertyId = useSelectedFsProperty();
  const roster = useMemo(() => techniciansAt(propertyId), [propertyId]);

  const days = Array.from({ length: ROSTER_DAYS }, (_, index) => index);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[32px] leading-tight font-bold text-ink">
          Technician Availability
        </h1>
        <p className="mt-1 text-[15px] text-muted">
          View technician schedules for work assignment planning
        </p>
      </div>

      <Card>
        {/* Phones read the roster a person at a time rather than as a grid. */}
        <ul className="divide-y divide-hairline md:hidden">
          {roster.map((technician) => (
            <li key={technician.id} className="px-4 py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-[13px] font-semibold text-gray-600"
                  >
                    {technicianInitials(technician.name)}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[15px] font-semibold text-ink">
                      {technician.name}
                    </p>
                    <p className="mt-0.5 text-[13px] text-muted">
                      {technician.title}
                    </p>
                  </div>
                </div>
                <Pill tone={AVAILABILITY_TONE[technician.availability]}>
                  {technician.availability}
                </Pill>
              </div>

              <dl className="mt-3 space-y-1.5">
                {days.map((offset) => {
                  const day = technician.roster[offset];

                  return (
                    <div key={offset} className="flex justify-between gap-3">
                      <dt
                        className={`text-[13px] ${offset === 0 ? "font-semibold text-ink" : "text-muted"}`}
                      >
                        {dayHeading(offset)}
                      </dt>
                      <dd
                        className={`text-[13px] font-medium ${
                          isOnDuty(day)
                            ? "text-green-700"
                            : day === ON_LEAVE
                              ? "text-[#c26a2f]"
                              : "text-gray-400"
                        }`}
                      >
                        {day}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </li>
          ))}
        </ul>

        <div className="relative hidden overflow-x-auto md:block">
          <table className="w-full min-w-[1040px] text-left">
            <thead>
              <tr className="border-b border-hairline">
                <th
                  scope="col"
                  className="px-4 py-3.5 text-xs font-semibold tracking-wide text-gray-500 uppercase"
                >
                  Technician
                </th>
                <th
                  scope="col"
                  className="px-4 py-3.5 text-xs font-semibold tracking-wide text-gray-500 uppercase"
                >
                  Status
                </th>
                {days.map((offset) => (
                  <th
                    key={offset}
                    scope="col"
                    className={`px-4 py-3.5 text-center text-xs font-semibold tracking-wide whitespace-nowrap text-gray-500 uppercase ${
                      offset === 0 ? "bg-green-50/60" : ""
                    }`}
                  >
                    {dayHeading(offset)}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-hairline">
              {roster.map((technician) => (
                <tr key={technician.id}>
                  <th scope="row" className="px-4 py-3.5 text-left font-normal">
                    <span className="flex items-center gap-3">
                      <span
                        aria-hidden="true"
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-[13px] font-semibold text-gray-600"
                      >
                        {technicianInitials(technician.name)}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[15px] font-semibold text-ink">
                          {technician.name}
                        </span>
                        <span className="mt-0.5 block text-[13px] text-muted">
                          {technician.title}
                        </span>
                      </span>
                    </span>
                  </th>

                  <td className="px-4 py-3.5">
                    <span className="flex items-center gap-2">
                      <span
                        aria-hidden="true"
                        className={`h-2 w-2 shrink-0 rounded-full ${AVAILABILITY_DOT[technician.availability]}`}
                      />
                      <Pill tone={AVAILABILITY_TONE[technician.availability]}>
                        {technician.availability}
                      </Pill>
                    </span>
                  </td>

                  {days.map((offset) => (
                    <RosterCell
                      key={offset}
                      day={technician.roster[offset]}
                      today={offset === 0}
                    />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {roster.length === 0 && (
          <p className="px-6 py-16 text-center text-[15px] text-muted">
            No technicians are rostered on this property.
          </p>
        )}
      </Card>

      <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
        {LEGEND.map((entry) => (
          <li
            key={entry.label}
            className="flex items-center gap-2 text-[13px] text-gray-600"
          >
            <span
              aria-hidden="true"
              className={`h-2 w-2 rounded-full ${entry.dot}`}
            />
            {entry.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
