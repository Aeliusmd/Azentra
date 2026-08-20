"use client";

/**
 * One record as a stacked row — what the accountant's tables become on a phone.
 *
 * A seven-column bill table cannot be read on a 390px screen, and side-scrolling
 * hides exactly the columns that decide what to tap: the amount and the status.
 * Each list renders this alongside its table — cards below `md`, table above.
 */
export function AccRecordRow({
  id,
  title,
  subtitle,
  status,
  meta = [],
  action,
  onOpen,
}: {
  /** Record reference, shown small alongside the title. */
  id?: string;
  title: string;
  subtitle?: string;
  /** The record's status badge, rendered by the caller. */
  status?: React.ReactNode;
  /** `label: value` pairs shown under the status. */
  meta?: { label: string; value: string }[];
  /**
   * Row action, placed outside the tappable body — a button nested inside the
   * body's button would be invalid markup and unreachable by keyboard.
   */
  action?: React.ReactNode;
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

      {status && <span className="mt-2.5 flex flex-wrap gap-2">{status}</span>}

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

      {action && <div className="px-4 pb-4">{action}</div>}
    </li>
  );
}
