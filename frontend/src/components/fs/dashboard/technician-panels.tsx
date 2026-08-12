"use client";

import { Pill } from "@/components/pm/ui/pill";
import { Card, CardHeader } from "@/components/ui/card";
import type { TechnicianLoad } from "@/lib/fs/dashboard-data";
import {
  AVAILABILITY_TILE,
  AVAILABILITY_TONE,
  availabilityCounts,
  workloadTone,
} from "@/lib/fs/technicians-data";

/** The four availability counts across the roster on this site. */
export function TechnicianStatus({ roster }: { roster: TechnicianLoad[] }) {
  const counts = availabilityCounts(roster.map((entry) => entry.technician));

  return (
    <Card className="p-5">
      <CardHeader title="Technician Status" />

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {counts.map(({ status, count }) => {
          const tile = AVAILABILITY_TILE[status];

          return (
            <div
              key={status}
              className={`rounded-lg border px-4 py-4 text-center ${tile.box}`}
            >
              <p className={`text-[22px] leading-none font-bold ${tile.value}`}>
                {count}
              </p>
              <p className="mt-1.5 text-[13px] text-muted">{status}</p>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

/** How loaded each technician is right now, counted off the live work orders. */
export function TechnicianWorkload({ roster }: { roster: TechnicianLoad[] }) {
  return (
    <Card className="p-5">
      <CardHeader
        title="Technician Workload"
        action={
          <span className="text-[13px] text-muted">
            {roster.length} technician{roster.length === 1 ? "" : "s"}
          </span>
        }
      />

      {roster.length === 0 ? (
        <p className="py-10 text-center text-[15px] text-muted">
          No technicians are rostered on this property.
        </p>
      ) : (
        <ul className="mt-4 space-y-4">
          {roster.map(({ technician, activeJobs }) => {
            const percent = Math.min(
              100,
              Math.round((activeJobs / technician.capacity) * 100),
            );

            return (
              <li key={technician.id}>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[15px] font-semibold text-ink">
                    {technician.name}
                  </span>
                  <Pill tone={AVAILABILITY_TONE[technician.availability]}>
                    {technician.availability}
                  </Pill>
                  <span className="ml-auto text-[13px] whitespace-nowrap text-muted">
                    {activeJobs} Job{activeJobs === 1 ? "" : "s"}
                  </span>
                </div>

                <span
                  role="img"
                  aria-label={`${percent}% of capacity`}
                  className="mt-2 block h-1.5 w-full overflow-hidden rounded-full bg-gray-200"
                >
                  <span
                    className={`block h-full rounded-full transition-[width] ${workloadTone(
                      activeJobs,
                      technician.capacity,
                    )}`}
                    style={{ width: `${percent}%` }}
                  />
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
