"use client";

import { Pill, type PillTone } from "@/components/pm/ui/pill";

/**
 * One record as a stacked row — what the list tables become on a phone.
 *
 * A seven-column table cannot be read on a 390px screen, and side-scrolling a
 * table hides exactly the columns that decide what to tap (status, who has it,
 * when it is booked). Each page renders this alongside its table: cards below
 * `md`, the table above it.
 */
export function FsRecordRow({
  id,
  title,
  subtitle,
  pills = [],
  meta = [],
  onOpen,
}: {
  /** Record reference, shown small alongside the title. */
  id?: string;
  title: string;
  subtitle?: string;
  pills?: { tone: PillTone; label: string }[];
  /** `label: value` pairs shown under the pills. */
  meta?: { label: string; value: string }[];
  onOpen?: () => void;
}) {
  const body = (
    <>
      <span className="flex items-start justify-between gap-3">
        <span className="min-w-0 flex-1">
          <span className="block text-[15px] font-semibold text-ink">
            {title}
          </span>
          {subtitle && (
            <span className="mt-0.5 block truncate text-[13px] text-muted">
              {subtitle}
            </span>
          )}
        </span>
        {id && (
          <span className="shrink-0 font-mono text-[12px] text-gray-400">
            {id}
          </span>
        )}
      </span>

      {pills.length > 0 && (
        <span className="mt-2.5 flex flex-wrap items-center gap-2">
          {pills.map((pill) => (
            <Pill key={pill.label} tone={pill.tone}>
              {pill.label}
            </Pill>
          ))}
        </span>
      )}

      {meta.length > 0 && (
        <span className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-muted">
          {meta.map((entry) => (
            <span key={entry.label}>
              {entry.label}:{" "}
              <span className="font-medium text-ink">{entry.value}</span>
            </span>
          ))}
        </span>
      )}
    </>
  );

  return (
    <li>
      {onOpen ? (
        <button
          type="button"
          onClick={onOpen}
          aria-haspopup="dialog"
          className="flex w-full flex-col px-4 py-4 text-left transition-colors hover:bg-gray-50/70 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
        >
          {body}
        </button>
      ) : (
        <div className="flex flex-col px-4 py-4">{body}</div>
      )}
    </li>
  );
}
