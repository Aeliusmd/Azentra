import { Card } from "@/components/ui/card";

/**
 * A table row, folded up for a phone.
 *
 * Every list in this portal is seven-odd columns wide, which on a handset means
 * a table that scrolls sideways and hides the status and the action button off
 * the right edge — the two things a guard on their feet is looking for. Below
 * the table's breakpoint each row becomes one of these instead: the identifying
 * line first, the badges beside it, then the rest as a short list, and the
 * actions full-width at the bottom where a thumb reaches.
 */
export function SoRecordCard({
  eyebrow,
  badges,
  title,
  subtitle,
  body,
  rows,
  actions,
}: {
  /** Small monospaced line above the title — a record id, typically. */
  eyebrow?: string;
  /** Status and severity pills. */
  badges?: React.ReactNode;
  title: string;
  subtitle?: string;
  /** Free text under the title, clamped to two lines. */
  body?: string;
  /** The remaining columns, as label/value pairs. */
  rows: { label: string; value: React.ReactNode }[];
  actions?: React.ReactNode;
}) {
  return (
    <Card className="p-4">
      {(eyebrow || badges) && (
        <div className="flex flex-wrap items-center gap-2">
          {eyebrow && (
            <span className="font-mono text-[12px] text-gray-500">
              {eyebrow}
            </span>
          )}
          {badges}
        </div>
      )}

      <h3
        className={`text-[15px] font-bold text-ink ${
          eyebrow || badges ? "mt-2.5" : ""
        }`}
      >
        {title}
      </h3>
      {subtitle && <p className="mt-0.5 text-[13px] text-muted">{subtitle}</p>}
      {body && (
        <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-muted">
          {body}
        </p>
      )}

      {rows.length > 0 && (
        <dl className="mt-3 space-y-1 border-t border-hairline pt-3 text-[13px]">
          {rows.map((row) => (
            <div key={row.label} className="flex justify-between gap-4">
              <dt className="shrink-0 text-muted">{row.label}</dt>
              <dd className="text-right text-ink">{row.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {actions && <div className="mt-3 flex gap-2">{actions}</div>}
    </Card>
  );
}

/** Full-width action buttons for the foot of a record card. */
export const CARD_ACTION =
  "flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-[13px] font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none";

export const CARD_ACTION_QUIET =
  "flex flex-1 items-center justify-center gap-2 rounded-md border border-hairline bg-white px-4 py-2 text-[13px] font-medium text-ink transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none";
