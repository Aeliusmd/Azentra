import { Panel } from "@/components/so/dashboard/panel";
import { SO_BASE } from "@/lib/so/nav";
import {
  awaitingApproval,
  checkedOut,
  insideProperty,
  type SoVisit,
} from "@/lib/so/visitors-data";

/**
 * Movement at the gate, in three columns.
 *
 * Left to right is the order a guard thinks in: who came in, who has gone, and
 * who is still waiting on a decision. Only the last column is tinted, because
 * it is the only one with something to do.
 */

type Column = {
  heading: string;
  /** Colour of the small caps heading. */
  headingClass: string;
  /** Avatar disc. */
  avatarClass: string;
  /** Row card — the pending column is tinted, the rest are plain. */
  rowClass: string;
  visits: SoVisit[];
  /** The stamp shown against a name. */
  stamp: (visit: SoVisit) => string;
  empty: string;
};

function ActivityRow({
  visit,
  avatarClass,
  rowClass,
  stamp,
}: {
  visit: SoVisit;
  avatarClass: string;
  rowClass: string;
  stamp: string;
}) {
  return (
    <li
      className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 ${rowClass}`}
    >
      <span
        aria-hidden="true"
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold ${avatarClass}`}
      >
        {visit.name.charAt(0)}
      </span>

      <span className="min-w-0">
        <span className="block truncate text-[14px] font-semibold text-ink">
          {visit.name}
        </span>
        <span className="mt-0.5 block text-[12px] text-muted">
          {visit.unit} · {stamp}
        </span>
      </span>
    </li>
  );
}

export function SoVisitorActivity({ visits }: { visits: SoVisit[] }) {
  const columns: Column[] = [
    {
      heading: "Recent check-ins",
      headingClass: "text-green-700",
      avatarClass: "bg-green-50 text-green-700",
      rowClass: "border-hairline bg-white",
      visits: insideProperty(visits),
      stamp: (visit) => visit.checkedInAt ?? "—",
      empty: "Nobody is inside the property.",
    },
    {
      heading: "Recent check-outs",
      headingClass: "text-gray-500",
      avatarClass: "bg-gray-100 text-gray-600",
      rowClass: "border-hairline bg-white",
      visits: checkedOut(visits),
      stamp: (visit) => visit.checkedOutAt ?? "—",
      empty: "No departures logged today.",
    },
    {
      heading: "Pending requests",
      headingClass: "text-amber-600",
      avatarClass: "bg-amber-100 text-amber-700",
      rowClass: "border-amber-200 bg-amber-50/60",
      visits: awaitingApproval(visits),
      stamp: (visit) => visit.expectedAt,
      empty: "Nothing waiting on this desk.",
    },
  ];

  return (
    <Panel title="Visitor Activity" href={`${SO_BASE}/visitors`}>
      <div className="grid gap-5 px-5 pb-5 md:grid-cols-3">
        {columns.map((column) => (
          <div key={column.heading}>
            <h3
              className={`mb-2.5 text-[11px] font-semibold tracking-wide uppercase ${column.headingClass}`}
            >
              {column.heading}
            </h3>

            {column.visits.length === 0 ? (
              <p className="rounded-lg border border-dashed border-hairline px-3 py-4 text-[13px] text-muted">
                {column.empty}
              </p>
            ) : (
              <ul className="space-y-2">
                {column.visits.map((visit) => (
                  <ActivityRow
                    key={visit.id}
                    visit={visit}
                    avatarClass={column.avatarClass}
                    rowClass={column.rowClass}
                    stamp={column.stamp(visit)}
                  />
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </Panel>
  );
}
