/**
 * The uppercase-label figure card the accountant's list pages open with.
 *
 * Distinct from the dashboard's `MoneyTile`, which carries a supporting line
 * under the figure — these are a bare count or total, sized to sit four across
 * above a table.
 */
const TONES = {
  ink: { value: "text-ink", border: "border-hairline" },
  green: { value: "text-[#2f9e63]", border: "border-hairline" },
  red: { value: "text-[#e0554d]", border: "border-hairline" },
  amber: { value: "text-[#e8a33d]", border: "border-[#f2e0bd]" },
  blue: { value: "text-[#3b6ea5]", border: "border-[#cddced]" },
} as const;

export type SummaryTone = keyof typeof TONES;

export function SummaryTile({
  label,
  value,
  tone = "ink",
}: {
  label: string;
  value: string;
  tone?: SummaryTone;
}) {
  const styles = TONES[tone];

  return (
    <div
      className={`rounded-lg border bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)] ${styles.border}`}
    >
      <p className="text-[12px] font-medium tracking-wide text-muted uppercase">
        {label}
      </p>
      {/* Steps down on a phone so `LKR 1095K` still fits a half-width tile. */}
      <p
        className={`mt-2.5 text-[22px] leading-none font-bold sm:text-[26px] ${styles.value}`}
      >
        {value}
      </p>
    </div>
  );
}
