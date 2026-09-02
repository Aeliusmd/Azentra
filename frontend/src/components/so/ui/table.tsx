/**
 * The security portal's table chrome.
 *
 * A guard reads these at a desk, often on a narrow screen, so the shell scrolls
 * the table sideways inside its own card rather than letting the page shift —
 * the sidebar and the header stay where they were put.
 */

export type SoColumn = {
  label: string;
  /** Right-align — used for the action column at the end of a row. */
  align?: "right";
};

export function SoTable({
  columns,
  minWidth = "min-w-[960px]",
  children,
}: {
  columns: SoColumn[];
  /** Below this the card scrolls rather than crushing the cells. */
  minWidth?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-x-auto">
      <table className={`w-full text-left ${minWidth}`}>
        <thead>
          <tr className="border-b border-hairline">
            {columns.map((column) => (
              <th
                key={column.label}
                scope="col"
                className={`px-5 py-3.5 text-[11px] font-semibold tracking-wide text-gray-500 uppercase ${
                  column.align === "right" ? "text-right" : ""
                }`}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-hairline">{children}</tbody>
      </table>
    </div>
  );
}

/** Two stacked lines in one cell — the label above, its qualifier beneath. */
export function SoStackedCell({
  primary,
  secondary,
}: {
  primary: React.ReactNode;
  secondary: React.ReactNode;
}) {
  return (
    <span className="block">
      <span className="block text-[14px] text-ink">{primary}</span>
      <span className="mt-0.5 block text-[12px] text-muted">{secondary}</span>
    </span>
  );
}

/** Empty state shown in place of the table when a filter matches nothing. */
export function SoEmptyRows({ message }: { message: string }) {
  return (
    <div className="px-5 py-14 text-center text-[14px] text-muted">
      {message}
    </div>
  );
}
