"use client";

import { useMemo, useState } from "react";
import { Eye, Plus } from "lucide-react";

import { LogLabourModal } from "@/components/tech/work-log/log-labour-modal";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { TODAY } from "@/lib/tech/dashboard-data";
import { durationLabel } from "@/lib/tech/jobs-data";
import { addJobLabour, useTechJobs } from "@/lib/tech/jobs-store";
import { showToast } from "@/lib/tech/toast-store";
import { hoursLabel, logEntriesFrom } from "@/lib/tech/work-log-data";

const HEADINGS = ["Date", "Job", "Start", "End", "Total", "Actions"];

export function WorkLogView() {
  const jobs = useTechJobs();
  const [logging, setLogging] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);

  const entries = useMemo(() => logEntriesFrom(jobs), [jobs]);
  const active = entries.find((entry) => entry.id === openId) ?? null;

  // Time is logged against work still in hand.
  const openJobs = jobs.filter((job) => job.status !== "Completed");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">Labour &amp; Work Log</h1>
          <p className="mt-1 text-[13px] text-muted">
            Track your work hours and labour entries
          </p>
        </div>

        <div className="rounded-lg border border-hairline bg-white px-5 py-3 text-right">
          <p className="text-[13px] text-muted">Total Hours Logged</p>
          <p className="mt-1 text-[22px] leading-none font-bold text-ink">
            {hoursLabel(entries)}
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setLogging(true)}
          disabled={openJobs.length === 0}
          className="flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
        >
          <Plus aria-hidden="true" className="h-4 w-4" />
          Log Labour Time
        </button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead>
              <tr className="border-b border-hairline">
                {HEADINGS.map((heading) => (
                  <th
                    key={heading}
                    scope="col"
                    className="px-5 py-4 text-[13px] font-medium text-muted"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-hairline">
              {entries.map((entry) => (
                <tr
                  key={entry.id}
                  className="transition-colors hover:bg-gray-50/70"
                >
                  <td className="px-5 py-4 text-[15px] whitespace-nowrap text-gray-600">
                    {entry.date}
                  </td>
                  <th
                    scope="row"
                    className="px-5 py-4 text-left text-[15px] font-semibold text-ink"
                  >
                    {entry.jobTitle}
                  </th>
                  <td className="px-5 py-4 text-[15px] whitespace-nowrap text-gray-600">
                    {entry.start}
                  </td>
                  <td className="px-5 py-4 text-[15px] whitespace-nowrap text-gray-600">
                    {entry.end}
                  </td>
                  <td className="px-5 py-4 text-[15px] font-bold whitespace-nowrap text-[#1b3a5c]">
                    {durationLabel(entry.minutes)}
                  </td>
                  <td className="px-5 py-4">
                    <button
                      type="button"
                      onClick={() => setOpenId(entry.id)}
                      aria-label={`View entry for ${entry.jobTitle}`}
                      className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-ink focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
                    >
                      <Eye aria-hidden="true" className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {entries.length === 0 && (
          <p className="px-6 py-12 text-center text-[15px] text-muted">
            No labour logged yet.
          </p>
        )}
      </Card>

      {logging && (
        <LogLabourModal
          jobs={openJobs}
          date={TODAY}
          onClose={() => setLogging(false)}
          onSubmit={(jobId, entry) => {
            addJobLabour(jobId, entry);
            showToast("Labour time logged");
            setLogging(false);
          }}
        />
      )}

      {active && (
        <Modal
          open
          onClose={() => setOpenId(null)}
          title={active.jobTitle}
          subtitle={`${active.jobId} · ${active.date}`}
        >
          <div className="space-y-4 px-8 py-7">
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Start", value: active.start },
                { label: "End", value: active.end },
                { label: "Total", value: durationLabel(active.minutes) },
              ].map((cell) => (
                <div key={cell.label}>
                  <p className="text-[11px] font-semibold tracking-wide text-gray-400 uppercase">
                    {cell.label}
                  </p>
                  <p className="mt-1 text-[15px] font-semibold text-ink">
                    {cell.value}
                  </p>
                </div>
              ))}
            </div>

            <div>
              <p className="text-[11px] font-semibold tracking-wide text-gray-400 uppercase">
                Notes
              </p>
              <p className="mt-1 text-[15px] text-gray-600">
                {active.note ?? "No notes recorded for this entry."}
              </p>
            </div>
          </div>

          <div className="flex justify-end border-t border-hairline px-8 py-5">
            <button
              type="button"
              onClick={() => setOpenId(null)}
              className="rounded-lg border border-hairline px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
            >
              Close
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
