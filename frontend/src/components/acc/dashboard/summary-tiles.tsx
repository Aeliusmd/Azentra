import { Card } from "@/components/ui/card";

/**
 * Money reads by colour before it reads by digit: green is money in, amber is
 * money still owed, ink is a plain fact.
 */
const TONE = {
  ink: "text-ink",
  green: "text-[#2f9e63]",
  amber: "text-[#e8a33d]",
  red: "text-[#e0554d]",
} as const;

export type MoneyTone = keyof typeof TONE;

/** Headline figure with the count that produced it underneath. */
export function MoneyTile({
  label,
  value,
  note,
  tone = "ink",
}: {
  label: string;
  value: string;
  /** What the figure is made of — "320 bills generated". */
  note: string;
  tone?: MoneyTone;
}) {
  return (
    <Card className="p-5">
      <p className="text-[13px] text-muted">{label}</p>
      {/* Steps down on a phone so `LKR 4250K` still fits a half-width tile. */}
      <p
        className={`mt-2.5 text-[22px] leading-none font-bold sm:text-[26px] ${TONE[tone]}`}
      >
        {value}
      </p>
      <p className="mt-2.5 text-[13px] text-muted">{note}</p>
    </Card>
  );
}

/** Thin progress meter used by the collection-rate and budget cards. */
export function Meter({
  value,
  color,
  label,
}: {
  /** 0–100. */
  value: number;
  color: string;
  /** Accessible description of what is being measured. */
  label: string;
}) {
  return (
    <span
      role="img"
      aria-label={`${label}: ${value}%`}
      className="block h-2 overflow-hidden rounded-full bg-gray-100"
    >
      <span
        className="block h-full rounded-full transition-[width] duration-300"
        style={{ width: `${value}%`, background: color }}
      />
    </span>
  );
}

/** `label ......... value` row, as used by both breakdown cards. */
export function StatRow({
  label,
  value,
  tone = "ink",
}: {
  label: string;
  value: string;
  tone?: MoneyTone;
}) {
  return (
    <li className="flex items-center justify-between gap-3">
      <span className="text-[14px] text-gray-600">{label}</span>
      <span className={`text-[15px] font-bold ${TONE[tone]}`}>{value}</span>
    </li>
  );
}
